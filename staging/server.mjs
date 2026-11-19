// Staging gate: serves a static site behind one shared access code.
// No dependencies. Not a security boundary for real data: it keeps a
// preview out of search engines and away from casual visitors.
//
// Environment:
//   ACCESS_CODE   required. The shared code visitors type.
//   SITE_NAME     shown on the access page. Default "Spur preview".
//   ROOT          folder to serve. Default "./site".
//   PORT          default 8080.
//   ENTRY         path "/" redirects to. Default none (serves index.html).
import { createServer } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

const CODE = process.env.ACCESS_CODE || "";
const SITE = process.env.SITE_NAME || "Spur preview";
const ROOT = resolve(process.env.ROOT || "./site");
const PORT = Number(process.env.PORT || 8080);
const ENTRY = process.env.ENTRY || "";
const COOKIE = "spur_gate";
const MAX_AGE = 60 * 60 * 24 * 30;

if (!CODE) {
  console.error("ACCESS_CODE is not set. Refusing to start an open preview.");
  process.exit(1);
}

const token = createHmac("sha256", CODE).update("spur-gate-v1").digest("hex");

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".woff": "font/woff", ".pdf": "application/pdf",
  ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8",
  ".mp4": "video/mp4", ".webmanifest": "application/manifest+json",
};

const same = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
};

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const hasPass = (req) =>
  (req.headers.cookie || "").split(";").some((part) => {
    const [k, v] = part.trim().split("=");
    return k === COOKIE && v && same(v, token);
  });

// Only same-site relative paths are accepted as a return target.
const safeNext = (n) => (typeof n === "string" && /^\/(?!\/)[^\\]*$/.test(n) ? n : "/");

const readBody = (req, limit = 16384) => new Promise((ok, fail) => {
  let size = 0; const chunks = [];
  req.on("data", (c) => {
    size += c.length;
    if (size > limit) { fail(new Error("too large")); req.destroy(); } else chunks.push(c);
  });
  req.on("end", () => ok(Buffer.concat(chunks).toString("utf8")));
  req.on("error", fail);
});

const accessPage = (next, failed) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(SITE)} · Access code</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
    background: #fcf9f5; color: #142327;
    font: 16px/1.5 "Atkinson Hyperlegible Next", "Atkinson Hyperlegible", system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { width: min(420px, calc(100% - 48px)); background: #fff; border: 1px solid #e3dfd7;
    border-radius: 14px; padding: 32px; box-shadow: 0 10px 30px rgba(31, 42, 55, .08); }
  h1 { font: 600 24px/1.25 Literata, Georgia, serif; margin: 0 0 8px; }
  p { margin: 0 0 20px; color: #4f5e62; }
  label { display: block; font-weight: 600; margin-bottom: 6px; }
  input { width: 100%; box-sizing: border-box; padding: 12px 14px; font: inherit;
    border: 1px solid #7d888b; border-radius: 8px; }
  input:focus-visible, button:focus-visible { outline: 3px solid #f5b33b; outline-offset: 2px; }
  button { margin-top: 16px; width: 100%; padding: 12px 14px; font: inherit; font-weight: 600;
    color: #fff; background: #34474b; border: 0; border-radius: 8px; cursor: pointer; }
  .err { color: #a5342b; font-weight: 600; margin: 12px 0 0; }
  small { display: block; margin-top: 20px; color: #4f5e62; }
</style></head><body><main>
<h1>${esc(SITE)}</h1>
<p>This is a private preview. Enter the access code you were given.</p>
<form method="post" action="/__gate">
  <input type="hidden" name="next" value="${esc(next)}">
  <label for="code">Access code</label>
  <input id="code" name="code" type="password" autocomplete="off" autofocus required>
  ${failed ? '<p class="err" role="alert">That code did not match. Try again.</p>' : ""}
  <button type="submit">Continue</button>
</form>
<small>Preview content. Sample data only.</small>
</main></body></html>`;

const base = { "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff" };

const attempts = new Map(); // ip -> { n, at }
const tooMany = (ip) => {
  const now = Date.now(), rec = attempts.get(ip);
  if (!rec || now - rec.at > 10 * 60 * 1000) { attempts.set(ip, { n: 1, at: now }); return false; }
  rec.n += 1; return rec.n > 30;
};

async function fileFor(urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath); } catch { return null; }
  const full = normalize(join(ROOT, p));
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null;
  const tries = [full];
  if (!extname(full)) tries.push(full + ".html", join(full, "index.html"));
  for (const t of tries) {
    try { const s = await stat(t); if (s.isFile()) return t; } catch { /* next */ }
  }
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  const ip = (req.headers["fly-client-ip"] || req.socket.remoteAddress || "").toString();

  if (url.pathname === "/__health") { res.writeHead(200, base).end("ok"); return; }
  if (url.pathname === "/robots.txt") {
    res.writeHead(200, { ...base, "Content-Type": "text/plain" }).end("User-agent: *\nDisallow: /\n");
    return;
  }

  if (url.pathname === "/__gate" && req.method === "POST") {
    let form;
    try { form = new URLSearchParams(await readBody(req)); }
    catch { res.writeHead(413, base).end(); return; }
    const next = safeNext(form.get("next"));
    if (tooMany(ip) || !same(form.get("code") || "", CODE)) {
      await new Promise((r) => setTimeout(r, 600));
      res.writeHead(401, { ...base, "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" })
        .end(accessPage(next, true));
      return;
    }
    const secure = req.headers["x-forwarded-proto"] === "https" ? "; Secure" : "";
    res.writeHead(303, {
      ...base, Location: next,
      "Set-Cookie": `${COOKIE}=${token}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; SameSite=Lax${secure}`,
    }).end();
    return;
  }

  if (!hasPass(req)) {
    res.writeHead(401, { ...base, "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" })
      .end(accessPage(safeNext(url.pathname + url.search), false));
    return;
  }

  // Preview-only form sink. Entries go to the app log; nothing is emailed.
  if (url.pathname === "/__lead" && req.method === "POST") {
    try {
      const raw = await readBody(req);
      const data = Object.fromEntries(new URLSearchParams(raw));
      console.log("PREVIEW_LEAD " + JSON.stringify({ at: new Date().toISOString(), ...data }));
      res.writeHead(200, { ...base, "Content-Type": "application/json" }).end('{"ok":true,"preview":true}');
    } catch { res.writeHead(400, base).end(); }
    return;
  }

  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405, base).end(); return; }
  if (url.pathname === "/" && ENTRY) { res.writeHead(302, { ...base, Location: ENTRY }).end(); return; }

  let file = await fileFor(url.pathname);
  let status = 200;
  if (!file) { file = await fileFor("/404.html"); status = 404; }
  if (!file) { res.writeHead(404, { ...base, "Content-Type": "text/plain" }).end("Not found"); return; }
  const body = await readFile(file);
  const type = TYPES[extname(file).toLowerCase()] || "application/octet-stream";
  res.writeHead(status, {
    ...base, "Content-Type": type, "Content-Length": body.length,
    "Cache-Control": type.startsWith("text/html") ? "no-cache" : "public, max-age=300",
  });
  res.end(req.method === "HEAD" ? undefined : body);
}).listen(PORT, "0.0.0.0", () => console.log(`${SITE}: serving ${ROOT} on :${PORT}`));

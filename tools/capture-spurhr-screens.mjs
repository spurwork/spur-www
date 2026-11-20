// Captures product screens from a locally served SpurHR sandbox build.
// usage: node capture.mjs <baseUrl> <outDir>
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const [base = 'http://localhost:8120', out = 'tools/spurhr-raw'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const screens = [
  ['home', null, 'Home'],
  ['job-postings', 'Hiring', 'Job postings'],
  ['candidates', 'Hiring', 'Candidates'],
  ['offers', 'Hiring', 'Offers'],
  ['onboarding', 'People', 'Onboarding'],
  ['performance', 'People', 'Performance'],
  ['policies', 'People', 'Policies'],
  ['coverage', 'Time & pay', 'Coverage'],
  ['payroll', 'Time & pay', 'Payroll'],
];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
// VIEW=1120x700 gives larger, more legible UI for screens shown beside text.
const [vw, vh] = (process.env.VIEW || '1360x850').split('x').map(Number);
const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.route('**/sandbox-guard.js', r => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
await page.goto(base + '/Main.dc.html', { waitUntil: 'load' });
await page.waitForTimeout(2500);
// Hide the prototype-only chrome so the screen looks as a school would see it.
const tools = page.getByRole('switch', { name: /Prototype tools/i }).first();
if (await tools.count()) await tools.click(); else { await page.mouse.click(700, 500); await page.keyboard.press('Shift+P'); }
await page.waitForTimeout(500);
const hideTools = () => page.evaluate(() => { for (const b of document.querySelectorAll('button')) if (/Show prototype tools/i.test(b.textContent)) b.style.visibility = 'hidden'; });
const side = page.locator('aside, nav').first();
for (const [name, group, label] of screens) {
  try {
    if (group) {
      const item = page.locator('aside a, aside button, nav a, nav button').filter({ hasText: new RegExp('^' + label + '(\\s*\\d+)?$') }).first();
      if (!(await item.isVisible().catch(() => false))) {
        await page.locator('aside button, nav button').filter({ hasText: new RegExp('^' + group.replace('&', '&') + '(\\s*\\d+)?$') }).first().click();
        await page.waitForTimeout(250);
      }
      await item.click();
    } else {
      await page.locator('aside a, aside button, nav a, nav button').filter({ hasText: new RegExp('^' + label + '(\\s*\\d+)?$') }).first().click();
    }
    await page.waitForTimeout(700);
    await page.mouse.move(vw - 200, vh - 4);
    await hideTools();
    await page.screenshot({ path: `${out}/${name}.png` });
    console.log('ok', name, await page.title());
  } catch (e) { console.log('FAIL', name, String(e).slice(0, 160)); }
}
await browser.close();

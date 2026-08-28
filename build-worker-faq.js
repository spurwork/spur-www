const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');
const { marked } = require('marked');

const ROOT = __dirname;
const CONTENT_DIR = path.join(ROOT, 'worker-faq', 'content');
const OUTPUT_FILE = path.join(ROOT, 'worker-support.html');

const GROUPS = [
  { id: 'jobs', label: 'Jobs & scheduling', description: 'Finding work, taking jobs, timekeeping, and cancellations.' },
  { id: 'onboarding', label: 'Getting started', description: 'Onboarding, eligibility, identity documents, and background checks.' },
  { id: 'payroll', label: 'Pay & benefits', description: 'Paydays, direct deposit, taxes, benefits, leave, and garnishments.' },
  { id: 'account', label: 'Profile & account', description: 'Passwords, profile details, photos, and work history.' },
  { id: 'teams', label: 'Teams', description: 'How teams work and how they unlock job opportunities.' },
  { id: 'training', label: 'Training & qualifications', description: 'General qualification, document, and training guidance.' },
  { id: 'requirements', label: 'State & district requirements', description: 'Detailed licenses, checks, tests, and workplace-specific steps.' },
  { id: 'safety', label: 'Safety & injury reporting', description: 'Workplace safety and what to do after an injury.' },
  { id: 'policies', label: 'Rules & policies', description: 'Attendance, conduct, and disciplinary expectations.' },
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function slugify(value) {
  return value.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function plainText(value) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[*_#>`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function groupFor(filePath, category) {
  const normalized = category.toLowerCase();
  const isReference = filePath.includes(`${path.sep}reference${path.sep}`);

  if (normalized.includes('injury') || normalized.includes('safety')) return 'safety';
  if (normalized.includes('rule') || normalized.includes('polic')) return 'policies';
  if (normalized.includes('payroll') || normalized.includes('benefit')) return 'payroll';
  if (normalized.includes('profile') || normalized.includes('account')) return 'account';
  if (normalized === 'teams') return 'teams';
  if (normalized === 'jobs' || normalized.includes('viewing your jobs')) return 'jobs';
  if (normalized.includes('onboarding')) return 'onboarding';
  if (normalized.includes('qualification') && isReference) return 'requirements';
  if (normalized.includes('qualification') || normalized.includes('training')) return 'training';
  return 'onboarding';
}

function externalizeLinks(html) {
  return html.replace(/<a href="(https?:\/\/[^\"]+)"/g, '<a target="_blank" rel="noopener noreferrer" href="$1"');
}

function loadItems() {
  const seenIds = new Set();
  return walk(CONTENT_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(file, 'utf8');
      const parsed = frontMatter(raw);
      const title = String(parsed.attributes.title || path.basename(file, '.md'));
      const category = String(parsed.attributes.category || 'Getting started');
      const group = groupFor(file, category);
      const sourceType = file.includes(`${path.sep}core${path.sep}`) ? 'core' : 'guide';
      let id = `${group}-${slugify(title)}`;
      let suffix = 2;
      while (seenIds.has(id)) id = `${group}-${slugify(title)}-${suffix++}`;
      seenIds.add(id);

      return {
        id,
        title,
        category,
        group,
        sourceType,
        review: parsed.attributes.review === true,
        notice: String(parsed.attributes.notice || ''),
        markdown: parsed.body.trim(),
        html: externalizeLinks(marked.parse(parsed.body.trim(), { gfm: true })),
        searchText: plainText(`${title} ${category} ${parsed.attributes.notice || ''} ${parsed.body}`).toLowerCase(),
      };
    })
    .sort((a, b) => {
      if (a.sourceType !== b.sourceType) return a.sourceType === 'core' ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
}

function getSharedElement(tagName) {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const match = html.match(new RegExp(`<${tagName}[\\s\\S]*?<\\/${tagName}>`));
  return match ? match[0] : '';
}

function build() {
  const items = loadItems();
  const nav = getSharedElement('nav');
  const footer = getSharedElement('footer');
  const counts = Object.fromEntries(GROUPS.map((group) => [group.id, items.filter((item) => item.group === group.id).length]));

  const filters = GROUPS.filter((group) => counts[group.id] > 0).map((group) => `
    <button class="faq-filter" type="button" data-filter="${group.id}" aria-pressed="false">
      <span>${escapeHtml(group.label)}</span><span class="faq-filter-count">${counts[group.id]}</span>
    </button>`).join('');

  const sections = GROUPS.filter((group) => counts[group.id] > 0).map((group) => {
    const groupItems = items.filter((item) => item.group === group.id);
    const cards = groupItems.map((item) => `
      <details class="worker-faq-item" id="${item.id}" data-group="${item.group}" data-search="${escapeHtml(item.searchText)}">
        <summary>
          <span class="worker-faq-question">${escapeHtml(item.title)}</span>
          <span class="worker-faq-kind${item.review ? ' review' : ''}">${item.review ? 'Confirm current process' : (item.sourceType === 'core' ? 'Quick answer' : 'Detailed guide')}</span>
          <span class="worker-faq-chevron" aria-hidden="true"></span>
        </summary>
        <div class="worker-faq-answer">
          ${item.notice ? `<div class="faq-source-note"><strong>Before you rely on this</strong><p>${escapeHtml(item.notice)}</p></div>` : ''}
          ${item.html}
          <button class="faq-copy-link" type="button" data-copy-link="${item.id}">Copy link to this answer</button>
        </div>
      </details>`).join('');

    return `
    <section class="worker-faq-section" id="section-${group.id}" data-section="${group.id}">
      <div class="worker-faq-section-heading">
        <div>
          <p class="worker-faq-section-kicker">${counts[group.id]} ${counts[group.id] === 1 ? 'topic' : 'topics'}</p>
          <h2>${escapeHtml(group.label)}</h2>
          <p>${escapeHtml(group.description)}</p>
        </div>
      </div>
      <div class="worker-faq-list">${cards}
      </div>
    </section>`;
  }).join('\n');

  const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; frame-ancestors 'none';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Worker Support & FAQ | Spur</title>
  <meta name="description" content="Search Spur worker help for jobs, onboarding, pay, benefits, qualifications, account support, safety, and workplace policies.">
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="https://spureducation.com/worker-support.html">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://spureducation.com/worker-support.html">
  <meta property="og:title" content="Worker Support & FAQ | Spur">
  <meta property="og:description" content="Fast answers for Spur workers, from taking jobs and getting paid to qualifications and workplace support.">
  <meta property="og:site_name" content="Spur">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Worker Support & FAQ | Spur">
  <meta name="twitter:description" content="Fast answers for Spur workers, from taking jobs and getting paid to qualifications and workplace support.">
  <link rel="icon" type="image/png" href="spur-favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css?v=3">
  <link rel="stylesheet" href="css/worker-faq.css?v=1">
  <script>(function(){var t=localStorage.getItem('spur-theme')||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t)})()</script>
</head>
<body>
  ${nav}

  <main class="worker-support-page">
    <header class="worker-support-hero">
      <div class="worker-support-hero-inner">
        <p class="worker-support-eyebrow">Spur worker help center</p>
        <h1>What can we help you <span class="serif">figure out?</span></h1>
        <p class="worker-support-intro">Search ${items.length} answers covering jobs, onboarding, pay, benefits, qualifications, safety, and more.</p>
        <div class="worker-faq-search-wrap">
          <label class="sr-only" for="worker-faq-search">Search worker support</label>
          <span class="worker-faq-search-icon" aria-hidden="true"></span>
          <input id="worker-faq-search" type="search" autocomplete="off" placeholder="Search worker support…">
          <button id="worker-faq-clear" type="button" hidden>Clear</button>
          <span class="worker-faq-shortcut" aria-hidden="true">/</span>
        </div>
        <div class="worker-support-popular" aria-label="Popular searches">
          <span>Popular:</span>
          <button type="button" data-search-suggestion="payday">Payday</button>
          <button type="button" data-search-suggestion="clock in">Clock in</button>
          <button type="button" data-search-suggestion="W-2">W-2</button>
          <button type="button" data-search-suggestion="background check">Background checks</button>
        </div>
      </div>
    </header>

    <section class="worker-support-emergency" aria-label="Urgent injury help">
      <div>
        <span class="worker-support-emergency-mark" aria-hidden="true">!</span>
        <div>
          <strong>Injured at work?</strong>
          <span>For a life-threatening emergency, call 911. Otherwise, notify Spur immediately.</span>
        </div>
      </div>
      <a href="tel:12563678402">Call Spur: (256) 367-8402</a>
    </section>

    <div class="worker-faq-layout">
      <aside class="worker-faq-sidebar" aria-label="FAQ categories">
        <p class="worker-faq-sidebar-title">Browse by topic</p>
        <button class="faq-filter active" type="button" data-filter="all" aria-pressed="true">
          <span>All topics</span><span class="faq-filter-count">${items.length}</span>
        </button>${filters}
        <div class="worker-faq-sidebar-note">
          <strong>Process details can change.</strong>
          <span>If the app or your workplace gives different instructions, follow those instructions or contact Spur Support.</span>
        </div>
      </aside>

      <div class="worker-faq-results">
        <div class="worker-faq-toolbar">
          <p id="worker-faq-status" aria-live="polite">Showing all ${items.length} topics</p>
          <div>
            <button id="worker-faq-expand" type="button">Expand visible</button>
            <button id="worker-faq-collapse" type="button">Collapse all</button>
          </div>
        </div>
        <div id="worker-faq-sections">${sections}
        </div>
        <div id="worker-faq-empty" class="worker-faq-empty" hidden>
          <span aria-hidden="true">?</span>
          <h2>No answers found</h2>
          <p>Try a shorter search or browse another category.</p>
          <button type="button" data-reset-faq>Show all topics</button>
        </div>
      </div>
    </div>

    <section class="worker-support-contact">
      <div>
        <p class="worker-support-eyebrow">Still need a hand?</p>
        <h2>Talk with the Spur Support team.</h2>
        <p>Send the details of what you are seeing and we will help point you in the right direction.</p>
      </div>
      <div class="worker-support-contact-actions">
        <a class="btn btn-primary" href="contact-support.html">Contact Support</a>
        <a class="btn btn-secondary" href="mailto:support@spurstaffing.com">support@spurstaffing.com</a>
      </div>
    </section>
  </main>

  ${footer}
  <script src="js/main.js"></script>
  <script src="js/worker-faq.js"></script>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_FILE, page);
  console.log(`Built ${path.basename(OUTPUT_FILE)} with ${items.length} topics across ${GROUPS.length} categories.`);
}

build();

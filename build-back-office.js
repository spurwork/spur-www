const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Build options.
//   STAGING=1   adds the review ribbon, reviewer notes and content that still needs sign-off.
//   OUT_DIR     where pages are written. Default: the repository root, which GitHub Pages publishes.
//   LEAD_ENDPOINT, SANDBOX_URL   optional overrides for the Spur HR tour and demo forms.
const STAGING = process.env.STAGING === '1';
const OUT_DIR = process.env.OUT_DIR ? path.resolve(process.env.OUT_DIR) : ROOT;
const STAFFING_URL = 'https://spurstaffing.com/';
// Where the tour and demo forms post. Empty means the form opens a pre-addressed email instead.
const LEAD_ENDPOINT = process.env.LEAD_ENDPOINT || '';
const LEAD_EMAIL = 'support@spured.com';
const SANDBOX_URL = process.env.SANDBOX_URL || '';

// A reviewer note. Emitted only in a STAGING build, never on the public site.
const note = text => STAGING ? `<p class="preview-note"><b>Preview note.</b> ${text}</p>` : '';

const services = [
  {
    slug: 'finance-accounting',
    short: 'FA',
    name: 'Finance & Accounting',
    comingSoon: true,
    eyebrow: 'A steadier business office',
    headline: 'Clean books. Clear decisions. No scramble.',
    lede: 'Spur will handle the recurring financial work that keeps a school running and deliver accurate, decision-ready work on a dependable schedule.',
    cardCopy: 'Reliable financial operations and reporting, handled for you.',
    audience: 'For schools and districts that want a stronger financial function without adding another full-time role.',
    services: [
      ['Monthly close', 'Bank reconciliations, transaction review, and a dependable closing rhythm.'],
      ['Accounts payable', 'Invoice intake, coding, approval routing, vendor payments, and clean records.'],
      ['Payroll support', 'Processing coordination and benefits reconciliation without losing the human review.'],
      ['Board financials', 'Decision-ready reporting, cash forecasting, and clear explanations for leadership.'],
      ['Grant accounting', 'Allowable-cost tracking and reconciliation across restricted funding sources.'],
      ['Audit readiness', 'Organized support, schedules, and records for annual audits and state reporting.']
    ],
    owns: ['Recurring processing and reconciliation', 'Draft reporting and financial packages', 'Follow-up on missing or unclear items', 'An agreed monthly service calendar'],
    schoolOwns: ['Final approvals and fiduciary decisions', 'Banking authority and access decisions', 'Policy decisions and board governance', 'Providing complete, timely source information'],
    serviceLead: 'A finance team that knows schools',
    serviceLeadCopy: 'You get responsive, knowledgeable support from people who understand school finance and can explain the numbers clearly.',
    faqs: [
      ['Does Spur replace our auditor?', 'No. Spur prepares the books and supporting records, while an independent auditor performs the audit.'],
      ['Do we have to change accounting software?', 'The goal is to work with the tools you already use wherever practical. Any required change is identified during the initial assessment, before launch.'],
      ['Who approves payments and financial statements?', 'Your designated school leaders retain approval authority. Spur prepares, routes, reconciles, and follows up on anything that needs attention.'],
      ['Can you support restricted funds and grants?', 'Grant accounting is part of the proposed scope. The exact funds, reporting requirements, and division of responsibility are documented before service begins.']
    ]
  }
];

// Offers listed by what they do, each linking to the product or page behind it.
function solutionsMenu() {
  const items = [
    ['hr.html', 'HR', 'HR and recruiting', 'SpurHR', false],
    [STAFFING_URL, 'ST', 'Staffing', 'Spur Staffing ↗', true],
    ['finance-accounting.html', 'FA', 'Finance and accounting', 'Coming soon', false]
  ];
  return items.map(([href, short, name, sub, external]) => `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}><span class="menu-icon">${short}</span><span><strong>${name}</strong><small>${sub}</small></span></a>`).join('');
}

function header(current = '', product = '') {
  const currentAttr = key => current === key ? ' aria-current="page"' : '';
  const brand = product === 'hr'
    ? '<a class="brand product" href="hr.html" aria-label="Spur HR"><img src="brand/spur-hr-logo.svg" alt="Spur HR" width="152" height="32"></a>'
    : '<a class="brand" href="index.html" aria-label="Spur home"><img src="brand/spur-logo.svg" alt="Spur" width="110" height="32"></a>';
  return `<header class="site-header">
    <div class="shell nav-wrap">
      ${brand}
      <button class="mobile-toggle" type="button" aria-label="Open navigation" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
      <nav class="primary-nav" aria-label="Primary navigation">
        <a href="hr.html"${currentAttr('hr')}>SpurHR</a>
        <div class="nav-services">
          <button type="button" aria-expanded="false">Solutions <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 6 5 5 5-5"/></svg></button>
          <div class="service-menu">${solutionsMenu()}</div>
        </div>
        <a href="why-spur.html"${currentAttr('why')}>Why Spur</a>
        <a href="about.html"${currentAttr('about')}>About</a>
        <a class="nav-cta" href="${product === 'hr' ? 'hr-tour.html' : 'contact-sales.html'}"${currentAttr(product === 'hr' ? 'tour' : 'contact')}>${product === 'hr' ? 'Take the tour' : 'Talk to Spur'}</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="shell">
      <div class="footer-grid">
        <div class="footer-brand"><img src="brand/spur-logo-reversed.svg" alt="Spur" width="110" height="32"><p>Spend less on the back office. Invest more in the classroom.</p></div>
        <div class="footer-col"><strong>Solutions</strong><a href="hr.html">SpurHR</a><a href="${STAFFING_URL}" target="_blank" rel="noopener">Spur Staffing</a>${services.map(s => `<a href="${s.slug}.html">${s.name}</a>`).join('')}</div>
        <div class="footer-col"><strong>Company</strong><a href="why-spur.html">Why Spur</a><a href="about.html">About</a><a href="https://jobs.spureducation.com/" target="_blank" rel="noopener">Jobs</a></div>
        <div class="footer-col"><strong>Help</strong><a href="hr-tour.html">Tour SpurHR</a><a href="contact-sales.html">Talk to sales</a><a href="contact-support.html">Customer support</a><a href="worker-support.html">Worker support</a></div>
      </div>
      <div class="footer-bottom"><span>© 2026 Spur. All rights reserved.</span><span class="footer-legal"><a href="privacy-policy.html">Privacy</a><a href="terms-of-service.html">Terms</a><a href="accessibility.html">Accessibility</a></span></div>
    </div>
  </footer>`;
}

function page({ title, description, current, body, canonical, product }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://spureducation.com/${canonical || ''}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://spureducation.com/${canonical || ''}">
  ${STAGING ? '<meta name="robots" content="noindex, nofollow">' : ''}
  <link rel="icon" type="image/svg+xml" href="brand/favicon.svg">
  <link rel="alternate icon" type="image/png" href="spur-favicon.png">
  <link rel="preload" href="fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/literata-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="css/back-office.css?v=5">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${STAGING ? '<div class="preview-ribbon" role="note">Preview for review. Not public. Boxes marked “Preview note” are questions for the Spur team, not site content.</div>' : ''}
  ${header(current, product)}
  <main id="main">${body}</main>
  ${footer()}
  <script src="js/back-office.js?v=5"></script>
</body>
</html>`;
}

function serviceCards() {
  return services.map((s, i) => `<a class="service-card" href="${s.slug}.html"><span class="service-card-top"><span class="service-number">0${i + 1}</span><span class="availability-badge${s.comingSoon ? '' : ' available'}">${s.comingSoon ? 'Coming soon' : 'Available now'}</span></span><h3>${s.name}</h3><p>${s.cardCopy}</p><span class="card-link">${s.comingSoon ? 'See what’s coming' : 'Explore the service'} →</span></a>`).join('');
}

const home = page({
  title: 'Spur | Spend less on the back office. Invest more in the classroom.',
  description: 'Spur builds software and services that take administrative work off school teams: SpurHR, the HR system that does the work, and Spur Staffing.',
  body: `<section class="home-hero"><div class="shell home-hero-grid"><div class="home-hero-copy"><span class="eyebrow">Spur for schools</span><h1>Spend less on the back office. Invest more in <span class="serif">the classroom.</span></h1><p class="lede">Spur takes administrative work off school teams. We have staffed schools for more than a decade. Now SpurHR puts that experience into one HR system that does the work.</p><div class="hero-actions"><a class="button" href="hr.html">See SpurHR →</a><a class="button secondary" href="contact-sales.html">Talk to Spur</a></div></div><figure class="shot"><div class="shot-bar" aria-hidden="true"><i></i><i></i><i></i></div><img src="images/spurhr/home.webp" alt="SpurHR home screen for a network HR director. A list titled Waiting on you shows eight items, each with a status and an Open button." width="1600" height="1000" fetchpriority="high"><figcaption>SpurHR, from the prototype. Sample data.</figcaption></figure></div></section>
  <section class="section paper" id="solutions"><div class="shell"><div class="section-head wide"><span class="eyebrow">Solutions</span><h2>One Spur. Pick the work you want <span class="serif">off your plate.</span></h2></div><div class="solution-list"><a class="solution lead" href="hr.html"><div class="solution-name"><span class="solution-kicker">HR and recruiting</span><img src="brand/spur-hr-logo.svg" alt="Spur HR" width="143" height="30"></div><p>The HR system that does the work. Applicant tracking, HR records, payroll and performance management in one place. Your people make the call.</p><span class="solution-meta"><span class="tag jan">First release January 2027</span><span class="card-link">See SpurHR →</span></span></a><a class="solution" href="${STAFFING_URL}" target="_blank" rel="noopener"><div class="solution-name"><span class="solution-kicker">Staffing</span><strong>Spur Staffing</strong></div><p>Substitute teachers and school support staff, recruited, screened, trained and paid by Spur.</p><span class="solution-meta"><span class="tag">Available now</span><span class="card-link">Visit spurstaffing.com ↗</span></span></a><a class="solution" href="finance-accounting.html"><div class="solution-name"><span class="solution-kicker">Finance and accounting</span><strong>Spur Finance</strong></div><p>Day-to-day accounting, monthly close and reporting your leaders can use.</p><span class="solution-meta"><span class="availability-badge">Coming soon</span><span class="card-link">See what’s coming →</span></span></a></div>${note('This answers Abigail’s brand question on the page: one Spur, with offers named by what they do and the product behind each. Spur Staffing keeps its own site and look. “Spur Finance” follows the Spur | HR, Spur | Finance naming Glenn set; the page behind it still says Finance & Accounting. “More than a decade” is existing site copy, and Abigail’s note says 7+ years. Confirm one figure.')}</div></section>
  <section class="section navy" id="how-it-works"><div class="shell"><div class="section-head"><span class="eyebrow">Why schools work with Spur</span><h2>We know the work because we have <span class="serif">done the work.</span></h2></div><div class="promise-grid"><div class="promise-item"><h3>We understand schools</h3><p>We know the pace, pressure, and responsibility that come with serving educators.</p></div><div class="promise-item"><h3>We own the outcome</h3><p>We take responsibility for the work instead of adding more to your team.</p></div><div class="promise-item"><h3>We show up</h3><p>Responsive communication and reliable follow-through are part of the service.</p></div></div></div></section>
  <section class="cta-band"><div class="shell cta-grid"><div><h2>Let’s take something off your team’s plate.</h2><p>Tour SpurHR on your own, or tell us where the work is piling up.</p></div><div class="cta-actions"><a class="button light" href="hr-tour.html">Tour SpurHR →</a><a class="button secondary" href="contact-sales.html">Start a conversation</a></div></div></section>`
});

function serviceBody(s) {
  const actionLabel = s.comingSoon ? `Get updates on ${s.name}` : `Talk about ${s.name}`;
  const ctaHeadline = s.comingSoon ? `${s.name} is coming soon.` : `Let’s talk about ${s.name.toLowerCase()}.`;
  const ctaCopy = s.comingSoon ? 'Tell us you’re interested and we’ll keep you informed as the service takes shape.' : 'We’ll look at what your team carries today and tell you where Spur could make the biggest difference.';
  return `<section class="page-hero"><div class="shell page-hero-grid"><div><div class="service-status-row"><span class="eyebrow">${s.eyebrow}</span><span class="availability-badge${s.comingSoon ? '' : ' available'}">${s.comingSoon ? 'Coming soon' : 'Available now'}</span></div><h1>${s.headline}</h1><p>${s.lede}</p><div class="hero-actions"><a class="button" href="contact-sales.html?service=${s.slug}">${actionLabel} →</a><a class="button secondary" href="#scope">See the scope</a></div></div><aside class="scope-card"><span>Designed for</span><strong>${s.audience}</strong><p>${s.comingSoon ? 'We’re shaping the service around clear responsibilities, approvals, deliverables, and timing.' : 'We agree on responsibilities, approvals, deliverables, and timing before the service begins.'}</p></aside></div></section>
  <section class="section paper" id="scope"><div class="shell"><div class="section-head"><span class="eyebrow">What Spur can handle</span><h2>Recurring work, <span class="serif">owned end to end.</span></h2><p>We tailor the service to your school and make the responsibilities clear before we begin.</p></div><div class="work-grid">${s.services.map((item, i) => `<div class="work-card"><span class="icon-tile">${String(i + 1).padStart(2, '0')}</span><h3>${item[0]}</h3><p>${item[1]}</p></div>`).join('')}</div></div></section>
  <section class="section navy"><div class="shell"><div class="section-head"><span class="eyebrow">Clear lines of responsibility</span><h2>Spur runs the work. <span class="serif">The school keeps authority.</span></h2></div><div class="boundary-grid"><div class="boundary-card"><h3>Spur owns</h3><ul>${s.owns.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="boundary-card"><h3>Your school owns</h3><ul>${s.schoolOwns.map(x => `<li>${x}</li>`).join('')}</ul></div></div></div></section>
  <section class="section"><div class="shell split"><div class="split-copy"><span class="eyebrow">Service that feels different</span><h2>${s.serviceLead}</h2><p>${s.serviceLeadCopy}</p><a class="button secondary" href="why-spur.html">Why schools choose Spur →</a></div><div class="steps"><div class="step"><span class="step-num">A</span><div><h3>You always know what is happening</h3><p>We communicate clearly, follow through, and stay easy to reach.</p></div></div><div class="step"><span class="step-num">B</span><div><h3>Questions get answered</h3><p>When something needs attention, we take ownership and help move it forward.</p></div></div><div class="step"><span class="step-num">C</span><div><h3>Work arrives ready to use</h3><p>What we deliver is complete, clear, and prepared for the people who need it.</p></div></div></div></div></section>
  <section class="section paper"><div class="shell"><div class="section-head"><span class="eyebrow">Questions to ask</span><h2>Straight answers, <span class="serif">before you start.</span></h2></div><div class="faq-list">${s.faqs.map((f, i) => `<div class="faq-item"><button type="button" aria-expanded="false" aria-controls="faq-${s.slug}-${i}"><span>${f[0]}</span><span aria-hidden="true">+</span></button><div class="faq-answer" id="faq-${s.slug}-${i}"><p>${f[1]}</p></div></div>`).join('')}</div></div></section>
  <section class="cta-band"><div class="shell cta-grid"><div><h2>${ctaHeadline}</h2><p>${ctaCopy}</p></div><a class="button light" href="contact-sales.html?service=${s.slug}">${s.comingSoon ? 'Keep me informed' : 'Talk to Spur'} →</a></div></section>`;
}

const about = page({
  title: 'About Spur | School Back-Office Operations',
  description: 'Spur is a school-operations company built to carry essential back-office work so educators can focus on students.',
  current: 'about', canonical: 'about.html',
  body: `<section class="page-hero"><div class="shell statement"><span class="eyebrow">About Spur</span><h1>Built inside schools. Focused on the work behind them.</h1><p>For more than a decade, Spur has handled the people and staffing work schools depend on: recruiting, screening, credentialing, onboarding, scheduling, payroll, and support. SpurHR now brings that experience to a school’s own HR office, and Spur Staffing continues to place substitutes and support staff.</p></div></section>
  <section class="section paper"><div class="shell split"><div class="split-copy"><span class="eyebrow">Our mission</span><h2>We run the back office so schools can run the classroom.</h2></div><div class="statement"><p>Schools are asked to do more with less, while the administrative work keeps growing. We believe the answer is a capable partner who owns the work and delivers the outcome.</p><p>That is the company Spur is building: experienced school operators delivering essential services with consistency, responsiveness, and care.</p></div></div></section>
  <section class="section"><div class="shell"><div class="section-head"><span class="eyebrow">How we show up</span><h2>A partner schools can <span class="serif">count on.</span></h2></div><div class="principles"><div class="principle"><h3>Supportive</h3><p>We reduce the load and make it easier for people to do their best work.</p></div><div class="principle"><h3>Authentic</h3><p>We say what is true, including where the boundaries and tradeoffs are.</p></div><div class="principle"><h3>Knowledgeable</h3><p>We bring school context, sound judgment, and deep knowledge of the work.</p></div><div class="principle"><h3>Respectful</h3><p>We protect people’s time, authority, and responsibility for their schools.</p></div></div></div></section>
  <section class="section navy"><div class="shell quote-block"><div class="quote-mark">“</div><blockquote>Own the work. Deliver the outcome. Be easy to work with.</blockquote></div></section>
  <section class="cta-band"><div class="shell cta-grid"><div><h2>Bring us the work your team cannot turn off.</h2><p>We’ll help you decide whether Spur can take it off your plate.</p></div><a class="button light" href="contact-sales.html">Start a conversation →</a></div></section>`
});

const why = page({
  title: 'Why Spur | A Better Way to Run School Operations',
  description: 'Spur delivers managed back-office outcomes through clear ownership, responsive service, and experienced school operators.',
  current: 'why', canonical: 'why-spur.html',
  body: `<section class="page-hero"><div class="shell page-hero-grid"><div><span class="eyebrow">Why Spur</span><h1>Your school needs the work done—and done well.</h1><p>Spur takes responsibility for the work and the result, with clear communication from people who understand schools.</p><div class="hero-actions"><a class="button" href="contact-sales.html">Talk to Spur →</a></div></div><aside class="scope-card"><span>Our promise</span><strong>Clear ownership. Dependable delivery. A better service experience.</strong><p>Your team stays in control without carrying every recurring task.</p></aside></div></section>
  <section class="section paper"><div class="shell"><div class="section-head"><span class="eyebrow">Different by design</span><h2>Service that removes work instead of <span class="serif">creating more.</span></h2></div><div class="principles"><div class="principle"><h3>We own the outcome</h3><p>We agree on the result, take responsibility for the details, and follow through.</p></div><div class="principle"><h3>We make it easy</h3><p>Working with Spur should feel simple, clear, and lighter for your team.</p></div><div class="principle"><h3>We communicate clearly</h3><p>You always know where things stand and can reach someone who knows your school.</p></div><div class="principle"><h3>We keep our word</h3><p>Deadlines, details, and follow-up matter. We treat them that way.</p></div></div></div></section>
  <section class="section navy"><div class="shell split"><div class="split-copy"><span class="eyebrow">Our right to earn trust</span><h2>More than a decade of doing the unglamorous work.</h2><p>Spur already knows what it means to recruit, screen, credential, onboard, schedule, pay, support, and serve schools at scale. That experience taught us that great service is equal parts competence, responsiveness, and care.</p></div><div class="steps"><div class="step"><span class="step-num">1</span><div><h3>We understand schools</h3><p>Calendars, constraints, stakeholders, and public accountability are familiar territory.</p></div></div><div class="step"><span class="step-num">2</span><div><h3>We carry the work completely</h3><p>Clear ownership means fewer loose ends and less chasing for your team.</p></div></div><div class="step"><span class="step-num">3</span><div><h3>We deliver service people notice</h3><p>Thoughtful communication and reliable follow-through are part of the outcome.</p></div></div></div></div></section>
  <section class="cta-band"><div class="shell cta-grid"><div><h2>Start with one service and one clear outcome.</h2><p>We’ll understand what your team carries today before we recommend a next step.</p></div><a class="button light" href="contact-sales.html">Talk through the work →</a></div></section>`
});

const contact = page({
  title: 'Talk to Spur | SpurHR, staffing and finance for schools',
  description: 'Talk with Spur about SpurHR, school staffing, or finance and accounting for your school.',
  current: 'contact', canonical: 'contact-sales.html',
  body: `<section class="page-hero"><div class="shell statement"><span class="eyebrow">Start a conversation</span><h1>Tell us where the work is piling up.</h1><p>Ask about SpurHR or Spur Staffing, or register your interest in finance and accounting.</p></div></section>
  <section class="section"><div class="shell contact-grid"><div><h2>What to expect</h2><div class="contact-points"><div class="contact-point"><strong>A 20-minute working conversation</strong><br><span>Enough context to understand the work and the pressure.</span></div><div class="contact-point"><strong>Direct answers about fit</strong><br><span>Including what Spur can own and what should stay with your team.</span></div><div class="contact-point"><strong>A clear next step</strong><br><span>If there is a fit, we will agree on the service and responsibilities together.</span></div></div></div><div class="contact-card"><h3>Talk to Spur</h3><p>Complete the details below. Submitting will open a pre-addressed email with your information so you can review and send it.</p><form id="sales-form" data-recipient="support@spured.com"><div class="form-grid"><div class="field"><label for="firstName">First name</label><input id="firstName" name="firstName" autocomplete="given-name" required></div><div class="field"><label for="lastName">Last name</label><input id="lastName" name="lastName" autocomplete="family-name" required></div><div class="field full"><label for="email">School email</label><input id="email" name="email" type="email" autocomplete="email" required></div><div class="field full"><label for="school">School or district</label><input id="school" name="school" autocomplete="organization" required></div><div class="field full"><label for="interest">Where do you need help?</label><select id="interest" name="interest"><option value="">Choose one</option><option value="SpurHR">HR and recruiting — SpurHR</option><option value="Spur Staffing">Staffing — Spur Staffing</option><option value="Finance & Accounting">Finance and accounting</option><option value="Not sure yet">Not sure yet</option></select></div><div class="field full"><label for="message">What is creating the most pressure?</label><textarea id="message" name="message"></textarea></div><div class="field full"><button class="button" type="submit">Prepare email →</button><p class="form-note">Prefer to write directly? Email <a href="mailto:support@spured.com?subject=Back-office%20services">support@spured.com</a>.</p><p class="form-status" role="status"></p></div></div></form></div></div></section>`
});

const contactHub = page({
  title: 'Contact Spur | Sales and Support',
  description: 'Contact Spur about school back-office services, customer support, worker support, or careers.',
  canonical: 'contact.html',
  body: `<section class="page-hero"><div class="shell statement"><span class="eyebrow">Contact Spur</span><h1>How can we help?</h1><p>Choose the team that can get you to the right answer fastest.</p></div></section><section class="section paper"><div class="shell service-grid"><a class="service-card" href="contact-sales.html"><span class="service-number">01</span><h3>Talk to sales</h3><p>Explore SpurHR, Spur Staffing, or finance and accounting.</p><span class="card-link">Start a conversation →</span></a><a class="service-card" href="contact-support.html"><span class="service-number">02</span><h3>Customer support</h3><p>Get help with an existing Spur service or account.</p><span class="card-link">Contact support →</span></a><a class="service-card" href="worker-support.html"><span class="service-number">03</span><h3>Worker support</h3><p>Find answers about jobs, onboarding, pay, scheduling, and policies.</p><span class="card-link">Visit worker support →</span></a></div></section>`
});

const { hr, hrTour } = require('./build-spur-hr.js')({ page, note, STAGING, STAFFING_URL, LEAD_ENDPOINT, LEAD_EMAIL, SANDBOX_URL });

const outputs = {
  'index.html': home,
  'hr.html': hr,
  'hr-tour.html': hrTour,
  'about.html': about,
  'why-spur.html': why,
  'contact-sales.html': contact,
  'contact.html': contactHub
};

for (const s of services) {
  outputs[`${s.slug}.html`] = page({
    title: `${s.name} for Schools${s.comingSoon ? ' | Coming Soon' : ''} | Spur`,
    description: `${s.comingSoon ? 'Coming soon from Spur: ' : ''}${s.lede}`,
    canonical: `${s.slug}.html`,
    body: serviceBody(s)
  });
}

// Legal pages. The text lives in content/legal/*.html and is placed in the shared page shell unchanged.
const legalPages = [
  ['privacy-policy', "Privacy Policy | Spur", "Spur's privacy policy explains how we collect, use, and protect your personal information when you use our website and services."],
  ['terms-of-service', "Terms of Service | Spur", "Terms of Service for using the Spur Education website and services. Read our terms governing use of spureducation.com."],
  ['accessibility', "Accessibility | Spur", "Spur is committed to making our website accessible to all users, including those with disabilities. Learn about our accessibility practices."]
];

for (const [slug, title, description] of legalPages) {
  const text = fs.readFileSync(path.join(ROOT, 'content', 'legal', `${slug}.html`), 'utf8');
  outputs[`${slug}.html`] = page({ title, description, canonical: `${slug}.html`, body: `<section class="page-hero legal"><div class="shell prose">${text}</div></section>` });
}

// Retired service pages. Old links land on the home page instead of a 404.
const retired = ['substitute-desk', 'federal-programs'];
for (const slug of retired) {
  outputs[`${slug}.html`] = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Spur</title><meta name="robots" content="noindex"><link rel="canonical" href="https://spureducation.com/"><meta http-equiv="refresh" content="0; url=index.html"></head><body><p>This page has moved. <a href="index.html">Go to the Spur home page</a>.</p></body></html>`;
}

for (const [filename, contents] of Object.entries(outputs)) {
  fs.writeFileSync(path.join(OUT_DIR, filename), `${contents}\n`);
}

console.log(`Built ${Object.keys(outputs).length} pages into ${path.relative(ROOT, OUT_DIR) || '.'}${STAGING ? ' (staging build with reviewer notes)' : ''}.`);

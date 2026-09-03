const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const services = [
  {
    slug: 'finance-accounting',
    short: 'FA',
    name: 'Finance & Accounting',
    eyebrow: 'A steadier business office',
    headline: 'Clean books. Clear decisions. No scramble.',
    lede: 'Spur handles the recurring financial work that keeps a school running and delivers accurate, decision-ready work on a dependable schedule.',
    cardCopy: 'Reliable financial operations and reporting, handled for you.',
    audience: 'Built first for charter schools, independent schools, and lean district business offices.',
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
  },
  {
    slug: 'substitute-desk',
    short: 'SD',
    name: 'Substitute Desk',
    eyebrow: 'Your pool. Fully supported.',
    headline: 'Every absence handled. Every morning calmer.',
    lede: 'Your district keeps substitutes on its payroll. Spur handles scheduling, communication, and daily fill from start to finish.',
    cardCopy: 'Your substitute pool, scheduling, and daily fill—fully supported.',
    audience: 'For schools that want a stronger fill operation without handing over employment of their substitute workforce.',
    services: [
      ['Pool operations', 'Keep substitute records organized, current, and ready for the next school day.'],
      ['Daily fill', 'Monitor open assignments and work the queue through the channels substitutes use.'],
      ['Proactive outreach', 'Reach the right people early instead of waiting for a job board to solve the problem.'],
      ['School support', 'Give school leaders a responsive point of contact when plans change.'],
      ['Substitute support', 'Answer routine questions and make it easier for good substitutes to keep working.'],
      ['Clear reporting', 'Track fill patterns, pool activity, results, and opportunities to improve.']
    ],
    owns: ['The daily fill process', 'Substitute and school communication', 'Schedule changes and follow-up', 'Clear reporting on results'],
    schoolOwns: ['Employment and payroll of substitutes', 'Pay rates and personnel policies', 'Final eligibility and employment decisions', 'Site-level supervision'],
    serviceLead: 'Responsive support every school day',
    serviceLeadCopy: 'Your schools and substitutes get thoughtful, timely help from people who know the operation and take responsibility for getting it right.',
    faqs: [
      ['Does Spur employ the substitutes?', 'Not in this service model. The school or district keeps substitutes on its own payroll and remains the employer.'],
      ['Is this absence-management software?', 'No. Spur provides the service and works with the tools your district already uses wherever practical.'],
      ['How is the service priced?', 'The intended model is a predictable flat fee rather than a wage markup. Final scope and pricing depend on pool size, schools served, and operating requirements.'],
      ['Can Spur help strengthen our substitute pool?', 'Pool health is part of the operating conversation. Any recruiting, onboarding, or credentialing responsibilities are defined explicitly in the service agreement.']
    ]
  },
  {
    slug: 'federal-programs',
    short: 'FP',
    name: 'Federal Programs',
    eyebrow: 'Deadlines under control',
    headline: 'The reporting gets done. The funding stays useful.',
    lede: 'Spur handles the recurring documentation, reconciliation, and reporting work behind federal programs so deadlines stay under control.',
    cardCopy: 'Applications, documentation, reporting, and deadlines—kept on track.',
    audience: 'Designed for single-site charters, small districts, and federal-program leaders carrying too many roles.',
    services: [
      ['Applications and budgets', 'Coordinate the annual application, program budgets, and required support.'],
      ['Time and effort', 'Maintain a reliable documentation process for covered staff and programs.'],
      ['Allowable costs', 'Organize support for spending decisions and required cost documentation.'],
      ['Drawdowns', 'Prepare reimbursement support and reconcile program activity to the books.'],
      ['Monitoring responses', 'Coordinate documents, deadlines, and response packages for reviews.'],
      ['Close-outs', 'Finish the documentation and reconciliation work when a program period ends.']
    ],
    owns: ['The reporting and documentation calendar', 'Draft applications and response packages', 'Reconciliation and missing-item follow-up', 'Organized support for monitoring and audits'],
    schoolOwns: ['Programmatic and student-level decisions', 'Final certifications and submissions', 'Local policy and allocation choices', 'Providing required source records and approvals'],
    serviceLead: 'Experienced federal-program support',
    serviceLeadCopy: 'Your team gets careful, responsive support from people who understand the work, respect the stakes, and stay ahead of the calendar.',
    faqs: [
      ['Does Spur make programmatic decisions?', 'No. School leaders retain decisions about programs, students, allocations, and final certifications. Spur supports the administrative work around those decisions.'],
      ['Which programs can Spur support?', 'The proposed scope includes major federal formula programs and related reporting. Exact programs and state-specific requirements are confirmed during discovery.'],
      ['Can administrative costs pay for the service?', 'That depends on the program, approved plan, state guidance, and local policy. Schools should confirm allowability for their specific funds before charging the service to a grant.'],
      ['Is this legal or audit advice?', 'No. Spur provides managed administrative support. Legal interpretations, audit opinions, and final certifications remain with the appropriate school officials and professional advisers.']
    ]
  }
];

function serviceMenu() {
  return services.map(s => `<a href="${s.slug}.html"><span class="menu-icon">${s.short}</span><span><strong>${s.name}</strong><small>${s.eyebrow}</small></span></a>`).join('');
}

function header(current = '') {
  const currentAttr = key => current === key ? ' aria-current="page"' : '';
  return `<header class="site-header">
    <div class="shell nav-wrap">
      <a class="brand" href="index.html" aria-label="Spur home"><img src="spur-logo.svg" alt="Spur"></a>
      <button class="mobile-toggle" type="button" aria-label="Open navigation" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
      <nav class="primary-nav" aria-label="Primary navigation">
        <div class="nav-services">
          <button type="button" aria-expanded="false">Services <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 6 5 5 5-5"/></svg></button>
          <div class="service-menu">${serviceMenu()}</div>
        </div>
        <a href="index.html#how-it-works">How it works</a>
        <a href="why-spur.html"${currentAttr('why')}>Why Spur</a>
        <a href="about.html"${currentAttr('about')}>About</a>
        <a class="nav-cta" href="contact-sales.html"${currentAttr('contact')}>Talk to Spur</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="shell">
      <div class="footer-grid">
        <div class="footer-brand"><img src="spur-logo.svg" alt="Spur"><p>We run the back office so schools can run the classroom.</p></div>
        <div class="footer-col"><strong>Services</strong>${services.map(s => `<a href="${s.slug}.html">${s.name}</a>`).join('')}</div>
        <div class="footer-col"><strong>Company</strong><a href="why-spur.html">Why Spur</a><a href="about.html">About</a><a href="https://jobs.spureducation.com/" target="_blank" rel="noopener">Jobs</a></div>
        <div class="footer-col"><strong>Help</strong><a href="contact-sales.html">Talk to sales</a><a href="contact-support.html">Customer support</a><a href="worker-support.html">Worker support</a></div>
      </div>
      <div class="footer-bottom"><span>© 2026 Spur. All rights reserved.</span><span class="footer-legal"><a href="privacy-policy.html">Privacy</a><a href="terms-of-service.html">Terms</a><a href="accessibility.html">Accessibility</a></span></div>
    </div>
  </footer>`;
}

function page({ title, description, current, body, canonical }) {
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
  <link rel="icon" type="image/png" href="spur-favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/back-office.css?v=1">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  ${header(current)}
  <main id="main">${body}</main>
  ${footer()}
  <script src="js/back-office.js"></script>
</body>
</html>`;
}

function serviceCards() {
  return services.map((s, i) => `<a class="service-card" href="${s.slug}.html"><span class="service-number">0${i + 1}</span><h3>${s.name}</h3><p>${s.cardCopy}</p><span class="card-link">Explore the service →</span></a>`).join('');
}

const home = page({
  title: 'Spur | Managed Back-Office Services for Schools',
  description: 'Spur runs finance and accounting, substitute operations, and federal program reporting so school teams can focus on students.',
  body: `<section class="hero"><div class="shell hero-grid"><div class="hero-copy"><span class="eyebrow">Done-for-you school operations</span><h1><span class="hero-line">We run the <span class="serif">back office</span></span><span class="hero-line">so schools can run</span><span class="hero-line">the classroom.</span></h1><p class="hero-lede">Finance, substitute operations, and federal program reporting—delivered with care by people who understand schools.</p><div class="hero-actions"><a class="button" href="contact-sales.html">Talk through your needs →</a><a class="button secondary" href="#services">Explore our services</a></div></div><aside class="hero-note"><div class="note-line"></div><strong>Back-office services for schools</strong><p>Clear ownership. Dependable delivery. A partner who follows through.</p><div class="hero-service-links"><a href="finance-accounting.html">Finance & Accounting <span>→</span></a><a href="substitute-desk.html">Substitute Desk <span>→</span></a><a href="federal-programs.html">Federal Programs <span>→</span></a></div></aside></div></section>
  <section class="section paper" id="services"><div class="shell"><div class="continuity-intro"><div><span class="eyebrow">A natural next step</span><h2>More than a decade <span class="serif">inside schools.</span></h2></div><div class="continuity-copy"><p>For more than a decade, Spur has helped schools recruit, onboard, schedule, pay, and support the people who keep classrooms running.</p><p>Now we’re bringing that same experience—and the same commitment to exceptional service—to more of the school back office.</p></div></div><div class="service-grid">${serviceCards()}</div></div></section>
  <section class="section navy" id="how-it-works"><div class="shell"><div class="section-head"><span class="eyebrow">What carries forward</span><h2>The same service promise. <span class="serif">A broader mission.</span></h2></div><div class="promise-grid"><div class="promise-item"><h3>We understand schools</h3><p>We know the pace, pressure, and responsibility that come with serving educators.</p></div><div class="promise-item"><h3>We own the outcome</h3><p>We take responsibility for the work instead of adding more to your team.</p></div><div class="promise-item"><h3>We show up</h3><p>Responsive communication and reliable follow-through are part of the service.</p></div></div></div></section>
  <section class="cta-band"><div class="shell cta-grid"><div><h2>Let’s take something off your team’s plate.</h2><p>Tell us where the work is piling up. We’ll talk plainly about whether Spur is the right fit.</p></div><a class="button light" href="contact-sales.html">Start a conversation →</a></div></section>`
});

function serviceBody(s) {
  return `<section class="page-hero"><div class="shell page-hero-grid"><div><span class="eyebrow">${s.eyebrow}</span><h1>${s.headline}</h1><p>${s.lede}</p><div class="hero-actions"><a class="button" href="contact-sales.html?service=${s.slug}">Talk about ${s.name} →</a><a class="button secondary" href="#scope">See the scope</a></div></div><aside class="scope-card"><span>Designed for</span><strong>${s.audience}</strong><p>We agree on responsibilities, approvals, deliverables, and timing before the service begins.</p></aside></div></section>
  <section class="section paper" id="scope"><div class="shell"><div class="section-head"><span class="eyebrow">What Spur can handle</span><h2>Recurring work, <span class="serif">owned end to end.</span></h2><p>We tailor the service to your school and make the responsibilities clear before we begin.</p></div><div class="work-grid">${s.services.map((item, i) => `<div class="work-card"><span class="icon-tile">${String(i + 1).padStart(2, '0')}</span><h3>${item[0]}</h3><p>${item[1]}</p></div>`).join('')}</div></div></section>
  <section class="section navy"><div class="shell"><div class="section-head"><span class="eyebrow">Clear lines of responsibility</span><h2>Spur runs the work. <span class="serif">The school keeps authority.</span></h2></div><div class="boundary-grid"><div class="boundary-card"><h3>Spur owns</h3><ul>${s.owns.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="boundary-card"><h3>Your school owns</h3><ul>${s.schoolOwns.map(x => `<li>${x}</li>`).join('')}</ul></div></div></div></section>
  <section class="section"><div class="shell split"><div class="split-copy"><span class="eyebrow">Service that feels different</span><h2>${s.serviceLead}</h2><p>${s.serviceLeadCopy}</p><a class="button secondary" href="why-spur.html">Why schools choose Spur →</a></div><div class="steps"><div class="step"><span class="step-num">A</span><div><h3>You always know what is happening</h3><p>We communicate clearly, follow through, and stay easy to reach.</p></div></div><div class="step"><span class="step-num">B</span><div><h3>Questions get answered</h3><p>When something needs attention, we take ownership and help move it forward.</p></div></div><div class="step"><span class="step-num">C</span><div><h3>Work arrives ready to use</h3><p>What we deliver is complete, clear, and prepared for the people who need it.</p></div></div></div></div></section>
  <section class="section paper"><div class="shell"><div class="section-head"><span class="eyebrow">Questions to ask</span><h2>Straight answers, <span class="serif">before you start.</span></h2></div><div class="faq-list">${s.faqs.map((f, i) => `<div class="faq-item"><button type="button" aria-expanded="false" aria-controls="faq-${s.slug}-${i}"><span>${f[0]}</span><span aria-hidden="true">+</span></button><div class="faq-answer" id="faq-${s.slug}-${i}"><p>${f[1]}</p></div></div>`).join('')}</div></div></section>
  <section class="cta-band"><div class="shell cta-grid"><div><h2>Let’s talk about ${s.name.toLowerCase()}.</h2><p>We’ll look at what your team carries today and tell you where Spur could make the biggest difference.</p></div><a class="button light" href="contact-sales.html?service=${s.slug}">Talk to Spur →</a></div></section>`;
}

const about = page({
  title: 'About Spur | School Back-Office Operations',
  description: 'Spur is a school-operations company built to carry essential back-office work so educators can focus on students.',
  current: 'about', canonical: 'about.html',
  body: `<section class="page-hero"><div class="shell statement"><span class="eyebrow">About Spur</span><h1>Built inside schools. Focused on the work behind them.</h1><p>For more than a decade, Spur has handled the people and staffing work schools depend on: recruiting, screening, credentialing, onboarding, scheduling, payroll, and support. Now we’re bringing that experience to more of the back office.</p></div></section>
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
  title: 'Talk to Spur | School Back-Office Services',
  description: 'Talk with Spur about finance and accounting, substitute operations, or federal program reporting for your school.',
  current: 'contact', canonical: 'contact-sales.html',
  body: `<section class="page-hero"><div class="shell statement"><span class="eyebrow">Start a conversation</span><h1>Tell us where the work is piling up.</h1><p>No hour-long presentation. We’ll talk about what your team carries today and whether Spur can take meaningful work off your plate.</p></div></section>
  <section class="section"><div class="shell contact-grid"><div><h2>What to expect</h2><div class="contact-points"><div class="contact-point"><strong>A 20-minute working conversation</strong><br><span>Enough context to understand the work and the pressure.</span></div><div class="contact-point"><strong>Direct answers about fit</strong><br><span>Including what Spur can own and what should stay with your team.</span></div><div class="contact-point"><strong>A clear next step</strong><br><span>If there is a fit, we will agree on the service and responsibilities together.</span></div></div></div><div class="contact-card"><h3>Talk to Spur</h3><p>Complete the details below. Submitting will open a pre-addressed email with your information so you can review and send it.</p><form id="sales-form" data-recipient="support@spured.com"><div class="form-grid"><div class="field"><label for="firstName">First name</label><input id="firstName" name="firstName" autocomplete="given-name" required></div><div class="field"><label for="lastName">Last name</label><input id="lastName" name="lastName" autocomplete="family-name" required></div><div class="field full"><label for="email">School email</label><input id="email" name="email" type="email" autocomplete="email" required></div><div class="field full"><label for="school">School or district</label><input id="school" name="school" autocomplete="organization" required></div><div class="field full"><label for="interest">Where do you need help?</label><select id="interest" name="interest"><option value="">Choose a service</option><option>Finance & Accounting</option><option>Substitute Desk</option><option>Federal Programs</option><option>More than one service</option><option>Not sure yet</option></select></div><div class="field full"><label for="message">What is creating the most pressure?</label><textarea id="message" name="message"></textarea></div><div class="field full"><button class="button" type="submit">Prepare email →</button><p class="form-note">Prefer to write directly? Email <a href="mailto:support@spured.com?subject=Back-office%20services">support@spured.com</a>.</p><p class="form-status" role="status"></p></div></div></form></div></div></section>`
});

const contactHub = page({
  title: 'Contact Spur | Sales and Support',
  description: 'Contact Spur about school back-office services, customer support, worker support, or careers.',
  canonical: 'contact.html',
  body: `<section class="page-hero"><div class="shell statement"><span class="eyebrow">Contact Spur</span><h1>How can we help?</h1><p>Choose the team that can get you to the right answer fastest.</p></div></section><section class="section paper"><div class="shell service-grid"><a class="service-card" href="contact-sales.html"><span class="service-number">01</span><h3>Talk to sales</h3><p>Explore Finance & Accounting, Substitute Desk, or Federal Programs.</p><span class="card-link">Start a conversation →</span></a><a class="service-card" href="contact-support.html"><span class="service-number">02</span><h3>Customer support</h3><p>Get help with an existing Spur service or account.</p><span class="card-link">Contact support →</span></a><a class="service-card" href="worker-support.html"><span class="service-number">03</span><h3>Worker support</h3><p>Find answers about jobs, onboarding, pay, scheduling, and policies.</p><span class="card-link">Visit worker support →</span></a></div></section>`
});

const outputs = {
  'index.html': home,
  'about.html': about,
  'why-spur.html': why,
  'contact-sales.html': contact,
  'contact.html': contactHub
};

for (const s of services) {
  outputs[`${s.slug}.html`] = page({
    title: `${s.name} for Schools | Spur`,
    description: s.lede,
    canonical: `${s.slug}.html`,
    body: serviceBody(s)
  });
}

for (const [filename, contents] of Object.entries(outputs)) {
  fs.writeFileSync(path.join(ROOT, filename), `${contents}\n`);
}

console.log(`Built ${Object.keys(outputs).length} back-office pages.`);

// SpurHR product pages: hr.html and hr-tour.html.
// Called by build-back-office.js, which supplies the shared page shell.
//
// Content rules for these pages:
//   - Every release claim carries its date. Leave out anything with no committed date.
//   - Illustrations use sample data and say so.
//   - An FAQ entry with `review` set is published only in a STAGING build, until the named
//     reviewer clears it. Remove the `review` field to publish it.
//   - Pricing figures come from `pricing` below. While it is null the public page shows no numbers.

module.exports = function buildSpurHr({ page, note, STAGING, STAFFING_URL, LEAD_ENDPOINT, LEAD_EMAIL, SANDBOX_URL }) {
  const JAN = 'January 2027';
  const APR = 'April 2027';
  const tagJan = `<span class="tag jan">${JAN}</span>`;
  const tagApr = `<span class="tag apr">${APR}</span>`;
  const tagSample = '<span class="tag sample">Sample data</span>';

  // Approved price points go here, for example:
  //   { unit: 'per employee, per month', plans: [{ name: '…', price: '$…', includes: ['…'] }] }
  const pricing = null;

  const pillars = [
    {
      blocks: ['on', 'on', 'on', 'on', 'on'],
      title: 'One system instead of many.',
      copy: 'Applicant tracking, onboarding, staff records, time, payroll and performance usually live in separate tools that do not talk to each other. SpurHR keeps one record for each person, from first application to last paycheck.'
    },
    {
      blocks: ['on', '', 'on', 'on', ''],
      title: 'Built for how charter schools run.',
      copy: 'Networks with several campuses and legal employers. Certifications and clearances. School-year calendars, bell schedules and substitutes. These are part of the design, not add-ons to a corporate HR tool.'
    },
    {
      blocks: ['on', 'on', 'you', 'on', 'on'],
      title: 'AI assists. People decide.',
      copy: 'AI drafts, summarizes and flags. It never approves, rejects, publishes or pays. Every decision shows the name of the person who made it, and every step also works by hand.'
    }
  ];

  const flows = [
    {
      title: 'Hiring a teacher',
      tag: tagJan,
      steps: [
        ['ai', 'A job description, written from the facts you give and your school’s template.'],
        ['you', 'You edit and approve it. The posting goes to your school’s job page.'],
        ['ai', 'Each application is screened against your criteria, with the reasons shown.'],
        ['you', 'You choose who to interview. An AI phone screen is optional, and a person can always take the call.'],
        ['ai', 'The offer letter and signature packet are prepared.'],
        ['you', 'You approve the offer. Onboarding starts when it is signed.']
      ]
    },
    {
      title: 'Bringing a new hire on board',
      tag: tagJan,
      steps: [
        ['ai', 'The checklist is built for the role: forms, clearances, certifications and policies to acknowledge.'],
        ['ai', 'The new hire is reminded about what is missing, so your office does not have to chase.'],
        ['you', 'A person reviews any flagged background-check result and makes the call.'],
        ['you', 'You confirm the start date once everything required is in.']
      ]
    },
    {
      title: 'Answering staff questions',
      tag: tagJan,
      steps: [
        ['ai', 'Staff ask a handbook or policy question and get an answer from your own documents, with the source.'],
        ['ai', 'When the answer is not in your documents, it says so and sends the question to your HR contact.'],
        ['you', 'Complaints and sensitive matters always go to a person.']
      ]
    }
  ];

  const faqs = [
    ['Who can see our staff data?', 'Each school or network is kept separate from every other customer. Inside your account, access follows fixed roles and is limited by school, by legal employer and by sensitive field. A principal sees their own school. Medical and leave documents are open only to the specialists who need them. Spur support staff have no standing access to your records. Support access is requested for a named task, approved by your school, time-limited and logged.'],
    ['Does AI make decisions about our people?', 'No. AI drafts, summarizes and flags. It cannot approve or reject a candidate, publish a posting, change access or release payroll. Those actions belong to a named person, and the record shows who took them. You can turn AI off for any kind of work and do that work by hand.'],
    ['How is sensitive information protected?', 'Data is encrypted in transit and at rest. Social Security numbers and bank details are collected by the payroll provider, so SpurHR does not hold raw copies. Privileged accounts require multi-factor authentication. Sensitive reads, downloads and access changes are written to an audit log that cannot be edited.'],
    ['Do we have to move payroll to use SpurHR?', `No. Recruiting and onboarding in the ${JAN} release work without payroll. Payroll arrives in ${APR}, and you choose whether to adopt it.`],
    ['Is our data used to train AI models?', 'Answer pending.', 'Needs the terms of the AI providers SpurHR will use. Do not publish an answer until those are confirmed.'],
    ['Is SpurHR HIPAA compliant?', 'HIPAA applies to health plans, health care providers and the companies that handle health information for them. Most records an employer keeps about its own staff, including leave and accommodation paperwork, are employment records and not HIPAA records. Other laws, such as the ADA and the Family and Medical Leave Act (FMLA), still require an employer to keep them confidential. SpurHR keeps medical and leave documents apart from the personnel file, with their own access rules. If your benefits plan needs a business associate agreement, tell us before you sign up.', 'Legal review. This is a general description of the law, drafted without counsel. No compliance or certification claim is made.'],
    ['What happens to our data if we leave?', 'You can export your records before the account closes. We agree a retention and deletion schedule with you in writing, and legal holds are honored.', 'Abigail to confirm the commitment and wording.']
  ];

  const faqHtml = faqs
    .filter(f => !f[2] || STAGING)
    .map((f, i) => `<div class="faq-item"><button type="button" aria-expanded="false" aria-controls="faq-hr-${i}"><span>${f[0]}${f[2] ? '<span class="needs-review">Needs review</span>' : ''}</span><span aria-hidden="true">+</span></button><div class="faq-answer" id="faq-hr-${i}"><p>${f[1]}</p>${f[2] ? note(f[2]) : ''}</div></div>`)
    .join('');

  const pricingHtml = pricing
    ? `<div class="pricing-card"><h3>${pricing.unit}</h3>${pricing.plans.map(p => `<p><strong>${p.name}</strong> · ${p.price}</p><ul>${p.includes.map(x => `<li>${x}</li>`).join('')}</ul>`).join('')}</div>`
    : `<div class="pricing-card"><h3>Prices will be published here</h3><p class="caption" style="margin:.5rem 0 0">Before the first release in ${JAN}.</p><ul><li>One published price list for every school</li><li>What is included, written out</li><li>Any pass-through cost, such as payroll, shown separately</li></ul><p style="margin:1.25rem 0 0"><a class="text-link" href="hr-tour.html#demo">Ask us for current pricing →</a></p></div>`;

  const bars = rows => `<ul class="bars">${rows.map(([label, value, max]) => `<li><span>${label}</span><span class="track"><span class="fill" style="width:${Math.round(value / max * 100)}%"></span></span><b>${value}</b></li>`).join('')}</ul>`;

  const hr = page({
    title: 'SpurHR | HR software built for charter and independent schools',
    description: 'SpurHR is one HR system for hiring, onboarding, staff records, time, pay and performance, built for charter and independent schools. AI assists. People decide.',
    current: 'hr', canonical: 'hr.html', product: 'hr',
    body: `<section class="hr-hero"><div class="shell hr-hero-grid"><div><span class="eyebrow">For charter and independent schools</span><h1>Let the computers do the clerical work, so you can do the <span class="serif">thinking work.</span></h1><p class="lede">SpurHR is one HR system for hiring, onboarding, staff records, time, pay and performance. AI drafts, checks and follows up. A named person makes every decision.</p><div class="hero-actions"><a class="button" href="hr-tour.html">Take the self-guided tour →</a><a class="button secondary" href="hr-tour.html#demo">Request a demo</a></div><p class="release-line">First release ${tagJan} More in ${tagApr}</p></div>
    <figure class="panel" style="margin:0" aria-label="Illustration of a SpurHR home screen with sample data"><div class="panel-head"><strong>Ready for you</strong><span>Monday · 7:42 AM</span></div><ul class="panel-list"><li><span class="mark needs-you"></span><div><strong>Job description · 5th grade math</strong><small>Written from your notes and template.</small><span class="who you">Needs your review</span></div></li><li><span class="mark needs-you"></span><div><strong>12 applications screened</strong><small>4 recommended for interview, with reasons for each.</small><span class="who you">Your decision</span></div></li><li><span class="mark"></span><div><strong>Onboarding · Jordan Price</strong><small>2 documents still missing. Reminder sent.</small><span class="who ai">AI is following up</span></div></li><li><span class="mark done"></span><div><strong>Handbook question answered</strong><small>Source: Staff handbook, section 4.2.</small><span class="who ai">Answered by AI</span></div></li></ul><figcaption class="panel-foot caption">Illustration with sample data.</figcaption></figure></div></section>

  <section class="section paper"><div class="shell"><div class="section-head"><span class="eyebrow">Why SpurHR</span><h2>Three things that make it <span class="serif">different.</span></h2></div><div class="pillars">${pillars.map(p => `<div class="pillar"><div class="blocks" aria-hidden="true">${p.blocks.map(b => `<i class="${b}"></i>`).join('')}</div><h3>${p.title}</h3><p>${p.copy}</p></div>`).join('')}</div></div></section>

  <section class="section" id="how-it-works"><div class="shell"><div class="section-head wide"><span class="eyebrow">How the work changes</span><h2>Not a better place to do the <span class="serif">same paperwork.</span></h2><p>Most HR software gives you tidier forms. SpurHR does the preparation, so what is left for you is the judgment.</p></div><p class="flow-key"><span><i></i> AI prepares</span><span><i class="you"></i> You decide</span></p><div class="flows">${flows.map(f => `<article class="flow"><div class="flow-head"><h3>${f.title}</h3>${f.tag}</div><ol class="flow-steps">${f.steps.map(([who, text]) => `<li class="${who}"><b>${who === 'you' ? 'You decide' : 'AI prepares'}</b>${text}</li>`).join('')}</ol></article>`).join('')}</div>${note('Abigail asked for case studies. SpurHR has no customers yet, so these are workflow illustrations, drawn from the approved January scope. Real case studies replace them once design partners are live.')}</div></section>

  <section class="section paper"><div class="shell controls-grid"><div><span class="eyebrow">You stay in control</span><h2>You choose how much <span class="serif">AI does.</span></h2><p class="lede">Turn AI on or off for each kind of work. Have it write job descriptions but leave screening to your team. Change the setting at any time.</p>${note('Glenn described per-function AI switches as the product vision. Confirm they are in the January build before this section is published.')}</div><figure class="panel" style="margin:0" aria-label="Illustration of AI settings"><div class="panel-head"><strong>AI settings</strong><span>Your school</span></div><ul class="switch-list"><li>Draft job descriptions<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li><li>Screen applications<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li><li>Phone screens<span class="switch-state">Off</span><span class="switch" aria-hidden="true"></span></li><li>Follow up on onboarding<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li><li>Answer policy questions<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li></ul><figcaption class="panel-foot caption">Illustration.</figcaption></figure></div></section>

  <section class="section" id="reports"><div class="shell"><div class="section-head wide"><span class="eyebrow">See your people and your numbers</span><h2>A page for every staff member. A summary for <span class="serif">your board.</span></h2><p>The numbers a board asks for come from the same records your team already works in. Nothing is re-keyed into a spreadsheet.</p></div><div class="sample-grid"><div class="sample-card"><div class="sample-head"><h3>Recruiting pipeline</h3><span class="sample-tags">${tagJan}${tagSample}</span></div>${bars([['Applied', 86, 86], ['Screened', 41, 86], ['Interviewed', 14, 86], ['Offered', 5, 86], ['Hired', 4, 86]])}<p class="caption" style="margin:0">Open roles this hiring season, all campuses.</p></div><div class="sample-card"><div class="sample-head"><h3>Time to fill</h3><span class="sample-tags">${tagJan}${tagSample}</span></div><p class="figure">32 days<small>Median, posting approved to offer signed</small></p>${bars([['Teachers', 36, 45], ['Support staff', 21, 45], ['Leadership', 44, 45]])}</div><div class="sample-card"><div class="sample-head"><h3>Staff page</h3><span class="sample-tags">${tagApr}${tagSample}</span></div><div class="person-card"><div class="who-row"><span class="avatar" aria-hidden="true">AM</span><div><strong>Alicia Moore</strong><br><span class="caption">Teacher · 4th grade · hired Aug 2024</span></div></div><dl><dt>Certification</dt><dd>Current · renews Jun 2028</dd><dt>Observations</dt><dd>3 of 4 completed this year</dd><dt>Growth goal</dt><dd>Small-group math instruction</dd><dt>Time off</dt><dd>6 days available</dd></dl></div></div><div class="sample-card"><div class="sample-head"><h3>Retention</h3><span class="sample-tags">${tagApr}${tagSample}</span></div><p class="figure">91%<small>Staff who returned this school year</small></p>${bars([['Campus A', 94, 100], ['Campus B', 89, 100], ['Campus C', 90, 100]])}</div></div>${note('Recruiting pipeline and time to fill are in the approved fixed reports. The staff page and retention examples depend on April modules; confirm the exact measures. Abigail also asked for cost per hire. It has no committed release, so it is left out until a date is set.')}</div></section>

  <section class="section navy" id="releases"><div class="shell"><div class="section-head"><span class="eyebrow">What is ready when</span><h2>Two releases, with <span class="serif">dates.</span></h2><p>We would rather tell you what is coming and when than show you a feature list with no dates.</p></div><div class="release-grid"><div class="release"><h3>${JAN}</h3><p>Hire and onboard</p><ul><li>Job postings on your school’s own job page</li><li>Recruiting outreach</li><li>Application screening, with an optional AI phone screen</li><li>Offers and e-signature</li><li>Onboarding checklists and document collection</li><li>Tax-form tracking</li><li>AI answers to handbook and policy questions</li></ul></div><div class="release"><h3>${APR}</h3><p>Run the school year</p><ul><li>Compensation and payroll</li><li>Time and attendance</li><li>Paid time off and leave, including Family and Medical Leave (FMLA)</li><li>Substitutes and coverage</li><li>Benefits</li><li>Performance: observations, reviews and goals</li><li>Exits</li></ul></div></div>${note('These dates become public commitments when this page goes live. The project record lists the January and April baseline as at risk. Confirm both dates, or change the labels to “First release” and “Second release”.')}</div></section>

  <section class="section paper" id="pricing"><div class="shell pricing"><div><span class="eyebrow">Pricing</span><h2>Prices you can read before <span class="serif">you call.</span></h2><p class="lede">HR software is hard to compare because most vendors keep their prices private. We will publish ours on this page.</p>${note('No approved figures exist yet, so the public page shows no numbers. Abigail to supply: the unit (for example per employee per month), what each plan includes, how payroll is charged, and any setup fee. Her note also says cost is a supporting point and not a headline, which this section follows.')}</div>${pricingHtml}</div></section>

  <section class="section" id="trust"><div class="shell"><div class="section-head wide"><span class="eyebrow">Privacy, AI and security</span><h2>Questions schools <span class="serif">ask first.</span></h2><p>SpurHR is in development. These are the protections it is being built with. We will publish our security documentation before the first school goes live.</p></div><div class="faq-list">${faqHtml}</div>${note('The four answers without a “Needs review” tag restate decisions in the SpurHR architecture and access-control records. They describe the design, not an audited or certified state. Entries tagged “Needs review” appear only in this preview.')}</div></section>

  <section class="section navy"><div class="shell split"><div class="split-copy"><span class="eyebrow">Who is behind it</span><h2>From the company schools already trust with staffing.</h2><p>Spur has recruited, screened, onboarded, scheduled and paid school staff for years. SpurHR is built on what that work taught us about how schools run.</p><p><a class="text-link" href="${STAFFING_URL}" target="_blank" rel="noopener">See Spur Staffing ↗</a></p>${note('Verified figures go here: years operating, schools served, fill rate, one or two named references. Crystal to confirm before any number is shown.')}</div><div class="steps"><div class="step"><span class="step-num">1</span><div><h3>We have done this work by hand</h3><p>Recruiting, credentialing, onboarding, scheduling and payroll for school staff.</p></div></div><div class="step"><span class="step-num">2</span><div><h3>We built our own software to do it</h3><p>Spur’s staffing teams run on tools we built and maintain ourselves.</p></div></div><div class="step"><span class="step-num">3</span><div><h3>Now schools can use it directly</h3><p>SpurHR brings that experience to your own staff and your own HR office.</p></div></div></div></div></section>

  <section class="cta-band"><div class="shell cta-grid"><div><h2>See it for yourself.</h2><p>Tour a working prototype with sample data, on your own time. Or ask us to walk you through it.</p></div><div class="cta-actions"><a class="button light" href="hr-tour.html">Take the tour →</a><a class="button secondary" href="hr-tour.html#demo">Request a demo</a></div></div></section>`
  });

  const leadForm = (kind, withMessage) => {
    const id = n => `${kind}-${n}`;
    const subject = kind === 'tour' ? 'SpurHR tour access request' : 'SpurHR demo request';
    return `<form class="lead-form" data-kind="${kind}" data-subject="${subject}" data-endpoint="${LEAD_ENDPOINT}" data-recipient="${LEAD_EMAIL}"${STAGING ? ' data-preview="1"' : ''} novalidate><div class="form-grid"><div class="field"><label for="${id('first')}">First name</label><input id="${id('first')}" name="firstName" autocomplete="given-name" required></div><div class="field"><label for="${id('last')}">Last name</label><input id="${id('last')}" name="lastName" autocomplete="family-name" required></div><div class="field full"><label for="${id('email')}">School email</label><input id="${id('email')}" name="email" type="email" autocomplete="email" required></div><div class="field full"><label for="${id('school')}">School or network</label><input id="${id('school')}" name="school" autocomplete="organization" required></div><div class="field full"><label for="${id('role')}">Your role</label><select id="${id('role')}" name="role"><option value="">Choose one</option><option>Head of school or principal</option><option>Network or central office leader</option><option>HR or talent</option><option>Operations</option><option>Finance or payroll</option><option>Board member</option><option>Other</option></select></div>${withMessage ? `<div class="field full"><label for="${id('message')}">What would you like to see?</label><textarea id="${id('message')}" name="message"></textarea></div>` : ''}<div class="field full" hidden><label for="${id('website')}">Leave this field empty</label><input id="${id('website')}" name="website" tabindex="-1" autocomplete="off"></div><div class="field full"><button class="button" type="submit">${kind === 'tour' ? 'Request an access code' : 'Request a demo'} →</button><p class="form-status" role="status" aria-live="polite"></p></div></div></form>`;
  };

  const sandboxLink = SANDBOX_URL
    ? `<a class="button secondary" href="${SANDBOX_URL}" target="_blank" rel="noopener">Open the sandbox ↗</a>`
    : '<span class="caption">The sandbox link will be on this page when it opens.</span>';

  const hrTour = page({
    title: 'Tour SpurHR | Self-guided sandbox and live demo',
    description: 'Tour a working SpurHR prototype with sample data at your own pace, or request a live demo.',
    current: 'tour', canonical: 'hr-tour.html', product: 'hr',
    body: `<section class="page-hero"><div class="shell statement"><span class="eyebrow">Tour SpurHR</span><h1>Look around at your own pace.</h1><p>The sandbox is a working prototype with sample schools and sample staff. Nothing in it is real, and nothing you do reaches anyone. You do not need to book time with us to see it.</p><div class="tour-points"><div class="tour-point"><h3>Switch seats</h3><p>See the same school as a network HR director, a principal, a teacher, a substitute and a candidate.</p></div><div class="tour-point"><h3>Follow a walkthrough</h3><p>Each area has a guided path that steps through the work and shows who decides what.</p></div><div class="tour-point"><h3>Start over any time</h3><p>Reset returns everything to its first state. Other visitors never see your changes.</p></div></div></div></section>
  <section class="section"><div class="shell tour-grid"><div class="contact-card" id="tour"><h2>Get an access code</h2><p>Tell us who you are and we will email you a code for the sandbox.</p>${leadForm('tour', false)}<div class="have-code"><h3>Already have a code?</h3><p style="margin:.4rem 0 1rem;color:var(--ink-muted)">Open the sandbox and enter it there.</p>${sandboxLink}</div></div><div class="contact-card" id="demo"><h2>Request a live demo</h2><p>Prefer a guided look with time for questions? We will set up a call with someone who knows the product and knows schools.</p>${leadForm('demo', true)}</div></div><div class="shell">${note('Abigail pointed to Lattice: enter your details and start the tour at once, with no call. Glenn wants the sandbox behind a shared code so competitors cannot browse it. This page does both halves it can: details are captured here, and the code is sent by a person. To make access instant, the form would have to reveal the code on submit, which makes the code public. Decide which matters more.')}${note(`In this preview the forms are logged on the preview server and not emailed. For the public site they need a delivery address. The current default is ${LEAD_EMAIL}, the address the existing sales form uses.`)}</div></section>`
  });

  return { hr, hrTour };
};

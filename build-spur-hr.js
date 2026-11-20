// Spur HR product pages: hr.html and hr-tour.html.
// Called by build-back-office.js, which supplies the shared page shell.
//
// Content rules for these pages:
//   - Every release claim carries its date. Leave out anything with no committed date.
//   - Product screenshots come from the prototype (tools/capture-spurhr-screens.mjs) and are
//     captioned as sample data. Illustrations say they are illustrations.
//   - An FAQ entry with `review` set is published only in a STAGING build, until the named
//     reviewer clears it. Remove the `review` field to publish it.
//   - Pricing figures come from `pricing` below. While it is null the public page shows no numbers.

module.exports = function buildSpurHr({ page, note, plain, STAGING, STAFFING_URL, LEAD_ENDPOINT, LEAD_EMAIL, SANDBOX_URL }) {
  const JAN = 'January 2027';
  const APR = 'April 2027';
  const tagJan = `<span class="tag jan">${JAN}</span>`;
  const tagApr = `<span class="tag apr">${APR}</span>`;
  const tagSample = '<span class="tag sample">Sample data</span>';

  // Approved price points go here, for example:
  //   { unit: 'per employee, per month', plans: [{ name: '…', price: '$…', includes: ['…'] }] }
  const pricing = null;

  // A product screenshot in a plain window frame.
  const shot = (file, alt, caption, eager) => `<figure class="shot"><div class="shot-bar" aria-hidden="true"><i></i><i></i><i></i></div><img src="images/spurhr/${file}.webp" alt="${plain(alt)}" width="1600" height="1000"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}><figcaption>${caption}</figcaption></figure>`;

  const bought = ['Applicant tracking', 'HR records', 'Payroll', 'Performance management'];
  const chores = ['Retype the new hire', 'Chase signatures', 'Check licenses', 'Fix timesheets', 'Re-enter it in payroll', 'Answer the same question again'];

  const features = [
    {
      eyebrow: 'Your new HR team member',
      title: 'It works like a recruiter and an HR generalist <span class="serif">on your team.</span>',
      copy: 'Spur&nbsp;HR drafts, screens, schedules and follows up. The work arrives finished and ready for your review, the way it would from a strong hire.',
      points: ['Writes the job posting from your notes and your template', 'Screens every application against your criteria and shows its reasons', 'Runs an optional phone screen and hands you the summary and transcript'],
      tag: tagJan,
      shot: shot('candidates', 'Spur&nbsp;HR candidates screen. A banner says a candidate’s AI phone screen is ready to review, above a list of applicants and their status.', 'Candidates, from the Spur&nbsp;HR prototype. Sample data.')
    },
    {
      eyebrow: 'You supervise',
      title: 'It runs itself. You supervise <span class="serif">and approve.</span>',
      copy: 'Spur&nbsp;HR never approves, rejects, publishes or pays. It brings each decision to the right person with what they need to make it. Managing it feels like managing a great HR hire.',
      points: ['One list of what is waiting on you, across every school', 'Every decision carries the name of the person who made it', 'Every step also works by hand'],
      quote: 'Let the computers do the clerical work, so you can do the thinking work.',
      tag: tagJan,
      shot: shot('onboarding', 'Spur&nbsp;HR onboarding screen. Two clearance decisions wait for the HR director, above clearance status and credentials that expire soon.', 'Onboarding, from the Spur&nbsp;HR prototype. Sample data.')
    },
    {
      eyebrow: 'Built for schools',
      title: 'Built for how <span class="serif">schools run.</span>',
      copy: 'Generic HR platforms are built for offices. Schools run on campuses, credentials, school-year calendars and bell schedules. In Spur&nbsp;HR those are part of the design.',
      points: ['Networks with several campuses and legal employers', 'Licenses, endorsements, clearances and their expiry dates', 'Absences, substitutes and coverage, period by period'],
      tag: tagApr,
      shot: shot('coverage', 'Spur&nbsp;HR coverage screen. A teacher is out today and each class period shows who has been offered the coverage.', 'Coverage, from the Spur&nbsp;HR prototype. Sample data.')
    }
  ];

  const modules = [
    { name: 'Applicant tracking', tag: tagJan, items: ['Job postings on your school’s own job page', 'Recruiting outreach', 'Application screening, with an optional phone screen', 'Offers and e-signature'] },
    { name: 'HR records and onboarding', tag: tagJan, items: ['Onboarding checklists and document collection', 'Clearances and credentials', 'Tax-form tracking', 'Answers to handbook and policy questions'] },
    { name: 'Payroll and time', tag: tagApr, items: ['Compensation and payroll', 'Time and attendance', 'Paid time off and leave, including Family and Medical Leave (FMLA)', 'Substitutes, coverage and benefits'] },
    { name: 'Performance management', tag: tagApr, items: ['Observations and check-ins', 'Reviews and goals', 'Staff surveys', 'Exits'] }
  ];

  const example = [
    ['ai', 'The Spur&nbsp;HR recruiter finds math teachers who fit the role and invites them to apply.'],
    ['ai', 'A job description, written from the facts you give and your school’s template.'],
    ['you', 'You edit and approve it. The posting goes to your school’s job page.'],
    ['ai', 'Each application is screened against your criteria, with the reasons shown.'],
    ['you', 'You choose who to interview. A person can always take the phone screen.'],
    ['ai', 'The offer letter and signature packet are prepared.'],
    ['you', 'You approve the offer. Onboarding starts when it is signed.']
  ];

  const faqs = [
    ['Who can see our staff data?', 'Each school or network is kept separate from every other customer. Inside your account, access follows fixed roles and is limited by school, by legal employer and by sensitive field. A principal sees their own school. Medical and leave documents are open only to the specialists who need them. Spur support staff have no standing access to your records. Support access is requested for a named task, approved by your school, time-limited and logged.'],
    ['Does AI make decisions about our people?', 'No. AI drafts, summarizes and flags. It cannot approve or reject a candidate, publish a posting, change access or release payroll. Those actions belong to a named person, and the record shows who took them. You can turn AI off for any kind of work and do that work by hand.'],
    ['How is sensitive information protected?', 'Data is encrypted in transit and at rest. Social Security numbers and bank details are collected by the payroll provider, so Spur&nbsp;HR does not hold raw copies. Privileged accounts require multi-factor authentication. Sensitive reads, downloads and access changes are written to an audit log that cannot be edited.'],
    ['Do we have to move payroll to use Spur&nbsp;HR?', `No. Recruiting and onboarding in the ${JAN} release work without payroll. Payroll arrives in ${APR}, and you choose whether to adopt it.`],
    ['Is our data used to train AI models?', 'Answer pending.', 'Needs the terms of the AI providers Spur&nbsp;HR will use. Do not publish an answer until those are confirmed.'],
    ['Is Spur&nbsp;HR HIPAA compliant?', 'HIPAA applies to health plans, health care providers and the companies that handle health information for them. Most records an employer keeps about its own staff, including leave and accommodation paperwork, are employment records and not HIPAA records. Other laws, such as the ADA and the Family and Medical Leave Act (FMLA), still require an employer to keep them confidential. Spur&nbsp;HR keeps medical and leave documents apart from the personnel file, with their own access rules. If your benefits plan needs a business associate agreement, tell us before you sign up.', 'Legal review. This is a general description of the law, drafted without counsel. No compliance or certification claim is made.'],
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
    title: 'Spur&nbsp;HR | The HR system that does the work',
    description: 'Schools buy HR software, then hire people to run it. Spur&nbsp;HR does the work: applicant tracking, HR records, payroll and performance management in one system. Your people make the call.',
    current: 'hr', canonical: 'hr.html', product: 'hr',
    body: `<section class="hr-top"><div class="shell"><div class="hr-top-copy"><span class="eyebrow">Spur&nbsp;HR</span><h1>Schools buy HR software. <span class="hl">Then hire people to run it.</span></h1><p class="lede">Spur&nbsp;HR is the HR system that does the work. It handles applicant tracking, HR records, payroll and performance management like a capable member of your team. Your people make the call.</p><div class="hero-actions"><a class="button signal" href="hr-tour.html">Take the self-guided tour →</a><a class="button ghost" href="hr-tour.html#demo">Request a demo</a></div><p class="release-line">First release ${tagJan} More in ${tagApr}</p></div>${shot('home', 'Spur&nbsp;HR home screen for a network HR director. A list titled Waiting on you shows eight items, each with a status and an Open button.', 'Home, from the Spur&nbsp;HR prototype. Sample data.', true)}</div></section>

  <section class="section problem"><div class="shell problem-grid"><div><span class="eyebrow">The real cost of HR software</span><h2>The software was never <span class="serif">the hard part.</span></h2><p class="lede">A school buys four systems. Then someone on staff spends their week moving information among them and chasing people for the rest.</p></div><div class="stack" aria-label="What schools buy, and the staff work that comes with it"><div class="stack-col"><p class="stack-label">What schools buy</p>${bought.map(b => `<span class="chip solid">${b}</span>`).join('')}</div><div class="stack-col"><p class="stack-label">What it still takes</p>${chores.map(c => `<span class="chip chore">${c}</span>`).join('')}<span class="chip staff">Staff time to run it all</span></div></div></div><div class="shell"><p class="turn">Spur&nbsp;HR does that work. <span class="serif">You make the call.</span></p></div></section>

  ${features.map((f, i) => `<section class="section feature${i % 2 ? ' flip' : ' paper'}"><div class="shell feature-grid"><div class="feature-copy"><span class="eyebrow">${f.eyebrow}</span><h2>${f.title}</h2><p class="lede">${f.copy}</p><ul class="checks">${f.points.map(p => `<li>${p}</li>`).join('')}</ul>${f.quote ? `<blockquote class="pull">${f.quote}</blockquote>` : ''}<p class="release-line">${f.tag}</p></div>${f.shot}</div></section>`).join('\n  ')}

  <section class="section controls"><div class="shell controls-grid"><div><span class="eyebrow">You stay in control</span><h2>You decide what AI handles. <span class="serif">Function by function.</span></h2><p class="lede">Turn AI on or off for each kind of work. Have it write job descriptions but leave interviews to your team. Turn all of it on, and HR runs itself under your supervision.</p>${note('The promo shows a “What Spur AI handles” screen. It is not in the November 11 prototype source used for these screenshots, so this panel is an illustration. Replace it with the real screen when the final prototype is captured. Confirm per-function switches are in the January build.')}</div><figure class="panel" style="margin:0" aria-label="Illustration of the AI settings screen"><div class="panel-head"><strong>What Spur AI handles</strong><span>4 of 5 on</span></div><ul class="switch-list"><li>Write job descriptions<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li><li>Screen applications<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li><li>Conduct first-round interviews<span class="switch-state">Off</span><span class="switch" aria-hidden="true"></span></li><li>Run onboarding paperwork<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li><li>Answer staff HR questions<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li></ul><figcaption class="panel-foot caption">Illustration. A named person still approves what matters.</figcaption></figure></div></section>

  <section class="pillar-band"><div class="shell"><ol class="pillar-row"><li><span>01</span>One system instead of many.</li><li><span>02</span>Built for how schools run.</li><li><span>03</span>AI assists. People decide.</li></ol>${note('These are Abigail’s three pillars. Her original second pillar reads “Built for how charter schools run.” Her note on the promo today asks for “schools” in place of “charter and independent schools”, so this page says “schools” throughout. Confirm with her.')}</div></section>

  <section class="section paper" id="modules"><div class="shell"><div class="section-head wide"><span class="eyebrow">One system instead of many</span><h2>Everything HR, in <span class="serif">one place.</span></h2><p>One record for each person, from first application to last paycheck. Nothing is typed twice.</p></div><div class="module-grid">${modules.map(m => `<div class="module"><div class="module-head"><h3>${m.name}</h3>${m.tag}</div><ul>${m.items.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>${note('The four modules follow Abigail’s promo note to add performance management beside applicant tracking, HR records and payroll. The dates become public commitments when this page goes live, and the project record lists the January and April baseline as at risk. Confirm both, or change the labels to “First release” and “Second release”.')}</div></section>

  <section class="section" id="example"><div class="shell"><div class="section-head wide"><span class="eyebrow">A worked example</span><h2>Hiring a 5th grade math teacher, <span class="serif">start to finish.</span></h2><p>Seven steps. Spur&nbsp;HR prepares four of them. A person decides the other three.</p></div><p class="flow-key"><span><i></i> Spur&nbsp;HR prepares</span><span><i class="you"></i> You decide</span></p><ol class="flow-steps">${example.map(([who, text]) => `<li class="${who}"><b>${who === 'you' ? 'You decide' : 'Spur&nbsp;HR prepares'}</b>${text}</li>`).join('')}</ol>${note('Abigail asked for a small case study in place of savings graphics. Spur&nbsp;HR has no customers yet, so this is an illustration of the workflow with no time or cost figures. A real case study replaces it once a design partner is live. The promo’s “about half the cost” line is not used here, in line with her note that cost supports the story and does not lead it.')}</div></section>

  <section class="section paper" id="reports"><div class="shell"><div class="section-head wide"><span class="eyebrow">See your people and your numbers</span><h2>A page for every staff member. A summary for <span class="serif">your board.</span></h2><p>The numbers a board asks for come from the same records your team already works in.</p></div><div class="sample-grid"><div class="sample-card"><div class="sample-head"><h3>Recruiting pipeline</h3><span class="sample-tags">${tagJan}${tagSample}</span></div>${bars([['Applied', 86, 86], ['Screened', 41, 86], ['Interviewed', 14, 86], ['Offered', 5, 86], ['Hired', 4, 86]])}<p class="caption" style="margin:0">Open roles this hiring season, all campuses.</p></div><div class="sample-card"><div class="sample-head"><h3>Time to fill</h3><span class="sample-tags">${tagJan}${tagSample}</span></div><p class="figure">32 days<small>Median, posting approved to offer signed</small></p>${bars([['Teachers', 36, 45], ['Support staff', 21, 45], ['Leadership', 44, 45]])}</div></div><div class="report-shot">${shot('performance', 'Spur&nbsp;HR performance screen listing surveys, check-ins, goals, formal reviews and observations for one school, each with its status.', `Performance, from the Spur&nbsp;HR prototype. Sample data. ${APR}.`)}</div>${note('Recruiting pipeline and time to fill are in the approved fixed reports. Abigail also asked for attrition and cost per hire. Neither has a committed release, so they are left out until a date is set.')}</div></section>

  <section class="section" id="pricing"><div class="shell pricing"><div><span class="eyebrow">Pricing</span><h2>Spend less on the back office. Invest more in <span class="serif">the classroom.</span></h2><p class="lede">HR software is hard to compare because most vendors keep their prices private. We will publish ours on this page.</p>${note('No approved figures exist yet, so the public page shows no numbers. Abigail to supply: the unit, what each plan includes, how payroll is charged, and any setup fee. If Spur wants to state a target such as “about half the cost of a generic HR platform”, it needs a price and a comparison to stand on.')}</div>${pricingHtml}</div></section>

  <section class="section paper" id="trust"><div class="shell"><div class="section-head wide"><span class="eyebrow">Privacy, AI and security</span><h2>Questions schools <span class="serif">ask first.</span></h2><p>Spur&nbsp;HR is in development. These are the protections it is being built with. We will publish our security documentation before the first school goes live.</p></div><div class="faq-list">${faqHtml}</div>${note('The four answers without a “Needs review” tag restate decisions in the Spur&nbsp;HR architecture and access-control records. They describe the design, not an audited or certified state. Entries tagged “Needs review” appear only in this preview.')}</div></section>

  <section class="section navy"><div class="shell split"><div class="split-copy"><span class="eyebrow">Who is behind it</span><h2>From the company schools already trust with staffing.</h2><p>Spur has recruited, screened, onboarded, scheduled and paid school staff for years. Spur&nbsp;HR is built on what that work taught us about how schools run.</p><p><a class="text-link" href="${STAFFING_URL}" target="_blank" rel="noopener">See Spur Staffing ↗</a></p>${note('Verified figures go here: years operating, schools served, fill rate, one or two named references. Crystal to confirm before any number is shown.')}</div><div class="steps"><div class="step"><span class="step-num">1</span><div><h3>We have done this work by hand</h3><p>Recruiting, credentialing, onboarding, scheduling and payroll for school staff.</p></div></div><div class="step"><span class="step-num">2</span><div><h3>We built our own software to do it</h3><p>Spur’s staffing teams run on tools we built and maintain ourselves.</p></div></div><div class="step"><span class="step-num">3</span><div><h3>Now schools can use it directly</h3><p>Spur&nbsp;HR brings that experience to your own staff and your own HR office.</p></div></div></div></div></section>

  <section class="cta-band"><div class="shell cta-grid"><div><h2>See it for yourself.</h2><p>Tour a working prototype with sample data, on your own time. Or ask us to walk you through it.</p></div><div class="cta-actions"><a class="button light" href="hr-tour.html">Take the tour →</a><a class="button secondary" href="hr-tour.html#demo">Request a demo</a></div></div></section>`
  });

  const leadForm = (kind, withMessage) => {
    const id = n => `${kind}-${n}`;
    const subject = kind === 'tour' ? 'Spur HR tour access request' : 'Spur HR demo request';
    return `<form class="lead-form" data-kind="${kind}" data-subject="${subject}" data-endpoint="${LEAD_ENDPOINT}" data-recipient="${LEAD_EMAIL}"${STAGING ? ' data-preview="1"' : ''} novalidate><div class="form-grid"><div class="field"><label for="${id('first')}">First name</label><input id="${id('first')}" name="firstName" autocomplete="given-name" required></div><div class="field"><label for="${id('last')}">Last name</label><input id="${id('last')}" name="lastName" autocomplete="family-name" required></div><div class="field full"><label for="${id('email')}">School email</label><input id="${id('email')}" name="email" type="email" autocomplete="email" required></div><div class="field full"><label for="${id('school')}">School or network</label><input id="${id('school')}" name="school" autocomplete="organization" required></div><div class="field full"><label for="${id('role')}">Your role</label><select id="${id('role')}" name="role"><option value="">Choose one</option><option>Head of school or principal</option><option>Network or central office leader</option><option>HR or talent</option><option>Operations</option><option>Finance or payroll</option><option>Board member</option><option>Other</option></select></div>${withMessage ? `<div class="field full"><label for="${id('message')}">What would you like to see?</label><textarea id="${id('message')}" name="message"></textarea></div>` : ''}<div class="field full" hidden><label for="${id('website')}">Leave this field empty</label><input id="${id('website')}" name="website" tabindex="-1" autocomplete="off"></div><div class="field full"><button class="button" type="submit">${kind === 'tour' ? 'Request an access code' : 'Request a demo'} →</button><p class="form-status" role="status" aria-live="polite"></p></div></div></form>`;
  };

  const sandboxLink = SANDBOX_URL
    ? `<a class="button secondary" href="${SANDBOX_URL}" target="_blank" rel="noopener">Open the sandbox ↗</a>`
    : '<span class="caption">The sandbox link will be on this page when it opens.</span>';

  const hrTour = page({
    title: 'Tour Spur&nbsp;HR | Self-guided sandbox and live demo',
    description: 'Tour a working Spur&nbsp;HR prototype with sample data at your own pace, or request a live demo.',
    current: 'tour', canonical: 'hr-tour.html', product: 'hr',
    body: `<section class="page-hero"><div class="shell statement"><span class="eyebrow">Tour Spur&nbsp;HR</span><h1>Look around at your own pace.</h1><p>The sandbox is a working prototype with sample schools and sample staff. Nothing in it is real, and nothing you do reaches anyone. You do not need to book time with us to see it.</p><div class="tour-points"><div class="tour-point"><h3>Switch seats</h3><p>See the same school as a network HR director, a principal, a teacher, a substitute and a candidate.</p></div><div class="tour-point"><h3>Follow a walkthrough</h3><p>Each area has a guided path that steps through the work and shows who decides what.</p></div><div class="tour-point"><h3>Start over any time</h3><p>Reset returns everything to its first state. Other visitors never see your changes.</p></div></div></div></section>
  <section class="section"><div class="shell tour-grid"><div class="contact-card" id="tour"><h2>Get an access code</h2><p>Tell us who you are and we will email you a code for the sandbox.</p>${leadForm('tour', false)}<div class="have-code"><h3>Already have a code?</h3><p style="margin:.4rem 0 1rem;color:var(--ink-muted)">Open the sandbox and enter it there.</p>${sandboxLink}</div></div><div class="contact-card" id="demo"><h2>Request a live demo</h2><p>Prefer a guided look with time for questions? We will set up a call with someone who knows the product and knows schools.</p>${leadForm('demo', true)}</div></div><div class="shell">${note('Abigail pointed to Lattice: enter your details and start the tour at once, with no call. The sandbox sits behind a shared code so competitors cannot browse it, so a person sends the code. To make access instant, the form would have to reveal the code on submit, which makes the code public. Decide which matters more.')}${note(`In this preview the forms are logged on the preview server and not emailed. For the public site they need a delivery address. The current default is ${LEAD_EMAIL}, the address the existing sales form uses.`)}</div></section>`
  });

  return { hr, hrTour };
};

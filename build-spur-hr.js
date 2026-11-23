// Spur HR product pages: hr.html and hr-tour.html.
// Called by build-back-office.js, which supplies the shared page shell.
//
// Content rules for these pages:
//   - Every release claim carries its date. Leave out anything with no committed date.
//   - Product screenshots come from the prototype (tools/capture-spurhr-screens.mjs) and are
//     captioned as sample data. Illustrations say they are illustrations.
//   - An FAQ entry with `review` set is published only in a STAGING build, until the named
//     reviewer clears it. Remove the `review` field to publish it.
//   - The price comes from `pricing` below. The pricing section says nothing about payroll cost.

module.exports = function buildSpurHr({ page, note, plain, STAGING, STAFFING_URL, LEAD_ENDPOINT, LEAD_EMAIL, SANDBOX_URL }) {
  const JAN = 'January 2027';
  const APR = 'April 2027';
  const tagJan = `<span class="tag jan">${JAN}</span>`;
  const tagApr = `<span class="tag apr">${APR}</span>`;
  const tagSample = '<span class="tag sample">Sample data</span>';

  // The published price, approved by Glenn on 2026-11-20. Say nothing about payroll cost here.
  const pricing = {
    price: '$35',
    unit: 'per employee, per month',
    points: ['On a one-year agreement', 'One price for the whole product', 'No modules sold separately']
  };

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
      shot: shot('candidates', 'Spur&nbsp;HR candidates screen. A banner says a candidate’s AI phone screen is ready to review, above a filter for each opening and a list of candidates with their job, stage, next step and status.', 'Candidates, from the Spur&nbsp;HR prototype. Sample data.')
    },
    {
      eyebrow: 'You supervise',
      title: 'It runs itself. You supervise <span class="serif">and approve.</span>',
      copy: 'Spur&nbsp;HR never approves, rejects, publishes or pays. It brings each decision to the right person with what they need to make it. Managing it feels like managing a great HR hire.',
      points: ['One list of what is waiting on you, across every school', 'Every decision carries the name of the person who made it', 'Every step also works by hand'],
      quote: 'Let the computers do the clerical work, so you can do the thinking work.',
      tag: tagJan,
      shot: shot('onboarding', 'Spur&nbsp;HR onboarding screen. Two clearance decisions wait for the HR director, above a table of each candidate’s clearance, assignment and onboarding status.', 'Onboarding, from the Spur&nbsp;HR prototype. Sample data.')
    },
    {
      eyebrow: 'Built for schools',
      title: 'Built for how <span class="serif">schools run.</span>',
      copy: 'Generic HR platforms are built for offices. Schools run on campuses, credentials, school-year calendars and bell schedules. In Spur&nbsp;HR those are part of the design.',
      points: ['Networks with several campuses and legal employers', 'Licenses, endorsements, clearances and their expiry dates', 'Absences, substitutes and coverage, period by period'],
      tag: tagApr,
      shot: shot('coverage', 'Spur&nbsp;HR coverage screen. A teacher is out today. Her day is laid out period by period, and each block shows that it has been offered to the substitute pool and no one has taken it yet.', 'Coverage, from the Spur&nbsp;HR prototype. Sample data.')
    }
  ];

  // What is included, and when. From the partner scope document; performance management is April 2027.
  const J = 'jan', A = 'apr';
  const scope = [
    { name: 'Recruiting', rows: [['Job postings', J], ['Spur&nbsp;HR recruiter: sourcing and outreach', J], ['Candidate screening', J], ['Candidate interviews', J], ['Candidate offers', J]] },
    { name: 'HR records and onboarding', rows: [['Onboarding for your organization', J], ['Tax forms and compliance', J], ['Staff handbook and policies: current-year policies for new hires', J], ['Full staff handbook and policy management', A], ['Onboarding for compensation', A]] },
    { name: 'Payroll, time and leave', rows: [['Payroll', A], ['Time and attendance', A], ['Time off', A], ['Substitutes and coverage', A], ['Family and medical leave', A], ['Benefits enrollment', A], ['Employee exits', A]] },
    { name: 'Performance management', rows: [['1:1 check-ins', A], ['Staff satisfaction and engagement surveys', A], ['Goal tracking', A], ['Formal reviews', A], ['Informal and formal observations', A], ['Formal warnings', A], ['Performance improvement plans', A], ['Promotion decisions', A]] }
  ];
  const scopeHtml = `<div class="scope-grid">${scope.map((m, i) => `<div class="scope-module"><h3 id="scope-${i}">${m.name}</h3><table class="scope-table" aria-labelledby="scope-${i}"><thead><tr><th scope="col">Function</th><th scope="col">Release</th></tr></thead><tbody>${m.rows.map(([fn, when]) => `<tr><th scope="row">${fn}</th><td>${when === J ? tagJan : tagApr}</td></tr>`).join('')}</tbody></table></div>`).join('')}</div>`;

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
    ['Is Spur&nbsp;HR HIPAA compliant?', 'Spur&nbsp;HR is not a health plan. For benefits, it keeps the plan name, coverage tier, deduction amount and enrollment status for each employee. Employees make their elections with your benefits provider or carrier, not in Spur&nbsp;HR. Leave and accommodation paperwork is kept apart from the personnel file, with its own access rules.', 'Needs counsel before it is public. Drafted from the November 20 decision: Spur&nbsp;HR is not a health plan, holds only plan name, coverage tier, deduction amount and enrollment status, and elections happen with the provider or carrier. No compliance or certification claim is made.'],
    ['What happens to our data if we leave?', 'You can export your records before the account closes. We agree a retention and deletion schedule with you in writing, and legal holds are honored.', 'Abigail to confirm the commitment and wording.']
  ];

  const faqHtml = faqs
    .filter(f => !f[2] || STAGING)
    .map((f, i) => `<div class="faq-item"><button type="button" aria-expanded="false" aria-controls="faq-hr-${i}"><span>${f[0]}${f[2] ? '<span class="needs-review">Needs review</span>' : ''}</span><span aria-hidden="true">+</span></button><div class="faq-answer" id="faq-hr-${i}"><p>${f[1]}</p>${f[2] ? note(f[2]) : ''}</div></div>`)
    .join('');

  const pricingHtml = `<div class="pricing-card"><p class="price">${pricing.price}<span>${pricing.unit}</span></p><ul class="checks">${pricing.points.map(x => `<li>${x}</li>`).join('')}</ul><p class="price-note">New charter school, or fewer than 30&nbsp;staff? <a class="text-link nowrap" href="contact-sales.html?service=spur-hr">Talk to us about pricing →</a></p></div>`;

  const bars = (rows, { unit = '', stacked = false } = {}) => `<ul class="bars${stacked ? ' stacked' : ''}">${rows.map(([label, value, max]) => `<li><span>${label}</span><span class="track"><span class="fill" style="width:${Math.round(value / max * 100)}%"></span></span><b>${value}${unit}</b></li>`).join('')}</ul>`;

  // Analytics samples. School-level totals only on the dashboard. The staff page shows records
  // Spur HR will hold, never a score, risk level or prediction about a person.
  const tile = (title, tag, inner, wide) => `<div class="tile${wide ? ' wide' : ''}"><div class="tile-head"><h4>${title}</h4>${tag}</div>${inner}</div>`;
  const dashboard = `<div class="dash"><div class="dash-bar"><strong>School dashboard</strong><span>Riverbend Schools, all campuses</span>${tagSample}</div><div class="dash-grid">${[
    tile('Recruiting pipeline', tagJan, `${bars([['Applied', 86, 86], ['Screened', 41, 86], ['Interviewed', 14, 86], ['Offered', 5, 86], ['Hired', 4, 86]])}<p class="caption">Open roles this hiring season.</p>`, true),
    tile('Time to fill', tagJan, `<p class="figure">32 days<small>Median, posting approved to offer signed</small></p>${bars([['Teachers', 36, 45], ['Support staff', 21, 45], ['Leadership', 44, 45]], { unit: 'd' })}`, true),
    tile('Headcount', tagApr, `<p class="figure">148<small>Staff on payroll today</small></p>${bars([['Teachers', 92, 92], ['Support staff', 41, 92], ['Leadership', 15, 92]])}`),
    tile('Time off', tagApr, `<p class="figure">214 days<small>Taken this school year</small></p>${bars([['Sick', 118, 118], ['Personal', 64, 118], ['FMLA leave', 32, 118]])}`),
    tile('Staff survey', tagApr, `<p class="figure">81%<small>Responded to the fall survey</small></p>${bars([['I feel supported by school leaders', 78, 100], ['I have what I need to do my job', 84, 100], ['I would recommend working here', 71, 100]], { unit: '%', stacked: true })}`)
  ].join('')}</div></div>`;
  const record = rows => `<dl class="record">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  const staffPage = `<div class="dash"><div class="dash-bar person"><span class="avatar" aria-hidden="true">LC</span><span class="who"><strong>Lee Carter</strong><span>5th grade math, Riverbend Middle</span></span>${tagSample}</div><div class="dash-grid person-grid">${[
    tile('Credentials and clearances', tagJan, record([['Teaching license, math 4–8', 'Valid to June 2029'], ['Background check', 'Cleared'], ['Fingerprints', 'Cleared'], ['First aid and CPR', 'Renew by March 2027']])),
    tile('Goals', tagApr, record([['Lead 5th grade math planning', 'In progress'], ['Finish new curriculum training', 'Done']])),
    tile('Check-ins and reviews', tagApr, record([['1:1 check-in, Nov 17', 'Notes shared'], ['1:1 check-in, Oct 20', 'Notes shared'], ['Annual review, 2026–27', 'Due in May']])),
    tile('Time off', tagApr, record([['Sick days', '2 used, 8 left'], ['Personal days', '1 used, 2 left'], ['Next', 'Dec 19, approved']]))
  ].join('')}</div></div>`;

  const hr = page({
    title: 'Spur&nbsp;HR | The HR system that does the work',
    description: 'Schools buy HR software, then hire people to run it. Spur&nbsp;HR does the work: recruiting, HR records, payroll and performance management in one system. Your people make the call.',
    current: 'hr', canonical: 'hr.html', product: 'hr',
    body: `<section class="hr-top"><div class="shell"><div class="hr-top-copy"><span class="eyebrow">Spur&nbsp;HR</span><h1>Schools buy HR software. <span class="hl">Then hire people to run it.</span></h1><p class="lede">Spur&nbsp;HR is the HR system that does the work. It handles recruiting, HR records, payroll and performance management like a capable member of your team. Your people make the call.</p><div class="hero-actions"><a class="button signal" href="hr-tour.html">Take the self-guided tour →</a><a class="button ghost" href="hr-tour.html#demo">Request a demo</a></div><p class="release-line">First release ${tagJan} More in ${tagApr}</p>${note('The product screenshots on this page were recaptured on November 23 from the current prototype. They still show the old Spur logo, because the prototype still uses it: its copy of the design system predates the new wordmark. Recapture them once the prototype takes in the new logo.')}</div>${shot('home', 'Spur&nbsp;HR home screen for a network HR director. Under Waiting on you, the first five of nine items each show a status and an Open button, below sort and filter controls.', 'Home, from the Spur&nbsp;HR prototype. Sample data.', true)}</div></section>

  <section class="section problem"><div class="shell problem-grid"><div><span class="eyebrow">The real cost of HR software</span><h2>The software was never <span class="serif">the hard part.</span></h2><p class="lede">A school buys four systems. Then someone on staff spends their week moving information among them and chasing people for the rest.</p></div><div class="stack" aria-label="What schools buy, and the staff work that comes with it"><div class="stack-col"><p class="stack-label">What schools buy</p>${bought.map(b => `<span class="chip solid">${b}</span>`).join('')}</div><div class="stack-col"><p class="stack-label">What it still takes</p>${chores.map(c => `<span class="chip chore">${c}</span>`).join('')}<span class="chip staff">Staff time to run it all</span></div></div></div><div class="shell"><p class="turn">Spur&nbsp;HR does that work. <span class="serif">You make the call.</span></p></div></section>

  ${features.map((f, i) => `<section class="section feature${i % 2 ? ' flip' : ' paper'}"><div class="shell feature-grid"><div class="feature-copy"><span class="eyebrow">${f.eyebrow}</span><h2>${f.title}</h2><p class="lede">${f.copy}</p><ul class="checks">${f.points.map(p => `<li>${p}</li>`).join('')}</ul>${f.quote ? `<blockquote class="pull">${f.quote}</blockquote>` : ''}<p class="release-line">${f.tag}</p></div>${f.shot}</div></section>`).join('\n  ')}

  <section class="section controls"><div class="shell controls-grid"><div><span class="eyebrow">You stay in control</span><h2>You decide what AI handles. <span class="serif">Function by function.</span></h2><p class="lede">Turn AI on or off for each kind of work. Have it write job descriptions but leave interviews to your team. Turn all of it on, and HR runs itself under your supervision.</p>${note('This panel is an illustration of the “What Spur AI handles” screen from the promo. It stays an illustration until the final prototype screens arrive, then the real screen replaces it.')}</div><figure class="panel" style="margin:0" aria-label="Illustration of the AI settings screen"><div class="panel-head"><strong>What Spur AI handles</strong><span>4 of 5 on</span></div><ul class="switch-list"><li>Write job descriptions<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li><li>Screen applications<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li><li>Conduct first-round interviews<span class="switch-state">Off</span><span class="switch" aria-hidden="true"></span></li><li>Run onboarding paperwork<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li><li>Answer staff HR questions<span class="switch-state">On</span><span class="switch on" aria-hidden="true"></span></li></ul><figcaption class="panel-foot caption">Illustration. A named person still approves what matters.</figcaption></figure></div></section>

  <section class="pillar-band"><div class="shell"><ol class="pillar-row"><li><span>01</span>One system instead of many.</li><li><span>02</span>Built for how schools run.</li><li><span>03</span>AI assists. People decide.</li></ol></div></section>

  <section class="section" id="overview"><div class="shell"><div class="section-head wide"><span class="eyebrow">A quick look</span><h2>See how Spur&nbsp;HR <span class="serif">does the work.</span></h2><p>A 49-second product overview. Sample screens show AI preparing the work and people making the decisions.</p></div><video controls playsinline preload="metadata" aria-label="Spur HR product overview, silent video with sample screens" style="display:block;width:100%;aspect-ratio:16/9;border-radius:var(--radius);background:var(--brand-slate)"><source src="media/spur-hr-overview.mp4" type="video/mp4"><a href="media/spur-hr-overview.mp4">Download the product overview</a></video><p class="caption">Silent video. Illustrative prototype, not a live customer system. Recruiting and HR records: ${JAN}. Payroll, time and performance management: ${APR}.</p></div></section>

  <section class="section paper" id="modules"><div class="shell"><div class="section-head wide"><span class="eyebrow">One system instead of many</span><h2>What is included, <span class="serif">and when.</span></h2><p>One record for each person, from first application to last paycheck. Nothing is typed twice. Every function has its release date.</p><p class="release-key"><span>${tagJan} First release</span><span>${tagApr} Second release</span></p></div>${scopeHtml}</div></section>

  <section class="section" id="example"><div class="shell"><div class="section-head wide"><span class="eyebrow">A worked example</span><h2>Hiring a 5th grade math teacher, <span class="serif">start to finish.</span></h2><p>Seven steps. Spur&nbsp;HR prepares four of them. A person decides the other three.</p></div><p class="flow-key"><span><i></i> Spur&nbsp;HR prepares</span><span><i class="you"></i> You decide</span></p><ol class="flow-steps">${example.map(([who, text]) => `<li class="${who}"><b>${who === 'you' ? 'You decide' : 'Spur&nbsp;HR prepares'}</b>${text}</li>`).join('')}</ol></div></section>

  <section class="section paper" id="analytics"><div class="shell"><div class="section-head wide"><span class="eyebrow">Analytics</span><h2>See the whole school, <span class="serif">and every person in it.</span></h2><p>Reports come from the records your team already keeps. Nothing to export, and nothing to add up by hand.</p></div><div class="analytics-part"><div class="part-head"><h3>A dashboard for each school</h3><p>Totals for one campus or the whole network.</p></div>${dashboard}</div><div class="analytics-part"><div class="part-head"><h3>A page for each staff member</h3><p>Credentials, goals, check-ins, reviews and time off, in one record.</p></div>${staffPage}</div>${note('Per-person risk levels, academic data and attrition prediction are left out on purpose, pending a scope decision. Attrition rate and cost per hire are also left out until they have a release date. Headcount is tagged April 2027 to be safe. If it ships with HR records in January, change the tag.')}</div></section>

  <section class="section" id="pricing"><div class="shell pricing"><div><span class="eyebrow">Pricing</span><h2>Spend less on the back office. Invest more in <span class="serif">the classroom.</span></h2><p class="lede">Most HR vendors keep their prices private, which makes them hard to compare. Spur&nbsp;HR has one price for the whole product, and it is on this page.</p></div>${pricingHtml}</div></section>

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
  <section class="section"><div class="shell tour-grid"><div class="contact-card" id="tour"><h2>Get an access code</h2><p>Tell us who you are and we will email you a code for the sandbox.</p>${leadForm('tour', false)}<div class="have-code"><h3>Already have a code?</h3><p style="margin:.4rem 0 1rem;color:var(--ink-muted)">Open the sandbox and enter it there.</p>${sandboxLink}</div></div><div class="contact-card" id="demo"><h2>Request a live demo</h2><p>Prefer a guided look with time for questions? We will set up a call with someone who knows the product and knows schools.</p>${leadForm('demo', true)}</div></div><div class="shell">${note('The sandbox keeps the shared code Abigail accepted. Access requests go to a person, who sends the code; no automatic code disclosure or outreach enrollment.')}${note(`In this preview the forms are logged and not emailed. The public HR tour and demo forms use the contact API and route to ${LEAD_EMAIL}. The general sales form still prepares an email to support@spured.com.`)}</div></section>`
  });

  return { hr, hrTour };
};

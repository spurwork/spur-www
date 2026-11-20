(function () {
  const mobileButton = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.primary-nav');
  const services = document.querySelector('.nav-services');
  const servicesButton = services && services.querySelector(':scope > button');

  function closeMenus() {
    if (nav) nav.classList.remove('open');
    if (mobileButton) {
      mobileButton.setAttribute('aria-expanded', 'false');
      mobileButton.setAttribute('aria-label', 'Open navigation');
    }
    if (services) services.classList.remove('open');
    if (servicesButton) servicesButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  if (mobileButton && nav) {
    mobileButton.addEventListener('click', function () {
      const opening = !nav.classList.contains('open');
      nav.classList.toggle('open', opening);
      mobileButton.setAttribute('aria-expanded', String(opening));
      mobileButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
      document.body.classList.toggle('menu-open', opening);
    });
  }

  if (servicesButton && services) {
    servicesButton.addEventListener('click', function () {
      const opening = !services.classList.contains('open');
      services.classList.toggle('open', opening);
      servicesButton.setAttribute('aria-expanded', String(opening));
    });
  }

  document.addEventListener('click', function (event) {
    if (services && !services.contains(event.target)) {
      services.classList.remove('open');
      if (servicesButton) servicesButton.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenus();
  });

  document.querySelectorAll('.faq-item button').forEach(function (button) {
    button.addEventListener('click', function () {
      const item = button.closest('.faq-item');
      const opening = !item.classList.contains('open');
      item.classList.toggle('open', opening);
      button.setAttribute('aria-expanded', String(opening));
      const symbol = button.querySelector(':scope > span:last-child');
      if (symbol) symbol.textContent = opening ? '−' : '+';
    });
  });

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get('service');
  const interest = document.getElementById('interest');
  const serviceNames = {
    'finance-accounting': 'Finance & Accounting',
    'substitute-desk': 'Substitute Desk',
    'federal-programs': 'Federal Programs',
    'spur-hr': 'Spur HR'
  };
  if (interest && serviceNames[requestedService]) interest.value = serviceNames[requestedService];

  const salesForm = document.getElementById('sales-form');
  if (salesForm) {
    salesForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!salesForm.reportValidity()) return;
      const data = new FormData(salesForm);
      const subject = `Back-office services — ${data.get('school')}`;
      const body = [
        `Name: ${data.get('firstName')} ${data.get('lastName')}`,
        `Email: ${data.get('email')}`,
        `School or district: ${data.get('school')}`,
        `Interest: ${data.get('interest') || 'Not specified'}`,
        '',
        data.get('message') || 'No additional details provided.'
      ].join('\n');
      const recipient = salesForm.dataset.recipient;
      const status = salesForm.querySelector('.form-status');
      if (status) status.textContent = 'Your email app should open with the details ready to send.';
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  // Spur HR tour and demo requests. With an endpoint the form posts to it.
  // Without one it opens a pre-addressed email, like the sales form above.
  document.querySelectorAll('.lead-form').forEach(function (form) {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    function say(text, isError) {
      if (!status) return;
      status.textContent = text;
      status.classList.toggle('error', Boolean(isError));
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      if (data.get('website')) return; // filled only by bots
      data.delete('website');
      const kind = form.dataset.kind;
      const done = kind === 'tour'
        ? 'Thank you. We will email your access code.'
        : 'Thank you. We will be in touch to set up a time.';
      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        const lines = [];
        data.forEach(function (value, key) { if (value) lines.push(key + ': ' + value); });
        say('Your email app should open with the details ready to send.');
        window.location.href = 'mailto:' + form.dataset.recipient +
          '?subject=' + encodeURIComponent(form.dataset.subject + ' — ' + data.get('school')) +
          '&body=' + encodeURIComponent(lines.join('\n'));
        return;
      }
      data.append('kind', kind);
      data.append('page', window.location.pathname);
      if (button) button.disabled = true;
      say('Sending…');
      fetch(endpoint, { method: 'POST', body: new URLSearchParams(data) })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed');
          form.reset();
          say(done + (form.dataset.preview ? ' (Preview: this request was logged, not emailed.)' : ''));
        })
        .catch(function () {
          say('We could not send your request. Please email ' + form.dataset.recipient + '.', true);
        })
        .then(function () { if (button) button.disabled = false; });
    });
  });
})();

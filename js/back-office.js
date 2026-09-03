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
      const symbol = button.querySelector('span:last-child');
      if (symbol) symbol.textContent = opening ? '−' : '+';
    });
  });

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get('service');
  const interest = document.getElementById('interest');
  const serviceNames = {
    'finance-accounting': 'Finance & Accounting',
    'substitute-desk': 'Substitute Desk',
    'federal-programs': 'Federal Programs'
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
})();

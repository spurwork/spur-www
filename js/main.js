// Mega Menu Card Clicks - Switch to correct service tab
document.querySelectorAll('.mega-menu-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const tabId = card.getAttribute('data-tab');
    if (tabId) {
      // Update active tab
      document.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
      const targetTab = document.querySelector(`.service-tab[data-tab="${tabId}"]`);
      if (targetTab) targetTab.classList.add('active');

      // Update active panel
      document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById('panel-' + tabId);
      if (targetPanel) targetPanel.classList.add('active');
    }
  });
});

// Services Tab Switching
document.querySelectorAll('.service-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabId = tab.getAttribute('data-tab');

    // Update active tab
    document.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Update active panel
    document.querySelectorAll('.service-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + tabId).classList.add('active');
  });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const wasActive = item.classList.contains('active');

    // Close all items
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

    // Open clicked item if it wasn't already open
    if (!wasActive) {
      item.classList.add('active');
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .result-card, .testimonial-card, .case-study-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

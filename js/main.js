// Banner Dismiss (session only - reappears on page reload)
document.addEventListener('DOMContentLoaded', () => {
  const bannerDismiss = document.querySelector('.banner-dismiss');
  const esserBanner = document.getElementById('esser-banner');

  if (bannerDismiss && esserBanner) {
    bannerDismiss.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      esserBanner.classList.add('hidden');
      document.body.classList.add('banner-hidden');
    });
  }
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileCloseBtn = document.querySelector('.mobile-close-btn');
const navLinks = document.querySelector('.nav-links');

function closeMobileMenu() {
  if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
  if (navLinks) navLinks.classList.remove('active');
  document.body.style.overflow = '';
}

function openMobileMenu() {
  if (mobileMenuToggle) mobileMenuToggle.classList.add('active');
  if (navLinks) navLinks.classList.add('active');
  document.body.style.overflow = 'hidden';
}

if (mobileMenuToggle && navLinks) {
  // Toggle menu on hamburger click
  mobileMenuToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close menu on X button click
  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking a link (but not section headers)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Mobile nav section accordion
  const mobileNavSections = navLinks.querySelectorAll('.mobile-nav-section');
  mobileNavSections.forEach(section => {
    const header = section.querySelector('.mobile-nav-section-header');
    if (header) {
      header.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        section.classList.toggle('active');
      });
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // Handle window resize - close menu if resizing to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && navLinks.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}

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

// Counter Animation for Savings Amount
function animateCounter(element, target, duration = 2000) {
  const startTime = performance.now();
  const startValue = 0;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function formatNumber(num) {
    return '$' + Math.floor(num).toLocaleString('en-US');
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const currentValue = startValue + (target - startValue) * easedProgress;

    element.textContent = formatNumber(currentValue);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Observe savings amount and trigger counter animation
const savingsAmount = document.querySelector('.savings-amount[data-target]');
if (savingsAmount) {
  const savingsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target, 10);
        animateCounter(entry.target, target, 2500);
        savingsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  savingsObserver.observe(savingsAmount);
}

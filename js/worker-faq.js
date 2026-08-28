(function () {
  'use strict';

  var searchInput = document.getElementById('worker-faq-search');
  var clearButton = document.getElementById('worker-faq-clear');
  var status = document.getElementById('worker-faq-status');
  var emptyState = document.getElementById('worker-faq-empty');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('.faq-filter'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('.worker-faq-section'));
  var items = Array.prototype.slice.call(document.querySelectorAll('.worker-faq-item'));
  var activeFilter = 'all';

  if (!searchInput || !status) return;

  function normalize(value) {
    return value.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  function updateResults() {
    var query = normalize(searchInput.value);
    var visibleCount = 0;

    items.forEach(function (item) {
      var categoryMatches = activeFilter === 'all' || item.dataset.group === activeFilter;
      var searchMatches = !query || item.dataset.search.indexOf(query) !== -1;
      var isVisible = categoryMatches && searchMatches;
      item.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    sections.forEach(function (section) {
      var hasVisibleItem = section.querySelector('.worker-faq-item:not([hidden])');
      section.hidden = !hasVisibleItem;
    });

    clearButton.hidden = !searchInput.value;
    emptyState.hidden = visibleCount !== 0;

    var label = visibleCount === 1 ? 'topic' : 'topics';
    if (query) {
      status.textContent = 'Found ' + visibleCount + ' ' + label + ' for “' + searchInput.value.trim() + '”';
    } else if (activeFilter !== 'all') {
      status.textContent = 'Showing ' + visibleCount + ' ' + label + ' in this category';
    } else {
      status.textContent = 'Showing all ' + visibleCount + ' topics';
    }
  }

  function setFilter(filter) {
    activeFilter = filter;
    filterButtons.forEach(function (button) {
      var isActive = button.dataset.filter === filter;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    updateResults();
  }

  function resetFaq() {
    searchInput.value = '';
    setFilter('all');
    searchInput.focus();
  }

  searchInput.addEventListener('input', updateResults);
  clearButton.addEventListener('click', resetFaq);

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setFilter(button.dataset.filter);
    });
  });

  document.querySelectorAll('[data-search-suggestion]').forEach(function (button) {
    button.addEventListener('click', function () {
      searchInput.value = button.dataset.searchSuggestion;
      setFilter('all');
      searchInput.focus();
    });
  });

  document.querySelectorAll('[data-reset-faq]').forEach(function (button) {
    button.addEventListener('click', resetFaq);
  });

  document.getElementById('worker-faq-expand').addEventListener('click', function () {
    items.forEach(function (item) {
      if (!item.hidden) item.open = true;
    });
  });

  document.getElementById('worker-faq-collapse').addEventListener('click', function () {
    items.forEach(function (item) { item.open = false; });
  });

  document.querySelectorAll('[data-copy-link]').forEach(function (button) {
    button.addEventListener('click', function () {
      var url = window.location.origin + window.location.pathname + '#' + button.dataset.copyLink;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(function () {
          button.textContent = 'Link copied';
          window.setTimeout(function () { button.textContent = 'Copy link to this answer'; }, 1800);
        });
      } else {
        window.location.hash = button.dataset.copyLink;
      }
    });
  });

  document.addEventListener('keydown', function (event) {
    var target = event.target;
    var isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
    if (event.key === '/' && !isTyping) {
      event.preventDefault();
      searchInput.focus();
    }
    if (event.key === 'Escape' && document.activeElement === searchInput) {
      resetFaq();
      searchInput.blur();
    }
  });

  function openHashTarget() {
    if (!window.location.hash) return;
    var target = document.getElementById(window.location.hash.slice(1));
    if (target && target.matches('.worker-faq-item')) {
      target.open = true;
      target.scrollIntoView({ block: 'start' });
    }
  }

  window.addEventListener('hashchange', openHashTarget);
  openHashTarget();
  updateResults();
})();

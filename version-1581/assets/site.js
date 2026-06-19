(function () {
  function normalize(text) {
    return (text || '').toString().toLowerCase().trim();
  }

  function initMobileMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initLocalSearch() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-local-search]'));
    if (!inputs.length) {
      return;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));

    function apply(value) {
      var query = normalize(value);
      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var visible = !query || haystack.indexOf(query) !== -1;
        card.classList.toggle('hidden', !visible);
      });
    }

    inputs.forEach(function (input) {
      if (input.hasAttribute('data-query-fill')) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
          input.value = q;
          apply(q);
        }
      }
      input.addEventListener('input', function () {
        apply(input.value);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHero();
    initLocalSearch();
  });
})();

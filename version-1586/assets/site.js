
(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var active = 0;

    function showHero(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === active);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showHero(active + 1);
      }, 5200);
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  var filterRoot = document.querySelector('[data-filter-root]');
  var filterList = document.querySelector('[data-filter-list]');

  if (filterRoot && filterList) {
    var textInput = filterRoot.querySelector('[data-filter-text]');
    var yearSelect = filterRoot.querySelector('[data-filter-year]');
    var typeSelect = filterRoot.querySelector('[data-filter-type]');
    var regionSelect = filterRoot.querySelector('[data-filter-region]');
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');

    if (query && textInput) {
      textInput.value = query;
    }

    function applyFilter() {
      var q = normalize(textInput && textInput.value);
      var year = normalize(yearSelect && yearSelect.value);
      var type = normalize(typeSelect && typeSelect.value);
      var region = normalize(regionSelect && regionSelect.value);

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-category'),
          card.textContent
        ].join(' '));
        var passText = !q || text.indexOf(q) !== -1;
        var passYear = !year || normalize(card.getAttribute('data-year')) === year;
        var passType = !type || normalize(card.getAttribute('data-type')).indexOf(type) !== -1;
        var passRegion = !region || normalize(card.getAttribute('data-region')) === region;
        card.classList.toggle('hidden-by-filter', !(passText && passYear && passType && passRegion));
      });
    }

    [textInput, yearSelect, typeSelect, regionSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }
})();

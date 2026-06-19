(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      siteNav.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("active", dotIndex === current);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showSlide(Number(dot.getAttribute("data-target")) || 0);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll(".js-search"));
  var yearFilters = Array.prototype.slice.call(document.querySelectorAll(".js-year-filter"));

  function filterCards(scope) {
    var root = scope.closest("main") || document;
    var input = root.querySelector(".js-search");
    var yearFilter = root.querySelector(".js-year-filter");
    var cards = Array.prototype.slice.call(root.querySelectorAll(".movie-card"));
    var empty = root.querySelector(".no-results");
    var keyword = input ? input.value.trim().toLowerCase() : "";
    var year = yearFilter ? yearFilter.value : "";
    var visible = 0;

    cards.forEach(function (card) {
      var text = (card.getAttribute("data-search") || "").toLowerCase();
      var cardYear = card.getAttribute("data-year") || "";
      var matchedText = !keyword || text.indexOf(keyword) !== -1;
      var matchedYear = !year || cardYear.indexOf(year) !== -1;
      var matched = matchedText && matchedYear;

      card.classList.toggle("is-hidden", !matched);

      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle("show", visible === 0 && cards.length > 0);
    }
  }

  searchInputs.forEach(function (input) {
    input.addEventListener("input", function () {
      filterCards(input);
    });
  });

  yearFilters.forEach(function (select) {
    select.addEventListener("change", function () {
      filterCards(select);
    });
  });
}());

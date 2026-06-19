(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileNav() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', nav.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });
    show(0);
    restart();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function filterCards(input, targetSelector) {
    var target = document.querySelector(targetSelector);
    if (!target) {
      return;
    }
    var keyword = normalize(input.value);
    var cards = selectAll('[data-search-text]', target);
    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-search-text'));
      card.classList.toggle('is-filtered-out', keyword && text.indexOf(keyword) === -1);
    });
  }

  function setupLocalFilters() {
    selectAll('[data-local-filter]').forEach(function (input) {
      var targetSelector = input.getAttribute('data-local-filter');
      input.addEventListener('input', function () {
        filterCards(input, targetSelector);
      });
    });
  }

  function setupSearchPage() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var pageForm = document.querySelector('[data-page-search]');
    var inline = document.querySelector('[data-search-grid]') ? document.querySelector('[data-local-filter="#search-grid"]') : null;
    if (pageForm) {
      var pageInput = pageForm.querySelector('input[name="q"]');
      if (pageInput) {
        pageInput.value = query;
      }
    }
    if (inline && query) {
      inline.value = query;
      filterCards(inline, '#search-grid');
    }
  }

  function setupPlayer() {
    selectAll('.stream-player').forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.player-cover');
      var sourceUrl = player.getAttribute('data-video');
      var attached = false;

      function attachSource() {
        if (attached || !video || !sourceUrl) {
          return;
        }
        attached = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = sourceUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(sourceUrl);
          hls.attachMedia(video);
        } else {
          video.src = sourceUrl;
        }
      }

      function start() {
        attachSource();
        if (cover) {
          cover.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }

      if (cover) {
        cover.addEventListener('click', start);
      }
      if (video) {
        video.addEventListener('play', function () {
          if (cover) {
            cover.classList.add('is-hidden');
          }
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileNav();
    setupHero();
    setupLocalFilters();
    setupSearchPage();
    setupPlayer();
  });
})();

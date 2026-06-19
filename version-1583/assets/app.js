(function() {
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function() {
      panel.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const thumbs = Array.from(hero.querySelectorAll('.hero-thumb'));
    let index = 0;
    const show = function(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === index);
      });
      thumbs.forEach(function(thumb, i) {
        thumb.classList.toggle('active', i === index);
      });
    };
    thumbs.forEach(function(thumb, i) {
      thumb.addEventListener('click', function() {
        show(i);
      });
    });
    if (slides.length > 1) {
      setInterval(function() {
        show(index + 1);
      }, 5200);
    }
  }

  const scopes = document.querySelectorAll('[data-filter-scope]');
  scopes.forEach(function(scope) {
    const input = scope.querySelector('.filter-input');
    const buttons = Array.from(scope.querySelectorAll('[data-filter-type]'));
    const list = scope.parentElement.querySelector('[data-filter-list]');
    if (!list) {
      return;
    }
    const items = Array.from(list.children);
    let type = 'all';
    const apply = function() {
      const value = input ? input.value.trim().toLowerCase() : '';
      items.forEach(function(item) {
        const text = (item.getAttribute('data-title') || item.textContent || '').toLowerCase();
        const itemType = item.getAttribute('data-type') || '';
        const matchesText = !value || text.indexOf(value) !== -1;
        const matchesType = type === 'all' || itemType === type;
        item.classList.toggle('is-hidden', !(matchesText && matchesType));
      });
    };
    if (input) {
      input.addEventListener('input', apply);
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) {
        input.value = q;
      }
    }
    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        type = button.getAttribute('data-filter-type') || 'all';
        buttons.forEach(function(btn) {
          btn.classList.toggle('active', btn === button);
        });
        apply();
      });
    });
    apply();
  });
})();

function setupVideoPlayer(playerUrl) {
  const video = document.getElementById('moviePlayer');
  const overlay = document.getElementById('playOverlay');
  if (!video || !playerUrl) {
    return;
  }
  let attached = false;
  const attach = function() {
    if (attached) {
      return;
    }
    attached = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = playerUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true
      });
      hls.loadSource(playerUrl);
      hls.attachMedia(video);
    } else {
      video.src = playerUrl;
    }
  };
  const start = function() {
    attach();
    if (overlay) {
      overlay.classList.add('hidden');
    }
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function() {});
    }
  };
  if (overlay) {
    overlay.addEventListener('click', start);
  }
  video.addEventListener('click', function() {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener('play', function() {
    if (overlay) {
      overlay.classList.add('hidden');
    }
  });
}

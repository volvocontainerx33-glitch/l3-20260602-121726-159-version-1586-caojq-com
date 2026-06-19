(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var navButton = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = selectAll('[data-hero-slide]', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    var current = 0;

    function show(index) {
      current = index % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }

  function startVideo(box) {
    var video = box.querySelector('video');
    var source = box.getAttribute('data-stream');
    if (!video || !source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.src) {
        video.src = source;
      }
      video.play().catch(function () {});
      box.classList.add('playing');
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!box._hlsReady) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        box._hlsReady = true;
      }
      video.play().catch(function () {});
      box.classList.add('playing');
      return;
    }

    if (!video.src) {
      video.src = source;
    }
    video.play().catch(function () {});
    box.classList.add('playing');
  }

  selectAll('.watch-player').forEach(function (box) {
    var button = box.querySelector('.player-start');
    var video = box.querySelector('video');
    if (button) {
      button.addEventListener('click', function () {
        startVideo(box);
      });
    }
    if (video) {
      video.addEventListener('click', function () {
        startVideo(box);
      });
      video.addEventListener('play', function () {
        box.classList.add('playing');
      });
    }
  });
}());

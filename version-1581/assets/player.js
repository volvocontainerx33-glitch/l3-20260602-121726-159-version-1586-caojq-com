(function () {
  function initPlayer(video) {
    if (!video || video.dataset.ready === '1') {
      return;
    }

    var source = video.getAttribute('data-src');
    if (!source) {
      return;
    }

    video.dataset.ready = '1';

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        video.play().catch(function () {});
      }, { once: true });
    } else {
      video.src = source;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.video-shell'));
    shells.forEach(function (shell) {
      var video = shell.querySelector('video');
      var overlay = shell.querySelector('.play-overlay');
      if (!video || !overlay) {
        return;
      }

      overlay.addEventListener('click', function () {
        overlay.classList.add('hidden');
        initPlayer(video);
      });

      video.addEventListener('play', function () {
        overlay.classList.add('hidden');
      });
    });
  });
})();

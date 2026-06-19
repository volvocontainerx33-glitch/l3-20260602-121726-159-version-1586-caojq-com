
import { H as Hls } from './hls-vendor-dru42stk.js';

(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));

  players.forEach(function (shell) {
    var video = shell.querySelector('video');
    var cover = shell.querySelector('[data-play]');
    var source = video ? video.getAttribute('data-video') : '';
    var ready = false;
    var hlsInstance = null;

    function init() {
      if (ready || !video || !source) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = source;
    }

    function start() {
      init();
      shell.classList.add('is-playing');
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
      });
      init();
    }
  });
})();

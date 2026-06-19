function ready(callback) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
}

function initMobileNav() {
  var toggle = document.querySelector("[data-mobile-toggle]");
  var nav = document.querySelector("[data-mobile-nav]");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    nav.classList.toggle("is-open");
  });
}

function initHeroSlider() {
  var slider = document.querySelector("[data-hero-slider]");

  if (!slider) {
    return;
  }

  var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener("click", function () {
      showSlide(dotIndex);
    });
  });

  window.setInterval(function () {
    showSlide(activeIndex + 1);
  }, 5200);
}

function initFilters() {
  var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));

  panels.forEach(function (panel) {
    var section = panel.closest("section") || document;
    var keywordInput = panel.querySelector("[data-filter-keyword]");
    var yearSelect = panel.querySelector("[data-filter-year]");
    var countTarget = panel.querySelector("[data-filter-count]");
    var cards = Array.prototype.slice.call(section.querySelectorAll("[data-movie-card]"));

    function applyFilter() {
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : "";
      var year = yearSelect ? yearSelect.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
        var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchedYear = !year || card.getAttribute("data-year") === year;
        var matched = matchedKeyword && matchedYear;

        card.style.display = matched ? "" : "none";

        if (matched) {
          visible += 1;
        }
      });

      if (countTarget) {
        countTarget.textContent = "显示 " + visible + " 部影片";
      }
    }

    if (keywordInput) {
      keywordInput.addEventListener("input", applyFilter);
    }

    if (yearSelect) {
      yearSelect.addEventListener("change", applyFilter);
    }

    applyFilter();
  });
}

function createSearchCard(movie) {
  var link = document.createElement("a");
  link.className = "result-card";
  link.href = "movie/" + movie.id + ".html";

  var poster = document.createElement("span");
  poster.className = "result-poster";

  var image = document.createElement("img");
  image.src = movie.image + ".jpg";
  image.alt = movie.title;
  image.loading = "lazy";

  var year = document.createElement("span");
  year.textContent = movie.year;

  poster.appendChild(image);
  poster.appendChild(year);

  var body = document.createElement("span");
  body.className = "result-body";

  var title = document.createElement("strong");
  title.textContent = movie.title;

  var line = document.createElement("em");
  line.textContent = movie.one_line;

  var meta = document.createElement("span");
  meta.textContent = movie.region + " · " + movie.genre;

  body.appendChild(title);
  body.appendChild(line);
  body.appendChild(meta);
  link.appendChild(poster);
  link.appendChild(body);

  return link;
}

function initSearchPage() {
  var results = document.querySelector("[data-search-results]");
  var status = document.querySelector("[data-search-status]");
  var input = document.querySelector("[data-search-input]");

  if (!results || !status || !Array.isArray(window.MOVIE_DATA)) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var query = (params.get("q") || "").trim();

  if (input) {
    input.value = query;
  }

  if (!query) {
    status.textContent = "请输入关键词开始搜索。";
    return;
  }

  var lowerQuery = query.toLowerCase();
  var matched = window.MOVIE_DATA.filter(function (movie) {
    var haystack = [
      movie.title,
      movie.region,
      movie.year,
      movie.genre,
      movie.one_line,
      movie.tags.join(" ")
    ].join(" ").toLowerCase();

    return haystack.indexOf(lowerQuery) !== -1;
  });

  status.textContent = "关键词“" + query + "”共找到 " + matched.length + " 部影片";

  matched.slice(0, 300).forEach(function (movie) {
    results.appendChild(createSearchCard(movie));
  });

  if (matched.length > 300) {
    var note = document.createElement("div");
    note.className = "search-status";
    note.textContent = "结果较多，已优先显示前 300 部，可继续输入更精确的关键词。";
    results.appendChild(note);
  }
}

function initPlayers() {
  var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

  players.forEach(function (player) {
    var video = player.querySelector("video");
    var overlay = player.querySelector("[data-player-overlay]");
    var buttons = Array.prototype.slice.call(player.querySelectorAll("[data-play-button]"));
    var source = player.getAttribute("data-src");
    var isLoaded = false;
    var hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function startVideo(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (!isLoaded) {
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }

        video.setAttribute("controls", "controls");
        video.dataset.loaded = "true";
        isLoaded = true;
      }

      player.classList.add("is-ready");

      var promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", startVideo);
    });

    if (overlay) {
      overlay.addEventListener("click", startVideo);
    }

    player.addEventListener("click", function (event) {
      if (!isLoaded && event.target === player) {
        startVideo(event);
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
}

ready(function () {
  initMobileNav();
  initHeroSlider();
  initFilters();
  initSearchPage();
  initPlayers();
});

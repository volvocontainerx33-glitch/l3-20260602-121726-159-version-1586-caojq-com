const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

const initNavigation = () => {
  const button = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-nav");
  if (!button || !menu) {
    return;
  }
  button.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
};

const initHero = () => {
  const slider = document.querySelector(".hero-slider");
  if (!slider) {
    return;
  }
  const slides = Array.from(slider.querySelectorAll(".hero-slide"));
  const dots = Array.from(slider.querySelectorAll(".hero-dot"));
  if (slides.length < 2) {
    return;
  }
  let index = 0;
  let timer;
  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, itemIndex) => {
      slide.classList.toggle("active", itemIndex === index);
    });
    dots.forEach((dot, itemIndex) => {
      dot.classList.toggle("active", itemIndex === index);
    });
  };
  const start = () => {
    timer = window.setInterval(() => show(index + 1), 5000);
  };
  const stop = () => {
    window.clearInterval(timer);
  };
  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      stop();
      show(dotIndex);
      start();
    });
  });
  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  start();
};

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const initFilters = () => {
  const scope = document.querySelector(".filter-scope");
  if (!scope) {
    return;
  }
  const cards = Array.from(scope.querySelectorAll(".filter-card"));
  const searchInput = document.getElementById("search-input");
  const typeFilter = document.getElementById("type-filter");
  const yearFilter = document.getElementById("year-filter");
  const regionFilter = document.getElementById("region-filter");
  const apply = () => {
    const keyword = normalize(searchInput?.value);
    const type = normalize(typeFilter?.value);
    const year = normalize(yearFilter?.value);
    const region = normalize(regionFilter?.value);
    cards.forEach((card) => {
      const text = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.tags,
        card.textContent
      ].join(" "));
      const matchedKeyword = !keyword || text.includes(keyword);
      const matchedType = !type || normalize(card.dataset.type) === type;
      const matchedYear = !year || normalize(card.dataset.year) === year;
      const matchedRegion = !region || normalize(card.dataset.region) === region;
      card.classList.toggle("is-hidden", !(matchedKeyword && matchedType && matchedYear && matchedRegion));
    });
  };
  [searchInput, typeFilter, yearFilter, regionFilter].forEach((control) => {
    if (control) {
      control.addEventListener("input", apply);
      control.addEventListener("change", apply);
    }
  });
  const params = new URLSearchParams(window.location.search);
  const tag = params.get("tag");
  if (tag && searchInput) {
    searchInput.value = tag;
    apply();
  }
};

export const initMoviePlayer = async (videoId, buttonId, source) => {
  const video = document.getElementById(videoId);
  const button = document.getElementById(buttonId);
  if (!video || !button || !source) {
    return;
  }
  let prepared = false;
  let preparing = false;
  const prepare = async () => {
    if (prepared || preparing) {
      return;
    }
    preparing = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else {
      const module = await import("./hls-vendor.js");
      const Hls = module.H;
      if (Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        video.hlsController = hls;
      } else {
        video.src = source;
      }
    }
    prepared = true;
    preparing = false;
  };
  const play = async () => {
    button.classList.add("is-hidden");
    await prepare();
    try {
      await video.play();
    } catch (error) {
      button.classList.remove("is-hidden");
    }
  };
  button.addEventListener("click", play);
  video.addEventListener("click", () => {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener("play", () => {
    button.classList.add("is-hidden");
  });
};

ready(() => {
  initNavigation();
  initHero();
  initFilters();
});

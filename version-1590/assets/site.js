(function () {
    const menuButton = document.querySelector(".menu-button");
    const mobilePanel = document.querySelector(".mobile-panel");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("open");
        });
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dot"));
    let index = 0;

    function setSlide(next) {
        if (!slides.length) {
            return;
        }
        index = next % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("active", i === index);
        });
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
            setSlide(i);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            setSlide(index + 1);
        }, 5200);
    }

    const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
    const cards = Array.from(document.querySelectorAll(".movie-card"));

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const value = button.getAttribute("data-filter") || "all";
            filterButtons.forEach(function (item) {
                item.classList.toggle("active", item === button);
            });
            cards.forEach(function (card) {
                const haystack = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-year") || "",
                    card.getAttribute("data-region") || "",
                    card.getAttribute("data-genre") || ""
                ].join(" ");
                card.style.display = value === "all" || haystack.indexOf(value) !== -1 ? "" : "none";
            });
        });
    });

    const searchForm = document.querySelector(".search-panel");
    const searchInput = document.querySelector("#librarySearch");

    function runSearch() {
        if (!searchInput || !cards.length) {
            return;
        }
        const term = searchInput.value.trim().toLowerCase();
        cards.forEach(function (card) {
            const haystack = [
                card.getAttribute("data-title") || "",
                card.getAttribute("data-year") || "",
                card.getAttribute("data-region") || "",
                card.getAttribute("data-genre") || ""
            ].join(" ").toLowerCase();
            card.style.display = !term || haystack.indexOf(term) !== -1 ? "" : "none";
        });
    }

    if (searchInput) {
        const params = new URLSearchParams(location.search);
        const q = params.get("q");
        if (q) {
            searchInput.value = q;
            runSearch();
        }
        searchInput.addEventListener("input", runSearch);
    }

    if (searchForm) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            runSearch();
        });
    }
})();

function setupPlayer(source) {
    const video = document.getElementById("movieVideo");
    const overlay = document.getElementById("playOverlay");
    const frame = document.getElementById("playerFrame");
    let prepared = false;
    let hls = null;

    function prepare() {
        if (!video || prepared) {
            return;
        }
        prepared = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (typeof Hls !== "undefined" && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function play() {
        prepare();
        if (overlay) {
            overlay.classList.add("hidden");
        }
        const attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener("click", play);
    }

    if (frame) {
        frame.addEventListener("click", function (event) {
            if (event.target === video) {
                return;
            }
            play();
        });
    }

    if (video) {
        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("hidden");
            }
        });
        video.addEventListener("pause", function () {
            if (overlay && video.currentTime === 0) {
                overlay.classList.remove("hidden");
            }
        });
    }
}

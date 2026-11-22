/* ============================================================
   WALKWORLD — app.js
   Homepage + Leaflet map + country panel
   ============================================================ */

/*
  Required:
  - data.js must load before app.js
  - Leaflet 1.9.4 must load before app.js
  - `tours` is defined in data.js
*/

/* ── 1. STATE ─────────────────────────────────────────────── */

document.documentElement.classList.add("is-loading");

let currentFilter = "all";
let searchTerm = "";

const GLOBES = ["🌍", "🌎", "🌏"];

let randomSpinInterval = null;
let randomSpinTimeout = null;
let lastRandomId = null;

let worldMap = null;
let mapMarkers = [];
let selectedCountry = null;

const markerById = new Map();
let markerLayer = null;
let activePinEl = null;
let selectedTourId = null;

const DEFAULT_PANEL_HTML =
  '<p class="panel-empty">Select a country on the map to discover available walking tours.</p>';

// Filled in by initPanelControls() with the panel's original HTML.
let countryPanelDefaultHTML = "";


/* ── 2. HELPERS ───────────────────────────────────────────── */

// Lowercases, trims and strips accents so "São Paulo" matches "sao paulo".
function normalize(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ø/gi, "o")
    .replace(/æ/gi, "ae")
    .replace(/ß/g, "ss")
    .replace(/[\u02bb\u02bc\u2018\u2019]/g, "'")
    .toLowerCase()
    .replace(/^[\s,.;:]+|[\s,.;:]+$/g, "");
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function regionLabel(region) {
  const labels = {
    asia: "Asia",
    europe: "Europe",
    americas: "Americas",
    middleeast: "Middle East",
    africa: "Africa",
    oceania: "Oceania",
    antarctica: "Antarctica"
  };

  return labels[region] || region || "Other";
}

// Accepts "1.2M", "850K", "1,234", "141 920", "6,734 v", "1.2M views".
function parseViews(value) {
  const cleaned = String(value || "").replace(/\s+/g, "");
  const match = cleaned.match(/^([\d,.]+)([KMB])?/i);

  if (!match) return 0;

  const number = parseFloat(match[1].replace(/,/g, ""));
  const suffix = (match[2] || "").toUpperCase();

  const multipliers = {
    K: 1_000,
    M: 1_000_000,
    B: 1_000_000_000
  };

  return (number || 0) * (multipliers[suffix] || 1);
}

// Some videoId values in data.js carry extras like "abc123&t=6s".
function cleanVideoId(id) {
  return String(id || "").split(/[&?#]/)[0].trim();
}

// The "Open in YouTube" link is built from the videoId, so a typo in a tour's
// url field (like a missing "=") can't send people to the YouTube home page.
// A start time (&t=405s) from the url is kept.
function tourWatchUrl(tour) {
  const id = cleanVideoId(tour.videoId);

  if (/^[A-Za-z0-9_-]{11}$/.test(id)) {
    const start = String(tour.url || "").match(/[?&]t=(\d+s?)/);

    return `https://www.youtube.com/watch?v=${id}${start ? `&t=${start[1]}` : ""}`;
  }

  return tour.url || "#";
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) element.textContent = value;
}

function getTourById(id) {
  return tours.find(t => String(t.id) === String(id));
}

function getToursForCountry(country) {
  return tours.filter(t =>
    normalize(t.country) === normalize(country)
  );
}

function getFilteredTours() {
  if (typeof tours === "undefined" || !Array.isArray(tours)) return [];

  return tours.filter(t => {
    const regionMatch =
      currentFilter === "all" ? true :
      currentFilter === "trending" ? Boolean(t.trending) :
      normalize(t.region) === normalize(currentFilter);

    const searchMatch =
      !searchTerm ||
      normalize(t.city).includes(searchTerm) ||
      normalize(t.country).includes(searchTerm) ||
      normalize(t.title).includes(searchTerm) ||
      normalize(t.region).includes(searchTerm);

    return regionMatch && searchMatch;
  });
}

function hasTours() {
  return typeof tours !== "undefined" &&
    Array.isArray(tours) &&
    tours.length > 0;
}


/* ── 3. NAVIGATION ────────────────────────────────────────── */

function toggleMenu() {
  const nav = document.getElementById("mainNav");
  const links = document.getElementById("navLinks");
  const button = document.querySelector(".menu-toggle");

  if (!nav) return;

  nav.classList.toggle("open");

  if (links) {
    links.classList.toggle("open", nav.classList.contains("open"));
  }

  if (button) {
    button.setAttribute(
      "aria-expanded",
      nav.classList.contains("open") ? "true" : "false"
    );
  }
}

function closeMenu() {
  const nav = document.getElementById("mainNav");
  const links = document.getElementById("navLinks");
  const button = document.querySelector(".menu-toggle");

  nav?.classList.remove("open");
  links?.classList.remove("open");
  button?.setAttribute("aria-expanded", "false");
}

function initNavigation() {
  document.querySelectorAll("#navLinks a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", event => {
    const nav = document.getElementById("mainNav");

    if (!nav || !nav.classList.contains("open")) return;

    if (!nav.contains(event.target)) {
      closeMenu();
    }
  });
}

function scrollToTours() {
  document.getElementById("toursSection")?.scrollIntoView({
    behavior: "smooth"
  });
}

function scrollToMap() {
  const target =
    document.getElementById("world-map") ||
    document.getElementById("worldMap");

  target?.scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* ── 4. FILTERS AND SEARCH ─────────────────────────────────── */

function setFilter(region, btn) {
  currentFilter = region;

  document.querySelectorAll(".filter-btn").forEach(button => {
    button.classList.remove("active");
  });

  if (btn) {
    btn.classList.add("active");
  } else {
    document.querySelector(
      `.filter-btn[data-region="${region}"]`
    )?.classList.add("active");
  }

  render();
  updateMapMarkers();
}

let searchDebounce = null;

function filterTours() {
  clearTimeout(searchDebounce);

  searchDebounce = setTimeout(() => {
    const input = document.getElementById("searchInput");

    searchTerm = normalize(input?.value);

    render();
    updateMapMarkers();
  }, 180);
}


/* ── 5. TOUR GRID ─────────────────────────────────────────── */

function render() {
  const grid = document.getElementById("grid");
  const count = document.getElementById("tourCount");

  if (!grid) return;

  if (!hasTours()) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🗺️</div>
        <p>No tours are currently available.</p>
      </div>
    `;

    if (count) count.textContent = "0 tours";
    return;
  }

  const filtered = getFilteredTours();

  if (count) {
    count.textContent =
      `${filtered.length} ${filtered.length === 1 ? "tour" : "tours"}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🗺️</div>
        <p>No tours found. Try another search or region.</p>
      </div>
    `;

    return;
  }

grid.innerHTML = filtered.map((t, i) => {
  return `
    <article class="card boarding-pass"
      data-card-id="${escapeHTML(t.id)}"
      style="${i < 12 ? `animation-delay:${i * 0.04}s` : "animation:none"}">

      <!-- Main ticket section -->
      <div class="ticket-main">

        <div class="ticket-topline">
          <span class="ticket-brand">WALKWORLD</span>

          <div class="ticket-tags">
            ${t.trending
              ? '<span class="ticket-trending">TRENDING</span>'
              : ""}
            <span class="ticket-region">
              ${escapeHTML(regionLabel(t.region))}
            </span>
          </div>
        </div>

        <div class="ticket-destination">
          <div class="ticket-city">
            <span class="ticket-label">YOUR DESTINATION</span>
            <h3>${escapeHTML(t.city)}</h3>
            <p>${escapeHTML(t.country)}</p>
          </div>

          <div class="ticket-destination-icon">
            ${escapeHTML(t.emoji || "🌍")}
          </div>
        </div>

        <div class="ticket-divider">
          <span></span>
          <span class="ticket-divider-line"></span>
          <span></span>
        </div>

        <div class="ticket-details">
          <div>
            <span class="ticket-label">EXPERIENCE</span>
            <strong>${escapeHTML(t.title)}</strong>
          </div>

          <div>
            <span class="ticket-label">DURATION</span>
            <strong>${escapeHTML(t.duration || "Explore")}</strong>
          </div>

          <div>
            <span class="ticket-label">VIEWS</span>
            <strong>${escapeHTML(t.views || "0")}</strong>
          </div>
        </div>

      </div>

      <!-- Ticket stub -->
      <div class="ticket-stub">

        <div class="ticket-stub-top">
          <span class="ticket-label">BOARDING PASS</span>
          <span class="ticket-number">WW-${String(i + 1).padStart(3, "0")}</span>
        </div>

        <div class="ticket-stub-bottom">

          <button
            class="card-locate"
            data-locate-id="${escapeHTML(t.id)}"
            type="button"
            aria-label="Show ${escapeHTML(t.city)} on the map"
            title="Show on map"
          >
            📍
          </button>

          <button
            class="card-watch"
            data-tour-id="${escapeHTML(t.id)}"
            type="button"
          >
            ▶ BOARD
          </button>

        </div>

        <span class="card-visited-tag">✓ VISITED</span>

      </div>

      <!-- Keep the original thumbnail interaction target -->
      <div
        class="card-thumb ticket-click-target"
        data-tour-id="${escapeHTML(t.id)}"
        aria-label="Watch walking tour of ${escapeHTML(t.city)}"
      ></div>

    </article>
  `;
}).join("");


  applySelectedCard();
  applyVisitedAll();
}


/* ── 6. TOUR CARD INTERACTIONS ────────────────────────────── */

function initCardInteractions() {
  const grid = document.getElementById("grid");

  if (!grid || grid.dataset.interactionsReady === "true") return;

  grid.dataset.interactionsReady = "true";

  grid.addEventListener("click", event => {
    const locate = event.target.closest("[data-locate-id]");

    if (locate) {
      selectTour(locate.dataset.locateId, { fly: true, popup: true });
      revealMapIfOffscreen();
      return;
    }

    const target = event.target.closest("[data-tour-id]");

    if (!target) return;

    travelToTour(target.dataset.tourId);
  });

  // Hovering a card lights up its pin on the map.
  grid.addEventListener("mouseover", event => {
    const card = event.target.closest(".card");

    if (card && !card.contains(event.relatedTarget)) {
      setPinActive(card.dataset.cardId, true);
    }
  });

  grid.addEventListener("mouseout", event => {
    const card = event.target.closest(".card");

    if (card && !card.contains(event.relatedTarget)) {
      setPinActive(card.dataset.cardId, false);
    }
  });
}

/* ── YOUTUBE COMPLETION TRACKING ── */

let youtubePlayer = null;
let youtubeApiLoading = false;
let pendingYouTubeTourId = null;
let cinematicHideTimer = null;

function showCinematicControls() {
  const modalBox = document.getElementById("modalBox");

  if (!modalBox) return;

  modalBox.classList.remove("controls-hidden");

  clearTimeout(cinematicHideTimer);

  // Keep controls visible on touch devices
  if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
    return;
  }

  cinematicHideTimer = setTimeout(() => {
    modalBox.classList.add("controls-hidden");
  }, 2500);
}


function initCinematicControls() {
  const modalBox = document.getElementById("modalBox");

  if (!modalBox) return;

  // Attach listeners only once
  if (modalBox.dataset.cinematicReady === "true") return;

  modalBox.dataset.cinematicReady = "true";

modalBox.addEventListener("pointermove", showCinematicControls);
modalBox.addEventListener("pointerenter", showCinematicControls);
}



function createYouTubePlayer() {
  const iframe = document.getElementById("ww-youtube-player");

  if (!iframe || !window.YT?.Player) return;

  if (youtubePlayer) {
    youtubePlayer.destroy();
    youtubePlayer = null;
  }

  youtubePlayer = new YT.Player(iframe, {
    events: {
      onStateChange: event => {
        if (
          event.data === YT.PlayerState.ENDED &&
          pendingYouTubeTourId !== null
        ) {
          markVisited(pendingYouTubeTourId);
          pendingYouTubeTourId = null;

          console.log("WalkWorld: tour completed!");
        }
      }
    }
  });
}

function loadYouTubeAPI() {
  if (window.YT?.Player) {
    createYouTubePlayer();
    return;
  }

  if (youtubeApiLoading) return;

  youtubeApiLoading = true;

  window.onYouTubeIframeAPIReady = () => {
    createYouTubePlayer();
  };

  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(script);
}

/* ── 7. VIDEO MODAL ───────────────────────────────────────── */

function openModal(id) {
  pendingYouTubeTourId = null;
  if (!hasTours()) return;

  const tour = getTourById(id);

  if (!tour) return;

  const modal = document.getElementById("modal");
  const videoEl = document.getElementById("modalVideo");

  if (!modal || !videoEl) return;

  const cityEl = document.getElementById("modalCity");
  const titleEl = document.getElementById("modalTitle");
  const viewsEl = document.getElementById("modalViews");
  const ytLink = document.getElementById("modalYTLink");

  if (cityEl) cityEl.textContent = `${tour.city}, ${tour.country}`;
  if (titleEl) titleEl.textContent = tour.title;

  if (viewsEl) {
    viewsEl.textContent = `${tour.views} views · ${tour.duration}`;
  }

  if (ytLink) ytLink.href = tourWatchUrl(tour);

  
  if (tour.videoId) {
   const iframe = document.createElement("iframe");

iframe.id = "ww-youtube-player";

iframe.src =
  `https://www.youtube.com/embed/${encodeURIComponent(cleanVideoId(tour.videoId))}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;

    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";

    iframe.allowFullscreen = true;
    iframe.title = tour.title;

 pendingYouTubeTourId = String(tour.id);

if (youtubePlayer) {
  youtubePlayer.destroy();
  youtubePlayer = null;
}

videoEl.replaceChildren(iframe);

loadYouTubeAPI();
  } else {
    videoEl.innerHTML = `
      <div class="modal-placeholder">
        <div class="big-emoji">${escapeHTML(tour.emoji)}</div>
        <p class="placeholder-title">${escapeHTML(tour.title)}</p>
        <p>No direct video embed is available yet.</p>
        <a
          href="${escapeHTML(tourWatchUrl(tour))}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Search for it on YouTube ↗
        </a>
      </div>
    `;
  }

  modal.classList.add("open");
  document.body.style.overflow = "hidden";

initCinematicControls();
showCinematicControls();

 openTourId = String(tour.id);
loadLocalNow(tour);
}

function closeModal() {
  const modal = document.getElementById("modal");
  const videoEl = document.getElementById("modalVideo");

  clearTimeout(cinematicHideTimer);

  document.getElementById("modalBox")
  ?.classList.remove("controls-hidden");

  modal?.classList.remove("open");

  clearInterval(nowTimer);
  nowAbort?.abort();
  openTourId = null;
  pendingYouTubeTourId = null;
  
// Destroy the YouTube player before removing its iframe.
if (youtubePlayer) {
  youtubePlayer.destroy();
  youtubePlayer = null;
}

if (videoEl) videoEl.replaceChildren();

document.body.style.overflow = "";

document.body.style.overflow = "";

// Apply any map updates postponed while the video was open.
if (mapRefreshPending) {
  updateMapMarkers();
}
}

function handleBackdropClick(event) {
  if (event.target === document.getElementById("modal")) {
    closeModal();
  }
}


/* ── 8. FEATURED DAILY TOUR ───────────────────────────────── */

function updateFeaturedCard() {
  if (!hasTours()) return;

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - startOfYear) / 86400000);

  const featuredTour = tours[dayOfYear % tours.length];

  const titleEl = document.querySelector(".featured-title");
  const cityEl = document.querySelector(".featured-city");
  const viewsEl = document.querySelector(".featured-views");
  const buttonEl = document.querySelector(".watch-pill");
  const thumbEl = document.querySelector(".featured-thumb");
  const emojiEl = document.querySelector(".featured-emoji");

  if (titleEl) titleEl.textContent = featuredTour.title;

  if (cityEl) {
    cityEl.textContent = `${featuredTour.city}, ${featuredTour.country}`;
  }

  if (viewsEl) {
    const strong = document.createElement("strong");
    strong.textContent = featuredTour.views;

    viewsEl.replaceChildren(
      strong,
      document.createTextNode(` views · ${featuredTour.duration}`)
    );
  }

  if (thumbEl) {
    thumbEl.style.background = featuredTour.color || "#dce9ff";

    const iframe = thumbEl.querySelector(".card-video");

    if (iframe) {
      iframe.removeAttribute("src");
      thumbEl.classList.remove("playing");
    }

    thumbEl.onclick = () => openModal(featuredTour.id);
    thumbEl.style.cursor = "pointer";
  }

  if (emojiEl) emojiEl.textContent = featuredTour.emoji || "🌍";

  if (buttonEl) buttonEl.onclick = () => openModal(featuredTour.id);
}


/* ── 9. RANDOM TOUR GENERATOR ─────────────────────────────── */

function openRandomTour() {
  if (!hasTours()) return;

  const backdrop = document.getElementById("randomBackdrop");

  if (!backdrop) return;

  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";

  spinAgain();
}

function spinAgain() {
  if (!hasTours()) return;

  const spinner = document.getElementById("randomSpinner");
  const result = document.getElementById("randomResult");
  const globe = document.getElementById("randomGlobe");
  const label = document.getElementById("randomLabel");

  if (!spinner || !result || !globe || !label) return;

  clearInterval(randomSpinInterval);
  clearTimeout(randomSpinTimeout);

  spinner.style.display = "flex";
  result.style.display = "none";

  let i = 0;
  let labelIndex = 0;

  const spinLabels = [
    "Spinning the globe…",
    "Finding somewhere new…",
    "Could be anywhere…",
    "Almost there…"
  ];

  randomSpinInterval = setInterval(() => {
    globe.textContent = GLOBES[i % GLOBES.length];

    if (i % 6 === 0) {
      label.textContent = spinLabels[labelIndex % spinLabels.length];
      labelIndex++;
    }

    i++;
  }, 120);

  randomSpinTimeout = setTimeout(() => {
    clearInterval(randomSpinInterval);
    randomSpinInterval = null;

    const availableTours = tours.filter(t =>
      tours.length <= 1 || String(t.id) !== String(lastRandomId)
    );

    const pick = availableTours[
      Math.floor(Math.random() * availableTours.length)
    ];

    if (!pick) return;

    lastRandomId = pick.id;

    globe.textContent = pick.emoji || "🌍";

    const cityEl = document.getElementById("randomResultCity");
    const titleEl = document.getElementById("randomResultTitle");
    const metaEl = document.getElementById("randomResultMeta");
    const watchBtn = document.getElementById("randomWatchBtn");

    if (cityEl) cityEl.textContent = `${pick.city}, ${pick.country}`;
    if (titleEl) titleEl.textContent = pick.title;

    if (metaEl) {
      metaEl.textContent = `${pick.views} views · ${pick.duration}`;
    }

    if (watchBtn) {
      watchBtn.onclick = () => {
        closeRandom();
        travelToTour(pick.id);
      };
    }

    randomSpinTimeout = setTimeout(() => {
      spinner.style.display = "none";
      result.style.display = "flex";
      randomSpinTimeout = null;
    }, 300);

  }, 1800);
}

function closeRandom() {
  clearInterval(randomSpinInterval);
  clearTimeout(randomSpinTimeout);

  randomSpinInterval = null;
  randomSpinTimeout = null;

  document.getElementById("randomBackdrop")?.classList.remove("open");

  document.body.style.overflow = "";
}

function handleRandomBackdropClick(event) {
  if (event.target === document.getElementById("randomBackdrop")) {
    closeRandom();
  }
}


/* ── 10. DYNAMIC STATISTICS ───────────────────────────────── */

function updateStats() {
  if (!hasTours()) return;

  const totalTours = tours.length;

  const uniqueCities = new Set(tours.map(t => normalize(t.city))).size;
  const uniqueCountries = new Set(tours.map(t => normalize(t.country))).size;

  const totalViews = tours.reduce(
    (sum, t) => sum + parseViews(t.views),
    0
  );

  let formattedViews;

  if (totalViews >= 1_000_000_000) {
    formattedViews = (totalViews / 1_000_000_000).toFixed(1) + "B+";
  } else if (totalViews >= 1_000_000) {
    formattedViews = (totalViews / 1_000_000).toFixed(1) + "M+";
  } else if (totalViews >= 1_000) {
    formattedViews = (totalViews / 1_000).toFixed(1) + "K+";
  } else {
    formattedViews = totalViews.toLocaleString();
  }

  const statNums = document.querySelectorAll(".hero-stat-num");

  if (statNums[0]) statNums[0].textContent = totalTours;
  if (statNums[1]) statNums[1].textContent = uniqueCities;
  if (statNums[2]) statNums[2].textContent = uniqueCountries;
  if (statNums[3]) statNums[3].textContent = formattedViews;

  setText("#mapTourCount", totalTours);
  setText("#mapCountryCount", uniqueCountries);
}


/* ── 11. MAP: LOCATION DATA ───────────────────────────────── */

/*
  Coordinates are approximate. City coordinates are preferred;
  otherwise the map falls back to the country's centre.
  Keys must be lowercase with no accents (see normalize()).
*/

const CITY_COORDINATES = {
  "sydney": [-33.8688, 151.2093],
  "melbourne": [-37.8136, 144.9631],
  "brisbane": [-27.4698, 153.0251],
  "perth": [-31.9505, 115.8605],
  "adelaide": [-34.9285, 138.6007],
  "canberra": [-35.2809, 149.1300],
  "darwin": [-12.4634, 130.8456],
  "hobart": [-42.8821, 147.3272],

  "tokyo": [35.6762, 139.6503],
  "kyoto": [35.0116, 135.7681],
  "osaka": [34.6937, 135.5023],
  "hiroshima": [34.3853, 132.4553],
  "sapporo": [43.0618, 141.3545],

  "seoul": [37.5665, 126.9780],
  "busan": [35.1796, 129.0756],

  "bangkok": [13.7563, 100.5018],
  "chiang mai": [18.7883, 98.9853],
  "phuket": [7.8804, 98.3923],

  "hanoi": [21.0278, 105.8342],
  "ho chi minh city": [10.8231, 106.6297],
  "saigon": [10.8231, 106.6297],
  "da nang": [16.0544, 108.2022],
  "hoi an": [15.8801, 108.3380],

  "singapore": [1.3521, 103.8198],
  "kuala lumpur": [3.1390, 101.6869],
  "jakarta": [-6.2088, 106.8456],
  "bali": [-8.4095, 115.1889],
  "manila": [14.5995, 120.9842],
  "cebu": [10.3157, 123.8854],

  "hong kong": [22.3193, 114.1694],
  "beijing": [39.9042, 116.4074],
  "shanghai": [31.2304, 121.4737],
  "taipei": [25.0330, 121.5654],

  "paris": [48.8566, 2.3522],
  "lyon": [45.7640, 4.8357],
  "marseille": [43.2965, 5.3698],
  "nice": [43.7102, 7.2620],
  "toulouse": [43.6047, 1.4442],

  "london": [51.5072, -0.1276],
  "edinburgh": [55.9533, -3.1883],
  "oxford": [51.7520, -1.2577],
  "manchester": [53.4808, -2.2426],

  "rome": [41.9028, 12.4964],
  "venice": [45.4408, 12.3155],
  "florence": [43.7696, 11.2558],
  "milan": [45.4642, 9.1900],

  "barcelona": [41.3874, 2.1686],
  "madrid": [40.4168, -3.7038],
  "seville": [37.3891, -5.9845],

  "berlin": [52.5200, 13.4050],
  "munich": [48.1351, 11.5820],
  "amsterdam": [52.3676, 4.9041],
  "brussels": [50.8503, 4.3517],
  "prague": [50.0755, 14.4378],
  "vienna": [48.2082, 16.3738],
  "zurich": [47.3769, 8.5417],
  "geneva": [46.2044, 6.1432],

  "istanbul": [41.0082, 28.9784],
  "cappadocia": [38.6431, 34.8289],
  "dubai": [25.2048, 55.2708],
  "abu dhabi": [24.4539, 54.3773],
  "jerusalem": [31.7683, 35.2137],
  "petra": [30.3285, 35.4444],

  "new york": [40.7128, -74.0060],
  "los angeles": [34.0522, -118.2437],
  "san francisco": [37.7749, -122.4194],
  "chicago": [41.8781, -87.6298],
  "las vegas": [36.1699, -115.1398],
  "miami": [25.7617, -80.1918],
  "honolulu": [21.3099, -157.8581],
  "toronto": [43.6532, -79.3832],
  "vancouver": [49.2827, -123.1207],
  "montreal": [45.5019, -73.5674],

  "mexico city": [19.4326, -99.1332],
  "cancun": [21.1619, -86.8515],
  "havana": [23.1136, -82.3666],
  "rio de janeiro": [-22.9068, -43.1729],
  "sao paulo": [-23.5505, -46.6333],
  "buenos aires": [-34.6037, -58.3816],
  "cusco": [-13.5319, -71.9675],
  "lima": [-12.0464, -77.0428],

  "cairo": [30.0444, 31.2357],
  "marrakech": [31.6295, -7.9811],
  "casablanca": [33.5731, -7.5898],
  "cape town": [-33.9249, 18.4241],
  "johannesburg": [-26.2041, 28.0473],
  "nairobi": [-1.2921, 36.8219],
  "zanzibar": [-6.1659, 39.2026],

  "auckland": [-36.8509, 174.7645],
  "wellington": [-41.2866, 174.7756],
  "queenstown": [-45.0312, 168.6626],
  "suva": [-18.1416, 178.4419],
  "papeete": [-17.5516, -149.5585],
  "nadi": [-17.7765, 177.4356],

  /* ── Cities added from data.js ── */
  "santa monica": [34.0195, -118.4912],
  "bordeaux": [44.8378, -0.5792],
  "athens": [37.9838, 23.7275],
  "tromso": [69.6492, 18.9553],
  "bern": [46.948, 7.4474],
  "portofino": [44.3036, 9.2096],
  "lagos": [6.5244, 3.3792],
  "funafuti": [-8.5243, 179.1942],
  "salvador": [-12.9777, -38.5016],
  "florianopolis": [-27.5954, -48.548],
  "mumbai": [19.076, 72.8777],
  "panama city": [8.9824, -79.5199],
  "chengdu": [30.5728, 104.0668],
  "baghdad": [33.3152, 44.3661],
  "ulaanbaatar": [47.8864, 106.9057],
  "tubingen": [48.5216, 9.0576],
  "lake como": [45.99, 9.257],
  "annecy": [45.8992, 6.1294],
  "reykjavik": [64.1466, -21.9426],
  "copenhagen": [55.6761, 12.5683],
  "oslo": [59.9139, 10.7522],
  "port of spain": [10.6549, -61.5019],
  "riga": [56.9496, 24.1052],
  "santorini": [36.3932, 25.4615],
  "gold coast": [-28.0167, 153.4],
  "medellin": [6.2442, -75.5812],
  "ithaafushi": [3.978, 73.496],
  "maafushi": [3.9421, 73.4902],
  "valletta": [35.8989, 14.5146],
  "stockholm": [59.3293, 18.0686],
  "ubud": [-8.5069, 115.2625],
  "helsinki": [60.1699, 24.9384],
  "doha": [25.2854, 51.531],
  "cortina d'ampezzo": [46.5405, 12.1357],
  "split": [43.5081, 16.4402],
  "dubrovnik": [42.6507, 18.0944],
  "warsaw": [52.2297, 21.0122],
  "budapest": [47.4979, 19.0402],
  "las palmas": [28.1235, -15.4363],
  "las palma": [28.1235, -15.4363],
  "tunis": [36.8065, 10.1815],
  "moscow": [55.7558, 37.6173],
  "st petersburg": [59.9311, 30.3609],
  "vladivostok": [43.1155, 131.8855],
  "strasbourg": [48.5734, 7.7521],
  "biarritz": [43.4832, -1.5586],
  "murcia": [37.9922, -1.1307],
  "san jose": [37.3382, -121.8863],
  "bratislava": [48.1486, 17.1077],
  "blyth": [55.127, -1.508],
  "hangzhou": [30.2741, 120.1551],
  "antwerp": [51.2194, 4.4025],
  "sucre": [-19.0196, -65.2619],
  "vatican city": [41.9029, 12.4534],
  "nosy be": [-13.3167, 48.2667],
  "dushanbe": [38.5598, 68.787],
  "astana": [51.1694, 71.4491],
  "porto": [41.1579, -8.6291],
  "nuuk": [64.1814, -51.6941],
  "djibouti city": [11.5721, 43.1456],
  "roseau": [15.301, -61.387],
  "amman": [31.9454, 35.9284],
  "ottawa": [45.4215, -75.6972],
  "santiago": [-33.4489, -70.6693],
  "montevideo": [-34.9011, -56.1645],
  "tbilisi": [41.7151, 44.8271],
  "accra": [5.6037, -0.187],
  "mansehra": [34.3333, 73.2],
  "nuku'alofa": [-21.1394, -175.2018],
  "kyiv": [50.4501, 30.5234],
  "riyadh": [24.7136, 46.6753],
  "salzburg": [47.8095, 13.055],
  "port moresby": [-9.4438, 147.1803],
  "bucharest": [44.4268, 26.1025],
  "dhaka": [23.8103, 90.4125],
  "siem reap": [13.3671, 103.8448],
  "luxembourg city": [49.6116, 6.1319],
  "bridgetown": [13.0969, -59.6145],
  "baku": [40.4093, 49.8671],
  "sofia": [42.6977, 23.3219],
  "macao": [22.1987, 113.5439],
  "caye caulker": [17.7389, -88.025],
  "yangon": [16.8409, 96.1735],
  "tallinn": [59.437, 24.7536],
  "seranda": [39.8753, 20.005],
  "saranda": [39.8753, 20.005],
  "andorra la vella": [42.5063, 1.5218],
  "minsk": [53.9006, 27.559],
  "sarajevo": [43.8563, 18.4131],
  "larnaca": [34.9229, 33.6233],
  "dublin": [53.3498, -6.2603],
  "pristina": [42.6629, 21.1655],
  "vaduz": [47.141, 9.5209],
  "vilnius": [54.6872, 25.2797],
  "chisinau": [47.0105, 28.8638],
  "monte carlo": [43.7384, 7.4246],
  "budva": [42.2864, 18.84],
  "skopje": [41.9981, 21.4254],
  "san marino": [43.9424, 12.4578],
  "belgrade": [44.7866, 20.4489],
  "ljubljana": [46.0569, 14.5058],
  "pyongyang": [39.0392, 125.7625],
  "tarawa": [1.4518, 172.9717],
  "kabul": [34.5553, 69.2075],
  "yerevan": [40.1792, 44.4991],
  "thimphu": [27.4728, 89.639],
  "bandar seri begawan": [4.9031, 114.9398],
  "dili": [-8.5569, 125.5603],
  "bishkek": [42.8746, 74.5698],
  "luang prabang": [19.8856, 102.1347],
  "kathmandu": [27.7172, 85.324],
  "colombo": [6.9271, 79.8612],
  "ashgabat": [37.9601, 58.3261],
  "tashkent": [41.2995, 69.2401],
  "koror": [7.3419, 134.4793],
  "majuro": [7.0897, 171.3803],
  "micronesia": [6.9248, 158.161],
  "nauru": [-0.5228, 166.9315],
  "apia": [-13.8333, -171.75],
  "solomon island": [-8.1019, 156.84],
  "port vila": [-17.7334, 168.3273],
  "saint-malo": [48.6493, -2.0257],
  "naha": [26.2124, 127.6809],
  "nara": [34.6851, 135.8049],
  "tehran": [35.6892, 51.389],
  "damascus": [33.5138, 36.2765],
  "tel aviv": [32.0853, 34.7818],
  "kobe": [34.6901, 135.1955],
  "yokohama": [35.4437, 139.638],
  "chiba": [35.6074, 140.1065],
  "gaborone": [-24.6282, 25.9231],
  "lille": [50.6292, 3.0573],
  "cannes": [43.5528, 7.0174],
  "seatle": [47.6062, -122.3321],
  "seattle": [47.6062, -122.3321],
  "casbah": [36.7855, 3.0602],
  "luanda": [-8.839, 13.2894],
  "manama": [26.2285, 50.586],
  "beirut": [33.8938, 35.5018],
  "kampala": [0.3476, 32.5825],
  "antarctica": [-79.77, -83.37],
  "herat": [34.3529, 62.204],
  "nassau": [25.0443, -77.3504],
  "colmar": [48.0794, 7.3585],
  "yvoire": [46.3714, 6.3239],
  "aix en provence": [43.5297, 5.4474],
  "rouen": [49.4432, 1.0993],
  "grenoble": [45.1885, 5.7245],
  "montpellier": [43.6108, 3.8767],
  "toulon": [43.1242, 5.928],
  "rennes": [48.1173, -1.6778],
  "orleans": [47.9029, 1.9093],
  "dijon": [47.322, 5.0415],
  "valencia": [39.4699, -0.3763],
  "sevilla": [37.3891, -5.9845],
  "malaga": [36.7213, -4.4214],
  "bilbao": [43.263, -2.935],
  "zaragoza": [41.6488, -0.8891],
  "palma de mallorca": [39.5696, 2.6502],
  "kawasaki": [35.5309, 139.703],
  "nagoya": [35.1815, 136.9066],
  "gothenburg": [57.7089, 11.9746],
  "malmo": [55.605, 13.0038],
  "uppsala": [59.8586, 17.6389],
  "handen": [59.1667, 18.1333],
  "vasteras": [59.6099, 16.5448],
  "noosa": [-26.397, 153.091],
  "abisko": [68.35, 18.83],
  "boras": [57.721, 12.9401],
  "freetown": [8.4657, -13.2317],
  "fqeberha / port elizabeth": [-33.9608, 25.6022],
  "gqeberha": [-33.9608, 25.6022],
  "port elizabeth": [-33.9608, 25.6022],
  "durban": [-29.8587, 31.0218],
  "east london": [-33.0153, 27.9116],
  "graaff-reinet": [-32.2522, 24.5307],
  "springs ekurhuleni": [-26.25, 28.4333],
  "queenstown (komani)": [-31.8976, 26.8753],
  "moshi": [-3.3349, 37.3404]
};

/*
  Names that are ambiguous on their own (or mislabelled in data.js).
  Checked first, keyed as "city|country" in normalized form.
*/
const CITY_COUNTRY_COORDINATES = {
  "kiev|kyrgyzstan": [42.8746, 74.5698],            // Kiev Street, Bishkek
  "georgetown|guyana": [6.8013, -58.1551],
  "victoria|seychelles": [-4.6191, 55.4513],
  "newcastle|uk": [54.9783, -1.6178],
  "hamilton|new zealand": [-37.7870, 175.2793],
  "st john's|antigua and barbuda": [17.1175, -61.8456]
};

const COUNTRY_COORDINATES = {
  "australia": [-25.2744, 133.7751],
  "new zealand": [-40.9006, 174.8860],
  "japan": [36.2048, 138.2529],
  "south korea": [35.9078, 127.7669],
  "china": [35.8617, 104.1954],
  "vietnam": [14.0583, 108.2772],
  "thailand": [15.8700, 100.9925],
  "india": [20.5937, 78.9629],
  "indonesia": [-0.7893, 113.9213],
  "malaysia": [4.2105, 101.9758],
  "singapore": [1.3521, 103.8198],
  "philippines": [12.8797, 121.7740],
  "cambodia": [12.5657, 104.9910],
  "laos": [19.8563, 102.4955],
  "nepal": [28.3949, 84.1240],
  "sri lanka": [7.8731, 80.7718],
  "taiwan": [23.6978, 120.9605],

  "france": [46.2276, 2.2137],
  "united kingdom": [55.3781, -3.4360],
  "uk": [55.3781, -3.4360],
  "england": [52.3555, -1.1743],
  "scotland": [56.4907, -4.2026],
  "ireland": [53.1424, -7.6921],
  "italy": [41.8719, 12.5674],
  "spain": [40.4637, -3.7492],
  "portugal": [39.3999, -8.2245],
  "germany": [51.1657, 10.4515],
  "netherlands": [52.1326, 5.2913],
  "belgium": [50.5039, 4.4699],
  "switzerland": [46.8182, 8.2275],
  "austria": [47.5162, 14.5501],
  "greece": [39.0742, 21.8243],
  "turkey": [38.9637, 35.2433],
  "turkiye": [38.9637, 35.2433],
  "sweden": [60.1282, 18.6435],
  "norway": [60.4720, 8.4689],
  "denmark": [56.2639, 9.5018],
  "iceland": [64.9631, -19.0208],
  "poland": [51.9194, 19.1451],
  "czech republic": [49.8175, 15.4730],
  "czechia": [49.8175, 15.4730],
  "croatia": [45.1000, 15.2000],
  "romania": [45.9432, 24.9668],
  "ukraine": [48.3794, 31.1656],

  "united states": [37.0902, -95.7129],
  "usa": [37.0902, -95.7129],
  "canada": [56.1304, -106.3468],
  "mexico": [23.6345, -102.5528],
  "brazil": [-14.2350, -51.9253],
  "argentina": [-38.4161, -63.6167],
  "peru": [-9.1900, -75.0152],
  "colombia": [4.5709, -74.2973],
  "chile": [-35.6751, -71.5430],
  "cuba": [21.5218, -77.7812],

  "egypt": [26.8206, 30.8025],
  "morocco": [31.7917, -7.0926],
  "south africa": [-30.5595, 22.9375],
  "kenya": [-0.0236, 37.9062],
  "tanzania": [-6.3690, 34.8888],
  "ethiopia": [9.1450, 40.4897],
  "ghana": [7.9465, -1.0232],
  "nigeria": [9.0820, 8.6753],

  "fiji": [-17.7134, 178.0650],
  "samoa": [-13.7590, -172.1046],
  "vanuatu": [-15.3767, 166.9592],
  "maldives": [3.2028, 73.2207],
  "mauritius": [-20.3484, 57.5522],
  "seychelles": [-4.6796, 55.4920],
  "papua new guinea": [-6.3150, 143.9555],

  "united arab emirates": [23.4241, 53.8478],
  "uae": [23.4241, 53.8478],
  "jordan": [30.5852, 36.2384],
  "israel": [31.0461, 34.8516],
  "saudi arabia": [23.8859, 45.0792],
  "oman": [21.4735, 55.9754],
  "qatar": [25.3548, 51.1839]
};

/*
  Every tour gets a marker. Lookup order:
  1. lat/lng (or latitude/longitude, or coords) stored on the tour in data.js
  2. CITY_COORDINATES above
  3. A geocoded result cached in this browser (see section 11b)
  4. The country's centre, as a temporary spot until the city is geocoded
*/

function toNumber(value) {
  return value === null || value === undefined || value === ""
    ? NaN
    : Number(value);
}

function getTourCoordinates(tour) {
  const lat = toNumber(tour.lat ?? tour.latitude);
  const lng = toNumber(tour.lng ?? tour.lon ?? tour.longitude);

  if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];

  if (Array.isArray(tour.coords) && tour.coords.length === 2) {
    return tour.coords;
  }

  const cityKey = normalize(tour.city);

  const override =
    CITY_COUNTRY_COORDINATES[`${cityKey}|${normalize(tour.country)}`];

  if (override) return override;

  const city = CITY_COORDINATES[cityKey];

  if (city) return city;

  const cached = geoCache[geoKey(tour)];

  if (Array.isArray(cached)) return cached;

  if (cached !== false) queueGeocode(tour);

  return COUNTRY_COORDINATES[normalize(tour.country)] || null;
}


/* ── 11b. MAP: AUTOMATIC GEOCODING ────────────────────────── */

/*
  Cities missing from CITY_COORDINATES are looked up once through
  OpenStreetMap's Nominatim service (max 1 request per second, as their
  usage policy requires) and cached in localStorage, so each city is only
  ever looked up once per browser. Markers refresh as results arrive.

  For a permanent fix, copy the cached results into CITY_COORDINATES, or
  add lat/lng to each tour in data.js. Run `walkworldGeoCache()` in the
  console to print them.
*/

const GEO_CACHE_KEY = "walkworld-geocache-v1";

let geoCache = loadGeoCache();
let geoQueue = [];
const geoQueued = new Set();
let geoRunning = false;
let geoRefreshTimer = null;

function geoKey(tour) {
  return `${normalize(tour.city)}|${normalize(tour.country)}`;
}

function loadGeoCache() {
  try {
    return JSON.parse(localStorage.getItem(GEO_CACHE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveGeoCache() {
  try {
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geoCache));
  } catch (error) {
    console.warn("WalkWorld: could not save geocode cache:", error);
  }
}

function queueGeocode(tour) {
  const key = geoKey(tour);

  if (!tour.city || geoQueued.has(key)) return;

  geoQueued.add(key);
  geoQueue.push(tour);
  runGeocodeQueue();
}

function scheduleMarkerRefresh() {
  clearTimeout(geoRefreshTimer);
  geoRefreshTimer = setTimeout(updateMapMarkers, 1500);
}

async function runGeocodeQueue() {
  if (geoRunning) return;

  geoRunning = true;

  while (geoQueue.length) {
    const tour = geoQueue.shift();
    const key = geoKey(tour);

    try {
      const query = encodeURIComponent(`${tour.city}, ${tour.country}`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`,
        { headers: { Accept: "application/json" } }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const results = await response.json();

      geoCache[key] = results[0]
        ? [parseFloat(results[0].lat), parseFloat(results[0].lon)]
        : false; // not found: stop retrying, keep the country-centre fallback

      saveGeoCache();
      scheduleMarkerRefresh();
    } catch (error) {
      // Network problem: leave it uncached so it retries on the next visit.
      console.warn("WalkWorld: geocoding paused:", error);
      geoQueue = [];
      break;
    }

    // Nominatim allows at most one request per second.
    await new Promise(resolve => setTimeout(resolve, 1100));
  }

  geoRunning = false;
}

// Looks up every tour up front so all of them end up on the map.
function prefetchGeocodes() {
  if (!hasTours()) return;

  tours.forEach(tour => getTourCoordinates(tour));
}

// Console helper: prints the cached lookups as ready-to-paste entries.
window.walkworldGeoCache = function () {
  const lines = Object.entries(geoCache)
    .filter(([, value]) => Array.isArray(value))
    .map(([key, value]) =>
      `  "${key.split("|")[0]}": [${value[0].toFixed(4)}, ${value[1].toFixed(4)}],`
    );

  console.log(lines.join("\n"));
  return lines.length;
};


/* ── 12. MAP: INITIALISATION ──────────────────────────────── */

function initMap() {
  const mapElement = document.getElementById("worldMap");

  if (!mapElement) {
    console.warn("WalkWorld: map container #worldMap was not found.");
    return;
  }

  if (typeof L === "undefined") {
    console.error("WalkWorld: Leaflet is missing. Check the script tag in index.html.");

    mapElement.innerHTML = `
      <div class="map-error">
        The map could not be loaded. Please check your connection.
      </div>
    `;

    return;
  }

  if (worldMap) return;

  worldMap = L.map("worldMap", {
    center: [20, 10],
    zoom: 2,
    minZoom: 0,
    maxZoom: 12,
    worldCopyJump: true,
    scrollWheelZoom: true,
    zoomControl: true
  });

  L.control.zoom({ position: "bottomright" }).addTo(worldMap);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(worldMap);

  // Nearby pins merge into numbered clusters at world zoom. If the plugin
  // failed to load, fall back to a plain layer so every pin still shows.
  markerLayer =
    typeof L.markerClusterGroup === "function"
      ? L.markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 55,
          disableClusteringAtZoom: 9,
          chunkedLoading: true,
          iconCreateFunction: createClusterIcon
        })
      : L.layerGroup();

  markerLayer.addTo(worldMap);
  markerLayer.on("clusterclick", () => playSound("pop"));

  worldMap.on("click", closeCountryPanel);

  // Closing the popup's own X also closes the tour list. The short delay
  // stops it from closing when you click straight from one pin to another
  // (the old popup closes just before the new one opens).
  worldMap.on("popupclose", () => {
    setTimeout(() => {
      if (journeyActive) return;

      if (!document.querySelector(".leaflet-popup")) {
        closeCountryPanel();
        clearSelectedTour();
      }
    }, 0);
  });

  initMapControls();
  updateMapMarkers();

  setTimeout(() => worldMap.invalidateSize(), 200);

  window.addEventListener("resize", () => worldMap.invalidateSize());
}


/* ── 13. MAP: MARKERS ─────────────────────────────────────── */

// data.js emoji fields hold several characters (and a few stray letters);
// a marker only has room for the first real emoji or flag.
function markerEmoji(tour) {
  const text = String(tour.emoji || "");

  const graphemes =
    typeof Intl !== "undefined" && Intl.Segmenter
      ? [...new Intl.Segmenter(undefined, { granularity: "grapheme" })
          .segment(text)].map(part => part.segment)
      : Array.from(text);

  return graphemes.find(g =>
    /\p{Extended_Pictographic}|\p{Regional_Indicator}/u.test(g)
  ) || "📍";
}

function buildPinIcon(tour, visited) {
  return L.divIcon({
    className: visited ? "ww-map-marker ww-pin-visited" : "ww-map-marker",
    html: `
      <div class="ww-map-pin">
        <span>${escapeHTML(markerEmoji(tour))}</span>
      </div>
    `,
    iconSize: [44, 52],
    iconAnchor: [22, 50],
    popupAnchor: [0, -50]
  });
}

function createClusterIcon(cluster) {
  const count = cluster.getChildCount();
  const size = count < 5 ? "small" : count < 15 ? "medium" : "large";
  const px = size === "small" ? 40 : size === "medium" ? 48 : 58;

  return L.divIcon({
    className: "ww-cluster-wrap",
    html: `<div class="ww-cluster ww-cluster-${size}"><span>${count}</span></div>`,
    iconSize: [px, px]
  });
}

function createTourMarker(tour, coordinates) {
  const visited = isVisited(tour.id);
  const icon = buildPinIcon(tour, visited);

  const marker = L.marker(coordinates, { icon, riseOnHover: true });

  // Kept so the pin can be redrawn when its visited state changes.
  marker._wwTour = tour;
  marker._wwVisited = visited;

  marker.bindPopup(`
    <div class="ww-popup">
      <strong>${escapeHTML(tour.city)}, ${escapeHTML(tour.country)}</strong>
      <p>${escapeHTML(tour.title)}</p>
      <span>${escapeHTML(tour.duration || "")}</span>
      <button type="button" class="ww-popup-watch" data-watch>▶ Watch</button>
    </div>
  `);

  // Leaflet stops clicks inside popups from bubbling, so bind the button here.
  marker.on("popupopen", event => {
    event.popup
      .getElement()
      ?.querySelector("[data-watch]")
      ?.addEventListener("click", () => travelToTour(tour.id));
  });

  // Clicking a pin opens its popup (Leaflet does that itself) and scrolls
  // the list to the matching video.
  marker.on("click", () => {
    playSound("pop");
    selectTour(tour.id, { scroll: true });
  });

  return marker;
}


/* ── 13b. PIN <-> LIST SELECTION ──────────────────────────── */

function findCard(id) {
  return document.querySelector(
    `.card[data-card-id="${CSS.escape(String(id))}"]`
  );
}

function applySelectedCard() {
  document.querySelectorAll(".card.is-selected")
    .forEach(card => card.classList.remove("is-selected"));

  if (selectedTourId !== null) {
    findCard(selectedTourId)?.classList.add("is-selected");
  }
}

function clearSelectedTour() {
  selectedTourId = null;
  applySelectedCard();
}

function setPinActive(id, active) {
  const marker = markerById.get(String(id));

  if (!marker) return;

  activePinEl?.classList.remove("ww-pin-active");
  activePinEl = null;

  if (active) {
    // If the pin is inside a cluster, light up the cluster instead.
    const shown = markerLayer?.getVisibleParent?.(marker) || marker;

    activePinEl = shown.getElement?.() || null;
    activePinEl?.classList.add("ww-pin-active");
  }

  marker.setZIndexOffset(active ? 1000 : 0);
}

// Opens up whatever cluster is hiding a pin, then runs the callback.
function revealMarker(marker, callback) {
  if (markerLayer?.zoomToShowLayer && markerLayer.hasLayer(marker)) {
    markerLayer.zoomToShowLayer(marker, callback);
  } else {
    callback();
  }
}

// Scrolls whichever ancestor actually scrolls the list (a sidebar, or the page).
function scrollListTo(card) {
  let container = card.parentElement;

  while (container && container !== document.body) {
    const overflowY = getComputedStyle(container).overflowY;

    if (
      /(auto|scroll)/.test(overflowY) &&
      container.scrollHeight > container.clientHeight
    ) {
      break;
    }

    container = container.parentElement;
  }

  if (!container || container === document.body) {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const box = container.getBoundingClientRect();
  const rect = card.getBoundingClientRect();

  container.scrollTo({
    top: container.scrollTop + (rect.top - box.top) - (box.height - rect.height) / 2,
    behavior: "smooth"
  });
}

function revealMapIfOffscreen() {
  const mapEl = document.getElementById("worldMap");

  if (!mapEl) return;

  const rect = mapEl.getBoundingClientRect();

  if (rect.bottom < 0 || rect.top > window.innerHeight) {
    mapEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function selectTour(id, { scroll = false, fly = false, popup = false } = {}) {
  selectedTourId = String(id);
  applySelectedCard();

  const card = findCard(id);

  // If the tour is hidden by the current filter or search, show everything again.
  if (!card && (currentFilter !== "all" || searchTerm)) {
    currentFilter = "all";
    searchTerm = "";

    const input = document.getElementById("searchInput");

    if (input) input.value = "";

    document.querySelectorAll(".filter-btn").forEach(button => {
      button.classList.toggle("active", button.dataset.region === "all");
    });

    render();
    updateMapMarkers();
  }

  if (scroll) {
    const target = findCard(id);

    if (target) scrollListTo(target);
  }

  const marker = markerById.get(String(id));

  if (!marker || !worldMap) return;

  if (fly) {
    worldMap.flyTo(marker.getLatLng(), Math.max(worldMap.getZoom(), 6), {
      duration: 1
    });

    if (popup) {
      worldMap.once("moveend", () => {
        revealMarker(marker, () => marker.openPopup());
      });
    }
  } else if (popup) {
    revealMarker(marker, () => marker.openPopup());
  }
}

let mapRefreshPending = false;

function updateMapMarkers() {
  if (!worldMap || typeof L === "undefined") return;

  // Avoid rebuilding map markers while a video is playing.
  if (document.getElementById("modal")?.classList.contains("open")) {
    mapRefreshPending = true;
    return;
  }

  mapRefreshPending = false;

  markerLayer?.clearLayers();
  mapMarkers = [];
  markerById.clear();

  // Tours that share a location get nudged slightly so every pin is clickable.
  const seen = {};
  const unmapped = [];

  getFilteredTours().forEach(tour => {
    const base = getTourCoordinates(tour);

    if (!base) {
      unmapped.push(tour);
      return;
    }

    const key = base.join(",");
    const n = seen[key] || 0;

    seen[key] = n + 1;

    let coordinates = base;

    if (n > 0) {
      const angle = n * 2.4;
      const radius = 0.25 * Math.ceil(n / 6);

      coordinates = [
        base[0] + Math.sin(angle) * radius,
        base[1] + Math.cos(angle) * radius
      ];
    }

    const marker = createTourMarker(tour, coordinates);

    mapMarkers.push(marker);
    markerById.set(String(tour.id), marker);
  });

  if (markerLayer?.addLayers) {
    markerLayer.addLayers(mapMarkers);
  } else {
    mapMarkers.forEach(marker => markerLayer?.addLayer(marker));
  }

  setText("#mapVisibleCount", mapMarkers.length);

  if (unmapped.length) {
    console.warn(
      `WalkWorld: ${unmapped.length} tour(s) have no map location:`,
      unmapped.map(t => `${t.city}, ${t.country}`)
    );
  }
}

function initMapControls() {
  document.getElementById("zoomIn")?.addEventListener("click", () => {
    worldMap?.zoomIn();
  });

  document.getElementById("zoomOut")?.addEventListener("click", () => {
    worldMap?.zoomOut();
  });

  document.getElementById("resetMap")?.addEventListener("click", () => {
    worldMap?.flyTo([20, 10], 2, { duration: 1.4 });
  });
}


/* ── 13c. JOURNEY ─────────────────────────────────────────── */

/*
  Makes opening a video feel like arriving somewhere:
  - the map flies to the place before the video opens
  - the video shows the local time and weather there, right now
  - "Next stop" flies on to the nearest place you haven't been
  - places you've watched are remembered in this browser
*/

const VISITED_KEY = "walkworld-visited-v1";

let visitedIds = loadVisited();
let journeyToken = 0;
let journeyActive = false;
let openTourId = null;
let nowTimer = null;
let nowAbort = null;
const nowCache = new Map();

function loadVisited() {
  try {
    const saved = JSON.parse(localStorage.getItem(VISITED_KEY));

    return new Set(Array.isArray(saved) ? saved.map(String) : []);
  } catch (error) {
    return new Set();
  }
}

function saveVisited() {
  try {
    localStorage.setItem(VISITED_KEY, JSON.stringify([...visitedIds]));
  } catch (error) {
    console.warn("WalkWorld: could not save visited places:", error);
  }
}

function isVisited(id) {
  return visitedIds.has(String(id));
}

function markVisited(id) {
  if (isVisited(id)) return;

  visitedIds.add(String(id));
  saveVisited();
  applyVisitedAll();
}

function applyVisitedAll() {
  document.querySelectorAll(".card[data-card-id]").forEach(card => {
    card.classList.toggle("is-visited", isVisited(card.dataset.cardId));
  });

  markerById.forEach((marker, id) => {
    const visited = isVisited(id);

    if (marker._wwTour && marker._wwVisited !== visited) {
      marker._wwVisited = visited;
      marker.setIcon(buildPinIcon(marker._wwTour, visited));
    }
  });

  const total = hasTours() ? tours.length : 0;

  setText(
    "#mapVisited",
    visitedIds.size ? `You’ve visited ${visitedIds.size} of ${total}` : ""
  );
}

function prefersReducedMotion() {
  return Boolean(
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

// Distance in km between two [lat, lng] points.
function distanceKm(a, b) {
  const rad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * rad;
  const dLng = (b[1] - a[1]) * rad;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) ** 2;

  return 12742 * Math.asin(Math.sqrt(h));
}

function showJourneyBanner(text) {
  let banner = document.getElementById("journeyBanner");

  if (!banner) {
    banner = document.createElement("div");
    banner.id = "journeyBanner";
    banner.className = "journey-banner";
    banner.setAttribute("role", "status");

    (document.getElementById("world-map") || document.body).appendChild(banner);
  }

  banner.textContent = text;
  banner.classList.add("show");
}

function hideJourneyBanner() {
  document.getElementById("journeyBanner")?.classList.remove("show");
}

function cancelJourney() {
  journeyToken++;
  journeyActive = false;
  hideJourneyBanner();
}

// Fly to a tour's pin, then open its video on arrival.
function travelToTour(id, note) {
  const tour = getTourById(id);

  if (!tour) return;

  const marker = markerById.get(String(id));
  const token = ++journeyToken;

  journeyActive = true;
  worldMap?.closePopup();
  selectTour(id, { scroll: true });

  if (!marker || !worldMap || prefersReducedMotion()) {
    journeyActive = false;
    openModal(id);
    return;
  }

  const dest = marker.getLatLng();
  const center = worldMap.getCenter();
  const km = distanceKm([center.lat, center.lng], [dest.lat, dest.lng]);
  const duration = Math.min(3.2, Math.max(1.2, 1.2 + km / 6000));

  showJourneyBanner(note || `Flying to ${tour.city}, ${tour.country}…`);
  playSound("whoosh", Math.min(1.6, duration));

  let arrived = false;

  const arrive = () => {
    if (arrived || token !== journeyToken) return;

    arrived = true;
    journeyActive = false;
    hideJourneyBanner();
    playSound("arrive");
    openModal(id);
  };

  worldMap.once("moveend", arrive);
  worldMap.flyTo(dest, Math.max(worldMap.getZoom(), 6), { duration });

  // Safety net in case the map never reports that it stopped moving.
  setTimeout(arrive, duration * 1000 + 800);
}

// Close the video and fly on to the nearest place you haven't been yet.
function nextStop() {
  if (!hasTours()) return;

  const here = openTourId !== null ? getTourById(openTourId) : null;
  const center = worldMap?.getCenter();
  const origin = (here && getTourCoordinates(here)) ||
    (center ? [center.lat, center.lng] : null);

  if (!origin) return;

  const reachable = tours.filter(t =>
    String(t.id) !== String(openTourId) &&
    getTourCoordinates(t) &&
    (markerById.size === 0 || markerById.has(String(t.id)))
  );

  const unvisited = reachable.filter(t => !isVisited(t.id));
  const pool = unvisited.length ? unvisited : reachable;

  let best = null;
  let bestKm = Infinity;

  pool.forEach(t => {
    const km = distanceKm(origin, getTourCoordinates(t));

    if (km < bestKm) {
      best = t;
      bestKm = km;
    }
  });

  if (!best) return;

  const note = bestKm < 5
    ? `Another walk in ${best.city}…`
    : `Next stop: ${best.city}, ${best.country}. About ${Math.round(bestKm).toLocaleString()} km away…`;

  closeModal();
  travelToTour(best.id, note);
}

/* Local time and weather at the destination (Open-Meteo: free, no key) */

function describeWeather(code, isDay) {
  if (code === 0) return { text: "clear skies", icon: isDay ? "☀️" : "🌙" };
  if (code === 1) return { text: "mostly clear", icon: isDay ? "🌤️" : "🌙" };
  if (code === 2) return { text: "partly cloudy", icon: "⛅" };
  if (code === 3) return { text: "overcast", icon: "☁️" };
  if (code === 45 || code === 48) return { text: "foggy", icon: "🌫️" };
  if (code >= 51 && code <= 57) return { text: "drizzle", icon: "🌦️" };
  if (code >= 61 && code <= 67) return { text: "raining", icon: "🌧️" };
  if (code >= 71 && code <= 77) return { text: "snowing", icon: "❄️" };
  if (code >= 80 && code <= 82) return { text: "showers", icon: "🌦️" };
  if (code === 85 || code === 86) return { text: "snow showers", icon: "🌨️" };
  if (code >= 95) return { text: "thunderstorms", icon: "⛈️" };

  return { text: "", icon: "🌍" };
}

function loadLocalNow(tour) {
  const el = document.getElementById("modalNow");

  clearInterval(nowTimer);
  nowAbort?.abort();

  if (!el) return;

  el.textContent = "";

  const coords = getTourCoordinates(tour);

  if (!coords) return;

  const paint = info => {
    if (openTourId !== String(tour.id)) return;

    let time = "";

    try {
      time = new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
        timeZone: info.timezone
      }).format(new Date());
    } catch (error) {
      time = "";
    }

    const weather = describeWeather(info.code, info.isDay);

    el.textContent =
      `${weather.icon} ` +
      (time ? `It’s ${time} in ${tour.city}. ` : `Right now in ${tour.city}. `) +
      `${Math.round(info.temp)}°C` +
      (weather.text ? `, ${weather.text}.` : ".");
  };

  const show = info => {
    paint(info);
    nowTimer = setInterval(() => paint(info), 30000);
  };

  const key = `${coords[0].toFixed(2)},${coords[1].toFixed(2)}`;

  if (nowCache.has(key)) {
    show(nowCache.get(key));
    return;
  }

  nowAbort = new AbortController();

  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${coords[0]}&longitude=${coords[1]}` +
    "&current=temperature_2m,weather_code,is_day&timezone=auto";

  fetch(url, { signal: nowAbort.signal })
    .then(response => (response.ok ? response.json() : Promise.reject()))
    .then(data => {
      const current = data?.current;

      if (!current) return;

      const info = {
        timezone: data.timezone,
        temp: current.temperature_2m,
        code: current.weather_code,
        isDay: current.is_day === 1
      };

      nowCache.set(key, info);
      show(info);
    })
    .catch(() => {
      // Offline or blocked: the strip just stays empty.
    });
}


/* ── 14. COUNTRY PANEL ────────────────────────────────────── */

function showCountryPanel(country) {
  const panel = document.getElementById("countryPanel");

  if (!panel) return;

  const countryTours = hasTours() ? getToursForCountry(country) : [];

  selectedCountry = country;

  // No inline onclick handlers: everything is handled by the delegated
  // listener in initPanelControls(), so this works in module scripts too.
  panel.innerHTML = `
    <div class="country-panel-content">

      <div class="country-panel-header">
        <div>
          <span class="panel-eyebrow">EXPLORE COUNTRY</span>
          <h3>${escapeHTML(country)}</h3>
          <p>
            ${countryTours.length}
            ${countryTours.length === 1 ? "tour" : "tours"} available
          </p>
        </div>

        <button
          class="panel-close country-panel-close"
          type="button"
          aria-label="Close country panel"
          data-close-country
        >
          ×
        </button>
      </div>

      <div class="country-tour-list">

        ${countryTours.length ? countryTours.map(tour => `
          <button
            class="country-tour-item"
            type="button"
            data-tour-id="${escapeHTML(tour.id)}"
          >
            <span class="country-tour-emoji">
              ${escapeHTML(tour.emoji || "🌍")}
            </span>

            <span class="country-tour-info">
              <strong>${escapeHTML(tour.city)}</strong>
              <small>${escapeHTML(tour.title)}</small>
            </span>

            <span class="country-tour-arrow">↗</span>
          </button>
        `).join("") : `
          <p class="panel-empty">No tours available for this country yet.</p>
        `}

      </div>
    </div>
  `;

  // Make sure it is visible regardless of what closeCountryPanel did earlier,
  // and sits above Leaflet's panes (which go up to z-index 700).
  panel.style.display = "";
  panel.style.zIndex = "1000";
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
}

function closeCountryPanel() {
  worldMap?.closePopup();

  const panel = document.getElementById("countryPanel");

  if (!panel) return;

  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");

  worldMap?.closePopup();

  // The panel is always on the page, so reset it to its starting message.
  panel.innerHTML = countryPanelDefaultHTML || DEFAULT_PANEL_HTML;

  selectedCountry = null;
}


/* ── 15. COUNTRY PANEL CONTROLS ───────────────────────────── */

// One delegated listener handles every panel button, so nothing depends on
// inline onclick attributes or listeners lost when innerHTML is rebuilt.
function initPanelControls() {
  document.addEventListener("click", event => {
    if (event.target.closest("[data-close-country]")) {
      closeCountryPanel();
      return;
    }

    const tourBtn = event.target.closest("#countryPanel [data-tour-id]");

    if (tourBtn) {
      openModal(tourBtn.dataset.tourId);
    }
  });

  // Remember what the panel shows before any country is picked,
  // so closing can put it back.
  const countryPanel = document.getElementById("countryPanel");

  if (countryPanel) {
    countryPanelDefaultHTML = countryPanel.innerHTML.trim() || DEFAULT_PANEL_HTML;
  }
}


/* ── 16. THEME SYSTEM ─────────────────────────────────────── */

function initTheme() {
  const root = document.documentElement;

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("theme");
  } catch (error) {
    console.warn("Could not read saved theme:", error);
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  root.setAttribute("data-theme", savedTheme || (prefersDark ? "dark" : "light"));
}

function toggleTheme() {
  const root = document.documentElement;

  const current = root.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";

  root.setAttribute("data-theme", next);

  try {
    localStorage.setItem("theme", next);
  } catch (error) {
    console.warn("Could not save theme:", error);
  }
}


/* ── 17. SCROLL HELPERS ───────────────────────────────────── */

function initBackToTop() {
  const button = document.getElementById("backToTop");

  if (!button) return;

  function updateButton() {
    button.classList.toggle("show", window.scrollY > 400);
  }

  window.addEventListener("scroll", updateButton, { passive: true });

  updateButton();
}


/* ── 18. KEYBOARD AND BACKDROP CONTROLS ───────────────────── */

function initKeyboardControls() {
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      cancelJourney();
      closeModal();
      closeRandom();
      closeCountryPanel();
      closeMenu();
    }
  });
}

function initBackdropControls() {
  document.getElementById("modal")
    ?.addEventListener("click", handleBackdropClick);

  document.getElementById("randomBackdrop")
    ?.addEventListener("click", handleRandomBackdropClick);
}


/* ── 18a. SOUND ───────────────────────────────────────────── */

/*
  Very quiet sounds made with the browser's own audio engine (no files to
  load): a soft tick on buttons, a pop on pins, a whoosh while the map flies
  and a gentle chime on arrival. There is a mute button in the top bar, and
  the choice is remembered.
*/

const SOUND_KEY = "walkworld-sound";

let soundOn = true;
let audioCtx = null;

try {
  soundOn = localStorage.getItem(SOUND_KEY) !== "off";
} catch (error) {
  soundOn = true;
}

function getAudio() {
  if (!soundOn) return null;

  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;

    if (!Ctx) return null;

    try {
      audioCtx = new Ctx();
    } catch (error) {
      return null;
    }
  }

  if (audioCtx.state === "suspended") audioCtx.resume();

  return audioCtx;
}

function tone(freq, { start = 0, dur = 0.12, gain = 0.03, slideTo = null } = {}) {
  const ctx = getAudio();

  if (!ctx) return;

  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t0);

  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);

  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(amp).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

function whoosh(duration = 1) {
  const ctx = getAudio();

  if (!ctx) return;

  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  const t0 = ctx.currentTime;

  source.buffer = buffer;
  filter.type = "bandpass";
  filter.Q.value = 0.9;
  filter.frequency.setValueAtTime(250, t0);
  filter.frequency.exponentialRampToValueAtTime(1600, t0 + duration * 0.7);
  filter.frequency.exponentialRampToValueAtTime(500, t0 + duration);

  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(0.05, t0 + duration * 0.35);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  source.connect(filter).connect(amp).connect(ctx.destination);
  source.start(t0);
}

function playSound(name, arg) {
  if (!soundOn) return;

  switch (name) {
    case "tick":
      tone(880, { dur: 0.05, gain: 0.02 });
      break;
    case "pop":
      tone(520, { dur: 0.09, gain: 0.03, slideTo: 780 });
      break;
    case "whoosh":
      whoosh(arg || 1);
      break;
    case "arrive":
      tone(659.25, { dur: 0.45, gain: 0.03 });
      tone(987.77, { start: 0.14, dur: 0.7, gain: 0.022 });
      break;
    default:
      break;
  }
}

function updateSoundButton() {
  const button = document.getElementById("soundToggle");

  if (!button) return;

  button.textContent = soundOn ? "🔊" : "🔇";
  button.setAttribute("aria-pressed", soundOn ? "true" : "false");
  button.setAttribute("aria-label", soundOn ? "Mute sounds" : "Turn sounds on");
  button.title = soundOn ? "Mute sounds" : "Turn sounds on";
}

function toggleSound() {
  soundOn = !soundOn;

  try {
    localStorage.setItem(SOUND_KEY, soundOn ? "on" : "off");
  } catch (error) {
    console.warn("WalkWorld: could not save the sound setting:", error);
  }

  updateSoundButton();
  playSound("tick");
}

// A soft tick on the small interface buttons. Pins, cluster bubbles and
// flights have their own sounds, so they are left out here.
function initSound() {
  updateSoundButton();

  document.addEventListener("click", event => {
    if (
      event.target.closest(
        ".filter-btn, .random-btn, .card-locate, .map-home, .theme-toggle, " +
        ".btn-close, .random-close, .random-again-btn"
      )
    ) {
      playSound("tick");
    }
  });
}


/* ── 18b. EXTRA STYLES ────────────────────────────────────── */

// Styles for the pin/list interaction. They are injected from here so the
// feature works without touching your stylesheet; move them into it if you like.
function injectExtraStyles() {
  if (document.getElementById("ww-extra-styles")) return;

  const style = document.createElement("style");

  style.id = "ww-extra-styles";
  style.textContent = `
    .card.is-selected {
      outline: 2px solid #7c9cff;
      box-shadow: 0 0 0 5px rgba(124, 156, 255, 0.25);
      transition: box-shadow 0.2s ease;
    }

    .card-locate {
      margin-right: 8px;
      padding: 7px 11px;
      border: 1px solid rgba(128, 128, 128, 0.45);
      border-radius: 999px;
      background: transparent;
      color: inherit;
      font: inherit;
      line-height: 1;
      cursor: pointer;
    }

    .card-locate:hover { background: rgba(124, 156, 255, 0.18); }

    /* Map pins: a solid white teardrop with a coloured ring, so the flag
       or emoji never blends into the map and the target is easy to hit. */
    .leaflet-marker-icon.ww-map-marker .ww-map-pin {
      position: absolute !important;
      top: 4px !important;
      left: 3px !important;
      width: 38px !important;
      height: 38px !important;
      box-sizing: border-box !important;
      display: grid !important;
      place-items: center !important;
      border: 3px solid #5b7cfa !important;
      border-radius: 50% 50% 50% 0 !important;
      background: #ffffff !important;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4) !important;
      transform: rotate(-45deg) !important;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      cursor: pointer;
    }

    .leaflet-marker-icon.ww-map-marker .ww-map-pin > span {
      display: block !important;
      font-size: 20px !important;
      line-height: 1 !important;
      transform: rotate(45deg) !important;
    }

    .leaflet-marker-icon.ww-map-marker:hover .ww-map-pin,
    .leaflet-marker-icon.ww-map-marker.ww-pin-active .ww-map-pin {
      transform: rotate(-45deg) scale(1.15) !important;
      border-color: #8aa4ff !important;
      box-shadow: 0 5px 14px rgba(0, 0, 0, 0.5) !important;
    }

    .leaflet-marker-icon.ww-map-marker.ww-pin-visited .ww-map-pin {
      border-color: #3ecf8e !important;
    }

    .ww-popup-watch {
      display: block;
      margin-top: 8px;
      padding: 7px 14px;
      border: 0;
      border-radius: 999px;
      background: #7c9cff;
      color: #0b1020;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .card-thumb { position: relative; }

    .card-visited-tag {
      display: none;
      position: absolute;
      left: 10px;
      bottom: 10px;
      z-index: 3;
      padding: 3px 9px;
      border-radius: 999px;
      background: #3ecf8e;
      color: #06210f;
      font-size: 0.72rem;
      font-weight: 600;
    }

    .card.is-visited .card-visited-tag { display: block; }

    .leaflet-marker-icon.ww-map-marker.ww-pin-visited::after {
      content: "✓";
      position: absolute;
      top: 2px;
      right: 2px;
      z-index: 2;
      width: 16px;
      height: 16px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: #3ecf8e;
      color: #06210f;
      font-size: 11px;
      font-weight: 700;
      pointer-events: none;
    }

    .journey-banner {
      position: absolute;
      left: 50%;
      bottom: 34px;
      z-index: 850;
      max-width: min(90%, 520px);
      padding: 12px 22px;
      border-radius: 999px;
      background: rgba(14, 20, 34, 0.88);
      color: #f2f5ff;
      font-size: 0.95rem;
      font-weight: 500;
      text-align: center;
      pointer-events: none;
      opacity: 0;
      transform: translate(-50%, 12px);
      transition: opacity 0.25s ease, transform 0.25s ease;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .journey-banner.show {
      opacity: 1;
      transform: translate(-50%, 0);
    }

    .modal-now {
      margin: 6px 0 0;
      font-size: 0.9rem;
      opacity: 0.85;
    }

    .modal-now:empty { display: none; }

    .btn-next {
      padding: 9px 16px;
      border: 0;
      border-radius: 999px;
      background: #7c9cff;
      color: #0b1020;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-next:hover { filter: brightness(1.08); }

    .ww-cluster-wrap { background: none; border: 0; }

    .ww-cluster {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      box-sizing: border-box;
      border: 2px solid #7c9cff;
      border-radius: 50%;
      background: rgba(14, 20, 34, 0.92);
      color: #f2f5ff;
      font-weight: 700;
      box-shadow: 0 0 0 5px rgba(124, 156, 255, 0.22),
        0 4px 14px rgba(0, 0, 0, 0.35);
      transition: transform 0.15s ease;
      cursor: pointer;
    }

    .ww-cluster-small { font-size: 0.9rem; }
    .ww-cluster-medium { font-size: 1rem; }
    .ww-cluster-large { font-size: 1.1rem; }

    .ww-cluster-wrap:hover .ww-cluster,
    .ww-cluster-wrap.ww-pin-active .ww-cluster {
      transform: scale(1.12);
    }

    /* ── Feel: gentle motion and feedback ── */

    @keyframes ww-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes ww-pop-in {
      from { opacity: 0; translate: 0 8px; scale: 0.97; }
      to { opacity: 1; translate: 0 0; scale: 1; }
    }

    .leaflet-marker-icon.ww-map-marker {
      animation: ww-fade-in 0.3s ease both;
    }

    .modal-backdrop.open,
    .random-backdrop.open {
      animation: ww-fade-in 0.2s ease both;
    }

    .modal-backdrop.open .modal,
    .random-backdrop.open .random-modal {
      animation: ww-pop-in 0.24s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    }

    .filter-btn, .random-btn, .card-watch, .card-locate, .btn-next, .btn-yt,
    .btn-close, .watch-pill, .random-again-btn, .theme-toggle, .map-home,
    .ww-popup-watch {
      transition: scale 0.12s ease, filter 0.15s ease, background-color 0.15s ease,
        border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease,
        transform 0.15s ease;
    }

    .filter-btn:hover, .random-btn:hover, .card-watch:hover, .btn-next:hover,
    .btn-yt:hover, .watch-pill:hover, .random-again-btn:hover, .map-home:hover,
    .ww-popup-watch:hover {
      filter: brightness(1.08);
    }

    .filter-btn:active, .random-btn:active, .card-watch:active,
    .card-locate:active, .btn-next:active, .btn-yt:active, .btn-close:active,
    .watch-pill:active, .random-again-btn:active, .theme-toggle:active,
    .map-home:active, .ww-popup-watch:active {
      scale: 0.96;
    }

    button:focus-visible, a:focus-visible, .search-input:focus-visible {
      outline: 2px solid #7c9cff;
      outline-offset: 2px;
    }

    .search-input:focus {
      box-shadow: 0 0 0 3px rgba(124, 156, 255, 0.25);
    }

    .card {
      transition: translate 0.18s ease, box-shadow 0.2s ease,
        border-color 0.2s ease;
    }

    .card:hover {
      translate: 0 -2px;
    }

    .tour-sidebar > .grid {
      scroll-behavior: smooth;
    }

    @media (prefers-reduced-motion: reduce) {
      .leaflet-marker-icon.ww-map-marker,
      .modal-backdrop.open,
      .random-backdrop.open,
      .modal-backdrop.open .modal,
      .random-backdrop.open .random-modal {
        animation: none;
      }

      .filter-btn, .random-btn, .card-watch, .card-locate, .btn-next, .btn-yt,
      .btn-close, .watch-pill, .random-again-btn, .theme-toggle, .map-home,
      .ww-popup-watch, .card {
        transition: none;
      }

      .card:hover { translate: none; }
      .tour-sidebar > .grid { scroll-behavior: auto; }
    }

    @media (prefers-reduced-motion: reduce) {
      .journey-banner { transition: none; }
    }
  `;

  document.head.appendChild(style);
}


/* ── 19. GLOBAL EXPORTS ───────────────────────────────────── */

// Keeps inline HTML handlers (onclick="toggleMenu()", etc.) working even if
// this file is loaded as <script type="module">.
Object.assign(window, {
  toggleMenu,
  closeMenu,
  scrollToTours,
  scrollToMap,
  scrollToTop,
  setFilter,
  filterTours,
  openModal,
  closeModal,
  travelToTour,
  nextStop,
  toggleSound,
  cancelJourney,
  handleBackdropClick,
  openRandomTour,
  spinAgain,
  closeRandom,
  handleRandomBackdropClick,
  toggleTheme,
  showCountryPanel,
  closeCountryPanel
});


/* ── 20. INITIALISATION ───────────────────────────────────── */

function initApp() {
  try {
    injectExtraStyles();
    initSound();
    initTheme();

    render();
    updateStats();
    updateFeaturedCard();

    initCardInteractions();
    initNavigation();
    initBackToTop();
    initKeyboardControls();
    initBackdropControls();

    initMap();
    prefetchGeocodes();
    initPanelControls();

  } catch (error) {
    console.error("WalkWorld init failed:", error);
  } finally {
    // Always lift the loading state, even if something above threw.
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("is-loading");
    });
  }
}


/* ── 21. START APP ────────────────────────────────────────── */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp, { once: true });
} else {
  initApp();
}
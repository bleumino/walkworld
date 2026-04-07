/* ============================================================
   WalkWorld — app.js
   ============================================================ */

/* ── TOUR DATA ──────────────────────────────────────────────
   Each tour object:
     id        – unique number used to look up the tour for the modal
     title     – display title shown on card and in modal
     city      – city label (shown in uppercase above title)
     region    – one of: asia | europe | americas | middleeast
     views     – formatted view count string e.g. "12.4M"
     duration  – formatted duration string e.g. "45 min"
     trending  – boolean, shows the "Trending" badge and appears in the 🔥 filter
     emoji     – decorative emoji used as the card thumbnail background
     color     – dark background colour for the thumbnail area
     videoId   – YouTube video ID for the embed (null = show placeholder)
     url       – fallback YouTube link (direct watch or search results)
   ──────────────────────────────────────────────────────────── */
const tours = [
  {
    id: 0,
    title: "4K Japan Walking Tour: Tokyo Nippori -",
    city: "Tokyo",
    region: "asia",
    views: "113,077",
    duration: "3 hour and 41 min",
    trending: true,
    emoji: "🗾🌧️",
    color: "#1e2d4a",
    videoId: "1_D1TcASw48",
    url: "https://www.youtube.com/watch?v=1_D1TcASw48",
  },
  {
    id: 1,
    title: "24 January 2026 PARIS 🇫🇷 FRANCE 4K HDR WALK CITY WALK TOUR BEST STREET WALK TOUR FRIDAY WALK TOUR",
    city: "Paris",
    region: "europe",
    views: "13,293",
    duration: "42 min",
    trending: false,
    emoji: "🗼✨",
    color: "#3d2b1f",
    videoId: "iEM7UMO2yt4",
    url: "https://www.youtube.com/watch?v=iEM7UMO2yt4",
  },
  {
    id: 2,
    title: "Dubai [4K] Amazing Dubai City, Downtown Dubai Walking Tour 🇦🇪",
    city: "Dubai",
    region: "middleeast",
    views: "109,044",
    duration: "34 min",
    trending: true,
    emoji: "🌆🏙️",
    color: "#1f2e1f",
    videoId: "fKzvwvDA6BM",
    url: "https://www.youtube.com/watch?v=fKzvwvDA6BM",
  },
  {
    id: 3,
    title: "Windy But Wonderful “High Line” - New York, USA 4K",
    city: "New York",
    region: "americas",
    views: "2,752",
    duration: "30 min",
    trending: false,
    emoji: "🗽🌆",
    color: "#3d2b10",
    videoId: "Rsasw3uey3g",
    url: "https://www.youtube.com/watch?v=Rsasw3uey3g",
  },
  {
    id: 4,
    title: "[4K] Seoul Nightlife Walking Tour - BEST Street Food, Night Markets, and Party Districts.",
    city: "Seoul",
    region: "asia",
    views: "236,280",
    duration: "2 hours and 31 min",
    trending: true,
    emoji: "🇰🇷🍢",
    color: "#2a1f3d",
    videoId: "ca9uN3QyDmQ",
    url: "https://www.youtube.com/watch?v=ca9uN3QyDmQ",
  },
  {
    id: 5,
    title: "Rome, Italy Walking Tour 4K 60fps",
    city: "Rome",
    region: "europe",
    views: "64,033",
    duration: "1 hour and 20 min",
    trending: false,
    emoji: "🏛️🌿",
    color: "#3d2b1f",
    videoId: "AG9fExxxCPE",
    url: "https://www.youtube.com/watch?v=AG9fExxxCPE",
  },
  {
    id: 6,
    title: "HONG KONG 🇭🇰 The City of Skyscrapers | 4K Walking Tour",
    city: "Hong Kong",
    region: "asia",
    views: "82,212",
    duration: "3 hours and 53 min",
    trending: true,
    emoji: "🌃🏮",
    color: "#1a1f3d",
    videoId: "wpoOHoxJcLU",
    url: "https://www.youtube.com/watch?v=wpoOHoxJcLU",
  },
  {
    id: 7,
    title: "Mexico City 4K Walking Tour - 190 min Tour with Captions & Immersive Sound [4K Ultra HD/60fps]",
    city: "Mexico City",
    region: "americas",
    views: "2,871,981",
    duration: "3 hours and 10 min",
    trending: true,
    emoji: "🌮🌳",
    color: "#1f3d2b",
    videoId: "fVh9YNTzhak",
    url: "https://www.youtube.com/watch?v=fVh9YNTzhak",
  },
  {
    id: 8,
    title: "🇹🇷 Istanbul, Türkiye - Walking Tour Through World's Most Popular City - 4K60fps",
    city: "Istanbul",
    region: "middleeast",
    views: "54,065",
    duration: "6 hours",
    trending: false,
    emoji: "🕌🌊",
    color: "#3d1f1f",
    videoId: "09yi1wNAntw",
    url: "https://www.youtube.com/watch?v=09yi1wNAntw",
  },
  {
    id: 9,
    title: "🇯🇵 OSAKA, JAPAN 4K WALKING TOUR - Dotonbori District Sunset & Night Life City Walk | 4K HDR - 60 fps",
    city: "Osaka",
    region: "asia",
    views: "11,760,793",
    duration: "36 min",
    trending: true,
    emoji: "🍜🎡",
    color: "#3d2010",
    videoId: "xP-wJbQcMOc",
    url: "https://www.youtube.com/watch?v=xP-wJbQcMOc",
  },
  {
    id: 10,
    title: "London Good Friday Holiday Walking Tour | Vibrant London's Shopping Districts Walk | True 4K",
    city: "London",
    region: "europe",
    views: "2,551",
    duration: "42 min",
    trending: false,
    emoji: "🇬🇧🍺",
    color: "#1f2a3d",
    videoId: "--YbyGthrX4",
    url: "https://www.youtube.com/watch?v=--YbyGthrX4",
  },
  {
    id: 11,
    title: "Walking Havana 2025 | 24-Minute Walking Tour on Paseo del Prado, Cuba (4K City Walk)",
    city: "Havana",
    region: "americas",
    views: "3,208",
    duration: "24 min",
    trending: false,
    emoji: "🎺🌴",
    color: "#3d2b10",
    videoId: "cLeNswzpcsQ",
    url: "https://www.youtube.com/watch?v=cLeNswzpcsQ",
  },
  {
    id: 12,
    title: "🇯🇵 TOKYO WALKING TOUR - WALK THE STREETS OF JAPAN DAY & NIGHT | 4K HDR - 60fps",
    city: "Tokyo",
    region: "asia",
    views: "4,646,803 ",
    duration: "40 min",
    trending: true,
    emoji: "☂️🌧️",
    color: "#1e2d4a",
    videoId: "28ZjrtD_iL0",
    url: "https://www.youtube.com/watch?v=28ZjrtD_iL0",
  },
  {
    id: 13,
    title: "Marrakech city walking journey (4K UHD) Morocco",
    city: "Marrakech",
    region: "middleeast",
    views: "7,780",
    duration: "1 hour and 20 min",
    trending: false,
    emoji: "🕌🟠",
    color: "#3d1a0a",
    videoId: "kWR3cNoiUSY",
    url: "https://www.youtube.com/watch?v=kWR3cNoiUSY",
  },
  {
    id: 14,
    title: "Barcelona, Spain Walking Tour 4K",
    city: "Barcelona",
    region: "europe",
    views: "293,246",
    duration: "40 min",
    trending: true,
    emoji: "🏖️🎨",
    color: "#1f3030",
    videoId: "3ZygN1uKRok",
    url: "https://www.youtube.com/watch?v=3ZygN1uKRok",
  },
  {
    id: 15,
    title: "【4K HDR】Chiang Mai Nimman Walking Tour — First-Person City Walk",
    city: "Chiang Mai",
    region: "asia",
    views: "476",
    duration: "42 min",
    trending: false,
    emoji: "🏯🌙",
    color: "#2a1f10",
    videoId: "NQmmYMRqU5El",
    url: "https://www.youtube.com/watch?v=NQmmYMRqU5El",
  },
];

/* ── STATE ────────────────────────────────────────────────── */
let currentFilter = 'all';
let searchTerm    = '';

/* ── HELPERS ──────────────────────────────────────────────── */
function regionLabel(r) {
  const labels = {
    asia:       'Asia',
    europe:     'Europe',
    americas:   'Americas',
    middleeast: 'Middle East',
  };
  return labels[r] || r;
}

/* ── FILTER CONTROLS ──────────────────────────────────────── */
function setFilter(region, btn) {
  currentFilter = region;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function filterTours() {
  searchTerm = document.getElementById('searchInput').value.toLowerCase();
  render();
}

/* ── RENDER GRID ──────────────────────────────────────────── */
function render() {
  const filtered = tours.filter(t => {
    const regionMatch =
      currentFilter === 'all'      ? true :
      currentFilter === 'trending' ? t.trending :
      t.region === currentFilter;

    const searchMatch =
      !searchTerm ||
      t.city.toLowerCase().includes(searchTerm) ||
      t.title.toLowerCase().includes(searchTerm);

    return regionMatch && searchMatch;
  });

  document.getElementById('tourCount').textContent = filtered.length + ' tours';
  const grid = document.getElementById('grid');

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🗺️</div>
        <p>No tours found. Try a different search or filter.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map((t, i) => `
    <div class="card" style="animation-delay: ${i * 0.04}s">
      <div class="card-thumb" style="background: ${t.color};" onclick="openModal(${t.id})">
        <div class="card-thumb-bg">${t.emoji}</div>
        <div class="card-thumb-overlay"></div>
        <div class="thumb-play"><div class="thumb-play-tri"></div></div>
        <div class="card-badge-wrap">
          ${t.trending ? '<span class="badge badge-trending">Trending</span>' : ''}
          <span class="badge badge-region">${regionLabel(t.region)}</span>
        </div>
        <span class="card-duration">${t.duration}</span>
      </div>
      <div class="card-body">
        <p class="card-city">${t.city}</p>
        <p class="card-title">${t.title}</p>
        <div class="card-footer">
          <span class="card-views"><strong>${t.views}</strong> views</span>
          <button class="card-watch" onclick="openModal(${t.id})">▶ Watch</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ── MODAL ────────────────────────────────────────────────── */
function openModal(id) {
  const t = tours.find(x => x.id === id);
  if (!t) return;

  // Populate modal metadata
  document.getElementById('modalCity').textContent  = t.city;
  document.getElementById('modalTitle').textContent = t.title;
  document.getElementById('modalViews').textContent = `${t.views} views · ${t.duration}`;
  document.getElementById('modalYTLink').href        = t.url;

  const videoEl = document.getElementById('modalVideo');

  if (t.videoId) {
    // Embed the YouTube player directly
    videoEl.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${t.videoId}?autoplay=1&rel=0&modestbranding=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>`;
  } else {
    // Fallback placeholder for tours without a confirmed video ID
    videoEl.innerHTML = `
      <div class="modal-placeholder">
        <div class="big-emoji">${t.emoji}</div>
        <p class="placeholder-title">${t.title}</p>
        <p>No direct embed available for this tour yet.</p>
        <a href="${t.url}" target="_blank" rel="noopener">Search for it on YouTube ↗</a>
      </div>`;
  }

  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden'; // prevent background scrolling
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
  // Clear the iframe so the video actually stops playing
  document.getElementById('modalVideo').innerHTML = '';
}

function handleBackdropClick(e) {
  // Close only when clicking the dark backdrop itself, not the modal box
  if (e.target === document.getElementById('modal')) closeModal();
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ── INIT ─────────────────────────────────────────────────── */
render();
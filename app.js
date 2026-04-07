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
    views: "113,077 views",
    duration: "3 hour and 41 min",
    trending: true,
    emoji: "🗾🌧️",
    color: "#1e2d4a",
    videoId: "1_D1TcASw48",
    url: "https://www.youtube.com/watch?v=1_D1TcASw48",
  },
  {
    id: 1,
    title: "Montmartre to Notre-Dame — golden hour stroll",
    city: "Paris",
    region: "europe",
    views: "8.1M",
    duration: "38 min",
    trending: true,
    emoji: "🗼✨",
    color: "#3d2b1f",
    videoId: "R3mBRPMiMgw",
    url: "https://www.youtube.com/watch?v=R3mBRPMiMgw",
  },
  {
    id: 2,
    title: "Times Square to Central Park — early morning",
    city: "New York",
    region: "americas",
    views: "19.2M",
    duration: "52 min",
    trending: true,
    emoji: "🗽🌆",
    color: "#1f2e1f",
    videoId: "lKX8GdCL60E",
    url: "https://www.youtube.com/watch?v=lKX8GdCL60E",
  },
  {
    id: 3,
    title: "Marina waterfront at sunset — 4K HDR",
    city: "Dubai",
    region: "middleeast",
    views: "6.7M",
    duration: "30 min",
    trending: false,
    emoji: "🌆🏙️",
    color: "#3d2b10",
    videoId: "K-JRoMfLzQ8",
    url: "https://www.youtube.com/watch?v=K-JRoMfLzQ8",
  },
  {
    id: 4,
    title: "Myeongdong night market — neon streets and street food",
    city: "Seoul",
    region: "asia",
    views: "9.3M",
    duration: "41 min",
    trending: true,
    emoji: "🇰🇷🍢",
    color: "#2a1f3d",
    videoId: "S8zGGp3GZPM",
    url: "https://www.youtube.com/watch?v=S8zGGp3GZPM",
  },
  {
    id: 5,
    title: "Colosseum to Trastevere — ancient to bohemian",
    city: "Rome",
    region: "europe",
    views: "5.4M",
    duration: "35 min",
    trending: false,
    emoji: "🏛️🌿",
    color: "#3d2b1f",
    videoId: "1TbPFbHOiJ4",
    url: "https://www.youtube.com/watch?v=1TbPFbHOiJ4",
  },
  {
    id: 6,
    title: "Kowloon neon night walk — streets of old Hong Kong",
    city: "Hong Kong",
    region: "asia",
    views: "14.8M",
    duration: "48 min",
    trending: true,
    emoji: "🌃🏮",
    color: "#1a1f3d",
    videoId: "ECiGCYl9PNY",
    url: "https://www.youtube.com/watch?v=ECiGCYl9PNY",
  },
  {
    id: 7,
    title: "Condesa neighbourhood — Sunday morning calm",
    city: "Mexico City",
    region: "americas",
    views: "3.9M",
    duration: "28 min",
    trending: false,
    emoji: "🌮🌳",
    color: "#1f3d2b",
    videoId: null,
    url: "https://www.youtube.com/results?search_query=mexico+city+condesa+walking+tour+4k",
  },
  {
    id: 8,
    title: "Grand Bazaar to the Bosphorus — historic Istanbul",
    city: "Istanbul",
    region: "middleeast",
    views: "7.2M",
    duration: "44 min",
    trending: false,
    emoji: "🕌🌊",
    color: "#3d1f1f",
    videoId: "zP_JCHXmIkY",
    url: "https://www.youtube.com/watch?v=zP_JCHXmIkY",
  },
  {
    id: 9,
    title: "Dotonbori evening food district tour in 4K",
    city: "Osaka",
    region: "asia",
    views: "10.5M",
    duration: "36 min",
    trending: true,
    emoji: "🍜🎡",
    color: "#3d2010",
    videoId: "xtFmHH7YNRM",
    url: "https://www.youtube.com/watch?v=xtFmHH7YNRM",
  },
  {
    id: 10,
    title: "Soho to Borough Market — a London afternoon",
    city: "London",
    region: "europe",
    views: "4.8M",
    duration: "42 min",
    trending: false,
    emoji: "🇬🇧🍺",
    color: "#1f2a3d",
    videoId: "2P_MuaBEFBM",
    url: "https://www.youtube.com/watch?v=2P_MuaBEFBM",
  },
  {
    id: 11,
    title: "Old Havana morning walk — colour and crumble",
    city: "Havana",
    region: "americas",
    views: "2.6M",
    duration: "33 min",
    trending: false,
    emoji: "🎺🌴",
    color: "#3d2b10",
    videoId: null,
    url: "https://www.youtube.com/results?search_query=havana+cuba+walking+tour+4k",
  },
  {
    id: 12,
    title: "Shibuya rainy night walk — spatial 4K audio",
    city: "Tokyo",
    region: "asia",
    views: "7.1M",
    duration: "40 min",
    trending: true,
    emoji: "☂️🌧️",
    color: "#1e2d4a",
    videoId: "1sQGjpNvDXE",
    url: "https://www.youtube.com/watch?v=1sQGjpNvDXE",
  },
  {
    id: 13,
    title: "Marrakech medina at dusk — labyrinth of souks",
    city: "Marrakech",
    region: "middleeast",
    views: "4.3M",
    duration: "38 min",
    trending: false,
    emoji: "🕌🟠",
    color: "#3d1a0a",
    videoId: null,
    url: "https://www.youtube.com/results?search_query=marrakech+medina+night+walking+tour+4k",
  },
  {
    id: 14,
    title: "Gothic Quarter to La Barceloneta beach",
    city: "Barcelona",
    region: "europe",
    views: "6.2M",
    duration: "50 min",
    trending: true,
    emoji: "🏖️🎨",
    color: "#1f3030",
    videoId: "MXv7OfRGVcI",
    url: "https://www.youtube.com/watch?v=MXv7OfRGVcI",
  },
  {
    id: 15,
    title: "Old city moat walk at night",
    city: "Chiang Mai",
    region: "asia",
    views: "3.1M",
    duration: "32 min",
    trending: false,
    emoji: "🏯🌙",
    color: "#2a1f10",
    videoId: null,
    url: "https://www.youtube.com/results?search_query=chiang+mai+old+city+night+walk+4k",
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
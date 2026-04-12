/* ============================================================
   WalkWorld — app.js
   ============================================================ */

/* ── TOUR DATA ──────────────────────────────────────────────
   Each tour object:
     id        – unique number used to look up the tour for the modal
     title     – display title shown on card and in modal
     city      – city label (shown in uppercase above title)
     country   – country name shown on card
     region    – one of: asia | europe | americas | middleeast | africa | oceania
     views     – formatted view count string e.g. "12.4M"
     duration  – formatted duration string e.g. "45 min"
     trending  – boolean, shows the "Trending" badge and appears in the 🔥 filter
     emoji     – decorative emoji used as the card thumbnail background
     color     – dark background colour for the thumbnail area
     videoId   – YouTube video ID for the embed (null = show placeholder)
     url       – fallback YouTube link (direct watch or search results)
   ──────────────────────────────────────────────────────────── */

/* tours and ALL_COUNTRIES arrays live in data.js — load that file first */


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
    africa:     'Africa',
    oceania:    'Oceania',
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
      t.country.toLowerCase().includes(searchTerm) ||
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
        <p class="card-city">${t.city}, ${t.country}</p>
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

  document.getElementById('modalCity').textContent  = `${t.city}, ${t.country}`;
  document.getElementById('modalTitle').textContent = t.title;
  document.getElementById('modalViews').textContent = `${t.views} views · ${t.duration}`;
  document.getElementById('modalYTLink').href        = t.url;

  const videoEl = document.getElementById('modalVideo');

  if (t.videoId) {
    videoEl.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${t.videoId}?autoplay=1&rel=0&modestbranding=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>`;
  } else {
    videoEl.innerHTML = `
      <div class="modal-placeholder">
        <div class="big-emoji">${t.emoji}</div>
        <p class="placeholder-title">${t.title}</p>
        <p>No direct embed available for this tour yet.</p>
        <a href="${t.url}" target="_blank" rel="noopener">Search for it on YouTube ↗</a>
      </div>`;
  }

  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('modalVideo').innerHTML = '';
}

function handleBackdropClick(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeRandom(); }
});

/* ── DYNAMIC STATS ────────────────────────────────────────── */
function updateStats() {
  const totalTours     = tours.length;
  const uniqueCities   = new Set(tours.map(t => t.city.trim().toLowerCase())).size;
  const uniqueCountries = new Set(tours.map(t => t.country.trim().toLowerCase())).size;

  const totalViews = tours.reduce((sum, t) => {
    const num = parseFloat(t.views.trim().replace(/[^0-9.]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const formattedViews = totalViews >= 1_000_000
    ? (totalViews / 1_000_000).toFixed(0) + 'M+'
    : totalViews.toLocaleString();

  const statNums = document.querySelectorAll('.hero-stat-num');
  if (statNums[0]) statNums[0].textContent = totalTours;
  if (statNums[1]) statNums[1].textContent = uniqueCities;
  if (statNums[2]) statNums[2].textContent = uniqueCountries;
  if (statNums[3]) statNums[3].textContent = formattedViews;
}

/* ── ROTATING FEATURED CARD ───────────────────────────────── */
function updateFeaturedCard() {
  // Rotates through tours once per day
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const tour = tours[dayOfYear % tours.length];

  const titleEl = document.querySelector('.featured-title');
  const viewsEl = document.querySelector('.featured-views');
  const btnEl   = document.querySelector('.watch-pill');

  if (titleEl) titleEl.textContent = tour.title;
  if (viewsEl) viewsEl.innerHTML   = `<strong>${tour.views}</strong> views · ${tour.duration}`;
  if (btnEl)   btnEl.setAttribute('onclick', `openModal(${tour.id})`);
}


/* ── RANDOM TOUR ──────────────────────────────────────────── */

const GLOBES = ['🌍','🌎','🌏'];
let randomSpinInterval = null;
let lastRandomId = null;

function openRandomTour() {
  document.getElementById('randomBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
  spinAgain();
}

function spinAgain() {
  // Show spinner, hide result
  document.getElementById('randomSpinner').style.display = 'flex';
  document.getElementById('randomResult').style.display  = 'none';

  // Animate through globe emojis
  let i = 0;
  const globeEl = document.getElementById('randomGlobe');
  const labelEl = document.getElementById('randomLabel');
  const spinLabels = ['Spinning the globe…', 'Finding somewhere new…', 'Could be anywhere…', 'Almost there…'];
  let labelI = 0;

  clearInterval(randomSpinInterval);
  randomSpinInterval = setInterval(() => {
    globeEl.textContent = GLOBES[i % GLOBES.length];
    if (i % 6 === 0) labelEl.textContent = spinLabels[labelI % spinLabels.length], labelI++;
    i++;
  }, 120);

  // Pick a random tour (different from last one)
  setTimeout(() => {
    clearInterval(randomSpinInterval);

    let pick;
    do {
      pick = tours[Math.floor(Math.random() * tours.length)];
    } while (tours.length > 1 && pick.id === lastRandomId);
    lastRandomId = pick.id;

    globeEl.textContent = pick.emoji;

    // Populate result
    document.getElementById('randomResultCity').textContent = pick.city + ', ' + pick.country;
    document.getElementById('randomResultTitle').textContent = pick.title;
    document.getElementById('randomResultMeta').textContent  = pick.views + ' views · ' + pick.duration;

    const watchBtn = document.getElementById('randomWatchBtn');
    watchBtn.onclick = () => { closeRandom(); openModal(pick.id); };

    // Swap panels
    setTimeout(() => {
      document.getElementById('randomSpinner').style.display = 'none';
      document.getElementById('randomResult').style.display  = 'flex';
    }, 300);

  }, 1800);
}

function closeRandom() {
  clearInterval(randomSpinInterval);
  document.getElementById('randomBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

function handleRandomBackdropClick(e) {
  if (e.target === document.getElementById('randomBackdrop')) closeRandom();
}

// Also close on Escape (extend existing keydown listener)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeRandom(); closeModal(); }
});



/* ── THEME SYSTEM ─────────────────────────────────────────── */

function initTheme() {
  const saved = localStorage.getItem('theme');

  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else {
    // optional: use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
}

function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';

  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

/* ── INIT ─────────────────────────────────────────────────── */
render();
updateStats();
updateFeaturedCard();
/* ============================================================
   APOSONÍA — interaction layer (graphic score edition)
   ============================================================ */

// --- Movement data ---
const MVTS = [
  { n: 1, name: "White Tower Embankment", dur: "08′ 14″", durSec: 494, audio: "",
    band: [60, 280],       timeRange: [0, 8.23],
    density: 0.85, // how "loud" / dense the anthropogenic marks are (0-1)
    threshold: 0.45  // when red ▲ mark appears (position within the movement, 0-1)
  },
  { n: 2, name: "Port Pier № 1", dur: "11′ 02″", durSec: 662, audio: "",
    band: [20, 180],       timeRange: [8.23, 19.26],
    density: 1.0, threshold: 0.02 },
  { n: 3, name: "Nea Paralia, beneath the umbrellas", dur: "07′ 48″", durSec: 468, audio: "",
    band: [80, 3200],      timeRange: [19.26, 27.06],
    density: 0.55, threshold: null },
  { n: 4, name: "Kalamaria coast", dur: "09′ 28″", durSec: 568, audio: "",
    band: [120, 6000],     timeRange: [27.06, 36.53],
    density: 0.25, threshold: null },
  { n: 5, name: "Axios Delta — the reference", dur: "12′ 44″", durSec: 764, audio: "",
    band: [200, 9000],     timeRange: [36.53, 49.27],
    density: 0.15, threshold: null },
];

const INK     = '#0f0d0a';
const INK_MUT = '#7a7264';
const RUBRIC  = '#a02828';

/* ============================================================
   PLATE I — the field, after Cage
   ------------------------------------------------------------
   Not a map. A composition of points, arcs and threads over a
   time × frequency field. Each movement is a region; marks are
   deterministic (seeded) so the composition is a stable document.
   ============================================================ */

function drawFieldChart() {
  const svg = document.getElementById('fieldchart');
  if (!svg) return;
  const W = 1000, H = 560;
  const PAD_L = 80, PAD_R = 40, PAD_T = 40, PAD_B = 60;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  // Frequency axis is logarithmic: 20 Hz to 10 kHz
  const fMin = 20, fMax = 10000;
  const fY = f => PAD_T + innerH - (Math.log(f / fMin) / Math.log(fMax / fMin)) * innerH;
  const tX = t => PAD_L + (t / 50) * innerW;  // 50 minutes total width

  // deterministic pseudo-random (so the score is the same every load)
  let seed = 42;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  let s = `<defs>
    <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="4" stroke="${INK}" stroke-width="0.3" opacity="0.4"/>
    </pattern>
  </defs>`;

  // --- Frame ---
  s += `<rect x="${PAD_L}" y="${PAD_T}" width="${innerW}" height="${innerH}"
           fill="none" stroke="${INK}" stroke-width="1"/>`;

  // --- Y axis labels (frequency, log scale) ---
  const fTicks = [20, 100, 500, 1000, 3000, 10000];
  fTicks.forEach(f => {
    const y = fY(f);
    s += `<line x1="${PAD_L - 6}" y1="${y}" x2="${PAD_L}" y2="${y}" stroke="${INK}" stroke-width="0.8"/>`;
    s += `<line x1="${PAD_L}" y1="${y}" x2="${W - PAD_R}" y2="${y}"
             stroke="${INK}" stroke-width="0.3" stroke-dasharray="2 4" opacity="0.25"/>`;
    const label = f >= 1000 ? `${f/1000}k` : f;
    s += `<text x="${PAD_L - 12}" y="${y + 4}" text-anchor="end"
             font-family="IBM Plex Mono, monospace" font-size="10" fill="${INK_MUT}">${label}</text>`;
  });

  // --- X axis labels (time, in minutes) ---
  const tTicks = [0, 10, 20, 30, 40, 50];
  tTicks.forEach(t => {
    const x = tX(t);
    s += `<line x1="${x}" y1="${H - PAD_B}" x2="${x}" y2="${H - PAD_B + 6}" stroke="${INK}" stroke-width="0.8"/>`;
    s += `<text x="${x}" y="${H - PAD_B + 22}" text-anchor="middle"
             font-family="IBM Plex Mono, monospace" font-size="10" fill="${INK_MUT}">${t}′</text>`;
  });

  // --- Movement separators (vertical dashed lines) ---
  MVTS.forEach(m => {
    if (m.n === 1) return;
    const x = tX(m.timeRange[0]);
    s += `<line x1="${x}" y1="${PAD_T}" x2="${x}" y2="${H - PAD_B}"
             stroke="${INK}" stroke-width="0.5" stroke-dasharray="1 3" opacity="0.35"/>`;
  });

  // --- Movement labels (top) ---
  MVTS.forEach(m => {
    const x = tX((m.timeRange[0] + m.timeRange[1]) / 2);
    s += `<text x="${x}" y="${PAD_T - 14}" text-anchor="middle"
             font-family="IBM Plex Mono, monospace" font-size="10"
             letter-spacing="0.15em" fill="${INK_MUT}">${romanNumeral(m.n)}</text>`;
  });

  // --- For each movement, draw marks within its time × band region ---
  MVTS.forEach((m, idx) => {
    const x1 = tX(m.timeRange[0]);
    const x2 = tX(m.timeRange[1]);
    const yTop = fY(m.band[1]);
    const yBot = fY(m.band[0]);

    // Band envelope — subtle fill
    s += `<rect x="${x1}" y="${yTop}" width="${x2 - x1}" height="${yBot - yTop}"
             fill="url(#hatch)" opacity="${0.35 + m.density * 0.3}"/>`;

    // Dense anthropogenic drone: horizontal stacked lines in lower band
    if (m.density > 0.5) {
      const droneBands = Math.floor(m.density * 12);
      for (let i = 0; i < droneBands; i++) {
        const freq = m.band[0] + (m.band[1] - m.band[0]) * (i / droneBands) * 0.5;
        const y = fY(freq);
        const wobble = rnd() * 2 - 1;
        s += `<path d="M ${x1} ${y + wobble}
                       Q ${(x1+x2)/2} ${y + (rnd()*6-3)} ${x2} ${y + wobble}"
                 fill="none" stroke="${INK}" stroke-width="${0.4 + m.density * 0.8}" opacity="${0.3 + m.density * 0.4}"/>`;
      }
    }

    // Points (events) — distributed across the band
    const points = Math.floor(6 + m.density * 40 + (1 - m.density) * 24);
    for (let i = 0; i < points; i++) {
      const t = m.timeRange[0] + rnd() * (m.timeRange[1] - m.timeRange[0]);
      const fLog = Math.log(m.band[0]) + rnd() * (Math.log(m.band[1]) - Math.log(m.band[0]));
      const f = Math.exp(fLog);
      const x = tX(t);
      const y = fY(f);
      const r = 0.6 + rnd() * 1.8;
      s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}" opacity="${0.5 + rnd() * 0.5}"/>`;
    }

    // Arcs — connecting events (Cage's Atlas Eclipticalis gesture)
    const arcs = Math.floor(3 + rnd() * 4);
    for (let i = 0; i < arcs; i++) {
      const ta = m.timeRange[0] + rnd() * (m.timeRange[1] - m.timeRange[0]);
      const tb = m.timeRange[0] + rnd() * (m.timeRange[1] - m.timeRange[0]);
      const fa = Math.exp(Math.log(m.band[0]) + rnd() * (Math.log(m.band[1]) - Math.log(m.band[0])));
      const fb = Math.exp(Math.log(m.band[0]) + rnd() * (Math.log(m.band[1]) - Math.log(m.band[0])));
      const xa = tX(ta), ya = fY(fa);
      const xb = tX(tb), yb = fY(fb);
      const mx = (xa + xb) / 2;
      const my = Math.min(ya, yb) - 20 - rnd() * 40;
      s += `<path d="M ${xa} ${ya} Q ${mx} ${my} ${xb} ${yb}"
               fill="none" stroke="${INK}" stroke-width="0.5" opacity="0.35"/>`;
      s += `<circle cx="${xa}" cy="${ya}" r="1.5" fill="${INK}"/>`;
      s += `<circle cx="${xb}" cy="${yb}" r="1.5" fill="${INK}"/>`;
    }

    // Threshold mark ▲ (in rubric red)
    if (m.threshold !== null) {
      const t = m.timeRange[0] + (m.timeRange[1] - m.timeRange[0]) * m.threshold;
      const x = tX(t);
      s += `<line x1="${x}" y1="${PAD_T + 4}" x2="${x}" y2="${H - PAD_B - 4}"
               stroke="${RUBRIC}" stroke-width="0.6" opacity="0.55"/>`;
      s += `<polygon points="${x},${PAD_T + 2} ${x - 5},${PAD_T + 11} ${x + 5},${PAD_T + 11}"
               fill="${RUBRIC}"/>`;
    }
  });

  // --- Axis titles ---
  s += `<text x="${PAD_L - 56}" y="${PAD_T + innerH/2}" text-anchor="middle"
           transform="rotate(-90 ${PAD_L - 56} ${PAD_T + innerH/2})"
           font-family="IBM Plex Mono, monospace" font-size="10"
           letter-spacing="0.2em" fill="${INK_MUT}">FREQUENCY (Hz)</text>`;
  s += `<text x="${PAD_L + innerW/2}" y="${H - 8}" text-anchor="middle"
           font-family="IBM Plex Mono, monospace" font-size="10"
           letter-spacing="0.2em" fill="${INK_MUT}">TIME (min)</text>`;

  svg.innerHTML = s;
}

function romanNumeral(n) {
  return ['', 'I', 'II', 'III', 'IV', 'V'][n];
}

/* ============================================================
   NOTATION BARS per movement
   ------------------------------------------------------------
   Each movement has a graphic notation strip, inspired by
   Cage's Concert for Piano — staves with event-points, dynamic
   clouds, and occasional threshold marks.
   ============================================================ */

function drawNotation(mvt) {
  const W = 800, H = 120;
  let seed = mvt.n * 137;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  let s = '';

  // Five-line stave
  for (let i = 0; i < 5; i++) {
    const y = 24 + i * 18;
    s += `<line x1="20" y1="${y}" x2="${W-20}" y2="${y}" stroke="${INK}" stroke-width="0.6" opacity="0.5"/>`;
  }

  // Bar lines at every "minute" of the piece
  const bars = Math.max(4, Math.floor(mvt.durSec / 60));
  for (let i = 1; i < bars; i++) {
    const x = 20 + (i / bars) * (W - 40);
    s += `<line x1="${x}" y1="20" x2="${x}" y2="${H-20}" stroke="${INK}" stroke-width="0.4" opacity="0.3"/>`;
  }
  // Final double bar
  s += `<line x1="${W-22}" y1="20" x2="${W-22}" y2="${H-20}" stroke="${INK}" stroke-width="0.6"/>`;
  s += `<line x1="${W-20}" y1="20" x2="${W-20}" y2="${H-20}" stroke="${INK}" stroke-width="1.4"/>`;

  // Density of events scales with m.density
  const events = Math.floor(15 + mvt.density * 60);
  for (let i = 0; i < events; i++) {
    const x = 24 + rnd() * (W - 48);
    const y = 18 + rnd() * (H - 36);
    const r = 1.2 + rnd() * 2.5;
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}" opacity="${0.4 + rnd() * 0.6}"/>`;

    // Occasional stem
    if (rnd() > 0.6) {
      const stemH = 8 + rnd() * 18;
      const dir = rnd() > 0.5 ? -1 : 1;
      s += `<line x1="${x + r * dir}" y1="${y}" x2="${x + r * dir}" y2="${y + stemH * dir}"
               stroke="${INK}" stroke-width="0.8" opacity="0.7"/>`;
    }
  }

  // Dynamic clouds — sweeping arcs for dense movements
  if (mvt.density > 0.4) {
    const clouds = 2 + Math.floor(mvt.density * 3);
    for (let i = 0; i < clouds; i++) {
      const x1 = 24 + rnd() * (W * 0.7);
      const x2 = x1 + 80 + rnd() * 200;
      const y1 = 20 + rnd() * (H - 40);
      const y2 = y1 + (rnd() - 0.5) * 30;
      const mx = (x1 + x2) / 2;
      const my = Math.min(y1, y2) - 10 - rnd() * 20;
      s += `<path d="M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}"
               fill="none" stroke="${INK}" stroke-width="0.5" opacity="0.5"/>`;
    }
  }

  // Threshold arrow
  if (mvt.threshold !== null) {
    const x = 24 + mvt.threshold * (W - 48);
    s += `<line x1="${x}" y1="14" x2="${x}" y2="${H-14}" stroke="${RUBRIC}" stroke-width="0.6" opacity="0.7" stroke-dasharray="2 2"/>`;
    s += `<polygon points="${x},10 ${x - 4},18 ${x + 4},18" fill="${RUBRIC}"/>`;
  }

  return s;
}

function drawAllNotations() {
  document.querySelectorAll('.mvt').forEach(el => {
    const n = Number(el.dataset.mvt);
    const m = MVTS.find(x => x.n === n);
    const svg = el.querySelector('.notation svg');
    if (svg && m) svg.innerHTML = drawNotation(m);
  });
}

/* ============================================================
   TRANSPORT — audio strip
   ============================================================ */

const transport = document.querySelector('.transport');
const tIdx = transport.querySelector('.transport__idx');
const tName = transport.querySelector('.transport__name');
const tPlay = transport.querySelector('.transport__play');
const tClose = transport.querySelector('.transport__close');
const tProg = document.getElementById('tprog');
const tCur = document.getElementById('tcur');
const tDur = document.getElementById('tdur');
const audio = document.getElementById('audio');

let activeMvt = null;
let demoPlaying = false;
let demoInterval = null;
let demoProgress = 0;

document.querySelectorAll('.cue').forEach(btn => {
  btn.addEventListener('click', () => {
    const n = Number(btn.dataset.mvtPlay);
    const m = MVTS.find(x => x.n === n);
    openTransport(m, btn);
  });
});

function openTransport(m, sourceBtn) {
  if (activeMvt !== m.n) {
    activeMvt = m.n;
    tIdx.textContent = `MOVEMENT ${romanNumeral(m.n)}`;
    tName.textContent = m.name;
    tDur.textContent = m.dur;
    tCur.textContent = '0:00';
    tProg.style.width = '0%';
    demoProgress = 0;
    clearInterval(demoInterval);
    demoPlaying = false;

    // Clear playing state on all cues
    document.querySelectorAll('.cue').forEach(c => c.classList.remove('is-playing'));

    // If real audio is set, wire it up
    if (m.audio) {
      audio.src = m.audio;
      audio.load();
    }
  }

  transport.hidden = false;
  requestAnimationFrame(() => transport.classList.add('is-active'));

  // Auto-play on cue click
  togglePlay(sourceBtn);
}

function togglePlay(sourceBtn) {
  const m = MVTS.find(x => x.n === activeMvt);
  if (!m) return;

  if (m.audio && audio.src) {
    if (audio.paused) {
      audio.play();
      tPlay.textContent = '❚❚';
      if (sourceBtn) sourceBtn.classList.add('is-playing');
    } else {
      audio.pause();
      tPlay.textContent = '▸';
      if (sourceBtn) sourceBtn.classList.remove('is-playing');
    }
  } else {
    // Demo mode — simulate playback so the UI stays honest
    demoPlaying = !demoPlaying;
    if (demoPlaying) {
      tPlay.textContent = '❚❚';
      document.querySelectorAll('.cue').forEach(c => c.classList.remove('is-playing'));
      const btn = document.querySelector(`.cue[data-mvt-play="${m.n}"]`);
      if (btn) btn.classList.add('is-playing');
      demoInterval = setInterval(() => {
        demoProgress += 1;
        const pct = Math.min(100, (demoProgress / m.durSec) * 100);
        tProg.style.width = pct + '%';
        const mm = Math.floor(demoProgress / 60);
        const ss = (demoProgress % 60).toString().padStart(2, '0');
        tCur.textContent = `${mm}:${ss}`;
        if (demoProgress >= m.durSec) {
          clearInterval(demoInterval);
          demoPlaying = false;
          tPlay.textContent = '▸';
          if (btn) btn.classList.remove('is-playing');
        }
      }, 1000);
    } else {
      tPlay.textContent = '▸';
      clearInterval(demoInterval);
      document.querySelectorAll('.cue').forEach(c => c.classList.remove('is-playing'));
    }
  }
}

tPlay.addEventListener('click', () => {
  const btn = document.querySelector(`.cue[data-mvt-play="${activeMvt}"]`);
  togglePlay(btn);
});

tClose.addEventListener('click', () => {
  if (audio.src) audio.pause();
  clearInterval(demoInterval);
  demoPlaying = false;
  transport.classList.remove('is-active');
  document.querySelectorAll('.cue').forEach(c => c.classList.remove('is-playing'));
  setTimeout(() => { transport.hidden = true; }, 500);
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    tProg.style.width = pct + '%';
    const mm = Math.floor(audio.currentTime / 60);
    const ss = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
    tCur.textContent = `${mm}:${ss}`;
  }
});

/* ============================================================
   PLATE II — SITE MAP (Leaflet restyled as nautical chart)
   ============================================================ */

function initSiteMap() {
  const el = document.getElementById('sitemap');
  if (!el) {
    console.warn('[aposonía] #sitemap element not found');
    return;
  }

  // Guard: if Leaflet didn't load (offline, CDN blocked, file:// restrictions),
  // show a legible fallback instead of an invisible empty container.
  if (typeof L === 'undefined') {
    console.warn('[aposonía] Leaflet did not load. Map disabled. Serve via http(s):// or enable CDN access.');
    el.innerHTML = `
      <div style="
        position:absolute; inset:0;
        display:flex; flex-direction:column;
        align-items:center; justify-content:center;
        padding:40px; text-align:center;
        font-family:'EB Garamond',serif; color:#0f0d0a;
      ">
        <p style="font-style:italic;font-size:20px;margin-bottom:12px;">
          Plate II is rendered when the document is served over http(s).
        </p>
        <p style="font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.14em;color:#7a7264;">
          open index.html via a local server<br/>
          e.g.  python3 -m http.server
        </p>
      </div>`;
    return;
  }

  const map = L.map('sitemap', {
    center: [40.58, 22.94],
    zoom: 11,
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true,
    zoomSnap: 0.5
  });

  // Stadia Stamen Toner Lite — clean monochrome line tiles,
  // then CSS filter gives them the sepia-on-paper tone.
  L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
    attribution: '© Stadia Maps · Stamen · OSM',
    maxZoom: 18
  }).addTo(map);

  // Station marks — each is a roman-numeral notation on the chart
  MVTS.forEach(m => {
    const coords = STATION_COORDS[m.n];
    if (!coords) return;

    const icon = L.divIcon({
      className: 'station-mark-wrap',
      html: `<div class="station-mark">${romanNumeral(m.n)}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = L.marker(coords, { icon, riseOnHover: true }).addTo(map);

    const popupHtml = `
      <span class="pop-n">Movement ${romanNumeral(m.n)}</span>
      <span class="pop-t">${m.name}</span>
      <span style="font-family:'IBM Plex Mono',monospace;font-size:10px;color:#7a7264;letter-spacing:0.08em;">
        ${coords[0].toFixed(4)}° N — ${coords[1].toFixed(4)}° E
      </span><br/>
      <a class="pop-go" href="station.html?n=${m.n}">visit station ↗</a>
    `;
    marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -4] });
  });

  // Fit bounds to show all stations with comfortable padding
  const bounds = L.latLngBounds(Object.values(STATION_COORDS).map(c => L.latLng(c[0], c[1])));
  map.fitBounds(bounds, { padding: [80, 80] });

  // Leaflet occasionally needs a nudge when the container is revealed
  // by scroll or when tile loading is deferred
  setTimeout(() => map.invalidateSize(), 250);
  window.addEventListener('resize', () => map.invalidateSize());
}

const STATION_COORDS = {
  1: [40.6264, 22.9486],
  2: [40.6358, 22.9361],
  3: [40.6201, 22.9531],
  4: [40.5835, 22.9543],
  5: [40.4860, 22.8430]
};

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  drawFieldChart();
  drawAllNotations();
  if (typeof L !== 'undefined') initSiteMap();
});

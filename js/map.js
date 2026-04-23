let map;
let activeMarker = null;

const stations = [
  {
    id: 1,
    coords: [40.6318, 22.9380],
    titleKey:    'stations.0.title',
    locationKey: 'stations.0.location',
    descKey:     'stations.0.description',
    depth: '12m', recorded: '2024-03', duration: "4'22\""
  },
  {
    id: 2,
    coords: [40.6520, 22.9150],
    titleKey:    'stations.1.title',
    locationKey: 'stations.1.location',
    descKey:     'stations.1.description',
    depth: '8m', recorded: '2024-03', duration: "5'10\""
  },
  {
    id: 3,
    coords: [40.6100, 22.9700],
    titleKey:    'stations.2.title',
    locationKey: 'stations.2.location',
    descKey:     'stations.2.description',
    depth: '18m', recorded: '2024-04', duration: "3'48\""
  },
  {
    id: 4,
    coords: [40.5890, 22.9950],
    titleKey:    'stations.3.title',
    locationKey: 'stations.3.location',
    descKey:     'stations.3.description',
    depth: '22m', recorded: '2024-04', duration: "6'05\""
  },
  {
    id: 5,
    coords: [40.6264, 23.0100],
    titleKey:    'stations.4.title',
    locationKey: 'stations.4.location',
    descKey:     'stations.4.description',
    depth: '6m', recorded: '2024-05', duration: "4'55\""
  }
];

function t(key) {
  if (!window.translations) return key;
  const lang = document.documentElement.lang || 'en';
  const src  = window.translations[lang] || window.translations['en'];
  return key.split('.').reduce((a, k) => a && a[k], src) || key;
}

function markerIcon(n, active) {
  return L.divIcon({
    html: `<div class="station-marker${active ? ' active' : ''}">${n}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

function openPanel(station, marker) {
  if (activeMarker) {
    activeMarker._icon.querySelector('.station-marker').classList.remove('active');
  }
  activeMarker = marker;
  marker._icon.querySelector('.station-marker').classList.add('active');

  document.getElementById('station-number').textContent      = `STATION 0${station.id}`;
  document.getElementById('station-title').textContent       = t(station.titleKey);
  document.getElementById('station-location').textContent    = t(station.locationKey);
  document.getElementById('station-description').textContent = t(station.descKey);
  document.getElementById('station-depth').textContent       = station.depth;
  document.getElementById('station-recorded').textContent    = station.recorded;
  document.getElementById('station-duration').textContent    = station.duration;

  document.getElementById('station-panel').classList.add('visible');
}

function closePanel() {
  document.getElementById('station-panel').classList.remove('visible');
  if (activeMarker) {
    activeMarker._icon.querySelector('.station-marker').classList.remove('active');
    activeMarker = null;
  }
}

function initMap() {
  map = L.map('map-container', {
    center: [40.6264, 22.9400],
    zoom: 12,
    zoomControl: false,
    scrollWheelZoom: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  stations.forEach(s => {
    const marker = L.marker(s.coords, { icon: markerIcon(s.id, false) }).addTo(map);
    marker.on('click', () => openPanel(s, marker));
  });

  const closeBtn = document.getElementById('station-close');
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
}

document.addEventListener('DOMContentLoaded', initMap);

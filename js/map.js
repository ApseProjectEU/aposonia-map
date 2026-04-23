let map;
let activeMarker = null;
let currentAudio = null;

const stations = [
  {
    id: 1,
    coords: [40.6318, 22.9380],
    depth: '12 m',
    recorded: '2024-03',
    duration: "4'22\""
  },
  {
    id: 2,
    coords: [40.6520, 22.9150],
    depth: '8 m',
    recorded: '2024-03',
    duration: "5'10\""
  },
  {
    id: 3,
    coords: [40.6100, 22.9700],
    depth: '18 m',
    recorded: '2024-04',
    duration: "3'48\""
  },
  {
    id: 4,
    coords: [40.5890, 22.9950],
    depth: '22 m',
    recorded: '2024-04',
    duration: "6'05\""
  },
  {
    id: 5,
    coords: [40.6264, 23.0100],
    depth: '6 m',
    recorded: '2024-05',
    duration: "4'55\""
  }
];

function markerIcon(n, active) {
  return L.divIcon({
    html: `<div class="station-marker${active ? ' active' : ''}">${n}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

function openStation(station, marker) {
  if (activeMarker && activeMarker !== marker) {
    activeMarker._icon.querySelector('.station-marker').classList.remove('active');
  }
  activeMarker = marker;
  marker._icon.querySelector('.station-marker').classList.add('active');

  const idx = station.id - 1;
  document.getElementById('station-number').textContent = `STATION 0${station.id}`;
  document.getElementById('station-title').textContent = t(`stations.${idx}.title`);
  document.getElementById('station-location').textContent = t(`stations.${idx}.location`);
  document.getElementById('station-description').textContent = t(`stations.${idx}.description`);
  document.getElementById('station-depth').textContent = station.depth;
  document.getElementById('station-recorded').textContent = station.recorded;
  document.getElementById('station-duration').textContent = station.duration;

  resetAudioPlayer();
  document.getElementById('station-panel').classList.add('visible');
}

function closeStation() {
  document.getElementById('station-panel').classList.remove('visible');
  if (activeMarker) {
    activeMarker._icon.querySelector('.station-marker').classList.remove('active');
    activeMarker = null;
  }
  stopAudio();
}

function resetAudioPlayer() {
  stopAudio();
  document.querySelector('.audio-progress-fill').style.width = '0%';
  document.querySelector('.audio-time').textContent = '0:00 / 0:00';
  document.querySelector('.play-btn').textContent = '▶';
}

function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
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

  stations.forEach(station => {
    const marker = L.marker(station.coords, { icon: markerIcon(station.id, false) }).addTo(map);
    marker.on('click', () => openStation(station, marker));
  });

  document.getElementById('station-close').addEventListener('click', closeStation);

  document.querySelector('.play-btn').addEventListener('click', () => {
    document.querySelector('.audio-time').textContent = t('station_panel.no_audio');
  });

  document.addEventListener('langchange', () => {
    if (document.getElementById('station-panel').classList.contains('visible') && activeMarker) {
      const idx = stations.findIndex(s => s.coords === activeMarker.getLatLng());
    }
  });
}

document.addEventListener('DOMContentLoaded', initMap);

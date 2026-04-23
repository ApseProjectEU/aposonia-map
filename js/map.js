class StationMap {
  constructor() {
    this.map = null;
    this.markers = [];
    this.stations = [
      { id: 1, coords: [40.6264, 22.9358], titleKey: 'stations.station1.title', locationKey: 'stations.station1.location', audioPath: 'audio/station1.mp3' },
      { id: 2, coords: [40.6289, 22.9444], titleKey: 'stations.station2.title', locationKey: 'stations.station2.location', audioPath: 'audio/station2.mp3' },
      { id: 3, coords: [40.6263, 22.9485], titleKey: 'stations.station3.title', locationKey: 'stations.station3.location', audioPath: 'audio/station3.mp3' },
      { id: 4, coords: [40.6255, 22.9515], titleKey: 'stations.station4.title', locationKey: 'stations.station4.location', audioPath: 'audio/station4.mp3' },
      { id: 5, coords: [40.5950, 22.9200], titleKey: 'stations.station5.title', locationKey: 'stations.station5.location', audioPath: 'audio/station5.mp3' }
    ];
    this.init();
  }
  init() {
    this.createMap();
    this.addMarkers();
    this.createPanels();
    this.attachCloseHandlers();
  }
  createMap() {
    this.map = L.map('map-container').setView([40.6264, 22.9400], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 19
    }).addTo(this.map);
  }
  addMarkers() {
    this.stations.forEach(station => {
      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<span class="marker-number">${station.id}</span>`,
        iconSize: [40, 40]
      });
      const marker = L.marker(station.coords, { icon: markerIcon }).addTo(this.map);
      marker.on('click', () => this.openStation(station.id));
      this.markers.push(marker);
    });
  }
  createPanels() {
    const panelsContainer = document.getElementById('station-panels');
    const overlay = document.createElement('div');
    overlay.className = 'panel-overlay';
    overlay.addEventListener('click', () => this.closeAllStations());
    panelsContainer.appendChild(overlay);
    this.stations.forEach(station => {
      const panel = this.createPanelHTML(station);
      panelsContainer.appendChild(panel);
    });
  }
  createPanelHTML(station) {
    const panel = document.createElement('div');
    panel.className = 'station-panel';
    panel.id = `station-${station.id}`;
    panel.innerHTML = `
      <button class="close-panel" aria-label="Close">&times;</button>
      <div class="station-header">
        <h3 data-i18n="${station.titleKey}">Station ${station.id}</h3>
        <p class="station-location" data-i18n="${station.locationKey}">Loading...</p>
      </div>
      <div class="audio-player">
        <audio controls preload="metadata">
          <source src="${station.audioPath}" type="audio/mpeg">
        </audio>
      </div>
      <div class="curatorial-text" data-i18n="stations.station${station.id}.text">
        <p>Loading...</p>
      </div>
      <div class="metadata">
        <dl>
          <dt>Recorded</dt>
          <dd data-i18n="stations.station${station.id}.date">Date</dd>
          <dt>Depth</dt>
          <dd data-i18n="stations.station${station.id}.depth">Depth</dd>
          <dt>Conditions</dt>
          <dd data-i18n="stations.station${station.id}.conditions">Conditions</dd>
        </dl>
      </div>
    `;
    return panel;
  }
  openStation(stationId) {
    this.closeAllStations();
    const panel = document.getElementById(`station-${stationId}`);
    const overlay = document.querySelector('.panel-overlay');
    if (panel) {
      panel.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  closeAllStations() {
    document.querySelectorAll('.station-panel').forEach(panel => {
      panel.classList.remove('active');
      const audio = panel.querySelector('audio');
      if (audio) audio.pause();
    });
    document.querySelector('.panel-overlay')?.classList.remove('active');
    document.body.style.overflow = '';
  }
  attachCloseHandlers() {
    document.querySelectorAll('.close-panel').forEach(button => {
      button.addEventListener('click', () => this.closeAllStations());
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAllStations();
    });
  }
}
document.addEventListener('DOMContentLoaded', () => { new StationMap(); });

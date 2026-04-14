/* ============================================================
   map.js – Leaflet map initialisation and marker management
   ============================================================ */

const MapModule = (() => {
  let map = null;
  let markers = [];

  function init() {
    map = L.map('map', {
      center: [41.5, 12.5],
      zoom: 5,
      minZoom: 3,
      maxZoom: 14,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    return map;
  }

  function createMarkerIcon(category) {
    return L.divIcon({
      className: `sound-marker ${category || ''}`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10],
    });
  }

  function renderPoints(points, onMarkerClick) {
    // Remove existing markers
    markers.forEach((m) => m.remove());
    markers = [];

    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: createMarkerIcon(point.category),
        title: point.title,
      });

      marker.on('click', () => onMarkerClick(point, marker));

      const popupContent = `
        <strong>${point.title}</strong><br/>
        <small>${point.location}</small>
      `;
      marker.bindPopup(popupContent);

      marker.addTo(map);
      markers.push(marker);
    });
  }

  function setActiveMarker(activeMarker) {
    markers.forEach((m) => {
      const el = m.getElement();
      if (el) el.classList.remove('active');
    });
    if (activeMarker) {
      const el = activeMarker.getElement();
      if (el) el.classList.add('active');
    }
  }

  function flyTo(lat, lng, zoom = 8) {
    map.flyTo([lat, lng], zoom, { duration: 1.2 });
  }

  return { init, renderPoints, setActiveMarker, flyTo };
})();

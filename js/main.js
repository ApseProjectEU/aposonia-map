/* ============================================================
   main.js – Application entry point
   ============================================================ */

(async () => {
  // Initialise map
  MapModule.init();

  // Load soundscape data
  let allPoints = [];
  try {
    const response = await fetch('data/points.json');
    if (!response.ok) throw new Error('Could not load points.json');
    allPoints = await response.json();
  } catch (err) {
    console.warn('Using example data:', err.message);
    try {
      const response = await fetch('data/points-example.json');
      allPoints = await response.json();
    } catch (e) {
      console.error('Failed to load any point data', e);
    }
  }

  // Current active marker reference
  let activeMarker = null;

  function renderFiltered(category) {
    const filtered =
      category === 'all'
        ? allPoints
        : allPoints.filter((p) => p.category === category);

    MapModule.renderPoints(filtered, (point, marker) => {
      activeMarker = marker;
      MapModule.setActiveMarker(marker);
      MapModule.flyTo(point.lat, point.lng);
      UIModule.showPlayer(point);
    });
  }

  // Initialise UI
  UIModule.init({
    onFilterChange: (category) => renderFiltered(category),
  });

  // First render – show all points
  renderFiltered('all');
})();

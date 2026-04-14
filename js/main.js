document.addEventListener('DOMContentLoaded', () => {
    console.log('Aposonía Map initializing...');
    UI.init();
    console.log('UI module initialized');
    MapModule.initMap();
    console.log('Map module initialized');
    MapModule.loadPoints();
    window.UI = UI;
    console.log('Aposonía Map ready');
    console.log('Click on map to get coordinates and create temporary markers');
    console.log('Click on red markers (if points.json loaded) to open details panel');
});

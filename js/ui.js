const UI = {
    elements: {
        sidebar: null,
        closeSidebarBtn: null,
        coordDisplay: null,
        coordText: null,
        exportBtn: null,
        pointName: null,
        pointDescription: null,
        stressValue: null
    },

    init() {
        this.elements.sidebar = document.getElementById('sidebar');
        this.elements.closeSidebarBtn = document.getElementById('close-sidebar');
        this.elements.coordDisplay = document.getElementById('coordinate-display');
        this.elements.coordText = document.getElementById('coord-text');
        this.elements.exportBtn = document.getElementById('export-btn');
        this.elements.pointName = document.getElementById('point-name');
        this.elements.pointDescription = document.getElementById('point-description');
        this.elements.stressValue = document.getElementById('stress-value');
        this.elements.closeSidebarBtn.addEventListener('click', () => this.closeSidebar());
        this.elements.exportBtn.addEventListener('click', () => this.exportCoordinates());
    },

    openSidebar(pointData) {
        this.renderPointDetails(pointData);
        this.elements.sidebar.classList.remove('hidden');
    },

    closeSidebar() {
        this.elements.sidebar.classList.add('hidden');
    },

    renderPointDetails(point) {
        this.elements.pointName.textContent = point.name;
        this.elements.pointDescription.textContent = point.description;
        this.elements.stressValue.textContent = point.stress;
    },

    updateCoordinateDisplay(lat, lng) {
        const formattedLat = lat.toFixed(6);
        const formattedLng = lng.toFixed(6);
        this.elements.coordText.textContent = `Lat: ${formattedLat}, Lng: ${formattedLng}`;
    },

    exportCoordinates() {
        if (window.MapModule && window.MapModule.exportTempMarkers) {
            window.MapModule.exportTempMarkers();
        }
    }
};
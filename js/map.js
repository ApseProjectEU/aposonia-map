const MapModule = {
    map: null,
    points: [],
    tempMarkers: [],
    permanentMarkers: [],

    initMap() {
        this.map = L.map('map').setView([40.6246, 22.9489], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);
        this.map.on('click', (e) => this.onMapClick(e));
        console.log('Map initialized at Nea Paralia, Thessaloniki');
    },

    onMapClick(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        console.log(`Clicked coordinates: Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}`);
        if (window.UI) {
            window.UI.updateCoordinateDisplay(lat, lng);
        }
        this.addTempMarker(lat, lng);
    },

    addTempMarker(lat, lng) {
        const marker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(this.map);
        this.tempMarkers.push({ marker: marker, lat: lat, lng: lng });
        console.log(`Temporary marker added. Total: ${this.tempMarkers.length}`);
    },

    async loadPoints() {
        try {
            const response = await fetch('data/points.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.points = await response.json();
            console.log(`Loaded ${this.points.length} points from JSON`);
            this.renderPermanentMarkers();
        } catch (error) {
            console.error('Error loading points:', error);
            console.warn('No points.json found. Map will work in development mode only.');
        }
    },

    renderPermanentMarkers() {
        this.points.forEach(point => {
            if (!point.id || !point.name || !point.lat || !point.lng) {
                console.warn('Invalid point structure:', point);
                return;
            }
            const marker = this.addMarker(point);
            this.permanentMarkers.push({ marker: marker, data: point });
        });
        console.log(`Rendered ${this.permanentMarkers.length} permanent markers`);
    },

    addMarker(point) {
        const marker = L.marker([point.lat, point.lng], {
            icon: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        }).addTo(this.map);
        marker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            if (window.UI) {
                window.UI.openSidebar(point);
            }
        });
        return marker;
    },

    exportTempMarkers() {
        if (this.tempMarkers.length === 0) {
            alert('No temporary markers to export');
            return;
        }
        const exportData = this.tempMarkers.map((item, index) => ({
            id: `temp_${index + 1}`,
            name: `Point ${index + 1}`,
            lat: parseFloat(item.lat.toFixed(6)),
            lng: parseFloat(item.lng.toFixed(6)),
            description: "Description here",
            stress: 0
        }));
        const jsonString = JSON.stringify(exportData, null, 2);
        navigator.clipboard.writeText(jsonString).then(() => {
            alert(`Exported ${exportData.length} markers to clipboard!`);
            console.log('Exported data:', jsonString);
        }).catch(err => {
            console.error('Could not copy to clipboard:', err);
            console.log('Export data (copy manually):', jsonString);
            alert('Export data logged to console (F12)');
        });
    },

    clearTempMarkers() {
        this.tempMarkers.forEach(item => {
            this.map.removeLayer(item.marker);
        });
        this.tempMarkers = [];
        console.log('All temporary markers cleared');
    }
};

window.MapModule = MapModule;

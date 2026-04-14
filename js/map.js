const MapModule = {
    map: null,
    points: [],
    permanentMarkers: [],

    initMap() {
        this.map = L.map('map', {
            zoomControl: false
        }).setView([40.6246, 22.9489], 16);

        // CartoDB Voyager — clean, modern tourist map style
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        L.control.zoom({ position: 'topright' }).addTo(this.map);

        this.map.on('click', (e) => this.onMapClick(e));
        console.log('Map initialized — Nea Paralia, Thessaloniki');
    },

    createAudioMarkerIcon(number) {
        return L.divIcon({
            className: 'audio-marker-container',
            html: `<div class="audio-marker-pulse"></div>
                   <div class="audio-marker-inner">
                       <span class="audio-marker-number">${number}</span>
                   </div>`,
            iconSize: [46, 46],
            iconAnchor: [23, 23],
            popupAnchor: [0, -26]
        });
    },

    onMapClick(e) {
        if (window.UI) {
            window.UI.updateCoordinateDisplay(e.latlng.lat, e.latlng.lng);
        }
    },

    async loadPoints() {
        try {
            const response = await fetch('data/points.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.points = await response.json();
            this.renderAudioMarkers();
            console.log(`Loaded ${this.points.length} audio markers`);
        } catch (error) {
            console.error('Error loading points.json:', error);
        }
    },

    renderAudioMarkers() {
        this.points.forEach((point, index) => {
            if (!point.lat || !point.lng) {
                console.warn('Point missing coordinates:', point);
                return;
            }
            const marker = L.marker([point.lat, point.lng], {
                icon: this.createAudioMarkerIcon(index + 1)
            }).addTo(this.map);

            marker.on('click', (e) => {
                L.DomEvent.stopPropagation(e);
                if (window.UI) {
                    window.UI.openSidebar(point, index + 1);
                }
            });

            this.permanentMarkers.push({ marker, data: point });
        });
        console.log(`Rendered ${this.permanentMarkers.length} audio markers`);
    }
};

window.MapModule = MapModule;
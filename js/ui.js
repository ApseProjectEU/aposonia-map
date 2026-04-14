const UI = {
    elements: {},
    audioElement: null,
    lastCoords: null,

    init() {
        this.elements = {
            sidebar:        document.getElementById('sidebar'),
            closeSidebarBtn:document.getElementById('close-sidebar'),
            coordText:      document.getElementById('coord-text'),
            copyBtn:        document.getElementById('copy-coords-btn'),
            pointNumber:    document.getElementById('point-number'),
            pointName:      document.getElementById('point-name'),
            pointDescription: document.getElementById('point-description'),
            playPauseBtn:   document.getElementById('play-pause-btn'),
            playIcon:       document.getElementById('play-icon'),
            pauseIcon:      document.getElementById('pause-icon'),
            progressBar:    document.getElementById('progress-bar'),
            progressFill:   document.getElementById('progress-fill'),
            currentTime:    document.getElementById('current-time'),
            totalTime:      document.getElementById('total-time'),
            audioStatus:    document.getElementById('audio-status'),
        };

        this.audioElement = document.getElementById('audio-element');

        this.elements.closeSidebarBtn.addEventListener('click', () => this.closeSidebar());
        this.elements.copyBtn.addEventListener('click', () => this.copyCoords());
        this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.elements.progressBar.addEventListener('click', (e) => this.seekAudio(e));

        this.audioElement.addEventListener('timeupdate', () => this.updateProgress());
        this.audioElement.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
        this.audioElement.addEventListener('ended', () => this.onAudioEnded());
        this.audioElement.addEventListener('error', () => this.onAudioError());
        this.audioElement.addEventListener('canplay', () => {
            this.elements.audioStatus.textContent = '';
            this.elements.playPauseBtn.disabled = false;
        });
    },

    openSidebar(pointData, number) {
        this.stopAudio();

        this.elements.pointNumber.textContent = `Tappa ${number}`;
        this.elements.pointName.textContent = pointData.name;
        this.elements.pointDescription.textContent = pointData.description || '';

        this.loadAudio(pointData.audio);
        this.elements.sidebar.classList.remove('hidden');
    },

    closeSidebar() {
        this.stopAudio();
        this.elements.sidebar.classList.add('hidden');
    },

    loadAudio(audioPath) {
        this.resetPlayer();

        if (!audioPath) {
            this.elements.audioStatus.textContent = 'Audio non disponibile';
            this.elements.playPauseBtn.disabled = true;
            return;
        }

        this.elements.playPauseBtn.disabled = true;
        this.elements.audioStatus.textContent = 'Caricamento…';
        this.audioElement.src = audioPath;
        this.audioElement.load();
    },

    togglePlayPause() {
        if (this.audioElement.paused) {
            this.audioElement.play()
                .then(() => {
                    this.elements.playIcon.classList.add('hidden');
                    this.elements.pauseIcon.classList.remove('hidden');
                })
                .catch((err) => {
                    console.error('Playback error:', err);
                    this.elements.audioStatus.textContent = 'Errore di riproduzione';
                });
        } else {
            this.audioElement.pause();
            this.elements.playIcon.classList.remove('hidden');
            this.elements.pauseIcon.classList.add('hidden');
        }
    },

    stopAudio() {
        this.audioElement.pause();
        this.audioElement.src = '';
        this.resetPlayer();
    },

    resetPlayer() {
        this.elements.progressFill.style.width = '0%';
        this.elements.currentTime.textContent = '0:00';
        this.elements.totalTime.textContent = '0:00';
        this.elements.audioStatus.textContent = '';
        this.elements.playIcon.classList.remove('hidden');
        this.elements.pauseIcon.classList.add('hidden');
        this.elements.playPauseBtn.disabled = true;
    },

    updateProgress() {
        const { currentTime, duration } = this.audioElement;
        if (duration) {
            this.elements.progressFill.style.width = `${(currentTime / duration) * 100}%`;
            this.elements.currentTime.textContent = this.formatTime(currentTime);
        }
    },

    onMetadataLoaded() {
        this.elements.totalTime.textContent = this.formatTime(this.audioElement.duration);
        this.elements.audioStatus.textContent = '';
        this.elements.playPauseBtn.disabled = false;
    },

    seekAudio(e) {
        const { duration } = this.audioElement;
        if (!duration) return;
        const rect = this.elements.progressBar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.audioElement.currentTime = ratio * duration;
    },

    onAudioEnded() {
        this.elements.playIcon.classList.remove('hidden');
        this.elements.pauseIcon.classList.add('hidden');
        this.elements.progressFill.style.width = '0%';
        this.elements.currentTime.textContent = '0:00';
    },

    onAudioError() {
        this.elements.audioStatus.textContent = 'File audio non trovato';
        this.elements.playPauseBtn.disabled = true;
    },

    formatTime(seconds) {
        if (!isFinite(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    },

    updateCoordinateDisplay(lat, lng) {
        this.lastCoords = { lat: lat.toFixed(6), lng: lng.toFixed(6) };
        this.elements.coordText.textContent = `${this.lastCoords.lat}, ${this.lastCoords.lng}`;
    },

    copyCoords() {
        if (!this.lastCoords) return;
        const text = `${this.lastCoords.lat}, ${this.lastCoords.lng}`;
        navigator.clipboard.writeText(text)
            .then(() => {
                this.elements.copyBtn.textContent = 'Copiato!';
                setTimeout(() => { this.elements.copyBtn.textContent = 'Copia'; }, 2000);
            })
            .catch(() => {
                console.log('Coordinates:', text);
            });
    }
};

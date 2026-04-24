class WaveAnimation {
  constructor() {
    this.canvas = document.getElementById('waves');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.waves = [];
    this.init();
  }
  init() {
    this.resize();
    this.createWaves();
    this.animate();
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  createWaves() {
    for (let i = 0; i < 3; i++) {
      this.waves.push({ amplitude: 30 + i * 15, frequency: 0.003 - i * 0.0005, phase: i * Math.PI / 3, speed: 0.0005 + i * 0.0002, opacity: 0.15 - i * 0.03 });
    }
  }
  drawWave(wave, time) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = `rgba(44, 74, 110, ${wave.opacity})`;
    this.ctx.lineWidth = 2;
    for (let x = 0; x < this.canvas.width; x++) {
      const y = this.canvas.height / 2 + Math.sin(x * wave.frequency + wave.phase + time * wave.speed) * wave.amplitude;
      x === 0 ? this.ctx.moveTo(x, y) : this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();
  }
  animate() {
    const time = Date.now();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.waves.forEach(w => this.drawWave(w, time));
    requestAnimationFrame(() => this.animate());
  }
}
document.addEventListener('DOMContentLoaded', () => { new WaveAnimation(); });

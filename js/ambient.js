function initAmbientCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, animFrame;
  let time = 0;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function drawWave(baseY, amplitude, frequency, phase, opacity) {
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= width; x += 2) {
      const y = baseY
        + Math.sin(x * frequency + phase + time) * amplitude
        + Math.sin(x * frequency * 0.47 + phase * 1.3 + time * 0.71) * amplitude * 0.4;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(44, 74, 110, ${opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time += 0.007;

    const waves = [
      { y: 0.28, amp: 22, freq: 0.0075, phase: 0.0, opacity: 0.45 },
      { y: 0.38, amp: 16, freq: 0.0110, phase: 1.2, opacity: 0.30 },
      { y: 0.50, amp: 28, freq: 0.0058, phase: 2.5, opacity: 0.50 },
      { y: 0.62, amp: 18, freq: 0.0095, phase: 0.7, opacity: 0.25 },
      { y: 0.72, amp: 12, freq: 0.0140, phase: 3.1, opacity: 0.20 },
    ];

    waves.forEach(w => drawWave(height * w.y, w.amp, w.freq, w.phase, w.opacity));
    animFrame = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();

  return function destroy() {
    cancelAnimationFrame(animFrame);
    window.removeEventListener('resize', resize);
  };
}

document.addEventListener('DOMContentLoaded', initAmbientCanvas);

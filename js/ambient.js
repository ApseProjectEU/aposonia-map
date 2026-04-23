function initAmbientCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, frame;
  let time = 0;

  function resize() {
    width  = canvas.width  = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function wave(baseY, amp, freq, phase, opacity) {
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= width; x += 2) {
      const y = baseY
        + Math.sin(x * freq + phase + time) * amp
        + Math.sin(x * freq * 0.5 + phase * 1.3 + time * 0.7) * amp * 0.4;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(44, 74, 110, ${opacity})`;
    ctx.lineWidth   = 1;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time += 0.008;

    [
      { y: 0.30, amp: 20, freq: 0.008, phase: 0.0, op: 0.40 },
      { y: 0.40, amp: 15, freq: 0.012, phase: 1.2, op: 0.30 },
      { y: 0.50, amp: 25, freq: 0.006, phase: 2.4, op: 0.50 },
      { y: 0.60, amp: 18, freq: 0.010, phase: 0.8, op: 0.25 },
      { y: 0.70, amp: 12, freq: 0.015, phase: 3.1, op: 0.20 },
    ].forEach(w => wave(height * w.y, w.amp, w.freq, w.phase, w.op));

    frame = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

document.addEventListener('DOMContentLoaded', initAmbientCanvas);

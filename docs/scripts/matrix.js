// One decorative canvas; no image downloads or individual DOM nodes per glyph.
export function initMatrix() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-background';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) { canvas.remove(); return; }

  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]=+*';
  let width = 0, height = 0, streams = [], frame = null, lastTime = 0;
  let dark = document.body.classList.contains('dark-mode');
  const observer = new MutationObserver(() => {
    dark = document.body.classList.contains('dark-mode');
    if (!running()) draw(0);
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  function running() { return !document.hidden; }
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const spacing = width < 600 ? 36 : 40;
    streams = Array.from({ length: Math.ceil(width / spacing) }, (_, column) => ({
      x: column * spacing + 12,
      y: Math.random() * height,
      speed: 60 + Math.random() * 40,
      length: 8 + Math.floor(Math.random() * 12),
      seed: Math.floor(Math.random() * 10000),
      visible: Math.random() > 0.25
    }));
    draw(0);
  }
  function draw(time, elapsed = 0) {
    context.clearRect(0, 0, width, height);
    context.font = '15px Consolas, monospace';
    context.textBaseline = 'top';
    for (const stream of streams) {
      if (!stream.visible) continue;
      stream.y += stream.speed * elapsed;
      if (stream.y - stream.length * 20 > height) stream.y = -20;
      for (let row = 0; row < stream.length; row++) {
        const y = stream.y - row * 20;
        if (y < -20 || y > height) continue;
        const phase = Math.floor(time / 80);
        const index = (stream.seed + row * 13 + phase * (row % 3 + 1)) % glyphs.length;
        context.globalAlpha = (1 - row / stream.length) * (dark ? 0.75 : 0.45);
        context.fillStyle = row === 0 ? '#C5191B' : '#9C2830';
        context.fillText(glyphs[index], stream.x, y);
      }
    }
    context.globalAlpha = 1;
  }
  function tick(time) {
    if (!running()) { frame = null; return; }
    // Cap drawing at 24 fps; movement uses elapsed time, not display refresh rate.
    if (time - lastTime >= 1000 / 24) {
      const elapsed = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      draw(time, elapsed);
      lastTime = time;
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastTime = 0;
    if (running()) frame = requestAnimationFrame(tick);
    else if (!document.hidden) draw(0);
  }
  let resizeFrame = null;
  window.addEventListener('resize', () => {
    if (resizeFrame !== null) return;
    resizeFrame = requestAnimationFrame(() => { resizeFrame = null; resize(); });
  }, { passive: true });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
  });
  window.addEventListener('pageshow', sync);
  resize();
  sync();
}

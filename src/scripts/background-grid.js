/**
 * Background canvas — keeps #bg-canvas transparent.
 * mousemove spotlight tracking removed.
 */
export function initBackgroundGrid() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, dpr;
  let lastWidth = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    lastWidth = w;
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) resize();
  });

  resize();
}

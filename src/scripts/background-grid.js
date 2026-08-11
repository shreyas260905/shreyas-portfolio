/**
 * Background canvas — keeps #bg-canvas transparent; updates --mx/--my for #spotlight.
 */
export function initBackgroundGrid() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mx', ((e.clientX / w) * 100) + '%');
    document.documentElement.style.setProperty('--my', ((e.clientY / h) * 100) + '%');
  });
}

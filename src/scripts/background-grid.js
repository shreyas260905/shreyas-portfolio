/**
 * Background canvas — keeps #bg-canvas transparent; updates --mx/--my for #spotlight.
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
    // Do not set canvas.style.width / canvas.style.height here.
    // The CSS rule `position: fixed; inset: 0` already makes the canvas
    // fill the entire viewport at all times, including when the mobile
    // browser chrome shows/hides. Letting JS override the CSS size was
    // the cause of the black rectangle at the bottom on mobile.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    lastWidth = w;
  }

  // Only resize the canvas buffer when the viewport WIDTH changes.
  // On mobile, the browser address-bar expanding/collapsing causes
  // height-only resize events. Since the canvas draws nothing (transparent
  // clear only), a stale buffer height is harmless — the CSS inset:0
  // keeps it visually covering the full viewport regardless.
  window.addEventListener('resize', () => {
    if (window.innerWidth !== lastWidth) resize();
  });

  resize();

  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mx', ((e.clientX / w) * 100) + '%');
    document.documentElement.style.setProperty('--my', ((e.clientY / h) * 100) + '%');
  });
}

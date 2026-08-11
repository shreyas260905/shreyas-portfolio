/**
 * Scroll progress
 * Fills the top progress bar based on scroll position and toggles the
 * back-to-top button's visibility once the user scrolls past 600px.
 */
export function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  const toTop = document.getElementById('to-top');
  if (!bar || !toTop) return;

  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrolled = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight) * 100;
    bar.style.width = scrolled + '%';

    if (doc.scrollTop > 600) {
      toTop.classList.add('show');
    } else {
      toTop.classList.remove('show');
    }
  });

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

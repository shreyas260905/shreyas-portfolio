/**
 * Non-blocking page loader
 * Immediately renders page content on initial load.
 */
export function initPreloader() {
  const pre = document.getElementById('preloader');
  if (pre) {
    pre.style.display = 'none';
  }
}

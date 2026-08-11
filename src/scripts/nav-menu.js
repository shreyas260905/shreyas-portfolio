/**
 * Mobile / overlay navigation menu
 * Toggles panel, locks scroll (Lenis + body), closes on link selection.
 */
import { getLenis } from './smooth-scroll.js';

const MENU_CLOSE_MS = 360;

export function initNavMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  const closeBtn = document.querySelector('.nav-menu-close');
  const backdrop = document.querySelector('.nav-menu-backdrop');
  const menuLinks = document.querySelectorAll('.nav-menu-links a');

  if (!toggle || !menu) return;

  let closeTimer = null;

  function clearCloseTimer() {
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function closeMenu() {
    if (!menu.classList.contains('open') || menu.classList.contains('is-closing')) return;

    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    menu.classList.add('is-closing');
    menu.classList.remove('open');

    closeTimer = window.setTimeout(finishClose, MENU_CLOSE_MS);
  }

  function finishClose() {
    clearCloseTimer();
    menu.classList.remove('is-closing');
    menu.setAttribute('aria-hidden', 'true');

    const lenis = getLenis();
    if (lenis) lenis.start();
  }

  function openMenu() {
    if (menu.classList.contains('open')) return;

    clearCloseTimer();
    menu.classList.remove('is-closing');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');

    const lenis = getLenis();
    if (lenis) lenis.stop();

    requestAnimationFrame(() => {
      menu.classList.add('open');
    });
  }

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  closeBtn?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);

  menuLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  window.matchMedia('(min-width: 701px)').addEventListener('change', (e) => {
    if (e.matches && (menu.classList.contains('open') || menu.classList.contains('is-closing'))) {
      clearCloseTimer();
      menu.classList.remove('open', 'is-closing');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');

      const lenis = getLenis();
      if (lenis) lenis.start();
    }
  });
}

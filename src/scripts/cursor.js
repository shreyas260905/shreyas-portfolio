/**
 * Desktop-Only Custom Cursor & Magnetic Interactions
 * Creates a subtle dot cursor and magnetic responses over interactive elements.
 * Completely disabled on touch and mobile devices.
 */
import { gsap } from 'gsap';

function getToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function initCustomCursor() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const accent = getToken('--accent');

  document.getElementById('custom-cursor-ring')?.remove();

  let dot = document.getElementById('custom-cursor');

  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'custom-cursor';
    dot.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 11px;
      height: 11px;
      background: ${accent};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(dot);
  } else {
    dot.style.width = '11px';
    dot.style.height = '11px';
    dot.style.background = accent;
  }

  const xDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power2.out' });
  const yDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power2.out' });

  let visible = false;

  window.addEventListener('mousemove', (e) => {
    if (!visible) {
      dot.style.opacity = '1';
      visible = true;
    }
    xDot(e.clientX);
    yDot(e.clientY);
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    visible = false;
  });

  const magneticEls = document.querySelectorAll('.scroll-cue, .nav-brand, .contact-cell');
  magneticEls.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: relX * 0.25,
        y: relY * 0.25,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  });
}

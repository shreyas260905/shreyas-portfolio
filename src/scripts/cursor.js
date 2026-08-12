/**
 * Desktop-Only Custom Cursor & Magnetic Interactions
 * Four-dot trailing cursor with magnetic responses on select elements.
 * Completely disabled on touch and mobile devices.
 */
import { gsap } from 'gsap';

function getToken(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const DOT_SIZES = [12, 9, 6, 4];
const MAIN_LERP = 0.55;
const TRAIL_LERP = [0.34, 0.28, 0.22];

export function initCustomCursor() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  const accent = getToken('--accent');

  document.documentElement.classList.add('has-custom-cursor');
  document.getElementById('custom-cursor')?.remove();
  document.getElementById('custom-cursor-ring')?.remove();
  document.querySelectorAll('.custom-cursor-dot').forEach((el) => el.remove());

  const dots = DOT_SIZES.map((size, index) => {
    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    dot.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: ${size}px;
      height: ${size}px;
      background: ${accent};
      border-radius: 50%;
      pointer-events: none;
      z-index: ${9999 - index};
      opacity: 0;
      will-change: transform;
    `;
    document.body.appendChild(dot);
    return dot;
  });

  const positions = dots.map(() => ({ x: 0, y: 0 }));
  const mouse = { x: 0, y: 0 };
  let visible = false;

  function showCursor() {
    if (visible) return;
    dots.forEach((dot) => {
      dot.style.opacity = '1';
    });
    visible = true;
  }

  function hideCursor() {
    if (!visible) return;
    dots.forEach((dot) => {
      dot.style.opacity = '0';
    });
    visible = false;
  }

  function updateTrail() {
    positions[0].x += (mouse.x - positions[0].x) * MAIN_LERP;
    positions[0].y += (mouse.y - positions[0].y) * MAIN_LERP;

    for (let i = 1; i < dots.length; i += 1) {
      positions[i].x += (positions[i - 1].x - positions[i].x) * TRAIL_LERP[i - 1];
      positions[i].y += (positions[i - 1].y - positions[i].y) * TRAIL_LERP[i - 1];
    }

    dots.forEach((dot, index) => {
      gsap.set(dot, {
        x: positions[index].x,
        y: positions[index].y,
        xPercent: -50,
        yPercent: -50,
      });
    });
  }

  window.addEventListener(
    'mousemove',
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      showCursor();
    },
    { passive: true },
  );

  document.addEventListener('mouseleave', hideCursor);

  gsap.ticker.add(updateTrail);

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

/**
 * Desktop-Only Custom Cursor — 4-dot trailing comet
 * Main dot follows the pointer; three smaller dots trail with smooth lerp.
 * Completely disabled on touch and coarse-pointer devices.
 */
import { gsap } from 'gsap';

const DOT_SIZES = [12, 9, 6, 4];
const TRAIL_LERP = 0.38;

function getAccentColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--cyan').trim()
    || getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
}

function createDot(size, color) {
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;
  dot.style.background = color;
  return dot;
}

export function initCustomCursor() {
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return;

  document.documentElement.classList.add('has-custom-cursor');

  document.getElementById('custom-cursor-ring')?.remove();
  document.getElementById('custom-cursor')?.remove();
  document.getElementById('custom-cursor-trail')?.remove();

  const accent = getAccentColor();
  const trail = document.createElement('div');
  trail.id = 'custom-cursor-trail';
  trail.setAttribute('aria-hidden', 'true');

  const dots = DOT_SIZES.map((size) => {
    const dot = createDot(size, accent);
    trail.appendChild(dot);
    return dot;
  });

  document.body.appendChild(trail);

  const positions = DOT_SIZES.map(() => ({ x: -100, y: -100 }));
  const mouse = { x: -100, y: -100 };
  let visible = false;

  const renderDots = () => {
    positions[0].x = mouse.x;
    positions[0].y = mouse.y;

    for (let i = 1; i < DOT_SIZES.length; i += 1) {
      positions[i].x += (positions[i - 1].x - positions[i].x) * TRAIL_LERP;
      positions[i].y += (positions[i - 1].y - positions[i].y) * TRAIL_LERP;
    }

    dots.forEach((dot, index) => {
      dot.style.transform = `translate3d(${positions[index].x}px, ${positions[index].y}px, 0) translate(-50%, -50%)`;
    });
  };

  const tick = () => renderDots();
  gsap.ticker.add(tick);

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    if (!visible) {
      dots.forEach((dot) => {
        dot.style.opacity = '1';
      });
      visible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    dots.forEach((dot) => {
      dot.style.opacity = '0';
    });
    visible = false;
  });

  const magneticEls = document.querySelectorAll('.scroll-cue, .nav-brand, .contact-cell');
  magneticEls.forEach((btn) => {
    btn.addEventListener('mousemove', (event) => {
      const rect = btn.getBoundingClientRect();
      const relX = event.clientX - rect.left - rect.width / 2;
      const relY = event.clientY - rect.top - rect.height / 2;

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

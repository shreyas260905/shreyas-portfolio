/**
 * Smooth Scroll Engine
 * Integrates Lenis smooth scrolling with GSAP ScrollTrigger ticker.
 * Automatically respects prefers-reduced-motion and provides an exported API.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

const NAV_OFFSET = -40;
const SCROLL_DURATION = 1.2;

export function scrollToSection(targetId) {
  if (!targetId || targetId === '#' || targetId === '#top') {
    document.body.classList.remove('nav-open');

    if (lenisInstance) {
      if (lenisInstance.isStopped) lenisInstance.start();
      lenisInstance.scrollTo(0, { duration: 1.1 });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const targetEl = document.querySelector(targetId);
  if (!targetEl) return;

  document.body.classList.remove('nav-open');

  if (lenisInstance) {
    if (lenisInstance.isStopped) lenisInstance.start();
    lenisInstance.scrollTo(targetEl, {
      offset: NAV_OFFSET,
      duration: SCROLL_DURATION,
    });
    return;
  }

  const top = targetEl.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
  window.scrollTo({ top, behavior: 'smooth' });
}

function handleAnchorClick(e) {
  const targetId = e.currentTarget.getAttribute('href');
  if (!targetId) return;

  if (targetId === '#' || targetId === '#top') {
    e.preventDefault();
    scrollToSection(targetId);
    return;
  }

  if (!document.querySelector(targetId)) return;

  e.preventDefault();
  scrollToSection(targetId);
}

export function initSmoothScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lenis smooth scrolling is only used on desktop fine-pointer (mouse) devices.
  // Touch devices (mobile/tablet) use native browser scrolling so that pinch-to-zoom,
  // zoomed scrolling, and momentum scrolling all work with zero JavaScript interference.
  const isTouchDevice =
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(pointer: coarse)').matches;

  if (!prefersReducedMotion && !isTouchDevice) {
    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', handleAnchorClick);
  });

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

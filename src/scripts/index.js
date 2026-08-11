/**
 * Scripts entry point
 * Wires up every interaction module cleanly.
 */
import { initPreloader } from './preloader.js';
import { initBackgroundGrid } from './background-grid.js';
import { initScrollProgress } from './scroll-progress.js';
import { initReveal } from './reveal.js';
import { initCounters } from './counters.js';
import { initTilt } from './tilt.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initHeroSequence } from './hero-sequence.js';
import { initCustomCursor } from './cursor.js';
import { initScrollNarrative } from './scroll-narrative.js';
import { initNavMenu } from './nav-menu.js';

export function initSite() {
  initSmoothScroll();     // Lenis + GSAP ScrollTrigger ticker integration
  initNavMenu();           // Mobile / overlay navigation menu
  initPreloader();        // Non-blocking render
  initBackgroundGrid();    // Transparent bg canvas + spotlight mouse coords
  initHeroSequence();      // Progressive hero entrance sequence
  initCustomCursor();      // Desktop-only custom cursor & magnetic buttons
  initScrollNarrative();   // Nav active indicator & section header line reveals
  initScrollProgress();    // Top progress bar + back-to-top button
  initReveal();             // Fade-up on scroll for .reveal elements
  initCounters();           // Animated stat counters in About
  initTilt();                // 3D tilt on [data-tilt] project cards
}

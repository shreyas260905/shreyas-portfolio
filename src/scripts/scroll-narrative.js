/**
 * Scroll Narrative Manager
 *
 * Owns two jobs:
 *   1. Navbar scroll-state + top progress bar.
 *   2. Active nav-link highlighting.
 *   3. Section-heading entrance animation (single system — GSAP only).
 *
 * Previously the section-head divs also carried the `.reveal` class,
 * causing the IntersectionObserver in reveal.js and these ScrollTrigger
 * timelines to fight each other, producing the visible flicker/stall.
 * That class has been removed from all `.section-head` elements in the
 * HTML; this file is now the sole owner of their entrance animation.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollNarrative() {
  const progressBar = document.getElementById('scroll-progress');
  const nav         = document.querySelector('nav');
  const sections    = document.querySelectorAll('header.hero, section[id]');

  if (!sections.length) return;

  /* ------------------------------------------------------------------
   * 1. Navbar scrolled state + progress bar  (rAF-throttled)
   * ------------------------------------------------------------------ */
  let scrollRafId = null;
  window.addEventListener('scroll', () => {
    if (scrollRafId) return;
    scrollRafId = requestAnimationFrame(() => {
      scrollRafId = null;
      const doc      = document.documentElement;
      const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight) * 100;
      if (progressBar) progressBar.style.width = scrolled + '%';
      if (nav)         nav.classList.toggle('scrolled', doc.scrollTop > 50);
    });
  }, { passive: true });

  /* ------------------------------------------------------------------
   * 2. Active nav-link indicator
   * ------------------------------------------------------------------ */
  sections.forEach((sec) => {
    const id = sec.getAttribute('id');
    if (!id) return;

    ScrollTrigger.create({
      trigger: sec,
      start: 'top 40%',
      end:   'bottom 40%',
      onEnter:     () => setActiveNav(id),
      onEnterBack: () => setActiveNav(id),
    });
  });

  function setActiveNav(id) {
    document.querySelectorAll('.nav-links a, .nav-menu-links a').forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  /* ------------------------------------------------------------------
   * 3. Section-heading entrance — single GSAP system, no IO conflict
   *
   * Each `.section-head` starts invisible (set via gsap.set so there is
   * no flash of unstyled content and no competing CSS opacity:0 rule).
   * A ScrollTrigger fires once when the heading enters the viewport and
   * plays a lightweight timeline: fade + lift for the whole block, then
   * a scale-in for the coral rule.  No per-child fromTo calls that
   * previously caused the y-clash with the parent reveal.
   * ------------------------------------------------------------------ */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.section-head').forEach((head) => {
    const rule = head.querySelector('.rule');

    if (prefersReduced) {
      // Just make them visible immediately, no animation.
      gsap.set(head, { opacity: 1, y: 0 });
      if (rule) gsap.set(rule, { scaleX: 1 });
      return;
    }

    // Prime the starting state — this replaces the removed CSS opacity:0
    // that the .reveal class used to provide.
    gsap.set(head, { opacity: 0, y: 22 });
    if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

    // Animate the whole heading block in as one unit — no per-child splits
    // that can mismatch timing with the parent.
    tl.to(head, { opacity: 1, y: 0, duration: 0.55 });

    // Rule draws in after the heading is visible
    if (rule) {
      tl.to(rule, { scaleX: 1, duration: 0.65, ease: 'power2.out' }, '-=0.3');
    }

    ScrollTrigger.create({
      trigger: head,
      // Fire when the top of the heading crosses 82% down the viewport —
      // earlier than the previous 85% so it feels less delayed.
      start:   'top 82%',
      once:    true,          // fire exactly once, never re-trigger
      onEnter: () => tl.play(),
    });
  });
}

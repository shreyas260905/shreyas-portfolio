/**
 * Scroll Narrative Manager
 * Synchronizes top progress bar, active navigation indicator, section header line reveals, and back-to-top button.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollNarrative() {
  const progressBar = document.getElementById('scroll-progress');
  const nav = document.querySelector('nav');
  const sections = document.querySelectorAll('header.hero, section[id]');

  if (!sections.length) return;

  // 1. Navbar scrolled reaction & Top scroll progress
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    const scrolled = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight) * 100;
    
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    if (nav) {
      if (doc.scrollTop > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // 2. Active section navigation indicator
  sections.forEach((sec) => {
    const id = sec.getAttribute('id');
    if (!id) return;

    ScrollTrigger.create({
      trigger: sec,
      start: 'top 40%',
      end: 'bottom 40%',
      onEnter: () => setActiveNav(id),
      onEnterBack: () => setActiveNav(id)
    });
  });

  function setActiveNav(id) {
    document.querySelectorAll('.nav-links a, .nav-menu-links a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // 3. Section header motion + rule reveal
  // Opacity is owned by .reveal / reveal.js on .section-head — GSAP must not set child opacity.
  const sectionHeads = document.querySelectorAll('.section-head');
  sectionHeads.forEach((head) => {
    const tag = head.querySelector('.tag');
    const title = head.querySelector('h2');
    const rule = head.querySelector('.rule');

    // Clear any stale inline opacity left by the previous fromTo implementation
    if (tag) gsap.set(tag, { clearProps: 'opacity' });
    if (title) gsap.set(title, { clearProps: 'opacity' });

    const tl = gsap.timeline({ paused: true });

    if (tag) {
      tl.fromTo(
        tag,
        { y: 10 },
        { y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false },
        0
      );
    }
    if (title) {
      tl.fromTo(
        title,
        { y: 14 },
        { y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false },
        0.2
      );
    }
    if (rule) {
      tl.fromTo(
        rule,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.7, ease: 'power2.out', immediateRender: false },
        0.35
      );
    }

    ScrollTrigger.create({
      trigger: head,
      start: 'top 85%',
      onEnter: () => tl.play(),
      onEnterBack: () => tl.progress(1),
    });
  });
}

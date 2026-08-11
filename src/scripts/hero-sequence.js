/**
 * Hero Entrance Sequence & Interactive Subtle Movement
 * Animates hero content progressively on initial load using GSAP.
 * Hero name uses a lightweight letter-by-letter typing effect.
 */
import { gsap } from 'gsap';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function charDelay(char, prevChar) {
  if (char === ' ') return 95;
  if (char === '.' || char === ',') return 240;
  if (prevChar === '.') return 300;
  return 78 + Math.random() * 38;
}

function extractHeroLines() {
  return Array.from(document.querySelectorAll('.hero h1 span.line')).map((el) => ({
    el,
    text: el.textContent.trim(),
    initialLen: el.querySelector('.initial')?.textContent.length ?? 0,
  }));
}

function renderFullName(lines) {
  lines.forEach(({ el, text, initialLen }) => {
    el.textContent = '';

    if (initialLen > 0) {
      const initialSpan = document.createElement('span');
      initialSpan.className = 'initial';
      initialSpan.textContent = text.slice(0, initialLen);
      el.appendChild(initialSpan);

      if (text.length > initialLen) {
        el.appendChild(document.createTextNode(text.slice(initialLen)));
      }
      return;
    }

    el.textContent = text;
  });
}

async function typeHeroName(lines) {
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const { el, text, initialLen } = lines[lineIndex];
    el.textContent = '';

    let initialSpan = null;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const prevChar = i > 0 ? text[i - 1] : '';

      await wait(charDelay(char, prevChar));

      if (initialLen > 0 && i < initialLen) {
        if (!initialSpan) {
          initialSpan = document.createElement('span');
          initialSpan.className = 'initial';
          el.appendChild(initialSpan);
        }
        initialSpan.textContent += char;
      } else {
        el.appendChild(document.createTextNode(char));
      }
    }

    if (lineIndex < lines.length - 1) {
      await wait(340);
    }
  }
}

function tweenTo(target, vars) {
  return new Promise((resolve) => {
    gsap.to(target, {
      ...vars,
      onComplete: resolve,
    });
  });
}

export function initHeroSequence() {
  const eyebrow = document.querySelector('.hero-eyebrow');
  const titleLines = document.querySelectorAll('.hero h1 span.line');
  const sub = document.querySelector('.hero-sub');
  const titleblockCells = document.querySelectorAll('.titleblock div');
  const scrollCue = document.querySelector('.scroll-cue');
  const titleblock = document.querySelector('.titleblock');

  if (!eyebrow || !titleLines.length) return;

  const heroLines = extractHeroLines();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    gsap.set([eyebrow, titleLines, sub, titleblockCells, scrollCue, titleblock], {
      opacity: 1,
      y: 0,
      clearProps: 'all',
    });
    renderFullName(heroLines);
    return;
  }

  gsap.set(eyebrow, { opacity: 0, y: 14 });
  gsap.set(titleLines, { opacity: 1, y: 0 });
  heroLines.forEach(({ el }) => {
    el.textContent = '';
  });
  gsap.set(sub, { opacity: 0, y: 18 });
  gsap.set(titleblock, { opacity: 0, y: 16 });
  gsap.set(titleblockCells, { opacity: 0, y: 10 });
  gsap.set(scrollCue, { opacity: 0, y: 12 });

  (async () => {
    await tweenTo(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    await typeHeroName(heroLines);

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(sub, { opacity: 1, y: 0, duration: 0.6 })
      .to(titleblock, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      .to(
        titleblockCells,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
        },
        '-=0.3',
      )
      .to(scrollCue, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');
  })();
}

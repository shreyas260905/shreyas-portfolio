/**
 * Reveal on scroll
 *
 * Adds `.in` to `.reveal` elements as they enter the viewport, triggering
 * the CSS fade-up defined in utilities.css.  Each element animates once.
 *
 * Changes from previous version:
 *  - threshold raised to 0.08 (fires slightly earlier so elements are never
 *    seen mid-stall when scrolling quickly).
 *  - rootMargin of "0px 0px -40px 0px" ensures the trigger fires before the
 *    element is fully clipped by the bottom edge on fast scrolls.
 *  - will-change is set on observation and cleared after the animation
 *    completes to avoid keeping GPU layers alive indefinitely.
 */
export function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  // Prime will-change so the browser allocates the compositing layer
  // before the element scrolls into view, avoiding the mid-scroll hitch.
  revealEls.forEach((el) => {
    el.style.willChange = 'opacity, transform';
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('in');
        io.unobserve(el);

        // Release the compositing layer once the transition ends
        // so we don't keep every revealed element promoted forever.
        el.addEventListener('transitionend', () => {
          el.style.willChange = 'auto';
        }, { once: true });
      });
    },
    {
      threshold:  0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach((el) => io.observe(el));
}

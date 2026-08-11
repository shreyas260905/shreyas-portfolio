/**
 * Reveal on scroll
 * Adds the `.in` class to any `.reveal` element once it enters the
 * viewport (triggers the fade-up defined in utilities.css). Each
 * element animates once, then stops being observed.
 */
export function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => io.observe(el));
}

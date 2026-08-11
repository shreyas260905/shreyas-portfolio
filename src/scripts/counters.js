/**
 * Animated counters
 * Counts each `.counter-num[data-target]` element up from 0 to its
 * target value with an ease-out cubic curve, starting once it scrolls
 * into view.
 */
export function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.floor(eased * target);
          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => counterIO.observe(el));
}

/**
 * Tilt on hover
 * Applies a subtle 3D perspective tilt to any element with the
 * [data-tilt] attribute, following the cursor position within the
 * element's bounding box. Resets on mouse leave.
 */
export function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${py * -3}deg) rotateY(${px * 3}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

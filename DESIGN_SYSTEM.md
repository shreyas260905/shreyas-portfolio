# Design System

Navy, cream, and coral. Tokens live in `src/styles/tokens.css`.

## Color

| Token | Value | Usage |
|---|---|---|
| `--navy` / `--bg-0` | `#14213D` | Dominant background |
| `--navy-deep` | `#0B1428` | Deep background, vignette |
| `--navy-dark` / `--bg-1` | `#101C35` | Elevated glass surfaces |
| `--cream` / `--paper` | `#F4EDE0` | Primary text |
| `--cream-light` | `#FAF7F0` | Hover text |
| `--cream-muted` / `--paper-dim` | `#D8D0C3` | Supporting text |
| `--coral` / `--accent` / `--cyan` | `#FF6B5B` | Buttons, active indicators, emphasis |
| `--coral-hover` | `#FF8173` | Hover state for coral |
| `--border-subtle` | `rgba(244, 237, 224, 0.16)` | Glass borders |

`--cyan` remains an alias of coral so older selectors stay on palette.

## Typography

- Display and labels: Manrope (`--font-display`)
- Body: Inter (`--font-sans`)
- Headings use weight 500–600 and tight tracking. Body stays at 400.

## Surfaces

Glass panels use `--glass-bg`, `backdrop-filter`, a cream hairline, soft shadow, and `--radius-lg` (28px) or `--radius-md` (18px). Navigation and buttons use `--radius-pill`.

The page atmosphere (gradient, pinstripes, cream glow, coral glow, vignette) is the fixed `.atmosphere` layer in `index.html`, styled in `components.css`.

## Motion

Section reveal, card lift, glow drift, and coral hovers respect `prefers-reduced-motion` via the global rule in `base.css`. Hero entrance is sequenced in `src/scripts/hero-sequence.js`.

# Design System

This document describes the current visual language of the site so any
change — by you, or by an AI coding tool — stays consistent with it.
Every token referenced here lives in **`src/styles/tokens.css`**; change
a value there and it updates everywhere it's used.

## Concept

The site is styled as an **engineering blueprint / schematic drawing**:
matte black background, a faint drafting grid, hairline borders, corner
brackets on cards (like a technical-drawing crop mark), and a hero
"title block" styled after the stamp in the corner of an engineering
drawing sheet. Section eyebrows read like log entries ("Field Notes",
"Build Log", "Proof of Work") rather than a numbered sequence, since the
content isn't a literal step-by-step process.

## Color

| Token | Value | Usage |
|---|---|---|
| `--bg-0` | `#0a0a0b` | Page background (matte black) |
| `--bg-1` | `#111113` | Hover / raised surface |
| `--bg-2` | `#18181b` | Reserved for a further-raised surface |
| `--grid-line` | `rgba(255,255,255,0.045)` | Faint hairlines (background canvas grid) |
| `--grid-line-strong` | `rgba(255,255,255,0.10)` | Visible hairlines — card borders, dividers |
| `--cyan` | `#7dd3fc` | Primary accent — links, brackets, borders on hover, progress bar |
| `--cyan-bright` | `#b6e9ff` | Brighter accent — data values, emphasis |
| `--amber` | `#f3a949` | Secondary accent — eyebrow labels, kickers, impact-line highlights |
| `--paper` | `#eceef0` | Primary text |
| `--paper-dim` | `#8c8e93` | Secondary / muted text |

**To re-theme the whole site**, change these eight values in
`tokens.css`. Nothing else needs to change — every component references
these variables, never a hex code directly.

## Typography

| Token | Value | Role |
|---|---|---|
| `--font-mono` | `'JetBrains Mono', monospace` | Headings, labels, data, nav, buttons — the "technical" voice |
| `--font-sans` | `'Inter', sans-serif` | Body copy — bio text, project descriptions |

Loaded via Google Fonts `<link>` tags in `index.html` (see "External
services" in README.md).

**Type scale** is mostly set per-component rather than a strict global
scale, since headings range from a fluid 92px hero down to 9px labels.
Reference sizes in use:

- Hero H1: `clamp(40px, 8vw, 92px)`
- Section H2: `clamp(28px, 4vw, 42px)`
- Project title: `22px`
- Body / descriptions: `16px`
- Labels / kickers / meta: `9–13px`, always `--font-mono`, usually
  `letter-spacing: 0.08–0.2em` and uppercase

## Spacing

Defined as a scale in `tokens.css`. Use these for anything that repeats
across components; one-off sizes (e.g. the 44px project index numeral)
stay local to that component's stylesheet.

| Token | Value |
|---|---|
| `--space-2xs` | 4px |
| `--space-xs` | 8px |
| `--space-sm` | 12px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |
| `--space-3xl` | 64px |
| `--space-section` | 110px (vertical padding for every `<section>`) |

Content is constrained by `--content-max-width: 1100px` with
`--content-padding-inline: 32px` side padding, applied via the `.wrap`
utility class.

## Border radius

`--radius-none: 0px`. The entire site is intentionally hard-edged — no
rounded corners anywhere, in keeping with the blueprint/schematic
concept. If you want to soften the design, add a `--radius-*` scale to
`tokens.css` and apply it to `.sheet`, `.chip`, `.legend-cell`,
`.contact-cell`, etc.

## Shadows

The design uses almost no drop shadows — depth comes from borders,
background-color shifts on hover, and the `box-shadow` glow on the
progress bar / timeline dots instead. Existing uses:

- `#scroll-progress`: `box-shadow: 0 0 8px var(--cyan)` (glow)
- `.t-item:hover::before`: `box-shadow: 0 0 0 4px rgba(125,211,252,0.15)` (ring)

## Motion

| Token | Value | Usage |
|---|---|---|
| `--transition-fast` | `0.2s ease` | Color/border hover states |
| `--transition-base` | `0.3s ease` | Background/transform hover states |
| `--transition-slow` | `0.6s ease` | Preloader fade-out |
| `--ease-out-expo` | `cubic-bezier(0.16, 0.84, 0.44, 1)` | Scroll-reveal and hero entrance easing |

**Named animation moments** (see `hero.css`, `utilities.css`):
- `fadeUp` — used for the staggered hero entrance (eyebrow → name lines
  → subtitle → titleblock → scroll cue)
- `pulse-line` — the pulsing line next to "SCROLL" in the hero
- `.reveal` — generic scroll-triggered fade-up used on every section
  header and content block, driven by `src/scripts/reveal.js`

All animation respects `prefers-reduced-motion: reduce` (see
`base.css`) — durations collapse to near-zero and scroll-behavior
becomes instant.

## Breakpoints

CSS custom properties can't be used inside `@media` queries, so these
are literals, documented here and in `tokens.css`:

| Breakpoint | Value | Affects |
|---|---|---|
| `--bp-tablet` | 800px | `.about-grid`, `.split` stack to one column |
| `--bp-mobile` | 700px | Nav link sizing, `.project` and `.contact-block` stack/reflow |
| `--bp-small` | 640px | `.titleblock` drops from 4 to 2 columns |

## Component patterns

- **`.sheet`** — a bordered card with animated corner brackets
  (`::before`/`::after`/`.bl`/`.br`) that widen on hover. Used for the
  general "framed content" look; extend by adding `.sheet` + two child
  `<span class="bl"></span><span class="br"></span>` elements.
- **`.reveal`** — fade-up-on-scroll wrapper, toggled by
  `src/scripts/reveal.js` via `IntersectionObserver`. Add this class to
  any block you want to animate in.
- **Section header pattern** — every section opens with
  `<span class="tag">Eyebrow</span><h2>Title</h2><div class="rule"></div>`
  (see `section-header.css`).
- **`[data-tilt]`** — add this attribute to any card to get the 3D
  cursor-tilt effect (currently used on `.project` cards), handled by
  `src/scripts/tilt.js`.
- **Grid-of-cells components** (`.legend-grid`, `.project-grid`,
  `.contact-block`, `.counter-row`) all use the "1px gap + background
  color = hairline divider" trick: the parent has
  `background: var(--grid-line-strong)` and `gap: 1px`, children have
  `background: var(--bg-0)`.

## Visual principles

1. **Everything is a token.** Colors, spacing, fonts, and easing curves
   are declared once in `tokens.css` and referenced everywhere. Avoid
   adding new raw hex/px values in component files — add a token
   instead if the value will repeat.
2. **Hard edges, hairline borders.** No border-radius, no heavy shadows;
   structure comes from 1px borders and background contrast.
3. **Mono for structure, sans for prose.** If it's a label, a number, a
   nav item, or a heading, it's `--font-mono`. If it's a sentence a
   human is meant to read comfortably, it's `--font-sans`.
4. **One accent does the talking.** Cyan carries interactivity and
   emphasis; amber is used sparingly for "kicker" labels and
   highlighted words. Don't introduce a third accent color without
   updating this doc.
5. **Restrained motion.** Animations are short, purposeful, and respect
   reduced-motion preferences — this is a portfolio, not a landing
   page; the content should be the focus.

# J Sai Shreyas — Portfolio

A personal portfolio site with a blueprint / engineering-schematic
visual theme: matte black background, drafting grid, hairline borders,
corner-bracket cards, and an interactive hero styled after an
engineering drawing's title block.

Plain HTML, CSS and JavaScript — no framework. [Vite](https://vitejs.dev)
is used only as a dev server and bundler.

---

## 1. Quick start

**Requirements:** [Node.js](https://nodejs.org) 18+ and npm (comes with
Node). Check with:

```bash
node -v
npm -v
```

**Install and run:**

```bash
npm install
npm run dev
```

This starts a local dev server (Vite will print a URL, typically
`http://localhost:5173`) with hot reload — edit any file and the
browser updates instantly.

**Build for production** (outputs static files to `dist/`):

```bash
npm run build
```

**Preview the production build locally:**

```bash
npm run preview
```

The `dist/` folder after `npm run build` is a fully static site — you
can host it anywhere that serves static files (Vercel, Netlify, GitHub
Pages, Cloudflare Pages, S3, etc.), no server-side code required.

---

## 2. Project structure

```
shreyas-portfolio/
├── index.html                 # Page markup — all sections, in order
├── package.json                # npm scripts + the one dependency (vite)
├── vite.config.js              # Minimal Vite config
├── .gitignore
├── README.md                   # This file
├── DESIGN_SYSTEM.md            # Full design token reference
├── public/
│   └── favicon.svg             # Served as-is at the site root
└── src/
    ├── main.js                 # Entry point: imports styles + boots scripts
    ├── styles/
    │   ├── index.css           # Imports every stylesheet in cascade order
    │   ├── tokens.css          # ★ Design tokens — colors, spacing, fonts, motion
    │   ├── base.css             # Reset + global element defaults
    │   ├── utilities.css        # .wrap, .tag, .sheet, .reveal
    │   ├── components.css       # Preloader, scroll progress, bg canvas, to-top
    │   ├── nav.css
    │   ├── hero.css
    │   ├── section-header.css   # Shared eyebrow/title/rule pattern
    │   ├── about.css
    │   ├── skills.css
    │   ├── projects.css
    │   ├── credentials.css
    │   ├── education.css
    │   ├── contact.css
    │   └── footer.css
    └── scripts/
        ├── index.js             # Imports + runs every script module
        ├── preloader.js         # Loading bar animation
        ├── background-grid.js   # Canvas grid + cursor spotlight position
        ├── scroll-progress.js   # Top progress bar + back-to-top button
        ├── reveal.js             # Scroll-triggered fade-ups
        ├── counters.js           # Animated number counters (About section)
        └── tilt.js                # 3D hover-tilt on project cards
```

There is exactly **one** HTML file (`index.html`) — this is a
single-page site with anchor-link navigation (`#about`, `#projects`,
etc.), not a multi-page routed app. There is no router and no build
step required to add a new page in the traditional sense; a new
"page" would just be a new `<section id="...">` plus a nav link.

---

## 3. How the site is built

**Pages / routing** — Single page, single `index.html`. Navigation is
plain anchor links (`<a href="#projects">`) with `scroll-behavior:
smooth` set globally in `base.css`. There is no client-side router and
no dependency on a routing library.

**Components** — There's no component framework (no React/Vue/etc.),
so "components" are CSS class patterns applied to plain HTML, documented
in `DESIGN_SYSTEM.md` under "Component patterns" (`.sheet`, `.reveal`,
`[data-tilt]`, the section header pattern, and the "1px gap grid"
divider trick used by `.legend-grid`, `.project-grid`, `.contact-block`,
`.counter-row`).

**Sections** — Each section of the page (`about`, `skills`, `projects`,
`credentials`, `education`, `contact`) has its own CSS file in
`src/styles/`, imported by `src/styles/index.css` in the order they
appear on the page. Section markup lives directly in `index.html`
inside `<section id="...">` blocks.

**Animations** — Two kinds:
1. **CSS `@keyframes`** for the one-time hero entrance (`fadeUp`,
   `pulse-line` in `hero.css`) — pure CSS, no JS involved.
2. **JS-driven interactions** in `src/scripts/`, each in its own module
   with a single `init...()` export, all wired up in
   `src/scripts/index.js`. See the comment at the top of each file for
   what it does.

**Styling** — Plain CSS with `@import` (no Sass/PostCSS/Tailwind). All
design values are CSS custom properties defined once in
`src/styles/tokens.css` — see `DESIGN_SYSTEM.md` for the full token
reference. Vite handles bundling the `@import`ed CSS into one file at
build time; nothing extra is needed to add a new stylesheet beyond
creating the file and adding one `@import` line to `styles/index.css`.

**Fonts** — Google Fonts, loaded via `<link>` tags in the `<head>` of
`index.html` (JetBrains Mono + Inter). This is the site's only external
network dependency — see "External services" below.

**Icons** — No icon library. The only icon-like elements are a Unicode
arrow (`↑` in the back-to-top button) and CSS-drawn shapes (corner
brackets, dots, dividers). If you add an icon library later, install it
via npm and import it in `main.js` or the relevant script module.

**Images / assets** — None currently in use; the design uses CSS
(gradients, borders, canvas) rather than images. `public/favicon.svg`
is the one static asset — anything placed in `public/` is copied as-is
to the build output root. Add real images (e.g. project screenshots) to
`public/` or `src/assets/` and reference them with a normal `<img
src="/your-image.png">` tag or, for files inside `src/`, an ES import.

**Responsive behavior** — Mobile-first isn't strictly followed, but
every multi-column layout has a `@media (max-width: ...)` fallback that
stacks to one or two columns. Breakpoints are documented as literals in
`DESIGN_SYSTEM.md` (800px, 700px, 640px) since CSS custom properties
can't be used inside `@media` queries.

**APIs / external services** — None. The site is fully static with no
backend, no analytics, no form submission service, and no client-side
API calls. The only network dependency is the Google Fonts stylesheet
link in `index.html`. To make the site 100% offline-capable, download
the two font families and self-host them (swap the `<link>` tags for a
local `@font-face` stylesheet).

---

## 4. Where to change things

| I want to change... | Edit this file |
|---|---|
| **Colors / theme** | `src/styles/tokens.css` — the color variables at the top |
| **Fonts** | `src/styles/tokens.css` (`--font-mono`, `--font-sans`) + the `<link>` tags in `index.html` if you're swapping Google Fonts families |
| **Spacing / gaps** | `src/styles/tokens.css` — the `--space-*` scale |
| **Typography sizes** | Per-component, in that component's stylesheet (e.g. hero size → `src/styles/hero.css`); see the "Typography" table in `DESIGN_SYSTEM.md` for where each size lives |
| **Animations / motion** | `src/styles/tokens.css` for durations/easing; `src/styles/hero.css` for the `@keyframes`; `src/scripts/*.js` for JS-driven behavior |
| **Layout / grid structure** | The relevant section's CSS file, e.g. `src/styles/projects.css` for the project grid |
| **Buttons** | The back-to-top button styles are in `components.css` (`#to-top`); there's no other generic `<button>` in the current markup — links styled as buttons (like `.contact-cell`) live in their section's stylesheet |
| **Cards** | `.sheet` (bracketed card) → `utilities.css`; `.legend-cell` → `skills.css`; `.project` → `projects.css` |
| **Navbar** | Markup in `index.html` (`<nav>` block); styles in `src/styles/nav.css` |
| **Hero section** | Markup in `index.html` (`<header class="hero wrap">` block); styles + entrance animation in `src/styles/hero.css` |
| **Individual sections** (About, Skills, Projects, Credentials, Education, Contact) | Markup: the matching `<section id="...">` in `index.html`. Styles: the matching file in `src/styles/` |
| **Images** | Add files to `public/` (referenced as `/filename.ext`) or `src/assets/` (referenced via import); update `<img>` tags where relevant |
| **Content / copy** (bio, project descriptions, skills list, contact info) | Directly in `index.html` — there's no separate content/data file at the moment. If you want to extract copy into a data file (e.g. `src/data/content.js`) so an AI tool can edit content and layout independently, that's a reasonable next step — see "Suggested next steps" below |

---

## 5. Design system

See **`DESIGN_SYSTEM.md`** for the full breakdown of colors, typography,
spacing scale, border radius, shadows, animation tokens, breakpoints,
and component patterns. Read this before making visual changes — it's
written to be handed directly to an AI coding tool as style context.

---

## 6. Opening this project in another AI coding environment (e.g. Google Antigravity)

1. Copy or unzip this entire folder into your new environment.
2. Make sure Node.js 18+ is available in that environment.
3. Run `npm install` to fetch the one dependency (Vite).
4. Run `npm run dev` to confirm the site renders identically before
   making changes.
5. Point the AI tool at `DESIGN_SYSTEM.md` and this `README.md` as
   context — between them they describe every token, file, and where
   to make common changes, so the tool can modify the existing
   codebase instead of regenerating it from scratch.
6. Describe your desired change in natural language (e.g. "make the
   accent color a warm amber instead of cyan" or "add a fourth project
   card"). Because colors/spacing/fonts are centralized in
   `tokens.css`, most theme-level requests only require editing that
   one file.

No part of this project depends on Claude, claude.ai, or this
conversation — it's a standard Vite + vanilla JS project that runs the
same way in any Node.js environment.

---

## 7. Suggested next steps (optional, not required to run the site)

These aren't done yet, but would be natural follow-ups if the site
grows:

- **Extract content into a data file** (e.g. `src/data/content.js`)
  and render sections like Projects/Skills/Timeline from arrays, so
  content edits don't require touching markup.
- **Self-host fonts** to remove the Google Fonts network dependency.
- **Add a contact form** with a service like Formspree if you want
  visitors to message you without opening their email client.
- **Add real project screenshots/images** — currently every visual is
  CSS-only.

import { defineConfig } from 'vite';

// Minimal config: this is a plain HTML/CSS/JS site, no framework plugins
// needed. `base: './'` makes the production build use relative asset
// paths, so the contents of dist/ work whether you host it at a domain
// root, a subpath (e.g. GitHub Pages project sites), or open it via
// file:// directly.
export default defineConfig({
  base: './',
});

/**
 * tools/gen-favicons.mjs
 * Renders public/favicon.svg into PNG favicons at multiple sizes.
 * Run once: node tools/gen-favicons.mjs
 * Safe to delete this file afterwards.
 */
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir  = dirname(fileURLToPath(import.meta.url));
const root   = resolve(__dir, '..');
const svgSrc = readFileSync(resolve(root, 'public', 'favicon.svg'), 'utf8');

const targets = [
  { name: 'favicon-32x32.png',   size: 32  },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'apple-touch-icon.png',size: 180 },
];

for (const { name, size } of targets) {
  const resvg = new Resvg(svgSrc, {
    fitTo: { mode: 'width', value: size },
    font:  { loadSystemFonts: false },   // system fonts not needed; SVG uses generic stack
  });
  const png = resvg.render().asPng();
  const dest = resolve(root, 'public', name);
  writeFileSync(dest, png);
  console.log(`✓  ${name}  (${size}×${size}px)  →  ${png.length} bytes`);
}

console.log('\nAll favicons generated.');

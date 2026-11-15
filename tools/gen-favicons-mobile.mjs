import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir  = dirname(fileURLToPath(import.meta.url));
const root   = resolve(__dir, '..');
const svgSrc = readFileSync(resolve(root, 'public', 'favicon.svg'), 'utf8');

const targets = [
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'favicon-16x16.png',          size: 16  },
  { name: 'favicon-32x32.png',          size: 32  },
  { name: 'apple-touch-icon.png',       size: 180 },
];

for (const { name, size } of targets) {
  const resvg = new Resvg(svgSrc, {
    fitTo: { mode: 'width', value: size },
    font:  { loadSystemFonts: false },
  });
  const png = resvg.render().asPng();
  writeFileSync(resolve(root, 'public', name), png);
  console.log(`✓  ${name}  (${size}×${size})  ${png.length} bytes`);
}
console.log('Done.');

// Generates a minimal valid .ico file containing a 16x16 and 32x32 PNG frame.
// Uses only Node built-ins — no extra dependencies.
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = resolve(__dir, '..');

const png16 = readFileSync(resolve(root, 'public', 'favicon-16x16.png'));
const png32 = readFileSync(resolve(root, 'public', 'favicon-32x32.png'));

// ICO header: 2 bytes reserved(0), 2 bytes type(1=icon), 2 bytes count(2)
// Each dir entry: 1 w, 1 h, 1 colorCount, 1 reserved, 2 planes, 2 bitCount, 4 size, 4 offset
const HEADER_SIZE = 6;
const DIR_ENTRY_SIZE = 16;
const dataOffset16 = HEADER_SIZE + DIR_ENTRY_SIZE * 2;
const dataOffset32 = dataOffset16 + png16.length;

const buf = Buffer.alloc(HEADER_SIZE + DIR_ENTRY_SIZE * 2 + png16.length + png32.length);
let pos = 0;

// Header
buf.writeUInt16LE(0, pos);  pos += 2;
buf.writeUInt16LE(1, pos);  pos += 2;
buf.writeUInt16LE(2, pos);  pos += 2;

// Dir entry for 16x16
buf.writeUInt8(16, pos++);
buf.writeUInt8(16, pos++);
buf.writeUInt8(0,  pos++);
buf.writeUInt8(0,  pos++);
buf.writeUInt16LE(1, pos); pos += 2;
buf.writeUInt16LE(32, pos); pos += 2;
buf.writeUInt32LE(png16.length, pos); pos += 4;
buf.writeUInt32LE(dataOffset16, pos); pos += 4;

// Dir entry for 32x32
buf.writeUInt8(32, pos++);
buf.writeUInt8(32, pos++);
buf.writeUInt8(0,  pos++);
buf.writeUInt8(0,  pos++);
buf.writeUInt16LE(1, pos); pos += 2;
buf.writeUInt16LE(32, pos); pos += 2;
buf.writeUInt32LE(png32.length, pos); pos += 4;
buf.writeUInt32LE(dataOffset32, pos); pos += 4;

// PNG data
png16.copy(buf, dataOffset16);
png32.copy(buf, dataOffset32);

const dest = resolve(root, 'public', 'favicon.ico');
writeFileSync(dest, buf);
console.log(`✓  favicon.ico  ${buf.length} bytes`);

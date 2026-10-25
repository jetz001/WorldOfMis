const fs = require('fs');
const path = require('path');

const dir = 'public/entities';
const files = fs.readdirSync(dir);
const invalid = [];

for (const f of files) {
  const filePath = path.join(dir, f);
  const buf = fs.readFileSync(filePath);
  const isJpg = buf[0] === 0xff && buf[1] === 0xd8;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
  const isWebp = buf.slice(8, 12).toString('ascii') === 'WEBP';
  const isGif = buf.slice(0, 3).toString('ascii') === 'GIF';

  if (!isJpg && !isPng && !isWebp && !isGif) {
    console.log(`INVALID FORMAT: ${f} -> magic: ${buf.slice(0, 12).toString('ascii')}`);
    invalid.push(f);
  } else if (buf.length > 3000000) {
    console.log(`OVERSIZED (>3MB): ${f} -> ${(buf.length / 1024 / 1024).toFixed(2)} MB`);
  }
}

console.log(`Total invalid format files: ${invalid.length}`);

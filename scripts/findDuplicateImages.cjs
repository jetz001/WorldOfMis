const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = path.join(__dirname, '..', 'public', 'entities');
const groups = {};
for (const f of fs.readdirSync(dir)) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  const buf = fs.readFileSync(path.join(dir, f));
  const h = crypto.createHash('md5').update(buf).digest('hex');
  (groups[h] = groups[h] || []).push(`${f} (${buf.length}b)`);
}
let dup = 0;
for (const [h, files] of Object.entries(groups)) {
  if (files.length > 1) {
    dup++;
    console.log(`DUP ${h}: ${files.join(', ')}`);
  }
}
console.log(`Total files: ${Object.values(groups).flat().length}, duplicate groups: ${dup}`);

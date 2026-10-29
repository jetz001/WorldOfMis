const fs = require('fs');

let buf = fs.readFileSync('d1_pins.json');
// Check UTF-16 LE BOM (0xFF, 0xFE)
let str;
if (buf[0] === 0xff && buf[1] === 0xfe) {
  str = buf.toString('utf16le');
} else {
  str = buf.toString('utf8').replace(/^\uFEFF/, '');
}

// Extract JSON part
const jsonStart = str.indexOf('[');
const jsonEnd = str.lastIndexOf(']') + 1;
const d1Raw = JSON.parse(str.substring(jsonStart, jsonEnd));
const d1Ids = new Set(d1Raw[0].results.map(r => r.id));
console.log('D1 distinct pins count:', d1Ids.size);

const seedTxt = fs.readFileSync('src/data/seedData.ts', 'utf8');
const idMatches = [];
const regex = /"id":\s*"([^"]+)"/g;
let m;
while ((m = regex.exec(seedTxt)) !== null) {
  idMatches.push(m[1]);
}
console.log('seedData total id matches:', idMatches.length);
const seedIdSet = new Set(idMatches);
console.log('seedData distinct ids:', seedIdSet.size);

const missingInD1 = [...seedIdSet].filter(id => !d1Ids.has(id));
console.log('Distinct IDs in seedData but NOT in D1:', missingInD1.length);
console.log('Sample missing IDs in D1:', missingInD1.slice(0, 15));

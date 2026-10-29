const fs = require('fs');
const seed = fs.readFileSync('src/data/seedData.ts', 'utf8');
const apps = JSON.parse(fs.readFileSync('src/data/pinAppearances.json', 'utf8'));

const pins = seed.split(/\{\s*"id":\s*"/);
console.log('Total pins found:', pins.length - 1);

for (let i = 1; i < pins.length; i++) {
  const chunk = pins[i];
  const idMatch = chunk.match(/^([^"]+)/);
  if (!idMatch) continue;
  const id = idMatch[1];
  if (chunk.includes('27') && (chunk.includes('ซีแอตเทิล') || chunk.includes('Seattle') || chunk.includes('วอชิงตัน') || chunk.includes('คลับ 27'))) {
    const titleMatch = chunk.match(/"title_th":\s*"([^"]+)"/);
    console.log('Found:', id, titleMatch ? titleMatch[1] : '');
    console.log('App in pinAppearances.json:', apps[id]);
  }
}

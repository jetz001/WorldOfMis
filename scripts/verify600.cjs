const fs = require('fs');
const path = require('path');

const seedPath = path.resolve('src/data/seedData.ts');
const content = fs.readFileSync(seedPath, 'utf8');
const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
const arrayStart = content.indexOf('= [', startIdx) + 2;
const endIdx = content.lastIndexOf('];');
const pins = eval(content.slice(arrayStart, endIdx + 1));

console.log('Total pins in seedData.ts:', pins.length);

const ids = new Set();
let dupes = 0;
let missingThumb = 0;
let dummyPathsInNew = 0;
let missingVideo = 0;

pins.forEach((p, i) => {
  if (ids.has(p.id.toLowerCase())) {
    console.error(`Duplicate ID: ${p.id}`);
    dupes++;
  }
  ids.add(p.id.toLowerCase());

  if (!p.image_url || !p.image_url.startsWith('http')) {
    if (i >= 490) dummyPathsInNew++;
  }

  const yt = p.gallery_media?.find(m => m.type === 'youtube');
  if (!yt || !yt.url) {
    missingVideo++;
  }
});

console.log('Duplicates:', dupes);
console.log('Dummy paths in new 110:', dummyPathsInNew);
console.log('Missing videos overall:', missingVideo);

const fs = require('fs');
const path = require('path');

const seedPath = path.resolve('src/data/seedData.ts');
const content = fs.readFileSync(seedPath, 'utf8');

const arrayStart = content.indexOf('= [') + 2;
const arrayEnd = content.lastIndexOf(']');

const pins = JSON.parse(content.slice(arrayStart, arrayEnd + 1));
console.log('Total pins in seedData.ts:', pins.length);

const ids = new Set();
let dupes = 0;
let missingThumb = 0;
let missingVideo = 0;

pins.forEach(p => {
  if (ids.has(p.id.toLowerCase())) {
    console.error(`Duplicate ID: ${p.id}`);
    dupes++;
  }
  ids.add(p.id.toLowerCase());

  if (!p.image_url) missingThumb++;
  const yt = p.gallery_media?.find(m => m.type === 'youtube');
  if (!yt || !yt.url) missingVideo++;
});

console.log('Duplicates in seedData:', dupes);
console.log('Missing Thumbnails:', missingThumb);
console.log('Missing YouTube Videos:', missingVideo);

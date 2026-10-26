const fs = require('fs');
const content = fs.readFileSync('src/data/seedData.ts', 'utf8');
const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
const arrayStart = content.indexOf('= [', startIdx) + 2;
const endIdx = content.lastIndexOf('];');
const pins = eval(content.slice(arrayStart, endIdx + 1));

const targetPins = pins.filter(p => !p.gallery_media || !p.gallery_media.some(m => m.type === 'youtube' || (m.url && m.url.includes('youtube.com'))));
console.log('Target pins needing YouTube and distinct images:', targetPins.length);
targetPins.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.id}] ${p.title_en} | ${p.title_th} | ${p.image_url}`);
});

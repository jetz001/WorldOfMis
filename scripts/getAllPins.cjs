const fs = require('fs');

const raw = fs.readFileSync('src/data/seedData.ts', 'utf8');
const eqIdx = raw.indexOf('= [');
const jsonStart = raw.indexOf('[', eqIdx);
const jsonEnd = raw.lastIndexOf(']');
const jsonStr = raw.slice(jsonStart, jsonEnd + 1);
const pins = JSON.parse(jsonStr);

console.log('Total pins parsed:', pins.length);
fs.writeFileSync('scripts/all_1000_pins.json', JSON.stringify(pins.map(p => ({
  id: p.id,
  title_th: p.title_th,
  title_en: p.title_en,
  category: p.category,
  province_th: p.province_th,
  province_en: p.province_en,
  district_th: p.district_th || '',
  district_en: p.district_en || '',
  story_th: p.story_th,
  story_en: p.story_en,
  folklore_history_th: p.folklore_history_th || '',
  folklore_history_en: p.folklore_history_en || '',
  taboos_th: p.taboos_th || '',
  taboos_en: p.taboos_en || ''
})), null, 2));
console.log('Saved to scripts/all_1000_pins.json');

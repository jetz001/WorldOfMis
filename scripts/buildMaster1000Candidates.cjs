const fs = require('fs');
const path = require('path');

const curse = require('./candidates1000_curse.cjs');
const ghost = require('./candidates1000_ghost.cjs');
const sacred = require('./candidates1000_sacred.cjs');
const legend = require('./candidates1000_legend.cjs');
const monster = require('./candidates1000_monster.cjs');

const existing = require('./existing_900_pins.json');

console.log(`Curse: ${curse.length}`);
console.log(`Ghost: ${ghost.length}`);
console.log(`Sacred: ${sacred.length}`);
console.log(`Legend: ${legend.length}`);
console.log(`Monster: ${monster.length}`);

const allNew = [...curse, ...ghost, ...sacred, ...legend, ...monster];
console.log(`Total new candidates: ${allNew.length}`);

if (allNew.length !== 100) {
  throw new Error(`Expected exactly 100 pins, but got ${allNew.length}`);
}

const existingIds = new Set(existing.map(p => p.id));
const existingEn = new Set(existing.map(p => p.title_en.toLowerCase().trim()));
const existingTh = new Set(existing.map(p => p.title_th.trim()));

const newIds = new Set();
const newEn = new Set();
const newTh = new Set();

for (const p of allNew) {
  // Check required fields
  const required = [
    'id', 'title_th', 'title_en', 'category',
    'province_th', 'province_en', 'district_th', 'district_en',
    'lat', 'lng', 'sound_preset', 'story_th', 'story_en',
    'folklore_history_th', 'folklore_history_en',
    'taboos_th', 'taboos_en', 'yt_query'
  ];
  for (const f of required) {
    if (!p[f] && p[f] !== 0) {
      throw new Error(`Pin ${p.id} missing field ${f}`);
    }
  }

  // Check self dups
  if (newIds.has(p.id)) throw new Error(`Self duplicate ID: ${p.id}`);
  if (newEn.has(p.title_en.toLowerCase().trim())) throw new Error(`Self duplicate title_en: ${p.title_en}`);
  if (newTh.has(p.title_th.trim())) throw new Error(`Self duplicate title_th: ${p.title_th}`);

  newIds.add(p.id);
  newEn.add(p.title_en.toLowerCase().trim());
  newTh.add(p.title_th.trim());

  // Check against existing 900
  if (existingIds.has(p.id)) throw new Error(`Collision with existing ID: ${p.id}`);
  if (existingEn.has(p.title_en.toLowerCase().trim())) throw new Error(`Collision with existing title_en: ${p.title_en}`);
  if (existingTh.has(p.title_th.trim())) throw new Error(`Collision with existing title_th: ${p.title_th}`);
}

fs.writeFileSync(path.join(__dirname, 'master1000NewCandidates.json'), JSON.stringify(allNew, null, 2), 'utf-8');
console.log('Successfully validated and wrote scripts/master1000NewCandidates.json (100 unique pins)!');

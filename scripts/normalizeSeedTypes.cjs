const fs = require('fs');

const validCategories = new Set(['ghost', 'legend', 'curse', 'sacred', 'monster']);
const validPresets = new Set(['whisper', 'water_spirit', 'jungle_curse', 'temple_bell', 'creepy_wind']);

function mapCategory(c) {
  if (validCategories.has(c)) return c;
  if (c === 'urban_legend' || c === 'folklore') return 'legend';
  if (c === 'place') return 'sacred';
  if (c === 'cryptid') return 'monster';
  return 'legend';
}

function mapSound(s) {
  if (validPresets.has(s)) return s;
  if (s === 'wind') return 'creepy_wind';
  if (s === 'growl') return 'jungle_curse';
  return 'whisper';
}

function main() {
  const seedPath = 'src/data/seedData.ts';
  const content = fs.readFileSync(seedPath, 'utf8');

  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('[', startIdx);
  const endIdx = content.lastIndexOf('];');
  const arrayCode = content.slice(arrayStart, endIdx + 1);

  const pins = eval(arrayCode);
  console.log(`Loaded ${pins.length} pins for type normalization.`);

  for (const p of pins) {
    p.category = mapCategory(p.category);
    p.sound_preset = mapSound(p.sound_preset);
    p.is_published = 1;
    if (typeof p.views_count !== 'number') p.views_count = 0;
  }

  const newArrayCode = JSON.stringify(pins, null, 2);
  const updatedFile = content.slice(0, arrayStart) + newArrayCode + ';\n';
  fs.writeFileSync(seedPath, updatedFile, 'utf8');
  console.log('Successfully normalized all pin categories, sound presets, and is_published flags.');

  // Also update insert_batch25.sql with normalized categories
  let sql = '';
  for (let i = 100; i < pins.length; i++) {
    const p = pins[i];
    const esc = (s) => (s || '').replace(/'/g, "''");
    const galleryJson = esc(JSON.stringify(p.gallery_media));
    sql += `INSERT OR REPLACE INTO ghost_pins (id, title_th, title_en, category, province_th, province_en, district_th, district_en, lat, lng, story_th, story_en, folklore_history_th, folklore_history_en, image_url, sound_preset, views_count, gallery_media, is_published, created_at, updated_at) VALUES ('${p.id}', '${esc(p.title_th)}', '${esc(p.title_en)}', '${p.category}', '${esc(p.province_th)}', '${esc(p.province_en)}', '${esc(p.district_th)}', '${esc(p.district_en)}', ${p.lat}, ${p.lng}, '${esc(p.story_th)}', '${esc(p.story_en)}', '${esc(p.folklore_history_th)}', '${esc(p.folklore_history_en)}', '${p.image_url}', '${p.sound_preset}', 0, '${galleryJson}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n`;
  }
  fs.writeFileSync('../insert_batch25.sql', sql, 'utf8');
  console.log('Regenerated ../insert_batch25.sql with normalized values.');
}

main();

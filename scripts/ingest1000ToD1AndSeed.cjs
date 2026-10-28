const fs = require('fs');
const path = require('path');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function normalizeSoundPreset(preset) {
  if (preset === 'temple_bell' || preset === 'chanting') return 'temple_bell';
  if (preset === 'water_spirit') return 'water_spirit';
  if (preset === 'whisper') return 'whisper';
  if (preset === 'creepy_wind' || preset === 'wind') return 'creepy_wind';
  return 'jungle_curse';
}

function build() {
  const candidates = JSON.parse(fs.readFileSync('scripts/master1000NewCandidates.json', 'utf8'));
  const cache = JSON.parse(fs.readFileSync('scripts/enriched1000NewPins.json', 'utf8'));

  const enrichedCount = Object.keys(cache).length;
  console.log(`Enriched cache count: ${enrichedCount}/${candidates.length}`);
  if (enrichedCount < candidates.length) {
    console.error(`Not all pins are enriched yet (${enrichedCount}/${candidates.length}).`);
    process.exit(1);
  }

  const newPins = [];
  const sqlStatements = [];

  for (const c of candidates) {
    const media = cache[c.id];
    if (!media || !media.videoId) {
      console.error(`Missing video for ${c.id}`);
      process.exit(1);
    }

    const pin = {
      id: c.id,
      title_th: c.title_th,
      title_en: c.title_en,
      category: c.category,
      province_th: c.province_th,
      province_en: c.province_en,
      district_th: c.district_th,
      district_en: c.district_en,
      lat: c.lat,
      lng: c.lng,
      sound_preset: normalizeSoundPreset(c.sound_preset),
      story_th: c.story_th,
      story_en: c.story_en,
      folklore_history_th: c.folklore_history_th,
      folklore_history_en: c.folklore_history_en,
      image_url: media.thumbnail,
      views_count: 0,
      is_published: 1,
      gallery_media: [
        {
          type: "image",
          url: media.thumbnail,
          title: c.title_th
        },
        {
          type: "youtube",
          url: media.videoUrl,
          title: media.videoTitle || c.title_th,
          thumbnail: media.thumbnail
        }
      ]
    };

    if (c.taboos_th) pin.taboos_th = c.taboos_th;
    if (c.taboos_en) pin.taboos_en = c.taboos_en;

    newPins.push(pin);

    // Build SQL Insert
    const sql = `INSERT OR REPLACE INTO ghost_pins (
      id, title_th, title_en, category, province_th, province_en, district_th, district_en,
      lat, lng, sound_preset, story_th, story_en, folklore_history_th, folklore_history_en,
      taboos_th, taboos_en, image_url, views_count, is_published, gallery_media
    ) VALUES (
      ${escapeSql(pin.id)},
      ${escapeSql(pin.title_th)},
      ${escapeSql(pin.title_en)},
      ${escapeSql(pin.category)},
      ${escapeSql(pin.province_th)},
      ${escapeSql(pin.province_en)},
      ${escapeSql(pin.district_th)},
      ${escapeSql(pin.district_en)},
      ${pin.lat},
      ${pin.lng},
      ${escapeSql(pin.sound_preset)},
      ${escapeSql(pin.story_th)},
      ${escapeSql(pin.story_en)},
      ${escapeSql(pin.folklore_history_th)},
      ${escapeSql(pin.folklore_history_en)},
      ${escapeSql(pin.taboos_th || null)},
      ${escapeSql(pin.taboos_en || null)},
      ${escapeSql(pin.image_url)},
      0,
      1,
      ${escapeSql(JSON.stringify(pin.gallery_media))}
    );`;

    sqlStatements.push(sql);
  }

  // Save SQL file
  fs.writeFileSync('scripts/insert_1000_new_pins.sql', sqlStatements.join('\n\n'), 'utf8');
  console.log(`Saved scripts/insert_1000_new_pins.sql with ${sqlStatements.length} statements.`);

  // Load existing 900 pins from seedData.ts
  const seedPath = path.resolve('src/data/seedData.ts');
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('= [', startIdx) + 2;
  const endIdx = content.lastIndexOf('];');

  const existingPins = eval(content.slice(arrayStart, endIdx + 1));
  console.log(`Existing baseline pins in seedData: ${existingPins.length}`);

  const combined = [...existingPins, ...newPins];
  console.log(`Combined total pins for seedData: ${combined.length}`);

  if (combined.length !== 1000) {
    console.error(`ERROR: Expected 1000 pins, got ${combined.length}`);
    process.exit(1);
  }

  const fileContent = `import type { GhostPin } from '../types/ghost';\n\nexport const INITIAL_GHOST_PINS: GhostPin[] = ${JSON.stringify(combined, null, 2)};\n`;
  fs.writeFileSync(seedPath, fileContent, 'utf8');
  console.log(`Successfully updated src/data/seedData.ts to exactly 1000 pins!`);
}

build();

const fs = require('fs');
const path = require('path');

function normalizeSoundPreset(preset) {
  if (preset === 'temple_bell' || preset === 'chanting') return 'temple_bell';
  if (preset === 'water_spirit') return 'water_spirit';
  if (preset === 'whisper') return 'whisper';
  if (preset === 'creepy_wind' || preset === 'wind') return 'creepy_wind';
  return 'jungle_curse'; // fallback for growl, drone, creak, etc.
}

function appendEnriched110() {
  const candidates = JSON.parse(fs.readFileSync('scripts/master110Candidates.json', 'utf8'));
  const cache = JSON.parse(fs.readFileSync('scripts/enriched110Master.json', 'utf8'));

  const enrichedPins = [];

  for (const c of candidates) {
    const media = cache[c.id];
    if (!media || !media.videoId) {
      console.error(`Missing video for ${c.id}!`);
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

    enrichedPins.push(pin);
  }

  console.log(`Successfully constructed ${enrichedPins.length} fully enriched pins.`);

  // Load existing seedData.ts - take the first 490 pins
  const seedPath = path.resolve('src/data/seedData.ts');
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('= [', startIdx) + 2;
  const endIdx = content.lastIndexOf('];');

  // Parse existing array
  const allCurrent = eval(content.slice(arrayStart, endIdx + 1));
  const existingPins = allCurrent.slice(0, 490);
  console.log(`Existing baseline pins: ${existingPins.length}`);

  // Combine
  const combined = [...existingPins, ...enrichedPins];
  console.log(`Combined total: ${combined.length}`);

  if (combined.length !== 600) {
    console.error(`ERROR: Expected exactly 600 pins, got ${combined.length}`);
    process.exit(1);
  }

  // Verify unique IDs
  const seen = new Set();
  for (const p of combined) {
    if (seen.has(p.id.toLowerCase())) {
      console.error(`ERROR: Duplicate ID found: ${p.id}`);
      process.exit(1);
    }
    seen.add(p.id.toLowerCase());
    p.sound_preset = normalizeSoundPreset(p.sound_preset);
  }

  const updatedFileContent = `import type { GhostPin } from '../types/ghost';\n\nexport const INITIAL_GHOST_PINS: GhostPin[] = ${JSON.stringify(combined, null, 2)};\n`;
  fs.writeFileSync(seedPath, updatedFileContent, 'utf8');
  console.log(`Successfully written 600 pins to ${seedPath}!`);
}

if (require.main === module) {
  appendEnriched110();
}

module.exports = { appendEnriched110 };

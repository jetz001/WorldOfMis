const fs = require('fs');
const path = require('path');

const candidates = JSON.parse(fs.readFileSync('scripts/master100NewCandidates.json', 'utf8'));
const cache = JSON.parse(fs.readFileSync('scripts/enriched100NewPins.json', 'utf8'));

// First 600 pins from current_600_pins.json
const current600 = JSON.parse(fs.readFileSync('scripts/current_600_pins.json', 'utf8'));
console.log('Loaded current 600 baseline pins:', current600.length);

function normalizeSoundPreset(preset) {
  if (preset === 'temple_bell' || preset === 'chanting') return 'temple_bell';
  if (preset === 'water_spirit') return 'water_spirit';
  if (preset === 'whisper') return 'whisper';
  if (preset === 'creepy_wind' || preset === 'wind') return 'creepy_wind';
  return 'jungle_curse';
}

const new100Pins = [];
for (const c of candidates) {
  const media = cache[c.id];
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
  new100Pins.push(pin);
}

// Map current600 to ensure standard fields
const cleaned600 = current600.map(p => {
  const clone = { ...p };
  if (typeof clone.gallery_media === 'string') {
    try { clone.gallery_media = JSON.parse(clone.gallery_media); } catch (e) {}
  }
  return clone;
});

const all700 = [...cleaned600, ...new100Pins];
console.log('Total combined pins:', all700.length);

const seedPath = path.resolve('src/data/seedData.ts');
const fileContent = `import type { GhostPin } from '../types/ghost';\n\nexport const INITIAL_GHOST_PINS: GhostPin[] = ${JSON.stringify(all700, null, 2)};\n`;

fs.writeFileSync(seedPath, fileContent, 'utf8');
console.log('Successfully wrote src/data/seedData.ts with clean array syntax and exactly 700 pins.');

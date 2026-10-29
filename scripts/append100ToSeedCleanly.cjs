const fs = require('fs');
const path = require('path');

const candidates = JSON.parse(fs.readFileSync('scripts/master100NewCandidates.json', 'utf8'));
const cache = JSON.parse(fs.readFileSync('scripts/enriched100NewPins.json', 'utf8'));

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

const seedPath = path.resolve('src/data/seedData.ts');
const content = fs.readFileSync(seedPath, 'utf8');

const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
const arrayStart = content.indexOf('= [', startIdx) + 2;
const endIdx = content.lastIndexOf('];');

// Parse the existing 600 pins
const existingPins = eval(content.slice(arrayStart, endIdx + 1));
console.log('Existing baseline pins:', existingPins.length);

const combined = [...existingPins, ...new100Pins];
console.log('Combined total pins:', combined.length);

if (combined.length !== 700) {
  console.error(`Expected 700, got ${combined.length}`);
  process.exit(1);
}

// Write back with perfect formatting
const header = content.slice(0, startIdx);
const newArrayJs = JSON.stringify(combined, null, 2);
const newContent = `${header}export const INITIAL_GHOST_PINS: GhostPin[] = ${newArrayJs};\n`;

fs.writeFileSync(seedPath, newContent, 'utf8');
console.log('Successfully wrote exactly 700 pins to src/data/seedData.ts!');

const fs = require('fs');
const path = require('path');

const seedPath = path.resolve('src/data/seedData.ts');
let content = fs.readFileSync(seedPath, 'utf8');

const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
const arrayStart = content.indexOf('= [', startIdx) + 2;
const endIdx = content.lastIndexOf('];');
const pins = eval(content.slice(arrayStart, endIdx + 1));

const VALID_CATEGORIES = new Set(['ghost', 'legend', 'curse', 'sacred', 'monster']);
const VALID_SOUNDS = new Set(['whisper', 'water_spirit', 'jungle_curse', 'temple_bell', 'creepy_wind']);

function mapCategory(cat) {
  if (VALID_CATEGORIES.has(cat)) return cat;
  if (cat === 'cryptozoology') return 'monster';
  if (cat === 'demonic') return 'curse';
  if (cat === 'folklore') return 'legend';
  if (cat === 'sacred_item') return 'sacred';
  if (cat === 'haunted_place') return 'ghost';
  return 'legend';
}

function mapSound(snd) {
  if (VALID_SOUNDS.has(snd)) return snd;
  if (snd === 'demon_growl') return 'jungle_curse';
  if (snd === 'wind_howl' || snd === 'drone_dark' || snd === 'screaming_wind') return 'creepy_wind';
  if (snd === 'whispering_ghosts' || snd === 'ambient_creepy' || snd === 'heartbeat_slow') return 'whisper';
  if (snd === 'church_bell' || snd === 'bell_toll' || snd === 'chanting') return 'temple_bell';
  if (snd === 'ocean_waves' || snd === 'water_drips') return 'water_spirit';
  return 'creepy_wind';
}

const cleaned = pins.map(p => {
  const c = { ...p };
  c.category = mapCategory(c.category);
  c.sound_preset = mapSound(c.sound_preset);

  if (Array.isArray(c.gallery_media)) {
    c.gallery_media = c.gallery_media.map(m => {
      const item = {
        type: m.type || 'image',
        url: m.url
      };
      if (m.id) item.id = m.id;
      if (m.title) item.title = m.title;
      else if (m.title_th) item.title = m.title_th;
      else if (m.title_en) item.title = m.title_en;
      if (m.thumbnail) item.thumbnail = m.thumbnail;
      return item;
    });
  }

  return c;
});

const updatedFile = content.slice(0, arrayStart) + JSON.stringify(cleaned, null, 2) + ';\n';
fs.writeFileSync(seedPath, updatedFile, 'utf8');
console.log(`Successfully sanitized ${cleaned.length} pins in src/data/seedData.ts!`);

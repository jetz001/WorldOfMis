const fs = require('fs');

const SPECIFIC_VIDEOS = {
  'pin-anubis': { url: 'https://www.youtube.com/watch?v=vPpz1uolBT8', title: 'Anubis: More than The Guardian of the Dead' },
  'pin-sirens': { url: 'https://www.youtube.com/watch?v=AjHC8fSILlU', title: 'The Messed Up Origins of Sirens' },
  'pin-brayroad': { url: 'https://www.youtube.com/watch?v=cbbuJdVtBtI', title: 'The Bray Road Beast' },
  'pin-maryking': { url: 'https://www.youtube.com/watch?v=P49eepvZFp4', title: "The Ghosts of Mary King's Close" },
  'pin-koschei': { url: 'https://www.youtube.com/watch?v=gohOYQBC9ik', title: 'Koschei the Deathless: The Sorcerer Who Hid His Death in an Egg' },
  'pin-taoshum': { url: 'https://www.youtube.com/watch?v=eyIuD3yD3No', title: 'The Taos Hum Unexplained Frequency' },
  'pin-pegasus': { url: 'https://www.youtube.com/watch?v=BDprlH1sK_Y', title: 'The myth of Pegasus and the chimera - TED-Ed' },
  'pin-kitsune': { url: 'https://www.youtube.com/watch?v=0arkgpNDuJg', title: 'The Trickster Fox Spirit of Japanese Mythology - Kitsune' },
  'pin-poveglia': { url: 'https://www.youtube.com/watch?v=pAc59cSLui0', title: 'Poveglia: The Most Haunted Island on Earth' },
  'pin-phiam': { url: 'https://www.youtube.com/watch?v=G14BXgXY1Gc', title: 'เปิดตำนานผีอำนานาชาติ ผีอำคืออะไร | Point of View' }
};

async function main() {
  const seedPath = 'src/data/seedData.ts';
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('[', startIdx);
  const endIdx = content.lastIndexOf('];');
  const pins = eval(content.slice(arrayStart, endIdx + 1));
  console.log(`Loaded ${pins.length} pins.`);

  for (const id of Object.keys(SPECIFIC_VIDEOS)) {
    const pin = pins.find(p => p.id === id);
    if (pin) {
      const data = SPECIFIC_VIDEOS[id];
      const idx = pin.gallery_media.findIndex(m => m.type === 'youtube');
      if (idx >= 0) {
        pin.gallery_media[idx].url = data.url;
        pin.gallery_media[idx].title = data.title;
      } else {
        pin.gallery_media.push({
          type: 'youtube',
          url: data.url,
          title: data.title,
          thumbnail: pin.image_url
        });
      }
      console.log(`Updated ${id} -> ${data.url} (${data.title})`);
    }
  }

  // Update seedData.ts
  const newArrayCode = JSON.stringify(pins, null, 2);
  const updatedFile = content.slice(0, arrayStart) + newArrayCode + ';\n';
  fs.writeFileSync(seedPath, updatedFile, 'utf8');
  console.log('Successfully updated seedData.ts with all dedicated videos!');

  // Regenerate insert_batch150.sql
  let sql = '';
  for (let i = 125; i < pins.length; i++) {
    const p = pins[i];
    const esc = (s) => (s || '').replace(/'/g, "''");
    const galleryJson = esc(JSON.stringify(p.gallery_media));
    sql += `INSERT OR REPLACE INTO ghost_pins (id, title_th, title_en, category, province_th, province_en, district_th, district_en, lat, lng, story_th, story_en, folklore_history_th, folklore_history_en, image_url, sound_preset, views_count, gallery_media, is_published, created_at, updated_at) VALUES ('${p.id}', '${esc(p.title_th)}', '${esc(p.title_en)}', '${p.category}', '${esc(p.province_th)}', '${esc(p.province_en)}', '${esc(p.district_th)}', '${esc(p.district_en)}', ${p.lat}, ${p.lng}, '${esc(p.story_th)}', '${esc(p.story_en)}', '${esc(p.folklore_history_th)}', '${esc(p.folklore_history_en)}', '${p.image_url}', '${p.sound_preset}', 0, '${galleryJson}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n`;
  }
  fs.writeFileSync('../insert_batch150.sql', sql, 'utf8');
  console.log('Regenerated insert_batch150.sql with 25 statements.');
}

main().catch(console.error);

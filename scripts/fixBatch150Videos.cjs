const fs = require('fs');
const https = require('https');

function searchYouTube(query) {
  return new Promise((resolve) => {
    const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        const matches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
        resolve([...new Set(matches)]);
      });
    }).on('error', () => resolve([]));
  });
}

function verifyEmbeddable(videoId) {
  return new Promise((resolve) => {
    const oembedUrl = 'https://www.youtube.com/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + videoId) + '&format=json';
    https.get(oembedUrl, (res) => {
      if (res.statusCode === 200) {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          try {
            const j = JSON.parse(d);
            resolve({ videoId, title: j.title, embeddable: true });
          } catch(e) { resolve({ videoId, embeddable: false }); }
        });
      } else {
        resolve({ videoId, embeddable: false });
      }
    }).on('error', () => resolve({ videoId, embeddable: false }));
  });
}

const QUERIES = {
  'pin-champ': 'Lake Champlain monster Champ',
  'pin-oakisland': 'Oak Island money pit mystery',
  'pin-klerksdorp': 'Klerksdorp spheres mystery',
  'pin-antikythera': 'Antikythera mechanism documentary',
  'pin-bloop': 'The Bloop mystery sound',
  'pin-gilgamesh': 'Epic of Gilgamesh documentary',
  'pin-khamchanod': 'คำชะโนด ผีจ้างหนัง',
  'pin-dogon': 'Dogon Sirius mystery',
  'pin-rendlesham': 'Rendlesham Forest incident UFO',
  'pin-colossus': 'Colossus of Rhodes wonder',
  'pin-anubis': 'Anubis god of the dead',
  'pin-sirens': 'Sirens Greek mythology',
  'pin-brayroad': 'Beast of Bray Road werewolf',
  'pin-maryking': 'Mary King Close Edinburgh',
  'pin-koschei': 'Koschei the Deathless',
  'pin-taoshum': 'The Taos Hum mystery',
  'pin-pegasus': 'Pegasus Greek myth',
  'pin-kitsune': 'Nine tailed fox Kitsune',
  'pin-poveglia': 'Poveglia Island most haunted',
  'pin-phiam': 'ผีอำ สารคดี เรื่องเล่า'
};

async function main() {
  const seedPath = 'src/data/seedData.ts';
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('[', startIdx);
  const endIdx = content.lastIndexOf('];');
  const pins = eval(content.slice(arrayStart, endIdx + 1));
  console.log(`Loaded ${pins.length} pins.`);

  for (const id of Object.keys(QUERIES)) {
    const q = QUERIES[id];
    console.log(`Searching video for ${id} ("${q}")...`);
    const vids = await searchYouTube(q);
    let found = null;
    for (const vid of vids.slice(0, 20)) {
      if (vid === 'AmbyfczXkjU' || vid === '0Xl7oRy9bEo') continue;
      const check = await verifyEmbeddable(vid);
      if (check.embeddable) {
        found = { url: 'https://www.youtube.com/watch?v=' + vid, title: check.title };
        break;
      }
    }
    if (found) {
      console.log(` -> Found: ${found.url} ("${found.title}")`);
      const pin = pins.find(p => p.id === id);
      if (pin) {
        const idx = pin.gallery_media.findIndex(m => m.type === 'youtube');
        if (idx >= 0) {
          pin.gallery_media[idx].url = found.url;
          pin.gallery_media[idx].title = found.title;
        }
      }
    } else {
      console.warn(` !! COULD NOT FIND FOR ${id}`);
    }
  }

  // Update seedData.ts
  const newArrayCode = JSON.stringify(pins, null, 2);
  const updatedFile = content.slice(0, arrayStart) + newArrayCode + ';\n';
  fs.writeFileSync(seedPath, updatedFile, 'utf8');
  console.log('Updated seedData.ts');

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

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
        const unique = [...new Set(matches)];
        resolve(unique);
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

const SEARCH_TARGETS = {
  'pin-alexandria': ['Library of Alexandria mystery', 'Pharos lighthouse Alexandria documentary', 'Library of Alexandria'],
  'pin-gobeklitepe': ['Gobekli Tepe documentary', 'Göbekli Tepe National Geographic', 'Gobekli Tepe mystery'],
  'pin-dbcooper': ['DB Cooper mystery', 'D.B. Cooper documentary', 'Who was DB Cooper'],
  'pin-yowie': ['Australian Yowie documentary', 'Yowie sightings Australia', 'Yowie cryptid'],
  'pin-kumanthong': ['กุมารทอง ประวัติ ตำนาน', 'Kuman Thong documentary', 'เรื่องเล่า กุมารทอง'],
  'pin-popobawa': ['Popobawa demon', 'Popobawa Zanzibar', 'African cryptid Popobawa'],
  'pin-qilin': ['Qilin Chinese mythology', 'Kirin mythical creature', 'Qilin beast'],
  'pin-garuda': ['Garuda mythology', 'Garuda Hindu god', 'ตำนาน พญาครุฑ'],
  'pin-ouija': ['Ouija board history', 'History of the Ouija Board', 'Ouija board documentary'],
  'pin-phoenix': ['Phoenix mythical bird', 'Myth of the Phoenix', 'Bennu bird ancient Egypt']
};

async function main() {
  const seedPath = 'src/data/seedData.ts';
  const content = fs.readFileSync(seedPath, 'utf8');

  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('[', startIdx);
  const endIdx = content.lastIndexOf('];');
  const arrayCode = content.slice(arrayStart, endIdx + 1);

  const pins = eval(arrayCode);
  console.log(`Loaded ${pins.length} pins.`);

  for (const pinId of Object.keys(SEARCH_TARGETS)) {
    const pin = pins.find(p => p.id === pinId);
    if (!pin) continue;
    console.log(`Searching for ${pinId}...`);
    let found = null;
    for (const q of SEARCH_TARGETS[pinId]) {
      const vids = await searchYouTube(q);
      for (const vid of vids.slice(0, 15)) {
        if (vid === '0Xl7oRy9bEo') continue;
        const check = await verifyEmbeddable(vid);
        if (check.embeddable) {
          found = { url: 'https://www.youtube.com/watch?v=' + check.videoId, title: check.title };
          break;
        }
      }
      if (found) break;
    }

    if (found) {
      console.log(` -> [${pinId}] Found: ${found.url} ("${found.title}")`);
      const idx = pin.gallery_media.findIndex(m => m.type === 'youtube');
      if (idx >= 0) {
        pin.gallery_media[idx].url = found.url;
        pin.gallery_media[idx].title = found.title;
      } else {
        pin.gallery_media.push({
          type: 'youtube',
          url: found.url,
          title: found.title,
          thumbnail: pin.image_url
        });
      }
    } else {
      console.warn(` !! COULD NOT FIND FOR ${pinId}`);
    }
  }

  // Update seedData.ts
  const newArrayCode = JSON.stringify(pins, null, 2);
  const updatedFile = content.slice(0, arrayStart) + newArrayCode + ';\n';
  fs.writeFileSync(seedPath, updatedFile, 'utf8');
  console.log('Updated seedData.ts successfully.');

  // Regenerate insert_batch25.sql for pins 101-125
  let sql = '';
  for (let i = 100; i < pins.length; i++) {
    const p = pins[i];
    const esc = (s) => (s || '').replace(/'/g, "''");
    const galleryJson = esc(JSON.stringify(p.gallery_media));
    sql += `INSERT OR REPLACE INTO ghost_pins (id, title_th, title_en, category, province_th, province_en, district_th, district_en, lat, lng, story_th, story_en, folklore_history_th, folklore_history_en, image_url, sound_preset, views_count, gallery_media, created_at, updated_at) VALUES ('${p.id}', '${esc(p.title_th)}', '${esc(p.title_en)}', '${p.category}', '${esc(p.province_th)}', '${esc(p.province_en)}', '${esc(p.district_th)}', '${esc(p.district_en)}', ${p.lat}, ${p.lng}, '${esc(p.story_th)}', '${esc(p.story_en)}', '${esc(p.folklore_history_th)}', '${esc(p.folklore_history_en)}', '${p.image_url}', '${p.sound_preset}', 0, '${galleryJson}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n`;
  }
  fs.writeFileSync('../insert_batch25.sql', sql, 'utf8');
  console.log('Regenerated insert_batch25.sql.');
}

main().catch(console.error);

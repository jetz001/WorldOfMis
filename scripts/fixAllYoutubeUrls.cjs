const fs = require('fs');
const path = require('path');
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

async function findWorkingVideoForPin(pin) {
  const queries = [
    pin.title_en + ' documentary',
    pin.title_th + ' สารคดี',
    pin.title_en + ' mystery lore',
    pin.id.replace('pin-', '') + ' documentary'
  ];

  for (const q of queries) {
    const vids = await searchYouTube(q);
    for (const vid of vids.slice(0, 6)) {
      const check = await verifyEmbeddable(vid);
      if (check.embeddable) {
        return {
          url: 'https://www.youtube.com/watch?v=' + check.videoId,
          title: check.title
        };
      }
    }
  }
  return null;
}

(async () => {
  const seedPath = path.resolve(__dirname, '../src/data/seedData.ts');
  const seedContent = fs.readFileSync(seedPath, 'utf8');

  // Parse INITIAL_GHOST_PINS from seedData.ts safely
  const match = seedContent.match(/export const INITIAL_GHOST_PINS: GhostPin\[\] = (\[[\s\S]*?\]);\s*$/);
  if (!match) {
    console.error('Could not match INITIAL_GHOST_PINS array');
    process.exit(1);
  }

  // Evaluate the array
  const rawJs = match[1];
  let pins;
  try {
    pins = eval('(' + rawJs + ')');
  } catch (err) {
    console.error('Failed to eval pins array:', err);
    process.exit(1);
  }

  console.log(`Auditing ${pins.length} pins for YouTube embeddability...`);

  let fixedCount = 0;
  let keptCount = 0;
  const updates = [];

  for (let i = 0; i < pins.length; i++) {
    const pin = pins[i];
    const ytMedia = (pin.gallery_media || []).find(m => m.type === 'youtube');
    let needsFix = false;

    if (!ytMedia || !ytMedia.url) {
      needsFix = true;
    } else {
      const matchId = ytMedia.url.match(/v=([a-zA-Z0-9_-]{11})/);
      if (!matchId) {
        needsFix = true;
      } else {
        const check = await verifyEmbeddable(matchId[1]);
        if (!check.embeddable) {
          needsFix = true;
        } else {
          keptCount++;
        }
      }
    }

    if (needsFix) {
      console.log(`[${i+1}/${pins.length}] Fixing ${pin.id} (${pin.title_en})...`);
      const working = await findWorkingVideoForPin(pin);
      if (working) {
        console.log(` -> Found: ${working.url} ("${working.title}")`);
        if (!pin.gallery_media) pin.gallery_media = [];
        const existingYt = pin.gallery_media.find(m => m.type === 'youtube');
        if (existingYt) {
          existingYt.url = working.url;
          existingYt.title = working.title;
        } else {
          pin.gallery_media.push({
            type: 'youtube',
            url: working.url,
            title: working.title,
            thumbnail: pin.image_url
          });
        }
        fixedCount++;
        updates.push({ id: pin.id, gallery_media: pin.gallery_media });
      } else {
        console.warn(` -> WARNING: Could not find working video for ${pin.id}`);
      }
    }
  }

  console.log(`Audit complete: ${keptCount} kept valid, ${fixedCount} fixed with verified working videos.`);

  // Re-serialize pins to seedData.ts
  const newPinsJs = 'export const INITIAL_GHOST_PINS: GhostPin[] = ' + JSON.stringify(pins, null, 2).replace(/"([a-zA-Z0-9_]+)":/g, '$1:') + ';\n';
  const prefix = seedContent.substring(0, seedContent.indexOf('export const INITIAL_GHOST_PINS:'));
  fs.writeFileSync(seedPath, prefix + newPinsJs, 'utf8');
  console.log('Updated seedData.ts successfully');

  // Generate SQL update script for Cloudflare D1
  let sql = '';
  for (const up of updates) {
    const escapeSql = (str) => (str ? str.replace(/'/g, "''") : '');
    const jsonStr = escapeSql(JSON.stringify(up.gallery_media));
    sql += `UPDATE ghost_pins SET gallery_media = '${jsonStr}' WHERE id = '${up.id}';\n`;
  }
  const sqlPath = path.resolve(__dirname, '../../fix_youtube.sql');
  fs.writeFileSync(sqlPath, sql, 'utf8');
  console.log(`Generated ${sqlPath} with ${updates.length} statements.`);
})();

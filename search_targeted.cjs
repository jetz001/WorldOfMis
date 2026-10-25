const https = require('https');

function checkOembed(url) {
  return new Promise((resolve) => {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const req = https.get(oembedUrl, (res) => resolve(res.statusCode === 200));
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => { req.destroy(); resolve(false); });
  });
}

function searchYouTube(query) {
  const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'th,en-US;q=0.9,en;q=0.8'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        try {
          const match = html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/);
          if (!match) return resolve([]);
          const data = JSON.parse(match[1]);
          const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
          const results = [];
          for (const item of contents) {
            const v = item.videoRenderer;
            if (v && v.videoId) {
              results.push({
                videoId: v.videoId,
                title: v.title?.runs?.[0]?.text || '',
                channel: v.ownerText?.runs?.[0]?.text || '',
                views: v.shortViewCountText?.simpleText || ''
              });
            }
          }
          resolve(results.slice(0, 6));
        } catch(e) {
          resolve([]);
        }
      });
    });
    req.on('error', () => resolve([]));
    req.setTimeout(6000, () => { req.destroy(); resolve([]); });
  });
}

async function inspect(pinId, queries) {
  console.log(`\n=== Finding for [${pinId}] ===`);
  for (const q of queries) {
    const results = await searchYouTube(q);
    for (const r of results) {
      const url = `https://www.youtube.com/watch?v=${r.videoId}`;
      const ok = await checkOembed(url);
      if (ok) {
        console.log(`  ✓ [${r.videoId}] ${r.title} | ${r.channel} (query: "${q}")`);
        return { videoId: r.videoId, url, title: r.title, channel: r.channel };
      }
    }
  }
  return null;
}

async function run() {
  const fixes = {};
  
  // 1. Lorelei
  fixes['pin-lorelei'] = await inspect('pin-lorelei', [
    'ไซเรน Point of View',
    'ตำนาน ไซเรน ลอเรไล',
    'The Lorelei Siren Storied Monstrum'
  ]);

  // 2. Mahasona
  fixes['pin-mahasona'] = await inspect('pin-mahasona', [
    'Mahasona demon Sri Lanka folklore',
    'Maha Sona devil Sri Lanka legend',
    'Mahasona folklore'
  ]);

  // 3. Pishtaco
  fixes['pin-pishtaco'] = await inspect('pin-pishtaco', [
    'Pishtaco monster Andes Storied Monstrum',
    'Pishtaco legend vampire fat',
    'Pishtaco Peruvian folklore'
  ]);

  // 4. Patasola
  fixes['pin-patasola'] = await inspect('pin-patasola', [
    'La Patasola legend Colombia Storied Monstrum',
    'La Patasola folklore jungle',
    'La Patasola myth'
  ]);

  // 5. Mosina
  fixes['pin-mosina'] = await inspect('pin-mosina', [
    'Mo sin a Taiwan folklore spirit',
    'The Tag-Along Mosina Taiwan ghost',
    'โมซินอา ปีศาจภูเขาไต้หวัน'
  ]);

  // 6. Nightmarchers
  fixes['pin-nightmarchers'] = await inspect('pin-nightmarchers', [
    'Nightmarchers Hawaii legend Storied Monstrum',
    'Night Marchers Hawaii ghost folklore',
    'Huakai po Hawaii'
  ]);

  console.log('\nSummary of fixes:', JSON.stringify(fixes, null, 2));
}

run();

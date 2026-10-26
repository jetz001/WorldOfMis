const fs = require('fs');
const path = require('path');
const https = require('https');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': 'CONSENT=YES+cb.20210328-17-p0.en+FX+410'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => resolve(html));
    }).on('error', () => resolve(''));
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
          } catch (e) { resolve({ videoId, embeddable: false }); }
        });
      } else {
        resolve({ videoId, embeddable: false });
      }
    }).on('error', () => resolve({ videoId, embeddable: false }));
  });
}

function extractVideoRenderers(obj, results = []) {
  if (!obj || typeof obj !== 'object') return results;
  if (obj.videoRenderer && obj.videoRenderer.videoId) {
    results.push({
      videoId: obj.videoRenderer.videoId,
      title: obj.videoRenderer.title?.runs?.[0]?.text || ''
    });
  }
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      extractVideoRenderers(obj[key], results);
    }
  }
  return results;
}

async function searchYouTubeVideo(query) {
  try {
    const html = await fetchHtml('https://www.youtube.com/results?search_query=' + encodeURIComponent(query));
    let candidateIds = [];

    const match = html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        candidateIds = extractVideoRenderers(data);
      } catch (e) {}
    }

    if (candidateIds.length === 0) {
      const rawMatches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
      candidateIds = [...new Set(rawMatches)].map(id => ({ videoId: id, title: '' }));
    }

    for (const cand of candidateIds.slice(0, 6)) {
      const ver = await verifyEmbeddable(cand.videoId);
      if (ver.embeddable) {
        return {
          videoId: cand.videoId,
          title: ver.title || cand.title,
          url: `https://www.youtube.com/watch?v=${cand.videoId}`,
          thumbnail: `https://i.ytimg.com/vi/${cand.videoId}/hqdefault.jpg`
        };
      }
    }
  } catch (err) {
    console.error(`Search error for ${query}:`, err.message);
  }
  return null;
}

async function run() {
  const seedPath = path.resolve('src/data/seedData.ts');
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('= [', startIdx) + 2;
  const endIdx = content.lastIndexOf('];');
  const pins = eval(content.slice(arrayStart, endIdx + 1));

  // The 95 new pins are from index 305 to 399
  const newPins = pins.slice(305);
  console.log(`Processing ${newPins.length} new pins...`);

  const cacheFile = path.resolve('scripts/enriched95.json');
  let cache = {};
  if (fs.existsSync(cacheFile)) {
    try {
      cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    } catch (e) {}
  }

  for (let i = 0; i < newPins.length; i++) {
    const p = newPins[i];
    const pid = p.id;

    if (cache[pid] && cache[pid].videoId) {
      continue;
    }

    const cleanEn = p.title_en.replace(/\([^)]*\)/g, '').replace(/^The\s+/i, '').trim();
    const shortTitle = cleanEn.split(' of ')[0].split(' in ')[0].trim();

    // Query with most specific yet concise terms first
    let queries = [
      `${shortTitle} cryptid documentary`,
      `${shortTitle} folklore legend`,
      `${cleanEn}`,
      `${p.title_th.split('(')[0].trim()} ตำนาน`
    ];

    let result = null;
    for (const q of queries) {
      result = await searchYouTubeVideo(q);
      if (result) break;
      await sleep(800);
    }

    if (result) {
      cache[pid] = result;
      console.log(`[${i + 1}/${newPins.length}] OK: ${cleanEn} -> "${result.title}" (${result.videoId})`);
    } else {
      console.warn(`[${i + 1}/${newPins.length}] NOT FOUND: ${cleanEn}`);
    }

    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
    await sleep(1200); // 1.2s delay between pins to ensure zero 429 throttling
  }

  console.log('Finished enriching. Cached count:', Object.keys(cache).length);

  // Now apply to seedData.ts!
  console.log('Applying enriched data to all 95 pins in seedData.ts...');
  let updatedCount = 0;
  for (let i = 305; i < pins.length; i++) {
    const p = pins[i];
    const data = cache[p.id];
    if (data && data.videoId) {
      p.image_url = data.thumbnail;
      p.gallery_media = [
        {
          type: 'image',
          url: data.thumbnail,
          title: p.title_th
        },
        {
          type: 'youtube',
          url: data.url,
          title: data.title,
          thumbnail: data.thumbnail
        }
      ];
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount}/${newPins.length} pins with verified thumbnails & YouTube embeds!`);

  const filePrefix = content.slice(0, arrayStart);
  const fileSuffix = content.slice(endIdx + 1);
  const newContent = filePrefix + JSON.stringify(pins, null, 2) + fileSuffix;
  fs.writeFileSync(seedPath, newContent, 'utf8');
  console.log('Successfully saved to src/data/seedData.ts');
}

run().catch(console.error);

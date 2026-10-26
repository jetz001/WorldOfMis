const fs = require('fs');
const path = require('path');
const https = require('https');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          Cookie: 'CONSENT=YES+cb.20210328-17-p0.en+FX+410',
        },
      },
      (res) => {
        let html = '';
        res.on('data', (chunk) => (html += chunk));
        res.on('end', () => resolve(html));
      }
    ).on('error', () => resolve(''));
  });
}

function verifyEmbeddable(videoId) {
  return new Promise((resolve) => {
    const oembedUrl =
      'https://www.youtube.com/oembed?url=' +
      encodeURIComponent('https://www.youtube.com/watch?v=' + videoId) +
      '&format=json';
    https.get(oembedUrl, (res) => {
      if (res.statusCode === 200) {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => {
          try {
            const j = JSON.parse(d);
            resolve({ videoId, title: j.title, embeddable: true });
          } catch (e) {
            resolve({ videoId, embeddable: false });
          }
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
      title: obj.videoRenderer.title?.runs?.[0]?.text || '',
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
      const rawMatches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map((m) => m[1]);
      candidateIds = [...new Set(rawMatches)].map((id) => ({ videoId: id, title: '' }));
    }

    for (const cand of candidateIds.slice(0, 5)) {
      const ver = await verifyEmbeddable(cand.videoId);
      if (ver.embeddable) {
        return {
          videoId: cand.videoId,
          title: ver.title || cand.title,
          url: `https://www.youtube.com/watch?v=${cand.videoId}`,
          thumbnail: `https://i.ytimg.com/vi/${cand.videoId}/hqdefault.jpg`,
        };
      }
    }
  } catch (err) {
    console.error(`Search error for ${query}:`, err.message);
  }
  return null;
}

async function main() {
  const seedPath = path.resolve('src/data/seedData.ts');
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('= [', startIdx) + 2;
  const endIdx = content.lastIndexOf('];');
  const pins = eval(content.slice(arrayStart, endIdx + 1));

  console.log('Current pins in seedData:', pins.length);

  // 1. Fix the 5 damaged pins in existing dataset
  const fixedVideos = {
    'pin-chiang-dao': {
      videoId: '0oISW4lXrzA',
      title: 'อาจารย์ยอด : อาถรรพ์ถ้ำเชียงดาว [ลึกลับ]',
      url: 'https://www.youtube.com/watch?v=0oISW4lXrzA',
      thumbnail: 'https://i.ytimg.com/vi/0oISW4lXrzA/hqdefault.jpg',
    },
    'pin-pret-suthat': {
      videoId: 'LwEAV7IdSUY',
      title: 'แร้งวัดสระเกศ เปรตวัดสุทัศน์ มีจริงไหม? ตำนานสยอง 200 ปี คู่กรุงเทพ',
      url: 'https://www.youtube.com/watch?v=LwEAV7IdSUY',
      thumbnail: 'https://i.ytimg.com/vi/LwEAV7IdSUY/hqdefault.jpg',
    },
    'pin-krahang-u-thong': {
      videoId: 'r22VlJ3F0m0',
      title: 'ตำนานผีกระหัง | หลอนไดอารี่',
      url: 'https://www.youtube.com/watch?v=r22VlJ3F0m0',
      thumbnail: 'https://i.ytimg.com/vi/r22VlJ3F0m0/hqdefault.jpg',
    },
    'pin-overtoun-bridge': {
      videoId: 'oI7iPb3qtZM',
      title: 'Scotland Bridge Leads Dogs to Their Death',
      url: 'https://www.youtube.com/watch?v=oI7iPb3qtZM',
      thumbnail: 'https://i.ytimg.com/vi/oI7iPb3qtZM/hqdefault.jpg',
    },
    'pin-leap-castle': {
      videoId: 'wJPoFdKzjJU',
      title: "The Dark Story of Ireland's Most Haunted Castle - Leap Castle",
      url: 'https://www.youtube.com/watch?v=wJPoFdKzjJU',
      thumbnail: 'https://i.ytimg.com/vi/wJPoFdKzjJU/hqdefault.jpg',
    },
  };

  for (const p of pins) {
    if (fixedVideos[p.id]) {
      const v = fixedVideos[p.id];
      p.image_url = v.thumbnail;
      p.gallery_media = [
        { type: 'image', url: v.thumbnail, title: p.title_th },
        { type: 'youtube', url: v.url, title: v.title, thumbnail: v.thumbnail },
      ];
      console.log(`[FIXED DAMAGED] ${p.id} -> ${v.title}`);
    }
  }

  // 2. Identify missing batch pins to restore
  const currentIds = new Set(pins.map((p) => p.id));
  const b1 = JSON.parse(fs.readFileSync('mcp/batches/batch1.json', 'utf8'));
  const b2 = JSON.parse(fs.readFileSync('mcp/batches/batch2.json', 'utf8'));
  const b3 = JSON.parse(fs.readFileSync('mcp/batches/batch3.json', 'utf8'));
  const b4 = JSON.parse(fs.readFileSync('mcp/batches/batch4.json', 'utf8'));
  const allBatches = [...b1, ...b2, ...b3, ...b4];

  const toRestore = allBatches.filter((p) => !currentIds.has(p.id));
  console.log(`Identified ${toRestore.length} missing batch pins to restore (e.g. Chalawan, Krasue Ban Dong, Khao Kho)`);

  const cacheFile = path.resolve('scripts/restoredBatchPins.json');
  let cache = {};
  if (fs.existsSync(cacheFile)) {
    try {
      cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    } catch (e) {}
  }

  // Enrich each missing pin
  for (let i = 0; i < toRestore.length; i++) {
    const p = toRestore[i];
    if (cache[p.id] && cache[p.id].videoId) {
      console.log(`[${i + 1}/${toRestore.length}] CACHED: ${p.title_th} (${p.id})`);
      continue;
    }

    const query = p.yt_query || p.title_th + ' ตำนาน' || p.title_en;
    let res = await searchYouTubeVideo(query);
    if (!res && p.title_en) {
      res = await searchYouTubeVideo(p.title_en + ' documentary');
    }

    if (res) {
      cache[p.id] = res;
      console.log(`[${i + 1}/${toRestore.length}] OK: ${p.title_th} -> "${res.title}" (${res.videoId})`);
    } else {
      console.warn(`[${i + 1}/${toRestore.length}] NOT FOUND: ${p.title_th} (query: ${query})`);
    }

    fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
    await sleep(2200); // safe interval
  }

  // Add restored pins to `pins` array
  let restoredCount = 0;
  for (const p of toRestore) {
    const videoData = cache[p.id];
    if (videoData) {
      p.image_url = videoData.thumbnail;
      p.gallery_media = [
        { type: 'image', url: videoData.thumbnail, title: p.title_th },
        { type: 'youtube', url: videoData.url, title: videoData.title, thumbnail: videoData.thumbnail },
      ];
      delete p.yt_query;
      delete p.img_query;
      pins.push(p);
      restoredCount++;
    }
  }

  console.log(`Successfully added ${restoredCount} restored pins into pins list!`);
  console.log(`New total pins in seedData: ${pins.length}`);

  // Save to seedData.ts
  const filePrefix = content.slice(0, arrayStart);
  const fileSuffix = content.slice(endIdx + 1);
  const newContent = filePrefix + JSON.stringify(pins, null, 2) + fileSuffix;
  fs.writeFileSync(seedPath, newContent, 'utf8');
  console.log('Saved updated pins to src/data/seedData.ts');

  // 3. Resync all to live Cloudflare D1
  console.log('Syncing all pins to live Cloudflare D1...');
  let ok = 0;
  const concurrency = 6;
  for (let i = 0; i < pins.length; i += concurrency) {
    const batch = pins.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (p) => {
        try {
          const res = await fetch('https://worldofmys.pages.dev/api/pins', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p),
          });
          if (res.ok) ok++;
        } catch (e) {}
      })
    );
    if ((i + concurrency) % 50 === 0 || i + concurrency >= pins.length) {
      console.log(`D1 Sync: ${Math.min(i + concurrency, pins.length)}/${pins.length} (OK: ${ok})`);
    }
  }
  console.log(`D1 Sync Complete: ${ok}/${pins.length}`);
}

main().catch(console.error);

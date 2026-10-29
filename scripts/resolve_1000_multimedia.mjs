import fs from 'fs';
import https from 'https';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function searchYouTube(query) {
  const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
  return new Promise((resolve) => {
    https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'th,en-US;q=0.9,en;q=0.8',
        },
      },
      (res) => {
        let html = '';
        res.on('data', (chunk) => (html += chunk));
        res.on('end', () => {
          try {
            const match = html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/);
            if (!match) return resolve([]);
            const data = JSON.parse(match[1]);
            const contents =
              data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer
                ?.contents?.[0]?.itemSectionRenderer?.contents || [];
            const results = [];
            for (const item of contents) {
              const v = item.videoRenderer;
              if (v && v.videoId && v.title?.runs?.[0]?.text) {
                results.push({
                  videoId: v.videoId,
                  title: v.title.runs[0].text,
                  thumbnail: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
                });
              }
            }
            resolve(results);
          } catch {
            resolve([]);
          }
        });
      }
    ).on('error', () => resolve([]));
  });
}

async function verifyOembed(id) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
    return res.status === 200;
  } catch {
    return false;
  }
}

async function main() {
  console.log('=== MULTIMEDIA RESOLUTION PIPELINE (1,000 PINS) ===');

  // Load existing pins to collect all used video IDs
  const seed = fs.readFileSync('src/data/seedData.ts', 'utf8');
  const startIdx = seed.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = ');
  const jsonStr = seed.slice(startIdx + 'export const INITIAL_GHOST_PINS: GhostPin[] = '.length, seed.lastIndexOf(';'));
  const existingPins = JSON.parse(jsonStr);

  const usedVideoIds = new Set();
  existingPins.forEach((p) => {
    const match = p.image_url?.match(/(?:v=|vi\/)([a-zA-Z0-9_-]{11})/);
    if (match) usedVideoIds.add(match[1]);
    if (p.gallery_media) {
      for (const m of p.gallery_media) {
        const mMatch = m.url?.match(/(?:v=|vi\/)([a-zA-Z0-9_-]{11})/);
        if (mMatch) usedVideoIds.add(mMatch[1]);
      }
    }
  });
  console.log(`Preserved ${usedVideoIds.size} unique video IDs from existing ${existingPins.length} pins.`);

  const catalog = JSON.parse(fs.readFileSync('scripts/catalog_1000.json', 'utf8'));
  console.log(`Catalog loaded: ${catalog.length} topics to resolve.`);

  // Checkpoint handling
  let resolvedList = [];
  const checkpointPath = 'scripts/batch3_checkpoint.json';
  if (fs.existsSync(checkpointPath)) {
    try {
      resolvedList = JSON.parse(fs.readFileSync(checkpointPath, 'utf8'));
      resolvedList.forEach((p) => {
        const match = p.image_url?.match(/(?:v=|vi\/)([a-zA-Z0-9_-]{11})/);
        if (match) usedVideoIds.add(match[1]);
      });
      console.log(`Resumed from checkpoint: ${resolvedList.length} pins already resolved.`);
    } catch {}
  }

  // Pre-fetch video pools grouped by query to minimize network calls
  const videoPoolByQuery = new Map();

  for (let i = resolvedList.length; i < catalog.length; i++) {
    const item = catalog[i];
    const q = item.yt_query;

    if (!videoPoolByQuery.has(q) || videoPoolByQuery.get(q).length === 0) {
      await sleep(1850); // 1.85s pacing guardrail
      const rawVideos = await searchYouTube(q);
      const verified = [];
      for (const v of rawVideos) {
        if (!usedVideoIds.has(v.videoId)) {
          if (await verifyOembed(v.videoId)) {
            verified.push(v);
          }
        }
      }
      videoPoolByQuery.set(q, verified);
    }

    let candidatePool = videoPoolByQuery.get(q);

    // If pool empty, try a broader regional query
    if (!candidatePool || candidatePool.length === 0) {
      const fallbackQ = `${item.province_th} สารคดี ประวัติศาสตร์`;
      await sleep(1850);
      const rawVideos = await searchYouTube(fallbackQ);
      const verified = [];
      for (const v of rawVideos) {
        if (!usedVideoIds.has(v.videoId)) {
          if (await verifyOembed(v.videoId)) {
            verified.push(v);
          }
        }
      }
      candidatePool = verified;
      videoPoolByQuery.set(q, candidatePool);
    }

    // Pick first unused verified video
    let selectedVideo = null;
    while (candidatePool && candidatePool.length > 0) {
      const top = candidatePool.shift();
      if (!usedVideoIds.has(top.videoId)) {
        selectedVideo = top;
        usedVideoIds.add(top.videoId);
        break;
      }
    }

    // Absolute fallback safety: if query yielded no new videos, search with timestamp query
    if (!selectedVideo) {
      await sleep(1850);
      const emergencyVideos = await searchYouTube(`${item.category} ${item.province_en} travel history`);
      for (const v of emergencyVideos) {
        if (!usedVideoIds.has(v.videoId) && (await verifyOembed(v.videoId))) {
          selectedVideo = v;
          usedVideoIds.add(v.videoId);
          break;
        }
      }
    }

    if (!selectedVideo) {
      console.warn(`[Warning] Could not resolve unique video for pin ${item.id} (${item.title_th})`);
      continue;
    }

    const pin = {
      id: item.id,
      title_th: item.title_th,
      title_en: item.title_en,
      category: item.category,
      province_th: item.province_th,
      province_en: item.province_en,
      district_th: item.district_th,
      district_en: item.district_en,
      lat: item.lat,
      lng: item.lng,
      sound_preset: item.sound_preset,
      story_th: item.story_th,
      story_en: item.story_en,
      folklore_history_th: item.folklore_history_th,
      folklore_history_en: item.folklore_history_en,
      image_url: `https://i.ytimg.com/vi/${selectedVideo.videoId}/hqdefault.jpg`,
      views_count: 0,
      is_published: 1,
      gallery_media: [
        {
          type: 'image',
          url: `https://i.ytimg.com/vi/${selectedVideo.videoId}/hqdefault.jpg`,
          title: item.title_th,
        },
        {
          type: 'youtube',
          url: `https://www.youtube.com/watch?v=${selectedVideo.videoId}`,
          title: selectedVideo.title,
          thumbnail: `https://i.ytimg.com/vi/${selectedVideo.videoId}/hqdefault.jpg`,
        },
      ],
      taboos_th: item.taboos_th,
      taboos_en: item.taboos_en,
      _descTh: item.descTh,
      _descEn: item.descEn,
    };

    resolvedList.push(pin);

    if (resolvedList.length % 25 === 0 || resolvedList.length === catalog.length) {
      fs.writeFileSync(checkpointPath, JSON.stringify(resolvedList, null, 2));
      console.log(`[Progress] Resolved ${resolvedList.length} / ${catalog.length} pins (Saved checkpoint).`);
    }
  }

  console.log(`\n🎉 All ${resolvedList.length} pins resolved!`);
  fs.writeFileSync('scripts/batch3_resolved_final.json', JSON.stringify(resolvedList, null, 2));
}

main().catch((err) => {
  console.error('Fatal error during resolution:', err);
  process.exit(1);
});

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
    console.error(`Search error for "${query}":`, err.message);
  }
  return null;
}

async function run() {
  const candidates = JSON.parse(fs.readFileSync('scripts/master900NewCandidates.json', 'utf8'));
  console.log(`Loaded ${candidates.length} new candidates.`);

  const cacheFile = path.resolve('scripts/enriched900NewPins.json');
  let cache = {};
  if (fs.existsSync(cacheFile)) {
    try {
      cache = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    } catch (e) {}
  }

  let enrichedCount = Object.keys(cache).length;
  console.log(`Already in cache: ${enrichedCount}/${candidates.length}`);

  for (let i = 0; i < candidates.length; i++) {
    const p = candidates[i];
    const pid = p.id;

    if (cache[pid] && cache[pid].videoId) {
      continue;
    }

    console.log(`[${i + 1}/${candidates.length}] Enriching: ${pid} - ${p.title_th.slice(0, 30)}...`);

    const queries = [];
    if (p.yt_query) queries.push(p.yt_query);
    queries.push(`${p.title_th.split('(')[0].trim()} สารคดี ตำนาน`);
    queries.push(`${p.title_en.split('(')[0].trim()} mythology documentary`);

    let foundVideo = null;
    for (const q of queries) {
      foundVideo = await searchYouTubeVideo(q);
      if (foundVideo) {
        console.log(`  -> Verified video [${foundVideo.videoId}]: "${foundVideo.title.slice(0, 45)}"`);
        break;
      }
      await sleep(1000);
    }

    if (!foundVideo) {
      console.warn(`  ! No embeddable video found for ${pid}, query: ${p.yt_query}`);
    } else {
      cache[pid] = {
        videoId: foundVideo.videoId,
        videoTitle: foundVideo.title,
        videoUrl: foundVideo.url,
        thumbnail: foundVideo.thumbnail
      };
      fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf8');
      enrichedCount++;
    }

    // Pacing requirement: minimum 1.8 - 2.2s delay between automated search calls
    const delay = 1900 + Math.floor(Math.random() * 300);
    await sleep(delay);
  }

  console.log(`\nEnrichment finished! Total enriched in cache: ${Object.keys(cache).length}/${candidates.length}`);
}

run().catch(console.error);

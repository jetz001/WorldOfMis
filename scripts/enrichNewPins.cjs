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

async function searchYouTubeVideo(query) {
  try {
    const html = await fetchHtml('https://www.youtube.com/results?search_query=' + encodeURIComponent(query));
    const match = html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/);
    let candidateIds = [];

    if (match) {
      try {
        const data = JSON.parse(match[1]);
        const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
        for (const item of contents) {
          const v = item.videoRenderer;
          if (v && v.videoId) {
            candidateIds.push({
              videoId: v.videoId,
              title: v.title?.runs?.[0]?.text || ''
            });
          }
        }
      } catch (e) {}
    }

    // fallback regex if ytInitialData didn't parse
    if (candidateIds.length === 0) {
      const rawMatches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
      candidateIds = [...new Set(rawMatches)].map(id => ({ videoId: id, title: '' }));
    }

    // Verify first embeddable candidate
    for (const cand of candidateIds.slice(0, 5)) {
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

module.exports = { searchYouTubeVideo, sleep };

if (require.main === module) {
  (async () => {
    console.log('Testing searchYouTubeVideo...');
    const res1 = await searchYouTubeVideo('Altamaha-ha cryptid documentary');
    console.log('Altamaha-ha:', res1);
    const res2 = await searchYouTubeVideo('Ozark Howler Arkansas folklore');
    console.log('Ozark Howler:', res2);
  })();
}

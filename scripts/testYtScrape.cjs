const https = require('https');

async function searchYouTube(query) {
  return new Promise((resolve) => {
    const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9' } }, (res) => {
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

async function verifyEmbeddable(videoId) {
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

(async () => {
  for (const q of ['Eye of the Sahara documentary', 'Hoia-Baciu forest mystery', 'Machu Picchu history documentary']) {
    console.log('Searching for:', q);
    const videoIds = await searchYouTube(q);
    console.log('Found video candidates:', videoIds.slice(0, 5));
    for (const vid of videoIds.slice(0, 5)) {
      const verified = await verifyEmbeddable(vid);
      if (verified.embeddable) {
        console.log('FOUND VERIFIED EMBEDDABLE:', verified.videoId, '->', verified.title);
        break;
      }
    }
  }
})();

const https = require('https');

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

https.get('https://www.youtube.com/results?search_query=Waheela+Nahanni', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cookie': 'CONSENT=YES+cb.20210328-17-p0.en+FX+410'
  }
}, res => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    const match = html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/);
    if (match) {
      const data = JSON.parse(match[1]);
      const list = extractVideoRenderers(data);
      console.log('Total videos extracted:', list.length);
      console.log('First 3:', list.slice(0, 3));
    }
  });
});

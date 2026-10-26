const fs = require('fs');
const https = require('https');

const content = fs.readFileSync('src/data/seedData.ts', 'utf8');
const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
const arrayStart = content.indexOf('= [', startIdx) + 2;
const endIdx = content.lastIndexOf('];');
const pins = eval(content.slice(arrayStart, endIdx + 1));

function checkOembed(videoId) {
  return new Promise(resolve => {
    const req = https.get('https://www.youtube.com/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + videoId) + '&format=json', res => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function run() {
  console.log(`Auditing ${pins.length} pins for YouTube status...`);
  const broken = [];
  const concurrency = 15;

  for (let i = 0; i < pins.length; i += concurrency) {
    const batch = pins.slice(i, i + concurrency);
    await Promise.all(batch.map(async p => {
      const yt = (p.gallery_media || []).find(m => m.type === 'youtube');
      if (!yt || !yt.url) {
        broken.push({ id: p.id, title_th: p.title_th, reason: 'missing_yt' });
        return;
      }
      const m = yt.url.match(/v=([a-zA-Z0-9_-]{11})/);
      if (!m) {
        broken.push({ id: p.id, title_th: p.title_th, reason: 'bad_url' });
        return;
      }
      const ok = await checkOembed(m[1]);
      if (!ok) {
        broken.push({ id: p.id, title_th: p.title_th, videoId: m[1], title_en: p.title_en });
      }
    }));
    process.stdout.write(`\rProgress: ${Math.min(i + concurrency, pins.length)}/${pins.length}`);
  }
  console.log(`\nTotal broken videos: ${broken.length}`);
  fs.writeFileSync('scripts/brokenVideos.json', JSON.stringify(broken, null, 2));
  console.log('Saved to scripts/brokenVideos.json');
}

run();

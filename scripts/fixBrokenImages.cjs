const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'WorldOfMys/2.0 (contact: admin@worldofmys.com)' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, text: data }); }
      });
    }).on('error', () => resolve({ status: 500 }));
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'WorldOfMys/2.0 (contact: admin@worldofmys.com)' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function fetchWikiImage(query, destPath) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=10&prop=imageinfo&iiprop=url|mime|size&format=json`;
  const res = await fetchJson(url);
  if (res.status === 200 && res.data && res.data.query && res.data.query.pages) {
    const pages = Object.values(res.data.query.pages);
    for (const p of pages) {
      const info = p.imageinfo && p.imageinfo[0];
      if (!info) continue;
      const mime = info.mime || '';
      const imgUrl = info.url || '';
      // Strict filter for true browser-compatible raster images, under 4MB
      if ((mime === 'image/jpeg' || mime === 'image/png') && !imgUrl.endsWith('.djvu') && !imgUrl.endsWith('.pdf')) {
        console.log(`Downloading valid image for ${query}: ${imgUrl} (${(info.size / 1024).toFixed(0)} KB)`);
        await downloadFile(imgUrl, destPath);
        // Verify magic bytes
        const buf = fs.readFileSync(destPath);
        const isJpg = buf[0] === 0xff && buf[1] === 0xd8;
        const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
        if (isJpg || isPng) {
          console.log(` -> SUCCESS! Valid image verified for ${destPath}`);
          return true;
        }
      }
    }
  }
  return false;
}

const TARGETS = [
  { file: 'pin-lallorona.jpg', query: 'La Llorona painting folklore Mexican' },
  { file: 'pin-gunungpadang.jpg', query: 'Gunung Padang megalithic site West Java' },
  { file: 'pin-chillingham.jpg', query: 'Chillingham Castle Northumberland England' },
  { file: 'pin-kelpie.jpg', query: 'The Kelpies Falkirk Scotland' },
  { file: 'pin-dragonstriangle.jpg', query: 'Miyakejima Pacific ocean Japan' },
  { file: 'pin-toweroflondon.jpg', query: 'Tower of London Traitors Gate' },
  { file: 'pin-sphinx.jpg', query: 'Great Sphinx of Giza Egypt front view' }
];

async function main() {
  const dir = 'public/entities';
  for (const t of TARGETS) {
    const dest = path.join(dir, t.file);
    console.log(`\nFixing ${t.file}...`);
    const ok = await fetchWikiImage(t.query, dest);
    if (!ok) {
      console.warn(`Could not find wiki image for ${t.file}, using backup query...`);
      await fetchWikiImage(t.file.replace('pin-', '').replace('.jpg', ''), dest);
    }
  }
}

main().catch(console.error);

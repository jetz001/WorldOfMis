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
        catch (e) { resolve({ status: res.statusCode }); }
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

const ITEMS = [
  { file: 'pin-lallorona.jpg', title: 'La_Llorona' },
  { file: 'pin-gunungpadang.jpg', title: 'Gunung_Padang' },
  { file: 'pin-chillingham.jpg', title: 'Chillingham_Castle' },
  { file: 'pin-kelpie.jpg', title: 'The_Kelpies' },
  { file: 'pin-dragonstriangle.jpg', title: 'Devil%27s_Sea' },
  { file: 'pin-toweroflondon.jpg', title: 'Tower_of_London' },
  { file: 'pin-sphinx.jpg', title: 'Great_Sphinx_of_Giza' },
  { file: 'pin-highgate.jpg', title: 'Highgate_Cemetery' },
  { file: 'pin-darvaza.jpg', title: 'Darvaza_gas_crater' },
  { file: 'pin-derinkuyu.jpg', title: 'Derinkuyu_underground_city' },
  { file: 'pin-hoiabaciu.jpg', title: 'Hoia_Forest' },
  { file: 'pin-terracotta.jpg', title: 'Terracotta_Army' },
  { file: 'pin-tunguska.jpg', title: 'Tunguska_event' }
];

async function main() {
  const dir = 'public/entities';
  for (const item of ITEMS) {
    const destPath = path.join(dir, item.file);
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${item.title}&prop=pageimages&format=json&pithumbsize=800`;
    console.log(`Querying thumbnail for ${item.title}...`);
    const res = await fetchJson(apiUrl);
    if (res.status === 200 && res.data && res.data.query && res.data.query.pages) {
      const page = Object.values(res.data.query.pages)[0];
      if (page && page.thumbnail && page.thumbnail.source) {
        const thumbUrl = page.thumbnail.source;
        console.log(`Downloading ${thumbUrl} to ${item.file}...`);
        await downloadFile(thumbUrl, destPath);
        // Verify
        const buf = fs.readFileSync(destPath);
        const isJpg = buf[0] === 0xff && buf[1] === 0xd8;
        const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;
        console.log(` -> Size: ${(buf.length / 1024).toFixed(0)} KB | Valid Image: ${isJpg || isPng}`);
      } else {
        console.warn(` !! No thumbnail found for ${item.title}`);
      }
    }
  }
}

main().catch(console.error);

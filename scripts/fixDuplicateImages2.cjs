// Re-download correct, unique Wikipedia lead images for pins that were wrongly
// sharing a fallback copy (Vlad the Impaler portrait) or duplicate files.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = path.join(__dirname, '..', 'public', 'entities');
const UA = 'WorldOfMysteryBot/1.0 (https://worldofmys.pages.dev; educational folklore globe)';

// pinId -> list of candidate Wikipedia titles (first with an image wins)
const MAP = {
  'pin-popobawa': ['Stone Town', 'Pemba Island', 'Unguja'],
  'pin-skogsra': ['Wood nymph', 'Hulder', 'Bergslagen', 'Swedish folklore'],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getThumb(title) {
  const url =
    'https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail&pithumbsize=800&redirects=1&format=json&titles=' +
    encodeURIComponent(title);
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const json = await res.json();
  const pages = json?.query?.pages || {};
  for (const p of Object.values(pages)) {
    if (p.thumbnail?.source) return p.thumbnail.source;
  }
  return null;
}

function isImage(buf) {
  const jpg = buf[0] === 0xff && buf[1] === 0xd8;
  const png = buf[0] === 0x89 && buf[1] === 0x50;
  const webp = buf.slice(8, 12).toString() === 'WEBP';
  return jpg || png || webp;
}

(async () => {
  const usedHashes = new Set();
  // Gather hashes of all OTHER files so we never introduce a new duplicate
  for (const f of fs.readdirSync(dir)) {
    const id = f.replace(/\.[^.]+$/, '');
    if (MAP[id]) continue;
    usedHashes.add(crypto.createHash('md5').update(fs.readFileSync(path.join(dir, f))).digest('hex'));
  }

  const failed = [];
  for (const [id, titles] of Object.entries(MAP)) {
    let ok = false;
    for (const t of titles) {
      try {
        const src = await getThumb(t);
        if (!src) continue;
        const r = await fetch(src, { headers: { 'User-Agent': UA } });
        if (!r.ok) continue;
        const buf = Buffer.from(await r.arrayBuffer());
        if (!isImage(buf) || buf.length < 5000) continue;
        const h = crypto.createHash('md5').update(buf).digest('hex');
        if (usedHashes.has(h)) continue;
        usedHashes.add(h);
        fs.writeFileSync(path.join(dir, `${id}.jpg`), buf);
        console.log(`OK   ${id} <- "${t}" (${buf.length}b)`);
        ok = true;
        break;
      } catch (e) {
        // try next title
      }
      await sleep(250);
    }
    if (!ok) {
      failed.push(id);
      console.log(`FAIL ${id}`);
    }
    await sleep(250);
  }
  console.log(`\nDone. Failed: ${failed.length ? failed.join(', ') : 'none'}`);
})();


const fs = require('fs');

async function testVideo(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.status === 200) {
      const data = await res.json();
      return { ok: true, title: data.title };
    }
    return { ok: false, status: res.status };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  const content = fs.readFileSync('src/data/seedData.ts', 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('[', startIdx);
  const endIdx = content.lastIndexOf('];');
  const arrayCode = content.slice(arrayStart, endIdx + 1);

  const pins = eval(arrayCode);
  console.log(`Auditing all ${pins.length} pins from seedData.ts...`);

  let okCount = 0;
  let failCount = 0;
  const failures = [];

  // Run in chunks of 10
  for (let i = 0; i < pins.length; i += 10) {
    const chunk = pins.slice(i, i + 10);
    await Promise.all(chunk.map(async (p, idx) => {
      const index = i + idx + 1;
      const yt = (p.gallery_media || []).find(m => m.type === 'youtube');
      if (!yt || !yt.url) {
        failCount++;
        failures.push({ id: p.id, reason: 'No URL' });
        console.log(`[${index}/${pins.length}] [FAIL] ${p.id} NO YOUTUBE URL!`);
        return;
      }
      const check = await testVideo(yt.url);
      if (check.ok) {
        okCount++;
        console.log(`[${index}/${pins.length}] [OK] ${p.id} -> ${yt.url} (${check.title.slice(0, 40)})`);
      } else {
        failCount++;
        failures.push({ id: p.id, title_th: p.title_th, url: yt.url, status: check.status || check.error });
        console.log(`[${index}/${pins.length}] [FAIL] ${p.id} -> ${yt.url} (status: ${check.status || check.error})`);
      }
    }));
  }

  console.log('=========================================');
  console.log(`AUDIT FINISHED: ${okCount} OK, ${failCount} FAILED.`);
  if (failures.length > 0) {
    console.log('FAILURES TO FIX:');
    failures.forEach(f => console.log(` - ${f.id} (${f.title_th}): ${f.url} [${f.status}]`));
    fs.writeFileSync('scripts/audit_failures.json', JSON.stringify(failures, null, 2));
  } else {
    console.log('🎉 100% OF VIDEOS ARE VERIFIED PLAYABLE AND EMBEDDABLE!');
  }
}

main();

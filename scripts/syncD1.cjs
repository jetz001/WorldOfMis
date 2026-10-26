const fs = require('fs');
const path = require('path');

async function syncAllToD1() {
  const seedPath = path.resolve('src/data/seedData.ts');
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('= [', startIdx) + 2;
  const endIdx = content.lastIndexOf('];');
  const pins = eval(content.slice(arrayStart, endIdx + 1));

  console.log(`Syncing ${pins.length} clean pins to live D1...`);
  let ok = 0;
  const concurrency = 6;

  for (let i = 0; i < pins.length; i += concurrency) {
    const batch = pins.slice(i, i + concurrency);
    await Promise.all(
      batch.map(async (p) => {
        try {
          const res = await fetch('https://worldofmys.pages.dev/api/pins', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(p),
          });
          if (res.ok) ok++;
        } catch (e) {}
      })
    );
    if ((i + concurrency) % 50 === 0 || i + concurrency >= pins.length) {
      console.log(`Progress: ${Math.min(i + concurrency, pins.length)}/${pins.length} (Success: ${ok})`);
    }
  }
  console.log(`Finished syncing: ${ok}/${pins.length}`);
}

syncAllToD1().catch(console.error);

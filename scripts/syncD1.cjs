const fs = require('fs');
const path = require('path');

async function syncAllToD1() {
  const seedPath = path.resolve('src/data/seedData.ts');
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('= [', startIdx) + 2;
  const endIdx = content.lastIndexOf('];');
  const pins = eval(content.slice(arrayStart, endIdx + 1));

  console.log(`Syncing ${pins.length} pins to live D1...`);
  let ok = 0;
  for (let i = 0; i < pins.length; i++) {
    const p = pins[i];
    try {
      const res = await fetch('https://worldofmys.pages.dev/api/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) ok++;
    } catch (e) {}
    if ((i + 1) % 50 === 0 || i === pins.length - 1) {
      console.log(`Progress: ${i + 1}/${pins.length} (Success: ${ok})`);
    }
  }
  console.log(`Finished syncing: ${ok}/${pins.length}`);
}

syncAllToD1().catch(console.error);

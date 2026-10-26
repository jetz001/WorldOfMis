const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Load clean 400 IDs
const content = fs.readFileSync('src/data/seedData.ts', 'utf8');
const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
const arrayStart = content.indexOf('= [', startIdx) + 2;
const endIdx = content.lastIndexOf('];');
const cleanPins = eval(content.slice(arrayStart, endIdx + 1));
const cleanIds = new Set(cleanPins.map(p => p.id));
console.log(`Clean pins count: ${cleanPins.length}`);

// 2. Fetch all IDs currently in D1 remote
console.log('Querying all IDs in D1...');
const output = execSync('npx wrangler d1 execute worldofmys-db --remote --json --command="SELECT id FROM ghost_pins;"', { encoding: 'utf8' });
const json = JSON.parse(output);
const d1Rows = json[0].results;
console.log(`Total rows currently in D1: ${d1Rows.length}`);

const dirtyIds = d1Rows.map(r => r.id).filter(id => !cleanIds.has(id));
console.log(`Found ${dirtyIds.length} dirty/orphan IDs in D1:`, dirtyIds);

if (dirtyIds.length > 0) {
  // Batch delete in chunks of 25
  const chunkSize = 25;
  for (let i = 0; i < dirtyIds.length; i += chunkSize) {
    const chunk = dirtyIds.slice(i, i + chunkSize);
    const inList = chunk.map(id => `'${id}'`).join(',');
    const sql = `DELETE FROM ghost_pins WHERE id IN (${inList});`;
    console.log(`Deleting chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(dirtyIds.length / chunkSize)} (${chunk.length} pins)...`);
    execSync(`npx wrangler d1 execute worldofmys-db --remote --command="${sql}"`, { stdio: 'inherit' });
  }
  console.log('Finished deleting dirty rows.');
}

// 3. Check count after deletion
const countOutput = execSync('npx wrangler d1 execute worldofmys-db --remote --json --command="SELECT count(*) as count FROM ghost_pins;"', { encoding: 'utf8' });
const countJson = JSON.parse(countOutput);
console.log('D1 row count after cleanup:', countJson[0].results[0].count);

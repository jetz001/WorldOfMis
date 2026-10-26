const { execSync } = require('child_process');
const fs = require('fs');

const origSeed = execSync('git show 044d330:src/data/seedData.ts', { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
const startIdx = origSeed.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
const arrayStart = origSeed.indexOf('= [', startIdx) + 2;
const endIdx = origSeed.lastIndexOf('];');
const origPins = eval(origSeed.slice(arrayStart, endIdx + 1));
console.log('Original 305 pins count:', origPins.length);

const b1 = JSON.parse(fs.readFileSync('mcp/batches/batch1.json', 'utf8'));
const b2 = JSON.parse(fs.readFileSync('mcp/batches/batch2.json', 'utf8'));
const b3 = JSON.parse(fs.readFileSync('mcp/batches/batch3.json', 'utf8'));
const b4 = JSON.parse(fs.readFileSync('mcp/batches/batch4.json', 'utf8'));
const allBatches = [...b1, ...b2, ...b3, ...b4];
console.log('All batch pins count:', allBatches.length);

const origIdSet = new Set(origPins.map(p => p.id));
const overlaps = allBatches.filter(p => origIdSet.has(p.id));
console.log('Overlaps between 305 and batches:', overlaps.map(p => p.id));

const newBatchPins = allBatches.filter(p => !origIdSet.has(p.id));
console.log('Truly new batch pins:', newBatchPins.length);
console.log('Total if combined (305 + truly new):', origPins.length + newBatchPins.length);

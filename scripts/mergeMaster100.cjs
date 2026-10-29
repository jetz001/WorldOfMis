const fs = require('fs');

const curses = require('./candidates_curse.cjs');
const ghosts = require('./candidates_ghost.cjs');
const legends = require('./candidates_legend.cjs');
const sacred = require('./candidates_sacred.cjs');
const monsters = require('./candidates_monster.cjs');

const allNew = [...curses, ...ghosts, ...legends, ...sacred, ...monsters];
console.log(`Total new candidates: ${allNew.length}`);

// Verify categories
const cats = {};
allNew.forEach(c => cats[c.category] = (cats[c.category] || 0) + 1);
console.log('Categories breakdown:', cats);

// Verify with existing D1 600
const curPins = JSON.parse(fs.readFileSync('scripts/current_600_pins.json', 'utf8'));
const curIds = new Set(curPins.map(p => p.id.toLowerCase()));
const curTitlesTh = new Set(curPins.map(p => p.title_th.toLowerCase()));
const curTitlesEn = new Set(curPins.map(p => p.title_en.toLowerCase()));

let duplicates = 0;
const seenIds = new Set();

allNew.forEach(c => {
  if (curIds.has(c.id.toLowerCase())) {
    console.error(`DUPLICATE ID against D1 600: ${c.id}`);
    duplicates++;
  }
  if (seenIds.has(c.id.toLowerCase())) {
    console.error(`DUPLICATE ID within new batch: ${c.id}`);
    duplicates++;
  }
  seenIds.add(c.id.toLowerCase());

  if (curTitlesTh.has(c.title_th.toLowerCase())) {
    console.error(`DUPLICATE TITLE TH: ${c.title_th}`);
    duplicates++;
  }
  if (curTitlesEn.has(c.title_en.toLowerCase())) {
    console.error(`DUPLICATE TITLE EN: ${c.title_en}`);
    duplicates++;
  }
});

if (duplicates > 0) {
  console.error(`Found ${duplicates} duplicates. Please resolve before proceeding.`);
  process.exit(1);
}

console.log('All 100 new candidates are 100% unique against existing 600 pins!');
fs.writeFileSync('scripts/master100NewCandidates.json', JSON.stringify(allNew, null, 2), 'utf8');
console.log('Saved scripts/master100NewCandidates.json successfully.');

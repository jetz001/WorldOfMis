const fs = require('fs');

const sacred = require('./candidates1100_sacred.cjs');
const ghost = require('./candidates1100_ghost.cjs');
const monster = require('./candidates1100_monster.cjs');
const curse = require('./candidates1100_curse.cjs');
const legend = require('./candidates1100_legend.cjs');
const existingMap = require('./existing_1000_pins_map.json');

const all1100 = [...sacred, ...ghost, ...monster, ...curse, ...legend];

console.log('Total merged candidates:', all1100.length);
console.log('Breakdown by category:');
const catCount = {};
all1100.forEach(c => {
  catCount[c.category] = (catCount[c.category] || 0) + 1;
});
console.log(catCount);

// Check internal duplicates
const seen = new Set();
const internalDups = [];
all1100.forEach(c => {
  if (seen.has(c.id)) internalDups.push(c.id);
  seen.add(c.id);
});
console.log('Internal duplicates:', internalDups);

// Check collisions with existing 1000 pins
const existingCollisions = all1100.filter(c => existingMap[c.id]);
console.log('Collisions with existing 1000 pins:', existingCollisions.map(c => c.id));

if (all1100.length === 100 && internalDups.length === 0 && existingCollisions.length === 0) {
  fs.writeFileSync('scripts/master1100NewCandidates.json', JSON.stringify(all1100, null, 2), 'utf8');
  console.log('SUCCESS: Written scripts/master1100NewCandidates.json (100 unique pins)!');
} else {
  console.error('VERIFICATION FAILED!');
  process.exit(1);
}

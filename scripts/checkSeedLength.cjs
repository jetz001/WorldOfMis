const fs = require('fs');
const content = fs.readFileSync('src/data/seedData.ts', 'utf8');

// extract the array
const jsonStrMatch = content.match(/export const INITIAL_GHOST_PINS: GhostPin\[\] = (\[[\s\S]*\]);/);
if (jsonStrMatch) {
  try {
    const arr = JSON.parse(jsonStrMatch[1]);
    console.log('Array length parsed:', arr.length);
  } catch (err) {
    console.log('JSON parse error:', err.message);
  }
}

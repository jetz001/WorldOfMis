const fs = require('fs');
const content = fs.readFileSync('src/data/seedData.ts', 'utf8');
const match = content.match(/export const INITIAL_GHOST_PINS: GhostPin\[\] = (\[[\s\S]*\]);/);
const arrayEnd = match.index + match[0].length;
console.log('Trailing content length:', content.length - arrayEnd);
console.log('Trailing preview:', content.slice(arrayEnd, arrayEnd + 500));

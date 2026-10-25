const fs = require('fs');
const content = fs.readFileSync('src/data/seedData.ts', 'utf8');
const idMatches = [...content.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Total current pins:', idMatches.length);
console.log(idMatches.join(', '));

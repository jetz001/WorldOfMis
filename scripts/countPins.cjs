const fs = require('fs');
const txt = fs.readFileSync('src/data/seedData.ts', 'utf8');
const count = (txt.match(/"id":/g) || []).length;
console.log('Total pins in seedData.ts:', count);

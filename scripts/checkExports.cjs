const fs = require('fs');
const content = fs.readFileSync('src/data/seedData.ts', 'utf8');

const regex = /export const (\w+)/g;
let m;
while ((m = regex.exec(content)) !== null) {
  console.log('Export:', m[1]);
}

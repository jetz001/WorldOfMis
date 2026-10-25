const fs = require('fs');
const content = fs.readFileSync('d:/DEV/WorldOfMys/WorldOfMis/src/data/seedData.ts', 'utf8');
const regex = /id:\s*'(pin-[^']+)',[\s\S]*?title_th:\s*'([^']+)',[\s\S]*?title_en:\s*'([^']+)'/g;
let match;
let i = 1;
const list = [];
while ((match = regex.exec(content)) !== null) {
  list.push({ id: match[1], title_th: match[2], title_en: match[3] });
}
console.log('Total pins:', list.length);
list.forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.id}] ${item.title_th} | ${item.title_en}`);
});

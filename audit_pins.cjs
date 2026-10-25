const fs = require('fs');
const v = JSON.parse(fs.readFileSync('d:/DEV/WorldOfMys/WorldOfMis/verified_pin_videos.json', 'utf8'));
const content = fs.readFileSync('d:/DEV/WorldOfMys/WorldOfMis/src/data/seedData.ts', 'utf8');
const regex = /id:\s*'(pin-[^']+)',[\s\S]*?title_th:\s*'([^']+)',[\s\S]*?title_en:\s*'([^']+)'/g;
let m;
let i = 1;
while ((m = regex.exec(content)) !== null) {
  const id = m[1];
  const th = m[2];
  const en = m[3];
  const vid = v[id];
  console.log(`${i++}. [${id}] ${th} | ${en}`);
  console.log(`    Video: ${vid ? vid.title + ' [' + (vid.channel || '') + ']' : 'NONE'}`);
}

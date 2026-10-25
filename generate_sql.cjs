const fs = require('fs');

const content = fs.readFileSync('d:/DEV/WorldOfMys/WorldOfMis/src/data/seedData.ts', 'utf8');
const pinBlocks = content.split(/id:\s*'/).slice(1);
const updates = [];

for (const b of pinBlocks) {
  const pinId = b.split("'")[0];
  const startIdx = b.indexOf('gallery_media:');
  if (startIdx === -1) continue;
  
  const sub = b.slice(startIdx);
  const openBracket = sub.indexOf('[');
  let depth = 0;
  let endBracket = -1;
  for (let i = openBracket; i < sub.length; i++) {
    if (sub[i] === '[') depth++;
    else if (sub[i] === ']') {
      depth--;
      if (depth === 0) {
        endBracket = i;
        break;
      }
    }
  }

  if (endBracket !== -1) {
    const rawJson = sub.slice(openBracket, endBracket + 1);
    try {
      const parsed = JSON.parse(rawJson);
      const sqlEscaped = JSON.stringify(parsed).replace(/'/g, "''");
      updates.push(`UPDATE ghost_pins SET gallery_media = '${sqlEscaped}' WHERE id = '${pinId}';`);
    } catch(err) {
      console.error('Error parsing pin', pinId, err.message);
    }
  }
}

console.log('Total SQL statements generated:', updates.length);
fs.writeFileSync('d:/DEV/WorldOfMys/WorldOfMis/update_verified_videos.sql', updates.join('\n'), 'utf8');

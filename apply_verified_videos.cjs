const fs = require('fs');

function applyVideos() {
  const verifiedPath = 'd:/DEV/WorldOfMys/WorldOfMis/verified_pin_videos.json';
  if (!fs.existsSync(verifiedPath)) {
    console.error('verified_pin_videos.json not found yet.');
    return;
  }

  const pinVideos = JSON.parse(fs.readFileSync(verifiedPath, 'utf8'));
  const seedPath = 'd:/DEV/WorldOfMys/WorldOfMis/src/data/seedData.ts';
  let seedContent = fs.readFileSync(seedPath, 'utf8');

  const d1Updates = [];

  // Match each pin block
  const pinBlockRegex = /{\s*id:\s*'(pin-[^']+)',[\s\S]*?gallery_media:\s*(\[[^\]]*\])[\s\S]*?is_published:\s*1,?\s*}/g;

  let replacedCount = 0;

  // Alternatively, let's parse pin by pin carefully
  // In seedData.ts, each pin has id: 'pin-...' and gallery_media: [...]
  for (const [pinId, videoInfo] of Object.entries(pinVideos)) {
    // Look for pinId and its gallery_media
    const pinRegex = new RegExp(`(id:\\s*'${pinId}',[\\s\\S]*?gallery_media:\\s*)(\\[[^\\]]*\\])`, 'g');
    
    if (pinRegex.test(seedContent)) {
      seedContent = seedContent.replace(pinRegex, (fullMatch, prefix, oldMediaStr) => {
        try {
          const oldMedia = JSON.parse(oldMediaStr);
          // Keep images, remove old youtube
          const newMedia = oldMedia.filter(m => m.type !== 'youtube');
          newMedia.push({
            type: 'youtube',
            url: videoInfo.url,
            title: videoInfo.title,
            thumbnail: `/entities/${pinId}.jpg`
          });
          replacedCount++;
          
          // Add to D1 update
          const jsonEscaped = JSON.stringify(newMedia).replace(/'/g, "''");
          d1Updates.push(`UPDATE ghost_pins SET gallery_media = '${jsonEscaped}' WHERE id = '${pinId}';`);

          return `${prefix}${JSON.stringify(newMedia, null, 8)}`;
        } catch(e) {
          return fullMatch;
        }
      });
    }
  }

  fs.writeFileSync(seedPath, seedContent, 'utf8');
  console.log(`Updated ${replacedCount} pins in seedData.ts`);

  const sqlPath = 'd:/DEV/WorldOfMys/WorldOfMis/update_verified_videos.sql';
  fs.writeFileSync(sqlPath, d1Updates.join('\n'), 'utf8');
  console.log(`Wrote ${d1Updates.length} SQL statements to ${sqlPath}`);
}

applyVideos();

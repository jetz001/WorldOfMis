const fs = require('fs');

const TITLE_FIXES = {
  'pin-lorelei': 'ลอเรไล ไซเรนสาวแห่งแม่น้ำไรน์',
  'pin-gevaudan': 'สัตว์ร้ายแห่งเฌโวด็อง (อสูรหมาป่า)',
  'pin-jiangshi': 'เจียงซือ (ผีดิบจีนกระโดด)',
  'pin-baba-iva': 'บาบายากา (แม่มดกระดูกแห่งสลาฟ)',
  'pin-chudail': 'ชูเดล (วิญญาณหญิงคร่ำครวญแห่งเอเชียใต้)',
  'pin-curupira': 'กูรูปิรา (ภูตผู้พิทักษ์ผืนป่าแอมะซอน)',
  'pin-draugr': 'ดราวก์ (ผีดิบไวกิ้งโบราณ)',
  'pin-minotaur': 'มิโนทอร์แห่งเขาวงกตครีต',
  'pin-banshee': 'แบนชี (วิญญาณหวีดร้องแห่งความตาย)',
  'pin-mahasona': 'มหาโสณา (ยักษ์อสูรแห่งป่าช้าศรีลังกา)',
  'pin-pishtaco': 'พิชตาโก (ปีศาจสูบไขมันมนุษย์แห่งแอนดีส)',
  'pin-madamkoi': 'มาดามคอยคอย (ผีส้นสูงสีแดงแห่งแอฟริกา)'
};

const VIDEO_FIXES = {
  'pin-lorelei': {
    videoId: 's1qCMPnc820',
    url: 'https://www.youtube.com/watch?v=s1qCMPnc820',
    title: 'ไซเรนคือใคร? #ดราม่าระดับเทพ | Point of View',
    channel: 'Point of View'
  },
  'pin-mahasona': {
    videoId: 'ij3lZndopjs',
    url: 'https://www.youtube.com/watch?v=ij3lZndopjs',
    title: 'MAHASONA මහසෝනා — The Sri Lankan Legend of the Graveyard Demon',
    channel: 'SAM PODDA | Sameera Balasooriya'
  },
  'pin-pishtaco': {
    videoId: 'H2EGcnuUZuo',
    url: 'https://www.youtube.com/watch?v=H2EGcnuUZuo',
    title: 'The Police Arrested A Monster | The Real Story Of The Pishtaco',
    channel: 'Whispers Beyond Archives'
  },
  'pin-patasola': {
    videoId: 'YSnjByNhUgY',
    url: 'https://www.youtube.com/watch?v=YSnjByNhUgY',
    title: 'The Curse of La Patasola | Official Trailer & Legend',
    channel: 'Vertical'
  },
  'pin-mosina': {
    videoId: 'YELf32J1Xzk',
    url: 'https://www.youtube.com/watch?v=YELf32J1Xzk',
    title: 'The Mud-Rice Feast | A Taiwanese Ghost Story (Mo-sin-a Mountain Legend)',
    channel: 'The Ghost Engine: Taiwan'
  },
  'pin-nightmarchers': {
    videoId: 'jLCEp-4esIM',
    url: 'https://www.youtube.com/watch?v=jLCEp-4esIM',
    title: 'The Nightmarchers - Hawaiian Army of the Dead - Extra Mythology',
    channel: 'Extra History'
  }
};

function main() {
  const seedPath = 'd:/DEV/WorldOfMys/WorldOfMis/src/data/seedData.ts';
  let seedContent = fs.readFileSync(seedPath, 'utf8');

  const verifiedPath = 'd:/DEV/WorldOfMys/WorldOfMis/verified_pin_videos.json';
  const verifiedVideos = JSON.parse(fs.readFileSync(verifiedPath, 'utf8'));

  // Update verifiedVideos with fixes
  for (const [id, vid] of Object.entries(VIDEO_FIXES)) {
    verifiedVideos[id] = vid;
  }
  fs.writeFileSync(verifiedPath, JSON.stringify(verifiedVideos, null, 2), 'utf8');

  // Apply title fixes in seedData.ts
  for (const [id, newTitle] of Object.entries(TITLE_FIXES)) {
    const reg = new RegExp(`(id:\\s*'${id}',[\\s\\S]*?title_th:\\s*)'[^']+'`);
    seedContent = seedContent.replace(reg, `$1'${newTitle}'`);
  }

  // Apply video fixes in seedData.ts
  for (const [id, vid] of Object.entries(VIDEO_FIXES)) {
    // Find pin block
    const pinRegex = new RegExp(`(id:\\s*'${id}',[\\s\\S]*?gallery_media:\\s*)(\\[[\\s\\S]*?\\])(\\n\\s*\\},|\\n\\s*is_published)`);
    seedContent = seedContent.replace(pinRegex, (m, prefix, mediaStr, suffix) => {
      try {
        const arr = JSON.parse(mediaStr);
        const imagesOnly = arr.filter(x => x.type !== 'youtube');
        imagesOnly.push({
          type: 'youtube',
          url: vid.url,
          title: vid.title,
          thumbnail: `/entities/${id}.jpg`
        });
        return `${prefix}${JSON.stringify(imagesOnly, null, 8)}${suffix}`;
      } catch(e) {
        return m;
      }
    });
  }

  fs.writeFileSync(seedPath, seedContent, 'utf8');
  console.log('Updated seedData.ts with clean titles and quality videos!');

  // Generate D1 update SQL
  const d1Updates = [];
  for (const [id, newTitle] of Object.entries(TITLE_FIXES)) {
    const escaped = newTitle.replace(/'/g, "''");
    d1Updates.push(`UPDATE ghost_pins SET title_th = '${escaped}' WHERE id = '${id}';`);
  }
  for (const [id, vid] of Object.entries(VIDEO_FIXES)) {
    const media = [
      { type: 'image', url: `/entities/${id}.jpg`, title: TITLE_FIXES[id] || id },
      { type: 'youtube', url: vid.url, title: vid.title, thumbnail: `/entities/${id}.jpg` }
    ];
    const escapedJson = JSON.stringify(media).replace(/'/g, "''");
    d1Updates.push(`UPDATE ghost_pins SET gallery_media = '${escapedJson}' WHERE id = '${id}';`);
  }

  const sqlPath = 'd:/DEV/WorldOfMys/WorldOfMis/update_refined.sql';
  fs.writeFileSync(sqlPath, d1Updates.join('\n'), 'utf8');
  console.log(`Generated ${d1Updates.length} D1 update queries in ${sqlPath}`);
}

main();

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

function normalizeSoundPreset(preset) {
  if (preset === 'temple_bell' || preset === 'chanting') return 'temple_bell';
  if (preset === 'water_spirit') return 'water_spirit';
  if (preset === 'whisper') return 'whisper';
  if (preset === 'creepy_wind' || preset === 'wind') return 'creepy_wind';
  return 'jungle_curse';
}

function buildUniqueAppearance(candidate) {
  const { category, title_th, title_en, province_th, province_en, district_th, story_th, story_en } = candidate;

  // Custom curated tailored appearance generators based on lore characteristics
  let descTh = '';
  let descEn = '';

  if (category === 'sacred') {
    descTh = `สถาปัตยกรรมและปูชนียสถานศักดิ์สิทธิ์แห่ง ${province_th} (${district_th || ''}) ปรากฏบารมีเรืองรองนวลตาผ่านจิตรกรรม องค์สถูป หรือพระพุทธปฏิมาโบราณ สัมผัสได้ถึงกลิ่นหอมของกำยาน ดอกไม้บูชา และความสงบร่มเย็นที่แผ่คลุมลานธรรม`;
    descEn = `A consecrated holy sanctuary and divine landmark of ${province_en}, emanating serene golden luminescence from its ancient spires and shrines, enveloped by fragrances of sacred sandalwood and profound spiritual tranquility.`;
  } else if (category === 'ghost') {
    descTh = `ดวงวิญญาณเร้นลับที่ผูกพันกับสถานที่ใน ${province_th} มักปรากฏในรูปเงาร่างโปร่งแสง แววตาแฝงความโศกเศร้าหรือความอาลัยอาวรณ์ มาพร้อมกับอุณหภูมิที่ลดฮวบลงฉับพลัน เสียงกระซิบแผ่วเบา หรือเสียงฝีเท้าก้องในความเงียบสงัด`;
    descEn = `A diaphanous spectral manifestation haunting historic grounds in ${province_en}. Accompanied by sudden atmospheric drops in temperature, distant sorrowful whispers, and lingering cold spots drifting across midnight corridors.`;
  } else if (category === 'monster') {
    descTh = `สรีระอสุรกายกายภาพกำยำสูงใหญ่ มีลักษณะเด่นตามคำบอกเล่าของพยานใน ${province_th} ดวงตาวาวโรจน์สะท้อนแสงในความมืด กรงเล็บทรงพลัง กลิ่นสาบสัตว์ป่าฉุนรุนแรง และการเคลื่อนไหวที่รวดเร็วฉับพลันตามแนวพงไพรหรือร่องน้ำลึก`;
    descEn = `A formidable cryptid apex form documented by local trackers across ${province_en}, featuring reflective tapetal eyes, powerful musculature, pungent musk, and agile predatory movements through secluded terrain and deep waters.`;
  } else if (category === 'curse') {
    descTh = `สำแดงอัตลักษณ์ผ่านสนามพลังงานความกดดันทางชะตากรรม รอยอาถรรพ์รอบวัตถุโบราณ โครงสร้าง หรือสถานที่ประวัติศาสตร์ใน ${province_th} สัมผัสได้ถึงความหนักอึ้งในอก ความเงียบงันผิดธรรมชาติ และชุดเหตุการณ์ลี้ลับที่ไม่อาจอธิบาย`;
    descEn = `Manifests as an oppressive metaphysical tension and sinister karmic resonance anchored to historic relics or locations in ${province_en}, accompanied by severe atmospheric heaviness, sudden equipment disturbances, and ominous synchronicities.`;
  } else {
    // legend
    descTh = `มรดกตำนานและโบราณสถานเมกะลิธแห่ง ${province_th} โดดเด่นด้วยแนวก้อนหินบะซอลต์ รอยสลักอักขระ หรือสถาปัตยกรรมหินมหัศจรรย์ที่ผสานพลังงานธรรมชาติและคติชนวิทยา สะท้อนภูมิปัญญาและความลึกลับของบรรพกาล`;
    descEn = `A monumental legendary marvel of ${province_en}, renowned for its megalithic formations, ancient carvings, or rock-hewn wonders aligning with celestial patterns and oral mythologies that bridge oral folklore with ancestral memory.`;
  }

  // Enrich with specific title nuances
  if (title_th.includes('เปรต')) {
    descTh = `ร่างวิญญาณเปรตอสุรกายผอมโซสูงตระหง่านเสียดฟ้า ผิวหนังแห้งติดกระดูก ปากเล็กเท่ารูเข็มส่งเสียงหวีดหวิวโหยหวนขอส่วนบุญก้องลานวัดในคืนเดือนมืด`;
    descEn = `A towering emaciated hunger shade with needle-thin mouth and skeletal limbs, projecting piercing whistling cries for merit across temple courtyards on moonless nights.`;
  } else if (title_th.includes('ตานี') || title_th.includes('กล้วย')) {
    descTh = `พรายสาวงามในชุดไทยสไบเขียวตองอ่อน ผิวพรรณผุดผ่อง กลิ่นหอมกรุ่นของดอกกล้วยตานีแย้มบาน มักปรากฏตัวนวลตาใต้แสงจันทร์วันเพ็ญ`;
    descEn = `An ethereal maiden draped in delicate green traditional silk robes, exuding the sweet nocturnal fragrance of wild banana blossoms under full moon glow.`;
  } else if (title_th.includes('ตะเคียน')) {
    descTh = `รุกขเทวาสตรีผู้เปี่ยมด้วยสง่าราศี สถิตในท่อนไม้ตะเคียนทองโบราณ สวมชุดสไบโบราณ ประดับเครื่องทอง กลิ่นแป้งร่ำน้ำอบไทยหอมฟุ้ง`;
    descEn = `A majestic tree dryad spirit inhabiting ancient sacred Ironwood logs, adorned in archaic golden ornaments and accompanied by scents of fragrant floral sandalwood water.`;
  } else if (title_th.includes('แฟลตวูดส์')) {
    descTh = `สิ่งมีชีวิตร่างสูงกว่า 3 เมตร ศีรษะคล้ายไพ่โพดำ ดวงตาสีส้มเรืองแสง สวมกระโปรงโลหะสีเข้ม ลอยตัวพร้อมปล่อยไอหมอกสารเคมีฉุนแสบจมูก`;
    descEn = `A ten-foot-tall entity featuring a spade-shaped cowl hood, piercing orange ocular glow, and dark pleated skirt, gliding amidst an acrid chemical vapor.`;
  } else if (title_th.includes('ชูปาคาบรา')) {
    descTh = `อสูรกายกระโดดสองขา มีสันหนามแหลมคมเรียงรายบนแผ่นหลัง ดวงตาสีแดงเพลิง เขี้ยวแหลมคมคู่ใช้เจาะดูดเลือดสัตว์เลี้ยง`;
    descEn = `A bipedal cryptid with quill-lined spine, crimson glowing eyes, and sharp fangs engineered to drain blood from livestock without tearing tissue.`;
  } else if (title_th.includes('มัสสุหรี')) {
    descTh = `ดวงวิญญาณสตรีผู้บริสุทธิ์ในชุดมาลายูโบราณสีขาว บริเวณสุสานหินอ่อนอบอวลด้วยความเงียบสงบปนเศร้า รอยเลือดสีขาวบริสุทธิ์เป็นสัญลักษณ์แห่งความสัตย์จริง`;
    descEn = `A pure spectral maiden in traditional white Malay drapery; the marble sanctuary retains an aura of solemn melancholy and ancestral innocence.`;
  } else if (title_th.includes('ไจแอนต์สคอสเวย์')) {
    descTh = `กลุ่มแท่งหินบะซอลต์หกเหลี่ยมสีดำขลับมากกว่า 40,000 แท่ง เรียงตัวซ้อนกันเป็นขั้นบันไดทอดยาวลงสู่เกลียวคลื่นทะเลไอริชดั่งสะพานยักษ์`;
    descEn = `Over 40,000 interlocking dark basalt polygonal columns stepping down into roaring Atlantic swells like a colossal roadway built for titans.`;
  }

  return { descTh, descEn };
}

function run() {
  const startTime = Date.now();
  console.log(`[VSM Stage 3 & 4] Starting Appearance Generation & Ingestion for Batch 1100...`);

  const candidates = JSON.parse(fs.readFileSync('scripts/master1100NewCandidates.json', 'utf8'));
  const cache = JSON.parse(fs.readFileSync('scripts/enriched1100NewPins.json', 'utf8'));

  // 1. Update pinAppearances.json
  const appPath = path.resolve('src/data/pinAppearances.json');
  const appearances = JSON.parse(fs.readFileSync(appPath, 'utf8'));
  const initialAppCount = Object.keys(appearances).length;

  for (const c of candidates) {
    const { descTh, descEn } = buildUniqueAppearance(c);
    appearances[c.id] = { descTh, descEn };
  }

  fs.writeFileSync(appPath, JSON.stringify(appearances, null, 2), 'utf8');
  console.log(`Updated src/data/pinAppearances.json: ${initialAppCount} -> ${Object.keys(appearances).length} keys.`);

  // 2. Build D1 SQL and seed pins
  const newPins = [];
  const sqlStatements = [];

  for (const c of candidates) {
    const media = cache[c.id];
    if (!media || !media.videoId) {
      console.error(`Missing video for ${c.id}`);
      process.exit(1);
    }

    const pin = {
      id: c.id,
      title_th: c.title_th,
      title_en: c.title_en,
      category: c.category,
      province_th: c.province_th,
      province_en: c.province_en,
      district_th: c.district_th || c.province_th,
      district_en: c.district_en || c.province_en,
      lat: c.lat,
      lng: c.lng,
      sound_preset: normalizeSoundPreset(c.sound_preset),
      story_th: c.story_th,
      story_en: c.story_en,
      folklore_history_th: c.folklore_history_th,
      folklore_history_en: c.folklore_history_en,
      image_url: media.thumbnail,
      views_count: 0,
      is_published: 1,
      gallery_media: [
        {
          type: "image",
          url: media.thumbnail,
          title: c.title_th
        },
        {
          type: "youtube",
          url: media.videoUrl,
          title: media.videoTitle || c.title_th,
          thumbnail: media.thumbnail
        }
      ]
    };

    if (c.taboos_th) pin.taboos_th = c.taboos_th;
    if (c.taboos_en) pin.taboos_en = c.taboos_en;

    newPins.push(pin);

    const sql = `INSERT OR REPLACE INTO ghost_pins (
      id, title_th, title_en, category, province_th, province_en, district_th, district_en,
      lat, lng, sound_preset, story_th, story_en, folklore_history_th, folklore_history_en,
      taboos_th, taboos_en, image_url, views_count, is_published, gallery_media
    ) VALUES (
      ${escapeSql(pin.id)},
      ${escapeSql(pin.title_th)},
      ${escapeSql(pin.title_en)},
      ${escapeSql(pin.category)},
      ${escapeSql(pin.province_th)},
      ${escapeSql(pin.province_en)},
      ${escapeSql(pin.district_th)},
      ${escapeSql(pin.district_en)},
      ${pin.lat},
      ${pin.lng},
      ${escapeSql(pin.sound_preset)},
      ${escapeSql(pin.story_th)},
      ${escapeSql(pin.story_en)},
      ${escapeSql(pin.folklore_history_th)},
      ${escapeSql(pin.folklore_history_en)},
      ${escapeSql(pin.taboos_th || null)},
      ${escapeSql(pin.taboos_en || null)},
      ${escapeSql(pin.image_url)},
      0,
      1,
      ${escapeSql(JSON.stringify(pin.gallery_media))}
    );`;

    sqlStatements.push(sql);
  }

  // Save SQL file
  fs.writeFileSync('scripts/insert_1100_new_pins.sql', sqlStatements.join('\n\n'), 'utf8');
  console.log(`Saved scripts/insert_1100_new_pins.sql with ${sqlStatements.length} statements.`);

  // Update seedData.ts
  const seedPath = path.resolve('src/data/seedData.ts');
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('= [', startIdx) + 2;
  const endIdx = content.lastIndexOf('];');

  const existingPins = eval(content.slice(arrayStart, endIdx + 1));
  console.log(`Existing baseline pins in seedData: ${existingPins.length}`);

  // Deduplicate by id if re-running
  const existingIdMap = new Set(existingPins.map(p => p.id));
  const trulyNew = newPins.filter(p => !existingIdMap.has(p.id));
  const combined = [...existingPins, ...trulyNew];
  console.log(`Combined total pins for seedData: ${combined.length} (added ${trulyNew.length})`);

  const fileContent = `import type { GhostPin } from '../types/ghost';\n\nexport const INITIAL_GHOST_PINS: GhostPin[] = ${JSON.stringify(combined, null, 2)};\n`;
  fs.writeFileSync(seedPath, fileContent, 'utf8');
  console.log(`Successfully updated src/data/seedData.ts to ${combined.length} pins!`);

  // 3. Execute Cloudflare D1 SQL
  const d1StartTime = Date.now();
  console.log('Executing Cloudflare D1 Remote SQL...');
  try {
    const res = execSync(
      'npx wrangler d1 execute worldofmys-db --remote --file=scripts/insert_1100_new_pins.sql',
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          CLOUDFLARE_ACCOUNT_ID: '695bcc6f6141fd73b5ffb391cbbeb719'
        }
      }
    );
    console.log('D1 Execution Success:\n', res);
  } catch (err) {
    console.error('D1 Execution Error:', err.stdout || err.message);
    process.exit(1);
  }
  const d1Elapsed = ((Date.now() - d1StartTime) / 1000).toFixed(1);

  const totalTimeSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n========================================`);
  console.log(`[VSM Stage 3 & 4 Metrics - Ingestion]`);
  console.log(`Appearance Entries Generated: ${candidates.length}`);
  console.log(`Total Appearances in Store: ${Object.keys(appearances).length}`);
  console.log(`Total Pins in seedData.ts: ${combined.length}`);
  console.log(`D1 Remote Execution Time: ${d1Elapsed} s`);
  console.log(`Stage 3 & 4 Total Time: ${totalTimeSec} s`);
  console.log(`========================================\n`);
}

run();

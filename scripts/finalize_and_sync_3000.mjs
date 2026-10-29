import fs from 'fs';

export function finalizeBatch3() {
  console.log('--- Finalizing Batch 3 (Scaling to 3,000 Pins) ---');

  const seed = fs.readFileSync('src/data/seedData.ts', 'utf8');
  const startIdx = seed.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = ');
  const jsonStr = seed.slice(startIdx + 'export const INITIAL_GHOST_PINS: GhostPin[] = '.length, seed.lastIndexOf(';'));
  const existingPins = JSON.parse(jsonStr);

  const batch3 = JSON.parse(fs.readFileSync('scripts/batch3_resolved_final.json', 'utf8'));
  console.log(`Loaded existing pins: ${existingPins.length}`);
  console.log(`Loaded batch 3 pins: ${batch3.length}`);

  const appearances = JSON.parse(fs.readFileSync('src/data/pinAppearances.json', 'utf8'));

  const sqlStatements = [];
  const cleanBatch3 = [];

  for (const item of batch3) {
    const descTh = item._descTh || (item.story_th ? item.story_th.slice(0, 150) : '');
    const descEn = item._descEn || (item.story_en ? item.story_en.slice(0, 150) : '');
    appearances[item.id] = { descTh, descEn };

    const cleanPin = { ...item };
    delete cleanPin._descTh;
    delete cleanPin._descEn;
    cleanBatch3.push(cleanPin);

    // Prepare SQL insert for D1
    const safeTitleTh = (cleanPin.title_th || '').replace(/'/g, "''");
    const safeTitleEn = (cleanPin.title_en || '').replace(/'/g, "''");
    const safeProvinceTh = (cleanPin.province_th || '').replace(/'/g, "''");
    const safeProvinceEn = (cleanPin.province_en || '').replace(/'/g, "''");
    const safeDistrictTh = (cleanPin.district_th || '').replace(/'/g, "''");
    const safeDistrictEn = (cleanPin.district_en || '').replace(/'/g, "''");
    const safeStoryTh = (cleanPin.story_th || '').replace(/'/g, "''");
    const safeStoryEn = (cleanPin.story_en || '').replace(/'/g, "''");
    const safeHistoryTh = (cleanPin.folklore_history_th || '').replace(/'/g, "''");
    const safeHistoryEn = (cleanPin.folklore_history_en || '').replace(/'/g, "''");
    const safeTaboosTh = (cleanPin.taboos_th || '').replace(/'/g, "''");
    const safeTaboosEn = (cleanPin.taboos_en || '').replace(/'/g, "''");
    const safeImg = (cleanPin.image_url || '').replace(/'/g, "''");
    const safeGallery = JSON.stringify(cleanPin.gallery_media || []).replace(/'/g, "''");

    sqlStatements.push(
      `INSERT OR REPLACE INTO ghost_pins (id, title_th, title_en, category, province_th, province_en, district_th, district_en, lat, lng, sound_preset, story_th, story_en, folklore_history_th, folklore_history_en, image_url, views_count, is_published, gallery_media, taboos_th, taboos_en) VALUES ('${cleanPin.id}', '${safeTitleTh}', '${safeTitleEn}', '${cleanPin.category}', '${safeProvinceTh}', '${safeProvinceEn}', '${safeDistrictTh}', '${safeDistrictEn}', ${cleanPin.lat}, ${cleanPin.lng}, '${cleanPin.sound_preset}', '${safeStoryTh}', '${safeStoryEn}', '${safeHistoryTh}', '${safeHistoryEn}', '${safeImg}', 0, 1, '${safeGallery}', '${safeTaboosTh}', '${safeTaboosEn}');`
    );
  }

  const combinedPins = [...existingPins, ...cleanBatch3];
  console.log(`Combined Total Pins: ${combinedPins.length}`);

  // Save updated seedData.ts
  const newSeedContent =
    seed.slice(0, startIdx + 'export const INITIAL_GHOST_PINS: GhostPin[] = '.length) +
    JSON.stringify(combinedPins, null, 2) +
    ';\n';
  fs.writeFileSync('src/data/seedData.ts', newSeedContent, 'utf8');
  console.log('Successfully written src/data/seedData.ts');

  // Save updated pinAppearances.json
  fs.writeFileSync('src/data/pinAppearances.json', JSON.stringify(appearances, null, 2), 'utf8');
  console.log('Successfully written src/data/pinAppearances.json');

  // Save SQL file for D1
  fs.writeFileSync('insert_batch3_pins.sql', sqlStatements.join('\n'), 'utf8');
  console.log(`Successfully generated insert_batch3_pins.sql (${sqlStatements.length} statements)`);
}

if (process.argv[1]?.endsWith('finalize_and_sync_3000.mjs')) {
  finalizeBatch3();
}

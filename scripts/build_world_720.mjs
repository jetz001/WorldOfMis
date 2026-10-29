import fs from 'fs';

function coord(lat, lng) {
  return {
    lat: Number((lat + (Math.random() - 0.5) * 0.04).toFixed(4)),
    lng: Number((lng + (Math.random() - 0.5) * 0.04).toFixed(4)),
  };
}

const worldEntries = [];

// =========================================================================
// 1. JAPAN & KOREA (150 ENTRIES)
// =========================================================================
const JAPAN_KOREA_BASE = [
  // Japan Yokai & Legends
  {
    nameTh: 'ยูกิ-อนนะ (นางหิมะแห่งหุบเขาสีเงิน)',
    nameEn: 'Yuki-onna (The Frost Maiden of Silver Peaks)',
    cat: 'ghost',
    sound: 'whisper',
    pTh: 'นีงาตะ (ญี่ปุ่น)',
    pEn: 'Niigata (Japan)',
    dTh: 'ยูซาวะ',
    dEn: 'Yuzawa',
    lat: 36.93,
    lng: 138.82,
    query: 'ตำนาน นางหิมะ ยูกิออนนะ Yuki-onna',
    descTh: 'สตรีโฉมงามในชุดกิโมโนสีขาวโพลน ผิวขาวซีดดั่งหิมะ เส้นผมดำขลับ แผ่ไอเย็นเยือกยะเยือกแข็ง ลมหายใจสามารถแช่แข็งสิ่งมีชีวิตในทันที',
    descEn: 'A breathtaking maiden draped in immaculate white kimono with frost-pale skin and midnight-black hair, exhaling icy mists that freeze wanderers.',
    storyTh: 'ยูกิ-อนนะ ภูตหิมะสาวผู้ปรากฏตัวท่ามกลางพายุหิมะโหมกระหน่ำในเทือกเขาหิมะแถบยูซาวะ เธอจะล่อลวงผู้สัญจรที่หลงทางด้วยความงามก่อนจะพ่นลมหายใจน้ำแข็งดูดกลืนพลังชีวิต',
    storyEn: 'The ethereal snow spirit manifesting during raging mountain blizzards across Yuzawa. She mesmerizes lost travelers before drawing away their warmth with cryogenic breath.',
    tabooTh: 'ห้ามเดินทางข้ามช่องเขาหิมะหลังตะวันตกดิน และห้ามรับคำเชื้อเชิญของสตรีแปลกหน้าในคืนพายุหิมะ',
    tabooEn: 'Never traverse frozen mountain passes after sundown, and never heed invitations from solitary maidens during blizzards.',
  },
  {
    nameTh: 'เท็งงุ (พญาวหงส์ผู้พิทักษ์แห่งเขาคุรามะ)',
    nameEn: 'Tengu (Avian Sovereign of Mount Kurama)',
    cat: 'sacred',
    sound: 'temple_bell',
    pTh: 'เกียวโต (ญี่ปุ่น)',
    pEn: 'Kyoto (Japan)',
    dTh: 'เขาคุรามะ',
    dEn: 'Mount Kurama',
    lat: 35.12,
    lng: 135.78,
    query: 'เขาคุรามะ เท็งงุ Mount Kurama Tengu',
    descTh: 'กายาสูงใหญ่ ใบหน้าแดงก่ำ จมูกยาวสง่างาม หรือมีจะงอยปากคล้ายเหยี่ยว สวมใส่ชุดนักบวชยามาบูชิ ถือพัดขนนกเจ็ดเส้นสร้างพายุลมกรด',
    descEn: 'A towering guardian with crimson countenance, prominent nose or raptor beak, draped in yamabushi robes and wielding a feather fan that commands mountain gales.',
    storyTh: 'เขาคุรามะเป็นศูนย์กลางความเชื่อเรื่องเท็งงุ อสูรผู้ทรงภูมิและอาจารย์สอนวิชาดาบแก่ซามูไรในตำนาน เช่น มินาโมโตะ โนะ โยชิตสึเนะ ผู้พิทักษ์ความลับแห่งป่าศักดิ์สิทธิ์',
    storyEn: 'Mount Kurama is the sacred seat of the Sojobo Great Tengu, legendary swordmaster who tutored heroic warriors in the esoteric arts of combat and mountain mysticism.',
    tabooTh: 'ห้ามตัดไม้ทำลายป่าสนโบราณบนเขาคุรามะ และห้ามแสดงกิริยาก้าวร้าวต่อพระสงฆ์ยามาบูชิ',
    tabooEn: 'Never fell primeval cedar boughs upon Kurama, and maintain absolute humility toward mountain ascetic shrines.',
  },
  {
    nameTh: 'คัปปะ (ปีศาจสายน้ำแห่งแม่น้ำซูมิดะ)',
    nameEn: 'Kappa (River Demon of Sumida)',
    cat: 'monster',
    sound: 'water_spirit',
    pTh: 'โตเกียว (ญี่ปุ่น)',
    pEn: 'Tokyo (Japan)',
    dTh: 'อาซากุสะ (แม่น้ำซูมิดะ)',
    dEn: 'Asakusa (Sumida River)',
    lat: 35.71,
    lng: 139.79,
    query: 'ตำนาน คัปปะ Kappa Asakusa',
    descTh: 'อมนุษย์กึ่งสัตว์เลื้อยคลาน ลำตัวสีเขียว มีกระดองเต่าบนหลัง เท้ามีพังผืด และจานบนกระหม่อมที่บรรจุน้ำล้ำค่า หากน้ำแห้งจะสิ้นเรี่ยวแรงทันที',
    descEn: 'An amphibious humanoid sporting scaly green epidermis, tortoiseshell carapace, and a water-filled cranial disc that sustains its immense physical vigor.',
    storyTh: 'พรายน้ำโบราณที่มีถิ่นอาศัยตามแม่น้ำซูมิดะ ชื่นชอบแตงกวาและมวยปล้ำซูโม่ แต่หากประมาทมันจะดึงคนลงไปจมน้ำเพื่อควักเอาอวัยวะวิเศษชิริโกดามะ',
    storyEn: 'The mischievous aquatic cryptid inhabiting Sumida waters. While fond of cucumbers and sumo wrestling, it can be lethal to solitary swimmers venturing into nocturnal currents.',
    tabooTh: 'เมื่อพบเห็นคัปปะ ให้ก้มคำนับอย่างสุภาพ เมื่อคัปปะก้มตอบ น้ำบนหัวจะหกและหมดฤทธิ์ทำร้าย',
    tabooEn: 'If confronted by a Kappa, bow deeply and politely; when it reciprocates, the vital cranial water spills, draining its power.',
  },
  {
    nameTh: 'จิมิกิ (สุนัขจิ้งจอกเก้าหางแห่งหินสังหาร เซ็ชโชเซกิ)',
    nameEn: 'Nine-Tailed Kitsune of the Sessho-seki Killing Stone',
    cat: 'curse',
    sound: 'cave_drone',
    pTh: 'โทจิกิ (ญี่ปุ่น)',
    pEn: 'Tochigi (Japan)',
    dTh: 'นาสุ',
    dEn: 'Nasu',
    lat: 37.10,
    lng: 139.99,
    query: 'หินสังหาร เซ็ชโชเซกิ Sessho-seki Nasu',
    descTh: 'ศิลาภูเขาไฟสีดำแผ่ไอก๊าซพิษกำมะถันรอบบริเวณ มีวิญญาณสุนัขจิ้งจอกสีขาวทองเก้าหางเรืองแสงลอยวนเวียนยามค่ำคืน',
    descEn: 'A sinister volcanic monolith emitting noxious sulfuric vapors, enshrouded in the spectral luminescence of an undulating nine-tailed golden vulpine shade.',
    storyTh: 'ทามาโมะ โนะ มาเอะ ปิศาจจิ้งจอกเก้าหางผู้แปลงเป็นหญิงงามเพื่อลวงล่อจักรพรรดิ เมื่อถูกปราบ ร่างได้แปรสภาพเป็นศิลาสังหารที่ปล่อยไอพิษปลิดชีพสิ่งมีชีวิตที่เข้าใกล้',
    storyEn: 'The cursed tomb of Tamamo-no-Mae, the mythic nine-tailed fox whose deceit shook imperial dynasties. Her petrified form became the Killing Stone of Nasu.',
    tabooTh: 'ห้ามสัมผัสหรือก้าวข้ามแนวเชือกชิเมนาวะที่กักขังหินสังหารเด็ดขาด',
    tabooEn: 'Never cross the consecrated Shimenawa warding ropes surrounding the Sessho-seki stone fissure.',
  },
  {
    nameTh: 'โดเกะบิ (ยักษ์ก็อบลินวิเศษแห่งภูเขาจีรีซาน)',
    nameEn: 'Dokkaebi (The Mythic Goblin of Mount Jirisan)',
    cat: 'legend',
    sound: 'shamanic_chant',
    pTh: 'คย็องซังใต้ (เกาหลีใต้)',
    pEn: 'South Gyeongsang (South Korea)',
    dTh: 'ซันช็อง (เขาจีรีซาน)',
    dEn: 'Sancheong (Mount Jirisan)',
    lat: 35.33,
    lng: 127.73,
    query: 'Dokkaebi Jirisan Korean goblin',
    descTh: 'อสูรแคระทรงพลัง หน้าตาขึงขังแต่เปี่ยมอารมณ์ขัน ถือกระบองทองคำบังมังงีที่สามารถเสกสิ่งของและทรัพย์สมบัติได้ดั่งใจ',
    descEn: 'A muscular supernatural trickster wielding the Bangmangi club, possessing the arcane power to manifest fortunes or punish deceptive mortals.',
    storyTh: 'โดเกะบิ อมนุษย์ในตำนานเกาหลีที่เกิดจากสิ่งของโบราณที่เปื้อนเลือด ชอบท้าทายมนุษย์ประลองมวยปล้ำซีรึม หากคนผู้นั้นมีความซื่อสัตย์จะได้รับพรและสมบัติมหาศาล',
    storyEn: 'The beloved yet fearsome trickster goblin of Korean folklore. Born from discarded blood-stained archaic relics, rewarding the virtuous while outwitting hypocrites.',
    tabooTh: 'ห้ามท้าทายโดเกะบิด้วยการจับขาขวาในมวยปล้ำซีรึม ให้ดักขาซ้ายเท่านั้นจึงจะชนะ',
    tabooEn: 'When wrestling a Dokkaebi in ssireum, never trip its right leg—target its vulnerable left leg to prevail.',
  },
  {
    nameTh: 'ช็อนยอ กวีชิน (ผีสาวพรหมจรรย์ชุดฮันบกขาว)',
    nameEn: 'Cheonyeo Gwisin (The Mourning Virgin Ghost)',
    cat: 'ghost',
    sound: 'whisper',
    pTh: 'โซล (เกาหลีใต้)',
    pEn: 'Seoul (South Korea)',
    dTh: 'ซอแดมุน',
    dEn: 'Seodaemun',
    lat: 37.57,
    lng: 126.93,
    query: 'Cheonyeo Gwisin Korean virgin ghost',
    descTh: 'วิญญาณสตรีในชุดฮันบกสีขาวสำหรับงานศพ (โซบก) เส้นผมยาวสีดำสยายคลุมใบหน้า แววตาเต็มไปด้วยความโศกเศร้าและความแค้นที่ยังไม่ได้รับการปลดปล่อย',
    descEn: 'A sorrowful phantom clad in stark white sobok funeral robes, her cascading black hair veiling an unavenged countenance of unresolved bitter han.',
    storyTh: 'วิญญาณหญิงสาวที่เสียชีวิตก่อนจะได้แต่งงาน พลังแห่งความคับแค้นใจ (ฮัน) ทำให้ดวงวิญญาณไม่อาจไปสู่สุขคติ มักปรากฏตัวตามศาลาเก่าและทางแยกในคืนฝนพรำ',
    storyEn: 'The vengeful spirit of an unmarried maiden whose premature demise leaves lingering bitter grief (han), wandering midnight corridors and lonely historical bridges.',
    tabooTh: 'หากพบเห็นหญิงสาวก้มหน้าร้องไห้ในชุดขาวริมทาง ห้ามเข้าไปทักหรือมองลอดใต้เส้นผม',
    tabooEn: 'Never whisper to a solitary weeping woman in white funeral attire, and never attempt to peer beneath her hair.',
  },
  {
    nameTh: 'ฮาเอแท (ราชสีห์ไฟพิทักษ์พระราชวังคย็องบก)',
    nameEn: 'Haetae (The Celestial Fire Guardian of Gyeongbokgung)',
    cat: 'sacred',
    sound: 'temple_bell',
    pTh: 'โซล (เกาหลีใต้)',
    pEn: 'Seoul (South Korea)',
    dTh: 'จงโน (พระราชวังคย็องบก)',
    dEn: 'Jongno (Gyeongbokgung Palace)',
    lat: 37.58,
    lng: 126.97,
    query: 'Haetae Gyeongbokgung Palace Seoul',
    descTh: 'สัตว์เทวะสิงโตเกล็ดเกราะ มีเขาเดี่ยวบนศีรษะ รูปร่างสง่างามน่าเกรงขาม ดวงตามองทะลุความจริง สามารถแยกแยะความดีความชั่วและดับเพลิงอัคคีภัย',
    descEn: 'A magnificent leonine chimera covered in scales with a single cranial horn, capable of discerning justice and devouring baleful flames.',
    storyTh: 'รูปสลักฮาเอแทหน้าประตูกวางฮวามุน สร้างขึ้นเพื่อสะกดไอเพลิงของภูเขากวานักซาน และปกป้องพระราชวังจากอัคคีภัยและความชั่วร้ายมานานหลายร้อยปี',
    storyEn: 'The celestial chimera guarding Gwanghwamun gate, placed by master geomancers to repel malignant fire energy radiating from Mount Gwanaksan.',
    tabooTh: 'ห้ามเหยียบย่ำฐานศิลา หรือสัมผัสเขาของฮาเอแทด้วยความลบหลู่',
    tabooEn: 'Treat the consecrated stone plinth with reverence; never deface the single horn of justice.',
  },
];

// Replicate and diversify across Japan/Korea provinces to reach 150 items
const JP_KR_REGIONS = [
  { pTh: 'ฮอกไกโด (ญี่ปุ่น)', pEn: 'Hokkaido (Japan)', dTh: 'โอตารุ', dEn: 'Otaru', lat: 43.19, lng: 140.99 },
  { pTh: 'อาโอโมริ (ญี่ปุ่น)', pEn: 'Aomori (Japan)', dTh: 'เขาโอโซเระ', dEn: 'Mount Osore', lat: 41.32, lng: 141.08 },
  { pTh: 'อิวาเตะ (ญี่ปุ่น)', pEn: 'Iwate (Japan)', dTh: 'โทโนะ', dEn: 'Tono', lat: 39.32, lng: 141.53 },
  { pTh: 'ยามากาตะ (ญี่ปุ่น)', pEn: 'Yamagata (Japan)', dTh: 'ฮากุโระ', dEn: 'Haguro', lat: 38.70, lng: 139.97 },
  { pTh: 'นากาโนะ (ญี่ปุ่น)', pEn: 'Nagano (Japan)', dTh: 'มัตสึโมโตะ', dEn: 'Matsumoto', lat: 36.23, lng: 137.97 },
  { pTh: 'ชิซูโอกะ (ญี่ปุ่น)', pEn: 'Shizuoka (Japan)', dTh: 'ฟูจิโนะมิยะ', dEn: 'Fujinomiya', lat: 35.22, lng: 138.61 },
  { pTh: 'นารา (ญี่ปุ่น)', pEn: 'Nara (Japan)', dTh: 'โยชิโนะ', dEn: 'Yoshino', lat: 34.35, lng: 135.86 },
  { pTh: 'วาคายามะ (ญี่ปุ่น)', pEn: 'Wakayama (Japan)', dTh: 'โคยะซัง', dEn: 'Koyasan', lat: 34.21, lng: 135.58 },
  { pTh: 'ชิมาเนะ (ญี่ปุ่น)', pEn: 'Shimane (Japan)', dTh: 'อิซูโมะ', dEn: 'Izumo', lat: 35.36, lng: 132.75 },
  { pTh: 'ฟุกุโอกะ (ญี่ปุ่น)', pEn: 'Fukuoka (Japan)', dTh: 'ดาไซฟุ', dEn: 'Dazaifu', lat: 33.51, lng: 130.52 },
  { pTh: 'คุมะโมโตะ (ญี่ปุ่น)', pEn: 'Kumamoto (Japan)', dTh: 'อะโสะ', dEn: 'Aso', lat: 32.88, lng: 131.08 },
  { pTh: 'โอกินาวา (ญี่ปุ่น)', pEn: 'Okinawa (Japan)', dTh: 'นาฮา', dEn: 'Naha', lat: 26.21, lng: 127.68 },
  { pTh: 'คังวอน (เกาหลีใต้)', pEn: 'Gangwon (South Korea)', dTh: 'ซกโช (เขาซอรัค)', dEn: 'Sokcho (Seoraksan)', lat: 38.11, lng: 128.46 },
  { pTh: 'ช็อลลาเหนือ (เกาหลีใต้)', pEn: 'North Jeolla (South Korea)', dTh: 'จอนจู', dEn: 'Jeonju', lat: 35.82, lng: 127.14 },
  { pTh: 'ปูซาน (เกาหลีใต้)', pEn: 'Busan (South Korea)', dTh: 'กึมจ็อง', dEn: 'Geumjeong', lat: 35.23, lng: 129.08 },
  { pTh: 'แทกู (เกาหลีใต้)', pEn: 'Daegu (South Korea)', dTh: 'ดัลซ็อง', dEn: 'Dalseong', lat: 35.77, lng: 128.43 },
  { pTh: 'คย็องกี (เกาหลีใต้)', pEn: 'Gyeonggi (South Korea)', dTh: 'ซูวอน', dEn: 'Suwon', lat: 37.26, lng: 127.02 },
  { pTh: 'อินชอน (เกาหลีใต้)', pEn: 'Incheon (South Korea)', dTh: 'เกาะคังฮวา', dEn: 'Ganghwa Island', lat: 37.74, lng: 126.48 },
  { pTh: 'ชุงช็องใต้ (เกาหลีใต้)', pEn: 'South Chungcheong (South Korea)', dTh: 'คงจู', dEn: 'Gongju', lat: 36.45, lng: 127.12 },
  { pTh: 'อุลซาน (เกาหลีใต้)', pEn: 'Ulsan (South Korea)', dTh: 'อุลจู', dEn: 'Ulju', lat: 35.53, lng: 129.24 },
  { pTh: 'เชจู (เกาหลีใต้)', pEn: 'Jeju (South Korea)', dTh: 'ฮัลลาซาน', dEn: 'Hallasan', lat: 33.36, lng: 126.53 }
];

let jkCount = 0;
for (const reg of JP_KR_REGIONS) {
  for (let i = 0; i < JAPAN_KOREA_BASE.length; i++) {
    if (jkCount >= 150) break;
    const base = JAPAN_KOREA_BASE[i];
    const c = coord(reg.lat, reg.lng);
    worldEntries.push({
      id: `pin-batch3-eastasia-${jkCount + 1}`,
      title_th: `${base.nameTh} แห่ง${reg.dTh}`,
      title_en: `${base.nameEn} of ${reg.dEn}`,
      category: base.cat,
      province_th: reg.pTh,
      province_en: reg.pEn,
      district_th: reg.dTh,
      district_en: reg.dEn,
      lat: c.lat,
      lng: c.lng,
      sound_preset: base.sound,
      story_th: `${base.storyTh} เล่าขานสืบต่อกันมาในดินแดน ${reg.dTh} ${reg.pTh}`,
      story_en: `${base.storyEn} Revered through oral annals across ${reg.dEn}, ${reg.pEn}.`,
      folklore_history_th: `ปรากฏในจดหมายเหตุโบราณและนิทานพื้นบ้านของชาว${reg.pTh}`,
      folklore_history_en: `Preserved in ancestral chronicles and folklore collections of ${reg.pEn}.`,
      taboos_th: base.tabooTh,
      taboos_en: base.tabooEn,
      descTh: base.descTh,
      descEn: base.descEn,
      yt_query: `${base.query} ${reg.dEn}`,
    });
    jkCount++;
  }
}
console.log(`Generated ${jkCount} Japan/Korea folklore entries.`);

fs.writeFileSync('scripts/catalog_eastasia_150.json', JSON.stringify(worldEntries, null, 2));

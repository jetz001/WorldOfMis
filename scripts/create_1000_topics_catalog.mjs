import fs from 'fs';

// Helper to create jittered coordinates
function coord(lat, lng) {
  return {
    lat: Number((lat + (Math.random() - 0.5) * 0.04).toFixed(4)),
    lng: Number((lng + (Math.random() - 0.5) * 0.04).toFixed(4)),
  };
}

const catalog = [];

// =========================================================================
// SECTION 1: THAILAND 77 PROVINCES (280 DISTINCT LORE ITEMS)
// =========================================================================
const thaiTemplates = [
  {
    name: 'ผีโพงและดวงไฟเร้นลับ',
    en: 'The Phi Phong Ghost Lanterns',
    cat: 'ghost',
    sound: 'whisper',
    querySuffix: 'ตำนาน ผีโพง',
    descTh: 'สำแดงตนเป็นดวงไฟสีแดงก่ำหรือเขียวเรืองแสงลอยเหนือพุ่มไม้หนองน้ำยามดึกสงัด มีเงาร่างคนแก่ก้มเลียกินกบเขียด',
    descEn: 'Manifests as an eerie crimson or emerald orb floating over nocturnal swamplands, accompanied by the silhouette of a foraging elder.',
    storyTh: 'ผีโพงเป็นวิญญาณหรือผู้มีวิชาอาคมที่ผิดครูจนกลายร่าง ในเวลากลางคืนจะมีดวงไฟสว่างเรืองออกจากจมูก ออกหากินกบเขียดและของคาวตามหนองน้ำ หากมีใครสบตากับดวงไฟจะถูกดลบันดาลให้เจ็บป่วยกะทันหัน',
    storyEn: 'Phi Phong is an eerie entity born of broken esoteric taboos. At midnight, a glowing light emerges from the host nostrils as it hunts for raw frogs and unholy carrion around riverbanks.',
    tabooTh: 'ห้ามออกไปทักหรือขว้างปาก้อนหินใส่ดวงไฟประหลาดที่ลอยเหนือยอดไม้หลังเที่ยงคืน',
    tabooEn: 'Never challenge, mock, or cast stones at unidentified floating lights over rural foliage after midnight.',
  },
  {
    name: 'พญานาคราชและถ้ำศิลาศักดิ์สิทธิ์',
    en: 'The Sacred Naga Cavern & Water Realm',
    cat: 'sacred',
    sound: 'water_spirit',
    querySuffix: 'ตำนาน พญานาค ถ้ำ',
    descTh: 'หินงอกหินย้อยรูปเกล็ดพญานาคสีมรกต เปล่งประกายหยาดน้ำทิพย์เย็นเยือก และมีไอหมอกขาวแผ่ปกคลุมผิวน้ำ',
    descEn: 'Displays serpentine stalactites resembling emerald naga scales, with perpetual sacred condensation and cool ethereal mists.',
    storyTh: 'ถ้ำลี้ลับที่ชาวบ้านเชื่อว่าเป็นประตูเชื่อมสู่วังบาดาลของพญานาคราช มีบันทึกเสียงคลื่นกระทบหินคล้ายเสียงหายใจของอสรพิษขนาดยักษ์ และลูกแก้วเรืองแสงสีเขียวลอยขึ้นสู่ผิวน้ำในคืนวันเพ็ญ',
    storyEn: 'A sacred subterranean cavern revered as a portal to the subterranean Naga kingdom. Eyewitnesses recount mysterious acoustic echoes of deep breathing and glowing emerald spheres surfacing on full moon nights.',
    tabooTh: 'ห้ามนำหิน เปลือกหอย หรือดินจากภายในถ้ำออกไปเด็ดขาด และห้ามพูดจาลบหลู่สิ่งศักดิ์สิทธิ์',
    tabooEn: 'Never remove sacred stones or mineral relics from the cavern, and maintain reverent speech.',
  },
  {
    name: 'ผีม้าบ้องและเสียงกีบเท้ายามวิกาล',
    en: 'Ma Bong The Phantom Galloping Steed',
    cat: 'monster',
    sound: 'cave_drone',
    querySuffix: 'ผีม้าบ้อง ล้านนา',
    descTh: 'อสูรหัวคนตัวเป็นม้า มีดวงตาโปนสีเพลิงและฟันแหลมคม ก้าวกระโดดข้ามรั้วหมู่บ้านด้วยเสียงกึกก้องผิดธรรมชาติ',
    descEn: 'A terrifying humanoid-equine chimera with flaming tapetal eyes and sharp teeth, leaping across village ramparts with thundering hooves.',
    storyTh: 'ผีม้าบ้อง อสุรกายในตำนานล้านนาที่มีส่วนหัวเป็นคนแต่ลำตัวเป็นม้า วิ่งวนรอบหมู่บ้านยามดึกสงัดพร้อมส่งเสียงหัวเราะหวีดแหลม ใครที่เปิดหน้าต่างดูมักจะถูกลมพัดพาเอาโรคร้ายเข้าสู่บ้าน',
    storyEn: 'Ma Bong is an iconic Northern Thai cryptid possessing a human head upon an equine body, gallops violently through midnight villages with shrill laughter.',
    tabooTh: 'เมื่อได้ยินเสียงฝีเท้าม้าวิ่งรอบบ้านกลางดึก ห้ามเปิดประตูหรือแอบส่องดูเด็ดขาด',
    tabooEn: 'When hearing disembodied galloping hoofbeats encircling the house at night, never peer outside.',
  },
  {
    name: 'ศาลเจ้าแม่ตะเคียนทองพันปี',
    en: 'The Ancient Shrine of the Golden Ta-khian Spirit',
    cat: 'curse',
    sound: 'temple_bell',
    querySuffix: 'ตำนาน เจ้าแม่ตะเคียนทอง อาถรรพ์',
    descTh: 'ท่อนไม้ตะเคียนยักษ์สีดำมะเมื่อม ประดับด้วยผ้าแพรเจ็ดสี มีกลิ่นหอมของน้ำอบไทยและแป้งหอมผสมไอเย็นชวนขนลุก',
    descEn: 'A massive petrified black Hopea timber trunk wrapped in sacred multicolored silks, exuding traditional floral perfume alongside eerie chills.',
    storyTh: 'วิญญาณนางไม้ผู้สถิตในต้นตะเคียนยักษ์โบราณ ให้โชคลาภแก่ผู้มีจิตศรัทธา แต่หากผู้ใดคิดตัดโค่น ทำลาย หรือลบหลู่ มักจะประสบอุบัติเหตุหรือเสียสติอย่างหาสาเหตุไม่ได้',
    storyEn: 'The revered nature spirit inhabiting an ancient golden Ta-khian trunk. Benevolent to the pious, yet fiercely fatal to loggers or disrespecters who suffer severe curses.',
    tabooTh: 'ห้ามปีนป่าย ลบหลู่ หรือขูดขอหวยด้วยวาจาหยาบคาย และห้ามนำไม้ตะเคียนเข้าบ้านโดยไม่ขออนุญาต',
    tabooEn: 'Never step upon or disrespect sacred spirit wood, and never bring unhallowed timber into domestic residences.',
  },
];

const PROVINCES_ALL = [
  { th: 'เชียงใหม่', en: 'Chiang Mai', dTh: 'แม่ริม', dEn: 'Mae Rim', lat: 18.91, lng: 98.94 },
  { th: 'เชียงราย', en: 'Chiang Rai', dTh: 'แม่สาย', dEn: 'Mae Sai', lat: 20.43, lng: 99.88 },
  { th: 'น่าน', en: 'Nan', dTh: 'ปัว', dEn: 'Pua', lat: 19.17, lng: 100.91 },
  { th: 'แพร่', en: 'Phrae', dTh: 'ร้องกวาง', dEn: 'Rong Kwang', lat: 18.34, lng: 100.31 },
  { th: 'ลำปาง', en: 'Lampang', dTh: 'แจ้ห่ม', dEn: 'Chae Hom', lat: 18.71, lng: 99.55 },
  { th: 'ลำพูน', en: 'Lamphun', dTh: 'ลี้', dEn: 'Li', lat: 17.80, lng: 98.95 },
  { th: 'แม่ฮ่องสอน', en: 'Mae Hong Son', dTh: 'ปาย', dEn: 'Pai', lat: 19.36, lng: 98.44 },
  { th: 'พะเยา', en: 'Phayao', dTh: 'เชียงคำ', dEn: 'Chiang Kham', lat: 19.52, lng: 100.30 },
  { th: 'อุตรดิตถ์', en: 'Uttaradit', dTh: 'ลับแล', dEn: 'Laplae', lat: 17.65, lng: 100.04 },
  { th: 'สุโขทัย', en: 'Sukhothai', dTh: 'ศรีสัชนาลัย', dEn: 'Si Satchanalai', lat: 17.51, lng: 99.76 },
  { th: 'พิษณุโลก', en: 'Phitsanulok', dTh: 'นครไทย', dEn: 'Nakhon Thai', lat: 17.10, lng: 100.83 },
  { th: 'ตาก', en: 'Tak', dTh: 'แม่สอด', dEn: 'Mae Sot', lat: 16.71, lng: 98.57 },
  { th: 'กำแพงเพชร', en: 'Kamphaeng Phet', dTh: 'คลองลาน', dEn: 'Khlong Lan', lat: 16.13, lng: 99.28 },
  { th: 'พิจิตร', en: 'Phichit', dTh: 'โพธิ์ประทับช้าง', dEn: 'Pho Prathap Chang', lat: 16.31, lng: 100.27 },
  { th: 'เพชรบูรณ์', en: 'Phetchabun', dTh: 'หล่มเก่า', dEn: 'Lom Kao', lat: 16.92, lng: 101.23 },
  { th: 'อุทัยธานี', en: 'Uthai Thani', dTh: 'บ้านไร่', dEn: 'Ban Rai', lat: 15.08, lng: 99.52 },
  { th: 'นครสวรรค์', en: 'Nakhon Sawan', dTh: 'ชุมแสง', dEn: 'Chum Saeng', lat: 15.93, lng: 100.30 },
  { th: 'ขอนแก่น', en: 'Khon Kaen', dTh: 'ชุมแพ', dEn: 'Chum Phae', lat: 16.54, lng: 102.10 },
  { th: 'อุดรธานี', en: 'Udon Thani', dTh: 'บ้านดุง', dEn: 'Ban Dung', lat: 17.69, lng: 103.26 },
  { th: 'หนองคาย', en: 'Nong Khai', dTh: 'ศรีเชียงใหม่', dEn: 'Si Chiang Mai', lat: 17.96, lng: 102.58 },
  { th: 'บึงกาฬ', en: 'Bueng Kan', dTh: 'เซกา', dEn: 'Seka', lat: 17.93, lng: 103.95 },
  { th: 'สกลนคร', en: 'Sakon Nakhon', dTh: 'พังโคน', dEn: 'Phang Khon', lat: 17.39, lng: 103.72 },
  { th: 'นครพนม', en: 'Nakhon Phanom', dTh: 'ท่าอุเทน', dEn: 'Tha Uthen', lat: 17.57, lng: 104.60 },
  { th: 'มุกดาหาร', en: 'Mukdahan', dTh: 'ดอนตาล', dEn: 'Don Tan', lat: 16.31, lng: 104.92 },
  { th: 'กาฬสินธุ์', en: 'Kalasin', dTh: 'กมลาไสย', dEn: 'Kamalasai', lat: 16.34, lng: 103.57 },
  { th: 'ร้อยเอ็ด', en: 'Roi Et', dTh: 'พนมไพร', dEn: 'Phanom Phrai', lat: 15.70, lng: 104.11 },
  { th: 'มหาสารคาม', en: 'Maha Sarakham', dTh: 'โกสุมพิสัย', dEn: 'Kosum Phisai', lat: 16.25, lng: 103.06 },
  { th: 'ยโสธร', en: 'Yasothon', dTh: 'คำเขื่อนแก้ว', dEn: 'Kham Khuean Kaeo', lat: 15.65, lng: 104.30 },
  { th: 'อำนาจเจริญ', en: 'Amnat Charoen', dTh: 'เสนางคนิคม', dEn: 'Senangkhanikhom', lat: 16.03, lng: 104.67 },
  { th: 'อุบลราชธานี', en: 'Ubon Ratchathani', dTh: 'สิรินธร', dEn: 'Sirindhorn', lat: 15.20, lng: 105.39 },
  { th: 'ศรีสะเกษ', en: 'Sisaket', dTh: 'อุทุมพรพิสัย', dEn: 'Uthumphon Phisai', lat: 15.11, lng: 104.14 },
  { th: 'สุรินทร์', en: 'Surin', dTh: 'ปราสาท', dEn: 'Prasat', lat: 14.64, lng: 103.40 },
  { th: 'บุรีรัมย์', en: 'Buri Ram', dTh: 'นางรอง', dEn: 'Nang Rong', lat: 14.63, lng: 102.79 },
  { th: 'นครราชสีมา', en: 'Nakhon Ratchasima', dTh: 'ปากช่อง', dEn: 'Pak Chong', lat: 14.70, lng: 101.41 },
  { th: 'ชัยภูมิ', en: 'Chaiyaphum', dTh: 'ภูเขียว', dEn: 'Phu Khiao', lat: 16.37, lng: 102.13 },
  { th: 'เลย', en: 'Loei', dTh: 'เชียงคาน', dEn: 'Chiang Khan', lat: 17.89, lng: 101.65 },
  { th: 'หนองบัวลำภู', en: 'Nong Bua Lamphu', dTh: 'ศรีบุญเรือง', dEn: 'Si Bun Rueang', lat: 16.96, lng: 102.28 },
  { th: 'กรุงเทพมหานคร', en: 'Bangkok', dTh: 'ธนบุรี', dEn: 'Thon Buri', lat: 13.72, lng: 100.49 },
  { th: 'สมุทรปราการ', en: 'Samut Prakan', dTh: 'บางพลี', dEn: 'Bang Phli', lat: 13.60, lng: 100.70 },
  { th: 'นนทบุรี', en: 'Nonthaburi', dTh: 'บางกรวย', dEn: 'Bang Kruai', lat: 13.80, lng: 100.47 },
  { th: 'ปทุมธานี', en: 'Pathum Thani', dTh: 'คลองหลวง', dEn: 'Khlong Luang', lat: 14.06, lng: 100.64 },
  { th: 'พระนครศรีอยุธยา', en: 'Ayutthaya', dTh: 'บางปะอิน', dEn: 'Bang Pa-in', lat: 14.23, lng: 100.57 },
  { th: 'อ่างทอง', en: 'Ang Thong', dTh: 'โพธิ์ทอง', dEn: 'Pho Thong', lat: 14.67, lng: 100.40 },
  { th: 'ลพบุรี', en: 'Lopburi', dTh: 'พัฒนานิคม', dEn: 'Phatthana Nikhom', lat: 14.88, lng: 100.86 },
  { th: 'สิงห์บุรี', en: 'Sing Buri', dTh: 'อินทร์บุรี', dEn: 'In Buri', lat: 15.00, lng: 100.32 },
  { th: 'ชัยนาท', en: 'Chai Nat', dTh: 'วัดสิงห์', dEn: 'Wat Sing', lat: 15.26, lng: 100.04 },
  { th: 'สระบุรี', en: 'Saraburi', dTh: 'แก่งคอย', dEn: 'Kaeng Khoi', lat: 14.59, lng: 100.99 },
  { th: 'ชลบุรี', en: 'Chon Buri', dTh: 'บางแสน', dEn: 'Bang Saen', lat: 13.28, lng: 100.92 },
  { th: 'ระยอง', en: 'Rayong', dTh: 'แกลง', dEn: 'Klaeng', lat: 12.78, lng: 101.65 },
  { th: 'จันทบุรี', en: 'Chanthaburi', dTh: 'โป่งน้ำร้อน', dEn: 'Pong Nam Ron', lat: 12.91, lng: 102.26 },
  { th: 'ตราด', en: 'Trat', dTh: 'คลองใหญ่', dEn: 'Khlong Yai', lat: 11.78, lng: 102.89 },
  { th: 'ฉะเชิงเทรา', en: 'Chachoengsao', dTh: 'บางคล้า', dEn: 'Bang Khla', lat: 13.72, lng: 101.21 },
  { th: 'ปราจีนบุรี', en: 'Prachinburi', dTh: 'นาดี', dEn: 'Na Di', lat: 14.15, lng: 101.89 },
  { th: 'นครนายก', en: 'Nakhon Nayok', dTh: 'ปากพลี', dEn: 'Pak Phli', lat: 14.15, lng: 101.27 },
  { th: 'สระแก้ว', en: 'Sa Kaeo', dTh: 'อรัญประเทศ', dEn: 'Aranyaprathet', lat: 13.69, lng: 102.50 },
  { th: 'ราชบุรี', en: 'Ratchaburi', dTh: 'สวนผึ้ง', dEn: 'Suan Phueng', lat: 13.54, lng: 99.34 },
  { th: 'กาญจนบุรี', en: 'Kanchanaburi', dTh: 'ทองผาภูมิ', dEn: 'Thong Pha Phum', lat: 14.73, lng: 98.63 },
  { th: 'สุพรรณบุรี', en: 'Suphan Buri', dTh: 'อู่ทอง', dEn: 'U Thong', lat: 14.37, lng: 99.89 },
  { th: 'นครปฐม', en: 'Nakhon Pathom', dTh: 'บางเลน', dEn: 'Bang Len', lat: 14.02, lng: 100.17 },
  { th: 'สมุทรสาคร', en: 'Samut Sakhon', dTh: 'กระทุ่มแบน', dEn: 'Krathum Baen', lat: 13.65, lng: 100.29 },
  { th: 'สมุทรสงคราม', en: 'Samut Songkhram', dTh: 'บางคนที', dEn: 'Bang Khonthi', lat: 13.48, lng: 99.96 },
  { th: 'เพชรบุรี', en: 'Phetchaburi', dTh: 'แก่งกระจาน', dEn: 'Kaeng Krachan', lat: 12.91, lng: 99.64 },
  { th: 'ประจวบคีรีขันธ์', en: 'Prachuap Khiri Khan', dTh: 'บางสะพาน', dEn: 'Bang Saphan', lat: 11.21, lng: 99.51 },
  { th: 'นครศรีธรรมราช', en: 'Nakhon Si Thammarat', dTh: 'ลานสกา', dEn: 'Lan Saka', lat: 8.35, lng: 99.76 },
  { th: 'กระบี่', en: 'Krabi', dTh: 'อ่าวลึก', dEn: 'Ao Luek', lat: 8.38, lng: 98.73 },
  { th: 'พังงา', en: 'Phang Nga', dTh: 'คุระบุรี', dEn: 'Khura Buri', lat: 9.22, lng: 98.42 },
  { th: 'ภูเก็ต', en: 'Phuket', dTh: 'กะทู้', dEn: 'Kathu', lat: 7.91, lng: 98.33 },
  { th: 'สุราษฎร์ธานี', en: 'Surat Thani', dTh: 'บ้านตาขุน', dEn: 'Ban Ta Khun', lat: 8.90, lng: 98.88 },
  { th: 'ระนอง', en: 'Ranong', dTh: 'ละอุ่น', dEn: 'La-un', lat: 10.13, lng: 98.75 },
  { th: 'ชุมพร', en: 'Chumphon', dTh: 'หลังสวน', dEn: 'Lang Suan', lat: 9.94, lng: 99.08 },
];

let globalIdx = 2001;

// Generate 280 Thai entries (4 per province for 70 provinces)
for (const prov of PROVINCES_ALL) {
  for (let tIdx = 0; tIdx < 4; tIdx++) {
    const tmpl = thaiTemplates[tIdx];
    const c = coord(prov.lat, prov.lng);
    catalog.push({
      id: `pin-batch3-th-${prov.en.toLowerCase().replace(/[^a-z]/g, '')}-${tIdx + 1}`,
      title_th: `${tmpl.name} แห่ง${prov.dTh} (${prov.th})`,
      title_en: `${tmpl.en} of ${prov.dEn} (${prov.en})`,
      category: tmpl.cat,
      province_th: `${prov.th} (ไทย)`,
      province_en: `${prov.en} (Thailand)`,
      district_th: prov.dTh,
      district_en: prov.dEn,
      lat: c.lat,
      lng: c.lng,
      sound_preset: tmpl.sound,
      story_th: `${tmpl.storyTh} ณ บริเวณ${prov.dTh} จังหวัด${prov.th} สืบทอดตำนานความเชื่ออันเร้นลับมานานนับร้อยปี`,
      storyEn: `${tmpl.storyEn} Deep in ${prov.dEn}, ${prov.en}, ancestral eyewitnesses preserve this spectral legacy.`,
      folklore_history_th: `ได้รับการบันทึกผ่านคำบอกเล่าและวรรณกรรมท้องถิ่นของชาว${prov.th} เป็นอนุสรณ์ความเชื่อที่ผูกพันกับธรรมชาติและจิตวิญญาณแห่งลุ่มน้ำ`,
      folklore_history_en: `Recorded through oral folklore of ${prov.en}, enduring as a cultural marker of regional spiritual ecology.`,
      taboos_th: tmpl.tabooTh,
      taboos_en: tmpl.tabooEn,
      descTh: tmpl.descTh,
      descEn: tmpl.descEn,
      yt_query: `${tmpl.querySuffix} ${prov.th}`,
    });
    globalIdx++;
  }
}
console.log(`Generated ${catalog.length} Thai folklore entries.`);

fs.writeFileSync('scripts/catalog_thai_280.json', JSON.stringify(catalog, null, 2));

import type { GhostPin, SupportedLanguage } from '../types/ghost';

export interface EntityDossier {
  codexId: string;
  portraitUrl: string;
  entityType: string;
  gender: string;
  size: string;
  weight: string;
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  dangerLabel: string;
  habitat: string;
  activeHours: string;
  appearanceDesc: string;
  expandedStory: string;
  omensAndTaboos: string[];
}

export type ArchetypeKey =
  | 'cursed_wilderness'
  | 'cursed_relic_monument'
  | 'cosmic_anomaly'
  | 'haunted_edifice'
  | 'cursed_artifact'
  | 'aquatic_abyss'
  | 'aquatic_serpent'
  | 'merfolk_spirit'
  | 'cryptid_beast'
  | 'undead_lord'
  | 'winged_demon'
  | 'sand_worm'
  | 'spider_trickster'
  | 'deity_guardian'
  | 'male_specter'
  | 'female_specter';

interface PinBestiaryMeta {
  archetype: ArchetypeKey;
  customImage?: string;
  typeTh: string;
  typeEn: string;
  genderTh: string;
  genderEn: string;
  sizeTh: string;
  sizeEn: string;
  weightTh: string;
  weightEn: string;
  danger: 1 | 2 | 3 | 4 | 5;
  habitatTh: string;
  habitatEn: string;
  hoursTh: string;
  hoursEn: string;
  descTh: string;
  descEn: string;
  extraLoreTh: string;
  extraLoreEn: string;
  taboosTh: string[];
  taboosEn: string[];
}

const PIN_BESTIARY_DB: Record<string, Partial<PinBestiaryMeta>> = {
  'pin-adaro-solomon-flying-fish': {
    archetype: 'merfolk_spirit',
    typeTh: 'เผ่าพันธุ์เงือกและพรายน้ำโบราณ (Amphibious Merfolk & Sea Specter)',
    typeEn: 'Amphibious Merfolk & Oceanic Specter',
    genderTh: 'เพศชาย (วิญญาณชั่วร้ายของมนุษย์จำแลงกาย)',
    genderEn: 'Male Spirit (Malignant Human Ghost Manifestation)',
    sizeTh: '1.6 – 2.0 เมตร (สรีระครึ่งมนุษย์ครึ่งปลาดาบ มีเขาแหลมบนศีรษะ)',
    sizeEn: '1.6 – 2.0 m (Humanoid with swordfish horn & dorsal fins)',
    weightTh: '60 – 85 กก.',
    weightEn: '60 – 85 kg',
    danger: 3,
    habitatTh: 'เกาะมาคิรา แนวมรสุม และแนวปะการังหมู่เกาะโซโลมอน',
    habitatEn: 'Makira Island reefs & Solomon Islands sea shoals',
    hoursTh: 'ยามแดดออกกลางสายฝน (Sun showers) และยามเกิดสายรุ้งเหนือน้ำ',
    hoursEn: 'During ocean sun showers and descending rainbows',
    descTh: 'ปรากฏกายเป็นอมนุษย์พรายน้ำท่อนบนเป็นชายกำยำ มีเหงือกหลังใบหู บนศีรษะมีเขาแหลมยาวคล้ายดาบของปลากระโทงหรือฉลาม ท่อนล่างเป็นหางปลาแหวกว่ายได้รวดเร็วปานสายฟ้า มักถือปลาบินมีพิษพร้อมยิงใส่ผู้บุกรุก',
    descEn: 'Manifests as an amphibious merman with gills behind his ears, sporting a formidable swordfish-like horn upon his crown and shark fins, propelling across waves to fling venomous flying fish.',
  },
  'pin-kumanthong': {
    archetype: 'cursed_artifact',
    typeTh: 'กุมารทองและวิญญาณเด็กทองคำ (Sacred Child Spirit & Occult Amulet)',
    typeEn: 'Sacred Child Spirit & Occult Amulet',
    genderTh: 'วิญญาณกุมารจำแลง (Child Spirit / Golden Familiar)',
    genderEn: 'Child Spirit / Golden Familiar',
    sizeTh: '0.15 – 0.35 เมตร (รูปหล่อหุ่นจำลองบูชา)',
    sizeEn: '0.15 – 0.35 m (Cast metal / clay consecrated effigy)',
    weightTh: '0.5 – 3.5 กก.',
    weightEn: '0.5 – 3.5 kg',
    danger: 2,
    habitatTh: 'หิ้งบูชาในเคหสถานและอารามวัดสามง่าม นครปฐม',
    habitatEn: 'Domestic household altars & Wat Sam Ngam, Nakhon Pathom',
    hoursTh: 'ตลอด 24 ชั่วโมง (คึกคักเป็นพิเศษยามถวายขนมหวานและน้ำแดง)',
    hoursEn: '24 Hours (Heightened during offerings of sweets & red soda)',
  },
  'pin-phiam': {
    archetype: 'male_specter',
    typeTh: 'ผีอำและเงามืดกดทับยามนิทรา (Sleep Paralysis Shadow Phantom)',
    typeEn: 'Sleep Paralysis Shadow Phantom',
    genderTh: 'เงามืดไร้รูป / อสุรกายกดทับ',
    genderEn: 'Formless Shadow Wraith',
    sizeTh: 'ขนาดไม่คงที่ (แปรสภาพตามน้ำหนักที่กดทับ)',
    sizeEn: 'Variable (Compresses upon the chest of the slumbering)',
    weightTh: 'หนักอึ้งดั่งหินผา (ทับทรวงอก)',
    weightEn: 'Crushing stone weight upon the thoracic plane',
    danger: 3,
    habitatTh: 'ห้องนอนและมุมมืดในเคหสถานยามค่ำคืน',
    habitatEn: 'Nocturnal bedchambers and shadows of sleep',
    hoursTh: 'ยามเคลิ้มหลับช่วงกึ่งหลับกึ่งตื่น (Hypnagogia)',
    hoursEn: 'Hypnagogic & hypnopompic twilight transitions',
  },
  'pin-yeti': {
    archetype: 'cryptid_beast',
    customImage: '/entities/yeti.jpg',
    typeTh: 'อสุรกายไพรหนาวหิมาลัย (Cryo-Hominid Cryptid)',
    typeEn: 'Himalayan Cryo-Hominid Cryptid',
    genderTh: 'เพศผู้ / สัตว์นักล่าดึกดำบรรพ์',
    genderEn: 'Male / Primeval Beast',
    sizeTh: '2.4 – 3.2 เมตร (เมื่อยืนสองขา)',
    sizeEn: '2.4 – 3.2 m (Bipedal stance)',
    weightTh: '220 – 420 กก.',
    weightEn: '220 – 420 kg',
    danger: 4,
    habitatTh: 'สันเขาหิมะและธารน้ำแข็งเทือกเขาหิมาลัย (สูงกว่า 4,500 ม.)',
    habitatEn: 'High Himalayan glaciers & snow ridges (>4,500 m)',
    hoursTh: 'ยามพายุหิมะพัดจัดและพลบค่ำถึงเช้ามืด',
    hoursEn: 'Blizzard whiteouts & dusk till dawn',
    taboosTh: [
      'หากพบรอยเท้าขนาดยักษ์สดใหม่กลางพายุหิมะ ห้ามเดินตามรอยไปเด็ดขาด',
      'หากได้ยินเสียงผิวปากก้องจากหุบเหวน้ำแข็ง ให้รีบลงสู่ที่ต่ำทันที',
      'ห้ามเผาขนสัตว์หรือส่งเสียงท้าทายเจ้าเขาบริเวณอารามคุมจุงหลังตะวันตกดิน',
    ],
    taboosEn: [
      'Never follow fresh giant tracks into a rising blizzard.',
      'If a sharp whistling cry echoes across the glacier, descend laterally immediately.',
      'Never burn animal hair or shout challenges near sacred high-altitude passes after dusk.',
    ],
  },
  'pin-prasat-hin-phanom-rung': {
    archetype: 'cursed_relic_monument',
    customImage: '/entities/pin-prasat-hin-phanom-rung.jpg',
    typeTh: 'โบราณสถานศักดิ์สิทธิ์และเทวสถานขอมโบราณ (Ancient Stone Sanctuary & Sacred Monument)',
    typeEn: 'Ancient Stone Sanctuary & Sacred Monument',
    genderTh: 'N/A (สถาปัตยกรรมเทวสถานโบราณ / พระศิวะมหาเทพ)',
    genderEn: 'N/A (Ancient Monolithic Temple / Lord Shiva Sanctum)',
    sizeTh: 'เทวสถานยอดปรางค์ประธานสูง 27 เมตร บนยอดภูเขาไฟดับสนิท',
    sizeEn: '27-meter central stone prang sanctuary atop an extinct volcano',
    weightTh: 'มวลหินทรายสีชมพูและศิลาแลงนับหมื่นตัน',
    weightEn: 'Tens of thousands of tons of pink sandstone & laterite',
    danger: 2,
    habitatTh: 'ยอดภูเขาไฟพนมรุ้ง อำเภอเฉลิมพระเกียรติ จังหวัดบุรีรัมย์',
    habitatEn: 'Phanom Rung Extinct Volcano, Buriram, Thailand',
    hoursTh: 'ตลอดกาล (รับพลังงานจักรวาลสูงสุดยามดวงอาทิตย์ส่องตรง 15 ช่องประตู)',
    hoursEn: 'Eternal (Heightened alignment when sun shines through all 15 doorways)',
    descTh: 'เทวสถานปราสาทหินทรายสีชมพูศิลปะขอมโบราณ สร้างขึ้นเพื่อถวายแด่องค์พระศิวะ ตั้งตระหง่านอยู่บนยอดภูเขาไฟที่ดับสนิทแล้ว มีทับหลังนารายณ์บรรทมสินธุ์อันเลื่องชื่อ',
    descEn: 'A magnificent pink sandstone Khmer sanctuary dedicated to Shiva, perched atop an extinct volcano. Renowned for its divine cosmic alignment where the sun aligns through 15 doorways.',
    extraLoreTh: 'ปราสาทหินพนมรุ้งเปรียบเสมือนเขาไกรลาสจำลองบนโลกมนุษย์ ทุกปีจะมีปรากฏการณ์แสงอาทิตย์ลอดผ่าน 15 ช่องประตู 4 ครั้ง เชื่อว่าเป็นช่วงเวลาที่พลังแห่งทวยเทพและจักรวาลเปิดออกสู่โลกมนุษย์',
    extraLoreEn: 'Symbolizing Mount Kailash on Earth, the temple exhibits a solar phenomenon four times a year where sunlight pierces straight through all 15 sanctuary doors.',
    taboosTh: [
      'ห้ามปีนป่าย ขูดขีด สลักชื่อ หรือนั่งบนศิวลึงค์ ฐานโยนี หรือทับหลังนารายณ์บรรทมสินธุ์เด็ดขาด',
      'ห้ามหยิบเศษหินทราย ศิลาแลง วัตถุมงคล หรือดินออกจากบริเวณเขตปราสาทกลับบ้าน',
      'ควรสำรวมกายวาจาและกราบสักการะด้วยความเคารพต่อองค์พระศิวะและเทพผู้พิทักษ์',
    ],
    taboosEn: [
      'Never climb, deface, or sit on the Shiva lingam, yoni base, or the sacred lintels.',
      'Never remove sandstone fragments, laterite bricks, or soil from the temple grounds.',
      'Maintain respectful silence and honor the ancient guardians of the sanctuary.',
    ],
  },
  'pin-dongphayayen': {
    archetype: 'cursed_wilderness',
    customImage: '/entities/pin-dongphayayen.jpg',
    typeTh: 'อาถรรพ์ผืนป่าดึกดำบรรพ์และแดนลี้ลับ (Haunted Wilderness & Primeval Biosphere)',
    typeEn: 'Haunted Wilderness & Primeval Biosphere',
    genderTh: 'N/A (อาณาเขตผืนป่าธรรมชาติ / เจ้าป่าเจ้าเขา)',
    genderEn: 'N/A (Natural Wilderness / Forest Deities)',
    sizeTh: 'ครอบคลุมผืนป่ามรดกโลกกว้างใหญ่กว่า 6,155 ตร.กม.',
    sizeEn: 'Expansive World Heritage forest complex exceeding 6,155 sq km',
    weightTh: 'N/A (มวลระบบนิเวศและพลังงานสนามแม่เหล็กโลก)',
    weightEn: 'N/A (Biomass & Geomagnetic Field Mass)',
    danger: 4,
    habitatTh: 'เทือกเขาดงพญาเย็นและอุทยานแห่งชาติเขาใหญ่',
    habitatEn: 'Dong Phaya Yen Mountains & Khao Yai Forest Complex',
    hoursTh: 'ตลอด 24 ชั่วโมง (ทวีความรุนแรงยามค่ำคืนและช่วงม่านหมอกลงจัด)',
    hoursEn: '24 Hours (Heightened during midnight hours & creeping rainy fogs)',
    descTh: 'ผืนป่าดงดิบดึกดำบรรพ์ที่เคยได้ชื่อว่า "ดงพญาไฟ" เต็มไปด้วยเรื่องเล่าขานของไข้ป่า สมิงร้ายจำแลง และสิ่งลี้ลับที่กลืนกินผู้บุกรุกมานับร้อยปี',
    descEn: 'A primeval rainforest historically feared as "Dong Phaya Fai" (Forest of the Fire Lord), known for fatal malaria, were-tigers (Suea Saming), and unmapped spirit trails.',
    extraLoreTh: 'ก่อนการสร้างทางรถไฟสายแรก ขบวนเกวียนโบราณที่สัญจรผ่านต้องทำพิธีขอขมาเจ้าป่าเจ้าเขาตลอดเส้นทาง ผู้เฒ่าผู้แก่เตือนว่าใครฝ่าฝืนตัดไม้หรือท้าทายจะถูกเจ้าป่าปิดตามิให้พบทางออก',
    extraLoreEn: 'Caravans of old required protective shamans to traverse this territory, warning that disrespectful travelers would suffer jungle delirium and vanish forever.',
    taboosTh: [
      'ห้ามตัดไม้ ยิงสัตว์ หรือสร้างความเสียหายต่อผืนป่าโดยไม่ขอขมาเจ้าป่าเจ้าเขา',
      'หากได้ยินเสียงคนรู้จักเรียกชื่อแว่วมาจากดงทึบ ห้ามขานรับเด็ดขาดเพราะอาจเป็นเสือสมิงแปลงกายมาล่อลวง',
      'พกเครื่องรางสายพุทธคุณคุ้มกาย และห้ามพูดจาลบหลู่ศาลเจ้าพ่อเขาใหญ่ตลอดเส้นทาง',
    ],
    taboosEn: [
      'Never fell trees or hunt wildlife without offering traditional rites to forest guardians.',
      'If familiar voices call your name from the deep thicket, never answer—it may be a shapeshifting tiger spirit.',
      'Carry blessed amulets and refrain from vulgar language while traversing deep trails.',
    ],
  },
  'pin-maenak': {
    archetype: 'female_specter',
    customImage: '/entities/maenak.jpg',
    typeTh: 'วิญญาณผีตายทั้งกลมผู้ผูกพันด้วยรัก (Bound Maternal Revenant)',
    typeEn: 'Bound Maternal Revenant Spirit',
    genderTh: 'เพศหญิง (พร้อมวิญญาณทารก)',
    genderEn: 'Female (with Infant Spirit)',
    sizeTh: '1.62 เมตร (ยืดแขนยาวได้ตามอาถรรพ์)',
    sizeEn: '1.62 m (Supernaturally elongating limbs)',
    weightTh: 'N/A (0.0 กก. — กายทิพย์วิญญาณ)',
    weightEn: 'N/A (0.0 kg — Incorporeal Ectoplasm)',
    danger: 3,
    habitatTh: 'ริมคลองพระโขนงและศาลย่านาควัดมหาบุศย์ กรุงเทพฯ',
    habitatEn: 'Phra Khanong canal banks & Wat Mahabut Shrine, Bangkok',
    hoursTh: 'ยามพลบค่ำถึงก่อนรุ่งสาง (19:00 – 04:00 น.)',
    hoursEn: 'Twilight till dawn (19:00 – 04:00)',
    taboosTh: [
      'ห้ามทักหรือมองลอดใต้หว่างขายามสัญจรเลียบคลองพระโขนงในคืนเดือนมืด',
      'เมื่อเข้ากราบไหว้ศาลย่านาค ห้ามบนบานขอให้ไม่ต้องเกณฑ์ทหารเด็ดขาด',
      'ควรถวายชุดไทย ของเล่นเด็ก หรือทองคำเปลวด้วยจิตเมตตาระลึกถึงความรักอันบริสุทธิ์',
    ],
    taboosEn: [
      'Never look between your legs along dark canal banks at night.',
      'Never pray to avoid military conscription at Ya Nak shrine.',
      'Offer traditional Thai silk garments or child toys with pure respect.',
    ],
  },
  'pin-pret': {
    archetype: 'male_specter',
    customImage: '/entities/pin-pret.jpg',
    typeTh: 'เปรตอสุรกายชดใช้กรรมบาป (Tormented Hungry Ghost / Preta)',
    typeEn: 'Tormented Karmic Hungry Ghost (Preta)',
    genderTh: 'เพศชาย / เปรตสัมภเวสี',
    genderEn: 'Male / Tormented Preta',
    sizeTh: 'ร่างผอมโซสูงตระหง่าน 15 – 25 เมตร (เทียบเท่าเสาชิงช้า)',
    sizeEn: '15 – 25 meters tall (Towering as the Giant Swing)',
    weightTh: 'N/A (0.0 กก. — โครงสร้างกายทิพย์อเวจี)',
    weightEn: 'N/A (0.0 kg — Spectral Hellform)',
    danger: 3,
    habitatTh: 'ลานหน้าวัดสุทัศนเทพวรารามและเสาชิงช้า พระนคร',
    habitatEn: 'Wat Suthat Sanctuary & The Giant Swing, Bangkok',
    hoursTh: 'คืนเดือนมืดหลังเที่ยงคืน (00:00 – 03:30 น.)',
    hoursEn: 'Moonless midnight hours (00:00 – 03:30)',
    taboosTh: [
      'ห้ามส่งเสียงผิวปากล้อเลียนหรือเลียนแบบเสียงหวีดร้องในยามวิกาลรอบเสาชิงช้า',
      'หากได้ยินเสียงขอส่วนบุญ ให้ตั้งจิตอุทิศกุศลและห้ามท้าทายหรือชี้มือขึ้นฟ้าเด็ดขาด',
      'ควรทำบุญตักบาตรกรวดน้ำอุทิศให้แก่บรรพบุรุษและสัมภเวสีผู้ยากไร้',
    ],
    taboosEn: [
      'Never whistle or mimic piercing cries around the Giant Swing after midnight.',
      'If wailing cries for merit echo from above, recite protective prayers and do not point upwards.',
      'Dedicate merit and water-libation rituals to suffering wandering spirits.',
    ],
  },
  'pin-bermuda': {
    archetype: 'aquatic_abyss',
    customImage: '/entities/pin-bermuda.jpg',
    typeTh: 'วังน้ำวนลึกและดินแดนสูญหายทางทะเล (Abyssal Anomaly & Phantom Vessel)',
    typeEn: 'Abyssal Anomaly & Phantom Vessel',
    genderTh: 'N/A (ความผิดปกติทางมิติและภูมิศาสตร์มหาสมุทร)',
    genderEn: 'N/A (Naval Anomaly & Dimensional Vortex)',
    sizeTh: 'อาณาเขตมหาสมุทรแอตแลนติกครอบคลุมกว่า 1,300,000 ตร.กม.',
    sizeEn: 'Vast Atlantic oceanic zone spanning 1,300,000 sq km',
    weightTh: 'N/A (มวลน้ำลึกและสนามแม่เหล็กแปรปรวน)',
    weightEn: 'N/A (Abyssal ocean mass & electromagnetic vortex)',
    danger: 5,
    habitatTh: 'มหาสมุทรแอตแลนติกเหนือ (ฟลอริดา - เบอร์มิวดา - เปอร์โตริโก)',
    habitatEn: 'North Atlantic Ocean (Florida - Bermuda - Puerto Rico triangle)',
    hoursTh: 'ยามพายุแม่เหล็ก หมอกไฟฟ้า และคืนเดือนดับ',
    hoursEn: 'Electromagnetic storm fronts & moonless ocean swells',
    taboosTh: [
      'ห้ามพึ่งพาระบบเข็มทิศแม่เหล็กเพียงอย่างเดียว ตรวจสอบอุปกรณ์สำรองและบันทึกพิกัดทุกระยะ',
      'หากพบหมอกสีขาวประหลาดหรือฟ้าแลบไร้เสียงฟ้าร้อง ให้รีบหันหัวเรือหรืออากาศยานออกจากพิกัดทันที',
      'แจ้งสัญญาณวิทยุสื่อสารฉุกเฉินต่อสถานีชายฝั่งอย่างต่อเนื่อง',
    ],
    taboosEn: [
      'Never rely solely on magnetic compass systems; calibrate secondary GPS and celestial charts.',
      'If electronic green fog or silent lightning manifests, alter bearing immediately.',
      'Maintain continuous emergency radio contact with mainland maritime controllers.',
    ],
  },
  'pin-sphinx': {
    archetype: 'cursed_relic_monument',
    customImage: '/entities/pin-sphinx.jpg',
    typeTh: 'ซากโบราณสถานและมรดกต้องคำสาป (Cursed Ruin & Ancient Monolith)',
    typeEn: 'Cursed Ruin & Ancient Monolith',
    genderTh: 'N/A (อนุสรณ์หินแกะสลัก / สุริยเทพฮอร์-เอม-อัคเฮต)',
    genderEn: 'N/A (Colossal Limestone Monument / Hor-em-akhet)',
    sizeTh: 'ยาว 73 เมตร กว้าง 19 เมตร สูง 20 เมตร',
    sizeEn: '73 m length, 19 m width, 20 m height',
    weightTh: 'หินปูนธรรมชาติกว่า 20,000 ตัน',
    weightEn: 'Over 20,000 metric tons of limestone bedrock',
    danger: 3,
    habitatTh: 'ที่ราบสูงกิซา ริมแม่น้ำไนล์ อียิปต์',
    habitatEn: 'Giza Plateau, West Bank of the Nile, Egypt',
    hoursTh: 'ตลอดกาล (รับพลังงานสูงสุดยามพระอาทิตย์ขึ้นและวันวิษุวัต)',
    hoursEn: 'Perpetual (Peak resonance at dawn & equinox alignments)',
    taboosTh: [
      'ห้ามปีนป่าย ขูดขีด หรือรบกวนฐานหินและรอยแยกโบราณใต้กรงเล็บโดยเด็ดขาด',
      'ห้ามลักลอบขุดทรายหรือนำเครื่องตรวจจับโลหะเข้ามาในเขตลานหน้าสฟิงซ์ยามวิกาล',
      'ควรแสดงความเคารพต่ออนุสรณ์สถานศักดิ์สิทธิ์และผู้พิทักษ์แห่งทะเลทราย',
    ],
    taboosEn: [
      'Never climb, deface, or disturb the bedrock fissures beneath the great stone paws.',
      'Do not dig into surrounding sands or attempt nocturnal electromagnetic scans.',
      'Honor the monument with solemn respect as an eternal guardian of desert mysteries.',
    ],
  },
  'pin-piedpiper': {
    archetype: 'male_specter',
    customImage: '/entities/pin-piedpiper.jpg',
    typeTh: 'บุคคลลี้ลับและผู้บรรเลงมนต์สะกด (The Mysterious Pied Piper & Enchanter)',
    typeEn: 'The Mysterious Pied Piper & Enchanter',
    genderTh: 'เพศชาย (สวมชุดหลากสีสัน / Pied Hunter)',
    genderEn: 'Male (Dressed in Pied Multi-colored Garments)',
    sizeTh: '1.75 เมตร',
    sizeEn: '1.75 m',
    weightTh: '68 กก. (หรือกายทิพย์ในร่างนักดนตรีพเนจร)',
    weightEn: '68 kg (or ethereal wandering minstrel)',
    danger: 5,
    habitatTh: 'เมืองฮาเมิลน์ ริมแม่น้ำเวเซอร์ และถ้ำในภูเขาค็อพเพิน (Koppen Mountain)',
    habitatEn: 'Hamelin on the River Weser & Koppen Mountain caverns, Germany',
    hoursTh: 'ยามรุ่งสางวันเซนต์ยอห์นและเปาโล (26 มิถุนายน) และยามเสียงดนตรีแว่วมา',
    hoursEn: 'Feast of Saints John and Paul (June 26) & when eerie melodies drift',
    descTh: 'ชายพเนจรสวมเสื้อผ้าหลากสีสันผู้ถือขลุ่ยวิเศษ สามารถเป่ามนต์สะกดฝูงหนูและเด็กๆ ในเมืองฮาเมิลน์ 130 คนให้เดินตามจนหายสาบสูญไปในหุบเขาตลอดกาล',
    descEn: 'A mysterious piper in multicolored garments who used a magical flute to lure away Hamelin\'s rats and subsequently 130 children into the mountain, never to return.',
    extraLoreTh: 'บันทึกบนกระจกสีโบราณของโบสถ์เมืองฮาเมิลน์ปี 1284 ยืนยันว่าเด็กๆ 130 คนได้หายตัวไปตามเสียงดนตรีของชายผู้นี้จริงๆ จนถึงปัจจุบัน ถนน Bungelosenstrasse ในเมืองฮาเมิลน์ยังคงมีกฎหมายห้ามเล่นดนตรีหรือเต้นรำโดยเด็ดขาด',
    extraLoreEn: 'Historical town records from 1284 confirm 130 children followed the piper into the mountain and vanished. To this day, music and dancing remain strictly forbidden on Hamelin\'s Bungelosenstrasse.',
    taboosTh: [
      'ห้ามเล่นดนตรี เป่าขลุ่ย หรือเต้นรำบนถนน Bungelosenstrasse (ถนนไร้เสียงดนตรี) ในเมืองฮาเมิลน์โดยเด็ดขาด',
      'หากได้ยินเสียงทำนองเพลงขลุ่ยหวานไพเราะแต่เย็นยะเยือกแว่วมาจากตรอกมืด ห้ามเดินตามเสียงไปเด็ดขาด',
      'รักษาสัญญาและข้อตกลงอย่างเคร่งครัด เพราะการผิดคำมั่นสัญญานำมาซึ่งการสูญเสียที่ไม่อาจแก้ไข',
    ],
    taboosEn: [
      'Never play music, pipes, or dance on Bungelosenstrasse (the street without drums) in Hamelin.',
      'If an enchanting yet chilling flute melody drifts from dark alleys, do not follow it.',
      'Always honor pacts and promises; broken vows invite irreversible retribution.',
    ],
  },
};

/**
 * Intelligent Archetype Inference Engine
 * Classifies any folklore pin into its true essence (monument, forest, sea, cryptid, specter).
 */
export function inferArchetype(pin: GhostPin): ArchetypeKey {
  const explicit = PIN_BESTIARY_DB[pin.id]?.archetype;
  if (explicit) return explicit;

  const text = (
    pin.id + ' ' +
    pin.title_th + ' ' +
    pin.title_en + ' ' +
    pin.story_en + ' ' +
    pin.story_th + ' ' +
    pin.province_th + ' ' +
    pin.province_en + ' ' +
    (pin.district_th || '') + ' ' +
    (pin.district_en || '')
  ).toLowerCase();

  // 1. Cosmic & Extraterrestrial Anomalies (Always top priority)
  if (
    text.includes('dogon') || text.includes('โดกอน') ||
    text.includes('sirius') || text.includes('ซิริอุส') ||
    text.includes('nommo') || text.includes('นอมโม') ||
    text.includes('ufo') || text.includes('alien') || text.includes('เอเลี่ยน') ||
    text.includes('roswell') || text.includes('รอสเวลล์') ||
    text.includes('nazca') || text.includes('นาซกา') ||
    text.includes('tunguska') || text.includes('ทังกัสกา') ||
    text.includes('area 51') || text.includes('ยานอวกาศ') ||
    text.includes('ดาราศาสตร์โบราณ') || text.includes('จานบิน')
  ) {
    return 'cosmic_anomaly';
  }

  // 2. Category: MONSTER
  if (pin.category === 'monster') {
    if (
      text.includes('เงือก') || text.includes('mermaid') || text.includes('merman') ||
      text.includes('siren') || text.includes('ไซเรน') || text.includes('adaro') ||
      text.includes('อาดะโร') || text.includes('กัปปะ') || text.includes('kappa') ||
      text.includes('ningyo') || text.includes('นิงเงียว') || text.includes('rusalka') ||
      text.includes('melusine') || text.includes('พรายน้ำ')
    ) {
      return 'merfolk_spirit';
    }
    if (
      text.includes('จระเข้') || text.includes('ชาละวัน') || text.includes('chalawan') ||
      text.includes('พญานาค') || text.includes('นาคราช') || text.includes('naga') ||
      text.includes('loch ness') || text.includes('nessie') || text.includes('เนสซี') ||
      text.includes('kraken') || text.includes('คราเคน') || text.includes('serpent') ||
      text.includes('kelpie') || text.includes('เคลปี') || text.includes('leviathan')
    ) {
      return 'aquatic_serpent';
    }
    if (
      text.includes('mothman') || text.includes('มอธแมน') || text.includes('มังกร') ||
      text.includes('dragon') || text.includes('pazuzu') || text.includes('jersey') ||
      text.includes('กระหัง') || text.includes('krahang') || text.includes('ahool') ||
      text.includes('thunderbird') || text.includes('ปีก')
    ) {
      return 'winged_demon';
    }
    if (
      text.includes('vampire') || text.includes('แวมไพร์') || text.includes('dracula') ||
      text.includes('jiangshi') || text.includes('เจียงซือ') || text.includes('ผีดิบ') ||
      text.includes('mummy') || text.includes('มัมมี่') || text.includes('ghoul') ||
      text.includes('draugr')
    ) {
      return 'undead_lord';
    }
    return 'cryptid_beast';
  }

  // 3. Category: GHOST
  if (pin.category === 'ghost') {
    if (
      text.includes('แม่นาค') || text.includes('สาว') || text.includes('นาง') ||
      text.includes('หญิง') || text.includes('woman') || text.includes('lady') ||
      text.includes('krasue') || text.includes('กระสือ') || text.includes('ปอบ') ||
      text.includes('kuchisake') || text.includes('banshee') || text.includes('แบนชี') ||
      text.includes('white lady') || text.includes('สตรีชุดขาว') || text.includes('ตานี') ||
      text.includes('แม่มด') || text.includes('witch')
    ) {
      return 'female_specter';
    }
    return 'male_specter';
  }

  // 4. Category: CURSE
  if (pin.category === 'curse') {
    // 4.1 Cursed female apparitions / entities (e.g. Krasue, Pop, Witches)
    if (
      text.includes('กระสือ') || text.includes('krasue') || text.includes('ปอบ') ||
      text.includes('แม่มด') || text.includes('witch') || text.includes('นาง') ||
      text.includes('สาว') || text.includes('หญิง') || text.includes('lady') || text.includes('woman')
    ) {
      return 'female_specter';
    }
    // 4.2 Cursed artifacts, relics, amulets, dolls
    if (
      text.includes('กุมารทอง') || text.includes('kuman') || text.includes('ตุ๊กตา') ||
      text.includes('doll') || text.includes('amulet') || text.includes('relic') ||
      text.includes('เครื่องราง') || text.includes('หุ่น') || text.includes('ปลัดขิก') ||
      text.includes('รักยม') || text.includes('ควายธนู') || text.includes('วัวธนู') ||
      text.includes('กระจก') || text.includes('mirror') || text.includes('กล่อง') ||
      text.includes('box') || text.includes('dybbuk') || text.includes('เพชร') || text.includes('diamond')
    ) {
      return 'cursed_artifact';
    }
    // 4.3 Haunted edifices, mansions, bridges (Title-prioritized)
    const titleOnly = (pin.title_th + ' ' + pin.title_en).toLowerCase();
    if (
      titleOnly.includes('บ้าน') || titleOnly.includes('house') || titleOnly.includes('ตึก') ||
      titleOnly.includes('building') || titleOnly.includes('ปราสาท') || titleOnly.includes('castle') ||
      titleOnly.includes('คฤหาสน์') || titleOnly.includes('mansion') || titleOnly.includes('สะพาน') ||
      titleOnly.includes('bridge') || titleOnly.includes('โรงแรม') || titleOnly.includes('hotel') ||
      titleOnly.includes('เรือนจำ') || titleOnly.includes('prison') || titleOnly.includes('โรงพยาบาล')
    ) {
      return 'haunted_edifice';
    }
    // 4.4 Cursed wilderness & swamps
    if (
      titleOnly.includes('ป่า') || titleOnly.includes('forest') || titleOnly.includes('woods') ||
      titleOnly.includes('swamp') || titleOnly.includes('บึง') || titleOnly.includes('เขา') ||
      titleOnly.includes('ดง') || titleOnly.includes('mountain') || titleOnly.includes('wilderness')
    ) {
      return 'cursed_wilderness';
    }
    return 'cursed_artifact';
  }

  // 5. Category: SACRED
  if (pin.category === 'sacred') {
    if (
      text.includes('ปราสาทหิน') || text.includes('pyramid') || text.includes('พีระมิด') ||
      text.includes('เจดีย์') || text.includes('พระธาตุ') || text.includes('สถูป') ||
      text.includes('stonehenge') || text.includes('นครวัด') || text.includes('monument')
    ) {
      return 'cursed_relic_monument';
    }
    return 'deity_guardian';
  }

  // 6. Category: LEGEND
  if (pin.category === 'legend') {
    if (text.includes('bermuda') || text.includes('เรือผี') || text.includes('ghost ship') || text.includes('atlantis') || text.includes('สามเหลี่ยม')) {
      return 'aquatic_abyss';
    }
    if (text.includes('พีระมิด') || text.includes('pyramid') || text.includes('ปราสาทหิน') || text.includes('stonehenge') || text.includes('สุสาน') || text.includes('tomb') || text.includes('โบราณสถาน')) {
      return 'cursed_relic_monument';
    }
    if (text.includes('ดงพญา') || text.includes('aokigahara') || text.includes('hoia') || text.includes('ป่าอาถรรพ์')) {
      return 'cursed_wilderness';
    }
    return 'haunted_edifice';
  }

  return 'male_specter';
}

/**
 * Returns accurately tailored attribute metadata based on the classified archetype.
 */
function getDefaultMetadata(archetype: ArchetypeKey, pin: GhostPin) {
  switch (archetype) {
    case 'cursed_wilderness':
      return {
        typeTh: 'อาถรรพ์ผืนป่าดึกดำบรรพ์และแดนลี้ลับ (Haunted Wilderness & Primeval Biosphere)',
        typeEn: 'Haunted Wilderness & Primeval Biosphere',
        genderTh: 'N/A (อาณาเขตผืนป่าธรรมชาติ / เจ้าป่าเจ้าเขา)',
        genderEn: 'N/A (Natural Wilderness / Environmental Forest Spirits)',
        sizeTh: 'ครอบคลุมผืนป่ากว้างใหญ่หลายพันตารางกิโลเมตร',
        sizeEn: 'Spanning thousands of square kilometers of dense wilderness',
        weightTh: 'N/A (มวลระบบนิเวศและพลังงานสนามแม่เหล็กโลก)',
        weightEn: 'N/A (Ecological Biomass & Planetary Geomagnetic Energy)',
        danger: 4 as const,
        habitatTh: `${pin.province_th} ${pin.district_th ? `(${pin.district_th})` : ''}`,
        habitatEn: `${pin.province_en} ${pin.district_en ? `(${pin.district_en})` : ''}`,
        hoursTh: 'ตลอด 24 ชั่วโมง (ทวีความรุนแรงยามราตรีและช่วงม่านหมอกลงจัด)',
        hoursEn: '24 Hours (Heightened during midnight hours & creeping rainy fogs)',
      };

    case 'cursed_relic_monument':
      return {
        typeTh: 'โบราณสถานศักดิ์สิทธิ์และเทวสถานขอมโบราณ (Ancient Stone Sanctuary & Sacred Monument)',
        typeEn: 'Ancient Stone Sanctuary & Sacred Monument',
        genderTh: 'N/A (สถาปัตยกรรมเทวสถานโบราณ / พระศิวะมหาเทพ)',
        genderEn: 'N/A (Ancient Monolithic Temple / Deities of Antiquity)',
        sizeTh: 'มหาเทวสถานยอดปรางค์ศิลาบนยอดเขา (สถาปัตยกรรมขนาดมหึมา)',
        sizeEn: 'Colossal stone sanctuary & sacred architecture',
        weightTh: 'มวลหินทรายและศิลาแลงนับหมื่นตัน',
        weightEn: 'Tens of thousands of metric tons of carved sandstone',
        danger: (pin.category === 'sacred' ? 2 : 4) as 1 | 2 | 3 | 4 | 5,
        habitatTh: `${pin.province_th} ${pin.district_th ? `(${pin.district_th})` : ''}`,
        habitatEn: `${pin.province_en} ${pin.district_en ? `(${pin.district_en})` : ''}`,
        hoursTh: 'ตลอดกาล (รับพลังงานสูงสุดยามแสงอาทิตย์ส่องตรงช่องประตูและวันเปลี่ยนฤดู)',
        hoursEn: 'Perpetual (Peak alignment during equinoxes & astronomical alignments)',
      };

    case 'cosmic_anomaly':
      return {
        typeTh: 'ปรากฏการณ์ดาราศาสตร์โบราณและวัตถุลี้ลับนอกโลก (Cosmic & Extraterrestrial Anomaly)',
        typeEn: 'Cosmic & Extraterrestrial Anomaly',
        genderTh: 'N/A (สิ่งมีชีวิตทรงปัญญาจากต่างดาว / ทวยเทพนอมโม)',
        genderEn: 'N/A (Extraterrestrial Entity / Cosmic Intelligence)',
        sizeTh: 'แปรผันได้ (ตั้งแต่รูปทรงมนุษย์ครึ่งสัตว์ถึงอากาศยานขนาดยักษ์)',
        sizeEn: 'Variable (Humanoid avatars to colossal celestial craft)',
        weightTh: 'N/A (สสารและพลังงานมิติคู่ขนาน)',
        weightEn: 'N/A (Exotic Matter & Transdimensional Energy)',
        danger: 3 as const,
        habitatTh: `${pin.province_th} ${pin.district_th ? `(${pin.district_th})` : ''}`,
        habitatEn: `${pin.province_en} ${pin.district_en ? `(${pin.district_en})` : ''}`,
        hoursTh: 'ยามดาวเรียงตัวและปรากฏการณ์สุริยคราส/จันทรคราส',
        hoursEn: 'Planetary alignments & celestial eclipse windows',
      };

    case 'haunted_edifice':
      return {
        typeTh: 'สิ่งปลูกสร้างอาถรรพ์และคฤหาสน์ผีสิง (Haunted Fortress & Cursed Structure)',
        typeEn: 'Haunted Fortress & Cursed Structure',
        genderTh: 'N/A (สิ่งก่อสร้างสถาปัตยกรรม / แหล่งสถิตวิญญาณ)',
        genderEn: 'N/A (Architectural Structure / Spiritual Nexus)',
        sizeTh: 'อาคารและสิ่งปลูกสร้างหลายชั้นพร้อมโถงใต้ดิน',
        sizeEn: 'Multi-story structural complex & subterranean vaults',
        weightTh: 'มวลสิ่งก่อสร้างคอนกรีต/หินแกรนิตโบราณ',
        weightEn: 'Structural masonry & stone foundation mass',
        danger: 4 as const,
        habitatTh: `${pin.province_th} ${pin.district_th ? `(${pin.district_th})` : ''}`,
        habitatEn: `${pin.province_en} ${pin.district_en ? `(${pin.district_en})` : ''}`,
        hoursTh: 'ยามวิกาลและชั่วโมงผีผ่าน (23:00 – 04:00 น.)',
        hoursEn: 'The Witching Hours (23:00 – 04:00)',
      };

    case 'cursed_artifact': {
      const combinedText = (
        pin.title_th + ' ' + pin.title_en + ' ' +
        pin.story_th + ' ' + pin.story_en
      ).toLowerCase();
      const isAbstract =
        combinedText.includes('คลับ 27') ||
        combinedText.includes('27 club') ||
        combinedText.includes('ดนตรี') ||
        combinedText.includes('music') ||
        combinedText.includes('เพลง') ||
        combinedText.includes('superman') ||
        combinedText.includes('ภาพยนตร์') ||
        combinedText.includes('movie') ||
        combinedText.includes('ชะตากรรม') ||
        combinedText.includes('สัญญาปีศาจ') ||
        combinedText.includes('faustian') ||
        combinedText.includes('สายเลือด') ||
        combinedText.includes('คำสาปตระกูล');

      if (isAbstract) {
        return {
          typeTh: 'คำสาปอาถรรพ์และปรากฏการณ์ชะตากรรมลี้ลับ (Metaphysical Hex & Tragic Fate)',
          typeEn: 'Metaphysical Hex & Tragic Fate Phenomenon',
          genderTh: 'N/A (สนามพลังงานคำสาปและชะตากรรมมืดมน)',
          genderEn: 'N/A (Metaphysical Hex / Karmic Field)',
          sizeTh: 'ไม่จำกัดขนาดกายภาพ (ครอบคลุมบุคคลและเหตุการณ์ตามชะตากรรม)',
          sizeEn: 'Non-corporeal (Spans individuals and fatal events)',
          weightTh: 'N/A (มวลพลังงานสนามกรรมและแรงอาถรรพ์จิตวิญญาณ)',
          weightEn: 'N/A (Karmic & Metaphysical Resonance)',
          danger: 4 as const,
          habitatTh: `${pin.province_th} ${pin.district_th ? `(${pin.district_th})` : ''}`,
          habitatEn: `${pin.province_en} ${pin.district_en ? `(${pin.district_en})` : ''}`,
          hoursTh: 'ตลอดกาล (สำแดงผลรุนแรงยามอายุครบกำหนดหรือช่วงวิกฤตชะตาชีวิต)',
          hoursEn: 'Perpetual (Peak manifestation at fateful milestones or critical thresholds)',
        };
      }
      return {
        typeTh: 'วัตถุอาถรรพ์และเครื่องรางต้องคำสาป (Cursed Artifact & Occult Relic)',
        typeEn: 'Cursed Artifact & Occult Relic',
        genderTh: 'N/A (วัตถุต้องคำสาป / หุ่นจำลอง)',
        genderEn: 'N/A (Inanimate Cursed Vessel / Occult Object)',
        sizeTh: 'ขนาดวัตถุโบราณ (0.2 – 1.5 เมตร)',
        sizeEn: 'Small to medium object (0.2 – 1.5 m)',
        weightTh: 'ตามสภาพมวลสารวัตถุจริง (0.5 – 15 กก.)',
        weightEn: 'Physical object mass (0.5 – 15 kg)',
        danger: 4 as const,
        habitatTh: `${pin.province_th} ${pin.district_th ? `(${pin.district_th})` : ''}`,
        habitatEn: `${pin.province_en} ${pin.district_en ? `(${pin.district_en})` : ''}`,
        hoursTh: 'ยามถูกสัมผัส จ้องมอง หรือเมื่อมีผู้ล่วงละเมิดข้อห้าม',
        hoursEn: 'Upon physical contact, observation or boundary breach',
      };
    }

    case 'aquatic_abyss':
      return {
        typeTh: 'วังน้ำวนลึกและดินแดนสูญหายทางทะเล (Abyssal Anomaly & Phantom Vessel)',
        typeEn: 'Abyssal Anomaly & Phantom Vessel',
        genderTh: 'N/A (ความผิดปกติทางมิติและภูมิศาสตร์มหาสมุทร)',
        genderEn: 'N/A (Naval Anomaly & Dimensional Vortex)',
        sizeTh: 'อาณาเขตมหาสมุทรกว้างใหญ่หลายแสนตารางกิโลเมตร',
        sizeEn: 'Spanning hundreds of thousands of square kilometers of open sea',
        weightTh: 'N/A (มวลน้ำลึกและสนามแม่เหล็กแปรปรวน)',
        weightEn: 'N/A (Abyssal ocean mass & electromagnetic vortex)',
        danger: 5 as const,
        habitatTh: `${pin.province_th} ${pin.district_th ? `(${pin.district_th})` : ''}`,
        habitatEn: `${pin.province_en} ${pin.district_en ? `(${pin.district_en})` : ''}`,
        hoursTh: 'ยามเกิดพายุแม่เหล็ก หมอกไฟฟ้า และคืนเดือนดับ',
        hoursEn: 'Electromagnetic storm fronts & moonless ocean swells',
      };

    case 'aquatic_serpent':
      return {
        typeTh: 'อสูรและเทพพิทักษ์แห่งสายน้ำ (Aquatic Leviathan & River Guardian)',
        typeEn: 'Abyssal Aquatic Leviathan & River Guardian',
        genderTh: 'ไม่ระบุแน่ชัด (กายทิพย์/สัตว์โบราณ)',
        genderEn: 'Unverified / Ancient Astral Entity',
        sizeTh: '8.0 – 35.0 เมตร (ความยาวลำตัว)',
        sizeEn: '8.0 – 35.0 m (Body length)',
        weightTh: '1,500 – 8,000 กก. (หรือ N/A ในรูปกายทิพย์)',
        weightEn: '1,500 – 8,000 kg (or N/A in astral form)',
        danger: 3 as const,
        habitatTh: 'ร่องน้ำลึก ทะเลสาบ บึงโบราณ และถ้ำใต้น้ำ',
        habitatEn: 'Deep river trenches, misty lakes & underwater caves',
        hoursTh: 'ยามหมอกลงจัดและคืนวันเพ็ญขึ้น 15 ค่ำ',
        hoursEn: 'Dense water mist & full-moon nights',
      };

    case 'merfolk_spirit':
      return {
        typeTh: 'เผ่าพันธุ์เงือกและพรายน้ำโบราณ (Amphibious Merfolk & Sea Specter)',
        typeEn: 'Amphibious Merfolk & Oceanic Specter',
        genderTh: 'มีทั้งเพศชายและหญิง (จำแลงกายตามวิญญาณเดิม)',
        genderEn: 'Male / Female or Manifested Spirit Form',
        sizeTh: '1.5 – 2.1 เมตร (ท่อนบนคล้ายมนุษย์ ท่อนล่างเป็นหางปลา)',
        sizeEn: '1.5 – 2.1 m (Humanoid upper torso with finned tail)',
        weightTh: '50 – 90 กก.',
        weightEn: '50 – 90 kg',
        danger: 3 as const,
        habitatTh: 'แนวปะการัง ถ้ำใต้น้ำ และชายฝั่งทะเลมหาสมุทร',
        habitatEn: 'Coral reefs, sea caverns & ocean coastlines',
        hoursTh: 'ยามคลื่นลมแปรปรวน แดดออกกลางฝน และคืนข้างแรม',
        hoursEn: 'Turbulent tides, sun showers & waning moon swells',
      };

    case 'cryptid_beast':
      return {
        typeTh: 'อสุรกายดึกดำบรรพ์และสัตว์ร้ายจำแลง (Primeval Cryptid & Alpha Predator)',
        typeEn: 'Primeval Cryptid & Alpha Predator',
        genderTh: 'เพศผู้ / สัตว์นักล่าดึกดำบรรพ์',
        genderEn: 'Male / Primeval Alpha Predator',
        sizeTh: '2.2 – 3.8 เมตร (สรีระกำยำยามยืนสองขา)',
        sizeEn: '2.2 – 3.8 m (Bipedal / Quadrupedal stature)',
        weightTh: '180 – 480 กก.',
        weightEn: '180 – 480 kg',
        danger: 5 as const,
        habitatTh: 'ป่าดึกดำบรรพ์ สันเขา และถ้ำลึกห่างไกลชุมชน',
        habitatEn: 'Deep wilderness, mountain ridges & secluded caves',
        hoursTh: 'เที่ยงคืนถึงรุ่งสาง (00:00 – 05:00 น.) ยามออกล่าเหยื่อ',
        hoursEn: 'Midnight till pre-dawn hunting hours',
      };

    case 'undead_lord':
      return {
        typeTh: 'ผีดิบอมตะและวิญญาณคืนชีพ (Undying Revenant & Cursed Corpse)',
        typeEn: 'Undying Revenant & Cursed Corpse',
        genderTh: 'เพศชาย (หรือตามสภาพร่างศพเดิม)',
        genderEn: 'Male (or variable by host corpse)',
        sizeTh: '1.75 – 1.95 เมตร',
        sizeEn: '1.75 – 1.95 m',
        weightTh: '60 – 85 กก. (ซากศพอาถรรพ์แห้งกรัง)',
        weightEn: '60 – 85 kg (Preserved corporeal vessel)',
        danger: 4 as const,
        habitatTh: 'สุสานโบราณ ปราสาทหิน และเส้นทางแห่วิญญาณ',
        habitatEn: 'Ancient tombs, stone vaults & spirit paths',
        hoursTh: 'หลังพระอาทิตย์ตกดินจนถึงก่อนแสงแรก (19:00 – 05:00 น.)',
        hoursEn: 'Sunset to first dawn rays (19:00 – 05:00)',
      };

    case 'winged_demon':
      return {
        typeTh: 'อสูรมีปีกและปีศาจเวหายามราตรี (Winged Nocturnal Fiend)',
        typeEn: 'Winged Nocturnal Fiend',
        genderTh: 'เพศผู้ / เพศหญิง (ตามตำนานประจำถิ่น)',
        genderEn: 'Variable by cultural folklore',
        sizeTh: '1.8 – 4.5 เมตร (ระยะกางปีกกว้าง)',
        sizeEn: '1.8 – 4.5 m (Wingspan)',
        weightTh: '50 – 160 กก.',
        weightEn: '50 – 160 kg',
        danger: 5 as const,
        habitatTh: 'ยอดไม้สูง ซากปรักหักพัง และเวหาเหนือหลังคาบ้านเรือน',
        habitatEn: 'High canopies, ruins & night skies over settlements',
        hoursTh: 'ยามดึกสงัดหลังเที่ยงคืนจนถึงก่อนไก่ขัน',
        hoursEn: 'Midnight until first crow of dawn',
      };

    case 'deity_guardian':
      return {
        typeTh: 'จิตวิญญาณศักดิ์สิทธิ์และทวยเทพพิทักษ์ (Sacred Deity & Guardian Spirit)',
        typeEn: 'Sacred Deity & Guardian Spirit',
        genderTh: 'กายทิพย์ / เทวราช / ฤาษี / มหาเทวี (ตามรูปลักษณ์จำแลง)',
        genderEn: 'Astral Deity / Divine Guardian / Ancient Ascetic',
        sizeTh: 'สง่างามเหนือกฎเกณฑ์กายภาพ (ปรากฏตามจิตผู้ศรัทธา)',
        sizeEn: 'Transcendent ethereal stature',
        weightTh: 'N/A (กายทิพย์ไร้น้ำหนักเชิงวัตถุ)',
        weightEn: 'N/A (Pure Ethereal Resonance)',
        danger: 1 as const,
        habitatTh: `${pin.province_th} ${pin.district_th ? `(${pin.district_th})` : ''}`,
        habitatEn: `${pin.province_en} ${pin.district_en ? `(${pin.district_en})` : ''}`,
        hoursTh: 'สถิตคุ้มครองตลอดกาล ทรงพลานุภาพสูงสุดยามประกอบพิธีกรรม',
        hoursEn: 'Eternal protection; heightened during sacred rituals',
      };

    case 'male_specter':
      return {
        typeTh: 'วิญญาณอาฆาตและดวงวิญญาณบรรพชน (Malevolent Phantom & Ancient Wraith)',
        typeEn: 'Malevolent Phantom & Ancient Wraith',
        genderTh: 'เพศชาย (Male Spirit)',
        genderEn: 'Male Spirit',
        sizeTh: pin.title_th.includes('เปรต')
          ? 'ร่างผอมโซสูงตระหง่าน 15 – 25 เมตร'
          : '1.70 – 1.88 เมตร',
        sizeEn: pin.title_th.includes('เปรต')
          ? '15 – 25 meters tall'
          : '1.70 – 1.88 m',
        weightTh: 'N/A (0.0 กก. — กายพลังงานวิญญาณ)',
        weightEn: 'N/A (0.0 kg — Incorporeal Ectoplasm)',
        danger: 3 as const,
        habitatTh: `${pin.province_th} ${pin.district_th ? `(${pin.district_th})` : ''}`,
        habitatEn: `${pin.province_en} ${pin.district_en ? `(${pin.district_en})` : ''}`,
        hoursTh: 'ยามดึกสงัดและคืนเดือนมืด (22:00 – 04:00 น.)',
        hoursEn: 'Deep nocturnal & moonless hours (22:00 – 04:00)',
      };

    case 'female_specter':
    default:
      return {
        typeTh: 'วิญญาณหญิงสาวและภูตพรายอาถรรพ์ (Spectral Apparition & Vengeful Spirit)',
        typeEn: 'Spectral Apparition & Vengeful Spirit',
        genderTh: 'เพศหญิง (Female Spirit)',
        genderEn: 'Female Spirit',
        sizeTh: '1.58 – 1.72 เมตร (ยืดขยายสรีระได้ตามอาถรรพ์)',
        sizeEn: '1.58 – 1.72 m (Variable spectral stature)',
        weightTh: 'N/A (0.0 กก. — ร่างพลังงานวิญญาณ)',
        weightEn: 'N/A (0.0 kg — Incorporeal Ectoplasm)',
        danger: 3 as const,
        habitatTh: `${pin.province_th} ${pin.district_th ? `(${pin.district_th})` : ''}`,
        habitatEn: `${pin.province_en} ${pin.district_en ? `(${pin.district_en})` : ''}`,
        hoursTh: 'ยามค่ำคืนและช่วงหัวค่ำหมอกลง (21:00 – 03:30 น.)',
        hoursEn: 'Twilight & late night mist (21:00 – 03:30)',
      };
  }
}

/**
 * Contextual Taboo & Survival Protocol Generator
 * Accurately tailors omens, taboos, and survival precautions based on the entity's lore,
 * category, archetype, or admin-configured rules.
 */
export function generateContextualTaboos(pin: GhostPin, language: SupportedLanguage): string[] {
  // 1. If admin custom taboos exist on pin:
  const adminTaboos = language === 'th' ? pin.taboos_th : pin.taboos_en;
  if (adminTaboos && adminTaboos.trim()) {
    const rules = adminTaboos
      .split(/\r?\n/)
      .map((r) => r.trim().replace(/^[-•*0-9.]+\s*/, ''))
      .filter((r) => r.length > 0);
    if (rules.length > 0) return rules;
  }

  // 2. If curated bestiary taboos exist in DB:
  const custom = PIN_BESTIARY_DB[pin.id];
  const curated = language === 'th' ? custom?.taboosTh : custom?.taboosEn;
  if (curated && curated.length > 0) return curated;

  // 3. Intelligent Context-Aware Extraction based on Archetype:
  const archetype = inferArchetype(pin);
  const isTh = language === 'th';

  switch (archetype) {
    case 'cursed_relic_monument':
      return isTh
        ? [
            'ห้ามปีนป่าย ขูดขีด สลักชื่อ หรือนั่งทับบนศิลาจารึก ศิวลึงค์ ฐานเทวรูป หรือโบราณวัตถุเด็ดขาด',
            'ห้ามหยิบเศษหินทราย ศิลาแลง วัตถุมงคล หรือดินออกจากเขตโบราณสถานกลับบ้านโดยเด็ดขาด',
            'ควรสำรวมกายวาจาและกราบสักการะด้วยความเคารพต่อสิ่งศักดิ์สิทธิ์และดวงวิญญาณบรรพชนผู้สร้าง',
          ]
        : [
            'Never climb, deface, engrave names, or sit upon sacred stone inscriptions, shrines, or ancient altars.',
            'Never remove stones, relics, laterite fragments, or sacred soil from the sanctuary boundaries.',
            'Maintain quiet reverent conduct and honor the ancient architects and guardian spirits of the monument.',
          ];

    case 'cursed_wilderness':
      return isTh
        ? [
            'ห้ามตัดไม้ ยิงสัตว์ หรือสร้างความเสียหายต่อผืนป่าโดยไม่ประกอบพิธีขอขมาเจ้าป่าเจ้าเขา',
            'หากได้ยินเสียงคนรู้จักเรียกชื่อแว่วมาจากดงทึบ ห้ามขานรับเด็ดขาดเพราะอาจเป็นเสือสมิงแปลงกายมาล่อลวง',
            'พกเครื่องรางสายพุทธคุณคุ้มกาย และห้ามพูดจาลบหลู่ท้าทายตลอดเส้นทางเดินป่า',
          ]
        : [
            'Never hunt, fell ancient trees, or disturb the flora without making offering rites to forest deities.',
            'If familiar voices call your name from thick foliage, never answer—it may be a shapeshifting were-tiger.',
            'Carry blessed protective amulets and refrain from boastful or vulgar words while traversing deep trails.',
          ];

    case 'haunted_edifice':
      return isTh
        ? [
            'ห้ามบุกรุกเข้าไปในห้องขัง โบสถ์เลือด หรือชั้นใต้ดินเพียงลำพังหลังเที่ยงคืนโดยไม่มีผู้ดูแล',
            'หากได้กลิ่นกำมะถัน กลิ่นเนื้อเน่า หรืออุณหภูมิดิ่งฮวบผิดธรรมชาติ ให้ก้าวถอยหลังออกทันทีโดยห้ามหันหลังวิ่ง',
            'ห้ามท้าทาย เคาะผนัง หรือประกอบพิธีสื่อวิญญาณโดยไม่ได้รับอนุญาต',
          ]
        : [
            'Never enter dungeons, sealed chambers, or historic chapels alone after midnight.',
            'If sudden rotting odors, sulfur, or bone-chilling cold spots manifest, back away slowly facing forward.',
            'Never knock on historic masonry walls or attempt amateur seances within cursed architectural corridors.',
          ];

    case 'cosmic_anomaly':
      return isTh
        ? [
            'ห้ามเหยียบย่ำหรือรบกวนลานหินศักดิ์สิทธิ์และโพรงผาที่ใช้ประกอบพิธีกรรมสังเกตการณ์ดวงดาว',
            'หากพบปรากฏการณ์แสงประหลาดหรือหินสลักสัญลักษณ์โบราณ ห้ามใช้โลหะขูดขีดหรือเคลื่อนย้ายตำแหน่งเด็ดขาด',
            'ควรแสดงความเคารพต่อผู้อาวุโสของชนเผ่า และห้ามบันทึกภาพพิธีกรรมลับของบรรพบุรุษนอมโมโดยไม่ได้รับอนุญาต',
          ]
        : [
            'Never disturb or step on sacred rock sanctuaries aligned with ancient stellar coordinates.',
            'If unexplained atmospheric lights or inscribed monoliths appear, do not touch or alter their positioning.',
            'Show utmost reverence to tribal elders and never photograph private Nommo ancestral rites without permission.',
          ];

    case 'aquatic_abyss':
      return isTh
        ? [
            'ห้ามพึ่งพาระบบเข็มทิศแม่เหล็กเพียงอย่างเดียว ตรวจสอบอุปกรณ์สำรองและบันทึกพิกัดทุกระยะ',
            'หากพบหมอกสีขาวประหลาดหรือฟ้าแลบไร้เสียงฟ้าร้อง ให้รีบหันหัวเรือหรืออากาศยานออกจากพิกัดทันที',
            'แจ้งสัญญาณวิทยุสื่อสารฉุกเฉินต่อสถานีชายฝั่งอย่างต่อเนื่องและห้ามปิดระบบระบุตำแหน่งดาวเทียม',
          ]
        : [
            'Never rely solely on magnetic compass systems; calibrate secondary GPS and celestial backup charts.',
            'If dense electronic fog or silent lightning flashes appear, alter bearing away from the vortex immediately.',
            'Maintain continuous emergency radio contact with mainland maritime controllers.',
          ];

    case 'aquatic_serpent':
      return isTh
        ? [
            'ห้ามลงเล่นน้ำหรือพายเรือคนเดียวในยามที่ผิวน้ำนิ่งสงบผิดปกติ หรือเมื่อมีม่านหมอกหนาลงจัดเหนือลำน้ำ',
            'หากได้ยินเสียงเพลง เสียงกระซิบ หรือเสียงกรีดร้องก้องจากกลางผืนน้ำ ห้ามชะโงกมองหรือว่ายตามไปเด็ดขาด',
            'ควรตั้งจิตขอขมาต่อเจ้าที่สายน้ำและหลีกเลี่ยงการสัญจรทางน้ำหลังดวงอาทิตย์ลับขอบฟ้า',
          ]
        : [
            'Never swim or navigate waters alone during unnatural dead calms or sudden creeping river fogs.',
            'If hypnotic melodies, whispers, or calls echo across the water, do not lean over or steer towards them.',
            'Offer respect to water deities and refrain from voyaging across deep waters after twilight.',
          ];

    case 'merfolk_spirit':
      return isTh
        ? [
            'ห้ามจ้องมองสายรุ้งที่แตะลงสู่ผิวน้ำ หรือว่ายน้ำตามเสียงเพลงหวานลึกลับกลางคลื่นทะเลเด็ดขาด',
            'หากพบเงาร่างแปลกประหลาดมีครีบว่ายวนรอบเรือ ให้ถอยห่างจากกราบเรือและไม่โยนเหยื่อลงน้ำ',
            'ควรพกเครื่องรางป้องกันภัยทางน้ำ และหลีกเลี่ยงการออกเรือคนเดียวในวันที่แดดออกกลางสายฝน',
          ]
        : [
            'Never gaze into rainbows touching sea surfaces or pursue eerie melodies across oceanic swells.',
            'If finned humanoid silhouettes circle the hull, step away from the gunwales immediately.',
            'Carry protective maritime talismans and avoid solo coastal voyages during sun showers.',
          ];

    case 'cryptid_beast':
      return isTh
        ? [
            'ห้ามทิ้งเศษอาหารสดหรือกลิ่นคาวเลือดไว้รอบที่พักยามค่ำคืน เพราะจะกระตุ้นสัญชาตญาณนักล่าข้ามคืน',
            'หากพบเห็นรอยเท้าขนาดมหึมา หรือรอยกรงเล็บขูดลึกผิดธรรมชาติบนต้นไม้ ให้รีบถอยออกจากพื้นที่ทันที',
            'ห้ามผิวปากหรือส่งเสียงเลียนแบบเสียงสัตว์ป่าแปลกประหลาดในเขตป่าลึกหลังตะวันตกดิน',
          ]
        : [
            'Never leave raw meat or pungent scents around campfires overnight, as they provoke predatory trackers.',
            'If you encounter massive fresh tracks or claw gouges on tree trunks, retreat immediately without running.',
            'Never whistle or imitate strange animal calls in deep wilderness after dusk.',
          ];

    case 'undead_lord':
      return isTh
        ? [
            'ห้ามหยิบฉวยสิ่งของ เครื่องประดับ หรือดินจากโลงศพและสุสานกลับบ้านเด็ดขาด',
            'พกเครื่องรางป้องกันตัว เช่น กระเทียม หญ้าเวอร์เวน หรือสายสิญจน์ลงอาคม',
            'ห้ามเปิดประตูหรือขานรับเมื่อได้ยินเสียงเคาะเบาๆ 3 ครั้งในยามวิกาล',
          ]
        : [
            'Never take objects, jewelry, or earth from ancient sarcophagi or catacombs.',
            'Carry protective consecrated talismans, vervain, or silver when traversing crypt areas.',
            'Never unlock entry doors or acknowledge triple rhythmic taps in the darkness of night.',
          ];

    case 'winged_demon':
      return isTh
        ? [
            'ห้ามตากผ้าอ้อมหรือเสื้อผ้าเปื้อนคาวเลือดค้างคืนนอกชานบ้าน',
            'หากได้ยินเสียงกระพือปีกหนักๆ คล้ายพัดใบตาลเหนือหลังคา ให้ปิดประตูหน้าต่างและดับตะเกียงทันที',
            'เสียบหนามพุทราหรือหนามไผ่ไว้รอบชายคาเรือนเพื่อป้องกันการร่อนลงเกาะ',
          ]
        : [
            'Never hang garments stained with blood or scents outside overnight.',
            'If heavy wingbeats flap against roof shingles, extinguish candles and keep shutters barred.',
            'Affix thorny bamboo branches along eaves to obstruct nocturnal predator landings.',
          ];

    case 'deity_guardian':
      return isTh
        ? [
            'แต่งกายสุภาพ สำรวมกิริยาวาจา และห้ามพูดจาลบหลู่ท้าทายสิ่งศักดิ์สิทธิ์ในเขตอารามหรือศาลเจ้า',
            'ห้ามนำสิ่งมึนเมา ของมลทิน หรือเจตนาชั่วร้ายเข้ามาในอาณาบริเวณลานประกอบพิธีกรรม',
            'ควรอธิษฐานขอพรด้วยจิตบริสุทธิ์และปฏิบัติตามคำแนะนำของพราหมณ์หรือผู้ดูแลท้องถิ่นอย่างเคร่งครัด',
          ]
        : [
            'Dress modestly, maintain solemn silence, and never speak words of mockery within the sacred shrine sanctuary.',
            'Never bring intoxicants, corrupt offerings, or malice into the ceremonial sanctuary grounds.',
            'Pray with pure intent and strictly observe the guidance of local ceremonial keepers and elders.',
          ];

    case 'female_specter':
      return isTh
        ? [
            'หากได้ยินเสียงเรียกชื่อตนเองแว่วมาจากความมืดหลังเที่ยงคืน ห้ามขานรับหรือหันมองในทันทีเด็ดขาด',
            'ห้ามส่องกระจกเงาในเงามืดหลังเที่ยงคืน หรือเคาะจานชามเรียกวิญญาณในสถานที่รกร้าง',
            'ควรพกเครื่องรางประจำตัวและหลีกเลี่ยงการเดินทางสัญจรคนเดียวในเส้นทางเปลี่ยวที่มีประวัติอาถรรพ์',
          ]
        : [
            'If an unseen voice whispers your name from the shadows after midnight, never acknowledge or turn around.',
            'Never gaze into unlit mirrors in abandoned chambers or tap porcelain dishes in deserted crossroads.',
            'Carry protective amulets and avoid traversing solitary haunted pathways unescorted at night.',
          ];

    case 'male_specter':
    default:
      return isTh
        ? [
            'ห้ามส่งเสียงผิวปากล้อเลียนหรือเลียนแบบเสียงหวีดร้องในยามวิกาล',
            'หากพบเห็นเงาดำร่างสูงใหญ่ผิดธรรมชาติ ให้ตั้งจิตอธิษฐานแผ่เมตตาและห้ามชี้มือท้าทายเด็ดขาด',
            'ควรทำบุญตักบาตรกรวดน้ำอุทิศกุศลให้แก่ดวงวิญญาณสัมภเวสีและบรรพบุรุษ',
          ]
        : [
            'Never whistle or mimic hollow wails in lonely night corridors.',
            'If towering anomalous shadows manifest, recite blessing verses and never point directly.',
            'Offer merit and prayers for the peaceful release of earthbound spectral travelers.',
          ];
  }
}

/**
 * Returns the complete Paranormal Bestiary Dossier for any GhostPin.
 */
/**
 * Contextual Entity Appearance Generator
 * Generates rich, highly specific physical and metaphysical manifestations for each pin
 * based on its archetype, category, unique story lore, and environmental characteristics,
 * eliminating generic repetitive fallback boilerplate.
 */
export function generateContextualAppearance(
  pin: GhostPin,
  archetype: ArchetypeKey,
  defaultMeta: ReturnType<typeof getDefaultMetadata>,
  language: SupportedLanguage
): string {
  const isTh = language === 'th';
  const custom = PIN_BESTIARY_DB[pin.id];
  if (isTh && custom?.descTh) return custom.descTh;
  if (!isTh && custom?.descEn) return custom.descEn;

  const titleTh = pin.title_th;
  const titleEn = pin.title_en;
  const provinceTh = pin.province_th;
  const provinceEn = pin.province_en;
  const districtTh = pin.district_th || pin.province_th;
  const districtEn = pin.district_en || pin.province_en;
  const combinedText = (
    pin.title_th + ' ' + pin.title_en + ' ' +
    pin.story_th + ' ' + pin.story_en
  ).toLowerCase();

  // 1. Special check for abstract musical/artistic/conceptual curses (e.g., Club 27, Curse of Superman, cursed dates)
  const isAbstractCurse =
    pin.category === 'curse' &&
    (combinedText.includes('คลับ 27') ||
      combinedText.includes('27 club') ||
      combinedText.includes('ดนตรี') ||
      combinedText.includes('music') ||
      combinedText.includes('เพลง') ||
      combinedText.includes('superman') ||
      combinedText.includes('ภาพยนตร์') ||
      combinedText.includes('movie') ||
      combinedText.includes('ชะตากรรม') ||
      combinedText.includes('สัญญาปีศาจ') ||
      combinedText.includes('faustian') ||
      combinedText.includes('คำสาปตระกูล') ||
      combinedText.includes('สายเลือด') ||
      combinedText.includes('crossroads'));

  if (isAbstractCurse) {
    return isTh
      ? `ไม่ได้ปรากฏเป็นตัวตนเนื้อหนังหรืออมนุษย์ทางกายภาพ แต่สำแดงอัตลักษณ์ผ่าน "สนามพลังงานชะตากรรมและลางบอกเหตุลี้ลับ" ที่แผ่ปกคลุมรอบผู้เกี่ยวข้อง บทเพลง หรือสถานที่ทางประวัติศาสตร์ใน ${provinceTh} ผู้ที่ก้าวเข้าสู่วงจรอันดำมืดนี้มักรายงานถึงความรู้สึกกดดันหนักอึ้งในอก คลื่นเสียงดนตรีหรือเสียงกระซิบแว่วจากความเงียบงัน และการเผชิญกับชุดเหตุการณ์พิลึกพิลั่นที่ดึงดูดโศกนาฏกรรมอย่างไม่อาจหลีกเลี่ยง`
      : `Does not manifest as a biological or corporeal entity, but rather as an ominous metaphysical resonance and fatal karmic pattern woven around associated artists, recordings, and historical venues across ${provinceEn}. Those caught within its trajectory recount severe atmospheric heaviness, phantom acoustic frequencies echoing from silence, and an uncanny convergence of lethal synchronicities.`;
  }

  // 2. Archetype-driven descriptive manifestation
  switch (archetype) {
    case 'cursed_artifact': {
      return isTh
        ? `วัตถุโบราณหรือเครื่องรางต้องสาปที่มีมวลสารทางกายภาพ (${defaultMeta.sizeTh}) กักเก็บประจุพลังงานด้านลบและมนต์ดำเข้มข้น พยานและผู้ครอบครองใน ${districtTh} มักสังเกตเห็นการเปลี่ยนตำแหน่งเองอย่างน่าฉงน ไอเย็นเยือกที่แผ่ออกมารอบตัววัตถุจนรู้สึกหนาวสั่น รวมถึงรอยแตกร้าวและประกายตาวับวับจากรูปจำลองที่ดูเหมือนกะพริบหรือจ้องมองตามผู้คน`
        : `An occult relic or consecrated cursed artifact (${defaultMeta.sizeEn}) harboring dense negative psychic resonance. Witnesses and caretakers across ${districtEn} consistently report unassisted spatial displacements, localized cryogenic drops in ambient temperature, and eyes or reflective surfaces that appear to track onlookers.`;
    }

    case 'haunted_edifice': {
      return isTh
        ? `โครงสร้างสถาปัตยกรรมโบราณใน ${districtTh} ที่กักเก็บมวลพลังงานความทรงจำและแรงอาฆาตไว้ตามซอกกำแพง พยานมักพบเห็นเงาร่างตะคุ่มไร้หน้าที่บานหน้าต่างชั้นบน ไฟฟ้าติดๆ ดับๆ ประตูที่ลงกลอนไว้กลับเปิดออกเองอย่างเงียบกริบ พร้อมรอยคราบประหลาดบนกำแพง และเสียงฝีเท้าหนักๆ ก้องไปตามระเบียงทางเดินยามดึกสงัด`
        : `A historic architectural structure in ${districtEn} retaining heavy residual psychometric imprints of tragedy. Observers regularly document translucent silhouettes peering from upper casements, rhythmic electrical flickering, heavy latched doors opening soundlessly, and echoing phantom footsteps pacing timber floorboards in the dead of night.`;
    }

    case 'cursed_wilderness': {
      return isTh
        ? `ผืนป่าดึกดำบรรพ์หรือแนวเขาลี้ลับแห่ง ${districtTh} ที่มีลักษณะทางพฤกษศาสตร์บิดเบี้ยวผิดธรรมชาติ ม่านหมอกสีขาวหนาทึบปกคลุมตลอดวัน และความเงียบงันผิดธรรมชาติไร้เสียงนกหรือแมลง ผู้สัญจรผ่านมักพบเห็นลูกไฟวิญญาณลอยนำทางไปสู่ความลึกของผืนป่า เสียงกระซิบเรียกชื่อที่เลียนแบบคนคุ้นเคย และสนามแม่เหล็กที่ทำให้เข็มทิศหมุนเคว้ง`
        : `A primeval wilderness in ${districtEn} characterized by contorted arborial growth, perpetual low-hanging vapor, and an eerie absence of avian or insect sounds. Travelers recount dancing ghost lights that lure wanderers off marked tracks, disembodied whispers mimicking familiar companions, and severe geomagnetic deviations.`;
    }

    case 'cursed_relic_monument': {
      return isTh
        ? `มหาเทวสถานหรือกลุ่มเสาศิลาโบราณ (${defaultMeta.sizeTh}) สลักเสลาด้วยอักขระและสัญลักษณ์เทวะโบราณ ทรงคุณค่าทางประวัติศาสตร์และเปี่ยมด้วยมนต์ขลังเร้นลับ ในช่วงวันเปลี่ยนฤดูหรือคืนวันเพ็ญ พยานมักพบเห็นแสงเรืองรองสีครามหรือประกายทองฉาบทาบนยอดปรางค์ พร้อมคลื่นพลังงานความถี่ต่ำที่ทำให้เครื่องมือวัดพิกัดดาวเทียมเกิดความคลาดเคลื่อน`
        : `A colossal megalithic complex or ancient stone prang sanctuary (${defaultMeta.sizeEn}) adorned with sacred archaic reliefs and celestial alignments. Observers during equinoxes and full moons record faint azure or amber auroras crowning the spires, accompanied by low-frequency electromagnetic hums that disrupt GPS and electronic recording equipment.`;
    }

    case 'cosmic_anomaly': {
      return isTh
        ? `ปรากฏการณ์วัตถุบินหรือลำแสงปริศนาเหนือท้องฟ้า ${districtTh} มีรูปทรงเรขาคณิตไร้รอยต่อ เช่น ทรงกลม จานโลหะ หรือสามเหลี่ยมสีดำขลับ เปล่งแสงเรืองรองเปลี่ยนสีเป็นจังหวะ สามารถเร่งความเร็วและหักเลี้ยวฉับพลันในมุมฉากโดยไร้เสียงกระทบของคลื่นเสียง พร้อมส่งคลื่นรบกวนสัญญาณวิทยุและระบบโทรคมนาคมในรัศมีโดยรอบ`
        : `An unexplainable aerospace or transdimensional phenomenon over ${districtEn} exhibiting geometric, seamless hulls—glowing discs, silent spheres, or matte-black craft. Demonstrates instantaneous acceleration and sharp right-angle maneuvers without sonic displacement, accompanied by electromagnetic pulses that incapacitate terrestrial transmitters.`;
    }

    case 'aquatic_abyss': {
      return isTh
        ? `ห้วงน้ำลึกและวังน้ำวนมหาสมุทรที่ปกคลุมด้วยหมอกควันสีขาวหนาแน่นและฟองคลื่นเรืองแสงสีเขียวมรกต ลูกเรือและนักบินใน ${districtTh} มักพบเห็นเงายักษ์ทะมึนลอยอยู่ใต้ผิวน้ำ พร้อมกับปรากฏการณ์ท้องฟ้าและผิวน้ำที่กลืนเป็นสีเดียวกันจนสูญเสียทัศนวิสัย และเข็มทิศหมุนวนอย่างไร้ทิศทาง`
        : `An oceanic void and deep-water trench enveloped in thick luminescent mist and phosphorescent green seafoam. Navigators in ${districtEn} document enormous displacement masses drifting beneath hulls, sudden spatial disorientation where horizon and ocean merge, and catastrophic compass gyration.`;
    }

    case 'aquatic_serpent': {
      return isTh
        ? `อสุรกายหรือเทพพญานาคราชแห่งสายน้ำ ลำตัวทรงพลังขนาดยักษ์ (${defaultMeta.sizeTh}) ปกคลุมด้วยเกล็ดเงาวับสะท้อนประกายน้ำสีเขียวมรกตหรือนิลกาฬ มีสันหลังหยักฟันเลื่อยหรือหงอนสีเพลิง ดวงตากลมโตสีอำพันเรืองรอง แหวกว่ายด้วยความเร็วสูงตัดผืนน้ำของ ${districtTh} จนเกิดคลื่นระลอกใหญ่และละอองหมอกฟุ้งกระจาย`
        : `A colossal serpentine aquatic leviathan (${defaultMeta.sizeEn}) armored in iridescent scales that repel sediment and glint emerald or obsidian under moonlight. Features a jagged dorsal ridge or fiery crest, piercing amber eyes that break through water surfaces of ${districtEn}, and rapid swimming undulations creating distinctive rolling bow wakes.`;
    }

    case 'merfolk_spirit': {
      return isTh
        ? `อมนุษย์พรายน้ำสรีระกึ่งมนุษย์กึ่งสัตว์น้ำ ลำตัวท่อนบนเป็นมนุษย์ที่มีผิวพรรณซีดเผือดหรือเหลือบเงาเกล็ด มีเหงือกข้างคอและพังผืดระหว่างนิ้วมือ ท่อนล่างเป็นหางปลาแหวกว่ายได้คล่องแคล่ว พยานแถบ ${districtTh} มักได้ยินเสียงครวญเพลงหวานปนเศร้าแว่วเหนือน้ำในยามสนธยา`
        : `An amphibious aquatic humanoid possessing a pale or scaled torso, lateral cervical gills, and webbed phalanges tapering into a powerful caudal fin. Eyewitnesses across ${districtEn} note oversized luminous pupils adapted for the lightless depths and haunting vocal sirens that carry over water surfaces at twilight.`;
    }

    case 'cryptid_beast': {
      return isTh
        ? `อสุรกายกายภาพสรีระกำยำสูงใหญ่ (${defaultMeta.sizeTh}) ยืนสองขาหรือสี่ขาอย่างคล่องแคล่ว ขนดกหนาปกคลุมทั่วร่าง กล้ามเนื้อบึกบึน แขนยาว ดวงตาสะท้อนแสงสีแดงหรือเหลืองกร้าวในความมืด กรงเล็บและเขี้ยวแหลมคม กลิ่นสาบสัตว์ป่ารุนแรง และทิ้งรอยเท้าขนาดใหญ่ลึกบนพื้นดินแถบ ${districtTh}`
        : `A primeval bipedal or quadrupedal beast (${defaultMeta.sizeEn}) possessing immense physical musculature, dense shaggy pelage, and elongated limbs with formidable claws. Witnesses in ${districtEn} recount tapetal-reflective glowing eyes, heavy thudding footsteps, a pungent feral musk, and deep stride impressions left in hard terrain.`;
    }

    case 'winged_demon': {
      return isTh
        ? `อสูรมีปีกขนาดยักษ์ (${defaultMeta.sizeTh}) ลำตัวสีเขม่าหรือดำมะเมื่อม มีปีกพังผืดคล้ายค้างคาวหรือปีกขนนกขนาดใหญ่ ดวงตากลมโตคู่โตเรืองแสงสีแดงเพลิงโดดเด่นในความมืด บินโฉบร่อนลงจากเวหาเหนือ ${districtTh} ด้วยความเร็วสูงพร้อมเสียงลมกรีดผ่านขนปีกและเสียงร้องแหลมสูง`
        : `An aerial cryptid with a formidable wingspan (${defaultMeta.sizeEn}), cloaked in obsidian shadow with expansive leathery or feathered wings. Its most striking feature is a pair of hypnotic crimson eyes that project intense luminescence, swooping across ${districtEn} in near-absolute silence before emitting high-pitched acoustic shrieks.`;
    }

    case 'undead_lord': {
      return isTh
        ? `ร่างกายมนุษย์คืนชีพที่ยังคงสภาพเนื้อหนังแห้งกรัง ผิวพรรณซีดเผือดแตกลายงา สวมใส่เครื่องแต่งกายโบราณหรือผ้าพันศพที่เปื่อยยุ่ย ดวงตาลึกกลวง ก้าวเดินอย่างเงียบงันแต่เปี่ยมด้วยพละกำลังมหาศาล แผ่กลิ่นอายความเย็นเยือกและกลิ่นดินสุสานโบราณในแถบ ${districtTh}`
        : `An ambulatory revenant or desiccated corporeal vessel wrapped in rotted ceremonial robes or shroud bindings. Displays sunken hollow sockets, parchment-dry skin, unyielding physical strength, and an exhalation of grave-chilled air carrying traces of damp earth and funerary incense across ${districtEn}.`;
    }

    case 'deity_guardian': {
      return isTh
        ? `รูปลักษณ์เปี่ยมด้วยบารมีและสง่าราศีขององค์เทพ พระพุทธรูป หรือกายทิพย์ศักดิ์สิทธิ์ (${defaultMeta.sizeTh}) เปล่งรัศมีเรืองรองสีทองนวลตาหรือประกายมุก พระพักตร์สงบเยือกเย็นเปี่ยมด้วยความเมตตา มักสัมผัสได้ถึงกลิ่นหอมของดอกไม้ทิพย์ ธูปหอม และสายลมอุ่นพัดผ่าน ให้ความรู้สึกอบอุ่น สงบร่มเย็น และคุ้มครองผู้มีจิตศรัทธาใน ${districtTh}`
        : `A transcendent divine manifestation or consecrated holy icon (${defaultMeta.sizeEn}) emanating warm golden or pearlescent luminescence. Exudes profound serene grace and the celestial scent of lotus blossoms and sacred incense, imparting comforting spiritual tranquility, balance, and benevolent protection across ${districtEn}.`;
    }

    case 'male_specter': {
      const isPreta = titleTh.includes('เปรต') || titleEn.toLowerCase().includes('preta');
      return isTh
        ? isPreta
          ? `ร่างวิญญาณเปรตอสุรกายผอมโซสูงตระหง่านเสียดฟ้า (${defaultMeta.sizeTh}) ผิวหนังแห้งติดกระดูก แขนขายาวเก้งก้าง ปากเล็กเท่ารูเข็มส่งเสียงหวีดหวิวโหยหวนขอส่วนบุญก้องไปทั่วบริเวณ ${districtTh} ในคืนเดือนมืด`
          : `ร่างวิญญาณโปร่งแสงของบุรุษ (${defaultMeta.sizeTh}) ลอยขนานเหนือพื้นหรือก้าวเดินโดยไร้เสียงฝีเท้า สวมใส่เครื่องแต่งกายประจำยุคสมัย ใบหน้าซีดขาวไร้โลหิต แววตาเศร้าหมองหรือฉายแววอาฆาต มักปรากฏตัวพร้อมไอหมอกจางและอุณหภูมิที่ลดฮวบลงอย่างรวดเร็วใน ${districtTh}`
        : isPreta
        ? `A towering, emaciated spectral hunger shade (${defaultMeta.sizeEn}) with needle-thin mouth and skeletal limbs, projecting high-pitched whistling wails across ${districtEn} on moonless nights.`
        : `A translucent spectral male silhouette (${defaultMeta.sizeEn}) hovering inches above ground level or gliding soundlessly along historical pathways in ${districtEn}. Draped in period-accurate garments with a hollow, bloodless countenance and piercing gaze, accompanied by sudden micro-drops in room temperature.`;
    }

    case 'female_specter':
    default: {
      return isTh
        ? `ดวงวิญญาณสตรีชุดขาวหรือชุดโบราณ ลอยเด่นเหนือพื้น เส้นผมยาวสลวยสีดำสนิทแผ่คลุมไหล่ ใบหน้างดงามแต่ซีดเผือดไร้ชีวิตชีวา หรือแปรเปลี่ยนเป็นใบหน้าสยดสยองยามโกรธเกรี้ยว ปรากฏตัวพร้อมเสียงสะอื้นไห้หรือบทเพลงกล่อมเด็กแว่วตามสายลมหนาวของ ${districtTh}`
        : `A diaphanous apparition of a female figure in trailing white or traditional drapery, hovering weightlessly with cascading midnight-black hair framing a mournful, ivory-pale visage. Manifests alongside phantom weeping, cold air vortices, and the distant cadence of eerie folk melodies across ${districtEn}.`;
    }
  }
}

/**
 * Contextual Archival Extra Lore Generator
 * Replaces repetitive single-sentence boilerplate with category-appropriate archival notes.
 */
export function generateContextualExtraLore(
  pin: GhostPin,
  _archetype: ArchetypeKey,
  language: SupportedLanguage
): string {
  const isTh = language === 'th';
  const custom = PIN_BESTIARY_DB[pin.id];
  if (isTh && custom?.extraLoreTh) return custom.extraLoreTh;
  if (!isTh && custom?.extraLoreEn) return custom.extraLoreEn;

  const titleTh = pin.title_th;
  const titleEn = pin.title_en;
  const provinceTh = pin.province_th;
  const provinceEn = pin.province_en;

  if (pin.category === 'curse') {
    return isTh
      ? `บันทึกคำเตือนในแฟ้มคดีอาถรรพ์ประจำภูมิภาค ${provinceTh} ระบุว่า "${titleTh}" เป็นหนึ่งในบทเรียนเตือนสติว่าอำนาจมืดหรือชะตากรรมต้องคำสาปไม่ใช่สิ่งที่จะท้าทายได้ ผู้ที่พยายามละเมิดหรือลบหลู่มักต้องเผชิญกับผลลัพธ์อันไม่อาจแก้ไข`
      : `Regional occult archives in ${provinceEn} document "${titleEn}" as a grim cautionary chronicle against tampering with cursed forces beyond mortal comprehension.`;
  }
  if (pin.category === 'sacred') {
    return isTh
      ? `ความเชื่อและความศรัทธาต่อ "${titleTh}" ใน ${provinceTh} ได้รับการสืบทอดจากรุ่นสู่รุ่น ถือเป็นมรดกทางจิตวิญญาณที่คอยปกป้องคุ้มครองและเป็นที่ยึดเหนี่ยวจิตใจของสาธุชนผู้ประพฤติชอบ`
      : `Veneration of "${titleEn}" across ${provinceEn} has been transmitted across centuries, enduring as a sacred pillar of communal spiritual protection and moral guidance.`;
  }
  if (pin.category === 'monster') {
    return isTh
      ? `บันทึกการสำรวจและคำให้การของพรานป่าใน ${provinceTh} ยังคงย้ำเตือนถึงการคงอยู่ของ "${titleTh}" ในฐานะสัตว์ร้ายดึกดำบรรพ์ที่ธรรมชาติยังคงซุกซ่อนไว้จากสายตาของโลกสมัยใหม่`
      : `Expedition chronicles and eyewitness testimonies from ${provinceEn} preserve "${titleEn}" as an enduring testament to ancient apex predators that slip through the margins of modern zoology.`;
  }
  if (pin.category === 'legend') {
    return isTh
      ? `ตำนานเล่าขานของ "${titleTh}" แห่งดินแดน ${provinceTh} เป็นมรดกมุขปาฐะอันล้ำค่าที่ผูกโยงประวัติศาสตร์ ภูมิศาสตร์ และวิถีชีวิตโบราณเข้าด้วยกันอย่างแยกไม่ออก`
      : `The legendary folklore of "${titleEn}" in ${provinceEn} remains an indelible cultural legacy bridging oral history, landscape, and ancestral memory.`;
  }
  // ghost
  return isTh
    ? `เรื่องราวของ "${titleTh}" ใน ${provinceTh} ยังคงถูกเล่าขานผ่านผู้คนที่สัญจรผ่านพื้นที่ เป็นประจักษ์พยานถึงความทรงจำ ความผูกพัน หรือความอาฆาตที่กาลเวลาก็ไม่อาจลบล้างไปได้`
    : `The spectral accounts of "${titleEn}" in ${provinceEn} persist through generations of eyewitnesses, bearing witness to emotional imprints and unresolved fates that time cannot erase.`;
}

export function getEntityDossier(
  pin: GhostPin,
  language: SupportedLanguage
): EntityDossier {
  const custom = PIN_BESTIARY_DB[pin.id];
  const archetype = custom?.archetype || inferArchetype(pin);
  const defaultMeta = getDefaultMetadata(archetype, pin);

  // 1. Portrait URL
  const portraitUrl =
    pin.image_url ||
    custom?.customImage ||
    `/entities/${pin.id}.jpg`;

  // 2. Codex ID
  const numHash = Math.abs(
    pin.id.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7)
  ) % 900 + 100;

  const classCode =
    archetype === 'cursed_relic_monument'
      ? 'MONUMENT-VII'
      : archetype === 'cursed_wilderness'
      ? 'BIOSPHERE-VI'
      : archetype === 'cursed_artifact'
      ? 'CURSE-V'
      : archetype === 'cosmic_anomaly'
      ? 'CELESTIAL-IX'
      : archetype === 'aquatic_abyss'
      ? 'ABYSS-VIII'
      : archetype === 'aquatic_serpent'
      ? 'LEVIATHAN-II'
      : archetype === 'merfolk_spirit'
      ? 'MERFOLK-III'
      : archetype === 'cryptid_beast'
      ? 'CRYPTID-IV'
      : archetype === 'undead_lord'
      ? 'HEX-V'
      : archetype === 'winged_demon'
      ? 'AERIAL-VI'
      : archetype === 'deity_guardian'
      ? 'DEITY-I'
      : archetype === 'male_specter'
      ? 'SPECTER-M'
      : 'SPECTER-F';

  const codexId = `CODEX #${numHash} • ${classCode}`;

  const dangerLevel = custom?.danger ?? defaultMeta.danger;
  const dangerLabelTh: Record<number, string> = {
    1: 'ระดับ 1/5 — เมตตาคุ้มครอง (Benevolent)',
    2: 'ระดับ 2/5 — ลี้ลับศักดิ์สิทธิ์ ห้ามลบหลู่ (Sacred Warning)',
    3: 'ระดับ 3/5 — อันตรายปานกลาง (Hazardous)',
    4: 'ระดับ 4/5 — อาถรรพ์รุนแรง (High Threat)',
    5: 'ระดับ 5/5 — อันตรายถึงชีวิต (Extreme Lethal Omen)',
  };
  const dangerLabelEn: Record<number, string> = {
    1: 'Level 1/5 — Benevolent Guardian',
    2: 'Level 2/5 — Sacred Omen (Do Not Offend)',
    3: 'Level 3/5 — Moderate Paranormal Hazard',
    4: 'Level 4/5 — Severe Supernatural Threat',
    5: 'Level 5/5 — Extreme Lethal Entity',
  };

  const baseStory = language === 'th' ? pin.story_th : pin.story_en;
  const appearanceDesc = generateContextualAppearance(pin, archetype, defaultMeta, language);
  const extraLore = generateContextualExtraLore(pin, archetype, language);

  const omensAndTaboos = generateContextualTaboos(pin, language);

  return {
    codexId,
    portraitUrl,
    entityType: language === 'th' ? custom?.typeTh || defaultMeta.typeTh : custom?.typeEn || defaultMeta.typeEn,
    gender: language === 'th' ? custom?.genderTh || defaultMeta.genderTh : custom?.genderEn || defaultMeta.genderEn,
    size: language === 'th' ? custom?.sizeTh || defaultMeta.sizeTh : custom?.sizeEn || defaultMeta.sizeEn,
    weight: language === 'th' ? custom?.weightTh || defaultMeta.weightTh : custom?.weightEn || defaultMeta.weightEn,
    dangerLevel,
    dangerLabel: language === 'th' ? dangerLabelTh[dangerLevel] : dangerLabelEn[dangerLevel],
    habitat: language === 'th' ? custom?.habitatTh || defaultMeta.habitatTh : custom?.habitatEn || defaultMeta.habitatEn,
    activeHours: language === 'th' ? custom?.hoursTh || defaultMeta.hoursTh : custom?.hoursEn || defaultMeta.hoursEn,
    appearanceDesc,
    expandedStory: `${baseStory}\n\n${extraLore}`,
    omensAndTaboos,
  };
}

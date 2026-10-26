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

  // 1. Cosmic & Extraterrestrial Anomalies
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

  // 2. Cursed Wilderness, Sacred Mountains & Primeval Forests
  if (
    text.includes('ดงพญาเย็น') || text.includes('ดงพญาไฟ') ||
    text.includes('aokigahara') || text.includes('อาโอกิกาฮาระ') ||
    text.includes('hoia baciu') || text.includes('ฮอยา') ||
    text.includes('pine barrens') || text.includes('ป่าสน') ||
    text.includes('black forest') || text.includes('ป่าดำ') ||
    text.includes('dyatlov') || text.includes('ดยัตลอฟ') ||
    text.includes('ป่าดงดิบ') || text.includes('ป่าอาถรรพ์') ||
    text.includes('ผืนป่า') || text.includes('หุบเขาอาถรรพ์') ||
    text.includes('ดอยหลวง') || text.includes('wilderness') ||
    text.includes('เขาหลวง') || text.includes('ป่าช้า')
  ) {
    return 'cursed_wilderness';
  }

  // 3. Ancient Monuments, Sanctuaries, Pyramids, Ruins & Tombs
  if (
    text.includes('ปราสาทหิน') || text.includes('พนมรุ้ง') ||
    text.includes('phanom rung') || text.includes('เทวสถาน') ||
    text.includes('พีระมิด') || text.includes('pyramid') ||
    text.includes('sphinx') || text.includes('สฟิงซ์') ||
    text.includes('stonehenge') || text.includes('สโตนเฮนจ์') ||
    text.includes('moai') || text.includes('โมไอ') ||
    text.includes('terracotta') || text.includes('จิ๋นซี') ||
    text.includes('tomb') || text.includes('สุสาน') ||
    text.includes('mausoleum') || text.includes('catacomb') ||
    text.includes('โบราณสถาน') || text.includes('นครวัด') || text.includes('angkor')
  ) {
    return 'cursed_relic_monument';
  }

  // 4. Haunted Structures, Castles, Bridges & Historic Edifices
  if (
    text.includes('ปราสาท') || text.includes('castle') ||
    text.includes('สะพาน') || text.includes('bridge') ||
    text.includes('overtoun') || text.includes('leap') ||
    text.includes('คฤหาสน์') || text.includes('mansion') ||
    text.includes('alcatraz') || text.includes('อัลคาทราซ') ||
    text.includes('หอคอย') || text.includes('tower') ||
    text.includes('เรือนจำ') || text.includes('prison') ||
    text.includes('โรงแรม') || text.includes('hotel') ||
    text.includes('โรงพยาบาล') || text.includes('asylum') ||
    text.includes('บ้านร้าง') || text.includes('บ้านผีสิง')
  ) {
    return 'haunted_edifice';
  }

  // 5. Cursed Artifacts, Relics & Dolls
  if (
    text.includes('ตุ๊กตา') || text.includes('doll') ||
    text.includes('muñeca') || text.includes('หีบ') ||
    text.includes('box') || text.includes('dybbuk') ||
    text.includes('กระจก') || text.includes('mirror') ||
    text.includes('เพชร') || text.includes('diamond') ||
    text.includes('เครื่องรางต้องสาป')
  ) {
    return 'cursed_artifact';
  }

  // 6. Naval Abyss, Phantom Ships & Oceanic Anomalies
  if (
    text.includes('bermuda') || text.includes('เบอร์มิวดา') ||
    text.includes('dutchman') || text.includes('ฟลายอิงดัตช์แมน') ||
    text.includes('เรือผี') || text.includes('ghost ship') ||
    text.includes('mary celeste') || text.includes('วังน้ำวน') ||
    text.includes('ทะเลปีศาจ') || text.includes('marianas') ||
    text.includes('สามเหลี่ยม') || text.includes('atlantis')
  ) {
    return 'aquatic_abyss';
  }

  // 7. Aquatic Serpents, River Guardians & Water Leviathans
  if (
    text.includes('loch ness') || text.includes('เนสซี') || text.includes('nessie') ||
    text.includes('naga') || text.includes('พญานาค') || text.includes('นาคราช') ||
    text.includes('bunyip') || text.includes('taniwha') ||
    text.includes('sea serpent') || text.includes('งูยักษ์') ||
    text.includes('พรายน้ำ') || text.includes('เงือก') ||
    text.includes('mermaid') || text.includes('siren') ||
    text.includes('lorelei') || text.includes('kraken') || text.includes('คราเคน') ||
    text.includes('chalawan') || text.includes('ชาละวัน') || text.includes('กุมภีล์') ||
    text.includes('kelpie') || text.includes('เคลปี') || text.includes('กัปปะ') || text.includes('kappa') ||
    text.includes('ม้าน้ำปีศาจ') || text.includes('leviathan') || text.includes('เลเวียธาน')
  ) {
    return 'aquatic_serpent';
  }

  // 8. Cryptids, Wild Beasts, Lycanthropes & Predators
  if (
    text.includes('yeti') || text.includes('เยติ') ||
    text.includes('sasquatch') || text.includes('wendigo') || text.includes('เวนดิโก') ||
    text.includes('chupacabra') || text.includes('ชูปาคาบรา') ||
    text.includes('werewolf') || text.includes('หมาป่า') ||
    text.includes('saming') || text.includes('เสือสมิง') || text.includes('สมิง') ||
    text.includes('gevaudan') || text.includes('สัตว์ร้าย') ||
    text.includes('สัตว์ประหลาด') || text.includes('minotaur') ||
    text.includes('manticore') || text.includes('shuck') ||
    pin.category === 'monster'
  ) {
    return 'cryptid_beast';
  }

  // 9. Undead Lords, Vampires & Mummies
  if (
    text.includes('dracula') || text.includes('แดร็กคูลา') ||
    text.includes('vampire') || text.includes('แวมไพร์') ||
    text.includes('jiangshi') || text.includes('เจียงซือ') ||
    text.includes('ผีดิบ') || text.includes('draugr') ||
    text.includes('mummy') || text.includes('มัมมี่') ||
    text.includes('ghoul') || text.includes('กูล') ||
    text.includes('tutankhamun') || text.includes('ศพคืนชีพ')
  ) {
    return 'undead_lord';
  }

  // 10. Winged Demons & Avian Night Fiends
  if (
    text.includes('krahang') || text.includes('กระหัง') ||
    text.includes('manananggal') || text.includes('มานันนังกัล') ||
    text.includes('pazuzu') || text.includes('wawel') ||
    text.includes('dragon') || text.includes('มังกร') ||
    text.includes('mothman') || text.includes('มอธแมน') ||
    text.includes('jersey') || text.includes('owlman') || text.includes('ปีก')
  ) {
    return 'winged_demon';
  }

  // 11. Deities & Sacred Guardians
  if (
    pin.category === 'sacred' ||
    text.includes('เทพ') || text.includes('พระ') || text.includes('ฤาษี') ||
    text.includes('เจ้าแม่') || text.includes('ศาล') || text.includes('วัด') ||
    text.includes('temple') || text.includes('shrine') || text.includes('ศักดิ์สิทธิ์') ||
    text.includes('จามเทวี') || text.includes('pele') || text.includes('กวนอิม')
  ) {
    return 'deity_guardian';
  }

  // 12. Female Specters & Vengeful Apparitions
  if (
    text.includes('แม่นาค') || text.includes('สาวปากฉีก') ||
    text.includes('kuchisake') || text.includes('banshee') || text.includes('แบนชี') ||
    text.includes('นาง') || text.includes('สาว') || text.includes('แม่') ||
    text.includes('หญิง') || text.includes('woman') || text.includes('lady') ||
    text.includes('krasue') || text.includes('กระสือ') || text.includes('ปอบ') ||
    text.includes('kuntilanak') || text.includes('churel')
  ) {
    return 'female_specter';
  }

  // 13. Male Specters & Wraiths (Default for ghosts / unclassified phantoms)
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

    case 'cursed_artifact':
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
export function getEntityDossier(
  pin: GhostPin,
  language: SupportedLanguage
): EntityDossier {
  const custom = PIN_BESTIARY_DB[pin.id];
  const archetype = inferArchetype(pin);
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
      : archetype === 'cosmic_anomaly'
      ? 'CELESTIAL-IX'
      : archetype === 'aquatic_abyss'
      ? 'ABYSS-VIII'
      : archetype === 'cryptid_beast'
      ? 'CRYPTID-IV'
      : archetype === 'undead_lord'
      ? 'HEX-V'
      : archetype === 'deity_guardian'
      ? 'DEITY-I'
      : 'SPECTER-III';

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
  const appearanceDesc =
    language === 'th'
      ? custom?.descTh ||
        `สิ่งลี้ลับประจำถิ่น ${pin.province_th} ที่มีรูปลักษณ์โดดเด่นตามคำบอกเล่าของพยานท้องถิ่น มักปรากฏตัวพร้อมบรรยากาศเย็นยะเยือกผิดธรรมชาติ เสียงกระซิบแว่วตามสายลม หรือเงาตะคุ่มท่ามกลางความมืดมิดของ ${pin.district_th || pin.province_th}`
      : custom?.descEn ||
        `A renowned paranormal entity of ${pin.province_en}, documented through generations of eyewitness testimony. Manifestations are accompanied by a sudden drop in ambient temperature, eerie acoustic whispers, and unmistakable visual omens across ${pin.district_en || pin.province_en}.`;

  const extraLore =
    language === 'th'
      ? custom?.extraLoreTh ||
        `ตามบันทึกแฟ้มข้อมูลสิ่งลี้ลับท้องถิ่น ผู้เฒ่าผู้แก่ในพื้นที่ ${pin.province_th} ต่างยืนยันว่าเรื่องราวของ "${pin.title_th}" ไม่ใช่เพียงนิทานหลอกเด็ก แต่เป็นร่องรอยความเชื่อโบราณที่ผูกพันกับภูมิประเทศและวิถีชีวิตของผู้คนมาอย่างยาวนาน`
      : custom?.extraLoreEn ||
        `According to regional occult archives, elders of ${pin.province_en} maintain that "${pin.title_en}" is far more than mere fable—it stands as an enduring cautionary chronicle woven into the geography and spiritual memory of the land.`;

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

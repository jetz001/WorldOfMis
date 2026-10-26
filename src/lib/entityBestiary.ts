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

type ArchetypeKey =
  | 'ape_beast'
  | 'aquatic_serpent'
  | 'female_specter'
  | 'floating_head'
  | 'horned_beast'
  | 'undead_lord'
  | 'winged_demon'
  | 'spider_trickster'
  | 'sand_worm'
  | 'witch_deity';

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

// Detailed Bestiary Records for key pins + intelligent archetype fallback for all 50+ pins
const PIN_BESTIARY_DB: Record<string, Partial<PinBestiaryMeta>> = {
  'pin-yeti': {
    archetype: 'ape_beast',
    customImage: '/entities/yeti.jpg',
    typeTh: 'อสุรกายไพรหนาวหิมาลัย (Cryo-Hominid Cryptid)',
    typeEn: 'Himalayan Cryo-Hominid Cryptid',
    genderTh: 'พบทั้งเพศผู้และเพศเมีย (ไม่ระบุแน่ชัด)',
    genderEn: 'Dimorphic (Male & Female reported)',
    sizeTh: '2.4 – 3.2 เมตร (เมื่อยืนสองขา)',
    sizeEn: '2.4 – 3.2 m (Bipedal stance)',
    weightTh: '220 – 420 กก. (ประมาณการ)',
    weightEn: '220 – 420 kg (Estimated)',
    danger: 4,
    habitatTh: 'สันเขาหิมะและธารน้ำแข็งเทือกเขาหิมาลัย (สูงกว่า 4,500 ม.)',
    habitatEn: 'High Himalayan glaciers & snow ridges (>4,500 m)',
    hoursTh: 'ยามพายุหิมะพัดจัดและพลบค่ำถึงเช้ามืด',
    hoursEn: 'Blizzard whiteouts & dusk till dawn',
    descTh:
      'รูปร่างคล้ายวานรยักษ์ผสมมนุษย์โบราณ เดินสองขาอย่างมั่นคงท่ามกลางหิมะลึก ปกคลุมด้วยขนหนาสีขาวเงินอมเทาหม่นหรือน้ำตาลเข้ม ดวงตาสีเขียวมรกตเรืองแสงในม่านพายุ มีกรามใหญ่และรอยเท้าขนาดมหึมาความยาวกว่า 35–45 เซนติเมตร',
    descEn:
      'A towering, broad-shouldered bipedal hominid cloaked in frost-matted silver-white and dark brown fur. Piercing emerald-amber eyes gleam through blizzard whiteouts, leaving 40 cm footprints across sheer glacial ridges.',
    extraLoreTh:
      'ในคัมภีร์โบราณของชาวเชอร์ปาและทิเบต เรียกสิ่งมีชีวิตนี้ว่า "เมห์-เต" (Meh-Teh) หรืออสูรผู้พิทักษ์ยอดเขาศักดิ์สิทธิ์ ก่อนที่มันจะปรากฏตัว มักมีเสียงผิวปากแหลมสูงแทรกมากับเสียงลมหอน และมีกลิ่นสาบฉุนคล้ายกำมะถันปนขนสัตว์เปียกหิมะ',
    extraLoreEn:
      'Revered and feared in Sherpa manuscripts as "Meh-Teh", guardian of the sacred peaks. Its arrival is heralded by a high-pitched whistling cry cutting through the gale and a pungent smell of sulfur and wet fur.',
    taboosTh: [
      'หากพบรอยเท้าขนาดยักษ์สดใหม่กลางพายุหิมะ ห้ามเดินตามรอยไปเด็ดขาด',
      'หากได้ยินเสียงผิวปากก้องจากหุบเหวน้ำแข็ง ให้รีบลงสู่ที่ต่ำทันที કારણเยติเคลื่อนที่บนที่ลาดชันเร็วกว่ามนุษย์หลายเท่า',
      'ห้ามเผาขนสัตว์หรือส่งเสียงท้าทายเจ้าเขาบริเวณอารามคุมจุงหลังตะวันตกดิน',
    ],
    taboosEn: [
      'Never follow fresh giant tracks into a rising blizzard.',
      'If a sharp whistling cry echoes across the glacier, descend laterally immediately.',
      'Never burn animal hair or shout challenges near sacred high-altitude passes after dusk.',
    ],
  },
  'pin-maenak': {
    archetype: 'female_specter',
    customImage: '/entities/maenak.jpg',
    typeTh: 'วิญญาณผีตายทั้งกลมผู้ผูกพันด้วยรัก (Bound Revenant Spirit)',
    typeEn: 'Bound Maternal Revenant Spirit',
    genderTh: 'เพศหญิง (พร้อมวิญญาณทารก)',
    genderEn: 'Female (with Infant Spirit)',
    sizeTh: '1.62 เมตร (ยืดแขนยาวได้หลายเมตร)',
    sizeEn: '1.62 m (Arms can elongate supernaturally)',
    weightTh: 'N/A (0.0 กก. — ร่างจิตวิญญาณ)',
    weightEn: 'N/A (0.0 kg — Ethereal Form)',
    danger: 4,
    habitatTh: 'คุ้งน้ำคลองพระโขนง เรือนไม้ริมน้ำ และร่มต้นตะเคียนวัดมหาบุศย์',
    habitatEn: 'Phra Khanong canal banks, wooden stilt house & banyan groves',
    hoursTh: 'ยามพลบค่ำถึงเที่ยงคืน (21:00 – 03:00 น.)',
    hoursEn: 'Dusk through witching hour (21:00 – 03:00)',
    descTh:
      'หญิงสาวชาวสยามโบราณใบหน้าสะสวยแต่ซีดขาวราวแสงจันทร์ ห่มสไบสีหม่นและนุ่งโจงกระเบนเก่า อุ้มทารกน้อยแนบอก ดวงตาเปี่ยมด้วยความรักปนโศกเศร้าและอาฆาตแค้นต่อผู้ที่พยายามพรากนางจากพี่มาก',
    descEn:
      'A pale, melancholic Siamese woman dressed in antique sabai silk, cradling a spectral infant by a moonlit canal pier. Capable of stretching her limbs through floorboards and summoning fierce canal winds.',
    extraLoreTh:
      'ยามค่ำคืนชาวบ้านริมคลองพระโขนงจะได้ยินเสียงเพลงกล่อมเด็กแว่วมากับสายลมเย็นยะเยือก ตำนานเล่าว่าสมเด็จพระพุฒาจารย์ (โต พรหมรังสี) ได้เสด็จมาโปรดและเจาะกะโหลกหน้าผากของนางทำเป็นปั้นเหน่งเพื่อปลดปล่อยดวงวิญญาณสู่สุคติ',
    extraLoreEn:
      'Locals along the canal reported haunting lullabies drifting across the water at midnight, until Somdet Toh subdued her grieving spirit and bound her forehead bone into a sacred belt buckle.',
    taboosTh: [
      'ห้ามทักหรือพูดจาลบหลู่เรื่องความรักและครอบครัวบริเวณคุ้งน้ำพระโขนง',
      'หากได้ยินเสียงเพลงกล่อมเด็กริมคลองยามดึก ห้ามชะโงกหน้ามองลงไปใต้ถุนเรือน',
      'เมื่อบนบานเรื่องการเกณฑ์ทหารหรือความรัก ต้องรักษาสัจจะตามที่กล่าวไว้เสมอ',
    ],
    taboosEn: [
      'Never mock vows of love or family fidelity near the canal shrine.',
      'Do not peer beneath wooden floorboards if a midnight lullaby is heard.',
      'Always fulfill any vow made at the shrine regarding military draft or romance.',
    ],
  },
  'pin-kuchisake': {
    archetype: 'female_specter',
    typeTh: 'อนเรียว / วิญญาณอาฆาตยุคใหม่ (Vengeful Onryō)',
    typeEn: 'Vengeful Urban Onryō Spirit',
    genderTh: 'เพศหญิง (Female)',
    genderEn: 'Female',
    sizeTh: '1.68 เมตร',
    sizeEn: '1.68 m',
    weightTh: '48 กก. (N/A ในร่างวิญญาณ)',
    weightEn: '48 kg (N/A in spectral state)',
    danger: 5,
    habitatTh: 'ตรอกซอยมืด เสาไฟสลัว และทางเดินกลับจากโรงเรียนยามค่ำ',
    habitatEn: 'Dimly lit alleys, street corners & school routes at dusk',
    descTh:
      'หญิงสาวผมยาวสลวยสีดำขลับ สวมเสื้อโค้ทยาวและหน้ากากอนามัยสีขาวปิดบังครึ่งใบหน้า ภายใต้หน้ากากคือบาดแผลฉีกขาดตั้งแต่ริมฝีปากถึงใบหูทั้งสองข้าง ในมือถือกรรไกรเหล็กขนาดใหญ่เปื้อนสนิมเลือด',
    descEn:
      'A tall, dark-haired woman in a trench coat wearing a white surgical mask. Beneath the mask lies a grotesque ear-to-ear grin, accompanied by a pair of heavy, blood-stained iron shears.',
  },
  'pin-lochness': {
    archetype: 'aquatic_serpent',
    typeTh: 'สัตว์ดึกดำบรรพ์ใต้น้ำลึก (Abyssal Plesiosaur Cryptid)',
    typeEn: 'Abyssal Aquatic Cryptid',
    genderTh: 'ไม่ระบุ (Unverified)',
    genderEn: 'Unverified',
    sizeTh: '9.0 – 15.0 เมตร (ความยาวลำตัว)',
    sizeEn: '9.0 – 15.0 m (Total length)',
    weightTh: '1,800 – 3,500 กก.',
    weightEn: '1,800 – 3,500 kg',
    danger: 3,
    habitatTh: 'ร่องน้ำลึกใต้ทะเลสาบล็อกเนสส์ (ลึกกว่า 230 เมตร)',
    habitatEn: 'Deep peaty trenches of Loch Ness (>230 m depth)',
    descTh:
      'ลำตัวสีเทาดำมันวาวคล้ายเพลซิโอซอร์ดึกดำบรรพ์ มีคอยาวเรียวชูขึ้นเหนือผิวน้ำ ท่อนหลังมีโหนกนูน 2–3 ลูก และครีบใบพายสี่ข้างสำหรับแหวกว่ายในน้ำเย็นจัดที่มืดทึบด้วยตะกอนพีต',
    descEn:
      'A sleek, dark-skinned aquatic giant with an elongated swan-like neck, humped back, and four powerful flippers adapted to the frigid, peat-darkened waters of the Scottish Highlands.',
  },
  'pin-dracula': {
    archetype: 'undead_lord',
    typeTh: 'จ้าวแห่งแวมไพร์อมตะ (Immortal Nosferatu Lord)',
    typeEn: 'Immortal Vampire Lord',
    genderTh: 'เพศชาย (Male)',
    genderEn: 'Male',
    sizeTh: '1.85 เมตร (แปลงร่างเป็นค้างคาวหรือหมอกได้)',
    sizeEn: '1.85 m (Shapeshifts into mist or bat)',
    weightTh: '78 กก. (ไม่มีเงาในกระจก)',
    weightEn: '78 kg (Casts no reflection)',
    danger: 5,
    habitatTh: 'ปราสาทหินบนยอดเขาคาร์เพเทียนและห้องใต้ดินโบราณ',
    habitatEn: 'Carpathian mountain fortress & subterranean crypts',
    descTh:
      'ขุนนางโบราณในชุดคลุมสีดำสนิทซับในสีแดงเลือดหมู ผิวขาวซีดเย็นเฉียบราวหินอ่อน ดวงตาสีแดงเพลิงสะกดจิตเหยื่อ มีเขี้ยวแหลมคมสำหรับสูบเลือดสดและสามารถสลายร่างเป็นกลุ่มหมอกหนาทึบ',
    descEn:
      'An aristocratic undead nobleman draped in midnight-black velvet, pale as marble with hypnotic crimson eyes and razor fangs, commanding wolves and nocturnal mist.',
  },
  'pin-wendigo': {
    archetype: 'horned_beast',
    typeTh: 'อสูรคำสาปกินคนแห่งป่าหิมะ (Cannibalistic Winter Fiend)',
    typeEn: 'Algonquian Cannibalistic Winter Fiend',
    genderTh: 'N/A (อดีตมนุษย์ต้องคำสาป)',
    genderEn: 'N/A (Cursed former human)',
    sizeTh: '3.0 – 4.5 เมตร (สูงขึ้นตามเหยื่อที่กิน)',
    sizeEn: '3.0 – 4.5 m (Grows in proportion to victims eaten)',
    weightTh: '140 กก. (ผอมแห้งแต่พละกำลังมหาศาล)',
    weightEn: '140 kg (Gaunt skeletal frame with immense strength)',
    danger: 5,
    habitatTh: 'ป่าสนทึบและทุ่งน้ำแข็งรอบทะเลสาบเกรตเลกส์',
    habitatEn: 'Boreal pine forests of the Great Lakes & northern plains',
    descTh:
      'ร่างสูงชะลูดผอมแห้งจนหนังสีเทาซีดหุ้มกระดูก ศีรษะคล้ายกะโหลกวางกวางเขากิ่งก้านสาขา เบ้าตาลึกโบ๋เรืองแสงสีฟ้าเยือกแข็ง หัวใจภายในอกเป็นน้ำแข็งบริสุทธิ์ และมีกลิ่นเนื้อเน่าโชยตามลมหนาว',
    descEn:
      'A towering, emaciated monstrosity with ash-grey skin pulled tight over jutting bones, an antlered stag-skull visage, sunken glowing eyes, and a heart of solid ice.',
  },
  'pin-krasue': {
    archetype: 'floating_head',
    typeTh: 'ผีสตรีต้องสาปถอดหัว (Detached Viscera Spirit)',
    typeEn: 'Cursed Detached-Head Nocturnal Spirit',
    genderTh: 'เพศหญิง (Female)',
    genderEn: 'Female',
    sizeTh: '0.85 เมตร (เฉพาะศีรษะและพวงไส้เรืองแสง)',
    sizeEn: '0.85 m (Floating head & luminescent entrails)',
    weightTh: '3.5 กก. (ลอยเหนือพื้นดิน 1–3 เมตร)',
    weightEn: '3.5 kg (Levitates 1–3 m above ground)',
    danger: 4,
    habitatTh: 'ชายป่า ทุ่งนา และใต้ถุนเรือนชาวบ้านยามวิกาล',
    habitatEn: 'Rural rice paddies, bamboo groves & beneath stilt houses',
    descTh:
      'ศีรษะของหญิงสาวหรือหญิงชราที่ถอดหลุดออกจากร่างในยามดึก ห้อยพวงหลอดลม หัวใจ และลำไส้ที่เปล่งแสงเรืองรองสีเขียวอมฟ้าวูบวาบเป็นดวงไฟลอยต่ำไปตามยอดหญ้า',
    descEn:
      'A disembodied female head trailing a pulsing cluster of heart, lungs, and intestines that emit an eerie bioluminescent green-blue glow as it drifts silently through the night.',
  },
  'pin-naga': {
    archetype: 'aquatic_serpent',
    typeTh: 'พญานาคราชผู้พิทักษ์สายน้ำศักดิ์สิทธิ์ (Celestial Serpent Deity)',
    typeEn: 'Sacred Celestial Serpent Deity',
    genderTh: 'เพศผู้ / เพศเมีย (นาคา และ นาคี)',
    genderEn: 'Divine Male / Female (Naga & Nagi)',
    sizeTh: '20 – 60 เมตร (ลำตัวพญานาค)',
    sizeEn: '20 – 60 m (Serpentine form)',
    weightTh: 'N/A (กายทิพย์กึ่งเทพ)',
    weightEn: 'N/A (Semi-divine astral body)',
    danger: 2,
    habitatTh: 'วังบาดาลใต้แม่น้ำโขงและถ้ำศักดิ์สิทธิ์ริมฝั่งน้ำ',
    habitatEn: 'Subterranean palaces beneath the Mekong River & sacred caves',
    descTh:
      'พญางูใหญ่อันทรงตบะบารมี มีหงอนสีทองแดงหรือเขียวมรกต เกล็ดเลื่อมพรายดั่งอัญมณี มีทั้งตระกูลเศียรเดียวจนถึงเจ็ดเศียร สามารถเนรมิตกายเป็นมนุษย์และพ่นลูกไฟสีชมพูอมแดงไร้กลิ่นควันขึ้นจากผิวน้ำ',
    descEn:
      'A majestic crested serpent deity adorned with iridescent emerald and gold scales, dwelling in the underwater realm ofบาดาล and breathing smokeless ruby-pink fireballs toward the heavens.',
  },
};

/**
 * Generates an intricate Dark-Grimoire Tarot / Woodcut SVG Data URI portrait
 * specific to each creature archetype & color aura so every pin has a vivid illustration.
 */
function buildGrimoirePortraitSvg(pin: GhostPin, archetype: ArchetypeKey): string {
  // Choose palette based on category / archetype
  const palette =
    pin.category === 'sacred'
      ? { bg1: '#041b1d', bg2: '#072a24', glow: '#fbbf24', primary: '#fcd34d', secondary: '#34d399', eye: '#fef08a' }
      : pin.category === 'curse'
      ? { bg1: '#16071c', bg2: '#090d16', glow: '#c084fc', primary: '#e9d5ff', secondary: '#34d399', eye: '#f43f5e' }
      : pin.category === 'monster'
      ? { bg1: '#061914', bg2: '#040b12', glow: '#10b981', primary: '#6ee7b7', secondary: '#38bdf8', eye: '#00ff88' }
      : { bg1: '#061520', bg2: '#03080e', glow: '#2dd4bf', primary: '#99f6e4', secondary: '#6ee7b7', eye: '#ffffff' };

  let creatureArt = '';

  switch (archetype) {
    case 'ape_beast':
      creatureArt = `
        <!-- Mountain peaks & blizzard -->
        <polygon points="20,220 95,95 165,220" fill="#0b2228" opacity="0.7"/>
        <polygon points="180,220 265,80 350,220" fill="#0d2830" opacity="0.7"/>
        <!-- Towering Yeti/Sasquatch Silhouette -->
        <path d="M125,220 C125,165 135,120 155,95 C162,72 178,60 200,60 C222,60 238,72 245,95 C265,120 275,165 275,220 Z" fill="#0f2f32" stroke="${palette.primary}" stroke-width="2"/>
        <!-- Jagged frost fur shoulders -->
        <path d="M135,150 L122,158 L138,168 L125,180 L142,190 M265,150 L278,158 L262,168 L275,180 L258,190" stroke="${palette.primary}" stroke-width="1.8" fill="none"/>
        <!-- Glowing Beast Eyes & Fangs -->
        <polygon points="182,88 194,92 184,96" fill="${palette.eye}"/>
        <polygon points="218,88 206,92 216,96" fill="${palette.eye}"/>
        <path d="M188,108 L193,115 L198,109 L202,109 L207,115 L212,108" stroke="#ecfdf5" stroke-width="1.8" fill="none"/>
      `;
      break;

    case 'aquatic_serpent':
      creatureArt = `
        <!-- Misty Water Waves -->
        <path d="M20,185 Q100,172 200,185 T380,185" stroke="${palette.secondary}" stroke-width="2" fill="none" opacity="0.7"/>
        <path d="M20,202 Q110,190 200,202 T380,202" stroke="${palette.primary}" stroke-width="1.5" fill="none" opacity="0.5"/>
        <!-- Coiling Sea Serpent / Naga / Nessie -->
        <path d="M90,195 C95,140 130,145 140,190 C155,130 185,115 195,75 C200,56 218,52 228,64 C215,72 215,82 208,105 C200,138 220,155 245,190 C265,152 295,158 305,195" fill="#0b2e2b" stroke="${palette.primary}" stroke-width="2.4"/>
        <!-- Crest & Glowing Eye -->
        <path d="M196,60 L204,42 L211,56 L220,46 L222,60" fill="${palette.glow}" opacity="0.85"/>
        <circle cx="212" cy="65" r="3.2" fill="${palette.eye}"/>
      `;
      break;

    case 'floating_head':
      creatureArt = `
        <!-- Floating Female Head -->
        <path d="M168,62 C168,40 232,40 232,62 C236,92 242,125 248,145 M168,62 C164,92 158,125 152,145" stroke="${palette.primary}" stroke-width="2" fill="#081c20"/>
        <ellipse cx="200" cy="78" rx="22" ry="26" fill="#0d2b2e" stroke="${palette.primary}" stroke-width="1.8"/>
        <!-- Eyes -->
        <circle cx="191" cy="76" r="2.8" fill="${palette.eye}"/>
        <circle cx="209" cy="76" r="2.8" fill="${palette.eye}"/>
        <!-- Glowing Viscera & Heart Below Neck -->
        <path d="M200,104 L200,130 M194,118 C180,130 182,155 198,162 C214,168 218,145 204,132 C190,145 192,175 206,188" stroke="#00ff88" stroke-width="3" fill="none"/>
        <circle cx="198" cy="134" r="9" fill="#00ff88" opacity="0.85"/>
        <circle cx="198" cy="134" r="18" fill="#00ff88" opacity="0.25"/>
      `;
      break;

    case 'horned_beast':
      creatureArt = `
        <!-- Antlered / Horned Beast Skull & Shoulders -->
        <path d="M130,220 C140,165 162,135 200,135 C238,135 260,165 270,220 Z" fill="#0b2226" stroke="${palette.primary}" stroke-width="1.8"/>
        <!-- Branching Antlers / Horns -->
        <path d="M180,82 C155,70 140,48 135,28 M158,64 L148,42 M170,74 L166,52" stroke="${palette.primary}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M220,82 C245,70 260,48 265,28 M242,64 L252,42 M230,74 L234,52" stroke="${palette.primary}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Beast Skull Head -->
        <polygon points="176,80 224,80 232,108 200,142 168,108" fill="#0e2c30" stroke="${palette.primary}" stroke-width="2"/>
        <circle cx="187" cy="100" r="4" fill="${palette.eye}"/>
        <circle cx="213" cy="100" r="4" fill="${palette.eye}"/>
      `;
      break;

    case 'winged_demon':
      creatureArt = `
        <!-- Bat / Demon Wings Spread Wide -->
        <path d="M200,115 C165,70 115,58 65,75 C90,102 100,125 92,152 C125,135 155,138 182,155 Z" fill="#0c262c" stroke="${palette.primary}" stroke-width="1.8"/>
        <path d="M200,115 C235,70 285,58 335,75 C310,102 300,125 308,152 C275,135 245,138 218,155 Z" fill="#0c262c" stroke="${palette.primary}" stroke-width="1.8"/>
        <!-- Central Demon Torso & Horned Head -->
        <path d="M182,215 L186,112 L200,82 L214,112 L218,215 Z" fill="#113238" stroke="${palette.primary}" stroke-width="2"/>
        <circle cx="194" cy="98" r="3" fill="${palette.eye}"/>
        <circle cx="206" cy="98" r="3" fill="${palette.eye}"/>
      `;
      break;

    case 'undead_lord':
      creatureArt = `
        <!-- Gothic High-Collared Cloak & Crown/Tomb Silhouette -->
        <polygon points="120,220 152,95 178,112 200,88 222,112 248,95 280,220" fill="#0b1f28" stroke="${palette.primary}" stroke-width="2"/>
        <ellipse cx="200" cy="86" rx="20" ry="25" fill="#102c36" stroke="${palette.primary}" stroke-width="1.8"/>
        <polygon points="182,64 191,48 200,60 209,48 218,64" fill="${palette.glow}" opacity="0.85"/>
        <circle cx="192" cy="84" r="3.2" fill="${palette.eye}"/>
        <circle cx="208" cy="84" r="3.2" fill="${palette.eye}"/>
      `;
      break;

    case 'spider_trickster':
      creatureArt = `
        <!-- Arcane Web & Eight-Legged Spider -->
        <circle cx="200" cy="120" r="70" stroke="${palette.primary}" stroke-width="0.8" stroke-dasharray="4 4" fill="none" opacity="0.45"/>
        <path d="M200,120 L125,75 M200,120 L115,115 M200,120 L125,155 M200,120 L150,185" stroke="${palette.primary}" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M200,120 L275,75 M200,120 L285,115 M200,120 L275,155 M200,120 L250,185" stroke="${palette.primary}" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="200" cy="132" rx="22" ry="28" fill="#0c2c2a" stroke="${palette.primary}" stroke-width="2"/>
        <circle cx="200" cy="98" r="14" fill="#103835" stroke="${palette.primary}" stroke-width="1.8"/>
        <circle cx="195" cy="95" r="2.5" fill="${palette.eye}"/>
        <circle cx="205" cy="95" r="2.5" fill="${palette.eye}"/>
      `;
      break;

    case 'sand_worm':
      creatureArt = `
        <!-- Desert Dunes & Coiling Spiked Death Worm -->
        <path d="M20,195 Q120,165 220,192 T380,185" stroke="${palette.glow}" stroke-width="2" fill="none" opacity="0.6"/>
        <path d="M125,205 C120,135 165,85 205,78 C240,72 255,115 245,195" fill="#1f1018" stroke="${palette.primary}" stroke-width="3"/>
        <circle cx="204" cy="86" r="16" fill="#0b151c" stroke="${palette.eye}" stroke-width="2.5"/>
        <circle cx="204" cy="86" r="6" fill="${palette.eye}"/>
      `;
      break;

    case 'female_specter':
    default:
      creatureArt = `
        <!-- Weeping Willow / Flowing Hair Female Spirit Silhouette -->
        <path d="M142,220 C148,155 162,122 200,122 C238,122 252,155 258,220 Z" fill="#0a242a" stroke="${palette.primary}" stroke-width="1.8"/>
        <!-- Flowing Spectral Hair -->
        <path d="M168,78 C152,115 142,165 132,215 M232,78 C248,115 258,165 268,215" stroke="${palette.primary}" stroke-width="2.2" fill="none"/>
        <ellipse cx="200" cy="84" rx="22" ry="27" fill="#0e2f36" stroke="${palette.primary}" stroke-width="1.8"/>
        <!-- Glowing Spectral Eyes & Slit/Veil -->
        <circle cx="191" cy="82" r="2.8" fill="${palette.eye}"/>
        <circle cx="209" cy="82" r="2.8" fill="${palette.eye}"/>
        <path d="M186,98 Q200,104 214,98" stroke="${palette.glow}" stroke-width="1.6" fill="none"/>
      `;
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" fill="none">
    <defs>
      <radialGradient id="bg" cx="50%" cy="42%" r="68%">
        <stop offset="0%" stop-color="${palette.bg1}"/>
        <stop offset="100%" stop-color="${palette.bg2}"/>
      </radialGradient>
      <radialGradient id="aura" cx="50%" cy="42%" r="42%">
        <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.32"/>
        <stop offset="65%" stop-color="${palette.primary}" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="400" height="225" fill="url(#bg)"/>
    <!-- Grimoire Corner Filigree Frame -->
    <rect x="10" y="10" width="380" height="205" rx="8" stroke="${palette.primary}" stroke-opacity="0.3" stroke-width="1"/>
    <rect x="15" y="15" width="370" height="195" rx="5" stroke="${palette.primary}" stroke-opacity="0.18" stroke-width="0.8" stroke-dasharray="4 4"/>
    <!-- Sacred Halo behind creature -->
    <circle cx="200" cy="96" r="78" fill="url(#aura)"/>
    <circle cx="200" cy="96" r="56" stroke="${palette.primary}" stroke-opacity="0.35" stroke-width="1" stroke-dasharray="3 3"/>
    <polygon points="200,32 264,96 200,160 136,96" stroke="${palette.secondary}" stroke-opacity="0.22" stroke-width="1" fill="none"/>
    ${creatureArt}
    <!-- Bottom Grimoire Vignette -->
    <rect y="185" width="400" height="40" fill="url(#bg)" fill-opacity="0.55"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Infers the creature archetype from a pin's ID, category, and story text.
 */
function inferArchetype(pin: GhostPin): ArchetypeKey {
  const explicit = PIN_BESTIARY_DB[pin.id]?.archetype;
  if (explicit) return explicit;

  const text = `${pin.id} ${pin.title_th} ${pin.title_en} ${pin.story_en}`.toLowerCase();
  if (text.includes('yeti') || text.includes('sasquatch')) return 'ape_beast';
  if (text.includes('krasue')) return 'floating_head';
  if (text.includes('anansi') || text.includes('spider')) return 'spider_trickster';
  if (text.includes('worm') || text.includes('หนอน')) return 'sand_worm';
  if (
    text.includes('loch') ||
    text.includes('naga') ||
    text.includes('bunyip') ||
    text.includes('taniwha') ||
    text.includes('shahmaran') ||
    text.includes('serpent') ||
    text.includes('พญานาค')
  ) {
    return 'aquatic_serpent';
  }
  if (
    text.includes('manananggal') ||
    text.includes('pazuzu') ||
    text.includes('wawel') ||
    text.includes('dragon') ||
    text.includes('wing')
  ) {
    return 'winged_demon';
  }
  if (
    text.includes('wendigo') ||
    text.includes('minotaur') ||
    text.includes('saming') ||
    text.includes('gevaudan') ||
    text.includes('shuck') ||
    text.includes('manticore') ||
    text.includes('chupacabra') ||
    text.includes('gumiho')
  ) {
    return 'horned_beast';
  }
  if (
    text.includes('dracula') ||
    text.includes('tutankhamun') ||
    text.includes('jiangshi') ||
    text.includes('draugr') ||
    text.includes('pishtaco') ||
    text.includes('nightmarchers') ||
    text.includes('santacompana')
  ) {
    return 'undead_lord';
  }
  return 'female_specter';
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

  // 1. Portrait URL (Admin uploaded image -> Custom Bestiary Art -> Generated Grimoire SVG)
  const portraitUrl =
    pin.image_url ||
    custom?.customImage ||
    (pin.id ? `/entities/${pin.id}.jpg` : buildGrimoirePortraitSvg(pin, archetype));

  // 2. Codex ID
  const numHash = Math.abs(
    pin.id.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7)
  ) % 900 + 100;
  const classCode =
    pin.category === 'monster'
      ? 'CRYPTID-IV'
      : pin.category === 'curse'
      ? 'HEX-V'
      : pin.category === 'sacred'
      ? 'DEITY-I'
      : 'SPECTER-III';
  const codexId = `CODEX #${numHash} • ${classCode}`;

  // 3. Default Category-based Physical & Supernatural Attributes if not explicitly overridden
  const defaultMeta = (() => {
    switch (archetype) {
      case 'ape_beast':
        return {
          typeTh: 'อสุรกายไพรดึกดำบรรพ์ (Hominid Cryptid)',
          typeEn: 'Primordial Hominid Cryptid',
          genderTh: 'พบทั้งเพศผู้และเพศเมีย',
          genderEn: 'Male & Female specimens',
          sizeTh: '2.3 – 3.0 เมตร (ยืนสองขา)',
          sizeEn: '2.3 – 3.0 m (Bipedal)',
          weightTh: '200 – 380 กก.',
          weightEn: '200 – 380 kg',
          danger: 4 as const,
          habitatTh: 'ป่าดงดิบและเทือกเขาสูงห่างไกลผู้คน',
          habitatEn: 'Remote mountain peaks & deep wilderness',
          hoursTh: 'ยามพลบค่ำถึงรุ่งสาง (20:00 – 05:00 น.)',
          hoursEn: 'Dusk till dawn (20:00 – 05:00)',
        };
      case 'aquatic_serpent':
        return {
          typeTh: 'อสูรและเทพพิทักษ์แห่งสายน้ำ (Aquatic Leviathan / Naga)',
          typeEn: 'Abyssal Aquatic Leviathan & River Guardian',
          genderTh: 'ไม่ระบุแน่ชัด (กายทิพย์/สัตว์โบราณ)',
          genderEn: 'Unverified / Astral Entity',
          sizeTh: '8.0 – 25.0 เมตร (ความยาวลำตัว)',
          sizeEn: '8.0 – 25.0 m (Body length)',
          weightTh: '900 – 3,000 กก. (หรือ N/A ในร่างทิพย์)',
          weightEn: '900 – 3,000 kg (or N/A in astral form)',
          danger: 3 as const,
          habitatTh: 'ร่องน้ำลึก ทะเลสาบ บึงโบราณ และถ้ำใต้น้ำ',
          habitatEn: 'Deep river trenches, misty lakes & underwater caves',
          hoursTh: 'ยามหมอกลงจัดและคืนวันเพ็ญ',
          hoursEn: 'Dense mist & full-moon nights',
        };
      case 'horned_beast':
        return {
          typeTh: 'อสูรจำแลงและสัตว์อสุรกายสายล่าเนื้อ (Predatory Mythic Beast)',
          typeEn: 'Predatory Shapeshifting Beast',
          genderTh: 'เพศผู้ / แปรผันตามร่างที่จำแลง',
          genderEn: 'Male / Variable by vessel',
          sizeTh: '1.8 – 2.8 เมตร',
          sizeEn: '1.8 – 2.8 m',
          weightTh: '110 – 260 กก.',
          weightEn: '110 – 260 kg',
          danger: 5 as const,
          habitatTh: 'ป่าลึก หุบเขา และชายขอบหมู่บ้านยามวิกาล',
          habitatEn: 'Deep forests, canyons & village outskirts at night',
          hoursTh: 'เที่ยงคืนถึงก่อนรุ่งสาง (00:00 – 04:00 น.)',
          hoursEn: 'Midnight to pre-dawn (00:00 – 04:00)',
        };
      case 'winged_demon':
        return {
          typeTh: 'อสูรมีปีกและปีศาจแห่งลมพายุ (Winged Nocturnal Fiend)',
          typeEn: 'Winged Nocturnal Fiend',
          genderTh: 'เพศหญิง / เทพอสูรโบราณ',
          genderEn: 'Female / Ancient Daemonic Entity',
          sizeTh: '1.7 – 4.2 เมตร (ระยะกางปีก)',
          sizeEn: '1.7 – 4.2 m (Wingspan)',
          weightTh: '45 – 180 กก.',
          weightEn: '45 – 180 kg',
          danger: 5 as const,
          habitatTh: 'ยอดไม้สูง ซากปรักหักพัง และเหนือหลังคาบ้านเรือน',
          habitatEn: 'High canopies, ancient ruins & rooftops at night',
          hoursTh: 'หลังเที่ยงคืนจนถึงก่อนไก่ขัน',
          hoursEn: 'After midnight until first crow',
        };
      case 'undead_lord':
        return {
          typeTh: 'ผีดิบอมตะและขบวนวิญญาณโบราณ (Undying Revenant)',
          typeEn: 'Undying Revenant & Spectral Host',
          genderTh: 'เพศชาย / ขบวนดวงวิญญาณ',
          genderEn: 'Male / Spectral Procession',
          sizeTh: '1.75 – 1.95 เมตร',
          sizeEn: '1.75 – 1.95 m',
          weightTh: 'N/A – 75 กก. (ร่างเนื้อต้องคำสาป)',
          weightEn: 'N/A – 75 kg (Cursed corporeal vessel)',
          danger: 4 as const,
          habitatTh: 'สุสานโบราณ ปราสาทหิน และเส้นทางขบวนแห่วิญญาณ',
          habitatEn: 'Ancient tombs, stone fortresses & spirit paths',
          hoursTh: 'ยามวิกาลไร้แสงจันทร์ (23:00 – 03:30 น.)',
          hoursEn: 'Moonless nights (23:00 – 03:30)',
        };
      case 'floating_head':
      case 'female_specter':
      default:
        return {
          typeTh:
            pin.category === 'sacred'
              ? 'จิตวิญญาณศักดิ์สิทธิ์และผู้พิทักษ์แผ่นดิน (Guardian Spirit)'
              : 'วิญญาณหญิงสาวและภูตพรายอาถรรพ์ (Spectral Apparition)',
          typeEn:
            pin.category === 'sacred'
              ? 'Sacred Guardian Spirit & Local Deity'
              : 'Spectral Female Apparition & Folklore Entity',
          genderTh: 'เพศหญิง (หรือ N/A ในร่างจิตวิญญาณ)',
          genderEn: 'Female (or N/A Ethereal Spirit)',
          sizeTh: '1.58 – 1.70 เมตร (แปรผันได้ตามอาถรรพ์)',
          sizeEn: '1.58 – 1.70 m (Variable spectral stature)',
          weightTh: 'N/A (0.0 กก. — ร่างพลังงานวิญญาณ)',
          weightEn: 'N/A (0.0 kg — Incorporeal Ectoplasm)',
          danger: (pin.category === 'sacred' ? 2 : 4) as 1 | 2 | 3 | 4 | 5,
          habitatTh: `${pin.province_th} ${pin.district_th ? `(${pin.district_th})` : ''}`,
          habitatEn: `${pin.province_en} ${pin.district_en ? `(${pin.district_en})` : ''}`,
          hoursTh: 'ยามค่ำคืนและช่วงหัวค่ำหมอกลง (21:00 – 03:00 น.)',
          hoursEn: 'Twilight & late night hours (21:00 – 03:00)',
        };
    }
  })();

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

  // 2. If curated bestiary taboos exist:
  const custom = PIN_BESTIARY_DB[pin.id];
  const curated = language === 'th' ? custom?.taboosTh : custom?.taboosEn;
  if (curated && curated.length > 0) return curated;

  // 3. Intelligent Context-Aware Extraction:
  const isTh = language === 'th';
  const text = `${pin.id} ${pin.title_th} ${pin.title_en} ${pin.story_th} ${pin.story_en} ${pin.folklore_history_th} ${pin.folklore_history_en}`.toLowerCase();

  // A. Cosmic / Extraterrestrial / Ancient Astronomical Lore (e.g. Dogon, Sirius, UFO, Alien, Nazca)
  if (
    text.includes('dogon') ||
    text.includes('โดกอน') ||
    text.includes('sirius') ||
    text.includes('ซิริอุส') ||
    text.includes('นอมโม') ||
    text.includes('nommo') ||
    text.includes('ufo') ||
    text.includes('alien') ||
    text.includes('ดาวตก') ||
    text.includes('ดาราศาสตร์') ||
    text.includes('ยานอวกาศ')
  ) {
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
  }

  // B. Aquatic / Water Entities & Serpents (Naga, Loch Ness, Siren, Mermaid, Bunyip, Taniwha, Rhine Lorelei)
  if (
    text.includes('loch') ||
    text.includes('naga') ||
    text.includes('พญานาค') ||
    text.includes('bunyip') ||
    text.includes('taniwha') ||
    text.includes('siren') ||
    text.includes('mermaid') ||
    text.includes('เงือก') ||
    text.includes('lorelei') ||
    text.includes('พรายน้ำ') ||
    text.includes('แม่น้ำ') ||
    text.includes('บึง') ||
    text.includes('ทะเลสาบ')
  ) {
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
  }

  // C. Mountain & Forest Cryptids (Yeti, Sasquatch, Wendigo, Bigfoot, Beast of Gevaudan, Chupacabra, Werewolf)
  if (
    text.includes('yeti') ||
    text.includes('เยติ') ||
    text.includes('sasquatch') ||
    text.includes('wendigo') ||
    text.includes('bigfoot') ||
    text.includes('chupacabra') ||
    text.includes('gevaudan') ||
    text.includes('werewolf') ||
    text.includes('มนุษย์หมาป่า') ||
    text.includes('สมิง') ||
    text.includes('วานร') ||
    pin.category === 'monster'
  ) {
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
  }

  // D. Cursed Relics, Tombs, Mummies & Hexes (Curse category, Tutankhamun, Dracula, Voodoo, Catacombs)
  if (
    pin.category === 'curse' ||
    text.includes('curse') ||
    text.includes('คำสาป') ||
    text.includes('คุณไสย') ||
    text.includes('สุสาน') ||
    text.includes('tomb') ||
    text.includes('mummy') ||
    text.includes('dracula') ||
    text.includes('catacomb') ||
    text.includes('voodoo')
  ) {
    return isTh
      ? [
          'ห้ามหยิบฉวยก้อนหิน วัตถุโบราณ เศษดิน หรือเครื่องรางใดๆ ออกจากเขตสุสานหรือซากปรักหักพังกลับบ้านโดยเด็ดขาด',
          'หากมีอาการขนลุกชัน ได้ยินเสียงกระซิบข้างหู หรือได้กลิ่นกำมะถัน ให้กล่าวบทสวดขอขมาและเดินถอยหลังออกจากพื้นที่',
          'ห้ามลบหลู่เครื่องราง ป้ายเตือน หรือเชือกอาถรรพ์ที่ผู้เฒ่าผู้แก่ประกอบพิธีสะกดไว้',
        ]
      : [
          'Never remove stones, relics, soil, or artifacts from ancient tombs or ruined grounds under any circumstance.',
          'If sudden chills, phantom whispers, or sulfur scents manifest, recite prayers and back away facing forward.',
          'Never mock protective boundary wards, talismans, or binding seals placed by ancient guardians.',
        ];
  }

  // E. Sacred Deities, Shrines & Relic Keepers (Sacred category, Temple, Mount Popa, Sacred trees)
  if (
    pin.category === 'sacred' ||
    text.includes('sacred') ||
    text.includes('ศักดิ์สิทธิ์') ||
    text.includes('เทพ') ||
    text.includes('ศาล') ||
    text.includes('วัด') ||
    text.includes('temple') ||
    text.includes('shrine')
  ) {
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
  }

  // F. Ghosts, Spirits & Apparitions (Default Ghost / Urban Legend)
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
}

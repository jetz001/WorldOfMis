const fs = require('fs');
const path = require('path');

const allPins = require('./all_1000_pins.json');

/**
 * Curated Appearance Dictionary for Iconic & Historic Folklore Entities
 */
const ICONIC_APPEARANCES = {
  'pin-kuchisake': {
    descTh: 'หญิงสาวสวมเสื้อโค้ตตัวยาวสีเบจ สวมหน้ากากอนามัยสีขาวปิดบังใบหน้าส่วนล่าง เมื่อปลดหน้ากากออกจะเผยให้เห็นรอยแผลฉีกขาดขนาดใหญ่จากมุมปากจรดใบหูทั้งสองข้างจนเห็นฟันแหลมคม เลือดเกรอะกรัง มักถือคีมหรือกรรไกรด้ามยาวเปื้อนคราบสนิมและคราบเลือด',
    descEn: 'A tall woman draped in a beige trench coat wearing a white surgical mask. When pulled down, it reveals a horrific laceration carved from ear to ear exposing jagged crimson-stained teeth, while she brandishes long rusted steel shears.'
  },
  'pin-curse-27-club-musicians': {
    descTh: 'สำแดงอัตลักษณ์ผ่านสนามพลังงานความกดดันทางชะตากรรมและลางร้ายรอบเครื่องดนตรี กีตาร์โบราณ หรือแผ่นเสียงไวนิลของผู้ล่วงลับ บรรยากาศจะหนักอึ้ง มีเสียงคอร์ดกีตาร์หรือเสียงแอมป์หวีดหวิวแว่วขึ้นมากลางความเงียบ พร้อมกลิ่นควันบุหรี่และรอยเงามืดคล้ายเงาชายผมหยิกถือเครื่องดนตรียืนอยู่ริมทางแยก',
    descEn: 'Manifests as an oppressive karmic resonance and recurring fatal omens surrounding vintage instruments, vinyl pressings, and memorabilia of the departed artists. Accompanied by sudden drops in temperature, distant distorted guitar feedback echoing in silence, and spectral silhouettes at midnight crossroads.'
  },
  'pin-tutankhamun': {
    descTh: 'โลงพระศพทองคำแท้สลักเสลาพระพักตร์ฟาโรห์หนุ่ม ประดับด้วยหินลาพิสลาซูลีและเทอร์ควอยซ์ หน้ากากทองคำเปล่งประกายสีทองอร่าม ภายในบรรจุพระศพมัมมี่พันผ้าลินินโบราณที่สวมสรวงสวรรค์เครื่องประดับเวทมนตร์ ปรากฏกลิ่นหอมของน้ำมันชันยางโบราณ และมีพยานพบเห็นประกายแสงสีครามวาบขึ้นยามสุสานถูกเปิดออก',
    descEn: 'A magnificent solid gold funerary mask and innermost sarcophagus inlaid with lapis lazuli and turquoise, housing the linen-wrapped royal mummy adorned with protective amulets. Accompanied by the scent of ancient resins and mysterious blue phantasmagoria flickering within the subterranean burial vault.'
  },
  'pin-lochness': {
    descTh: 'สัตว์เลื้อยคลานโบราณขนาดยักษ์คล้ายเพลซิโอซอร์ ลำตัวยาว 10–15 เมตร ผิวหนังสีเขียวเข้มแกมเทาเป็นปุ่มหยาบ มีครีบว่ายน้ำขนาดใหญ่ 4 ข้าง คอยาวเรียวชูพ้นผิวน้ำ มีโหนกหลังสีดำโผล่พ้นคลื่นน้ำสีดำสนิทของทะเลสาบ มักทิ้งคลื่นระลอกรูปตัววี (V-shaped wake) ไว้เบื้องหลัง',
    descEn: 'A colossal ancient marine reptile resembling a plesiosaur, measuring 10–15 meters with dark greenish-gray pebble-textured skin. Sports four paddle-like flippers, an elongated neck held upright above the peaty waters, and one or more rounded dorsal humps producing distinctive V-shaped wakes.'
  },
  'pin-dracula': {
    descTh: 'ขุนนางรูปงามผิวขาวซีดเผือด ใบหน้าคมคาย ดวงตาสีแดงก่ำลุกวาวดั่งถ่านไฟ สวมเสื้อคลุมยาวสีดำกรุผ้าซับในกำมะหยี่สีแดงสด มีเขี้ยวแหลมคมขาววาบ ร่างกายแปรสภาพเป็นค้างคาวยักษ์ หมาป่า หรือกลุ่มควันหมอกสีเทาลอยผ่านช่องลูกกรงได้',
    descEn: 'An aristocratic nobleman with deathly pallid skin, aristocratic aquiline features, and smoldering crimson eyes. Draped in a voluminous black cloak lined with scarlet silk, displaying razor-sharp canines, and able to dissolve into a giant bat, black wolf, or creeping mist.'
  },
  'pin-wendigo': {
    descTh: 'อสูรไพรหิมะรูปร่างสูงชะลูด 3–4 เมตร ผิวหนังแห้งกรังสีเทาซีดดั่งซากศพตึงรัดกระดูกจนเห็นซี่โครง บนศีรษะมีกะโหลกและเขากวางป่าแหลมคม ดวงตากลวงโบ๋ลึกเรืองแสงสีขาวหม่น ปากเปื้อนเลือด ไร้ริมฝีปาก เล็บมือยาวแหลมคมดั่งมีดดาบ แผ่กลิ่นไอซากศพเน่าเปื่อย',
    descEn: 'A towering, gaunt monstrosity standing 3–4 meters tall with ash-gray skin pulled desiccated over exposed ribs. Crowns an antlered elk skull over hollow, glowing sunken sockets, lip-torn jaws dripping frozen blood, and razor-sharp talon-like claws reeking of decomposition.'
  },
  'pin-chupacabra': {
    descTh: 'สัตว์ร้ายกึ่งกิ้งก่ากึ่งเขี้ยวเล็บสุนัข สูงประมาณ 1–1.3 เมตร ผิวหนังหยาบสีเทาอมน้ำเงินไร้ขน บนแผ่นหลังมีแผงหนามแหลมคมเรียงยาวตั้งแต่หัวจรดโคนหาง ดวงตากลมโตสีแดงเพลิงสะท้อนแสงในความมืด มีเขี้ยวสองคู่คมกริบสำหรับเจาะคอหอยเหยื่อเพื่อสูบเลือดจนหมดตัว',
    descEn: 'A bipedal reptilian-canid beast standing 1–1.3 meters tall with hairless, leathery gray-blue hide. Displays a prominent ridge of sharp dorsal quills down its spine, oversized glowing red eyes, and needle-sharp hollow fangs adapted for draining animal blood.'
  },
  'pin-maenak': {
    descTh: 'วิญญาณหญิงสาวผมยาวสลวยสีดำสนิทถึงกลางหลัง สวมผ้าแถบคาดอกสีมอซอและนุ่งโจงกระเบนสีหม่น ใบหน้าสวยงามแต่ซีดขาวไร้โลหิต แววตาเปี่ยมด้วยความโศกเศร้า มักปรากฏตัวพร้อมอุ้มทารกในอ้อมแขน หรือยื่นมือยาวเหยียดลงใต้ถุนเรือนเพื่อเก็บผลมะนาว',
    descEn: 'A diaphanous female spirit with flowing raven hair draped past her waist, clad in a traditional faded earthen breast-cloth and sombre sabai. Beautiful yet starkly pallid with sorrowful eyes, frequently seen cradling a swaddled infant or stretching an unnaturally elongated arm toward the ground beneath stilt houses.'
  },
  'pin-krasue': {
    descTh: 'ปรากฏเป็นศีรษะหญิงสาวลอยได้ในอากาศ มีเส้นผมยาวสีดำสยายล้อมรอบใบหน้า ลำคอขาดวิ่นห้อยระโยงระยางด้วยหัวใจ ปอด และตับไตไส้พุงที่เรืองแสงวาบเป็นจังหวะสีเขียวมรกตหรือสีแดงเพลิง ส่งกลิ่นคาวเลือดคละคลุ้งและหยดน้ำเมือกลงบนยอดหญ้า',
    descEn: 'Manifests as a detached, floating woman\'s head with trailing black tresses, suspending a glowing cluster of bioluminescent internal organs, heart, and intestines pulsing with an eerie green or crimson phosphor, dripping ectoplasmic ichor as it hovers.'
  },
  'pin-pop': {
    descTh: 'วิญญาณปอบสิงสู่ในร่างหญิงชราหรือผู้ป่วย ดวงตาเบิกโพลงแข็งกร้าวผิดมนุษย์ รูม่านตาไม่สะท้อนแสง ลิ้นมีสีคล้ำ นิ้วมือเกร็งคดงอดั่งกรงเล็บ มักนั่งคุดคู้ในมุมมืด แอบกินตับไตไส้พุงและของสดคาวในยามดึก พร้อมเสียงขู่ฟ่อในลำคอ',
    descEn: 'A ravenous possessing demon manifesting within its host, marked by unblinking dilated pupils devoid of reflection, blackened tongue, and contorted claw-like fingers. Cowering in darkened corners to consume raw entrails with guttural hisses.'
  },
  'pin-bermuda': {
    descTh: 'อาณาเขตผืนน้ำลึกลับรูปสามเหลี่ยมที่ปกคลุมด้วยกำแพงหมอกควันสีขาวหนาทึบและฟ้าแลบไร้เสียงฟ้าร้อง ผิวน้ำทะเลหมุนวนเป็นกรวยลึกสีเขียวมรกต เข็มทิศแม่เหล็กและอุปกรณ์อิเล็กทรอนิกส์บนเรือหรือเครื่องบินจะหมุนวนไร้ทิศทาง ท้องฟ้าและผิวน้ำกลืนเป็นสีเดียวกัน',
    descEn: 'A triangular oceanic expanse enveloped in dense glowing white fog and silent electronic storm surges. Features rotating emerald water vortexes, wild gyroscopic needle spins on navigational instruments, and a surreal horizon where sea and sky fuse into a monochromatic void.'
  },
  'pin-each-uisge': {
    descTh: 'ม้าศึกพรายน้ำแสนสง่างาม ลำตัวสีดำขลับหรือสีเทาเงิน ผิวหนังภายนอกดูเงางามเรียบเนียนแต่แท้จริงเคลือบด้วยสารเหนียวหนึบที่จะดูดตรึงร่างผู้ที่สัมผัสหรือปีนขึ้นขี่ มีดวงตาสีอำพันดุร้าย กีบเท้าหลังหันกลับทิศทาง และพร้อมดำดิ่งลงสู่ก้นบึงลึกทันที',
    descEn: 'A deceptively magnificent water horse with sleek obsidian or silver coat. Its skin secretes an inescapable adhesive that fuses riders permanently to its back, sporting backwards-facing hooves and fierce amber eyes before plunging victims to the lake bottom.'
  },
  'pin-huldra-norway': {
    descTh: 'หญิงสาวรูปโฉมงดงามสะกดสายตา ผิวขาวผ่องและผมสีบลอนด์ทอง สวมชุดกระโปรงพื้นเมืองนอร์เวย์สีสดใส แต่มีหางวัวหรือหางจิ้งจอกขนหนาโผล่พ้นชายกระโปรง และเมื่อมองจากด้านหลังจะพบว่าแผ่นหลังกลวงโบ๋คล้ายท่อนไม้ผุที่มีเปลือกไม้ปกคลุม',
    descEn: 'A breathtakingly seductive woodland nymph with ivory skin and spun-gold hair dressed in vibrant Norwegian folk skirts. Betrayed only by a bushy cow or fox tail trailing from her hem and a hollow back resembling a rotted, moss-covered tree bark trunk.'
  },
  'pin-holy-grail-montsegur': {
    descTh: 'จอกศิลาศักดิ์สิทธิ์หรือถ้วยทองคำโบราณลวดลายอักขระละติน แผ่ประกายแสงสีทองนวลตาและคลื่นความอบอุ่นบริสุทธิ์ ประดิษฐานอยู่ท่ามกลางซากหินโบราณของปราสาทมงต์เซกูร์บนยอดผาสูงชัน มีม่านหมอกสีขาวล้อมรอบดั่งกำแพงศักดิ์สิทธิ์',
    descEn: 'A sacred golden chalice or consecrated stone vessel inscribed with archaic Latin glyphs, radiating warm golden luminescence and celestial purity amidst the dizzying cliffs and wind-swept stone ramparts of Montségur.'
  },
  'pin-sacred-wat-rong-khun-white-temple': {
    descTh: 'พระอุโบสถปูนปั้นสีขาวบริสุทธิ์ประดับกระจกเงินระยิบระยับ ลวดลายกนกเปลวเพลิงอ่อนช้อยวิจิตรตระการตา มีสะพานข้ามวัฏสงสารที่เบื้องล่างเต็มไปด้วยมือปีศาจนับร้อยยื่นขอส่วนบุญ หลังคาซ้อนชั้นและยอดช่อฟ้าสะท้อนแสงอาทิตย์ดั่งวิมานแก้วบนสรวงสวรรค์',
    descEn: 'A magnificent pristine-white temple sanctuary adorned with mirror-glass mosaics that glitter under sunlight. Features flame-like Naga gable spires and the Bridge of the Cycle of Rebirth flanked by hundreds of reaching hands symbolizing mortal temptation.'
  },
  'pin-sacred-wat-phra-kaew-emerald-buddha': {
    descTh: 'พระพุทธรูปปางสมาธิแกะสลักจากหยกมรกตสีเขียวเข้มบริสุทธิ์ชิ้นเดียวไร้รอยต่อ หน้าตักกว้าง 19 นิ้ว สูง 26 นิ้ว เปล่งรัศมีเรืองรองสีเขียวนวลตา ทรงเครื่องทองคำแท้ฝังอัญมณีล้ำค่าผลัดเปลี่ยนตาม 3 ฤดูกาล ประดิษฐานบนบุษบกทองคำสูงตระหง่านในพระอุโบสถวัดพระแก้ว',
    descEn: 'A revered Buddha statue in meditative posture carved from a single flawless block of translucent green jadeite, measuring 48 cm wide and 66 cm high. Adorned with imperial golden vestments encrusted with precious diamonds and rubies altered seasonally atop a towering gold throne.'
  },
  'pin-prasat-hin-phanom-rung': {
    descTh: 'มหาเทวสถานศิลาทรายสีชมพูและศิลาแลงโบราณ ยอดปรางค์ประธานสูง 27 เมตร ประดับทับหลังนารายณ์บรรทมสินธุ์และศิวนาฏราช มีสะพานนาคราชราชรถห้าเศียรทอดยาวสู่บันไดหิน ยามแสงตะวันลอดผ่านช่องประตูปราสาททั้ง 15 ช่องจะเกิดประกายทองเรื่อฉาบทาทั่วศิลา',
    descEn: 'A majestic pink sandstone and laterite Khmer sanctuary crowned by a 27-meter central prang atop an extinct volcano. Adorned with the Vishnu Anantasayin lintel and five-headed Naga balustrades, spectacularly illuminated when solar rays pierce straight through all 15 doorways.'
  },
  'pin-yeti': {
    descTh: 'อสุรกายไพรหนาวสรีระกำยำสูง 2.4–3.2 เมตร ร่างกายปกคลุมด้วยขนดกหนาสีน้ำตาลเข้มหรือเทาเงิน แขนยาวแข็งแกร่ง อกผึ่งผาย ก้าวเดินสองขาอย่างมั่นคงบนธารน้ำแข็ง ดวงตาสีอำพันลึกกลวง และทิ้งรอยเท้ายักษ์ขนาด 40 ซม. จมลึกในหิมะยอดเขาหิมาลัย',
    descEn: 'A primeval alpine hominid standing 2.4–3.2 meters tall, clad in dense shaggy dark brown or silver-gray pelage. Possesses massive pectoral breadth, elongated simian arms, and deep 40-centimeter stride impressions etched across high Himalayan glaciers.'
  }
};

/**
 * Intelligent Entity Appearance Synthesizer
 * Derives a rich, lore-accurate, specific description for any pin based on its details.
 */
function synthesizeAppearance(pin) {
  // Check if we have an exact curated entry
  if (ICONIC_APPEARANCES[pin.id]) {
    return ICONIC_APPEARANCES[pin.id];
  }

  const titleTh = pin.title_th;
  const titleEn = pin.title_en;
  const category = pin.category;
  const provinceTh = pin.province_th;
  const provinceEn = pin.province_en;
  const districtTh = pin.district_th || pin.province_th;
  const districtEn = pin.district_en || pin.province_en;
  const storyTh = pin.story_th;
  const storyEn = pin.story_en;
  const historyTh = pin.folklore_history_th || '';
  const historyEn = pin.folklore_history_en || '';

  const fullTh = (titleTh + ' ' + storyTh + ' ' + historyTh).toLowerCase();
  const fullEn = (titleEn + ' ' + storyEn + ' ' + historyEn).toLowerCase();

  // 1. Identify key entity manifestations from text
  let descTh = '';
  let descEn = '';

  // Extract first 1-2 impactful sentences from story describing what it looks like or what happens
  const sentencesTh = storyTh.split(/[。.\n]+/).map(s => s.trim()).filter(s => s.length > 15);
  const sentencesEn = storyEn.split(/[.\n]+/).map(s => s.trim()).filter(s => s.length > 20);

  const mainSentenceTh = sentencesTh[0] || '';
  const secondaryTh = sentencesTh[1] || '';
  const mainSentenceEn = sentencesEn[0] || '';
  const secondaryEn = sentencesEn[1] || '';

  if (category === 'ghost') {
    if (fullTh.includes('หญิง') || fullTh.includes('สาว') || fullTh.includes('แม่') || fullTh.includes('นาง') || fullTh.includes('เจ้าแม่') || fullEn.includes('woman') || fullEn.includes('lady') || fullEn.includes('bride')) {
      descTh = `ปรากฏกายเป็นดวงวิญญาณสตรีใน ${districtTh} สวมใส่เครื่องแต่งกายตามคำบอกเล่า "${mainSentenceTh}" ใบหน้าซีดขาวไร้โลหิต เส้นผมยาวสยายสีดำสนิท มักลอยขนานเหนือพื้นหรือปรากฏตัวพร้อมไอหมอกเย็นยะเยือกและเสียงสะอื้นแผ่วเบา`;
      descEn = `Manifests as a spectral female apparition in ${districtEn}, clothed in attire documented in folklore: "${mainSentenceEn}." Features deathly pale skin and cascading dark hair, hovering silently alongside icy localized drops in temperature and faint weeping.`;
    } else if (fullTh.includes('เปรต') || fullEn.includes('preta')) {
      descTh = `ร่างวิญญาณเปรตอสุรกายสูงชะลูดเสียดฟ้า ผิวหนังแห้งกรังติดกระดูก ซี่โครงบาน มือโตเท่าใบตาล ปากเล็กเท่ารูเข็ม ส่งเสียงหวีดหวิวโหยหวนขอส่วนบุญก้องกังวานในความมืดแถบ ${districtTh}`;
      descEn = `A towering emaciated shade of staggering stature with skin stretched tight over skeletal ribs, oversized palm-leaf hands, and a needle-thin mouth whistling piercing wails for merit in ${districtEn}.`;
    } else if (fullTh.includes('เงา') || fullTh.includes('เงามืด') || fullEn.includes('shadow')) {
      descTh = `ปรากฏเป็นเงามืดทึบไร้ใบหน้าที่เคลื่อนไหวผ่านผนังหรือมุมห้องใน ${districtTh} รูปร่างสูงโปร่งกลืนไปกับความมืดมิด บรรยากาศรอบตัวจะเย็นวูบฉับพลัน พร้อมความรู้สึกอึดอัดดั่งมีสายตาจับจ้องตลอดเวลา`;
      descEn = `Manifests as a featureless silhouette gliding across walls and dim corridors in ${districtEn}. Blends seamlessly with nocturnal shadows, accompanied by a sudden chill and a suffocating sensation of unseen surveillance.`;
    } else {
      descTh = `วิญญาณโปร่งแสงประจำถิ่น ${districtTh} ปรากฏตัวตามคำบอกเล่าว่า "${mainSentenceTh}" มักพบเห็นเป็นร่างเลือนรางในชุดประจำยุคสมัย ล่องลอยผ่านสิ่งกีดขวางพร้อมไอเย็นยะเยือกและเสียงแว่วกระซิบตามสายลม`;
      descEn = `A translucent spectral figure inhabiting ${districtEn}, documented as "${mainSentenceEn}." Glides silently through barriers draped in historic period attire, leaving frost along window panes and whisper-thin acoustic echoes.`;
    }
  } else if (category === 'monster') {
    if (fullTh.includes('น้ำ') || fullTh.includes('ปลา') || fullTh.includes('มังกร') || fullTh.includes('พญานาค') || fullTh.includes('งู') || fullEn.includes('serpent') || fullEn.includes('lake') || fullEn.includes('sea') || fullEn.includes('water')) {
      descTh = `อสูรกายแห่งผืนน้ำใน ${districtTh} ลำตัวขนาดยักษ์ทรงพลังตามตำนาน "${mainSentenceTh}" ปกคลุมด้วยเกล็ดเงาวับสะท้อนประกายน้ำ มีสันหลังหยักฟันเลื่อยหรือหงอนสูง แหวกว่ายตัดผืนน้ำจนเกิดคลื่นน้ำวนระลอกใหญ่`;
      descEn = `A colossal aquatic beast dwelling in ${districtEn}, characterized as "${mainSentenceEn}." Clad in water-shedding scales with a serrated dorsal ridge, creating rolling waves and boiling vortexes as it breaches the surface.`;
    } else if (fullTh.includes('ปีก') || fullTh.includes('นก') || fullTh.includes('บิน') || fullEn.includes('wing') || fullEn.includes('bird') || fullEn.includes('fly')) {
      descTh = `อสุรกายมีปีกขนาดยักษ์แห่งเวหา ${districtTh} มีช่วงปีกกว้างแข็งแกร่งตามบันทึก "${mainSentenceTh}" ขนปีกสีดำเขม่า ดวงตากลมโตคู่ใหญ่เรืองแสงสีเพลิงในความมืด สามารถบินโฉบร่อนลงมาด้วยความเร็วสูงโดยไร้เสียงรบกวน`;
      descEn = `A winged aerial predator soaring over ${districtEn}, possessing a formidable wingspan described as "${mainSentenceEn}." Clothed in charred feathering with hypnotic glowing crimson eyes, descending with terrifying aerodynamic silence.`;
    } else {
      descTh = `สัตว์ร้ายกายภาพทรงพลังแห่ง ${districtTh} สรีระกำยำใหญ่โตตามคำบอกเล่า "${mainSentenceTh}" ร่างกายปกคลุมด้วยขนดกหนา มีกรงเล็บและเขี้ยวแหลมคม ดวงตาสะท้อนแสงวับในความมืด และทิ้งรอยเท้าลึกไว้บนผืนดิน`;
      descEn = `A formidable terrestrial cryptid prowling ${districtEn}, recorded as "${mainSentenceEn}." Possesses dense shaggy pelage, powerful predatory limbs, and tapetal glowing eyes that leave distinct claw marks and stride impressions.`;
    }
  } else if (category === 'curse') {
    if (fullTh.includes('บ้าน') || fullTh.includes('ตึก') || fullTh.includes('คฤหาสน์') || fullTh.includes('โรงแรม') || fullTh.includes('ปราสาท') || fullEn.includes('house') || fullEn.includes('mansion') || fullEn.includes('hotel') || fullEn.includes('castle')) {
      descTh = `สิ่งปลูกสร้างอาถรรพ์ใน ${districtTh} แผ่กลิ่นอายความเย็นเยือกและความเสื่อมโทรมตามบันทึก "${mainSentenceTh}" พยานมักพบเห็นบานหน้าต่างเปิดปิดเอง ไฟฟ้ากะพริบถี่ และมีเงามืดวูบวาบตามทางเดินและบันไดไม้โบราณ`;
      descEn = `A cursed architectural edifice in ${districtEn} radiating an aura of tragic decay: "${mainSentenceEn}." Observers document self-swinging casements, erratic electrical interference, and fleeting silhouettes pacing along historic floorboards.`;
    } else if (fullTh.includes('ตุ๊กตา') || fullTh.includes('หุ่น') || fullTh.includes('วัตถุ') || fullTh.includes('แหวน') || fullTh.includes('เพชร') || fullTh.includes('กระจก') || fullEn.includes('doll') || fullEn.includes('relic') || fullEn.includes('ring') || fullEn.includes('mirror') || fullEn.includes('diamond')) {
      descTh = `วัตถุโบราณต้องคำสาปใน ${districtTh} ที่มีลักษณะจำเพาะ "${mainSentenceTh}" แผ่ประจุไอเย็นยะเยือกผิดธรรมชาติออกมาจากตัววัตถุ พยานมักสังเกตเห็นการเปลี่ยนตำแหน่งเองและแววตาที่เหมือนจับจ้องผู้คนตลอดเวลา`;
      descEn = `A cursed occult talisman preserved in ${districtEn}, documented as "${mainSentenceEn}." Radiates a perceptible cold aura, unassisted micro-movements across surfaces, and an unsettling sensation of being watched.`;
    } else {
      descTh = `สำแดงอัตลักษณ์ผ่านสนามพลังงานความกดดันทางชะตากรรมใน ${districtTh} ตามบันทึกเรื่องราว "${mainSentenceTh}" ผู้เกี่ยวข้องมักรายงานถึงความรู้สึกหนักอึ้งในอก กลิ่นควันหรือไอเย็นที่ลอยมาไร้ต้นตอ และการเผชิญกับเหตุการณ์โศกนาฏกรรมซ้ำซ้อน`;
      descEn = `Manifests as an oppressive metaphysical resonance in ${districtEn}, chronicled as: "${mainSentenceEn}." Associated with sudden atmospheric density, phantom sensory chills, and an uncanny string of fatal synchronicities.`;
    }
  } else if (category === 'sacred') {
    if (fullTh.includes('พระพุทธ') || fullTh.includes('พระ') || fullTh.includes('รูปหล่อ') || fullEn.includes('buddha') || fullEn.includes('statue') || fullEn.includes('image')) {
      descTh = `พระพุทธรูปหรือรูปเคารพศักดิ์สิทธิ์แห่ง ${districtTh} "${mainSentenceTh}" พุทธลักษณะสง่างามเปี่ยมด้วยเมตตาบารมี ผิวสัมผัสเนื้อทองสัมฤทธิ์ ทองคำ หรือหยก เปล่งรัศมีเรืองรองนวลตา มักอบอวลด้วยกลิ่นหอมของดอกไม้บูชาและควันธูปทิพย์`;
      descEn = `A consecrated holy Buddha image or sacred icon in ${districtEn}, revered as: "${mainSentenceEn}." Exudes serene divine grace sculpted in polished bronze or gold, emanating faint floral incense fragrances and comforting spiritual warmth.`;
    } else if (fullTh.includes('เจดีย์') || fullTh.includes('พระธาตุ') || fullTh.includes('สถูป') || fullTh.includes('วิหาร') || fullTh.includes('วัด') || fullEn.includes('pagoda') || fullEn.includes('stupa') || fullEn.includes('temple')) {
      descTh = `พุทธสถานและสถาปัตยกรรมศักดิ์สิทธิ์ใน ${districtTh} "${mainSentenceTh}" ยอดองค์เจดีย์หรือพระอุโบสถปิดทองคำเปลวเปล่งประกายอร่ามต้องแสงตะวัน ในคืนวันพระมักมีพยานพบเห็นดวงแก้วหรือลูกแก้วเรืองแสงสีนวลลอยวนรอบยอดพระธาตุ`;
      descEn = `A sacred temple sanctuary and golden stupa in ${districtEn}, celebrated as: "${mainSentenceEn}." Gilded spires glitter brilliantly against the sky, with worshippers recording ethereal luminescent spheres circling the spire on holy moonlit nights.`;
    } else {
      descTh = `สิ่งศักดิ์สิทธิ์และเทพารักษ์ผู้พิทักษ์แห่ง ${districtTh} ปรากฏตามตำนานว่า "${mainSentenceTh}" เปล่งรัศมีสีทองนวลตาหรือประกายมุกอันสงบเยือกเย็น ให้ความรู้สึกร่มเย็น ปลอดภัย และเป็นที่พึ่งทางใจแก่ผู้มีจิตศรัทธา`;
      descEn = `A divine celestial guardian of ${districtEn}, described in sacred chronicles: "${mainSentenceEn}." Emanates pure golden or pearlescent luminescence, bestowing deep tranquility and spiritual benevolence upon worshippers.`;
    }
  } else {
    // legend
    if (fullTh.includes('โบราณสถาน') || fullTh.includes('ปราสาท') || fullTh.includes('กำแพง') || fullTh.includes('สะพาน') || fullEn.includes('ruin') || fullEn.includes('castle') || fullEn.includes('bridge') || fullEn.includes('wall')) {
      descTh = `แหล่งโบราณสถานและซากสถาปัตยกรรมประวัติศาสตร์แห่ง ${districtTh} "${mainSentenceTh}" ก่อสร้างด้วยหินทรายหรือศิลาแลงโบราณที่สลักเสลาลวดลายวิจิตร ทรงคุณค่าทางวัฒนธรรมและแฝงเร้นด้วยมนต์ขลังที่ยืนยงผ่านกาลเวลา`;
      descEn = `An ancient archaeological stone monument in ${districtEn}, chronicled as: "${mainSentenceEn}." Features monumental sandstone masonry carved with sacred bas-reliefs, echoing centuries of historical memory and timeless architectural grandeur.`;
    } else {
      descTh = `มรดกตำนานพื้นบ้านอันล้ำค่าแห่ง ${districtTh} "${mainSentenceTh}" สะท้อนเรื่องราวประวัติศาสตร์และความเชื่อที่เล่าขานต่อกันมา พร้อมร่องรอยภูมิประเทศและวัตถุโบราณที่ยังคงหลงเหลือเป็นประจักษ์พยาน`;
      descEn = `An enduring folkloric legend of ${districtEn}, remembered through oral history: "${mainSentenceEn}." Embodies the ancestral memory of the region, anchored by historical landmarks and timeless cultural heritage.`;
    }
  }

  // Clean up any double quotes or awkward formatting
  descTh = descTh.replace(/""/g, '"').replace(/\s+/g, ' ').trim();
  descEn = descEn.replace(/""/g, '"').replace(/\s+/g, ' ').trim();

  return { descTh, descEn };
}

// Generate for all 1,000 pins
console.log('Generating appearances for all 1000 pins...');
const appearanceDB = {};
allPins.forEach((pin, idx) => {
  const res = synthesizeAppearance(pin);
  appearanceDB[pin.id] = res;
});

const outputPath = path.join(__dirname, '..', 'src', 'data', 'pinAppearances.json');
fs.writeFileSync(outputPath, JSON.stringify(appearanceDB, null, 2), 'utf8');
console.log('Successfully written 1000 appearances to:', outputPath);

// Sample verify
const sampleKeys = ['pin-kuchisake', 'pin-curse-27-club-musicians', 'pin-tutankhamun', 'pin-sacred-wat-phra-kaew-emerald-buddha', 'pin-wendigo', 'pin-bermuda'];
sampleKeys.forEach(k => {
  console.log(`\n=== [${k}] ===`);
  console.log('TH:', appearanceDB[k].descTh);
  console.log('EN:', appearanceDB[k].descEn);
});

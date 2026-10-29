const fs = require('fs');

const curPins = JSON.parse(fs.readFileSync('scripts/current_600_pins.json', 'utf8'));
const curIds = new Set(curPins.map(p => p.id.toLowerCase()));
const curText = curPins.map(p => `${p.id} ${p.title_th} ${p.title_en}`).join(' ').toLowerCase();

const candidates = [
  // Thailand Ghosts / Spirits
  { id: 'pin-phi-tai-ha-thailand', th: 'ผีตายห่า', en: 'Phi Tai Ha Epidemic Ghosts' },
  { id: 'pin-phi-song-nang-mekong', th: 'ผีสองนาง', en: 'Phi Song Nang Two Princess Spirits' },
  { id: 'pin-phi-tab-thao-thailand', th: 'ผีตามอย', en: 'Phi Ta Moy Phantom Forest Spirit' },
  { id: 'pin-phi-phrai-krasue-kheaw', th: 'ผีพรายน้ำโขง', en: 'Phi Phrai Mekong River Siren' },
  { id: 'pin-nang-takhian-chumphon', th: 'เจ้าแม่ตะเคียนทอง บางหมาก', en: 'Chao Mae Takhian Thong Bang Mak' },
  { id: 'pin-phi-tai-thang-klom', th: 'ผีตายทั้งกลม ป่าช้าโบราณ', en: 'Phi Tai Thang Klom Maternal Ghost' },
  { id: 'pin-phi-kong-koi-chiang-dao', th: 'ผีกองกอย ดอยเชียงดาว', en: 'Phi Kong Koi of Doi Chiang Dao' },
  { id: 'pin-krasue-ban-dong-thailand', th: 'ตำนานผีกระสือ บ้านดง', en: 'Krasue Ban Dong Flying Head Spirit' },
  
  // Japan Ghosts / Yokai
  { id: 'pin-hone-onna-japan', th: 'โฮเนะ อนนะ (ผีโครงกระดูกหญิงสาวหลอกล่อ)', en: 'Hone-onna Bone Woman Yokai' },
  { id: 'pin-oiwa-yotsuya-kaidan', th: 'โออิวะ (ตำนานผีแค้นโยตสึยะไคดัน)', en: 'Oiwa Vengeful Ghost of Yotsuya Kaidan' },
  { id: 'pin-okiku-sarayashiki', th: 'โอคิคุ (ผีนับจานแห่งปราสาทฮิเมจิ)', en: 'Okiku Plate Counting Ghost of Himeji' },
  { id: 'pin-ubume-japan', th: 'อุบุเมะ (วิญญาณแม่คลอดบุตรแห่งญี่ปุ่น)', en: 'Ubume Birthing Ghost' },
  { id: 'pin-funayurei-japan', th: 'ฟุนะยูเร (ผีพรายเรือขอทัพพีตักน้ำ)', en: 'Funayurei Shipwreck Phantom' },
  { id: 'pin-taka-onna-japan', th: 'ทากะ ออนนะ (ผีสาวยืดตัวส่องหน้าต่าง)', en: 'Taka-onna High Woman Spirit' },
  { id: 'pin-chouchin-obake', th: 'โชชิน โอบาเกะ (ผีโคมไฟกระดาษตาเดียว)', en: 'Chochin-obake Paper Lantern Ghost' },
  { id: 'pin-akaname-japan', th: 'อากะนาเมะ (ปีศาจเลียคราบสกปรก)', en: 'Akaname Filth Licker Yokai' },
  
  // Asia / SE Asia
  { id: 'pin-sundel-bolong-indonesia', th: 'ซุนเดล โบลง (ผีหญิงสาวหลังกลวง)', en: 'Sundel Bolong Hollow-Back Ghost' },
  { id: 'pin-wewe-gombel-indonesia', th: 'เวเว กอมเบล (ผีหญิงอุ้มเด็กหลงป่า)', en: 'Wewe Gombel Javanese Child-Stealing Spirit' },
  { id: 'pin-tiyanak-philippines', th: 'ทียานัก (ปีศาจทารกแปลงกายลวงกินคน)', en: 'Tiyanak Vampire Infant of Philippines' },
  { id: 'pin-manananggal-capiz', th: 'มานานังกัล (ผีถอดท่อนลอยฟ้าแห่งฟิลิปปินส์)', en: 'Manananggal Visayan Winged Flesh-Eater' },
  { id: 'pin-penanggalan-malaysia', th: 'ปีนังกาลัน (ผีหัวถอดไส้แห่งมาเลเซีย)', en: 'Penanggalan Vampiric Flying Head' },
  { id: 'pin-kwee-kia-singapore', th: 'กุ่ยเกี้ย (ผีเด็กเร่ร่อนลึกลับ)', en: 'Kwee Kia Ghost Child of Singapore' },
  { id: 'pin-gwisin-cheong-korea', th: 'ดัลกยาล กวิชิน (ผีหน้าไข่ไร้ใบหน้าเกาหลี)', en: 'Dalgyal Gwisin Egg Ghost of Korea' },
  { id: 'pin-mul-gwisin-han-river', th: 'มุล กวิชิน (ผีพรายน้ำแม่น้ำฮัน)', en: 'Mul Gwisin Drowned Ghost of Han River' },
  
  // Europe Ghosts / Legends
  { id: 'pin-brown-lady-raynham-hall', th: 'สุภาพสตรีสีน้ำตาลแห่งเรย์นแฮมฮอลล์', en: 'Brown Lady of Raynham Hall' },
  { id: 'pin-grey-friars-bobby-ghost', th: 'แม็คเคนซี โพลเทอร์ไกสท์ (สุสานเกรย์ไฟรเออร์ส)', en: 'Mackenzie Poltergeist of Greyfriars Kirkyard' },
  { id: 'pin-white-lady-ekenass', th: 'สุภาพสตรีสีขาวแห่งปราสาทเอเคเนส', en: 'White Lady of Ekenas Castle' },
  { id: 'pin-borley-rectory-ghosts', th: 'บ้านพักบาทหลวงบอร์ลีย์ (บ้านผีสิงที่สุดในอังกฤษ)', en: 'Borley Rectory Most Haunted House' },
  { id: 'pin-pluckley-haunted-village', th: 'หมู่บ้านพลัคลีย์ (หมู่บ้านผีสิงแห่งเคนต์)', en: 'Pluckley Haunted Village of Kent' },
  { id: 'pin-tower-of-london-anne-boleyn', th: 'วิญญาณพระนางแอนน์ โบลีน แห่งหอคอยลอนดอน', en: 'Anne Boleyn Ghost of Tower of London' },
  { id: 'pin-bhangarh-fort-curse', th: 'ป้อมภานการ์ฮ (ป้อมปราการต้องคำสาปแห่งอินเดีย)', en: 'Bhangarh Fort Cursed Ruins' },
  { id: 'pin-changi-hospital-haunting', th: 'โรงพยาบาลโอลด์ ชางงี (ดินแดนวิญญาณแห่งสิงคโปร์)', en: 'Old Changi Hospital Haunted Corridors' },

  // Curses & Artifacts
  { id: 'pin-hope-diamond-curse', th: 'เพชรโฮป (อัญมณีสีน้ำเงินต้องคำสาป)', en: 'Hope Diamond Blue Curse' },
  { id: 'pin-delphi-purple-sapphire', th: 'ไพลินเดลฮีสีม่วง (อัญมณีอาถรรพ์แห่งอินเดีย)', en: 'Delhi Purple Sapphire Cursed Gem' },
  { id: 'pin-busby-stoop-chair', th: 'เก้าอี้มรณะบัสบี (เก้าอี้นั่งแล้วตายแห่งยอร์กเชียร์)', en: 'Busby Stoop Chair of Death' },
  { id: 'pin-crying-boy-painting-curse', th: 'ภาพวาดเด็กชายร้องไห้ (ภาพอาถรรพ์ไฟไหม้บ้าน)', en: 'The Crying Boy Cursed Painting' },
  { id: 'pin-annabelle-raggedy-doll', th: 'ตุ๊กตาแอนนาเบลล์ (ตุ๊กตาผีสิงอาถรรพ์แห่งวอร์เรน)', en: 'Annabelle Haunted Raggedy Ann Doll' },
  { id: 'pin-robert-the-doll-key-west', th: 'ตุ๊กตาโรเบิร์ต (ตุ๊กตาต้องสาปแห่งคีย์เวสต์)', en: 'Robert the Doll of Key West' },
  { id: 'pin-otzi-iceman-curse', th: 'คำสาปมนุษย์น้ำแข็งเอิตซี (ความตายแห่งธารน้ำแข็งแอลป์)', en: 'Curse of Otzi the Iceman' },
  { id: 'pin-king-tut-tomb-curse', th: 'คำสาปฟาโรห์ตุตันคาเมน (สุสานอาถรรพ์แห่งลักซอร์)', en: 'Curse of the Pharaoh Tutankhamun Tomb' },
  { id: 'pin-black-orlov-diamond-curse', th: 'เพชรแบล็กออร์ลอฟ (ดวงตาศิวะสีดำต้องสาป)', en: 'Black Orlov Eye of Brahma Curse' },
  { id: 'pin-letta-me-out-puppet', th: 'ตุ๊กตาเล็ตตามีเอาต์ (หุ่นไม้โบราณมีชีวิต)', en: 'Letta Me Out Gypsy Wooden Puppet' },
  { id: 'pin-dybbuk-box-curse', th: 'กล่องดึบบุก (กล่องกักวิญญาณร้ายแห่งยิว)', en: 'Dybbuk Box Wine Cabinet Curse' },
  { id: 'pin-hands-resist-him-painting', th: 'ภาพวาดมือที่ต่อต้านเขา (ภาพวาดหลอนอีเบย์)', en: 'The Hands Resist Him Haunted Painting' },
  { id: 'pin-koh-hingham-stone-curse', th: 'คำสาปหินงามเกาะหินงาม (เจ้าพ่อตารุตาว)', en: 'Koh Hin Ngam Cursed Black Pebbles' },
  { id: 'pin-maesot-haunted-house-curse', th: 'คำสาปบ้านร้างแม่สอด (คฤหาสน์เฮี้ยนชายแดน)', en: 'Mae Sot Haunted Mansion Curse' },

  // Sacred & Temples & Holy Legends
  { id: 'pin-wat-phra-that-cho-hae', th: 'พระธาตุช่อแฮ วัดพระธาตุช่อแฮ (พระธาตุประจำปีขาล)', en: 'Phra That Cho Hae Sacred Tiger Relic' },
  { id: 'pin-wat-phra-kaew-don-tao', th: 'วัดพระแก้วดอนเต้าสุชาดาราม (ตำนานมรกตแตงโมลำปาง)', en: 'Wat Phra Kaew Don Tao Watermelon Emerald' },
  { id: 'pin-wat-khao-or-phatthalung', th: 'สำนักตักศิลาวัดเขาอ้อ (ตำนานไสยเวทพัทลุง)', en: 'Wat Khao Or Magic Academy of Phatthalung' },
  { id: 'pin-chedi-klang-nam-rayong', th: 'พระเจดีย์กลางน้ำระยอง (มิ่งขวัญปากน้ำระยอง)', en: 'Chedi Klang Nam Island Pagoda of Rayong' },
  { id: 'pin-wat-phra-phuttha-baat-saraburi', th: 'รอยพระพุทธบาทสระบุรี (รอยพระบาทศักดิ์สิทธิ์เขาสุวรรณบรรพต)', en: 'Sacred Footprint of Wat Phra Phutthabat Saraburi' },
  { id: 'pin-wat-yaichaimongkol-ayutthaya', th: 'วัดใหญ่ชัยมงคล (เจดีย์ชัยชนะสมเด็จพระนเรศวรมหาราช)', en: 'Wat Yai Chai Mongkhon Victory Stupa of Ayutthaya' },
  { id: 'pin-wat-arun-dawn-temple', th: 'วัดอรุณราชวรารามราชวรมหาวิหาร (พระปรางค์วัดแจ้งริมเจ้าพระยา)', en: 'Wat Arun Temple of Dawn Prang of Bangkok' },
  { id: 'pin-wat-chalong-luang-phor-cham', th: 'หลวงพ่อแช่ม วัดฉลอง (อภินิหารปราบอั้งยี่ภูเก็ต)', en: 'Luang Phor Cham of Wat Chalong Phuket' },
  { id: 'pin-phra-that-phanom-nakhonphanom', th: 'พระธาตุพนม วัดพระธาตุพนมวรมหาวิหาร (ศูนย์รวมจิตใจลุ่มน้ำโขง)', en: 'Phra That Phanom Stupa of Nakhon Phanom' },
  { id: 'pin-wat-mahathat-yuwaratrangsarit', th: 'วัดมหาธาตุยุวราชรังสฤษฎิ์ (พระมหาธาตุศักดิ์สิทธิ์แห่งกรุงรัตนโกสินทร์)', en: 'Wat Mahathat Yuwaratrangsarit Bangkok' },
  { id: 'pin-shwedagon-pagoda-yangon', th: 'มหาเจดีย์ชเวดากอง (พระเกศาธาตุทองคำแห่งย่างกุ้ง)', en: 'Shwedagon Golden Stupa of Yangon' },
  { id: 'pin-borobudur-temple-java', th: 'มหาสถูปโบโรบูดูร์ (พุทธมณฑลศิลาแห่งเกาะชวา)', en: 'Borobudur Ancient Stone Mandala of Java' },
  { id: 'pin-angkor-wat-celestial-temple', th: 'ปราสาทนครวัด (มหาปราสาทเทวสถานแห่งพระวิษณุ)', en: 'Angkor Wat Grand Celestial Temple of Cambodia' },
  { id: 'pin-parambanan-temple-java', th: 'ปราสาทพรัมบานัน (มหาเทวาลัยตรีมูรติแห่งชวา)', en: 'Prambanan Hindu Celestial Temple of Java' },
  { id: 'pin-kailasa-temple-ellora', th: 'วิหารไกลาสแห่งถ้ำเอลโลรา (เทวสถานสกัดจากเขาหินยักษ์ก้อนเดียว)', en: 'Kailasa Temple Monolith of Ellora' },
  { id: 'pin-mount-athos-monasteries', th: 'เขาแอธอส (ภูเขาศักดิ์สิทธิ์แห่งอารามออร์โธดอกซ์)', en: 'Mount Athos Sacred Holy Mountain Monasteries' },
  { id: 'pin-sedlec-ossuary-czech', th: 'โบสถ์โครงกระดูกเซดเลก (วิหารกะโหลกแห่งคุดนาฮอรา)', en: 'Sedlec Ossuary Bone Church of Kutna Hora' },
  { id: 'pin-mont-saint-michel-abbey', th: 'มง-แซ็ง-มีแชล (วิหารเทวทูตไมเคิลกลางกระแสน้ำขึ้นลง)', en: 'Mont Saint-Michel Tidal Island Abbey' },

  // Monsters & Cryptids & Mythical Beasts
  { id: 'pin-tarasque-provence-monster', th: 'ทาราสก์ (มังกรกระดองเต่าหนามแห่งโพรวองซ์)', en: 'Tarasque Spiked Dragon of Provence' },
  { id: 'pin-nuckelavee-orkney-beast', th: 'นักเคลาวี (ปีศาจม้าไร้ผิวหนังแห่งเกาะออร์คนีย์)', en: 'Nuckelavee Skinless Centaur Monster' },
  { id: 'pin-ammit-egyptian-devourer', th: 'อัมมุต (อสูรกลืนวิญญาณแห่งแดนมรณะอียิปต์)', en: 'Ammit Soul Devourer of Egyptian Underworld' },
  { id: 'pin-manticore-persian-beast', th: 'มันติคอร์ (อสูรสิงโตหน้าคนหางแมงป่องเปอร์เซีย)', en: 'Manticore Persian Lion-Scorpion Chimera' },
  { id: 'pin-roc-giant-bird-arabian', th: 'นกร็อค (พญานกยักษ์โฉบช้างแห่งอาหรับราตรี)', en: 'Roc Giant Roc Bird of Arabian Nights' },
  { id: 'pin-chupacabra-puerto-rico', th: 'ชูปาคาบรา (ปีศาจสูบเลือดแพะแห่งเปอร์โตริโก)', en: 'Chupacabra Goat-Sucker of Puerto Rico' },
  { id: 'pin-ogopogo-lake-monster', th: 'โอโกโปโก (สัตว์ประหลาดทะเลสาบโอคานากัน)', en: 'Ogopogo Lake Monster of Okanagan' },
  { id: 'pin-mothman-point-pleasant', th: 'มอธแมน (มนุษย์มอดตาสีแดงแห่งพอยต์เพลเซนต์)', en: 'Mothman Red-Eyed Harbinger of Point Pleasant' },
  { id: 'pin-jersey-devil-pine-barrens', th: 'ปีศาจเจอร์ซีย์ (อสูรปีกค้างคาวแห่งไพน์บาร์เรนส์)', en: 'Jersey Devil of Pine Barrens' },
  { id: 'pin-rougarou-louisiana-swamp', th: 'รูการู (มนุษย์หมาป่าหนองน้ำหลุยเซียนา)', en: 'Rougarou Swamp Werewolf of Louisiana' },
  { id: 'pin-bunyip-australian-billabong', th: 'บันยิป (อสูรหนองน้ำลึกลับแห่งชนเผ่าอะบอริจิน)', en: 'Bunyip Billabong Monster of Australia' },
  { id: 'pin-yowie-blue-mountains', th: 'โยวี (มนุษย์วานรยักษ์แห่งบลูเมาน์เทนส์)', en: 'Yowie Ape-Man of Australian Outback' },
  { id: 'pin-gorgon-medusa-ruins', th: 'กอร์กอน เมดูซา (อสูรเกศางูผู้สาปมนุษย์เป็นหิน)', en: 'Medusa Gorgon of Ancient Greece' },
  { id: 'pin-minotaur-crete-labyrinth', th: 'มิโนทอร์ (อสูรกายหัววัวแห่งเขาวงกตเกาะครีต)', en: 'Minotaur Cretan Labyrinth Beast' },
  { id: 'pin-chimera-lycia-beast', th: 'คิเมรา (อสูรสามหัวพ่นไฟแห่งลิเชีย)', en: 'Chimera Fire-Breathing Beast of Lycia' },
  { id: 'pin-basilisk-slavic-king', th: 'บาซิลิสก์ (ราชาแห่งอสรพิษผู้สบตาแล้วถึงแก่ความตาย)', en: 'Basilisk Serpent King of Europe' },

  // Legends & Mythological Heroes / Locations
  { id: 'pin-atlantis-sunken-city', th: 'แอตแลนติส (มหาทวีปที่สาบสูญใต้ก้นมหาสมุทร)', en: 'Atlantis Sunken Continent Legend' },
  { id: 'pin-el-dorado-lake-guatavita', th: 'เอลโดราโด (นครทองคำลี้ลับแห่งทะเลสาบกวาตาวิตา)', en: 'El Dorado Golden City of Lake Guatavita' },
  { id: 'pin-shambhala-himalayan-realm', th: 'ชัมบาลา (อาณาจักรศักดิ์สิทธิ์เร้นลับแห่งหิมาลัย)', en: 'Shambhala Hidden Kingdom of Himalayas' },
  { id: 'pin-king-arthur-camelot-tintagel', th: 'กษัตริย์อาเธอร์และดาบเอ็กซ์คาลิเบอร์ (ปราสาททินทาเจล)', en: 'King Arthur and Excalibur Tintagel Castle' },
  { id: 'pin-robin-hood-sherwood-forest', th: 'โรบินฮูด (จอมโจรผู้พิทักษ์แห่งป่าเชอร์วู้ด)', en: 'Robin Hood of Sherwood Forest' },
  { id: 'pin-baba-yaga-hut-slavic', th: 'บาบายากา (แม่มดกระท่อมขากระดูกไก่แห่งป่าสลาวิก)', en: 'Baba Yaga Chicken-Legged Hut of Slavic Woods' },
  { id: 'pin-valhalla-norse-hall', th: 'วัลฮัลลา (วิหารนักรบผู้กล้าแห่งโอดิน)', en: 'Valhalla Hall of the Slain Warriors' },
  { id: 'pin-fountain-of-youth-bimini', th: 'น้ำพุแห่งความเยาว์วัย (ตำนานสายน้ำอมตะแห่งบิมินี)', en: 'Fountain of Youth Spring of Bimini' },
  { id: 'pin-pied-piper-hamelin', th: 'คนเป่าปี่แห่งฮาเมิลน์ (ตำนานเสียงดนตรีลวงเด็กหาย)', en: 'Pied Piper of Hamelin' },
  { id: 'pin-will-o-the-wisp-bog', th: 'วิลโอเดอะวิสป์ (ดวงไฟลวงวิญญาณกลางหนองน้ำมรณะ)', en: 'Will-o-the-Wisp Phantom Bogs of Europe' },
  { id: 'pin-flying-dutchman-cape-good-hope', th: 'ฟลายอิงดัตช์แมน (เรือผีโจรสลัดต้องสาปแห่งแหลมกู๊ดโฮป)', en: 'Flying Dutchman Ghost Ship of Cape of Good Hope' },
  { id: 'pin-banshee-irish-howl', th: 'แบนชี (ภูตสาวคร่ำครวญบอกลางมรณะแห่งไอร์แลนด์)', en: 'Banshee Irish Death Wailing Spirit' },
  { id: 'pin-dullahan-headless-rider', th: 'ดุลลาฮาน (อัศวินหัวขาดขี่ม้าดำแห่งไอร์แลนด์)', en: 'Dullahan Headless Horseman of Ireland' },
  { id: 'pin-kelpie-scottish-lochs', th: 'เคลพี (ภูตม้าน้ำลวงกินคนแห่งสก็อตแลนด์)', en: 'Kelpie Water Horse of Scottish Lochs' },
  { id: 'pin-black-shuck-norfolk', th: 'แบล็กชัค (สุนัขปีศาจตาสีเพลิงแห่งนอร์ฟอล์ก)', en: 'Black Shuck Phantom Dog of Norfolk' },
  { id: 'pin-krampus-alps-punisher', th: 'ครามปุส (ปีศาจลงทัณฑ์เด็กดื้อแห่งเทือกเขาแอลป์)', en: 'Krampus Alpine Horned Punisher' }
];

console.log('Testing ' + candidates.length + ' candidates:');
let duplicates = 0;
candidates.forEach(c => {
  if (curIds.has(c.id.toLowerCase())) {
    console.log('[DUPLICATE ID]:', c.id);
    duplicates++;
  } else if (curText.includes(c.th.toLowerCase()) || curText.includes(c.en.toLowerCase())) {
    console.log('[POSSIBLE TITLE OVERLAP]:', c.id, c.th, c.en);
    duplicates++;
  }
});

console.log('Finished test. Potential issues:', duplicates);

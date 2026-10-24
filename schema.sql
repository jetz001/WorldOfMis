-- Worldofmys - Cloudflare D1 Schema & Initial Seed Data

DROP TABLE IF EXISTS ghost_pins;
DROP TABLE IF EXISTS admins;

CREATE TABLE admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ghost_pins (
    id TEXT PRIMARY KEY,
    title_th TEXT NOT NULL,
    title_en TEXT NOT NULL,
    category TEXT NOT NULL,
    province_th TEXT NOT NULL,
    province_en TEXT NOT NULL,
    district_th TEXT,
    district_en TEXT,
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    story_th TEXT NOT NULL,
    story_en TEXT NOT NULL,
    folklore_history_th TEXT NOT NULL,
    folklore_history_en TEXT NOT NULL,
    image_url TEXT,
    audio_url TEXT,
    sound_preset TEXT DEFAULT 'whisper', -- 'whisper', 'water_spirit', 'jungle_curse', 'temple_bell', 'creepy_wind'
    views_count INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ghost_pins_coords ON ghost_pins(lat, lng);
CREATE INDEX idx_ghost_pins_province ON ghost_pins(province_en);
CREATE INDEX idx_ghost_pins_category ON ghost_pins(category);

-- Default Admin User (username: admin, password: password123)
-- SHA-256 for demo / default seed: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'
INSERT INTO admins (id, username, password_hash, role)
VALUES ('admin-root', 'admin', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'superadmin');

-- Seed Data: 10 Famous Thai Folklore & Ghost Stories
INSERT INTO ghost_pins (
    id, title_th, title_en, category, province_th, province_en, district_th, district_en,
    lat, lng, story_th, story_en, folklore_history_th, folklore_history_en,
    sound_preset, views_count, is_published
) VALUES
(
    'pin-maenak',
    'แม่นาคพระโขนง',
    'Mae Nak Phra Khanong',
    'ghost',
    'กรุงเทพมหานคร',
    'Bangkok',
    'พระโขนง',
    'Phra Khanong',
    13.7088,
    100.6015,
    'ตำนานรักอมตะอันน่าสะพรึงกลัวของหญิงสาวผู้รอคอยสามีกลับจากสงคราม แม้ตนเองและลูกจะเสียชีวิตขณะคลอดจนกลายเป็นผีตายทั้งกลม นางยังคงเฝ้าปรนนิบัติสามีจนกระทั่งความจริงถูกเปิดเผย',
    'The timeless folklore of eternal love and horror. A young pregnant wife died during childbirth while her husband was away at war. Her spirit refused to leave this realm, pretending to be alive to nurture him.',
    'ศาลแม่นาคตั้งอยู่ที่วัดมหาบุศย์ ถนนอ่อนนุช เป็นศูนย์รวมความศรัทธาเรื่องความรักและการจับใบดำใบแดงเกณฑ์ทหารตามความเชื่อโบราณกว่าร้อยปี',
    'The Mae Nak shrine at Wat Mahabut on On Nut Road has been a sacred sanctuary for love and military draft protection prayers for over a century.',
    'whisper',
    1420,
    1
),
(
    'pin-krasue',
    'กระสือยายสาย',
    'The Krasue of Kabin Buri',
    'curse',
    'ปราจีนบุรี',
    'Prachinburi',
    'กบินทร์บุรี',
    'Kabin Buri',
    13.9854,
    101.7164,
    'วิญญาณสตรีต้องสาป ถอดหัวพร้อมไส้เรืองแสงสีเขียววาววับ ลอยล่องยามราตรีเพื่อหาของสดคาวและสิ่งปฏิกูลตามท้องทุ่งชายป่า',
    'A cursed female spirit whose head and glowing viscera detach at night, floating through fields seeking raw flesh and entrails under the cover of darkness.',
    'ชาวบ้านแถบกบินทร์บุรีและทุ่งรังสิตยุคก่อน มีธรรมเนียมการนำหนามไผ่มาล้อมใต้ถุนบ้านเรือนเพื่อป้องกันไม่ให้ไส้ของผีกระสือเกี่ยวติด',
    'Villagers in eastern rural plains traditionally placed thorny bamboo branches under stilt houses to deter the floating spirit from snagging its entrails.',
    'creepy_wind',
    890,
    1
),
(
    'pin-pop',
    'ผีปอบหยิบแห่งลุ่มน้ำปาว',
    'Phi Pop of Pao Basin',
    'curse',
    'กาฬสินธุ์',
    'Kalasin',
    'เมืองกาฬสินธุ์',
    'Mueang Kalasin',
    16.4322,
    103.5065,
    'วิญญาณปอบผู้สิงสู่ร่างมนุษย์จากการผิดครูคาถาอาคม กัดกินตับไตไส้พุงเหยื่อจากภายในโดยไม่มีบาดแผลภายนอก สร้างความหวาดผวาให้คนในหมู่บ้าน',
    'A spirit born from broken occult vows that possesses a human vessel, devouring internal organs of its victims from within leaving no exterior scars.',
    'พิธีกรรมไล่ปอบด้วยหมอธรรมและเซิ้งสวิงจับผีใส่กระบอกไม้ไผ่ เป็นหนึ่งในมรดกความเชื่อทางมานุษยวิทยาที่เข้มข้นที่สุดของภาคอีสาน',
    'The Pop exorcism ritual using Mor Tham shamans and bamboo traps represents one of Isan region’s deepest anthropological folklore traditions.',
    'whisper',
    1150,
    1
),
(
    'pin-saming',
    'สมิงเขาหลวง',
    'The Were-Tiger of Khao Luang',
    'monster',
    'นครศรีธรรมราช',
    'Nakhon Si Thammarat',
    'ลานสกา',
    'Lan Saka',
    8.4988,
    99.7345,
    'พรานป่าผู้ฝึกวิชาอาคมเสือสมิงจนของเข้าตัว กลายร่างเป็นเสือร้ายที่สามารถเลียนเสียงคนรู้จักเพื่อล่อลวงพรานคนอื่นลงจากห้างยิงสัตว์ในป่าดงดิบ',
    'A master hunter who mastered black tiger sorcery until overtaken by its curse, transforming into a cunning beast capable of mimicking familiar voices to lure victims.',
    'เทือกเขาหลวง นครศรีธรรมราช เป็นป่าดงดิบโบราณที่เต็มไปด้วยเรื่องเล่าอาถรรพ์พรานป่าและสมุนไพรศักดิ์สิทธิ์ที่เล่าสืบต่อกันมาหลายร้อยปี',
    'The ancient rainforests of Khao Luang mountain range hold legendary status among southern trackers and herbalists for unseen jungle forces.',
    'jungle_curse',
    760,
    1
),
(
    'pin-phika',
    'ผีกะดง ล้านนา',
    'Phi Ka (Lanna Familiar Spirit)',
    'ghost',
    'เชียงใหม่',
    'Chiang Mai',
    'แม่ริม',
    'Mae Rim',
    18.9142,
    98.9431,
    'ผีประจำตระกูลฝ่ายหญิงในล้านนา หากเลี้ยงดูไม่ดีหรือไม่มีใครรับขันผี จะออกหากินยามค่ำคืนในสภาพใบหน้าสวยงามแต่มีแสงเรืองรองที่ปลายลิ้น',
    'An ancestral familiar spirit of Northern Thailand. If neglected, it manifests with mesmerizing beauty and glowing lights, wandering the foothills.',
    'ในอดีตชาวบ้านเชื่อว่าการเลี้ยงผีกะช่วยให้หน้าตาสะสวย มีเสน่ห์ทางเมตตามหานิยม แต่ต้องเซ่นไหว้ด้วยไข่ต้มและไก่สดเป็นประจำ',
    'Ancient Lanna folklore believed keeping a Phi Ka enhanced beauty and charm, provided strict feeding rituals with fresh offerings were honored.',
    'temple_bell',
    980,
    1
),
(
    'pin-naga',
    'พญานาคแม่น้ำโขงและบั้งไฟพญานาค',
    'Naga Serpent of the Mekong',
    'sacred',
    'หนองคาย',
    'Nong Khai',
    'โพนพิสัย',
    'Phon Phisai',
    18.0163,
    103.0786,
    'ตำนานเจ้าแห่งสายน้ำโขง ผู้ปกปักรักษาพระพุทธศาสนาและพ่นลูกไฟสีชมพูอมแดงขึ้นสู่ท้องฟ้ายามค่ำคืนวันออกพรรษาเป็นพุทธบูชา',
    'The mythical serpent deity guarding the Mekong River, honoring the Lord Buddha by releasing rising luminous red-pink orbs into the night sky.',
    'ปรากฏการณ์บั้งไฟพญานาคเป็นปริศนาทางธรรมชาติและแรงศรัทธาอันยิ่งใหญ่ที่ดึงดูดผู้คนนับแสนมารวมตัวริมฝั่งโขงทุกปี',
    'The Naga fireballs phenomenon remains a blend of natural wonder and sacred veneration, drawing hundreds of thousands to the riverbanks annually.',
    'water_spirit',
    2300,
    1
),
(
    'pin-pret',
    'ผีเปรตเขาช่องลม',
    'The Pret of Khao Chong Lom',
    'ghost',
    'กาญจนบุรี',
    'Kanchanaburi',
    'เมืองกาญจนบุรี',
    'Mueang Kanchanaburi',
    14.0228,
    99.5328,
    'อมนุษย์ร่างสูงเทียมยอดตาล ปากเท่ารูเข็ม ร้องโหยหวนขอส่วนบุญในคืนเดือนดับ ผลกรรมจากความตระหนี่ถี่เหนียวและการด่าทอบิดามารดาในชาติก่อน',
    'Towering humanoid spirits standing as tall as palm trees with mouths as tiny as needles, wailing into the night from agonizing cosmic hunger due to past sins.',
    'ประเพณีบุญสารทเดือนสิบและการชิงเปรต มีรากฐานมาจากการอุทิศส่วนกุศลให้แก่บรรพชนและดวงวิญญาณเปรตเหล่านี้',
    'The traditional Sart Thai merit-making ceremonies are dedicated to relieving the suffering of these hungry wandering spirits.',
    'whisper',
    670,
    1
),
(
    'pin-phrai',
    'ผีพรายน้ำเกาะสมุย',
    'Phi Phrai of Samui Waters',
    'ghost',
    'สุราษฎร์ธานี',
    'Surat Thani',
    'เกาะสมุย',
    'Ko Samui',
    9.5357,
    100.0628,
    'วิญญาณแห่งสายน้ำและทะเลลึก ปรากฏกายเป็นกลุ่มควันหรือฟองพรายเรืองแสง ล่อหลอกนักเดินทางให้จมสู่ห้วงสมุทรอันไร้ก้นบึ้ง',
    'An aquatic spirit of coastal waters and deep coral reefs, appearing as ethereal phosphorescent bubbles that entice nocturnal divers into the deep.',
    'ชาวประมงพื้นบ้านภาคใต้มีเครื่องรางและคาถากันพรายน้ำ ก่อนออกเรือยามค่ำคืนจะต้องไหว้แม่ย่านางและสังเวยด้วยหมากพลู',
    'Southern coastal mariners maintain protective talismans and offer betel nuts to the guardian vessel spirit Mae Ya Nang before night voyages.',
    'water_spirit',
    810,
    1
),
(
    'pin-laplae',
    'เมืองลับแลเขาวงพระจันทร์',
    'The Hidden Realm of Khao Wong Phrachan',
    'legend',
    'ลพบุรี',
    'Lopburi',
    'โคกสำโรง',
    'Khok Samrong',
    15.0042,
    100.7186,
    'มิติคู่ขนานเมืองแม่ม่ายที่ซ่อนตัวอยู่หลังม่านหมอก ผู้ที่จะก้าวผ่านเข้าไปได้ต้องรักษาศีลและห้ามกล่าวคำเท็จแม้แต่คำเดียว',
    'A parallel mythical city concealed behind mystical mountain mists, accessible only to travelers of absolute moral purity who never speak a falsehood.',
    'ตำนานเล่าถึงชายหนุ่มที่พลัดหลงเข้าไปพบรัก แต่สุดท้ายต้องถูกเนรเทศกลับโลกมนุษย์เพราะเผลอโกหกลูกน้อยเพื่อปลอบประโลม',
    'Folklore tells of a stranded traveler who found love in the mist city, but was banished forever after uttering a white lie to soothe his weeping child.',
    'temple_bell',
    940,
    1
),
(
    'pin-som',
    'ปู่โสมเฝ้าทรัพย์กรุงเก่า',
    'Pu Som the Treasure Guardian of Ayutthaya',
    'sacred',
    'พระนครศรีอยุธยา',
    'Phra Nakhon Si Ayutthaya',
    'พระนครศรีอยุธยา',
    'Phra Nakhon Si Ayutthaya',
    14.3532,
    100.5684,
    'วิญญาณขุนพลและผู้ทรงศีลโบราณ ผู้ยอมสละชีวิตเพื่อเป็นทวยเทพพิทักษ์รักษาสมบัติแผ่นดินใต้ซากปรักหักพังของวัดโบราณในกรุงศรีอยุธยา',
    'An ancient warrior spirit who bound his soul in sacred eternity to safeguard royal relics and treasures beneath the ruined stupas of Ayutthaya.',
    'ผู้ใดที่คิดขุดค้นทำลายโบราณสถานเพื่อหาของมีค่า มักประสบเคราะห์ร้ายและอาการวิกลจริตจนต้องนำของมาคืนที่วัด',
    'Looters and treasure hunters trespassing on ancient temple grounds historically reported hallucinations and tragedies until relics were returned.',
    'temple_bell',
    1880,
    1
);

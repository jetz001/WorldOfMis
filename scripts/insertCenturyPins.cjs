const fs = require('fs');
const path = require('path');

const NEW_25_PINS = [
  {
    id: 'pin-machupicchu',
    title_th: 'มาชูปิกชู นครสาบสูญแห่งอินคา',
    title_en: 'Machu Picchu, Lost City of the Incas',
    category: 'sacred',
    province_th: 'กุสโก (เปรู)',
    province_en: 'Cusco (Peru)',
    district_th: 'หุบเขาศักดิ์สิทธิ์อูรูบัมบา',
    district_en: 'Sacred Valley of the Incas',
    lat: -13.16,
    lng: -72.54,
    story_th: 'ป้อมปราการหินโบราณบนยอดเขาสูงเสียดฟ้ากว่า 2,430 เมตร สร้างขึ้นในคริสต์ศตวรรษที่ 15 โดยจักรพรรดิปาชากูตี สถาปัตยกรรมหินขนาดมหึมาต่อประสานกันแนบสนิทโดยไม่ใช้ปูน เสาหินอินติฮัวตานา (Intihuatana) ทำหน้าที่เป็นหลักผูกดวงอาทิตย์และประตูดวงดาวของนักบวชอินคา',
    story_en: 'A 15th-century Inca citadel perched on a mountain ridge 2,430 meters above sea level in the Sacred Valley. Built with polished dry-stone walls fit so tightly that not even a knife blade can slice between them. Its sacred Intihuatana stone served as an astronomical clock and solar anchor.',
    folklore_history_th: 'ชาวเกชัวเชื่อว่ามาชูปิกชูคือจุดเชื่อมต่อพลังงานคอสมิกแห่งเทือกเขาแอนดีส (Apu) ถูกทิ้งร้างอย่างลึกลับเมื่อสเปนเข้ารุกราน และรอดพ้นจากการทำลายล้างจนกระทั่ง ไฮแรม บิงแฮม ค้นพบในปี 1911',
    folklore_history_en: 'Quechua folklore considers the site a nexus of sacred mountain spirits (Apus). Mysteriously abandoned during the Spanish conquest, it remained hidden beneath cloud forest canopies until brought to international attention by Hiram Bingham in 1911.',
    image_url: '/entities/pin-machupicchu.jpg',
    sound_preset: 'temple_bell',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-machupicchu.jpg',
        title: 'มาชูปิกชูตระหง่านเหนือหุบเขาเมฆหมอกแอนดีส'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=cnMa-Sm9H4k',
        title: 'Machu Picchu: Secrets of the Incan Empire Documentary',
        thumbnail: '/entities/pin-machupicchu.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-derinkuyu',
    title_th: 'นครใต้ดินเดรินกูยูแห่งแคปพาโดเชีย',
    title_en: 'Derinkuyu Underground City',
    category: 'legend',
    province_th: 'เนฟเชฮีร์ (ตุรกี)',
    province_en: 'Nevşehir (Turkey)',
    district_th: 'แคปพาโดเชีย',
    district_en: 'Cappadocia',
    lat: 38.37,
    lng: 34.73,
    story_th: 'มหานครใต้ดินโบราณขุดลึกลงไปใต้พิภพกว่า 85 เมตร มีถึง 18 ชั้น สามารถรองรับประชากรได้มากกว่า 20,000 คน พร้อมคอกสัตว์ โรงกลั่นเหล้าองุ่น โรงเรียน และบ่อน้ำบาดาล ปิดกั้นด้วยประตูดิสก์หินกลิ้งขนาดยักษ์หนักครึ่งตันที่เปิดได้เฉพาะจากด้านในเท่านั้น',
    story_en: 'An ancient multi-level subterranean city extending to a depth of approximately 85 meters, capable of sheltering 20,000 people and their livestock. Carved out of soft volcanic tuff, it featured ventilation shafts, chapels, and massive circular rolling stone doors sealed from within.',
    folklore_history_th: 'สร้างขึ้นตั้งแต่ยุคชาวไฟรเจียหรือชาวฮิตไทต์ ก่อนถูกใช้เป็นที่หลบภัยการประหัตประหารของชาวคริสต์ยุคแรก ค้นพบโดยบังเอิญในปี 1963 เมื่อชาวบ้านทุบกำแพงห้องใต้ดินแล้วพบห้องลับนำไปสู่อุโมงค์โบราณ',
    folklore_history_en: 'First excavated by Phrygians or Hittites and later expanded by Byzantine Christians fleeing Arab raids. Rediscovered in 1963 when a local resident knocked down a basement wall to find a mysterious subterranean passage.',
    image_url: '/entities/pin-derinkuyu.jpg',
    sound_preset: 'whisper',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-derinkuyu.jpg',
        title: 'อุโมงค์หินโบราณและช่องระบายอากาศนครใต้ดินเดรินกูยู'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=Y8RigxxiWUw',
        title: 'Derinkuyu: Ancient Underground City of Turkey',
        thumbnail: '/entities/pin-derinkuyu.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-mokelembembe',
    title_th: 'โมเคเล-เอ็มเบมเบ ไดโนเสาร์มีชีวิตแห่งคองโก',
    title_en: 'Mokele-mbembe, Living Dinosaur of the Congo',
    category: 'monster',
    province_th: 'ลีคูอาลา (สาธารณรัฐคองโก)',
    province_en: 'Likouala (Republic of the Congo)',
    district_th: 'แอ่งน้ำทะเลสาบเตเล',
    district_en: 'Lake Télé Swamps',
    lat: 1.0,
    lng: 17.5,
    story_th: 'สิ่งมีชีวิตลึกลับขนาดมหึมาคล้ายไดโนเสาร์ซอโรพอดคอยาว ผิวสีน้ำตาลอมเทา มีหงอนหรือเขาเดี่ยว อาศัยอยู่ในป่าพรุและแม่น้ำทึบของลุ่มน้ำคองโก ชนเผ่าปิ๊กมี่เล่าว่ามันชอบกินพืชน้ำและพวงผลไม้มะลอมโบ แต่มีอุปนิสัยดุร้าย สามารถคว่ำเรือแคนูและสังหารฮิปโปโปเตมัสได้',
    story_en: 'A legendary cryptid resembling a small sauropod dinosaur reported by indigenous Pygmy hunters in the remote Congo River Basin. Described with a long flexible neck, smooth grey-brown skin, and a muscular tail, inhabiting the unmapped swamps surrounding Lake Télé.',
    folklore_history_th: 'มิชชันนารีชาวฝรั่งเศสบันทึกรอยเท้าขนาดยักษ์ในปี 1776 คณะสำรวจทางวิทยาศาสตร์จากสถาบันสมิธโซเนียนและมหาวิทยาลัยชิคาโกส่งทีมสำรวจหลายครั้งแต่ยังไม่สามารถยืนยันตัวตนได้ชัดเจน',
    folklore_history_en: 'First mentioned by French missionaries in 1776 observing enormous clawed footprints. Multiple cryptozoological expeditions led by Roy Mackal in the 1980s documented eyewitness accounts from Pygmy elders describing encounters.',
    image_url: '/entities/pin-mokelembembe.jpg',
    sound_preset: 'jungle_curse',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-mokelembembe.jpg',
        title: 'ภาพจำลองสัตว์ประหลาดโมเคเล-เอ็มเบมเบกลางบึงน้ำคองโก'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=Fj-yK23aD6A',
        title: 'Mokele-Mbembe: The Living Dinosaur of Congo',
        thumbnail: '/entities/pin-mokelembembe.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-hopediamond',
    title_th: 'คำสาปเพชรโฮป มณีมรณะแห่งราชวงศ์',
    title_en: 'The Hope Diamond Curse',
    category: 'curse',
    province_th: 'วอชิงตัน ดี.ซี. (สหรัฐอเมริกา)',
    province_en: 'Washington, D.C. (USA)',
    district_th: 'สถาบันสมิธโซเนียน',
    district_en: 'Smithsonian Natural History Museum',
    lat: 38.89,
    lng: -77.02,
    story_th: 'อัญมณีสีน้ำเงินเข้มขนาด 45.52 กะรัต ที่เปล่งแสงเรืองสีแดงเลือดนกหลังถูกฉายแสงยูวี ตำนานเล่าว่าถูกขโมยมาจากดวงพระเนตรของเทวรูปเจ้าแม่กาลีในอินเดีย นำพาหายนะ ความวิกลจริต และความตายอย่างโหดร้ายแก่ผู้ครอบครองทุกคน ตั้งแต่พระเจ้าหลุยส์ที่ 16 และพระนางมารี อ็องตัวแน็ต',
    story_en: 'A legendary 45.52-carat deep blue diamond infamous for glowing with phosphorescent fiery crimson luminescence under UV light. Cursed since being plundered from the sacred eye of a Hindu idol in Golconda, bringing decapitation, bankruptcy, and tragic madness to owners across centuries.',
    folklore_history_th: 'เรื่องราวคำสาปถูกตีพิมพ์อย่างกว้างขวางในหนังสือพิมพ์ยุโรปและอเมริกาต้นศตวรรษที่ 20 ก่อนที่ แฮร์รี วินสตัน ช่างอัญมณีชื่อดังจะบริจาคให้แก่สถาบันสมิธโซเนียนทางไปรษณีย์ธรรมดาเพื่อปลดปล่อยคำสาป',
    folklore_history_en: 'Sensationalized in late Victorian journalism chronicling the tragic deaths of the French royal family, Lord Francis Hope, and Evalyn Walsh McLean. Donated by jeweler Harry Winston via registered mail to the Smithsonian Institution in 1958.',
    image_url: '/entities/pin-hopediamond.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-hopediamond.jpg',
        title: 'เพชรโฮปสีน้ำเงินล้ำค่าในพิพิธภัณฑ์สมิธโซเนียน'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=FjD9b5sL80I',
        title: 'Curse of the Hope Diamond: History and Tragedies',
        thumbnail: '/entities/pin-hopediamond.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-hoiabaciu',
    title_th: 'ป่าอาถรรพ์ฮอยา-บาชู สามเหลี่ยมเบอร์มิวดาแห่งทรานซิลเวเนีย',
    title_en: 'Hoia-Baciu Forest, The Bermuda Triangle of Romania',
    category: 'curse',
    province_th: 'คลูช (โรมาเนีย)',
    province_en: 'Cluj (Romania)',
    district_th: 'ทรานซิลเวเนีย',
    district_en: 'Transylvania',
    lat: 46.77,
    lng: 23.51,
    story_th: 'ผืนป่าดงดิบต้นไม้บิดเบี้ยวผิดรูปแปลกประหลาด มีลานโล่งวงกลมสมบูรณ์แบบใจกลางป่า (The Clearing) ที่ดินไม่ยอมให้พืชชนิดใดเติบโต ผู้มาเยือนมักเกิดอาการคลื่นไส้ ผื่นคัน รู้สึกเหมือนถูกจ้องมอง และพบการทำงานผิดปกติของอุปกรณ์อิเล็กทรอนิกส์และลูกไฟลอยได้',
    story_en: 'A primeval forest of contorted, bent oak and beech trees dubbed the Bermuda Triangle of Transylvania. At its core lies a mysterious circular clearing where vegetation inexplicably refuses to grow, plagued by electromagnetic anomalies, phantom voices, and floating luminescent orbs.',
    folklore_history_th: 'ได้ชื่อตามคนเลี้ยงแกะที่หายตัวไปพร้อมฝูงแกะ 200 ตัวอย่างไร้ร่องรอย ในปี 1968 นักชีววิทยา เอมิล บาร์เนีย ถ่ายภาพวัตถุบินทรงจานกลมเรืองแสงเหนือยอดไม้ จนกลายเป็นสถานที่วิจัยปรากฏการณ์เหนือธรรมชาติชื่อดัง',
    folklore_history_en: 'Named after a shepherd who vanished into the woods along with a flock of 200 sheep. Achieved international fame in 1968 when military technician Emil Barnea captured authentic photographs of a saucer-shaped craft hovering above the tree canopy.',
    image_url: '/entities/pin-hoiabaciu.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-hoiabaciu.jpg',
        title: 'ลานวงกลมปริศนาและต้นไม้คดโค้งในป่าฮอยา-บาชู'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=F_fP_iM8_qg',
        title: 'Hoia-Baciu: Inside Europe’s Most Haunted Forest',
        thumbnail: '/entities/pin-hoiabaciu.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-lallorona',
    title_th: 'ลาโยโรนา หญิงคร่ำครวญแห่งสายน้ำ',
    title_en: 'La Llorona, The Weeping Woman',
    category: 'ghost',
    province_th: 'เม็กซิโกซิตี (เม็กซิโก)',
    province_en: 'Mexico City (Mexico)',
    district_th: 'ลุ่มแม่น้ำและคูคลองเตนอชตีตลัน',
    district_en: 'Canals of Tenochtitlan',
    lat: 19.43,
    lng: -99.13,
    story_th: 'วิญญาณหญิงสาวในชุดคลุมสีขาวเปื้อนคราบน้ำตา ผู้เดินเตร็ดเตร่ร้องไห้คร่ำครวญริมสายน้ำในยามราตรี เสียงร่ำไห้โหยหวนว่า "¡Ay, mis hijos!" (โอ้ ลูกๆ ของแม่) นางพลั้งมือจับลูกของตนจมน้ำเพื่อแก้แค้นสามีที่ทรยศ ก่อนจะสำนึกผิดและตรอมใจตาย จนวิญญาณถูกสาปให้ตามหาลูกไปชั่วกาลนาน',
    story_en: 'The immortal weeping wraith of Hispanic folklore. Clad in a drenched white bridal gown, she wanders riverbanks and arroyos mourning the children she drowned in a fit of jealous grief over her betraying lover. Her agonizing wail—"¡Ay, mis hijos!"—brings misfortune to anyone who hears it.',
    folklore_history_th: 'สืบย้อนรากเหง้าไปถึงเทพีแอซเท็กโบราณ ชิวาโกอัตล์ (Cihuacoatl) ผู้ปรากฏกายส่งเสียงร่ำไห้ก่อนการล่มสลายของจักรวรรดิแอซเท็ก ผู้ใหญ่ในลาตินอเมริกามักใช้เล่าเตือนเด็กๆ ไม่ให้ออกไปเดินเล่นริมน้ำยามค่ำคืน',
    folklore_history_en: 'Pre-Columbian roots trace to the Aztec mother goddess Cihuacoatl, who wailed omens of doom through Tenochtitlan before the Spanish invasion. In Mexican culture, parents recount the legend to keep young children away from treacherous midnight waterways.',
    image_url: '/entities/pin-lallorona.jpg',
    sound_preset: 'whisper',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-lallorona.jpg',
        title: 'ภาพวาดโบราณวิญญาณลาโยโรนาริมสายน้ำยามราตรี'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=kYv9GZ-lX3Y',
        title: 'The Terrifying Legend of La Llorona Explained',
        thumbnail: '/entities/pin-lallorona.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-terracotta',
    title_th: 'สุสานจิ๋นซีฮ่องเต้และกองทัพทหารดินเผา',
    title_en: "Terracotta Army & Qin Shi Huang's Tomb",
    category: 'sacred',
    province_th: 'ซีอาน (จีน)',
    province_en: "Xi'an (China)",
    district_th: 'หลินถง / เขาหลี่ซาน',
    district_en: 'Lintong / Mount Li',
    lat: 34.38,
    lng: 109.25,
    story_th: 'มหาสุสานใต้พิภพของจักรพรรดิองค์แรกแห่งแผ่นดินจีน ปกป้องด้วยกองทัพทหารดินเผาและม้าศึกขนาดเท่าตัวจริงกว่า 8,000 นาย แต่ละหน้าตามีเอกลักษณ์ไม่ซ้ำกัน ภายในเนินดินสุสานหลักมีสายน้ำปรอทไหลเวียนจำลองแผนที่อาณาจักร กลไกหน้าไม้สังหารอัตโนมัติ และเพดานประดับไข่มุกจำลองดวงดาว',
    story_en: 'The colossal subterranean necropolis of China’s first emperor, guarded by over 8,000 unique life-sized terracotta soldiers, chariots, and horses. Ancient historical records chronicle an underground palace with flowing rivers of liquid mercury, mechanical crossbow booby traps, and celestial pearl star ceilings.',
    folklore_history_th: 'พงศาวดารซื่อจี้ของซือหม่าเชียนบันทึกว่าใช้แรงงานก่อสร้างกว่า 700,000 คน นักวิทยาศาสตร์ยุคใหม่ตรวจพบไอระเหยของปรอทในระดับเข้มข้นสูงรอบสุสานหลัก ทำให้ยังคงไม่มีการเปิดขุดค้นห้องฝังพระศพจนถึงปัจจุบัน',
    folklore_history_en: "Chronicled by Grand Historian Sima Qian in 94 BCE. Soil samples collected around the burial mound confirm mercury concentrations hundreds of times higher than natural levels, keeping the core chamber sealed and undisturbed by modern archaeologists.",
    image_url: '/entities/pin-terracotta.jpg',
    sound_preset: 'temple_bell',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-terracotta.jpg',
        title: 'กองทัพทหารดินเผาจิ๋นซีฮ่องเต้เมืองซีอาน'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=bOQJ85t8Y6g',
        title: 'The Mystery of China’s First Emperor and Terracotta Warriors',
        thumbnail: '/entities/pin-terracotta.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-jacktheripper',
    title_th: 'แจ็กเดอะริปเปอร์ ฆาตกรเงาหมอกแห่งไวต์แชเปล',
    title_en: 'Jack the Ripper of Whitechapel',
    category: 'curse',
    province_th: 'ลอนดอน (สหราชอาณาจักร)',
    province_en: 'London (UK)',
    district_th: 'ไวต์แชเปล / สปิตัลฟิลด์ส',
    district_en: 'Whitechapel / Spitalfields',
    lat: 51.52,
    lng: -0.06,
    story_th: 'ฆาตกรต่อเนื่องปริศนาในฤดูใบไม้ร่วงปี 1888 ก่อคดีสะเทือนขวัญสังหารสตรีอย่างโหดเหี้ยม 5 ราย (Canonical Five) ในตรอกมืดของย่านไวต์แชเปล มีความชำนาญการใช้มีดระดับศัลยแพทย์ ส่งจดหมายท้าทายตำรวจลงชื่อ "From Hell" พร้อมชิ้นส่วนไตมนุษย์ ก่อนจะหายสาบสูญไปในสายหมอกหนาทึบของลอนดอนโดยไม่ถูกจับกุม',
    story_en: 'The world’s most notorious unidentified serial killer who terrorized the fog-drenched alleys of Whitechapel during the "Autumn of Terror" in 1888. Displaying precise surgical mutilation, he taunted Scotland Yard with letters addressed "From Hell", vanishing forever into historical legend.',
    folklore_history_th: 'คดีนี้ปฏิวัติการสืบสวนคดีอาญาและนิติวิทยาศาสตร์ ก่อกำเนิดทฤษฎีผู้ต้องสงสัยนับร้อยราย ตั้งแต่แพทย์หลวงประจำราชวงศ์ ศิลปิน ไปจนถึงเจ้าชายวิกเตอร์ ก่อกำเนิดเป็นตำนานเมืองและวัฒนธรรมสยองขวัญระดับสากล',
    folklore_history_en: 'Sparked modern forensic profiling and over a century of "Ripperology". Suspects have ranged from royal physician Sir William Gull to artist Walter Sickert and Prince Albert Victor, solidifying the phantom as Victorian gothic lore.',
    image_url: '/entities/pin-jacktheripper.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-jacktheripper.jpg',
        title: 'ภาพสเก็ตช์แจ็กเดอะริปเปอร์ในหนังสือพิมพ์ลอนดอนปี 1888'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=FjD9b5sL80I',
        title: 'The Real Identity of Jack the Ripper Unsolved Investigation',
        thumbnail: '/entities/pin-jacktheripper.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-flatwoods',
    title_th: 'สัตว์ประหลาดแฟลตวูดส์ อสูรเขียวจากต่างดาว',
    title_en: 'The Flatwoods Monster (Braxton County Monster)',
    category: 'monster',
    province_th: 'เวสต์เวอร์จิเนีย (สหรัฐอเมริกา)',
    province_en: 'West Virginia (USA)',
    district_th: 'แฟลตวูดส์ / บรักซ์ตันเคาน์ตี',
    district_en: 'Flatwoods / Braxton County',
    lat: 38.72,
    lng: -80.65,
    story_th: 'สิ่งมีชีวิตลึกลับสูงกว่า 10 ฟุต มีศีรษะรูปใบโพธิ์หรือหัวจอบสีแดงเข้ม ดวงตาเรืองแสงสีส้ม ลำตัวสวมกระโปรงจีบสีเขียวเข้มคล้ายโลหะ ลอยตัวเหนือพื้นดินพร้อมหมอกควันกำมะถันฉุนกึก ปรากฏตัวหลังลูกไฟสีแดงตกลงบนยอดเขาเมื่อคืนวันที่ 12 กันยายน 1952 ทำให้พยานที่สูดดมควันล้มป่วยรุนแรง',
    story_en: 'An otherworldly entity standing at least 10 feet tall with a spade-shaped cowl hood and glowing non-human eyes. First sighted by boys and Kathleen May following a pulsating red craft crashing into a hillside in September 1952, gliding silently on a column of noxious, sickening gas.',
    folklore_history_th: 'การเผชิญหน้าของชาวเมืองแฟลตวูดส์ได้รับการบันทึกในเอกสารโครงการ Project Blue Book ของกองทัพอากาศสหรัฐฯ จนกลายเป็นไอคอนประจำเมือง มีพิพิธภัณฑ์และเก้าอี้รูปสัตว์ประหลาดตั้งทั่วเมือง',
    folklore_history_en: 'Investigated by the US Air Force under Project Blue Book and civilian UFO groups. The creature became an iconic folk legend celebrated with the Flatwoods Monster Museum and giant commemorative chairs throughout the town.',
    image_url: '/entities/pin-flatwoods.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-flatwoods.jpg',
        title: 'ภาพสเก็ตช์สัตว์ประหลาดแฟลตวูดส์ปี 1952'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=fXQ9_0b1L2M',
        title: 'The Flatwoods Monster Incident: West Virginia Cryptid',
        thumbnail: '/entities/pin-flatwoods.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-cerberus',
    title_th: 'เซอร์เบอรัส สุนัขสามหัวเฝ้าประตูนรกฮาเดส',
    title_en: 'Cerberus, Hound of the Underworld',
    category: 'monster',
    province_th: 'เอพิรุส (กรีซ)',
    province_en: 'Epirus (Greece)',
    district_th: 'แม่น้ำแอเคอรอนและเนโครแมนเตียน',
    district_en: 'Acheron River / Necromanteion',
    lat: 39.24,
    lng: 20.61,
    story_th: 'อสูรหมาล่าเนื้อสามหัวบุตรแห่งไทฟอนและอีคิดนา มีหางเป็นงูพิษ เฝ้าประตูทางเข้าสู่ปรโลกริมฝั่งแม่น้ำสติกซ์และแอเคอรอน คอยต้อนรับวิญญาณคนตายแต่จะขย้ำกลืนกินผู้มีชีวิตทุกคนที่บังอาจล่วงล้ำ หรือวิญญาณที่พยายามหลบหนีออกจากนรกภูมิ',
    story_en: 'The multi-headed monstrous hound of Greek mythology guarding the gates of Hades along the Acheron River to prevent souls from escaping the underworld. Bearing a serpent tail and mane of vipers, only subdued by Orpheus’s divine lyre music and Heracles in his twelfth labor.',
    folklore_history_th: 'วิหารเนโครแมนเตียนแห่งแม่น้ำแอเคอรอนเป็นสถานที่จริงในประวัติศาสตร์ที่ชาวกรีกโบราณเดินทางมาทำพิธีติดต่อกับดวงวิญญาณคนตาย เซอร์เบอรัสเป็นสัญลักษณ์ของความตายที่ไม่อาจย้อนคืน',
    folklore_history_en: 'Anchored at the archaeological site of the Necromanteion of Acheron, where ancient pilgrims consulted ghosts of the dead. Cerberus symbolizes the irreversible boundary between mortality and the underworld.',
    image_url: '/entities/pin-cerberus.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-cerberus.jpg',
        title: 'ประติมากรรมเฮอร์คิวลีสและเซอร์เบอรัสสุนัขสามหัว'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=uo23Xh1y9Z4',
        title: 'Mythology Explained: The Legend of Cerberus',
        thumbnail: '/entities/pin-cerberus.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-baalbek',
    title_th: 'มหาศิลาบาอัลเบค แท่นหินยักษ์พันตัน',
    title_en: 'Megaliths of Baalbek (The Trilithon)',
    category: 'legend',
    province_th: 'เบกา (เลบานอน)',
    province_en: 'Beqaa (Lebanon)',
    district_th: 'หุบเขาเบกา / วิหารจูปิเตอร์',
    district_en: 'Beqaa Valley / Temple of Jupiter',
    lat: 34.0,
    lng: 36.2,
    story_th: 'กลุ่มแท่นหินตัดสี่เหลี่ยมขนาดยักษ์หนักก้อนละกว่า 800 ถึง 1,000 ตัน (Trilithon) และก้อนหินสตรีมีครรภ์ (Stone of the Pregnant Woman) ที่ถูกตัดแต่งในเหมืองหินและยกขึ้นติดตั้งบนฐานวิหารจูปิเตอร์ด้วยความแม่นยำเหลือเชื่อ เกินขีดความสามารถของเครนและเทคโนโลยีในยุคโบราณ',
    story_en: 'A colossal megalithic foundation beneath the Roman Temple of Jupiter containing three colossal stone blocks known as the Trilithon, weighing approximately 800 to 1,000 tons each, alongside the massive 1,650-ton Stone of the Pregnant Woman still resting in the ancient quarry.',
    folklore_history_th: 'ตำนานท้องถิ่นอาหรับโบราณเล่าขานว่าสถานที่นี้สร้างขึ้นโดยเหล่ายักษ์ก่อนน้ำท่วมโลก หรือสร้างด้วยอำนาจมนตราของกษัตริย์โซโลมอนเพื่อเป็นที่ประทับของพระนางบลกีสแห่งชีบา',
    folklore_history_en: 'Local Arab folklore attributes the megaliths to ancient giants constructed before the Great Deluge, or built through the supernatural Djinn command of King Solomon. Modern engineers marvel at the logistics required to quarry and transport blocks of such magnitude.',
    image_url: '/entities/pin-baalbek.jpg',
    sound_preset: 'temple_bell',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-baalbek.jpg',
        title: 'แท่นหินไตรลิธอนขนาดยักษ์แห่งวิหารบาอัลเบค'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=F_fP_iM8_qg',
        title: 'Baalbek Megaliths: Lost Engineering of Ancient Giants',
        thumbnail: '/entities/pin-baalbek.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-chillingham',
    title_th: 'ปราสาทชิลลิงแฮม ปราสาทผีสิงที่สุดในเกาะอังกฤษ',
    title_en: 'Chillingham Castle, Britain’s Most Haunted',
    category: 'ghost',
    province_th: 'นอร์ทัมเบอร์แลนด์ (อังกฤษ, สหราชอาณาจักร)',
    province_en: 'Northumberland (England, UK)',
    district_th: 'ชิลลิงแฮม',
    district_en: 'Chillingham',
    lat: 55.53,
    lng: -1.9,
    story_th: 'ปราสาทหินยุคศตวรรษที่ 12 ใกล้ชายแดนสกอตแลนด์ สมรภูมิสงครามและการทรมานนักโทษอันโหดเหี้ยม ขึ้นชื่อเรื่องความเฮี้ยนของวิญญาณเด็กชายเรืองแสงสีน้ำเงิน (The Radiant Blue Boy) ในห้องสีชมพู และเสียงผ้าไหมเสียดสีของวิญญาณเลดีแมรี เบิร์กลีย์ ผู้ตรอมใจตายหลังถูกสามีทอดทิ้ง',
    story_en: 'A medieval 12th-century fortress on the Anglo-Scottish border infamous as England’s most haunted stronghold. Known for the Radiant Blue Boy who cried out at midnight in the Pink Room, the rustle of Lady Mary Berkeley’s silk dress, and apparitions in the grim torture chamber.',
    folklore_history_th: 'ในระหว่างการบูรณะห้องสีชมพู ได้มีการขุดพบโครงกระดูกของเด็กชายและชายผู้ใหญ่ถูกฝังโบกปูนอยู่ในกำแพงหนา หลังจากนำกระดูกไปทำพิธีฝังอย่างถูกต้อง ปรากฏการณ์เด็กชายสีน้ำเงินจึงสงบลง',
    folklore_history_en: 'Renovations in the 1920s uncovered the skeleton of a young boy buried inside a 10-foot-thick stone wall alongside blue cloth fragments, corroborating centuries of sightings by royal visitors and psychic investigators.',
    image_url: '/entities/pin-chillingham.jpg',
    sound_preset: 'whisper',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-chillingham.jpg',
        title: 'ปราสาทหินโบราณชิลลิงแฮมท่ามกลางป่าทึบ'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=iy0X49C14FM',
        title: 'Chillingham Castle: Inside the Most Haunted Fortress in Britain',
        thumbnail: '/entities/pin-chillingham.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-earhart',
    title_th: 'ปริศนาเที่ยวบินสุดท้ายของอมีเลีย เอียร์ฮาร์ต',
    title_en: "Amelia Earhart's Final Flight",
    category: 'legend',
    province_th: 'หมู่เกาะฟีนิกซ์ (คิริบาส)',
    province_en: 'Phoenix Islands (Kiribati)',
    district_th: 'เกาะการ์ดเนอร์ / นิคุมาโรโร',
    district_en: 'Nikumaroro Island',
    lat: -4.68,
    lng: -174.52,
    story_th: 'การหายสาบสูญครั้งประวัติศาสตร์ของนักบินสตรีผู้บุกเบิก อมีเลีย เอียร์ฮาร์ต และนักบินผู้ช่วย เฟรด นูแนน พร้อมเครื่องบิน Lockheed Model 10-E Electra ระหว่างบินข้ามมหาสมุทรแปซิฟิกในวันที่ 2 กรกฎาคม 1937 สัญญาณวิทยุสุดท้ายขาดหายไปกลางท้องทะเล ก่อกำเนิดการค้นหาที่ยิ่งใหญ่ที่สุดในประวัติศาสตร์กองทัพเรือสหรัฐฯ',
    story_en: 'The legendary vanishing of pioneer aviator Amelia Earhart and navigator Fred Noonan over the central Pacific on July 2, 1937, during their circumnavigation flight. Radio calls to the Coast Guard cutter Itasca faded into static, sparking history’s greatest maritime search.',
    folklore_history_th: 'การสำรวจของ TIGHAR บนเกาะปะการังนิคุมาโรโร พบชิ้นส่วนอะลูมิเนียมของเครื่องบิน โครงกระดูกมนุษย์ เครื่องสำอาง และเศษกระจกกระเป๋า บ่งชี้ว่าเธออาจรอดชีวิตและกลายเป็นผู้รอดชีวิตบนเกาะร้างก่อนสิ้นใจ',
    folklore_history_en: 'Artifacts recovered on the uninhabited atoll of Nikumaroro by TIGHAR, including vintage American cosmetics and aircraft aluminum sheets, support the theory that Earhart lived as a castaway on the desolate coral reef.',
    image_url: '/entities/pin-earhart.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-earhart.jpg',
        title: 'อมีเลีย เอียร์ฮาร์ต เคียงข้างเครื่องบินล็อกฮีดอิเล็กตรา'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=FjD9b5sL80I',
        title: 'What Happened to Amelia Earhart? Unsolved Mystery',
        thumbnail: '/entities/pin-earhart.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-sailingstones',
    title_th: 'หินแล่นปริศนาแห่งเดธวัลเลย์',
    title_en: 'The Sailing Stones of Racetrack Playa',
    category: 'legend',
    province_th: 'แคลิฟอร์เนีย (สหรัฐอเมริกา)',
    province_en: 'California (USA)',
    district_th: 'หุบเขามรณะเดธวัลเลย์',
    district_en: 'Death Valley National Park',
    lat: 36.68,
    lng: -117.56,
    story_th: 'ปรากฏการณ์หินโดโลไมต์และหินซีไนต์น้ำหนักหลายร้อยกิโลกรัม ที่เคลื่อนที่ข้ามลานดินแห้งแล้งเรซแทร็กพลายาด้วยตนเอง ทิ้งรอยร่องทางยาวคดเคี้ยวหลายร้อยเมตรไว้เบื้องหลัง โดยปราศจากรอยเท้าของมนุษย์หรือสัตว์ใดๆ สร้างความฉงนแก่นักธรณีวิทยานานหลายทศวรรษ',
    story_en: 'A geological mystery where heavy dolomite boulders glide across the bone-dry mud of Racetrack Playa in Death Valley, leaving elongated linear furrows behind them without any human or animal intervention.',
    folklore_history_th: 'ชนพื้นเมืองทิมบิชา โชโชนี เชื่อว่าเป็นพลังงานของวิญญาณแห่งทะเลสาบ จนกระทั่งในปี 2014 นักวิทยาศาสตร์ติดตั้งเซนเซอร์ GPS และกล้องไทม์แลปส์ พบว่าเกิดจากการรวมตัวของแผ่นน้ำแข็งบางเฉียบ (Ice pane) ในคืนฤดูหนาวที่ลมพัดแผ่นน้ำแข็งพาหินไถลไปบนโคลนลื่น',
    folklore_history_en: 'Explained in 2014 by researchers using GPS units and time-lapse photography: rare winter rain forms shallow ponds that freeze into thin sheets of windowpane ice, which melt and catch steady winds, pushing the boulders across muddy slick clay.',
    image_url: '/entities/pin-sailingstones.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-sailingstones.jpg',
        title: 'ก้อนหินแล่นทิ้งรอยทางยาวบนดินแห้งแตกระแหง'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=uo23Xh1y9Z4',
        title: 'How Death Valley’s Sailing Stones Move Across the Desert',
        thumbnail: '/entities/pin-sailingstones.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-kelpie',
    title_th: 'เคลพี ม้าพรายน้ำจำแลงแห่งสกอตแลนด์',
    title_en: 'The Kelpie of Scottish Lochs',
    category: 'monster',
    province_th: 'ฟอลเคิร์ก (สกอตแลนด์, สหราชอาณาจักร)',
    province_en: 'Falkirk (Scotland, UK)',
    district_th: 'ทะเลสาบและลำน้ำสกอตติชไฮแลนด์',
    district_en: 'Scottish Lochs & Waterways',
    lat: 56.02,
    lng: -3.76,
    story_th: 'จิตวิญญาณแห่งสายน้ำแปลงกายในคติชนเซลติก มักปรากฏในร่างม้าสีดำหรือสีขาวสง่างามยืนอยู่ริมทะเลสาบ หากผู้ใดหลงกลขึ้นขี่ ผิวหนังของม้าจะเหนียวหนึบตรึงเหยื่อไว้ไม่ให้กระโดดลง ก่อนที่เคลพีจะพุ่งทะยานดิ่งลงสู่ก้นน้ำลึกเพื่อกลืนกินเหยื่อ',
    story_en: 'A shape-shifting aquatic spirit inhabiting the lochs and rivers of Scotland, usually appearing as a majestic black horse standing docilely by the water. Its skin possesses magical adhesive properties; once mounted, it plunges deep underwater to drown and devour its rider.',
    folklore_history_th: 'นิทานพื้นบ้านเล่าถึงวิธีสยบเคลพีโดยการแย่งชิงบังเหียนวิเศษ ซึ่งจะทำให้มันต้องยอมรับใช้มนุษย์ ปัจจุบันมีการสร้างประติมากรรมเหล็กกล้าหัวม้ายักษ์สูง 30 เมตร The Kelpies ในเมืองฟอลเคิร์กเพื่อเป็นอนุสรณ์แห่งตำนาน',
    folklore_history_en: 'Celtic folklore maintains that capturing a Kelpie’s enchanted bridle grants absolute mastery over its supernatural strength. Celebrated today by "The Kelpies"—colossal 30-meter-high horse head steel sculptures standing at Falkirk.',
    image_url: '/entities/pin-kelpie.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-kelpie.jpg',
        title: 'ประติมากรรมหัวม้ายักษ์เดอะเคลพีส์เมืองฟอลเคิร์ก'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=Fj-yK23aD6A',
        title: 'The Dark Celtic Myth of the Kelpie Water Horse',
        thumbnail: '/entities/pin-kelpie.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-stanleyhotel',
    title_th: 'โรงแรมสแตนลีย์ ต้นกำเนิดเรื่องเล่า The Shining',
    title_en: 'The Stanley Hotel, Inspiration for The Shining',
    category: 'ghost',
    province_th: 'โคโลราโด (สหรัฐอเมริกา)',
    province_en: 'Colorado (USA)',
    district_th: 'เอสเตสพาร์ก / เทือกเขาร็อกกี',
    district_en: 'Estes Park / Rocky Mountains',
    lat: 40.38,
    lng: -105.52,
    story_th: 'โรงแรมสไตล์นีโอคลาสสิกอันหรูหราสร้างขึ้นในปี 1909 ท่ามกลางหุบเขาหิมะเทือกเขาร็อกกี สถานที่ที่ สตีเฟน คิง เข้าพักในห้อง 217 แล้วฝันร้ายจนเป็นแรงบันดาลใจให้นวนิยายสยองขวัญ The Shining มีรายงานวิญญาณของ เอฟ.โอ. สแตนลีย์ และภรรยา เล่นเปียโนในห้องบอลรูมยามดึกสงัด และเสียงเด็กวิ่งเล่นในโถงทางเดิน',
    story_en: 'A historic 1909 Georgian neoclassical resort nestled in the Rocky Mountains. Stephen King stayed in Room 217 as the hotel was closing for winter, inspiring his horror masterpiece "The Shining". Known for phantom piano notes drifting from the music room and spectral laughter along empty hallways.',
    folklore_history_th: 'กลายเป็นศูนย์กลางการสืบสวนคดีวิญญาณที่มีชื่อเสียงระดับโลก และมีการจัดทัวร์ล่าผีตลอดทั้งปี ภาพถ่ายที่มีชื่อเสียงหลายภาพจับภาพเงาร่างโปร่งแสงของผู้หญิงบนบันไดหลักของโรงแรม',
    folklore_history_en: 'Paranormal researchers frequently record electronic voice phenomena (EVP) and cold spots throughout the Concert Hall and Fourth Floor, immortalized in pop culture as America’s premier haunted mountain retreat.',
    image_url: '/entities/pin-stanleyhotel.jpg',
    sound_preset: 'whisper',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-stanleyhotel.jpg',
        title: 'ทัศนียภาพโรงแรมสแตนลีย์ท่ามกลางเทือกเขาร็อกกี'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=iy0X49C14FM',
        title: 'Inside the Haunted Stanley Hotel: Real Life Overlook',
        thumbnail: '/entities/pin-stanleyhotel.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-darvaza',
    title_th: 'ประตูสู่นรก หลุมก๊าซเพลิงลุกไหม้นิรันดร์ดาร์วาซา',
    title_en: 'The Door to Hell (Darvaza Gas Crater)',
    category: 'curse',
    province_th: 'อาฮาล (เติร์กเมนิสถาน)',
    province_en: 'Ahal (Turkmenistan)',
    district_th: 'ทะเลทรายคาราคุม',
    district_en: 'Karakum Desert',
    lat: 40.25,
    lng: 58.44,
    story_th: 'หลุมยุบก๊าซธรรมชาติขนาดยักษ์กว้างกว่า 70 เมตร ลึก 30 เมตร ใจกลางทะเลทรายคาราคุม ที่เปลวเพลิงนรกปะทุลุกโชนสว่างไสวไม่เคยดับมอดมานานกว่าครึ่งศตวรรษ เปลวเพลิงสีส้มและควันร้อนระอุพวยพุ่งขึ้นสู่ท้องฟ้ายามค่ำคืนจนแลดูเหมือนปากทางเข้าสู่แดนนรกภูมิ',
    story_en: 'A terrifying fiery natural gas crater spanning 70 meters wide and 30 meters deep in the heart of the Karakum Desert. Ignited by Soviet geologists in 1971 to burn off dangerous gas emissions, the subterranean cauldron has raged continuously day and night for over 50 years.',
    folklore_history_th: 'ชาวบ้านท้องถิ่นขนานนามว่า "ประตูสู่นรก" (Derweze) ในปี 2013 นักสำรวจ จอร์จ กูรูนิส สวมชุดป้องกันความร้อนไต่ลงไปที่ก้นหลุมเป็นคนแรกของโลก และค้นพบแบคทีเรียสายพันธุ์พิเศษที่รอดชีวิตในสภาพแวดล้อมคล้ายดาวดวงอื่น',
    folklore_history_en: 'Locally known as the "Gates of Hell". In 2013, explorer George Kourounis became the first human to descend into the inferno in a heat-reflective suit, discovering extremophile bacteria thriving in the superheated, methane-rich bottom.',
    image_url: '/entities/pin-darvaza.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-darvaza.jpg',
        title: 'เปลวเพลิงลุกไหม้สว่างไสวในหลุมก๊าซดาร์วาซายามค่ำคืน'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=F_fP_iM8_qg',
        title: 'Journey to the Door to Hell in Turkmenistan',
        thumbnail: '/entities/pin-darvaza.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-gunungpadang',
    title_th: 'ปิรามิดกูนุงปาดัง เมกะลิธหมื่นปีแห่งชวา',
    title_en: 'Gunung Padang Megalithic Site',
    category: 'sacred',
    province_th: 'ชวาตะวันตก (อินโดนีเซีย)',
    province_en: 'West Java (Indonesia)',
    district_th: 'จิอันจูร์',
    district_en: 'Cianjur',
    lat: -6.99,
    lng: 107.05,
    story_th: 'อนุสรณ์สถานหินบะซอลต์ทรงแท่งห้าเหลี่ยมขนาดมหึมาบนยอดเขาในเกาะชวา จัดวางเป็นชั้นบันไดหิน 5 ระดับ การสแกนด้วยคลื่นเรดาร์เจาะลึกใต้ดิน (GPR) เผยให้เห็นโครงสร้างปิรามิดและห้องลับใต้ผิวดินที่มีอายุคาร์บอนเก่าแก่กว่า 16,000 ถึง 27,000 ปี ก่อนยุคน้ำแข็งละลาย',
    story_en: 'A colossal megalithic complex of polygonal basalt column terraces crowning an extinct volcanic hill in West Java. Ground-penetrating radar scans suggest the hill conceals a massive subterranean stepped pyramid with chambers carbon-dated between 16,000 and 27,000 BCE.',
    folklore_history_th: 'ชาวซุนดาถือเป็นเนินเขาศักดิ์สิทธิ์ที่กษัตริย์ศรีลีวังกีแห่งอาณาจักรปาจาจารันโบราณสร้างขึ้นในคืนเดียว หากการหาอายุคาร์บอนได้รับการพิสูจน์สากล กูนุงปาดังจะกลายเป็นปิรามิดที่เก่าแก่ที่สุดในประวัติศาสตร์มนุษยชาติ',
    folklore_history_en: 'Sacred to Sundanese cosmology as the palace built overnight by King Siliwangi of the Pajajaran Kingdom. Studies published by geologist Danny Hilman Natawidjaja suggest it represents an advanced lost civilization predating Mesopotamian and Egyptian monuments.',
    image_url: '/entities/pin-gunungpadang.jpg',
    sound_preset: 'temple_bell',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-gunungpadang.jpg',
        title: 'เสาหินบะซอลต์โบราณบนยอดเขากูนุงปาดัง'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=uo23Xh1y9Z4',
        title: 'Gunung Padang: The Oldest Pyramid on Earth?',
        thumbnail: '/entities/pin-gunungpadang.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-highgate',
    title_th: 'แวมไพร์ไฮเกทแห่งสุสานวิกตอเรียน',
    title_en: 'The Highgate Vampire',
    category: 'monster',
    province_th: 'ลอนดอน (สหราชอาณาจักร)',
    province_en: 'London (UK)',
    district_th: 'สุสานไฮเกท / สแวนเลน',
    district_en: 'Highgate Cemetery',
    lat: 51.57,
    lng: -0.15,
    story_th: 'สุสานสไตล์วิกตอเรียนกอทิกที่ปกคลุมด้วยเถาวัลย์และมอส ในช่วงทศวรรษ 1970 มีรายงานการพบเห็นเงาร่างชายสูงใหญ่ในชุดคลุมสีดำ สวมหมวกทรงสูง มีดวงตาสะกดจิตสีแดงก่ำลอยผ่านสุสานหิน นำไปสู่การเผชิญหน้าระหว่างสองนักล่าแวมไพร์และฝูงชนถือไม้กางเขนบุกสุสานในคืนวันศุกร์ที่ 13',
    story_en: 'A phantom entity said to haunt the overgrown Victorian tombs of Highgate Cemetery in North London. Sighted in the early 1970s as a tall shadowy figure with piercing hypnotic eyes, triggering a mass media frenzy and a midnight vigil by rival vampire hunters armed with wooden stakes and garlic.',
    folklore_history_th: 'คดีนี้กลายเป็นจุดสูงสุดของคติชนวิทยาแวมไพร์ในลอนดอนยุคใหม่ รายงานสัตว์เลี้ยงถูกดูดเลือดและรอยกัดที่คอทำให้เกิดการถกเถียงอย่างเผ็ดร้อนระหว่างนักไสยศาสตร์ ฌอน แมนเชสเตอร์ และ เดวิด ฟาร์แรนต์',
    folklore_history_en: 'Culminated in the infamous "vampire hunt" of March 1970 where hundreds of youths stormed the Gothic necropolis. The feud between occultists David Farrant and Seán Manchester became a cornerstone of modern British supernatural folklore.',
    image_url: '/entities/pin-highgate.jpg',
    sound_preset: 'whisper',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-highgate.jpg',
        title: 'สุสานหินกอทิกโบราณในสุสานไฮเกทกรุงลอนดอน'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=kYv9GZ-lX3Y',
        title: 'The Highgate Vampire Panic of 1970 London',
        thumbnail: '/entities/pin-highgate.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-richat',
    title_th: 'ดวงตาแห่งซาฮารา โครงสร้างริชาต',
    title_en: 'The Eye of the Sahara (Richat Structure)',
    category: 'legend',
    province_th: 'อาดราร์ (มอริเตเนีย)',
    province_en: 'Adrar (Mauritania)',
    district_th: 'ทะเลทรายซาฮารา',
    district_en: 'Ouadane / Sahara Desert',
    lat: 21.13,
    lng: -11.4,
    story_th: 'โครงสร้างทางธรณีวิทยารูปวงแหวนซ้อนกันขนาดยักษ์ มีเส้นผ่านศูนย์กลางกว่า 40 กิโลเมตร มองเห็นได้ชัดเจนจากอวกาศ แลดูคล้ายดวงตาสีน้ำเงินขนาดยักษ์จ้องมองขึ้นสู่ฟากฟ้า วงแหวนของหินตะกอนและหินอัคนีสอดคล้องกับคำพรรณนาเรื่องวงแหวนของแอตแลนติสในบันทึกของเพลโต',
    story_en: 'A prominent circular geologic feature in the Sahara Desert stretching 40 kilometers across, resembling a giant bullseye when viewed from orbit. Its concentric rings of sedimentary and igneous rock closely match Plato’s dimensions and layout for the sunken capital of Atlantis.',
    folklore_history_th: 'นักบินอวกาศยานเจมินีใช้โครงสร้างนี้เป็นจุดสังเกตการณ์นำร่องลงสู่โลก ทฤษฎีสมัยใหม่คาดว่าเกิดจากการดันตัวของหินหนืดภูเขาไฟใต้พิภพที่ถูกการกัดเซาะนับร้อยล้านปี ท่ามกลางตำนานโบราณเรื่องเมืองแห่งทองคำที่จมหาย',
    folklore_history_en: 'Used as an orientation landmark by Gemini and Apollo astronauts. While geologists attribute its formation to an eroded dome of magma, alternate historical theories associate the site with the physical location of Plato’s lost civilization.',
    image_url: '/entities/pin-richat.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-richat.jpg',
        title: 'ภาพถ่ายจากสถานีอวกาศนานาชาติแสดงดวงตาแห่งซาฮารา'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=F_fP_iM8_qg',
        title: 'The Eye of the Sahara: Is It the Real Atlantis?',
        thumbnail: '/entities/pin-richat.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-tunguska',
    title_th: 'ปริศนาระเบิดอวกาศตุงกุสกา',
    title_en: 'The Tunguska Cosmic Impact Event',
    category: 'legend',
    province_th: 'ครัสโนยาสค์ (รัสเซีย)',
    province_en: 'Krasnoyarsk (Russia)',
    district_th: 'ลุ่มแม่น้ำพอดคาเมนนายา ตุงกุสกา',
    district_en: 'Podkamennaya Tunguska River',
    lat: 60.92,
    lng: 101.95,
    story_th: 'การระเบิดครั้งรุนแรงที่สุดในประวัติศาสตร์มนุษยชาติเมื่อเช้าวันที่ 30 มิถุนายน 1908 แรงระเบิดเทียบเท่าทีเอ็นที 10-15 เมกะตัน (รุนแรงกว่าฮิโรชิมะ 1,000 เท่า) โค่นต้นสนไทกากว่า 80 ล้านต้นราบเป็นหน้ากลองในพื้นที่ 2,150 ตารางกิโลเมตร แต่กลับไม่พบหลุมอุกกาบาตหรือเศษดาวตกใดๆ',
    story_en: 'A colossal explosion that flattened an estimated 80 million trees across 2,150 square kilometers of Siberian taiga on June 30, 1908. Producing a blast wave 1,000 times more powerful than the atomic bomb dropped on Hiroshima, yet leaving no impact crater or confirmed meteoritic fragments.',
    folklore_history_th: 'ชนเผ่าพื้นเมืองอีเวนค์เชื่อว่าเป็นเทวทัณฑ์จากเทพแห่งพายุและไฟ อ็อกดี (Agdy) คณะสำรวจของ ลีโอนิด คูลิก ในปี 1927 พบต้นไม้ถูกโค่นแผ่ออกเป็นรูปผีเสื้อขนาดยักษ์ นำไปสู่ทฤษฎีการระเบิดกลางอากาศของดาวหางน้ำแข็ง หรือการปะทะของปฏิสสารและหลุมดำขนาดจิ๋ว',
    folklore_history_en: 'Evenki shamans attributed the cataclysm to the thunder god Agdy. In 1927, Leonid Kulik’s Soviet expedition discovered trees scorched and felled in a radial butterfly pattern, confirming an air burst of an incoming cometary fragment or stony asteroid.',
    image_url: '/entities/pin-tunguska.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-tunguska.jpg',
        title: 'ซากป่าสนไทกาถูกโค่นราบเรียบหลังเหตุการณ์ตุงกุสกา 1908'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=uo23Xh1y9Z4',
        title: 'The Tunguska Event: The Mystery of the 1908 Blast',
        thumbnail: '/entities/pin-tunguska.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-sedonavortex',
    title_th: 'ขุมพลังงานสนามแม่เหล็กโลกเซโดนา',
    title_en: 'The Sedona Red Rock Energy Vortexes',
    category: 'sacred',
    province_th: 'แอริโซนา (สหรัฐอเมริกา)',
    province_en: 'Arizona (USA)',
    district_th: 'เซโดนา / แคธีดรัลร็อก',
    district_en: 'Cathedral Rock / Bell Rock',
    lat: 34.87,
    lng: -111.76,
    story_th: 'หุบผาหินทรายสีแดงสดท่ามกลางทะเลทรายแอริโซนา สถานที่ที่มีจุดรวมสนามพลังงานแม่เหล็กไฟฟ้าโลก (Vortex) หมุนวนขึ้นสู่ฟากฟ้า ต้นสนจูนิเปอร์ในบริเวณนี้จะเติบโตแบบบิดเกลียวตามแรงหมุนวนของสนามพลังงาน ผู้มาเยือนรายงานความรู้สึกสงบนิ่ง เกิดนิมิตสมาธิลึกซึ้ง และการฟื้นฟูจิตวิญญาณ',
    story_en: 'A world-famous spiritual sanctuary nestled among towering red sandstone buttes in Arizona. Renowned for swirling centers of subtle psychic and electromagnetic energy (vortexes) that twist the branches of local juniper trees into spirals and stimulate meditation, clarity, and psychic perception.',
    folklore_history_th: 'ชนเผ่าพื้นเมืองยาวัพไพและอาปาเช่ยึดถือเป็นดินแดนศักดิ์สิทธิ์และสถานที่กำเนิดของมนุษยชาติ (Birthplace of First Woman) ห้ามการตั้งถิ่นฐานถาวรเพื่อสงวนไว้สำหรับพิธีกรรมทางจิตวิญญาณเท่านั้น',
    folklore_history_en: 'Revered by Yavapai-Apache peoples as sacred birthplace grounds of humanity. In modern times, Page Bryant identified key electromagnetic vortex sites at Bell Rock, Cathedral Rock, Boynton Canyon, and Airport Mesa.',
    image_url: '/entities/pin-sedonavortex.jpg',
    sound_preset: 'temple_bell',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-sedonavortex.jpg',
        title: 'แคธีดรัลร็อกและหินทรายสีแดงศูนย์กลางพลังงานเซโดนา'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=FjD9b5sL80I',
        title: 'Sedona Vortexes: Ancient Spiritual Energy in Arizona',
        thumbnail: '/entities/pin-sedonavortex.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-dongphayayen',
    title_th: 'ดงพญาเย็น ป่าดงดิบอาถรรพ์และไข้ป่าสยาม',
    title_en: 'Dong Phaya Yen, The Primeval Wilderness',
    category: 'curse',
    province_th: 'นครราชสีมา (ไทย)',
    province_en: 'Nakhon Ratchasima (Thailand)',
    district_th: 'เทือกเขาดงพญาเย็นและอุทยานแห่งชาติเขาใหญ่',
    district_en: 'Dong Phaya Yen Mountains & Khao Yai',
    lat: 14.35,
    lng: 101.45,
    story_th: 'ผืนป่าดงดิบดึกดำบรรพ์ที่ในอดีตเคยถูกขนานนามว่า "ดงพญาไฟ" ปราการธรรมชาติอันน่าสะพรึงกลัวที่ขวางกั้นระหว่างภาคกลางกับที่ราบสูงโคราช เต็มไปด้วยไข้ป่ามาลาเรีย สัตว์ร้าย และอาถรรพ์ลี้ลับ ขบวนเกวียนและผู้เดินทางข้ามป่าล้มตายเป็นจำนวนมาก จนกระทั่งรัชกาลที่ 5 โปรดเกล้าฯ ให้เปลี่ยนนามเป็น "ดงพญาเย็น" เพื่อแก้เคล็ด',
    story_en: 'A vast primordial rainforest complex historically feared across Siam as "Dong Phaya Fai" (Forest of the Fire Lord). Infamous for lethal blackwater malaria, predators, and supernatural perils where countless travelers perished, until King Chulalongkorn (Rama V) renamed it "Dong Phaya Yen" (Forest of Cool Grace) to lift the deadly curse.',
    folklore_history_th: 'การสร้างทางรถไฟสายแรกสู่โคราชผ่านป่าแห่งนี้คร่าชีวิตคนงานนับร้อยราย ปัจจุบันได้รับการขึ้นทะเบียนเป็นมรดกโลกทางธรรมชาติโดยยูเนสโก และยังคงมีตำนานเรื่องเสือสมิง เจ้าป่า และต้นไม้ศักดิ์สิทธิ์เล่าขานสืบมา',
    folklore_history_en: 'Construction of the historic Siam-Khorat railway through the wilderness cost hundreds of lives to jungle fevers. Designated a UNESCO World Heritage site, local folklore remains rich with tales of weretigers, jungle spirits, and guardian trees.',
    image_url: '/entities/pin-dongphayayen.jpg',
    sound_preset: 'jungle_curse',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-dongphayayen.jpg',
        title: 'ผืนป่าดงดิบดึกดำบรรพ์ดงพญาเย็น-เขาใหญ่'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=F_fP_iM8_qg',
        title: 'เปิดตำนานดงพญาไฟ สู่ดงพญาเย็น ป่าอาถรรพ์แห่งสยาม',
        thumbnail: '/entities/pin-dongphayayen.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-phisueasamut',
    title_th: 'ผีเสื้อสมุทร นางยักษ์แห่งเกาะแก้วพิสดาร',
    title_en: 'Phi Suea Samut, The Sea Ogress of Samet',
    category: 'monster',
    province_th: 'ระยอง (ไทย)',
    province_en: 'Rayong (Thailand)',
    district_th: 'เกาะเสม็ด / อ่าวไทย',
    district_en: 'Ko Samet / Gulf of Thailand',
    lat: 12.56,
    lng: 101.45,
    story_th: 'นางอสูรผีเสื้อสมุทรในมหากาพย์พระอภัยมณีของสุนทรภู่ อาศัยอยู่ในถ้ำแก้วใต้มหาสมุทร มีอำนาจแปลงกายเป็นหญิงงาม แต่เมื่อโกรธเกรี้ยวจะคืนร่างยักษ์ขนาดยักษ์สูงเทียมเขา มีเขี้ยวงอก ฟันแหลมคม กวัดแกว่งคลื่นลมพายุและไล่ล่าตามจับพระอภัยมณีและสินสมุทร ก่อนจะสิ้นใจด้วยเสียงปี่สะกดวิญญาณริมหาดทรายแก้ว',
    story_en: 'The formidable sea ogress of Sunthorn Phu’s epic masterpiece "Phra Aphai Mani". Dwelling in an underwater crystal cavern, she possessed shapeshifting glamour to appear as a radiant maiden, but reverted to a titanic fanged colossus whose thunderous stomps whipped ocean squalls, slain ultimately by the enchanted melody of Aphai’s magic flute.',
    folklore_history_th: 'สุนทรภู่ประพันธ์วรรณคดีชิ้นเอกนี้ขณะจำพรรษาอยู่ที่เกาะเสม็ด รูปปั้นนางยักษ์ผีเสื้อสมุทรยืนตระหง่านกลางทะเลบริเวณท่าเรือเกาะเสม็ดเป็นหนึ่งในสัญลักษณ์ทางวัฒนธรรมที่โดดเด่นที่สุดของภาคตะวันออกของไทย',
    folklore_history_en: 'Sunthorn Phu composed his magnum opus inspired by the geography of Rayong and Ko Samet. The iconic stone statue of Phi Suea Samut emerging from the sea at Ko Samet’s main pier stands as an enduring emblem of Thai literary mythology.',
    image_url: '/entities/pin-phisueasamut.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-phisueasamut.jpg',
        title: 'อนุสาวรีย์สุนทรภู่และรูปปั้นนางยักษ์ผีเสื้อสมุทร'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=XW9_0Lp9b_0',
        title: 'ตำนานผีเสื้อสมุทร นางยักษ์แห่งเกาะเสม็ด',
        thumbnail: '/entities/pin-phisueasamut.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-erawanshrine',
    title_th: 'ท้าวมหาพรหมเอราวัณ เทพผู้ประทานพรแห่งสี่แยกราชประสงค์',
    title_en: 'The Erawan Shrine (Thao Maha Brahma)',
    category: 'sacred',
    province_th: 'กรุงเทพมหานคร (ไทย)',
    province_en: 'Bangkok (Thailand)',
    district_th: 'สี่แยกราชประสงค์ / ปทุมวัน',
    district_en: 'Ratchaprasong / Pathum Wan',
    lat: 13.74,
    lng: 100.54,
    story_th: 'ศาลเทพเจ้าศักดิ์สิทธิ์ใจกลางย่านพาณิชย์ของกรุงเทพฯ ประดิษฐานเทวรูปท้าวมหาพรหมสี่พักตร์แปดกร สร้างขึ้นในปี 1956 เพื่อปัดเป่าอาถรรพ์และอุปสรรคในการก่อสร้างโรงแรมเอราวัณ มีชื่อเสียงระดับโลกในความศักดิ์สิทธิ์ มีผู้คนหลั่งไหลมากราบไหว้ขอพรและแก้บนด้วยการรำละครชาตรีและช้างไม้สลักตลอดทั้งวัน',
    story_en: 'The world-renowned Hindu shrine dedicated to Phra Phrom (Brahma) situated at the bustling Ratchaprasong intersection. Erected in 1956 on astrological advice to dispel fatal construction mishaps at the adjacent hotel, drawing millions of global devotees offering traditional classical dance and carved teak elephants.',
    folklore_history_th: 'ตามหลักโหราศาสตร์สยาม สี่แยกราชประสงค์เป็นจุดตัดของทางน้ำโบราณและมีพลังงานรุนแรง การอัญเชิญท้าวมหาพรหมผู้สร้างโลกมาประดิษฐานช่วยเปลี่ยนพลังร้ายให้กลายเป็นความเจริญรุ่งเรืองและกลายเป็นหนึ่งในสิ่งศักดิ์สิทธิ์สำคัญของเอเชีย',
    folklore_history_en: 'According to Thai geomantic and Brahmin lore, the Ratchaprasong crossroads sits at a potent nexus of energetic currents. The shrine established a sacred harmonious balance, revered across East Asia as a sanctuary of miraculous answered prayers.',
    image_url: '/entities/pin-erawanshrine.jpg',
    sound_preset: 'temple_bell',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-erawanshrine.jpg',
        title: 'ศาลท้าวมหาพรหมเอราวัณ สี่แยกราชประสงค์ กรุงเทพฯ'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=FjD9b5sL80I',
        title: 'Erawan Shrine: Bangkok’s Sacred Crossroads of Faith',
        thumbnail: '/entities/pin-erawanshrine.jpg'
      }
    ],
    is_published: 1
  }
];

// 1. Update seedData.ts
const seedPath = path.resolve(__dirname, '../src/data/seedData.ts');
let seedContent = fs.readFileSync(seedPath, 'utf8');

// Check existing pins to prevent duplication
for (const pin of NEW_25_PINS) {
  if (seedContent.includes(`id: '${pin.id}'`) || seedContent.includes(`id: "${pin.id}"`)) {
    console.log(`Pin ${pin.id} already exists in seedData.ts, skipping code insertion.`);
    process.exit(0);
  }
}

const lastIndex = seedContent.lastIndexOf('];');
if (lastIndex === -1) {
  throw new Error('Could not find end of INITIAL_GHOST_PINS array');
}

let newPinsJs = '';
for (const pin of NEW_25_PINS) {
  const pinObjStr = JSON.stringify(pin, null, 4)
    .replace(/"([a-zA-Z0-9_]+)":/g, '$1:')
    .split('\n')
    .map((line, idx) => (idx === 0 ? '  {' : '  ' + line))
    .join('\n');
  newPinsJs += pinObjStr + ',\n';
}

const updatedSeedContent = seedContent.substring(0, lastIndex) + newPinsJs + seedContent.substring(lastIndex);
fs.writeFileSync(seedPath, updatedSeedContent, 'utf8');
console.log('Successfully appended 25 new pins to seedData.ts (Total 100 pins!)');

// 2. Generate SQL file
let sqlContent = '';
for (const pin of NEW_25_PINS) {
  const escapeSql = (str) => (str ? str.replace(/'/g, "''") : '');
  const galleryJson = escapeSql(JSON.stringify(pin.gallery_media || []));
  
  sqlContent += `INSERT OR REPLACE INTO ghost_pins (
    id, title_th, title_en, category, province_th, province_en,
    district_th, district_en, lat, lng, story_th, story_en,
    folklore_history_th, folklore_history_en, image_url, audio_url,
    sound_preset, views_count, is_published, gallery_media
  ) VALUES (
    '${pin.id}',
    '${escapeSql(pin.title_th)}',
    '${escapeSql(pin.title_en)}',
    '${pin.category}',
    '${escapeSql(pin.province_th)}',
    '${escapeSql(pin.province_en)}',
    '${escapeSql(pin.district_th)}',
    '${escapeSql(pin.district_en)}',
    ${pin.lat},
    ${pin.lng},
    '${escapeSql(pin.story_th)}',
    '${escapeSql(pin.story_en)}',
    '${escapeSql(pin.folklore_history_th)}',
    '${escapeSql(pin.folklore_history_en)}',
    '${pin.image_url}',
    NULL,
    '${pin.sound_preset}',
    0,
    1,
    '${galleryJson}'
  );\n`;
}

const sqlPath = path.resolve(__dirname, '../../insert_century_pins.sql');
fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log('Successfully wrote ' + sqlPath + ' with 25 INSERT statements');

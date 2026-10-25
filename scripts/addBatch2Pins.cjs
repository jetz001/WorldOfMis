const fs = require('fs');
const path = require('path');

const NEW_PINS = [
  {
    id: 'pin-atlantis',
    title_th: 'แอตแลนติส มหานครอารยธรรมสาบสูญ',
    title_en: 'The Lost City of Atlantis',
    category: 'legend',
    province_th: 'ซานโตรินี (กรีซ)',
    province_en: 'Santorini (Greece)',
    district_th: 'แอ่งภูเขาไฟซานโตรินี / ทะเลอีเจียน',
    district_en: 'Santorini Caldera / Aegean Sea',
    lat: 36.4,
    lng: 25.4,
    story_th: 'มหาอาณาจักรโบราณอันรุ่งเรืองด้วยเทคโนโลยี ปราสาทหินอ่อนล้อมรอบด้วยคูน้ำวงกลมซ้อนกัน และวิหารทองคำแห่งเทพโพไซดอน แต่เมื่อกษัตริย์และราษฎรตกอยู่ในความโลภและทรนง เทพเจ้าจึงลงทัณฑ์ด้วยแผ่นดินไหวและคลื่นสึนามิขนาดยักษ์ กลืนกินแผ่นดินทั้งทวีปจมหายสู่ก้นสมุทรภายในวันเดียวและคืนเดียว',
    story_en: 'A legendary advanced naval empire described by Plato, composed of concentric rings of water and fertile land crowned by the golden temple of Poseidon. Falling out of favor with the deities due to hubris, the entire empire was swallowed into the depths of the sea in a single cataclysmic day and night.',
    folklore_history_th: 'เพลโต ปราชญ์ชาวกรีกโบราณ บันทึกเรื่องราวไว้ในบทสนทนา Timaeus และ Critias เมื่อราว 360 ปีก่อนคริสตกาล นักประวัติศาสตร์สมัยใหม่เชื่อมโยงกับการระเบิดครั้งประวัติศาสตร์ของภูเขาไฟธีรา (ซานโตรินี) เมื่อ 1,600 ปีก่อนคริสตกาลที่ทำลายล้างอารยธรรมมิโนอัน',
    folklore_history_en: 'First recounted by Greek philosopher Plato in 360 BCE dialogues Timaeus and Critias. Modern geoarchaeologists link the cataclysm with the Bronze Age Thera eruption (circa 1600 BCE), which shattered Santorini and generated devastating tsunamis across the Aegean.',
    image_url: '/entities/pin-atlantis.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-atlantis.jpg',
        title: 'แผนที่ประวัติศาสตร์แอตแลนติสโดย Athanasius Kircher (1665)'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=F_fP_iM8_qg',
        title: 'Atlantis: The Lost Civilization and Santorini Caldera',
        thumbnail: '/entities/pin-atlantis.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-jerseydevil',
    title_th: 'ปีศาจเจอร์ซีย์แห่งไพน์บาร์เรนส์',
    title_en: 'The Jersey Devil of Pine Barrens',
    category: 'monster',
    province_th: 'นิวเจอร์ซีย์ (สหรัฐอเมริกา)',
    province_en: 'New Jersey (USA)',
    district_th: 'ป่าสนไพน์บาร์เรนส์',
    district_en: 'Pine Barrens',
    lat: 39.81,
    lng: -74.45,
    story_th: 'สัตว์ประหลาดสองเท้าคล้ายจิงโจ้ มีหัวเป็นม้าหรือแพะ ตาสีแดงก่ำ มีปีกค้างคาวขนาดใหญ่ ขาเป็นกีบม้า และหางเป็นแส้ อาศัยอยู่ในป่าสนและดงบึงซีดาร์อันรกร้างของรัฐนิวเจอร์ซีย์ ส่งเสียงหวีดร้องแหลมสูงดังก้องในค่ำคืนพายุ และทิ้งรอยกีบเท้าปริศนาไว้บนหลังคาบ้านและรั้วหิมะ',
    story_en: 'A legendary cryptid inhabiting the dense pine forests and cedar swamps of South Jersey. Described as a bipedal kangaroo-like beast with a horse or goat head, leathery bat wings, glowing red eyes, and cloven hooves that screeches blood-curdling cries across the dark barrens.',
    folklore_history_th: 'ตามตำนานเล่าว่าเกิดจากคำสาปของแม่ลีดส์ (Mother Leeds) ในปี 1735 เมื่อคลอดลูกคนที่ 13 นางพลั้งปากสาปแช่งให้เด็กเป็นปีศาจ ทารกจึงกลายร่างแล้วบินขึ้นปล่องไฟหายเข้าไปในป่า ในปี 1909 มีพยานเห็นมันพร้อมกันนับพันคนจนโรงเรียนและโรงงานต้องปิดทำการ',
    folklore_history_en: 'Folklore traces its birth to 1735 as the cursed 13th child of Deborah Leeds, transforming upon birth and flying up the chimney into the swamp. In January 1909, mass sightings swept the Delaware Valley with thousands claiming encounters, temporarily closing schools and mills.',
    image_url: '/entities/pin-jerseydevil.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-jerseydevil.jpg',
        title: 'ภาพสเก็ตช์ปีศาจเจอร์ซีย์จากหนังสือพิมพ์ Philadelphia Post ปี 1909'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=fXQ9_0b1L2M',
        title: 'Cryptids: The Story of the Jersey Devil',
        thumbnail: '/entities/pin-jerseydevil.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-stonehenge',
    title_th: 'สโตนเฮนจ์ อนุสรณ์สถานหินปริศนาแห่งบริเตน',
    title_en: 'Stonehenge, Megalithic Wonder of Britain',
    category: 'sacred',
    province_th: 'วิลต์เชอร์ (อังกฤษ, สหราชอาณาจักร)',
    province_en: 'Wiltshire (England, UK)',
    district_th: 'ที่ราบซอลส์บรี',
    district_en: 'Salisbury Plain',
    lat: 51.18,
    lng: -1.83,
    story_th: 'วงแหวนหินทรายยักษ์และหินบลูสโตนหนักกว่า 25 ตัน ที่ถูกลำเลียงมาจากเวลส์ในระยะทางไกลกว่า 200 กิโลเมตร เมื่อกว่า 5,000 ปีก่อน จัดวางเรียงอย่างแม่นยำสอดรับกับตำแหน่งดวงอาทิตย์ขึ้นในวันครีษมายัน (Summer Solstice) ท่ามกลางตำนานมนตราของพ่อมดเมอร์ลินและแท่นบูชาของเหล่านักบวชดรูอิด',
    story_en: 'A prehistoric megalithic monument consisting of massive sarsen stones and bluestones transported over 140 miles from Wales around 3000–2000 BCE. Perfectly aligned with the rising sun of the summer solstice and setting sun of the winter solstice, cloaked in Arthurian legends of Merlin and Druidic rites.',
    folklore_history_th: 'เจฟฟรีย์แห่งมอนมัท บันทึกในศตวรรษที่ 12 ว่าพ่อมดเมอร์ลินใช้เวทมนตร์ย้ายวงแหวนหิน "The Giant\'s Dance" จากไอร์แลนด์มายังอังกฤษ ในขณะที่นักดาราศาสตร์ยุคใหม่ค้นพบว่าสโตนเฮนจ์คือปฏิทินสุริยคติและเครื่องคำนวณสุริยุปราคาที่ล้ำหน้าที่สุดแห่งยุคหินใหม่',
    folklore_history_en: "Geoffrey of Monmouth's 12th-century 'Historia Regum Britanniae' attributed its construction to the wizard Merlin magically transporting the 'Giants\' Dance' from Ireland. Modern archaeoastronomy confirms its sophisticated function as an astronomical calendar and eclipse calculator.",
    image_url: '/entities/pin-stonehenge.jpg',
    sound_preset: 'temple_bell',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-stonehenge.jpg',
        title: 'วงแหวนหินสโตนเฮนจ์ตระหง่านกลางที่ราบซอลส์บรี'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=iy0X49C14FM',
        title: 'Stonehenge: Ancient Astronomers & The Solstice Mystery',
        thumbnail: '/entities/pin-stonehenge.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-sphinx',
    title_th: 'มหาสฟิงซ์และมหาพีระมิดแห่งกิซา',
    title_en: 'The Great Sphinx & Pyramids of Giza',
    category: 'sacred',
    province_th: 'กิซา (อียิปต์)',
    province_en: 'Giza (Egypt)',
    district_th: 'ที่ราบสูงกิซา',
    district_en: 'Giza Plateau',
    lat: 29.98,
    lng: 31.13,
    story_th: 'ประติมากรรมหินปูนแกะสลักรูปสิงโตหมอบใบหน้ามนุษย์ขนาดยักษ์ ยาว 73 เมตร สูง 20 เมตร เฝ้าพิทักษ์มหาพีระมิดแห่งกิซามานานนับพันปี มีคำจารึกบนแผ่นหินความฝัน (Dream Stele) ของฟาโรห์ทุตโมสที่ 4 เล่าถึงสฟิงซ์ที่ตรัสในนิมิต ท่ามกลางทฤษฎีห้องลับใต้เท้าหน้า "หอเก็บบันทึกประวัติศาสตร์โบราณ" (Hall of Records)',
    story_en: "The monumental limestone statue of a reclining lion with a human head on the Giza Plateau, measuring 73 meters long and 20 meters high. Revered as Hor-em-akhet ('Horus on the Horizon'), its paws hold the enigmatic Dream Stele of Thutmose IV, alongside legends of a subterranean Hall of Records concealed beneath its foundation.",
    folklore_history_th: 'ชาวอาหรับขนานนามว่า "อบู อัล-ฮอล" (Abu al-Hawl - บิดาแห่งความสะพรึงกลัว) ร่องรอยการสึกกร่อนจากน้ำฝนบนตัวสฟิงซ์ทำให้เกิดข้อถกเถียงทางธรณีวิทยาว่าอาจถูกสร้างขึ้นตั้งแต่ยุคก่อนประวัติศาสตร์เมื่อหลายพันปีก่อนราชวงศ์อียิปต์',
    folklore_history_en: "Known to Arab chroniclers as 'Abu al-Hawl' (Father of Dread). Water erosion debate ignited by geologist Robert Schoch suggests the original monument might date back millennia earlier into the wet Neolithic Sahara, predating conventional dynastic Egyptian history.",
    image_url: '/entities/pin-sphinx.jpg',
    sound_preset: 'temple_bell',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-sphinx.jpg',
        title: 'มหาสฟิงซ์แห่งกิซาพร้อมฉากหลังมหาพีระมิด'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=l_a6aY78q2g',
        title: 'Secrets of the Great Sphinx and Ancient Giza Plateau',
        thumbnail: '/entities/pin-sphinx.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-ourangmedan',
    title_th: 'เรือมรณะเอสเอส อูรังเมดัน',
    title_en: 'The Mystery of SS Ourang Medan',
    category: 'curse',
    province_th: 'ช่องแคบมะละกา (อินโดนีเซีย / มาเลเซีย)',
    province_en: 'Straits of Malacca (Indonesia / Malaysia)',
    district_th: 'น่านน้ำช่องแคบมะละกา',
    district_en: 'Straits of Malacca Waters',
    lat: 3.0,
    lng: 101.0,
    story_th: 'เรือสินค้าสัญชาติดัตช์ส่งรหัสมอร์สขอความช่วยเหลือฉุกเฉินในเดือนมิถุนายน 1947 ข้อความกล่าวว่า "เจ้าหน้าที่ทุกคนรวมทั้งกัปตันเสียชีวิตแล้วนอนเกลื่อนบนสะพานเดินเรือ... ฉันกำลังจะตาย" เมื่อเรือ Silver Star เข้าช่วยเหลือ พบร่างลูกเรือทุกคนนอนหงายตาย ตาเบิกโพลง อ้าปากค้าง แขนยื่นไปข้างหน้า และไม่พบร่องรอยบาดแผล ก่อนที่เรือจะเกิดเพลิงไหม้ระเบิดและจมลงสู่ก้นสมุทรอย่างเป็นปริศนา',
    story_en: 'A chilling maritime tragedy in June 1947 when listening posts intercepted an SOS in Morse code from the Dutch merchant vessel: "All officers including captain are dead lying in chartroom and bridge... I die." Boarding parties from the Silver Star found every soul aboard frozen in grimaces of abject horror, staring upward with arms outstretched without a single physical wound, moments before a fire engulfed the cargo hold.',
    folklore_history_th: 'ทฤษฎีทางวิทยาศาสตร์คาดว่าเรืออาจลักลอบขนสารเคมีอันตราย เช่น โพแทสเซียมไซยาไนด์ หรือก๊าซพิษไนโตรกลีเซอรีนที่รั่วไหลจนทำให้ระบบประสาทหยุดทำงานพร้อมกัน หรือปรากฏการณ์ฟองก๊าซพิษใต้สมุทรที่ปะทุขึ้นมา',
    folklore_history_en: 'The mystery entered maritime folklore following CIA declassified documents in 1952. Explanations range from covert shipments of lethal nerve agents or potassium cyanide leaking into ventilation systems, to hazardous methane gas bubbles rising from deep marine trenches.',
    image_url: '/entities/pin-ourangmedan.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-ourangmedan.jpg',
        title: 'ภาพจำลองเรือผีสิงอูรังเมดันลอยลำในหมอกมืด'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=H7B5j5FwZ1A',
        title: 'The Disturbing Mystery of SS Ourang Medan',
        thumbnail: '/entities/pin-ourangmedan.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-islandofdolls',
    title_th: 'เกาะตุ๊กตาผีสิงแห่งโซชิมิลโก',
    title_en: 'Isla de las Muñecas (Island of the Dolls)',
    category: 'ghost',
    province_th: 'เม็กซิโกซิตี (เม็กซิโก)',
    province_en: 'Mexico City (Mexico)',
    district_th: 'คลองโซชิมิลโก',
    district_en: 'Xochimilco Canals',
    lat: 19.27,
    lng: -99.09,
    story_th: 'เกาะลอยน้ำขนาดเล็ก (Chinampa) ท่ามกลางคลองโบราณโซชิมิลโก ที่ซึ่งต้นไม้ทุกต้นและกระท่อมผุพังถูกแขวนประดับด้วยตุ๊กตาเก่าแก่ชำรุดทรุดโทรม ขาดแขนขา ดวงตากลวงโบ๋ นับพันตัว ดอน ฮูเลียน ซันตานา บาร์เรรา ผู้ดูแลเกาะ แขวนตุ๊กตาเหล่านี้เพื่อปลอบประโลมวิญญาณเด็กหญิงที่จมน้ำเสียชีวิตอย่างน่าเวทนา ผู้มาเยือนมักได้ยินเสียงกระซิบและเห็นดวงตาของตุ๊กตากลอกไปมาในยามค่ำคืน',
    story_en: 'A sinister chinampa (floating island) in the Xochimilco canals blanketed by thousands of weathered, severed, and decaying toy dolls hanging from weeping willow branches. Caretaker Don Julián Santana Barrera began collecting discarded dolls in the 1950s to pacify the restless spirit of a young drowned girl, until he was found drowned in the exact same canal in 2001.',
    folklore_history_th: 'ชาวเม็กซิกันเชื่อว่าตุ๊กตาเหล่านี้มีวิญญาณสิงสู่อยู่จริง และคอยปกป้องคุ้มครองเกาะจากสิ่งชั่วร้าย ในปี 2001 ดอน ฮูเลียน เสียชีวิตจากการจมน้ำ ณ จุดเดียวกับที่เด็กหญิงเสียชีวิตเมื่อ 50 ปีก่อน กลายเป็นหนึ่งในตำนานอาถรรพ์ที่โด่งดังที่สุดของลาตินอเมริกา',
    folklore_history_en: 'Deeply entwined with Mexican beliefs regarding the permeable veil between the dead and living. Local canal boatmen (trajinera guides) recount nocturnal stories of doll heads rotating toward passing gondolas and child-like giggles echoing across the murky waters.',
    image_url: '/entities/pin-islandofdolls.jpg',
    sound_preset: 'whisper',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-islandofdolls.jpg',
        title: 'ตุ๊กตาเก่าผุพังห้อยระโยงระยางบนต้นไม้เกาะโซชิมิลโก'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=F_fP_iM8_qg',
        title: 'Island of the Dolls: Mexico Creepiest Haunted Island',
        thumbnail: '/entities/pin-islandofdolls.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-nangtani',
    title_th: 'นางตานี พรายกล้วยตานีแห่งสยาม',
    title_en: 'Nang Tani, the Banana Tree Spirit',
    category: 'ghost',
    province_th: 'พระนครศรีอยุธยา (ไทย)',
    province_en: 'Phra Nakhon Si Ayutthaya (Thailand)',
    district_th: 'ดงกล้วยตานีโบราณ',
    district_en: 'Wild Tani Groves',
    lat: 14.35,
    lng: 100.57,
    story_th: 'วิญญาณพรายสาวงามในคติชนไทย ผู้สิงสถิตอยู่ในดงกล้วยตานี ปรากฏกายในร่างหญิงสาวรูปโฉมงดงาม ผิวสีผึ้ง ห่มสไบแพรสีเขียวตองอ่อน นุ่งโจงกระเบน มีกลิ่นหอมของดอกกล้วยตานีโชยมาตามลมในคืนจันทร์เพ็ญ มีอุปนิสัยอ่อนโยนใจดี ชอบช่วยเหลือผู้ตกทุกข์ได้ยาก แต่หากผู้ใดล่วงละเมิดฟันกล้วยตานีหรือผิดสัจจะคำสาบานจะถูกหลอกหลอนจนเสียสติ',
    story_en: 'A benevolent yet formidable female nature nymph of Siamese folklore residing within wild Tani banana trees. Materializing on moonlit nights as an ethereal maiden in pale emerald silk with the sweet scent of banana blossoms. Legend warns that men who court her spirit must remain eternally faithful, or face wrathful misfortune.',
    folklore_history_th: 'ความเชื่อโบราณมีข้อห้ามเด็ดขาดไม่ให้ปลูกกล้วยตานีไว้ชิดเรือนพักอาศัย และห้ามตัดต้นกล้วยตานีที่กำลังออกปลี เพราะถือเป็นช่วงที่นางตานีกำลัง "ตั้งครรภ์" ชายหนุ่มในอดีตมักทำพิธีผูกผ้าสามสีและเซ่นไหว้ด้วยแป้งร่ำน้ำอบเพื่อขอโชคลาภ',
    folklore_history_en: 'Centuries-old Thai botanical folklore prohibits planting Tani trees too close to dwellings or felling a blossoming banana stalk. Villagers perform reverent offerings with tri-colored cloth ribbons and scented powder to appease her gentle spirit for good fortune and protection.',
    image_url: '/entities/pin-nangtani.jpg',
    sound_preset: 'whisper',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-nangtani.jpg',
        title: 'ภาพวาดโบราณนางตานีในดงกล้วยตานียามคืนเพ็ญ'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=FjD9b5sL80I',
        title: 'ตำนานนางตานี พรายกล้วยตานีแห่งสยาม',
        thumbnail: '/entities/pin-nangtani.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-laplae',
    title_th: 'เมืองลับแล ดินแดนสนธยาแห่งสัจจะวาจา',
    title_en: 'Muang Lap Lae, the Hidden Realm of Truth',
    category: 'legend',
    province_th: 'อุตรดิตถ์ (ไทย)',
    province_en: 'Uttaradit (Thailand)',
    district_th: 'หุบเขาและซุ้มประตูเมืองลับแล',
    district_en: 'Lap Lae Mountain Valley & Gate',
    lat: 17.65,
    lng: 100.04,
    story_th: 'นครลี้ลับซ่อนตัวอยู่ในม่านหมอกหนาทึบและหุบเขาสลับซับซ้อน ผู้มีจิตบริสุทธิ์เท่านั้นจึงจะหลงทางผ่านประตูลับเข้าไปได้ เมืองนี้ปกครองด้วยศีลธรรม ประชาชนถือสัจจะวาจาเป็นยิ่งชีพและห้ามพูดปด ตำนานเล่าถึงชายหนุ่มที่พบรักกับหญิงสาวชาวลับแล แต่เมื่อพลั้งปากโกหกลูกน้อยเพื่อปลอบให้หยุดร้องไห้ จึงถูกเชิญออกจากเมืองพร้อมถุงขมิ้นที่กลายเป็นทองคำแท้',
    story_en: 'A mythical twilight sanctuary concealed beneath eternal mountain fog in northern Thailand. Accessible only by pure-hearted travelers stumbling through dimensional veils, the kingdom is governed by absolute honesty where lying is strictly taboo. The legend tells of an outsider accepted as husband who accidentally told a falsehood to quiet his crying infant, resulting in gentle banishment with turmeric roots that miraculously turned to pure gold.',
    folklore_history_th: 'ภูมิศาสตร์ของอำเภอลับแลในอดีตเป็นป่าดงดิบลึกและมีหมอกปกคลุมตลอดปี ผสานกับคติธรรมคำสอนเรื่องความซื่อสัตย์สุจริต ทำให้ซุ้มประตูเมืองลับแลกลายเป็นสัญลักษณ์แห่งความศักดิ์สิทธิ์และดินแดนแห่งความสงบร่มเย็น',
    folklore_history_en: 'Rooted in northern Thai Lanna cultural geography, where dense topographic valleys trapped perpetual mist. The folklore stands as a revered moral parable on truthfulness, immortalized at the ornate Lap Lae gateway guarding the threshold between myth and reality.',
    image_url: '/entities/pin-laplae.jpg',
    sound_preset: 'temple_bell',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-laplae.jpg',
        title: 'ซุ้มประตูเมืองลับแลยามค่ำคืนในม่านหมอกอุตรดิตถ์'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=kYv9GZ-lX3Y',
        title: 'เปิดตำนานเมืองลับแล ดินแดนแห่งความสัจจะ',
        thumbnail: '/entities/pin-laplae.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-dragonstriangle',
    title_th: 'สามเหลี่ยมมังกร ทะเลปีศาจแห่งแดนอาทิตย์อุทัย',
    title_en: "The Dragon's Triangle (Devil's Sea / Ma-no Umi)",
    category: 'curse',
    province_th: 'หมู่เกาะอิซุ (ญี่ปุ่น)',
    province_en: 'Izu Islands (Japan)',
    district_th: 'ทะเลปีศาจมหาสมุทรแปซิฟิก',
    district_en: "Devil's Sea / Pacific Ocean",
    lat: 33.0,
    lng: 139.5,
    story_th: 'น่านน้ำอาถรรพ์ฝั่งมหาสมุทรแปซิฟิกขนานคู่กับสามเหลี่ยมเบอร์มิวดา ทอดตัวระหว่างเกาะมิยาเกะ ภูเขาไฟฟูจิ และเกาะกวม สถานที่ที่เรือประมงและเรือรบทหารของญี่ปุ่นหายสาบสูญไปพร้อมกันหลายลำในทศวรรษ 1950 แม้แต่เรือสำรวจวิทยาศาสตร์ ไคโยมารุ หมายเลข 5 (Kaiyo Maru No. 5) ที่รัฐบาลญี่ปุ่นส่งไปตรวจสอบ ก็ระเบิดและจมลงสู่ก้นทะเลคร่าชีวิตนักวิทยาศาสตร์ทั้งหมด 31 คน',
    story_en: 'The Pacific counterpart to the Bermuda Triangle, spanning the volcanic trench between Tokyo, Miyake Island, and the Mariana Islands. Known in Japan as Ma-no Umi (Devil\'s Sea), the area is notorious for vanishing fishing vessels and military aircraft. In 1952, the Japanese government dispatched the research vessel Kaiyo Maru No. 5 to investigate, which was promptly destroyed by sudden seismic undersea explosions with all 31 scientists aboard lost.',
    folklore_history_th: 'ตำนานพื้นบ้านญี่ปุ่นโบราณเชื่อว่าใต้ทะเลลึกแห่งนี้เป็นที่สิงสถิตของมังกรยักษ์หลับใหลที่เมื่อขยับตัวจะก่อให้เกิดคลื่นยักษ์และไฟประหลาดพวยพุ่งขึ้นสู่ผิวน้ำ รัฐบาลญี่ปุ่นเคยประกาศให้บริเวณนี้เป็นเขตอันตรายทางทะเลอย่างเป็นทางการ',
    folklore_history_en: "Ancient Japanese maritime mythology recounts colossal sea dragons slumbering in deep tectonic rifts whose restless awakenings summon tidal waves, whirlpools, and phantom sea lights. The Japanese Maritime Safety Agency officially designated the zone a perilous hazard area.",
    image_url: '/entities/pin-dragonstriangle.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-dragonstriangle.jpg',
        title: 'เกาะภูเขาไฟมิยาเกะใจกลางสามเหลี่ยมมังกร'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=Fj-yK23aD6A',
        title: 'The Dragon’s Triangle: Japan’s Deadly Devil’s Sea',
        thumbnail: '/entities/pin-dragonstriangle.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-toweroflondon',
    title_th: 'วิญญาณแอนน์ โบลีน แห่งหอคอยแห่งลอนดอน',
    title_en: "Anne Boleyn's Ghost at the Tower of London",
    category: 'ghost',
    province_th: 'ลอนดอน (สหราชอาณาจักร)',
    province_en: 'London (UK)',
    district_th: 'หอคอยสีขาวและโบสถ์เซนต์ปีเตอร์',
    district_en: 'White Tower & St. Peter ad Vincula',
    lat: 51.51,
    lng: -0.08,
    story_th: 'ป้อมปราการหลวงและคุกหลวงริมแม่น้ำเทมส์อายุกว่า 900 ปี สถานที่ประหารชีวิตพระนางแอนน์ โบลีน มเหสีองค์ที่สองของพระเจ้าเฮนรีที่ 8 ในปี 1536 วิญญาณของพระนางมักปรากฏกายในชุดราตรีผ้าไหมสีดำ เดินถือศีรษะที่ถูกตัดขาดไว้แนบอก เดินทอดน่องผ่านโบสถ์น้อยเซนต์ปีเตอร์ แอด วินคูลา และลานกรีนทาวเวอร์ในยามค่ำคืน ท่ามกลางวิญญาณของเจ้าชายน้อยสองพระองค์ที่ถูกสังหาร',
    story_en: 'The historic royal fortress and prison on the River Thames with 900 years of bloody intrigue. Queen Anne Boleyn, second wife of King Henry VIII, was executed here by swordsman in May 1536. Her headless apparition, clutching her severed head beneath her arm, has been sighted pacing the Chapel Royal of St. Peter ad Vincula and Tower Green by guards and tourists for centuries.',
    folklore_history_th: 'มีรายงานการพบเห็นโดยทหารยามรักษาพระองค์ (Yeoman Warders) หลายครั้งตลอดศตวรรษที่ 19 และ 20 รวมทั้งเหตุการณ์ที่ทหารยามแทงดาบปลายปืนเข้าใส่เงาร่างไร้ศีรษะแต่ดาบทะลุผ่านความว่างเปล่าจนทหารเป็นลมหมดสติ',
    folklore_history_en: 'Documented repeatedly in official British military guard reports. In 1864, a sentry charged his bayonet at a headless phantom in White Tower; the blade passed cleanly through the specter, leaving the terrified soldier court-martialed for fainting on duty until witnesses corroborated the spectral encounter.',
    image_url: '/entities/pin-toweroflondon.jpg',
    sound_preset: 'whisper',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-toweroflondon.jpg',
        title: 'หอคอยแห่งลอนดอนริมแม่น้ำเทมส์ยามราตรี'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=FjD9b5sL80I',
        title: 'Ghosts of the Tower of London: Anne Boleyn & The Princes',
        thumbnail: '/entities/pin-toweroflondon.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-roswell',
    title_th: 'ปริศนาวัตถุบินลึกลับและจานบินตกโรสเวลล์',
    title_en: 'The Roswell Incident (UFO Crash of 1947)',
    category: 'legend',
    province_th: 'นิวเม็กซิโก (สหรัฐอเมริกา)',
    province_en: 'New Mexico (USA)',
    district_th: 'ฟอสเตอร์แรนช์ / ฐานทัพอากาศโรสเวลล์',
    district_en: 'Foster Ranch / Roswell AAF',
    lat: 33.39,
    lng: -104.52,
    story_th: 'เหตุการณ์ปริศนาระดับโลกในเดือนกรกฎาคม 1947 เมื่อวัตถุบินลึกลับทรงจานกลมตกลงในฟาร์มปศุสัตว์นอกเมืองโรสเวลล์ กองทัพอากาศสหรัฐฯ ออกแถลงการณ์อย่างเป็นทางการผ่านหนังสือพิมพ์ว่า "กอบกู้จานบินตกได้สำเร็จ" ก่อนจะกลับคำแถลงในวันถัดมาว่าเป็นเพียงบอลลูนตรวจสภาพอากาศ ท่ามกลางคำให้การของพยานว่ามีการกักเก็บเศษซากโลหะประหลาดและร่างสิ่งมีชีวิตต่างดาวขนาดเล็กไปทดลองลับ ณ แอเรีย 51',
    story_en: "The defining genesis of modern UFO mythology in July 1947, when an anomalous disc-shaped aerial craft crashed during a thunderstorm on Mac Brazel's sheep ranch outside Roswell. The US Army Air Forces initially issued a sensational press release announcing they had captured a 'flying disc', before retracting it hours later as a weather balloon, sparking decades of cover-up lore and alien autopsy reports.",
    folklore_history_th: 'กลายเป็นรากฐานของวัฒนธรรมไซไฟ ทฤษฎีสมคบคิดของรัฐบาล และการศึกษาเรื่องมนุษย์ต่างดาว พยานนายทหารหลายท่านก่อนเสียชีวิตได้ทิ้งคำให้การรับรองว่าเศษซากที่พบมีความยืดหยุ่นสูง ไม่สามารถตัดหรือเผาไหม้ได้ และมีตัวอักษรคล้ายอักษรเฮียโรกลีฟิกโบราณสลักอยู่',
    folklore_history_en: 'Catalyzed global modern folklore concerning extraterrestrial visitors, Project Mogul, and Area 51. Major Jesse Marcel, who personally recovered the wreckage, testified before his death that the metallic foil could not be scratched, burned, or dented, bearing purple hieroglyph-like inscriptions.',
    image_url: '/entities/pin-roswell.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-roswell.jpg',
        title: 'หน้าหนึ่งหนังสือพิมพ์ Roswell Daily Record วันที่ 8 กรกฎาคม 1947'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=F_fP_iM8_qg',
        title: 'The Roswell Incident: What Really Crashed in New Mexico?',
        thumbnail: '/entities/pin-roswell.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-ogopogo',
    title_th: 'โอโกโปโก สัตว์ประหลาดแห่งทะเลสาบโอคานากัน',
    title_en: 'Ogopogo, the Monster of Lake Okanagan',
    category: 'monster',
    province_th: 'บริติชโคลัมเบีย (แคนาดา)',
    province_en: 'British Columbia (Canada)',
    district_th: 'ทะเลสาบโอคานากัน / คีโลว์นา',
    district_en: 'Okanagan Lake / Kelowna',
    lat: 49.88,
    lng: -119.49,
    story_th: 'สัตว์ประหลาดรูปร่างคล้ายพญางูหรือสัตว์เลื้อยคลานยุคดึกดำบรรพ์ (Plesiosaur) ยาวกว่า 15 เมตร ลำตัวมีรอยคอดเป็นลอนคลื่นคล้ายลำตัวงู ผิวสีเขียวเข้มแกมน้ำตาล อาศัยอยู่ในทะเลสาบน้ำจืดโอคานากันอันลึกชัน ชนเผ่าพื้นเมืองเซซีลกซ์ (Syilx) มีตำนานเล่าขานถึง "นาไฮต์กู" (N\'ha-a-itk) จิตวิญญาณแห่งทะเลสาบที่คอยสร้างคลื่นลมดูดกลืนผู้คน',
    story_en: "A serpent-like freshwater lake cryptid reported in the deep glacial waters of Lake Okanagan, British Columbia. Measuring up to 50 feet with dark undulating humps and a goat or equine-shaped head. The indigenous Syilx (Okanagan) people revered the beast as N'ha-a-itk ('sacred creature of the water'), making offerings before crossing the treacherous lake.",
    folklore_history_th: 'ชนเผ่าพื้นเมืองมักนำสัตว์เล็กไปสังเวยที่เกาะแรทเทิลสเนกเพื่อขอทางสัญจรปลอดภัย ในยุคศตวรรษที่ 20 มีรายงานการพบเห็นมากกว่า 1,000 ครั้ง บันทึกภาพถ่ายและวิดีโอที่มีชื่อเสียง อาทิ ฟิล์มของ Art Folden ในปี 1968',
    folklore_history_en: "Traditional Syilx folklore required travelers to offer small animals at Rattlesnake Island to appease N'ha-a-itk. Since European settlement in 1872, thousands of sightings and photographic evidence, notably the 1968 Folden 8mm footage, have kept the legend alive.",
    image_url: '/entities/pin-ogopogo.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-ogopogo.jpg',
        title: 'ภาพถ่ายลอนคลื่นปริศนาสัตว์ประหลาดโอโกโปโก'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=Fj-yK23aD6A',
        title: 'Canada’s Loch Ness: The Mystery of Ogopogo',
        thumbnail: '/entities/pin-ogopogo.jpg'
      }
    ],
    is_published: 1
  }
];

// 1. Update seedData.ts
const seedPath = path.resolve(__dirname, '../src/data/seedData.ts');
let seedContent = fs.readFileSync(seedPath, 'utf8');

// Check existing pins to prevent duplication
for (const pin of NEW_PINS) {
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
for (const pin of NEW_PINS) {
  const pinObjStr = JSON.stringify(pin, null, 4)
    .replace(/"([a-zA-Z0-9_]+)":/g, '$1:')
    .split('\n')
    .map((line, idx) => (idx === 0 ? '  {' : '  ' + line))
    .join('\n');
  newPinsJs += pinObjStr + ',\n';
}

const updatedSeedContent = seedContent.substring(0, lastIndex) + newPinsJs + seedContent.substring(lastIndex);
fs.writeFileSync(seedPath, updatedSeedContent, 'utf8');
console.log('Successfully appended ' + NEW_PINS.length + ' new batch 2 pins to seedData.ts');

// 2. Generate SQL file
let sqlContent = '';
for (const pin of NEW_PINS) {
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

const sqlPath = path.resolve(__dirname, '../../insert_batch2_pins.sql');
fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log('Successfully wrote ' + sqlPath + ' with ' + NEW_PINS.length + ' INSERT statements');

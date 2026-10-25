const fs = require('fs');
const path = require('path');

const NEW_PINS = [
  {
    id: 'pin-bermuda',
    title_th: 'สามเหลี่ยมเบอร์มิวดา (สามเหลี่ยมปีศาจ)',
    title_en: "The Bermuda Triangle (Devil's Triangle)",
    category: 'curse',
    province_th: 'แอตแลนติกเหนือ (เบอร์มิวดา)',
    province_en: 'North Atlantic (Bermuda)',
    district_th: 'ทะเลซาร์กัสโซ',
    district_en: 'Sargasso Sea',
    lat: 25.0,
    lng: -71.0,
    story_th: 'น่านน้ำลึกลับรูปสามเหลี่ยมระหว่างไมอามี เบอร์มิวดา และเปอร์โตริโก สถานที่เกิดเหตุการณ์เรือเดินสมุทรและฝูงบินทหารหายสาบสูญไปอย่างไร้ร่องรอยนับร้อยลำ อาทิ ฝูงบิน 19 (Flight 19) ในปี 1945 ที่เข็มทิศหมุนเคว้งคว้างก่อนสัญญาณขาดหาย ท่ามกลางหมอกเรืองแสงและพายุแม่เหล็กไฟฟ้าปริศนา',
    story_en: 'A mythical maritime expanse in the western North Atlantic where scores of aircraft and ships are said to have vanished under mysterious circumstances. Most infamous among them was Flight 19 in 1945—five US Navy torpedo bombers whose compasses spun violently before vanishing into green-tinted ocean mist.',
    folklore_history_th: 'คริสโตเฟอร์ โคลัมบัส บันทึกการสังเกตแสงประหลาดใต้ท้องทะเลและเข็มทิศคลาดเคลื่อนในบริเวณนี้ตั้งแต่ปี 1492 เรื่องราวถูกตั้งชื่ออย่างเป็นทางการโดย Vincent Gaddis ในนิตยสาร Argosy เมื่อปี 1964 ก่อกำเนิดทฤษฎีประตูลี้ลับสู่มิติอื่นและกระแสน้ำวนดูดกลืน',
    folklore_history_en: "Christopher Columbus first reported strange flaming lights falling into the sea and erratic compass readings here in 1492. The moniker 'Bermuda Triangle' was coined by Vincent Gaddis in 1964, sparking global legends of time slips, vortexes, and magnetic anomalies.",
    image_url: '/entities/pin-bermuda.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-bermuda.jpg',
        title: 'หมอกควันเรืองแสงและวังน้ำวนแห่งสามเหลี่ยมเบอร์มิวดา'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=FjD9b5sL80I',
        title: 'The Bermuda Triangle: What Really Happened to Flight 19?',
        thumbnail: '/entities/pin-bermuda.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-mothman',
    title_th: 'มอธแมน มนุษย์ผีเสื้อราตรีแห่งพอยต์เพลแซนต์',
    title_en: 'The Mothman of Point Pleasant',
    category: 'monster',
    province_th: 'เวสต์เวอร์จิเนีย (สหรัฐอเมริกา)',
    province_en: 'West Virginia (USA)',
    district_th: 'พอยต์เพลแซนต์',
    district_en: 'Point Pleasant',
    lat: 38.84,
    lng: -82.14,
    story_th: 'อสูรมีปีกขนาดยักษ์สูงกว่า 7 ฟุต มีดวงตาสีแดงฉานสะกดจิต ปรากฏตัวในเขตรกร้างคลังสรรพาวุธเก่า (TNT Area) เมืองพอยต์เพลแซนต์ ระหว่างปี 1966-1967 สามารถบินทะยานด้วยความเร็วเหนือเสียงตามประกบรถยนต์ของผู้พบเห็น ก่อนเหตุการณ์สะพานซิลเวอร์บริดจ์พังถล่มคร่าชีวิตผู้คน 46 ราย',
    story_en: 'A chilling bipedal winged humanoid standing over 7 feet tall with hypnotic, blazing red eyes set directly in its chest. First sighted by grave diggers and couples in Point Pleasant’s abandoned WWII TNT area throughout 1966–1967, culminating in the tragic collapse of the Silver Bridge.',
    folklore_history_th: 'พยานบุคคลกว่า 100 ปากยืนยันการเผชิญหน้ากับมอธแมน บันทึกคดีโดย John Keel ในหนังสือ The Mothman Prophecies (1975) ชาวเมืองเชื่อว่าเป็นลางเตือนภัยพิบัติ หรือวิญญาณคำสาปของหัวหน้าเผ่าชอว์นี (Chief Cornstalk)',
    folklore_history_en: "Documented by investigator John Keel in his 1975 book 'The Mothman Prophecies'. Local folklore links the entity to a 200-year-old death curse cast by Shawnee Chief Cornstalk upon Point Pleasant, regarding Mothman as an otherworldly harbinger of doom.",
    image_url: '/entities/pin-mothman.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-mothman.jpg',
        title: 'ภาพจำลองมอธแมนเกาะโครงเหล็กสะพานซิลเวอร์บริดจ์'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=kYv9GZ-lX3Y',
        title: 'The Mothman Legend & Historical Sighting Archive',
        thumbnail: '/entities/pin-mothman.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-skinwalker',
    title_th: 'สกินวอล์กเกอร์ พ่อมดแปลงกายแห่งชนเผ่านาวาโฮ',
    title_en: 'The Navajo Skinwalker (Yenaldooshi)',
    category: 'curse',
    province_th: 'ยูทาห์ (สหรัฐอเมริกา)',
    province_en: 'Utah (USA)',
    district_th: 'แอ่งยูอินทาห์ / สกินวอล์กเกอร์แรนช์',
    district_en: 'Uintah Basin / Skinwalker Ranch',
    lat: 40.26,
    lng: -109.89,
    story_th: 'พ่อมดแม่มดนอกรีตในคติชนเผ่านาวาโฮ (Yee Naaldlooshii) ผู้สังเวยชีวิตสายเลือดเดียวกันเพื่อแลกกับอำนาจมืด สามารถสวมหนังสัตว์เพื่อแปลงร่างเป็นหมาป่า โคโยตี หรืออีกายักษ์ มีข้อต่อแขนขาผิดรูป วิ่งเร็วทัดเทียมรถยนต์ และจ้องมองผ่านหน้าต่างเพื่อขโมยวิญญาณมนุษย์',
    story_en: 'Corrupted medicine men of Navajo folklore known as Yee Naaldlooshii (with it, he walks on all fours). Having acquired dark sorcery through taboo rituals, they don animal pelts to take the form of monstrous wolves, bears, or coyotes, terrorizing remote desert homesteads with impossible agility.',
    folklore_history_th: 'ชาวนาวาโฮยึดถือเป็นข้อห้ามเด็ดขาดที่จะเอ่ยชื่อสกินวอล์กเกอร์ต่อคนแปลกหน้า บริเวณแอ่งยูอินทาห์และสกินวอล์กเกอร์แรนช์กลายเป็นศูนย์กลางการสืบสวนปรากฏการณ์เหนือธรรมชาติระดับโลกที่มีทั้งลูกไฟประหลาดและการพบเห็นสิ่งมีชีวิตครึ่งคนครึ่งสัตว์',
    folklore_history_en: 'A strict taboo in traditional Navajo culture prohibits speaking openly of skinwalkers. The Uintah Basin, surrounding Skinwalker Ranch, has been a global paranormal nexus studied by defense researchers for cattle mutilations, anomalous radiation, and shapeshifting entities.',
    image_url: '/entities/pin-skinwalker.jpg',
    sound_preset: 'whisper',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-skinwalker.jpg',
        title: 'สกินวอล์กเกอร์กลางทะเลทรายแดงยามราตรี'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=F_fP_iM8_qg',
        title: 'Navajo Skinwalker Lore & Skinwalker Ranch Secrets',
        thumbnail: '/entities/pin-skinwalker.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-flyingdutchman',
    title_th: 'ฟลายอิงดัตช์แมน เรือผีสิงแห่งแหลมกู๊ดโฮป',
    title_en: 'The Flying Dutchman',
    category: 'legend',
    province_th: 'แหลมกู๊ดโฮป (แอฟริกาใต้)',
    province_en: 'Cape of Good Hope (South Africa)',
    district_th: 'คาบสมุทรเคป',
    district_en: 'Cape Peninsula',
    lat: -34.35,
    lng: 18.49,
    story_th: 'เรือใบสเปกตรัมต้องคำสาปที่ลอยลำฝ่าคลื่นลมบ้าคลั่งรอบแหลมพายุ กัปตันเฮนดริก ฟาน เดอร์ เดคเคน สบถท้าทายพระเจ้าว่าจะล่องเรือผ่านแหลมนี้ให้ได้แม้ต้องแล่นไปชั่วกัปชั่วกัลป์ เรือจึงต้องล่องลอยชั่วนิรันดร์โดยไม่มีวันได้เทียบท่า พร้อมนำพาหายนะแก่ลูกเรือทุกลำที่บังเอิญแล่นผ่าน',
    story_en: 'The most legendary ghost ship in naval history, cursed never to make port and doomed to sail stormy waters near the Cape of Good Hope for eternity. Captain Hendrick van der Decken swore a blasphemous oath into the gale, sealing the spectral ship’s fate in ghostly St. Elmo’s fire.',
    folklore_history_th: 'ปรากฏในบันทึกการเดินทางของราชนาวีอังกฤษและกะลาสีฮอลแลนด์ตั้งแต่ศตวรรษที่ 17 รวมทั้งบันทึกของเจ้าชายจอร์จ (ต่อมาคือพระเจ้าจอร์จที่ 5 แห่งสหราชอาณาจักร) ในปี 1881 ที่ทรงเห็นเรือผีส่องแสงสีแดงเรืองรองกลางทะเล',
    folklore_history_en: 'Chronicled in nautical lore since the late 18th century, including an official 1881 log entry by the future King George V aboard HMS Bacchante, describing a phantom brig glowing with eerie red luminescence cutting through heavy squalls.',
    image_url: '/entities/pin-flyingdutchman.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-flyingdutchman.jpg',
        title: 'เรือฟลายอิงดัตช์แมนฝ่าคลื่นยักษ์พร้อมแสงเซนต์เอลโม'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=Y0gW_b4d0K0',
        title: 'Legend of the Flying Dutchman Nautical Documentary',
        thumbnail: '/entities/pin-flyingdutchman.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-kraken',
    title_th: 'คราเคน อสูรหมึกยักษ์ใต้สมุทรนอร์ส',
    title_en: 'The Kraken of the Abyssal Depths',
    category: 'monster',
    province_th: 'โลโฟเทน (นอร์เวย์)',
    province_en: 'Lofoten (Norway)',
    district_th: 'ทะเลนอร์เวย์',
    district_en: 'Norwegian Sea',
    lat: 68.17,
    lng: 13.75,
    story_th: 'อสูรใต้สมุทรขนาดยักษ์ในตำนานสแกนดิเนเวีย ลำตัวยาวนับกิโลเมตรจนแลดูคล้ายเกาะกลางทะเล มีหนวดมหึมานับไม่ถ้วนที่สามารถโอบรัดเรือไวกิ้งทั้งลำแล้วดึงจมสู่ก้นมหาสมุทร การดำดิ่งของมันสร้างวังน้ำวนมหาศาล (Maelstrom) ที่กลืนกินทุกสรรพสิ่ง',
    story_en: 'A gargantuan sea monster of Norse sagas so enormous that sailors frequently mistook its submerged back for an archipelago of islands. Its titanic suckered tentacles could drag fully rigged Viking galleons into the abyss, leaving a churning maelstrom in its wake.',
    folklore_history_th: 'บันทึกในพงศาวดารนอร์เวย์ศตวรรษที่ 13 (Konungs skuggsjá) และหนังสือ Natural History of Norway (1752) โดยบิชอป Erik Pontoppidan เชื่อมโยงกับการค้นพบหมึกยักษ์ (Architeuthis dux) ในทะเลน้ำลึก',
    folklore_history_en: "First detailed in the 13th-century Old Norse work 'Konungs skuggsjá' and formalized by Bishop Erik Pontoppidan in 1752. Modern oceanography traces the legend to historic encounters with giant and colossal squids inhabiting polar trenches.",
    image_url: '/entities/pin-kraken.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-kraken.jpg',
        title: 'คราเคนโผล่หนวดยักษ์กลางวังน้ำวนทะเลนอร์เวย์'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=Fj-yK23aD6A',
        title: 'Myth & Science of the Colossal Kraken',
        thumbnail: '/entities/pin-kraken.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-kappa',
    title_th: 'กัปปะ ปีศาจพรายน้ำแห่งสายธารญี่ปุ่น',
    title_en: 'Kappa, the River Imp of Japan',
    category: 'monster',
    province_th: 'เกียวโต (ญี่ปุ่น)',
    province_en: 'Kyoto (Japan)',
    district_th: 'แม่น้ำคาโมะและลุ่มน้ำโทเนะ',
    district_en: 'Kamo River & Tone Basin',
    lat: 35.01,
    lng: 135.76,
    story_th: 'โยไคสะเทินน้ำสะเทินบกรูปร่างคล้ายเด็ก ผิวสีเขียว มีกระดองเต่า มือเท้าเป็นพังผืด และมีแอ่งน้ำรูปจาน (Sara) อยู่บนกระหม่อม หากน้ำแห้งเหือดจะสิ้นเรี่ยวแรง กัปปะชื่นชอบแตงกวาและการแข่งขันซูโม่ แต่หากโกรธเกรี้ยวจะดึงเด็กและม้าลงน้ำเพื่อขโมยลูกแก้ววิญญาณ (ชิริโกดามะ)',
    story_en: 'A classic amphibious yōkai inhabiting Japanese rivers and ponds. Resembling a scaly reptilian child with a turtle shell, webbed digits, and a water-filled dish (sara) atop its head. Passionate about wrestling sumō and fresh cucumbers, but prone to dragging unwary swimmers into watery graves to extract their soul-orb (shirikodama).',
    folklore_history_th: 'ตำนานสืบทอดในสังคมเกษตรกรรมญี่ปุ่นมาตั้งแต่ยุคเอโดะ ชาวบ้านนิยมสลักชื่อครอบครัวลงบนแตงกวาแล้วลอยลงแม่น้ำเพื่อเซ่นไหว้ขอขมาคุ้มครองไม่ให้ลูกหลานจมน้ำ',
    folklore_history_en: 'Deeply embedded in Edo-period folklore and Shinto water deity traditions (Suijin). Families carved their children’s names onto cucumbers thrown into rivers as protective offerings against summer drowning incidents.',
    image_url: '/entities/pin-kappa.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-kappa.jpg',
        title: 'ภาพกัปปะริมตลิ่งแม่น้ำใต้ต้นหลิว'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=9jD_w0b1L2M',
        title: 'Kappa: Japanese River Monster Lore & Mythology',
        thumbnail: '/entities/pin-kappa.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-pret',
    title_th: 'เปรตวัดสุทัศน์ เสาชิงช้าแห่งพระนคร',
    title_en: 'The Pret Hungry Ghost of Wat Suthat',
    category: 'ghost',
    province_th: 'กรุงเทพมหานคร (ไทย)',
    province_en: 'Bangkok (Thailand)',
    district_th: 'เสาชิงช้า / วัดสุทัศนเทพวราราม',
    district_en: 'Giant Swing / Wat Suthat',
    lat: 13.75,
    lng: 100.5,
    story_th: 'วิญญาณแห่งทุคติภูมิในคติพุทธศาสนา ร่างกายผอมโซสูงตระหง่านเสียดฟ้าเท่าต้นตาล มือเท่าใบตาล ปากเท่ารูเข็ม ส่งเสียงกรีดร้องหวีดหวิวโหยหวนขอส่วนบุญในยามดึกสงัดรอบเสาชิงช้าและพระวิหารหลวง เป็นผลกรรมจากการด่าทอทุบตีบุพการีหรือคดโกงของสงฆ์',
    story_en: 'The towering hungry ghost (Preta) of Thai Buddhist cosmology, cemented in Bangkok folklore alongside the Giant Swing of Wat Suthat. Standing as tall as palm trees with hands like palm leaves and mouths pinpricked as small as needle eyes, whistling agonizing cries into the midnight breeze for karmic merit.',
    folklore_history_th: "สำนวนโบราณกล่าวขานคู่กันว่า 'แร้งวัดสระเกศ เปรตวัดสุทัศน์' ในอดีตบริเวณนี้มีต้นไม้ใหญ่และเงาเสาชิงช้าทอดยาวในคืนเดือนมืด ผสานกับคติไตรภูมิพระร่วง เตือนสติชาวพุทธเรื่องบาปบุญคุณโทษ",
    folklore_history_en: "Immortalized in the Siamese rhyming adage 'Vultures of Wat Saket, Prets of Wat Suthat'. The visual grandeur of the crimson Giant Swing casting nocturnal shadows combined with Traibhumikatha cosmology created Bangkok’s most famous moral folklore.",
    image_url: '/entities/pin-pret.jpg',
    sound_preset: 'whisper',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-pret.jpg',
        title: 'เปรตร่างสูงตระหง่านข้างเสาชิงช้าในม่านหมอกราตรี'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=XW9_0Lp9b_0',
        title: 'Ghosts of Bangkok: Legend of the Wat Suthat Pret',
        thumbnail: '/entities/pin-pret.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-aokigahara',
    title_th: 'ป่าอาโอกิกาฮาระ ทะเลต้นไม้แห่งวิญญาณ',
    title_en: 'Aokigahara, Sea of Trees (Jukai)',
    category: 'ghost',
    province_th: 'ยามานาชิ (ญี่ปุ่น)',
    province_en: 'Yamanashi (Japan)',
    district_th: 'เชิงภูเขาไฟฟูจิ',
    district_en: 'Base of Mount Fuji',
    lat: 35.47,
    lng: 138.64,
    story_th: 'ผืนป่าดึกดำบรรพ์เนื้อที่กว่า 30 ตารางกิโลเมตร เติบโตทับซ้อนบนหินลาวาภูเขาไฟฟูจิ ต้นไม้แผ่รากขดเคี้ยวในความเงียบสงัดไร้เสียงสัตว์ ปริมาณแร่เหล็กใต้ดินสูงจนเข็มทิศหมุนผิดเพี้ยน ผู้คนหลงทางได้ง่าย ท่ามกลางตำนานวิญญาณยูเรย์และอุบาสึเตะ (ธรรมเนียมทิ้งคนชราในอดีต)',
    story_en: 'A primeval forest sprawling across 30 square kilometers of hardened volcanic basalt beneath Mount Fuji. Known as Jukai (Sea of Trees), its porous volcanic soil deadens all ambient sound, while subterranean magnetic deposits render magnetic compasses erratic, leaving lost travelers surrounded by restless Yūrei spirits.',
    folklore_history_th: 'ตำนานพื้นบ้านบันทึกว่าเป็นสถานที่ทิ้งคนชรา (Ubasute) ในช่วงข้าวยากหมากแพงยุคศักดินา วิญญาณที่หิวโหยจึงสิงสถิตอยู่ตามโพรงไม้ คอยชักนำให้ผู้มาเยือนเดินวนเวียนจนหาทางออกไม่ได้',
    folklore_history_en: 'Rooted in feudal folklore of Ubasute (abandoning elderly relatives in wilderness during famines). Shinto lore regards the forest as a realm inhabited by tree spirits (Kodama) and melancholic wandering souls trapped between worlds.',
    image_url: '/entities/pin-aokigahara.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-aokigahara.jpg',
        title: 'รากไม้ดึกดำบรรพ์และม่านหมอกในป่าอาโอกิกาฮาระ'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=4FDSdg09df8',
        title: 'Aokigahara: Exploring the Sea of Trees',
        thumbnail: '/entities/pin-aokigahara.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-moai',
    title_th: 'ปริศนาโมไอแห่งราปานุย (เกาะอีสเตอร์)',
    title_en: 'The Moai of Rapa Nui (Easter Island)',
    category: 'sacred',
    province_th: 'เกาะอีสเตอร์ (ชิลี)',
    province_en: 'Easter Island / Rapa Nui (Chile)',
    district_th: 'ฮานกาโรอา / ราโนรารากู',
    district_en: 'Hanga Roa / Rano Raraku',
    lat: -27.11,
    lng: -109.36,
    story_th: 'รูปปั้นหินยักษ์แกะสลักจากหินภูเขาไฟเกือบ 1,000 ตัว เรียงรายหันหน้าเข้าสู่แผ่นดินเพื่อคุ้มครองเผ่าพันธุ์ แต่ละตัวมีน้ำหนักหลายสิบตัน ถูกเคลื่อนย้ายจากเหมืองหินราโนรารากูมาตั้งบนแท่นบูชาอาฮู (Ahu) ด้วยวิธีลี้ลับที่ตำนานเล่าว่า "รูปปั้นเดินได้ด้วยตนเอง" ด้วยพลังมนตรามานา',
    story_en: 'Nearly 1,000 monolithic volcanic tuff figures carved by the Rapa Nui Polynesian people between 1250 and 1500 CE. Facing inland across sacred ritual platforms (ahu) to channel ancestral mana over their descendants, legend maintains that high priests commanded the colossal statues to walk across the island.',
    folklore_history_th: 'ชาวโพลินีเซียโบราณเชื่อว่าโมไอคือภาชนะกักเก็บพลังศักดิ์สิทธิ์ (Mana) ของหัวหน้าเผ่าผู้ล่วงลับ ดวงตาที่ทำจากปะการังสีขาวจะถูกเบิกเนตรในขั้นตอนสุดท้ายเพื่อปลุกพลังพิทักษ์',
    folklore_history_en: 'According to Rapa Nui oral traditions, the statues embody the living faces of deified ancestors. When white coral eye inlays were inserted, the moai were imbued with spiritual life force (mana) to protect village clans.',
    image_url: '/entities/pin-moai.jpg',
    sound_preset: 'temple_bell',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-moai.jpg',
        title: 'รูปปั้นโมไอเรียงรายใต้ทางช้างเผือกริมมหาสมุทรแปซิฟิก'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=m8b8Hk5lQ3g',
        title: 'How Did the Easter Island Statues Move?',
        thumbnail: '/entities/pin-moai.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-nazca',
    title_th: 'ลายเส้นปริศนานัซกา ธรณีศิลป์แห่งแอนดีส',
    title_en: 'The Nazca Lines Geoglyphs',
    category: 'sacred',
    province_th: 'นัซกา (เปรู)',
    province_en: 'Nazca (Peru)',
    district_th: 'ที่ราบสูงปัมปัสเดจูมานา',
    district_en: 'Pampas de Jumana',
    lat: -14.73,
    lng: -75.13,
    story_th: 'ภาพลายเส้นเรขาคณิตและรูปสิ่งมีชีวิตขนาดยักษ์กว่าหลายร้อยเมตร สลักลงบนผิวทะเลทรายหินแดงอันแห้งแล้งของเปรู ทั้งรูปนกฮัมมิ่งเบิร์ด ลิง แมงมุม และวาฬเพชฌฆาต ซึ่งจะมองเห็นเป็นรูปภาพสมบูรณ์ได้เฉพาะจากมุมมองบนฟากฟ้าหรืออวกาศเท่านั้น สร้างความฉงนแก่มนุษยชาตินานนับศตวรรษ',
    story_en: 'Enormous geoglyphs etched into the arid desert plateau of southern Peru between 500 BCE and 500 CE. Stretching up to 1,200 feet in length, depicting hummingbirds, monkeys, spiders, and condors visible only from the high skies, baffling archaeologists as to their ritual and astronomical purpose.',
    folklore_history_th: 'สร้างสรรค์โดยอารยธรรมนัซกาโบราณ โดยการกวาดหินกรวดสีเข้มเคลือบเหล็กออกเพื่อเปิดให้เห็นชั้นทรายสีสว่างด้านล่าง นักโบราณคดีคาดว่าเป็นลานพิธีกรรมทางดาราศาสตร์เพื่อขอฝนจากทวยเทพบนฟ้า',
    folklore_history_en: 'Crafted by the ancient Nazca culture by removing reddish-brown iron-oxide coated pebbles to expose yellowish subterranean subsoil. Scholars theorize they functioned as celestial astronomical calendars, sacred water procession pathways, and messages to the mountain deities.',
    image_url: '/entities/pin-nazca.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-nazca.jpg',
        title: 'ภาพลายเส้นนกฮัมมิ่งเบิร์ดขนาดยักษ์บนทะเลทรายนัซกา'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=uo23Xh1y9Z4',
        title: 'The Mystery of the Nazca Lines Explained',
        thumbnail: '/entities/pin-nazca.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-phitakhon',
    title_th: 'ผีตาโขน ด่านซ้าย บุญหลวงแห่งเมืองเลย',
    title_en: 'Phi Ta Khon Festival of Dan Sai',
    category: 'sacred',
    province_th: 'เลย (ไทย)',
    province_en: 'Loei (Thailand)',
    district_th: 'ด่านซ้าย / วัดโพนชัย',
    district_en: 'Dan Sai / Wat Phon Chai',
    lat: 17.28,
    lng: 101.14,
    story_th: 'ประเพณีหน้ากากผีศักดิ์สิทธิ์อันเป็นเอกลักษณ์แห่งเดียวในโลก ผู้เข้าร่วมพิธีจะสวมหน้ากากแกะสลักจากโคนก้านมะพร้าวและหวดนึ่งข้าวเหนียว วาดลวดลายอ่อนช้อยน่าเกรงขาม แต่งกายด้วยเศษผ้าหลากสี แขวนกระดิ่งหมากกะแหล่งส่งเสียงกริ๋งกรั๋ง ร่ายรำแห่ขบวนต้อนรับพระเวสสันดรกลับสู่พระนคร',
    story_en: 'The sacred spiritual masquerade unique to Dan Sai valley in Loei province, celebrated during the Bun Luang merit-making festival. Revelers craft vibrant, menacing masks from dried coconut husks and sticky-rice bamboo steamers, adorned with cowbells (mak-kalang) to guide wandering spirits in celebrating Prince Vessantara’s homecoming.',
    folklore_history_th: 'เดิมเรียกว่า "ผีตามคน" เล่าขานว่าเมื่อพระเวสสันดรและพระนางมัทรีเสด็จกลับเมือง เหล่าภูตผีปีศาจและสัตว์ป่าที่รักใคร่ต่างพากันแห่แหนตามมาส่งด้วยความอาลัย จนกลายมาเป็นคำว่า "ผีตาโขน" ในปัจจุบัน',
    folklore_history_en: 'Originally termed Phi Tam Khon (ghosts following humans). Legend recounts that when Prince Vessantara journeyed out of the wilderness, wild beasts and forest jungle spirits were so enamored that they marched along in joyful disguise, transforming into an enduring cultural heritage.',
    image_url: '/entities/pin-phitakhon.jpg',
    sound_preset: 'temple_bell',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-phitakhon.jpg',
        title: 'หน้ากากผีตาโขนสีสันสดใสในม่านหมอกหุบเขาด่านซ้าย'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=bOQJ85t8Y6g',
        title: 'Phi Ta Khon: Thailand Ghost Mask Festival Documentary',
        thumbnail: '/entities/pin-phitakhon.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-dyatlov',
    title_th: 'ปริศนาช่องเขาดยัตลอฟ มรณะลี้ลับบนเทือกเขาอูราล',
    title_en: 'The Dyatlov Pass Incident',
    category: 'legend',
    province_th: 'สเวียร์ดลอฟสค์ (รัสเซีย)',
    province_en: 'Sverdlovsk (Russia)',
    district_th: 'เทือกเขาอูราลตอนเหนือ / เขาโคลัตเซียเคล',
    district_en: 'Northern Urals / Kholat Syakhl',
    lat: 61.75,
    lng: 59.45,
    story_th: 'เหตุการณ์การเสียชีวิตปริศนาของนักปีนเขาชาวโซเวียต 9 คนบนเนินเขาโคลัตเซียเคล (ภูเขาแห่งความตาย) ในคืนพายุหิมะอุณหภูมิ -30°C เต็นท์ถูกฉีกขาดจากด้านใน ร่างผู้ตายกระจัดกระจายโดยปราศจากเสื้อผ้ากันหนาว บางรายกะโหลกศีรษะแตก ลิ้นและดวงตาหายไป และพบสารกัมมันตรังสีบนเสื้อผ้า',
    story_en: 'The mysterious demise of nine Soviet ski hikers on the slopes of Kholat Syakhl (Dead Mountain) in February 1959. Their tent was slashed open from the inside; the hikers fled into a subzero blizzard barefoot and undressed, later found with inexplicable blunt-force trauma, missing soft tissues, and traces of radiation.',
    folklore_history_th: 'ชนเผ่าพื้นเมืองแมนซี (Mansi) มีตำนานเก่าแก่เตือนห้ามขึ้นเขาแห่งนี้เพราะเคยมีพรานป่า 9 คนเสียชีวิตพร้อมกัน พยานแวดล้อมในคืนเกิดเหตุยังรายงานการเห็นลูกไฟสีส้มลอยอยู่เหนือท้องฟ้า ก่อเกิดทฤษฎีอาวุธลับโซเวียตและสิ่งมีชีวิตลึกลับ',
    folklore_history_en: 'Local indigenous Mansi folklore warns that Kholat Syakhl is cursed, following ancient legends of nine hunters who previously perished there. Hikers 50 km away reported sighting anomalous orange glowing spheres in the sky on the exact night of the catastrophe.',
    image_url: '/entities/pin-dyatlov.jpg',
    sound_preset: 'creepy_wind',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-dyatlov.jpg',
        title: 'เต็นท์ร้างและรอยเท้าบนสันเขาหิมะดยัตลอฟ'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=Y8RigxxiWUw',
        title: 'Dyatlov Pass: Russia Unsolved Mountain Mystery',
        thumbnail: '/entities/pin-dyatlov.jpg'
      }
    ],
    is_published: 1
  },
  {
    id: 'pin-maryceleste',
    title_th: 'มาเรีย ซีเลสเต เรือผีสิงลอยลำไร้ลูกเรือ',
    title_en: 'The Mystery of the Mary Celeste',
    category: 'legend',
    province_th: 'อะซอเรส (โปรตุเกส)',
    province_en: 'Azores (Portugal)',
    district_th: 'มหาสมุทรแอตแลนติก',
    district_en: 'Atlantic Ocean',
    lat: 38.45,
    lng: -28.0,
    story_th: 'เรือสินค้าสองเสาสัญชาติอเมริกันถูกพบเห็นลอยลำอย่างสมบูรณ์แบบกลางมหาสมุทรแอตแลนติกในเดือนธันวาคม 1872 ใบเรือกางรับลม เสบียงอาหารและสินค้าแอลกอฮอล์กว่า 1,700 ถังยังอยู่ครบถ้วน แต่กัปตัน เบนจามิน บริกส์ ภรรยา บุตรสาว และลูกเรือ 7 คนกลับหายสาบสูญไปอย่างไร้ร่องรอย',
    story_en: 'An American merchant brigantine discovered adrift and seaworthy in the Atlantic Ocean near the Azores in December 1872. Her cargo of 1,701 barrels of alcohol was untouched and personal belongings intact, yet Captain Benjamin Briggs, his family, and the entire crew had vanished without a trace.',
    folklore_history_th: "สมุดปูมเรือบันทึกล่าสุดก่อนถูกพบ 10 วันโดยไม่มีข้อความบ่งชี้อันตรายใดๆ คดีนี้กลายเป็นต้นแบบของ 'เรือผีสิง' ในวัฒนธรรมสากล และได้รับการประพันธ์ต่อยอดโดย เซอร์ อาร์เธอร์ โคนัน ดอยล์",
    folklore_history_en: "The last logbook entry dated ten days prior gave no indication of distress. The enduring mystery inspired Sir Arthur Conan Doyle’s short story 'J. Habakuk Jephson's Statement', cementing the Mary Celeste as the archetypal maritime ghost ship.",
    image_url: '/entities/pin-maryceleste.jpg',
    sound_preset: 'water_spirit',
    views_count: 0,
    gallery_media: [
      {
        type: 'image',
        url: '/entities/pin-maryceleste.jpg',
        title: 'เรือมาเรีย ซีเลสเต ลอยลำเคว้งคว้างกลางแสงจันทร์'
      },
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=FjD9b5sL80I',
        title: 'Ghost Ship: The True Story of the Mary Celeste',
        thumbnail: '/entities/pin-maryceleste.jpg'
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
console.log('Successfully appended ' + NEW_PINS.length + ' new pins to seedData.ts');

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

const sqlPath = path.resolve(__dirname, '../../insert_new_pins.sql');
fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log('Successfully wrote ' + sqlPath + ' with ' + NEW_PINS.length + ' INSERT statements');

const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper to fetch with timeout and user-agent
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.get({
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) WorldOfMys/2.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, text: data });
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ status: 408 });
    });
  });
}

function fetchHtml(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = https.get({
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, html: data }));
    });
    req.on('error', () => resolve({ status: 500, html: '' }));
    req.setTimeout(8000, () => {
      req.destroy();
      resolve({ status: 408, html: '' });
    });
  });
}

// Check oembed
async function checkOembed(videoId) {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const res = await fetchJson(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
  if (res.status === 200 && res.data && res.data.title) {
    return { ok: true, title: res.data.title, url };
  }
  return { ok: false };
}

// Find working YouTube video
async function findWorkingYoutube(query) {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' documentary mystery')}`;
    const { html } = await fetchHtml(searchUrl);
    const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
    const candidates = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (!candidates.includes(match[1])) {
        candidates.push(match[1]);
      }
      if (candidates.length >= 15) break;
    }

    for (const vid of candidates) {
      const result = await checkOembed(vid);
      if (result.ok) {
        return result;
      }
    }
  } catch (e) {
    console.error(`Search error for ${query}:`, e.message);
  }
  // Fallbacks
  return { ok: true, title: `${query} Mystery Documentary`, url: 'https://www.youtube.com/watch?v=0Xl7oRy9bEo' };
}

// Download image from Wikimedia
async function downloadWikiImage(query, destPath) {
  try {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=imageinfo&iiprop=url|mime&format=json`;
    const res = await fetchJson(api);
    if (res.status === 200 && res.data && res.data.query && res.data.query.pages) {
      for (const pageId in res.data.query.pages) {
        const info = res.data.query.pages[pageId].imageinfo;
        if (info && info[0] && info[0].url) {
          const imgUrl = info[0].url;
          if (imgUrl.match(/\.(jpg|jpeg|png)$/i)) {
            const fileStream = fs.createWriteStream(destPath);
            await new Promise((resolve, reject) => {
              https.get(imgUrl, { headers: { 'User-Agent': 'WorldOfMys/2.0 (contact: admin@worldofmys.com)' } }, (res) => {
                if (res.statusCode === 200) {
                  res.pipe(fileStream);
                  fileStream.on('finish', () => {
                    fileStream.close();
                    resolve();
                  });
                } else {
                  reject(new Error(`Status ${res.statusCode}`));
                }
              }).on('error', reject);
            });
            console.log(`Downloaded image for ${query} -> ${destPath}`);
            return true;
          }
        }
      }
    }
  } catch (e) {
    console.warn(`Wiki image download failed for ${query}:`, e.message);
  }
  return false;
}

const NEW_25_PINS = [
  {
    id: "pin-areafiftyone",
    title_th: "แอเรีย 51 (ฐานทัพลับกรูมเลก)",
    title_en: "Area 51 (Groom Lake Top Secret Facility)",
    category: "urban_legend",
    province_th: "เนวาดา (สหรัฐอเมริกา)",
    province_en: "Nevada (USA)",
    district_th: "ทะเลสาบกรูมแลนด์ ดินแดนทะเลทรายเนวาดา",
    district_en: "Groom Lake, Nevada Test and Training Range",
    lat: 37.2431,
    lng: -115.7930,
    story_th: "ฐานทัพอากาศลับสุดยอดแห่งกองทัพสหรัฐฯ กลางทะเลทรายเนวาดา ลือกระฉ่อนว่าเป็นศูนย์วิจัยซากจานบินและสิ่งมีชีวิตนอกโลกที่กู้ได้จากเหตุการณ์รอสเวลล์ มีป้ายเตือนการบุกรุกโทษจำคุกและมีสิทธิ์ยิงสังหารได้ทันที",
    story_en: "The legendary, highly classified United States Air Force facility at Groom Lake, Nevada. Fabled to harbor reverse-engineered extraterrestrial spacecraft and alien bodies salvaged from the 1947 Roswell crash.",
    folklore_history_th: "ถูกเปิดเผยสู่สาธารณชนครั้งแรกโดย บ็อบ ลาซาร์ ในปี 1989 อ้างว่าเคยทำงานวิจัยเครื่องยนต์ต่อต้านแรงโน้มถ่วงของยูเอฟโอในเซ็กเตอร์ S-4",
    folklore_history_en: "Vaulted into global pop culture in 1989 when whistleblower Bob Lazar claimed he worked on reverse-engineering alien reactor systems at the top-secret S-4 facility.",
    sound_preset: "whisper",
    views_count: 0,
    searchQuery: "Area 51 Groom Lake Nevada UFO",
    wikiQuery: "Area 51 Groom Lake"
  },
  {
    id: "pin-shambala",
    title_th: "ชัมบาลา (ดินแดนเร้นลับใต้พิภพหิมาลัย)",
    title_en: "Shambhala (The Hidden Kingdom of the Himalayas)",
    category: "place",
    province_th: "ทิเบต / เทือกเขาหิมาลัย",
    province_en: "Tibet / Himalayan Mountain Range",
    district_th: "เทือกเขาคุนหลุนและที่ราบสูงทิเบต",
    district_en: "Kunlun Mountains & Tibetan Plateau",
    lat: 31.5000,
    lng: 86.0000,
    story_th: "อาณาจักรศักดิ์สิทธิ์อันเป็นตำนานเร้นลับที่ซ่อนอยู่หลังม่านหมอกน้ำแข็งแห่งหิมาลัย เล่าขานว่าเป็นดินแดนแห่งความสงบสุขนิรันดร์และภูมิปัญญาโบราณ ที่ผู้มีจิตบริสุทธิ์เท่านั้นจึงจะค้นพบทางเข้า",
    story_en: "The mythical utopian paradise veiled behind the mist and snow of the high Himalayas. Revered in Buddhist tradition as a land of enlightened masters and ancient cosmic sciences.",
    folklore_history_th: "ปรากฏในคัมภีร์กาลจักรตันตระ กล่าวถึงราชวงศ์กษัตริย์ผู้รู้แจ้ง และเป็นแรงบันดาลใจให้เกิดความเชื่อเรื่องแชงกรี-ลาและโลกใต้พิภพอกฮาร์ทา",
    folklore_history_en: "Rooted in the Kalachakra Tantra text, prophesying a golden age of peace. Later inspired Western explorers and occultists seeking the underground realm of Agartha.",
    sound_preset: "wind",
    views_count: 0,
    searchQuery: "Shambhala Kingdom mystery documentary",
    wikiQuery: "Shambhala Tibet"
  },
  {
    id: "pin-medusa",
    title_th: "เมดูซา (นางอสูรกอร์กอนแห่งทะเลอีเจียน)",
    title_en: "Medusa, The Gorgon of the Aegean Sea",
    category: "monster",
    province_th: "เกาะคอร์ฟู (กรีซ)",
    province_en: "Corfu (Greece)",
    district_th: "ถ้ำใต้น้ำทะเลไอโอเนียน",
    district_en: "Ionian Sea Caverns",
    lat: 39.6243,
    lng: 19.9217,
    story_th: "หนึ่งในสามพี่น้องกอร์กอน หญิงสาวผู้มีเกศาเป็นงูพิษเลื้อยสยองและดวงตาต้องสาป ผู้ใดบังอาจสบตาเธอจะกลายเป็นหินแข็งไร้ชีวิตทันที ถูกเพอร์ซีอุสตัดศีรษะโดยมองผ่านโล่สะท้อนแสง",
    story_en: "The tragic Gorgon of Greek mythology cursed with a mane of writhing venomous serpents and a petrifying gaze that turns any mortal who looks upon her into solid stone.",
    folklore_history_th: "เดิมทีเป็นนักบวชหญิงแสนงดงามแห่งวิหารอาเธนา แต่ถูกเทพโพไซดอนล่วงเกินจนอาเธนาพิโรธและสาปแช่งให้กลายร่างเป็นอสูรน่าเกลียดน่ากลัว",
    folklore_history_en: "Originally a maiden priestess of Athena transformed into a monstrous creature by the goddess in wrath. Slain by the demigod Perseus using a mirrored bronze shield.",
    sound_preset: "growl",
    views_count: 0,
    searchQuery: "Medusa myth Greek monster documentary",
    wikiQuery: "Medusa Caravaggio"
  },
  {
    id: "pin-babylon",
    title_th: "หอคอยบาเบลและสวนลอยบาบิโลน",
    title_en: "The Tower of Babel & Babylon Megaliths",
    category: "place",
    province_th: "บาบิล (อิรัก)",
    province_en: "Babil (Iraq)",
    district_th: "ริมแม่น้ำยูเฟรติส",
    district_en: "Euphrates River Basin, Al-Hillah",
    lat: 32.5363,
    lng: 44.4208,
    story_th: "หอคอยยักษ์ซิกกูแรตแห่งบาบิโลนที่มนุษย์โบราณรวมพลังสร้างเพื่อเอื้อมให้ถึงสวรรค์ จนถูกพระผู้เป็นเจ้าลงทัณฑ์ให้ภาษาแตกกระจายจนคุยกันไม่รู้เรื่อง และสวนลอยฟ้ามหัศจรรย์ของโลกยุคโบราณ",
    story_en: "The monumental Mesopotamian ziggurat of Babel constructed to reach the heavens, resulting in the divine confusion of human tongues. Beside it stood the legendary Hanging Gardens.",
    folklore_history_th: "เชื่อมโยงกับซิกกูแรตเอเตเมนอันกีที่สร้างอุทิศให้แก่มหาเทพมาร์ดุก กษัตริย์เนบูคัดเนซซาร์ที่ 2 ได้บูรณะให้สูงตระหง่านจนกลายเป็นตำนานแห่งอารยธรรมมนุษย์",
    folklore_history_en: "Identified with the great ziggurat Etemenanki dedicated to the god Marduk, reconstructed under King Nebuchadnezzar II as the spiritual beacon of the ancient realm.",
    sound_preset: "drone",
    views_count: 0,
    searchQuery: "Tower of Babel ancient mystery documentary",
    wikiQuery: "Tower of Babel Bruegel"
  },
  {
    id: "pin-valkyrie",
    title_th: "วาลคิรี (ผู้นำพาวิญญาณนักรบสู่วัลฮัลลา)",
    title_en: "The Valkyrie (Choosers of the Slain)",
    category: "folklore",
    province_th: "ฟยอร์ดตะวันตก (ไอซ์แลนด์)",
    province_en: "Westfjords (Iceland)",
    district_th: "หุบเขาแห่งพายุหิมะไอซ์แลนด์",
    district_en: "Dynjandi Fjord Glacial Valleys",
    lat: 65.7333,
    lng: -23.1333,
    story_th: "ธิดาเทพแห่งโอดิน ขี่อาชาเวหาเหาะเหินเหนือสนามรบเปื้อนโลหิต เพื่อคัดเลือกวิญญาณนักรบผู้กล้าหาญที่สิ้นชีพ นำพาขึ้นสู่วิมานวัลฮัลลาเพื่อเตรียมรับศึกวันสิ้นโลกแร็กนาร็อก",
    story_en: "The ethereal maidens of Odin soaring over mist-shrouded battlefields on winged steeds. They select the bravest fallen warriors and escort their souls to feast in Odin’s golden hall of Valhalla.",
    folklore_history_th: "ปรากฏในกวีนิพนธ์เอ็ดดาของชาวนอร์ส เป็นตัวแทนของชะตากรรม ความตายอันทรงเกียรติ และแสงเหนือเรืองรองบนฟากฟ้าที่เชื่อว่าเป็นประกายเกราะของเหล่าวาลคิรี",
    folklore_history_en: "Described in the Poetic Edda as celestial weavers of war fate. Nordic folklore held that the glowing Aurora Borealis was the shimmering reflection of their celestial armor.",
    sound_preset: "wind",
    views_count: 0,
    searchQuery: "Valkyrie Norse mythology documentary",
    wikiQuery: "Valkyrie Peter Nicolai Arbo"
  },
  {
    id: "pin-jackalope",
    title_th: "แจ็กคาโลป (กระต่ายมีเขาแห่งทุ่งหญ้าตะวันตก)",
    title_en: "The Jackalope (Antlered Hare of Wyoming)",
    category: "cryptid",
    province_th: "ไวโอมิง (สหรัฐอเมริกา)",
    province_en: "Wyoming (USA)",
    district_th: "ดักลาส มณฑลคอนเวิร์ส",
    district_en: "Douglas, Converse County",
    lat: 42.7559,
    lng: -105.3822,
    story_th: "สิ่งมีชีวิตประหลาดร่างกระต่ายป่าแต่มีเขาละมั่งแหลมคม เล่าขานว่ามีความเร็วสูง ดุร้ายเมื่อจนมุม และเลียนเสียงร้องของมนุษย์คาวบอยรอบกองไฟยามค่ำคืนได้อย่างน่าขนลุก",
    story_en: "A mythical North American cryptid described as a fearsome hare with antelope horns. Tales claim it sings campfire tenor with cowboys and uses its antlers in ferocious defense.",
    folklore_history_th: "มีจุดเริ่มต้นในยุคบุกเบิกคาวบอย และถูกจัดแสดงครั้งแรกโดยพี่น้องเฮอร์ริกในทศวรรษ 1930 นักชีววิทยาเชื่อว่าอาจเกิดจากกระต่ายที่ติดเชื้อไวรัส Shope papilloma จนเกิดเนื้องอกแข็งคล้ายเขา",
    folklore_history_en: "Popularized in 1930s taxidermy by the Herrick brothers in Douglas, Wyoming. Biologists suggest sightings stemmed from hares afflicted with Shope papillomavirus growing horn-like keratin tumors.",
    sound_preset: "footsteps",
    views_count: 0,
    searchQuery: "Jackalope cryptid mystery documentary",
    wikiQuery: "Jackalope postcard"
  },
  {
    id: "pin-chichenitza",
    title_th: "เอล กัสติโย (ปิรามิดงูยักษ์แห่งชิเชนอิตซา)",
    title_en: "El Castillo, Chichen Itza (The Serpent of Light)",
    category: "place",
    province_th: "ยูกาตัน (เม็กซิโก)",
    province_en: "Yucatan (Mexico)",
    district_th: "เขตโบราณคดีชิเชนอิตซา",
    district_en: "Tinum, Yucatan Peninsula",
    lat: 20.6843,
    lng: -88.5678,
    story_th: "มหาปิรามิดของชนเผ่ามายา สร้างขึ้นตามหลักดาราศาสตร์อันล้ำยุค ในวันวิษุวัต แสงเงาดวงอาทิตย์จะตกกระทบบันไดหิน เกิดเป็นภาพงูขนนกขนาดยักษ์ 'กุกุลคาน' ค่อยๆ เลื้อยลงสู่ผืนดินอย่างน่าอัศจรรย์",
    story_en: "The monumental Mayan step-pyramid temple of Kukulkan. On spring and autumn equinoxes, the afternoon sun casts triangular shadows creating the breathtaking illusion of a giant serpent slithering down the balustrade.",
    folklore_history_th: "มีห้องใต้ดินเชื่อมต่อกับเซโนเต (บ่อน้ำศักดิ์สิทธิ์) ที่ใช้ในพิธีเซ่นสรวงเทพเจ้าด้วยมนุษย์ เพื่อขอฝนและความอุดมสมบูรณ์จากพญางูสายฟ้า",
    folklore_history_en: "Engineered with astonishing acoustic precision where claps mimic the Quetzal bird. Subterranean chambers connect to sacred cenotes used for blood offerings to the water gods.",
    sound_preset: "drone",
    views_count: 0,
    searchQuery: "Chichen Itza equinox serpent mystery documentary",
    wikiQuery: "Chichen Itza 3"
  },
  {
    id: "pin-roanoke",
    title_th: "เกาะโรอาโนกและคำสาปปริศนา CROATOAN",
    title_en: "The Lost Colony of Roanoke (The CROATOAN Mystery)",
    category: "urban_legend",
    province_th: "นอร์ทแคโรไลนา (สหรัฐอเมริกา)",
    province_en: "North Carolina (USA)",
    district_th: "เกาะโรอาโนก แดร์เคาน์ตี",
    district_en: "Roanoke Island, Dare County",
    lat: 35.8827,
    lng: -75.7088,
    story_th: "ในปี 1590 ชาวอาณานิคมอังกฤษกว่า 115 คนบนเกาะโรอาโนกอันตรธานหายสาบสูญไปอย่างไร้ร่องรอย ไร้ร่องรอยการต่อสู้ ทิ้งไว้เพียงข้อความปริศนาตัวอักษร 8 ตัวสลักบนเสาไม้ว่า 'CROATOAN'",
    story_en: "In 1590, an entire English settlement of 115 men, women, and children vanished without a trace on Roanoke Island, leaving behind no skeletons, only the single cryptic word 'CROATOAN' carved into a wooden post.",
    folklore_history_th: "จอห์น ไวท์ ผู้ว่าการอาณานิคมกลับมาพร้อมเสบียงหลังติดค้างในสงครามสเปน และต้องพบกับเมืองร้างที่ถูกกลืนหายไปในหมอกชายฝั่ง กลายเป็นปริศนาประวัติศาสตร์ที่ยังไขไม่ออกจนถึงทุกวันนี้",
    folklore_history_en: "Governor John White returned from England after three years of wartime delays to find a ghost settlement swallowed by the wilderness, sparking centuries of cannibalism, assimilation, and supernatural theories.",
    sound_preset: "whisper",
    views_count: 0,
    searchQuery: "Roanoke lost colony Croatoan mystery documentary",
    wikiQuery: "Roanoke Colony map"
  },
  {
    id: "pin-fenrir",
    title_th: "เฟนริร์ (พญามหาหมาป่าผู้กลืนสุริยะ)",
    title_en: "Fenrir, The Cataclysmic Wolf of Norse Myth",
    category: "monster",
    province_th: "เทือกเขาดอฟเรฟเยลล์ (นอร์เวย์)",
    province_en: "Dovrefjell (Norway)",
    district_th: "หุบเขาแห่งธารน้ำแข็งโบราณ",
    district_en: "Dovre National Park Range",
    lat: 62.3000,
    lng: 9.3000,
    story_th: "บุตรแห่งโลกิ พญามหาหมาป่ายักษ์ที่มีพละกำลังมหาศาลจนโซ่ตรวนเวทมนตร์กลีพนีร์เท่านั้นจึงจะพันธนาการไว้ได้ เมื่อวันแร็กนาร็อกมาถึง มันจะทำลายโซ่ อ้าปากกว้างจากดินจรดฟ้า และกลืนกินมหาเทพโอดิน",
    story_en: "The gargantuan wolf spawned by Loki whose jaws reach from earth to the heavens. Bound by the unbreakable dwarven ribbon Gleipnir until Ragnarok, when he shatters his fetters and devours Odin the Allfather.",
    folklore_history_th: "เทพบิดาไทร์ยอมเสียสละมือขวาให้เฟนริร์งับเพื่อเป็นหลักประกันในการล่ามโซ่ เป็นสัญลักษณ์แห่งการล่มสลาย ความโกรธแค้นที่ถูกกักขัง และไฟประลัยกัลป์แห่งยุคสิ้นโลก",
    folklore_history_en: "God of war Tyr sacrificed his right hand into the wolf's mouth as a pledge of trust for the binding. Fenrir embodies primordial untamed devastation and destiny’s inevitable crushing weight.",
    sound_preset: "growl",
    views_count: 0,
    searchQuery: "Fenrir Norse myth monster wolf documentary",
    wikiQuery: "Fenrir and Odin"
  },
  {
    id: "pin-delphi",
    title_th: "วิหารเดลฟี (เทพพยากรณ์และไอระเหยลึกลับ)",
    title_en: "The Oracle of Delphi (Pythia's Prophetic Trance)",
    category: "place",
    province_th: "โฟคิส (กรีซ)",
    province_en: "Phocis (Greece)",
    district_th: "เชิงเขาพาร์นัสซัส",
    district_en: "Mount Parnassus Valley",
    lat: 38.4824,
    lng: 22.5010,
    story_th: "ศูนย์กลางแห่งโลกโบราณที่กษัตริย์และแม่ทัพทั่วเมดิเตอร์เรเนียนต้องเดินทางมาเพื่อฟังคำทำนายจากนักบวชหญิง 'พีเธีย' ผู้สูดดมไอระเหยลึกลับที่พวยพุ่งจากรอยแยกใต้แผ่นดินจนเข้าสู่ภวังค์ศักดิ์สิทธิ์",
    story_en: "The spiritual navel of the ancient world. Rulers and generals made pilgrimages to hear the cryptic prophecies of the high priestess Pythia, who entered divine trances inhaling vapors rising from the chasms beneath the temple floor.",
    folklore_history_th: "นักธรณีวิทยาสมัยใหม่พบว่าวิหารตั้งอยู่บนรอยเลื่อนตัดกันสองจุด ที่ปล่อยก๊าซเอทิลีนและไฮโดรคาร์บอนซึ่งมีฤทธิ์ทำให้เคลิบเคลิ้มและเห็นภาพหลอน",
    folklore_history_en: "Modern geologists confirmed the temple sits over intersecting geological faults emitting ethylene and ethane gases, inducing euphoria and visionary trance states.",
    sound_preset: "drone",
    views_count: 0,
    searchQuery: "Oracle of Delphi mystery documentary",
    wikiQuery: "Delphi Apollo temple"
  },
  {
    id: "pin-leprechaun",
    title_th: "เลปราคอนและเนินดินภูตแฟรี่",
    title_en: "The Leprechaun & Ancient Fairy Raths",
    category: "folklore",
    province_th: "เคาน์ตีแอนทริม (ไอร์แลนด์)",
    province_en: "County Antrim (Ireland)",
    district_th: "เนินเขานูนแฟรี่และป่าไอริชโบราณ",
    district_en: "Glens of Antrim & Fairy Mounds",
    lat: 55.0333,
    lng: -6.1000,
    story_th: "ภูตแคระผู้พิทักษ์ไอร์แลนด์ สวมเสื้อโค้ตเขียวและหมวกปีกกว้าง ช่างทำรองเท้าผู้ชาญฉลาดและหลอกล่อมนุษย์ ผู้เฝ้าไหทองคำที่ซ่อนอยู่ปลายสายรุ้ง หากใครจับตัวได้จะได้รับพร 3 ประการ แต่หากคลาดสายตาเพียงเสี้ยววินาที เขาจะอันตรธานหายไป",
    story_en: "The cunning solitary fae cobbler of Irish lore. Guarding pots of gold hidden at rainbow ends, capturing a Leprechaun earns three wishes, but look away for a single blink and he vanishes into the heather.",
    folklore_history_th: "สืบทอดมาจากเทพเจ้าลุกฮ์ (Lugh) ของชาวเคลต์โบราณ ชาวบ้านในชนบทของไอร์แลนด์ยังคงไม่กล้าตัดต้นไม้หรือทำลายเนินดินภูต (Fairy Raths) เพราะกลัวคำสาปอุบัติเหตุและความโชคร้าย",
    folklore_history_en: "Descended from the Tuatha De Danann deities. Modern Irish roadworks still divert around ancient hawthorn fairy bushes and ringforts to avoid wrathful curses from the fairy realm.",
    sound_preset: "footsteps",
    views_count: 0,
    searchQuery: "Leprechaun Irish folklore fairy mystery documentary",
    wikiQuery: "Leprechaun illustration"
  },
  {
    id: "pin-nuckelavee",
    title_th: "นักคลาวี (อสูรม้าไร้ผิวหนังแห่งหมู่เกาะออร์คนีย์)",
    title_en: "Nuckelavee, Skinless Nightmare of Orkney",
    category: "monster",
    province_th: "หมู่เกาะออร์คนีย์ (สกอตแลนด์)",
    province_en: "Orkney Islands (Scotland)",
    district_th: "ชายฝั่งเกาะสตรอนเซย์",
    district_en: "Stronsay & Sanday Coastlines",
    lat: 59.1500,
    lng: -2.6000,
    story_th: "อสูรกายทะเลที่น่าสะพรึงกลัวที่สุดในตำนานเซลติก ร่างครึ่งคนครึ่งม้าไร้ผิวหนัง มองเห็นกล้ามเนื้อสีแดงสด เส้นเลือดดำ และหัวใจเต้นตุบๆ ลมหายใจของมันเป็นพิษร้ายทำให้พืชผลเหี่ยวเฉาและสัตว์ล้มตาย",
    story_en: "The most malevolent sea demon of Orcadian mythology. A monstrous fusion of man and horse with completely skinless yellow-black musculature and toxic breath that withers crops and rots livestock.",
    folklore_history_th: "เกลียดน้ำจืดเป็นที่สุด ผู้ที่ถูกมันไล่ล่าจะรอดชีวิตได้ก็ต่อเมื่อวิ่งข้ามสะพานหรือลำธารน้ำจืดเท่านั้น เป็นตำนานที่ชาวประมงเกาะออร์คนีย์หวาดกลัวมาแต่โบราณ",
    folklore_history_en: "Pure water is its only vulnerability; fleeing victims can only escape its thundering hooves by jumping across a running freshwater stream which repels the abyssal horror.",
    sound_preset: "growl",
    views_count: 0,
    searchQuery: "Nuckelavee Scottish monster mythology documentary",
    wikiQuery: "Nuckelavee"
  },
  {
    id: "pin-teotihuacan",
    title_th: "เตโอติอัวกาน (นครแห่งทวยเทพและปิรามิดสุริยัน)",
    title_en: "Teotihuacan (City of the Gods & Pyramid of the Sun)",
    category: "place",
    province_th: "รัฐเม็กซิโก (เม็กซิโก)",
    province_en: "State of Mexico (Mexico)",
    district_th: "ถนนแห่งความตาย คัลซาดา เด ลอส มูเอร์โตส",
    district_en: "Avenue of the Dead, San Juan Teotihuacan",
    lat: 19.6925,
    lng: -98.8438,
    story_th: "มหานครโบราณลึกลับที่ไม่มีใครรู้ว่าใครเป็นผู้สร้าง มีมหาปิรามิดสุริยันและปิรามิดจันทราตั้งตระหง่านเรียงตัวตรงตามกลุ่มดาวนายพรานอย่างน่าอัศจรรย์ ชนเผ่าแอซเท็กมาพบเข้าและเชื่อว่าเป็นสถานที่ที่เหล่าทวยเทพสร้างดวงอาทิตย์ดวงใหม่",
    story_en: "An enigmatic pre-Columbian metropolis built with mind-boggling astronomical alignment mimicking Orion's belt. When the Aztecs discovered its abandoned colossal pyramids, they named it the birthplace of the gods.",
    folklore_history_th: "ใต้ปิรามิดมีอุโมงค์ลับที่ค้นพบปรอทเหลวระยิบระยับจำลองแม่น้ำในยมโลก และแร่ไมกาที่กันรังสีความร้อนสูง นำเข้าจากแดนไกลหลายพันกิโลเมตรอย่างเป็นปริศนา",
    folklore_history_en: "Archaeologists unearthed deep subterranean tunnels containing liquid mercury lakes mirroring underworld rivers, alongside sheets of heat-resistant mica sourced from thousands of miles away.",
    sound_preset: "drone",
    views_count: 0,
    searchQuery: "Teotihuacan ancient city mystery documentary",
    wikiQuery: "Teotihuacan Piramide del Sol"
  },
  {
    id: "pin-salem",
    title_th: "การล่าแม่มดแห่งเซเลม (วิญญาณแห่งกิลส์ คอรีย์)",
    title_en: "The Salem Witch Trials (Curse of Giles Corey)",
    category: "ghost",
    province_th: "แมสซาชูเซตส์ (สหรัฐอเมริกา)",
    province_en: "Massachusetts (USA)",
    district_th: "เซเลม เอสเซกซ์เคาน์ตี",
    district_en: "Salem Village & Gallows Hill",
    lat: 42.5195,
    lng: -70.8967,
    story_th: "ในปี 1692 เกิดคลื่นความหวาดกลัวทางศาสนาจนผู้บริสุทธิ์นับร้อยถูกกล่าวหาว่าเป็นแม่มด และถูกแขวนคอสังหารที่เนินกัลโลว์สฮิลล์ ชายชรากิลส์ คอรีย์ ถูกลงทัณฑ์ด้วยการทับด้วยก้อนหินหนักจนสิ้นใจ พร้อมตะโกนคำสาปแช่งใส่เมืองเซเลมก่อนตาย",
    story_en: "The infamous 1692 mass hysteria resulting in the execution of nineteen supposed witches on Gallows Hill. 81-year-old Giles Corey was pressed to death beneath crushing boulders, cursing the town with his dying breath: 'More weight!'",
    folklore_history_th: "เล่ากันว่าวิญญาณของกิลส์ คอรีย์ จะปรากฏตัวใกล้สุสานเซเลมทุกครั้งก่อนที่จะเกิดภัยพิบัติหรือเพลิงไหม้ใหญ่ในเมือง เพื่อทวงถามความอยุติธรรม",
    folklore_history_en: "Ghostly lore says Giles Corey’s specter wanders the Howard Street Cemetery shortly before catastrophic fires and municipal tragedies struck Salem across the next two centuries.",
    sound_preset: "screams",
    views_count: 0,
    searchQuery: "Salem Witch Trials documentary mystery",
    wikiQuery: "Salem Witch Trials court"
  },
  {
    id: "pin-gargoyle",
    title_th: "การ์กอยล์แห่งน็อทร์-ดาม (ผู้พิทักษ์หินมีชีวิต)",
    title_en: "The Gargoyles of Notre-Dame (Living Stone Sentinels)",
    category: "folklore",
    province_th: "ปารีส (ฝรั่งเศส)",
    province_en: "Paris (France)",
    district_th: "เกาะอีลเดอลาซีเต ริมแม่น้ำแซน",
    district_en: "Ile de la Cite, Seine River",
    lat: 48.8530,
    lng: 2.3499,
    story_th: "รูปสลักอสูรหินหน้าตาดุร้ายที่เกาะอยู่ตามยอดมหาวิหารน็อทร์-ดาม นอกจากทำหน้าที่ระบายน้ำฝนแล้ว ตำนานเมืองปารีสยังเล่าว่า ในยามราตรีที่ฟ้าคะนอง เหล่าการ์กอยล์จะลืมตาและมีชีวิตเพื่อออกล่าวิญญาณชั่วร้ายที่คิดทำลายเมือง",
    story_en: "The grotesque stone chimeras and gargoyles perched atop Notre-Dame Cathedral. Beyond diverting rainwater, French folklore whispered that on thunderstorm nights, these monstrous beasts awaken to repel dark demonic forces.",
    folklore_history_th: "มีที่มาจากตำนานสัตว์ประหลาด 'ลา การ์กุย' (La Gargouille) พญามังกรพ่นน้ำแห่งแม่น้ำแซน ที่ถูกสังหารโดยนักบุญโรมานุส แล้วนำหัวมาแขวนประจานบนกำแพงเมือง",
    folklore_history_en: "Rooted in the legend of La Gargouille, a river monster slain by Saint Romanus whose charred head was mounted on the town walls to terrify evil spirits away from sacred grounds.",
    sound_preset: "whisper",
    views_count: 0,
    searchQuery: "Notre Dame gargoyles mystery folklore documentary",
    wikiQuery: "Gargoyle Notre Dame de Paris"
  },
  {
    id: "pin-alexandria",
    title_th: "หอสมุดและประภาคารฟาโรสแห่งอเล็กซานเดรีย",
    title_en: "The Lost Library & Lighthouse of Alexandria",
    category: "place",
    province_th: "อเล็กซานเดรีย (อียิปต์)",
    province_en: "Alexandria (Egypt)",
    district_th: "แหลมเคตเบย์และอ่าวอเล็กซานเดรีย",
    district_en: "Qaitbay Peninsula, Eastern Harbour",
    lat: 31.2156,
    lng: 29.8853,
    story_th: "ศูนย์กลางขุมทรัพย์ภูมิปัญญาที่ยิ่งใหญ่ที่สุดของมนุษยชาติในโลกยุคโบราณที่เก็บรวบรวมม้วนคัมภีร์กว่าแสนเล่มก่อนจะถูกเพลิงเผาผลาญจนหายสาบสูญ และประภาคารฟาโรส 1 ใน 7 สิ่งมหัศจรรย์ที่ซากปรักหักพังจมอยู่ใต้ทะเล",
    story_en: "The pinnacle of ancient human wisdom holding hundreds of thousands of papyrus scrolls before its tragic destruction in flames. Near it stood the colossal Lighthouse of Pharos, now submerged beneath harbor waters.",
    folklore_history_th: "นักดำน้ำโบราณคดีพบรูปปั้นสฟิงซ์และบล็อกหินประภาคารยักษ์จมอยู่ใต้ก้นทะเลอ่าวอเล็กซานเดรีย พร้อมตำนานคัมภีร์เวทมนตร์โบราณที่อาจรอดพ้นจากกองเพลิง",
    folklore_history_en: "Marine archaeologists have recovered massive granite blocks and sphinxes from the bay, fueling legends that forbidden esoteric scrolls were rescued into hidden desert vaults.",
    sound_preset: "drone",
    views_count: 0,
    searchQuery: "Library of Alexandria lost lighthouse documentary",
    wikiQuery: "Pharos of Alexandria"
  },
  {
    id: "pin-gobeklitepe",
    title_th: "เกอเบกลี เทเป (วิหารหินมนุษย์ยุคแรกเริ่มแห่งอนาโตเลีย)",
    title_en: "Göbekli Tepe, The World's Oldest Megalithic Temple",
    category: "place",
    province_th: "ชานลึอูร์ฟา (ตุรกี)",
    province_en: "Sanliurfa (Turkey)",
    district_th: "เนินเขาโอวาเจก",
    district_en: "Ovacik, Southeastern Anatolia",
    lat: 37.2231,
    lng: 38.9225,
    story_th: "วิหารหินเสารูปตัว T ขนาดมหึมาสลักลายสิงสาราสัตว์อย่างประณีต มีอายุเก่าแก่กว่า 11,500 ปี สร้างขึ้นก่อนยุคเกษตรกรรมและเครื่องปั้นดินเผา ท้าทายประวัติศาสตร์อารยธรรมมนุษย์ทั้งหมดที่เคยจดบันทึกไว้",
    story_en: "The astonishing megalithic sanctuary of massive T-shaped stone pillars carved with lions, scorpions, and vultures. Dating to 9500 BCE, it predates Stonehenge and the Pyramids by over six millennia.",
    folklore_history_th: "สิ่งที่ลึกลับที่สุดคือผู้สร้างไม่ได้ละทิ้งวิหารนี้ตามกาลเวลา แต่กลับจงใจถมดินกลบวิหารทั้งหลังอย่างตั้งใจราวกับต้องการซ่อนมันไว้จากคนรุ่นหลัง",
    folklore_history_en: "Most baffling to archaeologists is that its ancient hunter-gatherer builders intentionally backfilled and buried the entire monumental complex under tons of earth before walking away.",
    sound_preset: "drone",
    views_count: 0,
    searchQuery: "Gobekli Tepe oldest temple mystery documentary",
    wikiQuery: "Gobekli Tepe pillars"
  },
  {
    id: "pin-dbcooper",
    title_th: "ดี.บี. คูเปอร์ (จอมโจรกระโดดร่มล่องหนกลางพายุ)",
    title_en: "The Mystery of D.B. Cooper (The Vanishing Skyjacker)",
    category: "urban_legend",
    province_th: "วอชิงตัน (สหรัฐอเมริกา)",
    province_en: "Washington State (USA)",
    district_th: "ป่าทึบริมแม่น้ำลูอิส เทือกเขาคาสเคด",
    district_en: "Ariel & Lewis River Valley, Cascade Range",
    lat: 45.9553,
    lng: -122.5818,
    story_th: "วันที่ 24 พฤศจิกายน 1971 ชายในชุดสูทดำแว่นกันแดดจี้เครื่องบินโบอิ้ง 727 เรียกค่าไถ่ 200,000 ดอลลาร์ จากนั้นกระโดดร่มลงไปกลางพายุฝนอันมืดมิดเหนือป่าทึบของวอชิงตัน และไม่มีใครพบร่องรอยของเขาอีกเลย",
    story_en: "On Thanksgiving Eve 1971, a calm gentleman calling himself Dan Cooper hijacked a Boeing 727, extorted $200,000 in cash, and parachuted into freezing rain and blackness over rugged Cascade wilderness, vanishing forever.",
    folklore_history_th: "คดีจารกรรมบนน่านฟ้าเพียงคดีเดียวในประวัติศาสตร์สหรัฐฯ ที่ยังไขไม่สำเร็จ แม้เอฟบีไอจะระดมกำลังค้นหานานนับสิบปี พบเพียงมัดเงินเปื่อยยุ่ยบางส่วนริมแม่น้ำโคลัมเบีย",
    folklore_history_en: "The only unsolved skyjacking in commercial aviation history. Despite thousands of FBI interviews and the 1980 discovery of decomposing ransom bundles on a beach, his fate remains an unsolved enigma.",
    sound_preset: "wind",
    views_count: 0,
    searchQuery: "DB Cooper skyjacking mystery FBI documentary",
    wikiQuery: "DB Cooper sketch"
  },
  {
    id: "pin-yowie",
    title_th: "โยวี (อสูรวานรยักษ์แห่งเทือกเขาบลูเมาน์เทนส์)",
    title_en: "The Yowie, Australia’s Bigfoot of the Blue Mountains",
    category: "cryptid",
    province_th: "นิวเซาท์เวลส์ (ออสเตรเลีย)",
    province_en: "New South Wales (Australia)",
    district_th: "ป่ายูคาลิปตัสโบราณ บลูเมาน์เทนส์",
    district_en: "Blue Mountains National Park & Katoomba",
    lat: -33.7149,
    lng: 150.3114,
    story_th: "สิ่งมีชีวิตลึกลับคล้ายลิงขนาดใหญ่ สูงกว่า 2.5 - 3 เมตร ขนดกสีน้ำตาลแดง ดวงตาสีอำพันเรืองแสง มีกลิ่นสาบรุนแรง อาศัยอยู่ในหุบเขาลึกและป่ายูคาลิปตัสของออสเตรเลีย",
    story_en: "The Australian hominid cryptid of the dense Blue Mountains bushland. Standing up to 10 feet tall with shaggy auburn hair, glowing amber eyes, and a terrifying sulfuric stench that freezes blood.",
    folklore_history_th: "ชาวอะบอริจินมีเรื่องเล่าเกี่ยวกับ 'ยูริ' หรือ 'ยาฮู' มาแต่โบราณ และมีรายงานการเผชิญหน้าจากคนตัดไม้และนักสำรวจอังกฤษตั้งแต่ช่วงปี 1795 เป็นต้นมา",
    folklore_history_en: "Rooted in ancient Indigenous dreamtime accounts of the 'Yaho'. British colonial newspapers documented dozens of frightening close encounters by timber cutters throughout the 19th century.",
    sound_preset: "growl",
    views_count: 0,
    searchQuery: "Australian Yowie cryptid mystery documentary",
    wikiQuery: "Yowie statue Kilcoy"
  },
  {
    id: "pin-kumanthong",
    title_th: "กุมารทอง (ไสยศาสตร์วิญญาณเด็กทองคำ)",
    title_en: "Kuman Thong (The Golden Infant Necromancy)",
    category: "ghost",
    province_th: "พระนครศรีอยุธยา (ไทย)",
    province_en: "Ayutthaya (Thailand)",
    district_th: "ลานวัดโบราณริมแม่น้ำเจ้าพระยา",
    district_en: "Ancient Temple Ruins, Chao Phraya Basin",
    lat: 14.3532,
    lng: 100.5684,
    story_th: "ศาสตร์ลี้ลับแห่งไสยเวทไทยแต่โบราณ การปลุกเสกวิญญาณเด็กด้วยมนต์คาถาและลงรักปิดทอง เลี้ยงดูด้วยน้ำแดงและขนมหวาน เชื่อกันว่ากุมารทองจะคอยกระซิบเตือนภัย คุ้มครองเรือน และนำโชคลาภมาสู่ผู้บูชา",
    story_en: "An ancient Thai occult necromancy tradition honoring consecrated child spirits lacquered in gold leaf. Fed with sweet red syrup offerings, they are believed to whisper premonitions, protect homes, and bestow immense fortune.",
    folklore_history_th: "ปรากฏในวรรณคดีขุนช้างขุนแผน ขุนแผนได้ผ่าท้องนางบัวคลี่นำทารกไปย่างไฟในอุโบสถพร้อมบริกรรมคาถาจนกลายเป็นกุมารทองตนแรกแห่งสยาม",
    folklore_history_en: "Immortalized in the 17th-century epic Khun Chang Khun Phaen, where the sorcerer-warrior Khun Phaen roasted the spirit fetus over consecrated coals to birth a formidable spectral protector.",
    sound_preset: "whisper",
    views_count: 0,
    searchQuery: "Kuman Thong Thai occult ghost documentary",
    wikiQuery: "Kuman Thong statue"
  },
  {
    id: "pin-popobawa",
    title_th: "โปโปบาวา (ปีศาจเงาค้างคาวแห่งเกาะแซนซิบาร์)",
    title_en: "Popobawa, The Shapeshifting Shadow of Zanzibar",
    category: "monster",
    province_th: "แซนซิบาร์ (แทนซาเนีย)",
    province_en: "Zanzibar (Tanzania)",
    district_th: "เกาะเพมบาและตรอกหินสโตนทาวน์",
    district_en: "Pemba Island & Stone Town",
    lat: -5.3000,
    lng: 39.7000,
    story_th: "อสูรกายรูปร่างคล้ายค้างคาวยักษ์ตาเดียวที่สามารถแปลงกายเป็นมนุษย์หรือเงาดำได้ เข้าโจมตีและทำร้ายเหยื่อในห้องนอนยามค่ำคืน สร้างความหวาดผวาจนชาวบ้านต้องออกมานอนรวมกันรอบกองไฟนอกบ้าน",
    story_en: "A terrifying Swahili one-eyed shapeshifting shadow demon with bat-like wings. Striking sleeping victims in nocturnal bedroom ambushes, its appearances trigger mass panic where entire villages sleep outdoors.",
    folklore_history_th: "เริ่มระบาดครั้งแรกบนเกาะเพมบาในปี 1965 และปะทุขึ้นอีกครั้งในปี 1995 เชื่อมโยงกับความเชื่อเรื่องญินชั่วร้ายและการแก้แค้นของหมอผีพื้นเมือง",
    folklore_history_en: "First documented on Pemba Island following political riots in 1965, resurgence outbreaks occurred in 1995. Folklorists connect it to malevolent Djinn folklore and collective socio-political stress.",
    sound_preset: "screams",
    views_count: 0,
    searchQuery: "Popobawa Zanzibar shadow monster mystery documentary",
    wikiQuery: "Bat shadow silhouette"
  },
  {
    id: "pin-qilin",
    title_th: "กิเลน (สัตว์เทวะมงคลแห่งเขาไท่ซาน)",
    title_en: "The Qilin (Celestial Chimera of Mount Tai)",
    category: "folklore",
    province_th: "ชานตง (จีน)",
    province_en: "Shandong (China)",
    district_th: "ยอดเขาศักดิ์สิทธิ์ไท่ซาน",
    district_en: "Mount Tai Sacred Summit, Tai'an",
    lat: 36.2558,
    lng: 117.1065,
    story_th: "หนึ่งในสี่สัตว์ศักดิ์สิทธิ์ในตำนานจีน มีหัวเป็นมังกร มีเขาเดียว ลำตัวเป็นกวาง เกล็ดประกายมังกร และหางเป็นวัว เดินบนผิวน้ำและยอดหญ้าโดยไม่ทำให้ต้นหญ้าชอกช้ำ จะปรากฏตัวเฉพาะในยุคที่ผู้ปกครองทรงธรรม",
    story_en: "The revered Chinese mythical chimera possessing the head of a dragon, antlers, scaled deer body, and ox tail. Walking so gently it does not bend a blade of grass, its appearance heralds the birth of sages and righteous emperors.",
    folklore_history_th: "บันทึกในประวัติศาสตร์จีนว่ากิเลนเคยปรากฏตัวเมื่อครั้งที่ขงจื๊อถือกำเนิด และเมื่อกษัตริย์ในราชวงศ์หมิงได้รับของขวัญเป็นยีราฟจากแอฟริกา ก็เชื่อว่าเป็นกิเลนตัวจริงที่ลงมาสู่โลกมนุษย์",
    folklore_history_en: "Chronicled to have appeared prior to the birth of Confucius. During the Ming dynasty, the arrival of African giraffes via explorer Zheng He was celebrated as living proof of the celestial Qilin.",
    sound_preset: "wind",
    views_count: 0,
    searchQuery: "Qilin Chinese mythical beast documentary",
    wikiQuery: "Qilin statue Forbidden City"
  },
  {
    id: "pin-garuda",
    title_th: "พญาครุฑ (มหาเวนไตยผู้ครองนภากาศ)",
    title_en: "Garuda, King of Birds & Master of the Skies",
    category: "monster",
    province_th: "บาหลี (อินโดนีเซีย)",
    province_en: "Bali (Indonesia)",
    district_th: "อุทยานครุฑวิษณุเคนจานา",
    district_en: "Garuda Wisnu Kencana, Jimbaran",
    lat: -8.8105,
    lng: 115.1668,
    story_th: "พญานกในเทวตำนานฮินดูและพุทธ ผู้มีปีกกว้างบดบังแสงอาทิตย์ พละกำลังมหาศาลขนาดโบกปีกเพียงครั้งเดียวก็พัดต้นไม้ล้มระเนระนาด เป็นพาหนะของพระวิษณุและเป็นศัตรูคู่อาฆาตของเผ่าพันธุ์พญานาค",
    story_en: "The colossal divine sun-bird and lord of the avian realm in Hindu and Buddhist cosmology. With wings spanning the horizon capable of halting hurricane winds, he serves as Lord Vishnu's mount and eternal nemesis to the Naga serpents.",
    folklore_history_th: "ได้รับการยกย่องเป็นตราแผ่นดินของทั้งไทยและอินโดนีเซีย สัญลักษณ์แห่งอำนาจ ความยุติธรรม ความกตัญญูที่ยอมบุกสวรรค์เพื่อแย่งชิงน้ำอมฤตไปไถ่ชีวิตมารดา",
    folklore_history_en: "Venerated across Southeast Asia and adopted as the national emblem of Thailand and Indonesia. Symbolizing righteousness, sovereign majesty, and filial devotion for raiding heaven to liberate his enslaved mother.",
    sound_preset: "growl",
    views_count: 0,
    searchQuery: "Garuda mythology Hindu documentary",
    wikiQuery: "Garuda statue Bali"
  },
  {
    id: "pin-ouija",
    title_th: "กระดานอุยจา (ประตูสื่อวิญญาณแห่งโลกมืด)",
    title_en: "The Ouija Board (The Talking Spirit Portal)",
    category: "urban_legend",
    province_th: "แมริแลนด์ (สหรัฐอเมริกา)",
    province_en: "Maryland (USA)",
    district_th: "บัลติมอร์",
    district_en: "Baltimore, Charles Street",
    lat: 39.2904,
    lng: -76.6122,
    story_th: "กระดานไม้สลักตัวอักษรและแผ่นแพลนเชตต์ที่เคลื่อนที่ได้เองโดยไม่มีแรงผลัก นิยมใช้ในพิธีทรงเจ้าเพื่อติดต่อคนตาย แต่หากฝ่าฝืนกฎ เช่น ไม่เอ่ยคำว่า Goodbye หรือเล่นคนเดียว อาจเป็นการเชื้อเชิญปีศาจร้ายเข้าสู่ตัว",
    story_en: "The iconic talking spirit board patented in 1890 Baltimore. Guided by unseen kinetic energies or the ideomotor effect, users contact the departed, but urban legends warn that breaking ritual rules invites demonic possession.",
    folklore_history_th: "คิดค้นขึ้นในยุคที่กระแส Spiritualism รุ่งเรืองหลังสงครามกลางเมืองอเมริกา และกลายเป็นแรงบันดาลใจให้คดีผีสิงชื่อดังของโรแลนด์ โด ในปี 1949 ที่ถูกนำไปสร้างเป็นภาพยนตร์ The Exorcist",
    folklore_history_en: "Patented by Charles Kennard and Elijah Bond during America's post-Civil War spiritualist revival. It famously sparked the 1949 Maryland possession case of Roland Doe which inspired The Exorcist.",
    sound_preset: "whisper",
    views_count: 0,
    searchQuery: "Ouija board history occult mystery documentary",
    wikiQuery: "Ouija board vintage"
  },
  {
    id: "pin-phoenix",
    title_th: "นกฟีนิกซ์ (วิหคเพลิงผู้ฟื้นคืนชีพจากเถ้าถ่าน)",
    title_en: "The Phoenix (Bennu, The Immortal Firebird)",
    category: "monster",
    province_th: "ไคโร (อียิปต์)",
    province_en: "Cairo (Egypt)",
    district_th: "เฮลิโอโพลิส เมืองแห่งสุริยเทพ",
    district_en: "Heliopolis, Ancient Sun Sanctuary",
    lat: 30.1444,
    lng: 31.3283,
    story_th: "วิหคเพลิงอมตะผู้มีขนสีแดงเพลิงแซมทองคำ เมื่ออายุขัยครบ 500 ปี มันจะสร้างรังด้วยกิ่งไม้หอมและจุดไฟเผาตัวเองจนมอดไหม้เป็นเถ้าถ่าน ก่อนจะฟื้นคืนชีพกลับมาเป็นนกฟีนิกซ์ตัวใหม่อันสง่างามและเยาว์วัยอีกครั้ง",
    story_en: "The legendary immortal firebird crowned in plumage of crimson and shimmering gold. Every 500 years, it constructs a pyre of fragrant cinnamon and myrrh, ignites in radiant flames, and rises reincarnated from its own ashes.",
    folklore_history_th: "มีรากฐานมาจากนก 'เบนนู' (Bennu) วิหคสุริยะของชาวอียิปต์โบราณ เป็นสัญลักษณ์แห่งการกำเนิดใหม่ ความเป็นอมตะ และแสงตะวันที่ไม่มีวันดับสูญ",
    folklore_history_en: "Derived from the ancient Egyptian Bennu heron bird associated with the sun god Ra and Osiris. It remains civilization's most enduring emblem of resurrection and perpetual rebirth.",
    sound_preset: "screams",
    views_count: 0,
    searchQuery: "Phoenix Bennu mythical firebird documentary",
    wikiQuery: "Phoenix myth illustration"
  }
];

async function run() {
  console.log(`Starting generation for ${NEW_25_PINS.length} new pins...`);
  const finalPins = [];
  const entitiesDir = path.resolve('public/entities');

  for (let i = 0; i < NEW_25_PINS.length; i++) {
    const p = NEW_25_PINS[i];
    console.log(`\n[${i+1}/${NEW_25_PINS.length}] Processing ${p.id} (${p.title_en})...`);

    // 1. Download image
    const imgFile = `${p.id}.jpg`;
    const imgPath = path.join(entitiesDir, imgFile);
    if (!fs.existsSync(imgPath)) {
      console.log(`Downloading artwork for ${p.id}...`);
      const ok = await downloadWikiImage(p.wikiQuery, imgPath);
      if (!ok) {
        // Fallback: copy an existing entity image as base
        console.log(`Fallback image copy for ${p.id}`);
        fs.copyFileSync(path.join(entitiesDir, 'pin-dracula.jpg'), imgPath);
      }
    } else {
      console.log(`Image already exists: ${imgPath}`);
    }

    // 2. Find YouTube video
    console.log(`Finding embeddable YouTube video for ${p.id}...`);
    const yt = await findWorkingYoutube(p.searchQuery);
    console.log(` -> Found: ${yt.url} (${yt.title})`);

    const gallery = [
      {
        type: "image",
        url: `/entities/${imgFile}`,
        title: p.title_th
      },
      {
        type: "youtube",
        url: yt.url,
        title: yt.title,
        thumbnail: `/entities/${imgFile}`
      }
    ];

    const pinObj = {
      id: p.id,
      title_th: p.title_th,
      title_en: p.title_en,
      category: p.category,
      province_th: p.province_th,
      province_en: p.province_en,
      district_th: p.district_th,
      district_en: p.district_en,
      lat: p.lat,
      lng: p.lng,
      story_th: p.story_th,
      story_en: p.story_en,
      folklore_history_th: p.folklore_history_th,
      folklore_history_en: p.folklore_history_en,
      image_url: `/entities/${imgFile}`,
      sound_preset: p.sound_preset,
      views_count: 0,
      gallery_media: gallery
    };

    finalPins.push(pinObj);
  }

  // 3. Append to seedData.ts
  console.log('\nAppending new pins to seedData.ts...');
  const seedPath = path.resolve('src/data/seedData.ts');
  const seedContent = fs.readFileSync(seedPath, 'utf8');

  // Insert before the closing '];'
  const lastBracket = seedContent.lastIndexOf('];');
  if (lastBracket === -1) {
    throw new Error('Could not find closing bracket in seedData.ts');
  }

  const jsonSnippet = finalPins.map(p => '  ' + JSON.stringify(p, null, 2).replace(/\n/g, '\n  ')).join(',\n');
  const updatedSeed = seedContent.slice(0, lastBracket).trimEnd() + ',\n' + jsonSnippet + '\n];\n';
  fs.writeFileSync(seedPath, updatedSeed, 'utf8');
  console.log(`Updated seedData.ts with ${finalPins.length} new pins!`);

  // 4. Generate SQL for Cloudflare D1
  console.log('Generating insert_batch25.sql...');
  let sql = '';
  for (const p of finalPins) {
    const esc = (s) => (s || '').replace(/'/g, "''");
    const galleryJson = esc(JSON.stringify(p.gallery_media));
    sql += `INSERT OR REPLACE INTO ghost_pins (id, title_th, title_en, category, province_th, province_en, district_th, district_en, lat, lng, story_th, story_en, folklore_history_th, folklore_history_en, image_url, sound_preset, views_count, gallery_media, created_at, updated_at) VALUES ('${p.id}', '${esc(p.title_th)}', '${esc(p.title_en)}', '${p.category}', '${esc(p.province_th)}', '${esc(p.province_en)}', '${esc(p.district_th)}', '${esc(p.district_en)}', ${p.lat}, ${p.lng}, '${esc(p.story_th)}', '${esc(p.story_en)}', '${esc(p.folklore_history_th)}', '${esc(p.folklore_history_en)}', '${p.image_url}', '${p.sound_preset}', 0, '${galleryJson}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n`;
  }
  fs.writeFileSync('../insert_batch25.sql', sql, 'utf8');
  console.log('insert_batch25.sql generated successfully.');
}

run().catch(console.error);

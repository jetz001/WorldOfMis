const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'WorldOfMys/2.0 (https://worldofmys.pages.dev; admin@worldofmys.com)' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, text: data }); }
      });
    }).on('error', () => resolve({ status: 500 }));
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'WorldOfMys/2.0 (https://worldofmys.pages.dev; admin@worldofmys.com)' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

function fetchHtml(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': 'CONSENT=YES+cb.20210328-17-p0.en+FX+410'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchHtml(res.headers.location).then(resolve);
      }
      let html = '';
      res.on('data', c => html += c);
      res.on('end', () => resolve(html));
    }).on('error', () => resolve(''));
  });
}

function verifyEmbeddable(videoId) {
  return new Promise((resolve) => {
    const oembedUrl = 'https://www.youtube.com/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + videoId) + '&format=json';
    https.get(oembedUrl, (res) => {
      if (res.statusCode === 200) {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          try {
            const j = JSON.parse(d);
            resolve({ videoId, title: j.title, embeddable: true });
          } catch (e) { resolve({ videoId, embeddable: false }); }
        });
      } else {
        resolve({ videoId, embeddable: false });
      }
    }).on('error', () => resolve({ videoId, embeddable: false }));
  });
}

async function findEmbeddableVideo(query) {
  await sleep(400);
  const ytHtml = await fetchHtml('https://www.youtube.com/results?search_query=' + encodeURIComponent(query));
  const vids = [...new Set([...ytHtml.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]))];
  for (const vid of vids.slice(0, 12)) {
    if (vid === 'AmbyfczXkjU') continue;
    const check = await verifyEmbeddable(vid);
    if (check.embeddable) {
      return {
        url: 'https://www.youtube.com/watch?v=' + check.videoId,
        title: check.title
      };
    }
  }
  return {
    url: 'https://www.youtube.com/watch?v=AmbyfczXkjU',
    title: 'World Folklore Documentary'
  };
}

async function fetchWikiThumb(wikiCandidates, destPath, existingHashes) {
  for (const title of wikiCandidates) {
    try {
      const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800&redirects=1`;
      const res = await fetchJson(apiUrl);
      if (res.status === 200 && res.data?.query?.pages) {
        const page = Object.values(res.data.query.pages)[0];
        if (page?.thumbnail?.source) {
          await downloadFile(page.thumbnail.source, destPath);
          const buf = fs.readFileSync(destPath);
          const hash = crypto.createHash('md5').update(buf).digest('hex');
          if (buf.length > 2500 && !existingHashes.has(hash)) {
            existingHashes.add(hash);
            console.log(` -> Downloaded unique wiki thumb (${title}) [${(buf.length / 1024).toFixed(0)} KB]`);
            return true;
          }
        }
      }
    } catch (e) {
      // try next
    }
  }
  return false;
}

const FINAL_6 = [
  {
    id: "pin-ninki-nanka",
    title_th: "นินกินันคา (มังกรมรณะแห่งลุ่มแม่น้ำแกมเบีย)",
    title_en: "Ninki Nanka: The Deadly Swamp Dragon of the River Gambia",
    category: "cryptozoology",
    province_th: "เซ็นทรัลริเวอร์",
    province_en: "Central River Division",
    district_th: "ลุ่มแม่น้ำแกมเบีย",
    district_en: "Gambia River Basin",
    lat: 13.5333,
    lng: -14.7667,
    story_th: "นินกินันคา (Ninki Nanka) คือสัตว์ประหลาดในตำนานแห่งแอฟริกาตะวันตก โดยเฉพาะในแกมเบียและเซเนกัล มีลำตัวคล้ายจระเข้ผสมงูยักษ์ความยาวกว่า 30-50 ฟุต บนหัวมีหงอนหรือเขาคล้ายมังกร อาศัยอยู่ในป่าชายเลนและหนองน้ำลึกของแม่น้ำแกมเบีย ชาวมันดินกา (Mandinka) เชื่อว่าใครก็ตามที่ได้สบตากับนินกินันคาจะล้มป่วยอย่างรุนแรง เป็นบ้า และเสียชีวิตลงภายในเวลาไม่กี่วัน",
    story_en: "Ninki Nanka is a legendary reptilian cryptid feared throughout West Africa, particularly along the Gambia River. Described by the Mandinka people as a swamp-dwelling dragon or crested aquatic serpent up to 50 feet long, it is considered lethally ominous: merely catching sight of it is said to trigger severe madness and inevitable death within days.",
    folklore_history_th: "ตำนานนินกินันคาถูกนำมาใช้อธิบายโรคระบาดในหนองน้ำ เช่น มาลาเรียและไข้เลือดออก และเตือนไม่ให้เด็กๆ เข้าไปเล่นน้ำในป่าชายเลนที่มีจระเข้ชุกชุม ในปี 2006 ทีมนักสัตววิทยา 'Centre for Fortean Zoology' ได้จัดทริปสำรวจแม่น้ำแกมเบียเพื่อตามล่าหานินกินันคา",
    folklore_history_en: "The Ninki Nanka myth historically discouraged children and fishermen from entering crocodile-infested mangrove swamps while providing a cultural framework for sudden swamp fevers. In 2006, an expedition by the Centre for Fortean Zoology traveled to the Gambia to investigate eyewitness claims.",
    sound_preset: "wind_howl",
    wikiCandidates: ["Ninki_Nanka", "Gambia_River", "Mandinka_people"],
    videoQuery: "Ninki Nanka cryptid dragon Gambia River"
  },
  {
    id: "pin-nishi-dak",
    title_th: "นิชิดัก (วิญญาณเสียงเพรียกแห่งความตายในเบงกอล)",
    title_en: "Nishi Dak: The Deadly Night-Caller Ghost of Bengal",
    category: "ghost",
    province_th: "เบงกอลตะวันตก",
    province_en: "West Bengal",
    district_th: "ป่าชายเลนซุนดาร์บันส์",
    district_en: "Sundarbans",
    lat: 21.9497,
    lng: 89.1833,
    story_th: "นิชิดัก (Nishi Dak มีความหมายว่า 'เสียงเรียกแห่งราตรี') คือวิญญาณร้ายในความเชื่อของชาวเบงกอล (อินเดียและบังกลาเทศ) นิชิมักจะออกล่าเหยื่อยามดึกสงัดด้วยการส่งเสียงเรียกชื่อของคนในบ้าน โดยเลียนแบบน้ำเสียงของคนรักหรือญาติสนิทอย่างแนบเนียน หากเหยื่อขานรับหรือเปิดประตูเดินตามเสียงออกไป จะถูกสะกดจิตให้เดินลึกเข้าไปในป่าหนองน้ำและหายสาบสูญไปตลอดกาล กฎเหล็กของชาวเบงกอลคือ 'ห้ามขานรับเสียงเรียกในเวลากลางคืนหากไม่มีการเรียกซ้ำอย่างน้อยสามครั้ง' เพราะนิชิไม่สามารถเรียกชื่อเกินสองครั้งได้",
    story_en: "Nishi Dak ('The Night Call') is a terrifying nocturnal phantom in Bengali folklore across West Bengal and Bangladesh. It hunts by calling a sleeping victim's name in the pitch dark, perfectly mimicking the voice of a beloved mother, spouse, or friend. Mesmerized victims are led into dense mangrove swamps or deep rivers to vanish forever. Folk tradition dictates never answering a nocturnal call unless the caller repeats the name three times, as a Nishi can only call twice.",
    folklore_history_th: "ความเชื่อเรื่องนิชิดักแพร่หลายอย่างมากในแถบป่าโกงกางซุนดาร์บันส์ ซึ่งเป็นถิ่นอาศัยของเสือโคร่งเบงกอลและงูพิษ โดยนิทานเรื่องนี้ช่วยป้องกันไม่ให้คนในครอบครัวเดินออกจากบ้านในเวลากลางคืนซึ่งอาจตกเป็นเหยื่อของสัตว์ร้าย",
    folklore_history_en: "Originating in the wild Sundarbans mangrove tiger delta, the Nishi superstition served as an effective life-saving taboo preventing rural residents from wandering outside into the clutches of nocturnal man-eating tigers and venomous vipers.",
    sound_preset: "whispering_ghosts",
    wikiCandidates: ["Ghosts_in_Bengali_culture", "Sundarbans", "West_Bengal"],
    videoQuery: "Nishi Dak Bengali ghost story night caller"
  },
  {
    id: "pin-guiche",
    title_th: "กุ่ยเช่อ (วิหคปีศาจเก้าหัวแห่งแคว้นฉู่โบราณ)",
    title_en: "Guiche: The Nine-Headed Ghost Bird of Ancient Chu",
    category: "demonic",
    province_th: "หูเป่ย์",
    province_en: "Hubei",
    district_th: "จิงโจว",
    district_en: "Jingzhou",
    lat: 30.3352,
    lng: 112.2397,
    story_th: "กุ่ยเช่อ (Guiche หรือ นกเก้าหัว) คือวิหคปีศาจโบราณในคติชนวิทยาของจีน มีลำตัวคล้ายนกเป็ดน้ำหรือนกเค้าแมวสีแดงก่ำ แต่มีหัวถึง 9 หัว และมีรอยแผลที่คอหัวที่สิบซึ่งมีเลือดไหลหยดอยู่ตลอดเวลา เชื่อกันว่าเลือดของมันถูกหมาสวรรค์กัดขาดในอดีต เมื่อกุ่ยเช่อบินผ่านหลังคาบ้านของผู้ใดในคืนเดือนมืดและหยดเลือดลงบนเสื้อผ้า วิญญาณของคนในบ้านนั้นจะถูกช่วงชิงไป ทำให้ชาวบ้านโบราณต้องดับไฟและปล่อยสุนัขเห่าเพื่อขับไล่",
    story_en: "The Guiche ('Ghost Carriage' or Nine-Headed Bird) is an ominous avian demon originating in ancient Chu state mythology (modern Hubei and Hunan). Possessing nine heads and a blood-dripping tenth neck where a head was bitten off by a celestial hound, it flies through nocturnal skies. If its cursed blood drops onto clothes drying outdoors, it steals the souls of the inhabitants, prompting ancient villagers to extinguish lanterns and unleash barking dogs to chase it away.",
    folklore_history_th: "บันทึกเรื่องนกเก้าหัวปรากฏในคัมภีร์ซานไห่จิง (Shan Hai Jing) และวรรณกรรมสมัยราชวงศ์ถังและซ่ง ในสุภาษิตจีนมีคำกล่าวว่า 'บนฟ้ามีนกเก้าหัว บนดินมีชาวหูเป่ย์' ซึ่งสะท้อนความเฉลียวฉลาดและจิตวิญญาณแห่งวัฒนธรรมฉู่โบราณ",
    folklore_history_en: "Codified in the 'Classic of Mountains and Seas' and Tang Dynasty folklore collections, the Nine-Headed Bird remains an enduring emblem in central China, immortalized in the famous Chinese idiom comparing the quick wit of Hubei locals to the nine heads of the mythical bird.",
    sound_preset: "drone_dark",
    wikiCandidates: ["Jingzhou", "Chu_(state)", "Classic_of_Mountains_and_Seas"],
    videoQuery: "Nine headed bird Chinese mythology Shan Hai Jing"
  },
  {
    id: "pin-shambhala-gate",
    title_th: "ประตูลี้ลับแห่งชัมบาลา (แดนพุทธทิพย์และพลังสนามแม่เหล็กแห่งโกบี)",
    title_en: "The Secret Gate of Shambhala: The Energy Nexus of the Eastern Gobi",
    category: "folklore",
    province_th: "ดอร์โนโกวิ",
    province_en: "Dornogovi",
    district_th: "อารามคามาริน คีด",
    district_en: "Khamar Monastery",
    lat: 44.6000,
    lng: 109.9167,
    story_th: "ในทะเลทรายโกบีตะวันออก มีสถานที่ลี้ลับที่เรียกว่า 'ชัมบาลาแห่งมองโกเลีย' ก่อตั้งขึ้นโดย ดันซานราฟจา (Danzanravjaa) ปราชญ์ลามะผู้ทรงอภิญญาในศตวรรษที่ 19 เชื่อกันว่าบริเวณนี้เป็นศูนย์รวมพลังงานสนามแม่เหล็กและพลังจักรวาลที่เชื่อมต่อกับอาณาจักรชัมบาลา (Shambhala) ในมิติคู่ขนาน ผู้แสวงบุญจากทั่วโลกเดินทางมานอนแนบแผ่นดินและทำสมาธิภายในวงล้อมสถูป 108 องค์เพื่อชำระล้างจิตวิญญาณและรับพลังบำบัดรักษาโรค",
    story_en: "Nestled in the eastern Gobi Desert near Khamar Monastery lies the legendary Energy Center of Northern Shambhala, consecrated in the 19th century by the mystic lama Danzanravjaa. Believed to be an energetic gateway and vortex connecting our world to the mythical pure realm of Shambhala, thousands of pilgrims visit annually to meditate within a ring of 108 sacred stupas, laying face-down upon the red earth to absorb restorative cosmic currents.",
    folklore_history_th: "อารามคามาร์ถูกทำลายในช่วงการกวาดล้างศาสนาปี 1937 แต่คำทำนายของดันซานราฟจาระบุไว้ล่วงหน้าว่าหีบสมบัติและคัมภีร์ลับจะถูกซ่อนไว้ในถ้ำกลางทะเลทราย จนกระทั่งถูกขุดค้นพบและบูรณะขึ้นใหม่ในยุคหลังคอมมิวนิสต์ กลายเป็นหมุดหมายทางจิตวิญญาณที่ยิ่งใหญ่ที่สุดแห่งหนึ่งของมองโกเลีย",
    folklore_history_en: "Though razed during the communist purges of the 1930s, the monastery's sacred treasures were miraculously preserved in hidden Gobi desert caves following Danzanravjaa's secret prophecies. Reconstructed in the 1990s, it stands as Mongolia's premier pilgrimage power-place.",
    sound_preset: "church_bell",
    wikiCandidates: ["Khamar_Monastery", "Shambhala", "Dornogovi_Province"],
    videoQuery: "Khamar Monastery Shambhala Energy Center Mongolia"
  },
  {
    id: "pin-baba-yaga",
    title_th: "บาบายากา (แม่มดเฒ่าแห่งกระท่อมขาไก่และสากบินในป่ารัสเซีย)",
    title_en: "Baba Yaga: The Hut on Chicken Legs and Mortar-Riding Witch",
    category: "folklore",
    province_th: "อาร์คันเกลสค์",
    province_en: "Arkhangelsk Oblast",
    district_th: "ป่าไทกาทางเหนือ",
    district_en: "Northern Taiga",
    lat: 64.5430,
    lng: 40.5371,
    story_th: "บาบายากา (Baba Yaga) คือแม่มดที่ทรงอิทธิฤทธิ์และเป็นปริศนาที่สุดในเทพนิยายรัสเซีย เธออาศัยอยู่ในกระท่อมไม้ลี้ลับที่ตั้งอยู่บนขาไก่ขนาดยักษ์ ซึ่งสามารถหมุนรอบทิศทางและเดินย่ำผ่านป่าลึกได้ รั้วบ้านของเธอทำจากกระดูกมนุษย์และหัวกะโหลกที่มีดวงตาเป็นไฟ บาบายากาเดินทางด้วยการนั่งในครกหินขนาดยักษ์ ใช้สากแทนพาย และใช้ไม้กวาดกวาดลบรอยเท้าของตนเอง แม้เธอจะดุร้ายและชอบขู่จะกินเนื้อเด็ก แต่หากผู้กล้าตอบคำถามของเธอด้วยความซื่อสัตย์ เธอจะมอบของวิเศษและคำทำนายที่ช่วยคลี่คลายชะตากรรม",
    story_en: "Baba Yaga is the enigmatic, bone-legged crone of Slavic and Russian fairy tales. She dwells deep within primeval birch and pine forests in a supernatural hut that stands and dances on colossal chicken legs, encircled by a palisade of human bones and glowing skulls. She travels not on a broom, but flying inside a giant wooden mortar steered with a pestle, sweeping away her tracks with a silver birch broom. Simultaneously monstrous child-eater and wise ancestral seer, she rewards the pure-hearted with magical boons.",
    folklore_history_th: "นักคติชนวิทยาเชื่อว่าบาบายากามีต้นกำเนิดมาจากเทพีแห่งความตาย การเปลี่ยนผ่าน และการริเริ่มเข้าสู่วัยผู้ใหญ่ (Initiation rites) ในสังคมสลาฟโบราณ กระท่อมขาไก่อาจจำลองมาจากยุ้งฉางเก็บศพหรือเสบียงอาหารของชนเผ่าฟินโน-อูกริกบนเสาสูงเพื่อป้องกันสัตว์ป่า",
    folklore_history_en: "Anthropologists trace Baba Yaga to pre-Christian Slavic mother-goddesses and shamanic initiation rites. Her dancing chicken-legged hut likely derives from ancient Finno-Ugric and Siberian tree-stump burial caches raised on stilts to keep carrion safe from wild wolves.",
    sound_preset: "drone_dark",
    wikiCandidates: ["Baba_Yaga", "Arkhangelsk", "Russian_fairy_tale"],
    videoQuery: "Baba Yaga Russian fairytale folklore origin"
  },
  {
    id: "pin-gamayun",
    title_th: "กามะยุน (วิหคพยากรณ์หน้าสตรีผู้ล่วงรู้ความลับแห่งจักรวาล)",
    title_en: "Gamayun: The Prophetic Bird of Slavic Divine Wisdom",
    category: "folklore",
    province_th: "สโมเลนสค์",
    province_en: "Smolensk Oblast",
    district_th: "สโมเลนสค์",
    district_en: "Smolensk",
    lat: 54.7818,
    lng: 32.0401,
    story_th: "กามะยุน (Gamayun) คือวิหคศักดิ์สิทธิ์ในตำนานเทพปกรณัมสลาฟและรัสเซีย มีร่างกายเป็นนกหลากสีสันงดงาม แต่มีศีรษะและใบหน้าเป็นสตรีผู้สูงศักดิ์ กามะยุนเป็นทูตสวรรค์และผู้พิทักษ์ภูมิปัญญาอันลี้ลับของเทพเจ้า เธอรู้ทุกสิ่งทุกอย่างที่เกิดขึ้นในอดีต ปัจจุบัน และอนาคต ตั้งแต่การกำเนิดของโลก ท้องฟ้า และมหาสมุทร เสียงร้องเพลงของกามะยุนไพเราะและเปี่ยมด้วยมนต์สะกด ผู้ใดได้ยินคำทำนายของเธอจะต้องตั้งใจฟัง เพราะเธอจะพูดความจริงอันบริสุทธิ์เท่านั้น",
    story_en: "Gamayun is a prophetic bird of Slavic mythology and Russian heraldry, portrayed with the resplendent plumage of an eagle or bird of paradise and the serene face of a beautiful woman. Revered as the harbinger of divine wisdom, she possesses boundless cosmic knowledge—the creation of the heavens, the destiny of empires, and the occult truths of gods and mortals. Her melodious singing inspires divine revelation in righteous seekers who earn her blessing.",
    folklore_history_th: "รูปภาพของนกพยากรณ์กามะยุนปรากฏเป็นสัญลักษณ์มงคลบนตราประจำเมืองสโมเลนสค์ (Smolensk) ของรัสเซีย และได้รับการวาดทอดถ่ายโดยศิลปินเอก วิกเตอร์ วาสเนตซอฟ (Viktor Vasnetsov) ในศตวรรษที่ 19 จนกลายเป็นหนึ่งในสัญลักษณ์ทางวัฒนธรรมที่ยิ่งใหญ่ของรัสเซีย",
    folklore_history_en: "Gamayun is proudly emblazoned upon the historical coat of arms of Smolensk. Immortalized in famous masterworks by Russian Romanticist painter Viktor Vasnetsov, the prophetic bird remains an emblem of spiritual insight and national cultural heritage.",
    sound_preset: "bell_toll",
    wikiCandidates: ["Gamayun", "Smolensk", "Sirin"],
    videoQuery: "Gamayun Slavic mythology prophetic bird"
  }
];

async function run() {
  console.log('Starting Batch Final 6 (Bringing total to exactly 250 pins)...');
  const entitiesDir = path.resolve('public/entities');
  if (!fs.existsSync(entitiesDir)) fs.mkdirSync(entitiesDir, { recursive: true });

  const existingHashes = new Set();
  const files = fs.readdirSync(entitiesDir);
  for (const f of files) {
    if (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp')) {
      try {
        const buf = fs.readFileSync(path.join(entitiesDir, f));
        existingHashes.add(crypto.createHash('md5').update(buf).digest('hex'));
      } catch {}
    }
  }
  console.log(`Loaded ${existingHashes.size} existing unique image hashes.`);

  const finalPins = [];

  for (let i = 0; i < FINAL_6.length; i++) {
    const p = FINAL_6[i];
    console.log(`[${i + 1}/${FINAL_6.length}] Processing ${p.id} (${p.title_th})...`);

    const imgFile = `${p.id}.jpg`;
    const destPath = path.join(entitiesDir, imgFile);

    const downloaded = await fetchWikiThumb(p.wikiCandidates, destPath, existingHashes);
    if (!downloaded) {
      console.log(` -> Warning: Could not find unique wiki thumb for ${p.id}, trying fallback search...`);
      for (const query of [p.province_en, p.district_en, 'Mythology', 'Russia', 'Asia']) {
        const ok = await fetchWikiThumb([query], destPath, existingHashes);
        if (ok) break;
      }
    }

    const vid = await findEmbeddableVideo(p.videoQuery);
    console.log(` -> YouTube: ${vid.url} (${vid.title})`);

    const gallery = [
      {
        id: `${p.id}-v1`,
        type: 'youtube',
        url: vid.url,
        title_th: `${p.title_th} (วิดีโอประกอบเรื่องเล่า)`,
        title_en: `${p.title_en} (Folklore Video)`
      },
      {
        id: `${p.id}-m1`,
        type: 'image',
        url: `/entities/${imgFile}`,
        title_th: `${p.title_th} (ภาพประกอบจากวิกิพีเดีย)`,
        title_en: `${p.title_en} (Wikipedia Reference)`
      }
    ];

    finalPins.push({
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
      is_published: 1,
      gallery_media: gallery
    });
  }

  const seedPath = path.resolve('src/data/seedData.ts');
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('= [', startIdx) + 2;
  const endIdx = content.lastIndexOf('];');
  const existingPins = eval(content.slice(arrayStart, endIdx + 1));

  const newIds = new Set(finalPins.map(fp => fp.id));
  const filteredExisting = existingPins.filter(ep => !newIds.has(ep.id));
  const combined = [...filteredExisting, ...finalPins];
  console.log(`Updated pins count: ${filteredExisting.length} -> ${combined.length}`);

  const updatedFile = content.slice(0, arrayStart) + JSON.stringify(combined, null, 2) + ';\n';
  fs.writeFileSync(seedPath, updatedFile, 'utf8');
  console.log(`Successfully updated src/data/seedData.ts to ${combined.length} pins!`);

  // Seed directly into live Cloudflare D1 via API
  let d1Ok = 0;
  for (const p of finalPins) {
    try {
      const r = await fetch('https://worldofmys.pages.dev/api/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (r.ok) d1Ok++;
    } catch {}
  }
  console.log(`Seeded into live D1 database: ${d1Ok}/${finalPins.length}`);
}

run().catch(console.error);

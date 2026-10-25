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

const BATCH_275 = [
  // ================= 1. MARITIME SOUTHEAST ASIA (6) =================
  {
    id: "pin-kuyang",
    title_th: "กุยยัง (ผีกระสือลอยหัวลากไส้แห่งเกาะบอร์เนียว)",
    title_en: "Kuyang: The Floating Detached Head Vampire of Borneo",
    category: "ghost",
    province_th: "กาลีมันตันตะวันออก",
    province_en: "East Kalimantan",
    district_th: "ซามารินดา",
    district_en: "Samarinda",
    lat: -0.5022,
    lng: 117.1536,
    story_th: "กุยยัง (Kuyang) คือผีถอดหัวและเครื่องในลอยได้ในคติชนวิทยาของชาวดายักและชาวอินโดนีเซียบนเกาะบอร์เนียว (กาลีมันตัน) ในเวลากลางวันกุยยังจะใช้ชีวิตเหมือนผู้หญิงธรรมดาทั่วไป แต่ในยามค่ำคืน ศีรษะพร้อมอวัยวะภายใน หลอดลม หัวใจ และลำไส้ที่เรืองแสงสีแดงอมเขียวจะหลุดลอยออกจากร่างเพื่อออกล่าทารกแรกเกิด หญิงมีครรภ์ และเลือดสด ชาวบ้านมักแขวนใบหนามและต้นว่านหน้าประตูเพื่อเกี่ยวไส้ของมันไม่ให้เข้ามาในเรือน",
    story_en: "Kuyang is Borneo's nocturnal floating head wraith, feared among Dayak and Banjarese communities in Kalimantan. By day, she appears as an unassuming mortal woman, but at midnight, her head detaches with glowing esophagus, heart, and entrails trailing behind. Gliding through misty jungle skies, she hunts newborn infants and women in labor to consume placenta and blood. Villagers hang thorny leaves like pandan around windows to ensnare her dangling intestines.",
    folklore_history_th: "ตำนานกุยยังมีความคล้ายคลึงกับกระสือในไทยและเปนังกาลันในมาเลเซีย แต่มีเอกลักษณ์ผูกพันกับเวทมนตร์ดำ 'อิลมูฮิตัม' (Ilmu Hitam) ของชนพื้นเมืองในป่าดิบชื้นบอร์เนียวที่สืบทอดกันมาหลายร้อยปีเพื่อคงความสาวและเสน่ห์อมตะ",
    folklore_history_en: "Kuyang shares deep cultural roots with Thai Krasue and Malaysian Penanggalan, linked to esoteric 'Ilmu Hitam' black magic rites practiced to preserve eternal beauty and youthful vigor in equatorial Borneo rainforests.",
    sound_preset: "whisper",
    wikiCandidates: ["Kuyang", "Samarinda", "East_Kalimantan"],
    videoQuery: "Kuyang ghost Borneo Kalimantan folklore"
  },
  {
    id: "pin-suanggi",
    title_th: "ซวงกี (หมอผีดำกินวิญญาณแห่งป่าดึกดำบรรพ์ปาปัว)",
    title_en: "Suanggi: The Flesh-Eating Shadow Sorcerer of Papua",
    category: "curse",
    province_th: "ปาปัว",
    province_en: "Papua",
    district_th: "จายาปุระ",
    district_en: "Jayapura",
    lat: -2.5337,
    lng: 140.7181,
    story_th: "ซวงกี (Suanggi) คือวิญญาณหมอผีดำกินคนและปีศาจเงาที่น่าสะพรึงกลัวที่สุดในหมู่เกาะโมลุกกะและปาปัว เชื่อกันว่าซวงกีคือผู้ใช้อาคมมืดที่สามารถถอดจิต แปลงร่างเป็นจิ้งจก แมลง หรือควันสีดำเพื่อลอบเข้าบ้านคนยามดึก จากนั้นจะใช้มนต์สะกดกลืนกินอวัยวะภายในและวิญญาณของเหยื่อจนหมดสิ้น โดยเหยื่อจะตื่นขึ้นมาเหมือนไม่เป็นอะไร แต่จะล้มป่วยและเสียชีวิตอย่างรวดเร็วภายในเวลาไม่กี่วัน",
    story_en: "Suanggi is an ancient, shape-shifting malevolent sorcerer and soul-devouring shadow demon feared across Papua and the Maluku Islands of Indonesia. Masters of cannibalistic black magic, Suanggis manifest as nocturnal shadows, phantom reptiles, or glowing spheres. They extract and consume a sleeping victim's internal organs and vital spirit; the target awakens feeling hollowed out and mysteriously withers away to death within days.",
    folklore_history_th: "ความเชื่อเรื่องซวงกียังคงมีอิทธิพลอย่างมหาศาลต่อวัฒนธรรมชนเผ่าในปาปัว แม้กระทั่งในปัจจุบัน เมื่อมีผู้เสียชีวิตอย่างกะทันหันในหมู่บ้าน ชุมชนมักเชิญหมอผีขาวทำพิธีเสี่ยงทายเพื่อตามล่าหาซวงกีที่แฝงตัวอยู่",
    folklore_history_en: "The terror of Suanggi remains deeply ingrained in contemporary indigenous Papuan society. Sudden, undiagnosed illnesses are frequently attributed to Suanggi attacks, prompting traditional spiritual divinations to unveil the occult culprit.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Jayapura", "Papua_(province)", "Maluku_Islands"],
    videoQuery: "Suanggi Papua horror folklore mystery"
  },
  {
    id: "pin-kapre",
    title_th: "คาเปร (อสูรต้นไม้ร่างยักษ์สูบซิการ์แห่งป่าฟิลิปปินส์)",
    title_en: "Kapre: The Giant Tree-Dwelling Cigar Demon of the Philippines",
    category: "monster",
    province_th: "นูเอวาเอซีฮา",
    province_en: "Nueva Ecija",
    district_th: "เทือกเขาเซียร์รามาเดร",
    district_en: "Sierra Madre Mountains",
    lat: 15.5000,
    lng: 121.2000,
    story_th: "คาเปร (Kapre) คืออสูรยักษ์ในป่าลึกของฟิลิปปินส์ มีร่างกายสูงใหญ่กว่า 7-10 ฟุต ผิวดำเข้ม เต็มไปด้วยขนหนา และมีดวงตาโตแดงก่ำ อาศัยอยู่บนกิ่งไม้ใหญ่ของต้นไทรโบราณ (Balete Tree) ต้นมะม่วง หรือต้นไผ่ จุดเด่นของคาเปรคือมันชอบนั่งพิงกิ่งไม้สูบซิการ์มวนยักษ์ที่ควันไม่เคยดับ เมื่อมีคนเดินผ่านป่า คาเปรจะพ่นควันยาสูบสะกดจิต ทำให้คนเดินทางเดินวนเวียนหลงทางในป่าเดิมๆ ซ้ำแล้วซ้ำเล่า",
    story_en: "The Kapre is a towering, hairy tree giant standing 7 to 10 feet tall with glowing red eyes, endemic to Philippine folklore. Residing high in the sprawling branches of ancient Balete (banyan), mango, or acacia trees, the Kapre is infamous for smoking an everlasting gigantic cigar. While generally mischievous rather than murderous, it confuses travelers by puffing fragrant tobacco smoke that disorients their senses and traps them in infinite disorienting forest loops.",
    folklore_history_th: "ชื่อ 'คาเปร' สันนิษฐานว่ามีรากศัพท์มาจากคำว่า 'คาฟิร์' (Kafir) ในภาษาอาหรับ ซึ่งชาวสเปนนำมาใช้เรียกทาสผิวดำจากแอฟริกาและผสมผสานเข้ากับตำนานวิญญาณสิงสถิตต้นไม้ของชาวตากาล็อกโบราณอย่างลงตัว",
    folklore_history_en: "The name Kapre originates from the Arabic 'Kafir' (non-believer), introduced by Spanish colonizers to describe dark-skinned African sailors and subsequently synthesized with indigenous pre-colonial Tagalog animist tree-spirit worship.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Kapre", "Sierra_Madre_(Philippines)", "Balete_tree"],
    videoQuery: "Kapre Philippine mythology tree giant cigar"
  },
  {
    id: "pin-bakunawa",
    title_th: "บาคูนากวา (พญานาคมังกรทะเลผู้กลืนดวงจันทร์แห่งวิซายาส)",
    title_en: "Bakunawa: The Colossal Moon-Swallowing Sea Dragon of Visayas",
    category: "monster",
    province_th: "เซบู",
    province_en: "Cebu",
    district_th: "ทะเลวิซายัน",
    district_en: "Visayan Sea",
    lat: 11.2000,
    lng: 123.8000,
    story_th: "บาคูนากวา (Bakunawa) คือพญามังกรทะเลและงูยักษ์ดึกดำบรรพ์ในคติชนวิทยาของชาววิซายาสในฟิลิปปินส์ มีลำตัวยาวคดเคี้ยว เกล็ดสีดำเงางาม ปากกว้างขนาดกลืนเกาะได้ทั้งเกาะ และมีลิ้นเป็นเถ้าถ่าน ตำนานเล่าว่าในอดีตท้องฟ้ามีดวงจันทร์ถึง 7 ดวง แต่บาคูนากวาหลงใหลในแสงจันทร์จึงโผล่ขึ้นมาจากมหาสมุทรและกลืนกินดวงจันทร์ไปทีละดวง เมื่อเกิดจันทรุปราคา ชาวบ้านทั่วฟิลิปปินส์จะพากันตีหม้อ ตีกลอง และตะโกนส่งเสียงดังเพื่อให้บาคูนากวาตกใจและคายดวงจันทร์ดวงสุดท้ายคืนสู่ท้องฟ้า",
    story_en: "Bakunawa is a gigantic, serpentine sea dragon in Visayan mythology whose gaping maw can swallow entire islands. Enchanted by the radiant luminosity of the moon, ancient lore recounts that there were originally seven celestial moons, but Bakunawa surged from the oceanic abyss and devoured six. During lunar eclipses, ancient Filipinos banged pots, sounded brass gongs, and shouted into the night to startle the colossal leviathan into spitting back the final remaining moon.",
    folklore_history_th: "พิธีกรรมไล่บาคูนากวาด้วยเสียงดังเป็นส่วนหนึ่งของวิถีชีวิตชาวประมงในทะเลเซบูและหมู่เกาะวิซายาสมาหลายพันปี ซึ่งเป็นตัวอย่างคลาสสิกของการใช้ตำนานอสูรกายอธิบายปรากฏการณ์ดาราศาสตร์สุริยุปราคาและจันทรุปราคา",
    folklore_history_en: "The ritualistic commotion to banish Bakunawa during eclipses represents one of Southeast Asia's oldest surviving astronomical myths, deeply entwined with maritime Visayan navigation and tidal folklore.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Bakunawa", "Visayan_Sea", "Cebu"],
    videoQuery: "Bakunawa Philippine mythology moon swallowing dragon"
  },
  {
    id: "pin-rangda-barong",
    title_th: "รางดาและบารอง (มหาศึกราชินีแม่มดและพญาอสูรผู้พิทักษ์แห่งบาหลี)",
    title_en: "Rangda & Barong: The Eternal Cosmic Battle of Bali",
    category: "legend",
    province_th: "บาหลี",
    province_en: "Bali",
    district_th: "กียานยาร์",
    district_en: "Gianyar",
    lat: -8.5333,
    lng: 115.3167,
    story_th: "ในเกาะบาหลี ความสมดุลของจักรวาลขึ้นอยู่กับการต่อสู้ที่ไม่รู้จบระหว่าง 'รางดา' (Rangda) ราชินีแม่มดแห่งความมืด ผู้มีเขี้ยวยาว ตาโปน ลิ้นยาวมีเปลวไฟลุกท่วม และควบคุมกองทัพปีศาจร้าย กับ 'บารอง' (Barong) พญาอสูรสิงห์ศักดิ์สิทธิ์ผู้นำแห่งกองทัพฝ่ายธรรมะ ในระบำศักดิ์สิทธิ์บารอง รางดาจะร่ายมนต์สะกดให้นักรบกริชแทงอกตัวเอง แต่บารองจะร่ายมนต์เกราะเพชรป้องกัน ทำให้ใบมีดกริชหักงอโดยไม่ระคายผิว สะท้อนถึงการอยู่ร่วมกันของพลังบวกและพลังลบในโลกมนุษย์",
    story_en: "In Balinese Hindu-animism, the moral universe is anchored by the eternal deadlock between Rangda, the demon queen of the Leyaks who commands darkness and black magic, and Barong, the lion-like king of spirits and champion of goodness. During the sacred trance dance of Barong and Rangda, Rangda entrances warriors into stabbing their own chests with waved kris daggers, but Barong's blessing renders their flesh completely impervious, demonstrating that evil cannot be destroyed, only eternally counterbalanced.",
    folklore_history_th: "ระบำบารองและรางดาจัดขึ้นในวัดศักดิ์สิทธิ์ทั่วบาหลี โดยหน้ากากของทั้งสองถือเป็นวัตถุมงคลชั้นสูงที่มีวิญญาณสิงสถิตอยู่จริง และต้องเก็บรักษาไว้ในศาลเจ้าประจำวัดพร้อมพิธีเซ่นไหว้ด้วยดอกไม้และกำยานทุกวัน",
    folklore_history_en: "The Barong-Rangda dance is an active sacred temple rite across Bali. The sacred masks are living spiritual relics infused with primal cosmic forces, consecrated in village Pura temples to preserve communal metaphysical harmony.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Rangda", "Barong_(mythology)", "Gianyar_Regency"],
    videoQuery: "Rangda and Barong Bali sacred trance dance"
  },
  {
    id: "pin-toraja-tau-tau",
    title_th: "หุ่นผาศพเตาเตาและพิธีกรรมเดินศพมะเนเนแห่งโทราจา",
    title_en: "Toraja Tau-Tau & Ma'nene: The Cliff Crypts of Sulawesi",
    category: "sacred",
    province_th: "สุลาเวสีใต้",
    province_en: "South Sulawesi",
    district_th: "ทานา โทราจา",
    district_en: "Tana Toraja",
    lat: -3.0500,
    lng: 119.8667,
    story_th: "บนที่ราบสูงของเกาะสุลาเวสี ชนเผ่าโทราจามีความเชื่อเรื่องโลกหลังความตาย (ปูยา) ที่น่าทึ่งที่สุดในโลก พวกเขาไม่ฝังศพลงดินแต่จะเจาะหน้าผาหินสูงชันเพื่อนำโลงศพไปแขวนไว้ พร้อมแกะสลักหุ่นไม้รูปเหมือนผู้ตายขนาดเท่าคนจริงที่เรียกว่า 'เตาเตา' (Tau-Tau) สวมเสื้อผ้าจริงและยืนมองลงมาจากระเบียงหน้าผาเพื่อปกป้องลูกหลาน นอกจากนี้ยังมีพิธีกรรม 'มะเนเน' (Ma'nene) ที่ครอบครัวจะขุดเปิดโลงศพบรรพบุรุษ นำร่างที่แห้งมาทำความสะอาด เปลี่ยนเสื้อผ้าชุดใหม่ และพาร่างเดินเคารพทั่วหมู่บ้าน",
    story_en: "High in the mist-veiled mountains of Sulawesi, the Toraja people practice humanity's most intricate death rites. Instead of subterranean burials, coffins are slotted into sheer limestone cliffs guarded by life-sized carved effigies called 'Tau-Tau' dressed in traditional finery. During the sacred Ma'nene festival, families exhume the mummified bodies of their ancestors, meticulously groom and redress them in fresh garments, and walk them through ancestral villages as a profound celebration of unbreakable kinship beyond death.",
    folklore_history_th: "สำหรับชาวโทราจา คนที่หมดลมหายใจยังไม่ถือว่าเสียชีวิต แต่ถือเป็น 'คนป่วย' (To Makula) ที่ยังอาศัยร่วมบ้านกับครอบครัวได้นานหลายเดือนหรือหลายปีกว่าจะทำพิธีศพบูชายัญควายเผือกอันยิ่งใหญ่",
    folklore_history_en: "Torajans regard the deceased as merely 'sleeping' or 'sick' (To Makula), keeping mummified loved ones at home for months or years before hosting elaborate buffalo-sacrifice funerary feasts (Rambu Solo) that dispatch the soul to Puya.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Toraja", "Tau_tau", "Tana_Toraja_Regency"],
    videoQuery: "Toraja death ritual Ma nene Sulawesi Indonesia"
  },

  // ================= 2. AUSTRALIA & OCEANIA (7) =================
  {
    id: "pin-rainbow-serpent",
    title_th: "พญางูสายรุ้ง (มหาเทพผู้สร้างแม่น้ำและขุนเขาแห่งดรีมไทม์)",
    title_en: "The Rainbow Serpent: The Dreamtime Creator of Rivers and Gorges",
    category: "sacred",
    province_th: "นอร์เทิร์นเทร์ริทอรี",
    province_en: "Northern Territory",
    district_th: "อุทยานแห่งชาติคาคาดู",
    district_en: "Kakadu National Park",
    lat: -12.8000,
    lng: 132.8000,
    story_th: "พญางูสายรุ้ง (Rainbow Serpent หรือ Almudj / Borlung) คือสิ่งศักดิ์สิทธิ์สูงสุดและเก่าแก่ที่สุดในความเชื่อยุคดรีมไทม์ (Dreamtime) ของชนพื้นเมืองอะบอริจินในออสเตรเลีย เล่ากันว่าในยุคแรกเริ่มที่แผ่นดินยังแบนราบ พญางูสายรุ้งได้เลื้อยผ่านทวีปออสเตรเลีย รอยคดเคี้ยวของลำตัวได้ขุดเซาะกลายเป็นแม่น้ำ ลำธาร หุบผาชัน และภูเขาสูง เมื่อฝนตก แสงสายรุ้งบนท้องฟ้าคือร่างของพระองค์ที่เชื่อมต่อระหว่างแหล่งน้ำบนดินและน้ำบนฟ้า พระองค์เป็นทั้งผู้ให้ชีวิตและผู้ลงทัณฑ์ผู้ที่ละเมิดกฎธรรมชาติ",
    story_en: "The Rainbow Serpent is the supreme creative and ancestral deity of Australian Aboriginal mythology, venerated continuously for tens of thousands of years. During the primordial Dreamtime, as the serpent slithered across the barren Australian continent, the sinuous gouging of its gigantic body carved out rivers, billabongs, gorges, and mountain ranges. Reflected in the sky as a luminous rainbow, it governs rain, fertility, and cosmic order, fiercely punishing those who violate tribal laws.",
    folklore_history_th: "ภาพเขียนสีหินรูปพญางูสายรุ้งในอุทยานแห่งชาติคาคาดูและอาร์เนมแลนด์มีอายุย้อนหลังไปกว่า 6,000 ถึง 20,000 ปี ซึ่งถือเป็นหนึ่งในประเพณีความเชื่อทางศาสนาที่ต่อเนื่องยาวนานที่สุดในประวัติศาสตร์มนุษยชาติ",
    folklore_history_en: "Ochre rock paintings of the Rainbow Serpent in Kakadu National Park and Arnhem Land date back up to 20,000 years, constituting one of the oldest unbroken religious traditions in the world.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Rainbow_Serpent", "Kakadu_National_Park", "Dreamtime"],
    videoQuery: "Rainbow Serpent Aboriginal Dreamtime Kakadu Australia"
  },
  {
    id: "pin-drop-bear",
    title_th: "ดรอปแบร์ (อสูรโคอาล่ากินเนื้อแห่งพุ่มไม้ออสเตรเลีย)",
    title_en: "Drop Bear: The Carnivorous Ambush Predator of the Aussie Bush",
    category: "monster",
    province_th: "นิวเซาท์เวลส์",
    province_en: "New South Wales",
    district_th: "เทือกเขาบลูเมาน์เทนส์",
    district_en: "Blue Mountains",
    lat: -33.7000,
    lng: 150.3000,
    story_th: "ดรอปแบร์ (Drop Bear - Thylarctos plummetus) คือสัตว์ร้ายในตำนานพื้นบ้านร่วมสมัยของออสเตรเลีย มีรูปร่างคล้ายหมีโคอาล่ายักษ์แต่มีเขี้ยวยาวแหลมคม กรงเล็บทรงพลัง และมีนิสัยดุร้ายกินเนื้อ มันซ่อนตัวอยู่บนยอดต้นยูคาลิปตัสสูงในป่าพุ่มทึบ และจะทิ้งดิ่งลงมาจากกิ่งไม้ใส่ศีรษะของนักเดินทางที่ไม่ระวังตัวเพื่อขย้ำเหยื่อ ชาวออสซี่มักเล่าขานพร้อมให้คำแนะนำแก่นักท่องเที่ยวต่างชาติว่า วิธีป้องกันดรอปแบร์คือการทาเวจจิไมต์ (Vegemite) ไว้หลังใบหู หรือปักส้อมไว้บนหมวก",
    story_en: "The Drop Bear is Australia's most infamous predatory bush cryptid and folkloric tall tale. Described as an extraordinarily muscular, carnivorous relative of the koala armed with razor canine tusks, it lurks silently in the high canopy of gum trees. When unsuspecting bushwalkers stride beneath, it drops vertically from overhead boughs to ambush its prey. Aussie lore facetiously advises visitors to smear Vegemite behind their ears or carry forks in their hats for deterrent protection.",
    folklore_history_th: "แม้ดรอปแบร์จะถูกนำมาเล่าเพื่อทดสอบความเชื่อของนักท่องเที่ยว แต่นักบรรพชีวินวิทยาชี้ว่าในยุคไพลสโตซีน ออสเตรเลียเคยมี 'สิงโตมีกระเป๋าหน้าท้อง' (Thylacoleo carnifex) ซึ่งเป็นสัตว์นักล่าซุ่มกระโดดจากต้นไม้ที่มีอยู่จริงในประวัติศาสตร์",
    folklore_history_en: "While celebrated today as an affectionate cultural hoax played on foreign tourists, scientists note that the myth closely mirrors the extinct Pleistocene marsupial lion (Thylacoleo carnifex), a real tree-dwelling ambush carnivore that lived alongside early Aboriginal people.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Drop_bear", "Blue_Mountains_(New_South_Wales)", "Thylacoleo_carnifex"],
    videoQuery: "Drop Bear Australia myth legend cryptid"
  },
  {
    id: "pin-min-min-light",
    title_th: "ดวงไฟมินมิน (ลูกไฟปริศนาลอยไล่ตามคนกลางทะเลทรายเอาต์แบ็ก)",
    title_en: "Min Min Light: The Phantom Ghost Lights of the Outback",
    category: "ghost",
    province_th: "ควีนส์แลนด์",
    province_en: "Queensland",
    district_th: "บูลีอา",
    district_en: "Boulia",
    lat: -22.9111,
    lng: 139.9078,
    story_th: "ดวงไฟมินมิน (Min Min Light) คือปรากฏการณ์ลูกไฟลึกลับที่พบเห็นได้บ่อยที่สุดบริเวณเมืองบูลีอาในแถบเอาต์แบ็กอันแห้งแล้งของรัฐควีนส์แลนด์ ลูกไฟมีลักษณะกลมเรืองแสงสีขาว เขียว หรือแดง ลอยล่องอยู่เหนือพื้นดินในระดับสายตา สามารถเคลื่อนที่ได้อย่างรวดเร็ว หลอกล่อนักเดินทาง หรือเร่งความเร็วพุ่งไล่ตามรถยนต์ในความมืดมิด หากมีใครพยายามขับรถตามเข้าไปใกล้ ลูกไฟจะถอยห่างและนำพาให้หลงทางในทะเลทรายจนน้ำมันหมด",
    story_en: "The Min Min Light is an eerie nocturnal phenomenon frequently witnessed across the vast, treeless plains around Boulia in the Queensland Outback. Manifesting as luminous fuzzy orbs shifting from bright white to vivid green or red, the lights hover just above the horizon. Witnesses report the orbs tracking moving vehicles at astonishing speeds or beckoning drivers deep into trackless desert terrain until their fuel runs dry.",
    folklore_history_th: "ชื่อ 'มินมิน' มาจากชื่อโรงแรมเก่าแก่ริมทางที่ถูกไฟไหม้จนราบคาบในทศวรรษ 1910 ซึ่งเป็นจุดที่มีผู้พบเห็นลูกไฟครั้งแรก นักวิทยาศาสตร์บางคนเสนอว่าอาจเกิดจากภาพลวงตาทางแสงสะท้อน (Fata Morgana) ในชั้นบรรยากาศหนาวสลับร้อนของทะเลทราย",
    folklore_history_en: "First recorded by European settlers near the ruins of the burnt-down Min Min Hotel in the early 20th century, Aboriginal traditions long predated it with warnings against following phantom spirits across the spinifex plains.",
    sound_preset: "whisper",
    wikiCandidates: ["Min_Min_light", "Boulia,_Queensland", "Outback"],
    videoQuery: "Min Min lights Boulia Queensland Outback documentary"
  },
  {
    id: "pin-dirawong",
    title_th: "ดิราวง (พญาเหี้ยยักษ์ผู้พิทักษ์แห่งชาวบันดาลุง)",
    title_en: "Dirawong: The Giant Goanna Protector of the Bundjalung Nation",
    category: "legend",
    province_th: "นิวเซาท์เวลส์",
    province_en: "New South Wales",
    district_th: "แหลมโกอันนา",
    district_en: "Goanna Headland",
    lat: -29.0000,
    lng: 153.5000,
    story_th: "ดิราวง (Dirawong) คือสิ่งมีชีวิตศักดิ์สิทธิ์ในรูปของกิ้งก่ายักษ์ (โคอาลล่า/โกอันนา) ในตำนานของชาวเผ่าบันดาลุงทางชายฝั่งตะวันออกของออสเตรเลีย ดิราวงเป็นสัญลักษณ์แห่งการปกป้อง ความรู้ทางสมุนไพร และวิถีชีวิตดั้งเดิม ตำนานเล่าถึงการต่อสู้ครั้งมหากาพย์ระหว่างดิราวงและพญางูสายรุ้งรุ้งผู้โกรธเกรี้ยว ทั้งสองต่อสู้กันจนแผ่นดินแยก เกิดเป็นแม่น้ำริชมอนด์และแหลมโกอันนาเฮดแลนด์ ก่อนที่ดิราวงจะดำดิ่งลงทะเลและกลายเป็นแนวปะการังหินเพื่อปกป้องชายฝั่งตลอดกาล",
    story_en: "Dirawong is the benevolent giant Goanna (monitor lizard) ancestral creator spirit venerated by the Bundjalung Aboriginal people along the northern coast of New South Wales. Revering him as the protector of tribal knowledge and natural medicine, legends tell of Dirawong's epic struggle against an enraged Rainbow Serpent. Their clashes shaped the landscape—gouging the Richmond River—before Dirawong transformed into Goanna Headland, forever safeguarding the coastline.",
    folklore_history_th: "แหลมโกอันนาเฮดแลนด์ที่อีแวนส์เฮดได้รับการประกาศให้เป็นเขตพื้นที่ศักดิ์สิทธิ์ของชนพื้นเมือง (Aboriginal Place) เพื่อปกป้องร่องรอยและสถานที่ประกอบพิธีกรรมที่เกี่ยวข้องกับดิราวง",
    folklore_history_en: "Goanna Headland at Evans Head is officially gazetted as an Aboriginal Heritage Place, preserved as a sacred cultural sanctuary connected to the Dreamtime exploits of Dirawong.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Dirawong", "Bundjalung_people", "Evans_Head,_New_South_Wales"],
    videoQuery: "Dirawong Dreamtime legend Bundjalung Goanna Australia"
  },
  {
    id: "pin-yara-ma-yha-who",
    title_th: "ยารา-มา-ยา-ฮู (ผีแคระแดงดูดเลือดกระโดดจากต้นมะเดื่อแห่งเอาต์แบ็ก)",
    title_en: "Yara-ma-yha-who: The Red Fig-Tree Vampire of Aboriginal Lore",
    category: "monster",
    province_th: "นอร์เทิร์นเทร์ริทอรี",
    province_en: "Northern Territory",
    district_th: "อลิซสปริงส์",
    district_en: "Alice Springs",
    lat: -24.0000,
    lng: 133.5000,
    story_th: "ยารา-มา-ยา-ฮู (Yara-ma-yha-who) คือสิ่งมีชีวิตประหลาดในนิทานพื้นบ้านของชาวอะบอริจินในออสเตรเลีย มีลักษณะคล้ายมนุษย์แคระตัวสีแดงสด สูงราว 4 ฟุต หัวโตไร้ฟัน แต่มีปากกว้างขนาดใหญ่ และที่ปลายนิ้วมือและนิ้วเท้ามีปุ่มดูดทรงกลมคล้ายหนวดปลาหมึก มันอาศัยอยู่บนยอดต้นมะเดื่อป่า (Wild Fig Tree) รอคอยให้เด็กๆ เดินมาเล่นใต้ร่มเงา ก่อนจะกระโดดลงมาใช้ปุ่มดูดเลือดจนเหยื่ออ่อนแรง กลืนเหยื่อลงท้องทั้งตัว แล้วสำรอกออกมาซ้ำๆ จนเหยื่อกลายร่างเป็นยารา-มา-ยา-ฮูตัวใหม่",
    story_en: "The Yara-ma-yha-who is an eerie folkloric vampire inhabiting the branches of wild fig trees in indigenous Australian folklore. Standing about four feet tall with crimson skin, a bulbous head, and a toothless cavernous mouth, its most striking feature is the octopus-like suckers tipping its fingers and toes. It drops from canopy shade upon resting wanderers, draining blood through its finger pads before swallowing the victim whole and spitting them out altered.",
    folklore_history_th: "เรื่องเล่ายารา-มา-ยา-ฮูเป็นนิทานสอนเด็กชนพื้นเมืองไม่ให้ออกไปเดินเล่นใต้ต้นไม้ใหญ่ห่างจากสายตาผู้ใหญ่ในช่วงเวลาบ่ายที่แดดร้อนจัด เพื่อป้องกันโรคลมแดดและการถูกสัตว์เลื้อยคลานมีพิษกัด",
    folklore_history_en: "The Yara-ma-yha-who served as a potent pedagogical fable warning children against wandering away from camp during the scorching heat of Outback afternoons, deterring dehydration, heatstroke, and venomous snake encounters.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Yara-ma-yha-who", "Alice_Springs", "Outback"],
    videoQuery: "Yara ma yha who Australian folklore monster"
  },
  {
    id: "pin-patupaiarehe",
    title_th: "ปาตุไปอาเรเฮ (ชนเผ่าภูตผมทองผิวเผือกแห่งสายหมอกนิวซีแลนด์)",
    title_en: "Patupaiarehe: The Pale Fairy Folk of the New Zealand Mists",
    category: "legend",
    province_th: "ไวกาโต",
    province_en: "Waikato",
    district_th: "ยอดเขาพิรองเกีย",
    district_en: "Mount Pirongia",
    lat: -37.9500,
    lng: 175.2000,
    story_th: "ปาตุไปอาเรเฮ (Patupaiarehe หรือ Turehu) คือชนเผ่าลี้ลับกึ่งภูตกึ่งมนุษย์ในตำนานของชาวเมารีในนิวซีแลนด์ พวกเขามีผิวขาวซีดเผือก ผมยาวสลวยสีบลอนด์ทองหรือสีแดง และไม่สามารถทนต่อแสงแดดได้ จึงอาศัยอยู่บนยอดเขาสูงที่ปกคลุมด้วยหมอกหนาทึบ เช่น ยอดเขาพิรองเกีย ปาตุไปอาเรเฮเชี่ยวชาญการเป่าขลุ่ยไม้ (Koauau) บทเพลงของพวกเขาไพเราะจับใจจนสามารถสะกดจิตหญิงสาวชาวเมารีให้เดินละเมอขึ้นไปบนยอดเขาและหายตัวไปอย่างไร้ร่องรอย",
    story_en: "The Patupaiarehe (or Turehu) are supernatural fairy-like beings woven into Māori traditions of Aotearoa (New Zealand). Possessing fair skin, reddish or golden hair, and eyes sensitive to daylight, they reside atop mist-shrouded ranges like Mount Pirongia. Accomplished weavers and ethereal flute musicians playing the kōauau, their hypnotic melodies drifting through misty valleys were said to lure travelers away from safe pathways into the phantom high country.",
    folklore_history_th: "ตามตำนานเมารี ชาวเมารีได้เรียนรู้วิธีการสานแหจับปลาและการทอผ้าลวดลายซับซ้อนมาจากการแอบสังเกตชนเผ่าปาตุไปอาเรเฮก่อนที่พวกมันจะสลายตัวหนีไปเมื่อแสงอรุณรุ่งสาดส่อง",
    folklore_history_en: "In Māori cultural tradition, the art of knotting flax fishing nets and intricate weaving was acquired from the Patupaiarehe by clever tricksters who delayed them until dawn dissolved their enchanted gathering.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Patupaiarehe", "Mount_Pirongia", "Māori_mythology"],
    videoQuery: "Patupaiarehe Maori fairy folklore New Zealand"
  },
  {
    id: "pin-pouakai-eagle",
    title_th: "พัวไก (พญาอินทรียักษ์ฮาสต์ล่ามนุษย์แห่งตำนานเมารี)",
    title_en: "Pouakai: The Man-Eating Giant Haast's Eagle of the Southern Alps",
    category: "monster",
    province_th: "แคนเทอร์เบอรี",
    province_en: "Canterbury",
    district_th: "เทือกเขาแอลป์ตอนใต้",
    district_en: "Southern Alps",
    lat: -43.5000,
    lng: 170.5000,
    story_th: "พัวไก (Pouakai หรือ Hokioi) คือพญานกอินทรียักษ์กินคนในตำนานเล่าขานของชาวเมารีเกาะใต้ นิวซีแลนด์ มันมีปีกกว้างกว่า 3 เมตร กรงเล็บขนาดเท่าอุ้งเท้าเสือ และสามารถโฉบลงมาจากยอดเขาหิมะด้วยความเร็วสูงเพื่อจิกขย้ำและฉุดลากคนทั้งคนขึ้นไปกินในรังบนหน้าผาสูงชัน ในอดีต ชาวเมารีต้องซ่อนตัวอยู่ในถ้ำหรือสร้างกับดักไม้หนามเพื่อเอาชีวิตรอดจากการล่าของพญานกตัวนี้",
    story_en: "The Pouakai (Hōkioi) is a fearsome apex predator etched into Māori oral history on New Zealand's South Island. Described as a colossal black-and-white raptor with razor talons capable of snatching adult men from forest clearings, it nested upon the highest precipices of the Southern Alps. Modern paleontology proved this legend was real: the extinct Haast's eagle (Hieraaetus moorei) weighed up to 15 kg with an 8-foot wingspan, the largest eagle known to have ever lived.",
    folklore_history_th: "เรื่องราวของพัวไกคือหนึ่งในหลักฐานที่พิสูจน์ว่าตำนานพื้นบ้านมีรากฐานมาจากสัตว์จริง นกอินทรีฮาสต์ (Haast's eagle) เคยครองเวหาในนิวซีแลนด์และล่าล้มนกโมอายักษ์เป็นอาหาร ก่อนจะสูญพันธุ์ไปหลังการเข้ามาตั้งถิ่นฐานของมนุษย์ในศตวรรษที่ 15",
    folklore_history_en: "The Pouakai is a prime example of myth preserving verified prehistoric biology: Haast's eagle actively coexisted with early Māori Polynesian settlers, hunting giant Moas and humans until driven extinct around 1400 AD.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Haast's_eagle", "Southern_Alps", "Canterbury,_New_Zealand"],
    videoQuery: "Haast eagle giant bird New Zealand Pouakai"
  },

  // ================= 3. CENTRAL ASIA & CASPIAN & SILK ROAD (6) =================
  {
    id: "pin-darvaza-crater",
    title_th: "ประตูนรกดาร์วาซา (หลุมไฟลุกโชนตลอดกาลแห่งทะเลทรายคาราคุม)",
    title_en: "Gates of Hell: The Blazing Gas Crater of Darvaza",
    category: "curse",
    province_th: "อาฮาล",
    province_en: "Ahal",
    district_th: "ทะเลทรายคาราคุม",
    district_en: "Karakum Desert",
    lat: 40.2525,
    lng: 58.4397,
    story_th: "ประตูนรก (Door to Hell หรือ Darvaza Crater) คือหลุมยุบขนาดมหึมากว้างกว่า 70 เมตรและลึกกว่า 30 เมตร กลางทะเลทรายคาราคุม ประเทศเติร์กเมนิสถาน ภายในหลุมเต็มไปด้วยเปลวเพลิงที่ลุกโชนและเดือดพล่านต่อเนื่องยาวนานกว่า 50 ปีโดยไม่เคยดับ กลิ่นกำมะถันที่คละคลุ้งและเสียงหวีดหวิวของเปลวไฟยามค่ำคืนดึงดูดแมลงและสัตว์เลื้อยคลานให้ตกลงไปในความตาย ชาวบ้านท้องถิ่นเชื่อว่าหลุมแห่งนี้คือประตูเชื่อมต่อไปยังนรกภูมิที่มีปีศาจไฟสิงสถิตอยู่",
    story_en: "The Gates of Hell (Darvaza Gas Crater) is a gargantuan fiery chasm 70 meters wide and 30 meters deep located in the heart of the Karakum Desert, Turkmenistan. Ignited during a Soviet drilling collapse in 1971 to burn off methane, the raging inferno has burned without ceasing for over half a century. Known locally as the Gateway to the Underworld, nomadic lore whispers of fire jinn and subterranean spirits stirring beneath the glowing red caldera.",
    folklore_history_th: "แม้จุดกำเนิดทางกายภาพจะเกิดจากความผิดพลาดทางวิศวกรรมของสหภาพโซเวียต แต่ในความเชื่อดั้งเดิมของชาวเติร์กเมน ทะเลทรายคาราคุม (ทรายดำ) ถูกมองว่าเป็นดินแดนแห่งวิญญาณญินไฟมานานหลายศตวรรษ",
    folklore_history_en: "While the initial combustion stems from a 1971 Soviet exploration accident, the crater rapidly entered local Turkmen and Silk Road mythology, personifying traditional desert tales of subterranean fire demons.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Darvaza_gas_crater", "Karakum_Desert", "Ahal_Region"],
    videoQuery: "Gates of Hell Darvaza gas crater Turkmenistan documentary"
  },
  {
    id: "pin-simurgh",
    title_th: "วิหคเพลิงสิเมิร์ก (พญานกปราชญ์อมตะแห่งเทือกเขาแอลบอร์ซ)",
    title_en: "Simurgh: The Immortal Benevolent Phoenix of Persian Lore",
    category: "sacred",
    province_th: "มาซันดาราน",
    province_en: "Mazandaran",
    district_th: "ยอดเขาดามาวันด์",
    district_en: "Mount Damavand",
    lat: 35.9511,
    lng: 52.1094,
    story_th: "สิเมิร์ก (Simurgh) คือพญาวิหคศักดิ์สิทธิ์และอมตะในเทพปกรณัมเปอร์เซียโบราณ มีขนาดมหึมาจนปีกบดบังแสงอาทิตย์ ลำตัวมีเกล็ดและขนนกยูง หัวเป็นสุนัขหรือสิงโต มีกรงเล็บทรงพลัง สิเมิร์กมีอายุยืนยาวกว่า 1,700 ปีและรู้เห็นการล่มสลายของโลกมาแล้วถึงสามครั้ง พระองค์อาศัยอยู่บนยอดเขาสูงเสียดฟ้าอย่างยอดเขาดามาวันด์ ทรงเปี่ยมด้วยความรอบรู้ทางการแพทย์และเวทมนตร์ ในมหากาพย์ชาห์นาเมห์ สิเมิร์กเป็นผู้เลี้ยงดูซาล (Zal) วีรบุรุษผมขาวและช่วยทำคลอดให้แก่รุสตัม",
    story_en: "The Simurgh is the benevolent, mythical bird of Persian literature and Zoroastrian tradition, dwelling upon the misty crags of Mount Damavand in the Alborz Mountains. Depicted as a peacock with the head of a dog or lion and claws of an eagle, she is so ancient she witnessed the destruction of the world thrice. Possessing boundless divine wisdom and medical healing mastery, she sheltered the abandoned hero Zal and delivered Rustam into the world.",
    folklore_history_th: "สิเมิร์กเป็นสัญลักษณ์แห่งการหลุดพ้นทางจิตวิญญาณในบทกวีซูฟีชื่อดัง 'การประชุมของนก' (The Conference of the Birds) ของฟาริด อัลดิน อัตตาร์ ในศตวรรษที่ 12 ซึ่งแสดงถึงการค้นพบพระเจ้าภายในจิตตนเอง",
    folklore_history_en: "Beyond Ferdowsi's epic 'Shahnameh', the Simurgh became the supreme mystic metaphor in Sufi Islam, immortalized in Attar of Nishapur's 12th-century masterpiece 'The Conference of the Birds'.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Simurgh", "Mount_Damavand", "Shahnameh"],
    videoQuery: "Simurgh Persian mythology phoenix bird Shahnameh"
  },
  {
    id: "pin-div-e-sepid",
    title_th: "ดีฟเซปิด (พญาอสูรยักษ์ขาวแห่งแคว้นมาซานดารัน)",
    title_en: "Div-e Sepid: The White Demon Chieftain of Mazandaran",
    category: "monster",
    province_th: "มาซันดาราน",
    province_en: "Mazandaran",
    district_th: "ป่าทึบแคสเปียน",
    district_en: "Hyrcanian Forests",
    lat: 36.5000,
    lng: 52.0000,
    story_th: "ดีฟเซปิด (Div-e Sepid แปลว่า 'อสูรขาว') คือเจ้าแห่งปีศาจดีฟ (Divs) และเป็นศัตรูที่น่าเกรงขามที่สุดในมหากาพย์ชาห์นาเมห์ มีร่างกายเป็นยักษ์ใหญ่โตดั่งขุนเขา ผิวหนังสีขาวโพลน มีเขาแหลมคมสองข้าง และเชี่ยวชาญเวทมนตร์ดำบงการพายุ ลูกเห็บ และความมืด ดีฟเซปิดได้ร่ายมนต์ทำให้กองทัพและกษัตริย์เปอร์เซียตาบอดสนิทและขังไว้ในถ้ำมืด จนกระทั่งวีรบุรุษรุสตัม (Rostam) บุกเดี่ยวผ่านด่านเคราะห์ทั้งเจ็ดและสังหารพญายักษ์ขาว ผ่าเอาหัวใจและตับมาทำยารักษาดวงตาของกษัตริย์",
    story_en: "Div-e Sepid ('The White Demon') is the terrifying arch-demon and ruler of the divs of Mazandaran in the Persian national epic 'Shahnameh'. Towering like a snow-clad mountain with chalk-white skin, sharp horns, and sorcerous mastery over blizzards and darkness, he blinded the Persian king and imperial army with dark witchcraft. The hero Rostam undertook seven heroic trials (Haft Khan) to slay the beast in his subterranean cavern, using its liver to miraculously restore the blinded king's sight.",
    folklore_history_th: "ในตำนานเปอร์เซียโบราณ แคว้นมาซานดารันริมทะเลแคสเปียนซึ่งมีป่าดงดิบเฮอร์คาเนียน (Hyrcanian Forests) ที่เก่าแก่และรกชัฏ ถูกมองว่าเป็นดินแดนลี้ลับของเหล่าอมนุษย์และพ่อมดมนต์ดำที่แยกขาดจากที่ราบสูงเปอร์เซีย",
    folklore_history_en: "Mazandaran's ancient UNESCO-protected Hyrcanian forests along the southern Caspian coast historically formed an impenetrable, humid wilderness mythologized by ancient Persians as an untamed domain of demons and sorcerers.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Div-e_Sepid", "Mazandaran_Province", "Hyrcanian_forests"],
    videoQuery: "Div e Sepid White Demon Rostam Persian mythology"
  },
  {
    id: "pin-aral-sea-ghost",
    title_th: "สุสานเรือผีแห่งทะเลอารัล (อาถรรพ์ผืนน้ำที่สาบสูญแห่งมูยนัค)",
    title_en: "Ghost Ships of the Aral Sea: The Desert Ship Cemetery of Muynak",
    category: "ghost",
    province_th: "การากัลปักสถาน",
    province_en: "Karakalpakstan",
    district_th: "มูยนัค",
    district_en: "Muynak",
    lat: 43.7667,
    lng: 59.0333,
    story_th: "ท่ามกลางผืนทะเลทรายแห้งแล้งสีเทาของเมืองมูยนัคในอุซเบกิสถาน ซากเรือประมงสนิมเขรอะขนาดยักษ์นับสิบลำจอดเกยตื้นอยู่บนสันทรายที่ครั้งหนึ่งเคยเป็นก้นบึ้งของทะเลอารัล (Aral Sea) ซึ่งเหือดแห้งหายไปกว่า 90% จากโครงการชลประทานในยุคโซเวียต ยามค่ำคืน ลมทะเลทรายที่พัดผ่านโครงกระดูกเรือเหล็กจะส่งเสียงหวีดหวิวคล้ายเสียงคร่ำครวญของกะลาสีเรือที่สาบสูญ และมีรายงานการพบเห็นภาพลวงตาของผืนน้ำและแสงไฟเรือผีที่แล่นอยู่กลางทะเลทราย",
    story_en: "Resting on the arid toxic sands of Muynak, Uzbekistan, lies humanity's most striking ecological graveyard—the abandoned rusting ghost fleet of the vanished Aral Sea. Once the world's fourth-largest inland sea, diverting its rivers dried up 90% of its volume. Today, colossal trawlers sit marooned in a desert of salt and dust. Nomadic shepherds speak of nocturnal phantom lights flicking across bridge consoles and mournful howling winds echoing from rusted iron hulls.",
    folklore_history_th: "ทะเลอารัลยังเป็นที่ตั้งของเกาะวอซโรชเดนิยา (Vozrozhdeniya Island) ซึ่งเคยเป็นศูนย์ทดลองอาวุธชีวภาพลับสุดยอดของโซเวียต ทำให้เกิดเรื่องเล่าลือเกี่ยวกับสิ่งมีชีวิตกลายพันธุ์และวิญญาณของผู้เสียชีวิตจากเชื้อโรคร้าย",
    folklore_history_en: "Beyond the haunting ship cemetery, the Aral basin hosted the top-secret Soviet bioweapons testing facility at Vozrozhdeniya Island, birthing modern post-Cold War folklore of military ghosts and mutant entities.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Aral_Sea", "Moʻynoq", "Karakalpakstan"],
    videoQuery: "Aral sea ghost ships Muynak Uzbekistan desert"
  },
  {
    id: "pin-samarkand-timur-tomb",
    title_th: "คำสาปสุสานติมูร์ (คำเตือนสงครามโลกจากกูร์เอมีร์แห่งซามาร์คันด์)",
    title_en: "The Curse of Timur's Tomb: The Doom Prophecy of Gur-e-Amir",
    category: "curse",
    province_th: "ซามาร์คันด์",
    province_en: "Samarkand",
    district_th: "สุสานกูร์เอมีร์",
    district_en: "Gur-e-Amir Mausoleum",
    lat: 39.6486,
    lng: 66.9686,
    story_th: "กูร์เอมีร์ (Gur-e-Amir) คือสุสานหลวงทรงโดมสีฟ้าครามอันวิจิตรในเมืองซามาร์คันด์ ประเทศอุซเบกิสถาน ที่ฝังพระศพของ 'ติมูร์มหาราช' (Tamerlane) จอมทัพผู้พิชิตแห่งเอเชียกลาง บนโลงหินหยกดำของพระองค์มีจารึกคำสาปเตือนไว้ว่า: 'ผู้ใดที่เปิดหลุมฝังศพของข้า จะต้องปลดปล่อยผู้รุกรานที่น่าสะพรึงกลัวยิ่งกว่าข้าออกมา' ในวันที่ 20 มิถุนายน 1941 นักมานุษยวิทยาโซเวียตได้เปิดโลงศพของติมูร์ออก และในอีกเพียง 2 วันถัดมา กองทัพนาซีเยอรมันก็ได้เปิดฉากบุกโจมตีสหภาพโซเวียตในปฏิบัติการบาร์บารอสซา นำไปสู่สงครามที่คร่าชีวิตผู้คนนับสิบล้าน",
    story_en: "Gur-e-Amir is the azure-domed mausoleum in Samarkand, Uzbekistan, housing the remains of the ruthless Turco-Mongol conqueror Timur (Tamerlane). Carved into his dark jade cenotaph was an ominous curse: 'Whosoever opens my tomb shall unleash an invader more terrible than I.' On June 20, 1941, Soviet anthropologists opened Timur's casket. Less than 48 hours later, Nazi Germany launched Operation Barbarossa against the USSR, igniting the bloodiest conflict in human history.",
    folklore_history_th: "เรื่องราวกลายเป็นตำนานยิ่งขึ้นเมื่อสตาลินสั่งให้นำอัฐิของติมูร์ไปบรรจุคืนสู่สุสานเดิมตามพิธีอิสลามในเดือนพฤศจิกายน 1942 และหลังจากนั้นไม่กี่วัน กองทัพโซเวียตก็สามารถพลิกสถานการณ์และได้รับชัยชนะในยุทธการสตาลินกราด",
    folklore_history_en: "The curse gained legendary status when Joseph Stalin ordered Timur's remains reburied with full Islamic honors in November 1942; shortly thereafter, the Red Army secured its decisive historic triumph at Stalingrad.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Gur-e-Amir", "Timur", "Samarkand"],
    videoQuery: "Curse of Timur tomb Samarkand Gur e Amir Uzbekistan"
  },
  {
    id: "pin-charyn-witch-valley",
    title_th: "หุบผาแม่มดแห่งชาริน (เสาหินปราสาทปีศาจกลางสเตปป์คาซัค)",
    title_en: "Valley of Castles: The Witch Gorge of Charyn Canyon",
    category: "legend",
    province_th: "อัลมาตี",
    province_en: "Almaty Region",
    district_th: "หุบเขาชาริน",
    district_en: "Charyn Canyon",
    lat: 43.3500,
    lng: 79.0833,
    story_th: "หุบเขาชาริน (Charyn Canyon) ในประเทศคาซัคสถาน คือแกรนด์แคนยอนแห่งเอเชียกลางที่ทอดตัวยาวกว่า 154 กิโลเมตร ท่ามกลางหน้าผาหินทรายสีแดงสด มีบริเวณที่เรียกว่า 'หุบผาปราสาท' (Valley of Castles) ซึ่งธรรมชาติได้กัดเซาะหินจนมีรูปร่างคล้ายป้อมปราการ สัตว์ประหลาด และแม่มดยืนเรียงราย ชนเผ่าเร่ร่อนคาซัคโบราณเล่าขานว่าในคืนเดือนมืด ลมที่พัดผ่านซอกผาจะส่งเสียงโหยหวนเหมือนเสียงแม่มดและปีศาจกำลังทำพิธีกรรม และมีเรื่องเล่าของม้าศึกที่ตกใจกระโดดลงสู่ก้นเหวอย่างปริศนา",
    story_en: "Charyn Canyon in southeastern Kazakhstan is Central Asia's Grand Canyon, spanning 154 kilometers of towering red sedimentary rock. Its most legendary section, the 'Valley of Castles', features surreal spires resembling ancient fortresses, gargoyles, and petrified witches. Kazakh nomad folklore recounts that predatory spirits and witches dwell within the clefts, using uncanny whistling winds to spook horses and drive travelers off sheer precipices into the roaring Charyn River.",
    folklore_history_th: "หุบเขาชารินยังเป็นแหล่งอนุรักษ์ต้นแอชดึกดำบรรพ์ยุคน้ำแข็ง (Sogdian Ash Grove) ซึ่งรอดพ้นจากการสูญพันธุ์มาได้หลายล้านปี ชนพื้นเมืองถือว่าป่าแอชแห่งนี้เป็นป่าศักดิ์สิทธิ์ที่มีพลังพิทักษ์ธรรมชาติ",
    folklore_history_en: "Within the canyon thrives a relict grove of Sogdian ash trees that survived the Ice Age for millions of years, revered by nomadic tribes as a primeval sanctuary protected by protective spirits of the steppe.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Charyn_Canyon", "Almaty_Region", "Kazakh_steppe"],
    videoQuery: "Charyn Canyon Kazakhstan Valley of Castles mystery"
  },

  // ================= 4. CENTRAL, EAST & SOUTHERN AFRICA & MADAGASCAR (6) =================
  {
    id: "pin-mokele-mbembe",
    title_th: "โมเคเล-เอ็มเบมเบ (ไดโนเสาร์ซอโรพอดผู้ยังมีชีวิตแห่งบึงทะเลสาบเตเล)",
    title_en: "Mokele-mbembe: The Living Sauropod Dinosaur of Lake Tele",
    category: "monster",
    province_th: "คูแว็ต-อุสต์",
    province_en: "Cuvette-Ouest",
    district_th: "ทะเลสาบเตเล",
    district_en: "Lake Tele",
    lat: 1.3400,
    lng: 17.1500,
    story_th: "โมเคเล-เอ็มเบมเบ (Mokèlé-mbèmbé แปลว่า 'ผู้หยุดการไหลของสายน้ำ' ในภาษาลิงกาลา) คือสัตว์ประหลาดดึกดำบรรพ์ในป่าดิบชื้นลึกแห่งลุ่มแม่น้ำคองโกและทะเลสาบเตเล ชนเผ่าปิ๊กมีบรรยายว่ามันมีขนาดเท่าช้างหรือใหญ่กว่า มีคอยาว มีหัวเล็กคล้ายงู ขาสี่ข้างขนาดใหญ่ และหางยาวทรงพลังคล้ายไดโนเสาร์ซอโรพอดกินพืช อาศัยอยู่ในถ้ำใต้น้ำริมฝั่งแม่น้ำ มันมีอาณาเขตหวงแหนและมักคว่ำเรือแคนูของชาวบ้าน พร้อมสังหารฮิปโปโปเตมัสที่บุกรุกถิ่นอาศัย",
    story_en: "Mokèlé-mbèmbé ('one who stops the flow of rivers' in Lingala) is cryptozoology's most famous living dinosaur cryptid, reported deep in the impenetrable swamps around Lake Tele in the Congo Basin. Pygmy and Bantu hunters describe a semi-aquatic behemoth larger than an elephant with a long flexible neck, small reptilian head, muscular tail, and rounded three-clawed footprints matching an herbivorous sauropod dinosaur.",
    folklore_history_th: "ตั้งแต่ศตวรรษที่ 18 มีนักสำรวจชาวตะวันตกและนักสัตววิทยาจัดทริปสำรวจคองโกนับสิบครั้งเพื่อค้นหาหลักฐาน แม้ยังไม่มีซากฟอสซิลสดหรือภาพถ่ายชัดเจน แต่ความสม่ำเสมอของคำบอกเล่าของชาวเผ่าที่ไม่เคยเห็นหนังสือไดโนเสาร์มาก่อนยังคงเป็นปริศนา",
    folklore_history_en: "Reported by French missionaries as early as 1776 and pursued by dozens of scientific expeditions throughout the 20th century, the consistent testimonies of isolated Pygmy tribesmen continue to captivate evolutionary biologists and cryptozoologists.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Mokele-mbembe", "Lake_Tele", "Congo_Basin"],
    videoQuery: "Mokele mbembe living dinosaur Congo Lake Tele"
  },
  {
    id: "pin-kalanoro",
    title_th: "คาลานอโร (มนุษย์แคระป่าดงหนามหินปูนแห่งมาดากัสการ์)",
    title_en: "Kalanoro: The Telepathic Dwarf Spirits of Madagascar's Tsingy",
    category: "monster",
    province_th: "เมลากี",
    province_en: "Melaky",
    district_th: "อุทยานแห่งชาติซิงจี เดอ เบมาราฮา",
    district_en: "Tsingy de Bemaraha",
    lat: -18.6667,
    lng: 44.7167,
    story_th: "คาลานอโร (Kalanoro) คือสิ่งมีชีวิตลึกลับคล้ายมนุษย์แคระในตำนานพื้นบ้านของชาวมาดากัสการ์ มีความสูงไม่เกิน 3 ฟุต ร่างกายปกคลุมด้วยขนสีน้ำตาลหรือสีเงิน มีเล็บยาวแหลมคม และเท้าหันกลับหลัง อาศัยอยู่ตามซอกถ้ำในป่าหินปูนหนามแหลม 'ซิงจี' (Tsingy de Bemaraha) เล่ากันว่าคาลานอโรสามารถสื่อสารผ่านโทรจิตได้ มีความรู้เรื่องสมุนไพรรักษาโรค แต่หากถูกรบกวน มันจะขโมยเด็กทารกจากหมู่บ้าน หรือสาปให้พรานป่าหลงทางอยู่ในเขาวงกตหินปูนจนเสียชีวิต",
    story_en: "The Kalanoro are elusive, telepathic humanoid forest sprites ingrained in Malagasy folklore. Standing under three feet tall with hair covering their bodies, long sharp fingernails, and backward-facing feet, they inhabit the razor-sharp limestone labyrinths of Tsingy de Bemaraha. Revered as ancient custodians of the forest with supernatural healing knowledge, folklore cautions that disturbing them brings telepathic curses or the abduction of infants.",
    folklore_history_th: "นักชีววิทยาบางคนตั้งสมมติฐานว่าตำนานคาalanoro อาจสืบทอดมาจากความทรงจำเรื่องลีเมอร์ยักษ์ที่สูญพันธุ์ไปแล้ว (เช่น Hadropithecus หรือ Babakotia) หรือประชากรมนุษย์แคระกลุ่มแรกๆ ที่เข้ามาตั้งรกรากบนเกาะมาดากัสการ์ก่อนคลื่นชาวออสโตรนีเชียน",
    folklore_history_en: "Primatologists hypothesize that Kalanoro folklore preserves collective cultural memories of subfossil giant lemurs or early pygmy human arrivals who colonized Madagascar prior to modern Austronesian and Bantu migrations.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Tsingy_de_Bemaraha_National_Park", "Melaky", "Madagascar"],
    videoQuery: "Kalanoro Madagascar myth cryptid Tsingy"
  },
  {
    id: "pin-skeleton-coast-ghosts",
    title_th: "ชายฝั่งโครงกระดูก (ประตูนรกและสุสานเรืออับปางแห่งนามิเบีย)",
    title_en: "The Skeleton Coast: The Gates of Hell and Shipwreck Graveyard",
    category: "curse",
    province_th: "คูเนเน",
    province_en: "Kunene Region",
    district_th: "อุทยานแห่งชาติชายฝั่งโครงกระดูก",
    district_en: "Skeleton Coast National Park",
    lat: -19.0000,
    lng: 12.5000,
    story_th: "ชายฝั่งโครงกระดูก (Skeleton Coast) ทางตอนเหนือของประเทศนามิเบีย คือหนึ่งในชายฝั่งทะเลที่อันตรายและน่าสะพรึงกลัวที่สุดในโลก ชนเผ่าบุชเมนเรียกที่นี่ว่า 'แผ่นดินที่พระเจ้าทรงสร้างขึ้นด้วยความพิโรธ' ส่วนชาวโปรตุเกสขนานนามว่า 'ประตูนรก' ตลอดแนวชายหาดที่หมอกหนาปกคลุม เต็มไปด้วยโครงกระดูกของวาฬ แมวน้ำ และซากเรืออับปางขึ้นสนิมนับพันลำ กะลาสีเรือที่รอดชีวิตจากการจมเรือมักต้องเผชิญกับชะตากรรมที่โหดร้ายกว่า เพราะเบื้องหน้าคือคลื่นยักษ์ ส่วนเบื้องหลังคือทะเลทรายนามิบอันไร้น้ำที่ทอดยาวหลายร้อยกิโลเมตร",
    story_en: "The Skeleton Coast in northern Namibia is one of the planet's most desolate and deadly shorelines. Indigenous San Bushmen referred to it as 'The Land God Made in Anger', while early Portuguese mariners branded it 'The Gates of Hell'. Dense sea fogs and treacherous Benguela ocean currents have wrecked thousands of ships, leaving rusting hulls surrounded by bleached whale bones. Marooned sailors survived drowning only to face fatal thirst in the endless dunes of the Namib Desert.",
    folklore_history_th: "ซากเรืออับปางที่มีชื่อเสียง เช่น เรือ Eduard Bohlen ที่จมในปี 1909 ปัจจุบันถูกทะเลทรายกลืนกินจนตั้งอยู่กลางเนินทรายห่างจากชายฝั่งกว่า 400 เมตร กลายเป็นสัญลักษณ์ของพลังธรรมชาติที่ไม่อาจต้านทานได้",
    folklore_history_en: "Famous shipwrecks like the Eduard Bohlen, stranded in 1909 and now lying stranded 400 meters inland swallowed by moving sand dunes, stand as eerie monuments to maritime tragedies and phantom desert mirages.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Skeleton_Coast", "Namib_Desert", "Kunene_Region"],
    videoQuery: "Skeleton Coast Namibia shipwreck graveyard documentary"
  },
  {
    id: "pin-nyaminyami",
    title_th: "นยามินยามิ (เทพเจ้าพญางูสายน้ำซัมเบซีผู้พิโรธต่อเขื่อนคาริบา)",
    title_en: "Nyaminyami: The Zambezi River God's Wrath at Kariba Dam",
    category: "sacred",
    province_th: "มาโชนาแลนด์ตะวันตก",
    province_en: "Mashonaland West",
    district_th: "เขื่อนคาริบา",
    district_en: "Kariba Dam",
    lat: -16.5258,
    lng: 28.7617,
    story_th: "นยามินยามิ (Nyaminyami) คือเทพเจ้ามังกรสายน้ำแห่งแม่น้ำซัมเบซีตามความเชื่อของชาวเผ่าบาตองกา (BaTonga) ในซิมบับเวและแซมเบีย มีรูปร่างเป็นงูยักษ์ที่มีหัวคล้ายปลา พระองค์เป็นผู้พิทักษ์สายน้ำและหล่อเลี้ยงชีวิตผู้คน ตำนานเล่าว่าในช่วงทศวรรษ 1950 เมื่อมีการสร้างเขื่อนคาริบาขวางกั้นแม่น้ำซัมเบซี ทำให้นยามินยามิต้องพลัดพรากจากคู่ครอง เทพเจ้านยามินยามิจึงพิโรธ บันดาลให้เกิดมหาอุทกภัยน้ำท่วมใหญ่และแผ่นดินไหวหลายครั้งจนพังทลายสิ่งก่อสร้างและคร่าชีวิตคนงานไปหลายร้อยคน",
    story_en: "Nyaminyami, the Zambezi River God, is the supreme dragon-serpent deity of the BaTonga people across Zimbabwe and Zambia. Bearing the serpentine body of a dragon and head of a fish, he is the eternal spirit of the Zambezi. In the 1950s, when colonial engineers erected the Kariba Dam—severing Nyaminyami from his beloved mate downstream—the river god unleashed catastrophic 1,000-year floods and violent seismic tremors that obliterated cofferdams and claimed hundreds of workers' lives.",
    folklore_history_th: "ชาวบาตองกายังคงสวมใส่จี้แกะสลักรูปนยามินยามิทำจากไม้หรือกระดูกเพื่อความเป็นสิริมงคล และเชื่อว่าแผ่นดินไหวรอบเขื่อนคาริบาที่เกิดขึ้นเป็นระยะคือการสั่นสะเทือนของเทพเจ้าที่พยายามว่ายกลับมาหาคู่ครอง",
    folklore_history_en: "BaTonga artisans still carve intricate walking sticks and amulets depicting Nyaminyami. Frequent seismic activity around Lake Kariba is culturally interpreted as the trapped river god thrashing against the concrete barrage in longing for his mate.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Nyaminyami", "Kariba_Dam", "Zambezi"],
    videoQuery: "Nyaminyami Zambezi river god Kariba Dam legend"
  },
  {
    id: "pin-maasai-enkayi",
    title_th: "โอลดอยนโยเลงไก (ภูเขาไฟแห่งพระเจ้าและลาวาภูตสีดำของชาวมาไซ)",
    title_en: "Ol Doinyo Lengai: The Mountain of God and Black Carbonatite Lava",
    category: "sacred",
    province_th: "อารูชา",
    province_en: "Arusha Region",
    district_th: "ทะเลสาบนาตรอน",
    district_en: "Lake Natron",
    lat: -2.7644,
    lng: 35.9144,
    story_th: "โอลดอยนโยเลงไก (Ol Doinyo Lengai แปลว่า 'ภูเขาแห่งพระเจ้า' ในภาษามาไซ) คือภูเขาไฟมีพลังที่แปลกประหลาดที่สุดในโลก ตั้งอยู่ทางตอนเหนือของแทนซาเนียใกล้ทะเลสาบนาตรอน มันเป็นภูเขาไฟเพียงแห่งเดียวในโลกที่พ่น 'ลาวาคาร์โบนาไทต์' (Natrocarbonatite) ซึ่งมีสีดำสนิทราวกับน้ำมันดินในเวลากลางวัน และเรืองแสงสีส้มสลัวในยามค่ำคืน ชาวมาไซถือว่าภูเขาไฟลูกนี้เป็นที่ประทับของ 'เอนไค' (Enkai) พระผู้สร้างสูงสุด พวกเขาจะเดินทางมาประกอบพิธีสวดอ้อนวอนเพื่อขอลูก ฝน และความอุดมสมบูรณ์ให้แก่ฝูงวัว",
    story_en: "Ol Doinyo Lengai ('Mountain of God' in the Maasai language) is a stratovolcano rising dramatically above the scorched shores of Lake Natron in northern Tanzania. It is the only active volcano on Earth erupting natrocarbonatite lava—a bizarre, fluid black lava flowing like motor oil at low temperatures, which turns ghostly chalk-white upon contact with moisture. For the Maasai pastoralists, it is the sacred earthly throne of their supreme deity Enkai, visited on pilgrimages to pray for children and rain.",
    folklore_history_th: "ความมหัศจรรย์ทางธรณีวิทยาที่ลาวาสีดำเปลี่ยนเป็นผงสีขาวภายในไม่กี่ชั่วโมง ยิ่งตอกย้ำความเชื่อเรื่องพลังเวทมนตร์และการชำระล้างจิตวิญญาณในสายตาของนักมานุษยวิทยาและชาวแอฟริกาตะวันออก",
    folklore_history_en: "The surreal chemical transformation of pitch-black lava into stark white chalk within hours cemented Ol Doinyo Lengai as an active epicenter of Maasai cosmology and divine revelation within the East African Rift Valley.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Ol_Doinyo_Lengai", "Lake_Natron", "Maasai_people"],
    videoQuery: "Ol Doinyo Lengai Mountain of God black lava Tanzania"
  },
  {
    id: "pin-vazimba",
    title_th: "วาซิมบา (วิญญาณชนเผ่าปฐมกาลผู้สถิตในหินและต้นไม้ศักดิ์สิทธิ์)",
    title_en: "Vazimba: The Primordial Ancestral Spirits of the Central Highlands",
    category: "ghost",
    province_th: "อันตานานาริโว",
    province_en: "Antananarivo Province",
    district_th: "เทือกเขาอันคารัตรา",
    district_en: "Ankaratra",
    lat: -19.4167,
    lng: 47.3000,
    story_th: "วาซิมบา (Vazimba) ตามคติชนวิทยาของชาวมาลากาซี คือชนเผ่าดั้งเดิมกลุ่มแรกสุดที่อาศัยอยู่บนเกาะมาดากัสการ์ก่อนการอพยพมาของชาวเมรินา พวกเขาถูกพรรณนาว่ามีรูปร่างเล็ก ใบหน้ายาว ริมฝีปากบาง และมีพลังวิญญาณผูกพันกับธรรมชาติอย่างลึกซึ้ง เมื่อชาววาซิมบาเสียชีวิต หลุมฝังศพหินโบราณ (Tomb of Vazimba) และหนองน้ำศักดิ์สิทธิ์จะกลายเป็นสถานที่สถิตของวิญญาณบรรพบุรุษ หากผู้ใดละเมิดกฎข้อห้าม (Fady) เช่น กินเนื้อหมูหรือชี้มือไปที่หลุมศพ จะถูกวิญญาณวาซิมบาสาปให้เจ็บป่วยอย่างลึกลับ",
    story_en: "The Vazimba are the mythical and historical proto-ancestors of Madagascar, said to have inhabited the lush Central Highlands before the rise of the Merina Kingdom. Depicted as diminutive forest dwellers possessing supernatural affinity with wild nature, their ancient megalithic tombs and sacred springs are heavily venerated. Violating local 'fady' (ancestral taboos)—such as bringing pork near a Vazimba shrine—is said to invoke severe ancestral vengeance.",
    folklore_history_th: "ความเชื่อเรื่อง 'ฟาดี' (Fady) หรือข้อห้ามทางวิญญาณของชาววาซิมบายังคงเข้มแข็งมากในสังคมมาดากัสการ์ปัจจุบัน ผู้คนยังคงนำน้ำผึ้งและเหล้ารัมมาเซ่นไหว้ที่ก้อนหินวาซิมบาเพื่อขอพรให้หายจากโรคภัย",
    folklore_history_en: "Vazimba tombs remain deeply active ritual sanctuaries across Madagascar's highlands. Local communities regularly leave offerings of unheated honey, rum, and zebu fat to seek blessings and placate these primordial nature spirits.",
    sound_preset: "whisper",
    wikiCandidates: ["Vazimba", "Ankaratra", "Merina_Kingdom"],
    videoQuery: "Vazimba Madagascar ancestors folklore history"
  }
];

async function run() {
  console.log('Starting Batch 275 (25 new pins for Maritime SEA, Australia, Central Asia, and Africa/Madagascar)...');
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

  for (let i = 0; i < BATCH_275.length; i++) {
    const p = BATCH_275[i];
    console.log(`[${i + 1}/${BATCH_275.length}] Processing ${p.id} (${p.title_th})...`);

    const imgFile = `${p.id}.jpg`;
    const destPath = path.join(entitiesDir, imgFile);

    // Download unique wiki thumb
    const downloaded = await fetchWikiThumb(p.wikiCandidates, destPath, existingHashes);
    if (!downloaded) {
      console.log(` -> Warning: Could not find unique wiki thumb for ${p.id}, trying fallback search...`);
      for (const query of [p.province_en, p.district_en, 'Oceania', 'Australia', 'Central_Asia', 'Madagascar']) {
        const ok = await fetchWikiThumb([query], destPath, existingHashes);
        if (ok) break;
      }
    }

    // Find embeddable video
    const vid = await findEmbeddableVideo(p.videoQuery);
    console.log(` -> YouTube: ${vid.url} (${vid.title})`);

    const gallery = [
      {
        id: `${p.id}-v1`,
        type: 'youtube',
        url: vid.url,
        title: `${p.title_th} (วิดีโอประกอบเรื่องเล่า)`
      },
      {
        id: `${p.id}-m1`,
        type: 'image',
        url: `/entities/${imgFile}`,
        title: `${p.title_th} (ภาพประกอบจากวิกิพีเดีย)`
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

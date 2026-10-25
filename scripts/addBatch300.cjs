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

const BATCH_300 = [
  // ================= PACIFIC & POLYNESIA (5) =================
  {
    id: "pin-pele-volcano",
    title_th: "เปเล่ (เทพีแห่งไฟและภูเขาไฟคิลาเวอา)",
    title_en: "Pele: The Goddess of Fire & Volcanoes of Kīlauea",
    category: "sacred",
    province_th: "ฮาวาย",
    province_en: "Hawaii",
    district_th: "อุทยานแห่งชาติภูเขาไฟฮาวาย",
    district_en: "Hawaii Volcanoes National Park",
    lat: 19.4211,
    lng: -155.2869,
    story_th: "เปเล่ (Pele) คือเทพีแห่งไฟ ลาวา สายฟ้า และภูเขาไฟตามความเชื่อของชาวฮาวายโบราณ พระนางประทับอยู่ในปล่องภูเขาไฟฮาเลมาอูมาอู บนยอดภูเขาไฟคิลาเวอา เปเล่มีอุปนิสัยร้อนแรงและเอาแต่ใจ เมื่อใดที่พระนางพิโรธ ลาวาสีแดงเพลิงจะปะทุไหลทะลักลงสู่มหาสมุทรเพื่อแผ่ขยายแผ่นดินใหม่ ชาวฮาวายเชื่อในคำสาปของเปเล่ว่า 'ผู้ใดที่หยิบก้อนหินลาวาหรือทรายดำออกจากเกาะฮาวายจะพบกับความโชคร้ายและภัยพิบัติจนกว่าจะส่งหินกลับคืนสู่เกาะ'",
    story_en: "Pele is the Hawaiian goddess of fire, lightning, wind, and volcanoes, residing in the Halemaʻumaʻu crater atop Kīlauea. Revered as the creator of the Hawaiian Islands, her passionate and tempestuous nature commands the molten basalt flows. According to local lore, 'Pele's Curse' falls upon anyone who removes volcanic rocks or black sand from Hawaii, plaguing the thief with relentless misfortune until the stone is returned.",
    folklore_history_th: "ทุกๆ ปี ที่ทำการอุทยานแห่งชาติภูเขาไฟฮาวายได้รับพัสดุหลายพันชิ้นจากนักท่องเที่ยวทั่วโลกที่ส่งหินลาวากลับคืนมาพร้อมจดหมายขอขมาต่อพระแม่เปเล่หลังต้องเผชิญกับเหตุการณ์ร้ายแรง",
    folklore_history_en: "Annually, the Hawaii Volcanoes National Park receives thousands of packages from tourists worldwide returning illegally collected volcanic stones, accompanied by letters begging forgiveness from Madame Pele.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Pele_(deity)", "Kīlauea", "Halemaumau_Crater"],
    videoQuery: "Pele Hawaiian volcano goddess Kilauea legend"
  },
  {
    id: "pin-dakuwaqa",
    title_th: "ดาคูวากา (เทพเจ้าฉลามผู้พิทักษ์แห่งแนวปะการังฟิจิ)",
    title_en: "Dakuwaqa: The Shark God Guardian of the Fijian Reefs",
    category: "sacred",
    province_th: "คากาวโดรฟ",
    province_en: "Cakaudrove",
    district_th: "เกาะทาเวอูนี",
    district_en: "Taveuni",
    lat: -16.8000,
    lng: 179.9000,
    story_th: "ดาคูวากา (Dakuwaqa) คือเทพเจ้าฉลามผู้ทรงพลังในเทพปกรณัมฟิจิ พระองค์สามารถจำแลงกายเป็นฉลามยักษ์เพื่อปกป้องชาวประมงจากสัตว์ประหลาดใต้ท้องทะเลและพายุคลื่นลม ตำนานเล่าว่าดาคูวากาเคยท้าทายสิ่งมีชีวิตศักดิ์สิทธิ์ทั่วหมู่เกาะแปซิฟิกจนกระทั่งพ่ายแพ้ต่อพญาหมึกยักษ์แห่งเกาะคาเดวู พระองค์จึงให้คำมั่นว่าจะไม่ทำร้ายชาวคาเดวูและจะคอยคุ้มครองชาวเรือฟิจิที่ว่ายน้ำข้ามช่องแคบ",
    story_en: "Dakuwaqa is the formidable shark god in Fijian mythology, celebrated across the coral atolls as the fierce protector of fishermen and reef voyagers. Known as a shapeshifting deity who patrolled the southern seas as a great white shark, legend recounts his duel against a colossal giant octopus guarding Kadavu Island. Defeated, Dakuwaqa swore eternal friendship, pledging never to attack Fijians at sea.",
    folklore_history_th: "ชาวประมงพื้นเมืองในฟิจิยังมีประเพณีเทเหล้าคาวา (Kava) หรือโยนปลาสดลงทะเลเพื่อบูชาดาคูวากาก่อนออกเรือหาปลา และเชื่อว่ารอยแผลเป็นบนตัวฉลามคือเครื่องหมายของเทพเจ้า",
    folklore_history_en: "Traditional Fijian reef fishermen still pour libations of kava into the ocean before voyaging, honoring Dakuwaqa as a benevolent guardian of the deep ocean trenches.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Dakuwaqa", "Taveuni", "Fijian_mythology"],
    videoQuery: "Dakuwaqa shark god Fiji mythology legend"
  },
  {
    id: "pin-moai-mana",
    title_th: "พลังมานาแห่งโมไอ (รูปสลักหินบรรพบุรุษเดินได้แห่งเกาะอีสเตอร์)",
    title_en: "Mana of the Moai: The Walking Stone Ancestors of Rapa Nui",
    category: "sacred",
    province_th: "เกาะอีสเตอร์",
    province_en: "Isla de Pascua",
    district_th: "ราโนรารากู",
    district_en: "Rano Raraku",
    lat: -27.1212,
    lng: -109.3667,
    story_th: "โมไอ (Moai) คือรูปสลักหินขนาดยักษ์เกือบ 1,000 ตัวบนเกาะราปานุย (เกาะอีสเตอร์) กลางมหาสมุทรแปซิฟิก สร้างขึ้นโดยชาวโพลินีเชียโบราณเพื่อบรรจุ 'มานา' (Mana) หรือพลังงานจิตวิญญาณอันศักดิ์สิทธิ์ของบรรพบุรุษเพื่อแผ่บารมีคุ้มครองเผ่าพันธุ์ ตำนานพื้นบ้านเล่าว่าในอดีต โมไอไม่ได้ถูกลากด้วยเชือก แต่เหล่านักบวชชั้นสูงใช้เวทมนตร์และพลังมานาสวดภาวนาทำให้หินยักษ์หนักหลายสิบตัน 'เดิน' ก้าวเท้าโยกย้ายจากเหมืองหินราโนรารากูไปยังแท่นบูชาอาฮูริมชายหาดได้เอง",
    story_en: "The Moai are monumental monolithic stone statues carved by the Rapa Nui people on Easter Island between 1250 and 1500 AD. Embodying the concentrated 'mana' (spiritual essence) of deified royal ancestors, they face inland to cast protective energy over villages. Island oral history insists that the gigantic multi-ton statues were not dragged, but were commanded by powerful ariki priests to 'walk' rhythmically across the island to their ahu platforms.",
    folklore_history_th: "การทดลองทางโบราณคดียุคใหม่พบว่าการผูกเชือกสามทิศทางสามารถทำให้โมไอโยกซ้ายขวาและขยับไปข้างหน้าได้คล้ายการเดินจริง ซึ่งสอดคล้องกับตำนานการเดินของหินอย่างน่าประหลาดใจ",
    folklore_history_en: "Modern archaeological experiments confirmed that using three coordinated ropes allowed teams to rock the upright Moai from side to side, causing them to literally 'walk' forward as described in Rapa Nui folklore.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Moai", "Rano_Raraku", "Easter_Island"],
    videoQuery: "Moai statues Easter Island walking legend Rapa Nui"
  },
  {
    id: "pin-nan-madol-ruins",
    title_th: "นครลอยน้ำนันมาดอล (อาถรรพ์เมืองหินบะซอลต์และมนต์สะกดแห่งโพห์นเปย์)",
    title_en: "Nan Madol: The Venice of the Pacific and The Magicians' Sinking City",
    category: "legend",
    province_th: "โพห์นเปย์",
    province_en: "Pohnpei",
    district_th: "เกาะเทมเวน",
    district_en: "Temwen Island",
    lat: 6.8450,
    lng: 158.3347,
    story_th: "นันมาดอล (Nan Madol) คือเมืองโบราณอันลี้ลับที่สร้างขึ้นบนเกาะเทียม 92 เกาะกลางทะเลสาบน้ำเค็มชายฝั่งเกาะโพห์นเปย์ ประเทศไมโครนีเซีย ตัวปราสาทสร้างจากแท่งหินบะซอลต์หกเหลี่ยมขนาดยักษ์หนักหลายตันเรียงซ้อนกันเป็นกำแพงสูง ตำนานพื้นบ้านเล่าว่าสองพี่น้องพ่อมด 'โอลิซีปาและโอโลโซปา' ใช้พลังเวทมนตร์และมังกรบินลอยหินข้ามทะเลมาจากแดนไกลเพื่อสร้างเมืองหลวงแห่งนี้ ชาวบ้านเชื่อว่ามีวิญญาณบรรพบุรุษผู้พิทักษ์และคำสาปร้ายกาจคอยลงทัณฑ์ผู้ที่บุกรุกยามค่ำคืน",
    story_en: "Nan Madol is an enigmatic megalithic city constructed atop 92 artificial islets in a tidal lagoon on Pohnpei, Micronesia. Built from stacked prismatic basalt columns weighing thousands of tons, oral tradition credits the twin sorcerer brothers Olisihpa and Olosohpa, who levitated the colossal stones using flying dragons and ancient chants. Local islanders avoid the ruins after twilight, fearing wrathful ghost sentinels guarding sunken underwater tombs.",
    folklore_history_th: "นันมาดอลได้รับการขนานนามว่าเป็น 'แอตแลนติสแห่งแปซิฟิก' และเชื่อกันว่าเป็นแรงบันดาลใจให้ เอช.พี. เลิฟคราฟท์ (H.P. Lovecraft) เขียนถึงเมืองโบราณใต้น้ำ 'รลีเยห์' (R'lyeh) ของคธูลู",
    folklore_history_en: "Designated a UNESCO World Heritage site, Nan Madol's colossal cyclopean water architecture inspired H.P. Lovecraft's sunken cyclopean corpse-city of R'lyeh in the Cthulhu Mythos.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Nan_Madol", "Pohnpei", "Federated_States_of_Micronesia"],
    videoQuery: "Nan Madol Venice of the Pacific ancient ruins documentary"
  },
  {
    id: "pin-menehune",
    title_th: "เมเนฮูเน (มนุษย์แคระผู้สร้างสิ่งมหัศจรรย์ข้ามคืนแห่งฮาวาย)",
    title_en: "Menehune: The Mythical Master Stonemason Dwarfs of Kauai",
    category: "legend",
    province_th: "ฮาวาย",
    province_en: "Hawaii",
    district_th: "เกาะคาไว",
    district_en: "Kauai",
    lat: 21.9667,
    lng: -159.4000,
    story_th: "เมเนฮูเน (Menehune) คือชนเผ่ามนุษย์แคระในตำนานพื้นบ้านของเกาะฮาวาย โดยเฉพาะบนเกาะคาไว มีความสูงเพียง 2-3 ฟุต มีร่างกายกำยำ ใบหน้าคมเข้ม ขี้อาย และซ่อนตัวอยู่ในป่าลึกหุบเขา จุดเด่นของเมเนฮูเนคือความสามารถด้านสถาปัตยกรรมและวิศวกรรมที่ยอดเยี่ยม พวกเขาสามารถสร้างคูเมือง คลองส่งน้ำ และบ่อเลี้ยงปลาหินขนาดยักษ์อย่าง 'บ่อปลาเมเนฮูเน' (Menehune Fishpond) ให้เสร็จสมบูรณ์ได้ภายในคืนเดียว และหากงานไม่เสร็จก่อนฟ้าสาง พวกเขาจะทิ้งงานนั้นไว้ทันที",
    story_en: "The Menehune are legendary dwarfish people of ancient Hawaiian mythology, celebrated particularly on the garden isle of Kauaʻi. Standing roughly two to three feet tall with stout muscular builds, they dwell deep in hidden mountain valleys. Renowned as master craftsmen and stonemasons, they constructed sophisticated stone aqueducts and massive ocean fishponds—such as Alekoko Fishpond—in a single night of supernatural labor, vanishing before dawn.",
    folklore_history_th: "ในการสำรวจสำมะโนประชากรของกษัตริย์คาอูมูอาลิอิแห่งคาไวในปี 1820 มีการบันทึกประชากร 65 คนที่ระบุตนเองว่าเป็น 'เมเนฮูเน' ทำให้นักประวัติศาสตร์เชื่อว่าอาจเป็นชนพื้นเมืองกลุ่มแรกสุดที่อพยพมาจากหมู่เกาะมาร์เคซัสก่อนชาวตาฮิติ",
    folklore_history_en: "In an 1820 census conducted by King Kaumualiʻi on Kauaʻi, 65 residents formally registered their ethnicity as 'Menehune', suggesting the myth preserves the memory of pre-Tahitian Marquesan settler populations.",
    sound_preset: "whisper",
    wikiCandidates: ["Menehune", "Kauai", "Menehune_Fishpond"],
    videoQuery: "Menehune Hawaii legendary dwarf builders Kauai"
  },

  // ================= MIDDLE EAST & ARABIA & NEAR EAST (4) =================
  {
    id: "pin-majlis-al-jinn",
    title_th: "มัจลิส อัล-ญินน์ (สภาแห่งญินในถ้ำยักษ์ใต้พิภพแห่งโอมาน)",
    title_en: "Majlis al Jinn: The Subterranean Council Chamber of the Spirits",
    category: "legend",
    province_th: "มัสกัต",
    province_en: "Muscat Governorate",
    district_th: "ที่ราบสูงเซลมา",
    district_en: "Selma Plateau",
    lat: 22.8800,
    lng: 59.1044,
    story_th: "มัจลิส อัล-ญินน์ (Majlis al Jinn แปลว่า 'สถานที่ประชุมของเหล่าญิน') คือหนึ่งในห้องโถงถ้ำใต้ดินที่ใหญ่ที่สุดในโลก ซ่อนอยู่ใต้ที่ราบสูงหินปูนอันแห้งแล้งของประเทศโอมาน โพรงถ้ำแห่งนี้มีเพดานสูงกว่า 120 เมตร และมีปริมาตรมหาศาลจนสามารถบรรจุเครื่องบินจัมโบ้เจ็ทได้นับสิบลำ ทางเข้าถ้ำมีเพียงช่องหลุมแคบๆ บนผิวดินที่แสงแดดส่องเป็นลำลำลงมา ชาวเบดูอินโบราณเชื่อว่าถ้ำแห่งนี้ถูกสร้างขึ้นโดยพญาญินหรือยักษ์อิฟรีต (Ifrit) เพื่อใช้เป็นสถานที่ชุมนุมลับของดวงวิญญาณแห่งทะเลทราย",
    story_en: "Majlis al Jinn ('Meeting Place of the Jinn') is the second largest cave chamber by surface area on Earth, hidden beneath the remote limestone Selma Plateau in Oman. With a cavernous vault soaring 120 meters high and accessible only through narrow vertical roof drop-ins, shafts of celestial sunlight pierce the darkness. Local Bedouins held that the chasm was blasted by thunderous bolts hurled by ancient Jinn, serving as their underground council hall.",
    folklore_history_th: "ตามตำนานอาหรับโบราณ ถ้ำลึกและหุบเขาในโอมานถูกมองว่าเป็นดินแดนของวิญญาณญินที่ถูกสร้างขึ้นจากไฟไร้ควัน ซึ่งมีอำนาจเหนือมนุษย์และสามารถแปลงกายเป็นงูทะเลทรายหรือลมบ้าหมู",
    folklore_history_en: "In Omani Arabian lore, subterranean limestone caverns served as strongholds for smoky spirits and Jinn clans who fled Solomon's seal, remaining an enduring sanctuary of desert mysticism.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Majlis_al_Jinn", "Muscat_Governorate", "Selma_Plateau"],
    videoQuery: "Majlis al Jinn Oman cave meeting place of spirits"
  },
  {
    id: "pin-ghoul-arabia",
    title_th: "กูล (อสูรทะเลทรายจำแลงกินศพแห่งผืนทรายเวิ้งว้างรูบอัลคาลี)",
    title_en: "The Ghoul: The Shape-Shifting Flesh-Eater of the Rub' al Khali",
    category: "monster",
    province_th: "ริยาด",
    province_en: "Riyadh Province",
    district_th: "ทะเลทรายรูบอัลคาลี",
    district_en: "Empty Quarter",
    lat: 21.0000,
    lng: 51.0000,
    story_th: "กูล (Ghūl จากภาษาอาหรับแปลว่า 'ผู้ยึดกุม/ทำลาย') คืออสูรกายทะเลทรายในคติชนวิทยาอาหรับโบราณที่อาศัยอยู่ตามสุสานและเนินทรายเปลี่ยวในทะเลทรายรูบอัลคาลี (The Empty Quarter) กูลเป็นวิญญาณญินฝ่ายชั่วร้ายที่ชอบกินเนื้อศพมนุษย์ และมักจำแลงกายเป็นหญิงสาวสวยงามหรือแสงไฟตะเกียงกลางคืนเพื่อล่อลวงกองคาราวานให้เดินออกนอกเส้นทาง จากนั้นจะเผยโฉมหน้าที่แท้จริงพร้อมกรงเล็บและฟันแหลมคมเพื่อสังหารเหยื่อ",
    story_en: "The Ghoul (Ghūl) is a monstrous grave-robbing demon in pre-Islamic Arabian folklore, inhabiting the vast desolate wastes of the Rub' al Khali (Empty Quarter). Masters of deception, ghouls shapeshift into alluring desert maidens or phantom campfire lights to lure lost caravan travelers away from safety before tearing them apart. Only a single decisive sword strike can slay a ghoul; a second blow will miraculously revive it from the dead.",
    folklore_history_th: "เรื่องราวของกูลถูกบันทึกไว้อย่างแพร่หลายในมหากาพย์วรรณกรรมอาหรับราตรี (One Thousand and One Nights) และบทกวีเบดูอินยุคก่อนอิสลาม ซึ่งเป็นคติสอนใจให้กองคาราวานระมัดระวังภาพลวงตาและความตายกลางทะเลทราย",
    folklore_history_en: "Codified in 'One Thousand and One Nights' and pre-Islamic Bedouin poetry, the Ghoul myth warned nomads against the fatal perils of desert mirages, starvation, and cannibalistic desperation in trackless dunes.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Ghoul", "Rub'_al_Khali", "Arabian_mythology"],
    videoQuery: "Ghoul Arabian mythology desert monster origins"
  },
  {
    id: "pin-hegra-thamud",
    title_th: "สุสานหินเฮกราและอาถรรพ์สายฟ้าชนเผ่าธามุดแห่งอัลอูลา",
    title_en: "Hegra: The Rock Tombs and The Thunderous Doom of the Thamud",
    category: "curse",
    province_th: "มะดีนะฮ์",
    province_en: "Medina Province",
    district_th: "อัลอูลา",
    district_en: "AlUla",
    lat: 26.8000,
    lng: 37.9500,
    story_th: "เฮกรา (Hegra หรือ มะดาอิน ศอลิห์) คือนครโบราณที่สลักเสลาอย่างวิจิตรตระการตาบนหน้าผาหินทรายสีทองกลางทะเลทรายอัลอูลา ประเทศซาอุดีอาระเบีย สร้างขึ้นโดยชาวนาบาเทียนร่วมยุคเดียวกับเปตรา ตามคัมภีร์อัลกุรอานและตำนานอาหรับ ที่นี่เคยเป็นถิ่นอาศัยของ 'ชนเผ่าธามุด' (Thamud) ผู้โอหังและมีฝีมือแกะสลักหิน เมื่อพวกเขาปฏิเสธคำเตือนของศาสดาและฆ่า 'อูฐสาวศักดิ์สิทธิ์' พระผู้เป็นเจ้าจึงส่งเสียงกัมปนาทและสายฟ้าฟาดถล่มลงมา สังหารชนเผ่าทั้งเมืองจนกลายเป็นเถ้าถ่านในชั่วพริบตา",
    story_en: "Hegra (Mada'in Salih) in AlUla is Saudi Arabia's first UNESCO World Heritage site, featuring over 100 monumental tomb facades carved into towering sandstone monoliths by the Nabataean kingdom. In Islamic theology and Arabian tradition, it was the cursed homeland of the Thamud tribe. When the arrogant giants defied Prophet Salih and slaughtered a miraculous she-camel sent from stone, a cataclysmic acoustic blast (As-Sayhah) and lightning instantly struck down the entire civilization.",
    folklore_history_th: "เป็นเวลาหลายศตวรรษที่กองคาราวานและชาวเบดูอินปฏิเสธที่จะดื่มน้ำหรือพักค้างแรมในเฮกรา เนื่องจากเชื่อว่าเป็นดินแดนต้องคำสาปที่พระเจ้าลงทัณฑ์",
    folklore_history_en: "For centuries, trans-Arabian camel caravans hurried past Hegra without making camp, observing strict prophetic admonitions against dwelling in lands where divine punishment fell upon the wicked.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Hegra_(Mada'in_Salih)", "AlUla", "Thamud"],
    videoQuery: "Hegra AlUla Saudi Arabia cursed tombs documentary"
  },
  {
    id: "pin-zar-spirit",
    title_th: "พิธีกรรมซาร์ (มนต์สะกดขับวิญญาณแห่งลุ่มแม่น้ำไนล์)",
    title_en: "The Zār: Trance Rites and Spirit Possession of the Nile",
    category: "curse",
    province_th: "คาร์ทูม",
    province_en: "Khartoum State",
    district_th: "ออมเดอร์มาน",
    district_en: "Omdurman",
    lat: 15.6500,
    lng: 32.4833,
    story_th: "ซาร์ (Zār) คือลัทธิความเชื่อและการรักษาทางจิตวิญญาณของผู้หญิงตามลุ่มแม่น้ำไนล์และจะงอยแอฟริกา (ซูดาน อียิปต์ และเอธิโอเปีย) เชื่อกันว่าวิญญาณซาร์คือวิญญาณล่องหนที่เข้าสิงสู่ผู้หญิง ทำให้เกิดอาการเจ็บป่วย ซึมเศร้า หรือฝันร้าย โดยวิญญาณซาร์ไม่สามารถขับไล่ด้วยการปราบผีธรรมดาได้ แต่ต้องทำพิธี 'ฮัดรา' (Hadra) ด้วยการตีกลองจังหวะเร่งเร้า ร่ายรำจนเข้าภวังค์ แต่งกายหรูหรา และถวายเครื่องหอมเพื่อเจรจาปรองดองกับวิญญาณ",
    story_en: "Zār is an ecstatic healing cult and spirit possession tradition practiced across the Nile Valley and Horn of Africa, predominantly by women in Sudan and Egypt. The Zār spirits are invisible, demanding entities that manifest through physical illness, anxiety, or hysteria. Rather than an antagonistic exorcism, the patient and a female priestess (Shaykha) host multi-day hypnotic drumming rites, negotiating with the spirit through sacred dances, perfume, and sacrificial offerings.",
    folklore_history_th: "ในทางมานุษยวิทยา พิธีซาร์เป็นพื้นที่ปลดปล่อยความกดดันทางจิตใจและสังคมของผู้หญิงในสังคมดั้งเดิมที่เคร่งครัด โดยเสียงกลองและภวังค์ช่วยฟื้นฟูสภาพจิตใจของผู้เข้าร่วมพิธีอย่างน่าอัศจรรย์",
    folklore_history_en: "Anthropologists celebrate Zār as a vital female resistance institution and psychodramatic therapeutic safe-haven within traditional patriarchal societies, transforming psychiatric trauma into sacred trance empowerment.",
    sound_preset: "whisper",
    wikiCandidates: ["Zār", "Omdurman", "Nile"],
    videoQuery: "Zar spirit possession ceremony Sudan Egypt Nile"
  },

  // ================= SOUTH & CENTRAL AMERICA (6) =================
  {
    id: "pin-boto-encantado",
    title_th: "โบโต เอนคันตาโด (โลมาสีชมพูแปลงกายล่อลวงสาวแห่งแอมะซอน)",
    title_en: "Boto Encantado: The Pink River Dolphin Shapeshifter of the Amazon",
    category: "legend",
    province_th: "อามาโซนัส",
    province_en: "Amazonas",
    district_th: "มาเนาส์",
    district_en: "Manaus",
    lat: -3.1190,
    lng: -60.0217,
    story_th: "โบโต (Boto หรือ โลมาสีชมพูแห่งแม่น้ำแอมะซอน) ในตำนานพื้นบ้านของบราซิลไม่ใช่สัตว์ธรรมดา แต่เป็นสิ่งมีชีวิตกึ่งเทพที่สามารถแปลงกายเป็นชายหนุ่มรูปหล่อ ผิวขาว แต่งกายด้วยชุดสูทสีขาวล้วนและสวมหมวกฟางปีกกว้างเสมอ หมวกใบนี้มีไว้เพื่อซ่อนรูพ่นน้ำที่ยังคงอยู่บนกระหม่อมศีรษะ ในคืนเทศกาลเต้นรำริมแม่น้ำ โบโตจะขึ้นฝั่งมาเต้นรำและหว่านเสน่ห์ล่อลวงหญิงสาวที่สวยที่สุดในงาน ก่อนจะพานางลงสู่แม่น้ำแอมะซอนไปยังนครใต้น้ำ 'เอนกันเต' (Encante)",
    story_en: "The Boto Encantado ('Enchanted Dolphin') is a legendary shapeshifting pink river dolphin in Brazilian Amazonian folklore. Under the cover of twilight festivities, the dolphin transforms into an irresistibly handsome man dressed entirely in dapper white linen, wearing a straw fedora to conceal the blowhole atop his crown. He charms the most beautiful maidens at village riverside balls, impregnating them or leading them beneath the murky waters to the subterranean utopian city of Encante.",
    folklore_history_th: "ในหมู่บ้านริมแม่น้ำแอมะซอน หากหญิงสาวตั้งครรภ์โดยไม่มีพ่อ ชาวบ้านมักพูดว่า 'เป็นลูกของโบโต' ซึ่งเป็นกุศโลบายทางสังคมที่ช่วยปกป้องเกียรติของหญิงสาวและเด็กในชุมชน",
    folklore_history_en: "Across remote Amazonian ribeirinho communities, unexpected out-of-wedlock pregnancies are culturally excused as 'a child of the Boto', shielding unmarried mothers and children from community stigma.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Boto_encantado", "Amazon_river_dolphin", "Manaus"],
    videoQuery: "Boto Encantado pink river dolphin folklore Amazon"
  },
  {
    id: "pin-boitata",
    title_th: "บอยตาตา (พญางูเพลิงร้อยเนตรผู้พิทักษ์ป่าปังตานัล)",
    title_en: "Boitatá: The Fiery Serpent with a Hundred Glowing Eyes",
    category: "monster",
    province_th: "มาตูโกรสซูดูซูล",
    province_en: "Mato Grosso do Sul",
    district_th: "ปังตานัล",
    district_en: "Pantanal Wetlands",
    lat: -19.0000,
    lng: -56.5000,
    story_th: "บอยตาตา (Boitatá มาจากภาษากวารานี 'มบาย-ตาตา' แปลว่า งูไฟ) คือสิ่งมีชีวิตศักดิ์สิทธิ์ในรูปของพญางูยักษ์ที่มีเปลวเพลิงลุกท่วมตัว และมีดวงตาเรืองแสงนับร้อยดวงบนเกล็ดที่มันดูดซับมาจากสัตว์ที่ตายในยุคมหาอุทกภัย บอยตาตาเลื้อยผ่านผืนป่าและหนองน้ำปังตานัลเพื่อปกป้องธรรมชาติจากผู้ที่ลอบวางเพลิงเผาป่าหรือล่าสัตว์อย่างผิดทำนองคลองธรรม หากผู้ทำลายป่าได้สบตากับดวงตาไฟของบอยตาตา จะต้องตาบอด เป็นบ้า หรือถูกเผาไหม้จนกลายเป็นเถ้าถ่าน",
    story_en: "Boitatá (from Tupi-Guarani 'mboi-tata', serpent of fire) is a mythical giant serpent cloaked in brilliant flames that dwells within the wetlands of the Pantanal and Amazon. Surviving a prehistoric deluge by consuming the eyes of floating animal carcasses, its luminous body is studded with hundreds of incandescent eyes. A vengeful defender of wild ecology, it attacks poachers and forest arsonists, burning them to ash or blinding anyone who gazes upon its incandescent glare.",
    folklore_history_th: "บันทึกเรื่องบอยตาตาถูกเขียนขึ้นครั้งแรกโดยมิชชันนารีคณะเยซูอิต โฮเซ เด อันชีเอตา (José de Anchieta) ในปี 1560 ถือเป็นหนึ่งในตำนานชนพื้นเมืองบราซิลที่เก่าแก่ที่สุดที่มีการบันทึกเป็นลายลักษณ์อักษร",
    folklore_history_en: "Documented as early as 1560 by Jesuit priest José de Anchieta, the Boitatá represents one of the oldest recorded indigenous myths in South America, closely correlating with will-o'-the-wisp marsh gas combustions.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Boitatá", "Pantanal", "Mato_Grosso_do_Sul"],
    videoQuery: "Boitata fire serpent Brazilian mythology monster"
  },
  {
    id: "pin-cuca-alligator",
    title_th: "คูกา (แม่มดจระเข้ลักพาตัวเด็กแห่งนิทานพื้นบ้านบราซิล)",
    title_en: "Cuca: The Alligator-Headed Hag of Brazilian Lore",
    category: "monster",
    province_th: "มีนัสเชไรส์",
    province_en: "Minas Gerais",
    district_th: "โอรูเปรตู",
    district_en: "Ouro Preto",
    lat: -20.3856,
    lng: -43.5035,
    story_th: "คูกา (Cuca) คือแม่มดเฒ่าที่น่าสะพรึงกลัวที่สุดในนิทานกล่อมเด็กของบราซิล เธอมีร่างกายเป็นหญิงชราหลังค่อมแต่มีศีรษะเป็นจระเข้เคย์แมนขนาดยักษ์ มีกรงเล็บแหลมคม และเสียงหัวเราะหวีดแหลมบาดหู คูกาอาศัยอยู่ในถ้ำมืดกลางป่า ปรุงยาพิษในหม้อต้ม และนอนหลับเพียงคืนเดียวในทุกๆ 7 ปี คอยออกล่าเด็กที่ไม่ยอมนอนหลับหรือไม่เชื่อฟังพ่อแม่เพื่อจับยัดใส่กระสอบแล้วนำไปต้มกิน",
    story_en: "Cuca is one of Brazil's most iconic folkloric boogeymen, portrayed as a hideous, ancient witch possessing the body of a crone and the head of an armored caiman alligator. Residing in deep caverns and sleeping only once every seven years, her blood-curdling screech paralyzes listeners. Immortalized in the famous lullaby 'Dorme neném que a Cuca vem pegar', she steals disobedient children who refuse to sleep, spiriting them away in a burlap sack.",
    folklore_history_th: "คูกามีต้นกำเนิดมาจากปีศาจ 'โคคา' (Coca/Coco) ของโปรตุเกสและสเปน แต่เมื่อมาถึงบราซิลได้ผสมผสานเข้ากับสัตว์เลื้อยคลานท้องถิ่นอย่างจระเข้เคย์แมน จนกลายเป็นตัวละครเอกในวรรณกรรมเยาวชนคลาสสิก 'Sítio do Picapau Amarelo' ของมอนเตโร โลบาโต",
    folklore_history_en: "Derived from the Iberian 'Coca' dragon-witch, the figure evolved in Brazil into a swamp alligator hag, later popularized across Brazilian culture through Monteiro Lobato's beloved children's literary series 'Sítio do Picapau Amarelo'.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Cuca_(folklore)", "Minas_Gerais", "Ouro_Preto"],
    videoQuery: "Cuca alligator witch Brazilian folklore legend"
  },
  {
    id: "pin-caleuche",
    title_th: "เอล กาเลอูเช (เรือผีเรืองแสงแห่งหมู่เกาะชิโลเอ)",
    title_en: "El Caleuche: The Phantom Party Ship of Chiloé Archipelago",
    category: "ghost",
    province_th: "โลสลาโกส",
    province_en: "Los Lagos Region",
    district_th: "เกาะชิโลเอ",
    district_en: "Chiloé Island",
    lat: -42.5000,
    lng: -73.8000,
    story_th: "เอล กาเลอูเช (El Caleuche) คือเรือผีเรืองแสงในตำนานของหมู่เกาะชิโลเอ ทางตอนใต้ของชิลี เรือใบสีขาวลำนี้ลอยลำอยู่กลางสายหมอกหนา มีแสงไฟนีออนสว่างไสวและมีเสียงดนตรีงานรื่นเริงและเสียงหัวเราะดังกังวานไปทั่วผืนน้ำ ลูกเรือของกาเลอูเชคือวิญญาณของผู้ที่จมน้ำตายในทะเล ซึ่งถูกพรายน้ำสาว 'ปินโกยา' นำตัวขึ้นเรือเพื่อมีชีวิตอมตะในการจัดงานเลี้ยงเฉลิมฉลอง กาเลอูเชสามารถดำน้ำหายไปใต้เกลียวคลื่นหรือแปลงร่างเป็นท่อนไม้ลอยน้ำเพื่อหลบสายตาคนได้ในพริบตา",
    story_en: "El Caleuche is a legendary luminous ghost ship sailing the stormy fjords and channels of Chiloé Island in southern Chile. Manifesting as a magnificent white tall ship brilliantly illuminated with multicolored lanterns, echoes of joyful festive music, party accordion, and laughter drift from its decks across the fog. Manned by drown victims rescued by the mermaid Pincoya, the ship can submerge beneath the waves or disguise itself as a floating sea lion to evade pursuit.",
    folklore_history_th: "ชาวเกาะชิโลเอเชื่อว่าพ่อค้าในท้องถิ่นที่ร่ำรวยอย่างรวดเร็วได้ทำสัญญาลับกับเรือกาเลอูเช โดยยอมให้เรือผีมาเทียบท่าหลังบ้านยามดึกเพื่อแลกกับสินค้าผิดกฎหมายและความมั่งคั่ง",
    folklore_history_en: "Chilote lore holds that merchants who experience sudden unexplained prosperity have struck occult pacts with El Caleuche, using midnight trade contracts with the phantom crew to amass illicit fortunes.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Caleuche", "Chiloé_Island", "Los_Lagos_Region"],
    videoQuery: "El Caleuche phantom ship Chiloe Chile folklore"
  },
  {
    id: "pin-camazotz",
    title_th: "คามาซอตซ์ (เทพค้างคาวแห่งความตายและราตรีแห่งชนเผ่ามายา)",
    title_en: "Camazotz: The Death Bat God of the Mayan Popol Vuh",
    category: "monster",
    province_th: "เปเตน",
    province_en: "Petén Department",
    district_th: "อุทยานแห่งชาติติกัล",
    district_en: "Tikal",
    lat: 17.2220,
    lng: -89.6237,
    story_th: "คามาซอตซ์ (Camazotz แปลว่า 'ค้างคาวมรณะ' ในภาษาเควเช) คือเทพเจ้าค้างคาวยักษ์แห่งความตาย ความมืด และการบูชายัญในคัมภีร์โปโปลวูฮ์ (Popol Vuh) ของชาวมายา พระองค์อาศัยอยู่ใน 'โซตซีฮา' (Zotzilaha - ถ้ำแห่งค้างคาว) ในยมโลกชีบัลบา (Xibalba) มีจงอยปากและกรงเล็บคมดั่งใบมีดโกน ในมหากาพย์มายา เมื่อสองวีรบุรุษฝาแฝดฮูนาห์ปูและชบาลันเกต้องผ่านการทดสอบในถ้ำค้างคาว คามาซอตซ์ได้โฉบลงมาตัดศีรษะของฮูนาห์ปูในพริบตาเพื่อนำไปใช้แทนลูกบอลในการละเล่นของเหล่าทวยเทพยมโลก",
    story_en: "Camazotz ('death bat') is the fearsome chiropteran deity of darkness, decapitation, and human sacrifice in Mayan mythology, detailed in the K'iche' sacred text 'Popol Vuh'. Ruling over Zotzilaha (the House of Bats) in the underworld of Xibalba, his snout was an obsidian blade. When the Hero Twins Hunahpu and Xbalanque were imprisoned in the bat cave, Camazotz swooped down and sliced off Hunahpu's head, which the lords of Xibalba used as a ball in their cosmic ballcourt.",
    folklore_history_th: "นักบรรพชีวินวิทยาเชื่อว่าตำนานคามาซอตซ์อาจได้รับแรงบันดาลใจจากค้างคาวดูดเลือดยักษ์ยุคดึกดำบรรพ์ (Desmodus draculae) ที่มีขนาดใหญ่กว่าค้างคาวดูดเลือดปัจจุบันถึง 30% และเคยอาศัยอยู่ร่วมสมัยกับมนุษย์ในอเมริกากลาง",
    folklore_history_en: "Fossil discoveries suggest Camazotz mythology was inspired by Desmodus draculae, an extinct giant vampire bat with a 30-inch wingspan that coexisted with pre-Columbian Mesoamerican civilizations.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Camazotz", "Popol_Vuh", "Tikal"],
    videoQuery: "Camazotz Mayan death bat god Popol Vuh"
  },
  {
    id: "pin-cadejo",
    title_th: "คาเดโฮ (สุนัขวิญญาณขาวดำผู้พิทักษ์และล่าวิญญาณแห่งอเมริกากลาง)",
    title_en: "El Cadejo: The White Protector & Black Phantom Hounds of Central America",
    category: "legend",
    province_th: "ซานซัลวาดอร์",
    province_en: "San Salvador",
    district_th: "ภูเขาไฟซานซัลวาดอร์",
    district_en: "San Salvador Volcano",
    lat: 13.6929,
    lng: -89.2182,
    story_th: "เอล คาเดโฮ (El Cadejo) คือสุนัขวิญญาณขนาดยักษ์ในตำนานของชาวเอลซัลวาดอร์ กัวเตมาลา และอเมริกากลาง ปรากฏกายเป็นคู่ตรงข้าม: 'คาเดโฮขาว' คือวิญญาณสุนัขสีขาวบริสุทธิ์ ตาสีฟ้าอ่อน ถูกส่งมาจากพระเจ้าเพื่อคุ้มครองคนเดินทางยามดึกและคนเมาให้กลับบ้านอย่างปลอดภัย ส่วน 'คาเดโฮดำ' คือสุนัขปีศาจสีดำทมิฬ ขนหยาบ ตาแดงก่ำดั่งถ่านไฟ และมีเสียงโซ่ตรวนลากตามพื้นดิน ถูกส่งมาจากซาตานเพื่อหลอกหลอน ขโมยวิญญาณ และสังหารเหยื่อ เมื่อทั้งสองพบกันจะเกิดการต่อสู้อย่างดุเดือดเพื่อชิงชีวิตของคนเดินทาง",
    story_en: "El Cadejo is a supernatural spirit dog pervasive across Central American folklore, appearing as an eternal duality. The White Cadejo (Cadejo Blanco) is a benevolent spirit with luminous fur sent by God to guide and guard late-night wanderers and drunkards from harm. In contrast, the Black Cadejo (Cadejo Negro) is an incandescent, red-eyed demonic mastiff dragging rattling iron chains sent by Lucifer to steal souls. When they collide in lonely alleys, they clash ferociously to decide the traveler's fate.",
    folklore_history_th: "ตำนานคาเดโฮเป็นการผสมผสานระหว่างสุนัขนำทางวิญญาณ 'โซโลอิตซคูอินทลี' (Xoloitzcuintli) ของชาวเมโสอเมริกากับความเชื่อเรื่องปิศาจสุนัขล่าเนื้อของสเปนยุคอาณานิคม",
    folklore_history_en: "The Cadejo legend represents a syncretic blend of indigenous Mesoamerican spirit-dog psychopomps with Iberian colonial folk beliefs of hellhounds roaming rural crossroads.",
    sound_preset: "whisper",
    wikiCandidates: ["Cadejo", "San_Salvador", "Mesoamerican_mythology"],
    videoQuery: "El Cadejo legend Central America ghost dogs"
  },

  // ================= SCANDINAVIA & BRITISH ISLES (5) =================
  {
    id: "pin-huldufolk",
    title_th: "ฮุลดูโฟล์ก (ชนเผ่าเร้นลับในโขดหินลาวาแห่งไอซ์แลนด์)",
    title_en: "Huldufólk: The Hidden People of the Icelandic Lava Rocks",
    category: "legend",
    province_th: "เฮิฟิดบอร์การ์สแวดิด",
    province_en: "Capital Region",
    district_th: "ฮัฟนาร์ฟยอร์ดูร์",
    district_en: "Hafnarfjörður",
    lat: 64.0667,
    lng: -21.9500,
    story_th: "ฮุลดูโฟล์ก (Huldufólk หรือ Hidden People) คือชนเผ่าเร้นลับกึ่งเอลฟ์ในคติชนวิทยาของไอซ์แลนด์ พวกเขามีรูปร่างหน้าตางดงาม แต่งกายด้วยชุดย้อนยุค สวมเครื่องประดับโบราณ และใช้ชีวิตคู่ขนานกับมนุษย์โดยอาศัยอยู่ในโขดหินลาวาและหน้าผาชัน ฮุลดูโฟล์กเป็นมิตรต่อมนุษย์ที่ให้ความเคารพ แต่หากมีใครทำลายบ้านหินของพวกเขา เช่น การสร้างถนนผ่านหินศักดิ์สิทธิ์ รถแทรกเตอร์จะพัง เครื่องยนต์จะดับ หรือคนงานจะประสบอุบัติเหตุปริศนา จนทางการไอซ์แลนด์ต้องปรับเปลี่ยนเส้นทางถนนเพื่อหลบก้อนหินเอลฟ์",
    story_en: "The Huldufólk ('hidden people') are supernatural beings deeply revered across Iceland, particularly in the lava fields of Hafnarfjörður, the elf capital of Iceland. Living parallel lives in an unseen dimension inside enchanted basalt boulders, they dress in ornate historical garb. Benevolent towards respectful mortals, they fiercely protect their stone sanctuaries; construction projects that disturb elf rocks routinely suffer mechanical breakdowns until roads are officially diverted around the boulders.",
    folklore_history_th: "ผลสำรวจความคิดเห็นในไอซ์แลนด์พบว่าประชากรมากกว่าครึ่งยังคงเชื่อหรือไม่ปฏิเสธการมีอยู่ของฮุลดูโฟล์ก และกรมทางหลวงของไอซ์แลนด์มีระเบียบปฏิบัติในการปรึกษาผู้เชี่ยวชาญเรื่องเอลฟ์ก่อนสร้างถนนผ่านพื้นที่ศักดิ์สิทธิ์",
    folklore_history_en: "Surveys reveal a majority of Icelanders acknowledge or do not rule out the existence of Huldufólk. The Icelandic Road and Coastal Administration routinely consults local elf seers to reroute highways around designated elf rocks.",
    sound_preset: "whisper",
    wikiCandidates: ["Huldufólk", "Hafnarfjörður", "Icelandic_folklore"],
    videoQuery: "Huldufolk hidden people elves Iceland Hafnarfjordur"
  },
  {
    id: "pin-kraken-lofoten",
    title_th: "คราเคน (พญาสัตว์ประหลาดหมึกยักษ์กลืนเรือแห่งหมู่เกาะโลโฟเทน)",
    title_en: "The Kraken: The Colossal Ship-Crushing Cephalopod of Lofoten",
    category: "monster",
    province_th: "นอร์ดลันด์",
    province_en: "Nordland",
    district_th: "หมู่เกาะโลโฟเทน",
    district_en: "Lofoten",
    lat: 68.0000,
    lng: 13.5000,
    story_th: "คราเคน (Kraken) คืออสูรกายใต้ทะเลลึกที่น่าสะพรึงกลัวที่สุดในตำนานนอร์สและชาวประมงสแกนดิเนเวีย มันมีรูปร่างคล้ายหมึกยักษ์หรือปลาหมึกกล้วยขนาดยักษ์ที่มีหนวดยาวเป็นไมล์ ลำตัวใหญ่โตจนกะลาสีเรือมักเข้าใจผิดคิดว่าเป็นเกาะลอยน้ำ เมื่อเรือแล่นเข้าไปใกล้ คราเคนจะใช้หนวดมหึมารัดกระโดงเรือและดึงเรือทั้งลำลงสู่ก้นบึ้งของมหาสมุทร และเมื่อมันดำดิ่งลงไป จะเกิดวังน้ำวนมหาศาล (Maelstrom) ที่กลืนกินทุกสิ่งรอบข้าง",
    story_en: "The Kraken is the legendary sea leviathan of Norse mythology and Nordic maritime folklore, haunting the icy, tempestuous waters off the Lofoten archipelago. Depicted as a colossal squid or octopus of unfathomable proportions, its back was frequently mistaken by mariners for an uncharted island. When attacking, its colossal tentacles wrapped around timber masts, dragging galleons beneath the waves while its descent created catastrophic whirlpools (the Moskstraumen Maelstrom).",
    folklore_history_th: "เรื่องราวของคราเคนได้รับการบันทึกในบันทึกประวัติศาสตร์ธรรมชาติของนอร์เวย์โดยบิชอป เอริก พอนทอปปิดาน ในปี 1752 ซึ่งในปัจจุบันวิทยาศาสตร์ยืนยันว่ามีปลาหมึกยักษ์ (Giant Squid / Colossal Squid) ที่มีความยาวกว่า 13 เมตรอาศัยอยู่ในทะเลลึกจริง",
    folklore_history_en: "Documented in 1752 by Bishop Erik Pontoppidan in 'The Natural History of Norway', the Kraken myth presaged the biological verification of the giant squid (Architeuthis dux), which lurks in the abyssal oceanic trenches.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Kraken", "Lofoten", "Moskstraumen"],
    videoQuery: "Kraken legendary sea monster Norse mythology Lofoten"
  },
  {
    id: "pin-nokken-neck",
    title_th: "เนกเค่น (พรายน้ำไวโอลินสะกดจิตแห่งน้ำตกสแกนดิเนเวีย)",
    title_en: "Nøkken: The Shapeshifting Water Violinist of Scandinavian Waterfalls",
    category: "ghost",
    province_th: "เทเลมาร์ก",
    province_en: "Telemark",
    district_th: "รยูคัน",
    district_en: "Rjukan",
    lat: 59.8789,
    lng: 8.6017,
    story_th: "เนกเค่น (Nøkken หรือ Näcken) คือพรายน้ำจำแลงกายในคติชนวิทยาสแกนดิเนเวีย (นอร์เวย์ สวีเดน) อาศัยอยู่ตามน้ำตก ทะเลสาบ และลำธารกลางป่าสน มันสามารถแปลงกายเป็นชายหนุ่มรูปงามเปลือยกาย หรือม้าสีขาวผ่อง (Bäckahäst) ริมน้ำ จุดเด่นของเนกเค่นคือการเล่นไวโอลิน (Fiddle) ด้วยท่วงทำนองเพลงที่ไพเราะและเปี่ยมด้วยมนต์สะกด ผู้หญิงและเด็กที่ได้ยินจะเคลิบเคลิ้มและเดินละเมอลงไปในกระแสน้ำวนจนจมน้ำเสียชีวิต",
    story_en: "Nøkken (or Näck) is a malevolent, shapeshifting water spirit of Scandinavian folklore dwelling in deep lakes, roaring waterfalls, and rivers. Appearing as an attractive youth playing a mesmerizing violin or as a snow-white brook horse (Bäckahäst), his enchanting melodies lure children and young women into treacherous rapids where they drown. Only chanting his name or dropping a piece of steel into the river breaks his fatal hypnotic enchantment.",
    folklore_history_th: "ในตำนานนอร์เวย์ นักดนตรีพื้นเมืองที่ต้องการเรียนรู้วิธีการสีไวโอลินให้ไพเราะจับใจมักจะนำเนื้อแกะรมควันหรือเหล้าขาวไปเซ่นไหว้เนกเค่นที่น้ำตกในคืนวันพฤหัสบดีเพื่อแลกกับการเรียนรู้บทเพลงลับของสายน้ำ",
    folklore_history_en: "Norwegian folk fiddlers sought out Nøkken on Thursday nights, offering salted meat or schnapps at waterfalls to be taught the enchanted tunes (Fossegrimen melodies) that compelled listeners to dance uncontrollably.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Nixie_(folklore)", "Telemark", "Rjukan"],
    videoQuery: "Nokken water spirit violin Scandinavian folklore"
  },
  {
    id: "pin-black-shuck",
    title_th: "แบล็คชัค (สุนัขปีศาจตาไฟแห่งโบสถ์บลิตเบิร์กและมรณะเตือน)",
    title_en: "Black Shuck: The Red-Eyed Hellhound of Blythburgh Church",
    category: "monster",
    province_th: "ซัฟฟอล์ก",
    province_en: "Suffolk",
    district_th: "บลิตเบิร์ก",
    district_en: "Blythburgh",
    lat: 52.3214,
    lng: 1.5975,
    story_th: "แบล็คชัค (Black Shuck จากภาษาแองโกล-แซกซอน 'Scucca' แปลว่า ปีศาจ) คือสุนัขสีดำตัวมหึมาขนาดเท่าลูกวัว ขนยาวหยาบ และมีดวงตาสีแดงเพลิงลุกโชนดั่งถ่านไฟ มันท่องไปตามชายฝั่งและสุสานของอีสต์แองเกลียในอังกฤษ เหตุการณ์ที่โด่งดังที่สุดเกิดขึ้นเมื่อวันที่ 4 สิงหาคม 1577 ท่ามกลางพายุฝนฟ้าคะนองรุนแรง แบล็คชัคได้พังประตูโบสถ์โฮลีทรินิตี้ที่บลิตเบิร์ก วิ่งผ่านผู้คนในโบสถ์จนทำให้มีผู้เสียชีวิต 2 ราย และทิ้งรอยกรงเล็บไหม้เกรียมไว้บนประตูโบสถ์ไม้โอ๊กซึ่งยังคงปรากฏให้เห็นจนถึงทุกวันนี้",
    story_en: "Black Shuck (from Old English 'scucca', meaning demon) is a ghostly black dog with fiery saucer eyes that haunts the coastlines and churchyards of Norfolk and Suffolk, England. On August 4, 1577, during an apocalyptic thunderstorm, the hellhound burst through the heavy doors of Holy Trinity Church in Blythburgh, killing two parishioners and wringing the neck of a third before escaping. The scorch marks of its claws remain visible on the ancient church door today.",
    folklore_history_th: "ตำนานแบล็คชัคเป็นแรงบันดาลใจโดยตรงให้แก่ เซอร์ อาร์เธอร์ โคนัน ดอยล์ ในการประพันธ์นิยายสืบสวนชื่อดัง 'หมาผลาญตระกูล' (The Hound of the Baskervilles) ของเชอร์ล็อก โฮล์มส์",
    folklore_history_en: "The historic Blythburgh church incident and ongoing Suffolk sightings of Black Shuck directly inspired Sir Arthur Conan Doyle's most celebrated Sherlock Holmes novel, 'The Hound of the Baskervilles'.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Black_Shuck", "Blythburgh", "Suffolk"],
    videoQuery: "Black Shuck Blythburgh church hellhound English folklore"
  },
  {
    id: "pin-redcap",
    title_th: "เรดแคป (ก็อบลินย้อมหมวกเลือดแห่งปราสาทเฮอร์มิเทจ)",
    title_en: "Redcap: The Blood-Dyeing Murderous Goblin of Hermitage Castle",
    category: "monster",
    province_th: "สก็อตติชบอร์เดอร์ส",
    province_en: "Scottish Borders",
    district_th: "ปราสาทเฮอร์มิเทจ",
    district_en: "Hermitage Castle",
    lat: 55.2558,
    lng: -2.7878,
    story_th: "เรดแคป (Redcap หรือ พาวรี) คือก็อบลินแคระที่ดุร้ายและกระหายเลือดที่สุดในตำนานพรมแดนสก็อตแลนด์และอังกฤษ อาศัยอยู่ตามซากปราสาทปรักหักพังและหอคอยโบราณ โดยเฉพาะที่ปราสาทเฮอร์มิเทจ มีรูปร่างเป็นคนแคระแก่ชรา ฟันยาวแหลมคม กรงเล็บอินทรี สวมรองเท้าเหล็กหนัก และสวมหมวกสีแดง หมวกของมันต้องชโลมด้วยเลือดสดของมนุษย์อยู่เสมอเพื่อไม่ให้มันเหี่ยวเฉาและสิ้นชีพ เรดแคปจะกลิ้งก้อนหินขนาดใหญ่จากกำแพงปราสาทลงมาทับนักเดินทางก่อนจะกระโจนลงมาดื่มเลือดและย้อมหมวกของมัน",
    story_en: "Redcap (or Powrie) is a malevolent, homicidal goblin of Scottish Borders folklore inhabiting ruined castles and towers, most notoriously Hermitage Castle. Depicted as a short, bearded old man with razor eagle talons, fiery red eyes, and heavy iron boots, his defining attribute is his red bonnet. The bonnet must be continuously drenched in the fresh blood of human victims; if the blood dries out, the Redcap perishes. He crushes passing pilgrims with boulders before soaking his cap.",
    folklore_history_th: "ตามตำนานสก็อตแลนด์ อาวุธธรรมดาไม่สามารถทำร้ายเรดแคปได้ วิธีเดียวที่จะเอาชนะมันได้คือการอ่านพระคัมภีร์ไบเบิลหรือชูไม้กางเขน ซึ่งจะทำให้เรดแคปกรีดร้องด้วยความเจ็บปวดและทิ้งฟันหน้าไว้ก่อนจะอันตรธานหายไป",
    folklore_history_en: "Traditional lore holds that Redcaps cannot be slain by earthly steel, but reciting scripture or brandishing a crucifix causes them to vanish in a flash of sulfur, leaving behind one of their teeth.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Redcap", "Hermitage_Castle", "Scottish_Borders"],
    videoQuery: "Redcap goblin Hermitage Castle Scottish folklore"
  },

  // ================= EAST & SOUTH ASIA (5) =================
  {
    id: "pin-qiongqi-beast",
    title_th: "ฉงฉี (หนึ่งในสี่อสูรร้ายโบราณ เสือมีปีกผู้กินคนชอบธรรม)",
    title_en: "Qiongqi: The Winged Tiger Monster of the Four Perils",
    category: "monster",
    province_th: "เจ้อเจียง",
    province_en: "Zhejiang",
    district_th: "เส้าซิง",
    district_en: "Shaoxing",
    lat: 30.0000,
    lng: 120.5000,
    story_th: "ฉงฉี (Qiongqi) คือหนึ่งใน 'สี่อสูรกลียุคโบราณ' (Four Perils - ซื่อซยง) ตามคัมภีร์ซานไห่จิง มีรูปร่างเป็นเสือโคร่งขนาดยักษ์ที่มีปีกนกอินทรีคู่มหึมา และส่งเสียงคำรามเหมือนสุนัขเห่า ฉงฉีมีความวิปริตทางศีลธรรมอย่างยิ่ง: เมื่อมันเห็นคนสองคนกำลังทะเลาะกัน มันจะบินลงไปขย้ำกิน 'คนที่มีศีลธรรมและความถูกต้อง' แต่จะจับสัตว์ป่ามามอบเป็นของขวัญให้แก่ 'คนชั่วช้าทรยศ' มันเป็นสัญลักษณ์แห่งความอยุติธรรมและการบิดเบือนความจริงในโลกมนุษย์",
    story_en: "Qiongqi is one of the Four Perils (Si Xiong) of ancient Chinese mythology codified in the 'Classic of Mountains and Seas'. Resembling a ferocious winged tiger with an eagle's wings that barks like a hound, Qiongqi possesses inverted morality: upon encountering a dispute, it flies down to devour the righteous, honest party, while hunting fresh game to present as rewards to the villainous, corrupt scoundrel. It embodies malicious deceit and chaotic injustice.",
    folklore_history_th: "ในยุคโบราณ กษัตริย์ชุนได้เนรเทศอสูรทั้งสี่ไปยังดินแดนรกร้างทั้งสี่ทิศเพื่อพิทักษ์ความสงบของแผ่นดิน โดยฉงฉีถูกเนรเทศไปยังทิศตะวันตกเฉียงเหนือ และต่อมาถูกนำมาใช้ในพิธีเต้นรำขับไล่สิ่งชั่วร้ายในวันตรุษจีน",
    folklore_history_en: "According to the Zuozhuan, the sage King Shun banished the Four Perils to the barbarian frontiers to maintain moral harmony, later adapting their likeness into Nuo exorcism rituals to dispel plagues during New Year festivals.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Qiongqi_(creature)", "Four_Perils", "Classic_of_Mountains_and_Seas"],
    videoQuery: "Qiongqi Four Perils Chinese mythology Classic Mountains Seas"
  },
  {
    id: "pin-taotie-beast",
    title_th: "เถาเที่ย (อสูรตะกละจอมเขมือบแห่งเครื่องสำริดโบราณราชวงศ์ซาง)",
    title_en: "Taotie: The Insatiable Gluttonous Monster of Shang Bronzes",
    category: "monster",
    province_th: "เหอหนาน",
    province_en: "Henan",
    district_th: "อันหยาง",
    district_en: "Anyang",
    lat: 36.1000,
    lng: 114.3500,
    story_th: "เถาเที่ย (Taotie) คือหนึ่งในสี่อสูรร้ายโบราณของจีน มีจุดเด่นคือความโลภและความตะกละที่ไม่มีที่สิ้นสุด มันมีดวงตาเบิกกว้าง หัวโต เขางอน ไม่มีลำตัวหรือมีเพียงหัวกับปากขนาดใหญ่ เถาเที่ยกลืนกินทุกสิ่งทุกอย่างที่ขวางหน้า ทั้งมนุษย์ พืชพรรณ และสัตว์ป่า จนกระทั่งไม่มีอะไรเหลือให้กิน มันจึงกลืนกินร่างกายของตนเองจนเหลือเพียงศีรษะ กลายเป็นสัญลักษณ์เตือนใจของจักรพรรดิโบราณไม่ให้ลุ่มหลงในความโลภและการกักตุนอำนาจ",
    story_en: "Taotie is another of the infamous Four Perils, celebrated as the primordial emblem of insatiable greed and gluttony. Portrayed as a colossal head with staring eyes, sharp fangs, and curled horns without a lower body, it devours everything in existence—vegetation, livestock, and humans. Consumed by ceaseless hunger, it ultimately devoured its own torso until only a voracious face remained, serving as a grave imperial warning against avarice.",
    folklore_history_th: "ลวดลายหน้ากาก 'เถาเที่ยเหวิน' (Taotie motif) ถูกสลักบนภาชนะสำริดศักดิ์สิทธิ์และหม้อต้มสามขา (Ding) ในราชวงศ์ซางและโจวที่ขุดพบในเมืองอันหยาง เพื่อใช้ในการบูชายัญและเตือนสติผู้ปกครอง",
    folklore_history_en: "The stylized zoomorphic 'Taotie mask' is the predominant artistic motif emblazoned upon ritual bronze vessels and cauldrons (Ding) excavated at Yinxu in Anyang, dating back to the 2nd millennium BC Shang Dynasty.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Taotie", "Anyang", "Shang_dynasty"],
    videoQuery: "Taotie mythical beast Shang dynasty bronze motif"
  },
  {
    id: "pin-korean-gumiho",
    title_th: "คูมิโฮ (จิ้งจอกเก้าหางกินตับมนุษย์แห่งเทือกเขาจีรีซาน)",
    title_en: "Kumiho: The Liver-Devouring Nine-Tailed Fox of Mount Jiri",
    category: "monster",
    province_th: "ช็อลลาใต้",
    province_en: "South Jeolla",
    district_th: "เทือกเขาจีรีซาน",
    district_en: "Jirisan National Park",
    lat: 35.3372,
    lng: 127.7306,
    story_th: "คูมิโฮ (Kumiho) คือจิ้งจอกเก้าหางในตำนานพื้นบ้านของเกาหลี แตกต่างจากจิ้งจอกเก้าหางของจีนและญี่ปุ่น คูมิโฮของเกาหลีมีความน่าสะพรึงกลัวและกระหายเลือดมากกว่า มันจำแลงกายเป็นหญิงสาวสวยสะพรั่งเพื่อล่อลวงชายหนุ่มในเวลากลางคืน จากนั้นจะควักตับหรือหัวใจของเหยื่อออกมากินสดๆ ตำนานเล่าว่าหากคูมิโฮต้องการกลายเป็นมนุษย์แท้จริงอย่างถาวร มันต้องกินตับมนุษย์ครบ 1,000 คน หรือต้องอดทนไม่ฆ่าสิ่งมีชีวิตและไม่เปิดเผยร่างจริงเป็นเวลา 100 วัน",
    story_en: "The Kumiho (Gumiho) is Korea's iconic nine-tailed fox spirit, distinct from its Chinese and Japanese counterparts by its overtly predatory nature. Shapeshifting into an exquisite young maiden to seduce men on misty mountain paths around Jirisan, it extracts and devours human livers or hearts to sustain its occult life force. To achieve permanent human status, lore states a Kumiho must either consume 1,000 human livers or abstain from killing for 100 consecutive days.",
    folklore_history_th: "ตำนานคูมิโฮฝังรากลึกในวัฒนธรรมเกาหลีมานานนับพันปี ปรากฏในบันทึก 'ซัมกุกยูซา' (Samguk Yusa) และยังคงเป็นแรงบันดาลใจหลักในซีรีส์และภาพยนตร์เกาหลีร่วมสมัยจำนวนมาก",
    folklore_history_en: "Codified in classical texts like the 'Samguk Yusa' (Memorabilia of the Three Kingdoms), the Kumiho remains South Korea's most enduring supernatural creature, frequently adapted in modern K-dramas and cinema.",
    sound_preset: "whisper",
    wikiCandidates: ["Kumiho", "Jirisan", "Korean_folklore"],
    videoQuery: "Kumiho Korean nine tailed fox legend folklore"
  },
  {
    id: "pin-jangsan-tiger",
    title_th: "พญาเสือชังซาน (อสูรเสือขาวเลียนเสียงเรียกคนแห่งปูซาน)",
    title_en: "Jangsan Tiger: The Voice-Mimicking White Phantom of Busan",
    category: "monster",
    province_th: "ปูซาน",
    province_en: "Busan",
    district_th: "แฮอึนแด",
    district_en: "Haeundae District",
    lat: 35.1950,
    lng: 129.1550,
    story_th: "พญาเสือชังซาน (Jangsanbeom หรือ Jangsan Tiger) คืออสูรกายในตำนานเมืองร่วมสมัยที่ถูกพบเห็นตามเทือกเขาชังซานในเขตแฮอึนแด เมืองปูซาน ประเทศเกาหลีใต้ มันมีร่างกายคล้ายเสือแต่เดินสี่ขาหรือสองขา มีขนสีขาวเงินยาวสลวยคลุมร่าง ใบหน้าคล้ายมนุษย์ และมีเขี้ยวแหลมคม สิ่งที่อันตรายที่สุดคือความสามารถในการเลียนแบบเสียงได้อย่างสมบูรณ์แบบ มันจะเลียนเสียงเด็กร้องไห้ เสียงหญิงสาวขอความช่วยเหลือ หรือเสียงของคนในครอบครัว เพื่อล่อลวงผู้ที่เดินป่ายามค่ำคืนให้เดินเข้าไปหาในถ้ำก่อนจะขย้ำกิน",
    story_en: "The Jangsan Tiger (Jangsanbeom) is South Korea's chilling urban legend cryptid native to Mount Jangsan in Busan. Resembling an agile predatory feline covered in silky, shimmering snow-white fur with human-like facial features and razor fangs, its deadliest weapon is acoustic mimicry. It mimics the crying of lost children, the screams of a woman in distress, or the familiar voice of a victim's own relative, drawing hikers off mountain paths into dark ravines.",
    folklore_history_th: "เรื่องราวของเสือชังซานแพร่สะพัดอย่างรวดเร็วในอินเทอร์เน็ตเกาหลีตั้งแต่ช่วงปี 2010 และได้รับการสร้างเป็นภาพยนตร์สยองขวัญชื่อดัง 'The Mimic' (2017) ซึ่งสะท้อนความกลัวดั้งเดิมของชาวเกาหลีต่อเสือและป่าลึก",
    folklore_history_en: "Erupting from eyewitness reports on Korean online boards into mainstream folklore, the Jangsan Tiger inspired the hit 2017 horror film 'The Mimic', tapping into ancient Korean fears of man-eating mountain tigers.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Haeundae_District", "Busan", "Korean_mythology"],
    videoQuery: "Jangsan Tiger Korean cryptid urban legend The Mimic"
  },
  {
    id: "pin-bhoot-tree",
    title_th: "ภูต (วิญญาณไร้เงาเท้ากลับหลังสิงสถิตต้นโพธิ์แห่งอินเดีย)",
    title_en: "The Bhoot: The Shadowless Tree-Haunting Wraith of Northern India",
    category: "ghost",
    province_th: "อุตตรประเทศ",
    province_en: "Uttar Pradesh",
    district_th: "มถุรา",
    district_en: "Mathura",
    lat: 27.4924,
    lng: 77.6737,
    story_th: "ภูต (Bhoot หรือ Bhut) คือวิญญาณเร่ร่อนของมนุษย์ที่เสียชีวิตอย่างกะทันหัน เกิดอุบัติเหตุ หรือไม่ได้รับการทำพิธีฌาปนกิจศพตามประเพณีฮินดู ภูตจะสิงสถิตอยู่ตามต้นไม้ศักดิ์สิทธิ์ เช่น ต้นโพธิ์ ต้นไทร หรือทางแยกยามค่ำคืน จุดสังเกตของภูตคือ 'มันไม่มีเงา เท้าทั้งสองข้างหันกลับหลัง และพูดจาด้วยเสียงขึ้นจมูก' ภูตสามารถเข้าสิงร่างคนเพื่อบังคับให้กินถ่านไฟหรือทำร้ายตัวเอง ชาวบ้านมักหลีกเลี่ยงการเดินใต้ต้นไม้ใหญ่ยามดึก หรือพกเหล็กกล้าติดตัวเพื่อป้องกันไม่ให้ภูตเข้าใกล้",
    story_en: "A Bhoot is the restless spirit of a deceased person whose funerary rites were improperly conducted or who suffered a violent, untimely demise in Indian lore. Haunting old banyan and peepal trees, derelict houses, and cremation grounds, a Bhoot is distinguished by having backward-facing feet, casting absolutely no shadow upon the ground, and speaking in an uncanny nasal monotone. They possess living mortals, who must be freed by a village Tantrik using sacred ash and iron.",
    folklore_history_th: "ความเชื่อเรื่องภูตมีรากฐานมาจากคัมภีร์พระเวทโบราณ โดยคำว่า 'ภูต' ในภาษาสันสกฤตแปลว่า 'อดีต' หรือ 'สิ่งที่เคยมีชีวิต' สะท้อนความผูกพันของชาวฮินดูต่อการส่งวิญญาณบรรพบุรุษสู่สุคติอย่างถูกต้อง",
    folklore_history_en: "Rooted in ancient Sanskrit Vedic texts where 'Bhoot' denotes 'the past' or 'that which existed', the lore emphasizes the cosmic duty of living descendants to perform ancestral Shraddha ceremonies to release earthbound souls.",
    sound_preset: "whisper",
    wikiCandidates: ["Bhoot_(ghost)", "Mathura", "Peepal_tree"],
    videoQuery: "Bhoot Indian ghost folklore peepal tree story"
  }
];

async function run() {
  console.log('Starting Batch 300 (25 new pins to reach milestone 300 pins)...');
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

  for (let i = 0; i < BATCH_300.length; i++) {
    const p = BATCH_300[i];
    console.log(`[${i + 1}/${BATCH_300.length}] Processing ${p.id} (${p.title_th})...`);

    const imgFile = `${p.id}.jpg`;
    const destPath = path.join(entitiesDir, imgFile);

    // Download unique wiki thumb
    const downloaded = await fetchWikiThumb(p.wikiCandidates, destPath, existingHashes);
    if (!downloaded) {
      console.log(` -> Warning: Could not find unique wiki thumb for ${p.id}, trying fallback search...`);
      for (const query of [p.province_en, p.district_en, 'Mythology', 'Folklore', 'Asia', 'South_America']) {
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

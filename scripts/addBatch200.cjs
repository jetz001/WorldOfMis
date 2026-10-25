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
    title: 'Mystery Folklore Documentary'
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

const BATCH_200 = [
  {
    id: "pin-phibong",
    title_th: "ผีกองกอย (ภูตป่าขาเดียวผู้ส่งเสียงร้องกอยๆ ยามค่ำคืน)",
    title_en: "Phi Kong Koi, The One-Legged Jungle Hopper of Loei",
    category: "monster",
    province_th: "เลย",
    province_en: "Loei (Thailand)",
    district_th: "ภูกระดึง - ป่าดงดิบภูหลวง",
    district_en: "Phu Kradueng & Phu Luang Wildlife Sanctuary",
    lat: 16.8906,
    lng: 101.7925,
    story_th: "ภูตผีป่าดงดิบที่มีขาเพียงข้างเดียว เคลื่อนที่ด้วยการกระโดดเขย่งไปมาอย่างรวดเร็ว ปากมีท่อยาวเหมือนหลอดใช้เจาะดูดเลือดจากหัวแม่เท้าของคนเดินป่าที่นอนหลับโดยไม่ก่อกองไฟ",
    story_en: "A bizarre one-legged jungle cryptid and spirit that hops backward through dense mountain mist, crying 'Koi! Koi!' in the dead of night as it searches for sleeping trekkers.",
    folklore_history_th: "ชาวบ้านและพรานป่าเชื่อว่าผีกองกอยมีหน้าตากลับหลังหรือเดินถอยหลังเพื่อหลอกทิศทางผู้สะกดรอย และมักซ่อนสมบัติล้ำค่าไว้ในโพรงไม้ลึก",
    folklore_history_en: "Northern and Isan forest lore describes the Kong Koi as having backward-facing feet to confuse trackers, guarding hidden jungle relics.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Phu_Kradueng_National_Park", "Loei_province", "Slow_loris"],
    ytQuery: "ตำนานผีกองกอย เรื่องเล่าพรานป่า"
  },
  {
    id: "pin-maeyanang",
    title_th: "แม่ย่านางเรือ (เทวีผู้คุ้มครองนาวาและนักเดินเรือสยาม)",
    title_en: "Mae Yanang, Sacred Guardian Spirit of Siamese Vessels",
    category: "sacred",
    province_th: "กรุงเทพมหานคร",
    province_en: "Bangkok (Thailand)",
    district_th: "คลองบางกอกน้อย - แม่น้ำเจ้าพระยา",
    district_en: "Bangkok Noi Canal, Chao Phraya River",
    lat: 13.7617,
    lng: 100.4853,
    story_th: "สิ่งศักดิ์สิทธิ์ประจำหัวเรือพระราชพิธี เรือประมง และยานพาหนะตามความเชื่อไทย เชื่อว่าสถิตอยู่ที่โขนเรือคอยปกปักรักษาผู้เดินทางให้รอดพ้นจากพายุคลื่นยักษ์และภูตผีพรายน้ำ",
    story_en: "The revered tutelary goddess residing in the prows of Thai royal barges, fishing trawlers, and modern vehicles, shielding crews from deadly squalls and river phantoms.",
    folklore_history_th: "ก่อนนำเรือออกเดินทางทุกครั้ง ชาวเรือจะผูกผ้าสามสี พวงมาลัย และทำพิธีเซ่นไหว้แม่ย่านางอย่างเคร่งครัด ห้ามเหยียบหัวเรือหรือพูดจาอัปมงคลบนเรือ",
    folklore_history_en: "Traditionally honored with three-colored silk ribbons and jasmine garlands tied to the bow, sailors strictly forbid stepping on a boat's prow out of respect for Mae Yanang.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Mae_Yanang", "Royal_Barge_Procession", "Suphannahong_Barge"],
    ytQuery: "ตำนานแม่ย่านางเรือ ประวัติ"
  },
  {
    id: "pin-wiangyonok",
    title_th: "เวียงหนองล่มและอาถรรพ์ปลาไหลเผือกแห่งโยนกนคร",
    title_en: "Wiang Nong Lom & The White Eel Curse of Yonok Nakhon",
    category: "curse",
    province_th: "เชียงราย",
    province_en: "Chiang Rai (Thailand)",
    district_th: "ทะเลสาบเชียงแสน (เวียงหนองล่ม)",
    district_en: "Chiang Saen Lake Basin",
    lat: 20.2286,
    lng: 100.0331,
    story_th: "ตำนานมหานครโยนกนาคพันธุ์ที่ล่มสลายกลายเป็นหนองน้ำขนาดใหญ่ในคืนเดียว หลังจากชาวเมืองจับปลาไหลเผือกยักษ์เท่าลำตาล (พญานาคจำแลง) มาแล่เนื้อแบ่งกันกินเกือบทั้งเมือง",
    story_en: "The Atlantis of Northern Thailand: the prosperous kingdom of Yonok Nakhon sank beneath a deep lake in a single catastrophic night after townsfolk slaughtered and ate a giant white eel—an incarnation of the Naga King.",
    folklore_history_th: "มีเพียงหญิงหม้ายชรานางเดียวที่ไม่ได้กินเนื้อปลาไหลเผือกจึงรอดชีวิต เกาะของนางยังคงเหลือเป็นดอนแม่หม้ายกลางหนองน้ำเชียงแสนจนถึงทุกวันนี้",
    folklore_history_en: "Only an elderly widow who refused to eat the sacred white eel survived; her homestead remained above water as 'Widow's Island' in the middle of Chiang Saen Lake.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Chiang_Saen_district", "Singhanavati", "Yonok"],
    ytQuery: "ตำนานเวียงหนองล่ม ปลาไหลเผือก โยนกนคร"
  },
  {
    id: "pin-khao-kitchakut",
    title_th: "เขาคิชฌกูฏและตำนานหินลูกพระบาทลอยฟ้า",
    title_en: "Khao Khitchakut & The Defying Gravity Sacred Boulder",
    category: "sacred",
    province_th: "จันทบุรี",
    province_en: "Chanthaburi (Thailand)",
    district_th: "อุทยานแห่งชาติเขาคิชฌกูฏ",
    district_en: "Khao Khitchakut National Park",
    lat: 12.8389,
    lng: 102.1644,
    story_th: "ยอดเขาศักดิ์สิทธิ์สูงเสียดฟ้าที่มีก้อนหินกลมขนาดยักษ์ 'หินลูกพระบาท' ตั้งหมิ่นเหม่ริมหน้าผาเคียงคู่รอยพระพุทธบาทที่สูงที่สุดในประเทศไทย มีเรื่องเล่าว่าสามารถมองเห็นเส้นด้ายลอดผ่านใต้ก้อนหินยักษ์ได้",
    story_en: "A mist-shrouded mountain peak crowned by a colossal spherical granite boulder balanced precariously at the cliff edge beside Thailand's highest sacred Buddha footprint.",
    folklore_history_th: "เปิดให้ผู้แสวงบุญเดินเท้าขึ้นยอดเขาเพียงปีละหนึ่งครั้ง พร้อมตำนานเมืองลับแลและปู่ฤษีผู้รักษาขุมทรัพย์ศักดิ์สิทธิ์บนยอดเขา",
    folklore_history_en: "Opened to midnight pilgrims for only two months each year, local lore surrounds the peak with tales of hidden Laplae spirit villages and guardian ascetics.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Khao_Khitchakut_National_Park", "Chanthaburi_province"],
    ytQuery: "ตำนานเขาคิชฌกูฏ จันทบุรี หินลอย"
  },
  {
    id: "pin-prasat-hin-phanom-rung",
    title_th: "ปราสาทหินพนมรุ้ง (เทวสถานหินทรายสีชมพูบนปากปล่องภูเขาไฟ)",
    title_en: "Phanom Rung Sanctuary Atop the Extinct Volcano",
    category: "sacred",
    province_th: "บุรีรัมย์",
    province_en: "Buri Ram (Thailand)",
    district_th: "เฉลิมพระเกียรติ - เขาพนมรุ้ง",
    district_en: "Chaloem Phra Kiat, Mount Phanom Rung",
    lat: 14.5319,
    lng: 102.9403,
    story_th: "มหาเทวสถานขอมโบราณที่สร้างขึ้นจากหินทรายสีชมพูและศิลาแลงบนยอดภูเขาไฟที่ดับสนิทแล้ว ออกแบบตามหลักดาราศาสตร์ศักดิ์สิทธิ์จนแสงอาทิตย์ส่องทะลุประตูทั้ง 15 บานตรงกันอย่างน่าอัศจรรย์",
    story_en: "A majestic pink-sandstone Khmer temple complex built on the rim of an extinct volcano to mirror Mount Kailash. Twice a year, the rising sun aligns precisely through all 15 sanctuary doorways.",
    folklore_history_th: "มีตำนานทับหลังนารายณ์บรรทมสินธุ์ที่เคยถูกโจรกรรมไปต่างประเทศก่อนจะได้กลับคืนมาอย่างปาฏิหาริย์ ซึ่งชาวบ้านเชื่อว่าเป็นเพราะอาถรรพ์สิ่งศักดิ์สิทธิ์ผู้พิทักษ์ปราสาท",
    folklore_history_en: "Famous for the Phra Narai lintel that was looted during the 1960s and miraculously repatriated in 1988, attributed by locals to the temple's guardian spirits.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Phanom_Rung_Historical_Park"],
    ytQuery: "ตำนานปราสาทหินพนมรุ้ง ทับหลังนารายณ์บรรทมสินธุ์"
  },
  {
    id: "pin-bakekujira",
    title_th: "บาเกะคุจิระ (โครงกระดูกวาฬผีแห่งทะเลญี่ปุ่น)",
    title_en: "Bake-kujira, The Phantom Whale Skeleton of Shimane",
    category: "ghost",
    province_th: "ชิมาเนะ (ญี่ปุ่น)",
    province_en: "Shimane Prefecture (Japan)",
    district_th: "คาบสมุทรชิมาเนะ ทะเลญี่ปุ่น",
    district_en: "Oki Islands & Shimane Coast",
    lat: 35.5500,
    lng: 133.1333,
    story_th: "โครงกระดูกวาฬยักษ์สีขาวเรืองแสงที่แหวกว่ายเหนือผิวน้ำในคืนฝนพรำ รายล้อมด้วยฝูงนกประหลาดและปลาหน้าตาพิกล ฉมวกของชาวประมงพุ่งทะลุผ่านร่างโครงกระดูกไปโดยไม่อาจทำอันตรายได้",
    story_en: "A colossal, glowing skeletal whale gliding across the dark Sea of Japan on rainy nights, accompanied by eerie unknown birds and spectral fish. Harpoons pass harmlessly through its bleached bones.",
    folklore_history_th: "เชื่อกันว่าเป็นดวงวิญญาณอาฆาตของวาฬที่ถูกล่าสังหาร ซึ่งจะนำพาคำสาป โรคระบาด และไฟไหม้มาสู่หมู่บ้านชายฝั่งที่พบเห็นมัน",
    folklore_history_en: "Born from the vengeful souls of hunted whales, the Bake-kujira brings famine, plague, and fires upon coastal fishing villages that witness its ghostly procession.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Bake-kujira", "Shimane_Prefecture"],
    ytQuery: "Bake-kujira Ghost Whale Japanese Yokai"
  },
  {
    id: "pin-nurarihyon",
    title_th: "นูราริเฮียง (จอมทัพสูงสุดแห่งขบวนร้อยอสูรยามราตรี)",
    title_en: "Nurarihyon, Supreme Lord of the Yokai Night Parade",
    category: "legend",
    province_th: "โอคายามะ (ญี่ปุ่น)",
    province_en: "Okayama Prefecture (Japan)",
    district_en: "Seto Inland Sea Coast",
    district_th: "ชายฝั่งทะเลในเซโตะ",
    lat: 34.6618,
    lng: 133.9350,
    story_th: "โยไคในร่างชายชราผู้สวมชุดกิโมโนไหมชั้นสูงและมีศีรษะยาวคล้ายน้ำเต้า มักเดินเข้าบ้านคนอื่นในยามพลบค่ำแล้วนั่งจิบชาสูบกล้องยาสูบราวกับเป็นเจ้าของบ้านโดยไม่มีใครกล้าขับไล่",
    story_en: "An elderly gourd-headed yokai dressed in fine silk robes who slips into busy households at twilight, casually sipping luxury tea as if he were the master of the estate while captivating everyone into silence.",
    folklore_history_th: "ได้รับการยกย่องในคติชนญี่ปุ่นยุคเอโดะให้เป็นผู้นำสูงสุดของเหล่าภูตผีทั้งปวงในขบวนแห่ร้อยอสูร (Hyakki Yagyo)",
    folklore_history_en: "Revered in Edo folklore as the elusive Supreme Commander of all yokai during the Hyakki Yagyo (Night Parade of One Hundred Demons).",
    sound_preset: "whisper",
    wikiCandidates: ["Nurarihyon", "Hyakki_Yagyō"],
    ytQuery: "Nurarihyon Japanese Yokai Explained"
  },
  {
    id: "pin-nian",
    title_th: "อสูรเหนียน (สัตว์ร้ายโบราณผู้กลัวสีแดงและเสียงประทัด)",
    title_en: "Nian, The Horned New Year Beast of Mount Tai",
    category: "monster",
    province_th: "ซานตง (จีน)",
    province_en: "Shandong (China)",
    district_th: "ภูเขาไท่ซาน",
    district_en: "Mount Tai (Taishan)",
    lat: 36.2558,
    lng: 117.1000,
    story_th: "อสูรกายดึกดำบรรพ์หัวคล้ายสิงโตแต่มีเขาแหลมคม อาศัยอยู่ใต้ทะเลลึกและจะขึ้นฝั่งในคืนวันสิ้นปีจันทรคติเพื่อบุกทำลายหมู่บ้านและกลืนกินผู้คน จนกระทั่งชายชราลึกลับค้นพบว่ามันหวาดกลัวสีแดง แสงไฟ และเสียงระเบิดของไม้ไผ่",
    story_en: "A ferocious lion-headed, horned beast emerging from the abyss every Lunar New Year's Eve to devour villagers—until an immortal beggar revealed its terror of crimson banners, blazing lanterns, and crackling bamboo firecrackers.",
    folklore_history_th: "กลายเป็นต้นกำเนิดประเพณีการติดกระดาษสีแดง จุดประทัด และเชิดสิงโตในเทศกาลตรุษจีนทั่วโลกเพื่อขับไล่อสูรเหนียน",
    folklore_history_en: "This ancient legend gave birth to Lunar New Year traditions of hanging red couplets, lighting firecrackers, and performing lion dances.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Nian", "Mount_Tai"],
    ytQuery: "Legend of the Nian monster Chinese New Year"
  },
  {
    id: "pin-white-snake",
    title_th: "ตำนานนางพญางูขาวและเจดีย์เหลยเฟิงแห่งทะเลสาบซีหู",
    title_en: "Madame White Snake & Leifeng Pagoda of West Lake",
    category: "legend",
    province_th: "เจ้อเจียง (จีน)",
    province_en: "Zhejiang (China)",
    district_th: "ทะเลสาบซีหู เมืองหางโจว",
    district_en: "West Lake, Hangzhou",
    lat: 30.2314,
    lng: 120.1486,
    story_th: "ไป๋ซู่เจิน ปีศาจงูขาวผู้บำเพ็ญตบะพันปีจนจำแลงกายเป็นหญิงงามและพบรักกับบัณฑิตสวี่เซียนบนสะพานขาดริมทะเลสาบซีหู แต่กลับถูกพระฝาไห่ผู้เคร่งครัดจับขังสะกดไว้ใต้เจดีย์เหลยเฟิง",
    story_en: "Bai Suzhen, a thousand-year-old white serpent spirit who took human form and fell in love with mortal scholar Xu Xian on Hangzhou's Broken Bridge, before the monk Fahai imprisoned her beneath Leifeng Pagoda.",
    folklore_history_th: "หนึ่งในสี่นิทานพื้นบ้านที่ยิ่งใหญ่ที่สุดของจีน และเมื่อเจดีย์เหลยเฟิงองค์เดิมพังทลายลงในปี 1924 ชาวเมืองต่างเล่าขานว่านางพญางูขาวได้รับอิสรภาพแล้ว",
    folklore_history_en: "One of China's Four Great Folktales; when the ancient brick Leifeng Pagoda dramatically collapsed in 1924, locals whispered that Madame White Snake had finally broken free.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Legend_of_the_White_Snake", "Leifeng_Pagoda"],
    ytQuery: "Legend of the White Snake Chinese folklore"
  },
  {
    id: "pin-baekdu-heaven-lake",
    title_th: "อสูรกายแห่งทะเลสาบสวรรค์บนปากปล่องภูเขาไฟแพ็กดู",
    title_en: "The Monster of Heaven Lake on Sacred Mount Paektu",
    category: "monster",
    province_th: "พรมแดนเกาหลี - จีน",
    province_en: "North Korea / Jilin (China) Border",
    district_th: "ทะเลสาบสวรรค์ (ช็อนจี) ยอดเขาแพ็กดู",
    district_en: "Heaven Lake (Chonji) Caldera, Mount Paektu",
    lat: 42.0056,
    lng: 128.0572,
    story_th: "ทะเลสาบปากปล่องภูเขาไฟที่สูงและหนาวเหน็บที่สุดแห่งหนึ่งของโลก มีรายงานการพบเห็นสัตว์ประหลาดขนาดยักษ์สีดำทองโผล่พ้นผิวน้ำแหวกว่ายด้วยความเร็วสูงทิ้งคลื่นเป็นทางยาวนับตั้งแต่ปี 1903",
    story_en: "High atop the volcanic caldera of sacred Mount Paektu lies Heaven Lake, where witnesses since 1903—and multiple videographers—have recorded mysterious finned creatures slicing through the icy waters.",
    folklore_history_th: "ภูเขาแพ็กดูยังเป็นสถานที่ศักดิ์สิทธิ์ตามตำนานการกำเนิดอาณาจักรโชซ็อนโบราณของพระเจ้าทันกุน บุตรแห่งสวรรค์",
    folklore_history_en: "Beyond its cryptozoological sightings, Mount Paektu is revered across Korea as the mythical birthplace of Dangun, founder of the first Korean kingdom.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Heaven_Lake", "Paektu_Mountain"],
    ytQuery: "Lake Tianchi Monster Mount Paektu mystery"
  },
  {
    id: "pin-bhangarh",
    title_th: "ป้อมภานครห์ (นครต้องคำสาปที่ทางการอินเดียห้ามเข้ายามวิกาล)",
    title_en: "Bhangarh Fort, India's Officially Forbidden Cursed City",
    category: "curse",
    province_th: "ราชาสถาน (อินเดีย)",
    province_en: "Rajasthan (India)",
    district_th: "อัลวาร์ เทือกเขาอราวัลลี",
    district_en: "Alwar District, Aravalli Hills",
    lat: 27.0967,
    lng: 76.2861,
    story_th: "เมืองป้อมปราการโบราณจากศตวรรษที่ 17 ที่ถูกทิ้งร้างอย่างลึกลับหลังจอมขมังเวทย์สิงเหียสาปแช่งให้ทั้งเมืองพินาศและไม่มีหลังคาบ้านใดคงอยู่ได้ ปัจจุบันกรมโบราณคดีอินเดียติดป้ายห้ามเข้าหลังพระอาทิตย์ตกดินอย่างเด็ดขาด",
    story_en: "Cursed in the 17th century by a dying tantric sorcerer whose love potion was rejected by Princess Ratnavati, the entire royal city collapsed into ruin. Today, the Archaeological Survey of India legally prohibits entry between sunset and sunrise.",
    folklore_history_th: "ชาวบ้านเชื่อว่าหากใครสร้างหลังคาทับอาคารในป้อมภานครห์ หลังคานั้นจะพังถล่มลงมาทันที และผู้ที่แอบค้างคืนในป้อมไม่เคยได้กลับออกมา",
    folklore_history_en: "Locals maintain that any roof built inside Bhangarh collapses mysteriously, and travelers who linger inside after dusk vanish into the Aravalli shadows.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Bhangarh_Fort"],
    ytQuery: "Bhangarh Fort most haunted place in India documentary"
  },
  {
    id: "pin-aghartha",
    title_th: "นครใต้พิภพไคมัคลีแห่งคัปปาโดเกีย",
    title_en: "Kaymakli Subterranean Labyrinth of Cappadocia",
    category: "sacred",
    province_th: "เนฟเชฮีร์ (ตุรกี)",
    province_en: "Nevşehir Province (Turkey)",
    district_th: "ไคมัคลี แคว้นคัปปาโดเกีย",
    district_en: "Kaymakli, Cappadocia",
    lat: 38.4600,
    lng: 34.7522,
    story_th: "มหานครใต้ดินที่ขุดเจาะลึกลงไปในชั้นหินภูเขาไฟถึง 8 ชั้น มีอุโมงค์ลับนับร้อยสาย ประตูหินกลิ้งหนักครึ่งตัน และปล่องระบายอากาศที่สามารถซ่อนผู้คนใต้แผ่นดินได้นับหมื่นคนราวกับอาณาจักรใต้พิภพ",
    story_en: "An astonishing eight-level subterranean metropolis carved deep into volcanic tuff rock, connected by miles of secret tunnels, rolling millstone blast doors, and ventilation shafts capable of sheltering 20,000 people underground.",
    folklore_history_th: "สร้างขึ้นตั้งแต่ยุคฟรีเจียนและใช้เป็นที่หลบภัยสงครามมานานนับพันปี เชื่อมโยงกับเมืองใต้ดินเดรินคูยูผ่านอุโมงค์ใต้ดินยาวกว่า 8 กิโลเมตร",
    folklore_history_en: "Begun by Phrygian builders in the 8th century BCE, a five-mile subterranean tunnel links Kaymakli directly to the neighboring abyss of Derinkuyu.",
    sound_preset: "whisper",
    wikiCandidates: ["Kaymakli_Underground_City"],
    ytQuery: "Kaymakli Underground City Cappadocia documentary"
  },
  {
    id: "pin-wildhunt",
    title_th: "กองทัพวิญญาณนักล่าแห่งรัตติกาล (เดอะไวลด์ฮันต์)",
    title_en: "The Wild Hunt (Åsgårdsreien) Across the Winter Sky",
    category: "ghost",
    province_th: "เวสต์ลันด์ (นอร์เวย์)",
    province_en: "Vestland (Norway)",
    district_th: "เทือกเขาโยทุนไฮเมน",
    district_en: "Jotunheimen Alpine Range",
    lat: 61.6333,
    lng: 8.3000,
    story_th: "ขบวนทัพม้าผีและสุนัขล่าเนื้อวิญญาณที่ควบทะยานผ่านฟากฟ้าในคืนพายุหิมะ นำทัพโดยเทพโอดินและวิญญาณนักรบผู้ล่วงลับ หากผู้ใดเผลอเงยหน้าสบตาขบวนไวลด์ฮันต์ ดวงวิญญาณจะถูกฉุดกระชากไปร่วมขบวนทันที",
    story_en: "A terrifying spectral cavalcade of ghostly riders, baying hounds, and fallen Valkyries led by Odin across tempestuous winter skies. Mortals caught outdoors must throw themselves face-down on the snow lest their souls be swept away.",
    folklore_history_th: "ตำนานเก่าแก่ร่วมกันของชาวนอร์ส เยอรมัน และเคลต์ ที่ใช้อธิบายเสียงพายุฤดูหนาวอันเกรี้ยวกราดและลางบอกเหตุแห่งสงคราม",
    folklore_history_en: "Shared across Norse, Germanic, and Celtic mythologies, sighting the Wild Hunt portended war, plague, or the death of a monarch.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Wild_Hunt"],
    ytQuery: "The Wild Hunt Norse mythology explained"
  },
  {
    id: "pin-trollstigen",
    title_th: "โทรลล์ศิลาแห่งฟยอร์ดนอร์เวย์ (หุบผาโทรลล์สติเกน)",
    title_en: "The Petrified Trolls of Trollstigen & Trollveggen",
    category: "monster",
    province_th: "เมอเรอและรอมสดาล (นอร์เวย์)",
    province_en: "Møre og Romsdal (Norway)",
    district_th: "หุบผาบันไดโทรลล์ โรมาสดาเลน",
    district_en: "Trollstigen & Romsdalen Valley",
    lat: 62.4567,
    lng: 7.6653,
    story_th: "ยักษ์โทรลล์แห่งขุนเขาสแกนดิเนเวียที่ออกหากินเฉพาะเวลากลางคืนและโยนก้อนหินยักษ์ใส่โบสถ์คริสต์ แต่หากพวกมันเผลออยู่จนแสงอาทิตย์แรกของวันส่องกระทบ ร่างกายจะกลายเป็นยอดเขาหินสูงชันไปชั่วนิรันดร์",
    story_en: "Towering mountain giants of Norwegian folklore that roam craggy fjords by night, hurling boulders at ringing church bells. Caught by the first rays of dawn, their bodies petrified into the jagged peaks of Trollveggen.",
    folklore_history_th: "ชาวนอร์เวย์ชี้ว่ายอดเขาหินรูปร่างประหลาดเรียงรายตลอดหุบเขาโรมาสดาเลนคือขบวนโทรลล์ที่ถูกแสงอาทิตย์สาปให้กลายเป็นหิน",
    folklore_history_en: "Local Romsdalen legend identifies the jagged spires of the Troll Wall—Europe's tallest vertical rock face—as a wedding procession of trolls turned to stone at sunrise.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Trollstigen", "Troll_Wall", "Troll"],
    ytQuery: "Trolls in Norse mythology and Norwegian folklore"
  },
  {
    id: "pin-melusine",
    title_th: "เมลูซีน (ภูตสาวครึ่งงูผู้สร้างปราสาทลูซิญองแห่งฝรั่งเศส)",
    title_en: "Melusine, The Twin-Tailed Serpent Fairy of Lusignan",
    category: "legend",
    province_th: "นูแวล-อากีแตน (ฝรั่งเศส)",
    province_en: "Nouvelle-Aquitaine (France)",
    district_th: "ปราสาทลูซิญอง แคว้นปัวตู",
    district_en: "Château de Lusignan, Vienne",
    lat: 46.4353,
    lng: 0.1228,
    story_th: "ภูตน้ำสาวผู้เนรมิตปราสาทอันยิ่งใหญ่ให้แก่ขุนนางเรมอนดินในคืนเดียว โดยมีข้อแม้ห้ามสามีแอบดูเธออาบน้ำในวันเสาร์อย่างเด็ดขาด เพราะทุกวันเสาร์ท่อนล่างของเธอจะกลายร่างเป็นงูหรือมังกรมีปีก",
    story_en: "A sacred freshwater spirit who married Lord Raymondin and magically erected the fortress of Lusignan, asking only that he never enter her bathchamber on Saturdays—when her lower body transformed into a serpent.",
    folklore_history_th: "เมื่อสามีแอบมองและผิดสัญญา เมลูซีนจึงกลายร่างเป็นมังกรมีปีกบินหนีออกจากหน้าต่างปราสาท และจะกลับมาบินวนส่งเสียงร้องโหยหวนทุกครั้งก่อนที่ทายาทตระกูลลูซิญองจะเสียชีวิต",
    folklore_history_en: "When her husband broke his vow, Melusine sprouted dragon wings and flew from the castle tower, returning to wail above the battlements whenever a ruler of House Lusignan was about to die.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Melusine"],
    ytQuery: "Melusine folklore legend explained"
  },
  {
    id: "pin-dullahan",
    title_th: "ดูลาฮาน (อัศวินม้ามืดถือศีรษะตัวเองผู้เรียกความตายแห่งไอร์แลนด์)",
    title_en: "The Dullahan, Headless Death-Rider of County Sligo",
    category: "ghost",
    province_th: "คอนนาคต์ (ไอร์แลนด์)",
    province_en: "Connacht (Ireland)",
    district_th: "เคาน์ตีสไลโก",
    district_en: "County Sligo",
    lat: 54.2766,
    lng: -8.4761,
    story_th: "ภูตแห่งความตายในตำนานเคลต์ผู้ควบม้าสีดำสนิทโดยหนีบศีรษะที่เน่าเปื่อยแต่ยิ้มกว้างถึงใบหูไว้ใต้แขน ใช้กระดูกสันหลังมนุษย์เป็นแส้ม้า หากมันหยุดม้าหน้าบ้านใครและขานชื่อ ผู้นั้นจะสิ้นใจในทันที",
    story_en: "A sinister Unseelie court horseman riding a snorting black steed across Irish country lanes while carrying his own grinning, moldering head under his arm and wielding a human spine as a whip.",
    folklore_history_th: "ไม่มีประตูหรือกุญแจใดขวางทางดูลาฮานได้ แต่สิ่งเดียวที่มันหวาดกลัวอย่างที่สุดคือ 'ทองคำ' แม้แต่เข็มกลัดทองคำเพียงชิ้นเดียวก็สามารถขับไล่มันให้หนีไปได้",
    folklore_history_en: "All locks fly open at the Dullahan's approach, yet he possesses an inexplicable dread of gold—even the smallest golden coin dropped on the road forces him to flee.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Dullahan"],
    ytQuery: "The Dullahan Irish mythology headless horseman"
  },
  {
    id: "pin-edgarallanpoe",
    title_th: "ปริศนาการเสียชีวิตและผู้มาเยือนยามวิกาลที่หลุมศพ เอ็ดการ์ แอลแลน โพ",
    title_en: "The Mysterious Death of Edgar Allan Poe & The Poe Toaster",
    category: "legend",
    province_th: "แมริแลนด์ (สหรัฐอเมริกา)",
    province_en: "Maryland (USA)",
    district_th: "สุสานเวสต์มินสเตอร์ เมืองบัลติมอร์",
    district_en: "Westminster Hall Cemetery, Baltimore",
    lat: 39.2903,
    lng: -76.6231,
    story_th: "บิดาแห่งวรรณกรรมสยองขวัญผู้ถูกพบในสภาพเพ้อคลั่งสวมเสื้อผ้าของคนอื่นก่อนเสียชีวิตอย่างเป็นปริศนาในปี 1849 และตลอดเวลาเกือบ 70 ปี มีชายลึกลับในชุดคลุมดำนำดอกกุหลาบแดง 3 ดอกและคอนญักครึ่งขวดมาวางที่หลุมศพทุกคืนวันเกิดของโพ",
    story_en: "Found delirious in Baltimore wearing a stranger's clothes before his unexplained death in 1849, Poe's grave was visited every January 19 at midnight for six decades by a masked figure leaving three red roses and a half-bottle of cognac.",
    folklore_history_th: "คำพูดสุดท้ายก่อนสิ้นใจของโพคือ 'Reynolds' ซึ่งจนถึงปัจจุบันก็ยังไม่มีนักประวัติศาสตร์คนใดไขปริศนาได้ว่าเกิดอะไรขึ้นกับเขาใน 5 วันสุดท้ายที่หายตัวไป",
    folklore_history_en: "Neither the cause of Poe's final five missing days nor the true identity of the original 'Poe Toaster' has ever been conclusively solved.",
    sound_preset: "whisper",
    wikiCandidates: ["Poe_Toaster", "Edgar_Allan_Poe_House_and_Museum"],
    ytQuery: "Mysterious death of Edgar Allan Poe documentary"
  },
  {
    id: "pin-villisca",
    title_th: "บ้านพักอาถรรพ์วิลลิสกา (โศกนาฏกรรมปริศนาปี 1912 ที่ไร้ผู้ต้องหา)",
    title_en: "The Villisca Axe Murder House Haunting of Iowa",
    category: "ghost",
    province_th: "ไอโอวา (สหรัฐอเมริกา)",
    province_en: "Iowa (USA)",
    district_th: "เมืองวิลลิสกา มอนต์โกเมอรีเคาน์ตี",
    district_en: "Villisca, Montgomery County",
    lat: 40.9272,
    lng: -94.9736,
    story_th: "บ้านไม้สีขาวที่เกิดคดีสะเทือนขวัญในคืนวันที่ 9 มิถุนายน 1912 เมื่อคนร้ายซ่อนตัวอยู่ในห้องใต้หลังคาและลงมือสังหารคนในบ้าน 8 ชีวิต ก่อนจะนำผ้ามาคลุมกระจกเงาทุกบานในบ้านแล้วหายตัวไปอย่างไร้ร่องรอย",
    story_en: "On the night of June 9, 1912, an unknown intruder hid in the attic of the Moore family home, claiming eight lives before draping every mirror and glass window in the house with cloth and vanishing forever.",
    folklore_history_th: "ปัจจุบันบ้านหลังนี้ยังคงสภาพเดิมเหมือนปี 1912 ไม่มีไฟฟ้าหรือน้ำประปา และขึ้นชื่อว่าเป็นหนึ่งในบ้านที่มีปรากฏการณ์เสียงเด็กร้องไห้และประตูเปิดปิดเองรุนแรงที่สุดในอเมริกา",
    folklore_history_en: "Preserved without electricity or plumbing just as it stood in 1912, the house is renowned among paranormal investigators for phantom children's voices and moving objects.",
    sound_preset: "whisper",
    wikiCandidates: ["Villisca_axe_murders"],
    ytQuery: "Villisca Axe Murder House haunted documentary"
  },
  {
    id: "pin-ciguapa",
    title_th: "ซีกัวปา (ภูตสาวป่าผู้มีเท้ากลับหลังแห่งเทือกเขาแคริบเบียน)",
    title_en: "La Ciguapa, The Backward-Footed Siren of Hispaniola",
    category: "monster",
    province_th: "ลาเวกา (สาธารณรัฐโดมินิกัน)",
    province_en: "La Vega Province (Dominican Republic)",
    district_th: "เทือกเขาคอร์ดิลเลอราเซนทรัล",
    district_en: "Cordillera Central Mountains",
    lat: 19.0333,
    lng: -70.6667,
    story_th: "อมนุษย์หญิงสาวผู้มีเรือนผมยาวสลวยคลุมร่างจนถึงข้อเท้า แต่มีฝ่าเท้าทั้งสองข้างหันกลับไปด้านหลัง ทำให้รอยเท้าในโคลนชี้ไปในทิศทางตรงกันข้ามเสมอ คอยสะกดจิตล่อลวงคนเดินป่าให้หายสาบสูญ",
    story_en: "Wild, nocturnal mountain women of Dominican folklore clothed only in cascades of glossy black hair, possessing feet turned completely backward so their footprints lead trackers in the opposite direction.",
    folklore_history_th: "ตำนานระบุว่าห้ามสบตากับซีกัวปาโดยเด็ดขาดเพราะจะถูกมนต์สะกดจนเดินตามเข้าป่าไปโดยไม่รู้ตัว และมีเพียงสุนัขสีขาวที่มีนิ้วเท้าห้านิ้วเท่านั้นที่สามารถไล่ตามรอยของเธอได้ในคืนพระจันทร์เต็มดวง",
    folklore_history_en: "Dominican lore warns never to look into a Ciguapa's eyes; she can only be captured under a full moon with the help of a rare five-toed white dog (perro cinqueño).",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Ciguapa", "Cordillera_Central,_Dominican_Republic"],
    ytQuery: "La Ciguapa Dominican Republic folklore monster"
  },
  {
    id: "pin-Rusalka",
    title_th: "รูซัลกา (พรายน้ำสาวผู้ล่อลวงชายหนุ่มสู่ก้นแม่น้ำดนีเปอร์)",
    title_en: "Rusalka, The Drowned Water Nymph of the Dnieper",
    category: "ghost",
    province_th: "เคียฟ (ยูเครน)",
    province_en: "Kyiv Oblast (Ukraine)",
    district_th: "ลุ่มแม่น้ำดนีเปอร์",
    district_en: "Dnieper River Banks",
    lat: 50.4501,
    lng: 30.5234,
    story_th: "วิญญาณหญิงสาวที่จมน้ำเสียชีวิตและกลายเป็นพรายน้ำผู้มีผิวขาวซีดและเส้นผมยาวเปียกชื้น ในคืนเดือนเพ็ญพวกเธอจะขึ้นมานั่งหวีผมบนกิ่งต้นวิลโลว์ริมน้ำ ร้องเพลงไพเราะล่อลวงชายหนุ่มให้ลงน้ำก่อนจะจั๊กจี้และฉุดลงไปจมน้ำตาย",
    story_en: "The pale,ethereal spirit of a drowned maiden dwelling in Slavic rivers. On moonlit summer nights, Rusalki comb their long wet hair in weeping willow trees, singing enchanting melodies to lure men into the deep currents.",
    folklore_history_th: "ในสัปดาห์รูซาลี (ต้นเดือนมิถุนายน) ชาวสลาฟโบราณจะนำพวงมาลัยดอกไม้ไปแขวนตามต้นไม้ริมน้ำและพกใบจิงจูฉ่าย (Wormwood) ติดตัวเพื่อป้องกันมนต์สะกดของรูซัลกา",
    folklore_history_en: "During Green Week in early June, villagers traditionally carried bitter wormwood herbs to ward off the Rusalka's fatal tickling embrace.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Rusalka"],
    ytQuery: "Rusalka Slavic water spirit mythology"
  }
];

async function run() {
  // Normalize id to lowercase
  for (const b of BATCH_200) b.id = b.id.toLowerCase();

  console.log(`Starting Batch 200 (${BATCH_200.length} new pins)...`);
  const entitiesDir = path.resolve('public/entities');
  const batchFiles = new Set(BATCH_200.map(b => `${b.id}.jpg`));

  const existingHashes = new Set();
  for (const f of fs.readdirSync(entitiesDir)) {
    if (batchFiles.has(f)) continue;
    const p = path.join(entitiesDir, f);
    if (fs.statSync(p).isFile()) {
      existingHashes.add(crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex'));
    }
  }
  console.log(`Loaded ${existingHashes.size} existing unique image hashes.`);

  const finalPins = [];

  for (let i = 0; i < BATCH_200.length; i++) {
    const p = BATCH_200[i];
    const imgFile = `${p.id}.jpg`;
    const destPath = path.join(entitiesDir, imgFile);
    console.log(`[${i + 1}/${BATCH_200.length}] Processing ${p.id} (${p.title_th})...`);

    let imgOk = false;
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
      const buf = fs.readFileSync(destPath);
      const h = crypto.createHash('md5').update(buf).digest('hex');
      if (!existingHashes.has(h)) {
        existingHashes.add(h);
        imgOk = true;
        console.log(` -> Using cached unique thumb (${(buf.length / 1024).toFixed(0)} KB)`);
      }
    }
    if (!imgOk) {
      imgOk = await fetchWikiThumb(p.wikiCandidates, destPath, existingHashes);
    }
    if (!imgOk) {
      console.error(`  !! WARNING: Failed to get unique image for ${p.id}`);
    }

    const yt = await findEmbeddableVideo(p.ytQuery);
    console.log(` -> YouTube: ${yt.url} (${yt.title})`);

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
  console.log('Successfully updated src/data/seedData.ts to 200 pins!');

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

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

const BATCH_225 = [
  {
    id: "pin-luang-phor-sothon",
    title_th: "หลวงพ่อโสธรและปาฏิหาริย์พระลอยน้ำสามพี่น้อง",
    title_en: "Luang Phor Sothon & The Three Floating Buddhas Miracle",
    category: "sacred",
    province_th: "ฉะเชิงเทรา",
    province_en: "Chachoengsao (Thailand)",
    district_th: "เมืองฉะเชิงเทรา - ริมแม่น้ำบางปะกง",
    district_en: "Mueang, Bang Pakong River Banks",
    lat: 13.6736,
    lng: 101.0669,
    story_th: "พระพุทธรูปศักดิ์สิทธิ์คู่บ้านคู่เมืองแปดริ้ว ตำนานเล่าว่าลอยน้ำตามแม่น้ำบางปะกงมาพร้อมพระพี่น้องอีก 2 องค์ ชาวบ้านนับร้อยช่วยกันดึงเชือกแต่ยกไม่ขึ้น จนกระทั่งตั้งศาลเพียงตาทำพิธีอัญเชิญขึ้นประดิษฐานอย่างน่าอัศจรรย์",
    story_en: "One of Thailand's most venerated Buddha images, legend says it miraculously floated down the Bang Pakong River along with two sibling statues from the north during the Ayutthaya period, refusing to be pulled ashore until a proper sacred ritual was held.",
    folklore_history_th: "ขึ้นชื่อเรื่องการขอพรเรื่องหน้าที่การงาน ค้าขาย โชคลาภ และสุขภาพ โดยผู้มาแก้บนมักถวายไข่ต้มแก้บนเป็นจำนวนนับหมื่นฟอง",
    folklore_history_en: "Famous nationwide for granting heartfelt prayers regarding commerce, health, and career, where devotees traditionally present offerings of thousands of boiled eggs in gratitude.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Wat_Sothonwararam", "Chachoengsao_province", "Bang_Pakong_River"],
    ytQuery: "ประวัติหลวงพ่อโสธร พระลอยน้ำ"
  },
  {
    id: "pin-khao-sam-muk",
    title_th: "ศาลเจ้าแม่เขาสามมุขและตำนานรักอมตะแหลมสามมุข",
    title_en: "Chao Mae Khao Sam Muk & The Tragic Sea Lovers Legend",
    category: "legend",
    province_th: "ชลบุรี",
    province_en: "Chonburi (Thailand)",
    district_th: "อ่างศิลา - บางแสน",
    district_en: "Ang Sila, Bang Saen Cape",
    lat: 13.3131,
    lng: 100.9067,
    story_th: "โศกนาฏกรรมความรักอมตะระหว่างสาวงามชื่อสามมุขกับหนุ่มแสน ลูกชายกำนัน ทั้งสองให้คำสาบานต่อหน้าหน้าผาว่าจะรักกันชั่วนิรันดร์ แต่ถูกผู้ใหญ่กีดกัน สาวสามมุขจึงกระโดดหน้าผาลงสู่ทะเล และหนุ่มแสนกระโดดตาม กลายเป็นชื่อหาดบางแสนและเขาสามมุข",
    story_en: "The immortal folklore romance of Sam Muk, a local maiden, and Saen, a village headman's son. Forbidden to marry by aristocratic elders, Sam Muk threw herself off the ocean cliff to keep her eternal vow, and Saen followed her into the tides.",
    folklore_history_th: "ชาวเรือและคู่รักนิยมมากราบไหว้ถวายว่าวและมะพร้าวอ่อน เพื่อขอพรให้ความรักยั่งยืนและเดินทางปลอดภัยในทะเล",
    folklore_history_en: "Fishermen and young lovers still visit the cliffside shrine to offer paper kites and fresh coconuts, seeking eternal fidelity and safe oceanic passage.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Bang_Saen_Beach", "Chonburi_province", "Ang_Sila"],
    ytQuery: "ตำนานเขาสามมุข บางแสน ความรัก"
  },
  {
    id: "pin-phaya-khan-khak",
    title_th: "พญาคันคากและมหาศึกพญาแถนบันดาลฝน",
    title_en: "Phaya Khan Khak, The Giant Toad King & The Sky God Battle",
    category: "legend",
    province_th: "ยโสธร",
    province_en: "Yasothon (Thailand)",
    district_th: "ริมแม่น้ำชี เมืองยโสธร",
    district_en: "Chi River Basin, Mueang Yasothon",
    lat: 15.7925,
    lng: 104.1453,
    story_th: "พระโพธิสัตว์เสวยพระชาติเป็นพญาคางคกแต่เปี่ยมด้วยศีลธรรม จนสรรพสัตว์พากันนับถือ ทำให้พญาแถนเทพแห่งท้องฟ้าทรงพิโรธและหยุดประทานฝน พญาคันคากจึงรวบรวมกองทัพพญาปลวก พญานาค และแมงป่องบุกสรวงสวรรค์จนชนะและทำสัญญาส่งบั้งไฟขอฝน",
    story_en: "The sacred Isan epic of the virtuous Toad Bodhisattva who gathered an army of termites, nagas, and wasps to march up a beanstalk to defeat the haughty Sky God Phaya Thaen, who had cut off rain in cosmic jealousy.",
    folklore_history_th: "เป็นที่มาของประเพณีบุญบั้งไฟอันยิ่งใหญ่ของภาคอีสาน โดยการจุดบั้งไฟพุ่งสู่ฟ้าคือสัญญาณเตือนพญาแถนให้เปิดประตูน้ำฝนตามสัญญาโบราณ",
    folklore_history_en: "The foundational myth behind the Rocket Festival (Bun Bang Fai) throughout Northeast Thailand and Laos, firing homemade bamboo rockets skyward to remind heaven to release monsoon rains.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Yasothon_province", "Rocket_Festival", "Isan"],
    ytQuery: "ตำนานพญาคันคาก พญาแถน บุญบั้งไฟ"
  },
  {
    id: "pin-khun-phaen",
    title_th: "ขุนแผน ดาบฟ้าฟื้น และกุมารทองแห่งเมืองกาญจน์",
    title_en: "Khun Phaen, The Blade of Thunderbolts & Necromantic Arts",
    category: "legend",
    province_th: "กาญจนบุรี",
    province_en: "Kanchanaburi (Thailand)",
    district_th: "เมืองกาญจนบุรี",
    district_en: "Old Mueang Kanchanaburi",
    lat: 14.0228,
    lng: 99.5328,
    story_th: "ยอดขุนศึกผู้เรืองเวทวิทยาคมแห่งวรรณคดีอยุธยา ตีดาบฟ้าฟื้นจากโลหะอาถรรพ์และสายฟ้าฟาด ปลุกเสกกุมารทองคนแรก และขี่ม้าสีหมอกเหาะเหินทะลวงค่ายข้าศึกด้วยวิชาสะกดทัพและกำบังกาย",
    story_en: "The supreme sorcerer-warrior of classical Siamese literature, who forged the legendary Fa Fuen sword from meteorites and lightning-struck copper, bound the spirit of the first golden ghost child (Kuman Thong), and rode the spectral steed Si Mok.",
    folklore_history_th: "เรื่องราวของขุนช้างขุนแผนหยั่งรากลึกในประวัติศาสตร์และไสยเวทไทย โดยมีสถานที่จริงทั้งวัดป่าเลไลยก์ในสุพรรณบุรีและค่ายรบเมืองกาญจนบุรี",
    folklore_history_en: "Blending historical wars of King Trailokanat with authentic esoteric magic manuals, Khun Phaen remains the enduring cultural archetype of Thai occult warriorcraft.",
    sound_preset: "whisper",
    wikiCandidates: ["Khun_Chang_Khun_Phaen", "Kanchanaburi_province"],
    ytQuery: "ตำนานขุนแผน ดาบฟ้าฟื้น กุมารทอง"
  },
  {
    id: "pin-tam-luang",
    title_th: "ถ้ำหลวงขุนน้ำนางนอนและอาถรรพ์เจ้าหญิงเชียงรุ้ง",
    title_en: "Tham Luang & The Sleeping Lady Mountain Legend",
    category: "legend",
    province_th: "เชียงราย",
    province_en: "Chiang Rai (Thailand)",
    district_th: "แม่สาย - ดอยนางนอน",
    district_en: "Mae Sai, Doi Nang Non Range",
    lat: 20.3831,
    lng: 99.8669,
    story_th: "ทิวเขาดอยนางนอนมีสัณฐานเหมือนสตรีมีครรภ์นอนทอดกาย ตำนานเล่าถึงเจ้าหญิงแห่งเชียงรุ้งที่หนีตามคนเลี้ยงม้า เมื่อคนรักถูกทหารปลิดชีพ นางจึงใช้ปิ่นปักผมแทงพระศอ ปลิดชีพตาม เลือดกลายเป็นสายน้ำและร่างกลายเป็นเทือกเขา",
    story_en: "The dramatic karst ridgeline of Doi Nang Non resembles a sleeping pregnant princess. Legend tells of a royal princess of Chiang Rung whose stable-boy lover was executed; grief-stricken, she took her own life with a hairpin, her body transforming into the mountain range.",
    folklore_history_th: "ถ้ำหลวงมีความยาวใต้ดินหลายกิโลเมตรและมีเรื่องเล่าเกี่ยวกับเจ้าแม่นางนอนและสิ่งศักดิ์สิทธิ์ผู้พิทักษ์น้ำบาดาลมาแต่โบราณ",
    folklore_history_en: "Revered as the sacred resting body of the princess, local Shan and Northern Thai people treat the deep subterranean labyrinth of Tham Luang with profound spiritual reverence.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Tham_Luang_Nang_Non", "Doi_Nang_Non"],
    ytQuery: "ตำนานดอยนางนอน ถ้ำหลวง เจ้าแม่นางนอน"
  },
  {
    id: "pin-jorogumo",
    title_th: "โจโรกุโมะ (ปีศาจแมงมุมสาวล่อเหยื่อแห่งน้ำตกโจเรน)",
    title_en: "Jorogumo, The Enchantress Spider Yokai of Joren Falls",
    category: "monster",
    province_th: "ชิซูโอกะ (ญี่ปุ่น)",
    province_en: "Shizuoka Prefecture (Japan)",
    district_th: "คาบสมุทรอิซุ - น้ำตกโจเรน",
    district_en: "Izu Peninsula, Jōren Falls",
    lat: 34.8694,
    lng: 138.9208,
    story_th: "แมงมุมใยทองยักษ์อายุ 400 ปีที่บำเพ็ญตบะจนแปลงกายเป็นสตรีโฉมงามบรรเลงพิณบิวะอย่างไพเราะ เพื่อล่อหลงชายหนุ่มเข้ามาในถ้ำใต้น้ำตกก่อนจะพ่นใยเหนียวพันร่างแล้วดูดกลืนวิญญาณและเลือดสด",
    story_en: "A 400-year-old giant Golden Orb-Weaver spider who takes the guise of an enchanting maiden playing the biwa lute beside cascading waterfalls, ensnaring mesmerized travelers in venomous, unbreakable silk webs.",
    folklore_history_th: "ตำนานน้ำตกโจเรนในคาบสมุทรอิซุเล่าถึงคนตัดไม้ที่โยนขวานไปตัดใยแมงมุมที่มัดข้อเท้าตนเอง ก่อนจะพบว่าใยนั้นดึงต้นไม้ใหญ่ข้างเคียงโค่นลงสู่ก้นบึ้งน้ำตกแทน",
    folklore_history_en: "Classical Edo tales recount a lumberjack at Joren Falls whose quick thinking saved him when he untied the spider's hidden snare from his leg and fastened it around a massive log, watching it dragged into the abyss.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Jorōgumo", "Jōren_Falls", "Izu_Peninsula"],
    ytQuery: "Jorogumo Japanese spider yokai mythology"
  },
  {
    id: "pin-kamaitachi",
    title_th: "คาไมทาจิ (สามพายุเคียวปีศาจแห่งโคชินเอ็ตสึ)",
    title_en: "Kamaitachi, The Sickle-Clawed Wind Weasel Trio",
    category: "monster",
    province_th: "นางาโนะ (ญี่ปุ่น)",
    province_en: "Nagano Prefecture (Japan)",
    district_th: "เทือกเขาแอลป์ญี่ปุ่น",
    district_en: "Kōshin'etsu Region, Japan Alps",
    lat: 36.6513,
    lng: 138.1810,
    story_th: "ปีศาจพังพอนสามพี่น้องที่เคลื่อนไหวด้วยสายลมหมุนอย่างรวดเร็ว ตัวแรกผลักเหยื่อให้ล้มลง ตัวที่สองใช้กรงเล็บคมกริบดุจเคียวฟันเนื้อโดยไม่รู้สึกเจ็บ และตัวที่สามชโลมยาสมานแผลเพื่อหยุดเลือดในชั่วพริบตา",
    story_en: "Three supernatural weasels riding whirlwinds across snowbound mountain passes: the first knocks the victim down, the second slashes flesh with razor-sharp scythe-like claws, and the third applies magical salve so the wound bleeds no blood.",
    folklore_history_th: "ชาวบ้านยุคโบราณใช้ตำนานคาไมทาจิอธิบายรอยแผลบาดลึกบนผิวหนังที่เกิดขึ้นเองตามธรรมชาติจากความกดอากาศและลมหนาวจัด",
    folklore_history_en: "A vivid personification of sudden freezing vacuum gusts that produce painless slicing cuts on skin during severe winter gales in Japanese alpine territory.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Kamaitachi", "Nagano_Prefecture"],
    ytQuery: "Kamaitachi Japanese Yokai wind weasel"
  },
  {
    id: "pin-gashadokuro",
    title_th: "กาชาโดคุโระ (อสูรโครงกระดูกยักษ์พันศพแห่งสมรภูมิ)",
    title_en: "Gashadokuro, The Giant Starving Skeleton of the Battlefields",
    category: "ghost",
    province_th: "เกียวโต (ญี่ปุ่น)",
    province_en: "Kyoto Prefecture (Japan)",
    district_th: "ทุ่งสมรภูมิโบราณ",
    district_en: "Old Heian Charnel Fields",
    lat: 35.0116,
    lng: 135.7681,
    story_th: "อสูรโครงกระดูกขนาดยักษ์สูงกว่า 15 เมตร ที่หลอมรวมขึ้นจากกระดูกของทหารและชาวบ้านนับพันที่ล้มตายในสนามรบโดยไม่ได้รับการทำพิธีศพ มันจะเดินตระเวนในความมืดไร้เสียงเพื่อบิดคอกัดกินเหยื่อที่เดินคนเดียว",
    story_en: "A gargantuan 50-foot skeletal titan formed from the accumulated bones and grudge-filled malice of thousands of soldiers left unburied on ancient battlefields. It creeps completely silently after midnight, biting off heads.",
    folklore_history_th: "เสียงเดียวที่จะได้ยินก่อนกาชาโดคุโระโจมตีคือเสียงดังวิ้งๆ ในแก้วหูของผู้เคราะห์ร้าย และวิธีเดียวที่จะรอดพ้นคือการสวดคาถาพุทธคุ้มครองจนรุ่งสาง",
    folklore_history_en: "The only warning of its ambush is a phantom ringing chime in the ears of the prey; Shinto and Buddhist protective seals alone keep the hungry behemoth at bay until sunrise dissolves its bones.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Gashadokuro", "Heian-kyō"],
    ytQuery: "Gashadokuro giant skeleton Japanese yokai"
  },
  {
    id: "pin-nurikabe",
    title_th: "นูริคาเบะ (กำแพงผีล่องหนขวางทางนักเดินทางยามค่ำคืน)",
    title_en: "Nurikabe, The Impassable Phantom Wall of Fukuoka",
    category: "monster",
    province_th: "ฟุกุโอกะ (ญี่ปุ่น)",
    province_en: "Fukuoka Prefecture (Japan)",
    district_th: "ชายฝั่งคิวชูตอนเหนือ",
    district_en: "Chikuzen Province, Northern Kyushu",
    lat: 33.5904,
    lng: 130.4017,
    story_th: "โยไคที่มีรูปร่างเป็นกำแพงปูนขนาดมหึมาที่มองไม่เห็นในความมืด มันจะขยายตัวอย่างไร้ที่สิ้นสุดเพื่อขวางหน้านักเดินทางยามดึก เดินเลี่ยงซ้ายหรือขวาก็จะชนกำแพงเรื่อยไป",
    story_en: "An invisible colossal wall-like yokai that manifests before midnight travelers along coastal roads. No matter how far one tries to walk around it to the left or right, the wall extends infinitely, blocking all progress.",
    folklore_history_th: "วิธีแก้ทางนูริคาเบะคือการใช้ไม้กวาดหรือกิ่งไม้เคาะที่ส่วนล่างสุดของกำแพงใกล้พื้นดิน มันจะสลายตัวหายไปในทันที",
    folklore_history_en: "Folklore of Kyushu teaches that knocking with a walking stick at the lowest base of the phantom wall breaks its invisible spell instantly.",
    sound_preset: "whisper",
    wikiCandidates: ["Nurikabe", "Fukuoka_Prefecture"],
    ytQuery: "Nurikabe Japanese yokai wall"
  },
  {
    id: "pin-huli-jing",
    title_th: "หูหลี่จิง (จิ้งจอกเก้าหางศักดิ์สิทธิ์แห่งเทือกเขาคุนหลุน)",
    title_en: "Huli Jing, The Nine-Tailed Spirit Fox of Mount Kunlun",
    category: "legend",
    province_th: "ชิงไห่ (จีน)",
    province_en: "Qinghai (China)",
    district_th: "เทือกเขาคุนหลุนศักดิ์สิทธิ์",
    district_en: "Kunlun Mountains Range",
    lat: 36.0000,
    lng: 93.0000,
    story_th: "จิ้งจอกเก้าหางในคัมภีร์ซานไห่จิง ผู้บำเพ็ญตบะนานพันปีจนมีเก้าหางและขนสีขาวบริสุทธิ์ สามารถแปลงกายเป็นหญิงงามชั้นเลิศหรือบัณฑิตปราชญ์ ร้องเสียงเหมือนเด็กทารก และหยั่งรู้ชะตาสวรรค์",
    story_en: "Recorded in the Shan Hai Jing (Classic of Mountains and Seas), this celestial fox spirit cultivated Taoist immortality for a millennium to earn nine tails, shifting into breathtaking mortal forms with voice like an infant.",
    folklore_history_th: "ในยุคแรกเริ่มหูหลี่จิงได้รับการยกย่องเป็นสัญลักษณ์แห่งศิริมงคลและความเจริญรุ่งเรือง ก่อนที่จะถูกผสานเข้ากับตำนานนางปีศาจดวงใจเช่นต๋าจี่ในยุคราชวงศ์หมิง",
    folklore_history_en: "Originally revered as an auspicious omen of peace and imperial prosperity, later dynastic folklore such as Fengshen Yanyi cast the nine-tailed fox as an alluring seductress.",
    sound_preset: "whisper",
    wikiCandidates: ["Huli_jing", "Kunlun_Mountains"],
    ytQuery: "Huli Jing Chinese mythology nine tailed fox"
  },
  {
    id: "pin-fenghuang",
    title_th: "เฟิ่งหวง (พญาหงส์อมตะห้าสีแห่งแดนมังกร)",
    title_en: "Fenghuang, The Five-Colored Immortal Vermilion Phoenix",
    category: "sacred",
    province_th: "หูหนาน (จีน)",
    province_en: "Hunan (China)",
    district_th: "เมืองโบราณเฟิ่งหวง",
    district_en: "Fenghuang Ancient Town, Xiangxi",
    lat: 27.9542,
    lng: 109.5989,
    story_th: "ราชินีแห่งวิหคทั้งปวงในปกรณัมจีน มีลวดลายห้าสีบนขนที่แทนคุณธรรม 5 ประการ (เมตตา ธรรม จริย ปัญญา สัจจะ) จะปรากฏกายเฉพาะในรัชสมัยที่แผ่นดินสงบสุขและมีจักรพรรดิผู้ทรงธรรม",
    story_en: "The mythical sovereign of all birds in Chinese cosmology, its body composed of the five sacred colors representing the five cardinal Confucian virtues. It appears only when righteous harmony reigns throughout the Middle Kingdom.",
    folklore_history_th: "มักจับคู่กับมังกรจีนเป็นสัญลักษณ์ของหยินและหยาง ความสมดุลของจักรวาล และใช้เป็นเครื่องหมายประดับขององค์จักรพรรดินี",
    folklore_history_en: "Paired with the dragon to symbolize the perfect cosmic union of Yin and Yang, Fenghuang remains the traditional royal emblem of Chinese empresses.",
    sound_preset: "temple_bell",
    wikiCandidates: ["Fenghuang", "Fenghuang_County"],
    ytQuery: "Fenghuang Chinese phoenix mythology"
  },
  {
    id: "pin-pocong",
    title_th: "โปจง (ผีมัดผ้าห่อศพกระโดดแห่งชวา)",
    title_en: "Pocong, The Shrouded Leaping Corpse of Java",
    category: "ghost",
    province_th: "ชวากลาง (อินโดนีเซีย)",
    province_en: "Central Java (Indonesia)",
    district_th: "ยอกยาการ์ตา - ทุ่งสุสานโบราณ",
    district_en: "Yogyakarta Charnel Grounds",
    lat: -7.7956,
    lng: 110.3695,
    story_th: "วิญญาณคนตายที่ถูกมัดด้วยผ้าห่อศพสีขาว (ผ้ากาฟัน) ตามประเพณีมุสลิม แต่สัปเหร่อลืมแกะเชือกผูกมัดปมบนศีรษะก่อนฝัง ทำให้วิญญาณไม่สามารถสู่สุคติและต้องกระโดดไปตามท้องถนนเพื่อขอให้คนช่วยแกะเชือก",
    story_en: "An Indonesian restless soul trapped inside its white cotton shroud (kain kafan). Because the mortician forgot to untie the knot above its head before burial, the corpse leaps upright in the dark begging the living to untie its bonds.",
    folklore_history_th: "มีใบหน้าเน่าเปื่อยสีเขียวคล้ำ ดวงตากลวงโบ๋ และสามารถกลิ้งหรือลอยตัวไล่ตามผู้คนที่พบเห็นด้วยความเร็วสูง เป็นผีที่น่ากลัวที่สุดในอินโดนีเซียและมาเลเซีย",
    folklore_history_en: "With a pale decaying face and empty black sockets, the Pocong is widely regarded across Indonesia and Malaysia as the most terrifying modern urban legend.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Pocong", "Kafan"],
    ytQuery: "Pocong Indonesian ghost documentary"
  },
  {
    id: "pin-tiyanak",
    title_th: "ติยานัค (ปีศาจทารกลวงตาแห่งเกาะเซบู)",
    title_en: "Tiyanak, The Deceptive Crying Forest Demon of Cebu",
    category: "monster",
    province_th: "เซบู (ฟิลิปปินส์)",
    province_en: "Cebu (Philippines)",
    district_th: "ป่าทึบเทือกเขาเซบู",
    district_en: "Central Cebu Rainforests",
    lat: 10.3157,
    lng: 123.8854,
    story_th: "อสูรร้ายในป่าที่แกล้งส่งเสียงร้องไห้เหมือนทารกแรกเกิดที่ถูกทิ้งไว้ข้างทาง เมื่อคนใจบุญเดินเข้าไปอุ้มขึ้นมา มันจะกลายร่างเป็นอสูรกายฟันแหลมคม กรงเล็บยาว และฉีกกินเนื้อเหยื่ออย่างโหดเหี้ยม",
    story_en: "A predatory vampire spirit of Philippine folklore that mimics the helpless weeping of an abandoned newborn in dense jungles. When an unsuspecting traveler picks it up, it transforms into a clawed, razor-fanged beast that tears out their throat.",
    folklore_history_th: "ความเชื่อก่อนยุคสเปนเชื่อว่าเกิดจากวิญญาณของเด็กที่เสียชีวิตก่อนคลอด หรือทารกที่ยังไม่ได้รับศีลจุ่ม",
    folklore_history_en: "Pre-colonial animist lore linked Tiyanaks to forest spirits of unborn infants; Spanish friars later blended it into Catholic teachings regarding unbaptized children.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Tiyanak", "Cebu"],
    ytQuery: "Tiyanak Philippine mythology monster"
  },
  {
    id: "pin-penanggalan",
    title_th: "ปีนังกาลัน (ผีหัวบินลากไส้แห่งคาบสมุทรมลายู)",
    title_en: "Penanggalan, The Flying Disembodied Head of Malaya",
    category: "ghost",
    province_th: "เกอดะฮ์ (มาเลเซีย)",
    province_en: "Kedah (Malaysia)",
    district_th: "เทือกเขาเยน",
    district_en: "Mount Jerai, Kedah",
    lat: 5.7878,
    lng: 100.4350,
    story_th: "หญิงสาวผู้เรียนมนต์ดำที่ผิดครู ในยามค่ำคืนศีรษะจะถอดหลุดออกจากร่างพร้อมเครื่องใน ตับ ไต ไส้ พุง ลอยบินเรืองแสงในความมืดเพื่อออกหาดูดเลือดสตรีมีครรภ์และทารกแรกเกิด คล้ายกับผีกระสือของไทย",
    story_en: "A nocturnal vampiric entity appearing as a beautiful woman by day whose head and dangling stomach organs detach at midnight, floating through moonlit palm groves to feast on the blood of expectant mothers.",
    folklore_history_th: "ชาวมลายูโบราณป้องกันปีนังกาลันด้วยการนำใบสับปะรดและหนามระกำมาวางไว้ตามหน้าต่าง เพราะหนามแหลมจะเกี่ยวลำไส้ของมันจนไม่กล้าเข้าใกล้",
    folklore_history_en: "Traditional Malay households place thorny mengkuang leaves around windows to snag the creature's exposed trailing entrails, forcing it to flee before dawn.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Penanggalan", "Mount_Jerai"],
    ytQuery: "Penanggalan Malaysian folklore ghost"
  },
  {
    id: "pin-springheeled-jack",
    title_th: "สปริงฮีลแจ็ก (ปีศาจส้นเท้าสปริงพ่นไฟแห่งลอนดอน)",
    title_en: "Spring-heeled Jack, The Phantom Leaper of Victorian London",
    category: "legend",
    province_th: "ลอนดอน (สหราชอาณาจักร)",
    province_en: "Greater London (United Kingdom)",
    district_th: "ย่านอีสต์เอนด์และแคลปแฮม",
    district_en: "Clapham Common & East End",
    lat: 51.4623,
    lng: -0.1384,
    story_th: "บุคคลลึกลับในยุควิกตอเรียที่มีดวงตาเปล่งแสงสีแดงดั่งลูกไฟ กรงเล็บแหลมคม สวมหมวกทรงสูง และสามารถพ่นไฟสีฟ้าขาวออกจากปาก พร้อมกระโดดข้ามรั้วและกำแพงสูงหลายเมตรได้อย่างน่าอัศจรรย์",
    story_en: "A bizarre Victorian phantom with glowing fiery red eyes, clawed metallic hands, and a cape who terrorized London in 1837, breathing blue and white flames while bounding over 10-foot brick walls with spring-loaded ease.",
    folklore_history_th: "มีการแจ้งความกับเจ้าหน้าที่ตำรวจและนายกเทศมนตรีกรุงลอนดอนหลายร้อยครั้ง แต่ไม่เคยมีใครสามารถจับตัวหรือระบุตัวตนที่แท้จริงของเขาได้",
    folklore_history_en: "Witnessed by hundreds including Lord Mayor of London Sir John Cowan, the sightings spanned seven decades, inspiring early superhero and supervillain literature.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Spring-heeled_Jack", "Clapham_Common"],
    ytQuery: "Spring Heeled Jack Victorian London mystery"
  },
  {
    id: "pin-morgawr",
    title_th: "มอร์กอร์ (อสูรกายทะเลคอร์นวอลล์แห่งอ่าวฟัลมัท)",
    title_en: "Morgawr, The Cornish Sea Monster of Falmouth Bay",
    category: "monster",
    province_th: "คอร์นวอลล์ (สหราชอาณาจักร)",
    province_en: "Cornwall (United Kingdom)",
    district_th: "อ่าวฟัลมัทและเฮลฟอร์ด",
    district_en: "Falmouth Bay & Helford River",
    lat: 50.1500,
    lng: -5.0667,
    story_th: "สัตว์ประหลาดคอยาวขนาดยักษ์คล้ายเพลซิโอซอร์ลำตัวสีเทาดำ ลอยคอเหนือน้ำทะเลคอร์นวอลล์ มีภาพถ่ายโด่งดังในปี 1976 โดย 'แมรี เอฟ' และมีรายงานการพบเห็นโดยชาวประมงหลายสิบคน",
    story_en: "A long-necked hump-backed sea serpent inhabiting the rocky waters of Cornwall. Sighted since the 19th century and photographed in 1976 by an anonymous resident signed 'Mary F', fishermen describe it as a surviving marine reptile.",
    folklore_history_th: "ในภาษาคอร์นิชโบราณ 'มอร์กอร์' แปลว่า 'ยักษ์แห่งท้องทะเล' และมักปรากฏตัวคู่กับสภาพอากาศแปรปรวนกลางมหาสมุทรแอตแลนติก",
    folklore_history_en: "Derived from the Cornish language meaning 'Sea Giant', sightings cluster around anomalous thermal currents in Falmouth Bay.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Morgawr_(folklore)", "Falmouth,_Cornwall"],
    ytQuery: "Morgawr Cornish sea monster Falmouth Bay"
  },
  {
    id: "pin-selkie",
    title_th: "เซลกี (พรายแมวน้ำจำแลงกายแห่งหมู่เกาะออร์กนีย์)",
    title_en: "The Selkies, Shape-Shifting Seal Folk of Orkney",
    category: "legend",
    province_th: "หมู่เกาะออร์กนีย์ (สกอตแลนด์)",
    province_en: "Orkney Islands (Scotland, UK)",
    district_th: "เกาะฮอยและสแกปาโฟลว์",
    district_en: "Island of Hoy & Scapa Flow",
    lat: 58.9809,
    lng: -2.9605,
    story_th: "อมนุษย์ในความเชื่อเซลติกที่อาศัยอยู่ในทะเลในร่างแมวน้ำ แต่เมื่อขึ้นฝั่งจะถอดหนังแมวน้ำออกเป็นมนุษย์หนุ่มสาวรูปงาม หากชายใดขโมยหนังแมวน้ำไปซ่อน เซลกีจะไม่สามารถกลับลงทะเลได้และต้องยอมเป็นภรรยา",
    story_en: "Mythological mythological beings capable of therianthropy, living as seals in the cold Atlantic but shedding their sleek sea skins on isolated beaches to dance as mortal beauties under the midnight moon.",
    folklore_history_th: "เมื่อใดที่เซลกีพบหนังแมวน้ำของตนที่ถูกซ่อนไว้ เธอจะกระโจนกลับสู่มหาสมุทรทันทีโดยไม่หันหลังกลับ แม้จะมีบุตรกับมนุษย์แล้วก็ตาม",
    folklore_history_en: "Heartbreaking Scottish coastal ballads tell of captured Selkie brides who silently pine for the ocean until finding their hidden pelts and diving forever back to their sea kin.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Selkie", "Orkney"],
    ytQuery: "Selkies Scottish folklore seal mythology"
  },
  {
    id: "pin-tatzelwurm",
    title_th: "ทัตเซลเวิร์ม (กิ้งก่ามังกรหน้าแมวแห่งเทือกเขาแอลป์สวิส)",
    title_en: "Tatzelwurm, The Cat-Headed Clawed Dragon of the Alps",
    category: "monster",
    province_th: "แบร์น (สวิตเซอร์แลนด์)",
    province_en: "Canton of Bern (Switzerland)",
    district_th: "ช่องเขาเบอร์นีสโอเบอร์แลนด์",
    district_en: "Bernese Oberland Alpine Caves",
    lat: 46.5912,
    lng: 7.9080,
    story_th: "สัตว์เลื้อยคลานประหลาดที่มีลำตัวยาวคล้ายงูหรือกิ้งก่ายักษ์ มีขาหน้าสองข้างแต่ไม่มีขาหลัง และมีศีรษะคล้ายแมว อาศัยอยู่ในซอกหินสูงชันบนเทือกเขาแอลป์ สามารถพ่นไอร้อนและเสียงขู่ฟ่อคล้ายอสรพิษ",
    story_en: "An elusive stub-legged reptilian cryptid of Alpine folklore, sporting a stubby serpent-like scaly body, two clawed forelimbs, and the ferocious fanged head of an angry wildcat hidden inside crevasses.",
    folklore_history_th: "มีบันทึกการพบเห็นในเยอรมนี ออสเตรีย และสวิตเซอร์แลนด์มานานนับร้อยปี และได้รับการตีพิมพ์ในวารสารธรรมชาติวิทยาฉบับเบอร์ลินในปี 1934",
    folklore_history_en: "Recorded in Swiss naturalist scheuchzer's 18th-century survey and documented by alpine shepherds across the Bernese Oberland.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Tatzelwurm", "Bernese_Oberland"],
    ytQuery: "Tatzelwurm Alpine cryptid documentary"
  },
  {
    id: "pin-tarasque",
    title_th: "ทาราสก์ (อสูรมังกรกระดองเต่าแห่งลุ่มแม่น้ำโรน)",
    title_en: "The Tarasque, Spiked Dragon of Provence & Saint Martha",
    category: "monster",
    province_th: "พรอว็องส์ (ฝรั่งเศส)",
    province_en: "Provence (France)",
    district_th: "เมืองทารัสกง ริมแม่น้ำโรน",
    district_en: "Tarascon, Rhône Valley",
    lat: 43.8058,
    lng: 4.6569,
    story_th: "อสูรกายครึ่งสิงโตครึ่งเต่ายักษ์ที่มีกระดองหนามแหลมคม ขา 6 ข้าง หางเป็นงูพิษ และลมหายใจเป็นไฟบรรลัยกัลป์ มันเคยทำลายเรือและชาวบ้านริมฝั่งแม่น้ำโรน จนกระทั่งนักบุญมาร์ธาใช้เพียงน้ำมนต์และไม้กางเขนสะกดให้เชื่อง",
    story_en: "A mythological six-legged chimera boasting a lion's head, spiked armored tortoise carapace, viper's tail, and scalding fiery breath that ravaged the Rhône riverbank until tamed peacefully by Saint Martha with holy water.",
    folklore_history_th: "ได้รับการขึ้นทะเบียนเป็นมรดกทางวัฒนธรรมที่จับต้องไม่ได้ของยูเนสโก (UNESCO) และมีการจัดเทศกาลแห่หุ่นทาราสก์ประจำปีในเมืองทารัสกงทุกวันอาทิตย์สุดท้ายของเดือนมิถุนายน",
    folklore_history_en: "Inscribed on UNESCO's Intangible Cultural Heritage list, the Festival of the Tarasque has been celebrated annually in Tarascon since King René of Anjou in 1474.",
    sound_preset: "water_spirit",
    wikiCandidates: ["Tarasque", "Tarascon"],
    ytQuery: "The Legend of the Tarasque dragon France"
  },
  {
    id: "pin-skunk-ape",
    title_th: "สคังค์เอป (บิ๊กฟุตกลิ่นสาบแห่งหนองน้ำเอเวอร์เกลดส์)",
    title_en: "The Florida Skunk Ape of the Everglades Swamps",
    category: "monster",
    province_th: "ฟลอริดา (สหรัฐอเมริกา)",
    province_en: "Florida (USA)",
    district_th: "อุทยานแห่งชาติเอเวอร์เกลดส์",
    district_en: "Big Cypress & Everglades National Park",
    lat: 25.8614,
    lng: -80.8931,
    story_th: "อมนุษย์ขนดกสีน้ำตาลแดงคล้ายลิงกอริลลายืนสองขาสูงกว่า 2.2 เมตร อาศัยอยู่ในป่าพรุเอเวอร์เกลดส์ ส่งกลิ่นเหม็นเน่ารุนแรงคล้ายก๊าซไข่เน่าและสคังค์จนสามารถได้กลิ่นล่วงหน้าก่อนจะเห็นตัว",
    story_en: "A massive, bipedal ape-like hominid cloaked in matted reddish-brown hair roaming the alligator-infested cypress swamps of Florida, renowned for an overpowering methane and rotten-egg stench that precedes its appearance.",
    folklore_history_th: "มีภาพถ่ายปริศนาโด่งดังในปี 2000 ส่งให้นายอำเภอคอลเลียร์เคาน์ตีโดยหญิงชรานิรนาม และยังคงเป็นตำนานสัตว์ลึกลับที่โด่งดังที่สุดของรัฐฟลอริดา",
    folklore_history_en: "Subject of the famous 2000 Myakka skunk ape photographs and centuries of Seminole and Miccosukee tribal lore describing the swamp giant Ot-ne-yar-heh.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Skunk_ape", "Everglades"],
    ytQuery: "Florida Skunk Ape documentary Bigfoot of the Everglades"
  },
  {
    id: "pin-hopkinsville",
    title_th: "ก็อบลินอวกาศแห่งฮอปกินส์วิลล์ (การปะทะด้วยปืนปี 1955)",
    title_en: "The Kelly-Hopkinsville Goblin Encounter of 1955",
    category: "monster",
    province_th: "เคนทักกี (สหรัฐอเมริกา)",
    province_en: "Kentucky (USA)",
    district_th: "เคลลี - ฮอปกินส์วิลล์ คริสเตียนเคาน์ตี",
    district_en: "Kelly, Christian County",
    lat: 36.9692,
    lng: -87.4739,
    story_th: "คืนวันที่ 21 สิงหาคม 1955 ครอบครัวซัตตันถูกสิ่งมีชีวิตตัวเล็กสูง 1 เมตร ผิวสีเงินสะท้อนแสง หูกางแหลม และดวงตาสีเหลืองเรืองแสงบุกปิดล้อมบ้านไร่ สมาชิกในบ้านใช้ปืนลูกซองยิงใส่หลายสิบนัดแต่กระสุนเด้งออกราวกับโลหะ",
    story_en: "On August 21, 1955, the Sutton farmhouse in rural Kentucky was besieged by silver-skinned, three-foot-tall entities with oversized heads, bat-like ears, and glowing yellow eyes. Shotgun blasts at point-blank range sounded like hitting metal buckets.",
    folklore_history_th: "เหตุการณ์นี้ได้รับการตรวจสอบอย่างละเอียดโดยกองทัพอากาศสหรัฐฯ และตำรวจรัฐเคนทักกี กลายเป็นแรงบันดาลใจให้กับภาพยนตร์ E.T. และโปเกมอน Sableye",
    folklore_history_en: "Investigated by local police and Project Blue Book, this remains one of the most thoroughly documented close encounters in American UFO lore.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Kelly–Hopkinsville_encounter", "Hopkinsville,_Kentucky"],
    ytQuery: "Kelly Hopkinsville encounter goblins documentary"
  },
  {
    id: "pin-snallygaster",
    title_th: "สแนลลีแกสเตอร์ (อสูรปีกสัตว์เลื้อยคลานแห่งเทือกเขาบลูริดจ์)",
    title_en: "The Snallygaster of South Mountain & Blue Ridge",
    category: "monster",
    province_th: "แมริแลนด์ (สหรัฐอเมริกา)",
    province_en: "Maryland (USA)",
    district_th: "มิดเดิลทาวน์แวลลีย์ เทือกเขาเซาท์เมาน์เทน",
    district_en: "Middletown Valley, South Mountain",
    lat: 39.4445,
    lng: -77.5428,
    story_th: "สัตว์ประหลาดครึ่งนกครึ่งสัตว์เลื้อยคลานที่มีจงอยปากเป็นเหล็กกล้า มีฟันแหลมคม ตาเดียวกลางหน้าผาก และหนวดปลาหมึกงอกออกมา มันบินโฉบลงมาจากท้องฟ้าด้วยเสียงกรีดร้องแหลมบาดหูเพื่อฉุดเหยื่อไปกิน",
    story_en: "A dragon-like avian chimera sporting a metallic beak lined with razor teeth, one eye, octopus tentacles, and a blood-curdling screech that swooped down on isolated mountain farms in western Maryland.",
    folklore_history_th: "ผู้อพยพชาวเยอรมันในคริสต์ศตวรรษที่ 18 เรียกว่า 'Schneller Geist' (วิญญาณว่องไว) และมักวาดดาวเจ็ดแฉกไว้ที่โรงนาเพื่อป้องกันอสูรชนิดนี้ แม้แต่ประธานาธิบดี ธีโอดอร์ รูสเวลต์ ยังเคยให้ความสนใจจะไปล่ามัน",
    folklore_history_en: "German immigrants called it 'Schneller Geist' and painted seven-pointed hex signs on barn gables to ward it off; President Theodore Roosevelt even considered postponing a safari to hunt it.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Snallygaster", "South_Mountain_(Maryland_and_Pennsylvania)"],
    ytQuery: "Snallygaster monster Maryland folklore"
  },
  {
    id: "pin-la-cegua",
    title_th: "ลาเซกัว (หญิงงามหัวม้าแห่งทางเปลี่ยวยามราตรี)",
    title_en: "La Cegua, The Horse-Faced Siren of Central America",
    category: "ghost",
    province_th: "การ์ตาโก (คอสตาริกา)",
    province_en: "Cartago Province (Costa Rica)",
    district_th: "ถนนสายเก่าภูเขาการ์ตาโก",
    district_en: "Old Mountain Passes of Cartago",
    lat: 9.8644,
    lng: -83.9194,
    story_th: "วิญญาณหญิงสาวสวยงามในชุดคลุมยาวสีดำยืนร้องไห้ข้างทางเปลี่ยวตอนดึก เมื่อชายเจ้าชู้ขี่ม้าหรือขับรถเข้ามาอาสาไปส่ง พอเธอหันหน้ามา ใบหน้างดงามกลับกลายร่างเป็นกะโหลกม้าเน่าเปื่อยมีฟันแหลมและตาสีแดงเพลิง",
    story_en: "A terrifying spectral siren who appears as a stunning young woman weeping along desolate country roads. When an unfaithful man offers her a ride, she turns her head to reveal the rotting, fleshless skull of a horse with fiery eyes.",
    folklore_history_th: "ตำนานเล่าขานกันทั่วคอสตาริกาและนิการากัวเพื่อเตือนสติชายเจ้าชู้และคนเมาที่ชอบกลับบ้านดึก โดยผู้ที่ได้พบเห็นมักจะช็อกจนเสียสติไปหลายวัน",
    folklore_history_en: "Widespread throughout Costa Rican and Nicaraguan oral folklore as a supernatural moral guardian punishing drunkards, womanizers, and domestic abusers.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["Cegua", "Cartago,_Costa_Rica"],
    ytQuery: "La Cegua legend Costa Rica ghost"
  },
  {
    id: "pin-madremonte",
    title_th: "มาเดรเดมอนเต (เทวีเจ้าป่าผมมอสแห่งเทือกเขาแอนดีส)",
    title_en: "Madremonte, The Moss-Crowned Forest Mother of the Andes",
    category: "sacred",
    province_th: "อันติโอเกีย (โคลอมเบีย)",
    province_en: "Antioquia (Colombia)",
    district_th: "ป่าดิบชื้นเทือกเขาแอนดีสตอนเหนือ",
    district_en: "Northern Andean Cloud Forests",
    lat: 6.2442,
    lng: -75.5812,
    story_th: "จิตวิญญาณผู้พิทักษ์ผืนป่าและสายน้ำในโคลอมเบีย สตรีร่างยักษ์ที่มีเรือนผมยาวเป็นมอสและเถาวัลย์ สวมเสื้อคลุมใบตอง เมื่อใดที่คนตัดไม้ทำลายป่าหรือขโมยที่ดินคนจน เธอจะลงมาแช่ตัวในแม่น้ำจนเกิดน้ำท่วมใหญ่และดินถล่มลงโทษ",
    story_en: "The formidable mother-spirit of forests and rivers in Colombian folklore. Clothed in leaves and green moss, with glowing eyes beneath a canopy of ferns, she unleashes devastating flash floods upon illegal loggers and corrupt landowners.",
    folklore_history_th: "ชาวนาและคนตัดไม้เชื่อว่าหากเธอส่งเสียงกรีดร้องก้องหุบเขา จะเกิดพายุฝนฟ้าคะนองรุนแรง และผู้ที่หลงทางในป่าต้องผูกเถาวัลย์เป็นปมเพื่อขอทางจากเธอ",
    folklore_history_en: "A vital ecological guardian in Andean mythology, local peasants ward off her wrath by speaking with humility to the forest and respecting river boundaries.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Madremonte", "Andes"],
    ytQuery: "Madremonte Colombian folklore legend"
  },
  {
    id: "pin-grootslang",
    title_th: "กรูตสแลง (พญาช้างอสรพิษดึกดำบรรพ์แห่งถ้ำริชเตอร์สเฟลด์)",
    title_en: "Grootslang, The Primal Elephant-Serpent of the Wonder Hole",
    category: "monster",
    province_th: "นอร์เทิร์นเคป (แอฟริกาใต้)",
    province_en: "Northern Cape (South Africa)",
    district_th: "อุทยานแห่งชาติริชเตอร์สเฟลด์ ริมแม่น้ำออเรนจ์",
    district_en: "Richtersveld & Orange River Gorge",
    lat: -28.2500,
    lng: 17.2500,
    story_th: "อสูรกายยุคบรรพกาลที่เทพเจ้าสร้างขึ้นก่อนมนุษย์ มีพละกำลังมหาศาลของช้างผสมกับความว่องไวและพิษร้ายของพญางูยักษ์ อาศัยอยู่ในถ้ำลึก 'หลุมมหัศจรรย์' ก้นบึ้งแม่น้ำออเรนจ์ที่เต็มไปด้วยเพชรพลอยล้ำค่า",
    story_en: "A primordial titan created by the gods before humanity, possessing the titanic size of an elephant combined with the cunning malice of a giant serpent. It rules a diamond-lined abyss known as the Bottomless Pit beneath the Richtersveld.",
    folklore_history_th: "เมื่อเทพเจ้ารู้ตัวว่ากรูตสแลงมีพลังมากเกินไปจึงแยกมันออกเป็นช้างและงู แต่มียักษ์ตนหนึ่งหลบหนีลงสู่ถ้ำใต้พิภพ และคอยล่อลวงนักขุดเพชรที่โลภมากไปกลืนกิน",
    folklore_history_en: "Khoisan legend tells that gods realized creating a creature with both elephant strength and serpent cunning was a catastrophic mistake, though one original escaped into subterranean caves.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["Grootslang", "Richtersveld"],
    ytQuery: "Grootslang African mythology monster"
  }
];

async function run() {
  for (const b of BATCH_225) b.id = b.id.toLowerCase();

  console.log(`Starting Batch 225 (${BATCH_225.length} new pins)...`);
  const entitiesDir = path.resolve('public/entities');
  const batchFiles = new Set(BATCH_225.map(b => `${b.id}.jpg`));

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

  for (let i = 0; i < BATCH_225.length; i++) {
    const p = BATCH_225[i];
    const imgFile = `${p.id}.jpg`;
    const destPath = path.join(entitiesDir, imgFile);
    console.log(`[${i + 1}/${BATCH_225.length}] Processing ${p.id} (${p.title_th})...`);

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

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

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

function searchYouTube(query) {
  return new Promise((resolve) => {
    const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        const matches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]);
        resolve([...new Set(matches)]);
      });
    }).on('error', () => resolve([]));
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

async function findEmbeddableVideo(queries) {
  for (const q of queries) {
    await new Promise(r => setTimeout(r, 350));
    const vids = await searchYouTube(q);
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
  }
  return {
    url: 'https://www.youtube.com/watch?v=AmbyfczXkjU',
    title: 'Mystery Folklore Documentary'
  };
}

async function fetchWikiThumbWithCommonsFallback(wikiCandidates, commonsSearch, destPath, existingHashes) {
  for (const candidate of wikiCandidates) {
    const [lang, title] = candidate.includes(':') ? candidate.split(':') : ['en', candidate];
    try {
      const apiUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800&redirects=1`;
      const res = await fetchJson(apiUrl);
      if (res.status === 200 && res.data?.query?.pages) {
        const page = Object.values(res.data.query.pages)[0];
        if (page?.thumbnail?.source) {
          await downloadFile(page.thumbnail.source, destPath);
          const buf = fs.readFileSync(destPath);
          const hash = crypto.createHash('md5').update(buf).digest('hex');
          if (buf.length > 1500 && !existingHashes.has(hash)) {
            existingHashes.add(hash);
            console.log(` -> Downloaded unique wiki thumb (${lang}:${title}) [${(buf.length / 1024).toFixed(0)} KB]`);
            return true;
          }
        }
      }
    } catch (e) {
      // try next candidate
    }
  }

  // Fallback to Wikimedia Commons search
  try {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('filetype:bitmap ' + commonsSearch)}&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
    const res = await fetchJson(searchUrl);
    if (res.status === 200 && res.data?.query?.pages) {
      for (const page of Object.values(res.data.query.pages)) {
        const thumbUrl = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;
        if (thumbUrl) {
          await downloadFile(thumbUrl, destPath);
          const buf = fs.readFileSync(destPath);
          const hash = crypto.createHash('md5').update(buf).digest('hex');
          if (buf.length > 1500 && !existingHashes.has(hash)) {
            existingHashes.add(hash);
            console.log(` -> Downloaded unique Commons thumb (${commonsSearch}) [${(buf.length / 1024).toFixed(0)} KB]`);
            return true;
          }
        }
      }
    }
  } catch (e) {
    console.warn(`Commons search failed for ${commonsSearch}:`, e.message);
  }
  return false;
}

const BATCH_180 = [
  {
    id: "pin-krahang",
    title_th: "ผีกระหัง (ชายสากตำข้าวบินยามราตรี)",
    title_en: "Krahang, The Night-Flying Mortar Demon",
    category: "ghost",
    province_th: "สุพรรณบุรี",
    province_en: "Suphan Buri (Thailand)",
    district_th: "ศรีประจันต์",
    district_en: "Si Prachan",
    lat: 14.6158,
    lng: 100.1472,
    story_th: "ชายผู้เรืองวิชาอาคมแต่ผิดครูจนกลายร่างเป็นผีกระหังในยามค่ำคืน ใช้กระด้งฝัดข้าวต่างปีกสองข้างและใช้สากตำข้าวหรือสากกะเบือหนีบไว้ที่ขาเพื่อเหินบินออกหากินของโสโครกคู่กับผีกระสือ",
    story_en: "A male sorcerer cursed by broken dark-magic taboos who transforms at night. Strapping woven winnowing baskets to his arms as wings and riding a wooden rice-pounding pestle between his legs, he glides across moonlit rice paddies alongside the Krasue.",
    folklore_history_th: "ความเชื่อพื้นบ้านภาคกลางของไทยที่มักจับคู่ผีกระสือและผีกระหังเป็นผัวเมียกัน สะท้อนวิถีสังคมเกษตรกรรมที่ใช้เครื่องมือตำข้าวและฝัดข้าวในชีวิตประจำวัน",
    folklore_history_en: "Deeply rooted in Central Thai agrarian folklore, the Krahang serves as the male counterpart to the Krasue, weaving rural rice-harvesting tools into nocturnal supernatural terror.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["en:Krahang", "en:Suphan_Buri_province", "en:Rice_pounder"],
    commonsSearch: "rice winnowing basket Thailand night",
    ytQueries: ["ตำนานผีกระหัง", "Krahang Thai folklore ghost", "ผีกระสือ ผีกระหัง ประวัติ"]
  },
  {
    id: "pin-phipokang",
    title_th: "ผีโป่งค่าง (อสูรดูดเลือดหัวแม่เท้าแห่งป่าดิบ)",
    title_en: "Phi Pong Khang, The Jungle Toe-Blood Spirit",
    category: "monster",
    province_th: "กาญจนบุรี",
    province_en: "Kanchanaburi (Thailand)",
    district_th: "สังขละบุรี - ทุ่งใหญ่นเรศวร",
    district_en: "Sangkhla Buri, Thung Yai Naresuan",
    lat: 15.2289,
    lng: 98.9181,
    story_th: "ภูตผีป่าดงดิบที่เกิดจากอาถรรพ์ดินโป่ง มีร่างคล้ายลิงหรือค่างสีดำทะมึน ดวงตาแดงฉาน ยามค่ำคืนจะแอบย่องเข้ามาดูดเลือดที่หัวแม่เท้าของพรานป่าที่นอนหลับในห้างส่องสัตว์จนแห้งตาย",
    story_en: "A sinister rainforest entity born from cursed mineral salt-licks. Appearing as a shadowy black langur with glowing crimson eyes, it creeps into hunters' camps after midnight to suck the lifeblood through the big toe of sleeping trekkers.",
    folklore_history_th: "พรานป่ารุ่นเก่าจึงมีธรรมเนียมต้องนอนสลับหัวสลับเท้าหรือผูกเชือกที่นิ้วหัวแม่เท้าเพื่อป้องกันไม่ให้ผีโป่งค่างรู้ตำแหน่งและเข้ามาดูดเลือดได้",
    folklore_history_en: "Veteran Thai jungle hunters traditionally sleep foot-to-head or tie protective cords around their toes when camping near deep forest salt licks to ward off the Phi Pong Khang.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["en:Dusky_leaf_monkey", "en:Ghosts_in_Thai_culture"],
    commonsSearch: "Trachypithecus obscurus Thailand forest",
    ytQueries: ["ตำนานผีโป่งค่าง", "ผีโป่งค่าง เรื่องเล่าพรานป่า", "Phi Pong Khang Thai jungle ghost"]
  },
  {
    id: "pin-nangtakian",
    title_th: "นางตะเคียน (รุกขเทวีแห่งไม้ใหญ่โบราณ)",
    title_en: "Nang Takian, Spirit of the Ancient Hopea Tree",
    category: "ghost",
    province_th: "พระนครศรีอยุธยา",
    province_en: "Phra Nakhon Si Ayutthaya (Thailand)",
    district_th: "บางไทร",
    district_en: "Bang Sai",
    lat: 14.2134,
    lng: 100.4988,
    story_th: "รุกขเทวีสาวผู้สิงสถิตอยู่ในต้นตะเคียนทองขนาดใหญ่อายุหลายร้อยปี มักปรากฏกายในชุดไทยสไบเฉียงงดงามแต่เปี่ยมด้วยความเฮี้ยนดุร้าย ห้ามใครตัดโค่นหรือนำไปสร้างบ้านเรือนโดยไม่ขอขมา",
    story_en: "A powerful female tree spirit inhabiting centuries-old Hopea odorata timber. Dressed in traditional silk sabai, she fiercely guards her sacred trunk, visiting calamity upon woodcutters while granting fortune to respectful devotees.",
    folklore_history_th: "ไม้ตะเคียนเป็นไม้เนื้อแข็งที่นิยมนำมาขุดเป็นเรือยาวโบราณ จึงเกิดพิธีเซ่นไหว้แม่ย่านางและนางตะเคียนที่สืบทอดคู่สายน้ำเจ้าพระยามาแต่สมัยอยุธยา",
    folklore_history_en: "Because Hopea odorata wood was historically hollowed into royal barges and racing boats along the Chao Phraya River, reverence for Nang Takian merged closely with Mae Yanang boat-spirit rituals.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Nang_Ta-khian", "en:Hopea_odorata"],
    commonsSearch: "Hopea odorata Thailand shrine",
    ytQueries: ["ตำนานนางตะเคียน", "Nang Takian Thai folklore", "ประวัติเจ้าแม่ตะเคียน"]
  },
  {
    id: "pin-phraya-phichai",
    title_th: "พระยาพิชัยดาบหักและดวงวิญญาณนักรบผู้พิทักษ์เมืองท่าเหนือ",
    title_en: "Phraya Phichai Dap Hak & The Broken-Sword Spirit",
    category: "legend",
    province_th: "อุตรดิตถ์",
    province_en: "Uttaradit (Thailand)",
    district_th: "พิชัย",
    district_en: "Phichai",
    lat: 17.2882,
    lng: 100.0875,
    story_th: "ขุนศึกคู่พระทัยสมเด็จพระเจ้าตากสินมหาราช ผู้ถือดาบสองมือออกรบขับไล่กองทัพข้าศึกที่สมรภูมิโพธิ์สามต้นและเมืองพิชัยจนดาบข้างขวาหักสะบั้นแต่ยังคงรบชนะอย่างห้าวหาญ",
    story_en: "The legendary right-hand general of King Taksin the Great, who fought fiercely with twin swords until his right blade snapped in combat—yet refused to retreat, routing the invading army with a broken sword.",
    folklore_history_th: "เมื่อสิ้นรัชกาลพระเจ้าตากสิน ท่านขอถวายชีวิตตามสมเด็จพระเจ้าอยู่หัวโดยไม่ยอมรับราชการต่อ ดวงวิญญาณยังคงเป็นที่เคารพสักการะสูงสุดของชาวอุตรดิตถ์",
    folklore_history_en: "Famous for his absolute loyalty, he chose execution over serving a new dynasty after King Taksin's death, becoming an immortal guardian spirit of Uttaradit province.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Phraya_Phichai", "th:พระยาพิชัยดาบหัก"],
    commonsSearch: "Phraya Phichai monument Uttaradit",
    ytQueries: ["ประวัติพระยาพิชัยดาบหัก", "Phraya Phichai broken sword legend", "ตำนานพระยาพิชัยดาบหัก"]
  },
  {
    id: "pin-wiangkalong",
    title_th: "เวียงกาหลง (นครโบราณและอาถรรพ์เตาเผาพันปี)",
    title_en: "Wiang Kalong, The Cursed Kiln City of Lanna",
    category: "sacred",
    province_th: "เชียงราย",
    province_en: "Chiang Rai (Thailand)",
    district_th: "เวียงป่าเป้า",
    district_en: "Wiang Pa Pao",
    lat: 19.1936,
    lng: 99.5122,
    story_th: "เมืองโบราณกลางหุบเขาล้านนาที่ชื่อมาจากตำนาน 'กาหลงทาง' เพราะป่าทึบและหมอกอาถรรพ์บดบังทิศทาง มีซากเตาเผาเครื่องถ้วยโบราณนับร้อยเตาที่มีผู้เล่าขานถึงวิญญาณช่างปั้นผู้เฝ้าสมบัติ",
    story_en: "An ancient fortified Lanna city named 'Where Even Crows Lose Their Way' due to disorienting mountain mists. Hundreds of medieval porcelain kilns remain guarded by ancestral spirits who punish treasure looters.",
    folklore_history_th: "เครื่องถ้วยเวียงกาหลงมีลวดลายกาบินและดอกไม้สีดำอันเป็นเอกลักษณ์ของอาณาจักรล้านนายุคทอง ชาวบ้านเชื่อว่าผู้ขุดของโบราณไปโดยไม่รับอนุญาตจะต้องเจออาถรรพ์จนต้องนำมาคืน",
    folklore_history_en: "Renowned for exquisite black-painted celadon ceramics from the 14th–16th centuries, local lore warns that anyone taking intact Wiang Kalong vessels falls ill until the artifacts are returned.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Wiang_Pa_Pao_district", "en:Sankampaeng_kilns"],
    commonsSearch: "Wiang Kalong ceramics Lanna",
    ytQueries: ["ตำนานเวียงกาหลง", "เครื่องถ้วยเวียงกาหลง อาถรรพ์", "Wiang Kalong ancient city"]
  },
  {
    id: "pin-toyol",
    title_th: "ตุยูล (ผีทารกมนต์ดำแห่งคาบสมุทรมลายู)",
    title_en: "Toyol, The Necromantic Infant Spirit of Malaya",
    category: "ghost",
    province_th: "กลันตัน (มาเลเซีย)",
    province_en: "Kelantan (Malaysia)",
    district_th: "โกตาบารู",
    district_en: "Kota Bharu",
    lat: 6.1254,
    lng: 102.2381,
    story_th: "วิญญาณทารกในไสยศาสตร์มลายูและอินโดนีเซีย มีผิวกายสีเขียวเทา ศีรษะล้าน ดวงตากลมโตสีแดง ผู้เลี้ยงด้วยเลือดจะสั่งให้มันแอบลักขโมยทรัพย์สินเงินทองของเพื่อนบ้านในยามราตรี",
    story_en: "An undead infant spirit invoked by Southeast Asian shamans (dukun or bomoh). With greyish-green skin and gleaming red eyes, the Toyol sneaks into houses at night to steal half of a victim's hidden cash for its master.",
    folklore_history_th: "ชาวบ้านป้องกันตุยูลด้วยการวางลูกแก้ว เมล็ดถั่วเขียว หรือปูเสฉวนไว้ใกล้ที่เก็บเงิน เพราะนิสัยความเป็นเด็กของมันจะมัวแต่เล่นของเล่นจนลืมขโมยเงิน",
    folklore_history_en: "Because the Toyol retains the mind of a curious child, villagers scatter glass marbles, mung beans, or dried crabs near safes to distract the spirit until dawn breaks.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Toyol", "en:Malay_folklore"],
    commonsSearch: "Kelantan traditional Malay house night",
    ytQueries: ["Toyol Malay ghost documentary", "ตำนานผีตุยูล มาเลเซีย", "Tuyul Indonesian folklore"]
  },
  {
    id: "pin-orangminyak",
    title_th: "โอรังมินยัก (มนุษย์น้ำมันอาถรรพ์ยามวิกาล)",
    title_en: "Orang Minyak, The Cursed Oily Man of Perak",
    category: "monster",
    province_th: "เปรัก (มาเลเซีย)",
    province_en: "Perak (Malaysia)",
    district_th: "อีโปห์ - หุบเขาคินตา",
    district_en: "Ipoh, Kinta Valley",
    lat: 4.5975,
    lng: 101.0901,
    story_th: "ชายผู้ทำสัญญากับปีศาจและชโลมร่างกายด้วยน้ำมันมนต์ดำจนตัวลื่นดำเมี่ยม สามารถไต่กำแพงและล่องหนในความมืดเพื่อบุกเข้าห้องนอนของหญิงสาวในยามวิกาลโดยไม่มีใครจับตัวได้",
    story_en: "A man coated head-to-toe in glistening black supernatural grease through a pact with dark spirits. Capable of scaling sheer walls and slipping away from any grasp, he prowls villages by night.",
    folklore_history_th: "ตามความเชื่อระบุว่าวิธีเดียวที่จะจับตัวโอรังมินยักได้คือการใช้ผ้าโสร่งหรือผ้าปาเต๊ะที่ชุ่มเหงื่อคลุมร่างเพื่อสะกดอาคมน้ำมันให้เสื่อมลง",
    folklore_history_en: "Malay folklore holds that the Orang Minyak's slippery dark magic can only be neutralized by throwing a sweat-soaked batik sarong over his body.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["en:Orang_Minyak", "en:Ipoh", "en:Perak"],
    commonsSearch: "Perak cave temple limestone Malaysia",
    ytQueries: ["Orang Minyak legend Malaysia", "Sumpah Orang Minyak folklore", "ตำนานโอรังมินยัก"]
  },
  {
    id: "pin-barong",
    title_th: "บารองและรังดา (ศึกนิรันดร์แห่งวิญญาณเกาะบาหลี)",
    title_en: "Barong & Rangda, The Eternal Spirit Duel of Bali",
    category: "sacred",
    province_th: "บาหลี (อินโดนีเซีย)",
    province_en: "Bali (Indonesia)",
    district_th: "อูบุด - เกียนยาร์",
    district_en: "Ubud, Gianyar Regency",
    lat: -8.5069,
    lng: 115.2625,
    story_th: "การปะทะกันอย่างไม่มีวันสิ้นสุดระหว่าง 'บารอง' พญาราชสีห์ศักดิ์สิทธิ์เจ้าแห่งวิญญาณฝ่ายดี กับ 'รังดา' ราชินีแม่มดผีดิบผู้มีลิ้นยาวจรดพื้นและนำกองทัพภูตผีเลอักมาทำลายล้างมนุษย์",
    story_en: "The cosmic Balinese struggle between Barong, the lion-like King of Benevolent Spirits, and Rangda, the terrifying demon queen of the Leyak witches who feasts on corpses and casts black plagues.",
    folklore_history_th: "ในพิธีกรรมเต้นรำศักดิ์สิทธิ์ ผู้เข้าร่วมที่ตกอยู่ในภวังค์จะใช้กริชแทงหน้าอกตนเองโดยไม่เข้าด้วยอำนาจคุ้มครองของบารอง เป็นสัญลักษณ์ของสมดุลระหว่างความดีและความมืด",
    folklore_history_en: "During sacred trance rituals in Balinese temple courtyards, possessed dancers press sharp kris daggers against their own chests, protected from injury by Barong's divine aura.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["en:Barong_(mythology)", "en:Rangda"],
    commonsSearch: "Barong Rangda Bali dance",
    ytQueries: ["Barong and Rangda mythology Bali", "Barong dance trance Bali documentary", "ตำนานบารอง รังดา บาหลี"]
  },
  {
    id: "pin-tikbalang",
    title_th: "ติกบาลัง (ปีศาจครึ่งคนครึ่งม้าแห่งพงไพรตากาล็อก)",
    title_en: "Tikbalang, The Were-Stallion of the Sierra Madre",
    category: "monster",
    province_th: "เกาะลูซอน (ฟิลิปปินส์)",
    province_en: "Luzon (Philippines)",
    district_th: "เทือกเขาเซียร์รามาเดร",
    district_en: "Sierra Madre Mountain Range",
    lat: 16.4023,
    lng: 121.8055,
    story_th: "อมนุษย์ร่างสูงโย่งที่มีศีรษะและกีบเท้าเป็นม้าป่า ซ่อนตัวอยู่บนยอดไม้ไผ่และต้นไทรในป่าทึบ ชอบใช้มนต์สะกดให้นักเดินทางหลงวนอยู่ที่เดิมไม่รู้จบเว้นแต่จะถอดเสื้อใส่กลับด้าน",
    story_en: "A towering humanoid creature with the bony head and hooves of a wild stallion, lurking in bamboo groves and balete trees. It casts illusions that trap travelers in endless forest loops unless they wear their shirts inside-out.",
    folklore_history_th: "ชาวฟิลิปปินส์เชื่อว่าบนแผงคอของติกบาลังมีขนสีทอง 3 เส้น หากใครกระโดดขึ้นขี่และดึงขนทองมาได้ มันจะยอมตกเป็นทาสรับใช้ผู้ซื่อสัตย์ไปตลอดชีวิต",
    folklore_history_en: "Tagalog lore claims that three golden spines grow within the Tikbalang's mane; anyone brave enough to pluck one while taming its bucking leap gains the creature as a lifelong servant.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["en:Tikbalang", "en:Philippine_mythical_creatures"],
    commonsSearch: "Sierra Madre Luzon forest Philippines",
    ytQueries: ["Tikbalang Philippine mythology", "What is a Tikbalang folklore", "ตำนานผีฟิลิปปินส์ Tikbalang"]
  },
  {
    id: "pin-rokurokubi",
    title_th: "โรคุโรคุบิ (ปีศาจสาวคอยาวแห่งยุคเอโดะ)",
    title_en: "Rokurokubi, The Long-Necked Yokai of Kyoto",
    category: "ghost",
    province_th: "เกียวโต (ญี่ปุ่น)",
    province_en: "Kyoto (Japan)",
    district_th: "กิอง - ฮิกาชิยามะ",
    district_en: "Gion, Higashiyama Ward",
    lat: 35.0037,
    lng: 135.7785,
    story_th: "โยไคที่ดูเหมือนหญิงสาวธรรมดาในยามกลางวัน แต่เมื่อหลับสนิทในยามดึก ลำคอของเธอจะยืดยาวออกราวกับงูเลื้อยไปทั่วห้องเพื่อแอบเลียน้ำมันตะเกียงและหลอกหลอนผู้คนที่แอบมอง",
    story_en: "By day an ordinary-looking woman, by night her neck stretches to serpentine lengths while her body sleeps, slithering through paper shoji screens to lick lamp oil and terrify eavesdroppers.",
    folklore_history_th: "ปรากฏในบันทึกเรื่องเล่าของลาฟคาดิโอ เฮิร์น และภาพพิมพ์แกะไม้ยุคเอโดะ โดยมักเกิดจากคำสาปหรือผลกรรมของผู้ที่ละเมิดศีลธรรม",
    folklore_history_en: "Immortalized by Edo-period ukiyo-e masters and Lafcadio Hearn's Kwaidan, Rokurokubi stories warned against karmic transgression and hidden domestic secrets.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Rokurokubi", "en:Nukekubi"],
    commonsSearch: "Rokurokubi yokai ukiyo-e",
    ytQueries: ["Rokurokubi Japanese yokai explained", "Rokurokubi folklore story", "ตำนานสาวคอยาว โรคุโรคุบิ"]
  },
  {
    id: "pin-yuki-onna",
    title_th: "ยูกิอนนะ (สตรีหิมะผู้พรากลมหายใจกลางพายุน้ำแข็ง)",
    title_en: "Yuki-onna, The Snow Woman of the Northern Alps",
    category: "ghost",
    province_th: "นีงาตะ (ญี่ปุ่น)",
    province_en: "Niigata Prefecture (Japan)",
    district_th: "ช่องเขาอุโอนุมะ",
    district_en: "Uonuma Snow Country",
    lat: 37.2319,
    lng: 138.9625,
    story_th: "วิญญาณหญิงสาวผิวขาวซีดราวหิมะในชุดกิโมโนสีขาวบริสุทธิ์ ลอยตัวเหนือผืนหิมะโดยไม่ทิ้งรอยเท้า จะปรากฏตัวในคืนพายุหิมะพัดกระหน่ำและเป่าลมหายใจเยือกแข็งใส่ผู้หลงทางจนกลายเป็นน้ำแข็ง",
    story_en: "An ethereal woman of unearthly pale beauty clad in a white kimono, gliding across deep snowdrifts without leaving footprints. Appearing during deadly blizzards, her icy breath freezes lost travelers solid.",
    folklore_history_th: "ตำนานโด่งดังเล่าถึงชายตัดฟืนหนุ่มที่เธอไว้ชีวิตแลกกับสัญญาว่าจะไม่แพร่งพรายเรื่องของเธอ ก่อนที่เขาจะพบว่าภรรยาที่แต่งงานด้วยแท้จริงคือยูกิอนนะจำแลงกายมา",
    folklore_history_en: "In classic Japanese folklore, she spares a young woodcutter on condition he never speaks of seeing her—only to later marry him in human guise until he accidentally breaks his vow.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["en:Yuki-onna"],
    commonsSearch: "Yuki-onna Japanese art",
    ytQueries: ["Yuki Onna Snow Woman folklore", "Yuki-onna Kwaidan story", "ตำนานสาวหิมะ ยูกิอนนะ"]
  },
  {
    id: "pin-tengu",
    title_th: "เทนงุแห่งหุบเขาคุรามะ (จ้าวแห่งสายลมและดาบปีศาจ)",
    title_en: "Sojobo & The Tengu of Mount Kurama",
    category: "monster",
    province_th: "เกียวโต (ญี่ปุ่น)",
    province_en: "Kyoto Prefecture (Japan)",
    district_th: "ภูเขาคุรามะ",
    district_en: "Mount Kurama, Sakyo Ward",
    lat: 35.1167,
    lng: 135.7708,
    story_th: "อสูรครึ่งเทพผู้มีใบหน้าสีแดงฉาน จมูกยาวเฟื้อย และมีปีกสีดำดั่งพญาอินทรี อาศัยอยู่ในป่าสนซีดาร์ศักดิ์สิทธิ์บนเขาคุรามะ เชี่ยวชาญวิชาดาบและการเหาะเหินเดินอากาศ",
    story_en: "The fierce crimson-faced, long-nosed winged mountain spirit of Japan's sacred cedar forests. Ruling over Mount Kurama, the Great Tengu Sojobo commands whirlwinds, illusions, and supreme swordsmanship.",
    folklore_history_th: "ตามประวัติศาสตร์และตำนาน โซโจโบ ราชาแห่งเทนงุบนเขาคุรามะ คือผู้ถ่ายทอดวิชาดาบและกลยุทธ์การรบให้แก่ มินาโมโตะ โนะ โยชิสึเนะ ยอดขุนพลซามูไรในวัยเยาว์",
    folklore_history_en: "Japanese legend recounts that the Tengu king Sojobo secretly trained the young samurai prodigy Minamoto no Yoshitsune in supernatural swordplay beneath Mount Kurama's ancient cedars.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["en:Tengu", "en:Mount_Kurama"],
    commonsSearch: "Kurama Tengu mask Kyoto",
    ytQueries: ["Tengu Japanese mythology documentary", "Mount Kurama Tengu legend", "ตำนานเทนงุ ญี่ปุ่น"]
  },
  {
    id: "pin-dokkaebi",
    title_th: "ท็อกแกบี (ภูตกระบองวิเศษแห่งคาบสมุทรเกาหลี)",
    title_en: "Dokkaebi, The Goblin of the Enchanted Bangmangi",
    category: "legend",
    province_th: "ช็อลลาใต้ (เกาหลีใต้)",
    province_en: "South Jeolla (South Korea)",
    district_th: "เทือกเขาจีรีซาน",
    district_en: "Jirisan Mountain Range",
    lat: 35.3369,
    lng: 127.7306,
    story_th: "ภูตพื้นบ้านเกาหลีที่เกิดจากสิ่งของเครื่องใช้เก่าแก่ที่เปื้อนเลือดมนุษย์ มีพละกำลังมหาศาล ชอบท้าคนเดินทางเล่นมวยปล้ำซีรึมในยามค่ำคืน และถือกระบองวิเศษ 'บังมังงี' ที่เสกทองคำได้",
    story_en: "Mischievous Korean nature spirits born from discarded household tools stained with human spirit. Wielding the magical 'dokkaebi bangmangi' club that conjures gold out of thin air, they challenge night travelers to ssireum wrestling.",
    folklore_history_th: "ต่างจากปีศาจตะวันตก ท็อกแกบีรักความยุติธรรม จะให้รางวัลแก่คนซื่อสัตย์ด้วยสมบัติมหาศาล และลงโทษคนโลภมากหรือคนโกงด้วยกลลวงอันแสบสัน",
    folklore_history_en: "Unlike demonic fiends, Dokkaebi reward honest villagers with overflowing wealth while mercilessly pranking greedy or deceitful landlords.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Dokkaebi"],
    commonsSearch: "Dokkaebi Korean roof tile",
    ytQueries: ["Dokkaebi Korean goblin mythology", "Legend of the Dokkaebi Korea", "ตำนานท็อกแกบี เกาหลี"]
  },
  {
    id: "pin-vetala",
    title_th: "เวตาล (ผีดิบห้อยหัวผู้ตั้งปริศนาแห่งสุสานอุชเชนี)",
    title_en: "Vetala, The Riddle-Speaking Corpse Spirit of Ujjain",
    category: "ghost",
    province_th: "มัธยประเทศ (อินเดีย)",
    province_en: "Madhya Pradesh (India)",
    district_th: "นครโบราณอุชเชนี",
    district_en: "Ujjain, Shipra River Cremation Grounds",
    lat: 23.1765,
    lng: 75.7885,
    story_th: "อมนุษย์ผู้เข้าสิงซากศพและห้อยหัวลงมาจากต้นอโศกในป่าช้า พระเจ้าวิกรมาทิตย์ต้องแบกเวตาลกลับไปให้โยคีโดยห้ามปริปากพูด แต่เวตาลกลับเล่านิทานซ้อนปริศนา 25 เรื่องเพื่อล่อให้พระองค์ตรัสตอบ",
    story_en: "A psychic corpse-possessing spirit hanging upside down from an ashoka tree in the charnel grounds of Ujjain. Tasked with carrying it in silence, King Vikramaditya is tested by the Vetala's 25 moral riddles.",
    folklore_history_th: "บันทึกไว้ในวรรณคดีสันสกฤต 'เวตาลปัญจวิงศติ' ซึ่งรัชกาลที่ 6 และกรมหมื่นพิทยาลงกรณ์ทรงแปลเป็นนิทานเวตาลอันโด่งดังในวรรณคดีไทย",
    folklore_history_en: "Recorded in the ancient Sanskrit anthology Vetala Panchavimshati (Baital Pachisi), where the cunning spirit ultimately saves King Vikramaditya from a treacherous sorcerer's blood sacrifice.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Vetala", "en:Baital_Pachisi"],
    commonsSearch: "Vikram and Betaal India art",
    ytQueries: ["Vetala Panchavimshati Vikram Betaal story", "ตำนานนิทานเวตาล", "Vetala Hindu mythology explained"]
  },
  {
    id: "pin-rakshasa",
    title_th: "รากษสแห่งกรุงลงกา (อสูรจำแลงกายในมหากาพย์โบราณ)",
    title_en: "The Rakshasa Citadels of Ancient Lanka",
    category: "monster",
    province_th: "มาตาเล (ศรีลังกา)",
    province_en: "Central Province (Sri Lanka)",
    district_th: "ป้อมศิลาสิกิริยา",
    district_en: "Sigiriya Rock Fortress",
    lat: 7.9570,
    lng: 80.7603,
    story_th: "เผ่าพันธุ์อสูรผู้ทรงอิทธิฤทธิ์ในมหากาพย์รามายณะ มีเขี้ยวงอกยาว ดวงตาลุกเป็นไฟ เชี่ยวชาญมนต์มายาจำแลงกายและเหาะเหินในยามราตรีซึ่งเป็นช่วงเวลาที่พลังของรากษสแข็งแกร่งที่สุด",
    story_en: "Formidable shape-shifting titans of Hindu and Buddhist cosmology. Fiercest under the cover of darkness, Rakshasas command illusion magic, flight, and titanic strength atop ancient island fortresses.",
    folklore_history_th: "ชาวศรีลังกาเชื่อมโยงยอดเขาสิกิริยาและปราการหินโบราณว่าเป็นหนึ่งในราชธานีบนยอดเขาของท้าวเวสสุวรรณและทศกัณฐ์แห่งเผ่าพันธุ์รากษสในอดีตกาล",
    folklore_history_en: "Local Sri Lankan traditions link the sky-palace of Sigiriya to the mythical mountain strongholds of King Ravana and Kubera in the Ramayana epic.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["en:Rakshasa", "en:Sigiriya"],
    commonsSearch: "Rakshasa mask Sri Lanka",
    ytQueries: ["Rakshasa Hindu mythology documentary", "Ravana Sigiriya Lanka legend", "ตำนานรากษส ยักษ์กรุงลงกา"]
  },
  {
    id: "pin-golem",
    title_th: "โกเลมแห่งปราก (ยักษ์ดินเหนียวผู้พิทักษ์สุสานยิวโบราณ)",
    title_en: "The Golem of Prague (Old New Synagogue)",
    category: "legend",
    province_th: "กรุงปราก (สาธารณรัฐเช็ก)",
    province_en: "Prague (Czech Republic)",
    district_th: "ย่านชาวยิวโยเซฟอฟ",
    district_en: "Josefov Jewish Quarter",
    lat: 50.0901,
    lng: 14.4187,
    story_th: "หุ่นยักษ์ปั้นจากดินเหนียวริมแม่น้ำวัลตาวาที่ปลุกชีพขึ้นด้วยอักษรศักดิ์สิทธิ์ฮีบรูคำว่า 'EMET' (ความจริง) บนหน้าผาก เพื่อออกเดินตรวจตรายามค่ำคืนปกป้องชุมชนชาวยิวจากการถูกสังหารหมู่",
    story_en: "Sculpted from Vltava River clay in the 16th century by Rabbi Judah Loew, the Golem came alive when 'EMET' (Truth) was inscribed on its forehead, patrolling Prague's cobblestone alleys by night.",
    folklore_history_th: "เมื่อโกเลมเริ่มคุ้มคลั่งควบคุมไม่ได้ แรบไบจึงลบอักษรตัวแรกออกเหลือคำว่า 'MET' (ความตาย) และนำร่างดินเหนียวไปซ่อนปิดตายไว้บนห้องใต้หลังคาของธรรมศาลาเก่าแก่",
    folklore_history_en: "When the giant grew dangerously violent, the Rabbi erased the first letter to spell 'MET' (Death), sealing its dormant clay body inside the attic genizah of the Old New Synagogue.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Golem", "en:Old_New_Synagogue"],
    commonsSearch: "Golem of Prague statue",
    ytQueries: ["The Golem of Prague legend documentary", "Rabbi Loew Golem story", "ตำนานโกเลมแห่งปราก"]
  },
  {
    id: "pin-piedpiper",
    title_th: "นักเป่าปี่แห่งฮาเมิลน์ (การหายสาบสูญของเด็ก 130 คน)",
    title_en: "The Pied Piper of Hamelin's Vanished Children",
    category: "legend",
    province_th: "นีเดอร์ซัคเซิน (เยอรมนี)",
    province_en: "Lower Saxony (Germany)",
    district_th: "เมืองเก่าฮาเมิลน์",
    district_en: "Hamelin (Hameln) Old Town",
    lat: 52.1030,
    lng: 9.3562,
    story_th: "ชายลึกลับในชุดหลากสีผู้รับจ้างเป่าปี่สะกดจิตฝูงหนูไปจมน้ำตายในแม่น้ำเวเซอร์ แต่เมื่อเจ้าเมืองเบี้ยวค่าจ้าง เขากลับมาในวันที่ 26 มิถุนายน ค.ศ. 1284 และเป่าปี่พาเด็กทั้งเมือง 130 คนเดินหายเข้าไปในภูเขา",
    story_en: "Betrayed by town elders who refused to pay him for luring away a plague of rats, the mysterious piper returned on June 26, 1284, playing a haunting melody that led 130 children into Koppen Hill, never to be seen again.",
    folklore_history_th: "มีบันทึกในหน้าต่างกระจกสีของโบสถ์และพงศาวดารเมืองฮาเมิลน์ว่าเป็นเหตุการณ์จริงที่เด็กหายไปพร้อมกัน และบนถนนสายที่เด็กเดินผ่านยังคงมีกฎห้ามเล่นดนตรีมาจนถึงปัจจุบัน",
    folklore_history_en: "Town chronicles from 1384 solemnly begin 'It is 100 years since our children left,' and Bungelosenstraße ('Street Without Drums') still forbids music or dancing to this day.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Pied_Piper_of_Hamelin"],
    commonsSearch: "Pied Piper of Hamelin stained glass",
    ytQueries: ["Pied Piper of Hamelin true history documentary", "Mystery of Hamelin 1284", "ตำนานนักเป่าปี่แห่งฮาเมิลน์"]
  },
  {
    id: "pin-krampus",
    title_th: "แครมปัส (อสูรเขายาวผู้ลงทัณฑ์แห่งเทือกเขาแอลป์)",
    title_en: "Krampus, The Horned Shadow of the Eastern Alps",
    category: "monster",
    province_th: "ซัลทซ์บวร์ค (ออสเตรีย)",
    province_en: "Salzburg (Austria)",
    district_th: "หุบเขาปัฟเฟนวอร์เฟน",
    district_en: "Pongau Alpine Valley",
    lat: 47.4167,
    lng: 13.2167,
    story_th: "อสูรครึ่งแพะครึ่งปีศาจที่มีเขายาวโค้งงอ ขนดกดำ ลิ้นยาวสีแดง และลากโซ่ตรวนส่งเสียงกึกก้องในคืนวันที่ 5 ธันวาคม (Krampusnacht) เพื่อฟาดด้วยกิ่งไม้เบิร์ชและจับเด็กดื้อใส่ตะกร้าสะพายหลังลงสู่นรก",
    story_en: "A cloven-hoofed, horned anthropomorphic beast draped in rattling iron chains and cowbells. On Krampusnacht (December 5), he stalks snowbound Alpine villages to birch-whip wicked children and haul them into the underworld.",
    folklore_history_th: "มีรากฐานจากความเชื่อเพแกนยุคก่อนคริสตกาลในแถบเทือกเขาแอลป์ ก่อนจะถูกผสานเข้ากับเทศกาลนักบุญนิโคลัสในฐานะเงามืดผู้ลงทัณฑ์เคียงคู่ซานตาคลอส",
    folklore_history_en: "Rooted in pre-Christian Alpine winter solstice rituals, Krampus survived centuries of Church bans as the dark twin companion to Saint Nicholas.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["en:Krampus"],
    commonsSearch: "Krampus Austria Salzburg",
    ytQueries: ["Krampus mythology origin documentary", "Krampusnacht Austria folklore", "ตำนานแครมปัส ปีศาจคริสต์มาส"]
  },
  {
    id: "pin-vodyanoy",
    title_th: "โวเดียอย (จ้าวแห่งวังน้ำวนและวิญญาณจมน้ำสลาฟ)",
    title_en: "Vodyanoy, Slavic Master of the Dark Millponds",
    category: "monster",
    province_th: "เวลิกี นอฟโกรอด (รัสเซีย)",
    province_en: "Novgorod Oblast (Russia)",
    district_th: "ทะเลสาบอิลเมนและแม่น้ำโวลคอฟ",
    district_en: "Lake Ilmen & Volkhov River",
    lat: 58.5256,
    lng: 31.2742,
    story_th: "ปีศาจน้ำโบราณของชาวสลาฟ รูปร่างเหมือนชายชราพุงพลุ้ยที่มีเกล็ดปลาคลุมตัว หนวดเคราสีเขียวเหมือนสาหร่าย อาศัยอยู่ใต้วังน้ำวนใกล้กังหันน้ำและคอยฉุดดึงคนที่ลงเล่นน้ำหลังพระอาทิตย์ตกดินไปเป็นทาสใต้น้ำ",
    story_en: "A bloated, frog-faced old spirit covered in slimy fish scales and tangled green river-weed beard. Dwelling beneath deep millpond whirlpools, he drags midnight swimmers down to his underwater crystal palace.",
    folklore_history_th: "เจ้าของโรงสีและชาวประมงในยุโรปตะวันออกสมัยโบราณต้องเซ่นไหว้โวเดียอยด้วยขนมปัง เกลือ หรือน้ำผึ้ง เพื่อไม่ให้มันพังเขื่อนหรือฉีกอวนจับปลา",
    folklore_history_en: "Slavic millers and fishermen historically poured offerings of honey, butter, and tobacco into the water to appease the Vodyanoy and prevent him from smashing mill-wheels.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Vodyanoy"],
    commonsSearch: "Vodyanoy Slavic mythology painting",
    ytQueries: ["Vodyanoy Slavic mythology explained", "Slavic water spirit Vodyanoy", "ตำนานปีศาจสลาฟ Vodyanoy"]
  },
  {
    id: "pin-leshy",
    title_th: "เลชี (เจ้าป่าจำแลงกายผู้ล่อหลงนักเดินทางในไทกา)",
    title_en: "Leshy, Lord of the Primeval Białowieża Forest",
    category: "monster",
    province_th: "แบรสต์ (เบลารุส / โปแลนด์)",
    province_en: "Brest Region (Belarus / Poland Border)",
    district_th: "ป่าดึกดำบรรพ์เบียวอเวียชา",
    district_en: "Białowieża Primeval Forest",
    lat: 52.7000,
    lng: 23.8667,
    story_th: "วิญญาณผู้พิทักษ์ป่าดึกดำบรรพ์ของชาวสลาฟที่มีผิวเหมือนเปลือกไม้ เลือดสีเขียว และสามารถย่อขยายร่างให้สูงเท่าต้นสนหรือเล็กเท่าใบหญ้า ชอบเลียนเสียงคนรู้จักเพื่อหลอกล่อคนตัดไม้ให้หลงทางลึกเข้าไปในป่า",
    story_en: "The ancient tutelary deity of Slavic forests with bark-textured skin, glowing green eyes, and no shadow. Capable of growing taller than ancient pines or shrinking to a blade of grass, he mimics familiar voices to lead woodsmen astray.",
    folklore_history_th: "ผู้ที่หลงกลเลชีต้องถอดรองเท้าใส่สลับข้างและกลับเสื้อด้านในออกด้านนอกเพื่อทำลายมนต์สะกดของเจ้าป่าคล้ายคลึงกับความเชื่อในเอเชียตะวันออกเฉียงใต้",
    folklore_history_en: "To break the Leshy's disorienting enchantment, lost travelers must turn their clothes inside-out and wear their boots on opposite feet.",
    sound_preset: "jungle_curse",
    wikiCandidates: ["en:Leshy"],
    commonsSearch: "Leshy Slavic forest spirit",
    ytQueries: ["Leshy Slavic forest spirit mythology", "The Leshy folklore documentary", "ตำนานเลชี เจ้าป่าสลาฟ"]
  },
  {
    id: "pin-strigoi",
    title_th: "สตริกอย (ผีดิบสองหัวใจแห่งโรมาเนีย)",
    title_en: "Strigoi, The Twin-Hearted Undead of Wallachia",
    category: "ghost",
    province_th: "ดึมโบวิตซา (โรมาเนีย)",
    province_en: "Dâmbovița County (Romania)",
    district_th: "เมืองหลวงเก่าตึร์โกวิชเต",
    district_en: "Târgoviște, Wallachia",
    lat: 44.9254,
    lng: 25.4567,
    story_th: "ต้นกำเนิดความเชื่อแวมไพร์แท้จริงของโรมาเนีย เป็นวิญญาณผู้มีสองหัวใจและลุกขึ้นจากหลุมศพในยามค่ำคืน สามารถแปลงกายเป็นหมาป่าหรือนกฮูกเพื่อสูบพลังชีวิตของญาติพี่น้องและคนในหมู่บ้าน",
    story_en: "The authentic folkloric vampire of Romanian peasant belief. Born with a caul or two hearts, a Strigoi rises from the grave at midnight, shape-shifting into wolves or owls to drain the vitality of living kin.",
    folklore_history_th: "แม้แต่ในคริสต์ศตวรรษที่ 21 ก็ยังมีการขุดศพในชนบทโรมาเนียเพื่อทำพิธีตอกลิ่มและเผาหัวใจตามความเชื่อสตริกอยโบราณ เช่น คดีที่หมู่บ้านมารอตินู เดอ ซุส ในปี 2004",
    folklore_history_en: "Unlike literary aristocrats, Strigoi fear persisted into modern times—most famously in the 2004 Marotinu de Sus exhumation ritual performed by terrified villagers.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["en:Strigoi", "en:Târgoviște", "en:Chindia_Tower"],
    commonsSearch: "Targoviste Chindia Tower Romania night",
    ytQueries: ["Strigoi Romanian vampire folklore documentary", "Real vampires of Romania Strigoi", "ตำนานสตริกอย ผีดิบโรมาเนีย"]
  },
  {
    id: "pin-headlesshorseman",
    title_th: "ผีทหารม้าหัวขาดแห่งหุบเขาสลีปปี้ฮอลโลว์",
    title_en: "The Headless Horseman of Sleepy Hollow",
    category: "ghost",
    province_th: "นิวยอร์ก (สหรัฐอเมริกา)",
    province_en: "New York (USA)",
    district_th: "สลีปปี้ฮอลโลว์ หุบเขาฮัดสัน",
    district_en: "Sleepy Hollow, Hudson Valley",
    lat: 41.0918,
    lng: -73.8615,
    story_th: "วิญญาณทหารรับจ้างชาวเฮสเซียนที่ถูกลูกปืนใหญ่ยิงศีรษะขาดกระเด็นในศึกสงครามประกาศอิสรภาพอเมริกา ทุกค่ำคืนเขาจะควบม้าสีดำทะมึนออกตามหาศีรษะที่หายไปบริเวณสะพานไม้ใกล้สุสานโบสถ์ดัตช์เก่า",
    story_en: "The restless phantom of a Hessian artilleryman decapitated by a stray cannonball during the American Revolutionary War. Each night he gallops on a spectral black steed toward the Old Dutch Church bridge seeking his severed head.",
    folklore_history_th: "วอชิงตัน เออร์วิง นำเรื่องเล่าพื้นบ้านของชาวดัตช์ในหุบเขาฮัดสันมาประพันธ์เป็นวรรณกรรมอมตะในปี 1820 ทำให้สุสานสลีปปี้ฮอลโลว์กลายเป็นหนึ่งในสถานที่สยองขวัญที่สุดของอเมริกา",
    folklore_history_en: "Immortalized by Washington Irving in 1820 from local Dutch Hudson Valley ghost lore, the Old Dutch Churchyard remains a pilgrimage site for folklore enthusiasts.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["en:Sleepy_Hollow,_New_York", "en:The_Legend_of_Sleepy_Hollow"],
    commonsSearch: "Headless Horseman John Quidor painting",
    ytQueries: ["Legend of Sleepy Hollow documentary history", "Headless Horseman true origins", "ตำนานผีหัวขาด สลีปปี้ฮอลโลว์"]
  },
  {
    id: "pin-winchester",
    title_th: "คฤหาสน์วินเชสเตอร์ (เขาวงกตพันห้องลวงวิญญาณอาฆาต)",
    title_en: "The Winchester Mystery House of San Jose",
    category: "ghost",
    province_th: "แคลิฟอร์เนีย (สหรัฐอเมริกา)",
    province_en: "California (USA)",
    district_th: "ซานโฮเซ",
    district_en: "San Jose, Santa Clara Valley",
    lat: 37.3184,
    lng: -121.9511,
    story_th: "คฤหาสน์ที่ถูกต่อเติมตลอด 24 ชั่วโมงไม่หยุดพักนานถึง 38 ปี โดย ซาราห์ วินเชสเตอร์ ทายาทบริษัทปืนไรเฟิลผู้เชื่อว่าต้องสร้างห้องวงกต บันไดสู่เพดานตัน และประตูเปิดสู่ความว่างเปล่าเพื่อหลอกวิญญาณผู้ถูกปืนวินเชสเตอร์สังหาร",
    story_en: "Built continuously for 38 years without a master blueprint by rifle heiress Sarah Winchester. Featuring staircases leading into ceilings and doors opening onto sheer drops, its 160 rooms were designed to confuse vengeful spirits killed by Winchester rifles.",
    folklore_history_th: "เสียงฆ้อนและเลื่อยไม่เคยหยุดลงตั้งแต่วันที่เริ่มสร้างในปี 1884 จนกระทั่งวันทีซาราห์เสียชีวิตในปี 1922 ทิ้งปริศนาหมายเลข 13 ที่ซ่อนอยู่ทั่วทั้งคฤหาสน์",
    folklore_history_en: "Construction hammers echoed day and night from 1884 until Sarah Winchester's death in 1922, leaving behind recurring occult motifs of the number 13 throughout the mansion.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Winchester_Mystery_House"],
    commonsSearch: "Winchester Mystery House San Jose",
    ytQueries: ["Winchester Mystery House documentary", "Story of Sarah Winchester haunted house", "ตำนานคฤหาสน์วินเชสเตอร์"]
  },
  {
    id: "pin-alcatraz",
    title_th: "เกาะอัลคาแทรซ (คุกกลางน้ำและเสียงแบนโจจากห้องขัง 14D)",
    title_en: "Alcatraz Island & The Ghosts of Cellblock D",
    category: "ghost",
    province_th: "แคลิฟอร์เนีย (สหรัฐอเมริกา)",
    province_en: "California (USA)",
    district_th: "อ่าวซานฟรานซิสโก",
    district_en: "San Francisco Bay",
    lat: 37.8270,
    lng: -122.4230,
    story_th: "ทัณฑสถานความมั่นคงสูงสุดกลางกระแสน้ำเชี่ยวกรากที่จองจำอาชญากรที่อันตรายที่สุดของอเมริกา ห้องขังมืดหมายเลข 14D มีเรื่องเล่าถึงอสูรตาสีแดงในความมืดที่บีบคอนักโทษเสียชีวิตในคืนเดียว",
    story_en: "The inescapable island penitentiary surrounded by freezing bay currents. Inside solitary confinement Cell 14D, an inmate screamed all night of a glowing-eyed entity in the pitch dark—and was found strangled at dawn.",
    folklore_history_th: "ผู้คุมและนักท่องเที่ยวมักได้ยินเสียงดีดแบนโจอันโหยหวนของ อัล คาโปน ดังมาจากห้องอาบน้ำที่เขาเคยแอบซ้อมดนตรีเพื่อหนีจากการถูกลอบสังหาร",
    folklore_history_en: "Park rangers and visitors still report phantom banjo notes echoing from the shower room where anailing Al Capone once practiced in isolation.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Alcatraz_Island"],
    commonsSearch: "Alcatraz Island cellhouse",
    ytQueries: ["Haunted Alcatraz documentary Cell 14D", "Ghosts of Alcatraz history", "ตำนานผีคุกอัลคาแทรซ"]
  },
  {
    id: "pin-bellwitch",
    title_th: "แม่มดเบลล์แห่งเทนเนสซี (วิญญาณอาฆาตผู้สังหารเจ้าบ้าน)",
    title_en: "The Bell Witch Haunting of Red River",
    category: "ghost",
    province_th: "เทนเนสซี (สหรัฐอเมริกา)",
    province_en: "Tennessee (USA)",
    district_th: "เมืองอดัมส์ โรเบิร์ตสันเคาน์ตี",
    district_en: "Adams, Robertson County",
    lat: 36.5823,
    lng: -87.0653,
    story_th: "คดีโพลเตอร์ไกสต์ที่โด่งดังที่สุดในประวัติศาสตร์อเมริกา เมื่อวิญญาณล่องหนที่เรียกตัวเองว่า 'เคท' บุกคุกคามครอบครัวจอห์น เบลล์ ระหว่างปี 1817–1821 ทั้งตบตี ดึงผ้าห่ม พูดคุยโต้ตอบ และวางยาพิษสังหารจอห์น เบลล์",
    story_en: "America's most documented poltergeist case (1817–1821), in which an unseen vocal entity named 'Kate' tormented pioneer farmer John Bell's family, conversing with guests including future President Andrew Jackson before poisoning Bell to death.",
    folklore_history_th: "แม้แต่พลเอก แอนดรูว์ แจ็กสัน (ต่อมาคือประธานาธิบดีสหรัฐฯ) ที่เดินทางมาพิสูจน์ยังถูกรั้งล้อรถม้าไว้กลางอากาศจนประกาศว่า 'ยอมสู้กับกองทัพดีกว่าสู้กับแม่มดเบลล์'",
    folklore_history_en: "It remains the only case in official American folklore where a supernatural entity was credited as the direct cause of a human being's death.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["en:Bell_Witch", "en:Bell_Witch_Cave"],
    commonsSearch: "Bell Witch Cave Adams Tennessee",
    ytQueries: ["Bell Witch haunting documentary", "True story of the Bell Witch Tennessee", "ตำนานแม่มดเบลล์"]
  },
  {
    id: "pin-el-silbon",
    title_th: "เอลซิลบอน (ผีคนผิวปากแบกกระดูกแห่งทุ่งหญ้าลานอส)",
    title_en: "El Silbón, The Whistling Bone-Carrier of Los Llanos",
    category: "ghost",
    province_th: "ปอร์ตูเกซา (เวเนซุเอลา)",
    province_en: "Portuguesa (Venezuela)",
    district_th: "ทุ่งหญ้าลอสยาร์นอส",
    district_en: "Guanarito, Los Llanos Plains",
    lat: 8.7000,
    lng: -69.2000,
    story_th: "วิญญาณชายร่างผอมสูงโย่งที่แบกกระสอบบรรจุกระดูกของบิดาที่ตนสังหารไว้บนหลัง เดินท่องไปในทุ่งหญ้าพร้อมผิวปากไล่โน้ตดนตรี 7 ตัว (โด-เร-มี-ฟา-ซอล-ลา-ที) อย่างเยือกเย็น",
    story_en: "The gaunt, six-meter-tall specter of a parricide cursed to wander the Venezuelan plains forever carrying a sack of his father's bones while whistling the musical scale from C to B.",
    folklore_history_th: "กฎเหล็กของเสียงผิวปากเอลซิลบอนคือ: หากได้ยินเสียงผิวปากดังอยู่ใกล้ๆ แปลว่ามันอยู่ไกล แต่หากเสียงผิวปากแผ่วเบาเหมือนอยู่ไกลโพ้น แปลว่ามันยืนอยู่ข้างหลังคุณแล้ว",
    folklore_history_en: "Llanero cowboys warn of its deadly acoustic illusion: when El Silbón's whistle sounds loud and close, you are safe; when the whistle sounds faint and distant, he is standing right behind you.",
    sound_preset: "whisper",
    wikiCandidates: ["en:El_Silbón", "en:Llanos"],
    commonsSearch: "Los Llanos Venezuela sunset",
    ytQueries: ["El Silbon The Whistling Man legend", "El Silbon Venezuelan folklore", "ตำนานผีผิวปาก El Silbon"]
  },
  {
    id: "pin-mapinguari",
    title_th: "มาปิงกัวรี (อสูรตาเดียวปากอยู่กลางท้องแห่งป่าแอมะซอน)",
    title_en: "Mapinguari, The Cyclops Sloth-Beast of Amazonia",
    category: "monster",
    province_th: "อาเกร (บราซิล)",
    province_en: "Acre (Brazil)",
    district_th: "ลุ่มน้ำแอมะซอนตะวันตก",
    district_en: "Rio Branco Rainforest Basin",
    lat: -9.9747,
    lng: -67.8100,
    story_th: "อสูรกายขนดกสีแดงเข้มผู้พิทักษ์ป่าดิบชื้นแอมะซอน มีดวงตาเพียงดวงเดียวกลางหน้าผาก กรงเล็บโค้งยาว เกล็ดแข็งกันกระสุน และมีปากที่สองขนาดมหึมาอ้ากว้างอยู่กลางหน้าท้องพร้อมกลิ่นเหม็นเน่ารุนแรง",
    story_en: "A towering, foul-smelling rainforest guardian covered in matted red fur over bulletproof osteoderm armor, possessing a single cyclopean eye and a secondfang-filled mouth gaping vertically across its abdomen.",
    folklore_history_th: "นักสัตว์ประหลาดวิทยาและนักบรรพชีวินวิทยาตั้งข้อสังเกตว่าตำนานมาปิงกัวรีของชนเผ่าพื้นเมืองอาจเป็นความทรงจำสืบทอดเกี่ยวกับ 'สลอธยักษ์ยุคดึกดำบรรพ์' (Megatherium) ที่เคยอาศัยอยู่ในแอมะซอน",
    folklore_history_en: "Ornithologists and cryptozoologists suggest indigenous accounts of the Mapinguari may preserve cultural memory of extinct Pleistocene giant ground sloths (Megatherium).",
    sound_preset: "jungle_curse",
    wikiCandidates: ["en:Mapinguari", "en:Megatherium"],
    commonsSearch: "Megatherium giant ground sloth illustration",
    ytQueries: ["Mapinguari Amazon monster documentary", "Giant ground sloth Mapinguari cryptid", "ตำนานมาปิงกัวรี แอมะซอน"]
  },
  {
    id: "pin-encantado",
    title_th: "โบโต เอ็นกันตาโด (โลมาสีชมพูจำแลงกายแห่งลุ่มน้ำแอมะซอน)",
    title_en: "Boto Encantado, The Shape-Shifting Pink River Dolphin",
    category: "legend",
    province_th: "อามาโซนัส (บราซิล)",
    province_en: "Amazonas (Brazil)",
    district_th: "มาเนาส์ - จุดบรรจบแม่น้ำริโอเนโกร",
    district_en: "Manaus, Meeting of Waters",
    lat: -3.1366,
    lng: -59.9036,
    story_th: "โลมาแม่น้ำแอมะซอนสีชมพูที่เมื่อพระอาทิตย์ตกดินจะแปลงร่างเป็นชายหนุ่มรูปงามสวมชุดสีขาวและสวมหมวกปีกกว้างเพื่อปกปิดรูหายใจบนศีรษะ ออกมาเต้นรำเกี้ยวพาราสีหญิงสาวในงานเทศกาลริมแม่น้ำ",
    story_en: "Under the full moon over the Amazon River, the pink river dolphin transforms into a dashing young man dressed in white linen, wearing a straw hat low over his forehead to conceal his blowhole as he charms village maidens.",
    folklore_history_th: "ก่อนรุ่งสาง เอ็นกันตาโดจะกระโจนกลับลงสู่สายน้ำแอมะซอนและคืนร่างเป็นโลมาสีชมพู ทิ้งเรื่องเล่าขานและคำเตือนไม่ให้เดินริมน้ำเพียงลำพังในคืนเดือนเพ็ญ",
    folklore_history_en: "Before sunrise, the Encantado dives back into the dark river currents, making it taboo among traditional ribeirinho river folk to harm or hunt pink dolphins.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Amazon_river_dolphin", "en:Encantado"],
    commonsSearch: "Inia geoffrensis pink river dolphin Amazon",
    ytQueries: ["Encantado Amazon dolphin legend", "Boto Cor de Rosa Brazilian folklore", "ตำนานโลมาสีชมพู แอมะซอน"]
  },
  {
    id: "pin-adlet",
    title_th: "อัดเล็ต (อมนุษย์ครึ่งคนครึ่งหมาป่าหิมะแห่งอาร์กติก)",
    title_en: "The Adlet, Wolf-Human Hybrids of Baffin Island",
    category: "monster",
    province_th: "นูนาวุต (แคนาดา)",
    province_en: "Nunavut (Canada)",
    district_th: "เกาะแบฟฟิน - อ่าวคัมเบอร์แลนด์",
    district_en: "Baffin Island, Arctic Archipelago",
    lat: 66.1500,
    lng: -65.7000,
    story_th: "เผ่าพันธุ์อมนุษย์ในตำนานชาวอินูอิตที่ท่อนบนเป็นมนุษย์และท่อนล่างเป็นสุนัขหมาป่าหิมะขนดก วิ่งไล่ล่าเหยื่อบนทุ่งน้ำแข็งด้วยความเร็วเหนือมนุษย์และกระหายเลือดสด",
    story_en: "Ferocious creatures of Inuit mythology possessing the upper torso of a human hunter and the powerful hind legs of a giant Arctic wolf, sprinting across sea ice with terrifying speed.",
    folklore_history_th: "ตามตำนานอินูอิต อัดเล็ตถือกำเนิดจากหญิงชาวเอสกิโมผู้แต่งงานกับสุนัขสีแดงขนาดยักษ์ และทายาทห้าตัวถูกส่งข้ามทะเลน้ำแข็งไปก่อกำเนิดเผ่าพันธุ์นักล่าแห่งขั้วโลก",
    folklore_history_en: "Recorded by anthropologist Franz Boas among Baffin Island Inuit in 1888, the Adlet clash relentlessly with human hunters across the polar tundra.",
    sound_preset: "creepy_wind",
    wikiCandidates: ["en:Arctic_wolf", "en:Inuit_religion"],
    commonsSearch: "Arctic wolf snow Canada",
    ytQueries: ["Adlet Inuit mythology werewolf", "Inuit monsters and folklore", "ตำนานมนุษย์หมาป่าหิมะ Adlet"]
  },
  {
    id: "pin-rainbowserpent",
    title_th: "งูสายรุ้งแห่งดรีมไทม์และศิลาศักดิ์สิทธิ์อูลูรู",
    title_en: "The Rainbow Serpent & Sacred Uluru of the Dreamtime",
    category: "sacred",
    province_th: "นอร์เทิร์นเทร์ริทอรี (ออสเตรเลีย)",
    province_en: "Northern Territory (Australia)",
    district_th: "อุทยานแห่งชาติอูลูรู-คาตาจูทา",
    district_en: "Uluru-Kata Tjuta, Red Centre",
    lat: -25.3444,
    lng: 131.0369,
    story_th: "ภูเขาหินทรายสีแดงเดี่ยวขนาดมหึมากลางทะเลทรายออสเตรเลีย ศูนย์กลางตำนานยุคสร้างโลก 'ดรีมไทม์' ของชาวอะบอริจินที่งูสายรุ้งและวิญญาณบรรพบุรุษถือกำเนิด มีคำสาปเตือนผู้ที่แอบหยิบหินอูลูรูกลับบ้าน",
    story_en: "The monumental crimson sandstone monolith at the heart of Australia's desert, revered in Aboriginal Dreamtime cosmology as the dwelling place of ancestral creation spirits and the Rainbow Serpent.",
    folklore_history_th: "ในแต่ละปีมีนักท่องเที่ยวนับพันส่งพัสดุคืนก้อนหินที่แอบเก็บไปจากอูลูรูกลับมาพร้อมจดหมายขอขมา หลังประสบเคราะห์กรรมและฝันร้ายอย่างต่อเนื่องจนเรียกขานกันว่า 'คำสาปหินอูลูรู'",
    folklore_history_en: "Hundreds of 'sorry rocks' are mailed back to park rangers every year by tourists who stole pebbles from Uluru and suffered relentless misfortune until returning them.",
    sound_preset: "whisper",
    wikiCandidates: ["en:Uluru", "en:Rainbow_Serpent"],
    commonsSearch: "Uluru Ayers Rock sunset Australia",
    ytQueries: ["Uluru Dreamtime mythology documentary", "Curse of Uluru sorry rocks", "ตำนานหินอูลูรู คำสาป"]
  }
];

async function run() {
  console.log(`Starting Batch 180 (${BATCH_180.length} new pins)...`);
  const entitiesDir = path.resolve('public/entities');

  // Collect all existing MD5 hashes of non-BATCH_180 files so we never introduce a duplicate image
  const batchIds = new Set(BATCH_180.map(b => `${b.id}.jpg`));
  const existingHashes = new Set();
  for (const f of fs.readdirSync(entitiesDir)) {
    if (batchIds.has(f)) continue;
    const p = path.join(entitiesDir, f);
    if (fs.statSync(p).isFile()) {
      const buf = fs.readFileSync(p);
      existingHashes.add(crypto.createHash('md5').update(buf).digest('hex'));
    }
  }
  console.log(`Loaded ${existingHashes.size} existing unique image hashes.`);

  const finalPins = [];

  for (let i = 0; i < BATCH_180.length; i++) {
    const p = BATCH_180[i];
    const imgFile = `${p.id}.jpg`;
    const destPath = path.join(entitiesDir, imgFile);
    console.log(`[${i + 1}/${BATCH_180.length}] Processing ${p.id} (${p.title_th})...`);

    let imgOk = false;
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
      const buf = fs.readFileSync(destPath);
      const h = crypto.createHash('md5').update(buf).digest('hex');
      if (!existingHashes.has(h)) {
        existingHashes.add(h);
        imgOk = true;
        console.log(` -> Using already downloaded unique thumb (${(buf.length / 1024).toFixed(0)} KB)`);
      }
    }
    if (!imgOk) {
      imgOk = await fetchWikiThumbWithCommonsFallback(p.wikiCandidates, p.commonsSearch, destPath, existingHashes);
    }
    if (!imgOk) {
      console.error(`  !! WARNING: Failed to get unique image for ${p.id}`);
    }

    const yt = await findEmbeddableVideo(p.ytQueries);
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

  // Update seedData.ts
  const seedPath = path.resolve('src/data/seedData.ts');
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('= [', startIdx) + 2;
  const endIdx = content.lastIndexOf('];');
  const existingPins = eval(content.slice(arrayStart, endIdx + 1));

  // Filter out any already added from BATCH_180 just in case
  const newIds = new Set(finalPins.map(fp => fp.id));
  const filteredExisting = existingPins.filter(ep => !newIds.has(ep.id));
  const combined = [...filteredExisting, ...finalPins];
  console.log(`Updated pins count: ${filteredExisting.length} -> ${combined.length}`);

  const updatedFile = content.slice(0, arrayStart) + JSON.stringify(combined, null, 2) + ';\n';
  fs.writeFileSync(seedPath, updatedFile, 'utf8');
  console.log('Successfully updated src/data/seedData.ts!');

  // Generate SQL for D1
  let sql = '';
  for (const p of finalPins) {
    const esc = (s) => (s || '').replace(/'/g, "''");
    const galleryJson = esc(JSON.stringify(p.gallery_media));
    sql += `INSERT OR REPLACE INTO ghost_pins (id, title_th, title_en, category, province_th, province_en, district_th, district_en, lat, lng, story_th, story_en, folklore_history_th, folklore_history_en, image_url, sound_preset, views_count, gallery_media, is_published, created_at, updated_at) VALUES ('${p.id}', '${esc(p.title_th)}', '${esc(p.title_en)}', '${esc(p.category)}', '${esc(p.province_th)}', '${esc(p.province_en)}', '${esc(p.district_th)}', '${esc(p.district_en)}', ${p.lat}, ${p.lng}, '${esc(p.story_th)}', '${esc(p.story_en)}', '${esc(p.folklore_history_th)}', '${esc(p.folklore_history_en)}', '${p.image_url}', '${p.sound_preset}', 0, '${galleryJson}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n`;
  }
  fs.writeFileSync('../insert_batch180.sql', sql, 'utf8');
  console.log('Generated ../insert_batch180.sql with 30 INSERT statements.');
}

run().catch(console.error);

const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: { 'User-Agent': 'WorldOfMys/2.0 (contact: admin@worldofmys.com)' }
    }, (res) => {
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
      headers: { 'User-Agent': 'WorldOfMys/2.0 (contact: admin@worldofmys.com)' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
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
          } catch(e) { resolve({ videoId, embeddable: false }); }
        });
      } else {
        resolve({ videoId, embeddable: false });
      }
    }).on('error', () => resolve({ videoId, embeddable: false }));
  });
}

async function findEmbeddableVideo(queries) {
  for (const q of queries) {
    const vids = await searchYouTube(q);
    for (const vid of vids.slice(0, 15)) {
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
    title: 'Mystery Documentary'
  };
}

async function fetchWikiThumb(wikiTitle, destPath, fallbackFile) {
  try {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=800`;
    const res = await fetchJson(apiUrl);
    if (res.status === 200 && res.data && res.data.query && res.data.query.pages) {
      const page = Object.values(res.data.query.pages)[0];
      if (page && page.thumbnail && page.thumbnail.source) {
        await downloadFile(page.thumbnail.source, destPath);
        const buf = fs.readFileSync(destPath);
        if (buf.length > 1000) {
          console.log(` -> Downloaded wiki thumbnail for ${wikiTitle} (${(buf.length / 1024).toFixed(0)} KB)`);
          return true;
        }
      }
    }
  } catch (e) {
    console.warn(`Wiki thumb error for ${wikiTitle}:`, e.message);
  }
  // Fallback to existing entity file
  if (fallbackFile && fs.existsSync(fallbackFile)) {
    fs.copyFileSync(fallbackFile, destPath);
    console.log(` -> Copied fallback artwork for ${destPath}`);
    return true;
  }
  return false;
}

const BATCH_150 = [
  {
    id: "pin-petra",
    title_th: "นครศิลาเพตราและหินวิญญาณแห่งญิน",
    title_en: "Petra & The Djinn Blocks of Edom",
    category: "sacred",
    province_th: "มาอัน (จอร์แดน)",
    province_en: "Ma'an Governorate (Jordan)",
    district_th: "หุบเขาโมเสส วาดิมูซา",
    district_en: "Wadi Musa, Arabah Valley",
    lat: 30.3285,
    lng: 35.4444,
    story_th: "มหานครศิลาทรายสีชมพูที่แกะสลักลึกเข้าไปในหน้าผาสูงชัน บริเวณทางเข้ามีแท่งหินขนาดยักษ์ 'บล็อกแห่งญิน' ที่ชาวเบดูอินเชื่อว่าเป็นที่สิงสถิตของวิญญาณญินทะเลทรายผู้พิทักษ์ขุมทรัพย์",
    story_en: "The rose-red rock city carved into sandstone cliffs. Near its canyon entrance stand the towering monumental Djinn Blocks, believed by local Bedouins to house desert spirits and genies guarding ancient wealth.",
    folklore_history_th: "สร้างโดยชาวนาบาเทียนเมื่อกว่าสองพันปีก่อน มีระบบผันน้ำใต้ดินอันแยบยล และถูกลืมเลือนไปจากโลกตะวันตกนานหลายศตวรรษจนกระทั่งถูกค้นพบใหม่ในปี 1812",
    folklore_history_en: "Carved by the mysterious Nabataeans with ingenious hydraulic canals. It vanished from Western maps for centuries until Swiss explorer Johann Burckhardt rediscovered it in disguise in 1812.",
    sound_preset: "whisper",
    wikiTitle: "Petra",
    ytQueries: ["Petra Jordan mystery documentary", "Petra Djinn blocks", "Treasury of Petra"]
  },
  {
    id: "pin-bathory",
    title_th: "เคาน์เตสเอลิซาเบธ บาโธรี (ปราสาทชาคติเซ)",
    title_en: "Countess Elizabeth Báthory (Čachtice Castle)",
    category: "legend",
    province_th: "เตรนชิน (สโลวาเกีย)",
    province_en: "Trenčín Region (Slovakia)",
    district_th: "เทือกเขาคาร์เพเทียนตอนล่าง",
    district_en: "Čachtice, Little Carpathians",
    lat: 48.7186,
    lng: 17.7889,
    story_th: "สตรีสูงศักดิ์ชาวฮังการีผู้ได้รับฉายา 'เคาน์เตสเลือด' ตำนานเล่าว่าเธอสังหารหญิงสาวพรหมจรรย์กว่า 650 คน เพื่อนำเลือดมาอาบชโลมกายโดยหวังคงความงามและความเยาว์วัยนิรันดร์",
    story_en: "The Hungarian noblewoman infamous as the 'Blood Countess'. Legends whisper she murdered over 600 young peasant maidens to bathe in their virgin blood to preserve her youth forever.",
    folklore_history_th: "ถูกกุมตัวในปี 1610 และถูกลงทัณฑ์ด้วยการขังลืมไว้ในห้องปิดตายภายในปราสาทชาคติเซจนกระทั่งเสียชีวิต กลายเป็นแรงบันดาลใจให้กับวรรณกรรมแวมไพร์ยุคแรกเริ่ม",
    folklore_history_en: "Arrested in 1610 following eyewitness trials of witchcraft, she was immured alive inside a windowless stone chamber within Čachtice Castle until her demise, shaping vampire folklore.",
    sound_preset: "creepy_wind",
    wikiTitle: "Elizabeth_Báthory",
    ytQueries: ["Elizabeth Bathory documentary", "Blood Countess Cachtice castle", "Elizabeth Bathory true story"]
  },
  {
    id: "pin-grendel",
    title_th: "เกรนเดล (อสูรกายหนองน้ำบุตรแห่งคาอิน)",
    title_en: "Grendel, The Mere Monster of Beowulf",
    category: "monster",
    province_th: "เกาะเชลลันด์ (เดนมาร์ก)",
    province_en: "Zealand (Denmark)",
    district_th: "บึงหนองน้ำโบราณแห่งไลเร",
    district_en: "Lejre & Roskilde Fjord Swamps",
    lat: 55.6000,
    lng: 11.9700,
    story_th: "อสูรกายร่างยักษ์ผู้ทนฟังเสียงดนตรีและงานรื่นเริงในห้องโถงเฮโอร็อตไม่ได้ มันจะบุกสังหารและฉีกร่างกลืนกินนักรบในความมืด มีผิวกายเหนียวแน่นจนคมดาบมนุษย์ไม่สามารถฟันระคายเคือง",
    story_en: "The primeval swamp-dwelling fiend of Old English epic Beowulf. Descended from the cursed lineage of Cain, he raided King Hrothgar’s mead hall of Heorot under darkness, immune to mortal steel.",
    folklore_history_th: "เบโอวูล์ฟต้องต่อสู้ด้วยมือเปล่าและหักแขนเกรนเดลจนมันหลบหนีไปตายในถ้ำใต้น้ำ เป็นตัวแทนของความมืดมิด ความอิจฉาริษยา และภัยคุกคามจากธรรมชาติดิบเถื่อน",
    folklore_history_en: "Wrestling the beast with bare hands, the Geatish hero Beowulf tore off Grendel's arm. Archeologists identify the royal halls of Lejre as the factual epicenter of the legend.",
    sound_preset: "jungle_curse",
    wikiTitle: "Grendel",
    ytQueries: ["Grendel Beowulf monster documentary", "Mythology of Grendel", "Beowulf story animated"]
  },
  {
    id: "pin-thunderbird",
    title_th: "วิหคสายฟ้าทันเดอร์เบิร์ด (แบล็กฮิลส์)",
    title_en: "The Thunderbird of the Sacred Black Hills",
    category: "monster",
    province_th: "เซาท์ดาโคตา (สหรัฐอเมริกา)",
    province_en: "South Dakota (USA)",
    district_th: "เทือกเขาแบล็กฮิลส์ แดนศักดิ์สิทธิ์ซูส์",
    district_en: "Black Hills & Badlands, Lakota Territory",
    lat: 43.8791,
    lng: -103.4591,
    story_th: "พญาปักษายักษ์ในความเชื่อของชนเผ่าพื้นเมืองอเมริกา ปีกกว้างบดบังท้องฟ้า เมื่อกระพือปีกจะเกิดเป็นเสียงฟ้าร้องคำรามกึกก้อง และดวงตาเปล่งประกายแสงสายฟ้าฟาดปราบอสรพิษใต้พิภพ",
    story_en: "The monumental avian storm-spirit in Native American cosmology. Flapping its titanic wings summons crashing thunder, while lightning bolts flash from its fiery eyes to slay horned water monsters.",
    folklore_history_th: "ชาวเผ่าลาโกตาและโอจิบวีเคารพในฐานะผู้พิทักษ์สมดุลแห่งฟ้าดิน และยังคงมีรายงานการพบเห็นนกยักษ์ปีกกว้างกว่า 5 เมตรบินผ่านทุ่งหญ้าตะวันตกในยุคปัจจุบัน",
    folklore_history_en: "Revered by Lakota, Ojibwe, and Pacific Northwest tribes as a supreme protector against chaos. Cryptozoologists note modern sightings resembling surviving giant Teratorn vultures.",
    sound_preset: "creepy_wind",
    wikiTitle: "Thunderbird_(mythology)",
    ytQueries: ["Thunderbird cryptid documentary", "Native American Thunderbird myth", "Thunderbird sightings"]
  },
  {
    id: "pin-catacombs",
    title_th: "สุสานใต้ดินปารีส (เขาวงกต 6 ล้านโครงกระดูก)",
    title_en: "The Catacombs of Paris (The Labyrinth of 6 Million Skulls)",
    category: "ghost",
    province_th: "ปารีส (ฝรั่งเศส)",
    province_en: "Paris (France)",
    district_th: "เหมืองหินปูนใต้ดิน เขต 14",
    district_en: "Place Denfert-Rochereau, 14th Arrondissement",
    lat: 48.8338,
    lng: 2.3324,
    story_th: "อุโมงค์เหมืองหินปูนโบราณลึกใต้ผืนดินกรุงปารีสยาวกว่า 300 กิโลเมตร ที่บรรจุโครงกระดูกมนุษย์เรียงรายกว่า 6 ล้านศพ เล่าขานถึงเสียงกระซิบจากผนังกระดูก และผู้คนที่หลงทางจนไม่มีวันได้กลับขึ้นมา",
    story_en: "The subterranean ossuary tunnels winding 200 miles beneath the streets of Paris. Holding the arranged skeletal remains of over six million citizens, legends tell of spectral whispers and lost explorers.",
    folklore_history_th: "สร้างขึ้นในศตวรรษที่ 18 เพื่อแก้ปัญหาสุสานล้นเมืองและโรคระบาด ป้ายเหนือทางเข้าสลักเตือนใจว่า 'หยุดเถิด! ที่นี่คืออาณาจักรแห่งความตาย'",
    folklore_history_en: "Established in the late 1700s to relieve overflowing city graveyards. The entrance bears the chilling inscribed warning: 'Arrête! C'est ici l'empire de la Mort' (Stop! Here is the Empire of Death).",
    sound_preset: "whisper",
    wikiTitle: "Catacombs_of_Paris",
    ytQueries: ["Catacombs of Paris documentary", "Paris Catacombs mystery lost", "Exploring the Paris Catacombs"]
  },
  {
    id: "pin-champ",
    title_th: "แชมป์ (อสูรคอยาวแห่งทะเลสาบแชมเพลน)",
    title_en: "Champ, The Lake Champlain Monster",
    category: "monster",
    province_th: "นิวยอร์ก / เวอร์มอนต์ (สหรัฐอเมริกา)",
    province_en: "New York / Vermont (USA)",
    district_th: "ร่องน้ำลึกเกาะเบอร์ลิงตัน",
    district_en: "Burlington Bay, Lake Champlain",
    lat: 44.5298,
    lng: -73.3486,
    story_th: "สิ่งมีชีวิตโบราณคล้ายเพลซิโอซอร์คอยาว มีผิวสีเขียวเทาเข้ม มีรายงานการพบเห็นหลายร้อยครั้งตั้งแต่ศตวรรษที่ 17 จนได้รับสมญาว่า 'เนสซีแห่งทวีปอเมริกา'",
    story_en: "The ancient reptilian lake cryptid of Lake Champlain. Described as a long-necked serpentine creature with dark grey hide, it has been sighted hundreds of times since colonial explorer Samuel de Champlain.",
    folklore_history_th: "ชาวเผ่าอิโรควอยส์มีตำนานเกี่ยวกับสัตว์ประหลาด 'ชากาตาก' ในปี 1977 แซนดรา แมนซี ได้ถ่ายภาพศีรษะและลำคอของมันเหนือน้ำได้อย่างชัดเจนจนฮือฮาไปทั่วโลก",
    folklore_history_en: "Named Tatoskok by the Abenaki and Iroquois tribes. Vaulted to international fame in 1977 when Sandra Mansi captured an authentic photograph of a long-necked animal rising above the water.",
    sound_preset: "water_spirit",
    wikiTitle: "Champ_(folklore)",
    ytQueries: ["Lake Champlain monster Champ documentary", "Champ cryptid sightings", "Is Champ real Lake monster"]
  },
  {
    id: "pin-oakisland",
    title_th: "หลุมสมบัติอาถรรพ์แห่งเกาะโอ๊ก",
    title_en: "The Oak Island Money Pit & The Templar Curse",
    category: "curse",
    province_th: "โนวาสโกเชีย (แคนาดา)",
    province_en: "Nova Scotia (Canada)",
    district_th: "อ่าวมาโฮเน ทางตอนใต้ของโนวาสโกเชีย",
    district_en: "Mahone Bay, Lunenburg County",
    lat: 44.5133,
    lng: -64.2950,
    story_th: "หลุมลึกลับที่ขุดพบชั้นไม้และกับดักน้ำท่วมทะเลอันแยบยลตั้งแต่ปี 1795 เชื่อกันว่าเป็นที่ซ่อนจอกศักดิ์สิทธิ์หรือสมบัติอัศวินเทมพลาร์ มีคำสาปเล่าว่าต้องมีคนตายครบ 7 คนก่อนที่ความลับจะถูกเปิดเผย",
    story_en: "The world's most intricate subterranean booby-trapped shaft. Believed to conceal Templar relics, Marie Antoinette’s jewels, or pirate gold, legend warns seven searchers must die before the vault surrenders its secrets.",
    folklore_history_th: "นักขุดสมบัติใช้เวลากว่า 200 ปีในการเจาะอุโมงค์แต่กลับเจอกับดักน้ำเค็มทะลักท่วมทุกครั้ง ปัจจุบันมีผู้เสียชีวิตขณะค้นหาแล้ว 6 ราย",
    folklore_history_en: "Engineered with ingenious underground flood tunnels channeling Atlantic seawater whenever excavators dig deep. Six men have lost their lives in the pursuit to date.",
    sound_preset: "whisper",
    wikiTitle: "Oak_Island_mystery",
    ytQueries: ["Oak Island money pit documentary", "Curse of Oak Island mystery", "Oak Island Templar treasure"]
  },
  {
    id: "pin-klerksdorp",
    title_th: "ทรงกลมโลหะเคลิร์กสดอร์ป (วัตถุโบราณ 3 พันล้านปี)",
    title_en: "The Klerksdorp Spheres (The 3-Billion-Year Enigma)",
    category: "sacred",
    province_th: "นอร์ทเวสต์ (แอฟริกาใต้)",
    province_en: "North West Province (South Africa)",
    district_th: "เหมืองแร่ไพโรฟิลไลต์ อ็อตโตสดาล",
    district_en: "Ottosdal Mines, Klerksdorp",
    lat: -26.8667,
    lng: 26.6667,
    story_th: "ลูกทรงกลมโลหะผิวเรียบที่มีรอยบากเป็นเส้นขนานรอบตัว ขุดพบในชั้นหินไพโรฟิลไลต์ที่มีอายุเก่าแก่กว่า 3,000 ล้านปี ก่อนที่สิ่งมีชีวิตหลายเซลล์ชนิดแรกจะถือกำเนิดบนโลกมนุษย์",
    story_en: "Small, finely grooved metallic spheroids unearthed by miners in pyrophyllite deposits dated to three billion years old—long before complex biological life evolved on planet Earth.",
    folklore_history_th: "ผู้สนับสนุนทฤษฎีโบราณคดีนอกขนบเชื่อว่าเป็นหลักฐานของอารยธรรมทรงภูมิปัญญายุคก่อนประวัติศาสตร์ ขณะที่นักธรณีวิทยาอธิบายว่าเป็นผลึกแร่ฮีมาไทต์ธรรมชาติ",
    folklore_history_en: "Often touted by alternative theorists as out-of-place artifacts (OOPArts) left by prehistoric civilizations. Geologists classify them as volcanic accretion nodules of hematite and goethite.",
    sound_preset: "whisper",
    wikiTitle: "Klerksdorp_sphere",
    ytQueries: ["Klerksdorp spheres 3 billion years mystery", "Out of place artifacts Klerksdorp", "Ancient metallic spheres"]
  },
  {
    id: "pin-antikythera",
    title_th: "กลไกแอนติคิเธียรา (คอมพิวเตอร์ดาราศาสตร์เครื่องแรก)",
    title_en: "The Antikythera Mechanism (First Astronomical Computer)",
    category: "sacred",
    province_th: "เกาะแอนติคิเธียรา (กรีซ)",
    province_en: "Antikythera (Greece)",
    district_th: "ซากเรืออับปางนอกชายฝั่งทางตอนใต้",
    district_en: "Antikythera Strait Shipwreck",
    lat: 35.8647,
    lng: 23.3047,
    story_th: "ชิ้นส่วนฟันเฟืองบรอนซ์อันซับซ้อนกว่า 30 ชิ้นที่กู้ได้จากซากเรืออับปางยุคกรีกโบราณ สร้างขึ้นเมื่อกว่า 2,000 ปีก่อน สามารถคำนวณการโคจรของดวงดาว สุริยุปราคา และปฏิทินโอลิมปิกได้อย่างแม่นยำล้ำยุค",
    story_en: "A mind-boggling complex bronze clockwork mechanism of 30 meshing gears recovered from a Roman shipwreck. Engineered over two millennia ago to compute solar eclipses and planetary orbits with astonishing accuracy.",
    folklore_history_th: "เทคโนโลยีฟันเฟืองระดับนี้สูญหายไปจากโลก และมนุษย์ต้องใช้เวลาอีกกว่า 1,500 ปีกว่าที่จะสร้างนาฬิกากลไกที่มีความซับซ้อนเทียบเท่าได้ในยุคเรเนซองส์",
    folklore_history_en: "Regarded as the world's first analog computer. No mechanical device of comparable sophistication reappeared in historical records until European astronomical clocks in the 14th century.",
    sound_preset: "whisper",
    wikiTitle: "Antikythera_mechanism",
    ytQueries: ["Antikythera mechanism documentary", "World first computer Antikythera", "Mystery of Antikythera mechanism"]
  },
  {
    id: "pin-bloop",
    title_th: "เดอะ บลูป (เสียงลึกลับจากห้วงสมุทรลึกแปซิฟิกใต้)",
    title_en: "The Bloop (The Abyssal Ultra-Low Frequency Sound)",
    category: "monster",
    province_th: "มหาสมุทรแปซิฟิกตอนใต้",
    province_en: "South Pacific Ocean",
    district_th: "จุดรกร้างห่างไกลพอยต์นีโม",
    district_en: "Remote Oceanic Pole of Inaccessibility (Point Nemo)",
    lat: -50.0000,
    lng: -100.0000,
    story_th: "ในปี 1997 ทุ่นดักฟังเสียงใต้น้ำของกองทัพเรือสหรัฐฯ ตรวจจับสัญญาณเสียงคลื่นความถี่ต่ำที่มีพลังงานมหาศาลดังไกลกว่า 5,000 กิโลเมตร หากเป็นสิ่งมีชีวิต มันจะต้องมีขนาดใหญ่กว่าวาฬสีน้ำเงินหลายเท่า",
    story_en: "In 1997, NOAA hydrophones detected an ultra-low frequency underwater acoustic sound of immense power spanning over 3,000 miles. Speculation raged that it emanated from a gargantuan undiscovered deep-sea leviathan.",
    folklore_history_th: "พิกัดที่มาของเสียงอยู่ใกล้กับที่ตั้งของเมือง 'รลูเยห์' (R'lyeh) นครใต้น้ำที่คธูลูจำศีลอยู่ในนิยายของ เอช.พี. เลิฟคราฟท์ แม้ต่อมา NOAA จะระบุว่าเป็นเสียงแผ่นน้ำแข็งขั้วโลกแตกตัวก็ตาม",
    folklore_history_en: "Occultists noted the epicenter lay remarkably close to H.P. Lovecraft’s sunken nightmare city of R'lyeh. NOAA officially matched its acoustic profile to massive glacial icequakes in Antarctica.",
    sound_preset: "water_spirit",
    wikiTitle: "Bloop",
    ytQueries: ["The Bloop sound mystery documentary", "What was the Bloop ocean sound", "The Bloop NOAA mystery"]
  },
  {
    id: "pin-gilgamesh",
    title_th: "มหากาพย์กิลกาเมชและนครโบราณอูรุก",
    title_en: "The Epic of Gilgamesh & Ancient Uruk",
    category: "legend",
    province_th: "อัลมูทันนา (อิรัก)",
    province_en: "Al-Muthanna Governorate (Iraq)",
    district_th: "ซากนครอูรุก วาร์กา",
    district_en: "Warka, Euphrates River Bed",
    lat: 31.3222,
    lng: 45.2819,
    story_th: "มหากาพย์วรรณกรรมที่เก่าแก่ที่สุดในประวัติศาสตร์มนุษยชาติ เล่าขานถึงกษัตริย์กึ่งเทพผู้ทรงพลังแห่งอูรุก และการเดินทางข้ามขอบฟ้าเพื่อตามหายาอายุวัฒนะหลังการจากไปของเพื่อนรักเอนคิดู",
    story_en: "Humanity's oldest surviving epic poem inscribed on clay cuneiform tablets. Recounting the adventures of King Gilgamesh, two-thirds divine, seeking the secret of immortality after the tragic death of Enkidu.",
    folklore_history_th: "ค้นพบในห้องสมุดกษัตริย์อัสชูร์บานิปาลในศตวรรษที่ 19 มีเรื่องราวของน้ำท่วมโลกครั้งใหญ่ที่เหมือนกับเรือโนอาห์ในคัมภีร์ไบเบิลอย่างน่าตกใจ",
    folklore_history_en: "Unearthed at Nineveh in 1853. Tablet XI contains an astonishing flood narrative predating the Genesis story of Noah's Ark by centuries, shaking Victorian biblical archaeology.",
    sound_preset: "whisper",
    wikiTitle: "Epic_of_Gilgamesh",
    ytQueries: ["Epic of Gilgamesh documentary", "Gilgamesh story ancient Mesopotamia", "Ancient city of Uruk"]
  },
  {
    id: "pin-khamchanod",
    title_th: "วังนาคินทร์คำชะโนด (ป่าต้นชะโนดลอยน้ำ)",
    title_en: "Wang Nakin Kham Chanod (The Floating Naga Isle)",
    category: "sacred",
    province_th: "อุดรธานี (ไทย)",
    province_en: "Udon Thani (Thailand)",
    district_th: "บ้านดุง",
    district_en: "Ban Dung District",
    lat: 17.7424,
    lng: 103.1706,
    story_th: "เกาะต้นชะโนดลึกลับกลางน้ำที่มีรากไม้สานกันแน่นหนาจนเกาะลอยตัวขึ้นลงตามระดับน้ำได้ เชื่อว่าเป็นประตูมิติเชื่อมต่อสู่เมืองบาดาลแห่งพญานาคราชปู่ศรีสุทโธและย่าศรีปทุมมา",
    story_en: "A sacred island sanctuary overgrown with prehistoric Chanod palm trees whose root system floats buoyant upon marshwaters. Revered as the direct mystical portal to the underwater palace of Grandfather Sri Suttho Naga.",
    folklore_history_th: "โด่งดังจากเหตุการณ์ 'ผีจ้างหนังคำชะโนด' ในปี 2532 เมื่อหน่วยหนังเร่ได้รับจ้างไปฉายภาพยนตร์กลางดึกในป่าร้างที่มีผู้ชมแต่งชุดขาวนับร้อยยืนนิ่งสนิท ก่อนจะหายตัวไปอย่างไร้ร่องรอยในยามเช้า",
    folklore_history_en: "Famed for the 1989 phantom outdoor cinema incident, where a film crew was hired into the swamp to screen movies for silent spectators dressed in white who dissolved into thin air at dawn.",
    sound_preset: "temple_bell",
    wikiTitle: "Nāga",
    ytQueries: ["ผีจ้างหนังคำชะโนด", "ตำนาน คำชะโนด อุดรธานี", "ปู่ศรีสุทโธ คำชะโนด สารคดี"]
  },
  {
    id: "pin-dogon",
    title_th: "ชนเผ่าโดกอนกับปริศนาดาวซิริอุส บี",
    title_en: "The Dogon Tribe & The Sirius B Mystery",
    category: "sacred",
    province_th: "โมปติ (มาลี)",
    province_en: "Mopti Region (Mali)",
    district_th: "หน้าผาบันเดียการา ดินแดนหินผาโดกอน",
    district_en: "Bandiagara Escarpment, Sahel",
    lat: 14.4333,
    lng: -3.3167,
    story_th: "ชนเผ่าแอฟริกาโบราณผู้มีความรู้ดาราศาสตร์ลึกซึ้ง พวกเขารู้จัก 'ดาวซิริอุส บี' ดาวแคระขาวที่มองไม่เห็นด้วยตาเปล่า และรู้คาบการโคจร 50 ปี ล่วงหน้าก่อนที่กล้องโทรทรรศน์สมัยใหม่จะค้นพบ",
    story_en: "The ancient cliff-dwelling African tribe possessing astonishing astronomical lore. They knew of Sirius B—an invisible white dwarf star orbiting Sirius A every 50 years—centuries before modern telescopes detected it.",
    folklore_history_th: "ตำนานของชาวโดกอนเล่าว่าความรู้นี้ได้รับการถ่ายทอดจาก 'นอมโม' (Nommo) สิ่งมีชีวิตครึ่งคนครึ่งปลาที่เดินทางลงมาจากฟากฟ้าด้วยยานอวกาศรูปเรือบินในอดีตกาล",
    folklore_history_en: "Dogon elders claim their stellar knowledge was gifted by the Nommo, amphibious alien sky-gods who descended to Earth in spinning craft, described in Marcel Griaule’s anthropological studies.",
    sound_preset: "whisper",
    wikiTitle: "Dogon_people",
    ytQueries: ["Dogon tribe Sirius mystery documentary", "Dogon ancient astronomy aliens", "The Sirius Mystery Robert Temple"]
  },
  {
    id: "pin-rendlesham",
    title_th: "เหตุการณ์ป่าเรนเดิลแชม (รอสเวลล์แห่งเกาะอังกฤษ)",
    title_en: "The Rendlesham Forest UFO Incident",
    category: "legend",
    province_th: "ซัฟฟอล์ก (อังกฤษ)",
    province_en: "Suffolk (England, UK)",
    district_th: "ป่าเรนเดิลแชม ใกล้ฐานทัพอากาศวูดบริดจ์",
    district_en: "RAF Woodbridge & Rendlesham Forest",
    lat: 52.0833,
    lng: 1.4333,
    story_th: "ในคืนวันคริสต์มาสปี 1980 ทหารอากาศสหรัฐฯ ประจำฐานทัพอังกฤษพบยานบินรูปสามเหลี่ยมเรืองแสงลงจอดในป่าเรนเดิลแชม ผู้การชาร์ลส์ ฮอลต์ ได้เข้าตรวจและบันทึกเทปเสียงขณะระดับรังสีพุ่งสูงขึ้นอย่างผิดปกติ",
    story_en: "In late December 1980, United States Air Force personnel stationed near RAF Woodbridge witnessed a glowing metallic triangular craft maneuvering between pine trees, leaving behind radioactive landing indentations.",
    folklore_history_th: "ถือเป็นคดียูเอฟโอที่น่าเชื่อถือที่สุดในประวัติศาสตร์สหราชอาณาจักร มีพยานปากเอกระดับนายทหารพร้อมหลักฐานร่องรอยการกดทับบนผืนดินและกิ่งไม้ไหม้เกรียม",
    folklore_history_en: "Often dubbed Britain's Roswell. Deputy base commander Lt. Col. Charles Halt documented the bizarre flashing lights live on microcassette recorder, creating an iconic declassified military record.",
    sound_preset: "creepy_wind",
    wikiTitle: "Rendlesham_Forest_incident",
    ytQueries: ["Rendlesham Forest UFO incident documentary", "Britain's Roswell Rendlesham", "Charles Halt Rendlesham recording"]
  },
  {
    id: "pin-colossus",
    title_th: "มหาเทวรูปโคโลสซัสแห่งโรดส์ (สิ่งมหัศจรรย์โบราณ)",
    title_en: "The Colossus of Rhodes (The Sun God Titan)",
    category: "sacred",
    province_th: "หมู่เกาะโดเดคะนีส (กรีซ)",
    province_en: "Dodecanese (Greece)",
    district_th: "ปากอ่าวแมนดรากี เมืองโรดส์",
    district_en: "Mandraki Harbour, Rhodes Island",
    lat: 36.4511,
    lng: 28.2258,
    story_th: "เทวรูปทองสัมฤทธิ์ขนาดยักษ์รูปสุริยเทพเฮลิออส สูงกว่า 33 เมตร ยืนตระหง่านคร่อมทางเข้าท่าเรือแมนดรากี สร้างขึ้นเพื่อฉลองชัยชนะในการต้านทัพบุก ก่อนจะพังทลายลงในแผ่นดินไหวครั้งใหญ่",
    story_en: "The colossal bronze statue of the sun god Helios standing over 100 feet tall at the harbor mouth of Rhodes. One of the Seven Wonders of the Ancient World, erected to celebrate victorious defense against siege.",
    folklore_history_th: "แม้จะยืนหยัดได้เพียง 54 ปีก่อนจะหักโค่น แต่ซากเทวรูปทองสัมฤทธิ์ขนาดมหึมาก็ยังคงนอนทอดกายอยู่ริมชายฝั่งและดึงดูดผู้คนจากทั่วโลกมาเยือนนานหลายร้อยปี",
    folklore_history_en: "Felled by a massive earthquake in 226 BCE, the Oracle of Delphi forbade its reconstruction. The colossal fallen limbs lay in the sand for eight centuries, marveling visitors with their gargantuan fingers.",
    sound_preset: "whisper",
    wikiTitle: "Colossus_of_Rhodes",
    ytQueries: ["Colossus of Rhodes Seven Wonders documentary", "What happened to the Colossus of Rhodes", "Ancient Wonder Colossus Rhodes"]
  },
  {
    id: "pin-anubis",
    title_th: "อนูบิสและสุสานใต้ดินซักคารา (เทพผู้พิทักษ์ความตาย)",
    title_en: "Anubis & The Subterranean Necropolis of Saqqara",
    category: "sacred",
    province_th: "กิซา (อียิปต์)",
    province_en: "Giza Governorate (Egypt)",
    district_th: "สุสานโบราณเซราเปียม ซักคารา",
    district_en: "Saqqara Plateau & Serapeum Crypts",
    lat: 29.8713,
    lng: 31.2165,
    story_th: "เทพเศียรหมาในสีดำสนิท ผู้เฝ้าประตูนรกและผู้ชั่งน้ำหนักหัวใจมนุษย์กับขนนกแห่งความจริง ที่ซักคาราเป็นที่ตั้งของสุสานเซราเปียมซึ่งมีโลงหินแกรนิตหนักหลายสิบตันเรียงรายอย่างเป็นปริศนา",
    story_en: "The jackal-headed Egyptian deity of mummification and psychopomp of the afterlife. At Saqqara sits the Serapeum, an eerie labyrinth of subterranean vaults containing 70-ton monolithic black basalt sarcophagi.",
    folklore_history_th: "การสลักโลงหินแกรนิตแข็งแกร่งด้วยความแม่นยำระดับมิลลิเมตรใต้ดินมืดมิด ยังคงเป็นปริศนาทางวิศวกรรมที่นักวิทยาศาสตร์ไม่สามารถหาข้อสรุปได้แน่ชัด",
    folklore_history_en: "Archaeologists remain stunned by how ancient builders transported and precision-machined massive 70-ton granite boxes inside dark underground catacombs without modern illumination or steel tools.",
    sound_preset: "whisper",
    wikiTitle: "Anubis",
    ytQueries: ["Anubis god of the dead documentary", "Serapeum of Saqqara mystery", "Saqqara giant stone boxes"]
  },
  {
    id: "pin-sirens",
    title_th: "เสียงเพลงไซเรนแห่งเกาะคาปรี (บทเพลงมรณะสะกดจิต)",
    title_en: "The Sirens of Capri (The Lethal Melodic Sirens)",
    category: "monster",
    province_th: "กัมปาเนีย (อิตาลี)",
    province_en: "Campania (Italy)",
    district_th: "โขดหินฟารัลโญนี เกาะคาปรี",
    district_en: "Faraglioni Rocks & Tyrrhenian Sea",
    lat: 40.5507,
    lng: 14.2426,
    story_th: "นางพรายและวิหคสาวเสียงสะกดจิตผู้อาศัยอยู่ตามแนวโขดหินแหลมคมยามคลื่นลมสงบ ใครก็ตามที่ได้ยินบทเพลงอันไพเราะของพวกเธอจะเคลิบเคลิ้มจนคุมสติไม่อยู่ บังคับเรือพุ่งชนหินโสโครกจนอับปาง",
    story_en: "The dangerous avian-nymph enchantresses perched upon jagged sea crags. Their hypnotic, irresistible melodies seduced passing sailors into trance states, steering their ships into fatal shipwrecks upon the reefs.",
    folklore_history_th: "ปรากฏในมหากาพย์โอดิสซีย์ โอดิสซีอุสต้องเอาขี้ผึ้งอุดหูลูกเรือทุกคน และสั่งให้มัดตัวเองไว้กับเสากระโดงเรือเพื่อให้ได้ยินเสียงเพลงไซเรนโดยไม่กระโดดลงไปสู่ความตาย",
    folklore_history_en: "Immortalized in Homer's Odyssey, where Odysseus famously plugged his crew's ears with beeswax and had himself lashed tightly to the ship's mast so he could listen to their song without drowning.",
    sound_preset: "water_spirit",
    wikiTitle: "Siren_(mythology)",
    ytQueries: ["Sirens Greek mythology documentary", "Odysseus and the Sirens myth", "The myth of Sirens"]
  },
  {
    id: "pin-brayroad",
    title_th: "อสูรร้ายแห่งถนนเบรย์โรด (มนุษย์หมาป่าวิสคอนซิน)",
    title_en: "The Beast of Bray Road (Wisconsin Werewolf)",
    category: "monster",
    province_th: "วิสคอนซิน (สหรัฐอเมริกา)",
    province_en: "Wisconsin (USA)",
    district_th: "เอลก์ฮอร์น วอลเวิร์ธเคาน์ตี",
    district_en: "Elkhorn Rural Farmlands",
    lat: 42.6667,
    lng: -88.5333,
    story_th: "สัตว์ประหลาดรูปร่างคล้ายหมาป่าขนาดใหญ่ที่สามารถยืนสองขาเหมือนมนุษย์ สูงกว่า 2 เมตร มีขนดกหนาสีน้ำตาลเข้มและดวงตาสีแดงฉาน ปรากฏตัวดักซุ่มตามแนวป่าข้าวโพดริมถนนเปลี่ยว",
    story_en: "The notorious bipedal canine cryptid haunting rural Elkhorn farmlands. Standing seven feet tall with broad muscular wolf-like features, it has terrorized motorists driving along foggy cornfields since the 1980s.",
    folklore_history_th: "มีพยานพบเห็นหลายสิบรายรวมถึงเจ้าหน้าที่ตำรวจท้องถิ่น และถูกตีพิมพ์ลงหน้าหนึ่งหนังสือพิมพ์วอลเวิร์ธในปี 1991 จนกลายเป็นตำนานสยองขวัญชื่อดังของอเมริกา",
    folklore_history_en: "Investigated extensively by journalist Linda Godfrey after numerous credible sightings by farmers and deputies. Witnesses reported it kneeling over roadkill and sprinting alongside cars.",
    sound_preset: "jungle_curse",
    wikiTitle: "Beast_of_Bray_Road",
    ytQueries: ["Beast of Bray Road documentary", "Wisconsin werewolf cryptid", "Bray Road monster true story"]
  },
  {
    id: "pin-maryking",
    title_th: "ตรอกแมรี่ คิงส์ โคลส (เมืองใต้ดินแห่งกาฬโรค)",
    title_en: "Mary King's Close (The Subterranean Plague Streets)",
    category: "ghost",
    province_th: "เอดินบะระ (สกอตแลนด์)",
    province_en: "Edinburgh (Scotland, UK)",
    district_th: "ถนนรอยัลไมล์ เมืองเก่าเอดินบะระ",
    district_en: "Royal Mile, Edinburgh Old Town",
    lat: 55.9497,
    lng: -3.1906,
    story_th: "ตรอกโบราณยุคกลางที่ถูกสร้างตึกใหญ่ทับจนกลายเป็นเมืองใต้ดินมืดมิด ในช่วงกาฬโรคระบาดหนัก ผู้ติดเชื้อนับร้อยถูกขังปิดตายอยู่ในตรอกนี้จนสิ้นใจ กลายเป็นสถานที่ที่มีวิญญาณสิงสถิตหนาแน่นที่สุดแห่งหนึ่งในโลก",
    story_en: "The eerie subterranean medieval street entombed beneath Edinburgh City Chambers. During the devastating 1645 Black Plague, infected victims were quarantined within stone tenements, leaving behind haunting restless phantoms.",
    folklore_history_th: "เรื่องเล่าที่โด่งดังที่สุดคือวิญญาณของเด็กหญิงแอนนี่ ผู้ร้องไห้ตามหาตุ๊กตาที่หายไป นักท่องเที่ยวจากทั่วโลกมักนำตุ๊กตามาวางมอบให้ในห้องเล็กๆ ใต้ดินเพื่อปลอบประโลมวิญญาณของเธอ",
    folklore_history_en: "Legendary for the sorrowful ghost of Annie, a young plague victim separated from her family. Visitors from across the world leave small dolls and toys in her stone room to comfort her spirit.",
    sound_preset: "whisper",
    wikiTitle: "Mary_King%27s_Close",
    ytQueries: ["Mary King's Close Edinburgh documentary", "Haunted Mary King's Close", "Ghosts of Mary King's Close Annie"]
  },
  {
    id: "pin-koschei",
    title_th: "คอสเชย์ผู้ไร้ความตาย (จอมเวทอมฤตย์แห่งไซบีเรีย)",
    title_en: "Koschei the Deathless, Immortal Sorcerer of Siberia",
    category: "monster",
    province_th: "ไซบีเรีย (รัสเซีย)",
    province_en: "Siberian Taiga (Russia)",
    district_th: "ป่าสนไทกาและหนองน้ำเยือกแข็ง",
    district_en: "Krasnoyarsk Wilderness & Lake Baikal",
    lat: 56.0000,
    lng: 92.0000,
    story_th: "จอมเวทผู้ทรงอำนาจและผอมแห้งจนมองเห็นโครงกระดูก ผู้แยกวิญญาณและความตายของตนเองออกไปซ่อนไว้ ปลายเข็มในไข่ ไข่ในเป็ด เป็ดในกระต่าย กระต่ายในหีบเหล็กที่ฝังไว้ใต้ต้นโอ๊กบนเกาะลึกลับกลางทะเล",
    story_en: "The immortal skeletal necromancer of Slavic folklore. Incapable of being slain by mortal weapons because his soul is concealed separately: inside a needle, in an egg, in a duck, in a hare, inside an iron chest buried beneath an oak tree on a distant island.",
    folklore_history_th: "หากเข็มยังไม่ถูกหัก คอสเชย์จะไม่มีวันตาย เป็นสัญลักษณ์แห่งฤดูหนาวอันยาวนานและเยือกแข็งของไซบีเรียที่กักขังความอุดมสมบูรณ์และแสงตะวันไว้ใต้หิมะ",
    folklore_history_en: "Only by finding the iron chest and snapping the mystical needle can the immortal tyrant be destroyed. Folklorists view Koschei as the mythical embodiment of harsh Siberian winter freezing the land.",
    sound_preset: "creepy_wind",
    wikiTitle: "Koschei",
    ytQueries: ["Koschei the Deathless mythology documentary", "Slavic folklore Koschei", "The story of Koschei the Deathless"]
  },
  {
    id: "pin-taoshum",
    title_th: "เสียงหึ่งปริศนาแห่งเมืองทาอส (คลื่นเสียงไร้ที่มา)",
    title_en: "The Taos Hum (The Infrasonic Sonic Anomaly)",
    category: "curse",
    province_th: "นิวเม็กซิโก (สหรัฐอเมริกา)",
    province_en: "New Mexico (USA)",
    district_th: "ทาอส ลุ่มแม่น้ำริโอแกรนด์",
    district_en: "Taos Plateau, Sangre de Cristo Mountains",
    lat: 36.4072,
    lng: -105.5731,
    story_th: "เสียงสั่นสะเทือนคลื่นความถี่ต่ำคล้ายเครื่องยนต์ดีเซลเดินเบา ที่ชาวเมืองทาอสกว่า 2% ได้ยินก้องอยู่ในศีรษะตลอดเวลาทั้งวันทั้งคืน จนทำให้นอนไม่หลับและมีอาการประสาทหลอน แม้จะใช้เครื่องตรวจจับคลื่นเสียงก็หาต้นตอไม่พบ",
    story_en: "A continuous, low-frequency acoustic drone heard by approximately 2% of the residents of Taos, New Mexico. Resembling a distant idling diesel engine, the mysterious sound penetrates buildings and defies all scientific detection.",
    folklore_history_th: "ในปี 1993 สภาคองเกรสสหรัฐฯ ได้ส่งทีมนักวิทยาศาสตร์ชั้นนำลงพื้นที่ตรวจสอบอย่างละเอียด แต่เครื่องตรวจคลื่นความถี่ไม่สามารถจับสัญญาณเสียงในอากาศได้ ทำให้เกิดทฤษฎีเรื่องการทดลองใต้ดินหรือคลื่นแม่เหล็กโลก",
    folklore_history_en: "Investigated in 1993 by university physicists and the US Congress. Acoustic sensors detected no elevated sound waves in the air, fueling theories of subterranean military testing and tectonic electromagnetic resonances.",
    sound_preset: "whisper",
    wikiTitle: "The_Hum",
    ytQueries: ["The Taos Hum mystery documentary", "What causes the Taos Hum", "Unsolved mystery the Taos Hum"]
  },
  {
    id: "pin-pegasus",
    title_th: "เพกาซัส (อาชาสวรรค์ผู้ให้กำเนิดตาน้ำพุศักดิ์สิทธิ์)",
    title_en: "Pegasus & The Sacred Spring of Mount Helicon",
    category: "sacred",
    province_th: "บีโอเชีย (กรีซ)",
    province_en: "Boeotia (Greece)",
    district_th: "ยอดเขาเฮลิคอน แดนสถิตแห่งมิวส์",
    district_en: "Mount Helicon & Hippocrene Spring",
    lat: 38.3167,
    lng: 22.8667,
    story_th: "ม้าศึกสีขาวบริสุทธิ์ที่มีปีกนกอินทรีย์คู่สง่างาม ถือกำเนิดขึ้นจากเลือดของนางเมดูซาเมื่อครั้งถูกเพอร์ซีอุสตัดคอ เมื่อเพกาซัสกระทืบกีบเท้าลงบนหินแห่งยอดเขาเฮลิคอน ก็บังเกิดเป็นตาน้ำพุศักดิ์สิทธิ์ 'ฮิปโปครีนี'",
    story_en: "The pure white winged divine stallion born from the neck of Medusa upon her defeat. Where Pegasus struck his celestial hoof against the rocks of Mount Helicon, the sacred fountain of Hippocrene burst forth, inspiring poets and artists.",
    folklore_history_th: "เป็นสหายคู่ใจของเบลเลอโรฟอนในการปราบอสูรไคเมร่า และต่อมาได้บินขึ้นสู่สวรรค์กลายเป็นม้าบรรทุกสายฟ้าให้แก่มหาเทพซูส ก่อนจะกลายเป็นกลุ่มดาวเพกาซัสบนฟากฟ้า",
    folklore_history_en: "Befriended by the hero Bellerophon to vanquish the fire-breathing Chimera. After ascending Mount Olympus, Zeus rewarded the loyal steed by placing him forever in the heavens as the constellation Pegasus.",
    sound_preset: "whisper",
    wikiTitle: "Pegasus",
    ytQueries: ["Pegasus Greek mythology documentary", "The myth of Pegasus", "Bellerophon and Pegasus story"]
  },
  {
    id: "pin-kitsune",
    title_th: "จิ้งจอกเก้าหางคิตสึเนะและหินมรณะเซ็ชโชเซกิ",
    title_en: "The Nine-Tailed Kitsune & The Sessho-seki Killing Stone",
    category: "monster",
    province_th: "โทจิงิ (ญี่ปุ่น)",
    province_en: "Tochigi Prefecture (Japan)",
    district_th: "ที่ราบสูงภูเขาไฟนาสุ",
    district_en: "Nasu Volcanic Highlands",
    lat: 37.1000,
    lng: 139.9833,
    story_th: "นางจิ้งจอกเก้าหางจำแลงกายนามว่า 'ทามาโมะ โนะ มาเอะ' ผู้มีมนต์สะกดองค์จักรพรรดิ เมื่อถูกนักพรตเปิดโปงและสังหาร วิญญาณแค้นของเธอได้กลายเป็นก้อนหินพิษ 'เซ็ชโชเซกิ' ที่สัตว์ใดเฉียดกรายเข้ามาจะขาดใจตายทันที",
    story_en: "The shapeshifting nine-tailed fox spirit Tamamo-no-Mae who seduced Japanese emperors. Upon being slain by warriors, her vengeful spirit transformed into the deadly Sessho-seki 'Killing Stone' whose toxic fumes kill any bird or beast near it.",
    folklore_history_th: "ในเดือนมีนาคม ปี 2022 เกิดเหตุฮือฮาไปทั่วโลกเมื่อหินเซ็ชโชเซกิได้แตกออกเป็นสองท่อนด้วยตนเอง ทำให้ชาวบ้านและผู้คนบนอินเทอร์เน็ตตื่นตระหนกว่าวิญญาณจิ้งจอกเก้าหางอาจหลุดพ้นจากการสะกดแล้ว",
    folklore_history_en: "In March 2022, international headlines erupted when the legendary Killing Stone suddenly cracked cleanly in two, sparking widespread viral speculation that the sealed demon fox had awakened after nearly a millennium.",
    sound_preset: "whisper",
    wikiTitle: "Sessho-seki",
    ytQueries: ["Sessho seki killing stone Japan documentary", "Tamamo no Mae nine tailed fox legend", "Japan killing stone split in half"]
  },
  {
    id: "pin-poveglia",
    title_th: "เกาะโปเวเกลีย (เกาะต้องสาปแห่งกาฬโรคและคนบ้า)",
    title_en: "Poveglia Island, The Cursed Quarantine Asylum",
    category: "ghost",
    province_th: "เวนิส (อิตาลี)",
    province_en: "Veneto (Italy)",
    district_th: "ลากูนเวเนเชียน ทางตอนใต้ของเวนิส",
    district_en: "Venetian Lagoon, between Venice & Lido",
    lat: 45.3824,
    lng: 12.3317,
    story_th: "เกาะปิดตายกลางทะเลสาบเวนิสที่เคยใช้เป็นสถานที่กักกันและเผาศพผู้ป่วยกาฬโรคกว่า 160,000 คน จนเถ้ากระดูกแทรกซึมไปทั่วดิน ต่อมากลายเป็นโรงพยาบาลจิตเวชที่มีเรื่องเล่าของหมอผู้ทำการทดลองสุดเหี้ยมโหด",
    story_en: "The forbidden quarantine island in the Venetian Lagoon where over 160,000 plague victims were banished to die and burned in mass pyres. Later turned into a psychiatric asylum where a sinister doctor performed gruesome experiments.",
    folklore_history_th: "ชาวประมงในเวนิสไม่กล้าทอดแหใกล้เกาะเพราะกลัวจะติดกระดูกมนุษย์ขึ้นมา และทางการอิตาลีสั่งห้ามบุคคลภายนอกขึ้นเกาะโดยเด็ดขาด เล่ากันว่าหมอผู้คุมวิญญาณกระโดดหอระฆังลงมาตายเพราะถูกวิญญาณหลอน",
    folklore_history_en: "Local fishermen refuse to cast nets near the shore for fear of snagging charred human bones. Strictly closed to the public, legend says the asylum doctor was driven mad by ghosts and threw himself from the bell tower.",
    sound_preset: "whisper",
    wikiTitle: "Poveglia",
    ytQueries: ["Poveglia Island most haunted documentary", "The dark history of Poveglia Island", "Poveglia Island plague Venice"]
  },
  {
    id: "pin-phiam",
    title_th: "ผีอำ (เงามืดทับอกและภาวะอัมพาตยามนิทรา)",
    title_en: "Phi Am (The Shadow Hag & Sleep Paralysis)",
    category: "ghost",
    province_th: "กรุงเทพมหานคร (ไทย)",
    province_en: "Bangkok (Thailand)",
    district_th: "ชุมชนเก่าแก่ริมคลองบางกอกน้อย",
    district_en: "Bangkok Noi Canal Quarters",
    lat: 13.7563,
    lng: 100.5018,
    story_th: "ปรากฏการณ์หลอนยามกึ่งหลับกึ่งตื่น ร่างกายขยับเขยื้อนไม่ได้ หายใจติดขัดราวกับมีเงามืดรูปร่างหญิงชราหรือปีศาจนั่งทับอยู่บนหน้าอก ส่งเสียงหัวเราะกระซิบข้างหู เชื่อกันว่าเกิดจากวิญญาณผีอำที่มากลั่นแกล้งหรือช่วงชิงพลังชีวิต",
    story_en: "The ancient Thai nocturnal specter that pins sleepers paralyzed in their beds. Victims awaken unable to move, feeling an agonizing pressure on their chest and seeing a shadow hag silhouette crouching in the darkness, whispering malice.",
    folklore_history_th: "คนไทยโบราณมักแก้อาถรรพ์ด้วยการนำมีดหมอ มีดหมอพก หรือผ้ายันต์วางไว้ใต้หมอน วิทยาศาสตร์การแพทย์อธิบายว่าเป็นภาวะ Sleep Paralysis ที่สมองตื่นก่อนที่กล้ามเนื้อร่างกายจะหลุดพ้นจากสภาวะหลับลึก",
    folklore_history_en: "Traditional Thai folk remedies suggest placing an exorcism blade or sacred yantra cloth beneath the pillow. Neurologists explain it as sleep paralysis where REM muscle atonia overlaps conscious awareness.",
    sound_preset: "whisper",
    wikiTitle: "Sleep_paralysis",
    ytQueries: ["ผีอำ เรื่องเล่าหลอน", "Sleep paralysis documentary science mystery", "ผีอำ สารคดี"]
  }
];

async function run() {
  console.log(`Starting Batch 150 generation for ${BATCH_150.length} new pins...`);
  const dir = path.resolve('public/entities');
  const finalPins = [];

  for (let i = 0; i < BATCH_150.length; i++) {
    const p = BATCH_150[i];
    const index = 125 + i + 1;
    console.log(`\n[${index}/150] Processing ${p.id} (${p.title_en})...`);

    // 1. Fetch artwork thumbnail
    const imgFile = `${p.id}.jpg`;
    const destPath = path.join(dir, imgFile);
    if (!fs.existsSync(destPath) || fs.statSync(destPath).size > 3000000 || fs.statSync(destPath).size < 1000) {
      await fetchWikiThumb(p.wikiTitle, destPath, path.join(dir, 'pin-dracula.jpg'));
    } else {
      console.log(` -> Image already exists: ${(fs.statSync(destPath).size / 1024).toFixed(0)} KB`);
    }

    // 2. Fetch YouTube video
    console.log(` -> Finding YouTube video for ${p.id}...`);
    const yt = await findEmbeddableVideo(p.ytQueries);
    console.log(` -> Found: ${yt.url} ("${yt.title}")`);

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

  // 3. Append to seedData.ts
  const seedPath = path.resolve('src/data/seedData.ts');
  const content = fs.readFileSync(seedPath, 'utf8');
  const startIdx = content.indexOf('export const INITIAL_GHOST_PINS: GhostPin[] = [');
  const arrayStart = content.indexOf('[', startIdx);
  const endIdx = content.lastIndexOf('];');
  const existingPins = eval(content.slice(arrayStart, endIdx + 1));

  console.log(`Existing pins count: ${existingPins.length}`);
  const combined = [...existingPins, ...finalPins];
  console.log(`New total pins count: ${combined.length}`);

  const newArrayCode = JSON.stringify(combined, null, 2);
  const updatedFile = content.slice(0, arrayStart) + newArrayCode + ';\n';
  fs.writeFileSync(seedPath, updatedFile, 'utf8');
  console.log('Successfully updated seedData.ts to 150 pins!');

  // 4. Generate SQL file
  console.log('Generating insert_batch150.sql...');
  let sql = '';
  for (const p of finalPins) {
    const esc = (s) => (s || '').replace(/'/g, "''");
    const galleryJson = esc(JSON.stringify(p.gallery_media));
    sql += `INSERT OR REPLACE INTO ghost_pins (id, title_th, title_en, category, province_th, province_en, district_th, district_en, lat, lng, story_th, story_en, folklore_history_th, folklore_history_en, image_url, sound_preset, views_count, gallery_media, is_published, created_at, updated_at) VALUES ('${p.id}', '${esc(p.title_th)}', '${esc(p.title_en)}', '${p.category}', '${esc(p.province_th)}', '${esc(p.province_en)}', '${esc(p.district_th)}', '${esc(p.district_en)}', ${p.lat}, ${p.lng}, '${esc(p.story_th)}', '${esc(p.story_en)}', '${esc(p.folklore_history_th)}', '${esc(p.folklore_history_en)}', '${p.image_url}', '${p.sound_preset}', 0, '${galleryJson}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n`;
  }
  fs.writeFileSync('../insert_batch150.sql', sql, 'utf8');
  console.log('insert_batch150.sql generated with 25 statements.');
}

run().catch(console.error);

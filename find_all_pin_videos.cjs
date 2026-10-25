const https = require('https');
const fs = require('fs');

function checkOembed(url) {
  return new Promise((resolve) => {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const req = https.get(oembedUrl, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function searchYouTube(query) {
  const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'th,en-US;q=0.9,en;q=0.8'
      }
    }, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        try {
          const match = html.match(/var ytInitialData\s*=\s*({.+?});<\/script>/);
          if (!match) return resolve([]);
          const data = JSON.parse(match[1]);
          const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
          const results = [];
          for (const item of contents) {
            const v = item.videoRenderer;
            if (v && v.videoId) {
              results.push({
                videoId: v.videoId,
                title: v.title?.runs?.[0]?.text || '',
                channel: v.ownerText?.runs?.[0]?.text || '',
                views: v.shortViewCountText?.simpleText || ''
              });
            }
          }
          resolve(results.slice(0, 6));
        } catch(e) {
          resolve([]);
        }
      });
    });
    req.on('error', () => resolve([]));
    req.setTimeout(6000, () => {
      req.destroy();
      resolve([]);
    });
  });
}

// Map custom query keywords for best Thai folklore & documentary match
const PIN_SEARCH_HINTS = {
  'pin-kuchisake': 'ตำนาน คุชิซาเกะ อนนะ สาวปากฉีก',
  'pin-lochness': 'สัตว์ประหลาดล็อกเนสส์ เนสซี point of view',
  'pin-dracula': 'ประวัติศาสตร์ แดร็กคูลา วลาดจอมเสียบ',
  'pin-wendigo': 'เวนดิโก Wendigo สัตว์ประหลาด promlao',
  'pin-chupacabra': 'ชูปาคาบรา chupacabra ปิศาจดูดเลือด promlao',
  'pin-tutankhamun': 'คำสาป ฟาโรห์ ตุตันคาเมน',
  'pin-bunyip': 'สัตว์ประหลาด บันยิป ออสเตรเลีย bunyip',
  'pin-maenak': 'แม่นากพระโขนง point of view',
  'pin-krasue': 'ตำนาน ผีกระสือ ประวัติศาสตร์',
  'pin-pop': 'อาถรรพ์ ผีปอบ กาฬสินธุ์',
  'pin-naga': 'พญานาค แม่น้ำโขง บั้งไฟพญานาค สารคดี',
  'pin-saming': 'เสือสมิง เรื่องเล่า ตำนาน',
  'pin-jiangshi': 'เจียงซือ ผีดิบจีน ตำนาน',
  'pin-baba-iva': 'แม่มด บาบายากา Baba Yaga ตำนาน',
  'pin-chudail': 'ตำนาน Chudail ผีอินเดีย',
  'pin-gevaudan': 'สัตว์ร้ายแห่งเฌโวด็อง beast of gevaudan',
  'pin-curupira': 'Curupira folklore Brazil',
  'pin-draugr': 'Draugr norse mythology undead',
  'pin-minotaur': 'ไมโนทอร์ เขาวงกต เทพนิยายกรีก',
  'pin-lorelei': 'ลอเรไล นางเงือก แม่น้ำไรน์ lorelei',
  'pin-banshee': 'แบนชี banshee วิญญาณหวีดร้อง ไอร์แลนด์',
  'pin-blackshuck': 'แบล็กชัก Black Shuck สุนัขปีศาจ',
  'pin-gumiho': 'กูมิโฮ จิ้งจอกเก้าหาง เกาหลี',
  'pin-manananggal': 'มานันนังกัล Manananggal ผีฟิลิปปินส์',
  'pin-kuntilanak': 'กุนตีลานัค Kuntilanak ผีอินโดนีเซีย',
  'pin-yeti': 'เยติ มนุษย์หิมะ สารคดี',
  'pin-ghul': 'กูล ปีศาจกินศพ Ghoul ตำนานอาหรับ',
  'pin-nightmarchers': 'Nightmarchers Hawaii legend ghost',
  'pin-anansi': 'Anansi the spider mythology',
  'pin-tokoloshe': 'Tokoloshe zulu myth South Africa',
  'pin-taniwha': 'Taniwha maori myth New Zealand',
  'pin-wawel': 'Wawel dragon smok wawelski Krakow',
  'pin-mada': 'Ma Da water ghost Vietnam ผีน้ำ เวียดนาม',
  'pin-neakta': 'Neak Ta cambodia spirit เจ้าที่ กัมพูชา',
  'pin-natpopa': 'นัต โปปา มะเดาะห์ พม่า nat mount popa',
  'pin-mosina': 'Mo sin a Taiwan mountain sprite โมซินอา',
  'pin-mahasona': 'Mahasona Sri Lanka demon ยักษ์ศรีลังกา',
  'pin-deathworm': 'หนอนมรณะ กอบี mongolian death worm',
  'pin-shahmaran': 'Shahmaran serpent queen mythology ราชินีงู',
  'pin-azzurrina': 'Azzurrina ghost castle Montebello',
  'pin-santacompana': 'Santa Compaña procession galicia ขบวนวิญญาณ',
  'pin-sasquatch': 'บิ๊กฟุต แซสควัทช์ สารคดี Bigfoot',
  'pin-trauco': 'El Trauco chiloe mythology ชิลี',
  'pin-pishtaco': 'Pishtaco andes monster ขโมยไขมัน',
  'pin-patasola': 'La Patasola colombia myth ผีสาวขาเดียว',
  'pin-pazuzu': 'ปาซูซู Pazuzu ปีศาจ บาบิโลน',
  'pin-manticore': 'แมนทิคอร์ Manticore สัตว์ในตำนาน',
  'pin-madamkoi': 'Madam Koi Koi African urban legend',
  'pin-skogsra': 'Skogsra swedish forest spirit นางไม้สวีเดน',
  'pin-huldra': 'Huldra norwegian folklore สาวหางวัว'
};

async function run() {
  const seedContent = fs.readFileSync('d:/DEV/WorldOfMys/WorldOfMis/src/data/seedData.ts', 'utf8');
  const regex = /id:\s*'(pin-[^']+)',[\s\S]*?title_th:\s*'([^']+)',[\s\S]*?title_en:\s*'([^']+)'/g;
  let match;
  const pins = [];
  while ((match = regex.exec(seedContent)) !== null) {
    pins.push({ id: match[1], title_th: match[2], title_en: match[3] });
  }

  console.log(`Found ${pins.length} pins to process.`);
  const pinVideoMap = {};

  for (let i = 0; i < pins.length; i++) {
    const pin = pins[i];
    console.log(`\n[${i + 1}/${pins.length}] Searching for: ${pin.id} (${pin.title_th})`);

    // If pin-dracula, keep the already verified one
    if (pin.id === 'pin-dracula') {
      pinVideoMap[pin.id] = {
        videoId: 'BtCjc5OwBi4',
        url: 'https://www.youtube.com/watch?v=BtCjc5OwBi4',
        title: 'Vlad the Impaler: The True Story of Dracula'
      };
      console.log(`  -> Used pre-verified: ${pinVideoMap[pin.id].title}`);
      continue;
    }

    const query = PIN_SEARCH_HINTS[pin.id] || `${pin.title_th} สารคดี ตำนาน`;
    let candidates = await searchYouTube(query);

    // If empty, fallback to English title
    if (!candidates || candidates.length === 0) {
      const fallbackQuery = `${pin.title_en} folklore legend documentary`;
      candidates = await searchYouTube(fallbackQuery);
    }

    let chosen = null;
    for (const cand of candidates) {
      const vUrl = `https://www.youtube.com/watch?v=${cand.videoId}`;
      const isOk = await checkOembed(vUrl);
      if (isOk) {
        chosen = {
          videoId: cand.videoId,
          url: vUrl,
          title: cand.title,
          channel: cand.channel
        };
        break;
      }
    }

    if (chosen) {
      pinVideoMap[pin.id] = chosen;
      console.log(`  -> MATCH: [${chosen.videoId}] ${chosen.title} (${chosen.channel})`);
    } else {
      console.log(`  -> NO VALID EMBEDDABLE VIDEO FOUND.`);
    }

    // Small delay to be courteous
    await new Promise(r => setTimeout(r, 600));
  }

  fs.writeFileSync('d:/DEV/WorldOfMys/WorldOfMis/verified_pin_videos.json', JSON.stringify(pinVideoMap, null, 2), 'utf8');
  console.log('\nFinished! Saved verified_pin_videos.json. Total populated:', Object.keys(pinVideoMap).length);
}

run();

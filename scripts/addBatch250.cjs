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

const BATCH_250 = [
  // ================= AFRICA (5) =================
  {
    id: "pin-popobawa",
    title_th: "โปโปบาวา (ปีศาจค้างคาวตาเดียวแห่งแซนซิบาร์)",
    title_en: "Popobawa: The One-Eyed Shapeshifting Bat Demon of Zanzibar",
    category: "demonic",
    province_th: "แซนซิบาร์",
    province_en: "Zanzibar",
    district_th: "เกาะเพมบา",
    district_en: "Pemba Island",
    lat: -5.2500,
    lng: 39.7500,
    story_th: "โปโปบาวา (Popobawa แปลว่า 'ปีกค้างคาว' ในภาษาสวาฮิลี) คือหนึ่งในตำนานร่วมสมัยที่ชวนขนหัวลุกที่สุดของแอฟริกาตะวันออก มันถูกพรรณนาว่าเป็นสิ่งมีชีวิตตาเดียวจำแลงกายได้ มีปีกค้างคาวขนาดยักษ์ กรงเล็บแหลมคม และมักบุกเข้าบ้านเรือนของผู้คนในความมืดมิดยามวิกาลเพื่อข่มขวัญและทำร้ายผู้ที่กำลังนอนหลับ สิ่งที่น่าสะพรึงกลัวที่สุดคือโปโปบาวาจะสั่งเหยื่อให้ประกาศเรื่องราวของมันให้ทุกคนในหมู่บ้านฟัง มิเช่นนั้นมันจะกลับมาเล่นงานอีก ทำให้ชาวบ้านบนเกาะเพมบาต่างพากันตื่นตระหนกและออกมานอนรวมกันหน้าบ้านพร้อมกองไฟเพื่อระวังภัย",
    story_en: "Popobawa ('bat-wing' in Swahili) is an infamous shapeshifting spirit and demon reported primarily on Pemba Island and Zanzibar, Tanzania. Described as possessing a single cyclopean eye, leathery bat wings, and sharp claws, it assaults residents in their homes during the dead of night. Terrorized victims are warned to recount their encounter to others or suffer repeated visits, sparking mass panics where entire villages slept outdoors around bonfires for mutual protection.",
    folklore_history_th: "บันทึกการพบเห็นโปโปบาวาเกิดขึ้นครั้งแรกบนเกาะเพมบาในช่วงทศวรรษ 1960 หรือหลังการปฏิวัติแซนซิบาร์ และกลับมาระบาดเป็นกระแสความตื่นตระหนกอีกครั้งในปี 1995 และ 2007 นักมานุษยวิทยาเชื่อว่าเป็นผลพวงจากความตึงเครียดทางสังคม การเมือง และความเชื่อเรื่องไสยศาสตร์พื้นเมืองที่ผสมผสานระหว่างความเชื่อแอฟริกันโบราณกับวิญญาณญิน (Jinn) ในศาสนาอิสลาม",
    folklore_history_en: "Popobawa panics first erupted in the 1960s following the Zanzibar Revolution, with intense resurgences in 1995 and 2007. Anthropologists classify it as mass psychogenic contagion rooted in socioeconomic stress and a syncretic blend of indigenous East African witchcraft and Islamic Jinn folklore.",
    sound_preset: "demon_growl",
    wikiCandidates: ["Popobawa", "Pemba_Island", "Stone_Town"],
    videoQuery: "Popobawa Zanzibar folklore cryptid"
  },
  {
    id: "pin-inkanyamba",
    title_th: "อินคันยัมบา (พญางูยักษ์เจ้าพายุแห่งน้ำตกฮาวิค)",
    title_en: "Inkanyamba: The Giant Storm Serpent of Howick Falls",
    category: "cryptozoology",
    province_th: "ควาซูลู-นาตาล",
    province_en: "KwaZulu-Natal",
    district_th: "น้ำตกฮาวิค",
    district_en: "Howick Falls",
    lat: -29.4894,
    lng: 30.2394,
    story_th: "ตามตำนานความเชื่อของชาวซูลูและโคซา อินคันยัมบา (Inkanyamba) คือสัตว์ประหลาดคล้ายงูยักษ์ขนาดมหึมาที่มีหัวคล้ายม้าหรือสุนัข อาศัยอยู่ในห้วงน้ำลึกใต้ฐานน้ำตกฮาวิค (Howick Falls) เชื่อกันว่าอินคันยัมบามีฤทธิ์อำนาจบงการสภาพอากาศ เมื่อใดก็ตามที่มันโกรธเกรี้ยวหรือบินทะยานขึ้นสู่อากาศเพื่อหาคู่ครอง มันจะนำพาพายุทอร์นาโด ฝนตกหนัก ฟ้าผ่า และลมกรรโชกแรงพัดทำลายบ้านเรือนรอบทะเลสาบและหุบเขา",
    story_en: "In Zulu and Xhosa legend, the Inkanyamba is a colossal aquatic serpent with the head of a horse or canine that inhabits the deep plunge pool beneath Howick Falls in KwaZulu-Natal. The creature is credited with supernatural control over seasonal tempests; when furious or taking flight into the clouds to seek a mate, it whips up catastrophic storms, tornadoes, and torrential flash floods that tear roofs from homes.",
    folklore_history_th: "ภาพเขียนสีบนหินยุคโบราณของชนเผ่าซาน (San) ในแอฟริกาใต้แสดงภาพสัตว์เลื้อยคลานขนาดยักษ์เหนือน้ำตก ซึ่งผู้เชี่ยวชาญเชื่อมโยงกับความเคารพยำเกรงในพลังธรรมชาติของสายน้ำและพายุฤดูร้อนที่รุนแรงในภูมิภาคนี้ โดยหมอผีพื้นเมืองแซงโกมา (Sangoma) จะคอยทำพิธีบูชาเพื่อไม่ให้อินคันยัมบาพิโรธ",
    folklore_history_en: "Ancient San rock art scattered throughout South Africa depicts colossal rain animals resembling horned serpents near waterfalls. Zulu Sangomas revere the plunge pool as sacred and perform propitiatory rituals to placate the water beast, viewing the legend as an embodiment of violent summer supercells.",
    sound_preset: "wind_howl",
    wikiCandidates: ["Howick_Falls", "Umgeni_River", "Drakensberg"],
    videoQuery: "Inkanyamba Howick Falls giant serpent South Africa"
  },
  {
    id: "pin-asanbosam",
    title_th: "อัสซานโบซัม (อสูรต้นไม้เท้าขอเหล็กแห่งป่าดงดิบกานา)",
    title_en: "Asanbosam: Iron-Toothed Tree Vampire of Ghana",
    category: "folklore",
    province_th: "อาชานติ",
    province_en: "Ashanti",
    district_th: "ป่าคูมาซี",
    district_en: "Kumasi Forest",
    lat: 6.6885,
    lng: -1.6244,
    story_th: "อัสซานโบซัม (Asanbosam หรือ Sasabonsam) เป็นสิ่งมีชีวิตกึ่งมนุษย์กึ่งอสูรในตำนานพื้นบ้านของชาวอาชานติแห่งประเทศกานา มันอาศัยอยู่บนยอดไม้สูงในป่าทึบ มีร่างกายปกคลุมด้วยขนหนา ฟันเหล็กแหลมคม และจุดเด่นที่สุดคือเท้าทั้งสองข้างเป็นตะขอเหล็กงอเข้าหากัน ซึ่งมันใช้เกี่ยวกิ่งไม้ห้อยหัวลงมาเหมือนค้างคาว เมื่อนายพรานหรือคนเดินทางเดินผ่านใต้ต้นไม้ อัสซานโบซัมจะใช้กรงเล็บและฟันเหล็กฉวยคว้าคอเหยื่อขึ้นไปขย้ำและดูดเลือดจนแห้ง",
    story_en: "Asanbosam (often associated with the Sasabonsam) is an iron-toothed vampire-like folkloric creature belonging to Ashanti lore in Ghana, West Africa. Dwelling in the high canopy of equatorial rainforests, it hangs upside-down from boughs using hooked iron-like feet, waiting for unwary hunters to pass beneath before swooping down to impale their throats and drain their blood.",
    folklore_history_th: "นิทานพื้นบ้านเรื่องอัสซานโบซัมถูกใช้โดยผู้อาวุโสชาวอาชานติเพื่อตักเตือนพรานป่าไม่ให้เดินทางเข้าป่าลึกเพียงลำพังยามค่ำคืน และสอนให้สังเกตรอยต่อของกิ่งไม้และสัตว์นักล่าบนเรือนยอดต้นไม้ เช่น งูเหลือมและเสือดาว",
    folklore_history_en: "Ashanti storytellers shared tales of Asanbosam to warn hunters against venturing unaccompanied into dense wilderness after dusk, serving as cultural allegories for lethal canopy predators such as leopards and pythons.",
    sound_preset: "heartbeat_slow",
    wikiCandidates: ["Asanbosam", "Ashanti_people", "Kumasi"],
    videoQuery: "Asanbosam Ghanaian folklore vampire monster"
  },
  {
    id: "pin-kongamato",
    title_th: "กองกามาโต (อสูรปีกดึกดำบรรพ์แห่งหนองน้ำจิวุนดู)",
    title_en: "Kongamato: The Pterosaur Cryptid of the Jiwundu Swamps",
    category: "cryptozoology",
    province_th: "นอร์ท-เวสเทิร์น",
    province_en: "North-Western Province",
    district_th: "บึงจิวุนดู",
    district_en: "Jiwundu Swamp",
    lat: -11.8333,
    lng: 24.6667,
    story_th: "กองกามาโต (Kongamato มีความหมายว่า 'ผู้บดขยี้เรือ') คือสัตว์ลึกลับติดปีกที่ชาวเผ่าคาวอนเด (Kaonde) ในแซมเบีย แองโกลา และคองโก เล่าขานสืบต่อกันมา มีปีกคล้ายหนังไร้ขน กว้างราว 4-7 ฟุต ปากยาวเต็มไปด้วยฟันแหลมคมคล้ายเทอโรซอร์ยุคไดโนเสาร์ มีพฤติกรรมก้าวร้าว มักโจมตีเรือแคนูของชาวประมงที่สัญจรผ่านหนองน้ำจิวุนดูจนเรือคว่ำและสังหารเหยื่ออย่างโหดเหี้ยม",
    story_en: "Kongamato ('breaker of boats' in the Kaonde tongue) is a cryptid reported from the remote swamps and rivers of north-western Zambia, Angola, and the DRC. Witnesses depict it as a featherless, bat-winged creature with a 4-to-7-foot wingspan, reddish-brown skin, and a beak studded with razor-sharp teeth strikingly reminiscent of a prehistoric pterosaur.",
    folklore_history_th: "เรื่องราวของกองกามาโตได้รับความสนใจจากชาวตะวันตกตั้งแต่ปี 1923 เมื่อนักสำรวจ แฟรงค์ เมลแลนด์ (Frank Melland) บันทึกไว้ในหนังสือ 'In Witchbound Africa' โดยเมื่อเขาโชว์ภาพวาดของสัตว์ดึกดำบรรพ์เทอโรแดกทิลให้ชาวบ้านดู ชาวเผ่าต่างชี้และยืนยันพร้อมกันว่าเป็นกองกามาโต",
    folklore_history_en: "Western interest was ignited in 1923 by explorer Frank Melland in 'In Witchbound Africa'. When Melland presented illustrations of prehistoric pterodactyls to local elders, they immediately identified the creature as the Kongamato that terrorized swamp canoeists.",
    sound_preset: "drone_dark",
    wikiCandidates: ["Kongamato", "Mwinilunga", "Pterosaur"],
    videoQuery: "Kongamato cryptid flying pterosaur Zambia"
  },
  {
    id: "pin-mamlambo",
    title_th: "มัมลัมโบ (เทพีมารแห่งสายน้ำและอสูรกลืนวิญญาณแห่งแม่น้ำเอ็มซินทลา)",
    title_en: "Mamlambo: The Brain-Draining River Goddess of Mzintlava",
    category: "folklore",
    province_th: "อีสเทิร์นเคป",
    province_en: "Eastern Cape",
    district_th: "เมาท์ไอย์ลิฟฟ์",
    district_en: "Mount Ayliff",
    lat: -30.8000,
    lng: 29.3500,
    story_th: "มัมลัมโบ (Mamlambo) ตามคติชนวิทยาของชนเผ่าซูลูและโคซา เป็นสิ่งมีชีวิตศักดิ์สิทธิ์และน่าสะพรึงกลัว มีร่างท่อนบนเป็นม้าหรือหญิงงาม และท่อนล่างเป็นงูหรือจระเข้ขนาดยักษ์ ว่ากันว่ามัมลัมโบสามารถสะกดจิตผู้คนด้วยดวงตาสีเขียวเรืองแสง ล่อลวงเหยื่อให้ลงไปในวังน้ำวนก่อนจะดูดกลืนสมองและวิญญาณ ในปี 1997 เกิดข่าวสะพัดว่ามีผู้เสียชีวิตปริศนานับสิบรายบริเวณแม่น้ำเอ็มซินทลาโดยศพมีบาดแผลกะโหลกเปิด ทำให้ผู้คนหวาดกลัวต่อการล้างแค้นของมัมลัมโบ",
    story_en: "In Zulu and Xhosa mythology, Mamlambo is revered as the 'Goddess of Rivers' yet dreaded as an aquatic carnivore that shapeshifts into an alluring woman or equine serpent. It is said to hypnotize travelers with piercing green eyes, pulling victims beneath whirlpools to feed upon their faces and brains. In 1997, panic gripped Mount Ayliff after nine decomposed corpses recovered from the Mzintlava River bore horrific cranial damage attributed to the creature.",
    folklore_history_th: "ในทางมานุษยวิทยา มัมลัมโบยังเป็นที่รู้จักในฐานะ 'เครื่องรางไสยศาสตร์' (Ukuthwala) ซึ่งเชื่อว่าบุคคลที่ทำสัญญากับมัมลัมโบจะได้ความร่ำรวยและอำนาจมหาศาล แต่ต้องแลกด้วยการสังเวยชีวิตของคนในครอบครัวทีละคนอย่างน่าเวทนา",
    folklore_history_en: "Beyond aquatic folklore, Mamlambo plays a major role in 'Ukuthwala' witchcraft traditions—a pact whereby individuals acquire wealth from the spirit in exchange for the periodic blood sacrifice of their closest relatives.",
    sound_preset: "ambient_creepy",
    wikiCandidates: ["Mamlambo", "Mount_Ayliff", "Mzintlava_River"],
    videoQuery: "Mamlambo river goddess monster South Africa"
  },

  // ================= INDIA (5) =================
  {
    id: "pin-yakshini",
    title_th: "ยักษิณี (เทพีพฤกษานารีและผู้เฝ้าขุมทรัพย์แห่งถ้ำเอลโลรา)",
    title_en: "Yakshini: The Tree Dryad and Treasure Guardian of Ellora Caves",
    category: "folklore",
    province_th: "มหาราษฏระ",
    province_en: "Maharashtra",
    district_th: "ถ้ำเอลโลรา",
    district_en: "Ellora Caves",
    lat: 20.0268,
    lng: 75.1793,
    story_th: "ยักษิณี (Yakshini) คืออมนุษย์กึ่งเทพสตรีตามความเชื่อของศาสนาฮินดู พุทธ และเชน มีรูปร่างงดงามสะคราญโฉม เปี่ยมด้วยเสน่ห์เย้ายวน และมักผูกพันกับต้นไม้ น้ำ และขุมสมบัติใต้พิภพ หากได้รับความเคารพสักการะ ยักษิณีจะประทานความอุดมสมบูรณ์ โชคลาภ และทารกแก่ผู้มีบุญ แต่หากถูกลบหลู่หรือผู้บูชาผิดคำสาบาน ยักษิณีจะกลายร่างเป็นภูตผีดูดเลือดที่ดุร้าย หลอกหลอนจนเหยื่อเสียสติหรือถึงแก่ความตาย",
    story_en: "Yakshinis are mythical female nature spirits, celestial nymphs, and guardians of subterranean earth treasures celebrated across Hindu, Buddhist, and Jain traditions. Endowed with voluptuous beauty and eternal youth, they dwell among sacred trees and sacred groves. Benevolent when reverently propitiated with offerings, they bestow fertility and riches; however, slighted or bound through forbidden occult tantric rites, they transform into wrathful seductresses.",
    folklore_history_th: "ภาพสลักหินยักษิณีที่สมบูรณ์และงดงามที่สุดแห่งหนึ่งในโลกประดิษฐานอยู่ที่ถ้ำเอลโลรา (มรดกโลก UNESCO) ซึ่งสะท้อนความเชื่อเรื่องพลังหยิน-สตรีและธรรมชาติบำบัดที่มีมานานกว่า 2,000 ปีในอนุทวีปอินเดีย",
    folklore_history_en: "Masterpiece stone reliefs of Yakshinis adorn the UNESCO World Heritage Ellora Caves in Maharashtra. Dating back over two millennia, they embody pre-Vedic tree worship and fertility cults syncretized into major classical Indian religions.",
    sound_preset: "wind_howl",
    wikiCandidates: ["Yakshini", "Ellora_Caves", "Yaksha"],
    videoQuery: "Yakshini mystery Indian mythology Ellora"
  },
  {
    id: "pin-churel",
    title_th: "ชูเรล (วิญญาณแม่มดเท้ากลับหลังแห่งลุ่มน้ำคงคา)",
    title_en: "Churel: The Backward-Footed Witch Ghost of North India",
    category: "ghost",
    province_th: "อุตตรประเทศ",
    province_en: "Uttar Pradesh",
    district_th: "ลัคเนา",
    district_en: "Lucknow",
    lat: 26.8467,
    lng: 80.9462,
    story_th: "ชูเรล (Churel หรือ Chudail) คือวิญญาณอาฆาตของสตรีที่เสียชีวิตระหว่างการคลอดบุตร ขณะตั้งครรภ์ หรือถูกครอบครัวสามีทารุณกรรมจนตาย เธอจะกลับมาในร่างของหญิงสาวรูปงามเพื่อล่อลวงผู้ชายตามป่าเปลี่ยวหรือทางแยกยามค่ำคืน แต่จุดสังเกตสำคัญที่ทำให้จับได้คือ 'เท้าทั้งสองข้างของเธอจะหันกลับหลัง' (ส้นเท้าอยู่ด้านหน้า ปลายนิ้วอยู่ด้านหลัง) เมื่อเหยื่อหลงเสน่ห์ เธอจะพาไปยังสุสาน ดูดพลังชีวิตจนเหยื่อเหี่ยวแห้งกลายเป็นคนแก่ชราข้ามคืน",
    story_en: "Churel (Chudail) is one of South Asia's most feared female vengeful specters—the ghost of a woman who perished during childbirth, pregnancy, or through severe spousal neglect. She wanders lonely roads and cremation grounds disguised as a stunning maiden, yet her true nature is betrayed by her backward-pointing feet. Once a traveling man is lured into her embrace, she drains his vital essence and youth, leaving him a decrepit husk.",
    folklore_history_th: "ตำนานชูเรลเป็นภาพสะท้อนทางสังคมในอินเดียโบราณเกี่ยวกับชะตากรรมของสตรีและความตายจากการคลอดบุตรที่สูงมากในอดีต ชุมชนมักทำพิธีตอกตะปูบนหลุมศพหรือโปรยเมล็ดมัสตาร์ดเพื่อป้องกันไม่ให้วิญญาณลุกขึ้นมากลายเป็นชูเรล",
    folklore_history_en: "The Churel myth reflects societal guilt, high maternal mortality rates, and the plight of marginalized women in historical North India. Elaborate burial rituals—such as nailing thorns beneath the deceased's feet or scattering mustard seeds—were practiced to prevent the deceased from rising as a revenant.",
    sound_preset: "whispering_ghosts",
    wikiCandidates: ["Churel", "Vampire_folklore", "Ghosts_in_Bengali_culture"],
    videoQuery: "Churel Indian ghost folklore backward feet"
  },
  {
    id: "pin-brahmarakshasa",
    title_th: "พรหมรากษส (อสูรวิญญาณพราหมณ์ผู้ทรงเวทแห่งเมืองพาราณสี)",
    title_en: "Brahmarakshasa: The Cursed Scholar-Demon of Varanasi",
    category: "demonic",
    province_th: "อุตตรประเทศ",
    province_en: "Uttar Pradesh",
    district_th: "พาราณสี",
    district_en: "Varanasi",
    lat: 25.3176,
    lng: 82.9739,
    story_th: "พรหมรากษส (Brahmarakshasa) เป็นอมนุษย์ชั้นสูงที่มีพลังอำนาจมหาศาล กำเนิดจากวิญญาณของพราหมณ์หรือนักปราชญ์ผู้เชี่ยวชาญพระเวท แต่กลับหยิ่งผยอง ใช้วิชาความรู้ในทางที่ผิด หรือหวงวิชาไม่ยอมถ่ายทอดให้ผู้อื่น เมื่อตายไปจึงไม่สามารถไปผุดไปเกิดได้ และต้องชดใช้กรรมกลายเป็นอสูรน่าสะพรึงกลัว มีดวงตาสีไฟ ร่างกายสูงตระหง่าน แต่ยังคงสวมสายธุรำ (สายสิญจน์พราหมณ์) และสามารถสวดพระเวทมนตร์ดำเพื่อลงทัณฑ์ผู้ที่บุกรุกเขตศักดิ์สิทธิ์",
    story_en: "A Brahmarakshasa is a ferocious yet intellectually formidable demon born from the soul of an elite Brahmin scholar or priest who abused sacred Vedic knowledge, practiced arrogant selfishness, or desecrated holy rituals. Bound to haunted banyan trees near temple ruins and cremation ghats, they retain encyclopedic scriptural mastery and immense psychic powers, testing travelers with occult Sanskrit riddles and devouring those who fail.",
    folklore_history_th: "ในตำราโบราณของอินเดีย พรหมรากษสถือเป็นวิญญาณที่ขับไล่ยากที่สุด เพราะมีภูมิปัญญาทางธรรมเทียบเท่าหรือเหนือกว่าพระสงฆ์ทั่วไป ต้องอาศัยพิธีกรรมศักดิ์สิทธิ์ชั้นสูงหรือการสวดคัมภีร์พระเวทบริสุทธิ์เพื่อปลดปล่อยดวงวิญญาณให้ไปสู่สุคติ",
    folklore_history_en: "Unlike ordinary restless pretas, Brahmarakshasas cannot be expelled by common exorcists because of their command over esoteric scriptures. Only enlightened sages performing specialized ancestral Vedic rites (such as Tarpana) can release them from their torment.",
    sound_preset: "demon_growl",
    wikiCandidates: ["Brahmarakshasa", "Varanasi", "Rakshasa"],
    videoQuery: "Brahmarakshasa Hindu mythology Varanasi"
  },
  {
    id: "pin-vetala",
    title_th: "เวตาล (อมนุษย์ค้างคาวผีสิงศพและปริศนาพระวิกรมาทิตย์)",
    title_en: "Vetala: The Corpse-Haunting Vampire Spirit of Ujjain",
    category: "folklore",
    province_th: "มัธยประเทศ",
    province_en: "Madhya Pradesh",
    district_th: "อุชเชน",
    district_en: "Ujjain",
    lat: 23.1765,
    lng: 75.7885,
    story_th: "เวตาล (Vetala) เป็นอมนุษย์ที่มีลักษณะคล้ายค้างคาวตัวใหญ่ ตาสีเขียวเรืองแสง อาศัยอยู่ตามป่าช้าและมักสิงสู่อยู่ในซากศพที่แขวนห้อยหัวอยู่บนต้นอโศก เวตาลมีความรู้ลึกซึ้งทั้งในอดีต ปัจจุบัน และอนาคต ตำนานที่โด่งดังที่สุดคือ 'เวตาลปัญจวีงศติ' (นิทานเวตาล 25 เรื่อง) เมื่อกษัตริย์วิกรมาทิตย์แห่งเมืองอุชเชนต้องแบกศพเวตาลผ่านความมืด โดยมีเงื่อนไขว่าห้ามตรัสคำใดๆ ออกมา แต่เวตาลกลับเล่านิทานปริศนาที่บีบให้พระองค์ต้องตอบปัญหาทางศีลธรรม จนทำให้เวตาลหัวเราะเยาะแล้วบินกลับไปเกาะที่ต้นไม้เดิมซ้ำแล้วซ้ำเล่า",
    story_en: "The Vetala is a supernatural, vampire-like entity in Indian mythology that occupies hanging cadavers in charnel grounds and cremation forests. Neither strictly living nor dead, it possesses clairvoyant foresight of past, present, and future. In the famous epic 'Baital Pachisi' (Twenty-Five Tales of the Vetala), King Vikramaditya of Ujjain is tasked with capturing a corpse inhabited by a Vetala. The spirit tells morally perplexing stories along the dark journey, continually tricking the king into breaking his vow of silence.",
    folklore_history_th: "นิทานเวตาลถือเป็นหนึ่งในวรรณกรรมวรรณคดีภาษาสันสกฤตที่ทรงคุณค่าและเก่าแก่ที่สุดในโลก แต่งขึ้นราวคริสต์ศตวรรษที่ 11 โดยโสมเทวะ ได้รับการแปลและถ่ายทอดไปสู่หลายวัฒนธรรม รวมถึงวรรณคดีไทยฉบับ น.ม.ส. ซึ่งเป็นที่นิยมอย่างแพร่หลาย",
    folklore_history_en: "The Vetala cycle stands as a pinnacle of ancient Sanskrit narrative literature, codified in the 11th-century 'Kathasaritsagara' by Somadeva. It served as a sophisticated philosophical device blending macabre gothic horror with complex ethical jurisprudence.",
    sound_preset: "whispering_ghosts",
    wikiCandidates: ["Vetala", "Baital_Pachisi", "Ujjain"],
    videoQuery: "Vetala Vikramaditya mystery folklore India"
  },
  {
    id: "pin-pichal-peri",
    title_th: "พิชาล เปรี (นางพรายหิมะเท้ากลับหลังแห่งเทือกเขาหิมาลัย)",
    title_en: "Pichal Peri: The Backward-Footed Siren of the Himalayas",
    category: "folklore",
    province_th: "จัมมูและกัศมีร์",
    province_en: "Jammu and Kashmir",
    district_th: "กุลมาร์ก",
    district_en: "Gulmarg",
    lat: 34.0484,
    lng: 74.3805,
    story_th: "พิชาล เปรี (Pichal Peri ในภาษาอูรดู/ฮินดี แปลว่า 'ผู้มีเท้าข้างหลัง') คือวิญญาณหญิงสาวลี้ลับที่สิงสถิตอยู่ตามหุบเขาและป่าสนหิมะแถบเทือกเขาหิมาลัยทางตอนเหนือของอินเดียและปากีสถาน เธอปรากฏกายในรูปของหญิงสาวหน้าตาสวยงาม ผิวขาวผ่อง ผมยาวสลวยคลุมหลังเพื่อซ่อนใบหน้าที่แท้จริง แต่จุดเด่นที่ไม่อาจซ่อนได้คือรอยเท้าบนหิมะที่ปลายนิ้วหันไปข้างหลัง เธอจะหลอกล่อนักเดินทางคนเดียวให้เดินตามเข้าไปในพายุหิมะก่อนจะเผยโฉมหน้าที่แท้จริงอันน่าเกลียดน่ากลัวและฉีกร่างเหยื่อ",
    story_en: "Pichal Peri ('backward-footed fairy') is a chilling Himalayan apparition whispered across mountainous regions of Northern India and Pakistan. Appearing on snowy passes and dense pine woods as an alluring beauty draped in white with long dark hair, she lures solo travelers into the bitter freezing cold. When inspected closely, her footprints in the snow face backward; once isolated, she reveals a twisted ghastly face and devours her prey.",
    folklore_history_th: "เรื่องเล่าขานของพิชาล เปรี เป็นคติเตือนใจแก่นักเดินทางและคนเลี้ยงสัตว์บนเทือกเขาสูงให้ระมัดระวังภาพลวงตา ความหนาวเหน็บจนเกิดอาการเพ้อ และอันตรายจากการพลัดหลงในพายุหิมะ",
    folklore_history_en: "Pichal Peri folklore functioned as an essential cautionary myth for high-altitude pastoralists, explaining hypothermia-induced delirium, hallucinations, and deadly disorientation in blinding Himalayan blizzards.",
    sound_preset: "wind_howl",
    wikiCandidates: ["Pichal_Peri", "Gulmarg", "Pir_Panjal_Range"],
    videoQuery: "Pichal Peri Himalayan ghost folklore"
  },

  // ================= CHINA (5) =================
  {
    id: "pin-baigujing",
    title_th: "ปีศาจกระดูกขาว ไป๋กู่จิง (จอมมารจำแลงสามภพแห่งเขาไป๋กู่)",
    title_en: "Baigujing: The White Bone Demon of Mount Baigu",
    category: "demonic",
    province_th: "ส่านซี",
    province_en: "Shaanxi",
    district_th: "เทือกเขาฉินหลิง",
    district_en: "Qinling Mountains",
    lat: 33.8500,
    lng: 107.8000,
    story_th: "ไป๋กู่จิง (Baigujing หรือ ปีศาจกระดูกขาว) คือหนึ่งในปีศาจที่โด่งดังที่สุดในวรรณกรรมไซอิ๋ว (Journey to the West) กำเนิดจากโครงกระดูกหญิงสาวโบราณนับพันปีที่ดูดซับไอฟ้าดินจนมีตบะแก่กล้า สามารถแปลงกายได้อย่างแนบเนียน เธอจำแลงกายถึง 3 ครั้ง—เป็นหญิงสาวไร้เดียงสา หญิงชราผู้เป็นแม่ และชายชราผู้เป็นพ่อ เพื่อหลอกล่อกินเนื้อพระถังซัมจั๋งหวังความเป็นอมตะ แม้ซุนหงอคงจะมองทะลุด้วยเนตรทองคำและตีจนวิญญาณแตกสลาย แต่ก็ทำให้พระถังซัมจั๋งเข้าใจผิดจนขับไล่หงอคงออกจากกลุ่ม",
    story_en: "Baigujing (the White Bone Demon) is one of the most cunning and iconic antagonists in the classic Chinese novel 'Journey to the West'. Originating from a thousand-year-old skeleton animated by Yin energy, she seeks to consume the flesh of Tang Sanzang for immortality. Mastering shapeshifting, she deceives the pilgrims three times—first as an innocent village girl, then as an elderly mother, and finally as an aged father—ultimately causing Tang Sanzang to wrongfully banish Sun Wukong.",
    folklore_history_th: "ตำนานไป๋กู่จิงสะท้อนแนวคิดพุทธศาสนาและเต๋าเรื่อง 'ภาพลวงตาแห่งรูปกาย' (อนิจจังและอสุภกรรมฐาน) ที่สอนว่าความงดงามภายนอกอาจซ่อนกระดูกขาวและความตายอยู่ภายใน บทละครเรื่อง 'ซุนหงอคงปราบปีศาจกระดูกขาวสามครั้ง' เป็นหนึ่งในอุปรากรจีนที่ได้รับความนิยมสูงสุดตลอดกาล",
    folklore_history_en: "The allegory of Baigujing serves as a profound Buddhist and Taoist meditation on Maya (illusion) and Asubha (the impurity of physical form). The episode 'Three Times Sun Wukong Defeats the White Bone Demon' remains an enduring staple of Chinese opera and folklore.",
    sound_preset: "drone_dark",
    wikiCandidates: ["Baigujing", "Journey_to_the_West", "Qinling"],
    videoQuery: "Baigujing White Bone Demon Journey to the West"
  },
  {
    id: "pin-qilin",
    title_th: "กิเลน (สัตว์สวรรค์เบญจธาตุและมงคลพิทักษ์แห่งเขาไท่ซาน)",
    title_en: "Qilin: The Chimeric Auspicious Beast of Mount Tai",
    category: "folklore",
    province_th: "ซานตง",
    province_en: "Shandong",
    district_th: "เขาไท่ซาน",
    district_en: "Mount Tai",
    lat: 36.2558,
    lng: 117.1064,
    story_th: "กิเลน (Qilin หรือ ฉีหลิน) เป็นหนึ่งในสี่สัตว์ศักดิ์สิทธิ์โบราณของจีน (ร่วมกับมังกร หงส์ และเต่า) มีลักษณะผสมผสานอันน่าอัศจรรย์: หัวเป็นมังกร มีเขาเดียวหรือสองเขา กีบเท้าเป็นกวาง เกล็ดคล้ายปลาคาร์ป และหางเป็นวัว กิเลนเป็นสัตว์ที่มีเมตตาธรรมสูงสุด เดินอย่างนุ่มนวลโดยไม่เหยียบยอดหญ้าหรือแมลงตัวเล็กๆ ว่ากันว่ากิเลนจะปรากฏตัวเมื่อมีกษัตริย์ผู้ทรงธรรมขึ้นครองราชย์ หรือเมื่อจะมีปราชญ์ผู้ยิ่งใหญ่ถือกำเนิด เช่น ในวันที่ขงจื๊อถือกำเนิด",
    story_en: "The Qilin (Kirin) is one of the revered Four Benevolent Animals of ancient Chinese mythology. Featuring a dragon head, deer hooves, scaly body, ox tail, and flesh-tipped horns, it embodies pure harmony and virtuous governance. So gentle that it walks upon clouds without crushing a single blade of living grass, the Qilin appears only during reigns of sublime peace or to herald the birth of a transcendent sage, such as Confucius.",
    folklore_history_th: "เขาไท่ซาน มณฑลซานตง ถือเป็นภูเขาศักดิ์สิทธิ์อันดับหนึ่งในคติจีนโบราณ ที่ซึ่งกษัตริย์ทุกราชวงศ์เสด็จมาทำพิธี 'เฟิงซาน' บวงสรวงสวรรค์และขอพรอัญเชิญกิเลนลงมาพิทักษ์บ้านเมืองให้ร่มเย็นเป็นสุข",
    folklore_history_en: "Mount Tai in Shandong is the foremost of China's Five Great Mountains, where emperors performed the Feng Shan imperial sacrifices to commune with Heaven and invite auspicious creatures like the Qilin to safeguard the empire.",
    sound_preset: "church_bell",
    wikiCandidates: ["Qilin", "Mount_Tai", "Chinese_mythology"],
    videoQuery: "Qilin mythical beast Chinese folklore Mount Tai"
  },
  {
    id: "pin-niutou-mamian",
    title_th: "หนิวโถว-หม่าเมี่ยน (ยมทูตหัววัวหน้าม้าแห่งเมืองผีเฟิงตู)",
    title_en: "Ox-Head and Horse-Face: The Underworld Guardians of Fengdu Ghost City",
    category: "demonic",
    province_th: "ฉงชิ่ง",
    province_en: "Chongqing",
    district_th: "เมืองผีเฟิงตู",
    district_en: "Fengdu Ghost City",
    lat: 29.8700,
    lng: 107.7289,
    story_th: "หนิวโถว (หัววัว) และ หม่าเมี่ยน (หน้าม้า) คือสองผู้พิทักษ์ยมโลกและยมทูตคู่แรกที่วิญญาณคนตายจะต้องเผชิญหน้าเมื่อเดินทางเข้าสู่ปรโลก (ตี้อวี้) ทั้งสองทำหน้าที่ควบคุมขบวนวิญญาณข้ามสะพานไหน่เหอ (สะพานข้ามภพ) และนำตัวคนบาปไปรับการไต่สวนต่อหน้าพญายมราชเอียนหลัวหวัง หนิวโถวถือหอกสามง่ามเหล็ก ส่วนหม่าเมี่ยนถือโซ่ตรวนและคทาหนาม ไม่มีวิญญาณร้ายใดสามารถหลบหนีสายตาและพละกำลังของทั้งคู่ไปได้",
    story_en: "Ox-Head (Niutou) and Horse-Face (Mamian) are the terrifying guardians of Diyu (the Chinese Underworld). As the vanguard commanders of King Yanluo, they apprehend newly departed souls, chain sinners with iron shackles, and escort them across the Naihe Bridge of No Return. Ox-Head brandishes a steel trident while Horse-Face carries soul-capturing ropes; no mortal ghost or malignant demon can evade their relentless judgment.",
    folklore_history_th: "เมืองผีเฟิงตู ริมฝั่งแม่น้ำแยงซีเกียง เป็นศูนย์กลางความเชื่อเรื่องนรกภูมิของจีนมากว่า 2,000 ปี บนเขามีศาลเจ้าจำลองประตูผี สะพานไหน่เหอ และรูปปั้นขนาดมหึมาของหนิวโถวและหม่าเมี่ยน ซึ่งเป็นเครื่องเตือนสติเรื่องกฎแห่งกรรม",
    folklore_history_en: "Fengdu Ghost City on the northern bank of the Yangtze River has been China's capital of necromantic folklore for over 2,000 years. Its sprawling temple complexes feature dramatic shrines to Ox-Head and Horse-Face guarding the gates of eternal judgment.",
    sound_preset: "bell_toll",
    wikiCandidates: ["Ox-Head_and_Horse-Face", "Fengdu_Ghost_City", "Diyu"],
    videoQuery: "Fengdu Ghost City Ox Head Horse Face Diyu"
  },
  {
    id: "pin-pixiu",
    title_th: "ปี่เซียะ (สัตว์สวรรค์กลืนกินทรัพย์แห่งกำแพงเมืองซีอาน)",
    title_en: "Pixiu: The Gold-Devouring Celestial Guardian of Xi'an",
    category: "folklore",
    province_th: "ส่านซี",
    province_en: "Shaanxi",
    district_th: "เมืองโบราณซีอาน",
    district_en: "Xi'an Ancient City",
    lat: 34.2655,
    lng: 108.9508,
    story_th: "ปี่เซียะ (Pixiu หรือ ผีซิว) เป็นสัตว์มงคลชั้นสูงในตำนานจีน มีลักษณะคล้ายสิงโตมีปีก หัวมังกร มีเขา กรงเล็บทรงพลัง และไม่มีรูทวาร เล่าขานกันว่าปี่เซียะทำผิดกฎสวรรค์จึงถูกเง็กเซียนฮ่องเต้ลงทัณฑ์ให้กินได้เพียงทองคำ เงิน และเพชรนิลจินดา แต่ไม่สามารถขับถ่ายออกมาได้ ทำให้ปี่เซียะกลายเป็นสัญลักษณ์สูงสุดของการ 'กักเก็บทรัพย์สิน ดูดโชคลาภ และขับไล่สิ่งอัปมงคล' โดยทหารโบราณในซีอานมักสลักปี่เซียะไว้บนธงรบเพื่อสร้างความเกรงขามและคุ้มครองกองทัพ",
    story_en: "Pixiu is a ferocious winged lion beast in Chinese tradition recognized as an auspicious wealth-attractor and evil-warding sentinel. According to myth, after violating heavenly decorum, the Jade Emperor cursed Pixiu to feed exclusively upon gold, silver, and jewels, sealing its anus so wealth could enter but never leave. Ancient armies in Chang'an (modern Xi'an) emblazoned Pixiu emblems on battle flags for spiritual invincibility.",
    folklore_history_th: "ตั้งแต่สมัยราชวงศ์ฮั่น รูปแกะสลักหินปี่เซียะขนาดใหญ่ถูกตั้งไว้หน้าสุสานหลวงและประตูวังในซีอานเพื่อทำหน้าที่พิทักษ์ดวงวิญญาณจักรพรรดิและป้องกันโจรขุดสุสาน ปัจจุบันเป็นวัตถุมงคลยอดนิยมที่ชาวจีนทั่วโลกบูชา",
    folklore_history_en: "Since the Han dynasty, monumental stone Pixiu statues were erected before imperial mausoleums and city gates in Xi'an to protect tombs against grave robbers and malevolent spirits.",
    sound_preset: "church_bell",
    wikiCandidates: ["Pixiu", "Xi'an", "Han_dynasty"],
    videoQuery: "Pixiu mythical beast Chinese fortune Xi'an"
  },
  {
    id: "pin-xuanwu",
    title_th: "เต่าดำเสวียนอู่ (เทพพิทักษ์ทิศอุดรและอสูรเต่างูแห่งเขาอู่ตัง)",
    title_en: "Xuanwu: The Black Tortoise & Snake God of Wudang Mountains",
    category: "folklore",
    province_th: "หูเป่ย์",
    province_en: "Hubei",
    district_th: "เทือกเขาอู่ตัง",
    district_en: "Mount Wudang",
    lat: 32.4000,
    lng: 111.0000,
    story_th: "เสวียนอู่ (Xuanwu หรือ เต่าดำพิทักษ์ทิศเหนือ) คือหนึ่งในสี่เทพสัตว์สวรรค์โบราณประจำทิศอุดรและธาตุน้ำ มีรูปร่างผสานระหว่างเต่ายักษ์เกราะหินและพญางูดำที่พันกระหวัดรัดร่างเต่าอย่างแยกไม่ออก ในลัทธิเต๋า เสวียนอู่ได้รับการยกย่องเป็นมหาเทพ 'เจินอู่ต้าตี้' (มหาราชเต๋าผู้พิชิตมาร) ผู้บำเพ็ญตบะบนยอดเขาอู่ตังจนสามารถแยกไส้และกระเพาะของตนออกมากลายเป็นงูและเต่า เพื่อปกป้องโลกมนุษย์จากปีศาจร้าย",
    story_en: "Xuanwu (The Black Tortoise of the North) is one of the Four Celestial Symbols and guardian of the water element in Chinese cosmology. Depicted as an ancient colossal tortoise entwined with a coiling black serpent, Xuanwu later personified the Taoist martial deity Zhenwu (True Martial Emperor). Legend holds that during decades of ascetic meditation on Mount Wudang, he severed his own stomach and intestines, which transformed into the demonic snake and tortoise he then conquered and sanctified as divine allies.",
    folklore_history_th: "เทือกเขาอู่ตังซานเป็นศูนย์กลางอันดับหนึ่งของลัทธิเต๋าและวิชากังฟูเสวียนอู่ วัดทองคำ (Golden Hall) บนยอดเขาจินติ่งสร้างขึ้นเพื่อถวายแด่เสวียนอู่ โดยมีรูปหล่อบรอนซ์ของเต่าและงูเป็นโบราณวัตถุชิ้นเอก",
    folklore_history_en: "The Wudang Mountains in Hubei stand as the global epicenter of Xuanwu Taoist worship and martial arts. The Golden Hall perched on Tianzhu Peak houses historic bronze sculptures of the entwined tortoise and snake dating to the Ming Dynasty.",
    sound_preset: "ambient_creepy",
    wikiCandidates: ["Black_Tortoise", "Wudang_Mountains", "Zhenwu_(god)"],
    videoQuery: "Xuanwu Black Tortoise Mount Wudang Chinese mythology"
  },

  // ================= MONGOLIA (5) =================
  {
    id: "pin-mongolian-death-worm",
    title_th: "หนอนมรณะแห่งมองโกเลีย (อสูรทรายพ่นกรดโอโลกอย-คอร์คอยแห่งโกบี)",
    title_en: "Mongolian Death Worm: The Acid-Spitting Sand Monster of the Gobi",
    category: "cryptozoology",
    province_th: "อุมนูโกวิ",
    province_en: "Ömnögovi",
    district_th: "ทะเลทรายโกบี",
    district_en: "Gobi Desert",
    lat: 43.5000,
    lng: 104.0000,
    story_th: "โอโลกอย-คอร์คอย (Olgoi-Khorkhoi แปลว่า 'หนอนลำไส้ใหญ่') หรือหนอนมรณะแห่งมองโกเลีย คือสัตว์ประหลาดในตำนานที่ชาวเร่ร่อนในทะเลทรายโกบีหวาดกลัวที่สุด มันถูกระบุว่าเป็นหนอนลำตัวสีแดงสดคล้ายเนื้อสด ยาวประมาณ 2-5 ฟุต ปลายทั้งสองข้างกลมมนไร้ดวงตา ซ่อนตัวอยู่ใต้ผืนทรายร้อนระอุ เมื่อมีคนหรืออูฐเข้าใกล้ มันจะโผล่ขึ้นมาพ่นกรดสีเหลืองเข้มที่กัดกร่อนโลหะจนละลายทันที หรือปล่อยกระแสไฟฟ้าแรงสูงสังหารสิ่งมีชีวิตในระยะไกลโดยไม่ต้องสัมผัสตัว",
    story_en: "The Mongolian Death Worm (known locally as Olgoi-Khorkhoi, 'large intestine worm') is a legendary desert cryptid said to haunt the harshest expanses of the southern Gobi Desert. Described as a plump, blood-red worm 2 to 5 feet long with bulbous ends and no discernible head or tail, it burrows beneath the burning dunes. Nomadic herders report that it can kill at a distance by spraying corrosive yellow venom that instantly dissolves flesh or by discharging lethal blasts of bio-electricity.",
    folklore_history_th: "เรื่องราวของหนอนมรณะถูกบันทึกเป็นลายลักษณ์อักษรสู่โลกตะวันตกโดย รอย แชปแมน แอนดรูว์ส (Roy Chapman Andrews) นักบรรพชีวินวิทยาชื่อดังจากพิพิธภัณฑ์ประวัติศาสตร์ธรรมชาติอเมริกัน ในปี 1926 โดยแม้จะยังไม่มีหลักฐานทางชีววิทยาแน่ชัด แต่ชาวมองโกลรุ่นต่อรุ่นยังคงเชื่อมั่นในการมีอยู่จริงของมัน",
    folklore_history_en: "Introduced to the Western world in 1926 by explorer Roy Chapman Andrews in 'On the Trail of Ancient Man', the Death Worm remains a cornerstone of cryptozoology. While skeptical biologists suspect misidentifications of sand boas or amphisbaenians, Gobi nomads maintain strict precautions when traversing dunes during the hottest summer months.",
    sound_preset: "wind_howl",
    wikiCandidates: ["Mongolian_death_worm", "Gobi_Desert", "Ömnögovi_Province"],
    videoQuery: "Mongolian Death Worm Gobi Desert cryptid documentary"
  },
  {
    id: "pin-almas",
    title_th: "อัลมาส (มนุษย์วานรป่าหิมะดึกดำบรรพ์แห่งเทือกเขาอัลไต)",
    title_en: "Almas: The Relic Wild Hominid of the Altai Mountains",
    category: "cryptozoology",
    province_th: "บายัน-เอิลกีย์",
    province_en: "Bayan-Ölgii",
    district_th: "เทือกเขาอัลไต",
    district_en: "Altai Mountains",
    lat: 48.0000,
    lng: 89.5000,
    story_th: "อัลมาส (Almas ในภาษามองโกเลียแปลว่า 'คนป่า') คือสัตว์ลึกลับกึ่งมนุษย์กึ่งวานรที่ถูกพบเห็นตามเทือกเขาอัลไตและที่ราบสูงในเอเชียกลาง มันมีขนสีน้ำตาลแดงหนาปกคลุมทั่วตัว โครงหน้าแบน โหนกคิ้วยื่น เดินสองขาหลังตรง ร่างกายกำยำคล่องแคล่ว มีพฤติกรรมรักสันโดษและออกหากินยามค่ำคืน ชาวเผ่ามองโกลและคาซัคเชื่อว่าอัลมาสคือเผ่าพันธุ์มนุษย์โบราณที่รอดพ้นจากการสูญพันธุ์และซ่อนตัวอยู่ในหุบเขาลึก",
    story_en: "The Almas ('wild man' in Mongolian) is a relict hominid cryptid documented across the rugged Altai Mountains and Central Asian steppe. Covered in coarse reddish-brown fur with a muscular bipedal gait, pronounced brow ridges, and flat facial features, it resembles surviving populations of Neanderthals or archaic humans. Nomadic horsemen report sightings of Almas fleeing through mountain passes, communicating through guttural whistling.",
    folklore_history_th: "ตำราแพทย์ทิเบตโบราณในศตวรรษที่ 19 มีภาพวาดทางสัตววิทยาของอัลมาสร่วมกับสัตว์เลี้ยงลูกด้วยนมชนิดอื่นๆ ในท้องถิ่น นักมานุษยวิทยาหลายคนเสนอสมมติฐานว่ารายงานการพบเห็นอัลมาสอาจเป็นประชากรที่หลงเหลือของโฮโม นีแอนเดอร์ทัลเลนซิส หรือ เดนิโซวา (Denisovans)",
    folklore_history_en: "Anatomical drawings of the Almas appeared in 19th-century Tibetan pharmacology treatises alongside native fauna. Prominent cryptozoologists and anthropologists theorized that Almas lore stems from surviving isolated pockets of Neanderthals or Denisovans persisting into early historic times.",
    sound_preset: "drone_dark",
    wikiCandidates: ["Almas_(cryptozoology)", "Altai_Mountains", "Bayan-Ölgii_Province"],
    videoQuery: "Almas Mongolia wild man cryptid Altai mountains"
  },
  {
    id: "pin-burte-chino",
    title_th: "เบอร์เต ชิโน และโกอา มารัล (หมาป่าสีน้ำเงินบรรพบุรุษชาวมองโกลแห่งยอดเขาเบอร์คาน)",
    title_en: "Burte Chino & Goa Maral: The Celestial Blue Wolf of Burkhan Khaldun",
    category: "folklore",
    province_th: "เคนตี",
    province_en: "Khentii",
    district_th: "เทือกเขาเบอร์คาน คาลดุน",
    district_en: "Burkhan Khaldun",
    lat: 48.7500,
    lng: 109.0500,
    story_th: "ตามพงศาวดารลับของชาวมองโกล (The Secret History of the Mongols) ต้นกำเนิดของเจงกิสข่านและชนชาติมองโกลสืบเชื้อสายมาจาก 'เบอร์เต ชิโน' (หมาป่าสีน้ำเงินอมเทาแห่งสวรรค์) และคู่ครองของเขา 'โกอา มารัล' (แม่กวางสีขาวนวล) ทั้งสองเดินทางข้ามทะเลสาบสาบไบคัลและมาตั้งรกรากบริเวณต้นกำเนิดแม่น้ำโอนอน ใต้ร่มเงาของยอดเขาศักดิ์สิทธิ์เบอร์คาน คาลดุน หมาป่าสีน้ำเงินเป็นสัญลักษณ์แห่งความกล้าหาญ สัญชาตญาณนักรบ และพระประสงค์ของเต็งกรี (Tengri - ท้องฟ้าสวรรค์)",
    story_en: "According to 'The Secret History of the Mongols', the legendary progenitor of Genghis Khan and the nomadic Mongol tribes was Burte Chino ('Blue-Grey Wolf of Heaven') and his mate Goa Maral ('Fallow Doe'). Destined by Tengri (the Eternal Sky), they crossed the inland sea of Baikal and settled at the headwaters of the Onon River beneath the sacred peak of Burkhan Khaldun, establishing the lineage of the Golden Horde.",
    folklore_history_th: "ยอดเขาเบอร์คาน คาลดุน ได้รับการขึ้นทะเบียนเป็นมรดกโลก UNESCO และเป็นสถานที่ศักดิ์สิทธิ์สูงสุดของมองโกเลีย เชื่อกันว่าเป็นสถานที่ซึ่งเจงกิสข่านเคยหลบภัยและทำพิธีบวงสรวงต่อฟ้าสวรรค์ และอาจเป็นสถานที่ฝังพระศพอันลึกลับที่ไม่มีใครค้นพบจนถึงปัจจุบัน",
    folklore_history_en: "Burkhan Khaldun is a UNESCO World Heritage site and Mongolia's most sacred mountain. Genghis Khan attributed his survival and conquests to prayers offered on its forested slopes; it remains the most probable hidden location of his fabled lost tomb.",
    sound_preset: "wind_howl",
    wikiCandidates: ["Burkhan_Khaldun", "The_Secret_History_of_the_Mongols", "Mongol_mythology"],
    videoQuery: "Burte Chino Secret History Mongols Burkhan Khaldun"
  },
  {
    id: "pin-tsagaan-ebugen",
    title_th: "ซากาน เอวูเกน (ผู้เฒ่าขาว เทพเจ้าแห่งผืนแผ่นดินและอายุวัฒนะ)",
    title_en: "Tsagaan Ebugen: The White Old Man of the Steppe",
    category: "folklore",
    province_th: "อูลานบาตอร์",
    province_en: "Ulaanbaatar",
    district_th: "วัดกันดันเต็กเชนลิง",
    district_en: "Gandantegchinlen Monastery",
    lat: 47.9239,
    lng: 106.8953,
    story_th: "ซากาน เอวูเกน (Tsagaan Ebugen หรือ White Old Man) คือหนึ่งในเทพเจ้าที่ได้รับความเคารพนับถือสูงสุดในวัฒนธรรมชาแมนิซึมและพุทธศาสนาแบบมองโกเลีย ปรากฏกายในร่างของชายชราเครายาวสีขาว สวมชุดคลุมขาว ถือไม้เท้าที่มีหัวเป็นมังกร และขวดน้ำทิพย์แห่งอายุวัฒนะ พระองค์เป็นเจ้าแห่งผืนดิน ภูเขา สัตว์ป่า และความอุดมสมบูรณ์ ผู้คอยคุ้มครองฝูงสัตว์ของคนเร่ร่อนจากพายุหิมะซูด (Dzud) และขับไล่วิญญาณชั่วร้าย",
    story_en: "Tsagaan Ebugen ('The White Old Man') is a primordial earth and fertility deity venerated across Mongolian shamanism and Vajrayana Buddhism. Depicted as an ancient sage with a flowing white beard, holding a dragon-headed gnarled staff and longevity elixir, he presides over the steppe, wildlife, and herds. In the sacred Cham masked dance festivals, he appears as a comical yet deeply benevolent patron dispelling misfortune and brutal winter dzuds.",
    folklore_history_th: "ในระบำหน้ากากศักดิ์สิทธิ์ 'ชาม' (Tsam Dance) ที่วัดกันดันในอูลานบาตอร์ ซากาน เอวูเกน เป็นตัวละครเอกที่สร้างความสนุกสนานและประทานพรอันศักดิ์สิทธิ์แก่ผู้ชม ซึ่งเป็นการผสมผสานอย่างลงตัวระหว่างความเชื่อบรรพบุรุษก่อนพุทธศาสนาและวัชรยานทิเบต",
    folklore_history_en: "During the ancient Tsam mystery dances at Gandantegchinlen Monastery, the White Old Man is the central figure who bestows blessings of fecundity and peace, seamlessly bridging pre-Buddhist Tengrist animism with Tibetan Lamaism.",
    sound_preset: "bell_toll",
    wikiCandidates: ["White_Old_Man", "Gandantegchinlen_Monastery", "Buddhism_in_Mongolia"],
    videoQuery: "Tsagaan Ebugen White Old Man Mongolian Cham dance"
  },
  {
    id: "pin-erlik-khan",
    title_th: "เออร์ลิก ข่าน (พญายมราชและเจ้าแห่งความมืดใต้พิภพตามคติเต็งกรี)",
    title_en: "Erlik Khan: The Underworld Sovereign of Siberian & Mongolian Shamanism",
    category: "demonic",
    province_th: "อูเวอร์คังไก",
    province_en: "Övörkhangai",
    district_th: "หุบเขาออร์คอน",
    district_en: "Orkhon Valley",
    lat: 47.5500,
    lng: 102.8333,
    story_th: "เออร์ลิก ข่าน (Erlik Khan) คือเทพเจ้าแห่งโลกใต้พิภพ ความตาย และความมืดตามความเชื่อลัทธิเต็งกรี (Tengrism) และชาแมนของชาวมองโกลและเตอร์กิกโบราณ เล่ากันว่าเออร์ลิกเคยเป็นผู้ร่วมสร้างโลกกับพระบิดาสวรรค์ (คูดาย) แต่ด้วยความทะเยอทะยานและหลงผิด จึงถูกเนรเทศลงสู่ชั้นใต้พิภพชั้นที่เก้า พระองค์ประทับบนบัลลังก์เหล็กสีดำในวังหมอกหนาว ขี่วัวกระทิงสีดำไร้หาง และคอยส่งปีศาจแห่งโรคร้ายขึ้นมาพรากวิญญาณมนุษย์ลงไปลงทัณฑ์",
    story_en: "Erlik Khan is the formidable ruler of the underworld, death, and judge of souls in ancient Tengrist and Siberian-Mongolian shamanism. Originally a co-creator of humanity alongside the supreme celestial deity, Erlik fell from grace due to boundless pride and was banished to the ninth stratum beneath the earth. Seated upon a black iron throne in a dark palace of tears, riding a tailless black bull, he dispatches malevolent spirits to inflict plagues upon mortals.",
    folklore_history_th: "หมอผีชาแมนชาวมองโกลและอัลไตโบราณจะทำพิธีกรรม 'คามลานิเย' (Kamlanie) เพื่อเดินทางลงสู่โลกวิญญาณใต้พิภพ ต่อรองและถวายเครื่องเซ่นไหว้วัวดำแก่เออร์ลิก ข่าน เพื่อไถ่วิญญาณของผู้ป่วยให้รอดพ้นจากความตาย",
    folklore_history_en: "Altai and Mongolian shamans performed perilous trance journeys (Kamlanie) descending through the spiritual subterranean realms to negotiate with Erlik Khan, sacrificing black livestock to redeem stolen souls of the sick.",
    sound_preset: "demon_growl",
    wikiCandidates: ["Erlik", "Tengrism", "Orkhon_Valley"],
    videoQuery: "Erlik Khan Tengrism myth ruler underworld Mongolia"
  },

  // ================= RUSSIA (5) =================
  {
    id: "pin-domovoy",
    title_th: "โดโมวอย (ผีผู้พิทักษ์เตาผิงและเคหาสน์แห่งสลาฟโบราณ)",
    title_en: "Domovoy: The Hearth and Household Spirit of Russian Lore",
    category: "folklore",
    province_th: "มอสโก",
    province_en: "Moscow",
    district_th: "เขตเครมลิน",
    district_en: "Moscow Kremlin",
    lat: 55.7520,
    lng: 37.6175,
    story_th: "โดโมวอย (Domovoy จากคำว่า 'Dom' แปลว่า บ้าน) คือวิญญาณบรรพบุรุษผู้พิทักษ์บ้านเรือนและครอบครัวในคติชนวิทยาของรัสเซีย มีรูปร่างเป็นชายชราตัวเล็ก ร่างกายปกคลุมด้วยขนสีเทาหนานุ่ม มีเครายาวจรดเท้า มักอาศัยอยู่ใต้เตาผิงรัสเซีย (Pechka) หรือมุมมืดในห้องใต้หลังคา หากครอบครัวดูแลบ้านให้สะอาดและตั้งขนมปังกับนมถวาย โดโมวอยจะช่วยเฝ้าบ้าน ปัดเป่าโจร และนำโชคลาภมาให้ แต่หากคนในบ้านทะเลาะกัน โดโมวอยจะแกล้งทำจานแตก ซ่อนกุญแจ และส่งเสียงดังยามค่ำคืน",
    story_en: "The Domovoy (from 'dom', home) is the revered ancestral household guardian spirit of Slavic and Russian folklore. Manifesting as an diminutive, hirsute old man with glowing eyes and a long beard reaching his toes, he lives behind the traditional Russian stove (pechka) or under the threshold. When respected with offerings of bread, salt, and milk, the Domovoy protects livestock, warns of fires, and blesses the family; neglect him, and he hurls dishes and suffocates sleepers in petty spite.",
    folklore_history_th: "แม้ในรัสเซียยุคปัจจุบัน เมื่อผู้คนย้ายบ้านใหม่ พวกเขายังคงทำตามประเพณีโบราณด้วยการเชื้อเชิญโดโมวอยให้นั่งในรองเท้าบูทเก่าหรือตะกร้า เพื่อนำวิญญาณผู้พิทักษ์ติดตามไปยังบ้านหลังใหม่ด้วย",
    folklore_history_en: "A fixture of Russian domestic tradition for over a millennium, families moving into new dwellings still perform the ritual of inviting their Domovoy along, often leaving a worn bast shoe or loaf of rye bread on the hearth.",
    sound_preset: "whispering_ghosts",
    wikiCandidates: ["Domovoy", "Moscow_Kremlin", "Slavic_paganism"],
    videoQuery: "Domovoy Slavic folklore Russian house spirit"
  },
  {
    id: "pin-rusalka",
    title_th: "รูซัลกา (พรายน้ำเสน่หาและวิญญาณแห่งทะเลสาบไบคัล)",
    title_en: "Rusalka: The Tragic Water Siren of Lake Baikal",
    category: "ghost",
    province_th: "อีร์คุตสค์",
    province_en: "Irkutsk Oblast",
    district_th: "ทะเลสาบไบคัล",
    district_en: "Lake Baikal",
    lat: 53.5000,
    lng: 108.0000,
    story_th: "รูซัลกา (Rusalka) คือวิญญาณพรายน้ำสาวงามในตำนานสลาฟและรัสเซีย เกิดจากดวงวิญญาณของหญิงสาวที่จบชีวิตในน้ำจากความรักที่ไม่สมหวัง หรือสตรีที่ถูกทอดทิ้ง รูซัลกามีผมสีเขียวหรือสีเงินยาวสลวย ผิวซีดขาวราวกับแสงจันทร์ ในช่วงสัปดาห์รูซัลกา (Rusalka Week) ช่วงต้นฤดูร้อน พวกเธอจะขึ้นมาจากก้นบึ้งของทะเลสาบไบคัล นั่งบนกิ่งต้นหลิว ร้องเพลงไพเราะสะกดจิตล่อลวงชายหนุ่มที่เดินผ่าน แล้วดึงลงไปสู่ความหนาวเหน็บใต้ผิวน้ำเพื่อจมน้ำตาย",
    story_en: "A Rusalka is a haunting, translucent water nymph of Slavic folklore, originating from the restless soul of a young woman who drowned as a result of betrayal or suicide. Possessing long shimmering green hair that must never fully dry, pale skin, and mesmerizing singing voices, they inhabit deep lakes like Baikal. During 'Rusalka Week' (Rusalnaya), they leave the icy depths to swing from birch branches, bewitching unwary travelers with laughter and dragging them to watery graves.",
    folklore_history_th: "สัปดาห์รูซัลกาเป็นเทศกาลนอกรีตเก่าแก่ก่อนการเข้ามาของศาสนาคริสต์ โดยชาวบ้านจะงดว่ายน้ำหรือซักผ้าในแม่น้ำ และนำหญ้าบอระเพ็ด (Wormwood) พกติดตัวเพื่อป้องกันมนต์สะกดของพรายน้ำ",
    folklore_history_en: "Rusalnaya Week remains a significant pagan agricultural festival in Slavic culture; swimming is strictly forbidden, and villagers carry sprigs of pungent wormwood to shatter the enchantresses' lethal hypnosis.",
    sound_preset: "wind_howl",
    wikiCandidates: ["Rusalka", "Lake_Baikal", "Slavic_mythology"],
    videoQuery: "Rusalka Slavic folklore water spirit Lake Baikal"
  },
  {
    id: "pin-leshy",
    title_th: "เลชี (เจ้าป่าไทกาจำแลงร่างแห่งไซบีเรีย)",
    title_en: "Leshy: The Shapeshifting Forest Lord of the Siberian Taiga",
    category: "folklore",
    province_th: "ครัสโนยาสค์",
    province_en: "Krasnoyarsk Krai",
    district_th: "ป่าไทกาไซบีเรีย",
    district_en: "Siberian Taiga",
    lat: 58.0000,
    lng: 93.0000,
    story_th: "เลชี (Leshy จากคำว่า 'Les' แปลว่า ป่า) คือเทพเจ้าผู้ปกครองผืนป่า สิงสาราสัตว์ และพฤกษาในตำนานรัสเซีย เลชีมีความสามารถในการเปลี่ยนขนาดร่างกายได้อย่างน่าอัศจรรย์: เมื่ออยู่ในป่าลึก เขาสามารถยืดตัวสูงเท่าต้นสนยักษ์ แต่เมื่อก้าวออกมาที่ทุ่งหญ้า เขาจะหดตัวลงจนเล็กเท่าใบหญ้า เลชีมีเคราเป็นมอสสีเขียว รอยเท้าไม่ทิ้งร่องรอย และชอบกลั่นแกล้งนักเดินทางให้หลงทางในป่าไทกาด้วยการปลอมเสียงเพื่อน เลียนแบบเสียงนก หรือทำให้เข็มทิศหมุนวน",
    story_en: "The Leshy (from 'les', forest) is the supreme tutelary spirit and lord of the woods, trees, and wild beasts in Russian folklore. Master of shapeshifting, his height matches the canopy when striding through old-growth taiga, but shrinks to the size of a blade of grass at the forest's edge. Sporting a wild beard woven from lichen and moss, he plays malicious tricks on hunters—mimicking voices of lost companions, swapping trail markers, and leading travelers in endless circles.",
    folklore_history_th: "ชาวรัสเซียโบราณมีวิธีแก้ทางเลชีเมื่อหลงป่า คือการถอดเสื้อผ้าแล้วใส่กลับด้าน (เอาด้านในออกข้างนอก) หรือสลับรองเท้าซ้าย-ขวา ซึ่งเชื่อว่าจะทำให้มนต์สะกดของเจ้าป่าเสื่อมลงและมองเห็นทางออก",
    folklore_history_en: "To break a Leshy's disorientation spell, traditional Russian woodsmen turned their clothes inside-out and swapped their boots to the opposite feet, an inverted sympathetic magic ritual that broke the forest spirit's illusion.",
    sound_preset: "wind_howl",
    wikiCandidates: ["Leshy", "Taiga", "Slavic_dragon"],
    videoQuery: "Leshy Slavic folklore forest spirit Siberian taiga"
  },
  {
    id: "pin-koschei",
    title_th: "คอสเช ผู้ไม่มีวันตาย (จอมเวทย์อมตะแห่งเกาะลึกลับบูยาน)",
    title_en: "Koschei the Deathless: The Undying Sorcerer of Buyan Island",
    category: "folklore",
    province_th: "เลนินกราด",
    province_en: "Leningrad Oblast",
    district_th: "เกาะบูยานในตำนาน",
    district_en: "Mythical Buyan Island",
    lat: 60.0000,
    lng: 29.5000,
    story_th: "คอสเช ผู้ไม่มีวันตาย (Koschei the Deathless) คือจอมเวทย์มนตร์ดำและอสูรผู้เป็นอมตะที่ยิ่งใหญ่ที่สุดในเทพนิยายรัสเซีย มีร่างกายสูงผอมแห้งคล้ายโครงกระดูกเดินได้ เขาไม่สามารถถูกสังหารด้วยอาวุธใดๆ เพราะเขาได้แยกวิญญาณ (ความตาย) ของตนออกมาซ่อนไว้อย่างซับซ้อน: 'ความตายของคอสเชอยู่ที่ปลายเข็ม เข็มอยู่ในไข่ ไข่อยู่ในท้องเป็ด เป็ดอยู่ในท้องกระต่าย กระต่ายถูกขังในหีบเหล็ก หีบเหล็กถูกฝังไว้ใต้ต้นโอ๊กยักษ์บนเกาะบูยานกลางมหาสมุทร' หากมีผู้ใดหักปลายเข็มเล่มนั้นได้ คอสเชจึงจะสิ้นชีพลง",
    story_en: "Koschei the Deathless (Bessmertny) is Russian folklore's most iconic necromancer and arch-sorcerer. Emaciated and skeletal yet possessing terrifying superhuman might, he is indestructible by mundane weapons because his mortality was surgically excised and concealed in a nested riddle: 'His death is on the tip of a needle, the needle is hidden in an egg, the egg in a duck, the duck in a hare, the hare locked in an iron chest buried beneath an ancient oak on the phantom island of Buyan.' Only snapping the needle shatters his immortality.",
    folklore_history_th: "แนวคิดการซ่อนวิญญาณภายนอกร่างกายของคอสเช (External Soul) มีอิทธิพลอย่างมหาศาลต่อวรรณกรรมแฟนตาซีทั่วโลก รวมถึงแนวคิดเรื่อง 'ฮอร์ครักซ์' (Horcrux) ในแฮร์รี่ พอตเตอร์ และ 'แหวนเอก' ในเดอะลอร์ดออฟเดอะริงส์",
    folklore_history_en: "Koschei embodies the archetypal folkloric motif of the 'external soul' (motifs E710 in folklore indexes), directly inspiring modern fantasy tropes of horcruxes, liches, and phylacteries from Harry Potter to Dungeons & Dragons.",
    sound_preset: "drone_dark",
    wikiCandidates: ["Koschei", "Buyan", "Russian_fairy_tale"],
    videoQuery: "Koschei the Deathless Russian fairytale mythology"
  },
  {
    id: "pin-zmey-gorynych",
    title_th: "ซเมย์ โกรือนึช (พญามังกรสามหัวพ่นไฟแห่งเทือกเขาคอเคซัส)",
    title_en: "Zmey Gorynych: The Three-Headed Fire Dragon of the Caucasus",
    category: "folklore",
    province_th: "คาบาร์ดีโน-บัลคาเรีย",
    province_en: "Kabardino-Balkaria",
    district_th: "เทือกเขาเอลบรุส",
    district_en: "Mount Elbrus",
    lat: 43.3550,
    lng: 42.4392,
    story_th: "ซเมย์ โกรือนึช (Zmey Gorynych แปลว่า 'บุตรแห่งภูเขา') คือมังกรสามหัวพ่นไฟที่น่าสะพรึงกลัวที่สุดในมหากาพย์วีรบุรุษโบราณของรัสเซีย (Bylina) มีเกล็ดสีเขียวมรกตหนาเตอะ ปีกกว้างบดบังแสงอาทิตย์ กรงเล็บทองแดง และมีสามหัวที่สามารถพ่นเปลวไฟและควันพิษออกมาได้พร้อมกัน เมื่อหัวใดหัวหนึ่งถูกตัดออก มันจะสามารถงอกใหม่ได้ทันที เว้นแต่วีรบุรุษโบกาตีร์ (Bogatyr) ผู้กล้าหาญอย่างโดบรินยา นิกิติจ (Dobrynya Nikitich) จะใช้คทาศักดิ์สิทธิ์และคาถาสยบลงได้",
    story_en: "Zmey Gorynych ('Dragon Son of the Mountain') is the formidable three-headed fire-breathing dragon of Russian heroic bylina legends. Boasting emerald scales, leathery bat wings that blot out the midday sun, and copper claws, all three heads breathe sulfurous hellfire simultaneously. If decapitated, its severed heads miraculously regenerate unless all three are severed simultaneously by a holy bogatyr champion like Dobrynya Nikitich.",
    folklore_history_th: "เรื่องราวการปราบมังกรซเมย์ โกรือนึช เป็นสัญลักษณ์แห่งการต่อสู้เพื่อปกป้องมาตุภูมิของชาวเคียฟสกายารุสและรัสเซียโบราณจากการรุกรานของชนเผ่าเร่ร่อนและภัยพิบัติทางธรรมชาติ โดยปัจจุบันมีรูปปั้นบรอนซ์ยักษ์ของซเมย์ โกรือนึช พ่นไฟได้จริงตั้งอยู่ที่อุทยานคูดิคินากอราในรัสเซีย",
    folklore_history_en: "Zmey Gorynych personified existential geopolitical threats, nomadic invasions, and untamable natural disasters faced by Kievan Rus. A colossal 15-meter operational fire-breathing statue of Zmey Gorynych stands today as an iconic cultural landmark in Kudykina Gora safari park, Russia.",
    sound_preset: "demon_growl",
    wikiCandidates: ["Zmey_Gorynych", "Slavic_dragon", "Mount_Elbrus"],
    videoQuery: "Zmey Gorynych Russian three headed dragon folklore"
  }
];

async function run() {
  console.log('Starting Batch 250 (25 new pins for Africa, India, China, Mongolia, Russia)...');
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

  for (let i = 0; i < BATCH_250.length; i++) {
    const p = BATCH_250[i];
    console.log(`[${i + 1}/${BATCH_250.length}] Processing ${p.id} (${p.title_th})...`);

    const imgFile = `${p.id}.jpg`;
    const destPath = path.join(entitiesDir, imgFile);

    // Download unique wiki thumb
    const downloaded = await fetchWikiThumb(p.wikiCandidates, destPath, existingHashes);
    if (!downloaded) {
      console.log(` -> Warning: Could not find unique wiki thumb for ${p.id}, trying fallback search...`);
      for (const query of [p.province_en, p.district_en, 'Mythology', 'Asia', 'Africa']) {
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

import type { GhostPin } from '../types/ghost';

export const INITIAL_GHOST_PINS: GhostPin[] = [
  // --- JAPAN & EAST ASIA ---
  {
    id: 'pin-kuchisake',
    title_th: 'คุชิซาเกะ-อนนะ (สาวปากฉีก)',
    title_en: 'Kuchisake-onna (Slit-Mouthed Woman)',
    category: 'ghost',
    province_th: 'โตเกียว (ญี่ปุ่น)',
    province_en: 'Tokyo (Japan)',
    district_th: 'ชินจูกุ',
    district_en: 'Shinjuku',
    lat: 35.6938,
    lng: 139.7034,
    story_th:
      'ตำนานเมืองชื่อดังแห่งญี่ปุ่น "คุชิซาเกะ-อนนะ" หรือหญิงสาวปากฉีก เธอจะสวมหน้ากากอนามัยสีขาวและเสื้อโค้ตตัวยาว เดินดักรอผู้คนในตรอกซอกซอยยามค่ำคืน เมื่อพบเหยื่อเธอจะเอ่ยถามด้วยน้ำเสียงเย็นยะเยือก "ฉันสวยไหม?" หากเหยื่อตอบว่าไม่ เธอจะใช้กรรไกรเล่มใหญ่สังหารทิ้งทันที แต่หากตอบว่าสวย เธอจะปลดหน้ากากออก เผยให้เห็นรอยแผลฉีกกว้างจากหูถึงหู แล้วถามซ้ำว่า "แม้ในสภาพนี้ ฉันยังสวยอยู่ไหม?"',
    story_en:
      'A terrifying Japanese urban legend of the Slit-Mouthed Woman. Lurking in misty dusk alleyways wearing a surgical mask and trench coat, she corners solitary wanderers with a chilling question: "Am I beautiful?" If you say no, she slashes with giant shears. If you say yes, she peels back her mask to reveal a gruesome ear-to-ear grin and asks: "Even now?"',
    folklore_history_th:
      'เริ่มแพร่สะพัดอย่างกว้างขวางในจังหวัดกิฟุและขยายสู่โตเกียวในปี ค.ศ. 1979 ก่อให้เกิดความตระหนกตกใจจนโรงเรียนหลายแห่งต้องให้ครูเดินไปส่งนักเรียนเป็นกลุ่ม บ้างเชื่อว่ามีรากเหง้ามาจากเรื่องเล่าของหญิงงามยุคเอโดะที่ถูกสามีหึงหวงลงโทษด้วยการกรีดปาก',
    folklore_history_en:
      'Swept across Japan in the late 1970s, causing widespread moral panic and police patrols around elementary schools. Some folklorists trace its lineage back to Edo-period tales of a samurai’s unfaithful wife mutilated in jealousy.',
    image_url: '/entities/pin-kuchisake.jpg',
    sound_preset: 'whisper',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-kuchisake.jpg",
            "title": "คุชิซาเกะ-อนนะ (สาวปากฉีก)"
      }
],
    is_published: 1,
  },

  // --- EUROPE & UK ---
  {
    id: 'pin-lochness',
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-lochness.jpg",
            "title": "สัตว์ประหลาดล็อกเนสส์ (เนสซี)"
      }
],
    title_th: 'สัตว์ประหลาดล็อกเนสส์ (เนสซี)',
    title_en: 'Loch Ness Monster (Nessie)',
    category: 'monster',
    province_th: 'ไฮแลนด์ (สกอตแลนด์)',
    province_en: 'Highlands (Scotland, UK)',
    district_th: 'อินเวอร์เนสส์',
    district_en: 'Inverness',
    lat: 57.3229,
    lng: -4.4244,
    story_th:
      'อสูรโบราณใต้ผืนน้ำสีดำสนิทของทะเลสาบล็อกเนสส์ สกอตแลนด์ มีลักษณะคล้ายสัตว์เลื้อยคลานยุคดึกดำบรรพ์เพลซิโอซอร์ คอยาวและหลังเป็นลอนคลื่น โผล่ขึ้นมาเหนือน้ำท่ามกลางม่านหมอกหนาวเย็น ก่อนจะดำดิ่งหายวับลงสู่ความลึกกว่า 230 เมตรอย่างไร้ร่องรอย',
    story_en:
      'The immortal aquatic cryptid inhabiting the peaty, pitch-black waters of Loch Ness in the Scottish Highlands. Eyewitnesses describe a long serpent-like neck, dark humps breaking the surface mist, and sudden plunges into depths exceeding 230 meters.',
    folklore_history_th:
      'การพบเห็นครั้งแรกสุดถูกบันทึกไว้ในชีวประวัติของนักบุญโคลัมบา (Saint Columba) เมื่อศตวรรษที่ 6 ก่อนที่ภาพถ่ายชื่อดัง "Surgeon’s Photograph" ในปี 1934 จะทำให้เนสซีกลายเป็นปริศนาสิ่งมีชีวิตลี้ลับระดับโลก',
    folklore_history_en:
      'First chronicled in Adomnán’s 6th-century Life of Saint Columba. The legend exploded into a worldwide phenomenon following the controversial 1934 "Surgeon\'s Photograph".',
    image_url: '/entities/pin-lochness.jpg',
    sound_preset: 'water_spirit',
    views_count: 3120,
    is_published: 1,
  },
  {
    id: 'pin-dracula',
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-dracula.jpg",
            "title": "เคานต์แดร็กคูลาแห่งทรานซิลเวเนีย"
      },
      {
            "type": "youtube",
            "url": "https://www.youtube.com/watch?v=BtCjc5OwBi4",
            "title": "สารคดีและตำนานลี้ลับ (เคานต์แดร็กคูลาแห่งทรานซิลเวเนีย)",
            "thumbnail": "/entities/pin-dracula.jpg"
      }
],
    title_th: 'เคานต์แดร็กคูลาแห่งทรานซิลเวเนีย',
    title_en: 'Count Dracula & Vlad the Impaler',
    category: 'curse',
    province_th: 'บราชอฟ (โรมาเนีย)',
    province_en: 'Brasov, Transylvania (Romania)',
    district_th: 'ปราสาทบราน',
    district_en: 'Bran Castle',
    lat: 45.5152,
    lng: 25.3672,
    story_th:
      'เคานต์แดร็กคูลา แวมไพร์อมตะผู้ปกครองปราสาทหินสูงตระหง่านเหนือหน้าผาทรานซิลเวเนีย มีพลังสะกดจิต แปลงกายเป็นค้างคาวหรือหมอกควัน และดูดกลืนเลือดของเหยื่อเพื่อคงความเยาว์วัยชั่วนิรันดร์ มีต้นกำเนิดจากความโหดเหี้ยมของเจ้าชายวลาดที่ 3 ผู้เสียบประจานศัตรูนับหมื่น',
    story_en:
      'The noble undead sovereign haunting the mist-shrouded Carpathian crags. Channeling the ruthlessness of Vlad III the Impaler, Dracula commands the creatures of the night, shifting into mist and shadow to feast upon mortal bloodlines.',
    folklore_history_th:
      'ปราสาทบราน (Bran Castle) ในทรานซิลเวเนีย สร้างขึ้นในศตวรรษที่ 14 และกลายมาเป็นสัญลักษณ์ทางวรรณกรรมแวมไพร์ระดับตำนานของ แบรม สโตกเกอร์ ผสานเข้ากับประวัติศาสตร์สงครามอันนองเลือดของอาณาจักรวัลลาเคีย',
    folklore_history_en:
      'Perched high in the Carpathian mountains, 14th-century Bran Castle became synonymous with Bram Stoker’s gothic vampire lore, merged with the brutal military history of Wallachia.',
    image_url: '/entities/pin-dracula.jpg',
    sound_preset: 'creepy_wind',
    views_count: 2890,
    is_published: 1,
  },

  // --- AMERICAS ---
  {
    id: 'pin-wendigo',
    title_th: 'เวนดิโก อสูรป่าหิมะกินคน',
    title_en: 'The Wendigo of the Great Lakes',
    category: 'monster',
    province_th: 'มินนิโซตา (สหรัฐอเมริกา)',
    province_en: 'Minnesota (USA)',
    district_th: 'ป่าเกรตเลกส์',
    district_en: 'Great Lakes Forests',
    lat: 46.7296,
    lng: -94.6859,
    story_th:
      'เวนดิโก อสูรกายกระหายเนื้อคนแห่งพงไพรหนาวเหน็บทางตอนเหนือ เกิดจากมนุษย์ที่กลืนกินเนื้อมนุษย์ด้วยกันในยามฤดูหนาวอดอยาก ร่างกายจะผอมโซจนกระดูกโปน ผิวหนังสีขี้เถ้าแห้งกรัง ดวงตาลึกโหลกลวงโบ๋ และมีกลิ่นซากศพเน่าโชยตามลม มันสามารถเลียนแบบเสียงคนรักเพื่อล่อพรานป่าออกไปฉีกกิน',
    story_en:
      'A cannibalistic malevolent spirit born when desperate humans consume human flesh to survive harsh boreal winters. Emaciated to bare bone with ash-gray decaying skin and sunken yellow eyes, the Wendigo mimics human cries of loved ones to lure solitary hunters into deep blizzards.',
    folklore_history_th:
      'เป็นคติชนและคำเตือนทางศีลธรรมที่สำคัญที่สุดของชนเผ่าแอลกองเควียน (Algonquian) และโอจิบเว (Ojibwe) เพื่อป้องกันการฆ่ากินเนื้อพวกเดียวกันในฤดูหนาวที่ทารุณ ปัจจุบันยังคงใช้เป็นคำอธิบายทางการแพทย์ของอาการทางจิต Wendigo Psychosis',
    folklore_history_en:
      'A profound cultural taboo among the Algonquian and Ojibwe First Nations designed to deter cannibalism during starvation winters, also inspiring the psychiatric concept of Wendigo Psychosis.',
    image_url: '/entities/pin-wendigo.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-wendigo.jpg",
            "title": "เวนดิโก อสูรป่าหิมะกินคน"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-chupacabra',
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-chupacabra.jpg",
            "title": "เอล ชูปาคาบรา อสูรสูบเลือดสัตว์"
      }
],
    title_th: 'เอล ชูปาคาบรา อสูรสูบเลือดสัตว์',
    title_en: 'El Chupacabra (Goat-Sucker)',
    category: 'monster',
    province_th: 'ฮาลิสโก (เม็กซิโก)',
    province_en: 'Jalisco (Mexico)',
    district_th: 'กวาดาลาฮารา',
    district_en: 'Guadalajara',
    lat: 20.6597,
    lng: -103.3496,
    story_th:
      'อสูรลึกลับดูดเลือดสัตว์ มีดวงตาสีแดงฉาน รูปร่างคล้ายสัตว์เลื้อยคลานผสมสุนัขจร มีหนามแหลมคมเรียงรายตลอดแนวกระดูกสันหลัง ออกอาละวาดสังหารแพะ แกะ และสัตว์เลี้ยง โดยเจาะรูทรงกลมขนาดเล็กที่ลำคอเพื่อสูบเลือดจนแห้งเหือดหมดตัวโดยไม่กินเนื้อ',
    story_en:
      'The notorious "Goat-Sucker" of Latin America, bearing glowing red eyes, reptilian skin, and razor spines down its back. It leaves livestock drained of every drop of blood through precise puncture wounds without consuming the flesh.',
    folklore_history_th:
      'การพบเห็นเริ่มขึ้นครั้งแรกในเมืองกาโนบานัส (Canóvanas) เปอร์โตริโก ในปี ค.ศ. 1995 ก่อนจะแพร่ระบาดไปทั่วเม็กซิโก อเมริกากลาง และตอนใต้ของสหรัฐฯ นำไปสู่ทฤษฎีการทดลองทางพันธุกรรมลับหรือสิ่งมีชีวิตนอกโลก',
    folklore_history_en:
      'First reported in Canóvanas, Puerto Rico in 1995, following hundreds of exsanguinated farm animals. The phenomenon quickly swept across Mexico, Brazil, and the southwestern United States.',
    image_url: '/entities/pin-chupacabra.jpg',
    sound_preset: 'jungle_curse',
    views_count: 1420,
    is_published: 1,
  },

  // --- MIDDLE EAST & AFRICA ---
  {
    id: 'pin-tutankhamun',
    title_th: 'คำสาปฟาโรห์ตุตันคาเมน',
    title_en: 'Curse of the Pharaohs (King Tut)',
    category: 'curse',
    province_th: 'ลักซอร์ (อียิปต์)',
    province_en: 'Luxor (Egypt)',
    district_th: 'หุบผากษัตริย์',
    district_en: 'Valley of the Kings',
    lat: 25.7402,
    lng: 32.6014,
    story_th:
      'คำสาปฟาโรห์แห่งหุบเขากษัตริย์ กล่าวว่าผู้ใดก็ตามที่รบกวนการหลับใหลอันสงบของฟาโรห์ ความตายจะโบยบินมาหาด้วยปีกแห่งความมืด ภายหลังการเปิดสุสานในปี 1922 ผู้ร่วมคณะสำรวจหลายคนต้องจบชีวิตลงอย่างกะทันหันด้วยโรคแปลกประหลาด ไข้สูง หรืออุบัติเหตุที่ไม่สามารถอธิบายได้',
    story_en:
      'The ancient tomb curse declaring: "Death shall slay with his wings whoever disturbs the peace of the Pharaoh." Following Howard Carter\'s 1922 breakthrough into the sealed golden chamber, an eerie succession of mysterious illnesses and fatal accidents claimed expedition members.',
    folklore_history_th:
      'สุสาน KV62 ในหุบเขากษัตริย์ เมืองลักซอร์ ถูกค้นพบโดยโฮเวิร์ด คาร์เตอร์ และลอร์ดคาร์นาร์วอน การเสียชีวิตของลอร์ดคาร์นาร์วอนจากแผลยุงกัดติดเชื้อและไฟดับทั่วเมืองไคโรในเวลาเดียวกัน ได้จุดกระแสความสะพรึงกลัวเรื่องคำสาปอียิปต์โบราณไปทั่วโลก',
    folklore_history_en:
      'Tomb KV62 in the Valley of the Kings, Luxor. The sudden demise of benefactor Lord Carnarvon from infected mosquito bites coupled with an inexplicable Cairo citywide blackout birthed the modern myth of mummy curses.',
    image_url: '/entities/pin-tutankhamun.jpg',
    sound_preset: 'whisper',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-tutankhamun.jpg",
            "title": "คำสาปฟาโรห์ตุตันคาเมน"
      }
],
    is_published: 1,
  },

  // --- OCEANIA ---
  {
    id: 'pin-bunyip',
    title_th: 'บันยิป อสูรแห่งบึงน้ำออสเตรเลีย',
    title_en: 'The Bunyip of the Murray Swamps',
    category: 'monster',
    province_th: 'วิกตอเรีย (ออสเตรเลีย)',
    province_en: 'Victoria (Australia)',
    district_th: 'ลุ่มน้ำเมอร์รีย์',
    district_en: 'Murray River Basin',
    lat: -36.5000,
    lng: 145.0000,
    story_th:
      'อสูรดึกดำบรรพ์ผู้พิทักษ์บึงน้ำลึกและแม่น้ำเมอร์เรย์ของออสเตรเลีย มีเสียงร้องครวญครางดังกึกก้องในยามราตรี รูปร่างคล้ายแมวน้ำผสมจระเข้ มีเขี้ยวโค้งยาวและดวงตาสีเลือด คอยลากผู้บุกรุกและเด็กที่มาเล่นน้ำยามค่ำคืนลงสู่ก้นบึงโคลนดูด',
    story_en:
      'A terrifying amphibious cryptid said to haunt the billabongs, creeks, and swamp basins of southeastern Australia. Its bloodcurdling bellow echoes across the reeds before it drags unwary swimmers and wanderers into murky watery graves.',
    folklore_history_th:
      'มีรากฐานลึกซึ้งในตำนานความฝัน (Dreamtime) ของชาวอะบอริจิน นักบรรพชีวินวิทยาบางกลุ่มสันนิษฐานว่าเรื่องเล่านี้อาจเป็นความทรงจำทางวัฒนธรรมที่สืบทอดมาจากสัตว์เลี้ยงลูกด้วยนมยักษ์ดึกดำบรรพ์ที่สูญพันธุ์ไปอย่างไดโพรโทดอน (Diprotodon)',
    folklore_history_en:
      'Deeply ingrained in Indigenous Australian Dreamtime oral histories. Paleontologists theorize the legend may preserve cultural memories of extinct Pleistocene megafauna like the giant wombat Diprotodon.',
    image_url: '/entities/pin-bunyip.jpg',
    sound_preset: 'water_spirit',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-bunyip.jpg",
            "title": "บันยิป อสูรแห่งบึงน้ำออสเตรเลีย"
      }
],
    is_published: 1,
  },

  // --- THAILAND & SOUTHEAST ASIA ---
  {
    id: 'pin-maenak',
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-maenak.jpg",
            "title": "แม่นาคพระโขนง"
      }
],
    title_th: 'แม่นาคพระโขนง',
    title_en: 'Mae Nak Phra Khanong',
    category: 'ghost',
    province_th: 'กรุงเทพมหานคร (ไทย)',
    province_en: 'Bangkok (Thailand)',
    district_th: 'พระโขนง',
    district_en: 'Phra Khanong',
    lat: 13.7088,
    lng: 100.6015,
    story_th:
      'ตำนานความรักอมตะและความผูกพันที่ก้าวข้ามความตายของนางนาคแห่งคุ้งน้ำพระโขนง ผู้เสียชีวิตพร้อมลูกในท้องขณะรอคอยพี่มากสามีกลับจากศึกสงคราม ดวงวิญญาณยังคงเฝ้ารอและปรุงอาหารปรนนิบัติสามีจนกระทั่งความจริงถูกเปิดเผย นำไปสู่การขับไล่และสะกดวิญญาณด้วยปั้นเหน่งหน้าผาก',
    story_en:
      'The immortal tale of tragic love transcending death. Dying in agonizing childbirth while her husband Mak fought on distant battlefields, her restless ghost maintained the illusion of a peaceful domestic life until the terrible truth of her decomposed body was revealed.',
    folklore_history_th:
      'เหตุการณ์เกิดขึ้นในสมัยรัชกาลที่ 4 ริมคลองพระโขนง ต่อมาสมเด็จพระพุฒาจารย์ (โต พรหมรังสี) ได้มาทำพิธีสะกดวิญญาณและเจาะกระดูกหน้าผากทำปั้นเหน่ง ปัจจุบันศาลแม่นาคที่วัดมหาบุศย์ยังคงเป็นสถานที่ศักดิ์สิทธิ์ที่มีผู้คนเดินทางมากราบไหว้ขอพรความรักและการเกณฑ์ทหารอย่างเนืองแน่น',
    folklore_history_en:
      'Originated during the reign of King Rama IV along Phra Khanong canal. Somdej Toh later performed rites to pacify her spirit, carving an amulet from her forehead bone. Her shrine at Wat Mahabut remains one of Bangkok\'s most revered pilgrimage sites.',
    image_url: '/entities/pin-maenak.jpg',
    sound_preset: 'whisper',
    views_count: 1420,
    is_published: 1,
  },
  {
    id: 'pin-krasue',
    title_th: 'กระสือยายสาย',
    title_en: 'The Krasue of Kabin Buri',
    category: 'curse',
    province_th: 'ปราจีนบุรี (ไทย)',
    province_en: 'Prachinburi (Thailand)',
    district_th: 'กบินทร์บุรี',
    district_en: 'Kabin Buri',
    lat: 13.9854,
    lng: 101.7164,
    story_th:
      'ผีสาวใต้คำสาปเวทมนตร์ดำ ในเวลากลางวันจะดูเหมือนหญิงชาวบ้านธรรมดา แต่ในยามค่ำคืนศีรษะจะแยกออกจากลำตัวพร้อมหัวใจและพวงไส้เรืองแสงสีเขียวอมแดง ล่องลอยไปตามท้องทุ่งและใต้ถุนบ้านเพื่อหาของเน่าคาว สัตว์สด และรกเด็กแรกเกิดกินเป็นอาหาร หากเช็ดปากกับผ้าผืนใด ผ้านั้นจะขึ้นคราบเปื้อนเลือดและต้องนำไปเผาทำลาย',
    story_en:
      'A cursed woman whose head detaches from her torso at midnight, dragging glowing entrails, lungs, and stomach through the dark countryside. Hovering above rice paddies with an eerie greenish-red luminescence, she hunts for raw offal, livestock blood, and placenta.',
    folklore_history_th:
      'ความเชื่อร่วมกันในอุษาคเนย์ (มาเลเซียเรียกปีนังเกอลัน, กัมพูชาเรียกเปรตแอก) ผูกพันกับวัฒนธรรมสุขอนามัยการคลอดบุตรในสมัยโบราณที่ต้องวางหนามสะแกใต้ถุนเรือนเพื่อป้องกันไส้ของผีกระสือไปเกี่ยวติด',
    folklore_history_en:
      'A pervasive Southeast Asian folklore figure (Penanggalan in Malaysia, Ahp in Cambodia). Rural communities placed thorny branches beneath stilted homes to trap her trailing viscera and safeguard newborn babies.',
    image_url: '/entities/pin-krasue.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-krasue.jpg",
            "title": "กระสือยายสาย"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-pop',
    title_th: 'ผีปอบหยิบแห่งลุ่มน้ำปาว',
    title_en: 'Phi Pop of Pao Basin',
    category: 'curse',
    province_th: 'กาฬสินธุ์ (ไทย)',
    province_en: 'Kalasin (Thailand)',
    district_th: 'เมืองกาฬสินธุ์',
    district_en: 'Mueang Kalasin',
    lat: 16.4322,
    lng: 103.5065,
    story_th:
      'วิญญาณร้ายในความเชื่ออีสาน เกิดจากผู้ที่เรียนวิชาไสยศาสตร์มนต์ดำแล้วละเมิดข้อห้ามหรือทำของแตกใส่ตัว กลายเป็นผีปอบเข้าสิงร่างคนเพื่อกินตับไตไส้พุงจากภายใน ผู้ถูกสิงจะมีอาการซูบผอม ตาขวาง และต้องการกินของดิบสด เมื่อมีผู้เสียชีวิตกะทันหันในหมู่บ้าน ชาวบ้านจะเชิญหมอธรรมมาทำพิธีลงข่วงและจับปอบใส่กระบอกไม้ไผ่',
    story_en:
      'A malevolent parasitic spirit born when a practitioner of black sorcery violates sacred occult taboos. The Pop invades human hosts, devouring their internal organs from within while driving the victim to crave raw flesh, resulting in sudden mysterious deaths in rural villages.',
    folklore_history_th:
      'ลุ่มน้ำปาวและภาคอีสานมีประเพณีพิธีกรรม "เซิ้งบั้งไฟ" และ "การลงข่วงจับปอบ" ซึ่งทำหน้าที่เป็นกลไกทางสังคมในการคลี่คลายความขัดแย้งในชุมชน และสะท้อนความเคารพต่อสิ่งศักดิ์สิทธิ์ผู้ปกปักรักษาประจำหมู่บ้าน (ผีปู่ตา)',
    folklore_history_en:
      'A bedrock tradition of Isan village anthropology along the Pao River. Rituals led by Moh Tham (spiritual shamans) using wicker traps serve as community mechanisms for resolving crisis and reinforcing ancestral taboos.',
    image_url: '/entities/pin-pop.jpg',
    sound_preset: 'whisper',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-pop.jpg",
            "title": "ผีปอบหยิบแห่งลุ่มน้ำปาว"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-naga',
    title_th: 'พญานาคแม่น้ำโขงและบั้งไฟพญานาค',
    title_en: 'Naga Serpent of the Mekong',
    category: 'sacred',
    province_th: 'หนองคาย (ไทย)',
    province_en: 'Nong Khai (Thailand)',
    district_th: 'โพนพิสัย',
    district_en: 'Phon Phisai',
    lat: 18.0163,
    lng: 103.0786,
    story_th:
      'พญานาคราชเจ้าแห่งสายน้ำโขง ผู้ปกครองนครบาดาล มีฤทธานุภาพเนรมิตกาย ดลบันดาลความอุดมสมบูรณ์และฝนฟ้า ในคืนวันออกพรรษา 15 ค่ำ เดือน 11 จะเกิดปรากฏการณ์ลูกไฟสีแดงอมชมพูไร้เสียงพวยพุ่งขึ้นจากผิวน้ำสู่ท้องฟ้า หรือที่รู้จักกันในนาม "บั้งไฟพญานาค" เพื่อเป็นพุทธบูชา',
    story_en:
      'The divine serpentine deity ruling the depths of the Mekong River. Revered as guardians of subterranean kingdoms and water wealth, Nagas produce the mysterious silent pink-red fireballs ("Bung Fai Phaya Nak") erupting into the night sky on the full moon of Ork Phansa.',
    folklore_history_th:
      'ความผูกพันนับพันปีระหว่างชาวไทย-ลาวสองฝั่งโขง ปรากฏในคติชนวรรณกรรมอย่างท้าวฮุ่งท้าวเจือง ตำนานอุรังคธาตุ และความเชื่อเรื่องเมืองบาดาลใต้แก่งอาฮง ซึ่งเชื่อว่าเป็นสะดือแม่น้ำโขงที่มีความลึกที่สุด',
    folklore_history_en:
      'Central to Mekong Basin civilization across Thailand and Laos for millennia. Enshrined in the Urangadhatu chronicles and sacred sites like Kaeng Ahong, believed to be the deepest underwater entrance to the Naga realm.',
    image_url: '/entities/pin-naga.jpg',
    sound_preset: 'water_spirit',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-naga.jpg",
            "title": "พญานาคแม่น้ำโขงและบั้งไฟพญานาค"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-saming',
    title_th: 'สมิงเขาหลวง',
    title_en: 'The Were-Tiger of Khao Luang',
    category: 'monster',
    province_th: 'นครศรีธรรมราช (ไทย)',
    province_en: 'Nakhon Si Thammarat (Thailand)',
    district_th: 'ลานสกา',
    district_en: 'Lan Saka',
    lat: 8.4988,
    lng: 99.7345,
    story_th:
      'เสือสมิงแห่งเทือกเขาหลวง นครศรีธรรมราช เสือโคร่งดึกดำบรรพ์ที่กินคนจนมีวิญญาณคนตายสิงอยู่ในร่าง หรือพรานผู้มีวิชาอาคมแก่กล้าที่แปลงร่างเป็นเสือแล้วคืนร่างเดิมไม่ได้ สามารถแปลงกายเป็นหญิงงามหรือคนรู้จักเพื่อล่อพรานป่าที่นั่งห้างยามดึกให้ลงมาถูกขย้ำกิน',
    story_en:
      'The were-tiger of Khao Luang deep jungle. Born of a ferocious man-eating tiger possessed by human ghosts, or a sorcerer lost forever in his feline transformation. It mimics human voices and takes the form of helpless relatives to lure hunters out of their tree hides.',
    folklore_history_th:
      'ป่าดงดิบเขาหลวงเป็นแนวเทือกเขาสูงที่สุดในภาคใต้ พรานป่าโบราณถือข้อห้ามเคร่งครัดว่าหากนั่งห้างล่าสัตว์แล้วได้ยินเสียงเรียกชื่อ ห้ามขานรับและห้ามลงจากห้างจนกว่าพระอาทิตย์จะขึ้นพ้นยอดไม้',
    folklore_history_en:
      'Originates in the impenetrable rainforests of Nakhon Si Thammarat. Traditional hunters adhere to strict taboos: never answer a night call from the brush and never descend from a hunting hide before full daylight.',
    image_url: '/entities/pin-saming.jpg',
    sound_preset: 'jungle_curse',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-saming.jpg",
            "title": "สมิงเขาหลวง"
      }
],
    is_published: 1,
  },

  // --- EAST ASIA (CHINA) ---
  {
    id: 'pin-jiangshi',
    title_th: 'จางจี้ (ผีผู้ขโขบ)',
    title_en: 'Jiangshi (The Hopping Corpse)',
    category: 'ghost',
    province_th: 'ปีจูเนีย (จีน)',
    province_en: 'Beijing (China)',
    lat: 39.9042,
    lng: 116.4074,
    story_th:
      'เจียงซี หรือผีดิบจีนกระโดด ศพที่ตายกะทันหันหรือฝังในสุสานที่ฮวงจุ้ยไม่ดี ร่างกายจะแข็งทื่อ สวมชุดขุนนางราชวงศ์ชิง แขนสองข้างยื่นตรงไปข้างหน้า และเคลื่อนที่ด้วยการกระโดดตามกลิ่นลมหายใจของคนเป็นเพื่อดูดพลังชี่ (พลังชีวิต)',
    story_en:
      'The Chinese hopping vampire, a stiffened corpse clad in Qing dynasty mandarin robes. Unable to bend its joints, it bounds forward with outstretched arms, hunting the living by scenting their breath to extract their life-essence (Qi).',
    folklore_history_th:
      'มีที่มาจากประเพณี "ไล่ศพกลับบ้าน" (เซียงซีการ์เดียน) ของมณฑลหูหนาน ที่นักพรตเต๋าจะนำร่างของผู้เสียชีวิตต่างถิ่นเดินแถวกลับไปฝังยังบ้านเกิดในเวลากลางคืน พร้อมสั่นกระดิ่งและติดยันต์สีเหลืองสะกดไว้ที่หน้าผาก',
    folklore_history_en:
      'Rooted in the Xiangxi corpse-driving folklore of Hunan, where Taoist masters ritually transported corpses of migrant workers across mountains for family burial, pinning yellow paper talismans to their foreheads.',
    image_url: '/entities/pin-jiangshi.jpg',
    sound_preset: 'whisper',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-jiangshi.jpg",
            "title": "จางจี้ (ผีผู้ขโขบ)"
      }
],
    is_published: 1,
  },

  // --- EUROPE & UK (RUSSIA) ---
  {
    id: 'pin-baba-iva',
    title_th: 'บาบาะ',
    title_en: 'Baba Yaga (The Bone Witch)',
    category: 'curse',
    province_th: 'มอสโก (รัสเซีย)',
    province_en: 'Moscow (Russia)',
    lat: 55.7558,
    lng: 37.6173,
    story_th:
      'บาบายากา แม่มดเฒ่าแห่งป่าสลาฟ อาศัยอยู่ในกระท่อมไม้ที่ตั้งอยู่บนขาไก่ขนาดยักษ์ซึ่งสามารถหมุนและก้าวเดินไปรอบป่าได้ เธอจะเหาะไปในอากาศด้วยครกหินขนาดยักษ์ พายด้วยสาก และกวาดรอยลบด้วยไม้กวาดเบิร์ช มีฟันเป็นเหล็กและมีทั้งความใจร้ายกินเด็กและเป็นผู้มอบปัญญาแก่ผู้กล้า',
    story_en:
      'The legendary Slavic crone inhabiting a magical hut balanced on giant dancing chicken legs. Traveling through storm clouds inside a flying mortar propelled by a pestle, she possesses iron teeth, a fence of human skulls, and an ambivalent role as child-eater and keeper of ancient wisdom.',
    folklore_history_th:
      'ปรากฏในนิทานพื้นบ้านของรัสเซีย ยูเครน และโปแลนด์ นักวิชาการมองว่าเป็นภาพแทนของเทพธิดาแห่งความตายและการเกิดใหม่ในยุคก่อนคริสต์ศาสนา รวมถึงตัวแทนของพลังอำนาจธรรมชาติในป่าไทกาอันไร้ขอบเขต',
    folklore_history_en:
      'An archetype of Slavic pre-Christian mythology across Eastern Europe, representing the wild, untamable wilderness of the Taiga forest and the borderkeeper between the mortal realm and the underworld.',
    image_url: '/entities/pin-baba-iva.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-baba-iva.jpg",
            "title": "บาบาะ"
      }
],
    is_published: 1,
  },

  // --- SOUTH ASIA (INDIA) ---
  {
    id: 'pin-chudail',
    title_th: 'จูดไล',
    title_en: 'The Chudail (Wailing Witch)',
    category: 'ghost',
    province_th: 'วาระนาสี (อินเดีย)',
    province_en: 'Varanasi (India)',
    lat: 25.32,
    lng: 82.97,
    story_th:
      'จูแดล ผีสาวแห่งอินเดียและปากีสถาน เกิดจากหญิงที่เสียชีวิตระหว่างการคลอดบุตรหรือถูกทารุณกรรมโดยครอบครัว เธอจะปรากฏตัวเป็นหญิงสาวรูปงามล่อลวงผู้ชายเดินทางในยามค่ำคืน แต่จุดสังเกตที่เป็นเอกลักษณ์คือ "ฝ่าเท้าของเธอจะบิดกลับด้าน 180 องศา" เมื่อเหยื่อหลงกล เธอจะดูดกลืนพลังชีวิตจนกลายเป็นชายชราในชั่วข้ามคืน',
    story_en:
      'The vengeful spirit of a woman who perished during childbirth or through domestic cruelty. Disguised as an alluring maiden by roadside intersections, her one giveaway is her backwards-facing feet. She seduces unsuspecting travelers and leaches their youth and vitality.',
    folklore_history_th:
      'เรื่องเล่ามีชื่อเสียงมากในแคว้นราชสถาน โดยเฉพาะรอบป้อมปราการร้างภังการห์ (Bhangarh Fort) ซึ่งได้ชื่อว่าเป็นสถานที่อาถรรพ์ที่สุดในอนุทวีปอินเดีย กรมสำรวจทางโบราณคดีของอินเดียถึงกับติดป้ายห้ามเข้าหลังพระอาทิตย์ตกดิน',
    folklore_history_en:
      'Pervasive across Rajasthan and rural South Asia, notably around the cursed Bhangarh Fort where the Archaeological Survey of India strictly forbids entry between sunset and sunrise.',
    image_url: '/entities/pin-chudail.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-chudail.jpg",
            "title": "จูดไล"
      }
],
    is_published: 1,
  },

  // --- EUROPE (FRANCE) ---
  {
    id: 'pin-gevaudan',
    title_th: 'สัตว์ป่าผู้เปลี่ยนร่างเป็นหมอ',
    title_en: 'The Beast of Gevaudan (Werewolf)',
    category: 'monster',
    province_th: 'กัวดอน (ฝรั่งเศส)',
    province_en: 'Gevaudan (France)',
    lat: 44.6,
    lng: 0.9,
    story_th:
      'สัตว์ร้ายแห่งเฌโวด็อง อสูรขนาดยักษ์คล้ายหมาป่าผสมไฮยีน่า มีเขี้ยวยาว ตาแดง และแผงคอสีดำ ออกอาละวาดสังหารชาวบ้านและเด็กเลี้ยงแกะในแคว้นโอแวร์ญ ประเทศฝรั่งเศส ระหว่างปี 1764–1767 มากกว่า 100 ศพ ปืนไรเฟิลและกับดักไม่อาจระคายผิวมันได้ จนพระเจ้าหลุยส์ที่ 15 ต้องส่งกองทัพหลวงและมือปราบหมาป่าระดับชาติไปตามล่า',
    story_en:
      'A terrifying man-eating beast that terrorized the province of Gévaudan, France between 1764 and 1767, slaughtering over 100 victims. Shrugging off musket volleys, its rampage prompted King Louis XV to dispatch royal troops and elite royal wolf-hunters.',
    folklore_history_th:
      'เป็นหนึ่งในบันทึกเหตุการณ์ประวัติศาสตร์ที่ได้รับการจดบันทึกไว้อย่างละเอียดที่สุดของยุโรป ทั้งในจดหมายเหตุของโบสถ์และบันทึกราชสำนักแวร์ซายส์ สิ้นสุดลงเมื่อนายพราน ฌ็อง ชัสแตล ใช้กระสุนเงินแท้ที่ผ่านการปลุกเสกยิงสังหารมันได้สำเร็จ',
    folklore_history_en:
      'Extensively documented in 18th-century parish registers and royal archives of Versailles. The terror ended when local hunter Jean Chastel supposedly felled the beast using consecrated silver bullets.',
    image_url: '/entities/pin-gevaudan.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-gevaudan.jpg",
            "title": "สัตว์ป่าผู้เปลี่ยนร่างเป็นหมอ"
      }
],
    is_published: 1,
  },

  // --- SOUTH AMERICA (BRAZIL) ---
  {
    id: 'pin-curupira',
    title_th: 'ครูปิรา',
    title_en: 'Curupira (Protective Forest Spirit)',
    category: 'sacred',
    province_th: 'อร่าโจนัส (บราซิล)',
    province_en: 'Amazon (Brazil)',
    lat: -3.4657,
    lng: -62.2159,
    story_th:
      'ครูปิรา ภูตตัวเล็กผู้พิทักษ์ป่าดงดิบแอมะซอน มีผมสีแดงเพลิงเจิดจ้า ร่างกายกำยำ และมี "เท้าหันกลับไปด้านหลัง" ทำให้รอยเท้าที่ทิ้งไว้บนพื้นดินลวงให้นายพรานและคนตัดไม้เดินหลงทางเข้าไปในดงลึก หากใครล่าสัตว์เกินจำเป็นหรือทำลายพืชพรรณ ครูปิราจะส่งเสียงหวีดหวิวหลอนประสาทจนเหยื่อเสียสติ',
    story_en:
      'The flame-haired jungle sprite guarding the virgin Amazon rainforest. Possessing backward-pointing feet that create deceptive tracks, Curupira lures greedy poachers and loggers into treacherous swamps while protecting animals with its piercing hypnotic whistles.',
    folklore_history_th:
      'บันทึกเป็นลายลักษณ์อักษรครั้งแรกโดยบาทหลวงเยซูอิต โฮเซ เด อันชีเอตา ในปี ค.ศ. 1560 ในฐานะหนึ่งในความเชื่อดั้งเดิมของชนเผ่าทูปี-กัวรานีที่ทรงอิทธิพลที่สุดในวัฒนธรรมบราซิล',
    folklore_history_en:
      'First documented by Jesuit missionary José de Anchieta in 1560. Revered among indigenous Tupi-Guarani tribes as an unyielding defender of biodiversity against exploitation.',
    image_url: '/entities/pin-curupira.jpg',
    sound_preset: 'water_spirit',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-curupira.jpg",
            "title": "ครูปิรา"
      }
],
    is_published: 1,
  },

  // --- NORDIC (ICELAND) ---
  {
    id: 'pin-draugr',
    title_th: 'ดราวก',
    title_en: 'The Draugr (Ancient Undead)',
    category: 'ghost',
    province_th: 'ไอซ์แลนด์',
    province_en: 'Iceland',
    lat: 64.1466,
    lng: -21.9426,
    story_th:
      'ดราวก์ ซากศพนักรบไวกิ้งคืนชีพ มีพละกำลังมหาศาล ร่างกายขยายใหญ่โตจนบวมพอง ผิวหนังสีฟ้าหม่นหรือดำคล้ำ กลิ่นไอเน่าเปื่อยรุนแรง เฝ้าสมบัติและอาวุธโบราณในสุสานหิน (Haugr) สามารถว่ายน้ำผ่านก้อนหินและควบคุมสภาพอากาศ สร้างพายุหมอกหนาวบดบังเรือเดินสมุทร',
    story_en:
      'The formidable undead Viking revenants haunting coastal burial cairns (Haugr). Swollen with supernatural strength and exuding the stench of rot, Draugr guard ancient hoards, wield shapeshifting sorcery, and drive tomb raiders insane.',
    folklore_history_th:
      'ปรากฏในมหากาพย์ซากาของชาวนอร์ส เช่น Grettis saga วิธีเดียวที่จะปราบดราวก์ได้คือต้องใช้กำลังกายตัดศีรษะ เผาร่างจนเป็นเถ้าถ่าน และนำเถ้าไปโปรยทิ้งลงในทะเลลึก',
    folklore_history_en:
      'Featured prominently in ancient Icelandic sagas such as Grettis saga. Dispelling a Draugr required decapitation, immolation of the corpse, and scattering the ashes into the ocean.',
    image_url: '/entities/pin-draugr.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-draugr.jpg",
            "title": "ดราวก"
      }
],
    is_published: 1,
  },

  // --- SOUTHERN EUROPE (GREECE) ---
  {
    id: 'pin-minotaur',
    title_th: 'ไมโนทอร์ในเขาวงกต',
    title_en: 'The Minotaur of the Labyrinth',
    category: 'monster',
    province_th: 'ครีต (กรีซ)',
    province_en: 'Crete (Greece)',
    district_th: 'พระราชวังนอสซอส',
    district_en: 'Knossos',
    lat: 35.2962,
    lng: 25.1607,
    story_th:
      'ไมโนทอร์ อสุรกายครึ่งคนครึ่งกระทิงผู้มีพละกำลังดุร้าย เกิดจากคำสาปของเทพโพไซดอน ถูกกักขังอยู่ในเขาวงกตใต้ดินอันสลับซับซ้อนที่สร้างโดยเดดาลัส ณ เกาะครีต ในทุกๆ เก้าปี กษัตริย์ไมนอสจะบังคับให้ส่งเด็กหนุ่มสาว 14 คนจากเอเธนส์เข้าไปในเขาวงกตเพื่อเป็นเครื่องสังเวย',
    story_en:
      'The fearsome bull-headed monster born of divine curse, imprisoned deep within the subterranean labyrinth designed by Daedalus beneath Knossos. Every nine years, Athens was compelled to offer seven youths and seven maidens to satisfy its carnivorous fury.',
    folklore_history_th:
      'ศูนย์กลางของอารยธรรมมิโนอัน ณ พระราชวังคนอสซอส (Knossos) บนเกาะครีต ภาพจิตรกรรมฝาผนังการกระโดดข้ามกระทิง (Bull-Leaping) สะท้อนถึงลัทธิบูชากระทิงโบราณ ก่อนที่ธีซีอุสจะใช้ด้ายนำทางของอาริแอดเนสังหารอสูรตนนี้',
    folklore_history_en:
      'Rooted in Minoan Bronze Age culture at the Palace of Knossos, Crete. Sacred bull-leaping frescoes and subterranean palace vaults inspired the myth of Theseus navigating the maze with Ariadne\'s thread.',
    image_url: '/entities/pin-minotaur.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-minotaur.jpg",
            "title": "ไมโนทอร์ในเขาวงกต"
      }
],
    is_published: 1,
  },

  // --- CENTRAL EUROPE (GERMANY) ---
  {
    id: 'pin-lorelei',
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-lorelei.jpg",
            "title": "ลอเรไล นางเงียมแห่งแม่น้ำไรน์"
      }
],
    title_th: 'ลอเรไล นางเงียมแห่งแม่น้ำไรน์',
    title_en: 'The Lorelei of the Rhine',
    category: 'sacred',
    province_th: 'ไรน์ลันด์ (เยอรมนี)',
    province_en: 'Rhineland (Germany)',
    district_th: 'หน้าผาลอเรไล',
    district_en: 'Loreley Rock',
    lat: 50.1457,
    lng: 7.7298,
    story_th:
      'ลอเรไล ไซเรนสาวผมบลอนด์ทองผู้สถิตอยู่บนโขดหินสูงชันริมโค้งน้ำที่อันตรายที่สุดของแม่น้ำไรน์ เธอจะขับขานบทเพลงอันไพเราะและหวีดหวิวสะกดใจ ทำให้กะลาสีและพ่อค้าเรือล่องแม่น้ำเคลิบเคลิ้มจนลืมบังคับหางเสือ ชนหินโสโครกอับปางจมสู่ก้นแม่น้ำ',
    story_en:
      'The ethereal maiden perched atop the sheer slate rock overlooking the narrowest, treacherous bend of the Rhine River. Her sorrowful, mesmerizing melodies bewitch passing navigators, luring their boats onto submerged reefs.',
    folklore_history_th:
      'โขดหินลอเรไลใกล้เมืองซังคท์เกอัวร์สเฮาเซิน เป็นจุดที่มีกระแสน้ำวนเชี่ยวกรากและมีเสียงสะท้อนของคลื่นกระทบผาหิน กวีชาวเยอรมัน ไฮน์ริช ไฮเน (Heinrich Heine) ได้ประพันธ์บทกวีอันเลื่องชื่อในปี 1824 จนกลายเป็นตำนานอมตะของเยอรมนี',
    folklore_history_en:
      'Located near Sankt Goarshausen along the Rhine Gorge. The sheer 132-meter cliff creates a natural multi-echo acoustic resonance, immortalized by romantic poet Heinrich Heine in 1824.',
    image_url: '/entities/pin-lorelei.jpg',
    sound_preset: 'water_spirit',
    views_count: 1610,
    is_published: 1,
  },

  // --- IRELAND ---
  {
    id: 'pin-banshee',
    title_th: 'แบนชี ผู้ร้องไห้นำความตาย',
    title_en: 'The Banshee of the Old Families',
    category: 'ghost',
    province_th: 'เคาน์ตีมีท (ไอร์แลนด์)',
    province_en: 'County Meath (Ireland)',
    district_th: 'บรูนาโบยน์',
    district_en: 'Bru na Boinne',
    lat: 53.6944,
    lng: -6.4444,
    story_th:
      'แบนชี วิญญาณหญิงสาวในตำนานเซลติกแห่งไอร์แลนด์ ผู้สวมชุดคลุมยาวสีเทาหรือขาว มีผมสียาวสยายและดวงตาสีแดงจากการร่ำไห้ เธอจะมาส่งเสียงกรีดร้องโหยหวนสะเทือนอารมณ์ใต้หน้าต่างบ้านในยามวิกาล เพื่อแจ้งเตือนถึงความตายที่กำลังจะมาเยือนสมาชิกในตระกูลโบราณ',
    story_en:
      'The Bean Sídhe (Woman of the Fairy Mounds) of Irish folklore. Appearing as a wailing specter in flowing shroud with blood-rimmed eyes, her piercing, mournful keening heralds the imminent death of a family member among Ireland’s ancient lineages.',
    folklore_history_th:
      'ผูกพันกับธรรมเนียมการร้องไห้คร่ำครวญในงานศพโบราณของไอร์แลนด์ (Keening) เชื่อกันว่าแบนชีจะคอยคุ้มครองเฉพาะ 5 ตระกูลใหญ่ดั้งเดิมของเกาะไอร์แลนด์ เช่น O\'Neill, O\'Brien, O\'Connor',
    folklore_history_en:
      'Intertwined with traditional Gaelic keening rituals. According to tradition, only the ancestral Milesian families of Ireland are attended by a Banshee’s fateful laments.',
    image_url: '/entities/pin-banshee.jpg',
    sound_preset: 'whisper',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-banshee.jpg",
            "title": "แบนชี ผู้ร้องไห้นำความตาย"
      }
],
    is_published: 1,
  },

  // --- ENGLAND & UK ---
  {
    id: 'pin-blackshuck',
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-blackshuck.jpg",
            "title": "แบล็ค ชัค สุนัขปีศาจแห่งซัฟฟอล์ก"
      }
],
    title_th: 'แบล็ค ชัค สุนัขปีศาจแห่งซัฟฟอล์ก',
    title_en: 'Black Shuck, the Demon Dog of Suffolk',
    category: 'ghost',
    province_th: 'ซัฟฟอล์ก (อังกฤษ, สหราชอาณาจักร)',
    province_en: 'Suffolk (England, UK)',
    district_th: 'บลิธเบอระ',
    district_en: 'Blythburgh',
    lat: 52.3209,
    lng: 1.4249,
    story_th:
      'แบล็ค ชัค สุนัขปีศาจร่างมหึมาขนสีดำมะเกลือ ดวงตากลมโตลุกเป็นประกายไฟสีแดงก่ำ ออกตระเวนตามแนวชายฝั่งและทางแยกชนบทของแคว้นอีสต์แองเกลีย เสียงย่างก้าวเงียบกริบไร้เสียง หากผู้ใดสบตากับมันโดยตรง ผู้นั้นจะถึงแก่ความตายหรือประสบเคราะห์ร้ายอย่างแสนสาหัสภายในหนึ่งปี',
    story_en:
      'A spectral black hound of monstrous stature haunting the coastlines and churchyards of East Anglia. With shaggy coal-black fur and saucer eyes burning like glowing coals, meeting its gaze is a fatal portent of death within a year.',
    folklore_history_th:
      'เหตุการณ์บันทึกประวัติศาสตร์ที่โด่งดังที่สุดเกิดขึ้นเมื่อวันที่ 4 สิงหาคม ค.ศ. 1577 ณ โบสถ์เซนต์แมรี เมืองบังเกย์ ระหว่างพายุฟ้าผ่ารุนแรง สุนัขปีศาจได้พังประตูโบสถ์เข้ามาสังหารสัตบุรุษ 2 คน และทิ้งรอยกรงเล็บไหม้เกรียมไว้บนประตูโบสถ์ซึ่งยังคงปรากฏให้เห็นในปัจจุบัน',
    folklore_history_en:
      'Famously chronicled by Abraham Fleming in 1577, when the demon dog burst through the doors of St Mary’s Church in Bungay during a storm, killing worshippers and leaving scorched claw scorch-marks on the oak doors.',
    image_url: '/entities/pin-blackshuck.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1240,
    is_published: 1,
  },

  // --- KOREA ---
  {
    id: 'pin-gumiho',
    title_th: 'กุมิโฮะ จิ้งจอกเก้าหาง',
    title_en: 'Gumiho, the Nine-Tailed Fox',
    category: 'monster',
    province_th: 'โซล (เกาหลีใต้)',
    province_en: 'Seoul (South Korea)',
    district_th: 'เขาแซมแซกซัน',
    district_en: 'Mount Samgaksan',
    lat: 37.5665,
    lng: 126.9780,
    story_th:
      'กุมิโฮะ ปีศาจจิ้งจอกเก้าหางแห่งเกาหลี ผู้มีอายุขัยนับพันปีและมีพลังเวทมนตร์กลายร่างเป็นหญิงสาวรูปโฉมงดงามเย้ายวนใจเพื่อล่อลวงผู้ชาย เธอปรารถนาที่จะกลายเป็นมนุษย์แท้จริง โดยตามตำนานต้องกินตับหรือหัวใจมนุษย์ให้ครบ 1,000 ดวง หรือใช้ชีวิตร่วมกับมนุษย์โดยไม่เปิดเผยความลับเป็นเวลา 100 วัน',
    story_en:
      'The thousand-year-old nine-tailed fox of Korean folklore, possessing the ability to shape-shift into a seductive maiden. Driven by an intense desire to attain mortality, she must consume human livers and hearts, or conceal her true nature through 100 days of marriage.',
    folklore_history_th:
      'มีรากฐานความเชื่อร่วมกับปีศาจจิ้งจอกในจีน (ฮู่หลีจิง) และญี่ปุ่น (คิตสึเนะ) แต่กุมิโฮะของเกาหลีมีความดุร้ายและกระหายเลือดมากกว่า มักเชื่อมโยงกับถ้ำลึกในเทือกเขาจีรีซาน (Jirisan)',
    folklore_history_en:
      'Derived from ancient East Asian fox spirit myths, though the Korean Gumiho is distinctly more dangerous and bloodthirsty. Mountain caves in Jirisan National Park are traditional sites of her lair.',
    image_url: '/entities/pin-gumiho.jpg',
    sound_preset: 'temple_bell',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-gumiho.jpg",
            "title": "กุมิโฮะ จิ้งจอกเก้าหาง"
      }
],
    is_published: 1,
  },

  // --- PHILIPPINES ---
  {
    id: 'pin-manananggal',
    title_th: 'มานันนังกัล ผู้ฉีกร่างกลางคืน',
    title_en: 'The Manananggal of Capiz',
    category: 'monster',
    province_th: 'คาปิซ (ฟิลิปปินส์)',
    province_en: 'Capiz (Philippines)',
    district_th: 'โรซัสซิตี',
    district_en: 'Roxas City',
    lat: 11.3784,
    lng: 122.6311,
    story_th:
      'มานันนังกัล ปีศาจสาวดูดเลือดแห่งฟิลิปปินส์ ในเวลากลางวันเป็นหญิงธรรมดา แต่เมื่อตกดึกจะถอดท่อนบนออกจากเอว กางปีกค้างคาวยักษ์บินขึ้นสู่ท้องฟ้า ทิ้งท่อนล่างไว้ในพุ่มไม้ มันจะบินไปเกาะบนหลังคาเรือนแล้วหย่อนลิ้นที่เรียวยาวเหมือนเข็มเจาะผ่านหลังคาเพื่อดูดเลือดและหัวใจของทารกในครรภ์หญิงมีครรภ์',
    story_en:
      'A terrifying vampiric viscera-sucker of Philippine folklore. By night, she severs her torso from her lower body, unfurling leathery bat wings to take flight while leaving her legs hidden in thickets. Using a long proboscis tongue, she feeds on sleeping pregnant women.',
    folklore_history_th:
      'เป็นตำนานที่ขึ้นชื่อที่สุดของเกาะปานายและเมืองคาปิซ (Capiz) วิธีทำลายคือตามหาท่อนล่างที่ซ่อนอยู่แล้วโรยด้วยเกลือ กระเทียม หรือขี้เถ้า ซึ่งจะทำให้เธอไม่สามารถต่อร่างกลับคืนได้และจะมอดไหม้เมื่อแสงอาทิตย์สาดส่อง',
    folklore_history_en:
      'Prevalent across the Visayas region, particularly Capiz province. Her vulnerability lies in her severed lower half: sprinkling salt, crushed garlic, or ash prevents rejoining, causing her to perish at sunrise.',
    image_url: '/entities/pin-manananggal.jpg',
    sound_preset: 'jungle_curse',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-manananggal.jpg",
            "title": "มานันนังกัล ผู้ฉีกร่างกลางคืน"
      }
],
    is_published: 1,
  },

  // --- INDONESIA ---
  {
    id: 'pin-kuntilanak',
    title_th: 'กุนตีลานัค ผีสาวชุดขาว',
    title_en: 'Kuntilanak, the White-Dress Spirit',
    category: 'ghost',
    province_th: 'ชวาตะวันตก (อินโดนีเซีย)',
    province_en: 'West Java (Indonesia)',
    district_th: 'บันดุง',
    district_en: 'Bandung',
    lat: -6.9147,
    lng: 107.6098,
    story_th:
      'กุนตีลานัค (หรือ ปอนตียานัก) วิญญาณหญิงสาวชุดขาวยาวรุ่มร่ามผมดำขลับสยายถึงพื้น ผู้เสียชีวิตขณะตั้งครรภ์ มักสิงสถิตอยู่บนต้นทองหลาง (Warukin) หรือต้นไทรใหญ่ ส่งเสียงหัวเราะแหลมสูงน่าขนลุกก่อนจะเปลี่ยนเป็นเสียงร้องไห้ เธอจะล่อลวงผู้ชายที่สัญจรผ่านไปมาเพื่อทำร้ายด้วยเล็บยาวคมกริบ',
    story_en:
      'The pale, long-haired female revenant of Indonesian and Malay folklore, born of a woman who died during pregnancy. Lurking in the branches of ancient banyan trees, she emits eerie high-pitched laughter that suddenly morphs into sobbing before attacking with razor claws.',
    folklore_history_th:
      'มีอิทธิพลอย่างสูงในเกาะบอร์เนียว ถึงขั้นที่สุลต่านไซยิด อับดุรเราะฮ์มาน ต้องยิงปืนใหญ่ขับไล่ฝูงกุนตีลานัคก่อนจะสร้างเมืองปอนตีอานัก (Pontianak) บนเกาะกาลิมันตันตะวันตกในปี ค.ศ. 1771',
    folklore_history_en:
      'Deeply woven into regional history: the city of Pontianak in West Kalimantan was named after the Sultan fired cannon fire to drive away swarms of Kuntilanak before founding the settlement in 1771.',
    image_url: '/entities/pin-kuntilanak.jpg',
    sound_preset: 'whisper',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-kuntilanak.jpg",
            "title": "กุนตีลานัค ผีสาวชุดขาว"
      }
],
    is_published: 1,
  },

  // --- NEPAL / HIMALAYA ---
  {
    id: 'pin-yeti',
    title_th: 'เยติ สัตว์ประหลาดหิมะ',
    title_en: 'The Yeti of the Himalayas',
    category: 'monster',
    province_th: 'คุมบุ (เนปาล)',
    province_en: 'Khumbu (Nepal)',
    district_th: 'คุมจุง',
    district_en: 'Khumjung',
    lat: 27.9467,
    lng: 86.7233,
    story_th:
      'เยติ มนุษย์หิมะร่างยักษ์แห่งเทือกเขาหิมาลัย ร่างกายสูงใหญ่กว่า 2.5–3 เมตร ปกคลุมด้วยขนหนาสีเทาอมน้ำตาล เดินสองขาอย่างมั่นคงบนธารน้ำแข็งและหน้าผาสูงชัน ส่งเสียงผิวปากแหลมสูงกึกก้องท่ามกลางพายุหิมะขาวโพลน เป็นปริศนาสิ่งมีชีวิตลึกลับที่ท้าทายนักสำรวจทั่วโลก',
    story_en:
      'The legendary snow-ape cryptid of the high Himalayas. Towering up to 3 meters with shaggy grey-brown fur, it traverses near-vertical ice crevasses and blizzards with uncanny agility, leaving massive humanoid tracks in unmapped snow.',
    folklore_history_th:
      'ชาวเชอร์ปาและชาวทิเบตนับถือในฐานะ "เมห์-เต" (Meh-Teh) ผู้พิทักษ์ยอดเขาศักดิ์สิทธิ์ วัดพังโบเช (Pangboche Monastery) เคยเก็บรักษากะโหลกศีรษะและกระดูกมือที่เชื่อว่าเป็นของเยติไว้เป็นเวลาหลายร้อยปี',
    folklore_history_en:
      'Revered in Sherpa culture as "Meh-Teh", guardian spirit of the mountain sanctuaries. Relics including scalps and skeletal hands were preserved for centuries at the Pangboche Monastery.',
    image_url: '/entities/pin-yeti.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-yeti.jpg",
            "title": "เยติ สัตว์ประหลาดหิมะ"
      }
],
    is_published: 1,
  },

  // --- MIDDLE EAST (ARABIA) ---
  {
    id: 'pin-ghul',
    title_th: 'กูล ปีศาจทะเลทรายอาหรับ',
    title_en: 'The Ghul of the Arabian Sands',
    category: 'curse',
    province_th: 'ริยาด (ซาอุดีอาระเบีย)',
    province_en: 'Riyadh (Saudi Arabia)',
    district_th: 'ทะเลทรายเดฮนา',
    district_en: 'Dahna Desert',
    lat: 24.7136,
    lng: 47.8,
    story_th:
      'กูล ปีศาจกินซากศพแห่งทะเลทรายอาหรับ อาศัยอยู่ตามสุสานโบราณ ถ้ำหิน และซากปรักหักพังกลางทะเลทรายเวิ้งว้าง มีเขี้ยวแหลมคม เล็บยาว และมีความสามารถในการแปลงกายเป็นสัตว์ป่าหรือหญิงงามเพื่อล่อลวงคาราวานอูฐให้หลงทางออกไปในทะเลทรายเพื่อฉีกเนื้อกิน',
    story_en:
      'The flesh-devouring demon of ancient Arabian folklore, haunting forgotten burial grounds and barren desert wastes. Armed with razor talons, it shape-shifts into desert travelers or solitary maidens to lure camel caravans off course into deadly sandstorms.',
    folklore_history_th:
      'ปรากฏในคัมภีร์และนิทานพันหนึ่งราตรี (One Thousand and One Nights) เชื่อกันว่าเป็นเผ่าพันธุ์หนึ่งของญิน (Jinn) ร้าย ในยุคโบราณคนเดินทางจะต้องพกดาบเหล็กและท่องบทสวดเพื่อป้องกันกูลในยามข้ามทะเลทรายรูบอัลคอลี',
    folklore_history_en:
      'Classified in pre-Islamic folklore as a predatory subspecies of Jinn. Famous throughout One Thousand and One Nights; nomadic Bedouins carried consecrated steel to ward off desert encounters.',
    image_url: '/entities/pin-ghul.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-ghul.jpg",
            "title": "กูล ปีศาจทะเลทรายอาหรับ"
      }
],
    is_published: 1,
  },

  // --- HAWAII / PACIFIC USA ---
  {
    id: 'pin-nightmarchers',
    title_th: 'ไนท์ มาร์เชอร์ส ขบวนวิญญาณฮาวาย',
    title_en: 'Night Marchers (Huakai po)',
    category: 'ghost',
    province_th: 'โออาฮู (ฮาวาย, สหรัฐอเมริกา)',
    province_en: 'Oahu (Hawaii, USA)',
    district_th: 'หุบเขานูอานุ',
    district_en: 'Nuuanu Valley',
    lat: 21.3297,
    lng: -157.8372,
    story_th:
      'ไนท์ มาร์เชอร์ส (ฮัวไก โป) ขบวนวิญญาณนักรบและหัวหน้าเผ่าโบราณแห่งฮาวาย เดินแถวในคืนเดือนมืดพร้อมเสียงตีกลองดังกึกก้อง เสียงเป่าหอยสังข์ และคบเพลิงไฟที่ลุกโชน หากคนธรรมดาพบเห็นจะต้องก้มหน้าหมอบลงกับพื้น ห้ามสบตาเด็ดขาด มิฉะนั้นจะถูกวิญญาณสังหารทันที',
    story_en:
      'The Huaka\'i Pō, spectral processions of deceased Hawaiian ali\'i chiefs and warriors. Marching on sacred moon nights accompanied by booming sharkskin drums and blazing torches, any mortal who looks upon them directly faces immediate execution unless an ancestral spirit vouches for them.',
    folklore_history_th:
      'เส้นทางเดินของขบวนวิญญาณจะทับซ้อนกับเส้นทางโบราณของเกาะโออาฮู โดยเฉพาะบริเวณหุบเขานูอูอานู ปาลี (Nuʻuanu Pali) ซึ่งเคยเป็นสมรภูมิรบครั้งประวัติศาสตร์ของพระเจ้าคาเมฮาเมฮาที่ 1 ในการรวบรวมหมู่เกาะฮาวาย',
    folklore_history_en:
      'Haunts sacred ancient battle trails across Oahu, notably the cliffs of Nuʻuanu Pali where King Kamehameha I fought the decisive 1795 battle that unified the Hawaiian kingdom.',
    image_url: '/entities/pin-nightmarchers.jpg',
    sound_preset: 'temple_bell',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-nightmarchers.jpg",
            "title": "ไนท์ มาร์เชอร์ส ขบวนวิญญาณฮาวาย"
      }
],
    is_published: 1,
  },

  // --- WEST AFRICA (GHANA) ---
  {
    id: 'pin-anansi',
    title_th: 'อนันซี แมงมุมปราชญ์แห่งเรื่องเล่า',
    title_en: 'Anansi, the Trickster Spider',
    category: 'sacred',
    province_th: 'อักกรา (กานา)',
    province_en: 'Accra (Ghana)',
    lat: 5.6037,
    lng: -0.1870,
    story_th:
      'อนันซี เทพแมงมุมปราชญ์จอมเจ้าเล่ห์แห่งแอฟริกาตะวันตก ผู้สามารถใช้ไหวพริบ ความเฉลียวฉลาด และคำพูดล่อลวงเอาชนะสัตว์ที่แข็งแกร่งกว่าอย่างเสือดาวและงูหลามยักษ์ เพื่อนำเรื่องเล่าและนิทานทั้งหมดในโลกมาจากพระเจ้าบนฟ้ามามอบให้แก่มนุษย์',
    story_en:
      'The legendary trickster spider deity of West African lore. Armed with sharp wit and storytelling wizardry rather than brute force, Anansi famously outsmarted pythons, hornets, and leopards to purchase all the world\'s wisdom and stories from the Sky God Nyame.',
    folklore_history_th:
      'เป็นหัวใจของวัฒนธรรมชาวอาชานตี (Ashanti) ในประเทศกานา เรื่องเล่าของอนันซีได้ข้ามมหาสมุทรแอตแลนติกไปกับเรือค้าทาส และกลายเป็นสัญลักษณ์แห่งความอยู่รอด ไหวพริบ และการต่อสู้ในแถบแคริบเบียนและอเมริกา',
    folklore_history_en:
      'Originated among the Ashanti people of Ghana. Anansi folktales survived the transatlantic slave trade, transforming into symbols of resilience and intellectual resistance across the Caribbean and Americas.',
    image_url: '/entities/pin-anansi.jpg',
    sound_preset: 'jungle_curse',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-anansi.jpg",
            "title": "อนันซี แมงมุมปราชญ์แห่งเรื่องเล่า"
      }
],
    is_published: 1,
  },

  // --- SOUTHERN AFRICA ---
  {
    id: 'pin-tokoloshe',
    title_th: 'โทโคโลชี ผีเตี้ยแห่งแม่น้ำ',
    title_en: 'The Tokoloshe of the Eastern Cape',
    category: 'curse',
    province_th: 'อีสเทิร์นเคป (แอฟริกาใต้)',
    province_en: 'Eastern Cape (South Africa)',
    lat: -31.9003,
    lng: 28.0,
    story_th:
      'โทโคโลชี ปีศาจแคระผู้มีขนดกและดวงตากลวงโบ๋ในคติชนซูลูและโคซา ถูกเสกสร้างขึ้นโดยหมอผีมนต์ดำเพื่อส่งไปขโมยของ หลอกหลอน หรือทำร้ายผู้คนในยามหลับใหล ชาวบ้านในแอฟริกาใต้จึงนิยมนำอิฐก้อนโตมาวางหนุนขาทั้งสี่ของเตียงนอนให้สูงขึ้นเพื่อป้องกันไม่ให้โทโคโลชีปีนขึ้นมาทำร้าย',
    story_en:
      'The mischievous dwarf water sprite of Zulu and Xhosa folklore, summoned through dark witchcraft to inflict illness and nocturnal paralysis. Traditional South African families raise their beds atop stacks of bricks to keep the creature from reaching them in their sleep.',
    folklore_history_th:
      'ยังคงเป็นความเชื่อที่เหนียวแน่นในพื้นที่ชนบทของอีสเทิร์นเคปและเมืองโจฮันเนสเบิร์ก ปรากฏเป็นข่าวหน้าหนึ่งในหนังสือพิมพ์ท้องถิ่นบ่อยครั้งเมื่อเกิดเหตุการณ์ลึกลับที่ไม่มีคำอธิบายทางวิทยาศาสตร์',
    folklore_history_en:
      'A persistent cultural belief across South Africa, particularly the Eastern Cape. Reports of Tokoloshe sightings and cleansing rituals by sangomas (traditional healers) frequently make national headlines.',
    image_url: '/entities/pin-tokoloshe.jpg',
    sound_preset: 'jungle_curse',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-tokoloshe.jpg",
            "title": "โทโคโลชี ผีเตี้ยแห่งแม่น้ำ"
      }
],
    is_published: 1,
  },

  // --- OCEANIA (NEW ZEALAND) ---
  {
    id: 'pin-taniwha',
    title_th: 'ตานีฟา อสูรเฝ้าน้ำของมาโอริ',
    title_en: 'The Taniwha of the Waikato',
    category: 'sacred',
    province_th: 'ไวคาโต (นิวซีแลนด์)',
    province_en: 'Waikato (New Zealand)',
    district_th: 'แม่น้ำไวคาโต',
    district_en: 'Waikato River',
    lat: -37.7833,
    lng: 175.2833,
    story_th:
      'ตานีฟา สิ่งมีชีวิตศักดิ์สิทธิ์ผู้พิทักษ์สายน้ำ ถ้ำลึก และโค้งน้ำอันตรายของชาวมาโอริ มีรูปร่างคล้ายกิ้งก่ายักษ์ วาฬ หรือมังกรทะเล คอยช่วยเหลือชนเผ่าที่ให้ความเคารพ แต่จะลงทัณฑ์ผู้ที่ละเมิดข้อห้าม (Tapu) ด้วยการคว่ำเรือแคนูหรือบันดาลให้เกิดคลื่นยักษ์กลืนกิน',
    story_en:
      'The supernatural water guardians of Māori tradition in New Zealand, residing in deep river bends, coastal caves, and ocean currents. While serving as protective ancestral guardians (kaitiaki), they fiercely punish those who breach sacred taboos.',
    folklore_history_th:
      'ตามแนวแม่น้ำไวคาโตมีคำกล่าวโบราณของชาวมาโอริว่า "Waikato taniwha rau" หมายถึงแม่น้ำไวคาโตมีตานีฟาร้อยตนคอยคุ้มครองทุกคุ้งน้ำ และมีผลต่อการวางผังโครงการก่อสร้างและกฎหมายสิ่งแวดล้อมของนิวซีแลนด์ในปัจจุบัน',
    folklore_history_en:
      'Deeply respected along the Waikato River basin. The Māori proverb "Waikato taniwha rau" honors the guardians of each river bend, frequently recognized under New Zealand environmental and cultural law.',
    image_url: '/entities/pin-taniwha.jpg',
    sound_preset: 'water_spirit',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-taniwha.jpg",
            "title": "ตานีฟา อสูรเฝ้าน้ำของมาโอริ"
      }
],
    is_published: 1,
  },

  // --- POLAND ---
  {
    id: 'pin-wawel',
    title_th: 'มังกรเวเวลแห่งกรากุฟ',
    title_en: 'The Wawel Dragon of Krakow',
    category: 'monster',
    province_th: 'กรากุฟ (โปแลนด์)',
    province_en: 'Krakow (Poland)',
    district_th: 'เนินเวเวล',
    district_en: 'Wawel Hill',
    lat: 50.0540,
    lng: 19.9354,
    story_th:
      'มังกรเวเวล สัตว์ร้ายยุคโบราณที่อาศัยอยู่ในถ้ำใต้เนินเขาปราสาทวาเวล เมืองกรากุฟ มันพ่นไฟเผาทำลายบ้านเรือนและเรียกร้องเครื่องสังเวยเป็นฝูงวัวและหญิงสาวบริสุทธิ์ จนกระทั่งช่างทำรองเท้าหนุ่ม สกูบา ใช้ขนแกะยัดไส้ด้วยกำมะถันล่อมังกรกิน เมื่อมังกรกระหายน้ำจัดจนดื่มน้ำแม่น้ำวิสตูลาจนท้องแตกตาย',
    story_en:
      'The legendary fire-breathing dragon inhabiting a limestone cave beneath Wawel Hill in Kraków. Terrorizing King Krak’s realm by devouring cattle and maidens, the beast was finally slain when a clever cobbler apprentice baited it with a sulfur-stuffed sheep carcass.',
    folklore_history_th:
      'ถ้ำมังกร (Smocza Jama) ใต้ปราสาทหลวงวาเวลยังคงเปิดให้นักท่องเที่ยวเข้าชม ด้านหน้าถ้ำมีรูปปั้นทองสัมฤทธิ์ของมังกรเวเวลที่พ่นไฟจริงออกมาทุกๆ ไม่กี่นาที เป็นสัญลักษณ์ประจำเมืองกรากุฟตั้งแต่ศตวรรษที่ 13',
    folklore_history_en:
      'Chronicled by Wincenty Kadłubek in the 13th century. Today, Smocza Jama (Dragon\'s Den) beneath Kraków’s royal castle features a bronze fire-breathing dragon statue overlooking the Vistula River.',
    image_url: '/entities/pin-wawel.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-wawel.jpg",
            "title": "มังกรเวเวลแห่งกรากุฟ"
      }
],
    is_published: 1,
  },

  // --- SOUTHEAST ASIA (EXPANDED) ---
  {
    id: 'pin-mada',
    title_th: 'แม่ดา ผีน้ำเสื้อแดงแห่งสายธาร',
    title_en: 'Ma Da, the Red-Dressed Water Ghost',
    category: 'ghost',
    province_th: 'ฮานอย (เวียดนาม)',
    province_en: 'Hanoi (Vietnam)',
    lat: 21.0285,
    lng: 105.8542,
    story_th:
      'แม่ดา ผีพรายน้ำเสื้อแดงแห่งเวียดนาม วิญญาณของผู้หญิงที่จมน้ำเสียชีวิตอย่างทุกข์ทรมานและยังไม่สามารถไปผุดไปเกิดได้ เธอจะซ่อนตัวอยู่ใต้กอผักตบชวาและสายน้ำลึกของแม่น้ำด่งนาย โผล่ขึ้นมาลวงเด็กหรือผู้สัญจรทางเรือให้ลงไปในน้ำ แล้วดึงขาจมดิ่งเพื่อเป็นตัวตายตัวแทน',
    story_en:
      'The tragic red-shrouded water ghost of Vietnamese waterways. Trapped in the murky depths of river currents where she drowned, Ma Da lurks beneath dense water hyacinths, grabbing the ankles of solitary swimmers to take their place in the afterlife.',
    folklore_history_th:
      'เป็นตำนานที่ชาวประมงและคนหาปลาลุ่มน้ำด่งนายและสามเหลี่ยมปากแม่น้ำโขงให้ความเคารพยำเกรง มักมีการตั้งศาลเล็กๆ ริมตลิ่งและจุดธูปบอกกล่าวทุกครั้งก่อนออกเรือเพื่อขอความปลอดภัย',
    folklore_history_en:
      'A foundational aquatic ghost legend along the Dong Nai and Mekong river systems in Vietnam. River boatmen and fishermen erect riverside shrines and burn joss paper to appease drowned spirits before night voyages.',
    image_url: '/entities/pin-mada.jpg',
    sound_preset: 'water_spirit',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-mada.jpg",
            "title": "แม่ดา ผีน้ำเสื้อแดงแห่งสายธาร"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-neakta',
    title_th: 'แนกตา เจ้าที่ผู้พิทักษ์หมู่บ้าน',
    title_en: 'Neak Ta, the Guardian of the Land',
    category: 'sacred',
    province_th: 'เสียมราฐ (กัมพูชา)',
    province_en: 'Siem Reap (Cambodia)',
    district_th: 'ดินแดนโบราณเมืองพระนคร',
    district_en: 'Angkor Plain',
    lat: 13.3633,
    lng: 103.8564,
    story_th:
      'แนกตา ดวงวิญญาณบรรพชนและเจ้าที่ผู้ทรงอำนาจแห่งแผ่นดินกัมพูชา สิงสถิตอยู่ในก้อนหินธรรมชาติ ต้นไม้ใหญ่ หรือศาลาริมทาง ทำหน้าที่ปกปักรักษาหมู่บ้าน ปัดเป่าโรคภัย และดลบันดาลให้ฝนตกตามฤดูกาล แต่หากชาวบ้านลบหลู่ทำลายผืนป่า จะถูกลงทัณฑ์ด้วยความเจ็บป่วยทันที',
    story_en:
      'The omnipresent ancestral territorial spirits of Cambodia. Dwelling in sacred natural monoliths, termite mounds, and ancient trees, Neak Ta protect village boundaries and govern rainfall, meting out fever or misfortune to those who dishonor the land.',
    folklore_history_th:
      'เป็นความเชื่อวิญญาณนิยม (Animism) ดั้งเดิมของชาวเขมรที่มีมาก่อนการรับศาสนาพราหมณ์-ฮินดูและพุทธศาสนา ศาลแนกตาจะพบได้ทั่วไปรอบนครวัดและตามชนบทของเสียมราฐ',
    folklore_history_en:
      'Predates Hindu and Buddhist influences in Khmer civilization. Countless Neak Ta shrines dot the landscapes around Angkor Wat and rural Siem Reap, receiving offerings of betel nut and rice wine.',
    image_url: '/entities/pin-neakta.jpg',
    sound_preset: 'temple_bell',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-neakta.jpg",
            "title": "แนกตา เจ้าที่ผู้พิทักษ์หมู่บ้าน"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-natpopa',
    title_th: 'เจ้าแม่ป้อปะมะเดาะแห่งภูเขาโปปา',
    title_en: 'The Popa Nat of Mount Popa',
    category: 'sacred',
    province_th: 'เมียนมา',
    province_en: 'Myanmar',
    district_th: 'ยอดภูเขาโปปา เหนือทะเลทรายแห้ง',
    district_en: 'Mount Popa, the Dry Zone',
    lat: 20.904,
    lng: 95.9186,
    story_th:
      'นัตโปปามะเดาะ มหาเทวีผู้พิทักษ์ภูเขาโปปา ประเทศพม่า ทรงเป็น "แม่แห่งโปปา" ผู้มีอิทธิฤทธิ์ดูแลสมุนไพรและสายหมอกบนยอดเขาภูเขาไฟโบราณ ตามตำนานทรงเป็นยักษิณีผู้กินดอกไม้เป็นอาหาร และตกหลุมรักกับเบียตตะยอดขุนพลหลวง ก่อนจะสิ้นชีวิตด้วยความตรอมใจ',
    story_en:
      'The Popa Medaw (Mother of Popa), one of the supreme figures among the 37 Great Nats of Myanmar. A flower-eating ogress of immense beauty who married royal warrior Byatta, her grief-stricken death elevated her to guardian spirit of the volcanic mountain.',
    folklore_history_th:
      'ภูเขาโปปาในเมืองพุกามถือเป็น "เขาโอลิมปัสแห่งพม่า" ทุกๆ ปีจะมีเทศกาลบูชานัตครั้งใหญ่ที่มีร่างทรง (นัตกะด่อ) และผู้แสวงบุญนับแสนคนเดินทางมาเต้นรำถวายเพื่อขอความเจริญรุ่งเรือง',
    folklore_history_en:
      'Mount Popa near Bagan is revered as the spiritual Olympus of Myanmar. An extinct volcanic plug crowned by monasteries, it attracts thousands of Nat-Kadaw spirit mediums during annual Nat festivals.',
    image_url: '/entities/pin-natpopa.jpg',
    sound_preset: 'temple_bell',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-natpopa.jpg",
            "title": "เจ้าแม่ป้อปะมะเดาะแห่งภูเขาโปปา"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-mosina',
    title_th: 'โมซินอา ภูติน้อยแห่งขุนเขาไต้หวัน',
    title_en: 'Mô-sîn-á, the Mountain Sprite',
    category: 'legend',
    province_th: 'เจียอี้ (ไต้หวัน)',
    province_en: 'Chiayi (Taiwan)',
    district_th: 'ป่าอาหลีซาน',
    district_en: 'Alishan Forest',
    lat: 23.5098,
    lng: 120.8017,
    story_th:
      'โมซินอา ภูตจิ๋วเด็กชุดแดงแห่งขุนเขาไต้หวัน รูปร่างคล้ายลิงหรือเด็กเล็ก ผิวสีคล้ำและเคลื่อนไหวว่องไวตามยอดไม้ มักล่อลวงผู้สูงอายุหรือนักเดินป่าให้เดินหลงเข้าไปในหุบเขาลึก โดยเหยื่อจะรู้สึกเหมือนมีคนจูงมือไปกิน "ของอร่อย" ซึ่งความจริงเป็นแมลง ดิน หรือใบไม้แห้ง',
    story_en:
      'The elusive red-clothed mountain sprite of Taiwanese folklore. Resembling a swift monkey-like child, Mô-sîn-á hypnotizes hikers and elders in misty bamboo groves, feeding them earthworms and dirt disguised as delectable feasts while leading them astray.',
    folklore_history_th:
      'เป็นหนึ่งในตำนานลี้ลับร่วมสมัยที่โด่งดังที่สุดของไต้หวัน โดยเฉพาะตามเส้นทางเดินป่ารอบเทือกเขาหยางหมิงซาน และเป็นแรงบันดาลใจให้กับภาพยนตร์สยองขวัญชื่อดัง "The Tag-Along"',
    folklore_history_en:
      'A prominent fixture of modern Taiwanese folklore and search-and-rescue reports, inspiring the hit horror film franchise "The Tag-Along" in the misty Yangmingshan mountain range.',
    image_url: '/entities/pin-mosina.jpg',
    sound_preset: 'jungle_curse',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-mosina.jpg",
            "title": "โมซินอา ภูติน้อยแห่งขุนเขาไต้หวัน"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-mahasona',
    title_th: 'มหาโสณา มาราผู้หญิงแห่งป่าช้า',
    title_en: 'Mahasona, the Graveyard Giantess',
    category: 'ghost',
    province_th: 'โกลมโบ (ศรีลังกา)',
    province_en: 'Colombo (Sri Lanka)',
    lat: 6.9271,
    lng: 79.8612,
    story_th:
      'มหาโสณา อสูรยักษ์แห่งป่าช้าและสุสานโบราณของศรีลังกา มีร่างกายสีดำทมึน หัวเป็นหมี ขี่หมูป่าสีเลือดเป็นพาหนะ คอยล่ามนุษย์ในยามค่ำคืน เมื่อมันเข้าใกล้เหยื่อทางด้านหลัง จะใช้ฝ่ามือขนาดยักษ์ฟาดเข้าที่แผ่นหลัง ทิ้งรอยประทับไหม้เกรียมเป็นรูปฝ่ามือทำให้เหยื่อเสียชีวิตทันที',
    story_en:
      'The dreaded graveyard demon of Sri Lankan folklore. Bearing the body of an ogre and the fierce head of a bear while riding a phantom boar, Mahasona strikes solitary travelers on the back, leaving a fatal scorched handprint upon their flesh.',
    folklore_history_th:
      'ตามประวัติศาสตร์เชื่อว่ามีต้นกำเนิดจากนักรบยักษ์ริทิกาลา ชายา ในศตวรรษที่ 2 ก่อนคริสตกาล ปัจจุบันชาวศรีลังกายังคงจัดพิธีขับไล่ผีโบราณ "โสณา ยาคุมะ" (Sona Yakuma) เพื่อรักษาผู้ที่เชื่อว่าถูกมหาโสณาสิงสู่',
    folklore_history_en:
      'Legend traces back to the 2nd century BCE champion warrior Ritigala Jayasena. Traditional Sinhala exorcists continue to perform the elaborate all-night "Sona Yakuma" ritual to dispel its curse.',
    image_url: '/entities/pin-mahasona.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-mahasona.jpg",
            "title": "มหาโสณา มาราผู้หญิงแห่งป่าช้า"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-deathworm',
    title_th: 'หนอนมรณะแห่งโกบี',
    title_en: 'The Mongolian Death Worm',
    category: 'monster',
    province_th: 'โกบี อัลไต (มองโกเลีย)',
    province_en: 'Gobi Altai (Mongolia)',
    district_th: 'ทะเลทรายโกบี',
    district_en: 'Gobi Desert',
    lat: 43.53,
    lng: 103.54,
    story_th:
      'หนอนมรณะแห่งโกบี (ออลกอย-คอร์คอย) สัตว์ประหลาดใต้ผืนทรายสีเพลิงของมองโกเลีย มีลำตัวอวบอ้วนสีแดงสดคล้ายไส้กรอกวัว ยาวประมาณ 1–1.5 เมตร ไม่มีตาและจมูกที่ชัดเจน สามารถปล่อยกระแสไฟฟ้าแรงสูงหรือพ่นกรดพิษสีเหลืองที่มีฤทธิ์กัดกร่อนรุนแรงสังหารอูฐและคนได้ในระยะไกล',
    story_en:
      'The Olgoi-Khorkhoi (Intestine Worm) of the southern Gobi Desert. A thick, arm-length blood-red subterranean cryptid capable of killing at a distance by discharging high-voltage electrical shocks or spitting deadly corrosive yellow venom.',
    folklore_history_th:
      'ได้รับการบอกเล่าต่อกันมาในหมู่ชนเผ่าเร่ร่อนมองโกเลียมาหลายร้อยปี และถูกบันทึกสู่โลกตะวันตกเป็นครั้งแรกโดยนักบรรพชีวินวิทยา รอย แชปแมน แอนดรูว์ส ในปี ค.ศ. 1926 ระหว่างการสำรวจฟอสซิลไดโนเสาร์ในมองโกเลีย',
    folklore_history_en:
      'Documented in Western expedition journals by Roy Chapman Andrews in 1926. Nomadic camel herders avoid remote dune areas in June and July when the creature supposedly surfaces during desert rainstorms.',
    image_url: '/entities/pin-deathworm.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-deathworm.jpg",
            "title": "หนอนมรณะแห่งโกบี"
      }
],
    is_published: 1,
  },

  // --- EUROPE (EXPANDED) ---
  {
    id: 'pin-shahmaran',
    title_th: 'ชาฮ์มาราน ราชินีนาคครึ่งคนครึ่งงู',
    title_en: 'Shahmaran, the Serpent Queen',
    category: 'sacred',
    province_th: 'ทาร์ซุส (ตุรกี)',
    province_en: 'Tarsus (Turkey)',
    district_th: 'บ่อน้ำโบราณเมืองทาร์ซุส',
    district_en: 'Ancient Cistern of Tarsus',
    lat: 36.8972,
    lng: 34.8994,
    story_th:
      'ชาฮ์มาราน ราชินีนาคครึ่งมนุษย์ครึ่งงูแห่งตำนานตะวันออกกลาง มีท่อนบนเป็นสตรีผู้ทรงปัญญาเลอโฉม และท่อนล่างเป็นงูยักษ์ อาศัยอยู่ในสวนสวรรค์ใต้ดินอันอุดมด้วยขุมทรัพย์และพืชสมบัติวิเศษ เธอเสียสละชีวิตและเนื้อของตนเองเพื่อรักษาอาการป่วยของกษัตริย์',
    story_en:
      'The wise and benevolent Queen of Serpents in Middle Eastern and Kurdish folklore. With the radiant upper body of a woman and the lower coils of a serpent, she ruled an underground realm of crystal gardens and profound medical wisdom.',
    folklore_history_th:
      'เป็นสัญลักษณ์ศักดิ์สิทธิ์แห่งการเยียวยา สติปัญญา และความภักดีในเมืองทาร์ซัส (Tarsus) และอนาโตเลีย ภาพวาดของชาฮ์มารานิยมแขวนไว้ในบ้านเรือนเพื่อคุ้มครองโรคภัยและความชั่วร้าย',
    folklore_history_en:
      'An enduring cultural emblem of healing and protective sacrifice throughout Anatolia and Mesopotamia. Traditional folk paintings of Shahmaran are hung in homes to bestow good health.',
    image_url: '/entities/pin-shahmaran.jpg',
    sound_preset: 'temple_bell',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-shahmaran.jpg",
            "title": "ชาฮ์มาราน ราชินีนาคครึ่งคนครึ่งงู"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-azzurrina',
    title_th: 'อัซซูร์รีนา เด็กหญิงผมสีน้ำเงิน',
    title_en: 'Azzurrina, the Little Blue Girl',
    category: 'ghost',
    province_th: 'เทือกเขาอเพนไนน์ (อิตาลี)',
    province_en: 'Apennine Mountains (Italy)',
    district_th: 'หมู่บ้านบนเขาของพื้นที่เออรินเนียน',
    district_en: 'A Mountain Hamlet of the Apennines',
    lat: 44.13,
    lng: 11.75,
    story_th:
      'อัซซูร์รีนา (กวเอนดาลินา) เด็กหญิงผมสีน้ำเงินแห่งปราสาทมอนเตเบลโล ประเทศอิตาลี เกิดมาพร้อมภาวะผิวเผือก มารดาจึงย้อมผมด้วยสีสมุนไพรจนผมกลายเป็นสีน้ำเงิน ในคืนวันครีษมายันปี 1375 เธอวิ่งตามลูกบอลลงไปในห้องใต้ดินของปราสาทแล้วหายสาบสูญไปอย่างไร้ร่องรอย ทิ้งไว้เพียงเสียงสะอื้นไห้ที่ยังดังก้องทุกๆ 5 ปี',
    story_en:
      'The ghost of Guendalina, the blue-haired albino girl of Montebello Castle in Emilia-Romagna. On the summer solstice of 1375, she chased a rag ball into the castle\'s subterranean ice vaults and vanished forever into thin air, leaving eerie spectral whispers recorded by acoustic researchers.',
    folklore_history_th:
      'ปราสาทมอนเตเบลโลเป็นป้อมปราการยุคกลางที่เปิดให้นักท่องเที่ยวเข้าชม ทุกๆ วันที่ 21 มิถุนายนของปีที่ลงท้ายด้วย 0 และ 5 นักวิจัยด้านเสียงอาถรรพ์ (EVP) จะมาบันทึกเสียงร้องไห้ของเด็กหญิงซึ่งดังชัดเจนในห้องใต้ดิน',
    folklore_history_en:
      'Guarded atop Montebello Castle. Acoustic recordings made every five years on the summer solstice capture mysterious cries of a child that puzzle paranormal researchers worldwide.',
    image_url: '/entities/pin-azzurrina.jpg',
    sound_preset: 'whisper',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-azzurrina.jpg",
            "title": "อัซซูร์รีนา เด็กหญิงผมสีน้ำเงิน"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-santacompana',
    title_th: 'ซานตากอมปันยา ขบวนวิญญาณแห่งกาลิเซีย',
    title_en: 'Santa Compaña, the Ghostly Procession',
    category: 'ghost',
    province_th: 'กาลิเซีย (สเปน)',
    province_en: 'Galicia (Spain)',
    district_th: 'ถนนขบวนโบราณของกาลิเซีย',
    district_en: 'Ancient Paths of Galicia',
    lat: 42.95,
    lng: -8.42,
    story_th:
      'ซานตากอมปันยา ขบวนวิญญาณแห่งความตายในแคว้นกาลิเซีย ทางตะวันตกเฉียงเหนือของสเปน นำขบวนโดยคนเป็นที่ถูกสะกดจิตให้ถือไม้กางเขนและหม้อน้ำมนต์ ตามด้วยแถวดวงวิญญาณสวมผ้าคลุมสีขาวถือเทียนไขที่ส่องแสงเรืองรองในยามดึก เพื่อประกาศเตือนว่าจะมีคนในหมู่บ้านเสียชีวิตในไม่ช้า',
    story_en:
      'The spectral night procession of Galicia, Spain. Led involuntarily by a living human in a trance bearing a heavy cross and holy water, followed by hooded wandering souls holding glowing candles, marching silently along foggy country roads to foretell death.',
    folklore_history_th:
      'มีรากเหง้ามาจากตำนานขบวนล่าวิญญาณ (Wild Hunt) ของเซลติกโบราณผสมผสานกับคาทอลิก ชาวบ้านจะวาดวงกลมชอล์กบนพื้นดินหรือก้มลงกอดไม้กางเขนหินครูเซโร (Cruceiro) เพื่อเอาชีวิตรอดหากเผชิญหน้ากับขบวน',
    folklore_history_en:
      'Deeply entrenched in Galician Celtic lore. Travelers protect themselves by stepping inside a chalk circle (Solomon\'s ring) or clinging to stone Cruceiro wayside crosses until the procession passes.',
    image_url: '/entities/pin-santacompana.jpg',
    sound_preset: 'whisper',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-santacompana.jpg",
            "title": "ซานตากอมปันยา ขบวนวิญญาณแห่งกาลิเซีย"
      }
],
    is_published: 1,
  },

  // --- AMERICAS (EXPANDED) ---
  {
    id: 'pin-sasquatch',
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-sasquatch.jpg",
            "title": "แซสควัทช์ มนุษย์ป่ายักษ์แห่งชายฝั่งแปซิฟิก"
      }
],
    title_th: 'แซสควัทช์ มนุษย์ป่ายักษ์แห่งชายฝั่งแปซิฟิก',
    title_en: 'Sasquatch, the Wild Man of the Pacific Northwest',
    category: 'monster',
    province_th: 'บริติชโคลัมเบีย (แคนาดา)',
    province_en: 'British Columbia (Canada)',
    district_th: 'ป่าฝนชายฝั่งแปซิฟิก',
    district_en: 'Coastal Rainforest',
    lat: 49.9,
    lng: -122.8,
    story_th:
      'แซสควัทช์ หรือ บิ๊กฟุต วานรยักษ์สองขาแห่งป่าสนดงดิบแถบแปซิฟิกนอร์ทเวสต์ มีความสูงกว่า 2.5–3 เมตร ร่างกายบึกบึนกำยำ ขนดกหนาสีน้ำตาลเข้ม ส่งเสียงเคาะท่อนไม้ดังก้องและมีกลิ่นสาบฉุนรุนแรง ทิ้งรอยเท้าขนาดยักษ์ยาวกว่า 45 เซนติเมตรไว้ในดินโคลน',
    story_en:
      'The legendary bipedal ape-man inhabiting the ancient temperate rainforests of the Pacific Northwest. Standing up to 3 meters with dark matted fur, immense shoulder breadth, and iconic 45 cm footprints, it communicates via resonant wood knocks and deep guttural howls.',
    folklore_history_th:
      'ชนเผ่าพื้นเมืองอเมริกันแถบชายฝั่งตะวันตกบันทึกเรื่องเล่าของ "Sasq\'ets" ผู้พิทักษ์ป่าดงดิบมาหลายร้อยปี ก่อนที่คลิปฟิล์มประวัติศาสตร์ Patterson-Gimlin ในปี 1967 จะจุดกระแสการตามหาบิ๊กฟุตไปทั่วโลก',
    folklore_history_en:
      'Rooted in Coast Salish oral histories of "Sasq\'ets". Thrust into international celebrity status following Roger Patterson and Bob Gimlin\'s iconic 1967 16mm film footage at Bluff Creek, California.',
    image_url: '/entities/pin-sasquatch.jpg',
    sound_preset: 'jungle_curse',
    views_count: 2500,
    is_published: 1,
  },
  {
    id: 'pin-trauco',
    title_th: 'เทราโก ภูตจอมเสน่ห์แห่งเกาะชิโลเอ',
    title_en: 'El Trauco, the Bewitching Goblin of Chiloe',
    category: 'legend',
    province_th: 'ชิโลเอ (ชิเล)',
    province_en: 'Chiloe Archipelago (Chile)',
    district_th: 'ป่าดิบของเกาะกีโต',
    district_en: 'Forests of Chiloe',
    lat: -42.55,
    lng: -73.72,
    story_th:
      'เทราโก ภูตแคระอัปลักษณ์ผู้มีพละกำลังมหาศาลแห่งเกาะชิโลเอ ประเทศชิลี อาศัยอยู่ตามโพรงไม้ใหญ่ในป่าดึกดำบรรพ์ ถือขวานหินและไม้เท้าวิเศษ มีสายตาสะกดจิตทรงพลังที่ทำให้หญิงสาวหลงใหลในมนต์สะกดและตกเป็นเหยื่อโดยไม่รู้ตัว',
    story_en:
      'The mythical dwarf troll of Chiloé Island, Chile. Despite his grotesque face and legless stumps, El Trauco wields irresistible hypnotic gaze and a magical stone hatchet, seducing solitary maidens venturing into the dense Valdivian rainforest.',
    folklore_history_th:
      'เป็นตำนานที่ชาวเกาะชิโลเอใช้เป็นคำอธิบายดั้งเดิมในกรณีที่หญิงสาวตั้งครรภ์โดยไม่มีสามี และเป็นคติเตือนใจให้สตรีระมัดระวังการเดินเข้าป่าตามลำพัง',
    folklore_history_en:
      'An integral part of Chilotan mythology used socially to explain unexpected pregnancies in rural communities and warn young women against wandering unattended into remote rainforests.',
    image_url: '/entities/pin-trauco.jpg',
    sound_preset: 'whisper',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-trauco.jpg",
            "title": "เทราโก ภูตจอมเสน่ห์แห่งเกาะชิโลเอ"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-pishtaco',
    title_th: 'พิชตาโก จอมปลอมหนวดขาวที่ลนไขมันมนุษย์',
    title_en: 'El Pishtaco, the Fat-Collecting Bandit',
    category: 'monster',
    province_th: 'คุสโก (เปรู)',
    province_en: 'Cusco (Peru)',
    district_th: 'ทางลาดขึ้นเทือกเขาแอนดีส',
    district_en: 'Andean Highroads',
    lat: -13.52,
    lng: -71.97,
    story_th:
      'พิชตาโก จอมโจรลึกลับรูปร่างสูงใหญ่ผิวขาวหนวดเคราสีทองในคติชนชาวแอนดีส ประเทศเปรู ออกดักซุ่มตามทางเดินบนภูเขาสูงในยามค่ำคืน ใช้มีดโค้งปาดคอผู้เดินทางและนำศพไปลนไฟเพื่อสกัดไขมันมนุษย์บริสุทธิ์ไปขายให้แก่อุตสาหกรรมหรือโรงหล่อระฆัง',
    story_en:
      'The predatory monster of the Peruvian Andes. Manifesting as a bearded pale foreigner roaming high mountain passes, the Pishtaco ambushes solitary indigenous travelers to harvest their bodily fat (unto) for industrial and mystical trade.',
    folklore_history_th:
      'สะท้อนความทรงจำอันเจ็บปวดจากการถูกล่าอาณานิคมโดยชาวสเปนในศตวรรษที่ 16 ที่กดขี่และรีดนาทาเร้นชาวอินคา จนแปรเปลี่ยนเป็นเรื่องเล่าของปีศาจสูบไขมันมนุษย์ที่สืบทอดมาจนถึงปัจจุบัน',
    folklore_history_en:
      'Embodies centuries of indigenous trauma from Spanish colonial exploitation in the high Andes, where Spanish conquerors used native fat to grease weaponry and church bells.',
    image_url: '/entities/pin-pishtaco.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-pishtaco.jpg",
            "title": "พิชตาโก จอมปลอมหนวดขาวที่ลนไขมันมนุษย์"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-patasola',
    title_th: 'ปาตาโซลา ปีศาจขาเดียวแห่งป่าโคลอมเบีย',
    title_en: 'La Patasola, the One-Footed Woman of the Jungle',
    category: 'monster',
    province_th: 'บอยากา (โคลอมเบีย)',
    province_en: 'Boyaca (Colombia)',
    district_th: 'ป่าทึบแห่งบอยากา',
    district_en: 'Deep Jungle of the Machetá River',
    lat: 4.6,
    lng: -74.2,
    story_th:
      'ปาตาโซลา ปีศาจสาวขาเดียวแห่งป่าดงดิบโคลอมเบีย มีขาเดียวตรงกลางลำตัวแต่กระโดดได้รวดเร็วปานลมกรด เธอจะแปลงกายเป็นหญิงงามส่งเสียงกรีดร้องขอความช่วยเหลือ เมื่อนายพรานหรือคนตัดไม้หลงเชื่อเข้ามาช่วย เธอจะกลายร่างเป็นอสูรร้ายเขี้ยวแหลมคมขย้ำกินเนื้อและดื่มเลือดของเหยื่อ',
    story_en:
      'The one-legged female phantom guarding the deep Colombian jungles. Hopping with astonishing speed on a single central foot, she transforms into a seductive woman calling for rescue, only to reveal ferocious fangs and devour men who disrespect nature.',
    folklore_history_th:
      'มีต้นกำเนิดจากเรื่องเล่าของภรรยาที่ถูกสามีลงโทษด้วยการตัดขาหลังจากคบชู้ และกลายเป็นวิญญาณแค้นผู้พิทักษ์ป่าและสัตว์ป่าจากการล่าที่ทำลายสมดุลธรรมชาติ',
    folklore_history_en:
      'A cautionary jungle fable rooted in domestic betrayal and environmental stewardship, warning hunters against violating forest taboos and abandoning domestic loyalties.',
    image_url: '/entities/pin-patasola.jpg',
    sound_preset: 'jungle_curse',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-patasola.jpg",
            "title": "ปาตาโซลา ปีศาจขาเดียวแห่งป่าโคลอมเบีย"
      }
],
    is_published: 1,
  },

  // --- MIDDLE EAST & AFRICA (EXPANDED) ---
  {
    id: 'pin-pazuzu',
    title_th: 'ปาซูซู ปีศาจลมพายุแห่งบาบิโลน',
    title_en: 'Pazuzu, the Demon of the Babylonian Wind',
    category: 'monster',
    province_th: 'บาบิโลน (อิรัก)',
    province_en: 'Babylon (Iraq)',
    district_th: 'ซากปรักหักพังเมืองบาบิโลน',
    district_en: 'Ruins of Babylon',
    lat: 32.54,
    lng: 44.42,
    story_th:
      'ปาซูซู ราชาแห่งปีศาจลมพายุในเทพปกรณัมบาบิโลนและอัสซีเรียโบราณ มีใบหน้าของสุนัขหรือสิงโต มีเขาคู่ กรงเล็บนกอินทรี ปีกนกสี่คู่ และหางแมงป่อง เป็นผู้นำพายุฝนตั๊กแตน ความอดอยาก และไข้ทรพิษ แต่ในขณะเดียวกันก็ถูกอัญเชิญมาเพื่อขับไล่ปีศาจลามัสตูศัตรูคู่อาฆาต',
    story_en:
      'The demonic King of the Wind Spirits in ancient Mesopotamian mythology. Bearing the snarling face of a hound, four feathered wings, taloned feet, and a scorpion tail, Pazuzu directed locust storms, yet was invoked on amulets to drive away the child-snatching demoness Lamashtu.',
    folklore_history_th:
      'รูปสลักบรอนซ์ของปาซูซูตั้งแต่ศตวรรษที่ 8 ก่อนคริสตกาลถูกค้นพบในเมืองโบราณนีเนเวห์ (ปัจจุบันในอิรัก) และจัดแสดงในพิพิธภัณฑ์ลูฟร์ กลายเป็นสัญลักษณ์สำคัญในวัฒนธรรมสมัยใหม่จากภาพยนตร์สยองขวัญระดับตำนาน "The Exorcist"',
    folklore_history_en:
      'Archaeological bronze amulets from the 8th century BCE were unearthed at Nineveh. Cemented in modern popular consciousness as the ancient possessing entity in William Peter Blatty\'s "The Exorcist".',
    image_url: '/entities/pin-pazuzu.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-pazuzu.jpg",
            "title": "ปาซูซู ปีศาจลมพายุแห่งบาบิโลน"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-manticore',
    title_th: 'แมนทิคอร์ สัตว์ประหลาดหน้ามนุษย์ของเปอร์เซีย',
    title_en: 'The Manticore, Man-Faced Beast of Persia',
    category: 'monster',
    province_th: 'เปอร์เซโปลิส (อิหร่าน)',
    province_en: 'Persepolis (Iran)',
    district_th: 'ป่าที่ราบสูงเปอร์เซีย',
    district_en: 'Highland Woods of Persia',
    lat: 29.93,
    lng: 52.89,
    story_th:
      'แมนทิคอร์ อสูรกายกระหายเลือดแห่งเปอร์เซียโบราณ มีใบหน้าและดวงตาสีฟ้าคล้ายมนุษย์ ร่างกายเป็นสิงโตสีแดงเพลิง ปีกค้างคาว และหางแมงป่องยักษ์ที่สามารถยิงหนามพิษได้เหมือนลูกธนู ส่งเสียงร้องแหลมคล้ายเสียงขลุ่ยผสมแตรศึก และกลืนกินเหยื่อทั้งตัวโดยไม่เหลือเศษกระดูก',
    story_en:
      'The man-eating chimeric beast of ancient Persian folklore. Boasting a human face with triple rows of teeth, the crimson body of a lion, and a scorpion tail capable of shooting lethal venomous darts, its call sounds like the harmonious blare of panpipes and trumpets.',
    folklore_history_th:
      'ถูกบันทึกสู่โลกตะวันตกโดยแพทย์ชาวกรีก คเทเซียส (Ctesias) ในศตวรรษที่ 5 ก่อนคริสตกาล และปรากฏในงานเขียนของเพลโตและอริสโตเติลในฐานะสัตว์ดุร้ายแห่งดินแดนตะวันออกไกล',
    folklore_history_en:
      'First described to classical antiquity by Greek physician Ctesias in Indica during the 5th century BCE, later popularized across medieval European bestiaries as the epitome of feral terror.',
    image_url: '/entities/pin-manticore.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-manticore.jpg",
            "title": "แมนทิคอร์ สัตว์ประหลาดหน้ามนุษย์ของเปอร์เซีย"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-madamkoi',
    title_th: 'แม่นางคอยพอย ผู้มีรองเท้าส้นสูงแห่งโรงเรียนประจำ',
    title_en: 'Madam Koi Koi, the High-Heel Ghost',
    category: 'ghost',
    province_th: 'ลากอส (ไนจีเรีย)',
    province_en: 'Lagos (Nigeria)',
    district_th: 'โรงเรียนประจำรุ่นเก่าของลากอส',
    district_en: 'The Old Boarding Schools',
    lat: 6.5244,
    lng: 3.3792,
    story_th:
      'แม่นางคอยพอย ผีครูสาวส้นสูงสีแดงแห่งโรงเรียนประจำในแอฟริกาตะวันตก เธอจะเดินตรวจตรายามค่ำคืนในหอพักพร้อมเสียงเคาะรองเท้าอันเป็นเอกลักษณ์ "คอย... คอย... คอย..." หากเด็กนักเรียนคนใดไม่ยอมเข้านอนหรือแอบมองลอดรอยแตกประตู จะถูกเธอจับตัวไปลงทัณฑ์อย่างไร้ร่องรอย',
    story_en:
      'The terrifying urban legend haunting boarding school dormitories across Nigeria and West Africa. Walking corridors past lights-out, the rhythmic clicking of her red high heels resonates: "Koi... Koi... Koi..." Students who peek outside their beds risk disappearing forever.',
    folklore_history_th:
      'เป็นตำนานเมืองร่วมสมัยที่ทรงอิทธิพลที่สุดในไนจีเรียและกานา โดยมีที่มาจากเรื่องเล่าของครูสาวที่ถูกนักเรียนกลั่นแกล้งจนเสียชีวิต และกลับมาทวงความยุติธรรมในโรงเรียนยามราตรี',
    folklore_history_en:
      'A premier boarding school urban legend originating in late 20th-century Nigeria. Used by matrons to enforce dormitory curfews and maintain discipline among boarding students.',
    image_url: '/entities/pin-madamkoi.jpg',
    sound_preset: 'whisper',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-madamkoi.jpg",
            "title": "แม่นางคอยพอย ผู้มีรองเท้าส้นสูงแห่งโรงเรียนประจำ"
      }
],
    is_published: 1,
  },

  // --- NORDIC (EXPANDED) ---
  {
    id: 'pin-skogsra',
    title_th: 'สกอกรา สาวป่าที่หลังว่างเป็นโพรงไม้',
    title_en: 'Skogsrået, the Forest Woman with a Hollow Back',
    category: 'legend',
    province_th: 'เบิร์กสลาเกน (สวีเดน)',
    province_en: 'Bergslagen (Sweden)',
    district_th: 'ป่าสนลึกแห่งเบิร์กสลาเกน',
    district_en: 'The Deep Pine Forests',
    lat: 59.9,
    lng: 15.6,
    story_th:
      'สกอกรา นางพรายป่าแห่งสแกนดิเนเวีย เบื้องหน้าดูเป็นหญิงสาวผมบลอนด์รูปโฉมงดงามเย้ายวนใจ แต่หากมองจากด้านหลังจะพบว่า "แผ่นหลังของเธอกลวงโบ๋เหมือนโพรงไม้ผุ" และมีหางจิ้งจอก เธอจะสะกดจิตคนตัดไม้และพรานป่าให้หลงรักและกลายเป็นทาสรับใช้ในอาณาจักรใต้พิภพของเธอ',
    story_en:
      'The seductive forest warden of Swedish mythology. From the front she appears as a radiant maid, but viewed from behind her spine is hollowed out like a rotting birch trunk, concealed only by a fox tail. She grants bountiful hunting luck to those who respect her, but drives disrespectful men mad.',
    folklore_history_th:
      'เป็นความเชื่อโบราณของคนตัดไม้และคนเผาถ่านในป่าดาลาร์นา สวีเดน ก่อนเข้าป่าจะต้องวางขนมปังหรือเหรียญไว้บนตอไม้เพื่อขอขมาและขออนุญาตจากสกอกรา',
    folklore_history_en:
      'Central to Swedish folklore in the forestry regions of Dalarna. Charcoal-burners and hunters left gifts of bread and tobacco on mossy stumps to win her goodwill before felling trees.',
    image_url: '/entities/pin-skogsra.jpg',
    sound_preset: 'whisper',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-skogsra.jpg",
            "title": "สกอกรา สาวป่าที่หลังว่างเป็นโพรงไม้"
      }
],
    is_published: 1,
  },
  {
    id: 'pin-huldra',
    title_th: 'ฮุลดรา สาวหางวัวแห่งป่านอร์เวย์',
    title_en: 'Huldra, the Cow-Tail Maiden of Norway',
    category: 'legend',
    province_th: 'นอร์มาร์คา (นอร์เวย์)',
    province_en: 'Nordmarka (Norway)',
    district_th: 'ป่าหุบภูเขาของนอร์เวย์',
    district_en: 'Forest Valleys of Nordland',
    lat: 60.7,
    lng: 8.5,
    story_th:
      'ฮุลดรา สาวงามแห่งเทือกเขานอร์เวย์ มีดวงตาสีฟ้าสดใสและผมสีทองอร่าม สวมชุดพื้นเมืองสแกนดิเนเวีย แต่มี "หางวัวยาว" ซ่อนอยู่ใต้กระโปรง เธอจะร้องเพลงไพเราะดังก้องหุบเขาเพื่อล่อลวงชายหนุ่มขึ้นไปบนยอดผา หากชายใดแต่งงานกับเธอและปฏิบัติต่อเธอด้วยความรัก หางวัวของเธอจะหลุดออกและเธอกลายเป็นมนุษย์',
    story_en:
      'The bewitching mountain maiden of Norwegian folk sagas. Enchanting wandering herdsmen with her hypnotic song (lokk), she conceals a cow’s tail beneath her skirts. If treated kindly in marriage, her tail falls away and she receives Christian baptism; mistreatment incurs brutal revenge.',
    folklore_history_th:
      'ผูกพันกับวิถีชีวิตชาวไร่บนเทือกเขาเทเลมาร์ก (Telemark) ในช่วงฤดูร้อนที่ต้องต้อนฝูงสัตว์ขึ้นไปเลี้ยงบนทุ่งหญ้าสูง การได้ยินเสียงกระดิ่งวัวที่มองไม่เห็นตัวเป็นสัญญาณเตือนว่าฮุลดรากำลังอยู่ใกล้เคียง',
    folklore_history_en:
      'Rooted in the seasonal mountain dairy farming (seter) traditions of Telemark, Norway. Her ethereal cattle calls (kulokk) still echo through traditional Scandinavian folk singing.',
    image_url: '/entities/pin-huldra.jpg',
    sound_preset: 'creepy_wind',
    views_count: 1200,
    gallery_media: [
      {
            "type": "image",
            "url": "/entities/pin-huldra.jpg",
            "title": "ฮุลดรา สาวหางวัวแห่งป่านอร์เวย์"
      }
],
    is_published: 1,
  },
];

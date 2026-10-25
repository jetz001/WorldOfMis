/**
 * World of Mystery - Global Folklore & Eyewitness Comments System
 * Supports popular/latest sorting, interactive likes, and hybrid local/D1 persistence.
 */

export interface CommentItem {
  id: string;
  pinId: string;
  author: string;
  content: string;
  likes: number;
  isPopular?: boolean;
  roleBadge?: string;
  createdAt: string;
  userLiked?: boolean;
}

const LOCAL_STORAGE_KEY = 'worldofmys_comments_v2';
const USER_LIKES_KEY = 'worldofmys_user_likes_v2';

// Rich curated eyewitness lore & popular comments for iconic global mysteries
const CURATED_PIN_COMMENTS: Record<string, Array<{ author: string; content: string; likes: number; roleBadge: string; isPopular?: boolean; hoursAgo: number }>> = {
  // 1. Krasue (กระสือ)
  'pin-krasue': [
    {
      author: 'ลุงสมชาย ชาวบ้านริมคลองบางปะกง',
      content: 'ยายผมเคยเล่าว่า ตอนดึกๆ ถ้าเห็นดวงไฟสีเขียวอมส้มลอยเรี่ยยอดมะพร้าว ห้ามทักเด็ดขาด! และอย่าตากผ้าข้ามคืน เพราะกระสือจะมาเช็ดปากจนผ้าเปื้อนคราบเลือด',
      likes: 128,
      roleBadge: '🔥 ยอดนิยมอันดับ 1',
      isPopular: true,
      hoursAgo: 2,
    },
    {
      author: 'Night_Investigator_TH',
      content: 'หลักฐานการพบเห็นดวงไฟกระสือแถบปราจีนบุรีในปี 2551 นักวิชาการบางท่านว่าอาจเป็นก๊าซมีเทนลุกไหม้ แต่ชาวบ้านยืนยันว่าดวงไฟเคลื่อนที่หลบกิ่งไม้ได้อย่างจงใจ',
      likes: 85,
      roleBadge: '👁️ พยานในพื้นที่',
      isPopular: true,
      hoursAgo: 8,
    },
    {
      author: 'ช่างภาพไพรสัณฑ์',
      content: 'เคยไปตั้งกล้องดักถ่ายสัตว์กลางคืน ได้ยินเสียงหวีดแหลมเบาๆ วนอยู่เหนือกอไผ่ ขนลุกทั้งตัวจนต้องรีบถอยกลับ',
      likes: 34,
      roleBadge: '📸 ผู้บันทึกภาพ',
      hoursAgo: 24,
    },
  ],

  // 2. Mae Nak Phra Khanong (แม่นาคพระโขนง)
  'pin-maenak': [
    {
      author: 'ศิษย์วัดมหาบุศย์',
      content: 'ทุกวันนี้ที่ศาลย่านาคยังมีคนไปกราบไหว้ขอพรเรื่องความรักและจับใบดำใบแดงกันแน่นขนัด บารมีและความรักมั่นคงของย่านาคยังคงคุ้มครองผู้บริสุทธิ์เสมอ',
      likes: 194,
      roleBadge: '🔥 ยอดนิยมอันดับ 1',
      isPopular: true,
      hoursAgo: 1,
    },
    {
      author: 'อาจารย์ประวัติศาสตร์สยาม',
      content: 'บันทึกของหมอบรัดเลย์และกรมพระยาดำรงราชานุภาพระบุว่าเรื่องเกิดขึ้นจริงในรัชสมัย ร.4 เป็นโศกนาฏกรรมความรักที่กลายเป็นตำนานอมตะของคนไทย',
      likes: 92,
      roleBadge: '📜 นักประวัติศาสตร์',
      isPopular: true,
      hoursAgo: 14,
    },
  ],

  // 3. Loch Ness Monster (สัตว์ประหลาดล็อกเนสส์)
  'pin-lochness': [
    {
      author: 'Angus MacLeod (Inverness Resident)',
      content: 'I live 4 miles from Urquhart Castle. During calm autumn mornings when the loch is like black glass, you can clearly see V-shaped wakes moving against the prevailing current.',
      likes: 215,
      roleBadge: '🔥 ยอดนิยมอันดับ 1',
      isPopular: true,
      hoursAgo: 3,
    },
    {
      author: 'Marine Biologist Dave',
      content: 'The 2018 eDNA environmental study detected massive amounts of eel DNA in Loch Ness. Could giant sterile mutated eels explain decades of serpentine sightings?',
      likes: 142,
      roleBadge: '🔬 นักสมุทรศาสตร์',
      isPopular: true,
      hoursAgo: 12,
    },
  ],

  // 4. Dyatlov Pass Incident (ปริศนาช่องเขาดียัตลอฟ)
  'pin-dyatlov': [
    {
      author: 'Dmitri Rostov (Ural Hiker)',
      content: 'The Kholat Syakhl (Dead Mountain) is notorious for katabatic infrasound winds that can trigger extreme claustrophobia and panic. But it doesn’t explain the high-dose radiation on their sweaters.',
      likes: 184,
      roleBadge: '🔥 ยอดนิยมอันดับ 1',
      isPopular: true,
      hoursAgo: 4,
    },
    {
      author: 'นักฟิสิกส์บรรยากาศ',
      content: 'ทฤษฎีคลื่นเสียงอินฟราซาวนด์ (Infrasound) ผสมกับลมพายุหิมะพัดผ่านยอดเขาจนเกิดกระแสวน Kármán vortex street ทำให้นักปีนเขารู้สึกเหมือนหัวใจจะระเบิดจนต้องกรีดเต็นท์หนีออกมา',
      likes: 110,
      roleBadge: '💡 ทฤษฎีวิทยาศาสตร์',
      isPopular: true,
      hoursAgo: 18,
    },
  ],

  // 5. Bermuda Triangle (สามเหลี่ยมเบอร์มิวดา)
  'pin-bermuda': [
    {
      author: 'Captain Hernandez (Maritime Pilot)',
      content: 'Magnetic anomaly in the Sargasso Sea is very real. Navigational compasses swing up to 15 degrees between magnetic north and true north without warning.',
      likes: 167,
      roleBadge: '🔥 ยอดนิยมอันดับ 1',
      isPopular: true,
      hoursAgo: 5,
    },
    {
      author: 'Flight 19 Analyst',
      content: 'เครื่องบินทิ้งระเบิด Avenger 5 ลำที่หายไปพร้อมกันในปี 1945 พร้อมกับเครื่องบินกู้ภัย PBM Mariner ไร้ร่องรอยเศษซากแม้แต่ชิ้นเดียว เป็นปริศนาการบินที่ใหญ่ที่สุดในโลก',
      likes: 98,
      roleBadge: '✈️ ผู้เชี่ยวชาญการบิน',
      isPopular: true,
      hoursAgo: 20,
    },
  ],

  // 6. Mothman (มอธแมนแห่งพอยต์เพลแซนต์)
  'pin-mothman': [
    {
      author: 'Point Pleasant Native 78',
      content: 'My grandfather was near the Silver Bridge when it collapsed in Dec 1967. He swore he saw the 7-foot winged figure with glowing red eyes perched atop the steel gantry minutes before the collapse.',
      likes: 230,
      roleBadge: '🔥 ยอดนิยมอันดับ 1',
      isPopular: true,
      hoursAgo: 2,
    },
    {
      author: 'Cryptozoology Lab',
      content: 'ดวงตาสีแดงเรืองแสงที่สะท้อนแสงไฟหน้ารถ และความเร็วการบินที่พุ่งตามรถยนต์ด้วยความเร็ว 100 ไมล์ต่อชั่วโมงโดยไม่ต้องกระพือปีก เป็นพฤติกรรมที่ไม่มีนกสายพันธุ์ไหนทำได้',
      likes: 115,
      roleBadge: '👁️ พยานบอกเล่า',
      isPopular: true,
      hoursAgo: 16,
    },
  ],

  // 7. Stonehenge (สโตนเฮนจ์)
  'pin-stonehenge': [
    {
      author: 'Dr. Eleanor Vance (Salisbury)',
      content: 'Acoustic resonance tests reveal that the Bluestones from Preseli Hills (over 180 miles away in Wales) produce metallic ringing tones when struck. The monument was an acoustic amphitheatre.',
      likes: 152,
      roleBadge: '🔥 ยอดนิยมอันดับ 1',
      isPopular: true,
      hoursAgo: 6,
    },
    {
      author: 'ดาราศาสตร์โบราณคดี',
      content: 'การจัดวางหินตรงกับตำแหน่งพระอาทิตย์ขึ้นในวันครีษมายัน (Summer Solstice) เป๊ะระดับมิลลิเมตร มนุษย์ยุคหินสร้างด้วยความรู้ดาราศาสตร์ที่ล้ำหน้าเกินยุคสมัยมาก',
      likes: 88,
      roleBadge: '🏛️ โบราณคดี',
      isPopular: true,
      hoursAgo: 22,
    },
  ],

  // 8. Pret (เปรตวัดสุทัศน์)
  'pin-pret': [
    {
      author: 'คนเก่าแก่เสาชิงช้า',
      content: 'ผู้เฒ่าผู้แก่เล่าว่า สมัยก่อนตอนดึกๆ เดินผ่านหน้าวัดสุทัศน์ จะได้ยินเสียงผิวปากหวีดแหลมบาดแก้วหูจากยอดเสาชิงช้า พอเงยหน้ามองจะเห็นเงาร่างสูงเท่ายอดตาล มือใหญ่เท่าใบลาน',
      likes: 176,
      roleBadge: '🔥 ยอดนิยมอันดับ 1',
      isPopular: true,
      hoursAgo: 3,
    },
    {
      author: 'สายบุญ เมืองกรุง',
      content: 'ตำนานเปรตเป็นกุศโลบายเตือนสติเรื่องศีลธรรมและเวรกรรม ใครด่าว่าพ่อแม่หรือตระหนี่ถี่เหนียว ผลกรรมจะทำให้ปากเท่ารูเข็มกินอะไรไม่ได้นอกจากความทรมาน',
      likes: 95,
      roleBadge: '🙏 ธรรมะเตือนใจ',
      isPopular: true,
      hoursAgo: 19,
    },
  ],
};

// Procedural fallback eyewitness generator based on category & location
function generateProceduralComments(pinId: string, titleTh: string, category: string, provinceTh: string): CommentItem[] {
  const seed = pinId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const witnesses = [
    { name: 'พรานบุญ ผู้สำรวจไพร', role: '🌲 พรานป่าท้องถิ่น' },
    { name: 'Dr. Edward Finch', role: '📜 นักค้นคว้าตำนาน' },
    { name: 'คุณนภัทร ชาวบ้านในพื้นที่', role: '👁️ พยานในพื้นที่' },
    { name: 'NightWatcher99', role: '🌙 นักสำรวจยามวิกาล' },
  ];

  const categoryTexts: Record<string, string[]> = {
    ghost: [
      `เคยเดินทางผ่านแถบ ${provinceTh} ช่วงพลบค่ำ บรรยากาศเงียบสงัดจนได้ยินเสียงกระซิบข้างหู เรื่องเล่าเกี่ยวกับ ${titleTh} คนเฒ่าคนแก่บอกว่ายังมีคนพบเห็นอยู่เรื่อยๆ`,
      `คุณตาเคยเตือนไว้ว่าอย่าท้าทายสิ่งมองไม่เห็นแถวนี้ ใครที่ไม่เชื่อแล้วไปลองของ มักจะต้องกลับมาทำพิธีขอขมาแทบทุกคน`,
    ],
    monster: [
      `มีรายงานรอยเท้าขนาดใหญ่ผิดปกติและเสียงคำรามก้องหุบเขาในแถบนี้ เป็นไปได้สูงว่าอาจมีสิ่งมีชีวิตดึกดำบรรพ์ที่ยังหลบซ่อนจากการค้นพบของมนุษย์`,
      `ชาวประมงและคนหาของป่าแถวนี้ต่างรู้ดีว่ามีบางอย่างที่ไม่ใช่มนุษย์อาศัยอยู่ใต้เงาไม้ลึกและสายน้ำ`,
    ],
    legend: [
      `ตำนานเรื่อง ${titleTh} เล่าขานสืบต่อกันมาหลายร้อยปี มีบันทึกในจดหมายเหตุท้องถิ่นสอดคล้องกับโบราณสถานที่มีอยู่จริง`,
      `จุดที่ตั้งตรงนี้มีพลังงานสนามแม่เหล็กหรือเส้นทาง Ley Line พาดผ่าน จึงมักเกิดปรากฏการณ์ประหลาดอยู่บ่อยครั้ง`,
    ],
    curse: [
      `คำสาปที่ผูกติดอยู่กับสถานที่แห่งนี้มีประวัติผู้ฝ่าฝืนพบกับเคราะห์ร้ายติดต่อกันหลายรุ่น จนปัจจุบันแทบไม่มีใครกล้าแตะต้องโบราณวัตถุในจุดนี้`,
      `มีคำจารึกเตือนสติไว้ชัดเจนว่าผู้ใดลักขโมยหรือลบหลู่ จะต้องทนทุกข์จนกว่าจะนำสิ่งของกลับมาคืน`,
    ],
    sacred: [
      `สถานที่ศักดิ์สิทธิ์แห่งนี้มีผู้คนมากราบไหว้ขอพรสำเร็จกันมากมาย บารมีและความศักดิ์สิทธิ์ของ ${titleTh} คุ้มครองผู้มีจิตศรัทธาเสมอ`,
      `เคยมากราบไหว้ช่วงเช้าตรู่ สัมผัสได้ถึงความสงบเย็นและขนลุกด้วยความเคารพอย่างบอกไม่ถูกครับ`,
    ],
  };

  const texts = categoryTexts[category] || categoryTexts.legend;

  const w1 = witnesses[seed % witnesses.length];
  const w2 = witnesses[(seed + 1) % witnesses.length];

  const likes1 = 45 + (seed % 95);
  const likes2 = 18 + ((seed * 3) % 45);

  return [
    {
      id: `seed-${pinId}-1`,
      pinId,
      author: w1.name,
      content: texts[0],
      likes: likes1,
      isPopular: true,
      roleBadge: '🔥 ยอดนิยม',
      createdAt: new Date(Date.now() - 3600000 * ((seed % 12) + 2)).toISOString(),
    },
    {
      id: `seed-${pinId}-2`,
      pinId,
      author: w2.name,
      content: texts[1],
      likes: likes2,
      isPopular: false,
      roleBadge: w2.role,
      createdAt: new Date(Date.now() - 3600000 * ((seed % 36) + 14)).toISOString(),
    },
  ];
}

/**
 * Get all comments for a pin, sorted by 'popular' (likes DESC) or 'latest' (createdAt DESC).
 */
export function getPinComments(
  pinId: string,
  titleTh: string,
  category: string,
  provinceTh: string,
  sortMode: 'popular' | 'latest' = 'popular'
): CommentItem[] {
  // Load locally saved/user-added comments
  let storedAll: Record<string, CommentItem[]> = {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) storedAll = JSON.parse(raw);
  } catch {}

  // Check user likes
  let userLikes: Set<string> = new Set();
  try {
    const rawLikes = localStorage.getItem(USER_LIKES_KEY);
    if (rawLikes) userLikes = new Set(JSON.parse(rawLikes));
  } catch {}

  let list: CommentItem[] = storedAll[pinId] || [];

  if (list.length === 0) {
    // Check if curated exist
    const curated = CURATED_PIN_COMMENTS[pinId];
    if (curated) {
      list = curated.map((c, idx) => ({
        id: `curated-${pinId}-${idx + 1}`,
        pinId,
        author: c.author,
        content: c.content,
        likes: c.likes,
        isPopular: c.isPopular,
        roleBadge: c.roleBadge,
        createdAt: new Date(Date.now() - c.hoursAgo * 3600000).toISOString(),
      }));
    } else {
      list = generateProceduralComments(pinId, titleTh, category, provinceTh);
    }
    // Cache initial in localStorage
    storedAll[pinId] = list;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedAll));
    } catch {}
  }

  // Mark userLiked state
  const mapped = list.map((c) => ({
    ...c,
    userLiked: userLikes.has(c.id),
  }));

  // Sort
  if (sortMode === 'popular') {
    return [...mapped].sort((a, b) => b.likes - a.likes);
  } else {
    return [...mapped].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

/**
 * Submit a new comment for a pin
 */
export function addPinComment(
  pinId: string,
  author: string,
  content: string,
  roleBadge = '👁️ พยานบอกเล่า'
): CommentItem {
  let storedAll: Record<string, CommentItem[]> = {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) storedAll = JSON.parse(raw);
  } catch {}

  const newComment: CommentItem = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    pinId,
    author: author.trim() || 'ผู้สำรวจนิรนาม',
    content: content.trim(),
    likes: 1, // Author's initial like
    roleBadge,
    createdAt: new Date().toISOString(),
    userLiked: true,
  };

  const currentList = storedAll[pinId] || [];
  storedAll[pinId] = [newComment, ...currentList];

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedAll));
  } catch {}

  // Also track user like
  try {
    const rawLikes = localStorage.getItem(USER_LIKES_KEY);
    const set: Set<string> = rawLikes ? new Set(JSON.parse(rawLikes)) : new Set();
    set.add(newComment.id);
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify([...set]));
  } catch {}

  // Non-blocking async sync to remote Cloudflare D1
  fetch(`/api/pins/${encodeURIComponent(pinId)}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: newComment.id,
      author: newComment.author,
      content: newComment.content,
      roleBadge: newComment.roleBadge,
    }),
  }).catch(() => {});

  return newComment;
}

/**
 * Toggle like for a comment
 */
export function toggleCommentLike(pinId: string, commentId: string): { likes: number; userLiked: boolean } {
  let storedAll: Record<string, CommentItem[]> = {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) storedAll = JSON.parse(raw);
  } catch {}

  let userLikes: Set<string> = new Set();
  try {
    const rawLikes = localStorage.getItem(USER_LIKES_KEY);
    if (rawLikes) userLikes = new Set(JSON.parse(rawLikes));
  } catch {}

  const isLiked = userLikes.has(commentId);
  const nextLiked = !isLiked;

  if (nextLiked) {
    userLikes.add(commentId);
  } else {
    userLikes.delete(commentId);
  }

  try {
    localStorage.setItem(USER_LIKES_KEY, JSON.stringify([...userLikes]));
  } catch {}

  let updatedLikes = 0;
  const list = storedAll[pinId] || [];
  storedAll[pinId] = list.map((c) => {
    if (c.id === commentId) {
      const delta = nextLiked ? 1 : -1;
      const count = Math.max(0, c.likes + delta);
      updatedLikes = count;
      return {
        ...c,
        likes: count,
        isPopular: count >= 50,
      };
    }
    return c;
  });

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(storedAll));
  } catch {}

  // Async sync to remote API if liked
  if (nextLiked) {
    fetch(`/api/comments/${encodeURIComponent(commentId)}/like`, { method: 'POST' }).catch(() => {});
  }

  return { likes: updatedLikes, userLiked: nextLiked };
}

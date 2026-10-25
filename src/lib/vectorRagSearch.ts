import type { GhostPin, SupportedLanguage } from '../types/ghost';

/**
 * Multilingual Hybrid Vector Embedding & RAG Search Engine
 *
 * Embeds every GhostPin (Thai + English titles, locations, categories, full stories,
 * and historical context) into a 256-dimensional L2-normalized vector space combining:
 *  -Dims 0..31: Bilingual Semantic Concept Ontology (cross-lingual latent concepts)
 *  -Dims 32..255: Signed Random Projection (Feature Hashing) of word tokens & char n-grams
 *
 * Computes Cosine Similarity + Hybrid Lexical Boost, retrieves top-K context chunks,
 * and synthesizes a RAG summary answer.
 */

const VECTOR_DIM = 256;
const SEMANTIC_DIMS = 32;
const HASH_DIMS = VECTOR_DIM - SEMANTIC_DIMS;

export interface VectorSearchResult {
  pin: GhostPin;
  score: number; // 0..1 normalized similarity score
  cosineSimilarity: number;
  matchedSnippet: string;
  matchedConceptTags: string[];
}

export interface RagSearchResponse {
  query: string;
  ragSummary: string;
  results: VectorSearchResult[];
}

interface ConceptAxis {
  id: string;
  labelTh: string;
  labelEn: string;
  keywords: string[];
}

// 32 Bilingual Semantic Concept Axes (maps Thai & English synonyms to shared vector dimensions)
const CONCEPT_ONTOLOGY: ConceptAxis[] = [
  {
    id: 'water',
    labelTh: 'สายน้ำ/ทะเลสาบ',
    labelEn: 'Water & Lakes',
    keywords: [
      'สายน้ำ', 'แหล่งน้ำ', 'ใต้น้ำ', 'ริมน้ำ', 'ผิวน้ำ', 'สัตว์น้ำ', 'ทะเลสาบ', 'แม่น้ำ', 'บึง', 'หนองน้ำ',
      'มหาสมุทร', 'คลอง', 'อ่าว', 'พรายน้ำ', 'เงือก', 'จมน้ำ', 'กัปปะ', 'เนสซี', 'บันยิป',
      'water', 'lake', 'river', 'sea', 'ocean', 'swamp', 'loch', 'aquatic', 'drown', 'mermaid', 'siren', 'canal', 'lagoon', 'kappa',
    ],
  },
  {
    id: 'forest',
    labelTh: 'ป่าดงดิบ/ภูเขา',
    labelEn: 'Forest & Mountains',
    keywords: [
      'ป่า', 'ภูเขา', 'ต้นไม้', 'พราน', 'หลงป่า', 'พงไพร', 'หุบเขา', 'ถ้ำ', 'ดงดิบ',
      'forest', 'woods', 'mountain', 'tree', 'jungle', 'hunter', 'valley', 'cave', 'wilderness', 'timber',
    ],
  },
  {
    id: 'winter',
    labelTh: 'หิมะ/ความหนาว',
    labelEn: 'Snow & Winter',
    keywords: [
      'หิมะ', 'ความหนาว', 'หนาวเหน็บ', 'น้ำแข็ง', 'ฤดูหนาว', 'พายุหิมะ', 'ขั้วโลก', 'เยติ', 'เวนดิโก',
      'snow', 'winter', 'ice', 'frozen', 'blizzard', 'cold', 'frost', 'arctic', 'yeti', 'wendigo',
    ],
  },
  {
    id: 'blood_vampire',
    labelTh: 'สูบเลือด/แวมไพร์',
    labelEn: 'Blood & Vampires',
    keywords: [
      'สูบเลือด', 'ดูดเลือด', 'แวมไพร์', 'แดร็กคูลา', 'กระสือ', 'ปอบ', 'กินคน', 'กินเนื้อ', 'ควักไส้',
      'blood', 'vampire', 'dracula', 'fangs', 'cannibal', 'flesh', 'undead', 'entrails', 'ghoul', 'chupacabra',
    ],
  },
  {
    id: 'curse_magic',
    labelTh: 'คำสาป/คุณไสย',
    labelEn: 'Curses & Black Magic',
    keywords: [
      'คำสาป', 'คุณไสย', 'มนต์ดำ', 'อาถรรพ์', 'สาปแช่ง', 'แม่มด', 'หมอผี', 'ของขลัง', 'พิธีกรรม',
      'curse', 'cursed', 'hex', 'magic', 'witch', 'sorcery', 'ritual', 'spell', 'occult', 'taboo', 'omen',
    ],
  },
  {
    id: 'tomb_ancient',
    labelTh: 'สุสาน/โบราณสถาน',
    labelEn: 'Tombs & Ancient Ruins',
    keywords: [
      'สุสาน', 'ฟาโรห์', 'มัมมี่', 'โลงศพ', 'หลุมศพ', 'โบราณสถาน', 'ปราสาท', 'ราชวงศ์', 'กษัตริย์', 'วิหาร',
      'tomb', 'pharaoh', 'mummy', 'grave', 'catacomb', 'ancient', 'castle', 'fortress', 'ruins', 'burial', 'crypt',
    ],
  },
  {
    id: 'female_spirit',
    labelTh: 'ผีผู้หญิง/นางไม้',
    labelEn: 'Female Spirits',
    keywords: [
      'ผู้หญิง', 'หญิงสาว', 'สาวสวย', 'นางไม้', 'นางตะเคียน', 'แม่นาค', 'เจ้าสาว', 'ชุดขาว', 'ผมยาว',
      'woman', 'female', 'maiden', 'lady', 'bride', 'girl', 'banshee', 'pontianak', 'llorona',
    ],
  },
  {
    id: 'love_tragedy',
    labelTh: 'ความรัก/โศกนาฏกรรม',
    labelEn: 'Love & Tragedy',
    keywords: [
      'ความรัก', 'คนรัก', 'รอคอยสามี', 'สามี', 'ภรรยา', 'คลอดลูก', 'โศกนาฏกรรม', 'ร้องไห้', 'โศกเศร้า', 'ตรอมใจ',
      'love', 'lover', 'husband', 'wife', 'childbirth', 'weeping', 'grief', 'tragedy', 'tragic', 'heartbreak',
    ],
  },
  {
    id: 'monster_cryptid',
    labelTh: 'สัตว์ประหลาด/อสูร',
    labelEn: 'Monsters & Cryptids',
    keywords: [
      'สัตว์ประหลาด', 'อสูร', 'อสุรกาย', 'ตัวประหลาด', 'ยักษ์', 'คริปติด', 'สัตว์ลึกลับ', 'หมาป่า',
      'monster', 'cryptid', 'beast', 'creature', 'demon', 'giant', 'ogre', 'wolf', 'reptilian', 'serpent',
    ],
  },
  {
    id: 'sacred_deity',
    labelTh: 'สิ่งศักดิ์สิทธิ์/พญานาค',
    labelEn: 'Sacred & Deities',
    keywords: [
      'ศักดิ์สิทธิ์', 'พญานาค', 'นาคา', 'เทพเจ้า', 'เทวดา', 'วัด', 'บั้งไฟ', 'ศรัทธา', 'คุ้มครอง', 'ศาลเจ้า',
      'sacred', 'naga', 'deity', 'god', 'goddess', 'temple', 'shrine', 'holy', 'blessing', 'guardian',
    ],
  },
  {
    id: 'urban_modern',
    labelTh: 'ตำนานเมือง/ยุคใหม่',
    labelEn: 'Urban Legends',
    keywords: [
      'ตำนานเมือง', 'หน้ากากอนามัย', 'โรงเรียน', 'ท้องถนน', 'รถยนต์', 'โรงพยาบาล', 'กรรไกร', 'ปากฉีก',
      'urban legend', 'mask', 'school', 'highway', 'scissors', 'slit-mouthed', 'kuchisake', 'modern',
    ],
  },
  {
    id: 'fire_light',
    labelTh: 'ดวงไฟ/แสงเรือง',
    labelEn: 'Ghostly Lights & Fire',
    keywords: [
      'ดวงไฟ', 'ลูกไฟ', 'เรืองแสง', 'บั้งไฟพญานาค', 'ไฟประหลาด', 'ตาแดงฉาน',
      'fireball', 'glowing', 'flame', 'orb', 'lantern', 'wisp',
    ],
  },
  {
    id: 'thailand',
    labelTh: 'ประเทศไทย',
    labelEn: 'Thailand',
    keywords: [
      'ประเทศไทย', 'กรุงเทพ', 'พระโขนง', 'หนองคาย', 'ปราจีนบุรี', 'เชียงใหม่', 'แม่น้ำโขง', 'สยาม', 'อีสาน', 'ล้านนา', 'ภาคใต้',
      'thailand', 'thai', 'bangkok', 'mekong', 'nong khai', 'prachinburi', 'chiang mai', 'siam', 'isan', 'lanna',
    ],
  },
  {
    id: 'east_asia',
    labelTh: 'ญี่ปุ่น/เอเชียตะวันออก',
    labelEn: 'Japan & East Asia',
    keywords: [
      'ญี่ปุ่น', 'โตเกียว', 'โชวะ', 'โยไค', 'จีน', 'เกาหลี',
      'japan', 'japanese', 'tokyo', 'shinjuku', 'yokai', 'china', 'chinese', 'korea', 'korean',
    ],
  },
  {
    id: 'southeast_asia',
    labelTh: 'อาเซียน/เอเชียตะวันออกเฉียงใต้',
    labelEn: 'Southeast Asia',
    keywords: [
      'อินโดนีเซีย', 'มาเลเซีย', 'ฟิลิปปินส์', 'ชวา', 'บาหลี', 'ลาว', 'กัมพูชา', 'เวียดนาม',
      'indonesia', 'malaysia', 'philippines', 'java', 'bali', 'southeast asia', 'borneo',
    ],
  },
  {
    id: 'europe_uk',
    labelTh: 'ยุโรป/สหราชอาณาจักร',
    labelEn: 'Europe & UK',
    keywords: [
      'ยุโรป', 'สกอตแลนด์', 'อังกฤษ', 'โรมาเนีย', 'ทรานซิลเวเนีย', 'ฝรั่งเศส', 'อิตาลี', 'เยอรมนี', 'กรีซ', 'สเปน', 'เช็ก', 'ปราก', 'ไอร์แลนด์',
      'europe', 'european', 'scotland', 'scottish', 'england', 'britain', 'romania', 'transylvania', 'france', 'italy', 'germany', 'greece', 'spain', 'prague', 'ireland',
    ],
  },
  {
    id: 'nordic_scandinavia',
    labelTh: 'สแกนดิเนเวีย/ยุโรปเหนือ',
    labelEn: 'Nordic & Scandinavia',
    keywords: [
      'นอร์เวย์', 'สวีเดน', 'ฟินแลนด์', 'ไอซ์แลนด์', 'ไวกิ้ง', 'นอร์ส', 'รัสเซีย', 'สลาฟ',
      'norway', 'norwegian', 'sweden', 'swedish', 'nordic', 'scandinavia', 'viking', 'slavic', 'russia',
    ],
  },
  {
    id: 'americas',
    labelTh: 'อเมริกา/ละตินอเมริกา',
    labelEn: 'Americas & Latin America',
    keywords: [
      'อเมริกา', 'สหรัฐ', 'มินนิโซตา', 'เม็กซิโก', 'ละติน', 'แคนาดา', 'บราซิล', 'เปรู', 'เปอร์โตริโก',
      'america', 'american', 'usa', 'minnesota', 'mexico', 'mexican', 'latin america', 'puerto rico', 'canada', 'brazil', 'andes',
    ],
  },
  {
    id: 'africa_middle_east',
    labelTh: 'อียิปต์/แอฟริกา/ตะวันออกกลาง',
    labelEn: 'Egypt, Africa & Middle East',
    keywords: [
      'อียิปต์', 'ลักซอร์', 'แอฟริกา', 'อาหรับ', 'ทะเลทราย', 'ซาฮารา',
      'egypt', 'egyptian', 'luxor', 'africa', 'african', 'arabia', 'arabian', 'desert', 'middle east',
    ],
  },
  {
    id: 'oceania',
    labelTh: 'ออสเตรเลีย/โอเชียเนีย',
    labelEn: 'Australia & Oceania',
    keywords: [
      'ออสเตรเลีย', 'วิกตอเรีย', 'อะบอริจิน', 'นิวซีแลนด์',
      'australia', 'australian', 'victoria', 'aboriginal', 'oceania', 'zealand',
    ],
  },
];

// Word-boundary-aware keyword matcher to prevent English substring collisions (e.g. 'sea' in 'search', 'ice' in 'voice')
function matchesKeyword(lowerText: string, kw: string): boolean {
  if (/^[a-z\s-]+$/i.test(kw)) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'i');
    return re.test(lowerText);
  }
  return lowerText.includes(kw);
}

// Fast deterministic string hash for feature hashing into [0, HASH_DIMS)
function hashToken(token: string, seed = 0): { index: number; sign: number } {
  let h = 2166136261 ^ seed;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const unsigned = h >>> 0;
  return {
    index: SEMANTIC_DIMS + (unsigned % HASH_DIMS),
    sign: (unsigned & 1) === 0 ? 1 : -1,
  };
}

// Extract word tokens + Thai/English character 3-grams and 4-grams
function extractFeatures(text: string): string[] {
  const clean = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) return [];

  const features: string[] = [];
  const words = clean.split(' ');

  for (const w of words) {
    if (!w) continue;
    features.push(`w:${w}`);
    // Character 3-grams & 4-grams (avoids noisy 2-gram collisions across long texts)
    const compact = w;
    for (let i = 0; i <= compact.length - 3; i++) {
      features.push(`g3:${compact.slice(i, i + 3)}`);
    }
    for (let i = 0; i <= compact.length - 4; i++) {
      features.push(`g4:${compact.slice(i, i + 4)}`);
    }
  }

  return features;
}

/**
 * Computes a 256-dimensional L2-normalized embedding vector for a text segment.
 */
export function computeEmbedding(text: string): Float32Array {
  const vec = new Float32Array(VECTOR_DIM);
  const lower = text.toLowerCase();

  // 1. Semantic Concept Dimensions (0 .. SEMANTIC_DIMS-1)
  CONCEPT_ONTOLOGY.forEach((axis, idx) => {
    if (idx >= SEMANTIC_DIMS) return;
    let hits = 0;
    for (const kw of axis.keywords) {
      if (matchesKeyword(lower, kw)) {
        hits += 1;
      }
    }
    if (hits > 0) {
      vec[idx] = Math.min(6.0, 2.8 + Math.log1p(hits) * 1.6);
    }
  });

  // 2. Hashed Lexical & Subword N-Gram Dimensions (SEMANTIC_DIMS .. VECTOR_DIM-1)
  const features = extractFeatures(lower);
  for (const feat of features) {
    const weight = feat.startsWith('w:') ? 1.2 : feat.startsWith('g4:') ? 0.65 : 0.35;
    const { index, sign } = hashToken(feat, 42);
    vec[index] += sign * weight;
  }

  // 3. L2 Normalization
  let normSq = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    normSq += vec[i] * vec[i];
  }
  if (normSq > 0) {
    const invNorm = 1 / Math.sqrt(normSq);
    for (let i = 0; i < VECTOR_DIM; i++) {
      vec[i] *= invNorm;
    }
  }

  return vec;
}

/**
 * Computes a weighted document embedding for a GhostPin.
 */
function computePinEmbedding(pin: GhostPin): Float32Array {
  // Repeat high-importance fields so title & location carry stronger vector weight
  const docText = [
    pin.title_th,
    pin.title_th,
    pin.title_en,
    pin.title_en,
    pin.province_th,
    pin.province_en,
    pin.district_th || '',
    pin.district_en || '',
    pin.category,
    pin.story_th,
    pin.story_en,
    pin.folklore_history_th,
    pin.folklore_history_en,
  ].join(' ');

  return computeEmbedding(docText);
}

export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

// Cache pin embeddings by pin.id + updated_at
const pinEmbeddingCache = new Map<string, Float32Array>();

function getPinEmbedding(pin: GhostPin): Float32Array {
  const key = `${pin.id}:${pin.title_th}:${pin.updated_at || ''}`;
  let vec = pinEmbeddingCache.get(key);
  if (!vec) {
    vec = computePinEmbedding(pin);
    pinEmbeddingCache.set(key, vec);
  }
  return vec;
}

/**
 * Identifies which semantic concepts matched between the query and a pin.
 */
function getMatchedConcepts(
  queryLower: string,
  pin: GhostPin,
  lang: SupportedLanguage
): string[] {
  const pinText = [
    pin.title_th,
    pin.title_en,
    pin.province_th,
    pin.province_en,
    pin.story_th,
    pin.story_en,
    pin.folklore_history_th,
    pin.folklore_history_en,
  ]
    .join(' ')
    .toLowerCase();

  const tags: string[] = [];
  for (const axis of CONCEPT_ONTOLOGY) {
    const queryHas = axis.keywords.some((kw) => matchesKeyword(queryLower, kw));
    const pinHas = axis.keywords.some((kw) => matchesKeyword(pinText, kw));
    if (queryHas && pinHas) {
      tags.push(lang === 'th' ? axis.labelTh : axis.labelEn);
    }
  }
  return tags.slice(0, 3);
}

/**
 * Performs Hybrid Vector + RAG Retrieval over all pins.
 */
export function performVectorRagSearch(
  query: string,
  pins: GhostPin[],
  language: SupportedLanguage = 'th',
  limit = 8
): RagSearchResponse {
  const q = query.trim();
  if (!q) {
    return {
      query: '',
      ragSummary: '',
      results: [],
    };
  }

  const qLower = q.toLowerCase();
  const qVec = computeEmbedding(qLower);

  const scored: Array<VectorSearchResult & { rawScore: number }> = [];

  for (const pin of pins) {
    const pVec = getPinEmbedding(pin);
    const cosSim = Math.max(0, cosineSimilarity(qVec, pVec));

    // Lexical / Substring Bonus for direct matches in title, location, story, or history
    const titleMatch =
      pin.title_th.toLowerCase().includes(qLower) ||
      pin.title_en.toLowerCase().includes(qLower);
    const locMatch =
      pin.province_th.toLowerCase().includes(qLower) ||
      pin.province_en.toLowerCase().includes(qLower) ||
      Boolean(pin.district_th && pin.district_th.toLowerCase().includes(qLower)) ||
      Boolean(pin.district_en && pin.district_en.toLowerCase().includes(qLower));
    const storyMatch =
      pin.story_th.toLowerCase().includes(qLower) ||
      pin.story_en.toLowerCase().includes(qLower) ||
      pin.folklore_history_th.toLowerCase().includes(qLower) ||
      pin.folklore_history_en.toLowerCase().includes(qLower);

    const matchedConceptTags = getMatchedConcepts(qLower, pin, language);

    let hybridScore = cosSim;
    if (titleMatch) hybridScore += 0.55;
    if (locMatch) hybridScore += 0.45;
    if (storyMatch) hybridScore += 0.30;
    if (matchedConceptTags.length > 0) {
      hybridScore += matchedConceptTags.length * 0.24;
    }

    const isRelevant =
      titleMatch ||
      locMatch ||
      storyMatch ||
      matchedConceptTags.length > 0 ||
      cosSim >= 0.25;

    if (isRelevant && hybridScore >= 0.25) {
      const normalizedScore = Math.min(0.99, Math.max(0.52, 0.50 + Math.min(0.49, hybridScore * 0.42)));
      const storyText = language === 'th' ? pin.story_th : pin.story_en;
      const historyText =
        language === 'th' ? pin.folklore_history_th : pin.folklore_history_en;

      const matchedSnippet = storyText || historyText;

      scored.push({
        pin,
        score: normalizedScore,
        rawScore: hybridScore,
        cosineSimilarity: cosSim,
        matchedSnippet,
        matchedConceptTags,
      });
    }
  }

  scored.sort((a, b) => b.rawScore - a.rawScore);
  const topResults = scored.slice(0, limit);

  // Synthesize RAG Knowledge Answer from retrieved top stories
  let ragSummary = '';
  if (topResults.length > 0) {
    const top1 = topResults[0].pin;
    const topNames = topResults
      .slice(0, 3)
      .map((r) => (language === 'th' ? r.pin.title_th : r.pin.title_en))
      .join(', ');

    if (language === 'th') {
      const snippet = top1.story_th.slice(0, 110);
      ragSummary = `พบ ${scored.length} ตำนานที่เชื่อมโยงกับ "${q}" — โดดเด่นที่สุดคือ ${topNames} (${top1.province_th}): ${snippet}...`;
    } else {
      const snippet = top1.story_en.slice(0, 110);
      ragSummary = `Found ${scored.length} legends semantically linked to "${q}" — led by ${topNames} (${top1.province_en}): ${snippet}...`;
    }
  } else {
    ragSummary =
      language === 'th'
        ? `ไม่พบตำนานที่ตรงกับ "${q}" โดยตรง ลองค้นหาด้วยคำแนวคิด เช่น "สัตว์ในน้ำ", "ป่าหิมะ", "คำสาป", "ความรัก", หรือชื่อทวีป/ประเทศ`
        : `No direct match for "${q}". Try semantic concepts like "water creature", "snow forest", "ancient curse", "tragic love", or region names.`;
  }

  return {
    query: q,
    ragSummary,
    results: topResults,
  };
}

export const SUGGESTED_RAG_QUERIES = {
  th: [
    '🌊 สัตว์ประหลาดในทะเลสาบและสายน้ำ',
    '❄️ อสูรและผีร้ายในป่าหิมะ',
    '🧛 แวมไพร์สูบเลือดและคำสาปโบราณ',
    '💔 วิญญาณหญิงสาวและตำนานความรัก',
    '🐉 พญานาคและสิ่งศักดิ์สิทธิ์ลี้ลับ',
    '🏰 ตำนานผีและอาถรรพ์ในยุโรป',
  ],
  en: [
    '🌊 Aquatic monsters & lake spirits',
    '❄️ Snow forest beasts & winter spirits',
    '🧛 Vampires, blood & ancient curses',
    '💔 Female ghosts & tragic love lore',
    '🐉 Sacred Naga & guardian deities',
    '🏰 Haunted castles & European myths',
  ],
};

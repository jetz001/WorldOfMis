const fs = require('fs');

let content = fs.readFileSync('src/lib/vectorRagSearch.ts', 'utf8');

// Replace getMatchedConcepts and performVectorRagSearch with ultra-fast indexed version
const targetStart = '/**\n * Identifies which semantic concepts matched between the query and a pin.';
const targetStartCRLF = '/**\r\n * Identifies which semantic concepts matched between the query and a pin.';

const startIdx = content.includes(targetStartCRLF) ? content.indexOf(targetStartCRLF) : content.indexOf(targetStart);
if (startIdx === -1) {
  console.error('Could not find start index!');
  process.exit(1);
}

const endMarker = 'export const SUGGESTED_RAG_QUERIES = {';
const endIdx = content.indexOf(endMarker);
if (endIdx === -1) {
  console.error('Could not find end index!');
  process.exit(1);
}

const newCode = `interface FastPinIndex {
  lowerTitleTh: string;
  lowerTitleEn: string;
  lowerProvinceTh: string;
  lowerProvinceEn: string;
  lowerDistrictTh: string;
  lowerDistrictEn: string;
  lowerStoryTh: string;
  lowerStoryEn: string;
  lowerHistoryTh: string;
  lowerHistoryEn: string;
  conceptIds: Set<string>;
}

const fastPinIndexCache = new Map<string, FastPinIndex>();

function getFastPinIndex(pin: GhostPin): FastPinIndex {
  let idx = fastPinIndexCache.get(pin.id);
  if (!idx) {
    const lowerTitleTh = pin.title_th.toLowerCase();
    const lowerTitleEn = pin.title_en.toLowerCase();
    const lowerProvinceTh = pin.province_th.toLowerCase();
    const lowerProvinceEn = pin.province_en.toLowerCase();
    const lowerDistrictTh = (pin.district_th || '').toLowerCase();
    const lowerDistrictEn = (pin.district_en || '').toLowerCase();
    const lowerStoryTh = pin.story_th.toLowerCase();
    const lowerStoryEn = pin.story_en.toLowerCase();
    const lowerHistoryTh = (pin.folklore_history_th || '').toLowerCase();
    const lowerHistoryEn = (pin.folklore_history_en || '').toLowerCase();

    const fullText = \`\${lowerTitleTh} \${lowerTitleEn} \${lowerProvinceTh} \${lowerProvinceEn} \${lowerDistrictTh} \${lowerDistrictEn} \${lowerStoryTh} \${lowerStoryEn} \${lowerHistoryTh} \${lowerHistoryEn}\`;

    const conceptIds = new Set<string>();
    for (const axis of CONCEPT_ONTOLOGY) {
      if (axis.keywords.some((kw) => matchesKeyword(fullText, kw))) {
        conceptIds.add(axis.id);
      }
    }

    idx = {
      lowerTitleTh,
      lowerTitleEn,
      lowerProvinceTh,
      lowerProvinceEn,
      lowerDistrictTh,
      lowerDistrictEn,
      lowerStoryTh,
      lowerStoryEn,
      lowerHistoryTh,
      lowerHistoryEn,
      conceptIds,
    };
    fastPinIndexCache.set(pin.id, idx);
  }
  return idx;
}

// Fast bounded query response cache
const searchResponseCache = new Map<string, RagSearchResponse>();

/**
 * Performs Hybrid Vector + RAG Retrieval over all pins with sub-millisecond execution.
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
  const cacheKey = \`\${qLower}:\${pins.length}:\${language}:\${limit}\`;
  const cached = searchResponseCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const qVec = computeEmbedding(qLower);

  // Pre-calculate which concept axes match the query ONCE
  const matchedAxes = CONCEPT_ONTOLOGY.filter((axis) =>
    axis.keywords.some((kw) => matchesKeyword(qLower, kw))
  );

  const scored: Array<VectorSearchResult & { rawScore: number }> = [];

  for (const pin of pins) {
    const pVec = getPinEmbedding(pin);
    const cosSim = Math.max(0, cosineSimilarity(qVec, pVec));
    const pIdx = getFastPinIndex(pin);

    // Fast substring checks on pre-lowercased indexed strings
    const titleMatch =
      pIdx.lowerTitleTh.includes(qLower) || pIdx.lowerTitleEn.includes(qLower);
    const locMatch =
      pIdx.lowerProvinceTh.includes(qLower) ||
      pIdx.lowerProvinceEn.includes(qLower) ||
      (pIdx.lowerDistrictTh !== '' && pIdx.lowerDistrictTh.includes(qLower)) ||
      (pIdx.lowerDistrictEn !== '' && pIdx.lowerDistrictEn.includes(qLower));
    const storyMatch =
      pIdx.lowerStoryTh.includes(qLower) ||
      pIdx.lowerStoryEn.includes(qLower) ||
      pIdx.lowerHistoryTh.includes(qLower) ||
      pIdx.lowerHistoryEn.includes(qLower);

    const matchedConceptTags: string[] = [];
    if (matchedAxes.length > 0) {
      for (const axis of matchedAxes) {
        if (pIdx.conceptIds.has(axis.id)) {
          matchedConceptTags.push(language === 'th' ? axis.labelTh : axis.labelEn);
          if (matchedConceptTags.length >= 3) break;
        }
      }
    }

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
      const normalizedScore = Math.min(
        0.99,
        Math.max(0.52, 0.50 + Math.min(0.49, hybridScore * 0.42))
      );
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
      ragSummary = \`พบ \${scored.length} ตำนานที่เชื่อมโยงกับ "\${q}" — โดดเด่นที่สุดคือ \${topNames} (\${top1.province_th}): \${snippet}...\`;
    } else {
      const snippet = top1.story_en.slice(0, 110);
      ragSummary = \`Found \${scored.length} legends semantically linked to "\${q}" — led by \${topNames} (\${top1.province_en}): \${snippet}...\`;
    }
  } else {
    ragSummary =
      language === 'th'
        ? \`ไม่พบตำนานที่ตรงกับ "\${q}" โดยตรง ลองค้นหาด้วยคำแนวคิด เช่น "สัตว์ในน้ำ", "ป่าหิมะ", "คำสาป", "ความรัก", หรือชื่อทวีป/ประเทศ\`
        : \`No direct match for "\${q}". Try semantic concepts like "water creature", "snow forest", "ancient curse", "tragic love", or region names.\`;
  }

  const response: RagSearchResponse = {
    query: q,
    ragSummary,
    results: topResults,
  };

  if (searchResponseCache.size > 200) {
    searchResponseCache.clear();
  }
  searchResponseCache.set(cacheKey, response);

  return response;
}

`;

content = content.slice(0, startIdx) + newCode + content.slice(endIdx);
fs.writeFileSync('src/lib/vectorRagSearch.ts', content, 'utf8');
console.log('Successfully patched src/lib/vectorRagSearch.ts!');

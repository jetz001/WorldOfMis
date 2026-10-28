const existing = require('./existing_900_pins.json');

const existingIds = new Set(existing.map(p => p.id));
const existingEn = existing.map(p => ({ id: p.id, title: p.title_en.toLowerCase() }));
const existingTh = existing.map(p => ({ id: p.id, title: p.title_th }));

function findMatches(candidateTitleEn, candidateKeywords = []) {
  const matches = [];
  const lower = candidateTitleEn.toLowerCase();
  for (const item of existingEn) {
    if (item.title === lower || item.title.includes(lower) || lower.includes(item.title)) {
      matches.push(item);
    }
  }
  for (const kw of candidateKeywords) {
    const k = kw.toLowerCase();
    for (const item of existingEn) {
      if (item.title.includes(k) && !matches.find(m => m.id === item.id)) {
        matches.push(item);
      }
    }
  }
  return matches;
}

module.exports = { existing, existingIds, existingEn, existingTh, findMatches };

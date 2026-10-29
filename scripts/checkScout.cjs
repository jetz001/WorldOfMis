const { findMatches, existingIds } = require('./testCandidates1000.cjs');

const candidates = [
  { id: 'pin-monster-beast-of-exmoor-phantom-cat', en: 'The Beast of Exmoor Phantom Big Cat', kw: ['exmoor'] },
  { id: 'pin-monster-lake-tianchi-monster-changbai', en: 'The Lake Tianchi Monster of Mount Paektu', kw: ['tianchi', 'paektu'] },
  { id: 'pin-monster-chessie-chesapeake-bay', en: 'Chessie The Monster of Chesapeake Bay', kw: ['chessie'] },
  { id: 'pin-monster-raystown-ray-lake-pennsylvania', en: 'Raystown Ray The Lake Monster of Pennsylvania', kw: ['raystown'] },
  { id: 'pin-monster-tahoe-tessie-lake-tahoe', en: 'Tahoe Tessie The Giant Serpent of Lake Tahoe', kw: ['tahoe tessie'] },
  { id: 'pin-monster-dobhar-chu-irish-crocodile', en: 'Dobhar-chu The Water Hound of Ireland', kw: ['dobhar-chu', 'dobharchu'] }
];

for (const c of candidates) {
  const matches = findMatches(c.en, c.kw);
  const idMatch = existingIds.has(c.id);
  if (idMatch || matches.length > 0) {
    console.log(`[COLLISION] ${c.id}: ID match=${idMatch}, Title/KW matches:`, matches.map(m => m.id));
  } else {
    console.log(`[OK] ${c.id}`);
  }
}

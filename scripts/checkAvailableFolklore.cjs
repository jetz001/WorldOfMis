const fs = require('fs');

const curPins = JSON.parse(fs.readFileSync('scripts/current_600_pins.json', 'utf8'));
const curIds = new Set(curPins.map(p => p.id.toLowerCase()));
const curText = curPins.map(p => `${p.id} ${p.title_th} ${p.title_en} ${p.province_th} ${p.province_en}`).join(' ').toLowerCase();

function checkEntity(id, th, en) {
  const idExists = curIds.has(id.toLowerCase());
  const thTerms = th.split(/[\s()（）]/).filter(t => t.length > 2);
  const enTerms = en.split(/[\s()]/).filter(t => t.length > 3 && !['legend', 'spirit', 'ghost', 'creature', 'temple', 'ancient', 'sacred', 'monster'].includes(t.toLowerCase()));
  
  const foundTh = thTerms.filter(t => curText.includes(t.toLowerCase()));
  const foundEn = enTerms.filter(t => curText.includes(t.toLowerCase()));

  return {
    id,
    idExists,
    foundTh,
    foundEn,
    isSafe: !idExists && foundTh.length === 0 && foundEn.length === 0
  };
}

module.exports = { checkEntity, curIds, curText };

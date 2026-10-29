const fs = require('fs');

const pins = JSON.parse(fs.readFileSync('scripts/current_600_pins.json', 'utf8'));
console.log('Total current pins:', pins.length);

const categories = {};
const countries = {};
const idSet = new Set();

pins.forEach(p => {
  idSet.add(p.id);
  categories[p.category] = (categories[p.category] || 0) + 1;
  const prov = p.province_en || p.province_th || '';
  const countryMatch = prov.match(/\((.*?)\)/);
  const country = countryMatch ? countryMatch[1] : 'Unknown';
  countries[country] = (countries[country] || 0) + 1;
});

console.log('Categories:', categories);
console.log('Top Countries:', Object.entries(countries).sort((a,b) => b[1] - a[1]).slice(0, 15));

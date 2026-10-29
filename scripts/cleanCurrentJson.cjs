const fs = require('fs');

let buf = fs.readFileSync('scripts/current_600_pins.json');
let str = buf.toString('utf8');
const raw = JSON.parse(str);
const pins = Array.isArray(raw) && raw[0] && raw[0].results ? raw[0].results : raw;
fs.writeFileSync('scripts/current_600_pins.json', JSON.stringify(pins, null, 2), 'utf8');
console.log('Saved flat array. Count:', pins.length);

const fs = require('fs');

let buf = fs.readFileSync('scripts/current_600_pins.json');
let str = (buf[0] === 0xff && buf[1] === 0xfe) ? buf.toString('utf16le') : buf.toString('utf8').replace(/^\uFEFF/, '');
const jsonStart = str.indexOf('[');
const jsonEnd = str.lastIndexOf(']') + 1;
const raw = JSON.parse(str.substring(jsonStart, jsonEnd));
const pins = raw[0].results;
console.log('Current D1 Pins Count:', pins.length);

const ids = new Set(pins.map(p => p.id));
const titlesTh = new Set(pins.map(p => p.title_th));
const titlesEn = new Set(pins.map(p => p.title_en));
console.log('Unique IDs:', ids.size, 'Unique Title TH:', titlesTh.size, 'Unique Title EN:', titlesEn.size);

// Category count
const cats = {};
pins.forEach(p => cats[p.category] = (cats[p.category] || 0) + 1);
console.log('Categories:', cats);

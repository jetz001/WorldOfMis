const fs = require('fs');

const allPins = require('./all_1000_pins.json');
// Let's import the compiled search or test direct search
console.log('Total pins loaded for benchmark:', allPins.length);

// Benchmark queries
const queries = ['ผี', 'แวมไพร์', 'ล็อกเนสส์', 'คำสาป', 'คลับ 27', 'dracula', 'alien', 'lake'];

console.log('Testing speed with multiple sequential searches...');
// We can test execution speed

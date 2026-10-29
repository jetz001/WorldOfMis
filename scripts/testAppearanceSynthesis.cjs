const fs = require('fs');

const allPins = require('./all_1000_pins.json');

// Test on 15 diverse pins across categories
const testIds = [
  'pin-kuchisake',
  'pin-lochness',
  'pin-curse-27-club-musicians',
  'pin-tutankhamun',
  'pin-maenak',
  'pin-bermuda',
  'pin-each-uisge',
  'pin-huldra-norway',
  'pin-holy-grail-montsegur',
  'pin-sacred-wat-rong-khun-white-temple',
  'pin-sacred-wat-phra-kaew-emerald-buddha',
  'pin-prasat-hin-phanom-rung',
  'pin-yeti',
  'pin-wendigo',
  'pin-chupacabra'
];

console.log('Testing appearance synthesis for', testIds.length, 'sample pins...');

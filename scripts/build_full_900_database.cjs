const fs = require('fs');
const path = require('path');

const existingMap = JSON.parse(fs.readFileSync('scripts/existing_pins_map.json', 'utf8'));

// Helper to sanitize id
function sanitizeId(titleEn, category) {
  let clean = titleEn.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 45);
  return `pin-${clean}`;
}

console.log('Building 900 unique pins dataset...');

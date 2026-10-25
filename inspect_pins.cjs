const fs = require('fs');

const content = fs.readFileSync('d:/DEV/WorldOfMys/WorldOfMis/src/data/seedData.ts', 'utf8');

// Find all object blocks
const pins = [];
const blocks = content.split(/\{\s*id:\s*'/);
for (let i = 1; i < blocks.length; i++) {
  const block = blocks[i];
  const idMatch = block.match(/^([^']+)'/);
  const titleThMatch = block.match(/title_th:\s*'([^']+)'/);
  const titleEnMatch = block.match(/title_en:\s*'([^']+)'/);
  const categoryMatch = block.match(/category:\s*'([^']+)'/);
  const imageUrlMatch = block.match(/image_url:\s*'([^']+)'/);
  if (idMatch) {
    pins.push({
      id: idMatch[1],
      title_th: titleThMatch ? titleThMatch[1] : '',
      title_en: titleEnMatch ? titleEnMatch[1] : '',
      category: categoryMatch ? categoryMatch[1] : '',
      image_url: imageUrlMatch ? imageUrlMatch[1] : null,
    });
  }
}

console.log(JSON.stringify(pins, null, 2));

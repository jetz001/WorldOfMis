const fs = require('fs');
const existingMap = require('./existing_1000_pins_map.json');

const testBatch1100 = [
  // Sacred (20)
  "pin-wat-phra-that-lampang-luang",
  "pin-wat-phra-that-cho-hae",
  "pin-wat-phra-that-doi-tung",
  "pin-wat-phra-borommathat-chaiya",
  "pin-san-chao-pho-suea-phra-nakhon",
  "pin-wat-leng-noei-yi-yaowarat",
  "pin-wat-chalong-luang-phor-cham",
  "pin-khao-khitchakut-footprint",
  "pin-shwedagon-pagoda",
  "pin-kyaiktiyo-golden-rock",
  "pin-wat-xieng-thong-luang-prabang",
  "pin-vat-phou-champasak",
  "pin-banteay-srei-cambodia",
  "pin-pura-besakih-mother-temple",
  "pin-pura-tanah-lot",
  "pin-golden-temple-amritsar",
  "pin-meenakshi-temple-madurai",
  "pin-todaiji-great-buddha",
  "pin-fushimi-inari-taisha",
  "pin-st-peters-basilica-vatican",

  // Ghost (20)
  "pin-pret-wat-suthat",
  "pin-nang-tani-banana-spirit",
  "pin-nang-takian-gold-tree",
  "pin-white-lady-balete-drive",
  "pin-mul-gwishin-water-ghost",
  "pin-dalgyal-gwishin-faceless",
  "pin-rokurokubi-long-neck",
  "pin-umibozu-giant-sea-monk",
  "pin-gashadokuro-giant-skeleton",
  "pin-kage-onna-shadow-woman",
  "pin-hampton-court-catherine-howard",
  "pin-glamis-castle-monster",
  "pin-edinburgh-castle-headless-drummer",
  "pin-leap-castle-elemental",
  "pin-green-lady-chateau-brissac",
  "pin-catacombs-of-paris-ghosts",
  "pin-poveglia-island-plague",
  "pin-st-augustine-lighthouse-ghosts",
  "pin-lizzie-borden-axe-murders",
  "pin-waverly-hills-tunnel-ghosts",

  // Monster (20)
  "pin-loch-morar-morag",
  "pin-flatwoods-monster-braxton",
  "pin-dover-demon-massachusetts",
  "pin-beast-of-bray-road",
  "pin-jersey-devil-pine-barrens",
  "pin-lizard-man-scape-ore",
  "pin-pope-lick-monster",
  "pin-mapinguari-amazon-beast",
  "pin-curupira-backward-feet",
  "pin-ahool-giant-bat-java",
  "pin-orang-pendek-sumatra",
  "pin-nuckelavee-orkney",
  "pin-selkie-seal-folk",
  "pin-kelpie-loch-waterhorse",
  "pin-cu-sith-fairy-hound",
  "pin-kamaitachi-weasel-wind",
  "pin-jorogumo-spider-woman",
  "pin-qilin-celestial-beast",
  "pin-baize-white-beast",
  "pin-sigbin-shadow-kangaroo",

  // Curse (20)
  "pin-curse-mahsuri-langkawi",
  "pin-orang-minyak-grease-man",
  "pin-salem-witch-trials-gallows",
  "pin-eastern-state-penitentiary",
  "pin-bell-witch-cave-tennessee",
  "pin-winchester-mystery-house",
  "pin-alcatraz-prison-d-block",
  "pin-stanley-hotel-room-217",
  "pin-crying-boy-cursed-painting",
  "pin-hands-resist-him-ebay-painting",
  "pin-james-dean-little-bastard",
  "pin-bus-375-midnight-beijing",
  "pin-cursed-chair-thomas-busby",
  "pin-black-orlov-eye-of-brahma",
  "pin-val-camonica-cursed-rock",
  "pin-catacomb-capuchin-palermo",
  "pin-island-of-the-dolls-xochimilco",
  "pin-crying-woman-la-llorona",
  "pin-cursed-crossroads-robert-johnson",
  "pin-tequendama-falls-hotel",

  // Legend (20)
  "pin-giant-causeway-finn-mccool",
  "pin-newgrange-passage-tomb",
  "pin-callanish-standing-stones",
  "pin-tintagel-castle-king-arthur",
  "pin-carnac-stones-megalith",
  "pin-fosse-dionne-bottomless-spring",
  "pin-neuschwanstein-curse-ludwig",
  "pin-brocken-mountain-walpurgis",
  "pin-pompeii-ruins-vesuvius",
  "pin-oracle-of-delphi-apollo",
  "pin-knossos-labyrinth-minotaur",
  "pin-parthenon-acropolis-athens",
  "pin-trolltunga-troll-tongue",
  "pin-reynisdrangar-black-sand-trolls",
  "pin-eye-of-the-sahara-richat",
  "pin-abu-simbel-ramses-temple",
  "pin-petra-treasury-jordan",
  "pin-lake-titicaca-inca-creation",
  "pin-uluru-ayers-rock-dreamtime",
  "pin-nan-madol-venice-of-pacific"
];

console.log('Total candidate IDs to test:', testBatch1100.length);
const collisions = [];
testBatch1100.forEach(id => {
  if (existingMap[id]) {
    collisions.push(id);
  }
});

console.log('ID collisions with existing 1000 pins:', collisions.length);
if (collisions.length > 0) {
  console.log('Collisions:', collisions);
} else {
  console.log('PERFECT! 100% Unique - Zero collisions!');
}

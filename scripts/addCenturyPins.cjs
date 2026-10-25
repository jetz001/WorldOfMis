const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'WorldOfMysteryBot/1.0 (contact@worldofmys.org)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(download(res.headers.location, dest));
      }
      if (res.statusCode !== 200) {
        return reject(new Error('HTTP status ' + res.statusCode + ' for ' + url));
      }
      const f = fs.createWriteStream(dest);
      res.pipe(f);
      f.on('finish', () => f.close(() => resolve(dest)));
    }).on('error', reject);
  });
}

const IMAGE_MAP = {
  'pin-machupicchu.jpg': 'https://upload.wikimedia.org/wikipedia/commons/9/9f/99_-_Machu_Picchu_-_Juin_2009_-_edit.2.jpg',
  'pin-derinkuyu.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Derinkuyu_underground_city_5873.jpg',
  'pin-mokelembembe.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/00/Mokele-mbembe_model.jpg',
  'pin-hopediamond.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/The_Hope_Diamond_at_the_Smithsonian_National_Museum_of_Natural_History.jpg',
  'pin-hoiabaciu.jpg': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Poiana_Rotunda_%28Hoia-Baciu%29.JPG',
  'pin-lallorona.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Legends_and_ghosts_of_Mexico_City._Painting.jpg',
  'pin-terracotta.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Xian_China_Terracotta-Army-Pano01.jpg',
  'pin-jacktheripper.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/a1/JacktheRipper1888.jpg',
  'pin-flatwoods.jpg': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/History_of_the_Flatwoods_Monster.jpg',
  'pin-cerberus.jpg': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Giambologna%2C_ercole_e_cerbero%2C_1576-89%2C_01.JPG',
  'pin-baalbek.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/40/Trilithon_01.jpg',
  'pin-chillingham.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Chillingham_Castle_-_geograph.org.uk_-_1040851.jpg',
  'pin-earhart.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Amelia_Earhart_standing_under_nose_of_her_Lockheed_Model_10-E_Electra%2C_small.jpg',
  'pin-sailingstones.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/20/Racetrack_Playa_sliding_rock_1.jpg',
  'pin-kelpie.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/25/Thekelpiesfalkirk.jpg',
  'pin-stanleyhotel.jpg': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Stanley_Hotel%2C_2021.jpg',
  'pin-darvaza.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Darvasa_gas_crater_panorama.jpg',
  'pin-gunungpadang.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Gunung_Padang_Megalithic_Site.jpg',
  'pin-highgate.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Monument_in_Highgate_Cemetery_West.jpg',
  'pin-richat.jpg': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Richat_Structure%2C_Mauritania_from_ISS.jpg',
  'pin-tunguska.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Tunguska_event_center_1.png',
  'pin-sedonavortex.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/50/Cathedral_Rock_Sedona_United_States_Landscape_Photography_%28145471723%29.jpeg',
  'pin-dongphayayen.jpg': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Dong_Phayayen_-_Khao_Yai_Forest_Complex-109403.jpg',
  'pin-phisueasamut.jpg': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Bkkanusunthornphu0506.jpg',
  'pin-erawanshrine.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Erawan_Shrine_4.jpg'
};

async function downloadAllImages() {
  const targetDir = path.resolve(__dirname, '../public/entities');
  console.log('Downloading 25 images to', targetDir);
  for (const [file, url] of Object.entries(IMAGE_MAP)) {
    const dest = path.join(targetDir, file);
    if (!fs.existsSync(dest)) {
      try {
        await download(url, dest);
        console.log('Downloaded', file, fs.statSync(dest).size, 'bytes');
      } catch (err) {
        console.error('Failed to download', file, err.message);
      }
    } else {
      console.log('Already exists:', file);
    }
  }
}

downloadAllImages().catch(console.error);

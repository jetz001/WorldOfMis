const https = require('https');

function verifyEmbeddable(videoId) {
  return new Promise((resolve) => {
    const oembedUrl = 'https://www.youtube.com/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + videoId) + '&format=json';
    https.get(oembedUrl, (res) => {
      if (res.statusCode === 200) {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
          try {
            const j = JSON.parse(d);
            resolve({ videoId, title: j.title, embeddable: true });
          } catch(e) { resolve({ videoId, embeddable: false }); }
        });
      } else {
        resolve({ videoId, embeddable: false });
      }
    }).on('error', () => resolve({ videoId, embeddable: false }));
  });
}

// Let's test known videos from the search results
const candidates = [
  { id: 'pin-anubis', vids: ['vPpz1uolBT8', '8-yN_jE-0jQ', 'n_Q04X55u2k'] },
  { id: 'pin-sirens', vids: ['rP-p7o8526M', 'uQy9WfS_P1s', 'D13Vq9e72_Y'] },
  { id: 'pin-brayroad', vids: ['k_wXp1X5E6U', 'r6wP5H9j1iU', 'zP9yL07v9yA'] },
  { id: 'pin-maryking', vids: ['m13p1_r0uE8', 'p8pL1m7Q3vU', 'e4Q_0xX71mY'] },
  { id: 'pin-koschei', vids: ['j6pM0u2X7wA', 'k4pQ8m9_1vU', 'e7pL1m9Q3vU'] },
  { id: 'pin-taoshum', vids: ['y4Q_0xX71mY', 'p8pL1m7Q3vU', 'zP9yL07v9yA'] },
  { id: 'pin-pegasus', vids: ['k_wXp1X5E6U', 'rP-p7o8526M', 'D13Vq9e72_Y'] },
  { id: 'pin-kitsune', vids: ['uQy9WfS_P1s', 'vPpz1uolBT8', 'n_Q04X55u2k'] },
  { id: 'pin-poveglia', vids: ['8-yN_jE-0jQ', 'r6wP5H9j1iU', 'm13p1_r0uE8'] },
  { id: 'pin-phiam', vids: ['BwFcnuQjxbU', 'ThtIKiKpNkY', '4XoOOsRr-Fo'] }
];

async function run() {
  for (const c of candidates) {
    for (const v of c.vids) {
      const res = await verifyEmbeddable(v);
      console.log(`[${c.id}] ${v} -> embeddable: ${res.embeddable} (${res.title || ''})`);
    }
  }
}

run();

const https = require('https');
const fs = require('fs');

const PIN_QUERY_MAP = {
  'pin-kuchisake': ['Kuchisake-onna'],
  'pin-lochness': ['Loch_Ness_Monster'],
  'pin-dracula': ['Vlad_the_Impaler', 'Bran_Castle'],
  'pin-wendigo': ['Wendigo'],
  'pin-chupacabra': ['Chupacabra'],
  'pin-tutankhamun': ['Mask_of_Tutankhamun'],
  'pin-bunyip': ['Bunyip'],
  'pin-maenak': ['Mae_Nak_Phra_Khanong'],
  'pin-krasue': ['Krasue'],
  'pin-pop': ['Phi_Pop'],
  'pin-naga': ['Phaya_Naga', 'Nāga'],
  'pin-saming': ['Werecat'],
  'pin-jiangshi': ['Jiangshi'],
  'pin-baba-iva': ['Baba_Yaga'],
  'pin-chudail': ['Chudail'],
  'pin-gevaudan': ['Beast_of_Gévaudan'],
  'pin-curupira': ['Curupira'],
  'pin-draugr': ['Draugr'],
  'pin-minotaur': ['Minotaur'],
  'pin-lorelei': ['Lorelei'],
  'pin-banshee': ['Banshee'],
  'pin-blackshuck': ['Black_Shuck'],
  'pin-gumiho': ['Kumiho'],
  'pin-manananggal': ['Manananggal'],
  'pin-kuntilanak': ['Kuntilanak'],
  'pin-yeti': ['Yeti'],
  'pin-ghul': ['Ghoul'],
  'pin-nightmarchers': ['Nightmarchers'],
  'pin-anansi': ['Anansi'],
  'pin-tokoloshe': ['Tikoloshe'],
  'pin-taniwha': ['Taniwha'],
  'pin-wawel': ['Wawel_Dragon'],
  'pin-mada': ['Water_ghost'],
  'pin-neakta': ['Neak_Ta'],
  'pin-natpopa': ['Popa_Medaw', 'Mount_Popa'],
  'pin-mosina': ['Mô-sîn-á'],
  'pin-mahasona': ['Mahasona'],
  'pin-deathworm': ['Mongolian_death_worm'],
  'pin-shahmaran': ['Shahmaran'],
  'pin-azzurrina': ['Azzurrina', 'Montebello_Castle_(Poggio_Torriana)'],
  'pin-santacompana': ['Santa_Compaña'],
  'pin-sasquatch': ['Bigfoot'],
  'pin-trauco': ['Trauco'],
  'pin-pishtaco': ['Pishtaco'],
  'pin-patasola': ['La_Patasola'],
  'pin-pazuzu': ['Pazuzu'],
  'pin-manticore': ['Manticore'],
  'pin-madamkoi': ['Madam_Koi_Koi'],
  'pin-skogsra': ['Huldra', 'Skogsrå'],
  'pin-huldra': ['Huldra'],
};

function fetchWikiThumbnail(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      title
    )}&prop=pageimages&format=json&pithumbsize=900`;
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'WorldOfMisFolklore/1.0 (educational research; contact@example.com)',
          },
        },
        (res) => {
          let data = '';
          res.on('data', (c) => (data += c));
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              const pages = json.query?.pages;
              if (!pages) return resolve(null);
              const pageId = Object.keys(pages)[0];
              if (pageId === '-1') return resolve(null);
              const thumb = pages[pageId]?.thumbnail?.source;
              resolve(thumb || null);
            } catch (e) {
              resolve(null);
            }
          });
        }
      )
      .on('error', () => resolve(null));
  });
}

(async () => {
  const results = {};
  for (const [pinId, queries] of Object.entries(PIN_QUERY_MAP)) {
    let found = null;
    for (const q of queries) {
      found = await fetchWikiThumbnail(q);
      if (found) {
        results[pinId] = { query: q, url: found };
        break;
      }
    }
    if (!found) {
      results[pinId] = { query: queries[0], url: null };
    }
  }
  fs.writeFileSync('wiki_results.json', JSON.stringify(results, null, 2));
  console.log('Done scanning Wikipedia images.');
})();

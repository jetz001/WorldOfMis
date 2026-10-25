const fs = require('fs');
const path = require('path');
const UA = 'WorldOfMysteryBot/1.0 (https://worldofmys.pages.dev)';
(async () => {
  for (const [lang, title] of [['sv', 'Skogsrå'], ['sv', 'Rå (folktro)'], ['no', 'Huldra'], ['en', 'Forest spirit']]) {
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail&pithumbsize=800&redirects=1&format=json&titles=${encodeURIComponent(title)}`;
    const j = await (await fetch(url, { headers: { 'User-Agent': UA } })).json();
    const src = Object.values(j?.query?.pages || {})[0]?.thumbnail?.source;
    console.log(lang, title, src);
    if (!src) continue;
    const buf = Buffer.from(await (await fetch(src, { headers: { 'User-Agent': UA } })).arrayBuffer());
    const huldra = fs.readFileSync(path.join(__dirname, '..', 'public', 'entities', 'pin-huldra.jpg'));
    if (buf.equals(huldra)) { console.log('same as huldra, skip'); continue; }
    fs.writeFileSync(path.join(__dirname, '..', 'public', 'entities', 'pin-skogsra.jpg'), buf);
    console.log('saved', buf.length);
    break;
  }
})();

const fs = require('fs');
const https = require('https');

const content = fs.readFileSync('WorldOfMis/src/data/seedData.ts', 'utf8');
const ytMatches = [...content.matchAll(/url:\s*['"](https:\/\/www\.youtube\.com\/watch\?v=[^'"]+)['"]/g)].map(m => m[1]);
console.log('Total YouTube links in seedData:', ytMatches.length);

const unique = [...new Set(ytMatches)];
console.log('Unique YouTube links:', unique.length);

async function checkOembed(url) {
  return new Promise((resolve) => {
    const oembedUrl = 'https://www.youtube.com/oembed?url=' + encodeURIComponent(url) + '&format=json';
    https.get(oembedUrl, (res) => {
      resolve({ url, ok: res.statusCode === 200, status: res.statusCode });
    }).on('error', () => resolve({ url, ok: false, status: 'error' }));
  });
}

(async () => {
  const results = [];
  for (const url of unique) {
    const res = await checkOembed(url);
    results.push(res);
  }
  const failed = results.filter(r => !r.ok);
  console.log('Valid:', results.length - failed.length);
  console.log('Failed / Not embeddable:', failed.length);
  console.log(failed);
})();

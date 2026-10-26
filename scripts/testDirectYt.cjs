const { searchYouTubeVideo } = require('./enrichNewPins.cjs');

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function testBatch() {
  const missed = [
    'Yasy Yatere',
    'Peuchen',
    'El Cuero',
    'Luison',
    'El Mohan'
  ];
  for (const name of missed) {
    const res = await searchYouTubeVideo(name);
    console.log(name, '->', res ? `${res.title} (${res.videoId})` : 'NOT FOUND');
    await sleep(2000);
  }
}
testBatch();

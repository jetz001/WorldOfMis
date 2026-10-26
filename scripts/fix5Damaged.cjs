const { searchYouTubeVideo } = require('./enrichNewPins.cjs');

async function fix5() {
  const targets = [
    { id: 'pin-chiang-dao', q: 'ตำนาน ถ้ำเชียงดาว เชียงใหม่' },
    { id: 'pin-pret-suthat', q: 'เปรตวัดสุทัศน์ เสาชิงช้า ตำนาน' },
    { id: 'pin-krahang-u-thong', q: 'ตำนาน ผีกระหัง' },
    { id: 'pin-overtoun-bridge', q: 'Overtoun Bridge Scotland mystery' },
    { id: 'pin-leap-castle', q: 'Leap Castle Ireland documentary' }
  ];

  for (const t of targets) {
    const res = await searchYouTubeVideo(t.q);
    console.log(t.id, '->', res);
  }
}

fix5();

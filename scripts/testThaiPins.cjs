const { searchYouTubeVideo } = require('./enrichNewPins.cjs');

async function testThai() {
  const r1 = await searchYouTubeVideo('ตำนาน ชาละวัน ไกรทอง พิจิตร');
  console.log('Chalawan:', r1);
  const r2 = await searchYouTubeVideo('ตำนาน ผีกระสือ สารคดี');
  console.log('Krasue:', r2);
  const r3 = await searchYouTubeVideo('สมรภูมิเขาค้อ เรื่องเล่า อาถรรพ์');
  console.log('Khao Kho:', r3);
}

testThai();

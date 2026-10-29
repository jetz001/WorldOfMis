import json
import re

# Load existing pins
with open('scripts/existing_pins_map.json', 'r', encoding='utf-8') as f:
    existing_map = json.load(f)

seen_ids = set(existing_map.keys())

def clean_id(slug):
    s = re.sub(r'[^a-z0-9]+', '-', slug.lower()).strip('-')
    cid = f"pin-{s}"
    if cid in seen_ids:
        c = 2
        while f"{cid}-{c}" in seen_ids:
            c += 1
        cid = f"{cid}-{c}"
    seen_ids.add(cid)
    return cid

# Define templates and generator dictionaries for all 5 categories
# Sacred entries (180 total)
sacred_seeds = [
    # Thailand / Lanna / Isan / South (30)
    ("วัดร่องขุ่น (สถาปัตยกรรมสวรรค์และปรัชญาธรรมแห่งเชียงราย)", "Wat Rong Khun (The White Heaven Temple of Chiang Rai)", "sacred", "เชียงราย (ไทย)", "Chiang Rai (Thailand)", "เมืองเชียงราย", "Mueang Chiang Rai", 19.8242, 99.7631, "temple_bell",
     "มหาพุทธศิลป์สีขาวบริสุทธิ์ประดับกระจกแวววาว สร้างสรรค์โดยอาจารย์เฉลิมชัย โฆษิตพิพัฒน์ สื่อถึงความบริสุทธิ์ของพระพุทธองค์และสะพานข้ามวัฏสงสาร",
     "A contemporary masterwork of Buddhist architecture created by Chalermchai Kositpipat, shimmering in white plaster and mirrored glass symbolizing the path to enlightenment.",
     "เริ่มก่อสร้างตั้งแต่ปี พ.ศ. 2540 ผสมผสานศิลปะล้านนาโบราณเข้ากับสัญลักษณ์ร่วมสมัย เป็นหมุดหมายทางจิตวิญญาณระดับโลก",
     "Constructed since 1997, merging traditional Lanna elements with surreal contemporary cosmology.",
     "ห้ามเดินถอยหลังข้ามสะพานวัฏสงสารสู่พระอุโบสถตามคติธรรมโบราณ", "Never walk backwards across the Bridge of the Cycle of Rebirth.", "วัดร่องขุ่น อาจารย์เฉลิมชัย สารคดี"),

    ("วัดพระธาตุผาซ่อนแก้ว (เจดีย์พระพุทธเจ้า 5 พระองค์ท่ามกลางสายหมอก)", "Wat Phra That Pha Sorn Kaew (Five White Buddhas of Khao Kho)", "sacred", "เพชรบูรณ์ (ไทย)", "Phetchabun (Thailand)", "เขาค้อ", "Khao Kho", 16.7897, 101.0538, "temple_bell",
     "มหาวิหารพระพุทธเจ้า 5 พระองค์สีขาวซ้อนเรียงกันอย่างสง่างามบนยอดเขาสูง ประดับด้วยถ้วยชามเบญจรงค์และหินสีมากกว่า 5 ล้านชิ้น สะท้อนแสงอาทิตย์ท่ามกลางทะเลหมอก",
     "A breathtaking mountain sanctuary featuring five graduated white Buddha statues nested upon rolling green peaks, decorated with millions of colorful mosaic tiles and fine porcelain.",
     "สถานที่ปฏิบัติธรรมท่ามกลางธรรมชาติอันสงบ ก่อตั้งขึ้นในปี 2547 เพื่อสืบทอดพระพุทธศาสนาและวิปัสสนากรรมฐาน",
     "Founded in 2004 as a meditation retreat, honoring the five Buddhas of the present auspicious kalpa.",
     "ห้ามส่งเสียงดังหรือวิ่งเล่นบนลานกระเบื้องโมเสกศักดิ์สิทธิ์", "Maintain absolute noble silence on the mosaic observation decks.", "วัดพระธาตุผาซ่อนแก้ว เขาค้อ สารคดี"),

    ("วัดบ้านไร่และวิหารเทพวิทยาคม (อุทยานธรรมกลางน้ำหลวงพ่อคูณ)", "Wat Ban Rai and Wihan Thep Witthayakhom (Luang Phor Koon Holy Shrine)", "sacred", "นครราชสีมา (ไทย)", "Nakhon Ratchasima (Thailand)", "ด่านขุนทด", "Dan Khun Thot", 15.2997, 101.7374, "temple_bell",
     "วิหารเซรามิกรูปช้างเอราวัณยักษ์กลางสระน้ำขนาด 30 ไร่ ประดับกระเบื้องโมเสกเซรามิกกว่า 20 ล้านชิ้น ถ่ายทอดพระไตรปิฎกและบารมีธรรมของหลวงพ่อคูณ ปริสุทโธ",
     "The colossal mosaic ceramic elephant shrine floating on an expansive lake, displaying over 20 million hand-crafted tiles depicting the Buddhist Tripitaka and teachings of Luang Phor Koon.",
     "สร้างขึ้นเพื่อเป็นอนุสรณ์สถานแห่งปัญญาและทานบารมีของหลวงพ่อคูณ พระเกจิอาจารย์ผู้เปี่ยมด้วยเมตตาแห่งดินแดนอีสาน",
     "A monumental ceramic cultural architecture dedicated to the revered monk Luang Phor Koon Parisuttho.",
     "ห้ามแกะหรือทำลายเศษกระเบื้องโมเสกเซรามิกบนผนังวิหาร", "Do not touch or pry loose the delicate exterior ceramic tiles.", "วัดบ้านไร่ วิหารเทพวิทยาคม หลวงพ่อคูณ"),

    ("วัดพระมหาธาตุวรมหาวิหาร นครศรีธรรมราช (พระบรมธาตุไร้เงาแห่งตามพรลิงก์)", "Wat Phra Mahathat Nakhon Si Thammarat (The Shadowless Golden Spire)", "sacred", "นครศรีธรรมราช (ไทย)", "Nakhon Si Thammarat (Thailand)", "เมืองนครศรีธรรมราช", "Mueang Nakhon Si Thammarat", 8.4119, 99.9664, "temple_bell",
     "พระบรมธาตุเจดีย์ทรงระฆังคว่ำศิลปะลังกายอดหุ้มทองคำแท้กว่า 600 กิโลกรัม ปรากฏความอัศจรรย์คือยอดเจดีย์ไม่เคยทอดเงาลงบนพื้นลานทราย ไม่ว่าดวงอาทิตย์จะอยู่มุมใด",
     "The paramount sacred pagoda of southern Thailand clad in 600 kg of pure gold leaf. Renowned for its ancient miracle: the pinnacle never casts a shadow onto the surrounding sand courtyard.",
     "มีประวัติศาสตร์ยาวนานกว่า 1,500 ปี เป็นศูนย์กลางอาณาจักรตามพรลิงก์และเส้นทางเผยแผ่พระพุทธศาสนานิกายเถรวาทในแหลมมลายู",
     "Dating back over 1,500 years as the spiritual epicenter of the ancient Tambralinga maritime kingdom.",
     "ห้ามสวมรองเท้าก้าวเข้าสู่ลานทรายรอบองค์พระบรมธาตุ", "Remove footwear before stepping onto the sacred white sand courtyard.", "วัดพระมหาธาตุ นครศรีธรรมราช พระบรมธาตุไร้เงา"),

    ("วัดพระพุทธบาทสระบุรี (รอยพระพุทธบาทศักดิ์สิทธิ์แห่งเขาสุวรรณบรรพต)", "Wat Phra Phutthabat Saraburi (The Sacred Footprint of Suwan Banphot)", "sacred", "สระบุรี (ไทย)", "Saraburi (Thailand)", "พระพุทธบาท", "Phra Phutthabat", 14.7188, 100.7891, "temple_bell",
     "มณฑปยอดปราสาทเจ็ดชั้นครอบรอยพระพุทธบาทประทับบนแผ่นหินธรรมชาติที่ค้นพบในสมัยสมเด็จพระเจ้าทรงธรรมแห่งกรุงศรีอยุธยา ลวดลายมงคล 108 ประการส่องประกายศักดิ์สิทธิ์",
     "A seven-tiered golden mondop enclosing the natural stone footprint of Gautama Buddha discovered by a hunter during the reign of King Songtham in the Ayutthaya period.",
     "เป็นศูนย์กลางการจาริกแสวงบุญที่สำคัญที่สุดแห่งหนึ่งของสยาม มีประเพณีตักบาตรดอกเข้าพรรษาอันเป็นเอกลักษณ์หนึ่งเดียวในโลก",
     "The premier pilgrimage destination of central Siam, celebrated for the unique floral almsgiving festival of Khao Phansa.",
     "ห้ามยืนค้ำหรือเหยียบขอบแท่นมณฑปรอยพระพุทธบาท", "Do not stand upon or lean against the gilded footprint pedestal rim.", "วัดพระพุทธบาท สระบุรี ประวัติ รอยพระพุทธบาท")
]

print(f"Sample seed loaded: {len(sacred_seeds)}")

import json
import re

with open('scripts/existing_pins_map.json', 'r', encoding='utf-8') as f:
    existing_map = json.load(f)

seen_ids = set(existing_map.keys())

def clean_id(slug):
    s = re.sub(r'[^a-z0-9]+', '-', slug.lower()).strip('-')[:42]
    cid = f"pin-{s}"
    if cid in seen_ids:
        c = 2
        while f"{cid}-{c}" in seen_ids:
            c += 1
        cid = f"{cid}-{c}"
    seen_ids.add(cid)
    return cid

# Define 180 Sacred sites across the world
# (Thai, East Asia, SE Asia, South Asia, Europe, Middle East, Africa, Americas, Oceania)
sacred_locations = [
    # 1-20
    ("วัดพระแก้วมรกต ลำปาง", "Wat Phra Kaew Don Tao (Ancient Emerald Buddha Shrine)", "ลำปาง (ไทย)", "Lampang (Thailand)", "เมืองลำปาง", "Mueang Lampang", 18.3031, 99.5089, "temple_bell", "wat phra kaew don tao lampang"),
    ("วัดพระธาตุดอยกองมู แม่ฮ่องสอน", "Wat Phra That Doi Kong Mu (White Mountain Stupa of the Shan)", "แม่ฮ่องสอน (ไทย)", "Mae Hong Son (Thailand)", "เมืองแม่ฮ่องสอน", "Mueang Mae Hong Son", 19.2997, 97.9592, "temple_bell", "พระธาตุดอยกองมู แม่ฮ่องสอน"),
    ("วัดพระบรมธาตุนครชุม กำแพงเพชร", "Wat Phra Borommathat Nakhon Chum (Ancient Sukhothai Relic)", "กำแพงเพชร (ไทย)", "Kamphaeng Phet (Thailand)", "เมืองกำแพงเพชร", "Mueang Kamphaeng Phet", 16.4719, 99.5161, "temple_bell", "พระบรมธาตุนครชุม กำแพงเพชร"),
    ("วัดใหญ่ชัยมงคล อยุธยา", "Wat Yai Chai Mongkhon (Great Victory Chedi of King Naresuan)", "พระนครศรีอยุธยา (ไทย)", "Ayutthaya (Thailand)", "พระนครศรีอยุธยา", "Phra Nakhon Si Ayutthaya", 14.3458, 100.5925, "temple_bell", "วัดใหญ่ชัยมงคล อยุธยา ประวัติ"),
    ("วัดพระนอนจักรสีห์ สิงห์บุรี", "Wat Phra Non Chaksi (Colossal Reclining Buddha of Sing Buri)", "สิงห์บุรี (ไทย)", "Sing Buri (Thailand)", "ค่ายบางระจัน", "Khai Bang Rachan", 14.8692, 100.3839, "temple_bell", "วัดพระนอนจักรสีห์ สิงห์บุรี"),
    ("วัดมหาธาตุ สุโขทัย", "Wat Mahathat Sukhothai (Lotus Bud Stupa of the First Kingdom)", "สุโขทัย (ไทย)", "Sukhothai (Thailand)", "เมืองเก่า", "Old City", 17.0175, 99.7036, "temple_bell", "วัดมหาธาตุ สุโขทัย สารคดี"),
    ("วัดพระศรีรัตนมหาธาตุ พิษณุโลก", "Wat Phra Si Rattana Mahathat (Home of Phra Buddha Chinnarat)", "พิษณุโลก (ไทย)", "Phitsanulok (Thailand)", "เมืองพิษณุโลก", "Mueang Phitsanulok", 16.8242, 100.2619, "temple_bell", "พระพุทธชินราช วัดใหญ่ พิษณุโลก"),
    ("วัดพระธาตุเชิงชุม สกลนคร", "Wat Phra That Choeng Chum (Four Buddhas Sacred Footprints)", "สกลนคร (ไทย)", "Sakon Nakhon (Thailand)", "เมืองสกลนคร", "Mueang Sakon Nakhon", 17.1558, 104.1506, "temple_bell", "พระธาตุเชิงชุม สกลนคร"),
    ("วัดพระธาตุเรณู นครพนม", "Wat Phra That Renu (Pink Chedi of the Phu Thai People)", "นครพนม (ไทย)", "Nakhon Phanom (Thailand)", "เรณูนคร", "Renu Nakhon", 17.0608, 104.6789, "temple_bell", "พระธาตุเรณู นครพนม"),
    ("วัดพระธาตุศรีสองรัก ด่านซ้าย", "Wat Phra That Si Song Rak (Monument of Lao-Siamese Fraternity)", "เลย (ไทย)", "Loei (Thailand)", "ด่านซ้าย", "Dan Sai", 17.2708, 101.1442, "temple_bell", "พระธาตุศรีสองรัก ด่านซ้าย"),
    ("วัดภูทอก บึงกาฬ", "Wat Phu Thok (The Seven-Level Cliff Stairway to Enlightenment)", "บึงกาฬ (ไทย)", "Bueng Kan (Thailand)", "ศรีวิไล", "Si Wilai", 18.1297, 103.8822, "temple_bell", "วัดภูทอก บึงกาฬ สารคดี"),
    ("วัดพระมหาธาตุแก่นนคร ขอนแก่น", "Wat Nong Wang (Nine-Story Stupa of Kaen Nakhon)", "ขอนแก่น (ไทย)", "Khon Kaen (Thailand)", "เมืองขอนแก่น", "Mueang Khon Kaen", 16.4172, 102.8361, "temple_bell", "พระมหาธาตุแก่นนคร ขอนแก่น"),
    ("วัดสระเกศ ภูเขาทอง กรุงเทพ", "Wat Saket (The Golden Mount and Heavenly Relic Stupa)", "กรุงเทพมหานคร (ไทย)", "Bangkok (Thailand)", "ป้อมปราบศัตรูพ่าย", "Pom Prap Sattru Phai", 13.7539, 100.5067, "temple_bell", "วัดสระเกศ ภูเขาทอง ประวัติ"),
    ("วัดโพธิ์ ท่าเตียน", "Wat Pho (Temple of the Reclining Buddha & Thai Traditional Medicine)", "กรุงเทพมหานคร (ไทย)", "Bangkok (Thailand)", "พระนคร", "Phra Nakhon", 13.7466, 100.4933, "temple_bell", "วัดโพธิ์ พระนอน ท่าเตียน"),
    ("วัดสุทัศนเทพวราราม เสาชิงช้า", "Wat Suthat Thepwararam (Royal Temple of the Great Giant Swing)", "กรุงเทพมหานคร (ไทย)", "Bangkok (Thailand)", "พระนคร", "Phra Nakhon", 13.7511, 100.5015, "temple_bell", "วัดสุทัศน์ พระศรีศากยมุนี"),
    ("วัดกัลยาณมิตร หลวงพ่อโต", "Wat Kalayanamitr (Sam Pho Kong Guardian of the Chao Phraya)", "กรุงเทพมหานคร (ไทย)", "Bangkok (Thailand)", "ธนบุรี", "Thon Buri", 13.7400, 100.4908, "temple_bell", "วัดกัลยาณมิตร ซำปอกง"),
    ("วัดไตรมิตรวิทยาราม หลวงพ่อทองคำ", "Wat Traimit (The Golden Buddha 5.5-Ton Pure Gold Marvel)", "กรุงเทพมหานคร (ไทย)", "Bangkok (Thailand)", "สัมพันธวงศ์", "Samphanthawong", 13.7378, 100.5136, "temple_bell", "หลวงพ่อทองคำ วัดไตรมิตร ประวัติ"),
    ("วัดพระปฐมเจดีย์ นครปฐม", "Wat Phra Pathommachedi (The Tallest Golden Stupa in Thailand)", "นครปฐม (ไทย)", "Nakhon Pathom (Thailand)", "เมืองนครปฐม", "Mueang Nakhon Pathom", 13.8197, 100.0603, "temple_bell", "พระปฐมเจดีย์ นครปฐม สารคดี"),
    ("วัดโสธรวราราม แปดริ้ว", "Wat Sothon Wararam (Miraculous Luang Phor Sothon by the Bang Pakong)", "ฉะเชิงเทรา (ไทย)", "Chachoengsao (Thailand)", "เมืองฉะเชิงเทรา", "Mueang Chachoengsao", 13.6739, 101.0672, "temple_bell", "หลวงพ่อโสธร วัดโสธร ประวัติ"),
    ("วัดเขาตะเกียบ หัวหิน", "Wat Khao Takiab (The Seaside Mountain Sanctuary of Hua Hin)", "ประจวบคีรีขันธ์ (ไทย)", "Prachuap Khiri Khan (Thailand)", "หัวหิน", "Hua Hin", 12.5161, 99.9806, "temple_bell", "วัดเขาตะเกียบ หัวหิน"),
    # 21-40: East & South Asia
    ("วัดคิโยมิซุเดระ เกียวโต", "Kiyomizu-dera (The Pure Water Wooden Terrace Temple)", "เกียวโต (ญี่ปุ่น)", "Kyoto (Japan)", "ฮิกาชิยามะ", "Higashiyama", 34.9949, 135.7850, "temple_bell", "Kiyomizu-dera temple Kyoto history"),
    ("วัดเซ็นโซจิ อาซากุสะ", "Senso-ji (The Ancient Kannon Bodhisattva Temple of Asakusa)", "โตเกียว (ญี่ปุ่น)", "Tokyo (Japan)", "ไทโตะ", "Taito", 35.7148, 139.7967, "temple_bell", "Senso-ji Asakusa temple Tokyo documentary"),
    ("ศาลเจ้าฟูชิมิอินาริ ประตูโทริอิพันต้น", "Fushimi Inari Taisha (Ten Thousand Vermilion Torii Shrines)", "เกียวโต (ญี่ปุ่น)", "Kyoto (Japan)", "ฟูชิมิ", "Fushimi", 34.9671, 135.7727, "temple_bell", "Fushimi Inari Taisha shrine torii documentary"),
    ("วัดคินคาคุจิ ปราสาททอง", "Kinkaku-ji (The Golden Pavilion Zen Temple of Kyoto)", "เกียวโต (ญี่ปุ่น)", "Kyoto (Japan)", "คิตะ", "Kita", 35.0394, 135.7292, "temple_bell", "Kinkaku-ji golden pavilion Kyoto documentary"),
    ("วัดโทไดจิ หลวงพ่อโตนารา", "Todai-ji (The Great Daibutsu Hall of Nara)", "นารา (ญี่ปุ่น)", "Nara (Japan)", "เมืองนารา", "Nara City", 34.6890, 135.8398, "temple_bell", "Todai-ji temple Great Buddha Nara documentary"),
    ("ศาลเจ้าอิเสะจิงกู", "Ise Jingu (The Grand Sacred Sun Goddess Shrine of Amaterasu)", "มิเอะ (ญี่ปุ่น)", "Mie (Japan)", "อิเสะ", "Ise", 34.4550, 136.7258, "temple_bell", "Ise Jingu shrine Japan sacred Shinto documentary"),
    ("ศาลเจ้าอิสึกุชิมะ มิยาจิมะ", "Itsukushima Shrine (The Floating Torii Gate of Miyajima)", "ฮิโรชิม่า (ญี่ปุ่น)", "Hiroshima (Japan)", "ฮัตสึไคจิ", "Hatsukaichi", 34.2958, 132.3197, "temple_bell", "Itsukushima floating torii gate Miyajima documentary"),
    ("วัดพุลกุกซา คย็องจู", "Bulguksa Temple (The Golden Silla Buddhist Sanctuary)", "คย็องซังเหนือ (เกาหลีใต้)", "Gyeongsangbuk-do (South Korea)", "คย็องจู", "Gyeongju", 35.8350, 129.3322, "temple_bell", "Bulguksa temple Gyeongju South Korea documentary"),
    ("วัดแฮอินซา พระไตรปิฎกฉบับเกาหลี", "Haeinsa Temple (The Tripitaka Koreana 80,000 Woodblocks)", "คย็องซังใต้ (เกาหลีใต้)", "Gyeongsangnam-do (South Korea)", "ฮับช็อน", "Hapcheon", 35.8014, 128.0983, "temple_bell", "Haeinsa temple Tripitaka Koreana documentary"),
    ("วัดโชกัง ลาซา ทิเบต", "Jokhang Temple (The Spiritual Heart of Tibetan Buddhism)", "ลาซา (ทิเบต)", "Lhasa (Tibet)", "เฉิงกวน", "Chengguan", 29.6528, 91.1314, "temple_bell", "Jokhang temple Lhasa Tibet Buddhism documentary"),
    ("พระราชวังโปตาลา ลาซา", "Potala Palace (The High Mountain Winter Seat of the Dalai Lama)", "ลาซา (ทิเบต)", "Lhasa (Tibet)", "เฉิงกวน", "Chengguan", 29.6578, 91.1169, "temple_bell", "Potala Palace Lhasa Tibet documentary"),
    ("วัดพระเขี้ยวแก้ว แคนดี้ ศรีลังกา", "Temple of the Sacred Tooth Relic (Sri Dalada Maligawa)", "เซ็นทรัลพรอวินซ์ (ศรีลังกา)", "Central Province (Sri Lanka)", "แคนดี้", "Kandy", 7.2936, 80.6414, "temple_bell", "Temple of the Tooth Kandy Sri Lanka documentary"),
    ("วัดถ้ำดัมบูลลา ศรีลังกา", "Dambulla Cave Temple (The Golden Rock Cave Monastery)", "เซ็นทรัลพรอวินซ์ (ศรีลังกา)", "Central Province (Sri Lanka)", "ดัมบูลลา", "Dambulla", 7.8567, 80.6483, "temple_bell", "Dambulla cave temple Sri Lanka history"),
    ("เทวสถานไกรลาส เอลโลรา อินเดีย", "Kailasa Temple at Ellora (The Monolithic Rock-Cut Marvel)", "มหาราษฏระ (อินเดีย)", "Maharashtra (India)", "เอารังคาบัด", "Aurangabad", 20.0239, 75.1792, "temple_bell", "Kailasa temple Ellora rock cut caves documentary"),
    ("เทวสถานพฤหทิศวร ทันชาวูร์", "Brihadisvara Temple (The Great Living Chola Chariot Temple)", "ทมิฬนาฑู (อินเดีย)", "Tamil Nadu (India)", "ทันชาวูร์", "Thanjavur", 10.7828, 79.1319, "temple_bell", "Brihadisvara temple Thanjavur Chola architecture"),
    ("เทวสถานมีนักษี อัมมัน มทุไร", "Meenakshi Amman Temple (The Towering Rainbow Gopuram City)", "ทมิฬนาฑู (อินเดีย)", "Tamil Nadu (India)", "มทุไร", "Madurai", 9.9197, 78.1194, "temple_bell", "Meenakshi Amman temple Madurai India documentary"),
    ("วิหารทองคำ อัมริตสาร์ สิกข์", "Sri Harmandir Sahib (The Golden Temple of the Sikhs)", "ปัญจาบ (อินเดีย)", "Punjab (India)", "อัมริตสาร์", "Amritsar", 31.6200, 74.8764, "temple_bell", "Golden Temple Amritsar Harmandir Sahib documentary"),
    ("พุทธคยา มหาเจดีย์ตรัสรู้", "Mahabodhi Temple Complex at Bodh Gaya (Enlightenment Tree)", "พิหาร (อินเดีย)", "Bihar (India)", "คยา", "Gaya", 24.6958, 84.9914, "temple_bell", "Mahabodhi temple Bodh Gaya documentary"),
    ("พาราณสี ท่ามณีการ์ณิกา ริมฝั่งคงคา", "Manikarnika Ghat (The Eternal Funeral Pyres of Varanasi)", "อุตตรประเทศ (อินเดีย)", "Uttar Pradesh (India)", "พาราณสี", "Varanasi", 25.3108, 83.0136, "temple_bell", "Varanasi Manikarnika Ghat Ganges sacred ritual"),
    ("เทวสถานปศุปตินาถ กาฐมาณฑุ", "Pashupatinath Temple (The Sacred Shiva Sanctum of the Bagmati)", "กาฐมาณฑุ (เนปาล)", "Kathmandu (Nepal)", "กาฐมาณฑุ", "Kathmandu", 27.7106, 85.3486, "temple_bell", "Pashupatinath temple Kathmandu Nepal documentary")
]

print(f"Defined {len(sacred_locations)} base sacred landmarks.")

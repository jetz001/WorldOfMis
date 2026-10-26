# 🌍 World of Mystery (WorldOfMis) - Global Folklore & Supernatural Interactive Globe

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages%20%26%20Workers-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-worldofmys.pages.dev-success?logo=cloudflare)](https://worldofmys.pages.dev/)
[![Stories Count](https://img.shields.io/badge/Folklore%20Stories-700%20Unique%20Pins-emerald)](https://worldofmys.pages.dev/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre-Globe%20Projection-3b82f6)](https://maplibre.org/)
[![React](https://img.shields.io/badge/React%2019-Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![D1 & R2](https://img.shields.io/badge/Cloudflare-D1%20%26%20R2-orange)](https://developers.cloudflare.com/)

แพลตฟอร์มเว็บแอปพลิเคชัน 3D Interactive Earth สำหรับสำรวจตำนานผี สัตว์ในตำนาน ประวัติศาสตร์ท้องถิ่น และเรื่องเล่าลี้ลับจาก**ทั่วทุกมุมโลก (Global Folklore, Myths & Legends)** ครบ **700 เรื่องไม่ซ้ำกัน** ในสไตล์ **Radio Garden** ผสมผสาน **Antique Parchment Grimoire (คัมภีร์กระดาษโบราณ)** โดยใช้ **MapLibre GL 3D Globe Projection** เป็นแกนหลัก และขับเคลื่อนด้วยสถาปัตยกรรมไร้เซิร์ฟเวอร์ความเร็วสูง **Cloudflare Edge Ecosystem (Pages, Functions, D1 Database, R2 Storage)**

🌐 **เว็บไซต์ทางการ (Live URL)**: [https://worldofmys.pages.dev/](https://worldofmys.pages.dev/)

---

## ✨ ไฮไลต์ฟีเจอร์เด่น (Key Features)

### 1. 📜 หน้าต่างอ่านเรื่องเล่าสไตล์คัมภีร์กระดาษโบราณ (Antique Aged Parchment Reader)
- **เนื้อสัมผัสกระดาษเก่า:** พื้นผิวไล่เฉดสีกระดาษสาและคราบน้ำชา/กาแฟโบราณ (`radial-gradient` tea-stains) พร้อมขอบไหม้เกรียมแบบวินเทจ (`vignette scorched edges`)
- **กรอบฉลุมุมวิกตอเรียน (Victorian Filigree Borders):** กรอบเส้นคู่ Hairline Frame พร้อมลวดลายฉลุประดับ 4 มุม ([`VintageCorner`](src/components/UI/VintageOrnament.tsx)) และเส้นคั่นกนกโบราณ ([`VintageDivider`](src/components/UI/VintageOrnament.tsx))
- **ฟอนต์โบราณคลาสสิก:** ตัวอักษรสีหมึกซีเปียเข้ม รองรับภาษาไทยและสากลอย่างงดงามด้วย `Noto Serif Thai` และ `Playfair Display`

### 2. 🔍 ระบบค้นหาแบบม้วนกระดาษคลี่ 2.5D (Ivory Parchment Scroll Unroll Search)
- **อนิเมชัน 2.5D:** เมื่อพิมพ์ค้นหา รายการผลลัพธ์จะคลี่ม้วนกระดาษสีงาช้างโบราณลงมาอย่างนุ่มนวล (`animate-parchment-unroll`)
- **เซิสบาร์โปร่งใส 50%:** แถบค้นหาด้านบนใช้สีกระดาษงาช้างโปร่งใส 50% ผสานม่านแก้วเบลอ มองเห็นลูกโลก 3D ด้านหลังได้อย่างลงตัว
- **Semantic / Contextual Search:** ค้นหาตามบรรยากาศและแนวเรื่องเล่า (เช่น *"วิญญาณในน้ำ"*, *"ป่าหิมะ"*, *"งูยักษ์"*) พร้อมสรุปบริบทอัตโนมัติ

### 3. 🌍 ลูกโลก 3D อินเทอร์แอกทีฟและ 700 เรื่องเล่ารอบโลก (3D Globe Projection)
- รวบรวมเรื่องเล่าและสิ่งลี้ลับครบ **700 หมุด ไม่ซ้ำกัน** ครอบคลุมทุกทวีปทั่วโลก (เอเชีย, ยุโรป, อเมริกาเหนือ-ใต้, แอฟริกา, โอเชียเนีย)
- ระบบจัดกลุ่มชุมทางเรื่องเล่า (Nexus Clusters) พร้อมปุ่มสำรวจชุมทางและแอนิเมชันบินกล้อง (Fly-to) ไปยังพิกัดหมุด
- **ปุ่มลูกโลกเรืองแสงลอยตัว (Floating Circular Globe Button):** ปรับให้กะทัดรัด ไม่เกะกะสายตา แตะเพื่อซูมออกสู่มุมมองภาพรวมโลกได้ทันที

### 4. 🎬 คลังสื่อผสมคุณภาพสูงและวิดีโอสารคดี (Verified Multimedia Carousel)
- ผู้เล่นสื่อระดับ Steam-style รองรับทั้งภาพถ่ายประวัติศาสตร์และวิดีโอสารคดี YouTube ที่ผ่านการตรวจสอบความถูกต้อง (oEmbed Validated)
- รองรับโหมดดูภาพขนาดใหญ่เต็มหน้าจอ (Fill-page Lightbox)

### 5. 🔬 สารานุกรมจำแนกประเภทและข้อห้ามโบราณ (Entity Bestiary & Taboos Protocol)
- ระบบระบุข้อมูลจำเพาะ (Classification Infobox) ขนาด, น้ำหนัก, ถิ่นอาศัย, เวลาออกหากิน และระดับความอันตราย (Omen Level)
- รองรับประเภทสิ่งมีชีวิตหลากหลาย เช่น เผ่าพันธุ์เงือก/พรายน้ำ (`merfolk_spirit`), อสรพิษน้ำลึก (`aquatic_serpent`), อสูรดึกดำบรรพ์ (`cryptid_beast`), ผีดิบ/ปีศาจปีก
- ข้อห้ามโบราณและวิธีเอาชีวิตรอด (Ancient Taboos & Survival Protocol) จัดวางในการ์ดตราประทับสีชาดโบราณ

### 6. 💬 กระดานพยานบอกเล่าและลานคอมเมนต์ลอย (Eyewitness Evidence & World Fountain)
- ผู้ใช้สามารถร่วมบันทึกความคิดเห็นและคำบอกเล่าพยานในแต่ละหมุดเรื่องเล่า พร้อมระบบกดถูกใจ (Likes) และตอบกลับ (Replies)
- **World Comment Fountain:** เมื่อซูมออกสู่มุมมองโลก จะสามารถส่งข้อความลอยขึ้นสู่ชั้นบรรยากาศลูกโลก 3D ได้แบบเรียลไทม์

### 7. 📻 ระบบเสียงคลื่นวิทยุความถี่สั้น (Web Audio Synthesizer)
- สังเคราะห์เสียงเสียงจูนคลื่นวิทยุโบราณ (Heterodyne Radio Sweep) ขณะหมุนลูกโลก และเสียงบรรยากาศเฉพาะกลุ่ม (Ambient Soundscapes)

---

## 🗺️ ตัวอย่างหมวดหมู่ตำนานรอบโลก (Sample Folklore Categories)

| หมวดหมู่ | สัญลักษณ์ | ตัวอย่างเรื่องเล่าเด่น | ประเทศ / แหล่งกำเนิด |
| :--- | :---: | :--- | :--- |
| **วิญญาณและผีพราย (Ghosts)** | 👻 | แม่นาคพระโขนง, คุชิซาเกะ-อนนะ, ลา โยโรนา (La Llorona) | ไทย, ญี่ปุ่น, เม็กซิโก |
| **อมนุษย์และสัตว์ในตำนาน (Monsters)** | 🔥 | อาดาโร (Adaro), งูมา-โมเนเน (Nguma-monene), เนสซี (Loch Ness) | หมู่เกาะโซโลมอน, คองโก, สกอตแลนด์ |
| **คุณไสยและคำสาป (Curses)** | 💀 | คำสาปฟาโรห์ตุตันคาเมน, คำสาปเพชรโฮป, ผีกระสือยายสาย | อียิปต์, สหรัฐฯ, ไทย |
| **สิ่งศักดิ์สิทธิ์และทวยเทพ (Sacred)** | 👑 | พญานาคแม่น้ำโขง, ภูเขาไฟฟูจิกับโคโนฮานะซากุยะ, ป่าวิหารแอซเท็ก | ไทย/ลาว, ญี่ปุ่น, เม็กซิโก |
| **ประวัติศาสตร์ลี้ลับ (Folklore)** | 📖 | ปราสาทแดร็กคูลา, นครแอตแลนติส, ทัชมาฮาลสีดำ | โรมาเนีย, กรีซ, อินเดีย |

---

## 🛠️ สถาปัตยกรรมทางเทคนิค (Tech Stack)

```
[ Frontend Client (React 19 + TypeScript + Vite + Tailwind CSS v4) ]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
[ MapLibre GL 3D Globe ]              [ Hono Edge API (Cloudflare Pages) ]
            │                                     │
            ▼                                     ▼
[ Web Audio Synth Engine ]            [ Cloudflare D1 (SQLite Database) ]
                                                  │
                                                  ▼
                                      [ Cloudflare R2 (Media Storage) ]
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **3D Globe Engine**: MapLibre GL (Globe Projection, Satellite Raster Tiles, Nexus Clustering, Fly-to Cameras)
- **Typography & Styling**: Noto Serif Thai, Playfair Display, Pure CSS 3D Transforms, Radial Tea-Stain Shaders
- **Edge Backend**: Hono.js on Cloudflare Pages Functions (`/api/*`)
- **Database**: Cloudflare D1 (Serverless Distributed SQLite)
- **Object Storage**: Cloudflare R2 Bucket
- **Audio Engine**: Web Audio API (Shortwave Heterodyne Sound Synthesizer)

---

## 🚀 การติดตั้งและรันในเครื่อง (Local Development)

```bash
# 1. โคลนคลังโค้ดและติดตั้ง Dependencies
git clone https://github.com/jetz001/WorldOfMis.git
cd WorldOfMis
npm install

# 2. เริ่มต้นรัน Local Development Server (Vite)
npm run dev

# 3. หรือทดสอบแบบ Full-Stack ร่วมกับ Cloudflare Pages Functions & D1 Local
npx wrangler pages dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

---

## ☁️ การ Deploy ไปยัง Cloudflare Pages & D1

```bash
# 1. บิลด์โปรเจกต์เป็น Production Bundle
npm run build

# 2. ตรวจสอบสถานะการเชื่อมต่อ Cloudflare
npx wrangler whoami

# 3. อัปเดตข้อมูล D1 ฐานข้อมูล (หากมีการปรับปรุง schema หรือ seed)
npx wrangler d1 execute worldofmys-db --remote --command "SELECT count(*) FROM ghost_pins"

# 4. Deploy ไปยัง Cloudflare Pages
npx wrangler pages deploy dist --project-name worldofmys
```

---

## 👤 บัญชีแอดมินสำหรับการทดสอบระบบหลังบ้าน (Admin Backoffice)

- **เข้าสู่ระบบ:** พิมพ์ `/admin` ในช่องค้นหา หรือกดโลโก้หน้าเว็บติดต่อกัน 5 ครั้ง
- **Username**: `admin`
- **Password**: `password123`

---

## 📜 ใบอนุญาต (License)

MIT License - พัฒนาขึ้นเพื่อการอนุรักษ์ ศึกษา และเผยแพร่มรดกทางวัฒนธรรมตำนานเรื่องเล่าพื้นบ้านรอบโลก

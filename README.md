# 🌍 World of Mystery (WorldOfMis) - Global Folklore & Supernatural Interactive Globe

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages%20%26%20Workers-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-worldofmys.pages.dev-success?logo=cloudflare)](https://worldofmys.pages.dev/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre-Globe%20Projection-3b82f6)](https://maplibre.org/)
[![React](https://img.shields.io/badge/React%2019-Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![D1 & R2](https://img.shields.io/badge/Cloudflare-D1%20%26%20R2-orange)](https://developers.cloudflare.com/)

แพลตฟอร์มเว็บแอปพลิเคชัน Interactive Earth สำหรับสำรวจตำนานผี ประวัติศาสตร์ท้องถิ่น และเรื่องเล่าลี้ลับจาก**ทั่วทุกมุมโลก (Global Folklore, Myths & Legends)** สไตล์ **Radio Garden** โดยใช้ **MapLibre GL กับ globe projection** เป็นแกนหลักของประสบการณ์แผนที่ และขับเคลื่อนด้วย **Cloudflare Edge Ecosystem (Pages, Functions, D1, R2)**

🌐 **Live URL**: [https://worldofmys.pages.dev/](https://worldofmys.pages.dev/)

---

## ✨ ไฮไลต์ฟีเจอร์ระดับโลก (Key Global Features)

1. **🌍 ลูกโลกอินเทอร์แอกทีฟแบบ Globe Projection**
   - สำรวจเรื่องเล่าและตำนานพื้นบ้านข้ามทวีป: เอเชีย, ยุโรป, อเมริกา, แอฟริกา และโอเชียเนีย
   - ใช้ **MapLibre GL** แบบ **globe projection** เพื่อสร้างประสบการณ์โลกทรงกลมที่หมุน สำรวจ และบินกล้องข้ามทวีปได้ลื่นไหล
   - แสดงภาพพื้นผิวโลกด้วย satellite raster tiles พร้อมหมุดเรืองแสงสไตล์ Radio Garden กระจายตามพิกัดภูมิภาคทั่วโลก
   - รองรับแอนิเมชันบินกล้องไปยังหมุดที่เลือก (Fly-to) พร้อม tooltip แสดงชื่อเรื่องและภูมิภาค

2. **🔒 ล็อคระยะซูมระดับจังหวัด/มณฑล (Global PDPA & Privacy Protection)**
   - ป้องกันการเจาะดูระดับบ้านพักอาศัยหรือเลขที่อยู่จริงในทุกประเทศทั่วโลก ด้วยการกำหนดข้อจำกัดการซูมของแผนที่ให้เน้นการสำรวจในระดับจังหวัด/มณฑล (Province / State / County level) มากกว่าพิกัดบ้านเรือนรายจุด

3. **📻 Radio Garden Atmospheric Sound Engine (Web Audio API)**
   - สังเคราะห์เสียงคลื่นวิทยุความถี่สั้น (Radio Shortwave Tuning Sweep / Heterodyne Whistle) ขณะหมุนลูกโลกหรือจูนหาสัญญาณเรื่องเล่าข้ามประเทศ
   - เสียง Ambient ลึกลับคลอเบาๆ ในพื้นหลัง (เปิด/ปิดเสียงได้)
   - พรีเซ็ตคลื่นเสียงวิญญาณตามประเภทเรื่องเล่า (เสียงลมหนาวหวีดหวิว, ระฆังวิหารโบราณ, สัตว์ประหลาดในสายน้ำ, อาถรรพ์ป่าดงดิบ ฯลฯ)

4. **🇹🇭 🇬🇧 ระบบ 2 ภาษาสำหรับสากล (Global Bilingual Support)**
   - สลับภาษาไทยและอังกฤษได้ทันที ทั้งเนื้อหา ชื่อเรื่อง ประวัติศาสตร์ท้องถิ่น และส่วนต่อประสานผู้ใช้ (UI)
   - ใช้ Native Font Stack ที่คมชัด โหลดไว ไม่มีอาการกระตุกหรือดีเลย์

5. **🛡️ ระบบแอดมินหลังบ้าน (Global Admin Backoffice Portal)**
   - ล็อกอินด้วยระบบ Admin Authentication
   - Dashboard สถิติยอดการเข้าชมและจำนวนเรื่องเล่ารอบโลก
   - ฟอร์มเพิ่ม/แก้ไขหมุด พร้อมระบบสุ่มพิกัดปลอดภัย (Jitter Coordinates) และพรีเซ็ตเมือง/จังหวัดสำคัญทั่วโลก
   - รองรับการเชื่อมต่อกับ **Cloudflare R2** สำหรับอัปโหลดรูปภาพและไฟล์เสียง

---

## 🗺️ ตัวอย่างตำนานและเรื่องเล่ารอบโลกในระบบ (Sample Global Legends)

| ประเทศ / ภูมิภาค | ชื่อตำนาน / เรื่องเล่า | ประเภท | หมุดพิกัด |
| :--- | :--- | :--- | :--- |
| **🇯🇵 ญี่ปุ่น (Tokyo)** | คุชิซาเกะ-อนนะ (Slit-Mouthed Woman) | วิญญาณและผีพราย | 35.6762° N, 139.6503° E |
| **🏴󠁧󠁢󠁳󠁣󠁴󠁿 สกอตแลนด์ (Loch Ness)** | สัตว์ประหลาดล็อกเนสส์ (Loch Ness Monster - Nessie) | สัตว์ในตำนาน | 57.3229° N, 4.4244° W |
| **🇷🇴 โรมาเนีย (Transylvania)** | ปราสาทแดร็กคูลา (Count Dracula / Vlad the Impaler) | คำสาปและอาถรรพ์ | 45.5152° N, 25.3672° E |
| **🇺🇸 สหรัฐอเมริกา (Minnesota)** | เวนดิโก อสูรป่าหิมะ (The Wendigo) | อมนุษย์และสัตว์ร้าย | 46.7296° N, 94.6859° W |
| **🇲🇽 เม็กซิโก (Jalisco)** | เอล ชูปาคาบรา (El Chupacabra) | สัตว์ในตำนาน | 20.6597° N, 103.3496° W |
| **🇪🇬 อียิปต์ (Luxor)** | คำสาปฟาโรห์ตุตันคาเมน (Curse of Tutankhamun) | คุณไสยและคำสาป | 25.7402° N, 32.6014° E |
| **🇦🇺 ออสเตรเลีย (Victoria)** | บันยิป อสูรแห่งบึงน้ำ (The Bunyip) | สัตว์ในตำนาน | 36.5000° S, 145.0000° E |
| **🇹🇭 ไทย (Bangkok)** | แม่นาคพระโขนง (Mae Nak Phra Khanong) | วิญญาณและผีพราย | 13.7088° N, 100.6015° E |
| **🇹🇭 ไทย (Nong Khai)** | พญานาคแม่น้ำโขง (Naga of the Mekong) | สิ่งศักดิ์สิทธิ์ | 18.0163° N, 103.0786° E |
| **🇹🇭 ไทย (Prachinburi)** | ผีกระสือยายสาย (The Krasue) | คุณไสยและคำสาป | 13.9854° N, 101.7164° E |

---

## 🛠️ สถาปัตยกรรมระบบ (Tech Stack)

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **Interactive Globe / Map Engine**: MapLibre GL (Globe Projection, Raster Tiles, Navigation Control, Fly-to)
- **Audio Engine**: Web Audio API (Procedural Shortwave Radio Synthesizer)
- **Backend API**: Hono Framework บน Cloudflare Pages Functions (`/api/*`)
- **Database**: Cloudflare D1 (Serverless SQLite) พร้อม Seed Data ตำนานรอบโลก
- **Object Storage**: Cloudflare R2 (จัดเก็บรูปภาพและไฟล์เสียง)

---

## 🚀 การติดตั้งและรันในเครื่อง (Local Development)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มต้นรัน Dev Server (Vite)
npm run dev

# 3. หรือรันแบบ Full-stack ด้วย Cloudflare Wrangler (Pages + Functions + D1)
npx wrangler pages dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

---

## ☁️ การ Deploy ไปยัง Cloudflare Pages & D1

```bash
# 1. สร้าง Cloudflare D1 Database
npx wrangler d1 create worldofmys-db

# 2. ติดตั้ง Schema และ Seed Data รอบโลก
npx wrangler d1 execute worldofmys-db --remote --file=./schema.sql

# 3. สร้าง Cloudflare R2 Bucket สำหรับรูปภาพและเสียง
npx wrangler r2 bucket create worldofmys-media

# 4. Build และ Deploy ไปยัง Cloudflare Pages
npm run build
npx wrangler pages deploy dist --project-name worldofmys
```

---

## 👤 บัญชีแอดมินเริ่มต้นสำหรับการทดสอบ

- **Username**: `admin`
- **Password**: `password123`

---

## 📜 ใบอนุญาต (License)

MIT License - พัฒนาขึ้นสำหรับชุมชนเพื่อการศึกษาและอนุรักษ์มรดกตำนานเรื่องเล่าพื้นบ้านทั่วโลก

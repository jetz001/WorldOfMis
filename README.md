# 🌍 World of Mystery (WorldOfMis) - Thai Folklore 3D Globe

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages%20%26%20Workers-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-black?logo=three.js)](https://threejs.org/)
[![React](https://img.shields.io/badge/React%2019-Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![D1 & R2](https://img.shields.io/badge/Cloudflare-D1%20%26%20R2-orange)](https://developers.cloudflare.com/)

แพลตฟอร์มเว็บแอปพลิเคชัน 3D Interactive Earth สำหรับสำรวจตำนานผี ประวัติศาสตร์ท้องถิ่น และเรื่องเล่าลี้ลับทั่วประเทศไทย สไตล์ **Radio Garden** ผสานกับความล้ำสมัยของ **Three.js** ขับเคลื่อนด้วย **Cloudflare Edge Ecosystem (Pages, Functions, D1, R2)**

---

## ✨ ไฮไลต์ฟีเจอร์ (Key Features)

1. **ลูกโลก 3D Three.js Interactive Earth**
   - Atmosphere Glow shader, เมฆหมุนช้าๆ, แสงกลางคืน และพื้นผิวโลกคมชัด
   - หมุดเรืองแสง (Glowing Instanced Pins) สไตล์ Radio Garden ที่กระจายตามพิกัดของเรื่องเล่าในแต่ละจังหวัด
   - แอนิเมชันบินกล้อง (Fly-to Slerp) เมื่อคลิกที่หมุด พร้อมเรดาร์ Tooltip ชี้พิกัด

2. **🔒 ล็อคระยะซูมระดับจังหวัด (PDPA Privacy Protection)**
   - ป้องกันการส่องระดับบ้านพักอาศัยหรือเลขที่อยู่จริง โดยระบบจำกัด `controls.minDistance` ให้อยู่ในระดับขอบเขตจังหวัดเท่านั้น ปลอดภัยตามกฎหมาย PDPA 100%

3. **📻 Radio Garden Atmospheric Sound Engine (Web Audio API)**
   - จำลองเสียงคลื่นวิทยุสั้น (Radio Tuning Sweep / Heterodyne Whistle) ขณะหมุนลูกโลกหรือจูนหาหมุด
   - เสียง Ambient ลึกลับคลอเบาๆ ในพื้นหลัง (เปิด/ปิดเสียงได้)
   - พรีเซ็ตคลื่นเสียงวิญญาณประจำเรื่องเล่า (เสียงลมหวีดหวิว, ระฆังโบราณ, น้ำพราย, อาถรรพ์ป่าดงดิบ ฯลฯ)

4. **🇹🇭 🇬🇧 ระบบ 2 ภาษา (Bilingual Support)**
   - สลับภาษาไทยและอังกฤษได้ทันที ทั้งเนื้อหา ชื่อเรื่อง และส่วนต่อประสานผู้ใช้ (UI)
   - ใช้ Native Font Stack ที่คมชัดและโหลดทันที ไม่มีดีเลย์

5. **🛡️ ระบบแอดมินหลังบ้าน (Admin Backoffice Portal)**
   - ล็อกอินด้วยระบบ Admin Authentication
   - Dashboard สถิติยอดการเข้าชมและจำนวนเรื่องเล่า
   - ฟอร์มเพิ่ม/แก้ไขหมุด พร้อมระบบสุ่มพิกัดปลอดภัย (Jitter Coordinates) และพรีเซ็ต 77 จังหวัด
   - รองรับการเชื่อมต่อกับ **Cloudflare R2** สำหรับอัปโหลดรูปภาพและไฟล์เสียง

---

## 🛠️ สถาปัตยกรรมระบบ (Tech Stack)

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons
- **3D Engine**: Three.js (WebGL Standard Shaders + OrbitControls)
- **Audio Engine**: Web Audio API (Procedural Shortwave Radio Synthesizer)
- **Backend API**: Hono Framework บน Cloudflare Pages Functions (`/api/*`)
- **Database**: Cloudflare D1 (Serverless SQLite) พร้อม Seed Data 10 ตำนานผีไทย
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

# 2. ติดตั้ง Schema และ Seed Data
npx wrangler d1 execute worldofmys-db --file=./schema.sql

# 3. สร้าง Cloudflare R2 Bucket สำหรับรูปภาพและเสียง
npx wrangler r2 bucket create worldofmys-media

# 4. Build และ Deploy ไปยัง Cloudflare Pages
npm run build
npx wrangler pages deploy dist
```

---

## 👤 บัญชีแอดมินเริ่มต้นสำหรับการทดสอบ

- **Username**: `admin`
- **Password**: `password123`

---

## 📜 ใบอนุญาต (License)

MIT License - พัฒนาขึ้นสำหรับชุมชนเพื่อการศึกษาและอนุรักษ์ตำนานเรื่องเล่าท้องถิ่นไทย

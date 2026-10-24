# Zoom-out Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เพิ่มปุ่มสำหรับพากล้องถอยออกไปมุมมองภาพรวมโลกอัตโนมัติ เพื่อลดการพึ่งพาเมาส์กลางและการสกอลล์

**Architecture:** `App` เป็นเจ้าของตัวนับ `worldViewSignal` แล้วส่งลง `GhostGlobe` ผ่าน props เมื่อผู้ใช้กดปุ่มบน `Navbar` ตัวนับจะเพิ่มขึ้นหนึ่ง ทำให้ `useEffect` ใน `GhostGlobe` เรียก `map.flyTo()` ถอยกลับไปมุมมองโลกแบบนุ่มนวล โดยไม่แตะ `selectedPin` หรือสถานะอื่นของแอป

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, MapLibre GL, lucide-react

**หมายเหตุเรื่องการทดสอบ:** โปรเจคนี้ยังไม่มี test framework (ไม่มี vitest/jest และไม่มีสคริปต์ `test` ใน `package.json`) แผนนี้จึงใช้ `npm run lint`, `npm run build` และการตรวจด้วยตาในเบราว์เซอร์เป็นหลัก การติดตั้ง test framework อยู่นอกขอบเขตของงานนี้

---

## ไฟล์ที่เกี่ยวข้อง

| ไฟล์ | สถานะ | หน้าที่ |
| :--- | :--- | :--- |
| [src/lib/i18n.ts](file:///d:/DEV/Worldofmys/src/lib/i18n.ts) | แก้ไข | เพิ่มคีย์คำแปลสำหรับข้อความบนปุ่ม |
| [src/components/Globe/GhostGlobe.tsx](file:///d:/DEV/Worldofmys/src/components/Globe/GhostGlobe.tsx) | แก้ไข | รับสัญญาณและพากล้องกลับมุมมองโลก |
| [src/components/UI/Navbar.tsx](file:///d:/DEV/Worldofmys/src/components/UI/Navbar.tsx) | แก้ไข | แสดงปุ่มและส่งเหตุการณ์กดออกไป |
| [src/App.tsx](file:///d:/DEV/Worldofmys/src/App.tsx) | แก้ไข | ถือตัวนับและเชื่อมปุ่มเข้ากับแผนที่ |

หมายเหตุ: Task 2 แตะสามไฟล์พร้อมกันโดยตั้งใจ เพราะ TypeScript จะคอมไพล์ไม่ผ่านถ้าใส่ prop ให้คอมโพเนนต์เพียงบางตัว

---

## Task 1: เพิ่มคำแปลสำหรับข้อความบนปุ่ม

**Files:**
- Modify: `src/lib/i18n.ts` (บล็อก `th` ต่อจาก `unmute`)
- Modify: `src/lib/i18n.ts` (บล็อก `en` ต่อจาก `unmute`)

- [ ] **Step 1: เพิ่มคีย์ภาษาไทย**

ในบล็อก `th` ต่อจากบรรทัด `unmute: 'เปิดเสียงบรรยากาศ',` ให้เพิ่มบรรทัดนี้

```ts
    zoomOutWorld: 'ซูมออกไปดูโลก',
```

- [ ] **Step 2: เพิ่มคีย์ภาษาอังกฤษ**

ในบล็อก `en` ต่อจากบรรทัด `unmute: 'Enable Ambient Audio',` ให้เพิ่มบรรทัดนี้

```ts
    zoomOutWorld: 'Zoom out to world',
```

- [ ] **Step 3: ตรวจว่าโค้ดยังคอมไพล์ผ่าน**

Run: `npm run build`
Expected: จบด้วย exit code 0 และไม่มี error เรื่อง type ของ `translations`

- [ ] **Step 4: บันทึกงาน**

```bash
git add src/lib/i18n.ts
git commit -m "feat(i18n): add zoom-out button label"
```

---

## Task 2: เพิ่มปุ่มและพากล้องกลับมุมมองโลก

**Files:**
- Modify: `src/components/Globe/GhostGlobe.tsx`
- Modify: `src/components/UI/Navbar.tsx`
- Modify: `src/App.tsx`

### ส่วน GhostGlobe

- [ ] **Step 1: ประกาศค่ามุมมองโลกที่ระดับโมดูล**

ใน `src/components/Globe/GhostGlobe.tsx` ต่อจากบรรทัด `import { audioEngine } from '../../lib/audio';` ให้เพิ่มค่าคงที่นี้

```ts
// Shared world overview camera values, used both on init and when zooming out
const WORLD_VIEW_CENTER: [number, number] = [100.5, 13.75]; // Centered on Thailand / Asia
const WORLD_VIEW_ZOOM = 2.8;
```

- [ ] **Step 2: แก้ interface ของ props**

เปลี่ยน `GhostGlobeProps` จาก

```ts
interface GhostGlobeProps {
  pins: GhostPin[];
  selectedPin: GhostPin | null;
  onSelectPin: (pin: GhostPin) => void;
  language: SupportedLanguage;
}
```

เป็น

```ts
interface GhostGlobeProps {
  pins: GhostPin[];
  selectedPin: GhostPin | null;
  onSelectPin: (pin: GhostPin) => void;
  language: SupportedLanguage;
  worldViewSignal: number;
}
```

- [ ] **Step 3: รับ prop เข้ามาในคอมโพเนนต์**

ในรายการ destructuring ให้เพิ่ม `worldViewSignal` ต่อจาก `language` โดยผลลัพธ์จะเป็น

```tsx
export const GhostGlobe: React.FC<GhostGlobeProps> = ({
  pins,
  selectedPin,
  onSelectPin,
  language,
  worldViewSignal,
}) => {
```

- [ ] **Step 4: ใช้ค่าคงที่ร่วมตอนสร้างแผนที่**

ใน `useEffect` ที่สร้าง `new Map({...})` ให้เปลี่ยนสองบรรทัดนี้

```ts
      center: [100.5, 13.75], // Centered on Thailand / Asia
      zoom: 2.8,
```

เป็น

```ts
      center: WORLD_VIEW_CENTER,
      zoom: WORLD_VIEW_ZOOM,
```

- [ ] **Step 5: เพิ่มฟังก์ชันและตัวเฝ้าสัญญาณ**

ต่อจาก `useEffect` ที่สร้างแผนที่ (บล็อกที่ปิดท้ายด้วย `}, []);` และอยู่ก่อนคอมเมนต์ `// 2. Render Markers reliably whenever`) ให้เพิ่มโค้ดนี้

```tsx
  // Pull the camera back to the full-globe overview
  const flyToWorldView = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: WORLD_VIEW_CENTER,
      zoom: WORLD_VIEW_ZOOM,
      speed: 0.8,
      curve: 1.4,
      essential: true,
    });
  }, []);

  // Each button press increments the signal and pulls the camera back
  useEffect(() => {
    if (worldViewSignal > 0) {
      flyToWorldView();
    }
  }, [worldViewSignal, flyToWorldView]);
```

### ส่วน Navbar

- [ ] **Step 6: เพิ่มไอคอนที่ import**

เปลี่ยนบล็อก import จาก `lucide-react` จาก

```ts
import {
  Compass,
  Volume2,
  VolumeX,
  Languages,
  Search,
  Lock,
} from 'lucide-react';
```

เป็น

```ts
import {
  Compass,
  Volume2,
  VolumeX,
  Languages,
  Search,
  Lock,
  ZoomOut,
} from 'lucide-react';
```

- [ ] **Step 7: เพิ่ม prop ของปุ่ม**

ใน `NavbarProps` ให้เพิ่มบรรทัดนี้ต่อจาก `onOpenAdmin: () => void;`

```ts
  onZoomOut: () => void;
```

จากนั้นในรายการ destructuring ของคอมโพเนนต์ ให้เพิ่ม `onZoomOut,` ต่อจาก `onOpenAdmin,`

- [ ] **Step 8: วางปุ่มในกลุ่มปุ่มควบคุม**

ในบล็อก `{/* Action Controls */}` ให้แทรกปุ่มนี้ก่อนคอมเมนต์ `{/* Sound Toggle */}`

```tsx
          {/* Zoom-Out To World View */}
          <button
            onClick={onZoomOut}
            aria-label={t.zoomOutWorld}
            title={t.zoomOutWorld}
            className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 backdrop-blur-md text-slate-300 hover:text-emerald-300 transition-all shadow-lg flex items-center gap-1.5 text-xs font-medium"
          >
            <ZoomOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t.zoomOutWorld}</span>
          </button>
```

### ส่วน App

- [ ] **Step 9: เพิ่ม state ตัวนับ**

ใน `src/App.tsx` ต่อจากบรรทัด `const [isMuted, setIsMuted] = useState(false);` ให้เพิ่ม

```ts
  const [worldViewSignal, setWorldViewSignal] = useState(0);
```

- [ ] **Step 10: เพิ่ม callback**

ต่อจาก `handleToggleLanguage` ให้เพิ่ม

```ts
  const handleZoomOutToWorld = useCallback(() => {
    setWorldViewSignal((prev) => prev + 1);
  }, []);
```

- [ ] **Step 11: ส่ง callback ให้ Navbar**

ใน JSX ของ `<Navbar ... />` ให้เพิ่มบรรทัดนี้ต่อจาก `onOpenAdmin={() => setIsAdminOpen(true)}`

```tsx
        onZoomOut={handleZoomOutToWorld}
```

- [ ] **Step 12: ส่งสัญญาณให้ GhostGlobe**

ใน JSX ของ `<GhostGlobe ... />` ให้เพิ่มบรรทัดนี้ต่อจาก `language={language}`

```tsx
          worldViewSignal={worldViewSignal}
```

### ตรวจสอบและบันทึกงาน

- [ ] **Step 13: ตรวจ lint**

Run: `npm run lint`
Expected: ไม่มี error และไม่มี warning ใหม่จากไฟล์ที่แก้

- [ ] **Step 14: ตรวจ build**

Run: `npm run build`
Expected: จบด้วย exit code 0 ไม่มี TypeScript error เรื่อง prop ที่ขาด

- [ ] **Step 15: ตรวจด้วยตาในเบราว์เซอร์**

Run: `npm run dev`
แล้วเปิด `http://localhost:5173` จากนั้นไล่ตรวจตามลำดับนี้

1. เปิดหน้าครั้งแรก ยังไม่กดอะไร ต้องไม่มี error ใน console
2. คลิกหมุดสีเขียว กล้องบินเข้าไปใกล้จุดนั้นตามปกติ
3. กดปุ่ม `ซูมออกไปดูโลก` กล้องต้องค่อย ๆ ถอยออกไปเห็นภาพรวมโลก
4. กดปุ่มเดิมซ้ำอีกสองครั้งติดกัน แอปต้องไม่ค้างและไม่ error
5. หลังซูมออกแล้ว คลิกหมุดอื่น ต้องยังบินเข้าไปได้เหมือนเดิม
6. การ์ดเสียงมุมล่างซ้ายและ drawer เรื่องเล่าต้องยังทำงานปกติ
7. ย่อหน้าต่างให้แคบระดับมือถือ แล้วตรวจว่าปุ่มใหม่ไม่ทับปุ่มเสียง ปุ่มภาษา และปุ่มแอดมิน

- [ ] **Step 16: บันทึกงาน**

```bash
git add src/components/Globe/GhostGlobe.tsx src/components/UI/Navbar.tsx src/App.tsx
git commit -m "feat(globe): add zoom-out to world view button"
```

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Sparkles,
  Plus,
  Trash2,
  MapPin,
  BookOpen,
  Film,
  Shuffle,
  Globe2,
} from 'lucide-react';
import type {
  GhostPin,
  GhostCategory,
  SoundPreset,
  SupportedLanguage,
  MediaItem,
} from '../../types/ghost';
import { getTranslation } from '../../lib/i18n';
import { applyPrivacyJitter } from '../../lib/coordinates';

interface PinFormModalProps {
  pin: Partial<GhostPin> | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (pinData: GhostPin) => void;
  language: SupportedLanguage;
}

// Global and Regional Presets for quick accurate pin placement
const PROVINCE_PRESETS = [
  // Europe & UK
  { nameTh: 'ไฮแลนด์ (สกอตแลนด์, สหราชอาณาจักร)', nameEn: 'Highlands (Scotland, UK)', lat: 57.3229, lng: -4.4244 },
  { nameTh: 'บราชอฟ / ทรานซิลเวเนีย (โรมาเนีย)', nameEn: 'Brasov, Transylvania (Romania)', lat: 45.5152, lng: 25.3672 },
  { nameTh: 'ไรน์ลันด์ (เยอรมนี)', nameEn: 'Rhineland (Germany)', lat: 50.1392, lng: 7.7286 },
  { nameTh: 'ซัฟฟอล์ก (อังกฤษ)', nameEn: 'Suffolk (England, UK)', lat: 52.1793, lng: 1.5622 },
  { nameTh: 'กงต็อง (ฝรั่งเศส - เฌโวด็อง)', nameEn: 'Gevaudan, Lozere (France)', lat: 44.5167, lng: 3.5000 },
  { nameTh: 'กรากุฟ (โปแลนด์)', nameEn: 'Krakow (Poland)', lat: 50.0540, lng: 19.9354 },
  { nameTh: 'กาลิเซีย (สเปน)', nameEn: 'Galicia (Spain)', lat: 42.8782, lng: -8.5448 },
  { nameTh: 'ปารีส (ฝรั่งเศส - สุสานใต้ดิน)', nameEn: 'Paris Catacombs (France)', lat: 48.8566, lng: 2.3522 },
  { nameTh: 'ลอนดอน (สหราชอาณาจักร)', nameEn: 'Tower of London (UK)', lat: 51.5081, lng: -0.0759 },
  { nameTh: 'ไอซ์แลนด์', nameEn: 'Iceland', lat: 64.9631, lng: -19.0208 },
  { nameTh: 'มอนเตเบลโล (อิตาลี)', nameEn: 'Montebello, Rimini (Italy)', lat: 43.9961, lng: 12.3582 },
  { nameTh: 'เฮดมาร์ก (นอร์เวย์)', nameEn: 'Hedmark (Norway)', lat: 60.8500, lng: 11.5000 },
  { nameTh: 'แวร์มลันด์ (สวีเดน)', nameEn: 'Varmland (Sweden)', lat: 59.8000, lng: 13.0000 },
  // Americas
  { nameTh: 'มินนิโซตา (สหรัฐอเมริกา)', nameEn: 'Minnesota (USA)', lat: 46.7296, lng: -94.6859 },
  { nameTh: 'วอชิงตัน (สหรัฐอเมริกา)', nameEn: 'Washington (USA)', lat: 47.7511, lng: -120.7401 },
  { nameTh: 'ฮาวาย (สหรัฐอเมริกา)', nameEn: 'Hawaii (USA)', lat: 21.3069, lng: -157.8583 },
  { nameTh: 'กาโนบานัส (เปอร์โตริโก)', nameEn: 'Canovanas (Puerto Rico)', lat: 18.3794, lng: -65.9014 },
  { nameTh: 'แอมะซอน (บราซิล)', nameEn: 'Amazonas (Brazil)', lat: -3.4653, lng: -62.2159 },
  { nameTh: 'ชิโลเอ (ชิลี)', nameEn: 'Chiloe Island (Chile)', lat: -42.6000, lng: -73.9000 },
  { nameTh: 'กุสโก (เปรู)', nameEn: 'Cusco, Andes (Peru)', lat: -13.5319, lng: -71.9675 },
  { nameTh: 'อันดิโอเกีย (โคลอมเบีย)', nameEn: 'Antioquia (Colombia)', lat: 6.2476, lng: -75.5658 },
  // East Asia & Pacific
  { nameTh: 'โตเกียว (ญี่ปุ่น)', nameEn: 'Tokyo (Japan)', lat: 35.6762, lng: 139.6503 },
  { nameTh: 'โซล (เกาหลีใต้)', nameEn: 'Seoul (South Korea)', lat: 37.5665, lng: 126.9780 },
  { nameTh: 'หูหนาน (จีน)', nameEn: 'Hunan (China)', lat: 28.1124, lng: 112.9838 },
  { nameTh: 'นิวไทเป (ไต้หวัน)', nameEn: 'New Taipei (Taiwan)', lat: 25.0169, lng: 121.4628 },
  { nameTh: 'คาปิซ (ฟิลิปปินส์)', nameEn: 'Capiz (Philippines)', lat: 11.4500, lng: 122.7500 },
  { nameTh: 'จาการ์ตา (อินโดนีเซีย)', nameEn: 'Jakarta (Indonesia)', lat: -6.2088, lng: 106.8456 },
  { nameTh: 'ไวคาโต (นิวซีแลนด์)', nameEn: 'Waikato (New Zealand)', lat: -37.7870, lng: 175.2793 },
  { nameTh: 'วิกตอเรีย (ออสเตรเลีย)', nameEn: 'Victoria (Australia)', lat: -36.5000, lng: 145.0000 },
  // Middle East & Africa & South Asia
  { nameTh: 'ลักซอร์ (อียิปต์)', nameEn: 'Luxor (Egypt)', lat: 25.7402, lng: 32.6014 },
  { nameTh: 'กุมภ์ (เนปาล - หิมาลัย)', nameEn: 'Khumbu, Himalayas (Nepal)', lat: 27.9500, lng: 86.7200 },
  { nameTh: 'มัณฑะเลย์ (พม่า - ภูเขาโปปา)', nameEn: 'Mandalay, Mount Popa (Myanmar)', lat: 20.9167, lng: 95.2500 },
  { nameTh: 'เสียมราฐ (กัมพูชา)', nameEn: 'Siem Reap (Cambodia)', lat: 13.3671, lng: 103.8448 },
  { nameTh: 'ด่งนาย (เวียดนาม)', nameEn: 'Dong Nai (Vietnam)', lat: 10.9574, lng: 106.8427 },
  { nameTh: 'โคลอมโบ (ศรีลังกา)', nameEn: 'Colombo (Sri Lanka)', lat: 6.9271, lng: 79.8612 },
  { nameTh: 'ทะเลทรายโกบี (มองโกเลีย)', nameEn: 'Gobi Desert (Mongolia)', lat: 43.0000, lng: 104.0000 },
  { nameTh: 'ฮาซันเกย์ฟ (ตุรกี)', nameEn: 'Hasankeyf (Turkey)', lat: 37.7139, lng: 41.4111 },
  { nameTh: 'บักดาด (อิรัก)', nameEn: 'Baghdad (Iraq)', lat: 33.3152, lng: 44.3661 },
  { nameTh: 'เบนินซิตี้ (ไนจีเรีย)', nameEn: 'Benin City (Nigeria)', lat: 6.3350, lng: 5.6037 },
  { nameTh: 'อีสเทิร์นเคป (แอฟริกาใต้)', nameEn: 'Eastern Cape (South Africa)', lat: -32.2968, lng: 26.4194 },
  { nameTh: 'อักกรา (กานา)', nameEn: 'Accra (Ghana)', lat: 5.6037, lng: -0.1870 },
  // Thailand
  { nameTh: 'กรุงเทพมหานคร (ไทย)', nameEn: 'Bangkok (Thailand)', lat: 13.7563, lng: 100.5018 },
  { nameTh: 'เชียงใหม่ (ไทย)', nameEn: 'Chiang Mai (Thailand)', lat: 18.7883, lng: 98.9853 },
  { nameTh: 'กาฬสินธุ์ (ไทย)', nameEn: 'Kalasin (Thailand)', lat: 16.4322, lng: 103.5065 },
  { nameTh: 'หนองคาย (ไทย)', nameEn: 'Nong Khai (Thailand)', lat: 17.8783, lng: 102.7420 },
  { nameTh: 'นครศรีธรรมราช (ไทย)', nameEn: 'Nakhon Si Thammarat (Thailand)', lat: 8.4304, lng: 99.9631 },
  { nameTh: 'ปราจีนบุรี (ไทย)', nameEn: 'Prachinburi (Thailand)', lat: 14.0509, lng: 101.3716 },
  { nameTh: 'กาญจนบุรี (ไทย)', nameEn: 'Kanchanaburi (Thailand)', lat: 14.0228, lng: 99.5328 },
];

const DEFAULT_PIN_DATA: Partial<GhostPin> = {
  title_th: '',
  title_en: '',
  category: 'ghost',
  province_th: 'กรุงเทพมหานคร (ไทย)',
  province_en: 'Bangkok (Thailand)',
  district_th: '',
  district_en: '',
  lat: 13.7563,
  lng: 100.5018,
  story_th: '',
  story_en: '',
  folklore_history_th: '',
  folklore_history_en: '',
  image_url: '',
  sound_preset: 'whisper',
  views_count: 0,
  is_published: 1,
  gallery_media: [],
};

export const PinFormModal: React.FC<PinFormModalProps> = ({
  pin,
  isOpen,
  onClose,
  onSave,
  language,
}) => {
  const t = getTranslation(language);

  // Sync state whenever pin changes
  const [formData, setFormData] = useState<Partial<GhostPin>>(() => pin || DEFAULT_PIN_DATA);

  useEffect(() => {
    if (pin) {
      setFormData({
        ...pin,
        gallery_media: pin.gallery_media || [],
      });
    } else {
      setFormData(DEFAULT_PIN_DATA);
    }
  }, [pin]);

  // Gallery item form state
  const [newMediaType, setNewMediaType] = useState<'image' | 'youtube'>('image');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  if (!isOpen) return null;

  // Handle Preset Selection
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    if (!selectedName) return;
    const selected = PROVINCE_PRESETS.find((p) => p.nameTh === selectedName);
    if (selected) {
      const jittered = applyPrivacyJitter(selected.lat, selected.lng);
      setFormData((prev) => ({
        ...prev,
        province_th: selected.nameTh,
        province_en: selected.nameEn,
        lat: Number(jittered.lat.toFixed(4)),
        lng: Number(jittered.lng.toFixed(4)),
      }));
    }
  };

  // Privacy Jitter
  const handleJitter = () => {
    if (formData.lat && formData.lng) {
      const jittered = applyPrivacyJitter(formData.lat, formData.lng);
      setFormData((prev) => ({
        ...prev,
        lat: Number(jittered.lat.toFixed(4)),
        lng: Number(jittered.lng.toFixed(4)),
      }));
    }
  };

  // Media addition
  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    const cleanUrl = newMediaUrl.trim();
    const isYt =
      cleanUrl.includes('youtube.com') ||
      cleanUrl.includes('youtu.be') ||
      newMediaType === 'youtube';

    const item: MediaItem = {
      type: isYt ? 'youtube' : 'image',
      url: cleanUrl,
      title: newMediaTitle.trim() || undefined,
      thumbnail: isYt ? formData.image_url : undefined,
    };

    setFormData((prev) => ({
      ...prev,
      gallery_media: [...(prev.gallery_media || []), item],
    }));

    setNewMediaUrl('');
    setNewMediaTitle('');
  };

  const handleRemoveMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_media: (prev.gallery_media || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPin: GhostPin = {
      id: formData.id || `pin-${Date.now()}`,
      title_th: formData.title_th?.trim() || 'ตำนานไร้ชื่อ',
      title_en: formData.title_en?.trim() || 'Untitled Folklore',
      category: (formData.category as GhostCategory) || 'ghost',
      province_th: formData.province_th?.trim() || 'กรุงเทพมหานคร (ไทย)',
      province_en: formData.province_en?.trim() || 'Bangkok (Thailand)',
      district_th: formData.district_th?.trim() || '',
      district_en: formData.district_en?.trim() || '',
      lat: Number(formData.lat) || 13.7563,
      lng: Number(formData.lng) || 100.5018,
      story_th: formData.story_th || '',
      story_en: formData.story_en || '',
      folklore_history_th: formData.folklore_history_th || '',
      folklore_history_en: formData.folklore_history_en || '',
      image_url: formData.image_url?.trim() || '',
      audio_url: formData.audio_url?.trim() || '',
      gallery_media: formData.gallery_media || [],
      sound_preset: (formData.sound_preset as SoundPreset) || 'whisper',
      views_count: Number(formData.views_count) || 0,
      is_published: formData.is_published ?? 1,
    };

    onSave(finalPin);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#070c15] text-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-150">
      {/* Sticky Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0c1424] shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{formData.id ? 'แก้ไขข้อมูลหมุดเรื่องเล่า' : 'เพิ่มหมุดเรื่องเล่าใหม่'}</span>
              {formData.id && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-amber-500/30">
                  {formData.id}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {formData.id ? 'ปรับปรุงรายละเอียด ตำแหน่ง พิกัด และวิดีโอ/ภาพสื่อ' : 'สร้างและปักหมุดเรื่องเล่าใหม่ลงในคลัง D1'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="ปิด"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Content (Scrollable) */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Section 1: Titles & Category */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>1. ข้อมูลหลักและหมวดหมู่ (Basic Information)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ชื่อเรื่อง (ภาษาไทย) <span className="text-rose-400">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.title_th || ''}
                onChange={(e) => setFormData({ ...formData, title_th: e.target.value })}
                placeholder="เช่น ลอเรไล ไซเรนสาวแห่งแม่น้ำไรน์"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Title (English) <span className="text-rose-400">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.title_en || ''}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="e.g. The Lorelei of the Rhine"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                หมวดหมู่เรื่องเล่า (Category)
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as GhostCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="ghost">วิญญาณและผีพราย (Ghost)</option>
                <option value="curse">คุณไสยและคำสาป (Curse)</option>
                <option value="legend">ตำนานลึกลับ (Legend)</option>
                <option value="sacred">สิ่งศักดิ์สิทธิ์และทวยเทพ (Sacred)</option>
                <option value="monster">อมนุษย์และสัตว์ในตำนาน (Monster)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                คลื่นเสียงบรรยากาศ (Sound Preset)
              </label>
              <select
                value={formData.sound_preset}
                onChange={(e) => setFormData({ ...formData, sound_preset: e.target.value as SoundPreset })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="whisper">เสียงลมกระซิบ (Whisper)</option>
                <option value="water_spirit">เสียงพรายน้ำ (Water Spirit)</option>
                <option value="jungle_curse">เสียงป่าดงดิบอาถรรพ์ (Jungle Curse)</option>
                <option value="temple_bell">เสียงระฆังโบราณ (Temple Bell)</option>
                <option value="creepy_wind">เสียงลมหวีดหวิว (Howling Wind)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Location & Coordinates */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>2. พิกัดและตำแหน่งบนลูกโลก (Location & Coordinates)</span>
            </div>
            <button
              type="button"
              onClick={handleJitter}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle className="w-3 h-3" />
              <span>สุ่มขยับพิกัดเล็กน้อย (Privacy Jitter)</span>
            </button>
          </div>

          {/* Quick Preset Selector */}
          <div>
            <label className="block text-xs font-medium text-amber-300 mb-1">
              ✨ เลือกจากพิกัดแนะนำทั่วโลก (Quick Preset) เพื่อเติมพิกัดอัตโนมัติ:
            </label>
            <select
              defaultValue=""
              onChange={handlePresetChange}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
            >
              <option value="">-- แตะเพื่อเลือกพิกัดแนะนำ (Quick Fill Preset) --</option>
              {PROVINCE_PRESETS.map((p) => (
                <option key={p.nameTh} value={p.nameTh}>
                  {p.nameTh} | {p.nameEn} (Lat: {p.lat}, Lng: {p.lng})
                </option>
              ))}
            </select>
          </div>

          {/* Province & Country (Bilingual Editable) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                จังหวัด / ประเทศ / ภูมิภาค (ภาษาไทย) <span className="text-rose-400">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.province_th || ''}
                onChange={(e) => setFormData({ ...formData, province_th: e.target.value })}
                placeholder="เช่น ไฮแลนด์ (สกอตแลนด์)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Province / Country / Region (English) <span className="text-rose-400">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.province_en || ''}
                onChange={(e) => setFormData({ ...formData, province_en: e.target.value })}
                placeholder="e.g. Highlands (Scotland, UK)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* District / Area (Bilingual) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                อำเภอ / เขต / ตำบล (ภาษาไทย - ไม่ระบุบ้านเลขที่)
              </label>
              <input
                type="text"
                value={formData.district_th || ''}
                onChange={(e) => setFormData({ ...formData, district_th: e.target.value })}
                placeholder="เช่น อินเวอร์เนสส์"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                District / City / Area (English)
              </label>
              <input
                type="text"
                value={formData.district_en || ''}
                onChange={(e) => setFormData({ ...formData, district_en: e.target.value })}
                placeholder="e.g. Inverness"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Lat / Lng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">ละติจูด (Latitude) *</label>
              <input
                required
                type="number"
                step="any"
                value={formData.lat ?? ''}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">ลองจิจูด (Longitude) *</label>
              <input
                required
                type="number"
                step="any"
                value={formData.lng ?? ''}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Bilingual Story Narrative */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>3. เนื้อหาเรื่องเล่าสองภาษา (Bilingual Narrative)</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              เนื้อหาเรื่องเล่า (ภาษาไทย)
            </label>
            <textarea
              rows={3}
              value={formData.story_th || ''}
              onChange={(e) => setFormData({ ...formData, story_th: e.target.value })}
              placeholder="เล่าตำนาน ความน่าสะพรึงกลัว หรือเหตุการณ์ลี้ลับ..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Story Content (English)
            </label>
            <textarea
              rows={3}
              value={formData.story_en || ''}
              onChange={(e) => setFormData({ ...formData, story_en: e.target.value })}
              placeholder="English narrative of the urban legend or folklore..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 4: Folklore History & Cultural Context */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Globe2 className="w-4 h-4" />
            <span>4. ประวัติศาสตร์ท้องถิ่นและบริบทความเชื่อ (Folklore History)</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ประวัติศาสตร์ท้องถิ่นและบริบทความเชื่อ (ภาษาไทย)
            </label>
            <textarea
              rows={2}
              value={formData.folklore_history_th || ''}
              onChange={(e) => setFormData({ ...formData, folklore_history_th: e.target.value })}
              placeholder="ที่มาของความเชื่อ ข้อห้าม พิธีกรรม หรือบันทึกทางประวัติศาสตร์..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Historical Records & Cultural Context (English)
            </label>
            <textarea
              rows={2}
              value={formData.folklore_history_en || ''}
              onChange={(e) => setFormData({ ...formData, folklore_history_en: e.target.value })}
              placeholder="Historical documentation, origin stories, cultural taboos..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 5: Main Image & Media Gallery (with YouTube) */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Film className="w-4 h-4" />
            <span>5. ภาพหลักและแกลเลอรีสื่อมัลติมีเดีย (Main Visual & Media Gallery)</span>
          </div>

          {/* Main Cover Image */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ลิงก์รูปภาพปกหลัก (Main Entity Artwork URL)
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="เช่น /entities/pin-lochness.jpg หรือ https://..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              {formData.image_url && (
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shrink-0">
                  <img
                    src={formData.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              รองรับทั้งไฟล์ในโปรเจกต์ (`/entities/pin-xxx.jpg`) หรือ Cloudflare R2 / CDN URL
            </p>
          </div>

          {/* Media Items List */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                รายการสไลด์แกลเลอรี ({(formData.gallery_media || []).length} รายการ):
              </span>
            </div>

            {formData.gallery_media && formData.gallery_media.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {formData.gallery_media.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate min-w-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          item.type === 'youtube'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {item.type === 'youtube' ? 'YOUTUBE' : 'IMAGE'}
                      </span>
                      <span className="text-white font-medium truncate">
                        {item.title || item.url}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(idx)}
                      className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-950/50 cursor-pointer shrink-0"
                      title="ลบสื่อนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Media Item Form */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <span className="text-[11px] font-semibold text-amber-300">
                + เพิ่มสื่อภาพ หรือ วิดีโอสารคดี YouTube:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value as 'image' | 'youtube')}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="image">🖼️ รูปภาพ (Image)</option>
                  <option value="youtube">🎬 วิดีโอ (YouTube)</option>
                </select>
                <input
                  type="text"
                  value={newMediaTitle}
                  onChange={(e) => setNewMediaTitle(e.target.value)}
                  placeholder="ชื่อคำบรรยาย (เช่น สารคดีตำนาน Point of View)"
                  className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={newMediaUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewMediaUrl(val);
                    if (val.includes('youtube.com') || val.includes('youtu.be')) {
                      setNewMediaType('youtube');
                    }
                  }}
                  placeholder={
                    newMediaType === 'youtube'
                      ? 'https://www.youtube.com/watch?v=...'
                      : 'https://... หรือ /entities/photo.jpg'
                  }
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddMedia}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มลงแกลเลอรี</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Settings, Views & Status */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>6. การตั้งค่าระบบและการเผยแพร่ (System Settings)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                จำนวนการรับชม (Views Count)
              </label>
              <input
                type="number"
                min="0"
                value={formData.views_count ?? 0}
                onChange={(e) => setFormData({ ...formData, views_count: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                URL เสียงเฉพาะตัว (Custom Audio URL - ทางเลือก)
              </label>
              <input
                type="url"
                value={formData.audio_url || ''}
                onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                placeholder="https://.../sound.mp3"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-200 select-none">
              <input
                type="checkbox"
                checked={formData.is_published === 1}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-950 border-slate-700 cursor-pointer"
              />
              <span className="font-medium">เผยแพร่สู่สาธารณะบนแผนที่ (Published)</span>
            </label>
          </div>
        </div>

        {/* Sticky-like bottom gap */}
        <div className="h-4" />
      </form>

      {/* Sticky Footer */}
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-[#0c1424] shrink-0 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
        >
          {t.cancel}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{t.save}</span>
        </button>
      </div>
    </div>
  );
};

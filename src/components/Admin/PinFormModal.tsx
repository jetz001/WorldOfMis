import React, { useState } from 'react';
import { X, Save, Sparkles, Plus, Trash2 } from 'lucide-react';
import type { MediaItem } from '../../types/ghost';
import type { GhostPin, GhostCategory, SoundPreset, SupportedLanguage } from '../../types/ghost';
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
  // Global Landmarks
  { nameTh: 'โตเกียว (ญี่ปุ่น)', nameEn: 'Tokyo (Japan)', lat: 35.6762, lng: 139.6503 },
  { nameTh: 'ไฮแลนด์ (สกอตแลนด์, สหราชอาณาจักร)', nameEn: 'Highlands (Scotland, UK)', lat: 57.3229, lng: -4.4244 },
  { nameTh: 'บราชอฟ / ทรานซิลเวเนีย (โรมาเนีย)', nameEn: 'Brasov, Transylvania (Romania)', lat: 45.5152, lng: 25.3672 },
  { nameTh: 'มินนิโซตา (สหรัฐอเมริกา)', nameEn: 'Minnesota (USA)', lat: 46.7296, lng: -94.6859 },
  { nameTh: 'ฮาลิสโก (เม็กซิโก)', nameEn: 'Jalisco (Mexico)', lat: 20.6597, lng: -103.3496 },
  { nameTh: 'ลักซอร์ (อียิปต์)', nameEn: 'Luxor (Egypt)', lat: 25.7402, lng: 32.6014 },
  { nameTh: 'วิกตอเรีย (ออสเตรเลีย)', nameEn: 'Victoria (Australia)', lat: -36.5000, lng: 145.0000 },
  { nameTh: 'ปารีส (ฝรั่งเศส - สุสานใต้ดิน)', nameEn: 'Paris Catacombs (France)', lat: 48.8566, lng: 2.3522 },
  { nameTh: 'ลอนดอน (สหราชอาณาจักร - หอคอยลอนดอน)', nameEn: 'Tower of London (UK)', lat: 51.5081, lng: -0.0759 },
  // Thailand & Southeast Asia
  { nameTh: 'กรุงเทพมหานคร (ไทย)', nameEn: 'Bangkok (Thailand)', lat: 13.7563, lng: 100.5018 },
  { nameTh: 'เชียงใหม่ (ไทย)', nameEn: 'Chiang Mai (Thailand)', lat: 18.7883, lng: 98.9853 },
  { nameTh: 'กาฬสินธุ์ (ไทย)', nameEn: 'Kalasin (Thailand)', lat: 16.4322, lng: 103.5065 },
  { nameTh: 'หนองคาย (ไทย)', nameEn: 'Nong Khai (Thailand)', lat: 17.8783, lng: 102.7420 },
  { nameTh: 'สุราษฎร์ธานี (ไทย)', nameEn: 'Surat Thani (Thailand)', lat: 9.1382, lng: 99.3217 },
  { nameTh: 'นครศรีธรรมราช (ไทย)', nameEn: 'Nakhon Si Thammarat (Thailand)', lat: 8.4304, lng: 99.9631 },
  { nameTh: 'กาญจนบุรี (ไทย)', nameEn: 'Kanchanaburi (Thailand)', lat: 14.0228, lng: 99.5328 },
  { nameTh: 'ปราจีนบุรี (ไทย)', nameEn: 'Prachinburi (Thailand)', lat: 14.0509, lng: 101.3716 },
];

export const PinFormModal: React.FC<PinFormModalProps> = ({
  pin,
  isOpen,
  onClose,
  onSave,
  language,
}) => {
  const t = getTranslation(language);

  const [formData, setFormData] = useState<Partial<GhostPin>>(
    pin || {
      title_th: '',
      title_en: '',
      category: 'ghost',
      province_th: 'กรุงเทพมหานคร',
      province_en: 'Bangkok',
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
      is_published: 1,
      views_count: 0,
    }
  );

  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'youtube'>('image');
  const [newMediaTitle, setNewMediaTitle] = useState('');


  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    const isYt =
      newMediaUrl.includes('youtube.com') ||
      newMediaUrl.includes('youtu.be') ||
      newMediaType === 'youtube';
    const item: MediaItem = {
      type: isYt ? 'youtube' : 'image',
      url: newMediaUrl.trim(),
      title: newMediaTitle.trim() || undefined,
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

  if (!isOpen) return null;

  const handleProvinceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = PROVINCE_PRESETS.find((p) => p.nameTh === e.target.value);
    if (selected) {
      // Apply privacy jitter to make sure coordinates don't point to an exact home
      const jittered = applyPrivacyJitter(selected.lat, selected.lng);
      setFormData((prev) => ({
        ...prev,
        province_th: selected.nameTh,
        province_en: selected.nameEn,
        lat: jittered.lat,
        lng: jittered.lng,
      }));
    }
  };

  const handleJitter = () => {
    if (formData.lat && formData.lng) {
      const jittered = applyPrivacyJitter(formData.lat, formData.lng);
      setFormData((prev) => ({
        ...prev,
        lat: jittered.lat,
        lng: jittered.lng,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPin: GhostPin = {
      id: formData.id || `pin-${Date.now()}`,
      title_th: formData.title_th || 'ตำนานไร้ชื่อ',
      title_en: formData.title_en || 'Untitled Folklore',
      category: (formData.category as GhostCategory) || 'ghost',
      province_th: formData.province_th || 'กรุงเทพมหานคร',
      province_en: formData.province_en || 'Bangkok',
      district_th: formData.district_th || '',
      district_en: formData.district_en || '',
      lat: Number(formData.lat) || 13.7563,
      lng: Number(formData.lng) || 100.5018,
      story_th: formData.story_th || '',
      story_en: formData.story_en || '',
      folklore_history_th: formData.folklore_history_th || '',
      folklore_history_en: formData.folklore_history_en || '',
      image_url: formData.image_url || '',
      gallery_media: formData.gallery_media || [],
      sound_preset: (formData.sound_preset as SoundPreset) || 'whisper',
      views_count: formData.views_count || 0,
      is_published: formData.is_published ?? 1,
    };
    onSave(finalPin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              {formData.id ? t.editPin : t.addPin}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ชื่อเรื่อง (ภาษาไทย) *
              </label>
              <input
                required
                type="text"
                value={formData.title_th || ''}
                onChange={(e) => setFormData({ ...formData, title_th: e.target.value })}
                placeholder="เช่น แม่นาคพระโขนง"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Title (English) *
              </label>
              <input
                required
                type="text"
                value={formData.title_en || ''}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="e.g. Mae Nak Phra Khanong"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category & Sound Preset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                หมวดหมู่
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as GhostCategory })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ghost">วิญญาณและผีพราย (Ghost)</option>
                <option value="curse">คุณไสยและคำสาป (Curse)</option>
                <option value="legend">ตำนานลึกลับ (Legend)</option>
                <option value="sacred">สิ่งศักดิ์สิทธิ์ (Sacred)</option>
                <option value="monster">อมนุษย์และเสือสมิง (Monster)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.soundPreset}
              </label>
              <select
                value={formData.sound_preset}
                onChange={(e) => setFormData({ ...formData, sound_preset: e.target.value as SoundPreset })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="whisper">เสียงลมกระซิบ (Whisper)</option>
                <option value="water_spirit">เสียงพรายน้ำ (Water Spirit)</option>
                <option value="jungle_curse">เสียงป่าดงดิบอาถรรพ์ (Jungle Curse)</option>
                <option value="temple_bell">เสียงระฆังโบราณ (Temple Bell)</option>
                <option value="creepy_wind">เสียงลมหวีดหวิว (Howling Wind)</option>
              </select>
            </div>
          </div>

          {/* Province & District Preset */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400">
                📍 พิกัดและตำแหน่งบนลูกโลก (Global Coordinates)
              </span>
              <button
                type="button"
                onClick={handleJitter}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
              >
                สุ่มขยับพิกัดเล็กน้อย (Coordinate Jitter)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  เลือกจังหวัด
                </label>
                <select
                  value={formData.province_th}
                  onChange={handleProvinceSelect}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                >
                  {PROVINCE_PRESETS.map((p) => (
                    <option key={p.nameTh} value={p.nameTh}>
                      {p.nameTh} ({p.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  อำเภอ / ตำบล (ไม่ระบุบ้านเลขที่)
                </label>
                <input
                  type="text"
                  value={formData.district_th || ''}
                  onChange={(e) => setFormData({ ...formData, district_th: e.target.value })}
                  placeholder="เช่น พระโขนง"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Stories Bilingual */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              เนื้อหาเรื่องเล่า (ภาษาไทย)
            </label>
            <textarea
              rows={3}
              value={formData.story_th || ''}
              onChange={(e) => setFormData({ ...formData, story_th: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Folklore History */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ประวัติศาสตร์ท้องถิ่นและบริบทความเชื่อ (ภาษาไทย)
            </label>
            <textarea
              rows={2}
              value={formData.folklore_history_th || ''}
              onChange={(e) => setFormData({ ...formData, folklore_history_th: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Media / R2 Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.imageUploadHelp}
            </label>
            <input
              type="url"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://pub-r2.yourdomain.com/ghost-image.jpg"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
            />
          </div>


          {/* Media Gallery / Slides / YouTube Videos */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                {language === 'th' ? 'แกลเลอรีสื่อมัลติมีเดีย (ภาพสไลด์ & วิดีโอ YouTube)' : 'Media Gallery (Image Slides & YouTube Videos)'}
              </label>
              <span className="text-[10px] text-slate-400">
                {(formData.gallery_media || []).length} {language === 'th' ? 'รายการ' : 'items'}
              </span>
            </div>

            {/* Existing Media List */}
            {formData.gallery_media && formData.gallery_media.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {formData.gallery_media.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${item.type === 'youtube' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'}`}>
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
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Media Item Form */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value as 'image' | 'youtube')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="image">รูปภาพ (Image)</option>
                  <option value="youtube">วิดีโอ (YouTube)</option>
                </select>
                <input
                  type="text"
                  value={newMediaTitle}
                  onChange={(e) => setNewMediaTitle(e.target.value)}
                  placeholder="ชื่อคำบรรยาย (เช่น สารคดีตำนาน)"
                  className="col-span-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
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
                  placeholder={newMediaType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://... หรือ /entities/photo.jpg'}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddMedia}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'th' ? 'เพิ่มสื่อ' : 'Add'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
              <input
                type="checkbox"
                checked={formData.is_published === 1}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked ? 1 : 0 })}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-slate-950 border-slate-700"
              />
              <span>{t.published}</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{t.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

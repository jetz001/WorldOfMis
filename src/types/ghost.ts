export type GhostCategory = 'ghost' | 'legend' | 'curse' | 'sacred' | 'monster';

export type SoundPreset = 'whisper' | 'water_spirit' | 'jungle_curse' | 'temple_bell' | 'creepy_wind';

export interface GhostPin {
  id: string;
  title_th: string;
  title_en: string;
  category: GhostCategory;
  province_th: string;
  province_en: string;
  district_th?: string;
  district_en?: string;
  lat: number;
  lng: number;
  story_th: string;
  story_en: string;
  folklore_history_th: string;
  folklore_history_en: string;
  image_url?: string;
  audio_url?: string;
  sound_preset: SoundPreset;
  views_count: number;
  is_published: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
}

export type SupportedLanguage = 'th' | 'en';

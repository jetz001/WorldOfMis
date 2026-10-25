import type { SupportedLanguage } from '../types/ghost';

const memCache = new Map<string, string>();
const STORAGE_PREFIX = 'wom_i18n_v1_';

const GOOGLE_LANG_MAP: Record<SupportedLanguage, string> = {
  th: 'th',
  en: 'en',
  ja: 'ja',
  zh: 'zh-CN',
  ko: 'ko',
  es: 'es',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  id: 'id',
};

export async function translateText(text: string, targetLang: SupportedLanguage): Promise<string> {
  if (!text || targetLang === 'th' || targetLang === 'en') return text;
  const tl = GOOGLE_LANG_MAP[targetLang] || targetLang;
  const cacheKey = `${tl}:${text.slice(0, 120)}:${text.length}`;

  if (memCache.has(cacheKey)) {
    return memCache.get(cacheKey)!;
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_PREFIX + cacheKey);
    if (stored) {
      memCache.set(cacheKey, stored);
      return stored;
    }
  } catch {
    // ignore storage quota errors
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(
      tl
    )}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const json = await res.json();
    if (Array.isArray(json?.[0])) {
      const translated = json[0].map((segment: any) => segment?.[0] || '').join('');
      if (translated) {
        memCache.set(cacheKey, translated);
        try {
          sessionStorage.setItem(STORAGE_PREFIX + cacheKey, translated);
        } catch {
          // ignore
        }
        return translated;
      }
    }
  } catch {
    // fallback to English text
  }
  return text;
}

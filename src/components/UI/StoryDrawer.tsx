import React, { useEffect, useRef } from 'react';
import {
  X,
  MapPin,
  Eye,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import type { GhostPin, SupportedLanguage } from '../../types/ghost';
import { getTranslation } from '../../lib/i18n';

interface StoryDrawerProps {
  pin: GhostPin | null;
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const StoryDrawer: React.FC<StoryDrawerProps> = ({
  pin,
  isOpen,
  onClose,
  language,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const t = getTranslation(language);

  // Modern HTML <dialog> lifecycle
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen, pin]);

  // Fallback for browsers without native <dialog closedby> support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleDialogClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) {
        onClose();
      }
    };

    const handleCloseEvent = () => {
      onClose();
    };

    dialog.addEventListener('click', handleDialogClick);
    dialog.addEventListener('close', handleCloseEvent);

    return () => {
      dialog.removeEventListener('click', handleDialogClick);
      dialog.removeEventListener('close', handleCloseEvent);
    };
  }, [onClose, pin]);

  if (!pin) return null;

  const title = language === 'th' ? pin.title_th : pin.title_en;
  const province = language === 'th' ? pin.province_th : pin.province_en;
  const district = language === 'th' ? pin.district_th : pin.district_en;
  const story = language === 'th' ? pin.story_th : pin.story_en;
  const history = language === 'th' ? pin.folklore_history_th : pin.folklore_history_en;
  const categoryLabel = t.categories[pin.category] || pin.category;

  return (
    <dialog
      ref={dialogRef}
      closedby="any" onClose={onClose}
      aria-labelledby="story-drawer-title"
      className="m-0 ml-auto h-full max-h-none w-full max-w-lg p-0 bg-transparent text-slate-100 border-none outline-none backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col h-full bg-slate-950/95 border-l border-emerald-500/20 shadow-2xl backdrop-blur-xl overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header Bar */}
        <div className="relative p-6 border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              {categoryLabel}
            </span>

            <button
              onClick={onClose}
              aria-label={t.close}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2
            id="story-drawer-title"
            className="text-2xl font-bold tracking-tight text-white mb-2 leading-tight"
          >
            {title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1 text-emerald-400">
              <MapPin className="w-3.5 h-3.5" />
              <span>{province} {district && `• ${district}`}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              <span>{pin.views_count.toLocaleString()} {t.views}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Story Image / Atmosphere Illustration */}
          {pin.image_url ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-video">
              <img
                src={pin.image_url}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-emerald-950/20 to-slate-950 p-6 flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-2">👻</span>
              <p className="text-xs text-emerald-400/80 font-mono">
                {title} • {province}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Cloudflare R2 Object Storage Ready
              </p>
            </div>
          )}

          {/* Story Narrative */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <BookOpen className="w-4 h-4" />
              <span>{t.storyDetail}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-sm leading-relaxed text-slate-300">
              {story}
            </div>
          </div>

          {/* Folklore & Historical Context */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>{t.folkloreHistory}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-sm leading-relaxed text-slate-300">
              {history}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 flex items-center justify-between text-xs text-slate-500">
          <span>Lat: {pin.lat.toFixed(4)}, Lng: {pin.lng.toFixed(4)}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </dialog>
  );
};

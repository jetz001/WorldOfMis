import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import {
  X,
  MapPin,
  Eye,
  BookOpen,
  Sparkles,
  Skull,
  Scale,
  Ruler,
  UserCheck,
  Compass,
  Clock,
  ShieldAlert,
  ScrollText,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
} from 'lucide-react';
import type { GhostPin, SupportedLanguage, MediaItem } from '../../types/ghost';
import { getTranslation } from '../../lib/i18n';
import { getEntityDossier } from '../../lib/entityBestiary';

interface StoryDrawerProps {
  pin: GhostPin | null;
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

/**
 * Extracts standard 11-char YouTube Video ID from various URL formats
 */
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export const StoryDrawer: React.FC<StoryDrawerProps> = ({
  pin,
  isOpen,
  onClose,
  language,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbsScrollRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);

  // Carousel & Lightbox States
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  const dossier = useMemo(() => {
    if (!pin) return null;
    return getEntityDossier(pin, language);
  }, [pin, language]);

  // Construct complete Media List (Primary portrait + Gallery/YouTube items)
  const mediaItems: MediaItem[] = useMemo(() => {
    if (!pin) return [];
    if (pin.gallery_media && pin.gallery_media.length > 0) {
      return pin.gallery_media;
    }
    const defaultUrl = pin.image_url || dossier?.portraitUrl || `/entities/${pin.id}.jpg`;
    return [{ type: 'image', url: defaultUrl, title: language === 'th' ? pin.title_th : pin.title_en }];
  }, [pin, dossier, language]);

  // Reset active slide & video playback whenever selected pin changes
  useEffect(() => {
    setActiveMediaIndex(0);
    setIsPlayingVideo(false);
    setIsFullscreenModalOpen(false);
  }, [pin?.id]);

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
      setIsFullscreenModalOpen(false);
      setIsPlayingVideo(false);
    }
  }, [isOpen, pin]);

  // Handle escape key for fullscreen media modal
  useEffect(() => {
    if (!isFullscreenModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsFullscreenModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isFullscreenModalOpen]);

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

    dialog.addEventListener('click', handleDialogClick);
    return () => {
      dialog.removeEventListener('click', handleDialogClick);
    };
  }, [onClose, pin]);

  // Carousel navigation
  const handlePrevMedia = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlayingVideo(false);
    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaItems.length - 1));
  }, [mediaItems.length]);

  const handleNextMedia = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlayingVideo(false);
    setActiveMediaIndex((prev) => (prev < mediaItems.length - 1 ? prev + 1 : 0));
  }, [mediaItems.length]);

  const handleSelectMedia = useCallback((idx: number) => {
    setIsPlayingVideo(false);
    setActiveMediaIndex(idx);
  }, []);

  const scrollThumbs = (direction: 'left' | 'right') => {
    if (!thumbsScrollRef.current) return;
    const offset = direction === 'left' ? -220 : 220;
    thumbsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  if (!pin || !dossier) return null;

  const title = language === 'th' ? pin.title_th : pin.title_en;
  const subTitle = language === 'th' ? pin.title_en : pin.title_th;
  const province = language === 'th' ? pin.province_th : pin.province_en;
  const district = language === 'th' ? pin.district_th : pin.district_en;
  const history = language === 'th' ? pin.folklore_history_th : pin.folklore_history_en;
  const categoryLabel = t.categories[pin.category] || pin.category;

  const currentMedia = mediaItems[activeMediaIndex] || mediaItems[0];
  const ytVideoId = currentMedia?.type === 'youtube' ? getYouTubeId(currentMedia.url) : null;
  const currentThumbnail =
    currentMedia?.type === 'youtube'
      ? currentMedia.thumbnail || (ytVideoId ? `https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg` : dossier.portraitUrl)
      : currentMedia?.url || dossier.portraitUrl;

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      onClose={onClose}
      aria-labelledby="story-drawer-title"
      className="m-0 ml-auto h-full max-h-none w-full max-w-xl p-0 bg-transparent text-slate-100 border-none outline-none backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="relative flex flex-col h-full bg-[#060911]/98 border-l border-amber-500/25 shadow-[-20px_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Ambient Grimoire Background Texture & Ornate Corner Lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(circle at 85% 12%, rgba(16, 185, 129, 0.14) 0%, transparent 45%), radial-gradient(circle at 15% 88%, rgba(217, 119, 6, 0.1) 0%, transparent 50%)',
          }}
        />

        {/* Top Antique Grimoire Header */}
        <div className="relative px-6 pt-5 pb-4 border-b border-amber-500/20 bg-gradient-to-b from-[#0b121e] via-[#080d16] to-transparent">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-emerald-950/80 text-emerald-300 border border-emerald-500/35 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {categoryLabel}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded bg-amber-950/50 text-amber-300/90 border border-amber-500/30">
                {dossier.codexId}
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label={t.close}
              className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Vintage Title */}
          <h2
            id="story-drawer-title"
            className="font-sans text-2xl md:text-3xl font-bold tracking-normal text-amber-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] leading-snug"
          >
            {title}
          </h2>
          <p className="font-sans text-xs italic text-amber-200/80 tracking-normal mt-0.5 mb-2.5">
            “{subTitle}”
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {province} {district && `• ${district}`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Eye className="w-3.5 h-3.5 text-amber-400/80" />
              <span>
                {pin.views_count.toLocaleString()} {t.views}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Grimoire Body */}
        <div className="relative flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* ============================================================== */}
          {/* STEAM-STYLE MEDIA CAROUSEL (MAIN PLAYER + THUMBNAIL STRIP)      */}
          {/* ============================================================== */}
          <div className="space-y-2.5">
            {/* 1. Main Media Stage (16:9) */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/35 bg-[#03060c] shadow-[0_12px_35px_rgba(0,0,0,0.9)] group">
              <div className="relative aspect-video w-full overflow-hidden flex items-center justify-center">
                {/* VIDEO STAGE */}
                {currentMedia.type === 'youtube' && ytVideoId ? (
                  isPlayingVideo ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ytVideoId}?autoplay=1&rel=0`}
                      title={currentMedia.title || title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0 z-[10]"
                    />
                  ) : (
                    <div
                      onClick={() => setIsPlayingVideo(true)}
                      className="relative w-full h-full flex items-center justify-center cursor-pointer group/play"
                    >
                      {/* Ambient blurred backdrop */}
                      <img
                        src={currentThumbnail}
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
                      />
                      {/* Sharp video poster */}
                      <img
                        src={currentThumbnail}
                        alt={currentMedia.title || title}
                        className="relative w-full h-full object-contain group-hover/play:scale-105 transition-transform duration-500 z-[1]"
                      />
                      {/* Dark overlay & Big Pulsing Play Button */}
                      <div className="absolute inset-0 bg-black/40 group-hover/play:bg-black/20 transition-colors z-[2]" />
                      <div className="relative z-[4] flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-rose-600/90 hover:bg-rose-600 border-2 border-white/80 shadow-[0_0_30px_rgba(244,63,94,0.7)] flex items-center justify-center group-hover/play:scale-110 transition-transform">
                          <Play className="w-7 h-7 text-white fill-white ml-1" />
                        </div>
                        <span className="text-[11px] font-semibold text-rose-200 bg-black/80 px-3 py-1 rounded-full border border-rose-500/40 backdrop-blur-md">
                          {language === 'th' ? '▶ กดเล่นวิดีโอสารคดี' : '▶ Play Documentary'}
                        </span>
                      </div>
                    </div>
                  )
                ) : (
                  /* IMAGE STAGE */
                  <div
                    onClick={() => setIsFullscreenModalOpen(true)}
                    className="relative w-full h-full flex items-center justify-center cursor-zoom-in"
                    title={language === 'th' ? 'กดเพื่อเปิดดูภาพเต็มจอ (Fill Page)' : 'Click to view full image'}
                  >
                    {/* Ambient blurred backdrop */}
                    <img
                      src={currentThumbnail}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125"
                    />
                    {/* Centered crisp image */}
                    <img
                      src={currentThumbnail}
                      alt={currentMedia.title || title}
                      className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 z-[1]"
                    />
                    {/* Top right zoom button */}
                    <div className="pointer-events-none absolute top-3 right-3 z-[4] flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 border border-amber-400/50 text-amber-200 text-xs backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                      <span>{language === 'th' ? 'ดูภาพเต็ม' : 'Fill page'}</span>
                    </div>
                  </div>
                )}

                {/* Dark vignette overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05080f]/90 via-transparent to-black/30 z-[3]" />

                {/* Corner Arcane Accents */}
                <div className="pointer-events-none absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-amber-400/60 rounded-tl z-[3]" />
                <div className="pointer-events-none absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-amber-400/60 rounded-tr z-[3]" />
                <div className="pointer-events-none absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-amber-400/60 rounded-bl z-[3]" />
                <div className="pointer-events-none absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-amber-400/60 rounded-br z-[3]" />

                {/* Left & Right Stage Navigation Arrows (When multiple items exist) */}
                {mediaItems.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevMedia}
                      aria-label="Previous slide"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-[15] p-2 rounded-full bg-black/75 hover:bg-black/95 border border-amber-500/40 text-amber-200 hover:text-white transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 shadow-lg"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextMedia}
                      aria-label="Next slide"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-[15] p-2 rounded-full bg-black/75 hover:bg-black/95 border border-amber-500/40 text-amber-200 hover:text-white transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 shadow-lg"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Bottom Omen / Danger Level Meter & Slide Counter */}
                <div className="absolute bottom-3 inset-x-4 flex items-center justify-between gap-2 z-[5] pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-amber-200/90 bg-slate-950/85 border border-amber-500/30 px-2.5 py-1 rounded-lg backdrop-blur-md">
                      {dossier.dangerLabel}
                    </span>
                    {mediaItems.length > 1 && (
                      <span className="text-[10px] font-mono font-semibold text-slate-300 bg-black/85 border border-slate-700/60 px-2 py-0.5 rounded-md backdrop-blur-md">
                        {activeMediaIndex + 1} / {mediaItems.length}
                      </span>
                    )}
                  </div>

                  <div
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-rose-500/30 backdrop-blur-md"
                    title={dossier.dangerLabel}
                  >
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <Skull
                        key={lvl}
                        className={`w-3.5 h-3.5 ${
                          lvl <= dossier.dangerLevel
                            ? 'text-rose-400 fill-rose-500/30 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Steam-Style Thumbnail Strip Carousel (Below Stage) */}
            {mediaItems.length > 1 && (
              <div className="relative flex items-center gap-1.5 pt-1">
                <button
                  onClick={() => scrollThumbs('left')}
                  aria-label="Scroll thumbnails left"
                  className="shrink-0 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div
                  ref={thumbsScrollRef}
                  className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-0.5"
                >
                  {mediaItems.map((item, idx) => {
                    const isSelected = idx === activeMediaIndex;
                    const itemYtId = item.type === 'youtube' ? getYouTubeId(item.url) : null;
                    const thumbSrc =
                      item.type === 'youtube'
                        ? item.thumbnail || (itemYtId ? `https://img.youtube.com/vi/${itemYtId}/mqdefault.jpg` : dossier.portraitUrl)
                        : item.url;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectMedia(idx)}
                        className={`relative shrink-0 w-24 sm:w-28 aspect-video rounded-xl overflow-hidden border transition-all cursor-pointer bg-slate-950/90 ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/60 scale-[1.03] shadow-[0_0_12px_rgba(251,191,36,0.35)]'
                            : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                        }`}
                        title={item.title || `${title} (${idx + 1})`}
                      >
                        <img
                          src={thumbSrc}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {/* Type Icon Badge */}
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 border border-white/20 text-[9px] font-medium flex items-center gap-1 text-slate-200">
                          {item.type === 'youtube' ? (
                            <>
                              <Play className="w-2.5 h-2.5 text-rose-400 fill-rose-500" />
                              <span className="text-rose-300">VIDEO</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-2.5 h-2.5 text-emerald-400" />
                              <span>IMG</span>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => scrollThumbs('right')}
                  aria-label="Scroll thumbnails right"
                  className="shrink-0 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 2. Physical & Paranormal Dossier Specifications                */}
          {/* ============================================================== */}
          <div className="rounded-2xl bg-[#09101b]/90 border border-amber-500/25 p-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800/90 pb-2.5 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 font-sans">
                <ScrollText className="w-4 h-4 text-amber-400" />
                <span>
                  {language === 'th'
                    ? 'แฟ้มข้อมูลจำเพาะสิ่งลี้ลับ (Entity Dossier)'
                    : 'Paranormal Entity Specifications'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/80">
                ARCHIVE VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs font-sans">
              {/* ประเภท (Type / Classification) */}
              <div className="col-span-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    {language === 'th' ? 'ประเภท / สายพันธุ์ (Classification)' : 'Classification / Type'}
                  </p>
                  <p className="font-semibold text-emerald-200 mt-0.5">
                    {dossier.entityType}
                  </p>
                </div>
              </div>

              {/* เพศ (Gender) */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                <UserCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    {language === 'th' ? 'เพศสภาพ (Gender)' : 'Gender'}
                  </p>
                  <p className="font-medium text-slate-200 mt-0.5">{dossier.gender}</p>
                </div>
              </div>

              {/* ขนาด / ความสูง (Size) */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                <Ruler className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    {language === 'th' ? 'ขนาด / ความสูง (Size)' : 'Size / Stature'}
                  </p>
                  <p className="font-medium text-slate-200 mt-0.5">{dossier.size}</p>
                </div>
              </div>

              {/* น้ำหนัก (Weight) */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                <Scale className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    {language === 'th' ? 'น้ำหนัก (Weight)' : 'Estimated Weight'}
                  </p>
                  <p className="font-medium text-slate-200 mt-0.5">{dossier.weight}</p>
                </div>
              </div>

              {/* ช่วงเวลาปรากฏตัว (Active Hours) */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    {language === 'th' ? 'เวลาปรากฏตัว (Active Hours)' : 'Active Hours'}
                  </p>
                  <p className="font-medium text-slate-200 mt-0.5">{dossier.activeHours}</p>
                </div>
              </div>

              {/* ถิ่นอาศัย (Habitat) */}
              <div className="col-span-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    {language === 'th' ? 'ถิ่นอาศัยและจุดพบบ่อย (Habitat)' : 'Primary Habitat & Haunting Ground'}
                  </p>
                  <p className="font-medium text-slate-200 mt-0.5">{dossier.habitat}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Physical Description & Manifestation Signs */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300 font-sans tracking-wide">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>
                {language === 'th'
                  ? 'รูปลักษณ์และอัตลักษณ์ที่พบเห็น (Description & Appearance)'
                  : 'Physical Description & Manifestation Signs'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#09111c]/85 border border-amber-500/20 text-sm leading-relaxed text-slate-100 font-sans">
              {dossier.appearanceDesc}
            </div>
          </div>

          {/* 4. Expanded Story Narrative */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-300 font-sans tracking-wide">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>{t.storyDetail}</span>
            </div>
            <div className="p-5 rounded-2xl bg-[#08121a]/90 border border-emerald-500/25 text-sm sm:text-base leading-relaxed sm:leading-8 text-slate-100 font-sans whitespace-pre-line">
              {dossier.expandedStory}
            </div>
          </div>

          {/* 5. Folklore & Historical Context */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300 font-sans tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.folkloreHistory}</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 text-sm sm:text-base leading-relaxed sm:leading-8 text-slate-200 font-sans whitespace-pre-line">
              {history}
            </div>
          </div>

          {/* 6. Ancient Taboos & Survival Warnings */}
          <div className="rounded-2xl bg-rose-950/20 border border-rose-500/30 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-300 font-sans">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>
                {language === 'th'
                  ? 'ข้อห้ามโบราณและวิธีเอาชีวิตรอด (Taboos & Survival Rules)'
                  : 'Ancient Taboos & Survival Protocol'}
              </span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {dossier.omensAndTaboos.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold mt-0.5">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="relative px-6 py-3.5 border-t border-amber-500/20 bg-[#05080f] flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px] text-amber-200/70">
            LAT {pin.lat.toFixed(4)}° • LNG {pin.lng.toFixed(4)}°
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 font-semibold transition-all cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN FILL-PAGE LIGHTBOX OVERLAY (IMAGE OR YOUTUBE)       */}
      {/* ============================================================== */}
      {isFullscreenModalOpen && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsFullscreenModalOpen(false);
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in duration-200 select-none"
        >
          {/* Header Controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-7xl flex items-center justify-between pb-3 px-2 border-b border-amber-500/25 mb-3"
          >
            <div className="flex items-center gap-3">
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-amber-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {title}
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
                {dossier.codexId}
              </span>
              {currentMedia.title && (
                <span className="hidden sm:inline text-xs text-slate-400 font-serif italic truncate max-w-md">
                  — {currentMedia.title}
                </span>
              )}
            </div>

            <button
              onClick={() => setIsFullscreenModalOpen(false)}
              className="p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-200 hover:text-white transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.8)]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Fullscreen Media Container (Fill Page) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full h-full max-w-7xl max-h-[82vh] flex items-center justify-center overflow-hidden rounded-2xl border border-amber-500/30 bg-[#02050b] shadow-[0_0_60px_rgba(0,0,0,0.95)]"
          >
            {currentMedia.type === 'youtube' && ytVideoId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytVideoId}?autoplay=1&rel=0`}
                title={currentMedia.title || title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <img
                src={currentThumbnail}
                alt={title}
                className="w-full h-full object-contain max-h-[82vh] select-none"
              />
            )}
          </div>

          <p className="mt-2 text-xs text-amber-200/80 font-sans tracking-wide text-center">
            {language === 'th' ? 'กดที่ว่างหรือคลิกปุ่มปิด เพื่อกลับสู่คัมภีร์' : 'Click backdrop or close button to return'}
          </p>
        </div>
      )}
    </dialog>
  );
};

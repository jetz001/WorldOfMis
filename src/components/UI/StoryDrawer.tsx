import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import {
  X,
  MapPin,
  Eye,
  Skull,
  Scale,
  Ruler,
  UserCheck,
  Compass,
  Clock,
  ScrollText,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import type { GhostPin, SupportedLanguage, MediaItem } from '../../types/ghost';
import { getTranslation } from '../../lib/i18n';
import { translateText } from '../../lib/autoTranslate';
import { getEntityDossier } from '../../lib/entityBestiary';
import { CommentsPanel } from './CommentsPanel';
import { VintageCorner, VintageDivider } from './VintageOrnament';

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

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80';

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
  const [mobileTab, setMobileTab] = useState<'dossier' | 'comments'>('dossier');

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
    const defaultUrl = pin.image_url || dossier?.portraitUrl || DEFAULT_FALLBACK_IMAGE;
    return [{ type: 'image', url: defaultUrl, title: language === 'th' ? pin.title_th : pin.title_en }];
  }, [pin, dossier, language]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.dataset.failed) return;
    target.dataset.failed = 'true';
    const ytFallback = pin?.gallery_media?.find(m => m.type === 'youtube')?.thumbnail;
    if (ytFallback && !target.src.includes(ytFallback)) {
      target.src = ytFallback;
    } else {
      target.src = DEFAULT_FALLBACK_IMAGE;
    }
  };

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

  // Auto-translate story & dossier fields when language is outside th/en
  const [translatedFields, setTranslatedFields] = useState<{
    title?: string;
    province?: string;
    district?: string;
    history?: string;
    appearanceDesc?: string;
    expandedStory?: string;
    entityType?: string;
    habitat?: string;
    omensAndTaboos?: string[];
  } | null>(null);

  useEffect(() => {
    if (!pin || !dossier || language === 'th' || language === 'en') {
      setTranslatedFields(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const [
        tTitle,
        tProv,
        tDist,
        tHist,
        tApp,
        tStory,
        tType,
        tHab,
        ...tRules
      ] = await Promise.all([
        translateText(pin.title_en, language),
        translateText(pin.province_en, language),
        pin.district_en ? translateText(pin.district_en, language) : Promise.resolve(''),
        translateText(pin.folklore_history_en, language),
        translateText(dossier.appearanceDesc, language),
        translateText(dossier.expandedStory, language),
        translateText(dossier.entityType, language),
        translateText(dossier.habitat, language),
        ...dossier.omensAndTaboos.map((r) => translateText(r, language)),
      ]);
      if (!cancelled) {
        setTranslatedFields({
          title: tTitle,
          province: tProv,
          district: tDist,
          history: tHist,
          appearanceDesc: tApp,
          expandedStory: tStory,
          entityType: tType,
          habitat: tHab,
          omensAndTaboos: tRules,
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pin, dossier, language]);

  if (!pin || !dossier) return null;

  const title =
    language === 'th'
      ? pin.title_th
      : translatedFields?.title || pin.title_en;
  const subTitle = language === 'th' ? pin.title_en : pin.title_th;
  const province =
    language === 'th'
      ? pin.province_th
      : translatedFields?.province || pin.province_en;
  const district =
    language === 'th'
      ? pin.district_th
      : translatedFields?.district || pin.district_en;
  const history =
    language === 'th'
      ? pin.folklore_history_th
      : translatedFields?.history || pin.folklore_history_en;
  const displayAppearance = translatedFields?.appearanceDesc || dossier.appearanceDesc;
  const displayExpandedStory = translatedFields?.expandedStory || dossier.expandedStory;
  const displayEntityType = translatedFields?.entityType || dossier.entityType;
  const displayHabitat = translatedFields?.habitat || dossier.habitat;
  const displayTaboos = translatedFields?.omensAndTaboos || dossier.omensAndTaboos;
  const categoryLabel = t.categories[pin.category] || pin.category;

  const currentMedia = mediaItems[activeMediaIndex] || mediaItems[0];
  const ytVideoId = currentMedia?.type === 'youtube' ? getYouTubeId(currentMedia.url) : null;
  const currentThumbnail =
    currentMedia?.type === 'youtube'
      ? currentMedia.thumbnail || dossier.portraitUrl
      : currentMedia?.url || dossier.portraitUrl;

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      onClose={onClose}
      aria-labelledby="story-drawer-title"
      className="m-0 p-0 h-full max-h-none w-full max-w-none bg-transparent text-slate-100 border-none outline-none backdrop:bg-black/30 backdrop:backdrop-blur-[1px]"
    >
      <div className="relative w-full h-full flex justify-between overflow-hidden">
        {/* ============================================================== */}
        {/* LEFT PANEL: EYEWITNESS COMMENTS & POPULAR TESTIMONIES          */}
        {/* ============================================================== */}
        <div
          className={`shrink-0 h-full w-full lg:w-96 xl:w-[410px] z-30 transition-transform ${
            mobileTab === 'comments' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="w-full h-full flex flex-col">
            {/* Mobile Tab Switcher at top of comments */}
            <div className="lg:hidden flex items-center justify-between p-2.5 bg-[#eedbb8] border-b border-[#8b5a2b]/40 text-xs font-parchment">
              <button
                type="button"
                onClick={() => setMobileTab('dossier')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#dfcaa8] text-[#3d2008] border border-[#8b5a2b] font-medium shadow-sm"
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>{language === 'th' ? '← สลับไปดูสารานุกรม' : '← Switch to Dossier'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full bg-[#e0cdb0] text-[#3d2008] hover:bg-[#d0bca0] border border-[#8b5a2b]/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <CommentsPanel pin={pin} language={language} onClose={onClose} />
          </div>
        </div>

        {/* ============================================================== */}
        {/* CENTER TRANSPARENT VIEWPORT (70% TRANSPARENCY OVER 3D GLOBE)    */}
        {/* ============================================================== */}
        <div
          onClick={onClose}
          className="hidden lg:flex flex-1 h-full cursor-pointer bg-black/5 hover:bg-black/0 transition-colors items-end justify-center pb-8 select-none group z-10"
          title={language === 'th' ? 'คลิกที่ว่างตรงกลางเพื่อปิด' : 'Click center backdrop to close'}
        >
          <div className="opacity-0 group-hover:opacity-95 transition-opacity px-4 py-2 rounded-full bg-stone-900/85 border border-[#dfd7c6]/40 text-xs text-amber-100 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center gap-2">
            <span>👁️</span>
            <span>
              {language === 'th'
                ? 'มุมมองลูกโลก 3D • คลิกที่ว่างเพื่อปิด'
                : '3D Globe View • Click to close'}
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: STORY DOSSIER & MEDIA CAROUSEL (PARCHMENT THEME)  */}
        {/* ============================================================== */}
        <div
          className={`relative flex flex-col h-full w-full lg:max-w-xl xl:max-w-xl bg-parchment-sheet text-[#22140a] border-l-2 border-[#5a3818] shadow-[-20px_0_60px_rgba(0,0,0,0.45)] overflow-hidden animate-in slide-in-from-right duration-300 z-30 font-parchment ${
            mobileTab === 'dossier' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Mobile Top Toggle for switching to comments */}
          <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-[#eedbb8] border-b border-[#8b5a2b]/40 text-xs">
            <button
              type="button"
              onClick={() => setMobileTab('comments')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#dfcaa8] text-[#3d2008] border border-[#8b5a2b] font-medium hover:bg-[#cfb997] transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{language === 'th' ? '💬 ดูความคิดเห็น & พยาน' : '💬 View Comments & Evidence'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        {/* Ambient Warm Parchment Background Subtle Vignette */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 85% 12%, rgba(217, 119, 6, 0.05) 0%, transparent 45%), radial-gradient(circle at 15% 88%, rgba(180, 83, 9, 0.04) 0%, transparent 50%)',
          }}
        />

        {/* Victorian Perimeter Inner Frame */}
        <div className="pointer-events-none absolute inset-2 sm:inset-3 border border-[#7a4820]/45 rounded-lg z-20">
          <VintageCorner position="top-left" className="absolute -top-1.5 -left-1.5 w-7 h-7 sm:w-8 sm:h-8 text-[#5a3818]" />
          <VintageCorner position="top-right" className="absolute -top-1.5 -right-1.5 w-7 h-7 sm:w-8 sm:h-8 text-[#5a3818]" />
          <VintageCorner position="bottom-left" className="absolute -bottom-1.5 -left-1.5 w-7 h-7 sm:w-8 sm:h-8 text-[#5a3818]" />
          <VintageCorner position="bottom-right" className="absolute -bottom-1.5 -right-1.5 w-7 h-7 sm:w-8 sm:h-8 text-[#5a3818]" />
        </div>

        {/* Top Antique Grimoire Header */}
        <div className="relative px-6 pt-5 pb-4 border-b-2 border-[#6d411b]/40 bg-[#f4ebd5]/80 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#e6d5b8] text-[#4a280d] border border-[#9e6f3b] font-serif shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <Compass className="w-3 h-3 text-[#7a4618]" />
                {categoryLabel}
              </span>
              <span className="text-[10.5px] font-mono tracking-widest uppercase px-2.5 py-1 rounded bg-[#dfcaa8] text-[#3d2008] border border-[#8f5d2c] font-bold shadow-sm">
                {dossier.codexId}
              </span>
            </div>

            <button
              onClick={onClose}
              aria-label={t.close}
              className="p-2 rounded-full bg-[#e8dabf] hover:bg-[#d8c59f] border border-[#8b5a2b] text-[#3d220c] hover:text-[#1a0f05] transition-colors cursor-pointer shadow"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Vintage Title */}
          <h2
            id="story-drawer-title"
            className="font-parchment text-2xl md:text-3xl font-bold tracking-tight text-[#1a0f05] leading-snug drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]"
          >
            {title}
          </h2>
          <p className="font-parchment text-xs sm:text-sm italic text-[#533519] tracking-normal mt-1 mb-2.5">
            “{subTitle}”
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#5a3818]">
            <div className="flex items-center gap-1.5 text-[#3a200a] font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#8b4513]" />
              <span>
                {province} {district && `• ${district}`}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[#5a3818] font-medium">
              <Eye className="w-3.5 h-3.5 text-[#8b5a2b]" />
              <span>
                {pin.views_count.toLocaleString()} {t.views}
              </span>
            </div>
          </div>

          {/* Privacy Coordinate Offset Notice */}
          <div className="mt-2.5 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#533519]/10 border border-[#8b5a2b]/35 text-xs text-[#4a2e16] font-medium shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            <ShieldAlert className="w-4 h-4 text-[#8b4513] shrink-0" />
            <span className="leading-tight">
              {language === 'th'
                ? 'หมุดไม่ได้ปักลงบนพื้นที่จริง มีการปรับเยื้องเล็กน้อยเพื่อป้องกันข้อมูลส่วนบุคคล'
                : 'Pins are not placed on exact physical properties; minor coordinate offsets have been applied to protect privacy.'}
            </span>
          </div>
        </div>

        {/* Scrollable Grimoire Body */}
        <div className="relative flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* ============================================================== */}
          {/* STEAM-STYLE MEDIA CAROUSEL (MAIN PLAYER + THUMBNAIL STRIP)      */}
          {/* ============================================================== */}
          <div className="space-y-2.5">
            {/* 1. Main Media Stage (16:9) */}
            <div className="relative rounded-xl overflow-hidden border-2 border-[#5a3818] outline outline-1 outline-[#9e733b] bg-[#120d09] shadow-[0_8px_30px_rgba(40,25,10,0.35)] group">
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
                        onError={handleImageError}
                        className="pointer-events-none absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-110"
                      />
                      {/* Sharp video poster */}
                      <img
                        src={currentThumbnail}
                        alt={currentMedia.title || title}
                        onError={handleImageError}
                        className="w-full h-full object-contain group-hover/play:scale-105 transition-transform duration-500 z-[1]"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover/play:bg-black/20 transition-colors z-[2]" />
                      
                      {/* Big Pulsing Play Button - Perfectly Centered */}
                      <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center gap-2 pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-rose-600/90 hover:bg-rose-600 border-2 border-white/80 shadow-[0_0_30px_rgba(244,63,94,0.7)] flex items-center justify-center group-hover/play:scale-110 transition-transform pointer-events-auto">
                          <Play className="w-7 h-7 text-white fill-white ml-1" />
                        </div>
                        <span className="text-[11px] font-semibold text-rose-200 bg-black/80 px-3 py-1 rounded-full border border-rose-500/40 backdrop-blur-md pointer-events-auto">
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
                      onError={handleImageError}
                      className="pointer-events-none absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125"
                    />
                    {/* Centered crisp image */}
                    <img
                      src={currentThumbnail}
                      alt={currentMedia.title || title}
                      onError={handleImageError}
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
              <div className="relative flex items-center gap-1.5 p-1.5 rounded-xl bg-[#eadbbd]/90 border border-[#8b5a2b]/60 shadow-inner">
                <button
                  onClick={() => scrollThumbs('left')}
                  aria-label="Scroll thumbnails left"
                  className="shrink-0 p-1.5 rounded-lg bg-[#e2d8c6] hover:bg-[#d6cbba] border border-[#cbbeaa] text-stone-700 hover:text-stone-900 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div
                  ref={thumbsScrollRef}
                  className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-0.5"
                >
                  {mediaItems.map((item, idx) => {
                    const isSelected = idx === activeMediaIndex;
                    const thumbSrc =
                      item.type === 'youtube'
                        ? item.thumbnail || dossier.portraitUrl
                        : item.url;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectMedia(idx)}
                        className={`relative shrink-0 w-24 sm:w-28 aspect-video rounded-xl overflow-hidden border transition-all cursor-pointer bg-stone-900 ${
                          isSelected
                            ? 'border-amber-600 ring-2 ring-amber-500/40 scale-[1.03] shadow-md'
                            : 'border-[#d4c9b3] opacity-75 hover:opacity-100 hover:border-amber-600'
                        }`}
                        title={item.title || `${title} (${idx + 1})`}
                      >
                        <img
                          src={thumbSrc}
                          alt=""
                          onError={handleImageError}
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
                  className="shrink-0 p-1.5 rounded-lg bg-[#e2d8c6] hover:bg-[#d6cbba] border border-[#cbbeaa] text-stone-700 hover:text-stone-900 cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 2. Physical & Paranormal Dossier Specifications (Infobox)       */}
          {/* ============================================================== */}
          <div className="rounded-xl bg-[#fbf5e8] border-2 border-[#8b5a2b]/60 p-4 sm:p-5 shadow-[inset_0_0_20px_rgba(139,90,43,0.08),0_2px_8px_rgba(70,40,15,0.06)] space-y-3.5 font-parchment">
            <div className="flex items-center justify-between border-b-2 border-[#8b5a2b]/30 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3d2008] font-parchment">
                <ScrollText className="w-4 h-4 text-[#7a4618]" />
                <span>
                  {language === 'th'
                    ? 'สารานุกรมข้อมูลจำเพาะ (Dossier Classification)'
                    : 'Entity Dossier & Classification'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#3d2008] bg-[#dfcaa8] px-2 py-0.5 rounded border border-[#8b5a2b] font-semibold">
                ARCHIVE VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs font-parchment">
              {/* ประเภท (Type / Classification) */}
              <div className="col-span-2 p-3 rounded-lg bg-[#fffdf8] border border-[#cfb68a] flex items-start gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <Compass className="w-4 h-4 text-[#8b4513] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#6b4728] font-sans font-medium">
                    {language === 'th' ? 'ประเภท / สายพันธุ์ (Classification)' : 'Classification / Type'}
                  </p>
                  <p className="font-bold text-[#2a1608] mt-0.5 text-[13px]">
                    {displayEntityType}
                  </p>
                </div>
              </div>

              {/* เพศ (Gender) */}
              <div className="p-3 rounded-lg bg-[#fffdf8] border border-[#cfb68a] flex items-start gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <UserCheck className="w-4 h-4 text-[#8b5a2b] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#6b4728] font-sans font-medium">
                    {language === 'th' ? 'เพศสภาพ (Gender)' : 'Gender'}
                  </p>
                  <p className="font-medium text-[#2a1608] mt-0.5">{dossier.gender}</p>
                </div>
              </div>

              {/* ขนาด / ความสูง (Size) */}
              <div className="p-3 rounded-lg bg-[#fffdf8] border border-[#cfb68a] flex items-start gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <Ruler className="w-4 h-4 text-[#8b5a2b] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#6b4728] font-sans font-medium">
                    {language === 'th' ? 'ขนาด / ความสูง (Size)' : 'Size / Stature'}
                  </p>
                  <p className="font-medium text-[#2a1608] mt-0.5">{dossier.size}</p>
                </div>
              </div>

              {/* น้ำหนัก (Weight) */}
              <div className="p-3 rounded-lg bg-[#fffdf8] border border-[#cfb68a] flex items-start gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <Scale className="w-4 h-4 text-[#8b5a2b] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#6b4728] font-sans font-medium">
                    {language === 'th' ? 'น้ำหนัก (Weight)' : 'Estimated Weight'}
                  </p>
                  <p className="font-medium text-[#2a1608] mt-0.5">{dossier.weight}</p>
                </div>
              </div>

              {/* ช่วงเวลาปรากฏตัว (Active Hours) */}
              <div className="p-3 rounded-lg bg-[#fffdf8] border border-[#cfb68a] flex items-start gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <Clock className="w-4 h-4 text-[#8b5a2b] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#6b4728] font-sans font-medium">
                    {language === 'th' ? 'เวลาปรากฏตัว (Active Hours)' : 'Active Hours'}
                  </p>
                  <p className="font-medium text-[#2a1608] mt-0.5">{dossier.activeHours}</p>
                </div>
              </div>

              {/* ถิ่นอาศัย (Habitat) */}
              <div className="col-span-2 p-3 rounded-lg bg-[#fffdf8] border border-[#cfb68a] flex items-start gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <MapPin className="w-4 h-4 text-[#8b4513] shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-[#6b4728] font-sans font-medium">
                    {language === 'th' ? 'ถิ่นอาศัยและจุดพบบ่อย (Habitat)' : 'Primary Habitat & Haunting Ground'}
                  </p>
                  <p className="font-medium text-[#2a1608] mt-0.5">{displayHabitat}</p>
                  <p className="text-[10.5px] text-[#7a4618] mt-1.5 flex items-center gap-1 font-sans">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#8b4513] shrink-0" />
                    <span>
                      {language === 'th'
                        ? 'หมุดไม่ได้ปักลงบนพื้นที่จริง มีการปรับเยื้องเล็กน้อยเพื่อป้องกันข้อมูลส่วนบุคคล'
                        : 'Coordinates are slightly offset to protect privacy'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Physical Description & Manifestation Signs */}
          <div className="space-y-2">
            <div className="border-l-4 border-[#8b5a2b] pl-3 py-0.5 text-xs sm:text-sm font-bold tracking-wide uppercase text-[#3e210a] font-parchment">
              <span>
                {language === 'th'
                  ? 'รูปลักษณ์และอัตลักษณ์ที่พบเห็น (Description & Appearance)'
                  : 'Physical Description & Manifestation Signs'}
              </span>
            </div>
            <div className="p-5 sm:p-6 rounded-xl bg-parchment-panel text-[15px] sm:text-[16px] leading-[1.9] sm:leading-[2.05] text-[#1f1309] font-parchment border border-[#bfa275] shadow-[0_2px_10px_rgba(70,40,15,0.06)]">
              {displayAppearance}
            </div>
          </div>

          <VintageDivider />

          {/* 4. Expanded Story Narrative */}
          <div className="space-y-2">
            <div className="border-l-4 border-[#6d411b] pl-3 py-0.5 text-xs sm:text-sm font-bold tracking-wide uppercase text-[#3e210a] font-parchment">
              <span>{t.storyDetail}</span>
            </div>
            <div className="p-5 sm:p-6 rounded-xl bg-parchment-panel text-[15px] sm:text-[16px] leading-[1.9] sm:leading-[2.1] text-[#1f1309] font-parchment border border-[#bfa275] shadow-[0_2px_10px_rgba(70,40,15,0.06)]">
              {displayExpandedStory.split(/\n\n+/).map((paragraph, pIdx) => (
                <p key={pIdx} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <VintageDivider />

          {/* 5. Folklore & Historical Context */}
          <div className="space-y-2">
            <div className="border-l-4 border-[#5a3818] pl-3 py-0.5 text-xs sm:text-sm font-bold tracking-wide uppercase text-[#3e210a] font-parchment">
              <span>{t.folkloreHistory}</span>
            </div>
            <div className="p-5 sm:p-6 rounded-xl bg-parchment-panel text-[15px] sm:text-[16px] leading-[1.9] sm:leading-[2.1] text-[#1f1309] font-parchment border border-[#bfa275] shadow-[0_2px_10px_rgba(70,40,15,0.06)]">
              {history.split(/\n\n+/).map((paragraph, pIdx) => (
                <p key={pIdx} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <VintageDivider />

          {/* 6. Ancient Taboos & Survival Warnings */}
          <div className="space-y-2">
            <div className="border-l-4 border-[#8b2b1a] pl-3 py-0.5 text-xs sm:text-sm font-bold tracking-wide uppercase text-[#4a1206] font-parchment">
              <span>
                {language === 'th'
                  ? 'ข้อห้ามโบราณและวิธีเอาชีวิตรอด (Taboos & Survival Rules)'
                  : 'Ancient Taboos & Survival Protocol'}
              </span>
            </div>
            <div className="space-y-2.5">
              {displayTaboos.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-[#fff4ed] border border-[#d99882] text-xs sm:text-[14px] text-[#4a1206] leading-relaxed shadow-sm font-parchment"
                >
                  <span className="font-mono text-[#6b1c0b] font-bold text-xs bg-[#f0cfc5] px-2.5 py-0.5 rounded border border-[#b9573f] shrink-0 mt-0.5">
                    0{idx + 1}
                  </span>
                  <span className="flex-1">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative px-6 py-4 border-t-2 border-[#6d411b]/40 bg-[#eedbb8]/90 flex items-center justify-between text-xs text-[#4a2e16] z-10">
          <span className="font-mono text-[11px] text-[#5a3818] font-semibold">
            LAT {pin.lat.toFixed(4)}° • LNG {pin.lng.toFixed(4)}°
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-b from-[#6b421d] to-[#42250d] hover:from-[#573415] hover:to-[#311a08] border-2 border-[#94693a] text-[#fbf5e8] font-bold font-parchment shadow-md transition-all cursor-pointer"
          >
            {t.close}
          </button>
        </div>
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
                onError={handleImageError}
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

import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Search,
  Ghost,
  Skull,
  BookOpen,
  Sparkles,
  Flame,
  X,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GhostCategory, GhostPin, SupportedLanguage } from '../../types/ghost';
import { getTranslation } from '../../lib/i18n';
import type { RagSearchResponse } from '../../lib/vectorRagSearch';
import { SUGGESTED_RAG_QUERIES } from '../../lib/vectorRagSearch';

interface NavbarProps {
  language: SupportedLanguage;
  onToggleLanguage: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: GhostCategory | 'all';
  onSelectCategory: (cat: GhostCategory | 'all') => void;
  onOpenAdmin: () => void;
  onZoomOut: () => void;
  ragResponse: RagSearchResponse;
  onSelectPin: (pin: GhostPin) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenAdmin,
  onZoomOut,
  ragResponse,
  onSelectPin,
}) => {
  const t = getTranslation(language);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const secretTapCountRef = useRef(0);
  const secretTapTimerRef = useRef<number | null>(null);

  // Secret 5-tap trigger on the logo to open Admin Portal (invisible to regular visitors)
  const handleSecretLogoClick = () => {
    secretTapCountRef.current += 1;
    if (secretTapTimerRef.current) {
      window.clearTimeout(secretTapTimerRef.current);
    }
    if (secretTapCountRef.current >= 5) {
      secretTapCountRef.current = 0;
      onOpenAdmin();
      return;
    }
    secretTapTimerRef.current = window.setTimeout(() => {
      secretTapCountRef.current = 0;
    }, 2000);
  };

  // Close RAG dropdown when clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: Array<{ id: GhostCategory | 'all'; label: string }> = [
    { id: 'all', label: t.allCategories },
    { id: 'ghost', label: t.categories.ghost },
    { id: 'curse', label: t.categories.curse },
    { id: 'legend', label: t.categories.legend },
    { id: 'sacred', label: t.categories.sacred },
    { id: 'monster', label: t.categories.monster },
  ];

  const categoryIcons: Record<string, LucideIcon> = {
    all: Compass,
    ghost: Ghost,
    curse: Skull,
    legend: BookOpen,
    sacred: Sparkles,
    monster: Flame,
  };

  const categorySigils: Record<string, string> = {
    all: '/icons/sigil_all.png',
    ghost: '/icons/sigil_ghost.png',
    curse: '/icons/sigil_curse.png',
    legend: '/icons/sigil_legend.png',
    sacred: '/icons/sigil_sacred.png',
    monster: '/icons/sigil_monster.png',
  };

  const suggestedQueries =
    language === 'th' ? SUGGESTED_RAG_QUERIES.th : SUGGESTED_RAG_QUERIES.en;

  const showDropdown = isSearchFocused;

  return (
    <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none p-4 md:p-6 flex flex-col gap-3">
      {/* Top Main Bar */}
      <div className="flex items-center justify-between gap-3 pointer-events-auto">
        {/* Brand / Title (Transparent Background + Custom Emblem Logo; Secret 5-tap opens Admin Portal) */}
        <div
          onClick={handleSecretLogoClick}
          className="flex items-center gap-3 shrink-0 select-none cursor-default"
        >
          <img
            src="/logo.png"
            alt="World of Mystery Logo"
            className="w-11 h-11 object-contain drop-shadow-[0_0_14px_rgba(16,185,129,0.65)] animate-pulse [animation-duration:4s]"
          />
          <h1 className="font-grimoire text-lg md:text-2xl font-bold text-amber-50 tracking-wider drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            World of Mystery
          </h1>
        </div>

        {/* Lore & Mystery Semantic Search Bar */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 max-w-xs md:max-w-lg hidden md:block"
        >
          <div className="relative flex items-center">
            <Sparkles className="w-4 h-4 absolute left-3.5 text-emerald-400/70 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim().toLowerCase() === '/admin') {
                  e.preventDefault();
                  onSearchChange('');
                  setIsSearchFocused(false);
                  onOpenAdmin();
                }
              }}
              placeholder={
                language === 'th'
                  ? 'ค้นหาตำนาน ผี หรือบรรยากาศ (เช่น วิญญาณในน้ำ, ป่าหิมะ, คำสาป)...'
                  : 'Search legends, spirits, or themes (e.g. water ghosts, snow forest)...'
              }
              className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-slate-950/85 border border-emerald-500/40 backdrop-blur-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-[0_0_25px_rgba(16,185,129,0.15)]"
            />

            {/* Clear Button & Search Magnifier Button */}
            <div className="absolute right-2 flex items-center gap-1.5">
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setIsSearchFocused(true);
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsSearchFocused(true);
                  inputRef.current?.focus();
                }}
                aria-label={language === 'th' ? 'ค้นหาเรื่องเล่า' : 'Search folklore'}
                title={language === 'th' ? 'ค้นหาเรื่องเล่า' : 'Search folklore'}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/25 to-teal-600/30 hover:from-emerald-500/40 hover:to-teal-500/45 text-emerald-300 hover:text-white border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)] flex items-center justify-center cursor-pointer active:scale-95"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Suggestions & Results Dropdown Panel */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-slate-950/95 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(16,185,129,0.15)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {!searchQuery.trim() ? (
                /* Suggested Semantic Lore Themes */
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800/80">
                    <span className="text-xs font-semibold tracking-wide text-emerald-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      {language === 'th'
                        ? 'สำรวจตามธีมและเรื่องเล่ายอดนิยม'
                        : 'Explore Popular Themes & Lore'}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-emerald-400/80" />
                      {language === 'th' ? 'แตะเพื่อค้นหาทันที' : 'Tap to explore'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedQueries.map((prompt) => {
                      const match = prompt.match(/^([^\s]+)\s+(.+)$/);
                      const emoji = match ? match[1] : '🔮';
                      const text = match ? match[2] : prompt;

                      return (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => {
                            onSearchChange(text);
                            setIsSearchFocused(true);
                          }}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs bg-slate-900/85 hover:bg-emerald-950/60 text-slate-200 hover:text-emerald-200 border border-slate-800/80 hover:border-emerald-500/50 transition-all text-left group shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.18)] cursor-pointer active:scale-[0.98]"
                        >
                          <span className="text-base shrink-0 group-hover:scale-115 transition-transform duration-200">
                            {emoji}
                          </span>
                          <span className="font-medium leading-tight">
                            {text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Summary + Matching Stories */
                <div className="max-h-[70vh] flex flex-col">
                  {/* Lore Summary Banner */}
                  <div className="p-3.5 bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-slate-950 border-b border-emerald-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        {language === 'th'
                          ? 'สรุปเรื่องเล่าและบริบทที่เกี่ยวข้อง'
                          : 'Folklore Overview & Context'}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-400/90">
                        {ragResponse.results.length}{' '}
                        {language === 'th' ? 'เรื่องเล่าที่พบ' : 'stories found'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {ragResponse.ragSummary}
                    </p>
                  </div>

                  {/* Matching Stories List */}
                  {ragResponse.results.length > 0 && (
                    <div className="overflow-y-auto divide-y divide-slate-800/60 max-h-80">
                      {ragResponse.results.slice(0, 6).map((item) => {
                        const pin = item.pin;
                        const title = language === 'th' ? pin.title_th : pin.title_en;
                        const province =
                          language === 'th' ? pin.province_th : pin.province_en;
                        const matchPercent = Math.round(item.score * 100);
                        const CatIcon = categoryIcons[pin.category] || Ghost;

                        return (
                          <button
                            key={pin.id}
                            type="button"
                            onClick={() => {
                              onSelectPin(pin);
                              setIsSearchFocused(false);
                            }}
                            className="w-full p-3.5 text-left hover:bg-emerald-950/30 transition-colors flex items-start justify-between gap-3 group cursor-pointer"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 group-hover:bg-emerald-500/20 group-hover:border-emerald-400 transition-colors">
                                <CatIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                                    {title}
                                  </h3>
                                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400/90">
                                    <MapPin className="w-3 h-3" />
                                    {province}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                                  {item.matchedSnippet}
                                </p>
                                {item.matchedConceptTags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {item.matchedConceptTags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end shrink-0 gap-1">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                {matchPercent}% {language === 'th' ? 'ตรงกัน' : 'Match'}
                              </span>
                              <span className="text-[11px] text-slate-500 group-hover:text-emerald-400 flex items-center gap-0.5 transition-colors">
                                {language === 'th' ? 'บินไปดู' : 'Fly to'}
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls (Mystical Talisman Buttons) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Zoom-Out To World View */}
          <button
            onClick={onZoomOut}
            aria-label={t.zoomOutWorld}
            title={t.zoomOutWorld}
            className="group px-3.5 py-2 rounded-2xl bg-[#070c16]/90 border border-amber-500/35 hover:border-emerald-400/70 backdrop-blur-xl text-amber-100/90 hover:text-emerald-200 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.85),0_0_15px_rgba(16,185,129,0.12)] hover:shadow-[0_0_22px_rgba(16,185,129,0.35)] flex items-center gap-2 text-xs font-sans tracking-wide cursor-pointer active:scale-95"
          >
            <img
              src="/icons/sigil_world.png"
              alt=""
              className="w-6 h-6 object-contain group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="hidden sm:inline font-semibold">{t.zoomOutWorld}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="group px-3.5 py-2 rounded-2xl bg-[#070c16]/90 border border-amber-500/35 hover:border-emerald-400/70 backdrop-blur-xl text-xs font-sans font-bold tracking-wider text-amber-100 hover:text-emerald-200 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.85),0_0_15px_rgba(16,185,129,0.12)] hover:shadow-[0_0_22px_rgba(16,185,129,0.35)] flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <img
              src="/icons/sigil_lang.png"
              alt=""
              className="w-6 h-6 object-contain group-hover:scale-110 transition-transform duration-300"
            />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Strip (Occult Sigil Medallions) */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 pointer-events-auto">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const sigilUrl = categorySigils[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              aria-label={cat.label}
              title={cat.label}
              className={`group relative w-12 h-12 rounded-2xl border backdrop-blur-xl transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 focus:outline-none ${
                isSelected
                  ? 'bg-gradient-to-b from-emerald-950/95 via-[#071f1b] to-[#041014] border-amber-400/80 shadow-[0_0_24px_rgba(16,185,129,0.55),inset_0_0_12px_rgba(251,191,36,0.25)] scale-105'
                  : 'bg-[#070c16]/85 border-amber-500/25 hover:border-emerald-400/60 shadow-[0_6px_18px_rgba(0,0,0,0.8)] hover:scale-105'
              }`}
            >
              {/* Subtle corner rune accent */}
              {isSelected && (
                <span className="pointer-events-none absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] animate-ping" />
              )}
              <img
                src={sigilUrl}
                alt={cat.label}
                className={`w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110 ${
                  isSelected
                    ? 'drop-shadow-[0_0_10px_rgba(52,211,153,0.85)]'
                    : 'opacity-85 group-hover:opacity-100'
                }`}
              />
            </button>
          );
        })}
      </div>
    </header>
  );
};

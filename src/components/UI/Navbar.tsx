import React from 'react';
import {
  Compass,
  Volume2,
  VolumeX,
  Languages,
  ShieldCheck,
  Search,
  Lock,
} from 'lucide-react';
import type { GhostCategory, SupportedLanguage } from '../../types/ghost';
import { getTranslation } from '../../lib/i18n';

interface NavbarProps {
  language: SupportedLanguage;
  onToggleLanguage: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: GhostCategory | 'all';
  onSelectCategory: (cat: GhostCategory | 'all') => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  isMuted,
  onToggleMute,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenAdmin,
}) => {
  const t = getTranslation(language);

  const categories: Array<{ id: GhostCategory | 'all'; label: string }> = [
    { id: 'all', label: t.allCategories },
    { id: 'ghost', label: t.categories.ghost },
    { id: 'curse', label: t.categories.curse },
    { id: 'legend', label: t.categories.legend },
    { id: 'sacred', label: t.categories.sacred },
    { id: 'monster', label: t.categories.monster },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none p-4 md:p-6 flex flex-col gap-3">
      {/* Top Main Bar */}
      <div className="flex items-center justify-between gap-3 pointer-events-auto">
        {/* Brand / Title */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md shadow-2xl">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Compass className="w-5 h-5 animate-spin [animation-duration:15s]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>{t.appTitle}</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                3D Globe
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs md:max-w-md hidden md:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all shadow-lg"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* PDPA Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-xs text-amber-400/90 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{t.maxZoomNotice}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? t.unmute : t.mute}
            className={`p-2.5 rounded-xl border backdrop-blur-md transition-all shadow-lg flex items-center gap-2 text-xs font-medium ${
              isMuted
                ? 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMuted ? t.mute : t.soundTuning}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 backdrop-blur-md text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-lg flex items-center gap-1.5"
          >
            <Languages className="w-4 h-4 text-emerald-400" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            aria-label={t.adminLogin}
            className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 backdrop-blur-md text-slate-300 hover:text-emerald-300 transition-all shadow-lg flex items-center gap-1.5 text-xs font-medium"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">{t.adminLogin}</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pointer-events-auto">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all backdrop-blur-md shadow-md border ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800/80 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

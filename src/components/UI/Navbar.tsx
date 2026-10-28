import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Search,
  Ghost,
  Skull,
  BookOpen,
  ScrollText,
  Crown,
  Flame,
  X,
  MapPin,
  ArrowUpRight,
  ChevronDown,
  Check,
  Layers,
  Filter,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GhostCategory, GhostPin, SupportedLanguage } from '../../types/ghost';
import { getTranslation, LANGUAGE_OPTIONS } from '../../lib/i18n';
import type { RagSearchResponse } from '../../lib/vectorRagSearch';
import { SUGGESTED_RAG_QUERIES } from '../../lib/vectorRagSearch';

export interface MarkerStyleDefinition {
  id: GhostCategory | 'all';
  color: string;
  glow: string;
  bgGradient: string;
  labelTh: string;
  labelEn: string;
  hintTh: string;
  hintEn: string;
  iconSvg: string;
}

export const MARKER_DEFINITIONS: Record<GhostCategory | 'all', MarkerStyleDefinition> = {
  all: {
    id: 'all',
    color: '#34d399',
    glow: 'rgba(52, 211, 153, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #34d399 0%, #0f766e 65%, #042f2e 100%)',
    labelTh: 'ทั้งหมด',
    labelEn: 'All',
    hintTh: 'แสดงหมุดทุกสีบนลูกโลก',
    hintEn: 'Show all markers on globe',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  },
  ghost: {
    id: 'ghost',
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #38bdf8 0%, #0284c7 65%, #082f49 100%)',
    labelTh: 'วิญญาณและผีพราย',
    labelEn: 'Ghosts & Apparitions',
    hintTh: 'หมุดสีฟ้า (Spirits & Phantoms)',
    hintEn: 'Cyan Pins (Spirits)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="M12 2a7 7 0 0 0-7 7v9l3-2 3 2 3-2 3 2 2-2V9a7 7 0 0 0-7-7z"/><circle cx="9" cy="9" r="1.2" fill="#ffffff"/><circle cx="15" cy="9" r="1.2" fill="#ffffff"/></svg>`,
  },
  monster: {
    id: 'monster',
    color: '#ff2a5f',
    glow: 'rgba(255, 42, 95, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #ff2a5f 0%, #be123c 65%, #4c0519 100%)',
    labelTh: 'อมนุษย์และสัตว์ประหลาด',
    labelEn: 'Monsters & Mythical Beasts',
    hintTh: 'หมุดสีแดง (Beasts & Cryptids)',
    hintEn: 'Crimson Pins (Beasts)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  },
  curse: {
    id: 'curse',
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #c084fc 0%, #7e22ce 65%, #3b0764 100%)',
    labelTh: 'คุณไสยและคำสาป',
    labelEn: 'Curses & Occult Lore',
    hintTh: 'หมุดสีม่วง (Curses & Sorcery)',
    hintEn: 'Violet Pins (Occult)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><circle cx="9" cy="12" r="1.3" fill="#ffffff"/><circle cx="15" cy="12" r="1.3" fill="#ffffff"/><path d="M8 20v2h8v-2"/><path d="M16 20a3 3 0 0 0 1.5-2.6 6 6 0 1 0-11 0A3 3 0 0 0 8 20z"/></svg>`,
  },
  sacred: {
    id: 'sacred',
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.9)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #fde047 0%, #d97706 65%, #451a03 100%)',
    labelTh: 'สิ่งศักดิ์สิทธิ์และทวยเทพ',
    labelEn: 'Sacred Guardians & Deities',
    hintTh: 'หมุดสีทอง (Deities & Relics)',
    hintEn: 'Gold Pins (Sacred)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="m12 2 2.6 6.2L21 11l-5 4.5 1.5 6.5L12 18.5 6.5 22 8 15.5 3 11l6.4-2.8z"/></svg>`,
  },
  legend: {
    id: 'legend',
    color: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #34d399 0%, #059669 65%, #022c22 100%)',
    labelTh: 'ตำนานพื้นบ้านลึกลับ',
    labelEn: 'Folklore & Ancient Legends',
    hintTh: 'หมุดสีเขียว (Ancient Lore & Tales)',
    hintEn: 'Emerald Pins (Legends)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
  },
};

export const GlobeDiamondBadge: React.FC<{
  styleDef: MarkerStyleDefinition;
  isSelected?: boolean;
  size?: 'sm' | 'md';
}> = ({ styleDef, isSelected = false, size = 'md' }) => {
  const outerSize = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';
  const diamondSize = size === 'sm' ? 'w-4 h-4 rounded-[4px]' : 'w-5 h-5 rounded-[5px]';

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${outerSize}`}>
      {isSelected && (
        <span
          className="absolute inset-0 rounded-full opacity-60 blur-[1px] animate-ping"
          style={{ backgroundColor: styleDef.color }}
        />
      )}
      <div
        className={`relative flex items-center justify-center rotate-45 transition-transform duration-200 ${diamondSize}`}
        style={{
          background: styleDef.bgGradient,
          border: `1.8px solid ${isSelected ? '#ffffff' : styleDef.color}`,
          boxShadow: `0 0 12px ${styleDef.glow}, 0 2px 6px rgba(0,0,0,0.85)`,
        }}
      >
        <div
          className="-rotate-45 flex items-center justify-center filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
          dangerouslySetInnerHTML={{ __html: styleDef.iconSvg }}
        />
      </div>
    </div>
  );
};

interface NavbarProps {
  language: SupportedLanguage;
  onToggleLanguage: () => void;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: GhostCategory | 'all';
  onSelectCategory: (cat: GhostCategory | 'all') => void;
  onOpenAdmin: () => void;
  onZoomOut: () => void;
  ragResponse: RagSearchResponse;
  onSelectPin: (pin: GhostPin) => void;
  pins?: GhostPin[];
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  onSelectLanguage,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenAdmin,
  onZoomOut,
  ragResponse,
  onSelectPin,
  pins = [],
}) => {
  const t = getTranslation(language);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchInput = (val: string) => {
    setLocalQuery(val);
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    // 150ms debounce: provides instant responsiveness while preventing main-thread lag
    debounceTimerRef.current = window.setTimeout(() => {
      onSearchChange(val);
    }, 150);
  };

  const handleSearchCommit = (val: string) => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    setLocalQuery(val);
    onSearchChange(val);
  };

  const handleSearchClear = () => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    setLocalQuery('');
    onSearchChange('');
  };
  const langMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const secretTapCountRef = useRef(0);
  const secretTapTimerRef = useRef<number | null>(null);

  // Dogecoin donation (address shared with QRzip project)
  const DOGE_ADDRESS = 'D8QcXwSdCwXiqvU7x4jeYBHnJVze7a5yxb';
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [dogeCopied, setDogeCopied] = useState(false);
  const handleCopyDoge = () => {
    navigator.clipboard?.writeText(DOGE_ADDRESS).catch(() => {});
    setDogeCopied(true);
    window.setTimeout(() => setDogeCopied(false), 1800);
  };

  // Real-time Live Online Explorers counter connected to Cloudflare D1 Presence API
  const [onlineCount, setOnlineCount] = useState<number>(1);

  useEffect(() => {
    let visitorId = '';
    try {
      visitorId = sessionStorage.getItem('wom_visitor_id') || '';
      if (!visitorId) {
        visitorId = 'v_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);
        sessionStorage.setItem('wom_visitor_id', visitorId);
      }
    } catch {
      visitorId = 'v_' + Date.now().toString(36);
    }

    const sendHeartbeat = async () => {
      try {
        const res = await fetch('/api/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorId }),
        });
        if (res.ok) {
          const data = (await res.json()) as { success?: boolean; onlineCount?: number };
          if (data && typeof data.onlineCount === 'number') {
            setOnlineCount(data.onlineCount);
          }
        }
      } catch {
        // Fallback to local 1 if network fails
      }
    };

    // Initial heartbeat
    sendHeartbeat();

    // Heartbeat every 20 seconds to renew active presence in D1
    const interval = window.setInterval(sendHeartbeat, 20000);

    const handleLeave = () => {
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/heartbeat/leave', JSON.stringify({ visitorId }));
        }
      } catch {}
    };

    window.addEventListener('beforeunload', handleLeave);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('beforeunload', handleLeave);
      handleLeave();
    };
  }, []);

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

  // Close RAG dropdown and Language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        mobileSearchContainerRef.current &&
        !mobileSearchContainerRef.current.contains(event.target as Node)
      ) {
        setIsMobileSearchFocused(false);
      }
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setIsLangMenuOpen(false);
      }
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const MARKER_LIST: MarkerStyleDefinition[] = [
    MARKER_DEFINITIONS.all,
    MARKER_DEFINITIONS.ghost,
    MARKER_DEFINITIONS.monster,
    MARKER_DEFINITIONS.curse,
    MARKER_DEFINITIONS.sacred,
    MARKER_DEFINITIONS.legend,
  ];

  const currentMarkerDef = MARKER_DEFINITIONS[selectedCategory] || MARKER_DEFINITIONS.all;

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: pins?.length || 0 };
    if (pins && pins.length > 0) {
      for (const p of pins) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    }
    return counts;
  }, [pins]);

  const categoryIcons: Record<string, LucideIcon> = {
    all: Compass,
    ghost: Ghost,
    curse: Skull,
    legend: BookOpen,
    sacred: Crown,
    monster: Flame,
  };

  const suggestedQueries =
    language === 'th' ? SUGGESTED_RAG_QUERIES.th : SUGGESTED_RAG_QUERIES.en;

  const showDropdown = isSearchFocused;

  const renderDropdownContent = (isMobile: boolean = false) => {
    if (!localQuery.trim()) {
      return (
        <div className="p-3.5 sm:p-4 text-xs font-parchment select-none">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#dfcfad]">
            <span className="font-bold tracking-wide text-[#3d2008] flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-[#7a4618]" />
              {language === 'th'
                ? 'สำรวจตามธีมและเรื่องเล่ายอดนิยม'
                : 'Explore Popular Themes & Lore'}
            </span>
            <span className="text-[11px] text-[#7a5430] flex items-center gap-1 font-medium">
              <Compass className="w-3 h-3 text-[#8b5a2b]" />
              {language === 'th' ? 'แตะเพื่อค้นหาทันที' : 'Tap to explore'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {suggestedQueries.map((prompt) => {
              const match = prompt.match(/^([^\s]+)\s+(.+)$/);
              const emoji = match ? match[1] : '📜';
              const text = match ? match[2] : prompt;

              return (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => {
                    handleSearchCommit(text);
                    if (isMobile) {
                      setIsMobileSearchFocused(true);
                      mobileInputRef.current?.focus();
                    } else {
                      setIsSearchFocused(true);
                      inputRef.current?.focus();
                    }
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs bg-[#fdfbf7] hover:bg-[#ebdcc0] text-[#3d2008] border border-[#cfb68a] transition-all text-left group shadow-sm hover:shadow-[0_2px_8px_rgba(70,40,15,0.08)] cursor-pointer active:scale-[0.98]"
                >
                  <span className="text-base shrink-0 group-hover:scale-115 transition-transform duration-200">
                    {emoji}
                  </span>
                  <span className="font-medium leading-tight text-[#2a1608]">
                    {text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="max-h-[65vh] flex flex-col font-parchment select-text">
        {/* Lore Summary Banner (Antique Ivory Parchment Style) */}
        <div className="p-3 sm:p-3.5 bg-gradient-to-b from-[#f5ebd4] to-[#f0e4cc] border-b-2 border-[#8b5a2b]/35 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#3e2008] flex items-center gap-1.5 uppercase tracking-wide">
              <ScrollText className="w-4 h-4 text-[#7a4618]" />
              {language === 'th'
                ? 'สรุปเรื่องเล่าและบริบทที่เกี่ยวข้อง'
                : 'Folklore Overview & Context'}
            </span>
            <span className="text-[11px] font-mono font-bold text-[#5c300f] bg-[#e6d3b8] px-2 py-0.5 rounded border border-[#b8956e]">
              {ragResponse.results.length}{' '}
              {language === 'th' ? 'เรื่องเล่าที่พบ' : 'stories found'}
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-[#2a1708] leading-relaxed font-parchment">
            {ragResponse.ragSummary}
          </p>
        </div>

        {/* Matching Stories List */}
        {ragResponse.results.length > 0 && (
          <div className="overflow-y-auto divide-y divide-[#e5d5b7] max-h-72 scrollbar-thin scrollbar-thumb-[#cfb68a]">
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
                    setIsMobileSearchFocused(false);
                    setIsMobileSearchOpen(false);
                  }}
                  className="w-full p-3 sm:p-3.5 text-left bg-[#fcf9f2] hover:bg-[#efe0c7] transition-colors flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#eadbbf] border border-[#a37947] flex items-center justify-center text-[#5a320f] shrink-0 mt-0.5 group-hover:bg-[#dfcaa8] group-hover:border-[#8b5a2b] transition-colors shadow-sm">
                      <CatIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-bold text-[#1f1106] group-hover:text-[#7a4013] transition-colors truncate">
                          {title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-[#785028] font-medium">
                          <MapPin className="w-3 h-3 text-[#99531d]" />
                          {province}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#52351c] line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed font-sans">
                        {item.matchedSnippet}
                      </p>
                      {item.matchedConceptTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 font-sans">
                          {item.matchedConceptTags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10px] font-medium bg-[#ecdbc2] text-[#4d2508] border border-[#c29c71]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="px-1.5 py-0.5 rounded text-[9.5px] sm:text-[10px] font-mono font-bold bg-[#dfcaa8] text-[#3d2008] border border-[#8b5a2b]">
                      {matchPercent}% {language === 'th' ? 'ตรงกัน' : 'Match'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#7a4618] group-hover:text-[#3d1e06] font-semibold flex items-center gap-0.5 transition-colors">
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
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none p-2.5 sm:p-4 md:p-6 flex flex-col gap-2.5 max-w-full">
      {/* Top Main Bar */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 pointer-events-auto w-full max-w-full">
        {/* Brand / Title (Transparent Background + Custom Emblem Logo; Secret 5-tap opens Admin Portal) */}
        <div
          onClick={handleSecretLogoClick}
          className="flex items-center gap-2 sm:gap-3 min-w-0 shrink select-none cursor-default"
        >
          <img
            src="/logo.png"
            alt="World of Mystery Logo"
            className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 object-contain drop-shadow-[0_0_14px_rgba(16,185,129,0.65)] animate-pulse [animation-duration:4s]"
          />
          <h1 className="font-grimoire text-sm sm:text-lg md:text-2xl font-bold text-amber-50 tracking-wide sm:tracking-wider truncate drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            World of Mystery
          </h1>
        </div>

        {/* Lore & Mystery Semantic Search Bar */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 max-w-xs md:max-w-lg hidden md:block"
        >
          <div className="relative flex items-center">
            <ScrollText className="w-4 h-4 absolute left-3.5 text-[#7a4618] pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => {
                handleSearchInput(e.target.value);
                setIsSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (localQuery.trim().toLowerCase() === '/admin') {
                    e.preventDefault();
                    handleSearchClear();
                    setIsSearchFocused(false);
                    onOpenAdmin();
                  } else {
                    handleSearchCommit(localQuery);
                  }
                }
              }}
              placeholder={
                language === 'th'
                  ? 'ค้นหาตำนาน ผี หรือบรรยากาศ (เช่น วิญญาณในน้ำ, ป่าหิมะ, คำสาป)...'
                  : 'Search legends, spirits, or themes (e.g. water ghosts, snow forest)...'
              }
              className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-[#fcf8ee]/50 border-2 border-[#8b5a2b]/70 hover:border-[#8b5a2b] focus:border-[#5a3818] focus:ring-2 focus:ring-[#8b5a2b]/25 backdrop-blur-md text-sm font-parchment font-semibold text-[#1e1005] placeholder-[#7d5635]/80 focus:outline-none transition-all shadow-[0_4px_20px_rgba(40,20,5,0.18)]"
            />

            {/* Clear Button & Search Magnifier Button */}
            <div className="absolute right-2 flex items-center gap-1.5">
              {localQuery.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    handleSearchClear();
                    setIsSearchFocused(true);
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="p-1.5 rounded-full hover:bg-[#ebdcc0]/60 text-[#7a4618] hover:text-[#3d2008] transition-colors cursor-pointer"
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
                className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#7a4618] to-[#4e2a0c] hover:from-[#6b3c14] hover:to-[#3e2008] text-[#fbf5e8] border border-[#a8743b] shadow-sm flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Suggestions & Results Dropdown Panel (2.5D Antique Ivory Scroll) */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-ivory-scroll border-2 border-[#8b5a2b] outline outline-1 outline-[#caa772]/60 -outline-offset-3 shadow-[0_22px_55px_rgba(0,0,0,0.5),0_0_30px_rgba(139,90,43,0.15)] overflow-hidden z-50 animate-parchment-unroll">
              {renderDropdownContent(false)}
            </div>
          )}
        </div>

        {/* Action Controls (Mystical Talisman Buttons) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchOpen((v) => {
                const next = !v;
                if (next) {
                  setTimeout(() => mobileInputRef.current?.focus(), 80);
                }
                return next;
              });
            }}
            aria-label={language === 'th' ? 'ค้นหา' : 'Search'}
            title={language === 'th' ? 'ค้นหาเรื่องเล่า' : 'Search folklore'}
            className={`md:hidden px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-[#070c16]/90 border backdrop-blur-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
              isMobileSearchOpen || localQuery.trim()
                ? 'border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                : 'border-amber-500/35 text-amber-200 hover:border-emerald-400/70 hover:text-white'
            }`}
          >
            {isMobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            <span className="hidden xs:inline text-[11px]">
              {language === 'th' ? 'ค้นหา' : 'Search'}
            </span>
          </button>

          {/* Live Current Online Explorers Counter */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#070c16]/90 border border-emerald-500/35 backdrop-blur-xl text-emerald-300 shadow-[0_6px_20px_rgba(0,0,0,0.85),0_0_15px_rgba(16,185,129,0.18)] select-none"
            title={language === 'th' ? `มีผู้สำรวจโลกเร้นลับออนไลน์อยู่ ${onlineCount} คนในขณะนี้` : `${onlineCount} occult explorers online right now`}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wide">
              <span className="font-mono text-emerald-200">{onlineCount}</span>{' '}
              <span className="hidden sm:inline text-emerald-400/90 font-medium">
                {language === 'th' ? 'คนออนไลน์' : 'Online'}
              </span>
            </span>
          </div>

          {/* Donate Doge (hover shows QR, click copies address) */}
          <div
            className="relative"
            onMouseEnter={() => setIsDonateOpen(true)}
            onMouseLeave={() => setIsDonateOpen(false)}
          >
            <button
              type="button"
              onClick={() => {
                handleCopyDoge();
                setIsDonateOpen((v) => !v);
              }}
              title={language === 'th' ? 'คลิกเพื่อคัดลอกที่อยู่ Dogecoin' : 'Click to copy Dogecoin address'}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#070c16]/90 border border-amber-400/50 hover:border-amber-300 backdrop-blur-xl text-amber-300 hover:text-amber-200 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.85),0_0_15px_rgba(246,195,67,0.18)] hover:shadow-[0_0_22px_rgba(246,195,67,0.45)] flex items-center gap-1.5 sm:gap-2 text-xs font-sans font-semibold tracking-wide cursor-pointer active:scale-95"
            >
              <span className="text-base leading-none">🐕</span>
              <span className="hidden sm:inline">
                {dogeCopied
                  ? language === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'
                  : language === 'th' ? 'โดเนท Doge' : 'Donate Doge'}
              </span>
            </button>

            {isDonateOpen && (
              <div className="absolute right-0 top-full mt-2 z-[1000] w-56 p-3 rounded-2xl bg-[#070c16]/97 border border-amber-400/50 shadow-[0_12px_36px_rgba(0,0,0,0.9),0_0_24px_rgba(246,195,67,0.25)] backdrop-blur-xl animate-in fade-in duration-150">
                <p className="text-[11px] text-amber-200 font-semibold text-center mb-2">
                  {language === 'th' ? '☕ สนับสนุนผู้พัฒนาด้วย Dogecoin' : '☕ Support the creator with Dogecoin'}
                </p>
                <img
                  src="/doge_qr.jpg"
                  alt="Dogecoin QR"
                  className="w-full rounded-xl bg-white"
                />
                <button
                  type="button"
                  onClick={handleCopyDoge}
                  className="mt-2 w-full px-2 py-1.5 rounded-lg bg-black/60 border border-slate-700 hover:border-amber-400/60 text-[9.5px] font-mono text-slate-300 break-all cursor-pointer transition-colors"
                  title={language === 'th' ? 'คลิกเพื่อคัดลอก' : 'Click to copy'}
                >
                  {DOGE_ADDRESS}
                </button>
                <p className="mt-1 text-[10px] text-center text-emerald-300 h-3">
                  {dogeCopied ? (language === 'th' ? '✓ คัดลอกที่อยู่แล้ว' : '✓ Address copied') : ''}
                </p>
              </div>
            )}
          </div>

          {/* Zoom-Out / Reset View */}
          <button
            onClick={onZoomOut}
            aria-label={t.zoomOutWorld}
            title={t.zoomOutWorld}
            className="group px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#070c16]/90 border border-amber-500/35 hover:border-emerald-400/70 backdrop-blur-xl text-amber-100/90 hover:text-emerald-200 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.85),0_0_15px_rgba(16,185,129,0.12)] hover:shadow-[0_0_22px_rgba(16,185,129,0.35)] flex items-center gap-1.5 sm:gap-2 text-xs font-sans tracking-wide cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300 group-hover:text-emerald-300 group-hover:-rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline font-semibold">{t.zoomOutWorld}</span>
          </button>

          {/* Multi-Language Switcher Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setIsLangMenuOpen((v) => !v)}
              className="group px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-[#070c16]/90 border border-amber-500/35 hover:border-emerald-400/70 backdrop-blur-xl text-xs font-sans font-bold tracking-wider text-amber-100 hover:text-emerald-200 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.85),0_0_15px_rgba(16,185,129,0.12)] hover:shadow-[0_0_22px_rgba(16,185,129,0.35)] flex items-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95"
              title="Select Language / เลือกภาษา"
            >
              <img
                src="/icons/sigil_lang.png"
                alt=""
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain group-hover:scale-110 transition-transform duration-300"
              />
              <span>{language.toUpperCase()}</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 top-full mt-2 z-[1000] w-48 py-2 rounded-2xl bg-[#070c16]/97 border border-amber-500/45 shadow-[0_14px_40px_rgba(0,0,0,0.92),0_0_24px_rgba(16,185,129,0.25)] backdrop-blur-2xl animate-in fade-in duration-150 max-h-80 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-amber-300/80 border-b border-slate-800/80 mb-1">
                  🌐 Language / ภาษา
                </div>
                {LANGUAGE_OPTIONS.map((opt) => {
                  const active = language === opt.code;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        if (onSelectLanguage) {
                          onSelectLanguage(opt.code);
                        } else {
                          onToggleLanguage();
                        }
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        active
                          ? 'bg-emerald-500/20 text-emerald-200 font-bold'
                          : 'text-slate-200 hover:bg-white/5 hover:text-amber-200'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm">{opt.flag}</span>
                        <span>{opt.label}</span>
                      </span>
                      <span className="text-[10px] font-mono opacity-75">
                        {active ? '✓ ' : ''}
                        {opt.short}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Expansion Panel */}
      {isMobileSearchOpen && (
        <div
          ref={mobileSearchContainerRef}
          className="relative w-full md:hidden pointer-events-auto animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="relative flex items-center">
            <ScrollText className="w-4 h-4 absolute left-3.5 text-[#7a4618] pointer-events-none" />
            <input
              ref={mobileInputRef}
              type="text"
              value={localQuery}
              onFocus={() => setIsMobileSearchFocused(true)}
              onChange={(e) => {
                handleSearchInput(e.target.value);
                setIsMobileSearchFocused(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (localQuery.trim().toLowerCase() === '/admin') {
                    e.preventDefault();
                    handleSearchClear();
                    setIsMobileSearchFocused(false);
                    setIsMobileSearchOpen(false);
                    onOpenAdmin();
                  } else {
                    handleSearchCommit(localQuery);
                  }
                }
              }}
              placeholder={
                language === 'th'
                  ? 'ค้นหาตำนาน ผี หรือบรรยากาศ...'
                  : 'Search legends, spirits, or themes...'
              }
              className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-[#fcf8ee]/50 border-2 border-[#8b5a2b]/70 hover:border-[#8b5a2b] focus:border-[#5a3818] focus:ring-2 focus:ring-[#8b5a2b]/25 backdrop-blur-md text-xs sm:text-sm font-parchment font-semibold text-[#1e1005] placeholder-[#7d5635]/80 focus:outline-none transition-all shadow-[0_4px_20px_rgba(40,20,5,0.18)]"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              {localQuery.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    handleSearchClear();
                    setIsMobileSearchFocused(true);
                    mobileInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="p-1.5 rounded-full hover:bg-[#ebdcc0]/60 text-[#7a4618] hover:text-[#3d2008] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchFocused(true);
                  mobileInputRef.current?.focus();
                }}
                className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#7a4618] to-[#4e2a0c] hover:from-[#6b3c14] hover:to-[#3e2008] text-[#fbf5e8] border border-[#a8743b] shadow-sm flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Panel (2.5D Antique Ivory Scroll) */}
          {isMobileSearchFocused && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-ivory-scroll border-2 border-[#8b5a2b] outline outline-1 outline-[#caa772]/60 -outline-offset-3 shadow-[0_25px_60px_rgba(0,0,0,0.65),0_0_30px_rgba(139,90,43,0.2)] overflow-hidden z-[1100] max-h-[65vh] overflow-y-auto animate-parchment-unroll">
              {renderDropdownContent(true)}
            </div>
          )}
        </div>
      )}

      {/* Mystical Category Filter: Vertical Dropdown with Globe Diamond Markers & Descriptive Text */}
      <div className="relative pointer-events-auto self-start" ref={filterRef}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsFilterOpen((v) => !v)}
          className={`group px-3 py-2 rounded-2xl border backdrop-blur-2xl transition-all duration-300 flex items-center gap-2.5 cursor-pointer active:scale-95 shadow-[0_8px_24px_rgba(0,0,0,0.85)] ${
            isFilterOpen
              ? 'bg-[#071a17]/95 border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.35)]'
              : 'bg-[#070c16]/92 border-amber-500/40 hover:border-emerald-400/80 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]'
          }`}
          title={language === 'th' ? 'เลือกหมวดหมู่ตำนาน (ตัวกรองแนวตั้ง)' : 'Select folklore category'}
          aria-expanded={isFilterOpen}
        >
          <GlobeDiamondBadge
            styleDef={currentMarkerDef}
            isSelected={selectedCategory !== 'all'}
            size="md"
          />
          <div className="flex flex-col text-left pr-1">
            <span className="text-[9.5px] uppercase font-bold tracking-wider text-amber-300/80 flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-400" />
              {language === 'th' ? 'ตัวกรองหมวดหมู่' : 'Category Filter'}
            </span>
            <span className="text-xs font-bold text-slate-100 group-hover:text-emerald-200 transition-colors">
              {language === 'th' ? currentMarkerDef.labelTh : currentMarkerDef.labelEn}
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-amber-300/90 ml-0.5 transition-transform duration-300 ${
              isFilterOpen ? 'rotate-180 text-emerald-400' : ''
            }`}
          />
        </button>

        {/* Vertical Dropdown Panel */}
        {isFilterOpen && (
          <div className="absolute left-0 top-full mt-2 z-[1000] w-72 sm:w-84 p-2.5 rounded-2xl bg-[#070c16]/98 border border-amber-500/45 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(16,185,129,0.25)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col gap-1.5 max-h-[80vh] overflow-y-auto">
            {/* Header info explaining symbols */}
            <div className="px-3 py-1.5 border-b border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'th' ? 'สัญลักษณ์หมุดบนลูกโลก' : 'Globe Marker Legend'}
              </span>
              <span className="text-[10px] text-slate-400">
                {language === 'th' ? 'แตะเพื่อเลือก' : 'Tap to filter'}
              </span>
            </div>

            {/* Vertical list of categories */}
            {MARKER_LIST.map((item) => {
              const isSelected = selectedCategory === item.id;
              const count = categoryCounts[item.id] || 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory(item.id);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-950/90 via-[#07241e] to-slate-900 border border-emerald-400/80 shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                      : 'hover:bg-slate-900/90 border border-transparent hover:border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GlobeDiamondBadge styleDef={item} isSelected={isSelected} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected ? 'text-emerald-200' : 'text-slate-100 group-hover:text-amber-200'
                          }`}
                        >
                          {language === 'th' ? item.labelTh : item.labelEn}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 truncate mt-0.5">
                        {language === 'th' ? item.hintTh : item.hintEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {count > 0 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-black/50 text-slate-300 border border-slate-700/60">
                        {count}
                      </span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                </button>
              );
            })}

            {/* Privacy coordinate offset disclaimer */}
            <div className="mt-1 pt-2 border-t border-slate-800/80 px-2.5 py-1.5 flex items-start gap-2 rounded-lg bg-slate-900/60 text-[10px] text-slate-400 leading-snug">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {language === 'th'
                  ? 'หมุดไม่ได้ปักลงบนพื้นที่จริง มีการปรับเยื้องเล็กน้อยเพื่อป้องกันข้อมูลส่วนบุคคล'
                  : 'Pins are not placed on exact physical properties; coordinates are slightly offset to protect privacy.'}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

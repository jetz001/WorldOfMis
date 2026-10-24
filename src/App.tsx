import { useState, useEffect, useMemo, useCallback } from 'react';
import type { GhostPin, GhostCategory, SupportedLanguage } from './types/ghost';
import { fetchPins, createPin, updatePin, deletePin } from './lib/api';
import { GhostGlobe } from './components/Globe/GhostGlobe';
import { Navbar } from './components/UI/Navbar';
import { StoryDrawer } from './components/UI/StoryDrawer';
import { AdminPortal } from './components/Admin/AdminPortal';
import { BookOpen, ChevronUp, Sparkles } from 'lucide-react';
import { getTranslation } from './lib/i18n';

export function App() {
  const [pins, setPins] = useState<GhostPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<GhostPin | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('th');
  const [selectedCategory, setSelectedCategory] = useState<GhostCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [worldViewSignal, setWorldViewSignal] = useState(0);
  const t = getTranslation(language);

  // Load pins & set initial selected pin
  useEffect(() => {
    fetchPins().then((data) => {
      setPins(data);
      if (data.length > 0 && !selectedPin) {
        setSelectedPin(data[0]);
      }
    });
  }, []);

  const handleToggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'th' ? 'en' : 'th'));
  }, []);

  const handleZoomOutToWorld = useCallback(() => {
    setWorldViewSignal((prev) => prev + 1);
    // NOTE: keep the selected pin so the Now Playing story indicator
    // remains available after zooming back out to the world view.
    setIsDrawerOpen(false);
  }, []);

  const handleSelectPin = useCallback((pin: GhostPin) => {
    setSelectedPin(pin);
    // Open the story drawer (Now Playing popup) whenever a pin is selected
    setIsDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // Filter pins based on category & search query
  const filteredPins = useMemo(() => {
    return pins.filter((pin) => {
      // Category filter
      if (selectedCategory !== 'all' && pin.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle =
          pin.title_th.toLowerCase().includes(q) || pin.title_en.toLowerCase().includes(q);
        const matchProvince =
          pin.province_th.toLowerCase().includes(q) ||
          pin.province_en.toLowerCase().includes(q);
        const matchDistrict =
          (pin.district_th && pin.district_th.toLowerCase().includes(q)) ||
          (pin.district_en && pin.district_en.toLowerCase().includes(q));
        return matchTitle || matchProvince || matchDistrict;
      }
      return true;
    });
  }, [pins, selectedCategory, searchQuery]);

  // Admin CRUD Handlers
  const handleAddPin = async (newPin: GhostPin) => {
    const created = await createPin(newPin);
    setPins((prev) => [created, ...prev]);
  };

  const handleUpdatePin = async (updatedPin: GhostPin) => {
    await updatePin(updatedPin);
    setPins((prev) => prev.map((p) => (p.id === updatedPin.id ? updatedPin : p)));
    if (selectedPin?.id === updatedPin.id) {
      setSelectedPin(updatedPin);
    }
  };

  const handleDeletePin = async (id: string) => {
    await deletePin(id);
    setPins((prev) => prev.filter((p) => p.id !== id));
    if (selectedPin?.id === id) {
      setIsDrawerOpen(false);
      setSelectedPin(null);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#03060c] text-slate-100 flex flex-col">
      {/* Top Navigation & HUD */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onZoomOut={handleZoomOutToWorld}
      />

      {/* Main 3D Three.js Earth Scene */}
      <main className="flex-1 w-full h-full">
        <GhostGlobe
          pins={filteredPins}
          selectedPin={selectedPin}
          onSelectPin={handleSelectPin}
          language={language}
          worldViewSignal={worldViewSignal}
        />
      </main>

      {/* Prominent Story Indicator (Replaces RadioGardenPlayer) */}
      {selectedPin && !isDrawerOpen && (
        <aside
          aria-label="Story indicator"
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-20 pointer-events-auto animate-in fade-in zoom-in slide-in-from-bottom-6 duration-700 ease-out"
        >
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="group relative flex items-center gap-6 px-8 py-5 rounded-[2rem] bg-slate-950/80 border border-emerald-500/30 backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7),0_0_20px_rgba(16,185,129,0.1)] hover:border-emerald-400/60 hover:bg-slate-900/90 transition-all active:scale-95"
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/25 group-hover:scale-110 transition-all duration-500">
              <Sparkles className="w-7 h-7 animate-pulse" />
              {/* Visualizer dots */}
              <div className="absolute -bottom-1 flex gap-0.5">
                {[1, 2, 3].map((i) => (
                  <span key={i} className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: `${i * 200}ms` }} />
                ))}
              </div>
            </div>

            <div className="relative text-left pr-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                  {t.nowPlaying}
                </p>
              </div>
              <h2 className="text-xl font-bold text-white leading-tight tracking-tight group-hover:text-emerald-50 transition-colors">
                {language === 'th' ? selectedPin.title_th : selectedPin.title_en}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                <BookOpen className="w-4 h-4 text-emerald-400/80" />
                <span className="text-sm text-slate-400 font-medium">
                  {t.readFullLegend}
                </span>
                <ChevronUp className="w-4 h-4 text-emerald-500 group-hover:translate-y-[-3px] transition-transform duration-300" />
              </div>
            </div>
          </button>
        </aside>
      )}

      {/* Slide-out Story Drawer */}
      <StoryDrawer
        pin={selectedPin}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        language={language}
      />

      {/* Admin Portal Modal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        pins={pins}
        onAddPin={handleAddPin}
        onUpdatePin={handleUpdatePin}
        onDeletePin={handleDeletePin}
        language={language}
      />
    </div>
  );
}

export default App;

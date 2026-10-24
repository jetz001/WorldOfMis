import { useState, useEffect, useMemo, useCallback } from 'react';
import type { GhostPin, GhostCategory, SupportedLanguage } from './types/ghost';
import { fetchPins, createPin, updatePin, deletePin } from './lib/api';
import { audioEngine } from './lib/audio';
import { GhostGlobe } from './components/Globe/GhostGlobe';
import { Navbar } from './components/UI/Navbar';
import { StoryDrawer } from './components/UI/StoryDrawer';
import { AdminPortal } from './components/Admin/AdminPortal';
import { getTranslation } from './lib/i18n';
import { Radio, ShieldAlert } from 'lucide-react';

export function App() {
  const [pins, setPins] = useState<GhostPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<GhostPin | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('th');
  const [selectedCategory, setSelectedCategory] = useState<GhostCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const t = getTranslation(language);

  // Load pins
  useEffect(() => {
    fetchPins().then((data) => setPins(data));
  }, []);

  // Ambient sound initialization on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      audioEngine.startAmbient();
      window.removeEventListener('pointerdown', handleFirstInteraction);
    };
    window.addEventListener('pointerdown', handleFirstInteraction);
    return () => window.removeEventListener('pointerdown', handleFirstInteraction);
  }, []);

  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMute(nextMuted);
  }, [isMuted]);

  const handleToggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'th' ? 'en' : 'th'));
  }, []);

  const handleSelectPin = useCallback((pin: GhostPin) => {
    setSelectedPin(pin);
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
    <div className="relative w-screen h-screen overflow-hidden bg-[#05070c] text-slate-100 flex flex-col">
      {/* Top Navigation & HUD */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main 3D Three.js Earth Scene */}
      <main className="flex-1 w-full h-full">
        <GhostGlobe
          pins={filteredPins}
          selectedPin={selectedPin}
          onSelectPin={handleSelectPin}
          language={language}
        />
      </main>

      {/* Bottom Floating Instruction & Radio Garden Status Banner */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none w-full max-w-lg px-4">
        <div className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md shadow-2xl text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-medium text-emerald-300">
              {filteredPins.length} {language === 'th' ? 'เรื่องเล่ากำลังออนแอร์' : 'stories on air'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.instruction}</span>
          </div>
        </div>
      </footer>

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

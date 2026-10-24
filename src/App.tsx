import { useState, useEffect, useMemo, useCallback } from 'react';
import type { GhostPin, GhostCategory, SupportedLanguage } from './types/ghost';
import { fetchPins, createPin, updatePin, deletePin } from './lib/api';
import { audioEngine } from './lib/audio';
import { GhostGlobe } from './components/Globe/GhostGlobe';
import { Navbar } from './components/UI/Navbar';
import { StoryDrawer } from './components/UI/StoryDrawer';
import { RadioGardenPlayer } from './components/UI/RadioGardenPlayer';
import { AdminPortal } from './components/Admin/AdminPortal';

export function App() {
  const [pins, setPins] = useState<GhostPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<GhostPin | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('th');
  const [selectedCategory, setSelectedCategory] = useState<GhostCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [worldViewSignal, setWorldViewSignal] = useState(0);

  // Load pins & set initial selected pin
  useEffect(() => {
    fetchPins().then((data) => {
      setPins(data);
      if (data.length > 0 && !selectedPin) {
        setSelectedPin(data[0]);
      }
    });
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

  const handleZoomOutToWorld = useCallback(() => {
    setWorldViewSignal((prev) => prev + 1);
  }, []);

  const handleSelectPin = useCallback((pin: GhostPin) => {
    setSelectedPin(pin);
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
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
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

      {/* Radio Garden Style Bottom-Left Card Player */}
      <RadioGardenPlayer
        currentPin={selectedPin}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        language={language}
      />

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

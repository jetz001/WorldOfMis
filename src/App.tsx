import { useState, useEffect, useMemo, useCallback } from 'react';
import type { GhostPin, GhostCategory, SupportedLanguage } from './types/ghost';
import { fetchPins, createPin, updatePin, deletePin, recordPinView } from './lib/api';
import { GhostGlobe } from './components/Globe/GhostGlobe';
import { Navbar } from './components/UI/Navbar';
import { StoryDrawer } from './components/UI/StoryDrawer';
import { AdminPortal } from './components/Admin/AdminPortal';
import { performVectorRagSearch } from './lib/vectorRagSearch';

export function App() {
  const [pins, setPins] = useState<GhostPin[]>([]);
  const [selectedPin, setSelectedPin] = useState<GhostPin | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('th');
  const [selectedCategory, setSelectedCategory] = useState<GhostCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [worldViewSignal, setWorldViewSignal] = useState(0);

  // Load pins & attach secret Admin Portal triggers (Ctrl+Shift+A or #admin)
  useEffect(() => {
    fetchPins().then((data) => {
      setPins(data);
    });

    const checkSecretUrl = () => {
      const params = new URLSearchParams(window.location.search);
      if (window.location.hash === '#admin' || params.get('admin') === '1') {
        setIsAdminOpen(true);
        // Clean URL hash so it stays discreet
        if (window.location.hash === '#admin') {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    };
    checkSecretUrl();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('hashchange', checkSecretUrl);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkSecretUrl);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'th' ? 'en' : 'th'));
  }, []);

  const handleZoomOutToWorld = useCallback(() => {
    setWorldViewSignal((prev) => prev + 1);
    setSelectedPin(null);
    setIsDrawerOpen(false);
  }, []);

  const handleSelectPin = useCallback((pin: GhostPin) => {
    // 1. Immediately increment views_count locally for instant real-time feedback
    const nextViews = (pin.views_count || 0) + 1;
    const updated = { ...pin, views_count: nextViews };
    setSelectedPin(updated);
    setIsDrawerOpen(true);

    setPins((prev) =>
      prev.map((p) => (p.id === pin.id ? { ...p, views_count: nextViews } : p))
    );

    // 2. Persist real view increment to remote Cloudflare D1
    recordPinView(pin.id);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setSelectedPin(null);
  }, []);

  // Category-filtered pins
  const categoryFilteredPins = useMemo(() => {
    if (selectedCategory === 'all') return pins;
    return pins.filter((pin) => pin.category === selectedCategory);
  }, [pins, selectedCategory]);

  // Hybrid RAG + Vector Semantic Search over category-filtered pins
  const ragResponse = useMemo(() => {
    return performVectorRagSearch(searchQuery, categoryFilteredPins, language, 50);
  }, [searchQuery, categoryFilteredPins, language]);

  // Pins shown on the 3D Globe
  const filteredPins = useMemo(() => {
    if (!searchQuery.trim()) {
      return categoryFilteredPins;
    }
    return ragResponse.results.map((r) => r.pin);
  }, [searchQuery, categoryFilteredPins, ragResponse]);

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
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#03060c] text-slate-100 flex flex-col">
      {/* Top Navigation & HUD */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onSelectLanguage={setLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onZoomOut={handleZoomOutToWorld}
        ragResponse={ragResponse}
        onSelectPin={handleSelectPin}
      />

      {/* Main 3D Earth Scene */}
      <main className="flex-1 w-full h-full">
        <GhostGlobe
          pins={filteredPins}
          selectedPin={selectedPin}
          onSelectPin={handleSelectPin}
          language={language}
          worldViewSignal={worldViewSignal}
          onZoomOut={handleZoomOutToWorld}
        />
      </main>

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

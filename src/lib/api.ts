import type { GhostPin } from '../types/ghost';
import { INITIAL_GHOST_PINS } from '../data/seedData';

// User custom pins storage key (stores ONLY user-created/custom pins, not the entire 2,000 pins!)
const CUSTOM_PINS_KEY = 'worldofmys_custom_pins_v1';

// Automatically purge legacy bulky pin caches from localStorage to free up browser quota
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('worldofmys_pins_') || key.startsWith('wom_pins_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
  }
} catch {}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn(`[Storage] Failed to set ${key} (quota exceeded):`, err);
  }
}

function getLocalCustomPins(): GhostPin[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PINS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as GhostPin[];
    }
  } catch {}
  return [];
}

function saveLocalCustomPins(pins: GhostPin[]): void {
  safeSetItem(CUSTOM_PINS_KEY, JSON.stringify(pins));
}

/**
 * Reconciles remote pins with seed data and local custom pins.
 */
function reconcileWithSeed(remoteOrCachedPins: GhostPin[]): GhostPin[] {
  const seedMap = new Map(INITIAL_GHOST_PINS.map((p) => [p.id, p]));
  const customPins = getLocalCustomPins();

  const reconciled: GhostPin[] = remoteOrCachedPins.map((item) => {
    const seed = seedMap.get(item.id);
    const resolvedImg =
      item.image_url ||
      seed?.image_url ||
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80';
    const resolvedGallery =
      item.gallery_media && item.gallery_media.length > 0
        ? item.gallery_media
        : seed?.gallery_media;
    return {
      ...item,
      image_url: resolvedImg,
      gallery_media: resolvedGallery,
      taboos_th: item.taboos_th || seed?.taboos_th,
      taboos_en: item.taboos_en || seed?.taboos_en,
    };
  });

  const existingIds = new Set(reconciled.map((p) => p.id));
  
  // Append any missing seed pins (ensuring all 2,000 pins are always present)
  for (const seedPin of INITIAL_GHOST_PINS) {
    if (!existingIds.has(seedPin.id)) {
      reconciled.push(seedPin);
      existingIds.add(seedPin.id);
    }
  }

  // Append any local custom pins created by user
  for (const customPin of customPins) {
    if (!existingIds.has(customPin.id)) {
      reconciled.unshift(customPin);
      existingIds.add(customPin.id);
    }
  }

  return reconciled;
}

export async function fetchPins(): Promise<GhostPin[]> {
  try {
    const res = await fetch('/api/pins');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return reconcileWithSeed(data.data as GhostPin[]);
      }
    }
  } catch (err) {
    // API not running or network offline
    console.debug('API /api/pins offline or unavailable, using in-memory baseline:', err);
  }

  // Return in-memory baseline reconciled with any local user-created pins
  return reconcileWithSeed(INITIAL_GHOST_PINS);
}

export async function createPin(pin: GhostPin): Promise<GhostPin> {
  try {
    const res = await fetch('/api/pins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pin),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.id) {
        pin.id = data.id;
      }
    }
  } catch {
    // Offline fallback
  }

  // Store in user custom pins
  const custom = getLocalCustomPins();
  const updated = [pin, ...custom.filter((p) => p.id !== pin.id)];
  saveLocalCustomPins(updated);

  return pin;
}

export async function updatePin(pin: GhostPin): Promise<GhostPin> {
  try {
    await fetch(`/api/pins/${pin.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pin),
    });
  } catch {
    // Offline fallback
  }

  const custom = getLocalCustomPins();
  const updated = custom.map((p) => (p.id === pin.id ? pin : p));
  saveLocalCustomPins(updated);

  return pin;
}

export async function deletePin(id: string): Promise<void> {
  try {
    await fetch(`/api/pins/${id}`, {
      method: 'DELETE',
    });
  } catch {
    // Offline fallback
  }

  const custom = getLocalCustomPins();
  const updated = custom.filter((p) => p.id !== id);
  saveLocalCustomPins(updated);
}

/**
 * Automatically records a real user view for a specific pin.
 * Increments remote D1 views_count via /api/pins/:id.
 */
export async function recordPinView(id: string): Promise<number | null> {
  try {
    const res = await fetch(`/api/pins/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && typeof data.data.views_count === 'number') {
        return data.data.views_count;
      }
    }
  } catch {
    // Offline fallback
  }
  return null;
}

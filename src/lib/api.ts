import type { GhostPin } from '../types/ghost';
import { INITIAL_GHOST_PINS } from '../data/seedData';

const STORAGE_KEY = 'worldofmys_pins_v6';

/**
 * Reconciles a cached pin list with the latest seed data so newly
 * added stories or updated media galleries are never hidden behind a stale cache.
 */
function reconcileWithSeed(cachedPins: GhostPin[]): GhostPin[] {
  const seedMap = new Map(INITIAL_GHOST_PINS.map((p) => [p.id, p]));
  const reconciled = cachedPins.map((cached) => {
    const seed = seedMap.get(cached.id);
    const resolvedImg = cached.image_url || seed?.image_url || `/entities/${cached.id}.jpg`;
    const resolvedGallery =
      cached.gallery_media && cached.gallery_media.length > 0
        ? cached.gallery_media
        : seed?.gallery_media;
    return {
      ...cached,
      image_url: resolvedImg,
      gallery_media: resolvedGallery,
    };
  });
  const cachedIds = new Set(cachedPins.map((p) => p.id));
  const missingFromCache = INITIAL_GHOST_PINS.filter((pin) => !cachedIds.has(pin.id));
  return [...reconciled, ...missingFromCache];
}

export async function fetchPins(): Promise<GhostPin[]> {
  try {
    const res = await fetch('/api/pins');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const apiPins = data.data as GhostPin[];
        const reconciled = reconcileWithSeed(apiPins);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reconciled));
        return reconciled;
      }
    }
  } catch {
    // API not running (standalone Vite preview / dev)
  }

  // Fallback to local storage or initial seed
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const reconciled = reconcileWithSeed(parsed as GhostPin[]);
        if (reconciled.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reconciled));
        }
        return reconciled;
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Pure offline initial seed
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GHOST_PINS));
  return INITIAL_GHOST_PINS;
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

  // Always update local cache immediately
  const current = await fetchPins();
  const updated = [pin, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

  const current = await fetchPins();
  const updated = current.map((p) => (p.id === pin.id ? pin : p));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

  const current = await fetchPins();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Automatically records a real user view for a specific pin.
 * Increments remote D1 views_count via /api/pins/:id and keeps local cache synchronized.
 */
export async function recordPinView(id: string): Promise<number | null> {
  try {
    const res = await fetch(`/api/pins/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && typeof data.data.views_count === 'number') {
        const newCount = data.data.views_count;
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          try {
            const current = JSON.parse(cached) as GhostPin[];
            const updated = current.map((p) =>
              p.id === id ? { ...p, views_count: newCount } : p
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          } catch {}
        }
        return newCount;
      }
    }
  } catch {
    // Offline fallback
  }

  // Local storage increment fallback if offline
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      const current = JSON.parse(cached) as GhostPin[];
      let updatedCount = 0;
      const updated = current.map((p) => {
        if (p.id === id) {
          updatedCount = (p.views_count || 0) + 1;
          return { ...p, views_count: updatedCount };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updatedCount;
    } catch {}
  }
  return null;
}

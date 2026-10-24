import type { GhostPin } from '../types/ghost';
import { INITIAL_GHOST_PINS } from '../data/seedData';

const STORAGE_KEY = 'worldofmys_pins_local_cache';

export async function fetchPins(): Promise<GhostPin[]> {
  try {
    const res = await fetch('/api/pins');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.data));
        return data.data;
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
        return parsed;
      }
    } catch {
      // ignore
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GHOST_PINS));
  return INITIAL_GHOST_PINS;
}

export async function createPin(newPin: GhostPin): Promise<GhostPin> {
  try {
    const res = await fetch('/api/pins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPin),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.id) {
        newPin.id = data.id;
      }
    }
  } catch {
    // offline fallback
  }

  // Sync locally
  const current = await fetchPins();
  const updated = [newPin, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newPin;
}

export async function updatePin(updatedPin: GhostPin): Promise<GhostPin> {
  try {
    await fetch(`/api/pins/${updatedPin.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPin),
    });
  } catch {
    // offline fallback
  }

  const current = await fetchPins();
  const updated = current.map((p) => (p.id === updatedPin.id ? updatedPin : p));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updatedPin;
}

export async function deletePin(id: string): Promise<void> {
  try {
    await fetch(`/api/pins/${id}`, { method: 'DELETE' });
  } catch {
    // offline fallback
  }

  const current = await fetchPins();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

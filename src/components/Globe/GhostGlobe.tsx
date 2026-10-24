import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Fix: point MapLibre to our bundled worker so Cloudflare Pages
// returns the correct JS MIME type instead of an HTML 404 page.
setWorkerUrl('/maplibre-gl-worker.mjs');
import type { GhostPin, SupportedLanguage } from '../../types/ghost';
import { audioEngine } from '../../lib/audio';

// Shared world overview camera values, used both on init and when zooming out
const WORLD_VIEW_CENTER: [number, number] = [100.5, 13.75]; // Centered on Thailand / Asia
const WORLD_VIEW_ZOOM = 2.8;

interface GhostGlobeProps {
  pins: GhostPin[];
  selectedPin: GhostPin | null;
  onSelectPin: (pin: GhostPin) => void;
  language: SupportedLanguage;
  worldViewSignal: number;
}

export const GhostGlobe: React.FC<GhostGlobeProps> = ({
  pins,
  selectedPin,
  onSelectPin,
  language,
  worldViewSignal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [hoveredPin, setHoveredPin] = useState<{ pin: GhostPin; x: number; y: number } | null>(null);

  // Smooth fly-to pin on click
  const flyToPin = useCallback((pin: GhostPin) => {
    if (!mapRef.current) return;
    audioEngine.playRadioTuning();
    audioEngine.playPresetSound(pin.sound_preset);

    mapRef.current.flyTo({
      center: [pin.lng, pin.lat],
      zoom: 7.5,
      speed: 1.3,
      curve: 1.4,
      essential: true,
    });
  }, []);

  useEffect(() => {
    if (selectedPin) {
      flyToPin(selectedPin);
    }
  }, [selectedPin, flyToPin]);

  // 1. Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'satellite-tiles': {
            type: 'raster',
            tiles: [
              'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
              'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
              'https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
        sky: {
          'sky-color': '#03060c',
          'sky-horizon-blend': 0.5,
          'horizon-color': '#03060c',
          'horizon-fog-blend': 0.5,
          'fog-color': '#03060c',
          'fog-ground-blend': 0.5,
        },
      },
      center: WORLD_VIEW_CENTER,
      zoom: WORLD_VIEW_ZOOM,
      minZoom: 1,
      maxZoom: 18,
    });

    mapRef.current = map;
    map.addControl(new NavigationControl({ showCompass: true }), 'top-right');

    map.on('style.load', () => {
      try {
        map.setProjection({ type: 'globe' });
      } catch (e) {
        console.warn('Globe projection error:', e);
      }
    });

    return () => {
      // Clear markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Pull the camera back to the full-globe overview
  const flyToWorldView = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: WORLD_VIEW_CENTER,
      zoom: WORLD_VIEW_ZOOM,
      speed: 0.8,
      curve: 1.4,
      essential: true,
    });
  }, []);

  // Each button press increments the signal and pulls the camera back
  useEffect(() => {
    if (worldViewSignal > 0) {
      flyToWorldView();
    }
  }, [worldViewSignal, flyToWorldView]);

  // 2. Render Markers reliably whenever `pins` or `selectedPin` changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Create high-visibility Radio Garden Green Dot Markers
    pins.forEach((pin) => {
      const isSelected = selectedPin?.id === pin.id;

      const el = document.createElement('div');
      el.className = 'cursor-pointer select-none group';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      // Inner Radio Garden glowing green dot and ping halo
      el.innerHTML = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <span style="
            position: absolute;
            width: ${isSelected ? '22px' : '16px'};
            height: ${isSelected ? '22px' : '16px'};
            border-radius: 9999px;
            background-color: #00ff88;
            opacity: 0.75;
            animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></span>
          <span style="
            position: relative;
            width: ${isSelected ? '12px' : '9px'};
            height: ${isSelected ? '12px' : '9px'};
            border-radius: 9999px;
            background-color: #00ff88;
            border: 2px solid #ffffff;
            box-shadow: 0 0 12px #00ff88, 0 0 4px #ffffff;
            transition: transform 0.2s;
          "></span>
        </div>
      `;

      el.addEventListener('mouseenter', (e) => {
        setHoveredPin({ pin, x: e.clientX, y: e.clientY });
      });

      el.addEventListener('mouseleave', () => {
        setHoveredPin(null);
      });

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectPin(pin);
        flyToPin(pin);
      });

      const marker = new Marker({ element: el, anchor: 'center' })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [pins, selectedPin, onSelectPin, flyToPin]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#03060c]">
      {/* MapLibre 3D Globe Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Radio Garden Signature Center Circle (Green Ring with White Dot) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-[#00ff88] shadow-[0_0_18px_rgba(0,255,136,0.6)] flex items-center justify-center transition-all duration-300">
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
        </div>
      </div>

      {/* Floating Tactical Tooltip on Pin Hover */}
      {hoveredPin && (
        <div
          className="pointer-events-none fixed z-30 transform -translate-x-1/2 -translate-y-full mb-4 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-emerald-400/60 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,136,0.3)] animate-in fade-in duration-150"
          style={{ left: hoveredPin.x, top: hoveredPin.y - 12 }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
            <p className="font-bold text-sm text-[#00ff88]">
              {language === 'th' ? hoveredPin.pin.title_th : hoveredPin.pin.title_en}
            </p>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            📍 {language === 'th' ? hoveredPin.pin.province_th : hoveredPin.pin.province_en}
          </p>
        </div>
      )}
    </div>
  );
};

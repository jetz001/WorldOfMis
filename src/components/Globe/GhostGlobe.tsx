import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Fix: point MapLibre to our bundled worker so Cloudflare Pages
// returns the correct JS MIME type instead of an HTML 404 page.
setWorkerUrl('/maplibre-gl-worker.mjs');
import type { GhostPin, SupportedLanguage } from '../../types/ghost';
import { registerCloudMistProtocol } from './cloudMistLayer';
import { getEntityDossier } from '../../lib/entityBestiary';

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
  const markerInnerElsRef = useRef<globalThis.Map<string, HTMLDivElement>>(new globalThis.Map());
  const pinsRef = useRef<GhostPin[]>(pins);

  useEffect(() => {
    pinsRef.current = pins;
  }, [pins]);

  const [previewPin, setPreviewPin] = useState<GhostPin | null>(null);
  const [magnetTarget, setMagnetTarget] = useState<{
    pin: GhostPin;
    dx: number;
    dy: number;
    dist: number;
  } | null>(null);

  // Compute closest pin to screen center and apply gentle magnetic pull on markers
  const updateMagneticField = useCallback(() => {
    const map = mapRef.current;
    const container = mapContainerRef.current;
    if (!map || !container) return;

    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const centerLngLat = map.getCenter();

    const MAGNET_RADIUS = 105; // px radius for magnetic field pull
    let closest: { pin: GhostPin; dx: number; dy: number; dist: number } | null = null;

    for (const pin of pinsRef.current) {
      // Ensure pin is on the front hemisphere of the globe
      const dLng = Math.abs(pin.lng - centerLngLat.lng);
      const normDLng = dLng > 180 ? 360 - dLng : dLng;
      const dLat = Math.abs(pin.lat - centerLngLat.lat);
      if (normDLng > 75 || dLat > 75) {
        const innerEl = markerInnerElsRef.current.get(pin.id);
        if (innerEl) innerEl.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
        continue;
      }

      const pt = map.project([pin.lng, pin.lat]);
      const dx = pt.x - cx;
      const dy = pt.y - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < MAGNET_RADIUS && (!closest || dist < closest.dist)) {
        closest = { pin, dx, dy, dist };
      } else {
        const innerEl = markerInnerElsRef.current.get(pin.id);
        if (innerEl) innerEl.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
      }
    }

    // Reset non-closest pins and gently pull the closest pin toward the center reticle
    if (closest) {
      for (const [id, innerEl] of markerInnerElsRef.current.entries()) {
        if (id === closest.pin.id) {
          // Gentle magnetic attraction toward center (pulls up to 38% closer + slight scale boost)
          const strength = Math.pow(1 - closest.dist / MAGNET_RADIUS, 1.15) * 0.38;
          const pullX = -closest.dx * strength;
          const pullY = -closest.dy * strength;
          innerEl.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0) scale(1.28)`;
        } else {
          innerEl.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
        }
      }
    }

    setMagnetTarget(closest);
  }, []);

  // Smooth fly-to pin on click
  const flyToPin = useCallback((pin: GhostPin) => {
    if (!mapRef.current) return;

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

  // 1. Initialize MapLibre GL 3D Globe with NASA Bathymetry, Clouds & Eerie Atmosphere
  useEffect(() => {
    if (!mapContainerRef.current) return;

    registerCloudMistProtocol();

    const map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          // Global seamless NASA Blue Marble with Shaded Relief & Ocean Bathymetry
          'nasa-blue-marble': {
            type: 'raster',
            tiles: [
              'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg',
            ],
            tileSize: 256,
            maxzoom: 8,
          },
          // High-resolution consistent satellite imagery for regional / province zoom
          'satellite-detail': {
            type: 'raster',
            tiles: [
              'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            ],
            tileSize: 256,
            maxzoom: 19,
          },
          // 3D Spherical Cloud & Spectral Mist Raster Tiles
          'globe-clouds': {
            type: 'raster',
            tiles: ['clouds://{z}/{x}/{y}'],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 4,
          },
        },
        layers: [
          {
            id: 'nasa-base-layer',
            type: 'raster',
            source: 'nasa-blue-marble',
            minzoom: 0,
            maxzoom: 22,
            paint: {
              'raster-brightness-max': 0.92,
              'raster-contrast': 0,
              'raster-saturation': -0.05,
              'raster-fade-duration': 300,
            },
          },
          {
            id: 'satellite-detail-layer',
            type: 'raster',
            source: 'satellite-detail',
            minzoom: 3,
            maxzoom: 22,
            paint: {
              'raster-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                3.5,
                0,
                5.8,
                0.95,
              ],
              'raster-brightness-max': 0.9,
              'raster-contrast': 0,
              'raster-saturation': -0.08,
              'raster-fade-duration': 400,
            },
          },
          {
            id: 'globe-clouds-layer',
            type: 'raster',
            source: 'globe-clouds',
            minzoom: 0,
            maxzoom: 22,
            paint: {
              'raster-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                1,
                0.78,
                4,
                0.6,
                7.5,
                0.35,
                11,
                0.18,
              ],
              'raster-fade-duration': 300,
            },
          },
        ],
        sky: {
          'sky-color': '#02060d',
          'sky-horizon-blend': 0.65,
          'horizon-color': '#114b47',
          'horizon-fog-blend': 0.75,
          'fog-color': '#0b2930',
          'fog-ground-blend': 0.45,
          'atmosphere-blend': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            0.92,
            5,
            0.78,
            8,
            0.4,
          ],
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
      updateMagneticField();
    });

    map.on('move', () => {
      updateMagneticField();
    });

    // Gentle magnetic snap when user finishes dragging near a pin
    map.on('dragend', () => {
      const container = mapContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const centerLngLat = map.getCenter();

      const SNAP_RADIUS = 72; // px soft magnetic snap zone
      let closestPin: GhostPin | null = null;
      let minDist = SNAP_RADIUS;

      for (const pin of pinsRef.current) {
        const dLng = Math.abs(pin.lng - centerLngLat.lng);
        const normDLng = dLng > 180 ? 360 - dLng : dLng;
        const dLat = Math.abs(pin.lat - centerLngLat.lat);
        if (normDLng > 70 || dLat > 70) continue;

        const pt = map.project([pin.lng, pin.lat]);
        const dist = Math.hypot(pt.x - cx, pt.y - cy);
        if (dist < minDist) {
          minDist = dist;
          closestPin = pin;
        }
      }

      if (closestPin && minDist > 2) {
        map.easeTo({
          center: [closestPin.lng, closestPin.lat],
          duration: 520,
          easing: (t) => 1 - Math.pow(1 - t, 3),
          essential: true,
        });
      }
    });

    // Clicking empty space on the globe dismisses the miniature preview card
    map.on('click', () => {
      setPreviewPin(null);
    });

    return () => {
      // Clear markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      markerInnerElsRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [updateMagneticField]);

  // Pull the camera back to the full-globe overview
  const flyToWorldView = useCallback(() => {
    if (!mapRef.current) return;
    setPreviewPin(null);
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
    markerInnerElsRef.current.clear();

    // Create high-visibility Spectral Green Dot Markers with magnetic inner wrapper
    pins.forEach((pin) => {
      const isSelected = selectedPin?.id === pin.id;

      const el = document.createElement('div');
      el.className = 'cursor-pointer select-none group';
      el.style.width = '28px';
      el.style.height = '28px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      const innerWrap = document.createElement('div');
      innerWrap.style.position = 'relative';
      innerWrap.style.display = 'flex';
      innerWrap.style.alignItems = 'center';
      innerWrap.style.justifyContent = 'center';
      innerWrap.style.transition = 'transform 140ms cubic-bezier(0.22, 1, 0.36, 1)';
      innerWrap.innerHTML = `
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
        "></span>
      `;

      el.appendChild(innerWrap);
      markerInnerElsRef.current.set(pin.id, innerWrap);

      // Clicking a pin shows ONLY the miniature preview card at the center reticle;
      // clicking that miniature card then opens the full StoryDrawer.
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setPreviewPin(pin);
        flyToPin(pin);
      });

      const marker = new Marker({ element: el, anchor: 'center' })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    updateMagneticField();
  }, [pins, selectedPin, onSelectPin, flyToPin, updateMagneticField]);

  const isLocked = Boolean(magnetTarget && magnetTarget.dist < 22);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#02060d]">
      {/* MapLibre 3D Globe Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Mysterious Atmospheric Fog & Drifting Mist Overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Deep nocturnal vignette around viewport edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, transparent 48%, rgba(3, 12, 22, 0.4) 78%, rgba(1, 4, 9, 0.82) 100%)',
          }}
        />
        {/* Drifting low-lying spectral mist bank 1 */}
        <div
          className="absolute -inset-x-20 bottom-0 h-64 animate-mist-drift"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 35% 90%, rgba(45, 212, 191, 0.14) 0%, rgba(15, 23, 42, 0.25) 55%, transparent 100%)',
            filter: 'blur(24px)',
          }}
        />
        {/* Drifting upper/mid spectral mist bank 2 */}
        <div
          className="absolute -inset-x-24 top-1/4 h-72 animate-mist-drift-reverse"
          style={{
            background:
              'radial-gradient(ellipse 70% 45% at 65% 50%, rgba(56, 189, 248, 0.09) 0%, rgba(148, 163, 184, 0.06) 50%, transparent 100%)',
            filter: 'blur(32px)',
          }}
        />
      </div>

      {/* Mysterious Occult Astrolabe Reticle & Gentle Magnetic Field Tether */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Spectral Magnetic Tether Beam towards nearby pin */}
          {magnetTarget && magnetTarget.dist > 3 && (
            <svg
              className="pointer-events-none absolute overflow-visible"
              width="240"
              height="240"
              viewBox="-120 -120 240 240"
            >
              <defs>
                <linearGradient id="magnetBeam" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Soft magnetic aura line from center (0,0) to pulled pin */}
              <line
                x1={0}
                y1={0}
                x2={magnetTarget.dx * 0.65}
                y2={magnetTarget.dy * 0.65}
                stroke="url(#magnetBeam)"
                strokeWidth={isLocked ? '2.5' : '1.8'}
                strokeDasharray="3 3"
              />
              <circle
                cx={magnetTarget.dx * 0.65}
                cy={magnetTarget.dy * 0.65}
                r="4"
                fill="#34d399"
                fillOpacity="0.6"
              />
            </svg>
          )}

          {/* Outer Ambient Spectral Halo */}
          <div
            className={`absolute rounded-full transition-all duration-500 ${
              magnetTarget
                ? 'w-24 h-24 bg-emerald-400/15 shadow-[0_0_40px_rgba(16,185,129,0.55)] scale-105'
                : 'w-20 h-20 bg-emerald-500/5 shadow-[0_0_25px_rgba(16,185,129,0.25)] scale-100'
            }`}
          />

          {/* Main Occult Astrolabe SVG Reticle */}
          <svg
            viewBox="0 0 100 100"
            className={`w-20 h-20 transition-transform duration-300 ${
              magnetTarget ? 'scale-110' : 'scale-100'
            }`}
          >
            {/* Outer Slow-Rotating Arcane Rune Ring */}
            <g className="origin-center animate-spin [animation-duration:24s]">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={magnetTarget ? '#34d399' : '#10b981'}
                strokeWidth="1.2"
                strokeDasharray="5 4 1.5 4"
                strokeOpacity={magnetTarget ? '0.95' : '0.6'}
              />
              {/* 4 Cardinal Occult Compass Spikes */}
              <path d="M50 3 L52.5 12 L50 9.5 L47.5 12 Z" fill="#6ee7b7" fillOpacity="0.85" />
              <path d="M50 97 L52.5 88 L50 90.5 L47.5 88 Z" fill="#6ee7b7" fillOpacity="0.85" />
              <path d="M3 50 L12 47.5 L9.5 50 L12 52.5 Z" fill="#6ee7b7" fillOpacity="0.85" />
              <path d="M97 50 L88 47.5 L90.5 50 L88 52.5 Z" fill="#6ee7b7" fillOpacity="0.85" />
            </g>

            {/* Inner Counter-Rotating Sacred Geometry Diamond & Ring */}
            <g className="origin-center animate-spin [animation-duration:14s] [animation-direction:reverse]">
              <circle
                cx="50"
                cy="50"
                r="28"
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="1.2"
                strokeDasharray="12 6"
                strokeOpacity={magnetTarget ? '0.9' : '0.5'}
              />
              <polygon
                points="50,24 76,50 50,76 24,50"
                fill="none"
                stroke="#6ee7b7"
                strokeWidth="0.9"
                strokeOpacity={magnetTarget ? '0.75' : '0.35'}
              />
            </g>

            {/* Crosshair Whispering Ticks */}
            <line x1="50" y1="15" x2="50" y2="23" stroke="#a7f3d0" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="50" y1="77" x2="50" y2="85" stroke="#a7f3d0" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="15" y1="50" x2="23" y2="50" stroke="#a7f3d0" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="77" y1="50" x2="85" y2="50" stroke="#a7f3d0" strokeWidth="1" strokeOpacity="0.6" />

            {/* Central Spectral Eye / Diamond Core */}
            <polygon
              points="50,43 57,50 50,57 43,50"
              fill={magnetTarget ? '#00ff88' : '#10b981'}
              fillOpacity={magnetTarget ? '0.45' : '0.2'}
              stroke="#a7f3d0"
              strokeWidth="1.3"
            />
            <circle
              cx="50"
              cy="50"
              r={magnetTarget ? '3.5' : '2.4'}
              fill="#ecfdf5"
            />
          </svg>

          {/* Miniature Creature Preview Card (Appears ONLY when a pin is clicked, and opens full StoryDrawer when clicked) */}
          {previewPin && (() => {
            const previewDossier = getEntityDossier(previewPin, language);
            return (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const target = previewPin;
                  setPreviewPin(null);
                  onSelectPin(target);
                }}
                className="pointer-events-auto absolute top-full mt-2.5 pl-2.5 pr-4 py-2 rounded-2xl bg-[#070c15]/95 border border-amber-400/55 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.9),0_0_22px_rgba(16,185,129,0.45)] flex items-center gap-3 whitespace-nowrap hover:border-emerald-400 hover:scale-105 transition-all cursor-pointer text-left animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-400/50 shrink-0 bg-slate-900">
                  <img
                    src={previewDossier.portraitUrl}
                    alt={previewPin.title_th}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-[#00ff88] ring-1 ring-black animate-ping" />
                </div>
                <div className="min-w-0">
                  <p className="font-grimoire text-sm font-bold text-amber-100 leading-tight">
                    {language === 'th' ? previewPin.title_th : previewPin.title_en}
                  </p>
                  <p className="text-[11px] text-emerald-300/90 truncate max-w-[210px] mt-0.5">
                    {previewDossier.entityType}
                  </p>
                  <p className="text-[10px] text-amber-200/80 mt-0.5 flex items-center gap-1">
                    <span>📍 {language === 'th' ? previewPin.province_th : previewPin.province_en}</span>
                    <span className="text-emerald-400 font-semibold ml-1">
                      • {language === 'th' ? 'กดเพื่อเปิดคัมภีร์ ↗' : 'Click to open ↗'}
                    </span>
                  </p>
                </div>
              </button>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, NavigationControl } from 'maplibre-gl';
import type { GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { GhostPin, SupportedLanguage } from '../../types/ghost';
import { audioEngine } from '../../lib/audio';

interface GhostGlobeProps {
  pins: GhostPin[];
  selectedPin: GhostPin | null;
  onSelectPin: (pin: GhostPin) => void;
  language: SupportedLanguage;
}

export const GhostGlobe: React.FC<GhostGlobeProps> = ({
  pins,
  selectedPin,
  onSelectPin,
  language,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [hoveredPin, setHoveredPin] = useState<{ pin: GhostPin; x: number; y: number } | null>(null);

  // Smooth fly-to selected pin
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

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize MapLibre GL with Pure Satellite Imagery (Google & Esri satellite tiles)
    const map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'satellite-tiles': {
            type: 'raster',
            tiles: [
              // Google Maps / Google Earth Satellite Tiles API
              'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
              'https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
              'https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
              // Fallback to Esri World Imagery (Maxar / ArcGIS)
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
      center: [100.5, 13.75], // Centered on Thailand / Asia
      zoom: 2.8,
      minZoom: 1,
      maxZoom: 18,
    });

    mapRef.current = map;

    // Add navigation controls (zoom in/out, pitch)
    map.addControl(new NavigationControl({ showCompass: true }), 'top-right');

    map.on('style.load', () => {
      // 2. Set 3D Globe Projection (Radio Garden exact engine)
      try {
        map.setProjection({ type: 'globe' });
      } catch (e) {
        console.warn('Globe projection fallback:', e);
      }

      // 3. Add Folklore Pins as GeoJSON layers
      const geojsonFeatures = pins.map((p) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [p.lng, p.lat],
        },
        properties: { ...p },
      }));

      map.addSource('ghost-pins', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: geojsonFeatures,
        },
      });

      // Layer 1: Soft Radio Garden Green Glow Halo
      map.addLayer({
        id: 'pins-glow',
        type: 'circle',
        source: 'ghost-pins',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 8, 8, 14],
          'circle-color': '#00ff88',
          'circle-opacity': 0.35,
          'circle-blur': 0.7,
        },
      });

      // Layer 2: Radio Garden Signature Neon Green Pin Dot
      map.addLayer({
        id: 'pins-core',
        type: 'circle',
        source: 'ghost-pins',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 4.5, 8, 7],
          'circle-color': '#00ff88',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Handle Pin Click
      map.on('click', 'pins-core', (e) => {
        if (!e.features || e.features.length === 0) return;
        const clickedPin = e.features[0].properties as GhostPin;
        onSelectPin(clickedPin);
        flyToPin(clickedPin);
      });

      // Handle Hover Tooltip
      map.on('mouseenter', 'pins-core', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (e.features && e.features[0] && e.point) {
          const pin = e.features[0].properties as GhostPin;
          setHoveredPin({ pin, x: e.point.x, y: e.point.y });
        }
      });

      map.on('mouseleave', 'pins-core', () => {
        map.getCanvas().style.cursor = '';
        setHoveredPin(null);
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [onSelectPin, flyToPin]);

  // Update GeoJSON source when pins change
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const source = map.getSource('ghost-pins') as GeoJSONSource | undefined;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: pins.map((p) => ({
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [p.lng, p.lat],
          },
          properties: { ...p },
        })),
      });
    }
  }, [pins]);

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
          style={{ left: hoveredPin.x, top: hoveredPin.y - 8 }}
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

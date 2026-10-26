import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl, type GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RotateCw, X, Compass, BookOpen, MapPin } from 'lucide-react';

// Fix: point MapLibre to our bundled worker so Cloudflare Pages
// returns the correct JS MIME type instead of an HTML 404 page.
setWorkerUrl('/maplibre-gl-worker.mjs');
import type { GhostPin, SupportedLanguage, GhostCategory } from '../../types/ghost';
import { getTranslation } from '../../lib/i18n';
import { registerCloudMistProtocol } from './cloudMistLayer';
import { WorldCommentBar } from '../UI/WorldCommentBar';

// Shared world overview camera values, used both on init and when zooming out
const WORLD_VIEW_CENTER: [number, number] = [100.5, 13.75]; // Centered on Thailand / Asia
const WORLD_VIEW_ZOOM = 2.8;


interface CategoryMarkerStyle {
  color: string;
  glow: string;
  bgGradient: string;
  iconSvg: string;
}

const CATEGORY_MARKER_STYLES: Record<GhostCategory, CategoryMarkerStyle> = {
  // 1. Ghost (Cyan Phantom Wisp)
  ghost: {
    color: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #38bdf8 0%, #0284c7 65%, #082f49 100%)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="M12 2a7 7 0 0 0-7 7v9l3-2 3 2 3-2 3 2 2-2V9a7 7 0 0 0-7-7z"/><circle cx="9" cy="9" r="1.2" fill="#ffffff"/><circle cx="15" cy="9" r="1.2" fill="#ffffff"/></svg>`,
  },

  // 2. Monster (Crimson Beast Maw)
  monster: {
    color: '#ff2a5f',
    glow: 'rgba(255, 42, 95, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #ff2a5f 0%, #be123c 65%, #4c0519 100%)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  },

  // 3. Curse (Royal Violet Cursed Skull)
  curse: {
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #c084fc 0%, #7e22ce 65%, #3b0764 100%)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><circle cx="9" cy="12" r="1.3" fill="#ffffff"/><circle cx="15" cy="12" r="1.3" fill="#ffffff"/><path d="M8 20v2h8v-2"/><path d="M16 20a3 3 0 0 0 1.5-2.6 6 6 0 1 0-11 0A3 3 0 0 0 8 20z"/></svg>`,
  },

  // 4. Sacred (Solar Golden Star)
  sacred: {
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.9)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #fde047 0%, #d97706 65%, #451a03 100%)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="m12 2 2.6 6.2L21 11l-5 4.5 1.5 6.5L12 18.5 6.5 22 8 15.5 3 11l6.4-2.8z"/></svg>`,
  },

  // 5. Legend (Emerald Jade Ancient Scroll)
  legend: {
    color: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #34d399 0%, #059669 65%, #022c22 100%)',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
  },
};

function createPinsGeoJson(pins: GhostPin[]) {
  return {
    type: 'FeatureCollection' as const,
    features: pins.map((p) => {
      const style = CATEGORY_MARKER_STYLES[p.category] || CATEGORY_MARKER_STYLES.legend;
      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [p.lng, p.lat],
        },
        properties: {
          id: p.id,
          category: p.category,
          color: style.color,
          glow: style.glow,
          title_th: p.title_th,
          title_en: p.title_en,
          province_th: p.province_th,
          province_en: p.province_en,
          story_th: p.story_th ? p.story_th.slice(0, 140) : '',
          story_en: p.story_en ? p.story_en.slice(0, 140) : '',
        },
      };
    }),
  };
}

export interface ActiveNexusData {
  isCluster: boolean;
  coords: [number, number];
  title: string;
  subtitle: string;
  count?: number;
  titles?: string[];
  snippet?: string;
  color: string;
  pinId?: string;
  category?: GhostCategory;
}

interface GhostGlobeProps {
  pins: GhostPin[];
  selectedPin: GhostPin | null;
  onSelectPin: (pin: GhostPin) => void;
  language: SupportedLanguage;
  worldViewSignal: number;
  onZoomOut?: () => void;
  onMapReady?: () => void;
}

interface MarkerItem {
  marker: Marker;
  pin: GhostPin;
  element: HTMLDivElement;
  isVisible?: boolean;
}

export const GhostGlobe: React.FC<GhostGlobeProps> = ({
  pins,
  selectedPin,
  onSelectPin,
  language,
  worldViewSignal,
  onZoomOut,
  onMapReady,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const markerItemsRef = useRef<MarkerItem[]>([]);
  const markerInnerElsRef = useRef<globalThis.Map<string, HTMLDivElement>>(new globalThis.Map());
  const pinsRef = useRef<GhostPin[]>(pins);
  const [hoveredPinInfo, setHoveredPinInfo] = useState<{
    pin: GhostPin;
    x: number;
    y: number;
    color: string;
  } | null>(null);
  const isFrameScheduledRef = useRef(false);

  useEffect(() => {
    pinsRef.current = pins;
  }, [pins]);

  const [magnetTarget, setMagnetTarget] = useState<{
    pin: GhostPin;
    dx: number;
    dy: number;
    dist: number;
  } | null>(null);

  // Auto-Spin State & Configuration
  const [isSpinning, setIsSpinning] = useState(true);
  const [isWorldZoomedOut, setIsWorldZoomedOut] = useState(true);
  const isSpinningRef = useRef(true);
  const userInteractingRef = useRef(false);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedPinRef = useRef<GhostPin | null>(selectedPin);
  useEffect(() => {
    selectedPinRef.current = selectedPin;
    const zoom = mapRef.current?.getZoom() ?? WORLD_VIEW_ZOOM;
    setIsWorldZoomedOut(zoom <= 3.55 && !selectedPin);
  }, [selectedPin]);

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

    const [activeNexus, setActiveNexus] = useState<ActiveNexusData | null>(null);

  const handleExploreNexus = useCallback((nexus: ActiveNexusData) => {
    setActiveNexus(null);
    const map = mapRef.current;
    if (!map) return;

    if (nexus.isCluster) {
      userInteractingRef.current = true;
      map.easeTo({
        center: nexus.coords,
        zoom: 4.85,
        duration: 900,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
      setTimeout(() => {
        userInteractingRef.current = false;
      }, 1000);
    } else if (nexus.pinId) {
      const targetPin = pinsRef.current.find((p) => p.id === nexus.pinId);
      if (targetPin) {
        flyToPin(targetPin);
        onSelectPin(targetPin);
      }
    }
  }, [flyToPin, onSelectPin]);

  const spinGlobe = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    if (userInteractingRef.current) return;
    if (!isSpinningRef.current) return;
    if (selectedPinRef.current) return;

    const zoom = map.getZoom();
    const maxSpinZoom = 4.2;
    const slowSpinZoom = 2.4;
    const secondsPerRevolution = 160; // Complete revolution every ~2.6 minutes (slow, majestic spin)

    if (zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = map.getCenter();
      center.lng -= distancePerSecond;
      // Smooth continuous animation over 1 second with linear easing
      map.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  }, []);

  const resumeSpinAfterDelay = useCallback(() => {
    if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    spinTimeoutRef.current = setTimeout(() => {
      userInteractingRef.current = false;
      if (isSpinningRef.current && !selectedPinRef.current) {
        spinGlobe();
      }
    }, 2200);
  }, [spinGlobe]);

  useEffect(() => {
    selectedPinRef.current = selectedPin;
    if (!selectedPin && isSpinningRef.current) {
      userInteractingRef.current = false;
      resumeSpinAfterDelay();
    }
  }, [selectedPin, resumeSpinAfterDelay]);

  // Occlude markers that rotate onto the backside of the 3D globe (Spherical Horizon Culling)
  const updateMarkerVisibility = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const zoom = map.getZoom();

    // At overview zoom (< 3.8), hide ALL DOM markers to eliminate lag!
    // The WebGL "Radio Garden Nexus" layer handles rendering at 60fps!
    const isOverviewZoom = zoom < 3.8 && !selectedPinRef.current;
    if (isOverviewZoom) {
      for (let i = 0; i < markerItemsRef.current.length; i++) {
        const item = markerItemsRef.current[i];
        if (item.isVisible) {
          item.isVisible = false;
          item.element.style.display = 'none';
        }
      }
      return;
    }

    const center = map.getCenter();
    const toRad = Math.PI / 180;
    const phi1 = center.lat * toRad;
    const cLngRad = center.lng * toRad;
    const cosPhi1 = Math.cos(phi1);
    const sinPhi1 = Math.sin(phi1);

    // Visible horizon threshold: At full globe overview (zoom < 3.5), visible hemisphere is ~80 deg from center
    const horizonThreshold = zoom > 4.5 ? -0.2 : 0.12;

    for (let i = 0; i < markerItemsRef.current.length; i++) {
      const item = markerItemsRef.current[i];
      const phi2 = item.pin.lat * toRad;
      const deltaLambda = item.pin.lng * toRad - cLngRad;
      const cosDist = sinPhi1 * Math.sin(phi2) + cosPhi1 * Math.cos(phi2) * Math.cos(deltaLambda);
      const isNowVisible = cosDist >= horizonThreshold;

      if (item.isVisible !== isNowVisible) {
        item.isVisible = isNowVisible;
        item.element.style.display = isNowVisible ? 'flex' : 'none';
      }

      if (isNowVisible && horizonThreshold > 0) {
        const fade = Math.min(1, Math.max(0, (cosDist - horizonThreshold) / 0.12));
        item.element.style.opacity = fade >= 0.98 ? '1' : fade.toFixed(2);
      }
    }
  }, []);

  // Compute closest pin to screen center and apply gentle magnetic pull on markers
  const updateMagneticField = useCallback(() => {
    const map = mapRef.current;
    const container = mapContainerRef.current;
    if (!map || !container) return;

    // Skip magnetic calculations in overview zoom
    if (map.getZoom() < 3.8) {
      setMagnetTarget(null);
      return;
    }

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
            id: 'solid-globe-background',
            type: 'background',
            paint: {
              'background-color': '#030814',
            },
          },
          {
            id: 'nasa-base-layer',
            type: 'raster',
            source: 'nasa-blue-marble',
            minzoom: 0,
            maxzoom: 22,
            paint: {
              'raster-brightness-max': 0.98,
              'raster-contrast': 0.08,
              'raster-saturation': 0.04,
              'raster-fade-duration': 0,
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
              'raster-brightness-max': 0.92,
              'raster-contrast': 0.04,
              'raster-saturation': 0,
              'raster-fade-duration': 200,
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
                0.28,
                4,
                0.2,
                7.5,
                0.12,
                11,
                0.05,
              ],
              'raster-fade-duration': 0,
            },
          },
        ],
        sky: {
          'sky-color': '#01040a',
          'sky-horizon-blend': 0.15,
          'horizon-color': '#06202c',
          'horizon-fog-blend': 0.2,
          'fog-color': '#01050d',
          'fog-ground-blend': 0.1,
          'atmosphere-blend': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0,
            0.18,
            5,
            0.12,
            8,
            0.05,
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

    const scheduleThrottledUpdate = () => {
      if (isFrameScheduledRef.current) return;
      isFrameScheduledRef.current = true;
      requestAnimationFrame(() => {
        isFrameScheduledRef.current = false;
        updateMarkerVisibility();
        updateMagneticField();
      });
    };

    const setupNexusLayers = () => {
      if (map.getSource('folklore-nexus')) return;

      map.addSource('folklore-nexus', {
        type: 'geojson',
        data: createPinsGeoJson(pinsRef.current),
        cluster: true,
        clusterMaxZoom: 4,
        clusterRadius: 36,
      });

      // 1. Cluster Outer Radiant Aura (Radio Garden Spectral Pulse)
      map.addLayer({
        id: 'nexus-cluster-aura',
        type: 'circle',
        source: 'folklore-nexus',
        filter: ['has', 'point_count'],
        maxzoom: 3.85,
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#00ff88',
            12,
            '#38bdf8',
            25,
            '#fbbf24',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            16,
            12,
            20,
            25,
            24,
          ],
          'circle-opacity': 0.45,
          'circle-blur': 0.75,
        },
      });

      // 2. Cluster Middle Core Ring
      map.addLayer({
        id: 'nexus-cluster-ring',
        type: 'circle',
        source: 'folklore-nexus',
        filter: ['has', 'point_count'],
        maxzoom: 3.85,
        paint: {
          'circle-color': '#031412',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            7.5,
            12,
            9.5,
            25,
            12.5,
          ],
          'circle-stroke-width': 1.8,
          'circle-stroke-color': [
            'step',
            ['get', 'point_count'],
            '#34d399',
            12,
            '#38bdf8',
            25,
            '#fde047',
          ],
          'circle-opacity': 0.95,
        },
      });

      // 3. Cluster Inner Center Dot
      map.addLayer({
        id: 'nexus-cluster-core',
        type: 'circle',
        source: 'folklore-nexus',
        filter: ['has', 'point_count'],
        maxzoom: 3.85,
        paint: {
          'circle-color': '#ffffff',
          'circle-radius': 3,
          'circle-opacity': 0.9,
        },
      });

      // 4. Single unclustered spectral beacon dot
      map.addLayer({
        id: 'nexus-single-aura',
        type: 'circle',
        source: 'folklore-nexus',
        filter: ['!', ['has', 'point_count']],
        maxzoom: 3.85,
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': 13,
          'circle-opacity': 0.45,
          'circle-blur': 0.65,
        },
      });

      map.addLayer({
        id: 'nexus-single-core',
        type: 'circle',
        source: 'folklore-nexus',
        filter: ['!', ['has', 'point_count']],
        maxzoom: 3.85,
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': 3.5,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.95,
        },
      });

      // Click on cluster: Fetch cluster leaves & show responsive Occult Nexus Card for Mobile & Desktop!
      const onClusterClick = async (e: any) => {
        if (!e.features || !e.features[0]) return;
        const feat = e.features[0];
        const clusterId = feat.properties?.cluster_id;
        const pointCount = feat.properties?.point_count || 0;
        const geom = feat.geometry as any;
        const coords = geom.coordinates as [number, number];

        const source = map.getSource('folklore-nexus') as GeoJSONSource | undefined;
        if (!source || clusterId === undefined) return;

        try {
          const leaves = await source.getClusterLeaves(clusterId, 6, 0);
          if (!leaves || !leaves.length) return;
          const firstProps = (leaves[0].properties || {}) as any;
          const province = language === 'th' ? firstProps.province_th : firstProps.province_en;
          const titles = leaves.map((l: any) =>
            language === 'th' ? l.properties?.title_th : l.properties?.title_en
          ).filter(Boolean);
          const color = firstProps.color || '#34d399';

          setActiveNexus({
            isCluster: true,
            coords,
            title: province || (language === 'th' ? 'แหล่งรวมเรื่องเล่า' : 'Folklore Cluster'),
            subtitle: language === 'th' ? `พบ ${pointCount} ตำนานลี้ลับในบริเวณนี้` : `${pointCount} folklore legends in this area`,
            count: pointCount,
            titles,
            color,
          });
        } catch (err) {
          console.warn('Failed to get cluster leaves:', err);
        }
      };

      map.on('click', 'nexus-cluster-ring', onClusterClick);
      map.on('click', 'nexus-cluster-core', onClusterClick);
      map.on('click', 'nexus-cluster-aura', onClusterClick);

      // Click on single point: Show single folklore card
      const onSingleClick = (e: any) => {
        if (!e.features || !e.features[0]) return;
        const feat = e.features[0];
        const geom = feat.geometry as any;
        const coords = geom.coordinates as [number, number];
        const props = feat.properties as any;

        setActiveNexus({
          isCluster: false,
          coords,
          title: language === 'th' ? props.title_th : props.title_en,
          subtitle: language === 'th' ? props.province_th : props.province_en,
          snippet: language === 'th' ? props.story_th : props.story_en,
          color: props.color || '#38bdf8',
          pinId: props.id,
          category: props.category,
        });
      };

      map.on('click', 'nexus-single-core', onSingleClick);
      map.on('click', 'nexus-single-aura', onSingleClick);

      // Dismiss card when clicking anywhere on the empty globe
      map.on('click', (e) => {
        const feats = map.queryRenderedFeatures(e.point, {
          layers: ['nexus-cluster-ring', 'nexus-cluster-core', 'nexus-single-core', 'nexus-single-aura'],
        });
        if (!feats || !feats.length) {
          setActiveNexus(null);
        }
      });

      map.on('mouseenter', 'nexus-cluster-ring', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'nexus-cluster-ring', () => {
        map.getCanvas().style.cursor = '';
      });
      map.on('mouseenter', 'nexus-single-core', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'nexus-single-core', () => {
        map.getCanvas().style.cursor = '';
      });
    };

    map.on('style.load', () => {
      try {
        map.setProjection({ type: 'globe' });
      } catch (e) {
        console.warn('Globe projection error:', e);
      }
      setupNexusLayers();
      scheduleThrottledUpdate();
      spinGlobe();
      if (onMapReady) onMapReady();
    });

    map.on('load', () => {
      setupNexusLayers();
      if (onMapReady) onMapReady();
    });

    map.on('move', scheduleThrottledUpdate);
    map.on('zoom', () => {
      setHoveredPinInfo(null);
      setIsWorldZoomedOut(map.getZoom() <= 3.8 && !selectedPinRef.current);
    });
    map.on('render', scheduleThrottledUpdate);

    // Continuously spin globe when animation completes (only if user is not dragging/interacting)
    map.on('moveend', () => {
      setIsWorldZoomedOut(map.getZoom() <= 3.8 && !selectedPinRef.current);
      if (!selectedPinRef.current && isSpinningRef.current && !userInteractingRef.current) {
        spinGlobe();
      }
    });

    // Zero-resistance interaction handlers:
    // When user starts interacting, set userInteractingRef = true so spin pauses.
    // NEVER call map.stop() inside mousedown/touchstart/dragstart because that aborts MapLibre's dragPan gesture!
    map.on('mousedown', () => {
      userInteractingRef.current = true;
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      map.stop();
    });
    map.on('touchstart', () => {
      userInteractingRef.current = true;
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      map.stop();
    });
    map.on('dragstart', () => {
      setHoveredPinInfo(null);
      userInteractingRef.current = true;
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    });
    map.on('drag', () => {
      userInteractingRef.current = true;
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    });
    map.on('wheel', () => {
      userInteractingRef.current = true;
      resumeSpinAfterDelay();
    });
    map.on('mouseup', () => {
      resumeSpinAfterDelay();
    });
    map.on('touchend', () => {
      resumeSpinAfterDelay();
    });
    map.on('dragend', () => {
      userInteractingRef.current = true;
      resumeSpinAfterDelay();
    });

    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      // Clear markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      markerInnerElsRef.current.clear();
    markerItemsRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [updateMagneticField, updateMarkerVisibility, spinGlobe, resumeSpinAfterDelay]);

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
      userInteractingRef.current = false;
      selectedPinRef.current = null;
      setIsWorldZoomedOut(true);
      flyToWorldView();
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      spinTimeoutRef.current = setTimeout(() => {
        userInteractingRef.current = false;
        selectedPinRef.current = null;
        spinGlobe();
      }, 1300);
    }
  }, [worldViewSignal, flyToWorldView, spinGlobe]);

  // 2. Render Markers reliably whenever `pins` or `selectedPin` changes
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    markerInnerElsRef.current.clear();

    // Update GeoJSON source for Radio Garden Nexus layer
    const nexusSource = map.getSource('folklore-nexus') as GeoJSONSource | undefined;
    if (nexusSource) {
      nexusSource.setData(createPinsGeoJson(pins));
    }

    const isOverview = map.getZoom() < 3.8 && !selectedPin;

    // Create distinctive, prominent category-specific 3D Occult Diamond Markers (Ultra-lightweight)
    pins.forEach((pin) => {
      const isSelected = selectedPin?.id === pin.id;
      const catStyle = CATEGORY_MARKER_STYLES[pin.category] || CATEGORY_MARKER_STYLES.legend;

      const el = document.createElement('div');
      el.className = 'cursor-pointer select-none group relative';
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.display = isOverview ? 'none' : 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      const innerWrap = document.createElement('div');
      innerWrap.style.position = 'relative';
      innerWrap.style.display = 'flex';
      innerWrap.style.alignItems = 'center';
      innerWrap.style.justifyContent = 'center';
      innerWrap.style.transition = 'transform 160ms cubic-bezier(0.2, 1, 0.3, 1)';
      innerWrap.innerHTML = `
        <span class="marker-ping-halo" style="
          position: absolute;
          width: ${isSelected ? '30px' : '20px'};
          height: ${isSelected ? '30px' : '20px'};
          border-radius: 9999px;
          background-color: ${catStyle.color};
          opacity: ${isSelected ? '0.7' : '0.35'};
          filter: blur(1.5px);
          ${isSelected ? 'animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}
          transition: opacity 200ms ease;
        "></span>
        <div style="
          position: relative;
          width: ${isSelected ? '26px' : '20px'};
          height: ${isSelected ? '26px' : '20px'};
          border-radius: ${isSelected ? '9px' : '7px'};
          background: ${catStyle.bgGradient};
          border: 1.8px solid ${isSelected ? '#ffffff' : catStyle.color};
          box-shadow: 0 0 14px ${catStyle.glow}, 0 3px 8px rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
        ">
          <div style="
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,0.85));
          ">
            ${catStyle.iconSvg}
          </div>
        </div>
      `;

      el.appendChild(innerWrap);
      markerInnerElsRef.current.set(pin.id, innerWrap);

      // Dynamic lightweight hover: Activates ping only when mouse is over this specific marker!
      el.addEventListener('mouseenter', () => {
        userInteractingRef.current = true;
        if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
        const halo = innerWrap.querySelector('.marker-ping-halo') as HTMLElement | null;
        if (halo && !isSelected) {
          halo.style.animation = 'ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite';
          halo.style.opacity = '0.75';
        }
        const rect = el.getBoundingClientRect();
        setHoveredPinInfo({
          pin,
          x: rect.left + rect.width / 2,
          y: rect.top,
          color: catStyle.color,
        });
      });

      el.addEventListener('mouseleave', () => {
        const halo = innerWrap.querySelector('.marker-ping-halo') as HTMLElement | null;
        if (halo && !isSelected) {
          halo.style.animation = '';
          halo.style.opacity = '0.35';
        }
        setHoveredPinInfo(null);
        resumeSpinAfterDelay();
      });

      // Click Interaction: zooms in and opens full StoryDrawer
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setHoveredPinInfo(null);
        flyToPin(pin);
        onSelectPin(pin);
      });

      const marker = new Marker({ element: el, anchor: 'center' })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);

      markersRef.current.push(marker);
      markerItemsRef.current.push({ marker, pin, element: el, isVisible: !isOverview });
    });

    updateMagneticField();
  }, [pins, selectedPin, onSelectPin, language, flyToPin, updateMagneticField]);

  const isLocked = Boolean(magnetTarget && magnetTarget.dist < 22);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#02060d]">
      {/* MapLibre 3D Globe Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Deep nocturnal vignette around viewport edges (crisp, solid globe) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, transparent 58%, rgba(2, 6, 12, 0.45) 85%, rgba(1, 3, 7, 0.9) 100%)',
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

        </div>
      </div>

      {/* High-Performance Singleton Hover Preview Card */}
      {hoveredPinInfo && (
        <div
          className="fixed z-50 pointer-events-auto cursor-pointer animate-in fade-in zoom-in-95 duration-150 select-none"
          style={{
            left: Math.min(Math.max(150, hoveredPinInfo.x), typeof window !== 'undefined' ? window.innerWidth - 150 : 200),
            top: hoveredPinInfo.y < 210 ? hoveredPinInfo.y + 44 : hoveredPinInfo.y - 12,
            transform: hoveredPinInfo.y < 210 ? 'translateX(-50%)' : 'translate(-50%, -100%)',
            width: '275px',
          }}
          onClick={() => {
            flyToPin(hoveredPinInfo.pin);
            onSelectPin(hoveredPinInfo.pin);
            setHoveredPinInfo(null);
          }}
        >
          <div className="flex flex-col bg-[#070c15]/95 border border-amber-400/45 rounded-2xl overflow-hidden backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.85),0_0_24px_rgba(16,185,129,0.35)]">
            <div className="flex gap-2.5 p-2.5 pb-1.5 items-center">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-400/50 shrink-0 bg-slate-900">
                <img
                  src={hoveredPinInfo.pin.image_url || `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80`}
                  alt={hoveredPinInfo.pin.title_th}
                  onError={(e) => {
                    const yt = hoveredPinInfo.pin.gallery_media?.find(m => m.type === 'youtube')?.thumbnail;
                    (e.target as HTMLImageElement).src = yt || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span
                  className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: hoveredPinInfo.color, boxShadow: `0 0 8px ${hoveredPinInfo.color}` }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className="inline-block text-[9px] font-bold rounded px-1.5 py-0.5 tracking-wider uppercase"
                  style={{
                    color: hoveredPinInfo.color,
                    backgroundColor: `${hoveredPinInfo.color}22`,
                    border: `1px solid ${hoveredPinInfo.color}55`,
                  }}
                >
                  {hoveredPinInfo.pin.category}
                </span>
                <p className="mt-0.5 text-[13px] font-bold text-amber-100 truncate leading-tight">
                  {language === 'th' ? hoveredPinInfo.pin.title_th : hoveredPinInfo.pin.title_en}
                </p>
                <p className="mt-0.5 text-[11px] text-emerald-300 truncate">
                  📍 {language === 'th' ? hoveredPinInfo.pin.province_th : hoveredPinInfo.pin.province_en}
                </p>
              </div>
            </div>
            <p className="px-2.5 pb-2 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              {language === 'th' ? hoveredPinInfo.pin.story_th : hoveredPinInfo.pin.story_en}
            </p>
            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/80 border-t border-white/10 text-[10px] text-amber-400 font-semibold">
              <span>{language === 'th' ? '👆 คลิกเพื่อซูมเข้าสู่บันทึก' : '👆 Click to zoom & explore'}</span>
              <span className="text-emerald-400 text-xs">↗</span>
            </div>
          </div>
        </div>
      )}

      {/* Folklore Nexus Details Card (Mobile Touch & Desktop Responsive) */}
      {activeNexus && (
        <div
          className="fixed z-50 pointer-events-auto select-none left-1/2 -translate-x-1/2 w-[92vw] sm:w-[390px] max-w-[420px] animate-in fade-in zoom-in-95 duration-200"
          style={{
            bottom: 'max(5.6rem, calc(env(safe-area-inset-bottom, 0px) + 5.2rem))',
          }}
        >
          <div className="relative flex flex-col bg-[#070c16]/95 border border-emerald-500/40 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_28px_rgba(16,185,129,0.28)] p-3.5 sm:p-4 text-slate-200">
            {/* Header: Category / Nexus Badge + Close Button */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 animate-ping [animation-duration:2.5s]"
                  style={{ backgroundColor: activeNexus.color, boxShadow: `0 0 10px ${activeNexus.color}` }}
                />
                <span
                  className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    color: activeNexus.color,
                    backgroundColor: `${activeNexus.color}20`,
                    border: `1px solid ${activeNexus.color}45`,
                  }}
                >
                  {activeNexus.isCluster
                    ? (language === 'th' ? `🌐 ชุมทาง ${activeNexus.count} ตำนาน` : `🌐 Nexus (${activeNexus.count} Legends)`)
                    : (activeNexus.category || (language === 'th' ? 'เรื่องเล่าลี้ลับ' : 'Folklore'))}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveNexus(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Location Subtitle */}
            <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-snug line-clamp-1">
              {activeNexus.title}
            </h3>
            <p className="text-xs text-emerald-300/90 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0 text-emerald-400" />
              <span className="truncate">{activeNexus.subtitle}</span>
            </p>

            {/* Body: Story Snippet or Cluster Story Titles List */}
            {activeNexus.isCluster ? (
              <div className="mt-2.5 space-y-1.5">
                <p className="text-[11px] text-slate-400 font-medium">
                  {language === 'th' ? 'ตัวอย่างตำนานในพื้นที่นี้:' : 'Featured legends in this region:'}
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                  {activeNexus.titles?.slice(0, 4).map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-slate-900/90 border border-slate-700/60 text-slate-300 px-2 py-0.5 rounded-lg truncate max-w-[200px]"
                    >
                      {t}
                    </span>
                  ))}
                  {(activeNexus.titles?.length || 0) > 4 && (
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5">
                      +{((activeNexus.titles?.length || 0) - 4)} {language === 'th' ? 'เรื่องอื่นๆ' : 'more'}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              activeNexus.snippet && (
                <p className="mt-2 text-xs text-slate-300/85 line-clamp-2 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-white/5">
                  {activeNexus.snippet}
                </p>
              )
            )}

            {/* Action Explore Button (Touch friendly, 44px+ height on mobile) */}
            <button
              type="button"
              onClick={() => handleExploreNexus(activeNexus)}
              className="mt-3 w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-lg text-emerald-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-[0_0_18px_rgba(16,185,129,0.35)]"
            >
              {activeNexus.isCluster ? (
                <Compass className="w-4 h-4 text-emerald-900" />
              ) : (
                <BookOpen className="w-4 h-4 text-emerald-900" />
              )}
              <span>
                {activeNexus.isCluster
                  ? (language === 'th' ? 'ซูมเจาะลึกชุมทางนี้' : 'Zoom into Nexus')
                  : (language === 'th' ? 'เปิดอ่านบันทึกตำนาน' : 'Read Full Lore')}
              </span>
              <span className="text-base leading-none">↗</span>
            </button>
          </div>
        </div>
      )}

      {/* World Comment Fountain & Input Bar (Only unlocked when zoomed out to World View) */}
      <WorldCommentBar
        isWorldZoomedOut={isWorldZoomedOut}
        onZoomOut={() => {
          if (onZoomOut) {
            onZoomOut();
          } else {
            userInteractingRef.current = false;
            selectedPinRef.current = null;
            setIsWorldZoomedOut(true);
            flyToWorldView();
          }
        }}
        language={language}
      />

      {/* Auto-Rotation Control Pill (Bottom Left - Fixed & Safe-Area Aware for Mobile & Desktop) */}
      <div
        className="fixed left-4 sm:left-6 z-30 flex items-center gap-2 pointer-events-auto"
        style={{ bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.85rem))' }}
      >
        <button
          type="button"
          onClick={() => {
            setIsSpinning((prev) => {
              const next = !prev;
              isSpinningRef.current = next;
              if (next) {
                userInteractingRef.current = false;
                spinGlobe();
              } else {
                mapRef.current?.stop();
              }
              return next;
            });
          }}
          className={`px-3.5 py-2 sm:py-1.5 rounded-full border backdrop-blur-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-lg select-none active:scale-95 ${
            isSpinning
              ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200 hover:bg-emerald-900/85 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-slate-950/90 border-slate-700/70 text-slate-300 hover:bg-slate-900/85'
          }`}
          title={
            isSpinning
              ? getTranslation(language).autoRotateOn
              : getTranslation(language).autoRotateOff
          }
        >
          <RotateCw
            className={`w-3.5 h-3.5 text-emerald-400 ${
              isSpinning ? 'animate-spin [animation-duration:8s]' : 'opacity-40'
            }`}
          />
          <span>
            {isSpinning
              ? getTranslation(language).autoRotateOn
              : getTranslation(language).autoRotateOff}
          </span>
        </button>
      </div>
    </div>
  );
};

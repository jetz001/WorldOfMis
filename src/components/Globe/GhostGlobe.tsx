import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, NavigationControl, Marker, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { RotateCw } from 'lucide-react';

// Fix: point MapLibre to our bundled worker so Cloudflare Pages
// returns the correct JS MIME type instead of an HTML 404 page.
setWorkerUrl('/maplibre-gl-worker.mjs');
import type { GhostPin, SupportedLanguage } from '../../types/ghost';
import { registerCloudMistProtocol } from './cloudMistLayer';

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

  const [magnetTarget, setMagnetTarget] = useState<{
    pin: GhostPin;
    dx: number;
    dy: number;
    dist: number;
  } | null>(null);

  // Auto-Spin State & Configuration
  const [isSpinning, setIsSpinning] = useState(true);
  const isSpinningRef = useRef(true);
  const userInteractingRef = useRef(false);
  const spinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedPinRef = useRef<GhostPin | null>(selectedPin);

  const spinGlobe = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const zoom = map.getZoom();
    const maxSpinZoom = 4.2;
    const slowSpinZoom = 2.4;
    const secondsPerRevolution = 160; // Complete revolution every ~2.6 minutes (slow, majestic spin)

    if (
      isSpinningRef.current &&
      !userInteractingRef.current &&
      zoom < maxSpinZoom &&
      !selectedPinRef.current
    ) {
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
      spinGlobe();
    }, 1200);
  }, [spinGlobe]);

  useEffect(() => {
    selectedPinRef.current = selectedPin;
    if (!selectedPin && isSpinningRef.current) {
      resumeSpinAfterDelay();
    }
  }, [selectedPin, resumeSpinAfterDelay]);

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
      // Start initial slow auto-rotation
      spinGlobe();
    });

    map.on('move', () => {
      updateMagneticField();
    });

    // Continuously spin globe when animation completes
    map.on('moveend', () => {
      spinGlobe();
    });

    // Pause spinning during interaction
    map.on('mousedown', () => {
      userInteractingRef.current = true;
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    });
    map.on('dragstart', () => {
      userInteractingRef.current = true;
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
    });
    map.on('touchstart', () => {
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

    // Gentle magnetic snap when user finishes dragging near a pin
    map.on('dragend', () => {
      resumeSpinAfterDelay();
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

    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      // Clear markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      markerInnerElsRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [updateMagneticField, spinGlobe, resumeSpinAfterDelay]);

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
    markerInnerElsRef.current.clear();

    // Create high-visibility Spectral Green Dot Markers with hover preview card & click-to-zoom
    pins.forEach((pin) => {
      const isSelected = selectedPin?.id === pin.id;

      const el = document.createElement('div');
      el.className = 'cursor-pointer select-none group relative';
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

      // Hover Preview Card (Appears on mouse hover without zooming the camera)
      const card = document.createElement('div');
      card.style.position = 'absolute';
      card.style.zIndex = '9999';
      card.style.width = '275px';
      card.style.pointerEvents = 'auto';
      card.style.opacity = '0';
      card.style.visibility = 'hidden';
      card.style.transition = 'opacity 180ms ease, transform 180ms ease, visibility 180ms';
      card.style.transform = 'translateX(-50%) translateY(6px) scale(0.95)';
      card.style.cursor = 'pointer';

      const cardBox = document.createElement('div');
      cardBox.style.display = 'flex';
      cardBox.style.flexDirection = 'column';
      cardBox.style.background = 'rgba(7, 12, 21, 0.96)';
      cardBox.style.border = '1px solid rgba(251, 191, 36, 0.45)';
      cardBox.style.borderRadius = '14px';
      cardBox.style.overflow = 'hidden';
      cardBox.style.backdropFilter = 'blur(16px)';
      cardBox.style.boxShadow = '0 12px 32px rgba(0,0,0,0.85), 0 0 24px rgba(16, 185, 129, 0.35)';

      // Header row with portrait + title & location
      const headerRow = document.createElement('div');
      headerRow.style.display = 'flex';
      headerRow.style.gap = '10px';
      headerRow.style.padding = '10px 10px 6px 10px';
      headerRow.style.alignItems = 'center';

      const thumbWrap = document.createElement('div');
      thumbWrap.style.position = 'relative';
      thumbWrap.style.width = '52px';
      thumbWrap.style.height = '52px';
      thumbWrap.style.borderRadius = '10px';
      thumbWrap.style.overflow = 'hidden';
      thumbWrap.style.border = '1px solid rgba(251, 191, 36, 0.5)';
      thumbWrap.style.flexShrink = '0';
      thumbWrap.style.background = '#0f172a';

      const thumbImg = document.createElement('img');
      thumbImg.src = pin.image_url || `/entities/${pin.id}.jpg`;
      thumbImg.alt = pin.title_th;
      thumbImg.style.width = '100%';
      thumbImg.style.height = '100%';
      thumbImg.style.objectFit = 'cover';
      thumbWrap.appendChild(thumbImg);

      const statusDot = document.createElement('span');
      statusDot.style.position = 'absolute';
      statusDot.style.bottom = '3px';
      statusDot.style.right = '3px';
      statusDot.style.width = '7px';
      statusDot.style.height = '7px';
      statusDot.style.borderRadius = '9999px';
      statusDot.style.background = '#00ff88';
      statusDot.style.boxShadow = '0 0 6px #00ff88';
      thumbWrap.appendChild(statusDot);

      headerRow.appendChild(thumbWrap);

      const infoCol = document.createElement('div');
      infoCol.style.minWidth = '0';
      infoCol.style.flex = '1';

      const catBadge = document.createElement('span');
      catBadge.textContent = pin.category.toUpperCase();
      catBadge.style.display = 'inline-block';
      catBadge.style.fontSize = '9px';
      catBadge.style.fontWeight = '700';
      catBadge.style.color = '#34d399';
      catBadge.style.background = 'rgba(16,185,129,0.15)';
      catBadge.style.border = '1px solid rgba(16,185,129,0.3)';
      catBadge.style.borderRadius = '4px';
      catBadge.style.padding = '1px 5px';
      catBadge.style.letterSpacing = '0.5px';
      infoCol.appendChild(catBadge);

      const titleEl = document.createElement('p');
      titleEl.textContent = language === 'th' ? pin.title_th : pin.title_en;
      titleEl.style.margin = '3px 0 0 0';
      titleEl.style.fontSize = '13px';
      titleEl.style.fontWeight = '700';
      titleEl.style.color = '#fef3c7';
      titleEl.style.lineHeight = '1.25';
      titleEl.style.overflow = 'hidden';
      titleEl.style.textOverflow = 'ellipsis';
      titleEl.style.whiteSpace = 'nowrap';
      infoCol.appendChild(titleEl);

      const locEl = document.createElement('p');
      locEl.textContent = `📍 ${language === 'th' ? pin.province_th : pin.province_en}`;
      locEl.style.margin = '2px 0 0 0';
      locEl.style.fontSize = '11px';
      locEl.style.color = '#6ee7b7';
      locEl.style.overflow = 'hidden';
      locEl.style.textOverflow = 'ellipsis';
      locEl.style.whiteSpace = 'nowrap';
      infoCol.appendChild(locEl);

      headerRow.appendChild(infoCol);
      cardBox.appendChild(headerRow);

      // Short teaser lore snippet
      const snippetEl = document.createElement('div');
      const fullStory = language === 'th' ? pin.story_th : pin.story_en;
      snippetEl.textContent = fullStory.length > 92 ? fullStory.slice(0, 92) + '...' : fullStory;
      snippetEl.style.padding = '0 10px 8px 10px';
      snippetEl.style.fontSize = '11px';
      snippetEl.style.lineHeight = '1.35';
      snippetEl.style.color = '#94a3b8';
      snippetEl.style.display = '-webkit-box';
      snippetEl.style.webkitLineClamp = '2';
      snippetEl.style.webkitBoxOrient = 'vertical';
      snippetEl.style.overflow = 'hidden';
      cardBox.appendChild(snippetEl);

      // Bottom Call-to-action
      const ctaBar = document.createElement('div');
      ctaBar.style.display = 'flex';
      ctaBar.style.alignItems = 'center';
      ctaBar.style.justifyContent = 'space-between';
      ctaBar.style.padding = '5px 10px';
      ctaBar.style.background = 'rgba(15, 23, 42, 0.75)';
      ctaBar.style.borderTop = '1px solid rgba(255,255,255,0.08)';
      ctaBar.style.fontSize = '10px';
      ctaBar.style.color = '#fbbf24';
      ctaBar.style.fontWeight = '600';

      const ctaText = document.createElement('span');
      ctaText.textContent = language === 'th' ? '👆 คลิกเพื่อซูมเข้าสู่บันทึก' : '👆 Click to zoom & explore';
      ctaBar.appendChild(ctaText);

      const ctaArrow = document.createElement('span');
      ctaArrow.textContent = '↗';
      ctaArrow.style.color = '#34d399';
      ctaArrow.style.fontSize = '12px';
      ctaBar.appendChild(ctaArrow);

      cardBox.appendChild(ctaBar);
      card.appendChild(cardBox);

      // Pointer Arrow Triangle
      const arrow = document.createElement('div');
      arrow.style.position = 'absolute';
      arrow.style.width = '0';
      arrow.style.height = '0';
      arrow.style.borderLeft = '6px solid transparent';
      arrow.style.borderRight = '6px solid transparent';
      card.appendChild(arrow);

      el.appendChild(card);

      // Hover Interaction: shows card without zooming in
      let isCardVisible = false;

      const showCard = () => {
        if (isCardVisible) return;
        isCardVisible = true;
        userInteractingRef.current = true;
        if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
        el.style.zIndex = '99999';

        const rect = el.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        let shiftX = -50;
        let arrowShiftX = 50;

        if (rect.left < 155) {
          shiftX = -15;
          arrowShiftX = 18;
        } else if (rect.right > screenWidth - 155) {
          shiftX = -85;
          arrowShiftX = 82;
        }

        const isTop = rect.top < 190;
        if (isTop) {
          card.style.bottom = 'auto';
          card.style.top = '100%';
          card.style.marginTop = '12px';
          card.style.marginBottom = '0px';
          arrow.style.bottom = 'auto';
          arrow.style.top = '-6px';
          arrow.style.borderTop = 'none';
          arrow.style.borderBottom = '6px solid rgba(7, 12, 21, 0.96)';
        } else {
          card.style.top = 'auto';
          card.style.bottom = '100%';
          card.style.marginTop = '0px';
          card.style.marginBottom = '12px';
          arrow.style.top = 'auto';
          arrow.style.bottom = '-6px';
          arrow.style.borderBottom = 'none';
          arrow.style.borderTop = '6px solid rgba(7, 12, 21, 0.96)';
        }

        arrow.style.left = `${arrowShiftX}%`;
        arrow.style.transform = 'translateX(-50%)';

        card.style.left = '50%';
        card.style.transform = `translateX(${shiftX}%) translateY(0) scale(1)`;
        card.style.opacity = '1';
        card.style.visibility = 'visible';
      };

      const hideCard = () => {
        if (!isCardVisible) return;
        isCardVisible = false;
        el.style.zIndex = '';
        card.style.opacity = '0';
        card.style.visibility = 'hidden';
        card.style.transform = 'translateX(-50%) translateY(6px) scale(0.95)';
        resumeSpinAfterDelay();
      };

      el.addEventListener('mouseenter', showCard);
      el.addEventListener('mouseleave', hideCard);

      // Click Interaction: zooms in and opens full StoryDrawer
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        hideCard();
        flyToPin(pin);
        onSelectPin(pin);
      });

      const marker = new Marker({ element: el, anchor: 'center' })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });

    updateMagneticField();
  }, [pins, selectedPin, onSelectPin, language, flyToPin, updateMagneticField]);

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

        </div>
      </div>

      {/* Auto-Rotation Control Pill (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsSpinning((prev) => {
              const next = !prev;
              isSpinningRef.current = next;
              if (next) spinGlobe();
              return next;
            });
          }}
          className={`px-3.5 py-1.5 rounded-full border backdrop-blur-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-lg select-none ${
            isSpinning
              ? 'bg-emerald-950/85 border-emerald-500/50 text-emerald-200 hover:bg-emerald-900/80 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
              : 'bg-slate-950/85 border-slate-700/60 text-slate-400 hover:bg-slate-900/80'
          }`}
          title={
            isSpinning
              ? language === 'th'
                ? 'แตะเพื่อพักการหมุนโลก'
                : 'Pause Globe Auto-Rotation'
              : language === 'th'
              ? 'แตะเพื่อเริ่มหมุนโลกช้าๆ อัตโนมัติ'
              : 'Start Globe Auto-Rotation'
          }
        >
          <RotateCw
            className={`w-3.5 h-3.5 text-emerald-400 ${
              isSpinning ? 'animate-spin [animation-duration:8s]' : 'opacity-40'
            }`}
          />
          <span>
            {language === 'th'
              ? isSpinning
                ? 'หมุนโลกช้าๆ: เปิด'
                : 'หมุนโลกช้าๆ: ปิด'
              : isSpinning
              ? 'Auto-Rotate: On'
              : 'Auto-Rotate: Off'}
          </span>
        </button>
      </div>
    </div>
  );
};

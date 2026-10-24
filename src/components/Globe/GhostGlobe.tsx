import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { GhostPin, SupportedLanguage } from '../../types/ghost';
import { EARTH_RADIUS, latLngToVector3 } from '../../lib/coordinates';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPin, setHoveredPin] = useState<{ pin: GhostPin; x: number; y: number } | null>(null);

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pinGroupRef = useRef<THREE.Group | null>(null);
  const pinMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const animationFrameRef = useRef<number | null>(null);

  // Smooth camera animation
  const cameraAnimRef = useRef<{
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    progress: number;
    duration: number;
  } | null>(null);

  // Fly camera to pin and center it in the Radio Garden circle
  const flyToPin = useCallback((pin: GhostPin) => {
    if (!cameraRef.current || !controlsRef.current) return;

    audioEngine.playRadioTuning();
    audioEngine.playPresetSound(pin.sound_preset);

    // Camera flies right in front of the location, zooming close (Radio Garden style)
    const targetPos = latLngToVector3(pin.lat, pin.lng, EARTH_RADIUS * 1.35, 0);

    cameraAnimRef.current = {
      startPos: cameraRef.current.position.clone(),
      endPos: targetPos,
      progress: 0,
      duration: 50, // ~0.8s smooth transition
    };
  }, []);

  useEffect(() => {
    if (selectedPin) {
      flyToPin(selectedPin);
    }
  }, [selectedPin, flyToPin]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Three.js Scene & Camera
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 1000);
    // Initial camera position focused on Asia / Southeast Asia
    const initialPos = latLngToVector3(15.0, 101.0, EARTH_RADIUS * 2.3, 0);
    camera.position.copy(initialPos);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. High Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls - UNRESTRICTED FREE ZOOM (Radio Garden Style)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.zoomSpeed = 0.9;
    // FREE UNRESTRICTED ZOOM: Can zoom all the way down to regional ground view!
    controls.minDistance = 2.06;
    controls.maxDistance = 14.0;
    controls.enablePan = false;
    controlsRef.current = controls;

    // 4. Load Pristine Satellite Earth Texture (No purple noise, true satellite colors)
    const textureLoader = new THREE.TextureLoader();

    // High Definition Satellite Imagery
    const satelliteTex = textureLoader.load('/textures/earth_satellite_hd.jpg');
    satelliteTex.colorSpace = THREE.SRGBColorSpace;
    satelliteTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 5. Earth Sphere (Clean Photorealistic Satellite Earth)
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 128, 128);
    const earthMat = new THREE.MeshStandardMaterial({
      map: satelliteTex,
      roughness: 0.85,
      metalness: 0.05,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // 6. Subtle Atmospheric Halo Rim (Soft Rayleigh scattering glow)
    const atmosGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.018, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
          // Soft atmospheric sky-blue haze on the horizon
          gl_FragColor = vec4(0.25, 0.65, 0.95, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // 7. Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 90 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x88bbff,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // 8. Balanced Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(5, 3, 6);
    scene.add(sunLight);

    // 9. Pins Group
    const pinGroup = new THREE.Group();
    scene.add(pinGroup);
    pinGroupRef.current = pinGroup;

    // Raycasting for interactive hover and click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinGroup.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.pin && obj.parent !== pinGroup) {
          obj = obj.parent;
        }
        if (obj?.userData?.pin) {
          container.style.cursor = 'pointer';
          setHoveredPin({
            pin: obj.userData.pin,
            x: e.clientX,
            y: e.clientY,
          });
          return;
        }
      }

      container.style.cursor = 'grab';
      setHoveredPin(null);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pinGroup.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.pin && obj.parent !== pinGroup) {
          obj = obj.parent;
        }
        if (obj?.userData?.pin) {
          const pin = obj.userData.pin as GhostPin;
          onSelectPin(pin);
          flyToPin(pin);
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Smooth camera interpolation
      if (cameraAnimRef.current) {
        const anim = cameraAnimRef.current;
        anim.progress += 1 / anim.duration;
        const t = Math.min(anim.progress, 1.0);
        const ease = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(anim.startPos, anim.endPos, ease);
        camera.lookAt(0, 0, 0);

        if (t >= 1.0) {
          cameraAnimRef.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
    };
  }, [onSelectPin, flyToPin]);

  // Update 3D Pins with exact Radio Garden signature green dots
  useEffect(() => {
    if (!pinGroupRef.current) return;
    const pinGroup = pinGroupRef.current;

    while (pinGroup.children.length > 0) {
      pinGroup.remove(pinGroup.children[0]);
    }
    pinMeshesRef.current.clear();

    pins.forEach((pin) => {
      const pinObj = new THREE.Group();
      const pos = latLngToVector3(pin.lat, pin.lng, EARTH_RADIUS, 0.008);
      pinObj.position.copy(pos);

      // Orient pin normal to surface
      const normal = pos.clone().normalize();
      pinObj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // Radio Garden Signature Electric Green (#00ff88)
      const isSelected = selectedPin?.id === pin.id;
      const dotColor = isSelected ? 0xffffff : 0x00ff88;

      // 1. Tiny Crisp Glowing Core Dot (Radio Garden style: small, clean, precise)
      const dotRadius = isSelected ? 0.014 : 0.009;
      const dotGeo = new THREE.SphereGeometry(dotRadius, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: dotColor });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.y = 0.006;
      pinObj.add(dot);

      // 2. Subtle Soft Halo (Clean & minimal, not giant discs)
      const haloGeo = new THREE.RingGeometry(dotRadius * 1.2, dotRadius * 2.2, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.8 : 0.45,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 2;
      halo.position.y = 0.006;
      pinObj.add(halo);

      pinObj.userData = { pin };
      pinGroup.add(pinObj);
      pinMeshesRef.current.set(pin.id, pinObj);
    });
  }, [pins, selectedPin]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#03060c]">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Radio Garden Signature White Center Reticle Circle (from Radio Garden screenshot!) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-white/80 shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-center justify-center transition-all duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
        </div>
      </div>

      {/* Floating Tactical Tooltip on Pin Hover */}
      {hoveredPin && (
        <div
          className="pointer-events-none fixed z-30 transform -translate-x-1/2 -translate-y-full mb-5 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-emerald-400/60 backdrop-blur-md shadow-[0_0_20px_rgba(0,255,136,0.3)] animate-in fade-in duration-150"
          style={{ left: hoveredPin.x, top: hoveredPin.y - 10 }}
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

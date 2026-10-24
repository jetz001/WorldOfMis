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

interface HoveredPinInfo {
  pin: GhostPin;
  x: number;
  y: number;
}

export const GhostGlobe: React.FC<GhostGlobeProps> = ({
  pins,
  selectedPin,
  onSelectPin,
  language,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPin, setHoveredPin] = useState<HoveredPinInfo | null>(null);

  // References across lifecycle
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pinGroupRef = useRef<THREE.Group | null>(null);
  const pinObjectsRef = useRef<Map<string, { group: THREE.Group; rings: THREE.Mesh[] }>>(new Map());
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Camera animation
  const cameraAnimRef = useRef<{
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    progress: number;
    duration: number;
  } | null>(null);

  // Smooth fly-to pin on click
  const flyToPin = useCallback((pin: GhostPin) => {
    if (!cameraRef.current || !controlsRef.current) return;

    audioEngine.playRadioTuning();
    audioEngine.playPresetSound(pin.sound_preset);

    // Zoom close to target location (Radio Garden style ~2.4 units, surface is 2.0)
    const targetPos = latLngToVector3(pin.lat, pin.lng, EARTH_RADIUS * 1.25, 0);

    cameraAnimRef.current = {
      startPos: cameraRef.current.position.clone(),
      endPos: targetPos,
      progress: 0,
      duration: 55, // ~0.9s smooth slerp
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

    // 1. Scene & Camera
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 1000);
    // Initial camera view (Asia / Global perspective)
    camera.position.set(0, 1.2, 4.8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls - UNRESTRICTED ZOOM (Like Radio Garden & Google Earth!)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 0.85;
    // FREE UNRESTRICTED ZOOM: Can zoom right down to surface!
    controls.minDistance = 2.08;
    controls.maxDistance = 14.0;
    controls.enablePan = false;
    controlsRef.current = controls;

    // 4. Photorealistic NASA Textures
    const textureLoader = new THREE.TextureLoader();

    // Day Surface Map (True-color Satellite Imagery)
    const earthDayTex = textureLoader.load('/textures/earth_atmos_2048.jpg');
    earthDayTex.colorSpace = THREE.SRGBColorSpace;

    // Normal / Topographic Relief Map
    const earthNormalTex = textureLoader.load('/textures/earth_normal_2048.jpg');

    // Specular / Water reflection map
    const earthSpecularTex = textureLoader.load('/textures/earth_specular_2048.jpg');

    // Night Lights Map
    const earthNightTex = textureLoader.load('/textures/earth_lights_2048.png');

    // Cloud Map
    const cloudsTex = textureLoader.load('/textures/earth_clouds_1024.png');

    // 5. Realistic Earth Sphere Mesh
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 96, 96);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthDayTex,
      normalMap: earthNormalTex,
      normalScale: new THREE.Vector2(0.65, 0.65),
      roughnessMap: earthSpecularTex,
      roughness: 0.75,
      metalness: 0.15,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // 6. Night Lights Sphere (Additive City Lights)
    const nightGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.002, 96, 96);
    const nightMat = new THREE.MeshBasicMaterial({
      map: earthNightTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85,
    });
    const nightMesh = new THREE.Mesh(nightGeo, nightMat);
    scene.add(nightMesh);

    // 7. Clouds Layer
    const cloudsGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.014, 96, 96);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    scene.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // 8. Ethereal Atmospheric Rayleigh Scattering Halo
    const atmosGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.045, 64, 64);
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
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          // Soft atmospheric blue-cyan rim glow
          gl_FragColor = vec4(0.2, 0.65, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // 9. Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 80 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.9,
      transparent: true,
      opacity: 0.7,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // 10. Lighting (Sun & Ambient)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(6, 4, 7);
    scene.add(sunLight);

    // 11. Pins Group
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

    // 12. Render Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow cloud rotation
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y = elapsedTime * 0.012;
      }

      // Smooth camera interpolation
      if (cameraAnimRef.current) {
        const anim = cameraAnimRef.current;
        anim.progress += 1 / anim.duration;
        const t = Math.min(anim.progress, 1.0);
        // Smooth ease-out cubic
        const ease = 1 - Math.pow(1 - t, 3);
        camera.position.lerpVectors(anim.startPos, anim.endPos, ease);
        camera.lookAt(0, 0, 0);

        if (t >= 1.0) {
          cameraAnimRef.current = null;
        }
      }

      // Radio Garden Sonar Ripple Wave Animation
      pinObjectsRef.current.forEach(({ rings }) => {
        rings.forEach((ring, idx) => {
          // Staggered outward expansion
          const cycle = (elapsedTime * 1.8 + idx * 0.5) % 1.5;
          const scale = 1.0 + cycle * 3.2;
          ring.scale.set(scale, scale, scale);
          const mat = ring.material as THREE.MeshBasicMaterial;
          mat.opacity = Math.max(0, 0.7 - cycle * 0.45);
        });
      });

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

  // Update 3D Pins with Radio Garden Sonar styling
  useEffect(() => {
    if (!pinGroupRef.current) return;
    const pinGroup = pinGroupRef.current;

    while (pinGroup.children.length > 0) {
      pinGroup.remove(pinGroup.children[0]);
    }
    pinObjectsRef.current.clear();

    pins.forEach((pin) => {
      const pinObj = new THREE.Group();
      // Altitude slightly above surface (0.015)
      const pos = latLngToVector3(pin.lat, pin.lng, EARTH_RADIUS, 0.015);
      pinObj.position.copy(pos);

      // Orient tangent to Earth surface
      const normal = pos.clone().normalize();
      pinObj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // Radio Garden Iconic Neon Green (or category glow)
      let colorHex = 0x00ff88; // Radio Garden Signature Electric Green
      if (pin.category === 'curse') colorHex = 0xff3366; // Crimson
      if (pin.category === 'monster') colorHex = 0xffaa00; // Amber
      if (pin.category === 'sacred') colorHex = 0x00ddff; // Cyan
      if (pin.category === 'legend') colorHex = 0xbf55ec; // Purple

      // 1. Central Core Dot
      const dotGeo = new THREE.SphereGeometry(0.018, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.y = 0.015;
      pinObj.add(dot);

      // 2. Radio Garden Sonar Ripple Wave Rings (Concentric Pulsing Waves)
      const rings: THREE.Mesh[] = [];
      for (let r = 0; r < 2; r++) {
        const ringGeo = new THREE.RingGeometry(0.015, 0.024, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = 0.015;
        pinObj.add(ringMesh);
        rings.push(ringMesh);
      }

      // 3. Anchor Beam
      const beamGeo = new THREE.CylinderGeometry(0.002, 0.002, 0.03, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.8,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 0.008;
      pinObj.add(beam);

      pinObj.userData = { pin };
      pinGroup.add(pinObj);
      pinObjectsRef.current.set(pin.id, { group: pinObj, rings });
    });
  }, [pins]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#03060c]">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Radio Garden Tactical Crosshair Center Indicator */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative w-12 h-12 flex items-center justify-center opacity-40">
          <div className="w-3 h-3 border border-emerald-400 rounded-full" />
          <div className="absolute w-full h-[1px] bg-emerald-400/40" />
          <div className="absolute h-full w-[1px] bg-emerald-400/40" />
        </div>
      </div>

      {/* Floating Tactical Tooltip on Pin Hover */}
      {hoveredPin && (
        <div
          className="pointer-events-none fixed z-30 transform -translate-x-1/2 -translate-y-full mb-4 px-4 py-2.5 rounded-2xl bg-slate-950/95 border border-emerald-400/60 backdrop-blur-xl shadow-[0_0_30px_rgba(0,255,136,0.4)] animate-in fade-in duration-200"
          style={{ left: hoveredPin.x, top: hoveredPin.y - 12 }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-ping" />
            <p className="font-bold text-sm text-[#00ff88] tracking-wide">
              {language === 'th' ? hoveredPin.pin.title_th : hoveredPin.pin.title_en}
            </p>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            📍 {language === 'th' ? hoveredPin.pin.province_th : hoveredPin.pin.province_en}
            {hoveredPin.pin.district_th && ` • ${language === 'th' ? hoveredPin.pin.district_th : hoveredPin.pin.district_en}`}
          </p>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>{hoveredPin.pin.lat.toFixed(2)}°, {hoveredPin.pin.lng.toFixed(2)}°</span>
            <span className="text-emerald-400 font-semibold uppercase">{hoveredPin.pin.category}</span>
          </div>
        </div>
      )}
    </div>
  );
};

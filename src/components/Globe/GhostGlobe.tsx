import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { GhostPin, SupportedLanguage } from '../../types/ghost';
import { EARTH_RADIUS, latLngToVector3, getProvinceCameraPosition } from '../../lib/coordinates';
import {
  createProceduralEarthTexture,
  createProceduralCloudTexture,
  AtmosphereShader,
} from './earthTextures';
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

  // References to keep across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pinGroupRef = useRef<THREE.Group | null>(null);
  const pinMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Camera fly-to animation state
  const cameraAnimRef = useRef<{
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    progress: number;
    duration: number; // in frames
  } | null>(null);

  // Focus camera to pin smoothly
  const flyToPin = useCallback((pin: GhostPin) => {
    if (!cameraRef.current || !controlsRef.current) return;

    audioEngine.playRadioTuning();
    audioEngine.playPresetSound(pin.sound_preset);

    const targetPos = getProvinceCameraPosition(pin.lat, pin.lng);
    cameraAnimRef.current = {
      startPos: cameraRef.current.position.clone(),
      endPos: targetPos,
      progress: 0,
      duration: 60, // ~1 second at 60fps
    };
  }, []);

  // When selectedPin prop changes from outside (e.g. search / list)
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
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Initial camera position focused on Thailand coordinates (Lat 14, Lng 100)
    const initialCamPos = getProvinceCameraPosition(14.0, 100.5);
    camera.position.copy(initialCamPos.clone().multiplyScalar(1.4));
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. OrbitControls with STRICT PDPA Zoom Limits
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    // MANDATORY PDPA CONSTRAINT: minDistance is locked to province overview altitude (~2.9 units)
    // Earth radius = 2.0. Users CANNOT zoom closer than province overview.
    controls.minDistance = 2.9;
    controls.maxDistance = 6.8;
    controls.enablePan = false; // Keep globe centered
    controlsRef.current = controls;

    // 4. Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const radius = 60 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starCoords[i] = radius * Math.sin(phi) * Math.cos(theta);
      starCoords[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starCoords[i + 2] = radius * Math.cos(phi);
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x88ccff,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // 5. Earth Sphere
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
    const earthTex = createProceduralEarthTexture();
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.7,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // 6. Atmosphere Glow (Outer Shell)
    const atmosGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.05, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: AtmosphereShader.vertexShader,
      fragmentShader: AtmosphereShader.fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // 7. Clouds Layer
    const cloudsGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.015, 64, 64);
    const cloudsTex = createProceduralCloudTexture();
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    scene.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // 8. Lighting
    const ambientLight = new THREE.AmbientLight(0x334466, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const spiritLight = new THREE.PointLight(0x34d399, 1.5, 10);
    spiritLight.position.set(0, 0, 4);
    scene.add(spiritLight);

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

    // 10. Resize Observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 11. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle slow cloud drift
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y = elapsedTime * 0.015;
      }

      // Smooth camera interpolation for fly-to
      if (cameraAnimRef.current) {
        const anim = cameraAnimRef.current;
        anim.progress += 1 / anim.duration;
        const t = Math.min(anim.progress, 1.0);
        // Ease-out cubic
        const ease = 1 - Math.pow(1 - t, 3);

        camera.position.lerpVectors(anim.startPos, anim.endPos, ease);
        camera.lookAt(0, 0, 0);

        if (t >= 1.0) {
          cameraAnimRef.current = null;
        }
      }

      // Animate pulsing halo of pins
      pinMeshesRef.current.forEach((mesh) => {
        const halo = mesh.getObjectByName('halo');
        if (halo) {
          const s = 1.0 + 0.3 * Math.sin(elapsedTime * 3.5 + mesh.position.x);
          halo.scale.set(s, s, s);
        }
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

  // Update 3D Pins whenever `pins` prop updates
  useEffect(() => {
    if (!pinGroupRef.current) return;
    const pinGroup = pinGroupRef.current;

    // Clear previous pin objects
    while (pinGroup.children.length > 0) {
      pinGroup.remove(pinGroup.children[0]);
    }
    pinMeshesRef.current.clear();

    pins.forEach((pin) => {
      const pinObj = new THREE.Group();
      const pos = latLngToVector3(pin.lat, pin.lng, EARTH_RADIUS, 0.03);
      pinObj.position.copy(pos);

      // Orient pin normal to surface
      const normal = pos.clone().normalize();
      pinObj.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      // Choose color based on category
      let pinColor = 0x34d399; // Emerald green (spirits)
      if (pin.category === 'curse') pinColor = 0xf43f5e; // Rose red (curses)
      if (pin.category === 'monster') pinColor = 0xf59e0b; // Amber (beasts)
      if (pin.category === 'sacred') pinColor = 0x38bdf8; // Sky blue (sacred)
      if (pin.category === 'legend') pinColor = 0xa855f7; // Purple (legends)

      // 1. Central Core Dot
      const coreGeo = new THREE.SphereGeometry(0.024, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: pinColor });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.02;
      pinObj.add(core);

      // 2. Pulsing Glow Halo (Radio Garden style)
      const haloGeo = new THREE.RingGeometry(0.028, 0.055, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.name = 'halo';
      halo.rotation.x = Math.PI / 2;
      halo.position.y = 0.02;
      pinObj.add(halo);

      // 3. Anchor Beam
      const beamGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.04, 8);
      const beamMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        transparent: true,
        opacity: 0.7,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = 0.01;
      pinObj.add(beam);

      pinObj.userData = { pin };
      pinGroup.add(pinObj);
      pinMeshesRef.current.set(pin.id, pinObj);
    });
  }, [pins]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#05070c]">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Tactical Tooltip on Pin Hover */}
      {hoveredPin && (
        <div
          className="pointer-events-none fixed z-30 transform -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2 rounded-xl bg-slate-950/90 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-ghost-pulse transition-all"
          style={{ left: hoveredPin.x, top: hoveredPin.y - 12 }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <p className="font-semibold text-sm text-emerald-300">
              {language === 'th' ? hoveredPin.pin.title_th : hoveredPin.pin.title_en}
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            📍 {language === 'th' ? hoveredPin.pin.province_th : hoveredPin.pin.province_en}
            {hoveredPin.pin.district_th && ` (${language === 'th' ? hoveredPin.pin.district_th : hoveredPin.pin.district_en})`}
          </p>
        </div>
      )}
    </div>
  );
};

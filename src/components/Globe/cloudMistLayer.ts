import { addProtocol, removeProtocol } from 'maplibre-gl';

/**
 * 3D Globe Cloud & Spectral Mist Raster Tile Protocol (`clouds://{z}/{x}/{y}`)
 *
 * Uses MapLibre's `addProtocol` to serve standard 256x256 XYZ raster tiles
 * cut from a seamless 2048x1024 domain-warped Fractal Brownian Motion (fBm)
 * and ridged turbulence cloud/mist master texture.
 */

const MASTER_W = 2048;
const MASTER_H = 1024;
const TILE_SIZE = 256;

// Deterministic fast 2D hash for value noise in [0, 1]
function hash2D(ix: number, iy: number, seed: number): number {
  let h =
    Math.imul(ix, 374761393) +
    Math.imul(iy, 668265263) +
    Math.imul(seed, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

// Quintic smootherstep for organic cloud gradients
function smooth(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// Clamp to [0, 1]
function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// Seamless horizontally-periodic 2D value noise
function periodicNoise2D(
  x: number,
  y: number,
  periodX: number,
  seed: number
): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smooth(x - ix);
  const fy = smooth(y - iy);

  const x0 = ((ix % periodX) + periodX) % periodX;
  const x1 = (((ix + 1) % periodX) + periodX) % periodX;

  const v00 = hash2D(x0, iy, seed);
  const v10 = hash2D(x1, iy, seed);
  const v01 = hash2D(x0, iy + 1, seed);
  const v11 = hash2D(x1, iy + 1, seed);

  const i0 = v00 + (v10 - v00) * fx;
  const i1 = v01 + (v11 - v01) * fx;
  return i0 + (i1 - i0) * fy;
}

// Multi-octave Fractal Brownian Motion (fBm) with strong high-frequency detail
function fbmPeriodic(
  u: number,
  v: number,
  baseFreqX: number,
  baseFreqY: number,
  octaves: number,
  persistence: number,
  seed: number
): number {
  let value = 0;
  let amplitude = 0.5;
  let freqX = baseFreqX;
  let freqY = baseFreqY;
  let norm = 0;

  for (let i = 0; i < octaves; i++) {
    value +=
      amplitude *
      periodicNoise2D(u * freqX, v * freqY, freqX, seed + i * 97);
    norm += amplitude;
    amplitude *= persistence;
    freqX *= 2;
    freqY *= 2;
  }
  return value / norm;
}

// Billowy / wispy cloud turbulence (creates filaments and wispy edges)
function wispyPeriodic(
  u: number,
  v: number,
  baseFreqX: number,
  baseFreqY: number,
  octaves: number,
  seed: number
): number {
  let value = 0;
  let amplitude = 0.5;
  let freqX = baseFreqX;
  let freqY = baseFreqY;
  let norm = 0;

  for (let i = 0; i < octaves; i++) {
    const n = periodicNoise2D(u * freqX, v * freqY, freqX, seed + i * 131);
    const ridge = 1 - Math.abs(2 * n - 1);
    value += amplitude * (ridge * ridge);
    norm += amplitude;
    amplitude *= 0.56;
    freqX *= 2;
    freqY *= 2;
  }
  return value / norm;
}

let masterCloudCanvas: HTMLCanvasElement | null = null;

function getMasterCloudCanvas(): HTMLCanvasElement {
  if (masterCloudCanvas) return masterCloudCanvas;

  const canvas = document.createElement('canvas');
  canvas.width = MASTER_W;
  canvas.height = MASTER_H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(MASTER_W, MASTER_H);
  const data = img.data;

  for (let y = 0; y < MASTER_H; y++) {
    const v = y / MASTER_H; // 0 (North) -> 1 (South)
    // Smooth polar fade so Web Mercator poles have no pinching artifacts
    const poleFade = Math.sin(v * Math.PI);
    const latEnvelope = Math.pow(poleFade, 0.5);

    // Subtle planetary circulation bands
    const latDeg = (0.5 - v) * 170;
    const bandBoost =
      0.025 * Math.cos((latDeg / 22) * Math.PI) +
      0.02 * Math.cos(((Math.abs(latDeg) - 42) / 18) * Math.PI);

    for (let x = 0; x < MASTER_W; x++) {
      const u = x / MASTER_W;
      const idx = (y * MASTER_W + x) * 4;

      // Macro wind stream domain warp
      const warpX = (fbmPeriodic(u, v, 10, 5, 4, 0.52, 101) - 0.5) * 1.6;
      const warpY = (fbmPeriodic(u, v, 10, 5, 4, 0.52, 202) - 0.5) * 1.6;

      const wu = (u + warpX * 0.1 + 10) % 1;
      const wv = clamp01(v + warpY * 0.1);

      // Meso-scale cyclone & eddy curl warp
      const curlX = (fbmPeriodic(wu, wv, 28, 14, 4, 0.55, 404) - 0.5) * 1.4;
      const curlY = (fbmPeriodic(wu, wv, 28, 14, 4, 0.55, 505) - 0.5) * 1.4;

      const cu = (wu + curlX * 0.045 + 10) % 1;
      const cv = clamp01(wv + curlY * 0.045);

      // Layer 1: Detailed wispy weather clouds (combines fBm base + ridged filaments)
      const fbmBase = fbmPeriodic(cu, cv, 18, 9, 6, 0.56, 303) + bandBoost;
      const wisps = wispyPeriodic(cu, cv, 24, 12, 5, 606);

      // Combine macro cloud clusters with wispy filament tendrils
      const cloudSignal = fbmBase * 0.68 + wisps * 0.32;
      const rawCloud = clamp01((cloudSignal - 0.5) / 0.17);
      const cloudIntensity = rawCloud * rawCloud * (3 - 2 * rawCloud) * latEnvelope;

      // Bright dense cloud tops
      const coreCloud = clamp01((cloudSignal - 0.58) / 0.11);

      // Layer 2: Soft eerie cyan-emerald spectral mist shrouding continents & seas
      const nMist = fbmPeriodic((u - warpY * 0.07 + 10) % 1, wv, 12, 6, 5, 0.55, 707);
      const mistWisps = wispyPeriodic((u + warpX * 0.06 + 10) % 1, wv, 16, 8, 4, 808);
      const mistSignal = nMist * 0.72 + mistWisps * 0.28;
      const rawMist = clamp01((mistSignal - 0.48) / 0.18);
      const mistIntensity = rawMist * latEnvelope * 0.55;

      const combinedAlpha = clamp01(
        cloudIntensity * 0.88 + mistIntensity * 0.48
      );

      // Blend color from ghostly emerald-cyan mist -> silver-blue cloud -> bright white cloud tops
      const r = Math.round(
        115 * (1 - cloudIntensity) +
          228 * cloudIntensity +
          27 * coreCloud
      );
      const g = Math.round(
        218 * (1 - cloudIntensity) +
          246 * cloudIntensity +
          9 * coreCloud
      );
      const b = Math.round(
        212 * (1 - cloudIntensity) +
          250 * cloudIntensity +
          5 * coreCloud
      );

      data[idx] = Math.min(255, r);
      data[idx + 1] = Math.min(255, g);
      data[idx + 2] = Math.min(255, b);
      data[idx + 3] = Math.round(combinedAlpha * 235);
    }
  }

  ctx.putImageData(img, 0, 0);
  masterCloudCanvas = canvas;
  return canvas;
}

const tileCache = new Map<string, ArrayBuffer>();

async function renderCloudTile(z: number, x: number, y: number): Promise<ArrayBuffer> {
  const key = `${z}/${x}/${y}`;
  const cached = tileCache.get(key);
  if (cached) return cached;

  const master = getMasterCloudCanvas();
  const tilesPerSide = Math.pow(2, z);
  const normX = ((x % tilesPerSide) + tilesPerSide) % tilesPerSide;

  const sx = (normX / tilesPerSide) * MASTER_W;
  const sy = (y / tilesPerSide) * MASTER_H;
  const sw = MASTER_W / tilesPerSide;
  const sh = MASTER_H / tilesPerSide;

  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = TILE_SIZE;
  tileCanvas.height = TILE_SIZE;
  const ctx = tileCanvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(master, sx, sy, sw, sh, 0, 0, TILE_SIZE, TILE_SIZE);

  const blob = await new Promise<Blob | null>((resolve) =>
    tileCanvas.toBlob(resolve, 'image/png')
  );
  const buffer = blob ? await blob.arrayBuffer() : new ArrayBuffer(0);
  tileCache.set(key, buffer);
  return buffer;
}

let isProtocolRegistered = false;

export function registerCloudMistProtocol(): () => void {
  if (!isProtocolRegistered) {
    addProtocol('clouds', async (params) => {
      // Expected URL format: clouds://{z}/{x}/{y}
      const match = params.url.match(/clouds:\/\/(\d+)\/(\d+)\/(\d+)/);
      if (!match) {
        return { data: new ArrayBuffer(0) };
      }
      const z = parseInt(match[1], 10);
      const x = parseInt(match[2], 10);
      const y = parseInt(match[3], 10);
      const data = await renderCloudTile(z, x, y);
      return { data };
    });
    isProtocolRegistered = true;
  }

  return () => {
    if (isProtocolRegistered) {
      removeProtocol('clouds');
      isProtocolRegistered = false;
    }
  };
}

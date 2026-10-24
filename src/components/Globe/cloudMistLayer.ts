/**
 * Procedural 3D Globe Cloud & Spectral Mist Generator for MapLibre GL CanvasSource.
 *
 * Pre-renders two seamless horizontally-wrapping equirectangular cloud/mist layers
 * using domain-warped Fractal Brownian Motion (fBm) value noise, then composites
 * them with parallax wind drift onto an HTMLCanvasElement mapped onto the 3D globe.
 */

const WIDTH = 1024;
const HEIGHT = 512;

// Deterministic fast 2D hash for value noise
function hash2D(ix: number, iy: number, seed: number): number {
  let n = (ix * 374761393 + iy * 668265263 + seed * 1442695041) | 0;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

// Smoothstep interpolation
function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

// Seamless horizontally-periodic 2D value noise (wraps cleanly at periodX)
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
  const x1 = ((ix + 1) % periodX + periodX) % periodX;

  const v00 = hash2D(x0, iy, seed);
  const v10 = hash2D(x1, iy, seed);
  const v01 = hash2D(x0, iy + 1, seed);
  const v11 = hash2D(x1, iy + 1, seed);

  const i0 = v00 + (v10 - v00) * fx;
  const i1 = v01 + (v11 - v01) * fx;
  return i0 + (i1 - i0) * fy;
}

// Multi-octave Fractal Brownian Motion (fBm) with horizontal periodicity
function fbmPeriodic(
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
    value +=
      amplitude *
      periodicNoise2D(u * freqX, v * freqY, freqX, seed + i * 97);
    norm += amplitude;
    amplitude *= 0.5;
    freqX *= 2;
    freqY *= 2;
  }
  return value / norm;
}

/**
 * Builds two offscreen seamless cloud & spectral mist decks:
 * 1. High-altitude silver-cyan wispy weather clouds with domain warping
 * 2. Low-altitude eerie emerald-slate fog banks
 */
function createCloudDecks(): {
  highClouds: HTMLCanvasElement;
  lowMist: HTMLCanvasElement;
} {
  const highClouds = document.createElement('canvas');
  highClouds.width = WIDTH;
  highClouds.height = HEIGHT;
  const highCtx = highClouds.getContext('2d')!;
  const highImg = highCtx.createImageData(WIDTH, HEIGHT);
  const highData = highImg.data;

  const lowMist = document.createElement('canvas');
  lowMist.width = WIDTH;
  lowMist.height = HEIGHT;
  const lowCtx = lowMist.getContext('2d')!;
  const lowImg = lowCtx.createImageData(WIDTH, HEIGHT);
  const lowData = lowImg.data;

  for (let y = 0; y < HEIGHT; y++) {
    const v = y / HEIGHT; // 0 (North) -> 1 (South)
    // Latitude profile: fade gently near extreme poles to avoid pinching on Web Mercator
    const poleFade = Math.sin(v * Math.PI);
    const latEnvelope = Math.pow(poleFade, 0.55);

    // Subtle atmospheric circulation bands (ITCZ & mid-latitude storm tracks)
    const latDeg = (0.5 - v) * 170;
    const bandBoost =
      1.0 +
      0.22 * Math.cos((latDeg / 28) * Math.PI) +
      0.15 * Math.cos(((Math.abs(latDeg) - 45) / 22) * Math.PI);

    for (let x = 0; x < WIDTH; x++) {
      const u = x / WIDTH; // 0 -> 1 wraps seamlessly
      const idx = (y * WIDTH + x) * 4;

      // Domain warp for swirling cyclone / wind currents
      const warpX = fbmPeriodic(u, v, 6, 3, 3, 101) - 0.5;
      const warpY = fbmPeriodic(u, v, 6, 3, 3, 202) - 0.5;

      const wu = (u + warpX * 0.14 + 1) % 1;
      const wv = Math.max(0.01, Math.min(0.99, v + warpY * 0.14));

      // Deck 1: High-altitude wispy storm clouds
      const nHigh = fbmPeriodic(wu, wv, 12, 6, 5, 303) * bandBoost;
      const cloudMask = Math.max(0, (nHigh - 0.52) / 0.48);
      const cloudAlpha = Math.min(
        1,
        Math.pow(cloudMask, 1.35) * latEnvelope * 0.92
      );

      // Moonlight silver-cyan cloud tint
      highData[idx] = 215; // R
      highData[idx + 1] = 242; // G
      highData[idx + 2] = 238; // B
      highData[idx + 3] = Math.round(cloudAlpha * 215);

      // Deck 2: Low-altitude spectral emerald-teal mist & eerie fog
      const nLow = fbmPeriodic(
        (u - warpY * 0.1 + 1) % 1,
        wv,
        8,
        4,
        4,
        707
      );
      const mistMask = Math.max(0, (nLow - 0.44) / 0.56);
      const mistAlpha = Math.min(
        1,
        Math.pow(mistMask, 1.5) * latEnvelope * 0.78
      );

      // Haunted teal-emerald & slate mist color
      lowData[idx] = 45; // R
      lowData[idx + 1] = 175; // G
      lowData[idx + 2] = 155; // B
      lowData[idx + 3] = Math.round(mistAlpha * 165);
    }
  }

  highCtx.putImageData(highImg, 0, 0);
  lowCtx.putImageData(lowImg, 0, 0);

  return { highClouds, lowMist };
}

export interface AnimatedCloudController {
  canvas: HTMLCanvasElement;
  dispose: () => void;
}

/**
 * Creates an animated HTMLCanvasElement with two parallax cloud & mist layers
 * that drift continuously around the globe.
 */
export function createAnimatedCloudCanvas(): AnimatedCloudController {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d')!;

  const { highClouds, lowMist } = createCloudDecks();

  let offsetHigh = 0;
  let offsetLow = 0;
  let animTimer: number | null = null;

  const renderFrame = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // 1. Draw low spectral mist layer (slower drift)
    const xLow = Math.floor(offsetLow) % WIDTH;
    ctx.globalAlpha = 0.75;
    ctx.drawImage(lowMist, xLow, 0);
    ctx.drawImage(lowMist, xLow - WIDTH, 0);

    // 2. Draw high storm clouds layer (faster drift for 3D parallax feel)
    const xHigh = Math.floor(offsetHigh) % WIDTH;
    ctx.globalAlpha = 0.92;
    ctx.drawImage(highClouds, xHigh, 0);
    ctx.drawImage(highClouds, xHigh - WIDTH, 0);

    offsetLow = (offsetLow + 0.18) % WIDTH;
    offsetHigh = (offsetHigh + 0.42) % WIDTH;
  };

  // Render initial frame immediately
  renderFrame();

  // Update at ~20 FPS so MapLibre CanvasSource stays smooth and lightweight
  animTimer = window.setInterval(renderFrame, 50);

  return {
    canvas,
    dispose: () => {
      if (animTimer !== null) {
        clearInterval(animTimer);
        animTimer = null;
      }
    },
  };
}

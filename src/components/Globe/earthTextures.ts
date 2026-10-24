import * as THREE from 'three';

/**
 * Creates high-detail procedural canvas textures for the Earth globe
 * This ensures the 3D globe works 100% offline without requiring large external NASA texture downloads
 */

export function createProceduralEarthTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Deep ocean abyss gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#040b17');
  oceanGrad.addColorStop(0.5, '#061326');
  oceanGrad.addColorStop(1, '#040b17');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle coordinate latitude / longitude grid lines for tactical/mysterious map feel
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
  ctx.lineWidth = 1;
  for (let lat = 0; lat <= height; lat += height / 12) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(width, lat);
    ctx.stroke();
  }
  for (let lon = 0; lon <= width; lon += width / 24) {
    ctx.beginPath();
    ctx.moveTo(lon, 0);
    ctx.lineTo(lon, height);
    ctx.stroke();
  }

  // Draw procedural landmasses with glowing ghostly contours
  // Approximate global continent silhouettes for authentic globe appearance
  ctx.fillStyle = '#0f2438';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = '#059669';
  ctx.shadowBlur = 8;

  // Function to draw land blob with latitude / longitude projection
  function drawLand(cx: number, cy: number, rx: number, ry: number, points = 16) {
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const noise = 0.8 + 0.4 * Math.sin(angle * 3 + cx) * Math.cos(angle * 2 + cy);
      const px = cx + Math.cos(angle) * rx * noise;
      const py = cy + Math.sin(angle) * ry * noise;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Asia & Southeast Asia (Centered focus)
  // Thailand area around lon 100°E (width * (100 + 180) / 360 = ~1592) & lat 15°N (height * (90 - 15) / 180 = ~426)
  drawLand(1580, 420, 110, 140, 24); // Indochina / Thailand peninsula
  drawLand(1590, 540, 40, 110, 18);  // Malay peninsula
  drawLand(1650, 620, 140, 80, 20);  // Indonesia / Sumatra / Java
  drawLand(1720, 520, 70, 90, 18);   // Philippines
  drawLand(1550, 310, 260, 180, 28); // China & East Asia
  drawLand(1400, 410, 160, 140, 24); // India & South Asia
  drawLand(1760, 330, 70, 100, 20);  // Japan archipelago

  // Europe & Russia
  drawLand(1380, 220, 280, 110, 24); // Northern Eurasia
  drawLand(1140, 260, 140, 100, 20); // Western Europe
  drawLand(1190, 320, 80, 50, 16);   // Mediterranean

  // Africa
  drawLand(1150, 470, 160, 220, 24); // African continent
  drawLand(1290, 620, 40, 80, 16);   // Madagascar

  // Americas
  drawLand(460, 310, 210, 170, 24);  // North America
  drawLand(580, 580, 130, 210, 24);  // South America

  // Australia
  drawLand(1780, 680, 130, 100, 20); // Australia
  drawLand(1910, 740, 40, 60, 14);   // New Zealand

  // Special Highlight on Thailand with mystical glow
  ctx.shadowColor = '#34d399';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#164e63';
  ctx.beginPath();
  ctx.arc(1592, 426, 28, 0, Math.PI * 2);
  ctx.fill();

  // Reset shadow
  ctx.shadowBlur = 0;

  // Add twinkling nocturnal lights / sacred settlements
  ctx.fillStyle = '#6ee7b7';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    // Only place on land
    const p = ctx.getImageData(x, y, 1, 1).data;
    if (p[0] > 10 || p[1] > 20) {
      const radius = Math.random() * 1.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Creates subtle ethereal cloud layer texture
 */
export function createProceduralCloudTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  for (let i = 0; i < 90; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const rx = Math.random() * 80 + 30;
    const ry = Math.random() * 25 + 10;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Custom Atmosphere Glow Shader
 */
export const AtmosphereShader = {
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
      float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
      // Spectral cyan-emerald spiritual atmosphere
      gl_FragColor = vec4(0.15, 0.85, 0.65, 1.0) * intensity;
    }
  `,
};

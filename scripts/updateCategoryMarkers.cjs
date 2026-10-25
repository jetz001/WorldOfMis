const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'Globe', 'GhostGlobe.tsx');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Update import
code = code.replace(
  "import type { GhostPin, SupportedLanguage } from '../../types/ghost';",
  "import type { GhostPin, SupportedLanguage, GhostCategory } from '../../types/ghost';"
);

// 2. Add CATEGORY_MARKER_STYLES definition right above GhostGlobe component
const markerStylesDefinition = `
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
    iconSvg: \`<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="M12 2a7 7 0 0 0-7 7v9l3-2 3 2 3-2 3 2 2-2V9a7 7 0 0 0-7-7z"/><circle cx="9" cy="9" r="1.2" fill="#ffffff"/><circle cx="15" cy="9" r="1.2" fill="#ffffff"/></svg>\`,
  },

  // 2. Monster (Crimson Beast Maw)
  monster: {
    color: '#ff2a5f',
    glow: 'rgba(255, 42, 95, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #ff2a5f 0%, #be123c 65%, #4c0519 100%)',
    iconSvg: \`<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>\`,
  },

  // 3. Curse (Royal Violet Cursed Skull)
  curse: {
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #c084fc 0%, #7e22ce 65%, #3b0764 100%)',
    iconSvg: \`<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><circle cx="9" cy="12" r="1.3" fill="#ffffff"/><circle cx="15" cy="12" r="1.3" fill="#ffffff"/><path d="M8 20v2h8v-2"/><path d="M16 20a3 3 0 0 0 1.5-2.6 6 6 0 1 0-11 0A3 3 0 0 0 8 20z"/></svg>\`,
  },

  // 4. Sacred (Solar Golden Star)
  sacred: {
    color: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.9)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #fde047 0%, #d97706 65%, #451a03 100%)',
    iconSvg: \`<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="m12 2 2.6 6.2L21 11l-5 4.5 1.5 6.5L12 18.5 6.5 22 8 15.5 3 11l6.4-2.8z"/></svg>\`,
  },

  // 5. Legend (Emerald Jade Ancient Scroll)
  legend: {
    color: '#00ff88',
    glow: 'rgba(0, 255, 136, 0.85)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #34d399 0%, #059669 65%, #022c22 100%)',
    iconSvg: \`<svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>\`,
  },
};
`;

if (!code.includes('CATEGORY_MARKER_STYLES')) {
  code = code.replace(
    'interface GhostGlobeProps {',
    markerStylesDefinition + '\r\ninterface GhostGlobeProps {'
  );
}

// 3. Replace the marker rendering logic
const oldMarkerBlock = `    // Create high-visibility Spectral Green Dot Markers with hover preview card & click-to-zoom
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
      innerWrap.innerHTML = \`
        <span style="
          position: absolute;
          width: \${isSelected ? '22px' : '16px'};
          height: \${isSelected ? '22px' : '16px'};
          border-radius: 9999px;
          background-color: #00ff88;
          opacity: 0.75;
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></span>
        <span style="
          position: relative;
          width: \${isSelected ? '12px' : '9px'};
          height: \${isSelected ? '12px' : '9px'};
          border-radius: 9999px;
          background-color: #00ff88;
          border: 2px solid #ffffff;
          box-shadow: 0 0 12px #00ff88, 0 0 4px #ffffff;
        "></span>
      \`;

      el.appendChild(innerWrap);
      markerInnerElsRef.current.set(pin.id, innerWrap);`;

const newMarkerBlock = `    // Create distinctive, prominent category-specific 3D Occult Diamond Markers
    pins.forEach((pin) => {
      const isSelected = selectedPin?.id === pin.id;
      const catStyle = CATEGORY_MARKER_STYLES[pin.category] || CATEGORY_MARKER_STYLES.legend;

      const el = document.createElement('div');
      el.className = 'cursor-pointer select-none group relative';
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';

      const innerWrap = document.createElement('div');
      innerWrap.style.position = 'relative';
      innerWrap.style.display = 'flex';
      innerWrap.style.alignItems = 'center';
      innerWrap.style.justifyContent = 'center';
      innerWrap.style.transition = 'transform 160ms cubic-bezier(0.2, 1, 0.3, 1)';
      innerWrap.innerHTML = \`
        <span style="
          position: absolute;
          width: \${isSelected ? '32px' : '22px'};
          height: \${isSelected ? '32px' : '22px'};
          border-radius: 9999px;
          background-color: \${catStyle.color};
          opacity: 0.6;
          filter: blur(1.5px);
          animation: ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></span>
        <div style="
          position: relative;
          width: \${isSelected ? '26px' : '20px'};
          height: \${isSelected ? '26px' : '20px'};
          border-radius: \${isSelected ? '9px' : '7px'};
          background: \${catStyle.bgGradient};
          border: 1.8px solid \${isSelected ? '#ffffff' : catStyle.color};
          box-shadow: 0 0 14px \${catStyle.glow}, 0 3px 8px rgba(0, 0, 0, 0.9);
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
            \${catStyle.iconSvg}
          </div>
        </div>
      \`;

      el.appendChild(innerWrap);
      markerInnerElsRef.current.set(pin.id, innerWrap);`;

code = code.replace(oldMarkerBlock.replace(/\n/g, '\r\n'), newMarkerBlock);
if (code.includes('Spectral Green Dot Markers')) {
  code = code.replace(oldMarkerBlock, newMarkerBlock);
}

fs.writeFileSync(targetPath, code);
console.log('Successfully updated GhostGlobe.tsx with prominent category markers!');

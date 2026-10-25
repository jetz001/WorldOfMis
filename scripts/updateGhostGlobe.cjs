const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'src', 'components', 'Globe', 'GhostGlobe.tsx');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Replace layers and sky block
const layersStart = code.indexOf('layers: [');
const layersEnd = code.indexOf('center: WORLD_VIEW_CENTER,');
if (layersStart !== -1 && layersEnd !== -1) {
  const newLayersAndSky = `layers: [
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
      `;
  code = code.slice(0, layersStart) + newLayersAndSky + code.slice(layersEnd);
  console.log('Replaced layers and sky successfully.');
}

// 2. Replace overlay mist divs
const mistStart = code.indexOf('{/* Mysterious Atmospheric Fog & Drifting Mist Overlay */}');
const mistEnd = code.indexOf('{/* Mysterious Occult Astrolabe Reticle');
if (mistStart !== -1 && mistEnd !== -1) {
  const newVignette = `{/* Deep nocturnal vignette around viewport edges (crisp, solid globe) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, transparent 58%, rgba(2, 6, 12, 0.45) 85%, rgba(1, 3, 7, 0.9) 100%)',
          }}
        />
      </div>

      `;
  code = code.slice(0, mistStart) + newVignette + code.slice(mistEnd);
  console.log('Replaced mist overlay with clean vignette.');
}

fs.writeFileSync(targetPath, code);
console.log('Finished updating GhostGlobe.tsx');

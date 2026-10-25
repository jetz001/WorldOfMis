const fs = require('fs');
const path = require('path');

const appPath = path.resolve('src/App.tsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add import
content = content.replace(
  "import { performVectorRagSearch } from './lib/vectorRagSearch';",
  "import { performVectorRagSearch } from './lib/vectorRagSearch';\nimport { MysticalLoadingScreen } from './components/UI/MysticalLoadingScreen';"
);

// 2. Add loading states
content = content.replace(
  "  const [worldViewSignal, setWorldViewSignal] = useState(0);",
  `  const [worldViewSignal, setWorldViewSignal] = useState(0);
  const [isPinsLoaded, setIsPinsLoaded] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);`
);

// 3. Update fetchPins and add safety timer
content = content.replace(
`    fetchPins().then((data) => {
      setPins(data);
    });`,
`    fetchPins().then((data) => {
      setPins(data);
      setIsPinsLoaded(true);
    });

    const safetyTimer = setTimeout(() => {
      setIsPinsLoaded(true);
      setIsMapReady(true);
    }, 3600);`
);

content = content.replace(
`    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('hashchange', checkSecretUrl);
      window.removeEventListener('keydown', handleKeyDown);
    };`,
`    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('hashchange', checkSecretUrl);
      window.removeEventListener('keydown', handleKeyDown);
    };`
);

// 4. Pass onMapReady to GhostGlobe
content = content.replace(
`        <GhostGlobe
          pins={filteredPins}
          selectedPin={selectedPin}
          onSelectPin={handleSelectPin}
          language={language}
          worldViewSignal={worldViewSignal}
          onZoomOut={handleZoomOutToWorld}
        />`,
`        <GhostGlobe
          pins={filteredPins}
          selectedPin={selectedPin}
          onSelectPin={handleSelectPin}
          language={language}
          worldViewSignal={worldViewSignal}
          onZoomOut={handleZoomOutToWorld}
          onMapReady={() => setIsMapReady(true)}
        />`
);

// 5. Render MysticalLoadingScreen
content = content.replace(
`      {/* Admin Portal Modal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        pins={pins}
        onAddPin={handleAddPin}
        onUpdatePin={handleUpdatePin}
        onDeletePin={handleDeletePin}
        language={language}
      />
    </div>`,
`      {/* Admin Portal Modal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        pins={pins}
        onAddPin={handleAddPin}
        onUpdatePin={handleUpdatePin}
        onDeletePin={handleDeletePin}
        language={language}
      />

      {/* Mystical Initial App Loading Screen */}
      <MysticalLoadingScreen
        isLoading={!isPinsLoaded || !isMapReady}
        language={language}
        pinsCount={pins.length}
      />
    </div>`
);

fs.writeFileSync(appPath, content, 'utf8');
console.log('Successfully updated App.tsx with MysticalLoadingScreen and onMapReady!');

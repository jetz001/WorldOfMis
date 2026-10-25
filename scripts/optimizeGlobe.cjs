const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/components/Globe/GhostGlobe.tsx');
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Update Props and Component Signature
const oldPropsBlock = `interface GhostGlobeProps {
  pins: GhostPin[];
  selectedPin: GhostPin | null;
  onSelectPin: (pin: GhostPin) => void;
  language: SupportedLanguage;
  worldViewSignal: number;
  onZoomOut?: () => void;
}

export const GhostGlobe: React.FC<GhostGlobeProps> = ({
  pins,
  selectedPin,
  onSelectPin,
  language,
  worldViewSignal,
  onZoomOut,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const markerItemsRef = useRef<{ marker: Marker; pin: GhostPin; element: HTMLDivElement }[]>([]);`;

const newPropsBlock = `interface GhostGlobeProps {
  pins: GhostPin[];
  selectedPin: GhostPin | null;
  onSelectPin: (pin: GhostPin) => void;
  language: SupportedLanguage;
  worldViewSignal: number;
  onZoomOut?: () => void;
  onMapReady?: () => void;
}

interface MarkerItem {
  marker: Marker;
  pin: GhostPin;
  element: HTMLDivElement;
  isVisible?: boolean;
}

export const GhostGlobe: React.FC<GhostGlobeProps> = ({
  pins,
  selectedPin,
  onSelectPin,
  language,
  worldViewSignal,
  onZoomOut,
  onMapReady,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const markerItemsRef = useRef<MarkerItem[]>([]);
  const markerInnerElsRef = useRef<globalThis.Map<string, HTMLDivElement>>(new globalThis.Map());
  const pinsRef = useRef<GhostPin[]>(pins);
  const [hoveredPinInfo, setHoveredPinInfo] = useState<{
    pin: GhostPin;
    x: number;
    y: number;
    color: string;
  } | null>(null);
  const isFrameScheduledRef = useRef(false);`;

if (!content.includes(newPropsBlock)) {
  content = content.replace(oldPropsBlock, newPropsBlock);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched props and state in GhostGlobe.tsx!');

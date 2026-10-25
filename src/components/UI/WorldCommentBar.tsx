import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Globe2, Clock, Sparkles } from 'lucide-react';
import type { SupportedLanguage } from '../../types/ghost';

export interface WorldCommentItem {
  id: string;
  author: string;
  content: string;
  created_at?: string;
}

interface FloatingBubble extends WorldCommentItem {
  instanceId: string;
  isSelf?: boolean;
  startX: number;
  peakX: number;
  peakY: number;
  driftX: number;
  tilt: number;
}

interface WorldCommentBarProps {
  isWorldZoomedOut: boolean;
  onZoomOut: () => void;
  language: SupportedLanguage;
}

const COOLDOWN_MS = 5000;
const LAST_SENT_KEY = 'wom_world_cmt_last_sent';
const LOCAL_CACHE_KEY = 'wom_world_cmt_list_v1';

const DEFAULT_WORLD_COMMENTS: WorldCommentItem[] = [
  { id: 'wc-1', author: 'นักสำรวจรัตติกาล', content: 'ลูกโลกมืดขลังมาก หมุดตำนานแน่นสุดๆ 🌍✨' },
  { id: 'wc-2', author: 'GhostHunter_TH', content: 'ใครเคยไปคำชะโนดตอนกลางคืนบ้าง ขนลุกจริง' },
  { id: 'wc-3', author: 'FolkloreWalker', content: '200 legends across the globe! Love the 3D talisman markers 🔮' },
  { id: 'wc-4', author: 'พรานป่าดงพญาเย็น', content: 'ระวังเสียงเพรียกตอนดึก ห้ามทักเด็ดขาด!' },
  { id: 'wc-5', author: 'KyotoNight', content: '百鬼夜行と雪女の伝説、とても雰囲気がありますね 👻' },
];

export const WorldCommentBar: React.FC<WorldCommentBarProps> = ({
  isWorldZoomedOut,
  onZoomOut,
  language,
}) => {
  const [text, setText] = useState('');
  const [cooldownLeftMs, setCooldownLeftMs] = useState<number>(() => {
    const saved = Number(localStorage.getItem(LAST_SENT_KEY) || '0');
    const diff = Date.now() - saved;
    return diff < COOLDOWN_MS ? COOLDOWN_MS - diff : 0;
  });
  const [floatingBubbles, setFloatingBubbles] = useState<FloatingBubble[]>([]);
  const poolRef = useRef<WorldCommentItem[]>(DEFAULT_WORLD_COMMENTS);
  const ambientIndexRef = useRef(0);

  // Spawn a single fountain bubble that shoots from bottom -> center -> falls down
  const spawnFountainBubble = useCallback((item: WorldCommentItem, isSelf = false) => {
    const instanceId = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    // Randomize subtle arc around the center of the screen
    const startX = isSelf ? 0 : Math.round((Math.random() - 0.5) * 140);
    const peakX = isSelf
      ? Math.round((Math.random() - 0.5) * 50)
      : Math.round((Math.random() - 0.5) * 220);
    const peakY = isSelf ? -6 : Math.round(-10 + Math.random() * 14); // vh around center
    const driftX = (Math.random() > 0.5 ? 1 : -1) * Math.round(18 + Math.random() * 34);
    const tilt = (Math.random() > 0.5 ? 1 : -1) * Math.round(2 + Math.random() * 4);

    const bubble: FloatingBubble = {
      ...item,
      instanceId,
      isSelf,
      startX,
      peakX,
      peakY,
      driftX,
      tilt,
    };

    setFloatingBubbles((prev) => [...prev.slice(-10), bubble]);

    // Remove bubble after 5.3s animation finishes
    window.setTimeout(() => {
      setFloatingBubbles((prev) => prev.filter((b) => b.instanceId !== instanceId));
    }, 5300);
  }, []);

  // Load initial world comments from D1 API + localStorage
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          poolRef.current = parsed;
        }
      }
    } catch {
      // ignore
    }

    fetch('/api/world-comments')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.success && Array.isArray(j.data) && j.data.length > 0) {
          poolRef.current = [...j.data, ...DEFAULT_WORLD_COMMENTS].slice(0, 40);
          try {
            localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(poolRef.current));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {});
  }, []);

  // Periodically launch an ambient world comment bubble when zoomed out to the world
  useEffect(() => {
    if (!isWorldZoomedOut) return;
    const timer = window.setInterval(() => {
      const list = poolRef.current;
      if (!list || list.length === 0) return;
      const item = list[ambientIndexRef.current % list.length];
      ambientIndexRef.current += 1;
      spawnFountainBubble(item, false);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [isWorldZoomedOut, spawnFountainBubble]);

  // Cooldown ticker (updates every 200ms)
  useEffect(() => {
    if (cooldownLeftMs <= 0) return;
    const timer = window.setInterval(() => {
      const saved = Number(localStorage.getItem(LAST_SENT_KEY) || '0');
      const remaining = COOLDOWN_MS - (Date.now() - saved);
      if (remaining <= 0) {
        setCooldownLeftMs(0);
        window.clearInterval(timer);
      } else {
        setCooldownLeftMs(remaining);
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [cooldownLeftMs]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWorldZoomedOut) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    // Check 5-second anti-spam cooldown
    const saved = Number(localStorage.getItem(LAST_SENT_KEY) || '0');
    const elapsed = Date.now() - saved;
    if (elapsed < COOLDOWN_MS) {
      setCooldownLeftMs(COOLDOWN_MS - elapsed);
      return;
    }

    const now = Date.now();
    localStorage.setItem(LAST_SENT_KEY, String(now));
    setCooldownLeftMs(COOLDOWN_MS);
    setText('');

    const newItem: WorldCommentItem = {
      id: `wcmt-${now}`,
      author: language === 'th' ? 'นักสำรวจโลก' : 'World Explorer',
      content: trimmed.slice(0, 120),
      created_at: new Date().toISOString(),
    };

    // 1. Immediately launch fountain bubble from bottom -> center -> fall down!
    spawnFountainBubble(newItem, true);

    // 2. Add to local pool so it also replays in rotation
    poolRef.current = [newItem, ...poolRef.current].slice(0, 40);
    try {
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(poolRef.current));
    } catch {
      // ignore
    }

    // 3. Persist to Cloudflare D1 backend
    try {
      await fetch('/api/world-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: newItem.author,
          content: newItem.content,
        }),
      });
    } catch {
      // offline fallback already stored
    }
  };

  const cooldownSec = Math.ceil(cooldownLeftMs / 1000);

  return (
    <>
      {/* ============================================================== */}
      {/* FOUNTAIN OVERLAY: Messages shoot from bottom -> center -> drop */}
      {/* ============================================================== */}
      <div className="pointer-events-none fixed inset-0 z-25 flex items-center justify-center overflow-hidden">
        {floatingBubbles.map((b) => (
          <div
            key={b.instanceId}
            style={
              {
                '--start-x': `${b.startX}px`,
                '--peak-x': `${b.peakX}px`,
                '--peak-y': `${b.peakY}vh`,
                '--drift-x': `${b.driftX}px`,
                '--tilt': `${b.tilt}deg`,
              } as React.CSSProperties
            }
            className={`animate-world-fountain absolute max-w-[290px] sm:max-w-sm px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.85)] flex items-center gap-2.5 ${
              b.isSelf
                ? 'bg-gradient-to-r from-emerald-950/95 via-[#07261f]/95 to-slate-950/95 border-amber-400/80 text-amber-100 shadow-[0_0_28px_rgba(16,185,129,0.55)]'
                : 'bg-[#070d18]/90 border-emerald-500/40 text-slate-100 shadow-[0_0_20px_rgba(16,185,129,0.22)]'
            }`}
          >
            <span className="text-base shrink-0">{b.isSelf ? '✨' : '💬'}</span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium leading-snug break-words">
                {b.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================== */}
      {/* BOTTOM-CENTER WORLD COMMENT INPUT BAR                          */}
      {/* ============================================================== */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-30 w-[92vw] max-w-md pointer-events-auto"
        style={{
          bottom: 'max(3.6rem, calc(env(safe-area-inset-bottom, 0px) + 3.2rem))',
        }}
      >
        {!isWorldZoomedOut ? (
          <button
            type="button"
            onClick={onZoomOut}
            className="w-full px-4 py-2 rounded-full bg-[#070c16]/90 hover:bg-emerald-950/85 border border-amber-500/40 hover:border-emerald-400/70 backdrop-blur-xl text-xs text-amber-200/95 hover:text-emerald-200 shadow-[0_8px_24px_rgba(0,0,0,0.85)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Globe2 className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>
              {language === 'th'
                ? '🌍 ซูมออกไปดูโลก เพื่อพิมพ์คอมเม้นต์ World (แตะเพื่อซูมออก)'
                : '🌍 Zoom out to World View to post a World Comment'}
            </span>
          </button>
        ) : (
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 p-1.5 pl-3.5 rounded-full bg-[#070c16]/92 border border-emerald-500/45 focus-within:border-amber-400/80 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(16,185,129,0.2)] transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={text}
              maxLength={120}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                cooldownSec > 0
                  ? language === 'th'
                    ? `รออีก ${cooldownSec} วินาที เพื่อส่งข้อความถัดไป...`
                    : `Wait ${cooldownSec}s before next World Comment...`
                  : language === 'th'
                  ? 'พิมพ์คอมเม้นต์ World ลอยขึ้นกลางจอ...'
                  : 'Type a World Comment to launch across the globe...'
              }
              className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={cooldownSec > 0 || !text.trim()}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                cooldownSec > 0
                  ? 'bg-slate-800/90 text-amber-300 border border-amber-500/40 cursor-not-allowed'
                  : text.trim()
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] cursor-pointer active:scale-95'
                  : 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
              }`}
            >
              {cooldownSec > 0 ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin [animation-duration:3s]" />
                  <span>{cooldownSec}s</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'th' ? 'ส่ง' : 'Send'}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

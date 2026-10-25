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
  leftPercent: number; // Horizontal column position (%)
  topPercent: number;  // Vertical center target (%)
  partNumber: number;  // 2, 3, or 4 on desktop; 3 on mobile
}

interface WorldCommentBarProps {
  isWorldZoomedOut: boolean;
  onZoomOut: () => void;
  language: SupportedLanguage;
}

const COOLDOWN_MS = 5000;
const LAST_SENT_KEY = 'wom_world_cmt_last_sent';

// Purge legacy mock world comment cache
try {
  localStorage.removeItem('wom_world_cmt_list_v1');
} catch {
  // ignore
}

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
  const lastDesktopPartRef = useRef<number>(0);
  const seenRemoteIdsRef = useRef<Set<string>>(new Set());
  const initializedRemoteRef = useRef<boolean>(false);

  /**
   * Spawns a bubble that fades in while rising from the bottom,
   * stays suspended at the center of the screen, then descends & fades out.
   *
   * Desktop (>= 768px): Screen is divided into 5 equal vertical columns (1..5):
   *   Part 1: 0% - 20%
   *   Part 2: 20% - 40% (center 30%)
   *   Part 3: 40% - 60% (center 50%)
   *   Part 4: 60% - 80% (center 70%)
   *   Part 5: 80% - 100%
   * Randomly spawns in the middle parts (Part 2, Part 3, or Part 4).
   * Mobile (< 768px): Always spawns at center (50%).
   */
  const spawnFountainBubble = useCallback((item: WorldCommentItem, isSelf = false) => {
    const instanceId = `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

    let partNumber = 3;
    let leftPercent = 50;

    if (isDesktop) {
      const candidateParts = [2, 3, 4];
      const filtered = candidateParts.filter((p) => p !== lastDesktopPartRef.current);
      const pool = filtered.length > 0 && Math.random() < 0.75 ? filtered : candidateParts;
      partNumber = pool[Math.floor(Math.random() * pool.length)];
      lastDesktopPartRef.current = partNumber;

      // Center of Part 2 = 30%, Part 3 = 50%, Part 4 = 70% (with ±3% natural jitter within that part)
      const partCenterMap: Record<number, number> = { 2: 30, 3: 50, 4: 70 };
      const jitter = (Math.random() - 0.5) * 6; // -3% to +3%
      leftPercent = Math.round((partCenterMap[partNumber] + jitter) * 10) / 10;
    }

    const topPercent = Math.round((47 + (Math.random() - 0.5) * 6) * 10) / 10;

    const bubble: FloatingBubble = {
      ...item,
      instanceId,
      isSelf,
      leftPercent,
      topPercent,
      partNumber,
    };

    setFloatingBubbles((prev) => [...prev.slice(-8), bubble]);

    window.setTimeout(() => {
      setFloatingBubbles((prev) => prev.filter((b) => b.instanceId !== instanceId));
    }, 5450);
  }, []);

  // Poll real live world comments from D1 (only spawns newly arrived real messages from other users)
  useEffect(() => {
    if (!isWorldZoomedOut) return;

    const checkLiveComments = async () => {
      try {
        const res = await fetch('/api/world-comments');
        if (!res.ok) return;
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          const items: WorldCommentItem[] = json.data;
          if (!initializedRemoteRef.current) {
            items.forEach((it) => seenRemoteIdsRef.current.add(it.id));
            initializedRemoteRef.current = true;
            return;
          }
          for (const it of items) {
            if (!seenRemoteIdsRef.current.has(it.id)) {
              seenRemoteIdsRef.current.add(it.id);
              spawnFountainBubble(it, false);
            }
          }
        }
      } catch {
        // ignore network errors
      }
    };

    checkLiveComments();
    const timer = window.setInterval(checkLiveComments, 5000);
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

    // 1. Immediately fade-in upward to random Desktop Part 2–4 (or Mobile center), hold, then descend & fade out
    spawnFountainBubble(newItem, true);

    // 2. Persist to Cloudflare D1 backend and record returned ID so polling doesn't duplicate it
    try {
      const res = await fetch('/api/world-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: newItem.author,
          content: newItem.content,
        }),
      });
      if (res.ok) {
        const j = await res.json();
        if (j?.data?.id) {
          seenRemoteIdsRef.current.add(j.data.id);
        }
      }
    } catch {
      // ignore offline
    }
  };

  const cooldownSec = Math.ceil(cooldownLeftMs / 1000);

  return (
    <>
      {/* ============================================================== */}
      {/* FOUNTAIN OVERLAY: Fades up -> holds at center -> descends      */}
      {/* Desktop spawns randomly in Columns 2, 3, or 4 (of 5 parts)     */}
      {/* ============================================================== */}
      <div className="pointer-events-none fixed inset-0 z-25 overflow-hidden">
        {floatingBubbles.map((b) => (
          <div
            key={b.instanceId}
            style={{
              left: `${b.leftPercent}%`,
              top: `${b.topPercent}%`,
            }}
            className={`animate-world-fountain absolute w-max max-w-[260px] sm:max-w-[320px] px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.85)] flex items-center gap-2.5 ${
              b.isSelf
                ? 'bg-gradient-to-r from-emerald-950/95 via-[#07261f]/95 to-slate-950/95 border-amber-400/80 text-amber-100 shadow-[0_0_28px_rgba(16,185,129,0.55)]'
                : 'bg-[#070d18]/92 border-emerald-500/45 text-slate-100 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
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

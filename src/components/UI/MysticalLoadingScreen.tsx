import React, { useEffect, useState } from 'react';
import type { SupportedLanguage } from '../../types/ghost';

interface MysticalLoadingScreenProps {
  isLoading: boolean;
  language: SupportedLanguage;
  pinsCount: number;
}

const STAGES_TH = [
  'กำลังเชื่อมต่อมิติความลี้ลับทั่วโลก...',
  'กำลังถอดรหัสตำนานโบราณ 300 เรื่อง...',
  'กำลังปรับสมดุลสนามแม่เหล็กดาวเคราะห์...',
  'พร้อมเปิดประตูสู่มิติเร้นลับ...',
];

const STAGES_EN = [
  'Connecting to global mystery dimensions...',
  'Decoding 300 ancient folklore tales...',
  'Calibrating planetary magnetic field...',
  'The occult gateway is opening...',
];

export const MysticalLoadingScreen: React.FC<MysticalLoadingScreenProps> = ({
  isLoading,
  language,
  pinsCount,
}) => {
  const [progress, setProgress] = useState(12);
  const [stageIndex, setStageIndex] = useState(0);
  const [shouldRender, setShouldRender] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Smooth simulated progress that accelerates and snaps to 100% when isLoading becomes false
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 92) return prev; // Hold at 92% until ready
          const step = Math.random() * 14 + 6;
          const next = Math.min(92, prev + step);
          if (next > 70) setStageIndex(2);
          else if (next > 35) setStageIndex(1);
          return next;
        });
      }, 260);
    } else {
      // Finished loading! Snap to 100% and initiate smooth fade-out
      setProgress(100);
      setStageIndex(3);
      const timer = setTimeout(() => {
        setIsFadingOut(true);
      }, 400);

      const removeTimer = setTimeout(() => {
        setShouldRender(false);
      }, 1100);

      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!shouldRender) return null;

  const stages = language === 'th' ? STAGES_TH : STAGES_EN;
  const currentStageText = stages[stageIndex];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] transition-opacity duration-700 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.05) 45%, rgba(3, 7, 18, 0.98) 100%)',
      }}
    >
      {/* Mystical Background Runes / Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-amber-500/10 rounded-full blur-[70px]" />
      </div>

      {/* Rotating Mystical Arcane Sigil Ring */}
      <div className="relative w-44 h-44 mb-8 flex items-center justify-center">
        {/* Outer clockwise ring */}
        <div
          className="absolute inset-0 rounded-full border border-emerald-500/30 border-dashed animate-spin"
          style={{ animationDuration: '28s' }}
        />

        {/* Counter-clockwise runic ring */}
        <div
          className="absolute inset-3 rounded-full border-2 border-amber-400/30 border-t-amber-400/90 border-b-emerald-400/90 animate-spin"
          style={{ animationDuration: '14s', animationDirection: 'reverse' }}
        />

        {/* Inner thin pulse ring */}
        <div className="absolute inset-7 rounded-full border border-emerald-400/40 animate-ping opacity-25" />

        {/* Center Glowing Diamond Sigil */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-950 via-gray-900 to-amber-950/80 border border-emerald-400/70 shadow-[0_0_35px_rgba(16,185,129,0.55)] flex items-center justify-center transform rotate-45 transition-transform duration-500">
          <div className="transform -rotate-45 flex flex-col items-center justify-center">
            <span className="text-2xl animate-pulse">🌍</span>
          </div>
        </div>
      </div>

      {/* Brand Title */}
      <div className="text-center z-10 px-6 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-black tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-200 to-teal-300 drop-shadow-[0_2px_12px_rgba(16,185,129,0.4)]">
          WORLD OF MYS
        </h1>
        <p className="mt-1 text-xs sm:text-sm font-medium tracking-widest text-emerald-200/60 uppercase">
          {language === 'th'
            ? `สารานุกรมเรื่องเล่าและอาถรรพ์ ${pinsCount > 0 ? pinsCount : 300} พิกัดทั่วโลก`
            : `Global Mystery & Folklore Archive • ${pinsCount > 0 ? pinsCount : 300} Pins`}
        </p>

        {/* Progress Bar Container */}
        <div className="mt-8 relative w-64 sm:w-80 h-2 bg-slate-900/90 border border-emerald-500/30 rounded-full overflow-hidden p-0.5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(52,211,153,0.8)]"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>

        {/* Percentage & Status Label */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono text-emerald-400/90">
          <span className="truncate max-w-[210px] sm:max-w-[260px] text-left text-slate-400">
            {currentStageText}
          </span>
          <span className="font-bold text-amber-300 ml-2">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Bottom subtle ambient badge */}
      <div className="absolute bottom-6 text-[10px] sm:text-xs text-slate-600 tracking-widest uppercase">
        3D Interactive Globe • Real-Time Folklore Engine
      </div>
    </div>
  );
};

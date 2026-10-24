import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  BookOpen,
  Sparkles,
  ChevronUp,
} from 'lucide-react';
import type { GhostPin, SupportedLanguage } from '../../types/ghost';
import { audioEngine } from '../../lib/audio';

interface RadioGardenPlayerProps {
  currentPin: GhostPin | null;
  onOpenDrawer: () => void;
  language: SupportedLanguage;
}

export const RadioGardenPlayer: React.FC<RadioGardenPlayerProps> = ({
  currentPin,
  onOpenDrawer,
  language,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Clock in the card (like in Radio Garden screenshot: "14:01")
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString(language === 'th' ? 'th-TH' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  // When currentPin changes
  useEffect(() => {
    if (currentPin) {
      setIsPlaying(true);
      audioEngine.playPresetSound(currentPin.sound_preset);
    }
  }, [currentPin]);

  const togglePlay = () => {
    if (!currentPin) return;
    if (isPlaying) {
      audioEngine.stopPresetSound();
      setIsPlaying(false);
    } else {
      audioEngine.playPresetSound(currentPin.sound_preset);
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioEngine.setMute(next);
  };

  if (!currentPin) {
    return (
      <aside aria-label="Audio player" className="fixed bottom-6 left-6 z-20 pointer-events-auto">
        <div className="px-5 py-4 rounded-2xl bg-slate-950/85 border border-slate-800/80 backdrop-blur-xl shadow-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 animate-pulse">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">
              {language === 'th' ? 'หมุนลูกโลกเพื่อจูนหาสัญญาณ' : 'Rotate globe to tune into folklore'}
            </p>
            <p className="text-[11px] text-slate-400">
              {language === 'th' ? 'คลิกที่จุดสีเขียวเพื่อฟังเรื่องเล่า' : 'Click any green dot to listen'}
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const title = language === 'th' ? currentPin.title_th : currentPin.title_en;
  const province = language === 'th' ? currentPin.province_th : currentPin.province_en;
  const district = language === 'th' ? currentPin.district_th : currentPin.district_en;

  return (
    <aside aria-label="Audio player" className="fixed bottom-6 left-6 z-20 pointer-events-auto w-80 md:w-96 animate-in slide-in-from-bottom duration-300">
      <div className="rounded-2xl bg-slate-950/90 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Top Header Card (Radio Garden Style) */}
        <div className="p-4 border-b border-slate-800/80 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Number / Category Badge */}
            <div className="w-11 h-11 rounded-full bg-emerald-950/80 border border-emerald-400/50 flex items-center justify-center text-emerald-400 font-bold shadow-[0_0_15px_rgba(0,255,136,0.3)]">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-base font-bold text-white tracking-wide leading-tight line-clamp-1">
                {title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {province} {district && `• ${district}`}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-semibold text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800">
              {currentTime}
            </span>
          </div>
        </div>

        {/* Player Controls Strip */}
        <div className="p-3.5 bg-slate-900/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#00ff88] hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,136,0.4)] transition-all transform active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
              )}
            </button>

            {/* Station / Sound Info */}
            <div>
              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Radio Garden Live</span>
              </p>
              <p className="text-[11px] text-slate-400 capitalize">
                {currentPin.sound_preset.replace('_', ' ')} Frequency
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Read full story button */}
            <button
              onClick={onOpenDrawer}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700 shadow-md"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'th' ? 'อ่านเรื่องเล่า' : 'Story'}</span>
              <ChevronUp className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

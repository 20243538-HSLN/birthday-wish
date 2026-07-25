import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Sparkles, Globe } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { Language } from '../types';

interface HeaderControlsProps {
  soundEnabled: boolean;
  bgmEnabled: boolean;
  lang: Language;
  onToggleSound: () => void;
  onToggleBgm: () => void;
  onToggleLanguage: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  soundEnabled,
  bgmEnabled,
  lang,
  onToggleSound,
  onToggleBgm,
  onToggleLanguage,
}) => {
  const [sparkling, setSparkling] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const handleSparkleClick = () => {
    soundEngine.playSparkle();
    setSparkling(true);
    setTimeout(() => setSparkling(false), 600);
  };

  return (
    <div className="fixed top-3 left-3 z-50 flex flex-col items-start gap-1">
      <header className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full border border-pink-200 shadow-sm text-xs font-serif text-pink-800">
        {/* Language Toggle Button */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onToggleLanguage();
          }}
          title={
            lang === 'ko'
              ? 'Click to switch to English'
              : lang === 'en'
              ? 'Click to switch to Burmese (မြန်မာ)'
              : '한국어로 변경하려면 클릭하세요'
          }
          className="px-2.5 py-1 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <Globe size={13} className="text-pink-600" />
          <span>
            {lang === 'ko' ? '한국어' : lang === 'en' ? 'English' : 'မြန်မာ'}
          </span>
        </button>

        <div className="w-px h-4 bg-pink-200" />

        <button
          onClick={() => {
            soundEngine.playPop();
            onToggleSound();
          }}
          title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          className="p-1.5 rounded-full hover:bg-pink-100 transition-colors flex items-center gap-1 text-pink-700"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-gray-400" />}
        </button>

        <div className="w-px h-4 bg-pink-200" />

        <button
          onClick={() => {
            soundEngine.playPop();
            onToggleBgm();
            setShowHint(false);
          }}
          title={bgmEnabled ? 'Pause Music Box BGM' : 'Play Music Box BGM'}
          className={`px-2 py-1 rounded-full flex items-center gap-1.5 transition-all ${
            bgmEnabled
              ? 'bg-pink-100 text-pink-700 font-medium shadow-xs animate-pulse'
              : 'hover:bg-pink-50 text-pink-500'
          }`}
        >
          <Music size={14} className={bgmEnabled ? 'animate-spin-slow' : ''} />
          <span>{bgmEnabled ? 'BGM ON 🎵' : 'BGM OFF'}</span>
        </button>

        <div className="w-px h-4 bg-pink-200" />

        <button
          onClick={handleSparkleClick}
          title="Magic Sparkle Sound"
          className={`p-1.5 rounded-full hover:bg-pink-100 text-pink-500 transition-transform ${
            sparkling ? 'scale-125 rotate-12 text-pink-600' : ''
          }`}
        >
          <Sparkles size={16} />
        </button>
      </header>

      {/* Sound Awareness Hint */}
      {showHint && !bgmEnabled && (
        <div className="flex items-center gap-1 bg-pink-100/90 text-pink-700 border border-pink-200 text-[10px] px-2.5 py-1 rounded-full shadow-2xs font-serif animate-bounce">
          <span>
            {lang === 'ko'
              ? '🔊 BGM과 함께 감상하시면 더 감동적이에요!'
              : lang === 'en'
              ? '🔊 Turn on BGM for the full experience!'
              : '🔊 BGM နောက်ခံသီချင်းနှင့် နားဆင်လျှင် ပိုမို ကြည်နူးစရာကောင်းပါသည်!'}
          </span>
        </div>
      )}
    </div>
  );
};

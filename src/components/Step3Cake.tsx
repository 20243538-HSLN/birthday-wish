import React, { useState } from 'react';
import { Sparkles, Wind } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { CakeFlavor, Language } from '../types';

interface Step3CakeProps {
  wishText: string;
  age: number;
  cakeFlavor: CakeFlavor;
  lang: Language;
  onChangeWish: (wish: string) => void;
  onBlowOutSuccess: () => void;
}

const FLAVOR_STYLES: Record<CakeFlavor, { top: string; body: string; stripe: string; sprinkles: string[] }> = {
  pink: {
    top: '#fff0f5',
    body: '#fde8f0',
    stripe: '#f9c5d8',
    sprinkles: ['#f9a8c9', '#d4b8f0', '#b8e0f0', '#f9a8c9'],
  },
  chocolate: {
    top: '#f3e8e2',
    body: '#795548',
    stripe: '#5d4037',
    sprinkles: ['#ffd080', '#ffb8c8', '#d4b8f0', '#ffd080'],
  },
  matcha: {
    top: '#f1f8e9',
    body: '#c8e6c9',
    stripe: '#81c784',
    sprinkles: ['#388e3c', '#81c784', '#f9a8c9', '#388e3c'],
  },
  cheese: {
    top: '#fffde7',
    body: '#fff59d',
    stripe: '#fbc02d',
    sprinkles: ['#ffa726', '#fbc02d', '#f9a8c9', '#ffa726'],
  },
};

const WISH_SUGGESTIONS_KO = [
  '매일매일 행복하고 웃음만 가득하길 🌸',
  '꿈꾸는 모든 소원이 전부 이루어지길 🌟',
  '올 한 해가 반짝이고 빛나는 일로 가득하길 ✨',
  '늘 건강하고 나 자신을 많이 사랑할 수 있길 ♡',
];

const WISH_SUGGESTIONS_EN = [
  'May every day be filled with happiness and smiles 🌸',
  'May all my dreams and wishes come true 🌟',
  'May this year be filled with bright and wonderful moments ✨',
  'May I stay healthy and love myself every day ♡',
];

const WISH_SUGGESTIONS_MY = [
  'နေ့ရက်တိုင်း ပျော်ရွှင်မှုနှင့် အပြုံးများ ပြည့်နှက်ပါစေ 🌸',
  'မက်ထားသမျှ အိမ်မက်နှင့် ဆုတောင်းများ ပြည့်ဝပါစေ 🌟',
  'ဒီနှစ်သစ်မှာ တောက်ပသော အခိုက်အတန့်များ ပြည့်နှက်ပါစေ ✨',
  'ကျန်းမာစွာဖြင့် မိမိကိုယ်ကို ပိုမို ချစ်နိုင်ပါစေ ♡',
];

export const Step3Cake: React.FC<Step3CakeProps> = ({
  wishText,
  age,
  cakeFlavor,
  lang,
  onChangeWish,
  onBlowOutSuccess,
}) => {
  const candleCount = 3;
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true]);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isKo = lang === 'ko';
  const isEn = lang === 'en';
  const wishSuggestions = isKo
    ? WISH_SUGGESTIONS_KO
    : isEn
    ? WISH_SUGGESTIONS_EN
    : WISH_SUGGESTIONS_MY;

  const toggleSingleCandle = (idx: number) => {
    if (candlesBlown) return;
    soundEngine.playPop();
    const updated = [...candlesLit];
    updated[idx] = !updated[idx];
    setCandlesLit(updated);

    if (updated.every((lit) => !lit)) {
      triggerBlowOut();
    }
  };

  const blowAllCandles = () => {
    if (!wishText.trim()) {
      soundEngine.playPop();
      setErrorMsg(
        isKo
          ? '소원을 먼저 작성해주시면 촛불을 끌 수 있어요 ♡'
          : isEn
          ? 'Please write your wish first to blow out candles ♡'
          : 'ကျေးဇူးပြု၍ ဆုတောင်းစကား ရေးပေးပါဦး ♡'
      );
      setTimeout(() => setErrorMsg(''), 2500);
      return;
    }
    triggerBlowOut();
  };

  const triggerBlowOut = () => {
    if (candlesBlown) return;
    setCandlesLit([false, false, false]);
    setCandlesBlown(true);
    soundEngine.playBlow();

    setTimeout(() => {
      soundEngine.playMagicWish();
      onBlowOutSuccess();
    }, 2800);
  };

  const flavorStyle = FLAVOR_STYLES[cakeFlavor];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative z-10">
      <div className="relative bg-white/88 border-2 border-[#f7c5d5] rounded-3xl p-6 max-w-sm w-full text-center shadow-[4px_4px_0px_#f7c5d5] backdrop-blur-xs">
        {/* Ribbon dots */}
        <div className="flex gap-1.5 justify-center mb-3">
          <div className="w-2 h-2 rounded-full bg-[#f9c5d8] animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-[#f5a8c4] animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-2 h-2 rounded-full bg-[#f9c5d8] animate-bounce" style={{ animationDelay: '0.3s' }} />
          <div className="w-2 h-2 rounded-full bg-[#f5a8c4] animate-bounce" style={{ animationDelay: '0.45s' }} />
          <div className="w-2 h-2 rounded-full bg-[#f9c5d8] animate-bounce" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Title Prompt */}
        {!candlesBlown ? (
          <div>
            <h2 className="font-dohyeon text-lg text-[#c96a8a] mb-0.5">
              {isKo ? '소원을 빌어주세요 ✿' : isEn ? 'Make a Wish ✿' : 'ဆုတောင်းပေးပါ ✿'}
            </h2>
            <p className="font-serif text-xs text-[#d49ab0] mb-2">
              {isKo ? (
                <>촛불을 끄기 전에,<br />마음속 소원을 적어주세요 ♡</>
              ) : isEn ? (
                <>Before blowing out candles,<br />write down your secret wish ♡</>
              ) : (
                <>ဖယောင်းတိုင် မငြှိမ်းမီ<br />စိတ်ထဲရှိ ဆုတောင်းကို ရေးပါ ♡</>
              )}
            </p>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <h2 className="font-dohyeon text-lg text-[#c96a8a] mb-0.5">
              {isKo
                ? '✦ 촛불이 꺼졌어요 ✦'
                : isEn
                ? '✦ Candles Blown Out ✦'
                : '✦ ဖယောင်းတိုင်များ ငြှိမ်းသွားပါပြီ ✦'}
            </h2>
            <p className="font-serif text-xs text-[#d4a0b5] mb-3">
              {isKo
                ? '소원이 하늘로 날아갈 준비가 됐어요 🌙'
                : isEn
                ? 'Your wish is ready to fly up to the sky 🌙'
                : 'ဆုတောင်းများ ကောင်းကင်သို့ ပျံသန်းရန် အသင့်ဖြစ်ပါပြီ 🌙'}
            </p>
          </div>
        )}

        {/* Pixel SVG Cake */}
        <div className="w-52 h-52 mx-auto relative flex items-center justify-center my-1 select-none">
          <svg
            viewBox="0 0 100 110"
            className="w-full h-full filter drop-shadow-md cursor-pointer"
            style={{ imageRendering: 'pixelated' }}
          >
            {/* Standard Candles Rendering */}
            {candlesLit.map((isLit, idx) => {
              const step = 60 / (candleCount + 1);
              const xPos = 20 + step * (idx + 1);
              const candleColors = ['#f9c5d8', '#d4b8f0', '#b8e0f0'];
              const color = candleColors[idx % candleColors.length];

              return (
                <g key={idx} onClick={() => toggleSingleCandle(idx)}>
                  {/* Candle Stick */}
                  <rect x={xPos - 2} y="16" width="4" height="16" fill={color} rx="1" />
                  <rect x={xPos - 1} y="14" width="2" height="3" fill="#7a5a3a" />

                  {/* Flame or Smoke */}
                  {isLit ? (
                    <g>
                      <rect x={xPos - 2.5} y="8" width="5" height="7" fill="#ffd080" rx="2" />
                      <rect x={xPos - 1} y="7" width="2" height="4" fill="#ffe8a0" />
                      <circle cx={xPos} cy="11" r="5" fill="#ff9800" opacity="0.2" className="animate-ping" />
                    </g>
                  ) : (
                    <g className="animate-fadeOut">
                      <circle cx={xPos} cy="10" r="2.5" fill="#d1d5db" opacity="0.6" />
                      <circle cx={xPos - 1} cy="6" r="3.5" fill="#e5e7eb" opacity="0.4" />
                    </g>
                  )}
                </g>
              );
            })}

            {/* Cake Top Layer */}
            <rect x="18" y="32" width="64" height="5" fill={flavorStyle.top} rx="2" />

            {/* Upper Tier */}
            <rect x="20" y="37" width="60" height="26" fill={flavorStyle.body} />
            <rect x="20" y="37" width="60" height="3" fill={flavorStyle.stripe} />
            <rect x="20" y="60" width="60" height="3" fill={flavorStyle.stripe} />

            {/* Sprinkles on Upper Tier */}
            <rect x="30" y="46" width="5" height="5" fill={flavorStyle.sprinkles[0]} rx="2" />
            <rect x="48" y="44" width="5" height="5" fill={flavorStyle.sprinkles[1]} rx="2" />
            <rect x="64" y="46" width="5" height="5" fill={flavorStyle.sprinkles[2]} rx="2" />

            {/* Cake Middle Trim */}
            <rect x="14" y="63" width="72" height="5" fill={flavorStyle.top} rx="2" />

            {/* Lower Tier */}
            <rect x="14" y="68" width="72" height="30" fill={flavorStyle.body} />
            <rect x="14" y="68" width="72" height="3" fill={flavorStyle.stripe} />
            <rect x="14" y="95" width="72" height="3" fill={flavorStyle.stripe} />

            {/* Sprinkles on Lower Tier */}
            <rect x="24" y="78" width="5" height="5" fill={flavorStyle.sprinkles[1]} rx="2" />
            <rect x="40" y="76" width="5" height="5" fill={flavorStyle.sprinkles[0]} rx="2" />
            <rect x="56" y="78" width="5" height="5" fill={flavorStyle.sprinkles[2]} rx="2" />
            <rect x="70" y="76" width="5" height="5" fill={flavorStyle.sprinkles[3]} rx="2" />

            {/* Plate Base */}
            <rect x="8" y="98" width="84" height="5" fill="#f5d0e0" rx="2" />
            <rect x="6" y="101" width="88" height="3" fill="#f0c0d4" rx="1" />
          </svg>
        </div>

        {/* Input & Blow Button */}
        {!candlesBlown && (
          <div className="space-y-2 mt-1">
            <textarea
              value={wishText}
              onChange={(e) => onChangeWish(e.target.value)}
              placeholder={
                errorMsg ||
                (isKo
                  ? '소원을 여기에 적어주세요 ...'
                  : isEn
                  ? 'Write your secret wish here...'
                  : 'သင့်ဆုတောင်းကို ဒီမှာ ရေးပါ ...')
              }
              className={`w-full bg-[#fff0f5] border-1.5 rounded-2xl p-3 font-serif text-xs text-[#7a3a52] outline-none resize-none h-20 transition-all placeholder:text-[#c4809a] ${
                errorMsg
                  ? 'border-pink-600 animate-shake bg-pink-100'
                  : 'border-[#f5b8cc] focus:border-[#e87fa8] focus:ring-2 focus:ring-pink-200'
              }`}
            />

            {/* Quick Wish Suggestions */}
            <div className="flex flex-wrap gap-1 justify-center my-1">
              {wishSuggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => {
                    soundEngine.playPop();
                    onChangeWish(sug);
                  }}
                  className="text-[10px] bg-pink-50 hover:bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full border border-pink-200 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Blow button */}
            <div className="pt-1">
              <button
                onClick={blowAllCandles}
                className="w-full bg-[#d9567a] hover:bg-[#c0385e] border-2 border-[#b83a60] rounded-full py-2.5 px-4 font-dohyeon text-sm text-white tracking-wider cursor-pointer shadow-[0_3px_0_#9a2e50] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <Wind size={16} />
                <span>
                  {isKo
                    ? '🌬 촛불 끄기'
                    : isEn
                    ? '🌬 Blow Out Candles'
                    : '🌬 ဖယောင်းတိုင် ငြှိမ်းရန်'}
                </span>
              </button>
            </div>
          </div>
        )}

        {candlesBlown && (
          <div className="mt-4 p-3 bg-pink-50 border border-pink-200 rounded-xl animate-fadeIn">
            <p className="font-serif text-xs text-pink-800 italic">
              "
              {wishText ||
                (isKo
                  ? '모든 바람이 행복으로 이뤄지기를'
                  : isEn
                  ? 'May all your wishes turn into happiness'
                  : 'ဆုတောင်းသမျှ အရာအားလုံး ပျော်ရွှင်မှု ပြည့်ဝပါစေ')}
              "
            </p>
            <div className="flex items-center justify-center gap-1 text-[11px] text-pink-500 mt-2">
              <Sparkles size={12} className="animate-spin-slow" />
              <span>
                {isKo
                  ? '소원이 별빛에 담기고 있어요...'
                  : isEn
                  ? 'Your wish is being wrapped in starlight...'
                  : 'ဆုတောင်းများကို ကြယ်ရောင်များဖြင့် ထုပ်ပိုးနေပါသည်...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

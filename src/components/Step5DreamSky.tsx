import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Download, Check, RotateCcw, Heart } from 'lucide-react';
import { toPng } from 'html-to-image';
import { soundEngine } from '../utils/soundEngine';
import { Language } from '../types';

interface Step5DreamSkyProps {
  recipientName: string;
  age: number;
  customMessage: string;
  wishText: string;
  lang: Language;
  onRestart: () => void;
}

export const Step5DreamSky: React.FC<Step5DreamSkyProps> = ({
  recipientName,
  age,
  customMessage,
  wishText,
  lang,
  onRestart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const exportCardRef = useRef<HTMLDivElement | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isKo = lang === 'ko';
  const isEn = lang === 'en';

  useEffect(() => {
    soundEngine.playCelebration();
  }, []);

  // HTML5 Pastel Dream Sky Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Stars
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.9,
      r: Math.random() * 1.5 + 0.3,
      speed: 0.002 + Math.random() * 0.005,
      phase: Math.random() * Math.PI * 2,
      hue: Math.random() < 0.3 ? 300 : Math.random() < 0.6 ? 210 : 50,
    }));

    // Floating blossom petals
    const bcolors = ['#ffb8d4', '#ffd0e8', '#e8b8f0', '#b8d8f8', '#ffd8c0'];
    const blossoms = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vy: 0.25 + Math.random() * 0.35,
      vx: (Math.random() - 0.5) * 0.3,
      r: 3 + Math.random() * 4,
      col: bcolors[Math.floor(Math.random() * bcolors.length)],
      rot: Math.random() * Math.PI * 2,
      rotsp: (Math.random() - 0.5) * 0.02,
      alpha: 0.35 + Math.random() * 0.45,
      wob: Math.random() * Math.PI * 2,
      wobsp: 0.015 + Math.random() * 0.02,
    }));

    let tick = 0;

    const render = () => {
      tick++;

      // Soft pastel gradient
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, '#c8b0e0'); // lavender
      bg.addColorStop(0.25, '#d8b8e8');
      bg.addColorStop(0.5, '#e8c0e0'); // rose
      bg.addColorStop(0.75, '#f8daea'); // blush
      bg.addColorStop(1, '#fff0f6'); // white pink
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Stars
      stars.forEach((s) => {
        const b = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(tick * s.speed + s.phase));
        ctx.save();
        ctx.globalAlpha = b * 0.8;
        ctx.fillStyle = `hsl(${s.hue}, 80%, 94%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Floating blossoms
      blossoms.forEach((bl) => {
        bl.y += bl.vy;
        bl.x += bl.vx + Math.sin(bl.wob) * 0.4;
        bl.wob += bl.wobsp;
        bl.rot += bl.rotsp;
        if (bl.y > height + 10) {
          bl.y = -10;
          bl.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = bl.alpha;
        ctx.translate(bl.x, bl.y);
        ctx.rotate(bl.rot);
        ctx.fillStyle = bl.col;
        ctx.beginPath();
        ctx.ellipse(0, -bl.r, bl.r * 0.5, bl.r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Pastel glowing moon
      const mx = width * 0.82;
      const my = height * 0.14;
      ctx.save();
      const mg = ctx.createRadialGradient(mx, my, 2, mx, my, 55);
      mg.addColorStop(0, 'rgba(255, 248, 252, 0.95)');
      mg.addColorStop(0.4, 'rgba(255, 230, 245, 0.6)');
      mg.addColorStop(1, 'rgba(255, 210, 235, 0)');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(mx, my, 75, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 248, 252, 0.92)';
      ctx.beginPath();
      ctx.arc(mx, my, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameId);
  }, []);

  const handleSaveToGallery = async () => {
    if (isSaving || !exportCardRef.current) return;
    soundEngine.playSparkle();
    setIsSaving(true);

    try {
      const dataUrl = await toPng(exportCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#fff8fc',
        skipFonts: true,
        fontEmbedCSS: '',
      });

      const link = document.createElement('a');
      const filename = `${recipientName || (isKo ? '생일' : 'Birthday')}_wish_card.png`;
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save image:', error);
      alert(
        isKo
          ? '카드 이미지 저장 중 오류가 발생했습니다.'
          : isEn
          ? 'An error occurred while saving the card image.'
          : 'ကတ်ပုံရိပ် သိမ်းဆည်းရာတွင် အမှားအယွင်း ရှိပါသည်'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden flex flex-col items-center justify-center p-4 z-20 overflow-y-auto">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-30 max-w-[420px] w-full animate-scaleUp my-auto px-1">
        {/* Wish Fulfilled Card to be Saved */}
        <div
          ref={exportCardRef}
          className="bg-[#fff8fc] border border-[#ffd2e6] rounded-3xl p-5 sm:p-6 text-center shadow-[0_8px_40px_rgba(255,160,210,0.22)] backdrop-blur-md mb-3"
        >
          <span className="text-4xl mb-2 block filter drop-shadow-[0_0_12px_rgba(255,180,220,0.6)]">
            🌙
          </span>

          <div className="text-[11px] font-serif text-[#b06080] tracking-widest mb-2 flex items-center justify-center gap-1.5 uppercase">
            <Sparkles size={12} className="text-pink-400" />
            <span>{isKo ? '소원 전송 완료 ✦' : isEn ? 'Wish Sent ✦' : 'ဆုတောင်းစကား ပို့ဆောင်ပြီးပါပြီ ✦'}</span>
            <Sparkles size={12} className="text-pink-400" />
          </div>

          <h2 className="font-playfair italic text-xl sm:text-2xl text-[#c06888] leading-tight mb-2 px-1">
            {isKo
              ? '소원이 하늘로 날아갔어요'
              : isEn
              ? 'Your wish has flown up to the sky'
              : 'ဆုတောင်းများ ကောင်းကင်သို့ ပျံသန်းသွားပါပြီ'}
          </h2>

          <p className="font-serif text-xs text-[#c8a0b8] leading-relaxed mb-4">
            {isKo ? (
              <>별빛에 실어 보낸 소원,<br />반드시 이루어질 거예요 ✦</>
            ) : isEn ? (
              <>A wish sent on starlight<br />will surely come true ✦</>
            ) : (
              <>ကြယ်ရောင်များဖြင့် ပို့လွှတ်လိုက်သော ဆုတောင်းများ<br />ဧကန္တ ပြည့်ဝပါလိမ့်မည် ✦</>
            )}
          </p>

          {/* Card Summary Box */}
          <div className="bg-gradient-to-br from-[#fff0f6] to-[#fff8fc] border-2 border-pink-200 rounded-2xl p-3.5 sm:p-4 text-left font-serif text-xs text-pink-900 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between font-bold text-pink-700 border-b border-pink-200/80 pb-2 gap-1.5">
              <span className="whitespace-nowrap text-[11px] sm:text-xs tracking-tight">
                🎉{' '}
                {isKo
                  ? `${recipientName || '주인공'}님의 ${age === 20 ? '스무 살' : `${age}번째`} 생일 카드`
                  : isEn
                  ? `${age === 20 ? '20th' : `${age}th`} Birthday Card for ${recipientName || 'You'}`
                  : `${recipientName || 'သင်'}၏ ${age} နှစ်မြောက် မွေးနေ့ကတ်`}
              </span>
              <Heart size={14} className="fill-pink-400 text-pink-400 shrink-0" />
            </div>

            <div className="text-[#a05070] leading-relaxed py-1 whitespace-pre-line text-center italic">
              "
              {customMessage ||
                (isKo
                  ? '오늘 하루가 온전히 당신의 것이기를,\n환한 미소가 가득한 하루가 되기를 바라요 ✦'
                  : isEn
                  ? 'May this day belong entirely to you,\nfilled with bright and happy smiles ✦'
                  : 'ဒီနေ့ရက်လေးဟာ သင်တစ်ယောက်တည်းအတွက် သီးသန့်ဖြစ်ပြီး\nအပြုံးများဖြင့် ပြည့်နှက်ပါစေ ✦')}
              "
            </div>

            <div className="bg-pink-100/60 border border-pink-200/60 rounded-xl p-2.5 text-center text-[11px] text-pink-800 font-serif">
              🌟 <span className="font-semibold">{isKo ? '비밀 소원:' : isEn ? 'Secret Wish:' : 'လျှို့ဝှက်ဆုတောင်း:'}</span> "
              {wishText ||
                (isKo
                  ? '바라는 모든 꿈이 예쁘게 피어나기를'
                  : isEn
                  ? 'May all your dreams bloom beautifully'
                  : 'မက်ထားသမျှ အိမ်မက်များ လှပစွာ ပွင့်လန်းပါစေ')}
              "
            </div>

            <div className="text-[11px] text-pink-400 text-right font-medium pt-1">
              {isKo
                ? '— 당신의 미소를 바라는 누군가로부터 🌙'
                : isEn
                ? '— From someone who wishes for your smile 🌙'
                : '— သင့်ပြုံးပျော်မှုကို လိုလားသူတစ်ဦးထံမှ 🌙'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSaveToGallery}
            disabled={isSaving}
            className="w-full bg-pink-100 hover:bg-pink-200 border border-pink-300 rounded-full py-2.5 px-4 font-serif text-xs text-pink-800 transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {saved ? (
              <Check size={14} className="text-emerald-600" />
            ) : (
              <Download size={14} className="text-pink-600" />
            )}
            <span>
              {isSaving
                ? isKo
                  ? '이미지 생성 중...'
                  : isEn
                  ? 'Generating image...'
                  : 'ပုံရိပ် ဖန်တီးနေသည်...'
                : saved
                ? isKo
                  ? '갤러리에 저장 완료! 🖼️'
                  : isEn
                  ? 'Saved to gallery! 🖼️'
                  : 'ဓာတ်ပုံအယ်လ်ဘမ်ထဲသို့ သိမ်းပြီးပါပြီ! 🖼️'
                : isKo
                ? '🖼️ 갤러리에 카드 저장하기'
                : isEn
                ? '🖼️ Save Card to Gallery'
                : '🖼️ ဓာတ်ပုံထဲသို့ ကတ် သိမ်းဆည်းရန်'}
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              onRestart();
            }}
            className="w-full bg-[#d9567a] hover:bg-[#c0385e] border-2 border-[#b83a60] rounded-full py-2.5 px-4 font-dohyeon text-sm text-white tracking-wider cursor-pointer shadow-[0_3px_0_#9a2e50] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>
              {isKo
                ? '↺ 처음으로 돌아가기'
                : isEn
                ? '↺ Start From Beginning'
                : '↺ အစမှ ပြန်လည်စတင်ရန်'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};


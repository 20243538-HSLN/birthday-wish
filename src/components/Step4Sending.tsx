import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { Language } from '../types';

interface Step4SendingProps {
  wishText: string;
  lang: Language;
  onComplete: () => void;
}

export const Step4Sending: React.FC<Step4SendingProps> = ({ wishText, lang, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isKo = lang === 'ko';
  const isEn = lang === 'en';

  const [label, setLabel] = useState(
    isKo
      ? '소원을 보내는 중'
      : isEn
      ? 'Sending your wish'
      : 'ဆုတောင်းစကား ပို့ဆောင်နေပါသည်'
  );
  const [subText, setSubText] = useState(
    isKo
      ? '별빛에 실어 띄워올리고 있어요 ✦'
      : isEn
      ? 'Carrying it up on starlight ✦'
      : 'ကြယ်ရောင်များပေါ်တင်၍ လွှင့်တင်နေပါသည် ✦'
  );

  useEffect(() => {
    soundEngine.playMagicWish();

    // Sequence of messages
    const msgs = isKo
      ? [
          { label: '소원을 보내는 중', sub: '별빛에 실어 띄워올리고 있어요 ✦' },
          { label: '별에게 전달 중', sub: '가장 반짝이는 별을 찾고 있어요 ✧' },
          { label: '하늘에 닿았어요 ✦', sub: '소원이 무사히 도착했어요 🌙' },
        ]
      : isEn
      ? [
          { label: 'Sending your wish', sub: 'Carrying it up on starlight ✦' },
          { label: 'Delivering to stars', sub: 'Finding the brightest star for you ✧' },
          { label: 'Reached the night sky ✦', sub: 'Your wish has arrived safely 🌙' },
        ]
      : [
          { label: 'ဆုတောင်းစကား ပို့ဆောင်နေပါသည်', sub: 'ကြယ်ရောင်များပေါ်တင်၍ လွှင့်တင်နေပါသည် ✦' },
          { label: 'ကြယ်ပွင့်များထံ ပို့ဆောင်နေပါသည်', sub: 'အတောက်ပဆုံး ကြယ်ပွင့်ကို ရှာဖွေနေပါသည် ✧' },
          { label: 'ညကောင်းကင်ယံသို့ ရောက်ရှိပါပြီ ✦', sub: 'ဆုတောင်းစကား ဘေးကင်းစွာ ရောက်ရှိသွားပါပြီ 🌙' },
        ];

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < msgs.length) {
        setLabel(msgs[idx].label);
        setSubText(msgs[idx].sub);
        soundEngine.playSparkle();
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [onComplete, isKo]);

  // HTML5 Canvas animation for deep starry night sky
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Star particles
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      r: Math.random() * 1.2 + 0.3,
      speed: 0.003 + Math.random() * 0.008,
      phase: Math.random() * Math.PI * 2,
      sparkle: Math.random() < 0.25,
      sr: 1.3 + Math.random() * 2,
    }));

    // Shooting stars
    const shooters = Array.from({ length: 3 }, (_, i) => ({
      x: Math.random() * width * 0.8,
      y: Math.random() * height * 0.4,
      len: 60 + Math.random() * 60,
      speed: 2.8 + Math.random() * 2.2,
      angle: Math.PI / 5 + Math.random() * 0.28,
      life: 0,
      max: 55 + Math.random() * 40,
      delay: 80 + i * 200 + Math.floor(Math.random() * 150),
    }));

    // Magic symbol particles
    const magicSymbols = ['✦', '✧', '✶', '⋆', '·', '✺', '❋'];
    const magic = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: height * 0.2 + Math.random() * height * 0.7,
      vy: -(0.2 + Math.random() * 0.4),
      vx: (Math.random() - 0.5) * 0.3,
      sym: magicSymbols[Math.floor(Math.random() * magicSymbols.length)],
      sz: 8 + Math.random() * 10,
      alpha: 0,
      max: 0.4 + Math.random() * 0.45,
      life: 0,
      maxLife: 130 + Math.floor(Math.random() * 120),
      hue: Math.random() < 0.33 ? 310 : Math.random() < 0.5 ? 270 : 195,
      wob: Math.random() * Math.PI * 2,
      wobsp: 0.016 + Math.random() * 0.022,
    }));

    // Floating wish bubble
    const bub = { x: width / 2, y: height * 0.75, vy: -0.32, wob: 0, alpha: 0 };

    // Fairy orbit ring particles around bubble
    const fairies = Array.from({ length: 18 }, (_, i) => ({
      a: ((Math.PI * 2) / 18) * i,
      r: 35 + Math.random() * 15,
      sp: 0.03 * (i % 2 === 0 ? 1 : -1),
      sym: ['✦', '✧', '⋆', '✿'][i % 4],
      sz: 8 + Math.random() * 3,
      hue: 280 + (i * 10) % 60,
    }));

    let tick = 0;

    const render = () => {
      tick++;

      // Gradient background
      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, '#080414');
      g.addColorStop(0.28, '#160c30');
      g.addColorStop(0.55, '#301248');
      g.addColorStop(0.75, '#5e2050');
      g.addColorStop(0.9, '#a06070');
      g.addColorStop(1, '#d8a0b8');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // Render stars
      stars.forEach((s) => {
        const b = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(tick * s.speed + s.phase));
        ctx.save();
        if (s.sparkle) {
          const p = s.sr * (0.7 + 0.3 * Math.sin(tick * s.speed * 1.3 + s.phase));
          ctx.globalAlpha = b * 0.9;
          ctx.fillStyle = '#fff0fa';
          ctx.beginPath();
          ctx.arc(s.x, s.y, p, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = b * 0.85;
          ctx.fillStyle = '#fce4ec';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Render shooting stars
      shooters.forEach((ss) => {
        if (tick < ss.delay) return;
        ss.life++;
        if (ss.life > ss.max) {
          ss.life = 0;
          ss.x = Math.random() * width * 0.8;
          ss.y = Math.random() * height * 0.35;
          ss.delay = 0;
        }
        const prog = ss.life / ss.max;
        const cx = ss.x + Math.cos(ss.angle) * ss.speed * ss.life;
        const cy = ss.y + Math.sin(ss.angle) * ss.speed * ss.life;
        const tail = Math.min(prog * 2, 1);
        const ax = cx - Math.cos(ss.angle) * ss.len * tail;
        const ay = cy - Math.sin(ss.angle) * ss.len * tail;

        const sg = ctx.createLinearGradient(ax, ay, cx, cy);
        sg.addColorStop(0, 'rgba(255,200,225,0)');
        sg.addColorStop(1, `rgba(255,215,238,${0.85 * (1 - prog)})`);
        ctx.save();
        ctx.strokeStyle = sg;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.restore();
      });

      // Render moon
      const mx = width * 0.8;
      const my = height * 0.12;
      ctx.save();
      const mg = ctx.createRadialGradient(mx, my, 2, mx, my, 45);
      mg.addColorStop(0, '#fff2fa');
      mg.addColorStop(0.5, '#ffd0e8');
      mg.addColorStop(1, 'rgba(255,180,230,0)');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(mx, my, 65, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff5fa';
      ctx.beginPath();
      ctx.arc(mx, my, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Render magic particles
      magic.forEach((p) => {
        p.life++;
        if (p.life > p.maxLife) {
          p.life = 0;
          p.y = height * 0.25 + Math.random() * height * 0.65;
          p.x = Math.random() * width;
          p.alpha = 0;
        }
        p.wob += p.wobsp;
        p.y += p.vy;
        p.x += Math.sin(p.wob) * 0.3;
        const prog = p.life / p.maxLife;
        if (prog < 0.15) p.alpha = Math.min(p.max, p.alpha + 0.03);
        else if (prog > 0.72) p.alpha = Math.max(0, p.alpha - 0.02);

        if (p.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = p.alpha * (0.55 + 0.45 * Math.sin(tick * 0.065 + p.wob));
        ctx.fillStyle = `hsl(${p.hue},75%,85%)`;
        ctx.font = `${p.sz}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(p.sym, p.x, p.y);
        ctx.restore();
      });

      // Render Wish Bubble floating up
      if (bub.alpha < 1) bub.alpha = Math.min(1, bub.alpha + 0.01);
      bub.wob += 0.012;
      bub.y -= 0.45;
      const wx = bub.x + Math.sin(bub.wob) * 6;

      // Measure and wrap wish text
      const defaultWishMsg = isKo ? '행복한 소원 ✿' : isEn ? 'Happy Wish ✿' : 'မင်္ဂလာရှိသော ဆုတောင်း ✿';
      const rawText = wishText.trim() || defaultWishMsg;
      const fullWishText = `"${rawText}"`;

      const fontStr = '12px "Pyidaungsu", "Noto Sans Myanmar", Nanum Myeongjo, serif, sans-serif';
      ctx.font = fontStr;

      const maxBoxW = Math.min(width * 0.85, 310);
      const maxTextW = maxBoxW - 36;

      // Helper to split text into grapheme clusters (keeps Burmese diacritics attached)
      const getGraphemes = (str: string): string[] => {
        if (typeof Intl !== 'undefined' && Intl.Segmenter) {
          const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
          return Array.from(segmenter.segment(str), (s) => s.segment);
        }
        return Array.from(str);
      };

      // Helper to wrap text into lines for canvas safely
      const wrapCanvasText = (str: string, maxW: number): string[] => {
        const lines: string[] = [];
        const paragraphs = str.split('\n');

        for (const p of paragraphs) {
          if (!p) continue;
          const words = p.split(' ');
          let currentLine = '';

          for (const word of words) {
            if (!word) continue;

            const test = currentLine ? `${currentLine} ${word}` : word;

            if (ctx.measureText(test).width <= maxW) {
              currentLine = test;
            } else {
              if (currentLine) {
                lines.push(currentLine);
                currentLine = '';
              }

              if (ctx.measureText(word).width <= maxW) {
                currentLine = word;
              } else {
                // Break word by graphemes if it exceeds maxW (e.g. Burmese phrases without spaces)
                const graphemes = getGraphemes(word);
                for (const g of graphemes) {
                  const testG = currentLine + g;
                  if (ctx.measureText(testG).width > maxW && currentLine) {
                    lines.push(currentLine);
                    currentLine = g;
                  } else {
                    currentLine = testG;
                  }
                }
              }
            }
          }

          if (currentLine) {
            lines.push(currentLine);
          }
        }

        return lines.length > 0 ? lines : [str];
      };

      const wishLines = wrapCanvasText(fullWishText, maxTextW);
      const maxMeasuredW = Math.max(...wishLines.map((l) => ctx.measureText(l).width));
      const boxW = Math.max(160, Math.min(maxBoxW, maxMeasuredW + 36));
      const lineHeight = lang === 'my' ? 22 : 19;
      const boxH = Math.max(48, wishLines.length * lineHeight + 20);
      const bx = wx - boxW / 2;
      const by = bub.y - boxH / 2;

      // Orbiting fairies
      fairies.forEach((f) => {
        f.a += f.sp;
        const orbitRx = boxW / 2 + 12;
        const orbitRy = boxH / 2 + 8;
        const fx = wx + Math.cos(f.a) * orbitRx;
        const fy = bub.y + Math.sin(f.a) * orbitRy;

        ctx.save();
        ctx.globalAlpha = bub.alpha * 0.9;
        ctx.fillStyle = `hsl(${f.hue},85%,92%)`;
        ctx.font = `${f.sz}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(f.sym, fx, fy);
        ctx.restore();
      });

      // Wish Bubble Box
      ctx.save();
      ctx.globalAlpha = bub.alpha * 0.92;
      ctx.fillStyle = 'rgba(255, 245, 250, 0.92)';
      ctx.strokeStyle = 'rgba(240, 140, 180, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.globalAlpha = bub.alpha;
      ctx.fillStyle = '#7a3050';
      ctx.font = fontStr;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const startY = bub.y - ((wishLines.length - 1) * lineHeight) / 2;
      wishLines.forEach((line, idx) => {
        ctx.fillText(line, wx, startY + idx * lineHeight);
      });
      ctx.restore();

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrameId);
  }, [wishText, lang, isKo, isEn]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0a0618] overflow-hidden flex flex-col justify-end items-center z-20 pb-12">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Sending Status Card */}
      <div className="relative z-30 bg-white/90 border-2 border-[#f7c5d5] rounded-3xl p-5 max-w-xs w-11/12 text-center shadow-[4px_4px_0px_#f7c5d5] backdrop-blur-xs animate-riseIn">
        <h3 className="font-dohyeon text-lg text-[#c96a8a] tracking-wide mb-1">{label}</h3>

        <div className="flex gap-1.5 justify-center my-2">
          <div className="w-2 h-2 rounded-full bg-[#d9567a] animate-ping" />
          <div className="w-2 h-2 rounded-full bg-[#d9567a] animate-ping" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-[#d9567a] animate-ping" style={{ animationDelay: '0.4s' }} />
        </div>

        <p className="font-serif text-xs text-[#d49ab0] leading-relaxed">{subText}</p>
      </div>
    </div>
  );
};

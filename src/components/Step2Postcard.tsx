import React from 'react';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { Language } from '../types';

interface Step2PostcardProps {
  recipientName: string;
  age: number;
  customMessage: string;
  lang: Language;
  onChangeMessage: (msg: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Postcard: React.FC<Step2PostcardProps> = ({
  recipientName,
  age,
  customMessage,
  lang,
  onNext,
  onBack,
}) => {
  const isKo = lang === 'ko';
  const isEn = lang === 'en';

  const defaultMsg =
    age === 20
      ? isKo
        ? "스무 살, 당신의 새로운 시작을 응원해요 ✨\n빛나는 20대가 더욱 눈부시고 행복하길 ✦\n이제 소원을 빌러 가볼까요 ?"
        : isEn
        ? "Happy 20th Birthday! Cheers to your 20s ✨\nMay this new chapter be filled with bright and wonderful moments ✦\nShall we go make a wish now?"
        : "၂၀ နှစ်မြောက် မွေးနေ့မှသည် အသစ်သော စတင်မှုများကို ဂုဏ်ပြုပါသည် ✨\nတောက်ပသော အနာဂတ်နေ့ရက်များ ပျော်ရွှင်ပါစေ ✦\nကဲ... ဆုတောင်းလေး တောင်းကြည့်ကြမလား?"
      : isKo
      ? `당신의 ${age}번째 생일을 진심으로 축하해요 ✨\n오늘 하루가 온전히 당신의 것이기를 바라요 ✦\n이제 소원을 빌러 가볼까요 ?`
      : isEn
      ? `Wishing you a wonderful ${age}${age === 21 ? 'st' : age === 22 ? 'nd' : age === 23 ? 'rd' : 'th'} Birthday ✨\nMay this day belong entirely to you ✦\nShall we go make a wish now?`
      : `${age} နှစ်မြောက် မွေးနေ့မှသည် ပျော်ရွှင်ပါစေ ✨\nဒီနေ့ရက်လေးဟာ သင်တစ်ယောက်တည်းအတွက် သီးသန့်ဖြစ်ပါစေ ✦\nကဲ... ဆုတောင်းလေး တောင်းကြည့်ကြမလား?`;

  const messageToShow = customMessage.trim() || defaultMsg;
  const fromToShow = isKo
    ? "— 당신의 미소를 바라는 누군가로부터 🌙"
    : isEn
    ? "— From someone who wishes for your smile 🌙"
    : "— သင့်ပြုံးပျော်မှုကို လိုလားသူတစ်ဦးထံမှ 🌙";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative z-10 bg-gradient-to-br from-[#fff0f6] to-[#ffe4f0]">
      {/* Postcard Container */}
      <div className="relative bg-white border-2 border-[#f7c5d5] rounded-xl max-w-sm w-full shadow-[5px_5px_0px_#f7c5d5,9px_9px_0px_rgba(247,197,213,0.35)] overflow-hidden transition-all">
        {/* Stamp */}
        <div className="absolute top-3.5 right-3.5 w-11 h-14 bg-[#fff5f8] border border-[#f5b8cc] rounded-xs flex flex-col items-center justify-center font-serif text-xs gap-0.5 z-20 shadow-xs">
          <span className="text-base">🌸</span>
          <span className="font-dohyeon text-[10px] text-[#c07090]">
            {isKo ? '생일' : isEn ? 'BDAY' : 'မွေးနေ့'}
          </span>
        </div>

        {/* Top Section */}
        <div className="relative p-6 pb-4 text-center bg-white overflow-hidden">
          {/* Confetti background elements */}
          <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
            <div className="absolute top-2 left-6 w-2 h-2 rounded-full bg-pink-300 animate-ping" />
            <div className="absolute top-8 left-12 w-1.5 h-1.5 bg-purple-300 rotate-45" />
            <div className="absolute top-4 right-16 w-2 h-2 rounded-full bg-yellow-200" />
            <div className="absolute top-10 right-20 w-1.5 h-1.5 bg-[#f9a8c9] rounded-xs" />
          </div>

          {/* Top Gems Divider */}
          <div className="flex items-center gap-1.5 justify-center mb-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f5b8cc] to-transparent" />
            <div className="w-1.5 h-1.5 bg-[#f9a8c9] rotate-45" />
            <div className="w-1.5 h-1.5 bg-[#f9a8c9] rotate-45" />
            <div className="w-1.5 h-1.5 bg-[#f9a8c9] rotate-45" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f5b8cc] to-transparent" />
          </div>

          <div className="font-serif italic text-xs text-[#d4a0b8] tracking-widest mb-0.5 animate-fadeIn">
            Happy Birthday!!
          </div>
          <h2 className="font-dohyeon text-2xl text-[#c96a8a] tracking-wider leading-tight mb-1 [word-break:keep-all] break-keep">
            {isKo
              ? age === 20
                ? '스무 살 생일 축하해!'
                : `${age}번째 생일 축하해!`
              : isEn
              ? `Happy ${age === 20 ? '20th' : `${age}th`} Birthday!`
              : `${age} နှစ်မြောက် မွေးနေ့မင်္ဂလာပါ!`}
          </h2>

          <div className="inline-block bg-pink-50 border border-pink-200 text-pink-700 text-[10px] font-serif px-2.5 py-0.5 rounded-full mb-2 [word-break:keep-all] break-keep">
            ✦{' '}
            {isKo
              ? age === 20
                ? '스무 살의 특별한 추억'
                : `${age}번째 생일의 특별한 추억`
              : isEn
              ? age === 20
                ? '20th Birthday Special Memory'
                : `${age}${age === 21 ? 'st' : age === 22 ? 'nd' : age === 23 ? 'rd' : 'th'} Birthday Special Memory`
              : `${age} နှစ်မြောက် အထူးမွေးနေ့`}{' '}
            ✦
          </div>

          {/* Big Shimmer Name */}
          <div className="my-2">
            <div className="font-dohyeon text-3.5xl bg-gradient-to-r from-[#c96a8a] via-[#e898c0] to-[#c96a8a] bg-[length:200%] bg-clip-text text-transparent animate-shimmer tracking-wide">
              {recipientName || (isKo ? '당신' : isEn ? 'You' : 'သင်')}
              {isKo ? '님' : ''}
            </div>
          </div>

          <div className="text-xs text-[#e0a8c0] tracking-widest my-2">
            ✦ &nbsp; ✿ &nbsp; ✦ &nbsp; ✿ &nbsp; ✦
          </div>

          {/* Bottom Gem Divider */}
          <div className="flex items-center gap-1.5 justify-center mt-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f5b8cc] to-transparent" />
            <div className="w-1 h-1 bg-[#f9c5d8] rounded-full" />
            <div className="w-1 h-1 bg-[#f9c5d8] rounded-full" />
            <div className="w-1 h-1 bg-[#f9c5d8] rounded-full" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#f5b8cc] to-transparent" />
          </div>
        </div>

        {/* Postcard Middle Message */}
        <div className="px-6 bg-white relative">
          <div className="h-px bg-gradient-to-r from-transparent via-[#f5c8d8] to-transparent my-1" />

          <div className="py-3 relative">
            <p className="font-serif text-xs text-[#b06080] leading-loose whitespace-pre-line text-center">
              {messageToShow}
            </p>
          </div>

          <div className="font-serif italic text-[11px] text-[#d4a0b5] text-right pb-3">
            {fromToShow}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#f5c8d8] to-transparent my-1" />
        </div>

        {/* Action Button */}
        <div className="p-6 pt-3 text-center bg-white flex flex-col gap-2">
          <button
            onClick={() => {
              soundEngine.playCardFlip();
              onNext();
            }}
            className="w-full bg-[#d9567a] hover:bg-[#c0385e] border-2 border-[#b83a60] rounded-full py-3 px-6 font-dohyeon text-sm text-white tracking-wider cursor-pointer shadow-[0_3px_0_#9a2e50,0_4px_8px_rgba(180,50,90,0.2)] hover:shadow-[0_0_18px_rgba(210,80,120,0.45),0_3px_0_#9a2e50] active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <span>
              {isKo
                ? '케이크 보러 가기'
                : isEn
                ? 'Go to Birthday Cake'
                : 'မွေးနေ့ကိတ်သို့ သွားရန်'}
            </span>
            <Sparkles size={14} />
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              onBack();
            }}
            className="text-xs text-pink-400 hover:text-pink-600 underline font-serif pt-1"
          >
            {isKo ? '← 이름 다시 입력하기' : isEn ? '← Re-enter Name' : '← အမည် ပြန်လည်ပြင်ဆင်ရန်'}
          </button>
        </div>
      </div>
    </div>
  );
};

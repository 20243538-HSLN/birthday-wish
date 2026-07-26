import React, { useState } from 'react';
import { Sparkles, Heart, Volume2, Calendar } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { CakeFlavor, Language } from '../types';

interface Step1WelcomeProps {
  recipientName: string;
  birthdate: string;
  age: number;
  cakeFlavor: CakeFlavor;
  lang: Language;
  onChangeName: (name: string) => void;
  onChangeBirthdate: (date: string) => void;
  onChangeAge: (age: number) => void;
  onChangeFlavor: (flavor: CakeFlavor) => void;
  onNext: () => void;
}

const FLAVORS_KO: { id: CakeFlavor; label: string; icon: string; color: string }[] = [
  { id: 'pink', label: '딸기 🍓', icon: '🍓', color: 'bg-pink-100 text-pink-700 border-pink-300' },
  { id: 'chocolate', label: '초코 🍫', icon: '🍫', color: 'bg-[#ede0d8] text-[#4a2810] border-[#9e6340]' },
  { id: 'matcha', label: '말차 🍵', icon: '🍵', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'cheese', label: '치즈 🧀', icon: '🧀', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
];

const FLAVORS_EN: { id: CakeFlavor; label: string; icon: string; color: string }[] = [
  { id: 'pink', label: 'Strawberry 🍓', icon: '🍓', color: 'bg-pink-100 text-pink-700 border-pink-300' },
  { id: 'chocolate', label: 'Chocolate 🍫', icon: '🍫', color: 'bg-[#ede0d8] text-[#4a2810] border-[#9e6340]' },
  { id: 'matcha', label: 'Matcha 🍵', icon: '🍵', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'cheese', label: 'Cheese 🧀', icon: '🧀', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
];

const FLAVORS_MY: { id: CakeFlavor; label: string; icon: string; color: string }[] = [
  { id: 'pink', label: 'စတော်ဘယ်ရီ 🍓', icon: '🍓', color: 'bg-pink-100 text-pink-700 border-pink-300' },
  { id: 'chocolate', label: 'ချောကလက် 🍫', icon: '🍫', color: 'bg-[#ede0d8] text-[#4a2810] border-[#9e6340]' },
  { id: 'matcha', label: 'မက်ချာ 🍵', icon: '🍵', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'cheese', label: 'ချိစ် 🧀', icon: '🧀', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
];

export const Step1Welcome: React.FC<Step1WelcomeProps> = ({
  recipientName,
  birthdate,
  age,
  cakeFlavor,
  lang,
  onChangeName,
  onChangeBirthdate,
  onChangeAge,
  onChangeFlavor,
  onNext,
}) => {
  const [errorMsg, setErrorMsg] = useState('');

  const isKo = lang === 'ko';
  const isEn = lang === 'en';
  const flavors = isKo ? FLAVORS_KO : isEn ? FLAVORS_EN : FLAVORS_MY;

  const [yStr, mStr, dStr] = (birthdate || '2006-08-02').split('-');
  const selectedYear = parseInt(yStr, 10) || 2006;
  const selectedMonth = parseInt(mStr, 10) || 8;
  const selectedDay = parseInt(dStr, 10) || 2;

  const yearsList = Array.from({ length: 87 }, (_, i) => 2026 - i);
  const monthsList = Array.from({ length: 12 }, (_, i) => i + 1);
  const maxDaysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const daysList = Array.from({ length: maxDaysInMonth }, (_, i) => i + 1);

  const handleDateChange = (val: string) => {
    onChangeBirthdate(val);
    if (!val) return;
    const parts = val.split('-');
    if (parts.length === 3) {
      const birthYear = parseInt(parts[0], 10);
      if (!isNaN(birthYear) && birthYear > 1900) {
        // Turning age in celebration year (e.g., 2026 - 2006 = 20)
        const calc = new Date().getFullYear() - birthYear;
        if (calc > 0) {
          onChangeAge(calc);
        }
      }
    }
  };

  const updateDateParts = (newY: number, newM: number, newD: number) => {
    const safeD = Math.min(newD, new Date(newY, newM, 0).getDate());
    const formattedY = String(newY).padStart(4, '0');
    const formattedM = String(newM).padStart(2, '0');
    const formattedD = String(safeD).padStart(2, '0');
    handleDateChange(`${formattedY}-${formattedM}-${formattedD}`);
  };

  const handleNext = () => {
    if (!recipientName.trim()) {
      soundEngine.playPop();
      setErrorMsg(
        isKo
          ? '이름을 꼭 작성해주세요 ♡'
          : isEn
          ? 'Please enter a name ♡'
          : 'ကျေးဇူးပြု၍ အမည် ရေးပေးပါ ♡'
      );
      setTimeout(() => setErrorMsg(''), 2000);
      return;
    }
    soundEngine.playSparkle();
    onNext();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative z-10">
      <div className="relative bg-white/85 border-2 border-[#f7c5d5] rounded-3xl p-7 max-w-sm w-full text-center shadow-[4px_4px_0px_#f7c5d5] backdrop-blur-xs transition-all">
        {/* Pixel corner accents */}
        <div className="absolute top-[-2px] left-[-2px] w-3 h-3 bg-[#f9a8c9] rounded-tl-sm" />
        <div className="absolute bottom-[-2px] right-[-2px] w-3 h-3 bg-[#f9a8c9] rounded-br-sm" />

        {/* Ribbon dots */}
        <div className="flex gap-1.5 justify-center mb-4">
          <div className="w-2 h-2 rounded-full bg-[#f9c5d8] animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-[#f5a8c4] animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-2 h-2 rounded-full bg-[#f9c5d8] animate-bounce" style={{ animationDelay: '0.3s' }} />
          <div className="w-2 h-2 rounded-full bg-[#f5a8c4] animate-bounce" style={{ animationDelay: '0.45s' }} />
          <div className="w-2 h-2 rounded-full bg-[#f9c5d8] animate-bounce" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Pixel stars */}
        <div className="flex justify-center items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#f9a8c9] animate-pulse" />
          <Sparkles className="w-5 h-5 text-[#f5c5d8] animate-spin-slow" />
          <Sparkles className="w-4 h-4 text-[#f9a8c9] animate-pulse" />
        </div>

        {/* Main Title */}
        <h1 className="font-dohyeon text-2xl text-[#c96a8a] tracking-wider leading-snug mb-1">
          {isKo ? (
            <>행복한 생일을 위한<br />작은 공간 ✿</>
          ) : isEn ? (
            <>A Little Space for a<br />Happy Birthday ✿</>
          ) : (
            <>ပျော်ရွှင်ဖွယ် မွေးနေ့လေးအတွက်<br />လှပသော နေရာလေး ✿</>
          )}
        </h1>
        <p className="font-serif text-sm text-[#d49ab0] tracking-wide mb-3 leading-relaxed">
          {isKo ? (
            <>오늘 하루가 꽃처럼<br />예쁘기를 바라며 ...</>
          ) : isEn ? (
            <>Wishing your day is as<br />beautiful as flowers ...</>
          ) : (
            <>ဒီနေ့ရက်လေးဟာ ပန်းလေးတွေလို<br />လှပပါစေလို့ ဆုတောင်းလျက် ...</>
          )}
        </p>

        {/* Audio notice badge */}
        <div className="inline-flex items-center gap-1.5 bg-pink-50 border border-pink-200/80 px-3 py-1 rounded-full mb-4 text-[11px] font-serif text-pink-700">
          <Volume2 size={12} className="text-pink-500 animate-pulse" />
          <span>
            {isKo
              ? '좌측 상단의 오디오 & BGM을 켜주세요 🎵'
              : isEn
              ? 'Turn on Audio & BGM at top left 🎵'
              : 'ဘယ်ဘက်အပေါ်ရှိ BGM ကို ဖွင့်ပါ 🎵'}
          </span>
        </div>

        {/* Input section */}
        <div className="space-y-3 mb-5 text-left">
          <div>
            <label className="block text-xs font-serif text-[#c07090] mb-1 font-bold pl-2 flex items-center gap-1">
              <Heart size={12} className="fill-pink-300 text-pink-400" />{' '}
              {isKo ? '받는 사람 (주인공)' : isEn ? 'Birthday Person' : 'မွေးနေ့ရှင် အမည်'}
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder={
                errorMsg ||
                (isKo
                  ? '이름을 작성해주세요! (예: 장원영)'
                  : isEn
                  ? 'Enter name (e.g., Vicky)'
                  : 'အမည် ရေးပါ (ဥပမာ - ဟန်နီနွေဦး)')
              }
              className={`w-full bg-[#fff0f5] border ${
                errorMsg ? 'border-red-400 animate-shake' : 'border-[#f5b8cc]'
              } rounded-full px-4 py-2 font-serif text-xs text-[#7a3a52] placeholder-[#d890ab] text-center outline-none focus:border-[#e87fa8] focus:ring-2 focus:ring-pink-200 transition-all`}
            />
          </div>

          {/* Birthday Calendar / Date & Milestone Selection */}
          <div>
            <label className="block text-xs font-serif text-[#c07090] mb-1.5 pl-2 font-bold flex items-center gap-1">
              <Calendar size={13} className="text-pink-500" />
              {isKo ? '생일 날짜' : isEn ? 'Birthday Date' : 'မွေးနေ့ ရက်စွဲ'}
            </label>

            {/* 3 Select Dropdowns: Year / Month / Day */}
            <div className="grid grid-cols-3 gap-1.5 mb-2">
              <div>
                <label className="block text-[10px] font-serif text-[#b8708c] text-center mb-0.5">
                  {isKo ? '년' : isEn ? 'Year' : 'ခုနှစ်'}
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => updateDateParts(parseInt(e.target.value, 10), selectedMonth, selectedDay)}
                  className="w-full bg-[#fff0f5] border border-[#f5b8cc] rounded-full px-1.5 py-1.5 font-serif text-xs text-[#7a3a52] text-center outline-none focus:border-[#e87fa8] focus:ring-2 focus:ring-pink-200 cursor-pointer"
                >
                  {yearsList.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}{isKo ? '년' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-serif text-[#b8708c] text-center mb-0.5">
                  {isKo ? '월' : isEn ? 'Month' : 'လ'}
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => updateDateParts(selectedYear, parseInt(e.target.value, 10), selectedDay)}
                  className="w-full bg-[#fff0f5] border border-[#f5b8cc] rounded-full px-1.5 py-1.5 font-serif text-xs text-[#7a3a52] text-center outline-none focus:border-[#e87fa8] focus:ring-2 focus:ring-pink-200 cursor-pointer"
                >
                  {monthsList.map((mo) => (
                    <option key={mo} value={mo}>
                      {String(mo).padStart(2, '0')}{isKo ? '월' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-serif text-[#b8708c] text-center mb-0.5">
                  {isKo ? '일' : isEn ? 'Day' : 'ရက်'}
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => updateDateParts(selectedYear, selectedMonth, parseInt(e.target.value, 10))}
                  className="w-full bg-[#fff0f5] border border-[#f5b8cc] rounded-full px-1.5 py-1.5 font-serif text-xs text-[#7a3a52] text-center outline-none focus:border-[#e87fa8] focus:ring-2 focus:ring-pink-200 cursor-pointer"
                >
                  {daysList.map((dy) => (
                    <option key={dy} value={dy}>
                      {String(dy).padStart(2, '0')}{isKo ? '일' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculated Milestone Banner */}
            <div className="text-[11px] font-serif text-pink-800 bg-pink-50 border border-pink-200/80 rounded-xl py-1.5 px-3 text-center inline-block w-full">
              ✨{' '}
              {age === 20
                ? isKo
                  ? '빛나는 스무 살의 특별한 추억 ✦'
                  : isEn
                  ? '20th Birthday Special Memory ✦'
                  : '၂၀ နှစ်မြောက် အထူးမွေးနေ့ ✦'
                : isKo
                ? `${age}번째 생일의 특별한 추억 ✦`
                : isEn
                ? `${age}${age === 21 ? 'st' : age === 22 ? 'nd' : age === 23 ? 'rd' : 'th'} Birthday Special Memory ✦`
                : `${age} နှစ်မြောက် အထူးမွေးနေ့ ✦`}
            </div>
          </div>

          <div>
            <label className="block text-xs font-serif text-[#c07090] mb-1 pl-2">
              {isKo
                ? '케이크 맛 선택 🎂'
                : isEn
                ? 'Select Cake Flavor 🎂'
                : 'ကိတ်မုန့် အရသာ ရွေးရန် 🎂'}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {flavors.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playPop();
                    onChangeFlavor(f.id);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-serif flex items-center justify-center gap-1 transition-all ${
                    cakeFlavor === f.id
                      ? `${f.color} font-bold ring-2 ring-pink-300 scale-102 shadow-xs`
                      : 'bg-white/60 border-pink-200 text-pink-700 hover:bg-pink-50'
                  }`}
                >
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full bg-[#d9567a] hover:bg-[#c0385e] border-2 border-[#b83a60] rounded-full py-3 px-6 font-dohyeon text-base text-white tracking-wider cursor-pointer shadow-[0_3px_0_#9a2e50,0_4px_8px_rgba(180,50,90,0.2)] hover:shadow-[0_0_18px_rgba(210,80,120,0.45),0_3px_0_#9a2e50] active:translate-y-0.5 transition-all"
        >
          {isKo ? '열어보기 →' : isEn ? 'Open Card →' : 'ကတ်ဖွင့်ကြည့်ရန် →'}
        </button>

        {/* Decorative Wave SVG */}
        <div className="mt-5">
          <svg width="180" height="30" viewBox="0 0 180 30" className="mx-auto">
            <path
              d="M10 15 Q45 2 90 15 Q135 28 170 15"
              fill="none"
              stroke="#f5b8cc"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <circle cx="10" cy="15" r="3" fill="#f9a8c9" />
            <circle cx="90" cy="15" r="3" fill="#f9c5d8" />
            <circle cx="170" cy="15" r="3" fill="#f9a8c9" />
          </svg>
        </div>
      </div>
    </div>
  );
};

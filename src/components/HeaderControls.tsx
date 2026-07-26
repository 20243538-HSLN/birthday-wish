import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Sparkles, Globe, FileSpreadsheet, X, Check, HelpCircle } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { Language } from '../types';
import { getStoredWebhookUrl, saveStoredWebhookUrl } from '../utils/googleSheets';

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
  const [showSheetModal, setShowSheetModal] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);

  useEffect(() => {
    setSheetUrl(getStoredWebhookUrl());
    if (window.location.search.includes('admin=true') || window.location.hash.includes('admin')) {
      setShowSheetModal(true);
    }
  }, []);

  const handleSparkleClick = () => {
    soundEngine.playSparkle();
    setSparkling(true);
    setTimeout(() => setSparkling(false), 600);

    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    if (newCount >= 5) {
      setShowSheetModal(true);
      setSecretClickCount(0);
    }
  };

  const handleSaveSheetUrl = () => {
    soundEngine.playPop();
    saveStoredWebhookUrl(sheetUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const isSheetConnected = Boolean(getStoredWebhookUrl());

  return (
    <>
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

      {/* Google Sheet Setup Modal */}
      {showSheetModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-emerald-300 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-gray-800 font-sans space-y-4">
            <button
              onClick={() => setShowSheetModal(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 text-emerald-700">
              <FileSpreadsheet size={24} />
              <h2 className="text-lg font-bold">Google Sheet Wish Sync</h2>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Connect a Google Sheet to automatically collect every birthday wish submitted by users!
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Google Apps Script Web App URL:
              </label>
              <input
                type="text"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono bg-gray-50"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleSaveSheetUrl}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                {saveSuccess ? <Check size={14} /> : null}
                <span>{saveSuccess ? 'Saved!' : 'Save Webhook URL'}</span>
              </button>

              {isSheetConnected && (
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <Check size={12} /> Sync Active
                </span>
              )}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-800 space-y-2">
              <div className="font-semibold flex items-center gap-1 text-emerald-900">
                <HelpCircle size={13} /> Apps Script Code (6 Columns)
              </div>
              <p className="text-[10px] text-emerald-700">
                In Google Sheet &gt; <b>Extensions &gt; Apps Script</b>, replace all code with this:
              </p>
              <pre className="bg-emerald-950 text-emerald-100 p-2 rounded-lg text-[10px] font-mono overflow-x-auto select-all leading-tight">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.submittedAt,
    data.recipientName,
    data.birthdate,
    data.age,
    data.cakeFlavor,
    data.wishText
  ]);
  return ContentService.createTextOutput("Success");
}`}
              </pre>
              <ol className="list-decimal list-inside space-y-0.5 text-emerald-700 pl-1 text-[10px]">
                <li>Save script &amp; click <b>Deploy &gt; New deployment &gt; Web App</b>.</li>
                <li>Set <b>Who has access</b> to <b>Anyone</b>.</li>
                <li>Click <b>Deploy</b>, copy the Web App URL and paste above!</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HeaderControls } from './components/HeaderControls';
import { PetalBackground } from './components/PetalBackground';
import { Step1Welcome } from './components/Step1Welcome';
import { Step2Postcard } from './components/Step2Postcard';
import { Step3Cake } from './components/Step3Cake';
import { Step4Sending } from './components/Step4Sending';
import { Step5DreamSky } from './components/Step5DreamSky';
import { Step, CakeFlavor, Language } from './types';
import { soundEngine } from './utils/soundEngine';
import { sendWishToGoogleSheet } from './utils/googleSheets';

export default function App() {
  const [step, setStep] = useState<Step>('welcome');
  const [recipientName, setRecipientName] = useState('');
  const [birthdate, setBirthdate] = useState<string>('2006-08-02');
  const [age, setAge] = useState<number>(20);
  const [customMessage, setCustomMessage] = useState('');
  const [wishText, setWishText] = useState('');
  const [cakeFlavor, setCakeFlavor] = useState<CakeFlavor>('strawberry');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState(false);
  const [lang, setLang] = useState<Language>('ko');

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.setMuted(!next);
  };

  const handleToggleBgm = () => {
    const isNowPlaying = soundEngine.toggleBgm();
    setBgmEnabled(isNowPlaying);
  };

  const handleToggleLanguage = () => {
    soundEngine.playPop();
    setLang((prev) => (prev === 'ko' ? 'en' : prev === 'en' ? 'my' : 'ko'));
  };

  const handleRestart = () => {
    setStep('welcome');
    setWishText('');
  };

  return (
    <div className="min-h-screen bg-[#fff5f8] text-[#7a3a52] font-serif relative overflow-x-hidden selection:bg-pink-200 selection:text-pink-900">
      {/* Background Dot Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-35"
        style={{
          backgroundImage: 'radial-gradient(circle, #f0c0d0 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      {/* Falling Petals Background */}
      <PetalBackground />

      {/* Floating Controls (Top Left) */}
      <HeaderControls
        soundEnabled={soundEnabled}
        bgmEnabled={bgmEnabled}
        lang={lang}
        onToggleSound={handleToggleSound}
        onToggleBgm={handleToggleBgm}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Container with Motion Page Transitions */}
      <main className="relative z-10 min-h-screen flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <Step1Welcome
                recipientName={recipientName}
                birthdate={birthdate}
                age={age}
                cakeFlavor={cakeFlavor}
                lang={lang}
                onChangeName={setRecipientName}
                onChangeBirthdate={setBirthdate}
                onChangeAge={setAge}
                onChangeFlavor={setCakeFlavor}
                onNext={() => setStep('postcard')}
              />
            </motion.div>
          )}

          {step === 'postcard' && (
            <motion.div
              key="postcard"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <Step2Postcard
                recipientName={recipientName}
                age={age}
                customMessage={customMessage}
                lang={lang}
                onChangeMessage={setCustomMessage}
                onNext={() => setStep('cake')}
                onBack={() => setStep('welcome')}
              />
            </motion.div>
          )}

          {step === 'cake' && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <Step3Cake
                wishText={wishText}
                age={age}
                cakeFlavor={cakeFlavor}
                lang={lang}
                onChangeWish={setWishText}
                onBlowOutSuccess={() => {
                  sendWishToGoogleSheet({
                    recipientName,
                    birthdate,
                    age,
                    cakeFlavor,
                    customMessage,
                    wishText,
                  });
                  setStep('sending');
                }}
              />
            </motion.div>
          )}

          {step === 'sending' && (
            <motion.div
              key="sending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Step4Sending
                wishText={wishText}
                lang={lang}
                onComplete={() => setStep('fulfilled')}
              />
            </motion.div>
          )}

          {step === 'fulfilled' && (
            <motion.div
              key="fulfilled"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Step5DreamSky
                recipientName={recipientName}
                age={age}
                customMessage={customMessage}
                wishText={wishText}
                lang={lang}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/**
 * SoundEngine using Web Audio API for cute, playful, dreamy, pixel & magical sound effects + music box BGM.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimeoutId: number | null = null;
  private isMuted = false;
  private bgmVol = 0.3;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.sfxGain) {
      this.sfxGain.gain.value = muted ? 0 : 0.8;
    }
    if (this.bgmGain) {
      this.bgmGain.gain.value = muted ? 0 : this.bgmVol;
    }
  }

  public setBgmVolume(vol: number) {
    this.bgmVol = vol;
    if (this.bgmGain && !this.isMuted) {
      this.bgmGain.gain.value = vol;
    }
  }

  /* --- CUTE SOUND EFFECTS --- */

  /** Cute soft bubble pop for button clicks */
  public playPop() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;

      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  /** Dreamy pixel sparkle magic sound */
  public playSparkle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Arpeggio notes in high C major scale with triangle wave (pixel music box vibe)
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51, 1567.98];

      freqs.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = i % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        const startTime = now + i * 0.05;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  /** Candle blow whoosh and gentle extinguish sound */
  public playBlow() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Noise for wind whoosh
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);

      // 2. Extinguish magic bell
      const bellFreqs = [1046.5, 880, 659.25, 523.25];
      bellFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.15 + idx * 0.08);

        const st = now + 0.15 + idx * 0.08;
        gain.gain.setValueAtTime(0.18, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(st);
        osc.stop(st + 0.35);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  /** Envelope or postcard slide flip chime */
  public playCardFlip() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [587.33, 783.99, 1174.66].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        const st = now + i * 0.06;
        gain.gain.setValueAtTime(0.15, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(st);
        osc.stop(st + 0.3);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  /** Wish sky launch magical glissando */
  public playMagicWish() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        const st = now + i * 0.07;
        gain.gain.setValueAtTime(0.2, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(st);
        osc.stop(st + 0.4);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  /** Joyful birthday celebration fanfare (C-E-G-C chord) */
  public playCelebration() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chords = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.1 },
        { f: 783.99, t: 0.2 },
        { f: 1046.5, t: 0.3 },
        { f: 1318.51, t: 0.45 },
        { f: 1567.98, t: 0.6 }
      ];

      chords.forEach(({ f, t }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        const st = now + t;
        gain.gain.setValueAtTime(0.22, st);
        gain.gain.exponentialRampToValueAtTime(0.001, st + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(st);
        osc.stop(st + 0.8);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  /* --- CUTE DREAMY MUSIC BOX BGM --- */

  public startBgm() {
    this.initCtx();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.scheduleBgmLoop();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimeoutId !== null) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  private scheduleBgmLoop() {
    if (!this.isBgmPlaying || !this.ctx) return;

    // "Happy Birthday" / Cute Pixel Lullaby notes (frequency in Hz, duration in seconds)
    // Notes: C4, C4, D4, C4, F4, E4 ... C4, C4, D4, C4, G4, F4 ...
    const tempo = 0.28; // time per beat
    const melody: { note: number; beats: number }[] = [
      { note: 261.63, beats: 0.75 }, { note: 261.63, beats: 0.25 },
      { note: 293.66, beats: 1.0 },  { note: 261.63, beats: 1.0 },
      { note: 349.23, beats: 1.0 },  { note: 329.63, beats: 2.0 },

      { note: 261.63, beats: 0.75 }, { note: 261.63, beats: 0.25 },
      { note: 293.66, beats: 1.0 },  { note: 261.63, beats: 1.0 },
      { note: 392.00, beats: 1.0 },  { note: 349.23, beats: 2.0 },

      { note: 261.63, beats: 0.75 }, { note: 261.63, beats: 0.25 },
      { note: 523.25, beats: 1.0 },  { note: 440.00, beats: 1.0 },
      { note: 349.23, beats: 1.0 },  { note: 329.63, beats: 1.0 },
      { note: 293.66, beats: 2.0 },

      { note: 466.16, beats: 0.75 }, { note: 466.16, beats: 0.25 },
      { note: 440.00, beats: 1.0 },  { note: 349.23, beats: 1.0 },
      { note: 392.00, beats: 1.0 },  { note: 349.23, beats: 2.5 }
    ];

    let currentTime = this.ctx.currentTime + 0.1;

    if (!this.bgmGain) {
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.isMuted ? 0 : this.bgmVol;
      this.bgmGain.connect(this.ctx.destination);
    }

    melody.forEach(({ note, beats }) => {
      if (!this.ctx || !this.bgmGain) return;
      const duration = beats * tempo;

      // Primary music box tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle'; // Sweet music box sound
      osc.frequency.setValueAtTime(note, currentTime);

      // Attack & decay like a real chime / music box tine
      gain.gain.setValueAtTime(0, currentTime);
      gain.gain.linearRampToValueAtTime(0.25, currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, currentTime + Math.max(0.1, duration * 0.9));

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(currentTime);
      osc.stop(currentTime + duration);

      // Subtle octave shimmer for dreaminess
      if (Math.random() > 0.4) {
        const shimOsc = this.ctx.createOscillator();
        const shimGain = this.ctx.createGain();

        shimOsc.type = 'sine';
        shimOsc.frequency.setValueAtTime(note * 2, currentTime);

        shimGain.gain.setValueAtTime(0, currentTime);
        shimGain.gain.linearRampToValueAtTime(0.08, currentTime + 0.01);
        shimGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.3);

        shimOsc.connect(shimGain);
        shimGain.connect(this.bgmGain);

        shimOsc.start(currentTime);
        shimOsc.stop(currentTime + 0.3);
      }

      currentTime += duration;
    });

    const totalDurationMs = (currentTime - this.ctx.currentTime) * 1000 + 1000;
    this.bgmTimeoutId = window.setTimeout(() => {
      if (this.isBgmPlaying) {
        this.scheduleBgmLoop();
      }
    }, totalDurationMs);
  }
}

export const soundEngine = new SoundEngine();

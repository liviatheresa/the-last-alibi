// Web Audio API Procedural Sound Engine
// Zero external sound asset dependencies - works instantly and reliably!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientRainGain: GainNode | null = null;
  private ambientNoiseSource: AudioBufferSourceNode | null = null;
  private isAmbiancePlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientRainGain && this.ctx) {
      this.ambientRainGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Atmospheric rain & thunder generator
  public toggleRainAmbiance(enable?: boolean): boolean {
    this.initContext();
    if (!this.ctx) return false;

    const shouldPlay = enable !== undefined ? enable : !this.isAmbiancePlaying;

    if (shouldPlay && !this.isAmbiancePlaying) {
      try {
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.035, this.ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        whiteNoise.start();
        this.ambientNoiseSource = whiteNoise;
        this.ambientRainGain = gainNode;
        this.isAmbiancePlaying = true;
      } catch (e) {
        console.warn('Could not start ambiance:', e);
      }
    } else if (!shouldPlay && this.isAmbiancePlaying) {
      if (this.ambientNoiseSource) {
        try {
          this.ambientNoiseSource.stop();
          this.ambientNoiseSource.disconnect();
        } catch (_) {}
      }
      this.ambientNoiseSource = null;
      this.isAmbiancePlaying = false;
    }

    return this.isAmbiancePlaying;
  }

  public isRainActive(): boolean {
    return this.isAmbiancePlaying;
  }

  // Typewriter key clack
  public playTypewriter() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(320 + Math.random() * 80, this.ctx.currentTime);

    filter.type = 'bandpass';
    filter.frequency.value = 850;

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Forensic tape recorder button click
  public playTapeClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Tension heartbeat (when suspect stress increases)
  public playHeartbeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  // Dramatic breakthrough / clue uncovered chime
  public playDramaticChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [220, 277.18, 329.63, 440];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, this.ctx!.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.08);
      osc.stop(this.ctx!.currentTime + idx * 0.08 + 1.3);
    });
  }

  // Verdict strike / court gavel
  public playGavel() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  // --- PSYCHOLOGICAL HORROR AUDIO ENGINE ---
  private horrorAudio1: HTMLAudioElement | null = null;
  private horrorAudio2: HTMLAudioElement | null = null;
  private activeHorrorTrack: 'drone' | 'suspense' | 'dual' | 'off' = 'off';
  private horrorVolume: number = 0.45;

  public initHorrorAudio() {
    if (typeof window === 'undefined') return;

    if (!this.horrorAudio1) {
      this.horrorAudio1 = new Audio('/assets/aistudio/jorisvermeer-ominous-horror-game-background-418850_faf31947.mp3');
      this.horrorAudio1.loop = true;
      this.horrorAudio1.volume = this.isMuted ? 0 : this.horrorVolume * 0.7;
    }

    if (!this.horrorAudio2) {
      this.horrorAudio2 = new Audio('/assets/aistudio/alex-morgan-horror-suspense-tune-579472_460ab381.mp3');
      this.horrorAudio2.loop = true;
      this.horrorAudio2.volume = this.isMuted ? 0 : this.horrorVolume * 0.8;
    }
  }

  public setHorrorTrack(mode: 'drone' | 'suspense' | 'dual' | 'off'): 'drone' | 'suspense' | 'dual' | 'off' {
    this.initHorrorAudio();
    this.activeHorrorTrack = mode;

    if (!this.horrorAudio1 || !this.horrorAudio2) return 'off';

    if (mode === 'off' || this.isMuted) {
      this.horrorAudio1.pause();
      this.horrorAudio2.pause();
      return mode;
    }

    if (mode === 'drone') {
      this.horrorAudio1.volume = this.horrorVolume * 0.85;
      this.horrorAudio1.play().catch(() => {});
      this.horrorAudio2.pause();
    } else if (mode === 'suspense') {
      this.horrorAudio1.pause();
      this.horrorAudio2.volume = this.horrorVolume * 0.85;
      this.horrorAudio2.play().catch(() => {});
    } else if (mode === 'dual') {
      // Psychological layered horror: low ominous drone + chilling melody
      this.horrorAudio1.volume = this.horrorVolume * 0.6;
      this.horrorAudio2.volume = this.horrorVolume * 0.65;
      this.horrorAudio1.play().catch(() => {});
      this.horrorAudio2.play().catch(() => {});
    }

    return this.activeHorrorTrack;
  }

  public getActiveHorrorTrack(): 'drone' | 'suspense' | 'dual' | 'off' {
    return this.activeHorrorTrack;
  }

  public setHorrorVolume(vol: number) {
    this.horrorVolume = Math.max(0, Math.min(1, vol));
    if (this.horrorAudio1) this.horrorAudio1.volume = this.isMuted ? 0 : this.horrorVolume * 0.7;
    if (this.horrorAudio2) this.horrorAudio2.volume = this.isMuted ? 0 : this.horrorVolume * 0.8;
  }

  public getHorrorVolume(): number {
    return this.horrorVolume;
  }

  // Chilling chronometer tick sound
  public playClockTick(isPanic: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = isPanic ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(isPanic ? 880 : 540, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

    filter.type = 'highpass';
    filter.frequency.value = isPanic ? 400 : 250;

    gain.gain.setValueAtTime(isPanic ? 0.12 : 0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Violent static glitch burst for killer letter intrusion
  public playGlitchStatic() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const duration = 1.1;
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate harsh static with periodic distortion drops
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        const squareMod = Math.sin(i / 15) > 0 ? 1 : -1;
        data[i] = (white * 0.7 + squareMod * 0.3) * (1 - i / bufferSize);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();

      // Accompany with low sub-bass slam
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(95, this.ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.9);

      subGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.9);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);

      sub.start();
      sub.stop(this.ctx.currentTime + 0.95);
    } catch (e) {
      console.warn('Glitch sound error:', e);
    }
  }

  // Chilling horror screech / jump sting
  public playHorrorSting() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Dissonant tritone interval (C and F#)
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc1.frequency.linearRampToValueAtTime(659.25, this.ctx.currentTime + 0.6);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(739.99, this.ctx.currentTime); // F#5 (tritone)
    osc2.frequency.linearRampToValueAtTime(415.30, this.ctx.currentTime + 0.6);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.ctx.currentTime + 0.85);
    osc2.stop(this.ctx.currentTime + 0.85);
  }
}

export const sound = new SoundEngine();

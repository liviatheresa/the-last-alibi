// Web Speech API Text-to-Speech Engine
// Unified, robust audio narration system for cases, dispatch wires, evidence, suspects, and confessions.

export type VoicePersona =
  | 'narrator'
  | 'dispatch'
  | 'killer'
  | 'coroner'
  | 'confession'
  | 'male_suspect'
  | 'female_suspect'
  | 'detective';

export interface SpeechOptions {
  id?: string;
  voiceType?: VoicePersona;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: unknown) => void;
}

type SpeechListener = (currentId: string | null, isSpeaking: boolean) => void;

class SpeechEngine {
  private currentId: string | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<SpeechListener> = new Set();
  private chromeKeepAliveTimer: ReturnType<typeof setInterval> | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  private loadVoices() {
    if (!this.isSupported()) return;
    try {
      this.voices = window.speechSynthesis.getVoices();
    } catch (_) {}
  }

  private notify() {
    const isSpeaking = this.currentId !== null;
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentId, isSpeaking);
      } catch (e) {
        console.warn('Speech listener error:', e);
      }
    });
  }

  public subscribe(listener: SpeechListener): () => void {
    this.listeners.add(listener);
    // Initial call
    listener(this.currentId, this.currentId !== null);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getCurrentId(): string | null {
    return this.currentId;
  }

  public isSpeaking(id?: string): boolean {
    if (!this.isSupported()) return false;
    if (id !== undefined) {
      return this.currentId === id;
    }
    return this.currentId !== null;
  }

  public cleanText(raw: string): string {
    if (!raw) return '';
    return raw
      // Remove timestamps like [23:48:12] or [03:15:22]
      .replace(/\[\d{2}:\d{2}(?::\d{2})?\]/g, '')
      // Remove bracketed stage directions like [adjusts spectacles nervously]
      .replace(/\[.*?\]/g, '')
      // Remove markdown bold/italic asterisks & underscores
      .replace(/[*_~`#]/g, '')
      // Remove quotes
      .replace(/[""«»]/g, '')
      // Remove URL-like strings
      .replace(/https?:\/\/\S+/g, '')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  private selectVoice(persona?: VoicePersona): { voice: SpeechSynthesisVoice | null; pitch: number; rate: number } {
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    const englishVoices = this.voices.filter((v) => v.lang.startsWith('en'));
    const pool = englishVoices.length > 0 ? englishVoices : this.voices;

    let selectedVoice: SpeechSynthesisVoice | null = null;
    let pitch = 1.0;
    let rate = 1.0;

    switch (persona) {
      case 'killer':
        // Menacing, slow, low pitch
        pitch = 0.72;
        rate = 0.85;
        selectedVoice =
          pool.find((v) => /david|george|male|daniel|guy/i.test(v.name)) || pool[0] || null;
        break;

      case 'dispatch':
        // Fast emergency cadence, slightly clipped
        pitch = 1.08;
        rate = 1.15;
        selectedVoice =
          pool.find((v) => /mark|alex|male|natural/i.test(v.name)) || pool[0] || null;
        break;

      case 'coroner':
        // Precise, analytical, clinical
        pitch = 0.95;
        rate = 0.98;
        selectedVoice =
          pool.find((v) => /uk|british|natural|serena|oliver/i.test(v.name)) || pool[0] || null;
        break;

      case 'confession':
        // Strained, emotional
        pitch = 0.9;
        rate = 0.92;
        selectedVoice = pool[0] || null;
        break;

      case 'female_suspect':
        pitch = 1.18;
        rate = 0.95;
        selectedVoice =
          pool.find((v) => /female|zira|samantha|karen|victoria|catherine/i.test(v.name)) || pool[0] || null;
        break;

      case 'male_suspect':
        pitch = 0.84;
        rate = 0.92;
        selectedVoice =
          pool.find((v) => /male|david|daniel|george/i.test(v.name)) || pool[0] || null;
        break;

      case 'detective':
      case 'narrator':
      default:
        // Dignified, noir, archival
        pitch = 0.92;
        rate = 0.96;
        selectedVoice =
          pool.find((v) => /natural|uk|george|david|alex/i.test(v.name)) || pool[0] || null;
        break;
    }

    return { voice: selectedVoice, pitch, rate };
  }

  public speak(text: string, options?: SpeechOptions): void {
    if (!this.isSupported()) return;

    // Stop any existing playback
    this.stop();

    const cleaned = this.cleanText(text);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    this.currentUtterance = utterance;
    const assignedId = options?.id || `speech_${Date.now()}`;
    this.currentId = assignedId;

    const { voice, pitch, rate } = this.selectVoice(options?.voiceType);
    if (voice) utterance.voice = voice;
    utterance.pitch = options?.pitch ?? pitch;
    utterance.rate = options?.rate ?? rate;
    utterance.volume = options?.volume ?? 1.0;

    utterance.onstart = () => {
      this.notify();
      options?.onStart?.();

      // Chromium 15-second speech silence workaround:
      // In Chrome/Edge, SpeechSynthesis pauses unexpectedly on long passages.
      if (this.chromeKeepAliveTimer) clearInterval(this.chromeKeepAliveTimer);
      this.chromeKeepAliveTimer = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    };

    const cleanup = () => {
      if (this.chromeKeepAliveTimer) {
        clearInterval(this.chromeKeepAliveTimer);
        this.chromeKeepAliveTimer = null;
      }
      if (this.currentId === assignedId) {
        this.currentId = null;
        this.currentUtterance = null;
        this.notify();
      }
    };

    utterance.onend = () => {
      cleanup();
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      cleanup();
      options?.onError?.(e);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis speak error:', err);
      cleanup();
    }
  }

  public stop(): void {
    if (!this.isSupported()) return;
    if (this.chromeKeepAliveTimer) {
      clearInterval(this.chromeKeepAliveTimer);
      this.chromeKeepAliveTimer = null;
    }
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
    this.currentId = null;
    this.currentUtterance = null;
    this.notify();
  }

  public toggle(id: string, text: string, options?: Omit<SpeechOptions, 'id'>): boolean {
    if (this.currentId === id) {
      this.stop();
      return false;
    }
    this.speak(text, { ...options, id });
    return true;
  }
}

export const speech = new SpeechEngine();

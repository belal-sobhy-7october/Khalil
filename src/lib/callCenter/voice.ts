/**
 * Speaking and listening helpers for Call Center Prep: the device's voices
 * read calls with two speakers (works offline with the voices installed on the
 * device), and a live transcript while you record (Chrome, needs internet).
 */
import type { Speaker } from '../../data/callCenter/types';

// ── Text to speech ─────────────────────────────────────────────────────

function englishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const all = window.speechSynthesis.getVoices();
  const us = all.filter((v) => v.lang === 'en-US' || v.lang === 'en_US');
  return us.length ? us : all.filter((v) => v.lang.startsWith('en'));
}

/** Agents and candidates get one voice, customers and interviewers another. */
const SIDE: Record<Speaker, 0 | 1> = { agent: 0, you: 0, narrator: 0, customer: 1, recruiter: 1, colleague: 1 };

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export interface SpeakLine {
  text: string;
  who?: Speaker;
}

/**
 * Reads lines one after another, alternating voices by speaker. `onLine`
 * reports the line being read (-1 at the end). Returns a function that stops.
 */
export function speakLines(lines: SpeakLine[], { rate = 0.95, onLine }: { rate?: number; onLine?: (index: number) => void } = {}): () => void {
  if (!ttsSupported() || !lines.length) {
    onLine?.(-1);
    return () => {};
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const voices = englishVoices();
  let stopped = false;
  lines.forEach((line, i) => {
    const u = new SpeechSynthesisUtterance(line.text);
    const side = SIDE[line.who ?? 'agent'];
    const voice = voices[side % Math.max(1, voices.length)];
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? 'en-US';
    u.rate = rate;
    // With a single voice on the device, a different pitch tells the speakers apart.
    u.pitch = side === 1 && voices.length < 2 ? 1.25 : 1;
    u.onstart = () => !stopped && onLine?.(i);
    if (i === lines.length - 1) u.onend = () => !stopped && onLine?.(-1);
    synth.speak(u);
  });
  return () => {
    stopped = true;
    synth.cancel();
    onLine?.(-1);
  };
}

export const speakText = (text: string, rate?: number) => speakLines([{ text }], { rate });

/** About how long it takes to say a line yourself, in ms (for the shadowing gap). */
export const repeatGap = (text: string) => 1200 + text.split(/\s+/).length * 420;

/**
 * Shadowing: reads a line, waits while you say it back, then the next one.
 * `onLine` reports the line being read or repeated (-1 at the end).
 */
export function shadowLines(lines: SpeakLine[], { rate = 0.9, onLine }: { rate?: number; onLine?: (index: number) => void } = {}): () => void {
  if (!ttsSupported() || !lines.length) {
    onLine?.(-1);
    return () => {};
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const voices = englishVoices();
  let stopped = false;
  let timer: number | undefined;
  const say = (i: number) => {
    if (stopped) return;
    if (i >= lines.length) {
      onLine?.(-1);
      return;
    }
    const line = lines[i];
    const u = new SpeechSynthesisUtterance(line.text);
    const side = SIDE[line.who ?? 'agent'];
    const voice = voices[side % Math.max(1, voices.length)];
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? 'en-US';
    u.rate = rate;
    u.pitch = side === 1 && voices.length < 2 ? 1.25 : 1;
    u.onstart = () => !stopped && onLine?.(i);
    u.onend = () => {
      if (!stopped) timer = window.setTimeout(() => say(i + 1), repeatGap(line.text) / rate);
    };
    synth.speak(u);
  };
  say(0);
  return () => {
    stopped = true;
    window.clearTimeout(timer);
    synth.cancel();
    onLine?.(-1);
  };
}

// ── Live transcript ────────────────────────────────────────────────────

interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

function recognitionCtor(): (new () => Recognition) | undefined {
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export const liveTranscriptSupported = () => typeof window !== 'undefined' && !!recognitionCtor();

/**
 * Transcribes speech until `stop()` is called; `stop` resolves with the text.
 * Chrome restarts recognition after a silence, so it's restarted until stopped.
 */
export function startTranscript(onText?: (text: string) => void): { stop: () => Promise<string> } {
  const Ctor = recognitionCtor();
  if (!Ctor) return { stop: async () => '' };
  let finalText = '';
  let interim = '';
  let stopping = false;
  let resolveStop: ((text: string) => void) | null = null;
  const rec = new Ctor();
  rec.lang = 'en-US';
  rec.continuous = true;
  rec.interimResults = true;
  rec.onresult = (e) => {
    interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += `${r[0].transcript.trim()} `;
      else interim += r[0].transcript;
    }
    onText?.(`${finalText}${interim}`.trim());
  };
  rec.onerror = () => {
    // "no-speech" and network errors end this session; onend decides what's next.
  };
  rec.onend = () => {
    if (!stopping) {
      try {
        rec.start();
        return;
      } catch {
        // could not restart: finish with what we have
      }
    }
    resolveStop?.(`${finalText}${interim}`.trim());
  };
  try {
    rec.start();
  } catch {
    return { stop: async () => '' };
  }
  return {
    stop: () =>
      new Promise<string>((resolve) => {
        stopping = true;
        resolveStop = resolve;
        try {
          rec.stop();
        } catch {
          resolve(`${finalText}${interim}`.trim());
        }
        // Some browsers never fire onend after stop(): don't wait forever.
        setTimeout(() => resolve(`${finalText}${interim}`.trim()), 1500);
      }),
  };
}

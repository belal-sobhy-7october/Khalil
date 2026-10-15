import { normalizeAnswer } from './practice';

// Minimal typing for the (still prefixed in Chrome) Web Speech API.
interface RecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface Recognition {
  lang: string;
  maxAlternatives: number;
  interimResults: boolean;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
}
type RecognitionCtor = new () => Recognition;

function getCtor(): RecognitionCtor | undefined {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function speechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && !!getCtor();
}

export type RecognizeResult = { ok: true; transcripts: string[] } | { ok: false; error: string };

/** Listen once (up to ~6s) and return the recogniser's best guesses. */
export function recognizeOnce(lang = 'en-US', timeoutMs = 6000): Promise<RecognizeResult> {
  const Ctor = getCtor();
  if (!Ctor) return Promise.resolve({ ok: false, error: 'not-supported' });
  return new Promise((resolve) => {
    const rec = new Ctor();
    rec.lang = lang;
    rec.maxAlternatives = 5;
    rec.interimResults = false;
    let settled = false;
    const finish = (r: RecognizeResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(r);
    };
    const timer = setTimeout(() => {
      rec.abort();
      finish({ ok: false, error: 'no-speech' });
    }, timeoutMs);
    rec.onresult = (e) => {
      const alts = Array.from(e.results[0] ?? []).map((a) => a.transcript);
      finish({ ok: true, transcripts: alts });
    };
    rec.onerror = (e) => finish({ ok: false, error: e.error });
    rec.onend = () => finish({ ok: false, error: 'no-speech' });
    try {
      rec.start();
    } catch {
      finish({ ok: false, error: 'start-failed' });
    }
  });
}

/** Did any recognised alternative contain the target (or one of its "/" alternatives)? */
export function matchesSpoken(target: string, transcripts: string[]): boolean {
  const wants = target.split('/').map(normalizeAnswer).filter(Boolean);
  return transcripts.some((t) => {
    const heard = ` ${normalizeAnswer(t)} `;
    return wants.some((want) => heard.includes(` ${want} `));
  });
}

/**
 * Shared pronunciation utilities for the Khalil app.
 * 
 * Note: YouGlish free widget usage is subject to their terms:
 * https://youglish.com/terms
 */

export type BrowserAccent = 'us' | 'uk';
export type YouGlishAccent = 'us' | 'uk' | 'aus';
export type Accent = BrowserAccent;

export interface PronunciationPrefs {
  accent: BrowserAccent;
}

const STORAGE_KEY = 'khalil-pronunciation';

const DEFAULT_PREFS: PronunciationPrefs = {
  accent: 'us' as BrowserAccent,
};

/**
 * Get pronunciation preferences from localStorage.
 */
export function getPronunciationPrefs(): PronunciationPrefs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as PronunciationPrefs;
    }
  } catch (error) {
    console.error('Failed to read pronunciation prefs from localStorage:', error);
  }
  return DEFAULT_PREFS;
}

/**
 * Save pronunciation preferences to localStorage.
 */
export function setPronunciationPrefs(prefs: PronunciationPrefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('Failed to save pronunciation prefs to localStorage:', error);
  }
}

/**
 * Load available speech synthesis voices.
 */
function loadVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

/**
 * Speak text using browser speech synthesis.
 * @param text - The text to speak
 * @param accent - 'us' for en-US, 'uk' for en-GB
 */
export function speakBrowser(text: string, accent: BrowserAccent = 'us'): void {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported in this browser');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;

  const voices = loadVoices();
  const lang = accent === 'uk' ? 'en-GB' : 'en-US';
  utterance.lang = lang;

  // Try to get a voice matching the accent
  const accentVoice = voices.find((voice) => voice.lang.includes(lang));
  if (accentVoice) {
    utterance.voice = accentVoice;
  }

  window.speechSynthesis.speak(utterance);
}

/**
 * Build the fallback YouGlish URL for a word/phrase.
 * @param word - The word or phrase to look up
 * @param accent - 'us', 'uk', or 'aus'
 */
export function buildYouGlishUrl(word: string, accent: YouGlishAccent = 'us'): string {
  const encodedWord = encodeURIComponent(word);
  return `https://youglish.com/pronounce/${encodedWord}/english/${accent}`;
}

// Native-speaker recordings from the free dictionary API, cached per word so a
// second click plays instantly. null = looked up, no recording for that accent.
const audioUrlCache = new Map<string, string | null>();

async function lookupAudioUrl(word: string, accent: BrowserAccent): Promise<string | null> {
  const key = `${accent}:${word.toLowerCase()}`;
  if (audioUrlCache.has(key)) return audioUrlCache.get(key) ?? null;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`,
      { signal: controller.signal }
    );
    if (!res.ok) {
      audioUrlCache.set(key, null);
      return null;
    }
    const entries = (await res.json()) as Array<{ phonetics?: Array<{ audio?: string }> }>;
    const urls = entries.flatMap((e) => e.phonetics ?? []).map((p) => p.audio).filter((a): a is string => !!a);
    const url = urls.find((u) => u.includes(`-${accent}.mp3`)) ?? null;
    audioUrlCache.set(key, url);
    return url;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

/**
 * Pronounce a word: a real native-speaker recording when one exists for the
 * accent (single words only), otherwise the browser's speech synthesis.
 */
export async function speakWord(text: string, accent: BrowserAccent = 'us'): Promise<void> {
  const trimmed = text.trim();
  if (/^[a-zA-Z'-]+$/.test(trimmed)) {
    const url = await lookupAudioUrl(trimmed, accent);
    if (url) {
      try {
        await new Audio(url).play();
        return;
      } catch {
        // fall through to speech synthesis
      }
    }
  }
  speakBrowser(trimmed, accent);
}

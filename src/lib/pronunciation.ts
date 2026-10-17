/**
 * Shared pronunciation utilities for the Khalil app.
 * 
 * Note: YouGlish free widget usage is subject to their terms:
 * https://youglish.com/terms
 */

import { useSyncExternalStore } from 'react';
import { lookupWord } from './dictionary';
import { isOnline } from './offline';
import { playSavedVoice, savedVoiceUrl } from './savedVoices';

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

// ── The device's voice can't speak ────────────────────────────────────────
// Set when the device has no English voice, or its voice failed (offline,
// a voice that needs the internet stays silent). The Topic Library then
// explains how to download an English voice to the device.

let speechTrouble = false;
const troubleListeners = new Set<() => void>();

function reportSpeechTrouble() {
  if (speechTrouble) return;
  speechTrouble = true;
  troubleListeners.forEach((l) => l());
}

function subscribeTrouble(onChange: () => void) {
  troubleListeners.add(onChange);
  return () => troubleListeners.delete(onChange);
}

export function useSpeechTrouble(): boolean {
  return useSyncExternalStore(subscribeTrouble, () => speechTrouble, () => false);
}

const normLang = (lang: string) => lang.replace('_', '-').toLowerCase();

/**
 * The voice to read with. Offline, only a voice installed on the device
 * (localService) can speak: Chrome's "Google US English" needs the internet.
 */
export function pickVoice(voices: SpeechSynthesisVoice[], accent: BrowserAccent, online: boolean): SpeechSynthesisVoice | undefined {
  const lang = accent === 'uk' ? 'en-gb' : 'en-us';
  const usable = online ? voices : voices.filter((v) => v.localService);
  return (
    usable.find((v) => normLang(v.lang).startsWith(lang)) ??
    (online ? undefined : usable.find((v) => normLang(v.lang).startsWith('en')))
  );
}

/**
 * Speak text using browser speech synthesis.
 * @param text - The text to speak
 * @param accent - 'us' for en-US, 'uk' for en-GB
 */
export function speakBrowser(text: string, accent: BrowserAccent = 'us', rate = 0.9): void {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported in this browser');
    reportSpeechTrouble();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.lang = accent === 'uk' ? 'en-GB' : 'en-US';

  const voices = loadVoices();
  if (voices.length && !voices.some((v) => normLang(v.lang).startsWith('en'))) reportSpeechTrouble();
  const voice = pickVoice(voices, accent, isOnline());
  if (voice) utterance.voice = voice;
  utterance.onerror = (e) => {
    if (e.error !== 'interrupted' && e.error !== 'canceled') reportSpeechTrouble();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * The part of a vocabulary entry worth saying out loud: its first
 * alternative ("résumé / CV" → "résumé"), without notes in parentheses or
 * sb/sth placeholders ("pick sb up" → "pick up").
 */
export function spokenForm(text: string): string {
  const first = text.split('/').map((part) => part.trim()).find(Boolean) ?? '';
  const cleaned = first
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(?:sb|sth|smb|smth)(?:'s)?\b/gi, ' ')
    .replace(/…|\.\.\./g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || text.trim();
}

/**
 * What to search YouGlish for. It matches video captions, which almost never
 * carry accents, so "résumé" is searched as "resume".
 */
export function youglishQuery(text: string): string {
  return spokenForm(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

/**
 * Pronounce a word: a native-speaker recording saved on the device (see
 * ./savedVoices.ts), else one from the dictionary when online (single words
 * only), otherwise the browser's speech synthesis.
 */
export async function speakWord(text: string, accent: BrowserAccent = 'us'): Promise<void> {
  const trimmed = spokenForm(text);
  const saved = savedVoiceUrl(trimmed, accent);
  if (saved && (await playSavedVoice(saved))) return;
  // Offline, speak at once: waiting on the dictionary would only delay the
  // device voice (and Safari only lets sound play right after the tap).
  if (isOnline() && /^[a-zA-Z'-]+$/.test(trimmed)) {
    // Don't keep the user waiting on a slow lookup: after 1.5s speak with
    // the browser voice instead (the lookup still lands in the cache).
    const entry = await Promise.race([
      lookupWord(trimmed),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
    ]);
    const url = entry?.audio[accent];
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

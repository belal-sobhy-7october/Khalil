/**
 * Native-speaker recordings of a topic's words, saved on this device so 🔊
 * plays a real voice with no internet. The recordings are the free
 * dictionary's (see ./dictionary.ts) and live in Cache Storage; which topics
 * are saved, and which file each word has, is kept in localStorage. Words with
 * no recording (most phrases) are read by the device's own voice.
 */
import { useSyncExternalStore } from 'react';
import { lookupMany } from './dictionary';

export const SAVED_VOICES_KEY = 'khalil-saved-voices';
const CACHE = 'khalil-voices';

type Accent = 'us' | 'uk';

export interface SavedTopicVoices {
  savedAt: string;
  /** Words in the topic. */
  total: number;
  /** Spoken form (lowercase) → its saved recordings. */
  words: Record<string, Partial<Record<Accent, string>>>;
}

type Saved = Record<string, SavedTopicVoices>;

const listeners = new Set<() => void>();
let cache: Saved | null = null;

function read(): Saved {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(SAVED_VOICES_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    cache = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Saved) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: Saved) {
  cache = next;
  try {
    localStorage.setItem(SAVED_VOICES_KEY, JSON.stringify(next));
  } catch {
    // storage blocked — the list lasts until the page closes
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== SAVED_VOICES_KEY) return;
    cache = null;
    onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

/** Pack id → the recordings saved for it. */
export function useSavedVoices(): Saved {
  return useSyncExternalStore(subscribe, read, read);
}

export function recordedCount(topic: SavedTopicVoices): number {
  return Object.values(topic.words).filter((w) => w.us || w.uk).length;
}

/** The saved recording of a word in this accent, if any. `spoken` is spokenForm() of the word. */
export function savedVoiceUrl(spoken: string, accent: Accent): string | undefined {
  const key = spoken.trim().toLowerCase();
  for (const topic of Object.values(read())) {
    const url = topic.words[key]?.[accent];
    if (url) return url;
  }
  return undefined;
}

/** Plays a saved recording. False when it isn't on the device any more (the browser cleared it). */
export async function playSavedVoice(url: string): Promise<boolean> {
  if (typeof caches === 'undefined') return false;
  let src: string | null = null;
  try {
    const response = await caches.match(url);
    if (!response) return false;
    src = URL.createObjectURL(await response.blob());
    const audio = new Audio(src);
    const objectUrl = src;
    audio.addEventListener('ended', () => URL.revokeObjectURL(objectUrl), { once: true });
    await audio.play();
    return true;
  } catch {
    if (src) URL.revokeObjectURL(src);
    return false;
  }
}

/**
 * Downloads the recordings of a topic's words (both accents) and saves them on
 * the device. `words` are the spoken forms; only single words have
 * recordings. Resolves with what was saved, or null when nothing could be
 * (no internet, or the dictionary is down) — then nothing is kept.
 */
export async function saveTopicVoices(
  packId: string,
  words: string[],
  onProgress?: (done: number, total: number) => void
): Promise<SavedTopicVoices | null> {
  if (typeof caches === 'undefined') return null;
  const store = await caches.open(CACHE);
  const keys = words.map((w) => w.trim().toLowerCase());
  const single = keys.filter((k) => /^[a-z'-]+$/.test(k));
  const saved: SavedTopicVoices['words'] = {};
  let done = keys.length - single.length;
  onProgress?.(done, keys.length);

  const downloads: Promise<void>[] = [];
  await lookupMany(single, (i, entry) => {
    const download = async () => {
      for (const accent of ['us', 'uk'] as const) {
        const url = entry?.audio[accent];
        if (!url) continue;
        try {
          if (!(await store.match(url))) {
            const response = await fetch(url);
            if (!response.ok) continue;
            await store.put(url, response);
          }
          (saved[single[i]] ??= {})[accent] = url;
        } catch {
          // this recording can't be fetched; the device voice reads the word
        }
      }
      onProgress?.(++done, keys.length);
    };
    downloads.push(download());
  });
  await Promise.all(downloads);

  if (!Object.keys(saved).length) return null;
  const topic: SavedTopicVoices = { savedAt: new Date().toISOString().slice(0, 10), total: keys.length, words: saved };
  write({ ...read(), [packId]: topic });
  return topic;
}

/** Deletes a topic's recordings from the device (unless another saved topic uses the same file). */
export async function removeTopicVoices(packId: string): Promise<void> {
  const { [packId]: removed, ...rest } = read();
  if (!removed) return;
  write(rest);
  if (typeof caches === 'undefined') return;
  const stillUsed = new Set(Object.values(rest).flatMap((t) => Object.values(t.words).flatMap((w) => [w.us, w.uk])));
  const store = await caches.open(CACHE);
  const urls = Object.values(removed.words).flatMap((w) => [w.us, w.uk]);
  await Promise.all(urls.filter((u): u is string => !!u && !stillUsed.has(u)).map((u) => store.delete(u)));
}

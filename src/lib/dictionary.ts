/**
 * Lookups against the free dictionary API (https://dictionaryapi.dev): an
 * English learner-friendly definition, an example, IPA and native-speaker
 * audio. Results are cached in memory per word, misses included.
 */
import type { VocabularyItemType } from '../types';

export interface DictionaryEntry {
  definition: string;
  example?: string;
  phonetic?: string;
  type: VocabularyItemType;
  audio: { us?: string; uk?: string };
}

interface ApiEntry {
  phonetic?: string;
  phonetics?: Array<{ text?: string; audio?: string }>;
  meanings?: Array<{
    partOfSpeech?: string;
    definitions?: Array<{ definition?: string; example?: string }>;
  }>;
}

const cache = new Map<string, Promise<DictionaryEntry | null>>();

function toEntry(word: string, entries: ApiEntry[]): DictionaryEntry | null {
  const meanings = entries.flatMap((e) => e.meanings ?? []);
  // Prefer the first definition that comes with an example — it is usually
  // the most common sense and the example makes the card far more useful.
  let chosen: { pos?: string; definition: string; example?: string } | null = null;
  for (const m of meanings) {
    for (const d of m.definitions ?? []) {
      if (!d.definition) continue;
      if (!chosen) chosen = { pos: m.partOfSpeech, definition: d.definition, example: d.example };
      if (d.example) {
        chosen = { pos: m.partOfSpeech, definition: d.definition, example: d.example };
        break;
      }
    }
    if (chosen?.example) break;
  }
  if (!chosen) return null;

  const phonetics = entries.flatMap((e) => e.phonetics ?? []);
  const audios = phonetics.map((p) => p.audio).filter((a): a is string => !!a);
  const phonetic = entries.find((e) => e.phonetic)?.phonetic ?? phonetics.find((p) => p.text)?.text;

  let type: VocabularyItemType = 'word';
  if (word.trim().includes(' ')) type = chosen.pos === 'verb' ? 'verb' : 'phrase';
  else if (chosen.pos === 'verb') type = 'verb';

  return {
    definition: chosen.definition,
    example: chosen.example,
    phonetic,
    type,
    audio: {
      us: audios.find((a) => a.includes('-us.mp3')),
      uk: audios.find((a) => a.includes('-uk.mp3')),
    },
  };
}

export function lookupWord(word: string, timeoutMs = 4000): Promise<DictionaryEntry | null> {
  const key = word.trim().toLowerCase();
  if (!key) return Promise.resolve(null);
  const cached = cache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`, {
        signal: controller.signal,
      });
      if (!res.ok) return null;
      return toEntry(key, (await res.json()) as ApiEntry[]);
    } catch {
      // Network errors/timeouts aren't cached, so a retry can succeed.
      cache.delete(key);
      return null;
    } finally {
      clearTimeout(timer);
    }
  })();
  cache.set(key, promise);
  return promise;
}

/** Look up many words with a small concurrency limit; calls onResult as each finishes. */
export async function lookupMany(
  words: string[],
  onResult: (index: number, entry: DictionaryEntry | null) => void,
  concurrency = 4
): Promise<void> {
  let next = 0;
  const worker = async () => {
    while (next < words.length) {
      const i = next++;
      onResult(i, await lookupWord(words[i]));
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, words.length) }, worker));
}

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Fetch JSON with a timeout. Returns { status, data }; status 0 = network
// error/timeout. Throttling (429) and server errors are retried with backoff,
// so a burst of lookups doesn't turn into a wall of "not found".
async function fetchJson(url: string, timeoutMs: number): Promise<{ status: number; data: unknown }> {
  for (let attempt = 0; ; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let status = 0;
    try {
      const res = await fetch(url, { signal: controller.signal });
      status = res.status;
      if (res.ok) return { status, data: await res.json() };
    } catch {
      // network error or timeout: status stays 0
    } finally {
      clearTimeout(timer);
    }
    const transient = status === 0 || status === 429 || status >= 500;
    if (!transient || attempt >= 2) return { status, data: null };
    await sleep(800 * (attempt + 1) + Math.random() * 400);
  }
}

interface WiktionarySense {
  definition?: string;
  examples?: string[];
  parsedExamples?: Array<{ example?: string }>;
}
interface WiktionaryResponse {
  en?: Array<{ partOfSpeech?: string; definitions?: WiktionarySense[] }>;
}

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
}

// Wiktionary covers idioms and phrasal verbs ("match made in heaven",
// "split up") that the dictionary API doesn't have.
function fromWiktionary(word: string, data: WiktionaryResponse): DictionaryEntry | null {
  for (const section of data.en ?? []) {
    for (const sense of section.definitions ?? []) {
      const definition = sense.definition ? stripHtml(sense.definition) : '';
      if (!definition) continue;
      const rawExample = sense.parsedExamples?.[0]?.example ?? sense.examples?.[0];
      const pos = (section.partOfSpeech ?? '').toLowerCase();
      let type: VocabularyItemType = 'word';
      if (pos === 'idiom' || pos === 'proverb') type = 'idiom';
      else if (pos === 'verb') type = 'verb';
      else if (word.includes(' ')) type = 'phrase';
      return { definition, example: rawExample ? stripHtml(rawExample) : undefined, type, audio: {} };
    }
  }
  return null;
}

export function lookupWord(word: string, timeoutMs = 8000): Promise<DictionaryEntry | null> {
  const key = word.trim().toLowerCase();
  if (!key) return Promise.resolve(null);
  const cached = cache.get(key);
  if (cached) return cached;

  const promise = (async () => {
    let transientFailure = false;

    const dict = await fetchJson(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`, timeoutMs);
    if (dict.data) {
      const entry = toEntry(key, dict.data as ApiEntry[]);
      if (entry) return entry;
    } else if (dict.status !== 404) {
      transientFailure = true;
    }

    const wiki = await fetchJson(
      `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(key.replace(/ /g, '_'))}`,
      timeoutMs
    );
    if (wiki.data) {
      const entry = fromWiktionary(key, wiki.data as WiktionaryResponse);
      if (entry) return entry;
    } else if (wiki.status !== 404) {
      transientFailure = true;
    }

    // Only a real "no such word" is cached; network trouble can be retried.
    if (transientFailure) cache.delete(key);
    return null;
  })();
  cache.set(key, promise);
  return promise;
}

/** Look up many words with a small concurrency limit; calls onResult as each finishes. */
export async function lookupMany(
  words: string[],
  onResult: (index: number, entry: DictionaryEntry | null) => void,
  concurrency = 3
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

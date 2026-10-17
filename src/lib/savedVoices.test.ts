import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DictionaryEntry } from './dictionary';

const entries: Record<string, Partial<DictionaryEntry> | null> = {
  verify: { audio: { us: 'https://media.test/verify-us.mp3', uk: 'https://media.test/verify-uk.mp3' } },
  breach: { audio: { uk: 'https://media.test/breach-uk.mp3' } },
  phishing: { audio: {} },
};

vi.mock('./dictionary', () => ({
  lookupMany: async (words: string[], onResult: (i: number, e: unknown) => void) => {
    words.forEach((w, i) => onResult(i, entries[w] ?? null));
  },
}));

import { playSavedVoice, recordedCount, removeTopicVoices, saveTopicVoices, savedVoiceUrl } from './savedVoices';

// A Cache Storage that keeps responses in a Map.
const stored = new Map<string, Response>();
const store = {
  match: async (url: string) => stored.get(url)?.clone(),
  put: async (url: string, response: Response) => void stored.set(url, response),
  delete: async (url: string) => stored.delete(url),
};
const fetchMock = vi.fn(async (url: string) => (url.includes('broken') ? new Response('', { status: 404 }) : new Response(`audio:${url}`)));
const play = vi.fn(async () => {});

beforeEach(() => {
  vi.stubGlobal('caches', { open: async () => store, match: store.match });
  vi.stubGlobal('fetch', fetchMock);
  vi.stubGlobal(
    'Audio',
    class {
      play = play;
      addEventListener() {}
    }
  );
  URL.createObjectURL = vi.fn(() => 'blob:voice');
  URL.revokeObjectURL = vi.fn();
});

afterEach(async () => {
  await removeTopicVoices('cyber');
  stored.clear();
  fetchMock.mockClear();
  play.mockClear();
  vi.unstubAllGlobals();
});

describe('saved topic voices', () => {
  it('saves the recordings of single words, both accents, and finds them by word', async () => {
    const progress: number[] = [];
    const topic = await saveTopicVoices('cyber', ['verify', 'breach', 'phishing', 'two-factor authentication'], (done) => progress.push(done));

    expect(topic && recordedCount(topic)).toBe(2);
    expect(topic?.total).toBe(4);
    expect(progress.at(-1)).toBe(4);
    expect(stored.size).toBe(3);
    expect(savedVoiceUrl('Verify', 'us')).toBe('https://media.test/verify-us.mp3');
    expect(savedVoiceUrl('breach', 'uk')).toBe('https://media.test/breach-uk.mp3');
    expect(savedVoiceUrl('breach', 'us')).toBeUndefined();
    expect(JSON.parse(localStorage.getItem('khalil-saved-voices')!).cyber.words.verify.uk).toBe('https://media.test/verify-uk.mp3');
  });

  it('keeps nothing when no recording could be downloaded', async () => {
    fetchMock.mockRejectedValue(new TypeError('offline'));
    expect(await saveTopicVoices('cyber', ['verify', 'breach'])).toBeNull();
    expect(savedVoiceUrl('verify', 'us')).toBeUndefined();
    fetchMock.mockReset();
    fetchMock.mockImplementation(async (url: string) => new Response(`audio:${url}`));
  });

  it('plays a saved recording from the device, and reports one that is gone', async () => {
    await saveTopicVoices('cyber', ['verify']);
    fetchMock.mockClear();
    expect(await playSavedVoice('https://media.test/verify-us.mp3')).toBe(true);
    expect(play).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await playSavedVoice('https://media.test/missing.mp3')).toBe(false);
  });

  it('removes a topic and its files', async () => {
    await saveTopicVoices('cyber', ['verify', 'breach']);
    await removeTopicVoices('cyber');
    expect(stored.size).toBe(0);
    expect(savedVoiceUrl('verify', 'us')).toBeUndefined();
  });
});

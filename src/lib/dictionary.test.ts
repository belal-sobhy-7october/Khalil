import { afterEach, describe, expect, it, vi } from 'vitest';
import { lookupWord } from './dictionary';

const json = (status: number, body: unknown) =>
  Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) } as Response);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('lookupWord', () => {
  it('retries when the dictionary throttles, instead of reporting "not found"', async () => {
    const fetchMock = vi.fn()
      .mockReturnValueOnce(json(429, null))
      .mockReturnValueOnce(json(200, [{ meanings: [{ partOfSpeech: 'noun', definitions: [{ definition: 'The act of focusing.', example: 'It needs concentration.' }] }] }]));
    vi.stubGlobal('fetch', fetchMock);
    const entry = await lookupWord('concentration-retry');
    expect(entry?.definition).toBe('The act of focusing.');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('falls back to Wiktionary for idioms the dictionary does not know', async () => {
    const fetchMock = vi.fn((url: string) =>
      url.includes('dictionaryapi')
        ? json(404, null)
        : json(200, {
            en: [{ partOfSpeech: 'Noun', definitions: [{ definition: '<span>A <b>perfect</b> match.</span>', parsedExamples: [{ example: 'They are a <b>match made in heaven</b>.' }] }] }],
          })
    );
    vi.stubGlobal('fetch', fetchMock);
    const entry = await lookupWord('match made in heaven');
    expect(entry).toMatchObject({ definition: 'A perfect match.', example: 'They are a match made in heaven.', type: 'phrase' });
    expect(fetchMock.mock.calls[1][0]).toContain('match_made_in_heaven');
  });

  it('returns null when neither source has the word', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json(404, null)));
    expect(await lookupWord('zzqxnotaword')).toBeNull();
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { lookupWord, senseForTopic } from './dictionary';
import { topicContext } from './senseRank';

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

  it('keeps every Wiktionary sense, without grammar labels, and picks the one for the topic', async () => {
    vi.stubGlobal('fetch', vi.fn((url: string) =>
      url.includes('dictionaryapi')
        ? json(404, null)
        : json(200, {
            en: [{
              partOfSpeech: 'Verb',
              definitions: [
                { definition: '(intransitive) To separate; to divide into groups.' },
                { definition: '(intransitive, idiomatic) To end a relationship.', examples: ['They <b>split up</b> last year.'] },
              ],
            }],
          })
    ));
    const entry = await lookupWord('split up');
    expect(entry?.senses.map((s) => s.definition)).toEqual(['To separate; to divide into groups.', '(idiomatic) To end a relationship.']);
    expect(senseForTopic(entry!, topicContext('Marriage'))).toMatchObject({ definition: '(idiomatic) To end a relationship.', example: 'They split up last year.' });
    // No topic: the default (first) sense.
    expect(senseForTopic(entry!, topicContext('')).definition).toBe('To separate; to divide into groups.');
  });

  it('returns null when neither source has the word', async () => {
    vi.stubGlobal('fetch', vi.fn(() => json(404, null)));
    expect(await lookupWord('zzqxnotaword')).toBeNull();
  });
});

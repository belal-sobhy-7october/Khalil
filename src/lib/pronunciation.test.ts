import { beforeEach, describe, expect, it, vi } from 'vitest';

const STORAGE_KEY = 'khalil-pronunciation';

// Create a hoisted mock for localStorage
const { localStorageMock, consoleErrorSpy } = vi.hoisted(() => {
  let store: Record<string, string> = {};
  return {
    localStorageMock: {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    },
    consoleErrorSpy: vi.fn(),
  };
});

vi.stubGlobal('localStorage', localStorageMock);
vi.stubGlobal('console', { ...console, error: consoleErrorSpy });

import {
  getPronunciationPrefs,
  setPronunciationPrefs,
  buildYouGlishUrl,
  type BrowserAccent,
} from './pronunciation';

beforeEach(() => {
  localStorageMock.clear();
  consoleErrorSpy.mockClear();
});

describe('pronunciation prefs', () => {
  it('returns default prefs when localStorage is empty', () => {
    const prefs = getPronunciationPrefs();
    expect(prefs).toEqual({ accent: 'us' });
  });

  it('returns stored prefs from localStorage', () => {
    const storedPrefs: { accent: BrowserAccent } = { accent: 'uk' };
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(storedPrefs));

    const prefs = getPronunciationPrefs();
    expect(prefs).toEqual(storedPrefs);
  });

  it('returns default prefs when localStorage contains invalid JSON', () => {
    localStorageMock.setItem(STORAGE_KEY, 'invalid json');

    const prefs = getPronunciationPrefs();
    expect(prefs).toEqual({ accent: 'us' });
  });

  it('saves prefs to localStorage', () => {
    const prefsToSave: { accent: BrowserAccent } = { accent: 'uk' };
    setPronunciationPrefs(prefsToSave);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(prefsToSave));
  });

  it('handles localStorage getItem errors gracefully', () => {
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('Storage error');
    });

    const prefs = getPronunciationPrefs();
    expect(prefs).toEqual({ accent: 'us' });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('handles localStorage setItem errors gracefully', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Storage error');
    });

    setPronunciationPrefs({ accent: 'uk' });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});

describe('buildYouGlishUrl', () => {
  it('builds correct URL for US accent', () => {
    const url = buildYouGlishUrl('hello', 'us');
    expect(url).toBe('https://youglish.com/pronounce/hello/english/us');
  });

  it('builds correct URL for UK accent', () => {
    const url = buildYouGlishUrl('hello', 'uk');
    expect(url).toBe('https://youglish.com/pronounce/hello/english/uk');
  });

  it('builds correct URL for AUS accent', () => {
    const url = buildYouGlishUrl('hello', 'aus');
    expect(url).toBe('https://youglish.com/pronounce/hello/english/aus');
  });

  it('encodes special characters in word', () => {
    const url = buildYouGlishUrl('hello world', 'us');
    expect(url).toBe('https://youglish.com/pronounce/hello%20world/english/us');
  });

  it('encodes punctuation in word', () => {
    const url = buildYouGlishUrl("don't", 'uk');
    // encodeURIComponent does not encode apostrophe
    expect(url).toBe("https://youglish.com/pronounce/don't/english/uk");
  });

  it('defaults to US accent when not specified', () => {
    const url = buildYouGlishUrl('test');
    expect(url).toBe('https://youglish.com/pronounce/test/english/us');
  });

  it('handles empty string word', () => {
    const url = buildYouGlishUrl('', 'us');
    expect(url).toBe('https://youglish.com/pronounce//english/us');
  });
});
describe('spokenForm / youglishQuery', () => {
  it('uses the first alternative and drops notes and placeholders', async () => {
    const { spokenForm, youglishQuery } = await import('./pronunciation');
    expect(spokenForm('résumé / CV')).toBe('résumé');
    expect(youglishQuery('résumé / CV')).toBe('resume');
    expect(youglishQuery('pick sb up')).toBe('pick up');
    expect(youglishQuery('take (something) for granted')).toBe('take for granted');
    expect(youglishQuery('cover letter')).toBe('cover letter');
    expect(youglishQuery("don't")).toBe("don't");
  });
});

describe('the device voice offline', () => {
  const voice = (name: string, lang: string, localService: boolean) => ({ name, lang, localService }) as SpeechSynthesisVoice;
  const voices = [voice('Google US English', 'en-US', false), voice('Samantha', 'en_US', true), voice('Daniel', 'en-GB', true)];

  it('picks a voice installed on the device when offline', async () => {
    const { pickVoice } = await import('./pronunciation');
    expect(pickVoice(voices, 'us', true)?.name).toBe('Google US English');
    expect(pickVoice(voices, 'us', false)?.name).toBe('Samantha');
    expect(pickVoice(voices, 'uk', false)?.name).toBe('Daniel');
    // No installed voice for the accent: any installed English voice.
    expect(pickVoice([voices[0], voices[2]], 'us', false)?.name).toBe('Daniel');
  });

  it('speaks right away offline instead of waiting on the dictionary', async () => {
    const speak = vi.fn();
    vi.stubGlobal('speechSynthesis', { cancel: vi.fn(), speak, getVoices: () => voices });
    vi.stubGlobal(
      'SpeechSynthesisUtterance',
      class {
        text: string;
        constructor(text: string) {
          this.text = text;
        }
      }
    );
    const onLine = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    try {
      const { speakWord } = await import('./pronunciation');
      await speakWord('verify', 'us');
      expect(speak).toHaveBeenCalledTimes(1);
      expect(speak.mock.calls[0][0]).toMatchObject({ text: 'verify', voice: { name: 'Samantha' } });
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      onLine.mockRestore();
      vi.unstubAllGlobals();
      vi.stubGlobal('localStorage', localStorageMock);
      vi.stubGlobal('console', { ...console, error: consoleErrorSpy });
    }
  });
});

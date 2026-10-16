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

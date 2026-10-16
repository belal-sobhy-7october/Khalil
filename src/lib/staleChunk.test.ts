import { afterEach, describe, expect, it, vi } from 'vitest';
import { isStaleChunkError, reloadForNewVersion } from './staleChunk';

describe('stale chunk recovery', () => {
  afterEach(() => {
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it('recognises the errors browsers throw for a missing lazy file', () => {
    expect(isStaleChunkError(new TypeError('Failed to fetch dynamically imported module: https://x/assets/a.js'))).toBe(true);
    expect(isStaleChunkError(new TypeError('Importing a module script failed.'))).toBe(true);
    expect(isStaleChunkError(new Error('Cannot read properties of undefined'))).toBe(false);
  });

  it('reloads once, then not again for a while', () => {
    const reload = vi.fn();
    vi.stubGlobal('location', { ...window.location, reload });
    expect(reloadForNewVersion()).toBe(true);
    expect(reloadForNewVersion()).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });
});

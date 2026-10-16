import { afterEach, describe, expect, it, vi } from 'vitest';
import { readStoredSession } from './offline';

const KEY = 'sb-abcdefgh-auth-token';

afterEach(() => {
  localStorage.clear();
  vi.unstubAllEnvs();
});

describe('readStoredSession', () => {
  it('reads the session supabase-js saved, even with an expired token', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://abcdefgh.supabase.co');
    const saved = { access_token: 'a', refresh_token: 'r', expires_at: 1, user: { id: 'u1' } };
    localStorage.setItem(KEY, JSON.stringify(saved));
    expect(readStoredSession()?.user.id).toBe('u1');
  });

  it('returns null when nothing usable is saved', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://abcdefgh.supabase.co');
    expect(readStoredSession()).toBeNull();
    localStorage.setItem(KEY, '{not json');
    expect(readStoredSession()).toBeNull();
    localStorage.setItem(KEY, JSON.stringify({ access_token: 'a', user: { id: 'u1' } }));
    expect(readStoredSession()).toBeNull();
  });
});

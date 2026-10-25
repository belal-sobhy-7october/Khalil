import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyChanges, loadStartup, STARTUP_KV_KEYS, type StartupResponse } from './startup';
import { readSyncRecord, writeSyncRecord, type SyncRecord } from './syncCache';
import { mockSupabase } from '../test/mockSupabase';

vi.mock('./supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

vi.mock('./syncCache', () => ({
  FULL_EVERY_DAYS: 60,
  readSyncRecord: vi.fn(async () => null),
  writeSyncRecord: vi.fn(async () => {}),
  forgetOtherAccounts: vi.fn(async () => {}),
}));

function response(over: Partial<StartupResponse> = {}): StartupResponse {
  return {
    now: '2026-10-25T10:00:00.000Z',
    full: false,
    focus: [], todos: [], life_categories: [], sub_tracks: [], habits: [], vocabulary_categories: [], sticky_notes: [], todo_notes: [],
    kv: {}, words: [], srs: [], habit_entries: [], wird: [], deleted: [],
    ...over,
  };
}

const word = (id: string, created: string, extra: Record<string, unknown> = {}) => ({ id, word: id, created_at: created, ...extra });

const base: SyncRecord = {
  cursor: '2026-10-24T10:00:00.000Z',
  fullAt: '2026-10-20T10:00:00.000Z',
  words: { w1: word('w1', '2026-01-01'), w2: word('w2', '2026-01-02') },
  srs: { w1: { reps: 1 }, w2: { reps: 2 } },
  habitEntries: { 'h1|2026-10-01': { id: 'e1', habit_id: 'h1', date: '2026-10-01' } },
  wird: { '2026-10-01': { date: '2026-10-01', data: { quran: 1 } } },
};

describe('applyChanges', () => {
  it('replaces the copy when everything came', () => {
    const next = applyChanges(base, response({ full: true, words: [word('w3', '2026-02-01')] }));
    expect(Object.keys(next.words)).toEqual(['w3']);
    expect(next.srs).toEqual({});
    expect(next.fullAt).toBe(next.cursor);
  });

  it('applies the deletions, then the rows that changed', () => {
    const next = applyChanges(base, response({
      words: [word('w1', '2026-01-01', { word: 'edited' }), word('w3', '2026-02-01')],
      srs: [{ key: 'srs:w3', value: { reps: 3 } }],
      habit_entries: [{ id: 'e2', habit_id: 'h1', date: '2026-10-02' }],
      wird: [{ date: '2026-10-01', data: { quran: 2 } }],
      deleted: [
        { source: 'vocabulary_items', key: 'w2' },
        { source: 'user_kv', key: 'srs:w2' },
        { source: 'user_kv', key: 'tasks-settings' },
        { source: 'habit_entries', key: 'h1|2026-10-01' },
      ],
    }));
    expect(Object.keys(next.words).sort()).toEqual(['w1', 'w3']);
    expect(next.words.w1.word).toBe('edited');
    expect(next.srs).toEqual({ w1: { reps: 1 }, w3: { reps: 3 } });
    expect(Object.keys(next.habitEntries)).toEqual(['h1|2026-10-02']);
    expect(next.wird['2026-10-01']).toEqual({ date: '2026-10-01', data: { quran: 2 } });
    expect(next.cursor).toBe('2026-10-25T10:00:00.000Z');
    expect(next.fullAt).toBe(base.fullAt);
    // The copy it started from is left as it was.
    expect(Object.keys(base.words)).toEqual(['w1', 'w2']);
  });

  it('keeps a row deleted and then added again (an unticked and reticked habit day)', () => {
    const next = applyChanges(base, response({
      habit_entries: [{ id: 'e9', habit_id: 'h1', date: '2026-10-01' }],
      deleted: [{ source: 'habit_entries', key: 'h1|2026-10-01' }],
    }));
    expect(next.habitEntries['h1|2026-10-01']).toMatchObject({ id: 'e9' });
  });
});

describe('loadStartup', () => {
  beforeEach(() => {
    vi.mocked(readSyncRecord).mockResolvedValue(null);
    vi.mocked(writeSyncRecord).mockClear();
    mockSupabase.rpc.mockReset();
  });

  it('asks for everything on the first visit and keeps a copy', async () => {
    mockSupabase.rpc.mockResolvedValue({ data: response({ full: true, words: [word('b', '2026-02-01'), word('a', '2026-01-01')] }), error: null });
    const data = await loadStartup('u1');
    expect(mockSupabase.rpc).toHaveBeenCalledWith('app_startup', { since: null, kv_keys: STARTUP_KV_KEYS });
    expect(data?.words.map((w) => w.id)).toEqual(['a', 'b']);
    expect(writeSyncRecord).toHaveBeenCalledWith('u1', expect.objectContaining({ cursor: '2026-10-25T10:00:00.000Z' }));
  });

  it('asks only for what changed since the copy, and returns the copy with the changes', async () => {
    vi.setSystemTime(new Date('2026-10-25T10:00:00Z'));
    vi.mocked(readSyncRecord).mockResolvedValue(base);
    mockSupabase.rpc.mockResolvedValue({ data: response({ words: [word('w0', '2025-12-01')], deleted: [{ source: 'vocabulary_items', key: 'w2' }] }), error: null });
    const data = await loadStartup('u1');
    expect(mockSupabase.rpc).toHaveBeenCalledWith('app_startup', { since: base.cursor, kv_keys: STARTUP_KV_KEYS });
    expect(data?.words.map((w) => w.id)).toEqual(['w0', 'w1']);
    expect(data?.srs).toEqual(base.srs);
    expect(data?.wird).toEqual([{ date: '2026-10-01', data: { quran: 1 } }]);
    vi.useRealTimers();
  });

  it('loads everything again when the copy was loaded in full long ago', async () => {
    vi.setSystemTime(new Date('2027-01-01T10:00:00Z'));
    vi.mocked(readSyncRecord).mockResolvedValue(base);
    mockSupabase.rpc.mockResolvedValue({ data: response({ full: true }), error: null });
    await loadStartup('u1');
    expect(mockSupabase.rpc).toHaveBeenCalledWith('app_startup', { since: null, kv_keys: STARTUP_KV_KEYS });
    vi.useRealTimers();
  });

  it('returns null when the database has no app_startup yet', async () => {
    mockSupabase.rpc.mockResolvedValue({ data: null, error: { code: 'PGRST202', message: 'Could not find the function' } });
    expect(await loadStartup('u1')).toBeNull();
    expect(writeSyncRecord).not.toHaveBeenCalled();
  });

  it('returns null when the request itself fails', async () => {
    mockSupabase.rpc.mockRejectedValue(new Error('offline'));
    expect(await loadStartup('u1')).toBeNull();
  });
});

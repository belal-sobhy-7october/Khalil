import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { forgetKnownKv, loadKv, prefetchKv, saveKv } from './userKv';
import { mockSupabase } from '../test/mockSupabase';

vi.mock('./supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

// user_kv as a query: `in` resolves with the rows of the asked keys; `upsert` saves.
let rows: Record<string, unknown> = {};
const inCalls: string[][] = [];
function kvTable() {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    in: vi.fn((_col: string, keys: string[]) => {
      inCalls.push(keys);
      return Promise.resolve({ data: keys.filter((k) => k in rows).map((k) => ({ key: k, value: rows[k] })), error: null });
    }),
    upsert: vi.fn(async () => ({ error: null })),
  };
  return query;
}

beforeEach(() => {
  forgetKnownKv();
  localStorage.clear();
  rows = {};
  inCalls.length = 0;
  mockSupabase.from.mockImplementation(() => kvTable());
});
afterEach(() => vi.useRealTimers());

describe('loadKv', () => {
  it('takes a value the startup request brought, with no request of its own', async () => {
    prefetchKv('u1', ['tasks-settings', 'wird-items'], Promise.resolve({ 'tasks-settings': { a: 1 } }));
    expect(await loadKv('u1', 'tasks-settings', null)).toEqual({ a: 1 });
    // Not saved yet: the fallback (or this device's copy).
    expect(await loadKv('u1', 'wird-items', 'none')).toBe('none');
    expect(inCalls).toEqual([]);
    expect(JSON.parse(localStorage.getItem('khalil-kv:tasks-settings')!)).toEqual({ a: 1 });
  });

  it('asks the table when the startup request brought nothing', async () => {
    rows = { 'tasks-settings': { a: 2 } };
    prefetchKv('u1', ['tasks-settings'], Promise.resolve(null));
    expect(await loadKv('u1', 'tasks-settings', null)).toEqual({ a: 2 });
    expect(inCalls).toEqual([['tasks-settings']]);
  });

  it('asks for keys wanted at the same moment in one request', async () => {
    rows = { a: 1, b: 2 };
    const [a, b, c] = await Promise.all([loadKv('u1', 'a', 0), loadKv('u1', 'b', 0), loadKv('u1', 'c', 'none')]);
    expect([a, b, c]).toEqual([1, 2, 'none']);
    expect(inCalls).toEqual([['a', 'b', 'c']]);
  });

  it('gives a value just saved without asking, and asks again a minute later', async () => {
    await saveKv('u1', 'a', 5);
    expect(await loadKv('u1', 'a', 0)).toBe(5);
    expect(inCalls).toEqual([]);
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.now() + 61_000);
    rows = { a: 6 }; // changed on another device
    expect(await loadKv('u1', 'a', 0)).toBe(6);
    expect(inCalls).toEqual([['a']]);
  });

  it("falls back to this device's copy when the request fails", async () => {
    localStorage.setItem('khalil-kv:a', JSON.stringify(7));
    mockSupabase.from.mockImplementation(() => {
      const q = kvTable();
      q.in = vi.fn(() => Promise.resolve({ data: null, error: { message: 'offline' } })) as never;
      return q;
    });
    expect(await loadKv('u1', 'a', 0)).toBe(7);
  });
});

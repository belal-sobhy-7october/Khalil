import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_DAY, flushWirdSaves, jamaahCount, rawatibCount, useWirdStore, wirdScore } from './wird';
import { mockSupabase, mockSupabaseResponse } from '../test/mockSupabase';

vi.mock('./supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

describe('wird scoring', () => {
  it('is 0 for an empty day and 100 for a complete one', () => {
    expect(wirdScore(EMPTY_DAY)).toBe(0);
    expect(
      wirdScore({
        prayers: { fajr: 'jamaah', dhuhr: 'jamaah', asr: 'jamaah', maghrib: 'jamaah', isha: 'jamaah' },
        qiyam: 11,
        rawatib: { fajrBefore: true, dhuhrBefore: true, dhuhrAfter: true, maghribAfter: true, ishaAfter: true },
        quran: 1,
        adhkarAM: true,
        adhkarPM: true,
      })
    ).toBe(100);
  });

  it('counts a prayer alone as half, and rawatib by rakaat', () => {
    const d = { ...EMPTY_DAY, prayers: { fajr: 'alone' as const, dhuhr: 'jamaah' as const }, rawatib: { dhuhrBefore: true } };
    expect(jamaahCount(d)).toBe(1);
    expect(rawatibCount(d)).toBe(4);
    expect(wirdScore(d)).toBe(Math.round((1.5 / 5) * 40 + (4 / 12) * 15));
  });
});

describe('wird saving', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useWirdStore.setState({ days: {} });
    mockSupabase.from.mockClear();
  });
  afterEach(() => vi.useRealTimers());

  it('debounces rapid taps into one save, and flushes immediately when the page hides', () => {
    const { updateDay } = useWirdStore.getState();
    updateDay('u1', '2026-10-15', { qiyam: 2 });
    updateDay('u1', '2026-10-15', { qiyam: 4 });
    expect(mockSupabase.from).not.toHaveBeenCalled();
    flushWirdSaves();
    expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(1000);
    expect(mockSupabase.from).toHaveBeenCalledTimes(1);
    expect(useWirdStore.getState().days['2026-10-15'].qiyam).toBe(4);
  });

  it('keeps an edit whose save was cut off by a reload, and sends it again', async () => {
    vi.resetModules();
    localStorage.setItem('khalil-wird-days', JSON.stringify({ '2026-10-15': { ...EMPTY_DAY, adhkarPM: true } }));
    localStorage.setItem('khalil-wird-unsynced', JSON.stringify(['2026-10-15']));
    const fresh = await import('./wird');
    // resetModules keeps mocked modules, so the store still talks to the top-level mock.
    const m = mockSupabase;
    m.upsert.mockClear();
    // The server still has the old version of the day.
    mockSupabaseResponse.data = [{ date: '2026-10-15', data: { ...EMPTY_DAY } }];
    await fresh.useWirdStore.getState().loadRange('u1', '2026-10-01', '2026-10-31');
    mockSupabaseResponse.data = null;
    expect(fresh.useWirdStore.getState().days['2026-10-15'].adhkarPM).toBe(true);
    expect(m.upsert).toHaveBeenCalledWith(expect.objectContaining({ date: '2026-10-15', data: expect.objectContaining({ adhkarPM: true }) }), expect.anything());
    await Promise.resolve();
    await Promise.resolve();
    expect(JSON.parse(localStorage.getItem('khalil-wird-unsynced') ?? '[]')).toEqual([]);
  });
  it('keeps an edit made while the days were loading, even once the edit is saved', async () => {
    vi.useRealTimers();
    let answer!: (value: unknown) => void;
    const late = new Promise((resolve) => (answer = resolve));
    const query = { select: () => query, eq: () => query, gte: () => query, lte: () => late, upsert: vi.fn(async () => ({ error: null })) };
    mockSupabase.from.mockImplementation(() => query);
    try {
      useWirdStore.setState({ days: { '2026-10-15': { ...EMPTY_DAY } } });
      // The days are asked for, then the evening adhkar is ticked and saved before the answer comes.
      const loading = useWirdStore.getState().loadRange('u1', '2026-10-01', '2026-10-31');
      useWirdStore.getState().updateDay('u1', '2026-10-15', { adhkarPM: true });
      flushWirdSaves();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(query.upsert).toHaveBeenCalledTimes(1);
      expect(JSON.parse(localStorage.getItem('khalil-wird-unsynced') ?? '[]')).toEqual([]);
      // The answer to the earlier request, without the tick, arrives late.
      answer({ data: [{ date: '2026-10-15', data: { ...EMPTY_DAY } }], error: null });
      await loading;
      expect(useWirdStore.getState().days['2026-10-15'].adhkarPM).toBe(true);
      expect(JSON.parse(localStorage.getItem('khalil-wird-days') ?? '{}')['2026-10-15'].adhkarPM).toBe(true);
    } finally {
      mockSupabase.from.mockReturnThis();
    }
  });
  it('keeps a saved edit when a load sent after it was answered before the save arrived', async () => {
    vi.useRealTimers();
    let answer!: (value: unknown) => void;
    const late = new Promise((resolve) => (answer = resolve));
    const query = { select: () => query, eq: () => query, gte: () => query, lte: () => late, upsert: vi.fn(async () => ({ error: null })) };
    mockSupabase.from.mockImplementation(() => query);
    try {
      useWirdStore.setState({ days: { '2026-10-16': { ...EMPTY_DAY } } });
      // Tick first, then the page asks for the days (the server answers from before the save) and the save lands.
      useWirdStore.getState().updateDay('u1', '2026-10-16', { adhkarAM: true });
      const loading = useWirdStore.getState().loadRange('u1', '2026-10-01', '2026-10-31');
      flushWirdSaves();
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(JSON.parse(localStorage.getItem('khalil-wird-unsynced') ?? '[]')).toEqual([]);
      answer({ data: [{ date: '2026-10-16', data: { ...EMPTY_DAY } }], error: null });
      await loading;
      expect(useWirdStore.getState().days['2026-10-16'].adhkarAM).toBe(true);
    } finally {
      mockSupabase.from.mockReturnThis();
    }
  });
});

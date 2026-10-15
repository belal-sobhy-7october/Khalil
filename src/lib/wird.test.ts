import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_DAY, flushWirdSaves, jamaahCount, rawatibCount, useWirdStore, wirdScore } from './wird';
import { mockSupabase } from '../test/mockSupabase';

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
});

import { describe, expect, it } from 'vitest';
import { EMPTY_DAY, jamaahCount, rawatibCount, wirdScore } from './wird';

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

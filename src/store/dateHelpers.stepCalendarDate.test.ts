import { describe, expect, it } from 'vitest';
import {
  addDaysToDateString,
  addMonthsToDateString,
  getWeekStart,
  stepCalendarDate,
} from './dateHelpers';
import type { CalendarViewMode } from '../types';

// This suite runs under TZ=Africa/Cairo (see vite.config.ts test.env), a
// UTC+2/+3 timezone that observes DST. Every helper here works entirely in
// local YYYY-MM-DD strings, so none of this should depend on the host
// timezone — these tests exist to prove that, and to pin the exact stepping
// behavior per calendar view mode.

describe('addMonthsToDateString', () => {
  it('adds whole months without clamping when the target month is long enough', () => {
    expect(addMonthsToDateString('2024-01-15', 1)).toBe('2024-02-15');
    expect(addMonthsToDateString('2024-06-10', 3)).toBe('2024-09-10');
  });

  it('clamps to the last day of the target month (Jan 31 + 1 month -> Feb 28/29)', () => {
    expect(addMonthsToDateString('2023-01-31', 1)).toBe('2023-02-28'); // non-leap
    expect(addMonthsToDateString('2024-01-31', 1)).toBe('2024-02-29'); // leap year
    expect(addMonthsToDateString('2024-03-31', -1)).toBe('2024-02-29');
  });

  it('crosses year boundaries in both directions', () => {
    expect(addMonthsToDateString('2024-01-15', -1)).toBe('2023-12-15');
    expect(addMonthsToDateString('2023-12-15', 1)).toBe('2024-01-15');
  });

  it('supports adding whole years via a multiple of 12, clamping Feb 29', () => {
    expect(addMonthsToDateString('2024-02-29', 12)).toBe('2025-02-28');
    expect(addMonthsToDateString('2024-02-29', -12)).toBe('2023-02-28');
    expect(addMonthsToDateString('2024-01-31', 12)).toBe('2025-01-31');
  });
});

describe('getWeekStart with an explicit date', () => {
  it('returns the Monday on/before the given mid-week date', () => {
    expect(getWeekStart('2024-01-03')).toBe('2024-01-01'); // Wednesday
  });

  it('returns the previous Monday when the given date is a Sunday', () => {
    expect(getWeekStart('2024-01-07')).toBe('2024-01-01');
  });

  it('returns the same date when it is already a Monday', () => {
    expect(getWeekStart('2024-01-08')).toBe('2024-01-08');
  });

  it('handles month boundaries', () => {
    expect(getWeekStart('2024-04-30')).toBe('2024-04-29');
  });
});

describe('stepCalendarDate', () => {
  const cases: Array<{ mode: CalendarViewMode; from: string; expectedNext: string; expectedPrev: string }> = [
    { mode: 'day', from: '2024-06-15', expectedNext: '2024-06-16', expectedPrev: '2024-06-14' },
    { mode: 'week', from: '2024-06-15', expectedNext: '2024-06-22', expectedPrev: '2024-06-08' },
    { mode: 'multi-week', from: '2024-06-15', expectedNext: '2024-06-22', expectedPrev: '2024-06-08' },
    { mode: 'agenda', from: '2024-06-15', expectedNext: '2024-06-22', expectedPrev: '2024-06-08' },
    { mode: 'multi-day', from: '2024-06-15', expectedNext: '2024-06-18', expectedPrev: '2024-06-12' },
    { mode: 'month', from: '2024-06-15', expectedNext: '2024-07-15', expectedPrev: '2024-05-15' },
    { mode: 'year', from: '2024-06-15', expectedNext: '2025-06-15', expectedPrev: '2023-06-15' },
  ];

  it.each(cases)('$mode steps forward by the right unit', ({ mode, from, expectedNext }) => {
    expect(stepCalendarDate(from, mode, 1)).toBe(expectedNext);
  });

  it.each(cases)('$mode steps backward by the right unit', ({ mode, from, expectedPrev }) => {
    expect(stepCalendarDate(from, mode, -1)).toBe(expectedPrev);
  });

  it('year mode moves by a full year, not a month, and is not confused with month mode', () => {
    expect(stepCalendarDate('2024-01-31', 'year', 1)).toBe('2025-01-31');
    expect(stepCalendarDate('2024-01-31', 'month', 1)).toBe('2024-02-29');
  });

  it('clamps month-end dates when stepping months', () => {
    expect(stepCalendarDate('2024-01-31', 'month', 1)).toBe('2024-02-29');
    expect(stepCalendarDate('2024-03-31', 'month', -1)).toBe('2024-02-29');
  });

  it('clamps month-end dates when stepping years across a leap boundary', () => {
    expect(stepCalendarDate('2024-02-29', 'year', 1)).toBe('2025-02-28');
  });

  it('returns the input unchanged for an unrecognized view mode', () => {
    expect(stepCalendarDate('2024-06-15', 'unknown' as CalendarViewMode, 1)).toBe('2024-06-15');
  });

  describe('across Cairo DST transitions', () => {
    // Egypt resumed DST in 2023: clocks spring forward at local midnight on
    // the last Friday of April, and fall back at local midnight around
    // November 1st. Both transitions land exactly at midnight, so a
    // calendar-day step across them must still land on the very next/previous
    // calendar day with no skip or repeat.
    it('day view steps cleanly across the spring-forward boundary (Apr 25 -> Apr 26, 2024)', () => {
      expect(stepCalendarDate('2024-04-25', 'day', 1)).toBe('2024-04-26');
      expect(stepCalendarDate('2024-04-26', 'day', -1)).toBe('2024-04-25');
    });

    it('day view steps cleanly across the fall-back boundary (Oct 31 -> Nov 1, 2024)', () => {
      expect(stepCalendarDate('2024-10-31', 'day', 1)).toBe('2024-11-01');
      expect(stepCalendarDate('2024-11-01', 'day', -1)).toBe('2024-10-31');
    });

    it('week view steps a full 7 days across both DST boundaries', () => {
      expect(stepCalendarDate('2024-04-23', 'week', 1)).toBe('2024-04-30');
      expect(stepCalendarDate('2024-10-29', 'week', 1)).toBe('2024-11-05');
    });

    it('walking every day of a DST year advances exactly one calendar day at a time with no skip or repeat', () => {
      let date = '2024-01-01';
      const seen = new Set([date]);
      for (let i = 0; i < 365; i++) {
        const next = stepCalendarDate(date, 'day', 1);
        expect(addDaysToDateString(date, 1)).toBe(next);
        expect(seen.has(next)).toBe(false);
        seen.add(next);
        date = next;
      }
      expect(date).toBe('2024-12-31');
      expect(seen.size).toBe(366);
    });
  });
});

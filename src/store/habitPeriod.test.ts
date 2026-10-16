import { describe, expect, it } from 'vitest';
import { habitPeriodDates, habitPeriodStart, stepHabitPeriod } from './habitPeriod';

describe('habit grid periods', () => {
  it('week runs Saturday to Friday around the day', () => {
    // 2026-10-16 is a Friday.
    expect(habitPeriodDates(7, '2026-10-16')).toEqual([
      '2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16',
    ]);
    expect(habitPeriodStart(7, '2026-10-17')).toBe('2026-10-17');
  });

  it('month covers every day of the month, so tomorrow follows today', () => {
    const dates = habitPeriodDates(30, '2026-10-16');
    expect(dates).toHaveLength(31);
    expect(dates[0]).toBe('2026-10-01');
    expect(dates[dates.indexOf('2026-10-16') + 1]).toBe('2026-10-17');
    expect(habitPeriodDates(30, '2028-02-10')).toHaveLength(29);
  });

  it('two months end with the month of the day', () => {
    const dates = habitPeriodDates(60, '2026-10-16');
    expect(dates[0]).toBe('2026-09-01');
    expect(dates[dates.length - 1]).toBe('2026-10-31');
  });

  it('steps whole periods, across year ends', () => {
    expect(stepHabitPeriod(7, '2026-10-16', -1)).toBe('2026-10-03');
    expect(stepHabitPeriod(30, '2026-01-20', -1)).toBe('2025-12-01');
    expect(habitPeriodDates(60, stepHabitPeriod(60, '2026-10-16', -1))[0]).toBe('2026-07-01');
    expect(habitPeriodDates(60, stepHabitPeriod(60, '2026-10-16', 1))[0]).toBe('2026-11-01');
  });
});

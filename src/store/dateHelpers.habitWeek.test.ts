import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getHabitWeekStart, addDaysToDateString } from './dateHelpers';

describe('getHabitWeekStart', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the Saturday of the current week for a mid-week date', () => {
    vi.setSystemTime(new Date(2024, 0, 3)); // Wednesday, Jan 3
    expect(getHabitWeekStart()).toBe('2023-12-30'); // Previous Saturday
  });

  it('returns the previous Saturday when today is Sunday', () => {
    vi.setSystemTime(new Date(2024, 0, 7)); // Sunday, Jan 7
    expect(getHabitWeekStart()).toBe('2024-01-06'); // Previous Saturday
  });

  it('returns today when today is Saturday', () => {
    vi.setSystemTime(new Date(2024, 0, 6)); // Saturday, Jan 6
    expect(getHabitWeekStart()).toBe('2024-01-06');
  });

  it('returns the Saturday of the current week for Friday', () => {
    vi.setSystemTime(new Date(2024, 0, 5)); // Friday, Jan 5
    expect(getHabitWeekStart()).toBe('2023-12-30'); // Previous Saturday
  });

  it('handles month boundaries', () => {
    vi.setSystemTime(new Date(2024, 2, 1)); // Friday, March 1
    expect(getHabitWeekStart()).toBe('2024-02-24'); // Previous Saturday
  });

  it('handles year boundaries', () => {
    vi.setSystemTime(new Date(2024, 0, 1)); // Monday, Jan 1
    expect(getHabitWeekStart()).toBe('2023-12-30'); // Previous Saturday in 2023
  });

  it('returns a date in YYYY-MM-DD format', () => {
    vi.setSystemTime(new Date(2024, 5, 15));
    expect(getHabitWeekStart()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('works with a custom date parameter', () => {
    expect(getHabitWeekStart(new Date(2024, 0, 10))).toBe('2024-01-06');
  });
});

describe('addDaysToDateString', () => {
  it('adds positive days to a date string', () => {
    expect(addDaysToDateString('2024-01-15', 5)).toBe('2024-01-20');
  });

  it('adds negative days to a date string', () => {
    expect(addDaysToDateString('2024-01-15', -3)).toBe('2024-01-12');
  });

  it('handles month boundaries forward', () => {
    expect(addDaysToDateString('2024-01-30', 2)).toBe('2024-02-01');
  });

  it('handles month boundaries backward', () => {
    expect(addDaysToDateString('2024-03-01', -1)).toBe('2024-02-29');
  });

  it('handles year boundaries forward', () => {
    expect(addDaysToDateString('2024-12-31', 1)).toBe('2025-01-01');
  });

  it('handles year boundaries backward', () => {
    expect(addDaysToDateString('2024-01-01', -1)).toBe('2023-12-31');
  });

  it('handles leap year February', () => {
    expect(addDaysToDateString('2024-02-28', 1)).toBe('2024-02-29');
  });

  it('handles non-leap year February', () => {
    expect(addDaysToDateString('2023-02-28', 1)).toBe('2023-03-01');
  });

  it('returns zero when adding zero days', () => {
    expect(addDaysToDateString('2024-01-15', 0)).toBe('2024-01-15');
  });
});

import { describe, expect, it } from 'vitest';
import { countEligibleDays, computeHabitStats, computeStreaks, isScheduledOn } from './habitStats';
import type { Habit, HabitEntry } from '../types';

describe('countEligibleDays', () => {
  it('counts the full period when the habit started before it and today is after it', () => {
    expect(countEligibleDays('2026-01-01', '2026-02-01', '2026-02-28', '2026-03-01')).toBe(28);
  });

  it('clamps to the habit start date when it starts mid-period', () => {
    // Habit started 2026-02-10, period is all of February, today is in March.
    expect(countEligibleDays('2026-02-10', '2026-02-01', '2026-02-28', '2026-03-01')).toBe(19); // 10th..28th inclusive
  });

  it('clamps to today when the period extends into the future', () => {
    // Period is all of February, but today is only Feb 15 — future days don't count.
    expect(countEligibleDays('2026-01-01', '2026-02-01', '2026-02-28', '2026-02-15')).toBe(15);
  });

  it('returns 0 when the habit starts after the period ends', () => {
    expect(countEligibleDays('2026-03-01', '2026-02-01', '2026-02-28', '2026-03-15')).toBe(0);
  });

  it('returns 0 when today is before the period starts', () => {
    expect(countEligibleDays('2026-01-01', '2026-02-01', '2026-02-28', '2026-01-15')).toBe(0);
  });

  it('counts a single day (periodStart === periodEnd) as 1 when eligible', () => {
    expect(countEligibleDays('2026-01-01', '2026-02-10', '2026-02-10', '2026-02-10')).toBe(1);
  });
});

describe('computeHabitStats', () => {
  const habit: Habit = { id: 'h1', name: 'Read', icon: 'book', sortOrder: 0, active: true, startDate: '2026-02-10', scheduleDays: null };

  it('excludes entries before the habit start date from the completed count', () => {
    const entries: HabitEntry[] = [
      { id: 'e1', habitId: 'h1', date: '2026-02-05' }, // before start — shouldn't count
      { id: 'e2', habitId: 'h1', date: '2026-02-12' },
      { id: 'e3', habitId: 'h1', date: '2026-02-20' },
    ];
    const stats = computeHabitStats(habit, entries, '2026-02-01', '2026-02-28', '2026-03-01');
    expect(stats.goal).toBe(19);
    expect(stats.completed).toBe(2);
    expect(stats.left).toBe(17);
    expect(stats.percent).toBe(Math.round((2 / 19) * 100));
  });

  it('ignores entries belonging to other habits', () => {
    const entries: HabitEntry[] = [{ id: 'e1', habitId: 'other', date: '2026-02-12' }];
    const stats = computeHabitStats(habit, entries, '2026-02-01', '2026-02-28', '2026-03-01');
    expect(stats.completed).toBe(0);
  });

  it('returns 0 percent (not NaN) when the goal is 0', () => {
    const stats = computeHabitStats(habit, [], '2026-01-01', '2026-01-31', '2026-01-15');
    expect(stats.goal).toBe(0);
    expect(stats.completed).toBe(0);
    expect(stats.percent).toBe(0);
  });
});

describe('schedules', () => {
  // 2026-02-02 is a Monday.
  it('only counts scheduled weekdays toward the goal', () => {
    // Mon/Wed/Fri over Mon 2 .. Sun 8 Feb = 3 days
    expect(countEligibleDays('2026-01-01', '2026-02-02', '2026-02-08', '2026-03-01', [1, 3, 5])).toBe(3);
  });

  it('treats null and all-seven-days as every day', () => {
    expect(isScheduledOn(null, '2026-02-08')).toBe(true);
    expect(isScheduledOn([0, 1, 2, 3, 4, 5, 6], '2026-02-08')).toBe(true);
    expect(isScheduledOn([1], '2026-02-08')).toBe(false);
  });

  it('caps completed at the goal when bonus days are checked', () => {
    const habit: Habit = { id: 'h1', name: 'Gym', icon: 'dumbbell', sortOrder: 0, active: true, startDate: '2026-02-02', scheduleDays: [1] };
    const entries: HabitEntry[] = [
      { id: 'e1', habitId: 'h1', date: '2026-02-02' },
      { id: 'e2', habitId: 'h1', date: '2026-02-03' },
    ];
    const stats = computeHabitStats(habit, entries, '2026-02-02', '2026-02-08', '2026-03-01');
    expect(stats.goal).toBe(1);
    expect(stats.completed).toBe(1);
    expect(stats.percent).toBe(100);
  });
});

describe('computeStreaks', () => {
  const base: Habit = { id: 'h1', name: 'Read', icon: 'book', sortOrder: 0, active: true, startDate: '2026-02-01', scheduleDays: null };

  it('counts the current run and keeps it alive while today is still open', () => {
    const done = new Set(['2026-02-03', '2026-02-04', '2026-02-05']);
    expect(computeStreaks(base, done, '2026-02-06')).toEqual({ current: 3, best: 3 });
  });

  it('a missed scheduled day resets the current streak but not the best', () => {
    const done = new Set(['2026-02-01', '2026-02-02', '2026-02-03', '2026-02-05']);
    expect(computeStreaks(base, done, '2026-02-06')).toEqual({ current: 1, best: 3 });
  });

  it('unscheduled days do not break a streak', () => {
    const habit = { ...base, scheduleDays: [1, 3] }; // Mon, Wed
    const done = new Set(['2026-02-02', '2026-02-04', '2026-02-09']);
    expect(computeStreaks(habit, done, '2026-02-10')).toEqual({ current: 3, best: 3 });
  });
});

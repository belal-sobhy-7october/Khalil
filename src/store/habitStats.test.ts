import { describe, expect, it } from 'vitest';
import { countEligibleDays, computeHabitStats } from './habitStats';
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
  const habit: Habit = { id: 'h1', name: 'Read', icon: 'book', sortOrder: 0, active: true, startDate: '2026-02-10' };

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

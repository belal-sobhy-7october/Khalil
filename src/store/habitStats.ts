import type { Habit, HabitEntry } from '../types';
import { daysBetweenDateStrings } from './dateHelpers';

// Inclusive count of days within [max(startDate, periodStart), min(periodEnd, today)].
// This is the single source of truth for "how many days count toward a habit's goal" —
// every stat/chart in HabitsTracker.tsx must go through this (or computeHabitStats) so
// they can't disagree with each other.
export function countEligibleDays(
  startDate: string,
  periodStart: string,
  periodEnd: string,
  today: string
): number {
  const lo = startDate > periodStart ? startDate : periodStart;
  const hi = periodEnd < today ? periodEnd : today;
  if (lo > hi) return 0;
  return daysBetweenDateStrings(lo, hi) + 1;
}

export interface HabitStats {
  completed: number;
  goal: number;
  left: number;
  percent: number;
}

export function computeHabitStats(
  habit: Habit,
  entries: HabitEntry[],
  periodStart: string,
  periodEnd: string,
  today: string
): HabitStats {
  const goal = countEligibleDays(habit.startDate, periodStart, periodEnd, today);
  const lo = habit.startDate > periodStart ? habit.startDate : periodStart;
  const hi = periodEnd < today ? periodEnd : today;
  const completed = entries.filter(
    (e) => e.habitId === habit.id && e.date >= lo && e.date <= hi
  ).length;
  const left = Math.max(goal - completed, 0);
  const percent = goal > 0 ? Math.round((completed / goal) * 100) : 0;
  return { completed, goal, left, percent };
}

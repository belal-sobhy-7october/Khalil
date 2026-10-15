import type { Habit, HabitEntry } from '../types';
import { addDaysToDateString } from './dateHelpers';

// Weekday (0 = Sunday … 6 = Saturday) of a YYYY-MM-DD string, timezone-safe.
export function weekdayOf(date: string): number {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

// A habit with no schedule (or an empty one) is due every day.
export function isScheduledOn(scheduleDays: number[] | null | undefined, date: string): boolean {
  if (!scheduleDays || scheduleDays.length === 0 || scheduleDays.length === 7) return true;
  return scheduleDays.includes(weekdayOf(date));
}

// Count of scheduled days within [max(startDate, periodStart), min(periodEnd, today)].
// This is the single source of truth for "how many days count toward a habit's goal" —
// every stat/chart in HabitsTracker.tsx must go through this (or computeHabitStats) so
// they can't disagree with each other.
export function countEligibleDays(
  startDate: string,
  periodStart: string,
  periodEnd: string,
  today: string,
  scheduleDays?: number[] | null
): number {
  const lo = startDate > periodStart ? startDate : periodStart;
  const hi = periodEnd < today ? periodEnd : today;
  if (lo > hi) return 0;
  let count = 0;
  for (let d = lo; d <= hi; d = addDaysToDateString(d, 1)) {
    if (isScheduledOn(scheduleDays, d)) count++;
  }
  return count;
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
  const goal = countEligibleDays(habit.startDate, periodStart, periodEnd, today, habit.scheduleDays);
  const lo = habit.startDate > periodStart ? habit.startDate : periodStart;
  const hi = periodEnd < today ? periodEnd : today;
  // A check on an unscheduled day is a bonus: it can fill a gap but never
  // pushes the habit past 100%.
  const completed = Math.min(
    entries.filter((e) => e.habitId === habit.id && e.date >= lo && e.date <= hi).length,
    goal
  );
  const left = Math.max(goal - completed, 0);
  const percent = goal > 0 ? Math.round((completed / goal) * 100) : 0;
  return { completed, goal, left, percent };
}

export interface HabitStreaks {
  current: number;
  best: number;
}

// Streaks count consecutive *scheduled* days that were done; unscheduled days
// neither break nor extend a streak. Today not done yet doesn't break the
// current streak (the day isn't over), the same rule Loop / Streaks use.
export function computeStreaks(habit: Habit, doneDates: Set<string>, today: string): HabitStreaks {
  if (habit.startDate > today) return { current: 0, best: 0 };
  let best = 0;
  let run = 0;
  for (let d = habit.startDate; d <= today; d = addDaysToDateString(d, 1)) {
    const done = doneDates.has(d);
    if (done) {
      run++;
    } else if (isScheduledOn(habit.scheduleDays, d) && d !== today) {
      run = 0;
    }
    if (run > best) best = run;
  }
  return { current: run, best };
}

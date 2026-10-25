/**
 * Pure calculations behind the Analytics page. Every series is one value per
 * day over the same date range, so all charts and stats agree.
 */
import type { DailyTodo, Habit, HabitEntry, VocabularyItem } from '../types';
import { isScheduledOn } from '../store/habitStats';
import { addDaysToDateString, daysBetweenDateStrings } from '../store/dateHelpers';
import type { PomodoroSession } from '../store/pomodoroStore';
import { localDay } from './focusStats';
import { PRAYERS, jamaahCount, wirdScore, type WirdDay, type WirdItem } from './wird';
import type { PracticeLog } from './englishPractice';

export interface DayPoint {
  date: string;
  value: number | null; // null = no data that day (e.g. no habit was due)
}

export function dateRange(from: string, to: string): string[] {
  const n = daysBetweenDateStrings(from, to) + 1;
  return Array.from({ length: Math.max(0, n) }, (_, i) => addDaysToDateString(from, i));
}

/** % of due habits done each day (unscheduled days and pre-start days don't count). */
export function habitSeries(dates: string[], habits: Habit[], entries: HabitEntry[]): DayPoint[] {
  const done = new Set(entries.map((e) => `${e.habitId}|${e.date}`));
  const active = habits.filter((h) => h.active);
  return dates.map((date) => {
    const due = active.filter((h) => h.startDate <= date && isScheduledOn(h.scheduleDays, date));
    if (due.length === 0) return { date, value: null };
    const n = due.filter((h) => done.has(`${h.id}|${date}`)).length;
    return { date, value: Math.round((n / due.length) * 100) };
  });
}

export function habitBreakdown(dates: string[], habits: Habit[], entries: HabitEntry[]) {
  const done = new Set(entries.map((e) => `${e.habitId}|${e.date}`));
  return habits
    .filter((h) => h.active)
    .map((h) => {
      const due = dates.filter((d) => d >= h.startDate && isScheduledOn(h.scheduleDays, d));
      const n = due.filter((d) => done.has(`${h.id}|${d}`)).length;
      return { id: h.id, name: h.name, done: n, due: due.length, percent: due.length ? Math.round((n / due.length) * 100) : 0 };
    })
    .filter((h) => h.due > 0)
    .sort((a, b) => b.percent - a.percent);
}

export function taskSeries(dates: string[], todos: DailyTodo[]): { done: DayPoint[]; total: DayPoint[] } {
  const byDate = new Map<string, { done: number; total: number }>();
  for (const t of todos) {
    const cur = byDate.get(t.date) ?? { done: 0, total: 0 };
    byDate.set(t.date, { done: cur.done + (t.completed ? 1 : 0), total: cur.total + 1 });
  }
  return {
    done: dates.map((date) => ({ date, value: byDate.get(date)?.done ?? 0 })),
    total: dates.map((date) => ({ date, value: byDate.get(date)?.total ?? 0 })),
  };
}

export function focusSeries(dates: string[], sessions: PomodoroSession[]): DayPoint[] {
  const byDay = new Map<string, number>();
  for (const s of sessions) {
    const d = localDay(s.endedAt);
    byDay.set(d, (byDay.get(d) ?? 0) + s.minutes);
  }
  return dates.map((date) => ({ date, value: byDay.get(date) ?? 0 }));
}

export function wirdSeries(dates: string[], days: Record<string, WirdDay>, items?: WirdItem[]): DayPoint[] {
  return dates.map((date) => ({ date, value: days[date] ? wirdScore(days[date], items) : 0 }));
}

export function englishSeries(dates: string[], log: PracticeLog, items: VocabularyItem[]): { minutes: DayPoint[]; words: DayPoint[] } {
  const added = new Map<string, number>();
  for (const i of items) {
    if (!i.createdAt) continue;
    const d = localDay(i.createdAt);
    added.set(d, (added.get(d) ?? 0) + 1);
  }
  return {
    minutes: dates.map((date) => ({ date, value: Object.values(log[date] ?? {}).reduce((a, b) => a + (b ?? 0), 0) })),
    words: dates.map((date) => ({ date, value: added.get(date) ?? 0 })),
  };
}

export const sum = (s: DayPoint[]) => s.reduce((n, p) => n + (p.value ?? 0), 0);
export function average(s: DayPoint[]): number | null {
  const vals = s.map((p) => p.value).filter((v): v is number => v !== null);
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
}

/** Signed % change from previous to current; null when there's no baseline. */
export function deltaPercent(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * One 0–100 "how was the day" score: the average of whichever parts had
 * data that day (habits %, wird score, focus vs goal, any task completion).
 */
export function dayScores(
  dates: string[],
  parts: { habits: DayPoint[]; wird: DayPoint[]; focus: DayPoint[]; focusGoalMinutes: number; tasksDone: DayPoint[]; tasksTotal: DayPoint[] }
): DayPoint[] {
  return dates.map((date, i) => {
    const vals: number[] = [];
    const h = parts.habits[i]?.value;
    if (h !== null && h !== undefined) vals.push(h);
    const w = parts.wird[i]?.value ?? 0;
    if (w > 0) vals.push(w);
    const f = parts.focus[i]?.value ?? 0;
    if (f > 0) vals.push(Math.min(100, Math.round((f / Math.max(1, parts.focusGoalMinutes)) * 100)));
    const total = parts.tasksTotal[i]?.value ?? 0;
    if (total > 0) vals.push(Math.round(((parts.tasksDone[i]?.value ?? 0) / total) * 100));
    return { date, value: vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null };
  });
}

/** Weekday (0 = Sunday) with the highest average, given at least 2 samples of it. */
export function bestWeekday(series: DayPoint[]): { weekday: number; average: number } | null {
  const acc = new Map<number, number[]>();
  for (const p of series) {
    if (p.value === null || p.value === 0) continue;
    const [y, m, d] = p.date.split('-').map(Number);
    const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    acc.set(wd, [...(acc.get(wd) ?? []), p.value]);
  }
  let best: { weekday: number; average: number } | null = null;
  for (const [weekday, vals] of acc) {
    if (vals.length < 2) continue;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (!best || avg > best.average) best = { weekday, average: Math.round(avg) };
  }
  return best;
}

/** Prayer most often missed in congregation over the range (only counting days with any wird data). */
export function weakestPrayer(dates: string[], days: Record<string, WirdDay>) {
  const tracked = dates.filter((d) => days[d] && jamaahCount(days[d]) + Object.keys(days[d].prayers ?? {}).length > 0);
  if (tracked.length < 3) return null;
  let worst: { prayer: (typeof PRAYERS)[number]; rate: number } | null = null;
  for (const p of PRAYERS) {
    const rate = tracked.filter((d) => days[d].prayers?.[p] === 'jamaah').length / tracked.length;
    if (!worst || rate < worst.rate) worst = { prayer: p, rate };
  }
  return worst ? { prayer: worst.prayer, percent: Math.round(worst.rate * 100) } : null;
}

import type { PomodoroSession } from '../store/pomodoroStore';
import { addDaysToDateString, getToday } from '../store/dateHelpers';

/** Local YYYY-MM-DD of an ISO timestamp. */
export function localDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function minutesByDay(sessions: PomodoroSession[]): Map<string, { minutes: number; count: number }> {
  const map = new Map<string, { minutes: number; count: number }>();
  for (const s of sessions) {
    const day = localDay(s.endedAt);
    const cur = map.get(day) ?? { minutes: 0, count: 0 };
    map.set(day, { minutes: cur.minutes + s.minutes, count: cur.count + 1 });
  }
  return map;
}

/** Consecutive days with at least one session, ending today (or yesterday if today is still empty). */
export function focusStreak(byDay: Map<string, unknown>, today = getToday()): number {
  let day = byDay.has(today) ? today : addDaysToDateString(today, -1);
  let streak = 0;
  while (byDay.has(day)) {
    streak++;
    day = addDaysToDateString(day, -1);
  }
  return streak;
}

export function lastNDays(n: number, today = getToday()): string[] {
  return Array.from({ length: n }, (_, i) => addDaysToDateString(today, i - (n - 1)));
}

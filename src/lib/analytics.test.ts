import { describe, expect, it } from 'vitest';
import type { Habit, HabitEntry, DailyTodo } from '../types';
import { bestWeekday, dateRange, dayScores, deltaPercent, focusSeries, habitBreakdown, habitSeries, taskSeries, weakestPrayer } from './analytics';
import { EMPTY_DAY } from './wird';

const habit = (id: string, startDate: string, scheduleDays: number[] | null = null): Habit => ({ id, name: id, icon: 'star', sortOrder: 0, active: true, startDate, scheduleDays });

describe('analytics', () => {
  const dates = dateRange('2026-10-12', '2026-10-15'); // Mon..Thu

  it('dateRange is inclusive', () => {
    expect(dates).toEqual(['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15']);
  });

  it('habitSeries ignores habits not yet started or not scheduled, and is null when nothing is due', () => {
    const habits = [habit('a', '2026-10-12'), habit('b', '2026-10-14'), habit('gym', '2026-10-01', [1])];
    const entries: HabitEntry[] = [
      { id: '1', habitId: 'a', date: '2026-10-12' },
      { id: '2', habitId: 'gym', date: '2026-10-12' },
      { id: '3', habitId: 'b', date: '2026-10-14' },
    ];
    expect(habitSeries(dates, habits, entries).map((p) => p.value)).toEqual([100, 0, 50, 0]);
    expect(habitSeries(dates, [habit('x', '2026-11-01')], []).every((p) => p.value === null)).toBe(true);
    expect(habitBreakdown(dates, habits, entries)[0]).toMatchObject({ id: 'gym', done: 1, due: 1, percent: 100 });
  });

  it('taskSeries counts done and total per day', () => {
    const todos = [
      { id: '1', date: '2026-10-12', completed: true },
      { id: '2', date: '2026-10-12', completed: false },
    ] as DailyTodo[];
    const s = taskSeries(dates, todos);
    expect(s.done[0].value).toBe(1);
    expect(s.total[0].value).toBe(2);
  });

  it('focusSeries sums minutes by the local day the session ended', () => {
    const sessions = [
      { id: '1', startedAt: '2026-10-13T08:00:00', endedAt: '2026-10-13T08:25:00', minutes: 25, label: null },
      { id: '2', startedAt: '2026-10-13T09:00:00', endedAt: '2026-10-13T09:25:00', minutes: 25, label: null },
    ];
    expect(focusSeries(dates, sessions).map((p) => p.value)).toEqual([0, 50, 0, 0]);
  });

  it('dayScores averages only what was tracked that day', () => {
    const n = (v: Array<number | null>) => v.map((value, i) => ({ date: dates[i], value }));
    const s = dayScores(dates, {
      habits: n([100, null, null, null]),
      wird: n([0, 60, 0, 0]),
      focus: n([0, 0, 100, 0]),
      focusGoalMinutes: 200,
      tasksDone: n([0, 0, 0, 1]),
      tasksTotal: n([0, 0, 0, 2]),
    });
    expect(s.map((p) => p.value)).toEqual([100, 60, 50, 50]);
  });

  it('deltaPercent and bestWeekday', () => {
    expect(deltaPercent(150, 100)).toBe(50);
    expect(deltaPercent(10, 0)).toBeNull();
    const series = [
      { date: '2026-10-05', value: 30 }, { date: '2026-10-12', value: 50 }, // Mondays
      { date: '2026-10-06', value: 90 }, { date: '2026-10-13', value: 70 }, // Tuesdays
      { date: '2026-10-07', value: 200 }, // single Wednesday — not enough samples
    ];
    expect(bestWeekday(series)).toEqual({ weekday: 2, average: 80 });
  });

  it('weakestPrayer finds the prayer most often missed in congregation', () => {
    const days = Object.fromEntries(
      dates.map((d) => [d, { ...EMPTY_DAY, prayers: { fajr: 'alone', dhuhr: 'jamaah', asr: 'jamaah', maghrib: 'jamaah', isha: 'jamaah' } }])
    );
    expect(weakestPrayer(dates, days as never)).toEqual({ prayer: 'fajr', percent: 0 });
  });
});

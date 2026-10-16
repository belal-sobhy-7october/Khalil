import { addDaysToDateString, addMonthsToDateString, getHabitWeekStart } from './dateHelpers';

/**
 * The habits grid shows whole calendar periods, so today sits among the days
 * around it (upcoming days included, greyed out) instead of always being the
 * last column: 7 = the Saturday–Friday week, 30 = the month, 60 = the month
 * and the one before it.
 */
export type HabitRange = 7 | 30 | 60;

const monthStart = (date: string) => `${date.slice(0, 7)}-01`;

export function habitPeriodStart(range: HabitRange, anchor: string): string {
  if (range === 7) return getHabitWeekStart(new Date(`${anchor}T00:00:00`));
  return range === 30 ? monthStart(anchor) : addMonthsToDateString(monthStart(anchor), -1);
}

/** Every day of the period containing `anchor`, oldest first. */
export function habitPeriodDates(range: HabitRange, anchor: string): string[] {
  const start = habitPeriodStart(range, anchor);
  const end =
    range === 7 ? addDaysToDateString(start, 6) : addDaysToDateString(addMonthsToDateString(start, range === 30 ? 1 : 2), -1);
  const dates: string[] = [];
  for (let d = start; d <= end; d = addDaysToDateString(d, 1)) dates.push(d);
  return dates;
}

/** An anchor inside the previous (-1) or next (1) period. */
export function stepHabitPeriod(range: HabitRange, anchor: string, direction: -1 | 1): string {
  if (range === 7) return addDaysToDateString(habitPeriodStart(7, anchor), 7 * direction);
  return addMonthsToDateString(monthStart(anchor), (range === 30 ? 1 : 2) * direction);
}

/**
 * The days to show for a period. Days before the first habit started could
 * only ever be empty, so when the period begins earlier the window starts at
 * the first habit instead and keeps the period's length — the extra days come
 * after today. That way "month" and "2 months" still differ for new habits.
 */
export function visibleHabitDates(range: HabitRange, anchor: string, firstStart: string | null): string[] {
  const dates = habitPeriodDates(range, anchor);
  if (!firstStart || firstStart <= dates[0] || firstStart > dates[dates.length - 1]) return dates;
  return dates.map((_, i) => addDaysToDateString(firstStart, i));
}

/** Whether an earlier period has any day on or after the first habit's start. */
export function canStepBack(range: HabitRange, anchor: string, firstStart: string | null): boolean {
  return !firstStart || habitPeriodStart(range, anchor) > firstStart;
}

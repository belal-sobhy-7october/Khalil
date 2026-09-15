import type { CalendarViewMode } from '../types';

export function getToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getWeekStart(dateStr: string = getToday()): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  const dow = d.getDay();
  const diff = d.getDate() - dow + (dow === 0 ? -6 : 1);
  const monday = new Date(d.getFullYear(), d.getMonth(), diff);
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, '0');
  const dayStr = String(monday.getDate()).padStart(2, '0');
  return `${y}-${m}-${dayStr}`;
}

// Habits week runs Saturday -> Friday. Returns the Saturday on/before `d` (defaults to today), YYYY-MM-DD.
export function getHabitWeekStart(d: Date = new Date()): string {
  const day = d.getDay();
  const offset = (day + 1) % 7; // Days to go back to reach Saturday (0 for Saturday, 1 for Sunday, etc.)
  const diff = d.getDate() - offset;
  const saturday = new Date(d.getFullYear(), d.getMonth(), diff);
  const y = saturday.getFullYear();
  const m = String(saturday.getMonth() + 1).padStart(2, '0');
  const dayStr = String(saturday.getDate()).padStart(2, '0');
  return `${y}-${m}-${dayStr}`;
}

export function addDaysToDateString(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const dayStr = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${dayStr}`;
}

// Adds whole months (or years, via a multiple of 12), clamping the day when the
// target month is shorter (e.g. Jan 31 + 1 month -> Feb 28/29, not Mar 2/3).
export function addMonthsToDateString(dateStr: string, months: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const targetMonthIndex = month - 1 + months;
  const daysInTargetMonth = new Date(year, targetMonthIndex + 1, 0).getDate();
  const clampedDay = Math.min(day, daysInTargetMonth);
  const date = new Date(year, targetMonthIndex, clampedDay);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const dayStr = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${dayStr}`;
}

// Pure stepping logic shared by navigatePrevious/navigateNext: moves `date` one
// unit of `viewMode` in `direction` (-1 or 1), all in local-date arithmetic.
export function stepCalendarDate(
  date: string,
  viewMode: CalendarViewMode,
  direction: -1 | 1
): string {
  switch (viewMode) {
    case 'day':
      return addDaysToDateString(date, direction * 1);
    case 'week':
    case 'multi-week':
    case 'agenda':
      return addDaysToDateString(date, direction * 7);
    case 'multi-day':
      return addDaysToDateString(date, direction * 3);
    case 'month':
      return addMonthsToDateString(date, direction * 1);
    case 'year':
      return addMonthsToDateString(date, direction * 12);
    default:
      return date;
  }
}

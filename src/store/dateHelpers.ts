export function getToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
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

export type Language = 'en' | 'ar';

export type Priority = 'high' | 'medium' | 'low';

export interface DailyFocus {
  text: string;
  date: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
  sortOrder: number;
  gate: 'daily' | 'weekly' | 'backlog';
  updatedAt: number;
}

export interface DailyTodo extends TodoItem {
  date: string;
  rolloverCount: number;
  gate: 'daily';
}

export interface WeeklyTodo extends TodoItem {
  weekStart: string;
  rolloverCount: number;
  gate: 'weekly';
}

export interface BacklogTodo extends TodoItem {
  gate: 'backlog';
}

export interface BookmarkCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  categoryId: string;
  description: string;
  note: string;
}

export type SubTrackType = 'counter' | 'percentage' | 'habit';

export interface LifeCategory {
  id: string;
  name: string;
  nameKey: string;
  icon: string;
  color: string;
  sortOrder: number;
}

export interface SubTrack {
  id: string;
  categoryId: string;
  name: string;
  nameKey: string;
  icon: string;
  progressType: SubTrackType;
  target: number;
  unit: string;
  currentValue: number;
  sortOrder: number;
}

export interface SubTrackEntry {
  id: string;
  trackId: string;
  value: number;
  date: string;
  note: string;
}

export interface StickyNoteData {
  id: string;
  title: string;
  text: string;
  sortOrder: number;
}

export interface TodoItemData {
  id: string;
  text: string;
  done: boolean;
}

export interface TodoNoteData {
  id: string;
  title: string;
  items: TodoItemData[];
  sortOrder: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
  active: boolean;
  startDate: string; // YYYY-MM-DD
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
}

export interface DailyMood {
  date: string;
  mood: number | null;
  motivation: number | null;
}

export type CalendarViewMode = 'day' | 'week' | 'month' | 'agenda' | 'multi-day' | 'multi-week' | 'year';

export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  allDay: boolean;
  completed: boolean;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface CalendarState {
  currentDate: string; // The date currently being viewed (YYYY-MM-DD)
  viewMode: CalendarViewMode;
  showOnboarding: boolean;
}

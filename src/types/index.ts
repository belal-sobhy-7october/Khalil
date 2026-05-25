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
}

export interface DailyTodo extends TodoItem {
  date: string;
}

export interface WeeklyTodo extends TodoItem {
  weekStart: string;
}

export interface BacklogTodo extends TodoItem {}

export interface BookmarkCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  categoryId: string;
  description: string;
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

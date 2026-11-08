/**
 * Settings of the Tasks & Habits page, saved per user in `user_kv` (so the
 * phone and the laptop agree) and on the device.
 */
import { createKvStore } from './kvStore';

/** What a finished task does: stay, sink to the bottom, or hide (now, the next day, or after 24 hours). */
export type CompletedRule = 'stay' | 'bottom' | 'hideNow' | 'nextDay' | 'after24h';
export const COMPLETED_RULES: CompletedRule[] = ['stay', 'bottom', 'hideNow', 'nextDay', 'after24h'];

/** The parts of the Tasks & Habits page, which can be reordered and hidden. */
export type PageSectionId = 'focus' | 'tasks' | 'wird' | 'habits' | 'backlog';
export const PAGE_SECTIONS: PageSectionId[] = ['focus', 'tasks', 'wird', 'habits', 'backlog'];

export interface TasksSettings {
  /** The page Khalil opens on: Tasks & Habits, or the last page visited. */
  startup: 'tasks' | 'last';
  completed: CompletedRule;
  /** The page's parts in order; `hidden` ones aren't shown. */
  sections: Array<{ id: PageSectionId; hidden?: boolean }>;
  /** Today's tasks also list the wird items marked "in today's tasks". */
  todayWird: boolean;
  /** Today's tasks also list the habits due today. */
  todayHabits: boolean;
  /** Where today's wird items and habits sit in today's tasks: above or below the tasks. */
  recurringPosition: 'top' | 'bottom';
  /** Wird and habit rows in today's tasks once done: stay (ticked) or hide. */
  doneRecurring: 'stay' | 'hide';
  /** What ticking a prayer in today's tasks records. */
  prayerTick: 'jamaah' | 'alone';
}

export const DEFAULT_TASKS_SETTINGS: TasksSettings = {
  startup: 'tasks',
  completed: 'nextDay',
  sections: PAGE_SECTIONS.map((id) => ({ id })),
  todayWird: true,
  todayHabits: true,
  recurringPosition: 'top',
  doneRecurring: 'stay',
  prayerTick: 'jamaah',
};

export const TASKS_SETTINGS_KEY = 'tasks-settings';

/** Fills in what an older or partial copy is missing, and drops what's unknown. */
export function normalizeTasksSettings(stored: unknown): TasksSettings {
  const v = (stored && typeof stored === 'object' ? stored : {}) as Partial<TasksSettings>;
  const d = DEFAULT_TASKS_SETTINGS;
  const known = (Array.isArray(v.sections) ? v.sections : []).filter(
    (s, i, all) => s && PAGE_SECTIONS.includes(s.id) && all.findIndex((o) => o?.id === s.id) === i
  );
  const sections = [...known.map((s) => ({ id: s.id, ...(s.hidden ? { hidden: true } : {}) })), ...PAGE_SECTIONS.filter((id) => !known.some((s) => s.id === id)).map((id) => ({ id }))];
  return {
    startup: v.startup === 'last' ? 'last' : d.startup,
    completed: COMPLETED_RULES.includes(v.completed as CompletedRule) ? (v.completed as CompletedRule) : d.completed,
    sections,
    todayWird: typeof v.todayWird === 'boolean' ? v.todayWird : d.todayWird,
    todayHabits: typeof v.todayHabits === 'boolean' ? v.todayHabits : d.todayHabits,
    recurringPosition: v.recurringPosition === 'bottom' ? 'bottom' : d.recurringPosition,
    doneRecurring: v.doneRecurring === 'hide' ? 'hide' : d.doneRecurring,
    prayerTick: v.prayerTick === 'alone' ? 'alone' : d.prayerTick,
  };
}

const store = createKvStore(TASKS_SETTINGS_KEY, normalizeTasksSettings);

export const useTasksSettings = store.useValue;
/** The settings outside React (e.g. while the app starts). */
export const getTasksSettings = store.get;
export const setTasksSettings = store.set;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Local date (YYYY-MM-DD) of a time in ms. */
function localDate(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Splits a list of tasks into the ones to show (in display order) and the
 * finished ones the rule hides. A task's `updatedAt` is when it was ticked.
 */
export function arrangeTasks<T extends { completed: boolean; updatedAt: number }>(
  tasks: T[],
  rule: CompletedRule,
  now: number = Date.now()
): { shown: T[]; hidden: T[] } {
  const isHidden = (t: T) => {
    if (!t.completed) return false;
    if (rule === 'hideNow') return true;
    if (rule === 'nextDay') return localDate(t.updatedAt) < localDate(now);
    if (rule === 'after24h') return now - t.updatedAt >= DAY_MS;
    return false;
  };
  const shown = tasks.filter((t) => !isHidden(t));
  const hidden = tasks.filter(isHidden);
  if (rule === 'bottom') return { shown: [...shown.filter((t) => !t.completed), ...shown.filter((t) => t.completed)], hidden };
  return { shown, hidden };
}

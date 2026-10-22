/**
 * Sales Prep progress. Everything is a per-user `user_kv` value (mirrored to
 * localStorage, so it works offline).
 */
import { PLAN_DAYS } from '../../data/sales/plan';
import { READING_ORDER } from '../../data/sales/knowledge';
import type { SalesDay, SalesLevel, SalesWeek } from '../../data/sales/types';

export { setTasks, studyStreak, type TaskLog } from '../callCenter/progress';
import type { TaskLog } from '../callCenter/progress';

export const SALES_TASKS_KEY = 'sales-tasks';
export const SALES_TESTS_KEY = 'sales-tests';
/** Everything typed: notebook lines, answers to listening questions, drills, mission notes. */
export const SALES_NOTES_KEY = 'sales-notes';
export const SALES_CALLS_KEY = 'sales-calls';
/** Knowledge chapters read: chapter id → the date. */
export const SALES_KNOWLEDGE_KEY = 'sales-knowledge';

/** chapter id → the local date (YYYY-MM-DD) it was read. */
export type ReadLog = Record<string, string>;

export interface QuizAttempt {
  date: string;
  /** 0–100. */
  percent: number;
  passed: boolean;
  /** The questions missed, with the right answer, to review before the exam. */
  missed: Array<{ q: string; right: string }>;
}

/** quiz id → its attempts, oldest first (the last 20). */
export type QuizLog = Record<string, QuizAttempt[]>;

export interface Note {
  text: string;
  updatedAt: string;
}

/** key (a task id, or `<task id>#<n>`) → what you wrote. */
export type NoteLog = Record<string, Note>;

/** A role-play scored with its checklist. */
export interface RoleplayScore {
  id: string;
  date: string;
  roleplayId: string;
  percent: number;
}

const taskMinutes = new Map(PLAN_DAYS.flatMap(({ day }) => day.tasks.map((t) => [t.id, t.minutes] as const)));

export const dayDone = (day: SalesDay, log: TaskLog) => day.tasks.every((t) => !!log[t.id]);

export const dayRatio = (day: SalesDay, log: TaskLog) => (day.tasks.length ? day.tasks.filter((t) => log[t.id]).length / day.tasks.length : 0);

/** Index in PLAN_DAYS of the first day that isn't finished (the last ready one when all are). */
export function currentDayIndex(log: TaskLog): number {
  const i = PLAN_DAYS.findIndex(({ day, level }) => level.status === 'ready' && !dayDone(day, log));
  if (i >= 0) return i;
  return PLAN_DAYS.reduce((last, d, index) => (d.level.status === 'ready' ? index : last), 0);
}

function ratioOf(days: SalesDay[], log: TaskLog) {
  const ids = days.flatMap((d) => d.tasks.map((t) => t.id));
  const done = ids.filter((id) => log[id]).length;
  return { done, total: ids.length, ratio: ids.length ? done / ids.length : 0 };
}

export const weekProgress = (week: SalesWeek, log: TaskLog) => ratioOf(week.days, log);
export const levelDays = (level: SalesLevel): SalesDay[] => [...level.weeks.flatMap((w) => w.days), ...level.extraDays];
export const levelProgress = (level: SalesLevel, log: TaskLog) => ratioOf(levelDays(level), log);

export function planProgress(levels: SalesLevel[], log: TaskLog) {
  return ratioOf(levels.filter((l) => l.status === 'ready').flatMap(levelDays), log);
}

/** Study days still to do in the ready levels. */
export const daysLeft = (log: TaskLog) => PLAN_DAYS.filter(({ day, level }) => level.status === 'ready' && !dayDone(day, log)).length;

/** Study days finished. */
export const daysDone = (log: TaskLog) => PLAN_DAYS.filter(({ day, level }) => level.status === 'ready' && dayDone(day, log)).length;

/** Estimated minutes studied on a date, from the tasks ticked off that day. */
export function minutesOn(date: string, log: TaskLog): number {
  let total = 0;
  for (const [id, d] of Object.entries(log)) if (d === date) total += taskMinutes.get(id) ?? 0;
  return total;
}

export const bestAttempt = (attempts: QuizAttempt[] | undefined): QuizAttempt | null =>
  attempts?.length ? attempts.reduce((best, a) => (a.percent > best.percent ? a : best)) : null;

export const passedQuiz = (log: QuizLog, id: string) => !!log[id]?.some((a) => a.passed);

export const addAttempt = (log: QuizLog, id: string, attempt: QuizAttempt): QuizLog => ({ ...log, [id]: [...(log[id] ?? []), attempt].slice(-20) });

export const bestRoleplay = (scores: RoleplayScore[], roleplayId: string) =>
  scores.filter((s) => s.roleplayId === roleplayId).reduce<number | null>((best, s) => (best === null || s.percent > best ? s.percent : best), null);

/** How many notebook lines (journal tasks) have something written. */
export const journalCount = (notes: NoteLog) => Object.keys(notes).filter((k) => k.includes(':journal:') && notes[k].text.trim()).length;

/**
 * Today's knowledge chapter: the one read today (one a day keeps the focus on
 * today), or else the next unread one in READING_ORDER; null once all are read.
 */
export function todaysChapter(read: ReadLog, today: string): { id: string; done: boolean } | null {
  const readToday = READING_ORDER.filter((id) => read[id] === today);
  if (readToday.length) return { id: readToday[readToday.length - 1], done: true };
  const next = READING_ORDER.find((id) => !read[id]);
  return next ? { id: next, done: false } : null;
}

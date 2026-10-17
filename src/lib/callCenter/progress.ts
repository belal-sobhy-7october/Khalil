/**
 * Call Center Prep progress. Everything is a per-user `user_kv` value (mirrored
 * to localStorage, so it works offline); recordings stay on the device
 * (./recordings.ts).
 */
import { PLAN_DAYS } from '../../data/callCenter/plan';
import type { PlanDay, PlanLevel, PlanWeek, Skill } from '../../data/callCenter/types';
import type { StageId } from '../../data/callCenter/resources';
import { addDaysToDateString } from '../../store/dateHelpers';

export const CC_TASKS_KEY = 'callcenter-tasks';
export const CC_TESTS_KEY = 'callcenter-tests';
export const CC_TYPING_KEY = 'callcenter-typing';
export const CC_ANSWERS_KEY = 'callcenter-answers';
export const CC_APPLICATIONS_KEY = 'callcenter-applications';
export const CC_MISTAKES_KEY = 'callcenter-mistakes';
export const CC_CALLS_KEY = 'callcenter-calls';
export const CC_VOICE_KEY = 'callcenter-voice';
export const CC_SETTINGS_KEY = 'callcenter-settings';

/** task id → the local date (YYYY-MM-DD) it was done. */
export type TaskLog = Record<string, string>;

export interface SkillScore {
  got: number;
  total: number;
}

export interface TestAttempt {
  date: string;
  /** 0–100. */
  percent: number;
  passed: boolean;
  skills: Partial<Record<Skill, SkillScore>>;
}

/** test id → its attempts, oldest first. */
export type TestLog = Record<string, TestAttempt[]>;

export interface TypingResult {
  date: string;
  textId: string;
  wpm: number;
  /** 0–100. */
  accuracy: number;
}

export interface MyAnswer {
  text: string;
  updatedAt: string;
}

export type ApplicationStatus = 'waiting' | 'rejected' | 'offer' | 'hired';

export interface Application {
  id: string;
  company: string;
  account: string;
  date: string;
  /** The furthest stage reached (or where it stopped). */
  stage: StageId;
  status: ApplicationStatus;
  notes: string;
}

export interface Mistake {
  id: string;
  date: string;
  wrong: string;
  right: string;
  note?: string;
}

/** A role-play scored with the QA rubric. */
export interface CallScore {
  id: string;
  date: string;
  scenarioId: string;
  percent: number;
}

/** What's kept in the account about a recording (the audio stays on the device). */
export interface VoiceStat {
  id: string;
  date: string;
  promptId: string;
  seconds: number;
  longPauses: number;
  wpm?: number;
  /** Self-rating, 1–5. */
  rating?: number;
}

export interface CallCenterSettings {
  efset: Array<{ date: string; score: number }>;
}

export const EMPTY_SETTINGS: CallCenterSettings = { efset: [] };

// ── The plan ───────────────────────────────────────────────────────────

const taskMinutes = new Map(PLAN_DAYS.flatMap(({ day }) => day.tasks.map((t) => [t.id, t.minutes] as const)));

export const dayTaskIds = (day: PlanDay) => day.tasks.map((t) => t.id);

export function dayDone(day: PlanDay, log: TaskLog): boolean {
  return day.tasks.every((t) => !!log[t.id]);
}

export function dayRatio(day: PlanDay, log: TaskLog): number {
  return day.tasks.length ? day.tasks.filter((t) => log[t.id]).length / day.tasks.length : 0;
}

/** Index in PLAN_DAYS of the first day that isn't finished (the last one when all are). */
export function currentDayIndex(log: TaskLog): number {
  const i = PLAN_DAYS.findIndex(({ day, level }) => level.status === 'ready' && !dayDone(day, log));
  if (i >= 0) return i;
  return PLAN_DAYS.length - 1;
}

function ratioOf(days: PlanDay[], log: TaskLog): { done: number; total: number; ratio: number } {
  const ids = days.flatMap(dayTaskIds);
  const done = ids.filter((id) => log[id]).length;
  return { done, total: ids.length, ratio: ids.length ? done / ids.length : 0 };
}

export const weekProgress = (week: PlanWeek, log: TaskLog) => ratioOf(week.days, log);

export const levelDays = (level: PlanLevel): PlanDay[] => [...level.weeks.flatMap((w) => w.days), ...level.extraDays];

export const levelProgress = (level: PlanLevel, log: TaskLog) => ratioOf(levelDays(level), log);

/** Progress over every level that's ready (0–3 for now). */
export function planProgress(levels: PlanLevel[], log: TaskLog) {
  return ratioOf(levels.filter((l) => l.status === 'ready').flatMap(levelDays), log);
}

/** Days still to do before the end of the ready levels. */
export function daysLeft(log: TaskLog): number {
  return PLAN_DAYS.filter(({ day, level }) => level.status === 'ready' && !dayDone(day, log)).length;
}

/** Estimated minutes studied on a date, from the tasks ticked off that day. */
export function minutesOn(date: string, log: TaskLog): number {
  let total = 0;
  for (const [id, d] of Object.entries(log)) if (d === date) total += taskMinutes.get(id) ?? 0;
  return total;
}

/** Days in a row with at least one task done, ending today (or yesterday, if today has none yet). */
export function studyStreak(log: TaskLog, today: string): number {
  const days = new Set(Object.values(log));
  let day = days.has(today) ? today : addDaysToDateString(today, -1);
  let streak = 0;
  while (days.has(day)) {
    streak += 1;
    day = addDaysToDateString(day, -1);
  }
  return streak;
}

export function setTasks(log: TaskLog, ids: string[], done: boolean, date: string): TaskLog {
  const next = { ...log };
  for (const id of ids) {
    if (done) next[id] ??= date;
    else delete next[id];
  }
  return next;
}

// ── Tests ──────────────────────────────────────────────────────────────

export const bestAttempt = (attempts: TestAttempt[] | undefined): TestAttempt | null =>
  attempts?.length ? attempts.reduce((best, a) => (a.percent > best.percent ? a : best)) : null;

export const passedTest = (tests: TestLog, id: string) => !!tests[id]?.some((a) => a.passed);

export function addAttempt(tests: TestLog, id: string, attempt: TestAttempt): TestLog {
  return { ...tests, [id]: [...(tests[id] ?? []), attempt].slice(-20) };
}

export function bestTyping(results: TypingResult[]): TypingResult | null {
  return results.length ? results.reduce((best, r) => (r.wpm * r.accuracy > best.wpm * best.accuracy ? r : best)) : null;
}

export const latestEfset = (settings: CallCenterSettings) => settings.efset.at(-1)?.score ?? null;

/** EF SET score → CEFR level (EF's own bands). */
export function efsetLevel(score: number): string {
  if (score >= 71) return 'C2';
  if (score >= 61) return 'C1';
  if (score >= 51) return 'B2';
  if (score >= 41) return 'B1';
  if (score >= 31) return 'A2';
  if (score >= 21) return 'A1';
  return 'A0';
}

export const newId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

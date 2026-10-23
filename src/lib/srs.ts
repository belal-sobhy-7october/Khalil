/**
 * Spaced repetition for the word list, scheduled with FSRS — the algorithm
 * Anki uses (since 23.10). Every review is graded Again / Hard / Good / Easy
 * and each word keeps its own memory state: stability (days until the chance
 * of remembering falls to 90%) and difficulty (1–10). A word comes back just
 * before you would forget it, so the gaps grow: 10 minutes, 2 days, 11 days,
 * 6 weeks… New words go through short learning steps the same day, and a word
 * you forget goes back to a 10-minute relearning step.
 *
 * Hard words get extra care: they are scheduled for higher retention (they
 * come back sooner), and a word forgotten again and again — a "leech", as
 * Anki calls it — is flagged so it can get a new example or a memory hook.
 *
 * Words reviewed before this scheduler keep their progress: their state is
 * estimated from the old mastery level until their next review.
 */
import { createEmptyCard, fsrs, generatorParameters, type Card, type FSRS, type Grade } from 'ts-fsrs';
import { localDateString } from '../store/dateHelpers';
import type { SrsCard, VocabularyItem } from '../types';

export type SrsGrade = 1 | 2 | 3 | 4;
export const GRADES: SrsGrade[] = [1, 2, 3, 4];
export const GRADE_NAMES = { 1: 'again', 2: 'hard', 3: 'good', 4: 'easy' } as const;

const NEW = 0;
const REVIEW = 2;

export interface SrsSettings {
  /** New words to start per day (Anki's default is 20). */
  newPerDay: number;
  /** Desired retention: the chance of still knowing a word when it comes back. */
  retention: number;
  /** Daily reminder, local "HH:MM", or null for none. */
  reminderTime: string | null;
  /** Show a system notification at the reminder time when words are due. */
  notify: boolean;
}

export const SRS_SETTINGS_KEY = 'srs-settings';
/** Your own sentences for words that keep slipping, kept apart from the words themselves. */
export const OWN_SENTENCES_KEY = 'vocab-own-sentences';
export const DEFAULT_SRS_SETTINGS: SrsSettings = { newPerDay: 20, retention: 0.9, reminderTime: '20:00', notify: false };
export const RETENTION_OPTIONS = [0.85, 0.9, 0.95] as const;

export const LEARNING_STEPS = ['1m', '10m'] as const;
export const RELEARNING_STEPS = ['10m'] as const;
/** Learning words due within this window are shown now (Anki's "learn ahead limit"). */
export const LEARN_AHEAD_MS = 20 * 60 * 1000;
/** Words in one review session; what's left stays due for the next one. */
export const SESSION_SIZE = 30;
/** Hard words are scheduled for this much higher retention, so they come back sooner. */
const HARD_RETENTION_BOOST = 0.05;
const MAX_RETENTION = 0.97;
/** Difficulty from which a word counts as hard… */
export const HARD_DIFFICULTY = 7;
/** …until it stays in memory this many days. */
export const STABLE_DAYS = 21;
/** Forgotten this many times after being learned: a leech (Anki flags them at 8; words need help sooner). */
export const LEECH_LAPSES = 4;

const DAY_MS = 24 * 60 * 60 * 1000;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round = (n: number) => Math.round(n * 10000) / 10000;

const schedulers = new Map<string, FSRS>();
function scheduler(retention: number, fuzz: boolean): FSRS {
  const key = `${retention}:${fuzz}`;
  let s = schedulers.get(key);
  if (!s) {
    s = fsrs(generatorParameters({
      request_retention: retention,
      enable_fuzz: fuzz,
      enable_short_term: true,
      learning_steps: [...LEARNING_STEPS],
      relearning_steps: [...RELEARNING_STEPS],
    }));
    schedulers.set(key, s);
  }
  return s;
}

function toCard(c: SrsCard): Card {
  return {
    due: new Date(c.due),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: 0, // ts-fsrs works it out from last_review
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    last_review: c.last_review ? new Date(c.last_review) : undefined,
  };
}

function fromCard(card: Card, introduced?: string): SrsCard {
  return {
    due: card.due.toISOString(),
    stability: round(card.stability),
    difficulty: round(card.difficulty),
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as SrsCard['state'],
    ...(card.last_review ? { last_review: card.last_review.toISOString() } : {}),
    ...(introduced ? { introduced } : {}),
  };
}

/** A date, or the epoch when the value isn't one (a new word's date is only an ordering hint). */
const safeDate = (value: string | Date) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
};

export const newCard = (createdAt: string | Date): SrsCard => fromCard(createEmptyCard(safeDate(createdAt)));

// ── Words reviewed before this scheduler ──────────────────────────────────

/** Days the old fixed schedule gave each mastery level 0–5. */
const LEGACY_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];

/** The old rule for a word you keep getting wrong. */
const legacyHard = (item: VocabularyItem) =>
  item.lapseCount >= 2 || (item.lapseCount >= 1 && item.correctStreak === 0 && item.masteryLevel <= 1);

/**
 * A memory state for a word reviewed before this scheduler, from its old
 * mastery level, so its progress carries over: a word at level 4 keeps a
 * two-week memory and stays on its old due date; one you kept missing starts
 * as difficult and comes back tomorrow.
 */
export function legacyCard(item: VocabularyItem): SrsCard {
  if (!item.lastReviewedAt || item.reviewCount === 0) return newCard(item.createdAt);
  const hard = item.isHard || legacyHard(item);
  const days = hard ? 1 : LEGACY_INTERVAL_DAYS[clamp(item.masteryLevel, 0, 5)];
  const last = safeDate(item.lastReviewedAt);
  return {
    due: new Date(last.getTime() + days * DAY_MS).toISOString(),
    stability: Math.max(days, 0.5),
    difficulty: hard ? 8 : 5,
    scheduled_days: days,
    learning_steps: 0,
    reps: item.reviewCount,
    lapses: 0,
    state: REVIEW,
    last_review: last.toISOString(),
  };
}

export const cardOf = (item: VocabularyItem): SrsCard => item.srs ?? legacyCard(item);

// ── Where a word stands ───────────────────────────────────────────────────

export type Bucket = 'new' | 'learning' | 'review';
export const bucketOf = (card: SrsCard): Bucket => (card.state === NEW ? 'new' : card.state === REVIEW ? 'review' : 'learning');

/** Due now: a review word due today, or a learning step due within the learn-ahead window. New words aren't "due" (see buildSession). */
export function isDue(card: SrsCard, now: Date): boolean {
  if (card.state === NEW) return false;
  if (card.state === REVIEW) return localDateString(new Date(card.due)) <= localDateString(now);
  return Date.parse(card.due) <= now.getTime() + LEARN_AHEAD_MS;
}

export const isLeech = (card: SrsCard) => card.lapses >= LEECH_LAPSES;

/** Starred, a leech, or difficult and not yet stable (words never reviewed with FSRS use the old rule). */
export function isHardItem(item: VocabularyItem): boolean {
  if (item.isHard) return true;
  if (!item.srs) return legacyHard(item);
  const card = item.srs;
  if (isLeech(card)) return true;
  return card.state !== NEW && card.difficulty >= HARD_DIFFICULTY && card.stability < STABLE_DAYS;
}

/** 0–5 for the stars and the "known" counts elsewhere in the app, from how long the word stays in memory. */
export function masteryOf(card: SrsCard): number {
  if (card.state === NEW) return 0;
  // Learning: 0 while you still can't recall it a day later, 1 once you can.
  if (card.state !== REVIEW) return card.stability < 1 ? 0 : 1;
  if (card.stability < 3) return 2;
  if (card.stability < 10) return 3;
  if (card.stability < 30) return 4;
  return 5;
}

/** The chance (0–1) of remembering the word right now. */
export function retrievability(card: SrsCard, now: Date): number {
  if (card.state === NEW) return 0;
  return scheduler(DEFAULT_SRS_SETTINGS.retention, false).get_retrievability(toCard(card), now, false);
}

const retentionFor = (item: VocabularyItem, retention: number) =>
  isHardItem(item) ? Math.min(MAX_RETENTION, retention + HARD_RETENTION_BOOST) : retention;

// ── Grading ───────────────────────────────────────────────────────────────

export interface GradeOption {
  grade: SrsGrade;
  card: SrsCard;
  /** Milliseconds until the word comes back. */
  wait: number;
}

/**
 * What each answer would do. Computed once when the answer is shown and the
 * chosen one applied as is, so the button's interval is the one you get.
 */
export function gradeOptions(item: VocabularyItem, now: Date, settings: Pick<SrsSettings, 'retention'>, fuzz = true): Record<SrsGrade, GradeOption> {
  const card = cardOf(item);
  const log = scheduler(retentionFor(item, settings.retention), fuzz).repeat(toCard(card), now);
  const introduced = card.introduced ?? (card.state === NEW ? localDateString(now) : undefined);
  const out = {} as Record<SrsGrade, GradeOption>;
  for (const grade of GRADES) {
    const next = log[grade as Grade].card;
    out[grade] = { grade, card: fromCard(next, introduced), wait: next.due.getTime() - now.getTime() };
  }
  return out;
}

export const gradeItem = (item: VocabularyItem, grade: SrsGrade, now: Date, settings: Pick<SrsSettings, 'retention'>): SrsCard =>
  gradeOptions(item, now, settings)[grade].card;

/** A short interval label: 1m, 10m, 3h, 2d, 1.5mo, 2y. */
export function formatWait(ms: number, units: { m: string; h: string; d: string; mo: string; y: string }): string {
  const minutes = ms / 60000;
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))}${units.m}`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)}${units.h}`;
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)}${units.d}`;
  if (days < 365) return `${+(days / 30).toFixed(1)}${units.mo}`;
  return `${+(days / 365).toFixed(1)}${units.y}`;
}

// ── Sessions ──────────────────────────────────────────────────────────────

/** New words started today (their first review was today). */
export const newStartedToday = (items: VocabularyItem[], today: string) =>
  items.filter((i) => i.srs?.introduced === today).length;

export interface DueSummary {
  learning: number;
  review: number;
  /** New words you can still start today. */
  newToday: number;
  newTotal: number;
  /** Hard words among the due ones. */
  hardDue: number;
  /** When the next word not yet due comes back (ISO), if any. */
  nextAt?: string;
}

export function dueSummary(items: VocabularyItem[], now: Date, settings: Pick<SrsSettings, 'newPerDay'>): DueSummary {
  let learning = 0;
  let review = 0;
  let newTotal = 0;
  let hardDue = 0;
  let nextAt: string | undefined;
  for (const item of items) {
    const card = cardOf(item);
    if (card.state === NEW) {
      newTotal += 1;
      continue;
    }
    if (isDue(card, now)) {
      if (card.state === REVIEW) review += 1;
      else learning += 1;
      if (isHardItem(item)) hardDue += 1;
    } else if (!nextAt || card.due < nextAt) {
      nextAt = card.due;
    }
  }
  const newToday = Math.min(newTotal, Math.max(0, settings.newPerDay - newStartedToday(items, localDateString(now))));
  return { learning, review, newToday, newTotal, hardDue, nextAt };
}

/** Spreads `extra` evenly through `base`. */
function interleave<T>(base: T[], extra: T[]): T[] {
  if (!extra.length) return base;
  if (!base.length) return extra;
  const out: T[] = [];
  const every = (base.length + extra.length) / extra.length;
  let e = 0;
  let b = 0;
  for (let i = 0; i < base.length + extra.length; i++) {
    if (e < extra.length && i + 1 >= Math.round((e + 1) * every)) out.push(extra[e++]);
    else out.push(base[b++]);
  }
  return out;
}

/**
 * Today's review, the way Anki builds it: learning steps that are due first,
 * then the review words (the most overdue first, so the ones you're closest
 * to forgetting come up while you're fresh), with today's new words mixed in
 * up to the daily limit.
 */
export function buildSession(items: VocabularyItem[], now: Date, settings: Pick<SrsSettings, 'newPerDay'>, limit = SESSION_SIZE): VocabularyItem[] {
  const withCards = items.map((item) => ({ item, card: cardOf(item) }));
  const learning = withCards
    .filter(({ card }) => card.state !== NEW && card.state !== REVIEW && isDue(card, now))
    .sort((a, b) => a.card.due.localeCompare(b.card.due));
  const overdue = ({ card }: { card: SrsCard }) =>
    card.last_review ? (now.getTime() - Date.parse(card.last_review)) / DAY_MS / Math.max(card.stability, 0.1) : 0;
  const reviews = withCards
    .filter(({ card }) => card.state === REVIEW && isDue(card, now))
    .sort((a, b) => overdue(b) - overdue(a) || a.item.id.localeCompare(b.item.id));
  const { newToday } = dueSummary(items, now, settings);
  const fresh = withCards
    .filter(({ card }) => card.state === NEW)
    .sort((a, b) => a.item.createdAt.localeCompare(b.item.createdAt) || a.item.id.localeCompare(b.item.id))
    .slice(0, newToday);
  return [...learning, ...interleave(reviews, fresh)].slice(0, limit).map(({ item }) => item);
}

/** Words coming back on each of the next `days` days (today first, with anything overdue) — Anki's "future due". */
export function forecast(items: VocabularyItem[], now: Date, days = 7): number[] {
  const out = new Array<number>(days).fill(0);
  const today = localDateString(now);
  const dayIndex = new Map(Array.from({ length: days }, (_, i) => [localDateString(new Date(now.getTime() + i * DAY_MS)), i]));
  for (const item of items) {
    const card = cardOf(item);
    if (card.state === NEW) continue;
    const date = localDateString(new Date(card.due));
    const i = date <= today ? 0 : dayIndex.get(date);
    if (i !== undefined) out[i] += 1;
  }
  return out;
}

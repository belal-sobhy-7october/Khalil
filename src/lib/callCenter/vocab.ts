/**
 * The word bank's progress, read from the Vocabulary flashcards: a word is
 * "added" once it's a flashcard and "known" once it reaches mastery level 3
 * (right three times more than wrong). The goal is 90% of the bank known
 * within a month of starting.
 */
import { VOCAB_UNITS, VOCAB_WORDS, type VocabUnit } from '../../data/callCenter/vocab';
import { buildReviewQueue, isDueForReview, isHardWord } from '../../store/vocabularyHard';
import type { VocabularyItem } from '../../types';

export const CC_VOCAB_KEY = 'callcenter-vocab';
export const KNOWN_LEVEL = 3;
export const VOCAB_TARGET = 0.9;
export const SPRINT_DAYS = 30;

/** Saved per user: when the month started, and the words heard on YouGlish. */
export interface VocabLog {
  /** The local date (YYYY-MM-DD) the first unit went into the flashcards. */
  startedAt?: string;
  /** Lower-cased word → the date it was first played on YouGlish. */
  heard: Record<string, string>;
}

export const EMPTY_VOCAB_LOG: VocabLog = { heard: {} };

export const wordKey = (word: string) => word.trim().toLowerCase();

const BANK = new Set(VOCAB_WORDS.map((w) => wordKey(w.word)));

/** The flashcards that are bank words, by lower-cased word. */
export function bankCards(items: VocabularyItem[]): Map<string, VocabularyItem> {
  return new Map(items.filter((i) => BANK.has(wordKey(i.word))).map((i) => [wordKey(i.word), i]));
}

export const isKnown = (card?: VocabularyItem) => !!card && card.masteryLevel >= KNOWN_LEVEL;

export function unitStatus(unit: VocabUnit, cards: Map<string, VocabularyItem>) {
  const unitCards = unit.words.map((w) => cards.get(wordKey(w.word)));
  return {
    added: unitCards.filter(Boolean).length,
    known: unitCards.filter(isKnown).length,
    total: unit.words.length,
    ids: unitCards.flatMap((c) => (c ? [c.id] : [])),
  };
}

export function vocabProgress(items: VocabularyItem[], now: Date = new Date()) {
  const cards = bankCards(items);
  const all = [...cards.values()];
  const known = all.filter(isKnown).length;
  return {
    total: VOCAB_WORDS.length,
    added: all.length,
    known,
    ratio: known / VOCAB_WORDS.length,
    due: buildReviewQueue(all.filter((c) => isDueForReview(c, now))).map((c) => c.id),
    hard: all.filter(isHardWord),
    unitsAdded: VOCAB_UNITS.filter((u) => unitStatus(u, cards).added === u.words.length).length,
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Day of the month-long sprint (1 on the start day), or 0 before it starts. */
export function sprintDay(startedAt: string | undefined, today: string): number {
  if (!startedAt) return 0;
  return Math.floor((Date.parse(today) - Date.parse(startedAt)) / DAY_MS) + 1;
}

/** Units you'd have added by this day to finish the bank by day 24 and know it by day 30. */
export const unitsDueBy = (day: number) => Math.min(VOCAB_UNITS.length, Math.max(0, day));

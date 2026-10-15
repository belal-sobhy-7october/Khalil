import type { VocabularyItem, VocabularyReviewResult } from '../types';

/**
 * Determines if a vocabulary item is considered "hard" based on:
 * - Manually marked as hard (isHard)
 * - lapseCount >= 2 (got wrong 2+ times total)
 * - lapseCount >= 1 AND correctStreak === 0 AND masteryLevel <= 1 (got wrong once, never got it right since, and low mastery)
 */
export function isHardWord(item: VocabularyItem): boolean {
  if (item.isHard) return true;
  if (item.lapseCount >= 2) return true;
  if (item.lapseCount >= 1 && item.correctStreak === 0 && item.masteryLevel <= 1) return true;
  return false;
}

/**
 * Builds a review queue from vocabulary items.
 * Ordering:
 * 1. Hard words first
 * 2. Then by lowest masteryLevel
 * 3. Then by least recently reviewed (null first)
 * 4. Stable tie-break by id
 */
export function buildReviewQueue(
  items: VocabularyItem[],
  options: { onlyHard?: boolean } = {}
): VocabularyItem[] {
  const filtered = options.onlyHard
    ? items.filter(isHardWord)
    : items;

  return [...filtered].sort((a, b) => {
    const aHard = isHardWord(a);
    const bHard = isHardWord(b);

    // Hard words first
    if (aHard !== bHard) {
      return aHard ? -1 : 1;
    }

    // Lowest masteryLevel first
    if (a.masteryLevel !== b.masteryLevel) {
      return a.masteryLevel - b.masteryLevel;
    }

    // Least recently reviewed first (null first)
    const aReviewed = a.lastReviewedAt ? new Date(a.lastReviewedAt).getTime() : -Infinity;
    const bReviewed = b.lastReviewedAt ? new Date(b.lastReviewedAt).getTime() : -Infinity;
    if (aReviewed !== bReviewed) {
      return aReviewed - bReviewed;
    }

    // Stable tie-break by id
    return a.id.localeCompare(b.id);
  });
}

/**
 * Checks if a word should be re-asked in the current session (spaced re-ask).
 * Returns the index where the item should be re-inserted (3-4 cards later),
 * or -1 if it shouldn't be re-asked.
 */
export function getReaskIndex(
  currentIndex: number,
  queueLength: number,
  reaskOffset: number = 3
): number {
  const targetIndex = currentIndex + reaskOffset;
  if (targetIndex >= queueLength) return -1;
  return targetIndex;
}

/**
 * Updates a vocabulary item after a review result.
 * Handles lapseCount, correctStreak, lastResult, and auto-clears isHard
 * when correctStreak >= 3 (unless manually starred).
 */
export function applyReviewResult(
  item: VocabularyItem,
  result: VocabularyReviewResult,
  isManuallyHard: boolean = false
): VocabularyItem {
  const updated = { ...item };

  switch (result) {
    case 'incorrect':
      updated.lapseCount = (item.lapseCount ?? 0) + 1;
      updated.correctStreak = 0;
      updated.lastResult = 'incorrect';
      break;
    case 'correct':
      updated.correctStreak = (item.correctStreak ?? 0) + 1;
      updated.lastResult = 'correct';
      // Auto-clear hard status when correctStreak >= 3, unless manually starred
      if (updated.correctStreak >= 3 && !isManuallyHard) {
        updated.isHard = false;
      }
      break;
    case 'skipped':
      updated.lastResult = 'skipped';
      // Skipped doesn't affect streaks
      break;
  }

  return updated;
}

// Spaced repetition: days until a word is due again, by mastery level 0–5.
// A word you know well comes back rarely; a new or shaky one comes back soon.
export const REVIEW_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];
const DAY_MS = 24 * 60 * 60 * 1000;

export function isDueForReview(item: VocabularyItem, now: Date = new Date()): boolean {
  if (!item.lastReviewedAt) return true;
  const last = new Date(item.lastReviewedAt).getTime();
  // Hard words come back every day.
  const days = isHardWord(item) ? 1 : REVIEW_INTERVAL_DAYS[Math.min(Math.max(item.masteryLevel, 0), 5)];
  return now.getTime() - last >= days * DAY_MS - 60 * 60 * 1000; // 1h slack so "tomorrow" isn't to-the-minute
}

// Default session: due words, hard/weak first, capped so a big pack doesn't
// turn into a 400-card session.
export const SESSION_SIZE = 30;

export function buildDueQueue(items: VocabularyItem[], now: Date = new Date()): VocabularyItem[] {
  return buildReviewQueue(items.filter((i) => isDueForReview(i, now))).slice(0, SESSION_SIZE);
}

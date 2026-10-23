import type { VocabularyItem, VocabularyReviewResult } from '../types';
import { DEFAULT_SRS_SETTINGS, buildSession, cardOf, isDue, isHardItem, type SrsSettings } from '../lib/srs';

export { SESSION_SIZE } from '../lib/srs';

/**
 * Whether a word is "hard": starred by you, a leech (forgotten again and
 * again), or difficult and not yet stable in memory (lib/srs.ts). Words not
 * yet reviewed with the spaced-repetition scheduler use the old rule: wrong
 * twice, or wrong once and never right since at a low mastery level.
 */
export const isHardWord = (item: VocabularyItem): boolean => isHardItem(item);

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

/**
 * Whether a word should be studied now: never studied yet, or due again by
 * the spaced-repetition schedule (lib/srs.ts).
 */
export function isDueForReview(item: VocabularyItem, now: Date = new Date()): boolean {
  const card = cardOf(item);
  return card.state === 0 || isDue(card, now);
}

/** Today's review session: due learning steps, due words, and new words up to the daily limit. */
export function buildDueQueue(items: VocabularyItem[], now: Date = new Date(), settings: Pick<SrsSettings, 'newPerDay'> = DEFAULT_SRS_SETTINGS): VocabularyItem[] {
  return buildSession(items, now, settings);
}

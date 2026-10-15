import { describe, expect, it } from 'vitest';
import type { VocabularyItem } from '../types';
import { buildDueQueue, isDueForReview, SESSION_SIZE } from './vocabularyHard';

const now = new Date('2026-10-15T12:00:00Z');
const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

const item = (over: Partial<VocabularyItem>): VocabularyItem => ({
  id: 'x', userId: 'u', word: 'w', type: 'word', definition: 'd',
  masteryLevel: 0, reviewCount: 1, lapseCount: 0, correctStreak: 0, isHard: false,
  createdAt: '', updatedAt: '', ...over,
});

describe('isDueForReview', () => {
  it('new words are always due', () => {
    expect(isDueForReview(item({ lastReviewedAt: undefined }), now)).toBe(true);
  });

  it('waits longer as mastery grows', () => {
    expect(isDueForReview(item({ masteryLevel: 3, lastReviewedAt: daysAgo(5), correctStreak: 3 }), now)).toBe(false);
    expect(isDueForReview(item({ masteryLevel: 3, lastReviewedAt: daysAgo(7), correctStreak: 3 }), now)).toBe(true);
    expect(isDueForReview(item({ masteryLevel: 5, lastReviewedAt: daysAgo(20), correctStreak: 5 }), now)).toBe(false);
  });

  it('hard words come back daily whatever their mastery', () => {
    expect(isDueForReview(item({ masteryLevel: 5, isHard: true, lastReviewedAt: daysAgo(1) }), now)).toBe(true);
    expect(isDueForReview(item({ masteryLevel: 5, isHard: true, lastReviewedAt: daysAgo(0.2) }), now)).toBe(false);
  });
});

describe('buildDueQueue', () => {
  it('caps a session', () => {
    const many = Array.from({ length: 100 }, (_, i) => item({ id: `i${i}`, lastReviewedAt: undefined }));
    expect(buildDueQueue(many, now)).toHaveLength(SESSION_SIZE);
  });
});

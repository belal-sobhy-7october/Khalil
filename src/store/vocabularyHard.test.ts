import { describe, expect, it } from 'vitest';
import { isHardWord, buildReviewQueue, applyReviewResult, getReaskIndex } from './vocabularyHard';
import type { VocabularyItem } from '../types';

function createItem(overrides: Partial<VocabularyItem> = {}): VocabularyItem {
  return {
    id: 'test-id',
    userId: 'user1',
    word: 'test',
    type: 'word',
    definition: 'A test word',
    masteryLevel: 0,
    reviewCount: 0,
    lapseCount: 0,
    correctStreak: 0,
    isHard: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    ...overrides,
  };
}

describe('isHardWord', () => {
  it('returns true for manually marked hard words', () => {
    const item = createItem({ isHard: true });
    expect(isHardWord(item)).toBe(true);
  });

  it('returns true when lapseCount >= 2', () => {
    const item = createItem({ lapseCount: 2, isHard: false });
    expect(isHardWord(item)).toBe(true);
  });

  it('returns true when lapseCount >= 1, correctStreak === 0, and masteryLevel <= 1', () => {
    const item = createItem({ lapseCount: 1, correctStreak: 0, masteryLevel: 1, isHard: false });
    expect(isHardWord(item)).toBe(true);
  });

  it('returns false when lapseCount >= 1 but correctStreak > 0', () => {
    const item = createItem({ lapseCount: 1, correctStreak: 1, masteryLevel: 1, isHard: false });
    expect(isHardWord(item)).toBe(false);
  });

  it('returns false when lapseCount >= 1 but masteryLevel > 1', () => {
    const item = createItem({ lapseCount: 1, correctStreak: 0, masteryLevel: 2, isHard: false });
    expect(isHardWord(item)).toBe(false);
  });

  it('returns false for new words with no lapses', () => {
    const item = createItem({ lapseCount: 0, correctStreak: 0, masteryLevel: 0, isHard: false });
    expect(isHardWord(item)).toBe(false);
  });

  it('returns false when correctStreak >= 3 clears auto-hard status', () => {
    const item = createItem({ lapseCount: 1, correctStreak: 3, masteryLevel: 1, isHard: false });
    expect(isHardWord(item)).toBe(false);
  });

  it('returns true when isHard is manually set even with correctStreak >= 3', () => {
    const item = createItem({ lapseCount: 1, correctStreak: 3, masteryLevel: 1, isHard: true });
    expect(isHardWord(item)).toBe(true);
  });
});

describe('buildReviewQueue', () => {
  const baseItems: VocabularyItem[] = [
    createItem({ id: '1', word: 'easy', masteryLevel: 4, lapseCount: 0, correctStreak: 5, lastReviewedAt: '2024-01-10' }),
    createItem({ id: '2', word: 'medium', masteryLevel: 2, lapseCount: 1, correctStreak: 0, lastReviewedAt: '2024-01-05' }),
    createItem({ id: '3', word: 'hard1', masteryLevel: 1, lapseCount: 2, correctStreak: 0, lastReviewedAt: '2024-01-01' }),
    createItem({ id: '4', word: 'hard2', masteryLevel: 0, lapseCount: 1, correctStreak: 0, lastReviewedAt: '2024-01-03' }),
    createItem({ id: '5', word: 'never-reviewed', masteryLevel: 0, lapseCount: 0, correctStreak: 0, lastReviewedAt: undefined }),
  ];

  it('orders hard words first', () => {
    const queue = buildReviewQueue(baseItems);
    
    // All hard words should come before easy words
    const firstEasyIndex = queue.findIndex((i) => !isHardWord(i));
    const lastHardIndex = queue.findLastIndex(isHardWord);
    expect(lastHardIndex).toBeLessThan(firstEasyIndex);
  });

  it('orders by lowest masteryLevel within hard words', () => {
    const queue = buildReviewQueue(baseItems);
    const hardWords = queue.filter(isHardWord);
    
    // hard2 (masteryLevel 0) should come before hard1 (masteryLevel 1)
    expect(hardWords[0].id).toBe('4'); // hard2
    expect(hardWords[1].id).toBe('3'); // hard1
  });

  it('orders by least recently reviewed (null first) when masteryLevel is equal', () => {
    const items = [
      createItem({ id: 'a', masteryLevel: 1, lapseCount: 2, lastReviewedAt: '2024-01-10' }),
      createItem({ id: 'b', masteryLevel: 1, lapseCount: 2, lastReviewedAt: '2024-01-05' }),
      createItem({ id: 'c', masteryLevel: 1, lapseCount: 2, lastReviewedAt: undefined }),
    ];
    const queue = buildReviewQueue(items);
    expect(queue[0].id).toBe('c'); // never reviewed first
    expect(queue[1].id).toBe('b'); // older review second
    expect(queue[2].id).toBe('a'); // most recent last
  });

  it('uses stable tie-break by id when all else is equal', () => {
    const items = [
      createItem({ id: 'z', masteryLevel: 1, lapseCount: 2, lastReviewedAt: '2024-01-01' }),
      createItem({ id: 'a', masteryLevel: 1, lapseCount: 2, lastReviewedAt: '2024-01-01' }),
    ];
    const queue = buildReviewQueue(items);
    expect(queue[0].id).toBe('a');
    expect(queue[1].id).toBe('z');
  });

  it('filters to only hard words when onlyHard is true', () => {
    const queue = buildReviewQueue(baseItems, { onlyHard: true });
    expect(queue.every(isHardWord)).toBe(true);
    expect(queue.length).toBe(2); // hard1 and hard2
  });

  it('does not mutate the original array', () => {
    const original = [...baseItems];
    buildReviewQueue(baseItems);
    expect(baseItems).toEqual(original);
  });
});

describe('applyReviewResult', () => {
  it('increments lapseCount and resets correctStreak on incorrect', () => {
    const item = createItem({ lapseCount: 1, correctStreak: 2 });
    const updated = applyReviewResult(item, 'incorrect');
    expect(updated.lapseCount).toBe(2);
    expect(updated.correctStreak).toBe(0);
    expect(updated.lastResult).toBe('incorrect');
  });

  it('increments correctStreak on correct', () => {
    const item = createItem({ correctStreak: 2 });
    const updated = applyReviewResult(item, 'correct');
    expect(updated.correctStreak).toBe(3);
    expect(updated.lastResult).toBe('correct');
  });

  it('auto-clears isHard when correctStreak >= 3 and not manually hard', () => {
    const item = createItem({ isHard: false, correctStreak: 2, lapseCount: 2 });
    const updated = applyReviewResult(item, 'correct');
    expect(updated.correctStreak).toBe(3);
    expect(updated.isHard).toBe(false);
  });

  it('does not auto-clear isHard when manually set', () => {
    const item = createItem({ isHard: true, correctStreak: 2, lapseCount: 2 });
    const updated = applyReviewResult(item, 'correct', true);
    expect(updated.correctStreak).toBe(3);
    expect(updated.isHard).toBe(true);
  });

  it('does not affect streaks on skipped', () => {
    const item = createItem({ lapseCount: 1, correctStreak: 2 });
    const updated = applyReviewResult(item, 'skipped');
    expect(updated.lapseCount).toBe(1);
    expect(updated.correctStreak).toBe(2);
    expect(updated.lastResult).toBe('skipped');
  });

  it('does not mutate the original item', () => {
    const item = createItem({ lapseCount: 1, correctStreak: 2 });
    applyReviewResult(item, 'incorrect');
    expect(item.lapseCount).toBe(1);
    expect(item.correctStreak).toBe(2);
  });
});

describe('getReaskIndex', () => {
  it('returns index 3-4 cards later', () => {
    const idx = getReaskIndex(0, 10);
    expect(idx).toBeGreaterThanOrEqual(3);
    expect(idx).toBeLessThanOrEqual(4);
  });

  it('returns -1 when target index exceeds queue length', () => {
    const idx = getReaskIndex(8, 10);
    expect(idx).toBe(-1);
  });

  it('returns -1 when at the end of queue', () => {
    const idx = getReaskIndex(9, 10);
    expect(idx).toBe(-1);
  });
});
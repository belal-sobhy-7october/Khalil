import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useAppStore } from './appStore';
import type { Session } from '@supabase/supabase-js';
import type { VocabularyItem } from '../types';
import { mockSupabase } from '../test/mockSupabase';
import { masteryOf, newCard } from '../lib/srs';

// Mock Supabase
vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const mockUserId = 'test-user-id';

function createMockVocabularyItem(overrides: Partial<VocabularyItem> = {}): VocabularyItem {
  return {
    id: 'vocab-1',
    userId: mockUserId,
    word: 'test',
    type: 'word',
    definition: 'A test word',
    masteryLevel: 1,
    reviewCount: 0,
    lapseCount: 0,
    correctStreak: 0,
    isHard: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    ...overrides,
  } as VocabularyItem;
}

function createVocabularyReviewsQuery(resolve: { data: unknown[] | null; error: unknown }) {
  return {
    insert: vi.fn().mockResolvedValue(resolve),
  };
}

function createUserKvQuery() {
  return { upsert: vi.fn().mockResolvedValue({ data: null, error: null }) };
}
let userKv = createUserKvQuery();

function createVocabularyItemsQuery(resolve: { data: unknown[] | null; error: unknown }) {
  return {
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue(resolve),
    delete: vi.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  userKv = createUserKvQuery();

  // Default successful responses
  mockSupabase.from.mockImplementation((table: string) => {
    if (table === 'user_kv') return userKv;
    if (table === 'vocabulary_reviews') {
      return createVocabularyReviewsQuery({ data: [{ id: 'review-1' }], error: null });
    }
    if (table === 'vocabulary_items') {
      return createVocabularyItemsQuery({ data: [{ ...createMockVocabularyItem() }], error: null });
    }
    return mockSupabase.from(table);
  });

  useAppStore.setState({
    session: { user: { id: mockUserId } } as Session,
    vocabularyItems: [createMockVocabularyItem()],
    vocabularyReviews: [],
    language: 'en',
    error: null,
  });
});

describe('submitVocabularyReview', () => {
  it('a correct answer on a new word starts its learning steps and saves its schedule', async () => {
    const { submitVocabularyReview } = useAppStore.getState();
    const before = Date.now();

    await act(async () => {
      await submitVocabularyReview('vocab-1', 'correct', 1000);
    });

    const state = useAppStore.getState();
    const item = state.vocabularyItems.find((i) => i.id === 'vocab-1');
    
    expect(item).toBeDefined();
    // Counted as Good: back in 10 minutes, still learning.
    expect(item!.srs?.state).toBe(1);
    expect(Date.parse(item!.srs!.due) - before).toBeGreaterThanOrEqual(10 * 60_000 - 1000);
    expect(item!.masteryLevel).toBe(1);
    expect(userKv.upsert).toHaveBeenCalledWith(expect.objectContaining({ key: 'srs:vocab-1', value: item!.srs }), { onConflict: 'user_id,key' });
    expect(item!.reviewCount).toBe(1);
    expect(item!.lapseCount).toBe(0);
    expect(item!.correctStreak).toBe(1);
    expect(item!.lastResult).toBe('correct');
    expect(item!.isHard).toBe(false);
  });

  it('updates counters correctly on incorrect answer', async () => {
    const { submitVocabularyReview } = useAppStore.getState();
    
    await act(async () => {
      await submitVocabularyReview('vocab-1', 'incorrect', 1000);
    });

    const state = useAppStore.getState();
    const item = state.vocabularyItems.find((i) => i.id === 'vocab-1');
    
    expect(item).toBeDefined();
    // Counted as Again: back in a minute.
    expect(item!.masteryLevel).toBe(0);
    expect(Date.parse(item!.srs!.due) - Date.now()).toBeLessThanOrEqual(60_000);
    expect(item!.reviewCount).toBe(1);
    expect(item!.lapseCount).toBe(1);
    expect(item!.correctStreak).toBe(0);
    expect(item!.lastResult).toBe('incorrect');
    expect(item!.isHard).toBe(false);
  });

  it('increments lapseCount on second incorrect answer', async () => {
    // Set up item with lapseCount = 1
    useAppStore.setState({
      vocabularyItems: [createMockVocabularyItem({ lapseCount: 1, masteryLevel: 1, correctStreak: 0 })],
    });

    const { submitVocabularyReview } = useAppStore.getState();
    
    await act(async () => {
      await submitVocabularyReview('vocab-1', 'incorrect', 1000);
    });

    const state = useAppStore.getState();
    const item = state.vocabularyItems.find((i) => i.id === 'vocab-1');
    
    expect(item!.lapseCount).toBe(2);
    expect(item!.correctStreak).toBe(0);
    expect(item!.lastResult).toBe('incorrect');
  });

  it('increments correctStreak on consecutive correct answers', async () => {
    // Reviewed three days ago under the old schedule (level 2: every 3 days), due again now.
    const lastReviewedAt = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    useAppStore.setState({
      vocabularyItems: [createMockVocabularyItem({ correctStreak: 2, masteryLevel: 2, reviewCount: 4, lastReviewedAt })],
    });

    const { submitVocabularyReview } = useAppStore.getState();
    
    await act(async () => {
      await submitVocabularyReview('vocab-1', 'correct', 1000);
    });

    const state = useAppStore.getState();
    const item = state.vocabularyItems.find((i) => i.id === 'vocab-1');
    
    expect(item!.correctStreak).toBe(3);
    // Remembered after three days: it now lasts longer.
    expect(item!.srs!.stability).toBeGreaterThan(3);
    expect(item!.masteryLevel).toBeGreaterThanOrEqual(3);
    expect(item!.isHard).toBe(false); // auto-cleared since correctStreak >= 3
  });

  it('uses the grade the learner picked as is', async () => {
    const picked = { ...newCard(new Date()), state: 2 as const, stability: 12, difficulty: 4, scheduled_days: 12, reps: 1, due: new Date(Date.now() + 12 * 86400000).toISOString(), last_review: new Date().toISOString() };

    await act(async () => {
      await useAppStore.getState().submitVocabularyReview('vocab-1', 'correct', 1000, picked);
    });

    const item = useAppStore.getState().vocabularyItems.find((i) => i.id === 'vocab-1')!;
    expect(item.srs).toBe(picked);
    expect(item.masteryLevel).toBe(masteryOf(picked));
  });

  it('rolls back local state on review insert failure', async () => {
    // Mock supabase to fail on vocabulary_reviews insert
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'vocabulary_reviews') {
        return createVocabularyReviewsQuery({ data: null, error: new Error('DB error') });
      }
      if (table === 'vocabulary_items') {
        return createVocabularyItemsQuery({ data: [{ ...createMockVocabularyItem() }], error: null });
      }
      return mockSupabase.from(table);
    });

    const { submitVocabularyReview } = useAppStore.getState();
    
    await act(async () => {
      await submitVocabularyReview('vocab-1', 'correct', 1000);
    });

    const state = useAppStore.getState();
    const item = state.vocabularyItems.find((i) => i.id === 'vocab-1');
    
    // Should rollback to original state
    expect(item!.masteryLevel).toBe(1);
    expect(item!.reviewCount).toBe(0);
    expect(item!.correctStreak).toBe(0);
    expect(state.error).toBe('errors.submitVocabularyReview');
  });

  it('rolls back local state on vocabulary_items update failure', async () => {
    // Mock supabase to succeed on review insert but fail on item update
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'vocabulary_reviews') {
        return createVocabularyReviewsQuery({ data: [{ id: 'review-1' }], error: null });
      }
      if (table === 'vocabulary_items') {
        return createVocabularyItemsQuery({ data: null, error: new Error('DB error') });
      }
      return mockSupabase.from(table);
    });

    const { submitVocabularyReview } = useAppStore.getState();
    
    await act(async () => {
      await submitVocabularyReview('vocab-1', 'correct', 1000);
    });

    const state = useAppStore.getState();
    const item = state.vocabularyItems.find((i) => i.id === 'vocab-1');
    
    // Should rollback to original state
    expect(item!.masteryLevel).toBe(1);
    expect(item!.reviewCount).toBe(0);
    expect(item!.correctStreak).toBe(0);
    expect(state.error).toBe('errors.updateVocabularyItem');
  });

  it('handles skipped result correctly', async () => {
    const { submitVocabularyReview } = useAppStore.getState();
    
    await act(async () => {
      await submitVocabularyReview('vocab-1', 'skipped', 1000);
    });

    const state = useAppStore.getState();
    const item = state.vocabularyItems.find((i) => i.id === 'vocab-1');
    
    expect(item!.masteryLevel).toBe(1); // unchanged
    expect(item!.srs).toBeUndefined(); // schedule unchanged
    expect(userKv.upsert).not.toHaveBeenCalled();
    expect(item!.reviewCount).toBe(1); // still increments
    expect(item!.lastResult).toBe('skipped');
    expect(item!.correctStreak).toBe(0); // unchanged
    expect(item!.lapseCount).toBe(0); // unchanged
  });

  it('adds review to vocabularyReviews array', async () => {
    const { submitVocabularyReview } = useAppStore.getState();
    
    await act(async () => {
      await submitVocabularyReview('vocab-1', 'correct', 1000);
    });

    const state = useAppStore.getState();
    expect(state.vocabularyReviews.length).toBe(1);
    expect(state.vocabularyReviews[0].vocabularyItemId).toBe('vocab-1');
    expect(state.vocabularyReviews[0].result).toBe('correct');
    expect(state.vocabularyReviews[0].timeTaken).toBe(1000);
  });
});
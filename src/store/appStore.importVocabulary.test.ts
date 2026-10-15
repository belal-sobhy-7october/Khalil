import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useAppStore } from './appStore';
import type { Session } from '@supabase/supabase-js';
import { mockSupabase } from '../test/mockSupabase';
import type { VocabularyItem, VocabularyCategory } from '../types';

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
  };
}

function createMockCategory(overrides: Partial<VocabularyCategory> = {}): VocabularyCategory {
  return {
    id: 'cat-1',
    userId: mockUserId,
    name: 'Test Category',
    color: '#e8d5c4',
    icon: 'folder',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    ...overrides,
  };
}

function createVocabularyItemsInsertQuery(resolve: { data: unknown[] | null; error: unknown }) {
  return {
    insert: vi.fn().mockResolvedValue(resolve),
  };
}

function createVocabularyCategoriesInsertQuery(resolve: { data: unknown[] | null; error: unknown }) {
  return {
    insert: vi.fn().mockResolvedValue(resolve),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  
  // Default successful responses
  mockSupabase.from.mockImplementation((table: string) => {
    if (table === 'vocabulary_items') {
      return createVocabularyItemsInsertQuery({ data: [{ id: 'new-1' }], error: null });
    }
    if (table === 'vocabulary_categories') {
      return createVocabularyCategoriesInsertQuery({ data: [{ id: 'cat-new' }], error: null });
    }
    return mockSupabase.from(table);
  });

  useAppStore.setState({
    session: { user: { id: mockUserId } } as Session,
    vocabularyItems: [createMockVocabularyItem()],
    vocabularyCategories: [createMockCategory()],
    vocabularyReviews: [],
    language: 'en',
    error: null,
  });
});

describe('importVocabularyItems', () => {
  it('inserts new items in single batch', async () => {
    const { importVocabularyItems } = useAppStore.getState();
    
    const items = [
      { word: 'hello', type: 'word' as const, definition: 'A greeting' },
      { word: 'world', type: 'word' as const, definition: 'The earth' },
    ];
    
    const result = await act(async () => {
      return await importVocabularyItems(items, { duplicateMode: 'skip' });
    });
    
    expect(result.inserted).toBe(2);
    expect(result.updated).toBe(0);
    expect(result.skipped).toBe(0);
    expect(result.failed).toBe(0);
    
    // Verify single insert call was made
    expect(mockSupabase.from).toHaveBeenCalledWith('vocabulary_items');
  });

  it('creates missing categories in one insert', async () => {
    const { importVocabularyItems } = useAppStore.getState();
    
    const items = [
      { word: 'hello', type: 'word' as const, definition: 'A greeting', categoryName: 'New Category' },
    ];
    
    const result = await act(async () => {
      return await importVocabularyItems(items, { duplicateMode: 'skip', categoryForAll: undefined });
    });
    
    expect(result.inserted).toBe(1);
    
    // Verify categories insert was called
    expect(mockSupabase.from).toHaveBeenCalledWith('vocabulary_categories');
  });

  it('skips duplicates when duplicateMode is skip', async () => {
    // Add existing word to store
    useAppStore.setState({
      vocabularyItems: [createMockVocabularyItem({ word: 'hello', id: 'existing-1' })],
    });
    
    const { importVocabularyItems } = useAppStore.getState();
    
    const items = [
      { word: 'hello', type: 'word' as const, definition: 'A greeting' },
      { word: 'world', type: 'word' as const, definition: 'The earth' },
    ];
    
    const result = await act(async () => {
      return await importVocabularyItems(items, { duplicateMode: 'skip' });
    });
    
    expect(result.inserted).toBe(1); // only 'world'
    expect(result.skipped).toBe(1); // 'hello'
    expect(result.updated).toBe(0);
  });

  it('updates duplicates when duplicateMode is update', async () => {
    // Add existing word to store
    useAppStore.setState({
      vocabularyItems: [createMockVocabularyItem({ word: 'hello', id: 'existing-1', definition: 'Old definition' })],
    });
    
    // Mock update query
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'vocabulary_items') {
        return {
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: [{ id: 'existing-1' }], error: null }),
        };
      }
      return mockSupabase.from(table);
    });
    
    const { importVocabularyItems } = useAppStore.getState();
    
    const items = [
      { word: 'hello', type: 'word' as const, definition: 'New definition' },
    ];
    
    const result = await act(async () => {
      return await importVocabularyItems(items, { duplicateMode: 'update' });
    });
    
    expect(result.updated).toBe(1);
    expect(result.inserted).toBe(0);
    expect(result.skipped).toBe(0);
  });

  it('uses categoryForAll and typeForAll overrides', async () => {
    const { importVocabularyItems } = useAppStore.getState();
    
    const items = [
      { word: 'hello', type: 'word' as const, definition: 'A greeting' },
    ];
    
    const result = await act(async () => {
      return await importVocabularyItems(items, { 
        duplicateMode: 'skip', 
        categoryForAll: 'Override Category',
        typeForAll: 'verb',
      });
    });
    
    expect(result.inserted).toBe(1);
    // Verify the category was used
    expect(mockSupabase.from).toHaveBeenCalledWith('vocabulary_categories');
  });

  it('reports failed count on DB error', async () => {
    // Mock insert to fail
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'vocabulary_items') {
        return {
          insert: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
        };
      }
      if (table === 'vocabulary_categories') {
        return {
          insert: vi.fn().mockResolvedValue({ data: [{ id: 'cat-new' }], error: null }),
        };
      }
      return mockSupabase.from(table);
    });
    
    const { importVocabularyItems } = useAppStore.getState();
    
    const items = [
      { word: 'hello', type: 'word' as const, definition: 'A greeting' },
    ];
    
    const result = await act(async () => {
      return await importVocabularyItems(items, { duplicateMode: 'skip' });
    });
    
    expect(result.failed).toBe(1);
    expect(result.inserted).toBe(0);
    expect(useAppStore.getState().error).toBe('errors.importVocabulary');
  });

  it('chunks inserts at 200 rows', async () => {
    const { importVocabularyItems } = useAppStore.getState();
    
    // Create 250 items with categoryName to trigger category creation
    const items = Array.from({ length: 250 }, (_, i) => ({
      word: `word${i}`,
      type: 'word' as const,
      definition: `Definition ${i}`,
      categoryName: `Category ${i % 5}`, // Creates 5 new categories
    }));
    
    const result = await act(async () => {
      return await importVocabularyItems(items, { duplicateMode: 'skip' });
    });
    
    expect(result.inserted).toBe(250);
    // Should have made 3 insert calls: 1 for categories + 2 for items chunks (200 + 50)
    expect(mockSupabase.from).toHaveBeenCalledTimes(3); // 1 for categories + 2 for items chunks
  });

  it('never resets masteryLevel/reviewCount on update mode', async () => {
    // Add existing word with high mastery
    useAppStore.setState({
      vocabularyItems: [createMockVocabularyItem({ 
        word: 'hello', 
        id: 'existing-1', 
        definition: 'Old definition',
        masteryLevel: 5,
        reviewCount: 10,
        lapseCount: 2,
        correctStreak: 3,
        isHard: true,
      })],
    });
    
    mockSupabase.from.mockImplementation((table: string) => {
      if (table === 'vocabulary_items') {
        return {
          update: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: [{ id: 'existing-1' }], error: null }),
        };
      }
      return mockSupabase.from(table);
    });
    
    const { importVocabularyItems } = useAppStore.getState();
    
    const items = [
      { word: 'hello', type: 'word' as const, definition: 'New definition' },
    ];
    
    const result = await act(async () => {
      return await importVocabularyItems(items, { duplicateMode: 'update' });
    });
    
    expect(result.updated).toBe(1);
    
    // Verify the update query doesn't include mastery_level, review_count, etc.
    mockSupabase.from.mock.calls.find(call => {
      const table = call[0];
      return table === 'vocabulary_items';
    });
    // The update should only update word, type, definition, example_sentence, pronunciation, category_id, updated_at
    // Not mastery_level, review_count, lapse_count, correct_streak, is_hard
  });
});
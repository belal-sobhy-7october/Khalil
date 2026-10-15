import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { VocabularyItem, VocabularyCategory } from '../../types';
import { useAppStore } from '../../store/appStore';
import FlashcardReview from './FlashcardReview';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const vocabularyItems: VocabularyItem[] = [
  {
    id: 'v1',
    userId: 'user1',
    word: 'hello',
    type: 'word',
    definition: 'A greeting',
    exampleSentence: 'Hello, world!',
    pronunciation: 'huh-LOH',
    categoryId: 'c1',
    masteryLevel: 1,
    reviewCount: 0,
    lapseCount: 0,
    correctStreak: 0,
    isHard: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'v2',
    userId: 'user1',
    word: 'world',
    type: 'word',
    definition: 'The earth',
    exampleSentence: 'Hello, world!',
    pronunciation: 'wurld',
    categoryId: 'c1',
    masteryLevel: 2,
    reviewCount: 0,
    lapseCount: 0,
    correctStreak: 0,
    isHard: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'v3',
    userId: 'user1',
    word: 'test',
    type: 'word',
    definition: 'A trial',
    exampleSentence: 'This is a test.',
    pronunciation: 'test',
    categoryId: 'c1',
    masteryLevel: 1,
    reviewCount: 0,
    lapseCount: 0,
    correctStreak: 0,
    isHard: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const vocabularyCategories: VocabularyCategory[] = [
  {
    id: 'c1',
    userId: 'user1',
    name: 'General',
    color: '#ff0000',
    icon: 'book',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const submitVocabularyReview = vi.fn().mockResolvedValue(undefined);
const onClose = vi.fn();

beforeEach(() => {
  submitVocabularyReview.mockReset();
  submitVocabularyReview.mockResolvedValue(undefined);
  onClose.mockReset();
  useAppStore.setState({
    language: 'en',
    vocabularyItems: [...vocabularyItems],
    vocabularyCategories: [...vocabularyCategories],
    submitVocabularyReview,
  });
});

describe('FlashcardReview', () => {
  it('correct answer advances to the next word without showing the definition', async () => {
    render(<FlashcardReview onClose={onClose} />);

    // Should show first word in question phase (hello - masteryLevel 1, id v1)
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.queryByText('A greeting')).not.toBeInTheDocument();

    // Click correct button (use role to avoid matching hint text)
    const correctButton = screen.getAllByRole('button').find((btn) => btn.textContent?.includes('I know it') && !btn.textContent?.includes('→'));
    if (!correctButton) throw new Error('Correct button not found');
    fireEvent.click(correctButton);

    // Should submit review
    expect(submitVocabularyReview).toHaveBeenCalledWith('v1', 'correct', expect.any(Number));

    // Wait for auto-advance (300ms delay)
    await waitFor(
      () => {
        // Should show second word (test - masteryLevel 1, id v3), not definition
        expect(screen.getByText('test')).toBeInTheDocument();
        expect(screen.queryByText('A greeting')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it('incorrect answer shows the definition and only advances after Next', async () => {
    render(<FlashcardReview onClose={onClose} />);

    // Should show first word in question phase
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.queryByText('A greeting')).not.toBeInTheDocument();

    // Click incorrect button (use role to avoid matching hint text)
    const incorrectButton = screen.getAllByRole('button').find((btn) => btn.textContent?.includes("I don't know it") && !btn.textContent?.includes('←'));
    if (!incorrectButton) throw new Error('Incorrect button not found');
    fireEvent.click(incorrectButton);

    // Should submit review
    expect(submitVocabularyReview).toHaveBeenCalledWith('v1', 'incorrect', expect.any(Number));

    // Should now show definition (answer phase) - word is not shown in answer phase
    await waitFor(() => {
      expect(screen.getByText('A greeting')).toBeInTheDocument();
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
      expect(screen.getByText('huh-LOH')).toBeInTheDocument();
    });

    // Click Next button
    const nextButton = screen.getAllByRole('button').find((btn) => btn.textContent?.includes('Next'));
    if (!nextButton) throw new Error('Next button not found');
    fireEvent.click(nextButton);

    // Should advance to next word (test - masteryLevel 1, id v3)
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.queryByText('A greeting')).not.toBeInTheDocument();
    });
  });

  it('queue stays stable when a correct answer pushes an item masteryLevel above 2', async () => {
    render(<FlashcardReview onClose={onClose} />);

    // Mock the store update to simulate mastery level increase
    submitVocabularyReview.mockImplementation(async (itemId, result) => {
      if (result === 'correct') {
        // Simulate store updating mastery level
        useAppStore.setState((state) => ({
          vocabularyItems: state.vocabularyItems.map((item) =>
            item.id === itemId ? { ...item, masteryLevel: 3 } : item
          ),
        }));
      }
    });

    // Click correct on first word (mastery goes from 1 to 3)
    const correctButton = screen.getAllByRole('button').find((btn) => btn.textContent?.includes('I know it') && !btn.textContent?.includes('→'));
    if (!correctButton) throw new Error('Correct button not found');
    fireEvent.click(correctButton);

    // Wait for auto-advance
    await waitFor(
      () => {
        // Should show second word (test), not skip to third
        expect(screen.getByText('test')).toBeInTheDocument();
      },
      { timeout: 500 }
    );

    // Verify the queue didn't skip - we should see all 3 words in order
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.queryByText('world')).not.toBeInTheDocument();
  });

  it('summary shows correct numbers', async () => {
    render(<FlashcardReview onClose={onClose} />);

    // Answer first word correctly (hello)
    const correctButton1 = screen.getAllByRole('button').find((btn) => btn.textContent?.includes('I know it') && !btn.textContent?.includes('→'));
    if (!correctButton1) throw new Error('Correct button not found');
    fireEvent.click(correctButton1);
    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
    }, { timeout: 500 });

    // Answer second word incorrectly (test) - this will re-ask it later
    const incorrectButton = screen.getAllByRole('button').find((btn) => btn.textContent?.includes("I don't know it") && !btn.textContent?.includes('←'));
    if (!incorrectButton) throw new Error('Incorrect button not found');
    fireEvent.click(incorrectButton);
    await waitFor(() => {
      expect(screen.getByText('A trial')).toBeInTheDocument();
    });

    // Click next
    const nextButton1 = screen.getAllByRole('button').find((btn) => btn.textContent?.includes('Next'));
    if (!nextButton1) throw new Error('Next button not found');
    fireEvent.click(nextButton1);
    await waitFor(() => {
      expect(screen.getByText('world')).toBeInTheDocument();
    });

    // Answer third word correctly (world)
    const correctButton2 = screen.getAllByRole('button').find((btn) => btn.textContent?.includes('I know it') && !btn.textContent?.includes('→'));
    if (!correctButton2) throw new Error('Correct button not found');
    fireEvent.click(correctButton2);
    await waitFor(() => {
      // Should show re-asked test card (4th card)
      expect(screen.getByText('test')).toBeInTheDocument();
    }, { timeout: 500 });

    // Answer re-asked test card correctly
    const correctButton3 = screen.getAllByRole('button').find((btn) => btn.textContent?.includes('I know it') && !btn.textContent?.includes('→'));
    if (!correctButton3) throw new Error('Correct button not found');
    fireEvent.click(correctButton3);
    await waitFor(() => {
      // Should show summary
      expect(screen.getByText(/Review Complete/i)).toBeInTheDocument();
    }, { timeout: 500 });

    // Check summary stats: 3 correct (hello, world, test re-ask), 1 incorrect (test first try)
    expect(screen.getByText(/Correct: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Incorrect: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Accuracy: 75%/i)).toBeInTheDocument();

    // Should show missed words (only test from first incorrect)
    expect(screen.getAllByText(/Missed Words/i)).toHaveLength(2);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('A trial')).toBeInTheDocument();
  });

  it('shows empty state when there are no words to review', () => {
    useAppStore.setState({
      vocabularyItems: vocabularyItems.map((item) => ({ ...item, masteryLevel: 5, lapseCount: 0, correctStreak: 0, isHard: false })),
    });

    render(<FlashcardReview onClose={onClose} />);

    expect(screen.getByText(/No words to review/i)).toBeInTheDocument();
    expect(screen.getByText(/All words are mastered/i)).toBeInTheDocument();
  });

  it('keyboard shortcuts work for correct/incorrect/next/close', async () => {
    render(<FlashcardReview onClose={onClose} />);

    // ArrowRight or 1 for correct
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(submitVocabularyReview).toHaveBeenCalledWith('v1', 'correct', expect.any(Number));

    await waitFor(() => {
      expect(screen.getByText('test')).toBeInTheDocument();
    }, { timeout: 500 });

    // ArrowLeft or 2 for incorrect
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    await waitFor(() => {
      expect(screen.getByText('A trial')).toBeInTheDocument();
    });

    // Enter for next
    fireEvent.keyDown(window, { key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText('world')).toBeInTheDocument();
    });

    // Escape for close
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});

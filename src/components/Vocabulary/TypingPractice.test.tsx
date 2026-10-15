import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import TypingPractice from './TypingPractice';
import type { VocabularyItem } from '../../types';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
vi.mock('../../lib/pronunciation', () => ({
  speakWord: vi.fn(async () => {}),
  speakBrowser: vi.fn(),
  getPronunciationPrefs: () => ({ accent: 'us' }),
}));

const item = (id: string, word: string, exampleSentence?: string): VocabularyItem => ({
  id, userId: 'u', word, type: 'word', definition: `definition of ${word}`, exampleSentence,
  masteryLevel: 0, reviewCount: 0, lapseCount: 0, correctStreak: 0, isHard: false, createdAt: '', updatedAt: '',
});

const submitVocabularyReview = vi.fn(async () => {});

beforeEach(() => {
  submitVocabularyReview.mockClear();
  useAppStore.setState({
    language: 'en',
    submitVocabularyReview,
    vocabularyItems: [item('a', 'negotiate', 'We negotiated a better price.'), item('b', 'refund')],
  });
});

describe('TypingPractice', () => {
  it('complete-the-sentence: blanks the word and grades the inflected form', () => {
    render(<TypingPractice mode="gap" initialItemIds={['a', 'b']} onClose={() => {}} />);
    expect(screen.getByText(/We/)).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Type your answer…');
    fireEvent.change(input, { target: { value: 'negotiated' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Correct!')).toBeInTheDocument();
    expect(submitVocabularyReview).toHaveBeenCalledWith('a', 'correct', expect.any(Number));

    // Next word has no example: falls back to its definition.
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('definition of refund')).toBeInTheDocument();
  });

  it('listen & type: a wrong answer is recorded and the answer shown; session ends with a score', () => {
    render(<TypingPractice mode="listen" initialItemIds={['b']} onClose={() => {}} />);
    const input = screen.getByPlaceholderText('Type your answer…');
    fireEvent.change(input, { target: { value: 'return' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('refund')).toBeInTheDocument();
    expect(submitVocabularyReview).toHaveBeenCalledWith('b', 'incorrect', expect.any(Number));
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('0 / 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Practise the 1 missed again/ })).toBeInTheDocument();
  });
});

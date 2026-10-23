import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { SrsCard, VocabularyCategory, VocabularyItem } from '../../types';
import { useAppStore } from '../../store/appStore';
import { saveKv } from '../../lib/userKv';
import { OWN_SENTENCES_KEY, newCard } from '../../lib/srs';
import FlashcardReview from './FlashcardReview';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
vi.mock('../../lib/userKv', () => ({
  readLocalKv: (_k: string, f: unknown) => f,
  loadKv: vi.fn(async (_u: string, _k: string, f: unknown) => f),
  saveKv: vi.fn(async () => true),
}));
vi.mock('./YouGlishModal', () => ({ default: () => <div>youglish</div> }));

const word = (id: string, w: string, definition: string, over: Partial<VocabularyItem> = {}): VocabularyItem => ({
  id, userId: 'user1', word: w, type: 'word', definition, exampleSentence: `${w} in a sentence.`, categoryId: 'c1',
  masteryLevel: 0, reviewCount: 0, lapseCount: 0, correctStreak: 0, isHard: false,
  createdAt: `2024-01-0${id.slice(-1)}`, updatedAt: '2024-01-01', ...over,
});

const categories: VocabularyCategory[] = [{ id: 'c1', userId: 'user1', name: 'General', createdAt: '', updatedAt: '' }];
const submitVocabularyReview = vi.fn(async (itemId: string, _result: string, _time?: number, srs?: SrsCard) => {
  // Apply the state like the store does, so learning steps come back.
  useAppStore.setState((s) => ({ vocabularyItems: s.vocabularyItems.map((i) => (i.id === itemId ? { ...i, srs } : i)) }));
});

function setup(items: VocabularyItem[], props: Partial<Parameters<typeof FlashcardReview>[0]> = {}) {
  useAppStore.setState({ vocabularyItems: items, vocabularyCategories: categories, submitVocabularyReview } as never);
  const onClose = vi.fn();
  render(<FlashcardReview onClose={onClose} {...props} />);
  return { onClose };
}

const showAnswer = () => fireEvent.click(screen.getByRole('button', { name: /Show answer/ }));
const gradeButton = (name: string) => screen.getByRole('button', { name: new RegExp(`^${name}`) });

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  useAppStore.setState({ language: 'en', session: { user: { id: 'user1' } } as never });
});

describe('FlashcardReview', () => {
  it('shows the word, then the answer with four grades and when each brings it back', () => {
    setup([word('v1', 'hello', 'A greeting')]);
    expect(screen.getByRole('heading', { name: 'hello' })).toBeInTheDocument();
    expect(screen.queryByText('A greeting')).not.toBeInTheDocument();
    showAnswer();
    expect(screen.getByText('A greeting')).toBeInTheDocument();
    expect(screen.getByText('hello in a sentence.')).toBeInTheDocument();
    expect(screen.getByTestId('srs-wait-1')).toHaveTextContent('1m');
    expect(screen.getByTestId('srs-wait-2')).toHaveTextContent('6m');
    expect(screen.getByTestId('srs-wait-3')).toHaveTextContent('10m');
    expect(screen.getByTestId('srs-wait-4')).toHaveTextContent(/\d+d/);
  });

  it('grading sends the previewed state, and learning steps come back in the same session', () => {
    const onFinished = vi.fn();
    setup([word('v1', 'hello', 'A greeting'), word('v2', 'world', 'The earth')], { onFinished });
    showAnswer();
    fireEvent.click(gradeButton('Good'));
    expect(submitVocabularyReview).toHaveBeenLastCalledWith('v1', 'correct', expect.any(Number), expect.objectContaining({ state: 1 }));
    expect(screen.getByRole('heading', { name: 'world' })).toBeInTheDocument();
    showAnswer();
    fireEvent.click(gradeButton('Good'));
    // Nothing else left: the 10-minute step is shown now (learn ahead), then the word graduates.
    expect(screen.getByRole('heading', { name: 'hello' })).toBeInTheDocument();
    showAnswer();
    expect(screen.getByTestId('srs-wait-3')).toHaveTextContent(/\d+d/);
    fireEvent.click(gradeButton('Good'));
    expect(screen.getByRole('heading', { name: 'world' })).toBeInTheDocument();
    showAnswer();
    fireEvent.click(gradeButton('Easy'));
    expect(screen.getByText('Review Complete')).toBeInTheDocument();
    expect(screen.getByTestId('srs-summary')).toHaveTextContent('4 reviewed · remembered 100%');
    expect(onFinished).toHaveBeenCalledTimes(1);
    expect(onFinished).toHaveBeenCalledWith(4);
  });

  it('a forgotten word is listed once at the end and can be reviewed again', () => {
    const onReviewMissed = vi.fn();
    const { onClose } = setup([word('v1', 'hello', 'A greeting')], { onReviewMissed });
    showAnswer();
    fireEvent.click(gradeButton('Again'));
    expect(submitVocabularyReview).toHaveBeenLastCalledWith('v1', 'incorrect', expect.any(Number), expect.any(Object));
    // Back after a minute, in the same session.
    showAnswer();
    fireEvent.click(gradeButton('Again'));
    showAnswer();
    fireEvent.click(gradeButton('Good'));
    showAnswer();
    fireEvent.click(gradeButton('Good'));
    expect(screen.getByText('Missed Words')).toBeInTheDocument();
    expect(screen.getAllByText('hello')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Review missed words again' }));
    expect(onReviewMissed).toHaveBeenCalledWith(['v1']);
    // The caller starts the new session; closing here would cancel it.
    expect(onClose).not.toHaveBeenCalled();
  });

  it('keyboard: Space shows the answer, 1–4 grade, Space again = Good', () => {
    setup([word('v1', 'hello', 'A greeting'), word('v2', 'world', 'The earth')]);
    fireEvent.keyDown(window, { key: ' ' });
    expect(screen.getByText('A greeting')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: '4' });
    expect(submitVocabularyReview).toHaveBeenLastCalledWith('v1', 'correct', expect.any(Number), expect.objectContaining({ state: 2 }));
    fireEvent.keyDown(window, { key: 'Enter' });
    fireEvent.keyDown(window, { key: ' ' });
    expect(submitVocabularyReview).toHaveBeenCalledTimes(2);
    expect(submitVocabularyReview.mock.calls[1][0]).toBe('v2');
  });

  it('nothing due: says so and when the next words come back', () => {
    const later: SrsCard = { ...newCard(new Date()), state: 2, stability: 5, reps: 3, scheduled_days: 3, last_review: new Date().toISOString(), due: new Date(Date.now() + 3 * 86400000).toISOString() };
    setup([word('v1', 'hello', 'A greeting', { srs: later, reviewCount: 3, lastReviewedAt: new Date().toISOString() })]);
    expect(screen.getByText('All caught up!')).toBeInTheDocument();
    expect(screen.getByText(/Next words come back in 3d/)).toBeInTheDocument();
  });

  it('hard words get a "make it stick" step: your own sentence is saved apart from the word', () => {
    setup([word('v1', 'hello', 'A greeting', { isHard: true })]);
    expect(screen.getByText('Hard')).toBeInTheDocument();
    showAnswer();
    const panel = screen.getByText('Make it stick').closest('div')!.parentElement as HTMLElement;
    fireEvent.change(within(panel).getByRole('textbox', { name: 'Your sentence' }), { target: { value: 'I say hello to my neighbour every morning.' } });
    fireEvent.click(within(panel).getByRole('button', { name: /Save/ }));
    expect(saveKv).toHaveBeenCalledWith('user1', OWN_SENTENCES_KEY, { v1: 'I say hello to my neighbour every morning.' });
    expect(screen.getByText('I say hello to my neighbour every morning.')).toBeInTheDocument();
    // The word itself is not changed.
    expect(useAppStore.getState().vocabularyItems[0].exampleSentence).toBe('hello in a sentence.');
  });

  it('a new day limit: only the daily number of new words is in the session', () => {
    const many = Array.from({ length: 25 }, (_, i) => word(`n${String(i).padStart(2, '0')}`, `w${i}`, `d${i}`, { createdAt: `2024-01-${String(i + 1).padStart(2, '0')}` }));
    setup(many);
    expect(within(screen.getByTestId('srs-left')).getAllByText('20')).toHaveLength(1);
  });

  it('speaks Arabic units on the buttons', () => {
    useAppStore.setState({ language: 'ar' });
    setup([word('v1', 'hello', 'A greeting')]);
    fireEvent.click(screen.getByRole('button', { name: /اظهر الإجابة/ }));
    expect(screen.getByTestId('srs-wait-3')).toHaveTextContent('10 د');
    expect(screen.getByRole('button', { name: /^افتكرتها/ })).toBeInTheDocument();
  });
});

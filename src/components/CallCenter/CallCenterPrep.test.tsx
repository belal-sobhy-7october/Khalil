import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import CallCenterPrep from './CallCenterPrep';
import { VOCAB_UNITS, vocabCategory } from '../../data/callCenter/vocab';
import type { VocabularyCategory, VocabularyItem } from '../../types';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
// Saved values stay for the test, like the device copy does in the app.
const kv = vi.hoisted(() => new Map<string, unknown>());
vi.mock('../../lib/userKv', () => ({
  readLocalKv: (k: string, f: unknown) => (kv.has(k) ? kv.get(k) : f),
  loadKv: vi.fn(async (_u: string, k: string, f: unknown) => (kv.has(k) ? kv.get(k) : f)),
  saveKv: vi.fn(async (_u: string, k: string, v: unknown) => {
    kv.set(k, v);
    return true;
  }),
}));
vi.mock('../../lib/topicChallenge', async (orig) => {
  const mod = await orig<typeof import('../../lib/topicChallenge')>();
  return { ...mod, loadChallenge: vi.fn(async () => mod.EMPTY_CHALLENGE), saveChallenge: vi.fn() };
});
vi.mock('../English/LoopPlayer', () => ({ default: () => <div data-testid="loop-player" /> }));
// jsdom runs no animation frames, so exit animations would never finish: leave at once.
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const category = (id: string, name: string): VocabularyCategory => ({ id, userId: 'u1', name, createdAt: '', updatedAt: '' });
const card = (id: string, word: string, categoryId: string): VocabularyItem => ({
  id, userId: 'u1', word, type: 'word', definition: 'd', categoryId,
  masteryLevel: 0, reviewCount: 0, lapseCount: 0, correctStreak: 0, isHard: false, createdAt: '2026-10-01', updatedAt: '',
});
const session = (email: string) => ({ user: { id: 'u1', email } }) as never;

beforeEach(() => {
  kv.clear();
  localStorage.clear();
  useAppStore.setState({ language: 'en', session: session('someone@example.com') });
});

describe('Call Center Prep', () => {
  it('opens on the diagnostic day', () => {
    render(<CallCenterPrep />);
    expect(screen.getByRole('heading', { name: 'Call Center English Prep' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Diagnostic day' })).toBeInTheDocument();
    expect(screen.getByText('Voice note: introduce yourself')).toBeInTheDocument();
    expect(screen.getByText('Diagnostic test')).toBeInTheDocument();
    expect(screen.getByText('EF SET: the free English test')).toBeInTheDocument();
  });

  it('ticks a task and saves it', async () => {
    render(<CallCenterPrep />);
    // Let the saved values load first, as they do in the app before anyone can click.
    await act(() => new Promise((r) => setTimeout(r, 0)));
    fireEvent.click(screen.getAllByRole('button', { name: 'Mark as done' })[0]);
    await waitFor(() => expect(Object.keys((kv.get('callcenter-tasks') as Record<string, string>) ?? {})).toContain('L0-D1:voice:intro'));
    expect(screen.getAllByRole('button', { name: 'Mark as not done' })).toHaveLength(1);
  });

  it('moves to Level 1 once the diagnostic day is done', async () => {
    kv.set('callcenter-tasks', { 'L0-D1:voice:intro': '2026-10-17', 'L0-D1:test:L0-DIAG': '2026-10-17', 'L0-D1:link:efset': '2026-10-17' });
    render(<CallCenterPrep />);
    expect(await screen.findByRole('heading', { name: 'Day 1: Learn the week' })).toBeInTheDocument();
    expect(screen.getAllByText('P vs B').length).toBeGreaterThan(0);
  });

  it('starts the word bank on the first day of Level 1', async () => {
    kv.set('callcenter-tasks', { 'L0-D1:voice:intro': '2026-10-17', 'L0-D1:test:L0-DIAG': '2026-10-17', 'L0-D1:link:efset': '2026-10-17' });
    render(<CallCenterPrep />);
    expect(await screen.findByText('New words: Unit 1 · Call center basics')).toBeInTheDocument();
  });

  it("puts Ibrahim Adel's grammar lesson in every Level 1 day", async () => {
    kv.set('callcenter-tasks', { 'L0-D1:voice:intro': '2026-10-17', 'L0-D1:test:L0-DIAG': '2026-10-17', 'L0-D1:link:efset': '2026-10-17' });
    render(<CallCenterPrep />);
    await screen.findByRole('heading', { name: 'Day 1: Learn the week' });
    expect(screen.getByText(/^Grammar course · Ibrahim Adel · \d+ min$/)).toBeInTheDocument();
    expect(screen.getByText(/^Lesson 1 of 24:/)).toBeInTheDocument();
  });

  it('lets you save a new word from anywhere in the section', () => {
    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('button', { name: 'New word' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Call Center: My words' })).toBeInTheDocument();
  });

  it('has an optional Accent tab outside the plan', () => {
    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'Accent (extra)' }));
    expect(screen.getByText('Extra, not part of the plan.')).toBeInTheDocument();
    expect(screen.getAllByText(/Phonetics: Pronouncing Every Letter/).length).toBeGreaterThan(0);
  });

  it('has a Vocab tab with the 24 units and their words', async () => {
    useAppStore.setState({ vocabularyItems: [] });
    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'Vocab' }));
    expect(screen.getByRole('heading', { name: 'Call Center Vocabulary' })).toBeInTheDocument();
    expect(screen.getByText('Phrasal verbs for calls')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Call center basics/ }));
    expect(screen.getByText('A person whose job is to answer customers\' calls, chats or emails for a company.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hear "agent" on YouGlish' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add the 16 words to my flashcards/ })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /NaturalReader/ }).length).toBeGreaterThan(0);
  });

  it('gives a unit the Vocabulary section\'s tools once its words are in the flashcards', async () => {
    const unit1 = VOCAB_UNITS[0];
    const cat = category('c1', vocabCategory(unit1));
    useAppStore.setState({ vocabularyCategories: [cat], vocabularyItems: unit1.words.map((w, i) => card(`v${i}`, w.word, cat.id)) });
    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'Vocab' }));
    fireEvent.click(screen.getByRole('button', { name: /Call center basics/ }));
    expect(screen.getByRole('button', { name: 'Mark "agent" as hard' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '4 · Use them: the unit challenge' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Start the challenge/ }));
    // The unit's own text is the first one to read aloud and record.
    fireEvent.click(await screen.findByRole('tab', { name: /Listen & repeat/ }));
    expect(within(screen.getByRole('dialog')).getByText(unit1.text)).toBeInTheDocument();
  });

  it('reviews due words in rounds of 30, hardest first', () => {
    const cat = category('c1', vocabCategory(VOCAB_UNITS[0]));
    const words = VOCAB_UNITS.slice(0, 3).flatMap((u) => u.words);
    useAppStore.setState({ vocabularyCategories: [cat], vocabularyItems: words.map((w, i) => card(`v${i}`, w.word, cat.id)) });
    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'Vocab' }));
    expect(screen.getByRole('button', { name: `Review 30 of ${words.length} due words` })).toBeInTheDocument();
  });

  it('lets you fix, flag and check your own words', () => {
    const mine = category('m', 'Call Center: My words');
    useAppStore.setState({ vocabularyCategories: [mine], vocabularyItems: [card('w1', 'troubleshooter', mine.id)] });
    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'Vocab' }));
    expect(screen.getByRole('heading', { name: 'troubleshooter' })).toBeInTheDocument();
    expect(screen.getByTitle('Edit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Check meanings/ })).toBeInTheDocument();
  });

  it('shows the levels on the roadmap, with 4 and 5 still to come', () => {
    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'Roadmap' }));
    for (const name of ['Foundation', 'Customer Service Core', 'Interview Bootcamp', 'Advanced', 'Overqualified']) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(screen.getAllByText('Coming next')).toHaveLength(2);
  });

  it('runs the diagnostic test from the Tests tab', () => {
    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'Tests' }));
    const row = screen.getByText('Diagnostic test (where you start)').closest('li') as HTMLElement;
    fireEvent.click(within(row).getByRole('button', { name: 'Start' }));
    expect(screen.getByText('She ___ to work by bus every day.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'goes' }));
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    expect(screen.getByText('I ___ the email yesterday.')).toBeInTheDocument();
  });

  it('opens a question from the interview bank', () => {
    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'Interview' }));
    fireEvent.click(screen.getByRole('button', { name: /Tell me about yourself\./ }));
    expect(screen.getByRole('button', { name: /Show a model answer/ })).toBeInTheDocument();
  });
});

describe('Call Center Prep keeps your place', () => {
  const diagnosticDone = { 'L0-D1:voice:intro': '2026-10-17', 'L0-D1:test:L0-DIAG': '2026-10-17', 'L0-D1:link:efset': '2026-10-17' };

  it('resumes a test you left in the middle', async () => {
    const first = render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'Tests' }));
    fireEvent.click(within(screen.getByText('Diagnostic test (where you start)').closest('li') as HTMLElement).getByRole('button', { name: 'Start' }));
    fireEvent.click(screen.getByRole('button', { name: 'goes' }));
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
    fireEvent.click(screen.getByRole('button', { name: 'sent' }));
    first.unmount();

    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'Tests' }));
    const row = screen.getByText('Diagnostic test (where you start)').closest('li') as HTMLElement;
    fireEvent.click(within(row).getByRole('button', { name: /Continue \(2\/\d+\)/ }));
    expect(screen.getByText('I ___ the email yesterday.')).toBeInTheDocument();
    expect(screen.getByText(/Picked up where you stopped: question 2/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/ })).toBeEnabled();
  });

  it('keeps the answers of a half-done grammar exercise', () => {
    kv.set('callcenter-tasks', diagnosticDone);
    const first = render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('button', { name: /Present simple vs present continuous/ }));
    fireEvent.click(screen.getAllByRole('button', { name: 'live' })[0]);
    expect(screen.getByText('1 / 8 right')).toBeInTheDocument();
    first.unmount();

    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('button', { name: /Present simple vs present continuous/ }));
    expect(screen.getByText('1 / 8 right')).toBeInTheDocument();
  });

  it('saves your interview answer while you type', async () => {
    render(<CallCenterPrep />);
    fireEvent.click(screen.getByRole('tab', { name: 'Interview' }));
    fireEvent.click(screen.getByRole('button', { name: /Tell me about yourself\./ }));
    fireEvent.change(screen.getByLabelText(/Your own answer/), { target: { value: "I'm a developer from Cairo." } });
    await waitFor(() => expect((kv.get('callcenter-answers') as Record<string, { text: string }>)?.['tell-me-about-yourself']?.text).toBe("I'm a developer from Cairo."));
  });

  it('opens on the day you reached, with the next unfinished task open', async () => {
    kv.set('callcenter-tasks', { ...diagnosticDone, 'L1-W1-D1:sound:p-b': '2026-10-17' });
    render(<CallCenterPrep />);
    expect(await screen.findByRole('heading', { name: 'Day 1: Learn the week' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /New words: Unit 1/ })).toHaveAttribute('aria-expanded', 'true');
  });
});


import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import CallCenterPrep from './CallCenterPrep';
import Sidebar from '../Layout/Sidebar';

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
vi.mock('../English/LoopPlayer', () => ({ default: () => <div data-testid="loop-player" /> }));
// jsdom runs no animation frames, so exit animations would never finish: leave at once.
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const session = (email: string) => ({ user: { id: 'u1', email } }) as never;

beforeEach(() => {
  kv.clear();
  localStorage.clear();
  useAppStore.setState({ language: 'en', session: session('someone@example.com') });
});

afterEach(() => {
  vi.unstubAllEnvs();
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

describe('Call Center Prep in the sidebar', () => {
  const nav = () => render(<Sidebar activeSection="todo" onSectionChange={() => {}} isOpen onToggle={() => {}} />);

  it("isn't there for other accounts", async () => {
    nav();
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByRole('button', { name: 'Call Center Prep' })).not.toBeInTheDocument();
  });

  it('is there in a preview build', () => {
    vi.stubEnv('VITE_CALL_CENTER_PREVIEW', '1');
    nav();
    expect(screen.getByRole('button', { name: 'Call Center Prep' })).toBeInTheDocument();
  });
});

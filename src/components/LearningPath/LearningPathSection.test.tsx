import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import { addDaysToDateString, getToday } from '../../store/dateHelpers';
import { loadKv, saveKv } from '../../lib/userKv';
import { EMPTY_PATH_STATE, PATH_KV_KEY, buildPath, taskKey, type PathState } from '../../lib/learningPath';
import LearningPathSection from './LearningPathSection';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
vi.mock('../../lib/userKv', () => ({
  readLocalKv: (_k: string, f: unknown) => f,
  loadKv: vi.fn(async (_u: string, _k: string, f: unknown) => f),
  saveKv: vi.fn(async () => true),
}));

const today = getToday();
const path = buildPath();

/** State with the first `n` days fully done. */
function doneThrough(n: number, startedAt: string): PathState {
  const done: Record<string, string> = {};
  for (const d of path.slice(0, n)) for (const t of d.tasks) done[taskKey(d.day, t.id)] = addDaysToDateString(startedAt, d.day - 1);
  return { startedAt, done, notes: {} };
}

const lastSaved = () => {
  const calls = vi.mocked(saveKv).mock.calls.filter(([, key]) => key === PATH_KV_KEY);
  return calls[calls.length - 1]?.[2] as PathState | undefined;
};

const RAW_KEY = /\b(path|vocabulary|a11y|nav)\.[a-zA-Z]+/;
function expectNoRawKeys() {
  expect(document.body.textContent).not.toMatch(RAW_KEY);
  for (const el of document.querySelectorAll('[aria-label],[title],[placeholder]')) {
    for (const attr of ['aria-label', 'title', 'placeholder']) expect(el.getAttribute(attr) ?? '').not.toMatch(RAW_KEY);
  }
}

beforeEach(() => {
  localStorage.clear();
  vi.mocked(saveKv).mockClear();
  vi.mocked(loadKv).mockImplementation(async (_u, _k, f) => f);
  useAppStore.setState({
    language: 'en',
    session: { user: { id: 'u1' } } as unknown as ReturnType<typeof useAppStore.getState>['session'],
  });
});

describe('LearningPathSection', () => {
  it.each(['en', 'ar'] as const)('shows the intro, then day 1 after starting (%s)', async (language) => {
    useAppStore.setState({ language });
    render(<LearningPathSection />);
    expectNoRawKeys();
    fireEvent.click(screen.getByRole('button', { name: language === 'en' ? 'Start day 1' : 'ابدأ اليوم الأول' }));
    expect(lastSaved()).toEqual({ ...EMPTY_PATH_STATE, startedAt: today });
    expect(screen.getByRole('heading', { level: 2, name: /Day 1|اليوم 1/ })).toBeInTheDocument();
    expect(screen.getByText(language === 'en' ? 'Record your starting point' : 'سجّل نقطة البداية')).toBeInTheDocument();
    expectNoRawKeys();
  });

  it('ticking tasks saves progress to the path key only and finishes the day', async () => {
    const vocabBefore = useAppStore.getState().vocabularyItems;
    render(<LearningPathSection />);
    fireEvent.click(screen.getByRole('button', { name: 'Start day 1' }));
    const day1 = path[0];
    for (const [i, task] of day1.tasks.entries()) {
      const row = document.querySelector(`[data-task="${task.id}"]`) as HTMLElement;
      fireEvent.click(within(row).getByRole('button', { name: /^Mark as complete/ }));
      expect(screen.getByTestId('path-day-progress')).toHaveTextContent(`${i + 1}/${day1.tasks.length}`);
    }
    expect(lastSaved()?.done).toEqual(Object.fromEntries(day1.tasks.map((t) => [taskKey(1, t.id), today])));
    expect(screen.getByRole('status')).toHaveTextContent('Day 1 done');
    // Day 1 finished on the start date is on schedule, not ahead.
    expect(screen.getByTestId('path-schedule')).toHaveTextContent('On schedule');
    expect(Number(screen.getByTestId('path-percent').textContent?.replace('%', ''))).toBeGreaterThan(0);
    // Nothing but the path's own key was written; the word list is untouched.
    expect(vi.mocked(saveKv).mock.calls.every(([, key]) => key === PATH_KV_KEY)).toBe(true);
    expect(useAppStore.getState().vocabularyItems).toBe(vocabBefore);

    fireEvent.click(screen.getByRole('button', { name: 'Start day 2' }));
    expect(screen.getByRole('heading', { level: 2, name: /Day 2/ })).toBeInTheDocument();
    // Un-ticking works too.
    fireEvent.click(screen.getByRole('button', { name: 'Previous day' }));
    fireEvent.click(within(document.querySelector('[data-task="warmup"]') as HTMLElement).getByRole('button', { name: /^Mark as incomplete/ }));
    expect(lastSaved()?.done[taskKey(1, 'warmup')]).toBeUndefined();
  });

  it('opens on the first unfinished day from the saved state and shows the schedule', async () => {
    const startedAt = addDaysToDateString(today, -9);
    vi.mocked(loadKv).mockImplementation(async () => doneThrough(3, startedAt));
    render(<LearningPathSection />);
    expect(await screen.findByRole('heading', { level: 2, name: /Day 4/ })).toBeInTheDocument();
    // Day 10 on the calendar, day 4 in the path.
    expect(screen.getByTestId('path-schedule')).toHaveTextContent('6 days behind schedule');
    expect(screen.getByText('Day 4 of 90')).toBeInTheDocument();
  });

  it('counts days finished beyond the calendar as ahead', async () => {
    vi.mocked(loadKv).mockImplementation(async () => doneThrough(3, today));
    render(<LearningPathSection />);
    expect(await screen.findByTestId('path-schedule')).toHaveTextContent('2 days ahead');
  });

  it('keeps a day finished today open instead of handing over the next one', async () => {
    vi.mocked(loadKv).mockImplementation(async () => {
      const s = doneThrough(2, addDaysToDateString(today, -1));
      for (const t of path[1].tasks) s.done[taskKey(2, t.id)] = today;
      return s;
    });
    render(<LearningPathSection />);
    expect(await screen.findByRole('heading', { level: 2, name: /Day 2/ })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent("That's today's work");
    expect(screen.getByTestId('path-schedule')).toHaveTextContent('On schedule');
    fireEvent.click(screen.getByRole('button', { name: 'Start day 3' }));
    expect(screen.getByRole('heading', { level: 2, name: /Day 3/ })).toBeInTheDocument();
  });

  it('saves notes once typing pauses', async () => {
    vi.mocked(loadKv).mockImplementation(async () => ({ ...EMPTY_PATH_STATE, startedAt: today }));
    render(<LearningPathSection />);
    await screen.findByText('Record your starting point');
    fireEvent.click(screen.getByText('Your own sentences'));
    fireEvent.change(screen.getByPlaceholderText(/Write here/), { target: { value: 'I sometimes feel awkward at parties.' } });
    expect(lastSaved()?.notes ?? {}).toEqual({});
    await waitFor(() => expect(lastSaved()?.notes[taskKey(1, 'sentences-1')]).toBe('I sometimes feel awkward at parties.'), { timeout: 2000 });
  });

  it('start over clears only the path after confirming', async () => {
    vi.mocked(loadKv).mockImplementation(async () => doneThrough(5, addDaysToDateString(today, -5)));
    render(<LearningPathSection />);
    await screen.findByRole('heading', { level: 2, name: /Day 6/ });
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
    fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
    expect(screen.getByRole('heading', { level: 2, name: /Day 6/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Start over' }));
    expect(lastSaved()).toEqual(EMPTY_PATH_STATE);
    expect(screen.getByRole('button', { name: 'Start day 1' })).toBeInTheDocument();
    confirm.mockRestore();
  });

  it.each(['en', 'ar'] as const)('every day and task renders without missing translations (%s)', async (language) => {
    useAppStore.setState({ language });
    vi.mocked(loadKv).mockImplementation(async () => ({ ...EMPTY_PATH_STATE, startedAt: today }));
    render(<LearningPathSection />);
    await screen.findByTestId('path-percent');
    const roadmap = screen.getByRole('heading', { name: language === 'en' ? 'Roadmap' : 'خريطة المسار' }).closest('section') as HTMLElement;
    const dayButtons = within(roadmap).getAllByRole('button');
    expect(dayButtons).toHaveLength(90);
    for (const [i, button] of dayButtons.entries()) {
      act(() => button.click());
      expect(screen.getByRole('heading', { level: 2, name: new RegExp(`(Day|اليوم) ${i + 1} `) })).toBeInTheDocument();
      for (const task of path[i].tasks) {
        const row = document.querySelector(`[data-task="${task.id}"]`) as HTMLElement;
        const toggle = row.querySelector('[aria-expanded]') as HTMLElement;
        if (toggle.getAttribute('aria-expanded') !== 'true') act(() => toggle.click());
        expect(row.textContent).not.toMatch(/\{(topic|title|name|from|to|n)\}/);
      }
      expectNoRawKeys();
    }
  }, 30000);
});

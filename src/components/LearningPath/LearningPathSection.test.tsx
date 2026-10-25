import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import { getToday } from '../../store/dateHelpers';
import { loadKv, saveKv } from '../../lib/userKv';
import { PATH_KV_KEY, buildPath, defaultSettings, emptyPathState, packById, wordsOf, type PathItem, type PathState } from '../../lib/learningPath';
import { COURSE_POSITIONS_KEY, COURSE_PROGRESS_KEY } from '../../lib/courseProgress';
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
vi.mock('../Vocabulary/YouGlishModal', () => ({ default: () => null }));
type SimProps = { onProgress?: (s: number, playing: boolean) => void; onEnded?: () => void; source: { videoId: string | null; start?: number }; compact?: boolean };
vi.mock('../English/LoopPlayer', () => ({
  default: ({ onProgress, source, compact }: SimProps) => (
    <div data-testid="loop-player" data-video={source.videoId ?? ''} data-start={source.start ?? 0} data-compact={String(!!compact)}>
      <button onClick={() => onProgress?.(30, false)}>sim: pause at 0:30</button>
      <button onClick={() => onProgress?.(100_000, true)}>sim: near the end</button>
    </div>
  ),
}));

const today = getToday();
const path = buildPath();
const onOpenTab = vi.fn();
const started = (over: Partial<PathState> = {}): PathState => ({ ...emptyPathState(), startedAt: today, ...over });

/** What the database holds, by user_kv key. */
function serve(values: Record<string, unknown>) {
  vi.mocked(loadKv).mockImplementation(async (_u, k, f) => (k in values ? values[k] : f) as never);
}

const lastSaved = <T,>(key: string) => {
  const calls = vi.mocked(saveKv).mock.calls.filter(([, k]) => k === key);
  return calls[calls.length - 1]?.[2] as T | undefined;
};

const block = (section: string) => document.querySelector(`[data-block="${section}"]`) as HTMLElement;
const openBlock = (section: string) => {
  const b = block(section);
  if (within(b).getAllByRole('button')[0].getAttribute('aria-expanded') !== 'true') fireEvent.click(within(b).getAllByRole('button')[0]);
  return block(section);
};
/** Day 1 is on screen and has opened its first block (the saved path arrives after the first render). */
async function dayOpened() {
  await screen.findByRole('heading', { level: 2, name: 'Day 1' });
  await act(async () => {});
}
const lessonOf = (day: number, section: string) => {
  const item = path[day - 1].blocks.find((b) => b.section === section)!.items[0];
  if (item.item.kind !== 'lesson') throw new Error(`day ${day} ${section} has a lesson first`);
  return { key: item.key, lesson: item.item.lesson, item: item.item as Extract<PathItem, { kind: 'lesson' }> };
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
  onOpenTab.mockClear();
  serve({});
  useAppStore.setState({
    language: 'en',
    session: { user: { id: 'u1' } } as unknown as ReturnType<typeof useAppStore.getState>['session'],
    vocabularyItems: [],
    vocabularyCategories: [],
  });
});

describe('LearningPathSection', () => {
  it.each(['en', 'ar'] as const)('shows the six sections and the settings, then day 1 after starting (%s)', async (language) => {
    useAppStore.setState({ language });
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    await act(async () => {}); // the saved values load first
    expectNoRawKeys();
    expect(screen.getAllByText(language === 'en' ? /around 2h a day/ : /نحو 2 ساعة في اليوم/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: language === 'en' ? 'Start day 1' : 'ابدأ اليوم الأول' }));
    await waitFor(() => expect(lastSaved<PathState>(PATH_KV_KEY)?.startedAt).toBe(today));
    expect(lastSaved<PathState>(PATH_KV_KEY)?.settings).toEqual(defaultSettings());
    expect(screen.getByRole('heading', { level: 2, name: /Day 1|اليوم 1/ })).toBeInTheDocument();
    expect([...document.querySelectorAll('[data-block]')].map((b) => b.getAttribute('data-block'))).toEqual([
      'vocabulary', 'pronunciation', 'listening', 'reading', 'grammar', 'shadowing',
    ]);
    expectNoRawKeys();
  });

  it('chooses the sources before starting', async () => {
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    await act(async () => {});
    fireEvent.click(screen.getAllByRole('radio', { name: /Ibrahim Adel/ })[0]);
    fireEvent.change(screen.getByRole('combobox', { name: 'Shadowing starts at' }), { target: { value: 'A2' } });
    fireEvent.click(screen.getByRole('button', { name: '30 min' }));
    fireEvent.click(screen.getByRole('button', { name: 'Start day 1' }));
    await waitFor(() => expect(lastSaved<PathState>(PATH_KV_KEY)?.startedAt).toBe(today));
    expect(lastSaved<PathState>(PATH_KV_KEY)?.settings).toMatchObject({ listening: 'ibrahim-adel', shadowingLevel: 'A2', minutes: 30 });
    expect(within(block('listening')).getByText(/^Ibrahim Adel · /)).toBeInTheDocument();
    expect(within(block('shadowing')).getByText(/A2 English Listening Practice/)).toBeInTheDocument();
  });

  it("opens the day's words with the review, and adds the words to the flashcards", async () => {
    const importVocabularyItems = vi.fn(async () => ({ inserted: 6, updated: 0, skipped: 0, failed: 0 }));
    useAppStore.setState({ importVocabularyItems } as never);
    serve({ [PATH_KV_KEY]: started() });
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    const vocabulary = await waitFor(() => {
      const b = block('vocabulary');
      expect(within(b).getByText('Review your flashcards')).toBeInTheDocument();
      return b;
    });
    const words = path[0].blocks[0].items[1].item;
    if (words.kind !== 'words') throw new Error('day 1 has words');
    for (const w of wordsOf(words)) expect(within(vocabulary).getByText(w.word)).toBeInTheDocument();
    fireEvent.click(within(vocabulary).getByRole('button', { name: /Add to my flashcards/ }));
    await waitFor(() => expect(importVocabularyItems).toHaveBeenCalledTimes(1));
    expect((importVocabularyItems.mock.calls[0] as unknown[])[1]).toMatchObject({ duplicateMode: 'skip', categoryForAll: packById(words.packId)!.title });
  });

  it('ticks the review of the day by itself when nothing is due', async () => {
    serve({ [PATH_KV_KEY]: started() });
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    await waitFor(() => expect(lastSaved<PathState>(PATH_KV_KEY)?.done['review:1']).toBe(today));
  });

  it('plays a lesson inside its block, saves where it stopped and ticks it at the end', async () => {
    serve({ [PATH_KV_KEY]: started() });
    const { key, lesson } = lessonOf(1, 'listening');
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    await dayOpened();
    const listening = openBlock('listening');
    expect(within(listening).getByText('Listen in five steps')).toBeInTheDocument();
    fireEvent.click(within(listening).getByRole('button', { name: 'Play' }));
    expect(screen.getByTestId('loop-player')).toHaveAttribute('data-video', lesson.id);
    fireEvent.click(screen.getByRole('button', { name: 'sim: pause at 0:30' }));
    expect(lastSaved(COURSE_POSITIONS_KEY)).toEqual({ [lesson.id]: 30 });
    fireEvent.click(screen.getByRole('button', { name: 'sim: near the end' }));
    expect(lastSaved(COURSE_PROGRESS_KEY)).toEqual({ [lesson.id]: today });
    const row = document.querySelector(`[data-item="${key}"]`) as HTMLElement;
    expect(within(row).getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'true');
    expect(within(block('listening')).getByText(/1\/1/)).toBeInTheDocument();
  });

  it('shows a lesson finished in its own tab as done, and starts a lesson where it stopped', async () => {
    const listening = lessonOf(1, 'listening');
    const shadowing = lessonOf(1, 'shadowing');
    serve({ [PATH_KV_KEY]: started(), [COURSE_PROGRESS_KEY]: { [listening.lesson.id]: today }, [COURSE_POSITIONS_KEY]: { [shadowing.lesson.id]: 200 } });
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    await dayOpened();
    await waitFor(() => expect(within(block('listening')).getByText(/1\/1/)).toBeInTheDocument());
    fireEvent.click(within(openBlock('shadowing')).getByRole('button', { name: 'Play' }));
    expect(screen.getByTestId('loop-player')).toHaveAttribute('data-start', '197');
  });

  it("links the day's British Council text, and ticks it by hand", async () => {
    const { key, lesson } = lessonOf(1, 'reading');
    serve({ [PATH_KV_KEY]: started() });
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    await dayOpened();
    const row = within(openBlock('reading')).getByText(lesson.title).closest('[data-item]') as HTMLElement;
    expect(within(row).getByRole('link', { name: /Read/ })).toHaveAttribute('href', lesson.url);
    fireEvent.click(within(row).getAllByRole('button')[0]);
    await waitFor(() => expect(lastSaved(COURSE_PROGRESS_KEY)).toEqual({ [lesson.id]: today }));
    expect(row.getAttribute('data-item')).toBe(key);
  });

  it('ticks a part of a long lesson once playback reaches its end', async () => {
    const day = path.find((d) => d.blocks.some((b) => b.items.some((i) => i.item.kind === 'lesson' && i.item.part?.index === 1)))!;
    const b = day.blocks.find((x) => x.items.some((i) => i.item.kind === 'lesson' && i.item.part?.index === 1))!;
    const part = b.items.find((i) => i.item.kind === 'lesson' && i.item.part?.index === 1)!;
    if (part.item.kind !== 'lesson' || !part.item.part) throw new Error('a part');
    serve({ [PATH_KV_KEY]: started() });
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    await dayOpened();
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Day ${day.day} \\(0/\\d+\\)$`) }));
    const opened = openBlock(b.section);
    expect(within(opened).getByText(new RegExp(`Part 1 of ${part.item.part.count}`))).toBeInTheDocument();
    fireEvent.click(within(document.querySelector(`[data-item="${part.key}"]`) as HTMLElement).getByRole('button', { name: 'Play' }));
    expect(screen.getByTestId('loop-player')).toHaveAttribute('data-start', '0');
    fireEvent.click(screen.getByRole('button', { name: 'sim: near the end' }));
    // The end of the lesson is past the end of the part: the lesson is done, so is the part.
    expect(lastSaved(COURSE_PROGRESS_KEY)).toEqual({ [part.item.lesson.id]: today });
  });

  it('says the day is done when all six parts are', async () => {
    const d = path[0];
    const course: Record<string, string> = {};
    const done: Record<string, string> = {};
    const owned: Array<{ word: string }> = [];
    for (const b of d.blocks) {
      for (const i of b.items) {
        if (i.item.kind === 'lesson') course[i.item.lesson.id] = today;
        else if (i.item.kind === 'words') owned.push(...wordsOf(i.item));
        else done[i.key] = today;
      }
    }
    useAppStore.setState({ vocabularyItems: owned.map((w, n) => ({ id: `w${n}`, word: w.word })) as never });
    serve({ [PATH_KV_KEY]: started({ done }), [COURSE_PROGRESS_KEY]: course });
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    await dayOpened();
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Day 1 done'));
    expect(screen.getByTestId('path-day-progress')).toHaveTextContent('6/6');
    fireEvent.click(screen.getByRole('button', { name: 'Start day 2' }));
    expect(screen.getByRole('heading', { level: 2, name: 'Day 2' })).toBeInTheDocument();
  });

  it('saves the sentences of a grammar point once typing pauses', async () => {
    const day = path.find((d) => d.blocks.find((b) => b.section === 'grammar')!.items[0].item.kind === 'grammar')!;
    const key = day.blocks.find((b) => b.section === 'grammar')!.items[0].key;
    serve({ [PATH_KV_KEY]: started() });
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    await dayOpened();
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Day ${day.day} \\(0/\\d+\\)$`) }));
    fireEvent.change(within(openBlock('grammar')).getByRole('textbox'), { target: { value: 'I enjoy reading.' } });
    await waitFor(() => expect(lastSaved<PathState>(PATH_KV_KEY)?.notes[key]).toBe('I enjoy reading.'), { timeout: 2000 });
  });

  it('shows the 90-day plan from the settings and changes with them', async () => {
    serve({ [PATH_KV_KEY]: started() });
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    const plan = await screen.findByRole('region', { name: 'The 90-day plan' });
    expect(within(plan).getAllByText(/VOA Learning English · America's National Parks/).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole('radio', { name: /Ibrahim Adel/ })[0]);
    await waitFor(() => expect(lastSaved<PathState>(PATH_KV_KEY)?.settings.listening).toBe('ibrahim-adel'));
    expect(within(plan).getAllByText(/Ibrahim Adel · Listening Course — Level 1/).length).toBeGreaterThan(0);
  });

  it('starts over without losing the settings', async () => {
    serve({ [PATH_KV_KEY]: started({ settings: { ...defaultSettings(), minutes: 15 }, done: { 'review:1': today } }) });
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<LearningPathSection onOpenTab={onOpenTab} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Start over' }));
    expect(confirm).toHaveBeenCalled();
    await waitFor(() => expect(lastSaved<PathState>(PATH_KV_KEY)).toMatchObject({ startedAt: null, done: {}, settings: { minutes: 15 } }));
    act(() => confirm.mockRestore());
  });
});

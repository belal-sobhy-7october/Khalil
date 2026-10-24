import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import EnglishHub from './EnglishHub';
import { parseYouTube, youtubeEmbedUrl } from '../../lib/youtube';
import { saveKv } from '../../lib/userKv';

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
type SimProps = { onProgress?: (seconds: number, playing: boolean) => void; onEnded?: () => void };
const SimButtons = ({ onProgress }: SimProps) => (
  <>
    <button onClick={() => onProgress?.(120, false)}>sim: pause at 2:00</button>
    <button onClick={() => onProgress?.(100_000, true)}>sim: near the end</button>
  </>
);
vi.mock('./LoopPlayer', () => ({
  default: (props: SimProps & { source: { videoId: string | null; listId: string | null; start?: number }; compact?: boolean }) => (
    <div data-testid="loop-player" data-start={props.source.start ?? 0} data-compact={String(!!props.compact)}>
      {props.source.videoId ?? props.source.listId}
      <SimButtons {...props} />
    </div>
  ),
}));
vi.mock('./AudioPlayer', () => ({
  default: (props: SimProps & { src: string; start?: number }) => (
    <div data-testid="audio-player" data-start={props.start ?? 0}>
      {props.src}
      <SimButtons {...props} />
    </div>
  ),
}));
vi.mock('../Vocabulary/VocabularySection', () => ({ default: () => <div>vocabulary section</div> }));
// jsdom runs no animation frames, so exit animations would never finish: leave at once.
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const EPISODES = Array.from({ length: 60 }, (_, i) => ({
  id: `pod:e${i + 1}`,
  title: `English Listening #${i + 1}`,
  audio: `https://audio.example/${i + 1}.mp3`,
  seconds: 300,
  date: '2025-01-01',
}));

beforeEach(() => {
  localStorage.clear();
  kv.clear();
  vi.mocked(saveKv).mockClear();
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify({ title: 'Daily English listening', episodes: EPISODES }), { status: 200 }))
  );
  useAppStore.setState({
    language: 'en',
    session: { user: { id: 'u1' } } as unknown as ReturnType<typeof useAppStore.getState>['session'],
  });
});
afterEach(() => {
  vi.unstubAllGlobals();
});

const noRawKeys = () => expect(document.body.textContent).not.toMatch(/\b(english|vocabulary)\.[a-zA-Z.]+/);
const openTab = (name: string) => fireEvent.click(screen.getByRole('tab', { name }));
/** The section's main progress bar (the one split into levels). */
const sectionBar = (name: string) => screen.getAllByRole('progressbar', { name })[0];
/** A level's header (its name also shows in the "Up next" card). */
const levelButton = (name: RegExp) => screen.getAllByRole('button', { name }).find((b) => b.hasAttribute('aria-expanded'))!;

describe('EnglishHub', () => {
  it.each(['en', 'ar'] as const)('has the sections in study order, named in English, with no missing translations (%s)', (language) => {
    useAppStore.setState({ language });
    render(<EnglishHub />);
    const tabs = screen.getAllByRole('tab').map((t) => t.textContent);
    expect(tabs.slice(0, 7)).toEqual(['Learning Path', 'Vocabulary', 'Pronunciation & Accent', 'Listening', 'Reading', 'Grammar', 'Shadowing']);
    for (const name of tabs.slice(2, 7)) {
      openTab(name!);
      noRawKeys();
    }
  });

  it('opens on the learning path, which opens the section a task takes its lesson from', async () => {
    render(<EnglishHub />);
    expect(screen.getByRole('tab', { name: 'Learning Path' })).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(await screen.findByRole('button', { name: 'Start day 1' }));
    fireEvent.click(screen.getByText('Listening: the next lesson'));
    fireEvent.click(screen.getByRole('button', { name: 'Open Listening' }));
    expect(screen.getByRole('tab', { name: 'Listening' })).toHaveAttribute('aria-selected', 'true');
    expect(localStorage.getItem('khalil-english-tab')).toBe('listening');
  });

  it('switches tab when another part of the app asks (a review reminder)', () => {
    render(<EnglishHub />);
    act(() => {
      window.dispatchEvent(new CustomEvent('khalil:english-tab', { detail: 'vocabulary' }));
    });
    expect(screen.getByRole('tab', { name: 'Vocabulary' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('vocabulary section')).toBeInTheDocument();
  });

  it('opens the old Accent tab as Pronunciation & Accent', () => {
    localStorage.setItem('khalil-english-tab', 'accent');
    render(<EnglishHub />);
    expect(screen.getByRole('tab', { name: 'Pronunciation & Accent' })).toHaveAttribute('aria-selected', 'true');
  });

  it('pronunciation: phonetics comes before the accent course, and ticking lessons fills the progress', () => {
    render(<EnglishHub />);
    openTab('Pronunciation & Accent');
    const levels = screen.getAllByRole('button', { expanded: false }).concat(screen.getAllByRole('button', { expanded: true }));
    const names = levels.map((b) => b.textContent ?? '');
    expect(names.findIndex((n) => n.includes('Phonetics: Pronouncing Every Letter'))).toBeGreaterThanOrEqual(0);
    const order = ['Phonetics: Pronouncing Every Letter — Level 1', 'British & American Phonetics — Level 2', 'American & British Accent — Level 3'];
    const positions = order.map((n) => document.body.textContent!.indexOf(n));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(screen.getByRole('link', { name: /Ibrahim Adel/ })).toHaveAttribute('href', 'https://www.youtube.com/@ZAmericanEnglish/courses');

    // Level 1 is open as a to-do list.
    expect(screen.getAllByRole('checkbox')).toHaveLength(14);
    expect(sectionBar('Pronunciation & Accent')).toHaveAttribute('aria-valuenow', '0');
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('1 of 39 lessons')).toBeInTheDocument();
    expect(screen.getByText('1 of 14 lessons')).toBeInTheDocument();
    expect(sectionBar('Pronunciation & Accent')).toHaveAttribute('aria-valuenow', '2'); // 1 of 39
    expect(saveKv).toHaveBeenCalledWith('u1', 'english-course-progress', { '804e5iDYzSc': expect.any(String) });

    // "Up next" moves on to lesson 2 and plays it in the page, without the A–B loop buttons.
    fireEvent.click(screen.getByRole('button', { name: /Up next · Lesson 2 of 14/ }));
    expect(screen.getByTestId('loop-player')).toHaveTextContent('DTZAQ9B1yIU');
    expect(screen.getByTestId('loop-player')).toHaveAttribute('data-compact', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Mark as watched' }));
    expect(screen.getByText('2 of 39 lessons')).toBeInTheDocument();

    // Show only what's left: the ticked lessons leave the list.
    fireEvent.click(screen.getByRole('button', { name: 'Left' }));
    expect(screen.getAllByRole('checkbox')).toHaveLength(12);
  });

  it('a part-watched lesson counts towards the bar, resumes where it stopped, and ticks itself at the end', () => {
    render(<EnglishHub />);
    openTab('Pronunciation & Accent');
    fireEvent.click(screen.getByRole('button', { name: /Start here · Lesson 1 of 14/ }));

    // Paused at 2:00 of 14:16: saved, and the lesson shows the time left.
    fireEvent.click(screen.getByRole('button', { name: 'sim: pause at 2:00' }));
    expect(saveKv).toHaveBeenCalledWith('u1', 'english-course-positions', { '804e5iDYzSc': 120 });
    expect(screen.getByText('12:16 left')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'false');

    // Leave and come back: the card offers to continue, and the player starts just before 2:00.
    openTab('Grammar');
    openTab('Pronunciation & Accent');
    fireEvent.click(screen.getByRole('button', { name: /Continue from 2:00/ }));
    expect(screen.getByTestId('loop-player')).toHaveAttribute('data-start', '117');

    // Watching into the outro ticks it off.
    fireEvent.click(screen.getByRole('button', { name: 'sim: near the end' }));
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText(/Lesson finished/)).toBeInTheDocument();
    expect(screen.getByText('1 of 39 lessons')).toBeInTheDocument();
  });

  it('a lesson ticked while showing what\'s left stays a moment, so the tick is seen, then leaves', () => {
    vi.useFakeTimers();
    try {
      render(<EnglishHub />);
      openTab('Pronunciation & Accent');
      fireEvent.click(screen.getByRole('button', { name: 'Left' }));
      fireEvent.click(screen.getAllByRole('checkbox')[0]);
      expect(screen.getAllByRole('checkbox')).toHaveLength(14);
      expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'true');
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getAllByRole('checkbox')).toHaveLength(13);
    } finally {
      vi.useRealTimers();
    }
  });

  it('finishing a level celebrates', () => {
    render(<EnglishHub />);
    openTab('Pronunciation & Accent');
    fireEvent.click(screen.getByRole('button', { name: /Tick them all/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Level complete!');
    expect(screen.getByText('14 of 39 lessons')).toBeInTheDocument();
  });

  it('listening: Ibrahim Adel\'s courses, VOA, or Dalilk\'s daily podcast played in the page', async () => {
    render(<EnglishHub />);
    openTab('Listening');
    const sources = screen.getByRole('tablist', { name: 'Sources' });
    expect(within(sources).getAllByRole('tab').map((t) => t.textContent)).toEqual([
      expect.stringContaining('Ibrahim Adel'),
      expect.stringContaining('VOA Learning English'),
      expect.stringContaining('Dalilk Daily Podcast'),
    ]);
    expect(screen.getByText('0 of 27 lessons')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(16); // Level 1 is open

    fireEvent.click(within(sources).getByRole('tab', { name: /Dalilk Daily Podcast/ }));
    await waitFor(() => expect(screen.getByText('0 of 60 lessons')).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledWith('/api/podcast?id=1755537616');
    expect(levelButton(/Episodes 1–50/)).toHaveAttribute('aria-expanded', 'true');
    expect(levelButton(/Episodes 51–60/)).toHaveAttribute('aria-expanded', 'false');
    // A long part shows 40 at a time.
    expect(screen.getAllByRole('checkbox')).toHaveLength(40);
    fireEvent.click(screen.getByRole('button', { name: 'Show 10 more' }));
    expect(screen.getAllByRole('checkbox')).toHaveLength(50);

    fireEvent.click(screen.getByRole('button', { name: /Start here · Lesson 1 of 50/ }));
    expect(screen.getByTestId('audio-player')).toHaveTextContent('https://audio.example/1.mp3');
    fireEvent.click(screen.getByRole('button', { name: 'sim: near the end' }));
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: 'Listened' })).toBeInTheDocument();
    expect(saveKv).toHaveBeenCalledWith('u1', 'english-course-progress', { 'pod:e1': expect.any(String) });
    // The list is kept on the device for next time (and for no internet).
    expect(JSON.parse(localStorage.getItem('khalil-podcast:1755537616')!).feed.episodes).toHaveLength(60);
  });

  it('listening: says so when the podcast can\'t load, and tries again', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('{}', { status: 502 }));
    localStorage.setItem('khalil-english-source:listening', 'listening/dalilk-daily');
    render(<EnglishHub />);
    openTab('Listening');
    await waitFor(() => expect(screen.getByText(/Couldn't load the episodes/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /Try again/ }));
    await waitFor(() => expect(screen.getByText('0 of 60 lessons')).toBeInTheDocument());
  });

  it('reading: Ibrahim Adel and Lovely English Stories at every level, plus the book', () => {
    render(<EnglishHub />);
    openTab('Reading');
    const sources = screen.getByRole('tablist', { name: 'Sources' });
    expect(within(sources).getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByText('0 of 51 lessons')).toBeInTheDocument();
    fireEvent.click(within(sources).getByRole('tab', { name: /Lovely English Stories/ }));
    for (const level of [/Beginner Stories — A1 \/ A2/, /Intermediate Stories — B1 \/ B2/, /Advanced Stories — C1 \/ C2/]) {
      expect(levelButton(level)).toBeDefined();
    }
    // The book stays folded until asked for.
    expect(document.querySelector('iframe')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(document.querySelector('iframe')?.getAttribute('src')).toBe('https://drive.google.com/file/d/100Y_ZLHJMrSkamc1Cp66LlUUfVJgEBci/preview');
  });

  it('grammar is a section of its own', () => {
    render(<EnglishHub />);
    openTab('Grammar');
    expect(screen.queryByRole('tablist', { name: 'Sources' })).toBeNull();
    expect(screen.getByText('0 of 60 lessons')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(24);
  });

  it('shadowing: Listening Time A1–B2 with progress, played with the A–B loop', () => {
    render(<EnglishHub />);
    openTab('Shadowing');
    for (const level of ['A1', 'A2', 'B1', 'B2']) {
      expect(levelButton(new RegExp(`${level} English Listening Practice`))).toBeDefined();
    }
    expect(screen.getByText('0 of 134 lessons')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Start here · Lesson 1 of 44/ }));
    expect(screen.getByTestId('loop-player')).toHaveAttribute('data-compact', 'false');
  });

  it('your own links still play inside the page', () => {
    render(<EnglishHub />);
    openTab('Shadowing');
    fireEvent.click(screen.getByText('Your own links'));
    fireEvent.click(screen.getByRole('button', { name: /Add a playlist or video link/ }));
    fireEvent.change(screen.getByPlaceholderText(/YouTube playlist/), { target: { value: 'https://youtu.be/abcDEF12345' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByTestId('loop-player')).toHaveTextContent('abcDEF12345');
  });
});

describe('parseYouTube', () => {
  it('handles videos, playlists and both together', () => {
    expect(parseYouTube('https://www.youtube.com/playlist?list=PL1')).toEqual({ videoId: null, listId: 'PL1', start: undefined });
    expect(parseYouTube('https://www.youtube.com/watch?v=abc123xyz&list=PL1&t=30')).toEqual({ videoId: 'abc123xyz', listId: 'PL1', start: 30 });
    expect(youtubeEmbedUrl({ videoId: null, listId: 'PL1' })).toBe('https://www.youtube-nocookie.com/embed/videoseries?rel=0&list=PL1');
    expect(parseYouTube('https://example.com')).toBeNull();
  });
});

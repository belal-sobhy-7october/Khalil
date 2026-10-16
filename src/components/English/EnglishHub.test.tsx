import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import EnglishHub from './EnglishHub';
import { parseYouTube, youtubeEmbedUrl } from '../../lib/youtube';
import { saveKv } from '../../lib/userKv';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
vi.mock('../../lib/userKv', () => ({
  readLocalKv: (_k: string, f: unknown) => f,
  loadKv: vi.fn(async (_u: string, _k: string, f: unknown) => f),
  saveKv: vi.fn(async () => true),
}));
vi.mock('./LoopPlayer', () => ({
  default: ({ source, onProgress }: {
    source: { videoId: string | null; listId: string | null; start?: number };
    onProgress?: (seconds: number, playing: boolean) => void;
  }) => (
    <div data-testid="loop-player" data-start={source.start ?? 0}>
      {source.videoId ?? source.listId}
      <button onClick={() => onProgress?.(120, false)}>sim: pause at 2:00</button>
      <button onClick={() => onProgress?.(390, true)}>sim: near the end</button>
    </div>
  ),
}));
vi.mock('../Vocabulary/VocabularySection', () => ({ default: () => <div>vocabulary section</div> }));
// jsdom runs no animation frames, so exit animations would never finish: leave at once.
vi.mock('framer-motion', async (importOriginal) => ({
  ...(await importOriginal<typeof import('framer-motion')>()),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

beforeEach(() => {
  localStorage.clear();
  useAppStore.setState({
    language: 'en',
    session: { user: { id: 'u1' } } as unknown as ReturnType<typeof useAppStore.getState>['session'],
  });
});

const noRawKeys = () => expect(document.body.textContent).not.toMatch(/\b(english|vocabulary)\.[a-zA-Z.]+/);

describe('EnglishHub', () => {
  it.each(['en', 'ar'] as const)('renders every tab without missing translations (%s)', (language) => {
    useAppStore.setState({ language });
    render(<EnglishHub />);
    for (const tab of screen.getAllByRole('tab').slice(1, 4)) {
      fireEvent.click(tab);
      noRawKeys();
    }
  });

  const openTrack = (name: RegExp) =>
    fireEvent.click(screen.getAllByRole('tab', { name }).find((el) => el.textContent?.includes('/'))!);

  it('accent tab: every course track lists its playlists, and ticking lessons fills the progress', () => {
    render(<EnglishHub />);
    fireEvent.click(screen.getByRole('tab', { name: 'Accent' }));
    expect(screen.queryByRole('link', { name: /Find lessons/ })).toBeNull();
    expect(screen.queryByRole('tab', { name: /IELTS/ })).toBeNull();
    for (const name of [/Phonetics/, /Grammar/, /Listening/, /Reading/, /Accent/]) {
      openTrack(name);
      noRawKeys();
    }
    expect(screen.getByRole('link', { name: /Ibrahim Adel/ })).toHaveAttribute('href', 'https://www.youtube.com/@ZAmericanEnglish/courses');

    // The first playlist is open as a to-do list.
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes).toHaveLength(20);
    const trackBar = () => screen.getAllByRole('progressbar', { name: 'Accent' })[0];
    expect(trackBar()).toHaveAttribute('aria-valuenow', '0');
    fireEvent.click(boxes[0]);
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'true');
    expect(screen.getAllByText('1 of 20 lessons')).toHaveLength(2); // track and its one playlist
    expect(trackBar()).toHaveAttribute('aria-valuenow', '5');
    expect(saveKv).toHaveBeenCalledWith('u1', 'english-course-progress', { ZD8lvpRKGCY: expect.any(String) });

    // "Up next" moves on to lesson 2 and plays it in the page.
    fireEvent.click(screen.getByRole('button', { name: /Up next · Lesson 2 of 20/ }));
    expect(screen.getByTestId('loop-player')).toHaveTextContent('bI_NJIBq5uI');
    fireEvent.click(screen.getByRole('button', { name: 'Mark as watched' }));
    expect(screen.getAllByText('2 of 20 lessons')).toHaveLength(2);

    // Hide what's watched: the ticked lessons slide out.
    fireEvent.click(screen.getByRole('button', { name: 'Left' }));
    expect(screen.getAllByRole('checkbox')).toHaveLength(18);
  });

  it('a part-watched lesson counts towards the bar, resumes where it stopped, and ticks itself at the end', () => {
    render(<EnglishHub />);
    fireEvent.click(screen.getByRole('tab', { name: 'Accent' }));
    openTrack(/Accent/);
    fireEvent.click(screen.getByRole('button', { name: /Start here · Lesson 1 of 20/ }));

    // Paused at 2:00 of 6:37: saved, and the lesson shows the time left.
    fireEvent.click(screen.getByRole('button', { name: 'sim: pause at 2:00' }));
    expect(saveKv).toHaveBeenCalledWith('u1', 'english-course-positions', { ZD8lvpRKGCY: 120 });
    expect(screen.getByText('4:37 left')).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar', { name: 'Accent' })[0]).toHaveAttribute('aria-valuenow', '2');
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'false');

    // Leave and come back: the card offers to continue, and the player starts just before 2:00.
    openTrack(/Grammar/);
    openTrack(/Accent/);
    fireEvent.click(screen.getByRole('button', { name: /Continue from 2:00/ }));
    expect(screen.getByTestId('loop-player')).toHaveAttribute('data-start', '117');

    // Watching into the outro ticks it off.
    fireEvent.click(screen.getByRole('button', { name: 'sim: near the end' }));
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText(/Lesson finished/)).toBeInTheDocument();
    expect(screen.getAllByText('1 of 20 lessons')).toHaveLength(2);
  });

  it('a lesson ticked while showing what\'s left stays a moment, so the tick is seen, then leaves', () => {
    vi.useFakeTimers();
    try {
      render(<EnglishHub />);
      fireEvent.click(screen.getByRole('tab', { name: 'Accent' }));
      openTrack(/Accent/);
      fireEvent.click(screen.getByRole('button', { name: 'Left' }));
      fireEvent.click(screen.getAllByRole('checkbox')[0]);
      expect(screen.getAllByRole('checkbox')).toHaveLength(20);
      expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'true');
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getAllByRole('checkbox')).toHaveLength(19);
    } finally {
      vi.useRealTimers();
    }
  });

  it('listening track: Ibrahim Adel\'s listening courses', () => {
    render(<EnglishHub />);
    fireEvent.click(screen.getByRole('tab', { name: 'Accent' }));
    openTrack(/Listening/);
    for (const name of [/Listening course — Level 1/, /understanding accents — Level 2/, /Listening course — Level 3/, /English news/]) {
      expect(screen.getAllByRole('button', { name }).some((b) => b.hasAttribute('aria-expanded'))).toBe(true);
    }
    expect(screen.queryByText(/Listening Time/)).toBeNull();
    expect(screen.getByText('0 of 27 lessons')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(16); // Level 1 is open
  });

  it('finishing a playlist celebrates, and the track card shows the trophy', () => {
    render(<EnglishHub />);
    fireEvent.click(screen.getByRole('tab', { name: 'Accent' }));
    openTrack(/Accent/);
    fireEvent.click(screen.getByRole('button', { name: /Mark all as watched/ }));
    expect(screen.getByRole('status')).toHaveTextContent('You finished the whole track!');
    expect(screen.getAllByText('20 of 20 lessons')).toHaveLength(2);
    const card = screen.getAllByRole('tab', { name: /Accent/ }).find((el) => el.textContent?.includes('/'))!;
    expect(within(card).getByText('20/20')).toBeInTheDocument();
  });

  it('accent tab: your own links still play inside the page', () => {
    render(<EnglishHub />);
    fireEvent.click(screen.getByRole('tab', { name: 'Accent' }));
    fireEvent.click(screen.getByText('Your own links'));
    fireEvent.click(screen.getByRole('button', { name: /Add a playlist or video link/ }));
    fireEvent.change(screen.getByPlaceholderText(/YouTube playlist/), { target: { value: 'https://www.youtube.com/playlist?list=PLabc123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByTestId('loop-player')).toHaveTextContent('PLabc123');
  });

  it('shadowing tab: a saved video opens in the loop player', () => {
    render(<EnglishHub />);
    fireEvent.click(screen.getByRole('tab', { name: 'Shadowing' }));
    fireEvent.click(screen.getByRole('button', { name: /Add a playlist or video link/ }));
    fireEvent.change(screen.getByPlaceholderText(/YouTube playlist/), { target: { value: 'https://youtu.be/abcDEF12345' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(screen.getByTestId('loop-player')).toHaveTextContent('abcDEF12345');
  });

  it('reading tab embeds the Drive book preview', () => {
    render(<EnglishHub />);
    fireEvent.click(screen.getByRole('tab', { name: 'Reading & Listening' }));
    expect(document.querySelector('iframe')?.getAttribute('src')).toBe('https://drive.google.com/file/d/100Y_ZLHJMrSkamc1Cp66LlUUfVJgEBci/preview');
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

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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
vi.mock('./LoopPlayer', () => ({ default: ({ source }: { source: { videoId: string | null; listId: string | null } }) => <div data-testid="loop-player">{source.videoId ?? source.listId}</div> }));
vi.mock('../Vocabulary/VocabularySection', () => ({ default: () => <div>vocabulary section</div> }));

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

  it('accent tab: every course track lists its playlists, and ticking lessons fills the progress', () => {
    render(<EnglishHub />);
    fireEvent.click(screen.getByRole('tab', { name: 'Accent' }));
    expect(screen.queryByRole('link', { name: /Find lessons/ })).toBeNull();
    for (const name of [/Phonetics/, /Grammar/, /Reading/, /IELTS/, /Accent/]) {
      fireEvent.click(screen.getAllByRole('tab', { name }).find((el) => el.textContent?.includes('/'))!);
      noRawKeys();
    }
    expect(screen.getByRole('link', { name: /Z American English/ })).toHaveAttribute('href', 'https://www.youtube.com/@ZAmericanEnglish/courses');

    // The first playlist is open as a to-do list.
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes).toHaveLength(20);
    expect(screen.getAllByRole('progressbar')[0]).toHaveAttribute('aria-valuenow', '0');
    fireEvent.click(boxes[0]);
    expect(screen.getAllByRole('checkbox')[0]).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('1 of 25 lessons')).toBeInTheDocument();
    expect(saveKv).toHaveBeenCalledWith('u1', 'english-course-progress', { ZD8lvpRKGCY: expect.any(String) });

    // "Up next" moves on to lesson 2 and plays it in the page.
    fireEvent.click(screen.getByRole('button', { name: /Up next · Lesson 2 of 20/ }));
    expect(screen.getByTestId('loop-player')).toHaveTextContent('bI_NJIBq5uI');
    fireEvent.click(screen.getByRole('button', { name: 'Mark as watched' }));
    expect(screen.getByText('2 of 25 lessons')).toBeInTheDocument();

    // Hide what's watched.
    fireEvent.click(screen.getByRole('button', { name: 'Left' }));
    expect(screen.getAllByRole('checkbox')).toHaveLength(18);
  });

  it('IELTS track: finishing a playlist celebrates and the track card shows it', () => {
    render(<EnglishHub />);
    fireEvent.click(screen.getByRole('tab', { name: 'Accent' }));
    fireEvent.click(screen.getAllByRole('tab', { name: /IELTS/ }).find((el) => el.textContent?.includes('/'))!);
    expect(screen.getByRole('link', { name: /دليلك للايلتس/ })).toHaveAttribute('href', 'https://www.youtube.com/@dalilk4ielts/playlists');
    fireEvent.click(screen.getByRole('button', { name: /Mark all as watched/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Playlist complete!');
    expect(screen.getByText('8 of 43 lessons')).toBeInTheDocument();
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

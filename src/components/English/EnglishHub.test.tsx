import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import EnglishHub from './EnglishHub';
import { parseYouTube, youtubeEmbedUrl } from '../../lib/youtube';

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

  it('accent tab: links to Z American English and plays a saved playlist inside the page', () => {
    render(<EnglishHub />);
    fireEvent.click(screen.getByRole('tab', { name: 'Accent' }));
    expect(screen.getByRole('link', { name: /All playlists/ })).toHaveAttribute('href', 'https://www.youtube.com/@ZAmericanEnglish/playlists');
    fireEvent.click(screen.getByRole('button', { name: /Add a playlist or video link/ }));
    fireEvent.change(screen.getByPlaceholderText(/YouTube playlist/), { target: { value: 'https://www.youtube.com/playlist?list=PLabc123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(document.querySelector('iframe')?.getAttribute('src')).toContain('videoseries?rel=0&list=PLabc123');
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

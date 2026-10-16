import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import TopicChallenge from './TopicChallenge';
import type { VocabularyCategory, VocabularyItem } from '../../types';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
vi.mock('../../lib/pronunciation', () => ({
  speakWord: vi.fn(async () => {}),
  speakBrowser: vi.fn(),
  getPronunciationPrefs: () => ({ accent: 'us' }),
}));

const persistence = vi.hoisted(() => ({ load: vi.fn(), save: vi.fn() }));
vi.mock('../../lib/topicChallenge', async (orig) => ({
  ...(await orig<typeof import('../../lib/topicChallenge')>()),
  loadChallenge: persistence.load,
  saveChallenge: persistence.save,
}));

const speech = vi.hoisted(() => ({ supported: vi.fn(() => true), recognize: vi.fn() }));
vi.mock('../../lib/speech', async (orig) => ({
  ...(await orig<typeof import('../../lib/speech')>()),
  speechRecognitionSupported: speech.supported,
  recognizeOnce: speech.recognize,
}));

const category: VocabularyCategory = { id: 'c1', userId: 'u1', name: 'Call Center Interview', createdAt: '', updatedAt: '' };
const item = (id: string, word: string): VocabularyItem => ({
  id, userId: 'u1', word, type: 'word', definition: 'd', categoryId: 'c1', exampleSentence: `I use ${word} daily.`,
  masteryLevel: 0, reviewCount: 0, lapseCount: 0, correctStreak: 0, isHard: false, createdAt: '', updatedAt: '',
});

beforeEach(() => {
  persistence.load.mockReset().mockResolvedValue({ words: [], textsDone: [], talkSeconds: 0 });
  persistence.save.mockReset().mockResolvedValue(true);
  speech.recognize.mockReset();
  useAppStore.setState({
    language: 'en',
    session: { user: { id: 'u1' } } as unknown as ReturnType<typeof useAppStore.getState>['session'],
    vocabularyItems: [item('a', 'shift'), item('b', 'refund')],
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('TopicChallenge', () => {
  it('marks a word passed when speech recognition hears it, and saves progress', async () => {
    speech.recognize.mockResolvedValue({ ok: true, transcripts: ['the shift'] });
    render(<TopicChallenge category={category} onClose={() => {}} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Say it: shift' }));
    await screen.findByText('1 / 2');
    expect(persistence.save).toHaveBeenLastCalledWith('u1', 'c1', expect.objectContaining({ words: ['a'] }));
    expect(document.body.textContent).not.toMatch(/\bvocabulary\.[a-zA-Z.]+/);
  });

  it('shows what it heard when the word does not match', async () => {
    speech.recognize.mockResolvedValue({ ok: true, transcripts: ['re fun'] });
    render(<TopicChallenge category={category} onClose={() => {}} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Say it: refund' }));
    expect(await screen.findByText(/re fun/)).toBeInTheDocument();
    expect(screen.getByText('0 / 2')).toBeInTheDocument();
  });

  it('falls back to manual checking when recognition is blocked (e.g. Brave)', async () => {
    speech.recognize.mockResolvedValue({ ok: false, error: 'network' });
    render(<TopicChallenge category={category} onClose={() => {}} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Say it: shift' }));
    expect(await screen.findByText(/Brave blocks it/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Say it: shift' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'I said it right: shift' }));
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('listen step uses the pack paragraph plus texts from example sentences', async () => {
    render(<TopicChallenge category={category} onClose={() => {}} />);
    fireEvent.click(await screen.findByRole('tab', { name: /Listen & repeat/ }));
    expect(screen.getByText(/I graduated in 2023/)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Copy & open NaturalReaders/ })).toHaveLength(1);
  });

  it('shadowing embeds a YouTube link and can be skipped', async () => {
    render(<TopicChallenge category={category} onClose={() => {}} />);
    fireEvent.click(await screen.findByRole('tab', { name: /Shadowing/ }));
    fireEvent.change(screen.getByPlaceholderText('Paste a YouTube link for this topic'), { target: { value: 'https://youtu.be/abcDEF12345' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(document.querySelector('iframe')?.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/abcDEF12345');
    fireEvent.click(screen.getByRole('button', { name: 'Skip' }));
    expect(within(screen.getByRole('tab', { name: /Shadowing/ })).queryByText('3.', { exact: false })).toBeInTheDocument();
    expect(persistence.save).toHaveBeenLastCalledWith('u1', 'c1', expect.objectContaining({ shadowing: 'skipped', videoUrl: 'https://youtu.be/abcDEF12345' }));
  });

  it('talk timer counts up and saves the time when paused', async () => {
    render(<TopicChallenge category={category} onClose={() => {}} />);
    fireEvent.click(await screen.findByRole('tab', { name: /Talk 10 minutes/ }));
    expect(screen.getByDisplayValue(/Act as an interviewer/)).toBeInTheDocument();
    vi.useFakeTimers();
    fireEvent.click(screen.getByRole('button', { name: /Start 10-minute timer/ }));
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText(/0:03/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Pause/ }));
    expect(persistence.save).toHaveBeenLastCalledWith('u1', 'c1', expect.objectContaining({ talkSeconds: 3 }));
  });
});

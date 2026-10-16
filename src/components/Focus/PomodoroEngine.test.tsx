import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render } from '@testing-library/react';
import { useAppStore } from '../../store/appStore';
import { usePomodoroStore, DEFAULT_SETTINGS } from '../../store/pomodoroStore';
import PomodoroEngine from './PomodoroEngine';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
const notify = vi.hoisted(() => ({ systemNotify: vi.fn(), playChime: vi.fn() }));
vi.mock('../../lib/systemNotify', () => ({ systemNotify: notify.systemNotify }));
vi.mock('../../lib/chime', () => ({ playChime: notify.playChime }));

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  notify.systemNotify.mockClear();
  notify.playChime.mockClear();
  useAppStore.setState({ language: 'en', session: null });
  usePomodoroStore.setState({
    phase: 'focus', status: 'idle', endsAt: null, remainingMs: 0, cycle: 0, label: '', phaseStartedAt: null, phaseMinutes: null,
    settings: { ...DEFAULT_SETTINGS, focus: 1 }, sessions: [],
  });
});
afterEach(() => vi.useRealTimers());

describe('PomodoroEngine', () => {
  it('finishes the phase on time: one session, one chime, one notification, countdown in the title', async () => {
    render(<PomodoroEngine />);
    act(() => usePomodoroStore.getState().start());
    await act(async () => {
      vi.advanceTimersByTime(30_000);
    });
    expect(document.title).toMatch(/00:30 · Focus/);
    await act(async () => {
      vi.advanceTimersByTime(31_000);
    });
    const st = usePomodoroStore.getState();
    expect(st.sessions).toHaveLength(1);
    expect(st.phase).toBe('short');
    expect(notify.playChime).toHaveBeenCalledTimes(1);
    expect(notify.systemNotify).toHaveBeenCalledTimes(1);
    expect(notify.systemNotify.mock.calls[0][0]).toBe('Focus session done 🍅');
  });

  it('stays quiet about a phase that ended long ago (e.g. after sleep)', async () => {
    usePomodoroStore.setState({ status: 'running', endsAt: Date.now() - 2 * 3600_000, phaseStartedAt: Date.now() - 2 * 3600_000 - 60_000 });
    render(<PomodoroEngine />);
    await act(async () => {
      vi.advanceTimersByTime(600);
    });
    expect(usePomodoroStore.getState().sessions).toHaveLength(1);
    expect(notify.systemNotify).not.toHaveBeenCalled();
    expect(notify.playChime).not.toHaveBeenCalled();
  });
});

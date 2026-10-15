import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextPhaseAfter, usePomodoroStore, DEFAULT_SETTINGS } from './pomodoroStore';

vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-16T09:00:00'));
  localStorage.clear();
  usePomodoroStore.setState({
    phase: 'focus', status: 'idle', endsAt: null, remainingMs: 0, cycle: 0, label: '', phaseStartedAt: null,
    settings: { ...DEFAULT_SETTINGS, autoStartBreaks: true, autoStartFocus: false }, sessions: [],
  });
});
afterEach(() => vi.useRealTimers());

describe('nextPhaseAfter', () => {
  it('goes focus → short until the set is full, then long, then resets', () => {
    expect(nextPhaseAfter('focus', 0, 4)).toEqual({ phase: 'short', cycle: 1 });
    expect(nextPhaseAfter('focus', 3, 4)).toEqual({ phase: 'long', cycle: 4 });
    expect(nextPhaseAfter('short', 2, 4)).toEqual({ phase: 'focus', cycle: 2 });
    expect(nextPhaseAfter('long', 4, 4)).toEqual({ phase: 'focus', cycle: 0 });
  });
});

describe('pomodoro timer', () => {
  it('counts down from an absolute end time and pauses/resumes exactly', () => {
    const s = usePomodoroStore.getState();
    s.start();
    vi.advanceTimersByTime(60_000);
    expect(usePomodoroStore.getState().remaining()).toBe(24 * 60_000);
    usePomodoroStore.getState().pause();
    vi.advanceTimersByTime(10 * 60_000); // time passes while paused
    expect(usePomodoroStore.getState().remaining()).toBe(24 * 60_000);
    usePomodoroStore.getState().start();
    vi.advanceTimersByTime(4 * 60_000);
    expect(usePomodoroStore.getState().remaining()).toBe(20 * 60_000);
  });

  it('survives a reload: running state is persisted', () => {
    usePomodoroStore.getState().start();
    const saved = JSON.parse(localStorage.getItem('khalil-pomodoro-run') ?? '{}');
    expect(saved.status).toBe('running');
    expect(saved.endsAt).toBe(Date.now() + 25 * 60_000);
  });

  it('finishing focus records a session and auto-starts the break', async () => {
    usePomodoroStore.getState().setLabel('Grammar');
    usePomodoroStore.getState().start();
    vi.advanceTimersByTime(25 * 60_000);
    const finished = await usePomodoroStore.getState().finishPhase();
    const st = usePomodoroStore.getState();
    expect(finished).toBe('focus');
    expect(st.sessions).toHaveLength(1);
    expect(st.sessions[0]).toMatchObject({ minutes: 25, label: 'Grammar' });
    expect(st.phase).toBe('short');
    expect(st.status).toBe('running');
    expect(st.cycle).toBe(1);
  });

  it('finishing a break does not auto-start focus when that option is off', async () => {
    usePomodoroStore.setState({ phase: 'short', status: 'running', endsAt: Date.now(), cycle: 1 });
    await usePomodoroStore.getState().finishPhase();
    const st = usePomodoroStore.getState();
    expect(st.phase).toBe('focus');
    expect(st.status).toBe('idle');
    expect(st.sessions).toHaveLength(0);
  });

  it('skipping focus does not count it toward the set', () => {
    usePomodoroStore.getState().start();
    usePomodoroStore.getState().skip();
    const st = usePomodoroStore.getState();
    expect(st.phase).toBe('short');
    expect(st.cycle).toBe(0);
    expect(st.status).toBe('idle');
  });

  it('a phase that ended while away is recorded at its real end and does not auto-start the next', async () => {
    usePomodoroStore.getState().start();
    const realEnd = Date.now() + 25 * 60_000;
    vi.advanceTimersByTime(25 * 60_000 + 3 * 3600_000); // laptop asleep for 3 hours
    await usePomodoroStore.getState().finishPhase();
    const st = usePomodoroStore.getState();
    expect(new Date(st.sessions[0].endedAt).getTime()).toBe(realEnd);
    expect(st.phase).toBe('short');
    expect(st.status).toBe('idle');
  });
});

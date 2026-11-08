/**
 * Pomodoro timer state. The timer is driven by an absolute end time, so it
 * stays accurate in background tabs and survives reloads (running state is
 * persisted to localStorage). PomodoroEngine (mounted once in App) ticks it.
 */
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { readLocalKv, saveKv, loadKv } from '../lib/userKv';

export type Phase = 'focus' | 'short' | 'long';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface PomodoroSettings {
  focus: number;
  short: number;
  long: number;
  longEvery: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  sound: boolean;
  notify: boolean;
  dailyGoal: number;
  titleCountdown: boolean;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focus: 25,
  short: 5,
  long: 15,
  longEvery: 4,
  autoStartBreaks: true,
  autoStartFocus: false,
  sound: true,
  notify: true,
  dailyGoal: 8,
  titleCountdown: true,
};

export interface PomodoroSession {
  id: string;
  startedAt: string;
  endedAt: string;
  minutes: number;
  label: string | null;
}

interface RunState {
  phase: Phase;
  status: TimerStatus;
  endsAt: number | null;
  remainingMs: number;
  cycle: number; // focus sessions finished in the current set
  label: string;
  phaseStartedAt: number | null;
  /** Length of the running phase, fixed when it starts (settings may change mid-phase). */
  phaseMinutes: number | null;
}

interface PomodoroState extends RunState {
  settings: PomodoroSettings;
  sessions: PomodoroSession[];
  lastFinished: { phase: Phase; at: number } | null;
  durationMs: (phase?: Phase) => number;
  remaining: (now?: number) => number;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
  skip: () => void;
  setPhase: (phase: Phase) => void;
  setLabel: (label: string) => void;
  updateSettings: (patch: Partial<PomodoroSettings>, userId?: string) => void;
  /** The settings, as the app opens. */
  loadForUser: (userId: string) => Promise<void>;
  /** The sessions of the last 400 days, when a page that shows them opens (Focus, Analytics). */
  loadSessions: (userId: string) => Promise<void>;
  /** Called by the engine when the running phase reaches its end. */
  finishPhase: (userId?: string) => Promise<Phase>;
  addSession: (s: Omit<PomodoroSession, 'id'>, userId?: string) => Promise<void>;
  deleteSession: (id: string, userId?: string) => Promise<void>;
}

const RUN_KEY = 'khalil-pomodoro-run';
const SETTINGS_KEY = 'pomodoro-settings';
const LOCAL_SESSIONS_KEY = 'khalil-pomodoro-sessions';

const IDLE_RUN: RunState = { phase: 'focus', status: 'idle', endsAt: null, remainingMs: 0, cycle: 0, label: '', phaseStartedAt: null, phaseMinutes: null };

function readRun(): RunState {
  try {
    const raw = localStorage.getItem(RUN_KEY);
    return raw ? { ...IDLE_RUN, ...(JSON.parse(raw) as Partial<RunState>) } : IDLE_RUN;
  } catch {
    return IDLE_RUN;
  }
}

function persistRun(s: RunState) {
  try {
    const { phase, status, endsAt, remainingMs, cycle, label, phaseStartedAt, phaseMinutes } = s;
    localStorage.setItem(RUN_KEY, JSON.stringify({ phase, status, endsAt, remainingMs, cycle, label, phaseStartedAt, phaseMinutes }));
  } catch {
    // ignore
  }
}

function readLocalSessions(): PomodoroSession[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SESSIONS_KEY) ?? '[]') as PomodoroSession[];
  } catch {
    return [];
  }
}

function writeLocalSessions(list: PomodoroSession[]) {
  try {
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(list.slice(-3000)));
  } catch {
    // ignore
  }
}

/** Which phase follows `phase`; `cycle` counts focus sessions in the current set. */
export function nextPhaseAfter(phase: Phase, cycle: number, longEvery: number): { phase: Phase; cycle: number } {
  if (phase === 'long') return { phase: 'focus', cycle: 0 };
  if (phase === 'short') return { phase: 'focus', cycle };
  const done = cycle + 1;
  return done >= longEvery ? { phase: 'long', cycle: done } : { phase: 'short', cycle: done };
}

export const usePomodoroStore = create<PomodoroState>((set, get) => {
  const commit = (patch: Partial<RunState>) => {
    set(patch);
    persistRun({ ...get(), ...patch });
  };

  return {
    ...readRun(),
    settings: { ...DEFAULT_SETTINGS, ...readLocalKv<Partial<PomodoroSettings>>(SETTINGS_KEY, {}) },
    sessions: readLocalSessions(),
    lastFinished: null,

    durationMs: (phase) => {
      const s = get();
      if (!phase && s.status !== 'idle' && s.phaseMinutes) return s.phaseMinutes * 60_000;
      return s.settings[phase ?? s.phase] * 60_000;
    },

    remaining: (now = Date.now()) => {
      const s = get();
      if (s.status === 'running' && s.endsAt !== null) return Math.max(0, s.endsAt - now);
      if (s.status === 'paused') return s.remainingMs;
      return s.durationMs();
    },

    start: () => {
      const s = get();
      if (s.status === 'running') return;
      const resuming = s.status === 'paused';
      const remaining = resuming ? s.remainingMs : s.durationMs();
      commit({
        status: 'running',
        endsAt: Date.now() + remaining,
        phaseStartedAt: resuming && s.phaseStartedAt ? s.phaseStartedAt : Date.now(),
        phaseMinutes: resuming && s.phaseMinutes ? s.phaseMinutes : s.settings[s.phase],
      });
    },
    pause: () => {
      const s = get();
      if (s.status !== 'running' || s.endsAt === null) return;
      commit({ status: 'paused', remainingMs: Math.max(0, s.endsAt - Date.now()), endsAt: null });
    },
    toggle: () => (get().status === 'running' ? get().pause() : get().start()),
    reset: () => commit({ status: 'idle', endsAt: null, remainingMs: 0, phaseStartedAt: null, phaseMinutes: null }),
    skip: () => {
      const s = get();
      // Skipping a focus session doesn't count it toward the set.
      const next = s.phase === 'focus' ? { phase: 'short' as Phase, cycle: s.cycle } : nextPhaseAfter(s.phase, s.cycle, s.settings.longEvery);
      commit({ phase: next.phase, cycle: next.cycle, status: 'idle', endsAt: null, remainingMs: 0, phaseStartedAt: null, phaseMinutes: null });
    },
    setPhase: (phase) => commit({ phase, status: 'idle', endsAt: null, remainingMs: 0, phaseStartedAt: null, phaseMinutes: null }),
    setLabel: (label) => commit({ label }),

    updateSettings: (patch, userId) => {
      const settings = { ...get().settings, ...patch };
      set({ settings });
      if (userId) void saveKv(userId, SETTINGS_KEY, settings);
    },

    loadForUser: async (userId) => {
      const saved = await loadKv<Partial<PomodoroSettings>>(userId, SETTINGS_KEY, {});
      set((s) => ({ settings: { ...s.settings, ...saved } }));
    },

    loadSessions: async (userId) => {
      const since = new Date(Date.now() - 400 * 24 * 3600 * 1000).toISOString();
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .select('id, started_at, ended_at, minutes, label')
        .eq('user_id', userId)
        .gte('started_at', since)
        .order('started_at', { ascending: true });
      if (error || !data) return;
      const remote = (data as Array<{ id: string; started_at: string; ended_at: string; minutes: number; label: string | null }>).map((r) => ({
        id: r.id,
        startedAt: r.started_at,
        endedAt: r.ended_at,
        minutes: r.minutes,
        label: r.label,
      }));
      // Keep sessions saved locally while the table was unavailable, and upload them.
      const ids = new Set(remote.map((r) => r.id));
      const localOnly = readLocalSessions().filter((s) => !ids.has(s.id) && s.startedAt >= since);
      const merged = [...remote, ...localOnly].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
      writeLocalSessions(merged);
      set({ sessions: merged });
      if (localOnly.length) {
        await supabase.from('pomodoro_sessions').insert(
          localOnly.map((s) => ({ id: s.id, user_id: userId, started_at: s.startedAt, ended_at: s.endedAt, minutes: s.minutes, label: s.label }))
        );
      }
    },

    addSession: async (session, userId) => {
      const full: PomodoroSession = { id: crypto.randomUUID(), ...session };
      const sessions = [...get().sessions, full];
      set({ sessions });
      writeLocalSessions(sessions);
      if (userId) {
        const { error } = await supabase.from('pomodoro_sessions').insert({
          id: full.id, user_id: userId, started_at: full.startedAt, ended_at: full.endedAt, minutes: full.minutes, label: full.label,
        });
        if (error) console.error('addSession', error);
      }
    },

    deleteSession: async (id, userId) => {
      const sessions = get().sessions.filter((s) => s.id !== id);
      set({ sessions });
      writeLocalSessions(sessions);
      if (userId) await supabase.from('pomodoro_sessions').delete().eq('id', id);
    },

    finishPhase: async (userId) => {
      const s = get();
      const finished = s.phase;
      const endedAtMs = s.endsAt ?? Date.now();
      // Came back long after the phase ended (laptop asleep, tab closed):
      // record it at its real end time and don't auto-start the next phase
      // as if the user had been there.
      const away = Date.now() - endedAtMs > 60_000;
      const next = nextPhaseAfter(s.phase, s.cycle, s.settings.longEvery);
      const autoStart = !away && (next.phase === 'focus' ? s.settings.autoStartFocus : s.settings.autoStartBreaks);
      commit({
        phase: next.phase,
        cycle: next.cycle,
        status: autoStart ? 'running' : 'idle',
        endsAt: autoStart ? Date.now() + s.settings[next.phase] * 60_000 : null,
        remainingMs: 0,
        phaseStartedAt: autoStart ? Date.now() : null,
        phaseMinutes: autoStart ? s.settings[next.phase] : null,
      });
      set({ lastFinished: { phase: finished, at: endedAtMs } });
      if (finished === 'focus') {
        const minutes = s.phaseMinutes ?? s.settings.focus;
        const startedAt = new Date(s.phaseStartedAt ?? endedAtMs - minutes * 60_000).toISOString();
        await get().addSession({ startedAt, endedAt: new Date(endedAtMs).toISOString(), minutes, label: s.label.trim() || null }, userId);
      }
      return finished;
    },
  };
});

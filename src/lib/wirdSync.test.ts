import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '../store/appStore';
import { BUILTIN_ITEMS, EMPTY_DAY, useWirdStore } from './wird';
import { setWirdItems } from './wirdItems';
import { setTasksSettings, DEFAULT_TASKS_SETTINGS } from './tasksSettings';
import {
  effectiveHabitEntries, getHabitLinks, linkHabit, setHabitLinks, setTargetDone, targetDone, targetPatch, toggleHabit, unlinkHabit, wirdTargets,
} from './wirdSync';

vi.mock('./supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
vi.mock('./userKv', () => ({
  readLocalKv: (_k: string, f: unknown) => f,
  loadKv: vi.fn(async (_u: string, _k: string, f: unknown) => f),
  saveKv: vi.fn(async () => true),
}));

const items = BUILTIN_ITEMS;

beforeEach(() => {
  useAppStore.setState({
    session: { user: { id: 'u1' } } as unknown as ReturnType<typeof useAppStore.getState>['session'],
    habits: [{ id: 'h1', name: 'Fajr in the mosque', icon: 'star', sortOrder: 0, active: true, startDate: '2026-01-01', scheduleDays: null }],
    habitEntries: [],
  });
  useWirdStore.setState({ days: {} });
  setWirdItems(BUILTIN_ITEMS.map((i) => ({ ...i })));
  setTasksSettings({ ...DEFAULT_TASKS_SETTINGS });
  setHabitLinks({});
});

describe('wird targets', () => {
  it('a prayer is done alone or in congregation; its jamaah target only in congregation', () => {
    const day = { ...EMPTY_DAY, prayers: { fajr: 'alone' as const } };
    expect(targetDone('prayer:fajr', day, items)).toBe(true);
    expect(targetDone('prayer:fajr:jamaah', day, items)).toBe(false);
  });

  it('ticking a prayer records the chosen state and keeps one already logged', () => {
    expect(targetPatch('prayer:asr', true, items, 'alone')!(EMPTY_DAY)).toEqual({ prayers: { asr: 'alone' } });
    const logged = { ...EMPTY_DAY, prayers: { asr: 'jamaah' as const } };
    expect(targetPatch('prayer:asr', true, items, 'alone')!(logged)).toEqual({ prayers: { asr: 'jamaah' } });
    expect(targetPatch('prayer:asr', false, items, 'alone')!(logged)).toEqual({ prayers: { asr: null } });
  });

  it('ticking a count item reaches its goal', () => {
    setTargetDone('quran', '2026-10-25', true);
    expect(useWirdStore.getState().days['2026-10-25'].quran).toBe(1);
  });

  it('offers no target of a hidden item', () => {
    const hidden = items.map((i) => (i.id === 'prayers' ? { ...i, hidden: true } : i));
    expect(wirdTargets(hidden)).not.toContain('prayer:fajr');
    expect(wirdTargets(items)).toEqual(expect.arrayContaining(['prayer:fajr', 'prayer:fajr:jamaah', 'quran', 'adhkarAM']));
  });
});

describe('habits linked to the wird', () => {
  it('read their days from the wird, and ticking them writes the wird', () => {
    setHabitLinks({ h1: 'prayer:fajr:jamaah' });
    useWirdStore.setState({ days: { '2026-10-24': { ...EMPTY_DAY, prayers: { fajr: 'jamaah' } }, '2026-10-23': { ...EMPTY_DAY, prayers: { fajr: 'alone' } } } });
    const entries = effectiveHabitEntries([{ id: 'old', habitId: 'h1', date: '2026-10-01' }], getHabitLinks(), useWirdStore.getState().days, items);
    expect(entries.map((e) => e.date)).toEqual(['2026-10-24']);

    toggleHabit({ id: 'h1' }, '2026-10-25', false);
    expect(useWirdStore.getState().days['2026-10-25'].prayers.fajr).toBe('jamaah');
  });

  it('fall back to their own days when their wird item is hidden', () => {
    setHabitLinks({ h1: 'quran' });
    const hidden = items.map((i) => (i.id === 'quran' ? { ...i, hidden: true } : i));
    const own = [{ id: 'e', habitId: 'h1', date: '2026-10-01' }];
    expect(effectiveHabitEntries(own, getHabitLinks(), {}, hidden)).toEqual(own);
  });

  it('linking moves the habit\'s days into the wird; unlinking brings the wird\'s days back', async () => {
    useAppStore.setState({ habitEntries: [{ id: 'e1', habitId: 'h1', date: '2026-10-20' }] });
    await linkHabit('h1', 'adhkarAM');
    expect(getHabitLinks()).toEqual({ h1: 'adhkarAM' });
    expect(useWirdStore.getState().days['2026-10-20'].adhkarAM).toBe(true);

    // Done in the wird while linked, then unticked on the 20th.
    setTargetDone('adhkarAM', '2026-10-22', true);
    setTargetDone('adhkarAM', '2026-10-20', false);
    expect(await unlinkHabit('h1')).toBe(true);
    expect(getHabitLinks()).toEqual({});
    expect(useAppStore.getState().habitEntries.map((e) => e.date)).toEqual(['2026-10-22']);
  });
});

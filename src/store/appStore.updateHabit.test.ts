import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import type { Habit } from '../types';
import { useAppStore } from './appStore';
import { mockSupabase, mockSupabaseResponse } from '../test/mockSupabase';

vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const session = { user: { id: 'user-1' } } as unknown as Session;

const habit: Habit = {
  id: 'h1',
  name: 'Exercise',
  icon: 'dumbbell',
  sortOrder: 0,
  active: true,
  startDate: '2026-02-01',
};

beforeEach(() => {
  mockSupabase.from.mockClear();
  mockSupabase.update.mockClear();
  mockSupabaseResponse.data = null;
  mockSupabaseResponse.error = null;
  useAppStore.setState({
    session,
    habits: [{ ...habit }],
    error: null,
  });
});

describe('updateHabit', () => {
  it('applies the start date update optimistically and returns { success: true }', async () => {
    const promise = useAppStore.getState().updateHabit('h1', { startDate: '2026-02-15' });
    // Optimistic: applied before the network call resolves.
    expect(useAppStore.getState().habits[0].startDate).toBe('2026-02-15');
    const result = await promise;
    expect(result).toEqual({ success: true });
    expect(useAppStore.getState().habits[0].startDate).toBe('2026-02-15');
  });

  it('rolls back to the previous habit and returns { success: false } with an error on failure', async () => {
    mockSupabaseResponse.error = { message: 'update failed' };
    const result = await useAppStore.getState().updateHabit('h1', { startDate: '2026-02-15' });
    expect(result).toEqual({ success: false });
    expect(useAppStore.getState().habits[0]).toEqual(habit);
    expect(useAppStore.getState().error).toBe('errors.updateHabit');
  });

  it('sends only the changed field in the DB payload', async () => {
    await useAppStore.getState().updateHabit('h1', { startDate: '2026-02-15' });

    const payload = mockSupabase.update.mock.calls[0][0];
    expect(payload).toEqual({ start_date: '2026-02-15' });
  });

  it('never deletes habit entries when moving the start date forward', async () => {
    useAppStore.setState({
      habitEntries: [{ id: 'e1', habitId: 'h1', date: '2026-02-05' }],
    });
    await useAppStore.getState().updateHabit('h1', { startDate: '2026-02-15' });
    // The entry stays in state — it's just no longer counted by habitStats,
    // and would count again if the start date is moved back earlier.
    expect(useAppStore.getState().habitEntries).toHaveLength(1);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import type { BacklogTodo, DailyTodo, WeeklyTodo, Habit, StickyNoteData } from '../types';
import { useAppStore } from './appStore';
import { mockSupabase, mockSupabaseResponse } from '../test/mockSupabase';

vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const session = { user: { id: 'user-1' } } as unknown as Session;

const dailyTodos: DailyTodo[] = [
  { id: 'd1', text: 'one', completed: false, priority: 'medium', createdAt: 1, sortOrder: 0, date: '2026-08-01', rolloverCount: 0, gate: 'daily', updatedAt: 1 },
  { id: 'd2', text: 'two', completed: false, priority: 'medium', createdAt: 2, sortOrder: 1, date: '2026-08-01', rolloverCount: 0, gate: 'daily', updatedAt: 1 },
  { id: 'd3', text: 'three', completed: false, priority: 'medium', createdAt: 3, sortOrder: 2, date: '2026-08-01', rolloverCount: 0, gate: 'daily', updatedAt: 1 },
];

const weeklyTodos: WeeklyTodo[] = [
  { id: 'w1', text: 'one', completed: false, priority: 'medium', createdAt: 1, sortOrder: 0, weekStart: '2026-07-27', rolloverCount: 0, gate: 'weekly', updatedAt: 1 },
  { id: 'w2', text: 'two', completed: false, priority: 'medium', createdAt: 2, sortOrder: 1, weekStart: '2026-07-27', rolloverCount: 0, gate: 'weekly', updatedAt: 1 },
];

const backlogTodos: BacklogTodo[] = [
  { id: 'b1', text: 'one', completed: false, priority: 'medium', createdAt: 1, sortOrder: 0, gate: 'backlog', updatedAt: 1 },
  { id: 'b2', text: 'two', completed: false, priority: 'medium', createdAt: 2, sortOrder: 1, gate: 'backlog', updatedAt: 1 },
];

const habits: Habit[] = [
  { id: 'h1', name: 'one', icon: 'star', sortOrder: 0, active: true, startDate: '2026-01-01' },
  { id: 'h2', name: 'two', icon: 'star', sortOrder: 1, active: true, startDate: '2026-01-01' },
];

const stickyNotes: StickyNoteData[] = [
  { id: 's1', title: 'one', text: '', sortOrder: 0 },
  { id: 's2', title: 'two', text: '', sortOrder: 1 },
];

beforeEach(() => {
  mockSupabase.from.mockClear();
  mockSupabase.update.mockClear();
  mockSupabase.eq.mockClear();
  mockSupabaseResponse.data = null;
  mockSupabaseResponse.error = null;
  useAppStore.setState({
    session,
    dailyTodos: dailyTodos.map((t) => ({ ...t })),
    weeklyTodos: weeklyTodos.map((t) => ({ ...t })),
    backlogTodos: backlogTodos.map((t) => ({ ...t })),
    habits: habits.map((h) => ({ ...h })),
    stickyNotes: stickyNotes.map((n) => ({ ...n })),
    error: null,
  });
});

describe('reorderDailyTodos', () => {
  it('applies the new order optimistically before the network call resolves', async () => {
    const promise = useAppStore.getState().reorderDailyTodos(['d3', 'd1', 'd2']);
    // Synchronous portion of the action runs before the first `await`.
    expect(useAppStore.getState().dailyTodos.map((t) => t.id)).toEqual(['d3', 'd1', 'd2']);
    await promise;
  });

  it('only sends update requests for rows whose sort_order actually changed', async () => {
    // d1 stays at index 0 (sortOrder unchanged); d2 and d3 swap.
    await useAppStore.getState().reorderDailyTodos(['d1', 'd3', 'd2']);

    expect(mockSupabase.update).toHaveBeenCalledTimes(2);
    expect(mockSupabase.update).toHaveBeenCalledWith({ sort_order: 1 });
    expect(mockSupabase.update).toHaveBeenCalledWith({ sort_order: 2 });
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'd3');
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'd2');
    expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-1');
    expect(mockSupabase.eq).not.toHaveBeenCalledWith('id', 'd1');
    expect(mockSupabase.from).toHaveBeenCalledWith('todos');
  });

  it('ignores unknown ids and keeps items missing from the list at the end', async () => {
    await useAppStore.getState().reorderDailyTodos(['unknown-id', 'd2', 'd1']);
    expect(useAppStore.getState().dailyTodos.map((t) => t.id)).toEqual(['d2', 'd1', 'd3']);
    expect(useAppStore.getState().dailyTodos.map((t) => t.sortOrder)).toEqual([0, 1, 2]);
  });

  it('rolls back to the previous order and sets an error when persistence fails', async () => {
    mockSupabaseResponse.error = { message: 'update failed' };
    await useAppStore.getState().reorderDailyTodos(['d3', 'd1', 'd2']);
    expect(useAppStore.getState().dailyTodos.map((t) => t.id)).toEqual(['d1', 'd2', 'd3']);
    expect(useAppStore.getState().dailyTodos).toEqual(dailyTodos);
    expect(useAppStore.getState().error).toBe('errors.reorderTodos');
  });

  it('does nothing when there is no session', async () => {
    useAppStore.setState({ session: null });
    await useAppStore.getState().reorderDailyTodos(['d3', 'd1', 'd2']);
    expect(useAppStore.getState().dailyTodos.map((t) => t.id)).toEqual(['d1', 'd2', 'd3']);
    expect(mockSupabase.update).not.toHaveBeenCalled();
  });
});

describe('reorderWeeklyTodos', () => {
  it('applies the new order optimistically, then rolls back when persistence fails', async () => {
    mockSupabaseResponse.error = { message: 'update failed' };
    const promise = useAppStore.getState().reorderWeeklyTodos(['w2', 'w1']);
    expect(useAppStore.getState().weeklyTodos.map((t) => t.id)).toEqual(['w2', 'w1']);
    await promise;
    expect(useAppStore.getState().weeklyTodos).toEqual(weeklyTodos);
    expect(useAppStore.getState().error).toBe('errors.reorderTodos');
  });

  it('persists to the todos table on success', async () => {
    await useAppStore.getState().reorderWeeklyTodos(['w2', 'w1']);
    expect(useAppStore.getState().weeklyTodos.map((t) => t.id)).toEqual(['w2', 'w1']);
    expect(mockSupabase.from).toHaveBeenCalledWith('todos');
    expect(mockSupabase.update).toHaveBeenCalledTimes(2);
  });
});

describe('reorderBacklogTodos', () => {
  it('persists only changed rows to the todos table', async () => {
    await useAppStore.getState().reorderBacklogTodos(['b1', 'b2']);
    // Order unchanged, so nothing should be sent.
    expect(mockSupabase.update).not.toHaveBeenCalled();
    expect(useAppStore.getState().backlogTodos).toEqual(backlogTodos);
  });

  it('rolls back on failure', async () => {
    mockSupabaseResponse.error = { message: 'update failed' };
    await useAppStore.getState().reorderBacklogTodos(['b2', 'b1']);
    expect(useAppStore.getState().backlogTodos).toEqual(backlogTodos);
    expect(useAppStore.getState().error).toBe('errors.reorderTodos');
  });
});

describe('reorderHabits', () => {
  it('persists to the habits table and rolls back on failure', async () => {
    mockSupabaseResponse.error = { message: 'update failed' };
    await useAppStore.getState().reorderHabits(['h2', 'h1']);
    expect(mockSupabase.from).toHaveBeenCalledWith('habits');
    expect(useAppStore.getState().habits).toEqual(habits);
    expect(useAppStore.getState().error).toBe('errors.reorderHabits');
  });

  it('applies the new order on success', async () => {
    await useAppStore.getState().reorderHabits(['h2', 'h1']);
    expect(useAppStore.getState().habits.map((h) => h.id)).toEqual(['h2', 'h1']);
  });
});

describe('reorderStickyNotes', () => {
  it('persists to the sticky_notes table and rolls back on failure', async () => {
    mockSupabaseResponse.error = { message: 'update failed' };
    await useAppStore.getState().reorderStickyNotes(['s2', 's1']);
    expect(mockSupabase.from).toHaveBeenCalledWith('sticky_notes');
    expect(useAppStore.getState().stickyNotes).toEqual(stickyNotes);
    expect(useAppStore.getState().error).toBe('errors.reorderStickyNotes');
  });

  it('applies the new order on success', async () => {
    await useAppStore.getState().reorderStickyNotes(['s2', 's1']);
    expect(useAppStore.getState().stickyNotes.map((n) => n.id)).toEqual(['s2', 's1']);
  });
});

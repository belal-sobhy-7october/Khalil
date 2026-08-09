import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import type { BacklogTodo, DailyTodo, WeeklyTodo } from '../types';
import { useAppStore } from './appStore';
import { mockSupabase, mockSupabaseResponse } from '../test/mockSupabase';

vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const session = { user: { id: 'user-1' } } as unknown as Session;

const dailyTodo: DailyTodo = {
  id: 'd1',
  text: 'daily',
  completed: false,
  priority: 'medium',
  createdAt: 1,
  sortOrder: 0,
  date: '2026-08-01',
  rolloverCount: 0,
  gate: 'daily',
  updatedAt: 1,
};

const weeklyTodo: WeeklyTodo = {
  id: 'w1',
  text: 'weekly',
  completed: false,
  priority: 'medium',
  createdAt: 1,
  sortOrder: 0,
  weekStart: '2026-07-27',
  rolloverCount: 0,
  gate: 'weekly',
  updatedAt: 1,
};

const backlogTodo: BacklogTodo = {
  id: 'b1',
  text: 'backlog',
  completed: false,
  priority: 'medium',
  createdAt: 1,
  sortOrder: 0,
  gate: 'backlog',
  updatedAt: 1,
};

beforeEach(() => {
  mockSupabase.from.mockClear();
  mockSupabaseResponse.data = null;
  mockSupabaseResponse.error = null;
  useAppStore.setState({
    session,
    dailyTodos: [dailyTodo],
    weeklyTodos: [weeklyTodo],
    backlogTodos: [backlogTodo],
    error: null,
  });
});

describe('removeDailyTodo', () => {
  it('calls delete with correct id', async () => {
    await useAppStore.getState().removeDailyTodo('d1');
    expect(mockSupabase.from).toHaveBeenCalledWith('todos');
    expect(mockSupabase.delete).toHaveBeenCalled();
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'd1');
  });

  it('removes todo from state on success', async () => {
    await useAppStore.getState().removeDailyTodo('d1');
    expect(useAppStore.getState().dailyTodos).toHaveLength(0);
  });

  it('keeps todo in state and sets error on failure', async () => {
    mockSupabaseResponse.error = { message: 'delete failed' };
    await useAppStore.getState().removeDailyTodo('d1');
    expect(useAppStore.getState().dailyTodos).toHaveLength(1);
    expect(useAppStore.getState().dailyTodos[0]).toEqual(dailyTodo);
    expect(useAppStore.getState().error).toBe('Failed to delete task. Please try again.');
  });

  it('clears previous error before setting new error', async () => {
    useAppStore.setState({ error: 'previous error' });
    mockSupabaseResponse.error = { message: 'delete failed' };
    await useAppStore.getState().removeDailyTodo('d1');
    expect(useAppStore.getState().error).toBe('Failed to delete task. Please try again.');
  });
});

describe('removeWeeklyTodo', () => {
  it('calls delete with correct id', async () => {
    await useAppStore.getState().removeWeeklyTodo('w1');
    expect(mockSupabase.from).toHaveBeenCalledWith('todos');
    expect(mockSupabase.delete).toHaveBeenCalled();
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'w1');
  });

  it('removes todo from state on success', async () => {
    await useAppStore.getState().removeWeeklyTodo('w1');
    expect(useAppStore.getState().weeklyTodos).toHaveLength(0);
  });

  it('keeps todo in state and sets error on failure', async () => {
    mockSupabaseResponse.error = { message: 'delete failed' };
    await useAppStore.getState().removeWeeklyTodo('w1');
    expect(useAppStore.getState().weeklyTodos).toHaveLength(1);
    expect(useAppStore.getState().weeklyTodos[0]).toEqual(weeklyTodo);
    expect(useAppStore.getState().error).toBe('Failed to delete task. Please try again.');
  });
});

describe('removeBacklogTodo', () => {
  it('calls delete with correct id', async () => {
    await useAppStore.getState().removeBacklogTodo('b1');
    expect(mockSupabase.from).toHaveBeenCalledWith('todos');
    expect(mockSupabase.delete).toHaveBeenCalled();
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'b1');
  });

  it('removes todo from state on success', async () => {
    await useAppStore.getState().removeBacklogTodo('b1');
    expect(useAppStore.getState().backlogTodos).toHaveLength(0);
  });

  it('keeps todo in state and sets error on failure', async () => {
    mockSupabaseResponse.error = { message: 'delete failed' };
    await useAppStore.getState().removeBacklogTodo('b1');
    expect(useAppStore.getState().backlogTodos).toHaveLength(1);
    expect(useAppStore.getState().backlogTodos[0]).toEqual(backlogTodo);
    expect(useAppStore.getState().error).toBe('Failed to delete task. Please try again.');
  });
});

describe('delete error handling', () => {
  it('handles network error with fallback message', async () => {
    mockSupabaseResponse.data = null;
    mockSupabaseResponse.error = { message: 'Network error' };
    
    await useAppStore.getState().removeDailyTodo('d1');
    
    expect(useAppStore.getState().error).toBe('Failed to delete task. Please try again.');
  });

  it('handles RLS permission error', async () => {
    mockSupabaseResponse.data = null;
    mockSupabaseResponse.error = { message: 'new row violates row-level security policy' };
    
    await useAppStore.getState().removeWeeklyTodo('w1');
    
    expect(useAppStore.getState().error).toBe('Failed to delete task. Please try again.');
  });

  it('handles record not found error', async () => {
    mockSupabaseResponse.data = null;
    mockSupabaseResponse.error = { message: 'PGRST116' };
    
    await useAppStore.getState().removeBacklogTodo('b1');
    
    expect(useAppStore.getState().error).toBe('Failed to delete task. Please try again.');
  });
});

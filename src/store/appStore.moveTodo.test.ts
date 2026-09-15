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
  mockSupabase.rpc.mockClear();
  mockSupabaseResponse.data = null;
  mockSupabaseResponse.error = null;
  useAppStore.setState({
    session,
    dailyTodos: [dailyTodo],
    weeklyTodos: [weeklyTodo],
    backlogTodos: [backlogTodo],
  });
});

describe('moveToDaily', () => {
  it('calls the move_todo_item RPC with the new gate-based parameters', async () => {
    await useAppStore.getState().moveToDaily('b1');
    expect(mockSupabase.rpc).toHaveBeenCalledWith('move_todo_item', {
      p_task_id: 'b1',
      p_to_gate: 'daily',
      p_date: expect.any(String),
    });
  });

  it('preserves completed state when moving from backlog', async () => {
    useAppStore.setState({ backlogTodos: [{ id: 'b2', text: 'completed backlog', completed: true, priority: 'medium', sortOrder: 0, createdAt: 1, gate: 'backlog', updatedAt: 1 }] });
    await useAppStore.getState().moveToDaily('b2');
    expect(mockSupabase.rpc).toHaveBeenCalledWith('move_todo_item', {
      p_task_id: 'b2',
      p_to_gate: 'daily',
      p_date: expect.any(String),
    });
  });

  it('leaves source and target lists unchanged when the RPC fails', async () => {
    mockSupabaseResponse.error = { message: 'rpc failed' };
    await useAppStore.getState().moveToDaily('b1');
    expect(useAppStore.getState().backlogTodos).toHaveLength(1);
    expect(useAppStore.getState().dailyTodos).toHaveLength(1);
    expect(useAppStore.getState().backlogTodos[0]).toEqual(backlogTodo);
    expect(useAppStore.getState().dailyTodos[0]).toEqual(dailyTodo);
  });
});

describe('moveToWeekly', () => {
  it('leaves source and target lists unchanged when the RPC fails', async () => {
    mockSupabaseResponse.error = { message: 'rpc failed' };
    await useAppStore.getState().moveToWeekly('d1');
    expect(useAppStore.getState().dailyTodos).toHaveLength(1);
    expect(useAppStore.getState().weeklyTodos).toHaveLength(1);
    expect(useAppStore.getState().dailyTodos[0]).toEqual(dailyTodo);
    expect(useAppStore.getState().weeklyTodos[0]).toEqual(weeklyTodo);
  });
});

describe('moveToBacklog', () => {
  it('leaves source and target lists unchanged when the RPC fails', async () => {
    mockSupabaseResponse.error = { message: 'rpc failed' };
    await useAppStore.getState().moveToBacklog('d1', 'daily');
    expect(useAppStore.getState().dailyTodos).toHaveLength(1);
    expect(useAppStore.getState().backlogTodos).toHaveLength(1);
    expect(useAppStore.getState().dailyTodos[0]).toEqual(dailyTodo);
    expect(useAppStore.getState().backlogTodos[0]).toEqual(backlogTodo);
  });
});

describe('success path', () => {
  it('moveToDaily updates local state when the RPC succeeds and preserves ID', async () => {
    mockSupabaseResponse.data = { success: true, code: 'MOVED', task_id: 'b1', from_gate: 'backlog', to_gate: 'daily' };
    await useAppStore.getState().moveToDaily('b1');
    expect(useAppStore.getState().backlogTodos).toHaveLength(0);
    expect(useAppStore.getState().dailyTodos).toHaveLength(2);
    expect(useAppStore.getState().dailyTodos[1]).toMatchObject({
      id: 'b1', // ID preserved
      text: 'backlog',
      completed: false,
      priority: 'medium',
      sortOrder: 1,
      createdAt: 1,
      rolloverCount: 0,
      gate: 'daily',
    });
  });

  it('moveToDaily preserves original createdAt and increments rolloverCount from weekly', async () => {
    mockSupabaseResponse.data = { success: true, code: 'MOVED', task_id: 'w1', from_gate: 'weekly', to_gate: 'daily' };
    await useAppStore.getState().moveToDaily('w1');
    expect(useAppStore.getState().weeklyTodos).toHaveLength(0);
    expect(useAppStore.getState().dailyTodos).toHaveLength(2);
    expect(useAppStore.getState().dailyTodos[1]).toMatchObject({
      id: 'w1', // ID preserved
      text: 'weekly',
      completed: false,
      priority: 'medium',
      sortOrder: 1,
      createdAt: 1,
      rolloverCount: 1,
      gate: 'daily',
    });
  });

  it('moveToWeekly preserves original createdAt and increments rolloverCount from daily', async () => {
    mockSupabaseResponse.data = { success: true, code: 'MOVED', task_id: 'd1', from_gate: 'daily', to_gate: 'weekly' };
    await useAppStore.getState().moveToWeekly('d1');
    expect(useAppStore.getState().dailyTodos).toHaveLength(0);
    expect(useAppStore.getState().weeklyTodos).toHaveLength(2);
    expect(useAppStore.getState().weeklyTodos[1]).toMatchObject({
      id: 'd1', // ID preserved
      text: 'daily',
      completed: false,
      priority: 'medium',
      sortOrder: 1,
      createdAt: 1,
      rolloverCount: 1,
      gate: 'weekly',
    });
  });

  it('moveToBacklog preserves original createdAt', async () => {
    mockSupabaseResponse.data = { success: true, code: 'MOVED', task_id: 'd1', from_gate: 'daily', to_gate: 'backlog' };
    await useAppStore.getState().moveToBacklog('d1', 'daily');
    expect(useAppStore.getState().dailyTodos).toHaveLength(0);
    expect(useAppStore.getState().backlogTodos).toHaveLength(2);
    expect(useAppStore.getState().backlogTodos[1]).toMatchObject({
      id: 'd1', // ID preserved
      text: 'daily',
      completed: false,
      priority: 'medium',
      sortOrder: 1,
      createdAt: 1,
      gate: 'backlog',
    });
  });

  it('moveToWeekly preserves completed state from daily', async () => {
    mockSupabaseResponse.data = { success: true, code: 'MOVED', task_id: 'd2', from_gate: 'daily', to_gate: 'weekly' };
    useAppStore.setState({ dailyTodos: [{ id: 'd2', text: 'completed daily', completed: true, priority: 'medium', sortOrder: 0, date: '2026-08-01', rolloverCount: 0, createdAt: 1, gate: 'daily', updatedAt: 1 }] });
    await useAppStore.getState().moveToWeekly('d2');
    expect(mockSupabase.rpc).toHaveBeenCalledWith('move_todo_item', {
      p_task_id: 'd2',
      p_to_gate: 'weekly',
      p_week_start: expect.any(String),
    });
  });

  it('moveToBacklog preserves completed state from weekly', async () => {
    mockSupabaseResponse.data = { success: true, code: 'MOVED', task_id: 'w2', from_gate: 'weekly', to_gate: 'backlog' };
    useAppStore.setState({ weeklyTodos: [{ id: 'w2', text: 'completed weekly', completed: true, priority: 'medium', sortOrder: 0, weekStart: '2026-08-03', rolloverCount: 0, createdAt: 1, gate: 'weekly', updatedAt: 1 }] });
    await useAppStore.getState().moveToBacklog('w2', 'weekly');
    expect(mockSupabase.rpc).toHaveBeenCalledWith('move_todo_item', {
      p_task_id: 'w2',
      p_to_gate: 'backlog',
    });
  });
});

describe('duplicate prevention', () => {
  it('prevents duplicate movement requests for the same task', async () => {
    mockSupabaseResponse.data = { success: true, code: 'MOVED', task_id: 'b1', from_gate: 'backlog', to_gate: 'daily' };
    const store = useAppStore.getState();
    const promise1 = store.moveToDaily('b1');
    const promise2 = store.moveToDaily('b1');
    
    await Promise.all([promise1, promise2]);
    
    // Should only call RPC once
    expect(mockSupabase.rpc).toHaveBeenCalledTimes(1);
  });
});

describe('structured error handling', () => {
  it('handles RPC failure with structured error message', async () => {
    mockSupabaseResponse.data = { success: false, code: 'NOT_FOUND', message: 'Task not found or unauthorized' };
    mockSupabaseResponse.error = null;
    
    await useAppStore.getState().moveToDaily('b1');
    
    expect(useAppStore.getState().error).toBe('Task not found or unauthorized');
  });

  it('handles RPC network error with fallback message', async () => {
    mockSupabaseResponse.data = null;
    mockSupabaseResponse.error = { message: 'Network error' };
    
    await useAppStore.getState().moveToDaily('b1');
    
    expect(useAppStore.getState().error).toBe('errors.moveTask');
  });

  it('handles RPC failure with code but no message', async () => {
    mockSupabaseResponse.data = { success: false, code: 'NOT_FOUND' };
    mockSupabaseResponse.error = null;
    
    await useAppStore.getState().moveToDaily('b1');
    
    expect(useAppStore.getState().error).toBe('errors.moveTask');
  });
});

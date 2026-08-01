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
};

const backlogTodo: BacklogTodo = {
  id: 'b1',
  text: 'backlog',
  completed: false,
  priority: 'medium',
  createdAt: 1,
  sortOrder: 0,
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
  it('calls the move_todo_item RPC with the source/target tables and payload', async () => {
    await useAppStore.getState().moveToDaily('b1');
    expect(mockSupabase.rpc).toHaveBeenCalledWith('move_todo_item', {
      p_id: 'b1',
      p_from_table: 'backlog_todos',
      p_to_table: 'daily_todos',
      p_payload: expect.objectContaining({
        user_id: 'user-1',
        text: 'backlog',
        completed: false,
        priority: 'medium',
        date: '2026-08-01',
        sort_order: 1,
      }),
      p_user_id: 'user-1',
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
  it('moveToDaily updates local state when the RPC succeeds', async () => {
    await useAppStore.getState().moveToDaily('b1');
    expect(useAppStore.getState().backlogTodos).toHaveLength(0);
    expect(useAppStore.getState().dailyTodos).toHaveLength(2);
    expect(useAppStore.getState().dailyTodos[1]).toMatchObject({
      text: 'backlog',
      completed: false,
      priority: 'medium',
      sortOrder: 1,
    });
  });
});

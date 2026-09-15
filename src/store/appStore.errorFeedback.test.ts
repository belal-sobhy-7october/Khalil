import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import type { WeeklyTodo, BacklogTodo, StickyNoteData, SubTrack, LifeCategory, DailyFocus } from '../types';
import { useAppStore } from './appStore';
import { mockSupabase, mockSupabaseResponse } from '../test/mockSupabase';

vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const session = { user: { id: 'user-1' } } as unknown as Session;

const weeklyTodo: WeeklyTodo = {
  id: 'w1', text: 'weekly', completed: false, priority: 'medium', createdAt: 1,
  sortOrder: 0, weekStart: '2026-07-27', rolloverCount: 0, gate: 'weekly', updatedAt: 1,
};

const backlogTodo: BacklogTodo = {
  id: 'b1', text: 'backlog', completed: false, priority: 'medium', createdAt: 1,
  sortOrder: 0, gate: 'backlog', updatedAt: 1,
};

const stickyNote: StickyNoteData = { id: 's1', title: 'Groceries', text: 'Milk', sortOrder: 0 };

const subTrack: SubTrack = {
  id: 't1', categoryId: 'c1', name: 'Reading', nameKey: '', icon: 'book',
  progressType: 'counter', target: 100, unit: 'pages', currentValue: 10, sortOrder: 0,
};

const lifeCategory: LifeCategory = { id: 'c1', name: 'Health', nameKey: '', icon: 'heart', color: 'terracotta', sortOrder: 0 };

const dailyFocus: DailyFocus = { text: 'Ship the store fixes', date: '2026-08-01' };

beforeEach(() => {
  mockSupabase.from.mockClear();
  mockSupabaseResponse.data = null;
  mockSupabaseResponse.error = null;
  useAppStore.setState({
    session,
    weeklyTodos: [{ ...weeklyTodo }],
    backlogTodos: [{ ...backlogTodo }],
    stickyNotes: [{ ...stickyNote }],
    subTracks: [{ ...subTrack }],
    lifeCategories: [{ ...lifeCategory }],
    dailyFocus: { ...dailyFocus },
    error: null,
  });
});

describe('toggleWeeklyTodo', () => {
  it('applies optimistically, then rolls back and sets an error on failure', async () => {
    const promise = useAppStore.getState().toggleWeeklyTodo('w1');
    expect(useAppStore.getState().weeklyTodos[0].completed).toBe(true);

    mockSupabaseResponse.error = { message: 'update failed' };
    await promise;

    expect(useAppStore.getState().weeklyTodos[0]).toEqual(weeklyTodo);
    expect(useAppStore.getState().error).toBe('errors.updateTodo');
  });
});

describe('toggleBacklogTodo', () => {
  it('applies optimistically, then rolls back and sets an error on failure', async () => {
    const promise = useAppStore.getState().toggleBacklogTodo('b1');
    expect(useAppStore.getState().backlogTodos[0].completed).toBe(true);

    mockSupabaseResponse.error = { message: 'update failed' };
    await promise;

    expect(useAppStore.getState().backlogTodos[0]).toEqual(backlogTodo);
    expect(useAppStore.getState().error).toBe('errors.updateTodo');
  });
});

describe('updateStickyNote', () => {
  it('applies optimistically, then rolls back and sets an error on failure', async () => {
    const promise = useAppStore.getState().updateStickyNote('s1', { text: 'Milk, eggs' });
    expect(useAppStore.getState().stickyNotes[0].text).toBe('Milk, eggs');

    mockSupabaseResponse.error = { message: 'update failed' };
    await promise;

    expect(useAppStore.getState().stickyNotes[0]).toEqual(stickyNote);
    expect(useAppStore.getState().error).toBe('errors.updateStickyNote');
  });
});

describe('incrementSubTrack', () => {
  it('applies the new value optimistically, then rolls back and sets an error on failure', async () => {
    const promise = useAppStore.getState().incrementSubTrack('t1', 5);
    expect(useAppStore.getState().subTracks[0].currentValue).toBe(15);

    mockSupabaseResponse.error = { message: 'update failed' };
    await promise;

    expect(useAppStore.getState().subTracks[0]).toEqual(subTrack);
    expect(useAppStore.getState().error).toBe('errors.updateSubTrack');
  });

  it('clamps the optimistic value to the target', async () => {
    await useAppStore.getState().incrementSubTrack('t1', 1000);
    expect(useAppStore.getState().subTracks[0].currentValue).toBe(100);
  });
});

describe('updateLifeCategory', () => {
  it('applies optimistically, then rolls back and sets an error on failure', async () => {
    mockSupabaseResponse.error = { message: 'update failed' };
    await useAppStore.getState().updateLifeCategory('c1', { name: 'Fitness' });

    expect(useAppStore.getState().lifeCategories[0]).toEqual(lifeCategory);
    expect(useAppStore.getState().error).toBe('errors.updateLifeCategory');
  });
});

describe('setDailyFocus', () => {
  it('applies optimistically, then rolls back and sets an error on failure', async () => {
    const next = { text: 'New focus', date: '2026-08-02' };
    const promise = useAppStore.getState().setDailyFocus(next);
    expect(useAppStore.getState().dailyFocus).toEqual(next);

    mockSupabaseResponse.error = { message: 'upsert failed' };
    await promise;

    expect(useAppStore.getState().dailyFocus).toEqual(dailyFocus);
    expect(useAppStore.getState().error).toBe('errors.setDailyFocus');
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import type { Habit, HabitEntry } from '../types';
import { useAppStore } from './appStore';
import { getToday } from './dateHelpers';
import { mockSupabase, mockSupabaseResponse } from '../test/mockSupabase';

vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const session = { user: { id: 'user-1' } } as unknown as Session;
const today = getToday();

const habit: Habit = {
  id: 'h1',
  name: 'Exercise',
  icon: 'dumbbell',
  sortOrder: 0,
  active: true,
  startDate: today,
};

const entry: HabitEntry = {
  id: 'e1',
  habitId: 'h1',
  date: today,
};

beforeEach(() => {
  mockSupabase.from.mockClear();
  mockSupabaseResponse.data = null;
  mockSupabaseResponse.error = null;
  useAppStore.setState({
    session,
    habits: [habit],
    habitEntries: [entry],
  });
});

describe('toggleHabitEntry', () => {
  it('optimistically adds entry then inserts on success', async () => {
    mockSupabaseResponse.data = null;
    mockSupabaseResponse.error = null;
    
    // Start with no entry for today
    useAppStore.setState({ habitEntries: [] });
    
    await useAppStore.getState().toggleHabitEntry('h1', today);
    
    // Optimistic add should have happened
    expect(useAppStore.getState().habitEntries).toHaveLength(1);
    expect(useAppStore.getState().habitEntries[0]).toMatchObject({
      habitId: 'h1',
      date: today,
    });
    
    // Should have called insert
    expect(mockSupabase.from).toHaveBeenCalledWith('habit_entries');
  });

  it('optimistically removes entry then deletes on success', async () => {
    mockSupabaseResponse.data = null;
    mockSupabaseResponse.error = null;
    
    // Start with an entry
    useAppStore.setState({ habitEntries: [entry] });
    
    await useAppStore.getState().toggleHabitEntry('h1', today);
    
    // Optimistic delete should have happened
    expect(useAppStore.getState().habitEntries).toHaveLength(0);
    
    // Should have called delete
    expect(mockSupabase.from).toHaveBeenCalledWith('habit_entries');
  });

  it('rolls back optimistic add on failure', async () => {
    mockSupabaseResponse.error = { message: 'insert failed' };
    
    // Start with no entry
    useAppStore.setState({ habitEntries: [] });
    
    await useAppStore.getState().toggleHabitEntry('h1', today);
    
    // Should have rolled back to empty
    expect(useAppStore.getState().habitEntries).toHaveLength(0);
  });

  it('rolls back optimistic delete on failure', async () => {
    mockSupabaseResponse.error = { message: 'delete failed' };
    
    // Start with an entry
    useAppStore.setState({ habitEntries: [entry] });
    
    await useAppStore.getState().toggleHabitEntry('h1', today);
    
    // Should have rolled back to original entry
    expect(useAppStore.getState().habitEntries).toHaveLength(1);
    expect(useAppStore.getState().habitEntries[0]).toEqual(entry);
  });
});

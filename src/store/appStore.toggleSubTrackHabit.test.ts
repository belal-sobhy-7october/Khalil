import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import type { SubTrack, SubTrackEntry } from '../types';
import { useAppStore } from './appStore';
import { getToday } from './dateHelpers';
import { mockSupabase, mockSupabaseResponse } from '../test/mockSupabase';

vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const session = { user: { id: 'user-1' } } as unknown as Session;
const today = getToday();

const track: SubTrack = {
  id: 't1',
  categoryId: 'c1',
  name: 'Quran',
  nameKey: 'quran',
  icon: 'book-open',
  progressType: 'habit',
  target: 604,
  unit: 'pages',
  currentValue: 3,
  sortOrder: 1,
};

const entry: SubTrackEntry = {
  id: 'e1',
  trackId: 't1',
  value: 1,
  date: today,
  note: '',
};

beforeEach(() => {
  mockSupabase.rpc.mockClear();
  mockSupabaseResponse.data = null;
  mockSupabaseResponse.error = null;
  useAppStore.setState({
    session,
    subTracks: [track],
    subTrackEntries: [entry],
  });
});

describe('toggleSubTrackHabit', () => {
  it('calls the RPC and adds the entry + applies the returned currentValue on success', async () => {
    mockSupabaseResponse.data = [{ is_on: true, new_value: 4, entry_id: 'e-new' }];
    await useAppStore.getState().toggleSubTrackHabit('t1');
    expect(mockSupabase.rpc).toHaveBeenCalledWith('toggle_sub_track_habit', {
      p_track_id: 't1',
      p_user_id: 'user-1',
      p_date: today,
    });
    expect(useAppStore.getState().subTrackEntries).toHaveLength(2);
    expect(useAppStore.getState().subTrackEntries[1]).toMatchObject({
      id: 'e-new',
      trackId: 't1',
      value: 1,
      date: today,
    });
    expect(useAppStore.getState().subTracks[0].currentValue).toBe(4);
  });

  it('removes the entry and uses the returned currentValue when toggling off', async () => {
    mockSupabaseResponse.data = [{ is_on: false, new_value: 2, entry_id: null }];
    await useAppStore.getState().toggleSubTrackHabit('t1');
    expect(useAppStore.getState().subTrackEntries).toHaveLength(0);
    expect(useAppStore.getState().subTracks[0].currentValue).toBe(2);
  });

  it('leaves both local lists unchanged when the RPC fails', async () => {
    mockSupabaseResponse.error = { message: 'rpc failed' };
    await useAppStore.getState().toggleSubTrackHabit('t1');
    expect(useAppStore.getState().subTrackEntries).toHaveLength(1);
    expect(useAppStore.getState().subTrackEntries[0]).toEqual(entry);
    expect(useAppStore.getState().subTracks[0]).toEqual(track);
  });
});

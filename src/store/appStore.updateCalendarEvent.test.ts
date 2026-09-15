import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import type { CalendarEvent } from '../types';
import { useAppStore } from './appStore';
import { mockSupabase, mockSupabaseResponse } from '../test/mockSupabase';

vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const session = { user: { id: 'user-1' } } as unknown as Session;

const timedEvent: CalendarEvent = {
  id: 'e1',
  userId: 'user-1',
  title: 'Standup',
  date: '2026-08-01',
  startTime: '09:00',
  endTime: '09:30',
  allDay: false,
  completed: false,
  color: 'clay-soft',
  createdAt: 1,
  updatedAt: 1,
};

beforeEach(() => {
  mockSupabase.from.mockClear();
  mockSupabase.update.mockClear();
  mockSupabaseResponse.data = null;
  mockSupabaseResponse.error = null;
  useAppStore.setState({
    session,
    calendarEvents: [{ ...timedEvent }],
    error: null,
  });
});

describe('updateCalendarEvent', () => {
  it('applies the update optimistically and returns { success: true }', async () => {
    const promise = useAppStore.getState().updateCalendarEvent('e1', { title: 'Standup (moved)' });
    // Optimistic: applied before the network call resolves.
    expect(useAppStore.getState().calendarEvents[0].title).toBe('Standup (moved)');
    const result = await promise;
    expect(result).toEqual({ success: true });
    expect(useAppStore.getState().calendarEvents[0].title).toBe('Standup (moved)');
  });

  it('rolls back to the previous event and returns { success: false } with an error on failure', async () => {
    mockSupabaseResponse.error = { message: 'update failed' };
    const result = await useAppStore.getState().updateCalendarEvent('e1', { title: 'Standup (moved)' });
    expect(result).toEqual({ success: false });
    expect(useAppStore.getState().calendarEvents[0]).toEqual(timedEvent);
    expect(useAppStore.getState().error).toBe('errors.updateCalendarEvent');
  });

  it('sends explicit nulls for start_time/end_time when switching to all-day', async () => {
    await useAppStore.getState().updateCalendarEvent('e1', { allDay: true });

    expect(mockSupabase.update).toHaveBeenCalledWith(
      expect.objectContaining({ all_day: true, start_time: null, end_time: null })
    );
  });

  it('clears startTime/endTime in local state when switching to all-day', async () => {
    await useAppStore.getState().updateCalendarEvent('e1', { allDay: true });

    const event = useAppStore.getState().calendarEvents[0];
    expect(event.allDay).toBe(true);
    expect(event.startTime).toBeUndefined();
    expect(event.endTime).toBeUndefined();
  });

  it('does not touch start_time/end_time in the DB payload for an unrelated field update', async () => {
    await useAppStore.getState().updateCalendarEvent('e1', { title: 'Renamed' });

    const payload = mockSupabase.update.mock.calls[0][0];
    expect(payload).not.toHaveProperty('start_time');
    expect(payload).not.toHaveProperty('end_time');
  });
});

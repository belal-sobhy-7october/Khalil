import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Session } from '@supabase/supabase-js';
import { useAppStore } from './appStore';
import { mockSupabase } from '../test/mockSupabase';

vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const session = { user: { id: 'user-1' } } as unknown as Session;

// A minimal per-table query stub: select/eq/order/limit all return itself so
// arbitrary chains work, and `range` (or `limit`, for the one non-paged table)
// resolves with whatever this table was configured to return.
function createTableQuery(resolve: (offset: number) => { data: unknown[] | null; error: unknown }) {
  const query = {
    select: vi.fn(() => query),
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => Promise.resolve(resolve(0))),
    range: vi.fn((from: number) => Promise.resolve(resolve(from))),
  };
  return query;
}

function emptyTableQuery() {
  return createTableQuery(() => ({ data: [], error: null }));
}

function makeHabitEntryRows(count: number, startIndex: number) {
  return Array.from({ length: count }, (_, i) => {
    const n = startIndex + i;
    return {
      id: `he-${n}`,
      habit_id: 'h1',
      date: `2024-${String(Math.floor(n / 28) + 1).padStart(2, '0')}-${String((n % 28) + 1).padStart(2, '0')}`,
    };
  });
}

const CORE_TABLES = [
  'daily_focus', 'todos', 'life_categories', 'sub_tracks', 'sub_track_entries',
  'bookmark_categories', 'bookmarks', 'habits', 'habit_entries', 'daily_mood',
  'calendar_events', 'sticky_notes', 'todo_notes',
];

beforeEach(() => {
  useAppStore.setState({
    session,
    habitEntries: [], dailyMoods: [], calendarEvents: [], subTrackEntries: [],
    dailyTodos: [], weeklyTodos: [], backlogTodos: [], error: null,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadUserData pagination', () => {
  it('pages through a table with more than 1000 rows and keeps every row', async () => {
    const page1 = makeHabitEntryRows(1000, 0);
    const page2 = makeHabitEntryRows(250, 1000);
    const tables: Record<string, ReturnType<typeof createTableQuery>> = {};
    for (const table of CORE_TABLES) {
      tables[table] = table === 'habit_entries'
        ? createTableQuery((offset) => ({ data: offset === 0 ? page1 : offset === 1000 ? page2 : [], error: null }))
        : emptyTableQuery();
    }
    mockSupabase.from.mockImplementation((table: string) => tables[table] ?? emptyTableQuery());

    await useAppStore.getState().loadUserData();

    expect(useAppStore.getState().habitEntries).toHaveLength(1250);
    expect(useAppStore.getState().habitEntries[0].id).toBe('he-0');
    expect(useAppStore.getState().habitEntries[1249].id).toBe('he-1249');
    // Two pages were requested: [0, 999] then [1000, 1999].
    expect(tables.habit_entries.range).toHaveBeenCalledTimes(2);
    expect(tables.habit_entries.range).toHaveBeenNthCalledWith(1, 0, 999);
    expect(tables.habit_entries.range).toHaveBeenNthCalledWith(2, 1000, 1999);
  });

  it('stops after exactly one page when a table has fewer than 1000 rows', async () => {
    const rows = makeHabitEntryRows(3, 0);
    const tables: Record<string, ReturnType<typeof createTableQuery>> = {};
    for (const table of CORE_TABLES) {
      tables[table] = table === 'calendar_events'
        ? createTableQuery(() => ({ data: rows, error: null }))
        : emptyTableQuery();
    }
    mockSupabase.from.mockImplementation((table: string) => tables[table] ?? emptyTableQuery());

    await useAppStore.getState().loadUserData();

    expect(tables.calendar_events.range).toHaveBeenCalledTimes(1);
  });

  it('logs a dev warning once a table grows past a single PostgREST page', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const page1 = makeHabitEntryRows(1000, 0);
    const page2 = makeHabitEntryRows(1, 1000);
    const tables: Record<string, ReturnType<typeof createTableQuery>> = {};
    for (const table of CORE_TABLES) {
      tables[table] = table === 'habit_entries'
        ? createTableQuery((offset) => ({ data: offset === 0 ? page1 : page2, error: null }))
        : emptyTableQuery();
    }
    mockSupabase.from.mockImplementation((table: string) => tables[table] ?? emptyTableQuery());

    await useAppStore.getState().loadUserData();

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('habit_entries'));
  });

  it('does not warn for tables that stay within a single page', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const tables: Record<string, ReturnType<typeof createTableQuery>> = {};
    for (const table of CORE_TABLES) {
      tables[table] = emptyTableQuery();
    }
    mockSupabase.from.mockImplementation((table: string) => tables[table] ?? emptyTableQuery());

    await useAppStore.getState().loadUserData();

    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe('loadUserData error surfacing', () => {
  it('sets a visible error when a core table fails to load, instead of silently showing an empty list', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const tables: Record<string, ReturnType<typeof createTableQuery>> = {};
    for (const table of CORE_TABLES) {
      tables[table] = table === 'calendar_events'
        ? createTableQuery(() => ({ data: null, error: { message: 'connection reset' } }))
        : emptyTableQuery();
    }
    mockSupabase.from.mockImplementation((table: string) => tables[table] ?? emptyTableQuery());

    await useAppStore.getState().loadUserData();

    expect(useAppStore.getState().error).toBe('errors.loadUserDataPartial');
    expect(useAppStore.getState().calendarEvents).toEqual([]);
    errorSpy.mockRestore();
  });

  it('clears a stale error after a fully successful load', async () => {
    useAppStore.setState({ error: 'previous error' });
    const tables: Record<string, ReturnType<typeof createTableQuery>> = {};
    for (const table of CORE_TABLES) {
      tables[table] = emptyTableQuery();
    }
    mockSupabase.from.mockImplementation((table: string) => tables[table] ?? emptyTableQuery());

    await useAppStore.getState().loadUserData();

    expect(useAppStore.getState().error).toBeNull();
  });
});

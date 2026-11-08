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

// What loads table by table when the database has no app_startup (lib/startup.ts).
const CORE_TABLES = [
  'daily_focus', 'todos', 'life_categories', 'sub_tracks', 'habits', 'habit_entries',
  'vocabulary_categories', 'vocabulary_items', 'sticky_notes', 'todo_notes',
];

beforeEach(() => {
  mockSupabase.from.mockClear();
  mockSupabase.rpc.mockReset();
  mockSupabase.rpc.mockResolvedValue({ data: null, error: { code: 'PGRST202', message: 'Could not find the function' } });
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
      tables[table] = table === 'habit_entries'
        ? createTableQuery(() => ({ data: rows, error: null }))
        : emptyTableQuery();
    }
    mockSupabase.from.mockImplementation((table: string) => tables[table] ?? emptyTableQuery());

    await useAppStore.getState().loadUserData();

    expect(tables.habit_entries.range).toHaveBeenCalledTimes(1);
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
      tables[table] = table === 'habit_entries'
        ? createTableQuery(() => ({ data: null, error: { message: 'connection reset' } }))
        : emptyTableQuery();
    }
    mockSupabase.from.mockImplementation((table: string) => tables[table] ?? emptyTableQuery());

    await useAppStore.getState().loadUserData();

    expect(useAppStore.getState().error).toBe('errors.loadUserDataPartial');
    expect(useAppStore.getState().habitEntries).toEqual([]);
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

describe('loadUserData with the startup request', () => {
  const today = new Date().toISOString().slice(0, 10);
  const startup = {
    now: '2026-10-25T10:00:00.000Z',
    full: true,
    focus: [{ text: 'Focus', date: '2000-01-01' }],
    todos: [
      { id: 't1', gate: 'daily', text: 'A', completed: false, priority: 'medium', date: today, sort_order: 0 },
      { id: 't2', gate: 'backlog', text: 'B', completed: false, priority: 'medium', sort_order: 1 },
    ],
    life_categories: [], sub_tracks: [],
    habits: [{ id: 'h1', name: 'Read', icon: 'star', sort_order: 0 }],
    vocabulary_categories: [],
    sticky_notes: [{ id: 'n1', title: '', text: 'note', sort_order: 0 }],
    todo_notes: [],
    kv: { 'tasks-settings': { x: 1 } },
    words: [{ id: 'w1', word: 'bargain', type: 'word', definition: 'd', created_at: '2026-01-01T00:00:00Z' }],
    srs: [],
    habit_entries: [{ id: 'e1', habit_id: 'h1', date: '2026-10-24' }],
    wird: [],
    deleted: [],
  };

  it('opens with one request and no table reads', async () => {
    mockSupabase.rpc.mockResolvedValue({ data: startup, error: null });
    const from = mockSupabase.from.mockImplementation(() => emptyTableQuery());

    await useAppStore.getState().loadUserData();

    const s = useAppStore.getState();
    expect(mockSupabase.rpc).toHaveBeenCalledTimes(1);
    expect(from).not.toHaveBeenCalled();
    expect(s.dailyTodos.map((t) => t.id)).toEqual(['t1']);
    expect(s.backlogTodos.map((t) => t.id)).toEqual(['t2']);
    expect(s.habitEntries).toEqual([{ id: 'e1', habitId: 'h1', date: '2026-10-24' }]);
    expect(s.vocabularyItems.map((w) => w.word)).toEqual(['bargain']);
    expect(s.stickyNotes.map((n) => n.text)).toEqual(['note']);
    // Yesterday's focus isn't today's.
    expect(s.dailyFocus.text).toBe('');
    expect(s.error).toBeNull();
  });

  it('loads table by table when the database has no app_startup yet', async () => {
    const tables: Record<string, ReturnType<typeof createTableQuery>> = {};
    for (const table of CORE_TABLES) tables[table] = emptyTableQuery();
    tables.habit_entries = createTableQuery(() => ({ data: makeHabitEntryRows(2, 0), error: null }));
    mockSupabase.from.mockImplementation((table: string) => tables[table] ?? emptyTableQuery());

    await useAppStore.getState().loadUserData();

    expect(useAppStore.getState().habitEntries).toHaveLength(2);
    expect(mockSupabase.from).not.toHaveBeenCalledWith('calendar_events');
    expect(mockSupabase.from).not.toHaveBeenCalledWith('bookmarks');
    expect(useAppStore.getState().error).toBeNull();
  });
});

describe('pages that load their own data', () => {
  it('loads the calendar and keeps an event added while it was loading', async () => {
    useAppStore.setState({ calendarEvents: [] });
    const table = createTableQuery(() => {
      // Added on this device while the request was on its way.
      useAppStore.setState({ calendarEvents: [{ id: 'new' } as never] });
      return { data: [{ id: 'c1', title: 'Exam', date: '2026-10-26' }], error: null };
    });
    mockSupabase.from.mockImplementation(() => table);

    await useAppStore.getState().loadCalendarEvents();

    expect(useAppStore.getState().calendarEvents.map((e) => e.id)).toEqual(['c1', 'new']);
  });
});

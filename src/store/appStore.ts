import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getToday, getWeekStart } from './dateHelpers';
import type {
  Language,
  Priority,
  DailyFocus,
  DailyTodo,
  WeeklyTodo,
  BacklogTodo,
  LifeCategory,
  SubTrack,
  SubTrackEntry,
  BookmarkCategory,
  Bookmark,
  StickyNoteData,
  TodoNoteData,
} from '../types';

interface AppStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  loadUserData: () => Promise<void>;

  error: string | null;
  clearError: () => void;

  dailyFocus: DailyFocus;
  setDailyFocus: (focus: DailyFocus) => Promise<void>;
  clearDailyFocus: () => Promise<void>;

  dailyTodos: DailyTodo[];
  addDailyTodo: (text: string, priority: Priority) => Promise<{ success: boolean }>;
  toggleDailyTodo: (id: string) => Promise<void>;
  removeDailyTodo: (id: string) => Promise<void>;

  weeklyTodos: WeeklyTodo[];
  addWeeklyTodo: (text: string, priority: Priority) => Promise<{ success: boolean }>;
  toggleWeeklyTodo: (id: string) => Promise<void>;
  removeWeeklyTodo: (id: string) => Promise<void>;

  backlogTodos: BacklogTodo[];
  addBacklogTodo: (text: string, priority: Priority) => Promise<{ success: boolean }>;
  toggleBacklogTodo: (id: string) => Promise<void>;
  removeBacklogTodo: (id: string) => Promise<void>;
  reorderDailyTodos: (ids: string[]) => Promise<void>;
  reorderWeeklyTodos: (ids: string[]) => Promise<void>;
  reorderBacklogTodos: (ids: string[]) => Promise<void>;
  pendingMovements: Set<string>;
  moveToDaily: (id: string) => Promise<void>;
  moveToWeekly: (id: string) => Promise<void>;
  moveToBacklog: (id: string, from: 'daily' | 'weekly') => Promise<void>;

  lifeCategories: LifeCategory[];
  addLifeCategory: (cat: LifeCategory) => Promise<void>;
  removeLifeCategory: (id: string) => Promise<void>;
  updateLifeCategory: (id: string, data: Partial<LifeCategory>) => Promise<void>;
  addPillar: (name: string, icon?: string, colorTheme?: string) => Promise<void>;
  updatePillar: (id: string, newName: string) => Promise<void>;
  deletePillar: (id: string) => Promise<void>;

  subTracks: SubTrack[];
  addSubTrack: (track: SubTrack) => Promise<void>;
  removeSubTrack: (id: string) => Promise<void>;
  updateSubTrack: (id: string, data: Partial<SubTrack>) => Promise<void>;
  incrementSubTrack: (id: string, value?: number) => Promise<void>;
  decrementSubTrack: (id: string, value?: number) => Promise<void>;
  toggleSubTrackHabit: (id: string) => Promise<void>;

  subTrackEntries: SubTrackEntry[];
  addSubTrackEntry: (entry: SubTrackEntry) => Promise<void>;
  removeSubTrackEntry: (id: string) => Promise<void>;
  getSubTrackEntryToday: (trackId: string) => SubTrackEntry | undefined;

  bookmarkCategories: BookmarkCategory[];
  bookmarks: Bookmark[];
  addBookmarkCategory: (category: Omit<BookmarkCategory, 'id'>) => Promise<void>;
  removeBookmarkCategory: (id: string) => Promise<void>;
  addBookmark: (bookmark: Omit<Bookmark, 'id'>) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;

  stickyNotes: StickyNoteData[];
  todoNotes: TodoNoteData[];
  addStickyNote: (note: StickyNoteData) => Promise<void>;
  updateStickyNote: (id: string, data: Partial<StickyNoteData>) => Promise<void>;
  deleteStickyNote: (id: string) => Promise<void>;
  reorderStickyNotes: (ids: string[]) => Promise<void>;
  addTodoNote: (note: TodoNoteData) => Promise<void>;
  updateTodoNote: (id: string, updated: Partial<TodoNoteData>) => Promise<void>;
  deleteTodoNote: (id: string) => Promise<void>;
  reorderTodoNotes: (ids: string[]) => Promise<void>;
}

function generateId(): string {
  return crypto.randomUUID();
}

function logError(context: string, error: unknown) {
  const msg = error && typeof error === 'object' && 'message' in error ? (error as { message?: string }).message || String(error) : String(error);
  const details = error && typeof error === 'object' && 'details' in error ? (error as { details?: unknown }).details || '' : '';
  console.error(`[${context}] ${msg}`, details);
  const msgStr = String(msg);
  if (msgStr.includes('PGRST204') || msgStr.includes('column') || msgStr.includes('not found')) {
    console.error(
      `[${context}] Schema cache issue detected. Run pending migrations and reload PostgREST schema cache: NOTIFY pgrst, 'reload schema';`
    );
  }
}

async function supabaseCall<T>(
  promise: PromiseLike<{ data: T | null; error: unknown }>,
  context: string
): Promise<{ data: T | null; success: boolean; error?: { message?: string; details?: unknown } }> {
  try {
    const { data, error } = await promise;
    if (error) {
      logError(context, error);
      return { data: null, success: false, error: error as { message?: string; details?: unknown } };
    }
    // For RPC calls that return structured responses, check if data has success field
    if (data && typeof data === 'object' && 'success' in data) {
      const rpcData = data as { success: boolean; message?: string };
      if (!rpcData.success) {
        return { data, success: false, error: undefined };
      }
    }
    return { data, success: true };
  } catch (err) {
    logError(context, err);
    return { data: null, success: false, error: err as { message?: string; details?: unknown } };
  }
}

export const useAppStore = create<AppStore>()((set, get) => ({
  language: (() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('khalil-language');
      if (stored === 'ar' || stored === 'en') return stored as Language;
    }
    return 'ar';
  })(),
  setLanguage: (language) => {
    localStorage.setItem('khalil-language', language);
    set({ language });
  },
  theme: (() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('khalil-theme');
      if (stored === 'light' || stored === 'dark') return stored;
    }
    return 'dark';
  })(),
  toggleTheme: () => set((s) => {
    const next = s.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('khalil-theme', next);
    return { theme: next };
  }),

  error: null,
  clearError: () => set({ error: null }),

  session: null,
  isLoading: true,
  setSession: (session) => set({ session }),

  loadUserData: async () => {
    const userId = get().session?.user?.id;
    if (!userId) {
      if (import.meta.env.DEV) console.log('[loadUserData] No user ID, skipping');
      set({ isLoading: false });
      return;
    }

    if (import.meta.env.DEV) console.log('[loadUserData] Fetching data for user:', userId);

    try {
      // Disabled rollover to prevent deleted todos from reappearing on refresh
      // await rolloverStaleTodos(userId);

      const today = getToday();
      const weekStart = getWeekStart();

      // Load core tables — these must exist
      const [dailyFocusRes, todosRes, lifeCategoryRes, subTrackRes, subTrackEntryRes, bookmarkCategoryRes, bookmarkRes] = await Promise.all([
        supabase.from('daily_focus').select('*').eq('user_id', userId).limit(1),
        supabase.from('todos').select('*').eq('user_id', userId).order('sort_order'),
        supabase.from('life_categories').select('*').eq('user_id', userId).order('sort_order'),
        supabase.from('sub_tracks').select('*').eq('user_id', userId).order('sort_order'),
        supabase.from('sub_track_entries').select('*').eq('user_id', userId).order('date'),
        supabase.from('bookmark_categories').select('*').eq('user_id', userId).order('name'),
        supabase.from('bookmarks').select('*').eq('user_id', userId).order('created_at'),
      ]);

      if (dailyFocusRes.error) console.error('[loadUserData] daily_focus error:', dailyFocusRes.error);
      if (todosRes.error) console.error('[loadUserData] todos error:', todosRes.error);
      if (lifeCategoryRes.error) console.error('[loadUserData] life_categories error:', lifeCategoryRes.error);
      if (subTrackRes.error) console.error('[loadUserData] sub_tracks error:', subTrackRes.error);
      if (subTrackEntryRes.error) console.error('[loadUserData] sub_track_entries error:', subTrackEntryRes.error);
      if (bookmarkCategoryRes.error) console.error('[loadUserData] bookmark_categories error:', bookmarkCategoryRes.error);
      if (bookmarkRes.error) console.error('[loadUserData] bookmarks error:', bookmarkRes.error);

      const dailyFocusRows = dailyFocusRes.data;
      const todosRows = todosRes.data;
      const lifeCategoryRows = lifeCategoryRes.data;
      const subTrackRows = subTrackRes.data;
      const subTrackEntryRows = subTrackEntryRes.data;
      const bookmarkCategoryRows = bookmarkCategoryRes.data;
      const bookmarkRows = bookmarkRes.data;

      // Split todos by gate
      type TodoRow = { gate: string; date?: string; week_start?: string };
      const dailyTodoRows = todosRows?.filter((row: TodoRow) => row.gate === 'daily' && row.date === today) || [];
      const weeklyTodoRows = todosRows?.filter((row: TodoRow) => row.gate === 'weekly' && row.week_start === weekStart) || [];
      const backlogTodoRows = todosRows?.filter((row: TodoRow) => row.gate === 'backlog') || [];

      if (import.meta.env.DEV) {
        console.log('[loadUserData] Fetched rows:', {
          dailyFocus: dailyFocusRows?.length ?? 0,
          todos: todosRows?.length ?? 0,
          dailyTodos: dailyTodoRows.length,
          weeklyTodos: weeklyTodoRows.length,
          backlogTodos: backlogTodoRows.length,
          lifeCategories: lifeCategoryRows?.length ?? 0,
          subTracks: subTrackRows?.length ?? 0,
          subTrackEntries: subTrackEntryRows?.length ?? 0,
          bookmarkCategories: bookmarkCategoryRows?.length ?? 0,
          bookmarks: bookmarkRows?.length ?? 0,
        });
      }

      const focusRow = dailyFocusRows && dailyFocusRows.length > 0 ? dailyFocusRows[0] : null;
      const validFocus = focusRow && focusRow.date === getToday() ? focusRow : null;

      // ── Notes loading ──

      let notesStickyData: Record<string, unknown>[] = [];
      let notesTodoData: Record<string, unknown>[] = [];
      const [sRes, tRes] = await Promise.all([
        supabaseCall(supabase.from('sticky_notes').select('*').eq('user_id', userId).order('sort_order'), 'load sticky_notes'),
        supabaseCall(supabase.from('todo_notes').select('*').eq('user_id', userId).order('sort_order'), 'load todo_notes'),
      ]);
      if (sRes.success) notesStickyData = (sRes.data || []) as Record<string, unknown>[];
      if (tRes.success) notesTodoData = (tRes.data || []) as Record<string, unknown>[];

      const stickyNotes = notesStickyData.map((r) => ({
        id: r.id as string,
        title: (r.title as string) || '',
        text: r.text as string,
        sortOrder: (r.sort_order as number) ?? 0,
      }));
      const todoNotes = notesTodoData.map((r) => ({
        id: r.id as string,
        title: r.title as string,
        items: (r.items as { id: string; text: string; done: boolean }[]) || [],
        sortOrder: (r.sort_order as number) ?? 0,
      }));

      set({
        dailyFocus: validFocus
          ? { text: validFocus.text, date: validFocus.date }
          : { text: '', date: getToday() },
        dailyTodos: (dailyTodoRows || []).map(mapDailyTodo),
        weeklyTodos: (weeklyTodoRows || []).map(mapWeeklyTodo),
        backlogTodos: (backlogTodoRows || []).map(mapBacklogTodo),
        lifeCategories: (lifeCategoryRows || []).map(mapLifeCategory),
        subTracks: (subTrackRows || []).map(mapSubTrack),
        subTrackEntries: (subTrackEntryRows || []).map(mapSubTrackEntry),
        bookmarkCategories: (bookmarkCategoryRows || []).map(mapBookmarkCategory),
        bookmarks: (bookmarkRows || []).map(mapBookmark),
        stickyNotes,
        todoNotes,
        isLoading: false,
      });

      if (import.meta.env.DEV) console.log('[loadUserData] Data loaded successfully from existing Supabase rows');
    } catch (err) {
      console.error('[loadUserData] Failed to load user data:', err);
      set({ isLoading: false });
    }
  },

  dailyFocus: { text: '', date: getToday() },
  setDailyFocus: async (focus) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    try {
      const { error } = await supabase
        .from('daily_focus')
        .upsert(
          { user_id: userId, text: focus.text, date: focus.date },
          { onConflict: 'user_id' }
        );
      if (error) {
        console.error('Failed to set daily focus:', error);
        return;
      }
      set({ dailyFocus: focus });
    } catch (err) {
      console.error('Failed to set daily focus:', err);
    }
  },
  clearDailyFocus: async () => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const { success } = await supabaseCall(supabase.from('daily_focus').delete().eq('user_id', userId), 'clearDailyFocus');
    if (!success) return;
    set({ dailyFocus: { text: '', date: getToday() } });
  },

  dailyTodos: [],
  addDailyTodo: async (text, priority) => {
    const userId = get().session?.user?.id;
    if (!userId) return { success: false };
    const id = generateId();
    const maxSortOrder = get().dailyTodos.reduce((max, t) => Math.max(max, t.sortOrder), -1);
    const sortOrder = maxSortOrder + 1;
    const now = Date.now();
    const newTodo = { id, text, completed: false, priority, createdAt: now, date: getToday(), sortOrder, rolloverCount: 0, gate: 'daily' as const, updatedAt: now };
    set((s) => ({ dailyTodos: [...s.dailyTodos, newTodo] }));
    const { success } = await supabaseCall(
      supabase.from('todos').insert({
        id, user_id: userId, text, completed: false, priority,
        created_at: now, date: getToday(), sort_order: sortOrder, gate: 'daily', rollover_count: 0, updated_at: now,
      }),
      'addDailyTodo'
    );
    if (!success) {
      set((s) => ({ dailyTodos: s.dailyTodos.filter((t) => t.id !== id) }));
      set({ error: 'Failed to add daily todo. Please try again.' });
      return { success: false };
    }
    return { success: true };
  },
  toggleDailyTodo: async (id) => {
    const todo = get().dailyTodos.find((t) => t.id === id);
    if (!todo) return;
    const previousCompleted = todo.completed;
    // Optimistic update
    set((s) => ({
      dailyTodos: s.dailyTodos.map((t) => (t.id === id ? { ...t, completed: !previousCompleted } : t)),
    }));
    const { success } = await supabaseCall(supabase.from('todos').update({ completed: !previousCompleted, updated_at: Date.now() }).eq('id', id), 'toggleDailyTodo');
    if (!success) {
      // Rollback on failure
      set((s) => ({
        dailyTodos: s.dailyTodos.map((t) => (t.id === id ? { ...t, completed: previousCompleted } : t)),
      }));
      return;
    }
  },
  removeDailyTodo: async (id) => {
    const { success } = await supabaseCall(supabase.from('todos').delete().eq('id', id), 'removeDailyTodo');
    if (!success) {
      set({ error: 'Failed to delete task. Please try again.' });
      return;
    }
    set((s) => ({ dailyTodos: s.dailyTodos.filter((t) => t.id !== id) }));
  },

  weeklyTodos: [],
  addWeeklyTodo: async (text, priority) => {
    const userId = get().session?.user?.id;
    if (!userId) return { success: false };
    const id = generateId();
    const maxSortOrder = get().weeklyTodos.reduce((max, t) => Math.max(max, t.sortOrder), -1);
    const sortOrder = maxSortOrder + 1;
    const weekStart = getWeekStart();
    const now = Date.now();
    const newTodo = { id, text, completed: false, priority, createdAt: now, weekStart, sortOrder, rolloverCount: 0, gate: 'weekly' as const, updatedAt: now };
    set((s) => ({ weeklyTodos: [...s.weeklyTodos, newTodo] }));
    const { success } = await supabaseCall(
      supabase.from('todos').insert({
        id, user_id: userId, text, completed: false, priority,
        created_at: now, week_start: weekStart, sort_order: sortOrder, gate: 'weekly', rollover_count: 0, updated_at: now,
      }),
      'addWeeklyTodo'
    );
    if (!success) {
      set((s) => ({ weeklyTodos: s.weeklyTodos.filter((t) => t.id !== id) }));
      set({ error: 'Failed to add weekly todo. Please try again.' });
      return { success: false };
    }
    return { success: true };
  },
  toggleWeeklyTodo: async (id) => {
    const todo = get().weeklyTodos.find((t) => t.id === id);
    if (!todo) return;
    const { success } = await supabaseCall(supabase.from('todos').update({ completed: !todo.completed, updated_at: Date.now() }).eq('id', id), 'toggleWeeklyTodo');
    if (!success) return;
    set((s) => ({
      weeklyTodos: s.weeklyTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  },
  removeWeeklyTodo: async (id) => {
    const { success } = await supabaseCall(supabase.from('todos').delete().eq('id', id), 'removeWeeklyTodo');
    if (!success) {
      set({ error: 'Failed to delete task. Please try again.' });
      return;
    }
    set((s) => ({ weeklyTodos: s.weeklyTodos.filter((t) => t.id !== id) }));
  },

  backlogTodos: [],
  addBacklogTodo: async (text, priority) => {
    const userId = get().session?.user?.id;
    if (!userId) return { success: false };
    const id = generateId();
    const maxSortOrder = get().backlogTodos.reduce((max, t) => Math.max(max, t.sortOrder), -1);
    const sortOrder = maxSortOrder + 1;
    const now = Date.now();
    const newTodo = { id, text, completed: false, priority, createdAt: now, sortOrder, gate: 'backlog' as const, updatedAt: now };
    set((s) => ({ backlogTodos: [...s.backlogTodos, newTodo] }));
    const { success } = await supabaseCall(
      supabase.from('todos').insert({
        id, user_id: userId, text, completed: false, priority,
        created_at: now, sort_order: sortOrder, gate: 'backlog', updated_at: now,
      }),
      'addBacklogTodo'
    );
    if (!success) {
      set((s) => ({ backlogTodos: s.backlogTodos.filter((t) => t.id !== id) }));
      set({ error: 'Failed to add backlog todo. Please try again.' });
      return { success: false };
    }
    return { success: true };
  },
  toggleBacklogTodo: async (id) => {
    const todo = get().backlogTodos.find((t) => t.id === id);
    if (!todo) return;
    const { success } = await supabaseCall(supabase.from('todos').update({ completed: !todo.completed, updated_at: Date.now() }).eq('id', id), 'toggleBacklogTodo');
    if (!success) return;
    set((s) => ({
      backlogTodos: s.backlogTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  },
  removeBacklogTodo: async (id) => {
    const { success } = await supabaseCall(supabase.from('todos').delete().eq('id', id), 'removeBacklogTodo');
    if (!success) {
      set({ error: 'Failed to delete task. Please try again.' });
      return;
    }
    set((s) => ({ backlogTodos: s.backlogTodos.filter((t) => t.id !== id) }));
  },
  reorderDailyTodos: async (ids) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const items = ids.map((id, index) => {
      const t = get().dailyTodos.find((x) => x.id === id)!;
      return { ...t, sortOrder: index };
    });
    const { success } = await supabaseCall(
      supabase.from('todos').upsert(
        items.map((t) => ({ id: t.id, user_id: userId, sort_order: t.sortOrder, updated_at: Date.now() })),
        { onConflict: 'id' }
      ),
      'reorderDailyTodos'
    );
    if (!success) return;
    set({ dailyTodos: items });
  },
  reorderWeeklyTodos: async (ids) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const items = ids.map((id, index) => {
      const t = get().weeklyTodos.find((x) => x.id === id)!;
      return { ...t, sortOrder: index };
    });
    const { success } = await supabaseCall(
      supabase.from('todos').upsert(
        items.map((t) => ({ id: t.id, user_id: userId, sort_order: t.sortOrder, updated_at: Date.now() })),
        { onConflict: 'id' }
      ),
      'reorderWeeklyTodos'
    );
    if (!success) return;
    set({ weeklyTodos: items });
  },
  reorderBacklogTodos: async (ids) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const items = ids.map((id, index) => {
      const t = get().backlogTodos.find((x) => x.id === id)!;
      return { ...t, sortOrder: index };
    });
    const { success } = await supabaseCall(
      supabase.from('todos').upsert(
        items.map((t) => ({ id: t.id, user_id: userId, sort_order: t.sortOrder, updated_at: Date.now() })),
        { onConflict: 'id' }
      ),
      'reorderBacklogTodos'
    );
    if (!success) return;
    set({ backlogTodos: items });
  },

  // Track pending movements to prevent duplicate requests
  pendingMovements: new Set<string>(),

  moveToDaily: async (id) => {
    // Prevent duplicate movements
    if (get().pendingMovements.has(id)) return;
    set((s) => ({ pendingMovements: new Set(s.pendingMovements).add(id) }));

    try {
      const backlogTodo = get().backlogTodos.find((x) => x.id === id);
      const weeklyTodo = get().weeklyTodos.find((x) => x.id === id);
      const todo = backlogTodo || weeklyTodo;
      if (!todo) return;
      const fromBacklog = !!backlogTodo;
      const today = getToday();
      const maxSortOrder = get().dailyTodos.reduce((max, t) => Math.max(max, t.sortOrder), -1);
      const sortOrder = maxSortOrder + 1;
      const originalRolloverCount = (todo as DailyTodo | WeeklyTodo).rolloverCount || 0;
      const newRolloverCount = fromBacklog ? 0 : originalRolloverCount + 1;
      const now = Date.now();

      // Optimistic update - preserve ID
      const optimisticTodo: DailyTodo = {
        ...todo,
        id, // Preserve original ID
        date: today,
        sortOrder,
        rolloverCount: newRolloverCount,
        gate: 'daily',
        updatedAt: now,
      };

      set((s) => ({
        backlogTodos: s.backlogTodos.filter((x) => x.id !== id),
        weeklyTodos: s.weeklyTodos.filter((x) => x.id !== id),
        dailyTodos: [...s.dailyTodos, optimisticTodo],
      }));

      const { data, success } = await supabaseCall(
        supabase.rpc('move_todo_item', {
          p_task_id: id,
          p_to_gate: 'daily',
          p_date: today,
        }),
        'moveToDaily'
      );

      if (!success || !data?.success) {
        // Rollback on failure
        if (fromBacklog && backlogTodo) {
          set((s) => ({
            dailyTodos: s.dailyTodos.filter((x) => x.id !== id),
            backlogTodos: [...s.backlogTodos, backlogTodo],
          }));
        } else if (weeklyTodo) {
          set((s) => ({
            dailyTodos: s.dailyTodos.filter((x) => x.id !== id),
            weeklyTodos: [...s.weeklyTodos, weeklyTodo],
          }));
        }
        let errorMessage = 'Failed to move task. Please try again.';
        if (data && typeof data === 'object' && 'message' in data) {
          const msg = (data as { message?: string }).message;
          if (typeof msg === 'string' && msg.length > 0) {
            errorMessage = msg;
          }
        }
        set({ error: errorMessage });
        return;
      }

      // Reconcile with authoritative result
      // The task is now in daily gate with the same ID
      // Update the local state to match the database
      set((s) => ({
        dailyTodos: s.dailyTodos.map((t) => 
          t.id === id ? { ...t, updatedAt: now } : t
        ),
      }));
    } finally {
      set((s) => {
        const newPending = new Set(s.pendingMovements);
        newPending.delete(id);
        return { pendingMovements: newPending };
      });
    }
  },

  moveToWeekly: async (id) => {
    // Prevent duplicate movements
    if (get().pendingMovements.has(id)) return;
    set((s) => ({ pendingMovements: new Set(s.pendingMovements).add(id) }));

    try {
      const backlogTodo = get().backlogTodos.find((x) => x.id === id);
      const dailyTodo = get().dailyTodos.find((x) => x.id === id);
      const todo = backlogTodo || dailyTodo;
      if (!todo) return;
      const fromBacklog = !!backlogTodo;
      const weekStart = getWeekStart();
      const maxSortOrder = get().weeklyTodos.reduce((max, t) => Math.max(max, t.sortOrder), -1);
      const sortOrder = maxSortOrder + 1;
      const originalRolloverCount = (todo as DailyTodo | WeeklyTodo).rolloverCount || 0;
      const newRolloverCount = fromBacklog ? 0 : originalRolloverCount + 1;
      const now = Date.now();

      // Optimistic update - preserve ID
      const optimisticTodo: WeeklyTodo = {
        ...todo,
        id, // Preserve original ID
        weekStart,
        sortOrder,
        rolloverCount: newRolloverCount,
        gate: 'weekly',
        updatedAt: now,
      };

      set((s) => ({
        backlogTodos: s.backlogTodos.filter((x) => x.id !== id),
        dailyTodos: s.dailyTodos.filter((x) => x.id !== id),
        weeklyTodos: [...s.weeklyTodos, optimisticTodo],
      }));

      const { data, success } = await supabaseCall(
        supabase.rpc('move_todo_item', {
          p_task_id: id,
          p_to_gate: 'weekly',
          p_week_start: weekStart,
        }),
        'moveToWeekly'
      );

      if (!success || !data?.success) {
        // Rollback on failure
        if (fromBacklog && backlogTodo) {
          set((s) => ({
            weeklyTodos: s.weeklyTodos.filter((x) => x.id !== id),
            backlogTodos: [...s.backlogTodos, backlogTodo],
          }));
        } else if (dailyTodo) {
          set((s) => ({
            weeklyTodos: s.weeklyTodos.filter((x) => x.id !== id),
            dailyTodos: [...s.dailyTodos, dailyTodo],
          }));
        }
        set({ error: data?.message || 'Failed to move task. Please try again.' });
        return;
      }

      // Reconcile with authoritative result
      set((s) => ({
        weeklyTodos: s.weeklyTodos.map((t) => 
          t.id === id ? { ...t, updatedAt: now } : t
        ),
      }));
    } finally {
      set((s) => {
        const newPending = new Set(s.pendingMovements);
        newPending.delete(id);
        return { pendingMovements: newPending };
      });
    }
  },

  moveToBacklog: async (id, from) => {
    // Prevent duplicate movements
    if (get().pendingMovements.has(id)) return;
    set((s) => ({ pendingMovements: new Set(s.pendingMovements).add(id) }));

    try {
      const dailyTodo = get().dailyTodos.find((x) => x.id === id);
      const weeklyTodo = get().weeklyTodos.find((x) => x.id === id);
      const todo = from === 'daily' ? dailyTodo : weeklyTodo;
      if (!todo) return;
      const maxSortOrder = get().backlogTodos.reduce((max, t) => Math.max(max, t.sortOrder), -1);
      const sortOrder = maxSortOrder + 1;
      const now = Date.now();

      // Optimistic update - preserve ID
      const optimisticTodo: BacklogTodo = {
        ...todo,
        id, // Preserve original ID
        sortOrder,
        gate: 'backlog',
        updatedAt: now,
      };

      if (from === 'daily') {
        set((s) => ({
          dailyTodos: s.dailyTodos.filter((x) => x.id !== id),
          backlogTodos: [...s.backlogTodos, optimisticTodo],
        }));
      } else {
        set((s) => ({
          weeklyTodos: s.weeklyTodos.filter((x) => x.id !== id),
          backlogTodos: [...s.backlogTodos, optimisticTodo],
        }));
      }

      const { data, success } = await supabaseCall(
        supabase.rpc('move_todo_item', {
          p_task_id: id,
          p_to_gate: 'backlog',
        }),
        'moveToBacklog'
      );

      if (!success || !data?.success) {
        // Rollback on failure
        if (from === 'daily' && dailyTodo) {
          set((s) => ({
            backlogTodos: s.backlogTodos.filter((x) => x.id !== id),
            dailyTodos: [...s.dailyTodos, dailyTodo],
          }));
        } else if (weeklyTodo) {
          set((s) => ({
            backlogTodos: s.backlogTodos.filter((x) => x.id !== id),
            weeklyTodos: [...s.weeklyTodos, weeklyTodo],
          }));
        }
        set({ error: data?.message || 'Failed to move task. Please try again.' });
        return;
      }

      // Reconcile with authoritative result
      set((s) => ({
        backlogTodos: s.backlogTodos.map((t) => 
          t.id === id ? { ...t, updatedAt: now } : t
        ),
      }));
    } finally {
      set((s) => {
        const newPending = new Set(s.pendingMovements);
        newPending.delete(id);
        return { pendingMovements: newPending };
      });
    }
  },

  lifeCategories: [],
  addLifeCategory: async (cat) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const id = cat.id || generateId();
    const { success } = await supabaseCall(supabase.from('life_categories').insert({ id, user_id: userId, name: cat.name, name_key: cat.nameKey, icon: cat.icon, color: cat.color, sort_order: cat.sortOrder }), 'addLifeCategory');
    if (!success) return;
    set((s) => ({ lifeCategories: [...s.lifeCategories, { ...cat, id }] }));
  },
  removeLifeCategory: async (id) => {
    const { success } = await supabaseCall(supabase.from('life_categories').delete().eq('id', id), 'removeLifeCategory');
    if (!success) return;
    set((s) => ({
      lifeCategories: s.lifeCategories.filter((c) => c.id !== id),
      subTracks: s.subTracks.filter((t) => t.categoryId !== id),
      subTrackEntries: s.subTrackEntries.filter((e) => !s.subTracks.some((t) => t.id === e.trackId && t.categoryId === id)),
    }));
  },
  updateLifeCategory: async (id, data) => {
    const { success } = await supabaseCall(supabase.from('life_categories').update({ name: data.name, name_key: data.nameKey, icon: data.icon, color: data.color, sort_order: data.sortOrder }).eq('id', id), 'updateLifeCategory');
    if (!success) return;
    set((s) => ({
      lifeCategories: s.lifeCategories.map((c) => (c.id === id ? { ...c, ...data } : c)),
    }));
  },
  addPillar: async (name, icon = 'heart', colorTheme = 'terracotta') => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const sortOrder = get().lifeCategories.length + 1;
    try {
      const { data, error } = await supabase.from('life_categories').insert({
        user_id: userId, name, name_key: '', icon, color: colorTheme, sort_order: sortOrder,
      }).select().single();
      if (error) { console.error('Failed to add pillar:', error); return; }
      set((s) => ({
        lifeCategories: [...s.lifeCategories, { id: data.id, name, nameKey: '', icon, color: colorTheme, sortOrder }],
      }));
    } catch (err) {
      console.error('Failed to add pillar:', err);
    }
  },
  updatePillar: async (id, newName) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    try {
      const { error } = await supabase.from('life_categories').update({ name: newName }).eq('id', id).eq('user_id', userId);
      if (error) { console.error('Failed to update pillar:', error); return; }
      set((s) => ({
        lifeCategories: s.lifeCategories.map((c) => (c.id === id ? { ...c, name: newName } : c)),
      }));
    } catch (err) {
      console.error('Failed to update pillar:', err);
    }
  },
  deletePillar: async (id) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const deletedCategory = get().lifeCategories.find((c) => c.id === id);
    const deletedTracks = get().subTracks.filter((t) => t.categoryId === id);
    const deletedEntries = get().subTrackEntries.filter((e) => deletedTracks.some((t) => t.id === e.trackId));
    console.log('[deletePillar] Deleting category:', id, 'with tracks:', deletedTracks.length);
    set((s) => ({
      lifeCategories: s.lifeCategories.filter((c) => c.id !== id),
      subTracks: s.subTracks.filter((t) => t.categoryId !== id),
      subTrackEntries: s.subTrackEntries.filter((e) => !deletedTracks.some((t) => t.id === e.trackId)),
    }));
    const { success: tracksOk, error: tracksError } = await supabaseCall(supabase.from('sub_tracks').delete().eq('category_id', id).eq('user_id', userId), 'deletePillar sub_tracks');
    if (!tracksOk) {
      console.error('[deletePillar] Failed to delete tracks:', tracksError);
      set((s) => ({
        lifeCategories: deletedCategory ? [...s.lifeCategories, deletedCategory] : s.lifeCategories,
        subTracks: [...s.subTracks, ...deletedTracks],
        subTrackEntries: [...s.subTrackEntries, ...deletedEntries],
      }));
      set({ error: 'Failed to delete category. Please try again.' });
      return;
    }
    const { success: catOk, error: catError } = await supabaseCall(supabase.from('life_categories').delete().eq('id', id).eq('user_id', userId), 'deletePillar categories');
    if (!catOk) {
      console.error('[deletePillar] Failed to delete category:', catError);
      set((s) => ({
        lifeCategories: deletedCategory ? [...s.lifeCategories, deletedCategory] : s.lifeCategories,
        subTracks: [...s.subTracks, ...deletedTracks],
        subTrackEntries: [...s.subTrackEntries, ...deletedEntries],
      }));
      set({ error: 'Failed to delete category. Please try again.' });
      return;
    }
    console.log('[deletePillar] Successfully deleted category:', id);
  },

  subTracks: [],
  addSubTrack: async (track) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const { data, success } = await supabaseCall(
      supabase.from('sub_tracks').insert({
        user_id: userId, category_id: track.categoryId, name: track.name, name_key: track.nameKey, icon: track.icon, progress_type: track.progressType, target: track.target, unit: track.unit, current_value: track.currentValue, sort_order: track.sortOrder,
      }).select().single(),
      'addSubTrack'
    );
    if (!success || !data) return;
    const row = data as { id: string };
    set((s) => ({ subTracks: [...s.subTracks, { ...track, id: row.id }] }));
  },
  removeSubTrack: async (id) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const { success } = await supabaseCall(supabase.from('sub_tracks').delete().eq('id', id).eq('user_id', userId), 'removeSubTrack');
    if (!success) return;
    set((s) => ({
      subTracks: s.subTracks.filter((t) => t.id !== id),
      subTrackEntries: s.subTrackEntries.filter((e) => e.trackId !== id),
    }));
  },
  updateSubTrack: async (id, data) => {
    const dbData: Record<string, unknown> = {};
    if (data.name !== undefined) dbData.name = data.name;
    if (data.icon !== undefined) dbData.icon = data.icon;
    if (data.progressType !== undefined) dbData.progress_type = data.progressType;
    if (data.target !== undefined) dbData.target = data.target;
    if (data.unit !== undefined) dbData.unit = data.unit;
    if (data.currentValue !== undefined) dbData.current_value = data.currentValue;
    if (data.sortOrder !== undefined) dbData.sort_order = data.sortOrder;
    const { success } = await supabaseCall(supabase.from('sub_tracks').update(dbData).eq('id', id), 'updateSubTrack');
    if (!success) return;
    set((s) => ({
      subTracks: s.subTracks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  },
  incrementSubTrack: async (id, value = 1) => {
    const track = get().subTracks.find((t) => t.id === id);
    if (!track) return;
    // Clamped: currentValue never exceeds target so the progress bar stays meaningful
    const newValue = Math.min(track.currentValue + value, track.target);
    try {
      const { error } = await supabase.from('sub_tracks').update({ current_value: newValue }).eq('id', id);
      if (error) { console.error('Failed to increment sub track:', error); return; }
      set((s) => ({
        subTracks: s.subTracks.map((t) => (t.id === id ? { ...t, currentValue: newValue } : t)),
      }));
    } catch (err) {
      console.error('Failed to increment sub track:', err);
    }
  },
  decrementSubTrack: async (id, value = 1) => {
    const track = get().subTracks.find((t) => t.id === id);
    if (!track) return;
    const newValue = Math.max(0, track.currentValue - value);
    try {
      const { error } = await supabase.from('sub_tracks').update({ current_value: newValue }).eq('id', id);
      if (error) { console.error('Failed to decrement sub track:', error); return; }
      set((s) => ({
        subTracks: s.subTracks.map((t) => (t.id === id ? { ...t, currentValue: newValue } : t)),
      }));
    } catch (err) {
      console.error('Failed to decrement sub track:', err);
    }
  },
  toggleSubTrackHabit: async (id) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const today = getToday();
    const { data, success } = await supabaseCall<{ is_on: boolean; new_value: number; entry_id: string | null }[]>(
      supabase.rpc('toggle_sub_track_habit', { p_track_id: id, p_user_id: userId, p_date: today }),
      'toggleSubTrackHabit'
    );
    if (!success) return;
    const result = data?.[0];
    if (!result) return;
    set((s) => {
      if (result.is_on) {
        return {
          subTrackEntries: [...s.subTrackEntries, { id: result.entry_id!, trackId: id, value: 1, date: today, note: '' }],
          subTracks: s.subTracks.map((t) =>
            t.id === id ? { ...t, currentValue: result.new_value } : t
          ),
        };
      }
      return {
        subTrackEntries: s.subTrackEntries.filter((e) => e.trackId !== id || e.date !== today),
        subTracks: s.subTracks.map((t) =>
          t.id === id ? { ...t, currentValue: result.new_value } : t
        ),
      };
    });
  },

  subTrackEntries: [],
  addSubTrackEntry: async (entry) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const id = entry.id || generateId();
    const { success } = await supabaseCall(supabase.from('sub_track_entries').insert({ id, user_id: userId, track_id: entry.trackId, value: entry.value, date: entry.date, note: entry.note }), 'addSubTrackEntry');
    if (!success) return;
    set((s) => ({ subTrackEntries: [...s.subTrackEntries, { ...entry, id }] }));
  },
  removeSubTrackEntry: async (id) => {
    const { success } = await supabaseCall(supabase.from('sub_track_entries').delete().eq('id', id), 'removeSubTrackEntry');
    if (!success) return;
    set((s) => ({ subTrackEntries: s.subTrackEntries.filter((e) => e.id !== id) }));
  },
  getSubTrackEntryToday: (trackId) => {
    return get().subTrackEntries.find((e) => e.trackId === trackId && e.date === getToday());
  },

  bookmarkCategories: [],
  bookmarks: [],
  stickyNotes: [],
  todoNotes: [],
  addBookmarkCategory: async (category) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const id = generateId();
    const { success } = await supabaseCall(
      supabase.from('bookmark_categories').insert({
        id, user_id: userId, name: category.name,
        icon: category.icon, color: category.color,
      }),
      'addBookmarkCategory'
    );
    if (!success) {
      set({ error: 'Failed to add bookmark category. Please try again.' });
      return;
    }
    set((s) => ({ bookmarkCategories: [...s.bookmarkCategories, { ...category, id }] }));
  },
  removeBookmarkCategory: async (id) => {
    const { success } = await supabaseCall(supabase.from('bookmark_categories').delete().eq('id', id), 'removeBookmarkCategory');
    if (!success) return;
    set((s) => ({
      bookmarkCategories: s.bookmarkCategories.filter((c) => c.id !== id),
      bookmarks: s.bookmarks.filter((b) => b.categoryId !== id),
    }));
  },
  addBookmark: async (bookmark) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const id = generateId();
    const { success } = await supabaseCall(
      supabase.from('bookmarks').insert({
        id,
        user_id: userId,
        category_id: bookmark.categoryId,
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description ?? '',
        note: bookmark.note ?? '',
        created_at: Date.now(),
      }),
      'addBookmark'
    );
    if (!success) {
      set({ error: 'Failed to add bookmark. Please try again.' });
      return;
    }
    set((s) => ({ bookmarks: [...s.bookmarks, { ...bookmark, id }] }));
  },
  removeBookmark: async (id) => {
    const { success } = await supabaseCall(supabase.from('bookmarks').delete().eq('id', id), 'removeBookmark');
    if (!success) return;
    set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) }));
  },

  addStickyNote: async (note) => {
    const userId = get().session?.user?.id;
    if (import.meta.env.DEV) console.log('[addStickyNote]', note.id, note.title);
    if (!userId) return;
    const sortOrder = get().stickyNotes.length;
    const { success } = await supabaseCall(
      supabase.from('sticky_notes').insert({
        id: note.id, user_id: userId, title: note.title,
        text: note.text, sort_order: sortOrder,
      }),
      'addStickyNote'
    );
    if (!success) {
      set({ error: 'Failed to save sticky note. Please try again.' });
      return;
    }
    set((s) => ({
      stickyNotes: [...s.stickyNotes, { ...note, sortOrder }],
    }));
  },

  updateStickyNote: async (id, data) => {
    const dbData: Record<string, unknown> = {};
    if (data.title !== undefined) dbData.title = data.title;
    if (data.text !== undefined) dbData.text = data.text;
    const { success } = await supabaseCall(supabase.from('sticky_notes').update(dbData).eq('id', id), 'updateStickyNote');
    if (!success) return;
    set((s) => ({
      stickyNotes: s.stickyNotes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    }));
  },

  deleteStickyNote: async (id) => {
    const { success } = await supabaseCall(supabase.from('sticky_notes').delete().eq('id', id), 'deleteStickyNote');
    if (!success) return;
    set((s) => ({
      stickyNotes: s.stickyNotes.filter((n) => n.id !== id),
    }));
  },

  reorderStickyNotes: async (ids) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const items = ids.map((id, index) => {
      const n = get().stickyNotes.find((x) => x.id === id)!;
      return { ...n, sortOrder: index };
    });
    const { success } = await supabaseCall(
      supabase.from('sticky_notes').upsert(
        items.map((n) => ({ id: n.id, user_id: userId, sort_order: n.sortOrder })),
        { onConflict: 'id' }
      ),
      'reorderStickyNotes'
    );
    if (!success) return;
    set({ stickyNotes: items });
  },

  addTodoNote: async (note) => {
    const userId = get().session?.user?.id;
    if (import.meta.env.DEV) console.log('[addTodoNote]', note.id, note.title);
    if (!userId) return;
    const sortOrder = get().todoNotes.length;
    const { success } = await supabaseCall(
      supabase.from('todo_notes').insert({
        id: note.id, user_id: userId, title: note.title,
        items: note.items, sort_order: sortOrder,
      }),
      'addTodoNote'
    );
    if (!success) {
      set({ error: 'Failed to save todo note. Please try again.' });
      return;
    }
    set((s) => ({
      todoNotes: [...s.todoNotes, { ...note, sortOrder }],
    }));
  },

  updateTodoNote: async (id, updated) => {
    const dbData: Record<string, unknown> = {};
    if (updated.title !== undefined) dbData.title = updated.title;
    if (updated.items !== undefined) dbData.items = updated.items;
    const { success } = await supabaseCall(supabase.from('todo_notes').update(dbData).eq('id', id), 'updateTodoNote');
    if (!success) return;
    set((s) => ({
      todoNotes: s.todoNotes.map((n) => (n.id === id ? { ...n, ...updated } : n)),
    }));
  },

  deleteTodoNote: async (id) => {
    const { success } = await supabaseCall(supabase.from('todo_notes').delete().eq('id', id), 'deleteTodoNote');
    if (!success) return;
    set((s) => ({
      todoNotes: s.todoNotes.filter((n) => n.id !== id),
    }));
  },

  reorderTodoNotes: async (ids) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const items = ids.map((id, index) => {
      const n = get().todoNotes.find((x) => x.id === id)!;
      return { ...n, sortOrder: index };
    });
    const { success } = await supabaseCall(
      supabase.from('todo_notes').upsert(
        items.map((n) => ({ id: n.id, user_id: userId, sort_order: n.sortOrder })),
        { onConflict: 'id' }
      ),
      'reorderTodoNotes'
    );
    if (!success) return;
    set({ todoNotes: items });
  },

}));

function mapDailyTodo(row: Record<string, unknown>): DailyTodo {
  return { 
    id: row.id as string, 
    text: row.text as string, 
    completed: row.completed as boolean, 
    priority: row.priority as Priority, 
    createdAt: typeof row.created_at === "number" ? row.created_at : new Date(row.created_at as string).getTime() || Date.now(), 
    date: row.date as string, 
    sortOrder: (row.sort_order as number) ?? 0, 
    rolloverCount: (row.rollover_count as number) ?? 0,
    gate: 'daily',
    updatedAt: typeof row.updated_at === "number" ? row.updated_at : new Date(row.updated_at as string).getTime() || Date.now()
  };
}

function mapWeeklyTodo(row: Record<string, unknown>): WeeklyTodo {
  return { 
    id: row.id as string, 
    text: row.text as string, 
    completed: row.completed as boolean, 
    priority: row.priority as Priority, 
    createdAt: typeof row.created_at === "number" ? row.created_at : new Date(row.created_at as string).getTime() || Date.now(), 
    weekStart: row.week_start as string, 
    sortOrder: (row.sort_order as number) ?? 0, 
    rolloverCount: (row.rollover_count as number) ?? 0,
    gate: 'weekly',
    updatedAt: typeof row.updated_at === "number" ? row.updated_at : new Date(row.updated_at as string).getTime() || Date.now()
  };
}

function mapBacklogTodo(row: Record<string, unknown>): BacklogTodo {
  return { 
    id: row.id as string, 
    text: row.text as string, 
    completed: row.completed as boolean, 
    priority: row.priority as Priority, 
    createdAt: typeof row.created_at === "number" ? row.created_at : new Date(row.created_at as string).getTime() || Date.now(), 
    sortOrder: (row.sort_order as number) ?? 0,
    gate: 'backlog',
    updatedAt: typeof row.updated_at === "number" ? row.updated_at : new Date(row.updated_at as string).getTime() || Date.now()
  };
}

function mapLifeCategory(row: Record<string, unknown>): LifeCategory {
  return { id: row.id as string, name: row.name as string, nameKey: (row.name_key as string) || '', icon: row.icon as string, color: row.color as string, sortOrder: row.sort_order as number };
}

function mapSubTrack(row: Record<string, unknown>): SubTrack {
  return { id: row.id as string, categoryId: row.category_id as string, name: row.name as string, nameKey: (row.name_key as string) || '', icon: row.icon as string, progressType: row.progress_type as SubTrack['progressType'], target: row.target as number, unit: row.unit as string, currentValue: row.current_value as number, sortOrder: row.sort_order as number };
}

function mapSubTrackEntry(row: Record<string, unknown>): SubTrackEntry {
  return { id: row.id as string, trackId: row.track_id as string, value: row.value as number, date: row.date as string, note: (row.note as string) || '' };
}

function mapBookmarkCategory(row: Record<string, unknown>): BookmarkCategory {
  return { id: row.id as string, name: row.name as string, icon: (row.icon as string) || 'general', color: (row.color as string) || 'terracotta' };
}

function mapBookmark(row: Record<string, unknown>): Bookmark {
  return { id: row.id as string, categoryId: row.category_id as string, title: row.title as string, url: row.url as string, description: (row.description as string) || '', note: (row.note as string) || '' };
}

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
  const msg = error && typeof error === 'object' ? (error as any).message || String(error) : String(error);
  const details = error && typeof error === 'object' ? (error as any).details || '' : '';
  console.error(`[${context}] ${msg}`, details);
  const msgStr = String(msg);
  if (msgStr.includes('PGRST204') || msgStr.includes('column') || msgStr.includes('not found')) {
    console.error(
      `[${context}] Schema cache issue detected. Run pending migrations and reload PostgREST schema cache: NOTIFY pgrst, 'reload schema';`
    );
  }
}

async function supabaseCall<T>(
  promise: PromiseLike<{ data: T | null; error: any }>,
  context: string
): Promise<{ data: T | null; success: boolean }> {
  try {
    const { data, error } = await promise;
    if (error) {
      logError(context, error);
      return { data: null, success: false };
    }
    return { data, success: true };
  } catch (err) {
    logError(context, err);
    return { data: null, success: false };
  }
}

async function rolloverStaleTodos(userId: string) {
  const today = getToday();
  const weekStart = getWeekStart();

  const { error } = await supabase.rpc('rollover_stale_todos', {
    p_user_id: userId,
    p_today: today,
    p_week_start: weekStart,
  });

  if (error) console.error('[rollover] error:', error);
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
      await rolloverStaleTodos(userId);

      const today = getToday();
      const weekStart = getWeekStart();

      // Load core tables — these must exist
      const [dailyFocusRes, dailyTodoRes, weeklyTodoRes, backlogTodoRes, lifeCategoryRes, subTrackRes, subTrackEntryRes, bookmarkCategoryRes, bookmarkRes] = await Promise.all([
        supabase.from('daily_focus').select('*').eq('user_id', userId).limit(1),
        supabase.from('daily_todos').select('*').eq('user_id', userId).eq('date', today).order('sort_order'),
        supabase.from('weekly_todos').select('*').eq('user_id', userId).eq('week_start', weekStart).order('sort_order'),
        supabase.from('backlog_todos').select('*').eq('user_id', userId).order('sort_order'),
        supabase.from('life_categories').select('*').eq('user_id', userId).order('sort_order'),
        supabase.from('sub_tracks').select('*').eq('user_id', userId).order('sort_order'),
        supabase.from('sub_track_entries').select('*').eq('user_id', userId).order('date'),
        supabase.from('bookmark_categories').select('*').eq('user_id', userId).order('name'),
        supabase.from('bookmarks').select('*').eq('user_id', userId).order('created_at'),
      ]);

      dailyFocusRes.error && console.error('[loadUserData] daily_focus error:', dailyFocusRes.error);
      dailyTodoRes.error && console.error('[loadUserData] daily_todos error:', dailyTodoRes.error);
      weeklyTodoRes.error && console.error('[loadUserData] weekly_todos error:', weeklyTodoRes.error);
      backlogTodoRes.error && console.error('[loadUserData] backlog_todos error:', backlogTodoRes.error);
      lifeCategoryRes.error && console.error('[loadUserData] life_categories error:', lifeCategoryRes.error);
      subTrackRes.error && console.error('[loadUserData] sub_tracks error:', subTrackRes.error);
      subTrackEntryRes.error && console.error('[loadUserData] sub_track_entries error:', subTrackEntryRes.error);
      bookmarkCategoryRes.error && console.error('[loadUserData] bookmark_categories error:', bookmarkCategoryRes.error);
      bookmarkRes.error && console.error('[loadUserData] bookmarks error:', bookmarkRes.error);

      const dailyFocusRows = dailyFocusRes.data;
      const dailyTodoRows = dailyTodoRes.data;
      const weeklyTodoRows = weeklyTodoRes.data;
      const backlogTodoRows = backlogTodoRes.data;
      const lifeCategoryRows = lifeCategoryRes.data;
      const subTrackRows = subTrackRes.data;
      const subTrackEntryRows = subTrackEntryRes.data;
      const bookmarkCategoryRows = bookmarkCategoryRes.data;
      const bookmarkRows = bookmarkRes.data;

      if (import.meta.env.DEV) {
        console.log('[loadUserData] Fetched rows:', {
          dailyFocus: dailyFocusRows?.length ?? 0,
          dailyTodos: dailyTodoRows?.length ?? 0,
          weeklyTodos: weeklyTodoRows?.length ?? 0,
          backlogTodos: backlogTodoRows?.length ?? 0,
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

      if (!lifeCategoryRows || lifeCategoryRows.length === 0) {
        if (import.meta.env.DEV) console.log('[loadUserData] No categories found — seeding defaults');
        await seedDefaults();
      } else {
        if (import.meta.env.DEV) console.log('[loadUserData] Data loaded successfully from existing Supabase rows');
      }
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
    const newTodo = { id, text, completed: false, priority, createdAt: Date.now(), date: getToday(), sortOrder, rolloverCount: 0 };
    set((s) => ({ dailyTodos: [...s.dailyTodos, newTodo] }));
    const { success } = await supabaseCall(
      supabase.from('daily_todos').insert({
        id, user_id: userId, text, completed: false, priority,
        created_at: Date.now(), date: getToday(), sort_order: sortOrder,
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
    const { success } = await supabaseCall(supabase.from('daily_todos').update({ completed: !todo.completed }).eq('id', id), 'toggleDailyTodo');
    if (!success) return;
    set((s) => ({
      dailyTodos: s.dailyTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  },
  removeDailyTodo: async (id) => {
    const { success } = await supabaseCall(supabase.from('daily_todos').delete().eq('id', id), 'removeDailyTodo');
    if (!success) return;
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
    const newTodo = { id, text, completed: false, priority, createdAt: Date.now(), weekStart, sortOrder, rolloverCount: 0 };
    set((s) => ({ weeklyTodos: [...s.weeklyTodos, newTodo] }));
    const { success } = await supabaseCall(
      supabase.from('weekly_todos').insert({
        id, user_id: userId, text, completed: false, priority,
        created_at: Date.now(), week_start: weekStart, sort_order: sortOrder,
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
    const { success } = await supabaseCall(supabase.from('weekly_todos').update({ completed: !todo.completed }).eq('id', id), 'toggleWeeklyTodo');
    if (!success) return;
    set((s) => ({
      weeklyTodos: s.weeklyTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  },
  removeWeeklyTodo: async (id) => {
    const { success } = await supabaseCall(supabase.from('weekly_todos').delete().eq('id', id), 'removeWeeklyTodo');
    if (!success) return;
    set((s) => ({ weeklyTodos: s.weeklyTodos.filter((t) => t.id !== id) }));
  },

  backlogTodos: [],
  addBacklogTodo: async (text, priority) => {
    const userId = get().session?.user?.id;
    if (!userId) return { success: false };
    const id = generateId();
    const maxSortOrder = get().backlogTodos.reduce((max, t) => Math.max(max, t.sortOrder), -1);
    const sortOrder = maxSortOrder + 1;
    const newTodo = { id, text, completed: false, priority, createdAt: Date.now(), sortOrder };
    set((s) => ({ backlogTodos: [...s.backlogTodos, newTodo] }));
    const { success } = await supabaseCall(
      supabase.from('backlog_todos').insert({
        id, user_id: userId, text, completed: false, priority,
        created_at: Date.now(), sort_order: sortOrder,
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
    const { success } = await supabaseCall(supabase.from('backlog_todos').update({ completed: !todo.completed }).eq('id', id), 'toggleBacklogTodo');
    if (!success) return;
    set((s) => ({
      backlogTodos: s.backlogTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    }));
  },
  removeBacklogTodo: async (id) => {
    const { success } = await supabaseCall(supabase.from('backlog_todos').delete().eq('id', id), 'removeBacklogTodo');
    if (!success) return;
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
      supabase.from('daily_todos').upsert(
        items.map((t) => ({ id: t.id, user_id: userId, sort_order: t.sortOrder })),
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
      supabase.from('weekly_todos').upsert(
        items.map((t) => ({ id: t.id, user_id: userId, sort_order: t.sortOrder })),
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
      supabase.from('backlog_todos').upsert(
        items.map((t) => ({ id: t.id, user_id: userId, sort_order: t.sortOrder })),
        { onConflict: 'id' }
      ),
      'reorderBacklogTodos'
    );
    if (!success) return;
    set({ backlogTodos: items });
  },
  moveToDaily: async (id) => {
    const todo = get().backlogTodos.find((x) => x.id === id) || get().weeklyTodos.find((x) => x.id === id);
    if (!todo) return;
    const fromBacklog = get().backlogTodos.some((x) => x.id === id);
    const userId = get().session?.user?.id;
    if (!userId) return;
    const newId = generateId();
    const today = getToday();
    const maxSortOrder = get().dailyTodos.reduce((max, t) => Math.max(max, t.sortOrder), -1);
    const sortOrder = maxSortOrder + 1;
    const { success } = await supabaseCall(
      supabase.rpc('move_todo_item', {
        p_id: id,
        p_from_table: fromBacklog ? 'backlog_todos' : 'weekly_todos',
        p_to_table: 'daily_todos',
        p_payload: {
          id: newId,
          user_id: userId,
          text: todo.text,
          completed: false,
          priority: todo.priority,
          created_at: Date.now(),
          date: today,
          sort_order: sortOrder,
        },
        p_user_id: userId,
      }),
      'moveToDaily'
    );
    if (!success) return;
    set((s) => ({
      backlogTodos: s.backlogTodos.filter((x) => x.id !== id),
      weeklyTodos: s.weeklyTodos.filter((x) => x.id !== id),
      dailyTodos: [...s.dailyTodos, { ...todo, id: newId, date: today, completed: false, sortOrder, rolloverCount: 0 }],
    }));
  },
  moveToWeekly: async (id) => {
    const todo = get().backlogTodos.find((x) => x.id === id) || get().dailyTodos.find((x) => x.id === id);
    if (!todo) return;
    const fromBacklog = get().backlogTodos.some((x) => x.id === id);
    const userId = get().session?.user?.id;
    if (!userId) return;
    const newId = generateId();
    const weekStart = getWeekStart();
    const maxSortOrder = get().weeklyTodos.reduce((max, t) => Math.max(max, t.sortOrder), -1);
    const sortOrder = maxSortOrder + 1;
    const { success } = await supabaseCall(
      supabase.rpc('move_todo_item', {
        p_id: id,
        p_from_table: fromBacklog ? 'backlog_todos' : 'daily_todos',
        p_to_table: 'weekly_todos',
        p_payload: {
          id: newId,
          user_id: userId,
          text: todo.text,
          completed: false,
          priority: todo.priority,
          created_at: Date.now(),
          week_start: weekStart,
          sort_order: sortOrder,
        },
        p_user_id: userId,
      }),
      'moveToWeekly'
    );
    if (!success) return;
    set((s) => ({
      backlogTodos: s.backlogTodos.filter((x) => x.id !== id),
      dailyTodos: s.dailyTodos.filter((x) => x.id !== id),
      weeklyTodos: [...s.weeklyTodos, { ...todo, id: newId, weekStart, completed: false, sortOrder, rolloverCount: 0 }],
    }));
  },
  moveToBacklog: async (id, from) => {
    const todos = from === 'daily' ? get().dailyTodos : get().weeklyTodos;
    const todo = todos.find((x) => x.id === id);
    if (!todo) return;
    const userId = get().session?.user?.id;
    if (!userId) return;
    const newId = generateId();
    const table = from === 'daily' ? 'daily_todos' : 'weekly_todos';
    const maxSortOrder = get().backlogTodos.reduce((max, t) => Math.max(max, t.sortOrder), -1);
    const sortOrder = maxSortOrder + 1;
    const { success } = await supabaseCall(
      supabase.rpc('move_todo_item', {
        p_id: id,
        p_from_table: table,
        p_to_table: 'backlog_todos',
        p_payload: {
          id: newId,
          user_id: userId,
          text: todo.text,
          completed: false,
          priority: todo.priority,
          created_at: Date.now(),
          sort_order: sortOrder,
        },
        p_user_id: userId,
      }),
      'moveToBacklog'
    );
    if (!success) return;
    if (from === 'daily') {
      set((s) => ({
        dailyTodos: s.dailyTodos.filter((x) => x.id !== id),
        backlogTodos: [...s.backlogTodos, { id: newId, text: todo.text, completed: false, priority: todo.priority, createdAt: Date.now(), sortOrder }],
      }));
    } else {
      set((s) => ({
        weeklyTodos: s.weeklyTodos.filter((x) => x.id !== id),
        backlogTodos: [...s.backlogTodos, { id: newId, text: todo.text, completed: false, priority: todo.priority, createdAt: Date.now(), sortOrder }],
      }));
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
    const { success: tracksOk } = await supabaseCall(supabase.from('sub_tracks').delete().eq('category_id', id).eq('user_id', userId), 'deletePillar sub_tracks');
    if (!tracksOk) return;
    const { success: catOk } = await supabaseCall(supabase.from('life_categories').delete().eq('id', id).eq('user_id', userId), 'deletePillar categories');
    if (!catOk) return;
    set((s) => {
      const trackIds = s.subTracks.filter((t) => t.categoryId === id).map((t) => t.id);
      return {
        lifeCategories: s.lifeCategories.filter((c) => c.id !== id),
        subTracks: s.subTracks.filter((t) => t.categoryId !== id),
        subTrackEntries: s.subTrackEntries.filter((e) => !trackIds.includes(e.trackId)),
      };
    });
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

async function seedDefaults() {
  const userId = useAppStore.getState().session?.user?.id;
  if (!userId) {
    if (import.meta.env.DEV) console.log('[seedDefaults] No user ID, skipping');
    return;
  }

  if (import.meta.env.DEV) console.log('[seedDefaults] Seeding default data for user:', userId);

  const categories = [
    { id: generateId(), name: 'ديني', nameKey: 'pillars.deen', icon: 'book-open', color: 'terracotta', sortOrder: 1 },
    { id: generateId(), name: 'عقلي', nameKey: 'pillars.mind', icon: 'brain', color: 'gold', sortOrder: 2 },
    { id: generateId(), name: 'صحتي', nameKey: 'pillars.health', icon: 'heart', color: 'sage', sortOrder: 3 },
    { id: generateId(), name: 'برمجتي', nameKey: 'pillars.career', icon: 'code', color: 'slate', sortOrder: 4 },
  ];

  try {
    const { data: insertedCategories, error: catError } = await supabase.from('life_categories').insert(
      categories.map((c) => ({
        id: c.id,
        user_id: userId,
        name: c.name,
        name_key: c.nameKey,
        icon: c.icon,
        color: c.color,
        sort_order: c.sortOrder,
      }))
    ).select();

    if (catError) {
      console.error('[seedDefaults] life_categories insert error:', catError);
      return;
    }

    if (import.meta.env.DEV) console.log('[seedDefaults] Inserted life_categories:', insertedCategories);

    if (!insertedCategories || insertedCategories.length === 0) {
      console.error('[seedDefaults] No life_categories returned after insert');
      return;
    }

    // Build mapping: old local category id -> actual Supabase-generated UUID
    const catIdMap = new Map<string, string>();
    insertedCategories.forEach((cat, i) => {
      catIdMap.set(categories[i].id, cat.id);
    });

    const tracks = [
      { id: generateId(), categoryId: catIdMap.get(categories[0].id)!, name: 'القرآن', nameKey: 'subTracks.quran', icon: 'book-open', progressType: 'counter' as const, target: 604, unit: 'pages', currentValue: 0, sortOrder: 1 },
      { id: generateId(), categoryId: catIdMap.get(categories[0].id)!, name: 'رياض الصالحين', nameKey: 'subTracks.riyadh', icon: 'bookmark', progressType: 'counter' as const, target: 190, unit: 'pages', currentValue: 0, sortOrder: 2 },
      { id: generateId(), categoryId: catIdMap.get(categories[0].id)!, name: 'العقيدة', nameKey: 'subTracks.aqeedah', icon: 'star', progressType: 'counter' as const, target: 30, unit: 'lectures', currentValue: 0, sortOrder: 3 },
      { id: generateId(), categoryId: catIdMap.get(categories[3].id)!, name: 'Data Structures', nameKey: 'subTracks.dsa', icon: 'code', progressType: 'counter' as const, target: 150, unit: 'videos', currentValue: 0, sortOrder: 1 },
      { id: generateId(), categoryId: catIdMap.get(categories[3].id)!, name: 'Node.js Project', nameKey: 'subTracks.nodeProject', icon: 'folder', progressType: 'counter' as const, target: 60, unit: 'hours', currentValue: 0, sortOrder: 2 },
    ];

    if (tracks.length > 0) {
      const tracksToInsert = tracks.map((t) => ({
        id: t.id,
        user_id: userId,
        category_id: t.categoryId,
        name: t.name,
        name_key: t.nameKey,
        icon: t.icon,
        progress_type: t.progressType,
        target: t.target,
        unit: t.unit,
        current_value: t.currentValue,
        sort_order: t.sortOrder,
      }));

      if (import.meta.env.DEV) console.log('[seed] About to insert sub_tracks:', tracksToInsert);

      const { data: insertedTracks, error: trackError } = await supabase.from('sub_tracks').insert(tracksToInsert).select();

      if (import.meta.env.DEV) console.log('[seed] sub_tracks insert result:', insertedTracks, 'error:', trackError);

      if (trackError) {
        console.error('[seedDefaults] sub_tracks insert error:', trackError);
        return;
      }
    }

    if (import.meta.env.DEV) console.log('[seedDefaults] Successfully seeded', categories.length, 'categories and', tracks.length, 'tracks');

    set({
      lifeCategories: insertedCategories.map((c: Record<string, unknown>) => ({
        id: c.id as string,
        name: c.name as string,
        nameKey: (c.name_key as string) || '',
        icon: c.icon as string,
        color: c.color as string,
        sortOrder: c.sort_order as number,
      })),
      subTracks: tracks,
    });
  } catch (err) {
    console.error('[seedDefaults] Failed to seed defaults:', err);
  }
}

function set(state: Partial<AppStore>) {
  useAppStore.setState(state);
}

function mapDailyTodo(row: Record<string, unknown>): DailyTodo {
  return { id: row.id as string, text: row.text as string, completed: row.completed as boolean, priority: row.priority as Priority, createdAt: typeof row.created_at === "number" ? row.created_at : new Date(row.created_at as string).getTime() || Date.now(), date: row.date as string, sortOrder: (row.sort_order as number) ?? 0, rolloverCount: (row.rollover_count as number) ?? 0 };
}

function mapWeeklyTodo(row: Record<string, unknown>): WeeklyTodo {
  return { id: row.id as string, text: row.text as string, completed: row.completed as boolean, priority: row.priority as Priority, createdAt: typeof row.created_at === "number" ? row.created_at : new Date(row.created_at as string).getTime() || Date.now(), weekStart: row.week_start as string, sortOrder: (row.sort_order as number) ?? 0, rolloverCount: (row.rollover_count as number) ?? 0 };
}

function mapBacklogTodo(row: Record<string, unknown>): BacklogTodo {
  return { id: row.id as string, text: row.text as string, completed: row.completed as boolean, priority: row.priority as Priority, createdAt: typeof row.created_at === "number" ? row.created_at : new Date(row.created_at as string).getTime() || Date.now(), sortOrder: (row.sort_order as number) ?? 0 };
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

import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
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

  dailyFocus: DailyFocus;
  setDailyFocus: (focus: DailyFocus) => Promise<void>;
  clearDailyFocus: () => Promise<void>;

  dailyTodos: DailyTodo[];
  addDailyTodo: (text: string, priority: Priority) => Promise<void>;
  toggleDailyTodo: (id: string) => Promise<void>;
  removeDailyTodo: (id: string) => Promise<void>;

  weeklyTodos: WeeklyTodo[];
  addWeeklyTodo: (text: string, priority: Priority) => Promise<void>;
  toggleWeeklyTodo: (id: string) => Promise<void>;
  removeWeeklyTodo: (id: string) => Promise<void>;

  backlogTodos: BacklogTodo[];
  addBacklogTodo: (text: string, priority: Priority) => Promise<void>;
  toggleBacklogTodo: (id: string) => Promise<void>;
  removeBacklogTodo: (id: string) => Promise<void>;
  reorderDailyTodos: (ids: string[]) => Promise<void>;
  reorderWeeklyTodos: (ids: string[]) => Promise<void>;
  reorderBacklogTodos: (ids: string[]) => Promise<void>;
  moveToDaily: (id: string) => Promise<void>;
  moveToWeekly: (id: string) => Promise<void>;

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
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

function generateId(): string {
  return crypto.randomUUID();
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

  session: null,
  isLoading: true,
  setSession: (session) => set({ session }),

  loadUserData: async () => {
    const userId = get().session?.user?.id;
    if (!userId) {
      console.log('[loadUserData] No user ID, skipping');
      set({ isLoading: false });
      return;
    }

    console.log('[loadUserData] Fetching data for user:', userId);

    try {
      const results = await Promise.all([
        supabase.from('daily_focus').select('*').eq('user_id', userId).limit(1),
        supabase.from('daily_todos').select('*').eq('user_id', userId).order('created_at'),
        supabase.from('weekly_todos').select('*').eq('user_id', userId).order('created_at'),
        supabase.from('backlog_todos').select('*').eq('user_id', userId).order('created_at'),
        supabase.from('life_categories').select('*').eq('user_id', userId).order('sort_order'),
        supabase.from('sub_tracks').select('*').eq('user_id', userId).order('sort_order'),
        supabase.from('sub_track_entries').select('*').eq('user_id', userId).order('date'),
        supabase.from('bookmark_categories').select('*').eq('user_id', userId).order('name'),
        supabase.from('bookmarks').select('*').eq('user_id', userId).order('created_at'),
      ]);

      const [dailyFocusRes, dailyTodoRes, weeklyTodoRes, backlogTodoRes, lifeCategoryRes, subTrackRes, subTrackEntryRes, bookmarkCategoryRes, bookmarkRes] = results;

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
      console.log('[loadUserData] subTracks fetched:', subTrackRows);
      if (subTrackRows && subTrackRows.length > 0) {
        console.log('[loadUserData] First subTrack raw:', subTrackRows[0]);
        console.log('[loadUserData] First subTrack mapped:', mapSubTrack(subTrackRows[0]));
      }

      const focusRow = dailyFocusRows && dailyFocusRows.length > 0 ? dailyFocusRows[0] : null;
      set({
        dailyFocus: focusRow
          ? { text: focusRow.text, date: focusRow.date }
          : { text: '', date: getToday() },
        dailyTodos: (dailyTodoRows || []).map(mapDailyTodo),
        weeklyTodos: (weeklyTodoRows || []).map(mapWeeklyTodo),
        backlogTodos: (backlogTodoRows || []).map(mapBacklogTodo),
        lifeCategories: (lifeCategoryRows || []).map(mapLifeCategory),
        subTracks: (subTrackRows || []).map(mapSubTrack),
        subTrackEntries: (subTrackEntryRows || []).map(mapSubTrackEntry),
        bookmarkCategories: (bookmarkCategoryRows || []).map(mapBookmarkCategory),
        bookmarks: (bookmarkRows || []).map(mapBookmark),
        isLoading: false,
      });

      if (!lifeCategoryRows || lifeCategoryRows.length === 0) {
        console.log('[loadUserData] No categories found — seeding defaults');
        await seedDefaults();
      } else {
        console.log('[loadUserData] Data loaded successfully from existing Supabase rows');
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
      const existing = get().dailyFocus.text ? await supabase.from('daily_focus').select('id').eq('user_id', userId).maybeSingle() : null;
      if (existing?.data?.id) {
        await supabase.from('daily_focus').update({ text: focus.text, date: focus.date }).eq('id', existing.data.id);
      } else {
        await supabase.from('daily_focus').insert({ user_id: userId, text: focus.text, date: focus.date });
      }
      set({ dailyFocus: focus });
    } catch (err) {
      console.error('Failed to set daily focus:', err);
    }
  },
  clearDailyFocus: async () => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    try {
      await supabase.from('daily_focus').delete().eq('user_id', userId);
      set({ dailyFocus: { text: '', date: getToday() } });
    } catch (err) {
      console.error('Failed to clear daily focus:', err);
    }
  },

  dailyTodos: [],
  addDailyTodo: async (text, priority) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const id = generateId();
    const todo = { id, user_id: userId, text, completed: false, priority, created_at: Date.now(), date: getToday() };
    try {
      await supabase.from('daily_todos').insert(todo);
      set((s) => ({
        dailyTodos: [...s.dailyTodos, { id, text, completed: false, priority, createdAt: Date.now(), date: getToday() }],
      }));
    } catch (err) {
      console.error('Failed to add daily todo:', err);
    }
  },
  toggleDailyTodo: async (id) => {
    try {
      const todo = get().dailyTodos.find((t) => t.id === id);
      if (!todo) return;
      await supabase.from('daily_todos').update({ completed: !todo.completed }).eq('id', id);
      set((s) => ({
        dailyTodos: s.dailyTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      }));
    } catch (err) {
      console.error('Failed to toggle daily todo:', err);
    }
  },
  removeDailyTodo: async (id) => {
    try {
      await supabase.from('daily_todos').delete().eq('id', id);
      set((s) => ({ dailyTodos: s.dailyTodos.filter((t) => t.id !== id) }));
    } catch (err) {
      console.error('Failed to remove daily todo:', err);
    }
  },

  weeklyTodos: [],
  addWeeklyTodo: async (text, priority) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const id = generateId();
    const weekStart = getWeekStart();
    try {
      await supabase.from('weekly_todos').insert({ id, user_id: userId, text, completed: false, priority, created_at: Date.now(), week_start: weekStart });
      set((s) => ({
        weeklyTodos: [...s.weeklyTodos, { id, text, completed: false, priority, createdAt: Date.now(), weekStart }],
      }));
    } catch (err) {
      console.error('Failed to add weekly todo:', err);
    }
  },
  toggleWeeklyTodo: async (id) => {
    try {
      const todo = get().weeklyTodos.find((t) => t.id === id);
      if (!todo) return;
      await supabase.from('weekly_todos').update({ completed: !todo.completed }).eq('id', id);
      set((s) => ({
        weeklyTodos: s.weeklyTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      }));
    } catch (err) {
      console.error('Failed to toggle weekly todo:', err);
    }
  },
  removeWeeklyTodo: async (id) => {
    try {
      await supabase.from('weekly_todos').delete().eq('id', id);
      set((s) => ({ weeklyTodos: s.weeklyTodos.filter((t) => t.id !== id) }));
    } catch (err) {
      console.error('Failed to remove weekly todo:', err);
    }
  },

  backlogTodos: [],
  addBacklogTodo: async (text, priority) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const id = generateId();
    try {
      await supabase.from('backlog_todos').insert({ id, user_id: userId, text, completed: false, priority, created_at: Date.now() });
      set((s) => ({
        backlogTodos: [...s.backlogTodos, { id, text, completed: false, priority, createdAt: Date.now() }],
      }));
    } catch (err) {
      console.error('Failed to add backlog todo:', err);
    }
  },
  toggleBacklogTodo: async (id) => {
    try {
      const todo = get().backlogTodos.find((t) => t.id === id);
      if (!todo) return;
      await supabase.from('backlog_todos').update({ completed: !todo.completed }).eq('id', id);
      set((s) => ({
        backlogTodos: s.backlogTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      }));
    } catch (err) {
      console.error('Failed to toggle backlog todo:', err);
    }
  },
  removeBacklogTodo: async (id) => {
    try {
      await supabase.from('backlog_todos').delete().eq('id', id);
      set((s) => ({ backlogTodos: s.backlogTodos.filter((t) => t.id !== id) }));
    } catch (err) {
      console.error('Failed to remove backlog todo:', err);
    }
  },
  reorderDailyTodos: async (ids) => {
    set((s) => ({
      dailyTodos: ids.map((id) => s.dailyTodos.find((t) => t.id === id)!),
    }));
  },
  reorderWeeklyTodos: async (ids) => {
    set((s) => ({
      weeklyTodos: ids.map((id) => s.weeklyTodos.find((t) => t.id === id)!),
    }));
  },
  reorderBacklogTodos: async (ids) => {
    set((s) => ({
      backlogTodos: ids.map((id) => s.backlogTodos.find((t) => t.id === id)!),
    }));
  },
  moveToDaily: async (id) => {
    const todo = get().backlogTodos.find((x) => x.id === id);
    if (!todo) return;
    const userId = get().session?.user?.id;
    if (!userId) return;
    const newId = generateId();
    const today = getToday();
    try {
      await supabase.from('daily_todos').insert({ id: newId, user_id: userId, text: todo.text, completed: false, priority: todo.priority, created_at: Date.now(), date: today });
      await supabase.from('backlog_todos').delete().eq('id', id);
      set((s) => ({
        backlogTodos: s.backlogTodos.filter((x) => x.id !== id),
        dailyTodos: [...s.dailyTodos, { ...todo, id: newId, date: today, completed: false }],
      }));
    } catch (err) {
      console.error('Failed to move to daily:', err);
    }
  },
  moveToWeekly: async (id) => {
    const todo = get().backlogTodos.find((x) => x.id === id);
    if (!todo) return;
    const userId = get().session?.user?.id;
    if (!userId) return;
    const newId = generateId();
    const weekStart = getWeekStart();
    try {
      await supabase.from('weekly_todos').insert({ id: newId, user_id: userId, text: todo.text, completed: false, priority: todo.priority, created_at: Date.now(), week_start: weekStart });
      await supabase.from('backlog_todos').delete().eq('id', id);
      set((s) => ({
        backlogTodos: s.backlogTodos.filter((x) => x.id !== id),
        weeklyTodos: [...s.weeklyTodos, { ...todo, id: newId, weekStart, completed: false }],
      }));
    } catch (err) {
      console.error('Failed to move to weekly:', err);
    }
  },

  lifeCategories: [],
  addLifeCategory: async (cat) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const id = cat.id || generateId();
    try {
      await supabase.from('life_categories').insert({ id, user_id: userId, name: cat.name, name_key: cat.nameKey, icon: cat.icon, color: cat.color, sort_order: cat.sortOrder });
      set((s) => ({ lifeCategories: [...s.lifeCategories, { ...cat, id }] }));
    } catch (err) {
      console.error('Failed to add life category:', err);
    }
  },
  removeLifeCategory: async (id) => {
    try {
      await supabase.from('life_categories').delete().eq('id', id);
      set((s) => ({
        lifeCategories: s.lifeCategories.filter((c) => c.id !== id),
        subTracks: s.subTracks.filter((t) => t.categoryId !== id),
        subTrackEntries: s.subTrackEntries.filter((e) => !s.subTracks.some((t) => t.id === e.trackId && t.categoryId === id)),
      }));
    } catch (err) {
      console.error('Failed to remove life category:', err);
    }
  },
  updateLifeCategory: async (id, data) => {
    try {
      await supabase.from('life_categories').update({ name: data.name, name_key: data.nameKey, icon: data.icon, color: data.color, sort_order: data.sortOrder }).eq('id', id);
      set((s) => ({
        lifeCategories: s.lifeCategories.map((c) => (c.id === id ? { ...c, ...data } : c)),
      }));
    } catch (err) {
      console.error('Failed to update life category:', err);
    }
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
    try {
      const { error: tracksError } = await supabase.from('sub_tracks').delete().eq('category_id', id).eq('user_id', userId);
      if (tracksError) { console.error('Failed to delete pillar sub_tracks:', tracksError); return; }
      const { error } = await supabase.from('life_categories').delete().eq('id', id).eq('user_id', userId);
      if (error) { console.error('Failed to delete pillar:', error); return; }
      set((s) => {
        const trackIds = s.subTracks.filter((t) => t.categoryId === id).map((t) => t.id);
        return {
          lifeCategories: s.lifeCategories.filter((c) => c.id !== id),
          subTracks: s.subTracks.filter((t) => t.categoryId !== id),
          subTrackEntries: s.subTrackEntries.filter((e) => !trackIds.includes(e.trackId)),
        };
      });
    } catch (err) {
      console.error('Failed to delete pillar:', err);
    }
  },

  subTracks: [],
  addSubTrack: async (track) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    try {
      const { data, error } = await supabase.from('sub_tracks').insert({
        user_id: userId, category_id: track.categoryId, name: track.name, name_key: track.nameKey, icon: track.icon, progress_type: track.progressType, target: track.target, unit: track.unit, current_value: track.currentValue, sort_order: track.sortOrder,
      }).select().single();
      if (error) { console.error('Failed to add sub track:', error); return; }
      set((s) => ({ subTracks: [...s.subTracks, { ...track, id: data.id }] }));
    } catch (err) {
      console.error('Failed to add sub track:', err);
    }
  },
  removeSubTrack: async (id) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    try {
      const { error } = await supabase.from('sub_tracks').delete().eq('id', id).eq('user_id', userId);
      if (error) { console.error('Failed to remove sub track:', error); return; }
      set((s) => ({
        subTracks: s.subTracks.filter((t) => t.id !== id),
        subTrackEntries: s.subTrackEntries.filter((e) => e.trackId !== id),
      }));
    } catch (err) {
      console.error('Failed to remove sub track:', err);
    }
  },
  updateSubTrack: async (id, data) => {
    try {
      const dbData: Record<string, unknown> = {};
      if (data.name !== undefined) dbData.name = data.name;
      if (data.icon !== undefined) dbData.icon = data.icon;
      if (data.progressType !== undefined) dbData.progress_type = data.progressType;
      if (data.target !== undefined) dbData.target = data.target;
      if (data.unit !== undefined) dbData.unit = data.unit;
      if (data.currentValue !== undefined) dbData.current_value = data.currentValue;
      if (data.sortOrder !== undefined) dbData.sort_order = data.sortOrder;
      await supabase.from('sub_tracks').update(dbData).eq('id', id);
      set((s) => ({
        subTracks: s.subTracks.map((t) => (t.id === id ? { ...t, ...data } : t)),
      }));
    } catch (err) {
      console.error('Failed to update sub track:', err);
    }
  },
  incrementSubTrack: async (id, value = 1) => {
    const track = get().subTracks.find((t) => t.id === id);
    if (!track) return;
    const newValue = track.currentValue + value;
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
    const existing = get().subTrackEntries.find((e) => e.trackId === id && e.date === today);
    if (existing) {
      try {
        await supabase.from('sub_track_entries').delete().eq('id', existing.id);
        set((s) => ({
          subTrackEntries: s.subTrackEntries.filter((e) => e.id !== existing.id),
        }));
      } catch (err) {
        console.error('Failed to toggle habit off:', err);
      }
    } else {
      const entryId = generateId();
      const track = get().subTracks.find((t) => t.id === id);
      try {
        await supabase.from('sub_track_entries').insert({ id: entryId, user_id: userId, track_id: id, value: 1, date: today, note: '' });
        await supabase.from('sub_tracks').update({ current_value: (track?.currentValue || 0) + 1 }).eq('id', id);
        set((s) => ({
          subTrackEntries: [...s.subTrackEntries, { id: entryId, trackId: id, value: 1, date: today, note: '' }],
          subTracks: s.subTracks.map((t) =>
            t.id === id ? { ...t, currentValue: t.currentValue + 1 } : t
          ),
        }));
      } catch (err) {
        console.error('Failed to toggle habit on:', err);
      }
    }
  },

  subTrackEntries: [],
  addSubTrackEntry: async (entry) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const id = entry.id || generateId();
    try {
      await supabase.from('sub_track_entries').insert({ id, user_id: userId, track_id: entry.trackId, value: entry.value, date: entry.date, note: entry.note });
      set((s) => ({ subTrackEntries: [...s.subTrackEntries, { ...entry, id }] }));
    } catch (err) {
      console.error('Failed to add sub track entry:', err);
    }
  },
  removeSubTrackEntry: async (id) => {
    try {
      await supabase.from('sub_track_entries').delete().eq('id', id);
      set((s) => ({ subTrackEntries: s.subTrackEntries.filter((e) => e.id !== id) }));
    } catch (err) {
      console.error('Failed to remove sub track entry:', err);
    }
  },
  getSubTrackEntryToday: (trackId) => {
    return get().subTrackEntries.find((e) => e.trackId === trackId && e.date === getToday());
  },

  bookmarkCategories: [],
  bookmarks: [],
  addBookmarkCategory: async (category) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const id = generateId();
    const { error } = await supabase
      .from('bookmark_categories')
      .insert({ id, user_id: userId, name: category.name, icon: category.icon });
    if (error) {
      console.error('Failed to add bookmark category:', error.message, error.details);
      return;
    }
    set((s) => ({ bookmarkCategories: [...s.bookmarkCategories, { ...category, id }] }));
  },
  removeBookmarkCategory: async (id) => {
    try {
      await supabase.from('bookmark_categories').delete().eq('id', id);
      set((s) => ({
        bookmarkCategories: s.bookmarkCategories.filter((c) => c.id !== id),
        bookmarks: s.bookmarks.filter((b) => b.categoryId !== id),
      }));
    } catch (err) {
      console.error('Failed to remove bookmark category:', err);
    }
  },
  addBookmark: async (bookmark) => {
    const userId = get().session?.user?.id;
    if (!userId) return;
    const id = generateId();
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        id,
        user_id: userId,
        category_id: bookmark.categoryId,
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description ?? '',
        created_at: Date.now(),
      });
    if (error) {
      console.error('Failed to add bookmark:', error.message, error.details);
      return;
    }
    set((s) => ({ bookmarks: [...s.bookmarks, { ...bookmark, id }] }));
  },
  removeBookmark: async (id) => {
    try {
      await supabase.from('bookmarks').delete().eq('id', id);
      set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) }));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  },
}));

async function seedDefaults() {
  const userId = useAppStore.getState().session?.user?.id;
  if (!userId) {
    console.log('[seedDefaults] No user ID, skipping');
    return;
  }

  console.log('[seedDefaults] Seeding default data for user:', userId);

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

    console.log('[seedDefaults] Inserted life_categories:', insertedCategories);

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

      console.log('[seed] About to insert sub_tracks:', tracksToInsert);
      console.log('[seed] Category ID map:', [...catIdMap.entries()]);

      const { data: insertedTracks, error: trackError } = await supabase.from('sub_tracks').insert(tracksToInsert).select();

      console.log('[seed] sub_tracks insert result:', insertedTracks, 'error:', trackError);

      if (trackError) {
        console.error('[seedDefaults] sub_tracks insert error:', trackError);
        return;
      }
    }

    console.log('[seedDefaults] Successfully seeded', categories.length, 'categories and', tracks.length, 'tracks');

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
  return { id: row.id as string, text: row.text as string, completed: row.completed as boolean, priority: row.priority as Priority, createdAt: typeof row.created_at === "number" ? row.created_at : new Date(row.created_at as string).getTime() || Date.now(), date: row.date as string };
}

function mapWeeklyTodo(row: Record<string, unknown>): WeeklyTodo {
  return { id: row.id as string, text: row.text as string, completed: row.completed as boolean, priority: row.priority as Priority, createdAt: typeof row.created_at === "number" ? row.created_at : new Date(row.created_at as string).getTime() || Date.now(), weekStart: row.week_start as string };
}

function mapBacklogTodo(row: Record<string, unknown>): BacklogTodo {
  return { id: row.id as string, text: row.text as string, completed: row.completed as boolean, priority: row.priority as Priority, createdAt: typeof row.created_at === "number" ? row.created_at : new Date(row.created_at as string).getTime() || Date.now() };
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
  return { id: row.id as string, name: row.name as string, icon: (row.icon as string) || 'general' };
}

function mapBookmark(row: Record<string, unknown>): Bookmark {
  return { id: row.id as string, categoryId: row.category_id as string, title: row.title as string, url: row.url as string, description: (row.description as string) || '' };
}

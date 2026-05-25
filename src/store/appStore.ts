import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

  dailyFocus: DailyFocus;
  setDailyFocus: (focus: DailyFocus) => void;
  clearDailyFocus: () => void;

  dailyTodos: DailyTodo[];
  addDailyTodo: (text: string, priority: Priority) => void;
  toggleDailyTodo: (id: string) => void;
  removeDailyTodo: (id: string) => void;

  weeklyTodos: WeeklyTodo[];
  addWeeklyTodo: (text: string, priority: Priority) => void;
  toggleWeeklyTodo: (id: string) => void;
  removeWeeklyTodo: (id: string) => void;

  backlogTodos: BacklogTodo[];
  addBacklogTodo: (text: string, priority: Priority) => void;
  toggleBacklogTodo: (id: string) => void;
  removeBacklogTodo: (id: string) => void;
  moveToDaily: (id: string) => void;
  moveToWeekly: (id: string) => void;

  lifeCategories: LifeCategory[];
  addLifeCategory: (cat: LifeCategory) => void;
  removeLifeCategory: (id: string) => void;
  updateLifeCategory: (id: string, data: Partial<LifeCategory>) => void;
  addPillar: (name: string, icon?: string, colorTheme?: string) => void;
  updatePillar: (id: string, newName: string) => void;
  deletePillar: (id: string) => void;

  subTracks: SubTrack[];
  addSubTrack: (track: SubTrack) => void;
  removeSubTrack: (id: string) => void;
  updateSubTrack: (id: string, data: Partial<SubTrack>) => void;
  incrementSubTrack: (id: string, value?: number) => void;
  decrementSubTrack: (id: string, value?: number) => void;
  toggleSubTrackHabit: (id: string) => void;

  subTrackEntries: SubTrackEntry[];
  addSubTrackEntry: (entry: SubTrackEntry) => void;
  removeSubTrackEntry: (id: string) => void;
  getSubTrackEntryToday: (trackId: string) => SubTrackEntry | undefined;

  bookmarkCategories: BookmarkCategory[];
  bookmarks: Bookmark[];
  addBookmarkCategory: (category: BookmarkCategory) => void;
  removeBookmarkCategory: (id: string) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
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
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
      theme: 'light',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      dailyFocus: { text: '', date: getToday() },
      setDailyFocus: (focus) => set({ dailyFocus: focus }),
      clearDailyFocus: () => set({ dailyFocus: { text: '', date: getToday() } }),

      dailyTodos: [],
      addDailyTodo: (text, priority) =>
        set((s) => ({
          dailyTodos: [
            ...s.dailyTodos,
            { id: generateId(), text, completed: false, priority, createdAt: Date.now(), date: getToday() },
          ],
        })),
      toggleDailyTodo: (id) =>
        set((s) => ({
          dailyTodos: s.dailyTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),
      removeDailyTodo: (id) =>
        set((s) => ({
          dailyTodos: s.dailyTodos.filter((t) => t.id !== id),
        })),

      weeklyTodos: [],
      addWeeklyTodo: (text, priority) =>
        set((s) => ({
          weeklyTodos: [
            ...s.weeklyTodos,
            { id: generateId(), text, completed: false, priority, createdAt: Date.now(), weekStart: getWeekStart() },
          ],
        })),
      toggleWeeklyTodo: (id) =>
        set((s) => ({
          weeklyTodos: s.weeklyTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),
      removeWeeklyTodo: (id) =>
        set((s) => ({
          weeklyTodos: s.weeklyTodos.filter((t) => t.id !== id),
        })),

      backlogTodos: [],
      addBacklogTodo: (text, priority) =>
        set((s) => ({
          backlogTodos: [
            ...s.backlogTodos,
            { id: generateId(), text, completed: false, priority, createdAt: Date.now() },
          ],
        })),
      toggleBacklogTodo: (id) =>
        set((s) => ({
          backlogTodos: s.backlogTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),
      removeBacklogTodo: (id) =>
        set((s) => ({
          backlogTodos: s.backlogTodos.filter((t) => t.id !== id),
        })),
      moveToDaily: (id) => {
        const t = get().backlogTodos.find((x) => x.id === id);
        if (t)
          set((s) => ({
            backlogTodos: s.backlogTodos.filter((x) => x.id !== id),
            dailyTodos: [
              ...s.dailyTodos,
              { ...t, id: generateId(), date: getToday(), completed: false },
            ],
          }));
      },
      moveToWeekly: (id) => {
        const t = get().backlogTodos.find((x) => x.id === id);
        if (t)
          set((s) => ({
            backlogTodos: s.backlogTodos.filter((x) => x.id !== id),
            weeklyTodos: [
              ...s.weeklyTodos,
              { ...t, id: generateId(), weekStart: getWeekStart(), completed: false },
            ],
          }));
      },

      lifeCategories: [
        { id: 'deen', name: 'ديني', nameKey: 'pillars.deen', icon: 'book-open', color: 'terracotta', sortOrder: 1 },
        { id: 'mind', name: 'عقلي', nameKey: 'pillars.mind', icon: 'brain', color: 'gold', sortOrder: 2 },
        { id: 'health', name: 'صحتي', nameKey: 'pillars.health', icon: 'heart', color: 'sage', sortOrder: 3 },
        { id: 'career', name: 'برمجتي', nameKey: 'pillars.career', icon: 'code', color: 'slate', sortOrder: 4 },
      ],
      addLifeCategory: (cat) =>
        set((s) => ({ lifeCategories: [...s.lifeCategories, cat] })),
      removeLifeCategory: (id) =>
        set((s) => {
          const trackIds = s.subTracks.filter((t) => t.categoryId === id).map((t) => t.id);
          return {
            lifeCategories: s.lifeCategories.filter((c) => c.id !== id),
            subTracks: s.subTracks.filter((t) => t.categoryId !== id),
            subTrackEntries: s.subTrackEntries.filter((e) => !trackIds.includes(e.trackId)),
          };
        }),
      updateLifeCategory: (id, data) =>
        set((s) => ({
          lifeCategories: s.lifeCategories.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      addPillar: (name, icon = 'heart', colorTheme = 'terracotta') =>
        set((s) => ({
          lifeCategories: [
            ...s.lifeCategories,
            {
              id: generateId(),
              name,
              nameKey: '',
              icon,
              color: colorTheme,
              sortOrder: s.lifeCategories.length + 1,
            },
          ],
        })),
      updatePillar: (id, newName) =>
        set((s) => ({
          lifeCategories: s.lifeCategories.map((c) =>
            c.id === id ? { ...c, name: newName } : c
          ),
        })),
      deletePillar: (id) =>
        set((s) => {
          const trackIds = s.subTracks.filter((t) => t.categoryId === id).map((t) => t.id);
          return {
            lifeCategories: s.lifeCategories.filter((c) => c.id !== id),
            subTracks: s.subTracks.filter((t) => t.categoryId !== id),
            subTrackEntries: s.subTrackEntries.filter((e) => !trackIds.includes(e.trackId)),
          };
        }),

      subTracks: [
        { id: 'quran-mem', categoryId: 'deen', name: 'القرآن', nameKey: 'subTracks.quran', icon: 'book-open', progressType: 'counter', target: 604, unit: 'pages', currentValue: 0, sortOrder: 1 },
        { id: 'riyadh', categoryId: 'deen', name: 'رياض الصالحين', nameKey: 'subTracks.riyadh', icon: 'bookmark', progressType: 'counter', target: 190, unit: 'pages', currentValue: 0, sortOrder: 2 },
        { id: 'aqeedah', categoryId: 'deen', name: 'العقيدة', nameKey: 'subTracks.aqeedah', icon: 'star', progressType: 'counter', target: 30, unit: 'lectures', currentValue: 0, sortOrder: 3 },
        { id: 'dsa', categoryId: 'career', name: 'Data Structures', nameKey: 'subTracks.dsa', icon: 'code', progressType: 'counter', target: 150, unit: 'videos', currentValue: 0, sortOrder: 1 },
        { id: 'node-project', categoryId: 'career', name: 'Node.js Project', nameKey: 'subTracks.nodeProject', icon: 'folder', progressType: 'counter', target: 60, unit: 'hours', currentValue: 0, sortOrder: 2 },
      ],
      addSubTrack: (track) =>
        set((s) => ({ subTracks: [...s.subTracks, track] })),
      removeSubTrack: (id) =>
        set((s) => ({
          subTracks: s.subTracks.filter((t) => t.id !== id),
          subTrackEntries: s.subTrackEntries.filter((e) => e.trackId !== id),
        })),
      updateSubTrack: (id, data) =>
        set((s) => ({
          subTracks: s.subTracks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
  incrementSubTrack: (id, value = 1) =>
    set((s) => ({
      subTracks: s.subTracks.map((t) =>
        t.id === id ? { ...t, currentValue: t.currentValue + value } : t
      ),
    })),
  decrementSubTrack: (id: string, value = 1) =>
    set((s) => ({
      subTracks: s.subTracks.map((t) =>
        t.id === id ? { ...t, currentValue: Math.max(0, t.currentValue - value) } : t
      ),
    })),
  toggleSubTrackHabit: (id) => {
        const today = getToday();
        const existing = get().subTrackEntries.find((e) => e.trackId === id && e.date === today);
        if (existing) {
          set((s) => ({
            subTrackEntries: s.subTrackEntries.filter((e) => e.id !== existing.id),
          }));
        } else {
          const entry: SubTrackEntry = { id: generateId(), trackId: id, value: 1, date: today, note: '' };
          set((s) => ({
            subTrackEntries: [...s.subTrackEntries, entry],
            subTracks: s.subTracks.map((t) =>
              t.id === id ? { ...t, currentValue: t.currentValue + 1 } : t
            ),
          }));
        }
      },

      subTrackEntries: [],
      addSubTrackEntry: (entry) =>
        set((s) => ({ subTrackEntries: [...s.subTrackEntries, entry] })),
      removeSubTrackEntry: (id) =>
        set((s) => ({
          subTrackEntries: s.subTrackEntries.filter((e) => e.id !== id),
        })),
      getSubTrackEntryToday: (trackId) => {
        return get().subTrackEntries.find((e) => e.trackId === trackId && e.date === getToday());
      },

      bookmarkCategories: [],
      bookmarks: [],
      addBookmarkCategory: (category) =>
        set((s) => ({ bookmarkCategories: [...s.bookmarkCategories, category] })),
      removeBookmarkCategory: (id) =>
        set((s) => ({
          bookmarkCategories: s.bookmarkCategories.filter((c) => c.id !== id),
          bookmarks: s.bookmarks.filter((b) => b.categoryId !== id),
        })),
      addBookmark: (bookmark) =>
        set((s) => ({ bookmarks: [...s.bookmarks, bookmark] })),
      removeBookmark: (id) =>
        set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) })),
    }),
    { name: 'khalil-app-storage' }
  )
);

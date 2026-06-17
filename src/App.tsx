import { useEffect, useRef, useState, useCallback } from 'react';
import { Plus, StickyNote as StickyNoteIcon, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';
import { useAppStore } from './store/appStore';
import { useTranslation } from './i18n/useTranslation';
import LoginPage from './components/Auth/LoginPage';
import DashboardLayout from './components/Layout/DashboardLayout';
import DailyFocus from './components/DailyFocus/DailyFocus';
import DailyTodo from './components/Todo/DailyTodo';
import WeeklyTodo from './components/Todo/WeeklyTodo';
import BacklogTodo from './components/Todo/BacklogTodo';

import LifePillars from './components/LifePillars/LifePillars';
import BookmarksVault from './components/Bookmarks/BookmarksVault';
import { createStickyNote } from './components/Canvas/StickyNote';
import { createTodoNote } from './components/Canvas/TodoNote';
import type { StickyNoteData } from './components/Canvas/StickyNote';
import type { TodoNoteData } from './components/Canvas/TodoNote';
import NotesPanel from './components/Layout/NotesPanel';

function App() {
  const language = useAppStore((s) => s.language);
  const theme = useAppStore((s) => s.theme);
  const session = useAppStore((s) => s.session);
  const isLoading = useAppStore((s) => s.isLoading);
  const setSession = useAppStore((s) => s.setSession);
  const loadUserData = useAppStore((s) => s.loadUserData);
  const { isRTL } = useTranslation();
  const [activeSection, setActiveSection] = useState('todo');
  const stickyNotes = useAppStore((s) => s.stickyNotes);
  const todoNotes = useAppStore((s) => s.todoNotes);
  const addStickyNoteStore = useAppStore((s) => s.addStickyNote);
  const updateStickyNoteStore = useAppStore((s) => s.updateStickyNote);
  const deleteStickyNoteStore = useAppStore((s) => s.deleteStickyNote);
  const addTodoNoteStore = useAppStore((s) => s.addTodoNote);
  const updateTodoNoteStore = useAppStore((s) => s.updateTodoNote);
  const deleteTodoNoteStore = useAppStore((s) => s.deleteTodoNote);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', onMouseDown);
      return () => document.removeEventListener('mousedown', onMouseDown);
    }
  }, [menuOpen]);

  const addStickyNote = useCallback(() => {
    const note = createStickyNote();
    addStickyNoteStore(note);
  }, [addStickyNoteStore]);

  const updateStickyNote = useCallback((id: string, data: Partial<StickyNoteData>) => {
    updateStickyNoteStore(id, data);
  }, [updateStickyNoteStore]);

  const deleteStickyNote = useCallback((id: string) => {
    deleteStickyNoteStore(id);
  }, [deleteStickyNoteStore]);

  const addTextNote = useCallback(() => {
    addStickyNote();
    setMenuOpen(false);
  }, [addStickyNote]);

  const addTodoNote = useCallback(() => {
    const note = createTodoNote();
    addTodoNoteStore(note);
    setMenuOpen(false);
  }, [addTodoNoteStore]);

  const updateTodoNote = useCallback((id: string, updated: Partial<TodoNoteData>) => {
    updateTodoNoteStore(id, updated);
  }, [updateTodoNoteStore]);

  const deleteTodoNote = useCallback((id: string) => {
    deleteTodoNoteStore(id);
  }, [deleteTodoNoteStore]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserData().finally(() => useAppStore.setState({ isLoading: false }));
      } else {
        useAppStore.setState({ isLoading: false });
      }
      initialized.current = true;
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!initialized.current) {
        initialized.current = true;
        return;
      }
      setSession(session);
      if (session) {
        loadUserData().finally(() => useAppStore.setState({ isLoading: false }));
      } else {
        useAppStore.setState({ isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-clay-soft border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-ink-light">Loading...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
      <div className="space-y-8 max-w-4xl mx-auto canvas-area" style={{ position: 'relative' }}>
        <div>
          <DailyFocus />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <DailyTodo />
          </div>
          <div className="lg:col-span-5">
            <WeeklyTodo />
          </div>
        </div>

        <div>
          <BacklogTodo />
        </div>

        <div>
          <LifePillars />
        </div>

        <BookmarksVault />
      </div>

      <NotesPanel
        stickyNotes={stickyNotes}
        todoNotes={todoNotes}
        onDeleteSticky={deleteStickyNote}
        onUpdateSticky={updateStickyNote}
        onDeleteTodo={deleteTodoNote}
        onUpdateTodo={updateTodoNote}
      />

      <div ref={menuRef} className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col gap-1"
            >
              <button
                onClick={addTodoNote}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border-subtle text-sm text-ink hover:bg-ink/5 transition-all shadow-sm whitespace-nowrap"
              >
                <ListTodo size={15} />
                <span>قائمة</span>
              </button>
              <button
                onClick={addTextNote}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border-subtle text-sm text-ink hover:bg-ink/5 transition-all shadow-sm whitespace-nowrap"
              >
                <StickyNoteIcon size={15} />
                <span>ملاحظة</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={`w-12 h-12 rounded-full bg-clay-soft hover:bg-clay-soft-dark text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
            menuOpen ? 'rotate-45' : ''
          }`}
          aria-label="Add note"
        >
          <Plus size={22} />
        </button>
      </div>
    </DashboardLayout>
  );
}

export default App;

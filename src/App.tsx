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

import LifePillars from './components/LifePillars/LifePillars';
import BookmarksVault from './components/Bookmarks/BookmarksVault';
import StickyNote, { createStickyNote, loadStickyNotes, saveStickyNotes } from './components/Canvas/StickyNote';
import TodoNote, { createTodoNote, loadTodoNotes, saveTodoNotes } from './components/Canvas/TodoNote';
import type { StickyNoteData } from './components/Canvas/StickyNote';
import type { TodoNoteData } from './components/Canvas/TodoNote';

function App() {
  const language = useAppStore((s) => s.language);
  const theme = useAppStore((s) => s.theme);
  const session = useAppStore((s) => s.session);
  const isLoading = useAppStore((s) => s.isLoading);
  const setSession = useAppStore((s) => s.setSession);
  const loadUserData = useAppStore((s) => s.loadUserData);
  const { isRTL } = useTranslation();
  const [activeSection, setActiveSection] = useState('focus');
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>(() => loadStickyNotes());
  const [todoNotes, setTodoNotes] = useState<TodoNoteData[]>(() => loadTodoNotes());
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
    setStickyNotes((prev) => {
      const next = [...prev, note];
      saveStickyNotes(next);
      return next;
    });
  }, []);

  const updateStickyNote = useCallback((id: string, text: string) => {
    setStickyNotes((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, text } : n));
      saveStickyNotes(next);
      return next;
    });
  }, []);

  const deleteStickyNote = useCallback((id: string) => {
    setStickyNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      localStorage.removeItem(`khalil-drag-sticky-${id}`);
      saveStickyNotes(next);
      return next;
    });
  }, []);

  const addTextNote = useCallback(() => {
    addStickyNote();
    setMenuOpen(false);
  }, [addStickyNote]);

  const addTodoNote = useCallback(() => {
    const note = createTodoNote();
    setTodoNotes((prev) => {
      const next = [...prev, note];
      saveTodoNotes(next);
      return next;
    });
    setMenuOpen(false);
  }, []);

  const updateTodoNote = useCallback((id: string, updated: Partial<TodoNoteData>) => {
    setTodoNotes((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, ...updated } : n));
      saveTodoNotes(next);
      return next;
    });
  }, []);

  const deleteTodoNote = useCallback((id: string) => {
    setTodoNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      localStorage.removeItem(`khalil-drag-todonote-${id}`);
      saveTodoNotes(next);
      return next;
    });
  }, []);

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <LifePillars />
          </div>
          <div className="lg:col-span-4">
            <WeeklyTodo />
          </div>
        </div>

        <div>
          <DailyFocus />
        </div>

        <div>
          <DailyTodo />
        </div>

        <BookmarksVault />

        {stickyNotes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onDelete={deleteStickyNote}
            onUpdate={updateStickyNote}
          />
        ))}
        {todoNotes.map((note) => (
          <TodoNote
            key={note.id}
            note={note}
            onDelete={deleteTodoNote}
            onUpdate={updateTodoNote}
          />
        ))}
      </div>

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

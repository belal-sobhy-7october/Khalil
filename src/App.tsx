import { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { Plus, StickyNote as StickyNoteIcon, ListTodo } from 'lucide-react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useInteractions,
} from '@floating-ui/react';
import { supabase } from './lib/supabase';
import { useAppStore } from './store/appStore';
import { useTranslation } from './i18n/useTranslation';
import LoginPage from './components/Auth/LoginPage';
import DashboardLayout from './components/Layout/DashboardLayout';
import DailyFocus from './components/DailyFocus/DailyFocus';
import DailyTodo from './components/Todo/DailyTodo';
import WeeklyTodo from './components/Todo/WeeklyTodo';
import BacklogTodo from './components/Todo/BacklogTodo';

import { createStickyNote } from './components/Canvas/StickyNote';
import { createTodoNote } from './components/Canvas/TodoNote';
import type { StickyNoteData, TodoNoteData } from './types';

const LifePillars = lazy(() => import('./components/LifePillars/LifePillars'));
const BookmarksVault = lazy(() => import('./components/Bookmarks/BookmarksVault'));
const NotesPanel = lazy(() => import('./components/Layout/NotesPanel'));

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
  const reorderStickyNotes = useAppStore((s) => s.reorderStickyNotes);
  const addTodoNoteStore = useAppStore((s) => s.addTodoNote);
  const updateTodoNoteStore = useAppStore((s) => s.updateTodoNote);
  const deleteTodoNoteStore = useAppStore((s) => s.deleteTodoNote);
  const reorderTodoNotes = useAppStore((s) => s.reorderTodoNotes);
  const [menuOpen, setMenuOpen] = useState(false);
  const initialized = useRef(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: isRTL ? 'left-start' : 'right-start',
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    open: menuOpen,
    onOpenChange: setMenuOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

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

  const handleReorderSticky = useCallback((ids: string[]) => {
    reorderStickyNotes(ids);
  }, [reorderStickyNotes]);

  const handleReorderTodo = useCallback((ids: string[]) => {
    reorderTodoNotes(ids);
  }, [reorderTodoNotes]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    let dataLoaded = false;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && !dataLoaded) {
        dataLoaded = true;
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
      if (session && !dataLoaded) {
        dataLoaded = true;
        loadUserData().finally(() => useAppStore.setState({ isLoading: false }));
      } else if (!session) {
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
    <>
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

          <Suspense fallback={<div className="h-32" />}>
            <LifePillars />
          </Suspense>

          <Suspense fallback={<div className="h-8" />}>
            <BookmarksVault />
          </Suspense>
        </div>
      </DashboardLayout>

      <Suspense fallback={null}>
        <NotesPanel
          stickyNotes={stickyNotes}
          todoNotes={todoNotes}
          onDeleteSticky={deleteStickyNote}
          onUpdateSticky={updateStickyNote}
          onReorderSticky={handleReorderSticky}
          onDeleteTodo={deleteTodoNote}
          onUpdateTodo={updateTodoNote}
          onReorderTodo={handleReorderTodo}
        />
      </Suspense>

      <div
        ref={refs.setFloating}
        style={{
          ...floatingStyles,
          pointerEvents: menuOpen ? 'auto' : 'none',
          willChange: 'transform',
        }}
        className="z-50 transition-opacity duration-150 ease-out"
        {...getFloatingProps()}
      >
        <div
          className={`flex flex-col gap-1 transition-all duration-150 ease-out ${
            menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
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
        </div>
      </div>

      <button
        ref={refs.setReference}
        className={`fixed bottom-6 end-6 z-50 w-12 h-12 rounded-full bg-clay-soft hover:bg-clay-soft-dark text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
          menuOpen ? 'rotate-45' : ''
        }`}
        aria-label="Add note"
        {...getReferenceProps()}
      >
        <Plus size={22} />
      </button>
    </>
  );
}

export default App;

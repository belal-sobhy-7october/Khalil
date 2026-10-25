import { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import type { Session } from '@supabase/supabase-js';
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
import { claimLocalData } from './lib/localOwner';
import { isOnline, readStoredSession } from './lib/offline';
import { useAppStore } from './store/appStore';
import { useTranslation } from './i18n/useTranslation';
import LoginPage from './components/Auth/LoginPage';
import DashboardLayout from './components/Layout/DashboardLayout';
import TasksPage from './components/Home/TasksPage';
import PomodoroEngine from './components/Focus/PomodoroEngine';
import FocusChip from './components/Focus/FocusChip';
import ReviewReminders from './components/Vocabulary/ReviewReminders';
import OfflineBanner from './components/Common/OfflineBanner';
import { HubCrumb } from './components/Learn/ui';
import SelectionWordMenu from './components/Vocabulary/SelectionWordMenu';
import { applyAppearance, useAppearance } from './lib/appearance';
import { getTasksSettings } from './lib/tasksSettings';

import { createStickyNote, createTodoNote } from './components/Canvas/noteFactories';
import type { StickyNoteData, TodoNoteData } from './types';

const BookmarksVault = lazy(() => import('./components/Bookmarks/BookmarksVault'));
const NotesPanel = lazy(() => import('./components/Layout/NotesPanel'));
const Calendar = lazy(() => import('./components/Calendar/Calendar'));
const EnglishHub = lazy(() => import('./components/English/EnglishHub'));
const CallCenterPrep = lazy(() => import('./components/CallCenter/CallCenterPrep'));
const SalesPrep = lazy(() => import('./components/Sales/SalesPrep'));
const LanguagesHub = lazy(() => import('./components/Learn/LanguagesHub'));
const SkillsHub = lazy(() => import('./components/Learn/SkillsHub'));
const FocusSection = lazy(() => import('./components/Focus/FocusSection'));
const AnalyticsSection = lazy(() => import('./components/Analytics/AnalyticsSection'));
const SettingsSection = lazy(() => import('./components/Settings/SettingsSection'));

const SECTION_KEY = 'khalil-active-section';

/** Old sections that are now parts of the tasks page. */
const PAGE_PARTS: Record<string, string> = { wird: 'todo', life: 'todo' };

/** The page a section id opens (the wird and the habits open the tasks page). */
function resolveSection(section: string): string {
  return PAGE_PARTS[section] ?? section;
}

/**
 * The page Khalil opens on: the tasks page, unless this browser tab was on
 * another page (a reload stays there) or the settings say "the last page".
 */
function initialSection(): string {
  if (typeof window === 'undefined') return 'todo';
  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem(SECTION_KEY) ?? (getTasksSettings().startup === 'last' ? localStorage.getItem(SECTION_KEY) : null);
  } catch {
    // storage blocked: open on the tasks page
  }
  // The learning path moved into the English hub.
  if (stored === 'path') {
    try {
      localStorage.setItem('khalil-english-tab', 'path');
    } catch {
      // storage blocked
    }
    return 'vocabulary';
  }
  return stored ? resolveSection(stored) : 'todo';
}

function rememberSection(section: string) {
  try {
    sessionStorage.setItem(SECTION_KEY, section);
    localStorage.setItem(SECTION_KEY, section);
  } catch {
    // storage blocked: the page just isn't remembered
  }
}

function App() {
  const language = useAppStore((s) => s.language);
  const theme = useAppStore((s) => s.theme);
  const session = useAppStore((s) => s.session);
  const isLoading = useAppStore((s) => s.isLoading);
  const setSession = useAppStore((s) => s.setSession);
  const loadUserData = useAppStore((s) => s.loadUserData);
  const { isRTL, t } = useTranslation();
  const [activeSection, setActiveSection] = useState(initialSection);
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
  const appError = useAppStore((s) => s.error);
  const clearAppError = useAppStore((s) => s.clearError);
  const [menuOpen, setMenuOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: isRTL ? 'left-start' : 'right-start',
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
    open: menuOpen,
    onOpenChange: setMenuOpen,
  });
  const { setReference, setFloating } = refs;

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
    if (appError) {
      const timer = setTimeout(() => clearAppError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [appError, clearAppError]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const appearanceId = useAppearance((a) => a.id);
  const loadAppearance = useAppearance((a) => a.load);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    applyAppearance(appearanceId, theme);
  }, [theme, appearanceId]);

  const sessionUserId = session?.user?.id;
  useEffect(() => {
    if (sessionUserId) void loadAppearance(sessionUserId);
  }, [sessionUserId, loadAppearance]);

  useEffect(() => {
    let dataLoaded = false;
    let sessionResolved = false;
    // Showing the session saved on this device while there is no internet.
    let usingStored = false;

    // Another account's local copy must not show or upload: clear it and start fresh.
    const switchedAccount = (session: Session | null) => {
      if (!session?.user?.id || !claimLocalData(session.user.id)) return false;
      window.location.reload();
      return true;
    };

    const loadData = () => {
      if (dataLoaded) return;
      // Nothing can be fetched offline; the data loads once the connection is back.
      if (!isOnline()) {
        useAppStore.setState({ isLoading: false });
        return;
      }
      dataLoaded = true;
      loadUserData().finally(() => {
        // Nothing came back (e.g. Wi-Fi with no internet): try again on the
        // next sign of a connection (a token refresh or the "online" event).
        if (useAppStore.getState().error) dataLoaded = false;
        useAppStore.setState({ isLoading: false });
      });
    };

    const showSession = (session: Session | null) => {
      if (switchedAccount(session)) return;
      setSession(session);
      if (session) loadData();
      else useAppStore.setState({ isLoading: false });
    };

    // With no internet, supabase-js retries refreshing an expired token for
    // ~30s and then reports no session, which would show the login page. The
    // session saved on this device still belongs to this user: open with it.
    const showStoredSession = () => {
      if (sessionResolved || usingStored) return;
      const stored = readStoredSession();
      if (!stored) return;
      usingStored = true;
      showSession(stored);
    };
    if (!isOnline()) showStoredSession();
    const slowTimer = setTimeout(showStoredSession, 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(slowTimer);
      sessionResolved = true;
      // A refresh that failed for lack of network keeps the saved session
      // (a rejected one is removed), so it is still signed in.
      const stored = session ? null : readStoredSession();
      if (stored) {
        if (!usingStored) {
          usingStored = true;
          showSession(stored);
        }
        return;
      }
      usingStored = false;
      showSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!sessionResolved) return;
      if (!session && usingStored && event !== 'SIGNED_OUT') return;
      if (session) usingStored = false;
      showSession(session);
    });

    // Back online: refreshing the saved session also loads the data.
    const onOnline = () => {
      void supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) return;
        usingStored = false;
        showSession(session);
      });
    };
    window.addEventListener('online', onOnline);

    return () => {
      clearTimeout(slowTimer);
      subscription.unsubscribe();
      window.removeEventListener('online', onOnline);
    };
  }, [loadUserData, setSession]);

  const handleSectionChange = useCallback((section: string) => {
    const target = resolveSection(section);
    setActiveSection(target);
    rememberSection(target);
    // The wird and the habits are parts of the tasks page: jump to them there.
    // Any other page opens at its top.
    window.setTimeout(() => {
      const anchor = section !== target ? document.getElementById(`section-${section}`) : null;
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0 });
    }, 50);
  }, []);

  // Other components (e.g. the account menu) can ask to open a section.
  useEffect(() => {
    const onNavigate = (e: Event) => handleSectionChange((e as CustomEvent<string>).detail);
    window.addEventListener('khalil:navigate', onNavigate);
    return () => window.removeEventListener('khalil:navigate', onNavigate);
  }, [handleSectionChange]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-clay-soft border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-ink-light">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <>
      <DashboardLayout
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        allowFullWidth={['calendar', 'bookmarks', 'languages', 'skills', 'vocabulary', 'callcenter', 'sales', 'focus', 'analytics', 'settings'].includes(activeSection)}
        notesSlot={
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
        }
      >
        {appError && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4">
            <div className="bg-red-500 text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
              <span className="flex-1">{t(appError)}</span>
              <button onClick={clearAppError} className="font-bold hover:opacity-70 shrink-0">&times;</button>
            </div>
          </div>
        )}
        <OfflineBanner />
        <SelectionWordMenu />
        {activeSection === 'calendar' ? (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-clay-soft border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-ink-light">{t('common.loading')}</span>
              </div>
            </div>
          }>
            <Calendar />
          </Suspense>
        ) : activeSection === 'bookmarks' ? (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-clay-soft border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-ink-light">{t('common.loading')}</span>
              </div>
            </div>
          }>
            <BookmarksVault />
          </Suspense>
        ) : ['focus', 'analytics', 'settings'].includes(activeSection) ? (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-clay-soft border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            {activeSection === 'focus' && <FocusSection />}
            {activeSection === 'analytics' && <AnalyticsSection onNavigate={handleSectionChange} />}
            {activeSection === 'settings' && <SettingsSection />}
          </Suspense>
        ) : ['languages', 'skills', 'callcenter', 'sales'].includes(activeSection) ? (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-clay-soft border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            {activeSection === 'languages' && <LanguagesHub onNavigate={handleSectionChange} />}
            {activeSection === 'skills' && <SkillsHub onNavigate={handleSectionChange} />}
            {(activeSection === 'callcenter' || activeSection === 'sales') && (
              <>
                <HubCrumb section={activeSection} onNavigate={handleSectionChange} />
                {activeSection === 'sales' ? <SalesPrep /> : <CallCenterPrep />}
              </>
            )}
          </Suspense>
        ) : activeSection === 'vocabulary' ? (
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-clay-soft border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-ink-light">{t('common.loading')}</span>
              </div>
            </div>
          }>
            <HubCrumb section="vocabulary" onNavigate={handleSectionChange} />
            <EnglishHub />
          </Suspense>
        ) : (
          <TasksPage />
        )}
      </DashboardLayout>

      <PomodoroEngine />
      <ReviewReminders />
      {activeSection !== 'focus' && <FocusChip onOpen={() => handleSectionChange('focus')} />}

      <div
        ref={setFloating}
        style={{
          ...floatingStyles,
          pointerEvents: menuOpen ? 'auto' : 'none',
          willChange: 'transform',
        }}
        className="z-30 transition-opacity duration-150 ease-out"
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
            <span>{t('notes.newList')}</span>
          </button>
          <button
            onClick={addTextNote}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border-subtle text-sm text-ink hover:bg-ink/5 transition-all shadow-sm whitespace-nowrap"
          >
            <StickyNoteIcon size={15} />
            <span>{t('notes.newNote')}</span>
          </button>
        </div>
      </div>

      <button
        ref={setReference}
        className={`fixed bottom-6 end-6 z-30 w-12 h-12 rounded-full bg-clay-soft hover:bg-clay-soft-dark text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
          menuOpen ? 'rotate-45' : ''
        }`}
        aria-label={t('notes.addMenu')}
        {...getReferenceProps()}
      >
        <Plus size={22} />
      </button>
    </>
  );
}

export default App;

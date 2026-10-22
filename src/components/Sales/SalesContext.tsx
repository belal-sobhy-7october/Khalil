/**
 * One copy of Sales Prep's saved state for every screen in the section, so
 * ticking a task in Today shows up at once in the roadmap and the notebook.
 */
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { newId } from '../../lib/callCenter/progress';
import {
  SALES_CALLS_KEY, SALES_KNOWLEDGE_KEY, SALES_NOTES_KEY, SALES_TASKS_KEY, SALES_TESTS_KEY, addAttempt, setTasks, type NoteLog, type QuizAttempt, type QuizLog,
  type ReadLog, type RoleplayScore, type TaskLog,
} from '../../lib/sales/progress';
import { useKv } from '../../lib/useKv';
import { getToday } from '../../store/dateHelpers';

interface SalesState {
  tasks: TaskLog;
  quizzes: QuizLog;
  notes: NoteLog;
  calls: RoleplayScore[];
  /** Knowledge chapters read. */
  knowledge: ReadLog;
  markChapter: (id: string, read: boolean) => void;
  markTasks: (ids: string[], done: boolean) => void;
  saveAttempt: (quizId: string, attempt: QuizAttempt) => void;
  /** Saves what you wrote under a key; an empty text removes it. */
  saveNote: (key: string, text: string) => void;
  saveCall: (roleplayId: string, percent: number) => void;
}

const Ctx = createContext<SalesState | null>(null);

export function SalesProvider({ children }: { children: ReactNode }) {
  const [tasks, setTaskLog] = useKv<TaskLog>(SALES_TASKS_KEY, {});
  const [quizzes, setQuizzes] = useKv<QuizLog>(SALES_TESTS_KEY, {});
  const [notes, setNotes] = useKv<NoteLog>(SALES_NOTES_KEY, {});
  const [calls, setCalls] = useKv<RoleplayScore[]>(SALES_CALLS_KEY, []);
  const [knowledge, setKnowledge] = useKv<ReadLog>(SALES_KNOWLEDGE_KEY, {});

  const markChapter = useCallback((id: string, read: boolean) => setKnowledge((log) => setTasks(log, [id], read, getToday())), [setKnowledge]);
  const markTasks = useCallback((ids: string[], done: boolean) => setTaskLog((log) => setTasks(log, ids, done, getToday())), [setTaskLog]);
  const saveAttempt = useCallback((quizId: string, attempt: QuizAttempt) => setQuizzes((log) => addAttempt(log, quizId, attempt)), [setQuizzes]);
  const saveNote = useCallback(
    (key: string, text: string) =>
      setNotes((all) => {
        if ((all[key]?.text ?? '') === text) return all;
        const next = { ...all };
        if (text.trim()) next[key] = { text, updatedAt: new Date().toISOString() };
        else delete next[key];
        return next;
      }),
    [setNotes]
  );
  const saveCall = useCallback(
    (roleplayId: string, percent: number) => setCalls((list) => [...list, { id: newId(), date: getToday(), roleplayId, percent }].slice(-300)),
    [setCalls]
  );

  const value = useMemo(
    () => ({ tasks, quizzes, notes, calls, knowledge, markChapter, markTasks, saveAttempt, saveNote, saveCall }),
    [tasks, quizzes, notes, calls, knowledge, markChapter, markTasks, saveAttempt, saveNote, saveCall]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- the hook belongs with its provider
export function useSales(): SalesState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSales outside SalesProvider');
  return ctx;
}

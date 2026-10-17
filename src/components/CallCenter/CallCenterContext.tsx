/**
 * One copy of Call Center Prep's saved state for every screen in the section,
 * so ticking a task in Today shows up at once in Roadmap and Tests.
 */
import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useKv } from '../../lib/useKv';
import { getToday } from '../../store/dateHelpers';
import {
  CC_ANSWERS_KEY, CC_APPLICATIONS_KEY, CC_CALLS_KEY, CC_MISTAKES_KEY, CC_SETTINGS_KEY, CC_TASKS_KEY, CC_TESTS_KEY, CC_TYPING_KEY,
  CC_VOICE_KEY, EMPTY_SETTINGS, addAttempt, newId, setTasks, type Application, type CallCenterSettings, type CallScore, type Mistake,
  type MyAnswer, type TaskLog, type TestAttempt, type TestLog, type TypingResult, type VoiceStat,
} from '../../lib/callCenter/progress';
import { CC_VOCAB_KEY, EMPTY_VOCAB_LOG, wordKey, type VocabLog } from '../../lib/callCenter/vocab';

type Setter<T> = (next: T | ((prev: T) => T)) => void;

interface CallCenterState {
  tasks: TaskLog;
  tests: TestLog;
  typing: TypingResult[];
  answers: Record<string, MyAnswer>;
  applications: Application[];
  mistakes: Mistake[];
  calls: CallScore[];
  voice: VoiceStat[];
  settings: CallCenterSettings;
  vocab: VocabLog;
  /** Notes that words were played on YouGlish. */
  markHeard: (words: string[]) => void;
  /** Starts the month-long word bank sprint (once). */
  startVocab: () => void;
  markTasks: (ids: string[], done: boolean) => void;
  saveAttempt: (testId: string, attempt: TestAttempt, wrong: Array<Omit<Mistake, 'id' | 'date'>>) => void;
  saveTyping: (result: Omit<TypingResult, 'date'>) => void;
  saveAnswer: (questionId: string, text: string) => void;
  saveCall: (scenarioId: string, percent: number) => void;
  saveVoice: (stat: Omit<VoiceStat, 'id' | 'date'>) => void;
  setApplications: Setter<Application[]>;
  setMistakes: Setter<Mistake[]>;
  setSettings: Setter<CallCenterSettings>;
}

const Ctx = createContext<CallCenterState | null>(null);

export function CallCenterProvider({ children }: { children: ReactNode }) {
  const [tasks, setTaskLog] = useKv<TaskLog>(CC_TASKS_KEY, {});
  const [tests, setTests] = useKv<TestLog>(CC_TESTS_KEY, {});
  const [typing, setTyping] = useKv<TypingResult[]>(CC_TYPING_KEY, []);
  const [answers, setAnswers] = useKv<Record<string, MyAnswer>>(CC_ANSWERS_KEY, {});
  const [applications, setApplications] = useKv<Application[]>(CC_APPLICATIONS_KEY, []);
  const [mistakes, setMistakes] = useKv<Mistake[]>(CC_MISTAKES_KEY, []);
  const [calls, setCalls] = useKv<CallScore[]>(CC_CALLS_KEY, []);
  const [voice, setVoice] = useKv<VoiceStat[]>(CC_VOICE_KEY, []);
  const [settings, setSettings] = useKv<CallCenterSettings>(CC_SETTINGS_KEY, EMPTY_SETTINGS);
  const [vocab, setVocab] = useKv<VocabLog>(CC_VOCAB_KEY, EMPTY_VOCAB_LOG);

  const markHeard = useCallback(
    (words: string[]) =>
      setVocab((log) => {
        const fresh = words.map(wordKey).filter((w) => !log.heard?.[w]);
        if (!fresh.length) return log;
        const today = getToday();
        return { ...log, heard: { ...log.heard, ...Object.fromEntries(fresh.map((w) => [w, today])) } };
      }),
    [setVocab]
  );
  const startVocab = useCallback(() => setVocab((log) => (log.startedAt ? log : { ...log, heard: log.heard ?? {}, startedAt: getToday() })), [setVocab]);

  const markTasks = useCallback((ids: string[], done: boolean) => setTaskLog((log) => setTasks(log, ids, done, getToday())), [setTaskLog]);

  const saveAttempt = useCallback(
    (testId: string, attempt: TestAttempt, wrong: Array<Omit<Mistake, 'id' | 'date'>>) => {
      setTests((log) => addAttempt(log, testId, attempt));
      if (!wrong.length) return;
      // Wrong answers go to the mistake log (once each), to review before the exams.
      setMistakes((list) => {
        const seen = new Set(list.map((m) => `${m.wrong}→${m.right}`));
        const added = wrong.filter((m) => !seen.has(`${m.wrong}→${m.right}`)).map((m) => ({ ...m, id: newId(), date: attempt.date }));
        return [...added, ...list].slice(0, 300);
      });
    },
    [setTests, setMistakes]
  );

  const saveTyping = useCallback(
    (result: Omit<TypingResult, 'date'>) => setTyping((list) => [...list, { ...result, date: getToday() }].slice(-200)),
    [setTyping]
  );

  const saveAnswer = useCallback(
    (questionId: string, text: string) => setAnswers((all) => ({ ...all, [questionId]: { text, updatedAt: new Date().toISOString() } })),
    [setAnswers]
  );

  const saveCall = useCallback(
    (scenarioId: string, percent: number) => setCalls((list) => [...list, { id: newId(), date: getToday(), scenarioId, percent }].slice(-200)),
    [setCalls]
  );

  const saveVoice = useCallback(
    (stat: Omit<VoiceStat, 'id' | 'date'>) => setVoice((list) => [...list, { ...stat, id: newId(), date: getToday() }].slice(-300)),
    [setVoice]
  );

  const value = useMemo(
    () => ({
      tasks, tests, typing, answers, applications, mistakes, calls, voice, settings, vocab, markHeard, startVocab,
      markTasks, saveAttempt, saveTyping, saveAnswer, saveCall, saveVoice, setApplications, setMistakes, setSettings,
    }),
    [tasks, tests, typing, answers, applications, mistakes, calls, voice, settings, vocab, markHeard, startVocab, markTasks, saveAttempt, saveTyping, saveAnswer, saveCall, saveVoice, setApplications, setMistakes, setSettings]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- the hook belongs with its provider
export function useCallCenter(): CallCenterState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCallCenter outside CallCenterProvider');
  return ctx;
}

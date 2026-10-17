import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AudioLines, BarChart3, Briefcase, CalendarCheck, ClipboardCheck, Flame, Headphones, Library, Map as MapIcon, Mic, SpellCheck, Timer, Wrench,
} from 'lucide-react';
import { LEVELS, PLAN_DAYS } from '../../data/callCenter';
import { CALL_CENTER_ACCENT_SECTION, CALL_CENTER_SECTION } from '../../data/callCenter/library';
import { currentDayIndex, daysLeft, minutesOn, passedTest, planProgress, studyStreak } from '../../lib/callCenter/progress';
import { vocabProgress } from '../../lib/callCenter/vocab';
import { useAppStore } from '../../store/appStore';
import { getToday } from '../../store/dateHelpers';
import CourseSection from '../English/CourseSection';
import { ProgressRing } from '../English/CourseVisuals';
import { CallCenterProvider, useCallCenter } from './CallCenterContext';
import InterviewView from './InterviewView';
import RoadmapView from './RoadmapView';
import TestRunner from './TestRunner';
import TestsView from './TestsView';
import TodayView from './TodayView';
import ToolkitView from './ToolkitView';
import TrackerView from './TrackerView';
import VocabView from './VocabView';
import { NewWordButton } from './activities/VocabActivity';
import VoiceStudioView from './VoiceStudioView';
import { ArabicNote } from './ui';

type Tab = 'today' | 'roadmap' | 'vocab' | 'interview' | 'voice' | 'tests' | 'tracker' | 'library' | 'toolkit' | 'accent';

const TABS: Array<{ id: Tab; label: string; icon: typeof Mic }> = [
  { id: 'today', label: 'Today', icon: CalendarCheck },
  { id: 'roadmap', label: 'Roadmap', icon: MapIcon },
  { id: 'vocab', label: 'Vocab', icon: SpellCheck },
  { id: 'interview', label: 'Interview', icon: Briefcase },
  { id: 'voice', label: 'Voice Studio', icon: Mic },
  { id: 'tests', label: 'Tests', icon: ClipboardCheck },
  { id: 'tracker', label: 'Job Tracker', icon: BarChart3 },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'toolkit', label: 'Toolkit', icon: Wrench },
  { id: 'accent', label: 'Accent (extra)', icon: AudioLines },
];

const TAB_KEY = 'khalil-cc-tab';

function readTab(): Tab {
  try {
    const v = localStorage.getItem(TAB_KEY);
    if (v && TABS.some((t) => t.id === v)) return v as Tab;
  } catch {
    // ignore
  }
  return 'today';
}

function Stat({ icon: Icon, value, label }: { icon: typeof Mic; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-card/70 px-3 py-2">
      <Icon size={16} className="text-clay-soft shrink-0" />
      <div className="min-w-0">
        <div className="text-sm font-bold text-ink tabular-nums leading-tight">{value}</div>
        <div className="text-[11px] text-ink-light leading-tight">{label}</div>
      </div>
    </div>
  );
}

function Prep() {
  const { tasks, tests, markTasks } = useCallCenter();
  const [tab, setTab] = useState<Tab>(readTab);
  // The day shown in Today: the first unfinished one, until you open another (or start a task).
  const [pinnedDay, setPinnedDay] = useState<number | null>(null);
  const [running, setRunning] = useState<{ testId: string; taskId?: string } | null>(null);

  const today = getToday();
  const currentIndex = currentDayIndex(tasks);
  const dayIndex = pinnedDay ?? currentIndex;
  const progress = useMemo(() => planProgress(LEVELS, tasks), [tasks]);
  const left = useMemo(() => daysLeft(tasks), [tasks]);
  const streak = studyStreak(tasks, today);
  const minutes = minutesOn(today, tasks);
  const where = PLAN_DAYS[currentIndex];
  const jobReady = passedTest(tests, 'L3-EXAM');
  const vocabItems = useAppStore((s) => s.vocabularyItems);
  const vocab = useMemo(() => vocabProgress(vocabItems), [vocabItems]);

  const choose = (next: Tab) => {
    setTab(next);
    setRunning(null);
    try {
      localStorage.setItem(TAB_KEY, next);
    } catch {
      // ignore
    }
  };
  const openDay = (index: number) => {
    setPinnedDay(index);
    choose('today');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5" dir="ltr" lang="en">
      <section className="relative overflow-hidden rounded-3xl border border-border-subtle bg-linear-to-br from-clay-soft/12 via-gold-soft/8 to-sage-soft/12 p-5 sm:p-6">
        <span aria-hidden="true" className="pointer-events-none absolute -top-24 -end-20 w-72 h-72 rounded-full bg-gold-soft/20 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="relative space-y-4">
          <div className="flex items-start gap-4">
            <ProgressRing ratio={progress.ratio} size={72} stroke={7} label="Plan progress">
              <span className="text-base font-bold text-ink tabular-nums">{Math.floor(progress.ratio * 100)}%</span>
            </ProgressRing>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-ink leading-tight">Call Center English Prep</h1>
              <p className="text-sm text-ink-light">From B1 to C1 and an English call center job in Egypt · tech support first, ready for any account</p>
              <p className="mt-1 text-xs text-clay-soft-dark font-medium">
                Now: Level {where.level.number} · {where.level.name}
                {where.week ? ` · Week ${where.week.number}` : ''}
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
              <Headphones size={28} className="hidden sm:block text-clay-soft/60" />
              <NewWordButton />
            </div>
          </div>
          <ArabicNote>من «اترفضت في الريكورد» لـ «overqualified». كل يوم خطوة، وكل خطوة متسجلة هنا. يلا بينا 💪</ArabicNote>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <Stat icon={Flame} value={`${streak} day${streak === 1 ? '' : 's'}`} label="Streak" />
            <Stat icon={Timer} value={`${minutes} min`} label="Studied today" />
            <Stat icon={CalendarCheck} value={jobReady ? 'Job-ready ✓' : `${left}`} label={jobReady ? 'Level 3 passed' : 'Study days to job-ready'} />
            <Stat icon={ClipboardCheck} value={`${progress.done} / ${progress.total}`} label="Tasks done" />
            <Stat icon={SpellCheck} value={`${Math.floor(vocab.ratio * 100)}%`} label="Words known · goal 90%" />
          </div>
        </motion.div>
      </section>

      <div className="flex gap-1 p-1 rounded-xl bg-ink/5 overflow-x-auto scrollbar-thin sm:flex-wrap sm:overflow-visible" role="tablist" aria-label="Call Center Prep">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => choose(id)}
            className={`flex-1 min-w-max flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id ? 'bg-card text-ink shadow-sm' : 'text-ink-light hover:text-ink'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {running ? (
        <TestRunner testId={running.testId} onClose={() => setRunning(null)} onFinish={() => running.taskId && markTasks([running.taskId], true)} />
      ) : (
        <>
          {tab === 'today' && (
            <TodayView
              key={dayIndex}
              dayIndex={dayIndex}
              currentIndex={currentIndex}
              onSelectDay={setPinnedDay}
              onRunTest={(testId, taskId) => setRunning({ testId, taskId })}
              onGoTab={choose}
            />
          )}
          {tab === 'roadmap' && <RoadmapView currentIndex={currentIndex} onOpenDay={openDay} onOpenVocab={() => choose('vocab')} />}
          {tab === 'vocab' && <VocabView onRunTest={(testId) => setRunning({ testId })} />}
          {tab === 'interview' && <InterviewView />}
          {tab === 'voice' && <VoiceStudioView />}
          {tab === 'tests' && <TestsView onRun={(testId) => setRunning({ testId })} />}
          {tab === 'tracker' && <TrackerView onGoTab={choose} />}
          {tab === 'library' && <CourseSection section={CALL_CENTER_SECTION} loopPlayer />}
          {tab === 'toolkit' && <ToolkitView level={where.level.id} />}
          {tab === 'accent' && (
            <div className="space-y-3">
              <div className="rounded-2xl border border-dashed border-border-subtle p-4 space-y-1">
                <p className="text-sm text-ink">
                  <span className="font-semibold">Extra, not part of the plan.</span> Ibrahim Adel's phonetics and American &amp; British accent course: watch it
                  whenever you like. Nothing here is a daily task or counts toward a level.
                </p>
                <ArabicNote>ده قسم إضافي للأكسنت، مش إجباري ومش داخل في المهام اليومية ولا في الليفلات. اتفرج عليه وقت ما تحب، وتقدمك فيه بيتحفظ.</ArabicNote>
              </div>
              <CourseSection section={CALL_CENTER_ACCENT_SECTION} loopPlayer />
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** Call Center Prep: the owner's private plan, from B1 to an English call center job. */
export default function CallCenterPrep() {
  return (
    <CallCenterProvider>
      <Prep />
    </CallCenterProvider>
  );
}

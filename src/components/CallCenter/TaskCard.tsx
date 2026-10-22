import { AnimatePresence, motion } from 'framer-motion';
import {
  AudioLines, BookOpen, Check, ChevronDown, ClipboardCheck, GraduationCap, Headphones, Keyboard, Link2, MessageSquare, Mic, MonitorPlay, PenLine, Repeat, SpellCheck, Users,
} from 'lucide-react';
import { getVoicePrompt } from '../../data/callCenter';
import { IBRAHIM_ADEL_CHANNEL, getGrammarLesson } from '../../data/callCenter/ibrahimAdel';
import type { LevelId, PlanTask, TaskKind } from '../../data/callCenter/types';
import { bestAttempt } from '../../lib/callCenter/progress';
import { TYPING_TARGETS, getTest } from '../../lib/callCenter/quiz';
import { taskTitle } from '../../lib/callCenter/tasks';
import { useCallCenter } from './CallCenterContext';
import GrammarActivity from './activities/GrammarActivity';
import PhrasesActivity from './activities/PhrasesActivity';
import RoleplayActivity from './activities/RoleplayActivity';
import ShadowActivity from './activities/ShadowActivity';
import { EfsetActivity, ReviewActivity } from './activities/SmallActivities';
import SoundActivity from './activities/SoundActivity';
import VocabActivity from './activities/VocabActivity';
import WatchActivity from './activities/WatchActivity';
import QuestionCard from './QuestionCard';
import type { TestInProgress } from './TestRunner';
import TypingTest from './TypingTest';
import VoiceRecorder from './VoiceRecorder';
import { DoneToggle, Pill, SpeakButton, primaryBtn } from './ui';

const KIND: Record<TaskKind, { label: string; icon: typeof Mic }> = {
  sound: { label: 'Sound of the day', icon: AudioLines },
  watch: { label: 'Watch', icon: MonitorPlay },
  phrases: { label: 'Phrases', icon: MessageSquare },
  grammar: { label: 'Grammar', icon: PenLine },
  shadow: { label: 'Shadow a call', icon: Repeat },
  roleplay: { label: 'Role-play with AI', icon: Users },
  interview: { label: 'Interview question', icon: Headphones },
  voice: { label: 'Voice note', icon: Mic },
  typing: { label: 'Typing', icon: Keyboard },
  test: { label: 'Test', icon: ClipboardCheck },
  review: { label: 'Review', icon: BookOpen },
  link: { label: 'Free test online', icon: Link2 },
  vocab: { label: 'Vocabulary', icon: SpellCheck },
  lesson: { label: 'Grammar course · Ibrahim Adel', icon: GraduationCap },
};

function VoiceTask({ promptId, onDone }: { promptId: string; onDone: () => void }) {
  const v = getVoicePrompt(promptId);
  if (!v) return null;
  return (
    <div className="space-y-3">
      <p className="text-sm text-ink">{v.prompt}</p>
      <ol className="list-decimal ps-5 text-sm text-ink-light space-y-0.5">
        {v.structure.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {v.sample && (
        <details>
          <summary className="cursor-pointer text-xs text-ink-light hover:text-ink">Listen to a model first</summary>
          <div className="mt-2 flex items-start gap-1 rounded-xl bg-sage-soft/8 border border-sage-soft/30 p-3">
            <p className="flex-1 text-sm text-ink leading-relaxed">{v.sample}</p>
            <SpeakButton text={v.sample} />
          </div>
        </details>
      )}
      <VoiceRecorder promptId={v.id} target={v.seconds} onTake={onDone} />
    </div>
  );
}

function TestTask({ testId, onRun }: { testId: string; onRun: () => void }) {
  const { tests, inProgress } = useCallCenter();
  const best = bestAttempt(tests[testId]);
  const test = getTest(testId);
  const half = inProgress[`test:${testId}`] as TestInProgress | undefined;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={onRun} className={primaryBtn}>
        {half ? `Continue: question ${half.index + 1} of ${half.count}` : best ? 'Take it again' : 'Start'}
      </button>
      {test && <span className="text-xs text-ink-light">{test.items.length} items{test.kind !== 'diagnostic' ? ` · pass mark ${test.pass}%` : ''}</span>}
      {best && <Pill tone={best.passed ? 'good' : 'neutral'}>Best: {best.percent}%</Pill>}
    </div>
  );
}

/** One task of the day: a header you tick, and the activity itself when opened. */
export default function TaskCard({ task, level, done, open, onToggleOpen, onRunTest, onGoTab }: {
  task: PlanTask;
  level: LevelId;
  done: boolean;
  open: boolean;
  onToggleOpen: () => void;
  onRunTest: (testId: string, taskId: string) => void;
  onGoTab: (tab: 'voice' | 'interview' | 'tests') => void;
}) {
  const { markTasks } = useCallCenter();
  const { label, icon: Icon } = KIND[task.kind];
  const markDone = () => {
    if (!done) markTasks([task.id], true);
  };

  const body = () => {
    switch (task.kind) {
      case 'sound':
        return <SoundActivity refId={task.ref} onDone={markDone} />;
      case 'watch':
        return <WatchActivity refId={task.ref} onDone={markDone} />;
      case 'phrases':
        return <PhrasesActivity refId={task.ref} onDone={markDone} progressKey={task.id} />;
      case 'grammar':
        return <GrammarActivity refId={task.ref} onDone={markDone} progressKey={task.id} />;
      case 'shadow':
        return <ShadowActivity refId={task.ref} onDone={markDone} progressKey={task.id} />;
      case 'roleplay':
        return <RoleplayActivity refId={task.ref} onDone={markDone} progressKey={task.id} />;
      case 'interview':
        return <QuestionCard questionId={task.ref} onDone={markDone} />;
      case 'voice':
        return <VoiceTask promptId={task.ref} onDone={markDone} />;
      case 'typing':
        return <TypingTest textId={task.ref} target={TYPING_TARGETS[level]} onResult={markDone} />;
      case 'test':
        return <TestTask testId={task.ref} onRun={() => onRunTest(task.ref, task.id)} />;
      case 'review':
        return <ReviewActivity refId={task.ref} onGoTab={onGoTab} />;
      case 'link':
        return <EfsetActivity onDone={markDone} />;
      case 'vocab':
        return <VocabActivity refId={task.ref} onDone={markDone} />;
      case 'lesson': {
        const lesson = getGrammarLesson(task.ref);
        return lesson ? <WatchActivity refId={task.ref} onDone={markDone} video={{ title: lesson.title, seconds: lesson.seconds, channel: IBRAHIM_ADEL_CHANNEL, arabic: true }} /> : null;
      }
    }
  };

  return (
    <div className={`rounded-2xl border transition-colors ${done ? 'border-sage-soft/40 bg-sage-soft/5' : 'border-border-subtle bg-card'}`}>
      <div className="flex items-center gap-3 p-3 sm:p-4">
        <button
          type="button"
          onClick={() => markTasks([task.id], !done)}
          aria-label={done ? 'Mark as not done' : 'Mark as done'}
          aria-pressed={done}
          className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
            done ? 'bg-sage-soft border-sage-soft text-white' : 'border-ink/20 text-transparent hover:border-sage-soft'
          }`}
        >
          <Check size={15} strokeWidth={3} />
        </button>
        <button type="button" onClick={onToggleOpen} aria-expanded={open} className="flex-1 min-w-0 flex items-center gap-3 text-start">
          <span className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${done ? 'bg-sage-soft/15 text-sage-soft-dark' : 'bg-clay-soft/10 text-clay-soft'}`}>
            <Icon size={17} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[11px] uppercase tracking-wide text-ink-light">
              {label} · {task.minutes} min
            </span>
            <span className={`block text-sm font-semibold leading-snug ${done ? 'text-ink-light' : 'text-ink'}`} dir="auto">
              {taskTitle(task)}
            </span>
            {task.note && <span className="block text-xs text-ink-light mt-0.5">{task.note}</span>}
          </span>
          <ChevronDown size={16} className={`shrink-0 text-ink-light transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-3 sm:px-4 pb-4 pt-1 space-y-4 border-t border-border-subtle">
              <div className="pt-3">{body()}</div>
              <DoneToggle done={done} onToggle={() => markTasks([task.id], !done)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Check, ChevronDown, ClipboardCheck, GraduationCap, Headphones, Library, Map as MapIcon, Mic, NotebookPen, PenLine, SpellCheck, Users } from 'lucide-react';
import type { Lang, SalesTask, SalesTaskKind } from '../../data/sales/types';
import { taskTitle } from '../../lib/sales/tasks';
import { KnowledgeTask } from './KnowledgeView';
import { useSales } from './SalesContext';
import LessonActivity from './activities/LessonActivity';
import ListenActivity from './activities/ListenActivity';
import { DrillActivity, JournalActivity, MissionActivity, ReviewActivity, WordsActivity } from './activities/PracticeActivities';
import QuizActivity from './activities/QuizActivity';
import RoleplayActivity from './activities/RoleplayActivity';
import SpeakActivity from './activities/SpeakActivity';
import { DoneToggle, LangBlock } from './ui';

const KIND: Record<SalesTaskKind, { ar: string; en: string; icon: typeof Mic }> = {
  lesson: { ar: 'درس', en: 'Lesson', icon: GraduationCap },
  listen: { ar: 'استمع وشاهد', en: 'Watch or listen', icon: Headphones },
  drill: { ar: 'تمرين كتابة', en: 'Writing drill', icon: PenLine },
  roleplay: { ar: 'تمثيل أدوار مع الذكاء الاصطناعي', en: 'Role-play with AI', icon: Users },
  mission: { ar: 'مهمة في الحياة', en: 'Real-life mission', icon: MapIcon },
  speak: { ar: 'قلها بصوت مرتفع', en: 'Say it out loud', icon: Mic },
  journal: { ar: 'الدفتر', en: 'Notebook', icon: NotebookPen },
  words: { ar: 'كلمات', en: 'Words', icon: SpellCheck },
  review: { ar: 'مراجعة', en: 'Review', icon: BookOpen },
  quiz: { ar: 'اختبار قصير', en: 'Quiz', icon: ClipboardCheck },
  knowledge: { ar: 'فصل معرفة', en: 'Knowledge', icon: Library },
};

/** One task of the day: a header you tick, and the activity itself when opened. */
export default function TaskCard({ task, lang, done, open, onToggleOpen }: {
  task: SalesTask;
  lang: Lang;
  done: boolean;
  open: boolean;
  onToggleOpen: () => void;
}) {
  const { markTasks } = useSales();
  const kind = KIND[task.kind];
  const Icon = kind.icon;
  const markDone = () => {
    if (!done) markTasks([task.id], true);
  };
  const props = { refId: task.ref, taskId: task.id, lang, onDone: markDone };

  const body = () => {
    switch (task.kind) {
      case 'lesson':
        return <LessonActivity {...props} />;
      case 'listen':
        return <ListenActivity {...props} />;
      case 'drill':
        return <DrillActivity {...props} />;
      case 'roleplay':
        return <RoleplayActivity {...props} />;
      case 'mission':
        return <MissionActivity {...props} />;
      case 'speak':
        return <SpeakActivity {...props} />;
      case 'journal':
        return <JournalActivity {...props} />;
      case 'words':
        return <WordsActivity refId={task.ref} onDone={markDone} />;
      case 'review':
        return <ReviewActivity {...props} />;
      case 'quiz':
        return <QuizActivity quizId={task.ref} onDone={markDone} />;
      case 'knowledge':
        return <KnowledgeTask chapterId={task.ref} onDone={markDone} />;
    }
  };

  return (
    <LangBlock lang={lang} className={`rounded-2xl border transition-colors ${done ? 'border-sage-soft/40 bg-sage-soft/5' : 'border-border-subtle bg-card'}`}>
      <div className="flex items-center gap-3 p-3 sm:p-4">
        <button
          type="button"
          onClick={() => markTasks([task.id], !done)}
          aria-label={done ? (lang === 'en' ? 'Mark as not done' : 'علّمها غير منجزة') : lang === 'en' ? 'Mark as done' : 'علّمها منجزة'}
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
            <span className="block text-[11px] tracking-wide text-ink-light">
              {kind[lang]} · {task.minutes} {lang === 'en' ? 'min' : 'دقيقة'}
            </span>
            <span className={`block text-sm font-semibold leading-snug ${done ? 'text-ink-light' : 'text-ink'}`}>{taskTitle(task, lang)}</span>
          </span>
          <ChevronDown size={16} className={`shrink-0 text-ink-light transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-3 sm:px-4 pb-4 pt-1 space-y-4 border-t border-border-subtle">
              <div className="pt-3">{body()}</div>
              <DoneToggle done={done} onToggle={() => markTasks([task.id], !done)} lang={lang} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LangBlock>
  );
}

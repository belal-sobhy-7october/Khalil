import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CalendarCheck, ClipboardCheck, Flame, Library, Map as MapIcon, NotebookPen, Smartphone, Timer, TrendingUp } from 'lucide-react';
import { ALL_CHAPTERS } from '../../data/sales/knowledge';
import { LEVELS, PLAN_DAYS } from '../../data/sales/plan';
import { currentDayIndex, daysDone, daysLeft, minutesOn, planProgress, studyStreak } from '../../lib/sales/progress';
import { getToday } from '../../store/dateHelpers';
import { ProgressRing } from '../English/CourseVisuals';
import ExtraView from './ExtraView';
import KnowledgeView from './KnowledgeView';
import LibraryView from './LibraryView';
import NotebookView from './NotebookView';
import RoadmapView from './RoadmapView';
import { SalesProvider, useSales } from './SalesContext';
import TodayView from './TodayView';
import { ArabicNote } from './ui';

type Tab = 'today' | 'knowledge' | 'roadmap' | 'notebook' | 'library' | 'extra';

const TABS: Array<{ id: Tab; label: string; icon: typeof Flame }> = [
  { id: 'today', label: 'النهارده', icon: CalendarCheck },
  { id: 'knowledge', label: 'المعرفة', icon: BookOpen },
  { id: 'roadmap', label: 'الخريطة', icon: MapIcon },
  { id: 'notebook', label: 'الدفتر والتقدم', icon: NotebookPen },
  { id: 'library', label: 'المكتبة', icon: Library },
  { id: 'extra', label: 'إضافي: الأجهزة', icon: Smartphone },
];

const TAB_KEY = 'khalil-sales-tab';

function readTab(): Tab {
  try {
    const v = localStorage.getItem(TAB_KEY);
    if (v && TABS.some((t) => t.id === v)) return v as Tab;
  } catch {
    // ignore
  }
  return 'today';
}

function Stat({ icon: Icon, value, label }: { icon: typeof Flame; value: string; label: string }) {
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
  const { tasks, knowledge } = useSales();
  const [tab, setTab] = useState<Tab>(readTab);
  // The day shown in Today: the first unfinished one, until you open another (or start a task).
  const [pinnedDay, setPinnedDay] = useState<number | null>(null);

  const today = getToday();
  const currentIndex = currentDayIndex(tasks);
  const dayIndex = pinnedDay ?? currentIndex;
  const progress = useMemo(() => planProgress(LEVELS, tasks), [tasks]);
  const where = PLAN_DAYS[currentIndex];

  const choose = (next: Tab) => {
    setTab(next);
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5" dir="rtl" lang="ar">
      <section className="relative overflow-hidden rounded-3xl border border-border-subtle bg-linear-to-br from-sage-soft/12 via-gold-soft/8 to-clay-soft/12 p-5 sm:p-6">
        <span aria-hidden="true" className="pointer-events-none absolute -top-24 -start-20 w-72 h-72 rounded-full bg-gold-soft/20 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="relative space-y-4">
          <div className="flex items-start gap-4">
            <ProgressRing ratio={progress.ratio} size={72} stroke={7} label="تقدم الخطة">
              <span className="text-base font-bold text-ink tabular-nums">{Math.floor(progress.ratio * 100)}%</span>
            </ProgressRing>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-ink leading-tight">تعلّم السيلز</h1>
              <p className="text-sm text-ink-light">سيلز وماركتينج وتفاوض من الصفر: معرفة تنفعك في أي شغل، بالعربي الأول وبعدين بالإنجليزي</p>
              <p className="mt-1 text-xs text-clay-soft-dark font-medium">
                دلوقتي: المستوى {where.level.number} · {where.level.name}
                {where.week ? ` · الأسبوع ${where.week.number}` : ''}
              </p>
            </div>
            <TrendingUp size={28} className="hidden sm:block shrink-0 text-clay-soft/60" />
          </div>
          <ArabicNote>مش محتاج تفكر في الخطة كلها. كل يوم افتح «النهارده»، خلّص مهامه (حوالي ساعة)، وسيب الباقي على الخريطة. 💪</ArabicNote>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <Stat icon={Flame} value={`${studyStreak(tasks, today)} يوم`} label="ورا بعض" />
            <Stat icon={Timer} value={`${minutesOn(today, tasks)} دقيقة`} label="النهارده" />
            <Stat icon={CalendarCheck} value={`${daysDone(tasks)} / ${daysDone(tasks) + daysLeft(tasks)}`} label="أيام خلصت" />
            <Stat icon={ClipboardCheck} value={`${progress.done} / ${progress.total}`} label="مهام خلصت" />
            <Stat icon={BookOpen} value={`${ALL_CHAPTERS.filter((c) => knowledge[c.id]).length} / ${ALL_CHAPTERS.length}`} label="فصول المعرفة" />
          </div>
        </motion.div>
      </section>

      <div className="flex gap-1 p-1 rounded-xl bg-ink/5 overflow-x-auto scrollbar-thin" role="tablist" aria-label="تعلّم السيلز">
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

      {tab === 'today' && <TodayView key={dayIndex} dayIndex={dayIndex} currentIndex={currentIndex} onSelectDay={setPinnedDay} />}
      {tab === 'knowledge' && <KnowledgeView />}
      {tab === 'roadmap' && <RoadmapView currentIndex={currentIndex} onOpenDay={openDay} />}
      {tab === 'notebook' && <NotebookView />}
      {tab === 'library' && <LibraryView />}
      {tab === 'extra' && <ExtraView />}
    </div>
  );
}

/** Sales Prep: the owner's private plan for learning sales, in Arabic first and then in English. */
export default function SalesPrep() {
  return (
    <SalesProvider>
      <Prep />
    </SalesProvider>
  );
}

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Flame, PartyPopper } from 'lucide-react';
import { PLAN_DAYS } from '../../data/sales/plan';
import { dayDone, dayRatio, minutesOn } from '../../lib/sales/progress';
import { getToday } from '../../store/dateHelpers';
import { ProgressBar } from '../English/CourseVisuals';
import { useSales } from './SalesContext';
import TaskCard from './TaskCard';
import { ArabicNote, Card, LangBlock, Pill } from './ui';
import { primaryBtn } from '../CallCenter/ui';

/** The day to study: only its tasks and its progress. The rest of the plan lives in the roadmap. */
export default function TodayView({ dayIndex, currentIndex, onSelectDay }: {
  dayIndex: number;
  /** The first unfinished day. */
  currentIndex: number;
  onSelectDay: (index: number) => void;
}) {
  const { tasks } = useSales();
  const { day, level, week } = PLAN_DAYS[dayIndex];
  const lang = week?.lang ?? level.lang;
  const [open, setOpen] = useState<string | null>(() => day.tasks.find((t) => !tasks[t.id])?.id ?? null);
  const done = dayDone(day, tasks);
  const ratio = dayRatio(day, tasks);
  const todayMinutes = useMemo(() => minutesOn(getToday(), tasks), [tasks]);
  const dayNumber = week ? Number(day.id.split('-D')[1]) : null;
  const totalDays = PLAN_DAYS.filter((d) => d.level.status === 'ready').length;
  const prev = dayIndex > 0 ? dayIndex - 1 : null;
  const next = dayIndex < PLAN_DAYS.length - 1 && PLAN_DAYS[dayIndex + 1].level.status === 'ready' ? dayIndex + 1 : null;
  const minutes = day.tasks.reduce((m, t) => m + t.minutes, 0);
  const left = day.tasks.filter((t) => !tasks[t.id]);

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-light">
              <span className="tabular-nums">
                اليوم {dayIndex + 1} من {totalDays}
              </span>
              <span>·</span>
              <span>
                المستوى {level.number}: {level.name}
              </span>
              {week && (
                <>
                  <span>·</span>
                  <span>الأسبوع {week.number}{dayNumber ? `، اليوم ${dayNumber}` : ''}</span>
                </>
              )}
              {dayIndex === currentIndex ? <Pill tone="accent">اليوم</Pill> : dayIndex < currentIndex ? <Pill tone="good">انتهى</Pill> : <Pill>قادم</Pill>}
            </div>
            <LangBlock lang={lang}>
              <h2 className="mt-1 text-xl font-bold text-ink">{day.title}</h2>
              {week && <p className="mt-0.5 text-sm text-ink-light">{week.title}</p>}
            </LangBlock>
          </div>
          <div className="flex gap-1 shrink-0">
            <button type="button" disabled={prev === null} onClick={() => prev !== null && onSelectDay(prev)} aria-label="اليوم السابق" className="p-2 rounded-lg hover:bg-ink/5 disabled:opacity-30">
              <ArrowRight size={16} />
            </button>
            <button type="button" disabled={next === null} onClick={() => next !== null && onSelectDay(next)} aria-label="اليوم التالي" className="p-2 rounded-lg hover:bg-ink/5 disabled:opacity-30">
              <ArrowLeft size={16} />
            </button>
          </div>
        </div>
        {week && <ArabicNote>{week.noteAr}</ArabicNote>}
        <div className="space-y-1">
          <ProgressBar ratio={ratio} label="تقدم اليوم" />
          <div className="flex justify-between text-xs text-ink-light tabular-nums">
            <span>
              {day.tasks.length - left.length} / {day.tasks.length} مهام · نحو {minutes} دقيقة
            </span>
            <span className="inline-flex items-center gap-1">
              <Flame size={12} /> {todayMinutes} دقيقة اليوم
            </span>
          </div>
        </div>
        {dayIndex !== currentIndex && (
          <button type="button" onClick={() => onSelectDay(currentIndex)} className="text-xs text-clay-soft hover:underline">
            عُد إلى يوم اليوم
          </button>
        )}
      </Card>

      {done && (
        <Card className="flex flex-col sm:flex-row sm:items-center gap-3 border-sage-soft/50 bg-sage-soft/8">
          <PartyPopper size={28} className="text-gold-soft shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-ink">انتهى اليوم! 🎉</div>
            <ArabicNote>أحسنت 💪 هذا يكفي اليوم. وإن بقيت لديك طاقة، فابدأ اليوم التالي، لكن لا تُنهك نفسك: يوم واحد كل يوم هو ما يصنع الفرق.</ArabicNote>
          </div>
          {next !== null && (
            <button type="button" onClick={() => onSelectDay(next)} className={primaryBtn}>
              ابدأ اليوم التالي <ArrowLeft size={13} />
            </button>
          )}
        </Card>
      )}

      {/* Working on a task keeps this day on screen even once it's finished (to see "Day complete"). */}
      <div className="space-y-2.5" onClickCapture={() => onSelectDay(dayIndex)}>
        {day.tasks.map((task) => (
          <TaskCard key={task.id} task={task} lang={lang} done={!!tasks[task.id]} open={open === task.id} onToggleOpen={() => setOpen(open === task.id ? null : task.id)} />
        ))}
      </div>

      {!done && next !== null && (
        <p className="text-xs text-ink-light text-center">
          غدًا: <span lang={PLAN_DAYS[next].week?.lang ?? PLAN_DAYS[next].level.lang} dir="auto">{PLAN_DAYS[next].day.title}</span>
        </p>
      )}
    </div>
  );
}

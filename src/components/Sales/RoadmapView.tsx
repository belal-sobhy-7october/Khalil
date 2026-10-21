import { useState } from 'react';
import { CheckCircle2, ChevronDown, Circle, Lock } from 'lucide-react';
import { LEVELS, PLAN_DAYS } from '../../data/sales/plan';
import type { SalesLevel } from '../../data/sales/types';
import { bestAttempt, bestRoleplay, dayDone, levelProgress, passedQuiz, weekProgress } from '../../lib/sales/progress';
import { ProgressBar, ProgressRing } from '../English/CourseVisuals';
import { useSales } from './SalesContext';
import { ArabicNote, Card, LangBlock, Pill } from './ui';

/** Each level's exit criteria, checked against what's saved. */
function useExitChecks(level: SalesLevel): Array<{ text: string; ok: boolean | null }> {
  const { tasks, quizzes, calls } = useSales();
  const exam = level.examId ? bestAttempt(quizzes[level.examId]) : null;
  const examDay = level.extraDays.find((d) => d.id === level.examId);
  const examRoleplay = examDay?.tasks.find((t) => t.kind === 'roleplay')?.ref;
  const missions = level.weeks.flatMap((w) => w.days.flatMap((d) => d.tasks.filter((t) => t.kind === 'mission')));
  const words = level.weeks.flatMap((w) => w.days.flatMap((d) => d.tasks.filter((t) => t.kind === 'words')));
  const bestLabel = level.lang === 'en' ? 'best' : 'أحسن نتيجة';
  return level.exit.map((text, i) => {
    if (level.id === 'S0') return { text, ok: !!quizzes['S0-DIAG']?.length };
    if (i === 0) return { text: exam ? `${text} · ${bestLabel} ${exam.percent}%` : text, ok: !!exam?.passed };
    if (i === 1 && examRoleplay) {
      const best = bestRoleplay(calls, examRoleplay);
      return { text: best !== null ? `${text} · ${bestLabel} ${best}%` : text, ok: best !== null && best >= 80 };
    }
    if (i === 2) {
      const n = missions.filter((t) => tasks[t.id]).length;
      return { text: `${text} · ${n} / ${missions.length}`, ok: missions.length > 0 && n === missions.length };
    }
    if (i === 3 && words.length) {
      const n = words.filter((t) => tasks[t.id]).length;
      return { text: `${text} · ${n} / ${words.length}`, ok: n === words.length };
    }
    return { text, ok: null };
  });
}

function LevelCard({ level, onOpenDay, defaultOpen }: { level: SalesLevel; onOpenDay: (index: number) => void; defaultOpen: boolean }) {
  const { tasks, quizzes } = useSales();
  const [open, setOpen] = useState(defaultOpen);
  const progress = levelProgress(level, tasks);
  const checks = useExitChecks(level);
  const previous = LEVELS[level.number - 1];
  const locked = level.status === 'ready' && previous?.examId && !passedQuiz(quizzes, previous.examId);
  const planned = level.status === 'planned';
  const dayIndex = (id: string) => PLAN_DAYS.findIndex((d) => d.day.id === id);

  return (
    <Card>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center gap-4 text-start">
        <ProgressRing ratio={planned ? 0 : progress.ratio} size={56} stroke={5}>
          <span className="text-sm font-bold text-ink tabular-nums">{planned ? level.number : `${Math.floor(progress.ratio * 100)}%`}</span>
        </ProgressRing>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-ink-light">المستوى {level.number}</span>
            <Pill tone="accent">{level.lang === 'en' ? 'بالإنجليزي' : 'بالعربي'}</Pill>
            {planned && <Pill>بعدين</Pill>}
            {locked && (
              <Pill>
                <Lock size={10} /> عدّي امتحان المستوى {previous.number} الأول
              </Pill>
            )}
          </div>
          <LangBlock lang={level.lang}>
            <div className="text-lg font-bold text-ink">{level.name}</div>
            <p className="text-sm text-ink-light">{level.goal}</p>
          </LangBlock>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-ink-light transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <div className="text-xs font-semibold text-ink mb-1.5">عشان تعدي المستوى</div>
            <ul className="space-y-1">
              {checks.map((c) => (
                <li key={c.text} className="flex items-start gap-2 text-sm text-ink">
                  {c.ok ? <CheckCircle2 size={16} className="shrink-0 mt-px text-sage-soft" /> : <Circle size={16} className="shrink-0 mt-px text-ink-lighter" />}
                  <LangBlock lang={level.lang}>{c.text}</LangBlock>
                </li>
              ))}
            </ul>
          </div>

          {planned && level.outline && (
            <div className="space-y-2">
              <ArabicNote>ده المستوى اللي بعد الخطة: لما تخلص المستوى 3 (أو تبدأ شغل)، اختار مسار وقول لـ Claude «ابدأ المستوى 4» وهيبنيه زي اللي قبله.</ArabicNote>
              <ol className="space-y-1.5">
                {level.outline.map((w) => (
                  <li key={w.title} className="text-sm">
                    <span className="font-medium text-ink">{w.title}</span>
                    <span className="text-ink-light"> · {w.focus}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {level.weeks.map((w) => {
            const wp = weekProgress(w, tasks);
            const quiz = bestAttempt(quizzes[w.quizId]);
            return (
              <div key={w.id} className="rounded-xl border border-border-subtle p-3 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-ink-light">الأسبوع {w.number}</span>
                  <LangBlock lang={w.lang} className="text-sm font-semibold text-ink">
                    {w.title}
                  </LangBlock>
                  {quiz && <Pill tone={quiz.passed ? 'good' : 'neutral'}>الكويز {quiz.percent}%</Pill>}
                </div>
                <LangBlock lang={w.lang}>
                  <p className="text-xs text-ink-light">{w.goal}</p>
                </LangBlock>
                <ProgressBar ratio={wp.ratio} size="sm" label={w.title} />
                <div className="flex flex-wrap gap-1.5">
                  {w.days.map((d, i) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => onOpenDay(dayIndex(d.id))}
                      title={d.title}
                      className={`px-2.5 py-1 rounded-lg text-xs tabular-nums border transition-colors ${
                        dayDone(d, tasks) ? 'border-sage-soft bg-sage-soft/15 text-sage-soft-dark' : 'border-border-subtle text-ink-light hover:border-clay-soft hover:text-ink'
                      }`}
                    >
                      {i === 5 ? 'كويز' : `يوم ${i + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {level.extraDays.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onOpenDay(dayIndex(d.id))}
              className={`w-full flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm text-start ${
                dayDone(d, tasks) ? 'border-sage-soft/50 bg-sage-soft/8' : 'border-border-subtle hover:border-clay-soft'
              }`}
            >
              <LangBlock lang={level.lang} className="font-medium text-ink">
                {d.title}
              </LangBlock>
              {dayDone(d, tasks) ? <CheckCircle2 size={16} className="text-sage-soft" /> : <span className="text-xs text-ink-light">افتح</span>}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

/** All levels: where you are, what's left, and what each level needs to pass. */
export default function RoadmapView({ currentIndex, onOpenDay }: { currentIndex: number; onOpenDay: (index: number) => void }) {
  const currentLevel = PLAN_DAYS[currentIndex]?.level.id;
  return (
    <div className="space-y-3">
      <ArabicNote>
        الخطة كلها هنا لو حبيت تبص، بس مش محتاج تشيل همها: افتح «النهارده» وخلاص. المستوى 1 أساسيات بالعربي، 2 السوق والشغلانة بالعربي، 3 نفس المهارات بالإنجليزي. كل أسبوع آخره كويز، وكل مستوى آخره امتحان ورول بلاي كامل.
      </ArabicNote>
      {LEVELS.map((level) => (
        <LevelCard key={level.id} level={level} onOpenDay={onOpenDay} defaultOpen={level.id === currentLevel} />
      ))}
    </div>
  );
}

import { useMemo } from 'react';
import { ALL_CHAPTERS } from '../../data/sales/knowledge';
import { PLAN_DAYS, getDrill, getListen, getMission, getRoleplay } from '../../data/sales/plan';
import { JOURNAL_PROMPTS } from '../../data/sales/start';
import type { SalesTask } from '../../data/sales/types';
import { bestAttempt, minutesOn } from '../../lib/sales/progress';
import { quizTitle } from '../../lib/sales/quiz';
import { addDaysToDateString, getToday } from '../../store/dateHelpers';
import { useSales } from './SalesContext';
import { ArabicNote, Card, LangBlock, Pill } from './ui';

/** What a note was written for: the question, the drill item or the notebook prompt. */
function noteLabel(task: SalesTask, part: number | null, lang: 'ar' | 'en'): string {
  switch (task.kind) {
    case 'listen':
      return getListen(task.ref)?.questions[part ?? 0] ?? '';
    case 'drill':
      return getDrill(task.ref)?.items[part ?? 0]?.prompt ?? '';
    case 'mission':
      return getMission(task.ref)?.reflect[part ?? 0] ?? '';
    case 'journal': {
      if (task.ref === 'start') return 'ليه عاوز تتعلم سيلز؟';
      if (task.ref === 'exam') return lang === 'en' ? 'End of the level' : 'آخر المستوى';
      return JOURNAL_PROMPTS[lang][(Number(task.ref.slice(1)) - 1) % 5];
    }
    default:
      return '';
  }
}

/** The notebook and the numbers: minutes per day, quizzes, role-plays, and everything you wrote. */
export default function NotebookView() {
  const { tasks, quizzes, calls, notes } = useSales();
  const today = getToday();
  const days = useMemo(
    () => Array.from({ length: 14 }, (_, i) => addDaysToDateString(today, i - 13)).map((d) => ({ date: d, minutes: minutesOn(d, tasks) })),
    [today, tasks]
  );
  const maxMinutes = Math.max(30, ...days.map((d) => d.minutes));
  const quizRows = Object.keys(quizzes)
    .map((id) => ({ id, best: bestAttempt(quizzes[id]), tries: quizzes[id].length }))
    .filter((r) => r.best);
  const callRows = [...calls].reverse().slice(0, 12);

  // Notes by day, in plan order: the notebook line first, then answers to questions.
  const written = useMemo(
    () =>
      PLAN_DAYS.map(({ day, level, week }) => {
        const lang = week?.lang ?? level.lang;
        const entries = day.tasks.flatMap((task) =>
          Object.keys(notes)
            .filter((k) => k === task.id || k.startsWith(`${task.id}#`))
            .map((k) => {
              const part = k.includes('#') ? Number(k.split('#')[1]) : null;
              return { key: k, kind: task.kind, label: noteLabel(task, part, lang), text: notes[k].text };
            })
        );
        entries.sort((a, b) => Number(b.kind === 'journal') - Number(a.kind === 'journal'));
        return { day, lang, entries };
      }).filter((d) => d.entries.length),
    [notes]
  );

  const fromKnowledge = ALL_CHAPTERS.filter((c) => notes[`knowledge:${c.id}`]?.text.trim()).map((c) => ({
    id: c.id,
    chapter: c,
    text: notes[`knowledge:${c.id}`].text,
  }));

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <h3 className="font-semibold text-ink">آخر أسبوعين</h3>
        <div className="flex items-end gap-1 h-24" role="img" aria-label="دقايق المذاكرة كل يوم في آخر أسبوعين">
          {days.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center justify-end gap-1 h-full" title={`${d.date}: ${d.minutes} دقيقة`}>
              <div className={`w-full rounded-t ${d.date === today ? 'bg-clay-soft' : 'bg-sage-soft/70'}`} style={{ height: `${Math.max(d.minutes ? 6 : 2, (d.minutes / maxMinutes) * 100)}%` }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-ink-light tabular-nums">
          <span>{days[0].date.slice(5)}</span>
          <span>النهارده</span>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="space-y-2">
          <h3 className="font-semibold text-ink">الكويزات والامتحانات</h3>
          {quizRows.length ? (
            <ul className="space-y-1.5">
              {quizRows.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-ink truncate" dir="auto">
                    {quizTitle(r.id)}
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] text-ink-light">{r.tries}×</span>
                    <Pill tone={r.best!.passed ? 'good' : 'neutral'}>{r.best!.percent}%</Pill>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ArabicNote>لسه مفيش. أول كويز في أول يوم.</ArabicNote>
          )}
        </Card>
        <Card className="space-y-2">
          <h3 className="font-semibold text-ink">الرول بلاي</h3>
          {callRows.length ? (
            <ul className="space-y-1.5">
              {callRows.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-ink truncate" dir="auto">
                    {getRoleplay(c.roleplayId)?.title ?? c.roleplayId}
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] text-ink-light tabular-nums">{c.date.slice(5)}</span>
                    <Pill tone={c.percent >= 80 ? 'good' : 'neutral'}>{c.percent}%</Pill>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ArabicNote>لسه مفيش. أول رول بلاي في تاني يوم من الأسبوع الأول.</ArabicNote>
          )}
        </Card>
      </div>

      <Card className="space-y-3">
        <h3 className="font-semibold text-ink">دفترك</h3>
        <ArabicNote>كل اللي كتبته في الخطة: سطور الدفتر، إجاباتك على الأسئلة، والتمارين. ارجعله قبل أي انترفيو.</ArabicNote>
        {written.length === 0 && !fromKnowledge.length && <ArabicNote>لسه فاضي. أول سطر في أول يوم.</ArabicNote>}
        {fromKnowledge.length > 0 && (
          <div className="rounded-xl border border-border-subtle p-3 space-y-2">
            <div className="text-sm font-semibold text-ink">من المعرفة</div>
            {fromKnowledge.map((k) => (
              <div key={k.id} className="space-y-0.5">
                <div className="text-xs text-ink-light">
                  {k.chapter.title}: {k.chapter.tryIt}
                </div>
                <p className="text-sm text-ink whitespace-pre-line" dir="auto">
                  {k.text}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="space-y-3">
          {[...written].reverse().map(({ day, lang, entries }) => (
            <LangBlock key={day.id} lang={lang} className="rounded-xl border border-border-subtle p-3 space-y-2">
              <div className="text-sm font-semibold text-ink">{day.title}</div>
              {entries.map((e) => (
                <div key={e.key} className="space-y-0.5">
                  {e.label && <div className="text-xs text-ink-light">{e.label}</div>}
                  <p className="text-sm text-ink whitespace-pre-line" dir="auto">
                    {e.text}
                  </p>
                </div>
              ))}
            </LangBlock>
          ))}
        </div>
      </Card>
    </div>
  );
}

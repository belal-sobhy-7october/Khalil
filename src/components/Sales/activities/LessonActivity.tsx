import { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { getLesson } from '../../../data/sales/plan';
import type { Lang, SalesChoice } from '../../../data/sales/types';
import { lessonPracticePrompt } from '../../../lib/sales/prompts';
import { AiButtons, SpeakButton } from '../ui';
import { pick } from '../../../lib/sales/text';

/** One question you answer by tapping an option: right or wrong shows at once, with the reason. */
export function CheckQuestion({ choice, onAnswer }: { choice: SalesChoice; onAnswer?: (right: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-ink">{choice.q}</p>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {choice.options.map((o, i) => {
          const shown = picked !== null;
          const tone = !shown
            ? 'border-border-subtle hover:border-clay-soft'
            : i === choice.answer
              ? 'border-sage-soft bg-sage-soft/10'
              : i === picked
                ? 'border-red-400 bg-red-500/5'
                : 'border-border-subtle opacity-60';
          return (
            <button
              key={o}
              type="button"
              disabled={shown}
              onClick={() => {
                setPicked(i);
                onAnswer?.(i === choice.answer);
              }}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm text-start text-ink transition-colors ${tone}`}
            >
              {shown && i === choice.answer && <CheckCircle2 size={15} className="shrink-0 text-sage-soft" />}
              {shown && i === picked && i !== choice.answer && <XCircle size={15} className="shrink-0 text-red-500" />}
              {o}
            </button>
          );
        })}
      </div>
      {picked !== null && choice.why && <p className="text-xs text-ink-light">{choice.why}</p>}
    </div>
  );
}

/** A lesson: the idea, its points, an example, the usual mistakes and a check. */
export default function LessonActivity({ refId, lang, onDone }: { refId: string; lang: Lang; onDone: () => void }) {
  const lesson = getLesson(refId);
  const [answered, setAnswered] = useState(0);
  if (!lesson) return null;
  const answer = () => {
    const next = answered + 1;
    setAnswered(next);
    if (next === lesson.check.length) onDone();
  };
  return (
    <div className="space-y-4">
      <p className="text-base font-semibold text-ink leading-relaxed">{lesson.summary}</p>
      {lesson.noteAr && (
        <p dir="rtl" lang="ar" className="text-sm text-ink-light">
          {lesson.noteAr}
        </p>
      )}
      <ol className="space-y-2.5">
        {lesson.points.map((p) => (
          <li key={p.title} className="rounded-xl bg-ink/3 px-3 py-2.5">
            <div className="text-sm font-semibold text-ink">{p.title}</div>
            <p className="text-sm text-ink leading-relaxed">{p.text}</p>
          </li>
        ))}
      </ol>
      {lesson.example && (
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-ink-light">{pick(lang, 'مثال', 'Example')}</div>
          <div className="space-y-1.5 rounded-xl border border-border-subtle p-3">
            {lesson.example.map((line, i) => (
              <div key={i} className={`flex items-start gap-2 ${line.who === 'seller' ? '' : 'opacity-90'}`}>
                <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${line.who === 'seller' ? 'bg-clay-soft/15 text-clay-soft-dark' : 'bg-ink/5 text-ink-light'}`}>
                  {line.who === 'seller' ? pick(lang, 'أنت', 'You') : pick(lang, 'العميل', 'Customer')}
                </span>
                <p className="flex-1 text-sm text-ink leading-relaxed">{line.text}</p>
                {lang === 'en' && <SpeakButton text={line.text} compact />}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-light">
          <AlertTriangle size={13} /> {pick(lang, 'أخطاء المبتدئين', 'Beginner mistakes')}
        </div>
        <ul className="list-disc ps-5 text-sm text-ink space-y-0.5">
          {lesson.mistakes.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-3 rounded-xl border border-dashed border-border-subtle p-3">
        <div className="text-xs font-semibold text-ink-light">{pick(lang, 'تأكد أنك فهمت', 'Check you got it')}</div>
        {lesson.check.map((c) => (
          <CheckQuestion key={c.q} choice={c} onAnswer={answer} />
        ))}
      </div>
      <details>
        <summary className="cursor-pointer py-1 text-xs text-ink-light hover:text-ink">{pick(lang, 'تدرّب على هذا الدرس مع الذكاء الاصطناعي (اختياري)', 'Practice this lesson with an AI (optional)')}</summary>
        <div className="mt-2">
          <AiButtons prompt={lessonPracticePrompt(lesson.title, lesson.summary, lang)} lang={lang} />
        </div>
      </details>
    </div>
  );
}

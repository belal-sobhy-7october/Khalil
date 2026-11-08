import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { bestAttempt } from '../../../lib/sales/progress';
import { buildQuiz } from '../../../lib/sales/quiz';
import { getToday } from '../../../store/dateHelpers';
import { useSales } from '../SalesContext';
import { LangBlock, Pill } from '../ui';
import { primaryBtn, secondaryBtn } from '../../CallCenter/ui';
import { pick } from '../../../lib/sales/text';

/** A quiz in the day's list: one question at a time, a new order every attempt. */
export default function QuizActivity({ quizId, onDone }: { quizId: string; onDone: () => void }) {
  const { quizzes, saveAttempt } = useSales();
  const [seed, setSeed] = useState<number | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const quiz = useMemo(() => buildQuiz(quizId, seed ?? 1), [quizId, seed]);
  if (!quiz) return null;
  const lang = quiz.lang;
  const best = bestAttempt(quizzes[quizId]);
  const q = quiz.questions[index];
  const picked = answers[index];
  const finished = seed !== null && answers.length === quiz.questions.length && picked !== undefined && index === quiz.questions.length - 1;

  const choose = (i: number) => {
    if (picked !== undefined) return;
    const next = [...answers];
    next[index] = i;
    setAnswers(next);
    if (next.length === quiz.questions.length && next.every((a) => a !== undefined)) {
      const right = quiz.questions.filter((x, n) => next[n] === x.answer).length;
      const percent = Math.round((right / quiz.questions.length) * 100);
      const passed = percent >= quiz.pass;
      const missed = quiz.questions.filter((x, n) => next[n] !== x.answer).map((x) => ({ q: x.q, right: x.options[x.answer] }));
      saveAttempt(quizId, { date: getToday(), percent, passed, missed });
      if (passed) onDone();
    }
  };

  if (seed === null) {
    return (
      <LangBlock lang={lang} className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setSeed(Date.now() % 1_000_000)} className={primaryBtn}>
          {best ? pick(lang, 'حاول مرة أخرى', 'Take it again') : pick(lang, 'ابدأ', 'Start')}
        </button>
        <span className="text-xs text-ink-light">
          {quiz.questions.length} {pick(lang, 'سؤال', 'questions')}
          {quiz.pass ? pick(lang, ` · النجاح ${quiz.pass}%`, ` · pass mark ${quiz.pass}%`) : pick(lang, ' · ليس امتحان نجاح، بل يقيس أين أنت', ' · just to see where you are')}
        </span>
        {best && <Pill tone={best.passed ? 'good' : 'neutral'}>{pick(lang, `أفضل نتيجة ${best.percent}%`, `Best ${best.percent}%`)}</Pill>}
      </LangBlock>
    );
  }

  if (finished) {
    const right = quiz.questions.filter((x, n) => answers[n] === x.answer).length;
    const percent = Math.round((right / quiz.questions.length) * 100);
    const passed = percent >= quiz.pass;
    const wrong = quiz.questions.map((x, n) => ({ x, n })).filter(({ x, n }) => answers[n] !== x.answer);
    return (
      <LangBlock lang={lang} className="space-y-3">
        <div className="flex items-center gap-3">
          <span className={`text-3xl font-bold tabular-nums ${passed ? 'text-sage-soft-dark' : 'text-ink'}`}>{percent}%</span>
          <span className="text-sm text-ink">
            {right} / {quiz.questions.length} ·{' '}
            {quiz.pass === 0
              ? pick(lang, 'هذه نقطة بدايتك. سترى الفرق في امتحان المستوى.', 'This is your starting point.')
              : passed
                ? pick(lang, 'نجحت! 🎉', 'Passed! 🎉')
                : pick(lang, `تحتاج إلى ${quiz.pass}%. راجع ما أخطأت فيه وحاول مرة أخرى.`, `You need ${quiz.pass}%. Review what you missed and try again.`)}
          </span>
        </div>
        {wrong.length > 0 && (
          <ul className="space-y-1.5">
            {wrong.map(({ x, n }) => (
              <li key={x.q} className="rounded-xl bg-ink/3 px-3 py-2 text-sm">
                <div className="text-ink">{x.q}</div>
                <div className="text-red-600/90 dark:text-red-400 line-through decoration-1">{x.options[answers[n]]}</div>
                <div className="text-sage-soft-dark">{x.options[x.answer]}</div>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => {
            setSeed(null);
            setIndex(0);
            setAnswers([]);
          }}
          className={secondaryBtn}
        >
          <RotateCcw size={13} /> {pick(lang, 'حسنًا', 'Done')}
        </button>
      </LangBlock>
    );
  }

  return (
    <LangBlock lang={lang} className="space-y-3">
      <div className="text-xs text-ink-light tabular-nums">
        {pick(lang, `سؤال ${index + 1} من ${quiz.questions.length}`, `Question ${index + 1} of ${quiz.questions.length}`)}
      </div>
      <p className="text-sm font-medium text-ink">{q.q}</p>
      <div className="grid gap-1.5 sm:grid-cols-2">
        {q.options.map((o, i) => {
          const shown = picked !== undefined;
          const tone = !shown
            ? 'border-border-subtle hover:border-clay-soft'
            : i === q.answer
              ? 'border-sage-soft bg-sage-soft/10'
              : i === picked
                ? 'border-red-400 bg-red-500/5'
                : 'border-border-subtle opacity-60';
          return (
            <button key={o} type="button" disabled={shown} onClick={() => choose(i)} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm text-start text-ink ${tone}`}>
              {shown && i === q.answer && <CheckCircle2 size={15} className="shrink-0 text-sage-soft" />}
              {shown && i === picked && i !== q.answer && <XCircle size={15} className="shrink-0 text-red-500" />}
              {o}
            </button>
          );
        })}
      </div>
      {picked !== undefined && q.why && <p className="text-xs text-ink-light">{q.why}</p>}
      {picked !== undefined && index < quiz.questions.length - 1 && (
        <button type="button" onClick={() => setIndex(index + 1)} className={primaryBtn}>
          {pick(lang, 'التالي', 'Next')}
        </button>
      )}
    </LangBlock>
  );
}

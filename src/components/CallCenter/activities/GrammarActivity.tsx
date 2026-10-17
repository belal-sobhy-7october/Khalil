import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { getGrammar } from '../../../data/callCenter';
import type { Choice } from '../../../data/callCenter/types';
import { ArabicNote, SpeakButton, secondaryBtn } from '../ui';

/** A multiple-choice question that shows right or wrong at once. */
export function ChoiceQuestion({ item, chosen, onChoose, number }: {
  item: Choice;
  chosen: number | undefined;
  onChoose: (index: number) => void;
  number?: number;
}) {
  const answered = chosen !== undefined;
  return (
    <div className="space-y-2">
      <p className="text-sm text-ink font-medium">
        {number !== undefined && <span className="text-ink-light tabular-nums">{number}. </span>}
        {item.q}
      </p>
      <div className="grid sm:grid-cols-2 gap-1.5">
        {item.options.map((o, i) => {
          const right = i === item.answer;
          const style = !answered
            ? 'border-border-subtle hover:border-clay-soft hover:bg-clay-soft/5'
            : right
              ? 'border-sage-soft bg-sage-soft/15 text-sage-soft-dark'
              : i === chosen
                ? 'border-red-400 bg-red-500/10 text-red-700 dark:text-red-300'
                : 'border-border-subtle opacity-60';
          return (
            <button key={o} type="button" disabled={answered} onClick={() => onChoose(i)} className={`text-start text-sm px-3 py-2 rounded-lg border transition-colors ${style}`}>
              {o}
            </button>
          );
        })}
      </div>
      {answered && item.why && <p className="text-xs text-ink-light">{item.why}</p>}
    </div>
  );
}

/** One grammar point: the rule with examples, then its exercises. */
export default function GrammarActivity({ refId, onDone }: { refId: string; onDone: () => void }) {
  const g = getGrammar(refId);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  if (!g) return <p className="text-sm text-ink-light">This grammar point is missing.</p>;
  const answeredCount = Object.keys(answers).length;
  const right = g.exercises.filter((e, i) => answers[i] === e.answer).length;

  const choose = (i: number, option: number) => {
    const next = { ...answers, [i]: option };
    setAnswers(next);
    if (Object.keys(next).length === g.exercises.length) onDone();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        {g.points.map((p) => (
          <div key={p.form} className="rounded-xl bg-ink/4 p-3">
            <div className="font-mono text-sm text-clay-soft-dark">{p.form}</div>
            <div className="text-sm text-ink">{p.use}</div>
            <div className="flex items-start gap-1 mt-1">
              <p className="flex-1 text-sm italic text-ink-light">{p.example}</p>
              <SpeakButton text={p.example} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-gold-soft/50 bg-gold-soft/10 p-3 text-sm text-ink">
        🚨 {g.tip}
        {g.tipAr && <ArabicNote className="mt-1">{g.tipAr}</ArabicNote>}
      </div>
      <div className="space-y-4">
        {g.exercises.map((e, i) => (
          <ChoiceQuestion key={e.q} item={e} number={i + 1} chosen={answers[i]} onChoose={(o) => choose(i, o)} />
        ))}
      </div>
      {answeredCount > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-ink tabular-nums">
            {right} / {g.exercises.length} right
          </span>
          <button type="button" onClick={() => setAnswers({})} className={secondaryBtn}>
            <RotateCcw size={13} /> Try again
          </button>
        </div>
      )}
    </div>
  );
}

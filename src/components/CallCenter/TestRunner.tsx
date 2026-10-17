import { useMemo, useState } from 'react';
import { ArrowRight, RotateCcw, SkipForward, Trophy, X } from 'lucide-react';
import type { Skill, TestItem } from '../../data/callCenter/types';
import { estimateGrammarLevel, getTest, itemWeight } from '../../lib/callCenter/quiz';
import type { TestAttempt } from '../../lib/callCenter/progress';
import { getToday } from '../../store/dateHelpers';
import { useCallCenter } from './CallCenterContext';
import { TestItemView, type ItemResult } from './testItems';
import { ProgressBar } from '../English/CourseVisuals';
import { ArabicNote, Card, Pill, primaryBtn, secondaryBtn } from './ui';
import { useSavedProgress } from './useSavedProgress';

const ITEM_LABEL: Record<TestItem['type'], string> = {
  mcq: 'Choose the answer',
  dictation: 'Dictation',
  repeat: 'Repeat',
  build: 'Sentence build',
  listen: 'Listening',
  retell: 'Story retelling',
  speak: 'Speaking',
  write: 'Writing',
  typing: 'Typing',
  call: 'Mock call',
};

const SKILL_NAME: Record<Skill, string> = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary & phrases',
  listening: 'Listening',
  speaking: 'Speaking',
  writing: 'Writing',
  typing: 'Typing',
  calls: 'Calls',
};

function summarize(items: TestItem[], results: Record<number, ItemResult>) {
  const skills: Partial<Record<Skill, { got: number; total: number }>> = {};
  let got = 0;
  let total = 0;
  items.forEach((item, i) => {
    const max = results[i]?.max ?? itemWeight(item);
    const points = results[i]?.points ?? 0;
    got += points;
    total += max;
    const s = (skills[item.skill] ??= { got: 0, total: 0 });
    s.got += points;
    s.total += max;
  });
  return { percent: total ? Math.round((got / total) * 100) : 0, skills };
}

/** A test you left in the middle: saved after every answer, so it resumes where you stopped. */
export interface TestInProgress {
  attemptNo: number;
  index: number;
  results: Record<number, ItemResult>;
  /** The test's length when it started (a saved run of a test that has since changed is dropped). */
  count: number;
}

/** Takes a test from start to finish, one item at a time, and saves the result. */
export default function TestRunner({ testId, onClose, onFinish }: {
  testId: string;
  onClose: () => void;
  /** Called once the attempt is saved. */
  onFinish?: (attempt: TestAttempt) => void;
}) {
  const { tests, saveAttempt } = useCallCenter();
  const [saved, setSaved, clearSaved] = useSavedProgress<TestInProgress | null>(`test:${testId}`, null);
  // Pick up a run you left in the middle (unless the test has changed since).
  const [resumed] = useState(() => (saved && saved.count === getTest(testId, saved.attemptNo)?.items.length ? saved : null));
  // Each attempt gets its own mix of questions; fixed once the test starts.
  const [attemptNo, setAttemptNo] = useState(() => resumed?.attemptNo ?? tests[testId]?.length ?? 0);
  const test = useMemo(() => getTest(testId, attemptNo), [testId, attemptNo]);
  const [index, setIndex] = useState(() => resumed?.index ?? 0);
  const [results, setResults] = useState<Record<number, ItemResult>>(() => resumed?.results ?? {});
  const [finished, setFinished] = useState<TestAttempt | null>(null);

  if (!test) return <Card>This test is missing.</Card>;
  const keep = (nextIndex: number, nextResults: Record<number, ItemResult>) =>
    setSaved({ attemptNo, index: nextIndex, results: nextResults, count: test.items.length });
  const item = test.items[index];
  const last = index === test.items.length - 1;

  const finish = (all: Record<number, ItemResult>) => {
    const { percent, skills } = summarize(test.items, all);
    const attempt: TestAttempt = { date: getToday(), percent, passed: test.kind !== 'diagnostic' && percent >= test.pass, skills };
    const wrong = Object.values(all).flatMap((r) => (r.wrong ? [r.wrong] : []));
    saveAttempt(test.id, attempt, wrong);
    clearSaved();
    setFinished(attempt);
    onFinish?.(attempt);
  };

  const next = (all = results) => {
    if (last) finish(all);
    else {
      setIndex(index + 1);
      keep(index + 1, all);
    }
  };

  const restart = () => {
    clearSaved();
    setAttemptNo((n) => n + 1);
    setIndex(0);
    setResults({});
    setFinished(null);
  };

  if (finished) {
    const grammarBands = test.kind === 'diagnostic'
      ? ([0, 5, 10].map((from) => [0, 1, 2, 3, 4].filter((k) => (results[from + k]?.points ?? 0) === 1).length) as [number, number, number])
      : null;
    const wrong = Object.values(results).filter((r) => r.wrong);
    return (
      <Card className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-ink-light">{test.title}</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-4xl font-bold tabular-nums text-ink">{finished.percent}%</span>
              {test.kind !== 'diagnostic' && <Pill tone={finished.passed ? 'good' : 'warn'}>{finished.passed ? 'Passed' : `Pass mark: ${test.pass}%`}</Pill>}
            </div>
          </div>
          {finished.passed && <Trophy size={40} className="text-gold-soft shrink-0" />}
        </div>
        {grammarBands && (
          <p className="text-sm text-ink">
            Estimated grammar level: <strong>{estimateGrammarLevel(grammarBands)}</strong> (B1 {grammarBands[0]}/5 · B2 {grammarBands[1]}/5 · C1 {grammarBands[2]}/5)
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          {Object.entries(finished.skills).map(([skill, s]) => (
            <div key={skill} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-ink">{SKILL_NAME[skill as Skill]}</span>
                <span className="tabular-nums text-ink-light">{s && s.total ? Math.round((s.got / s.total) * 100) : 0}%</span>
              </div>
              <ProgressBar ratio={s && s.total ? s.got / s.total : 0} size="sm" label={SKILL_NAME[skill as Skill]} />
            </div>
          ))}
        </div>
        {wrong.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-ink">Fix these (they're in your mistake log now)</div>
            <ul className="space-y-1.5 text-sm">
              {wrong.map((r, i) => (
                <li key={i} className="rounded-lg bg-ink/3 px-3 py-2">
                  <div className="text-red-600/90 dark:text-red-400 line-through decoration-1">{r.wrong?.wrong || '(no answer)'}</div>
                  <div className="text-sage-soft-dark">{r.wrong?.right}</div>
                  {r.wrong?.note && <div className="text-xs text-ink-light">{r.wrong.note}</div>}
                </li>
              ))}
            </ul>
          </div>
        )}
        <ArabicNote>
          {finished.passed || test.kind === 'diagnostic'
            ? 'عاش! كمّل على نفس الريتم. وراجع الغلطات اللي فوق قبل ما تنساها.'
            : 'مش مشكلة خالص. راجع الغلطات اللي فوق، اعمل الـ review، وجرّب تاني. كل محاولة بتجيلك أسئلة جديدة.'}
        </ArabicNote>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={restart} className={secondaryBtn}>
            <RotateCcw size={13} /> Take it again (new questions)
          </button>
          <button type="button" onClick={onClose} className={primaryBtn}>
            Done
          </button>
        </div>
      </Card>
    );
  }

  const result = results[index];
  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-ink-light truncate">{test.title}</div>
          <div className="text-sm font-semibold text-ink">
            {ITEM_LABEL[item.type]} <span className="text-ink-light font-normal tabular-nums">· {index + 1} / {test.items.length}</span>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close the test" className="p-2 rounded-lg text-ink-light hover:bg-ink/5">
          <X size={18} />
        </button>
      </div>
      <ProgressBar ratio={index / test.items.length} size="sm" label="Test progress" />
      {resumed && index === resumed.index && attemptNo === resumed.attemptNo && (
        <p className="text-xs text-sage-soft-dark">Picked up where you stopped: question {index + 1} of {test.items.length}. Your earlier answers are kept.</p>
      )}
      <TestItemView
        key={`${attemptNo}:${index}`}
        item={item}
        result={result}
        seed={`${test.id}:${attemptNo}:${index}`}
        recordKey={`test:${test.id}:${index}`}
        report={(r) => {
          const all = { ...results, [index]: r };
          setResults(all);
          keep(index, all);
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border-subtle">
        <button
          type="button"
          onClick={() => {
            const skipped = { ...results, [index]: { points: 0, max: itemWeight(item), skill: item.skill } };
            setResults(skipped);
            next(skipped);
          }}
          disabled={!!result}
          className={`${secondaryBtn} disabled:opacity-40`}
        >
          <SkipForward size={13} /> Skip
        </button>
        <button type="button" disabled={!result} onClick={() => next()} className={`${primaryBtn} disabled:opacity-50`}>
          {last ? 'Finish' : 'Next'} <ArrowRight size={13} />
        </button>
      </div>
    </Card>
  );
}

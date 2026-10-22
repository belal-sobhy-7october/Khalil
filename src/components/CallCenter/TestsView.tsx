import { Trash2 } from 'lucide-react';
import { LEVELS } from '../../data/callCenter';
import { VOCAB_CHECK_ID } from '../../data/callCenter/plan';
import { DIAGNOSTIC, LEVEL_EXAMS } from '../../data/callCenter/tests';
import { bestAttempt, bestTyping, efsetLevel, type TestAttempt } from '../../lib/callCenter/progress';
import { useCallCenter } from './CallCenterContext';
import type { TestInProgress } from './TestRunner';
import { EfsetActivity } from './activities/SmallActivities';
import { ArabicNote, Card, Pill, primaryBtn } from './ui';

function TestRow({ id, title, attempts, pass, onRun }: { id: string; title: string; attempts?: TestAttempt[]; pass?: number; onRun: (id: string) => void }) {
  const { inProgress } = useCallCenter();
  const best = bestAttempt(attempts);
  const half = inProgress[`test:${id}`] as TestInProgress | undefined;
  return (
    <li className="flex flex-wrap items-center gap-2 py-2">
      <span className="flex-1 min-w-48 text-sm text-ink">{title}</span>
      {best ? (
        <>
          <Pill tone={best.passed ? 'good' : 'neutral'}>Best {best.percent}%</Pill>
          <span className="text-xs text-ink-light tabular-nums">
            {attempts?.length} attempt{attempts?.length === 1 ? '' : 's'} · last {attempts?.at(-1)?.date}
          </span>
        </>
      ) : (
        pass !== undefined && <span className="text-xs text-ink-light">pass mark {pass}%</span>
      )}
      <button type="button" onClick={() => onRun(id)} className={primaryBtn}>
        {half ? `Continue (${half.index + 1}/${half.count})` : best ? 'Again' : 'Start'}
      </button>
    </li>
  );
}

/** Every test, your best scores, your mistake log, and your EF SET and typing history. */
export default function TestsView({ onRun }: { onRun: (testId: string) => void }) {
  const { tests, typing, settings, mistakes, setMistakes } = useCallCenter();
  const typingBest = bestTyping(typing);

  return (
    <div className="space-y-4">
      <ArabicNote>
        كل الامتحانات بنفس شكل اختبارات الشركات: جرامر، استماع، Repeat و Sentence builds زي Versant، كتابة، typing ومكالمة. كل مرة تعيد الامتحان بتجيلك أسئلة جديدة، والغلطات بتتجمع تحت عشان تراجعها.
      </ArabicNote>
      <Card>
        <h3 className="font-semibold text-ink">Diagnostic</h3>
        <ul>
          <TestRow id={DIAGNOSTIC.id} title="Diagnostic test (where you start)" attempts={tests[DIAGNOSTIC.id]} onRun={onRun} />
        </ul>
      </Card>
      <Card>
        <h3 className="font-semibold text-ink">Vocabulary</h3>
        <ul>
          <TestRow id={VOCAB_CHECK_ID} title="Vocab check: 40 words from the 384-word bank (goal: 90%)" attempts={tests[VOCAB_CHECK_ID]} pass={90} onRun={onRun} />
        </ul>
      </Card>
      {LEVELS.filter((l) => l.status === 'ready' && l.weeks.length).map((level) => {
        const exam = LEVEL_EXAMS.find((e) => e.level === level.id);
        return (
          <Card key={level.id}>
            <h3 className="font-semibold text-ink">
              Level {level.number}: {level.name}
            </h3>
            <ul className="divide-y divide-border-subtle">
              {level.weeks.map((w) => (
                <TestRow key={w.quizId} id={w.quizId} title={`Week ${w.number} quiz: ${w.title}`} attempts={tests[w.quizId]} pass={80} onRun={onRun} />
              ))}
              {exam && <TestRow id={exam.id} title={exam.title} attempts={tests[exam.id]} pass={exam.pass} onRun={onRun} />}
            </ul>
          </Card>
        );
      })}

      <Card className="space-y-3">
        <h3 className="font-semibold text-ink">EF SET</h3>
        <EfsetActivity onDone={() => {}} />
        {settings.efset.length > 0 && (
          <ul className="text-xs text-ink-light tabular-nums space-y-0.5">
            {[...settings.efset].reverse().map((e, i) => (
              <li key={`${e.date}-${i}`}>
                {e.date}: {e.score} ({efsetLevel(e.score)})
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="space-y-2">
        <h3 className="font-semibold text-ink">Typing</h3>
        {typingBest ? (
          <p className="text-sm text-ink">
            Best: <strong>{typingBest.wpm} words/min</strong> at {typingBest.accuracy}% · {typing.length} tests
          </p>
        ) : (
          <p className="text-sm text-ink-light">No typing tests yet.</p>
        )}
        {typing.length > 0 && (
          <div className="flex items-end gap-1 h-16" aria-label="Your last typing tests">
            {typing.slice(-30).map((r, i) => (
              <div key={i} title={`${r.date}: ${r.wpm} words/min, ${r.accuracy}%`} className="flex-1 min-w-1 rounded-t bg-clay-soft/60" style={{ height: `${Math.min(100, (r.wpm / 60) * 100)}%` }} />
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-ink">My mistake log</h3>
          <span className="text-xs text-ink-light">{mistakes.length}</span>
        </div>
        <p className="text-xs text-ink-light">Every wrong answer from your tests lands here. Read it before each exam; delete a line once you've got it.</p>
        {mistakes.length ? (
          <ul className="space-y-1.5 text-sm">
            {mistakes.map((m) => (
              <li key={m.id} className="flex items-start gap-2 rounded-lg bg-ink/3 px-3 py-2">
                <div className="flex-1 min-w-0">
                  <div className="text-red-600/90 dark:text-red-400 line-through decoration-1">{m.wrong || '(no answer)'}</div>
                  <div className="text-sage-soft-dark">{m.right}</div>
                  {m.note && <div className="text-xs text-ink-light">{m.note}</div>}
                </div>
                <button type="button" onClick={() => setMistakes((list) => list.filter((x) => x.id !== m.id))} aria-label="I've got it: remove" className="p-1 text-ink-light hover:text-sage-soft-dark">
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-light">Empty for now.</p>
        )}
      </Card>
    </div>
  );
}

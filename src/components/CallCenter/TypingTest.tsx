import { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { getTypingText } from '../../data/callCenter';
import { typingStats, type TypingStats } from '../../lib/callCenter/grading';
import { bestTyping } from '../../lib/callCenter/progress';
import { useCallCenter } from './CallCenterContext';
import { Pill, secondaryBtn } from './ui';

const LIMIT_SECONDS = 60;

/**
 * A one-minute typing test with a call center text (like the hiring tests):
 * net words per minute and accuracy, saved to your typing history.
 */
export default function TypingTest({ textId, target, onResult }: {
  textId: string;
  target: { wpm: number; accuracy: number };
  onResult?: (stats: TypingStats) => void;
}) {
  const text = getTypingText(textId);
  const { typing, saveTyping } = useCallCenter();
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<TypingStats | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const best = useMemo(() => bestTyping(typing.filter((r) => r.textId === textId)), [typing, textId]);

  const finish = (value: string, seconds: number) => {
    if (!text || result) return;
    const stats = typingStats(text.text, value, seconds);
    setResult(stats);
    setStartedAt(null);
    saveTyping({ textId, wpm: stats.wpm, accuracy: stats.accuracy });
    onResult?.(stats);
  };

  // The timer calls the latest finish() (it reads what's typed from the input itself).
  const finishRef = useRef(finish);
  useEffect(() => {
    finishRef.current = finish;
  });
  useEffect(() => {
    if (startedAt === null) return;
    const id = window.setInterval(() => {
      const s = (Date.now() - startedAt) / 1000;
      setElapsed(s);
      if (s >= LIMIT_SECONDS) finishRef.current(inputRef.current?.value ?? '', LIMIT_SECONDS);
    }, 200);
    return () => window.clearInterval(id);
  }, [startedAt]);

  if (!text) return <p className="text-sm text-ink-light">This text is missing.</p>;

  const onChange = (value: string) => {
    if (result) return;
    const now = Date.now();
    if (startedAt === null) setStartedAt(now);
    setTyped(value);
    if (value.length >= text.text.length) finish(value, startedAt === null ? 1 : (now - startedAt) / 1000);
  };

  const restart = () => {
    setTyped('');
    setResult(null);
    setStartedAt(null);
    setElapsed(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const passed = result && result.wpm >= target.wpm && result.accuracy >= target.accuracy;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-light">
        <span>
          Target: <strong className="text-ink">{target.wpm} words/min</strong> at <strong className="text-ink">{target.accuracy}%</strong>
        </span>
        {best && (
          <span>
            · Your best on this text: {best.wpm} words/min, {best.accuracy}%
          </span>
        )}
      </div>
      <p className="rounded-xl bg-ink/3 p-3 text-sm leading-relaxed font-mono select-none" dir="ltr" aria-label="Text to type">
        {[...text.text].map((ch, i) => {
          const state = i >= typed.length ? 'todo' : typed[i] === ch ? 'ok' : 'bad';
          return (
            <span key={i} className={state === 'ok' ? 'text-ink' : state === 'bad' ? 'bg-red-500/25 text-red-700 dark:text-red-300' : i === typed.length ? 'text-ink-light underline' : 'text-ink-lighter'}>
              {ch}
            </span>
          );
        })}
      </p>
      <textarea
        ref={inputRef}
        dir="ltr"
        rows={3}
        value={typed}
        disabled={!!result}
        onChange={(e) => onChange(e.target.value)}
        onPaste={(e) => e.preventDefault()}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        placeholder="Start typing: the clock starts with your first key (1 minute)."
        className="w-full rounded-xl border border-border-subtle bg-transparent p-3 text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/40 disabled:opacity-70"
      />
      <div className="flex flex-wrap items-center gap-3">
        {startedAt !== null && <span className="text-xs tabular-nums text-ink-light">{Math.max(0, Math.ceil(LIMIT_SECONDS - elapsed))}s left</span>}
        {result && (
          <>
            <span className="text-lg font-bold tabular-nums text-ink">{result.wpm} words/min</span>
            <span className="text-sm tabular-nums text-ink">{result.accuracy}% accuracy</span>
            <Pill tone={passed ? 'good' : 'warn'}>{passed ? 'Target reached' : 'Below target'}</Pill>
          </>
        )}
        {(result || typed) && (
          <button type="button" onClick={restart} className={secondaryBtn}>
            <RotateCcw size={13} /> Again
          </button>
        )}
      </div>
    </div>
  );
}

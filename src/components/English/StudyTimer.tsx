import { useEffect, useRef, useState } from 'react';
import { Play, Square, Timer } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useKv } from '../../lib/useKv';
import { addDaysToDateString, getToday } from '../../store/dateHelpers';
import { PRACTICE_LOG_KEY, addMinutes, minutesBetween, type PracticeKind, type PracticeLog } from '../../lib/englishPractice';

/** Start/stop practice timer that logs minutes per day for one practice kind. */
export default function StudyTimer({ kind }: { kind: PracticeKind }) {
  const { t } = useTranslation();
  const [log, setLog] = useKv<PracticeLog>(PRACTICE_LOG_KEY, {});
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const startedRef = useRef<number | null>(null);

  useEffect(() => {
    if (startedAt === null) return;
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);

  const stop = () => {
    const start = startedRef.current;
    if (start === null) return;
    const minutes = Math.round((Date.now() - start) / 60000);
    startedRef.current = null;
    setStartedAt(null);
    setElapsed(0);
    if (minutes >= 1) setLog((l) => addMinutes(l, getToday(), kind, minutes));
  };

  // Log whatever was practised if the section closes mid-session.
  useEffect(
    () => () => {
      const start = startedRef.current;
      if (start === null) return;
      const minutes = Math.round((Date.now() - start) / 60000);
      if (minutes >= 1) setLog((l) => addMinutes(l, getToday(), kind, minutes));
    },
    [setLog, kind]
  );

  const today = getToday();
  const todayMin = log[today]?.[kind] ?? 0;
  const weekMin = minutesBetween(log, addDaysToDateString(today, -6), today, kind);

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-border-subtle bg-ink/3">
      <Timer size={18} className="text-clay-soft" />
      <div className="text-sm text-ink flex-1 min-w-[10rem]">
        {t('english.timer.today').replace('{min}', String(todayMin))}
        <span className="text-ink-lighter"> · {t('english.timer.week').replace('{min}', String(weekMin))}</span>
      </div>
      {startedAt !== null ? (
        <button onClick={stop} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm tabular-nums">
          <Square size={13} /> {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')} · {t('english.timer.stop')}
        </button>
      ) : (
        <button
          onClick={() => {
            const now = Date.now();
            startedRef.current = now;
            setStartedAt(now);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clay-soft text-white text-sm hover:bg-clay-soft-dark"
        >
          <Play size={13} /> {t('english.timer.start')}
        </button>
      )}
    </div>
  );
}

import { Pause, Play } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { usePomodoroStore } from '../../store/pomodoroStore';
import { useTimerNow } from './useTimerNow';
import { formatClock } from './clock';

/** Small floating pill showing the running timer from any section. */
export default function FocusChip({ onOpen }: { onOpen: () => void }) {
  const { t } = useTranslation();
  const now = useTimerNow();
  const s = usePomodoroStore();
  if (s.status === 'idle') return null;
  return (
    <div className="fixed bottom-6 start-24 z-30 flex items-center gap-1 rounded-full bg-card border border-border-subtle shadow-lg ps-1 pe-3 py-1">
      <button
        onClick={s.toggle}
        className="w-8 h-8 rounded-full bg-clay-soft text-white flex items-center justify-center"
        aria-label={t(s.status === 'running' ? 'focus.pause' : 'focus.resume')}
      >
        {s.status === 'running' ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button onClick={onOpen} className="flex items-center gap-1.5 text-sm text-ink">
        <span className="font-semibold tabular-nums">{formatClock(s.remaining(now))}</span>
        <span className="text-xs text-ink-light">{t(`focus.phase.${s.phase}`)}</span>
      </button>
    </div>
  );
}

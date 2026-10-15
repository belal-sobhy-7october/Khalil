import { Pause, Play, SkipForward } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { usePomodoroStore } from '../../store/pomodoroStore';
import { useTimerNow } from './useTimerNow';
import { formatClock } from './clock';

/** Compact timer used in the floating window. */
export default function MiniTimer() {
  const { t } = useTranslation();
  const now = useTimerNow();
  const s = usePomodoroStore();
  const remaining = s.remaining(now);
  const progress = 1 - remaining / s.durationMs();
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-2 bg-card text-ink p-3 select-none">
      <div className="text-xs text-ink-light">{t(`focus.phase.${s.phase}`)}{s.label ? ` · ${s.label}` : ''}</div>
      <div className="text-5xl font-bold tabular-nums tracking-tight">{formatClock(remaining)}</div>
      <div className="w-full h-1.5 bg-ink/10 rounded-full overflow-hidden">
        <div className="h-full bg-clay-soft transition-all" style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }} />
      </div>
      <div className="flex gap-2">
        <button onClick={s.toggle} className="px-4 py-1.5 rounded-lg bg-clay-soft text-white text-sm flex items-center gap-1">
          {s.status === 'running' ? <Pause size={14} /> : <Play size={14} />}
          {t(s.status === 'running' ? 'focus.pause' : 'focus.start')}
        </button>
        <button onClick={s.skip} className="px-3 py-1.5 rounded-lg bg-ink/10 text-sm" aria-label={t('focus.skip')}>
          <SkipForward size={14} />
        </button>
      </div>
    </div>
  );
}

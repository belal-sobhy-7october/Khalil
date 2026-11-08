import { Pause, Play, SlidersHorizontal, Timer } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { usePomodoroStore } from '../../store/pomodoroStore';
import { useTimerNow } from './useTimerNow';
import { formatClock } from './clock';

function openFocusPage() {
  window.dispatchEvent(new CustomEvent('khalil:navigate', { detail: 'focus' }));
}

/**
 * On the tasks page: one click starts a focus session with the timer's own
 * settings; the Focus page has the rest (breaks, sounds, the floating window).
 * While a session runs it shows the time left and pauses or resumes it.
 */
export default function QuickFocus({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  const now = useTimerNow();
  const status = usePomodoroStore((s) => s.status);
  const phase = usePomodoroStore((s) => s.phase);
  const minutes = usePomodoroStore((s) => s.settings.focus);
  const remaining = usePomodoroStore((s) => s.remaining);
  const start = usePomodoroStore((s) => s.start);
  const toggle = usePomodoroStore((s) => s.toggle);
  const setPhase = usePomodoroStore((s) => s.setPhase);

  const idle = status === 'idle';
  const onMain = () => {
    if (!idle) return toggle();
    // A shortcut to focus: a break waiting to start gives way to a focus session.
    if (phase !== 'focus') setPhase('focus');
    start();
  };
  const mainLabel = idle
    ? t('focus.quick.startAria').replace('{min}', String(minutes))
    : t(status === 'running' ? 'focus.pause' : 'focus.resume');

  return (
    <div className={`flex items-center gap-1 ${className}`} data-guide="quick-focus">
      <button
        onClick={onMain}
        aria-label={mainLabel}
        title={mainLabel}
        className={`flex items-center gap-1.5 h-8 ps-2.5 pe-3 rounded-full text-xs font-medium transition-colors ${
          idle ? 'bg-clay-soft/10 text-clay-soft hover:bg-clay-soft/20' : 'bg-clay-soft text-white hover:bg-clay-soft-dark'
        }`}
      >
        {idle ? <Timer size={14} /> : status === 'running' ? <Pause size={13} /> : <Play size={13} />}
        {idle ? (
          <span>{t('focus.quick.start').replace('{min}', String(minutes))}</span>
        ) : (
          <span className="tabular-nums">
            {t(`focus.phase.${phase}`)} · <bdi>{formatClock(remaining(now))}</bdi>
          </span>
        )}
      </button>
      <button
        onClick={openFocusPage}
        aria-label={t('focus.quick.more')}
        title={t('focus.quick.more')}
        className="w-8 h-8 rounded-full text-ink-light hover:text-ink hover:bg-ink/5 flex items-center justify-center transition-colors"
      >
        <SlidersHorizontal size={13} />
      </button>
    </div>
  );
}

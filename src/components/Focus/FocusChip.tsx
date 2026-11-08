import { useEffect, useRef, useState } from 'react';
import { Pause, Play, SlidersHorizontal, Waves } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { usePomodoroStore } from '../../store/pomodoroStore';
import { useNoiseStore, type NoiseKind } from '../../lib/ambientNoise';
import { useTimerNow } from './useTimerNow';
import { formatClock } from './clock';

type ChipSize = 'small' | 'medium' | 'large';
interface ChipPrefs {
  opacity: number; // 0.3–1, while not hovered
  size: ChipSize;
}

const PREFS_KEY = 'khalil-focus-chip';
const SCALE: Record<ChipSize, number> = { small: 0.85, medium: 1, large: 1.25 };
const NOISES: NoiseKind[] = ['white', 'pink', 'brown'];

function readPrefs(): ChipPrefs {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS_KEY) ?? '{}') as Partial<ChipPrefs>;
    return {
      opacity: typeof p.opacity === 'number' ? Math.min(1, Math.max(0.3, p.opacity)) : 1,
      size: p.size && p.size in SCALE ? p.size : 'medium',
    };
  } catch {
    return { opacity: 1, size: 'medium' };
  }
}

/**
 * Oval floating timer shown on every section while a session runs (or the
 * background sound plays). A ring around the edge shows the phase progress;
 * its own settings set how see-through and how big it is.
 */
export default function FocusChip({ onOpen }: { onOpen: () => void }) {
  const { t } = useTranslation();
  const now = useTimerNow();
  const s = usePomodoroStore();
  const noise = useNoiseStore((n) => n.kind);
  const toggleNoise = useNoiseStore((n) => n.toggle);
  const [prefs, setPrefs] = useState(readPrefs);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<ChipPrefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    } catch {
      // the choice just won't persist
    }
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (s.status === 'idle' && !noise) return null;

  const remaining = s.remaining(now);
  const progress = s.status === 'idle' ? 0 : Math.max(0, Math.min(1, 1 - remaining / s.durationMs()));

  return (
    <div
      ref={rootRef}
      className="fixed bottom-6 start-24 z-30 origin-bottom-left rtl:origin-bottom-right transition-transform"
      style={{ transform: `scale(${SCALE[prefs.size]})` }}
    >
      {open && (
        <div
          role="dialog"
          aria-label={t('focus.chip.settings')}
          className="absolute bottom-full mb-3 start-0 w-60 rounded-2xl border border-border-subtle bg-card shadow-xl p-3 space-y-3 text-sm text-ink"
        >
          <label className="block space-y-1">
            <span className="flex justify-between text-xs text-ink-light">
              {t('focus.chip.opacity')}
              <bdi className="tabular-nums">{Math.round((1 - prefs.opacity) * 100)}%</bdi>
            </span>
            <input
              type="range"
              min={0}
              max={70}
              step={5}
              value={Math.round((1 - prefs.opacity) * 100)}
              onChange={(e) => update({ opacity: 1 - Number(e.target.value) / 100 })}
              className="w-full accent-clay-soft"
            />
          </label>
          <div className="space-y-1">
            <span className="text-xs text-ink-light">{t('focus.chip.size')}</span>
            <div className="flex rounded-lg bg-ink/5 p-0.5" role="group" aria-label={t('focus.chip.size')}>
              {(Object.keys(SCALE) as ChipSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => update({ size })}
                  aria-pressed={prefs.size === size}
                  className={`flex-1 rounded-md py-1 text-xs ${prefs.size === size ? 'bg-card shadow-sm text-ink' : 'text-ink-light hover:text-ink'}`}
                >
                  {t(`focus.chip.${size}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-ink-light flex items-center gap-1"><Waves size={12} /> {t('focus.chip.sound')}</span>
            <div className="flex flex-wrap gap-1">
              {NOISES.map((k) => (
                <button
                  key={k}
                  onClick={() => toggleNoise(k)}
                  aria-pressed={noise === k}
                  className={`px-2.5 py-1 rounded-full text-xs ${noise === k ? 'bg-clay-soft text-white' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}
                >
                  {t(`focus.noise.${k}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className="relative flex items-center gap-2 h-16 ps-2 pe-4 rounded-[50%] bg-card/95 backdrop-blur border border-border-subtle shadow-lg opacity-(--chip-opacity) hover:opacity-100 focus-within:opacity-100 transition-opacity"
        style={{ ['--chip-opacity' as string]: open ? 1 : prefs.opacity }}
      >
        {/* Progress ring along the oval, clockwise from the top. */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M50 1 A49 19 0 0 1 50 39 A49 19 0 0 1 50 1"
            pathLength={100}
            fill="none"
            stroke="var(--color-clay-soft)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={`${progress * 100} 100`}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <button
          onClick={s.toggle}
          className="relative ms-2 w-9 h-9 shrink-0 rounded-full bg-clay-soft text-white flex items-center justify-center"
          aria-label={t(s.status === 'running' ? 'focus.pause' : s.status === 'paused' ? 'focus.resume' : 'focus.start')}
        >
          {s.status === 'running' ? <Pause size={15} /> : <Play size={15} />}
        </button>
        <button onClick={onOpen} className="relative flex flex-col items-center leading-tight px-1" aria-label={t('focus.chip.open')}>
          <span className="text-lg font-semibold tabular-nums text-ink">{formatClock(remaining)}</span>
          <span className="text-[11px] text-ink-light flex items-center gap-1">
            {t(`focus.phase.${s.phase}`)}
            {noise && <Waves size={10} className="text-clay-soft" aria-hidden="true" />}
          </span>
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={t('focus.chip.settings')}
          className="relative w-7 h-7 shrink-0 rounded-full text-ink-light hover:text-ink hover:bg-ink/5 flex items-center justify-center"
        >
          <SlidersHorizontal size={13} />
        </button>
      </div>
    </div>
  );
}

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PROGRESS_TRANSITION } from './courseMotion';

const fillGradient = (complete: boolean) =>
  complete ? 'bg-linear-to-r from-sage-soft to-gold-soft' : 'bg-linear-to-r from-clay-soft to-gold-soft';

const pct = (ratio: number) => `${Math.max(0, Math.min(1, ratio)) * 100}%`;
/** Rounded down like the percentages on screen, so 100 means done. */
const wholePercent = (ratio: number) => Math.floor(Math.max(0, Math.min(1, ratio)) * 100);

/** A bar that fills as lessons are watched. `ratio` is 0–1. */
export function ProgressBar({ ratio, size = 'md', label, animateIn = false, className = '' }: {
  ratio: number;
  size?: 'xs' | 'sm' | 'md';
  label?: string;
  /** Fill from empty when it first appears. */
  animateIn?: boolean;
  className?: string;
}) {
  const height = size === 'md' ? 'h-2' : size === 'sm' ? 'h-1.5' : 'h-1';
  return (
    <div
      className={`${height} rounded-full bg-ink/10 overflow-hidden ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuenow={wholePercent(ratio)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={`h-full rounded-full ${fillGradient(ratio >= 1)}`}
        initial={animateIn ? { width: 0 } : false}
        animate={{ width: pct(ratio) }}
        transition={PROGRESS_TRANSITION}
      />
    </div>
  );
}

export interface ProgressSegment {
  id: string;
  label: string;
  /** How many lessons the segment holds (its share of the bar). */
  size: number;
  ratio: number;
}

/**
 * A track's progress as one bar split into its playlists: each part is as
 * wide as its playlist is long and fills on its own. The part you're on
 * shimmers; clicking a part opens that playlist.
 */
export function SegmentedProgress({ segments, activeId, label, ratio, onSelect }: {
  segments: ProgressSegment[];
  activeId?: string;
  label: string;
  ratio: number;
  onSelect?: (id: string) => void;
}) {
  return (
    <div
      className="flex gap-1"
      role="progressbar"
      aria-label={label}
      aria-valuenow={wholePercent(ratio)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {segments.map((s) => {
        const complete = s.ratio >= 1;
        const active = s.id === activeId;
        return (
          <div
            key={s.id}
            title={s.label}
            onClick={onSelect ? () => onSelect(s.id) : undefined}
            className={`relative h-3 min-w-2 rounded-full bg-ink/10 overflow-hidden ${onSelect ? 'cursor-pointer' : ''} ${
              active ? 'ring-1 ring-clay-soft/60' : ''
            }`}
            style={{ flexGrow: s.size, flexBasis: 0 }}
          >
            <motion.div
              className={`relative h-full rounded-full overflow-hidden ${fillGradient(complete)}`}
              initial={{ width: 0 }}
              animate={{ width: pct(s.ratio) }}
              transition={PROGRESS_TRANSITION}
            >
              {active && s.ratio > 0 && !complete && <span className="course-shimmer absolute inset-0" />}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/** Circular progress with content (e.g. an icon or the percentage) in the middle. */
export function ProgressRing({ ratio, size = 96, stroke = 9, label, animateIn = false, children }: {
  ratio: number;
  size?: number;
  stroke?: number;
  label?: string;
  animateIn?: boolean;
  children?: React.ReactNode;
}) {
  const gradientId = `ring-${useId().replace(/[^\w-]/g, '')}`;
  const r = (size - stroke) / 2;
  const complete = ratio >= 1;
  const value = Math.max(0, Math.min(1, ratio));
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label={label}
      aria-valuenow={wholePercent(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={complete ? 'var(--color-sage-soft)' : 'var(--color-clay-soft)'} />
            <stop offset="100%" stopColor="var(--color-gold-soft)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-ink/10" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={animateIn ? { pathLength: 0, opacity: 0 } : false}
          // A zero-length round cap still draws a dot, so hide it at 0.
          animate={{ pathLength: value, opacity: value > 0 ? 1 : 0 }}
          transition={PROGRESS_TRANSITION}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/** A whole number that counts to its new value on the progress curve. */
export function AnimatedNumber({ value, animateIn = false, className }: { value: number; animateIn?: boolean; className?: string }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // React renders the first value only; later values are written by the animation.
  const [first] = useState(animateIn ? 0 : value);
  const shown = useRef(first);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion || shown.current === value) {
      shown.current = value;
      el.textContent = String(value);
      return;
    }
    const controls = animate(shown.current, value, {
      ...PROGRESS_TRANSITION,
      onUpdate: (v) => {
        shown.current = v;
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {first}
    </span>
  );
}

/**
 * Round tick box for one lesson. While a lesson is part-watched its rim fills
 * with how much was watched; ticking it pops a check.
 */
export function DoneCheck({ done, fraction = 0, onToggle, label }: {
  done: boolean;
  /** 0–1 of the lesson watched, shown while not done. */
  fraction?: number;
  onToggle: () => void;
  label: string;
}) {
  const partial = !done && fraction > 0;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={label}
      onClick={onToggle}
      className={`relative shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
        done ? 'bg-sage-soft border-sage-soft text-white' : 'border-ink/20 hover:border-sage-soft hover:bg-sage-soft/10'
      }`}
    >
      <AnimatePresence initial={false}>
        {partial && (
          <motion.svg
            key="watched"
            viewBox="0 0 24 24"
            className="absolute -inset-[2px] w-6 h-6 -rotate-90 pointer-events-none"
            aria-hidden="true"
            exit={{ opacity: 0 }}
          >
            <motion.circle
              cx="12"
              cy="12"
              r="11"
              fill="none"
              stroke="var(--color-clay-soft)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: fraction }}
              transition={PROGRESS_TRANSITION}
            />
          </motion.svg>
        )}
        {done && (
          <motion.span
            key="tick"
            initial={{ scale: 0, rotate: -60 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 520, damping: 20 }}
            className="flex"
          >
            <Check size={14} strokeWidth={3} />
          </motion.span>
        )}
        {done && (
          <motion.span
            key="pulse"
            className="absolute -inset-[2px] rounded-full border-2 border-sage-soft pointer-events-none"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}

/** A video thumbnail that hides itself when it can't load (offline or blocked). */
export function Thumb({ src, className, eager = false }: { src: string; className?: string; eager?: boolean }) {
  return (
    <img
      src={src}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      className={className}
      onError={(e) => {
        e.currentTarget.style.visibility = 'hidden';
      }}
    />
  );
}

/** YouTube-style "watched so far" line along the bottom of a thumbnail. */
export function ThumbProgress({ fraction, className = 'h-[3px]' }: { fraction: number; className?: string }) {
  if (fraction <= 0 || fraction >= 1) return null;
  return (
    <span className={`absolute inset-x-0 bottom-0 bg-white/30 ${className}`} aria-hidden="true">
      <motion.span
        className="block h-full bg-clay-soft"
        initial={false}
        animate={{ width: pct(fraction) }}
        transition={PROGRESS_TRANSITION}
      />
    </span>
  );
}

/** Animated "now playing" bars. */
export function PlayingBars() {
  return (
    <span className="inline-flex items-end gap-[2px] h-3.5" aria-hidden="true">
      {[0, 0.2, 0.4].map((delay) => (
        <span key={delay} className="course-eq-bar w-[3px] h-full rounded-sm bg-clay-soft" style={{ animationDelay: `${delay}s` }} />
      ))}
    </span>
  );
}

// Confetti directions, fixed so renders stay pure.
const COLORS = ['var(--color-clay-soft)', 'var(--color-gold-soft)', 'var(--color-sage-soft)', '#e07d4d', '#dcc085'];
const PIECES = Array.from({ length: 36 }, (_, i) => {
  const angle = (i / 36) * Math.PI * 2 + Math.sin(i * 12.9898) * 0.3;
  const distance = 90 + ((i * 37) % 70);
  return {
    x: Math.cos(angle) * distance * 1.6,
    y: Math.sin(angle) * distance - 40,
    rotate: ((i * 83) % 360) - 180,
    color: COLORS[i % COLORS.length],
    round: i % 3 === 0,
  };
});

export interface CelebrationMessage {
  id: number;
  text: string;
  big?: boolean;
}

/** A toast with a confetti burst for finished playlists, tracks and milestones. */
export function Celebration({ message, onDone }: { message: CelebrationMessage | null; onDone: () => void }) {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(onDone, message.big ? 4200 : 3000);
    return () => window.clearTimeout(id);
  }, [message, onDone]);

  const pieces = message?.big ? PIECES : PIECES.filter((_, i) => i % 2 === 0);
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message.id}
          className="fixed bottom-8 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
          initial={{ y: 40, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <div
            role="status"
            className="relative pointer-events-auto max-w-md px-5 py-3 rounded-2xl bg-card border border-gold-soft/40 shadow-2xl text-ink font-semibold text-center"
          >
            {!reduceMotion &&
              pieces.map((p, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className={`absolute left-1/2 top-1/2 w-2 ${p.round ? 'h-2 rounded-full' : 'h-3 rounded-[2px]'}`}
                  style={{ background: p.color }}
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                  animate={{ x: p.x, y: [0, p.y, p.y + 60], opacity: [1, 1, 0], rotate: p.rotate }}
                  transition={{ duration: message.big ? 1.8 : 1.3, ease: 'easeOut' }}
                />
              ))}
            <span className="relative">{message.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

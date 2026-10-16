import { useEffect, useId } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';

const fillGradient = (value: number) =>
  value === 100 ? 'bg-linear-to-r from-sage-soft to-gold-soft' : 'bg-linear-to-r from-clay-soft to-gold-soft';

/** A bar that fills as lessons are ticked off; `milestones` marks 25/50/75%. */
export function ProgressBar({ value, size = 'md', milestones = false, label, className = '' }: {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  milestones?: boolean;
  label?: string;
  className?: string;
}) {
  const height = size === 'lg' ? 'h-3.5' : size === 'md' ? 'h-2' : 'h-1.5';
  return (
    <div
      className={`relative ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`${height} rounded-full bg-ink/10 overflow-hidden`}>
        <motion.div
          className={`relative h-full rounded-full overflow-hidden ${fillGradient(value)}`}
          initial={false}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 110, damping: 20 }}
        >
          {size === 'lg' && value > 0 && <span className="course-shimmer absolute inset-0" />}
        </motion.div>
      </div>
      {milestones &&
        [25, 50, 75].map((m) => (
          <span
            key={m}
            className={`absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ring-2 ring-card transition-colors ${
              value >= m ? 'bg-gold-soft' : 'bg-ink/15'
            }`}
            style={{ insetInlineStart: `calc(${m}% - 5px)` }}
          />
        ))}
    </div>
  );
}

/** Circular progress with content (e.g. the percentage) in the middle. */
export function ProgressRing({ value, size = 96, stroke = 9, children }: {
  value: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const gradientId = `ring-${useId().replace(/[^\w-]/g, '')}`;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const done = value === 100;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={done ? 'var(--color-sage-soft)' : 'var(--color-clay-soft)'} />
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
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: circumference * (1 - value / 100) }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

/** Round tick box for one lesson; pops when ticked. */
export function DoneCheck({ done, onToggle, label, size = 'md' }: {
  done: boolean;
  onToggle: () => void;
  label: string;
  size?: 'md' | 'lg';
}) {
  const box = size === 'lg' ? 'w-7 h-7' : 'w-6 h-6';
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={label}
      onClick={onToggle}
      className={`relative shrink-0 ${box} rounded-full border-2 flex items-center justify-center transition-colors ${
        done ? 'bg-sage-soft border-sage-soft text-white' : 'border-ink/25 hover:border-sage-soft hover:bg-sage-soft/10'
      }`}
    >
      <AnimatePresence initial={false}>
        {done && (
          <motion.span
            key="tick"
            initial={{ scale: 0, rotate: -60 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 520, damping: 18 }}
            className="flex"
          >
            <Check size={size === 'lg' ? 16 : 14} strokeWidth={3} />
          </motion.span>
        )}
        {done && (
          <motion.span
            key="ring"
            className="absolute inset-0 rounded-full border-2 border-sage-soft pointer-events-none"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
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

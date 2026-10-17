/** Small building blocks shared by Call Center Prep's screens. */
import { useState, type ReactNode } from 'react';
import { Check, Copy, ExternalLink, Volume2, WifiOff } from 'lucide-react';
import { useOnline } from '../../lib/offline';
import { AI_PARTNERS, NATURAL_READERS_URL, copyText } from '../../lib/callCenter/prompts';
import { speakText } from '../../lib/callCenter/voice';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border-subtle bg-card p-4 sm:p-5 ${className}`}>{children}</div>;
}

/** A short friendly line in Egyptian Arabic, right to left inside the English page. */
export function ArabicNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p dir="rtl" lang="ar" className={`text-sm leading-relaxed text-ink-light font-[inherit] ${className}`}>
      {children}
    </p>
  );
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'accent' }) {
  const tones = {
    neutral: 'bg-ink/5 text-ink-light',
    good: 'bg-sage-soft/15 text-sage-soft-dark',
    warn: 'bg-red-500/10 text-red-600 dark:text-red-400',
    accent: 'bg-clay-soft/15 text-clay-soft-dark',
  };
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${tones[tone]}`}>{children}</span>;
}

/** Plays a sentence with the device's voice. */
export function SpeakButton({ text, label, rate, compact = false }: { text: string; label?: string; rate?: number; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => speakText(text, rate)}
      aria-label={label ?? `Listen: ${text}`}
      title="Listen"
      className={`shrink-0 inline-flex items-center justify-center gap-1 rounded-lg ${compact ? 'p-0.5' : 'p-1.5'} text-ink-light hover:text-clay-soft hover:bg-clay-soft/10 transition-colors`}
    >
      <Volume2 size={15} />
      {label && <span className="text-xs">{label}</span>}
    </button>
  );
}

/** "Needs internet" — shown on things that can't work offline. */
export function NeedsInternet() {
  const online = useOnline();
  if (online) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-ink-light">
      <WifiOff size={12} /> Needs internet
    </span>
  );
}

const btn = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors';
export const primaryBtn = `${btn} bg-clay-soft text-white hover:bg-clay-soft-dark`;
export const secondaryBtn = `${btn} bg-ink/5 text-ink hover:bg-ink/10`;

/** Copies a prompt and opens an AI partner in a new tab. */
export function AiPartnerButtons({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);
  const go = async (url: string) => {
    setCopied(await copyText(prompt));
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        {AI_PARTNERS.map((p) => (
          <button key={p.name} type="button" onClick={() => void go(p.url)} className={primaryBtn}>
            <ExternalLink size={13} /> Copy prompt &amp; open {p.name}
          </button>
        ))}
        <button type="button" onClick={async () => setCopied(await copyText(prompt))} className={secondaryBtn}>
          <Copy size={13} /> Copy prompt
        </button>
        <NeedsInternet />
      </div>
      {copied && <p className="text-[11px] text-sage-soft-dark">Copied. Paste it, turn on voice mode, and start talking.</p>}
    </div>
  );
}

/** Copies a text and opens NaturalReader, for a natural voice. */
export function NaturalReaderButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={async () => {
          setCopied(await copyText(text));
          window.open(NATURAL_READERS_URL, '_blank', 'noopener,noreferrer');
        }}
        className={secondaryBtn}
      >
        <ExternalLink size={13} /> Copy &amp; open NaturalReader
      </button>
      {copied && <span className="text-[11px] text-sage-soft-dark">Copied: paste it there and press play.</span>}
    </span>
  );
}

/** The manual tick every task has (also for when you did it elsewhere). */
export function DoneToggle({ done, onToggle }: { done: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={onToggle}
      className={`${btn} ${done ? 'bg-sage-soft text-white' : 'bg-ink/5 text-ink hover:bg-sage-soft/15'}`}
    >
      <Check size={13} strokeWidth={3} /> {done ? 'Done' : 'Mark as done'}
    </button>
  );
}

/** Small building blocks for Sales Prep, in the language of the content they sit in. */
import { useState, type ReactNode } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import type { Lang } from '../../data/sales/types';
import { AI_PARTNERS, copyText } from '../../lib/callCenter/prompts';
import { pick } from '../../lib/sales/text';
import { NeedsInternet, primaryBtn, secondaryBtn } from '../CallCenter/ui';
import { useSales } from './SalesContext';

export { Card, Pill, SpeakButton, NeedsInternet } from '../CallCenter/ui';

/** Wraps English content so it reads left to right inside the Arabic page. */
export function LangBlock({ lang, children, className = '' }: { lang: Lang; children: ReactNode; className?: string }) {
  return (
    <div dir={lang === 'en' ? 'ltr' : 'rtl'} lang={lang} className={className}>
      {children}
    </div>
  );
}

/** A short friendly line in Modern Standard Arabic. */
export function ArabicNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p dir="rtl" lang="ar" className={`text-sm leading-relaxed text-ink-light ${className}`}>
      {children}
    </p>
  );
}

/** The manual tick every task has. */
export function DoneToggle({ done, onToggle, lang }: { done: boolean; onToggle: () => void; lang: Lang }) {
  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${done ? 'bg-sage-soft text-white' : 'bg-ink/5 text-ink hover:bg-sage-soft/15'}`}
    >
      <Check size={13} strokeWidth={3} /> {done ? pick(lang, 'تم', 'Done') : pick(lang, 'علّمها منجزة', 'Mark as done')}
    </button>
  );
}

/** Copies a prompt and opens an AI partner in a new tab. */
export function AiButtons({ prompt, lang }: { prompt: string; lang: Lang }) {
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
            <ExternalLink size={13} /> {pick(lang, `انسخ التعليمات وافتح ${p.name}`, `Copy prompt & open ${p.name}`)}
          </button>
        ))}
        <button type="button" onClick={async () => setCopied(await copyText(prompt))} className={secondaryBtn}>
          <Copy size={13} /> {pick(lang, 'انسخ التعليمات', 'Copy prompt')}
        </button>
        <NeedsInternet />
      </div>
      {copied && (
        <p className="text-[11px] text-sage-soft-dark">{pick(lang, 'نُسخت. الصقها هناك، وشغّل الوضع الصوتي، وابدأ الكلام.', 'Copied. Paste it, turn on voice mode, and start talking.')}</p>
      )}
    </div>
  );
}

/** A text box saved in the notebook (`sales-notes`) when you leave it. */
export function NoteBox({ noteKey, label, placeholder, rows = 3, lang, onSaved }: {
  noteKey: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  lang: Lang;
  /** Called after a non-empty save. */
  onSaved?: () => void;
}) {
  const { notes, saveNote } = useSales();
  const saved = notes[noteKey]?.text ?? '';
  const [text, setText] = useState(saved);
  // A value that arrives from the account after the box opened.
  const [seen, setSeen] = useState(saved);
  if (saved !== seen) {
    setSeen(saved);
    setText(saved);
  }
  const save = () => {
    saveNote(noteKey, text);
    if (text.trim()) onSaved?.();
  };
  return (
    <label className="block space-y-1">
      {label && <span className="block text-sm text-ink">{label}</span>}
      <textarea
        value={text}
        rows={rows}
        dir="auto"
        placeholder={placeholder ?? pick(lang, 'اكتب هنا… يُحفظ في دفترك', 'Write here… saved in your notebook')}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        className="w-full rounded-xl border border-border-subtle bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:border-clay-soft"
      />
      {text !== saved && (
        <button type="button" onClick={save} className="text-[11px] text-clay-soft hover:underline">
          {pick(lang, 'احفظ', 'Save')}
        </button>
      )}
    </label>
  );
}

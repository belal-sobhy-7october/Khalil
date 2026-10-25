import { useMemo, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { PHRASE_SETS, TYPING_TEXTS } from '../../data/callCenter';
import { FREE_TOOLS } from '../../data/callCenter/resources';
import { TYPING_TARGETS } from '../../lib/callCenter/quiz';
import type { LevelId } from '../../data/callCenter/types';
import { speakText } from '../../lib/callCenter/voice';
import TypingTest from './TypingTest';
import RecommendedTools from '../English/RecommendedTools';
import { ArabicNote, Card, SpeakButton } from './ui';

const CALL_FLOW: Array<{ step: string; say: string[] }> = [
  { step: '1. Opening', say: ['Thank you for calling NetLink, this is Belal. Who am I speaking with?', 'How can I help you today?'] },
  { step: '2. Verification', say: ['For your security, can you please confirm your full name and date of birth?', 'Thank you, that matches.'] },
  { step: '3. Understand the problem', say: ['Can you tell me exactly what happens when…?', 'So, if I understand correctly, … Is that right?'] },
  { step: '4. Solve it', say: ["First, let's restart the router.", 'Once all the lights are solid, let me know.', 'Could you try it now?'] },
  { step: '5. Close', say: ["Just to recap, I've…", 'Is there anything else I can help you with today?', 'Thanks for calling, and have a great day.'] },
];

const NATO = [
  'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa',
  'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu',
];

/** Cheat sheets and practice you can open any time: call flow, NATO alphabet, all phrases, typing. */
export default function ToolkitView({ level }: { level: LevelId }) {
  const [query, setQuery] = useState('');
  const [textId, setTextId] = useState(TYPING_TEXTS[0].id);
  const sets = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHRASE_SETS;
    return PHRASE_SETS.map((s) => ({ ...s, phrases: s.phrases.filter((p) => p.text.toLowerCase().includes(q) || p.use.includes(q)) })).filter((s) => s.phrases.length);
  }, [query]);

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <h3 className="font-semibold text-ink">The call flow, on one card</h3>
        <ArabicNote>هذا هيكل أي مكالمة. ضعه أمامك في أول أسابيع العمل أيضًا.</ArabicNote>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CALL_FLOW.map((c) => (
            <div key={c.step} className="rounded-xl bg-ink/3 p-3">
              <div className="text-sm font-semibold text-ink mb-1">{c.step}</div>
              <ul className="space-y-1.5">
                {c.say.map((s) => (
                  <li key={s} className="flex items-start gap-1 text-xs text-ink">
                    <span className="flex-1">{s}</span>
                    <SpeakButton text={s.replace(/…/g, '')} compact />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="font-semibold text-ink">NATO alphabet</h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-1.5">
          {NATO.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => speakText(`${w[0]} as in ${w}`, 0.9)}
              className="rounded-lg border border-border-subtle px-2 py-1.5 text-start hover:border-clay-soft"
            >
              <span className="text-base font-bold text-clay-soft-dark">{w[0]}</span> <span className="text-xs text-ink">{w}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-ink">Every phrase</h3>
          <label className="relative">
            <Search size={14} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-ink-lighter" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search phrases"
              className="ps-8 pe-3 py-1.5 rounded-lg border border-border-subtle bg-transparent text-sm text-ink w-48 focus:outline-none focus:ring-2 focus:ring-clay-soft/40"
            />
          </label>
        </div>
        <div className="space-y-3">
          {sets.map((s) => (
            <details key={s.id} open={!!query}>
              <summary className="cursor-pointer text-sm font-medium text-ink">
                {s.title} <span className="text-ink-light font-normal">({s.phrases.length})</span>
              </summary>
              <ul className="mt-1.5 space-y-1">
                {s.phrases.map((p) => (
                  <li key={p.text} className="flex items-start gap-2 text-sm">
                    <div className="flex-1">
                      <span className="text-ink">{p.text}</span> <span className="text-xs text-ink-light">· to {p.use}</span>
                    </div>
                    <SpeakButton text={p.text.replace(/…/g, '')} compact />
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-ink">Typing practice</h3>
          <select value={textId} onChange={(e) => setTextId(e.target.value)} className="rounded-lg border border-border-subtle bg-transparent px-2 py-1 text-sm text-ink" aria-label="Text">
            {TYPING_TEXTS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
        <TypingTest key={textId} textId={textId} target={TYPING_TARGETS[level]} />
      </Card>

      <RecommendedTools />

      <Card className="space-y-2">
        <h3 className="font-semibold text-ink">Free tools</h3>
        <ul className="space-y-2">
          {FREE_TOOLS.map((t) => (
            <li key={t.id} className="text-sm">
              <a href={t.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-clay-soft hover:underline">
                {t.name} <ExternalLink size={12} />
              </a>
              <span className="text-ink-light"> · {t.what}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

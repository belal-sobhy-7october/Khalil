import { useMemo, useState } from 'react';
import { ChevronDown, Search, Shuffle } from 'lucide-react';
import { QUESTIONS } from '../../data/callCenter';
import { QUESTION_GROUPS } from '../../data/callCenter/interview';
import type { QuestionGroup } from '../../data/callCenter/types';
import { useCallCenter } from './CallCenterContext';
import QuestionCard from './QuestionCard';
import { ArabicNote, Card, Pill, primaryBtn } from './ui';

/** The interview question bank, and a random-question drill. */
export default function InterviewView() {
  const { answers } = useCallCenter();
  const [group, setGroup] = useState<QuestionGroup | 'all'>('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [drill, setDrill] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return QUESTIONS.filter((x) => (group === 'all' || x.group === group) && (!q || x.q.toLowerCase().includes(q)));
  }, [group, query]);

  const shuffle = () => {
    const pool = list.length ? list : QUESTIONS;
    const others = pool.filter((x) => x.id !== drill);
    const next = others[Math.floor(Math.random() * others.length)] ?? pool[0];
    setDrill(next.id);
  };

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-ink">Random question drill</h3>
            <p className="text-xs text-ink-light">Like a real interviewer: a question you didn't choose. Answer out loud before you look at anything.</p>
          </div>
          <button type="button" onClick={shuffle} className={primaryBtn}>
            <Shuffle size={13} /> {drill ? 'Another one' : 'Ask me a question'}
          </button>
        </div>
        {drill && (
          <div className="border-t border-border-subtle pt-3">
            <QuestionCard key={drill} questionId={drill} showQuestion />
          </div>
        )}
      </Card>

      <ArabicNote>
        كل سؤال فيه: هما بيختبروا إيه، إجابة نموذجية (اتعلم منها، متحفظهاش حرفياً)، غلطات الناس، ومكان تكتب إجابتك وتسجلها. الإجابة المحفوظة بتبان من أول جملة.
      </ArabicNote>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
          {[{ id: 'all' as const, name: 'All' }, ...QUESTION_GROUPS].map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={group === g.id}
              onClick={() => setGroup(g.id)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs border transition-colors ${
                group === g.id ? 'border-clay-soft bg-clay-soft/10 text-clay-soft-dark font-medium' : 'border-border-subtle text-ink-light hover:text-ink'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
        <label className="relative ms-auto">
          <Search size={14} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-ink-lighter" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            className="ps-8 pe-3 py-1.5 rounded-lg border border-border-subtle bg-transparent text-sm text-ink w-48 focus:outline-none focus:ring-2 focus:ring-clay-soft/40"
          />
        </label>
      </div>

      <div className="space-y-2">
        {list.map((q) => (
          <div key={q.id} className="rounded-2xl border border-border-subtle bg-card">
            <button type="button" onClick={() => setOpen(open === q.id ? null : q.id)} aria-expanded={open === q.id} className="w-full flex items-center gap-3 p-3 sm:p-4 text-start">
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-ink">{q.q}</span>
                <span className="mt-0.5 flex flex-wrap gap-1.5">
                  <Pill>{QUESTION_GROUPS.find((g) => g.id === q.group)?.name}</Pill>
                  {answers[q.id]?.text && <Pill tone="good">Your answer saved</Pill>}
                </span>
              </span>
              <ChevronDown size={16} className={`shrink-0 text-ink-light transition-transform ${open === q.id ? 'rotate-180' : ''}`} />
            </button>
            {open === q.id && (
              <div className="px-3 sm:px-4 pb-4 border-t border-border-subtle pt-3">
                <QuestionCard questionId={q.id} />
              </div>
            )}
          </div>
        ))}
        {!list.length && <p className="text-sm text-ink-light">No question matches.</p>}
      </div>
    </div>
  );
}

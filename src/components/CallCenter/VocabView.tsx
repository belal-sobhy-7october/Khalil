import { useMemo, useState } from 'react';
import { ChevronDown, ClipboardCheck, MonitorPlay, Search, SearchCheck } from 'lucide-react';
import { VOCAB_UNITS, VOCAB_WORDS } from '../../data/callCenter';
import { VOCAB_CHECK_ID } from '../../data/callCenter/plan';
import { bestAttempt } from '../../lib/callCenter/progress';
import { MY_WORDS_CATEGORY, SPRINT_DAYS, VOCAB_TARGET, bankCards, isKnown, myWordCards, sprintDay, unitStatus, unitsDueBy, vocabProgress, wordKey } from '../../lib/callCenter/vocab';
import { getPronunciationPrefs, speakWord } from '../../lib/pronunciation';
import { useAppStore } from '../../store/appStore';
import { getToday } from '../../store/dateHelpers';
import { ProgressBar, ProgressRing } from '../English/CourseVisuals';
import CheckMeaningsModal from '../Vocabulary/CheckMeaningsModal';
import VocabularyCard from '../Vocabulary/VocabularyCard';
import { NewWordButton, VocabDue, VocabPractice, VocabUnitStudy, YouGlishRun } from './activities/VocabActivity';
import { useCallCenter } from './CallCenterContext';
import { ArabicNote, Card, Pill, primaryBtn, secondaryBtn } from './ui';

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl bg-ink/4 px-3 py-2">
      <div className="text-base font-bold text-ink tabular-nums leading-tight">{value}</div>
      <div className="text-[11px] text-ink-light leading-tight">{label}</div>
    </div>
  );
}

/** Where the month stands: day, pace and the goal. */
function sprintLine(day: number, unitsAdded: number, ratio: number): { text: string; tone: 'good' | 'warn' | 'neutral' } {
  if (!day) return { text: 'The month starts the day you add Unit 1 to your flashcards.', tone: 'neutral' };
  if (day > SPRINT_DAYS) {
    return ratio >= VOCAB_TARGET
      ? { text: `Month done: ${Math.floor(ratio * 100)}% known. Keep the daily review going.`, tone: 'good' }
      : { text: `Day ${day}: past the month, ${Math.floor(ratio * 100)}% known. Keep going until 90%.`, tone: 'warn' };
  }
  const behind = unitsDueBy(day) - unitsAdded;
  return behind > 0
    ? { text: `Day ${day} of ${SPRINT_DAYS} · ${behind} unit${behind === 1 ? '' : 's'} behind: do two today.`, tone: 'warn' }
    : { text: `Day ${day} of ${SPRINT_DAYS} · on track`, tone: 'good' };
}

/**
 * Words you met yourself and saved with "New word": same flashcards, same daily review.
 * Each one can be heard, flagged hard, corrected or deleted, as in the Vocabulary section.
 */
function MyWords() {
  const items = useAppStore((s) => s.vocabularyItems);
  const categories = useAppStore((s) => s.vocabularyCategories);
  const updateVocabularyItem = useAppStore((s) => s.updateVocabularyItem);
  const deleteVocabularyItem = useAppStore((s) => s.deleteVocabularyItem);
  const mine = useMemo(() => myWordCards(items, categories).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [items, categories]);
  const group = categories.find((c) => c.name.trim().toLowerCase() === MY_WORDS_CATEGORY.toLowerCase());
  const [practice, setPractice] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? mine : mine.slice(0, 12);
  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-ink">My words</h3>
          {mine.length > 0 && (
            <Pill>
              {mine.length} saved · {mine.filter(isKnown).length} known
            </Pill>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <NewWordButton className={primaryBtn} label="Add words" />
          {mine.length > 0 && (
            <button type="button" onClick={() => setPractice(true)} className={secondaryBtn}>
              Practice them
            </button>
          )}
          {mine.length > 0 && group && (
            <button type="button" onClick={() => setChecking(true)} className={secondaryBtn} title="Find words saved with a meaning that doesn't fit how they're used here">
              <SearchCheck size={13} /> Check meanings
            </button>
          )}
        </div>
      </div>
      <ArabicNote>
        أي كلمة أو فعل أو جملة جديدة تقابلك في درس أو فيديو أو امتحان، دوس «New word» (فوق في القسم، أو جوه الامتحان). بتدخل نفس الفلاش كاردز وبترجعلك في المراجعة اليومية مع كلمات البنك.
      </ArabicNote>
      {mine.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shown.map((c) => (
              <VocabularyCard
                key={c.id}
                item={c}
                onEdit={(data) => void updateVocabularyItem(c.id, data)}
                onDelete={() => void deleteVocabularyItem(c.id)}
                onSpeak={(text) => void speakWord(text, getPronunciationPrefs().accent)}
              />
            ))}
          </div>
          {mine.length > shown.length && (
            <button type="button" onClick={() => setShowAll(true)} className={secondaryBtn}>
              Show all {mine.length}
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-ink-light">Nothing saved yet.</p>
      )}
      {practice && <VocabPractice ids={mine.map((c) => c.id)} onClose={() => setPractice(false)} />}
      {checking && group && <CheckMeaningsModal category={group} onClose={() => setChecking(false)} />}
    </Card>
  );
}

/** The word bank: 384 call center words, a unit a day, 90% known in a month. */
export default function VocabView({ onRunTest }: { onRunTest: (testId: string) => void }) {
  const { vocab, tests } = useCallCenter();
  const items = useAppStore((s) => s.vocabularyItems);
  const progress = useMemo(() => vocabProgress(items), [items]);
  const cards = useMemo(() => bankCards(items), [items]);
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [run, setRun] = useState<{ words: string[]; start: number } | null>(null);
  const day = sprintDay(vocab.startedAt, getToday());
  const pace = sprintLine(day, progress.unitsAdded, progress.ratio);
  const best = bestAttempt(tests[VOCAB_CHECK_ID]);
  const heard = VOCAB_WORDS.filter((w) => vocab.heard?.[wordKey(w.word)]).length;
  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return VOCAB_WORDS.filter((w) => w.word.toLowerCase().includes(q) || w.definition.toLowerCase().includes(q)).slice(0, 30);
  }, [query]);

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="flex items-start gap-4">
          <ProgressRing ratio={Math.min(1, progress.ratio / VOCAB_TARGET)} size={76} stroke={7} label="Words known, out of the 90% goal">
            <span className="text-base font-bold text-ink tabular-nums">{Math.floor(progress.ratio * 100)}%</span>
          </ProgressRing>
          <div className="flex-1 min-w-0 space-y-1">
            <h2 className="text-xl font-bold text-ink">Call Center Vocabulary</h2>
            <p className="text-sm text-ink-light">
              {progress.total} words in {VOCAB_UNITS.length} units, one a day in Level 1. Goal: 90% known ({Math.ceil(VOCAB_TARGET * progress.total)} words) within {SPRINT_DAYS} days.
            </p>
            <Pill tone={pace.tone === 'warn' ? 'warn' : pace.tone === 'good' ? 'good' : 'neutral'}>{pace.text}</Pill>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Stat value={`${progress.known} / ${progress.total}`} label="Known (mastery 3+)" />
          <Stat value={progress.added} label="In your flashcards" />
          <Stat value={progress.due.length} label="Due today" />
          <Stat value={heard} label="Heard on YouGlish" />
        </div>
        <ArabicNote>
          كل يوم وحدة فيها 16 كلمة: اسمع كل كلمة على YouGlish من ناس أمريكان حقيقيين، اقرا النص واسمعه، وبعدين ضيفها للفلاش كاردز وراجعها. المراجعة بترجعلك لوحدها في ميعادها. لو مشيت يوم بيوم، بعد 30 يوم هتكون عارف 90% من الكلمات دي.
        </ArabicNote>
        <VocabDue />
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border-subtle">
          <button type="button" onClick={() => onRunTest(VOCAB_CHECK_ID)} className={primaryBtn}>
            <ClipboardCheck size={13} /> Vocab check (40 questions)
          </button>
          {best ? <Pill tone={best.passed ? 'good' : 'neutral'}>Best: {best.percent}% · goal 90%</Pill> : <span className="text-xs text-ink-light">A new sample of the bank every time.</span>}
        </div>
      </Card>

      <MyWords />

      <Card className="space-y-2">
        <h3 className="font-semibold text-ink">The 24 units</h3>
        <ul className="space-y-2">
          {VOCAB_UNITS.map((unit) => {
            const s = unitStatus(unit, cards);
            const isOpen = open === unit.id;
            return (
              <li key={unit.id} className="rounded-xl border border-border-subtle">
                <button type="button" onClick={() => setOpen(isOpen ? null : unit.id)} aria-expanded={isOpen} className="w-full flex items-center gap-3 px-3 py-2.5 text-start">
                  <span className="w-8 text-xs font-semibold text-ink-light tabular-nums">{String(unit.number).padStart(2, '0')}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-ink">{unit.title}</span>
                    <ProgressBar ratio={s.known / s.total} size="sm" label={`${unit.title}: words known`} />
                  </span>
                  <span className="text-xs text-ink-light tabular-nums shrink-0">
                    {s.added ? `${s.known} / ${s.total} known` : 'Not started'}
                  </span>
                  <ChevronDown size={15} className={`shrink-0 text-ink-light transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-3 pb-4 pt-1 border-t border-border-subtle">
                    <VocabUnitStudy unit={unit} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-ink">Find a word</h3>
          <label className="relative w-full sm:w-auto">
            <Search size={14} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-ink-light" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the 384 words"
              className="w-full ps-8 pe-3 py-1.5 rounded-lg border border-border-subtle bg-transparent text-sm text-ink placeholder:text-ink-lighter"
            />
          </label>
        </div>
        {found.length > 0 && (
          <ul className="divide-y divide-border-subtle">
            {found.map((w, i) => (
              <li key={w.word} className="flex items-start gap-2 py-2">
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-ink">{w.word}</span> <span className="text-[11px] text-ink-light">{w.pos} · unit {Number(w.unitId.slice(1))}</span>
                  <p className="text-sm text-ink-light">{w.definition}</p>
                </div>
                <button type="button" onClick={() => setRun({ words: found.map((x) => x.word), start: i })} className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-clay-soft/10 text-clay-soft-dark hover:bg-clay-soft/20">
                  <MonitorPlay size={13} /> YouGlish
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {run && <YouGlishRun words={run.words} start={run.start} onClose={() => setRun(null)} />}
    </div>
  );
}

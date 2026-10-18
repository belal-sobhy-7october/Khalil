import { Fragment, useMemo, useState } from 'react';
import { BookPlus, Check, Flame, Layers, MonitorPlay, Plus, Trophy } from 'lucide-react';
import { getVocabUnit } from '../../../data/callCenter';
import { vocabCategory, type VocabUnit } from '../../../data/callCenter/vocab';
import type { VocabularyItem } from '../../../types';
import { MY_WORDS_CATEGORY, bankCards, isKnown, myWordCards, unitStatus, vocabProgress, wordKey } from '../../../lib/callCenter/vocab';
import { useAppStore } from '../../../store/appStore';
import { SESSION_SIZE, isHardWord } from '../../../store/vocabularyHard';
import FlashcardReview from '../../Vocabulary/FlashcardReview';
import QuickAddModal from '../../Vocabulary/QuickAddModal';
import ReviewModePicker, { type ReviewMode } from '../../Vocabulary/ReviewModePicker';
import TopicChallenge from '../../Vocabulary/TopicChallenge';
import TypingPractice from '../../Vocabulary/TypingPractice';
import YouGlishModal from '../../Vocabulary/YouGlishModal';
import { useCallCenter } from '../CallCenterContext';
import { NeedsInternet, Pill, ReadAloud, SpeakButton, primaryBtn, secondaryBtn } from '../ui';

/** The Vocabulary section's own practice (cards, listening, gap-fill) on a set of flashcards. */
export function VocabPractice({ ids, onClose }: { ids: string[]; onClose: () => void }) {
  const [mode, setMode] = useState<ReviewMode | null>(null);
  const [queue, setQueue] = useState(ids);
  if (!mode) return <ReviewModePicker count={ids.length} onPick={setMode} onClose={onClose} />;
  if (mode === 'cards') return <FlashcardReview key={queue.join()} initialItemIds={queue} onClose={onClose} onReviewMissed={setQueue} />;
  return <TypingPractice mode={mode} initialItemIds={queue} onClose={onClose} />;
}

/** Steps through words on YouGlish, noting each one as heard. */
export function YouGlishRun({ words, start, onClose }: { words: string[]; start: number; onClose: () => void }) {
  const { markHeard } = useCallCenter();
  const [index, setIndex] = useState(start);
  const go = (i: number) => {
    setIndex(i);
    markHeard([words[i]]);
  };
  return (
    <YouGlishModal
      word={words[index]}
      onClose={onClose}
      nav={{ index, total: words.length, onPrev: () => go(index - 1), onNext: () => go(index + 1) }}
    />
  );
}

/**
 * "New word": save a word you met (in a lesson, a video, a test) to your
 * flashcards, in the My words group: looked up in the dictionary, then
 * reviewed with the bank in the daily review.
 */
export function NewWordButton({ className = secondaryBtn, label = 'New word' }: { className?: string; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} title="Save a word you just met to your flashcards">
        <Plus size={13} /> {label}
      </button>
      {open && <QuickAddModal onClose={() => setOpen(false)} defaultCategory={MY_WORDS_CATEGORY} />}
    </>
  );
}

export function MasteryDots({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5" title={`Mastery ${level} of 5`} aria-label={`Mastery ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={`w-1.5 h-1.5 rounded-full ${n <= level ? 'bg-sage-soft' : 'bg-ink/15'}`} />
      ))}
    </span>
  );
}

/** The unit's text with its words in bold. */
function Highlighted({ text, words }: { text: string; words: string[] }) {
  const parts = useMemo(() => {
    const sorted = [...words].sort((a, b) => b.length - a.length).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    // "developed" for "develop", "tickets" for "ticket".
    return text.split(new RegExp(`\\b((?:${sorted.join('|')})(?:s|es|d|ed|ing)?)\\b`, 'gi'));
  }, [text, words]);
  return (
    <>
      {parts.map((part, i) => (i % 2 ? <strong key={i} className="font-semibold text-clay-soft-dark">{part}</strong> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}

/** Flag a word as hard (or not): hard words come back every day, first in the review. */
function HardToggle({ card }: { card: VocabularyItem }) {
  const updateVocabularyItem = useAppStore((s) => s.updateVocabularyItem);
  const hard = isHardWord(card);
  return (
    <button
      type="button"
      onClick={() => void updateVocabularyItem(card.id, { isHard: !card.isHard })}
      aria-pressed={!!card.isHard}
      aria-label={card.isHard ? `"${card.word}" is marked hard: unmark it` : `Mark "${card.word}" as hard`}
      title={card.isHard ? 'Marked hard: comes back every day. Click to unmark.' : hard ? 'Hard (you missed it): comes back every day' : 'Mark as hard: it comes back every day'}
      className={`shrink-0 p-1.5 rounded-lg transition-colors ${hard ? 'text-red-500 bg-red-500/10' : 'text-ink-lighter hover:text-red-500 hover:bg-red-500/10'}`}
    >
      <Flame size={14} />
    </button>
  );
}

/** One unit of the word bank: hear the words, read them in a text, put them in the flashcards, practice, then use them. */
export function VocabUnitStudy({ unit, onPracticed }: { unit: VocabUnit; onPracticed?: () => void }) {
  const { vocab, markHeard, startVocab } = useCallCenter();
  const items = useAppStore((s) => s.vocabularyItems);
  const categories = useAppStore((s) => s.vocabularyCategories);
  const importVocabularyItems = useAppStore((s) => s.importVocabularyItems);
  const cards = useMemo(() => bankCards(items), [items]);
  const status = unitStatus(unit, cards);
  const category = categories.find((c) => c.name.trim().toLowerCase() === vocabCategory(unit).toLowerCase());
  const [run, setRun] = useState<number | null>(null);
  const [practice, setPractice] = useState(false);
  const [challenge, setChallenge] = useState(false);
  const [adding, setAdding] = useState<'idle' | 'adding' | 'failed'>('idle');
  const words = unit.words.map((w) => w.word);
  const heard = words.filter((w) => vocab.heard?.[wordKey(w)]).length;
  const allAdded = status.added === status.total;

  const openRun = (i: number) => {
    setRun(i);
    markHeard([words[i]]);
  };

  const add = async () => {
    setAdding('adding');
    const r = await importVocabularyItems(
      unit.words.map((w) => ({ word: w.word, type: w.type, definition: w.definition, exampleSentence: w.example })),
      { duplicateMode: 'skip', categoryForAll: vocabCategory(unit) }
    );
    setAdding(r.failed ? 'failed' : 'idle');
    if (!r.failed) startVocab();
  };

  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-ink">1 · Hear every word in real videos</h4>
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={heard === words.length ? 'good' : 'neutral'}>
              YouGlish: {heard} / {words.length}
            </Pill>
            <button type="button" onClick={() => openRun(Math.max(0, words.findIndex((w) => !vocab.heard?.[wordKey(w)])))} className={primaryBtn}>
              <MonitorPlay size={13} /> {heard ? 'Carry on' : 'Hear all 16'} on YouGlish
            </button>
            <NeedsInternet />
          </div>
        </div>
        <p className="text-xs text-ink-light">Listen to three or four clips of each word, then say the example out loud like the speakers.</p>
        <ul className="divide-y divide-border-subtle rounded-xl border border-border-subtle">
          {unit.words.map((w, i) => {
            const card = cards.get(wordKey(w.word));
            return (
              <li key={w.word} className="flex items-start gap-2 px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink">{w.word}</span>
                    <span className="text-[11px] text-ink-light">{w.pos}</span>
                    {card && <MasteryDots level={card.masteryLevel} />}
                    {isKnown(card) && <Check size={13} className="text-sage-soft-dark" aria-label="Known" />}
                  </div>
                  <p className="text-sm text-ink">{w.definition}</p>
                  <p className="text-xs text-ink-light italic">{w.example}</p>
                </div>
                {card && <HardToggle card={card} />}
                <SpeakButton text={`${w.word}. ${w.example}`} />
                <button
                  type="button"
                  onClick={() => openRun(i)}
                  aria-label={`Hear "${w.word}" on YouGlish`}
                  className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                    vocab.heard?.[wordKey(w.word)] ? 'bg-sage-soft/15 text-sage-soft-dark' : 'bg-clay-soft/10 text-clay-soft-dark hover:bg-clay-soft/20'
                  }`}
                >
                  <MonitorPlay size={13} /> YouGlish
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-ink">2 · Read and hear them in a text</h4>
        <p className="rounded-xl bg-ink/3 px-3 py-2.5 text-sm leading-relaxed text-ink">
          <Highlighted text={unit.text} words={words} />
        </p>
        <ReadAloud text={unit.text} />
      </section>

      <section className="space-y-2">
        <h4 className="text-sm font-semibold text-ink">3 · Make them yours: flashcards</h4>
        <div className="flex flex-wrap items-center gap-2">
          {!allAdded && (
            <button type="button" onClick={() => void add()} disabled={adding === 'adding'} className={`${primaryBtn} disabled:opacity-50`}>
              <BookPlus size={13} /> {adding === 'adding' ? 'Adding…' : `Add the ${status.total - status.added} words to my flashcards`}
            </button>
          )}
          {status.added > 0 && (
            <button type="button" onClick={() => setPractice(true)} className={allAdded ? primaryBtn : secondaryBtn}>
              <Layers size={13} /> Practice them now
            </button>
          )}
          <Pill tone={status.known === status.total ? 'good' : 'neutral'}>
            {status.added} in flashcards · {status.known} known
          </Pill>
        </div>
        {adding === 'failed' && <p className="text-xs text-red-600 dark:text-red-400">Couldn't add them. Check your internet and try again.</p>}
        <p className="text-xs text-ink-light">
          They go into Learn English → Vocabulary under “{vocabCategory(unit)}”, and come back for review on the days they're due.
        </p>
      </section>

      {status.added > 0 && category && (
        <section className="space-y-2">
          <h4 className="text-sm font-semibold text-ink">4 · Use them: the unit challenge</h4>
          <p className="text-xs text-ink-light">
            Say every word into the mic until it's recognized, read the unit's text aloud and record yourself, shadow a video, then talk 10 minutes with an AI playing a customer.
          </p>
          <button type="button" onClick={() => setChallenge(true)} className={secondaryBtn}>
            <Trophy size={13} /> Start the challenge
          </button>
        </section>
      )}

      {run !== null && <YouGlishRun words={words} start={run} onClose={() => setRun(null)} />}
      {challenge && category && <TopicChallenge category={category} paragraph={unit.text} onClose={() => setChallenge(false)} />}
      {practice && (
        <VocabPractice
          ids={status.ids}
          onClose={() => {
            setPractice(false);
            if (allAdded) onPracticed?.();
          }}
        />
      )}
    </div>
  );
}

/** The daily review: the bank's words that are due, hardest first. */
export function VocabDue({ onDone }: { onDone?: () => void }) {
  const items = useAppStore((s) => s.vocabularyItems);
  const categories = useAppStore((s) => s.vocabularyCategories);
  const progress = useMemo(() => vocabProgress(items, new Date(), myWordCards(items, categories)), [items, categories]);
  const [practice, setPractice] = useState<string[] | null>(null);
  const [run, setRun] = useState<number | null>(null);
  const hardWords = progress.hard.slice(0, 12).map((c) => c.word);
  // Rounds of 30, hardest first, like the Vocabulary section's review; the rest stay due for the next round.
  const round = progress.reviewDue.slice(0, SESSION_SIZE);
  const due = progress.reviewDue.length;

  if (!progress.added && !progress.mine.total) {
    return <p className="text-sm text-ink-light">No call center words in your flashcards yet: they start with Unit 1 on the first day of Level 1.</p>;
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {due ? (
          <button type="button" onClick={() => setPractice(round)} className={primaryBtn}>
            <Layers size={13} /> {due > round.length ? `Review ${round.length} of ${due} due words` : `Review ${due} due word${due === 1 ? '' : 's'}`}
          </button>
        ) : (
          <Pill tone="good">Nothing due today ✓</Pill>
        )}
        {progress.hard.length > 0 && (
          <button type="button" onClick={() => setPractice(progress.hard.map((c) => c.id))} className={secondaryBtn}>
            Practice your {progress.hard.length} hardest
          </button>
        )}
        <span className="text-xs text-ink-light tabular-nums">
          {progress.known} / {progress.total} known{progress.mine.total ? ` · ${progress.mine.total} of your own` : ''}
        </span>
      </div>
      {hardWords.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-xs text-ink-light">Hard ones: hear them again on YouGlish</div>
          <div className="flex flex-wrap gap-1.5">
            {hardWords.map((w, i) => (
              <button key={w} type="button" onClick={() => setRun(i)} className={secondaryBtn}>
                <MonitorPlay size={12} /> {w}
              </button>
            ))}
          </div>
        </div>
      )}
      {run !== null && <YouGlishRun words={hardWords} start={run} onClose={() => setRun(null)} />}
      {practice && (
        <VocabPractice
          ids={practice}
          onClose={() => {
            setPractice(null);
            onDone?.();
          }}
        />
      )}
    </div>
  );
}

/** A plan task: a new unit, or the daily review (`due`). */
export default function VocabActivity({ refId, onDone }: { refId: string; onDone: () => void }) {
  if (refId === 'due') return <VocabDue onDone={onDone} />;
  const unit = getVocabUnit(refId);
  return unit ? <VocabUnitStudy unit={unit} onPracticed={onDone} /> : null;
}

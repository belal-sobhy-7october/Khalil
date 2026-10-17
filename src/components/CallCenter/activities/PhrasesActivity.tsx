import { useState } from 'react';
import { BookmarkPlus, Eye, Headphones, RotateCcw, Square } from 'lucide-react';
import { getPhraseSet } from '../../../data/callCenter';
import { useAddToFlashcards } from '../useFlashcards';
import { speakLines } from '../../../lib/callCenter/voice';
import { NaturalReaderButton, SpeakButton, primaryBtn, secondaryBtn } from '../ui';
import { useSavedProgress } from '../useSavedProgress';

/** A phrase set: listen, then practice saying each phrase from its use alone. */
export default function PhrasesActivity({ refId, onDone, progressKey = `phrases:${refId}` }: { refId: string; onDone: () => void; progressKey?: string }) {
  const set = getPhraseSet(refId);
  // Where you are in the practice round, saved so it resumes.
  const [round, setRound, clearRound] = useSavedProgress<{ practice: boolean; index: number }>(progressKey, { practice: false, index: 0 });
  const { practice, index } = round;
  const setPractice = (on: boolean) => setRound((r) => ({ ...r, practice: on }));
  const setIndex = (i: number) => setRound((r) => ({ ...r, index: i }));
  const [shown, setShown] = useState(false);
  const [playing, setPlaying] = useState<number>(-1);
  const [stopper, setStopper] = useState<(() => void) | null>(null);
  const flash = useAddToFlashcards();
  if (!set) return <p className="text-sm text-ink-light">This phrase set is missing.</p>;

  const all = set.phrases.map((p) => p.text).join(' ');
  const listen = () => {
    if (stopper) {
      stopper();
      setStopper(null);
      return;
    }
    const stop = speakLines(
      set.phrases.map((p) => ({ text: p.text })),
      {
        onLine: (i) => {
          setPlaying(i);
          if (i === -1) setStopper(null);
        },
      }
    );
    setStopper(() => stop);
  };

  const next = () => {
    setShown(false);
    if (index + 1 >= set.phrases.length) {
      clearRound();
      onDone();
    } else setIndex(index + 1);
  };

  const current = set.phrases[index];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={listen} className={secondaryBtn}>
          {stopper ? <Square size={13} /> : <Headphones size={13} />} {stopper ? 'Stop' : 'Listen to all'}
        </button>
        <NaturalReaderButton text={all} />
        <button type="button" onClick={() => void flash.add(`Call Center: ${set.title}`, set.phrases)} className={secondaryBtn}>
          <BookmarkPlus size={13} /> Add to my flashcards
        </button>
      </div>
      {flash.status && <p className="text-[11px] text-sage-soft-dark">{flash.status}</p>}

      {practice ? (
        <div className="rounded-xl border border-clay-soft/40 bg-clay-soft/5 p-4 space-y-3">
          <div className="text-xs text-ink-light tabular-nums">
            {index + 1} / {set.phrases.length}
          </div>
          <p className="text-sm text-ink">
            Say the phrase you'd use to <strong>{current.use}</strong>.
          </p>
          {shown ? (
            <div className="flex items-start gap-1">
              <p className="flex-1 font-semibold text-ink">{current.text}</p>
              <SpeakButton text={current.text} />
            </div>
          ) : (
            <button type="button" onClick={() => setShown(true)} className={secondaryBtn}>
              <Eye size={13} /> Show it
            </button>
          )}
          {shown && (
            <div className="flex gap-2">
              <button type="button" onClick={next} className={primaryBtn}>
                I said it right
              </button>
              <button
                type="button"
                onClick={() => {
                  setShown(false);
                }}
                className={secondaryBtn}
              >
                <RotateCcw size={13} /> Try again
              </button>
            </div>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => setPractice(true)} className={primaryBtn}>
          Practice: say each one from memory
        </button>
      )}

      <ul className="divide-y divide-border-subtle">
        {set.phrases.map((p, i) => (
          <li key={p.text} className={`py-2 flex items-start gap-2 ${playing === i ? 'bg-clay-soft/5 -mx-2 px-2 rounded-lg' : ''}`}>
            <div className="flex-1 min-w-0">
              <p className="text-ink font-medium leading-snug">{p.text}</p>
              {p.insteadOf && <p className="text-xs text-red-600/80 dark:text-red-400/80 line-through decoration-1">{p.insteadOf}</p>}
              <p className="text-xs text-ink-light">to {p.use}</p>
            </div>
            <SpeakButton text={p.text} />
          </li>
        ))}
      </ul>
    </div>
  );
}

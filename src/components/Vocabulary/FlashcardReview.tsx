import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, PlayCircle, Flame, Eye, Clock, Lightbulb, Check } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { useDialog } from '../../lib/useDialog';
import { useKv } from '../../lib/useKv';
import { speakWord, getPronunciationPrefs } from '../../lib/pronunciation';
import { isHardWord, buildDueQueue } from '../../store/vocabularyHard';
import {
  GRADES, GRADE_NAMES, LEARN_AHEAD_MS, OWN_SENTENCES_KEY, bucketOf, cardOf, dueSummary, gradeOptions, isLeech,
  type GradeOption, type SrsGrade,
} from '../../lib/srs';
import { useSrsSettings } from '../../lib/useSrsSettings';
import { useWaitLabel } from '../../lib/useWaitLabel';
import type { VocabularyItem } from '../../types';
import YouGlishModal from './YouGlishModal';

type Phase = 'question' | 'answer' | 'finished';
type Waiting = Array<{ id: string; due: number }>;

const GRADE_STYLE: Record<SrsGrade, string> = {
  1: 'bg-red-500 hover:bg-red-600',
  2: 'bg-amber-500 hover:bg-amber-600',
  3: 'bg-green-600 hover:bg-green-700',
  4: 'bg-sky-600 hover:bg-sky-700',
};

const EMPTY_GRADED: Record<SrsGrade, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

/**
 * A review session the way Anki runs one: see the word, try to recall it,
 * show the answer, then grade yourself Again / Hard / Good / Easy — each
 * button says when the word comes back. Words in their learning steps come
 * back in the same session (after a minute, then ten).
 */
export default function FlashcardReview({ onClose, initialItemIds, onReviewMissed, onFinished }: {
  onClose: () => void;
  initialItemIds?: string[];
  onReviewMissed?: (ids: string[]) => void;
  /** Called once when the session ends with at least one word reviewed. */
  onFinished?: (reviewed: number) => void;
}) {
  const { t } = useTranslation();
  const waitLabel = useWaitLabel();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const vocabularyCategories = useAppStore((s) => s.vocabularyCategories);
  const submitVocabularyReview = useAppStore((s) => s.submitVocabularyReview);
  const [settings] = useSrsSettings();
  const [ownSentences, setOwnSentences] = useKv<Record<string, string>>(OWN_SENTENCES_KEY, {});
  const dialog = useDialog(onClose);

  // The words of the session, fixed when it starts; words that come back
  // within it (learning steps) wait in `waiting` until they're due.
  const [queue, setQueue] = useState<string[]>(() =>
    initialItemIds && initialItemIds.length > 0 ? initialItemIds : buildDueQueue(vocabularyItems, new Date(), settings).map((i) => i.id)
  );
  const [pos, setPos] = useState(() => (queue.length ? 1 : 0));
  const [waiting, setWaiting] = useState<Waiting>([]);
  const [currentId, setCurrentId] = useState<string | null>(() => queue[0] ?? null);
  const [phase, setPhase] = useState<Phase>(() => (queue.length ? 'question' : 'finished'));
  const [options, setOptions] = useState<Record<SrsGrade, GradeOption> | null>(null);
  const [graded, setGraded] = useState<Record<SrsGrade, number>>(EMPTY_GRADED);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const [showYouGlish, setShowYouGlish] = useState(false);
  const [draft, setDraft] = useState('');
  const [sessionStart, setSessionStart] = useState(() => Date.now());
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const cardShownAt = useRef(0);
  const reported = useRef(false);

  const byId = useMemo(() => new Map(vocabularyItems.map((i) => [i.id, i])), [vocabularyItems]);
  const currentItem = currentId ? byId.get(currentId) : undefined;
  const currentCategory = currentItem ? vocabularyCategories.find((c) => c.id === currentItem.categoryId) : undefined;
  const prefs = getPronunciationPrefs();
  const reviewed = graded[1] + graded[2] + graded[3] + graded[4];

  useEffect(() => {
    cardShownAt.current = Date.now();
  }, []);

  /** Shows the next word: a learning step that's due, else the next in the queue, else the earliest step (learn ahead). */
  const advance = useCallback(
    (from: number, wait: Waiting, list: string[] = queue) => {
      const now = Date.now();
      const live = wait.filter((w) => byId.has(w.id)).sort((a, b) => a.due - b.due);
      let next = from;
      while (next < list.length && !byId.has(list[next])) next += 1;
      let pick: string | null = null;
      let rest = live;
      if (live.length && (live[0].due <= now || next >= list.length)) {
        pick = live[0].id;
        rest = live.slice(1);
      } else if (next < list.length) {
        pick = list[next];
        next += 1;
      }
      setPos(next);
      setWaiting(rest);
      setOptions(null);
      setShowYouGlish(false);
      setDraft('');
      cardShownAt.current = now;
      setCurrentId(pick);
      setPhase(pick ? 'question' : 'finished');
      if (!pick) setFinishedAt(now);
    },
    [byId, queue]
  );

  useEffect(() => {
    if (phase === 'finished' && reviewed > 0 && !reported.current) {
      reported.current = true;
      onFinished?.(reviewed);
    }
  }, [phase, reviewed, onFinished]);

  const reveal = useCallback(() => {
    if (!currentItem || phase !== 'question') return;
    setOptions(gradeOptions(currentItem, new Date(), settings));
    setPhase('answer');
  }, [currentItem, phase, settings]);

  const grade = useCallback(
    (g: SrsGrade) => {
      if (!currentItem || !options || phase !== 'answer') return;
      const option = options[g];
      void submitVocabularyReview(currentItem.id, g === 1 ? 'incorrect' : 'correct', Date.now() - cardShownAt.current, option.card);
      setGraded((prev) => ({ ...prev, [g]: prev[g] + 1 }));
      if (g === 1) setMissedIds((prev) => (prev.includes(currentItem.id) ? prev : [...prev, currentItem.id]));
      advance(pos, option.wait <= LEARN_AHEAD_MS ? [...waiting, { id: currentItem.id, due: Date.now() + option.wait }] : waiting);
    },
    [currentItem, options, phase, waiting, pos, submitVocabularyReview, advance]
  );

  /** Another round of what's due now (the session size caps each round). */
  const continueSession = () => {
    const ids = buildDueQueue(vocabularyItems, new Date(), settings).map((i) => i.id);
    setQueue(ids);
    setGraded(EMPTY_GRADED);
    setMissedIds([]);
    reported.current = false;
    setSessionStart(Date.now());
    setFinishedAt(null);
    advance(0, [], ids);
  };

  // Keyboard: Space / Enter shows the answer, then 1–4 grade (Space / Enter = Good).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showYouGlish || e.defaultPrevented) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      const confirm = e.key === ' ' || e.key === 'Enter';
      // A focused button handles Space / Enter itself.
      if (confirm && (tag === 'BUTTON' || tag === 'A')) return;
      if (phase === 'question' && confirm) {
        e.preventDefault();
        reveal();
      } else if (phase === 'answer') {
        const n = Number(e.key);
        if (n >= 1 && n <= 4) {
          e.preventDefault();
          grade(n as SrsGrade);
        } else if (confirm) {
          e.preventDefault();
          grade(3);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, reveal, grade, showYouGlish]);

  // What's left, Anki style: new / learning / review.
  const left = useMemo(() => {
    const counts = { new: 0, learning: 0, review: 0 };
    const ids = [...queue.slice(pos), ...waiting.map((w) => w.id)];
    if (currentId && phase !== 'finished') ids.push(currentId);
    for (const id of ids) {
      const item = byId.get(id);
      if (item) counts[bucketOf(cardOf(item))] += 1;
    }
    return counts;
  }, [queue, pos, waiting, currentId, phase, byId]);

  const saveSentence = (item: VocabularyItem) => {
    const text = draft.trim();
    if (text) setOwnSentences((m) => ({ ...m, [item.id]: text }));
  };

  const shell = (children: React.ReactNode, wide = false) => (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div {...dialog.props} className={`bg-card border border-border-subtle rounded-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[92vh] overflow-y-auto`}>
        {children}
      </div>
    </div>
  );

  // Summary (or nothing to review)
  if (phase === 'finished') {
    const now = new Date();
    const summary = dueSummary(vocabularyItems, now, settings);
    const moreDue = summary.learning + summary.review + summary.newToday;
    const missedItems = missedIds.map((id) => byId.get(id)).filter((i): i is VocabularyItem => !!i);
    const remembered = reviewed ? Math.round(((reviewed - graded[1]) / reviewed) * 100) : 0;
    const minutes = Math.max(1, Math.round(((finishedAt ?? sessionStart) - sessionStart) / 60000));
    return shell(
      <div className="p-6">
        <h2 id={dialog.titleId} className="text-2xl font-bold text-ink mb-1">
          {reviewed ? t('vocabulary.reviewComplete') : t('vocabulary.srs.caughtUp')}
        </h2>
        {reviewed > 0 ? (
          <div className="space-y-4 my-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              {GRADES.map((g) => (
                <div key={g} className="rounded-lg bg-ink/5 p-2">
                  <div className="text-lg font-bold text-ink tabular-nums">{graded[g]}</div>
                  <div className="text-[11px] text-ink-light">{t(`vocabulary.srs.grade.${GRADE_NAMES[g]}`)}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-ink" data-testid="srs-summary">
              {t('vocabulary.srs.summary').replace('{count}', String(reviewed)).replace('{p}', String(remembered)).replace('{m}', String(minutes))}
            </p>
          </div>
        ) : (
          <p className="text-ink-light my-3">{t('vocabulary.allWordsMastered')}</p>
        )}
        {summary.nextAt && moreDue === 0 && (
          <p className="text-sm text-ink-light flex items-center gap-1.5 mb-4">
            <Clock size={14} /> {t('vocabulary.srs.nextAt').replace('{t}', waitLabel(Date.parse(summary.nextAt) - now.getTime()))}
          </p>
        )}

        {missedItems.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-bold text-ink mb-2">{t('vocabulary.missedWords')}</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {missedItems.map((item) => (
                <div key={item.id} className="bg-ink/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-ink" dir="ltr">{item.word}</p>
                    {isHardWord(item) && (
                      <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium flex items-center gap-1">
                        <Flame size={10} />
                        {t('vocabulary.hardBadge')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-ink-light" dir="auto">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {moreDue > 0 && !initialItemIds?.length && (
            <button onClick={continueSession} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              {t('vocabulary.srs.continue').replace('{count}', String(moreDue))}
            </button>
          )}
          {missedItems.length > 0 && onReviewMissed && (
            <button onClick={() => onReviewMissed(missedIds)} className="w-full px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors">
              {t('vocabulary.reviewMissedAgain')}
            </button>
          )}
          <button onClick={onClose} className="w-full px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors">
            {t('common.close')}
          </button>
        </div>
      </div>
    );
  }

  // The word was deleted while the session was open.
  if (!currentItem) {
    return shell(
      <div className="p-6 text-center">
        <button onClick={() => advance(pos, waiting)} className="px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors">
          {t('common.next')}
        </button>
      </div>
    );
  }
  const card = cardOf(currentItem);
  const hard = isHardWord(currentItem);
  const leech = isLeech(card);
  const own = ownSentences[currentItem.id];

  return (
    <>
      {shell(
        <>
          {/* Header: what's left, Anki style */}
          <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm tabular-nums" role="group" aria-label={t('vocabulary.srs.left')} data-testid="srs-left">
              <span className="text-sky-600" title={t('vocabulary.srs.bucket.new')}>{left.new}</span>
              <span className="text-red-500" title={t('vocabulary.srs.bucket.learning')}>{left.learning}</span>
              <span className="text-green-600" title={t('vocabulary.srs.bucket.review')}>{left.review}</span>
              <span className="text-xs text-ink-lighter">{t(`vocabulary.srs.bucket.${bucketOf(card)}`)}</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-ink/5 rounded-lg transition-colors" aria-label={t('common.close')}>
              <X size={20} className="text-ink-light" />
            </button>
          </div>

          <div className="p-6">
            {/* No exit animation: the next card shows at once, so reviews stay quick. */}
            <motion.div
              key={`${currentItem.id}:${phase}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Front */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex items-center gap-3 flex-wrap justify-center">
                  <h2 id={dialog.titleId} className="text-4xl font-bold text-ink" dir="ltr">{currentItem.word}</h2>
                  <button onClick={() => void speakWord(currentItem.word, prefs.accent)} className="p-2 hover:bg-ink/10 rounded-full transition-colors" aria-label={t('vocabulary.pronounce')}>
                    <Volume2 size={24} className="text-ink-light" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-ink-light flex-wrap justify-center">
                  <span className="px-3 py-1 bg-ink/10 rounded-full">{currentItem.type}</span>
                  {currentCategory && <span className="px-3 py-1 bg-clay-soft/10 text-clay-soft rounded-full" dir="auto">{currentCategory.name}</span>}
                  {hard && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium flex items-center gap-1" title={t('vocabulary.srs.hardHint')}>
                      <Flame size={12} />
                      {leech ? t('vocabulary.srs.leechBadge') : t('vocabulary.hardBadge')}
                    </span>
                  )}
                </div>
              </div>

              {phase === 'question' ? (
                <div className="mt-8 space-y-3">
                  <p className="text-center text-sm text-ink-light">{t('vocabulary.srs.recallFirst')}</p>
                  <button onClick={reveal} className="w-full px-6 py-3 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors flex items-center justify-center gap-2">
                    <Eye size={18} /> {t('vocabulary.srs.showAnswer')}
                  </button>
                  <p className="text-xs text-ink-lighter text-center">{t('vocabulary.srs.keysQuestion')}</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div className="bg-clay-soft/5 rounded-xl p-5 space-y-3">
                    <p className="text-ink" dir="auto">{currentItem.definition}</p>
                    {currentItem.exampleSentence && <p className="text-ink-light italic" dir="ltr">{currentItem.exampleSentence}</p>}
                    {own && (
                      <p className="text-sm text-ink">
                        <span className="text-xs text-ink-lighter me-1">{t('vocabulary.srs.yourSentence')}:</span>
                        <span dir="ltr">{own}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      {currentItem.pronunciation && <span className="text-sm text-ink-light" dir="ltr">{currentItem.pronunciation}</span>}
                      <button onClick={() => setShowYouGlish(true)} className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-ink/5 text-ink hover:bg-ink/10" aria-label={t('vocabulary.pronounceYouGlish')}>
                        <PlayCircle size={14} /> YouGlish
                      </button>
                    </div>
                  </div>

                  {/* Words that keep slipping get a new hook: your own sentence. */}
                  {hard && (
                    <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                        <Lightbulb size={16} className="text-amber-500" />
                        {leech ? t('vocabulary.srs.leechTitle') : t('vocabulary.srs.hardTitle')}
                      </div>
                      <p className="text-xs text-ink-light">{t('vocabulary.srs.hardTips')}</p>
                      <div className="flex gap-2">
                        <input
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveSentence(currentItem);
                          }}
                          dir="ltr"
                          placeholder={t('vocabulary.srs.sentencePlaceholder')}
                          aria-label={t('vocabulary.srs.yourSentence')}
                          className="flex-1 min-w-0 px-3 py-1.5 bg-card border border-border-subtle rounded-lg text-sm text-ink placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft"
                        />
                        <button
                          onClick={() => saveSentence(currentItem)}
                          disabled={!draft.trim()}
                          className="px-3 py-1.5 text-sm rounded-lg bg-amber-500 text-white disabled:opacity-40 flex items-center gap-1"
                        >
                          <Check size={14} /> {t('vocabulary.srs.saveSentence')}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-2">
                    {GRADES.map((g) => (
                      <button
                        key={g}
                        onClick={() => grade(g)}
                        className={`flex flex-col items-center gap-0.5 px-2 py-2.5 rounded-lg text-white transition-colors ${GRADE_STYLE[g]}`}
                      >
                        <span className="text-sm font-semibold">{t(`vocabulary.srs.grade.${GRADE_NAMES[g]}`)}</span>
                        <span className="text-[11px] opacity-90 tabular-nums" data-testid={`srs-wait-${g}`}>{options ? waitLabel(options[g].wait) : ''}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-ink-lighter text-center">{t('vocabulary.srs.keysAnswer')}</p>
                </div>
              )}
            </motion.div>
          </div>
        </>,
        true
      )}

      {showYouGlish && <YouGlishModal word={currentItem.word} onClose={() => setShowYouGlish(false)} />}
    </>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Volume2, Snail, Check, X as XIcon, Eye, RotateCw } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { speakBrowser, speakWord, getPronunciationPrefs } from '../../lib/pronunciation';
import { buildGap, gradeAnswer, type Grade } from '../../lib/practice';
import { buildDueQueue } from '../../store/vocabularyHard';
import { gradeOptions, type SrsGrade } from '../../lib/srs';
import { useSrsSettings } from '../../lib/useSrsSettings';

export type TypingMode = 'listen' | 'gap';

interface TypingPracticeProps {
  mode: TypingMode;
  initialItemIds?: string[];
  onClose: () => void;
}

export default function TypingPractice({ mode, initialItemIds, onClose }: TypingPracticeProps) {
  const { t } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const submitVocabularyReview = useAppStore((s) => s.submitVocabularyReview);
  const [settings] = useSrsSettings();
  const accent = getPronunciationPrefs().accent;

  const [queue, setQueue] = useState<string[]>(() =>
    initialItemIds && initialItemIds.length > 0 ? initialItemIds : buildDueQueue(vocabularyItems, new Date(), settings).map((i) => i.id)
  );
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [grade, setGrade] = useState<Grade | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState<Record<string, Grade>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const startRef = useRef(0);

  const item = vocabularyItems.find((i) => i.id === queue[index]);
  const finished = index >= queue.length;

  // In "complete the sentence", blank the word out of its example; words
  // without a usable example fall back to "type the word for this definition".
  const gap = useMemo(() => (item && mode === 'gap' ? buildGap(item.word, item.exampleSentence) : null), [item, mode]);
  const expected = gap?.answer ?? item?.word ?? '';

  useEffect(() => {
    if (!item) return;
    startRef.current = Date.now();
    inputRef.current?.focus();
    if (mode === 'listen') void speakWord(item.word, accent);
  }, [item, mode, accent]);

  const check = (given: string = answer) => {
    if (!item || grade) return;
    const g = gradeAnswer(given, expected);
    setGrade(g);
    setResults((r) => ({ ...r, [item.id]: g }));
    // The spaced-repetition grade: right = Good, a typo or right with the hint = Hard, wrong = Again.
    const srsGrade: SrsGrade = g === 'wrong' ? 1 : g === 'close' || showHint ? 2 : 3;
    const next = gradeOptions(item, new Date(), settings)[srsGrade].card;
    void submitVocabularyReview(item.id, g === 'wrong' ? 'incorrect' : 'correct', Date.now() - startRef.current, next);
    if (mode === 'gap' || g !== 'correct') void speakWord(item.word, accent);
  };

  const next = () => {
    setAnswer('');
    setGrade(null);
    setShowHint(false);
    setIndex((i) => i + 1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (grade) next();
      else check();
    }
    if (e.key === 'Escape') onClose();
  };

  const missed = Object.entries(results).filter(([, g]) => g === 'wrong').map(([id]) => id);
  const correctCount = Object.values(results).filter((g) => g !== 'wrong').length;

  const restartWith = (ids: string[]) => {
    setQueue(ids);
    setIndex(0);
    setResults({});
    setAnswer('');
    setGrade(null);
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onKeyDown={onKeyDown}>
      <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-xl max-h-[90svh] overflow-y-auto flex flex-col">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">
              {t(mode === 'listen' ? 'vocabulary.practice.listenTitle' : 'vocabulary.practice.gapTitle')}
            </h2>
            {!finished && queue.length > 0 && (
              <p className="text-xs text-ink-light tabular-nums">{index + 1} / {queue.length}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-ink/5 rounded-lg transition-colors" aria-label={t('common.close')}>
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        {!finished && queue.length > 0 && (
          <div className="h-1 bg-ink/5">
            <div className="h-full bg-clay-soft transition-all" style={{ width: `${(index / queue.length) * 100}%` }} />
          </div>
        )}

        <div className="p-6" dir="ltr">
          {queue.length === 0 ? (
            <p className="text-center text-ink-light py-8" dir="auto">{t('vocabulary.allWordsMastered')}</p>
          ) : finished ? (
            <div className="text-center space-y-4 py-4" dir="auto">
              <p className="text-4xl font-bold text-ink tabular-nums">{correctCount} / {queue.length}</p>
              <p className="text-ink-light">{t('vocabulary.practice.done')}</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {missed.length > 0 && (
                  <button
                    onClick={() => restartWith(missed)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <RotateCw size={16} />
                    {t('vocabulary.practice.retryMissed').replace('{count}', String(missed.length))}
                  </button>
                )}
                <button onClick={onClose} className="px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors">
                  {t('common.close')}
                </button>
              </div>
            </div>
          ) : item ? (
            <div className="space-y-5">
              {mode === 'listen' ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => void speakWord(item.word, accent)}
                      className="w-16 h-16 rounded-full bg-clay-soft text-white flex items-center justify-center hover:bg-clay-soft-dark transition-colors"
                      aria-label={t('vocabulary.practice.playAgain')}
                    >
                      <Volume2 size={28} />
                    </button>
                    <button
                      onClick={() => speakBrowser(item.word, accent, 0.55)}
                      className="w-16 h-16 rounded-full bg-ink/5 text-ink flex items-center justify-center hover:bg-ink/10 transition-colors"
                      aria-label={t('vocabulary.practice.playSlow')}
                      title={t('vocabulary.practice.playSlow')}
                    >
                      <Snail size={24} />
                    </button>
                  </div>
                  {showHint ? (
                    <p className="text-sm text-ink-light text-center">{item.definition}</p>
                  ) : (
                    <button onClick={() => setShowHint(true)} className="flex items-center gap-1 text-xs text-ink-lighter hover:text-ink">
                      <Eye size={12} /> {t('vocabulary.practice.showHint')}
                    </button>
                  )}
                </div>
              ) : gap ? (
                <p className="text-lg text-ink leading-relaxed text-center">
                  {gap.before}
                  <span className="inline-block min-w-[5rem] border-b-2 border-clay-soft mx-1 text-clay-soft font-semibold">
                    {grade ? gap.answer : ' '}
                  </span>
                  {gap.after}
                </p>
              ) : (
                <div className="text-center space-y-1">
                  <p className="text-xs text-ink-lighter uppercase tracking-wide">{t('vocabulary.practice.typeTheWord')}</p>
                  <p className="text-lg text-ink">{item.definition}</p>
                </div>
              )}

              {mode === 'gap' && gap && (
                <p className="text-xs text-ink-light text-center">{item.definition}</p>
              )}

              <input
                ref={inputRef}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                readOnly={grade !== null}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder={t('vocabulary.practice.placeholder')}
                className={`w-full px-4 py-3 text-lg text-center rounded-xl border-2 bg-ink/5 text-ink focus:outline-none transition-colors ${
                  grade === 'correct'
                    ? 'border-green-500'
                    : grade === 'close'
                      ? 'border-amber-500'
                      : grade === 'wrong'
                        ? 'border-red-500'
                        : 'border-border-subtle focus:border-clay-soft'
                }`}
              />

              {grade && (
                <div
                  className={`flex items-center justify-center gap-2 text-sm font-medium ${
                    grade === 'correct' ? 'text-green-600' : grade === 'close' ? 'text-amber-600' : 'text-red-500'
                  }`}
                  dir="auto"
                >
                  {grade === 'wrong' ? <XIcon size={16} /> : <Check size={16} />}
                  {grade === 'correct' && t('vocabulary.practice.correct')}
                  {grade !== 'correct' && (
                    <span>
                      {t(grade === 'close' ? 'vocabulary.practice.almost' : 'vocabulary.practice.answerWas')}{' '}
                      <span dir="ltr" className="font-bold">{expected}</span>
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={() => (grade ? next() : check())}
                disabled={!grade && !answer.trim()}
                className="w-full py-3 rounded-xl bg-clay-soft text-white font-medium hover:bg-clay-soft-dark disabled:opacity-40 transition-colors"
              >
                {grade ? t('vocabulary.practice.next') : t('vocabulary.practice.check')}
              </button>
              {!grade && (
                <button
                  onClick={() => check('')}
                  className="w-full text-xs text-ink-lighter hover:text-ink"
                >
                  {t('vocabulary.practice.dontKnow')}
                </button>
              )}
            </div>
          ) : (
            // The current word was deleted mid-session: skip it.
            <button onClick={next} className="w-full py-3 rounded-xl bg-ink/5 text-ink">{t('vocabulary.practice.next')}</button>
          )}
        </div>
      </div>
    </div>
  );
}

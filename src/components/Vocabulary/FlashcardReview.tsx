import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Check, X as XIcon, PlayCircle, Flame } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { speakWord, getPronunciationPrefs } from '../../lib/pronunciation';
import { isHardWord, buildReviewQueue } from '../../store/vocabularyHard';
import YouGlishModal from './YouGlishModal';

type Phase = 'question' | 'answer' | 'finished';

export default function FlashcardReview({ onClose, initialItemIds, onReviewMissed }: { onClose: () => void; initialItemIds?: string[]; onReviewMissed?: (ids: string[]) => void }) {
  const { t } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const vocabularyCategories = useAppStore((s) => s.vocabularyCategories);
  const submitVocabularyReview = useAppStore((s) => s.submitVocabularyReview);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('question');
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [missedIds, setMissedIds] = useState<string[]>([]);
  const [showYouGlish, setShowYouGlish] = useState(false);
  const [reaskedIds, setReaskedIds] = useState<Set<string>>(new Set());
  const [queueIds, setQueueIds] = useState<string[]>(() => {
    if (initialItemIds && initialItemIds.length > 0) {
      return initialItemIds;
    }
    // Filter to items that need review (masteryLevel <= 2) or are hard words
    const needsReview = vocabularyItems.filter(
      (item) => item.masteryLevel <= 2 || isHardWord(item)
    );
    const queue = buildReviewQueue(needsReview);
    return queue.map((item) => item.id);
  });

  const cardStartTimeRef = useRef<number>(0);

  // Load voices when component mounts and initialize card start time
  useEffect(() => {
    cardStartTimeRef.current = Date.now();
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Reset card start time when moving to a new card
  useEffect(() => {
    cardStartTimeRef.current = Date.now();
  }, [currentIndex]);

  // Look up the current item by id from the live store (skip if deleted)
  const currentId = queueIds[currentIndex];
  const currentItem = currentId ? vocabularyItems.find((item) => item.id === currentId) : undefined;
  const currentCategory = currentItem ? vocabularyCategories.find((c) => c.id === currentItem.categoryId) : undefined;

  // Calculate actual progress (skip deleted items)
  const remainingIds = queueIds.filter((id) => vocabularyItems.some((item) => item.id === id));
  const actualIndex = queueIds.slice(0, currentIndex).filter((id) => vocabularyItems.some((item) => item.id === id)).length;
  const totalRemaining = remainingIds.length;
  const prefs = getPronunciationPrefs();

  const handleSpeak = useCallback((text: string) => {
    void speakWord(text, prefs.accent);
  }, [prefs.accent]);

  const handleCorrect = useCallback(() => {
    if (!currentItem) return;

    const timeTaken = Date.now() - cardStartTimeRef.current;
    // Fire and forget - don't await
    const result = submitVocabularyReview(currentItem.id, 'correct', timeTaken);
    if (result && typeof result.catch === 'function') {
      result.catch((err) => {
        console.error('Failed to submit review:', err);
      });
    }

    setCorrectCount((prev) => prev + 1);

    // Flash green then auto-advance
    setTimeout(() => {
      if (currentIndex < queueIds.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setPhase('question');
      } else {
        setPhase('finished');
      }
    }, 300);
  }, [currentItem, currentIndex, queueIds.length, submitVocabularyReview]);

  const handleIncorrect = useCallback(() => {
    if (!currentItem) return;

    const timeTaken = Date.now() - cardStartTimeRef.current;
    // Fire and forget - don't await
    const result = submitVocabularyReview(currentItem.id, 'incorrect', timeTaken);
    if (result && typeof result.catch === 'function') {
      result.catch((err) => {
        console.error('Failed to submit review:', err);
      });
    }

    setIncorrectCount((prev) => prev + 1);
    setMissedIds((prev) => [...prev, currentItem.id]);

    // Spaced re-ask: re-insert this item ~3-4 cards later in the same session (once)
    if (!reaskedIds.has(currentItem.id)) {
      const reaskIndex = currentIndex + 3 + Math.floor(Math.random() * 2); // 3-4 cards later
      if (reaskIndex < queueIds.length) {
        setQueueIds((prev) => {
          const next = [...prev];
          next.splice(reaskIndex, 0, currentItem.id);
          return next;
        });
      } else {
        // If near end, append to end
        setQueueIds((prev) => [...prev, currentItem.id]);
      }
      setReaskedIds((prev) => new Set(prev).add(currentItem.id));
    }

    setPhase('answer');
  }, [currentItem, submitVocabularyReview, currentIndex, queueIds.length, reaskedIds]);

  const handleNext = useCallback(() => {
    if (currentIndex < queueIds.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPhase('question');
    } else {
      setPhase('finished');
    }
  }, [currentIndex, queueIds.length]);

  const handleReviewMissed = useCallback(() => {
    if (onReviewMissed && missedIds.length > 0) {
      onReviewMissed(missedIds);
    }
    onClose();
  }, [onClose, onReviewMissed, missedIds]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'question') {
        if (e.key === 'ArrowRight' || e.key === '1') {
          e.preventDefault();
          handleCorrect();
        } else if (e.key === 'ArrowLeft' || e.key === '2') {
          e.preventDefault();
          handleIncorrect();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      } else if (phase === 'answer') {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNext();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      } else if (phase === 'finished') {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleCorrect, handleIncorrect, handleNext, onClose]);

  // Empty state
  if (queueIds.length === 0 || totalRemaining === 0) {
    return (
      <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-md p-6 text-center">
          <h2 className="text-xl font-bold text-ink mb-2">{t('vocabulary.noWordsToReview')}</h2>
          <p className="text-ink-light mb-4">{t('vocabulary.allWordsMastered')}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    );
  }

  // Summary screen
  if (phase === 'finished') {
    const totalReviewed = correctCount + incorrectCount;
    const accuracy = totalReviewed > 0 ? Math.round((correctCount / totalReviewed) * 100) : 0;
    const missedItems = missedIds
      .map((id) => vocabularyItems.find((item) => item.id === id))
      .filter((item): item is NonNullable<typeof item> => item !== undefined);

    return (
      <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-ink mb-4">{t('vocabulary.reviewComplete')}</h2>
          <div className="space-y-2 mb-6">
            <p className="text-ink-light">{t('vocabulary.correctCount')}: {correctCount}</p>
            <p className="text-ink-light">{t('vocabulary.incorrectCount')}: {incorrectCount}</p>
            <p className="text-ink font-bold">{t('vocabulary.accuracy')}: {accuracy}%</p>
          </div>

          {missedItems.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-ink mb-3">{t('vocabulary.missedWords')}</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {missedItems.map((item) => (
                  <div key={item.id} className="bg-ink/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-ink">{item.word}</p>
                      {isHardWord(item) && (
                        <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium flex items-center gap-1">
                          <Flame size={10} />
                          {t('vocabulary.hardBadge')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink-light">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            {missedItems.length > 0 && (
              <button
                onClick={handleReviewMissed}
                className="w-full px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
              >
                {t('vocabulary.reviewMissedAgain')}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Skip deleted items
  if (!currentItem) {
    if (currentIndex < queueIds.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return null;
    }
    setPhase('finished');
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-2xl">
          {/* Header with progress bar */}
          <div className="px-6 py-4 border-b border-border-subtle">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-ink-light">
                {t('vocabulary.card')} {actualIndex + 1} / {totalRemaining}
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-ink/5 rounded-lg transition-colors"
              >
                <X size={20} className="text-ink-light" />
              </button>
            </div>
            <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-clay-soft"
                initial={{ width: 0 }}
                animate={{ width: `${((actualIndex + 1) / totalRemaining) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {phase === 'question' && (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[300px] flex flex-col items-center justify-center"
                >
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <h2 className="text-4xl font-bold text-ink">{currentItem.word}</h2>
                    {isHardWord(currentItem) && (
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium flex items-center gap-1">
                        <Flame size={12} />
                        {t('vocabulary.hardBadge')}
                      </span>
                    )}
                    <button
                      onClick={() => handleSpeak(currentItem.word)}
                      className="p-2 hover:bg-ink/10 rounded-full transition-colors"
                    >
                      <Volume2 size={24} className="text-ink-light" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-light mb-6 flex-wrap">
                    <span className="px-3 py-1 bg-ink/10 rounded-full">{currentItem.type}</span>
                    {currentCategory && (
                      <span className="px-3 py-1 bg-clay-soft/10 text-clay-soft rounded-full">{currentCategory.name}</span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={handleIncorrect}
                      className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <XIcon size={20} />
                      <span>{t('vocabulary.iDontKnowIt')}</span>
                    </button>
                    <button
                      onClick={handleCorrect}
                      className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={20} />
                      <span>{t('vocabulary.iKnowIt')}</span>
                    </button>
                  </div>

                  <p className="text-xs text-ink-lighter mt-4 text-center">
                    {t('vocabulary.iKnowIt')} (→ or 1) • {t('vocabulary.iDontKnowIt')} (← or 2) • {t('common.close')} (Esc)
                  </p>
                </motion.div>
              )}

              {phase === 'answer' && (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[300px]"
                >
                  <div className="bg-clay-soft/5 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-ink mb-3">{t('vocabulary.definition')}</h3>
                    <p className="text-ink mb-4">{currentItem.definition}</p>

                    {currentItem.exampleSentence && (
                      <>
                        <h3 className="text-lg font-bold text-ink mb-3">{t('vocabulary.exampleSentence')}</h3>
                        <p className="text-ink-light italic mb-4">{currentItem.exampleSentence}</p>
                      </>
                    )}

                    {currentItem.pronunciation && (
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-lg font-bold text-ink">{t('vocabulary.pronunciation')}</h3>
                        <p className="text-ink-light">{currentItem.pronunciation}</p>
                        <button
                          onClick={() => handleSpeak(currentItem.word)}
                          className="p-1 hover:bg-ink/10 rounded-full transition-colors"
                          title={t('vocabulary.pronounce')}
                        >
                          <Volume2 size={18} className="text-ink-light" />
                        </button>
                        <button
                          onClick={() => setShowYouGlish(true)}
                          className="p-1 hover:bg-ink/10 rounded-full transition-colors"
                          title={t('vocabulary.pronounceYouGlish')}
                        >
                          <PlayCircle size={18} className="text-ink-light" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full mt-6 px-6 py-3 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
                  >
                    {t('common.next')} (Enter)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showYouGlish && currentItem && (
        <YouGlishModal
          word={currentItem.word}
          onClose={() => setShowYouGlish(false)}
        />
      )}
    </>
  );
}

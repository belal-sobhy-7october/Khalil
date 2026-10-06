import { useState, useEffect } from 'react';
import { X, Volume2, RotateCcw, Check, X as XIcon } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';

export default function FlashcardReview({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const vocabularyCategories = useAppStore((s) => s.vocabularyCategories);
  const submitVocabularyReview = useAppStore((s) => s.submitVocabularyReview);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Filter items that need review (mastery level <= 2)
  const reviewItems = vocabularyItems.filter((item) => item.masteryLevel <= 2);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentIndex]);

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const currentItem = reviewItems[currentIndex];
  const currentCategory = currentItem ? vocabularyCategories.find((c) => c.id === currentItem.categoryId) : undefined;

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Try to get English US voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.includes('en-US'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      utterance.onstart = () => console.log('Speech started');
      utterance.onend = () => console.log('Speech ended');
      utterance.onerror = (e) => console.error('Speech error:', e);
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported in this browser');
    }
  };

  const handleResult = async (result: 'correct' | 'incorrect' | 'skipped') => {
    if (!currentItem) return;

    const timeTaken = Date.now() - startTime;
    await submitVocabularyReview(currentItem.id, result, timeTaken);

    if (result === 'correct') {
      setCorrectCount((prev) => prev + 1);
    }
    setReviewedCount((prev) => prev + 1);

    if (currentIndex < reviewItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setStartTime(Date.now());
    }
  };

  const handleNext = () => {
    if (currentIndex < reviewItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setStartTime(Date.now());
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setStartTime(Date.now());
    }
  };

  if (reviewItems.length === 0) {
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

  if (reviewedCount >= reviewItems.length) {
    const accuracy = Math.round((correctCount / reviewedCount) * 100);
    return (
      <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-md p-6 text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">{t('vocabulary.reviewComplete')}</h2>
          <div className="space-y-2 mb-6">
            <p className="text-ink-light">{t('vocabulary.reviewedCount')}: {reviewedCount}</p>
            <p className="text-green-600">{t('vocabulary.correctCount')}: {correctCount}</p>
            <p className="text-ink font-bold">{t('vocabulary.accuracy')}: {accuracy}%</p>
          </div>
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

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-2xl">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-light">{t('vocabulary.card')} {currentIndex + 1} / {reviewItems.length}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ink/5 rounded-lg transition-colors"
          >
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative min-h-[300px] perspective-1000">
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front */}
              <div className={`absolute inset-0 backface-hidden ${isFlipped ? 'hidden' : 'block'}`}>
                <div className="bg-ink/5 rounded-xl p-8 h-full flex flex-col items-center justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-4xl font-bold text-ink">{currentItem.word}</h2>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(currentItem.word);
                      }}
                      className="p-2 hover:bg-ink/10 rounded-full transition-colors"
                    >
                      <Volume2 size={24} className="text-ink-light" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-ink-light">
                    <span className="px-3 py-1 bg-ink/10 rounded-full">{currentItem.type}</span>
                    {currentCategory && (
                      <span className="px-3 py-1 bg-clay-soft/10 text-clay-soft rounded-full">{currentCategory.name}</span>
                    )}
                  </div>
                  <p className="text-sm text-ink-lighter mt-4">{t('vocabulary.tapToReveal')}</p>
                </div>
              </div>

              {/* Back */}
              <div className={`absolute inset-0 backface-hidden rotate-y-180 ${isFlipped ? 'block' : 'hidden'}`}>
                <div className="bg-clay-soft/5 rounded-xl p-8 h-full">
                  <h3 className="text-lg font-bold text-ink mb-3">{t('vocabulary.definition')}</h3>
                  <p className="text-ink mb-4">{currentItem.definition}</p>

                  {currentItem.exampleSentence && (
                    <>
                      <h3 className="text-lg font-bold text-ink mb-3">{t('vocabulary.exampleSentence')}</h3>
                      <p className="text-ink-light italic mb-4">{currentItem.exampleSentence}</p>
                    </>
                  )}

                  {currentItem.pronunciation && (
                    <>
                      <h3 className="text-lg font-bold text-ink mb-2">{t('vocabulary.pronunciation')}</h3>
                      <p className="text-ink-light mb-4">{currentItem.pronunciation}</p>
                    </>
                  )}

                  <div className="flex items-center gap-2 mt-6">
                    <span className="text-sm text-ink-light">{t('vocabulary.masteryLevel')}:</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < currentItem.masteryLevel ? 'bg-yellow-400' : 'bg-ink-lighter'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw size={18} />
              <span>{t('common.previous')}</span>
            </button>

            <div className="flex gap-2">
              {!isFlipped ? (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="px-6 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
                >
                  {t('vocabulary.reveal')}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleResult('incorrect')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <XIcon size={18} />
                    <span>{t('vocabulary.incorrect')}</span>
                  </button>
                  <button
                    onClick={() => handleResult('correct')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Check size={18} />
                    <span>{t('vocabulary.correct')}</span>
                  </button>
                </>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === reviewItems.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{t('common.next')}</span>
              <RotateCcw size={18} className="rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

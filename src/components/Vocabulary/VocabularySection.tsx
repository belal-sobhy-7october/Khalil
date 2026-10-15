import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Flame, Upload, Library, Sparkles, PlayCircle, Languages, Compass, Trophy } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import { speakWord, getPronunciationPrefs } from '../../lib/pronunciation';
import { isHardWord, buildReviewQueue, buildDueQueue } from '../../store/vocabularyHard';
import VocabularyForm from './VocabularyForm';
import VocabularyCard from './VocabularyCard';
import CategoryManager from './CategoryManager';
import FlashcardReview from './FlashcardReview';
import ImportWordsModal from './ImportWordsModal';
import TopicLibraryModal from './TopicLibraryModal';
import QuickAddModal from './QuickAddModal';
import ConvertToEnglishModal from './ConvertToEnglishModal';
import ReviewModePicker, { type ReviewMode } from './ReviewModePicker';
import TypingPractice from './TypingPractice';
import ResourcesModal from './ResourcesModal';
import TopicChallenge from './TopicChallenge';
import { hasArabicDefinition } from '../../lib/arabicText';
import type { VocabularyItemType } from '../../types';

export default function VocabularySection() {
  const { t, tn } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const vocabularyCategories = useAppStore((s) => s.vocabularyCategories);
  const addVocabularyItem = useAppStore((s) => s.addVocabularyItem);
  const deleteVocabularyItem = useAppStore((s) => s.deleteVocabularyItem);
  const updateVocabularyItem = useAppStore((s) => s.updateVocabularyItem);
  const getVocabularyStats = useAppStore((s) => s.getVocabularyStats);

  const [showForm, setShowForm] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showConvert, setShowConvert] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [reviewItemIds, setReviewItemIds] = useState<string[] | undefined>(undefined);
  // Every review entry point goes through the mode picker first.
  const [pickerIds, setPickerIds] = useState<string[] | null>(null);
  const [typingMode, setTypingMode] = useState<'listen' | 'gap' | null>(null);

  const openReview = (ids?: string[]) => setPickerIds(ids ?? buildDueQueue(vocabularyItems).map((i) => i.id));

  const startMode = (mode: ReviewMode) => {
    const ids = pickerIds ?? undefined;
    setPickerIds(null);
    setReviewItemIds(ids);
    if (mode === 'cards') setShowReview(true);
    else setTypingMode(mode);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<VocabularyItemType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  const [filterHardOnly, setFilterHardOnly] = useState(false);

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

  const stats = getVocabularyStats();

  const filteredItems = vocabularyItems.filter((item) => {
    const matchesSearch = 
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesCategory = filterCategory === 'all' || item.categoryId === filterCategory;
    const matchesHard = !filterHardOnly || isHardWord(item);
    return matchesSearch && matchesType && matchesCategory && matchesHard;
  });

  // Per-topic word count and average mastery, for the topic chips.
  const topicStats = useMemo(() => {
    const map = new Map<string, { count: number; mastery: number }>();
    for (const item of vocabularyItems) {
      const key = item.categoryId ?? '';
      const cur = map.get(key) ?? { count: 0, mastery: 0 };
      map.set(key, { count: cur.count + 1, mastery: cur.mastery + item.masteryLevel });
    }
    return map;
  }, [vocabularyItems]);

  const arabicCount = useMemo(() => vocabularyItems.filter(hasArabicDefinition).length, [vocabularyItems]);

  const selectedCategory = vocabularyCategories.find((c) => c.id === filterCategory);

  const startTopicReview = () => {
    const ids = vocabularyItems.filter((i) => i.categoryId === filterCategory).map((i) => i.id);
    if (ids.length === 0) return;
    openReview(ids);
  };

  const prefs = getPronunciationPrefs();

  const handleSpeak = (text: string) => {
    void speakWord(text, prefs.accent);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">{t('nav.vocabulary')}</h1>
          <p className="text-ink-light">{t('vocabulary.description')}</p>
        </div>
        <button
          onClick={() => setShowResources(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border-subtle text-ink-light hover:text-ink hover:bg-ink/5 transition-colors"
        >
          <Compass size={16} />
          {t('vocabulary.resources.open')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-2xl font-bold text-ink">{stats.total}</div>
          <div className="text-sm text-ink-light">{t('vocabulary.totalWords')}</div>
        </div>
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600">{stats.mastered}</div>
          <div className="text-sm text-ink-light">{t('vocabulary.mastered')}</div>
        </div>
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-2xl font-bold text-orange-500">{stats.needReview}</div>
          <div className="text-sm text-ink-light">{t('vocabulary.needReview')}</div>
        </div>
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-2xl font-bold text-red-500">{stats.hard}</div>
          <div className="text-sm text-ink-light">{t('vocabulary.hardWords')}</div>
        </div>
      </div>

      {arabicCount > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3 p-3 rounded-xl border border-clay-soft/40 bg-clay-soft/5">
          <Languages size={18} className="text-clay-soft shrink-0" />
          <p className="flex-1 text-sm text-ink min-w-[12rem]">
            {tn('vocabulary.convert.banner', arabicCount)}
          </p>
          <button
            onClick={() => setShowConvert(true)}
            className="px-3 py-1.5 bg-clay-soft text-white text-sm rounded-lg hover:bg-clay-soft-dark transition-colors"
          >
            {t('vocabulary.convert.open')}
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowLibrary(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ink text-card rounded-lg hover:opacity-90 transition-opacity"
        >
          <Library size={18} />
          <span>{t('vocabulary.library.open')}</span>
        </button>
        <button
          onClick={() => setShowQuickAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
        >
          <Sparkles size={18} />
          <span>{t('vocabulary.quickAdd.open')}</span>
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors"
        >
          <Plus size={18} />
          <span>{t('vocabulary.addWord')}</span>
        </button>
        <button
          onClick={() => setShowCategories(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors"
        >
          <Filter size={18} />
          <span>{t('vocabulary.manageCategories')}</span>
        </button>
        <button
          onClick={() => {
            openReview();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <span>{t('vocabulary.startReview')}</span>
        </button>
        {stats.hard > 0 && (
          <button
            onClick={() => {
              const hardItems = buildReviewQueue(vocabularyItems, { onlyHard: true });
              openReview(hardItems.map((i) => i.id));
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <Flame size={18} />
            <span>{t('vocabulary.reviewHardWords')}</span>
          </button>
        )}
        <button
          onClick={() => setShowImport(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors"
        >
          <Upload size={18} />
          <span>{t('vocabulary.importWords')}</span>
        </button>
      </div>

      {/* Topics */}
      {vocabularyCategories.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
            <button
              onClick={() => setFilterCategory('all')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                filterCategory === 'all' ? 'bg-clay-soft text-white border-clay-soft' : 'border-border-subtle text-ink hover:bg-ink/5'
              }`}
            >
              {t('vocabulary.allTopics')} <span className="opacity-70 tabular-nums">{vocabularyItems.length}</span>
            </button>
            {vocabularyCategories.map((cat) => {
              const st = topicStats.get(cat.id) ?? { count: 0, mastery: 0 };
              const pct = st.count > 0 ? Math.round((st.mastery / (st.count * 5)) * 100) : 0;
              const active = filterCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(active ? 'all' : cat.id)}
                  title={`${t('vocabulary.topicMastery')}: ${pct}%`}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    active ? 'bg-clay-soft text-white border-clay-soft' : 'border-border-subtle text-ink hover:bg-ink/5'
                  }`}
                >
                  <span dir="auto">{cat.name}</span>
                  <span className="opacity-70 tabular-nums">{st.count}</span>
                  <span
                    className="w-6 h-1 rounded-full bg-current/20 overflow-hidden"
                    aria-hidden="true"
                  >
                    <span className="block h-full bg-current" style={{ width: `${pct}%` }} />
                  </span>
                </button>
              );
            })}
          </div>
          {selectedCategory && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={startTopicReview}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
              >
                <PlayCircle size={16} />
                {t('vocabulary.reviewTopic').replace('{name}', selectedCategory.name)}
              </button>
              <button
                onClick={() => setShowChallenge(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-clay-soft text-white text-sm rounded-lg hover:bg-clay-soft-dark transition-colors"
              >
                <Trophy size={16} />
                {t('vocabulary.challenge.open')}
              </button>
              <button
                onClick={() => setShowQuickAdd(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-ink/5 text-ink text-sm rounded-lg hover:bg-ink/10 transition-colors"
              >
                <Plus size={16} />
                {t('vocabulary.addToTopic')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-lighter" size={18} />
          <input
            type="text"
            placeholder={t('vocabulary.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-10 pe-4 py-2 bg-card border border-border-subtle rounded-lg text-ink placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as VocabularyItemType | 'all')}
          className="px-4 py-2 bg-card border border-border-subtle rounded-lg text-ink focus:outline-none focus:border-clay-soft"
        >
          <option value="all">{t('vocabulary.allTypes')}</option>
          <option value="word">{t('vocabulary.typeWord')}</option>
          <option value="verb">{t('vocabulary.typeVerb')}</option>
          <option value="idiom">{t('vocabulary.typeIdiom')}</option>
          <option value="phrase">{t('vocabulary.typePhrase')}</option>
        </select>
        <button
          onClick={() => setFilterHardOnly((prev) => !prev)}
          className={`px-4 py-2 rounded-lg text-ink transition-colors ${
            filterHardOnly
              ? 'bg-red-500 text-white'
              : 'bg-card border border-border-subtle hover:bg-ink/5'
          }`}
        >
          <Flame size={16} className="mr-1" />
          {t('vocabulary.hardOnly')}
        </button>
      </div>

      {/* Vocabulary List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <VocabularyCard
            key={item.id}
            item={item}
            category={vocabularyCategories.find((c) => c.id === item.categoryId)}
            onEdit={(data) => updateVocabularyItem(item.id, data)}
            onDelete={() => deleteVocabularyItem(item.id)}
            onSpeak={handleSpeak}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-ink-light">
          <p>{t('vocabulary.noWords')}</p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <VocabularyForm
          categories={vocabularyCategories}
          onClose={() => setShowForm(false)}
          onSubmit={(item) => {
            addVocabularyItem(item);
            setShowForm(false);
          }}
        />
      )}

      {showCategories && (
        <CategoryManager
          categories={vocabularyCategories}
          onClose={() => setShowCategories(false)}
        />
      )}

      {pickerIds && (
        <ReviewModePicker count={pickerIds.length} onPick={startMode} onClose={() => setPickerIds(null)} />
      )}

      {typingMode && (
        <TypingPractice
          mode={typingMode}
          initialItemIds={reviewItemIds}
          onClose={() => {
            setTypingMode(null);
            setReviewItemIds(undefined);
          }}
        />
      )}

      {showReview && (
        <FlashcardReview
          onClose={() => {
            setShowReview(false);
            setReviewItemIds(undefined);
          }}
          initialItemIds={reviewItemIds}
          onReviewMissed={(ids) => {
            setReviewItemIds(ids);
            setShowReview(true);
          }}
        />
      )}

      {showLibrary && (
        <TopicLibraryModal
          onClose={() => setShowLibrary(false)}
          onAdded={(name) => {
            // importVocabularyItems has already added the category to the store.
            const cat = useAppStore.getState().vocabularyCategories.find((c) => c.name.toLowerCase() === name.toLowerCase());
            if (cat) setFilterCategory(cat.id);
          }}
        />
      )}

      {showQuickAdd && (
        <QuickAddModal
          onClose={() => setShowQuickAdd(false)}
          defaultCategory={selectedCategory?.name}
        />
      )}

      {showChallenge && selectedCategory && (
        <TopicChallenge category={selectedCategory} onClose={() => setShowChallenge(false)} />
      )}

      {showResources && <ResourcesModal onClose={() => setShowResources(false)} />}

      {showConvert && <ConvertToEnglishModal onClose={() => setShowConvert(false)} />}

      {showImport && (
        <ImportWordsModal
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import VocabularyForm from './VocabularyForm';
import VocabularyCard from './VocabularyCard';
import CategoryManager from './CategoryManager';
import FlashcardReview from './FlashcardReview';
import type { VocabularyItemType } from '../../types';

export default function VocabularySection() {
  const { t } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const vocabularyCategories = useAppStore((s) => s.vocabularyCategories);
  const addVocabularyItem = useAppStore((s) => s.addVocabularyItem);
  const deleteVocabularyItem = useAppStore((s) => s.deleteVocabularyItem);
  const updateVocabularyItem = useAppStore((s) => s.updateVocabularyItem);
  const getVocabularyStats = useAppStore((s) => s.getVocabularyStats);

  const [showForm, setShowForm] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<VocabularyItemType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');

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
    return matchesSearch && matchesType && matchesCategory;
  });

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink mb-2">{t('nav.vocabulary')}</h1>
        <p className="text-ink-light">{t('vocabulary.description')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
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
          onClick={() => setShowReview(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <span>{t('vocabulary.startReview')}</span>
        </button>
      </div>

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
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-card border border-border-subtle rounded-lg text-ink focus:outline-none focus:border-clay-soft"
        >
          <option value="all">{t('vocabulary.allCategories')}</option>
          {vocabularyCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
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

      {showReview && (
        <FlashcardReview onClose={() => setShowReview(false)} />
      )}
    </div>
  );
}

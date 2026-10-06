import { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import type { VocabularyCategory, VocabularyItemType } from '../../types';

interface VocabularyFormProps {
  categories: VocabularyCategory[];
  onClose: () => void;
  onSubmit: (item: {
    word: string;
    type: VocabularyItemType;
    definition: string;
    exampleSentence?: string;
    pronunciation?: string;
    categoryId?: string;
    masteryLevel: number;
  }) => void;
}

export default function VocabularyForm({ categories, onClose, onSubmit }: VocabularyFormProps) {
  const { t } = useTranslation();
  const [word, setWord] = useState('');
  const [type, setType] = useState<VocabularyItemType>('word');
  const [definition, setDefinition] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !definition.trim()) return;

    onSubmit({
      word: word.trim(),
      type,
      definition: definition.trim(),
      exampleSentence: exampleSentence.trim() || undefined,
      pronunciation: pronunciation.trim() || undefined,
      categoryId: categoryId || undefined,
      masteryLevel: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border-subtle px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">{t('vocabulary.addWord')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ink/5 rounded-lg transition-colors"
          >
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              {t('vocabulary.word')} *
            </label>
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder={t('vocabulary.wordPlaceholder')}
              className="w-full px-4 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              {t('vocabulary.type')}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as VocabularyItemType)}
              className="w-full px-4 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink focus:outline-none focus:border-clay-soft"
            >
              <option value="word">{t('vocabulary.typeWord')}</option>
              <option value="verb">{t('vocabulary.typeVerb')}</option>
              <option value="idiom">{t('vocabulary.typeIdiom')}</option>
              <option value="phrase">{t('vocabulary.typePhrase')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              {t('vocabulary.definition')} *
            </label>
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder={t('vocabulary.definitionPlaceholder')}
              rows={3}
              className="w-full px-4 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              {t('vocabulary.exampleSentence')}
            </label>
            <textarea
              value={exampleSentence}
              onChange={(e) => setExampleSentence(e.target.value)}
              placeholder={t('vocabulary.examplePlaceholder')}
              rows={2}
              className="w-full px-4 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              {t('vocabulary.pronunciation')}
            </label>
            <input
              type="text"
              value={pronunciation}
              onChange={(e) => setPronunciation(e.target.value)}
              placeholder={t('vocabulary.pronunciationPlaceholder')}
              className="w-full px-4 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              {t('vocabulary.category')}
            </label>
            <select
              value={categoryId || ''}
              onChange={(e) => setCategoryId(e.target.value || undefined)}
              className="w-full px-4 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink focus:outline-none focus:border-clay-soft"
            >
              <option value="">{t('vocabulary.noCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

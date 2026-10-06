import { useState } from 'react';
import { Volume2, Edit2, Trash2, Star } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import type { VocabularyItem, VocabularyCategory } from '../../types';

interface VocabularyCardProps {
  item: VocabularyItem;
  category?: VocabularyCategory;
  onEdit: (data: Partial<VocabularyItem>) => void;
  onDelete: () => void;
  onSpeak: (text: string) => void;
}

export default function VocabularyCard({ item, category, onEdit, onDelete, onSpeak }: VocabularyCardProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    definition: item.definition,
    exampleSentence: item.exampleSentence || '',
  });

  const handleSaveEdit = () => {
    onEdit(editData);
    setIsEditing(false);
  };

  const getMasteryStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < item.masteryLevel ? 'fill-yellow-400 text-yellow-400' : 'text-ink-lighter'}
      />
    ));
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'word': return t('vocabulary.typeWord');
      case 'verb': return t('vocabulary.typeVerb');
      case 'idiom': return t('vocabulary.typeIdiom');
      case 'phrase': return t('vocabulary.typePhrase');
    }
  };

  return (
    <div className="bg-card border border-border-subtle rounded-xl p-4 hover:border-clay-soft/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-ink">{item.word}</h3>
            <button
              onClick={() => onSpeak(item.word)}
              className="p-1 hover:bg-ink/5 rounded transition-colors"
              title={t('vocabulary.pronounce')}
            >
              <Volume2 size={16} className="text-ink-light" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-light">
            <span className="px-2 py-0.5 bg-ink/5 rounded">{getTypeLabel()}</span>
            {category && <span className="px-2 py-0.5 bg-clay-soft/10 text-clay-soft rounded">{category.name}</span>}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 hover:bg-ink/5 rounded transition-colors"
            title={t('common.edit')}
          >
            <Edit2 size={14} className="text-ink-light" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
            title={t('common.delete')}
          >
            <Trash2 size={14} className="text-ink-light hover:text-red-500" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-ink mb-1">{t('vocabulary.definition')}</label>
            <textarea
              value={editData.definition}
              onChange={(e) => setEditData({ ...editData, definition: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink text-sm focus:outline-none focus:border-clay-soft resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink mb-1">{t('vocabulary.exampleSentence')}</label>
            <textarea
              value={editData.exampleSentence}
              onChange={(e) => setEditData({ ...editData, exampleSentence: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink text-sm focus:outline-none focus:border-clay-soft resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 px-3 py-1.5 bg-clay-soft text-white text-sm rounded-lg hover:bg-clay-soft-dark transition-colors"
            >
              {t('common.save')}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 px-3 py-1.5 bg-ink/5 text-ink text-sm rounded-lg hover:bg-ink/10 transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink mb-3">{item.definition}</p>
          
          {item.exampleSentence && (
            <div className="mb-3">
              <p className="text-xs text-ink-light italic">{item.exampleSentence}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
            <div className="flex gap-0.5">
              {getMasteryStars()}
            </div>
            <span className="text-xs text-ink-light">
              {t('vocabulary.reviewed')}: {item.reviewCount}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

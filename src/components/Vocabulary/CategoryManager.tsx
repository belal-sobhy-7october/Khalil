import { useState } from 'react';
import { X, Plus, Edit2, Trash2, Folder } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import type { VocabularyCategory } from '../../types';

export default function CategoryManager({ categories, onClose }: { categories: VocabularyCategory[]; onClose: () => void }) {
  const { t } = useTranslation();
  const addVocabularyCategory = useAppStore((s) => s.addVocabularyCategory);
  const updateVocabularyCategory = useAppStore((s) => s.updateVocabularyCategory);
  const deleteVocabularyCategory = useAppStore((s) => s.deleteVocabularyCategory);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', color: '#e8d5c4', icon: 'folder' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      await updateVocabularyCategory(editingId, {
        name: formData.name.trim(),
        color: formData.color,
        icon: formData.icon,
      });
      setEditingId(null);
    } else {
      await addVocabularyCategory({
        name: formData.name.trim(),
        color: formData.color,
        icon: formData.icon,
      });
    }
    setFormData({ name: '', color: '#e8d5c4', icon: 'folder' });
    setShowAddForm(false);
  };

  const handleEdit = (category: VocabularyCategory) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      color: category.color || '#e8d5c4',
      icon: category.icon || 'folder',
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('vocabulary.confirmDeleteCategory'))) {
      await deleteVocabularyCategory(id);
    }
  };

  const colors = [
    '#e8d5c4', '#d4a574', '#c9a66b', '#8b7355',
    '#a8d5ba', '#7eb8a8', '#5f9ea0', '#4a7c59',
    '#e8a5a5', '#d47474', '#c96b6b', '#8b5555',
    '#a5c4e8', '#74a0d4', '#6ba8c9', '#557c8b',
  ];

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">{t('vocabulary.manageCategories')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ink/5 rounded-lg transition-colors"
          >
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', color: '#e8d5c4', icon: 'folder' });
                setShowAddForm(!showAddForm);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
            >
              <Plus size={18} />
              <span>{t('vocabulary.addCategory')}</span>
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-ink/5 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    {t('vocabulary.categoryName')}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('vocabulary.categoryNamePlaceholder')}
                    className="w-full px-4 py-2 bg-card border border-border-subtle rounded-lg text-ink focus:outline-none focus:border-clay-soft"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    {t('vocabulary.categoryColor')}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color ? 'border-clay-soft scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
                >
                  {editingId ? t('common.save') : t('vocabulary.createCategory')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({ name: '', color: '#e8d5c4', icon: 'folder' });
                  }}
                  className="flex-1 px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 p-4 bg-card border border-border-subtle rounded-xl"
                style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
              >
                <Folder size={20} style={{ color: category.color }} />
                <div className="flex-1">
                  <h3 className="font-medium text-ink">{category.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-1.5 hover:bg-ink/5 rounded transition-colors"
                  >
                    <Edit2 size={14} className="text-ink-light" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                  >
                    <Trash2 size={14} className="text-ink-light hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-8 text-ink-light">
              <Folder size={48} className="mx-auto mb-2 opacity-50" />
              <p>{t('vocabulary.noCategories')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  Bookmark,
  Plus,
  Trash2,
  ExternalLink,
  FolderPlus,
  Globe,
  BookOpen,
  Code,
  Video,
  Music,
  Link as LinkIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import type { Bookmark as BookmarkType } from '../../types';

const categoryIcons: Record<string, React.ReactNode> = {
  general: <Globe size={16} />,
  islamic: <BookOpen size={16} />,
  tech: <Code size={16} />,
  learning: <Video size={16} />,
  media: <Music size={16} />,
};

const defaultCategoryIcon = <LinkIcon size={16} />;

export default function BookmarksVault() {
  const { t, isRTL } = useTranslation();
  const categories = useAppStore((s) => s.bookmarkCategories);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const addCategory = useAppStore((s) => s.addBookmarkCategory);
  const removeCategory = useAppStore((s) => s.removeBookmarkCategory);
  const addBookmark = useAppStore((s) => s.addBookmark);
  const removeBookmark = useAppStore((s) => s.removeBookmark);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showBookmarkForm, setShowBookmarkForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'general' });
  const [newBookmark, setNewBookmark] = useState({ title: '', url: '', description: '', categoryId: '' });

  const filteredBookmarks = activeCategory
    ? bookmarks.filter((b) => b.categoryId === activeCategory)
    : bookmarks;

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addCategory({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: newCategory.name.trim(),
        icon: newCategory.icon,
      });
      setNewCategory({ name: '', icon: 'general' });
      setShowCategoryForm(false);
    }
  };

  const handleAddBookmark = () => {
    if (newBookmark.title.trim() && newBookmark.url.trim() && newBookmark.categoryId) {
      addBookmark({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        title: newBookmark.title.trim(),
        url: newBookmark.url.trim().startsWith('http') ? newBookmark.url.trim() : `https://${newBookmark.url.trim()}`,
        categoryId: newBookmark.categoryId,
        description: newBookmark.description.trim(),
      });
      setNewBookmark({ title: '', url: '', description: '', categoryId: '' });
      setShowBookmarkForm(false);
    }
  };

  return (
    <section id="section-bookmarks" className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bookmark size={20} className="text-terracotta-500 dark:text-terracotta-400" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-amber-50">{t('bookmarks.title')}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-cream-200 dark:bg-slate-700 text-slate-700 dark:text-stone-300 rounded-lg hover:bg-cream-300 dark:hover:bg-slate-600 transition-colors"
          >
            <FolderPlus size={14} />
            <span className="hidden sm:inline">{t('bookmarks.addCategory')}</span>
          </button>
          <button
            onClick={() => setShowBookmarkForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-lg transition-colors"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">{t('bookmarks.addBookmark')}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 text-sm rounded-full transition-all ${
            !activeCategory
              ? 'bg-terracotta-500 text-white'
              : 'bg-cream-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-cream-300 dark:hover:bg-slate-600'
          }`}
        >
          {t('bookmarks.all')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-all ${
              activeCategory === cat.id
                ? 'bg-terracotta-500 text-white'
                : 'bg-cream-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-cream-300 dark:hover:bg-slate-600'
            }`}
          >
            {categoryIcons[cat.icon] || defaultCategoryIcon}
            <span>{cat.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeCategory(cat.id);
              }}
              className="ml-1 hover:text-red-300 dark:hover:text-red-400"
            >
              <Trash2 size={10} />
            </button>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showCategoryForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-cream-50 dark:bg-slate-800 rounded-xl border border-cream-300 dark:border-slate-700 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder={t('bookmarks.addCategory')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="flex-1 border border-cream-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-cream-50 dark:bg-slate-700 text-slate-900 dark:text-amber-50 placeholder-slate-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400/40"
                />
                <button
                  onClick={handleAddCategory}
                  disabled={!newCategory.name.trim()}
                  className="px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-stone-400 text-white text-sm rounded-lg transition-colors"
                >
                  {t('common.add')}
                </button>
                <button
                  onClick={() => setShowCategoryForm(false)}
                  className="px-3 py-2 text-sm text-slate-600 dark:text-stone-300 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBookmarkForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-cream-50 dark:bg-slate-800 rounded-xl border border-cream-300 dark:border-slate-700 p-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newBookmark.title}
                    onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                    placeholder="Title"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="flex-1 border border-cream-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-cream-50 dark:bg-slate-700 text-slate-900 dark:text-amber-50 placeholder-slate-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400/40"
                  />
                  <select
                    value={newBookmark.categoryId}
                    onChange={(e) => setNewBookmark({ ...newBookmark, categoryId: e.target.value })}
                    className="border border-cream-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-cream-50 dark:bg-slate-700 text-slate-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-terracotta-400/40"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={newBookmark.url}
                    onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
                    placeholder={t('bookmarks.urlPlaceholder')}
                    className="flex-1 border border-cream-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-cream-50 dark:bg-slate-700 text-slate-900 dark:text-amber-50 placeholder-slate-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400/40"
                  />
                  <input
                    type="text"
                    value={newBookmark.description}
                    onChange={(e) => setNewBookmark({ ...newBookmark, description: e.target.value })}
                    placeholder={t('bookmarks.descriptionPlaceholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="flex-1 border border-cream-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-cream-50 dark:bg-slate-700 text-slate-900 dark:text-amber-50 placeholder-slate-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400/40"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowBookmarkForm(false)}
                    className="px-3 py-2 text-sm text-slate-600 dark:text-stone-300 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleAddBookmark}
                    disabled={!newBookmark.title.trim() || !newBookmark.url.trim() || !newBookmark.categoryId}
                    className="px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-stone-400 text-white text-sm rounded-lg transition-colors"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-12 bg-cream-50 dark:bg-slate-800 rounded-xl border border-cream-300 dark:border-slate-700">
          <LinkIcon size={40} className="mx-auto text-slate-600 dark:text-stone-500 mb-2" />
          <p className="text-sm text-slate-600 dark:text-stone-400">{t('bookmarks.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredBookmarks.map((bm) => (
              <BookmarkCard key={bm.id} bookmark={bm} onRemove={() => removeBookmark(bm.id)} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

function BookmarkCard({ bookmark, onRemove }: { bookmark: BookmarkType; onRemove: () => void }) {
  return (
    <motion.a
      layout
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative block bg-cream-50 dark:bg-slate-800 rounded-xl border border-cream-300 dark:border-slate-700 shadow-sm p-4 hover:shadow-md hover:border-terracotta-300 dark:hover:border-terracotta-600 transition-all"
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-slate-600 dark:text-stone-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
      >
        <Trash2 size={12} />
      </button>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-cream-200 dark:bg-slate-700 text-terracotta-500">
          <ExternalLink size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-slate-900 dark:text-amber-50 truncate">
            {bookmark.title}
          </h4>
          {bookmark.description && (
            <p className="text-xs text-slate-600 dark:text-stone-300 mt-0.5 line-clamp-2">
              {bookmark.description}
            </p>
          )}
          <p className="text-[10px] text-slate-600 dark:text-stone-400 mt-1 truncate">
            {bookmark.url.replace(/^https?:\/\//, '')}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

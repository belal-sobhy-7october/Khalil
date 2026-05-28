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
  code: <Code size={16} />,
  video: <Video size={16} />,
  book: <BookOpen size={16} />,
  music: <Music size={16} />,
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
    <section id="section-bookmarks">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bookmark size={20} className="text-clay-soft" />
          <h2 className="text-lg font-semibold text-ink">{t('bookmarks.title')}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCategoryForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-ink/5 hover:bg-ink/10 text-ink-light hover:text-ink rounded-lg transition-colors"
          >
            <FolderPlus size={14} />
            <span className="hidden sm:inline">{t('bookmarks.addCategory')}</span>
          </button>
          <button
            onClick={() => setShowBookmarkForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-clay-soft hover:bg-clay-soft-dark text-white rounded-lg transition-colors"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">{t('bookmarks.addBookmark')}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 text-sm rounded-full transition-all ${
            !activeCategory
              ? 'bg-clay-soft text-white'
              : 'bg-ink/5 text-ink-light hover:bg-ink/10 hover:text-ink'
          }`}
        >
          {t('bookmarks.all')}
        </button>
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-clay-soft text-white'
                : 'bg-ink/5 text-ink-light hover:bg-ink/10 hover:text-ink'
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
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showCategoryForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5"
          >
            <div className="bg-card border border-border-subtle rounded-xl p-4 space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  placeholder={t('bookmarks.categoryNamePlaceholder')}
                  className="flex-1 border border-border-subtle rounded-lg px-3 py-2 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-2 focus:ring-clay-soft/20"
                />

                <select
                  value={newCategory.icon}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, icon: e.target.value })
                  }
                  className="border border-border-subtle rounded-lg px-3 py-2 text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/20"
                >
                  <option value="general">{t('bookmarks.iconGeneral')}</option>
                  <option value="code">{t('bookmarks.iconCode')}</option>
                  <option value="video">{t('bookmarks.iconVideo')}</option>
                  <option value="book">{t('bookmarks.iconBook')}</option>
                  <option value="music">{t('bookmarks.iconMusic')}</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCategoryForm(false)}
                  className="px-3 py-2 text-sm text-ink-light hover:text-ink"
                >
                  {t('common.cancel')}
                </button>

                <button
                  onClick={handleAddCategory}
                  disabled={!newCategory.name.trim()}
                  className="px-4 py-2 bg-clay-soft hover:bg-clay-soft-dark disabled:opacity-40 text-white text-sm rounded-lg transition-colors"
                >
                  {t('common.save')}
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
            <div className="bg-card rounded-xl border border-border-subtle p-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newBookmark.title}
                    onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
                    placeholder={t('bookmarks.titlePlaceholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="flex-1 border border-border-subtle rounded-lg px-3 py-2 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-2 focus:ring-clay-soft/20"
                  />
                  <select
                    value={newBookmark.categoryId}
                    onChange={(e) => setNewBookmark({ ...newBookmark, categoryId: e.target.value })}
                    className="border border-border-subtle rounded-lg px-3 py-2 text-sm bg-card text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/20"
                  >
                    <option value="">{t('bookmarks.selectCategory')}</option>
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
                    className="flex-1 border border-border-subtle rounded-lg px-3 py-2 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-2 focus:ring-clay-soft/20"
                  />
                  <input
                    type="text"
                    value={newBookmark.description}
                    onChange={(e) => setNewBookmark({ ...newBookmark, description: e.target.value })}
                    placeholder={t('bookmarks.descriptionPlaceholder')}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className="flex-1 border border-border-subtle rounded-lg px-3 py-2 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-2 focus:ring-clay-soft/20"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowBookmarkForm(false)}
                    className="px-3 py-2 text-sm text-ink-light hover:text-ink"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={handleAddBookmark}
                    disabled={!newBookmark.title.trim() || !newBookmark.url.trim() || !newBookmark.categoryId}
                    className="px-4 py-2 bg-clay-soft hover:bg-clay-soft-dark disabled:opacity-40 text-white text-sm rounded-lg transition-colors"
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
        <div className="text-center py-12 bg-card rounded-xl border border-border-subtle">
          <LinkIcon size={36} className="mx-auto text-ink-lighter mb-2" />
          <p className="text-sm text-ink-light">{t('bookmarks.empty')}</p>
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
      className="group relative block bg-card rounded-xl border border-border-subtle p-4 hover:border-clay-soft/30 transition-all"
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
      >
        <Trash2 size={12} />
      </button>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-ink/5 text-clay-soft">
          <ExternalLink size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-medium text-ink truncate">
            {bookmark.title}
          </h4>
          {bookmark.description && (
            <p className="text-xs text-ink-light mt-0.5 line-clamp-2">
              {bookmark.description}
            </p>
          )}
          <p className="text-[10px] text-ink-lighter mt-1 truncate">
            {bookmark.url.replace(/^https?:\/\//, '')}
          </p>
        </div>
      </div>
    </motion.a>
  );
}

import { useState } from 'react';
import {
  BookOpen,
  Bookmark,
  Code,
  Star,
  Folder,
  Heart,
  Brain,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Target,
  Minus,
  Pencil,
  X,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import type { LifeCategory, SubTrack } from '../../types';

const iconMap: Record<string, React.ReactNode> = {
  'book-open': <BookOpen size={18} />,
  bookmark: <Bookmark size={18} />,
  code: <Code size={18} />,
  star: <Star size={18} />,
  folder: <Folder size={18} />,
  heart: <Heart size={18} />,
  brain: <Brain size={18} />,
  target: <Target size={18} />,
};

const iconOptions = ['heart', 'brain', 'book-open', 'code', 'star', 'bookmark', 'folder', 'target'] as const;

const pillColors: Record<string, { bg: string; border: string; accent: string; pill: string; text: string }> = {
  terracotta: {
    bg: 'bg-terracotta-100 dark:bg-terracotta-900/30',
    border: 'border-terracotta-300 dark:border-terracotta-700',
    accent: 'bg-terracotta-500 dark:bg-terracotta-400',
    pill: 'bg-terracotta-200 dark:bg-terracotta-800/50 text-terracotta-800 dark:text-terracotta-200',
    text: 'text-terracotta-800 dark:text-terracotta-200',
  },
  gold: {
    bg: 'bg-gold-100 dark:bg-gold-900/30',
    border: 'border-gold-300 dark:border-gold-700',
    accent: 'bg-gold-500 dark:bg-gold-400',
    pill: 'bg-gold-200 dark:bg-gold-800/50 text-gold-800 dark:text-gold-200',
    text: 'text-gold-800 dark:text-gold-200',
  },
  sage: {
    bg: 'bg-sage-100 dark:bg-sage-900/30',
    border: 'border-sage-300 dark:border-sage-700',
    accent: 'bg-sage-500 dark:bg-sage-400',
    pill: 'bg-sage-200 dark:bg-sage-800/50 text-sage-800 dark:text-sage-200',
    text: 'text-sage-800 dark:text-sage-200',
  },
  slate: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-600',
    accent: 'bg-slate-500 dark:bg-slate-400',
    pill: 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200',
    text: 'text-slate-800 dark:text-slate-200',
  },
};

const UNIT_KEYS = ['pages', 'lectures', 'hours', 'videos', 'parts'] as const;

const knownUnitLabel = (unit: string, t: (key: string) => string) => {
  return (UNIT_KEYS as readonly string[]).includes(unit)
    ? t(`pillars.unit${unit.charAt(0).toUpperCase() + unit.slice(1)}`)
    : unit;
};

export default function LifePillars() {
  const { t } = useTranslation();
  const categories = useAppStore((s) => s.lifeCategories);
  const subTracks = useAppStore((s) => s.subTracks);
  const updatePillar = useAppStore((s) => s.updatePillar);
  const deletePillar = useAppStore((s) => s.deletePillar);
  const addPillar = useAppStore((s) => s.addPillar);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showAddPillar, setShowAddPillar] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('heart');
  const [newColor, setNewColor] = useState('terracotta');

  const startEdit = (cat: LifeCategory) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const saveEdit = () => {
    if (editingId && editingName.trim()) {
      updatePillar(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الركن بجميع مساراته الفرعية؟')) {
      if (editingId === id) cancelEdit();
      deletePillar(id);
    }
  };

  const handleAddPillar = () => {
    if (!newName.trim()) return;
    addPillar(newName.trim(), newIcon, newColor);
    setNewName('');
    setNewIcon('heart');
    setNewColor('terracotta');
    setShowAddPillar(false);
  };

  return (
    <section id="section-life">
      <div className="flex items-center gap-2 mb-6">
        <Target size={20} className="text-clay-soft" />
        <h2 className="text-lg font-semibold font-amiri text-ink leading-relaxed">
          {t('pillars.title')}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {categories.map((cat) => {
          const tracks = subTracks
            .filter((t) => t.categoryId === cat.id)
            .sort((a, b) => a.sortOrder - b.sortOrder);
          const isExpanded = expanded === cat.id;
          const colors = pillColors[cat.color] || pillColors.slate;
          const isEditing = editingId === cat.id;

          return (
            <motion.div
              key={cat.id}
              layout
              onMouseEnter={() => setHoveredCard(cat.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`rounded-xl border ${colors.border} ${colors.bg}`}
            >
              <div
                className="flex items-center justify-between p-5 md:p-6 cursor-pointer select-none"
                onClick={() => setExpanded(isExpanded ? null : cat.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`shrink-0 ${colors.text}`}>{iconMap[cat.icon]}</span>
                  {isEditing ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      onBlur={saveEdit}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      className="text-lg font-semibold font-amiri bg-transparent border-b-2 border-clay-soft outline-none text-ink min-w-[120px]"
                    />
                  ) : (
                    <h3 className={`text-lg font-semibold font-amiri ${colors.text} truncate leading-relaxed`}>
                      {cat.name}
                    </h3>
                  )}
                  {!isEditing && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${colors.pill} shrink-0`}>
                      {tracks.filter((t) => t.currentValue > 0).length}/{tracks.length}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`flex items-center gap-0.5 transition-all duration-200 ${
                      isEditing || hoveredCard === cat.id ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                          className="flex items-center justify-center w-7 h-7 rounded text-ink-lighter hover:text-sage-soft hover:bg-sage-100 dark:hover:bg-sage-900/30 transition-all"
                          title={t('common.save')}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                          className="flex items-center justify-center w-7 h-7 rounded text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                          title={t('common.cancel')}
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); startEdit(cat); }}
                          className="flex items-center justify-center w-7 h-7 rounded text-ink-lighter hover:text-clay-soft hover:bg-ink/5 transition-all"
                          title={t('common.edit')}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}
                          className="flex items-center justify-center w-7 h-7 rounded text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                          title={t('common.delete')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-ink-light shrink-0" />
                  ) : (
                    <ChevronDown size={18} className="text-ink-light shrink-0" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden rounded-b-xl"
                  >
                    <div className="px-5 md:px-6 pb-5 space-y-2">
                      {tracks.length === 0 ? (
                        <p className="text-sm text-ink-light text-center py-4">
                          {t('pillars.addTrack')}
                        </p>
                      ) : (
                        tracks.map((track) => (
                          <SubTrackRow key={track.id} track={track} colors={colors} />
                        ))
                      )}
                      <AddTrackForm categoryId={cat.id} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5">
        {!showAddPillar ? (
          <button
            onClick={() => setShowAddPillar(true)}
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm text-ink-light hover:text-ink border-2 border-dashed border-border-subtle hover:border-ink-lighter transition-all group"
          >
            <Plus size={16} className="group-hover:scale-110 transition-transform" />
            <span className="font-amiri">إضافة ركن جديد</span>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border-subtle bg-card p-5 md:p-6 space-y-4"
          >
            <div>
              <label className="block text-xs font-medium text-ink-light mb-1 font-amiri">
                اسم الركن
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPillar()}
                placeholder="مثل: مالي، نفسي، اجتماعي..."
                className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-1 focus:ring-clay-soft/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-light mb-2 font-amiri">
                الأيقونة
              </label>
              <div className="flex gap-2 flex-wrap">
                {iconOptions.map((iconKey) => (
                  <button
                    key={iconKey}
                    onClick={() => setNewIcon(iconKey)}
                    className={`flex items-center justify-center w-9 h-9 rounded-lg border-2 transition-all ${
                      newIcon === iconKey
                        ? 'border-clay-soft bg-clay-soft/10 text-clay-soft'
                        : 'border-transparent bg-ink/5 text-ink-lighter hover:border-border-subtle'
                    }`}
                  >
                    {iconMap[iconKey] || iconMap.star}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-light mb-2 font-amiri">
                اللون
              </label>
              <div className="flex gap-2">
                {(['terracotta', 'gold', 'sage', 'slate'] as const).map((colorKey) => (
                  <button
                    key={colorKey}
                    onClick={() => setNewColor(colorKey)}
                    className={`flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all ${
                      newColor === colorKey
                        ? 'border-ink scale-110'
                        : 'border-transparent'
                    }`}
                    style={{
                      backgroundColor:
                        colorKey === 'terracotta'
                          ? '#d46430'
                          : colorKey === 'gold'
                            ? '#b8914a'
                            : colorKey === 'sage'
                              ? '#5d8a5d'
                              : '#737985',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => { setShowAddPillar(false); setNewName(''); }}
                className="px-4 py-1.5 text-xs font-medium text-ink-light hover:text-ink transition-colors"
              >
                {t('pillars.cancel')}
              </button>
              <button
                onClick={handleAddPillar}
                disabled={!newName.trim()}
                className="px-4 py-1.5 text-xs font-medium bg-clay-soft hover:bg-clay-soft-dark disabled:opacity-40 text-white rounded-lg transition-colors"
              >
                {t('pillars.save')}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function SubTrackRow({ track, colors }: { track: SubTrack; colors: (typeof pillColors)[string] }) {
  const { t, isRTL } = useTranslation();
  const incrementSubTrack = useAppStore((s) => s.incrementSubTrack);
  const decrementSubTrack = useAppStore((s) => s.decrementSubTrack);
  const removeSubTrack = useAppStore((s) => s.removeSubTrack);

  const percent = track.target > 0
    ? Math.min(Math.round((track.currentValue / track.target) * 100), 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex items-center gap-2 bg-ink/3 rounded-lg px-4 py-3 border border-border-subtle"
    >
      <div className="flex items-center gap-2 min-w-0 flex-[2]">
        <span className={`shrink-0 ${colors.text}`}>{iconMap[track.icon]}</span>
        <span className="text-sm font-medium text-ink truncate">
          {track.name}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex-1 h-1.5 bg-ink/8 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${colors.accent}`}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <span className="text-[10px] font-medium text-ink-light tabular-nums w-8 text-end shrink-0">
          {percent}%
        </span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs font-medium text-ink-light tabular-nums whitespace-nowrap">
          {track.currentValue}/{track.target} {knownUnitLabel(track.unit, t)}
        </span>

        <div className="flex items-center bg-ink/8 rounded-lg p-0.5">
          {isRTL ? (
            <>
              <button
                onClick={() => incrementSubTrack(track.id, 1)}
                className="flex items-center justify-center w-5 h-5 rounded text-ink-lighter hover:text-ink hover:bg-ink/10 transition-all"
              >
                <Plus size={11} />
              </button>
              <button
                onClick={() => decrementSubTrack(track.id, 1)}
                disabled={track.currentValue <= 0}
                className="flex items-center justify-center w-5 h-5 rounded text-ink-lighter hover:text-ink hover:bg-ink/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              >
                <Minus size={11} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => decrementSubTrack(track.id, 1)}
                disabled={track.currentValue <= 0}
                className="flex items-center justify-center w-5 h-5 rounded text-ink-lighter hover:text-ink hover:bg-ink/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
              >
                <Minus size={11} />
              </button>
              <button
                onClick={() => incrementSubTrack(track.id, 1)}
                className="flex items-center justify-center w-5 h-5 rounded text-ink-lighter hover:text-ink hover:bg-ink/10 transition-all"
              >
                <Plus size={11} />
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => removeSubTrack(track.id)}
          className="flex items-center justify-center w-5 h-5 rounded opacity-0 group-hover:opacity-100 text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </motion.div>
  );
}

function AddTrackForm({ categoryId }: { categoryId: string }) {
  const { t } = useTranslation();
  const addSubTrack = useAppStore((s) => s.addSubTrack);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('10');
  const [unit, setUnit] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    addSubTrack({
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      categoryId,
      name: name.trim(),
      nameKey: name.trim().toLowerCase().replace(/\s+/g, '_'),
      icon: 'star',
      progressType: 'counter',
      target: Math.max(1, Number(target) || 10),
      unit: unit.trim() || 'unit',
      currentValue: 0,
      sortOrder: 99,
    });
    setName('');
    setTarget('10');
    setUnit('');
    setOpen(false);
  };

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-ink-light hover:text-ink border border-dashed border-border-subtle hover:border-ink-lighter transition-all"
        >
          <Plus size={14} />
          {t('pillars.addTrack')}
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ink/3 rounded-lg p-4 border border-border-subtle space-y-3"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder={t('pillars.trackName')}
            className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-1 focus:ring-clay-soft/30 text-end"
          />

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-medium text-ink-light mb-1 text-end">
                {t('pillars.target')}
              </label>
              <input
                type="number"
                min="1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm bg-ink/3 text-ink focus:outline-none focus:ring-1 focus:ring-clay-soft/30"
              />
            </div>

            <div className="flex-1">
              <label className="block text-[10px] font-medium text-ink-light mb-1 text-end">
                {t('pillars.unit')}
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder={t('pillars.unitPlaceholder')}
                className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-1 focus:ring-clay-soft/30 text-end"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-xs font-medium text-ink-light hover:text-ink"
            >
              {t('pillars.cancel')}
            </button>
            <button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="px-4 py-1.5 text-xs font-medium bg-clay-soft hover:bg-clay-soft-dark disabled:opacity-40 text-white rounded-lg transition-colors"
            >
              {t('pillars.save')}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

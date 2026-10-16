import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Loader2, Languages, Check, AlertCircle, RotateCw } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { lookupMany, senseForTopic } from '../../lib/dictionary';
import { topicContext } from '../../lib/senseRank';
import { TOPIC_PACKS } from '../../data/topicPacks';
import type { VocabularyItem } from '../../types';
import { ARABIC, hasArabicDefinition } from '../../lib/arabicText';
import { useDialog } from '../../lib/useDialog';

interface Row {
  item: VocabularyItem;
  status: 'pending' | 'found' | 'missing';
  definition: string;
  example: string;
  selected: boolean;
}

// Learner-written pack definitions beat the dictionary's, so check packs first.
const packIndex = new Map(
  TOPIC_PACKS.flatMap((p) => p.items).map((i) => [i.word.toLowerCase(), i] as const)
);

export default function ConvertToEnglishModal({ onClose }: { onClose: () => void }) {
  const { t, tn } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const vocabularyCategories = useAppStore((s) => s.vocabularyCategories);
  const updateVocabularyItem = useAppStore((s) => s.updateVocabularyItem);

  const targets = useMemo(() => vocabularyItems.filter(hasArabicDefinition), [vocabularyItems]);
  const [rows, setRows] = useState<Row[]>(() =>
    targets.map((item) => {
      const fromPack = packIndex.get(item.word.trim().toLowerCase());
      const keepExample = item.exampleSentence && !ARABIC.test(item.exampleSentence);
      return {
        item,
        status: fromPack ? 'found' : 'pending',
        definition: fromPack?.definition ?? '',
        example: keepExample ? item.exampleSentence! : fromPack?.example ?? '',
        selected: !!fromPack,
      };
    })
  );
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  const runLookup = (targetRows: Row[]) => {
    if (targetRows.length === 0) return;
    void lookupMany(
      targetRows.map((r) => r.item.word),
      (index, entry) => {
        if (!mountedRef.current) return;
        const id = targetRows[index].item.id;
        setRows((prev) =>
          prev.map((r) => {
            if (r.item.id !== id) return r;
            if (!entry) return { ...r, status: 'missing' };
            // Choose the sense that fits the word's topic, with its own example.
            const topic = vocabularyCategories.find((c) => c.id === r.item.categoryId);
            const sense = topic
              ? senseForTopic(
                  entry,
                  topicContext(
                    topic.name,
                    vocabularyItems.filter((o) => o.categoryId === topic.id && o.id !== r.item.id && !hasArabicDefinition(o)).map((o) => o.definition)
                  )
                )
              : entry;
            return {
              ...r,
              status: 'found',
              definition: r.definition || sense.definition,
              example: r.example || sense.example || '',
              selected: true,
            };
          })
        );
      }
    );
  };

  const retryMissing = (targetRows: Row[]) => {
    const ids = new Set(targetRows.map((r) => r.item.id));
    setRows((prev) => prev.map((r) => (ids.has(r.item.id) ? { ...r, status: 'pending' } : r)));
    runLookup(targetRows);
  };

  // Rows not covered by a pack are looked up in the dictionary once, on open.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    runLookup(rows.filter((r) => r.status === 'pending'));
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for the rows present on open
  }, []);

  const update = (id: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.item.id === id ? { ...r, ...patch } : r)));

  const ready = rows.filter((r) => r.selected && r.definition.trim() && !ARABIC.test(r.definition));
  const pendingCount = rows.filter((r) => r.status === 'pending').length;
  const missingRows = rows.filter((r) => r.status === 'missing' && !r.definition.trim());
  const allSelected = rows.length > 0 && rows.every((r) => r.selected);
  const toggleAll = () => setRows((prev) => prev.map((r) => ({ ...r, selected: !allSelected })));

  const handleSave = async () => {
    setSaving(true);
    for (let i = 0; i < ready.length; i += 5) {
      await Promise.all(
        ready.slice(i, i + 5).map((r) =>
          updateVocabularyItem(r.item.id, {
            definition: r.definition.trim(),
            exampleSentence: r.example.trim() || undefined,
          })
        )
      );
    }
    setSaving(false);
    setSavedCount(ready.length);
  };

  const inputClass =
    'w-full px-2 py-1 bg-ink/5 border border-border-subtle rounded text-ink text-sm focus:outline-none focus:border-clay-soft resize-none';

  const dialog = useDialog(() => !saving && onClose());

  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div {...dialog.props} className="bg-card border border-border-subtle rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 id={dialog.titleId} className="text-xl font-bold text-ink flex items-center gap-2">
            <Languages size={20} className="text-clay-soft" />
            {t('vocabulary.convert.title')}
          </h2>
          <button onClick={onClose} disabled={saving} className="p-2 hover:bg-ink/5 rounded-lg transition-colors" aria-label={t('common.close')}>
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {savedCount !== null ? (
            <div className="flex flex-col items-center text-center py-10 gap-2">
              <Check size={40} className="text-green-500" />
              <p className="text-ink">{tn('vocabulary.convert.saved', savedCount)}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-ink-light mb-2">{t('vocabulary.convert.hint')}</p>
              <div className="flex flex-wrap items-center gap-3 pb-2 border-b border-border-subtle">
                <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-clay-soft" />
                  {t('vocabulary.convert.selectAll')} ({rows.filter((r) => r.selected).length}/{rows.length})
                </label>
                {missingRows.length > 0 && pendingCount === 0 && (
                  <button
                    onClick={() => retryMissing(missingRows)}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-ink/5 text-ink hover:bg-ink/10 transition-colors"
                  >
                    <RotateCw size={12} />
                    {t('vocabulary.convert.retry').replace('{count}', String(missingRows.length))}
                  </button>
                )}
              </div>
              {pendingCount > 0 && (
                <p className="text-xs text-ink-light flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  {tn('vocabulary.quickAdd.lookingUp', pendingCount)}
                </p>
              )}
              {rows.map((r) => (
                <div
                  key={r.item.id}
                  className={`grid grid-cols-1 md:grid-cols-[auto_9rem_1fr_1fr] gap-2 items-start p-2 rounded-lg border ${
                    r.status === 'missing' && !r.definition ? 'border-amber-400/60' : 'border-border-subtle'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={r.selected}
                    onChange={(e) => update(r.item.id, { selected: e.target.checked })}
                    className="mt-1.5 accent-clay-soft"
                    aria-label={r.item.word}
                  />
                  <div className="pt-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {r.status === 'pending' && <Loader2 size={12} className="animate-spin text-ink-lighter" />}
                      {r.status === 'missing' && !r.definition && <AlertCircle size={12} className="text-amber-500" />}
                      <span className="font-semibold text-ink text-sm truncate" dir="ltr">{r.item.word}</span>
                    </div>
                    <div className="text-xs text-ink-lighter line-through truncate" dir="rtl">{r.item.definition}</div>
                  </div>
                  <textarea
                    dir="ltr"
                    rows={2}
                    value={r.definition}
                    placeholder={r.status === 'missing' ? t('vocabulary.quickAdd.notFound') : t('vocabulary.definition')}
                    onChange={(e) => update(r.item.id, { definition: e.target.value, selected: true })}
                    className={inputClass}
                  />
                  <textarea
                    dir="ltr"
                    rows={2}
                    value={r.example}
                    placeholder={t('vocabulary.exampleSentence')}
                    onChange={(e) => update(r.item.id, { example: e.target.value })}
                    className={`${inputClass} italic`}
                  />
                </div>
              ))}
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-subtle flex justify-end gap-3">
          {savedCount !== null ? (
            <button onClick={onClose} className="px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors">
              {t('vocabulary.library.done')}
            </button>
          ) : (
            <>
            {ready.length === 0 && rows.some((r) => r.selected) && (
              <p className="flex-1 self-center text-xs text-ink-light">{t('vocabulary.convert.needDefinition')}</p>
            )}
            <button
              onClick={handleSave}
              disabled={saving || ready.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark disabled:opacity-40 transition-colors"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {tn('vocabulary.convert.save', ready.length)}
            </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

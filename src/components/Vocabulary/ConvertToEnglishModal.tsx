import { useEffect, useMemo, useState } from 'react';
import { X, Loader2, Languages, Check, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { lookupMany } from '../../lib/dictionary';
import { TOPIC_PACKS } from '../../data/topicPacks';
import type { VocabularyItem } from '../../types';
import { ARABIC, hasArabicDefinition } from '../../lib/arabicText';

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
  const { t } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
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

  // Rows not covered by a pack are looked up in the dictionary once, on open.
  useEffect(() => {
    const pending = rows.filter((r) => r.status === 'pending');
    if (pending.length === 0) return;
    let cancelled = false;
    void lookupMany(
      pending.map((r) => r.item.word),
      (index, entry) => {
        if (cancelled) return;
        const id = pending[index].item.id;
        setRows((prev) =>
          prev.map((r) => {
            if (r.item.id !== id) return r;
            if (!entry) return { ...r, status: 'missing' };
            return {
              ...r,
              status: 'found',
              definition: r.definition || entry.definition,
              example: r.example || entry.example || '',
              selected: true,
            };
          })
        );
      }
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once for the rows present on open
  }, []);

  const update = (id: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.item.id === id ? { ...r, ...patch } : r)));

  const ready = rows.filter((r) => r.selected && r.definition.trim() && !ARABIC.test(r.definition));
  const pendingCount = rows.filter((r) => r.status === 'pending').length;

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

  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
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
              <p className="text-ink">{t('vocabulary.convert.saved').replace('{count}', String(savedCount))}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-ink-light mb-2">{t('vocabulary.convert.hint')}</p>
              {pendingCount > 0 && (
                <p className="text-xs text-ink-light flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  {t('vocabulary.quickAdd.lookingUp').replace('{count}', String(pendingCount))}
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
            <button
              onClick={handleSave}
              disabled={saving || ready.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark disabled:opacity-40 transition-colors"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {t('vocabulary.convert.save').replace('{count}', String(ready.length))}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

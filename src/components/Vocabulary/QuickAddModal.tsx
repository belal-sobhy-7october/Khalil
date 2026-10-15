import { useMemo, useState } from 'react';
import { X, Loader2, Sparkles, Trash2, Check, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { lookupMany } from '../../lib/dictionary';
import { parseQuickLine } from '../../lib/quickAddParse';
import type { VocabularyItemType } from '../../types';

type LookupStatus = 'pending' | 'found' | 'missing' | 'manual';

interface Row {
  key: number;
  word: string;
  type: VocabularyItemType;
  definition: string;
  example: string;
  pronunciation: string;
  status: LookupStatus;
}

const NEW_GROUP = '__new__';

function guessType(word: string): VocabularyItemType {
  return word.includes(' ') ? 'phrase' : 'word';
}

export default function QuickAddModal({ onClose, defaultCategory }: { onClose: () => void; defaultCategory?: string }) {
  const { t } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const vocabularyCategories = useAppStore((s) => s.vocabularyCategories);
  const importVocabularyItems = useAppStore((s) => s.importVocabularyItems);

  const [text, setText] = useState('');
  const [rows, setRows] = useState<Row[] | null>(null);
  const [group, setGroup] = useState<string>(defaultCategory ?? '');
  const [newGroupName, setNewGroupName] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ inserted: number; skipped: number; failed: number } | null>(null);

  const existingWords = useMemo(
    () => new Set(vocabularyItems.map((i) => i.word.trim().toLowerCase())),
    [vocabularyItems]
  );

  const lineCount = text.split('\n').filter((l) => l.trim()).length;

  const updateRow = (key: number, patch: Partial<Row>) =>
    setRows((prev) => prev && prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const handleContinue = () => {
    const seen = new Set<string>();
    const parsed: Row[] = [];
    text.split('\n').forEach((line, i) => {
      const p = parseQuickLine(line);
      if (!p) return;
      const lower = p.word.toLowerCase();
      if (seen.has(lower)) return;
      seen.add(lower);
      parsed.push({
        key: i,
        word: p.word,
        type: guessType(p.word),
        definition: p.definition,
        example: p.example,
        pronunciation: '',
        status: p.definition ? 'manual' : 'pending',
      });
    });
    setRows(parsed);

    // Fill in the blanks from the dictionary, row by row as answers arrive.
    const toLookUp = parsed.filter((r) => r.status === 'pending');
    void lookupMany(
      toLookUp.map((r) => r.word),
      (index, entry) => {
        const key = toLookUp[index].key;
        setRows((prev) =>
          prev &&
          prev.map((r) => {
            if (r.key !== key) return r;
            if (!entry) return { ...r, status: 'missing' };
            return {
              ...r,
              status: 'found',
              type: entry.type,
              // Never overwrite something the user typed while the lookup ran.
              definition: r.definition || entry.definition,
              example: r.example || entry.example || '',
              pronunciation: r.pronunciation || entry.phonetic || '',
            };
          })
        );
      }
    );
  };

  const readyRows = rows?.filter((r) => r.definition.trim() && !existingWords.has(r.word.toLowerCase())) ?? [];
  const pendingCount = rows?.filter((r) => r.status === 'pending').length ?? 0;
  const categoryName = group === NEW_GROUP ? newGroupName.trim() : group;

  const handleSave = async () => {
    if (readyRows.length === 0) return;
    setSaving(true);
    const res = await importVocabularyItems(
      readyRows.map((r) => ({
        word: r.word,
        type: r.type,
        definition: r.definition,
        exampleSentence: r.example || undefined,
        pronunciation: r.pronunciation || undefined,
        masteryLevel: 0,
      })),
      { duplicateMode: 'skip', categoryForAll: categoryName || undefined }
    );
    setSaving(false);
    setResult(res);
  };

  const inputClass =
    'w-full px-2 py-1 bg-ink/5 border border-border-subtle rounded text-ink text-sm focus:outline-none focus:border-clay-soft';

  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <div className="bg-card border border-border-subtle rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <Sparkles size={20} className="text-clay-soft" />
            {t('vocabulary.quickAdd.title')}
          </h2>
          <button onClick={onClose} disabled={saving} className="p-2 hover:bg-ink/5 rounded-lg transition-colors" aria-label={t('common.close')}>
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Group picker is shared by both steps */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-ink-light">{t('vocabulary.library.addTo')}</span>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="px-3 py-1.5 bg-ink/5 border border-border-subtle rounded-lg text-ink focus:outline-none focus:border-clay-soft"
            >
              <option value="">{t('vocabulary.noCategory')}</option>
              {vocabularyCategories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
              <option value={NEW_GROUP}>{t('vocabulary.quickAdd.newGroup')}</option>
            </select>
            {group === NEW_GROUP && (
              <input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder={t('vocabulary.quickAdd.newGroupPlaceholder')}
                className="px-3 py-1.5 bg-ink/5 border border-border-subtle rounded-lg text-ink focus:outline-none focus:border-clay-soft"
                dir="ltr"
              />
            )}
          </div>

          {!rows ? (
            <>
              <p className="text-sm text-ink-light">{t('vocabulary.quickAdd.hint')}</p>
              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={12}
                dir="ltr"
                placeholder={'negotiate\nfollow up\non the same page | agreeing about something | Let\'s make sure we\'re on the same page.\nbargain - something cheaper than usual'}
                className="w-full px-4 py-3 bg-ink/5 border border-border-subtle rounded-lg text-ink font-mono text-sm placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft resize-y"
              />
            </>
          ) : result ? (
            <div className="flex flex-col items-center text-center py-10 gap-2">
              <Check size={40} className="text-green-500" />
              <p className="text-ink">
                {t('vocabulary.library.added')
                  .replace('{inserted}', String(result.inserted))
                  .replace('{skipped}', String(result.skipped))}
              </p>
              {result.failed > 0 && (
                <p className="text-red-500 text-sm">{t('vocabulary.library.failed').replace('{count}', String(result.failed))}</p>
              )}
            </div>
          ) : (
            <div dir="ltr" className="space-y-2">
              {pendingCount > 0 && (
                <p className="text-xs text-ink-light flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  {t('vocabulary.quickAdd.lookingUp').replace('{count}', String(pendingCount))}
                </p>
              )}
              {rows.map((r) => {
                const duplicate = existingWords.has(r.word.toLowerCase());
                return (
                  <div
                    key={r.key}
                    className={`grid grid-cols-1 md:grid-cols-[10rem_6.5rem_1fr_1fr_auto] gap-2 items-start p-2 rounded-lg border ${
                      duplicate
                        ? 'border-border-subtle opacity-50'
                        : r.status === 'missing' && !r.definition
                          ? 'border-amber-400/60 bg-amber-50/40 dark:bg-amber-900/10'
                          : 'border-border-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 pt-1">
                      {r.status === 'pending' && <Loader2 size={14} className="animate-spin text-ink-lighter shrink-0" />}
                      {r.status === 'found' && <Check size={14} className="text-green-500 shrink-0" />}
                      {r.status === 'missing' && !r.definition && <AlertCircle size={14} className="text-amber-500 shrink-0" />}
                      <span className="font-semibold text-ink text-sm truncate" title={r.word}>{r.word}</span>
                    </div>
                    <select
                      value={r.type}
                      onChange={(e) => updateRow(r.key, { type: e.target.value as VocabularyItemType })}
                      className={inputClass}
                    >
                      <option value="word">{t('vocabulary.typeWord')}</option>
                      <option value="verb">{t('vocabulary.typeVerb')}</option>
                      <option value="idiom">{t('vocabulary.typeIdiom')}</option>
                      <option value="phrase">{t('vocabulary.typePhrase')}</option>
                    </select>
                    {duplicate ? (
                      <span className="md:col-span-2 text-xs text-ink-light pt-1">{t('vocabulary.quickAdd.alreadyInList')}</span>
                    ) : (
                      <>
                        <textarea
                          value={r.definition}
                          onChange={(e) => updateRow(r.key, { definition: e.target.value })}
                          placeholder={r.status === 'missing' ? t('vocabulary.quickAdd.notFound') : t('vocabulary.definition')}
                          rows={2}
                          className={`${inputClass} resize-none`}
                        />
                        <textarea
                          value={r.example}
                          onChange={(e) => updateRow(r.key, { example: e.target.value })}
                          placeholder={t('vocabulary.exampleSentence')}
                          rows={2}
                          className={`${inputClass} resize-none italic`}
                        />
                      </>
                    )}
                    <button
                      onClick={() => setRows((prev) => prev && prev.filter((x) => x.key !== r.key))}
                      className="p-1.5 text-ink-lighter hover:text-red-500 rounded transition-colors justify-self-end"
                      aria-label={`${t('common.delete')}: ${r.word}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-end gap-3">
          {!rows ? (
            <button
              onClick={handleContinue}
              disabled={lineCount === 0}
              className="px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark disabled:opacity-40 transition-colors"
            >
              {t('vocabulary.quickAdd.continue').replace('{count}', String(lineCount))}
            </button>
          ) : result ? (
            <button onClick={onClose} className="px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors">
              {t('vocabulary.library.done')}
            </button>
          ) : (
            <>
              <button
                onClick={() => setRows(null)}
                disabled={saving}
                className="px-4 py-2 bg-ink/5 text-ink rounded-lg hover:bg-ink/10 transition-colors"
              >
                {t('common.back')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || readyRows.length === 0 || (group === NEW_GROUP && !newGroupName.trim())}
                className="flex items-center gap-2 px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark disabled:opacity-40 transition-colors"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {t('vocabulary.quickAdd.save').replace('{count}', String(readyRows.length))}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { X, Loader2, Check, RefreshCw, SearchCheck } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { useDialog } from '../../lib/useDialog';
import { planTopicUpgrade } from '../../lib/topicUpgrade';
import type { VocabularyCategory } from '../../types';
import CheckMeaningsModal from './CheckMeaningsModal';

type Part = 'update' | 'add' | 'remove';

/** Short, comma-separated preview of words. */
const preview = (words: string[]) => (words.length > 8 ? `${words.slice(0, 8).join(', ')}, …` : words.join(', '));

/**
 * Shows exactly what updating the user's topics to the new lessons would do,
 * part by part, and applies only what stays ticked.
 */
export default function UpgradeTopicsModal({ onClose }: { onClose: () => void }) {
  const { t, tn } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const vocabularyCategories = useAppStore((s) => s.vocabularyCategories);
  const updateVocabularyItem = useAppStore((s) => s.updateVocabularyItem);
  const deleteVocabularyItem = useAppStore((s) => s.deleteVocabularyItem);
  const updateVocabularyCategory = useAppStore((s) => s.updateVocabularyCategory);
  const importVocabularyItems = useAppStore((s) => s.importVocabularyItems);

  // Plan once, from the list as it was when the window opened.
  const [plan] = useState(() => planTopicUpgrade(vocabularyCategories, vocabularyItems));
  const ownWithLesson = plan.own.filter((o) => o.pack && o.add.length > 0);
  const [skip, setSkip] = useState<Set<string>>(() => new Set());
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [applied, setApplied] = useState<number | null>(null);
  const [checking, setChecking] = useState<VocabularyCategory | null>(null);
  const dialog = useDialog(() => progress === null && !checking && onClose());

  const on = (id: string) => !skip.has(id);
  const toggle = (id: string) =>
    setSkip((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const changeCount = useMemo(() => {
    let n = 0;
    for (const l of plan.lessons) {
      if (l.rename) n++;
      if (on(`${l.category.id}:update`)) n += l.update.length;
      if (on(`${l.category.id}:add`)) n += l.add.length;
      if (on(`${l.category.id}:remove`)) n += l.remove.length;
    }
    for (const o of ownWithLesson) if (on(`${o.category.id}:add`)) n += o.add.length;
    return n;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, skip]);

  const apply = async () => {
    setProgress({ done: 0, total: changeCount });
    let done = 0;
    const step = (n = 1) => {
      done += n;
      setProgress({ done, total: changeCount });
    };
    const addWords = async (topicName: string, words: typeof plan.lessons[number]['add']) => {
      if (!words.length) return;
      await importVocabularyItems(
        words.map((w) => ({ word: w.word, type: w.type, definition: w.definition, exampleSentence: w.example, masteryLevel: 0 })),
        { duplicateMode: 'skip', categoryForAll: topicName }
      );
      step(words.length);
    };
    for (const l of plan.lessons) {
      const name = l.rename ?? l.category.name;
      if (l.rename) {
        await updateVocabularyCategory(l.category.id, { name: l.rename });
        step();
      }
      if (on(`${l.category.id}:update`)) {
        for (const u of l.update) {
          await updateVocabularyItem(u.item.id, { definition: u.next.definition, exampleSentence: u.next.example, type: u.next.type });
          step();
        }
      }
      if (on(`${l.category.id}:add`)) await addWords(name, l.add);
      if (on(`${l.category.id}:remove`)) {
        for (const item of l.remove) {
          await deleteVocabularyItem(item.id);
          step();
        }
      }
    }
    for (const o of ownWithLesson) if (on(`${o.category.id}:add`)) await addWords(o.category.name, o.add);
    setProgress(null);
    setApplied(done);
  };

  const part = (categoryId: string, kind: Part, count: number, label: string, words: string[]) =>
    count > 0 && (
      <label className="flex items-start gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={on(`${categoryId}:${kind}`)} onChange={() => toggle(`${categoryId}:${kind}`)} className="mt-1 accent-clay-soft" />
        <span>
          <span className={kind === 'remove' ? 'text-red-600 dark:text-red-400' : 'text-ink'}>{label}</span>
          <span className="block text-xs text-ink-light" dir="ltr">{preview(words)}</span>
        </span>
      </label>
    );

  const nothing = plan.lessons.length === 0 && plan.own.length === 0;

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && progress === null && onClose()}>
      <div {...dialog.props} className="bg-card border border-border-subtle rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 id={dialog.titleId} className="text-lg font-bold text-ink flex items-center gap-2">
              <RefreshCw size={18} className="text-clay-soft shrink-0" />
              {t('vocabulary.upgrade.title')}
            </h2>
            <p className="text-xs text-ink-light">{t('vocabulary.upgrade.hint')}</p>
          </div>
          <button onClick={onClose} disabled={progress !== null} className="p-2 hover:bg-ink/5 rounded-lg" aria-label={t('common.close')}>
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {applied !== null ? (
            <p className="text-ink flex items-center gap-2"><Check size={16} className="text-green-600" /> {tn('vocabulary.upgrade.done', applied)}</p>
          ) : nothing ? (
            <p className="text-ink">{t('vocabulary.upgrade.nothing')}</p>
          ) : (
            <>
              {plan.lessons.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-ink">{t('vocabulary.upgrade.lessons')}</h3>
                  {plan.lessons.map((l) => (
                    <fieldset key={l.category.id} className="rounded-xl border border-border-subtle p-4 space-y-2">
                      <legend className="px-1 font-semibold text-ink" dir="auto">
                        {l.category.name}
                        {l.rename && <span className="text-xs font-normal text-ink-light"> — {t('vocabulary.upgrade.renameTo').replace('{name}', l.rename)}</span>}
                      </legend>
                      {part(l.category.id, 'update', l.update.length, tn('vocabulary.upgrade.update', l.update.length), l.update.map((u) => u.item.word))}
                      {part(l.category.id, 'add', l.add.length, tn('vocabulary.upgrade.add', l.add.length), l.add.map((a) => a.word))}
                      {part(l.category.id, 'remove', l.remove.length, tn('vocabulary.upgrade.remove', l.remove.length), l.remove.map((r) => r.word))}
                    </fieldset>
                  ))}
                </section>
              )}
              {plan.own.length > 0 && (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-ink">{t('vocabulary.upgrade.own')}</h3>
                  {plan.own.map((o) => (
                    <div key={o.category.id} className="rounded-xl border border-border-subtle p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-ink" dir="auto">{o.category.name}</span>
                        <button
                          onClick={() => setChecking(o.category)}
                          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-ink/5 text-ink hover:bg-ink/10"
                        >
                          <SearchCheck size={13} /> {t('vocabulary.meaning.open')}
                        </button>
                      </div>
                      {o.pack && o.add.length > 0
                        ? part(o.category.id, 'add', o.add.length, tn('vocabulary.upgrade.addFrom', o.add.length).replace('{name}', o.pack.title), o.add.map((a) => a.word))
                        : !o.pack && <p className="text-xs text-ink-light">{t('vocabulary.upgrade.noLesson')}</p>}
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-subtle flex justify-end gap-2">
          {applied !== null || nothing ? (
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-clay-soft text-white text-sm">{t('vocabulary.library.done')}</button>
          ) : (
            <button
              onClick={() => void apply()}
              disabled={progress !== null || changeCount === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-clay-soft text-white text-sm disabled:opacity-40"
            >
              {progress ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t('vocabulary.upgrade.applying').replace('{n}', String(progress.done)).replace('{total}', String(progress.total))}
                </>
              ) : (
                tn('vocabulary.upgrade.apply', changeCount)
              )}
            </button>
          )}
        </div>
      </div>
      {checking && <CheckMeaningsModal category={checking} onClose={() => setChecking(null)} />}
    </div>
  );
}

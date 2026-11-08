import { useEffect, useMemo, useRef, useState } from 'react';
import { X, Loader2, SearchCheck, Check } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { lookupMany } from '../../lib/dictionary';
import { hasArabicDefinition } from '../../lib/arabicText';
import { TOPIC_PACKS } from '../../data/topicPacks';
import { rankSenses, sameDefinition, senseScore, topicContext, type Sense } from '../../lib/senseRank';
import { useDialog } from '../../lib/useDialog';
import type { VocabularyCategory, VocabularyItem } from '../../types';

interface Suggestion {
  item: VocabularyItem;
  /** The topic the word is checked against (its own, when checking every word). */
  topic: string;
  /** Senses best-first for the topic; the first one is the suggestion. */
  senses: Sense[];
  /** Index into `senses`, or -1 to keep the saved meaning. */
  choice: number;
}

/** Topic Library meanings, written for the topic and checked against the Cambridge Dictionary. */
const librarySenses = new Map<string, Array<Sense & { pack: string }>>();
for (const p of TOPIC_PACKS) {
  for (const i of p.items) {
    const key = i.word.trim().toLowerCase();
    librarySenses.set(key, [...(librarySenses.get(key) ?? []), { definition: i.definition, example: i.example, pos: i.pos, pack: p.title }]);
  }
}

/**
 * Goes through a topic's words — or every word, each against its own topic —
 * and flags the ones whose saved meaning isn't the sense that fits the topic
 * ("split up" in Marriage saved as "divide into groups"). The Topic Library's
 * meaning comes first when the word is in it; otherwise the dictionary's
 * senses, best first. The user picks the right sense or keeps theirs. Arabic
 * meanings are left to ConvertToEnglishModal.
 */
export default function CheckMeaningsModal({ category, onClose }: { category: VocabularyCategory | null; onClose: () => void }) {
  const { t, tn } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const vocabularyCategories = useAppStore((s) => s.vocabularyCategories);
  const updateVocabularyItem = useAppStore((s) => s.updateVocabularyItem);
  const items = useMemo(
    () => vocabularyItems.filter((i) => (category ? i.categoryId === category.id : true) && !hasArabicDefinition(i)),
    [vocabularyItems, category]
  );
  const topicOf = (item: VocabularyItem) => category?.name ?? vocabularyCategories.find((c) => c.id === item.categoryId)?.name ?? '';
  // The topic is described by its name and the *other* words in it.
  const contextOf = (item: VocabularyItem) =>
    topicContext(topicOf(item), items.filter((o) => o.id !== item.id && o.categoryId === item.categoryId).map((o) => o.definition));
  // Words in the Topic Library are checked right away; the rest are looked up once, when the window opens.
  const [{ fromLibrary, toLookUp }] = useState(() => {
    const fromLibrary: Suggestion[] = [];
    const toLookUp: VocabularyItem[] = [];
    for (const item of items) {
      const library = librarySenses.get(item.word.trim().toLowerCase());
      if (!library) {
        toLookUp.push(item);
        continue;
      }
      if (library.some((l) => sameDefinition(l.definition, item.definition))) continue;
      fromLibrary.push({ item, topic: topicOf(item), senses: rankSenses(library, contextOf(item)), choice: 0 });
    }
    return { fromLibrary, toLookUp };
  });
  const [checked, setChecked] = useState(fromLibrary.length);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(fromLibrary);
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState<number | null>(null);
  const mounted = useRef(true);
  const dialog = useDialog(() => !saving && onClose());

  const targets = toLookUp;
  const total = fromLibrary.length + toLookUp.length;
  useEffect(() => {
    mounted.current = true;
    void lookupMany(
      targets.map((i) => i.word),
      (index, entry) => {
        if (!mounted.current) return;
        setChecked((n) => n + 1);
        const item = targets[index];
        if (!entry || (entry.senses ?? []).length < 2) return;
        const context = contextOf(item);
        const ranked = rankSenses(entry.senses, context);
        const best = ranked[0];
        const current = senseScore({ definition: item.definition, example: item.exampleSentence }, context);
        if (sameDefinition(best.definition, item.definition) || senseScore(best, context) <= current) return;
        setSuggestions((prev) => [...prev, { item, topic: topicOf(item), senses: ranked.slice(0, 5), choice: 0 }]);
      }
    );
    return () => {
      mounted.current = false;
    };
    // The lists are fixed when the window opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = checked >= total;
  const changes = suggestions.filter((s) => s.choice >= 0);

  const save = async () => {
    setSaving(true);
    for (const s of changes) {
      const sense = s.senses[s.choice];
      // Keep the user's own example; only fill one in when there was none.
      await updateVocabularyItem(s.item.id, {
        definition: sense.definition,
        ...(s.item.exampleSentence ? {} : { exampleSentence: sense.example }),
      });
    }
    setSaving(false);
    setSavedCount(changes.length);
  };

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && !saving && onClose()}>
      <div {...dialog.props} className="bg-card border border-border-subtle rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 id={dialog.titleId} className="text-lg font-bold text-ink flex items-center gap-2">
              <SearchCheck size={18} className="text-clay-soft shrink-0" />
              <span className="truncate">{category ? t('vocabulary.meaning.title').replace('{name}', category.name) : t('vocabulary.meaning.titleAll')}</span>
            </h2>
            <p className="text-xs text-ink-light">{t('vocabulary.meaning.hint')}</p>
          </div>
          <button onClick={onClose} disabled={saving} className="p-2 hover:bg-ink/5 rounded-lg" aria-label={t('common.close')}>
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4" dir="ltr">
          {savedCount !== null ? (
            <p className="text-ink flex items-center gap-2" dir="auto">
              <Check size={16} className="text-green-600" /> {tn('vocabulary.meaning.saved', savedCount)}
            </p>
          ) : (
            <>
              {!done && (
                <p className="text-sm text-ink-light flex items-center gap-2" dir="auto">
                  <Loader2 size={14} className="animate-spin" /> {t('vocabulary.meaning.checking').replace('{n}', String(checked)).replace('{total}', String(total))}
                </p>
              )}
              {done && suggestions.length === 0 && <p className="text-sm text-ink" dir="auto">{t('vocabulary.meaning.allGood')}</p>}
              {suggestions.map((s) => (
                <fieldset key={s.item.id} className="rounded-xl border border-border-subtle p-4 space-y-2">
                  <legend className="px-1 font-semibold text-ink">
                    {s.item.word}
                    {!category && s.topic && <span className="ms-2 text-xs font-normal text-ink-lighter">{s.topic}</span>}
                  </legend>
                  <label className="flex items-start gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name={s.item.id}
                      checked={s.choice === -1}
                      onChange={() => setSuggestions((prev) => prev.map((x) => (x.item.id === s.item.id ? { ...x, choice: -1 } : x)))}
                      className="mt-1 accent-clay-soft"
                    />
                    <span>
                      <span className="block text-[11px] text-ink-lighter" dir="auto">{t('vocabulary.meaning.keep')}</span>
                      <span className="text-ink-light">{s.item.definition}</span>
                    </span>
                  </label>
                  {s.senses.map((sense, i) => (
                    <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name={s.item.id}
                        checked={s.choice === i}
                        onChange={() => setSuggestions((prev) => prev.map((x) => (x.item.id === s.item.id ? { ...x, choice: i } : x)))}
                        className="mt-1 accent-clay-soft"
                      />
                      <span>
                        {i === 0 && <span className="block text-[11px] text-clay-soft" dir="auto">{t('vocabulary.meaning.suggested')}</span>}
                        {'pack' in sense && (
                          <span className="block text-[11px] text-ink-lighter" dir="auto">{t('vocabulary.meaning.fromLibrary').replace('{name}', String(sense.pack))}</span>
                        )}
                        <span className="text-ink">{sense.pos ? <span className="text-ink-lighter">({sense.pos}) </span> : null}{sense.definition}</span>
                        {sense.example && <span className="block text-xs italic text-ink-light">{sense.example}</span>}
                      </span>
                    </label>
                  ))}
                </fieldset>
              ))}
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-subtle flex justify-end gap-2">
          {savedCount !== null ? (
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-clay-soft text-white text-sm">{t('vocabulary.library.done')}</button>
          ) : (
            <button
              onClick={() => void save()}
              disabled={saving || changes.length === 0}
              className="px-4 py-2 rounded-lg bg-clay-soft text-white text-sm disabled:opacity-40"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : tn('vocabulary.meaning.apply', changes.length)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { X, ArrowLeft, ArrowRight, Volume2, Check, Loader2, Library, PlayCircle, Search, RefreshCw, WifiOff, BookCheck } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { speakWord, getPronunciationPrefs } from '../../lib/pronunciation';
import { TOPIC_PACKS, type PackGroup, type TopicPack } from '../../data/topicPacks';
import { useDialog } from '../../lib/useDialog';
import { useOnline } from '../../lib/offline';
import { setTopicStudied, useStudiedTopics } from '../../lib/studiedTopics';
import YouGlishModal from './YouGlishModal';
import TopicLesson from './TopicLesson';
import UpgradeTopicsModal from './UpgradeTopicsModal';

const NEW_GROUP = '__pack__';

interface TopicLibraryModalProps {
  onClose: () => void;
  // Called with the category name the pack was added to, so the section can
  // jump straight to that topic.
  onAdded?: (categoryName: string) => void;
}

export default function TopicLibraryModal({ onClose, onAdded }: TopicLibraryModalProps) {
  const { t, isRTL, tn } = useTranslation();
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const vocabularyCategories = useAppStore((s) => s.vocabularyCategories);
  const importVocabularyItems = useAppStore((s) => s.importVocabularyItems);
  const signedIn = useAppStore((s) => !!s.session);
  const online = useOnline();
  const studied = useStudiedTopics();

  const [selected, setSelected] = useState<TopicPack | null>(null);
  const [target, setTarget] = useState<string>(NEW_GROUP);
  const [adding, setAdding] = useState(false);
  const [result, setResult] = useState<{ inserted: number; skipped: number; failed: number } | null>(null);

  const existingWords = useMemo(
    () => new Set(vocabularyItems.map((i) => i.word.trim().toLowerCase())),
    [vocabularyItems]
  );

  const newCountOf = (pack: TopicPack) =>
    pack.items.filter((i) => !existingWords.has(i.word.toLowerCase())).length;

  const openPack = (pack: TopicPack) => {
    setSelected(pack);
    setTarget(NEW_GROUP);
    setResult(null);
  };

  const handleAdd = async () => {
    if (!selected) return;
    const categoryName = target === NEW_GROUP ? selected.title : target;
    setAdding(true);
    const res = await importVocabularyItems(
      selected.items.map((i) => ({
        word: i.word,
        type: i.type,
        definition: i.definition,
        exampleSentence: i.example,
        masteryLevel: 0,
      })),
      { duplicateMode: 'skip', categoryForAll: categoryName }
    );
    setAdding(false);
    setResult(res);
    if (res.inserted > 0) onAdded?.(categoryName);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const accent = getPronunciationPrefs().accent;

  const [youglishWord, setYouglishWord] = useState<string | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<PackGroup | 'all'>('all');
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyStudied, setOnlyStudied] = useState(false);
  // Matches the topic's title/description or any of its words.
  const q = query.trim().toLowerCase();
  const visiblePacks = TOPIC_PACKS.filter(
    (pack) =>
      (group === 'all' || pack.group === group) &&
      (!onlyNew || newCountOf(pack) > 0) &&
      (!onlyStudied || !!studied[pack.id]) &&
      (!q || `${pack.title} ${pack.description}`.toLowerCase().includes(q) || pack.items.some((item) => item.word.toLowerCase().includes(q)))
  );
  const dialog = useDialog(() => !adding && onClose());

  return (
    <div
      className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && !adding && onClose()}
    >
      <div {...dialog.props} className="bg-card border border-border-subtle rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center gap-3">
          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="p-2 hover:bg-ink/5 rounded-lg transition-colors"
              aria-label={t('common.back')}
            >
              <BackIcon size={18} className="text-ink-light" />
            </button>
          )}
          <h2 id={dialog.titleId} className="flex-1 text-xl font-bold text-ink flex items-center gap-2">
            {selected ? (
              <>
                <span>{selected.emoji}</span>
                <span dir="ltr">{selected.title}</span>
              </>
            ) : (
              <>
                <Library size={20} className="text-clay-soft" />
                {t('vocabulary.library.title')}
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            disabled={adding}
            className="p-2 hover:bg-ink/5 rounded-lg transition-colors"
            aria-label={t('common.close')}
          >
            <X size={20} className="text-ink-light" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!selected ? (
            <>
              <div className="flex flex-wrap items-start gap-3 mb-4">
                <p className="flex-1 min-w-[14rem] text-sm text-ink-light">{t('vocabulary.library.subtitle')}</p>
                {vocabularyCategories.length > 0 && online && (
                  <button
                    onClick={() => setShowUpgrade(true)}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-border-subtle text-ink hover:bg-ink/5"
                  >
                    <RefreshCw size={14} className="text-clay-soft" /> {t('vocabulary.upgrade.title')}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <label className="relative flex-1 min-w-[12rem]">
                  <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-ink-lighter" aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('vocabulary.library.search')}
                    aria-label={t('vocabulary.library.search')}
                    className="w-full ps-9 pe-3 py-2 rounded-lg bg-ink/5 border border-border-subtle text-sm text-ink placeholder:text-ink-lighter focus:outline-none focus:border-clay-soft"
                  />
                </label>
                <div className="flex flex-wrap gap-1" role="group" aria-label={t('vocabulary.library.title')}>
                  {(['all', 'work', 'talk', 'life', 'society'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGroup(g)}
                      aria-pressed={group === g}
                      className={`px-3 py-1.5 rounded-full text-xs ${group === g ? 'bg-clay-soft text-white' : 'bg-ink/5 text-ink-light hover:text-ink'}`}
                    >
                      {t(`vocabulary.library.group.${g}`)}
                    </button>
                  ))}
                  <button
                    onClick={() => setOnlyNew((v) => !v)}
                    aria-pressed={onlyNew}
                    className={`px-3 py-1.5 rounded-full text-xs ${onlyNew ? 'bg-ink text-card' : 'bg-ink/5 text-ink-light hover:text-ink'}`}
                  >
                    {t('vocabulary.library.notAdded')}
                  </button>
                  <button
                    onClick={() => setOnlyStudied((v) => !v)}
                    aria-pressed={onlyStudied}
                    className={`px-3 py-1.5 rounded-full text-xs ${onlyStudied ? 'bg-ink text-card' : 'bg-ink/5 text-ink-light hover:text-ink'}`}
                  >
                    {t('vocabulary.library.studiedFilter')}
                  </button>
                </div>
              </div>
              {visiblePacks.length === 0 && <p className="text-sm text-ink-light py-8 text-center">{t('vocabulary.library.noMatch')}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {visiblePacks.map((pack) => {
                  const newCount = newCountOf(pack);
                  const allAdded = newCount === 0;
                  return (
                    <button
                      key={pack.id}
                      onClick={() => openPack(pack)}
                      dir="ltr"
                      className={`text-left p-4 rounded-xl border transition-all hover:border-clay-soft/60 hover:bg-clay-soft/5 ${
                        pack.featured ? 'border-clay-soft/40 bg-clay-soft/5' : 'border-border-subtle'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-2xl">{pack.emoji}</span>
                        <span className="flex items-center gap-1">
                          {studied[pack.id] && (
                            <span className="flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-500/10 text-green-700 dark:text-green-400" dir="auto">
                              <BookCheck size={11} /> {t('vocabulary.library.studied')}
                            </span>
                          )}
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-ink/5 text-ink-light">{pack.level}</span>
                        </span>
                      </div>
                      <div className="font-semibold text-ink">{pack.title}</div>
                      <div className="text-xs text-ink-light mt-1 line-clamp-2">{pack.description}</div>
                      <div className="text-[11px] mt-3 flex items-center gap-1.5">
                        {allAdded ? (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Check size={12} /> {t('vocabulary.library.inList')}
                          </span>
                        ) : (
                          <span className="text-ink-lighter">
                            {t('vocabulary.library.itemsCount').replace('{count}', String(pack.items.length))}
                            {newCount < pack.items.length ? ` · ${t('vocabulary.library.newCount').replace('{count}', String(newCount))}` : ''}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <TopicLesson
              pack={selected}
              words={
                <ul className="divide-y divide-border-subtle border border-border-subtle rounded-xl overflow-hidden">
                  {selected.items.map((item) => {
                    const owned = existingWords.has(item.word.toLowerCase());
                    return (
                      <li key={item.word} className={`p-3 ${owned ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-ink">{item.word}</span>
                          <button
                            onClick={() => void speakWord(item.word, accent)}
                            className="p-1 hover:bg-ink/5 rounded transition-colors"
                            aria-label={`${t('vocabulary.pronounce')}: ${item.word}`}
                          >
                            <Volume2 size={14} className="text-ink-light" />
                          </button>
                          <button
                            onClick={() => setYouglishWord(item.word)}
                            disabled={!online}
                            className="p-1 hover:bg-ink/5 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            aria-label={`YouGlish: ${item.word}`}
                            title={online ? t('vocabulary.pronounceYouGlish') : t('offline.needsInternet')}
                          >
                            <PlayCircle size={14} className="text-ink-light" />
                          </button>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink/5 text-ink-light">{item.pos}</span>
                          {owned && <Check size={12} className="text-green-600" />}
                        </div>
                        <div className="text-sm text-ink mt-1">{item.definition}</div>
                        <div className="text-xs text-ink-light italic mt-0.5">{item.example}</div>
                      </li>
                    );
                  })}
                </ul>
              }
            />
          )}
        </div>

        {selected && (
          <div className="px-6 py-4 border-t border-border-subtle flex flex-wrap items-center gap-3">
            <button
              onClick={() => setTopicStudied(selected.id, !studied[selected.id])}
              aria-pressed={!!studied[selected.id]}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
                studied[selected.id]
                  ? 'border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400'
                  : 'border-border-subtle text-ink hover:bg-ink/5'
              }`}
            >
              <BookCheck size={16} />
              {t(studied[selected.id] ? 'vocabulary.library.studied' : 'vocabulary.library.markStudied')}
            </button>
            {!signedIn ? null : !online && !result ? (
              <p className="flex-1 min-w-[14rem] flex items-center gap-1.5 text-xs text-ink-light">
                <WifiOff size={14} className="shrink-0" />
                {t('offline.addLater')}
              </p>
            ) : result ? (
              <>
                <p className="flex-1 text-sm text-ink">
                  {t('vocabulary.library.added')
                    .replace('{inserted}', String(result.inserted))
                    .replace('{skipped}', String(result.skipped))}
                  {result.failed > 0 && <span className="text-red-500"> · {t('vocabulary.library.failed').replace('{count}', String(result.failed))}</span>}
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark transition-colors"
                >
                  {t('vocabulary.library.done')}
                </button>
              </>
            ) : (
              <>
                <label className="flex items-center gap-2 text-sm text-ink-light flex-1 min-w-[14rem]">
                  {t('vocabulary.library.addTo')}
                  <select
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="flex-1 px-3 py-2 bg-ink/5 border border-border-subtle rounded-lg text-ink text-sm focus:outline-none focus:border-clay-soft"
                  >
                    <option value={NEW_GROUP}>{t('vocabulary.library.newGroup').replace('{name}', selected.title)}</option>
                    {vocabularyCategories
                      .filter((c) => c.name.toLowerCase() !== selected.title.toLowerCase())
                      .map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                  </select>
                </label>
                <button
                  onClick={handleAdd}
                  disabled={adding || newCountOf(selected) === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-clay-soft text-white rounded-lg hover:bg-clay-soft-dark disabled:opacity-40 transition-colors"
                >
                  {adding && <Loader2 size={16} className="animate-spin" />}
                  {newCountOf(selected) === 0
                    ? t('vocabulary.library.allInList')
                    : tn('vocabulary.library.addN', newCountOf(selected))}
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {youglishWord && <YouGlishModal word={youglishWord} onClose={() => setYouglishWord(null)} />}
      {showUpgrade && <UpgradeTopicsModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}

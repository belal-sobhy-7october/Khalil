import { useState } from 'react';
import { BookOpen, Mic2, Repeat, Library } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import VocabularySection from '../Vocabulary/VocabularySection';
import AccentTab from './AccentTab';
import ShadowingTab from './ShadowingTab';
import ReadingTab from './ReadingTab';

type Tab = 'vocabulary' | 'accent' | 'shadowing' | 'reading';
const TABS: Array<{ id: Tab; icon: typeof BookOpen }> = [
  { id: 'vocabulary', icon: BookOpen },
  { id: 'accent', icon: Mic2 },
  { id: 'shadowing', icon: Repeat },
  { id: 'reading', icon: Library },
];
const STORAGE_KEY = 'khalil-english-tab';

function readTab(): Tab {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && TABS.some((x) => x.id === v)) return v as Tab;
  } catch {
    // ignore
  }
  return 'vocabulary';
}

export default function EnglishHub() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>(readTab);

  const choose = (next: Tab) => {
    setTab(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex gap-1 p-1 rounded-xl bg-ink/5 overflow-x-auto" role="tablist" aria-label={t('nav.vocabulary')}>
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => choose(id)}
              className={`flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === id ? 'bg-card text-ink shadow-sm' : 'text-ink-light hover:text-ink'
              }`}
            >
              <Icon size={16} />
              {t(`english.tabs.${id}`)}
            </button>
          ))}
        </div>
      </div>
      {tab === 'vocabulary' ? (
        <VocabularySection />
      ) : (
        <div className="max-w-6xl mx-auto p-6">
          {tab === 'accent' && <AccentTab />}
          {tab === 'shadowing' && <ShadowingTab />}
          {tab === 'reading' && <ReadingTab />}
        </div>
      )}
    </div>
  );
}

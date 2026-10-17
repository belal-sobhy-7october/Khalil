import { useState } from 'react';
import { BookOpen, Headphones, Library, Mic2, PenLine, Repeat } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import type { CourseSectionId } from '../../data/courses';
import type { PracticeKind } from '../../lib/englishPractice';
import VocabularySection from '../Vocabulary/VocabularySection';
import CourseSection, { type LinksTarget } from './CourseSection';
import PronunciationReference from './PronunciationReference';
import ReadingBook from './ReadingBook';
import ShadowingMethod from './ShadowingMethod';
import StudyTimer from './StudyTimer';

type Tab = 'vocabulary' | CourseSectionId;

/** The hub's sections, in study order. Names are English in both languages, as the owner asked. */
const TABS: Array<{ id: Tab; label: string; icon: typeof BookOpen }> = [
  { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
  { id: 'pronunciation', label: 'Pronunciation & Accent', icon: Mic2 },
  { id: 'listening', label: 'Listening', icon: Headphones },
  { id: 'reading', label: 'Reading', icon: Library },
  { id: 'grammar', label: 'Grammar', icon: PenLine },
  { id: 'shadowing', label: 'Shadowing', icon: Repeat },
];

/** The practice timer and "your own links" each section keeps (older sections keep their old keys). */
const SECTION_SETUP: Record<CourseSectionId, { timer: PracticeKind; links: LinksTarget }> = {
  pronunciation: { timer: 'accent', links: { section: 'accent', track: 'pronunciation' } },
  listening: { timer: 'listening', links: { section: 'accent', track: 'listening' } },
  reading: { timer: 'reading', links: { section: 'reading' } },
  grammar: { timer: 'grammar', links: { section: 'accent', track: 'grammar' } },
  shadowing: { timer: 'shadowing', links: { section: 'shadowing' } },
};

const STORAGE_KEY = 'khalil-english-tab';

function readTab(): Tab {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'accent') return 'pronunciation'; // the tab's old name
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
        <div className="flex gap-1 p-1 rounded-xl bg-ink/5 overflow-x-auto scrollbar-thin" role="tablist" aria-label={t('nav.vocabulary')}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => choose(id)}
              dir="ltr"
              className={`flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === id ? 'bg-card text-ink shadow-sm' : 'text-ink-light hover:text-ink'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>
      {tab === 'vocabulary' ? (
        <VocabularySection />
      ) : (
        <div key={tab} className="max-w-6xl mx-auto p-6 space-y-6">
          <StudyTimer kind={SECTION_SETUP[tab].timer} />
          <CourseSection sectionId={tab} links={SECTION_SETUP[tab].links} loopPlayer={tab === 'shadowing'} />
          {tab === 'pronunciation' && <PronunciationReference />}
          {tab === 'reading' && <ReadingBook />}
          {tab === 'shadowing' && <ShadowingMethod />}
        </div>
      )}
    </div>
  );
}

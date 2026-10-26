import { lazy, Suspense, useEffect, useState } from 'react';
import { BookOpen, Headphones, Library, Mic2, PenLine, Repeat, Route } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import type { CourseSectionId } from '../../data/courses';
import type { PracticeKind } from '../../lib/englishPractice';
import VocabularySection from '../Vocabulary/VocabularySection';
import CourseSection, { type LinksTarget } from './CourseSection';
import PronunciationReference from './PronunciationReference';
import ReadingBook from './ReadingBook';
import ShadowingMethod from './ShadowingMethod';
import StudyTimer from './StudyTimer';
import { ENGLISH_TAB_EVENT } from '../../lib/openReview';
import { ENGLISH_TABS, readEnglishTab, showPage, writeEnglishTab, type EnglishTab } from '../../lib/routes';

const LearningPathSection = lazy(() => import('../LearningPath/LearningPathSection'));

type Tab = EnglishTab;

const ICONS: Record<Tab, typeof BookOpen> = {
  path: Route,
  vocabulary: BookOpen,
  pronunciation: Mic2,
  listening: Headphones,
  reading: Library,
  grammar: PenLine,
  shadowing: Repeat,
};

/**
 * The hub's sections, in study order, after the learning path that draws on
 * all of them. Names are English in both languages, as the owner asked
 * (lib/routes.ts, where each tab's address comes from too).
 */
const TABS = ENGLISH_TABS.map((tab) => ({ ...tab, icon: ICONS[tab.id] }));

/** The practice timer and "your own links" each section keeps (older sections keep their old keys). */
const SECTION_SETUP: Record<CourseSectionId, { timer: PracticeKind; links: LinksTarget }> = {
  pronunciation: { timer: 'accent', links: { section: 'accent', track: 'pronunciation' } },
  listening: { timer: 'listening', links: { section: 'accent', track: 'listening' } },
  reading: { timer: 'reading', links: { section: 'reading' } },
  grammar: { timer: 'grammar', links: { section: 'accent', track: 'grammar' } },
  shadowing: { timer: 'shadowing', links: { section: 'shadowing' } },
};

export default function EnglishHub() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>(readEnglishTab);

  const choose = (next: Tab) => {
    setTab(next);
    writeEnglishTab(next);
    // Its own address (/languages/english/<tab>); nothing changes when the address already names it (Back).
    showPage('vocabulary', next);
    window.scrollTo?.({ top: 0 });
  };

  // Other parts of the app (a review reminder, the learning path) can open a tab.
  useEffect(() => {
    const onTab = (e: Event) => {
      const next = (e as CustomEvent<string>).detail;
      if (TABS.some((x) => x.id === next)) choose(next as Tab);
    };
    window.addEventListener(ENGLISH_TAB_EVENT, onTab);
    return () => window.removeEventListener(ENGLISH_TAB_EVENT, onTab);
  }, []);

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
      {tab === 'path' ? (
        <Suspense fallback={<div className="h-64" />}>
          <LearningPathSection onOpenTab={choose} />
        </Suspense>
      ) : tab === 'vocabulary' ? (
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

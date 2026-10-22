import { useState } from 'react';
import { BookOpen, ChevronDown, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { STUDY_SOURCES } from '../../data/englishStudy';

const book = STUDY_SOURCES.find((s) => s.id === 'reading-listening-book')!;
const METHOD = ['skim', 'listen', 'readAloud', 'words', 'retell'] as const;

/** The Reading section's own book (a Drive PDF) and how to study each lesson. */
export default function ReadingBook() {
  const { t } = useTranslation();
  const [showBook, setShowBook] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6 items-start">
      <div className="rounded-xl border border-border-subtle overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen size={18} className="text-clay-soft shrink-0" />
            <span className="font-semibold text-ink truncate">{t('english.reading.bookTitle')}</span>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowBook((v) => !v)}
              aria-expanded={showBook}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-ink/5 text-ink hover:bg-ink/10"
            >
              {t(showBook ? 'english.reading.hide' : 'english.reading.show')}
              <ChevronDown size={12} className={`transition-transform ${showBook ? 'rotate-180' : ''}`} />
            </button>
            <a href={book.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-clay-soft text-white">
              <ExternalLink size={12} /> {t('english.reading.openDrive')}
            </a>
          </div>
        </div>
        {showBook && (
          <>
            <iframe src={book.embedUrl} title={t('english.reading.bookTitle')} className="w-full h-[75vh] bg-white border-t border-border-subtle" allow="autoplay" />
            <p className="px-4 py-2 text-[11px] text-ink-lighter">{t('english.reading.driveHint')}</p>
          </>
        )}
      </div>

      <div className="rounded-xl border border-border-subtle p-4">
        <h3 className="font-semibold text-ink mb-2">{t('english.reading.methodTitle')}</h3>
        <ol className="space-y-2">
          {METHOD.map((m, i) => (
            <li key={m} className="flex gap-2 text-sm">
              <span className="w-5 h-5 shrink-0 rounded-full bg-clay-soft/15 text-clay-soft text-xs flex items-center justify-center">{i + 1}</span>
              <span className="text-ink-light">{t(`english.reading.step.${m}`)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

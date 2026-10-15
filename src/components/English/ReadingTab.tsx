import { useState } from 'react';
import { ExternalLink, BookOpen, Headphones } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { STUDY_SOURCES } from '../../data/englishStudy';
import { youtubeEmbedUrl, type YouTubeRef } from '../../lib/youtube';
import SavedLinks from './SavedLinks';
import StudyTimer from './StudyTimer';

const book = STUDY_SOURCES.find((s) => s.id === 'reading-listening-book')!;
const METHOD = ['skim', 'listen', 'readAloud', 'words', 'retell'] as const;

export default function ReadingTab() {
  const { t } = useTranslation();
  const [showBook, setShowBook] = useState(true);
  const [playing, setPlaying] = useState<{ ref: YouTubeRef; url: string } | null>(null);

  return (
    <div className="space-y-6">
      <StudyTimer kind="reading" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6 items-start">
        <div className="rounded-xl border border-border-subtle overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border-subtle">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen size={18} className="text-clay-soft shrink-0" />
              <span className="font-semibold text-ink truncate">{t('english.reading.bookTitle')}</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setShowBook((v) => !v)} className="px-2.5 py-1 text-xs rounded-lg bg-ink/5 text-ink hover:bg-ink/10">
                {t(showBook ? 'english.reading.hide' : 'english.reading.show')}
              </button>
              <a href={book.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-clay-soft text-white">
                <ExternalLink size={12} /> {t('english.reading.openDrive')}
              </a>
            </div>
          </div>
          {showBook && (
            <iframe src={book.embedUrl} title={t('english.reading.bookTitle')} className="w-full h-[75vh] bg-white" allow="autoplay" />
          )}
          <p className="px-4 py-2 text-[11px] text-ink-lighter">{t('english.reading.driveHint')}</p>
        </div>

        <div className="space-y-4">
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
          <div className="rounded-xl border border-border-subtle p-4 space-y-2">
            <h3 className="font-semibold text-ink flex items-center gap-2"><Headphones size={16} className="text-clay-soft" /> {t('english.reading.listeningTitle')}</h3>
            <p className="text-xs text-ink-light">{t('english.reading.listeningHint')}</p>
            <a href="https://www.naturalreaders.com/online/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-clay-soft hover:underline">
              <ExternalLink size={12} /> NaturalReaders
            </a>
            <SavedLinks section="reading" activeUrl={playing?.url} onPlay={(ref, url) => setPlaying({ ref, url })} />
            {playing && (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                <iframe key={playing.url} src={youtubeEmbedUrl(playing.ref)} title="Listening" className="w-full h-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

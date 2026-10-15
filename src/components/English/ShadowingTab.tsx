import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { LISTENING_TIME } from '../../data/englishStudy';
import type { YouTubeRef } from '../../lib/youtube';
import LoopPlayer from './LoopPlayer';
import SavedLinks from './SavedLinks';
import StudyTimer from './StudyTimer';

const STEPS = ['listen', 'read', 'chunk', 'shadow', 'record'] as const;

export default function ShadowingTab() {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState<{ ref: YouTubeRef; url: string } | null>(null);

  return (
    <div className="space-y-6">
      <StudyTimer kind="shadowing" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6 items-start">
        <div className="space-y-4">
          {playing ? (
            <LoopPlayer key={playing.url} source={playing.ref} />
          ) : (
            <div className="aspect-video w-full rounded-xl border border-dashed border-border-subtle flex flex-col items-center justify-center text-center p-6 gap-2">
              <p className="text-sm text-ink">{t('english.shadowing.empty')}</p>
              <p className="text-xs text-ink-light">{t('english.shadowing.emptyHint')}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border-subtle p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-ink">Listening Time Podcast</h3>
              <p className="text-xs text-ink-light">{t('english.shadowing.channelDesc')}</p>
            </div>
            <a href={`${LISTENING_TIME}/playlists`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clay-soft text-white text-sm hover:bg-clay-soft-dark">
              <ExternalLink size={14} /> {t('english.shadowing.openPlaylists')}
            </a>
            <p className="text-[11px] text-ink-lighter">{t('english.shadowing.pasteHint')}</p>
            <SavedLinks section="shadowing" activeUrl={playing?.url} onPlay={(ref, url) => setPlaying({ ref, url })} />
          </div>

          <div className="rounded-xl border border-border-subtle p-4">
            <h3 className="font-semibold text-ink mb-2">{t('english.shadowing.methodTitle')}</h3>
            <ol className="space-y-2">
              {STEPS.map((s, i) => (
                <li key={s} className="flex gap-2 text-sm">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-clay-soft/15 text-clay-soft text-xs flex items-center justify-center">{i + 1}</span>
                  <span className="text-ink-light">{t(`english.shadowing.step.${s}`)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

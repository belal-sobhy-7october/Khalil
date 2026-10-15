import { useState } from 'react';
import { ExternalLink, Volume2, Snail } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { speakBrowser, speakWord, getPronunciationPrefs } from '../../lib/pronunciation';
import { youtubeEmbedUrl, type YouTubeRef } from '../../lib/youtube';
import {
  ACCENT_FEATURES, ACCENT_TRACKS, CONSONANTS, VOWELS, Z_AMERICAN_ENGLISH, channelSearchUrl, type AccentTrack, type SoundEntry,
} from '../../data/englishStudy';
import SavedLinks from './SavedLinks';
import StudyTimer from './StudyTimer';

function SoundGrid({ title, sounds }: { title: string; sounds: SoundEntry[] }) {
  const accent = getPronunciationPrefs().accent;
  return (
    <div>
      <h4 className="text-sm font-semibold text-ink mb-2">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2" dir="ltr">
        {sounds.map((s) => (
          <div key={s.ipa} className="p-2.5 rounded-lg border border-border-subtle" title={s.tip}>
            <div className="text-lg font-semibold text-clay-soft">/{s.ipa}/</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {s.examples.map((w) => (
                <button
                  key={w}
                  onClick={() => void speakWord(w, accent)}
                  className="px-1.5 py-0.5 rounded bg-ink/5 text-xs text-ink hover:bg-clay-soft/15"
                >
                  {w}
                </button>
              ))}
            </div>
            {s.tip && <p className="text-[10px] text-ink-lighter mt-1 leading-snug">{s.tip}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AccentTab() {
  const { t } = useTranslation();
  const accent = getPronunciationPrefs().accent;
  const [track, setTrack] = useState<AccentTrack>('accent');
  const [playing, setPlaying] = useState<{ ref: YouTubeRef; url: string } | null>(null);
  const [panel, setPanel] = useState<'sounds' | 'features'>('features');

  return (
    <div className="space-y-6">
      <StudyTimer kind="accent" />

      {/* Z American English */}
      <div className="rounded-xl border border-border-subtle p-4 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-ink">Z American English</h3>
            <p className="text-sm text-ink-light">{t('english.accent.channelDesc')}</p>
          </div>
          <a href={`${Z_AMERICAN_ENGLISH}/playlists`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clay-soft text-white text-sm hover:bg-clay-soft-dark">
            <ExternalLink size={14} /> {t('english.accent.allPlaylists')}
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2" role="tablist">
          {ACCENT_TRACKS.map((tr) => (
            <button
              key={tr.id}
              role="tab"
              aria-selected={track === tr.id}
              onClick={() => setTrack(tr.id)}
              className={`p-3 rounded-xl border text-start transition-colors ${
                track === tr.id ? 'border-clay-soft bg-clay-soft/10' : 'border-border-subtle hover:bg-ink/5'
              }`}
            >
              <div className="text-xl">{tr.icon}</div>
              <div className="text-sm font-medium text-ink">{t(`english.accent.track.${tr.id}`)}</div>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs text-ink-light">{t(`english.accent.trackHint.${track}`)}</p>
          <a
            href={channelSearchUrl(Z_AMERICAN_ENGLISH, ACCENT_TRACKS.find((x) => x.id === track)!.query)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-clay-soft hover:underline"
          >
            <ExternalLink size={12} /> {t('english.accent.findOnChannel')}
          </a>
          <SavedLinks
            section="accent"
            track={track}
            activeUrl={playing?.url}
            onPlay={(ref, url) => setPlaying({ ref, url })}
          />
        </div>

        {playing && (
          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
            <iframe
              key={playing.url}
              src={youtubeEmbedUrl(playing.ref)}
              title="Lesson"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Built-in reference */}
      <div className="rounded-xl border border-border-subtle p-4 space-y-4">
        <div className="flex gap-2">
          {(['features', 'sounds'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPanel(p)}
              className={`px-3 py-1.5 rounded-lg text-sm ${panel === p ? 'bg-clay-soft text-white' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}
            >
              {t(`english.accent.panel.${p}`)}
            </button>
          ))}
        </div>

        {panel === 'features' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" dir="ltr">
            {ACCENT_FEATURES.map((f) => (
              <div key={f.id} className="p-3 rounded-lg border border-border-subtle space-y-2">
                <div className="font-semibold text-ink">{f.title}</div>
                <p className="text-xs text-ink-light">{f.explanation}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.examples.map((ex) => (
                    <span key={ex} className="inline-flex items-center rounded-lg bg-ink/5 text-xs text-ink overflow-hidden">
                      <button onClick={() => speakBrowser(ex.toLowerCase(), accent, 0.95)} className="flex items-center gap-1 px-2 py-1 hover:bg-clay-soft/15">
                        <Volume2 size={11} /> {ex}
                      </button>
                      <button onClick={() => speakBrowser(ex.toLowerCase(), accent, 0.6)} className="px-1.5 py-1 border-s border-border-subtle hover:bg-clay-soft/15" aria-label={`${t('vocabulary.practice.playSlow')}: ${ex}`}>
                        <Snail size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            <SoundGrid title={t('english.accent.vowels')} sounds={VOWELS} />
            <SoundGrid title={t('english.accent.consonants')} sounds={CONSONANTS} />
          </div>
        )}
      </div>
    </div>
  );
}

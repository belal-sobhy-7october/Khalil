import { useState } from 'react';
import { Plus, Play, ExternalLink, Trash2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useKv } from '../../lib/useKv';
import { parseYouTube, type YouTubeRef } from '../../lib/youtube';
import { normalizeUrl } from '../../lib/resourcesApi';
import { STUDY_LINKS_KEY, type PracticeKind, type StudyLink } from '../../lib/englishPractice';

/**
 * The user's own playlists/videos for one section (and optional track).
 * YouTube links play inside the page via onPlay; others open in a new tab.
 */
export default function SavedLinks({ section, track, onPlay, activeUrl }: {
  section: PracticeKind;
  track?: string;
  onPlay: (ref: YouTubeRef, url: string) => void;
  activeUrl?: string;
}) {
  const { t } = useTranslation();
  const [links, setLinks] = useKv<StudyLink[]>(STUDY_LINKS_KEY, []);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState(false);

  const mine = links.filter((l) => l.section === section && (track === undefined || l.track === track));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeUrl(url);
    if (!clean) {
      setError(true);
      return;
    }
    const link: StudyLink = {
      id: crypto.randomUUID(),
      section,
      track,
      title: title.trim() || clean.replace(/^https?:\/\/(www\.)?/, '').slice(0, 60),
      url: clean,
      createdAt: new Date().toISOString(),
    };
    setLinks((l) => [...l, link]);
    setTitle('');
    setUrl('');
    setError(false);
    setAdding(false);
    const ref = parseYouTube(clean);
    if (ref) onPlay(ref, clean);
  };

  return (
    <div className="space-y-2">
      {mine.length > 0 && (
        <ul className="space-y-1">
          {mine.map((l) => {
            const ref = parseYouTube(l.url);
            const active = activeUrl === l.url;
            return (
              <li key={l.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm ${active ? 'bg-clay-soft/10' : 'hover:bg-ink/5'}`}>
                {ref ? (
                  <button onClick={() => onPlay(ref, l.url)} className="p-1 text-clay-soft" aria-label={`${t('english.links.play')}: ${l.title}`}>
                    <Play size={14} />
                  </button>
                ) : (
                  <ExternalLink size={14} className="mx-1 text-ink-lighter" />
                )}
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-ink hover:text-clay-soft" dir="auto">
                  {l.title}
                </a>
                <span className="text-[11px] text-ink-lighter shrink-0">{ref?.listId && !ref.videoId ? t('english.links.playlist') : ref ? t('english.links.video') : ''}</span>
                <button
                  onClick={() => setLinks((all) => all.filter((x) => x.id !== l.id))}
                  className="p-1 text-ink-lighter hover:text-red-500"
                  aria-label={`${t('common.delete')}: ${l.title}`}
                >
                  <Trash2 size={13} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {adding ? (
        <form onSubmit={add} className="flex flex-wrap gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={t('english.links.urlPlaceholder')}
            dir="ltr"
            autoFocus
            className="flex-[2] min-w-[12rem] px-3 py-1.5 bg-ink/5 border border-border-subtle rounded-lg text-sm text-ink focus:outline-none focus:border-clay-soft"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('english.links.titlePlaceholder')}
            dir="auto"
            className="flex-1 min-w-[8rem] px-3 py-1.5 bg-ink/5 border border-border-subtle rounded-lg text-sm text-ink focus:outline-none focus:border-clay-soft"
          />
          <button type="submit" className="px-3 py-1.5 text-sm rounded-lg bg-clay-soft text-white">{t('common.add')}</button>
          <button type="button" onClick={() => { setAdding(false); setError(false); }} className="px-3 py-1.5 text-sm rounded-lg bg-ink/5 text-ink">
            {t('common.cancel')}
          </button>
          {error && <p className="w-full text-xs text-red-500">{t('english.links.invalid')}</p>}
        </form>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-xs text-ink-light hover:text-ink">
          <Plus size={13} /> {t('english.links.add')}
        </button>
      )}
    </div>
  );
}

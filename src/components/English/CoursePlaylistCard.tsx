import { ChevronDown, CircleCheckBig, ListChecks, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { videoThumb, type CourseEpisode, type CoursePlaylist } from '../../data/courses';
import { clockLength, episodeStats, type CourseProgress } from '../../lib/courseProgress';
import { DoneCheck, PlayingBars, ProgressBar, Thumb } from './CourseVisuals';

export type EpisodeFilter = 'all' | 'remaining' | 'done';

/** One playlist as a to-do list: a tick box per lesson and its own progress bar. */
export default function CoursePlaylistCard({
  playlist, progress, open, onToggleOpen, filter, playingId, onPlay, onSetDone, formatDuration,
}: {
  playlist: CoursePlaylist;
  progress: CourseProgress;
  open: boolean;
  onToggleOpen: () => void;
  filter: EpisodeFilter;
  playingId?: string;
  onPlay: (episode: CourseEpisode) => void;
  onSetDone: (ids: string[], done: boolean) => void;
  formatDuration: (seconds: number) => string;
}) {
  const { t, language } = useTranslation();
  const stats = episodeStats(playlist.episodes, progress);
  const complete = stats.percent === 100;
  const name = playlist.name[language];
  const shown = playlist.episodes
    .map((episode, index) => ({ episode, index }))
    .filter(({ episode }) => filter === 'all' || (filter === 'done') === !!progress[episode.id]);
  const cover = playlist.episodes[0];

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-colors ${
        complete ? 'border-gold-soft/50 bg-gold-soft/5' : 'border-border-subtle bg-card/40'
      }`}
    >
      <button
        type="button"
        onClick={onToggleOpen}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-3 text-start hover:bg-ink/[0.03] transition-colors"
      >
        <div className="relative w-20 shrink-0 aspect-video rounded-lg overflow-hidden bg-ink/10">
          {cover && <Thumb src={videoThumb(cover.id)} className="w-full h-full object-cover" />}
          <span className="absolute bottom-0.5 end-0.5 px-1 rounded bg-black/75 text-[10px] text-white tabular-nums">{stats.total}</span>
          {complete && (
            <span className="absolute inset-0 flex items-center justify-center bg-sage-soft/70 text-white">
              <CircleCheckBig size={22} />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="text-sm font-semibold text-ink leading-snug line-clamp-2" dir="auto">{name}</div>
          <div className="flex items-center gap-2 text-[11px] text-ink-light">
            <span className="tabular-nums">
              {t('english.courses.lessonsDone').replace('{done}', String(stats.done)).replace('{total}', String(stats.total))}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatDuration(stats.seconds)}</span>
            {complete && (
              <span className="ms-auto px-1.5 py-0.5 rounded-full bg-gold-soft/20 text-gold-soft-dark text-[10px] font-semibold">
                {t('english.courses.complete')}
              </span>
            )}
          </div>
          <ProgressBar value={stats.percent} size="sm" label={name} />
        </div>
        <ChevronDown size={18} className={`shrink-0 text-ink-lighter transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-border-subtle">
          {shown.length === 0 ? (
            <p className="px-4 py-3 text-xs text-ink-light">
              {t(filter === 'done' ? 'english.courses.noneDone' : 'english.courses.nothingLeft')}
            </p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {shown.map(({ episode, index }) => {
                const done = !!progress[episode.id];
                const playing = playingId === episode.id;
                return (
                  <li
                    key={episode.id}
                    className={`flex items-center gap-3 px-3 py-2 transition-colors ${playing ? 'bg-clay-soft/10' : 'hover:bg-ink/[0.03]'}`}
                  >
                    <DoneCheck
                      done={done}
                      onToggle={() => onSetDone([episode.id], !done)}
                      label={`${t(done ? 'english.courses.markNotDone' : 'english.courses.markDone')}: ${episode.title}`}
                    />
                    <button
                      type="button"
                      onClick={() => onPlay(episode)}
                      className="flex-1 min-w-0 flex items-center gap-3 text-start"
                      aria-label={`${t('english.links.play')}: ${episode.title}`}
                    >
                      <span className="w-5 shrink-0 text-center text-[11px] tabular-nums text-ink-lighter">
                        {playing ? <PlayingBars /> : index + 1}
                      </span>
                      <Thumb
                        src={videoThumb(episode.id)}
                        className={`hidden sm:block w-16 shrink-0 aspect-video rounded-md object-cover bg-ink/10 ${done ? 'opacity-60' : ''}`}
                      />
                      <span
                        className={`flex-1 min-w-0 text-[13px] leading-snug line-clamp-2 ${done ? 'text-ink-light' : 'text-ink'} ${playing ? 'font-semibold' : ''}`}
                        dir="auto"
                      >
                        {episode.title}
                      </span>
                      <span className="shrink-0 text-[10px] tabular-nums text-ink-lighter" dir="ltr">{clockLength(episode.seconds)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="flex justify-end px-3 py-2 border-t border-border-subtle">
            {complete ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(t('english.courses.resetConfirm'))) onSetDone(playlist.episodes.map((e) => e.id), false);
                }}
                className="flex items-center gap-1.5 text-[11px] text-ink-lighter hover:text-ink"
              >
                <RotateCcw size={12} /> {t('english.courses.reset')}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSetDone(playlist.episodes.map((e) => e.id), true)}
                className="flex items-center gap-1.5 text-[11px] text-ink-lighter hover:text-ink"
              >
                <ListChecks size={12} /> {t('english.courses.markAll')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, CircleCheckBig, ListChecks, RotateCcw } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { EASE } from './courseMotion';
import { videoThumb, type CourseEpisode, type CoursePlaylist } from '../../data/courses';
import { clockLength, episodeStats, lessonFraction, type CourseProgress, type WatchPositions } from '../../lib/courseProgress';
import { AnimatedNumber, DoneCheck, PlayingBars, ProgressBar, Thumb, ThumbProgress } from './CourseVisuals';

export type EpisodeFilter = 'all' | 'remaining' | 'done';

/** How long a lesson ticked under a filter stays in view, so the tick is seen before it leaves. */
const LINGER_MS = 900;

/** One playlist as a to-do list: a tick box per lesson and its own progress bar. */
export default function CoursePlaylistCard({
  playlist, progress, positions, open, onToggleOpen, filter, playingId, nextId, onPlay, onSetDone, formatDuration,
}: {
  playlist: CoursePlaylist;
  progress: CourseProgress;
  positions: WatchPositions;
  open: boolean;
  onToggleOpen: () => void;
  filter: EpisodeFilter;
  playingId?: string;
  /** The track's next lesson, marked in the list. */
  nextId?: string;
  onPlay: (episode: CourseEpisode) => void;
  onSetDone: (ids: string[], done: boolean) => void;
  formatDuration: (seconds: number) => string;
}) {
  const { t, language } = useTranslation();
  const [lingering, setLingering] = useState<string[]>([]);
  const stats = episodeStats(playlist.episodes, progress, positions);
  const complete = stats.percent === 100;
  const name = playlist.name[language];
  const shown = playlist.episodes
    .map((episode, index) => ({ episode, index }))
    .filter(
      ({ episode }) => filter === 'all' || lingering.includes(episode.id) || (filter === 'done') === !!progress[episode.id]
    );
  const cover = playlist.episodes[0];

  const toggle = (id: string, done: boolean) => {
    onSetDone([id], !done);
    if (filter === 'all') return;
    setLingering((l) => [...l, id]);
    window.setTimeout(() => setLingering((l) => l.filter((x) => x !== id)), LINGER_MS);
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-colors duration-500 ${
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
          <AnimatePresence initial={false}>
            {complete && (
              <motion.span
                key="complete"
                className="absolute inset-0 flex items-center justify-center bg-sage-soft/75 text-white"
                initial={{ opacity: 0, scale: 1.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <CircleCheckBig size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="text-sm font-semibold text-ink leading-snug line-clamp-2" dir="auto">{name}</div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-ink-light [&>span]:whitespace-nowrap">
            <span className="tabular-nums">
              {t('english.courses.lessonsDone').replace('{done}', String(stats.done)).replace('{total}', String(stats.total))}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatDuration(stats.seconds)}</span>
            <span className={`ms-auto tabular-nums font-semibold ${complete ? 'text-gold-soft-dark' : 'text-ink-light'}`}>
              {complete ? (
                t('english.courses.complete')
              ) : (
                <>
                  <AnimatedNumber value={stats.percent} />%
                </>
              )}
            </span>
          </div>
          <ProgressBar ratio={stats.ratio} size="sm" label={name} />
        </div>
        <ChevronDown size={18} className={`shrink-0 text-ink-lighter transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="lessons"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="overflow-hidden border-t border-border-subtle"
          >
            {shown.length === 0 && (
              <p className="px-4 py-3 text-xs text-ink-light">
                {t(filter === 'done' ? 'english.courses.noneDone' : 'english.courses.nothingLeft')}
              </p>
            )}
            <ul>
              <AnimatePresence initial={false}>
                {shown.map(({ episode, index }) => {
                  const done = !!progress[episode.id];
                  const fraction = lessonFraction(episode, progress, positions);
                  const partial = !done && fraction > 0;
                  const playing = playingId === episode.id;
                  const isNext = !playing && episode.id === nextId;
                  return (
                    <motion.li
                      key={episode.id}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div
                        className={`flex items-center gap-3 px-3 py-2 border-b border-border-subtle transition-colors duration-300 ${
                          playing ? 'bg-clay-soft/10' : 'hover:bg-ink/[0.03]'
                        }`}
                      >
                        <DoneCheck
                          done={done}
                          fraction={fraction}
                          onToggle={() => toggle(episode.id, done)}
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
                          <span className="relative hidden sm:block w-16 shrink-0 aspect-video rounded-md overflow-hidden bg-ink/10">
                            <Thumb
                              src={videoThumb(episode.id)}
                              className={`w-full h-full object-cover transition-opacity duration-300 ${done ? 'opacity-50' : ''}`}
                            />
                            <ThumbProgress fraction={partial ? fraction : 0} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span
                              className={`block text-[13px] leading-snug line-clamp-2 transition-colors duration-300 ${
                                done ? 'text-ink-light' : 'text-ink'
                              } ${playing ? 'font-semibold' : ''}`}
                              dir="auto"
                            >
                              {episode.title}
                            </span>
                            {isNext && (
                              <span className="inline-block mt-1 px-1.5 py-px rounded-full bg-clay-soft/15 text-clay-soft-dark text-[10px] font-semibold">
                                {t('english.courses.continue')}
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 text-end text-[10px] tabular-nums leading-tight">
                            {partial ? (
                              <span className="text-clay-soft-dark">
                                {t('english.courses.left').replace(
                                  '{time}',
                                  clockLength(episode.seconds - (positions[episode.id] ?? 0))
                                )}
                              </span>
                            ) : (
                              <span className="text-ink-lighter" dir="ltr">{clockLength(episode.seconds)}</span>
                            )}
                          </span>
                        </button>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
            <div className="flex justify-end px-3 py-2">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

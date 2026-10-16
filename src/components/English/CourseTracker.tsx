import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Check, ExternalLink, Flame, Link2, Play, SkipForward, Sparkles, Trophy } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { EASE } from './courseMotion';
import { useKv } from '../../lib/useKv';
import { getToday } from '../../store/dateHelpers';
import type { YouTubeRef } from '../../lib/youtube';
import {
  COURSE_TRACKS, getCourseTrack, isCourseTrackId, videoThumb, videoUrl, type CourseEpisode, type CourseTrackId,
} from '../../data/courses';
import {
  COURSE_POSITIONS_KEY, COURSE_PROGRESS_KEY, clockLength, doneThisWeek, dropPositions, durationParts, episodeStats, findEpisode,
  isNearEnd, lessonFraction, milestoneCrossed, nextEpisode, resumeAt, setDone, studyStreak, trackStats, type CourseProgress,
  type WatchPositions,
} from '../../lib/courseProgress';
import CoursePlaylistCard, { type EpisodeFilter } from './CoursePlaylistCard';
import {
  AnimatedNumber, Celebration, ProgressBar, ProgressRing, SegmentedProgress, Thumb, ThumbProgress, type CelebrationMessage,
} from './CourseVisuals';
import LoopPlayer from './LoopPlayer';
import SavedLinks from './SavedLinks';

const TRACK_KEY = 'khalil-english-course-track';
const FILTERS: EpisodeFilter[] = ['all', 'remaining', 'done'];
/** Save the watch position at most this often while a lesson plays (and always on pause). */
const SAVE_EVERY_MS = 15_000;

function readTrack(): CourseTrackId {
  try {
    const v = localStorage.getItem(TRACK_KEY);
    if (isCourseTrackId(v)) return v;
  } catch {
    // ignore
  }
  return 'accent';
}

const playlistDomId = (id: string) => `course-playlist-${id}`;

type Playing = { kind: 'lesson'; videoId: string; start: number } | { kind: 'link'; ref: YouTubeRef; url: string };

/**
 * The curated YouTube courses as to-do lists: every lesson has a tick box
 * that fills while you watch, and each playlist and track shows how far
 * along you are. Lessons resume where you left them and tick themselves
 * off when watched to the end.
 */
export default function CourseTracker() {
  const { t, language } = useTranslation();
  const [trackId, setTrackId] = useState<CourseTrackId>(readTrack);
  const [progress, setProgress] = useKv<CourseProgress>(COURSE_PROGRESS_KEY, {});
  const [positions, setPositions] = useKv<WatchPositions>(COURSE_POSITIONS_KEY, {});
  const [playing, setPlaying] = useState<Playing | null>(null);
  /** Where the playing lesson is right now (saved to `positions` only now and then). */
  const [live, setLive] = useState<{ id: string; seconds: number } | null>(null);
  const [justFinished, setJustFinished] = useState(false);
  const [filter, setFilter] = useState<EpisodeFilter>('all');
  const [celebration, setCelebration] = useState<CelebrationMessage | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const track = getCourseTrack(trackId);
  const watched = useMemo(
    () => (live && !progress[live.id] ? { ...positions, [live.id]: live.seconds } : positions),
    [live, positions, progress]
  );
  const stats = trackStats(track, progress, watched);
  const next = nextEpisode(track, progress);
  const today = getToday();
  const streak = studyStreak(progress, today);
  const week = doneThisWeek(progress, today);
  const [open, setOpen] = useState<Set<string>>(() => new Set([(next?.playlist ?? track.playlists[0]).id]));

  const current = playing?.kind === 'lesson' ? findEpisode(track, playing.videoId) : null;
  const currentDone = !!(current && progress[current.episode.id]);
  const afterCurrent = current ? nextEpisode(track, progress, current.episode.id) : null;

  // --- watch position: kept live in state, written to the database now and then ---
  const pending = useRef<{ id: string; seconds: number } | null>(null);
  const lastSave = useRef(0);
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  });
  const flushPosition = useCallback(() => {
    const p = pending.current;
    pending.current = null;
    if (!p || progressRef.current[p.id]) return;
    lastSave.current = Date.now();
    const seconds = Math.floor(p.seconds);
    setPositions((all) => (all[p.id] === seconds ? all : { ...all, [p.id]: seconds }));
  }, [setPositions]);
  // Save where the last lesson got to when another one starts or the page closes.
  const playingId = current?.episode.id;
  useEffect(() => flushPosition, [flushPosition, playingId]);

  const formatDuration = useCallback(
    (seconds: number) => {
      const { h, m } = durationParts(seconds);
      if (!h) return t('english.courses.minutes').replace('{m}', String(m));
      if (!m) return t('english.courses.hoursOnly').replace('{h}', String(h));
      return t('english.courses.hours').replace('{h}', String(h)).replace('{m}', String(m));
    },
    [t]
  );
  const lessonOf = (n: number, total: number) =>
    t('english.courses.lessonOf').replace('{n}', String(n)).replace('{total}', String(total));
  const dismissCelebration = useCallback(() => setCelebration(null), []);
  const trackName = (id: CourseTrackId) => t(`english.accent.track.${id}`);

  const chooseTrack = (id: CourseTrackId) => {
    if (id === trackId) return;
    setTrackId(id);
    try {
      localStorage.setItem(TRACK_KEY, id);
    } catch {
      // ignore
    }
    const nextTrack = getCourseTrack(id);
    setOpen(new Set([(nextEpisode(nextTrack, progress)?.playlist ?? nextTrack.playlists[0]).id]));
    setPlaying(null);
    setLive(null);
    setJustFinished(false);
  };

  const update = (ids: string[], done: boolean) => {
    const before = progress;
    const after = setDone(before, ids, done, today);
    setProgress(after);
    if (!done) return;
    if (pending.current && ids.includes(pending.current.id)) pending.current = null;
    setPositions((p) => dropPositions(p, ids));
    const say = (key: string, big = false) => setCelebration({ id: Date.now(), text: t(`english.courses.celebrate.${key}`), big });
    const milestone = milestoneCrossed(trackStats(track, before).lessonsPercent, trackStats(track, after).lessonsPercent);
    if (milestone === 100) return say('track', true);
    const playlistDone = track.playlists.some(
      (p) => episodeStats(p.episodes, before).percent < 100 && episodeStats(p.episodes, after).percent === 100
    );
    if (playlistDone) return say('playlist');
    if (milestone) say(`m${milestone}`);
  };

  const scrollToPlayer = () =>
    requestAnimationFrame(() => playerRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' }));

  const play = (episode: CourseEpisode) => {
    const ref = findEpisode(track, episode.id);
    if (ref) setOpen((o) => (o.has(ref.playlist.id) ? o : new Set(o).add(ref.playlist.id)));
    scrollToPlayer();
    if (playingId === episode.id) return;
    const start = progress[episode.id] ? 0 : resumeAt(positions[episode.id], episode.seconds);
    setPlaying({ kind: 'lesson', videoId: episode.id, start });
    setLive(null);
    setJustFinished(false);
  };

  const finishCurrent = () => {
    if (!current) return;
    if (!progressRef.current[current.episode.id]) update([current.episode.id], true);
    setJustFinished(true);
  };

  const onProgress = (seconds: number, isPlaying: boolean) => {
    if (!current) return;
    const { episode } = current;
    setLive({ id: episode.id, seconds });
    if (progressRef.current[episode.id]) return;
    pending.current = { id: episode.id, seconds };
    if (isNearEnd(seconds, episode.seconds)) return finishCurrent();
    if (!isPlaying || Date.now() - lastSave.current >= SAVE_EVERY_MS) flushPosition();
  };

  const openPlaylist = (id: string) => {
    setOpen((o) => (o.has(id) ? o : new Set(o).add(id)));
    requestAnimationFrame(() =>
      document.getElementById(playlistDomId(id))?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' })
    );
  };

  const toggleOpen = (id: string) =>
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  // Position bar under the player: live while it plays, saved otherwise.
  const currentSeconds = current
    ? Math.min(
        current.episode.seconds,
        live?.id === current.episode.id ? live.seconds : currentDone ? current.episode.seconds : watched[current.episode.id] ?? 0
      )
    : 0;
  const nextPosition = next && !progress[next.episode.id] ? watched[next.episode.id] ?? 0 : 0;
  const nextFraction = next ? lessonFraction(next.episode, progress, watched) : 0;

  return (
    <div className="space-y-5">
      {/* Tracks */}
      <div
        className="flex gap-2 overflow-x-auto snap-x pb-1 -mx-1 px-1 scrollbar-thin lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
        role="tablist"
        aria-label={t('english.courses.tracks')}
      >
        {COURSE_TRACKS.map((tr) => {
          const s = trackStats(tr, progress, watched);
          const selected = tr.id === trackId;
          const complete = s.percent === 100;
          return (
            <button
              key={tr.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => chooseTrack(tr.id)}
              className={`relative snap-start shrink-0 w-44 lg:w-auto flex items-center gap-3 p-2.5 pe-3 rounded-2xl border text-start transition-all duration-300 ${
                selected
                  ? 'border-clay-soft/70 bg-clay-soft/10 shadow-sm'
                  : 'border-border-subtle hover:bg-ink/5 hover:-translate-y-0.5'
              }`}
            >
              <ProgressRing ratio={s.ratio} size={46} stroke={4} animateIn>
                <span className="text-xl leading-none">{tr.icon}</span>
              </ProgressRing>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink leading-tight line-clamp-2">{trackName(tr.id)}</span>
                <span className="block text-[11px] text-ink-light tabular-nums">
                  <span dir="ltr">{s.done}/{s.total}</span>
                  <span aria-hidden="true"> · </span>
                  <AnimatedNumber value={s.percent} animateIn />%
                </span>
              </span>
              {complete && <Trophy size={13} className="absolute top-2 end-2 text-gold-soft" />}
            </button>
          );
        })}
      </div>

      {/* Track progress */}
      <section className="relative overflow-hidden rounded-3xl border border-border-subtle bg-linear-to-br from-clay-soft/12 via-gold-soft/8 to-sage-soft/12 p-5 sm:p-6">
        <span aria-hidden="true" className="pointer-events-none absolute -top-24 -end-20 w-72 h-72 rounded-full bg-gold-soft/20 blur-3xl" />
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="relative space-y-4"
        >
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 shrink-0 rounded-2xl bg-card/80 shadow-sm flex items-center justify-center text-2xl">{track.icon}</span>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h3 className="text-lg font-bold text-ink leading-tight">{trackName(track.id)}</h3>
              <a
                href={track.channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 max-w-full text-xs text-ink-light hover:text-clay-soft"
              >
                <ExternalLink size={12} className="shrink-0" />
                <span className="truncate">{track.channel.name[language]}</span>
              </a>
            </div>
            <div className="shrink-0 text-end">
              <div className="text-3xl sm:text-4xl font-bold text-ink tabular-nums leading-none">
                {stats.percent === 100 ? (
                  <Trophy size={34} className="text-gold-soft inline-block" />
                ) : (
                  <>
                    <AnimatedNumber value={stats.percent} animateIn />
                    <span className="text-lg text-ink-light">%</span>
                  </>
                )}
              </div>
              <div className="mt-1.5 text-xs text-ink-light tabular-nums">
                {t('english.courses.lessonsDone').replace('{done}', String(stats.done)).replace('{total}', String(stats.total))}
              </div>
            </div>
          </div>

          <SegmentedProgress
            label={trackName(track.id)}
            ratio={stats.ratio}
            activeId={next?.playlist.id}
            onSelect={openPlaylist}
            segments={track.playlists.map((p) => {
              const ps = episodeStats(p.episodes, progress, watched);
              return { id: p.id, size: p.episodes.length, ratio: ps.ratio, label: `${p.name[language]} — ${ps.done}/${ps.total}` };
            })}
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-ink-light">
              {t('english.courses.watched')
                .replace('{done}', formatDuration(stats.watchedSeconds))
                .replace('{total}', formatDuration(stats.seconds))}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  streak > 0 ? 'bg-clay-soft/15 text-clay-soft-dark' : 'bg-ink/5 text-ink-light'
                }`}
              >
                <Flame size={13} />
                {streak > 0 ? t('english.courses.streak').replace('{count}', String(streak)) : t('english.courses.noStreak')}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sage-soft/15 text-sage-soft-dark text-xs font-medium">
                <CalendarCheck size={13} />
                {t('english.courses.thisWeek').replace('{count}', String(week))}
              </span>
            </div>
          </div>
          <p className="text-xs text-ink-light border-t border-border-subtle pt-3">{t(`english.accent.trackHint.${track.id}`)}</p>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-5 items-start">
        {/* Player / up next */}
        <div ref={playerRef} className="lg:sticky lg:top-4 space-y-3 scroll-mt-4">
          {current && playing?.kind === 'lesson' ? (
            <>
              <LoopPlayer
                key={current.episode.id}
                source={{ videoId: current.episode.id, listId: null, start: playing.start || undefined }}
                onProgress={onProgress}
                onEnded={finishCurrent}
                compact
              />
              <div className="rounded-2xl border border-border-subtle bg-card/40 p-4 space-y-3">
                <div className="space-y-1">
                  <div className="text-[11px] text-ink-light" dir="auto">
                    {current.playlist.name[language]} · {lessonOf(current.index + 1, current.playlist.episodes.length)}
                  </div>
                  <div className="font-semibold text-ink leading-snug" dir="auto">{current.episode.title}</div>
                </div>
                <div className="space-y-1">
                  <ProgressBar ratio={currentSeconds / current.episode.seconds} label={current.episode.title} />
                  <div className="flex justify-between text-[11px] tabular-nums text-ink-light">
                    <span dir="ltr">{clockLength(currentSeconds)}</span>
                    <span dir="ltr">{clockLength(current.episode.seconds)}</span>
                  </div>
                </div>
                {justFinished && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex items-center gap-2 text-sm font-medium text-sage-soft-dark"
                  >
                    <Sparkles size={15} /> {t('english.courses.finished')}
                  </motion.div>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    aria-pressed={currentDone}
                    onClick={() => update([current.episode.id], !currentDone)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-300 ${
                      currentDone ? 'bg-sage-soft text-white' : 'bg-ink/5 text-ink hover:bg-sage-soft/15'
                    }`}
                  >
                    <Check size={15} strokeWidth={3} /> {t(currentDone ? 'english.courses.watchedIt' : 'english.courses.markDone')}
                  </button>
                  {afterCurrent && (
                    <button
                      type="button"
                      onClick={() => play(afterCurrent.episode)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-300 ${
                        justFinished || currentDone ? 'bg-clay-soft text-white hover:bg-clay-soft-dark shadow-sm' : 'bg-ink/5 text-ink hover:bg-ink/10'
                      }`}
                    >
                      <SkipForward size={15} /> {t('english.courses.next')}
                    </button>
                  )}
                  <a
                    href={videoUrl(current.episode.id, current.playlist.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ms-auto inline-flex items-center gap-1 text-xs text-ink-light hover:text-clay-soft"
                  >
                    <ExternalLink size={12} /> YouTube
                  </a>
                </div>
              </div>
            </>
          ) : playing?.kind === 'link' ? (
            <LoopPlayer key={playing.url} source={playing.ref} compact />
          ) : next ? (
            <button
              type="button"
              onClick={() => play(next.episode)}
              className="group relative block w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden bg-black text-start shadow-sm"
            >
              <Thumb
                src={videoThumb(next.episode.id, 'hqdefault')}
                eager
                className="absolute inset-0 w-full h-full object-cover opacity-80 transition duration-500 group-hover:opacity-100 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/10" />
              {/* Centred in the space above the caption. */}
              <span className="absolute inset-x-0 top-0 bottom-28 flex items-center justify-center">
                <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 text-clay-soft flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                  <Play size={26} fill="currentColor" className="translate-x-[2px]" />
                </span>
              </span>
              <span className="absolute bottom-0 inset-x-0 p-4 space-y-1 text-white">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-clay-soft text-[11px] font-semibold">
                  {nextPosition > 0
                    ? t('english.courses.resume').replace('{time}', clockLength(nextPosition))
                    : `${t(stats.done === 0 ? 'english.courses.start' : 'english.courses.continue')} · ${lessonOf(
                        next.index + 1,
                        next.playlist.episodes.length
                      )}`}
                </span>
                <span className="block font-semibold leading-snug line-clamp-2" dir="auto">{next.episode.title}</span>
                <span className="block text-xs text-white/75" dir="auto">{next.playlist.name[language]}</span>
              </span>
              <ThumbProgress fraction={nextFraction} className="h-1" />
            </button>
          ) : (
            <div className="aspect-[4/3] sm:aspect-video w-full rounded-2xl border border-gold-soft/50 bg-linear-to-br from-gold-soft/20 via-sage-soft/10 to-clay-soft/10 flex flex-col items-center justify-center text-center gap-2 p-6">
              <Trophy size={44} className="text-gold-soft" />
              <div className="text-lg font-bold text-ink">{t('english.courses.trackDone')}</div>
              <p className="text-sm text-ink-light">{t('english.courses.rewatch')}</p>
            </div>
          )}
        </div>

        {/* Playlists */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-ink">
              {t('english.courses.playlists')} <span className="text-ink-lighter font-normal">({track.playlists.length})</span>
            </h4>
            <div className="flex rounded-lg bg-ink/5 p-0.5" role="group" aria-label={t('english.courses.filterLabel')}>
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors duration-200 ${
                    filter === f ? 'bg-card text-ink shadow-sm' : 'text-ink-light hover:text-ink'
                  }`}
                >
                  {t(`english.courses.filter.${f}`)}
                </button>
              ))}
            </div>
          </div>
          {track.playlists.map((p) => (
            <div key={p.id} id={playlistDomId(p.id)} className="scroll-mt-4">
              <CoursePlaylistCard
                playlist={p}
                progress={progress}
                positions={watched}
                open={open.has(p.id)}
                onToggleOpen={() => toggleOpen(p.id)}
                filter={filter}
                playingId={playingId}
                nextId={next?.episode.id}
                onPlay={play}
                onSetDone={update}
                formatDuration={formatDuration}
              />
            </div>
          ))}
          <details className="group rounded-2xl border border-dashed border-border-subtle px-3 py-2">
            <summary className="flex items-center gap-1.5 cursor-pointer text-xs text-ink-light hover:text-ink list-none">
              <Link2 size={13} /> {t('english.courses.ownLinks')}
            </summary>
            <div className="mt-2">
              <SavedLinks
                section="accent"
                track={track.id}
                activeUrl={playing?.kind === 'link' ? playing.url : undefined}
                onPlay={(ref, url) => {
                  setPlaying({ kind: 'link', ref, url });
                  setLive(null);
                  setJustFinished(false);
                }}
              />
            </div>
          </details>
        </div>
      </div>

      <Celebration message={celebration} onDone={dismissCelebration} />
    </div>
  );
}

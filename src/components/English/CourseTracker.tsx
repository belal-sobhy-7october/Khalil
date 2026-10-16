import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Check, ExternalLink, Flame, Link2, Play, SkipForward, Sparkles, Trophy } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useKv } from '../../lib/useKv';
import { getToday } from '../../store/dateHelpers';
import type { YouTubeRef } from '../../lib/youtube';
import {
  COURSE_TRACKS, getCourseTrack, isCourseTrackId, videoThumb, videoUrl, type CourseEpisode, type CourseTrackId,
} from '../../data/courses';
import {
  COURSE_PROGRESS_KEY, doneThisWeek, durationParts, episodeStats, findEpisode, milestoneCrossed, nextEpisode, setDone,
  studyStreak, trackStats, type CourseProgress,
} from '../../lib/courseProgress';
import CoursePlaylistCard, { type EpisodeFilter } from './CoursePlaylistCard';
import { Celebration, ProgressBar, ProgressRing, Thumb, type CelebrationMessage } from './CourseVisuals';
import LoopPlayer from './LoopPlayer';
import SavedLinks from './SavedLinks';

const TRACK_KEY = 'khalil-english-course-track';
const FILTERS: EpisodeFilter[] = ['all', 'remaining', 'done'];

function readTrack(): CourseTrackId {
  try {
    const v = localStorage.getItem(TRACK_KEY);
    if (isCourseTrackId(v)) return v;
  } catch {
    // ignore
  }
  return 'accent';
}

type Playing = { kind: 'lesson'; videoId: string } | { kind: 'link'; ref: YouTubeRef; url: string };

/**
 * The curated YouTube courses as to-do lists: every lesson has a tick box,
 * and each playlist, track and the whole hub show how far along you are.
 */
export default function CourseTracker() {
  const { t, language } = useTranslation();
  const [trackId, setTrackId] = useState<CourseTrackId>(readTrack);
  const [progress, setProgress] = useKv<CourseProgress>(COURSE_PROGRESS_KEY, {});
  const [playing, setPlaying] = useState<Playing | null>(null);
  const [justFinished, setJustFinished] = useState(false);
  const [filter, setFilter] = useState<EpisodeFilter>('all');
  const [celebration, setCelebration] = useState<CelebrationMessage | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const track = getCourseTrack(trackId);
  const stats = trackStats(track, progress);
  const next = nextEpisode(track, progress);
  const today = getToday();
  const streak = studyStreak(progress, today);
  const week = doneThisWeek(progress, today);
  const [open, setOpen] = useState<Set<string>>(() => new Set([(next?.playlist ?? track.playlists[0]).id]));

  const current = playing?.kind === 'lesson' ? findEpisode(track, playing.videoId) : null;
  const currentDone = !!(current && progress[current.episode.id]);
  const afterCurrent = current ? nextEpisode(track, progress, current.episode.id) : null;

  const formatDuration = useCallback(
    (seconds: number) => {
      const { h, m } = durationParts(seconds);
      return h
        ? t('english.courses.hours').replace('{h}', String(h)).replace('{m}', String(m))
        : t('english.courses.minutes').replace('{m}', String(m));
    },
    [t]
  );
  const lessonOf = (n: number, total: number) =>
    t('english.courses.lessonOf').replace('{n}', String(n)).replace('{total}', String(total));
  const dismissCelebration = useCallback(() => setCelebration(null), []);

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
    setJustFinished(false);
  };

  const update = (ids: string[], done: boolean) => {
    const before = progress;
    const after = setDone(before, ids, done, today);
    setProgress(after);
    if (!done) return;
    const say = (key: string, big = false) => setCelebration({ id: Date.now(), text: t(`english.courses.celebrate.${key}`), big });
    const milestone = milestoneCrossed(trackStats(track, before).percent, trackStats(track, after).percent);
    if (milestone === 100) return say('track', true);
    const playlistDone = track.playlists.some(
      (p) => episodeStats(p.episodes, before).percent < 100 && episodeStats(p.episodes, after).percent === 100
    );
    if (playlistDone) return say('playlist');
    if (milestone) say(`m${milestone}`);
  };

  const play = (episode: CourseEpisode) => {
    setPlaying({ kind: 'lesson', videoId: episode.id });
    setJustFinished(false);
    const ref = findEpisode(track, episode.id);
    if (ref) setOpen((o) => (o.has(ref.playlist.id) ? o : new Set(o).add(ref.playlist.id)));
    requestAnimationFrame(() => playerRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' }));
  };

  const onEnded = () => {
    if (!current) return;
    if (!progress[current.episode.id]) update([current.episode.id], true);
    setJustFinished(true);
  };

  const toggleOpen = (id: string) =>
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="space-y-5">
      {/* Tracks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2" role="tablist" aria-label={t('english.courses.tracks')}>
        {COURSE_TRACKS.map((tr) => {
          const s = trackStats(tr, progress);
          const selected = tr.id === trackId;
          return (
            <button
              key={tr.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => chooseTrack(tr.id)}
              className={`relative p-3 rounded-2xl border text-start transition-all ${
                selected
                  ? 'border-clay-soft bg-clay-soft/10 shadow-sm'
                  : 'border-border-subtle hover:bg-ink/5 hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-2xl leading-none">{tr.icon}</span>
                {s.percent === 100 ? (
                  <Trophy size={15} className="text-gold-soft" />
                ) : (
                  <span className="text-[10px] font-semibold tabular-nums text-ink-light">{s.percent}%</span>
                )}
              </div>
              <div className="mt-2 text-sm font-medium text-ink leading-tight">{t(`english.accent.track.${tr.id}`)}</div>
              <div className="mt-2 flex items-center gap-2">
                <ProgressBar value={s.percent} size="sm" className="flex-1" />
                <span className="text-[10px] tabular-nums text-ink-lighter" dir="ltr">{s.done}/{s.total}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Track progress */}
      <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-linear-to-br from-clay-soft/15 via-gold-soft/10 to-sage-soft/15 p-4 sm:p-5">
        <span aria-hidden="true" className="pointer-events-none absolute -top-20 -end-16 w-64 h-64 rounded-full bg-gold-soft/25 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <ProgressRing value={stats.percent} size={108} stroke={10}>
            <div className="text-center leading-none">
              <div className="text-2xl font-bold text-ink tabular-nums">
                {stats.percent}
                <span className="text-sm">%</span>
              </div>
              {stats.percent === 100 && <Trophy size={14} className="mx-auto mt-1 text-gold-soft" />}
            </div>
          </ProgressRing>
          <div className="flex-1 min-w-0 space-y-2.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-lg font-bold text-ink">{t(`english.accent.track.${track.id}`)}</h3>
              <a
                href={track.channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-ink-light hover:text-clay-soft"
              >
                <ExternalLink size={12} /> {track.channel.name}
              </a>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-light">
              <span>
                {t('english.courses.lessonsDone').replace('{done}', String(stats.done)).replace('{total}', String(stats.total))}
              </span>
              <span>
                {t('english.courses.watched')
                  .replace('{done}', formatDuration(stats.doneSeconds))
                  .replace('{total}', formatDuration(stats.seconds))}
              </span>
            </div>
            <ProgressBar value={stats.percent} size="lg" milestones label={t(`english.accent.track.${track.id}`)} />
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
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
            <p className="text-xs text-ink-light">{t(`english.accent.trackHint.${track.id}`)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-5 items-start">
        {/* Player / up next */}
        <div ref={playerRef} className="lg:sticky lg:top-4 space-y-3 scroll-mt-4">
          {current ? (
            <>
              <LoopPlayer key={current.episode.id} source={{ videoId: current.episode.id, listId: null }} onEnded={onEnded} hideHint />
              <div className="rounded-2xl border border-border-subtle p-4 space-y-3">
                <div className="space-y-1">
                  <div className="text-[11px] text-ink-light" dir="auto">
                    {current.playlist.name[language]} · {lessonOf(current.index + 1, current.playlist.episodes.length)}
                  </div>
                  <div className="font-semibold text-ink leading-snug" dir="auto">{current.episode.title}</div>
                </div>
                {justFinished && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentDone ? 'bg-sage-soft text-white' : 'bg-ink/5 text-ink hover:bg-sage-soft/15'
                    }`}
                  >
                    <Check size={15} strokeWidth={3} /> {t(currentDone ? 'english.courses.watchedIt' : 'english.courses.markDone')}
                  </button>
                  {afterCurrent && (
                    <button
                      type="button"
                      onClick={() => play(afterCurrent.episode)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
            <LoopPlayer key={playing.url} source={playing.ref} hideHint />
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
                  {t(stats.done === 0 ? 'english.courses.start' : 'english.courses.continue')} ·{' '}
                  {lessonOf(next.index + 1, next.playlist.episodes.length)}
                </span>
                <span className="block font-semibold leading-snug line-clamp-2" dir="auto">{next.episode.title}</span>
                <span className="block text-xs text-white/75" dir="auto">{next.playlist.name[language]}</span>
              </span>
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
                  className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                    filter === f ? 'bg-card text-ink shadow-sm' : 'text-ink-light hover:text-ink'
                  }`}
                >
                  {t(`english.courses.filter.${f}`)}
                </button>
              ))}
            </div>
          </div>
          {track.playlists.map((p) => (
            <CoursePlaylistCard
              key={p.id}
              playlist={p}
              progress={progress}
              open={open.has(p.id)}
              onToggleOpen={() => toggleOpen(p.id)}
              filter={filter}
              playingId={current?.episode.id}
              onPlay={play}
              onSetDone={update}
              formatDuration={formatDuration}
            />
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

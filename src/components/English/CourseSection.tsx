import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, CalendarCheck, Check, ExternalLink, Flame, Headphones, Link2, Loader2, MonitorPlay, Play, RefreshCw, SkipForward,
  Sparkles, Trophy,
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { EASE } from './courseMotion';
import { doneKey, markDoneKey } from './courseLabels';
import { useKv } from '../../lib/useKv';
import { getToday } from '../../store/dateHelpers';
import type { YouTubeRef } from '../../lib/youtube';
import type { PracticeKind } from '../../lib/englishPractice';
import { podcastGroups, usePodcast, type PodcastStatus } from '../../lib/podcast';
import {
  getCourseSection, videoThumb, videoUrl, type CourseLesson, type CourseSection as Section, type CourseSectionId, type CourseSource,
} from '../../data/courses';
import {
  COURSE_POSITIONS_KEY, COURSE_PROGRESS_KEY, clockLength, doneThisWeek, dropPositions, durationParts, findLesson, isNearEnd,
  lessonFraction, lessonStats, milestoneCrossed, nextLesson, resumeAt, setDone, sourceStats, studyStreak, type CourseProgress,
  type WatchPositions,
} from '../../lib/courseProgress';
import CourseGroupCard, { type LessonFilter } from './CourseGroupCard';
import {
  AnimatedNumber, Celebration, ProgressRing, ProgressBar, SegmentedProgress, Thumb, ThumbProgress, type CelebrationMessage,
} from './CourseVisuals';
import AudioPlayer from './AudioPlayer';
import LoopPlayer from './LoopPlayer';
import SavedLinks from './SavedLinks';

const FILTERS: LessonFilter[] = ['all', 'remaining', 'done'];
/** Save the watch position at most this often while a lesson plays (and always on pause). */
const SAVE_EVERY_MS = 15_000;

const sourceStorageKey = (sectionId: CourseSectionId) => `khalil-english-source:${sectionId}`;
/** Milliseconds since `time` (called from player events, never while rendering). */
const msSince = (time: number) => Date.now() - time;
const groupDomId = (id: string) => `course-group-${id}`;

function readSource(section: Section): string {
  try {
    const v = localStorage.getItem(sourceStorageKey(section.id));
    if (v && section.sources.some((s) => s.key === v)) return v;
  } catch {
    // ignore
  }
  return section.sources[0]?.key ?? '';
}

function SourceIcon({ kind, size = 15 }: { kind: CourseSource['kind']; size?: number }) {
  if (kind === 'podcast') return <Headphones size={size} />;
  if (kind === 'library') return <BookOpen size={size} />;
  return <MonitorPlay size={size} />;
}

export interface LinksTarget {
  section: PracticeKind;
  track?: string;
}

/**
 * One study section (Pronunciation & Accent, Listening, …): its sources to
 * choose from, and for the chosen one every lesson as a to-do list with
 * progress that moves while you watch or listen.
 */
export default function CourseSection({ sectionId, loopPlayer = false, links }: {
  sectionId: CourseSectionId;
  /** Show the shadowing loop controls (A–B) on videos. */
  loopPlayer?: boolean;
  /** Where "Your own links" are kept for this section. */
  links: LinksTarget;
}) {
  const { t } = useTranslation();
  const section = getCourseSection(sectionId);
  const [progress, setProgress] = useKv<CourseProgress>(COURSE_PROGRESS_KEY, {});
  const [positions, setPositions] = useKv<WatchPositions>(COURSE_POSITIONS_KEY, {});
  /** Where the playing lesson is right now (saved to `positions` only now and then). */
  const [live, setLive] = useState<{ id: string; seconds: number } | null>(null);
  const podcastSource = section.sources.find((s) => s.kind === 'podcast');
  const podcast = usePodcast(podcastSource?.appleId);

  const sources = useMemo(
    () =>
      section.sources.map((s) =>
        s.kind === 'podcast' && podcast.feed ? { ...s, groups: podcastGroups(s.id, podcast.feed.episodes) } : s
      ),
    [section, podcast.feed]
  );
  const [sourceKey, setSourceKey] = useState(() => readSource(section));
  const source = sources.find((s) => s.key === sourceKey) ?? sources[0];
  const watched = useMemo(
    () => (live && !progress[live.id] ? { ...positions, [live.id]: live.seconds } : positions),
    [live, positions, progress]
  );

  const choose = (key: string) => {
    if (key === source.key) return;
    setSourceKey(key);
    setLive(null);
    try {
      localStorage.setItem(sourceStorageKey(section.id), key);
    } catch {
      // ignore
    }
  };

  if (!source) return null;
  return (
    <div className="space-y-5">
      {sources.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin" role="tablist" aria-label={t('english.courses.sources')}>
          {sources.map((s) => {
            const st = sourceStats(s.groups, progress, watched);
            const selected = s.key === source.key;
            return (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => choose(s.key)}
                className={`shrink-0 flex items-center gap-2.5 ps-1.5 pe-4 py-1.5 rounded-full border text-start transition-all duration-300 ${
                  selected ? 'border-clay-soft/70 bg-clay-soft/10 shadow-sm' : 'border-border-subtle hover:bg-ink/5'
                }`}
              >
                <ProgressRing ratio={st.ratio} size={38} stroke={3.5} animateIn>
                  <span className={selected ? 'text-clay-soft' : 'text-ink-light'}>
                    <SourceIcon kind={s.kind} />
                  </span>
                </ProgressRing>
                <span>
                  <span className="block text-sm font-semibold text-ink leading-tight">
                    <bdi>{s.name}</bdi>
                  </span>
                  <span className="block text-[11px] text-ink-light tabular-nums">
                    {t(`english.courses.kind.${s.kind}`)}
                    {st.total > 0 && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <AnimatedNumber value={st.percent} animateIn />%
                      </>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
      <SourceView
        // A podcast's episodes arrive after the first render: start afresh then, with its next part open.
        key={`${source.key}:${source.groups.length > 0}`}
        section={section}
        source={source}
        progress={progress}
        setProgress={setProgress}
        positions={positions}
        setPositions={setPositions}
        watched={watched}
        live={live}
        setLive={setLive}
        loopPlayer={loopPlayer}
        links={links}
        podcastStatus={source.kind === 'podcast' ? podcast.status : 'ready'}
        onRetry={podcast.retry}
      />
    </div>
  );
}

type Playing = { kind: 'lesson'; id: string; start: number } | { kind: 'link'; ref: YouTubeRef; url: string };

function SourceView({
  section, source, progress, setProgress, positions, setPositions, watched, live, setLive, loopPlayer, links, podcastStatus, onRetry,
}: {
  section: Section;
  source: CourseSource;
  progress: CourseProgress;
  setProgress: (next: CourseProgress | ((prev: CourseProgress) => CourseProgress)) => void;
  positions: WatchPositions;
  setPositions: (next: WatchPositions | ((prev: WatchPositions) => WatchPositions)) => void;
  watched: WatchPositions;
  live: { id: string; seconds: number } | null;
  setLive: (live: { id: string; seconds: number } | null) => void;
  loopPlayer: boolean;
  links: LinksTarget;
  podcastStatus: PodcastStatus;
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  const groups = source.groups;
  const [playing, setPlaying] = useState<Playing | null>(null);
  const [justFinished, setJustFinished] = useState(false);
  const [filter, setFilter] = useState<LessonFilter>('all');
  const [celebration, setCelebration] = useState<CelebrationMessage | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const stats = sourceStats(groups, progress, watched);
  const next = nextLesson(groups, progress);
  const today = getToday();
  const streak = studyStreak(progress, today);
  const week = doneThisWeek(progress, today);
  const [open, setOpen] = useState<Set<string>>(() => {
    const first = next?.group ?? groups[0];
    return new Set(first ? [first.id] : []);
  });

  const current = playing?.kind === 'lesson' ? findLesson(groups, playing.id) : null;
  const currentDone = !!(current && progress[current.lesson.id]);
  const afterCurrent = current ? nextLesson(groups, progress, current.lesson.id) : null;

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
  // Save where the last lesson got to when another one starts or the section closes.
  const currentId = current?.lesson.id;
  useEffect(() => flushPosition, [flushPosition, currentId]);

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

  const update = (ids: string[], done: boolean) => {
    const before = progress;
    const after = setDone(before, ids, done, today);
    setProgress(after);
    if (!done) return;
    if (pending.current && ids.includes(pending.current.id)) pending.current = null;
    setPositions((p) => dropPositions(p, ids));
    const say = (key: string, big = false) => setCelebration({ id: Date.now(), text: t(`english.courses.celebrate.${key}`), big });
    const milestone = milestoneCrossed(sourceStats(groups, before).lessonsPercent, sourceStats(groups, after).lessonsPercent);
    if (milestone === 100) return say('track', true);
    const groupDone = groups.some((g) => lessonStats(g.lessons, before).percent < 100 && lessonStats(g.lessons, after).percent === 100);
    if (groupDone) return say('playlist');
    if (milestone) say(`m${milestone}`);
  };

  const scrollToPlayer = () =>
    requestAnimationFrame(() => playerRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' }));

  const openLesson = (lesson: CourseLesson) => {
    const ref = findLesson(groups, lesson.id);
    if (ref) setOpen((o) => (o.has(ref.group.id) ? o : new Set(o).add(ref.group.id)));
    scrollToPlayer();
    if (currentId === lesson.id) return;
    const start = progress[lesson.id] ? 0 : resumeAt(positions[lesson.id], lesson.seconds);
    setPlaying({ kind: 'lesson', id: lesson.id, start });
    setLive(null);
    setJustFinished(false);
  };

  const finishCurrent = () => {
    if (!current) return;
    if (!progressRef.current[current.lesson.id]) update([current.lesson.id], true);
    setJustFinished(true);
  };

  const onProgress = (seconds: number, isPlaying: boolean) => {
    if (!current) return;
    const { lesson } = current;
    setLive({ id: lesson.id, seconds });
    if (progressRef.current[lesson.id]) return;
    pending.current = { id: lesson.id, seconds };
    if (isNearEnd(seconds, lesson.seconds)) return finishCurrent();
    if (!isPlaying || msSince(lastSave.current) >= SAVE_EVERY_MS) flushPosition();
  };

  const openGroup = (id: string) => {
    setOpen((o) => (o.has(id) ? o : new Set(o).add(id)));
    requestAnimationFrame(() => document.getElementById(groupDomId(id))?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' }));
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
        current.lesson.seconds,
        live?.id === current.lesson.id ? live.seconds : currentDone ? current.lesson.seconds : watched[current.lesson.id] ?? 0
      )
    : 0;
  const nextPosition = next && !progress[next.lesson.id] ? watched[next.lesson.id] ?? 0 : 0;
  const nextFraction = next ? lessonFraction(next.lesson, progress, watched) : 0;
  const external = (lesson: CourseLesson, listId: string) =>
    lesson.kind === 'video' ? videoUrl(lesson.id, listId) : lesson.url ?? source.channel.url;

  const doneButton = current && (
    <button
      type="button"
      aria-pressed={currentDone}
      onClick={() => update([current.lesson.id], !currentDone)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-300 ${
        currentDone ? 'bg-sage-soft text-white' : 'bg-ink/5 text-ink hover:bg-sage-soft/15'
      }`}
    >
      <Check size={15} strokeWidth={3} /> {t(currentDone ? doneKey(current.lesson.kind) : markDoneKey(current.lesson.kind))}
    </button>
  );
  const nextButton = afterCurrent && (
    <button
      type="button"
      onClick={() => openLesson(afterCurrent.lesson)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-300 ${
        justFinished || currentDone ? 'bg-clay-soft text-white hover:bg-clay-soft-dark shadow-sm' : 'bg-ink/5 text-ink hover:bg-ink/10'
      }`}
    >
      <SkipForward size={15} /> {t('english.courses.next')}
    </button>
  );

  const loading = groups.length === 0;

  return (
    <div className="space-y-5">
      {/* Progress */}
      <section className="relative overflow-hidden rounded-3xl border border-border-subtle bg-linear-to-br from-clay-soft/12 via-gold-soft/8 to-sage-soft/12 p-5 sm:p-6">
        <span aria-hidden="true" className="pointer-events-none absolute -top-24 -end-20 w-72 h-72 rounded-full bg-gold-soft/20 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE }} className="relative space-y-4">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 shrink-0 rounded-2xl bg-card/80 shadow-sm flex items-center justify-center text-2xl">{section.icon}</span>
            <div className="flex-1 min-w-0 space-y-0.5">
              <h3 className="text-lg font-bold text-ink leading-tight">
                <bdi>{section.name}</bdi>
              </h3>
              <a
                href={source.channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 max-w-full text-xs text-ink-light hover:text-clay-soft"
              >
                <ExternalLink size={12} className="shrink-0" />
                <bdi className="truncate">{source.channel.name}</bdi>
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

          {loading ? (
            <div className="h-3 rounded-full bg-ink/10 animate-pulse" />
          ) : (
            <SegmentedProgress
              label={section.name}
              ratio={stats.ratio}
              activeId={next?.group.id}
              onSelect={openGroup}
              segments={groups.map((g) => {
                const gs = lessonStats(g.lessons, progress, watched);
                return { id: g.id, size: g.lessons.length, ratio: gs.ratio, label: `${g.name} — ${gs.done}/${gs.total}` };
              })}
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-ink-light">
              {stats.seconds > 0 &&
                t(source.kind === 'podcast' ? 'english.courses.listened' : 'english.courses.watched')
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
          <p className="text-xs text-ink-light border-t border-border-subtle pt-3">{t(`english.courses.tip.${section.id}`)}</p>
        </motion.div>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-border-subtle p-8 flex flex-col items-center justify-center gap-3 text-center">
          {podcastStatus === 'error' ? (
            <>
              <p className="text-sm text-ink">{t('english.courses.podcastFailed')}</p>
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clay-soft text-white text-sm hover:bg-clay-soft-dark"
              >
                <RefreshCw size={14} /> {t('english.courses.retry')}
              </button>
            </>
          ) : (
            <>
              <Loader2 className="animate-spin text-clay-soft" />
              <p className="text-sm text-ink-light">{t('english.courses.loadingEpisodes')}</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-5 items-start">
          {/* Player / up next */}
          <div ref={playerRef} className="lg:sticky lg:top-4 space-y-3 scroll-mt-4">
            {current && playing?.kind === 'lesson' ? (
              current.lesson.kind === 'book' ? (
                <div className="rounded-2xl border border-border-subtle bg-card/40 p-5 flex flex-col sm:flex-row gap-5">
                  <div className="w-32 shrink-0 self-center sm:self-start aspect-[2/3] rounded-xl overflow-hidden bg-ink/10 shadow-lg">
                    {current.lesson.image && <Thumb src={current.lesson.image} eager className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="space-y-1">
                      <div className="text-[11px] text-ink-light">
                        <bdi>{current.group.name}</bdi> · {lessonOf(current.index + 1, current.group.lessons.length)}
                      </div>
                      <div className="text-lg font-bold text-ink leading-snug">
                        <bdi>{current.lesson.title}</bdi>
                      </div>
                      <p className="text-xs text-ink-light">{t('english.courses.bookHint')}</p>
                    </div>
                    <a
                      href={current.lesson.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-clay-soft text-white text-sm font-semibold hover:bg-clay-soft-dark shadow-sm"
                    >
                      <BookOpen size={16} /> {t('english.courses.readBook')}
                    </a>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {doneButton}
                      {nextButton}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {current.lesson.kind === 'audio' ? (
                    <AudioPlayer
                      key={current.lesson.id}
                      src={current.lesson.url ?? ''}
                      start={playing.start}
                      onProgress={onProgress}
                      onEnded={finishCurrent}
                    />
                  ) : (
                    <LoopPlayer
                      key={current.lesson.id}
                      source={{ videoId: current.lesson.id, listId: null, start: playing.start || undefined }}
                      onProgress={onProgress}
                      onEnded={finishCurrent}
                      compact={!loopPlayer}
                    />
                  )}
                  <div className="rounded-2xl border border-border-subtle bg-card/40 p-4 space-y-3">
                    <div className="space-y-1">
                      <div className="text-[11px] text-ink-light">
                        <bdi>{current.group.name}</bdi> · {lessonOf(current.index + 1, current.group.lessons.length)}
                      </div>
                      <div className="font-semibold text-ink leading-snug">
                        <bdi>{current.lesson.title}</bdi>
                      </div>
                    </div>
                    {current.lesson.kind === 'video' && current.lesson.seconds > 0 && (
                      <div className="space-y-1">
                        <ProgressBar ratio={currentSeconds / current.lesson.seconds} label={current.lesson.title} />
                        <div className="flex justify-between text-[11px] tabular-nums text-ink-light">
                          <span dir="ltr">{clockLength(currentSeconds)}</span>
                          <span dir="ltr">{clockLength(current.lesson.seconds)}</span>
                        </div>
                      </div>
                    )}
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
                      {doneButton}
                      {nextButton}
                      <a
                        href={external(current.lesson, current.group.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ms-auto inline-flex items-center gap-1 text-xs text-ink-light hover:text-clay-soft"
                      >
                        <ExternalLink size={12} /> {current.lesson.kind === 'video' ? 'YouTube' : t('english.courses.openAudio')}
                      </a>
                    </div>
                  </div>
                </>
              )
            ) : playing?.kind === 'link' ? (
              <LoopPlayer key={playing.url} source={playing.ref} compact={!loopPlayer} />
            ) : next ? (
              <button
                type="button"
                onClick={() => openLesson(next.lesson)}
                className="group relative block w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden bg-black text-start shadow-sm"
              >
                {next.lesson.kind === 'video' && (
                  <Thumb
                    src={videoThumb(next.lesson.id, 'hqdefault')}
                    eager
                    className="absolute inset-0 w-full h-full object-cover opacity-80 transition duration-500 group-hover:opacity-100 group-hover:scale-105"
                  />
                )}
                {next.lesson.kind === 'audio' && (
                  <span className="absolute inset-0 bg-linear-to-br from-clay-soft via-clay-soft-dark to-gold-soft-dark">
                    <Headphones aria-hidden="true" className="absolute -end-6 -top-6 w-48 h-48 text-white/10" />
                  </span>
                )}
                {next.lesson.kind === 'book' && next.lesson.image && (
                  <>
                    <Thumb src={next.lesson.image} eager className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm scale-110" />
                    <span className="absolute top-4 inset-x-0 flex justify-center">
                      <Thumb src={next.lesson.image} eager className="h-36 sm:h-44 aspect-[2/3] rounded-lg object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                    </span>
                  </>
                )}
                <span className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/10" />
                {next.lesson.kind !== 'book' && (
                  <span className="absolute inset-x-0 top-0 bottom-28 flex items-center justify-center">
                    <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 text-clay-soft flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                      <Play size={26} fill="currentColor" className="translate-x-[2px]" />
                    </span>
                  </span>
                )}
                <span className="absolute bottom-0 inset-x-0 p-4 space-y-1 text-white">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-clay-soft text-[11px] font-semibold">
                    {nextPosition > 0
                      ? t('english.courses.resume').replace('{time}', clockLength(nextPosition))
                      : `${t(stats.done === 0 ? 'english.courses.start' : 'english.courses.continue')} · ${lessonOf(
                          next.index + 1,
                          next.group.lessons.length
                        )}`}
                  </span>
                  <span className="font-semibold leading-snug line-clamp-2">
                    <bdi>{next.lesson.title}</bdi>
                  </span>
                  <span className="block text-xs text-white/75">
                    <bdi>{next.group.name}</bdi>
                  </span>
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

          {/* Levels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-ink">
                {t('english.courses.levels')} <span className="text-ink-lighter font-normal">({groups.length})</span>
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
            {groups.map((g) => (
              <div key={g.id} id={groupDomId(g.id)} className="scroll-mt-4">
                <CourseGroupCard
                  group={g}
                  progress={progress}
                  positions={watched}
                  open={open.has(g.id)}
                  onToggleOpen={() => toggleOpen(g.id)}
                  filter={filter}
                  activeId={currentId}
                  nextId={next?.lesson.id}
                  onOpenLesson={openLesson}
                  onSetDone={update}
                  formatDuration={formatDuration}
                />
              </div>
            ))}
            {source.kind === 'youtube' && (
              <details className="group rounded-2xl border border-dashed border-border-subtle px-3 py-2">
                <summary className="flex items-center gap-1.5 cursor-pointer text-xs text-ink-light hover:text-ink list-none">
                  <Link2 size={13} /> {t('english.courses.ownLinks')}
                </summary>
                <div className="mt-2">
                  <SavedLinks
                    section={links.section}
                    track={links.track}
                    activeUrl={playing?.kind === 'link' ? playing.url : undefined}
                    onPlay={(ref, url) => {
                      setPlaying({ kind: 'link', ref, url });
                      setLive(null);
                      setJustFinished(false);
                    }}
                  />
                </div>
              </details>
            )}
          </div>
        </div>
      )}

      <Celebration message={celebration} onDone={dismissCelebration} />
    </div>
  );
}

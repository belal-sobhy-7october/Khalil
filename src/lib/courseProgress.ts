/** Watched-lesson tracking for the English hub's YouTube courses. */
import type { CourseEpisode, CoursePlaylist, CourseTrack } from '../data/courses';
import { addDaysToDateString } from '../store/dateHelpers';

export const COURSE_PROGRESS_KEY = 'english-course-progress';
export const COURSE_POSITIONS_KEY = 'english-course-positions';

/** videoId → the local date (YYYY-MM-DD) the lesson was ticked off. */
export type CourseProgress = Record<string, string>;

/** videoId → how far (seconds) a lesson that isn't done yet was watched. */
export type WatchPositions = Record<string, number>;

export interface ProgressStats {
  /** Lessons ticked off. */
  done: number;
  /** Lessons started but not ticked off. */
  started: number;
  total: number;
  seconds: number;
  /** Time watched: whole lessons done plus how far into the started ones. */
  watchedSeconds: number;
  /** 0–1, counting a started lesson by how much of it was watched; 1 only once every lesson is done. */
  ratio: number;
  /** `ratio` as a whole percentage. */
  percent: number;
  /** Lessons done as a whole percentage (milestones go by this). */
  lessonsPercent: number;
}

/** A track's lessons in study order, each once (a video can sit in two playlists). */
export function trackEpisodes(track: CourseTrack): CourseEpisode[] {
  const seen = new Set<string>();
  return track.playlists.flatMap((p) => p.episodes).filter((e) => !seen.has(e.id) && !!seen.add(e.id));
}

/** How much of one lesson counts as watched, 0–1 (1 only when ticked off). */
export function lessonFraction(episode: CourseEpisode, progress: CourseProgress, positions: WatchPositions = {}): number {
  if (progress[episode.id]) return 1;
  const position = positions[episode.id] ?? 0;
  if (episode.seconds <= 0 || position <= 0) return 0;
  return Math.min(0.99, position / episode.seconds);
}

const wholePercent = (part: number, whole: number) => (whole === 0 ? 0 : part >= whole ? 100 : Math.floor((part * 100) / whole));

export function episodeStats(episodes: CourseEpisode[], progress: CourseProgress, positions: WatchPositions = {}): ProgressStats {
  let done = 0;
  let started = 0;
  let seconds = 0;
  let watchedSeconds = 0;
  let units = 0;
  for (const e of episodes) {
    const fraction = lessonFraction(e, progress, positions);
    seconds += e.seconds;
    watchedSeconds += fraction === 1 ? e.seconds : Math.round(fraction * e.seconds);
    units += fraction;
    if (fraction === 1) done += 1;
    else if (fraction > 0) started += 1;
  }
  const total = episodes.length;
  const ratio = total === 0 ? 0 : done === total ? 1 : units / total;
  return {
    done,
    started,
    total,
    seconds,
    watchedSeconds,
    ratio,
    percent: done === total && total > 0 ? 100 : Math.min(99, Math.floor(ratio * 100)),
    lessonsPercent: wholePercent(done, total),
  };
}

export const trackStats = (track: CourseTrack, progress: CourseProgress, positions: WatchPositions = {}) =>
  episodeStats(trackEpisodes(track), progress, positions);

export interface EpisodeRef {
  playlist: CoursePlaylist;
  episode: CourseEpisode;
  /** 0-based position inside its playlist. */
  index: number;
}

export function findEpisode(track: CourseTrack, videoId: string): EpisodeRef | null {
  for (const playlist of track.playlists) {
    const index = playlist.episodes.findIndex((e) => e.id === videoId);
    if (index >= 0) return { playlist, episode: playlist.episodes[index], index };
  }
  return null;
}

/**
 * The lesson to watch next: the first one not done after `afterId` (when
 * given), wrapping round to the start of the track.
 */
export function nextEpisode(track: CourseTrack, progress: CourseProgress, afterId?: string): EpisodeRef | null {
  const all = track.playlists.flatMap((playlist) => playlist.episodes.map((episode, index) => ({ playlist, episode, index })));
  const from = afterId ? all.findIndex((r) => r.episode.id === afterId) + 1 : 0;
  const ordered = [...all.slice(from), ...all.slice(0, from)];
  return ordered.find((r) => !progress[r.episode.id] && r.episode.id !== afterId) ?? null;
}

export function setDone(progress: CourseProgress, ids: string[], done: boolean, date: string): CourseProgress {
  const next = { ...progress };
  for (const id of ids) {
    if (done) next[id] ??= date;
    else delete next[id];
  }
  return next;
}

/** Positions without the given lessons (the same object when none of them had one). */
export function dropPositions(positions: WatchPositions, ids: string[]): WatchPositions {
  if (!ids.some((id) => id in positions)) return positions;
  const next = { ...positions };
  for (const id of ids) delete next[id];
  return next;
}

/**
 * Whether a lesson has been watched to its end: what's left is at most 8% of
 * it and never more than 45 seconds (the outro and end screen).
 */
export function isNearEnd(position: number, length: number): boolean {
  return length > 0 && position >= length - Math.min(45, length * 0.08);
}

/** Where to start a lesson again: a few seconds before where it was left, or the start. */
export function resumeAt(position: number | undefined, length: number): number {
  if (!position || position < 10 || isNearEnd(position, length)) return 0;
  return Math.max(0, Math.floor(position) - 3);
}

/** Days in a row with at least one lesson done, ending today (or yesterday, if today has none yet). */
export function studyStreak(progress: CourseProgress, today: string): number {
  const days = new Set(Object.values(progress));
  let day = days.has(today) ? today : addDaysToDateString(today, -1);
  let streak = 0;
  while (days.has(day)) {
    streak += 1;
    day = addDaysToDateString(day, -1);
  }
  return streak;
}

/** Lessons done in the 7 days ending today. */
export function doneThisWeek(progress: CourseProgress, today: string): number {
  const from = addDaysToDateString(today, -6);
  return Object.values(progress).filter((d) => d >= from && d <= today).length;
}

const MILESTONES = [100, 75, 50, 25] as const;
export type Milestone = (typeof MILESTONES)[number];

/** The highest milestone passed on the way from `before` to `after` percent. */
export function milestoneCrossed(before: number, after: number): Milestone | null {
  return MILESTONES.find((m) => before < m && after >= m) ?? null;
}

/** "2h 05m"-style parts of a duration, rounded to minutes. */
export function durationParts(seconds: number): { h: number; m: number } {
  const minutes = Math.round(seconds / 60);
  return { h: Math.floor(minutes / 60), m: minutes % 60 };
}

/** "12:05" / "1:02:09" — a video's length. */
export function clockLength(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

/** Watched-lesson tracking for the English hub's YouTube courses. */
import type { CourseEpisode, CoursePlaylist, CourseTrack } from '../data/courses';
import { addDaysToDateString } from '../store/dateHelpers';

export const COURSE_PROGRESS_KEY = 'english-course-progress';

/** videoId → the local date (YYYY-MM-DD) the lesson was ticked off. */
export type CourseProgress = Record<string, string>;

export interface ProgressStats {
  done: number;
  total: number;
  seconds: number;
  doneSeconds: number;
  /** 0–100; only 100 once every lesson is done. */
  percent: number;
}

/** A track's lessons in study order, each once (a video can sit in two playlists). */
export function trackEpisodes(track: CourseTrack): CourseEpisode[] {
  const seen = new Set<string>();
  return track.playlists.flatMap((p) => p.episodes).filter((e) => !seen.has(e.id) && !!seen.add(e.id));
}

export function episodeStats(episodes: CourseEpisode[], progress: CourseProgress): ProgressStats {
  let done = 0;
  let seconds = 0;
  let doneSeconds = 0;
  for (const e of episodes) {
    seconds += e.seconds;
    if (progress[e.id]) {
      done += 1;
      doneSeconds += e.seconds;
    }
  }
  const total = episodes.length;
  const percent = total === 0 ? 0 : done === total ? 100 : Math.floor((done * 100) / total);
  return { done, total, seconds, doneSeconds, percent };
}

export const trackStats = (track: CourseTrack, progress: CourseProgress) => episodeStats(trackEpisodes(track), progress);

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
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

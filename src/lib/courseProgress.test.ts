import { describe, expect, it } from 'vitest';
import type { CourseTrack } from '../data/courses';
import { COURSE_TRACKS } from '../data/courses';
import {
  clockLength, doneThisWeek, durationParts, episodeStats, milestoneCrossed, nextEpisode, setDone, studyStreak, trackEpisodes, trackStats,
} from './courseProgress';

const ep = (id: string, seconds = 600) => ({ id, title: id, seconds });
const track: CourseTrack = {
  id: 'accent',
  icon: '🗣️',
  channel: { name: 'Channel', url: 'https://example.com' },
  playlists: [
    { id: 'P1', name: { en: 'One', ar: 'واحد' }, episodes: [ep('a'), ep('b'), ep('c')] },
    { id: 'P2', name: { en: 'Two', ar: 'اتنين' }, episodes: [ep('b'), ep('d', 1200)] },
  ],
};

describe('course progress', () => {
  it('counts each lesson once even when it sits in two playlists', () => {
    expect(trackEpisodes(track).map((e) => e.id)).toEqual(['a', 'b', 'c', 'd']);
    expect(trackStats(track, { b: '2026-10-16' })).toEqual({ done: 1, total: 4, seconds: 3000, doneSeconds: 600, percent: 25 });
  });

  it('only reaches 100% when every lesson is done', () => {
    const many = Array.from({ length: 199 }, (_, i) => ep(`v${i}`));
    const progress = Object.fromEntries(many.slice(0, 198).map((e) => [e.id, '2026-10-16']));
    expect(episodeStats(many, progress).percent).toBe(99);
    expect(episodeStats([], {}).percent).toBe(0);
  });

  it('suggests the first unwatched lesson, or the next one after the current lesson', () => {
    expect(nextEpisode(track, {})?.episode.id).toBe('a');
    expect(nextEpisode(track, { a: 'x', b: 'x' })).toMatchObject({ playlist: { id: 'P1' }, index: 2 });
    expect(nextEpisode(track, {}, 'c')?.episode.id).toBe('b'); // b in P2
    expect(nextEpisode(track, { b: 'x', d: 'x' }, 'c')?.episode.id).toBe('a'); // wraps round
    expect(nextEpisode(track, { a: 'x', b: 'x', c: 'x', d: 'x' })).toBeNull();
  });

  it('keeps the first date a lesson was ticked and removes unticked ones', () => {
    const p = setDone({ a: '2026-10-01' }, ['a', 'b'], true, '2026-10-16');
    expect(p).toEqual({ a: '2026-10-01', b: '2026-10-16' });
    expect(setDone(p, ['a'], false, '2026-10-16')).toEqual({ b: '2026-10-16' });
  });

  it('counts the streak of study days up to today or yesterday', () => {
    const p = { a: '2026-10-14', b: '2026-10-15', c: '2026-10-15', d: '2026-10-12' };
    expect(studyStreak(p, '2026-10-15')).toBe(2);
    expect(studyStreak(p, '2026-10-16')).toBe(2); // nothing yet today: the streak still stands
    expect(studyStreak(p, '2026-10-17')).toBe(0);
    expect(studyStreak({ a: '2026-02-28', b: '2026-03-01' }, '2026-03-01')).toBe(2);
    expect(doneThisWeek(p, '2026-10-18')).toBe(4);
    expect(doneThisWeek(p, '2026-10-19')).toBe(3);
  });

  it('reports the highest milestone crossed', () => {
    expect(milestoneCrossed(20, 26)).toBe(25);
    expect(milestoneCrossed(20, 60)).toBe(50);
    expect(milestoneCrossed(80, 100)).toBe(100);
    expect(milestoneCrossed(50, 60)).toBeNull();
  });

  it('formats durations', () => {
    expect(durationParts(3 * 3600 + 25 * 60 + 40)).toEqual({ h: 3, m: 26 });
    expect(clockLength(605)).toBe('10:05');
    expect(clockLength(4568)).toBe('1:16:08');
  });
});

describe('course catalog', () => {
  it('has episodes for every playlist and no lesson twice in one track', () => {
    expect(COURSE_TRACKS.map((t) => t.id)).toEqual(['accent', 'phonetics', 'grammar', 'reading', 'ielts']);
    for (const t of COURSE_TRACKS) {
      for (const p of t.playlists) expect(p.episodes.length, p.id).toBeGreaterThan(0);
      const ids = t.playlists.flatMap((p) => p.episodes.map((e) => e.id));
      expect(new Set(ids).size, t.id).toBe(ids.length);
    }
  });
});

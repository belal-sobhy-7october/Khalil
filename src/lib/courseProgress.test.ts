import { describe, expect, it } from 'vitest';
import type { CourseGroup } from '../data/courses';
import { COURSE_SECTIONS } from '../data/courses';
import {
  clockLength, doneThisWeek, dropPositions, durationParts, isNearEnd, lessonFraction, lessonStats, milestoneCrossed, nextLesson,
  resumeAt, setDone, sourceLessons, sourceStats, studyStreak,
} from './courseProgress';

const ep = (id: string, seconds = 600) => ({ id, title: id, seconds, kind: 'video' as const });
const groups: CourseGroup[] = [
  { id: 'P1', name: 'One', lessons: [ep('a'), ep('b'), ep('c')] },
  { id: 'P2', name: 'Two', lessons: [ep('b'), ep('d', 1200)] },
];

describe('course progress', () => {
  it('counts each lesson once even when it sits in two playlists', () => {
    expect(sourceLessons(groups).map((e) => e.id)).toEqual(['a', 'b', 'c', 'd']);
    expect(sourceStats(groups, { b: '2026-10-16' })).toEqual({
      done: 1, started: 0, total: 4, seconds: 3000, watchedSeconds: 600, ratio: 0.25, percent: 25, lessonsPercent: 25,
    });
  });

  it('gives part-watched lessons partial credit, but never a full lesson', () => {
    expect(lessonFraction(ep('a'), {}, { a: 300 })).toBe(0.5);
    expect(lessonFraction(ep('a'), {}, { a: 9999 })).toBe(0.99);
    expect(lessonFraction(ep('a'), { a: 'x' }, { a: 10 })).toBe(1);
    const s = sourceStats(groups, { b: 'x' }, { a: 300, d: 600 });
    expect(s).toMatchObject({ done: 1, started: 2, watchedSeconds: 600 + 300 + 600, lessonsPercent: 25 });
    expect(s.ratio).toBeCloseTo((1 + 0.5 + 0.5) / 4);
    expect(s.percent).toBe(50);
  });

  it('only reaches 100% when every lesson is done', () => {
    const many = Array.from({ length: 199 }, (_, i) => ep(`v${i}`));
    const progress = Object.fromEntries(many.slice(0, 198).map((e) => [e.id, '2026-10-16']));
    expect(lessonStats(many, progress, { v198: 599 }).percent).toBe(99);
    expect(lessonStats(many, progress).lessonsPercent).toBe(99);
    expect(lessonStats([], {}).percent).toBe(0);
  });

  it('suggests the first unwatched lesson, or the next one after the current lesson', () => {
    expect(nextLesson(groups, {})?.lesson.id).toBe('a');
    expect(nextLesson(groups, { a: 'x', b: 'x' })).toMatchObject({ group: { id: 'P1' }, index: 2 });
    expect(nextLesson(groups, {}, 'c')?.lesson.id).toBe('b'); // b in P2
    expect(nextLesson(groups, { b: 'x', d: 'x' }, 'c')?.lesson.id).toBe('a'); // wraps round
    expect(nextLesson(groups, { a: 'x', b: 'x', c: 'x', d: 'x' })).toBeNull();
    // Books have no length: they count only once ticked.
    expect(lessonFraction({ id: 'book:x', title: 'x', seconds: 0, kind: 'book' }, {}, { 'book:x': 50 })).toBe(0);
  });

  it('keeps the first date a lesson was ticked and removes unticked ones', () => {
    const p = setDone({ a: '2026-10-01' }, ['a', 'b'], true, '2026-10-16');
    expect(p).toEqual({ a: '2026-10-01', b: '2026-10-16' });
    expect(setDone(p, ['a'], false, '2026-10-16')).toEqual({ b: '2026-10-16' });
  });

  it('drops saved positions of finished lessons', () => {
    const positions = { a: 10, b: 20 };
    expect(dropPositions(positions, ['a'])).toEqual({ b: 20 });
    expect(dropPositions(positions, ['z'])).toBe(positions);
  });

  it('treats the outro as the end, and resumes a little before where you stopped', () => {
    expect(isNearEnd(560, 600)).toBe(true); // 8% of 10 min = 48s → capped at 45s left
    expect(isNearEnd(550, 600)).toBe(false);
    expect(isNearEnd(1756, 1800)).toBe(true); // 45s left of 30 min
    expect(isNearEnd(1700, 1800)).toBe(false);
    expect(isNearEnd(56, 60)).toBe(true);
    expect(resumeAt(undefined, 600)).toBe(0);
    expect(resumeAt(5, 600)).toBe(0); // barely started
    expect(resumeAt(250.7, 600)).toBe(247);
    expect(resumeAt(590, 600)).toBe(0); // at the end: start over
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
    expect(clockLength(-3)).toBe('0:00');
  });
});

describe('course catalog', () => {
  it('has the five sections in study order, each with lessons and no lesson twice in one source', () => {
    expect(COURSE_SECTIONS.map((s) => s.id)).toEqual(['pronunciation', 'listening', 'reading', 'grammar', 'shadowing']);
    expect(COURSE_SECTIONS.map((s) => s.sources.map((src) => src.id))).toEqual([
      ['ibrahim-adel'],
      ['ibrahim-adel', 'dalilk-daily'],
      ['ibrahim-adel', 'lovely-stories'], // Dalilk's novels join once their list is filled in
      ['ibrahim-adel'],
      ['listening-time'],
    ]);
    // Phonetics comes before the accent course.
    expect(COURSE_SECTIONS[0].sources[0].groups.map((g) => g.name)).toEqual([
      'Phonetics: Pronouncing Every Letter — Level 1',
      'British & American Phonetics — Level 2',
      'American & British Accent — Level 3',
    ]);
    for (const section of COURSE_SECTIONS) {
      for (const source of section.sources) {
        if (source.kind === 'podcast') continue; // read at runtime
        for (const g of source.groups) expect(g.lessons.length, g.id).toBeGreaterThan(0);
        const ids = source.groups.flatMap((g) => g.lessons.map((l) => l.id));
        expect(new Set(ids).size, source.key).toBe(ids.length);
      }
    }
  });
});

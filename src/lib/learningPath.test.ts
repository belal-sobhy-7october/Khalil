import { describe, expect, it } from 'vitest';
import {
  EMPTY_PATH_STATE, PATH_LENGTH, PATH_PHASES, buildPath, currentDay, dayProgress, doneByHub, packById, pathStats, scheduledDay, taskKey,
  type PathState,
} from './learningPath';
import { getCourseSection } from '../data/courses';
import { lessonsDoneOn, sectionOfLesson } from './hubLessons';

const path = buildPath();

describe('learning path plan', () => {
  it('has 90 days, each with tasks and unique task ids', () => {
    expect(path).toHaveLength(PATH_LENGTH);
    expect(path.map((d) => d.day)).toEqual(Array.from({ length: 90 }, (_, i) => i + 1));
    for (const d of path) {
      expect(d.tasks.length).toBeGreaterThan(0);
      expect(new Set(d.tasks.map((t) => t.id)).size).toBe(d.tasks.length);
      const minutes = d.tasks.reduce((n, t) => n + t.minutes, 0);
      expect(minutes).toBeGreaterThanOrEqual(15);
      expect(minutes).toBeLessThanOrEqual(75);
    }
  });

  it('uses only existing lessons, each for exactly four study days', () => {
    for (const id of PATH_PHASES.flat()) {
      expect(packById(id)).toBeDefined();
      expect(path.filter((d) => d.packId === id).map((d) => d.kind)).toEqual(['words', 'grammar', 'input', 'speak']);
    }
  });

  it('reviews every seventh day and ends with the final test', () => {
    expect(path.filter((d) => d.kind === 'review').map((d) => d.day)).toEqual([7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84]);
    expect(path[0].tasks[0].kind).toBe('baseline');
    expect(path[88].tasks[0].kind).toBe('finalTest');
    expect(path[89].tasks[0].kind).toBe('reflection');
  });

  it('every day reviews the flashcards, and each topic takes a lesson from every hub section', () => {
    for (const d of path) expect(d.tasks.some((t) => t.kind === 'review')).toBe(true);
    for (const id of PATH_PHASES.flat()) {
      const sections = path.filter((d) => d.packId === id).flatMap((d) => d.tasks.filter((t) => t.kind === 'course').map((t) => t.section));
      expect(sections.sort()).toEqual(['grammar', 'listening', 'pronunciation', 'reading', 'shadowing']);
    }
  });

  it('covers every word of a topic across its two word days', () => {
    const days = path.filter((d) => d.packId === 'travel');
    const ranges = days.flatMap((d) => d.tasks.filter((t) => t.kind === 'words').map((t) => t.words!));
    const pack = packById('travel')!;
    expect(ranges).toEqual([[0, Math.ceil(pack.items.length / 2)], [Math.ceil(pack.items.length / 2), pack.items.length]]);
  });
});

describe('learning path progress', () => {
  const doneDay = (state: PathState, day: number, date: string): PathState => ({
    ...state,
    done: { ...state.done, ...Object.fromEntries(path[day - 1].tasks.map((t) => [taskKey(day, t.id), date])) },
  });

  it('moves to the first unfinished day and counts days, minutes and streak', () => {
    let s: PathState = { ...EMPTY_PATH_STATE, startedAt: '2026-10-20' };
    expect(currentDay(path, s)).toBe(1);
    s = doneDay(s, 1, '2026-10-20');
    s = doneDay(s, 2, '2026-10-21');
    s = { ...s, done: { ...s.done, [taskKey(3, path[2].tasks[0].id)]: '2026-10-22' } };
    expect(currentDay(path, s)).toBe(3);
    expect(dayProgress(path[2], s)).toEqual({ done: 1, total: path[2].tasks.length });
    const stats = pathStats(path, s, '2026-10-22');
    expect(stats.daysDone).toBe(2);
    expect(stats.streak).toBe(3);
    expect(stats.minutes).toBe([...path[0].tasks, ...path[1].tasks, path[2].tasks[0]].reduce((n, t) => n + t.minutes, 0));
    expect(stats.bySkill.vocab.done).toBe(2);
    // A missed day breaks the streak.
    expect(pathStats(path, s, '2026-10-24').streak).toBe(0);
  });

  it('knows which day the calendar expects', () => {
    expect(scheduledDay('2026-10-20', '2026-10-20')).toBe(1);
    expect(scheduledDay('2026-10-20', '2026-10-29')).toBe(10);
    expect(scheduledDay('2026-10-20', '2027-06-01')).toBe(90);
  });
});

describe('the hub counts for the path', () => {
  const listening = getCourseSection('listening').sources[0].groups[0].lessons;
  const grammar = getCourseSection('grammar').sources[0].groups[0].lessons;
  const day1 = path[0];

  it('knows which section a lesson is from', () => {
    expect(sectionOfLesson(listening[0].id)).toBe('listening');
    expect(sectionOfLesson(grammar[0].id)).toBe('grammar');
    expect(sectionOfLesson('pod:123')).toBe('listening');
    expect(sectionOfLesson('book:a-novel')).toBe('reading');
    expect(sectionOfLesson('unknown')).toBeUndefined();
    expect(lessonsDoneOn({ [listening[0].id]: '2026-10-22', [grammar[0].id]: '2026-10-21' }, '2026-10-22')).toEqual({ listening: [listening[0].id] });
  });

  it('a lesson finished today ticks the course task; cleared flashcards tick the review', () => {
    const state: PathState = { ...EMPTY_PATH_STATE, startedAt: '2026-10-22' };
    expect(doneByHub(day1, state, { lessons: { listening: [listening[0].id] }, reviewCleared: true })).toEqual([
      { key: taskKey(1, 'review') },
      { key: taskKey(1, 'lesson-listening'), lesson: listening[0].id },
    ]);
    expect(doneByHub(day1, state, { lessons: { grammar: [grammar[0].id] }, reviewCleared: false })).toEqual([]);
  });

  it('a lesson counts for one task only', () => {
    const state: PathState = { ...EMPTY_PATH_STATE, startedAt: '2026-10-22', lessons: { [taskKey(1, 'lesson-listening')]: listening[0].id } };
    expect(doneByHub(path[4], state, { lessons: { listening: [listening[0].id] }, reviewCleared: false })).toEqual([]);
    expect(doneByHub(path[4], state, { lessons: { listening: [listening[0].id, listening[1].id] }, reviewCleared: false })).toEqual([
      { key: taskKey(5, 'lesson-listening'), lesson: listening[1].id },
    ]);
  });
});

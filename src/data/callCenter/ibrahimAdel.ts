/**
 * Ibrahim Adel's courses (Z American English), the same playlists as the
 * English hub's Grammar and Pronunciation & Accent sections, so a lesson
 * watched in either place counts in both.
 *
 * - Grammar: his three level playlists are part of the plan, one lesson on
 *   every `every`-th study day of the matching level (see plan.ts).
 * - Accent: an optional extra (its own tab); nothing from it is in the plan.
 */
import { getCourseSection, type CourseGroup, type CourseLesson, type CourseSource } from '../courses';
import type { LevelId } from './types';

export const IBRAHIM_ADEL_CHANNEL = 'Ibrahim Adel · Z American English';

const source = (section: 'grammar' | 'pronunciation'): CourseSource | undefined =>
  getCourseSection(section).sources.find((s) => s.id === 'ibrahim-adel');

/** Grammar from Films (L1), Grammar (L2) and Advanced Grammar (L3), spread over the levels' study days. */
const GRAMMAR_PLAN: Array<{ playlistId: string; level: LevelId; every: number }> = [
  { playlistId: 'PLp22-4PivYmLBmV2wctgqyyRlIs1MhmNr', level: 'L1', every: 1 },
  { playlistId: 'PLp22-4PivYmLrOU3QTrnsogoRZGFmHnGk', level: 'L2', every: 5 },
  { playlistId: 'PLp22-4PivYmJSejQkuui_SrYWObQW7pWt', level: 'L3', every: 3 },
];

export interface GrammarCourse extends CourseGroup {
  level: LevelId;
  /** One lesson every this many study days of the level. */
  every: number;
}

export const GRAMMAR_COURSES: GrammarCourse[] = GRAMMAR_PLAN.flatMap((p) => {
  const group = source('grammar')?.groups.find((g) => g.id === p.playlistId);
  return group ? [{ ...group, level: p.level, every: p.every }] : [];
});

export const grammarCourseFor = (level: LevelId) => GRAMMAR_COURSES.find((c) => c.level === level);

/** A lesson of the grammar course by video id, with its place in its playlist. */
export function getGrammarLesson(videoId: string): (CourseLesson & { course: GrammarCourse; number: number }) | undefined {
  for (const course of GRAMMAR_COURSES) {
    const i = course.lessons.findIndex((l) => l.id === videoId);
    if (i !== -1) return { ...course.lessons[i], course, number: i + 1 };
  }
  return undefined;
}

/** The grammar source for the Library tab (all three levels). */
export const GRAMMAR_COURSE_SOURCE: CourseSource = {
  key: 'callcenter/ibrahim-adel-grammar',
  id: 'ibrahim-adel-grammar',
  kind: 'youtube',
  name: 'Grammar · Ibrahim Adel',
  channel: source('grammar')?.channel ?? { name: IBRAHIM_ADEL_CHANNEL, url: 'https://www.youtube.com/@ZAmericanEnglish/courses' },
  groups: GRAMMAR_COURSES.map(({ id, name, lessons }) => ({ id, name, lessons })),
};

/** His three accent playlists, for the optional Accent tab. */
export const ACCENT_COURSE_SOURCE: CourseSource | null = (() => {
  const s = source('pronunciation');
  return s ? { ...s, key: 'callcenter-accent/ibrahim-adel', name: 'Accent · Ibrahim Adel' } : null;
})();

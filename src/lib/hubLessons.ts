/**
 * The English hub's course lessons as the learning path reads them: which
 * section a finished lesson belongs to, and the lesson to do next in the
 * source you've picked in each section.
 */
import { COURSE_SECTIONS, getCourseSection, type CourseLesson, type CourseSectionId, type CourseSource } from '../data/courses';
import { nextLesson, type CourseProgress } from './courseProgress';

let sectionByLesson: Map<string, CourseSectionId> | null = null;

/** The section a lesson id belongs to (podcast episodes are Listening, novels Reading). */
export function sectionOfLesson(id: string): CourseSectionId | undefined {
  if (id.startsWith('pod:')) return 'listening';
  if (id.startsWith('book:')) return 'reading';
  if (!sectionByLesson) {
    sectionByLesson = new Map();
    for (const section of COURSE_SECTIONS) {
      if (section.id === 'callcenter' || section.id === 'callcenter-accent') continue;
      for (const source of section.sources) {
        for (const group of source.groups) for (const lesson of group.lessons) if (!sectionByLesson.has(lesson.id)) sectionByLesson.set(lesson.id, section.id);
      }
    }
  }
  return sectionByLesson.get(id);
}

/** Lessons finished on `date`, by section. */
export function lessonsDoneOn(progress: CourseProgress, date: string): Partial<Record<CourseSectionId, string[]>> {
  const out: Partial<Record<CourseSectionId, string[]>> = {};
  for (const [id, day] of Object.entries(progress)) {
    if (day !== date) continue;
    const section = sectionOfLesson(id);
    if (section) (out[section] ??= []).push(id);
  }
  return out;
}

/** The source chosen in a section's tab (as the hub remembers it), else its first. */
export function chosenSource(sectionId: CourseSectionId): CourseSource | undefined {
  const section = getCourseSection(sectionId);
  let key: string | null = null;
  try {
    key = localStorage.getItem(`khalil-english-source:${sectionId}`);
  } catch {
    // the first source
  }
  return section.sources.find((s) => s.key === key) ?? section.sources[0];
}

/** The next lesson to do in a section's chosen source (none for a podcast before it loads, or when all are done). */
export function nextHubLesson(sectionId: CourseSectionId, progress: CourseProgress): { source: CourseSource; lesson: CourseLesson | null } | null {
  const source = chosenSource(sectionId);
  if (!source) return null;
  return { source, lesson: nextLesson(source.groups, progress)?.lesson ?? null };
}

/** A hub lesson's title (and its source's name), by id. */
export function lessonById(id: string): { title: string; source: string } | null {
  for (const section of COURSE_SECTIONS) {
    for (const source of section.sources) {
      for (const group of source.groups) {
        const lesson = group.lessons.find((l) => l.id === id);
        if (lesson) return { title: lesson.title, source: source.name };
      }
    }
  }
  return null;
}

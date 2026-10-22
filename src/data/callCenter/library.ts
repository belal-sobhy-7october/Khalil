/** Call Center Prep's video library, shaped like an English hub section so CourseSection can show it. */
import type { CourseSection, CourseSource } from '../courses';
import { CALL_CENTER_LIBRARY } from './catalog';
import { CALL_CENTER_EPISODES } from './episodes';
import { ACCENT_COURSE_SOURCE, GRAMMAR_COURSE_SOURCE } from './ibrahimAdel';

const LIBRARY_SOURCES: CourseSource[] = CALL_CENTER_LIBRARY.sources.map((s) => ({
  key: `callcenter/${s.id}`,
  id: s.id,
  kind: 'youtube',
  name: s.name,
  channel: s.channel,
  groups: s.playlists.map((p) => ({
    id: p.id,
    name: p.name,
    lessons: (CALL_CENTER_EPISODES[p.id] ?? []).map((e) => ({ ...e, kind: 'video' as const })),
  })),
}));

export const CALL_CENTER_SECTION: CourseSection = {
  id: CALL_CENTER_LIBRARY.id,
  name: CALL_CENTER_LIBRARY.name,
  icon: CALL_CENTER_LIBRARY.icon,
  sources: [...LIBRARY_SOURCES, GRAMMAR_COURSE_SOURCE],
};

/** The optional Accent tab: Ibrahim Adel's accent course. Nothing from it is in the plan. */
export const CALL_CENTER_ACCENT_SECTION: CourseSection = {
  id: 'callcenter-accent',
  name: 'Accent (extra)',
  icon: '🇺🇸',
  sources: ACCENT_COURSE_SOURCE ? [ACCENT_COURSE_SOURCE] : [],
};

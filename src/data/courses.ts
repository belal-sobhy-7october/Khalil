/**
 * The study sections as the app uses them: each source's levels ("groups")
 * with their lessons. YouTube lessons come from courseEpisodes.ts, novels
 * from dalilkNovels.ts; a podcast's episodes are read at runtime
 * (src/lib/podcast.ts), so its groups start empty here.
 */
import { COURSE_CATALOG, type CatalogSource, type CourseChannel, type CourseSectionId } from './courseCatalog';
import { COURSE_EPISODES } from './courseEpisodes';
import { DALILK_NOVELS, type NovelLevel } from './dalilkNovels';

export type { CourseChannel, CourseSectionId };

export type LessonKind = 'video' | 'audio' | 'book';

export interface CourseLesson {
  /** A YouTube video id, `pod:<episode>` or `book:<slug>` — the key progress is saved under. */
  id: string;
  title: string;
  /** Length; 0 when unknown (books). */
  seconds: number;
  kind: LessonKind;
  /** The audio file (podcast) or the book's page. */
  url?: string;
  /** A book's cover. */
  image?: string;
}

/** One level of a source: a playlist, a book level or a run of podcast episodes. */
export interface CourseGroup {
  id: string;
  name: string;
  lessons: CourseLesson[];
}

export interface CourseSource {
  /** `section/source`, unique across the app. */
  key: string;
  id: string;
  kind: CatalogSource['kind'];
  name: string;
  channel: CourseChannel;
  groups: CourseGroup[];
  /** Podcasts only. */
  appleId?: string;
}

export interface CourseSection {
  /** An English hub section, or Call Center Prep's library. */
  id: CourseSectionId | 'callcenter';
  name: string;
  icon: string;
  sources: CourseSource[];
}

const NOVEL_LEVELS: Array<{ level: NovelLevel; name: string }> = [
  { level: 'beginner', name: 'Beginner' },
  { level: 'intermediate', name: 'Intermediate' },
  { level: 'upper', name: 'Upper-Intermediate' },
];

function buildSource(sectionId: CourseSectionId, s: CatalogSource): CourseSource | null {
  const base = { key: `${sectionId}/${s.id}`, id: s.id, kind: s.kind, name: s.name, channel: s.channel };
  if (s.kind === 'youtube') {
    return {
      ...base,
      groups: s.playlists.map((p) => ({
        id: p.id,
        name: p.name,
        lessons: (COURSE_EPISODES[p.id] ?? []).map((e) => ({ ...e, kind: 'video' as const })),
      })),
    };
  }
  if (s.kind === 'library') {
    if (!DALILK_NOVELS.length) return null;
    return {
      ...base,
      groups: NOVEL_LEVELS.map(({ level, name }) => ({
        id: `${s.id}-${level}`,
        name,
        lessons: DALILK_NOVELS.filter((n) => n.level === level).map((n) => ({
          id: `book:${n.slug}`,
          title: n.title,
          seconds: 0,
          kind: 'book' as const,
          url: n.url,
          image: n.cover,
        })),
      })).filter((g) => g.lessons.length > 0),
    };
  }
  return { ...base, groups: [], appleId: s.appleId };
}

export const COURSE_SECTIONS: CourseSection[] = COURSE_CATALOG.map((section) => ({
  id: section.id,
  name: section.name,
  icon: section.icon,
  sources: section.sources.map((s) => buildSource(section.id, s)).filter((s): s is CourseSource => s !== null),
}));

export const getCourseSection = (id: CourseSectionId): CourseSection =>
  COURSE_SECTIONS.find((s) => s.id === id) ?? COURSE_SECTIONS[0];

export const videoThumb = (videoId: string, size: 'mqdefault' | 'hqdefault' = 'mqdefault') =>
  `https://i.ytimg.com/vi/${videoId}/${size}.jpg`;

export const videoUrl = (videoId: string, listId?: string) =>
  `https://www.youtube.com/watch?v=${videoId}${listId ? `&list=${listId}` : ''}`;

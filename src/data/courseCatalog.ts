/**
 * The English hub's study sections and what's inside each: one or more
 * sources (a teacher's YouTube courses, a podcast, a novel library), each
 * made of levels in study order. Names are English on purpose — the owner
 * wants section and course names in English in both languages.
 *
 * The episodes of every YouTube playlist live in courseEpisodes.ts,
 * generated from this list by `node scripts/sync-courses.mjs` — run it again
 * to pick up new episodes. A lesson already in an earlier playlist of the
 * same source is left out of later ones.
 *
 * This file must stay free of imports so the sync script can load it.
 */

export type CourseSectionId = 'pronunciation' | 'listening' | 'reading' | 'grammar' | 'shadowing';

export interface CourseChannel {
  name: string;
  url: string;
}

export interface CatalogPlaylist {
  /** YouTube playlist id (the `list=` parameter). */
  id: string;
  name: string;
  /** Episodes to leave out (off-topic, trailers, announcements). */
  exclude?: string[];
}

interface SourceBase {
  /** Unique within its section. */
  id: string;
  name: string;
  channel: CourseChannel;
}

/** YouTube playlists, played inside the page. */
export interface CatalogYouTubeSource extends SourceBase {
  kind: 'youtube';
  playlists: CatalogPlaylist[];
  /**
   * Shorten lesson titles that repeat the course and level, e.g.
   * "BEGINNER ENGLISH STORY 🌊 A Day at the Beach A2 - B1 | Level 4 | …" → "A Day at the Beach".
   */
  tidyTitles?: boolean;
}

/** A podcast read from its feed at runtime (see api/podcast.ts) and played inside the page. */
export interface CatalogPodcastSource extends SourceBase {
  kind: 'podcast';
  /** Apple Podcasts id, used to find the feed. */
  appleId: string;
}

/** Books read on their own site; the list lives in src/data. */
export interface CatalogLibrarySource extends SourceBase {
  kind: 'library';
}

export type CatalogSource = CatalogYouTubeSource | CatalogPodcastSource | CatalogLibrarySource;

export interface CatalogSection {
  id: CourseSectionId;
  /** English name, shown in both languages. */
  name: string;
  icon: string;
  sources: CatalogSource[];
}

const IBRAHIM_ADEL: CourseChannel = { name: 'Ibrahim Adel · Z American English', url: 'https://www.youtube.com/@ZAmericanEnglish/courses' };
const DALILK: CourseChannel = { name: 'Dalilk · Daily English Listening', url: 'https://dalilk.com/links/daily-podcast' };
const DALILK_LIBRARY: CourseChannel = { name: 'Dalilk · Novel Library', url: 'https://dalilk.com/resources/fluency/read' };
const LOVELY_STORIES: CourseChannel = { name: 'Lovely English Stories', url: 'https://www.youtube.com/@LovelyEnglishStories' };
const LISTENING_TIME: CourseChannel = { name: 'Listening Time', url: 'https://www.youtube.com/@listeningtimepodcast/podcasts' };

/** Not lessons: the Listening Time trailer and two short announcements. */
const LISTENING_TIME_PROMOS = ['BXCQpEqu7L0', 'H8DyKBj5v3M', 'HBWijSabtmQ'];
/**
 * Listening Time adds the same videos to the end of every level: seminars,
 * quizzes, tips and full-speed podcast episodes. They're kept once, in B2.
 */
const LISTENING_TIME_EXTRAS = [
  'y1075RPJbow', 'WodgkjbMH7Q', 'XUQ9o86ETdg', 'M-kgH22l7lM', '0RMHvgtXIBc', 'FD-rEVsPfjg', 'Ap0sBWo4vw8', '3DkLcOwpqgg',
  'd0nA3n5BLBk', 'G015RgppUPI', 'qWm1SinE5ok', 'eFkAqeY0zaM', 'W8oi7HRI6u0', 'AHgDVFP6r28', 'ROAXxUCnX8o',
];

export const COURSE_CATALOG: CatalogSection[] = [
  {
    id: 'pronunciation',
    name: 'Pronunciation & Accent',
    icon: '🗣️',
    sources: [
      {
        kind: 'youtube',
        id: 'ibrahim-adel',
        name: 'Ibrahim Adel',
        channel: IBRAHIM_ADEL,
        playlists: [
          { id: 'PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc', name: 'Phonetics: Pronouncing Every Letter — Level 1' },
          { id: 'PLp22-4PivYmIlFAg2fuo--xVxScz9_6h2', name: 'British & American Phonetics — Level 2' },
          { id: 'PLp22-4PivYmIPxfMzIpbB766dcSrbdCug', name: 'American & British Accent — Level 3' },
        ],
      },
    ],
  },
  {
    id: 'listening',
    name: 'Listening',
    icon: '🎧',
    sources: [
      {
        kind: 'youtube',
        id: 'ibrahim-adel',
        name: 'Ibrahim Adel',
        channel: IBRAHIM_ADEL,
        playlists: [
          { id: 'PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ', name: 'Listening Course — Level 1' },
          { id: 'PLp22-4PivYmLmnv85IWWhNL4PtzcqC5mS', name: 'Listening & Understanding Accents — Level 2' },
          { id: 'PLp22-4PivYmKpHQio7q6UsspV1lpXwzAp', name: 'Listening Course — Level 3' },
          { id: 'PLp22-4PivYmIZtXNNriSBxmSeCK7juwS_', name: 'English News, Explained' },
        ],
      },
      { kind: 'podcast', id: 'dalilk-daily', name: 'Dalilk Daily Podcast', channel: DALILK, appleId: '1755537616' },
    ],
  },
  {
    id: 'reading',
    name: 'Reading',
    icon: '📖',
    sources: [
      {
        kind: 'youtube',
        id: 'ibrahim-adel',
        name: 'Ibrahim Adel',
        channel: IBRAHIM_ADEL,
        playlists: [
          { id: 'PLp22-4PivYmI4PahZ0eyFjcihT7_VAs79', name: 'Short Stories — Level 1' },
          { id: 'PLp22-4PivYmJV4nIwcfSzQpG0jkqn1jci', name: 'Learning Through a Story — Level 2' },
          { id: 'PLp22-4PivYmKw-mErNjoEWnyic9U7k_NM', name: 'Learning Through Stories — Level 3' },
          { id: 'PLp22-4PivYmKzTfbSx_nm0oCFSQ9-IpgL', name: 'Reading & Advanced Vocabulary — Level 4' },
          { id: 'PLp22-4PivYmKcPVkKIQ1fj4TBhFSkQ40C', name: 'Wordsmith: American Novels' },
          { id: 'PLp22-4PivYmIsCOWJ0D8lXBsbKfcyc3So', name: 'Bookworm' },
        ],
      },
      { kind: 'library', id: 'dalilk-novels', name: 'Dalilk Novel Library', channel: DALILK_LIBRARY },
      {
        kind: 'youtube',
        id: 'lovely-stories',
        name: 'Lovely English Stories',
        channel: LOVELY_STORIES,
        tidyTitles: true,
        playlists: [
          { id: 'PLt8VdtLSFrrjuUQRBx4INQvPJy_7hWps6', name: 'Beginner Stories — A1 / A2' },
          { id: 'PLt8VdtLSFrrjRkYvE0qtb0GYvEOVDxHzi', name: 'Intermediate Stories — B1 / B2' },
          { id: 'PLt8VdtLSFrrj3M3URpLdSlykxr8Asc8wV', name: 'Advanced Stories — C1 / C2' },
        ],
      },
    ],
  },
  {
    id: 'grammar',
    name: 'Grammar',
    icon: '📘',
    sources: [
      {
        kind: 'youtube',
        id: 'ibrahim-adel',
        name: 'Ibrahim Adel',
        channel: IBRAHIM_ADEL,
        playlists: [
          { id: 'PLp22-4PivYmLBmV2wctgqyyRlIs1MhmNr', name: 'Grammar from Films — Level 1' },
          { id: 'PLp22-4PivYmLrOU3QTrnsogoRZGFmHnGk', name: 'Grammar — Level 2' },
          { id: 'PLp22-4PivYmJSejQkuui_SrYWObQW7pWt', name: 'Advanced Grammar, in English — Level 3' },
          { id: 'PLp22-4PivYmLebd3vD0_WfIteVUlSA44G', name: 'Tenses & Key Rules — All Levels' },
        ],
      },
    ],
  },
  {
    id: 'shadowing',
    name: 'Shadowing',
    icon: '🔁',
    sources: [
      {
        kind: 'youtube',
        id: 'listening-time',
        name: 'Listening Time',
        channel: LISTENING_TIME,
        tidyTitles: true,
        playlists: [
          { id: 'PLhNRdHEdUQewzYZ0X6gt3x9_CVen_HldI', name: 'A1 English Listening Practice', exclude: [...LISTENING_TIME_PROMOS, ...LISTENING_TIME_EXTRAS] },
          { id: 'PLhNRdHEdUQexUblCTMd1ATwOd5J4SxtNM', name: 'A2 English Listening Practice', exclude: [...LISTENING_TIME_PROMOS, ...LISTENING_TIME_EXTRAS] },
          { id: 'PLhNRdHEdUQeyIjNRrwWnMU_iph8amkaJg', name: 'B1 English Listening Practice', exclude: [...LISTENING_TIME_PROMOS, ...LISTENING_TIME_EXTRAS] },
          { id: 'PLhNRdHEdUQeynyOmJASMe_xVYg0YZHWyt', name: 'B2 English Listening Practice', exclude: LISTENING_TIME_PROMOS },
        ],
      },
    ],
  },
];

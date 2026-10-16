/**
 * Curated YouTube courses for the English hub's course tracker: which
 * playlists make up each track, in study order. The episodes of every
 * playlist live in courseEpisodes.ts, generated from this list by
 * `node scripts/sync-courses.mjs` — run it again to pick up new episodes.
 * A lesson already in an earlier playlist of the same track is left out of
 * later ones.
 *
 * This file must stay free of imports so the sync script can load it.
 */

export type CourseTrackId = 'accent' | 'phonetics' | 'grammar' | 'listening' | 'reading' | 'ielts';

export interface CatalogPlaylist {
  /** YouTube playlist id (the `list=` parameter). */
  id: string;
  name: { en: string; ar: string };
  /** Where the playlist comes from, when not the track's channel. */
  channel?: CourseChannel;
  /** Episodes to leave out (off-topic or promos). */
  exclude?: string[];
  /** Keep only episodes shorter than this. */
  maxMinutes?: number;
}

export interface CourseChannel {
  name: string;
  url: string;
}

export interface CatalogTrack {
  id: CourseTrackId;
  icon: string;
  channel: CourseChannel;
  playlists: CatalogPlaylist[];
}

const Z_AMERICAN_ENGLISH = { name: 'Z American English', url: 'https://www.youtube.com/@ZAmericanEnglish/courses' };
const DALILK_IELTS = { name: 'دليلك للايلتس', url: 'https://www.youtube.com/@dalilk4ielts/playlists' };
const LISTENING_TIME = { name: 'Listening Time Podcast', url: 'https://www.youtube.com/@listeningtimepodcast/playlists' };

export const COURSE_CATALOG: CatalogTrack[] = [
  {
    id: 'accent',
    icon: '🗣️',
    channel: Z_AMERICAN_ENGLISH,
    playlists: [
      { id: 'PLp22-4PivYmIPxfMzIpbB766dcSrbdCug', name: { en: 'American & British accent course', ar: 'كورس اللهجة الأمريكية والبريطانية' } },
    ],
  },
  {
    id: 'phonetics',
    icon: '🔤',
    channel: Z_AMERICAN_ENGLISH,
    playlists: [
      { id: 'PLp22-4PivYmIiXGqtQMrfE_tzmqE6r7Tc', name: { en: 'Phonetics: pronouncing every letter — Level 1', ar: 'كورس الصوتيات ونطق الحروف — المستوى الأول' } },
      { id: 'PLp22-4PivYmIlFAg2fuo--xVxScz9_6h2', name: { en: 'British & American phonetics — Level 2', ar: 'الصوتيات البريطانية والأمريكية — المستوى الثاني' } },
    ],
  },
  {
    id: 'grammar',
    icon: '📘',
    channel: Z_AMERICAN_ENGLISH,
    playlists: [
      { id: 'PLp22-4PivYmLBmV2wctgqyyRlIs1MhmNr', name: { en: 'Grammar from films — Level 1', ar: 'القواعد من الأفلام — المستوى الأول' } },
      { id: 'PLp22-4PivYmLrOU3QTrnsogoRZGFmHnGk', name: { en: 'Grammar — Level 2', ar: 'القواعد — المستوى الثاني' } },
      { id: 'PLp22-4PivYmJSejQkuui_SrYWObQW7pWt', name: { en: 'Advanced grammar, in English — Level 3', ar: 'القواعد المتقدمة بالإنجليزي — المستوى الثالث' } },
      { id: 'PLp22-4PivYmLebd3vD0_WfIteVUlSA44G', name: { en: 'Tenses & key rules — all levels', ar: 'الأزمنة وأهم القواعد — كل المستويات' } },
    ],
  },
  {
    id: 'listening',
    icon: '🎧',
    channel: Z_AMERICAN_ENGLISH,
    playlists: [
      { id: 'PLp22-4PivYmKGwdQda1LVJxE1p7BZYNgJ', name: { en: 'Listening course — Level 1', ar: 'كورس الاستماع — المستوى الأول' } },
      { id: 'PLp22-4PivYmLmnv85IWWhNL4PtzcqC5mS', name: { en: 'Listening & understanding accents — Level 2', ar: 'الاستماع وفهم اللهجات — المستوى الثاني' } },
      { id: 'PLp22-4PivYmKpHQio7q6UsspV1lpXwzAp', name: { en: 'Listening course — Level 3', ar: 'كورس الاستماع — المستوى الثالث' } },
      { id: 'PLp22-4PivYmIZtXNNriSBxmSeCK7juwS_', name: { en: 'English news, explained — Level 2', ar: 'كورس الأخبار: نشرة إنجليزي مترجمة — المستوى الثاني' } },
      {
        id: 'PLhNRdHEdUQeynyOmJASMe_xVYg0YZHWyt',
        name: { en: 'Listening Time: short B2 clips', ar: 'Listening Time: مقاطع B2 قصيرة' },
        channel: LISTENING_TIME,
        // The playlist also holds full podcast episodes (next playlist) and seminars.
        maxMinutes: 10,
        exclude: ['BXCQpEqu7L0', 'H8DyKBj5v3M', 'HBWijSabtmQ'], // channel trailer and announcements
      },
      { id: 'PLhNRdHEdUQezqXdGmIbzd7zWu0pxs6s9J', name: { en: 'Listening Time: podcast episodes', ar: 'Listening Time: حلقات البودكاست' }, channel: LISTENING_TIME },
      { id: 'PLhNRdHEdUQew0ZsHKGSILmKO-XAziYOzD', name: { en: 'Listening Time: long listening practice', ar: 'Listening Time: تدريب استماع طويل' }, channel: LISTENING_TIME },
    ],
  },
  {
    id: 'reading',
    icon: '📖',
    channel: Z_AMERICAN_ENGLISH,
    playlists: [
      { id: 'PLp22-4PivYmI4PahZ0eyFjcihT7_VAs79', name: { en: 'Reading course: short stories — Level 1', ar: 'كورس القراءة: قصص قصيرة — المستوى الأول' } },
      { id: 'PLp22-4PivYmJV4nIwcfSzQpG0jkqn1jci', name: { en: 'Learning through a story — Level 2', ar: 'التعلم من خلال قصة — المستوى الثاني' } },
      { id: 'PLp22-4PivYmKw-mErNjoEWnyic9U7k_NM', name: { en: 'Learning through stories — Level 3', ar: 'التعلم من خلال القصص — المستوى الثالث' } },
      { id: 'PLp22-4PivYmKzTfbSx_nm0oCFSQ9-IpgL', name: { en: 'Reading & advanced vocabulary — Level 4', ar: 'القراءة والمفردات المتقدمة — المستوى الرابع' } },
      { id: 'PLp22-4PivYmKcPVkKIQ1fj4TBhFSkQ40C', name: { en: 'Wordsmith: English through American novels', ar: 'Wordsmith: الإنجليزي من الروايات الأمريكية' } },
      { id: 'PLp22-4PivYmIsCOWJ0D8lXBsbKfcyc3So', name: { en: 'Bookworm', ar: 'دودة الكتب Bookworm' } },
    ],
  },
  {
    id: 'ielts',
    icon: '🎯',
    channel: DALILK_IELTS,
    playlists: [
      { id: 'PLtNAQ6Bi8JoUt1pqgsXjcCJx6q3-rJ5x8', name: { en: 'IELTS Listening: basics & techniques', ar: 'الاستماع بالايلتس: الأساسيات والتكنيكات' } },
      {
        id: 'PLtNAQ6Bi8JoXPqa0fCVPgRyI2sH0-GWBY',
        name: { en: 'IELTS Listening: practice & mock tests', ar: 'الاستماع بالايلتس: تدريبات واختبارات تجريبية' },
        exclude: ['xsEy0zKC0qM'], // about the STEP exam, not IELTS
      },
      { id: 'PLtNAQ6Bi8JoWTVAVLigPUn3UY9Lelj4e7', name: { en: 'IELTS Reading: basics & techniques', ar: 'القراءة بالايلتس: الأساسيات والتكنيكات' } },
      { id: 'PLtNAQ6Bi8JoUtst0lgSDp4q_iIYLyA8bo', name: { en: 'IELTS Reading: practice', ar: 'القراءة بالايلتس: تدريبات عملية' } },
    ],
  },
];

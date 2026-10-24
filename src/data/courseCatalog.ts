/**
 * The English hub's study sections and what's inside each: one or more
 * sources (a teacher's YouTube courses, a podcast, a novel library, graded texts), each
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
  /** The playlist lists its newest episode first: keep episode 1 first. */
  reverse?: boolean;
  /** Keep only these episodes, in this order (a playlist with repeats or parts out of order). */
  pick?: string[];
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

/** Graded texts read on their own site, each with its tasks; the list lives in src/data. */
export interface CatalogTextsSource extends SourceBase {
  kind: 'texts';
}

export type CatalogSource = CatalogYouTubeSource | CatalogPodcastSource | CatalogLibrarySource | CatalogTextsSource;

export interface CatalogSection {
  id: CourseSectionId;
  /** English name, shown in both languages. */
  name: string;
  icon: string;
  sources: CatalogSource[];
}

const IBRAHIM_ADEL: CourseChannel = { name: 'Ibrahim Adel · Z American English', url: 'https://www.youtube.com/@ZAmericanEnglish/courses' };
const DALILK: CourseChannel = { name: 'Dalilk · Daily English Listening', url: 'https://dalilk.com/links/daily-podcast' };
const BRITISH_COUNCIL: CourseChannel = { name: 'British Council · LearnEnglish', url: 'https://learnenglish.britishcouncil.org/free-resources/reading' };
const DALILK_LIBRARY: CourseChannel = { name: 'Dalilk · Novel Library', url: 'https://dalilk.com/resources/fluency/read' };
const LOVELY_STORIES: CourseChannel = { name: 'Lovely English Stories', url: 'https://www.youtube.com/@LovelyEnglishStories' };
const LISTENING_TIME: CourseChannel = { name: 'Listening Time', url: 'https://www.youtube.com/@listeningtimepodcast/podcasts' };
const VOA: CourseChannel = { name: 'VOA Learning English', url: 'https://www.youtube.com/channel/UCKyTokYo0nK2OA-az-sDijA' };

/** Let's Learn English Level 1, lessons 1–52 (the playlist also holds practice videos, repeats and Level 2; lesson 44 isn't in it). */
const VOA_LEVEL_1 = [
  'WR9_nsLyaEY', '1-U7o9xjWQc', 'IEA9LMy-N3M', 'Z5PF-vJdUdc', 'lDaZB5BBw7M', 'T3AJ29_2IX8', 'Ka33lX-kbMg', 'sp0cwcd1fGE', 'ZfdNbSe7Prw',
  '1Lo_ICJYxZI', '8_npDNRKGIE', 'cyRaZA9ZD08', 'jkutq1P7AHU', '4Xn1Ysdmuvg', 'c6_7RYaNgdA', 'QQavoMYmMVE', '91sCUUVTDV8', 'he12VfXp5Ec',
  'lgEodUvA5Po', '2juFXfLsSJk', 'A9lwBqNZEh8', '8Whu9xgm3dE', 'DzaLlp_kG6c', '7BDjr0Oc6VM', 'bfRNAlZRiHg', 'x2SQcTFvVzw', 'd_4TVWhqX4E',
  'rn7kmGroxKs', '_demyJmMyCo', 'GnQEE0gEir0', 'xfMnWypEufs', '1egFRwUFc48', 'GpiXMzf3FvY', 'qIiGG0pwzwk', '6rFolPv2ntQ', 'NXYXu9Kcb7o',
  'AGYPb0eeIs8', 'oPEzfd7ZKQs', 'FpCQfJLD4K8', 'nABtxJy06Yo', 'jCSHkjcmZvs', '0aa78zW51so', '4z_TK18v2u8', 'R4SVqLFBhVY', '1z7pSR1nW54',
  'vlNqXVmMPNY', 'Dngj5yTCQIY', 'qDqwN0mXm1o', 'DGAUQIcY8FA', 'GvjBCQ3KOws', 'vJPvOYb1K10',
];

/**
 * American Stories, easiest first (O. Henry, folk tales, then Poe, Hawthorne,
 * London…), each story's parts in order and every story once.
 */
const VOA_AMERICAN_STORIES = [
  // O. Henry
  'ORZ5IJea14Q', 'TXWMS4KFm1k', 'qRWPbkgXSgY', '-NJc7KsQ8Nk', 'VpxzL4hMbBI', '0JLhEdmIgKE', 'KGdezsrWQlo', 'NQQmOiizK5g', 'dWaE8oEnzJ4',
  'NKVAdd-MWXQ', 'o8i-MVG8heo', 'GYZpSUVyrVg', 'Nm-4FtujQwE', 'GU7YKkPQWSI', 'YrONKAyweuc',
  // Folk tales and short classics
  'oMW8Z1TaSeQ', 'ZfTzEr_o2s0', 'nFZa1c6l2Us', '3t3ZV00WHdQ', '7NUWQ6Cc7Bc', 'kDJhNNOwSEA', '6AdJkd1lM3U', 'Be5G7W209Hc', 'aNwL-9RREVE',
  '9lGpGwLOecM', 'DbHahAeDyvQ',
  // Edgar Allan Poe
  'bkrfnIT5BFc', 'wlJnLoFK6VA', 'bu5GVJ6z3uk', 'RAy5GJxo0KU', '2wLLLE-TqUQ', 'hRLjp0--2q4', 'uCDFgU5grU8', '4Aa11aAO0V4', 'AuMckGpaBFk',
  'J1arsXhsFag', 'hrmOwH7Jqbc',
  // Hawthorne, Irving, London, Bierce, Garland, Cather, O'Brien, Melville, Burroughs
  '3oBjHD-UbtQ', 'fdsD3n0Kw2Q', 'nK2epXzyUko', '89hi569Lp1E', 'twp0Ccl8AgY', 'i2gaVgzybuA', 'LN3fiDZ1f_Y', 'pwRvfy_EVyI', 'A7kxBcBBMuU',
  '-yrwYTVj3u8', 'KlU2Jh2Ulw0', 'lELLfMIKVO8', '1ddrau6LoPQ', 'djUzKyjZ21c', 'UmHOmDTiowM', '_wUt26G7Cps', 'X8715YXkcOs', 'AyC0rFSADW4',
  'NOjfCFcxuVI', 'oaBs1pj2vKk', 'ywqOOlVttxE', 'b-CnmIu58Mw', 'w-0rDy97NT4', 'c9N0orpuDQI', 'sD1UsOdLMKA',
];

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
      {
        kind: 'youtube',
        id: 'voa',
        name: 'VOA How to Pronounce',
        channel: VOA,
        playlists: [{ id: 'PLd9hCvj34W5gxnTUV-wHERehpInsTJgq7', name: 'How to Pronounce (American English)', reverse: true }],
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
      {
        // American English, from beginner to natural conversation.
        kind: 'youtube',
        id: 'voa',
        name: 'VOA Learning English',
        channel: VOA,
        playlists: [
          { id: 'PLd9hCvj34W5it4a-RMzhlwNJ-edf5HU3Q', name: "Let's Learn English — Level 1", pick: VOA_LEVEL_1 },
          { id: 'PLd9hCvj34W5i4HBJAVHrMhtnPfATt73Oe', name: "America's National Parks" },
          { id: 'PLd9hCvj34W5gR8u7liXqZeWLsVnhR5ZPV', name: 'American Stories', pick: VOA_AMERICAN_STORIES },
          { id: 'PLd9hCvj34W5jekhcE7BPlwkEqFiLrS_Wk', name: 'TALK2US: English Conversation' },
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
      { kind: 'texts', id: 'british-council', name: 'British Council LearnEnglish', channel: BRITISH_COUNCIL },
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

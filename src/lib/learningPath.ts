/**
 * The 90-day learning path, the first tab of the English hub. Every day has
 * the same six blocks, one per section of the hub, each about the same length
 * (20 minutes by default):
 *
 *   Vocabulary              the flashcard review and the words of the day's topic (90 topics, one a day)
 *   Pronunciation & Accent  Ibrahim Adel's course, VOA's How to Pronounce, then sound drills
 *   Listening               VOA or Ibrahim Adel (you choose; the other follows)
 *   Reading                 British Council or Ibrahim Adel (the same), then Lovely English Stories
 *   Grammar                 Ibrahim Adel's course, then the grammar point of the day's topic
 *   Shadowing               Listening Time, from the level you choose
 *
 * The lessons are the hub's own, in study order, put into days by their length
 * and by how long a minute of them takes to study (a VOA lesson is heard three
 * times, a shadowing one practiced four). A lesson too long for one day is cut
 * into parts. A lesson finished anywhere — here or in its tab — is done in both,
 * since lessons are ticked in the hub's progress; the path's own value keeps
 * only its settings and what the hub can't know (reviews, grammar points,
 * sound drills, parts of lessons).
 */
import { TOPIC_PACKS, type TopicPack } from '../data/topicPacks';
import { ACCENT_FEATURES, CONSONANTS, VOWELS, type AccentFeature, type SoundEntry } from '../data/englishStudy';
import { getCourseSection, type CourseLesson, type CourseSectionId } from '../data/courses';
import { addDaysToDateString, daysBetweenDateStrings } from '../store/dateHelpers';
import type { CourseProgress, WatchPositions } from './courseProgress';

export const PATH_LENGTH = 90;
export const PATH_KV_KEY = 'learning-path-v2';

export type PathSection = 'vocabulary' | CourseSectionId;
export const PATH_SECTIONS: PathSection[] = ['vocabulary', 'pronunciation', 'listening', 'reading', 'grammar', 'shadowing'];

// ---- settings ---------------------------------------------------------------

export type ListeningSource = 'voa' | 'ibrahim-adel';
export type ReadingSource = 'british-council' | 'ibrahim-adel';
export type ListeningLevel = 'beginner' | 'intermediate' | 'advanced';
export type ReadingLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
export type ShadowingLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface PathSettings {
  /** Minutes of each section a day. */
  minutes: number;
  listening: ListeningSource;
  /** Where VOA starts. */
  listeningLevel: ListeningLevel;
  reading: ReadingSource;
  /** Where British Council (and Lovely English Stories after it) start. */
  readingLevel: ReadingLevel;
  shadowingLevel: ShadowingLevel;
}

export const MINUTE_CHOICES = [10, 15, 20, 30];
export const LISTENING_LEVELS: ListeningLevel[] = ['beginner', 'intermediate', 'advanced'];
export const READING_LEVELS: ReadingLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
export const SHADOWING_LEVELS: ShadowingLevel[] = ['A1', 'A2', 'B1', 'B2'];

const sourceOf = (section: CourseSectionId, id: string) => getCourseSection(section).sources.find((s) => s.id === id);

/** British Council's texts join Reading once their list is in the app. */
export const hasBritishCouncil = () => (sourceOf('reading', 'british-council')?.groups.length ?? 0) > 0;

export const defaultSettings = (): PathSettings => ({
  minutes: 20,
  listening: 'voa',
  listeningLevel: 'intermediate',
  reading: hasBritishCouncil() ? 'british-council' : 'ibrahim-adel',
  readingLevel: 'B1',
  shadowingLevel: 'A1',
});

/** The first playlist of each starting level. */
const VOA_START: Record<ListeningLevel, string> = {
  beginner: 'PLd9hCvj34W5it4a-RMzhlwNJ-edf5HU3Q',
  intermediate: 'PLd9hCvj34W5i4HBJAVHrMhtnPfATt73Oe',
  advanced: 'PLd9hCvj34W5jekhcE7BPlwkEqFiLrS_Wk',
};
const SHADOWING_START: Record<ShadowingLevel, string> = {
  A1: 'PLhNRdHEdUQewzYZ0X6gt3x9_CVen_HldI',
  A2: 'PLhNRdHEdUQexUblCTMd1ATwOd5J4SxtNM',
  B1: 'PLhNRdHEdUQeyIjNRrwWnMU_iph8amkaJg',
  B2: 'PLhNRdHEdUQeynyOmJASMe_xVYg0YZHWyt',
};
const STORIES_START: Record<ReadingLevel, string> = {
  A1: 'PLt8VdtLSFrrjuUQRBx4INQvPJy_7hWps6',
  A2: 'PLt8VdtLSFrrjuUQRBx4INQvPJy_7hWps6',
  B1: 'PLt8VdtLSFrrjRkYvE0qtb0GYvEOVDxHzi',
  B2: 'PLt8VdtLSFrrjRkYvE0qtb0GYvEOVDxHzi',
  C1: 'PLt8VdtLSFrrj3M3URpLdSlykxr8Asc8wV',
};

/** Minutes of study for each minute of a source's lessons. */
const STUDY_FACTOR: Record<string, number> = {
  'pronunciation/voa': 2, // watch, then say it along
  'listening/voa': 3, // the five steps: three listens and a summary
  'shadowing/listening-time': 4, // listen, shadow sentence by sentence, record
};
/** A lesson without a length (a text to read) takes a whole block. */
const UNTIMED = -1;
const SOUND_MINUTES = 10;

// ---- topics -----------------------------------------------------------------

/** The Topic Library in the path's order: a topic a day, easier ones first. */
export const PATH_TOPICS: string[] = [
  // B1
  'self-introduction', 'small-talk', 'family-and-relatives', 'describing-people', 'daily-routines',
  'meeting-new-people', 'making-plans', 'hobbies-and-free-time', 'household-chores', 'home-and-neighbours',
  'housing-and-rent', 'cooking-and-recipes', 'restaurant-and-food', 'clothes-and-style', 'returns-and-complaints',
  'money-and-saving', 'directions-and-help', 'transport-and-traffic', 'travel', 'tourism-and-culture', 'health',
  'nutrition', 'sleep-and-energy', 'sports-and-fitness', 'football', 'adventure-and-outdoors', 'video-games',
  'emergencies-and-safety', 'ramadan-and-celebrations', 'university-life', 'exams-and-projects',
  // B2
  'feelings-and-personality', 'friendship', 'keeping-conversations-going', 'misunderstandings',
  'apologies-and-forgiveness', 'advice-and-support', 'childhood-and-memories', 'relationships-and-marriage',
  'goals-and-dreams', 'learning-languages', 'smart-learning', 'films-series-and-books', 'photography-and-content',
  'city-vs-countryside', 'shop-smart', 'habitual-change', 'minimalism', 'cultural-differences',
  'opinions-and-arguing', 'identity-and-heritage', 'history-and-civilizations', 'nature-and-wildlife',
  'living-abroad', 'career-plans', 'job-hunting', 'job-interview', 'work-and-office', 'phone-and-email',
  'meetings-and-discussions', 'tech-everyday', 'internet-and-online-services', 'cybersecurity-and-scams',
  'programming', 'time-management', 'remote-work-and-freelancing', 'presentations', 'leadership-and-teamwork',
  'negotiation', 'starting-a-business', 'inflation-and-cost-of-living', 'jobs-and-future-work', 'social-media',
  'news-and-media', 'mental-health', 'happiness-and-success', 'fame-and-celebrity', 'art-and-architecture',
  'science-and-space', 'climate-and-environment', 'artificial-intelligence', 'social-responsibility', 'crime',
  // C1
  'decision-making-and-trade-offs', 'problem-solving', 'change-and-risk', 'equality-and-opportunity',
  'ethics-and-dilemmas', 'education-systems', 'future-of-society',
];

export function packById(id: string | undefined): TopicPack | undefined {
  return id ? TOPIC_PACKS.find((p) => p.id === id) : undefined;
}

/** Each day's topic and its share of the topic's words (all of them once there is a topic for every day). */
function topicDays(): Array<{ packId: string; from: number; to: number }> {
  const topics = PATH_TOPICS.filter((id) => packById(id));
  const out: Array<{ packId: string; from: number; to: number }> = [];
  topics.forEach((packId, t) => {
    const first = Math.floor((t * PATH_LENGTH) / topics.length);
    const span = Math.floor(((t + 1) * PATH_LENGTH) / topics.length) - first;
    const words = packById(packId)!.items.length;
    for (let k = 0; k < span; k++) out.push({ packId, from: Math.floor((k * words) / span), to: Math.floor(((k + 1) * words) / span) });
  });
  return out;
}

// ---- accent -----------------------------------------------------------------

export type AccentItem =
  | { kind: 'sound'; sound: SoundEntry }
  | { kind: 'feature'; feature: AccentFeature };

/** The sounds hardest for Arabic speakers, first. */
const HARDEST = ['θ', 'ð', 'p', 'v', 'r', 'ŋ', 'ɪ', 'iː', 'æ', 'ɑː', 'ʌ', 'ə', 'ɝ', 'ɚ', 'oʊ', 'ɔː', 'ʊ', 'uː'];

/** Round 1: every sound (the hardest first) and the features of connected speech; then rounds of the hardest again. */
function accentRounds(): AccentItem[][] {
  const all = [...CONSONANTS, ...VOWELS];
  const hardest = HARDEST.map((ipa) => all.find((s) => s.ipa === ipa)).filter((s): s is SoundEntry => !!s);
  const rest = all.filter((s) => !HARDEST.includes(s.ipa));
  const features = ACCENT_FEATURES.map((feature) => ({ kind: 'feature' as const, feature }));
  return [
    [...[...hardest, ...rest].map((sound) => ({ kind: 'sound' as const, sound })), ...features],
    [...hardest.map((sound) => ({ kind: 'sound' as const, sound })), ...features],
  ];
}

export const accentId = (a: AccentItem) => (a.kind === 'sound' ? a.sound.ipa : a.feature.id);

// ---- the plan ---------------------------------------------------------------

export interface LessonPart {
  /** 1-based. */
  index: number;
  count: number;
  /** Seconds into the lesson. */
  from: number;
  to: number;
}

export type PathItem =
  | {
      kind: 'lesson';
      section: CourseSectionId;
      sourceId: string;
      sourceName: string;
      groupId: string;
      groupName: string;
      lesson: CourseLesson;
      part?: LessonPart;
    }
  | { kind: 'review' }
  | { kind: 'words'; packId: string; from: number; to: number }
  /** `from`: the day's share of the topic, like its words (0 on the topic's first day). */
  | { kind: 'grammar'; packId: string; from: number }
  | { kind: 'sound'; accent: AccentItem; round: number }
  /** Nothing planned is left in the section: study what you like in its tab. */
  | { kind: 'free'; section: CourseSectionId };

export interface PlannedItem {
  /** Unique in the plan; what the path's progress is saved under. */
  key: string;
  item: PathItem;
  minutes: number;
}

export interface PathBlock {
  section: PathSection;
  items: PlannedItem[];
  minutes: number;
}

export interface PathDay {
  day: number;
  week: number;
  /** The topic of the day's words. */
  packId?: string;
  blocks: PathBlock[];
}

export function itemKey(item: PathItem, day: number): string {
  switch (item.kind) {
    case 'lesson':
      return `lesson:${item.lesson.id}${item.part ? `#${item.part.index}` : ''}`;
    case 'review':
      return `review:${day}`;
    case 'words':
      return `words:${item.packId}:${item.from}`;
    case 'grammar':
      return `grammar:${item.packId}${item.from ? `:${item.from}` : ''}`;
    case 'sound':
      return `sound:${item.round}:${accentId(item.accent)}`;
    case 'free':
      return `free:${day}:${item.section}`;
  }
}

interface Unit {
  item: PathItem;
  /** Minutes of study, or UNTIMED. */
  minutes: number;
  /** A lesson's length and study factor, so it can be cut into parts. */
  media?: { seconds: number; factor: number };
}

/** A source's lessons from one of its levels (playlists) on. */
function lessonUnits(section: CourseSectionId, sourceId: string, fromGroup?: string): Unit[] {
  const source = sourceOf(section, sourceId);
  if (!source) return [];
  const start = fromGroup ? Math.max(0, source.groups.findIndex((g) => g.id === fromGroup)) : 0;
  const factor = STUDY_FACTOR[`${section}/${sourceId}`] ?? 1;
  return source.groups.slice(start).flatMap((group) =>
    group.lessons.map((lesson) => ({
      item: { kind: 'lesson' as const, section, sourceId, sourceName: source.name, groupId: group.id, groupName: group.name, lesson },
      minutes: lesson.seconds > 0 ? (lesson.seconds / 60) * factor : UNTIMED,
      media: lesson.seconds > 0 ? { seconds: lesson.seconds, factor } : undefined,
    }))
  );
}

/** Units in order, each lesson once. */
function chain(...lists: Unit[][]): Unit[] {
  const seen = new Set<string>();
  return lists.flat().filter((u) => u.item.kind !== 'lesson' || (!seen.has(u.item.lesson.id) && !!seen.add(u.item.lesson.id)));
}

/** A day may run this much over its minutes before the next unit waits for tomorrow. */
const SLACK = 0.25;
/** A lesson longer than this many days' minutes is cut into parts. */
const SPLIT_AT = 1.5;

/** Puts units into at most `length` days of about `budget` minutes. */
function pack(units: Unit[], budget: number, length: number): Array<Array<{ item: PathItem; minutes: number }>> {
  const days: Array<Array<{ item: PathItem; minutes: number }>> = [];
  let day: Array<{ item: PathItem; minutes: number }> = [];
  let used = 0;
  const close = () => {
    if (day.length) days.push(day);
    day = [];
    used = 0;
  };
  for (const u of units) {
    if (days.length >= length) break;
    const minutes = u.minutes === UNTIMED ? budget : u.minutes;
    if (u.media && u.item.kind === 'lesson' && minutes > budget * SPLIT_AT) {
      close();
      const count = Math.ceil(minutes / budget);
      const size = u.media.seconds / count;
      for (let i = 0; i < count; i++) {
        const part = { index: i + 1, count, from: Math.round(i * size), to: i === count - 1 ? u.media.seconds : Math.round((i + 1) * size) };
        days.push([{ item: { ...u.item, part }, minutes: minutes / count }]);
      }
      continue;
    }
    if (day.length && (u.minutes === UNTIMED || used + minutes > budget * (1 + SLACK))) close();
    day.push({ item: u.item, minutes });
    used += minutes;
  }
  close();
  return days.slice(0, length);
}

const block = (section: PathSection, day: number, items: Array<{ item: PathItem; minutes: number }>): PathBlock => {
  const planned = items.map(({ item, minutes }) => ({ key: itemKey(item, day), item, minutes: Math.max(1, Math.round(minutes)) }));
  return { section, items: planned, minutes: planned.reduce((n, i) => n + i.minutes, 0) };
};

export function buildPath(settings: PathSettings = defaultSettings()): PathDay[] {
  const budget = Math.max(5, settings.minutes);
  const topics = topicDays();
  const [round1, again] = accentRounds();
  const sounds = (items: AccentItem[], round: number): Unit[] =>
    items.map((accent) => ({ item: { kind: 'sound', accent, round }, minutes: SOUND_MINUTES }));

  const voa = lessonUnits('listening', 'voa', VOA_START[settings.listeningLevel]);
  const ibrahimListening = lessonUnits('listening', 'ibrahim-adel');
  const britishCouncil = lessonUnits('reading', 'british-council', `british-council-${settings.readingLevel.toLowerCase()}`);
  const ibrahimReading = lessonUnits('reading', 'ibrahim-adel');
  const stories = lessonUnits('reading', 'lovely-stories', STORIES_START[settings.readingLevel]);

  const plans: Record<CourseSectionId, Array<Array<{ item: PathItem; minutes: number }>>> = {
    pronunciation: pack(
      chain(
        lessonUnits('pronunciation', 'ibrahim-adel'),
        lessonUnits('pronunciation', 'voa'),
        sounds(round1, 1),
        ...[2, 3, 4, 5].map((round) => sounds(again, round))
      ),
      budget,
      PATH_LENGTH
    ),
    listening: pack(settings.listening === 'voa' ? chain(voa, ibrahimListening) : chain(ibrahimListening, voa), budget, PATH_LENGTH),
    reading: pack(
      settings.reading === 'british-council' ? chain(britishCouncil, ibrahimReading, stories) : chain(ibrahimReading, britishCouncil, stories),
      budget,
      PATH_LENGTH
    ),
    // After Ibrahim Adel's course the grammar point of each day's topic follows (below).
    grammar: pack(lessonUnits('grammar', 'ibrahim-adel'), budget, PATH_LENGTH),
    shadowing: pack(
      chain(lessonUnits('shadowing', 'listening-time', SHADOWING_START[settings.shadowingLevel]), lessonUnits('shadowing', 'listening-time')),
      budget,
      PATH_LENGTH
    ),
  };

  const days: PathDay[] = [];
  for (let day = 1; day <= PATH_LENGTH; day++) {
    const topic = topics[day - 1];
    const vocabulary: Array<{ item: PathItem; minutes: number }> = [{ item: { kind: 'review' }, minutes: budget / 2 }];
    if (topic) vocabulary.push({ item: { kind: 'words', ...topic }, minutes: budget / 2 });
    const planned = (section: CourseSectionId) => {
      const items = plans[section][day - 1];
      if (items?.length) return items;
      if (section === 'grammar' && topic) return [{ item: { kind: 'grammar' as const, packId: topic.packId, from: topic.from }, minutes: budget }];
      return [{ item: { kind: 'free' as const, section }, minutes: budget }];
    };
    days.push({
      day,
      week: Math.ceil(day / 7),
      packId: topic?.packId,
      blocks: [
        block('vocabulary', day, vocabulary),
        ...(['pronunciation', 'listening', 'reading', 'grammar', 'shadowing'] as const).map((s) => block(s, day, planned(s))),
      ],
    });
  }
  return days;
}

// ---- progress ---------------------------------------------------------------

export interface PathState {
  /** Local date the path was started (YYYY-MM-DD), or null before starting. */
  startedAt: string | null;
  settings: PathSettings;
  /** Item key → local date it was done (the hub's own progress covers whole lessons). */
  done: Record<string, string>;
  /** Item key → what the user wrote (sentences with a grammar point). */
  notes: Record<string, string>;
}

export const emptyPathState = (): PathState => ({ startedAt: null, settings: defaultSettings(), done: {}, notes: {} });

/** A saved value with every setting filled in (older or partial values). */
export const withDefaults = (state: Partial<PathState> | null | undefined): PathState => ({
  ...emptyPathState(),
  ...(state ?? {}),
  settings: { ...defaultSettings(), ...(state?.settings ?? {}) },
  done: state?.done ?? {},
  notes: state?.notes ?? {},
});

/** Everything that says what's done: the path's value, the hub's lessons and where they stopped, and your words. */
export interface PathProgress {
  state: PathState;
  course: CourseProgress;
  positions: WatchPositions;
  /** The words in your flashcards, lower-cased. */
  words: Set<string>;
}

/** Seconds before the end of a part that count as having reached it. */
const PART_SLACK = 5;

export const wordKey = (w: string) => w.trim().toLowerCase();

export function wordsOf(item: { packId: string; from: number; to: number }) {
  return packById(item.packId)?.items.slice(item.from, item.to) ?? [];
}

export function isItemDone(planned: PlannedItem, p: PathProgress): boolean {
  if (p.state.done[planned.key]) return true;
  const { item } = planned;
  if (item.kind === 'lesson') {
    if (p.course[item.lesson.id]) return true;
    return !!item.part && (p.positions[item.lesson.id] ?? 0) >= item.part.to - PART_SLACK;
  }
  if (item.kind === 'words') {
    const words = wordsOf(item);
    return words.length > 0 && words.every((w) => p.words.has(wordKey(w.word)));
  }
  return false;
}

export function blockProgress(b: PathBlock, p: PathProgress): { done: number; total: number } {
  return { done: b.items.filter((i) => isItemDone(i, p)).length, total: b.items.length };
}

export const isBlockDone = (b: PathBlock, p: PathProgress) => b.items.every((i) => isItemDone(i, p));

export function dayProgress(d: PathDay, p: PathProgress): { done: number; total: number } {
  return { done: d.blocks.filter((b) => isBlockDone(b, p)).length, total: d.blocks.length };
}

export const isDayDone = (d: PathDay, p: PathProgress) => d.blocks.every((b) => isBlockDone(b, p));

/** The day to work on: the first one not fully done (the last day once everything is done). */
export function currentDay(path: PathDay[], p: PathProgress): number {
  return path.find((d) => !isDayDone(d, p))?.day ?? path[path.length - 1].day;
}

/** The latest date anything in the day was done (lessons by the hub's date). */
export function finishedOn(d: PathDay, p: PathProgress): string {
  let last = '';
  for (const b of d.blocks) {
    for (const i of b.items) {
      const date = p.state.done[i.key] ?? (i.item.kind === 'lesson' ? p.course[i.item.lesson.id] : undefined) ?? '';
      if (date > last) last = date;
    }
  }
  return last;
}

/** Which day the calendar says you'd be on (1 on the start date). */
export function scheduledDay(startedAt: string, today: string): number {
  return Math.max(1, Math.min(PATH_LENGTH, daysBetweenDateStrings(startedAt, today) + 1));
}

export interface PathStats {
  itemsDone: number;
  itemsTotal: number;
  percent: number;
  daysDone: number;
  /** Planned minutes of what's done. */
  minutes: number;
  /** Consecutive days, up to today (or yesterday), with something of the path done. */
  streak: number;
  bySection: Record<PathSection, { done: number; total: number }>;
}

export function pathStats(path: PathDay[], p: PathProgress, today: string): PathStats {
  const bySection = Object.fromEntries(PATH_SECTIONS.map((s) => [s, { done: 0, total: 0 }])) as PathStats['bySection'];
  let itemsDone = 0;
  let itemsTotal = 0;
  let minutes = 0;
  const dates = new Set(Object.values(p.state.done));
  for (const d of path) {
    for (const b of d.blocks) {
      for (const i of b.items) {
        itemsTotal++;
        bySection[b.section].total++;
        if (!isItemDone(i, p)) continue;
        itemsDone++;
        bySection[b.section].done++;
        minutes += i.minutes;
        if (i.item.kind === 'lesson' && p.course[i.item.lesson.id]) dates.add(p.course[i.item.lesson.id]);
      }
    }
  }
  let streak = 0;
  let cursor = dates.has(today) ? today : addDaysToDateString(today, -1);
  while (dates.has(cursor)) {
    streak++;
    cursor = addDaysToDateString(cursor, -1);
  }
  return {
    itemsDone,
    itemsTotal,
    percent: itemsTotal ? Math.floor((itemsDone / itemsTotal) * 100) : 0,
    daysDone: path.filter((d) => isDayDone(d, p)).length,
    minutes,
    streak,
    bySection,
  };
}

// ---- the plan at a glance ---------------------------------------------------

export type SegmentWhat =
  | { kind: 'group'; source: string; group: string }
  | { kind: 'topics'; level: TopicPack['level'] }
  | { kind: 'grammar' }
  | { kind: 'sounds'; round: number }
  | { kind: 'free' };

export interface TimelineSegment {
  what: SegmentWhat;
  /** Days, inclusive. */
  from: number;
  to: number;
}

function blockWhat(b: PathBlock): SegmentWhat {
  const main = b.items.find((i) => i.item.kind !== 'review')?.item ?? b.items[0].item;
  switch (main.kind) {
    case 'lesson':
      return { kind: 'group', source: main.sourceName, group: main.groupName };
    case 'words':
      return { kind: 'topics', level: packById(main.packId)?.level ?? 'B1' };
    case 'grammar':
      return { kind: 'grammar' };
    case 'sound':
      return { kind: 'sounds', round: main.round };
    default:
      return { kind: 'free' };
  }
}

/** What a section covers on which days: consecutive days studying the same thing make one segment. */
export function sectionTimeline(path: PathDay[], section: PathSection): TimelineSegment[] {
  const out: TimelineSegment[] = [];
  for (const d of path) {
    const b = d.blocks.find((x) => x.section === section);
    if (!b) continue;
    const what = blockWhat(b);
    const last = out[out.length - 1];
    if (last && JSON.stringify(last.what) === JSON.stringify(what) && last.to === d.day - 1) last.to = d.day;
    else out.push({ what, from: d.day, to: d.day });
  }
  return out;
}

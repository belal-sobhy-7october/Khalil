/**
 * A 90-day English learning path (B2 → C1), separate from everything else:
 * it only reads the topic lessons and accent material, and keeps its own
 * progress under one user_kv key — it never touches the word list.
 *
 * Shape: three 4-week phases of six topics, then a final week.
 *   Each topic takes four study days:
 *     A  words 1–6, warm-up, your own sentences
 *     B  words 7–12 and the grammar point
 *     C  listen & repeat, reading, shadowing
 *     D  speaking: discussion, one-minute task, AI conversation
 *   Every 7th day is a review day; days 85–90 review everything and end with
 *   a final speaking test compared with the recording made on day 1.
 *   An accent drill runs through the study days (sounds, then accent features).
 */
import { TOPIC_PACKS, type TopicPack } from '../data/topicPacks';
import { ACCENT_FEATURES, CONSONANTS, VOWELS, type AccentFeature, type SoundEntry } from '../data/englishStudy';
import { addDaysToDateString, daysBetweenDateStrings } from '../store/dateHelpers';

export const PATH_LENGTH = 90;
export const PATH_KV_KEY = 'learning-path';

export type Skill = 'vocab' | 'grammar' | 'reading' | 'listening' | 'shadowing' | 'speaking' | 'accent' | 'review' | 'writing';
export const SKILLS: Skill[] = ['vocab', 'grammar', 'reading', 'listening', 'shadowing', 'speaking', 'accent', 'review', 'writing'];

export type TaskKind =
  | 'baseline' | 'warmUp' | 'words' | 'sentences' | 'grammar' | 'paragraph' | 'reading' | 'shadowing' | 'accent'
  | 'check' | 'discussion' | 'speakingTask' | 'aiTalk' | 'weeklyWriting' | 'replay' | 'reRecord' | 'mockTalk' | 'finalTest' | 'reflection';

export type AccentItem =
  | { kind: 'sound'; sound: SoundEntry }
  | { kind: 'feature'; feature: AccentFeature };

export interface PathTask {
  /** Unique within its day. */
  id: string;
  kind: TaskKind;
  skill: Skill;
  minutes: number;
  /** The topic the task is about. */
  packId?: string;
  /** Half-open range of the topic's words, for "words" and "check". */
  words?: [number, number];
  /** Topics whose words a "check" or "replay" covers. */
  packIds?: string[];
  accent?: AccentItem;
}

export type DayKind = 'words' | 'grammar' | 'input' | 'speak' | 'review' | 'final';

export interface PathDay {
  day: number;
  week: number;
  /** 1–3, or 4 for the final week. */
  phase: 1 | 2 | 3 | 4;
  kind: DayKind;
  packId?: string;
  tasks: PathTask[];
}

/** Topics in order, six per phase: everyday life → work & communication → ideas & the world. */
export const PATH_PHASES: string[][] = [
  ['small-talk', 'feelings-and-personality', 'habitual-change', 'travel', 'identity-and-heritage', 'relationships-and-marriage'],
  ['work-and-office', 'phone-and-email', 'meetings-and-discussions', 'job-interview', 'opinions-and-arguing', 'shop-smart'],
  ['minimalism', 'smart-learning', 'social-media', 'artificial-intelligence', 'social-responsibility', 'crime'],
];

const STUDY_DAYS_PER_TOPIC = 4;

export function packById(id: string | undefined): TopicPack | undefined {
  return id ? TOPIC_PACKS.find((p) => p.id === id) : undefined;
}

/**
 * Sounds that are hardest for Arabic speakers first, then the rest, then the
 * features that make speech sound natural.
 */
function accentSequence(): AccentItem[] {
  const priority = ['θ', 'ð', 'p', 'v', 'r', 'ŋ', 'ɪ', 'iː', 'æ', 'ɑː', 'ʌ', 'ə', 'ɝ', 'ɚ', 'oʊ', 'ɔː', 'ʊ', 'uː'];
  const all = [...CONSONANTS, ...VOWELS];
  const first = priority.map((ipa) => all.find((s) => s.ipa === ipa)).filter((s): s is SoundEntry => !!s);
  const rest = all.filter((s) => !priority.includes(s.ipa));
  return [
    ...[...first, ...rest].map((sound) => ({ kind: 'sound' as const, sound })),
    ...ACCENT_FEATURES.map((feature) => ({ kind: 'feature' as const, feature })),
  ];
}

const half = (pack: TopicPack) => Math.ceil(pack.items.length / 2);

export function buildPath(): PathDay[] {
  const topics = PATH_PHASES.flat();
  const accents = accentSequence();
  let accentIndex = 0;
  const nextAccent = (): AccentItem => accents[accentIndex++ % accents.length];
  const days: PathDay[] = [];
  let studyIndex = 0;

  for (let day = 1; day <= 84; day++) {
    const week = Math.ceil(day / 7);
    const phase = Math.min(3, Math.ceil(week / 4)) as 1 | 2 | 3;
    if (day % 7 === 0) {
      // Review the topics studied this week.
      const studied = new Set<string>();
      for (const d of days.slice(-6)) if (d.packId) studied.add(d.packId);
      const packIds = [...studied];
      days.push({
        day, week, phase, kind: 'review',
        tasks: [
          { id: 'check', kind: 'check', skill: 'review', minutes: 10, packIds },
          { id: 'writing', kind: 'weeklyWriting', skill: 'writing', minutes: 20, packIds },
          { id: 'replay', kind: 'replay', skill: 'listening', minutes: 15, packIds },
          { id: 'rerecord', kind: 'reRecord', skill: 'speaking', minutes: 10, packIds },
        ],
      });
      continue;
    }
    const topicIndex = Math.floor(studyIndex / STUDY_DAYS_PER_TOPIC);
    const step = studyIndex % STUDY_DAYS_PER_TOPIC;
    studyIndex++;
    const packId = topics[topicIndex];
    const pack = packById(packId)!;
    const n = pack.items.length;
    let kind: DayKind;
    let tasks: PathTask[];
    if (step === 0) {
      kind = 'words';
      tasks = [
        ...(day === 1 ? [{ id: 'baseline', kind: 'baseline' as const, skill: 'speaking' as const, minutes: 5 }] : []),
        { id: 'warmup', kind: 'warmUp', skill: 'speaking', minutes: 5, packId },
        { id: 'words-1', kind: 'words', skill: 'vocab', minutes: 20, packId, words: [0, half(pack)] },
        { id: 'sentences-1', kind: 'sentences', skill: 'writing', minutes: 10, packId, words: [0, half(pack)] },
        { id: 'accent', kind: 'accent', skill: 'accent', minutes: 10, accent: nextAccent() },
        ...(topicIndex > 0 ? [{ id: 'check-prev', kind: 'check' as const, skill: 'review' as const, minutes: 5, packIds: [topics[topicIndex - 1]] }] : []),
      ];
    } else if (step === 1) {
      kind = 'grammar';
      tasks = [
        { id: 'words-2', kind: 'words', skill: 'vocab', minutes: 20, packId, words: [half(pack), n] },
        { id: 'grammar', kind: 'grammar', skill: 'grammar', minutes: 20, packId },
        { id: 'accent', kind: 'accent', skill: 'accent', minutes: 10, accent: nextAccent() },
        { id: 'check', kind: 'check', skill: 'review', minutes: 5, packId, words: [0, half(pack)] },
      ];
    } else if (step === 2) {
      kind = 'input';
      tasks = [
        { id: 'paragraph', kind: 'paragraph', skill: 'listening', minutes: 15, packId },
        { id: 'reading', kind: 'reading', skill: 'reading', minutes: 20, packId },
        { id: 'shadowing', kind: 'shadowing', skill: 'shadowing', minutes: 15, packId },
        { id: 'accent', kind: 'accent', skill: 'accent', minutes: 10, accent: nextAccent() },
      ];
    } else {
      kind = 'speak';
      tasks = [
        { id: 'discussion', kind: 'discussion', skill: 'speaking', minutes: 15, packId },
        { id: 'task', kind: 'speakingTask', skill: 'speaking', minutes: 10, packId },
        { id: 'ai', kind: 'aiTalk', skill: 'speaking', minutes: 10, packId },
        { id: 'check', kind: 'check', skill: 'review', minutes: 5, packId, words: [0, n] },
      ];
    }
    days.push({ day, week, phase, kind, packId, tasks });
  }

  // Final week: review each phase, then the final speaking test.
  const final = (day: number, tasks: PathTask[]): PathDay => ({ day, week: 13, phase: 4, kind: 'final', tasks });
  days.push(
    final(85, [
      { id: 'check', kind: 'check', skill: 'review', minutes: 20, packIds: PATH_PHASES[0] },
      { id: 'accent', kind: 'accent', skill: 'accent', minutes: 10, accent: { kind: 'feature', feature: ACCENT_FEATURES[0] } },
      { id: 'rerecord', kind: 'reRecord', skill: 'speaking', minutes: 10, packIds: PATH_PHASES[0] },
    ]),
    final(86, [
      { id: 'check', kind: 'check', skill: 'review', minutes: 20, packIds: PATH_PHASES[1] },
      { id: 'writing', kind: 'weeklyWriting', skill: 'writing', minutes: 20, packIds: PATH_PHASES[1] },
    ]),
    final(87, [
      { id: 'check', kind: 'check', skill: 'review', minutes: 20, packIds: PATH_PHASES[2] },
      { id: 'replay', kind: 'replay', skill: 'listening', minutes: 15, packIds: PATH_PHASES[2] },
      { id: 'shadowing', kind: 'shadowing', skill: 'shadowing', minutes: 15 },
    ]),
    final(88, [{ id: 'mock', kind: 'mockTalk', skill: 'speaking', minutes: 20, packIds: [PATH_PHASES[0][1], PATH_PHASES[1][4], PATH_PHASES[2][3]] }]),
    final(89, [{ id: 'final', kind: 'finalTest', skill: 'speaking', minutes: 15, packIds: [PATH_PHASES[0][2], PATH_PHASES[1][3], PATH_PHASES[2][4]] }]),
    final(90, [{ id: 'reflection', kind: 'reflection', skill: 'writing', minutes: 15 }]),
  );
  return days;
}

// ---- progress ---------------------------------------------------------------

export interface PathState {
  /** Local date the path was started (YYYY-MM-DD), or null before starting. */
  startedAt: string | null;
  /** `${day}:${taskId}` → local date it was done. */
  done: Record<string, string>;
  /** `${day}:${taskId}` → what the user wrote (sentences, paragraphs, reflections). */
  notes: Record<string, string>;
}

export const EMPTY_PATH_STATE: PathState = { startedAt: null, done: {}, notes: {} };

export const taskKey = (day: number, taskId: string) => `${day}:${taskId}`;

export function dayProgress(day: PathDay, state: PathState): { done: number; total: number } {
  const done = day.tasks.filter((t) => state.done[taskKey(day.day, t.id)]).length;
  return { done, total: day.tasks.length };
}

export const isDayDone = (day: PathDay, state: PathState) => day.tasks.every((t) => state.done[taskKey(day.day, t.id)]);

/** The day to work on: the first one not fully done (the last day once everything is done). */
export function currentDay(path: PathDay[], state: PathState): number {
  return path.find((d) => !isDayDone(d, state))?.day ?? path[path.length - 1].day;
}

/** Which day the calendar says you'd be on (1 on the start date). */
export function scheduledDay(startedAt: string, today: string): number {
  return Math.max(1, Math.min(PATH_LENGTH, daysBetweenDateStrings(startedAt, today) + 1));
}

export interface PathStats {
  tasksDone: number;
  tasksTotal: number;
  percent: number;
  daysDone: number;
  minutes: number;
  /** Consecutive days, up to today (or yesterday), with at least one task done. */
  streak: number;
  topicsDone: number;
  bySkill: Record<Skill, { done: number; total: number }>;
}

export function pathStats(path: PathDay[], state: PathState, today: string): PathStats {
  const bySkill = Object.fromEntries(SKILLS.map((s) => [s, { done: 0, total: 0 }])) as PathStats['bySkill'];
  let tasksDone = 0;
  let tasksTotal = 0;
  let minutes = 0;
  for (const d of path) {
    for (const t of d.tasks) {
      tasksTotal++;
      bySkill[t.skill].total++;
      if (state.done[taskKey(d.day, t.id)]) {
        tasksDone++;
        bySkill[t.skill].done++;
        minutes += t.minutes;
      }
    }
  }
  const activeDates = new Set(Object.values(state.done));
  let streak = 0;
  let cursor = activeDates.has(today) ? today : addDaysToDateString(today, -1);
  while (activeDates.has(cursor)) {
    streak++;
    cursor = addDaysToDateString(cursor, -1);
  }
  // A topic is done when its four study days are.
  const topicsDone = PATH_PHASES.flat().filter((id) => {
    const topicDays = path.filter((d) => d.packId === id);
    return topicDays.length > 0 && topicDays.every((d) => isDayDone(d, state));
  }).length;
  return {
    tasksDone,
    tasksTotal,
    percent: tasksTotal ? Math.round((tasksDone / tasksTotal) * 100) : 0,
    daysDone: path.filter((d) => isDayDone(d, state)).length,
    minutes,
    streak,
    topicsDone,
    bySkill,
  };
}

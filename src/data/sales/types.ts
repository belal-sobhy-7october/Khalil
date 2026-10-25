/**
 * Sales Prep: the owner's private plan for learning sales from zero, in
 * Modern Standard Arabic first and then in English, up to a first sales job.
 *
 * Everything here is bundled with the app, so lessons, drills and quizzes
 * work with no internet; videos, podcasts and the AI partners need it.
 * Adding or changing content? Read ./README.md first.
 */

export type SalesLevelId = 'S0' | 'S1' | 'S2' | 'S3';

/** The language a piece of content is written in. */
export type Lang = 'ar' | 'en';

/** A multiple-choice question (a lesson's check, the quizzes). */
export interface SalesChoice {
  q: string;
  options: string[];
  /** Index of the right option. */
  answer: number;
  why?: string;
}

export interface DialogueLine {
  /** `seller`: you. `customer`: the other side. */
  who: 'seller' | 'customer';
  text: string;
}

/** A short lesson: one idea, explained simply, with an example and a check. */
export interface SalesLesson {
  id: string;
  title: string;
  /** The idea in one sentence. */
  summary: string;
  /** The explanation: 3–5 short points. */
  points: Array<{ title: string; text: string }>;
  /** A short conversation that shows the idea. */
  example?: DialogueLine[];
  /** What beginners get wrong. */
  mistakes: string[];
  /** Two or three questions to check you got it (they also make up the weekly quiz). */
  check: SalesChoice[];
  /** English lessons: a short hint in Modern Standard Arabic. */
  noteAr?: string;
}

/** Something to watch or listen to: a video (played in the page), a podcast or a search. */
export interface ListenItem {
  id: string;
  title: string;
  /** Who made it, or where to find it. */
  source: string;
  /** A YouTube video id (played in the page), when the exact video is known. */
  videoId?: string;
  /** Where to open it: the video, the course, or a search for the topic. */
  url: string;
  minutes: number;
  /** What to listen for. */
  focus: string;
  /** Answer these in your notebook afterwards. */
  questions: string[];
}

/** A written drill: turn each item into a better line, then compare with the model. */
export interface Drill {
  id: string;
  title: string;
  instructions: string;
  items: Array<{ prompt: string; model: string }>;
}

/** A role-play for an AI partner (ChatGPT / Gemini voice): it plays the customer. */
export interface SalesRoleplay {
  id: string;
  title: string;
  /** What you sell and to whom. */
  youSell: string;
  /** Who the AI plays and how they feel. */
  persona: string;
  /** What's going on, from the customer's side. */
  situation: string;
  /** What a good seller gets done. */
  goal: string;
  /** Steps you must not skip: they're also the self-score checklist. */
  steps: string[];
  /** Something the AI should throw in halfway. */
  twist?: string;
}

/** A small task in real life: talk to people, watch sellers, try it. */
export interface Mission {
  id: string;
  title: string;
  what: string;
  how: string[];
  /** Write the answers in your notebook. */
  reflect: string[];
}

/** Say it out loud (and record it): a pitch, an answer, a call opening. */
export interface SpeakPrompt {
  id: string;
  title: string;
  prompt: string;
  /** Target length in seconds. */
  seconds: number;
  structure: string[];
  /** A model to read after your own try. */
  model?: string;
  /** Another prompt whose first recording to play next to this one (the "before"). */
  compareWith?: string;
}

/** An English sales word for the flashcards (Level 3). */
export interface SalesWord {
  word: string;
  /** A learner-dictionary definition, ending in `.` */
  definition: string;
  /** The meaning in Modern Standard Arabic. */
  ar: string;
  example: string;
}

export type SalesTaskKind =
  | 'lesson'
  | 'listen'
  | 'drill'
  | 'roleplay'
  | 'mission'
  | 'speak'
  | 'journal'
  | 'words'
  | 'review'
  | 'quiz'
  /** A chapter of the Knowledge books (`k-…`). */
  | 'knowledge';

export interface SalesTask {
  /** Stable id progress is saved under: `<day id>:<kind>:<ref>`. */
  id: string;
  kind: SalesTaskKind;
  /** The id of the thing to do. */
  ref: string;
  minutes: number;
}

export interface SalesDay {
  /** `S1-W1-D1`. */
  id: string;
  title: string;
  tasks: SalesTask[];
}

/** What one week teaches; its six days are built from this (see plan.ts). */
export interface SalesWeekContent {
  /** Five lessons: one a day. */
  lessons: SalesLesson[];
  /** Three things to watch or hear: days 1, 3 and 5. */
  listens: ListenItem[];
  /** Two drills: days 1 and 3. */
  drills: Drill[];
  /** Two role-plays: days 2 and 5. */
  roleplays: SalesRoleplay[];
  /** One mission in real life: day 4. */
  mission: Mission;
  /** Three things to say out loud: days 1, 3 and 5. */
  speaking: SpeakPrompt[];
  /** Twelve English words (Level 3 weeks): day 1, reviewed on the quiz day. */
  words?: SalesWord[];
  /** Knowledge chapters (`k-…`), one a study day from day 1; their checks join the weekly quiz. */
  knowledge?: string[];
}

export interface SalesWeekSpec {
  /** 1-based, inside its level. */
  number: number;
  title: string;
  /** What you can do after this week. */
  goal: string;
  /** A friendly line in Modern Standard Arabic. */
  noteAr: string;
  /** The language the week is studied in. */
  lang: Lang;
  content: SalesWeekContent;
}

export interface SalesWeek extends SalesWeekSpec {
  /** `S1-W1`. */
  id: string;
  level: SalesLevelId;
  days: SalesDay[];
  quizId: string;
}

export interface SalesLevel {
  id: SalesLevelId;
  number: number;
  name: string;
  /** The language the level is studied in. */
  lang: Lang;
  goal: string;
  /** What you must reach to pass the level. */
  exit: string[];
  status: 'ready' | 'planned';
  weeks: SalesWeek[];
  /** The level's own days (the start, the final exam). */
  extraDays: SalesDay[];
  examId?: string;
  /** Planned levels: the week titles and focus. */
  outline?: Array<{ title: string; focus: string }>;
}

/** A free source in the Library tab. */
export interface SalesSource {
  id: string;
  name: string;
  kind: 'podcast' | 'youtube' | 'course' | 'book';
  lang: Lang;
  /** Who it's by. */
  by: string;
  url: string;
  /** Why it's worth your time, in Modern Standard Arabic. */
  whyAr: string;
  /** Beginner-friendly: start with these. */
  start?: boolean;
}

/** A chapter of the Knowledge tab: a real idea from sales, negotiation, marketing or psychology. */
export interface KnowledgeChapter {
  id: string;
  title: string;
  /** The idea in one sentence. */
  idea: string;
  /** The explanation, a few short sections. */
  sections: Array<{ title: string; text: string }>;
  /** A short story or case that shows it. */
  example?: string;
  /** How to use it outside work, and in any job. */
  inLife: string;
  /** A small thing to try today. */
  tryIt: string;
  /** Where the idea comes from (a book, an author, a study). */
  source: string;
  check: SalesChoice[];
}

export interface KnowledgeBook {
  id: 'sales' | 'negotiation' | 'marketing' | 'psychology';
  title: string;
  /** What the book gives you, in one or two sentences. */
  intro: string;
  chapters: KnowledgeChapter[];
}

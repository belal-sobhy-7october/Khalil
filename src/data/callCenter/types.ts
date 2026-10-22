/**
 * Call Center Prep: the owner's private plan from B1 to C1 and an English
 * call center job in Egypt (tech support first, ready for any account).
 *
 * Everything here is bundled with the app, so lessons, scripts and tests work
 * with no internet; videos, YouGlish and the AI partners need it.
 * Adding or changing content? Read ./README.md first.
 */

export type LevelId = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

/** A sound or speaking habit Arabic speakers find hard, practised one per day. */
export interface SoundTarget {
  id: string;
  title: string;
  /** IPA or a short label, e.g. "/p/ vs /b/". */
  label: string;
  /** How to make it, in plain English. */
  how: string;
  /** One short tip in Egyptian Arabic. */
  tipAr: string;
  /** Minimal pairs, or "say it like this" contrasts, to hear and say. */
  pairs?: Array<[string, string]>;
  /** Call center words to hear in real videos on YouGlish. */
  words: string[];
  /** Practice sentences full of the sound (the second one for round two). */
  drills: string[];
}

export interface Phrase {
  /** The phrase as you'd say it on a call. */
  text: string;
  /** What it's for: "show you understand the problem". */
  use: string;
  /** A weaker or negative way of saying it that this phrase replaces. */
  insteadOf?: string;
}

export interface PhraseSet {
  id: string;
  title: string;
  phrases: Phrase[];
}

/** A multiple-choice question (grammar practice, comprehension, tests). */
export interface Choice {
  q: string;
  options: string[];
  /** Index of the right option. */
  answer: number;
  why?: string;
}

export interface GrammarPoint {
  id: string;
  title: string;
  points: Array<{ form: string; use: string; example: string }>;
  /** The golden rule or the mistake Arabic speakers make most. */
  tip: string;
  tipAr?: string;
  exercises: Choice[];
}

export type Account = 'tech' | 'telecom' | 'retail' | 'billing' | 'banking' | 'general' | 'interview';
export type Speaker = 'agent' | 'customer' | 'recruiter' | 'you' | 'colleague' | 'narrator';

export interface ScriptLine {
  who: Speaker;
  text: string;
}

/** A model call (or interview) to listen to, shadow and be tested on. */
export interface CallScript {
  id: string;
  title: string;
  account: Account;
  lines: ScriptLine[];
  /** What to notice while shadowing it. */
  focus: string;
  /** Comprehension questions for the listening tests. */
  questions: Choice[];
}

/** A role-play for an AI partner (ChatGPT / Gemini voice): it plays the other side. */
export interface Scenario {
  id: string;
  title: string;
  account: Account;
  /** 'agent': you take the call. 'candidate': the AI interviews you. */
  role: 'agent' | 'candidate';
  /** Who the AI plays and how they feel. */
  persona: string;
  /** What's going on, from the caller's side. */
  situation: string;
  /** What a great agent gets done. */
  goal: string;
  /** Steps you must not skip. */
  steps: string[];
  /** Something the AI should throw in halfway. */
  twist?: string;
}

export type QuestionGroup = 'hr' | 'egypt' | 'behavioral' | 'situational' | 'tech' | 'fluency';

export interface InterviewQuestion {
  id: string;
  group: QuestionGroup;
  q: string;
  /** What the interviewer is really checking. */
  why: string;
  tips: string[];
  /** A model answer to learn from (not to memorize word for word). */
  answer: string;
  /** Phrases worth reusing. */
  phrases: string[];
  /** Mistakes candidates make with this question. */
  mistakes: string[];
  tipAr?: string;
}

/** A voice note or recorded answer, like the ones recruiters ask for. */
export interface VoicePrompt {
  id: string;
  title: string;
  prompt: string;
  /** Target length in seconds: [min, max]. */
  seconds: [number, number];
  /** A simple structure to follow. */
  structure: string[];
  /** A model to listen to and shadow (optional). */
  sample?: string;
}

export interface TypingText {
  id: string;
  title: string;
  text: string;
}

export type Skill = 'grammar' | 'vocabulary' | 'listening' | 'speaking' | 'writing' | 'typing' | 'calls';

export type TestItem =
  /** Multiple choice; `audio` is read aloud first (a listening question). */
  | ({ type: 'mcq'; skill: Skill; audio?: string } & Choice)
  /** Hear a sentence, type it. */
  | { type: 'dictation'; skill: 'listening'; text: string }
  /** Hear a sentence, say it back (Versant "Repeat"). */
  | { type: 'repeat'; skill: 'speaking'; text: string }
  /** Put the chunks in order to make a sentence (Versant "Sentence Builds"). */
  | { type: 'build'; skill: 'grammar'; chunks: string[] }
  /** Hear a whole call, answer its questions. */
  | { type: 'listen'; skill: 'listening'; scriptId: string }
  /** Hear a short story, retell it (Versant "Story Retelling"). */
  | { type: 'retell'; skill: 'speaking'; story: string; points: string[] }
  /** Answer out loud, then score yourself with the speaking rubric. */
  | { type: 'speak'; skill: 'speaking'; prompt: string; seconds: number }
  /** Write a chat or email reply, then check it against a model. */
  | { type: 'write'; skill: 'writing'; prompt: string; model: string; checklist: string[] }
  | { type: 'typing'; skill: 'typing'; textId: string; wpm: number; accuracy: number }
  /** A mock call with an AI customer, scored with the QA rubric. */
  | { type: 'call'; skill: 'calls'; scenarioId: string };

export interface TestDef {
  id: string;
  title: string;
  /** `vocab`: the word bank check. */
  kind: 'diagnostic' | 'weekly' | 'level' | 'vocab';
  /** Pass mark, percent. */
  pass: number;
  items: TestItem[];
}

export type TaskKind =
  | 'sound'
  | 'watch'
  | 'phrases'
  | 'grammar'
  | 'shadow'
  | 'roleplay'
  | 'interview'
  | 'voice'
  | 'typing'
  | 'test'
  | 'review'
  | 'link'
  /** A unit of the word bank (`v01`…), or `due`: the bank's words due for review. */
  | 'vocab'
  /** A lesson of Ibrahim Adel's grammar course (a YouTube id, see ibrahimAdel.ts). */
  | 'lesson';

export interface PlanTask {
  /** Stable id progress is saved under: `<day id>:<kind>:<ref>`. */
  id: string;
  kind: TaskKind;
  /** The id of the thing to do (a sound, a video, a phrase set, a test…). */
  ref: string;
  minutes: number;
  /** What to focus on this time. */
  note?: string;
}

export interface PlanDay {
  /** `L1-W1-D1`. */
  id: string;
  title: string;
  tasks: PlanTask[];
}

/** What one week teaches; its days are built from this (see plan.ts). */
export interface WeekContent {
  /** Four sounds: one a day on days 1–4 (day 5 reviews them). */
  sounds: string[];
  /** Three phrase sets: days 1, 2 and 4. */
  phraseSets: string[];
  grammar: string;
  /** Two model calls to shadow: days 2 and 4. */
  scripts: string[];
  /** Two role-plays: days 3 and 5. */
  scenarios: string[];
  /** Five interview questions (or voice prompts, `voice:` ids): one a day. */
  speaking: string[];
  /** Five videos: one a day. */
  videos: string[];
  /** Two typing texts, alternating. */
  typing: string[];
  /** Six word bank units, one a day (Level 1). Weeks without them review the due words on days 1–5. */
  vocab?: string[];
}

export interface PlanWeek {
  /** `L1-W1`. */
  id: string;
  level: LevelId;
  number: number;
  title: string;
  /** What you can do after this week. */
  goal: string;
  /** A friendly line in Egyptian Arabic. */
  noteAr: string;
  content: WeekContent;
  days: PlanDay[];
  quizId: string;
}

export interface PlanLevel {
  id: LevelId;
  number: number;
  name: string;
  cefr: string;
  goal: string;
  /** What you must reach to pass the level. */
  exit: string[];
  status: 'ready' | 'planned';
  weeks: PlanWeek[];
  /** The level's own days (the diagnostic, the final exam). */
  extraDays: PlanDay[];
  examId?: string;
  /** Planned levels: the week titles and focus, written up in ROADMAP.md. */
  outline?: Array<{ title: string; focus: string }>;
}

export interface VideoInfo {
  title: string;
  seconds: number;
  channel: string;
  /** The video is in Egyptian Arabic. */
  arabic?: boolean;
}

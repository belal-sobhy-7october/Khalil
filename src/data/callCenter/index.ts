/** Call Center Prep content and lookups. Adding content? Read ./README.md. */
import { GRAMMAR } from './grammar';
import { QUESTIONS, VOICE_PROMPTS } from './interview';
import { PHRASE_SETS } from './phrases';
import { LEVELS, PLAN_DAYS } from './plan';
import { SCENARIOS } from './scenarios';
import { SCRIPTS } from './scripts';
import { SOUNDS } from './sounds';
import { TYPING_TEXTS } from './typing';
import { VIDEOS } from './videos';

export { GRAMMAR, LEVELS, PHRASE_SETS, PLAN_DAYS, QUESTIONS, SCENARIOS, SCRIPTS, SOUNDS, TYPING_TEXTS, VIDEOS, VOICE_PROMPTS };

function byId<T extends { id: string }>(list: T[]): Map<string, T> {
  return new Map(list.map((x) => [x.id, x]));
}

const sounds = byId(SOUNDS);
const phraseSets = byId(PHRASE_SETS);
const grammar = byId(GRAMMAR);
const scripts = byId(SCRIPTS);
const scenarios = byId(SCENARIOS);
const questions = byId(QUESTIONS);
const voicePrompts = byId(VOICE_PROMPTS);
const typingTexts = byId(TYPING_TEXTS);
const levels = byId(LEVELS);
const weeks = byId(LEVELS.flatMap((l) => l.weeks));
const days = new Map(PLAN_DAYS.map((d) => [d.day.id, d]));

export const getSound = (id: string) => sounds.get(id);
export const getPhraseSet = (id: string) => phraseSets.get(id);
export const getGrammar = (id: string) => grammar.get(id);
export const getScript = (id: string) => scripts.get(id);
export const getScenario = (id: string) => scenarios.get(id);
export const getQuestion = (id: string) => questions.get(id);
export const getVoicePrompt = (id: string) => voicePrompts.get(id);
export const getTypingText = (id: string) => typingTexts.get(id);
export const getLevel = (id: string) => levels.get(id);
export const getWeek = (id: string) => weeks.get(id);
export const getPlanDay = (id: string) => days.get(id);

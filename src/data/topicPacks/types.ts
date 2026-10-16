/**
 * Topic packs follow the lesson method of the user's English course: a short
 * warm-up, ~12 key words (mostly nouns, verbs and adjectives that let you
 * discuss the topic, plus a phrasal verb and an idiom), one grammar point that
 * serves the topic, discussion questions that use the words, and a one-minute
 * speaking task. Each word carries the one meaning it has in this topic and an
 * example that puts it in that context.
 *
 * Adding a topic? Follow ./README.md.
 */
import type { VocabularyItemType } from '../../types';

/** Part of speech as the course shows it. */
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrasal verb' | 'idiom' | 'phrase';

export interface PackItem {
  word: string;
  type: VocabularyItemType;
  pos: PartOfSpeech;
  definition: string;
  example: string;
}

export interface GrammarPoint {
  /** The pattern, e.g. "had better + base verb". */
  form: string;
  /** When to use it. */
  use: string;
  example: string;
}

export interface TopicGrammar {
  title: string;
  points: GrammarPoint[];
  /** A common mistake or golden rule. */
  tip?: string;
}

export type PackGroup = 'work' | 'talk' | 'life' | 'society';

export interface TopicPack {
  id: string;
  group: PackGroup;
  title: string;
  description: string;
  level: 'B1' | 'B2' | 'C1';
  emoji: string;
  featured?: boolean;
  /** Lesson from the user's own course (the shared slides). */
  fromCourse?: boolean;
  warmUp: string[];
  items: PackItem[];
  grammar: TopicGrammar;
  discussion: string[];
  /** One-minute voice-note task. */
  task: { prompt: string; points: string[] };
  /** Listen-and-repeat paragraph that uses the words and the grammar. */
  paragraph: string;
}

const POS: Record<string, { pos: PartOfSpeech; type: VocabularyItemType }> = {
  n: { pos: 'noun', type: 'word' },
  v: { pos: 'verb', type: 'verb' },
  adj: { pos: 'adjective', type: 'word' },
  adv: { pos: 'adverb', type: 'word' },
  pv: { pos: 'phrasal verb', type: 'verb' },
  i: { pos: 'idiom', type: 'idiom' },
  p: { pos: 'phrase', type: 'phrase' },
};

/** Items written one per line as `pos | word | definition | example`. */
export function parseItems(raw: string): PackItem[] {
  return raw
    .trim()
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter((parts) => parts.length === 4 && POS[parts[0]])
    .map(([code, word, definition, example]) => ({ ...POS[code], word, definition, example }));
}

export function pack(meta: Omit<TopicPack, 'items'>, raw: string): TopicPack {
  return { ...meta, items: parseItems(raw) };
}

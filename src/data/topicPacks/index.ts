/**
 * Ready-made topic packs, built with the method of the user's English course
 * (warm-up → key words → grammar → discussion → speaking task), from A1 to C1.
 * Every word is checked against the Cambridge Dictionary (see ./README.md).
 */
import { A1_PACKS } from './a1';
import { A2_PACKS } from './a2';
import { B1_PACKS } from './b1';
import { B2_PACKS } from './b2';
import { C1_PACKS } from './c1';
import type { TopicPack } from './types';

export type { GrammarPoint, PackGroup, PackItem, PartOfSpeech, TopicGrammar, TopicPack } from './types';

/** In study order: A1 first, and the topics that come back at a higher level after each level's new ones. */
export const TOPIC_PACKS: TopicPack[] = [...A1_PACKS, ...A2_PACKS, ...B1_PACKS, ...B2_PACKS, ...C1_PACKS];

export function getPackById(id: string): TopicPack | undefined {
  return TOPIC_PACKS.find((p) => p.id === id);
}

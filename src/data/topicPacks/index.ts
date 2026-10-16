/**
 * Ready-made topic packs, built with the method of the user's English course
 * (warm-up → key words → grammar → discussion → speaking task). See ./types.ts.
 */
import { COURSE_PACKS } from './course';
import { WORK_PACKS } from './work';
import { TALK_PACKS } from './talk';
import { LIFE_PACKS } from './life';
import { SOCIETY_PACKS } from './society';
import type { TopicPack } from './types';

export type { GrammarPoint, PackGroup, PackItem, PartOfSpeech, TopicGrammar, TopicPack } from './types';

export const TOPIC_PACKS: TopicPack[] = [...WORK_PACKS, ...COURSE_PACKS, ...TALK_PACKS, ...LIFE_PACKS, ...SOCIETY_PACKS];

export function getPackById(id: string): TopicPack | undefined {
  return TOPIC_PACKS.find((p) => p.id === id);
}

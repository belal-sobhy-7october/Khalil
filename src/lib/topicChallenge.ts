/**
 * Topic challenge: a four-step self-test for one topic (vocabulary category).
 *   1. Pronounce every word        2. Listen to and repeat practice texts
 *   3. Shadow a video (optional)   4. Talk about the topic with an AI for 10 min
 * Progress is stored per user+topic in `topic_challenges` (jsonb), with a
 * localStorage fallback when that table isn't available yet.
 */
import { supabase } from './supabase';
import { TOPIC_PACKS } from '../data/topicPacks';
import type { VocabularyItem } from '../types';

export const TALK_GOAL_SECONDS = 10 * 60;

export interface ChallengeData {
  /** Item ids pronounced correctly. */
  words: string[];
  /** Indices of practice texts listened to and repeated. */
  textsDone: number[];
  /** User-edited practice texts; replaces the generated ones when set. */
  customTexts?: string[];
  videoUrl?: string;
  shadowing?: 'done' | 'skipped';
  talkSeconds: number;
  completedAt?: string;
}

export const EMPTY_CHALLENGE: ChallengeData = { words: [], textsDone: [], talkSeconds: 0 };

export type StepKey = 'words' | 'listen' | 'shadow' | 'talk';

export function stepStatus(data: ChallengeData, items: VocabularyItem[], texts: string[]): Record<StepKey, boolean> {
  const passed = new Set(data.words);
  return {
    words: items.length > 0 && items.every((i) => passed.has(i.id)),
    listen: texts.length > 0 && texts.every((_, i) => data.textsDone.includes(i)),
    shadow: data.shadowing === 'done' || data.shadowing === 'skipped',
    talk: data.talkSeconds >= TALK_GOAL_SECONDS,
  };
}

export function findPackForTopic(topicName: string) {
  const name = topicName.trim().toLowerCase();
  return TOPIC_PACKS.find((p) => p.title.toLowerCase() === name);
}

/**
 * Up to three practice texts: the topic's written paragraph (`paragraph`, or
 * the pack's if the topic came from the library), then paragraphs stitched
 * from the topic's own example sentences, about five sentences each.
 */
export function buildPracticeTexts(topicName: string, items: VocabularyItem[], paragraph?: string): string[] {
  const texts: string[] = [];
  const written = paragraph ?? findPackForTopic(topicName)?.paragraph;
  if (written) texts.push(written);

  const sentences = items
    .map((i) => i.exampleSentence?.trim())
    .filter((s): s is string => !!s && !/[؀-ۿ]/.test(s))
    .map((s) => (/[.!?]$/.test(s) ? s : `${s}.`));
  for (let i = 0; i < sentences.length && texts.length < 3; i += 5) {
    const chunk = sentences.slice(i, i + 5);
    if (chunk.length >= 3) texts.push(chunk.join(' '));
  }
  return texts;
}

/**
 * A ready-to-paste prompt for Talkpal or any voice AI. Topics from the
 * library bring their lesson: the discussion questions, the grammar to
 * practise and the speaking task.
 */
export function buildAiPrompt(topicName: string, items: VocabularyItem[]): string {
  const pack = findPackForTopic(topicName);
  const words = (items.length ? items.map((i) => i.word) : pack?.items.map((i) => i.word) ?? []).slice(0, 25).join(', ');
  // Interview first: "Call Center Interview" is an interview, not a call.
  const role = /interview/i.test(topicName)
    ? 'Act as an interviewer for a customer service job. Ask me one question at a time and follow up on my answers.'
    : /call center|customer/i.test(topicName)
      ? 'Play a customer calling a support line. I am the call center agent. Start with a realistic problem and react naturally — sometimes be a little difficult.'
      : `Have a natural conversation with me about "${topicName}". Ask me open questions and share your own opinions too.`;
  const lines = [`I'm an English learner at B2 level. Let's practise speaking for 10 minutes.`, role];
  if (pack) {
    lines.push(`Use these questions, one at a time: ${[...pack.warmUp, ...pack.discussion].join(' / ')}`);
    lines.push(`Grammar I'm practising: ${pack.grammar.title} (${pack.grammar.points.map((p) => p.form).join('; ')}). Notice when I use it wrongly.`);
    lines.push(`At the end, ask me to do this task: ${pack.task.prompt} (${pack.task.points.join('; ')}).`);
  }
  lines.push(
    `Try to get me to use these words and phrases: ${words}.`,
    `Keep your replies short so I speak more than you. At the end, list my main mistakes with corrections and 3 tips to sound more natural.`
  );
  return lines.join('\n');
}

export { youtubeId } from './youtube';

// ---- persistence ----------------------------------------------------------

const localKey = (userId: string, categoryId: string) => `khalil-topic-challenge:${userId}:${categoryId}`;

function readLocal(userId: string, categoryId: string): ChallengeData | null {
  try {
    const raw = localStorage.getItem(localKey(userId, categoryId));
    return raw ? { ...EMPTY_CHALLENGE, ...(JSON.parse(raw) as Partial<ChallengeData>) } : null;
  } catch {
    return null;
  }
}

function writeLocal(userId: string, categoryId: string, data: ChallengeData) {
  try {
    localStorage.setItem(localKey(userId, categoryId), JSON.stringify(data));
  } catch {
    // storage full or blocked — progress just won't survive a reload
  }
}

export async function loadChallenge(userId: string, categoryId: string): Promise<ChallengeData> {
  const { data, error } = await supabase
    .from('topic_challenges')
    .select('data')
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .maybeSingle();
  if (error || !data) return readLocal(userId, categoryId) ?? EMPTY_CHALLENGE;
  return { ...EMPTY_CHALLENGE, ...((data as { data: Partial<ChallengeData> }).data ?? {}) };
}

/** Saves to the database; always mirrors to localStorage so nothing is lost if it fails. */
export async function saveChallenge(userId: string, categoryId: string, data: ChallengeData): Promise<boolean> {
  writeLocal(userId, categoryId, data);
  const { error } = await supabase
    .from('topic_challenges')
    .upsert(
      { user_id: userId, category_id: categoryId, data, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,category_id' }
    );
  if (error) console.error('saveChallenge', error);
  return !error;
}

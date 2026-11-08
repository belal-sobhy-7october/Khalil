/**
 * The search of "Ask Khalil" (data/help.ts), on the device: no AI, no key, no
 * internet. Arabic is matched without harakat, with every alef and hamza form
 * as one, ة as ه, ى as ي, and without a leading "ال"; English ignores case.
 */
import { HELP_TOPICS, type HelpTopic } from '../data/help';

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ؤ]/g, 'و')
    .replace(/[ئ]/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ');
}

/** The words of a text, normalized, with "ال" (and "وال"/"بال"/"لل") taken off Arabic words. */
export function words(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .map((w) => w.replace(/^(?:وال|بال|فال|كال|لل|ال)(?=\p{L}{2,})/u, ''))
    .filter((w) => w.length >= 2);
}

interface Indexed {
  topic: HelpTopic;
  keywords: string[];
  question: string[];
  answer: string[];
}

const INDEX: Indexed[] = HELP_TOPICS.map((topic) => ({
  topic,
  keywords: topic.keywords.flatMap(words),
  question: [...words(topic.q.ar), ...words(topic.q.en)],
  answer: [...words(topic.a.ar), ...words(topic.a.en)],
}));

/** A query word matches a topic word that equals it or starts with it (3 letters or more). */
function hit(query: string, list: string[]): boolean {
  return list.some((w) => w === query || (query.length >= 3 && (w.startsWith(query) || query.startsWith(w) && w.length >= 4)));
}

/** The topics that answer `query`, best first (at most `limit`). Nothing typed: the popular ones. */
export function searchHelp(query: string, limit = 6): HelpTopic[] {
  const q = words(query);
  if (!q.length) return HELP_TOPICS.filter((t) => t.popular);
  return INDEX.map((entry) => {
    let score = 0;
    for (const w of q) {
      if (hit(w, entry.keywords)) score += 3;
      if (hit(w, entry.question)) score += 2;
      if (hit(w, entry.answer)) score += 1;
    }
    return { topic: entry.topic, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.topic);
}

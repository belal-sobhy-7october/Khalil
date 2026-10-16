/**
 * Pure helpers for the typing practice modes ("Listen & type" and
 * "Complete the sentence").
 */

export type Grade = 'correct' | 'close' | 'wrong';

export function normalizeAnswer(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // résumé → resume
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9' -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/**
 * Exact (ignoring case/punctuation) is correct; one typo in a word of 5+
 * letters (two in 10+) counts as "close" — right, but shown the spelling.
 */
export function gradeAnswer(answer: string, expected: string): Grade {
  const a = normalizeAnswer(answer);
  if (!a) return 'wrong';
  // "résumé / CV": any of the alternatives is accepted.
  const options = expected.split('/').map(normalizeAnswer).filter(Boolean);
  let best: Grade = 'wrong';
  for (const e of options) {
    if (a === e) return 'correct';
    const allowed = e.length >= 10 ? 2 : e.length >= 5 ? 1 : 0;
    if (levenshtein(a, e) <= allowed) best = 'close';
  }
  return best;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Regex source for a word and its common inflections — only real endings,
 * so "art" matches "arts" but never "article":
 *   negotiate → negotiates / negotiated / negotiating
 *   study     → studies / studied / studying
 *   run       → runs / running / runner
 */
function inflected(word: string): string {
  const w = escapeRegExp(word);
  if (/[^aeiou]y$/i.test(word)) return `${w.slice(0, -1)}(?:y|ies|ied|ying)`;
  if (/e$/i.test(word)) return `${w.slice(0, -1)}(?:e|es|ed|ing|er|ers)`;
  const last = escapeRegExp(word.slice(-1));
  return `${w}(?:s|es|ed|ing|er|ers|${last}ed|${last}ing|${last}er)?`;
}

/**
 * Blank the word out of its example sentence. Matches inflected forms too
 * ("negotiate" → "negotiated"), and returns the exact form used so that is
 * what the learner must type. null when the example doesn't contain it.
 * For phrases only the first word is inflected ("pull up" → "pulled up").
 */
export function buildGap(word: string, example: string | undefined): { before: string; answer: string; after: string } | null {
  if (!example) return null;
  const base = word.trim().replace(/\s*\/.*$/, ''); // "résumé / CV" → "résumé"
  if (!base || /[…]/.test(base)) return null;
  const [first, ...rest] = base.split(/\s+/);
  const source = [inflected(first), ...rest.map(escapeRegExp)].join('\\s+');
  // Letter boundaries that also understand accented letters (é), unlike \b.
  const match = new RegExp(`(?<!\\p{L})${source}(?!\\p{L})`, 'iu').exec(example);
  if (!match) return null;
  return {
    before: example.slice(0, match.index),
    answer: match[0],
    after: example.slice(match.index + match[0].length),
  };
}

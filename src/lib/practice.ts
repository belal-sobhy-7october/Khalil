/**
 * Pure helpers for the typing practice modes ("Listen & type" and
 * "Complete the sentence").
 */

export type Grade = 'correct' | 'close' | 'wrong';

export function normalizeAnswer(text: string): string {
  return text
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
  const e = normalizeAnswer(expected);
  if (!a) return 'wrong';
  if (a === e) return 'correct';
  const allowed = e.length >= 10 ? 2 : e.length >= 5 ? 1 : 0;
  return levenshtein(a, e) <= allowed ? 'close' : 'wrong';
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Blank the word out of its example sentence. Matches inflected forms too
 * ("negotiate" → "negotiated"), and returns the exact form used so that is
 * what the learner must type. null when the example doesn't contain it.
 */
export function buildGap(word: string, example: string | undefined): { before: string; answer: string; after: string } | null {
  if (!example) return null;
  const base = word.trim().replace(/\s*\/.*$/, ''); // "résumé / CV" → "résumé"
  if (!base || /[…]/.test(base)) return null;
  const stem = base.split(' ').length === 1 && base.length > 4 ? base.replace(/e$/i, '') : base;
  const pattern = new RegExp(`\\b${escapeRegExp(stem).replace(/ /g, '\\s+')}[a-z]*`, 'i');
  const match = pattern.exec(example);
  if (!match) return null;
  return {
    before: example.slice(0, match.index),
    answer: match[0],
    after: example.slice(match.index + match[0].length),
  };
}

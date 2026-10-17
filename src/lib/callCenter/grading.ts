/** Scoring for Call Center Prep: dictation and repeats, typing, rubrics. */
import { normalizeAnswer } from '../practice';

const CONTRACTIONS: Record<string, string> = {
  "i'm": 'i am', "i've": 'i have', "i'll": 'i will', "i'd": 'i would', "you're": 'you are', "you've": 'you have',
  "you'll": 'you will', "you'd": 'you would', "he's": 'he is', "she's": 'she is', "it's": 'it is', "we're": 'we are',
  "we've": 'we have', "we'll": 'we will', "we'd": 'we would', "they're": 'they are', "they've": 'they have',
  "they'll": 'they will', "that's": 'that is', "there's": 'there is', "what's": 'what is', "let's": 'let us',
  "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not', "don't": 'do not',
  "doesn't": 'does not', "didn't": 'did not', "haven't": 'have not', "hasn't": 'has not', "can't": 'cannot',
  "couldn't": 'could not', "won't": 'will not', "wouldn't": 'would not', "shouldn't": 'should not',
};

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** 0–999,999 in words ("forty two"), so "42" and "forty-two" compare equal. */
export function numberWords(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : '');
  if (n < 1000) return `${ONES[Math.floor(n / 100)]} hundred${n % 100 ? ` ${numberWords(n % 100)}` : ''}`;
  return `${numberWords(Math.floor(n / 1000))} thousand${n % 1000 ? ` ${numberWords(n % 1000)}` : ''}`;
}

/** The words of a sentence, made comparable: lowercase, no punctuation, contractions and numbers spelled out. */
export function normalizeWords(text: string): string[] {
  return normalizeAnswer(text.replace(/[-–]/g, ' '))
    .split(' ')
    .filter(Boolean)
    .flatMap((w) => {
      if (CONTRACTIONS[w]) return CONTRACTIONS[w].split(' ');
      if (/^\d{1,6}$/.test(w)) return numberWords(Number(w)).split(' ');
      return [w.replace(/'s$/, '')];
    })
    .filter((w) => w && w !== 'and');
}

/** Edit distance between two word lists. */
function wordDistance(a: string[], b: string[]): number {
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

/** How much of `expected` was said or typed, 0–1. */
export function wordAccuracy(expected: string, actual: string): number {
  const want = normalizeWords(expected);
  if (!want.length) return 0;
  const got = normalizeWords(actual);
  return Math.max(0, 1 - wordDistance(want, got) / want.length);
}

/** The best accuracy among several recognizer guesses. */
export const bestAccuracy = (expected: string, guesses: string[]) =>
  guesses.reduce((best, g) => Math.max(best, wordAccuracy(expected, g)), 0);

/** Points (0, 0.5 or 1) for a dictation or a repeat, like Versant's partial credit. */
export const accuracyPoints = (accuracy: number) => (accuracy >= 0.95 ? 1 : accuracy >= 0.75 ? 0.5 : 0);

export interface TypingStats {
  /** Net words per minute: correct characters / 5 per minute. */
  wpm: number;
  /** Correct characters out of those typed, 0–100. */
  accuracy: number;
  typed: number;
  correct: number;
}

/** Compares what was typed with the text, character by character. */
export function typingStats(text: string, typed: string, seconds: number): TypingStats {
  let correct = 0;
  for (let i = 0; i < typed.length; i++) if (typed[i] === text[i]) correct += 1;
  const minutes = Math.max(seconds, 1) / 60;
  return {
    wpm: Math.round(correct / 5 / minutes),
    accuracy: typed.length ? Math.round((correct / typed.length) * 100) : 0,
    typed: typed.length,
    correct,
  };
}

/** Typing points out of 1: full marks at the target speed and accuracy, less below them. */
export function typingPoints(stats: Pick<TypingStats, 'wpm' | 'accuracy'>, wpm: number, accuracy: number): number {
  if (stats.wpm >= wpm && stats.accuracy >= accuracy) return 1;
  const share = Math.min(1, stats.wpm / wpm) * Math.min(1, stats.accuracy / accuracy);
  return Math.floor(share * 4) / 4;
}

// ── Rubrics ────────────────────────────────────────────────────────────

export interface RubricCriterion {
  id: string;
  name: string;
  /** What "great" (2 points) looks like. */
  great: string;
}

/** The QA form call centers score calls with (0 = missed, 1 = partly, 2 = great). */
export const CALL_RUBRIC: RubricCriterion[] = [
  { id: 'opening', name: 'Opening', great: 'Greeting, your name, the brand, and an offer to help.' },
  { id: 'verification', name: 'Verification & details', great: 'Verified the caller and got the right details, confirmed back.' },
  { id: 'empathy', name: 'Empathy & tone', great: 'Named the problem, showed you care, warm and calm all through.' },
  { id: 'probing', name: 'Probing', great: 'Open then closed questions; found the real problem fast.' },
  { id: 'solution', name: 'Solution', great: 'Clear steps, one at a time, and checked that it worked.' },
  { id: 'control', name: 'Call control', great: 'No dead air; holds asked for and explained.' },
  { id: 'language', name: 'Language', great: 'Clear, correct and polite; positive scripting, no blaming.' },
  { id: 'closing', name: 'Closing', great: 'Recap, next steps, anything else, thanks.' },
];

/** For interview role-plays, where you're the candidate. */
export const INTERVIEW_RUBRIC: RubricCriterion[] = [
  { id: 'structure', name: 'Structure', great: 'Every answer had a point, a reason and an example.' },
  { id: 'fluency', name: 'Fluency', great: 'No long silences; natural fillers only.' },
  { id: 'pronunciation', name: 'Pronunciation', great: 'Easy to understand: sounds, endings, word stress.' },
  { id: 'grammar', name: 'Grammar', great: 'Tenses and basics right; short, correct sentences.' },
  { id: 'vocabulary', name: 'Vocabulary', great: 'Professional, natural phrases.' },
  { id: 'confidence', name: 'Confidence', great: 'Steady, friendly voice; finished every sentence.' },
  { id: 'examples', name: 'Examples', great: 'Real stories with results (STAR).' },
  { id: 'fit', name: 'Fit', great: 'Linked answers to the job; asked a good question.' },
];

/** For one recorded answer (1–5 each). */
export const SPEAKING_RUBRIC: Array<{ id: string; name: string; five: string }> = [
  { id: 'fluency', name: 'Fluency', five: 'Smooth, no pause longer than two seconds.' },
  { id: 'pronunciation', name: 'Pronunciation', five: 'A stranger would understand every word.' },
  { id: 'grammar', name: 'Grammar', five: 'No mistakes with tenses, -s or articles.' },
  { id: 'vocabulary', name: 'Vocabulary', five: 'Natural, professional phrases.' },
  { id: 'structure', name: 'Structure', five: 'A clear start, middle and end.' },
];

/** Rubric points (each 0–2) → percent. */
export function rubricPercent(scores: Record<string, number>, rubric: RubricCriterion[]): number {
  const got = rubric.reduce((sum, c) => sum + Math.max(0, Math.min(2, scores[c.id] ?? 0)), 0);
  return Math.round((got / (rubric.length * 2)) * 100);
}

/** Speaking ratings (each 1–5) → percent. */
export function speakingPercent(ratings: Record<string, number>): number {
  const got = SPEAKING_RUBRIC.reduce((sum, c) => sum + Math.max(0, Math.min(5, ratings[c.id] ?? 0)), 0);
  return Math.round((got / (SPEAKING_RUBRIC.length * 5)) * 100);
}

/**
 * Weekly quizzes and level exams, built from what the week (or level)
 * taught, with the same item types as the real hiring tests. The questions
 * are picked with a seed, so a retake (a new attempt number) gets a fresh mix.
 */
import { getGrammar, getPhraseSet, getQuestion, getScript, getVoicePrompt, LEVELS, VOCAB_WORDS } from '../../data/callCenter';
import { VOCAB_CHECK_ID } from '../../data/callCenter/plan';
import { DIAGNOSTIC, LEVEL_EXAMS, type ExamConfig } from '../../data/callCenter/tests';
import type { LevelId, Phrase, PlanWeek, TestDef, TestItem } from '../../data/callCenter/types';

/** Typing targets per level: words per minute and accuracy. */
export const TYPING_TARGETS: Record<LevelId, { wpm: number; accuracy: number }> = {
  L0: { wpm: 25, accuracy: 90 },
  L1: { wpm: 25, accuracy: 90 },
  L2: { wpm: 30, accuracy: 92 },
  L3: { wpm: 35, accuracy: 95 },
  L4: { wpm: 40, accuracy: 96 },
  L5: { wpm: 45, accuracy: 97 },
};

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** A small seeded random generator (mulberry32). */
export function seeded(seed: string): () => number {
  let a = hash(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(list: T[], rand: () => number): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const pick = <T,>(list: T[], n: number, rand: () => number) => shuffle(list, rand).slice(0, n);
const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

/** Words a chunk can't end with. */
const DETERMINERS = new Set(['a', 'an', 'the', 'your', 'my', 'our', 'their']);
/** Words a chunk reads well starting with: the determiners, prepositions, conjunctions and "I'm"-like subjects. */
const CHUNK_START = new Set([
  ...DETERMINERS,
  'in', 'on', 'at', 'for', 'to', 'with', 'from', 'by', 'about', 'before', 'after', 'until', 'within',
  'and', 'but', 'or', 'so', 'because', 'if', 'when', 'while', 'that', 'which', 'who', 'as',
  'i', "i'm", "i'll", "i've", "i'd", "we'll", "we're", "we've", "you'll", "you're", "they'll", "they're",
]);

/**
 * Splits a sentence into 3 (or 4, when long) chunks that are each a piece of
 * meaning ("in a few minutes"): of every way to cut it, the one with chunks
 * of about the same size, cut after a comma or before a word from
 * CHUNK_START, not right after one, and without one-word chunks.
 */
export function chunk(sentence: string): string[] {
  const words = sentence.replace(/[.?!]$/, '').split(/\s+/).filter(Boolean);
  const n = words.length;
  const parts = Math.min(n, n >= 12 ? 4 : 3);
  if (parts < 2) return n ? [words.join(' ')] : [];
  const bare = words.map((w) => w.toLowerCase().replace(/’/g, "'").replace(/[^a-z']/g, ''));
  // After a comma or a full stop ("checking. | May I…"), but not after "Mr.".
  const afterStop = (i: number) => /[,;:.?!]$/.test(words[i - 1]) && !/^(mr|mrs|ms|dr)\.$/i.test(words[i - 1]);
  const inQuotes = (i: number) => (words.slice(0, i).join(' ').match(/"/g)?.length ?? 0) % 2 === 1;
  // The cost of cutting before word i.
  const cutCost = (i: number) =>
    inQuotes(i) ? 4
    : afterStop(i) ? 0
    : DETERMINERS.has(bare[i - 1]) ? 4
    : CHUNK_START.has(bare[i - 1]) ? 2
    : CHUNK_START.has(bare[i]) ? 0
    : 1.5;
  let best = { cuts: [] as number[], cost: Infinity };
  const walk = (cuts: number[]) => {
    if (cuts.length === parts - 1) {
      const edges = [0, ...cuts, n];
      let cost = 0;
      cuts.forEach((at, k) => (cost += Math.abs(at - ((k + 1) * n) / parts) / 2 + cutCost(at)));
      // A lone "Sorry," is fine, a lone "today" so-so, a lone "for" bad.
      for (let k = 1; k < edges.length; k++) {
        if (edges[k] - edges[k - 1] === 1 && !afterStop(edges[k])) cost += CHUNK_START.has(bare[edges[k - 1]]) ? 2 : 1;
      }
      if (cost < best.cost) best = { cuts, cost };
      return;
    }
    for (let at = (cuts.at(-1) ?? 0) + 1; at <= n - (parts - 1 - cuts.length); at++) walk([...cuts, at]);
  };
  walk([]);
  const edges = [0, ...best.cuts, n];
  return best.cuts.concat(n).map((end, k) => words.slice(edges[k], end).join(' '));
}

interface Pool {
  grammar: TestItem[];
  phrases: Phrase[];
  lines: string[];
  scripts: string[];
  words: typeof VOCAB_WORDS;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The example with the word blanked out, or null when the example bends the word ("froze" for "freeze"). */
function blankOut(example: string, word: string): string | null {
  const re = new RegExp(`\\b${escapeRe(word)}\\b`, 'i');
  return re.test(example) ? example.replace(re, '_____') : null;
}

/** Word bank questions: the word for a definition, or the word that completes an example. */
export function vocabItems(words: typeof VOCAB_WORDS, n: number, rand: () => number): TestItem[] {
  return pick(words, n, rand).map((w, i): TestItem => {
    // Distractors of the same kind, from the same unit when it has enough.
    const sameKind = (list: typeof VOCAB_WORDS) => list.filter((x) => x.pos === w.pos && x.word !== w.word);
    const unitPeers = sameKind(VOCAB_WORDS.filter((x) => x.unitId === w.unitId));
    const peers = unitPeers.length >= 3 ? unitPeers : sameKind(VOCAB_WORDS);
    const options = shuffle([w.word, ...pick(peers, 3, rand).map((x) => x.word)], rand);
    const gap = i % 2 ? blankOut(w.example, w.word) : null;
    return gap
      ? { type: 'mcq', skill: 'vocabulary', q: `Complete the sentence: ${gap}`, options, answer: options.indexOf(w.word), why: w.definition }
      : { type: 'mcq', skill: 'vocabulary', q: `Which word or phrase means: "${w.definition}"`, options, answer: options.indexOf(w.word), why: w.example };
  });
}

function poolOf(weeks: PlanWeek[]): Pool {
  const grammar: TestItem[] = [];
  const phrases: Phrase[] = [];
  const lines: string[] = [];
  const scripts: string[] = [];
  const units = new Set(weeks.flatMap((w) => w.content.vocab ?? []));
  for (const w of weeks) {
    for (const e of getGrammar(w.content.grammar)?.exercises ?? []) grammar.push({ type: 'mcq', skill: 'grammar', ...e });
    for (const id of w.content.phraseSets) phrases.push(...(getPhraseSet(id)?.phrases ?? []));
    for (const id of w.content.scripts) {
      const script = getScript(id);
      if (!script) continue;
      scripts.push(id);
      for (const l of script.lines) lines.push(l.text);
    }
  }
  // Weeks without units of their own keep testing the whole bank.
  const words = units.size ? VOCAB_WORDS.filter((w) => units.has(w.unitId)) : VOCAB_WORDS;
  return { grammar, phrases: [...new Map(phrases.map((p) => [p.text, p])).values()], lines: [...new Set(lines)], scripts, words };
}

/** "Which sentence would you use to…?" and better-vs-worse questions from the phrases studied. */
function phraseItems(phrases: Phrase[], n: number, rand: () => number): TestItem[] {
  const usable = phrases.filter((p) => !p.text.includes('…'));
  const items: TestItem[] = [];
  for (const p of pick(usable.filter((x) => x.insteadOf), Math.min(2, Math.floor(n / 3)), rand)) {
    const options = shuffle([p.text, p.insteadOf ?? ''], rand);
    items.push({ type: 'mcq', skill: 'vocabulary', q: `Which is the better thing to say to a customer?`, options, answer: options.indexOf(p.text), why: `Positive scripting: ${p.use}.` });
  }
  for (const p of pick(usable.filter((x) => !x.insteadOf), n - items.length, rand)) {
    const others = pick(usable.filter((x) => x.use !== p.use && x.text !== p.text), 3, rand).map((x) => x.text);
    const options = shuffle([p.text, ...others], rand);
    items.push({ type: 'mcq', skill: 'vocabulary', q: `Which sentence would you use to ${p.use}?`, options, answer: options.indexOf(p.text) });
  }
  return items;
}

function drawItems(pool: Pool, draw: ExamConfig['draw'], rand: () => number): TestItem[] {
  const speakable = pool.lines.filter((l) => wordCount(l) >= 5 && wordCount(l) <= 14 && !/[…"]/.test(l));
  const buildable = pool.phrases.map((p) => p.text).filter((t) => wordCount(t) >= 6 && wordCount(t) <= 14 && !t.includes('…'));
  const dictation = pick(speakable, draw.dictation, rand);
  const repeat = pick(speakable.filter((l) => !dictation.includes(l)), draw.repeat, rand);
  return [
    ...pick(pool.grammar, draw.grammar, rand),
    ...phraseItems(pool.phrases, draw.phrases, rand),
    ...dictation.map((text): TestItem => ({ type: 'dictation', skill: 'listening', text })),
    ...repeat.map((text): TestItem => ({ type: 'repeat', skill: 'speaking', text })),
    ...pick(buildable, draw.build, rand).map((t): TestItem => ({ type: 'build', skill: 'grammar', chunks: chunk(t) })),
    ...pick(pool.scripts, draw.listen, rand).map((scriptId): TestItem => ({ type: 'listen', skill: 'listening', scriptId })),
    ...vocabItems(pool.words, draw.vocab, rand),
  ];
}

/** The speaking item for a week: one of its interview questions or voice notes. */
function speakingItem(ref: string): TestItem | null {
  if (ref.startsWith('voice:')) {
    const v = getVoicePrompt(ref.slice(6));
    return v ? { type: 'speak', skill: 'speaking', prompt: v.prompt, seconds: v.seconds[1] } : null;
  }
  const q = getQuestion(ref);
  return q ? { type: 'speak', skill: 'speaking', prompt: q.q, seconds: 60 } : null;
}

export function buildWeeklyQuiz(week: PlanWeek, attempt = 0): TestDef {
  const rand = seeded(`${week.id}:${attempt}`);
  const target = TYPING_TARGETS[week.level];
  const speaking = speakingItem(pick(week.content.speaking, 1, rand)[0]);
  return {
    id: week.quizId,
    title: `Week ${week.number} quiz: ${week.title}`,
    kind: 'weekly',
    pass: 80,
    items: [
      ...drawItems(poolOf([week]), { grammar: 5, phrases: 5, dictation: 2, repeat: 2, build: 2, listen: 1, vocab: 4 }, rand),
      ...(speaking ? [speaking] : []),
      { type: 'typing', skill: 'typing', textId: pick(week.content.typing, 1, rand)[0], ...target },
    ],
  };
}

export function buildLevelExam(config: ExamConfig, attempt = 0): TestDef {
  const level = LEVELS.find((l) => l.id === config.level);
  const rand = seeded(`${config.id}:${attempt}`);
  return {
    id: config.id,
    title: config.title,
    kind: 'level',
    pass: config.pass,
    items: [...drawItems(poolOf(level?.weeks ?? []), config.draw, rand), ...config.extra],
  };
}

/** The word bank check: 40 of the 384 words, a new sample every attempt. */
export function buildVocabCheck(attempt = 0): TestDef {
  return {
    id: VOCAB_CHECK_ID,
    title: 'Vocab check: the call center word bank',
    kind: 'vocab',
    pass: 90,
    items: vocabItems(VOCAB_WORDS, 40, seeded(`${VOCAB_CHECK_ID}:${attempt}`)),
  };
}

/** Any test by id: the diagnostic, a weekly quiz (`L1-W2-QUIZ`), a level exam (`L1-EXAM`) or the vocab check. */
export function getTest(id: string, attempt = 0): TestDef | null {
  if (id === DIAGNOSTIC.id) return DIAGNOSTIC;
  if (id === VOCAB_CHECK_ID) return buildVocabCheck(attempt);
  const exam = LEVEL_EXAMS.find((e) => e.id === id);
  if (exam) return buildLevelExam(exam, attempt);
  const week = LEVELS.flatMap((l) => l.weeks).find((w) => w.quizId === id);
  return week ? buildWeeklyQuiz(week, attempt) : null;
}

/** Points an item is worth (a call or a speaking answer counts for more than one question). */
export function itemWeight(item: TestItem): number {
  switch (item.type) {
    case 'listen':
      return getScript(item.scriptId)?.questions.length ?? 3;
    case 'speak':
    case 'call':
      return 3;
    case 'retell':
    case 'write':
    case 'typing':
      return 2;
    default:
      return 1;
  }
}

/**
 * The diagnostic's grammar questions go from B1 (1–5) to B2 (6–10) to C1
 * (11–15): a rough level from how many of each band were right.
 */
export function estimateGrammarLevel(correctByBand: [number, number, number]): string {
  const [b1, b2, c1] = correctByBand;
  if (b1 < 4) return 'A2–B1';
  if (b2 < 3) return 'B1';
  if (c1 < 3) return 'B2';
  return 'C1';
}

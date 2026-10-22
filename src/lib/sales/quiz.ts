/** The sales quizzes: weekly, level exams and the first-day check, built from the lessons. */
import { getChapter } from '../../data/sales/knowledge';
import { DIAGNOSTIC_ID, LEVELS, getLevel, getWeek } from '../../data/sales/plan';
import type { Lang, SalesChoice, SalesWeek, SalesWord } from '../../data/sales/types';

export interface SalesQuiz {
  id: string;
  title: string;
  lang: Lang;
  /** Pass mark, percent; 0 for the first-day check (it only measures). */
  pass: number;
  questions: SalesChoice[];
}

/** A small seeded random generator, so an attempt's questions stay the same while you take it. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: T[], rand: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** The same question with its options in a new order (the answer follows). */
export function shuffleOptions(c: SalesChoice, rand: () => number): SalesChoice {
  const order = shuffle(c.options.map((_, i) => i), rand);
  return { ...c, options: order.map((i) => c.options[i]), answer: order.indexOf(c.answer) };
}

/** "What does X mean?" for each word, the other options from the same week's words. */
export function wordQuestions(words: SalesWord[], rand: () => number): SalesChoice[] {
  return words.map((w, i) => {
    const others = shuffle(words.filter((_, j) => j !== i), rand).slice(0, 3).map((o) => o.definition);
    return { q: `What does "${w.word}" mean?`, options: [w.definition, ...others], answer: 0, why: w.example };
  });
}

const weekQuestions = (week: SalesWeek, rand: () => number) => [
  ...week.content.lessons.flatMap((l) => l.check),
  ...(week.content.knowledge ?? []).flatMap((id) => getChapter(id)?.chapter.check ?? []),
  ...(week.content.words ? wordQuestions(week.content.words, rand) : []),
];

const EXAM_SIZE = 25;

/** The quiz for an id, with a new order (and, for exams, a new sample) for each seed. */
export function buildQuiz(id: string, seed = 1): SalesQuiz | null {
  const rand = seeded(seed);
  if (id === DIAGNOSTIC_ID) {
    // Two questions from each week of Levels 1 and 2: where you start, before any lesson.
    const questions = LEVELS.filter((l) => l.id === 'S1' || l.id === 'S2').flatMap((l) => l.weeks.flatMap((w) => [w.content.lessons[0].check[0], w.content.lessons[3].check[0]]));
    return { id, title: 'اختبار البداية', lang: 'ar', pass: 0, questions: questions.map((q) => shuffleOptions(q, rand)) };
  }
  const weekly = id.match(/^(S\d-W\d+)-QUIZ$/);
  if (weekly) {
    const week = getWeek(weekly[1]);
    if (!week) return null;
    const title = week.lang === 'en' ? `Week ${week.number} quiz: ${week.title}` : `كويز الأسبوع ${week.number}: ${week.title}`;
    return { id, title, lang: week.lang, pass: 80, questions: shuffle(weekQuestions(week, rand), rand).map((q) => shuffleOptions(q, rand)) };
  }
  const exam = id.match(/^(S\d)-EXAM$/);
  if (exam) {
    const level = getLevel(exam[1]);
    if (!level) return null;
    const pool = level.weeks.flatMap((w) => weekQuestions(w, rand));
    const title = level.lang === 'en' ? `Level ${level.number} exam` : `امتحان المستوى ${level.number}`;
    return { id, title, lang: level.lang, pass: 80, questions: shuffle(pool, rand).slice(0, EXAM_SIZE).map((q) => shuffleOptions(q, rand)) };
  }
  return null;
}

/** The quiz's title without building it. */
export const quizTitle = (id: string) => buildQuiz(id)?.title ?? id;

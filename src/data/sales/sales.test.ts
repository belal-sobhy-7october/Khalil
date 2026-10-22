import { describe, expect, it } from 'vitest';
import { ALL_LESSONS, DIAGNOSTIC_ID, EXTRA_LESSONS, EXTRA_WEEKS, LEVELS, PLAN_DAYS, getDrill, getLesson, getListen, getMission, getRoleplay, getSpeak, getWeek } from './plan';
import { SALES_SOURCES } from './sources';
import { ALL_CHAPTERS, KNOWLEDGE, getChapter } from './knowledge';
import { EXAM_ROLEPLAYS, EXAM_SPEAKING, JOURNAL_PROMPTS } from './start';
import type { SalesChoice } from './types';
import { buildQuiz } from '../../lib/sales/quiz';

const ARABIC = /[؀-ۿ]/;
const unique = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
const weeks = LEVELS.flatMap((l) => l.weeks);
const content = weeks.map((w) => w.content);

function validChoice(c: SalesChoice) {
  expect(c.options.length, c.q).toBeGreaterThanOrEqual(3);
  expect(c.answer, c.q).toBeGreaterThanOrEqual(0);
  expect(c.answer, c.q).toBeLessThan(c.options.length);
  expect(unique(c.options), c.q).toEqual([]);
}

describe('Sales Prep content', () => {
  it('builds a start day and three ready levels of four weeks: Arabic first, then English', () => {
    expect(LEVELS.map((l) => [l.id, l.status, l.weeks.length])).toEqual([
      ['S0', 'ready', 0],
      ['S1', 'ready', 4],
      ['S2', 'ready', 4],
      ['S3', 'ready', 4],
    ]);
    expect(LEVELS.map((l) => l.lang)).toEqual(['ar', 'ar', 'ar', 'en']);
    for (const l of LEVELS) for (const w of l.weeks) expect(w.lang, w.id).toBe(l.lang);
    expect(PLAN_DAYS[0].day.id).toBe('S0-D1');
    expect(PLAN_DAYS.length).toBe(1 + 12 * 6 + 3);
  });

  it('keeps selling electronics outside the plan, as an extra', () => {
    expect(EXTRA_WEEKS).toHaveLength(4);
    const planLessons = new Set(PLAN_DAYS.flatMap((d) => d.day.tasks.filter((t) => t.kind === 'lesson').map((t) => t.ref)));
    for (const l of EXTRA_LESSONS) expect(planLessons.has(l.id), l.id).toBe(false);
    for (const w of EXTRA_WEEKS) expect(w.lang, w.id).toBe('ar');
  });

  it('gives every week what its six days need', () => {
    for (const w of weeks) {
      const c = w.content;
      expect([c.lessons.length, c.listens.length, c.drills.length, c.roleplays.length, c.speaking.length], w.id).toEqual([5, 3, 2, 2, 3]);
      expect(c.mission.how.length, w.id).toBeGreaterThanOrEqual(3);
      expect(w.days.map((d) => d.id), w.id).toEqual([1, 2, 3, 4, 5, 6].map((n) => `${w.id}-D${n}`));
      if (w.lang === 'en') expect(c.words, w.id).toHaveLength(12);
      else expect(c.words, w.id).toBeUndefined();
    }
  });

  it('has unique ids in every kind of content, and unique day and task ids', () => {
    const all = [...content, ...EXTRA_WEEKS.map((w) => w.content)];
    expect(unique([...ALL_LESSONS, ...EXTRA_LESSONS].map((l) => l.id))).toEqual([]);
    expect(unique(all.flatMap((c) => c.listens.map((x) => x.id)))).toEqual([]);
    expect(unique(all.flatMap((c) => c.drills.map((x) => x.id)))).toEqual([]);
    expect(unique([...all.flatMap((c) => c.roleplays.map((x) => x.id)), ...EXAM_ROLEPLAYS.map((r) => r.id)])).toEqual([]);
    expect(unique(all.map((c) => c.mission.id))).toEqual([]);
    expect(unique([...all.flatMap((c) => c.speaking.map((x) => x.id)), ...EXAM_SPEAKING.map((s) => s.id)])).toEqual([]);
    expect(unique(PLAN_DAYS.map((d) => d.day.id))).toEqual([]);
    expect(unique(PLAN_DAYS.flatMap((d) => d.day.tasks.map((t) => t.id)))).toEqual([]);
    expect(unique(weeks.flatMap((w) => w.content.words?.map((x) => x.word) ?? []))).toEqual([]);
  });

  it('points every task at something that exists', () => {
    for (const { day } of PLAN_DAYS) {
      for (const t of day.tasks) {
        expect(t.id, t.id).toBe(`${day.id}:${t.kind}:${t.ref}`);
        const found = {
          lesson: () => getLesson(t.ref),
          listen: () => getListen(t.ref),
          drill: () => getDrill(t.ref),
          roleplay: () => getRoleplay(t.ref),
          mission: () => getMission(t.ref),
          speak: () => getSpeak(t.ref),
          words: () => getWeek(t.ref)?.content.words,
          review: () => getWeek(t.ref) ?? LEVELS.find((l) => l.id === t.ref),
          quiz: () => buildQuiz(t.ref),
          journal: () => (/^d[1-5]$|^start$|^exam$/.test(t.ref) ? t.ref : undefined),
          knowledge: () => getChapter(t.ref),
        }[t.kind]();
        expect(found, t.id).toBeTruthy();
      }
    }
  });

  it('keeps each day around an hour', () => {
    for (const { day } of PLAN_DAYS) {
      const minutes = day.tasks.reduce((m, t) => m + t.minutes, 0);
      expect(minutes, day.id).toBeGreaterThanOrEqual(35);
      expect(minutes, day.id).toBeLessThanOrEqual(100);
    }
  });

  it('has lessons with a few points, mistakes and valid checks', () => {
    for (const l of [...ALL_LESSONS, ...EXTRA_LESSONS]) {
      expect(l.points.length, l.id).toBeGreaterThanOrEqual(3);
      expect(l.points.length, l.id).toBeLessThanOrEqual(5);
      expect(l.mistakes.length, l.id).toBeGreaterThanOrEqual(1);
      expect(l.check.length, l.id).toBeGreaterThanOrEqual(2);
      expect(l.check.length, l.id).toBeLessThanOrEqual(3);
      l.check.forEach(validChoice);
    }
  });

  it('writes the Arabic weeks in Arabic and the English weeks in English (Arabic only in noteAr, ar and translation drills)', () => {
    for (const w of weeks) {
      const text = JSON.stringify(
        {
          ...w.content,
          words: w.content.words?.map((word) => ({ ...word, ar: undefined })),
          // "Say it in sales English" gives Arabic lines to translate.
          drills: w.content.drills.filter((d) => d.id !== 'arabic-to-sales-english'),
        },
        (key, value: unknown) => (key === 'noteAr' ? undefined : value)
      );
      if (w.lang === 'ar') {
        for (const l of w.content.lessons) expect(ARABIC.test(l.summary), l.id).toBe(true);
      } else {
        expect(ARABIC.test(text), w.id).toBe(false);
        for (const l of w.content.lessons) expect(ARABIC.test(l.noteAr ?? ''), l.id).toBe(true);
        for (const word of w.content.words ?? []) {
          expect(ARABIC.test(word.ar), word.word).toBe(true);
          expect(word.definition.endsWith('.'), word.word).toBe(true);
        }
      }
      expect(ARABIC.test(w.noteAr), w.id).toBe(true);
    }
  });

  it('links listening tasks safely, with questions to answer', () => {
    for (const c of content) {
      for (const x of c.listens) {
        expect(x.url, x.id).toMatch(/^https:\/\//);
        if (x.videoId) expect(x.url, x.id).toContain(x.videoId);
        expect(x.questions.length, x.id).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('gives drills a model for every item, role-plays a checklist, and missions questions', () => {
    for (const c of content) {
      for (const d of c.drills) {
        expect(d.items.length, d.id).toBeGreaterThanOrEqual(2);
        for (const item of d.items) expect(item.model.length, item.prompt).toBeGreaterThan(5);
      }
      for (const r of c.roleplays) expect(r.steps.length, r.id).toBeGreaterThanOrEqual(4);
      expect(c.mission.reflect.length, c.mission.id).toBeGreaterThanOrEqual(2);
    }
    expect(JOURNAL_PROMPTS.ar).toHaveLength(5);
    expect(JOURNAL_PROMPTS.en).toHaveLength(5);
  });

  it('compares the exam recordings with a speaking prompt that exists', () => {
    const compared = EXAM_SPEAKING.filter((s) => s.compareWith);
    expect(compared.length).toBeGreaterThan(0);
    for (const s of compared) expect(getSpeak(s.compareWith!), s.id).toBeTruthy();
  });

  it('builds every quiz in the plan', () => {
    const quizIds = PLAN_DAYS.flatMap((d) => d.day.tasks.filter((t) => t.kind === 'quiz').map((t) => t.ref));
    expect(quizIds).toContain(DIAGNOSTIC_ID);
    for (const id of quizIds) {
      const quiz = buildQuiz(id, 7)!;
      expect(quiz, id).toBeTruthy();
      expect(quiz.questions.length, id).toBeGreaterThanOrEqual(10);
      quiz.questions.forEach(validChoice);
      expect(quiz.pass, id).toBe(id === DIAGNOSTIC_ID ? 0 : 80);
    }
  });

  it('has library sources with safe links', () => {
    expect(unique(SALES_SOURCES.map((s) => s.id))).toEqual([]);
    for (const s of SALES_SOURCES) {
      expect(s.url, s.id).toMatch(/^https:\/\//);
      expect(ARABIC.test(s.whyAr), s.id).toBe(true);
    }
    expect(SALES_SOURCES.some((s) => s.lang === 'ar' && s.start)).toBe(true);
  });
});

describe('Sales Prep knowledge', () => {
  const chapters = KNOWLEDGE.flatMap((b) => b.chapters);

  it('has four books of real, sourced chapters', () => {
    expect(KNOWLEDGE.map((b) => b.id)).toEqual(['sales', 'negotiation', 'marketing', 'psychology']);
    expect(unique(chapters.map((c) => c.id))).toEqual([]);
    for (const c of chapters) {
      expect(ARABIC.test(c.idea), c.id).toBe(true);
      expect(c.sections.length, c.id).toBeGreaterThanOrEqual(3);
      expect(c.sections.length, c.id).toBeLessThanOrEqual(5);
      expect(c.inLife.length, c.id).toBeGreaterThan(30);
      expect(c.tryIt.length, c.id).toBeGreaterThan(15);
      expect(c.source.length, c.id).toBeGreaterThan(10);
      expect(c.check.length, c.id).toBe(2);
      c.check.forEach(validChoice);
    }
  });

  it('puts every chapter in the plan once: sales and psychology in Level 1, marketing and negotiation in Level 2', () => {
    const inLevel = (id: string) => PLAN_DAYS.filter((d) => d.level.id === id).flatMap((d) => d.day.tasks.filter((t) => t.kind === 'knowledge').map((t) => t.ref));
    const all = [...inLevel('S1'), ...inLevel('S2'), ...inLevel('S3')];
    expect(unique(all)).toEqual([]);
    expect([...all].sort()).toEqual(ALL_CHAPTERS.map((c) => c.id).sort());
    expect(new Set(inLevel('S1').map((id) => getChapter(id)!.book.id))).toEqual(new Set(['sales', 'psychology']));
    expect(new Set(inLevel('S2').map((id) => getChapter(id)!.book.id))).toEqual(new Set(['marketing', 'negotiation']));
  });

  it('asks the chapters\' questions in the weekly quiz', () => {
    const quiz = buildQuiz('S2-W1-QUIZ', 3)!.questions.map((q) => q.q);
    for (const id of getWeek('S2-W1')!.content.knowledge!) for (const c of getChapter(id)!.chapter.check) expect(quiz, id).toContain(c.q);
  });
});

import { describe, expect, it } from 'vitest';
import { LEVELS, PLAN_DAYS, getWeek } from '../../data/sales/plan';
import { currentDayIndex, dayDone, daysDone, daysLeft, journalCount, levelProgress, minutesOn, planProgress, setTasks, type TaskLog } from './progress';
import { buildQuiz, seeded, shuffleOptions, wordQuestions } from './quiz';
import { roleplayPrompt } from './prompts';
import { taskTitle } from './tasks';

const doneDays = (n: number): TaskLog =>
  Object.fromEntries(PLAN_DAYS.slice(0, n).flatMap(({ day }) => day.tasks.map((t) => [t.id, '2026-10-20'])));

describe('Sales Prep progress', () => {
  it('starts on the first day and moves on when a day is finished', () => {
    expect(currentDayIndex({})).toBe(0);
    expect(currentDayIndex(doneDays(1))).toBe(1);
    expect(PLAN_DAYS[currentDayIndex(doneDays(1))].day.id).toBe('S1-W1-D1');
    // A day with one task left isn't done.
    const log = doneDays(2);
    delete log[PLAN_DAYS[1].day.tasks[0].id];
    expect(currentDayIndex(log)).toBe(1);
  });

  it('stays on the last ready day once everything is done', () => {
    const all = doneDays(PLAN_DAYS.length);
    expect(PLAN_DAYS[currentDayIndex(all)].day.id).toBe('S3-EXAM');
    expect(daysLeft(all)).toBe(0);
    expect(daysDone(all)).toBe(PLAN_DAYS.length);
    expect(planProgress(LEVELS, all).ratio).toBe(1);
  });

  it('counts progress and minutes from the ticked tasks', () => {
    const log = setTasks({}, PLAN_DAYS[0].day.tasks.map((t) => t.id), true, '2026-10-21');
    expect(dayDone(PLAN_DAYS[0].day, log)).toBe(true);
    expect(levelProgress(LEVELS[0], log).ratio).toBe(1);
    expect(minutesOn('2026-10-21', log)).toBe(PLAN_DAYS[0].day.tasks.reduce((m, t) => m + t.minutes, 0));
    expect(minutesOn('2026-10-20', log)).toBe(0);
  });

  it('counts only notebook lines with text', () => {
    expect(journalCount({ 'S0-D1:journal:start': { text: 'why', updatedAt: '' }, 'S1-W1-D1:journal:d1': { text: ' ', updatedAt: '' }, 'S1-W1-D1:listen:x#0': { text: 'a', updatedAt: '' } })).toBe(1);
  });
});

describe('Sales Prep quizzes', () => {
  it('keeps the right answer when the options move', () => {
    const q = { q: 'x', options: ['a', 'b', 'c', 'd'], answer: 2 };
    for (let s = 1; s < 20; s++) {
      const moved = shuffleOptions(q, seeded(s));
      expect(moved.options[moved.answer]).toBe('c');
      expect([...moved.options].sort()).toEqual(['a', 'b', 'c', 'd']);
    }
  });

  it('asks every word of an English week, with its definition as the answer', () => {
    const words = getWeek('S3-W1')!.content.words!;
    const qs = wordQuestions(words, seeded(3));
    expect(qs).toHaveLength(12);
    qs.forEach((q, i) => expect(q.options[q.answer]).toBe(words[i].definition));
  });

  it('builds the weekly quiz from the week, and a new exam sample each attempt', () => {
    const quiz = buildQuiz('S1-W2-QUIZ', 1)!;
    const checks = getWeek('S1-W2')!.content.lessons.flatMap((l) => l.check);
    expect(quiz.questions).toHaveLength(checks.length);
    expect(buildQuiz('S3-W1-QUIZ', 1)!.questions.length).toBe(getWeek('S3-W1')!.content.lessons.flatMap((l) => l.check).length + 12);
    const a = buildQuiz('S1-EXAM', 1)!.questions.map((q) => q.q);
    const b = buildQuiz('S1-EXAM', 2)!.questions.map((q) => q.q);
    expect(a).toHaveLength(25);
    expect(a).not.toEqual(b);
    expect(buildQuiz('nope')).toBeNull();
  });

  it('names tasks and writes role-play prompts in the week language', () => {
    const t = PLAN_DAYS.find((d) => d.day.id === 'S3-W1-D1')!.day.tasks.find((x) => x.kind === 'words')!;
    expect(taskTitle(t, 'en')).toBe('12 sales words for your flashcards');
    const rp = getWeek('S1-W1')!.content.roleplays[0];
    expect(roleplayPrompt(rp, 'ar')).toContain(rp.youSell);
    expect(roleplayPrompt(getWeek('S3-W1')!.content.roleplays[0], 'en')).toMatch(/^Let's do a sales role-play/);
  });
});

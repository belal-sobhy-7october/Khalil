import { describe, expect, it } from 'vitest';
import { LEVELS, PLAN_DAYS, getPhraseSet, getScenario } from '../../data/callCenter';
import { analyzeSamples, wordsPerMinute } from './audio';
import { canOpenCallCenter, emailHash } from './access';
import {
  CALL_RUBRIC, accuracyPoints, normalizeWords, rubricPercent, speakingPercent, typingPoints, typingStats, wordAccuracy,
} from './grading';
import { roleplayPrompt } from './prompts';
import {
  addAttempt, currentDayIndex, dayDone, efsetLevel, minutesOn, setTasks, studyStreak, type TaskLog,
} from './progress';
import { buildVocabCheck, buildWeeklyQuiz, chunk, estimateGrammarLevel, getTest, itemWeight, seeded, shuffle, vocabItems } from './quiz';
import { takesToPrune } from './recordings';
import { VOCAB_UNITS, VOCAB_WORDS } from '../../data/callCenter';
import type { VocabularyItem } from '../../types';
import { bankCards, sprintDay, unitStatus, vocabProgress } from './vocab';

describe('grading', () => {
  it('compares words without punctuation, contractions or digits getting in the way', () => {
    expect(normalizeWords("I've sent it, it's 30 dollars!")).toEqual(['i', 'have', 'sent', 'it', 'it', 'is', 'thirty', 'dollars']);
    expect(wordAccuracy('Your refund will arrive in five business days.', 'your refund will arrive in 5 business days')).toBe(1);
    expect(wordAccuracy('Let me check that for you right now.', 'let me check that for you')).toBeCloseTo(0.75, 2);
    expect(wordAccuracy('Please restart the router.', '')).toBe(0);
  });

  it('gives Versant-like partial credit', () => {
    expect(accuracyPoints(1)).toBe(1);
    expect(accuracyPoints(0.8)).toBe(0.5);
    expect(accuracyPoints(0.5)).toBe(0);
  });

  it('measures typing speed and accuracy', () => {
    const s = typingStats('hello world', 'hello world', 6);
    expect(s.accuracy).toBe(100);
    expect(s.wpm).toBe(22); // 11 correct characters = 2.2 words in 0.1 minute
    expect(typingStats('abcd', 'abxd', 60).accuracy).toBe(75);
    expect(typingPoints({ wpm: 40, accuracy: 96 }, 35, 95)).toBe(1);
    expect(typingPoints({ wpm: 20, accuracy: 96 }, 40, 95)).toBe(0.5);
  });

  it('turns rubric scores into a percentage', () => {
    const all = Object.fromEntries(CALL_RUBRIC.map((c) => [c.id, 2]));
    expect(rubricPercent(all, CALL_RUBRIC)).toBe(100);
    expect(rubricPercent({ ...all, opening: 0, closing: 1 }, CALL_RUBRIC)).toBe(81);
    expect(speakingPercent({ fluency: 5, pronunciation: 4, grammar: 3, vocabulary: 4, structure: 4 })).toBe(80);
  });
});

describe('quizzes', () => {
  const week = LEVELS[1].weeks[0];

  it('builds the same quiz for the same attempt, and a new mix for a retake', () => {
    const a = buildWeeklyQuiz(week, 0);
    expect(buildWeeklyQuiz(week, 0)).toEqual(a);
    expect(JSON.stringify(buildWeeklyQuiz(week, 1).items)).not.toBe(JSON.stringify(a.items));
  });

  it("draws a weekly quiz from the week's lessons, with every kind of item", () => {
    const quiz = buildWeeklyQuiz(week, 0);
    const types = new Set(quiz.items.map((i) => i.type));
    for (const t of ['mcq', 'dictation', 'repeat', 'build', 'listen', 'speak', 'typing']) expect(types.has(t as never), t).toBe(true);
    for (const item of quiz.items) {
      if (item.type === 'mcq') {
        expect(item.answer).toBeGreaterThanOrEqual(0);
        expect(item.options[item.answer]).toBeDefined();
        expect(new Set(item.options).size).toBe(item.options.length);
      }
      if (item.type === 'listen') expect(week.content.scripts).toContain(item.scriptId);
    }
    const phrases = week.content.phraseSets.flatMap((id) => getPhraseSet(id)?.phrases.map((p) => p.text.replace(/[.?!]$/, '')) ?? []);
    for (const item of quiz.items) if (item.type === 'build') expect(phrases).toContain(item.chunks.join(' '));
  });

  it('finds every test by id', () => {
    expect(getTest('L0-DIAG')?.kind).toBe('diagnostic');
    expect(getTest('L1-W2-QUIZ')?.kind).toBe('weekly');
    const exam = getTest('L3-EXAM');
    expect(exam?.kind).toBe('level');
    expect(exam?.items.some((i) => i.type === 'call' && !!getScenario(i.scenarioId))).toBe(true);
    expect(getTest('nope')).toBeNull();
  });

  it('weighs calls and speaking more than single questions', () => {
    expect(itemWeight({ type: 'call', skill: 'calls', scenarioId: 'r-ops-mock-call' })).toBe(3);
    expect(itemWeight({ type: 'listen', skill: 'listening', scriptId: 's-no-internet' })).toBe(3);
    expect(itemWeight({ type: 'dictation', skill: 'listening', text: 'x' })).toBe(1);
  });

  it('splits sentences into chunks and shuffles reproducibly', () => {
    expect(chunk('I will send you a confirmation email in a few minutes.')).toEqual(['I will send you', 'a confirmation email', 'in a few minutes']);
    expect(chunk('Thanks, Mr. Johnson. What can I do for you today?')).toEqual(['Thanks, Mr. Johnson.', 'What can I do', 'for you today']);
    expect(chunk('Hello there.')).toEqual(['Hello', 'there']);
    expect(shuffle([1, 2, 3, 4, 5], seeded('x'))).toEqual(shuffle([1, 2, 3, 4, 5], seeded('x')));
  });

  it('estimates a grammar level from the diagnostic bands', () => {
    expect(estimateGrammarLevel([3, 1, 0])).toBe('A2–B1');
    expect(estimateGrammarLevel([5, 2, 0])).toBe('B1');
    expect(estimateGrammarLevel([5, 4, 1])).toBe('B2');
    expect(estimateGrammarLevel([5, 5, 4])).toBe('C1');
  });
});

describe('progress', () => {
  it('starts with the diagnostic and moves on once a day is done', () => {
    expect(currentDayIndex({})).toBe(0);
    const first = PLAN_DAYS[0].day;
    const log = setTasks({}, first.tasks.map((t) => t.id), true, '2026-10-17');
    expect(dayDone(first, log)).toBe(true);
    expect(PLAN_DAYS[currentDayIndex(log)].day.id).toBe('L1-W1-D1');
  });

  it('counts minutes and the streak from the days tasks were done', () => {
    const [a, b] = PLAN_DAYS[0].day.tasks;
    const log: TaskLog = { [a.id]: '2026-10-16', [b.id]: '2026-10-17' };
    expect(minutesOn('2026-10-17', log)).toBe(b.minutes);
    expect(studyStreak(log, '2026-10-17')).toBe(2);
    expect(studyStreak(log, '2026-10-19')).toBe(0);
  });

  it('keeps the last 20 attempts of a test', () => {
    let log = {};
    for (let i = 0; i < 25; i++) log = addAttempt(log, 'T', { date: 'd', percent: i, passed: false, skills: {} });
    expect((log as Record<string, unknown[]>).T).toHaveLength(20);
  });

  it("maps EF SET scores to EF's CEFR bands", () => {
    expect(efsetLevel(45)).toBe('B1');
    expect(efsetLevel(55)).toBe('B2');
    expect(efsetLevel(61)).toBe('C1');
    expect(efsetLevel(80)).toBe('C2');
  });
});

describe('voice recordings', () => {
  const rate = 8000;
  const tone = (seconds: number) => Float32Array.from({ length: seconds * rate }, (_, i) => 0.3 * Math.sin(i / 3));
  const silence = (seconds: number) => new Float32Array(seconds * rate);
  const join = (...parts: Float32Array[]) => {
    const out = new Float32Array(parts.reduce((n, p) => n + p.length, 0));
    let at = 0;
    for (const p of parts) {
      out.set(p, at);
      at += p.length;
    }
    return out;
  };

  it('finds long pauses between words, but not the silence around them', () => {
    const stats = analyzeSamples(join(silence(1), tone(2), silence(2), tone(2), silence(0.5), tone(1), silence(1)), rate);
    expect(stats.longPauses).toBe(1);
    expect(stats.longestPause).toBeCloseTo(2, 0);
    expect(stats.leadIn).toBeCloseTo(1, 0);
    expect(stats.speechSeconds).toBeCloseTo(7.5, 0);
    expect(stats.tooQuiet).toBe(false);
  });

  it('flags a silent recording', () => {
    expect(analyzeSamples(silence(3), rate).tooQuiet).toBe(true);
    expect(wordsPerMinute(150, 60)).toBe(150);
  });

  it('keeps the first take and the five latest', () => {
    const takes = Array.from({ length: 8 }, (_, i) => ({ id: `t${i}`, createdAt: `2026-10-${String(10 + i).padStart(2, '0')}` }));
    expect(takesToPrune(takes)).toEqual(['t1', 't2']);
    expect(takesToPrune(takes.slice(0, 6))).toEqual([]);
  });
});

describe('access and prompts', () => {
  it('hashes emails the same way whatever the case or spaces', async () => {
    expect(await emailHash(' Someone@Example.com ')).toBe(await emailHash('someone@example.com'));
    expect(await emailHash('someone@example.com')).toMatch(/^[0-9a-f]{64}$/);
  });

  it("doesn't open the section for other accounts", async () => {
    expect(await canOpenCallCenter('someone@example.com')).toBe(false);
    expect(await canOpenCallCenter(null)).toBe(false);
  });

  it('writes a role-play prompt with the persona and the matching rubric', () => {
    const call = getScenario('r-no-internet-elderly');
    const interview = getScenario('r-hr-screening');
    if (!call || !interview) throw new Error('missing scenarios');
    expect(roleplayPrompt(call)).toContain(call.persona);
    expect(roleplayPrompt(call)).toContain('end call');
    expect(roleplayPrompt(call)).toContain('Opening');
    expect(roleplayPrompt(interview)).toContain('end interview');
    expect(roleplayPrompt(interview)).toContain('Structure');
  });
});

describe('the word bank', () => {
  const card = (word: string, masteryLevel: number, lastReviewedAt?: string): VocabularyItem => ({
    id: `id-${word}`, userId: 'u', word, type: 'word', definition: 'd', masteryLevel, reviewCount: 1, lapseCount: 0, correctStreak: masteryLevel,
    isHard: false, lastReviewedAt, createdAt: '2026-10-01', updatedAt: '2026-10-01',
  });

  it('reads progress from the flashcards, whatever the case of the word', () => {
    const unit = VOCAB_UNITS[0];
    const items = [card('Agent', 3, '2026-10-16T10:00:00Z'), card('queue', 1, '2026-10-01T10:00:00Z'), card('not in the bank', 5)];
    const p = vocabProgress(items, new Date('2026-10-17T12:00:00Z'));
    expect(p.total).toBe(384);
    expect(p.added).toBe(2);
    expect(p.known).toBe(1);
    expect(p.due).toEqual(['id-queue']);
    expect(unitStatus(unit, bankCards(items))).toMatchObject({ added: 2, known: 1, total: 16 });
  });

  it('counts the days of the month from the day it started', () => {
    expect(sprintDay(undefined, '2026-10-17')).toBe(0);
    expect(sprintDay('2026-10-17', '2026-10-17')).toBe(1);
    expect(sprintDay('2026-10-01', '2026-10-30')).toBe(30);
  });

  it('asks about a word with options of the same kind, one of them right', () => {
    const items = vocabItems(VOCAB_WORDS, 30, seeded('v'));
    expect(items).toHaveLength(30);
    for (const item of items) {
      if (item.type !== 'mcq') throw new Error('not a question');
      expect(new Set(item.options).size).toBe(4);
      const word = VOCAB_WORDS.find((w) => w.word === item.options[item.answer]);
      expect(word).toBeDefined();
      if (item.q.startsWith('Complete')) expect(item.q).toContain('_____');
      else expect(item.q).toContain(word?.definition);
    }
  });

  it('checks the bank with 40 questions and a 90% pass mark', () => {
    const check = buildVocabCheck(0);
    expect(check.items).toHaveLength(40);
    expect(check.pass).toBe(90);
    expect(getTest('VOCAB-CHECK', 1)?.items).not.toEqual(check.items);
    expect(buildWeeklyQuiz(LEVELS[1].weeks[0], 0).items.filter((i) => i.skill === 'vocabulary' && i.type === 'mcq' && /means|Complete/.test(i.q)).length).toBeGreaterThanOrEqual(4);
  });
});

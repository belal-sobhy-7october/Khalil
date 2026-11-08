import { describe, expect, it } from 'vitest';
import {
  GRAMMAR, LEVELS, PHRASE_SETS, PLAN_DAYS, QUESTIONS, SCENARIOS, SCRIPTS, SOUNDS, TYPING_TEXTS, VIDEOS, VOICE_PROMPTS,
  getGrammar, getPhraseSet, getQuestion, getScenario, getScript, getSound, getTypingText, getVocabUnit, getVoicePrompt, getWeek,
} from '.';
import { CALL_CENTER_LIBRARY } from './catalog';
import { CALL_CENTER_EPISODES } from './episodes';
import { CALL_CENTER_SECTION } from './library';
import { DIAGNOSTIC, LEVEL_EXAMS, RETELL_STORIES, WRITING_TASKS } from './tests';
import { DEBRIEF, HIRING_STAGES } from './resources';
import { VOCAB_CHECK_ID } from './plan';
import { GRAMMAR_COURSES, getGrammarLesson } from './ibrahimAdel';
import { CALL_CENTER_ACCENT_SECTION } from './library';
import { VOCAB_UNITS, VOCAB_WORDS } from './vocab';
import { MEANINGS_AR, UNIT_TITLES_AR } from './vocabAr';
import { QUESTIONS_AR } from './interviewAr';
import type { PlanTask, TestItem } from './types';

const ARABIC = /[؀-ۿ]/;
const unique = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);

describe('Call Center Prep content', () => {
  it('has unique ids in every bank', () => {
    for (const list of [SOUNDS, PHRASE_SETS, GRAMMAR, SCRIPTS, SCENARIOS, QUESTIONS, VOICE_PROMPTS, TYPING_TEXTS]) {
      expect(unique(list.map((x) => x.id))).toEqual([]);
    }
  });

  it('keeps the lessons in English (Arabic only in the tips meant for it)', () => {
    const english = [...SOUNDS, ...PHRASE_SETS, ...GRAMMAR, ...SCRIPTS, ...SCENARIOS, ...QUESTIONS, ...VOICE_PROMPTS, ...TYPING_TEXTS];
    const withoutTips = (x: object) => JSON.stringify(x, (key, value: unknown) => (key === 'tipAr' ? undefined : value));
    const withArabic = english.filter((x) => ARABIC.test(withoutTips(x))).map((x) => x.id);
    expect(withArabic).toEqual([]);
  });

  it('gives every sound a how-to, an Arabic tip, YouGlish words and two drills', () => {
    for (const s of SOUNDS) {
      expect(s.how.length, s.id).toBeGreaterThan(20);
      expect(ARABIC.test(s.tipAr), s.id).toBe(true);
      expect(s.words.length, s.id).toBeGreaterThanOrEqual(4);
      expect(s.drills.length, s.id).toBeGreaterThanOrEqual(2);
    }
  });

  it('has phrase sets of eight different phrases, each with a use', () => {
    for (const set of PHRASE_SETS) {
      expect(set.phrases.length, set.id).toBe(8);
      expect(unique(set.phrases.map((p) => p.text)), set.id).toEqual([]);
      for (const p of set.phrases) expect(p.use, p.text).not.toBe('');
    }
  });

  it('has grammar points with valid exercises', () => {
    for (const g of GRAMMAR) {
      expect(g.points.length, g.id).toBeGreaterThanOrEqual(3);
      expect(g.exercises, g.id).toHaveLength(8);
      for (const e of g.exercises) {
        expect(e.answer, e.q).toBeGreaterThanOrEqual(0);
        expect(e.answer, e.q).toBeLessThan(e.options.length);
        expect(unique(e.options), e.q).toEqual([]);
      }
    }
  });

  it('has model calls with valid comprehension questions', () => {
    for (const s of SCRIPTS) {
      expect(s.lines.length, s.id).toBeGreaterThanOrEqual(6);
      expect(s.questions.length, s.id).toBe(3);
      for (const q of s.questions) expect(q.options[q.answer], q.q).toBeDefined();
    }
  });

  it('translates every interview question into Arabic, with what it checks', () => {
    expect(Object.keys(QUESTIONS_AR).sort()).toEqual(QUESTIONS.map((q) => q.id).sort());
    for (const { q, why } of Object.values(QUESTIONS_AR)) {
      expect(q).toMatch(ARABIC);
      expect(why).toMatch(ARABIC);
    }
  });

  it('has a full interview bank', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(40);
    for (const q of QUESTIONS) {
      expect(q.answer.split(' ').length, q.id).toBeGreaterThanOrEqual(20);
      expect(q.tips.length, q.id).toBeGreaterThan(0);
      expect(q.phrases.length, q.id).toBeGreaterThan(0);
      expect(q.mistakes.length, q.id).toBeGreaterThan(0);
    }
  });

  it('only has characters you can type in the typing tests', () => {
    for (const t of TYPING_TEXTS) expect(t.text, t.id).toMatch(/^[\x20-\x7E]+$/);
  });

  it('knows the title and length of every video', () => {
    for (const [id, v] of Object.entries(VIDEOS)) {
      expect(id).toMatch(/^[\w-]{11}$/);
      expect(v.seconds, id).toBeGreaterThan(60);
      expect(v.title, id).not.toBe('');
    }
  });
});

describe('the plan', () => {
  it('has levels 0–3 ready (4, 6 and 4 weeks) and 4–5 outlined', () => {
    expect(LEVELS.map((l) => l.id)).toEqual(['L0', 'L1', 'L2', 'L3', 'L4', 'L5']);
    expect(LEVELS.map((l) => l.status)).toEqual(['ready', 'ready', 'ready', 'ready', 'planned', 'planned']);
    expect(LEVELS.map((l) => l.weeks.length)).toEqual([0, 4, 6, 4, 0, 0]);
    for (const l of LEVELS.filter((x) => x.status === 'planned')) expect(l.outline?.length, l.id).toBeGreaterThanOrEqual(4);
  });

  it('gives every week six days and its own weekly quiz', () => {
    for (const w of LEVELS.flatMap((l) => l.weeks)) {
      expect(w.days, w.id).toHaveLength(6);
      expect(w.days[5].tasks.some((t) => t.kind === 'test' && t.ref === w.quizId), w.id).toBe(true);
      expect(getWeek(w.id)).toBe(w);
    }
  });

  it('starts with the diagnostic and ends each level with its exam', () => {
    expect(PLAN_DAYS[0].day.id).toBe('L0-D1');
    for (const l of LEVELS.filter((x) => x.examId)) {
      const days = PLAN_DAYS.filter((d) => d.level.id === l.id);
      expect(days.at(-1)?.day.id).toBe(`${l.id}-EXAM`);
    }
  });

  it('has unique task ids', () => {
    expect(unique(PLAN_DAYS.flatMap(({ day }) => day.tasks.map((t) => t.id)))).toEqual([]);
  });

  const resolves = (t: PlanTask): boolean => {
    switch (t.kind) {
      case 'sound':
        return t.ref.split(',').every((id) => !!getSound(id));
      case 'watch':
        return !!VIDEOS[t.ref];
      case 'phrases':
        return !!getPhraseSet(t.ref);
      case 'grammar':
        return !!getGrammar(t.ref);
      case 'shadow':
        return !!getScript(t.ref);
      case 'roleplay':
        return !!getScenario(t.ref);
      case 'interview':
        return !!getQuestion(t.ref);
      case 'voice':
        return !!getVoicePrompt(t.ref);
      case 'typing':
        return !!getTypingText(t.ref);
      case 'test':
        return t.ref === VOCAB_CHECK_ID || t.ref === DIAGNOSTIC.id || LEVEL_EXAMS.some((e) => e.id === t.ref) || !!getWeek(t.ref.replace(/-QUIZ$/, ''));
      case 'review':
        return !!getWeek(t.ref) || /^L\d-mistakes$/.test(t.ref);
      case 'link':
        return t.ref === 'efset';
      case 'vocab':
        return t.ref === 'due' || !!getVocabUnit(t.ref);
      case 'lesson':
        return !!getGrammarLesson(t.ref);
    }
  };

  it('points every task at content that exists', () => {
    const broken = PLAN_DAYS.flatMap(({ day }) => day.tasks).filter((t) => !resolves(t)).map((t) => t.id);
    expect(broken).toEqual([]);
  });

  it('uses every sound, phrase set, grammar point, call and role-play at least once', () => {
    const weeks = LEVELS.flatMap((l) => l.weeks);
    const used = (pick: (c: (typeof weeks)[number]['content']) => string[]) => new Set(weeks.flatMap((w) => pick(w.content)));
    const sounds = used((c) => c.sounds);
    const sets = used((c) => c.phraseSets);
    const grammar = used((c) => [c.grammar]);
    const scripts = used((c) => c.scripts);
    const scenarios = used((c) => c.scenarios);
    expect(SOUNDS.filter((s) => !sounds.has(s.id)).map((s) => s.id)).toEqual([]);
    expect(PHRASE_SETS.filter((s) => !sets.has(s.id)).map((s) => s.id)).toEqual([]);
    expect(GRAMMAR.filter((g) => !grammar.has(g.id)).map((g) => g.id)).toEqual([]);
    expect(SCRIPTS.filter((s) => !scripts.has(s.id)).map((s) => s.id)).toEqual([]);
    expect(SCENARIOS.filter((s) => !scenarios.has(s.id)).map((s) => s.id)).toEqual([]);
  });
});

describe('tests and resources', () => {
  const valid = (item: TestItem): boolean => {
    switch (item.type) {
      case 'mcq':
        return item.answer >= 0 && item.answer < item.options.length;
      case 'listen':
        return !!getScript(item.scriptId);
      case 'typing':
        return !!getTypingText(item.textId);
      case 'call':
        return !!getScenario(item.scenarioId);
      case 'build':
        return item.chunks.length >= 3;
      default:
        return true;
    }
  };

  it('has a diagnostic test made of valid items', () => {
    expect(DIAGNOSTIC.items.filter((i) => !valid(i))).toEqual([]);
    // The level estimate reads the first 15 items as five B1, five B2 and five C1 grammar questions.
    expect(DIAGNOSTIC.items.slice(0, 15).every((i) => i.type === 'mcq' && i.skill === 'grammar')).toBe(true);
  });

  it('has valid level exam extras', () => {
    for (const e of LEVEL_EXAMS) expect(e.extra.filter((i) => !valid(i)), e.id).toEqual([]);
    expect(RETELL_STORIES.every((s) => s.points.length >= 3)).toBe(true);
    expect(WRITING_TASKS.every((w) => w.checklist.length >= 3)).toBe(true);
  });

  it('has a debrief for every hiring stage', () => {
    for (const s of HIRING_STAGES) expect(DEBRIEF[s.id]?.length, s.id).toBeGreaterThan(0);
  });

  it('has the episodes of every library playlist', () => {
    for (const source of CALL_CENTER_LIBRARY.sources) {
      for (const p of source.playlists) expect(CALL_CENTER_EPISODES[p.id]?.length ?? 0, p.name).toBeGreaterThan(0);
    }
    expect(CALL_CENTER_SECTION.sources.every((s) => s.groups.every((g) => g.lessons.length > 0))).toBe(true);
  });
});

describe('the word bank', () => {
  it('has 24 units of 16 words, no word twice', () => {
    expect(VOCAB_UNITS).toHaveLength(24);
    for (const u of VOCAB_UNITS) expect(u.words, u.id).toHaveLength(16);
    expect(VOCAB_WORDS).toHaveLength(384);
    expect(unique(VOCAB_WORDS.map((w) => w.word.toLowerCase()))).toEqual([]);
  });

  it('gives every word a definition and a call center example, in English', () => {
    for (const w of VOCAB_WORDS) {
      expect(w.definition, w.word).toMatch(/[.)]$/);
      expect(w.example.split(' ').length, w.word).toBeGreaterThanOrEqual(4);
      expect(ARABIC.test(JSON.stringify(w)), w.word).toBe(false);
    }
  });

  it('gives every word and unit its Arabic meaning, and nothing more', () => {
    for (const w of VOCAB_WORDS) expect(MEANINGS_AR[w.word], w.word).toMatch(ARABIC);
    expect(Object.keys(MEANINGS_AR).sort()).toEqual(VOCAB_WORDS.map((w) => w.word).sort());
    expect(Object.keys(UNIT_TITLES_AR).sort()).toEqual(VOCAB_UNITS.map((u) => u.id).sort());
  });

  it('has a text for each unit that uses its words', () => {
    for (const u of VOCAB_UNITS) {
      // Allow "developed" for "develop", "tickets" for "ticket".
      const used = u.words.filter((w) => new RegExp(`\\b${w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(s|es|d|ed|ing)?\\b`, 'i').test(u.text));
      expect(used.length, u.id).toBeGreaterThanOrEqual(8);
      expect(u.text.split(/[.!?] /).length, u.id).toBeGreaterThanOrEqual(4);
    }
  });

  it('puts a unit on every Level 1 day, in order, and a review on the later days', () => {
    const l1 = PLAN_DAYS.filter((d) => d.level.id === 'L1' && d.week).flatMap(({ day }) => day.tasks.filter((t) => t.kind === 'vocab').map((t) => t.ref));
    expect(l1).toEqual(VOCAB_UNITS.map((u) => u.id));
    for (const { day, week } of PLAN_DAYS.filter((d) => (d.level.id === 'L2' || d.level.id === 'L3') && d.week)) {
      const n = Number(day.id.split('-D')[1]);
      expect(day.tasks.some((t) => t.kind === 'vocab' && t.ref === 'due'), day.id).toBe(n <= 5);
      expect(week?.content.vocab).toBeUndefined();
    }
    expect(PLAN_DAYS.find((d) => d.day.id === 'L1-EXAM')?.day.tasks.some((t) => t.ref === VOCAB_CHECK_ID)).toBe(true);
  });
});

describe("Ibrahim Adel's courses", () => {
  it('puts his three grammar playlists into Levels 1, 2 and 3, each lesson once', () => {
    expect(GRAMMAR_COURSES.map((c) => c.level)).toEqual(['L1', 'L2', 'L3']);
    for (const course of GRAMMAR_COURSES) {
      expect(course.lessons.length, course.name).toBeGreaterThan(0);
      const days = PLAN_DAYS.filter((d) => d.level.id === course.level && d.week);
      const scheduled = days.flatMap(({ day }) => day.tasks.filter((t) => t.kind === 'lesson').map((t) => t.ref));
      expect(scheduled).toEqual(course.lessons.slice(0, Math.ceil(days.length / course.every)).map((l) => l.id));
    }
    // Level 1: one lesson every study day.
    expect(PLAN_DAYS.filter((d) => d.level.id === 'L1' && d.week).every(({ day }) => day.tasks.some((t) => t.kind === 'lesson'))).toBe(true);
  });

  it('keeps the accent course out of the plan', () => {
    const accent = new Set(CALL_CENTER_ACCENT_SECTION.sources.flatMap((s) => s.groups.flatMap((g) => g.lessons.map((l) => l.id))));
    expect(accent.size).toBeGreaterThan(20);
    expect(CALL_CENTER_ACCENT_SECTION.sources.map((s) => s.groups.length)).toEqual([3]);
    expect(PLAN_DAYS.flatMap(({ day }) => day.tasks).filter((t) => accent.has(t.ref))).toEqual([]);
    expect(CALL_CENTER_SECTION.sources.map((s) => s.id)).toContain('ibrahim-adel-grammar');
  });
});


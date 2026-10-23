import { describe, expect, it } from 'vitest';
import type { SrsCard, VocabularyItem } from '../types';
import { localDateString } from '../store/dateHelpers';
import {
  DEFAULT_SRS_SETTINGS, LEECH_LAPSES, buildSession, cardOf, dueSummary, forecast, formatWait, gradeOptions, isDue, isHardItem,
  legacyCard, masteryOf, newCard, type SrsGrade,
} from './srs';

const now = new Date('2026-10-22T09:00:00');
const MIN = 60_000;
const DAY = 24 * 60 * MIN;
const at = (ms: number) => new Date(now.getTime() + ms);

const item = (over: Partial<VocabularyItem> = {}): VocabularyItem => ({
  id: 'w', userId: 'u', word: 'word', type: 'word', definition: 'd',
  masteryLevel: 0, reviewCount: 0, lapseCount: 0, correctStreak: 0, isHard: false,
  createdAt: '2026-10-01T10:00:00.000Z', updatedAt: '', ...over,
});

const settings = { retention: DEFAULT_SRS_SETTINGS.retention };
/** Grades the word at `when` (no fuzz) and returns it with its new state. */
function grade(it: VocabularyItem, g: SrsGrade, when: Date): VocabularyItem {
  return { ...it, srs: gradeOptions(it, when, settings, false)[g].card };
}
const waitDays = (card: SrsCard, from: Date) => (Date.parse(card.due) - from.getTime()) / DAY;

describe('grading (FSRS)', () => {
  it('a new word: learning steps for Again/Hard/Good, straight to days for Easy', () => {
    const options = gradeOptions(item(), now, settings, false);
    expect(options[1].wait).toBe(1 * MIN);
    expect(options[2].wait).toBe(6 * MIN);
    expect(options[3].wait).toBe(10 * MIN);
    expect(options[4].wait / DAY).toBeGreaterThanOrEqual(4);
    // The first review starts the word today (it counts against the daily new-word limit).
    for (const g of [1, 2, 3, 4] as SrsGrade[]) expect(options[g].card.introduced).toBe(localDateString(now));
  });

  it('gaps grow with each successful review', () => {
    let w = grade(item(), 3, now); // 10 minutes
    let t = new Date(w.srs!.due);
    w = grade(w, 3, t); // graduates
    expect(w.srs!.state).toBe(2);
    const gaps: number[] = [];
    for (let i = 0; i < 4; i++) {
      gaps.push(waitDays(w.srs!, t));
      t = new Date(w.srs!.due);
      w = grade(w, 3, t);
    }
    expect(gaps[0]).toBeGreaterThanOrEqual(1);
    for (let i = 1; i < gaps.length; i++) expect(gaps[i]).toBeGreaterThan(gaps[i - 1] * 2);
    expect(masteryOf(w.srs!)).toBe(5);
  });

  it('forgetting a learned word sends it back to a 10-minute relearning step and counts a lapse', () => {
    let w = grade(item(), 4, now);
    const t = new Date(w.srs!.due);
    w = grade(w, 1, t);
    expect(w.srs!.state).toBe(3);
    expect(w.srs!.lapses).toBe(1);
    expect(Date.parse(w.srs!.due) - t.getTime()).toBe(10 * MIN);
  });

  it('hard words come back sooner than the same word not marked hard', () => {
    const learned = grade(grade(item(), 3, now), 3, at(10 * MIN));
    const t = new Date(learned.srs!.due);
    const normal = gradeOptions(learned, t, settings, false)[3].wait;
    const starred = gradeOptions({ ...learned, isHard: true }, t, settings, false)[3].wait;
    expect(starred).toBeLessThan(normal);
  });

  it('higher desired retention means shorter gaps', () => {
    const learned = grade(grade(item(), 3, now), 3, at(10 * MIN));
    const t = new Date(learned.srs!.due);
    const at85 = gradeOptions(learned, t, { retention: 0.85 }, false)[3].wait;
    const at95 = gradeOptions(learned, t, { retention: 0.95 }, false)[3].wait;
    expect(at95).toBeLessThan(at85);
  });
});

describe('progress from before the scheduler', () => {
  it('a reviewed word keeps its old due date and strength', () => {
    const card = legacyCard(item({ masteryLevel: 4, reviewCount: 6, lastReviewedAt: new Date(now.getTime() - 3 * DAY).toISOString() }));
    expect(card.state).toBe(2);
    expect(card.stability).toBe(14);
    expect(Math.round(waitDays(card, now))).toBe(11);
  });

  it('a word never reviewed is new; one you kept missing is difficult and due tomorrow', () => {
    expect(legacyCard(item()).state).toBe(0);
    const missed = legacyCard(item({ masteryLevel: 0, reviewCount: 3, lapseCount: 3, lastReviewedAt: now.toISOString() }));
    expect(missed.difficulty).toBe(8);
    expect(waitDays(missed, now)).toBe(1);
  });

  it('a word with a saved state uses it', () => {
    const srs = newCard(now);
    expect(cardOf(item({ srs, masteryLevel: 5, lastReviewedAt: now.toISOString(), reviewCount: 9 }))).toBe(srs);
  });
});

describe('hard words and leeches', () => {
  it('a word you keep missing becomes hard, and stops being hard once it sticks', () => {
    let w = grade(item(), 1, now);
    w = grade(w, 1, at(MIN));
    expect(isHardItem(w)).toBe(true);
    // Many good reviews later it stays in memory for weeks: no longer hard.
    let t = at(2 * MIN);
    for (let i = 0; i < 12 && w.srs!.stability < 21; i++) {
      w = grade(w, 3, t);
      t = new Date(w.srs!.due);
    }
    expect(w.srs!.stability).toBeGreaterThanOrEqual(21);
    expect(isHardItem(w)).toBe(false);
  });

  it(`a word forgotten ${LEECH_LAPSES} times after learning it is a leech, and hard`, () => {
    const srs: SrsCard = { ...newCard(now), state: 2, stability: 30, difficulty: 3, lapses: LEECH_LAPSES, last_review: now.toISOString(), due: at(30 * DAY).toISOString() };
    expect(isHardItem(item({ srs }))).toBe(true);
  });

  it('a starred word is always hard', () => {
    const srs: SrsCard = { ...newCard(now), state: 2, stability: 300, difficulty: 1, last_review: now.toISOString(), due: at(300 * DAY).toISOString() };
    expect(isHardItem(item({ srs, isHard: true }))).toBe(true);
  });
});

describe('sessions', () => {
  const learning = (id: string, minutes: number): VocabularyItem =>
    item({ id, srs: { ...newCard(now), state: 1, stability: 2, difficulty: 5, reps: 1, last_review: now.toISOString(), due: at(minutes * MIN).toISOString() } });
  const review = (id: string, daysOverdue: number, stability = 5): VocabularyItem =>
    item({
      id,
      srs: {
        ...newCard(now), state: 2, stability, difficulty: 5, reps: 3, scheduled_days: stability,
        last_review: new Date(now.getTime() - (stability + daysOverdue) * DAY).toISOString(),
        due: new Date(now.getTime() - daysOverdue * DAY).toISOString(),
      },
    });
  const fresh = (id: string, created: string) => item({ id, createdAt: created });

  it('learning steps first, then reviews (most overdue first) with new words mixed in', () => {
    const items = [review('r-late', 1), fresh('n1', '2026-10-01'), learning('l1', 5), review('r-very-late', 6), fresh('n2', '2026-10-02'), review('r-today', 0)];
    const ids = buildSession(items, now, { newPerDay: 20 }).map((i) => i.id);
    expect(ids[0]).toBe('l1');
    expect(ids.indexOf('r-very-late')).toBeLessThan(ids.indexOf('r-late'));
    expect(ids.indexOf('r-late')).toBeLessThan(ids.indexOf('r-today'));
    expect(ids.indexOf('n1')).toBeLessThan(ids.indexOf('n2'));
    expect(ids).toHaveLength(6);
  });

  it('learning steps due later than the learn-ahead window wait', () => {
    expect(buildSession([learning('soon', 15), learning('later', 45)], now, { newPerDay: 20 }).map((i) => i.id)).toEqual(['soon']);
  });

  it('new words are limited per day, counting the ones already started today', () => {
    const many = Array.from({ length: 50 }, (_, i) => fresh(`n${i}`, `2026-10-0${(i % 9) + 1}`));
    expect(buildSession(many, now, { newPerDay: 20 })).toHaveLength(20);
    const started = Array.from({ length: 15 }, (_, i) =>
      item({ id: `s${i}`, srs: { ...newCard(now), state: 2, stability: 3, reps: 2, introduced: localDateString(now), last_review: now.toISOString(), due: at(3 * DAY).toISOString() } })
    );
    expect(buildSession([...many, ...started], now, { newPerDay: 20 })).toHaveLength(5);
    expect(dueSummary([...many, ...started], now, { newPerDay: 20 }).newToday).toBe(5);
  });

  it('a session is capped', () => {
    const many = Array.from({ length: 100 }, (_, i) => review(`r${i}`, i % 5));
    expect(buildSession(many, now, { newPerDay: 20 })).toHaveLength(30);
  });

  it('due summary and forecast', () => {
    const items = [learning('l', 5), review('r1', 2), review('r2', 0), fresh('n', '2026-10-01'),
      item({ id: 'later', srs: { ...newCard(now), state: 2, stability: 4, reps: 2, last_review: now.toISOString(), due: at(2 * DAY).toISOString() } })];
    const s = dueSummary(items, now, { newPerDay: 20 });
    expect(s).toMatchObject({ learning: 1, review: 2, newToday: 1, newTotal: 1 });
    expect(s.nextAt).toBe(at(2 * DAY).toISOString());
    expect(forecast(items, now, 7)).toEqual([3, 0, 1, 0, 0, 0, 0]);
    expect(isDue(cardOf(items[4]), now)).toBe(false);
  });
});

it('formats waits like Anki', () => {
  const u = { m: 'm', h: 'h', d: 'd', mo: 'mo', y: 'y' };
  expect(formatWait(30_000, u)).toBe('1m');
  expect(formatWait(10 * MIN, u)).toBe('10m');
  expect(formatWait(3 * 60 * MIN, u)).toBe('3h');
  expect(formatWait(2 * DAY, u)).toBe('2d');
  expect(formatWait(45 * DAY, u)).toBe('1.5mo');
  expect(formatWait(800 * DAY, u)).toBe('2.2y');
});

import { beforeEach, describe, expect, it } from 'vitest';
import type { SrsCard } from '../types';
import { mergeSrs, readLocalSrs, writeLocalSrs } from './srsSync';

const card = (lastReview: string, reps = 3): SrsCard => ({
  due: '2026-11-01T10:00:00.000Z', stability: 5, difficulty: 5, scheduled_days: 5, learning_steps: 0,
  reps, lapses: 0, state: 2, last_review: lastReview,
});

beforeEach(() => localStorage.clear());

describe('mergeSrs', () => {
  it('keeps the newer state of each word and sends the ones only this device has', () => {
    const remote = { a: card('2026-10-20T10:00:00Z'), b: card('2026-10-21T10:00:00Z') };
    const local = { a: card('2026-10-22T10:00:00Z'), b: card('2026-10-19T10:00:00Z'), c: card('2026-10-22T09:00:00Z') };
    const { cards, toSend } = mergeSrs(remote, local);
    expect(cards.a).toBe(local.a);
    expect(cards.b).toBe(remote.b);
    expect(cards.c).toBe(local.c);
    expect(toSend.sort()).toEqual(['a', 'c']);
  });

  it('sends nothing when both copies match', () => {
    const remote = { a: card('2026-10-20T10:00:00Z') };
    expect(mergeSrs(remote, { a: card('2026-10-20T10:00:00Z') }).toSend).toEqual([]);
  });

  it('uses this device copy when the server could not be read', () => {
    const local = { a: card('2026-10-20T10:00:00Z') };
    expect(mergeSrs(null, local)).toEqual({ cards: local, toSend: [] });
  });
});

it('keeps a copy on the device', () => {
  writeLocalSrs({ a: card('2026-10-20T10:00:00Z') });
  expect(readLocalSrs().a.reps).toBe(3);
});

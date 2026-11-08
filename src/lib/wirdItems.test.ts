import { describe, expect, it } from 'vitest';
import { BUILTIN_ITEMS, EMPTY_DAY, itemDone, setItemDone, wirdScore, type WirdItem } from './wird';
import { newWirdItem, normalizeWirdItems } from './wirdItems';

describe('normalizeWirdItems', () => {
  it('starts with the built-in items', () => {
    expect(normalizeWirdItems(null).map((i) => i.id)).toEqual(BUILTIN_ITEMS.map((i) => i.id));
  });

  it('keeps the saved order, hidden items, goals and the user\'s own items', () => {
    const items = normalizeWirdItems([
      { id: 'quran', goal: 0.5, inToday: false },
      { id: 'c-1', kind: 'count', name: ' Dhikr ', goal: 100, unit: 'times' },
      { id: 'qiyam', hidden: true, goal: 99 },
      { id: 'c-bad', kind: 'count' },
      { id: 'unknown', kind: 'check', name: 'x' },
    ]);
    expect(items.map((i) => i.id)).toEqual(['quran', 'c-1', 'qiyam', 'prayers', 'rawatib', 'adhkarAM', 'adhkarPM']);
    expect(items[0]).toMatchObject({ goal: 0.5, inToday: false });
    expect(items[1]).toMatchObject({ kind: 'count', name: 'Dhikr', goal: 100, unit: 'times' });
    // A built-in goal can't pass its maximum.
    expect(items[2]).toMatchObject({ hidden: true, goal: 11 });
  });
});

describe('a wird with items of the user\'s own', () => {
  const dhikr = newWirdItem('count', 'Dhikr', 100, 'times');
  const fasting = newWirdItem('check', 'Fasting');

  it('stores their values apart from the built-in ones and marks them done at the goal', () => {
    let day = { ...EMPTY_DAY };
    day = { ...day, ...setItemDone(dhikr, true)(day) };
    day = { ...day, ...setItemDone(fasting, true)(day) };
    expect(day.custom).toEqual({ [dhikr.id]: 100, [fasting.id]: true });
    expect(itemDone(day, dhikr)).toBe(true);
    day = { ...day, ...setItemDone(dhikr, false)(day) };
    expect(itemDone(day, dhikr)).toBe(false);
  });

  it('scores only the items shown, weighted', () => {
    const items: WirdItem[] = [...BUILTIN_ITEMS.map((i) => ({ ...i, hidden: i.id !== 'adhkarAM' })), fasting];
    const day = { ...EMPTY_DAY, adhkarAM: true };
    // Morning adhkar (7.5) done, fasting (10) not.
    expect(wirdScore(day, items)).toBe(Math.round((7.5 / 17.5) * 100));
    expect(wirdScore({ ...day, custom: { [fasting.id]: true } }, items)).toBe(100);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getToday, getWeekStart } from './dateHelpers';

describe('getToday', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the current date in YYYY-MM-DD format', () => {
    vi.setSystemTime(new Date(2024, 0, 15));
    expect(getToday()).toBe('2024-01-15');
  });

  it('zero-pads the month and day', () => {
    vi.setSystemTime(new Date(2024, 2, 5));
    expect(getToday()).toBe('2024-03-05');
  });
});

describe('getWeekStart', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the Monday of the current week for a mid-week date', () => {
    vi.setSystemTime(new Date(2024, 0, 3));
    expect(getWeekStart()).toBe('2024-01-01');
  });

  it('returns the previous Monday when today is Sunday', () => {
    vi.setSystemTime(new Date(2024, 0, 7));
    expect(getWeekStart()).toBe('2024-01-01');
  });

  it('returns today when today is Monday', () => {
    vi.setSystemTime(new Date(2024, 0, 8));
    expect(getWeekStart()).toBe('2024-01-08');
  });

  it('handles month boundaries', () => {
    vi.setSystemTime(new Date(2024, 3, 30));
    expect(getWeekStart()).toBe('2024-04-29');
  });

  it('returns a date in YYYY-MM-DD format', () => {
    vi.setSystemTime(new Date(2024, 5, 15));
    expect(getWeekStart()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

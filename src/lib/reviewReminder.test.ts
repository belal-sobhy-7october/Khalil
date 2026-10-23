import { describe, expect, it } from 'vitest';
import type { SrsCard, VocabularyItem } from '../types';
import { DEFAULT_SRS_SETTINGS, newCard } from './srs';
import { afterReminder, calendarFile, googleCalendarUrl, reminderDue } from './reviewReminder';

const item = (id: string, word: string, srs?: SrsCard, over: Partial<VocabularyItem> = {}): VocabularyItem => ({
  id, userId: 'u', word, type: 'word', definition: 'd', masteryLevel: 0, reviewCount: srs ? 2 : 0, lapseCount: 0,
  correctStreak: 0, isHard: false, createdAt: '2026-10-01T10:00:00.000Z', updatedAt: '', srs, ...over,
});
const at = (time: string) => new Date(`2026-10-22T${time}:00`);
const review = (dueIso: string): SrsCard => ({ ...newCard(new Date(0)), state: 2, stability: 3, reps: 2, last_review: '2026-10-19T10:00:00.000Z', due: dueIso });
const on = { ...DEFAULT_SRS_SETTINGS, notify: true, reminderTime: '20:00' };

describe('reminderDue', () => {
  const items = [item('a', 'negotiate', review(at('08:00').toISOString())), item('b', 'deadline', review(at('09:00').toISOString())), item('c', 'résumé')];

  it('is silent until the reminder time, then names what is waiting', () => {
    expect(reminderDue(items, at('19:59'), on, {}, true)).toBeNull();
    expect(reminderDue(items, at('20:01'), on, {}, false)).toEqual({ kind: 'daily', count: 3, hard: 0, words: ['negotiate', 'deadline', 'résumé'] });
  });

  it('once a day, and never when notifications are off', () => {
    const sent = afterReminder({}, { kind: 'daily', count: 3, hard: 0, words: [] }, at('20:01'));
    expect(reminderDue(items, at('21:00'), on, sent, true)).toBeNull();
    expect(reminderDue(items, at('20:01'), { ...on, notify: false }, {}, true)).toBeNull();
  });

  it('nothing due: no notification, and the day is done', () => {
    const r = reminderDue([], at('20:01'), on, {}, true);
    expect(r).toEqual({ kind: 'none-due' });
    expect(afterReminder({}, r!, at('20:01')).daily).toBe('2026-10-22');
  });

  it('a learning step that comes due while you are away', () => {
    const learning: SrsCard = { ...newCard(new Date(0)), state: 1, stability: 2, reps: 1, last_review: at('10:00').toISOString(), due: at('10:10').toISOString() };
    const list = [item('l', 'leverage', learning)];
    const done = { daily: '2026-10-22' };
    expect(reminderDue(list, at('10:05'), on, done, true)).toBeNull();
    expect(reminderDue(list, at('10:11'), on, done, false)).toBeNull(); // you're on the tab: the session shows it
    expect(reminderDue(list, at('10:11'), on, done, true)).toEqual({ kind: 'learning', count: 1 });
    const sent = afterReminder(done, { kind: 'learning', count: 1 }, at('10:11'));
    expect(reminderDue(list, at('10:30'), on, sent, true)).toBeNull();
    expect(reminderDue(list, at('10:42'), on, sent, true)).toEqual({ kind: 'learning', count: 1 });
    // Learning steps from yesterday are left to the daily reminder.
    expect(reminderDue(list, new Date('2026-10-23T09:00:00'), { ...on, reminderTime: null }, sent, true)).toBeNull();
  });
});

describe('calendar reminder', () => {
  it('Google Calendar: a daily event at the reminder time', () => {
    const url = new URL(googleCalendarUrl('Review', 'Open Khalil', '20:00', '2026-10-22'));
    expect(url.searchParams.get('dates')).toBe('20261022T200000/20261022T201500');
    expect(url.searchParams.get('recur')).toBe('RRULE:FREQ=DAILY');
    expect(new URL(googleCalendarUrl('Review', '', '23:50', '2026-10-22')).searchParams.get('dates')).toBe('20261022T235000/20261023T000500');
  });

  it('.ics: a daily event with an alert', () => {
    const ics = calendarFile('Khalil, review', 'Open; now', '07:30', '2026-10-22', 'https://example.com');
    expect(ics).toContain('DTSTART:20261022T073000');
    expect(ics).toContain('RRULE:FREQ=DAILY');
    expect(ics).toContain('SUMMARY:Khalil\\, review');
    expect(ics).toContain('BEGIN:VALARM');
  });
});

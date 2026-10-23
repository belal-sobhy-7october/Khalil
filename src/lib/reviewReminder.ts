/**
 * When to remind you to review your words (lib/srs.ts):
 *  - once a day at your reminder time, if anything is due — with the first
 *    words, so you know what's waiting;
 *  - when words you learned a moment ago reach their next learning step
 *    while you're away from the tab (the 10-minute step is what makes a new
 *    word stick), at most every half hour.
 * Notifications need Khalil open (a tab or the installed app); the calendar
 * reminder covers the rest (see calendarReminder below).
 */
import { addDaysToDateString, localDateString } from '../store/dateHelpers';
import type { VocabularyItem } from '../types';
import { buildSession, dueSummary, type SrsSettings } from './srs';

export const REMINDER_STATE_KEY = 'khalil-srs-reminded';
const LEARNING_GAP_MS = 30 * 60 * 1000;
const RECENT_MS = 12 * 60 * 60 * 1000;

/** What was already sent on this device. */
export interface ReminderState {
  /** Local date of the last daily reminder (or of the check that found nothing due). */
  daily?: string;
  /** When the last learning-step reminder went out. */
  learningAt?: number;
}

export type Reminder =
  | { kind: 'daily'; count: number; hard: number; words: string[] }
  | { kind: 'learning'; count: number }
  | { kind: 'none-due' };

const hhmm = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

export function reminderDue(
  items: VocabularyItem[],
  now: Date,
  settings: SrsSettings,
  state: ReminderState,
  away: boolean
): Reminder | null {
  if (!settings.notify) return null;
  const today = localDateString(now);
  if (settings.reminderTime && state.daily !== today && hhmm(now) >= settings.reminderTime) {
    const s = dueSummary(items, now, settings);
    const count = s.learning + s.review + s.newToday;
    if (!count) return { kind: 'none-due' };
    return { kind: 'daily', count, hard: s.hardDue, words: buildSession(items, now, settings, 3).map((i) => i.word) };
  }
  if (away && (!state.learningAt || now.getTime() - state.learningAt >= LEARNING_GAP_MS)) {
    const ready = items.filter((i) => {
      const c = i.srs;
      return !!c && (c.state === 1 || c.state === 3) && Date.parse(c.due) <= now.getTime() && !!c.last_review && now.getTime() - Date.parse(c.last_review) <= RECENT_MS;
    }).length;
    if (ready) return { kind: 'learning', count: ready };
  }
  return null;
}

/** The state after a reminder went out (or was found not needed). */
export function afterReminder(state: ReminderState, reminder: Reminder, now: Date): ReminderState {
  if (reminder.kind === 'learning') return { ...state, learningAt: now.getTime() };
  return { ...state, daily: localDateString(now) };
}

// ── A reminder in the phone's calendar, for when Khalil is closed ─────────

const pad = (n: number) => String(n).padStart(2, '0');
/** Floating local time (no zone): the calendar shows it at that hour wherever you are. */
const icsTime = (date: string, time: string) => `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;

/** Google Calendar's "new event" page with a daily repeating reminder. */
export function googleCalendarUrl(title: string, details: string, time: string, today: string): string {
  const [h, m] = time.split(':').map(Number);
  const endMinutes = h * 60 + m + 15;
  const endDate = endMinutes >= 24 * 60 ? addDaysToDateString(today, 1) : today;
  const end = `${pad(Math.floor(endMinutes / 60) % 24)}:${pad(endMinutes % 60)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details,
    dates: `${icsTime(today, time)}/${icsTime(endDate, end)}`,
    recur: 'RRULE:FREQ=DAILY',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** An .ics file with the same daily event and an alert at its start. */
export function calendarFile(title: string, details: string, time: string, today: string, url: string): string {
  const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Khalil//Review reminder//EN',
    'BEGIN:VEVENT',
    `UID:khalil-review-${today}@khalil`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART:${icsTime(today, time)}`,
    'DURATION:PT15M',
    'RRULE:FREQ=DAILY',
    `SUMMARY:${escape(title)}`,
    `DESCRIPTION:${escape(details)}`,
    `URL:${url}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escape(title)}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

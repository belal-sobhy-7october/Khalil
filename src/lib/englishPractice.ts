/** Shared types/keys for the English hub's saved links and practice log. */
export type PracticeKind = 'accent' | 'listening' | 'reading' | 'grammar' | 'shadowing';

export interface StudyLink {
  id: string;
  section: PracticeKind;
  track?: string;
  title: string;
  url: string;
  createdAt: string;
}

/** date (YYYY-MM-DD) → minutes per kind */
export type PracticeLog = Record<string, Partial<Record<PracticeKind, number>>>;

export const STUDY_LINKS_KEY = 'english-study-links';
export const PRACTICE_LOG_KEY = 'english-practice-log';

export function addMinutes(log: PracticeLog, date: string, kind: PracticeKind, minutes: number): PracticeLog {
  const day = log[date] ?? {};
  return { ...log, [date]: { ...day, [kind]: (day[kind] ?? 0) + minutes } };
}

export function minutesBetween(log: PracticeLog, from: string, to: string, kind?: PracticeKind): number {
  let total = 0;
  for (const [date, kinds] of Object.entries(log)) {
    if (date < from || date > to) continue;
    for (const [k, m] of Object.entries(kinds)) if (!kind || k === kind) total += m ?? 0;
  }
  return total;
}

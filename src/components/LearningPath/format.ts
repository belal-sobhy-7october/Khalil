/** "2h" / "1h 30m" / "45 min": a length of time. */
export function formatMinutes(total: number, t: (k: string) => string): string {
  const h = Math.floor(total / 60);
  const m = Math.round(total % 60);
  if (!h) return t('path.minutes').replace('{n}', String(m));
  return m ? t('path.time').replace('{h}', String(h)).replace('{m}', String(m)) : t('path.hours').replace('{h}', String(h));
}

/** The day's total: six sections of `minutes`. */
export const dayTotal = (minutes: number, t: (k: string) => string) => formatMinutes(minutes * 6, t);

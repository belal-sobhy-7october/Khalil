import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { dueSummary, type DueSummary } from './srs';
import { useSrsSettings } from './useSrsSettings';

/** The current time, updated every minute (due counts change as time passes). */
export function useMinuteClock(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/** What's due in the word list right now (lib/srs.ts dueSummary), kept current. */
export function useDueSummary(): DueSummary & { due: number } {
  const items = useAppStore((s) => s.vocabularyItems);
  const [settings] = useSrsSettings();
  const now = useMinuteClock();
  return useMemo(() => {
    const s = dueSummary(items, now, settings);
    return { ...s, due: s.learning + s.review };
  }, [items, now, settings]);
}

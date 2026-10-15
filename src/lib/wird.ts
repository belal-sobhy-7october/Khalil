/**
 * Daily wird (worship) tracking: congregational prayers, qiyam, sunnah
 * rawatib, Quran and adhkar. One row per user per day in `wird_days`,
 * mirrored to localStorage so it works before the migration runs.
 */
import { create } from 'zustand';
import { supabase } from './supabase';

export const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
export type Prayer = (typeof PRAYERS)[number];
export type PrayerState = 'jamaah' | 'alone' | null;

/** The 12 confirmed sunnah rawatib, grouped by prayer. */
export const RAWATIB = [
  { key: 'fajrBefore', rakaat: 2 },
  { key: 'dhuhrBefore', rakaat: 4 },
  { key: 'dhuhrAfter', rakaat: 2 },
  { key: 'maghribAfter', rakaat: 2 },
  { key: 'ishaAfter', rakaat: 2 },
] as const;
export type RawatibKey = (typeof RAWATIB)[number]['key'];

export const QIYAM_MAX = 11;
export const RAWATIB_MAX = 12;

export interface WirdDay {
  prayers: Partial<Record<Prayer, PrayerState>>;
  qiyam: number;
  rawatib: Partial<Record<RawatibKey, boolean>>;
  quran: number; // juz
  adhkarAM: boolean;
  adhkarPM: boolean;
}

export const EMPTY_DAY: WirdDay = { prayers: {}, qiyam: 0, rawatib: {}, quran: 0, adhkarAM: false, adhkarPM: false };

export const rawatibCount = (d: WirdDay) => RAWATIB.reduce((n, r) => n + (d.rawatib[r.key] ? r.rakaat : 0), 0);
export const jamaahCount = (d: WirdDay) => PRAYERS.filter((p) => d.prayers[p] === 'jamaah').length;
export const prayedCount = (d: WirdDay) => PRAYERS.filter((p) => d.prayers[p]).length;

/**
 * 0–100 daily score: prayers 40 (congregation full, alone half), qiyam 15,
 * rawatib 15, Quran 15 (one juz = full), adhkar 15.
 */
export function wirdScore(d: WirdDay): number {
  const prayers = PRAYERS.reduce((n, p) => n + (d.prayers[p] === 'jamaah' ? 1 : d.prayers[p] === 'alone' ? 0.5 : 0), 0) / 5;
  const score =
    prayers * 40 +
    (Math.min(d.qiyam, QIYAM_MAX) / QIYAM_MAX) * 15 +
    (rawatibCount(d) / RAWATIB_MAX) * 15 +
    Math.min(d.quran, 1) * 15 +
    ((Number(d.adhkarAM) + Number(d.adhkarPM)) / 2) * 15;
  return Math.round(score);
}

export function isEmptyDay(d: WirdDay | undefined): boolean {
  return !d || wirdScore(d) === 0;
}

const LOCAL_KEY = 'khalil-wird-days';

function readLocal(): Record<string, WirdDay> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '{}') as Record<string, WirdDay>;
  } catch {
    return {};
  }
}

function writeLocal(days: Record<string, WirdDay>) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(days));
  } catch {
    // ignore
  }
}

interface WirdState {
  days: Record<string, WirdDay>;
  loadRange: (userId: string, from: string, to: string) => Promise<void>;
  updateDay: (userId: string | undefined, date: string, patch: Partial<WirdDay> | ((d: WirdDay) => Partial<WirdDay>)) => void;
}

const saveTimers = new Map<string, number>();

export const useWirdStore = create<WirdState>((set, get) => ({
  days: readLocal(),

  loadRange: async (userId, from, to) => {
    const { data, error } = await supabase.from('wird_days').select('date, data').eq('user_id', userId).gte('date', from).lte('date', to);
    if (error || !data) return;
    const days = { ...get().days };
    for (const row of data as Array<{ date: string; data: Partial<WirdDay> }>) {
      days[row.date] = { ...EMPTY_DAY, ...row.data };
    }
    set({ days });
    writeLocal(days);
  },

  updateDay: (userId, date, patch) => {
    const current = { ...EMPTY_DAY, ...get().days[date] };
    const next = { ...current, ...(typeof patch === 'function' ? patch(current) : patch) };
    const days = { ...get().days, [date]: next };
    set({ days });
    writeLocal(days);
    if (!userId) return;
    // Debounce per day so rapid taps make one request.
    window.clearTimeout(saveTimers.get(date));
    saveTimers.set(
      date,
      window.setTimeout(async () => {
        saveTimers.delete(date);
        const { error } = await supabase
          .from('wird_days')
          .upsert({ user_id: userId, date, data: get().days[date], updated_at: new Date().toISOString() }, { onConflict: 'user_id,date' });
        if (error) console.error('save wird day', error);
      }, 600)
    );
  },
}));

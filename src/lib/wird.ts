/**
 * Daily wird (worship) tracking. Its items are the user's own (see
 * `WirdItem` and lib/wirdItems.ts): the five prayers, the sunnah rawatib,
 * qiyam, Quran and adhkar come built in and can be hidden, and anyone can add
 * their own (dhikr, study…). One row per user per day in `wird_days`,
 * mirrored to localStorage so it works offline and before the migration runs.
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
  /** The user's own items, by item id: a count, or done / not done. */
  custom?: Record<string, number | boolean>;
}

export const EMPTY_DAY: WirdDay = { prayers: {}, qiyam: 0, rawatib: {}, quran: 0, adhkarAM: false, adhkarPM: false };

export const rawatibCount = (d: WirdDay) => RAWATIB.reduce((n, r) => n + (d.rawatib[r.key] ? r.rakaat : 0), 0);
export const jamaahCount = (d: WirdDay) => PRAYERS.filter((p) => d.prayers[p] === 'jamaah').length;
export const prayedCount = (d: WirdDay) => PRAYERS.filter((p) => d.prayers[p]).length;

/**
 * One item of the wird. `prayers` (the five prayers, each prayed in
 * congregation, alone or not yet) and `rawatib` are built in; `count` items
 * have a daily goal (qiyam rak'ahs, juz of Quran, 100 times of dhikr…) and
 * `check` items are done or not (adhkar). Built-in items keep their ids and
 * their own fields in `WirdDay`; the user's items (ids starting with "c-")
 * keep their values in `WirdDay.custom`.
 */
export type WirdItemKind = 'prayers' | 'rawatib' | 'count' | 'check';

export interface WirdItem {
  id: string;
  kind: WirdItemKind;
  /** The user's own items only; built-in ones are translated (`wird.row.<id>`). */
  name?: string;
  /** count: what is counted (the user's own items; built-in ones are translated). */
  unit?: string;
  /** count and rawatib: the daily goal; the item is done at or above it. */
  goal?: number;
  /** count: the − / + step. */
  step?: number;
  /** count: the most that can be logged in a day. */
  max?: number;
  /** Left out of the sheet, the score and today's tasks (built-in items; the user's own are deleted instead). */
  hidden?: boolean;
  /** Listed in today's tasks too. */
  inToday?: boolean;
  /** Its share of the daily score. */
  weight?: number;
}

/** The built-in items, in their default order. Their weights add up to 100. */
export const BUILTIN_ITEMS: WirdItem[] = [
  { id: 'prayers', kind: 'prayers', weight: 40, inToday: true },
  { id: 'qiyam', kind: 'count', goal: QIYAM_MAX, step: 1, max: QIYAM_MAX, weight: 15 },
  { id: 'rawatib', kind: 'rawatib', goal: RAWATIB_MAX, weight: 15 },
  { id: 'quran', kind: 'count', goal: 1, step: 0.25, max: 30, weight: 15, inToday: true },
  { id: 'adhkarAM', kind: 'check', weight: 7.5, inToday: true },
  { id: 'adhkarPM', kind: 'check', weight: 7.5, inToday: true },
];

/** The share of the score a user's own item gets. */
export const CUSTOM_WEIGHT = 10;

export const isCustomItem = (item: Pick<WirdItem, 'id'>) => item.id.startsWith('c-');

/** An item's count for the day (prayers prayed, rawatib rak'ahs, 0/1 for a check item). */
export function itemCount(d: WirdDay, item: WirdItem): number {
  if (item.kind === 'prayers') return prayedCount(d);
  if (item.kind === 'rawatib') return rawatibCount(d);
  if (item.id === 'qiyam') return d.qiyam ?? 0;
  if (item.id === 'quran') return d.quran ?? 0;
  if (item.id === 'adhkarAM' || item.id === 'adhkarPM') return d[item.id] ? 1 : 0;
  const v = d.custom?.[item.id];
  return typeof v === 'number' ? v : v ? 1 : 0;
}

/** How much of an item is done that day, 0–1 (a prayer alone counts half). */
export function itemProgress(d: WirdDay, item: WirdItem): number {
  if (item.kind === 'prayers') return PRAYERS.reduce((n, p) => n + (d.prayers[p] === 'jamaah' ? 1 : d.prayers[p] === 'alone' ? 0.5 : 0), 0) / PRAYERS.length;
  if (item.kind === 'check') return itemCount(d, item) > 0 ? 1 : 0;
  const goal = item.goal && item.goal > 0 ? item.goal : 1;
  return Math.min(itemCount(d, item) / goal, 1);
}

/** Done for the day: all five prayers prayed, the goal reached, or ticked. */
export function itemDone(d: WirdDay, item: WirdItem): boolean {
  if (item.kind === 'prayers') return prayedCount(d) === PRAYERS.length;
  return itemProgress(d, item) >= 1;
}

/** The change that sets a count or check item's value. */
export function setItemCount(item: WirdItem, value: number): (d: WirdDay) => Partial<WirdDay> {
  return (d) => {
    if (item.id === 'qiyam') return { qiyam: value };
    if (item.id === 'quran') return { quran: value };
    if (item.id === 'adhkarAM' || item.id === 'adhkarPM') return { [item.id]: value > 0 };
    if (item.kind === 'rawatib') return { rawatib: value > 0 ? Object.fromEntries(RAWATIB.map((r) => [r.key, true])) : {} };
    return { custom: { ...d.custom, [item.id]: item.kind === 'check' ? value > 0 : value } };
  };
}

/** The change that marks an item done (its goal reached) or not done at all. */
export function setItemDone(item: WirdItem, done: boolean): (d: WirdDay) => Partial<WirdDay> {
  return (d) => {
    if (!done) return setItemCount(item, 0)(d);
    if (item.kind === 'check' || item.kind === 'rawatib') return setItemCount(item, 1)(d);
    return setItemCount(item, Math.max(itemCount(d, item), item.goal && item.goal > 0 ? item.goal : 1))(d);
  };
}

const weightOf = (item: WirdItem) => item.weight ?? BUILTIN_ITEMS.find((b) => b.id === item.id)?.weight ?? CUSTOM_WEIGHT;

/**
 * 0–100 daily score: each shown item's progress, weighted. With the built-in
 * items: prayers 40 (congregation full, alone half), qiyam 15, rawatib 15,
 * Quran 15 (one juz = full), morning and evening adhkar 7.5 each.
 */
export function wirdScore(d: WirdDay, items: WirdItem[] = BUILTIN_ITEMS): number {
  const shown = items.filter((i) => !i.hidden);
  const total = shown.reduce((n, i) => n + weightOf(i), 0);
  if (!total) return 0;
  return Math.round((shown.reduce((n, i) => n + weightOf(i) * itemProgress(d, i), 0) / total) * 100);
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

type DayPatch = Partial<WirdDay> | ((d: WirdDay) => Partial<WirdDay>);
type WirdRow = { date: string; data: Partial<WirdDay> };

interface WirdState {
  days: Record<string, WirdDay>;
  loadRange: (userId: string, from: string, to: string) => Promise<void>;
  /**
   * Every day the account has (the habits linked to the wird read their whole
   * history from it): `rows` when the startup request brought them, else from the table.
   */
  loadAll: (userId: string, rows?: Promise<WirdRow[] | null>) => Promise<void>;
  updateDay: (userId: string | undefined, date: string, patch: DayPatch) => void;
  /** Changes many days at once and saves them in one request (linking a habit fills in its past days). */
  updateDays: (userId: string | undefined, patches: Record<string, DayPatch>) => Promise<void>;
}

/** PostgREST's page size (max_rows in supabase/config.toml). */
const PAGE = 1000;

// Days edited locally that the server hasn't confirmed yet. Kept in
// localStorage so an edit survives a reload/close that cancels the request:
// the local copy wins on the next load and is sent again.
const UNSYNCED_KEY = 'khalil-wird-unsynced';

function readUnsynced(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(UNSYNCED_KEY) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}

const unsynced = readUnsynced();

function writeUnsynced() {
  try {
    localStorage.setItem(UNSYNCED_KEY, JSON.stringify([...unsynced]));
  } catch {
    // ignore
  }
}

const saveTimers = new Map<string, number>();
let pendingUserId: string | undefined;

// Every day was loaded (or is loading): a range asked for meanwhile, or within a
// minute after, needs no request of its own.
let loadingAll: Promise<boolean> | null = null;
let loadedAllAt = 0;

async function fetchAllRows(userId: string): Promise<WirdRow[] | null> {
  const rows: WirdRow[] = [];
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await supabase.from('wird_days').select('date, data').eq('user_id', userId).order('date').range(offset, offset + PAGE - 1);
    if (error || !data) return null;
    rows.push(...(data as WirdRow[]));
    if (data.length < PAGE) return rows;
  }
}

async function persistDay(userId: string, date: string, data: WirdDay) {
  const { error } = await supabase
    .from('wird_days')
    .upsert({ user_id: userId, date, data, updated_at: new Date().toISOString() }, { onConflict: 'user_id,date' });
  if (error) {
    console.error('save wird day', error);
    return;
  }
  // Confirmed — unless the day changed again while this was in flight.
  if (useWirdStore.getState().days[date] === data && !saveTimers.has(date)) {
    unsynced.delete(date);
    writeUnsynced();
  }
}

export const useWirdStore = create<WirdState>((set, get) => ({
  days: readLocal(),

  loadRange: async (userId, from, to) => {
    if (loadingAll && (await loadingAll) && Date.now() - loadedAllAt < 60_000) return;
    const { data, error } = await supabase.from('wird_days').select('date, data').eq('user_id', userId).gte('date', from).lte('date', to);
    if (error || !data) return;
    mergeRows(userId, data as WirdRow[], from, to);
  },

  loadAll: async (userId, given) => {
    const loading = (async () => {
      const rows = (await given?.catch(() => null)) ?? (await fetchAllRows(userId).catch(() => null));
      if (!rows) return false;
      mergeRows(userId, rows, '0000-01-01', '9999-12-31');
      loadedAllAt = Date.now();
      return true;
    })();
    loadingAll = loading;
    await loading;
  },

  updateDay: (userId, date, patch) => {
    const current = { ...EMPTY_DAY, ...get().days[date] };
    const next = { ...current, ...(typeof patch === 'function' ? patch(current) : patch) };
    const days = { ...get().days, [date]: next };
    set({ days });
    writeLocal(days);
    if (!userId) return;
    pendingUserId = userId;
    unsynced.add(date);
    writeUnsynced();
    // Debounce per day so rapid taps make one request.
    window.clearTimeout(saveTimers.get(date));
    saveTimers.set(
      date,
      window.setTimeout(() => {
        saveTimers.delete(date);
        void persistDay(userId, date, get().days[date]);
      }, 600)
    );
  },

  updateDays: async (userId, patches) => {
    const days = { ...get().days };
    for (const [date, patch] of Object.entries(patches)) {
      const current = { ...EMPTY_DAY, ...days[date] };
      days[date] = { ...current, ...(typeof patch === 'function' ? patch(current) : patch) };
    }
    set({ days });
    writeLocal(days);
    const dates = Object.keys(patches);
    if (!userId || dates.length === 0) return;
    for (const date of dates) unsynced.add(date);
    writeUnsynced();
    const now = new Date().toISOString();
    const { error } = await supabase
      .from('wird_days')
      .upsert(dates.map((date) => ({ user_id: userId, date, data: days[date], updated_at: now })), { onConflict: 'user_id,date' });
    if (error) {
      // Still marked unsynced: the next load sends them again.
      console.error('save wird days', error);
      return;
    }
    for (const date of dates) if (get().days[date] === days[date] && !saveTimers.has(date)) unsynced.delete(date);
    writeUnsynced();
  },
}));

/**
 * Takes rows from the server into the store, except days edited here that the
 * server hasn't confirmed yet (those are newer, and are sent again).
 */
function mergeRows(userId: string, rows: WirdRow[], from: string, to: string) {
  const days = { ...useWirdStore.getState().days };
  for (const row of rows) {
    if (saveTimers.has(row.date) || unsynced.has(row.date)) continue;
    days[row.date] = { ...EMPTY_DAY, ...row.data };
  }
  useWirdStore.setState({ days });
  writeLocal(days);
  for (const date of unsynced) {
    if (date >= from && date <= to && !saveTimers.has(date) && days[date]) void persistDay(userId, date, days[date]);
  }
}

/** Save every pending day right now (the page is being hidden or closed). */
export function flushWirdSaves() {
  if (!pendingUserId) return;
  for (const [date, timer] of saveTimers) {
    window.clearTimeout(timer);
    saveTimers.delete(date);
    void persistDay(pendingUserId, date, useWirdStore.getState().days[date]);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flushWirdSaves);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushWirdSaves();
  });
}

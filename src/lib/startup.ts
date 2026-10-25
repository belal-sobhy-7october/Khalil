/**
 * Opening the app in one request (`app_startup`, supabase/migrations/20261025120000_sync_and_startup.sql):
 * the small lists, the settings read on opening, and only the words, flashcard
 * states, habit days and wird days that changed since this device's last visit
 * (the rest is this device's copy, lib/syncCache.ts). Returns null when the
 * request fails or the database doesn't have the function yet: the caller then
 * loads table by table as before.
 */
import { supabase } from './supabase';
import { FULL_EVERY_DAYS, forgetOtherAccounts, readSyncRecord, writeSyncRecord, type SyncRecord } from './syncCache';
import { SRS_KEY_PREFIX } from './srsSync';
import type { SrsCard } from '../types';

type Row = Record<string, unknown>;

/** The settings read as the app opens (the rest of user_kv loads when a page asks for it). */
export const STARTUP_KV_KEYS = ['appearance', 'srs-settings', 'tasks-settings', 'wird-items', 'habit-links', 'pomodoro-settings'];

export interface StartupResponse {
  now: string;
  /** Everything came (no `since`, or it was too old): the device's copy is replaced. */
  full: boolean;
  focus: Row[];
  todos: Row[];
  life_categories: Row[];
  sub_tracks: Row[];
  habits: Row[];
  vocabulary_categories: Row[];
  sticky_notes: Row[];
  todo_notes: Row[];
  kv: Record<string, unknown>;
  words: Row[];
  srs: Array<{ key: string; value: unknown }>;
  habit_entries: Row[];
  wird: Array<{ date: string; data: Row }>;
  deleted: Array<{ source: string; key: string }>;
}

export interface StartupData {
  focus: Row | null;
  todos: Row[];
  lifeCategories: Row[];
  subTracks: Row[];
  habits: Row[];
  vocabularyCategories: Row[];
  stickyNotes: Row[];
  todoNotes: Row[];
  kv: Record<string, unknown>;
  /** Every word, oldest first (as the table loads them). */
  words: Row[];
  /** Every word's flashcard state (null: they couldn't be read, so this device's copy is used). */
  srs: Record<string, SrsCard> | null;
  /** Every habit day, by date. */
  habitEntries: Row[];
  /** Every wird day, by date. */
  wird: Array<{ date: string; data: Row }>;
}

const habitKey = (row: Row) => `${row.habit_id as string}|${row.date as string}`;

/** The device's copy updated with a response: deletions first, then the rows that changed. */
export function applyChanges(base: SyncRecord | null, res: StartupResponse): SyncRecord {
  const keep = base && !res.full;
  const next: SyncRecord = {
    cursor: res.now,
    fullAt: keep ? base.fullAt : res.now,
    words: keep ? { ...base.words } : {},
    srs: keep ? { ...base.srs } : {},
    habitEntries: keep ? { ...base.habitEntries } : {},
    wird: keep ? { ...base.wird } : {},
  };
  if (keep) {
    for (const { source, key } of res.deleted) {
      if (source === 'vocabulary_items') delete next.words[key];
      else if (source === 'habit_entries') delete next.habitEntries[key];
      else if (source === 'wird_days') delete next.wird[key];
      else if (source === 'user_kv' && key.startsWith(SRS_KEY_PREFIX)) delete next.srs[key.slice(SRS_KEY_PREFIX.length)];
    }
  }
  for (const row of res.words) next.words[row.id as string] = row;
  for (const { key, value } of res.srs) if (value && typeof value === 'object') next.srs[key.slice(SRS_KEY_PREFIX.length)] = value;
  for (const row of res.habit_entries) next.habitEntries[habitKey(row)] = row;
  for (const { date, data } of res.wird) next.wird[date] = { date, data };
  return next;
}

const byKeys = (...keys: string[]) => (a: Row, b: Row) => {
  for (const key of keys) {
    const x = String(a[key] ?? '');
    const y = String(b[key] ?? '');
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
};

const isResponse = (data: unknown): data is StartupResponse =>
  !!data && typeof data === 'object' && typeof (data as StartupResponse).now === 'string' && Array.isArray((data as StartupResponse).words);

export async function loadStartup(userId: string): Promise<StartupData | null> {
  // Another account's copy on this browser isn't this one's to keep (lib/localOwner.ts clears the rest).
  void forgetOtherAccounts(userId);
  const base = await readSyncRecord(userId);
  // A copy loaded in full long ago is loaded in full again (the server also decides by `since`'s age).
  const fresh = base && Date.now() - Date.parse(base.fullAt) < FULL_EVERY_DAYS * 24 * 3600 * 1000 ? base : null;
  let data: unknown;
  try {
    const res = await supabase.rpc('app_startup', { since: fresh?.cursor ?? null, kv_keys: STARTUP_KV_KEYS });
    if (res.error) {
      // PGRST202: the function isn't there yet (the migration hasn't run).
      if (import.meta.env.DEV) console.info('[startup] falling back to loading table by table:', res.error);
      return null;
    }
    data = res.data;
  } catch {
    return null;
  }
  if (!isResponse(data)) return null;

  const record = applyChanges(fresh, data);
  void writeSyncRecord(userId, record);
  return {
    focus: data.focus[0] ?? null,
    todos: data.todos,
    lifeCategories: data.life_categories,
    subTracks: data.sub_tracks,
    habits: data.habits,
    vocabularyCategories: data.vocabulary_categories,
    stickyNotes: data.sticky_notes,
    todoNotes: data.todo_notes,
    kv: data.kv ?? {},
    words: Object.values(record.words).sort(byKeys('created_at', 'id')),
    srs: record.srs as Record<string, SrsCard>,
    habitEntries: Object.values(record.habitEntries).sort(byKeys('date', 'id')),
    wird: (Object.values(record.wird) as Array<{ date: string; data: Row }>).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)),
  };
}

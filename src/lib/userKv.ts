/**
 * Small per-user key/value settings stored in `user_kv`, mirrored to
 * localStorage so they apply instantly on load and survive if the table
 * isn't there yet.
 */
import { supabase } from './supabase';

const localKey = (key: string) => `khalil-kv:${key}`;

export function readLocalKv<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(localKey(key));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalKv(key: string, value: unknown) {
  try {
    localStorage.setItem(localKey(key), JSON.stringify(value));
  } catch {
    // storage blocked/full — the database copy still holds it
  }
}

// Values known a moment ago: the settings the startup request brought
// (lib/startup.ts) and the values just loaded or saved, so the components of a
// page that opens don't each ask for them. Older than this, a value is asked
// for again (another device may have changed it).
const KNOWN_FOR_MS = 60_000;
type Known = { found: boolean; value: unknown } | null;
const known = new Map<string, { at: number; result: Promise<Known> }>();
const knownKey = (userId: string, key: string) => `${userId}\u0000${key}`;

/** Hands loadKv the values of `keys` when `values` resolves (null: they weren't loaded, ask as usual). */
export function prefetchKv(userId: string, keys: string[], values: Promise<Record<string, unknown> | null>) {
  const at = Date.now();
  for (const key of keys) {
    const result = values.then((v) => (v ? { found: key in v, value: v[key] } : null), () => null);
    known.set(knownKey(userId, key), { at, result });
  }
}

/** Forgets what is known (another account signed in, or a test). */
export function forgetKnownKv() {
  known.clear();
}

// Keys asked for at the same moment (the components of a page mounting) go in one request.
let batch: { userId: string; keys: Map<string, Array<(r: Known) => void>> } | null = null;

function fetchBatched(userId: string, key: string): Promise<Known> {
  return new Promise((resolve) => {
    if (!batch || batch.userId !== userId) {
      const current = { userId, keys: new Map<string, Array<(r: Known) => void>>() };
      batch = current;
      setTimeout(() => {
        if (batch === current) batch = null;
        void runBatch(current.userId, current.keys);
      }, 0);
    }
    const waiting = batch.keys.get(key) ?? [];
    waiting.push(resolve);
    batch.keys.set(key, waiting);
  });
}

async function runBatch(userId: string, keys: Map<string, Array<(r: Known) => void>>) {
  let rows: Array<{ key: string; value: unknown }> | null = null;
  try {
    const { data, error } = await supabase.from('user_kv').select('key,value').eq('user_id', userId).in('key', [...keys.keys()]);
    if (!error && data) rows = data as Array<{ key: string; value: unknown }>;
  } catch {
    // the client itself failed: each key falls back to the device copy
  }
  const values = rows ? new Map(rows.map((r) => [r.key, r.value])) : null;
  for (const [key, waiting] of keys) {
    const result: Known = values ? { found: values.has(key), value: values.get(key) } : null;
    for (const resolve of waiting) resolve(result);
  }
}

async function lookUp(userId: string, key: string): Promise<Known> {
  const k = knownKey(userId, key);
  const entry = known.get(k);
  const recent = entry && Date.now() - entry.at < KNOWN_FOR_MS ? await entry.result : null;
  if (recent) return recent;
  const mine = { at: Date.now(), result: fetchBatched(userId, key) };
  known.set(k, mine);
  const result = await mine.result;
  const latest = known.get(k);
  // Saved while it was being read: the saved value is the newer one.
  if (latest && latest !== mine) return latest.result;
  if (!result) known.delete(k); // a failed request is tried again next time
  return result;
}

export async function loadKv<T>(userId: string, key: string, fallback: T): Promise<T> {
  const result = await lookUp(userId, key);
  if (!result || !result.found) return readLocalKv(key, fallback);
  writeLocalKv(key, result.value);
  return result.value as T;
}

export async function saveKv(userId: string, key: string, value: unknown): Promise<boolean> {
  writeLocalKv(key, value);
  known.set(knownKey(userId, key), { at: Date.now(), result: Promise.resolve({ found: true, value }) });
  try {
    const { error } = await supabase
      .from('user_kv')
      .upsert({ user_id: userId, key, value, updated_at: new Date().toISOString() }, { onConflict: 'user_id,key' });
    if (error) console.error('saveKv', key, error);
    return !error;
  } catch (error) {
    console.error('saveKv', key, error);
    return false;
  }
}

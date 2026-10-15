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

export async function loadKv<T>(userId: string, key: string, fallback: T): Promise<T> {
  const { data, error } = await supabase.from('user_kv').select('value').eq('user_id', userId).eq('key', key).maybeSingle();
  if (error || !data) return readLocalKv(key, fallback);
  const value = (data as { value: T }).value;
  writeLocalKv(key, value);
  return value;
}

export async function saveKv(userId: string, key: string, value: unknown): Promise<boolean> {
  writeLocalKv(key, value);
  const { error } = await supabase
    .from('user_kv')
    .upsert({ user_id: userId, key, value, updated_at: new Date().toISOString() }, { onConflict: 'user_id,key' });
  if (error) console.error('saveKv', key, error);
  return !error;
}

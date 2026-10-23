/**
 * Where the words' spaced-repetition states (lib/srs.ts) are saved: one
 * user_kv row per word (`srs:<word id>`), so a review writes one small row,
 * and a copy on this device so the schedule shows at once and survives a
 * save that didn't reach the server (it is sent again on the next load).
 */
import { supabase } from './supabase';
import type { SrsCard } from '../types';

export const SRS_KEY_PREFIX = 'srs:';
// Under khalil-kv: so another account signing in on this browser clears it (lib/localOwner.ts).
const LOCAL_KEY = 'khalil-kv:srs-cards';
const PAGE = 1000;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked — the server copy still holds it
  }
}

export const readLocalSrs = () => readJson<Record<string, SrsCard>>(LOCAL_KEY, {});
export const writeLocalSrs = (cards: Record<string, SrsCard>) => writeJson(LOCAL_KEY, cards);

/** Every saved state, or null when they couldn't be read (the device copy is used then). */
export async function fetchSrsCards(userId: string): Promise<Record<string, SrsCard> | null> {
  const out: Record<string, SrsCard> = {};
  try {
    for (let offset = 0; ; offset += PAGE) {
      const { data, error } = await supabase
        .from('user_kv')
        .select('key,value')
        .eq('user_id', userId)
        .like('key', `${SRS_KEY_PREFIX}*`)
        .order('key', { ascending: true })
        .range(offset, offset + PAGE - 1);
      if (error) return null;
      const rows = (data ?? []) as Array<{ key: string; value: SrsCard }>;
      for (const row of rows) if (row.value && typeof row.value === 'object') out[row.key.slice(SRS_KEY_PREFIX.length)] = row.value;
      if (rows.length < PAGE) return out;
    }
  } catch {
    // never let the schedule stop the word list from loading
    return null;
  }
}

/** The later of two states for the same word (by its last review, then by review count). */
function newer(a: SrsCard | undefined, b: SrsCard | undefined): SrsCard | undefined {
  if (!a) return b;
  if (!b) return a;
  const at = a.last_review ?? '';
  const bt = b.last_review ?? '';
  if (at !== bt) return at > bt ? a : b;
  return b.reps > a.reps ? b : a;
}

/**
 * The server's states merged with this device's: the newer one wins for each
 * word, and the words whose newer state is only here are returned to send.
 */
export function mergeSrs(remote: Record<string, SrsCard> | null, local: Record<string, SrsCard>): { cards: Record<string, SrsCard>; toSend: string[] } {
  if (!remote) return { cards: local, toSend: [] };
  const cards: Record<string, SrsCard> = { ...remote };
  const toSend: string[] = [];
  for (const [id, card] of Object.entries(local)) {
    const pick = newer(remote[id], card) ?? card;
    cards[id] = pick;
    if (pick === card && JSON.stringify(remote[id]) !== JSON.stringify(card)) toSend.push(id);
  }
  return { cards, toSend };
}

/** Saves one word's state here and on the server; a failed send goes again on the next load (see mergeSrs). */
export async function saveSrsCard(userId: string, itemId: string, card: SrsCard): Promise<boolean> {
  writeLocalSrs({ ...readLocalSrs(), [itemId]: card });
  try {
    const { error } = await supabase
      .from('user_kv')
      .upsert({ user_id: userId, key: `${SRS_KEY_PREFIX}${itemId}`, value: card, updated_at: new Date().toISOString() }, { onConflict: 'user_id,key' });
    return !error;
  } catch {
    return false;
  }
}

/** Forgets a deleted word's state. */
export async function deleteSrsCard(userId: string, itemId: string): Promise<void> {
  const local = readLocalSrs();
  if (itemId in local) {
    delete local[itemId];
    writeLocalSrs(local);
  }
  try {
    await supabase.from('user_kv').delete().eq('user_id', userId).eq('key', `${SRS_KEY_PREFIX}${itemId}`);
  } catch {
    // an orphaned row is harmless: states are only read for words that exist
  }
}

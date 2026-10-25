/**
 * The user's wird: which items it has, in what order, with what goals, and
 * which ones also show in today's tasks. Saved per user in `user_kv`.
 */
import { createKvStore } from './kvStore';
import { BUILTIN_ITEMS, CUSTOM_WEIGHT, isCustomItem, type WirdItem } from './wird';

export const WIRD_ITEMS_KEY = 'wird-items';

const positive = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;

/** Keeps a saved list valid: known built-in items with their fixed parts, sane custom items, and every built-in item present. */
export function normalizeWirdItems(stored: unknown): WirdItem[] {
  const list = Array.isArray(stored) ? (stored as Array<Partial<WirdItem> | null>) : [];
  const out: WirdItem[] = [];
  for (const raw of list) {
    if (!raw || typeof raw.id !== 'string' || out.some((i) => i.id === raw.id)) continue;
    const builtin = BUILTIN_ITEMS.find((b) => b.id === raw.id);
    if (builtin) {
      const item: WirdItem = { ...builtin, inToday: typeof raw.inToday === 'boolean' ? raw.inToday : !!builtin.inToday };
      if (raw.hidden) item.hidden = true;
      if (builtin.goal !== undefined && positive(raw.goal)) item.goal = Math.min(raw.goal, builtin.max ?? builtin.goal);
      out.push(item);
    } else if (isCustomItem({ id: raw.id }) && (raw.kind === 'check' || raw.kind === 'count') && typeof raw.name === 'string' && raw.name.trim()) {
      const item: WirdItem = { id: raw.id, kind: raw.kind, name: raw.name.trim().slice(0, 60), weight: CUSTOM_WEIGHT, inToday: !!raw.inToday };
      if (raw.kind === 'count') {
        item.goal = positive(raw.goal) ? raw.goal : 1;
        item.step = positive(raw.step) ? raw.step : 1;
        if (typeof raw.unit === 'string' && raw.unit.trim()) item.unit = raw.unit.trim().slice(0, 30);
      }
      out.push(item);
    }
  }
  // Nothing saved yet, or an item added to the app later: the built-in items it lacks, after the saved order.
  for (const b of BUILTIN_ITEMS) if (!out.some((i) => i.id === b.id)) out.push({ ...b });
  return out;
}

const store = createKvStore(WIRD_ITEMS_KEY, normalizeWirdItems);

/** The wird's items, every one (hidden ones included, in order). */
export const useWirdItems = store.useValue;
export const getWirdItems = store.get;
export const setWirdItems = store.set;

/** A new item of the user's own. */
export function newWirdItem(kind: 'check' | 'count', name: string, goal = 1, unit?: string): WirdItem {
  const item: WirdItem = { id: `c-${crypto.randomUUID().slice(0, 8)}`, kind, name: name.trim(), weight: CUSTOM_WEIGHT, inToday: true };
  if (kind === 'count') {
    item.goal = goal > 0 ? goal : 1;
    item.step = 1;
    if (unit?.trim()) item.unit = unit.trim();
  }
  return item;
}

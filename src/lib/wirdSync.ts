/**
 * How the tasks, the wird and the habits stay in step.
 *
 * Every fact is stored once, by its owner: a prayer, a juz or the adhkar in
 * the wird (`wird_days`), a habit's day in `habit_entries`, a one-off task in
 * `todos`. Nothing is copied between them. Today's tasks list wird items and
 * due habits as rows that read their owner and write to it when ticked, so a
 * tick anywhere shows everywhere, offline too, and nothing can drift apart or
 * come back after being deleted (copying tasks into each day is what made the
 * old rollover bring deleted tasks back).
 *
 * A habit can be linked to one wird target ("Fajr in the mosque" → Fajr in
 * congregation). While linked it *is* that target: its ticks are read from the
 * wird and ticking it writes the wird. Linking moves the habit's past days into
 * the wird; unlinking writes the wird's days back as the habit's own.
 */
import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import type { Habit, HabitEntry } from '../types';
import { createKvStore } from './kvStore';
import { getTasksSettings } from './tasksSettings';
import { EMPTY_DAY, PRAYERS, itemDone, setItemDone, useWirdStore, type Prayer, type WirdDay, type WirdItem } from './wird';
import { getWirdItems, useWirdItems } from './wirdItems';

/**
 * One thing in the wird that a row of today's tasks or a linked habit stands
 * for: "prayer:fajr" (prayed, alone or in congregation), "prayer:fajr:jamaah"
 * (in congregation only) or an item's id ("quran", "adhkarAM", "c-…").
 */
export type WirdTarget = string;

type Parsed = { prayer: Prayer; jamaahOnly: boolean } | { itemId: string };

export function parseTarget(target: WirdTarget): Parsed {
  const [kind, prayer, mode] = target.split(':');
  if (kind === 'prayer' && (PRAYERS as readonly string[]).includes(prayer)) return { prayer: prayer as Prayer, jamaahOnly: mode === 'jamaah' };
  return { itemId: target };
}

/** The target is still in the wird (its item wasn't deleted or hidden). */
export function targetExists(target: WirdTarget, items: WirdItem[]): boolean {
  const t = parseTarget(target);
  const id = 'prayer' in t ? 'prayers' : t.itemId;
  return items.some((i) => i.id === id && !i.hidden);
}

export function targetDone(target: WirdTarget, day: WirdDay | undefined, items: WirdItem[]): boolean {
  const d = { ...EMPTY_DAY, ...day };
  const t = parseTarget(target);
  if ('prayer' in t) return t.jamaahOnly ? d.prayers[t.prayer] === 'jamaah' : !!d.prayers[t.prayer];
  const item = items.find((i) => i.id === t.itemId);
  return item ? itemDone(d, item) : false;
}

/**
 * The change that marks a target done or not. Ticking a prayer records
 * `prayerTick` (congregation by default) unless it was already logged.
 */
export function targetPatch(target: WirdTarget, done: boolean, items: WirdItem[], prayerTick: 'jamaah' | 'alone'): ((d: WirdDay) => Partial<WirdDay>) | null {
  const t = parseTarget(target);
  if ('prayer' in t) {
    return (d) => ({
      prayers: { ...d.prayers, [t.prayer]: done ? (t.jamaahOnly ? 'jamaah' : d.prayers[t.prayer] ?? prayerTick) : null },
    });
  }
  const item = items.find((i) => i.id === t.itemId);
  return item ? setItemDone(item, done) : null;
}

/** Every target the wird offers now, for the habit link picker. */
export function wirdTargets(items: WirdItem[]): WirdTarget[] {
  return items
    .filter((i) => !i.hidden)
    .flatMap((i) => (i.kind === 'prayers' ? PRAYERS.flatMap((p) => [`prayer:${p}`, `prayer:${p}:jamaah`]) : [i.id]));
}

/** A target's name: "Fajr", "Fajr · in congregation", "Quran" or the user's own name. */
export function targetLabel(target: WirdTarget, items: WirdItem[], t: (key: string) => string): string {
  const p = parseTarget(target);
  if ('prayer' in p) return p.jamaahOnly ? `${t(`wird.prayer.${p.prayer}`)} · ${t('wird.state.jamaah')}` : t(`wird.prayer.${p.prayer}`);
  const item = items.find((i) => i.id === p.itemId);
  return item?.name ?? t(`wird.row.${p.itemId}`);
}

/** Marks a target done or not on a date (today's tasks, a linked habit). */
export function setTargetDone(target: WirdTarget, date: string, done: boolean) {
  const patch = targetPatch(target, done, getWirdItems(), getTasksSettings().prayerTick);
  if (patch) useWirdStore.getState().updateDay(useAppStore.getState().session?.user?.id, date, patch);
}

// ── Habit links ────────────────────────────────────────────────────────────

export const HABIT_LINKS_KEY = 'habit-links';

function normalizeLinks(stored: unknown): Record<string, WirdTarget> {
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return {};
  return Object.fromEntries(Object.entries(stored).filter(([k, v]) => typeof k === 'string' && typeof v === 'string'));
}

const links = createKvStore(HABIT_LINKS_KEY, normalizeLinks);

/** habit id → the wird target it is linked to. */
export const useHabitLinks = links.useValue;
export const getHabitLinks = links.get;
export const setHabitLinks = links.set;

/** The target a habit is linked to, if the link still holds (its wird item may have been deleted or hidden). */
export function linkOf(habitId: string, allLinks: Record<string, WirdTarget>, items: WirdItem[]): WirdTarget | null {
  const target = allLinks[habitId];
  return target && targetExists(target, items) ? target : null;
}

/** The habits' days as everything should read them: a linked habit's come from the wird. */
export function effectiveHabitEntries(
  entries: HabitEntry[],
  allLinks: Record<string, WirdTarget>,
  days: Record<string, WirdDay>,
  items: WirdItem[]
): HabitEntry[] {
  const linked = Object.keys(allLinks)
    .map((habitId) => [habitId, linkOf(habitId, allLinks, items)] as const)
    .filter((pair): pair is readonly [string, WirdTarget] => pair[1] !== null);
  if (linked.length === 0) return entries;
  const linkedIds = new Set(linked.map(([id]) => id));
  const out = entries.filter((e) => !linkedIds.has(e.habitId));
  for (const [habitId, target] of linked) {
    for (const [date, day] of Object.entries(days)) {
      if (targetDone(target, day, items)) out.push({ id: `wird:${habitId}:${date}`, habitId, date });
    }
  }
  return out;
}

/** `habitEntries` with the linked habits' days read from the wird. */
export function useHabitEntries(): HabitEntry[] {
  const entries = useAppStore((s) => s.habitEntries);
  const [allLinks] = useHabitLinks();
  const [items] = useWirdItems();
  const days = useWirdStore((s) => s.days);
  return useMemo(() => effectiveHabitEntries(entries, allLinks, days, items), [entries, allLinks, days, items]);
}

/** Ticks or unticks a habit on a date; a linked habit changes the wird instead. */
export function toggleHabit(habit: Pick<Habit, 'id'>, date: string, isDone: boolean) {
  const target = linkOf(habit.id, getHabitLinks(), getWirdItems());
  if (target) setTargetDone(target, date, !isDone);
  else void useAppStore.getState().toggleHabitEntry(habit.id, date);
}

/** Links a habit to a wird target: the days it was done become the wird's. */
export async function linkHabit(habitId: string, target: WirdTarget): Promise<void> {
  const userId = useAppStore.getState().session?.user?.id;
  const items = getWirdItems();
  const days = useWirdStore.getState().days;
  const patches: Record<string, (d: WirdDay) => Partial<WirdDay>> = {};
  for (const e of useAppStore.getState().habitEntries) {
    if (e.habitId !== habitId || targetDone(target, days[e.date], items)) continue;
    const patch = targetPatch(target, true, items, getTasksSettings().prayerTick);
    if (patch) patches[e.date] = patch;
  }
  await useWirdStore.getState().updateDays(userId, patches);
  links.set((prev) => ({ ...prev, [habitId]: target }));
}

/**
 * Unlinks a habit: the days its target was done become its own days again.
 * Returns false if they couldn't be saved (the link then stays).
 */
export async function unlinkHabit(habitId: string): Promise<boolean> {
  const target = linkOf(habitId, getHabitLinks(), getWirdItems());
  if (target) {
    const items = getWirdItems();
    const dates = Object.entries(useWirdStore.getState().days)
      .filter(([, day]) => targetDone(target, day, items))
      .map(([date]) => date);
    if (!(await useAppStore.getState().setHabitEntryDates(habitId, dates))) return false;
  }
  links.set((prev) => Object.fromEntries(Object.entries(prev).filter(([id]) => id !== habitId)));
  return true;
}

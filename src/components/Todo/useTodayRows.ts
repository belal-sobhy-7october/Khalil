import { useMemo } from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { getToday } from '../../store/dateHelpers';
import { isScheduledOn } from '../../store/habitStats';
import { useTasksSettings } from '../../lib/tasksSettings';
import { EMPTY_DAY, PRAYERS, itemCount, itemDone, useWirdStore, type WirdItem } from '../../lib/wird';
import { useWirdItems } from '../../lib/wirdItems';
import { linkOf, parseTarget, setTargetDone, toggleHabit, useHabitEntries, useHabitLinks } from '../../lib/wirdSync';

export interface TodayRow {
  key: string;
  group: 'wird' | 'habit';
  label: string;
  done: boolean;
  onToggle: () => void;
  /** A short note beside the name: the prayer's state, a count toward its goal. */
  note?: string;
  /** Tapping the note (a prayed prayer: congregation ↔ alone). */
  onNote?: () => void;
  /** The habits linked to this wird row. */
  habits?: string[];
}

/**
 * Today's wird items and due habits, as rows of today's tasks. They read their
 * owner (the wird, the habits) and write to it when ticked, so the wird sheet
 * and the habits grid show the same tick at once (lib/wirdSync.ts).
 */
export function useTodayRows(): TodayRow[] {
  const { t } = useTranslation();
  const [settings] = useTasksSettings();
  const [items] = useWirdItems();
  const [links] = useHabitLinks();
  const habits = useAppStore((s) => s.habits);
  const entries = useHabitEntries();
  const userId = useAppStore((s) => s.session?.user?.id);
  const today = getToday();
  const wirdDay = useWirdStore((s) => s.days[today]);

  return useMemo(() => {
    const day = { ...EMPTY_DAY, ...wirdDay };
    const rows: TodayRow[] = [];
    const shownItems = settings.todayWird ? items.filter((i) => !i.hidden && i.inToday) : [];
    const activeHabits = habits.filter((h) => h.active).sort((a, b) => a.sortOrder - b.sortOrder);
    // Habits linked to a row shown here appear on that row, not on their own.
    const linkedTo = (match: (target: string) => boolean) =>
      activeHabits.filter((h) => {
        const target = linkOf(h.id, links, items);
        return target !== null && match(target);
      });
    const covered = new Set<string>();
    const nameOf = (item: WirdItem) => item.name ?? t(`wird.row.${item.id}`);

    for (const item of shownItems) {
      if (item.kind === 'prayers') {
        for (const p of PRAYERS) {
          const state = day.prayers[p] ?? null;
          const linked = linkedTo((target) => {
            const parsed = parseTarget(target);
            return 'prayer' in parsed && parsed.prayer === p;
          });
          linked.forEach((h) => covered.add(h.id));
          rows.push({
            key: `prayer:${p}`,
            group: 'wird',
            label: t(`wird.prayer.${p}`),
            done: state !== null,
            onToggle: () => setTargetDone(`prayer:${p}`, today, state === null),
            note: state ? t(`wird.state.${state}`) : undefined,
            onNote: state
              ? () => useWirdStore.getState().updateDay(userId, today, (d) => ({ prayers: { ...d.prayers, [p]: state === 'jamaah' ? 'alone' : 'jamaah' } }))
              : undefined,
            habits: linked.map((h) => h.name),
          });
        }
        continue;
      }
      const done = itemDone(day, item);
      const linked = linkedTo((target) => target === item.id);
      linked.forEach((h) => covered.add(h.id));
      const count = +itemCount(day, item).toFixed(2);
      const unit = item.unit ?? (item.id === 'quran' ? t('wird.juz') : item.kind === 'rawatib' || item.id === 'qiyam' ? t('wird.unit.rakaat') : '');
      rows.push({
        key: item.id,
        group: 'wird',
        label: nameOf(item),
        done,
        onToggle: () => setTargetDone(item.id, today, !done),
        note: item.kind === 'check' ? undefined : `${count}/${item.goal ?? 1}${unit ? ` ${unit}` : ''}`,
        habits: linked.map((h) => h.name),
      });
    }

    if (settings.todayHabits) {
      const doneSet = new Set(entries.filter((e) => e.date === today).map((e) => e.habitId));
      for (const h of activeHabits) {
        if (covered.has(h.id) || h.startDate > today || !isScheduledOn(h.scheduleDays, today)) continue;
        const done = doneSet.has(h.id);
        rows.push({ key: `habit:${h.id}`, group: 'habit', label: h.name, done, onToggle: () => toggleHabit(h, today, done) });
      }
    }
    return rows;
  }, [settings.todayWird, settings.todayHabits, items, links, habits, entries, wirdDay, today, userId, t]);
}

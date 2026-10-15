import { useState, useMemo, useRef, memo, useCallback } from 'react';
import {
  Star,
  Heart,
  Brain,
  BookOpen,
  Code,
  Dumbbell,
  Moon,
  Coffee,
  Music,
  Pen,
  Globe,
  Smile,
  Sun,
  Zap,
  Book,
  Utensils,
  Home,
  Plane,
  Camera,
  Headphones,
  Leaf,
  Trophy,
  Clock,
  Users,
  Plus,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Flame,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from '@floating-ui/react';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import { getHabitWeekStart, addDaysToDateString, getToday } from '../../store/dateHelpers';
import { countEligibleDays, computeHabitStats, computeStreaks, isScheduledOn, type HabitStreaks } from '../../store/habitStats';
import type { Habit } from '../../types';

const iconMap: Record<string, LucideIcon> = {
  star: Star,
  heart: Heart,
  brain: Brain,
  'book-open': BookOpen,
  code: Code,
  dumbbell: Dumbbell,
  moon: Moon,
  coffee: Coffee,
  music: Music,
  pen: Pen,
  globe: Globe,
  smile: Smile,
  sun: Sun,
  zap: Zap,
  book: Book,
  utensils: Utensils,
  home: Home,
  plane: Plane,
  camera: Camera,
  headphones: Headphones,
  leaf: Leaf,
  trophy: Trophy,
  clock: Clock,
  users: Users,
};

const ICON_OPTIONS = Object.keys(iconMap);

// Grid geometry. The label column (drag handle + icon + name + actions) is
// sticky at the logical start edge; day cells scroll underneath it. Both
// widths are CSS variables set on the grid (see `--label-w` / `--cell-w`
// below) so the header and every row share one column template via subgrid.
const RANGE_OPTIONS = [7, 30, 60] as const;
type RangeOption = (typeof RANGE_OPTIONS)[number];
const RANGE_STORAGE_KEY = 'khalil-habits-range';
// Cells get smaller as the range grows so a week fits without scrolling.
const CELL_WIDTH: Record<RangeOption, string> = { 7: '3.25rem', 30: '2.25rem', 60: '1cm' };

function readStoredRange(): RangeOption {
  try {
    const v = Number(localStorage.getItem(RANGE_STORAGE_KEY));
    if ((RANGE_OPTIONS as readonly number[]).includes(v)) return v as RangeOption;
  } catch {
    // storage unavailable — fall through to the default
  }
  return 7;
}

// Sunday-first weekday indices, matching Date.getDay() and habits.schedule_days.
const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

function weekdayName(day: number, locale: string, style: 'narrow' | 'short'): string {
  // 2026-01-04 is a Sunday.
  return new Date(Date.UTC(2026, 0, 4 + day)).toLocaleDateString(locale, { weekday: style, timeZone: 'UTC' });
}

// "3 Oct" / "٣ أكتوبر" — a raw "10-03" reads as 03-10 inside Arabic text.
function shortDate(date: string, locale: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

function dayNameOf(date: string, locale: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' });
}

function WeekdayPicker({ value, onChange, locale }: {
  value: number[] | null;
  onChange: (days: number[] | null) => void;
  locale: string;
}) {
  const selected = value ?? WEEKDAYS;
  const toggle = (day: number) => {
    const next = selected.includes(day) ? selected.filter((d) => d !== day) : [...selected, day].sort();
    // Never allow an empty schedule; all seven days is stored as "every day".
    if (next.length === 0) return;
    onChange(next.length === 7 ? null : next);
  };
  return (
    <div className="flex gap-1">
      {WEEKDAYS.map((day) => {
        const on = selected.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => toggle(day)}
            aria-pressed={on}
            title={weekdayName(day, locale, 'short')}
            className={`w-7 h-7 rounded-full text-[11px] font-medium transition-colors ${
              on ? 'bg-clay-soft text-white' : 'bg-ink/5 text-ink-light hover:bg-ink/10'
            }`}
          >
            {weekdayName(day, locale, 'narrow')}
          </button>
        );
      })}
    </div>
  );
}

// Sticky label cell chrome, shared by the header corner and each row. The
// shadow is cast toward the inline end so scrolled cells visibly slide under.
const STICKY_LABEL_CLASSES =
  'sticky start-0 bg-card border-e border-border-subtle shadow-[2px_0_4px_-2px_rgba(0,0,0,0.15)] rtl:shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.15)]';

// Row actions are hidden until the row is hovered or focused on pointer
// devices, and always visible on touch devices (no hover).
const ROW_ACTION_VISIBILITY =
  'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto';

type RowPopover = 'delete' | 'edit' | null;

const SortableHabitRow = memo(function SortableHabitRow({ habit, dates, entrySet, entryDates, today, streaks, onToggle }: {
  habit: Habit;
  dates: string[];
  entrySet: Set<string>;
  entryDates: string[];
  today: string;
  streaks: HabitStreaks;
  onToggle: (habit: Habit, date: string) => void;
}) {
  const { t, language } = useTranslation();
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: habit.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.5 : 1,
    // Above the other rows' sticky label cells (z-10) and the header corner (z-20).
    zIndex: isDragging ? 30 : undefined,
    willChange: isDragging ? 'transform' : undefined,
  };

  const [popover, setPopover] = useState<RowPopover>(null);
  const [draftStartDate, setDraftStartDate] = useState(habit.startDate);
  const [draftSchedule, setDraftSchedule] = useState<number[] | null>(habit.scheduleDays);
  const Icon = iconMap[habit.icon] || Star;

  // Popovers are portalled out of the horizontal scroller (which would clip
  // them) and anchored to the sticky label cell.
  const { refs, floatingStyles, context } = useFloating({
    open: popover !== null,
    onOpenChange: (open) => {
      if (!open) setPopover(null);
    },
    placement: 'bottom-end',
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });
  const { setReference, setFloating } = refs;
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const openEdit = () => {
    setDraftStartDate(habit.startDate);
    setDraftSchedule(habit.scheduleDays);
    setPopover((p) => (p === 'edit' ? null : 'edit'));
  };

  const excludedCount = useMemo(
    () => entryDates.filter((d) => d < draftStartDate).length,
    [entryDates, draftStartDate]
  );

  const handleSaveEdit = () => {
    const data: Partial<Pick<Habit, 'startDate' | 'scheduleDays'>> = {};
    if (draftStartDate !== habit.startDate) data.startDate = draftStartDate;
    if (JSON.stringify(draftSchedule) !== JSON.stringify(habit.scheduleDays)) data.scheduleDays = draftSchedule;
    if (Object.keys(data).length > 0) useAppStore.getState().updateHabit(habit.id, data);
    setPopover(null);
  };

  const confirmDeleteText = t('habits.confirmDelete').replace('{name}', habit.name);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group grid grid-cols-subgrid col-span-full items-center"
    >
      <div
        ref={setReference}
        className={`${STICKY_LABEL_CLASSES} z-10 relative flex items-center gap-1.5 self-stretch ps-2 pe-2 [@media(hover:none)]:pe-12`}
      >
        <span
          {...attributes}
          {...listeners}
          className="shrink-0 opacity-20 group-hover:opacity-60 hover:!opacity-100 cursor-grab active:cursor-grabbing p-1 -m-1 text-ink-lighter transition-opacity touch-none"
        >
          <GripVertical size={14} />
        </span>
        <span className="hidden sm:block shrink-0 text-clay-soft">
          <Icon size={18} />
        </span>
        <span className="min-w-0 flex-1 flex flex-col leading-tight">
          <span className="text-sm font-medium text-ink truncate" title={habit.name}>
            {habit.name}
          </span>
          <span className="text-[10px] text-ink-lighter truncate">
            {habit.scheduleDays
              ? habit.scheduleDays.map((d) => weekdayName(d, locale, 'short')).join(' · ')
              : t('habits.since').replace('{date}', shortDate(habit.startDate, locale))}
          </span>
        </span>
        {streaks.current > 0 && (
          <span
            className="shrink-0 flex items-center gap-0.5 text-[11px] font-semibold text-clay-soft tabular-nums"
            title={`${t('habits.currentStreak')}: ${streaks.current} · ${t('habits.bestStreak')}: ${streaks.best}`}
          >
            <Flame size={12} />
            {streaks.current}
          </span>
        )}

        <div
          className={`absolute inset-y-0 end-0 flex items-stretch bg-card transition-opacity ${
            popover ? 'opacity-100 pointer-events-auto' : ROW_ACTION_VISIBILITY
          }`}
        >
          <button
            onClick={openEdit}
            aria-label={t('habits.editHabitFor').replace('{name}', habit.name)}
            aria-expanded={popover === 'edit'}
            className="flex items-center justify-center w-6 text-ink-lighter hover:text-clay-soft hover:bg-clay-soft/10 transition-colors"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={() => setPopover((p) => (p === 'delete' ? null : 'delete'))}
            aria-label={t('habits.deleteHabit').replace('{name}', habit.name)}
            aria-expanded={popover === 'delete'}
            className="flex items-center justify-center w-6 text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {popover && (
        <FloatingPortal>
          <FloatingFocusManager context={context}>
            <div
              ref={setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              aria-label={popover === 'delete' ? confirmDeleteText : t('habits.editHabitFor').replace('{name}', habit.name)}
              className={`z-50 bg-card border border-border-subtle rounded-lg shadow-lg p-2 text-start ${
                popover === 'delete' ? 'w-56' : 'w-64'
              }`}
            >
              {popover === 'delete' ? (
                <>
                  <p className="text-xs text-ink mb-2 break-words">{confirmDeleteText}</p>
                  <div className="flex gap-1.5 justify-end">
                    <button
                      onClick={() => setPopover(null)}
                      className="px-2 py-1 text-[11px] rounded text-ink-light hover:bg-ink/5"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={() => useAppStore.getState().removeHabit(habit.id)}
                      className="px-2 py-1 text-[11px] rounded bg-red-500 hover:bg-red-600 text-white"
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-ink mb-1.5">{t('habits.repeatOn')}</p>
                  <div className="mb-3">
                    <WeekdayPicker value={draftSchedule} onChange={setDraftSchedule} locale={locale} />
                  </div>
                  <p className="text-xs text-ink mb-1.5">{t('habits.editStartDate')}</p>
                  <input
                    type="date"
                    value={draftStartDate}
                    max={today}
                    onChange={(e) => setDraftStartDate(e.target.value)}
                    className="w-full border border-border-subtle rounded-lg px-2 py-1.5 text-xs bg-ink/3 text-ink focus:outline-none focus:ring-1 focus:ring-clay-soft/30 mb-2"
                  />
                  {excludedCount > 0 && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mb-2">
                      {t('habits.startDateWarning').replace('{count}', String(excludedCount))}
                    </p>
                  )}
                  <div className="flex gap-1.5 justify-end">
                    <button
                      onClick={() => setPopover(null)}
                      className="px-2 py-1 text-[11px] rounded text-ink-light hover:bg-ink/5"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-2 py-1 text-[11px] rounded bg-clay-soft hover:bg-clay-soft-dark text-white"
                    >
                      {t('common.save')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}

      {dates.map((date) => {
        const isCompleted = entrySet.has(`${habit.id}|${date}`);
        const isToday = date === today;
        const isFuture = date > today;
        const beforeStart = date < habit.startDate;
        const scheduled = isScheduledOn(habit.scheduleDays, date);
        const missed = !isCompleted && !isFuture && !beforeStart && !isToday && scheduled;
        const todayRing = isToday ? 'ring-2 ring-inset ring-clay-soft/60' : '';

        if (isFuture) {
          return (
            <div
              key={date}
              aria-disabled="true"
              className="w-(--cell-w) h-(--cell-w) border border-border-subtle bg-ink/3"
            />
          );
        }

        let look: string;
        let note = '';
        if (isCompleted) {
          look = scheduled ? 'bg-clay-soft text-white' : 'bg-clay-soft/60 text-white';
        } else if (beforeStart) {
          // Hatched: not part of the habit yet, but still clickable — checking
          // it moves the start date back (the history was just never logged).
          look = 'text-transparent bg-[repeating-linear-gradient(45deg,transparent_0_4px,var(--color-border-subtle)_4px_5px)] hover:bg-ink/10';
          note = ` · ${t('habits.beforeStart')}`;
        } else if (!scheduled) {
          look = 'bg-transparent text-ink-lighter hover:bg-ink/8';
          note = ` · ${t('habits.notDue')}`;
        } else if (missed) {
          look = 'bg-red-500/8 hover:bg-ink/10';
        } else {
          look = 'bg-ink/8 hover:bg-ink/12';
        }

        return (
          <button
            key={date}
            onClick={() => onToggle(habit, date)}
            aria-label={`${habit.name} — ${date}${note}`}
            title={`${habit.name} — ${dayNameOf(date, locale)} ${shortDate(date, locale)}${note}`}
            aria-pressed={isCompleted}
            className={`w-(--cell-w) h-(--cell-w) flex items-center justify-center border border-border-subtle transition-all ${look} ${todayRing}`}
          >
            {isCompleted ? <Check size={14} strokeWidth={3} /> : !scheduled && !beforeStart ? <span className="w-1 h-1 rounded-full bg-ink-lighter/60" /> : null}
          </button>
        );
      })}
    </div>
  );
});

export default function HabitsTracker() {
  const { t, isRTL, language } = useTranslation();
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const rawHabits = useAppStore((s) => s.habits);
  const habitEntries = useAppStore((s) => s.habitEntries);
  const toggleHabitEntry = useAppStore((s) => s.toggleHabitEntry);
  const addHabit = useAppStore((s) => s.addHabit);
  const reorderHabits = useAppStore((s) => s.reorderHabits);

  const habits = useMemo(
    () => rawHabits.filter((h) => h.active).sort((a, b) => a.sortOrder - b.sortOrder),
    [rawHabits]
  );

  // One O(n) pass instead of every cell in every row running its own
  // `.some()` scan over the full habitEntries array.
  const entrySet = useMemo(() => {
    const set = new Set<string>();
    for (const e of habitEntries) set.add(`${e.habitId}|${e.date}`);
    return set;
  }, [habitEntries]);

  const entryDatesByHabit = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const e of habitEntries) {
      const arr = map.get(e.habitId);
      if (arr) arr.push(e.date);
      else map.set(e.habitId, [e.date]);
    }
    return map;
  }, [habitEntries]);

  const today = getToday();

  // The grid window is a `range`-day span ending at `windowEnd` (default: today).
  // ‹ › shift the window by one range; the "Today" button resets it.
  const [range, setRange] = useState<RangeOption>(readStoredRange);
  const [windowEnd, setWindowEnd] = useState(() => today);
  const [newHabitSchedule, setNewHabitSchedule] = useState<number[] | null>(null);

  const changeRange = (r: RangeOption) => {
    setRange(r);
    try {
      localStorage.setItem(RANGE_STORAGE_KEY, String(r));
    } catch {
      // storage unavailable — the choice just won't persist
    }
  };

  const streaksByHabit = useMemo(() => {
    const map = new Map<string, HabitStreaks>();
    for (const h of habits) {
      map.set(h.id, computeStreaks(h, new Set(entryDatesByHabit.get(h.id) ?? []), today));
    }
    return map;
  }, [habits, entryDatesByHabit, today]);

  const dueToday = useMemo(
    () => habits.filter((h) => h.startDate <= today && isScheduledOn(h.scheduleDays, today)),
    [habits, today]
  );
  const doneTodayCount = dueToday.filter((h) => entrySet.has(`${h.id}|${today}`)).length;

  // Checking a day before the start date means the habit really started
  // earlier: move the start back instead of refusing the click.
  const handleToggle = useCallback((habit: Habit, date: string) => {
    const isChecking = !entrySet.has(`${habit.id}|${date}`);
    if (isChecking && date < habit.startDate) {
      void useAppStore.getState().updateHabit(habit.id, { startDate: date });
    }
    void toggleHabitEntry(habit.id, date);
  }, [entrySet, toggleHabitEntry]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('star');
  const [newHabitStartDate, setNewHabitStartDate] = useState(() => today);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Chronological (oldest -> windowEnd); used for the range label.
  const weekDates = useMemo(() => {
    return Array.from({ length: range }, (_, i) => addDaysToDateString(windowEnd, i - (range - 1)));
  }, [windowEnd, range]);

  // Column order in the grid: newest first, so the most recent day sits right
  // next to the sticky label column and older days extend toward inline-end.
  // Rendering order only — stats/charts below use their own date ranges.
  const gridDates = useMemo(() => [...weekDates].reverse(), [weekDates]);

  const currentMonth = today.slice(0, 7);
  const daysInMonth = new Date(parseInt(currentMonth.slice(0, 4)), parseInt(currentMonth.slice(5, 7)), 0).getDate();
  const monthStart = `${currentMonth}-01`;
  const monthEnd = `${currentMonth}-${String(daysInMonth).padStart(2, '0')}`;

  // Single shared source of truth for every stat below — see src/store/habitStats.ts.
  const monthStatsByHabit = useMemo(() => {
    const map = new Map<string, ReturnType<typeof computeHabitStats>>();
    for (const h of habits) {
      map.set(h.id, computeHabitStats(h, habitEntries, monthStart, monthEnd, today));
    }
    return map;
  }, [habits, habitEntries, monthStart, monthEnd, today]);

  const goal = useMemo(
    () => habits.reduce((sum, h) => sum + (monthStatsByHabit.get(h.id)?.goal ?? 0), 0),
    [habits, monthStatsByHabit]
  );
  const completedCount = useMemo(
    () => habits.reduce((sum, h) => sum + (monthStatsByHabit.get(h.id)?.completed ?? 0), 0),
    [habits, monthStatsByHabit]
  );
  const left = goal - completedCount;
  const overallPercent = goal > 0 ? Math.round((completedCount / goal) * 100) : 0;

  const dailyProgress = useMemo(() => {
    const data: { date: string; count: number; total: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const date = addDaysToDateString(today, -i);
      let total = 0;
      let count = 0;
      for (const h of habits) {
        if (countEligibleDays(h.startDate, date, date, today, h.scheduleDays) > 0) {
          total++;
          if (entrySet.has(`${h.id}|${date}`)) count++;
        }
      }
      data.push({ date, count, total });
    }
    return data;
  }, [habits, entrySet, today]);

  const weeklyProgress = useMemo(() => {
    // Last 6 real (Saturday -> Friday) weeks, independent of the grid view above.
    const data: { week: string; count: number; total: number }[] = [];
    const thisWeekStart = getHabitWeekStart(new Date(`${today}T00:00:00`));
    for (let i = 5; i >= 0; i--) {
      const weekStart = addDaysToDateString(thisWeekStart, -i * 7);
      const weekEnd = addDaysToDateString(weekStart, 6);
      let total = 0;
      let count = 0;
      for (const h of habits) {
        const stats = computeHabitStats(h, habitEntries, weekStart, weekEnd, today);
        total += stats.goal;
        count += stats.completed;
      }
      data.push({ week: weekStart, count, total });
    }
    return data;
  }, [habits, habitEntries, today]);

  const habitAnalysis = useMemo(() => {
    return habits
      .map((habit) => {
        const stats = monthStatsByHabit.get(habit.id) ?? { completed: 0, goal: 0, left: 0, percent: 0 };
        return { habit, ...stats };
      })
      .sort((a, b) => b.percent - a.percent);
  }, [habits, monthStatsByHabit]);

  const topHabits = habitAnalysis.slice(0, 10);

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), newHabitIcon, newHabitStartDate, newHabitSchedule);
    setNewHabitName('');
    setNewHabitSchedule(null);
    setNewHabitIcon('star');
    setNewHabitStartDate(today);
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewHabitName('');
    setNewHabitSchedule(null);
    setNewHabitIcon('star');
    setNewHabitStartDate(today);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = habits.findIndex((h) => h.id === String(active.id));
      const newIndex = habits.findIndex((h) => h.id === String(over.id));
      const newIds = [...habits.map((h) => h.id)];
      newIds.splice(oldIndex, 1);
      newIds.splice(newIndex, 0, String(active.id));
      reorderHabits(newIds);
    }
  };

  // The newest date of the window is the first column, so the scroll start
  // already shows it. scrollLeft 0 is the inline start in both LTR and RTL, so
  // no direction-specific math is needed.
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollGridToStart = () => {
    scrollContainerRef.current?.scrollTo({ left: 0 });
  };

  const goToPrevWeek = () => {
    setWindowEnd((w) => addDaysToDateString(w, -range));
    scrollGridToStart();
  };

  const goToNextWeek = () => {
    setWindowEnd((w) => (addDaysToDateString(w, range) > today ? today : addDaysToDateString(w, range)));
    scrollGridToStart();
  };

  const goToToday = () => {
    setWindowEnd(today);
    scrollGridToStart();
  };

  const dateRangeLabel = `${weekDates[0].slice(5)} → ${weekDates[weekDates.length - 1].slice(5)}`;

  return (
    <section id="section-habits">
      <div className="flex items-center gap-2 mb-6">
        <Star size={20} className="text-clay-soft" />
        <h2 className="text-2xl font-bold font-amiri text-ink leading-relaxed">
          {t('habits.title')}
        </h2>
      </div>

      {/* Today: one tap per habit, the thing you open the page for */}
      {habits.length > 0 && (
        <div className="bg-card border border-border-subtle rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-ink">{t('habits.todayTitle')}</div>
            <div className="text-xs text-ink-light tabular-nums">
              {dueToday.length === 0
                ? t('habits.noneDueToday')
                : doneTodayCount === dueToday.length
                  ? t('habits.allDoneToday')
                  : t('habits.doneToday').replace('{done}', String(doneTodayCount)).replace('{total}', String(dueToday.length))}
            </div>
          </div>
          {dueToday.length > 0 && (
            <>
              <div className="h-1.5 bg-ink/8 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-clay-soft rounded-full transition-all"
                  style={{ width: `${(doneTodayCount / dueToday.length) * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {dueToday.map((h) => {
                  const done = entrySet.has(`${h.id}|${today}`);
                  const HIcon = iconMap[h.icon] || Star;
                  const streak = streaksByHabit.get(h.id)?.current ?? 0;
                  return (
                    <button
                      key={h.id}
                      onClick={() => handleToggle(h, today)}
                      aria-pressed={done}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                        done
                          ? 'bg-clay-soft border-clay-soft text-white'
                          : 'border-border-subtle text-ink hover:border-clay-soft/60 hover:bg-clay-soft/5'
                      }`}
                    >
                      {done ? <Check size={16} strokeWidth={3} /> : <HIcon size={16} className="text-clay-soft" />}
                      <span className={done ? 'line-through decoration-white/50' : ''}>{h.name}</span>
                      {streak > 0 && (
                        <span className={`flex items-center gap-0.5 text-[11px] tabular-nums ${done ? 'text-white/90' : 'text-clay-soft'}`}>
                          <Flame size={11} />
                          {streak}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-xs text-ink-light mb-1">{t('habits.goal')}</div>
          <div className="text-2xl font-bold text-ink">{goal}</div>
        </div>
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-xs text-ink-light mb-1">{t('habits.completed')}</div>
          <div className="text-2xl font-bold text-clay-soft">{completedCount}</div>
        </div>
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-xs text-ink-light mb-1">{t('habits.left')}</div>
          <div className="text-2xl font-bold text-ink">{left}</div>
        </div>
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-xs text-ink-light mb-1">{t('habits.overall')}</div>
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-ink">{overallPercent}%</div>
            <div
              className="w-10 h-10 rounded-full relative"
              style={{
                background: `conic-gradient(var(--color-clay-soft) ${overallPercent}%, var(--color-sage-soft) ${overallPercent}%)`,
              }}
            >
              <div className="absolute inset-2 bg-card rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Progress charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-sm font-medium text-ink mb-3">{t('habits.dailyProgress')}</div>
          <div className="flex items-end gap-1 h-20">
            {dailyProgress.map((dp) => {
              const percent = dp.total > 0 ? (dp.count / dp.total) * 100 : 0;
              return (
                <div key={dp.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-clay-soft rounded-t transition-all"
                    style={{ height: `${Math.max(percent, 4)}%` }}
                  />
                  <div className="text-[10px] text-ink-lighter">
                    {dp.date.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-card border border-border-subtle rounded-xl p-4">
          <div className="text-sm font-medium text-ink mb-3">{t('habits.weeklyProgress')}</div>
          <div className="flex items-end gap-1 h-20">
            {weeklyProgress.map((wp) => {
              const percent = wp.total > 0 ? (wp.count / wp.total) * 100 : 0;
              return (
                <div key={wp.week} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-sage-soft rounded-t transition-all"
                    style={{ height: `${Math.max(percent, 4)}%` }}
                  />
                  <div className="text-[10px] text-ink-lighter">
                    {wp.week.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Week grid */}
      <div className="bg-card border border-border-subtle rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPrevWeek}
              aria-label="Previous period"
              className="p-1 rounded hover:bg-ink/5 text-ink-light transition-colors"
            >
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-ink">
                {dateRangeLabel}
              </div>
              <button
                onClick={goToToday}
                className="px-2 py-1 rounded-md text-xs text-ink-light hover:text-ink hover:bg-ink/5 border border-border-subtle transition-colors"
              >
                {t('habits.today')}
              </button>
              <div className="flex rounded-md border border-border-subtle overflow-hidden" role="group" aria-label={t('habits.range')}>
                {RANGE_OPTIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => changeRange(r)}
                    aria-pressed={range === r}
                    className={`px-2 py-1 text-xs transition-colors ${
                      range === r ? 'bg-clay-soft text-white' : 'text-ink-light hover:bg-ink/5'
                    }`}
                  >
                    {t('habits.days').replace('{count}', String(r))}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={goToNextWeek}
              aria-label="Next period"
              className="p-1 rounded hover:bg-ink/5 text-ink-light transition-colors"
            >
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          <div ref={scrollContainerRef} className="overflow-x-auto overscroll-x-contain">
            {/* One grid for header + rows (rows are subgrids) so columns always align. */}
            <div
              className="grid w-max gap-y-0.5 border border-border-subtle [--label-w:170px] sm:[--label-w:220px]"
              style={{ gridTemplateColumns: `var(--label-w) repeat(${range}, var(--cell-w))`, ['--cell-w' as string]: CELL_WIDTH[range] }}
            >
              <div className="grid grid-cols-subgrid col-span-full">
                <div className={`${STICKY_LABEL_CLASSES} z-20`} />
                {gridDates.map((date) => (
                  <div
                    key={date}
                    className={`text-center py-1 w-(--cell-w) h-(--cell-w) border border-border-subtle flex items-center justify-center ${
                      date === today ? 'bg-clay-soft/10 ring-1 ring-inset ring-clay-soft/40' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center leading-tight text-ink-lighter">
                      {range !== 60 && <span className="text-[9px]">{dayNameOf(date, locale)}</span>}
                      <span className={`text-[10px] ${date === today ? 'text-clay-soft font-semibold' : ''}`}>
                        {range === 7 ? date.slice(8) : date.slice(5)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={habits.map((h) => h.id)} strategy={verticalListSortingStrategy}>
                  {habits.map((habit) => (
                    <SortableHabitRow
                      key={habit.id}
                      habit={habit}
                      dates={gridDates}
                      entrySet={entrySet}
                      entryDates={entryDatesByHabit.get(habit.id) ?? []}
                      today={today}
                      streaks={streaksByHabit.get(habit.id) ?? { current: 0, best: 0 }}
                      onToggle={handleToggle}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>

          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-ink-light hover:text-ink border border-dashed border-border-subtle hover:border-ink-lighter transition-all"
            >
              <Plus size={14} />
              {t('habits.addPlaceholder')}
            </button>
          ) : (
            <div className="mt-4 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {ICON_OPTIONS.map((key) => {
                  const OptionIcon = iconMap[key];
                  const selected = newHabitIcon === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNewHabitIcon(key)}
                      aria-label={key}
                      aria-pressed={selected}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        selected
                          ? 'bg-clay-soft text-white border-clay-soft'
                          : 'border-border-subtle text-ink-light hover:bg-ink/5'
                      }`}
                    >
                      <OptionIcon size={14} />
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                  placeholder={t('habits.addPlaceholder')}
                  className="flex-1 min-w-[10rem] border border-border-subtle rounded-lg px-3 py-2 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-1 focus:ring-clay-soft/30"
                />
                <label className="flex items-center gap-1.5 text-xs text-ink-light">
                  {t('habits.startDate')}
                  <input
                    type="date"
                    value={newHabitStartDate}
                    max={today}
                    onChange={(e) => setNewHabitStartDate(e.target.value)}
                    className="border border-border-subtle rounded-lg px-2 py-1.5 text-sm bg-ink/3 text-ink focus:outline-none focus:ring-1 focus:ring-clay-soft/30"
                  />
                </label>
                <div className="flex items-center gap-1.5 text-xs text-ink-light">
                  {t('habits.repeatOn')}
                  <WeekdayPicker value={newHabitSchedule} onChange={setNewHabitSchedule} locale={locale} />
                </div>
                <button
                  onClick={handleAddHabit}
                  disabled={!newHabitName.trim()}
                  className="px-4 py-2 text-xs font-medium bg-clay-soft hover:bg-clay-soft-dark disabled:opacity-40 text-white rounded-lg transition-colors"
                >
                  {t('common.add')}
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="px-4 py-2 text-xs font-medium text-ink-light hover:text-ink"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}

          {habits.length === 0 && (
            <p className="text-sm text-ink-light text-center py-8">
              {t('habits.empty')}
            </p>
          )}
        </div>

        {/* Analysis and Top Habits - full width below grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Analysis */}
          <div className="bg-card border border-border-subtle rounded-xl p-4">
            <div className="text-sm font-medium text-ink mb-3">{t('habits.analysis')}</div>
            <div className="space-y-2">
              {habitAnalysis.map((ha) => (
                <div key={ha.habit.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink truncate flex-1">{ha.habit.name}</span>
                    <span
                      className="flex items-center gap-0.5 text-clay-soft tabular-nums me-3"
                      title={`${t('habits.currentStreak')} / ${t('habits.bestStreak')}`}
                    >
                      <Flame size={11} />
                      {streaksByHabit.get(ha.habit.id)?.current ?? 0} / {streaksByHabit.get(ha.habit.id)?.best ?? 0}
                    </span>
                    <span className="text-ink-light tabular-nums">
                      {ha.completed}/{ha.goal}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-ink/8 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-clay-soft rounded-full"
                        style={{ width: `${ha.percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-ink-light tabular-nums w-8 text-end">
                      {ha.percent}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Habits */}
          <div className="bg-card border border-border-subtle rounded-xl p-4">
            <div className="text-sm font-medium text-ink mb-3">{t('habits.topHabits')}</div>
            <div className="space-y-2">
              {topHabits.map((ha, index) => (
                <div key={ha.habit.id} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-clay-soft/10 text-clay-soft text-xs flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <span className="text-xs text-ink flex-1 truncate">{ha.habit.name}</span>
                  <span className="text-xs text-ink-light tabular-nums">{ha.percent}%</span>
                </div>
              ))}
              {topHabits.length === 0 && (
                <p className="text-xs text-ink-light text-center py-2">
                  {t('habits.empty')}
                </p>
              )}
            </div>
          </div>
        </div>
    </section>
  );
}

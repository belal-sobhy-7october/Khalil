import { useState, useMemo, useRef, memo } from 'react';
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
import { countEligibleDays, computeHabitStats } from '../../store/habitStats';
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
const DAYS_PER_VIEW = 60;
const STEP_DAYS = 30;

// Sticky label cell chrome, shared by the header corner and each row. The
// shadow is cast toward the inline end so scrolled cells visibly slide under.
const STICKY_LABEL_CLASSES =
  'sticky start-0 bg-card border-e border-border-subtle shadow-[2px_0_4px_-2px_rgba(0,0,0,0.15)] rtl:shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.15)]';

// Row actions are hidden until the row is hovered or focused on pointer
// devices, and always visible on touch devices (no hover).
const ROW_ACTION_VISIBILITY =
  'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:pointer-events-auto';

type RowPopover = 'delete' | 'editStartDate' | null;

const SortableHabitRow = memo(function SortableHabitRow({ habit, dates, entrySet, entryDates, today, onToggle }: {
  habit: Habit;
  dates: string[];
  entrySet: Set<string>;
  entryDates: string[];
  today: string;
  onToggle: (habitId: string, date: string) => void;
}) {
  const { t } = useTranslation();
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

  const openEditStartDate = () => {
    setDraftStartDate(habit.startDate);
    setPopover((p) => (p === 'editStartDate' ? null : 'editStartDate'));
  };

  const excludedCount = useMemo(
    () => entryDates.filter((d) => d < draftStartDate).length,
    [entryDates, draftStartDate]
  );

  const handleSaveStartDate = () => {
    useAppStore.getState().updateHabit(habit.id, { startDate: draftStartDate });
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
        <span className="min-w-0 flex-1 text-sm font-medium text-ink truncate" title={habit.name}>
          {habit.name}
        </span>

        <div
          className={`absolute inset-y-0 end-0 flex items-stretch bg-card transition-opacity ${
            popover ? 'opacity-100 pointer-events-auto' : ROW_ACTION_VISIBILITY
          }`}
        >
          <button
            onClick={openEditStartDate}
            aria-label={t('habits.editStartDateFor').replace('{name}', habit.name)}
            aria-expanded={popover === 'editStartDate'}
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
              aria-label={popover === 'delete' ? confirmDeleteText : t('habits.editStartDateFor').replace('{name}', habit.name)}
              className={`z-50 bg-card border border-border-subtle rounded-lg shadow-lg p-2 text-start ${
                popover === 'delete' ? 'w-56' : 'w-52'
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
                  <p className="text-xs text-ink mb-2">{t('habits.editStartDate')}</p>
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
                      onClick={handleSaveStartDate}
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
        const disabled = date < habit.startDate || date > today;

        if (disabled) {
          return (
            <div
              key={date}
              aria-disabled="true"
              aria-label={`${habit.name} — ${date}`}
              className={`w-(--cell-w) h-(--cell-w) flex items-center justify-center border border-border-subtle bg-ink/3 cursor-not-allowed ${
                isToday ? 'ring-1 ring-inset ring-clay-soft/40' : ''
              }`}
            />
          );
        }

        return (
          <button
            key={date}
            onClick={() => onToggle(habit.id, date)}
            aria-label={`${habit.name} — ${date}`}
            aria-pressed={isCompleted}
            className={`w-(--cell-w) h-(--cell-w) flex items-center justify-center border border-border-subtle transition-all ${
              isCompleted
                ? 'bg-clay-soft text-white'
                : 'bg-ink/8 text-ink-lighter hover:bg-ink/10'
            } ${isToday ? 'ring-1 ring-inset ring-clay-soft/40' : ''}`}
          >
            {isCompleted && <Star size={10} fill="currentColor" />}
          </button>
        );
      })}
    </div>
  );
});

export default function HabitsTracker() {
  const { t, isRTL } = useTranslation();
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

  // The grid window is a fixed 60-day span ending at `windowEnd` (default: today).
  // ‹ › shift the window by 30 days; the "Today" button resets it.
  const [windowEnd, setWindowEnd] = useState(() => today);
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
    return Array.from({ length: DAYS_PER_VIEW }, (_, i) => addDaysToDateString(windowEnd, i - (DAYS_PER_VIEW - 1)));
  }, [windowEnd]);

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
        if (countEligibleDays(h.startDate, date, date, today) > 0) {
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
    addHabit(newHabitName.trim(), newHabitIcon, newHabitStartDate);
    setNewHabitName('');
    setNewHabitIcon('star');
    setNewHabitStartDate(today);
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewHabitName('');
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
    setWindowEnd((w) => addDaysToDateString(w, -STEP_DAYS));
    scrollGridToStart();
  };

  const goToNextWeek = () => {
    setWindowEnd((w) => addDaysToDateString(w, STEP_DAYS));
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
              className="grid w-max gap-y-0.5 border border-border-subtle [--label-w:152px] sm:[--label-w:200px] [--cell-w:1cm]"
              style={{ gridTemplateColumns: `var(--label-w) repeat(${DAYS_PER_VIEW}, var(--cell-w))` }}
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
                    <div className="text-[10px] text-ink-lighter">
                      {date.slice(5)}
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
                      onToggle={toggleHabitEntry}
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

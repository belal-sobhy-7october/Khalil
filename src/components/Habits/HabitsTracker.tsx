import { useState, useMemo, useRef, useLayoutEffect, memo } from 'react';
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
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import { getHabitWeekStart, addDaysToDateString, daysBetweenDateStrings, getToday } from '../../store/dateHelpers';
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

// Merged drag-handle + name column (206px = 24px handle + 2px internal gap +
// 180px name), pinned at the logical start edge. A single sticky box (instead
// of two adjacent ones, see `grid-cols-[206px_...]` below) means there's no
// exposed grid gutter between them for scrolling day cells to bleed through.
const DAYS_PER_VIEW = 60;
const STEP_DAYS = 30;

const SortableHabitRow = memo(function SortableHabitRow({ habit, weekDates, entrySet, entryDates, today, onToggle }: {
  habit: Habit;
  weekDates: string[];
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
    zIndex: isDragging ? 10 : undefined,
    willChange: isDragging ? 'transform' : undefined,
  };

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editingStartDate, setEditingStartDate] = useState(false);
  const [draftStartDate, setDraftStartDate] = useState(habit.startDate);
  const Icon = iconMap[habit.icon] || Star;

  const openEditStartDate = () => {
    setDraftStartDate(habit.startDate);
    setEditingStartDate(true);
  };

  const excludedCount = useMemo(
    () => entryDates.filter((d) => d < draftStartDate).length,
    [entryDates, draftStartDate]
  );

  const handleSaveStartDate = () => {
    useAppStore.getState().updateHabit(habit.id, { startDate: draftStartDate });
    setEditingStartDate(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group grid grid-cols-[206px_repeat(60,1cm)_1cm] border-b border-r border-l border-border-subtle items-center"
    >
      <div className="flex items-center gap-2 px-2 py-1 sticky start-0 bg-card z-10 border-e border-border-subtle shadow-[2px_0_4px_-2px_rgba(0,0,0,0.15)]">
        <span
          {...attributes}
          {...listeners}
          className="shrink-0 opacity-20 group-hover:opacity-60 hover:!opacity-100 cursor-grab active:cursor-grabbing p-1 -m-1 text-ink-lighter transition-opacity touch-none"
        >
          <GripVertical size={14} />
        </span>
        <span className="shrink-0 text-clay-soft">
          <Icon size={18} />
        </span>
        <span className="text-sm font-medium text-ink truncate">
          {habit.name}
        </span>
      </div>

      {weekDates.map((date) => {
        const isCompleted = entrySet.has(`${habit.id}|${date}`);
        const isToday = date === today;
        const disabled = date < habit.startDate || date > today;

        if (disabled) {
          return (
            <div
              key={date}
              aria-disabled="true"
              aria-label={`${habit.name} — ${date}`}
              className={`w-[1cm] h-[1cm] flex items-center justify-center border border-border-subtle bg-ink/3 cursor-not-allowed ${
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
            className={`w-[1cm] h-[1cm] flex items-center justify-center border border-border-subtle transition-all ${
              isCompleted
                ? 'bg-clay-soft text-white'
                : 'bg-ink/8 text-ink-lighter hover:bg-ink/10'
            } ${isToday ? 'ring-1 ring-inset ring-clay-soft/40' : ''}`}
          >
            {isCompleted && <Star size={10} fill="currentColor" />}
          </button>
        );
      })}

      <div className="relative w-[1cm] h-[1cm] shrink-0 flex items-center justify-center gap-0.5">
        <button
          onClick={openEditStartDate}
          aria-label={t('habits.editStartDate')}
          className="flex items-center justify-center w-[0.5cm] h-[1cm] text-ink-lighter hover:text-clay-soft hover:bg-clay-soft/10 transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
        >
          <Pencil size={11} />
        </button>
        <button
          onClick={() => setConfirmingDelete(true)}
          aria-label={t('common.delete')}
          className="flex items-center justify-center w-[0.5cm] h-[1cm] text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
        >
          <Trash2 size={11} />
        </button>
        {confirmingDelete && (
          <div
            role="dialog"
            aria-label={t('habits.confirmDelete')}
            className="absolute z-30 bottom-full end-0 mb-1 w-40 bg-card border border-border-subtle rounded-lg shadow-lg p-2 text-start"
          >
            <p className="text-xs text-ink mb-2">{t('habits.confirmDelete')}</p>
            <div className="flex gap-1.5 justify-end">
              <button
                onClick={() => setConfirmingDelete(false)}
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
          </div>
        )}
        {editingStartDate && (
          <div
            role="dialog"
            aria-label={t('habits.editStartDate')}
            className="absolute z-30 bottom-full end-0 mb-1 w-52 bg-card border border-border-subtle rounded-lg shadow-lg p-2 text-start"
          >
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
                onClick={() => setEditingStartDate(false)}
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
          </div>
        )}
      </div>
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

  const weekDates = useMemo(() => {
    return Array.from({ length: DAYS_PER_VIEW }, (_, i) => addDaysToDateString(windowEnd, i - (DAYS_PER_VIEW - 1)));
  }, [windowEnd]);

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

  const goToPrevWeek = () => {
    setWindowEnd((w) => addDaysToDateString(w, -STEP_DAYS));
  };

  const goToNextWeek = () => {
    setWindowEnd((w) => addDaysToDateString(w, STEP_DAYS));
  };

  const goToToday = () => {
    setWindowEnd(today);
  };

  const dateRangeLabel = `${weekDates[0].slice(5)} → ${weekDates[weekDates.length - 1].slice(5)}`;

  // --- Open-on-today scroll behavior ---
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stickyCornerRef = useRef<HTMLDivElement>(null);
  const headerCellRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // The date within the current window closest to today (usually today itself,
  // when the window hasn't been paged away from the default).
  const anchorDate = useMemo(() => {
    return weekDates.reduce(
      (best, d) => (Math.abs(daysBetweenDateStrings(d, today)) < Math.abs(daysBetweenDateStrings(best, today)) ? d : best),
      weekDates[0]
    );
  }, [weekDates, today]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    const sticky = stickyCornerRef.current;
    if (!container) return;
    const frame = requestAnimationFrame(() => {
      // Reserve space for the sticky column so scrollIntoView doesn't tuck the
      // target underneath it — measured, not hardcoded, so it stays correct if
      // the sticky column's width ever changes.
      if (sticky) {
        container.style.scrollPaddingInlineStart = `${sticky.offsetWidth}px`;
      }
      const target = headerCellRefs.current.get(anchorDate);
      target?.scrollIntoView({ inline: 'start', block: 'nearest' });
    });
    return () => cancelAnimationFrame(frame);
  }, [anchorDate, isRTL]);

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
            <div className="grid grid-cols-[206px_repeat(60,1cm)_1cm] border border-border-subtle mb-0">
              <div ref={stickyCornerRef} className="border border-border-subtle sticky start-0 bg-card z-10 border-e border-border-subtle shadow-[2px_0_4px_-2px_rgba(0,0,0,0.15)]" />
              {weekDates.map((date) => (
                <div
                  key={date}
                  ref={(el) => {
                    if (el) headerCellRefs.current.set(date, el);
                    else headerCellRefs.current.delete(date);
                  }}
                  className={`text-center py-1 w-[1cm] h-[1cm] border border-border-subtle flex items-center justify-center ${
                    date === today ? 'bg-clay-soft/10 ring-1 ring-inset ring-clay-soft/40' : ''
                  }`}
                >
                  <div className="text-[10px] text-ink-lighter">
                    {date.slice(5)}
                  </div>
                </div>
              ))}
              <div />
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={habits.map((h) => h.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-0.5">
                  {habits.map((habit) => (
                    <SortableHabitRow
                      key={habit.id}
                      habit={habit}
                      weekDates={weekDates}
                      entrySet={entrySet}
                      entryDates={entryDatesByHabit.get(habit.id) ?? []}
                      today={today}
                      onToggle={toggleHabitEntry}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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

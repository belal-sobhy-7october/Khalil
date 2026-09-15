import { useState, useMemo } from 'react';
import {
  Star,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  GripVertical,
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import { getHabitWeekStart, addDaysToDateString, getToday } from '../../store/dateHelpers';

const iconMap: Record<string, React.ReactNode> = {
  'star': <Star size={18} />,
  'heart': <Star size={18} />,
  'brain': <Star size={18} />,
  'book-open': <Star size={18} />,
  'code': <Star size={18} />,
  'dumbbell': <Star size={18} />,
  'moon': <Star size={18} />,
  'coffee': <Star size={18} />,
  'music': <Star size={18} />,
  'pen': <Star size={18} />,
  'globe': <Star size={18} />,
  'smile': <Star size={18} />,
  'sun': <Star size={18} />,
  'zap': <Star size={18} />,
  'book': <Star size={18} />,
  'utensils': <Star size={18} />,
  'home': <Star size={18} />,
  'plane': <Star size={18} />,
  'camera': <Star size={18} />,
  'headphones': <Star size={18} />,
  'leaf': <Star size={18} />,
  'trophy': <Star size={18} />,
  'clock': <Star size={18} />,
  'users': <Star size={18} />,
};

function SortableHabitRow({ habit, weekDates, onToggle }: {
  habit: { id: string; name: string; icon: string; sortOrder: number };
  weekDates: string[];
  onToggle: (habitId: string, date: string) => void;
}) {
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

  const habitEntries = useAppStore((s) => s.habitEntries);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group grid grid-cols-[24px_180px_repeat(45,1cm)_24px] gap-0.5 border-b border-r border-l border-border-subtle items-center"
    >
      <div
        {...attributes}
        {...listeners}
        className="shrink-0 opacity-20 group-hover:opacity-60 hover:!opacity-100 cursor-grab active:cursor-grabbing p-1 text-ink-lighter transition-opacity touch-none sticky start-0 bg-card z-10 border-e border-border-subtle"
      >
        <GripVertical size={14} />
      </div>
      <div className="flex items-center gap-2 px-2 py-1 border border-border-subtle sticky start-0 bg-card z-10 border-e border-border-subtle">
        <span className="shrink-0 text-clay-soft">{iconMap[habit.icon] || iconMap.star}</span>
        <span className="text-sm font-medium text-ink truncate">
          {habit.name}
        </span>
      </div>

      {weekDates.map((date) => {
        const isCompleted = habitEntries.some(
          (e) => e.habitId === habit.id && e.date === date
        );
        return (
          <button
            key={date}
            onClick={() => onToggle(habit.id, date)}
            className={`w-[1cm] h-[1cm] flex items-center justify-center border border-border-subtle transition-all ${
              isCompleted
                ? 'bg-clay-soft text-white'
                : 'bg-ink/8 text-ink-lighter hover:bg-ink/10'
            }`}
          >
            {isCompleted && <Star size={10} fill="currentColor" />}
          </button>
        );
      })}

      <button
        onClick={() => useAppStore.getState().removeHabit(habit.id)}
        className="flex items-center justify-center w-[1cm] h-[1cm] opacity-0 group-hover:opacity-100 text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all shrink-0"
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
}

export default function HabitsTracker() {
  const { t } = useTranslation();
  const rawHabits = useAppStore((s) => s.habits);
  const habitEntries = useAppStore((s) => s.habitEntries);
  const toggleHabitEntry = useAppStore((s) => s.toggleHabitEntry);
  const addHabit = useAppStore((s) => s.addHabit);
  const reorderHabits = useAppStore((s) => s.reorderHabits);

  const habits = useMemo(
    () => rawHabits.filter((h) => h.active).sort((a, b) => a.sortOrder - b.sortOrder),
    [rawHabits]
  );

  const [currentWeekStart, setCurrentWeekStart] = useState(() => getHabitWeekStart());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const DAYS_PER_VIEW = 45;
  const weekDates = useMemo(() => {
    return Array.from({ length: DAYS_PER_VIEW }, (_, i) => addDaysToDateString(currentWeekStart, i));
  }, [currentWeekStart]);

  const today = getToday();
  const currentMonth = today.slice(0, 7);
  const daysInMonth = new Date(parseInt(currentMonth.slice(0, 4)), parseInt(currentMonth.slice(5, 7)), 0).getDate();

  const monthEntries = habitEntries.filter((e) => e.date.startsWith(currentMonth));
  const completedCount = monthEntries.length;
  const goal = habits.length * daysInMonth;
  const left = goal - completedCount;
  const overallPercent = goal > 0 ? Math.round((completedCount / goal) * 100) : 0;

  const dailyProgress = useMemo(() => {
    const data: { date: string; count: number; total: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const date = addDaysToDateString(today, -i);
      const count = habitEntries.filter((e) => e.date === date).length;
      data.push({ date, count, total: habits.length });
    }
    return data;
  }, [habitEntries, habits.length, today]);

  const weeklyProgress = useMemo(() => {
    const data: { week: string; count: number; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const weekStart = addDaysToDateString(currentWeekStart, -i * DAYS_PER_VIEW);
      const weekEnd = addDaysToDateString(weekStart, DAYS_PER_VIEW - 1);
      const count = habitEntries.filter(
        (e) => e.date >= weekStart && e.date <= weekEnd
      ).length;
      data.push({ week: weekStart, count, total: habits.length * DAYS_PER_VIEW });
    }
    return data;
  }, [habitEntries, habits.length, currentWeekStart, DAYS_PER_VIEW]);

  const habitAnalysis = useMemo(() => {
    return habits.map((habit) => {
      const habitMonthEntries = monthEntries.filter((e) => e.habitId === habit.id).length;
      const habitGoal = daysInMonth;
      const habitLeft = habitGoal - habitMonthEntries;
      const habitPercent = habitGoal > 0 ? Math.round((habitMonthEntries / habitGoal) * 100) : 0;
      return {
        habit,
        completed: habitMonthEntries,
        goal: habitGoal,
        left: habitLeft,
        percent: habitPercent,
      };
    }).sort((a, b) => b.percent - a.percent);
  }, [habits, monthEntries, daysInMonth]);

  const topHabits = habitAnalysis.slice(0, 10);

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim(), 'star');
    setNewHabitName('');
    setShowAddForm(false);
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
    setCurrentWeekStart(addDaysToDateString(currentWeekStart, -DAYS_PER_VIEW));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDaysToDateString(currentWeekStart, DAYS_PER_VIEW));
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
              className="p-1 rounded hover:bg-ink/5 text-ink-light transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-sm font-medium text-ink">
              {dateRangeLabel}
            </div>
            <button
              onClick={goToNextWeek}
              className="p-1 rounded hover:bg-ink/5 text-ink-light transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="overflow-x-auto overscroll-x-contain">
            <div className="grid grid-cols-[24px_180px_repeat(45,1cm)_24px] gap-0.5 border border-border-subtle mb-0">
              <div className="border border-border-subtle sticky start-0 bg-card z-10 border-e border-border-subtle" />
              <div className="px-2 py-1 border border-border-subtle sticky start-0 bg-card z-10 border-e border-border-subtle" />
              {weekDates.map((date) => (
                <div key={date} className="text-center py-1 w-[1cm] h-[1cm] border border-border-subtle flex items-center justify-center">
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
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                placeholder={t('habits.addPlaceholder')}
                className="flex-1 border border-border-subtle rounded-lg px-3 py-2 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-1 focus:ring-clay-soft/30"
              />
              <button
                onClick={handleAddHabit}
                disabled={!newHabitName.trim()}
                className="px-4 py-2 text-xs font-medium bg-clay-soft hover:bg-clay-soft-dark disabled:opacity-40 text-white rounded-lg transition-colors"
              >
                {t('common.add')}
              </button>
              <button
                onClick={() => { setShowAddForm(false); setNewHabitName(''); }}
                className="px-4 py-2 text-xs font-medium text-ink-light hover:text-ink"
              >
                {t('common.cancel')}
              </button>
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

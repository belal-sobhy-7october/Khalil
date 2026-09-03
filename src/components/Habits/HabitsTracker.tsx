import { useState, useMemo } from 'react';
import {
  Star,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Smile,
  Zap,
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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: habit.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const habitEntries = useAppStore((s) => s.habitEntries);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group flex items-center gap-2 bg-ink/3 rounded-lg px-4 py-3 border border-border-subtle"
    >
      <div className="flex items-center gap-2 min-w-0 flex-[2]">
        <span className="shrink-0 text-clay-soft">{iconMap[habit.icon] || iconMap.star}</span>
        <span className="text-sm font-medium text-ink truncate">
          {habit.name}
        </span>
      </div>

      <div className="flex items-center gap-1 flex-1">
        {weekDates.map((date) => {
          const isCompleted = habitEntries.some(
            (e) => e.habitId === habit.id && e.date === date
          );
          return (
            <button
              key={date}
              onClick={() => onToggle(habit.id, date)}
              className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                isCompleted
                  ? 'bg-clay-soft text-white'
                  : 'bg-ink/8 text-ink-lighter hover:bg-ink/10'
              }`}
            >
              {isCompleted && <Star size={12} fill="currentColor" />}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => useAppStore.getState().removeHabit(habit.id)}
        className="flex items-center justify-center w-5 h-5 rounded opacity-0 group-hover:opacity-100 text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all shrink-0"
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
  const dailyMoods = useAppStore((s) => s.dailyMoods);
  const toggleHabitEntry = useAppStore((s) => s.toggleHabitEntry);
  const setDailyMood = useAppStore((s) => s.setDailyMood);
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

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDaysToDateString(currentWeekStart, i));
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
      const weekStart = addDaysToDateString(currentWeekStart, -i * 7);
      const weekEnd = addDaysToDateString(weekStart, 6);
      const count = habitEntries.filter(
        (e) => e.date >= weekStart && e.date <= weekEnd
      ).length;
      data.push({ week: weekStart, count, total: habits.length * 7 });
    }
    return data;
  }, [habitEntries, habits.length, currentWeekStart]);

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
    setCurrentWeekStart(addDaysToDateString(currentWeekStart, -7));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(addDaysToDateString(currentWeekStart, 7));
  };

  const weekNumber = Math.ceil((parseInt(currentWeekStart.slice(8, 10)) + 1) / 7);

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

      <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-6">
        {/* Week grid */}
        <div className="bg-card border border-border-subtle rounded-xl p-4 mb-6 lg:mb-0">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPrevWeek}
              className="p-1 rounded hover:bg-ink/5 text-ink-light transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-sm font-medium text-ink">
              {t('habits.week')} {weekNumber}
            </div>
            <button
              onClick={goToNextWeek}
              className="p-1 rounded hover:bg-ink/5 text-ink-light transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex gap-1 mb-2 px-4">
            {weekDates.map((date) => (
              <div key={date} className="flex-1 text-center">
                <div className="text-[10px] text-ink-lighter">
                  {date.slice(5)}
                </div>
              </div>
            ))}
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={habits.map((h) => h.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
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

        {/* Side panel */}
        <div className="space-y-6">
          {/* Mood/Motivation */}
          <div className="bg-card border border-border-subtle rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Smile size={16} className="text-clay-soft" />
              <div className="text-sm font-medium text-ink">{t('habits.mood')}</div>
            </div>
            <div className="flex gap-1">
              {weekDates.map((date) => {
                const mood = dailyMoods.find((m) => m.date === date)?.mood;
                return (
                  <div key={date} className="flex-1">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={mood ?? ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1 && val <= 5) {
                          setDailyMood(date, { mood: val });
                        } else if (e.target.value === '') {
                          setDailyMood(date, { mood: null });
                        }
                      }}
                      className="w-full text-center text-xs border border-border-subtle rounded bg-ink/3 text-ink focus:outline-none focus:ring-1 focus:ring-clay-soft/30"
                      placeholder="-"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border-subtle rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-sage-soft" />
              <div className="text-sm font-medium text-ink">{t('habits.motivation')}</div>
            </div>
            <div className="flex gap-1">
              {weekDates.map((date) => {
                const motivation = dailyMoods.find((m) => m.date === date)?.motivation;
                return (
                  <div key={date} className="flex-1">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={motivation ?? ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1 && val <= 5) {
                          setDailyMood(date, { motivation: val });
                        } else if (e.target.value === '') {
                          setDailyMood(date, { motivation: null });
                        }
                      }}
                      className="w-full text-center text-xs border border-border-subtle rounded bg-ink/3 text-ink focus:outline-none focus:ring-1 focus:ring-sage-soft/30"
                      placeholder="-"
                    />
                  </div>
                );
              })}
            </div>
          </div>

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
      </div>
    </section>
  );
}

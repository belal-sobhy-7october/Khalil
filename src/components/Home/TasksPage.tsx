import { lazy, Suspense, useState } from 'react';
import DailyFocus from '../DailyFocus/DailyFocus';
import DailyTodo from '../Todo/DailyTodo';
import WeeklyTodo from '../Todo/WeeklyTodo';
import BacklogTodo from '../Todo/BacklogTodo';
import ReviewNudge from '../Vocabulary/ReviewNudge';
import { useTranslation } from '../../i18n/useTranslation';
import { useTasksSettings, type PageSectionId } from '../../lib/tasksSettings';

const WirdSection = lazy(() => import('../Wird/WirdSection'));
const HabitsTracker = lazy(() => import('../Habits/HabitsTracker'));
const LifePillars = lazy(() => import('../LifePillars/LifePillars'));

/**
 * Tasks & Habits, the page Khalil opens on: the day's focus, today's and this
 * week's tasks (with today's wird items and habits), the whole wird sheet, the
 * habits and the backlog. Their order and which ones show are in Settings.
 */
export default function TasksPage() {
  const { t } = useTranslation();
  const [settings] = useTasksSettings();
  const [lifeView, setLifeView] = useState<'tracking' | 'habits'>('habits');

  const parts: Record<PageSectionId, React.ReactNode> = {
    focus: (
      <div id="section-focus">
        <DailyFocus />
        <ReviewNudge />
      </div>
    ),
    tasks: (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start" data-guide="tasks">
        <div>
          <DailyTodo />
        </div>
        <div>
          <WeeklyTodo />
        </div>
      </div>
    ),
    wird: (
      <section id="section-wird" className="scroll-mt-20">
        <Suspense fallback={<div className="h-32" />}>
          <WirdSection embedded />
        </Suspense>
      </section>
    ),
    // The anchors sit outside Suspense, so a jump to them works while their code still loads.
    habits: (
      <section id="section-life" className="scroll-mt-20 space-y-8">
        <div className="flex items-center gap-2 mb-4">
          {(['habits', 'tracking'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setLifeView(view)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                lifeView === view ? 'bg-clay-soft text-white' : 'bg-ink/5 text-ink-light hover:bg-ink/10'
              }`}
            >
              {t(view === 'habits' ? 'habits.toggleHabits' : 'habits.toggleTracking')}
            </button>
          ))}
        </div>
        <Suspense fallback={<div className="h-32" />}>{lifeView === 'tracking' ? <LifePillars /> : <HabitsTracker />}</Suspense>
      </section>
    ),
    backlog: (
      <div id="section-backlog">
        <BacklogTodo />
      </div>
    ),
  };

  return (
    <div className="space-y-8 canvas-area max-w-[1800px] mx-auto" style={{ position: 'relative' }}>
      {settings.sections
        .filter((s) => !s.hidden)
        .map((s) => (
          <div key={s.id}>{parts[s.id]}</div>
        ))}
    </div>
  );
}

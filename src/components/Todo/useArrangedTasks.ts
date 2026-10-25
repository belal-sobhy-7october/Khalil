import { useEffect, useMemo, useState } from 'react';
import { arrangeTasks, useTasksSettings } from '../../lib/tasksSettings';

/**
 * A task list as the settings want it shown: finished tasks stay, sink, or are
 * hidden (still saved, and listed under "Finished"). Rules that depend on the
 * time are re-checked every minute.
 */
export function useArrangedTasks<T extends { completed: boolean; updatedAt: number }>(tasks: T[]) {
  const [settings] = useTasksSettings();
  const rule = settings.completed;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (rule !== 'nextDay' && rule !== 'after24h') return;
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [rule]);
  return useMemo(() => arrangeTasks(tasks, rule, now), [tasks, rule, now]);
}

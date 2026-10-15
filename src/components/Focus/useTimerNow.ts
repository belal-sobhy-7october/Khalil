import { useEffect, useState } from 'react';
import { usePomodoroStore } from '../../store/pomodoroStore';

/** Re-render every half second while the timer is running. */
export function useTimerNow() {
  const status = usePomodoroStore((s) => s.status);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (status !== 'running') return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [status]);
  // Only meaningful while running; paused/idle timers don't depend on the clock.
  return now;
}

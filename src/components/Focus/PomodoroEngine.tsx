import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/appStore';
import { usePomodoroStore, type Phase } from '../../store/pomodoroStore';
import { useTranslation } from '../../i18n/useTranslation';
import { playChime } from '../../lib/chime';
import { systemNotify } from '../../lib/systemNotify';
import { useFloatingWindow } from '../../lib/floatingWindow';
import { formatClock } from './clock';
import { getPageTitle } from '../../lib/routes';
import MiniTimer from './MiniTimer';
import { createPortal } from 'react-dom';


const PHASE_EMOJI: Record<Phase, string> = { focus: '🍅', short: '☕', long: '🌿' };

function drawFavicon(progress: number, phase: Phase): string {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  if (!g) return '';
  const color = phase === 'focus' ? '#c47860' : '#6d9b7c';
  g.lineWidth = 10;
  g.strokeStyle = 'rgba(128,128,128,0.35)';
  g.beginPath();
  g.arc(32, 32, 26, 0, Math.PI * 2);
  g.stroke();
  g.strokeStyle = color;
  g.beginPath();
  g.arc(32, 32, 26, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
  g.stroke();
  g.fillStyle = color;
  g.beginPath();
  g.arc(32, 32, 12, 0, Math.PI * 2);
  g.fill();
  return c.toDataURL('image/png');
}

/**
 * Invisible: ticks the pomodoro, fires the end-of-phase notification and
 * sound, and mirrors the countdown into the tab title and favicon so it is
 * visible from any other tab or app.
 */
export default function PomodoroEngine() {
  const { t } = useTranslation();
  const userId = useAppStore((s) => s.session?.user?.id);
  const loadForUser = usePomodoroStore((s) => s.loadForUser);
  const finishing = useRef(false);
  const originalIcon = useRef<string | null>(null);
  const floating = useFloatingWindow((f) => f.win);

  useEffect(() => {
    if (userId) void loadForUser(userId);
  }, [userId, loadForUser]);

  useEffect(() => {
    const iconLink = () => document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    originalIcon.current = iconLink()?.href ?? null;
    let lastIconSecond = -1;

    const tick = async () => {
      const st = usePomodoroStore.getState();
      const now = Date.now();

      if (st.status === 'running' && st.endsAt !== null && st.endsAt <= now && !finishing.current) {
        finishing.current = true;
        try {
          const lateBy = now - st.endsAt;
          const finished = await st.finishPhase(userId);
          const s = usePomodoroStore.getState();
          // Only chime/notify for a phase that just ended, not one that ended hours ago.
          const fresh = lateBy < 5 * 60_000;
          if (fresh && s.settings.sound) playChime(finished === 'focus' ? 'focus-end' : 'break-end');
          if (fresh && s.settings.notify) {
            systemNotify(
              t(finished === 'focus' ? 'focus.notify.focusDoneTitle' : 'focus.notify.breakDoneTitle'),
              t(finished === 'focus' ? 'focus.notify.focusDoneBody' : 'focus.notify.breakDoneBody'),
              'khalil-pomodoro'
            );
          }
        } finally {
          finishing.current = false;
        }
      }

      const s = usePomodoroStore.getState();
      const active = s.status !== 'idle';
      const remaining = s.remaining(now);
      if (active && s.settings.titleCountdown) {
        document.title = `${s.status === 'paused' ? '⏸' : PHASE_EMOJI[s.phase]} ${formatClock(remaining)} · ${t(`focus.phase.${s.phase}`)}`;
      } else if (document.title !== getPageTitle()) {
        // The open page's title (lib/routes.ts), which changes with the page.
        document.title = getPageTitle();
      }

      const link = iconLink();
      if (link) {
        if (active) {
          const sec = Math.floor(remaining / 1000);
          if (sec !== lastIconSecond) {
            lastIconSecond = sec;
            const total = s.durationMs();
            const url = drawFavicon(total > 0 ? 1 - remaining / total : 0, s.phase);
            if (url) link.href = url;
          }
        } else if (originalIcon.current && link.href !== originalIcon.current) {
          link.href = originalIcon.current;
          lastIconSecond = -1;
        }
      }
    };

    const id = window.setInterval(() => void tick(), 500);
    void tick();

    // Background tabs throttle repeating timers (to once a minute in Chrome
    // after 5 minutes hidden). A single timeout aimed at the end time isn't
    // chained, so it still fires on time and the notification isn't late.
    let endTimer: number | undefined;
    const scheduleEnd = (endsAt: number | null) => {
      window.clearTimeout(endTimer);
      if (endsAt !== null) endTimer = window.setTimeout(() => void tick(), Math.max(0, endsAt - Date.now()) + 50);
    };
    scheduleEnd(usePomodoroStore.getState().endsAt);
    const unsubscribe = usePomodoroStore.subscribe((s, prev) => {
      if (s.endsAt !== prev.endsAt) scheduleEnd(s.endsAt);
    });

    return () => {
      window.clearInterval(id);
      window.clearTimeout(endTimer);
      unsubscribe();
      document.title = getPageTitle();
      const link = iconLink();
      if (link && originalIcon.current) link.href = originalIcon.current;
    };
  }, [t, userId]);

  // The floating window is rendered here (always mounted) so it keeps
  // working whatever section is open.
  return floating ? createPortal(<MiniTimer />, floating.document.body) : null;
}

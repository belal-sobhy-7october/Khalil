import { useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import { systemNotify } from '../../lib/systemNotify';
import { openReview } from '../../lib/openReview';
import { getSrsSettings, useSrsSettings } from '../../lib/useSrsSettings';
import { REMINDER_STATE_KEY, afterReminder, reminderDue, type ReminderState } from '../../lib/reviewReminder';

const CHECK_EVERY_MS = 60_000;

function readState(): ReminderState {
  try {
    return JSON.parse(localStorage.getItem(REMINDER_STATE_KEY) ?? '{}') as ReminderState;
  } catch {
    return {};
  }
}

function writeState(state: ReminderState) {
  try {
    localStorage.setItem(REMINDER_STATE_KEY, JSON.stringify(state));
  } catch {
    // a reminder may repeat once; nothing else depends on it
  }
}

/**
 * Sends the spaced-repetition reminders (lib/reviewReminder.ts) while Khalil
 * is open, and opens the review when one is clicked. Renders nothing.
 */
export default function ReviewReminders() {
  const { t } = useTranslation();
  // Loads the settings for this account (the timer reads them with getSrsSettings).
  useSrsSettings();

  useEffect(() => {
    const check = () => {
      const { vocabularyItems, isLoading } = useAppStore.getState();
      if (isLoading) return;
      const now = new Date();
      const state = readState();
      const reminder = reminderDue(vocabularyItems, now, getSrsSettings(), state, document.visibilityState === 'hidden');
      if (!reminder) return;
      if (reminder.kind === 'daily') {
        const words = reminder.words.join(', ') + (reminder.count > reminder.words.length ? '…' : '');
        const hard = reminder.hard ? ` · ${t('vocabulary.srs.notifyHard').replace('{count}', String(reminder.hard))}` : '';
        systemNotify(t('vocabulary.srs.notifyTitle'), t('vocabulary.srs.notifyBody').replace('{count}', String(reminder.count)).replace('{words}', words) + hard, 'khalil-review', 'review');
      } else if (reminder.kind === 'learning') {
        systemNotify(t('vocabulary.srs.notifyLearningTitle'), t('vocabulary.srs.notifyLearningBody').replace('{count}', String(reminder.count)), 'khalil-review-step', 'review');
      }
      writeState(afterReminder(state, reminder, now));
    };
    const timer = window.setInterval(check, CHECK_EVERY_MS);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, [t]);

  // A click on a reminder: from the service worker, a plain notification, or a new window it opened.
  useEffect(() => {
    const open = (what: unknown) => {
      if (what === 'review') openReview();
    };
    const onWindow = (e: Event) => open((e as CustomEvent<string>).detail);
    const onWorker = (e: MessageEvent) => {
      const data = e.data as { type?: string; open?: string } | null;
      if (data?.type === 'khalil:open') open(data.open);
    };
    window.addEventListener('khalil:open', onWindow);
    navigator.serviceWorker?.addEventListener('message', onWorker);
    const params = new URLSearchParams(window.location.search);
    if (params.get('open')) {
      open(params.get('open'));
      params.delete('open');
      const query = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
    }
    return () => {
      window.removeEventListener('khalil:open', onWindow);
      navigator.serviceWorker?.removeEventListener('message', onWorker);
    };
  }, []);

  return null;
}

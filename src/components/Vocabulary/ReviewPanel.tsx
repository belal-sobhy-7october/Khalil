import { useMemo, useState } from 'react';
import { Brain, Flame, Settings2, Clock, CalendarPlus, Download, Bell } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { addDaysToDateString, getToday } from '../../store/dateHelpers';
import { forecast, RETENTION_OPTIONS } from '../../lib/srs';
import { useDueSummary, useMinuteClock } from '../../lib/useDueSummary';
import { useSrsSettings } from '../../lib/useSrsSettings';
import { useWaitLabel } from '../../lib/useWaitLabel';
import { calendarFile, googleCalendarUrl } from '../../lib/reviewReminder';
import { notificationPermission, requestNotificationPermission } from '../../lib/systemNotify';

const NEW_PER_DAY_OPTIONS = [5, 10, 15, 20, 25, 30, 40, 50];
const FORECAST_DAYS = 7;

/** The next days' reviews as thin columns; today's count is written, the rest show on hover / focus. */
function Forecast({ counts, labels }: { counts: number[]; labels: string[] }) {
  const { t } = useTranslation();
  const max = Math.max(1, ...counts);
  return (
    <figure className="min-w-0">
      <figcaption className="text-xs text-ink-light mb-1">{t('vocabulary.srs.forecast')}</figcaption>
      <div className="flex items-end gap-1 h-16" role="list">
        {counts.map((n, i) => {
          const label = `${labels[i]}: ${n}`;
          return (
            <div key={i} role="listitem" tabIndex={0} title={label} aria-label={label} className="flex-1 h-full flex flex-col items-center justify-end gap-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-clay-soft">
              {i === 0 && <span className="text-[10px] font-semibold text-ink tabular-nums">{n}</span>}
              <span
                className={`w-full max-w-6 rounded-t ${i === 0 ? 'bg-clay-soft' : 'bg-clay-soft/60'}`}
                style={{ height: n ? `${Math.max(4, (n / max) * 44)}px` : '2px', opacity: n ? 1 : 0.35 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1 mt-1">
        {labels.map((l, i) => (
          <span key={i} className="flex-1 text-center text-[10px] text-ink-lighter truncate">{l}</span>
        ))}
      </div>
    </figure>
  );
}

function ReviewSettings() {
  const { t, language } = useTranslation();
  const [settings, update] = useSrsSettings();
  const [permission, setPermission] = useState(notificationPermission);
  const time = settings.reminderTime ?? '20:00';
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const title = t('vocabulary.srs.calendarTitle');
  const details = t('vocabulary.srs.calendarDetails').replace('{url}', appUrl);

  const toggleNotify = async () => {
    if (settings.notify) {
      update({ notify: false });
      return;
    }
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') update({ notify: true, reminderTime: settings.reminderTime ?? '20:00' });
  };

  const downloadIcs = () => {
    const blob = new Blob([calendarFile(title, details, time, getToday(), appUrl)], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'khalil-review.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 pt-4 border-t border-border-subtle grid gap-4 sm:grid-cols-2" data-testid="srs-settings">
      <label className="block text-sm">
        <span className="block font-medium text-ink mb-1">{t('vocabulary.srs.newPerDay')}</span>
        <select
          value={settings.newPerDay}
          onChange={(e) => update({ newPerDay: Number(e.target.value) })}
          className="w-full px-3 py-2 bg-card border border-border-subtle rounded-lg text-ink"
        >
          {[...new Set([...NEW_PER_DAY_OPTIONS, settings.newPerDay])].sort((a, b) => a - b).map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <span className="block text-xs text-ink-lighter mt-1">{t('vocabulary.srs.newPerDayHint')}</span>
      </label>

      <div className="text-sm">
        <span className="block font-medium text-ink mb-1" id="srs-retention">{t('vocabulary.srs.retention')}</span>
        <div className="flex gap-1 p-1 rounded-lg bg-ink/5" role="radiogroup" aria-labelledby="srs-retention">
          {RETENTION_OPTIONS.map((r) => (
            <button
              key={r}
              role="radio"
              aria-checked={settings.retention === r}
              onClick={() => update({ retention: r })}
              className={`flex-1 px-2 py-1.5 rounded-md text-sm tabular-nums ${settings.retention === r ? 'bg-card text-ink shadow-sm' : 'text-ink-light hover:text-ink'}`}
            >
              {Math.round(r * 100)}%
            </button>
          ))}
        </div>
        <span className="block text-xs text-ink-lighter mt-1">{t('vocabulary.srs.retentionHint')}</span>
      </div>

      <div className="text-sm sm:col-span-2 space-y-2">
        <span className="block font-medium text-ink">{t('vocabulary.srs.reminder')}</span>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="time"
            value={time}
            onChange={(e) => e.target.value && update({ reminderTime: e.target.value })}
            aria-label={t('vocabulary.srs.reminder')}
            className="px-3 py-1.5 bg-card border border-border-subtle rounded-lg text-ink"
            dir="ltr"
            lang={language}
          />
          <button
            onClick={() => void toggleNotify()}
            role="switch"
            aria-checked={settings.notify}
            disabled={permission === 'unsupported'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-40 ${settings.notify ? 'bg-clay-soft text-white' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}
          >
            <Bell size={14} /> {t('vocabulary.srs.notify')}
          </button>
        </div>
        <p className="text-xs text-ink-lighter">{permission === 'denied' ? t('vocabulary.srs.notifyBlocked') : t('vocabulary.srs.notifyHint')}</p>
        <div className="flex flex-wrap gap-2">
          <a
            href={googleCalendarUrl(title, details, time, getToday())}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-ink/5 text-ink hover:bg-ink/10"
          >
            <CalendarPlus size={14} /> {t('vocabulary.srs.calendarGoogle')}
          </a>
          <button onClick={downloadIcs} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-ink/5 text-ink hover:bg-ink/10">
            <Download size={14} /> {t('vocabulary.srs.calendarIcs')}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * The spaced-repetition review at the top of the word list: what's due now,
 * hard words, the coming days, and the review settings and reminders.
 */
export default function ReviewPanel({ onStart, onHard, hardCount }: { onStart: () => void; onHard: () => void; hardCount: number }) {
  const { t, language } = useTranslation();
  const waitLabel = useWaitLabel();
  const items = useAppStore((s) => s.vocabularyItems);
  const summary = useDueSummary();
  const now = useMinuteClock();
  const [open, setOpen] = useState(false);
  const total = summary.due + summary.newToday;

  const counts = useMemo(() => forecast(items, now, FORECAST_DAYS), [items, now]);
  const labels = useMemo(() => {
    const locale = language === 'ar' ? 'ar-EG' : 'en-US';
    const today = getToday();
    return Array.from({ length: FORECAST_DAYS }, (_, i) =>
      i === 0 ? t('vocabulary.srs.today') : new Date(`${addDaysToDateString(today, i)}T00:00:00`).toLocaleDateString(locale, { weekday: 'short' })
    );
  }, [language, t]);

  return (
    <section className="mb-6 rounded-2xl border border-border-subtle bg-card p-4 sm:p-5" aria-labelledby="srs-title" data-testid="review-panel">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex-1 min-w-[14rem] space-y-3">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-clay-soft" />
            <h2 id="srs-title" className="font-semibold text-ink">{t('vocabulary.srs.title')}</h2>
          </div>
          <p className="text-xs text-ink-light">{t('vocabulary.srs.intro')}</p>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
            <span className="text-ink">
              <span className="text-2xl font-bold tabular-nums" data-testid="srs-due">{summary.due}</span> {t('vocabulary.srs.dueNow')}
            </span>
            {summary.newToday > 0 && <span className="text-sky-600 dark:text-sky-400">{t('vocabulary.srs.newToday').replace('{count}', String(summary.newToday))}</span>}
            {summary.hardDue > 0 && (
              <span className="text-red-600 dark:text-red-400 flex items-center gap-1"><Flame size={13} />{t('vocabulary.srs.notifyHard').replace('{count}', String(summary.hardDue))}</span>
            )}
          </div>
          {!total && summary.nextAt && (
            <p className="text-xs text-ink-light flex items-center gap-1.5">
              <Clock size={13} /> {t('vocabulary.srs.nextAt').replace('{t}', waitLabel(Date.parse(summary.nextAt) - now.getTime()))}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onStart}
              disabled={!total}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {total ? t('vocabulary.srs.start').replace('{count}', String(total)) : t('vocabulary.srs.startNone')}
            </button>
            {hardCount > 0 && (
              <button onClick={onHard} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                <Flame size={16} />
                {t('vocabulary.srs.hardDrill').replace('{count}', String(hardCount))}
              </button>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-ink/5 text-ink hover:bg-ink/10"
            >
              <Settings2 size={15} /> {t('vocabulary.srs.settings')}
            </button>
          </div>
        </div>
        <div className="w-full sm:w-64">
          <Forecast counts={counts} labels={labels} />
        </div>
      </div>
      {open && <ReviewSettings />}
    </section>
  );
}

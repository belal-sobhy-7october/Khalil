import { useEffect, useMemo, useState } from 'react';
import {
  Play, Pause, RotateCcw, SkipForward, Bell, BellOff, Volume2, VolumeX, PictureInPicture2, Settings2, Flame, Timer, Trash2, Waves, Target,
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { usePomodoroStore, type Phase } from '../../store/pomodoroStore';
import { getToday } from '../../store/dateHelpers';
import { focusStreak, lastNDays, localDay, minutesByDay } from '../../lib/focusStats';
import { primeAudio } from '../../lib/chime';
import { notificationPermission, requestNotificationPermission } from '../../lib/systemNotify';
import { documentPipSupported, useFloatingWindow } from '../../lib/floatingWindow';
import { setNoiseVolume, startNoise, stopNoise, type NoiseKind } from '../../lib/ambientNoise';
import { formatClock } from './clock';
import { useTimerNow } from './useTimerNow';

const PHASES: Phase[] = ['focus', 'short', 'long'];

function Ring({ progress, children, phase }: { progress: number; children: React.ReactNode; phase: Phase }) {
  const r = 120;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative w-[280px] h-[280px] max-w-full mx-auto">
      <svg viewBox="0 0 280 280" className="w-full h-full -rotate-90">
        <circle cx="140" cy="140" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-ink/8" />
        <circle
          cx="140"
          cy="140"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          stroke="currentColor"
          className={`${phase === 'focus' ? 'text-clay-soft' : 'text-sage-soft'} transition-all duration-500`}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(1, progress)))}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

export default function FocusSection() {
  const { t, language } = useTranslation();
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const userId = useAppStore((s) => s.session?.user?.id);
  const dailyTodos = useAppStore((s) => s.dailyTodos);
  const now = useTimerNow();
  const s = usePomodoroStore();
  const [showSettings, setShowSettings] = useState(false);
  const [permission, setPermission] = useState(notificationPermission);
  const pipWindow = useFloatingWindow((f) => f.win);
  const openPip = useFloatingWindow((f) => f.open);
  const [noise, setNoise] = useState<NoiseKind | null>(null);
  const [volume, setVolume] = useState(0.3);

  const remaining = s.remaining(now);
  const progress = 1 - remaining / s.durationMs();
  const today = getToday();

  const byDay = useMemo(() => minutesByDay(s.sessions), [s.sessions]);
  const todayStats = byDay.get(today) ?? { minutes: 0, count: 0 };
  const streak = useMemo(() => focusStreak(byDay, today), [byDay, today]);
  const week = useMemo(() => lastNDays(7, today).map((d) => ({ day: d, minutes: byDay.get(d)?.minutes ?? 0 })), [byDay, today]);
  const weekMax = Math.max(60, ...week.map((w) => w.minutes));
  const recent = useMemo(() => [...s.sessions].reverse().slice(0, 8), [s.sessions]);
  const todaysTasks = dailyTodos.filter((td) => td.date === today && !td.completed);

  // Keyboard: Space start/pause, R reset, S skip (ignored while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest('input, textarea, select, button, [contenteditable="true"]')) return;
      const st = usePomodoroStore.getState();
      if (e.code === 'Space') {
        e.preventDefault();
        primeAudio();
        st.toggle();
      } else if (e.key.toLowerCase() === 'r') st.reset();
      else if (e.key.toLowerCase() === 's') st.skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => () => stopNoise(), []);

  const toggleNoise = (kind: NoiseKind) => {
    if (noise === kind) {
      stopNoise();
      setNoise(null);
    } else {
      startNoise(kind, volume);
      setNoise(kind);
    }
  };

  const enableNotifications = async () => {
    setPermission(await requestNotificationPermission());
    if (!s.settings.notify) s.updateSettings({ notify: true }, userId);
  };

  const setting = <K extends keyof typeof s.settings>(key: K, value: (typeof s.settings)[K]) => s.updateSettings({ [key]: value }, userId);

  const numberInput = (key: 'focus' | 'short' | 'long' | 'longEvery' | 'dailyGoal', min: number, max: number) => (
    <label className="flex items-center justify-between gap-2 text-sm text-ink">
      {t(`focus.settings.${key}`)}
      <input
        type="number"
        min={min}
        max={max}
        value={s.settings[key]}
        onChange={(e) => {
          const v = Math.max(min, Math.min(max, Number(e.target.value) || min));
          setting(key, v);
        }}
        className="w-20 px-2 py-1 bg-ink/5 border border-border-subtle rounded-lg text-center"
      />
    </label>
  );
  const toggleInput = (key: 'autoStartBreaks' | 'autoStartFocus' | 'sound' | 'notify' | 'titleCountdown') => (
    <label className="flex items-center justify-between gap-2 text-sm text-ink cursor-pointer">
      {t(`focus.settings.${key}`)}
      <input type="checkbox" checked={s.settings[key]} onChange={(e) => setting(key, e.target.checked)} className="accent-clay-soft w-4 h-4" />
    </label>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-1">{t('focus.title')}</h1>
          <p className="text-ink-light text-sm">{t('focus.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {documentPipSupported() && (
            <button onClick={() => void openPip()} disabled={!!pipWindow} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-sm text-ink hover:bg-ink/5 disabled:opacity-40">
              <PictureInPicture2 size={15} /> {t('focus.floating')}
            </button>
          )}
          {permission !== 'granted' && permission !== 'unsupported' && (
            <button onClick={enableNotifications} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-clay-soft text-white text-sm">
              <Bell size={15} /> {t(permission === 'denied' ? 'focus.notificationsBlocked' : 'focus.enableNotifications')}
            </button>
          )}
          <button onClick={() => setShowSettings((v) => !v)} aria-expanded={showSettings} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-sm text-ink hover:bg-ink/5">
            <Settings2 size={15} /> {t('focus.settings.title')}
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 p-4 rounded-xl border border-border-subtle bg-card">
          {numberInput('focus', 1, 180)}
          {numberInput('short', 1, 60)}
          {numberInput('long', 1, 90)}
          {numberInput('longEvery', 2, 12)}
          {numberInput('dailyGoal', 1, 24)}
          {toggleInput('autoStartBreaks')}
          {toggleInput('autoStartFocus')}
          {toggleInput('sound')}
          {toggleInput('notify')}
          {toggleInput('titleCountdown')}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6 items-start">
        {/* Timer */}
        <div className="rounded-2xl border border-border-subtle bg-card p-6 flex flex-col items-center gap-5">
          <div className="flex p-1 rounded-xl bg-ink/5" role="tablist">
            {PHASES.map((p) => (
              <button
                key={p}
                role="tab"
                aria-selected={s.phase === p}
                onClick={() => s.setPhase(p)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${s.phase === p ? 'bg-clay-soft text-white' : 'text-ink-light hover:text-ink'}`}
              >
                {t(`focus.phase.${p}`)}
              </button>
            ))}
          </div>

          <Ring progress={s.status === 'idle' ? 0 : progress} phase={s.phase}>
            <div className="text-6xl font-bold text-ink tabular-nums tracking-tight" aria-live="polite">{formatClock(remaining)}</div>
            <div className="text-xs uppercase tracking-widest text-ink-light mt-1">
              {s.status === 'paused' ? t('focus.paused') : t(`focus.phase.${s.phase}`)}
            </div>
            <div className="flex gap-1.5 mt-3" aria-label={t('focus.cycle')}>
              {Array.from({ length: s.settings.longEvery }, (_, i) => (
                <span key={i} className={`w-2 h-2 rounded-full ${i < s.cycle % (s.settings.longEvery + 1) ? 'bg-clay-soft' : 'bg-ink/15'}`} />
              ))}
            </div>
          </Ring>

          <div className="w-full max-w-sm">
            <input
              value={s.label}
              onChange={(e) => s.setLabel(e.target.value)}
              placeholder={t('focus.labelPlaceholder')}
              list="focus-task-options"
              dir="auto"
              className="w-full px-3 py-2 text-center bg-ink/5 border border-border-subtle rounded-lg text-sm text-ink focus:outline-none focus:border-clay-soft"
            />
            <datalist id="focus-task-options">
              {todaysTasks.map((td) => (
                <option key={td.id} value={td.text} />
              ))}
            </datalist>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={s.reset} className="p-3 rounded-full bg-ink/5 text-ink hover:bg-ink/10" aria-label={t('focus.reset')} title={`${t('focus.reset')} (R)`}>
              <RotateCcw size={20} />
            </button>
            <button
              onClick={() => {
                primeAudio();
                s.toggle();
              }}
              className="px-10 py-3.5 rounded-full bg-clay-soft text-white text-lg font-semibold hover:bg-clay-soft-dark shadow-md flex items-center gap-2"
              title="Space"
            >
              {s.status === 'running' ? <Pause size={22} /> : <Play size={22} />}
              {t(s.status === 'running' ? 'focus.pause' : s.status === 'paused' ? 'focus.resume' : 'focus.start')}
            </button>
            <button onClick={s.skip} className="p-3 rounded-full bg-ink/5 text-ink hover:bg-ink/10" aria-label={t('focus.skip')} title={`${t('focus.skip')} (S)`}>
              <SkipForward size={20} />
            </button>
          </div>
          <p className="text-[11px] text-ink-lighter">{t('focus.shortcuts')}</p>

          {/* Ambient sound */}
          <div className="w-full max-w-md flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-border-subtle">
            <Waves size={16} className="text-ink-light" />
            {(['white', 'pink', 'brown'] as NoiseKind[]).map((k) => (
              <button
                key={k}
                onClick={() => toggleNoise(k)}
                aria-pressed={noise === k}
                className={`px-3 py-1 rounded-full text-xs ${noise === k ? 'bg-clay-soft text-white' : 'bg-ink/5 text-ink hover:bg-ink/10'}`}
              >
                {t(`focus.noise.${k}`)}
              </button>
            ))}
            {noise && (
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setNoiseVolume(Number(e.target.value));
                }}
                aria-label={t('focus.noise.volume')}
                className="w-28 accent-clay-soft"
              />
            )}
            <button
              onClick={() => setting('sound', !s.settings.sound)}
              className="p-1.5 rounded-full text-ink-light hover:text-ink"
              aria-label={t('focus.settings.sound')}
              title={t('focus.settings.sound')}
            >
              {s.settings.sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
            <button
              onClick={() => setting('notify', !s.settings.notify)}
              className="p-1.5 rounded-full text-ink-light hover:text-ink"
              aria-label={t('focus.settings.notify')}
              title={t('focus.settings.notify')}
            >
              {s.settings.notify ? <Bell size={15} /> : <BellOff size={15} />}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl border border-border-subtle bg-card p-3 text-center">
              <Target size={16} className="mx-auto text-clay-soft mb-1" />
              <div className="text-xl font-bold text-ink tabular-nums">{todayStats.count}/{s.settings.dailyGoal}</div>
              <div className="text-[11px] text-ink-light">{t('focus.stats.today')}</div>
            </div>
            <div className="rounded-xl border border-border-subtle bg-card p-3 text-center">
              <Timer size={16} className="mx-auto text-clay-soft mb-1" />
              <div className="text-xl font-bold text-ink tabular-nums">{todayStats.minutes}</div>
              <div className="text-[11px] text-ink-light">{t('focus.stats.minutes')}</div>
            </div>
            <div className="rounded-xl border border-border-subtle bg-card p-3 text-center">
              <Flame size={16} className="mx-auto text-clay-soft mb-1" />
              <div className="text-xl font-bold text-ink tabular-nums">{streak}</div>
              <div className="text-[11px] text-ink-light">{t('focus.stats.streak')}</div>
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-card p-3">
            <div className="flex flex-wrap gap-1" aria-label={t('focus.stats.goal')}>
              {Array.from({ length: Math.max(s.settings.dailyGoal, todayStats.count) }, (_, i) => (
                <span key={i} className={`text-lg ${i < todayStats.count ? '' : 'opacity-20 grayscale'}`}>🍅</span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-card p-4">
            <div className="text-sm font-medium text-ink mb-3">{t('focus.stats.week')}</div>
            <div className="flex items-end gap-1.5 h-28">
              {week.map((w) => (
                <div key={w.day} className="flex-1 flex flex-col items-center gap-1 h-full justify-end" title={`${w.minutes} ${t('focus.stats.min')}`}>
                  <span className="text-[10px] text-ink-light tabular-nums">{w.minutes || ''}</span>
                  <div className={`w-full rounded-t ${w.day === today ? 'bg-clay-soft' : 'bg-clay-soft/50'}`} style={{ height: `${(w.minutes / weekMax) * 100}%`, minHeight: w.minutes ? 3 : 0 }} />
                  <span className="text-[10px] text-ink-lighter">
                    {new Date(`${w.day}T00:00:00`).toLocaleDateString(locale, { weekday: 'narrow' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-card p-4">
            <div className="text-sm font-medium text-ink mb-2">{t('focus.stats.recent')}</div>
            {recent.length === 0 ? (
              <p className="text-xs text-ink-lighter">{t('focus.stats.none')}</p>
            ) : (
              <ul className="space-y-1">
                {recent.map((r) => (
                  <li key={r.id} className="group flex items-center gap-2 text-xs text-ink">
                    <span className="text-ink-lighter tabular-nums w-24 shrink-0">
                      {localDay(r.endedAt) === today ? '' : `${new Date(r.endedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' })} `}
                      {new Date(r.startedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex-1 truncate" dir="auto">{r.label || t('focus.phase.focus')}</span>
                    <span className="tabular-nums text-ink-light">{r.minutes}′</span>
                    <button
                      onClick={() => void s.deleteSession(r.id, userId)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-ink-lighter hover:text-red-500"
                      aria-label={t('common.delete')}
                    >
                      <Trash2 size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

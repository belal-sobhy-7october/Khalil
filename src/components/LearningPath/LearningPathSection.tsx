import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Flame, Route, RotateCcw, Trophy, Target, CalendarDays } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useKv } from '../../lib/useKv';
import { getToday } from '../../store/dateHelpers';
import {
  EMPTY_PATH_STATE, PATH_KV_KEY, PATH_LENGTH, PATH_PHASES, SKILLS,
  buildPath, currentDay, dayProgress, isDayDone, packById, pathStats, scheduledDay, taskKey,
  type PathDay, type PathState, type PathTask,
} from '../../lib/learningPath';
import PathTaskBody from './PathTaskBody';

const NOTE_SAVE_DELAY = 800;

const dayMinutes = (d: PathDay) => d.tasks.reduce((n, t) => n + t.minutes, 0);

/** The latest date any task of the day was ticked. */
const finishedOn = (d: PathDay, state: PathState) =>
  d.tasks.map((t) => state.done[taskKey(d.day, t.id)] ?? '').sort().pop() ?? '';

/**
 * The day to open: the first unfinished one — unless a day was just finished
 * today, which stays open so today's work reads as done instead of handing
 * over the next day's list.
 */
function openingDay(path: PathDay[], state: PathState, today: string): number {
  const current = currentDay(path, state);
  const previous = path[current - 2];
  if (previous && isDayDone(previous, state) && finishedOn(previous, state) === today && !dayProgress(path[current - 1], state).done) return previous.day;
  return current;
}

function formatMinutes(total: number, t: (k: string) => string) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h ? t('path.time').replace('{h}', String(h)).replace('{m}', String(m)) : t('path.minutes').replace('{n}', String(m));
}

function Ring({ percent }: { percent: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="w-24 h-24 -rotate-90" aria-hidden>
      <circle cx="40" cy="40" r={r} fill="none" strokeWidth="8" className="stroke-ink/8" />
      <circle
        cx="40" cy="40" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
        className="stroke-clay-soft transition-[stroke-dashoffset] duration-500"
        strokeDasharray={c} strokeDashoffset={c * (1 - percent / 100)}
      />
    </svg>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-6 space-y-5">
      <ul className="space-y-2 text-sm text-ink">
        {['1', '2', '3', '4'].map((n) => (
          <li key={n} className="flex gap-2"><Check size={16} className="text-clay-soft shrink-0 mt-0.5" />{t(`path.intro.${n}`)}</li>
        ))}
      </ul>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((phase) => (
          <div key={phase} className="rounded-xl bg-ink/3 border border-border-subtle p-3">
            <div className="text-xs text-ink-lighter">{t('path.phaseN').replace('{n}', String(phase))}</div>
            <div className="font-semibold text-ink">{t(`path.phase.${phase}`)}</div>
            <div className="text-lg mt-1" dir="ltr">
              {phase < 4 ? PATH_PHASES[phase - 1].map((id) => packById(id)?.emoji).join(' ') : '🎤 🏁'}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={onStart} className="px-5 py-2.5 rounded-xl bg-clay-soft text-white font-medium hover:bg-clay-soft-dark">{t('path.start')}</button>
        <span className="text-xs text-ink-light flex items-center gap-1"><Clock size={13} /> {t('path.perDay')}</span>
      </div>
    </div>
  );
}

function taskTitle(task: PathTask, t: (k: string) => string) {
  const pack = packById(task.packId);
  let title = t(`path.task.${task.kind}.title`);
  if (task.words) title = title.replace('{from}', String(task.words[0] + 1)).replace('{to}', String(task.words[1]));
  if (pack) title = title.replace('{topic}', pack.title).replace('{title}', pack.grammar.title);
  else if (task.packIds) title = title.replace('{topic}', task.packIds.map((id) => packById(id)?.emoji ?? '').join(' '));
  if (task.accent) title = title.replace('{name}', task.accent.kind === 'sound' ? `/${task.accent.sound.ipa}/` : task.accent.feature.title);
  return title;
}

function TaskRow({ day, task, done, open, note, onToggle, onOpen, onNote }: {
  day: number;
  task: PathTask;
  done: boolean;
  open: boolean;
  note: string;
  onToggle: () => void;
  onOpen: () => void;
  onNote: (v: string) => void;
}) {
  const { t } = useTranslation();
  const title = taskTitle(task, t);
  const bodyId = `path-task-${day}-${task.id}`;
  return (
    <li className={`rounded-xl border transition-colors ${done ? 'border-sage-soft/40 bg-sage-soft/5' : 'border-border-subtle bg-card'}`} data-task={task.id}>
      <div className="flex items-start gap-3 p-3">
        <button
          onClick={onToggle}
          aria-pressed={done}
          aria-label={`${t(done ? 'a11y.markIncomplete' : 'a11y.markComplete')}: ${title}`}
          className={`mt-0.5 w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
            done ? 'bg-sage-soft border-sage-soft text-white' : 'border-ink/25 hover:border-clay-soft'
          }`}
        >
          {done && <Check size={14} />}
        </button>
        <button onClick={onOpen} aria-expanded={open} aria-controls={bodyId} className="flex-1 min-w-0 flex items-start gap-2 text-start">
          <span className="flex-1 min-w-0">
            <span className={`block font-medium ${done ? 'text-ink-light line-through decoration-ink/30' : 'text-ink'}`} dir="auto">{title}</span>
            <span className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-ink-lighter">
              <span className="px-1.5 py-0.5 rounded bg-ink/5">{t(`path.skill.${task.skill}`)}</span>
              <span className="tabular-nums">{t('path.minutes').replace('{n}', String(task.minutes))}</span>
            </span>
          </span>
          <ChevronDown size={18} className={`shrink-0 mt-0.5 text-ink-light transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </div>
      {open && (
        <div id={bodyId} className="px-3 pb-4 ps-12 space-y-3">
          <p className="text-sm text-ink-light">{t(`path.task.${task.kind}.hint`)}</p>
          <PathTaskBody task={task} note={note} onNote={onNote} />
          {!done && (
            <button onClick={onToggle} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-clay-soft text-white hover:bg-clay-soft-dark">
              <Check size={14} /> {t('path.markDone')}
            </button>
          )}
        </div>
      )}
    </li>
  );
}

export default function LearningPathSection() {
  const { t, tn, isRTL } = useTranslation();
  const [state, setState] = useKv<PathState>(PATH_KV_KEY, EMPTY_PATH_STATE);
  const path = useMemo(() => buildPath(), []);
  const today = getToday();
  const current = currentDay(path, state);
  const [selected, setSelected] = useState(() => openingDay(path, state, today));
  const [openTask, setOpenTask] = useState<string | null>(null);

  // The saved state can arrive from the database after the first render.
  const startedAt = state.startedAt;
  const followed = useRef(startedAt);
  useEffect(() => {
    if (followed.current === startedAt) return;
    followed.current = startedAt;
    setSelected(openingDay(path, state, today));
    setOpenTask(null);
  }, [startedAt, path, state, today]);

  // Notes are kept here while typing and saved once the typing pauses.
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const pending = useRef<Record<string, string>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const notes = pending.current;
    pending.current = {};
    if (Object.keys(notes).length) setState((s) => ({ ...s, notes: { ...s.notes, ...notes } }));
  }, [setState]);
  useEffect(() => flush, [flush]);
  const setNote = (key: string, value: string) => {
    setDrafts((d) => ({ ...d, [key]: value }));
    pending.current[key] = value;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, NOTE_SAVE_DELAY);
  };

  const day = path[selected - 1];
  const progress = dayProgress(day, state);
  const dayDone = progress.done === progress.total;
  const stats = pathStats(path, state, today);
  const allDone = stats.daysDone === PATH_LENGTH;

  // Open the first task that is left, so the day starts with what to do.
  const firstLeft = day.tasks.find((task) => !state.done[taskKey(day.day, task.id)])?.id ?? null;
  const shownTask = openTask === null ? firstLeft : openTask;

  const start = () => setState({ ...EMPTY_PATH_STATE, startedAt: today });

  const toggle = (task: PathTask) => {
    const key = taskKey(day.day, task.id);
    const wasDone = !!state.done[key];
    setState((s) => {
      const done = { ...s.done };
      if (done[key]) delete done[key];
      else done[key] = today;
      return { ...s, done };
    });
    if (!wasDone) setOpenTask(day.tasks.find((x) => x.id !== task.id && !state.done[taskKey(day.day, x.id)])?.id ?? '');
  };

  const goTo = (n: number) => {
    setSelected(Math.max(1, Math.min(PATH_LENGTH, n)));
    setOpenTask(null);
  };

  const reset = () => {
    if (!window.confirm(t('path.resetConfirm'))) return;
    flush();
    setDrafts({});
    setState(EMPTY_PATH_STATE);
    setSelected(1);
    setOpenTask(null);
  };

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-bold font-amiri text-ink mb-1 flex items-center gap-2"><Route size={26} className="text-clay-soft" /> {t('path.title')}</h1>
        <p className="text-ink-light text-sm">{t('path.subtitle')}</p>
      </div>
    </div>
  );

  if (!startedAt) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {header}
        <Intro onStart={start} />
      </div>
    );
  }

  // Working on today's day, or having just finished it, is on schedule.
  const scheduled = scheduledDay(startedAt, today);
  const gap = allDone ? 0 : current < scheduled ? scheduled - current : Math.min(0, scheduled - (current - 1));
  const schedule = gap > 0 ? tn('path.schedule.behind', gap) : gap < 0 ? tn('path.schedule.ahead', -gap) : t('path.schedule.onTrack');
  const pack = packById(day.packId);
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const weeks = Array.from({ length: Math.ceil(PATH_LENGTH / 7) }, (_, w) => path.slice(w * 7, w * 7 + 7));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {header}

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="px-3 py-1 rounded-full bg-clay-soft/15 text-clay-soft font-semibold tabular-nums">
          {t('path.dayOf').replace('{n}', String(current)).replace('{total}', String(PATH_LENGTH))}
        </span>
        <span className={`px-3 py-1 rounded-full ${gap > 0 ? 'bg-gold-soft/20 text-ink' : 'bg-sage-soft/15 text-ink'}`} data-testid="path-schedule">
          {schedule}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* The selected day */}
        <section className="lg:col-span-2 rounded-2xl border border-border-subtle bg-card p-4 sm:p-5 space-y-4" aria-labelledby="path-day-title">
          <div className="flex items-start justify-between gap-3">
            <button onClick={() => goTo(selected - 1)} disabled={selected === 1} className="p-1.5 rounded-lg hover:bg-ink/5 text-ink-light disabled:opacity-30" aria-label={t('path.prevDay')}>
              <PrevIcon size={18} />
            </button>
            <div className="flex-1 min-w-0 text-center">
              <div className="text-xs text-ink-lighter">
                {t('path.week').replace('{n}', String(day.week))} · {t(`path.phase.${day.phase}`)}
              </div>
              <h2 id="path-day-title" className="text-xl font-bold text-ink">
                {t('path.dayN').replace('{n}', String(day.day))} — {t(`path.dayKind.${day.kind}`)}
              </h2>
              {pack && <div className="text-sm text-ink-light" dir="ltr">{pack.emoji} {pack.title}</div>}
              <div className="flex items-center justify-center gap-3 mt-2 text-xs text-ink-light">
                <span className="flex items-center gap-1"><Clock size={12} /> {t('path.minutes').replace('{n}', String(dayMinutes(day)))}</span>
                <span className="tabular-nums" data-testid="path-day-progress">{progress.done}/{progress.total}</span>
              </div>
            </div>
            <button onClick={() => goTo(selected + 1)} disabled={selected === PATH_LENGTH} className="p-1.5 rounded-lg hover:bg-ink/5 text-ink-light disabled:opacity-30" aria-label={t('path.nextDay')}>
              <NextIcon size={18} />
            </button>
          </div>

          <div className="h-1.5 bg-ink/8 rounded-full overflow-hidden">
            <div className="h-full bg-clay-soft rounded-full transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
          </div>

          {selected !== current && !allDone && (
            <button onClick={() => goTo(current)} className="text-xs text-clay-soft hover:underline">
              {t('path.backToCurrent').replace('{n}', String(current))}
            </button>
          )}

          {dayDone && (
            <div className="rounded-xl bg-sage-soft/10 border border-sage-soft/30 p-4 flex flex-wrap items-center justify-between gap-3" role="status">
              <div>
                <div className="font-semibold text-ink flex items-center gap-2">
                  <Trophy size={16} className="text-gold-soft" />
                  {allDone ? t('path.allDone') : t('path.dayDone').replace('{n}', String(day.day))}
                </div>
                {!allDone && selected < current && finishedOn(day, state) === today && <div className="text-xs text-ink-light">{t('path.dayDoneHint')}</div>}
              </div>
              {!allDone && selected < PATH_LENGTH && (
                <button onClick={() => goTo(selected < current ? current : selected + 1)} className="px-3 py-1.5 text-sm rounded-lg bg-clay-soft text-white hover:bg-clay-soft-dark">
                  {t('path.startDay').replace('{n}', String(selected < current ? current : selected + 1))}
                </button>
              )}
            </div>
          )}

          <ol className="space-y-2">
            {day.tasks.map((task) => {
              const key = taskKey(day.day, task.id);
              return (
                <TaskRow
                  key={key}
                  day={day.day}
                  task={task}
                  done={!!state.done[key]}
                  open={shownTask === task.id}
                  note={drafts[key] ?? state.notes[key] ?? ''}
                  onToggle={() => toggle(task)}
                  onOpen={() => setOpenTask(shownTask === task.id ? '' : task.id)}
                  onNote={(v) => setNote(key, v)}
                />
              );
            })}
          </ol>
        </section>

        {/* Progress */}
        <section className="rounded-2xl border border-border-subtle bg-card p-5 space-y-5" aria-labelledby="path-progress-title">
          <h2 id="path-progress-title" className="font-semibold text-ink">{t('path.progress')}</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Ring percent={stats.percent} />
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-ink tabular-nums" data-testid="path-percent">{stats.percent}%</div>
            </div>
            <div className="text-sm text-ink-light">{tn('path.stats.tasks', stats.tasksDone).replace('{total}', String(stats.tasksTotal))}</div>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              { icon: CalendarDays, label: t('path.stats.days'), value: `${stats.daysDone}/${PATH_LENGTH}` },
              { icon: Flame, label: t('path.stats.streak'), value: String(stats.streak) },
              { icon: Clock, label: t('path.stats.time'), value: formatMinutes(stats.minutes, t) },
              { icon: Target, label: t('path.stats.topics'), value: `${stats.topicsDone}/${PATH_PHASES.flat().length}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-ink/3 p-3">
                <dt className="flex items-center gap-1 text-[11px] text-ink-light"><Icon size={12} className="text-clay-soft" /> {label}</dt>
                <dd className="text-lg font-bold text-ink tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-ink-light">{t('path.bySkill')}</h3>
            {SKILLS.filter((s) => stats.bySkill[s].total > 0).map((s) => {
              const { done, total } = stats.bySkill[s];
              return (
                <div key={s} className="text-xs">
                  <div className="flex justify-between text-ink mb-0.5">
                    <span>{t(`path.skill.${s}`)}</span>
                    <span className="tabular-nums text-ink-lighter">{done}/{total}</span>
                  </div>
                  <div className="h-1.5 bg-ink/8 rounded-full overflow-hidden">
                    <div className="h-full bg-sage-soft rounded-full" style={{ width: `${(done / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Roadmap */}
      <section className="rounded-2xl border border-border-subtle bg-card p-4 sm:p-5 space-y-4" aria-labelledby="path-roadmap-title">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="path-roadmap-title" className="font-semibold text-ink">{t('path.roadmap')}</h2>
          <div className="flex flex-wrap gap-3 text-[11px] text-ink-light">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sage-soft" /> {t('path.legend.done')}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gold-soft/60" /> {t('path.legend.started')}</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded ring-2 ring-clay-soft" /> {t('path.legend.current')}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {[1, 2, 3, 4].map((phase) => (
            <div key={phase} className="space-y-1.5">
              <div className="text-xs font-semibold text-ink">{t('path.phaseN').replace('{n}', String(phase))} · {t(`path.phase.${phase}`)}</div>
              {weeks.filter((w) => w[0].phase === phase).map((w) => (
                <div key={w[0].week} className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-[11px] text-ink-lighter">{t('path.week').replace('{n}', String(w[0].week))}</span>
                  <div className="flex gap-1">
                    {w.map((d) => {
                      const p = dayProgress(d, state);
                      const done = p.done === p.total;
                      const label = `${t('path.dayN').replace('{n}', String(d.day))} — ${t(`path.dayKind.${d.kind}`)}${d.packId ? ` · ${packById(d.packId)?.title}` : ''} (${p.done}/${p.total})`;
                      return (
                        <button
                          key={d.day}
                          onClick={() => goTo(d.day)}
                          title={label}
                          aria-label={label}
                          aria-current={d.day === selected ? 'true' : undefined}
                          className={`w-7 h-7 rounded-md text-[10px] tabular-nums transition-colors ${
                            done ? 'bg-sage-soft text-white' : p.done ? 'bg-gold-soft/60 text-ink' : d.kind === 'review' || d.kind === 'final' ? 'bg-ink/10 text-ink-light' : 'bg-ink/5 text-ink-light hover:bg-ink/10'
                          } ${d.day === current ? 'ring-2 ring-clay-soft' : ''} ${d.day === selected ? 'outline outline-2 outline-offset-1 outline-ink/40' : ''}`}
                        >
                          {d.day}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-sm truncate" dir="ltr">
                    {[...new Set(w.map((d) => d.packId).filter(Boolean))].map((id) => packById(id)?.emoji).join(' ')}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
          <RotateCcw size={13} /> {t('path.reset')}
        </button>
      </div>
    </div>
  );
}

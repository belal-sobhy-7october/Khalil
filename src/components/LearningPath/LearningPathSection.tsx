import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Flame, ListChecks, Lock, RotateCcw, Route, Settings2, Trophy } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useKv } from '../../lib/useKv';
import { useAppStore } from '../../store/appStore';
import { getToday, localDateString } from '../../store/dateHelpers';
import {
  PATH_KV_KEY, PATH_LENGTH, PATH_SECTIONS, blockProgress, buildPath, currentDay, dayProgress, emptyPathState, finishedOn, isBlockDone,
  isDayDone, isItemDone, packById, pathStats, scheduledDay, withDefaults, wordKey, wordsOf,
  type PathBlock, type PathDay, type PathProgress, type PathSettings, type PathState, type PlannedItem,
} from '../../lib/learningPath';
import { COURSE_POSITIONS_KEY, COURSE_PROGRESS_KEY, dropPositions, resumeAt, setDone, type CourseProgress, type WatchPositions } from '../../lib/courseProgress';
import { useDueSummary } from '../../lib/useDueSummary';
import ShadowingMethod from '../English/ShadowingMethod';
import RecommendedTools from '../English/RecommendedTools';
import PathSettingsForm from './PathSettingsForm';
import { dayTotal, formatMinutes } from './format';
import { PlanTimeline, WeekGrid } from './PathPlan';
import { ActionButton, GrammarBody, LessonLine, LessonPlayer, ListenSteps, ReviewBody, SoundBody, WordsBody, type LessonItem } from './PathItems';
import { SECTION_META, type HubTab } from './sections';

const NOTE_SAVE_DELAY = 800;

const anyDone = (d: PathDay, p: PathProgress) => d.blocks.some((b) => b.items.some((i) => isItemDone(i, p)));

/** The block a day opens on: the first one left to do. */
const firstLeft = (d: PathDay, p: PathProgress) => d.blocks.find((b) => !isBlockDone(b, p))?.section ?? '';

/**
 * The day to open: the first unfinished one — unless a day was just finished
 * today, which stays open so today's work reads as done instead of handing
 * over the next day's list.
 */
function openingDay(path: PathDay[], p: PathProgress, today: string): number {
  const current = currentDay(path, p);
  const previous = path[current - 2];
  if (previous && isDayDone(previous, p) && finishedOn(previous, p) === today && !anyDone(path[current - 1], p)) return previous.day;
  return current;
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

/** An item's title: what it is, in the app's language around the English names. */
function itemTitle(planned: PlannedItem, t: (k: string) => string): string {
  const { item } = planned;
  switch (item.kind) {
    case 'lesson':
      return item.lesson.title;
    case 'review':
      return t('path.item.review');
    case 'words':
      return t('path.item.words').replace('{topic}', `${packById(item.packId)?.emoji ?? ''} ${packById(item.packId)?.title ?? ''}`.trim());
    case 'grammar':
      return t('path.item.grammar').replace('{title}', packById(item.packId)?.grammar.title ?? '');
    case 'sound':
      return item.accent.kind === 'sound' ? t('path.item.sound').replace('{ipa}', item.accent.sound.ipa) : t('path.item.feature').replace('{name}', item.accent.feature.title);
    case 'free':
      return t('path.item.free').replace('{section}', SECTION_META[item.section].name);
  }
}

/** Where a block's lessons come from, for its header. */
function blockSource(b: PathBlock): string {
  const lesson = b.items.find((i) => i.item.kind === 'lesson')?.item;
  return lesson?.kind === 'lesson' ? `${lesson.sourceName} · ${lesson.groupName}` : '';
}

/** The 90-day path, a tab of the English hub; `onOpenTab` switches to another of its sections. */
export default function LearningPathSection({ onOpenTab }: { onOpenTab: (tab: HubTab) => void }) {
  const { t, tn, isRTL } = useTranslation();
  const [saved, setSaved] = useKv<PathState>(PATH_KV_KEY, emptyPathState());
  const state = useMemo(() => withDefaults(saved), [saved]);
  const update = useCallback((fn: (s: PathState) => PathState) => setSaved((prev) => fn(withDefaults(prev))), [setSaved]);
  const [course, setCourse] = useKv<CourseProgress>(COURSE_PROGRESS_KEY, {});
  const [positions, setPositions] = useKv<WatchPositions>(COURSE_POSITIONS_KEY, {});
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const words = useMemo(() => new Set(vocabularyItems.map((i) => wordKey(i.word))), [vocabularyItems]);
  const settingsKey = JSON.stringify(state.settings);
  const path = useMemo(() => buildPath(JSON.parse(settingsKey) as PathSettings), [settingsKey]);
  const progress = useMemo<PathProgress>(() => ({ state, course, positions, words }), [state, course, positions, words]);
  const today = getToday();
  const current = currentDay(path, progress);
  const courseRef = useRef(course);
  useEffect(() => {
    courseRef.current = course;
  });

  const [selected, setSelected] = useState(() => openingDay(path, progress, today));
  // Chosen when a day opens, then left alone: finishing a block doesn't fold it away under you.
  const [openBlock, setOpenBlock] = useState(() => firstLeft(path[selected - 1], progress));
  const [playing, setPlaying] = useState<{ key: string; start: number } | null>(null);

  // The saved value can arrive from the database after the first render.
  const startedAt = state.startedAt;
  const followed = useRef(startedAt);
  useEffect(() => {
    if (followed.current === startedAt) return;
    followed.current = startedAt;
    const day = openingDay(path, progress, today);
    setSelected(day);
    setOpenBlock(firstLeft(path[day - 1], progress));
  }, [startedAt, path, progress, today]);

  const mark = useCallback(
    (key: string, done: boolean) =>
      update((s) => {
        if (!!s.done[key] === done) return s;
        const next = { ...s.done };
        if (done) next[key] = today;
        else delete next[key];
        return { ...s, done: next };
      }),
    [update, today]
  );

  // Nothing left to study in the flashcards ticks the review of the day you're
  // working on — not the next day's, while a day finished today is still today's work.
  const { due, newToday } = useDueSummary();
  const reviewedToday = useMemo(
    () => vocabularyItems.some((i) => !!i.srs?.last_review && localDateString(new Date(i.srs.last_review)) === today),
    [vocabularyItems, today]
  );
  const reviewLeft = due > 0 || (newToday > 0 && !reviewedToday);
  useEffect(() => {
    if (!startedAt || reviewLeft) return;
    const day = path[current - 1];
    const previous = path[current - 2];
    if (previous && isDayDone(previous, progress) && finishedOn(previous, progress) === today && !anyDone(day, progress)) return;
    const review = day.blocks[0].items.find((i) => i.item.kind === 'review');
    if (review && !isItemDone(review, progress)) mark(review.key, true);
  }, [startedAt, reviewLeft, path, current, progress, today, mark]);

  // Notes are kept here while typing and saved once the typing pauses.
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const pending = useRef<Record<string, string>>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const notes = pending.current;
    pending.current = {};
    if (Object.keys(notes).length) update((s) => ({ ...s, notes: { ...s.notes, ...notes } }));
  }, [update]);
  useEffect(() => flush, [flush]);
  const setNote = (key: string, value: string) => {
    setDrafts((d) => ({ ...d, [key]: value }));
    pending.current[key] = value;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, NOTE_SAVE_DELAY);
  };

  const day = path[selected - 1];
  const stats = pathStats(path, progress, today);
  // The path's topic words already in the flashcards.
  const pathWords = useMemo(() => {
    const all = path.flatMap((d) => d.blocks[0].items.flatMap((i) => (i.item.kind === 'words' ? wordsOf(i.item) : [])));
    return { owned: all.filter((w) => words.has(wordKey(w.word))).length, total: all.length };
  }, [path, words]);
  const allDone = stats.daysDone === PATH_LENGTH;
  const dayDone = isDayDone(day, progress);

  // What the hub's progress says alone, without the path's own ticks.
  const byHubOnly = (planned: PlannedItem) => isItemDone(planned, { ...progress, state: { ...state, done: {} } });

  const toggle = (planned: PlannedItem) => {
    const done = isItemDone(planned, progress);
    const { item, key } = planned;
    // A whole lesson (or its last part) is ticked in the hub's progress, so its tab shows it too.
    if (item.kind === 'lesson' && (!item.part || item.part.index === item.part.count)) {
      setCourse((c) => setDone(c, [item.lesson.id], !done, today));
      if (!done) setPositions((p) => dropPositions(p, [item.lesson.id]));
      if (item.part) mark(key, !done);
      return;
    }
    mark(key, !done);
  };

  const play = (planned: PlannedItem) => {
    const item = planned.item as LessonItem;
    if (playing?.key === planned.key) return setPlaying(null);
    const at = positions[item.lesson.id] ?? 0;
    const start = item.part
      ? at > item.part.from && at < item.part.to - 5 ? Math.max(item.part.from, Math.floor(at) - 3) : item.part.from
      : course[item.lesson.id] ? 0 : resumeAt(at, item.lesson.seconds);
    setPlaying({ key: planned.key, start });
  };

  const savePosition = (id: string, seconds: number) => {
    if (courseRef.current[id]) return;
    const s = Math.floor(seconds);
    setPositions((all) => (all[id] === s ? all : { ...all, [id]: s }));
  };
  const finishLesson = (id: string) => {
    setCourse((c) => setDone(c, [id], true, today));
    setPositions((p) => dropPositions(p, [id]));
  };

  const goTo = (n: number) => {
    const day = Math.max(1, Math.min(PATH_LENGTH, n));
    setSelected(day);
    setOpenBlock(firstLeft(path[day - 1], progress));
    setPlaying(null);
  };

  const start = () => update((s) => ({ ...s, startedAt: today, done: {}, notes: {} }));
  const changeSettings = (settings: PathSettings) => {
    setPlaying(null);
    update((s) => ({ ...s, settings }));
  };
  const reset = () => {
    if (!window.confirm(t('path.resetConfirm'))) return;
    flush();
    setDrafts({});
    setPlaying(null);
    update((s) => ({ ...emptyPathState(), settings: s.settings }));
    setSelected(1);
    setOpenBlock(path[0].blocks[0].section);
  };

  const header = (
    <div>
      <h1 className="text-3xl font-bold font-amiri text-ink mb-1 flex items-center gap-2"><Route size={26} className="text-clay-soft" /> {t('path.title')}</h1>
      <p className="text-ink-light text-sm">{t('path.subtitle')}</p>
    </div>
  );

  if (!startedAt) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {header}
        <div className="rounded-2xl border border-border-subtle bg-card p-6 space-y-6">
          <ul className="space-y-2 text-sm text-ink">
            {['1', '2', '3', '4'].map((n) => (
              <li key={n} className="flex gap-2">
                <Check size={16} className="text-clay-soft shrink-0 mt-0.5" />
                {t(`path.intro.${n}`).replace('{min}', String(state.settings.minutes)).replace('{total}', dayTotal(state.settings.minutes, t))}
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2" dir="ltr">
            {PATH_SECTIONS.map((s) => {
              const { name, icon: Icon } = SECTION_META[s];
              return (
                <div key={s} className="rounded-xl bg-ink/3 border border-border-subtle p-3 flex items-center gap-2 text-sm text-ink">
                  <Icon size={16} className="text-clay-soft shrink-0" /> {name}
                </div>
              );
            })}
          </div>
          <PathSettingsForm settings={state.settings} onChange={changeSettings} />
          <button onClick={start} className="px-5 py-2.5 rounded-xl bg-clay-soft text-white font-medium hover:bg-clay-soft-dark">{t('path.start')}</button>
        </div>
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
  const dayMinutes = day.blocks.reduce((n, b) => n + b.minutes, 0);
  const daily = dayProgress(day, progress);

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
              <div className="text-xs text-ink-lighter">{t('path.week').replace('{n}', String(day.week))}</div>
              <h2 id="path-day-title" className="text-xl font-bold text-ink">{t('path.dayN').replace('{n}', String(day.day))}</h2>
              {pack && <div className="text-sm text-ink-light" dir="ltr">{pack.emoji} {pack.title}</div>}
              <div className="flex items-center justify-center gap-3 mt-2 text-xs text-ink-light">
                <span className="flex items-center gap-1"><Clock size={12} /> {formatMinutes(dayMinutes, t)}</span>
                <span className="tabular-nums" data-testid="path-day-progress">{daily.done}/{daily.total}</span>
              </div>
            </div>
            <button onClick={() => goTo(selected + 1)} disabled={selected === PATH_LENGTH} className="p-1.5 rounded-lg hover:bg-ink/5 text-ink-light disabled:opacity-30" aria-label={t('path.nextDay')}>
              <NextIcon size={18} />
            </button>
          </div>

          <div className="h-1.5 bg-ink/8 rounded-full overflow-hidden">
            <div className="h-full bg-clay-soft rounded-full transition-all" style={{ width: `${(daily.done / daily.total) * 100}%` }} />
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
                {!allDone && selected < current && finishedOn(day, progress) === today && <div className="text-xs text-ink-light">{t('path.dayDoneHint')}</div>}
              </div>
              {!allDone && selected < PATH_LENGTH && (
                <button onClick={() => goTo(selected < current ? current : selected + 1)} className="px-3 py-1.5 text-sm rounded-lg bg-clay-soft text-white hover:bg-clay-soft-dark">
                  {t('path.startDay').replace('{n}', String(selected < current ? current : selected + 1))}
                </button>
              )}
            </div>
          )}

          <ol className="space-y-2">
            {day.blocks.map((b) => {
              const { name, icon: Icon } = SECTION_META[b.section];
              const p = blockProgress(b, progress);
              const done = p.done === p.total;
              const open = openBlock === b.section;
              const bodyId = `path-block-${day.day}-${b.section}`;
              const source = blockSource(b);
              return (
                <li key={b.section} data-block={b.section} className={`rounded-xl border transition-colors ${done ? 'border-sage-soft/40 bg-sage-soft/5' : 'border-border-subtle bg-card'}`}>
                  <button
                    onClick={() => setOpenBlock(open ? '' : b.section)}
                    aria-expanded={open}
                    aria-controls={bodyId}
                    className="w-full flex items-center gap-3 p-3 text-start"
                  >
                    <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${done ? 'bg-sage-soft text-white' : 'bg-clay-soft/12 text-clay-soft'}`}>
                      {done ? <Check size={17} /> : <Icon size={17} />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-ink" dir="ltr">{name}</span>
                      {source && <span className="block text-[11px] text-ink-lighter line-clamp-2 break-words"><bdi>{source}</bdi></span>}
                    </span>
                    <span className="shrink-0 text-[11px] text-ink-light tabular-nums">{t('path.minutes').replace('{n}', String(b.minutes))} · {p.done}/{p.total}</span>
                    <ChevronDown size={18} className={`shrink-0 text-ink-light transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
                  </button>
                  {open && (
                    <div id={bodyId} className="px-3 pb-4 space-y-3">
                      {b.section === 'listening' && <ListenSteps />}
                      {b.section === 'shadowing' && <ShadowingMethod />}
                      <ul className="space-y-3">
                        {b.items.map((planned) => {
                          const itemDone = isItemDone(planned, progress);
                          const { item } = planned;
                          const wholeLesson = item.kind === 'lesson' && (!item.part || item.part.index === item.part.count);
                          const locked = itemDone && !wholeLesson && byHubOnly(planned);
                          const title = itemTitle(planned, t);
                          return (
                            <li key={planned.key} data-item={planned.key} className="flex items-start gap-3">
                              <button
                                onClick={() => toggle(planned)}
                                disabled={locked}
                                aria-pressed={itemDone}
                                aria-label={`${t(itemDone ? 'a11y.markIncomplete' : 'a11y.markComplete')}: ${title}`}
                                className={`mt-0.5 w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                                  itemDone ? 'bg-sage-soft border-sage-soft text-white' : 'border-ink/25 hover:border-clay-soft'
                                } disabled:cursor-default`}
                              >
                                {itemDone && (locked ? <Lock size={11} /> : <Check size={14} />)}
                              </button>
                              <div className="flex-1 min-w-0 space-y-2">
                                {item.kind === 'lesson' ? (
                                  <>
                                    <LessonLine item={item} playing={playing?.key === planned.key} onPlay={() => play(planned)} />
                                    {playing?.key === planned.key && (
                                      <LessonPlayer
                                        key={planned.key}
                                        item={item}
                                        start={playing.start}
                                        loop={b.section === 'shadowing'}
                                        onSave={(s) => savePosition(item.lesson.id, s)}
                                        onFinish={() => finishLesson(item.lesson.id)}
                                        onPartEnd={() => mark(planned.key, true)}
                                      />
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div className={`text-sm font-medium ${itemDone ? 'text-ink-light' : 'text-ink'}`} dir="auto">{title}</div>
                                    {item.kind === 'review' && <ReviewBody onComplete={() => mark(planned.key, true)} />}
                                    {item.kind === 'words' && packById(item.packId) && <WordsBody pack={packById(item.packId)!} words={wordsOf(item)} />}
                                    {item.kind === 'grammar' && packById(item.packId) && (
                                      <GrammarBody pack={packById(item.packId)!} note={drafts[planned.key] ?? state.notes[planned.key] ?? ''} onNote={(v) => setNote(planned.key, v)} />
                                    )}
                                    {item.kind === 'sound' && <SoundBody accent={item.accent} />}
                                    {item.kind === 'free' && (
                                      <div className="space-y-2">
                                        <p className="text-sm text-ink-light">{t('path.item.freeHint').replace('{section}', SECTION_META[item.section].name)}</p>
                                        <ActionButton onClick={() => onOpenTab(item.section)}>{t('path.open').replace('{section}', SECTION_META[item.section].name)}</ActionButton>
                                      </div>
                                    )}
                                    {!itemDone && item.kind !== 'review' && (
                                      <ActionButton onClick={() => toggle(planned)}><Check size={14} /> {t('path.markDone')}</ActionButton>
                                    )}
                                  </>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <button onClick={() => onOpenTab(b.section)} className="text-xs text-clay-soft hover:underline">
                        {t('path.open').replace('{section}', name)}
                      </button>
                    </div>
                  )}
                </li>
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
            <div className="text-sm text-ink-light">{tn('path.stats.items', stats.itemsDone).replace('{total}', String(stats.itemsTotal))}</div>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              { icon: CalendarDays, label: t('path.stats.days'), value: `${stats.daysDone}/${PATH_LENGTH}` },
              { icon: Flame, label: t('path.stats.streak'), value: String(stats.streak) },
              { icon: Clock, label: t('path.stats.time'), value: formatMinutes(stats.minutes, t) },
              { icon: ListChecks, label: t('path.stats.words'), value: `${pathWords.owned}/${pathWords.total}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-ink/3 p-3">
                <dt className="flex items-center gap-1 text-[11px] text-ink-light"><Icon size={12} className="text-clay-soft" /> {label}</dt>
                <dd className="text-lg font-bold text-ink tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-ink-light">{t('path.bySection')}</h3>
            {PATH_SECTIONS.map((s) => {
              const { done, total } = stats.bySection[s];
              return (
                <div key={s} className="text-xs">
                  <div className="flex justify-between text-ink mb-0.5">
                    <span dir="ltr">{SECTION_META[s].name}</span>
                    <span className="tabular-nums text-ink-lighter">{done}/{total}</span>
                  </div>
                  <div className="h-1.5 bg-ink/8 rounded-full overflow-hidden">
                    <div className="h-full bg-sage-soft rounded-full" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border-subtle bg-card p-4 sm:p-5 space-y-4" aria-labelledby="path-plan-title">
        <div>
          <h2 id="path-plan-title" className="font-semibold text-ink">{t('path.plan')}</h2>
          <p className="text-xs text-ink-light">{t('path.planHint')}</p>
        </div>
        <PlanTimeline path={path} current={current} onGoTo={goTo} />
      </section>

      <section className="rounded-2xl border border-border-subtle bg-card p-4 sm:p-5 space-y-4" aria-labelledby="path-roadmap-title">
        <h2 id="path-roadmap-title" className="font-semibold text-ink">{t('path.roadmap')}</h2>
        <WeekGrid path={path} progress={progress} current={current} selected={selected} onGoTo={goTo} />
      </section>

      <RecommendedTools />

      <details className="rounded-2xl border border-border-subtle bg-card p-4 sm:p-5 group">
        <summary className="cursor-pointer font-semibold text-ink flex items-center gap-2 list-none">
          <Settings2 size={16} className="text-clay-soft" /> {t('path.settings.title')}
          <ChevronDown size={16} className="ms-auto text-ink-light transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="pt-4">
          <PathSettingsForm settings={state.settings} onChange={changeSettings} />
        </div>
      </details>

      <div className="flex justify-end">
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
          <RotateCcw size={13} /> {t('path.reset')}
        </button>
      </div>
    </div>
  );
}

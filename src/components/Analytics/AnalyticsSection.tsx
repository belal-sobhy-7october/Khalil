import { useEffect, useMemo, useState } from 'react';
import { Activity, CheckSquare, Timer, Moon, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { usePomodoroStore } from '../../store/pomodoroStore';
import { useWirdStore } from '../../lib/wird';
import { useWirdItems } from '../../lib/wirdItems';
import { useHabitEntries } from '../../lib/wirdSync';
import { useKv } from '../../lib/useKv';
import { PRACTICE_LOG_KEY, type PracticeLog } from '../../lib/englishPractice';
import { addDaysToDateString, getToday } from '../../store/dateHelpers';
import {
  average, bestWeekday, dateRange, dayScores, deltaPercent, englishSeries, focusSeries, habitBreakdown, habitSeries, sum, taskSeries, weakestPrayer, wirdSeries,
} from '../../lib/analytics';
import { BarList, ColumnChart, Heatmap, LineChart, StatTile } from './charts';

const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

interface Insight {
  icon: string;
  text: string;
  section?: string;
}

export default function AnalyticsSection({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const { t, language } = useTranslation();
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const userId = useAppStore((s) => s.session?.user?.id);
  const habits = useAppStore((s) => s.habits);
  // A habit linked to the wird reads its days from the wird.
  const habitEntries = useHabitEntries();
  const dailyTodos = useAppStore((s) => s.dailyTodos);
  const vocabularyItems = useAppStore((s) => s.vocabularyItems);
  const sessions = usePomodoroStore((s) => s.sessions);
  const loadSessions = usePomodoroStore((s) => s.loadSessions);
  const focusGoal = usePomodoroStore((s) => s.settings.dailyGoal * s.settings.focus);
  const wirdDays = useWirdStore((s) => s.days);
  const loadWird = useWirdStore((s) => s.loadRange);
  const [wirdItems] = useWirdItems();
  const [practiceLog] = useKv<PracticeLog>(PRACTICE_LOG_KEY, {});
  const [range, setRange] = useState<Range>(30);

  const today = getToday();
  const from = addDaysToDateString(today, -(range - 1));
  const prevFrom = addDaysToDateString(from, -range);
  const prevTo = addDaysToDateString(from, -1);

  useEffect(() => {
    if (userId) void loadWird(userId, addDaysToDateString(today, -(2 * 90)), today);
  }, [userId, loadWird, today]);
  useEffect(() => {
    if (userId) void loadSessions(userId);
  }, [userId, loadSessions]);

  const data = useMemo(() => {
    const build = (start: string, end: string) => {
      const dates = dateRange(start, end);
      const habitsS = habitSeries(dates, habits, habitEntries);
      const tasks = taskSeries(dates, dailyTodos);
      const focus = focusSeries(dates, sessions);
      const wird = wirdSeries(dates, wirdDays, wirdItems);
      const english = englishSeries(dates, practiceLog, vocabularyItems);
      return { dates, habitsS, tasks, focus, wird, english };
    };
    const cur = build(from, today);
    const prev = build(prevFrom, prevTo);
    const score = dayScores(cur.dates, { habits: cur.habitsS, wird: cur.wird, focus: cur.focus, focusGoalMinutes: focusGoal, tasksDone: cur.tasks.done, tasksTotal: cur.tasks.total });
    // The heatmap always shows the last ~18 weeks, independent of the range filter.
    const heatDates = dateRange(addDaysToDateString(today, -125), today);
    const heatTasks = taskSeries(heatDates, dailyTodos);
    const heat = dayScores(heatDates, {
      habits: habitSeries(heatDates, habits, habitEntries),
      wird: wirdSeries(heatDates, wirdDays, wirdItems),
      focus: focusSeries(heatDates, sessions),
      focusGoalMinutes: focusGoal,
      tasksDone: heatTasks.done,
      tasksTotal: heatTasks.total,
    });
    return { cur, prev, score, heat, breakdown: habitBreakdown(cur.dates, habits, habitEntries) };
  }, [from, today, prevFrom, prevTo, habits, habitEntries, dailyTodos, sessions, wirdDays, wirdItems, practiceLog, vocabularyItems, focusGoal]);

  const { cur, prev } = data;
  const wirdTracked = (s: typeof cur.wird) => s.filter((p) => (p.value ?? 0) > 0);

  const kpis = [
    { key: 'habits', icon: <Activity size={14} />, value: average(cur.habitsS), prevValue: average(prev.habitsS), unit: '%' },
    { key: 'tasks', icon: <CheckSquare size={14} />, value: sum(cur.tasks.done), prevValue: sum(prev.tasks.done), unit: '' },
    { key: 'focus', icon: <Timer size={14} />, value: sum(cur.focus), prevValue: sum(prev.focus), unit: ` ${t('analytics.min')}` },
    { key: 'wird', icon: <Moon size={14} />, value: average(wirdTracked(cur.wird)), prevValue: average(wirdTracked(prev.wird)), unit: '%' },
    { key: 'english', icon: <BookOpen size={14} />, value: sum(cur.english.minutes), prevValue: sum(prev.english.minutes), unit: ` ${t('analytics.min')}` },
  ];

  const insights = useMemo<Insight[]>(() => {
    const list: Insight[] = [];
    const weekday = (n: number) => new Date(Date.UTC(2026, 0, 4 + n)).toLocaleDateString(locale, { weekday: 'long', timeZone: 'UTC' });
    const bestFocus = bestWeekday(cur.focus);
    if (bestFocus) list.push({ icon: '⏱️', text: t('analytics.insight.bestFocusDay').replace('{day}', weekday(bestFocus.weekday)).replace('{min}', String(bestFocus.average)), section: 'focus' });
    const top = data.breakdown[0];
    const low = data.breakdown[data.breakdown.length - 1];
    if (top && top.percent > 0) list.push({ icon: '🌟', text: t('analytics.insight.strongestHabit').replace('{name}', top.name).replace('{p}', String(top.percent)), section: 'life' });
    if (low && data.breakdown.length > 1 && low.percent < 60) list.push({ icon: '🎯', text: t('analytics.insight.weakestHabit').replace('{name}', low.name).replace('{p}', String(low.percent)), section: 'life' });
    const weak = weakestPrayer(cur.dates, wirdDays);
    if (weak && weak.percent < 80) list.push({ icon: '🕌', text: t('analytics.insight.weakestPrayer').replace('{prayer}', t(`wird.prayer.${weak.prayer}`)).replace('{p}', String(weak.percent)), section: 'wird' });
    const focusDelta = deltaPercent(sum(cur.focus), sum(prev.focus));
    if (focusDelta !== null && Math.abs(focusDelta) >= 15) list.push({ icon: focusDelta > 0 ? '📈' : '📉', text: t(focusDelta > 0 ? 'analytics.insight.focusUp' : 'analytics.insight.focusDown').replace('{p}', String(Math.abs(focusDelta))), section: 'focus' });
    const totalTasks = sum(cur.tasks.total);
    if (totalTasks >= 5) list.push({ icon: '✅', text: t('analytics.insight.taskRate').replace('{p}', String(Math.round((sum(cur.tasks.done) / totalTasks) * 100))).replace('{n}', String(totalTasks)), section: 'todo' });
    const englishDays = cur.english.minutes.filter((p) => (p.value ?? 0) > 0).length;
    list.push({
      icon: '🗣️',
      text: englishDays
        ? t('analytics.insight.englishDays').replace('{n}', String(englishDays)).replace('{total}', String(cur.dates.length))
        : t('analytics.insight.englishNone'),
      section: 'vocabulary',
    });
    const scored = data.score.filter((p) => p.value !== null);
    if (scored.length >= 3) {
      const best = scored.reduce((a, b) => ((b.value ?? 0) > (a.value ?? 0) ? b : a));
      list.push({ icon: '🏆', text: t('analytics.insight.bestDay').replace('{day}', new Date(`${best.date}T00:00:00`).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })).replace('{p}', String(best.value)) });
    }
    return list;
  }, [cur, prev, data, wirdDays, t, locale]);

  const overall = average(data.score);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-1">{t('analytics.title')}</h1>
          <p className="text-sm text-ink-light">{t('analytics.subtitle')}</p>
        </div>
        {/* One filter row; it scopes everything below. */}
        <div className="flex p-1 rounded-xl bg-ink/5" role="group" aria-label={t('analytics.range')}>
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`px-3 py-1.5 rounded-lg text-sm ${range === r ? 'bg-card text-ink shadow-sm' : 'text-ink-light hover:text-ink'}`}
            >
              {t('analytics.lastDays').replace('{n}', String(r))}
            </button>
          ))}
        </div>
      </div>

      {/* Hero + insights */}
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-4">
        <div className="rounded-2xl border border-border-subtle bg-card p-5 flex flex-col justify-center">
          <div className="text-xs text-ink-light flex items-center gap-1.5"><Sparkles size={14} className="text-clay-soft" /> {t('analytics.overall')}</div>
          <div className="text-6xl font-semibold text-ink mt-2">{overall === null ? '—' : <bdi>{overall}%</bdi>}</div>
          <p className="text-xs text-ink-light mt-2">{t('analytics.overallHint')}</p>
        </div>
        <div className="rounded-2xl border border-border-subtle bg-card p-5">
          <h2 className="text-sm font-semibold text-ink flex items-center gap-1.5 mb-3"><Lightbulb size={15} className="text-clay-soft" /> {t('analytics.insights')}</h2>
          <ul className="space-y-2">
            {insights.map((ins, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink">
                <span aria-hidden="true">{ins.icon}</span>
                <span className="flex-1">{ins.text}</span>
                {ins.section && onNavigate && (
                  <button onClick={() => onNavigate(ins.section!)} className="shrink-0 -my-1 px-1.5 py-1 rounded text-xs text-clay-soft hover:underline">{t('analytics.open')}</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((k) => (
          <StatTile key={k.key} label={t(`analytics.kpi.${k.key}`)} value={k.value} unit={k.unit} delta={deltaPercent(k.value, k.prevValue)} icon={k.icon} />
        ))}
      </div>

      <Heatmap title={t('analytics.heatmapTitle')} subtitle={t('analytics.heatmapHint')} data={data.heat} />

      {/* One measure per chart — never two scales on one plot. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LineChart title={t('analytics.chart.habits')} subtitle={t('analytics.chart.habitsHint')} data={cur.habitsS} />
        <ColumnChart title={t('analytics.chart.focus')} subtitle={t('analytics.chart.focusHint')} data={cur.focus} unit={t('analytics.minShort')} />
        <LineChart title={t('analytics.chart.wird')} subtitle={t('analytics.chart.wirdHint')} data={cur.wird} />
        <ColumnChart title={t('analytics.chart.tasks')} subtitle={t('analytics.chart.tasksHint')} data={cur.tasks.done} />
        <ColumnChart title={t('analytics.chart.english')} subtitle={t('analytics.chart.englishHint')} data={cur.english.minutes} unit={t('analytics.minShort')} />
        <ColumnChart title={t('analytics.chart.words')} subtitle={t('analytics.chart.wordsHint')} data={cur.english.words} />
      </div>

      <BarList
        title={t('analytics.chart.habitBreakdown')}
        subtitle={t('analytics.chart.habitBreakdownHint')}
        items={data.breakdown.map((h) => ({ id: h.id, label: h.name, percent: h.percent, detail: `${h.done}/${h.due}` }))}
      />
    </div>
  );
}

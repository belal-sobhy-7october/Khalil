import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus, Sun, Moon, Users, User, BookOpen } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { addDaysToDateString, getHabitWeekStart, getToday } from '../../store/dateHelpers';
import {
  EMPTY_DAY, PRAYERS, QIYAM_MAX, RAWATIB, RAWATIB_MAX, jamaahCount, prayedCount, rawatibCount, useWirdStore, wirdScore,
  type Prayer, type PrayerState, type WirdDay,
} from '../../lib/wird';

const NEXT_STATE: Record<string, PrayerState> = { none: 'jamaah', jamaah: 'alone', alone: null };

function Stepper({ value, onChange, min = 0, max, step = 1, label }: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max: number;
  step?: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <button
        onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))}
        className="w-8 h-8 rounded-lg bg-ink/5 text-ink hover:bg-ink/10 flex items-center justify-center"
        aria-label={`${label} −`}
      >
        <Minus size={14} />
      </button>
      <span className="w-12 text-center font-semibold text-ink tabular-nums">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, +(value + step).toFixed(2)))}
        className="w-8 h-8 rounded-lg bg-ink/5 text-ink hover:bg-ink/10 flex items-center justify-center"
        aria-label={`${label} +`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default function WirdSection() {
  const { t, isRTL, language } = useTranslation();
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const userId = useAppStore((s) => s.session?.user?.id);
  const days = useWirdStore((s) => s.days);
  const loadRange = useWirdStore((s) => s.loadRange);
  const updateDay = useWirdStore((s) => s.updateDay);

  const today = getToday();
  const [weekStart, setWeekStart] = useState(() => getHabitWeekStart(new Date(`${today}T00:00:00`)));
  const [selected, setSelected] = useState(today);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDaysToDateString(weekStart, i)), [weekStart]);

  useEffect(() => {
    if (userId) void loadRange(userId, addDaysToDateString(weekStart, -31), addDaysToDateString(weekStart, 6));
  }, [userId, weekStart, loadRange]);

  // On narrow screens the week scrolls sideways: open it at the end where
  // today usually is (left in RTL, right in LTR).
  const gridScrollRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = gridScrollRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const todayIndex = weekDays.indexOf(today);
    const toEnd = todayIndex === -1 || todayIndex >= 3;
    el.scrollLeft = toEnd ? (isRTL ? -el.scrollWidth : el.scrollWidth) : 0;
  }, [weekDays, today, isRTL]);

  const day = (d: string): WirdDay => ({ ...EMPTY_DAY, ...days[d] });
  const sel = day(selected);
  const update = (date: string, patch: Partial<WirdDay> | ((d: WirdDay) => Partial<WirdDay>)) => updateDay(userId, date, patch);

  const cyclePrayer = (date: string, p: Prayer) =>
    update(date, (d) => ({ prayers: { ...d.prayers, [p]: NEXT_STATE[d.prayers[p] ?? 'none'] } }));

  // Weekly totals (only days up to today count toward the goal).
  const counted = weekDays.filter((d) => d <= today);
  const sum = (f: (d: WirdDay) => number) => counted.reduce((n, d) => n + f(day(d)), 0);
  const monthStart = `${today.slice(0, 7)}-01`;
  const monthQuran = Object.entries(days)
    .filter(([d]) => d >= monthStart && d <= today)
    .reduce((n, [, v]) => n + (v.quran ?? 0), 0);

  const summary = [
    { key: 'jamaah', value: sum(jamaahCount), max: counted.length * 5, icon: Users },
    { key: 'qiyam', value: sum((d) => d.qiyam), max: counted.length * QIYAM_MAX, icon: Moon },
    { key: 'rawatib', value: sum(rawatibCount), max: counted.length * RAWATIB_MAX, icon: Plus },
    { key: 'quran', value: +sum((d) => d.quran).toFixed(2), max: null, icon: BookOpen },
    { key: 'adhkar', value: sum((d) => Number(d.adhkarAM) + Number(d.adhkarPM)), max: counted.length * 2, icon: Sun },
  ];

  const dayLabel = (d: string, style: 'short' | 'long' = 'short') =>
    new Date(`${d}T00:00:00`).toLocaleDateString(locale, style === 'short' ? { weekday: 'short' } : { weekday: 'long', day: 'numeric', month: 'long' });

  const cell = 'h-10 border border-border-subtle flex items-center justify-center text-xs';
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-amiri text-ink mb-1">{t('wird.title')}</h1>
        <p className="text-ink-light text-sm">{t('wird.subtitle')}</p>
      </div>

      {/* Weekly summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {summary.map(({ key, value, max, icon: Icon }) => (
          <div key={key} className="rounded-xl border border-border-subtle bg-card p-3">
            <div className="flex items-center gap-1.5 text-xs text-ink-light mb-1">
              <Icon size={13} className="text-clay-soft" /> {t(`wird.summary.${key}`)}
            </div>
            <div className="text-2xl font-bold text-ink tabular-nums">
              {value}
              {max !== null && <span className="text-sm text-ink-lighter">/{max}</span>}
            </div>
            {max ? (
              <div className="h-1.5 bg-ink/8 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-clay-soft rounded-full" style={{ width: `${max ? Math.min(100, (value / max) * 100) : 0}%` }} />
              </div>
            ) : (
              <div className="text-[11px] text-ink-light mt-1">{t('wird.summary.month').replace('{n}', String(+monthQuran.toFixed(2)))}</div>
            )}
          </div>
        ))}
      </div>

      {/* Week grid */}
      <div className="rounded-2xl border border-border-subtle bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setWeekStart((w) => addDaysToDateString(w, -7))} className="p-1.5 rounded-lg hover:bg-ink/5 text-ink-light" aria-label={t('wird.prevWeek')}>
            <PrevIcon size={18} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink">
              {new Date(`${weekDays[0]}T00:00:00`).toLocaleDateString(locale, { day: 'numeric', month: 'short' })} –{' '}
              {new Date(`${weekDays[6]}T00:00:00`).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}
            </span>
            <button
              onClick={() => {
                setWeekStart(getHabitWeekStart(new Date(`${today}T00:00:00`)));
                setSelected(today);
              }}
              className="px-2 py-0.5 text-xs rounded-md border border-border-subtle text-ink-light hover:text-ink"
            >
              {t('wird.thisWeek')}
            </button>
          </div>
          <button
            onClick={() => setWeekStart((w) => addDaysToDateString(w, 7))}
            disabled={addDaysToDateString(weekStart, 7) > today}
            className="p-1.5 rounded-lg hover:bg-ink/5 text-ink-light disabled:opacity-30"
            aria-label={t('wird.nextWeek')}
          >
            <NextIcon size={18} />
          </button>
        </div>

        <div ref={gridScrollRef} className="overflow-x-auto">
          <div className="grid min-w-[640px]" style={{ gridTemplateColumns: '9rem repeat(7, minmax(0, 1fr))' }}>
            <div />
            {weekDays.map((d) => (
              <button
                key={d}
                onClick={() => d <= today && setSelected(d)}
                disabled={d > today}
                className={`${cell} flex-col h-12 ${d === selected ? 'bg-clay-soft/15 font-semibold' : ''} ${d === today ? 'text-clay-soft' : 'text-ink'} disabled:opacity-40`}
              >
                <span>{dayLabel(d)}</span>
                <span className="text-[11px] text-ink-lighter">{Number(d.slice(8))}</span>
              </button>
            ))}

            {PRAYERS.map((p) => (
              <div key={p} className="contents">
                <div className={`${cell} justify-start px-2 font-medium text-ink`}>{t(`wird.prayer.${p}`)}</div>
                {weekDays.map((d) => {
                  const st = day(d).prayers[p] ?? null;
                  const future = d > today;
                  return (
                    <button
                      key={d}
                      disabled={future}
                      onClick={() => cyclePrayer(d, p)}
                      aria-label={`${t(`wird.prayer.${p}`)} ${d}: ${t(`wird.state.${st ?? 'none'}`)}`}
                      title={t(`wird.state.${st ?? 'none'}`)}
                      className={`${cell} transition-colors ${
                        st === 'jamaah' ? 'bg-sage-soft text-white' : st === 'alone' ? 'bg-gold-soft/70 text-white' : 'hover:bg-ink/5'
                      } ${future ? 'bg-ink/3 cursor-not-allowed' : ''}`}
                    >
                      {st === 'jamaah' ? <Users size={14} /> : st === 'alone' ? <User size={14} /> : null}
                    </button>
                  );
                })}
              </div>
            ))}

            {(
              [
                ['qiyam', (d: WirdDay) => (d.qiyam ? `${d.qiyam}/${QIYAM_MAX}` : '')],
                ['rawatib', (d: WirdDay) => (rawatibCount(d) ? `${rawatibCount(d)}/${RAWATIB_MAX}` : '')],
                ['quran', (d: WirdDay) => (d.quran ? `${d.quran}` : '')],
              ] as const
            ).map(([key, fmt]) => (
              <div key={key} className="contents">
                <div className={`${cell} justify-start px-2 font-medium text-ink`}>{t(`wird.row.${key}`)}</div>
                {weekDays.map((d) => (
                  <button
                    key={d}
                    disabled={d > today}
                    onClick={() => setSelected(d)}
                    aria-label={`${t(`wird.row.${key}`)} ${d}${fmt(day(d)) ? `: ${fmt(day(d))}` : ''}`}
                    className={`${cell} tabular-nums text-ink ${d === selected ? 'bg-clay-soft/10' : 'hover:bg-ink/5'} disabled:bg-ink/3`}
                  >
                    {fmt(day(d))}
                  </button>
                ))}
              </div>
            ))}

            {(['adhkarAM', 'adhkarPM'] as const).map((key) => (
              <div key={key} className="contents">
                <div className={`${cell} justify-start px-2 font-medium text-ink`}>{t(`wird.row.${key}`)}</div>
                {weekDays.map((d) => {
                  const on = day(d)[key];
                  return (
                    <button
                      key={d}
                      disabled={d > today}
                      onClick={() => update(d, (x) => ({ [key]: !x[key] }))}
                      aria-pressed={on}
                      aria-label={`${t(`wird.row.${key}`)} ${d}`}
                      className={`${cell} ${on ? 'bg-clay-soft text-white' : 'hover:bg-ink/5'} disabled:bg-ink/3`}
                    >
                      {on ? '✓' : ''}
                    </button>
                  );
                })}
              </div>
            ))}

            <div className={`${cell} justify-start px-2 font-semibold text-ink`}>{t('wird.row.score')}</div>
            {weekDays.map((d) => {
              const score = d > today ? null : wirdScore(day(d));
              return (
                <div key={d} className={`${cell} font-semibold tabular-nums ${score === null ? 'bg-ink/3' : score >= 80 ? 'text-sage-soft-dark' : score >= 50 ? 'text-gold-soft-dark' : 'text-ink-light'}`}>
                  {score === null ? '' : `${score}%`}
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-[11px] text-ink-lighter">{t('wird.legend')}</p>
      </div>

      {/* Selected day detail */}
      <div className="rounded-2xl border border-border-subtle bg-card p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{dayLabel(selected, 'long')}</h2>
          <span className="text-sm font-semibold text-clay-soft tabular-nums">{wirdScore(sel)}%</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRAYERS.map((p) => {
            const st = sel.prayers[p] ?? null;
            return (
              <button
                key={p}
                onClick={() => cyclePrayer(selected, p)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm ${
                  st === 'jamaah' ? 'bg-sage-soft border-sage-soft text-white' : st === 'alone' ? 'bg-gold-soft/70 border-gold-soft text-white' : 'border-border-subtle text-ink'
                }`}
              >
                {st === 'jamaah' ? <Users size={14} /> : st === 'alone' ? <User size={14} /> : null}
                {t(`wird.prayer.${p}`)}
                <span className="text-[11px] opacity-80">· {t(`wird.state.${st ?? 'none'}`)}</span>
              </button>
            );
          })}
          <span className="self-center text-xs text-ink-light">{t('wird.prayedCount').replace('{n}', String(prayedCount(sel)))}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <div className="text-sm font-medium text-ink">{t('wird.row.qiyam')} <span className="text-ink-lighter">/ {QIYAM_MAX}</span></div>
            <Stepper value={sel.qiyam} max={QIYAM_MAX} onChange={(v) => update(selected, { qiyam: v })} label={t('wird.row.qiyam')} />
            <div className="flex flex-wrap gap-1">
              {[2, 4, 8, 11].map((n) => (
                <button key={n} onClick={() => update(selected, { qiyam: n })} className="px-2 py-0.5 text-xs rounded-md bg-ink/5 text-ink hover:bg-ink/10">{n}</button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-ink">
              {t('wird.row.rawatib')} <span className="text-ink-lighter tabular-nums">{rawatibCount(sel)}/{RAWATIB_MAX}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {RAWATIB.map((r) => {
                const on = !!sel.rawatib[r.key];
                return (
                  <button
                    key={r.key}
                    onClick={() => update(selected, (d) => ({ rawatib: { ...d.rawatib, [r.key]: !d.rawatib[r.key] } }))}
                    aria-pressed={on}
                    className={`px-2.5 py-1 rounded-lg text-xs border ${on ? 'bg-clay-soft border-clay-soft text-white' : 'border-border-subtle text-ink hover:bg-ink/5'}`}
                  >
                    {t(`wird.rawatib.${r.key}`)} ({r.rakaat})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-ink">{t('wird.row.quran')} <span className="text-ink-lighter">({t('wird.juz')})</span></div>
            <Stepper value={sel.quran} max={30} step={0.25} onChange={(v) => update(selected, { quran: v })} label={t('wird.row.quran')} />
            <div className="flex flex-wrap gap-1">
              {[0.25, 0.5, 1, 2].map((n) => (
                <button key={n} onClick={() => update(selected, { quran: n })} className="px-2 py-0.5 text-xs rounded-md bg-ink/5 text-ink hover:bg-ink/10">
                  {t(`wird.juzPreset.${String(n).replace('.', '_')}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['adhkarAM', 'adhkarPM'] as const).map((key) => (
            <button
              key={key}
              onClick={() => update(selected, (d) => ({ [key]: !d[key] }))}
              aria-pressed={sel[key]}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm ${sel[key] ? 'bg-clay-soft border-clay-soft text-white' : 'border-border-subtle text-ink hover:bg-ink/5'}`}
            >
              {key === 'adhkarAM' ? <Sun size={15} /> : <Moon size={15} />}
              {t(`wird.row.${key}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

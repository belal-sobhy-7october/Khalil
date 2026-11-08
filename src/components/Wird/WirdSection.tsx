import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, ChevronLeft, ChevronRight, Hash, Minus, Moon, Plus, Settings2, Sun, User, Users, type LucideIcon } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useAppStore } from '../../store/appStore';
import { addDaysToDateString, getHabitWeekStart, getToday } from '../../store/dateHelpers';
import {
  EMPTY_DAY, PRAYERS, RAWATIB, itemCount, jamaahCount, prayedCount, rawatibCount, setItemCount, useWirdStore, wirdScore,
  type Prayer, type PrayerState, type WirdDay, type WirdItem,
} from '../../lib/wird';
import { useWirdItems } from '../../lib/wirdItems';
import { openSettingsTab } from '../Settings/settingsTabs';

const NEXT_STATE: Record<string, PrayerState> = { none: 'jamaah', jamaah: 'alone', alone: null };

/** Quick values for the built-in counts (the user's own items get their goal). */
const PRESETS: Record<string, number[]> = { qiyam: [2, 4, 8, 11], quran: [0.25, 0.5, 1, 2] };

const ITEM_ICONS: Record<string, LucideIcon> = { prayers: Users, qiyam: Moon, rawatib: Plus, quran: BookOpen, adhkarAM: Sun, adhkarPM: Moon };

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

/**
 * The wird sheet: this week's grid and the selected day's details, built from
 * the user's own items (lib/wirdItems.ts). `embedded` is its place on the
 * Tasks & Habits page.
 */
export default function WirdSection({ embedded = false }: { embedded?: boolean }) {
  const { t, isRTL, language } = useTranslation();
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const userId = useAppStore((s) => s.session?.user?.id);
  const days = useWirdStore((s) => s.days);
  const loadRange = useWirdStore((s) => s.loadRange);
  const updateDay = useWirdStore((s) => s.updateDay);
  const [allItems] = useWirdItems();
  const items = useMemo(() => allItems.filter((i) => !i.hidden), [allItems]);
  const showPrayers = items.some((i) => i.kind === 'prayers');

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

  const nameOf = (item: WirdItem) => item.name ?? t(`wird.row.${item.id}`);
  const unitOf = (item: WirdItem) => item.unit ?? (item.id === 'qiyam' || item.id === 'rawatib' ? t('wird.unit.rakaat') : item.id === 'quran' ? t('wird.juz') : '');
  const goalOf = (item: WirdItem) => item.goal ?? 1;

  // Weekly totals (only days up to today count toward the goal).
  const counted = weekDays.filter((d) => d <= today);
  const sum = (f: (d: WirdDay) => number) => counted.reduce((n, d) => n + f(day(d)), 0);
  const monthStart = `${today.slice(0, 7)}-01`;
  const monthQuran = Object.entries(days)
    .filter(([d]) => d >= monthStart && d <= today)
    .reduce((n, [, v]) => n + (v.quran ?? 0), 0);

  const summary = items.map((item) => {
    if (item.kind === 'prayers') return { item, label: t('wird.summary.jamaah'), value: sum(jamaahCount), max: counted.length * 5 };
    if (item.kind === 'check') return { item, label: nameOf(item), value: sum((d) => itemCount(d, item)), max: counted.length };
    if (item.id === 'quran') return { item, label: t('wird.summary.quran'), value: +sum((d) => d.quran).toFixed(2), max: null };
    return { item, label: nameOf(item), value: +sum((d) => itemCount(d, item)).toFixed(2), max: counted.length * goalOf(item) };
  });

  const dayLabel = (d: string, style: 'short' | 'long' = 'short') =>
    new Date(`${d}T00:00:00`).toLocaleDateString(locale, style === 'short' ? { weekday: 'short' } : { weekday: 'long', day: 'numeric', month: 'long' });

  const cell = 'h-10 border border-border-subtle flex items-center justify-center text-xs';
  const labelCell = `${cell} justify-start px-2 font-medium text-ink min-w-0`;
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const Heading = embedded ? 'h2' : 'h1';
  const countItems = items.filter((i) => i.kind === 'count' || i.kind === 'rawatib');
  const checkItems = items.filter((i) => i.kind === 'check');

  return (
    <div className={embedded ? 'space-y-4' : 'max-w-6xl mx-auto p-6 space-y-6'}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Heading className={`${embedded ? 'text-2xl' : 'text-3xl'} font-bold font-amiri text-ink mb-1 flex items-center gap-2`}>
            {embedded && <Moon size={20} className="text-clay-soft" />}
            {t('wird.title')}
          </Heading>
          <p className="text-ink-light text-sm">{t('wird.subtitle')}</p>
        </div>
        <button onClick={() => openSettingsTab('wird')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle text-sm text-ink-light hover:text-ink hover:bg-ink/5">
          <Settings2 size={15} /> {t('wird.customize')}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border-subtle p-6 text-center text-sm text-ink-light">{t('wird.empty')}</p>
      ) : (
        <>
          {/* Weekly summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {summary.map(({ item, label, value, max }) => {
              const Icon = ITEM_ICONS[item.id] ?? Hash;
              return (
                <div key={item.id} className="rounded-xl border border-border-subtle bg-card p-3 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-ink-light mb-1 min-w-0">
                    <Icon size={13} className="text-clay-soft shrink-0" /> <span className="truncate" title={label}>{label}</span>
                  </div>
                  <div className="text-2xl font-bold text-ink tabular-nums">
                    {value}
                    {max !== null && <span className="text-sm text-ink-lighter">/{+max.toFixed(2)}</span>}
                  </div>
                  {max ? (
                    <div className="h-1.5 bg-ink/8 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-clay-soft rounded-full" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
                    </div>
                  ) : max === null ? (
                    <div className="text-[11px] text-ink-light mt-1">{t('wird.summary.month').replace('{n}', String(+monthQuran.toFixed(2)))}</div>
                  ) : null}
                </div>
              );
            })}
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

                {items.map((item) => {
                  if (item.kind === 'prayers') {
                    return PRAYERS.map((p) => (
                      <div key={p} className="contents">
                        <div className={labelCell}>{t(`wird.prayer.${p}`)}</div>
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
                    ));
                  }
                  if (item.kind === 'check') {
                    return (
                      <div key={item.id} className="contents">
                        <div className={labelCell}><span className="truncate" title={nameOf(item)}>{nameOf(item)}</span></div>
                        {weekDays.map((d) => {
                          const on = itemCount(day(d), item) > 0;
                          return (
                            <button
                              key={d}
                              disabled={d > today}
                              onClick={() => update(d, setItemCount(item, on ? 0 : 1))}
                              aria-pressed={on}
                              aria-label={`${nameOf(item)} ${d}`}
                              className={`${cell} ${on ? 'bg-clay-soft text-white' : 'hover:bg-ink/5'} disabled:bg-ink/3`}
                            >
                              {on ? '✓' : ''}
                            </button>
                          );
                        })}
                      </div>
                    );
                  }
                  // Counts: tap a day to edit it below.
                  const fmt = (d: WirdDay) => {
                    const v = +itemCount(d, item).toFixed(2);
                    if (!v) return '';
                    return item.id === 'quran' ? `${v}` : `${v}/${goalOf(item)}`;
                  };
                  return (
                    <div key={item.id} className="contents">
                      <div className={labelCell}><span className="truncate" title={nameOf(item)}>{nameOf(item)}</span></div>
                      {weekDays.map((d) => (
                        <button
                          key={d}
                          disabled={d > today}
                          onClick={() => setSelected(d)}
                          aria-label={`${nameOf(item)} ${d}${fmt(day(d)) ? `: ${fmt(day(d))}` : ''}`}
                          className={`${cell} tabular-nums text-ink ${d === selected ? 'bg-clay-soft/10' : 'hover:bg-ink/5'} disabled:bg-ink/3`}
                        >
                          {fmt(day(d))}
                        </button>
                      ))}
                    </div>
                  );
                })}

                <div className={`${cell} justify-start px-2 font-semibold text-ink`}>{t('wird.row.score')}</div>
                {weekDays.map((d) => {
                  const score = d > today ? null : wirdScore(day(d), allItems);
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
              <span className="text-sm font-semibold text-clay-soft tabular-nums">{wirdScore(sel, allItems)}%</span>
            </div>

            {showPrayers && (
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
            )}

            {countItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {countItems.map((item) => {
                  const goal = goalOf(item);
                  const unit = unitOf(item);
                  if (item.kind === 'rawatib') {
                    return (
                      <div key={item.id} className="space-y-2">
                        <div className="text-sm font-medium text-ink">
                          {nameOf(item)} <span className="text-ink-lighter tabular-nums">{rawatibCount(sel)}/{goal}</span>
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
                    );
                  }
                  const presets = PRESETS[item.id] ?? [goal];
                  return (
                    <div key={item.id} className="space-y-2">
                      <div className="text-sm font-medium text-ink">
                        {nameOf(item)}{' '}
                        <span className="text-ink-lighter">
                          ({t('wird.goal').replace('{n}', String(goal))}{unit ? ` ${unit}` : ''})
                        </span>
                      </div>
                      <Stepper
                        value={+itemCount(sel, item).toFixed(2)}
                        max={item.max ?? 100000}
                        step={item.step ?? 1}
                        onChange={(v) => update(selected, setItemCount(item, v))}
                        label={nameOf(item)}
                      />
                      <div className="flex flex-wrap gap-1">
                        {presets.map((n) => (
                          <button key={n} onClick={() => update(selected, setItemCount(item, n))} className="px-2 py-0.5 text-xs rounded-md bg-ink/5 text-ink hover:bg-ink/10">
                            {item.id === 'quran' ? t(`wird.juzPreset.${String(n).replace('.', '_')}`) : PRESETS[item.id] ? n : <span className="flex items-center gap-1"><Check size={11} /> {n}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {checkItems.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {checkItems.map((item) => {
                  const on = itemCount(sel, item) > 0;
                  const Icon = item.id === 'adhkarAM' ? Sun : item.id === 'adhkarPM' ? Moon : Check;
                  return (
                    <button
                      key={item.id}
                      onClick={() => update(selected, setItemCount(item, on ? 0 : 1))}
                      aria-pressed={on}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm ${on ? 'bg-clay-soft border-clay-soft text-white' : 'border-border-subtle text-ink hover:bg-ink/5'}`}
                    >
                      <Icon size={15} />
                      {nameOf(item)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import { useId, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Table2 } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import type { DayPoint } from '../../lib/analytics';
import { useDateFormat } from './useDateFormat';

/**
 * Small, dependency-free charts. One series per chart in the theme accent
 * (single hue), hairline grid, values on hover/focus, the peak labelled,
 * and a table view for every chart.
 */

const niceMax = (v: number) => {
  if (v <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(v));
  const n = v / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
};

function ChartCard({ title, subtitle, children, table }: { title: string; subtitle?: string; children: React.ReactNode; table: React.ReactNode }) {
  const { t } = useTranslation();
  const [showTable, setShowTable] = useState(false);
  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          {subtitle && <p className="text-xs text-ink-light">{subtitle}</p>}
        </div>
        <button
          onClick={() => setShowTable((v) => !v)}
          aria-pressed={showTable}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-ink-light hover:text-ink hover:bg-ink/5"
        >
          <Table2 size={12} /> {t(showTable ? 'analytics.showChart' : 'analytics.showTable')}
        </button>
      </div>
      {showTable ? <div className="max-h-64 overflow-y-auto">{table}</div> : children}
    </div>
  );
}

function DataTable({ data, unit }: { data: DayPoint[]; unit: string }) {
  const { t } = useTranslation();
  const fmt = useDateFormat();
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="text-ink-light">
          <th className="text-start font-medium py-1">{t('analytics.date')}</th>
          <th className="text-end font-medium py-1">{t('analytics.value')}</th>
        </tr>
      </thead>
      <tbody>
        {[...data].reverse().map((p) => (
          <tr key={p.date} className="border-t border-border-subtle">
            <td className="py-1 text-ink">{fmt(p.date, { weekday: 'short', day: 'numeric', month: 'short' })}</td>
            <td className="py-1 text-end text-ink tabular-nums">{p.value === null ? '—' : `${p.value}${unit}`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Tooltip({ x, date, value, unit, align }: { x: number; date: string; value: number | null; unit: string; align: 'start' | 'end' | 'center' }) {
  const fmt = useDateFormat();
  const translate = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%';
  return (
    <div
      className="pointer-events-none absolute -top-2 z-10 rounded-lg bg-ink px-2.5 py-1.5 text-card shadow-lg whitespace-nowrap"
      style={{ left: `${x}%`, transform: `translate(${translate}, -100%)` }}
      role="status"
    >
      <div className="text-sm font-semibold tabular-nums">{value === null ? '—' : `${value}${unit}`}</div>
      <div className="text-[11px] opacity-75">{fmt(date, { weekday: 'short', day: 'numeric', month: 'short' })}</div>
    </div>
  );
}

function EmptyChart({ height }: { height: number }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-border-subtle text-xs text-ink-lighter" style={{ height: height + 24 }}>
      {t('analytics.noDataYet')}
    </div>
  );
}

const alignFor = (i: number, n: number) => (i < n * 0.15 ? 'start' : i > n * 0.85 ? 'end' : 'center');

/** Axis labels: first, middle and last date. */
function XAxis({ data }: { data: DayPoint[] }) {
  const fmt = useDateFormat();
  if (data.length === 0) return null;
  const picks = data.length > 2 ? [0, Math.floor((data.length - 1) / 2), data.length - 1] : data.map((_, i) => i);
  return (
    <div className="relative h-4 mt-1 text-[11px] text-ink-lighter" dir="ltr">
      {picks.map((i) => (
        <span
          key={i}
          className="absolute tabular-nums"
          style={{ left: `${((i + 0.5) / data.length) * 100}%`, transform: i === 0 ? 'translateX(-10%)' : i === data.length - 1 ? 'translateX(-90%)' : 'translateX(-50%)' }}
        >
          {fmt(data[i].date)}
        </span>
      ))}
    </div>
  );
}

function YGrid({ max, unit }: { max: number; unit: string }) {
  // Skip the middle tick when it wouldn't be a whole number (e.g. max = 1).
  const fractions = Number.isInteger(max / 2) ? [1, 0.5, 0] : [1, 0];
  return (
    <>
      {fractions.map((f) => (
        <div key={f} className="absolute inset-x-0 border-t border-border-subtle" style={{ bottom: `${f * 100}%` }}>
          <span className="absolute -top-2 end-0 translate-x-full ps-1 text-[11px] text-ink-lighter tabular-nums">
            {Math.round(max * f)}
            {f === 1 ? unit : ''}
          </span>
        </div>
      ))}
    </>
  );
}

export function ColumnChart({ title, subtitle, data, unit = '', height = 140 }: { title: string; subtitle?: string; data: DayPoint[]; unit?: string; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceMax(Math.max(0, ...data.map((p) => p.value ?? 0)));
  const peak = data.reduce((best, p, i) => ((p.value ?? 0) > (data[best]?.value ?? 0) ? i : best), 0);
  const empty = data.every((p) => !p.value);
  return (
    <ChartCard title={title} subtitle={subtitle} table={<DataTable data={data} unit={unit} />}>
      {empty ? (
        <EmptyChart height={height} />
      ) : (
      <div className="pe-8">
        <div className="relative mt-5" style={{ height }} dir="ltr">
          <YGrid max={max} unit={unit} />
          <div className="absolute inset-0 flex items-end" onPointerLeave={() => setHover(null)}>
            {data.map((p, i) => {
              const h = ((p.value ?? 0) / max) * 100;
              return (
                <div
                  key={p.date}
                  tabIndex={0}
                  aria-label={`${p.date}: ${p.value ?? '—'}${unit}`}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  className="relative h-full flex-1 flex items-end justify-center outline-none group"
                >
                  <div
                    className={`w-full max-w-[24px] mx-px rounded-t-[4px] bg-clay-soft transition-opacity ${hover !== null && hover !== i ? 'opacity-45' : ''} group-focus-visible:ring-2 group-focus-visible:ring-ink/40`}
                    style={{ height: `${h}%`, minHeight: p.value ? 2 : 0 }}
                  />
                  {i === peak && (p.value ?? 0) > 0 && hover === null && (
                    <span className="absolute text-[11px] font-semibold text-ink tabular-nums" style={{ bottom: `calc(${h}% + 2px)` }}>
                      {p.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {hover !== null && data[hover] && (
            <Tooltip x={((hover + 0.5) / data.length) * 100} date={data[hover].date} value={data[hover].value} unit={unit} align={alignFor(hover, data.length)} />
          )}
        </div>
        <XAxis data={data} />
      </div>
      )}
    </ChartCard>
  );
}

export function LineChart({ title, subtitle, data, unit = '%', max: fixedMax = 100, height = 140 }: { title: string; subtitle?: string; data: DayPoint[]; unit?: string; max?: number; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const gradId = useId();
  const max = fixedMax ?? niceMax(Math.max(0, ...data.map((p) => p.value ?? 0)));
  const n = data.length;
  const x = (i: number) => ((i + 0.5) / n) * 100;
  const y = (v: number) => 100 - (v / max) * 100;

  // Break the line where there is no data (null) instead of drawing through zero.
  const segments: string[] = [];
  let current = '';
  data.forEach((p, i) => {
    if (p.value === null) {
      if (current) segments.push(current);
      current = '';
    } else current += `${current ? 'L' : 'M'}${x(i)},${y(p.value)} `;
  });
  if (current) segments.push(current);
  const valid = data.map((p, i) => ({ p, i })).filter(({ p }) => p.value !== null);
  const last = valid[valid.length - 1];
  const empty = valid.every(({ p }) => !p.value);

  const onMove = (e: React.PointerEvent) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const i = Math.min(n - 1, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * n)));
    setHover(i);
  };

  return (
    <ChartCard title={title} subtitle={subtitle} table={<DataTable data={data} unit={unit} />}>
      {empty ? (
        <EmptyChart height={height} />
      ) : (
      <div className="pe-8">
        <div
          ref={areaRef}
          className="relative outline-none mt-5"
          style={{ height }}
          dir="ltr"
          tabIndex={0}
          aria-label={title}
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') setHover((h) => Math.min(n - 1, (h ?? -1) + 1));
            if (e.key === 'ArrowLeft') setHover((h) => Math.max(0, (h ?? n) - 1));
          }}
          onBlur={() => setHover(null)}
        >
          <YGrid max={max} unit={unit} />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible text-clay-soft">
            <defs>
              <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            {segments.map((d, k) => {
              const pts = d.trim().split(' ');
              const firstX = pts[0].slice(1).split(',')[0];
              const lastX = pts[pts.length - 1].slice(1).split(',')[0];
              return (
                <g key={k}>
                  <path d={`${d} L${lastX},100 L${firstX},100 Z`} fill={`url(#${gradId})`} />
                  <path d={d} fill="none" stroke="currentColor" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
                </g>
              );
            })}
          </svg>
          {last && hover === null && (
            <>
              <span className="absolute w-2.5 h-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-clay-soft ring-2 ring-card" style={{ left: `${x(last.i)}%`, bottom: `${100 - y(last.p.value!)}%` }} />
              <span className="absolute text-[11px] font-semibold text-ink tabular-nums -translate-x-1/2" style={{ left: `${x(last.i)}%`, bottom: `calc(${100 - y(last.p.value!)}% + 8px)` }}>
                {last.p.value}
                {unit}
              </span>
            </>
          )}
          {hover !== null && (
            <>
              <div className="absolute top-0 bottom-0 w-px bg-ink/30" style={{ left: `${x(hover)}%` }} />
              {data[hover].value !== null && (
                <span className="absolute w-2.5 h-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-clay-soft ring-2 ring-card" style={{ left: `${x(hover)}%`, bottom: `${100 - y(data[hover].value!)}%` }} />
              )}
              <Tooltip x={x(hover)} date={data[hover].date} value={data[hover].value} unit={unit} align={alignFor(hover, n)} />
            </>
          )}
        </div>
        <XAxis data={data} />
      </div>
      )}
    </ChartCard>
  );
}

/** Calendar heatmap: weeks as columns, Sat→Fri rows; one hue, 5 steps. */
export function Heatmap({ title, subtitle, data }: { title: string; subtitle?: string; data: DayPoint[] }) {
  const { t } = useTranslation();
  const fmt = useDateFormat();
  const [hover, setHover] = useState<DayPoint | null>(null);
  if (data.length === 0) return null;
  // Pad to start on Saturday so rows line up with weekdays.
  const first = new Date(`${data[0].date}T00:00:00`).getDay();
  const pad = (first + 1) % 7; // Sat=0 … Fri=6
  const cells: Array<DayPoint | null> = [...Array(pad).fill(null), ...data];
  const weeks: Array<Array<DayPoint | null>> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const step = (v: number | null) => (v === null ? -1 : v === 0 ? 0 : v < 25 ? 1 : v < 50 ? 2 : v < 75 ? 3 : 4);
  const STEP_CLASS = ['bg-ink/8', 'bg-clay-soft/25', 'bg-clay-soft/50', 'bg-clay-soft/75', 'bg-clay-soft'];

  return (
    <ChartCard title={title} subtitle={subtitle} table={<DataTable data={data} unit="%" />}>
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-[3px] w-max" dir="ltr" onPointerLeave={() => setHover(null)}>
          {weeks.map((w, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }, (_, di) => {
                const p = w[di];
                if (!p) return <div key={di} className="w-3.5 h-3.5" />;
                const s = step(p.value);
                return (
                  <div
                    key={di}
                    tabIndex={0}
                    aria-label={`${p.date}: ${p.value ?? '—'}%`}
                    onPointerEnter={() => setHover(p)}
                    onFocus={() => setHover(p)}
                    className={`w-3.5 h-3.5 rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-ink/50 ${s < 0 ? 'bg-ink/4' : STEP_CLASS[s]}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-[11px] text-ink-lighter">
        <span className="text-xs text-ink min-h-4" aria-live="polite">
          {hover ? `${fmt(hover.date, { weekday: 'long', day: 'numeric', month: 'short' })} — ${hover.value === null ? t('analytics.noData') : `${hover.value}%`}` : ''}
        </span>
        <span className="flex items-center gap-1">
          {t('analytics.less')}
          {STEP_CLASS.map((c) => (
            <span key={c} className={`w-3 h-3 rounded-[3px] ${c}`} />
          ))}
          {t('analytics.more')}
        </span>
      </div>
    </ChartCard>
  );
}

/** KPI tile: label, value, signed delta vs the previous period. */
export function StatTile({ label, value, unit = '', delta, icon }: { label: string; value: number | null; unit?: string; delta: number | null; icon: React.ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-4">
      <div className="flex items-center gap-1.5 text-xs text-ink-light">
        <span className="text-clay-soft">{icon}</span>
        {label}
      </div>
      <div className="text-2xl font-semibold text-ink mt-1">
        {value === null ? '—' : <bdi>{value.toLocaleString('en-US')}{unit}</bdi>}
      </div>
      <div className="text-[11px] mt-0.5 h-4">
        {delta !== null && (
          <span className={`inline-flex items-center gap-0.5 ${delta >= 0 ? 'text-sage-soft-dark' : 'text-clay-soft-dark'}`}>
            {delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            <span className="text-ink-light">
              {delta > 0 ? '+' : ''}
              {delta}% {t('analytics.vsPrevious')}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

/** Horizontal bars for comparing named items (e.g. each habit's completion). */
export function BarList({ title, subtitle, items }: { title: string; subtitle?: string; items: Array<{ id: string; label: string; percent: number; detail: string }> }) {
  const { t } = useTranslation();
  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      table={
        <table className="w-full text-xs">
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-border-subtle">
                <td className="py-1 text-ink" dir="auto">{i.label}</td>
                <td className="py-1 text-end text-ink-light tabular-nums">{i.detail}</td>
                <td className="py-1 text-end text-ink tabular-nums">{i.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      {items.length === 0 ? (
        <p className="text-xs text-ink-lighter">{t('analytics.noData')}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((i) => (
            <li key={i.id}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-ink truncate" dir="auto">{i.label}</span>
                <span className="text-ink-light tabular-nums shrink-0 ms-2">{i.detail} · <span className="text-ink font-medium">{i.percent}%</span></span>
              </div>
              <div className="h-2 rounded-full bg-ink/8 overflow-hidden">
                <div className="h-full rounded-full bg-clay-soft" style={{ width: `${i.percent}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}

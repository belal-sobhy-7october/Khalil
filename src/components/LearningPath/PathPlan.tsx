import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import {
  PATH_SECTIONS, dayProgress, sectionTimeline,
  type PathDay, type PathProgress, type PathSection, type SegmentWhat,
} from '../../lib/learningPath';
import { SECTION_META } from './sections';

const SEGMENT_COLORS = ['bg-clay-soft/70', 'bg-gold-soft/70', 'bg-sage-soft/70', 'bg-clay-soft/40', 'bg-gold-soft/40', 'bg-sage-soft/40'];

function useWhatLabel() {
  const { t } = useTranslation();
  return (what: SegmentWhat): string => {
    switch (what.kind) {
      case 'group':
        return `${what.source} · ${what.group}`;
      case 'topics':
        return t('path.what.topics').replace('{level}', what.level);
      case 'grammar':
        return t('path.what.grammar');
      case 'review':
        return t('path.what.review');
      case 'sounds':
        return t(what.round === 1 ? 'path.what.sounds' : 'path.what.soundsAgain');
      default:
        return t('path.what.free');
    }
  };
}

/** What each section covers on which days, as a bar of all the path's days. */
export function PlanTimeline({ path, current, onGoTo }: { path: PathDay[]; current: number; onGoTo: (day: number) => void }) {
  const { t } = useTranslation();
  const label = useWhatLabel();
  return (
    <div className="space-y-5">
      {PATH_SECTIONS.map((section: PathSection) => {
        const { name, icon: Icon } = SECTION_META[section];
        const segments = sectionTimeline(path, section);
        return (
          <div key={section} className="space-y-1.5">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-1.5" dir="ltr">
              <Icon size={15} className="text-clay-soft" /> {name}
            </h3>
            <div className="relative flex h-3 rounded-full overflow-hidden bg-ink/5" dir="ltr" aria-hidden="true">
              {segments.map((s, i) => (
                <span key={s.from} className={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} style={{ width: `${((s.to - s.from + 1) / path.length) * 100}%` }} />
              ))}
              <span className="absolute top-0 bottom-0 w-0.5 bg-ink" style={{ left: `${((current - 0.5) / path.length) * 100}%` }} />
            </div>
            <ul className="space-y-0.5">
              {segments.map((s, i) => (
                <li key={s.from}>
                  <button
                    type="button"
                    onClick={() => onGoTo(s.from)}
                    className={`w-full flex items-center gap-2 text-start text-xs rounded px-1 py-0.5 hover:bg-ink/5 ${s.from <= current && current <= s.to ? 'text-ink font-medium' : 'text-ink-light'}`}
                  >
                    <span className={`w-2.5 h-2.5 shrink-0 rounded-sm ${SEGMENT_COLORS[i % SEGMENT_COLORS.length]}`} />
                    <span className="shrink-0 w-24">
                      {t(s.from === s.to ? 'path.dayWord' : 'path.daysWord')}{' '}
                      <span dir="ltr" className="tabular-nums">{s.from === s.to ? s.from : `${s.from}–${s.to}`}</span>
                    </span>
                    <span className="min-w-0 break-words"><bdi>{label(s.what)}</bdi></span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/** Weeks shown at a time in the grid. */
const WEEKS_A_PAGE = 12;

/** The weeks as squares, a page of them at a time, to see what's done and jump to any day. */
export function WeekGrid({ path, progress, current, selected, onGoTo }: {
  path: PathDay[];
  progress: PathProgress;
  current: number;
  selected: number;
  onGoTo: (day: number) => void;
}) {
  const { t, isRTL } = useTranslation();
  const weeks = Array.from({ length: Math.ceil(path.length / 7) }, (_, w) => path.slice(w * 7, w * 7 + 7));
  const pages = Math.ceil(weeks.length / WEEKS_A_PAGE);
  const pageOf = (day: number) => Math.floor((Math.ceil(day / 7) - 1) / WEEKS_A_PAGE);
  // Opens on the page of the selected day, and follows it when it moves to another page.
  const [page, setPage] = useState(() => pageOf(selected));
  const [followed, setFollowed] = useState(selected);
  if (followed !== selected) {
    setFollowed(selected);
    setPage(pageOf(selected));
  }
  const shown = weeks.slice(page * WEEKS_A_PAGE, (page + 1) * WEEKS_A_PAGE);
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  return (
    <div className="space-y-3">
      {pages > 1 && (
        <div className="flex items-center justify-between gap-2 text-xs text-ink-light">
          <button type="button" onClick={() => setPage(page - 1)} disabled={page === 0} className="p-1.5 rounded-lg hover:bg-ink/5 disabled:opacity-30" aria-label={t('path.prevWeeks')}>
            <PrevIcon size={16} />
          </button>
          <span className="tabular-nums">
            {t('path.weeksRange').replace('{from}', String(page * WEEKS_A_PAGE + 1)).replace('{to}', String(page * WEEKS_A_PAGE + shown.length))}
          </span>
          <button type="button" onClick={() => setPage(page + 1)} disabled={page === pages - 1} className="p-1.5 rounded-lg hover:bg-ink/5 disabled:opacity-30" aria-label={t('path.nextWeeks')}>
            <NextIcon size={16} />
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-3 text-[11px] text-ink-light">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-sage-soft" /> {t('path.legend.done')}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gold-soft/60" /> {t('path.legend.started')}</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded ring-2 ring-clay-soft" /> {t('path.legend.current')}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
        {shown.map((w) => (
          <div key={w[0].week} className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-[11px] text-ink-lighter">{t('path.week').replace('{n}', String(w[0].week))}</span>
            <div className="flex gap-1">
              {w.map((d) => {
                const p = dayProgress(d, progress);
                const done = p.done === p.total;
                const label = `${t('path.dayN').replace('{n}', String(d.day))} (${p.done}/${p.total})`;
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => onGoTo(d.day)}
                    title={label}
                    aria-label={label}
                    aria-current={d.day === selected ? 'true' : undefined}
                    className={`w-7 h-7 rounded-md text-[11px] tabular-nums transition-colors ${
                      done ? 'bg-sage-soft text-white' : p.done ? 'bg-gold-soft/60 text-ink' : 'bg-ink/5 text-ink-light hover:bg-ink/10'
                    } ${d.day === current ? 'ring-2 ring-clay-soft' : ''} ${d.day === selected ? 'outline outline-2 outline-offset-1 outline-ink/40' : ''}`}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

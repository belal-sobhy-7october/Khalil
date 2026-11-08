import { useState } from 'react';
import { CheckCircle, ChevronDown, Circle, Link2, Moon, Repeat } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { useTasksSettings } from '../../lib/tasksSettings';
import type { TodayRow } from './useTodayRows';

const COLLAPSED_KEY = 'khalil-today-collapsed';

function readCollapsed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(COLLAPSED_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

/** Today's wird items and habits in today's tasks, grouped (each group folds away, remembered on the device). */
export default function TodayRecurring({ rows }: { rows: TodayRow[] }) {
  const { t } = useTranslation();
  const [settings] = useTasksSettings();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  if (rows.length === 0) return null;
  const toggleGroup = (group: string) =>
    setCollapsed((prev) => {
      const next = prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group];
      try {
        localStorage.setItem(COLLAPSED_KEY, JSON.stringify(next));
      } catch {
        // storage blocked: folded for this visit only
      }
      return next;
    });
  const groups = (['wird', 'habit'] as const)
    .map((group) => ({ group, all: rows.filter((r) => r.group === group) }))
    .filter((g) => g.all.length > 0);

  return (
    <div className={`${settings.recurringPosition === 'top' ? 'border-b' : 'border-t'} border-border-subtle p-2 space-y-2`}>
      {groups.map(({ group, all }) => {
        const shown = settings.doneRecurring === 'hide' ? all.filter((r) => !r.done) : all;
        const doneCount = all.filter((r) => r.done).length;
        const Icon = group === 'wird' ? Moon : Repeat;
        const folded = collapsed.includes(group);
        return (
          <div key={group}>
            <button
              onClick={() => toggleGroup(group)}
              aria-expanded={!folded}
              className="w-full flex items-center gap-1.5 px-3 pt-1 text-xs font-medium text-ink-light hover:text-ink"
            >
              <Icon size={13} className="text-clay-soft" />
              <span className="flex-1 text-start">{t(group === 'wird' ? 'todo.fromWird' : 'todo.fromHabits')}</span>
              <span className="tabular-nums text-ink-lighter">{doneCount}/{all.length}</span>
              <ChevronDown size={14} className={`transition-transform ${folded ? '' : 'rotate-180'}`} aria-hidden />
            </button>
            {!folded && shown.length === 0 && <p className="px-3 py-1.5 text-xs text-ink-lighter">{t('todo.allDone')}</p>}
            {!folded && (
              <ul>
                {shown.map((row) => (
                  <li key={row.key} className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 px-3 py-2 rounded-lg hover:bg-ink/3 transition-colors ${row.done ? 'opacity-70' : ''}`}>
                    <button
                      onClick={row.onToggle}
                      aria-pressed={row.done}
                      aria-label={`${t(row.done ? 'a11y.markIncomplete' : 'a11y.markComplete')}: ${row.label}`}
                      className="shrink-0 p-0.5 -m-0.5 text-ink-lighter hover:text-clay-soft transition-colors"
                    >
                      {row.done ? <CheckCircle size={20} className="text-sage-soft" /> : <Circle size={20} />}
                    </button>
                    <span className={`flex-1 min-w-0 text-sm break-words ${row.done ? 'line-through text-ink-lighter' : 'text-ink'}`} dir="auto">
                      {row.label}
                    </span>
                    {row.habits && row.habits.length > 0 && (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-clay-soft max-w-[45%] truncate" title={row.habits.join('، ')}>
                        <Link2 size={11} className="shrink-0" />
                        <span className="truncate">{row.habits.join('، ')}</span>
                      </span>
                    )}
                    {row.note &&
                      (row.onNote ? (
                        <button onClick={row.onNote} className="shrink-0 text-[11px] px-1.5 py-0.5 rounded bg-ink/5 text-ink-light hover:bg-ink/10" title={t('todo.switchPrayerState')}>
                          {row.note}
                        </button>
                      ) : (
                        <span className="shrink-0 text-[11px] text-ink-lighter tabular-nums">{row.note}</span>
                      ))}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

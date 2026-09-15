import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import type { CalendarEvent } from '../../types';

interface CalendarYearViewProps {
  currentDate: string;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onCompleteEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

const MONTHS = 12;
const DAYS_IN_WEEK = 7;

// Jan 1, 2023 was a Sunday — used as a stable reference to derive each
// weekday's locale-correct narrow label (e.g. 'S' vs 'ح') via toLocaleDateString,
// instead of a hand-maintained (and previously incomplete/incorrect) letter map.
const WEEKDAY_REFERENCE_SUNDAY = new Date(2023, 0, 1);

export default memo(function CalendarYearView({ currentDate, events }: CalendarYearViewProps) {
  const { isRTL } = useTranslation();
  const locale = isRTL ? 'ar-EG' : 'en-US';

  const year = useMemo(() => new Date(currentDate + 'T00:00:00').getFullYear(), [currentDate]);

  const weekdayLabels = useMemo(() => (
    Array.from({ length: DAYS_IN_WEEK }, (_, i) =>
      new Date(WEEKDAY_REFERENCE_SUNDAY.getFullYear(), WEEKDAY_REFERENCE_SUNDAY.getMonth(), WEEKDAY_REFERENCE_SUNDAY.getDate() + i)
        .toLocaleDateString(locale, { weekday: 'narrow' })
    )
  ), [locale]);

  const monthsData = useMemo(() => {
    const months = [];
    for (let m = 0; m < MONTHS; m++) {
      const firstDay = new Date(year, m, 1);
      const lastDay = new Date(year, m + 1, 0);
      const startingDayOfWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();

      const days: (Date | null)[] = [];
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        days.push(new Date(year, m, -i));
      }
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, m, i));
      }
      const remaining = (DAYS_IN_WEEK - (days.length % DAYS_IN_WEEK)) % DAYS_IN_WEEK;
      for (let i = 1; i <= remaining; i++) {
        days.push(new Date(year, m + 1, i));
      }

      months.push({ month: m, name: firstDay.toLocaleDateString(locale, { month: 'long' }), days });
    }
    return months;
  }, [year, locale]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const isCurrentMonth = (date: Date, month: number) => date.getMonth() === month;

  const formatDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return (
    <div className="h-[calc(100vh-300px)] min-h-[500px] overflow-y-auto scrollbar-thin p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {monthsData.map(({ month, name, days }) => (
          <motion.div
            key={month}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border-subtle rounded-xl overflow-hidden"
          >
            <div className="px-3 py-2 bg-ink/3 border-b border-border-subtle">
              <h3 className="text-sm font-semibold text-ink text-center">{name}</h3>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {weekdayLabels.map((day, i) => (
                  <div key={`weekday-${i}`} className="h-6 flex items-center justify-center text-[10px] text-ink-lighter font-medium">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {days.map((date, index) => {
                  if (!date) return <div key={index} className="h-6" />;
                  const dateStr = formatDateKey(date);
                  const dayEvents = eventsByDate[dateStr] || [];
                  const today = isToday(date);
                  const currentMonth = isCurrentMonth(date, month);

                  return (
                    <motion.div
                      key={dateStr}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative h-6 min-h-6 flex items-center justify-center ${!currentMonth ? 'text-ink-lighter' : 'text-ink'} ${today ? 'text-clay-soft font-bold' : ''} ${dayEvents.length > 0 ? 'font-medium' : ''}`}
                    >
                      <span className="text-xs w-6 h-6 flex items-center justify-center rounded-full ${today ? 'bg-clay-soft text-white' : ''}">
                        {date.getDate()}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayEvents.slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: `var(--calendar-color-${event.color}-500)` }}
                              title={event.title}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-[8px] text-ink-light">+{dayEvents.length - 3}</span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
});
import { memo, useMemo, useCallback } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import { addDaysToDateString, getToday, getWeekStart } from '../../store/dateHelpers';
import type { CalendarEvent } from '../../types';

interface CalendarMultiWeekViewProps {
  currentDate: string;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onCompleteEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

const DAYS_IN_WEEK = 7;
const WEEKS = 2;

const formatDayHeader = (date: Date, isRTL: boolean) => {
  return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { weekday: 'short', day: 'numeric' });
};

const isToday = (dateStr: string) => dateStr === getToday();

export default memo(function CalendarMultiWeekView({ currentDate, events, onEditEvent, onCompleteEvent }: CalendarMultiWeekViewProps) {
  const { isRTL } = useTranslation();

  const firstWeekStart = useMemo(() => getWeekStart(currentDate), [currentDate]);
  const multiWeekDates = useMemo(() => {
    const dates: string[] = [];
    for (let w = 0; w < WEEKS; w++) {
      const weekStart = addDaysToDateString(firstWeekStart, w * 7);
      for (let i = 0; i < DAYS_IN_WEEK; i++) {
        dates.push(addDaysToDateString(weekStart, i));
      }
    }
    return dates;
  }, [firstWeekStart]);

  const multiWeekEvents = useMemo(() => 
    events.filter(e => multiWeekDates.includes(e.date)).sort((a, b) => {
      const dayA = multiWeekDates.indexOf(a.date);
      const dayB = multiWeekDates.indexOf(b.date);
      if (dayA !== dayB) return dayA - dayB;
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return -1;
      if (!b.startTime) return 1;
      return a.startTime.localeCompare(b.startTime);
    }), 
  [events, multiWeekDates]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    multiWeekDates.forEach(d => map[d] = []);
    multiWeekEvents.forEach(e => {
      if (map[e.date]) map[e.date].push(e);
    });
    return map;
  }, [multiWeekEvents, multiWeekDates]);

  const handleComplete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCompleteEvent(id);
  }, [onCompleteEvent]);

  return (
    <div className="h-[calc(100vh-300px)] min-h-[500px] overflow-x-auto scrollbar-thin">
      <div className="grid grid-cols-[repeat(14,1fr)] min-w-max">
        {multiWeekDates.map((dateStr) => {
          const date = new Date(dateStr + 'T00:00:00');
          const dayEvents = eventsByDate[dateStr] || [];
          const today = isToday(dateStr);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          
          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative h-[calc(100vh-300px)] min-h-[500px] border border-border-subtle/50 flex flex-col ${isWeekend ? 'bg-ink/3' : 'bg-card'} ${today ? 'border-clay-soft' : ''}`}
            >
              <div className={`flex flex-col items-center justify-center px-1 py-2 border-b border-border-subtle ${today ? 'bg-clay-soft/10' : ''} sticky top-0 z-10 bg-card/95 backdrop-blur`}>
                <span className={`text-xs font-medium ${today ? 'text-clay-soft' : 'text-ink'}`}>
                  {formatDayHeader(date, isRTL)}
                </span>
                <span className={`text-sm font-semibold ${today ? 'text-clay-soft' : 'text-ink'}`}>
                  {date.getDate()}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {dayEvents.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer hover:bg-ink/5 transition-colors text-xs"
                    onClick={() => onEditEvent(event)}
                    style={{ 
                      backgroundColor: `var(--calendar-color-${event.color}-100)`, 
                      borderLeft: `3px solid var(--calendar-color-${event.color}-500)` 
                    }}
                  >
                    <button
                      onClick={(e) => handleComplete(event.id, e)}
                      className="shrink-0"
                      aria-label={event.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {event.completed ? <CheckCircle size={12} className="text-sage-soft" /> : <Circle size={12} className="text-ink-light" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <span className="truncate font-medium block" style={{ color: `var(--calendar-color-${event.color}-700)` }}>{event.title}</span>
                      {event.startTime && (
                        <span className="text-[10px] opacity-70 truncate block">{event.startTime}{event.endTime && ` - ${event.endTime}`}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
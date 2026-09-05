import { memo, useMemo, useCallback } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CalendarEvent } from '../../types';

interface CalendarMonthViewProps {
  currentDate: string;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onCompleteEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

const DAYS_IN_WEEK = 7;

export default memo(function CalendarMonthView({ currentDate, events, onEditEvent, onCompleteEvent }: CalendarMonthViewProps) {
  const monthDate = useMemo(() => new Date(currentDate + 'T00:00:00'), [currentDate]);
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDayOfMonth = useMemo(() => new Date(year, month, 1), [year, month]);
  const lastDayOfMonth = useMemo(() => new Date(year, month + 1, 0), [year, month]);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    const remaining = (DAYS_IN_WEEK - (days.length % DAYS_IN_WEEK)) % DAYS_IN_WEEK;
    for (let i = 1; i <= remaining; i++) {
      days.push(new Date(year, month + 1, i));
    }
    return days;
  }, [year, month, startingDayOfWeek, daysInMonth]);

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

  const isCurrentMonth = (date: Date) => date.getMonth() === month;

  const formatDateKey = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleComplete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCompleteEvent(id);
  }, [onCompleteEvent]);

  return (
    <div className="h-[calc(100vh-300px)] min-h-[500px] overflow-y-auto scrollbar-thin">
      <div className="grid grid-cols-7 gap-0.5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-ink-lighter border-b border-border-subtle bg-card/50 sticky top-0 z-10">
            {day}
          </div>
        ))}
        {calendarDays.map((date, index) => {
          if (!date) return <div key={index} className="h-24 border border-border-subtle/50" />;
          const dateStr = formatDateKey(date);
          const dayEvents = eventsByDate[dateStr] || [];
          const today = isToday(date);
          const currentMonth = isCurrentMonth(date);

          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative h-24 min-h-24 border border-border-subtle/50 flex flex-col ${!currentMonth ? 'bg-ink/3' : 'bg-card'} hover:bg-ink/3 transition-colors ${today ? 'border-clay-soft' : ''}`}
            >
              <div className={`flex items-start justify-between p-1.5 ${today ? 'bg-clay-soft/10' : ''}`}>
                <span className={`text-sm font-medium ${today ? 'text-clay-soft' : currentMonth ? 'text-ink' : 'text-ink-lighter'}`}>
                  {date.getDate()}
                </span>
                {dayEvents.length > 3 && (
                  <span className="text-xs text-ink-lighter bg-ink/10 px-1.5 py-0.5 rounded">
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer hover:bg-ink/5 transition-colors text-xs"
                    onClick={() => onEditEvent(event)}
                    style={{ backgroundColor: `var(--color-${event.color}-100, var(--color-${event.color}-50))` }}
                  >
                    <button
                      onClick={(e) => handleComplete(event.id, e)}
                      className="shrink-0"
                      aria-label={event.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {event.completed ? <CheckCircle size={12} className="text-sage-soft" /> : <Circle size={12} className="text-ink-light" />}
                    </button>
                    <span className="truncate font-medium" style={{ color: `var(--color-${event.color}-600)` }}>{event.title}</span>
                    {event.startTime && <span className="text-[10px] opacity-70">{event.startTime}</span>}
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
import { memo, useMemo, useCallback } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { addDaysToDateString, getToday, getWeekStart } from '../../store/dateHelpers';
import type { CalendarEvent } from '../../types';

interface CalendarWeekViewProps {
  currentDate: string;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onCompleteEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = 7;

const formatDayHeader = (date: Date, isRTL: boolean) => {
  return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { weekday: 'short', day: 'numeric' });
};

const isToday = (dateStr: string) => dateStr === getToday();

const getEventTop = (startTime?: string) => {
  if (!startTime) return 0;
  const [hours, minutes] = startTime.split(':').map(Number);
  return (hours * 60 + minutes) / 60 * 60;
};

const getEventHeight = (startTime?: string, endTime?: string) => {
  if (!startTime) return 60;
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const start = startHours * 60 + startMinutes;
  if (!endTime) return 60;
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const end = endHours * 60 + endMinutes;
  return Math.max(30, (end - start) / 60 * 60);
};

export default memo(function CalendarWeekView({ currentDate, events, onEditEvent, onCompleteEvent }: CalendarWeekViewProps) {
  const { isRTL } = useTranslation();

  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate]);
  const weekDates = useMemo(() => 
    Array.from({ length: DAYS }, (_, i) => addDaysToDateString(weekStart, i)),
  [weekStart]);

  const weekEvents = useMemo(() => 
    events.filter(e => weekDates.includes(e.date)).sort((a, b) => {
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;
      const dayA = weekDates.indexOf(a.date);
      const dayB = weekDates.indexOf(b.date);
      if (dayA !== dayB) return dayA - dayB;
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return -1;
      if (!b.startTime) return 1;
      return a.startTime.localeCompare(b.startTime);
    }), 
  [events, weekDates]);

  const allDayEventsByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    weekDates.forEach(d => map[d] = []);
    weekEvents.filter(e => e.allDay).forEach(e => {
      if (map[e.date]) map[e.date].push(e);
    });
    return map;
  }, [weekEvents, weekDates]);

  const timedEventsByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    weekDates.forEach(d => map[d] = []);
    weekEvents.filter(e => !e.allDay).forEach(e => {
      if (map[e.date]) map[e.date].push(e);
    });
    return map;
  }, [weekEvents, weekDates]);

  const handleComplete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCompleteEvent(id);
  }, [onCompleteEvent]);

  return (
    <div className="h-[calc(100vh-300px)] min-h-[500px] overflow-x-auto scrollbar-thin">
      <div className="grid grid-cols-[50px_repeat(7,1fr)] min-w-max">
        <div className="sticky left-0 bg-card border-e border-border-subtle z-10">
          <div className="h-12 flex items-center justify-center text-xs text-ink-lighter font-medium border-b border-border-subtle" />
          {weekDates.map(dateStr => (
            <div key={dateStr} className="h-12 flex items-end justify-center text-xs text-ink-lighter border-b border-border-subtle/50 px-1" />
          ))}
        </div>
        {weekDates.map((dateStr) => {
          const date = new Date(dateStr + 'T00:00:00');
          const allDayEvents = allDayEventsByDay[dateStr] || [];
          const timedEvents = timedEventsByDay[dateStr] || [];
          return (
            <div key={dateStr} className="relative min-w-[120px]">
              <div className="sticky top-0 z-10">
                <div className={`h-12 flex flex-col items-center justify-center px-1 border-b border-border-subtle bg-card ${isToday(dateStr) ? 'bg-clay-soft/10' : ''}`}>
                  <span className={`text-xs font-medium ${isToday(dateStr) ? 'text-clay-soft' : 'text-ink'}`}>
                    {formatDayHeader(date, isRTL)}
                  </span>
                  <span className={`text-sm font-semibold ${isToday(dateStr) ? 'text-clay-soft' : 'text-ink'}`}>
                    {date.getDate()}
                  </span>
                </div>
                {allDayEvents.length > 0 && (
                  <div className="h-12 bg-ink/3 border-b border-border-subtle p-1 overflow-y-auto">
                    {allDayEvents.map(event => (
                      <div
                        key={event.id}
                        className="flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer hover:bg-ink/5 transition-colors text-xs"
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
                        <span className="truncate font-medium" style={{ color: `var(--calendar-color-${event.color}-700)` }}>{event.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" style={{ minHeight: '1440px' }}>
                <div className="absolute inset-0 grid grid-rows-[repeat(24,60px)]">
                  {HOURS.map((_, i) => (
                    <div key={i} className="border-b border-border-subtle/50" />
                  ))}
                </div>
                <div className="relative" style={{ minHeight: '1440px' }}>
                  {timedEvents.map(event => (
                    <div
                      key={event.id}
                      className="absolute left-0.5 right-0.5 rounded cursor-pointer overflow-hidden shadow-sm"
                      onClick={() => onEditEvent(event)}
                      style={{
                        top: `${getEventTop(event.startTime)}px`,
                        height: `${getEventHeight(event.startTime, event.endTime)}px`,
                        backgroundColor: `var(--calendar-color-${event.color}-100)`,
                        borderLeft: `2px solid var(--calendar-color-${event.color}-500)`,
                      }}
                    >
                      <div className="p-1.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleComplete(event.id, e)}
                            className="shrink-0"
                            aria-label={event.completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {event.completed ? <CheckCircle size={10} className="text-sage-soft" /> : <Circle size={10} className="text-ink-light" />}
                          </button>
                          <span className="text-xs font-medium truncate" style={{ color: `var(--calendar-color-${event.color}-700)` }}>
                            {event.title}
                          </span>
                        </div>
                        {event.startTime && (
                          <div className="text-[10px] opacity-70 mt-0.5 truncate">
                            {event.startTime}{event.endTime && ` - ${event.endTime}`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
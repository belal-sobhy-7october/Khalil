import { memo, useCallback, useMemo } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import type { CalendarEvent } from '../../types';

interface CalendarDayViewProps {
  currentDate: string;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onCompleteEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const formatTime = (hour: number, isRTL: boolean) => {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return isRTL ? `${h} ${ampm}` : `${h} ${ampm}`;
};

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

export default memo(function CalendarDayView({ currentDate, events, onEditEvent, onCompleteEvent }: CalendarDayViewProps) {
  const { t, isRTL } = useTranslation();

  const dayEvents = useMemo(() => 
    events.filter(e => e.date === currentDate).sort((a, b) => {
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return -1;
      if (!b.startTime) return 1;
      return a.startTime.localeCompare(b.startTime);
    }), 
  [events, currentDate]);

  const allDayEvents = useMemo(() => dayEvents.filter(e => e.allDay), [dayEvents]);
  const timedEvents = useMemo(() => dayEvents.filter(e => !e.allDay), [dayEvents]);

  const handleComplete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCompleteEvent(id);
  }, [onCompleteEvent]);

  return (
    <div className="h-[calc(100vh-300px)] min-h-[500px] overflow-y-auto scrollbar-thin">
      <div className="grid grid-cols-[50px_1fr] gap-2">
        <div className="sticky top-0 bg-card border-e border-border-subtle z-10">
          <div className="h-12 flex items-center justify-center text-xs text-ink-lighter font-medium border-b border-border-subtle">
            {t('calendar.allDay')}
          </div>
          {allDayEvents.length === 0 && (
            <div className="h-12 flex items-center justify-center text-xs text-ink-lighter border-b border-border-subtle" />
          )}
          {HOURS.map(hour => (
            <div key={hour} className="h-12 flex items-end justify-center text-xs text-ink-lighter border-b border-border-subtle px-1">
              <span>{formatTime(hour, isRTL)}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="absolute inset-0 grid grid-rows-[repeat(24,60px)]">
            {allDayEvents.length > 0 && (
              <div className="row-span-1 bg-ink/3 border-b border-border-subtle" />
            )}
            {HOURS.map((_, i) => (
              <div key={i} className="border-b border-border-subtle/50" />
            ))}
          </div>

          {allDayEvents.length > 0 && (
            <div className="absolute top-0 left-0 right-0 z-10 bg-card border-b border-border-subtle p-1 max-h-24 overflow-y-auto" style={{ height: '48px' }}>
              <div className="flex flex-wrap gap-1.5 max-w-full">
                {allDayEvents.map(event => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer hover:bg-ink/5 transition-colors text-xs"
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
                      {event.completed ? (
                        <CheckCircle size={12} className="text-sage-soft" />
                      ) : (
                        <Circle size={12} className="text-ink-light" />
                      )}
                    </button>
                    <span className="truncate font-medium" style={{ color: `var(--calendar-color-${event.color}-700)` }}>{event.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="relative" style={{ minHeight: allDayEvents.length > 0 ? '1512px' : '1440px', marginTop: allDayEvents.length > 0 ? '48px' : 0 }}>
            {timedEvents.map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scaleY: 0.8 }}
                animate={{ opacity: 1, scaleY: 1 }}
                className="absolute left-1 right-1 rounded-lg cursor-pointer overflow-hidden shadow-sm"
                onClick={() => onEditEvent(event)}
                style={{
                  top: `${getEventTop(event.startTime) + (allDayEvents.length > 0 ? 48 : 0)}px`,
                  height: `${getEventHeight(event.startTime, event.endTime)}px`,
                  backgroundColor: `var(--calendar-color-${event.color}-100)`,
                  borderLeft: `3px solid var(--calendar-color-${event.color}-500)`,
                }}
              >
                <div className="p-2 flex items-start justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleComplete(event.id, e)}
                      className="shrink-0"
                      aria-label={event.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {event.completed ? (
                        <CheckCircle size={14} className="text-sage-soft" />
                      ) : (
                        <Circle size={14} className="text-ink-light" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: `var(--calendar-color-${event.color}-700)` }}>
                        {event.title}
                      </p>
                      {event.startTime && (
                        <p className="text-xs opacity-70 truncate">
                          {event.startTime}{event.endTime && ` - ${event.endTime}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
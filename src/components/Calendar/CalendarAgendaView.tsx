import { memo, useMemo, useCallback } from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import type { CalendarEvent } from '../../types';

interface CalendarAgendaViewProps {
  currentDate: string;
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
  onCompleteEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

export default memo(function CalendarAgendaView({ events, onEditEvent, onCompleteEvent, onDeleteEvent }: CalendarAgendaViewProps) {
  const { t, isRTL } = useTranslation();

  const sortedEvents = useMemo(() => 
    [...events].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      if (a.allDay && !b.allDay) return -1;
      if (!a.allDay && b.allDay) return 1;
      if (!a.startTime && !b.startTime) return 0;
      if (!a.startTime) return -1;
      if (!b.startTime) return 1;
      return a.startTime.localeCompare(b.startTime);
    }), 
  [events]);

  const groupedEvents = useMemo(() => {
    const groups: Record<string, CalendarEvent[]> = {};
    sortedEvents.forEach(event => {
      if (!groups[event.date]) groups[event.date] = [];
      groups[event.date].push(event);
    });
    return groups;
  }, [sortedEvents]);

  const dates = useMemo(() => Object.keys(groupedEvents).sort(), [groupedEvents]);

  const handleComplete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCompleteEvent(id);
  }, [onCompleteEvent]);

  const handleDelete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this event?')) {
      onDeleteEvent(id);
    }
  }, [onDeleteEvent]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    if (dateStr === todayStr) return t('calendar.today');
    if (dateStr === tomorrowStr) return t('calendar.tomorrow') || 'Tomorrow';
    
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const h = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  if (dates.length === 0) {
    return (
      <div className="h-[calc(100vh-300px)] min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-lighter mb-4">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <h3 className="text-lg font-medium text-ink mb-2">{t('calendar.noEvents')}</h3>
        <p className="text-sm text-ink-light">No events scheduled yet. Click "Add Event" to create one.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-300px)] min-h-[400px] overflow-y-auto scrollbar-thin space-y-6">
      {dates.map((dateStr, index) => {
        const dayEvents = groupedEvents[dateStr];
        const isTodayDate = dateStr === new Date().toISOString().split('T')[0];
        
        return (
          <motion.div
            key={dateStr}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-px h-8 bg-gradient-to-b ${isTodayDate ? 'from-clay-soft to-gold-soft' : 'from-ink/20 to-transparent'}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${isTodayDate ? 'text-clay-soft' : 'text-ink'}`}>
                    {formatDate(dateStr)}
                  </span>
                  {isTodayDate && (
                    <span className="px-2 py-0.5 text-xs bg-clay-soft/10 text-clay-soft rounded-full font-medium">
                      {t('calendar.today')}
                    </span>
                  )}
                </div>
                <span className="text-xs text-ink-light">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="space-y-2 ml-4 border-s border-border-subtle/50 pl-4">
              {dayEvents.map((event, eventIndex) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: eventIndex * 0.03 }}
                  className="relative group"
                >
                  <div className="absolute left-[-4px] top-1 bottom-1 w-1 rounded-full" style={{ backgroundColor: `var(--color-${event.color}-500)` }} />
                  <div 
                    className={`bg-card border border-border-subtle rounded-xl p-4 hover:bg-ink/3 transition-colors cursor-pointer ${event.completed ? 'opacity-60' : ''}`}
                    onClick={() => onEditEvent(event)}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={(e) => handleComplete(event.id, e)}
                        className="shrink-0 mt-0.5"
                        aria-label={event.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {event.completed ? (
                          <CheckCircle size={20} className="text-sage-soft" />
                        ) : (
                          <Circle size={20} className="text-ink-light" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-ink truncate" style={{ color: `var(--color-${event.color}-700)` }}>
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-ink-light">
                          {event.allDay ? (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-ink/5 rounded-full text-xs">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `var(--color-${event.color}-500)` }} />
                              {t('calendar.allDay')}
                            </span>
                          ) : (
                            <>
                              {event.startTime && (
                                <span className="flex items-center gap-1">
                                  <Clock size={12} />
                                  {formatTime(event.startTime)}{event.endTime && ` - ${formatTime(event.endTime)}`}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEditEvent(event); }}
                          className="p-1.5 rounded text-ink-lighter hover:text-clay-soft hover:bg-ink/5 transition-colors"
                          aria-label="Edit event"
                        >
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(event.id, e); }}
                          className="p-1.5 rounded text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          aria-label="Delete event"
                        >
                          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});
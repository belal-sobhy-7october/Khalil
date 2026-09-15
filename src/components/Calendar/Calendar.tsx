import { useCallback, useMemo, useState } from 'react';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  HelpCircle,
  LayoutList,
  LayoutGrid,
  Sunrise,
  CalendarDays,
  CalendarRange,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import Tooltip from '../Common/Tooltip';
import CalendarDayView from './CalendarDayView';
import CalendarWeekView from './CalendarWeekView';
import CalendarMonthView from './CalendarMonthView';
import CalendarAgendaView from './CalendarAgendaView';
import CalendarMultiDayView from './CalendarMultiDayView';
import CalendarMultiWeekView from './CalendarMultiWeekView';
import CalendarYearView from './CalendarYearView';
import CalendarEventModal from './CalendarEventModal';

type CalendarViewMode = 'day' | 'week' | 'month' | 'agenda' | 'multi-day' | 'multi-week' | 'year';

interface ViewButton {
  mode: CalendarViewMode;
  icon: React.ReactNode;
  tooltip: string;
}

const VIEW_BUTTONS: ViewButton[] = [
  { mode: 'year', icon: <Minimize2 size={16} />, tooltip: 'calendar.yearTooltip' },
  { mode: 'month', icon: <CalendarDays size={16} />, tooltip: 'calendar.monthTooltip' },
  { mode: 'week', icon: <LayoutGrid size={16} />, tooltip: 'calendar.weekTooltip' },
  { mode: 'day', icon: <Sunrise size={16} />, tooltip: 'calendar.dayTooltip' },
  { mode: 'agenda', icon: <LayoutList size={16} />, tooltip: 'calendar.agendaTooltip' },
  { mode: 'multi-day', icon: <CalendarRange size={16} />, tooltip: 'calendar.multiDayTooltip' },
  { mode: 'multi-week', icon: <Maximize2 size={16} />, tooltip: 'calendar.multiWeekTooltip' },
];

export default function Calendar() {
  const { t, isRTL } = useTranslation();
  const calendarEvents = useAppStore((s) => s.calendarEvents);
  const currentDate = useAppStore((s) => s.currentDate);
  const viewMode = useAppStore((s) => s.viewMode);
  const showCalendarOnboarding = useAppStore((s) => s.showCalendarOnboarding);
  const setViewMode = useAppStore((s) => s.setViewMode);
  const navigatePrevious = useAppStore((s) => s.navigatePrevious);
  const navigateNext = useAppStore((s) => s.navigateNext);
  const navigateToday = useAppStore((s) => s.navigateToday);
  const dismissCalendarOnboarding = useAppStore((s) => s.dismissCalendarOnboarding);
  const addCalendarEvent = useAppStore((s) => s.addCalendarEvent);
  const toggleCalendarEventComplete = useAppStore((s) => s.toggleCalendarEventComplete);
  const deleteCalendarEvent = useAppStore((s) => s.deleteCalendarEvent);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<typeof calendarEvents[0] | null>(null);

  const periodLabel = useMemo(() => {
    const date = new Date(currentDate + 'T00:00:00');
    switch (viewMode) {
      case 'day':
        return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      case 'week':
      case 'multi-week': {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${weekStart.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
      case 'month':
        return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });
      case 'year':
        return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { year: 'numeric' });
      case 'multi-day': {
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 2);
        return `${date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      }
      case 'agenda':
        return t('calendar.agenda');
      default:
        return '';
    }
  }, [currentDate, viewMode, isRTL, t]);

  const handleAddEvent = useCallback(() => {
    setEditingEvent(null);
    setIsModalOpen(true);
  }, []);

  const handleEditEvent = useCallback((event: typeof calendarEvents[0]) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleEventSave = useCallback(async (eventData: Omit<typeof calendarEvents[0], 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (editingEvent) {
      return await useAppStore.getState().updateCalendarEvent(editingEvent.id, eventData);
    }
    return await addCalendarEvent(eventData);
  }, [editingEvent, addCalendarEvent]);

  const handleEventDelete = useCallback(async (id: string) => {
    await deleteCalendarEvent(id);
    setIsModalOpen(false);
  }, [deleteCalendarEvent]);

  const handleEventComplete = useCallback(async (id: string) => {
    await toggleCalendarEventComplete(id);
  }, [toggleCalendarEventComplete]);

  const handleOnboardingDismiss = useCallback(() => {
    dismissCalendarOnboarding();
  }, [dismissCalendarOnboarding]);

  return (
    <section id="section-calendar" className="space-y-6">
      <div className="bg-card border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={navigatePrevious}
              className="p-2 rounded-lg text-ink-light hover:text-ink hover:bg-ink/5 transition-colors"
              aria-label="Previous period"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-ink whitespace-nowrap">{periodLabel}</h2>
            <button
              onClick={navigateNext}
              className="p-2 rounded-lg text-ink-light hover:text-ink hover:bg-ink/5 transition-colors"
              aria-label="Next period"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={navigateToday}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-ink-light hover:text-ink hover:bg-ink/5 border border-border-subtle transition-all whitespace-nowrap"
            >
              <CalendarIcon size={14} className="inline-block align-middle mr-1" />
              {t('calendar.today')}
            </button>
            <button
              onClick={handleAddEvent}
              className="px-4 py-2 rounded-lg bg-clay-soft hover:bg-clay-soft-dark text-white text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={16} />
              {t('calendar.addEvent')}
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <AnimatePresence mode="wait">
            {viewMode === 'day' && <CalendarDayView currentDate={currentDate} events={calendarEvents} onEditEvent={handleEditEvent} onCompleteEvent={handleEventComplete} onDeleteEvent={deleteCalendarEvent} />}
            {viewMode === 'week' && <CalendarWeekView currentDate={currentDate} events={calendarEvents} onEditEvent={handleEditEvent} onCompleteEvent={handleEventComplete} onDeleteEvent={deleteCalendarEvent} />}
            {viewMode === 'month' && <CalendarMonthView currentDate={currentDate} events={calendarEvents} onEditEvent={handleEditEvent} onCompleteEvent={handleEventComplete} onDeleteEvent={deleteCalendarEvent} />}
            {viewMode === 'agenda' && <CalendarAgendaView currentDate={currentDate} events={calendarEvents} onEditEvent={handleEditEvent} onCompleteEvent={handleEventComplete} onDeleteEvent={deleteCalendarEvent} />}
            {viewMode === 'multi-day' && <CalendarMultiDayView currentDate={currentDate} events={calendarEvents} onEditEvent={handleEditEvent} onCompleteEvent={handleEventComplete} onDeleteEvent={deleteCalendarEvent} />}
            {viewMode === 'multi-week' && <CalendarMultiWeekView currentDate={currentDate} events={calendarEvents} onEditEvent={handleEditEvent} onCompleteEvent={handleEventComplete} onDeleteEvent={deleteCalendarEvent} />}
            {viewMode === 'year' && <CalendarYearView currentDate={currentDate} events={calendarEvents} onEditEvent={handleEditEvent} onCompleteEvent={handleEventComplete} onDeleteEvent={deleteCalendarEvent} />}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-card border border-border-subtle rounded-xl p-3 md:p-4">
        <div className="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto pb-2 -mx-3 md:mx-0 px-3 md:px-0" role="tablist" aria-label={t('calendar.title')}>
          {VIEW_BUTTONS.map(({ mode, icon, tooltip }) => (
            <Tooltip key={mode} text={t(tooltip)}>
              <button
                role="tab"
                aria-selected={viewMode === mode}
                onClick={() => setViewMode(mode)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[70px] ${
                  viewMode === mode
                    ? 'bg-clay-soft text-white'
                    : 'text-ink-light hover:text-ink hover:bg-ink/5'
                }`}
              >
                <span className="flex items-center">{icon}</span>
                <span className="text-xs font-medium">{t(`calendar.${mode === 'multi-day' ? 'multiDay' : mode === 'multi-week' ? 'multiWeek' : mode}`)}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {showCalendarOnboarding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-24 start-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4 bg-card border border-border-subtle rounded-xl p-6 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <HelpCircle size={24} className="text-clay-soft shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-ink mb-2">{t('calendar.onboardingTitle')}</h3>
              <p className="text-sm text-ink-light mb-4">{t('calendar.onboardingText')}</p>
              <button
                onClick={handleOnboardingDismiss}
                className="px-4 py-2 bg-clay-soft hover:bg-clay-soft-dark text-white text-sm font-medium rounded-lg transition-colors"
              >
                {t('calendar.onboardingGotIt')}
              </button>
            </div>
            <button
              onClick={handleOnboardingDismiss}
              className="p-1 text-ink-lighter hover:text-ink transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <CalendarEventModal
            key={editingEvent ? editingEvent.id : `new-${currentDate}`}
            event={editingEvent}
            initialDate={currentDate}
            onSave={handleEventSave}
            onDelete={editingEvent ? () => handleEventDelete(editingEvent.id) : undefined}
            onClose={() => { setIsModalOpen(false); setEditingEvent(null); }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
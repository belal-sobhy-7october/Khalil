import { useState, useCallback } from 'react';
import { X, Clock, Calendar as CalendarIcon, Trash2, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import type { CalendarEvent } from '../../types';
import Tooltip from '../Common/Tooltip';

const COLORS = [
  { id: 'terracotta', label: 'Terracotta' },
  { id: 'amber', label: 'Amber' },
  { id: 'gold', label: 'Gold' },
  { id: 'sage', label: 'Sage' },
  { id: 'blue', label: 'Blue' },
  { id: 'indigo', label: 'Indigo' },
  { id: 'purple', label: 'Purple' },
  { id: 'pink', label: 'Pink' },
  { id: 'rose', label: 'Rose' },
];

interface CalendarEventModalProps {
  event: CalendarEvent | null;
  initialDate: string;
  onSave: (eventData: Omit<CalendarEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; error?: string }>;
  onDelete?: () => void;
  onClose: () => void;
}

export default function CalendarEventModal({ event, initialDate, onSave, onDelete, onClose }: CalendarEventModalProps) {
  const { t, isRTL } = useTranslation();

  const [title, setTitle] = useState(() => event?.title ?? '');
  const [date, setDate] = useState(() => event?.date ?? initialDate);
  const [startTime, setStartTime] = useState(() => event?.startTime || '');
  const [endTime, setEndTime] = useState(() => event?.endTime || '');
  const [allDay, setAllDay] = useState(() => event?.allDay ?? false);
  const [color, setColor] = useState(() => event?.color || 'terracotta');
  const [completed, setCompleted] = useState(() => event?.completed ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = t('calendar.eventTitleRequired');
    }
    if (!date) {
      newErrors.date = t('calendar.dateRequired');
    }
    if (!allDay) {
      if (!startTime) {
        newErrors.startTime = t('calendar.startTimeRequired');
      }
      if (!endTime) {
        newErrors.endTime = t('calendar.endTimeRequired');
      }
      if (startTime && endTime && startTime >= endTime) {
        newErrors.endTime = t('calendar.endTimeAfterStart');
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, date, startTime, endTime, allDay, t]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await onSave({
        title: title.trim(),
        date,
        startTime: allDay ? undefined : startTime,
        endTime: allDay ? undefined : endTime,
        allDay,
        completed,
        color,
      });
      if (result.success) {
        onClose();
      } else {
        setSubmitError(result.error || t('calendar.saveFailed'));
      }
    } catch {
      setSubmitError(t('calendar.saveFailed'));
    } finally {
      setIsSubmitting(false);
    }
  }, [title, date, startTime, endTime, allDay, completed, color, onSave, onClose, validateForm, t]);

  const handleDelete = useCallback(() => {
    if (onDelete && confirm('Delete this event?')) {
      onDelete();
    }
  }, [onDelete]);

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="bg-card border border-border-subtle rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 md:p-6 border-b border-border-subtle flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-semibold text-ink">
            {event ? t('calendar.edit') : t('calendar.addEvent')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-ink-light hover:text-ink hover:bg-ink/5 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          {submitError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-ink mb-1">
              {t('calendar.eventTitle')}
            </label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); clearError('title'); }}
              onBlur={() => validateForm()}
              placeholder={t('calendar.eventTitle')}
              dir={isRTL ? 'rtl' : 'ltr'}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-2 focus:ring-clay-soft/20 focus:border-transparent transition-all ${
                errors.title ? 'border-red-500' : 'border-border-subtle'
              }`}
              autoFocus
              aria-invalid={errors.title ? 'true' : 'false'}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-500 flex items-center gap-1" role="alert">
                <AlertCircle size={12} />
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              {t('calendar.color')}
            </label>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Event color">
              {COLORS.map(c => (
                <Tooltip key={c.id} text={c.label}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={color === c.id}
                    onClick={() => setColor(c.id)}
                    className={`relative w-10 h-10 rounded-full transition-all flex-shrink-0 flex items-center justify-center ${
                      color === c.id 
                        ? 'ring-4 ring-ink/50 ring-offset-2 ring-offset-card scale-110 shadow-lg' 
                        : 'border-2 border-transparent hover:border-border-subtle hover:scale-105'
                    }`}
                    style={{ backgroundColor: `var(--calendar-color-${c.id}-500)` }}
                    aria-label={c.label}
                  >
                    {color === c.id && (
                      <Check size={18} className="text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
                    )}
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="event-date" className="block text-sm font-medium text-ink mb-1">
                <CalendarIcon size={14} className="inline-block align-middle mr-1" />
                {t('calendar.date')}
              </label>
              <input
                id="event-date"
                type="date"
                value={date}
                onChange={e => { setDate(e.target.value); clearError('date'); }}
                onBlur={() => validateForm()}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-ink/3 text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/20 focus:border-transparent transition-all ${
                  errors.date ? 'border-red-500' : 'border-border-subtle'
                }`}
                aria-invalid={errors.date ? 'true' : 'false'}
                aria-describedby={errors.date ? 'date-error' : undefined}
              />
              {errors.date && (
                <p id="date-error" className="mt-1 text-sm text-red-500 flex items-center gap-1" role="alert">
                  <AlertCircle size={12} />
                  {errors.date}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                <Clock size={14} className="inline-block align-middle mr-1" />
                {allDay ? t('calendar.allDay') : t('calendar.startTime')}
              </label>
              {allDay ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allDay}
                    onChange={e => setAllDay(e.target.checked)}
                    id="all-day"
                    className="shrink-0"
                  />
                  <label htmlFor="all-day" className="text-sm text-ink cursor-pointer">{t('calendar.allDay')}</label>
                </div>
              ) : (
                <>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => { setStartTime(e.target.value); clearError('startTime'); }}
                    onBlur={() => validateForm()}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-ink/3 text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/20 focus:border-transparent transition-all ${
                      errors.startTime ? 'border-red-500' : 'border-border-subtle'
                    }`}
                    aria-invalid={errors.startTime ? 'true' : 'false'}
                    aria-describedby={errors.startTime ? 'startTime-error' : undefined}
                  />
                  {errors.startTime && (
                    <p id="startTime-error" className="mt-1 text-sm text-red-500 flex items-center gap-1" role="alert">
                      <AlertCircle size={12} />
                      {errors.startTime}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {!allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-end-time" className="block text-sm font-medium text-ink mb-1">
                  <Clock size={14} className="inline-block align-middle mr-1" />
                  {t('calendar.endTime')}
                </label>
                <input
                  id="event-end-time"
                  type="time"
                  value={endTime}
                  onChange={e => { setEndTime(e.target.value); clearError('endTime'); }}
                  onBlur={() => validateForm()}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm bg-ink/3 text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/20 focus:border-transparent transition-all ${
                    errors.endTime ? 'border-red-500' : 'border-border-subtle'
                  }`}
                  aria-invalid={errors.endTime ? 'true' : 'false'}
                  aria-describedby={errors.endTime ? 'endTime-error' : undefined}
                />
                {errors.endTime && (
                  <p id="endTime-error" className="mt-1 text-sm text-red-500 flex items-center gap-1" role="alert">
                    <AlertCircle size={12} />
                    {errors.endTime}
                  </p>
                )}
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allDay}
                    onChange={e => setAllDay(e.target.checked)}
                    id="all-day-2"
                    className="shrink-0"
                  />
                  <span className="text-sm text-ink">{t('calendar.allDay')}</span>
                </label>
              </div>
            </div>
          )}

          {allDay && (
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={e => setAllDay(e.target.checked)}
                  id="all-day-3"
                  className="shrink-0"
                />
                <span className="text-sm text-ink">{t('calendar.allDay')}</span>
              </label>
            </div>
          )}

          {event && (
            <div className="flex items-center gap-3 pt-2 border-t border-border-subtle">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={e => setCompleted(e.target.checked)}
                  className="shrink-0"
                />
                <span className="text-ink">{t('calendar.complete')}</span>
              </label>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-ink-light hover:text-ink hover:bg-ink/5 border border-border-subtle transition-all"
            >
              {t('common.cancel')}
            </button>
            {event && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-500/20 transition-all"
              >
                <Trash2 size={14} className="inline-block align-middle mr-1" />
                {t('common.delete')}
              </button>
            )}
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="px-4 py-2 bg-clay-soft hover:bg-clay-soft-dark disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('common.saving')}
                </>
              ) : (
                t('common.save')
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
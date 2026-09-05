import { useState, useEffect, useCallback } from 'react';
import { X, Clock, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import type { CalendarEvent } from '../../types';
import Tooltip from '../Common/Tooltip';

const COLORS = [
  { id: 'clay-soft', label: 'Terracotta' },
  { id: 'gold-soft', label: 'Gold' },
  { id: 'sage-soft', label: 'Sage' },
  { id: 'terracotta', label: 'Deep Terracotta' },
  { id: 'amber', label: 'Amber' },
  { id: 'rose', label: 'Rose' },
  { id: 'blue', label: 'Blue' },
  { id: 'indigo', label: 'Indigo' },
  { id: 'purple', label: 'Purple' },
  { id: 'pink', label: 'Pink' },
];

interface CalendarEventModalProps {
  event: CalendarEvent | null;
  initialDate: string;
  onSave: (eventData: Omit<CalendarEvent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

export default function CalendarEventModal({ event, initialDate, onSave, onDelete, onClose }: CalendarEventModalProps) {
  const { t, isRTL } = useTranslation();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState('clay-soft');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setStartTime(event.startTime || '');
      setEndTime(event.endTime || '');
      setAllDay(event.allDay);
      setColor(event.color);
      setCompleted(event.completed);
    } else {
      setTitle('');
      setDate(initialDate);
      setStartTime('');
      setEndTime('');
      setAllDay(false);
      setColor('clay-soft');
      setCompleted(false);
    }
  }, [event, initialDate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      date,
      startTime: allDay ? undefined : startTime,
      endTime: allDay ? undefined : endTime,
      allDay,
      completed,
      color,
    });
  }, [title, date, startTime, endTime, allDay, completed, color, onSave]);

  const handleDelete = useCallback(() => {
    if (onDelete && confirm('Delete this event?')) {
      onDelete();
    }
  }, [onDelete]);

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
          <div>
            <label htmlFor="event-title" className="block text-sm font-medium text-ink mb-1">
              {t('calendar.eventTitle')}
            </label>
            <input
              id="event-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('calendar.eventTitle')}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-2 focus:ring-clay-soft/20 focus:border-transparent transition-all"
              autoFocus
            />
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
                    className={`w-8 h-8 rounded-full border-2 transition-all flex-shrink-0 ${
                      color === c.id ? 'border-ink scale-110 shadow-md' : 'border-transparent hover:border-border-subtle'
                    }`}
                    style={{ backgroundColor: `var(--color-${c.id}-500)` }}
                    aria-label={c.label}
                  />
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
                onChange={e => setDate(e.target.value)}
                className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-sm bg-ink/3 text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/20 focus:border-transparent transition-all"
              />
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
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-sm bg-ink/3 text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/20 focus:border-transparent transition-all"
                />
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
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full border border-border-subtle rounded-lg px-4 py-2.5 text-sm bg-ink/3 text-ink focus:outline-none focus:ring-2 focus:ring-clay-soft/20 focus:border-transparent transition-all"
                />
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
              disabled={!title.trim()}
              className="px-4 py-2 bg-clay-soft hover:bg-clay-soft-dark disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
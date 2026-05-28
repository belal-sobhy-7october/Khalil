import { useState, useRef, useEffect } from 'react';
import { Target, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import CalligraphyWatermark from '../Common/CalligraphyWatermark';

export default function DailyFocus() {
  const { t, isRTL } = useTranslation();
  const dailyFocus = useAppStore((s) => s.dailyFocus);
  const setDailyFocus = useAppStore((s) => s.setDailyFocus);
  const [editing, setEditing] = useState(!dailyFocus.text);
  const [text, setText] = useState(dailyFocus.text || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const today = new Date().toISOString().split('T')[0];

  const handleSave = () => {
    if (text.trim()) {
      setDailyFocus({ text: text.trim(), date: today });
      setEditing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setDailyFocus({ text: '', date: today });
    setEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      if (dailyFocus.text) {
        setText(dailyFocus.text);
        setEditing(false);
      } else {
        setEditing(false);
      }
    }
  };

  return (
    <section id="section-focus">
      <div className="relative bg-card border border-border-subtle rounded-xl p-4 md:p-5 overflow-hidden">
        <CalligraphyWatermark character="خ" opacity={0.04} />
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target size={18} className="text-clay-soft" />
            <span className="text-xs uppercase tracking-[0.15em] text-ink-light font-medium">
              {t('dailyFocus.subtitle')}
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t('dailyFocus.placeholder')}
                      dir={isRTL ? 'rtl' : 'ltr'}
                      className="flex-1 bg-ink/5 border border-border-subtle rounded-lg px-4 py-3 text-ink placeholder-ink-lighter text-lg font-medium focus:outline-none focus:ring-2 focus:ring-clay-soft/30 focus:border-transparent transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-5 py-3 bg-clay-soft hover:bg-clay-soft-dark text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        {t('dailyFocus.save')}
                      </button>
                      {dailyFocus.text && (
                        <button
                          onClick={handleClear}
                          className="px-5 py-3 bg-ink/5 hover:bg-ink/10 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-ink-light"
                        >
                          {t('dailyFocus.clear')}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="display"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center gap-3 group"
                  >
                    <h2 className="text-2xl md:text-3xl font-bold font-amiri text-ink leading-relaxed text-center">
                      {dailyFocus.text}
                    </h2>
                    <button
                      onClick={() => {
                        setEditing(true);
                        setText(dailyFocus.text);
                      }}
                      className="p-1.5 rounded-full bg-ink/5 hover:bg-ink/10 opacity-0 group-hover:opacity-100 transition-all text-ink-light"
                      aria-label={t('dailyFocus.edit')}
                    >
                      <Pencil size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-[10px] text-ink-light/50 mt-4 tracking-wide text-center">
                {new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

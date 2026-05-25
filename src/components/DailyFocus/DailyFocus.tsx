import { useState, useRef, useEffect } from 'react';
import { Target, Pencil, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';

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
    <section id="section-focus" className="mb-8">
      <div className="bg-gradient-to-br from-terracotta-500 to-terracotta-700 dark:from-terracotta-700 dark:to-terracotta-900 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stars" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <polygon points="20,2 25,15 38,15 28,24 31,38 20,30 9,38 12,24 2,15 15,15" fill="white" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stars)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-gold-300" />
            <span className="text-xs uppercase tracking-widest text-cream-200 font-medium">
              {t('dailyFocus.subtitle')}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Target size={24} className="text-gold-300 shrink-0" />
            </div>
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
                      className="flex-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-white/50 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-transparent transition-all"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        {t('dailyFocus.save')}
                      </button>
                      {dailyFocus.text && (
                        <button
                          onClick={handleClear}
                          className="px-4 py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
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
                    className="flex items-center gap-3 group"
                  >
                    <h2 className="text-xl md:text-2xl font-bold font-arabic">
                      {dailyFocus.text}
                    </h2>
                    <button
                      onClick={() => {
                        setEditing(true);
                        setText(dailyFocus.text);
                      }}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-all"
                      aria-label={t('dailyFocus.edit')}
                    >
                      <Pencil size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-xs text-cream-200/70 mt-2">
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

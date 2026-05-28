import { useState } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Circle,
  CheckCircle,
  Flag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import type { Priority } from '../../types';

const priorityColors: Record<Priority, { bg: string; text: string; dot: string }> = {
  high: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500 dark:bg-red-400' },
  medium: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500 dark:bg-amber-400' },
  low: { bg: 'bg-sage-50 dark:bg-sage-950/30', text: 'text-sage-600 dark:text-sage-400', dot: 'bg-sage-500 dark:bg-sage-400' },
};

export default function WeeklyTodo() {
  const { t, isRTL } = useTranslation();
  const todos = useAppStore((s) => s.weeklyTodos);
  const addTodo = useAppStore((s) => s.addWeeklyTodo);
  const toggleTodo = useAppStore((s) => s.toggleWeeklyTodo);
  const removeTodo = useAppStore((s) => s.removeWeeklyTodo);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const completed = todos.filter((t) => t.completed).length;

  const handleAdd = () => {
    if (text.trim()) {
      addTodo(text.trim(), priority);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <section>
      <div className="bg-card border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-5 md:p-6 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gold-soft" />
              <h2 className="text-base font-semibold text-ink">
                {t('weekly.title')}
              </h2>
            </div>
            {todos.length > 0 && (
              <span className="text-xs text-ink-light bg-ink/5 px-2.5 py-1 rounded-full">
                {completed}/{todos.length}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('weekly.addPlaceholder')}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="flex-1 border border-border-subtle rounded-lg px-4 py-2.5 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-2 focus:ring-gold-soft/20 focus:border-transparent transition-all"
            />
            <div className="flex gap-1">
              {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`p-2 rounded-lg border transition-all ${
                    priority === p
                      ? `${priorityColors[p].bg} ${priorityColors[p].text} border-current`
                      : 'border-border-subtle text-ink-lighter hover:bg-ink/5'
                  }`}
                  title={t(`todo.${p}`)}
                >
                  <Flag size={15} />
                </button>
              ))}
            </div>
            <button
              onClick={handleAdd}
              disabled={!text.trim()}
              className="p-2.5 bg-gold-soft hover:bg-gold-soft-dark disabled:opacity-40 text-white rounded-lg transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <div className="p-2">
          <AnimatePresence mode="popLayout">
            {todos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <Calendar size={36} className="mx-auto text-ink-lighter mb-2" />
                <p className="text-sm text-ink-light">{t('weekly.empty')}</p>
              </motion.div>
            ) : (
              todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`group flex items-center gap-3 p-3 rounded-lg hover:bg-ink/3 transition-colors ${
                    todo.completed ? 'opacity-60' : ''
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="shrink-0 text-ink-lighter hover:text-gold-soft transition-colors"
                  >
                    {todo.completed ? (
                      <CheckCircle size={20} className="text-sage-soft" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>

                  <div className={`flex items-center gap-2 min-w-0 ${priorityColors[todo.priority].bg} px-2 py-0.5 rounded`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityColors[todo.priority].dot}`} />
                    <span className={`text-[10px] uppercase tracking-wider font-medium ${priorityColors[todo.priority].text}`}>
                      {todo.priority}
                    </span>
                  </div>

                  <span
                    className={`flex-1 text-sm truncate ${
                      todo.completed
                        ? 'line-through text-ink-lighter'
                        : 'text-ink'
                    }`}
                    dir="auto"
                  >
                    {todo.text}
                  </span>

                  <button
                    onClick={() => removeTodo(todo.id)}
                    className="shrink-0 p-1.5 rounded-md opacity-0 group-hover:opacity-100 text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

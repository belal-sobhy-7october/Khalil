import { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Circle,
  CheckCircle,
  Flag,
  ListChecks,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import type { Priority, DailyTodo as DailyTodoType } from '../../types';

const priorityColors: Record<Priority, { bg: string; text: string; dot: string }> = {
  high: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  medium: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  low: { bg: 'bg-sage-50 dark:bg-sage-900/20', text: 'text-sage-600 dark:text-sage-400', dot: 'bg-sage-500' },
};

export default function DailyTodo() {
  const { t, isRTL } = useTranslation();
  const todos = useAppStore((s) => s.dailyTodos);
  const addTodo = useAppStore((s) => s.addDailyTodo);
  const toggleTodo = useAppStore((s) => s.toggleDailyTodo);
  const removeTodo = useAppStore((s) => s.removeDailyTodo);
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
    <section id="section-todo">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-cream-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-cream-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckSquare size={20} className="text-terracotta-500 dark:text-terracotta-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-amber-50">
                {t('todo.title')}
              </h2>
            </div>
            {todos.length > 0 && (
              <span className="text-xs text-slate-600 dark:text-stone-300 bg-cream-50 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                {completed} {t('todo.of')} {todos.length} {t('todo.completed')}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('todo.addPlaceholder')}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="flex-1 border border-cream-200 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm bg-cream-50 dark:bg-slate-700 text-slate-900 dark:text-amber-50 placeholder-slate-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400/40 focus:border-transparent transition-all"
            />
            <div className="flex gap-1">
              {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`p-2 rounded-lg border transition-all ${
                    priority === p
                      ? `${priorityColors[p].bg} ${priorityColors[p].text} border-current`
                      : 'border-cream-200 dark:border-slate-600 text-slate-500 dark:text-stone-400 hover:bg-cream-50 dark:hover:bg-slate-700'
                  }`}
                  title={t(`todo.${p}`)}
                >
                  <Flag size={16} />
                </button>
              ))}
            </div>
            <button
              onClick={handleAdd}
              disabled={!text.trim()}
              className="p-2.5 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-lg transition-colors"
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
                <ListChecks size={40} className="mx-auto text-slate-400 dark:text-stone-500 mb-2" />
                <p className="text-sm text-slate-500 dark:text-stone-400">{t('todo.empty')}</p>
              </motion.div>
            ) : (
              todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={() => toggleTodo(todo.id)}
                  onRemove={() => removeTodo(todo.id)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function TodoItem({
  todo,
  onToggle,
  onRemove,
}: {
  todo: DailyTodoType;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const colors = priorityColors[todo.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className={`group flex items-center gap-3 p-3 rounded-lg hover:bg-cream-50 dark:hover:bg-slate-700/50 transition-colors ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className="shrink-0 text-slate-500 dark:text-stone-400 hover:text-terracotta-500 dark:hover:text-terracotta-400 transition-colors"
      >
        {todo.completed ? (
          <CheckCircle size={20} className="text-sage-500" />
        ) : (
          <Circle size={20} />
        )}
      </button>

      <div className={`flex items-center gap-2 min-w-0 ${colors.bg} px-2 py-0.5 rounded`}>
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        <span className={`text-[10px] uppercase tracking-wider font-medium ${colors.text}`}>
          {todo.priority}
        </span>
      </div>

      <span
        className={`flex-1 text-sm truncate ${
          todo.completed
            ? 'line-through text-slate-500 dark:text-stone-400'
            : 'text-slate-800 dark:text-stone-100'
        }`}
        dir="auto"
      >
        {todo.text}
      </span>

      <button
        onClick={onRemove}
        className="shrink-0 p-1.5 rounded-md opacity-0 group-hover:opacity-100 text-slate-500 dark:text-stone-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}

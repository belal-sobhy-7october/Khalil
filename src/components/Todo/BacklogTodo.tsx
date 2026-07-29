import { memo, useCallback, useMemo, useState } from 'react';
import {
  Archive,
  Plus,
  Trash2,
  Calendar,
  Sun,
  Circle,
  CheckCircle,
  Flag,
  Inbox,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableTodoItem } from './SortableTodoItem';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import type { Priority, BacklogTodo as BacklogTodoType } from '../../types';

const priorityColors: Record<Priority, { bg: string; text: string; dot: string }> = {
  high: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500 dark:bg-red-400' },
  medium: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500 dark:bg-amber-400' },
  low: { bg: 'bg-sage-50 dark:bg-sage-950/30', text: 'text-sage-600 dark:text-sage-400', dot: 'bg-sage-500 dark:bg-sage-400' },
};

export default function BacklogTodo() {
  const { t, isRTL } = useTranslation();
  const todos = useAppStore((s) => s.backlogTodos);
  const addTodo = useAppStore((s) => s.addBacklogTodo);
  const toggleTodo = useAppStore((s) => s.toggleBacklogTodo);
  const removeTodo = useAppStore((s) => s.removeBacklogTodo);
  const reorderBacklogTodos = useAppStore((s) => s.reorderBacklogTodos);
  const moveToDaily = useAppStore((s) => s.moveToDaily);
  const moveToWeekly = useAppStore((s) => s.moveToWeekly);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleAdd = useCallback(() => {
    if (text.trim()) {
      addTodo(text.trim(), priority);
      setText('');
    }
  }, [text, priority, addTodo]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  }, [handleAdd]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);
      const newOrder = arrayMove(todos, oldIndex, newIndex);
      reorderBacklogTodos(newOrder.map((t) => t.id));
    }
  }, [todos, reorderBacklogTodos]);

  const itemIds = useMemo(() => todos.map((t) => t.id), [todos]);

  return (
    <section>
      <div className="bg-card border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-3 md:p-4 border-b border-border-subtle">
          <div className="flex items-center gap-2 mb-2">
            <Archive size={16} className="text-ink-light" />
            <h2 className="text-sm font-semibold text-ink">
              {t('backlog.title')}
            </h2>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('backlog.addPlaceholder')}
              dir={isRTL ? 'rtl' : 'ltr'}
              className="flex-1 border border-border-subtle rounded-lg px-4 py-2.5 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-2 focus:ring-ink-lighter/20 focus:border-transparent transition-all"
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
              className="p-2.5 bg-ink-light hover:bg-ink disabled:opacity-40 text-white rounded-lg transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="p-2">
            <AnimatePresence mode="popLayout">
              {todos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 text-center"
                >
                  <Inbox size={36} className="mx-auto text-ink-lighter mb-2" />
                  <p className="text-sm text-ink-light">{t('backlog.empty')}</p>
                </motion.div>
              ) : (
                <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                  {todos.map((todo) => (
                    <SortableTodoItem key={todo.id} id={todo.id}>
                      <BacklogTodoItem
                        todo={todo}
                        onToggle={toggleTodo}
                        onRemove={removeTodo}
                        onMoveToDaily={moveToDaily}
                        onMoveToWeekly={moveToWeekly}
                      />
                    </SortableTodoItem>
                  ))}
                </SortableContext>
              )}
            </AnimatePresence>
          </div>
        </DndContext>
      </div>
    </section>
  );
}

const BacklogTodoItem = memo(function BacklogTodoItem({
  todo,
  onToggle,
  onRemove,
  onMoveToDaily,
  onMoveToWeekly,
}: {
  todo: BacklogTodoType;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onMoveToDaily: (id: string) => void;
  onMoveToWeekly: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
      className={`group flex items-center gap-3 p-3 rounded-lg hover:bg-ink/3 transition-colors ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className="shrink-0 text-ink-lighter hover:text-ink transition-colors"
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
        className={`flex-1 min-w-0 text-sm break-words whitespace-normal ${
          todo.completed
            ? 'line-through text-ink-lighter'
            : 'text-ink'
        }`}
        dir="auto"
      >
        {todo.text}
      </span>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={() => onMoveToDaily(todo.id)}
          className="p-1.5 rounded-md text-clay-soft hover:text-clay-soft-dark hover:bg-ink/5 transition-all"
          title={t('backlog.moveToDaily')}
        >
          <Sun size={14} />
        </button>
        <button
          onClick={() => onMoveToWeekly(todo.id)}
          className="p-1.5 rounded-md text-gold-soft hover:text-gold-soft-dark hover:bg-ink/5 transition-all"
          title={t('backlog.moveToWeekly')}
        >
          <Calendar size={14} />
        </button>
        <button
          onClick={() => onRemove(todo.id)}
          className="p-1.5 rounded-md text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
});

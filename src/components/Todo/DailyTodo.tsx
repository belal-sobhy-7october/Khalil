import { memo, useCallback, useMemo, useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Archive,
  Circle,
  CheckCircle,
  Flag,
  ListChecks,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { SortableTodoItem } from './SortableTodoItem';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../i18n/useTranslation';
import { priorityColors } from '../../constants/priorityColors';
import type { Priority, DailyTodo as DailyTodoType } from '../../types';

export default function DailyTodo() {
  const { t, isRTL } = useTranslation();
  const todos = useAppStore((s) => s.dailyTodos);
  const addTodo = useAppStore((s) => s.addDailyTodo);
  const toggleTodo = useAppStore((s) => s.toggleDailyTodo);
  const removeTodo = useAppStore((s) => s.removeDailyTodo);
  const moveToWeekly = useAppStore((s) => s.moveToWeekly);
  const moveToBacklog = useAppStore((s) => s.moveToBacklog);
  const reorderDailyTodos = useAppStore((s) => s.reorderDailyTodos);
  const pendingMovements = useAppStore((s) => s.pendingMovements);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const clearError = useAppStore((s) => s.clearError);

  const completed = todos.filter((t) => t.completed).length;

  const handleAdd = useCallback(async () => {
    if (text.trim()) {
      clearError();
      const result = await addTodo(text.trim(), priority);
      if (result.success) {
        setText('');
      }
    }
  }, [text, priority, addTodo, clearError]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  }, [handleAdd]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);
      const newOrder = arrayMove(todos, oldIndex, newIndex);
      reorderDailyTodos(newOrder.map((t) => t.id));
    }
  }, [todos, reorderDailyTodos]);

  const itemIds = useMemo(() => todos.map((t) => t.id), [todos]);

  return (
    <section id="section-todo">
      <div className="bg-card border border-border-subtle rounded-xl overflow-hidden">
        <div className="p-5 md:p-6 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare size={20} className="text-clay-soft" />
              <h2 className="text-base font-semibold text-ink">
                {t('todo.title')}
              </h2>
            </div>
            {todos.length > 0 && (
              <span className="text-xs text-ink-light bg-ink/5 px-2.5 py-1 rounded-full">
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
              className="flex-1 border border-border-subtle rounded-lg px-4 py-2.5 text-sm bg-ink/3 text-ink placeholder-ink-lighter focus:outline-none focus:ring-2 focus:ring-clay-soft/20 focus:border-transparent transition-all"
            />
            <div className="flex gap-1 flex-shrink-0">
              {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`p-1.5 sm:p-2 rounded-lg border transition-all ${
                    priority === p
                      ? `${priorityColors[p].bg} ${priorityColors[p].text} border-current`
                      : 'border-border-subtle text-ink-lighter hover:bg-ink/5'
                  }`}
                  title={t(`todo.${p}`)}
                >
                  <Flag size={14} className="sm:size-[15px]" />
                </button>
              ))}
            </div>
            <button
              onClick={handleAdd}
              disabled={!text.trim()}
              className="p-2 sm:p-2.5 bg-clay-soft hover:bg-clay-soft-dark disabled:opacity-40 text-white rounded-lg transition-colors flex-shrink-0"
            >
              <Plus size={16} className="sm:size-[18px]" />
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
                  className="p-8 text-center"
                >
                  <ListChecks size={36} className="mx-auto text-ink-lighter mb-2" />
                  <p className="text-sm text-ink-light">{t('todo.empty')}</p>
                </motion.div>
              ) : (
                <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                  {todos.map((todo) => (
                    <SortableTodoItem key={todo.id} id={todo.id}>
                      <TodoItem
                        todo={todo}
                        onToggle={toggleTodo}
                        onRemove={removeTodo}
                        onMoveToWeekly={moveToWeekly}
                        onMoveToBacklog={moveToBacklog}
                        isMoving={pendingMovements.has(todo.id)}
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

const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onRemove,
  onMoveToWeekly,
  onMoveToBacklog,
  isMoving,
}: {
  todo: DailyTodoType;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onMoveToWeekly: (id: string) => void;
  onMoveToBacklog: (id: string, source: 'daily') => void;
  isMoving: boolean;
}) {
  const { t } = useTranslation();
  const colors = priorityColors[todo.priority];

  const handleDelete = useCallback(() => {
    onRemove(todo.id);
  }, [todo.id, onRemove]);

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
        className="shrink-0 text-ink-lighter hover:text-clay-soft transition-colors"
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {todo.completed ? (
          <CheckCircle size={20} className="text-sage-soft" />
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
        className={`flex-1 min-w-0 text-sm leading-relaxed ${
          todo.completed
            ? 'line-through text-ink-lighter'
            : 'text-ink'
        }`}
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        dir="auto"
      >
        {todo.text}
      </span>


      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
        <button
          onClick={() => onMoveToWeekly(todo.id)}
          disabled={isMoving}
          className="p-1.5 rounded-md text-gold-soft hover:text-gold-soft-dark hover:bg-ink/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('backlog.moveToWeekly')}
          aria-label="Move to weekly"
        >
          <Calendar size={14} />
        </button>
        <button
          onClick={() => onMoveToBacklog(todo.id, 'daily')}
          disabled={isMoving}
          className="p-1.5 rounded-md text-ink-lighter hover:text-ink hover:bg-ink/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('backlog.moveToBacklog')}
          aria-label="Move to backlog"
        >
          <Archive size={14} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-md text-ink-lighter hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          title={t('common.delete')}
          aria-label="Delete task"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
});

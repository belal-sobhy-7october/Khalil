import { useMemo, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { StickyNoteData } from '../Canvas/StickyNote';
import type { TodoNoteData } from '../Canvas/TodoNote';
import StickyNote from '../Canvas/StickyNote';
import TodoNote from '../Canvas/TodoNote';
import { SortableNoteItem } from './SortableNoteItem';

type NoteItem =
  | { type: 'sticky'; data: StickyNoteData }
  | { type: 'todo'; data: TodoNoteData };

interface Props {
  stickyNotes: StickyNoteData[];
  todoNotes: TodoNoteData[];
  onDeleteSticky: (id: string) => void;
  onUpdateSticky: (id: string, data: Partial<StickyNoteData>) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, updated: Partial<TodoNoteData>) => void;
  onReorderSticky: (ids: string[]) => void;
  onReorderTodo: (ids: string[]) => void;
}

export default function NotesPanel({
  stickyNotes,
  todoNotes,
  onDeleteSticky,
  onUpdateSticky,
  onDeleteTodo,
  onUpdateTodo,
  onReorderSticky,
  onReorderTodo,
}: Props) {
  const items: NoteItem[] = useMemo(() => {
    const combined: NoteItem[] = [
      ...stickyNotes.map((n) => ({ type: 'sticky' as const, data: n })),
      ...todoNotes.map((n) => ({ type: 'todo' as const, data: n })),
    ];
    return combined;
  }, [stickyNotes, todoNotes]);

  const itemIds = useMemo(() => items.map((item) => item.data.id), [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex((i) => i.data.id === active.id);
      const newIndex = items.findIndex((i) => i.data.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...items];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      const stickyIds = reordered
        .filter((i): i is NoteItem & { type: 'sticky' } => i.type === 'sticky')
        .map((i) => i.data.id);
      const todoIds = reordered
        .filter((i): i is NoteItem & { type: 'todo' } => i.type === 'todo')
        .map((i) => i.data.id);

      onReorderSticky(stickyIds);
      onReorderTodo(todoIds);
    },
    [items, onReorderSticky, onReorderTodo]
  );

  return (
    <div className="fixed top-20 start-4 z-40 flex flex-col gap-3 w-56">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableNoteItem key={item.data.id} id={item.data.id}>
              {item.type === 'sticky' ? (
                <StickyNote
                  note={item.data}
                  onDelete={onDeleteSticky}
                  onUpdate={onUpdateSticky}
                />
              ) : (
                <TodoNote
                  note={item.data}
                  onDelete={onDeleteTodo}
                  onUpdate={onUpdateTodo}
                />
              )}
            </SortableNoteItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

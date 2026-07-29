import { memo, useCallback, useMemo, useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import type { StickyNoteData, TodoNoteData } from '../../types';
import StickyNote from '../Canvas/StickyNote';
import TodoNote from '../Canvas/TodoNote';

interface Props {
  stickyNotes: StickyNoteData[];
  todoNotes: TodoNoteData[];
  onDeleteSticky: (id: string) => void;
  onUpdateSticky: (id: string, data: Partial<StickyNoteData>) => void;
  onReorderSticky: (ids: string[]) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, updated: Partial<TodoNoteData>) => void;
  onReorderTodo: (ids: string[]) => void;
}

type NoteItem = { id: string; type: 'sticky' | 'todo' };

const SortableNoteItem = memo(function SortableNoteItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
    willChange: isDragging ? 'transform' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-1 group/drag">
      <div
        {...attributes}
        {...listeners}
        className="shrink-0 mt-3 opacity-20 group-hover/drag:opacity-60 hover:!opacity-100 cursor-grab active:cursor-grabbing p-1 text-ink-lighter transition-opacity touch-none"
      >
        <GripVertical size={14} />
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
});

export default function NotesPanel({
  stickyNotes,
  todoNotes,
  onDeleteSticky,
  onUpdateSticky,
  onReorderSticky,
  onDeleteTodo,
  onUpdateTodo,
  onReorderTodo,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const items = useMemo<NoteItem[]>(() => [
    ...stickyNotes.map((n) => ({ id: `sticky-${n.id}`, type: 'sticky' as const })),
    ...todoNotes.map((n) => ({ id: `todo-${n.id}`, type: 'todo' as const })),
  ], [stickyNotes, todoNotes]);

  const itemIds = useMemo(() => items.map((i) => i.id), [items]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const prefix = (id: string) => id.startsWith('sticky-') ? 'sticky' : 'todo';
    const activeType = prefix(active.id as string);
    const overType = prefix(over.id as string);

    if (activeType !== overType) return;

    const extractId = (prefixed: string) => prefixed.replace(/^(sticky|todo)-/, '');

    if (activeType === 'sticky') {
      const ids = stickyNotes.map((n) => n.id);
      const oldIdx = ids.indexOf(extractId(active.id as string));
      const newIdx = ids.indexOf(extractId(over.id as string));
      if (oldIdx === -1 || newIdx === -1) return;
      const reordered = [...ids];
      reordered.splice(oldIdx, 1);
      reordered.splice(newIdx, 0, ids[oldIdx]);
      onReorderSticky(reordered);
    } else {
      const ids = todoNotes.map((n) => n.id);
      const oldIdx = ids.indexOf(extractId(active.id as string));
      const newIdx = ids.indexOf(extractId(over.id as string));
      if (oldIdx === -1 || newIdx === -1) return;
      const reordered = [...ids];
      reordered.splice(oldIdx, 1);
      reordered.splice(newIdx, 0, ids[oldIdx]);
      onReorderTodo(reordered);
    }
  }, [stickyNotes, todoNotes, onReorderSticky, onReorderTodo]);

  return (
    <>
      {/* Desktop: fixed right column */}
      <div className="hidden lg:block fixed end-0 top-14 bottom-0 w-72 z-20 bg-surface border-s border-border-subtle overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold text-ink-light uppercase tracking-wider">ملاحظات</h2>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {stickyNotes.map((note) => (
                <SortableNoteItem key={`sticky-${note.id}`} id={`sticky-${note.id}`}>
                  <StickyNote
                    note={note}
                    onDelete={onDeleteSticky}
                    onUpdate={onUpdateSticky}
                  />
                </SortableNoteItem>
              ))}
              {todoNotes.map((note) => (
                <SortableNoteItem key={`todo-${note.id}`} id={`todo-${note.id}`}>
                  <TodoNote
                    note={note}
                    onDelete={onDeleteTodo}
                    onUpdate={onUpdateTodo}
                  />
                </SortableNoteItem>
              ))}
              {stickyNotes.length === 0 && todoNotes.length === 0 && (
                <p className="text-xs text-ink-light text-center py-8">لا توجد ملاحظات</p>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Mobile: collapsible accordion at bottom */}
      <div className="lg:hidden mt-8 border-t border-border-subtle pt-4">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-medium text-ink mb-2 w-full text-start"
        >
          {mobileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          ملاحظات ({stickyNotes.length + todoNotes.length})
        </button>
        {mobileOpen && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {stickyNotes.map((note) => (
                  <SortableNoteItem key={`sticky-${note.id}`} id={`sticky-${note.id}`}>
                    <StickyNote
                      note={note}
                      onDelete={onDeleteSticky}
                      onUpdate={onUpdateSticky}
                    />
                  </SortableNoteItem>
                ))}
                {todoNotes.map((note) => (
                  <SortableNoteItem key={`todo-${note.id}`} id={`todo-${note.id}`}>
                    <TodoNote
                      note={note}
                      onDelete={onDeleteTodo}
                      onUpdate={onUpdateTodo}
                    />
                  </SortableNoteItem>
                ))}
                {stickyNotes.length === 0 && todoNotes.length === 0 && (
                  <p className="text-xs text-ink-light text-center py-4">لا توجد ملاحظات</p>
                )}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </>
  );
}

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortableTodoItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-1 group/drag">
      <div
        {...attributes}
        {...listeners}
        className="shrink-0 opacity-20 group-hover/drag:opacity-60 hover:!opacity-100 cursor-grab active:cursor-grabbing p-1 text-ink-lighter transition-opacity touch-none"
      >
        <GripVertical size={14} />
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}

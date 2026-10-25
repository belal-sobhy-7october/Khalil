import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

export const SortableTodoItem = memo(function SortableTodoItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
    willChange: isDragging ? 'transform' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-1 group/drag">
      <div
        {...attributes}
        {...listeners}
        aria-label={t('a11y.reorder')}
        className="shrink-0 opacity-20 group-hover/drag:opacity-60 hover:!opacity-100 cursor-grab active:cursor-grabbing p-[5px] text-ink-lighter transition-opacity touch-none"
      >
        <GripVertical size={14} />
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
});

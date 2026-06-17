import { useCallback, memo, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import type { StickyNoteData } from '../Canvas/StickyNote';
import type { TodoNoteData } from '../Canvas/TodoNote';
import StickyNote from '../Canvas/StickyNote';
import TodoNote from '../Canvas/TodoNote';

interface Props {
  stickyNotes: StickyNoteData[];
  todoNotes: TodoNoteData[];
  onDeleteSticky: (id: string) => void;
  onUpdateSticky: (id: string, data: Partial<StickyNoteData>) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, updated: Partial<TodoNoteData>) => void;
}

function FloatingNoteCard({
  id,
  position,
  children,
  onUpdatePosition,
}: {
  id: string;
  position: { x: number; y: number };
  children: React.ReactNode;
  onUpdatePosition: (id: string, pos: { x: number; y: number }) => void;
}) {
  // Motion values track the drag offset only (start at 0).
  // Position is handled by CSS top/left.
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Keep a ref to the latest CSS position so onDragEnd computes correctly.
  const posRef = useRef(position);
  posRef.current = position;

  // After a position update (drag end or external change), reset the drag
  // transform to 0 so it doesn't accumulate on top of the new CSS position.
  useEffect(() => {
    dragX.set(0);
    dragY.set(0);
  }, [position.x, position.y, dragX, dragY]);

  const handleDragStart = useCallback(() => {
    document.body.style.cursor = 'grabbing';
  }, []);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => {
      document.body.style.cursor = 'grab';
      // Reset the drag transform synchronously so it doesn't pile on top
      // of the new CSS position after the store update.
      dragX.set(0);
      dragY.set(0);
      const newX = posRef.current.x + info.offset.x;
      const newY = posRef.current.y + info.offset.y;
      onUpdatePosition(id, { x: newX, y: newY });
    },
    [id, onUpdatePosition, dragX, dragY]
  );

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        x: dragX,
        y: dragY,
        zIndex: 9999,
        cursor: 'grab',
      }}
      initial={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="pointer-events-auto"
    >
      {children}
    </motion.div>
  );
}

const FloatingNoteCardMemo = memo(FloatingNoteCard);

export default function NotesPanel({
  stickyNotes,
  todoNotes,
  onDeleteSticky,
  onUpdateSticky,
  onDeleteTodo,
  onUpdateTodo,
}: Props) {
  const handleStickyPosition = useCallback(
    (id: string, pos: { x: number; y: number }) => {
      onUpdateSticky(id, { position: pos });
    },
    [onUpdateSticky]
  );

  const handleTodoPosition = useCallback(
    (id: string, pos: { x: number; y: number }) => {
      onUpdateTodo(id, { position: pos });
    },
    [onUpdateTodo]
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {stickyNotes.map((note) => (
        <FloatingNoteCardMemo
          key={note.id}
          id={note.id}
          position={note.position}
          onUpdatePosition={handleStickyPosition}
        >
          <StickyNote
            note={note}
            onDelete={onDeleteSticky}
            onUpdate={onUpdateSticky}
          />
        </FloatingNoteCardMemo>
      ))}
      {todoNotes.map((note) => (
        <FloatingNoteCardMemo
          key={note.id}
          id={note.id}
          position={note.position}
          onUpdatePosition={handleTodoPosition}
        >
          <TodoNote
            note={note}
            onDelete={onDeleteTodo}
            onUpdate={onUpdateTodo}
          />
        </FloatingNoteCardMemo>
      ))}
    </div>
  );
}

import { useCallback, memo } from 'react';
import { motion } from 'framer-motion';
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
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }) => {
      onUpdatePosition(id, { x: info.point.x, y: info.point.y });
    },
    [id, onUpdatePosition]
  );

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={false}
      style={{ x: position.x, y: position.y, position: 'absolute', left: 0, top: 0 }}
      onDragEnd={handleDragEnd}
      className="pointer-events-auto z-40"
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

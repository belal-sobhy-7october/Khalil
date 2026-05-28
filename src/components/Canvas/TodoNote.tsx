import { useState, useRef, useEffect, useCallback } from 'react';
import DraggableContainer from './DraggableContainer';
import { GripVertical, Trash2, Plus, Check } from 'lucide-react';

interface TodoItemData {
  id: string;
  text: string;
  done: boolean;
}

interface TodoNoteData {
  id: string;
  title: string;
  items: TodoItemData[];
  position: { x: number; y: number };
}

interface Props {
  note: TodoNoteData;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updated: Partial<TodoNoteData>) => void;
}

const STORAGE_KEY = 'khalil-todonotes';

export function createTodoNote(): TodoNoteData {
  return {
    id: crypto.randomUUID(),
    title: '',
    items: [],
    position: { x: typeof window !== 'undefined' ? window.innerWidth - 280 : 0, y: 180 },
  };
}

export function loadTodoNotes(): TodoNoteData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function saveTodoNotes(notes: TodoNoteData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export type { TodoNoteData };

export default function TodoNote({ note, onDelete, onUpdate }: Props) {
  const [title, setTitle] = useState(note.title);
  const [items, setItems] = useState(note.items);
  const [newItemText, setNewItemText] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const persist = useCallback((newTitle: string, newItems: TodoItemData[]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(note.id, { title: newTitle, items: newItems });
    }, 300);
  }, [note.id, onUpdate]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    persist(value, items);
  };

  const toggleItem = (itemId: string) => {
    const next = items.map((it) => it.id === itemId ? { ...it, done: !it.done } : it);
    setItems(next);
    persist(title, next);
  };

  const deleteItem = (itemId: string) => {
    const next = items.filter((it) => it.id !== itemId);
    setItems(next);
    persist(title, next);
  };

  const addItem = () => {
    const text = newItemText.trim();
    if (!text) return;
    const next = [...items, { id: crypto.randomUUID(), text, done: false }];
    setItems(next);
    setNewItemText('');
    persist(title, next);
  };

  const handleItemKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addItem();
  };

  return (
    <DraggableContainer
      id={`todonote-${note.id}`}
      defaultPosition={note.position}
      fixed={true}
    >
      <div className="w-56 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl overflow-hidden z-50">
        <div className="drag-handle flex items-center justify-between px-3 py-2 bg-amber-100/50 dark:bg-amber-900/30 border-b border-amber-200/50 dark:border-amber-800/30 cursor-grab active:cursor-grabbing">
          <GripVertical size={14} className="text-amber-400 dark:text-amber-500 shrink-0" />
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="قائمة..."
            className="flex-1 min-w-0 mx-2 text-sm font-medium text-ink bg-transparent placeholder-ink-lighter focus:outline-none"
            dir="auto"
          />
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 rounded text-amber-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          >
            <Trash2 size={12} />
          </button>
        </div>

        <div className="max-h-[200px] overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-3 py-1.5 group/item hover:bg-amber-100/30 dark:hover:bg-amber-900/20 transition-colors"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  item.done
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'border-amber-300 dark:border-amber-600 hover:border-amber-400'
                }`}
              >
                {item.done && <Check size={10} strokeWidth={3} />}
              </button>
              <span
                className={`flex-1 text-sm truncate ${
                  item.done ? 'line-through text-ink-lighter' : 'text-ink'
                }`}
                dir="auto"
              >
                {item.text}
              </span>
              <button
                onClick={() => deleteItem(item.id)}
                className="shrink-0 text-amber-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-amber-200/50 dark:border-amber-800/30 px-3 py-2">
          <input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleItemKeyDown}
            placeholder="إضافة..."
            className="flex-1 text-sm bg-transparent text-ink placeholder-ink-lighter focus:outline-none"
            dir="auto"
          />
          <button
            onClick={addItem}
            disabled={!newItemText.trim()}
            className="shrink-0 p-1 rounded text-amber-400 hover:text-amber-600 disabled:opacity-30 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </DraggableContainer>
  );
}

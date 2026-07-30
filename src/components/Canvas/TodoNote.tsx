import { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2, Plus, Check } from 'lucide-react';
import type { TodoNoteData } from '../../types';

interface Props {
  note: TodoNoteData;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updated: Partial<TodoNoteData>) => void;
}

export function createTodoNote(): TodoNoteData {
  return {
    id: crypto.randomUUID(),
    title: '',
    items: [],
    sortOrder: 0,
  };
}

export default function TodoNote({ note, onDelete, onUpdate }: Props) {
  const [title, setTitle] = useState(note.title);
  const [items, setItems] = useState(note.items);
  const [newItemText, setNewItemText] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const newItemInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef2 = useRef(note.title);
  const itemsRef = useRef(note.items);
  const lastSentRef = useRef({ title: note.title, items: note.items });

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  useEffect(() => {
    const hasLocalChanges =
      titleRef2.current !== lastSentRef.current.title ||
      itemsRef.current !== lastSentRef.current.items;
    if (!hasLocalChanges) {
      if (titleRef2.current !== note.title || itemsRef.current !== note.items) {
        setTitle(note.title);
        setItems(note.items);
        titleRef2.current = note.title;
        itemsRef.current = note.items;
      }
    }
    lastSentRef.current = { title: note.title, items: note.items };
  }, [note.title, note.items, note.id]);

  const persist = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(note.id, { title: titleRef2.current, items: itemsRef.current });
      lastSentRef.current = { title: titleRef2.current, items: itemsRef.current };
    }, 300);
  }, [note.id, onUpdate]);

  const handleTitleChange = (value: string) => {
    titleRef2.current = value;
    setTitle(value);
    persist();
  };

  const toggleItem = (itemId: string) => {
    const next = itemsRef.current.map((it) => it.id === itemId ? { ...it, done: !it.done } : it);
    itemsRef.current = next;
    setItems(next);
    persist();
  };

  const deleteItem = (itemId: string) => {
    const next = itemsRef.current.filter((it) => it.id !== itemId);
    itemsRef.current = next;
    setItems(next);
    persist();
  };

  const addItem = () => {
    const text = newItemText.trim();
    if (!text) return;
    const next = [...itemsRef.current, { id: crypto.randomUUID(), text, done: false }];
    itemsRef.current = next;
    setItems(next);
    setNewItemText('');
    persist();
  };

  const handleItemKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addItem();
  };

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-amber-100/50 dark:bg-amber-900/30 border-b border-amber-200/50 dark:border-amber-800/30">
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              newItemInputRef.current?.focus();
            }
          }}
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

      <div className="max-h-[200px] overflow-y-auto" style={{ scrollbarColor: "#6B3A2A transparent" }}>
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
          ref={newItemInputRef}
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
  );
}

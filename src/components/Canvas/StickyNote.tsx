import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import type { StickyNoteData } from '../../types';

interface Props {
  note: StickyNoteData;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<StickyNoteData>) => void;
}

export function createStickyNote(title = '', text = ''): StickyNoteData {
  return {
    id: crypto.randomUUID(),
    title,
    text,
    sortOrder: 0,
  };
}

export default function StickyNote({ note, onDelete, onUpdate }: Props) {
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onUpdate(note.id, { title: value }), 400);
  };

  const handleTextChange = (value: string) => {
    setText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onUpdate(note.id, { text: value }), 400);
  };

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-amber-100/50 dark:bg-amber-900/30 border-b border-amber-200/50 dark:border-amber-800/30">
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="ملاحظة"
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
      <textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder="اكتب ملاحظة..."
        className="w-full min-h-[100px] p-3 text-sm text-ink bg-transparent placeholder-ink-lighter resize-none focus:outline-none leading-relaxed"
        style={{ scrollbarColor: '#6B3A2A transparent' }}
        dir="auto"
      />
    </div>
  );
}

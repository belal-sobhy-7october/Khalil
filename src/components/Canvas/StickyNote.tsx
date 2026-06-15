import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export interface StickyNoteData {
  id: string;
  text: string;
}

interface Props {
  note: StickyNoteData;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export function createStickyNote(text = ''): StickyNoteData {
  return {
    id: crypto.randomUUID(),
    text,
  };
}

export default function StickyNote({ note, onDelete, onUpdate }: Props) {
  const [text, setText] = useState(note.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const handleChange = (value: string) => {
    setText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onUpdate(note.id, value), 400);
  };

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl overflow-hidden group">
      <div className="flex items-center justify-between px-3 py-2 bg-amber-100/50 dark:bg-amber-900/30 border-b border-amber-200/50 dark:border-amber-800/30">
        <span className="text-xs text-amber-500 font-medium">ملاحظة</span>
        <button
          onClick={() => onDelete(note.id)}
          className="p-1 rounded text-amber-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={12} />
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="اكتب ملاحظة..."
        className="w-full min-h-[100px] p-3 text-sm text-ink bg-transparent placeholder-ink-lighter resize-none focus:outline-none leading-relaxed"
        style={{ scrollbarColor: '#6B3A2A transparent' }}
        dir="auto"
      />
    </div>
  );
}

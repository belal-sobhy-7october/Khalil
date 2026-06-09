import { useState, useRef, useEffect } from 'react';
import DraggableContainer from './DraggableContainer';
import { GripVertical, Trash2 } from 'lucide-react';

interface StickyNoteData {
  id: string;
  text: string;
  position: { x: number; y: number };
}

interface Props {
  note: StickyNoteData;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

const STORAGE_KEY = 'khalil-stickynotes';

export function loadStickyNotes(): StickyNoteData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function saveStickyNotes(notes: StickyNoteData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function createStickyNote(text = ''): StickyNoteData {
  return {
    id: crypto.randomUUID(),
    text,
    position: { x: typeof window !== 'undefined' ? window.innerWidth - 260 : 0, y: 120 },
  };
}

export type { StickyNoteData };

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
    <DraggableContainer
      id={`sticky-${note.id}`}
      defaultPosition={note.position}
      fixed={true}
    >
      <div className="w-56 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl overflow-hidden group z-50">
        <div className="drag-handle flex items-center justify-between px-3 py-2 bg-amber-100/50 dark:bg-amber-900/30 border-b border-amber-200/50 dark:border-amber-800/30 cursor-grab active:cursor-grabbing">
          <GripVertical size={14} className="text-amber-400 dark:text-amber-500" />
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
          className="w-full min-h-[140px] p-3 text-sm text-ink bg-transparent placeholder-ink-lighter resize-none focus:outline-none leading-relaxed"
          style={{ scrollbarColor: '#6B3A2A transparent' }}
          dir="auto"
        />
      </div>
    </DraggableContainer>
  );
}

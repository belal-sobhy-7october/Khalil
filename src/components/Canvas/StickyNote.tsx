import { useState, useRef, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import type { StickyNoteData } from '../../types';
import { useTranslation } from '../../i18n/useTranslation';

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
  const { t } = useTranslation();
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef(note.title);
  const textRef = useRef(note.text);
  const lastSentRef = useRef({ title: note.title, text: note.text });

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  useEffect(() => {
    const hasLocalChanges = titleRef.current !== lastSentRef.current.title || textRef.current !== lastSentRef.current.text;
    if (!hasLocalChanges) {
      if (titleRef.current !== note.title || textRef.current !== note.text) {
        setTitle(note.title);
        setText(note.text);
        titleRef.current = note.title;
        textRef.current = note.text;
      }
    }
    lastSentRef.current = { title: note.title, text: note.text };
  }, [note.title, note.text, note.id]);

  const persist = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(note.id, { title: titleRef.current, text: textRef.current });
      lastSentRef.current = { title: titleRef.current, text: textRef.current };
    }, 400);
  }, [note.id, onUpdate]);

  const handleTitleChange = (value: string) => {
    titleRef.current = value;
    setTitle(value);
    persist();
  };

  const handleTextChange = (value: string) => {
    textRef.current = value;
    setText(value);
    persist();
  };

  return (
    <div className="w-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-amber-100/50 dark:bg-amber-900/30 border-b border-amber-200/50 dark:border-amber-800/30">
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              textareaRef.current?.focus();
            }
          }}
          placeholder={t('notes.notePlaceholder')}
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
        ref={textareaRef}
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder={t('notes.notesPlaceholder')}
        className="w-full min-h-[100px] p-3 text-sm text-ink bg-transparent placeholder-ink-lighter resize-none focus:outline-none leading-relaxed"
        style={{ scrollbarColor: '#6B3A2A transparent' }}
        dir="auto"
      />
    </div>
  );
}

import type { StickyNoteData, TodoNoteData } from '../../types';

export function createStickyNote(title = '', text = ''): StickyNoteData {
  return {
    id: crypto.randomUUID(),
    title,
    text,
    sortOrder: 0,
  };
}

export function createTodoNote(): TodoNoteData {
  return {
    id: crypto.randomUUID(),
    title: '',
    items: [],
    sortOrder: 0,
  };
}

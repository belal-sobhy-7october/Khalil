import { useState } from 'react';
import { useAppStore } from '../../store/appStore';

/** Adds phrases to the Vocabulary flashcards, in a "Call Center: …" category. */
export function useAddToFlashcards() {
  const importVocabularyItems = useAppStore((s) => s.importVocabularyItems);
  const [status, setStatus] = useState<string | null>(null);
  const add = async (category: string, items: Array<{ text: string; use: string }>) => {
    setStatus('Adding…');
    const r = await importVocabularyItems(
      items.map((p) => ({ word: p.text, type: 'phrase' as const, definition: `Use it to ${p.use}.`, exampleSentence: p.text })),
      { duplicateMode: 'skip', categoryForAll: category }
    );
    setStatus(r.inserted ? `Added ${r.inserted} to your flashcards (Learn English → Vocabulary).` : 'Already in your flashcards.');
  };
  return { add, status };
}

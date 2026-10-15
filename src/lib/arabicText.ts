import type { VocabularyItem } from '../types';

export const ARABIC = /[\u0600-\u06FF]/;

export function hasArabicDefinition(item: VocabularyItem): boolean {
  return ARABIC.test(item.definition);
}

import type { Lang } from '../../data/sales/types';

/** A line of text in each language, picked by the content's language. */
export const pick = (lang: Lang, ar: string, en: string) => (lang === 'en' ? en : ar);

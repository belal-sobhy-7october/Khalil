/**
 * The addresses of Khalil's public pages. The login page links to them, so
 * this file stays tiny (it is part of the app bundle).
 */
import type { Lang } from './render';

export const ROUTES = {
  home: (lang: Lang) => `/${lang}`,
  topics: (lang: Lang) => `/${lang}/english-topics`,
  /** A lesson is written in English, so it has one page. */
  topic: (id: string) => `/en/english-topics/${id}`,
  callCenter: (lang: Lang) => `/${lang}/call-center`,
  interview: '/en/call-center/interview-questions',
  question: (id: string) => `/en/call-center/interview-questions/${id}`,
  vocabulary: '/en/call-center/vocabulary',
  vocabularyUnit: (slug: string) => `/en/call-center/vocabulary/${slug}`,
  /** The sales books are in Arabic, so they have one page each. */
  sales: '/ar/sales',
  chapter: (id: string) => `/ar/sales/${id.replace(/^k-/, '')}`,
} as const;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

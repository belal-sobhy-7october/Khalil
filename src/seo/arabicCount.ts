/**
 * A number and its noun in Arabic, written with digits: "3 مواضيع",
 * "90 موضوعًا", "100 موضوع". The noun follows the last two digits.
 */
export interface ArabicNoun {
  /** موضوع */
  one: string;
  /** موضوعان */
  two: string;
  /** مواضيع (3–10) */
  plural: string;
  /** موضوعًا (11–99) */
  accusative: string;
}

export function arCount(n: number, noun: ArabicNoun): string {
  if (n === 1) return noun.one;
  if (n === 2) return noun.two;
  const last = n % 100;
  if (last >= 3 && last <= 10) return `${n} ${noun.plural}`;
  if (last >= 11) return `${n} ${noun.accusative}`;
  return `${n} ${noun.one}`;
}

export const NOUNS = {
  topic: { one: 'موضوع', two: 'موضوعان', plural: 'مواضيع', accusative: 'موضوعًا' },
  lesson: { one: 'درس', two: 'درسان', plural: 'دروس', accusative: 'درسًا' },
  word: { one: 'كلمة', two: 'كلمتان', plural: 'كلمات', accusative: 'كلمةً' },
  question: { one: 'سؤال', two: 'سؤالان', plural: 'أسئلة', accusative: 'سؤالًا' },
  chapter: { one: 'فصل', two: 'فصلان', plural: 'فصول', accusative: 'فصلًا' },
  unit: { one: 'وحدة', two: 'وحدتان', plural: 'وحدات', accusative: 'وحدةً' },
  book: { one: 'كتاب', two: 'كتابان', plural: 'كتب', accusative: 'كتابًا' },
} satisfies Record<string, ArabicNoun>;

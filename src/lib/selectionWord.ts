/**
 * Text selected on a page, made ready to save as a word: the word or short
 * phrase itself, and the sentence it was in (its example).
 */
const ARABIC = /[؀-ۿ]/;
const MAX_WORDS = 6;
const MAX_LENGTH = 60;
const MAX_SENTENCE = 220;

/** The selected word or phrase, or null when the selection isn't one (Arabic, too long, no letters). */
export function selectedWord(raw: string): string | null {
  // Quotes, brackets and punctuation around it go: "recruiter," → recruiter.
  const text = raw.replace(/\s+/g, ' ').trim().replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '');
  if (!text || ARABIC.test(text)) return null;
  if (text.length > MAX_LENGTH || text.split(' ').length > MAX_WORDS) return null;
  // A capital only because it starts a sentence: "Recruiter" → recruiter (but not "IT" or "iPhone").
  return /^[A-Z][a-z]+(?: [a-z]+)*$/.test(text) ? text.toLowerCase() : text;
}

/** The sentence of `text` the word is in, or '' when there's none worth keeping as an example. */
export function sentenceAround(text: string, word: string): string {
  const w = word.toLowerCase();
  const sentence = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .find((s) => s.toLowerCase().includes(w))
    ?.trim();
  if (!sentence || sentence.toLowerCase() === w || sentence.length > MAX_SENTENCE || ARABIC.test(sentence)) return '';
  return sentence;
}

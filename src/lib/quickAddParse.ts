/**
 * Split one pasted line into word / definition / example. Accepts
 *   word
 *   word | definition | example
 *   word - definition            (spaced dash, so "well-known" stays one word)
 *   word<TAB>definition<TAB>example
 */
export function parseQuickLine(line: string): { word: string; definition: string; example: string } | null {
  const trimmed = line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim();
  if (!trimmed) return null;
  let parts: string[];
  if (trimmed.includes('|')) parts = trimmed.split('|');
  else if (trimmed.includes('\t')) parts = trimmed.split('\t');
  else if (/\s[-–—:]\s/.test(trimmed)) parts = trimmed.split(/\s[-–—:]\s/);
  else parts = [trimmed];
  const [word = '', definition = '', ...rest] = parts.map((p) => p.trim());
  if (!word) return null;
  return { word, definition, example: rest.join(' ').trim() };
}

import { describe, expect, it } from 'vitest';
import { TOPIC_PACKS } from '.';

describe('TOPIC_PACKS', () => {
  it('has unique pack ids and titles', () => {
    expect(new Set(TOPIC_PACKS.map((p) => p.id)).size).toBe(TOPIC_PACKS.length);
    expect(new Set(TOPIC_PACKS.map((p) => p.title.toLowerCase())).size).toBe(TOPIC_PACKS.length);
  });

  it('never repeats a word across packs', () => {
    const words = TOPIC_PACKS.flatMap((p) => p.items.map((i) => i.word.toLowerCase()));
    expect(words.filter((w, i) => words.indexOf(w) !== i)).toEqual([]);
  });

  it('includes the eight lessons from the course', () => {
    expect(TOPIC_PACKS.filter((p) => p.fromCourse)).toHaveLength(8);
  });

  it.each(TOPIC_PACKS.map((p) => [p.id, p] as const))('%s is a complete lesson', (_id, pack) => {
    // ~12 key words, including at least one phrasal verb and one idiom.
    expect(pack.items.length).toBeGreaterThanOrEqual(11);
    expect(pack.items.length).toBeLessThanOrEqual(16);
    expect(pack.items.some((i) => i.pos === 'phrasal verb')).toBe(true);
    expect(pack.items.some((i) => i.pos === 'idiom')).toBe(true);
    for (const item of pack.items) {
      expect(item.word).not.toBe('');
      expect(item.definition).toMatch(/[.)]$/);
      expect(item.example).not.toBe('');
      // Packs are English-only.
      expect(`${item.word} ${item.definition} ${item.example}`).not.toMatch(/[؀-ۿ]/);
    }
    expect(pack.warmUp.length).toBeGreaterThanOrEqual(2);
    expect(pack.grammar.points.length).toBeGreaterThanOrEqual(2);
    expect(pack.discussion.length).toBeGreaterThanOrEqual(6);
    expect(pack.task.points.length).toBeGreaterThanOrEqual(3);
    expect(pack.paragraph.split(/[.!?]\s/).length).toBeGreaterThanOrEqual(4);
  });
});

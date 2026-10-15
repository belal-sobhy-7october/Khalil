import { describe, expect, it } from 'vitest';
import { TOPIC_PACKS } from './topicPacks';

describe('TOPIC_PACKS', () => {
  it('has unique pack ids', () => {
    const ids = TOPIC_PACKS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(TOPIC_PACKS.map((p) => [p.id, p] as const))('%s parses every line into a complete item', (_id, pack) => {
    expect(pack.items.length).toBeGreaterThanOrEqual(20);
    for (const item of pack.items) {
      expect(item.word).not.toBe('');
      expect(item.definition).not.toBe('');
      expect(item.example).not.toBe('');
      // Packs are English-only.
      expect(`${item.word} ${item.definition} ${item.example}`).not.toMatch(/[؀-ۿ]/);
    }
    const words = pack.items.map((i) => i.word.toLowerCase());
    expect(new Set(words).size).toBe(words.length);
  });
});

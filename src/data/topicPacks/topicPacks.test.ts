/// <reference types="node" />
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { TOPIC_PACKS } from '.';
import { MEANINGS_AR, TOPIC_TITLES_AR } from './arabic';

const DIR = path.dirname(fileURLToPath(import.meta.url));

describe('TOPIC_PACKS', () => {
  it('has unique pack ids and titles', () => {
    expect(new Set(TOPIC_PACKS.map((p) => p.id)).size).toBe(TOPIC_PACKS.length);
    expect(new Set(TOPIC_PACKS.map((p) => p.title.toLowerCase())).size).toBe(TOPIC_PACKS.length);
  });

  it('never repeats a word across packs', () => {
    const words = TOPIC_PACKS.flatMap((p) => p.items.map((i) => i.word.toLowerCase()));
    expect(words.filter((w, i) => words.indexOf(w) !== i)).toEqual([]);
  });

  it('reads every word line (a mistyped line would be skipped silently)', () => {
    const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'));
    const lines = files.flatMap((f) => fs.readFileSync(path.join(DIR, f), 'utf8').split('\n')).filter((l) => /^\w+ \|/.test(l));
    const bad = lines.filter((l) => l.split('|').length !== 4 || !/^(n|v|adj|adv|pv|i|p) \|/.test(l));
    expect(bad).toEqual([]);
    expect(TOPIC_PACKS.reduce((n, p) => n + p.items.length, 0)).toBe(lines.length);
  });

  it('writes American English', () => {
    const british = /\b(\w+our(s|ed|ing|ite|ites|able|ful|y|hood|hoods)?|\w+(ise|ised|ising|isation)|\w+yse[ds]?|centre|theatre|metre|litre|kilometres?|licence|defence|offence|practis\w*|travell\w*|cancell\w*|jewellery|judgement|grey|yoghurt|mum|flat|holidays?|queues?|rubbish|whilst|learnt|at weekends|with a pinch of salt|on the blink|tether|public transport(?!ation))\b/gi;
    // Spelled the same way in American English.
    const sameInAmerican = /^(exercis|ris|rais|nois|surpris|prais|compromis|promis|otherwis|concis|advis|revis|supervis|wis|precis|premis|expertis|disguis|despis|improvis|enterpris|franchis|merchandis|cruis|bruis|pois|treatis|televis|paradis|sunris|edgewis)|^(your|yours|our|ours|hour|hours|four|tour|tours|pour|pours|poured|pouring|flour|sour|detour|detours|contour|devour|glamour|nour)$/i;
    const found = TOPIC_PACKS.flatMap((p) =>
      [p.title, p.description, ...p.warmUp, ...p.discussion, p.task.prompt, ...p.task.points, p.paragraph, p.grammar.title, p.grammar.tip ?? '',
        ...p.grammar.points.flatMap((g) => [g.form, g.use, g.example]), ...p.items.flatMap((i) => [i.word, i.definition, i.example])]
        .flatMap((text) => text.match(british) ?? [])
        .filter((w) => !sameInAmerican.test(w))
        .map((w) => `${p.id}: ${w}`)
    );
    expect(found).toEqual([]);
  });

  it('gives every topic its Arabic name and every word its Arabic meaning, and nothing more', () => {
    expect(Object.keys(TOPIC_TITLES_AR).sort()).toEqual(TOPIC_PACKS.map((p) => p.id).sort());
    expect(Object.keys(MEANINGS_AR).sort()).toEqual(TOPIC_PACKS.flatMap((p) => p.items.map((i) => i.word)).sort());
    for (const text of [...Object.values(TOPIC_TITLES_AR), ...Object.values(MEANINGS_AR)]) expect(text).toMatch(/[؀-ۿ]/);
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

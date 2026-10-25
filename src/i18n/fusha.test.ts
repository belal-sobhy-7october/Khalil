/// <reference types="node" />
/**
 * Khalil's Arabic is Modern Standard Arabic (الفصحى) only: no Egyptian or any
 * other dialect, in the interface, the lessons, the docs or the tests. This
 * fails on the common dialect words, so a dialect sentence can't slip back in.
 * (It can't catch everything, e.g. verbs like "بيعمل" or "هتتعلم": write Fusha.)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Where Khalil's own Arabic is written. */
const SCAN = ['src', 'scripts', 'api', 'CLAUDE.md', 'README.md', '.claude'];
const EXTENSIONS = /\.(ts|tsx|mjs|js|md)$/;

/**
 * Text that isn't Khalil's own words: YouTube titles as their channels wrote
 * them, and the keywords that recognize what a user types (who may write in
 * their own dialect). Nothing else belongs here.
 */
const NOT_OURS = new Set(['src/data/courseEpisodes.ts', 'src/data/callCenter/episodes.ts', 'src/data/callCenter/videos.ts', 'src/lib/topicUpgrade.ts', 'src/lib/senseRank.ts', 'src/i18n/fusha.test.ts']);

/** Common dialect words (Egyptian first, then others), as whole words. */
const DIALECT = [
  'عشان', 'علشان', 'إزاي', 'ازاي', 'دلوقتي', 'دلوقت', 'كده', 'كدا', 'مش', 'مفيش', 'مافيش', 'إيه', 'ايه',
  'بتاع', 'بتاعة', 'بتاعه', 'بتاعك', 'بتاعتك', 'بتاعي', 'بتاعها', 'بتاعنا', 'بتاعهم', 'بتوع',
  'عايز', 'عايزة', 'عايزه', 'عايزين', 'عاوز', 'عاوزة', 'عاوزه', 'عاوزين', 'ليه', 'فين', 'اللي', 'ده', 'دي', 'دى', 'دا',
  'بقى', 'بقا', 'كمان', 'لسه', 'لسة', 'زي', 'أوي', 'اوي', 'بس', 'إنت', 'إنتي', 'انتي', 'يلا', 'برضه', 'برضو', 'بردو',
  'كويس', 'كويسة', 'كويسه', 'كويسين', 'امتى', 'إمتى', 'مين', 'خلّي', 'خلي', 'شوف', 'شوفي', 'بص', 'بصّ', 'ازيك', 'إزيك',
  'ماشي', 'اهو', 'كتير', 'كتيرة', 'شوية', 'شويه', 'تاني', 'تانية', 'تانيه', 'بعدين', 'وبعدين', 'خلاص',
  'النهارده', 'النهاردة', 'إمبارح', 'امبارح', 'بكره', 'الصبح', 'هيك', 'هلق', 'شو', 'منيح', 'إيش', 'شلون',
];
const DIACRITICS = /[ً-ْٰـ]/g;
const dialect = new Set(DIALECT.map((w) => w.replace(DIACRITICS, '')));
// The same words after "و" or "ف" ("وكمان", "فاللي").
const PREFIX = /^(و|ف)(?=.{3,})/;

function files(dir: string): string[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  if (fs.statSync(full).isFile()) return [dir];
  return fs.readdirSync(full, { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === 'node_modules' ? [] : files(rel);
    return EXTENSIONS.test(e.name) ? [rel] : [];
  });
}

export function dialectWords(text: string): string[] {
  const found: string[] = [];
  for (const raw of text.match(/[؀-ۿ]+/g) ?? []) {
    const word = raw.replace(DIACRITICS, '');
    if (dialect.has(word) || (PREFIX.test(word) && dialect.has(word.replace(PREFIX, '')))) found.push(raw);
  }
  return found;
}

describe('Arabic is Fusha only', () => {
  it('finds dialect words (scan sanity check)', () => {
    expect(dialectWords('عشان كده مش هينفع، وكمان')).toEqual(['عشان', 'كده', 'مش', 'وكمان']);
    expect(dialectWords('لأن ذلك لا ينفع، وأنت كذلك. الزي الرسمي، ودول العالم، وكمين، وودّي')).toEqual([]);
  });

  it('no dialect words in the interface, the lessons, the docs or the tests', () => {
    const hits: string[] = [];
    for (const file of SCAN.flatMap(files)) {
      if (NOT_OURS.has(file)) continue;
      fs.readFileSync(path.join(ROOT, file), 'utf-8')
        .split('\n')
        .forEach((line, i) => {
          const words = dialectWords(line);
          if (words.length) hits.push(`${file}:${i + 1}: ${words.join('، ')}`);
        });
    }
    expect(hits).toEqual([]);
  });
});

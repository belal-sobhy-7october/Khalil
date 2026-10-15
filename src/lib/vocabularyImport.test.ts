import { describe, expect, it } from 'vitest';
import { parseVocabularyText, detectDuplicates, type ParsedRow } from './vocabularyImport';

describe('parseVocabularyText', () => {
  describe('JSON format', () => {
    it('parses basic JSON array', () => {
      const input = JSON.stringify([
        { word: 'hello', type: 'word', definition: 'A greeting', example: 'Hello world', pronunciation: 'həˈləʊ', category: 'Basics' },
      ]);
      const result = parseVocabularyText(input);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].word).toBe('hello');
      expect(result.rows[0].type).toBe('word');
      expect(result.rows[0].definition).toBe('A greeting');
      expect(result.rows[0].exampleSentence).toBe('Hello world');
      expect(result.rows[0].pronunciation).toBe('həˈləʊ');
      expect(result.rows[0].categoryName).toBe('Basics');
    });

it('handles aliases (meaning, translation, example, sentence, ex)', () => {
    const input = JSON.stringify([
      { word: 'test', meaning: 'A trial', translation: 'Arabic', example: 'Example sentence', sentence: 'Sentence', ex: 'Ex sentence', pron: 'test', cat: 'Cat1' },
    ]);
    const result = parseVocabularyText(input);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].definition).toBe('A trial');
    expect(result.rows[0].exampleSentence).toBe('Example sentence');
    expect(result.rows[0].pronunciation).toBe('test');
    expect(result.rows[0].categoryName).toBe('Cat1');
  });

    it('infers type from word when not specified', () => {
      const input = JSON.stringify([
        { word: 'come across', definition: 'Find by chance' },
        { word: 'hello world', definition: 'Greeting phrase' },
        { word: 'test', definition: 'A trial' },
      ]);
      const result = parseVocabularyText(input);
      expect(result.rows[0].type).toBe('verb');
      expect(result.rows[1].type).toBe('phrase');
      expect(result.rows[2].type).toBe('word');
    });
  });

  describe('CSV/TSV format', () => {
    it('parses CSV with header', () => {
      const input = `word,type,definition,example,pronunciation,category
hello,word,A greeting,Hello world,həˈləʊ,Basics`;
      const result = parseVocabularyText(input);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].word).toBe('hello');
      expect(result.rows[0].definition).toBe('A greeting');
    });

    it('parses TSV with tab delimiter', () => {
      const input = `word	type	definition	example	pronunciation	category
hello	word	A greeting	Hello world	həˈləʊ	Basics`;
      const result = parseVocabularyText(input);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].word).toBe('hello');
    });

    it('handles quoted fields with commas', () => {
      const input = `word,definition
"hello, world","A greeting, indeed"`;
      const result = parseVocabularyText(input);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].word).toBe('hello, world');
      expect(result.rows[0].definition).toBe('A greeting, indeed');
    });

    it('handles missing columns gracefully', () => {
      const input = `word,definition
hello,A greeting`;
      const result = parseVocabularyText(input);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].type).toBe('word');
    });
  });

  describe('Numbered list format', () => {
    it('parses numbered entries with Arabic definitions', () => {
      const input = `1. Reliable — يُعتمد عليه
She's very reliable...
هي يُعتمد عليها...
B1`;
      const result = parseVocabularyText(input);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].word).toBe('Reliable');
      expect(result.rows[0].definition).toBe('يُعتمد عليه');
      expect(result.rows[0].exampleSentence).toContain("She's very reliable");
      expect(result.rows[0].exampleSentence).toContain('هي يُعتمد عليها');
      expect(result.rows[0].level).toBe('B1');
    });

    it('handles different number formats', () => {
      const input = `1. Test — test
2) Another — another`;
      const result = parseVocabularyText(input);
      expect(result.rows).toHaveLength(2);
    });

    it('detects section headings for type inference', () => {
      const input = `Phrasal Verbs
1. Come across — find
2. Get along — have good relationship`;
      const result = parseVocabularyText(input);
      expect(result.rows[0].type).toBe('verb');
      expect(result.rows[1].type).toBe('verb');
    });

    it('handles section headings with "idiom"', () => {
      const input = `Idioms
1. Break a leg — good luck`;
      const result = parseVocabularyText(input);
      expect(result.rows[0].type).toBe('idiom');
    });

    it('strips RTL marks', () => {
      const input = `1. Test\u200F — \u200Etest`;
      const result = parseVocabularyText(input);
      expect(result.rows[0].word).toBe('Test');
      expect(result.rows[0].definition).toBe('test');
    });

    it('collects warnings for missing definition', () => {
      const input = `1. Test —`;
      const result = parseVocabularyText(input);
      expect(result.rows[0].warnings).toContain('Missing definition');
    });
  });

  describe('Tab-separated format', () => {
    it('parses tab-separated lines', () => {
      const input = `Come across as\tمعنى\tHe comes across as confident. — بيدي انطباع...`;
      const result = parseVocabularyText(input);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].word).toBe('Come across as');
      expect(result.rows[0].definition).toBe('معنى');
      expect(result.rows[0].exampleSentence).toBe('He comes across as confident. — بيدي انطباع...');
    });
  });

  describe('Garbage input', () => {
    it('returns error for unparseable input', () => {
      const input = 'This is not a valid format at all';
      const result = parseVocabularyText(input);
      expect(result.rows).toHaveLength(0);
      expect(result.errors.some(e => e.severity === 'error')).toBe(true);
    });

    it('returns error for empty input', () => {
      const result = parseVocabularyText('');
      expect(result.rows).toHaveLength(0);
      expect(result.errors.some(e => e.severity === 'error')).toBe(true);
    });
  });

  describe('Duplicate detection', () => {
    it('flags duplicates against existing words', () => {
      const rows: ParsedRow[] = [
        { word: 'hello', type: 'word', definition: 'A greeting', warnings: [] },
        { word: 'world', type: 'word', definition: 'The earth', warnings: [] },
      ];
      const existingWords = new Set(['hello']);
      detectDuplicates(rows, existingWords);
      expect(rows[0].warnings).toContain('Duplicate: word already exists in your vocabulary');
      expect(rows[1].warnings.length).toBe(0);
    });

    it('flags duplicates within the paste', () => {
      const rows: ParsedRow[] = [
        { word: 'hello', type: 'word', definition: 'A greeting', warnings: [] },
        { word: 'hello', type: 'word', definition: 'Another greeting', warnings: [] },
      ];
      const existingWords = new Set<string>();
      detectDuplicates(rows, existingWords);
      expect(rows[1].warnings).toContain('Duplicate within this import');
    });
  });
});
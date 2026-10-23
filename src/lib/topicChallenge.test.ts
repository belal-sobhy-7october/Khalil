import { describe, expect, it } from 'vitest';
import type { VocabularyItem } from '../types';
import { buildAiPrompt, buildPracticeTexts, stepStatus, youtubeId, EMPTY_CHALLENGE, TALK_GOAL_SECONDS } from './topicChallenge';
import { matchesSpoken } from './speech';

const item = (id: string, word: string, exampleSentence?: string): VocabularyItem => ({
  id, userId: 'u', word, type: 'word', definition: 'd', exampleSentence,
  masteryLevel: 0, reviewCount: 0, lapseCount: 0, correctStreak: 0, isHard: false, createdAt: '', updatedAt: '',
});

describe('buildPracticeTexts', () => {
  it('uses the pack paragraph first for library topics', () => {
    const texts = buildPracticeTexts('Job Interview', []);
    expect(texts[0]).toMatch(/My greatest strength is that I'm proactive/);
  });

  it('puts a given paragraph first instead of the pack\'s', () => {
    expect(buildPracticeTexts('Job Interview', [], 'Our own text.')[0]).toBe('Our own text.');
  });

  it('stitches example sentences into paragraphs and skips Arabic ones', () => {
    const items = Array.from({ length: 7 }, (_, i) => item(`${i}`, `w${i}`, `Sentence number ${i}`));
    items.push(item('ar', 'x', 'جملة عربية'));
    const texts = buildPracticeTexts('My topic', items);
    expect(texts).toHaveLength(1); // 5 sentences, then 2 left (too few for a second paragraph)
    expect(texts[0]).toBe('Sentence number 0. Sentence number 1. Sentence number 2. Sentence number 3. Sentence number 4.');
  });
});

describe('buildAiPrompt', () => {
  it('casts the AI as a customer for call center topics and lists the words', () => {
    const p = buildAiPrompt('Call Center: On the Call', [item('a', 'pull up'), item('b', 'refund')]);
    expect(p).toMatch(/Play a customer/);
    expect(p).toMatch(/pull up, refund/);
  });

  it('treats a call center interview as an interview', () => {
    expect(buildAiPrompt('Call Center Interview', [])).toMatch(/Act as an interviewer/);
  });
});

describe('stepStatus', () => {
  it('needs every word, every text and 10 minutes of talking', () => {
    const items = [item('a', 'x'), item('b', 'y')];
    const s = stepStatus({ ...EMPTY_CHALLENGE, words: ['a'], textsDone: [0], talkSeconds: TALK_GOAL_SECONDS, shadowing: 'skipped' }, items, ['t1']);
    expect(s).toEqual({ words: false, listen: true, shadow: true, talk: true });
  });
});

describe('youtubeId', () => {
  it('reads the common link shapes', () => {
    expect(youtubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10')).toBe('dQw4w9WgXcQ');
    expect(youtubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(youtubeId('https://youtube.com/shorts/abcDEF12345')).toBe('abcDEF12345');
    expect(youtubeId('https://vimeo.com/123')).toBeNull();
    expect(youtubeId('nope')).toBeNull();
  });
});

describe('matchesSpoken', () => {
  it('accepts the word inside any alternative, ignoring case', () => {
    expect(matchesSpoken('Bargain', ['it was a bargain', 'a bar game'])).toBe(true);
    expect(matchesSpoken('pull up', ['pulled up'])).toBe(false);
    expect(matchesSpoken('résumé / CV', ['my resume is here'])).toBe(true);
    expect(matchesSpoken('résumé / CV', ['send your CV'])).toBe(true);
  });
});

describe('buildAiPrompt for library topics', () => {
  it("brings the pack's questions, grammar and speaking task", () => {
    const p = buildAiPrompt('Crimes', []);
    expect(p).toMatch(/witness in court/);
    expect(p).toMatch(/passive voice/i);
    expect(p).toMatch(/news reporter/);
    expect(p).toMatch(/forensics/);
  });
});

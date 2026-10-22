import { describe, expect, it } from 'vitest';
import { selectedWord, sentenceAround } from './selectionWord';

describe('selectedWord', () => {
  it('trims punctuation and quotes around the word', () => {
    expect(selectedWord(' recruiter, ')).toBe('recruiter');
    expect(selectedWord('“follow up”.')).toBe('follow up');
  });

  it('lower-cases a capital that only starts a sentence', () => {
    expect(selectedWord('Recruiter')).toBe('recruiter');
    expect(selectedWord('IT')).toBe('IT');
    expect(selectedWord('iPhone')).toBe('iPhone');
  });

  it("isn't a word for Arabic, long selections or no letters", () => {
    expect(selectedWord('مكالمة')).toBeNull();
    expect(selectedWord('one two three four five six seven')).toBeNull();
    expect(selectedWord('27:18')).toBeNull();
  });
});

describe('sentenceAround', () => {
  const text = 'Interviewer: Sarah, a friendly HR recruiter at a call center in Cairo. She calls to check your English.';

  it('keeps the sentence the word is in', () => {
    expect(sentenceAround(text, 'recruiter')).toBe('Interviewer: Sarah, a friendly HR recruiter at a call center in Cairo.');
    expect(sentenceAround(text, 'check')).toBe('She calls to check your English.');
  });

  it('keeps nothing when the text is just the word, or Arabic', () => {
    expect(sentenceAround('recruiter', 'recruiter')).toBe('');
    expect(sentenceAround('كلمة recruiter هنا.', 'recruiter')).toBe('');
  });
});

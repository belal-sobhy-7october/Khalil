import { describe, expect, it } from 'vitest';
import { buildGap, gradeAnswer, normalizeAnswer } from './practice';

describe('gradeAnswer', () => {
  it('ignores case, punctuation and extra spaces', () => {
    expect(gradeAnswer('  Follow   Up! ', 'follow up')).toBe('correct');
    expect(normalizeAnswer('It’s')).toBe("it's");
  });

  it('forgives one typo in longer words but not in short ones', () => {
    expect(gradeAnswer('negociate', 'negotiate')).toBe('close');
    expect(gradeAnswer('rafund', 'refund')).toBe('close');
    expect(gradeAnswer('tip', 'top')).toBe('wrong');
    expect(gradeAnswer('', 'refund')).toBe('wrong');
  });
});

describe('buildGap', () => {
  it('blanks the word and keeps the inflected form as the answer', () => {
    expect(buildGap('negotiate', 'We negotiated a better price.')).toEqual({
      before: 'We ',
      answer: 'negotiated',
      after: ' a better price.',
    });
  });

  it('works for multi-word phrases', () => {
    expect(buildGap('pull up', 'Let me pull up your account.')?.answer).toBe('pull up');
  });

  it('returns null when the example does not contain the word', () => {
    expect(buildGap('bargain', 'This phone was cheap.')).toBeNull();
    expect(buildGap('bargain', undefined)).toBeNull();
  });
});

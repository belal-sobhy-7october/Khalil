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

describe('buildGap — only real inflections', () => {
  it('does not match a longer, different word', () => {
    expect(buildGap('art', 'I read an article about art.')?.answer).toBe('art');
    expect(buildGap('art', 'I read an article.')).toBeNull();
  });

  it('handles y → ied, consonant doubling and e-dropping', () => {
    expect(buildGap('study', 'She studied all night.')?.answer).toBe('studied');
    expect(buildGap('run', 'He is running late.')?.answer).toBe('running');
    expect(buildGap('stop', 'We stopped the call.')?.answer).toBe('stopped');
    expect(buildGap('use', 'I am using it.')?.answer).toBe('using');
  });

  it('inflects only the first word of a phrase', () => {
    expect(buildGap('pull up', 'She pulled up my account.')?.answer).toBe('pulled up');
    expect(buildGap('look into', 'I will look into it.')?.answer).toBe('look into');
  });

  it('works with accented words', () => {
    expect(buildGap('résumé', 'Send your résumé today.')?.answer).toBe('résumé');
  });
});

describe('gradeAnswer — accents and alternatives', () => {
  it('ignores accents and accepts any "/" alternative', () => {
    expect(gradeAnswer('resume', 'résumé / CV')).toBe('correct');
    expect(gradeAnswer('cv', 'résumé / CV')).toBe('correct');
    expect(gradeAnswer('resum', 'résumé / CV')).toBe('close');
  });
});


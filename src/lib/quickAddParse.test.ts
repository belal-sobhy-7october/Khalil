import { describe, expect, it } from 'vitest';
import { parseQuickLine } from './quickAddParse';

describe('parseQuickLine', () => {
  it('reads a bare word', () => {
    expect(parseQuickLine('negotiate')).toEqual({ word: 'negotiate', definition: '', example: '' });
  });

  it('reads pipe-separated word | definition | example', () => {
    expect(parseQuickLine('bargain | a cheap deal | This was a bargain.')).toEqual({
      word: 'bargain',
      definition: 'a cheap deal',
      example: 'This was a bargain.',
    });
  });

  it('splits on a spaced dash but keeps hyphenated words whole', () => {
    expect(parseQuickLine('well-known - famous')).toEqual({ word: 'well-known', definition: 'famous', example: '' });
    expect(parseQuickLine('well-known')).toEqual({ word: 'well-known', definition: '', example: '' });
  });

  it('strips list bullets and numbering', () => {
    expect(parseQuickLine('- follow up')?.word).toBe('follow up');
    expect(parseQuickLine('3. pull up')?.word).toBe('pull up');
  });

  it('ignores blank lines', () => {
    expect(parseQuickLine('   ')).toBeNull();
  });
});

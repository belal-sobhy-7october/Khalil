import { beforeEach, describe, expect, it } from 'vitest';
import { claimLocalData } from './localOwner';

describe('claimLocalData', () => {
  beforeEach(() => localStorage.clear());

  it('keeps the data of the account that saved it', () => {
    localStorage.setItem('khalil-wird-days', '{"2026-10-15":{}}');
    expect(claimLocalData('a')).toBe(false);
    expect(claimLocalData('a')).toBe(false);
    expect(localStorage.getItem('khalil-wird-days')).not.toBeNull();
  });

  it("drops another account's data but keeps device preferences", () => {
    claimLocalData('a');
    localStorage.setItem('khalil-wird-days', '{}');
    localStorage.setItem('khalil-pomodoro-sessions', '[]');
    localStorage.setItem('khalil-kv:english-practice-log', '{}');
    localStorage.setItem('khalil-kv:appearance', '"pink"');
    localStorage.setItem('khalil-theme', 'dark');
    expect(claimLocalData('b')).toBe(true);
    expect(localStorage.getItem('khalil-wird-days')).toBeNull();
    expect(localStorage.getItem('khalil-pomodoro-sessions')).toBeNull();
    expect(localStorage.getItem('khalil-kv:english-practice-log')).toBeNull();
    expect(localStorage.getItem('khalil-kv:appearance')).toBe('"pink"');
    expect(localStorage.getItem('khalil-theme')).toBe('dark');
    expect(claimLocalData('b')).toBe(false);
  });
});

/// <reference types="node" />
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { CLOSED_SECTIONS, emailHash, isClosedSection, opensClosedSkills } from './skillAccess';

describe('the sections closed for now', () => {
  it('are Call Center Prep and Sales Prep', () => {
    expect(CLOSED_SECTIONS).toEqual(['callcenter', 'sales']);
    expect(isClosedSection('callcenter')).toBe(true);
    expect(isClosedSection('skills')).toBe(false);
  });

  it('hashes an email the way the comment says to (trimmed, lowercase, SHA-256)', async () => {
    const expected = createHash('sha256').update('someone@example.com').digest('hex');
    expect(await emailHash(' Someone@Example.com ')).toBe(expected);
  });

  it('stay closed for other accounts, guests and visitors with no account', async () => {
    expect(await opensClosedSkills('someone@example.com')).toBe(false);
    expect(await opensClosedSkills('')).toBe(false);
    expect(await opensClosedSkills(null)).toBe(false);
  });
});

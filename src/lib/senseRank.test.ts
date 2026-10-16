import { describe, expect, it } from 'vitest';
import { rankSenses, sameDefinition, senseScore, topicContext } from './senseRank';

const splitUp = [
  { definition: 'To divide into smaller groups or separate individuals, especially to go in different directions.', pos: 'verb' },
  { definition: 'To end a relationship or marriage.', example: 'They split up after ten years together.', pos: 'verb' },
];

describe('topic-aware senses', () => {
  it('picks "end a relationship" for split up in a Marriage topic', () => {
    expect(rankSenses(splitUp, topicContext('Marriage'))[0]).toBe(splitUp[1]);
  });

  it('works for Arabic topic names too', () => {
    expect(rankSenses(splitUp, topicContext('زواج'))[0]).toBe(splitUp[1]);
  });

  it('uses the other words in the topic when the name says little', () => {
    const context = topicContext('My list', ['To have a romantic relationship with someone.', 'A person you are married to.']);
    expect(rankSenses(splitUp, context)[0]).toBe(splitUp[1]);
  });

  it('keeps dictionary order when nothing relates to the topic', () => {
    const context = topicContext('Zzz');
    expect(rankSenses(splitUp, context)[0]).toBe(splitUp[0]);
    expect(senseScore(splitUp[0], context)).toBe(0);
  });

  it('compares definitions loosely', () => {
    expect(sameDefinition('To end a relationship.', 'to end a relationship')).toBe(true);
    expect(sameDefinition('To end a relationship.', 'To start one.')).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { lessonForTopicName, planTopicUpgrade, hasUpgrade } from './topicUpgrade';
import { TOPIC_PACKS } from '../data/topicPacks';
import type { VocabularyCategory, VocabularyItem } from '../types';

const cat = (id: string, name: string): VocabularyCategory => ({ id, userId: 'u', name, createdAt: '', updatedAt: '' });
const word = (id: string, categoryId: string, w: string, definition = 'old definition', exampleSentence = 'old example'): VocabularyItem => ({
  id, userId: 'u', categoryId, word: w, type: 'word', definition, exampleSentence,
  masteryLevel: 2, reviewCount: 3, lapseCount: 0, correctStreak: 1, isHard: false, createdAt: '', updatedAt: '',
});

describe('lessonForTopicName', () => {
  it('matches lessons by title, by merged old packs and by subject', () => {
    expect(lessonForTopicName('Job Interview')?.id).toBe('job-interview');
    expect(lessonForTopicName('Shopping & Money')?.id).toBe('shop-smart');
    expect(lessonForTopicName('Marriage')?.id).toBe('relationships-and-marriage');
    expect(lessonForTopicName('Love')?.id).toBe('relationships-and-marriage');
    expect(lessonForTopicName('Education')?.id).toBe('smart-learning');
    expect(lessonForTopicName('Personality')?.id).toBe('feelings-and-personality');
    expect(lessonForTopicName('Grammar')).toBeUndefined();
  });
});

describe('planTopicUpgrade', () => {
  const lesson = TOPIC_PACKS.find((p) => p.id === 'job-interview')!;

  it('updates lesson words, adds the missing ones and offers to remove old filler', () => {
    const categories = [cat('j', 'Job Interview')];
    const items = [
      word('1', 'j', 'Strength'), // in the new lesson, old text → update
      word('2', 'j', 'a quick learner'), // old pack filler → remove
      word('3', 'j', 'my own phrase'), // the user's own → untouched
    ];
    const { lessons, own } = planTopicUpgrade(categories, items);
    expect(own).toEqual([]);
    const up = lessons[0];
    expect(up.update.map((u) => u.item.id)).toEqual(['1']);
    expect(up.update[0].next.definition).toBe(lesson.items.find((i) => i.word === 'strength')!.definition);
    expect(up.remove.map((r) => r.id)).toEqual(['2']);
    expect(up.add).toHaveLength(lesson.items.length - 1);
    expect(up.rename).toBeUndefined();
  });

  it('renames topics whose old pack was merged into a course lesson', () => {
    const { lessons } = planTopicUpgrade([cat('s', 'Shopping & Money')], [word('1', 's', 'bargain')]);
    expect(lessons[0].rename).toBe('Shop Smart: The Psychology of Spending');
    expect(lessons[0].remove.map((r) => r.word)).toEqual(['bargain']);
  });

  it("suggests a lesson for the user's own topics without touching their words", () => {
    const plan = planTopicUpgrade([cat('m', 'Marriage'), cat('g', 'Grammar')], [word('1', 'm', 'Split up')]);
    expect(plan.lessons).toEqual([]);
    const marriage = plan.own.find((o) => o.category.id === 'm')!;
    expect(marriage.pack?.id).toBe('relationships-and-marriage');
    // "split up" is already in the list, so it isn't added again.
    expect(marriage.add.map((a) => a.word)).not.toContain('split up');
    expect(plan.own.find((o) => o.category.id === 'g')!.pack).toBeUndefined();
    expect(hasUpgrade(plan)).toBe(true);
  });

  it('offers a lesson to one topic only', () => {
    const plan = planTopicUpgrade([cat('l', 'Love'), cat('m', 'Marriage')], []);
    const withWords = plan.own.filter((o) => o.add.length > 0).map((o) => o.category.name);
    expect(withWords).toEqual(['Marriage']);
  });

  it('has nothing to do once a topic matches its lesson', () => {
    const items = lesson.items.map((p, i) => ({ ...word(String(i), 'j', p.word, p.definition, p.example) }));
    const plan = planTopicUpgrade([cat('j', 'Job Interview')], items);
    expect(plan.lessons).toEqual([]);
    expect(hasUpgrade(plan)).toBe(false);
  });
});

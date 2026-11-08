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
    // Lessons of the earlier versions map to the lesson that replaced them.
    expect(lessonForTopicName('Job Interview')?.id).toBe('career-and-interviews');
    expect(lessonForTopicName('Small Talk')?.id).toBe('meeting-people');
    expect(lessonForTopicName('Shopping & Money')?.id).toBe('consumerism-and-minimalism');
    expect(lessonForTopicName('Meeting People & Small Talk')?.id).toBe('meeting-people');
    expect(lessonForTopicName('Marriage')?.id).toBe('relationships-and-norms');
    expect(lessonForTopicName('Love')?.id).toBe('relationships-and-norms');
    expect(lessonForTopicName('Education')?.id).toBe('learning-strategies');
    expect(lessonForTopicName('Personality')?.id).toBe('people-and-feelings');
    expect(lessonForTopicName('Grammar')).toBeUndefined();
    expect(lessonForTopicName('Friends')?.id).toBe('friendship-and-conflict');
    expect(lessonForTopicName('Environment')?.id).toBe('climate-and-sustainability');
    expect(lessonForTopicName('رمضان')?.id).toBe('celebrations-and-traditions');
    expect(lessonForTopicName('Movies')?.id).toBe('media-and-reviews');
    expect(lessonForTopicName('My ideal job')?.id).toBe('workplace-responsibilities');
  });
});

describe('planTopicUpgrade', () => {
  const lesson = TOPIC_PACKS.find((p) => p.id === 'career-and-interviews')!;

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
    // The old lesson was merged into a bigger one, so the topic takes its name.
    expect(up.rename).toBe(lesson.title);
  });

  it('renames topics whose old pack was merged into a course lesson', () => {
    const { lessons } = planTopicUpgrade([cat('s', 'Shopping & Money')], [word('1', 's', 'bargain')]);
    expect(lessons[0].rename).toBe('Consumerism, Advertising & Minimalism');
    expect(lessons[0].remove.map((r) => r.word)).toEqual(['bargain']);
  });

  it("suggests a lesson for the user's own topics without touching their words", () => {
    const plan = planTopicUpgrade([cat('m', 'Marriage'), cat('g', 'Grammar')], [word('1', 'm', 'Split up')]);
    expect(plan.lessons).toEqual([]);
    const marriage = plan.own.find((o) => o.category.id === 'm')!;
    expect(marriage.pack?.id).toBe('relationships-and-norms');
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
    const plan = planTopicUpgrade([cat('j', lesson.title)], items);
    expect(plan.lessons).toEqual([]);
    expect(hasUpgrade(plan)).toBe(false);
  });
});

describe('call center topics', () => {
  it('have no lesson in the general library (an interview there is not a job interview)', () => {
    expect(lessonForTopicName('Call Center Interview')).toBeUndefined();
    expect(lessonForTopicName('Call Center: My words')).toBeUndefined();
    expect(lessonForTopicName('كول سنتر')).toBeUndefined();
    expect(lessonForTopicName('Interview')?.id).toBe('career-and-interviews');
  });

  it('are not in the Topic Library', () => {
    expect(TOPIC_PACKS.some((p) => /call ?cent/i.test(`${p.id} ${p.title} ${p.description}`))).toBe(false);
  });
});

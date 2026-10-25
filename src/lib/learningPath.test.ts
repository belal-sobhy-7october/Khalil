import { describe, expect, it } from 'vitest';
import {
  PATH_SECTIONS, PATH_TOPICS, buildPath, currentDay, dayProgress, defaultSettings, isItemDone, packById, pathStats,
  scheduledDay, sectionTimeline, startsFor, withDefaults, wordKey, wordsOf, type PathDay, type PathItem, type PathProgress, type PathSettings,
  type PlannedItem,
} from './learningPath';
import { getCourseSection } from '../data/courses';
import { TOPIC_PACKS } from '../data/topicPacks';
import { addDaysToDateString } from '../store/dateHelpers';

const path = buildPath();
const settings = (s: Partial<PathSettings>) => ({ ...defaultSettings(), ...s });
const blockOf = (d: PathDay, section: string) => d.blocks.find((b) => b.section === section)!;
const lessons = (p: PathDay[], section: string) =>
  p.flatMap((d) => blockOf(d, section).items.map((i) => i.item)).filter((i): i is Extract<PathItem, { kind: 'lesson' }> => i.kind === 'lesson');
const progress = (over: Partial<PathProgress> = {}): PathProgress => ({
  state: withDefaults(null),
  course: {},
  positions: {},
  words: new Set(),
  ...over,
});
const ibrahim = (section: 'grammar' | 'listening' | 'reading' | 'pronunciation') =>
  getCourseSection(section).sources.find((s) => s.id === 'ibrahim-adel')!.groups.flatMap((g) => g.lessons.map((l) => l.id));

describe('the plan', () => {
  it('runs for as long as the lessons last, the same six blocks every day, every item planned once', () => {
    // No end date: far past the old 90 days, and a day for every topic at least.
    expect(path.length).toBeGreaterThan(300);
    expect(path.map((d) => d.day)).toEqual(path.map((_, i) => i + 1));
    const keys = new Set<string>();
    for (const d of path) {
      expect(d.blocks.map((b) => b.section)).toEqual(PATH_SECTIONS);
      for (const b of d.blocks) {
        expect(b.items.length, `day ${d.day} ${b.section}`).toBeGreaterThan(0);
        // About the day's minutes for the section: a long lesson is cut into parts.
        expect(b.minutes, `day ${d.day} ${b.section}`).toBeLessThanOrEqual(31);
        for (const i of b.items) {
          expect(keys.has(i.key), i.key).toBe(false);
          keys.add(i.key);
        }
      }
    }
  });

  it('gives every day a topic from the Topic Library, every topic in the path', () => {
    expect(new Set(PATH_TOPICS).size).toBe(PATH_TOPICS.length);
    for (const id of PATH_TOPICS) expect(packById(id), id).toBeDefined();
    expect([...PATH_TOPICS].sort()).toEqual(TOPIC_PACKS.map((p) => p.id).sort());
    // Each topic's words are spread over its days, every word once.
    for (const id of PATH_TOPICS) {
      const words = path.flatMap((d) => blockOf(d, 'vocabulary').items.map((i) => i.item)).filter((i) => i.kind === 'words' && i.packId === id);
      expect(words.flatMap((w) => (w.kind === 'words' ? wordsOf(w).map((x) => x.word) : []))).toEqual(packById(id)!.items.map((x) => x.word));
    }
    for (const d of path) expect(blockOf(d, 'vocabulary').items[0].item.kind).toBe('review');
    // A topic a day while there are topics; after them the review goes on alone.
    expect(path.slice(0, PATH_TOPICS.length).every((d) => d.packId)).toBe(true);
    expect(path.slice(PATH_TOPICS.length).every((d) => !d.packId && blockOf(d, 'vocabulary').items.length === 1)).toBe(true);
  });

  it("starts the day's topic at the chosen level, and every section where that level starts", () => {
    const levelOf = (p: PathDay[]) => packById(p[0].packId)!.level;
    expect(levelOf(path)).toBe('B1');
    expect(levelOf(buildPath(settings({ level: 'A1' })))).toBe('B1'); // the easiest topics there are
    expect(levelOf(buildPath(settings({ level: 'B2' })))).toBe('B2');
    const c1 = buildPath(settings({ level: 'C1' }));
    expect(levelOf(c1)).toBe('C1');
    // Every topic still comes once: the easier ones after.
    expect(c1.filter((d) => d.packId).map((d) => d.packId).sort()).toEqual([...PATH_TOPICS].sort());
    expect(startsFor('A1')).toEqual({ listeningLevel: 'beginner', readingLevel: 'A1', shadowingLevel: 'A1' });
    expect(startsFor('B1')).toEqual({ listeningLevel: 'intermediate', readingLevel: 'B1', shadowingLevel: 'B1' });
    expect(startsFor('C1')).toEqual({ listeningLevel: 'advanced', readingLevel: 'C1', shadowingLevel: 'B2' });
  });

  it("follows Ibrahim Adel's grammar course in order, then the grammar of the day's topic", () => {
    const course = ibrahim('grammar');
    expect([...new Set(lessons(path, 'grammar').map((l) => l.lesson.id))]).toEqual(course);
    const last = path.findIndex((d) => blockOf(d, 'grammar').items[0].item.kind === 'grammar');
    expect(last).toBeGreaterThan(30);
    for (const d of path.slice(last, PATH_TOPICS.length)) {
      const item = blockOf(d, 'grammar').items[0].item;
      expect(item).toMatchObject({ kind: 'grammar', packId: d.packId });
    }
    // Then the points of the topics studied during the course: every topic's point once.
    const points = path.flatMap((d) => blockOf(d, 'grammar').items.map((i) => i.item)).filter((i) => i.kind === 'grammar');
    expect(points.map((p) => (p.kind === 'grammar' ? p.packId : '')).sort()).toEqual([...PATH_TOPICS].sort());
  });

  it('cuts a long lesson into parts that cover it', () => {
    const parts = lessons(path, 'grammar').filter((l) => l.part);
    expect(parts.length).toBeGreaterThan(0);
    const first = parts[0];
    const all = parts.filter((p) => p.lesson.id === first.lesson.id);
    expect(all.map((p) => p.part!.index)).toEqual(Array.from({ length: first.part!.count }, (_, i) => i + 1));
    expect(all[0].part!.from).toBe(0);
    expect(all.at(-1)!.part!.to).toBe(first.lesson.seconds);
    for (let i = 1; i < all.length; i++) expect(all[i].part!.from).toBe(all[i - 1].part!.to);
  });

  it('listens to VOA from the chosen level, or to Ibrahim Adel first with VOA after his course', () => {
    const voa = getCourseSection('listening').sources.find((s) => s.id === 'voa')!;
    expect(lessons(path, 'listening')[0].groupName).toBe("America's National Parks");
    expect(lessons(buildPath(settings({ listeningLevel: 'beginner' })), 'listening')[0].groupId).toBe(voa.groups[0].id);
    const adelFirst = buildPath(settings({ listening: 'ibrahim-adel' }));
    const ids = lessons(adelFirst, 'listening').map((l) => l.sourceId);
    expect(ids[0]).toBe('ibrahim-adel');
    const switchAt = ids.indexOf('voa');
    expect(switchAt).toBeGreaterThan(0);
    expect(ids.slice(switchAt).every((s) => s === 'voa')).toBe(true);
    expect([...new Set(lessons(adelFirst, 'listening').filter((l) => l.sourceId === 'ibrahim-adel').map((l) => l.lesson.id))]).toEqual(ibrahim('listening'));
  });

  it('reads British Council by default, one text a day from the chosen level, then Ibrahim Adel', () => {
    expect(defaultSettings().reading).toBe('british-council');
    const items = lessons(path, 'reading');
    expect(items[0]).toMatchObject({ sourceId: 'british-council', groupName: 'B1 reading' });
    expect(items[0].lesson.kind).toBe('text');
    expect(items[0].lesson.url).toMatch(/^https:\/\/learnenglish\.britishcouncil\.org\/free-resources\/reading\/b1\//);
    expect(blockOf(path[0], 'reading').items).toHaveLength(1);
    const levels = [...new Set(items.filter((l) => l.sourceId === 'british-council').map((l) => l.groupName))];
    expect(levels).toEqual(['B1 reading', 'B2 reading', 'C1 reading']);
    const after = items.find((l) => l.sourceId !== 'british-council')!;
    expect(after.sourceId).toBe('ibrahim-adel');
    expect(lessons(buildPath(settings({ readingLevel: 'A1' })), 'reading')[0].groupName).toBe('A1 reading');
  });

  it('reads with Ibrahim Adel, then Lovely English Stories from the chosen level', () => {
    const items = lessons(buildPath(settings({ reading: 'ibrahim-adel', readingLevel: 'B1' })), 'reading');
    expect(items[0].sourceId).toBe('ibrahim-adel');
    const stories = items.filter((l) => l.sourceId === 'lovely-stories');
    expect(stories[0].groupName).toBe('Intermediate Stories — B1 / B2');
  });

  it('shadows one Listening Time lesson a day from the chosen level', () => {
    const a2 = buildPath(settings({ shadowingLevel: 'A2' }));
    expect(lessons(a2, 'shadowing')[0].groupName).toBe('A2 English Listening Practice');
    expect(lessons(path, 'shadowing')[0].groupName).toBe('A1 English Listening Practice');
    expect(blockOf(path[0], 'shadowing').items).toHaveLength(1);
  });

  it("takes Ibrahim Adel's pronunciation course, then VOA's How to Pronounce, then sound drills", () => {
    const timeline = sectionTimeline(path, 'pronunciation');
    expect(timeline[0]).toMatchObject({ from: 1, what: { kind: 'group', source: 'Ibrahim Adel' } });
    expect(timeline.some((s) => s.what.kind === 'group' && s.what.source === 'VOA How to Pronounce')).toBe(true);
    // Then, once the drills are done, your choice of lesson.
    expect(timeline.filter((s) => s.what.kind !== 'free').at(-1)!.what.kind).toBe('sounds');
  });

  it('plans less of each course a day with fewer minutes', () => {
    const end = (p: PathDay[]) => p.findIndex((d) => blockOf(d, 'grammar').items[0].item.kind === 'grammar');
    expect(end(buildPath(settings({ minutes: 30 })))).toBeLessThan(end(path));
    expect(end(buildPath(settings({ minutes: 10 })))).toBeGreaterThan(end(path));
  });

  it("gives a section's time to your choice once its lessons run out", () => {
    const last = path.at(-1)!;
    const free = last.blocks.filter((b) => b.items[0].item.kind === 'free').map((b) => b.section);
    expect(free.length).toBeGreaterThan(0);
    expect(free).not.toContain('vocabulary');
  });

  it("shows each section as consecutive segments over all the path's days", () => {
    for (const section of PATH_SECTIONS) {
      const timeline = sectionTimeline(path, section);
      expect(timeline[0].from).toBe(1);
      expect(timeline.at(-1)!.to).toBe(path.length);
      for (let i = 1; i < timeline.length; i++) expect(timeline[i].from).toBe(timeline[i - 1].to + 1);
    }
  });
});

describe('progress', () => {
  const day1 = path[0];
  const items = day1.blocks.flatMap((b) => b.items);
  const doneAll = (list: PlannedItem[], date: string) => Object.fromEntries(list.map((i) => [i.key, date]));

  it('counts lessons finished in the hub, the words in your flashcards and the rest from the path', () => {
    const lesson = items.find((i) => i.item.kind === 'lesson' && !i.item.part)!;
    const words = items.find((i) => i.item.kind === 'words')!;
    const review = items.find((i) => i.item.kind === 'review')!;
    if (lesson.item.kind !== 'lesson' || words.item.kind !== 'words') throw new Error('day 1 has a lesson and words');
    expect(isItemDone(lesson, progress())).toBe(false);
    expect(isItemDone(lesson, progress({ course: { [lesson.item.lesson.id]: '2026-10-20' } }))).toBe(true);
    const owned = new Set(wordsOf(words.item).map((w) => wordKey(w.word)));
    expect(isItemDone(words, progress({ words: owned }))).toBe(true);
    expect(isItemDone(review, progress({ state: { ...withDefaults(null), done: { [review.key]: '2026-10-20' } } }))).toBe(true);
  });

  it('ticks a part of a lesson once playback reaches its end', () => {
    const part = path.flatMap((d) => d.blocks.flatMap((b) => b.items)).find((i) => i.item.kind === 'lesson' && i.item.part?.index === 1)!;
    if (part.item.kind !== 'lesson' || !part.item.part) throw new Error('a part');
    expect(isItemDone(part, progress({ positions: { [part.item.lesson.id]: part.item.part.to - 30 } }))).toBe(false);
    expect(isItemDone(part, progress({ positions: { [part.item.lesson.id]: part.item.part.to } }))).toBe(true);
  });

  it('works on the first unfinished day, and counts a streak and the time', () => {
    const today = '2026-10-24';
    const state = { ...withDefaults(null), startedAt: today, done: doneAll(items, today) };
    const course = Object.fromEntries(items.flatMap((i) => (i.item.kind === 'lesson' ? [[i.item.lesson.id, addDaysToDateString(today, -1)]] : [])));
    const p = progress({ state, course });
    expect(dayProgress(day1, p)).toEqual({ done: 6, total: 6 });
    expect(currentDay(path, p)).toBe(2);
    const stats = pathStats(path, p, today);
    expect(stats.daysDone).toBe(1);
    expect(stats.streak).toBe(2);
    expect(stats.minutes).toBe(items.reduce((n, i) => n + i.minutes, 0));
    expect(stats.bySection.vocabulary.done).toBe(2);
    expect(scheduledDay('2026-10-20', today)).toBe(5);
  });

  it('fills in settings missing from a saved value', () => {
    expect(withDefaults({ startedAt: '2026-10-01', settings: { minutes: 30 } as PathSettings }).settings).toEqual({ ...defaultSettings(), minutes: 30 });
  });
});

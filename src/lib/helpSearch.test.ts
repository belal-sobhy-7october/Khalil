import { describe, expect, it } from 'vitest';
import { HELP_TOPICS } from '../data/help';
import { normalize, searchHelp, words } from './helpSearch';

const first = (q: string) => searchHelp(q)[0]?.id;

describe('Ask Khalil', () => {
  it('has every answer in both languages, with ids that are unique', () => {
    for (const t of HELP_TOPICS) {
      expect(t.q.ar && t.q.en && t.a.ar && t.a.en, t.id).toBeTruthy();
      expect(t.keywords.length, t.id).toBeGreaterThan(0);
    }
    expect(new Set(HELP_TOPICS.map((t) => t.id)).size).toBe(HELP_TOPICS.length);
  });

  it('reads Arabic without harakat, hamza forms or "ال"', () => {
    expect(normalize('أَوْلَوِيَّة')).toBe('اولويه');
    expect(words('والبطاقات الإنجليزية')).toEqual(['بطاقات', 'انجليزيه']);
  });

  it('finds the answer people look for, in Arabic and English', () => {
    expect(first('كيف أشغّل البومودورو؟')).toBe('focus');
    expect(first('pomodoro')).toBe('focus');
    expect(first('أريد أن أحفظ بياناتي')).toBe('guest');
    expect(first('does it work offline')).toBe('offline');
    expect(first('بدون انترنت')).toBe('offline');
    expect(first('الورد')).toBe('wird');
    expect(first('مقابلة الكول سنتر')).toBe('callcenter');
    expect(first('add a task')).toBe('tasks');
    expect(first('بطاقات المراجعة')).toBe('flashcards');
  });

  it('shows the popular answers before anything is typed, and nothing for nonsense', () => {
    expect(searchHelp('').length).toBe(HELP_TOPICS.filter((t) => t.popular).length);
    expect(searchHelp('zzqx')).toEqual([]);
  });
});

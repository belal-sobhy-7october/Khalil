import { describe, expect, it } from 'vitest';
import { DEFAULT_TASKS_SETTINGS, arrangeTasks, normalizeTasksSettings } from './tasksSettings';

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).getTime();
const task = (id: string, completed: boolean, updatedAt: number) => ({ id, completed, updatedAt });

describe('arrangeTasks', () => {
  const now = at(2026, 10, 25, 10);
  const tasks = [
    task('a', true, at(2026, 10, 24, 22)), // ticked last night
    task('b', false, at(2026, 10, 20)),
    task('c', true, at(2026, 10, 25, 9)), // ticked this morning
    task('d', true, at(2026, 10, 23)),
  ];
  const ids = (list: Array<{ id: string }>) => list.map((t) => t.id);

  it('keeps everything in place with "stay"', () => {
    expect(ids(arrangeTasks(tasks, 'stay', now).shown)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('moves finished tasks below the open ones with "bottom"', () => {
    expect(ids(arrangeTasks(tasks, 'bottom', now).shown)).toEqual(['b', 'a', 'c', 'd']);
  });

  it('hides every finished task with "hideNow"', () => {
    const { shown, hidden } = arrangeTasks(tasks, 'hideNow', now);
    expect(ids(shown)).toEqual(['b']);
    expect(ids(hidden)).toEqual(['a', 'c', 'd']);
  });

  it('hides tasks finished on an earlier day with "nextDay"', () => {
    const { shown, hidden } = arrangeTasks(tasks, 'nextDay', now);
    expect(ids(shown)).toEqual(['b', 'c']);
    expect(ids(hidden)).toEqual(['a', 'd']);
  });

  it('hides tasks finished a full day ago with "after24h"', () => {
    expect(ids(arrangeTasks(tasks, 'after24h', now).hidden)).toEqual(['d']);
  });
});

describe('normalizeTasksSettings', () => {
  it('gives the defaults for nothing saved', () => {
    expect(normalizeTasksSettings(null)).toEqual(DEFAULT_TASKS_SETTINGS);
  });

  it('keeps a saved order, drops unknown parts and adds missing ones', () => {
    const s = normalizeTasksSettings({ sections: [{ id: 'wird' }, { id: 'nope' }, { id: 'tasks', hidden: true }, { id: 'wird' }], completed: 'bogus' });
    expect(s.sections).toEqual([{ id: 'wird' }, { id: 'tasks', hidden: true }, { id: 'focus' }, { id: 'habits' }, { id: 'backlog' }]);
    expect(s.completed).toBe(DEFAULT_TASKS_SETTINGS.completed);
  });
});

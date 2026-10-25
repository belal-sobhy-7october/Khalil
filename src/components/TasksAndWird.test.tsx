import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useAppStore } from '../store/appStore';
import { getToday } from '../store/dateHelpers';
import { BUILTIN_ITEMS, EMPTY_DAY, useWirdStore } from '../lib/wird';
import { setWirdItems } from '../lib/wirdItems';
import { DEFAULT_TASKS_SETTINGS, setTasksSettings } from '../lib/tasksSettings';
import { setHabitLinks } from '../lib/wirdSync';
import DailyTodo from './Todo/DailyTodo';
import WirdSection from './Wird/WirdSection';
import SettingsSection from './Settings/SettingsSection';
import Sidebar from './Layout/Sidebar';
import type { DailyTodo as DailyTodoType, Habit } from '../types';

vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
vi.mock('../lib/userKv', () => ({
  readLocalKv: (_k: string, f: unknown) => f,
  loadKv: vi.fn(async (_u: string, _k: string, f: unknown) => f),
  saveKv: vi.fn(async () => true),
}));

const today = getToday();
const habit = (id: string, name: string): Habit => ({ id, name, icon: 'star', sortOrder: 0, active: true, startDate: '2026-01-01', scheduleDays: null });
const todo = (id: string, text: string, completed = false): DailyTodoType => ({
  id, text, completed, priority: 'medium', createdAt: 0, sortOrder: 0, gate: 'daily', updatedAt: Date.now(), date: today, rolloverCount: 0,
});

beforeEach(() => {
  localStorage.clear();
  useAppStore.setState({
    language: 'en',
    session: { user: { id: 'u1' } } as unknown as ReturnType<typeof useAppStore.getState>['session'],
    habits: [],
    habitEntries: [],
    dailyTodos: [],
    pendingMovements: new Set(),
    vocabularyItems: [],
  });
  useWirdStore.setState({ days: {}, loadRange: vi.fn(async () => {}) });
  setWirdItems(BUILTIN_ITEMS.map((i) => ({ ...i })));
  setTasksSettings({ ...DEFAULT_TASKS_SETTINGS });
  setHabitLinks({});
});

describe("today's tasks with the wird and the habits", () => {
  it('ticking a prayer there records it in the wird, and its note switches congregation ↔ alone', () => {
    render(<DailyTodo />);
    fireEvent.click(screen.getByRole('button', { name: 'Mark as complete: Fajr' }));
    expect(useWirdStore.getState().days[today].prayers.fajr).toBe('jamaah');
    fireEvent.click(screen.getByRole('button', { name: 'In congregation' }));
    expect(useWirdStore.getState().days[today].prayers.fajr).toBe('alone');
    fireEvent.click(screen.getByRole('button', { name: 'Mark as incomplete: Fajr' }));
    expect(useWirdStore.getState().days[today].prayers.fajr).toBeNull();
  });

  it('shows a ticked wird item from the sheet as done', () => {
    useWirdStore.setState({ days: { [today]: { ...EMPTY_DAY, adhkarAM: true } } });
    render(<DailyTodo />);
    expect(screen.getByRole('button', { name: 'Mark as incomplete: Morning adhkar' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('puts a linked habit on its wird row, and lists the other habits due today', () => {
    const toggleHabitEntry = vi.fn(async () => {});
    useAppStore.setState({ habits: [habit('h1', 'Morning remembrance'), habit('h2', 'Read 10 pages')], toggleHabitEntry });
    setHabitLinks({ h1: 'adhkarAM' });
    render(<DailyTodo />);
    const row = screen.getByRole('button', { name: 'Mark as complete: Morning adhkar' }).closest('li')!;
    expect(within(row).getByText('Morning remembrance')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Mark as complete: Morning remembrance' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Mark as complete: Read 10 pages' }));
    expect(toggleHabitEntry).toHaveBeenCalledWith('h2', today);
  });

  it('leaves out the wird and the habits when the settings say so', () => {
    useAppStore.setState({ habits: [habit('h2', 'Read 10 pages')] });
    setTasksSettings({ ...DEFAULT_TASKS_SETTINGS, todayWird: false, todayHabits: false });
    render(<DailyTodo />);
    expect(screen.queryByText('Fajr')).toBeNull();
    expect(screen.queryByText('Read 10 pages')).toBeNull();
  });

  it('hides finished tasks as the settings say, and lists them under "Finished"', () => {
    setTasksSettings({ ...DEFAULT_TASKS_SETTINGS, completed: 'hideNow', todayWird: false });
    useAppStore.setState({ dailyTodos: [todo('t1', 'Call the bank', true), todo('t2', 'Buy bread')] });
    render(<DailyTodo />);
    expect(screen.queryByText('Call the bank')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Finished (1)' }));
    expect(screen.getByText('Call the bank')).toBeInTheDocument();
  });
});

describe('a flexible wird', () => {
  it('adds an item of your own from Settings and shows it on the sheet', () => {
    const { unmount } = render(<SettingsSection />);
    fireEvent.click(screen.getByRole('tab', { name: 'Wird' }));
    fireEvent.click(screen.getByRole('button', { name: /Istighfar/ }));
    unmount();
    render(<WirdSection />);
    expect(screen.getByRole('group', { name: 'Istighfar' })).toBeInTheDocument();
  });

  it('hides a built-in item everywhere', () => {
    setWirdItems(BUILTIN_ITEMS.map((i) => (i.id === 'qiyam' ? { ...i, hidden: true } : { ...i })));
    render(<WirdSection />);
    expect(screen.queryByRole('group', { name: 'Qiyam' })).toBeNull();
    expect(screen.getByRole('group', { name: 'Quran' })).toBeInTheDocument();
  });
});

describe.each(['en', 'ar'] as const)('Settings tabs are fully translated (%s)', (language) => {
  it('every tab', () => {
    useAppStore.setState({ language });
    render(<SettingsSection />);
    for (const tab of screen.getAllByRole('tab')) {
      fireEvent.click(tab);
      expect(document.body.textContent).not.toMatch(/\b(settings|wird|contact|todo)\.[a-zA-Z_.]+/);
    }
  });
});

describe('Sidebar', () => {
  it('lists Tasks & Habits first, has no Wird or tracking item, and closes on any choice', () => {
    const onSectionChange = vi.fn();
    const onToggle = vi.fn();
    render(<Sidebar activeSection="todo" onSectionChange={onSectionChange} isOpen onToggle={onToggle} />);
    const names = within(screen.getByRole('navigation')).getAllByRole('button').map((b) => b.textContent);
    expect(names).toEqual(['Tasks & Habits', 'Focus (Pomodoro)', 'Learn Languages', 'Learn Skills', 'Calendar', 'Bookmarks', 'Analytics', 'Settings']);
    fireEvent.click(screen.getByRole('button', { name: 'Calendar' }));
    expect(onSectionChange).toHaveBeenCalledWith('calendar');
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

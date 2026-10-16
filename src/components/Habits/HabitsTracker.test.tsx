import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { Habit } from '../../types';
import { useAppStore } from '../../store/appStore';
import { addDaysToDateString, getToday } from '../../store/dateHelpers';
import HabitsTracker from './HabitsTracker';
import { habitPeriodDates } from '../../store/habitPeriod';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const today = getToday();

const habits: Habit[] = [
  { id: 'h1', name: 'Study', icon: 'book', sortOrder: 0, active: true, startDate: addDaysToDateString(today, -90), scheduleDays: null },
  { id: 'h2', name: 'Exercise', icon: 'dumbbell', sortOrder: 1, active: true, startDate: addDaysToDateString(today, -90), scheduleDays: null },
];

const removeHabit = vi.fn();
const toggleHabitEntry = vi.fn();

beforeEach(() => {
  removeHabit.mockReset();
  toggleHabitEntry.mockReset();
  useAppStore.setState({ language: 'en', habits, habitEntries: [], removeHabit, toggleHabitEntry });
});

describe('HabitsTracker grid', () => {
  it('renders day columns in calendar order, oldest first and today last', () => {
    render(<HabitsTracker />);
    const cells = screen.getAllByRole('button', { name: new RegExp(`^Study — `) });
    expect(cells[cells.length - 1]).toHaveAccessibleName(`Study — ${today}`);
    expect(cells[cells.length - 2]).toHaveAccessibleName(`Study — ${addDaysToDateString(today, -1)}`);
  });

  it('shows the whole current period, upcoming days included but not clickable', () => {
    render(<HabitsTracker />);
    fireEvent.click(screen.getByRole('button', { name: 'Month' }));
    const days = habitPeriodDates(30, today);
    const upcoming = days.filter((d) => d > today).length;
    const header = document.querySelector('[data-today="true"]');
    expect(header).not.toBeNull();
    expect(screen.getAllByRole('button', { name: /^Study — / })).toHaveLength(days.length - upcoming);
    expect(document.querySelectorAll('[aria-disabled="true"]')).toHaveLength(upcoming * habits.length);
    expect(screen.getByRole('button', { name: 'Next period' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Previous period' }));
    expect(screen.getByRole('button', { name: 'Next period' })).toBeEnabled();
    expect(document.querySelector('[data-today="true"]')).toBeNull();
  });

  it('begins at the first habit start rather than with empty days', () => {
    const start = addDaysToDateString(today, -3);
    useAppStore.setState({ habits: habits.map((h) => ({ ...h, startDate: start })) });
    render(<HabitsTracker />);
    fireEvent.click(screen.getByRole('button', { name: '2 months' }));
    const expected = habitPeriodDates(60, today).filter((d) => d >= start);
    const cells = screen.getAllByRole('button', { name: /^Study — / });
    expect(cells[0]).toHaveAccessibleName(`Study — ${expected[0]}`);
    expect(screen.getByRole('button', { name: 'Previous period' })).toBeDisabled();
  });

  it('gives edit/delete buttons accessible names that include the habit name', () => {
    render(<HabitsTracker />);
    expect(screen.getByRole('button', { name: 'Delete habit "Exercise"' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit "Exercise"' })).toBeInTheDocument();
  });

  it('asks for a confirmation naming the habit before deleting', () => {
    render(<HabitsTracker />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete habit "Exercise"' }));
    expect(removeHabit).not.toHaveBeenCalled();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('Delete "Exercise"?');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));
    expect(removeHabit).toHaveBeenCalledWith('h2');
  });

  it('cancelling the confirmation does not delete', () => {
    render(<HabitsTracker />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete habit "Study"' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(removeHabit).not.toHaveBeenCalled();
  });

  it('uses Arabic labels in Arabic', () => {
    useAppStore.setState({ language: 'ar' });
    render(<HabitsTracker />);
    expect(screen.getByRole('button', { name: 'حذف عادة Study' })).toBeInTheDocument();
  });

  it('toggles a day for the correct habit', () => {
    render(<HabitsTracker />);
    fireEvent.click(screen.getByRole('button', { name: `Exercise — ${today}` }));
    expect(toggleHabitEntry).toHaveBeenCalledWith('h2', today);
  });

  it('checking a day before the start date moves the start date back', () => {
    const updateHabit = vi.fn();
    const start = addDaysToDateString(today, -2);
    // Days before the first habit aren't shown, so another habit started earlier.
    useAppStore.setState({
      habits: [{ ...habits[0], startDate: start }, { ...habits[1], startDate: addDaysToDateString(today, -10) }],
      updateHabit,
    });
    render(<HabitsTracker />);
    fireEvent.click(screen.getByRole('button', { name: '2 months' }));
    const earlier = addDaysToDateString(today, -4);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Study — ${earlier}`) }));
    expect(updateHabit).toHaveBeenCalledWith('h1', { startDate: earlier });
    expect(toggleHabitEntry).toHaveBeenCalledWith('h1', earlier);
  });

  it('shows habits due today in the Today card', () => {
    render(<HabitsTracker />);
    expect(screen.getByText("Today's habits")).toBeInTheDocument();
    expect(screen.getByText('0 of 2 done')).toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { Habit } from '../../types';
import { useAppStore } from '../../store/appStore';
import { addDaysToDateString, getToday } from '../../store/dateHelpers';
import HabitsTracker from './HabitsTracker';

vi.mock('../../lib/supabase', async () => {
  const mod = await import('../../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});

const today = getToday();

const habits: Habit[] = [
  { id: 'h1', name: 'Study', icon: 'book', sortOrder: 0, active: true, startDate: addDaysToDateString(today, -90) },
  { id: 'h2', name: 'Exercise', icon: 'dumbbell', sortOrder: 1, active: true, startDate: addDaysToDateString(today, -90) },
];

const removeHabit = vi.fn();
const toggleHabitEntry = vi.fn();

beforeEach(() => {
  removeHabit.mockReset();
  toggleHabitEntry.mockReset();
  useAppStore.setState({ language: 'en', habits, habitEntries: [], removeHabit, toggleHabitEntry });
});

describe('HabitsTracker grid', () => {
  it('renders day columns newest-first so today is next to the label column', () => {
    render(<HabitsTracker />);
    const cells = screen.getAllByRole('button', { name: new RegExp(`^Study — `) });
    expect(cells[0]).toHaveAccessibleName(`Study — ${today}`);
    expect(cells[1]).toHaveAccessibleName(`Study — ${addDaysToDateString(today, -1)}`);
  });

  it('gives edit/delete buttons accessible names that include the habit name', () => {
    render(<HabitsTracker />);
    expect(screen.getByRole('button', { name: 'Delete habit "Exercise"' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit start date for "Exercise"' })).toBeInTheDocument();
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
});

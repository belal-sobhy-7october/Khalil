import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useAppStore } from '../store/appStore';
import { usePomodoroStore, DEFAULT_SETTINGS } from '../store/pomodoroStore';
import { useWirdStore } from '../lib/wird';
import { useAppearance } from '../lib/appearance';
import { getToday } from '../store/dateHelpers';
import FocusSection from './Focus/FocusSection';
import WirdSection from './Wird/WirdSection';
import AnalyticsSection from './Analytics/AnalyticsSection';
import SettingsSection from './Settings/SettingsSection';
import FocusChip from './Focus/FocusChip';

vi.mock('../lib/supabase', async () => {
  const mod = await import('../test/mockSupabase');
  return { supabase: mod.mockSupabase };
});
vi.mock('../lib/userKv', () => ({
  readLocalKv: (_k: string, f: unknown) => f,
  loadKv: vi.fn(async (_u: string, _k: string, f: unknown) => f),
  saveKv: vi.fn(async () => true),
}));

const noRawKeys = () =>
  expect(document.body.textContent).not.toMatch(/\b(focus|wird|analytics|settings|common)\.[a-zA-Z_.]+/);

beforeEach(() => {
  localStorage.clear();
  useAppStore.setState({
    language: 'en',
    theme: 'light',
    session: { user: { id: 'u1' } } as unknown as ReturnType<typeof useAppStore.getState>['session'],
    habits: [],
    habitEntries: [],
    dailyTodos: [],
    vocabularyItems: [],
  });
  usePomodoroStore.setState({
    phase: 'focus', status: 'idle', endsAt: null, remainingMs: 0, cycle: 0, label: '', phaseStartedAt: null,
    settings: { ...DEFAULT_SETTINGS }, sessions: [],
  });
  useWirdStore.setState({ days: {}, loadRange: vi.fn(async () => {}) });
  useAppearance.setState({ id: 'default' });
});

describe.each(['en', 'ar'] as const)('new sections render fully translated (%s)', (language) => {
  it('focus, wird, analytics, settings', () => {
    useAppStore.setState({ language });
    for (const C of [FocusSection, WirdSection, AnalyticsSection, SettingsSection]) {
      const { unmount } = render(<C />);
      noRawKeys();
      unmount();
    }
  });
});

describe('FocusSection', () => {
  it('starts and pauses from the button and the Space key', () => {
    render(<FocusSection />);
    expect(screen.getByText('25:00')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^Start$/ }));
    expect(usePomodoroStore.getState().status).toBe('running');
    fireEvent.keyDown(window, { code: 'Space', key: ' ' });
    expect(usePomodoroStore.getState().status).toBe('paused');
  });

  it('switching phase resets to that phase length', () => {
    render(<FocusSection />);
    fireEvent.click(screen.getByRole('tab', { name: 'Long break' }));
    expect(screen.getByText('15:00')).toBeInTheDocument();
  });

  it('edits settings', () => {
    render(<FocusSection />);
    fireEvent.click(screen.getByRole('button', { name: /Timer settings/ }));
    fireEvent.change(screen.getByLabelText('Focus (minutes)'), { target: { value: '50' } });
    expect(usePomodoroStore.getState().settings.focus).toBe(50);
    expect(screen.getByText('50:00')).toBeInTheDocument();
  });
});

describe('WirdSection', () => {
  it('cycles a prayer jamaah → alone → none and updates the week summary', () => {
    render(<WirdSection />);
    const today = getToday();
    const cell = () => screen.getAllByRole('button', { name: new RegExp(`^Fajr ${today}`) })[0];
    fireEvent.click(cell());
    expect(useWirdStore.getState().days[today].prayers.fajr).toBe('jamaah');
    fireEvent.click(cell());
    expect(useWirdStore.getState().days[today].prayers.fajr).toBe('alone');
    fireEvent.click(cell());
    expect(useWirdStore.getState().days[today].prayers.fajr).toBeNull();
  });

  it('steps qiyam and toggles rawatib for the selected day', () => {
    render(<WirdSection />);
    const today = getToday();
    const qiyam = screen.getByRole('group', { name: 'Qiyam (rakaat)' });
    fireEvent.click(within(qiyam).getByRole('button', { name: /\+$/ }));
    fireEvent.click(within(qiyam).getByRole('button', { name: /\+$/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Before Dhuhr (4)' }));
    const d = useWirdStore.getState().days[today];
    expect(d.qiyam).toBe(2);
    expect(d.rawatib.dhuhrBefore).toBe(true);
  });
});

describe('SettingsSection', () => {
  it('picking a theme applies it and switches to its preferred mode', () => {
    render(<SettingsSection />);
    fireEvent.click(screen.getByRole('button', { name: /Downtown Cairo/ }));
    expect(useAppearance.getState().id).toBe('downtown');
    expect(useAppStore.getState().theme).toBe('dark');
  });

  it('picking a palette keeps the current mode', () => {
    render(<SettingsSection />);
    fireEvent.click(screen.getByRole('button', { name: /Royal Pine/ }));
    expect(useAppearance.getState().id).toBe('pine');
    expect(useAppStore.getState().theme).toBe('light');
  });
});

describe('AnalyticsSection', () => {
  it('summarises focus minutes and switches to a table view', () => {
    const today = getToday();
    usePomodoroStore.setState({
      sessions: [{ id: 's', startedAt: `${today}T08:00:00`, endedAt: `${today}T08:25:00`, minutes: 25, label: null }],
    });
    render(<AnalyticsSection />);
    expect(screen.getAllByText(/25 min/).length).toBeGreaterThan(0);
    const focusCard = screen.getByText('Focus minutes').closest('div.rounded-2xl') as HTMLElement;
    fireEvent.click(within(focusCard).getByRole('button', { name: /Table/ }));
    expect(within(focusCard).getByRole('table')).toBeInTheDocument();
  });
});

describe('FocusChip', () => {
  it('is hidden when idle and shows the running timer elsewhere', () => {
    const onOpen = vi.fn();
    const { rerender } = render(<FocusChip onOpen={onOpen} />);
    expect(screen.queryByText(/\d\d:\d\d/)).toBeNull();
    usePomodoroStore.setState({ status: 'paused', remainingMs: 12 * 60_000 + 5_000 });
    rerender(<FocusChip onOpen={onOpen} />);
    fireEvent.click(screen.getByText('12:05'));
    expect(onOpen).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Resume' }));
    expect(usePomodoroStore.getState().status).toBe('running');
  });
});

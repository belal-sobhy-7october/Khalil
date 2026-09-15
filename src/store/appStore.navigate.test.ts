import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from './appStore';

// Runs under TZ=Africa/Cairo (see vite.config.ts test.env). This is the exact
// scenario reported by a user in Cairo: navigatePrevious/navigateNext used to
// go through `new Date(currentDate + 'T00:00:00')` (parsed as local time) and
// then `.toISOString().split('T')[0]` (formatted as UTC), which silently
// shifted the date by a day in any positive-UTC-offset timezone.
describe('calendar navigation in Africa/Cairo', () => {
  beforeEach(() => {
    useAppStore.setState({ currentDate: '2024-06-15', viewMode: 'day' });
  });

  it('navigateNext moves the day view forward by exactly one day', () => {
    useAppStore.getState().navigateNext();
    expect(useAppStore.getState().currentDate).toBe('2024-06-16');
  });

  it('navigatePrevious moves the day view back by exactly one day', () => {
    useAppStore.getState().navigatePrevious();
    expect(useAppStore.getState().currentDate).toBe('2024-06-14');
  });

  it('navigateNext/navigatePrevious round-trip back to the start date', () => {
    useAppStore.getState().navigateNext();
    useAppStore.getState().navigatePrevious();
    expect(useAppStore.getState().currentDate).toBe('2024-06-15');
  });

  it('week view moves by exactly 7 days in each direction', () => {
    useAppStore.setState({ viewMode: 'week' });
    useAppStore.getState().navigateNext();
    expect(useAppStore.getState().currentDate).toBe('2024-06-22');
    useAppStore.getState().navigatePrevious();
    useAppStore.getState().navigatePrevious();
    expect(useAppStore.getState().currentDate).toBe('2024-06-08');
  });

  it('multi-week view moves by exactly 7 days in each direction', () => {
    useAppStore.setState({ viewMode: 'multi-week' });
    useAppStore.getState().navigateNext();
    expect(useAppStore.getState().currentDate).toBe('2024-06-22');
  });

  it('agenda view moves by exactly 7 days in each direction', () => {
    useAppStore.setState({ viewMode: 'agenda' });
    useAppStore.getState().navigateNext();
    expect(useAppStore.getState().currentDate).toBe('2024-06-22');
  });

  it('multi-day view moves by exactly 3 days in each direction', () => {
    useAppStore.setState({ viewMode: 'multi-day' });
    useAppStore.getState().navigateNext();
    expect(useAppStore.getState().currentDate).toBe('2024-06-18');
    useAppStore.getState().navigatePrevious();
    useAppStore.getState().navigatePrevious();
    expect(useAppStore.getState().currentDate).toBe('2024-06-12');
  });

  it('month view moves by exactly one calendar month, clamping day overflow', () => {
    useAppStore.setState({ currentDate: '2024-01-31', viewMode: 'month' });
    useAppStore.getState().navigateNext();
    expect(useAppStore.getState().currentDate).toBe('2024-02-29');
  });

  it('year view moves by exactly one year, not one month', () => {
    useAppStore.setState({ viewMode: 'year' });
    useAppStore.getState().navigateNext();
    expect(useAppStore.getState().currentDate).toBe('2025-06-15');
    useAppStore.getState().navigatePrevious();
    useAppStore.getState().navigatePrevious();
    expect(useAppStore.getState().currentDate).toBe('2023-06-15');
  });

  it('day view steps correctly across the Cairo DST spring-forward boundary', () => {
    useAppStore.setState({ currentDate: '2024-04-25' });
    useAppStore.getState().navigateNext();
    expect(useAppStore.getState().currentDate).toBe('2024-04-26');
    useAppStore.getState().navigateNext();
    expect(useAppStore.getState().currentDate).toBe('2024-04-27');
  });

  it('day view steps correctly across the Cairo DST fall-back boundary', () => {
    useAppStore.setState({ currentDate: '2024-10-31' });
    useAppStore.getState().navigateNext();
    expect(useAppStore.getState().currentDate).toBe('2024-11-01');
  });
});

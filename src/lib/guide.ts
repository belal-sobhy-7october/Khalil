/**
 * The tour Khalil (the character) gives on a first visit: what each part of
 * the app is for, one short step at a time. It opens by itself for a new
 * guest, once per browser; anyone can take it again from the account menu or
 * the sidebar. Its steps are in components/Guide/steps.ts.
 */
import { create } from 'zustand';

const DONE_KEY = 'khalil-guide-done';

/** Whether this browser has already seen the tour (taken to the end or skipped). */
export function guideSeen(): boolean {
  try {
    return localStorage.getItem(DONE_KEY) === '1';
  } catch {
    return true;
  }
}

function markSeen() {
  try {
    localStorage.setItem(DONE_KEY, '1');
  } catch {
    // it may open again on the next visit
  }
}

interface GuideState {
  active: boolean;
  start: () => void;
  /** Ends the tour (finished or skipped); it won't open by itself again. */
  finish: () => void;
}

export const useGuide = create<GuideState>((set) => ({
  active: false,
  start: () => set({ active: true }),
  finish: () => {
    markSeen();
    set({ active: false });
  },
}));

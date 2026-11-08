/**
 * The tour Khalil (the character) gives on a first visit: what each part of
 * the app is for, one short step at a time. It opens by itself for a new
 * guest, once per browser; anyone can take it again from the account menu or
 * the sidebar. Its steps are in components/Guide/steps.ts.
 *
 * It waits for Khalil's pictures (docs/mascot/README.md): until every pose it
 * shows has one, it doesn't open and isn't offered, unless this browser asks
 * to try it (localStorage `khalil-guide-preview` = "1").
 */
import { create } from 'zustand';
import { GUIDE_STEPS } from '../components/Guide/steps';
import { mascotUrl } from '../components/Guide/mascotPoses';

const DONE_KEY = 'khalil-guide-done';
const PREVIEW_KEY = 'khalil-guide-preview';
const PICTURES_READY = GUIDE_STEPS.every((s) => mascotUrl(s.pose) !== null);

/** Whether the tour can be taken: its pictures are in, or this browser is trying it. */
export function guideAvailable(): boolean {
  if (PICTURES_READY) return true;
  try {
    return localStorage.getItem(PREVIEW_KEY) === '1';
  } catch {
    return false;
  }
}

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
  start: () => {
    if (guideAvailable()) set({ active: true });
  },
  finish: () => {
    markSeen();
    set({ active: false });
  },
}));

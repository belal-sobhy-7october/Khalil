/**
 * "Review your words now" from anywhere (a reminder, the dashboard, the
 * learning path): opens the English hub on Vocabulary and starts the
 * spaced-repetition review there.
 */
const PENDING_KEY = 'khalil-open-review';
export const OPEN_REVIEW_EVENT = 'khalil:open-review';
export const ENGLISH_TAB_EVENT = 'khalil:english-tab';

export function openReview() {
  try {
    sessionStorage.setItem(PENDING_KEY, '1');
    localStorage.setItem('khalil-english-tab', 'vocabulary');
  } catch {
    // the events below still open it while the hub is on screen
  }
  window.dispatchEvent(new CustomEvent('khalil:navigate', { detail: 'vocabulary' }));
  window.dispatchEvent(new CustomEvent(ENGLISH_TAB_EVENT, { detail: 'vocabulary' }));
  window.dispatchEvent(new Event(OPEN_REVIEW_EVENT));
}

/** Whether a review was asked for before the Vocabulary page opened (see clearPendingReview). */
export function hasPendingReview(): boolean {
  try {
    return sessionStorage.getItem(PENDING_KEY) === '1';
  } catch {
    return false;
  }
}

/** The review is open: it shouldn't open again on the next visit. */
export function clearPendingReview() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // nothing to clear
  }
}

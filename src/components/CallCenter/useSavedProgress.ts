import { useCallback, useRef } from 'react';
import { useCallCenter } from './CallCenterContext';

/**
 * Like useState, but saved to the account: half-done work (a test, the
 * answers of an exercise, shadowing rounds…) is still there after you
 * leave, reload or open the app on another device. `clear` drops it.
 */
export function useSavedProgress<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void, () => void] {
  const { inProgress, saveProgress } = useCallCenter();
  const initialRef = useRef(initial);
  const value = (inProgress[key] as T | undefined) ?? initial;
  const set = useCallback(
    (next: T | ((prev: T) => T)) =>
      saveProgress(key, (prev) => {
        const current = (prev as T | undefined) ?? initialRef.current;
        return typeof next === 'function' ? (next as (p: T) => T)(current) : next;
      }),
    [key, saveProgress]
  );
  const clear = useCallback(() => saveProgress(key, () => undefined), [key, saveProgress]);
  return [value, set, clear];
}

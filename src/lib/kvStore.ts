import { useCallback, useEffect } from 'react';
import { create } from 'zustand';
import { useAppStore } from '../store/appStore';
import { loadKv, readLocalKv, saveKv } from './userKv';

/**
 * One per-user `user_kv` value shared by the whole app: every component sees
 * a change at once (unlike `useKv`, which keeps a copy per component). It
 * starts from the device's copy, so it is ready before the account loads and
 * with no internet.
 */
export function createKvStore<T>(key: string, normalize: (stored: unknown) => T) {
  const useStore = create<{ value: T; loadedFor: string | null }>(() => ({
    value: normalize(readLocalKv<unknown>(key, null)),
    loadedFor: null,
  }));

  const get = () => useStore.getState().value;

  function set(next: T | ((prev: T) => T), userId?: string) {
    const value = typeof next === 'function' ? (next as (prev: T) => T)(get()) : next;
    useStore.setState({ value });
    const owner = userId ?? useAppStore.getState().session?.user?.id;
    if (owner) void saveKv(owner, key, value);
  }

  function useValue(): [T, (next: T | ((prev: T) => T)) => void] {
    const userId = useAppStore((s) => s.session?.user?.id);
    const value = useStore((s) => s.value);

    useEffect(() => {
      if (!userId || useStore.getState().loadedFor === userId) return;
      useStore.setState({ loadedFor: userId });
      void loadKv<unknown>(userId, key, null).then((v) => useStore.setState({ value: normalize(v) }));
    }, [userId]);

    const update = useCallback((next: T | ((prev: T) => T)) => set(next, userId), [userId]);
    return [value, update];
  }

  return { useValue, get, set, useStore };
}

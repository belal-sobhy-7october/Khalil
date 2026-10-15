import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { loadKv, readLocalKv, saveKv } from './userKv';

/**
 * A piece of per-user state persisted in `user_kv` (and localStorage).
 * Starts from the local copy so the UI is instant, then syncs from the DB.
 */
export function useKv<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void, boolean] {
  const userId = useAppStore((s) => s.session?.user?.id);
  const [value, setValue] = useState<T>(() => readLocalKv(key, fallback));
  const [loaded, setLoaded] = useState(false);
  const valueRef = useRef(value);
  const fallbackRef = useRef(fallback);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    void loadKv(userId, key, fallbackRef.current).then((v) => {
      if (!alive) return;
      valueRef.current = v;
      setValue(v);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, [userId, key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const v = typeof next === 'function' ? (next as (prev: T) => T)(valueRef.current) : next;
      valueRef.current = v;
      setValue(v);
      if (userId) void saveKv(userId, key, v);
    },
    [userId, key]
  );

  return [value, update, loaded];
}

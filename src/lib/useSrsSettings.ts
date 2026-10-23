import { useCallback, useEffect } from 'react';
import { create } from 'zustand';
import { useAppStore } from '../store/appStore';
import { DEFAULT_SRS_SETTINGS, SRS_SETTINGS_KEY, type SrsSettings } from './srs';
import { loadKv, readLocalKv, saveKv } from './userKv';

const withDefaults = (v: Partial<SrsSettings> | null | undefined): SrsSettings => ({ ...DEFAULT_SRS_SETTINGS, ...(v ?? {}) });

// One copy for the whole app, so a change in the review settings reaches the
// reminders and any open session at once.
const useStore = create<{ settings: SrsSettings; loadedFor: string | null }>(() => ({
  settings: withDefaults(readLocalKv<Partial<SrsSettings>>(SRS_SETTINGS_KEY, {})),
  loadedFor: null,
}));

/** The review settings (new words a day, retention, reminder), saved per user in user_kv. */
export function useSrsSettings(): [SrsSettings, (patch: Partial<SrsSettings>) => void] {
  const userId = useAppStore((s) => s.session?.user?.id);
  const settings = useStore((s) => s.settings);

  useEffect(() => {
    if (!userId || useStore.getState().loadedFor === userId) return;
    useStore.setState({ loadedFor: userId });
    void loadKv<Partial<SrsSettings>>(userId, SRS_SETTINGS_KEY, {}).then((v) => useStore.setState({ settings: withDefaults(v) }));
  }, [userId]);

  const update = useCallback(
    (patch: Partial<SrsSettings>) => {
      const next = { ...useStore.getState().settings, ...patch };
      useStore.setState({ settings: next });
      if (userId) void saveKv(userId, SRS_SETTINGS_KEY, next);
    },
    [userId]
  );

  return [settings, update];
}

/** The current settings outside React (e.g. in a timer). */
export const getSrsSettings = () => useStore.getState().settings;

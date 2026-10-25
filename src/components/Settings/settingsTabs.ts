/** The tabs of the Settings page, and a way for other pages to open one of them. */
export type SettingsTab = 'general' | 'tasks' | 'wird' | 'look';
export const SETTINGS_TABS: SettingsTab[] = ['general', 'tasks', 'wird', 'look'];

const KEY = 'khalil-settings-tab';
export const SETTINGS_TAB_EVENT = 'khalil:settings-tab';

/** Opens Settings on `tab` (e.g. "Customize the wird" opens the wird tab). */
export function openSettingsTab(tab: SettingsTab) {
  try {
    sessionStorage.setItem(KEY, tab);
  } catch {
    // storage blocked: Settings opens on its first tab
  }
  window.dispatchEvent(new CustomEvent('khalil:navigate', { detail: 'settings' }));
  window.dispatchEvent(new CustomEvent(SETTINGS_TAB_EVENT, { detail: tab }));
}

/** The tab Settings opens on: the one asked for last in this tab of the browser. */
export function readSettingsTab(): SettingsTab {
  try {
    const tab = sessionStorage.getItem(KEY);
    if (SETTINGS_TABS.includes(tab as SettingsTab)) return tab as SettingsTab;
  } catch {
    // storage blocked
  }
  return 'general';
}

export function rememberSettingsTab(tab: SettingsTab) {
  try {
    sessionStorage.setItem(KEY, tab);
  } catch {
    // storage blocked
  }
}

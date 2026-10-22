/**
 * Topics the user marked as studied in the Topic Library, with the day they
 * did. Kept on this device only, so marking works with no internet (study
 * offline, review pronunciation once back online).
 */
import { useSyncExternalStore } from 'react';

export const STUDIED_TOPICS_KEY = 'khalil-studied-topics';

type Studied = Record<string, string>;

const listeners = new Set<() => void>();
let cache: Studied | null = null;

function read(): Studied {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STUDIED_TOPICS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    cache = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Studied) : {};
  } catch {
    cache = {};
  }
  return cache;
}

export function setTopicStudied(packId: string, studied: boolean, today = new Date().toISOString().slice(0, 10)) {
  const next = { ...read() };
  if (studied) next[packId] = today;
  else delete next[packId];
  cache = next;
  try {
    localStorage.setItem(STUDIED_TOPICS_KEY, JSON.stringify(next));
  } catch {
    // storage blocked — the mark lasts until the page closes
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STUDIED_TOPICS_KEY) return;
    cache = null;
    onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

/** Pack id → the day it was marked studied (YYYY-MM-DD). */
export function useStudiedTopics(): Studied {
  return useSyncExternalStore(subscribe, read, read);
}

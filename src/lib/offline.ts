/**
 * Using Khalil with no internet. A service worker (public build only, see
 * scripts/offlinePlugin.ts) saves every file of the app on the device the
 * first time it opens online, so it opens again with no connection — the
 * topic lessons are part of the app, so they all work offline.
 */
import { useSyncExternalStore } from 'react';
import type { Session } from '@supabase/supabase-js';

// ── Online / offline ──────────────────────────────────────────────────────

function subscribeOnline(onChange: () => void) {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

export function isOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

export function useOnline(): boolean {
  return useSyncExternalStore(subscribeOnline, isOnline, () => true);
}

// ── The session saved on this device ──────────────────────────────────────

/** supabase-js's default localStorage key for the session. */
function authStorageKey(): string | null {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    return url ? `sb-${new URL(url).hostname.split('.')[0]}-auth-token` : null;
  } catch {
    return null;
  }
}

/**
 * The last signed-in session as supabase-js saved it, even if its access
 * token has expired. Offline, supabase-js can't refresh the token and reports
 * no session, though the account is still signed in on this device.
 */
export function readStoredSession(): Session | null {
  const key = authStorageKey();
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    const session = raw ? (JSON.parse(raw) as Session) : null;
    return session?.user?.id && session.refresh_token ? session : null;
  } catch {
    return null;
  }
}

// ── Saved on this device (service worker) ─────────────────────────────────

export type OfflineReadiness = 'unsupported' | 'preparing' | 'ready' | 'failed';

let readiness: OfflineReadiness = 'unsupported';
const readinessListeners = new Set<() => void>();

function setReadiness(next: OfflineReadiness) {
  if (readiness === next) return;
  readiness = next;
  readinessListeners.forEach((l) => l());
}

function subscribeReadiness(onChange: () => void) {
  readinessListeners.add(onChange);
  return () => readinessListeners.delete(onChange);
}

/** Whether Khalil is saved on this device and opens without internet. */
export function useOfflineReadiness(): OfflineReadiness {
  return useSyncExternalStore(subscribeReadiness, () => readiness, () => readiness);
}

function track(registration: ServiceWorkerRegistration) {
  if (registration.active) {
    setReadiness('ready');
    return;
  }
  const worker = registration.installing ?? registration.waiting;
  if (!worker) return;
  worker.addEventListener('statechange', () => {
    if (worker.state === 'activated') setReadiness('ready');
    else if (worker.state === 'redundant') setReadiness(registration.active ? 'ready' : 'failed');
  });
}

/** Registers the service worker (production builds only). */
export function registerOfflineSupport() {
  if (!('serviceWorker' in navigator)) return;
  setReadiness('preparing');
  const register = () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(track)
      .catch(() => setReadiness('failed'));
    // Ask the browser not to clear the saved files when space runs low.
    navigator.storage?.persist?.().catch(() => {});
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}

// ── Install as an app ─────────────────────────────────────────────────────

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let installPrompt: InstallPromptEvent | null = null;
const installListeners = new Set<() => void>();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt = e as InstallPromptEvent;
    installListeners.forEach((l) => l());
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    installListeners.forEach((l) => l());
  });
}

function subscribeInstall(onChange: () => void) {
  installListeners.add(onChange);
  return () => installListeners.delete(onChange);
}

/** The browser's "install app" prompt, when it offers one (Chrome, Edge, Android). */
export function useInstallPrompt(): (() => Promise<void>) | null {
  const event = useSyncExternalStore(subscribeInstall, () => installPrompt, () => null);
  if (!event) return null;
  return async () => {
    await event.prompt();
    await event.userChoice.catch(() => null);
    installPrompt = null;
    installListeners.forEach((l) => l());
  };
}

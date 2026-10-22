/**
 * Call Center Prep is the owner's private study plan: only their account sees
 * it. The repository is public, so the account's email isn't written here —
 * only a salted SHA-256 of it, compared with the signed-in email's.
 *
 * A local build can show the section to any account for checks and
 * screenshots: VITE_CALL_CENTER_PREVIEW=1 (never set it on the deployed site).
 */
import { useEffect, useSyncExternalStore } from 'react';
import { useAppStore } from '../../store/appStore';

const SALT = 'khalil-callcenter:';
const OWNER_HASHES = new Set(['e4b8d05013678d184c4df21e15835f5c9fe31d24d1d307822da53e7080227cac']);

export async function emailHash(email: string): Promise<string> {
  const data = new TextEncoder().encode(SALT + email.trim().toLowerCase());
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const previewBuild = () => import.meta.env.VITE_CALL_CENTER_PREVIEW === '1';

export async function canOpenCallCenter(email: string | null | undefined): Promise<boolean> {
  if (previewBuild()) return true;
  if (!email || !globalThis.crypto?.subtle) return false;
  try {
    return OWNER_HASHES.has(await emailHash(email));
  } catch {
    return false;
  }
}

// email → allowed, filled in once the hash is worked out (it's async).
const known = new Map<string, boolean>();
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function resolve(email: string) {
  if (known.has(email)) return;
  void canOpenCallCenter(email).then((ok) => {
    known.set(email, ok);
    listeners.forEach((l) => l());
  });
}

/**
 * Whether the signed-in account sees Call Center Prep: null while that's
 * being worked out (a moment after sign-in), then true or false.
 */
export function useCallCenterAccess(): boolean | null {
  const email = useAppStore((s) => s.session?.user?.email ?? '');
  useEffect(() => {
    if (email) resolve(email);
  }, [email]);
  return useSyncExternalStore(
    subscribe,
    () => (previewBuild() ? true : !email ? false : known.get(email) ?? null),
    () => null
  );
}

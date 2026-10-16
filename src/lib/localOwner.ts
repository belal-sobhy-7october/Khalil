/**
 * Some data is mirrored to localStorage before we know who is signed in (wird
 * days, focus sessions and the running timer, per-user settings). When a
 * different account signs in on the same browser, that copy belongs to someone
 * else: drop it so it is neither shown to nor uploaded into the new account.
 */
const OWNER_KEY = 'khalil-local-owner';
const USER_KEYS = new Set(['khalil-wird-days', 'khalil-wird-unsynced', 'khalil-pomodoro-sessions', 'khalil-pomodoro-run', 'khalil-studied-topics']);
const KV_PREFIX = 'khalil-kv:';
// The look of the app is a device preference too; it is re-read from the account anyway.
const KEEP = new Set(['khalil-kv:appearance']);

/**
 * Marks `userId` as the owner of the local copy. Returns true when it held
 * another account's data, which has now been removed (the caller should reload
 * so in-memory stores start clean).
 */
export function claimLocalData(userId: string): boolean {
  try {
    const owner = localStorage.getItem(OWNER_KEY);
    if (owner === userId) return false;
    localStorage.setItem(OWNER_KEY, userId);
    // First run with this check: whatever is there was saved by this browser's user.
    if (owner === null) return false;
    const stale: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !KEEP.has(key) && (USER_KEYS.has(key) || key.startsWith(KV_PREFIX))) stale.push(key);
    }
    for (const key of stale) localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

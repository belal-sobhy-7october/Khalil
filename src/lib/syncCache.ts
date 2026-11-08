/**
 * This device's copy of the long lists the app opens with — the words, their
 * flashcard states, the habit days and the wird days — so the next visit asks
 * the server only for what changed (lib/startup.ts). Kept in IndexedDB (they
 * outgrow localStorage for a heavy user), one record per account. Without
 * IndexedDB (a private window, tests) there's no copy and everything loads.
 */
const DB = 'khalil-sync';
const STORE = 'accounts';

export interface SyncRecord {
  /** The server's time of the last sync: the next one asks for changes after it. */
  cursor: string;
  /** When everything was last loaded (a copy older than FULL_EVERY_DAYS loads everything again). */
  fullAt: string;
  words: Record<string, Record<string, unknown>>;
  srs: Record<string, unknown>;
  habitEntries: Record<string, Record<string, unknown>>;
  wird: Record<string, Record<string, unknown>>;
}

/** Deletions are kept on the server for 90 days; a copy older than this loads everything. */
export const FULL_EVERY_DAYS = 60;

function open(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      if (typeof indexedDB === 'undefined') return resolve(null);
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function readSyncRecord(userId: string): Promise<SyncRecord | null> {
  const db = await open();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(userId);
      req.onsuccess = () => resolve((req.result as SyncRecord | undefined) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function writeSyncRecord(userId: string, record: SyncRecord): Promise<void> {
  const db = await open();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(record, userId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch {
      resolve();
    }
  });
}

/** Removes every account's copy but this one (another account signed in on this browser). */
export async function forgetOtherAccounts(userId: string): Promise<void> {
  const db = await open();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const store = db.transaction(STORE, 'readwrite').objectStore(STORE);
      const req = store.getAllKeys();
      req.onsuccess = () => {
        for (const key of req.result) if (key !== userId) store.delete(key);
        resolve();
      };
      req.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

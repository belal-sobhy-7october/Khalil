/**
 * Recordings stay on this device (IndexedDB): they're private, they work
 * offline and they cost nothing to store. For each prompt we keep the very
 * first take (your "before") and the five latest; download any take to keep
 * it or send it to a recruiter.
 */
import type { VoiceStats } from './audio';

export interface Take {
  id: string;
  userId: string;
  promptId: string;
  createdAt: string;
  blob: Blob;
  stats: VoiceStats | null;
  transcript?: string;
}

const DB_NAME = 'khalil-callcenter';
const STORE = 'takes';
export const KEEP_LATEST = 5;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no IndexedDB'));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: 'id' });
      store.createIndex('prompt', ['userId', 'promptId']);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function run<T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  return openDb().then(
    (db) =>
      new Promise<T | undefined>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = work(tx.objectStore(STORE));
        tx.oncomplete = () => {
          db.close();
          resolve(req ? req.result : undefined);
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      })
  );
}

/** Takes to delete so only the first one and the latest `keep` remain (oldest first in, ids out). */
export function takesToPrune(takes: Array<Pick<Take, 'id' | 'createdAt'>>, keep = KEEP_LATEST): string[] {
  const sorted = [...takes].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  if (sorted.length <= keep + 1) return [];
  return sorted.slice(1, sorted.length - keep).map((t) => t.id);
}

export async function listTakes(userId: string, promptId: string): Promise<Take[]> {
  try {
    const takes = await run<Take[]>('readonly', (s) => s.index('prompt').getAll([userId, promptId]));
    return (takes ?? []).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  } catch {
    return [];
  }
}

export async function saveTake(take: Take): Promise<boolean> {
  try {
    await run('readwrite', (s) => s.put(take));
    const stale = takesToPrune(await listTakes(take.userId, take.promptId));
    if (stale.length) await run('readwrite', (s) => stale.forEach((id) => s.delete(id)));
    return true;
  } catch {
    return false;
  }
}

export async function deleteTake(id: string): Promise<void> {
  try {
    await run('readwrite', (s) => s.delete(id));
  } catch {
    // nothing saved, nothing to delete
  }
}

/** A file name for downloading a take. */
export function takeFileName(take: Pick<Take, 'promptId' | 'createdAt' | 'blob'>): string {
  const ext = take.blob.type.includes('mp4') ? 'm4a' : take.blob.type.includes('ogg') ? 'ogg' : 'webm';
  return `voice-note-${take.promptId}-${take.createdAt.slice(0, 10)}.${ext}`;
}

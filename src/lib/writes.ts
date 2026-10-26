/**
 * Tells when the app saves something to the database (any change, from any
 * part of the app), without each part reporting it: the Supabase client's
 * requests go through `trackingFetch`. A guest is asked to create an account
 * after their first change (components/Auth/GuestSavePrompt.tsx).
 */

type Listener = () => void;
const listeners = new Set<Listener>();

/** Calls `listener` after each request that changes data. Returns the unsubscribe. */
export function onDataWrite(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Reading functions: called with POST, but they change nothing. */
const READ_RPCS = ['/rest/v1/rpc/app_startup'];

/** Whether a request to Supabase changes data (a table write or a writing function). */
export function isDataWrite(url: string, method: string): boolean {
  if (method === 'GET' || method === 'HEAD') return false;
  let path: string;
  try {
    path = new URL(url, 'http://localhost').pathname;
  } catch {
    return false;
  }
  return path.includes('/rest/v1/') && !READ_RPCS.some((rpc) => path.endsWith(rpc));
}

export const trackingFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
  if (response.ok && isDataWrite(url, method)) listeners.forEach((l) => l());
  return response;
};

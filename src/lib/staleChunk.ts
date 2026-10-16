/**
 * Sections load lazily. After a new deploy, a tab that was opened earlier
 * still asks for the old file names, which no longer exist, so opening a
 * section failed with "Something went wrong". Reloading once picks up the new
 * version.
 */
const KEY = 'khalil-chunk-reload';

/** The error a lazy import throws when its file is gone. */
export function isStaleChunkError(error: unknown): boolean {
  const message = String((error as { message?: unknown })?.message ?? error);
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(message);
}

/**
 * Reloads the page to get the new version, at most once every 30 seconds so a
 * real outage can't cause a reload loop. Returns whether it reloaded.
 */
export function reloadForNewVersion(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0);
    if (Date.now() - last < 30_000) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    // storage blocked — still worth one reload
  }
  window.location.reload();
  return true;
}

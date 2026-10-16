/*
 * Khalil's service worker: keeps the app usable with no internet.
 * Built into dist/sw.js by scripts/offlinePlugin.ts, which fills in the
 * placeholders below. Every file of the build is saved on install, so all
 * sections (and the topic lessons inside them) open offline.
 */
const VERSION = __VERSION__;
const PRECACHE = __PRECACHE__;
const FONT_CSS = __FONT_CSS__;

const APP_CACHE = `khalil-app-${VERSION}`;
const FONT_CACHE = 'khalil-fonts';
// A page request that takes longer than this (Wi-Fi with no internet) is
// answered from the saved copy instead.
const PAGE_TIMEOUT_MS = 4000;

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE);
      await cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'no-cache' })));
      // Fonts are nice to have: without them the system font shows.
      await cacheFonts().catch(() => {});
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith('khalil-app-') && key !== APP_CACHE) await caches.delete(key);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(request.mode === 'navigate' ? page(request) : appFile(request));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(font(request));
  }
  // Everything else (Supabase, dictionaries, YouTube…) goes to the network as usual.
});

/** The page itself: fresh from the network when online, the saved copy otherwise. */
async function page(request) {
  try {
    const response = await withTimeout(fetch(request), PAGE_TIMEOUT_MS);
    if (response.ok || response.type === 'opaqueredirect') return response;
    throw new Error(`HTTP ${response.status}`);
  } catch {
    const saved = await (await caches.open(APP_CACHE)).match('/');
    return saved ?? (await caches.match('/')) ?? Response.error();
  }
}

/** Scripts, styles and icons: file names change with every build, so a saved copy is always right. */
async function appFile(request) {
  const saved = await caches.match(request, { ignoreVary: true });
  if (saved) return saved;
  const response = await fetch(request);
  if (response.ok && new URL(request.url).pathname.startsWith('/assets/')) {
    const cache = await caches.open(APP_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

async function font(request) {
  const cache = await caches.open(FONT_CACHE);
  const saved = await cache.match(request.url, { ignoreVary: true });
  if (saved) return saved;
  const response = await fetch(request);
  if (response.ok) await cache.put(request.url, response.clone());
  return response;
}

/** Saves the Google Fonts stylesheet and its Arabic and Latin font files. */
async function cacheFonts() {
  if (!FONT_CSS) return;
  const cache = await caches.open(FONT_CACHE);
  const response = await fetch(FONT_CSS);
  if (!response.ok) return;
  const css = await response.clone().text();
  await cache.put(FONT_CSS, response);
  // The stylesheet has one block per alphabet, each starting with a comment
  // such as "/* arabic */". Khalil only shows Arabic and Latin text.
  const urls = new Set();
  for (const block of css.split('/* ').slice(1)) {
    const subset = block.slice(0, block.indexOf(' */'));
    if (!['arabic', 'latin', 'latin-ext'].includes(subset)) continue;
    const match = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
    if (match) urls.add(match[1]);
  }
  await Promise.all(
    [...urls].map(async (url) => {
      if (await cache.match(url)) return;
      const file = await fetch(url);
      if (file.ok) await cache.put(url, file);
    })
  );
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

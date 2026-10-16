// Shared Playwright setup for the E2E scripts: a signed-in fake session,
// seeded local settings, the fake Supabase backend and problem collection.
import { SUPA, session, createFakeSupabase, fakeDictionary } from './fakeSupabase.mjs';
import { buildSeed } from './seed.mjs';

export const problems = [];

/**
 * Opens the app in a fresh context. Returns the page plus the backend so a
 * flow can inspect what was written. Local storage is seeded only on the
 * first load of the tab, so `page.reload()` keeps what the app stored.
 */
export async function openApp(browser, base, name, opts = {}) {
  const { section = 'todo', theme = 'light', appearance = 'default', language = 'ar', englishTab, viewport = { width: 1440, height: 900 }, local = {} } = opts;
  const context = await browser.newContext({ viewport, locale: language === 'en' ? 'en-US' : 'ar-EG' });
  await context.addInitScript(
    ({ session, section, theme, appearance, language, englishTab, local }) => {
      if (window.top !== window) return;
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      localStorage.clear();
      localStorage.setItem('sb-localhost-auth-token', JSON.stringify(session));
      localStorage.setItem('khalil-active-section', section);
      localStorage.setItem('khalil-theme', theme);
      localStorage.setItem('khalil-language', language);
      localStorage.setItem('khalil-kv:appearance', JSON.stringify(appearance));
      if (englishTab) localStorage.setItem('khalil-english-tab', englishTab);
      for (const [k, v] of Object.entries(local)) localStorage.setItem(k, v);
    },
    { session, section, theme, appearance, language, englishTab, local }
  );
  const backend = createFakeSupabase(buildSeed());
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === new URL(base).origin) return route.continue();
    if (url.origin === SUPA) return backend.handle(route);
    if (url.hostname === 'api.dictionaryapi.dev') return fakeDictionary(route);
    return route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => problems.push(`[${name}] pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|net::/.test(m.text())) problems.push(`[${name}] console: ${m.text().slice(0, 300)}`);
  });
  page.on('dialog', (d) => void d.accept());
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  return { page, context, backend };
}

/** Generic checks every screen should pass. */
export async function checkScreen(page, name) {
  if (await page.locator('input[type="password"]').count()) problems.push(`[${name}] login page shown — fake session not accepted`);
  const blank = await page.evaluate(() => (document.querySelector('#root')?.textContent ?? '').trim().length < 20);
  if (blank) problems.push(`[${name}] page looks blank`);
  const raw = await page.evaluate(() => {
    const m = document.body.innerText.match(/\b(?:focus|wird|analytics|settings|english|vocabulary|habits|common|nav|todo|calendar|bookmarks|life)\.[a-zA-Z_.]{3,}/g);
    return m ? [...new Set(m)].slice(0, 5) : [];
  });
  if (raw.length) problems.push(`[${name}] untranslated keys: ${raw.join(', ')}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 2) problems.push(`[${name}] horizontal page overflow ${overflow}px`);
}

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
  const { section = 'todo', theme = 'light', appearance = 'default', language = 'ar', englishTab, viewport = { width: 1440, height: 900 }, device, local = {} } = opts;
  // KHALIL_E2E_LEGACY=1: a database without the app_startup migration (the app loads table by table).
  const startup = opts.startup ?? !process.env.KHALIL_E2E_LEGACY;
  // `device` is a Playwright device descriptor (size, pixel ratio, user agent, touch); it replaces `viewport`.
  const context = await browser.newContext({ ...(device ?? { viewport }), locale: language === 'en' ? 'en-US' : 'ar-EG' });
  await context.addInitScript(
    ({ session, section, theme, appearance, language, englishTab, local }) => {
      if (window.top !== window) return;
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      localStorage.clear();
      localStorage.setItem('sb-localhost-auth-token', JSON.stringify(session));
      // The section this tab is on (a reload stays there; a fresh visit opens the tasks page).
      sessionStorage.setItem('khalil-active-section', section);
      localStorage.setItem('khalil-active-section', section);
      localStorage.setItem('khalil-theme', theme);
      localStorage.setItem('khalil-language', language);
      localStorage.setItem('khalil-kv:appearance', JSON.stringify(appearance));
      if (englishTab) localStorage.setItem('khalil-english-tab', englishTab);
      for (const [k, v] of Object.entries(local)) localStorage.setItem(k, v);
    },
    { session, section, theme, appearance, language, englishTab, local }
  );
  const backend = createFakeSupabase(buildSeed(), { startup });
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

/** What's wrong with the screen as a whole (the generic checks every screen should pass). */
export async function screenProblems(page) {
  const found = [];
  if (await page.locator('input[type="password"]').count()) found.push('login page shown — fake session not accepted');
  const blank = await page.evaluate(() => (document.querySelector('#root')?.textContent ?? '').trim().length < 20);
  if (blank) found.push('page looks blank');
  const raw = await page.evaluate(() => {
    const m = document.body.innerText.match(/\b(?:focus|wird|analytics|settings|english|vocabulary|habits|common|nav|todo|calendar|bookmarks|life)\.[a-zA-Z_.]{3,}/g);
    return m ? [...new Set(m)].slice(0, 5) : [];
  });
  if (raw.length) found.push(`untranslated keys: ${raw.join(', ')}`);
  // clientWidth is the screen's width; on a phone innerWidth grows when the page is zoomed out to fit what overflows.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 2) found.push(`horizontal page overflow ${overflow}px`);
  return found;
}

export async function checkScreen(page, name) {
  for (const p of await screenProblems(page)) problems.push(`[${name}] ${p}`);
}

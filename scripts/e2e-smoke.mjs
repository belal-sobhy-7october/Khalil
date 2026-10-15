// End-to-end smoke test: opens every section (Arabic/English, light/dark,
// every palette and theme, desktop and mobile) against a fake Supabase backend
// with seeded data, and reports page errors, untranslated keys, horizontal
// overflow and broken flows. Screenshots go to the output directory.
//
// Usage:
//   VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=fake npx vite --port 5173
//   npm i --no-save playwright && node scripts/e2e-smoke.mjs http://localhost:5173 ./e2e-shots
// Set CHROMIUM_PATH to use a specific Chromium build.
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] ?? 'http://localhost:5173';
const OUT = process.argv[3] ?? './shots';
const SUPA = 'http://localhost:54321';
fs.mkdirSync(OUT, { recursive: true });

const USER_ID = '00000000-0000-4000-8000-000000000001';
const pad = (n) => String(n).padStart(2, '0');
const dayStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const uuid = (i) => `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`;

// ---- seeded data ----
const habits = [
  { id: uuid(101), user_id: USER_ID, name: 'القيام', icon: 'moon', sort_order: 0, active: true, start_date: dayStr(daysAgo(45)), schedule_days: null, created_at: Date.now() },
  { id: uuid(102), user_id: USER_ID, name: 'جزء الورد', icon: 'book-open', sort_order: 1, active: true, start_date: dayStr(daysAgo(30)), schedule_days: null, created_at: Date.now() },
  { id: uuid(103), user_id: USER_ID, name: 'الجيم', icon: 'dumbbell', sort_order: 2, active: true, start_date: dayStr(daysAgo(40)), schedule_days: [0, 2, 4], created_at: Date.now() },
  { id: uuid(104), user_id: USER_ID, name: 'تطوير الأنجلش', icon: 'globe', sort_order: 3, active: true, start_date: dayStr(daysAgo(20)), schedule_days: null, created_at: Date.now() },
];
const habitEntries = [];
let eid = 1000;
for (const h of habits) {
  for (let i = 0; i < 45; i++) {
    const d = dayStr(daysAgo(i));
    if (d < h.start_date) continue;
    if (rand() < 0.65) habitEntries.push({ id: uuid(eid++), user_id: USER_ID, habit_id: h.id, date: d });
  }
}
const todos = [];
for (let i = 0; i < 30; i++) {
  const n = 2 + Math.floor(rand() * 4);
  for (let k = 0; k < n; k++) {
    todos.push({ id: uuid(eid++), user_id: USER_ID, text: `Task ${i}-${k}`, completed: i === 0 ? k === 0 : rand() < 0.7, priority: 'medium', gate: 'daily', date: dayStr(daysAgo(i)), sort_order: k, created_at: daysAgo(i).toISOString(), updated_at: daysAgo(i).toISOString() });
  }
}
const vocabCats = [{ id: uuid(201), user_id: USER_ID, name: 'Call Center Interview', color: '#e8d5c4', icon: 'folder', created_at: daysAgo(10).toISOString(), updated_at: daysAgo(10).toISOString() }];
const vocab = [
  ['Bargain', 'صفقة رابحة / بسعر مميز', 'This phone was a real bargain'],
  ['Ambitious', 'Having a strong wish to succeed.', 'He is ambitious and works hard'],
  ['Clumsy', 'Often dropping or breaking things.', 'I am clumsy and often drop things'],
  ['Compromise', 'An agreement where both sides accept less.', 'You need to compromise in marriage'],
  ['Escalation', 'Passing a problem to a supervisor.', "If I can't solve it, I'll raise an escalation."],
].map(([word, definition, ex], i) => ({
  id: uuid(300 + i), user_id: USER_ID, category_id: i > 2 ? uuid(201) : null, word, type: 'word', definition, example_sentence: ex,
  mastery_level: i % 4, review_count: i, lapse_count: i === 2 ? 2 : 0, correct_streak: 0, is_hard: false,
  created_at: daysAgo(i * 3).toISOString(), updated_at: daysAgo(i).toISOString(),
}));
const pomodoro = [];
for (let i = 0; i < 28; i++) {
  const n = Math.floor(rand() * 6);
  for (let k = 0; k < n; k++) {
    const start = daysAgo(i);
    start.setHours(9 + k, 0, 0, 0);
    if (start > new Date()) continue;
    pomodoro.push({ id: uuid(eid++), user_id: USER_ID, started_at: start.toISOString(), ended_at: new Date(start.getTime() + 25 * 60000).toISOString(), minutes: 25, label: k % 2 ? 'Grammar' : null });
  }
}
const wird = [];
const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
for (let i = 0; i < 40; i++) {
  const p = {};
  for (const pr of prayers) p[pr] = rand() < 0.6 ? 'jamaah' : rand() < 0.7 ? 'alone' : null;
  wird.push({ user_id: USER_ID, date: dayStr(daysAgo(i)), data: { prayers: p, qiyam: [0, 2, 4, 8, 11][Math.floor(rand() * 5)], rawatib: { fajrBefore: rand() < 0.8, dhuhrBefore: rand() < 0.5, maghribAfter: rand() < 0.6 }, quran: [0, 0.25, 0.5, 1][Math.floor(rand() * 4)], adhkarAM: rand() < 0.7, adhkarPM: rand() < 0.5 } });
}
const TABLES = {
  habits, habit_entries: habitEntries, todos, vocabulary_categories: vocabCats, vocabulary_items: vocab,
  pomodoro_sessions: pomodoro, wird_days: wird,
};

// ---- fake auth ----
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const exp = Math.floor(Date.now() / 1000) + 3600 * 24;
const user = { id: USER_ID, aud: 'authenticated', role: 'authenticated', email: 'belal@example.com', user_metadata: { full_name: 'Belal' }, app_metadata: { provider: 'email' }, created_at: new Date().toISOString() };
const accessToken = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: USER_ID, exp, role: 'authenticated', aud: 'authenticated', email: user.email })}.sig`;
const session = { access_token: accessToken, refresh_token: 'refresh', token_type: 'bearer', expires_in: 86400, expires_at: exp, user };

async function setup(context, { section, theme = 'light', appearance = 'default', language = 'ar', englishTab }) {
  await context.addInitScript(
    ({ session, section, theme, appearance, language, englishTab }) => {
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
    },
    { session, section, theme, appearance, language, englishTab }
  );
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === new URL(BASE).origin) return route.continue();
    if (url.origin !== SUPA) return route.abort();
    const method = route.request().method();
    if (url.pathname.startsWith('/auth/v1/user')) return route.fulfill({ json: user });
    if (url.pathname.startsWith('/auth/v1/token')) return route.fulfill({ json: session });
    if (url.pathname.startsWith('/auth/v1/')) return route.fulfill({ json: {} });
    const table = url.pathname.replace('/rest/v1/', '');
    const accept = route.request().headers()['accept'] ?? '';
    if (method === 'GET' || method === 'HEAD') {
      const rows = TABLES[table] ?? [];
      return route.fulfill({ json: accept.includes('vnd.pgrst.object') ? rows[0] ?? null : rows, headers: { 'content-range': `0-${rows.length}/${rows.length}` } });
    }
    let body = [];
    try {
      body = JSON.parse(route.request().postData() ?? '[]');
    } catch {
      body = [];
    }
    const rows = Array.isArray(body) ? body : [body];
    return route.fulfill({ status: 201, json: accept.includes('vnd.pgrst.object') ? rows[0] ?? {} : rows });
  });
}

const problems = [];
async function visit(browser, name, opts, interact) {
  const context = await browser.newContext({ viewport: opts.viewport ?? { width: 1440, height: 900 }, locale: opts.language === 'en' ? 'en-US' : 'ar-EG' });
  await setup(context, opts);
  const page = await context.newPage();
  page.on('pageerror', (e) => problems.push(`[${name}] pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|net::/.test(m.text())) problems.push(`[${name}] console: ${m.text().slice(0, 300)}`);
  });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1800);
  const loginVisible = await page.locator('input[type="password"]').count();
  if (loginVisible) problems.push(`[${name}] login page shown — fake session not accepted`);
  const blank = await page.evaluate(() => (document.querySelector('#root')?.textContent ?? '').trim().length < 20);
  if (blank) problems.push(`[${name}] page looks blank`);
  // Raw translation keys leaking into the UI.
  const raw = await page.evaluate(() => {
    const m = document.body.innerText.match(/\b(?:focus|wird|analytics|settings|english|vocabulary|habits|common|nav)\.[a-zA-Z_.]{3,}/g);
    return m ? [...new Set(m)].slice(0, 5) : [];
  });
  if (raw.length) problems.push(`[${name}] untranslated keys: ${raw.join(', ')}`);
  // Horizontal page overflow.
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 2) problems.push(`[${name}] horizontal page overflow ${overflow}px`);
  if (interact) await interact(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await context.close();
}

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const sections = ['todo', 'calendar', 'life', 'bookmarks', 'vocabulary', 'focus', 'wird', 'analytics', 'settings'];
for (const s of sections) await visit(browser, `ar-light-${s}`, { section: s });
for (const tab of ['accent', 'shadowing', 'reading']) await visit(browser, `ar-light-english-${tab}`, { section: 'vocabulary', englishTab: tab });
for (const s of ['focus', 'wird', 'analytics', 'settings']) await visit(browser, `en-dark-${s}`, { section: s, theme: 'dark', language: 'en' });
const themes = [['downtown', 'dark'], ['pink', 'light'], ['andalusian', 'light'], ['autumn', 'dark'], ['black', 'dark'], ['wood', 'light'], ['pine', 'dark'], ['velvet', 'dark'], ['copper', 'light']];
for (const [a, m] of themes) await visit(browser, `theme-${a}-${m}`, { section: 'analytics', theme: m, appearance: a });
for (const [a, m] of themes.slice(0, 5)) await visit(browser, `theme-${a}-${m}-todo`, { section: 'todo', theme: m, appearance: a });

// Interactions: pomodoro start → chip on other section; wird click; analytics table.
await visit(browser, 'flow-focus-start', { section: 'focus' }, async (page) => {
  await page.getByRole('button', { name: /^ابدأ$/ }).click();
  await page.waitForTimeout(1500);
  const title = await page.title();
  if (!/·/.test(title)) problems.push(`[flow-focus-start] tab title has no countdown: "${title}"`);
  const icon = await page.evaluate(() => document.querySelector('link[rel~="icon"]')?.getAttribute('href') ?? '');
  if (!icon.startsWith('data:image/png')) problems.push('[flow-focus-start] favicon not replaced with progress ring');
});
await visit(browser, 'flow-wird-click', { section: 'wird' }, async (page) => {
  const before = await page.locator('text=%').count();
  const cell = page.locator('button[aria-label^="الفجر 20"]:not([disabled])').last();
  await cell.click();
  await page.waitForTimeout(300);
  if ((await page.locator('text=%').count()) < before) problems.push('[flow-wird-click] score cells disappeared');
});
await visit(browser, 'flow-analytics-hover', { section: 'analytics' }, async (page) => {
  const bars = page.locator('[aria-label*=": "][tabindex="0"]');
  const n = await bars.count();
  if (n === 0) problems.push('[flow-analytics-hover] no focusable chart marks');
  else {
    await bars.nth(Math.floor(n / 2)).hover();
    await page.waitForTimeout(200);
  }
});
await visit(browser, 'mobile-analytics', { section: 'analytics', viewport: { width: 390, height: 844 } }, async (page) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 2) problems.push(`[mobile-analytics] horizontal overflow ${overflow}px`);
});
await visit(browser, 'mobile-wird', { section: 'wird', viewport: { width: 390, height: 844 } }, async (page) => {
  const todayVisible = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => /text-clay-soft/.test(b.className) && b.querySelector('span'));
    if (!btn) return 'no today header';
    const r = btn.getBoundingClientRect();
    return r.right > 0 && r.left < window.innerWidth ? 'yes' : `no (${Math.round(r.left)})`;
  });
  if (todayVisible !== 'yes') problems.push(`[mobile-wird] today's column not visible on open: ${todayVisible}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 2) problems.push(`[mobile-wird] horizontal overflow ${overflow}px`);
});

for (const s of ['focus', 'settings', 'todo']) await visit(browser, `mobile-${s}`, { section: s, viewport: { width: 390, height: 844 } });
await visit(browser, 'mobile-english-shadowing', { section: 'vocabulary', englishTab: 'shadowing', viewport: { width: 390, height: 844 } });
await browser.close();
console.log(problems.length ? problems.join('\n') : 'NO PROBLEMS FOUND');

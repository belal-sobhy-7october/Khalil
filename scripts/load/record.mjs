// Opens the real app against the local stack as one seeded user, goes through
// the main pages, and writes every request it sends to the data API: what a
// person's visit costs the server, and the recipe the load test replays.
// It also fails on any request the real PostgREST refuses (a column the app
// asks for that the migrations don't have, a policy that blocks it…).
//
//   VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=<ANON_KEY> npx vite --port 5174
//   node scripts/load/record.mjs http://localhost:5174 [user number, default 10 (a heavy user)]
import fs from 'node:fs';
import { chromium } from 'playwright';
import { userToken } from './jwt.mjs';
import { idOf } from './users.mjs';

const base = process.argv[2] ?? 'http://localhost:5174';
const n = Number(process.argv[3] ?? 10);
const id = idOf(n);
const token = userToken(id);
const exp = Math.floor(Date.now() / 1000) + 3600;
const session = {
  access_token: token, refresh_token: id, token_type: 'bearer', expires_in: 3600, expires_at: exp,
  user: { id, aud: 'authenticated', role: 'authenticated', email: `user${n}@load.test`, app_metadata: { provider: 'email' }, user_metadata: {} },
};

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'ar-EG' });
await context.addInitScript((s) => {
  if (sessionStorage.getItem('seeded')) return;
  sessionStorage.setItem('seeded', '1');
  localStorage.clear();
  localStorage.setItem('sb-localhost-auth-token', JSON.stringify(s));
  localStorage.setItem('khalil-language', 'ar');
}, session);
const page = await context.newPage();

const requests = [];
let step = 'startup';
const problems = [];
page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
page.on('response', async (res) => {
  const url = new URL(res.url());
  if (!url.pathname.startsWith('/rest/v1/') && !url.pathname.startsWith('/auth/v1/')) return;
  const req = res.request();
  if (req.method() === 'OPTIONS') return;
  const body = await res.body().catch(() => Buffer.alloc(0));
  requests.push({ step, method: req.method(), path: url.pathname + url.search, status: res.status(), bytes: body.length, sent: req.postData() ?? null });
  if (res.status() >= 400) problems.push(`${step}: ${req.method()} ${url.pathname}${url.search} → ${res.status()} ${body.toString().slice(0, 200)}`);
});

const settle = () => page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
const open = async (name, fn) => {
  step = name;
  await fn();
  await settle();
  await page.waitForTimeout(800);
};
/** Opens a page from the side menu (opening the menu first when it's closed). */
const go = async (label) => {
  const item = page.getByRole('navigation').getByRole('button', { name: new RegExp(`^${label}`) }).first();
  // The closed menu stays in the page, slid off the screen.
  const box = await item.boundingBox().catch(() => null);
  if (!box || box.x < 0 || box.x + box.width > 1440) {
    await page.getByRole('button', { name: 'تبديل القائمة الجانبية' }).first().click({ timeout: 5000 }).catch(async () => {
      if (process.env.SHOTS) await page.screenshot({ path: `${process.env.SHOTS}/${step}.png` });
    });
  }
  await item.click({ timeout: 5000 }).catch((e) => problems.push(`${step}: menu item ${label} not found (${e.message.split('\n')[0]})`));
};

await open('startup', () => page.goto(base, { waitUntil: 'domcontentloaded' }));
for (const [name, label] of [['languages', 'تعلم اللغات'], ['skills', 'تعلم المهارات'], ['calendar', 'التقويم'], ['analytics', 'التحليلات'], ['settings', 'الإعدادات'], ['todo', 'المهام والعادات']]) {
  await open(name, () => go(label));
}
await open('english', async () => {
  await go('تعلم اللغات');
  await page.getByRole('button', { name: /الإنجليزية|English/ }).first().click();
});

// A few things a person does: tick a task, tick a prayer.
await open('tick-task', async () => {
  await go('المهام والعادات');
  await page.waitForTimeout(1500);
  const box = page.getByRole('button', { name: /علّمها منجزة|Mark as complete|علّمها/ }).first();
  if (await box.isVisible().catch(() => false)) await box.click();
});

await browser.close();

const byStep = {};
for (const r of requests) (byStep[r.step] ??= []).push(r);
console.log(`user ${n} (${id})`);
for (const [s, list] of Object.entries(byStep)) {
  console.log(`\n${s}: ${list.length} requests, ${(list.reduce((t, r) => t + r.bytes, 0) / 1024).toFixed(1)} KB`);
  for (const r of list) console.log(`  ${r.method} ${r.status} ${String(r.bytes).padStart(7)}  ${decodeURIComponent(r.path).slice(0, 150)}`);
}
fs.writeFileSync(new URL('./recorded.json', import.meta.url), JSON.stringify(requests, null, 2));
if (problems.length) {
  console.log(`\n✗ ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('\n✓ every request succeeded');

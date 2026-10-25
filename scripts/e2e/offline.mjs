// End-to-end check that Khalil works with no internet: opens the production
// build once online (the service worker saves it), then stops the server and
// cuts the network, and checks that the app still opens — signed in, even with
// an expired token, and from the login page — and that the Topic Library works.
// It does it on a desktop, a small and a usual phone and a tablet (with touch),
// and checks that each of those screens fits the device.
//
// Usage:
//   VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=fake npx vite build
//   node scripts/e2e/offline.mjs ./e2e-shots [--device "iPhone SE"]...
// (it starts `vite preview` itself; `--device desktop` is the 1280×860 desktop, any other name a
// Playwright device). Screenshots go to <dir>/<device>/. Set CHROMIUM_PATH to use a specific Chromium.
import { chromium, devices } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { SUPA, session, createFakeSupabase } from './fakeSupabase.mjs';
import { buildSeed } from './seed.mjs';
import { screenProblems } from './harness.mjs';

const args = process.argv.slice(2);
const OUT = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--device') ?? './shots';
const chosen = args.flatMap((a, i) => (args[i - 1] === '--device' ? [a] : []));
const DEVICES = chosen.length ? chosen : ['desktop', 'iPhone SE', 'Galaxy S24', 'iPad Mini'];
for (const d of DEVICES) if (d !== 'desktop' && !devices[d]) throw new Error(`Unknown device "${d}" (see Playwright's device list)`);
const PORT = 4179;
const BASE = `http://localhost:${PORT}`;
const problems = [];
let where = '';
const check = (cond, msg) => {
  if (!cond) problems.push(`[${where}] ${msg}`);
  return !!cond;
};

function startServer() {
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe', detached: true });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('preview server did not start')), 20000);
    server.stdout.on('data', (d) => {
      if (String(d).includes(String(PORT))) {
        clearTimeout(timer);
        resolve(server);
      }
    });
    server.on('exit', (code) => reject(new Error(`preview server exited (${code})`)));
  });
}
const stopServer = (server) => {
  try {
    process.kill(-server.pid);
  } catch {
    // already gone
  }
};

const expired = { ...session, expires_at: Math.floor(Date.now() / 1000) - 3600 };

async function run(browser, name) {
  where = name;
  const dir = `${OUT}/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  fs.mkdirSync(dir, { recursive: true });
  let server = await startServer();
  const { defaultBrowserType: _engine, ...device } = devices[name] ?? { viewport: { width: 1280, height: 860 } };
  const context = await browser.newContext({ ...device, locale: 'ar-EG' });
  // A finger taps; a mouse clicks.
  const press = (locator) => (device.hasTouch ? locator.tap() : locator.click());
  // The whole screen fits the device: nothing wider than it, no untranslated keys.
  const fits = async (screen) => {
    for (const p of await screenProblems(page)) check(false, `${screen}: ${p}`);
  };
  let networkUp = true;
  const backend = createFakeSupabase(buildSeed());
  const supabaseReads = [];
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (!networkUp) return route.abort('internetdisconnected');
    if (url.origin === BASE) return route.continue();
    if (url.origin === SUPA) {
      supabaseReads.push(url.pathname);
      return backend.handle(route);
    }
    return route.abort();
  });
  await context.addInitScript((s) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('sb-localhost-auth-token', JSON.stringify(s));
    sessionStorage.setItem('khalil-active-section', 'vocabulary');
    localStorage.setItem('khalil-language', 'ar');
  }, session);
  const page = await context.newPage();
  try {
    page.on('pageerror', (e) => problems.push(`[${name}] pageerror: ${e.message}`));

    // 1. Online: the app opens and the service worker saves every file.
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => navigator.serviceWorker?.controller, null, { timeout: 20000 }).catch(() => {});
    const saved = await page.evaluate(async () => {
      const keys = await caches.keys();
      const app = keys.find((k) => k.startsWith('khalil-app-'));
      return app ? (await (await caches.open(app)).keys()).map((r) => new URL(r.url).pathname) : [];
    });
    check(saved.includes('/'), `service worker did not save the page (saved: ${saved.length} files)`);
    check(saved.some((p) => /EnglishHub-.*\.js$/.test(p)), 'service worker did not save the English section');
    check(saved.some((p) => /TopicLibraryModal-.*\.js$/.test(p) || /EnglishHub-.*\.js$/.test(p)), 'topic library chunk not saved');

    // 2. No server and no network: the app still opens, signed in.
    stopServer(server);
    networkUp = false;
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    check(!(await page.getByText('تسجيل الدخول بـ Google').count()), 'offline: login page shown instead of the app');
    check(await page.getByText('لا يوجد اتصال بالإنترنت').first().isVisible().catch(() => false), 'offline: no offline banner');
    await fits('offline');
    await page.screenshot({ path: `${dir}/offline-app.png`, fullPage: true });

    // 3. The Topic Library opens and a lesson shows its words.
    await press(page.getByRole('button', { name: 'ذاكر المواضيع' }).first());
    await page.waitForTimeout(800);
    const packCards = page.locator('[role="dialog"] button[dir="ltr"]');
    check((await packCards.count()) >= 20, `offline: topic library shows ${await packCards.count()} topics`);
    await fits('offline topic library');
    await press(packCards.first());
    await page.waitForTimeout(300);
    check(await page.getByText('الكلمات المفتاحية').first().isVisible().catch(() => false), 'offline: lesson did not open');
    await fits('offline lesson');
    await press(page.getByRole('button', { name: 'علّمه مذاكَرًا' }));
    check(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('khalil-studied-topics') ?? '{}')).length === 1), 'offline: studied mark not saved');
    await page.screenshot({ path: `${dir}/offline-lesson.png` });

    // 4. An expired token offline still opens the app quickly (no 30s wait, no login page).
    await page.evaluate((s) => localStorage.setItem('sb-localhost-auth-token', JSON.stringify(s)), expired);
    const t0 = Date.now();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByText('لا يوجد اتصال بالإنترنت').first().waitFor({ timeout: 8000 }).catch(() => {});
    check(Date.now() - t0 < 8000, `offline + expired token: took ${Date.now() - t0}ms to open`);
    check(!(await page.getByText('تسجيل الدخول بـ Google').count()), 'offline + expired token: login page shown');

    // 5. Back online: the saved session is refreshed and the data loads.
    const before = supabaseReads.length;
    server = await startServer();
    networkUp = true;
    await context.setOffline(false);
    await page.waitForFunction(() => !document.body.innerText.includes('لا يوجد اتصال بالإنترنت'), null, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2500);
    check(!(await page.getByText('لا يوجد اتصال بالإنترنت').count()), 'back online: offline banner still shown');
    check(supabaseReads.slice(before).some((p) => p.endsWith('/vocabulary_items')), 'back online: the data was not loaded');
    await fits('back online');
    await page.screenshot({ path: `${dir}/offline-back-online.png`, fullPage: true });

    // 6. Never signed in on this device, offline: the login page offers the topics.
    stopServer(server);
    networkUp = false;
    await context.setOffline(true);
    await page.evaluate(() => localStorage.removeItem('sb-localhost-auth-token'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    check(await page.getByText('تسجيل الدخول بـ Google').count(), 'offline, signed out: login page not shown');
    await press(page.getByRole('button', { name: 'ذاكر المواضيع' }));
    await page.waitForTimeout(600);
    check((await packCards.count()) >= 20, 'offline, signed out: topic library did not open');
    check(!(await page.getByText('أضف إلى').count()), 'offline, signed out: add-to-list controls shown');
    await page.screenshot({ path: `${dir}/offline-login-topics.png` });
  } finally {
    // A run that stopped half-way mustn't leave the server holding the port for the next device.
    stopServer(server);
    await context.close();
    await new Promise((r) => setTimeout(r, 1000)); // let the port go
  }
}

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const name of DEVICES) {
  try {
    await run(browser, name);
  } catch (e) {
    problems.push(`[${name}] crashed: ${e.stack ?? e}`);
  }
  console.log(`${name}: done`);
}
await browser.close();
if (problems.length) {
  console.log(`✗ ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('✓ offline checks passed');
process.exit(0);

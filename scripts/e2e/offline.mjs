// End-to-end check that Khalil works with no internet: opens the production
// build once online (the service worker saves it), then stops the server and
// cuts the network, and checks that the app still opens — signed in, even with
// an expired token, and from the login page — and that the Topic Library works,
// including 🔊 with a topic's voice saved on the device.
//
// Usage:
//   VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=fake npx vite build
//   node scripts/e2e/offline.mjs ./e2e-shots
// (it starts `vite preview` itself). Set CHROMIUM_PATH to use a specific Chromium.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { SUPA, session, createFakeSupabase } from './fakeSupabase.mjs';
import { buildSeed } from './seed.mjs';

const OUT = process.argv[2] ?? './shots';
const PORT = 4179;
const BASE = `http://localhost:${PORT}`;
fs.mkdirSync(OUT, { recursive: true });
const problems = [];
const check = (cond, msg) => {
  if (!cond) problems.push(msg);
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

const DICT = 'https://api.dictionaryapi.dev';
const expired = { ...session, expires_at: Math.floor(Date.now() / 1000) - 3600 };

async function run() {
  let server = await startServer();
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const context = await browser.newContext({ viewport: { width: 1280, height: 860 }, locale: 'ar-EG' });
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
    // The free dictionary: every word has a US recording.
    if (url.origin === DICT && url.pathname.startsWith('/api/')) {
      const word = decodeURIComponent(url.pathname.split('/').pop());
      const audio = `${DICT}/media/pronunciations/en/${word}-us.mp3`;
      const body = [{ phonetics: [{ audio }], meanings: [{ partOfSpeech: 'verb', definitions: [{ definition: 'x', example: 'y' }] }] }];
      return route.fulfill({ json: body, headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.origin === DICT) return route.fulfill({ body: 'mp3', contentType: 'audio/mpeg', headers: { 'access-control-allow-origin': '*' } });
    return route.abort();
  });
  await context.addInitScript((s) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('sb-localhost-auth-token', JSON.stringify(s));
    localStorage.setItem('khalil-active-section', 'vocabulary');
    localStorage.setItem('khalil-language', 'ar');
  }, session);
  // Record what 🔊 plays (the fake recordings aren't real audio).
  await context.addInitScript(() => {
    window.__played = [];
    HTMLMediaElement.prototype.play = function () {
      window.__played.push(this.src);
      return Promise.resolve();
    };
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));

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
  check(await page.getByText('مفيش نت').first().isVisible().catch(() => false), 'offline: no offline banner');
  await page.screenshot({ path: `${OUT}/offline-app.png`, fullPage: true });

  // 3. The Topic Library opens and a lesson shows its words.
  await page.getByRole('button', { name: 'ذاكر المواضيع' }).first().click();
  await page.waitForTimeout(800);
  const packCards = page.locator('[role="dialog"] button[dir="ltr"]');
  check((await packCards.count()) >= 20, `offline: topic library shows ${await packCards.count()} topics`);
  await packCards.first().click();
  await page.waitForTimeout(300);
  check(await page.getByText('الكلمات المفتاحية').first().isVisible().catch(() => false), 'offline: lesson did not open');
  await page.getByRole('button', { name: 'علّم إنك ذاكرته' }).click();
  check(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('khalil-studied-topics') ?? '{}')).length === 1), 'offline: studied mark not saved');
  check(await page.getByText('مفيش نت: 🔊').first().isVisible().catch(() => false), 'offline: lesson does not say 🔊 uses the device voice');
  await page.screenshot({ path: `${OUT}/offline-lesson.png` });

  // 4. An expired token offline still opens the app quickly (no 30s wait, no login page).
  await page.evaluate((s) => localStorage.setItem('sb-localhost-auth-token', JSON.stringify(s)), expired);
  const t0 = Date.now();
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByText('مفيش نت').first().waitFor({ timeout: 8000 }).catch(() => {});
  check(Date.now() - t0 < 8000, `offline + expired token: took ${Date.now() - t0}ms to open`);
  check(!(await page.getByText('تسجيل الدخول بـ Google').count()), 'offline + expired token: login page shown');

  // 5. Back online: the saved session is refreshed and the data loads.
  const before = supabaseReads.length;
  server = await startServer();
  networkUp = true;
  await context.setOffline(false);
  await page.waitForFunction(() => !document.body.innerText.includes('مفيش نت'), null, { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(2500);
  check(!(await page.getByText('مفيش نت').count()), 'back online: offline banner still shown');
  check(supabaseReads.slice(before).some((p) => p.endsWith('/vocabulary_items')), 'back online: the data was not loaded');
  await page.screenshot({ path: `${OUT}/offline-back-online.png`, fullPage: true });

  // 5b. Online, save a topic's voice; offline, 🔊 plays the saved recording.
  await page.getByRole('button', { name: 'مكتبة المواضيع' }).first().click();
  await page.waitForTimeout(600);
  await packCards.first().click();
  await page.getByRole('button', { name: 'احفظ الصوت للاستخدام من غير نت' }).click();
  const voiceSaved = await page.getByText('الصوت متحفظ على الجهاز').first().waitFor({ timeout: 15000 }).then(() => true, () => false);
  check(voiceSaved, 'voice: saving the topic voice did not finish');
  await page.screenshot({ path: `${OUT}/voice-saved.png` });
  networkUp = false;
  await context.setOffline(true);
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'نطق: patience' }).click();
  await page.waitForTimeout(500);
  const played = await page.evaluate(() => window.__played);
  check(played.length === 1 && played[0].startsWith('blob:'), `voice: offline 🔊 did not play the saved recording (${JSON.stringify(played)})`);
  await page.keyboard.press('Escape');
  await context.setOffline(false);
  networkUp = true;

  // 6. Never signed in on this device, offline: the login page offers the topics.
  stopServer(server);
  networkUp = false;
  await context.setOffline(true);
  await page.evaluate(() => localStorage.removeItem('sb-localhost-auth-token'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  check(await page.getByText('تسجيل الدخول بـ Google').count(), 'offline, signed out: login page not shown');
  await page.getByRole('button', { name: 'ذاكر المواضيع' }).click();
  await page.waitForTimeout(600);
  check((await packCards.count()) >= 20, 'offline, signed out: topic library did not open');
  check(!(await page.getByText('أضف إلى').count()), 'offline, signed out: add-to-list controls shown');
  await page.screenshot({ path: `${OUT}/offline-login-topics.png` });

  await browser.close();
}

try {
  await run();
} catch (e) {
  problems.push(`crashed: ${e.stack ?? e}`);
}
if (problems.length) {
  console.log(`✗ ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('✓ offline checks passed');
process.exit(0);

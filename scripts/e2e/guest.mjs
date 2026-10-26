// End-to-end check of opening Khalil without an account (src/lib/guest.ts):
// a visitor gets a guest account and the app at once, with "Create account" and
// "Sign in" in the header and Khalil's tour (skip a part, skip it all); after
// their first change Khalil asks them to create an account, which links Google
// to that same guest account. Also: search engines get the welcome page, no
// guest account (switched off) means browsing with nothing saved, a Google
// account that already has a Khalil account opens "sign in to it", and the
// tasks page's focus shortcut starts the timer. Desktop and a small phone.
//
// Usage: same dev server as smoke.mjs, then
//   node scripts/e2e/guest.mjs http://localhost:5173 ./e2e-shots
import { chromium, devices } from 'playwright';
import fs from 'node:fs';
import { SUPA, guestSession, createFakeSupabase } from './fakeSupabase.mjs';
import { screenProblems } from './harness.mjs';

const BASE = process.argv[2] ?? 'http://localhost:5173';
const OUT = process.argv[3] ?? './shots';
fs.mkdirSync(OUT, { recursive: true });
const problems = [];
const GOOGLEBOT = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

/** A visitor's first visit: nothing in the browser. `local` is put in localStorage first. */
async function visit(name, { device, userAgent, anonymous = true, local = {}, hash = '' } = {}) {
  const { defaultBrowserType: _engine, ...descriptor } = device ?? { viewport: { width: 1366, height: 860 } };
  const context = await browser.newContext({ ...descriptor, ...(userAgent ? { userAgent } : {}), locale: 'ar-EG' });
  await context.addInitScript((local) => {
    if (window.top !== window || sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('khalil-language', 'ar');
    for (const [k, v] of Object.entries(local)) localStorage.setItem(k, v);
  }, local);
  const backend = createFakeSupabase({}, { anonymous });
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === new URL(BASE).origin) return route.continue();
    if (url.origin === SUPA) return backend.handle(route);
    return route.abort();
  });
  const page = await context.newPage();
  page.on('pageerror', (e) => problems.push(`[${name}] pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|net::/.test(m.text())) problems.push(`[${name}] console: ${m.text().slice(0, 300)}`);
  });
  await page.goto(`${BASE}/${hash}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1800);
  const check = (cond, msg) => {
    if (!cond) problems.push(`[${name}] ${msg}`);
    return !!cond;
  };
  const fits = async (screen) => {
    for (const p of await screenProblems(page)) check(false, `${screen}: ${p}`);
  };
  return { page, context, backend, check, fits };
}

const visible = (locator) => locator.first().isVisible().catch(() => false);

// 1. A new visitor: a guest account, the app, the account buttons and the tour.
for (const [label, device] of [['desktop', undefined], ['iphone-se', devices['iPhone SE']]]) {
  const name = `guest-${label}`;
  // The tour waits for Khalil's pictures; this browser asks to try it (lib/guide.ts).
  const { page, context, backend, check, fits } = await visit(name, { device, local: { 'khalil-guide-preview': '1' } });
  const press = (locator) => (device?.hasTouch ? locator.first().tap() : locator.first().click());
  try {
    check(backend.auth.some((a) => a.kind === 'signup'), 'no guest account was made');
    check(!(await page.getByText('تسجيل الدخول بـ Google').count()), 'the welcome page instead of the app');
    check(await visible(page.getByRole('button', { name: 'إنشاء حساب' })), 'no "Create account" button');
    if (!device) check(await visible(page.getByRole('button', { name: 'تسجيل الدخول' })), 'no "Sign in" button');
    const tour = page.getByTestId('guide-tour');
    check(await visible(tour), 'the tour did not open');
    check(await visible(tour.getByText('مرحبًا، أنا خليل')), 'the tour does not start with the greeting');
    await fits('tour');
    await page.screenshot({ path: `${OUT}/${name}-tour.png` });
    await press(tour.getByRole('button', { name: 'التالي' }));
    await page.waitForTimeout(700);
    check(await visible(tour.getByText('أولوية واحدة كل يوم')), 'Next did not go to the second step');
    await page.screenshot({ path: `${OUT}/${name}-tour-step.png` });
    await press(tour.getByRole('button', { name: 'تخطَّ هذا الجزء' }));
    await page.waitForTimeout(900);
    check(await visible(tour.getByText('تعلّم اللغات')), '"Skip this part" did not go to the learning part');
    await press(tour.getByRole('button', { name: 'تخطَّ الجولة' }));
    await page.waitForTimeout(500);
    check(!(await visible(tour)), '"Skip the tour" did not close it');
    check(await page.evaluate(() => localStorage.getItem('khalil-guide-done') === '1'), 'the tour was not marked as seen');

    // 2. The focus shortcut on the tasks page.
    await press(page.locator('[data-guide="menu"]'));
    await page.waitForTimeout(400);
    await press(page.locator('aside').getByRole('button', { name: 'المهام والعادات' }));
    await page.waitForTimeout(600);
    await press(page.getByRole('button', { name: /ابدأ جلسة تركيز مدتها 25 دقيقة/ }));
    await page.waitForTimeout(1200);
    check(await visible(page.locator('[data-guide="quick-focus"]:visible').getByText(/تركيز · /)), 'the focus shortcut did not start the timer');
    check(await page.evaluate(() => JSON.parse(localStorage.getItem('khalil-pomodoro-run') ?? '{}').status === 'running'), 'the timer is not running');
    await page.screenshot({ path: `${OUT}/${name}-quick-focus.png` });
    await press(page.locator('[data-guide="quick-focus"]:visible').getByRole('button').first());

    // 3. The first change: Khalil asks to create an account; it links Google to the guest account.
    const input = page.locator('input[placeholder*="أضف مهمة لليوم"]').first();
    await input.fill('مهمة الضيف');
    await input.press('Enter');
    await page.waitForTimeout(2200);
    check(backend.log.some((e) => e.table === 'todos' && e.method === 'POST'), "the guest's task was not saved");
    const prompt = page.getByTestId('guest-save-prompt');
    check(await visible(prompt), 'no "keep what you did" prompt after the first change');
    await fits('save prompt');
    await page.screenshot({ path: `${OUT}/${name}-save-prompt.png` });
    await press(prompt.getByRole('button', { name: 'إنشاء حساب' }));
    await page.waitForTimeout(400);
    const dialog = page.getByRole('dialog', { name: 'أنشئ حسابك في خليل' });
    check(await visible(dialog), 'the create-account dialog did not open');
    await fits('create account');
    await page.screenshot({ path: `${OUT}/${name}-signup.png` });
    await press(dialog.getByRole('button', { name: 'المتابعة بحساب Google' }));
    await page.waitForTimeout(1500);
    check(backend.auth.some((a) => a.kind === 'link' && a.provider === 'google' && a.guest), 'Google was not linked to the guest account');
    check(!backend.auth.some((a) => a.kind === 'oauth'), 'it signed in instead of linking');
  } catch (e) {
    problems.push(`[${name}] threw: ${String(e.message ?? e).split('\n')[0]}`);
  }
  await context.close();
}

// 4. A guest coming back: the same account, no new one, and the tour doesn't open again.
{
  const name = 'guest-returns';
  const { page, context, backend, check } = await visit(name, {
    local: { 'sb-localhost-auth-token': JSON.stringify(guestSession), 'khalil-guide-done': '1', 'khalil-local-owner': guestSession.user.id },
  });
  check(!backend.auth.some((a) => a.kind === 'signup'), 'a second guest account was made');
  check(!(await visible(page.getByTestId('guide-tour'))), 'the tour opened again');
  check(await visible(page.getByRole('button', { name: 'إنشاء حساب' })), 'no "Create account" button');
  // "Sign in" opens an existing account (and says the guest's things won't move).
  await page.getByRole('button', { name: 'تسجيل الدخول' }).first().click();
  const dialog = page.getByRole('dialog', { name: 'سجّل الدخول إلى حسابك' });
  check(await visible(dialog), 'the sign-in dialog did not open');
  check(await visible(dialog.getByText('لا ينتقل إلى ذلك الحساب')), 'the sign-in dialog does not warn the guest');
  await dialog.getByRole('button', { name: 'المتابعة بحساب Google' }).click();
  await page.waitForTimeout(1500);
  check(backend.auth.some((a) => a.kind === 'oauth' && a.provider === 'google'), 'sign-in did not go to Google');
  await context.close();
}

// 5. Back from Google with an account that already has Khalil: "sign in to it".
{
  const name = 'guest-identity-exists';
  const { page, context, check } = await visit(name, {
    local: { 'sb-localhost-auth-token': JSON.stringify(guestSession), 'khalil-guide-done': '1', 'khalil-local-owner': guestSession.user.id },
    hash: '#error=server_error&error_code=identity_already_exists&error_description=Identity+is+already+linked+to+another+user',
  });
  check(await visible(page.getByRole('dialog', { name: 'حساب Google هذا له حساب في خليل من قبل' })), 'no "this Google account already has an account" dialog');
  check(!page.url().includes('error'), `the error stayed in the address: ${page.url()}`);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await context.close();
}

// 6. Search engines get the welcome page, and no guest account is made for them.
{
  const name = 'guest-crawler';
  const { page, context, backend, check } = await visit(name, { userAgent: GOOGLEBOT });
  check(await visible(page.getByText('تسجيل الدخول بـ Google')), 'a crawler did not get the welcome page');
  check(!(await page.getByText('ذاكر المواضيع').count()), 'the welcome page still has "Study topics"');
  check(!backend.auth.some((a) => a.kind === 'signup'), 'a guest account was made for a crawler');
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await context.close();
}

// 7. Anonymous sign-ins switched off: the visitor browses, and is told nothing is saved.
{
  const name = 'guest-browsing';
  const { page, context, check, fits } = await visit(name, { anonymous: false, local: { 'khalil-guide-done': '1' } });
  check(!(await page.getByText('تسجيل الدخول بـ Google').count()), 'the welcome page instead of browsing');
  check(await visible(page.getByTestId('guest-browse-banner')), 'no "browsing as a guest" banner');
  await fits('browsing');
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  // Adding a task can't be saved: Khalil asks to create an account instead of doing nothing.
  const input = page.locator('input[placeholder*="أضف مهمة لليوم"]').first();
  await input.fill('مهمة');
  await input.press('Enter');
  await page.waitForTimeout(500);
  check(await visible(page.getByRole('dialog', { name: 'أنشئ حسابك في خليل' })), 'adding a task with no account did not ask to create one');
  await context.close();
}

// 8. Before Khalil's pictures are in, a new guest gets no tour, and it isn't offered in the menu.
const picturesIn = (() => {
  try {
    return fs.readdirSync(new URL('../../src/assets/mascot/', import.meta.url)).some((f) => f.endsWith('.webp'));
  } catch {
    return false; // no folder yet
  }
})();
if (!picturesIn) {
  const name = 'guest-no-pictures';
  const { page, context, check } = await visit(name);
  await page.waitForTimeout(800);
  check(!(await visible(page.getByTestId('guide-tour'))), 'the tour opened before its pictures are in');
  await page.locator('[data-guide="menu"]').click();
  await page.waitForTimeout(400);
  check(!(await page.getByRole('button', { name: 'جولة مع خليل' }).count()), 'the menu offers the tour before its pictures are in');
  await context.close();
}

await browser.close();
if (problems.length) {
  console.log(`✗ ${problems.length} problem(s):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('✓ guest checks passed');

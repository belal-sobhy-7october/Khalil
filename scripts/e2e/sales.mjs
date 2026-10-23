// End-to-end check of Sales Prep: opens every tab (Arabic/English app,
// light/dark, desktop/phone, and a Level 3 day in English), then does real
// work in it (ticks a task, writes a notebook line, answers a listening
// question) and checks it's all still there after a reload with the device
// copy wiped, so it must come back from the account.
//
// Usage:
//   VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=fake npx vite --port 5173
//   node scripts/e2e/sales.mjs http://localhost:5173 ./e2e-shots
import { chromium } from 'playwright';
import fs from 'node:fs';
import { openApp, checkScreen, problems } from './harness.mjs';

const BASE = process.argv[2] ?? 'http://localhost:5173';
const OUT = process.argv[3] ?? './shots';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const phone = { width: 390, height: 844 };
const TABS = ['today', 'knowledge', 'roadmap', 'notebook', 'library', 'extra'];
const HEADING = 'تعلّم السيلز';

/** Marks every task up to (and including) a day as done on the device, read from the dev server's plan, and reloads. */
async function doneThrough(page, dayId) {
  await page.evaluate(async (id) => {
    const { PLAN_DAYS } = await import('/src/data/sales/plan.ts');
    const end = PLAN_DAYS.findIndex((d) => d.day.id === id);
    const date = new Date().toISOString().slice(0, 10);
    const log = Object.fromEntries(PLAN_DAYS.slice(0, end + 1).flatMap(({ day }) => day.tasks.map((t) => [t.id, date])));
    localStorage.setItem('khalil-kv:sales-tasks', JSON.stringify(log));
  }, dayId);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: HEADING }).waitFor({ timeout: 15000 });
  await page.waitForTimeout(500);
}

// 1. Every tab opens cleanly.
for (const tab of TABS) {
  for (const [name, opts] of [
    [`sales-ar-light-${tab}`, { language: 'ar', theme: 'light' }],
    [`sales-en-dark-phone-${tab}`, { language: 'en', theme: 'dark', viewport: phone }],
  ]) {
    const { page, context } = await openApp(browser, BASE, name, { section: 'sales', ...opts, local: { 'khalil-sales-tab': tab } });
    if (!(await page.getByRole('heading', { name: HEADING }).count())) problems.push(`[${name}] section did not open`);
    await checkScreen(page, name);
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    await context.close();
  }
}

// A Level 1 day and a Level 3 (English) day, with a task open.
for (const [name, dayId, opts] of [
  ['sales-day-s1-roleplay', 'S1-W1-D1', { theme: 'light' }],
  ['sales-day-s2-marketing', 'S1-EXAM', { theme: 'light', viewport: phone }],
  ['sales-day-s3-english', 'S2-EXAM', { theme: 'dark', viewport: phone }],
]) {
  const { page, context } = await openApp(browser, BASE, name, { section: 'sales', language: 'ar', ...opts });
  await page.getByRole('heading', { name: HEADING }).waitFor({ timeout: 15000 });
  await doneThrough(page, dayId);
  await page.locator('[aria-expanded]').filter({ hasText: /فصل معرفة|sales words/ }).first().click().catch(() => {});
  await checkScreen(page, name);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await context.close();
}

async function flow(name, opts, body) {
  const app = await openApp(browser, BASE, name, { section: 'sales', language: 'ar', ...opts });
  const check = (cond, msg) => cond || problems.push(`[${name}] ${msg}`);
  const reload = async () => {
    await app.page.evaluate(() => {
      for (const k of Object.keys(localStorage)) if (k.startsWith('khalil-kv:sales')) localStorage.removeItem(k);
    });
    await app.page.reload({ waitUntil: 'domcontentloaded' });
    await app.page.getByRole('heading', { name: HEADING }).waitFor({ timeout: 15000 });
    await app.page.waitForTimeout(800);
  };
  try {
    await app.page.getByRole('heading', { name: HEADING }).waitFor({ timeout: 15000 });
    await body({ ...app, check, reload });
  } catch (e) {
    problems.push(`[${name}] ${e.message.split('\n')[0]}`);
  }
  await app.page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await app.context.close();
}

// 2. A ticked task and a notebook line are kept, from the account.
await flow('sales-flow-tick-and-note', {}, async ({ page, check, reload }) => {
  await page.getByRole('button', { name: 'علّم إنها خلصت' }).nth(1).click();
  await page.getByText('دفترك: سطرين عن النهارده').click();
  const box = page.getByLabel(/ليه عاوز تتعلم سيلز/);
  await box.fill('عاوز أبدأ تيلي سيلز وبعدين SDR');
  await box.blur();
  await page.waitForTimeout(600);
  await reload();
  check((await page.getByRole('button', { name: 'علّم إنها مخلصتش' }).count()) === 2, 'ticked tasks lost after reload');
  await page.getByRole('tab', { name: 'الدفتر والتقدم' }).click();
  check(await page.getByText('عاوز أبدأ تيلي سيلز وبعدين SDR').count(), 'notebook line lost after reload');
});

// 3. A knowledge chapter, once read, is kept.
await flow('sales-flow-knowledge', {}, async ({ page, check, reload }) => {
  await page.getByRole('tab', { name: 'المعرفة' }).click();
  await page.getByRole('button', { name: /البيع تبادل قيمة/ }).click();
  await page.getByRole('button', { name: /خلصت الفصل/ }).click();
  await page.waitForTimeout(600);
  await reload();
  await page.getByRole('tab', { name: 'المعرفة' }).click();
  check(await page.getByRole('heading', { name: 'السيلز بجد' }).locator('..').getByText('1 / 7').count(), 'read chapter lost after reload');
});

// 4. An answer to a listening question is kept.
await flow('sales-flow-listen-note', {}, async ({ page, check, reload }) => {
  await doneThrough(page, 'S0-D1');
  await page.getByText('السيلز هو واحد مبيبعش! كل ما تريد معرفته عن مجال المبيعات').click();
  const box = page.getByLabel('قال إيه عن الفرق بين السيلز والتسويق؟');
  await box.fill('السيلز بيقفل، والتسويق بيجيب العملاء');
  await box.blur();
  await page.waitForTimeout(600);
  await reload();
  await page.getByRole('tab', { name: 'الدفتر والتقدم' }).click();
  check(await page.getByText('السيلز بيقفل، والتسويق بيجيب العملاء').count(), 'listening answer lost after reload');
});

await browser.close();
if (problems.length) {
  console.log(problems.join('\n'));
  process.exit(1);
}
console.log('NO PROBLEMS FOUND');

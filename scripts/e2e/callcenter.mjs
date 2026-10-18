// End-to-end check of Call Center Prep: opens every tab (Arabic/English,
// light/dark, desktop/phone), then does real work in it (ticks a task, leaves
// a test, a grammar exercise and an interview answer half-done, adds a vocab
// unit to the flashcards) and checks it's all still there after a reload —
// also with the device copy wiped, so it must come back from the account.
//
// Usage (the section is owner-only, so the dev server needs the preview flag):
//   VITE_CALL_CENTER_PREVIEW=1 VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=fake npx vite --port 5173
//   node scripts/e2e/callcenter.mjs http://localhost:5173 ./e2e-shots
import { chromium } from 'playwright';
import fs from 'node:fs';
import { openApp, checkScreen, problems } from './harness.mjs';

const BASE = process.argv[2] ?? 'http://localhost:5173';
const OUT = process.argv[3] ?? './shots';
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const phone = { width: 390, height: 844 };
const TABS = ['today', 'roadmap', 'vocab', 'interview', 'voice', 'tests', 'tracker', 'library', 'toolkit', 'accent'];
const today = new Date().toISOString().slice(0, 10);
const diagnosticDone = JSON.stringify({ 'L0-D1:voice:intro': today, 'L0-D1:test:L0-DIAG': today, 'L0-D1:link:efset': today });

// 1. Every tab opens cleanly.
for (const tab of TABS) {
  for (const [name, opts] of [
    [`cc-en-light-${tab}`, { language: 'en', theme: 'light' }],
    [`cc-ar-dark-phone-${tab}`, { language: 'ar', theme: 'dark', viewport: phone }],
  ]) {
    const { page, context } = await openApp(browser, BASE, name, { section: 'callcenter', ...opts, local: { 'khalil-cc-tab': tab } });
    if (!(await page.getByRole('heading', { name: 'Call Center English Prep' }).count())) problems.push(`[${name}] section did not open`);
    await checkScreen(page, name);
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    await context.close();
  }
}

async function flow(name, opts, body) {
  const app = await openApp(browser, BASE, name, { section: 'callcenter', language: 'en', ...opts });
  const check = (cond, msg) => cond || problems.push(`[${name}] ${msg}`);
  // Reload; with `fromAccount`, wipe the device copy first so the values must come from the backend
  // (all of the section's values, or only the keys named).
  const reload = async (fromAccount = false) => {
    if (fromAccount) {
      const keys = Array.isArray(fromAccount) ? fromAccount.map((k) => `khalil-kv:${k}`) : null;
      await app.page.evaluate((only) => {
        for (const k of Object.keys(localStorage)) if (only ? only.includes(k) : k.startsWith('khalil-kv:callcenter')) localStorage.removeItem(k);
      }, keys);
    }
    await app.page.reload({ waitUntil: 'domcontentloaded' });
    await app.page.getByRole('heading', { name: 'Call Center English Prep' }).waitFor({ timeout: 15000 });
    await app.page.waitForTimeout(800);
  };
  try {
    await body({ ...app, check, reload });
  } catch (e) {
    problems.push(`[${name}] ${e.message.split('\n')[0]}`);
  }
  await app.page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await app.context.close();
}

// 2. Ticking a task is kept.
await flow('cc-flow-tick', {}, async ({ page, check, reload }) => {
  await page.getByRole('button', { name: 'Mark as done' }).first().click();
  await page.waitForTimeout(500);
  await reload(true);
  check((await page.getByRole('button', { name: 'Mark as not done' }).count()) === 1, 'ticked task lost after reload');
});

// 3. A test left in the middle resumes at the same question.
await flow('cc-flow-test', { local: { 'khalil-cc-tab': 'tests' } }, async ({ page, check, reload }) => {
  await page.locator('li', { hasText: 'Diagnostic test (where you start)' }).getByRole('button', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'goes', exact: true }).click();
  await page.getByRole('button', { name: /^Next/ }).click();
  await page.getByRole('button', { name: 'sent', exact: true }).click();
  await page.waitForTimeout(500);
  await reload(true);
  await page.getByRole('tab', { name: 'Tests' }).click();
  const resume = page.locator('li', { hasText: 'Diagnostic test (where you start)' }).getByRole('button', { name: /Continue \(2\// });
  check(await resume.count(), 'no "Continue" on the half-done test');
  if (await resume.count()) {
    await resume.click();
    check(await page.getByText('I ___ the email yesterday.').count(), 'did not resume at question 2');
    check(await page.getByRole('button', { name: /^Next/ }).isEnabled(), 'the answer to question 2 was lost');
  }
});

// 4. A half-done grammar exercise and an interview answer are kept.
await flow('cc-flow-grammar', { local: { 'khalil-kv:callcenter-tasks': diagnosticDone } }, async ({ page, check, reload }) => {
  await page.getByRole('button', { name: /Present simple vs present continuous/ }).click();
  await page.getByRole('button', { name: 'live', exact: true }).first().click();
  await page.waitForTimeout(500);
  // The finished diagnostic was only seeded on the device; the answer must come back from the account.
  await reload(['callcenter-progress']);
  await page.getByRole('button', { name: /Present simple vs present continuous/ }).click();
  check(await page.getByText('1 / 8 right').count(), 'grammar answer lost after reload');
});

await flow('cc-flow-answer', { local: { 'khalil-cc-tab': 'interview' } }, async ({ page, check, reload }) => {
  await page.getByRole('button', { name: /Tell me about yourself\./ }).click();
  await page.getByLabel(/Your own answer/).fill("I'm a software developer from Cairo.");
  await page.waitForTimeout(1500);
  await reload(true);
  await page.getByRole('button', { name: /Tell me about yourself\./ }).click();
  check((await page.getByLabel(/Your own answer/).inputValue()) === "I'm a software developer from Cairo.", 'interview answer lost after reload');
});

// 5. A vocab unit goes into the flashcards, and YouGlish words heard are kept.
await flow('cc-flow-vocab', { local: { 'khalil-cc-tab': 'vocab' } }, async ({ page, backend, check, reload }) => {
  await page.getByRole('button', { name: /Call center basics/ }).click();
  await page.getByRole('button', { name: /Add the 16 words/ }).click();
  await page.getByRole('button', { name: /Practice them now/ }).waitFor({ timeout: 8000 });
  await page.getByRole('button', { name: 'Hear "queue" on YouGlish' }).click();
  await page.waitForTimeout(400);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const rows = backend.tables.vocabulary_items ?? [];
  check(rows.filter((r) => /^(agent|queue|headset)$/i.test(r.word)).length === 3, 'words not saved to the flashcards');
  await reload(true);
  await page.getByRole('button', { name: /Call center basics/ }).click();
  check(await page.getByText('16 in flashcards').count(), 'unit words not in the flashcards after reload');
  check(await page.getByText('YouGlish: 1 / 16').count(), 'YouGlish word heard lost after reload');
  check(await page.getByText('Day 1 of 30').count(), 'the month did not start');
  // The Vocabulary section's tools: flag a word hard, and the unit challenge with the unit's text.
  await page.getByRole('button', { name: 'Mark "queue" as hard' }).click();
  await page.waitForTimeout(500);
  check(await page.getByRole('button', { name: '"queue" is marked hard: unmark it' }).count(), 'could not flag a word hard');
  await page.getByRole('button', { name: /Start the challenge/ }).click();
  await page.getByRole('tab', { name: /Listen & repeat/ }).click();
  check(await page.getByRole('dialog').getByText(/I work as an agent on the floor/).count(), 'the challenge does not practice the unit text');
  await page.screenshot({ path: `${OUT}/cc-flow-vocab-challenge.png`, fullPage: true });
  await page.keyboard.press('Escape');
});

// 6. A word met while studying, saved with "New word", lands in My words and the daily review.
await flow('cc-flow-my-word', { local: { 'khalil-cc-tab': 'vocab' } }, async ({ page, backend, check, reload }) => {
  await page.getByRole('button', { name: 'Add words' }).click();
  await page.getByRole('dialog').locator('textarea').fill('troubleshooter');
  await page.getByRole('button', { name: /^Continue/ }).click();
  await page.getByRole('button', { name: 'Add 1 word' }).click();
  await page.waitForTimeout(800);
  check((backend.tables.vocabulary_items ?? []).some((r) => r.word === 'troubleshooter'), 'the word was not saved to the flashcards');
  await page.keyboard.press('Escape');
  await reload(true);
  check(await page.getByText('troubleshooter', { exact: true }).count(), 'the word is not in My words after reload');
  check(await page.getByText(/1 of your own/).count(), 'the word is not in the daily review');
});

// 7. Select a word anywhere (double-click) → "Add to my words" saves it with the sentence it was in.
await flow('cc-flow-select-word', { local: { 'khalil-cc-tab': 'vocab' } }, async ({ page, backend, check }) => {
  await page.getByRole('button', { name: /Call center basics/ }).click();
  const sentence = 'Headphones with a microphone that agents wear to take calls.';
  await page.getByText(sentence, { exact: true }).scrollIntoViewIfNeeded();
  const box = await page.getByText(sentence, { exact: true }).evaluate((el) => {
    const node = el.firstChild;
    const range = document.createRange();
    const at = node.textContent.indexOf('microphone');
    range.setStart(node, at);
    range.setEnd(node, at + 'microphone'.length);
    const r = range.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  await page.mouse.dblclick(box.x, box.y);
  const menu = page.getByRole('toolbar', { name: 'Selected: microphone' });
  await menu.waitFor({ timeout: 3000 });
  await page.screenshot({ path: `${OUT}/cc-flow-select-word-menu.png` });
  await menu.getByRole('button', { name: /Add to my words/ }).click();
  const dialog = page.getByRole('dialog');
  check((await dialog.getByPlaceholder('Example sentence').inputValue()) === sentence, 'the sentence was not kept as the example');
  check((await dialog.locator('select').first().inputValue()) === 'Call Center: My words', 'not added to My words');
  // The dictionary may be out of reach here: give a meaning if it didn't.
  await page.waitForTimeout(2500);
  const meaning = dialog.getByPlaceholder(/Definition|Not found/);
  if (!(await meaning.inputValue())) await meaning.fill('A device that picks up your voice.');
  await page.screenshot({ path: `${OUT}/cc-flow-select-word-add.png` });
  await dialog.getByRole('button', { name: 'Add 1 word' }).click();
  await page.waitForTimeout(800);
  check((backend.tables.vocabulary_items ?? []).some((r) => r.word === 'microphone' && r.example_sentence === sentence), 'the word was not saved with its sentence');
});

await browser.close();
if (problems.length) {
  console.log(problems.join('\n'));
  process.exit(1);
}
console.log('NO PROBLEMS FOUND');

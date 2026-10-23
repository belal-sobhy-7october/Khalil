// End-to-end interaction flows: add / edit / delete things in every section,
// reload, and check that what the user did is still there — both on screen and
// in what was sent to the (fake) backend. Runs in English so the selectors
// read like the UI.
//
// Usage: same dev server as smoke.mjs, then
//   node scripts/e2e/flows.mjs http://localhost:5173 ./e2e-shots
import { chromium } from 'playwright';
import fs from 'node:fs';
import { openApp, checkScreen, problems } from './harness.mjs';
import { dayStr } from './seed.mjs';

const BASE = process.argv[2] ?? 'http://localhost:5173';
const OUT = process.argv[3] ?? './shots';
fs.mkdirSync(OUT, { recursive: true });
const today = dayStr(new Date());
const only = process.env.FLOW ? new RegExp(process.env.FLOW) : null;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

async function flow(name, opts, body) {
  if (only && !only.test(name)) return;
  const app = await openApp(browser, BASE, name, { language: 'en', ...opts });
  const fail = (msg) => problems.push(`[${name}] ${msg}`);
  const check = (cond, msg) => {
    if (!cond) fail(msg);
    return !!cond;
  };
  const reload = async () => {
    await app.page.reload({ waitUntil: 'domcontentloaded' });
    await app.page.waitForTimeout(1500);
  };
  try {
    await checkScreen(app.page, name);
    await body({ ...app, fail, check, reload });
    await checkScreen(app.page, `${name}:end`);
  } catch (e) {
    const lines = String(e.message ?? e).split('\n');
    fail(`threw: ${lines[0]} ${lines.find((l) => l.includes('waiting for')) ?? ''}`.trim());
  }
  await app.page.screenshot({ path: `${OUT}/flow-${name}.png`, fullPage: true }).catch(() => {});
  await app.context.close();
}

const visible = async (locator, timeout = 3000) => {
  try {
    await locator.first().waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------- todos
await flow('todo-add-complete-delete', { section: 'todo' }, async ({ page, backend, check, reload }) => {
  const input = page.getByPlaceholder('Add a task for today...');
  await input.fill('E2E write report');
  await input.press('Enter');
  check(await visible(page.getByText('E2E write report')), 'new todo not shown');
  const saved = backend.tables.todos.find((t) => t.text === 'E2E write report');
  if (!check(saved, 'new todo not sent to the backend')) return;
  check(saved.date === today, `new todo saved for ${saved.date}, expected ${today}`);
  check(saved.gate === 'daily', `new todo saved with gate ${saved.gate}`);
  // Adding an empty or whitespace task must do nothing.
  const before = backend.tables.todos.length;
  await input.fill('   ');
  await input.press('Enter');
  check(backend.tables.todos.length === before, 'whitespace-only todo was saved');

  const row = page.getByText('E2E write report').locator('xpath=ancestor::*[.//button[@aria-label="Delete task"]][1]');
  await row.getByRole('button', { name: 'Mark as complete' }).click();
  await page.waitForTimeout(400);
  check(backend.tables.todos.find((t) => t.text === 'E2E write report')?.completed === true, 'completing a todo did not reach the backend');
  await reload();
  const row2 = page.getByText('E2E write report').locator('xpath=ancestor::*[.//button[@aria-label="Delete task"]][1]');
  check(await visible(row2.getByRole('button', { name: 'Mark as incomplete' })), 'completed state lost after reload');
  await row2.getByRole('button', { name: 'Delete task' }).click();
  await page.waitForTimeout(600);
  check(!backend.tables.todos.some((t) => t.text === 'E2E write report'), 'deleted todo still in the backend');
  await reload();
  check(!(await page.getByText('E2E write report').count()), 'deleted todo came back after reload');
});

// ---------------------------------------------------------------- habits
await flow('habit-add-toggle', { section: 'life' }, async ({ page, backend, check, reload }) => {
  await page.getByRole('button', { name: 'Add a habit...' }).click();
  await page.getByPlaceholder('Add a habit...').fill('E2E Reading');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.waitForTimeout(600);
  const habit = backend.tables.habits.find((h) => h.name === 'E2E Reading');
  if (!check(habit, 'new habit not sent to the backend')) return;
  check(habit.start_date === today, `new habit start_date ${habit.start_date}, expected today ${today}`);
  const cell = page.getByRole('button', { name: new RegExp(`^E2E Reading — ${today}`) });
  if (!check(await visible(cell), "today's cell for the new habit not found")) return;
  await cell.click();
  await page.waitForTimeout(500);
  check((await cell.getAttribute('aria-pressed')) === 'true', 'habit cell not pressed after click');
  check(backend.tables.habit_entries.some((e) => e.habit_id === habit.id && e.date === today), 'habit entry not saved');
  await reload();
  const cell2 = page.getByRole('button', { name: new RegExp(`^E2E Reading — ${today}`) });
  check((await cell2.getAttribute('aria-pressed')) === 'true', 'habit check lost after reload');
  await cell2.click();
  await page.waitForTimeout(500);
  check(!backend.tables.habit_entries.some((e) => e.habit_id === habit.id && e.date === today), 'unchecking did not delete the entry');
});

// ---------------------------------------------------------------- settings
await flow('settings-theme-language', { section: 'settings' }, async ({ page, backend, check, reload }) => {
  await page.getByRole('button', { name: /Downtown Cairo/ }).click();
  await page.waitForTimeout(400);
  const state = () => page.evaluate(() => ({ appearance: document.documentElement.dataset.appearance, dark: document.documentElement.classList.contains('dark'), dir: document.documentElement.dir }));
  let s = await state();
  check(s.appearance === 'downtown', `appearance after click: ${s.appearance}`);
  check(s.dark, 'Downtown Cairo should switch to dark mode');
  await page.waitForTimeout(800);
  check(backend.tables.user_kv?.some((r) => r.key === 'appearance' && JSON.stringify(r.value).includes('downtown')), 'appearance not saved to user_kv');
  await reload();
  s = await state();
  check(s.appearance === 'downtown' && s.dark, `theme lost after reload: ${JSON.stringify(s)}`);
  await page.getByRole('button', { name: 'Light', exact: true }).first().click();
  await page.waitForTimeout(300);
  s = await state();
  check(!s.dark, 'Light button did not switch mode');
  await page.getByRole('button', { name: /Royal Pine|Warm Ivory/ }).click();
  await page.waitForTimeout(300);
  s = await state();
  check(s.appearance === 'pine', `palette after click: ${s.appearance}`);
  await page.getByRole('button', { name: /عربي|العربية|Arabic/ }).first().click();
  await page.waitForTimeout(500);
  s = await state();
  check(s.dir === 'rtl', `language switch did not set rtl: ${s.dir}`);
  check(await visible(page.getByRole('heading', { name: 'الإعدادات' })), 'settings heading not in Arabic after switch');
});

// ---------------------------------------------------------------- wird
await flow('wird-mark-day', { section: 'wird' }, async ({ page, backend, check, reload }) => {
  const fajr = page.getByRole('button', { name: new RegExp(`^Fajr ${today}:`) });
  if (!check(await visible(fajr), "today's Fajr cell not found")) return;
  await fajr.click();
  check(/In congregation/.test((await fajr.getAttribute('aria-label')) ?? ''), `first click → ${await fajr.getAttribute('aria-label')}`);
  await fajr.click();
  check(/Prayed alone/.test((await fajr.getAttribute('aria-label')) ?? ''), `second click → ${await fajr.getAttribute('aria-label')}`);
  await fajr.click();
  check(/Not marked/.test((await fajr.getAttribute('aria-label')) ?? ''), `third click → ${await fajr.getAttribute('aria-label')}`);
  await fajr.click();
  await page.getByRole('button', { name: 'Qiyam (rakaat) +' }).click();
  await page.getByRole('button', { name: 'Qiyam (rakaat) +' }).click();
  await page.getByRole('button', { name: `Morning adhkar ${today}` }).click();
  await page.waitForTimeout(1500); // save is debounced
  const row = backend.tables.wird_days.find((r) => r.date === today);
  if (!check(row, 'today not saved to wird_days')) return;
  check(row.data.prayers?.fajr === 'jamaah', `saved fajr: ${row.data.prayers?.fajr}`);
  check(row.data.qiyam === 2, `saved qiyam: ${row.data.qiyam}`);
  check(row.data.adhkarAM === true, 'morning adhkar not saved');
  await reload();
  check(/In congregation/.test((await page.getByRole('button', { name: new RegExp(`^Fajr ${today}:`) }).getAttribute('aria-label')) ?? ''), 'fajr lost after reload');
  check((await page.getByRole('button', { name: `Morning adhkar ${today}` }).getAttribute('aria-pressed')) === 'true', 'adhkar lost after reload');
  // A quick edit followed straight away by a reload must not be lost.
  await page.getByRole('button', { name: `Evening adhkar ${today}` }).click();
  await reload();
  check((await page.getByRole('button', { name: `Evening adhkar ${today}` }).getAttribute('aria-pressed')) === 'true', 'edit lost when reloading right after it');
  // The week navigation can't go past this week.
  const next = page.getByRole('button', { name: 'Next week' });
  check(await next.isDisabled(), 'next week is enabled on the current week');
});

// ---------------------------------------------------------------- focus
await flow('focus-start-pause-reset', { section: 'focus' }, async ({ page, check }) => {
  const clock = () => page.locator('text=/^\\d{1,2}:\\d{2}$/').first().textContent();
  const start = await clock();
  check(start === '25:00', `idle clock shows ${start}`);
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.waitForTimeout(2200);
  const running = await clock();
  check(running && running < '25:00', `clock not counting down: ${running}`);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const paused = await clock();
  await page.waitForTimeout(1500);
  check((await clock()) === paused, 'clock kept moving after pause');
  await page.keyboard.press('Space');
  await page.waitForTimeout(1200);
  check((await clock()) !== paused, 'Space did not resume');
  await page.keyboard.press('r');
  await page.waitForTimeout(300);
  check((await clock()) === '25:00', `R did not reset: ${await clock()}`);
  // Typing in the label field must not trigger shortcuts.
  const label = page.getByPlaceholder(/What are you working on/);
  await label.fill('grammar rs');
  await page.waitForTimeout(300);
  check((await clock()) === '25:00', 'typing in the label started/reset the timer');
});

await flow('focus-session-recorded', { section: 'focus' }, async ({ page, backend, check, reload }) => {
  // Shorten focus to 1 minute, then let the clock run out.
  await page.clock.install();
  await reload();
  await page.getByRole('button', { name: /Timer settings/ }).click();
  const focusInput = page.getByLabel('Focus (minutes)');
  if (!check(await visible(focusInput), 'focus minutes setting not found')) return;
  await focusInput.fill('1');
  await focusInput.blur();
  await page.waitForTimeout(300);
  const before = backend.tables.pomodoro_sessions.length;
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.clock.runFor(61_000);
  await page.waitForTimeout(800);
  const added = backend.tables.pomodoro_sessions.slice(before);
  check(added.length === 1, `expected 1 recorded session, got ${added.length}`);
  if (added[0]) check(added[0].minutes === 1, `recorded ${added[0].minutes} minutes, expected 1`);
  check(await visible(page.getByText(/Short break/i)), 'did not move on to the short break');
});

// ---------------------------------------------------------------- vocabulary
await flow('vocab-quick-add', { section: 'vocabulary', englishTab: 'vocabulary' }, async ({ page, backend, check, reload }) => {
  const before = backend.tables.vocabulary_items.length;
  await page.getByRole('button', { name: 'Quick add', exact: true }).click();
  await page.locator('textarea').first().fill('negotiate\nfollow up\nzzzblorp | a made-up word | I said zzzblorp.\nAmbitious');
  await page.getByRole('button', { name: /^Continue \(\d+\)$/ }).click();
  check(await visible(page.getByText('Definition of negotiate.'), 8000), 'definition for "negotiate" was not filled in');
  check(await visible(page.getByText(/Already in your list/)), 'duplicate "Ambitious" not flagged');
  const save = page.getByRole('button', { name: /^Add \d+ words$/ });
  const label = await save.textContent();
  check(label === 'Add 3 words', `save button says "${label}", expected 3 (the duplicate skipped)`);
  await save.click();
  await page.waitForTimeout(800);
  const added = backend.tables.vocabulary_items.slice(before);
  check(added.length === 3, `saved ${added.length} words, expected 3`);
  const blorp = added.find((w) => w.word === 'zzzblorp');
  check(blorp?.definition === 'a made-up word', `manual definition saved as ${blorp?.definition}`);
  await reload();
  check(await visible(page.getByText('follow up', { exact: true })), 'quick-added word missing after reload');
});

await flow('vocab-topic-library', { section: 'vocabulary', englishTab: 'vocabulary' }, async ({ page, backend, check }) => {
  await page.getByRole('button', { name: 'Topic Library', exact: true }).click();
  const library = page.getByRole('dialog', { name: 'Topic Library' });
  check(await visible(library), 'topic library is not exposed as a dialog');
  const pack = library.getByRole('button', { name: /Job Interview/ });
  if (!check(await visible(pack), 'Interview pack not listed')) return;
  await pack.click();
  const add = page.getByRole('button', { name: /^Add \d+ items$/ });
  if (!check(await visible(add), 'add-pack button not shown')) return;
  const n = Number((await add.textContent()).match(/\d+/)[0]);
  const before = backend.tables.vocabulary_items.length;
  await add.click();
  check(await visible(page.getByText(/^Added \d+/), 8000), 'no confirmation after adding a pack');
  const added = backend.tables.vocabulary_items.length - before;
  check(added === n, `pack added ${added} items, button promised ${n}`);
  check(added === 0 || backend.tables.vocabulary_categories.some((c) => /Interview/.test(c.name)), 'pack topic/category not created');
  check(!backend.tables.vocabulary_items.slice(before).some((w) => /[؀-ۿ]/.test(`${w.definition}${w.example_sentence ?? ''}`)), 'pack items contain Arabic text');
});

await flow('vocab-review-flashcards', { section: 'vocabulary', englishTab: 'vocabulary' }, async ({ page, backend, check }) => {
  await page.getByTestId('review-panel').getByRole('button', { name: /^Review now/ }).click();
  const flash = page.getByRole('button', { name: /flashcard/i }).first();
  if (await visible(flash, 1500)) await flash.click();
  let rated = 0;
  for (let i = 0; i < 60 && !(await page.getByText('Review Complete').isVisible().catch(() => false)); i++) {
    await page.getByRole('button', { name: 'Show answer' }).click({ timeout: 2000 }).catch(() => {});
    const answered = await page
      .getByRole('button', { name: /^Good/ })
      .click({ timeout: 2000 })
      .then(() => true, () => false);
    if (answered) rated++;
  }
  check(rated > 0, 'no flashcards to rate');
  check(await visible(page.getByText('Review Complete')), 'review did not reach the summary');
  check(backend.log.some((w) => w.table === 'vocabulary_items' && w.method === 'PATCH'), 'review results not saved');
});

await flow('vocab-typing-practice', { section: 'vocabulary', englishTab: 'vocabulary' }, async ({ page, check }) => {
  await page.getByTestId('review-panel').getByRole('button', { name: /^Review now/ }).click();
  const typing = page.getByRole('button', { name: /type the word|typing|spell/i }).first();
  if (!check(await visible(typing), 'typing mode not offered')) return;
  await typing.click();
  const input = page.getByPlaceholder('Type your answer…');
  if (!check(await visible(input), 'typing input not shown')) return;
  await input.fill('definitely wrong');
  await input.press('Enter');
  check(await visible(page.getByRole('button', { name: 'Next (Enter)' })), 'no Next after a wrong answer');
  await input.press('Enter').catch(() => {});
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  check(await input.isVisible(), 'practice ended after one answer');
});

await flow('vocab-upgrade-topics', { section: 'vocabulary', englishTab: 'vocabulary' }, async ({ page, backend, check, reload }) => {
  // The seed's "Shopping & Money" topic holds words from the old pack (now the Shop Smart lesson).
  check(await visible(page.getByText(/new lesson method/)), 'upgrade banner not shown');
  await page.getByRole('button', { name: 'Review the update' }).click();
  const dialog = page.getByRole('dialog', { name: 'Update your topics to the new lessons' });
  if (!check(await visible(dialog), 'upgrade window not open')) return;
  const before = backend.tables.vocabulary_items.length;
  await dialog.getByRole('button', { name: /^Apply \d+ changes?$/ }).click();
  check(await visible(dialog.getByText(/Done — \d+ changes? applied/), 10000), 'upgrade did not finish');
  const words = backend.tables.vocabulary_items.map((w) => w.word.toLowerCase());
  check(words.includes('consumerism'), 'lesson words not added');
  check(!words.includes('receipt'), 'old filler "receipt" not removed');
  check(words.includes('compromise'), "the user's own word was removed");
  check(backend.tables.vocabulary_items.length > before, 'no words added');
  await page.keyboard.press('Escape');
  await reload();
  check(!(await page.getByText(/new lesson method/).count()), 'banner still offered after the update');
});

await flow('vocab-resources', { section: 'vocabulary', englishTab: 'vocabulary' }, async ({ page, backend, check }) => {
  await page.getByRole('button', { name: 'Helpful resources' }).click();
  check(await visible(page.getByRole('heading', { name: 'Helpful resources' })), 'resources modal not open');
  const star = page.getByRole('radiogroup', { name: 'Your rating' }).first().getByRole('radio', { name: '4' });
  if (await visible(star, 1500)) {
    await star.click();
    await page.waitForTimeout(500);
    check(backend.tables.english_resource_ratings?.some((r) => r.rating === 4), 'rating not saved');
  } else check(false, 'no star rating buttons found');
  await page.getByRole('button', { name: 'Suggest one' }).click().catch(() => {});
  await page.getByPlaceholder('Name').fill('E2E Site');
  await page.getByPlaceholder(/https|link|url/i).last().fill('example.org');
  await page.getByRole('button', { name: 'Send suggestion' }).click();
  await page.waitForTimeout(500);
  const sug = backend.tables.english_resource_suggestions?.find((r) => r.name === 'E2E Site');
  check(sug, 'suggestion not saved');
  if (sug) check(/^https:\/\/example\.org\/?$/.test(sug.url), `suggestion url saved as ${sug.url}`);
});

// ---------------------------------------------------------------- bookmarks
await flow('bookmarks-add', { section: 'bookmarks' }, async ({ page, backend, check, reload }) => {
  await page.getByRole('button', { name: 'Add Category' }).click();
  await page.getByPlaceholder('Category name').fill('E2E Cat');
  await page.getByPlaceholder('Category name').press('Enter');
  await page.waitForTimeout(500);
  check(backend.tables.bookmark_categories?.some((c) => c.name === 'E2E Cat'), 'category not saved');
  await page.getByRole('button', { name: 'E2E Cat', exact: true }).click();
  await page.getByRole('button', { name: 'Add Bookmark' }).first().click();
  await page.getByPlaceholder('Title').fill('E2E Link');
  await page.getByPlaceholder('https://...').fill('https://example.com');
  await page.getByRole('button', { name: 'Save', exact: true }).last().click();
  await page.waitForTimeout(500);
  check(backend.tables.bookmarks?.some((b) => b.title === 'E2E Link'), 'bookmark not saved');
  await reload();
  check(await visible(page.getByText('E2E Link')), 'bookmark missing after reload');
});

// ---------------------------------------------------------------- learning path
await flow('learning-path', { section: 'vocabulary', englishTab: 'path' }, async ({ page, backend, check, reload }) => {
  const saved = () => backend.tables.user_kv?.find((r) => r.key === 'learning-path')?.value;
  const wordCount = () => (backend.tables.vocabulary_items ?? []).length;
  const wordsBefore = wordCount();
  check(await visible(page.getByRole('tab', { name: 'Learning Path', selected: true })), 'the path is not a tab of the English hub');
  await page.getByRole('button', { name: 'Start day 1' }).click();
  await page.waitForTimeout(400);
  check(saved()?.startedAt === today, `path start not saved: ${JSON.stringify(saved())}`);
  check(await visible(page.getByRole('heading', { level: 2, name: /Day 1/ })), 'day 1 not shown after starting');

  // Words: they reach the flashcards only when asked.
  await page.locator('[data-task="words-1"] [aria-expanded]').click();
  check(wordCount() === wordsBefore, 'the path changed the word list before being asked');
  await page.getByRole('button', { name: /Add to my flashcards/ }).click();
  await page.waitForTimeout(800);
  const added = wordCount() - wordsBefore;
  check(added >= 5 && added <= 7, `adding the day's words added ${added}`);
  check(backend.tables.vocabulary_categories?.some((c) => c.name === 'Small Talk'), 'words not filed under the topic');

  // Review: the flashcards open in the path; ending the session ticks the task and saves each word's schedule.
  await page.locator('[data-task="review"] [aria-expanded]').click();
  await page.getByRole('button', { name: /^Start review/ }).click();
  for (let i = 0; i < 60 && !(await page.getByText('Review Complete').isVisible().catch(() => false)); i++) {
    await page.getByRole('button', { name: 'Show answer' }).click({ timeout: 2000 }).catch(() => {});
    await page.getByRole('button', { name: /^Easy/ }).click({ timeout: 2000 }).catch(() => {});
  }
  check(await visible(page.getByText('Review Complete')), 'review session did not finish');
  await page.getByRole('button', { name: 'Close' }).last().click();
  await page.waitForTimeout(500);
  check(saved()?.done?.['1:review'] === today, 'review task not ticked when the session ended');
  const srsRows = (backend.tables.user_kv ?? []).filter((r) => r.key.startsWith('srs:'));
  check(srsRows.length >= added, `spaced-repetition states saved for ${srsRows.length} words`);

  // A course task names the next hub lesson and opens its section.
  await page.locator('[data-task="lesson-listening"] [aria-expanded]').click();
  check(await visible(page.locator('[data-task="lesson-listening"]').getByText(/Ibrahim Adel/)), 'listening task does not name its source');

  // Tick the rest of day 1.
  const toggles = page.getByRole('button', { name: /^Mark as complete:/ });
  for (let i = 0, n = await toggles.count(); i < n; i++) {
    await toggles.first().click();
    await page.waitForTimeout(150);
  }
  check(await visible(page.getByRole('status').filter({ hasText: 'Day 1 done' })), 'day-done banner not shown');

  // Write a note on day 2 and reload: progress and the note stay.
  await page.getByRole('button', { name: 'Start day 2' }).click();
  await page.locator('[data-task="grammar"] [aria-expanded]').click();
  await page.getByPlaceholder(/Write here/).fill('If I were you, I would talk to her.');
  await page.waitForTimeout(1200);
  check(Object.values(saved()?.notes ?? {}).includes('If I were you, I would talk to her.'), 'note not saved');
  await reload();
  check(await visible(page.getByRole('heading', { level: 2, name: /Day 1/ })), 'after reload the day finished today should stay open');
  check(await visible(page.getByText('1/90', { exact: true })), 'days-done count lost after reload');
  await page.getByRole('button', { name: 'Start day 2' }).click();
  await page.locator('[data-task="grammar"] [aria-expanded]').click();
  check((await page.getByPlaceholder(/Write here/).inputValue()) === 'If I were you, I would talk to her.', 'note lost after reload');
  // Roadmap: jump to the final test day.
  await page.getByRole('button', { name: /^Day 89 — / }).click();
  check(await visible(page.getByText('Final speaking test')), 'roadmap day 89 does not show the final test');
  // Day 1's Listening lesson opens the hub's Listening section.
  await page.getByRole('button', { name: /^Day 1 — / }).click();
  await page.locator('[data-task="lesson-listening"] [aria-expanded]').click();
  await page.getByRole('button', { name: 'Open Listening' }).click();
  check(await visible(page.getByRole('tab', { name: 'Listening', selected: true })), 'the listening task did not open Listening');
});

// ---------------------------------------------------------------- spaced repetition
await flow('srs-review', { section: 'vocabulary', englishTab: 'vocabulary' }, async ({ page, backend, check, reload }) => {
  const panel = page.getByTestId('review-panel');
  check(await visible(panel), 'review panel not on the word list');
  check(await visible(panel.getByText('5 new today')), 'new words not counted');
  await panel.getByRole('button', { name: /^Review now/ }).click();
  await page.getByRole('button', { name: /Flashcards/ }).first().click();
  // Anki flow: the answer is hidden until asked for, then four grades with their intervals.
  check(!(await page.getByRole('button', { name: /^Good/ }).count()), 'grades shown before recalling');
  await page.getByRole('button', { name: 'Show answer' }).click();
  check(await visible(page.getByRole('button', { name: /^Good\s*10m/ })), 'grade buttons do not show intervals');
  await page.getByRole('button', { name: /^Again/ }).click();
  await page.waitForTimeout(400);
  const first = backend.tables.vocabulary_items.find((w) => w.last_result === 'incorrect');
  check(first, 'the review was not recorded on the word');
  const row = first && backend.tables.user_kv?.find((r) => r.key === `srs:${first.id}`);
  check(row && row.value.state === 1, `schedule not saved: ${JSON.stringify(row?.value)}`);
  // Finish the session (the forgotten word comes back within it).
  for (let i = 0; i < 30 && !(await page.getByText('Review Complete').isVisible().catch(() => false)); i++) {
    await page.getByRole('button', { name: 'Show answer' }).click({ timeout: 2000 }).catch(() => {});
    await page.getByRole('button', { name: /^Good/ }).click({ timeout: 2000 }).catch(() => {});
  }
  check(await visible(page.getByText('Review Complete')), 'session did not end');
  check(await visible(page.getByText('Missed Words')), 'the forgotten word is not listed');
  await page.getByRole('button', { name: 'Close' }).last().click();
  // Settings: daily new words and the reminder are saved per account.
  await panel.getByRole('button', { name: 'Review settings' }).click();
  await page.getByLabel('New words per day').selectOption('10');
  await page.waitForTimeout(400);
  check(backend.tables.user_kv?.find((r) => r.key === 'srs-settings')?.value?.newPerDay === 10, 'settings not saved');
  check(await visible(page.getByRole('link', { name: 'Add to Google Calendar' })), 'calendar reminder link missing');
  await reload();
  check(await visible(page.getByTestId('review-panel')), 'panel gone after reload');
  check(!(await page.getByTestId('review-panel').getByText('5 new today').count()), 'the session did not count after reload');
});

await flow('review-nudge', { section: 'todo' }, async ({ page, backend, check, reload }) => {
  // A word reviewed ten days ago at level 2 is due again.
  const word = backend.tables.vocabulary_items[1];
  Object.assign(word, { mastery_level: 2, review_count: 3, last_reviewed_at: new Date(Date.now() - 10 * 86400000).toISOString() });
  await reload();
  const nudge = page.getByTestId('review-nudge');
  check(await visible(nudge), 'no review reminder on the day page');
  check(await page.locator('aside nav button', { hasText: 'Learn English' }).locator('[title="Words due: 1"]').count(), 'no due badge in the sidebar');
  await nudge.getByRole('button', { name: 'Review' }).click();
  // Straight into the flashcards: 4 new words and the 1 due for review.
  check(await visible(page.getByRole('button', { name: 'Show answer' })), 'the reminder did not open the review');
  check(/^4\s*0\s*1/.test((await page.getByTestId('srs-left').textContent()) ?? ''), `session counts: ${await page.getByTestId('srs-left').textContent()}`);
});

// ---------------------------------------------------------------- navigation
await flow('account-menu-settings', { section: 'todo' }, async ({ page, check }) => {
  const trigger = page.getByRole('button', { name: 'Account menu' });
  if (!check(await visible(trigger), 'account menu trigger not found')) return;
  await trigger.click();
  const settings = page.getByRole('menuitem', { name: /Settings/ });
  if (!check(await visible(settings), 'settings item not in account menu')) return;
  await settings.first().click();
  check(await visible(page.getByRole('heading', { name: 'Settings', exact: true })), 'account menu did not open settings');
});

await flow('mobile-nav', { section: 'todo', viewport: { width: 390, height: 844 } }, async ({ page, check }) => {
  const menu = page.getByRole('button', { name: 'Toggle sidebar' });
  if (!check(await visible(menu), 'mobile menu button not found')) return;
  await menu.click();
  await page.getByRole('button', { name: 'Daily Wird' }).first().click();
  await page.waitForTimeout(800);
  check(await visible(page.getByRole('button', { name: new RegExp(`^Fajr ${today}:`) })), 'mobile nav did not open wird');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(overflow <= 2, `overflow ${overflow}px`);
});

await browser.close();
console.log(problems.length ? problems.join('\n') : 'NO PROBLEMS FOUND');

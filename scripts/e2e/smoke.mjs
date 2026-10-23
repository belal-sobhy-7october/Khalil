// End-to-end smoke test: opens every section (Arabic/English, light/dark,
// every palette and theme, desktop and mobile) against a fake Supabase backend
// with seeded data, and reports page errors, untranslated keys, horizontal
// overflow and broken flows. Screenshots go to the output directory.
//
// Usage:
//   VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=fake npx vite --port 5173
//   npm i --no-save playwright && node scripts/e2e/smoke.mjs http://localhost:5173 ./e2e-shots
// Set CHROMIUM_PATH to use a specific Chromium build.
import { chromium } from 'playwright';
import fs from 'node:fs';
import { openApp, checkScreen, problems } from './harness.mjs';

const BASE = process.argv[2] ?? 'http://localhost:5173';
const OUT = process.argv[3] ?? './shots';
fs.mkdirSync(OUT, { recursive: true });

async function visit(browser, name, opts, interact) {
  const { page, context } = await openApp(browser, BASE, name, opts);
  await page.waitForTimeout(300);
  await checkScreen(page, name);
  if (interact) await interact(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await context.close();
}

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const sections = ['todo', 'calendar', 'life', 'bookmarks', 'languages', 'skills', 'vocabulary', 'focus', 'wird', 'analytics', 'settings'];
for (const s of sections) await visit(browser, `ar-light-${s}`, { section: s });
for (const tab of ['path', 'vocabulary', 'pronunciation', 'listening', 'reading', 'grammar', 'shadowing']) await visit(browser, `ar-light-english-${tab}`, { section: 'vocabulary', englishTab: tab });
await visit(browser, 'en-dark-english-path', { section: 'vocabulary', englishTab: 'path', theme: 'dark', language: 'en' });
for (const s of ['languages', 'skills', 'focus', 'wird', 'analytics', 'settings']) await visit(browser, `en-dark-${s}`, { section: s, theme: 'dark', language: 'en' });
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

for (const s of ['focus', 'settings', 'todo', 'languages', 'skills']) await visit(browser, `mobile-${s}`, { section: s, viewport: { width: 390, height: 844 } });
await visit(browser, 'mobile-english-shadowing', { section: 'vocabulary', englishTab: 'shadowing', viewport: { width: 390, height: 844 } });
await browser.close();
console.log(problems.length ? problems.join('\n') : 'NO PROBLEMS FOUND');

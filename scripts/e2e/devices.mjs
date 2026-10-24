// Khalil on phones and tablets: every section, tab and sub-tab, the menu and the
// main dialogs on phones (iPhone SE to Pro Max, Android 360–412 wide, a phone on
// its side), tablets (Galaxy Tab, iPad, iPad on its side) and an open fold, in
// Arabic and English, with touch and no hover. It moves through the app the way
// a finger does (the menu, the hub cards, every tab, the disclosures, the
// dialogs) and reports, per screen:
//   layout  the page scrolls sideways, something sticks out of the screen or is
//           cut off at the side of its box, text is cut off or squeezed into a
//           sliver, a dialog is bigger than the screen;
//   touch   a control you can't see (it only shows on hover, and phones have
//           no hover), one you can't tap (covered by a fixed bar or button even
//           when scrolled to it), one under 24×24 px with no room around it
//           (WCAG 2.2), a text field under 16px (an iPhone zooms the page in
//           when it's tapped);
//   errors  page errors, untranslated keys, a menu item, card, tab or button
//           that didn't open;
//   safari  (read from the source) `vh` units, which iPhone Safari measures
//           with its toolbar hidden, so the bottom of a 90vh dialog sits under
//           it (`svh` is measured with the toolbar showing);
//   minor   text under 11px, icon buttons with no name.
// The report is <dir>/report.md. Each device has a folder of screenshots (of the
// screen, not the whole page): one per section and tab, and one of every screen
// with a problem. Exits with 1 unless only minor things were found.
//
// Usage:
//   VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=fake npx vite --port 5173
//   node scripts/e2e/devices.mjs http://localhost:5173 ./e2e-devices [--quick] [--device "iPhone SE"]... [--lang ar|en] [--section calendar]... [--jobs 3]
// iPhones and iPads run in WebKit (Safari's engine) when Playwright has it installed,
// otherwise in Chromium with the device's size, pixel ratio, user agent and touch.
import { chromium, webkit, devices } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { openApp, screenProblems } from './harness.mjs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const values = (name) => args.flatMap((a, i) => (a === `--${name}` && args[i + 1] ? [args[i + 1]] : []));
const OPTIONS = ['--device', '--lang', '--section', '--jobs']; // the ones that take a value
const positional = args.filter((a, i) => !a.startsWith('--') && !OPTIONS.includes(args[i - 1]));
const BASE = positional[0] ?? 'http://localhost:5173';
const OUT = positional[1] ?? './e2e-devices';

// Each width is a layout the app goes through: 320 is the narrowest phone, 360 the usual
// Android, 640/768/1024 Tailwind's sm/md/lg.
const DEVICES = [
  'iPhone SE', // 320 × 568
  'Galaxy S24', // 360 × 780
  'iPhone 15', // 393 × 659
  'Pixel 7', // 412 × 839
  'iPhone 15 Pro Max', // 430 × 739
  'iPhone 15 landscape', // 734 × 343
  'Galaxy Tab S9', // 640 × 1024
  'iPad Mini', // 768 × 1024
  'Galaxy Z Fold 7', // 984 × 1016, open
  'iPad Pro 11 landscape', // 1194 × 834
];
const QUICK = ['iPhone SE', 'Galaxy S24', 'iPad Mini'];
const chosen = values('device').length ? values('device') : flag('quick') ? QUICK : DEVICES;
for (const d of chosen) if (!devices[d]) throw new Error(`Unknown device "${d}" (see Playwright's device list)`);
const LANGS = values('lang').length ? values('lang') : ['ar', 'en'];
const JOBS = Number(values('jobs')[0] ?? 3);
const ONLY = values('section'); // e.g. --section calendar --section sales: only these (and not the menu checks)

// The sidebar's items, in order (Sidebar.tsx), and the sections each hub opens.
const SECTIONS = ['todo', 'calendar', 'life', 'bookmarks', 'languages', 'skills', 'focus', 'wird', 'analytics', 'settings'];
const HUBS = { languages: ['vocabulary'], skills: ['callcenter', 'sales'] };
// Buttons that open a dialog, by section and (for a hub section) tab: translation keys, or literal names.
const DIALOGS = [
  { section: 'vocabulary', tab: /^Vocabulary$/, keys: ['vocabulary.library.open', 'vocabulary.quickAdd.open', 'vocabulary.addWord', 'vocabulary.manageCategories', 'vocabulary.importWords', 'vocabulary.resources.open'] },
  { section: 'calendar', keys: ['calendar.addEvent'] },
  { section: 'callcenter', tab: /^Vocab$/, names: ['Add words'] },
];
const MAX_TABS = 12; // per tab list
const MAX_EXPAND = 3; // disclosures opened per screen

const slug = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
const found = new Map(); // `${kind}\u0000${what}` → { kind, what, where: Map(run → Set(screen)) }
let screens = 0;

function record(run, kind, what, screen) {
  const key = `${kind}\u0000${what}`;
  if (!found.has(key)) found.set(key, { kind, what, where: new Map() });
  const where = found.get(key).where;
  if (!where.has(run.id)) where.set(run.id, new Set());
  where.get(run.id).add(screen);
}

/**
 * Runs in the page: everything wrong with what's on the screen now. Returns
 * [{ kind, what }], with repeats folded into "(×n)". With `scope` (a selector), only the
 * controls in it are checked (an open menu covers the page on purpose); the layout is all checked.
 */
function inspect(scope) {
  const doc = document.documentElement;
  window.scrollTo({ left: 0, top: window.scrollY, behavior: 'instant' });
  const vw = doc.clientWidth;
  const vh = doc.clientHeight;
  const out = new Map();
  const add = (kind, what) => out.set(`${kind}\u0000${what}`, (out.get(`${kind}\u0000${what}`) ?? 0) + 1);
  const css = (el) => getComputedStyle(el);
  // With `named` false, only the element's kind and classes: one finding for a row repeated in a list.
  const label = (el, named = true) => {
    const name = named ? (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || el.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim().slice(0, 48) : '';
    const cls = typeof el.className === 'string' ? el.className.split(/\s+/).filter((c) => c && !c.includes('[')).slice(0, 3).join('.') : '';
    return `<${el.tagName.toLowerCase()}${cls ? `.${cls}` : ''}>${name ? ` "${name}"` : ''}`;
  };
  // checkVisibility() is false inside a closed <details> and other content that isn't drawn.
  const rendered = (el) => {
    const r = el.getBoundingClientRect();
    return r.width >= 2 && r.height >= 2 && el.checkVisibility({ visibilityProperty: true });
  };
  // Fixed layers moved off the screen (the closed sidebar), and full-screen ones (a dialog's
  // backdrop, the open menu's): what a backdrop covers isn't meant to be tapped.
  const fixed = [...document.querySelectorAll('.fixed, aside, [style*="fixed"]')].filter((e) => css(e).position === 'fixed');
  const offLayers = fixed.filter((e) => {
    const r = e.getBoundingClientRect();
    return r.right <= 0 || r.left >= vw || r.bottom <= 0 || r.top >= vh;
  });
  const backdrops = fixed.filter((e) => {
    const r = e.getBoundingClientRect();
    return r.width >= vw - 2 && r.height >= vh - 2 && css(e).visibility !== 'hidden';
  });
  // With a backdrop up, only what's above it (the dialog, the open menu) is meant to be tapped.
  const zOf = (el) => parseInt(css(el).zIndex, 10) || 0;
  const topZ = backdrops.length ? Math.max(...backdrops.map(zOf)) : null;
  const aboveBackdrop = (el) => {
    let layer = null;
    for (let e = el; e && e !== document.body; e = e.parentElement) if (css(e).position === 'fixed') layer = e;
    return layer !== null && zOf(layer) >= topZ;
  };
  const offCanvas = (el) => offLayers.some((l) => l.contains(el));
  const hidden = (el) => el.closest('[aria-hidden="true"], [inert]');

  // One pass over the page: what sticks out of the screen (with no ancestor that scrolls or
  // clips it), text cut off without an ellipsis, and text squeezed into a sliver.
  const sticking = new Set();
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (text && r.height >= 16 && r.width < 16 && el.textContent.trim().length >= 3 && el.checkVisibility({ visibilityProperty: true }) && !offCanvas(el) && !hidden(el)) {
      add('layout', `text squeezed under 16px wide, so it can't be read (what's next to it takes the room): ${label(el, false)}`);
    }
    if (r.width < 2 || r.height < 2) continue;
    const outside = r.right > vw + 1 || r.left < -1;
    if (!outside && !text) continue;
    if (!el.checkVisibility({ visibilityProperty: true }) || offCanvas(el)) continue;
    const s = css(el);
    if (outside) {
      let contained = false;
      for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
        if (css(e).overflowX !== 'visible') {
          contained = true;
          break;
        }
      }
      if (!contained) {
        sticking.add(el);
        if (!sticking.has(el.parentElement)) add('layout', `sticks out of the screen by ${Math.round(Math.max(r.right - vw, -r.left))}px: ${label(el)}`);
      }
    }
    if (text && !hidden(el)) {
      const x = /hidden|clip/.test(s.overflowX) && s.textOverflow !== 'ellipsis' && el.scrollWidth > el.clientWidth + 4;
      const y = /hidden|clip/.test(s.overflowY) && s.webkitLineClamp === 'none' && el.scrollHeight > el.clientHeight + 4;
      if (x || y) add('layout', `text cut off: ${label(el)}`);
    }
  }

  // Dialogs (and the panels on a full-screen backdrop) must fit on the screen.
  const panels = new Set(document.querySelectorAll('[role="dialog"], [aria-modal="true"]'));
  for (const b of backdrops) for (const c of b.children) panels.add(c);
  for (const el of panels) {
    if (!rendered(el) || hidden(el)) continue;
    const r = el.getBoundingClientRect();
    // A fixed dialog must be inside the screen; a popover in the page only needs to fit (the page scrolls to it).
    let isFixed = false;
    for (let e = el; e && e !== document.body; e = e.parentElement) if (css(e).position === 'fixed') isFixed = true;
    const outside = isFixed ? r.top < -1 || r.bottom > vh + 1 : r.height > vh + 1;
    if (outside || r.left < -1 || r.right > vw + 1) {
      add('layout', `dialog doesn't fit the screen (${Math.round(r.width)}×${Math.round(r.height)} on ${vw}×${vh}): ${label(el)}`);
    }
  }

  const CONTROLS = 'button, a[href], input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="tab"], [role="checkbox"], [role="switch"], [role="radio"], [role="menuitem"], [contenteditable="true"]';
  const controls = [...document.querySelectorAll(CONTROLS)].filter(
    (el) => (!scope || el.closest(scope)) && rendered(el) && !offCanvas(el) && !hidden(el) && !el.disabled && el.getAttribute('aria-disabled') !== 'true',
  );

  // Hover-only: an ancestor (or the control) at opacity ~0 whose classes show it on hover.
  const hoverReveal = /(^|\s)[\w/-]*hover[\w/-]*:!?opacity-/;
  const usable = [];
  for (const el of controls) {
    let opacity = 1;
    let onHover = false;
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const o = parseFloat(css(e).opacity);
      opacity *= o;
      if (o < 0.15 && typeof e.className === 'string' && hoverReveal.test(e.className)) onHover = true;
    }
    if (onHover) add('touch', `only shows on hover, so a phone or tablet never shows it: ${label(el)}`);
    else if (opacity >= 0.15 && css(el).pointerEvents !== 'none') usable.push(el);
  }

  // Too small to tap: under 24×24 with another control within its 24px circle (WCAG 2.2, 2.5.8).
  const rects = usable.map((el) => [el, el.getBoundingClientRect()]);
  for (const [el, r] of rects) {
    if (r.width >= 24 && r.height >= 24) continue;
    if (el.tagName === 'A' && css(el).display === 'inline') continue; // a link in a sentence
    if (el.type === 'range') continue;
    const lbl = el.closest('label');
    if (lbl && lbl.getBoundingClientRect().height >= 24) continue;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const crowded = rects.some(([o, q]) => o !== el && !o.contains(el) && !el.contains(o) && q.left < cx + 12 && q.right > cx - 12 && q.top < cy + 12 && q.bottom > cy - 12);
    if (crowded) add('touch', `too small to tap (${Math.round(r.width)}×${Math.round(r.height)}px, needs 24×24): ${label(el)}`);
  }

  for (const el of usable) {
    // Text fields under 16px: an iPhone zooms the page in when one is tapped.
    const field = el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable || (el.tagName === 'INPUT' && !/^(checkbox|radio|range|button|submit|reset|file|color|image)$/.test(el.type));
    const size = parseFloat(css(el).fontSize);
    if (field && size < 16) add('touch', `text field under 16px (${size}px), so an iPhone zooms the page in when it's tapped: ${label(el)}`);
    // Icon buttons with no name (innerText leaves out a label hidden on this screen size).
    const button = /^(BUTTON|A)$/.test(el.tagName) || el.getAttribute('role') === 'button';
    if (button && !el.innerText.trim() && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.getAttribute('title')) {
      add('minor', `icon button with no name (a screen reader says only "button"): ${label(el)}`);
    }
  }

  // Text under 11px.
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!n.textContent.trim() || !el || !rendered(el) || offCanvas(el) || hidden(el)) continue;
    const size = parseFloat(css(el).fontSize);
    if (size < 11) add('minor', `text under 11px (${size}px) is hard to read on a phone: ${label(el)}`);
  }

  // Pushed out of the side of a box that hides what doesn't fit, before anything is scrolled
  // (a script can scroll that box, a finger can't). A vertical clip is usually a closed section.
  const cutOff = new Set();
  for (const el of usable) {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
      if (!/hidden|clip/.test(css(e).overflowX)) continue;
      const q = e.getBoundingClientRect();
      if (cx < q.left || cx > q.right) {
        add('layout', `cut off at the side by ${label(e)}, so it can't be seen or tapped: ${label(el)}`);
        cutOff.add(el);
        break;
      }
    }
  }

  // Can't be tapped: scrolled to (where it is, then centered, then to either edge), its middle
  // is still under something else (a sticky column can cover a cell scrolled to the middle).
  const scrolled = new Map();
  const step = Math.ceil(usable.length / 400);
  const blocker = (el) => {
    let { left, top, right, bottom } = el.getBoundingClientRect();
    left = Math.max(left, 0);
    top = Math.max(top, 0);
    right = Math.min(right, vw);
    bottom = Math.min(bottom, vh);
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
      const s = css(e);
      if (s.overflowX === 'visible' && s.overflowY === 'visible') continue;
      const q = e.getBoundingClientRect();
      left = Math.max(left, q.left);
      top = Math.max(top, q.top);
      right = Math.min(right, q.right);
      bottom = Math.min(bottom, q.bottom);
    }
    if (right - left < 4 || bottom - top < 4) return 'clipped';
    const hit = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);
    return !hit || el.contains(hit) || hit.contains(el) || hit.closest('label')?.control === el ? null : hit;
  };
  for (const el of usable.filter((_, i) => i % step === 0)) {
    if (cutOff.has(el) || (topZ !== null && !aboveBackdrop(el))) continue;
    for (let e = el.parentElement; e; e = e.parentElement) if (!scrolled.has(e)) scrolled.set(e, [e.scrollLeft, e.scrollTop]);
    let hit = 'clipped';
    for (const inline of ['nearest', 'center', 'start', 'end']) {
      el.scrollIntoView({ block: 'center', inline, behavior: 'instant' });
      hit = blocker(el);
      if (!hit) break;
    }
    if (!hit || hit === 'clipped') continue; // reachable, or inside something clipped on purpose
    let cover = hit;
    for (let e = hit; e && e !== document.body; e = e.parentElement) if (/fixed|sticky/.test(css(e).position)) cover = e;
    add('touch', `can't be tapped, ${label(cover)} is on top of it: ${label(el)}`);
  }
  for (const [e, [x, y]] of scrolled) {
    e.scrollLeft = x;
    e.scrollTop = y;
  }

  return [...out].map(([key, n]) => {
    const [kind, what] = key.split('\u0000');
    return { kind, what: n > 1 ? `${what} (×${n})` : what };
  });
}

/** Waits for a screen to finish loading and its entrance animations. */
async function settle(page) {
  await page
    .waitForFunction(() => !document.querySelector('#main-content .animate-spin') && (document.querySelector('#main-content')?.textContent ?? '').trim().length > 20, null, { timeout: 4000 })
    .catch(() => {});
  await page.waitForTimeout(700);
}

/** Checks the screen as it is now; screenshots it when asked or when something is wrong. */
async function check(run, page, screen, { shot = false, scope = null } = {}) {
  run.screen = screen;
  screens++;
  await settle(page);
  // Still blank: the page may be reloading (the app reloads itself when a section's code fails to load).
  if (await page.evaluate(() => (document.querySelector('#root')?.textContent ?? '').trim().length < 20)) {
    await page.waitForFunction(() => (document.querySelector('#main-content')?.textContent ?? '').trim().length > 20, null, { timeout: 10000 }).catch(() => {});
    await settle(page);
  }
  const image = await page.screenshot({ type: 'jpeg', quality: 70, scale: 'css' }).catch(() => null);
  const issues = [...(await screenProblems(page)).map((what) => ({ kind: what.startsWith('horizontal') ? 'layout' : 'errors', what })), ...(await page.evaluate(inspect, scope))];
  for (const { kind, what } of issues) record(run, kind, what, screen);
  if (image && (shot || issues.some((i) => i.kind !== 'minor'))) {
    fs.writeFileSync(path.join(run.dir, `${String(++run.shots).padStart(3, '0')}-${slug(screen) || 'screen'}.jpg`), image);
  }
  // A phone browser widens its layout for a page that scrolls sideways and keeps it wide for the
  // next screens: start the next one from a reload, so each screen's problems are its own.
  run.dirty = await page.evaluate(() => innerWidth > document.documentElement.clientWidth + 1 || document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
}

/** Taps a control the way a finger does; a failure is recorded, not thrown. */
async function tap(run, locator, what) {
  try {
    await locator.scrollIntoViewIfNeeded({ timeout: 5000 });
    await locator.tap({ timeout: 5000 });
    return true;
  } catch (e) {
    // Playwright's call log says why: what intercepts the tap, or that it isn't visible or stable.
    const lines = e.message.replace(/\u001b\[\d+m/g, '').split('\n');
    const why = lines.reverse().find((l) => /intercepts pointer events|not visible|not stable|outside of the viewport|detached|not enabled/.test(l)) ?? lines.at(-1);
    const wide = await locator.page().evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2).catch(() => false);
    record(run, 'errors', `couldn't tap ${what}${wide ? ' (the page is wider than the screen here)' : ''}: ${why.trim().replace(/\s+/g, ' ').slice(0, 160)}`, run.screen);
    return false;
  }
}

const activeSection = (page) => page.evaluate(() => localStorage.getItem('khalil-active-section'));

/** Closes the menu if it stayed open (it does on screens 1024px and wider). */
async function closeMenu(page) {
  const open = await page.evaluate(() => {
    const aside = document.querySelector('aside');
    if (!aside) return null;
    const r = aside.getBoundingClientRect();
    if (r.right <= 0 || r.left >= document.documentElement.clientWidth) return null;
    // A point on the backdrop, away from the menu.
    const rtl = document.documentElement.dir === 'rtl';
    return { x: rtl ? 8 : document.documentElement.clientWidth - 8, y: document.documentElement.clientHeight / 2 };
  });
  if (open) {
    await page.touchscreen.tap(open.x, open.y);
    await page.waitForTimeout(400);
  }
}

/** Waits for the menu to finish sliding in. */
async function menuOpen(page) {
  await page
    .waitForFunction(() => {
      const r = document.querySelector('aside')?.getBoundingClientRect();
      return r && r.left >= 0 && r.right <= document.documentElement.clientWidth;
    }, null, { timeout: 3000 })
    .catch(() => {});
  await page.waitForTimeout(100);
}

/** Opens a sidebar section through the menu button (or, when the menu fails, directly, to go on checking). */
async function goSection(run, page, id) {
  await closeMenu(page);
  let opened = await tap(run, page.locator('header button').first(), 'the menu button');
  if (opened) {
    await menuOpen(page);
    opened = await tap(run, page.locator('aside nav button').nth(SECTIONS.indexOf(id)), `the menu item for ${id}`);
    await page.waitForTimeout(300);
    await closeMenu(page);
  }
  if (!opened) await navigate(page, id);
  else if ((await activeSection(page)) !== id && id !== 'life') {
    record(run, 'errors', `the menu item for ${id} didn't open it`, run.screen);
    await navigate(page, id);
  }
  return (await activeSection(page)) === id || id === 'life';
}

/** Opens a section without the menu (the app's own navigation event). */
async function navigate(page, id) {
  await page.evaluate((id) => window.dispatchEvent(new CustomEvent('khalil:navigate', { detail: id })), id);
  await settle(page);
}

/** Reloads the page on a section: a fresh start after a screen that broke the layout. */
async function reloadOn(page, id) {
  await page.evaluate((id) => localStorage.setItem('khalil-active-section', id), id);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await settle(page);
}

/**
 * Taps every tab of the screen's tab bar (its first tab list) and, on each tab, every tab of the
 * tab lists it shows (a course's sources, Voice Studio's prompts).
 */
async function walkTabs(run, page, screen, depth, parent, after) {
  const all = page.locator('#main-content [role="tablist"]');
  const keys = await all.evaluateAll((lists) => lists.map((l, i) => l.getAttribute('aria-label') ?? `list ${i}`));
  for (const key of depth === 1 ? keys.slice(0, 1) : keys.filter((k) => k !== parent)) {
    // Found again for every tab: tapping one can add or remove lists before it.
    const list = key.startsWith('list ') ? all.nth(Number(key.slice(5))) : page.locator(`#main-content [role="tablist"][aria-label=${JSON.stringify(key)}]`).first();
    await list.waitFor({ timeout: 5000 }).catch(() => {});
    const n = Math.min(await list.locator('[role="tab"]').count(), MAX_TABS);
    for (let i = 0; i < n; i++) {
      if (run.dirty) await run.reset();
      const tab = list.locator('[role="tab"]').nth(i);
      await tab.waitFor({ timeout: 5000 }).catch(() => {});
      if (!(await tab.count())) {
        record(run, 'errors', `tab ${i + 1} of "${key}" is gone`, screen);
        break;
      }
      const name = ((await tab.textContent()) ?? '').replace(/\s+/g, ' ').trim().slice(0, 40) || `tab ${i + 1}`;
      run.screen = screen;
      if (!(await tap(run, tab, `the "${name}" tab`))) continue;
      if ((await tab.getAttribute('aria-selected')) === 'false') record(run, 'errors', `the "${name}" tab didn't open`, screen);
      const here = `${screen} › ${name}`;
      await check(run, page, here, { shot: depth === 1 });
      if (depth === 1) {
        await expand(run, page, here);
        if (after) await after(here, name);
        await walkTabs(run, page, here, 2, key, null);
      }
    }
  }
}

/** Opens a few of the screen's closed disclosures (a day, a lesson, a task) and checks each. */
async function expand(run, page, screen) {
  const closed = page.locator('#main-content [aria-expanded="false"]:not([aria-haspopup]):not([role="tab"])');
  const opened = [];
  for (let i = 0; i < MAX_EXPAND; i++) {
    // The first one a finger can see (not one that only shows on hover) and that wasn't opened yet.
    const at = await closed.evaluateAll(
      (els, opened) =>
        els.findIndex((el) => {
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2 || getComputedStyle(el).pointerEvents === 'none') return false;
          for (let e = el; e && e !== document.body; e = e.parentElement) if (parseFloat(getComputedStyle(e).opacity) < 0.15) return false;
          return !opened.includes(el.getAttribute('aria-label') || el.textContent);
        }),
      opened,
    );
    if (at < 0) return;
    const el = closed.nth(at);
    const raw = (await el.getAttribute('aria-label')) || (await el.textContent()) || '';
    opened.push(raw);
    const name = raw.replace(/\s+/g, ' ').trim().slice(0, 40);
    if (!(await tap(run, el, `"${name}"`))) return;
    await check(run, page, `${screen} › open: ${name}`);
    // Close what it opened if it's a popover (a habit's edit or delete), so it doesn't cover the next one.
    if (await page.locator('[data-floating-ui-portal]').count()) await page.keyboard.press('Escape');
    if (run.dirty) await run.reset();
  }
}

/** Opens a dialog with the button named `name`, checks it, and closes it. */
async function openDialog(run, page, screen, name, reopen) {
  const button = page.locator('#main-content').getByRole('button', { name, exact: true }).first();
  if (!(await button.count())) {
    record(run, 'errors', `no "${name}" button to open its dialog`, screen);
    return;
  }
  if (!(await tap(run, button, `"${name}"`))) return;
  await page.waitForTimeout(500);
  await check(run, page, `${screen} › dialog: ${name}`, { shot: true });
  const isOpen = () => page.locator('[aria-modal="true"], .fixed.inset-0').filter({ visible: true }).count();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  if (await isOpen()) {
    await page.touchscreen.tap(4, 4);
    await page.waitForTimeout(300);
  }
  if (run.dirty || (await isOpen())) await reopen();
}

async function runDevice(browser, engine, name, lang) {
  const id = `${slug(name)}-${lang}`;
  const run = { id, screen: 'start', shots: 0, dir: path.join(OUT, id) };
  fs.rmSync(run.dir, { recursive: true, force: true });
  fs.mkdirSync(run.dir, { recursive: true });
  const { defaultBrowserType: _engine, ...device } = devices[name];
  const theme = lang === 'ar' ? 'light' : 'dark';
  const { page, context } = await openApp(browser, BASE, id, { section: 'todo', language: lang, theme, device });
  page.setDefaultTimeout(8000);
  page.on('pageerror', (e) => record(run, 'errors', `page error: ${e.message.slice(0, 200)}`, run.screen));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED|net::/.test(m.text())) record(run, 'errors', `console error: ${m.text().slice(0, 200)}`, run.screen);
  });
  const strings = await page.evaluate(async (lang) => (await import('/src/i18n/translations.ts')).translations[lang], lang);
  const t = (key) => key.split('.').reduce((o, k) => o?.[k], strings) ?? key;

  const dialogsFor = (section, tab) => DIALOGS.filter((d) => d.section === section && (tab ? d.tab?.test(tab) : !d.tab)).flatMap((d) => [...(d.keys ?? []).map(t), ...(d.names ?? [])]);

  /** A section's screen, its tabs, disclosures and dialogs. */
  async function visit(section, screen) {
    // The open tab is kept on the device, so a reload on the section comes back to it.
    run.reset = async () => {
      run.dirty = false;
      await reloadOn(page, section);
    };
    await check(run, page, screen, { shot: true });
    if (run.dirty) await run.reset();
    await expand(run, page, screen);
    for (const name of dialogsFor(section)) await openDialog(run, page, screen, name, run.reset);
    await walkTabs(run, page, screen, 1, null, async (here, tab) => {
      for (const name of dialogsFor(section, tab)) await openDialog(run, page, here, name, run.reset);
    });
  }

  try {
    await settle(page);
    // The app's chrome: the menu (every item reachable), the account menu, the notes button.
    run.screen = 'menu';
    if (!ONLY.length && await tap(run, page.locator('header button').first(), 'the menu button')) {
      await menuOpen(page);
      await check(run, page, 'menu', { shot: true, scope: 'aside' });
      await closeMenu(page);
      if (await page.locator('aside').evaluate((a) => a.getBoundingClientRect().left >= 0 && a.getBoundingClientRect().right <= document.documentElement.clientWidth)) {
        await tap(run, page.locator('header button').first(), 'the menu button (to close it)');
      }
    }
    if (!ONLY.length && await tap(run, page.getByRole('button', { name: t('a11y.accountMenu') }), 'the account menu')) {
      await check(run, page, 'account menu', { scope: '[data-floating-ui-portal]' });
      await tap(run, page.getByRole('button', { name: t('a11y.accountMenu') }), 'the account menu (to close it)');
    }
    if (!ONLY.length && await tap(run, page.getByRole('button', { name: t('notes.addMenu') }), 'the notes button')) {
      await check(run, page, 'notes menu', { scope: 'div:has(> div > button [class*="lucide-sticky-note"])' });
      await tap(run, page.getByRole('button', { name: t('notes.addMenu') }), 'the notes button (to close it)');
    }

    for (const section of SECTIONS) {
      if (ONLY.length && !ONLY.includes(section) && !(HUBS[section] ?? []).some((c) => ONLY.includes(c))) continue;
      run.screen = section;
      await reloadOn(page, 'todo');
      if (!(await goSection(run, page, section))) continue;
      await visit(section, section);
      for (const child of HUBS[section] ?? []) {
        if (ONLY.length && !ONLY.includes(section) && !ONLY.includes(child)) continue;
        await reloadOn(page, 'todo');
        if (!(await goSection(run, page, section))) break;
        const card = page.locator(`#main-content section[aria-labelledby$="-open"] button`).nth(HUBS[section].indexOf(child));
        if (!(await tap(run, card, `the ${child} card`))) continue;
        await page.waitForTimeout(300);
        if ((await activeSection(page)) !== child) {
          record(run, 'errors', `the ${child} card didn't open it`, section);
          continue;
        }
        const screen = `${section} › ${child === 'vocabulary' ? 'english' : child}`;
        await visit(child, screen);
        // The way back to the hub.
        run.screen = screen;
        if (await tap(run, page.locator('#main-content nav[aria-label] button').first(), `the way back from ${child}`)) {
          await page.waitForTimeout(300);
          if ((await activeSection(page)) !== section) record(run, 'errors', `the way back from ${child} didn't open ${section}`, screen);
        }
      }
    }
  } catch (e) {
    record(run, 'errors', `the run stopped: ${e.message.split('\n')[0]}`, run.screen);
  }
  await context.close();
  console.log(`${name} (${lang}, ${engine}): done`);
}

/** `vh` in the source: iPhone Safari's vh is the screen with its toolbar hidden. */
function safariUnits() {
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const hits = [];
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else if (/\.(tsx|css)$/.test(f.name) && !/\.test\./.test(f.name)) {
        fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
          // min-h-screen / min-height: 100vh only add a little scrolling; the rest can hide content.
          const m = line.replace(/min-h-screen|min-height:\s*100vh/g, '').match(/\b(?:h|max-h)-screen\b|[\w-]*\[[^\]]*\d+vh[^\]]*\]|\d+vh/g);
          if (m) hits.push(`${path.relative(root, p)}:${i + 1} — ${[...new Set(m)].join(', ')}`);
        });
      }
    }
  };
  walk(path.join(root, 'src'));
  return hits;
}

// ---- run ----
fs.mkdirSync(OUT, { recursive: true });
const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
const browsers = { chromium: await chromium.launch(launch) };
browsers.webkit = await webkit.launch().catch(() => null);
// Warm up the dev server: the first time a section's code is loaded, its styles arrive a moment later.
{
  const { page, context } = await openApp(browsers.chromium, BASE, 'warm-up', {});
  for (const id of ['todo', 'calendar', 'bookmarks', 'languages', 'skills', 'vocabulary', 'callcenter', 'sales', 'focus', 'wird', 'analytics', 'settings']) await navigate(page, id);
  await context.close();
}
const jobs = chosen.flatMap((name) => LANGS.map((lang) => [name, lang]));
const queue = [...jobs];
const started = Date.now();
const engines = {};
await Promise.all(
  Array.from({ length: Math.min(JOBS, jobs.length) }, async () => {
    for (let job = queue.shift(); job; job = queue.shift()) {
      const [name, lang] = job;
      const engine = devices[name].defaultBrowserType === 'webkit' && browsers.webkit ? 'webkit' : 'chromium';
      engines[name] = engine;
      await runDevice(browsers[engine], engine, name, lang);
    }
  }),
);
for (const b of Object.values(browsers)) await b?.close();

for (const line of safariUnits()) record({ id: 'source' }, 'safari', line, 'source');

// ---- report ----
const KINDS = [
  ['errors', 'Errors'],
  ['layout', 'Layout'],
  ['touch', 'Touch'],
  ['safari', 'iPhone Safari (from the source)'],
  ['minor', 'Minor'],
];
const counts = Object.fromEntries(KINDS.map(([k]) => [k, [...found.values()].filter((f) => f.kind === k).length]));
const lines = [
  `# Khalil on devices — ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
  '',
  `${screens} screens on ${chosen.length} devices × ${LANGS.join(' + ')} in ${Math.round((Date.now() - started) / 60000)} min.`,
  '',
  ...chosen.map((d) => `- ${d}: ${devices[d].viewport.width}×${devices[d].viewport.height}, ${engines[d] === 'webkit' ? 'WebKit' : 'Chromium'}${engines[d] !== devices[d].defaultBrowserType ? ` (emulating ${devices[d].defaultBrowserType === 'webkit' ? 'Safari' : 'Chrome'}: size, pixel ratio, user agent, touch)` : ''}`),
  '',
  KINDS.map(([k, title]) => `${title}: ${counts[k]}`).join(' · '),
];
for (const [kind, title] of KINDS) {
  const items = [...found.values()].filter((f) => f.kind === kind);
  if (!items.length) continue;
  lines.push('', `## ${title}`, '');
  for (const { what, where } of items.sort((a, b) => b.where.size - a.where.size)) {
    if (kind === 'safari') {
      lines.push(`- ${what}`);
      continue;
    }
    const runs = [...where.keys()];
    const shown = [...new Set([...where.values()].flatMap((s) => [...s]))];
    lines.push(`- ${what}`, `  - on: ${runs.length === jobs.length ? 'every device' : runs.join(', ')}`, `  - screens: ${shown.slice(0, 6).join(' | ')}${shown.length > 6 ? ` (+${shown.length - 6})` : ''}`);
  }
}
fs.writeFileSync(path.join(OUT, 'report.md'), lines.join('\n') + '\n');
console.log(lines.slice(0, 2 + chosen.length + 4).join('\n'));
console.log(`\nReport: ${path.join(OUT, 'report.md')}`);
const failed = KINDS.some(([k]) => k !== 'minor' && counts[k]);
process.exit(failed ? 1 : 0);

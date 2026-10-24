---
name: device-check
description: Checks that Khalil works on every phone and tablet, then fixes what breaks. It opens every section, tab and dialog on iPhones (SE to Pro Max), Android phones, a phone held sideways, Android tablets, iPads and an open fold, in Arabic and English, using touch. Use it when asked to test the app on mobile, iPhone, Android or tablet, to check screen sizes or responsiveness, or before shipping a layout change.
---

# Device check

`scripts/e2e/devices.mjs` uses the app the way a finger does on 10 devices × Arabic and
English. It goes through the menu, the hub cards, every tab and sub-tab (two levels), a few
disclosures per screen, the main dialogs, the account menu and the notes button. On every
screen it checks:

| kind | what it finds |
| --- | --- |
| errors | page errors, console errors, untranslated keys, the login page, a menu item, card, tab or button that didn't open or couldn't be tapped |
| layout | the page scrolls sideways, an element sticks out of the screen (with no scrolling or clipping parent), a control pushed out of the side of a box that hides overflow, text cut off without an ellipsis or squeezed under 16px wide, a dialog bigger than the screen (a popover in the page only has to fit, since the page scrolls to it) |
| touch | a control that only shows on hover (phones have no hover), a control that can't be tapped even when scrolled to (a fixed bar or button covers it), a target under 24×24 px with another one within 12px (WCAG 2.2), a text field under 16px (an iPhone zooms the page in when it's tapped) |
| safari | read from the source: `vh` units and `h-screen`. iPhone Safari measures them with its toolbar hidden, so the bottom of a `max-h-[90vh]` dialog can sit under the toolbar. Use `svh`, which is measured with the toolbar showing |
| minor | text under 11px, icon buttons with no name |

Devices: iPhone SE 320×568, Galaxy S24 360×780, iPhone 15 393×659, Pixel 7 412×839,
iPhone 15 Pro Max 430×739, iPhone 15 landscape 734×343, Galaxy Tab S9 640×1024, iPad Mini
768×1024, Galaxy Z Fold 7 984×1016, iPad Pro 11 landscape 1194×834. Together they cover the
narrowest phone, the most common Android width, a short screen, and Tailwind's sm/md/lg
breakpoints, each with touch.

## Run it

```bash
npm ci   # if node_modules is missing
# Playwright: in a Claude cloud session it's installed globally; link it, don't install it.
ln -sfn /usr/local/lib/node_modules_global/playwright node_modules/playwright
ln -sfn /usr/local/lib/node_modules_global/playwright-core node_modules/playwright-core
VITE_SUPABASE_URL=http://localhost:54321 VITE_SUPABASE_ANON_KEY=fake npx vite --port 5173 &
node scripts/e2e/devices.mjs http://localhost:5173 <scratch dir>/devices            # everything, ~30–40 min
node scripts/e2e/devices.mjs http://localhost:5173 <dir> --quick                     # iPhone SE, Galaxy S24, iPad Mini
node scripts/e2e/devices.mjs http://localhost:5173 <dir> --device "iPhone SE" --lang ar --section calendar
```

Options: `--quick`, `--device "<Playwright device name>"` (repeatable), `--lang ar|en`,
`--section <id>` (repeatable; `vocabulary`/`callcenter`/`sales` for the hubs' sections; skips
the menu checks), `--jobs N` (parallel devices, default 3). Run the full set in the
background and wait for it. Run nothing else heavy on the machine meanwhile: under load a page
can briefly go blank or a menu can still be sliding when it's tapped. When a finding appears on
one or two devices only, run that device and section alone before you fix anything. Write the output to the scratchpad, not the repo.

It writes `<dir>/report.md`, with findings grouped by kind, the devices they happen on and
the screens (`section › tab › sub-tab`, `› open: …` for a disclosure, `› dialog: …`). Each
`<dir>/<device>-<lang>/` folder has a screenshot of what the screen shows for each section and
tab, and for every screen with a problem. Look at the screenshots of the screens the report
names before fixing anything. Exit code 1 means something other than minor was found.

## Fixing what it finds

Fix the cause in the component, then run the same device, language and section again to
see it gone. Also look at the screenshots yourself: a check can pass on a screen that still
looks wrong. That's how the squeezed To-Do text was found, and it led to the squeezed-text
check. Before committing, run the full set and the project checks (CLAUDE.md →
Checks). Fixes that have worked here:

- **Only shows on hover**: add `[@media(hover:none)]:opacity-100` next to
  `group-hover:opacity-100` (and `[@media(hover:none)]:pointer-events-auto` if it has
  `pointer-events-none`), as `HabitsTracker`'s row actions do.
- **Sticks out in Arabic only**: `start-1/2 -translate-x-1/2` centers in English but not in
  Arabic, because `start` flips with direction and `translate-x` doesn't. Center a fixed card
  with `inset-x-4 mx-auto max-w-…`, or add `rtl:translate-x-1/2` (as `Tooltip` does).
- **`w-full` together with `mx-4`** on a fixed element is 32px wider than the screen. Use
  `inset-x-4` instead.
- **Something invisible widens the page** (a tooltip at `opacity-0` near the edge): an
  invisible element still takes room. Hide it with `hidden group-hover:block` instead.
- **A fixed card covers the controls it explains** on a short phone: put it in the page, next
  to them (the calendar's welcome card sits above the view buttons).
- **Text squeezed to nothing** (a task's text next to its badge and buttons): on a phone,
  put the row on two lines: `flex-wrap sm:flex-nowrap`, the text `basis-[calc(100%-2.5rem)]
  sm:basis-auto`, and `order-1`/`order-2 sm:order-none` for what goes on the second line, as the
  To-Do rows do.
- **Buttons cut off at the side of a card** (`overflow-hidden`): an `<input>` with `flex-1`
  doesn't shrink below its natural width (about 280px). Add `min-w-0` to it. For a grid, use
  `grid-cols-1` rather than no columns, because a `<select>` is as wide as its longest option.
- **Header or toolbar too wide at 320px**: hide the text of secondary buttons below 360px with
  `sr-only min-[360px]:not-sr-only`, so the button keeps its name.
- **Text field under 16px**: `index.css` raises fields to 16px on touch screens. If a field
  was set smaller on purpose, check the rule still reaches it.
- **Can't be tapped, covered by the + button or the focus chip**: the page needs bottom
  padding on phones so the last row can scroll clear of the fixed buttons.
- **`vh`**: use `svh` (`max-h-[90svh]`, `h-[calc(100svh-300px)]`, `h-svh`). It doesn't change
  while the toolbar slides away, so nothing jumps as the page scrolls.
- **Too small to tap**: increase the padding (`p-1` → `p-1.5`/`p-2`, `py-1` on a text button)
  rather than the icon. For a small checkbox, give its `<label>` `py-1` so the label is the
  target.
- **A strip in a flex-column dialog squeezed to nothing** on a short screen (a row that
  scrolls sideways): add `shrink-0` to it. A dialog with no `max-h-[90svh]` and
  `overflow-y-auto` is cut off on a phone held sideways.

Don't silence a check to make the report clean. When a finding is intended (a carousel
clipped on purpose, say), tell the owner and leave it in the report.

## What it can't see

The browser emulates each device in Chromium: its size, pixel ratio, user agent, touch and
no hover. When Playwright has WebKit installed, the iPhones and iPads run in WebKit (Safari's
engine) instead, and the report says which engine each device used. It doesn't cover real
Safari behaviour: the toolbar that collapses, the on-screen keyboard covering fields, safe
areas around the notch and home bar, or the app added to the home screen. Check those on a
real phone when a change touches fixed or bottom-anchored elements, dialogs or forms.
